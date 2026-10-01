/* ══════════════════════════════════════════════════════════════════
   BURBUJA DE HERRAMIENTAS

   Flota sobre cualquier pestana. Se arrastra por la cabecera (o por el
   circulo cuando esta minimizada), se minimiza y se oculta; Alt+H la
   vuelve a mostrar. Posicion y estado se recuerdan en este navegador.

   CALCULAR  se elige una cifra de la pantalla (o se escribe), una
             operacion y otra cifra. La burbuja va pidiendo cada paso.
   SUMAR     cada cifra que se toca se suma: cuenta, suma, promedio,
             minimo y maximo, como la barra de estado de Excel.

   Leer una cifra de la pantalla: se toma el texto de lo tocado y se
   convierte (US$, separadores de miles, k y MM, porcentajes, el signo
   menos tipografico). Mientras se elige, el clic no llega a la tabla.
   ══════════════════════════════════════════════════════════════════ */
/* la primera vez aparece minimizada, para no tapar nada */
var BZ = { h: 'calc', a: null, b: null, op: null, espera: null, lista: [], hist: [], min: true, oculta: false, x: null, y: null };

function bzGuardar(){
  try { localStorage.setItem('torreSet.bz', JSON.stringify({ min: BZ.min, oculta: BZ.oculta, x: BZ.x, y: BZ.y, h: BZ.h })); } catch(e){}
}
function bzLeer(){
  try {
    var o = JSON.parse(localStorage.getItem('torreSet.bz') || 'null');
    if(o){ BZ.min = !!o.min; BZ.oculta = !!o.oculta; BZ.x = o.x; BZ.y = o.y; if(o.h === 'suma') BZ.h = 'suma'; }
  } catch(e){}
}

/* ---------- de texto a numero ---------- */
function bzNumero(txt){
  var t = String(txt || '').replace(/−/g, '-').replace(/ /g, ' ');
  var m = t.match(/([-+])?\s*(?:US\$\s*)?(\d[\d,]*(?:\.\d+)?)\s*(MM|k)?\s*(%)?/i);
  if(!m) return null;
  var v = parseFloat(m[2].replace(/,/g, ''));
  if(!isFinite(v)) return null;
  if(m[3]) v *= /mm/i.test(m[3]) ? 1e6 : 1e3;
  if(m[1] === '-') v = -v;
  return { v: v, pct: !!m[4] };
}
function bzFmt(v){
  if(v === null || v === undefined || !isFinite(v)) return '—';
  var d = Math.abs(v) >= 1000 ? 0 : Math.abs(v) >= 1 ? 2 : 4;
  return v.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: d });
}
/* lo tocado y su etiqueta: la fila y la columna si es una tabla, el rotulo si es una cifra suelta */
function bzLeerElemento(el){
  var n = el, pasos = 0;
  while(n && n !== document.body && pasos < 5){
    var t = (n.textContent || '').trim();
    if(t && t.length <= 48 && /\d/.test(t)){
      var num = bzNumero(t);
      if(num) return { el: n, v: num.v, pct: num.pct, et: bzEtiqueta(n) };
    }
    n = n.parentElement; pasos++;
  }
  return null;
}
/* el texto de un elemento sin sus botones, flechas ni simbolos de color */
function bzTextoLimpio(el){
  var c = el.cloneNode(true);
  Array.prototype.forEach.call(c.querySelectorAll('button, .sub, .car, .sm, .xlC'), function(x){ x.remove(); });
  return (c.textContent || '').trim().replace(/\s+/g, ' ');
}
function bzEtiqueta(el){
  var td = el.closest ? el.closest('td') : null;
  if(td){
    var tr = td.parentElement, tabla = td.closest('table'), fila = bzTextoLimpio(tr.children[0]).slice(0, 34), col = '';
    /* en Propios y Alquilados la columna se nombra con su grupo: «Costo real › Total» */
    var m = tabla && tabla.id ? tabla.id.match(/^hx-tabla-([PA])$/) : null;
    if(m && td.cellIndex > 0 && HX[m[1]].vis){
      var id = HX[m[1]].vis[td.cellIndex - 1];
      if(id) col = hxTituloCol(HX[m[1]], id);
    } else {
      var cabs = tabla ? tabla.querySelectorAll('thead tr') : [];
      if(cabs.length){
        var th = cabs[cabs.length - 1].children[td.cellIndex];
        if(th) col = bzTextoLimpio(th);
      }
    }
    return fila + (col ? ' · ' + col : '');
  }
  var caja = el.closest ? el.closest('.tbCf, .granTotal > div, .cifraIt, .tbNube, .roIt, .ratio') : null;
  if(caja){
    var l = caja.querySelector('.l, .gl, .rn, b');
    if(l) return bzTextoLimpio(l).slice(0, 40);
  }
  return 'cifra de la pantalla';
}
function bzMarcar(el){
  el.classList.add('bzMarca');
  setTimeout(function(){ el.classList.remove('bzMarca'); }, 900);
}

/* ---------- las operaciones ---------- */
var BZ_OPS = [
  { c: '+', t: '+', f: function(a, b){ return a + b; } },
  { c: '-', t: '−', f: function(a, b){ return a - b; } },
  { c: '*', t: '×', f: function(a, b){ return a * b; } },
  { c: '/', t: '÷', f: function(a, b){ return b ? a / b : null; } },
  { c: 'pc', t: 'A/B%', f: function(a, b){ return b ? a / b * 100 : null; }, pct: 1,
    d: 'qué porcentaje de B es A' },
  { c: 'var', t: 'Δ%', f: function(a, b){ return a ? (b - a) / Math.abs(a) * 100 : null; }, pct: 1,
    d: 'cuánto cambia de A a B' }
];
function bzOp(c){ for(var i = 0; i < BZ_OPS.length; i++) if(BZ_OPS[i].c === c) return BZ_OPS[i]; return null; }
function bzResultado(){
  var o = bzOp(BZ.op);
  if(!o || !BZ.a || !BZ.b) return null;
  return { v: o.f(BZ.a.v, BZ.b.v), pct: !!o.pct, o: o };
}

/* ---------- pintado ---------- */
function bzPintar(){
  var bz = $('bz');
  if(!bz) return;
  bz.hidden = BZ.oculta;
  bz.classList.toggle('min', BZ.min);
  var volver = $('bzVolver'); if(volver) volver.hidden = !BZ.oculta;
  Array.prototype.forEach.call(bz.querySelectorAll('.bzTools [data-h="calc"], .bzTools [data-h="suma"]'), function(b){
    b.setAttribute('aria-pressed', b.getAttribute('data-h') === BZ.h);
  });
  document.body.classList.toggle('bzElige', !!BZ.espera && !BZ.oculta && !BZ.min);
  var c = $('bzCuerpo');
  if(BZ.h === 'suma') return bzPintarSuma(c);
  var fila = function(k, v){
    var espera = BZ.espera === k;
    return '<div class="bzFila' + (espera ? ' espera' : '') + '"><span class="let">' + k.toUpperCase() + '</span>'
      + '<input type="text" inputmode="decimal" id="bz-' + k + '" value="' + (v ? esc(bzFmt(v.v)) : '') + '" placeholder="toca una cifra o escribe" aria-label="Valor ' + k.toUpperCase() + '">'
      + '<button type="button" class="bzBtn" data-elige="' + k + '">' + (espera ? 'ELIGIENDO…' : 'ELEGIR') + '</button>'
      + '<span class="bzOrigen">' + (v ? esc(v.et) : '&nbsp;') + '</span></div>';
  };
  var aviso = !BZ.a ? (BZ.espera === 'a' ? 'Toca en la pantalla la <b>primera cifra</b> (A), o escríbela.'
                                          : 'Pulsa <b>ELEGIR</b> junto a A y toca una cifra de la pantalla, o escríbela.')
            : !BZ.op ? 'Elige la <b>operación</b>.'
            : !BZ.b ? (BZ.espera === 'b' ? 'Toca la <b>segunda cifra</b> (B), o escríbela.'
                                         : 'Pulsa <b>ELEGIR</b> junto a B y toca otra cifra, o escríbela.')
            : '';
  var r = bzResultado();
  var html = (aviso ? '<div class="bzAviso">' + aviso + ' <span style="color:var(--tinta-3)">Esc cancela.</span></div>' : '')
    + fila('a', BZ.a)
    + '<div class="bzOps" role="group" aria-label="Operación">' + BZ_OPS.map(function(o){
        return '<button type="button" data-op="' + o.c + '" aria-pressed="' + (BZ.op === o.c) + '" title="' + (o.d || o.t) + '">' + o.t + '</button>';
      }).join('') + '</div>'
    + fila('b', BZ.b);
  if(r){
    html += '<div class="bzRes"><div class="v' + (r.v < 0 ? ' neg' : '') + '">' + bzFmt(r.v) + (r.pct ? '%' : '') + '</div>'
      + '<div class="f">' + esc(bzFmt(BZ.a.v)) + ' ' + esc(r.o.t) + ' ' + esc(bzFmt(BZ.b.v)) + (r.o.d ? ' · ' + r.o.d : '') + '</div>'
      + '<div class="bzAcc"><button type="button" class="bzBtn" data-acc="copiar">COPIAR</button>'
      + '<button type="button" class="bzBtn" data-acc="seguir" title="El resultado pasa a ser A, para seguir operando">USAR COMO A</button>'
      + '<button type="button" class="bzBtn" data-acc="limpiar">LIMPIAR</button></div></div>';
  } else if(BZ.a || BZ.b){
    html += '<div class="bzAcc"><button type="button" class="bzBtn" data-acc="limpiar">LIMPIAR</button></div>';
  }
  if(BZ.hist.length){
    html += '<div class="bzHist">' + BZ.hist.map(function(x){ return '<div title="' + esc(x) + '">' + esc(x) + '</div>'; }).join('') + '</div>';
  }
  c.innerHTML = html;
}
function bzPintarSuma(c){
  var l = BZ.lista, n = l.length, s = 0, mn = null, mx = null;
  l.forEach(function(x){ s += x.v; mn = mn === null ? x.v : Math.min(mn, x.v); mx = mx === null ? x.v : Math.max(mx, x.v); });
  c.innerHTML = '<div class="bzAviso' + (n ? ' ok' : '') + '">' + (n ? 'Sigue tocando cifras para sumarlas.' : 'Toca en la pantalla las <b>cifras que quieras sumar</b>.')
    + ' <span style="color:var(--tinta-3)">Esc deja de elegir.</span></div>'
    + '<div class="bzLista">' + l.map(function(x, i){
        return '<span class="bzChip" title="' + esc(x.et) + '">' + esc(bzFmt(x.v)) + '<button type="button" data-quita="' + i + '" aria-label="Quitar">×</button></span>';
      }).join('') + '</div>'
    + '<div class="bzStats"><div>CANTIDAD<b>' + n + '</b></div><div>SUMA<b>' + bzFmt(s) + '</b></div>'
    + '<div>PROMEDIO<b>' + (n ? bzFmt(s / n) : '—') + '</b></div><div>MÍN · MÁX<b>' + (n ? bzFmt(mn) + ' · ' + bzFmt(mx) : '—') + '</b></div></div>'
    + '<div class="bzAcc">' + (n ? '<button type="button" class="bzBtn" data-acc="copiarSuma">COPIAR SUMA</button>' : '')
    + '<button type="button" class="bzBtn" data-acc="' + (BZ.espera ? 'pausa' : 'reanuda') + '">' + (BZ.espera ? 'DEJAR DE ELEGIR' : 'ELEGIR MÁS') + '</button>'
    + (n ? '<button type="button" class="bzBtn" data-acc="limpiarSuma">LIMPIAR</button>' : '') + '</div>';
}

/* ---------- el flujo: cada paso pide el siguiente ---------- */
function bzSiguiente(){
  if(BZ.h !== 'calc') return;
  BZ.espera = !BZ.a ? 'a' : !BZ.op ? null : !BZ.b ? 'b' : null;
  var r = bzResultado();
  if(r && r.v !== null){
    var linea = bzFmt(BZ.a.v) + ' ' + r.o.t + ' ' + bzFmt(BZ.b.v) + ' = ' + bzFmt(r.v) + (r.pct ? '%' : '');
    if(BZ.hist[0] !== linea){ BZ.hist.unshift(linea); BZ.hist = BZ.hist.slice(0, 4); }
  }
}
function bzCopiar(texto){
  var dice = function(m){ var e = $('bzCuerpo').querySelector('.bzRes .f, .bzStats'); if(e) e.insertAdjacentHTML('afterend', '<div class="bzHist">' + m + '</div>'); };
  var no = function(){ dice('No se pudo copiar solo: selecciona ' + esc(texto) + ' y copia a mano.'); };
  try { navigator.clipboard.writeText(texto).then(function(){ dice('Copiado: ' + esc(texto)); }, no); } catch(e){ no(); }
}

/* ---------- elegir en la pantalla ---------- */
document.addEventListener('click', function(ev){
  if(!BZ.espera || BZ.oculta || BZ.min) return;
  var bz = $('bz'), t = ev.target;
  if(bz && bz.contains(t)) return;
  if(t.closest && t.closest('#nav')) return;                 /* las pestanas siguen funcionando */
  var got = bzLeerElemento(t);
  ev.preventDefault(); ev.stopPropagation();                 /* el clic no despliega ni selecciona */
  if(!got) return;
  bzMarcar(got.el);
  if(BZ.h === 'suma'){ BZ.lista.push({ v: got.v, et: got.et }); bzPintar(); return; }
  BZ[BZ.espera] = { v: got.v, et: got.et };
  bzSiguiente(); bzPintar();
}, true);

document.addEventListener('keydown', function(ev){
  if(ev.key === 'Escape' && BZ.espera){ BZ.espera = null; bzPintar(); }
  if(ev.altKey && (ev.key === 'h' || ev.key === 'H')){ ev.preventDefault(); BZ.oculta = !BZ.oculta; bzGuardar(); bzPintar(); }
});

/* ---------- arrastrar ---------- */
function bzUbicar(){
  var bz = $('bz');
  if(!bz || bz.hidden) return;
  var w = bz.offsetWidth, h = bz.offsetHeight;
  /* el ancho util sin la barra de desplazamiento, para que no quede un borde fuera */
  var W = document.documentElement.clientWidth, H = document.documentElement.clientHeight;
  if(BZ.x === null || BZ.y === null){ BZ.x = W - w - 24; BZ.y = 170; }
  BZ.x = Math.max(6, Math.min(W - w - 6, BZ.x));
  BZ.y = Math.max(6, Math.min(H - Math.min(h, 60) - 6, BZ.y));
  bz.style.left = BZ.x + 'px'; bz.style.top = BZ.y + 'px';
}
function bzArrastre(asa, alSoltarSinMover){
  var ini = null;
  asa.addEventListener('pointerdown', function(ev){
    if(ev.target.closest('button') && ev.target !== asa) return;   /* los botones de la cabecera no arrastran */
    ini = { x: ev.clientX, y: ev.clientY, bx: BZ.x, by: BZ.y, movio: false };
    try { asa.setPointerCapture(ev.pointerId); } catch(e){}
  });
  asa.addEventListener('pointermove', function(ev){
    if(!ini) return;
    var dx = ev.clientX - ini.x, dy = ev.clientY - ini.y;
    if(Math.abs(dx) + Math.abs(dy) > 4) ini.movio = true;
    if(!ini.movio) return;
    BZ.x = ini.bx + dx; BZ.y = ini.by + dy; bzUbicar();
  });
  asa.addEventListener('pointerup', function(){
    if(!ini) return;
    var movio = ini.movio; ini = null;
    if(movio){ bzGuardar(); asa._arrastro = true; setTimeout(function(){ asa._arrastro = false; }, 0); }
    else if(alSoltarSinMover) alSoltarSinMover();
  });
}

(function bzIniciar(){
  var bz = $('bz');
  if(!bz) return;
  bzLeer();
  /* el boton para volver a mostrarla, en la fila de pestanas */
  var v = document.createElement('button');
  v.type = 'button'; v.className = 'bzVolver'; v.id = 'bzVolver'; v.textContent = 'x÷';
  v.title = 'Mostrar las herramientas (Alt+H)';
  var nav = $('nav'); if(nav) nav.insertBefore(v, $('pestanas'));
  v.addEventListener('click', function(){ BZ.oculta = false; BZ.min = false; bzGuardar(); bzPintar(); bzUbicar(); });

  bzArrastre($('bzCab'));
  var cara = $('bzCara');
  bzArrastre(cara);
  cara.addEventListener('click', function(){
    if(cara._arrastro) return;
    BZ.min = false; bzGuardar(); bzPintar(); bzUbicar();
  });
  esc_('bzMin', 'click', function(){ BZ.min = true; BZ.espera = null; bzGuardar(); bzPintar(); bzUbicar(); });
  esc_('bzCerrar', 'click', function(){ BZ.oculta = true; BZ.espera = null; bzGuardar(); bzPintar(); });

  bz.querySelector('.bzTools').addEventListener('click', function(ev){
    var b = ev.target.closest('[data-h]');
    if(!b) return;
    var h = b.getAttribute('data-h');
    if(h === 'enc'){ var e = $('encBtn'); if(e) e.click(); return; }
    if(h === 'arriba'){ window.scrollTo({ top: 0, behavior: REDUCIR ? 'auto' : 'smooth' }); return; }
    BZ.h = h;
    BZ.espera = h === 'suma' ? 'multi' : null;
    if(h === 'calc') bzSiguiente();
    bzGuardar(); bzPintar(); bzUbicar();
  });

  var cuerpo = $('bzCuerpo');
  cuerpo.addEventListener('click', function(ev){
    var t = ev.target.closest('button');
    if(!t) return;
    if(t.hasAttribute('data-elige')){ BZ.espera = t.getAttribute('data-elige'); bzPintar(); return; }
    if(t.hasAttribute('data-op')){ BZ.op = t.getAttribute('data-op'); bzSiguiente(); bzPintar(); return; }
    if(t.hasAttribute('data-quita')){ BZ.lista.splice(parseInt(t.getAttribute('data-quita'), 10), 1); bzPintar(); return; }
    var acc = t.getAttribute('data-acc'), r = bzResultado();
    if(acc === 'copiar' && r) bzCopiar(bzFmt(r.v) + (r.pct ? '%' : ''));
    if(acc === 'seguir' && r && r.v !== null){ BZ.a = { v: r.v, et: 'resultado anterior' }; BZ.b = null; BZ.op = null; bzSiguiente(); bzPintar(); }
    if(acc === 'limpiar'){ BZ.a = BZ.b = BZ.op = null; bzSiguiente(); bzPintar(); }
    if(acc === 'copiarSuma'){ var s = 0; BZ.lista.forEach(function(x){ s += x.v; }); bzCopiar(bzFmt(s)); }
    if(acc === 'limpiarSuma'){ BZ.lista = []; BZ.espera = 'multi'; bzPintar(); }
    if(acc === 'pausa'){ BZ.espera = null; bzPintar(); }
    if(acc === 'reanuda'){ BZ.espera = 'multi'; bzPintar(); }
  });
  /* escribir a mano tambien vale */
  cuerpo.addEventListener('change', function(ev){
    var t = ev.target;
    if(!t.id || t.id.indexOf('bz-') !== 0) return;
    var k = t.id.slice(3), num = bzNumero(t.value);
    BZ[k] = num ? { v: num.v, et: 'escrito a mano' } : null;
    bzSiguiente(); bzPintar();
  });

  if(BZ.h === 'calc') bzSiguiente(); else BZ.espera = null;
  /* al abrir la pagina no se queda esperando un clic: se pide al usar la herramienta */
  BZ.espera = null;
  bzPintar(); bzUbicar();
  window.addEventListener('resize', bzUbicar);
})();
