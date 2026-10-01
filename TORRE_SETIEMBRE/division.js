/* ══════════════════════════════════════════════════════════════════
   PANTALLA DIVIDIDA — dos pestanas a la vez

   Cada pestana es una seccion .vista y la Torre ensena una sola. Aqui se
   ensenan dos: la de arriba (DIV.a) y la de abajo (DIV.b), cada una fija en
   su panel y con su propio desplazamiento. No se duplica nada: son las
   mismas secciones, asi que una pestana no puede estar en los dos paneles.

   irA() se envuelve (va despues de nuevo_js_nav.js, dentro del mismo cierre):
     · una pestana elegida arriba se abre en el panel marcado (DIV.act), el
       ultimo en que se hizo clic;
     · un salto desde dentro de una hoja (TABLERO, VER ↗) se abre en el OTRO
       panel, para no tapar la hoja de la que se salto.
   ══════════════════════════════════════════════════════════════════ */
var DIV = { on: false, a: '', b: '', act: 'b', ratio: 0.5, desdePes: false };
try { var r0 = parseFloat(localStorage.getItem('torreSet.divRatio')); if(r0 > 0.1 && r0 < 0.9) DIV.ratio = r0; } catch(e){}
var irABase = irA;

function divNombre(id){
  var v = $(id);
  return v ? (v.getAttribute('data-pes') || id).toUpperCase() : '—';
}
/* el alto del encabezado y del panel de arriba, en pixeles */
function divMedir(){
  if(!DIV.on) return;
  var nav = $('nav'), navH = nav ? Math.round(nav.getBoundingClientRect().bottom) : 0;
  var util = window.innerHeight - navH - 30;
  var hA = Math.round(Math.max(110, Math.min(util - 110, util * DIV.ratio)));
  document.body.style.setProperty('--navH', navH + 'px');
  document.body.style.setProperty('--hA', hA + 'px');
}
/* marcas que no repintan: panel activo, pestanas, rotulos de la barra, encabezado */
function divMarcas(){
  var act = DIV[DIV.act], otra = DIV[DIV.act === 'a' ? 'b' : 'a'];
  vistas.forEach(function(x){
    x.classList.toggle('divA', DIV.on && x.id === DIV.a);
    x.classList.toggle('divB', DIV.on && x.id === DIV.b);
    x.classList.toggle('divAct', DIV.on && x.id === act);
  });
  Array.prototype.forEach.call(document.querySelectorAll('#pestanas .pes'), function(b){
    var v = b.getAttribute('data-v');
    if(DIV.on && (v === DIV.a || v === DIV.b)) b.setAttribute('data-div', v === DIV.a ? '▲' : '▼');
    else b.removeAttribute('data-div');
    b.classList.toggle('divOtra', DIV.on && v === otra);
    if(DIV.on) b.setAttribute('aria-selected', v === act ? 'true' : 'false');
  });
  txt('divLadoA', '▲ ' + divNombre(DIV.a));
  txt('divLadoB', '▼ ' + divNombre(DIV.b));
  var la = $('divLadoA'), lb = $('divLadoB');
  if(la) la.classList.toggle('act', DIV.act === 'a');
  if(lb) lb.classList.toggle('act', DIV.act === 'b');
  var nav = $('nav'), va = $(act);
  if(nav && va) nav.classList.toggle('claro', va.classList.contains('luz'));
  if(DIV.on) vistaActual = act;
  var bt = $('divBtn');
  if(bt){
    bt.setAttribute('aria-pressed', DIV.on);
    bt.title = (DIV.on ? 'Volver a una sola pestaña' : 'Dividir la pantalla: dos pestañas a la vez') + ' (D)';
    bt.setAttribute('aria-label', bt.title);
  }
}
/* pone las dos secciones a la vista y arranca lo que cada una necesita */
function divAplicar(){
  var act = DIV[DIV.act], otra = DIV[DIV.act === 'a' ? 'b' : 'a'];
  /* la base pinta cada vista la primera vez; la activa va al final */
  irABase(otra); irABase(act);
  vistas.forEach(function(x){ x.classList.toggle('on', x.id === DIV.a || x.id === DIV.b); });
  var quiereTajo = [DIV.a, DIV.b].some(function(id){ var v = $(id); return v && v.getAttribute('data-tajo') === '1'; });
  var tj = $('tajo'), ci = $('cielo');
  if(tj) tj.classList.toggle('oculto', !quiereTajo);
  if(ci) ci.classList.toggle('oculto', !quiereTajo);
  try { tajoVivo = quiereTajo && !!rT; } catch(e){}
  try {
    enRampa = DIV.a === 'v-vivo' || DIV.b === 'v-vivo';
    if(enRampa) arrancarFlujo(); else pararFlujo(false);
  } catch(e){}
  try {
    estudioVisible = DIV.a === 'v-equipo' || DIV.b === 'v-equipo';
    if(estudioVisible) setTimeout(function(){ ajustarEstudio(); pedirCuadro(); }, 60);
  } catch(e){}
  divMarcas(); divMedir();
  /* las tablas de Propios y Alquilados toman el alto del panel, no el de la pantalla */
  try { hxAjustarAlto(); } catch(e){}
  setTimeout(function(){
    try { ajustarTajo(); } catch(e){}
    try { if(DIV.a === 'v-costos' || DIV.b === 'v-costos') pintarTendencia(); } catch(e){}
  }, 80);
  try { pedirCuadro(); } catch(e){}
}

irA = function(id){
  if(!DIV.on || !$(id)) return irABase(id);
  var desdePes = DIV.desdePes; DIV.desdePes = false;
  var otro = DIV.act === 'a' ? 'b' : 'a';
  if(id === DIV.a || id === DIV.b){
    /* ya esta a la vista: solo pasa a ser el panel activo */
    DIV.act = id === DIV.a ? 'a' : 'b';
    divMarcas();
    return;
  }
  if(desdePes) DIV[DIV.act] = id;
  else DIV[otro] = id;
  divAplicar();
  var v = $(id); if(v) v.scrollTop = 0;
};

function divPoner(si){
  if(si === DIV.on) return;
  if(si){
    DIV.on = true;
    DIV.a = vistaActual || (vistas[0] && vistas[0].id);
    DIV.b = DIV.a === 'v-tablero' ? 'v-propios' : 'v-tablero';
    if(!$(DIV.b)) DIV.b = vistas.filter(function(v){ return v.id !== DIV.a; })[0].id;
    DIV.act = 'b';
    document.body.classList.add('dividida');
    divAplicar();
  } else {
    var queda = DIV[DIV.act];
    DIV.on = false;
    document.body.classList.remove('dividida');
    vistas.forEach(function(x){ x.classList.remove('divA', 'divB', 'divAct'); x.scrollTop = 0; });
    document.body.style.removeProperty('--navH'); document.body.style.removeProperty('--hA');
    irABase(queda);
    divMarcas();
    try { requestAnimationFrame(hxAjustarAlto); } catch(e){}
  }
}

(function divisionIniciar(){
  var nav = $('nav'), cont = $('pestanas');
  if(!nav || !cont) return;
  /* el boton, junto al de quitar el encabezado */
  var b = document.createElement('button');
  b.type = 'button'; b.className = 'divBtn'; b.id = 'divBtn'; b.textContent = '⊟';
  nav.insertBefore(b, cont);
  b.addEventListener('click', function(){ divPoner(!DIV.on); });
  divMarcas();
  /* una pestana elegida arriba va al panel activo; un salto desde una hoja, al otro */
  cont.addEventListener('click', function(){ DIV.desdePes = true; }, true);
  document.addEventListener('click', function(){ DIV.desdePes = false; });
  /* el panel en que se hace clic pasa a ser el activo */
  document.addEventListener('pointerdown', function(ev){
    if(!DIV.on) return;
    var v = ev.target.closest ? ev.target.closest('.vista.on') : null;
    if(!v) return;
    var p = v.id === DIV.a ? 'a' : v.id === DIV.b ? 'b' : '';
    if(p && p !== DIV.act){ DIV.act = p; divMarcas(); }
  }, true);
  /* la barra: los rotulos eligen el panel activo; arrastrarla reparte el alto */
  esc_('divLadoA', 'click', function(){ DIV.act = 'a'; divMarcas(); });
  esc_('divLadoB', 'click', function(){ DIV.act = 'b'; divMarcas(); });
  esc_('divCambiar', 'click', function(){
    var t = DIV.a; DIV.a = DIV.b; DIV.b = t; DIV.act = DIV.act === 'a' ? 'b' : 'a';
    divMarcas(); divMedir();
  });
  esc_('divSalir', 'click', function(){ divPoner(false); });
  var barra = $('divisor'), arrastrando = false, y0 = 0, r0 = 0;
  if(barra){
    barra.addEventListener('pointerdown', function(ev){
      if(ev.target.closest && ev.target.closest('button')) return;
      arrastrando = true; y0 = ev.clientY; r0 = DIV.ratio;
      document.body.classList.add('divArrastre');
      try { barra.setPointerCapture(ev.pointerId); } catch(e){}
      ev.preventDefault();
    });
    barra.addEventListener('pointermove', function(ev){
      if(!arrastrando) return;
      var navH = parseFloat(getComputedStyle(document.body).getPropertyValue('--navH')) || 0;
      var util = window.innerHeight - navH - 30;
      DIV.ratio = Math.max(0.12, Math.min(0.88, r0 + (ev.clientY - y0) / util));
      divMedir();
    });
    var soltar = function(){
      if(!arrastrando) return;
      arrastrando = false;
      document.body.classList.remove('divArrastre');
      try { localStorage.setItem('torreSet.divRatio', String(DIV.ratio)); } catch(e){}
      try { ajustarEstudio(); ajustarTajo(); pedirCuadro(); } catch(e){}
      try { if(DIV.a === 'v-costos' || DIV.b === 'v-costos') pintarTendencia(); } catch(e){}
    };
    barra.addEventListener('pointerup', soltar);
    barra.addEventListener('pointercancel', soltar);
    /* doble clic: mitad y mitad */
    barra.addEventListener('dblclick', function(ev){
      if(ev.target.closest && ev.target.closest('button')) return;
      DIV.ratio = 0.5; divMedir();
      try { localStorage.setItem('torreSet.divRatio', '0.5'); } catch(e){}
    });
  }
  window.addEventListener('resize', divMedir);
  /* el encabezado cambia de alto (quitarlo, pantalla completa): se vuelve a medir */
  if(window.ResizeObserver) new ResizeObserver(divMedir).observe(nav);
  /* la tecla D divide o une, salvo mientras se escribe */
  document.addEventListener('keydown', function(ev){
    if(ev.key !== 'd' && ev.key !== 'D') return;
    if(ev.ctrlKey || ev.metaKey || ev.altKey || ev.repeat) return;
    var t = ev.target, tag = t && t.tagName;
    if(tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
    ev.preventDefault();
    divPoner(!DIV.on);
  });
})();
