var eqActual = null, sysActual = null;

/* el tajo sigue de cerca a una unidad en la vista En vivo; en Inicio queda
   el plano general. UNID/ciclosTotal alimentan al render conservado. */
var enRampa = false, ciclosTotal = 0, UNID = [];
function pintarRampa(){}

/* ══════════════════════════════════════════════════════════════════
   12 · panel de sistemas y detalle del equipo
   ══════════════════════════════════════════════════════════════════ */
function pintarSistemas(e){
  var el = $('sistemas');
  if(!el) return;
  var ss = sysRango(e);
  var max = ss.length ? ss[0].v : 1;
  el.innerHTML = ss.map(function(s){
    return '<button class="sis' + (sysActual === s.c ? ' sel' : '') + '" data-c="' + esc(s.c) + '">'
      + '<span class="c">' + esc(s.c) + '</span>'
      + '<span class="n">' + esc(s.n) + '</span>'
      + '<span class="v">' + fmt(s.v) + '</span>'
      + '<span class="b"><i style="width:' + (s.v / max * 100).toFixed(1) + '%"></i></span></button>';
  }).join('');
  Array.prototype.forEach.call(el.querySelectorAll('.sis'), function(b){
    b.addEventListener('click', function(){ elegirSistema(b.getAttribute('data-c')); });
  });

  /* Cuánto del costo del equipo llega a explicarse por componente. El
     resto —alquiler, depreciación, combustible, mano de obra— no pertenece
     a ninguno, así que estos números NUNCA suman el total. Decirlo aquí
     evita la lectura de que falta plata o de que algo está mal sumado. */
  var suma = 0;
  ss.forEach(function(s){ suma += s.v; });
  var tot = eqR(e).v;
  txt('sis-nota', ss.length
      ? ss.length + (ss.length === 1 ? ' CONJUNTO' : ' CONJUNTOS')
        + ' CON COSTO EN ' + rotuloRango() + ' · SUMA US$ ' + fmt(Math.round(suma))
      : 'SIN DETALLE POR CONJUNTO EN ' + rotuloRango());

  var av = $('sis-cobertura');
  if(av){
    if(!ss.length && !(e.sys || []).length){
      av.hidden = false;
      av.innerHTML = '<b>Este equipo no tiene detalle por conjunto.</b> El análisis de RyM '
        + 'cubre ' + (META.nEqDet || 77) + ' equipos de los ' + TODOS.length
        + ' del libro; el resto sólo tiene su costo total.';
    } else if(ss.length){
      var pc = tot ? suma / Math.abs(tot) * 100 : 0;
      /* La misma cuenta sobre todo el libro: dice si lo que se ve es el
         desfase del recorte o el comportamiento del equipo. */
      var sumaT = 0, totT = 0, _i;
      (e.sys || []).forEach(function(s){ sumaT += (s.v || 0); });
      for(_i = 0; _i < (e.m || []).length; _i++) totT += e.m[_i] || 0;
      var pcT = totT ? sumaT / Math.abs(totT) * 100 : 0;
      var corto = !todoElPeriodo();

      av.hidden = false;
      av.classList.toggle('alerta', pc > 100);
      if(pc > 100){
        /* Los conjuntos se pasan del total: no es un error de suma, son dos
           fuentes con calendarios distintos. Decir aqui lo de alquiler y
           depreciacion seria falso, porque no falta costo, sobra. */
        av.innerHTML = '<b>Cuidado: estas dos cifras no son comparables.</b> En '
          + esc(rotuloRango()) + ' el libro mayor le carga <b>US$ ' + fmt(Math.round(tot))
          + '</b>, pero por conjunto se registran <b>US$ ' + fmt(Math.round(suma)) + '</b> — '
          + 'un <b>' + pc.toFixed(0) + '%</b>. No falta ni sobra plata: son <b>dos fuentes '
          + 'con calendarios distintos</b>. RyM anota el trabajo cuando se ejecuta y el libro '
          + 'cuando se contabiliza, y entre uno y otro hay meses de diferencia.'
          + (corto ? ' Sobre todo el periodo este equipo va al <b>' + pcT.toFixed(0)
                     + '%</b>: el recorte a un tramo corto es lo que agranda el desfase.'
                   : '')
          + ' <b>Usa estos números para ver en qué componente se va el gasto, no para '
          + 'cuadrar contra el total.</b>';
      } else {
        av.innerHTML = '<b>Esto no suma el costo del equipo, y no debería.</b> En '
          + esc(rotuloRango()) + ' el libro mayor le carga <b>US$ ' + fmt(Math.round(tot))
          + '</b> y por conjunto se explican <b>US$ ' + fmt(Math.round(suma)) + '</b> ('
          + pc.toFixed(0) + '%). La diferencia es alquiler, depreciación, combustible y mano de '
          + 'obra, que no pertenecen a ningún componente. Este bloque sale del análisis de RyM '
          + 'y sigue al periodo, pero no a los filtros de RO, centro de coste, cuenta ni tipo '
          + 'de gasto: esas dimensiones no existen en esa fuente.';
      }
    } else { av.hidden = true; }
  }
}

function filaOT(o){
  return '<div class="ot"><span class="o1">' + esc(o.ot) + '</span>'
    + '<span class="o3">' + esc(o.d) + '</span>'
    + '<span class="o2">' + esc(o.txt) + '</span>'
    + '<span class="o4">' + esc(o.pm || '—') + ' · ' + esc(SD[o.sis] || o.sis || '—')
    + (o.v ? ' · US$ ' + fmt(o.v) : '') + '</span></div>';
}

/* Las ordenes del equipo dentro del periodo, de mayor a menor costo. */
function otsDelEquipo(e){
  return (e.ots || []).filter(function(o){
    return o.mi === undefined || (o.mi >= rangoA && o.mi <= rangoB);
  }).sort(function(a, b){ return (b.v || 0) - (a.v || 0); });
}

/* De que fuente son las ordenes que se estan viendo. */
function fuenteOts(lista){
  var c = 0, r = 0;
  lista.forEach(function(o){ if(o.f === 'C') c++; else r++; });
  if(c && r) return 'CONSOLIDADO SHGN (' + c + ') + RESUMEN ANALISIS (' + r + ')';
  if(c) return 'CONSOLIDADO 0 SHGN_RO EQUIPOS · ÓRDENES REALES DE SAP';
  if(r) return 'RESUMEN ANALISIS · SÓLO LAS 40 MÁS CARAS DE CADA MES';
  return 'SIN ÓRDENES EN EL PERIODO';
}

function pintarOrdenesEq(e){
  var tb = $('q-ots');
  if(!tb) return;
  var lista = otsDelEquipo(e);
  txt('q-ots-nota', fuenteOts(lista) + ' · ' + rotuloRango());

  tb.innerHTML = lista.slice(0, 60).map(function(o){
    return '<tr' + (o.sis && o.sis === sysActual ? ' class="sel"' : '') + '>'
      + '<td class="o">' + esc(o.ot) + '</td>'
      + '<td>' + esc(o.d || '—') + '</td>'
      + '<td><span class="pmc ' + esc(o.pm) + '">' + esc(o.pm || '—') + '</span></td>'
      + '<td class="cj">' + esc(o.sis || '—') + '</td>'
      + '<td class="d">' + esc(SD[o.sis] ? o.txt + ' — ' + SD[o.sis] : (o.txt || '—')) + '</td>'
      + '<td class="nn fuerte">' + fmt(o.v || 0) + '</td></tr>';
  }).join('') || '<tr><td colspan="6" style="padding:26px;text-align:center">'
      + 'Este equipo no tiene órdenes registradas en ' + esc(rotuloRango())
      + '. El detalle de mantenimiento sólo cubre la sede SHGN.</td></tr>';

  /* el reparto por conjunto sale de esas mismas ordenes, no de otra tabla:
     asi los dos bloques siempre suman lo mismo */
  var acc = {};
  lista.forEach(function(o){
    var k = o.sis || 'SIN CONJUNTO';
    acc[k] = (acc[k] || 0) + (o.v || 0);
  });
  var arr = Object.keys(acc).map(function(k){
    return { n: (SD[k] || k), c: k, v: acc[k] };
  }).filter(function(a){ return a.v !== 0; })
    .sort(function(a, b){ return b.v - a.v; });
  barras($('q-cj'), arr.slice(0, 10), {
    extra: function(a){
      var t = arr.reduce(function(s, x){ return s + x.v; }, 0) || 1;
      var p = null;
      arr.forEach(function(x){ if(x.n === a.n) p = x; });
      return (p ? esc(p.c) + ' · ' : '') + (a.v / t * 100).toFixed(1) + '%';
    }
  });
  txt('q-cj-nota', arr.length
      ? arr.length + ' CONJUNTOS INTERVENIDOS · SUMA US$ '
        + fmt(arr.reduce(function(s, x){ return s + x.v; }, 0))
      : 'SIN ÓRDENES EN EL PERIODO');
}

function pintarDetalle(e){
  var el = $('detalle');
  if(!el) return;
  var s = null, ss = sysRango(e);
  ss.forEach(function(x){ if(x.c === sysActual) s = x; });
  if(!s){
    var ots = (e.ots || []).filter(function(o){
      return o.mi === undefined || (o.mi >= rangoA && o.mi <= rangoB); }).slice(0, 6);
    el.innerHTML = '<div class="dt">' + esc(e.id) + '</div>'
      + '<div class="dm">Elige una pieza del modelo para ver su detalle</div>'
      + '<p class="dp">' + esc(e.fam) + ' · ' + esc(e.mod || '') + '. '
      + 'Acumula US$ ' + fmt(eqR(e).v) + ' en ' + fmt(eqR(e).hm) + ' horas máquina.</p>'
      + (ots.length ? '<div class="ots">' + ots.map(filaOT).join('') + '</div>' : '');
    return;
  }
  var rel = (e.ots || []).filter(function(o){
    return o.sis === s.c && (o.mi === undefined || (o.mi >= rangoA && o.mi <= rangoB)); });
  el.innerHTML = '<div class="dt">' + esc(s.n) + '</div>'
    + '<div class="dm">' + esc(s.c) + ' · ' + esc(e.id) + ' · ' + esc(e.mod || '') + '</div>'
    + '<div class="dstats">'
    +   '<div><div class="l">COSTO</div><div class="v">' + fmt(s.v) + '</div></div>'
    +   '<div><div class="l">% DEL EQUIPO</div><div class="v">' + (s.v / e.v * 100).toFixed(1) + '%</div></div>'
    +   '<div><div class="l">ÓRDENES</div><div class="v">' + (rel.length || '—') + '</div></div>'
    + '</div>'
    + (rel.length ? '<div class="ots">' + rel.map(filaOT).join('') + '</div>'
       : '<p class="dp">El consumo de este sistema llegó por salidas de almacén sin una orden entre las de mayor costo.</p>');
}

function ponerModo(quiere3d, forzar2d){
  var est = $('estudio'), esq = $('esquema');
  if(!est || !esq) return;
  modelo3d = quiere3d && HAY3D && !!rE && !forzar2d;
  est.hidden = !modelo3d;
  esq.hidden = modelo3d;
  att('v-3d', 'aria-pressed', modelo3d);
  att('v-2d', 'aria-pressed', !modelo3d);
  var b3 = $('v-3d'); if(b3) b3.disabled = !!forzar2d || !rE;
  var bg = $('v-giro'); if(bg) bg.disabled = !modelo3d;
  if(modelo3d) setTimeout(function(){ ajustarEstudio(); pedirCuadro(); }, 30);
}

function elegirSistema(c){
  sysActual = (sysActual === c ? null : c);
  var e = byId[eqActual];
  pintarCamion(e); pintarEsquema(e); pintarLlantas(e); pintarSistemas(e);
  pintarDetalle(e); pintarOrdenesEq(e); pintarSepEquipo(e);
  pedirCuadro();
}

function elegirEquipo(id){
  if(!byId[id]) return;
  eqActual = id; sysActual = null;
  var e = byId[id];
  var sel = $('selector');
  if(sel) sel.value = id;
  htm('ficha', '<b>' + esc(e.mod || '—') + '</b> · ' + esc(e.fam)
    + ' · ' + esc((e.prov || '').slice(0, 28)));
  txt('q-costo', 'US$ ' + fmtK(eqR(e).v));
  txt('q-costo-d', fmt(eqR(e).v) + ' dólares en ' + rotuloRango());
  txt('q-hrs', fmt(eqR(e).hm));
  txt('q-cph', 'US$ ' + eqR(e).cph.toFixed(1));
  var cls = $('q-cph');
  if(cls) cls.className = 'v ' + (eqR(e).cph > cphR() ? 'alza' : 'bien');
  txt('q-cph-d', eqR(e).cph > cphR() ? 'sobre el promedio de flota' : 'bajo el promedio de flota');
  txt('q-sis', sysRango(e).length);
  txt('q-ot', otsDelEquipo(e).length);
  /* el camion y la escala de calor toman el color de la marca */
  pintarCarroceria(camion, esMarcaAmarilla(e.marca));
  ponerRampa(e.marca);
  ponerModo(e.fam === 'ACARREO' && modelo3d, e.fam !== 'ACARREO');
  pintarCamion(e); pintarEsquema(e); pintarLlantas(e); pintarSistemas(e);
  pintarDetalle(e); pintarOrdenesEq(e); pintarSepEquipo(e);
  pedirCuadro();
}

/* ══════════════════════════════════════════════════════════════════
   13 · navegacion por pestanas
   ══════════════════════════════════════════════════════════════════ */
var vistas = Array.prototype.slice.call(document.querySelectorAll('.vista'));
var vistaActual = vistas.length ? vistas[0].id : '';
var pintado = {};

function irA(id){
  var v = document.getElementById(id);
  if(!v) return;
  vistaActual = id;
  vistas.forEach(function(x){ x.classList.toggle('on', x.id === id); });
  Array.prototype.forEach.call($('pestanas').querySelectorAll('.pes'), function(b){
    b.setAttribute('aria-selected', b.getAttribute('data-v') === id ? 'true' : 'false');
  });

  /* el tajo solo se ve en las vistas oscuras que lo piden */
  var quiereTajo = v.getAttribute('data-tajo') === '1';
  var tj = $('tajo'), ci = $('cielo');
  if(tj) tj.classList.toggle('oculto', !quiereTajo);
  if(ci) ci.classList.toggle('oculto', !quiereTajo);
  tajoVivo = quiereTajo && !!rT;
  var nav = $('nav');
  if(nav) nav.classList.toggle('claro', v.classList.contains('luz'));

  enRampa = (id === 'v-vivo');
  if(enRampa) arrancarFlujo(); else pararFlujo(false);
  estudioVisible = (id === 'v-equipo');
  if(estudioVisible) setTimeout(function(){ ajustarEstudio(); pedirCuadro(); }, 30);

  /* cada vista se pinta la primera vez que se abre */
  if(!pintado[id]){
    pintado[id] = true;
    if(id === 'v-inicio')    pintarInicio();
    if(id === 'v-flota')     pintarFlota();
    if(id === 'v-costos')    pintarTendencia();
    if(id === 'v-ordenes')   pintarOrdenes();
    if(id === 'v-articulos') pintarArticulos();
    if(id === 'v-ficha')     pintarFicha();
    if(id === 'v-setiembre') abrirSetiembre();
    if(id === 'v-filtros')   pintarFiltros();
  }
  window.scrollTo(0, 0);
  pedirCuadro();
}

(function construirPestanas(){
  var cont = $('pestanas');
  if(!cont) return;
  cont.innerHTML = vistas.map(function(v, i){
    return '<button class="pes" role="tab" data-v="' + v.id + '" aria-selected="'
      + (i === 0 ? 'true' : 'false') + '"><i>' + String(i).padStart(2, '0') + '</i>'
      + esc(v.getAttribute('data-pes')) + '</button>';
  }).join('');
  Array.prototype.forEach.call(cont.querySelectorAll('.pes'), function(b){
    b.addEventListener('click', function(){ irA(b.getAttribute('data-v')); });
  });
})();

/* ══════════════════════════════════════════════════════════════════
   13b · pantalla completa

   La torre corre dentro de un marco, asi que el host puede no permitir
   la API. Se intenta igual y, si la rechaza, se dice como hacerlo con la
   tecla del navegador en vez de dejar un boton que no responde.
   ══════════════════════════════════════════════════════════════════ */
function elPantalla(){
  return document.fullscreenElement || document.webkitFullscreenElement || null;
}
function pedirPantalla(el){
  var f = el.requestFullscreen || el.webkitRequestFullscreen;
  return f ? f.call(el) : null;
}
function salirPantalla(){
  var f = document.exitFullscreen || document.webkitExitFullscreen;
  if(f) f.call(document);
}
function hayPantalla(){
  var el = document.documentElement;
  return !!(el.requestFullscreen || el.webkitRequestFullscreen);
}

function avisarPantalla(txt){
  var a = $('avisoPantalla');
  if(!a) return;
  a.innerHTML = txt + '<button type="button">cerrar</button>';
  a.hidden = false;
  a.querySelector('button').addEventListener('click', function(){ a.hidden = true; });
  clearTimeout(avisarPantalla.t);
  avisarPantalla.t = setTimeout(function(){ a.hidden = true; }, 12000);
}

function marcarPantalla(){
  var dentro = !!elPantalla();
  att('btnPantalla', 'aria-pressed', dentro);
  txt('btnPantallaTx', dentro ? 'SALIR' : 'PANTALLA COMPLETA');
  att('btnPantalla', 'title', dentro ? 'Salir de pantalla completa' : 'Ver a pantalla completa');
  document.body.classList.toggle('enPantalla', dentro);
  /* el lienzo del tajo y el del estudio miden el hueco al dibujarse */
  setTimeout(function(){
    try { ajustarTajo(); ajustarEstudio(); } catch(err){}
    pedirCuadro();
  }, 120);
}

/* Donde no hay API de pantalla completa —el caso del iPhone, que no la
   expone ni con prefijo— lo unico que puede hacer la pagina es apartar su
   propia cabecera. No es pantalla completa y no se vende como tal. */
function ponerDespejado(si){
  document.body.classList.toggle('despejado', si);
  txt('btnPantallaTx', si ? 'SALIR' : 'PANTALLA COMPLETA');
  att('btnPantalla', 'aria-pressed', si);
  setTimeout(function(){
    try { ajustarTajo(); ajustarEstudio(); } catch(err){}
    try { if(vistaActual === 'v-costos') pintarTendencia(); } catch(err){}
    pedirCuadro();
  }, 120);
}
(function salidaDespejado(){
  var s = document.createElement('button');
  s.type = 'button'; s.className = 'salirDespejado';
  s.textContent = '✕ SALIR';
  s.addEventListener('click', function(){ ponerDespejado(false); });
  document.body.appendChild(s);
})();

(function botonPantalla(){
  var b = $('btnPantalla');
  if(!b) return;
  var esTactil = window.matchMedia && window.matchMedia('(pointer:coarse)').matches;
  var teclaSugerida = /Mac/.test(navigator.platform || '') ? 'control + comando + F' : 'F11';
  if(!hayPantalla()){
    b.addEventListener('click', function(){
      var si = !document.body.classList.contains('despejado');
      ponerDespejado(si);
      if(si){
        avisarPantalla(esTactil
          ? 'Este navegador no deja que una página ocupe la pantalla. Se apartó la '
            + 'cabecera para ganar sitio; el resto lo controla el navegador.'
          : 'Este navegador no expone la pantalla completa a la página. Se apartó la '
            + 'cabecera; para la pantalla completa de verdad usa <b>' + teclaSugerida + '</b>.');
      }
    });
    return;
  }
  b.addEventListener('click', function(){
    if(elPantalla()) return salirPantalla();
    var p = pedirPantalla(document.documentElement);
    if(p && p.catch){
      p.catch(function(){
        /* el marco la rechazo: se da al menos el modo despejado */
        ponerDespejado(true);
        avisarPantalla('La página está dentro de un marco que no permite pantalla completa. '
          + 'Se apartó la cabecera; para la pantalla completa ábrela en su propia pestaña'
          + (esTactil ? '.' : ' o usa <b>' + teclaSugerida + '</b>.'));
      });
    }
  });
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(function(ev){
    document.addEventListener(ev, marcarPantalla);
  });
})();

/* ══════════════════════════════════════════════════════════════════
   14 · bucle de dibujo
   ══════════════════════════════════════════════════════════════════ */
var pedido = false, ultimoT = 0;
function pedirCuadro(){ if(!pedido){ pedido = true; requestAnimationFrame(bucle); } }
function bucle(t){
  pedido = false;
  var dt = Math.min(48, t - ultimoT || 16); ultimoT = t;
  var sigue = pasoContadores(dt);
  if(tajoVivo && rT){ renderTajo(t, 0.55); sigue = true; }
  if(estudioVisible && modelo3d && rE){
    renderEstudio(t);
    sigue = sigue || (gira && !REDUCIR) || arrastra;
  }
  if(sigue) pedirCuadro();
}
window.addEventListener('resize', function(){
  clearTimeout(window.__tr);
  window.__tr = setTimeout(function(){
    ajustarTajo(); ajustarEstudio();
    /* el lienzo del grafico cambia de forma entre telefono y escritorio */
    try { if(vistaActual === 'v-costos') pintarTendencia(); } catch(err){}
    pedirCuadro();
  }, 140);
});

/* ══════════════════════════════════════════════════════════════════
   15 · controles
   ══════════════════════════════════════════════════════════════════ */
esc_('v-3d', 'click', function(){ ponerModo(true); });
esc_('v-2d', 'click', function(){ ponerModo(false); });
esc_('v-giro', 'click', function(){
  gira = !gira; this.setAttribute('aria-pressed', gira); pedirCuadro();
});
/* El flujo late solo mientras la hoja En vivo esta a la vista, y se para
   al salir. El tope existe porque el acumulado que se muestra es el real
   mas lo simulado: sin freno, un rato abierto lo despegaria del dato. */
var TOPE_SIM = 64, tempVivo = null;

function latir(){
  if(!vivo) return;
  nuevoMovimiento();
  if(movHoy >= TOPE_SIM){ pararFlujo(true); return; }
  tempVivo = setTimeout(latir, 1600 + Math.random() * 2700);
}
function arrancarFlujo(){
  if(vivo || REDUCIR || movHoy >= TOPE_SIM) return;
  vivo = true;
  cls('punto', 'punto');
  txt('reloj', 'recibiendo movimientos');
  txt('reloj-2', 'FLUJO EN CURSO');
  tempVivo = setTimeout(latir, 800);
}
function pararFlujo(agotado){
  vivo = false;
  if(tempVivo){ clearTimeout(tempVivo); tempVivo = null; }
  cls('punto', 'punto off');
  txt('reloj', 'sin movimientos nuevos');
  txt('reloj-2', agotado ? 'FLUJO COMPLETO' : 'FLUJO EN PAUSA');
}

/* ══════════════════════════════════════════════════════════════════
   16 · arranque
   ══════════════════════════════════════════════════════════════════ */
htm('selector', EQ.map(function(e){
  return '<option value="' + esc(e.id) + '">' + esc(e.id + ' — ' + (e.mod || e.fam)) + '</option>';
}).join(''));
esc_('selector', 'change', function(){ elegirEquipo(this.value); });

pintarTicker();
pintarPulso();

if(HAY3D){
  try { iniciarEstudio(); } catch(err){ HAY3D = false; rE = null; }
}
if(HAY3D){
  try { iniciarTajo(); } catch(err){ rT = null; var tj0 = $('tajo'); if(tj0) tj0.style.display = 'none'; }
}
if(!rE){
  var est0 = $('estudio'); if(est0) est0.hidden = true;
  var b30 = $('v-3d'); if(b30) b30.disabled = true;
  var bg0 = $('v-giro'); if(bg0) bg0.disabled = true;
}

var primero = null;
EQ.forEach(function(e){ if(!primero && e.fam === 'ACARREO') primero = e.id; });
elegirEquipo(primero || EQ[0].id);

for(var i0 = 0; i0 < 12; i0++) nuevoMovimiento();
vivo = false;
cls('punto', 'punto off');
txt('reloj', 'sin movimientos nuevos');
txt('reloj-2', 'FLUJO EN PAUSA');
if(REDUCIR){ gira = false; att('v-giro', 'aria-pressed', 'false'); }

txt('periodoAct', rotuloRango());
txt('proyAct', rotuloProy());
irA('v-inicio');
window.addEventListener('load', function(){ ajustarTajo(); ajustarEstudio(); pedirCuadro(); });
