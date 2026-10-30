/* ══════════════════════════════════════════════════════════════════
   HOJA EQUIPO — todos los equipos en el selector, y un buscador

   EQ solo trae los equipos con movimiento en el periodo y con los filtros
   puestos: es la base de todas las sumas y no se toca. Para la hoja Equipo
   se completan aparte, en byId, los demas equipos del consolidado con sus
   cifras en cero, asi se puede ver cualquier maquina (y su modelo 3D)
   aunque no haya tenido costo. En el desplegable van en un segundo grupo.
   ══════════════════════════════════════════════════════════════════ */
/* Filtros en cascada: las opciones de cada desplegable de flota salen de los
   equipos que pasan los DEMAS filtros (no el propio, para poder cambiarlo).
   Asi, al elegir Propio, Flota solo ofrece las flotas con equipos propios, y
   en pocos pasos queda un equipo. Lo usa refrescarFiltros (Tendencia y Equipo). */
function universoPara(campo){
  var vals = [], f = { tipo: tipoFiltro, fam: famFiltro, mod: modFiltro, prov: provFiltro };
  var todo = { tipo: 'TODOS', fam: 'TODAS', mod: 'TODOS', prov: 'TODOS' };
  TODOS.forEach(function(e){
    if(!sedeOk(e.sede)) return;
    if(proyFiltro !== 'TODOS' && e.proys && e.proys.indexOf(proyFiltro) < 0) return;
    for(var k in f) if(k !== campo && f[k] !== todo[k] && e[k] !== f[k]) return;
    if(marcaFiltro !== 'TODAS' && e.marca !== marcaFiltro) return;
    if(clasifFiltro !== 'TODAS' && e.clasif !== clasifFiltro) return;
    var v = e[campo];
    if(v && vals.indexOf(v) < 0) vals.push(v);
  });
  /* lo elegido sigue a la vista aunque los demas filtros lo dejen sin equipos */
  if(f[campo] !== todo[campo] && vals.indexOf(f[campo]) < 0) vals.push(f[campo]);
  return vals.sort();
}

var EQ_SIN_MOV = [];
function completarEquipos(){
  var vistos = {};
  EQ.forEach(function(e){ vistos[e.id] = 1; });
  EQ_SIN_MOV = [];
  TODOS.forEach(function(at){
    if(vistos[at.id]) return;
    /* los sin costo tambien obedecen a los filtros de flota */
    if(!pasaEquipo(at)) return;
    var e = { id: at.id, fam: at.fam, tipo: at.tipo, mod: at.mod, marca: at.marca,
              prov: at.prov, clasif: at.clasif, proys: at.proys,
              sys: at.sys || [], ots: at.ots || [],
              m: CEROS.slice(), mh: CEROS.slice(), v: 0, hm: 0, cph: 0, sinMov: true };
    byId[at.id] = e;
    EQ_SIN_MOV.push(e);
  });
  EQ_SIN_MOV.sort(function(a, b){ return a.id.localeCompare(b.id, 'es', { numeric: true }); });
}
function textoEq(e){ return e.id + ' — ' + (e.mod || e.fam); }
function llenarSelectorEq(){
  /* los filtros de flota de esta hoja (sufijo 5, como los de Tendencia '3') */
  construirFiltros('5');
  periodoEq();
  var nota = $('eqFilNota');
  if(!nota && $('filtrosEq5')){
    nota = document.createElement('p'); nota.className = 'nota'; nota.id = 'eqFilNota';
    $('filtrosEq5').appendChild(nota);
  }
  completarEquipos();
  if(nota){
    nota.textContent = (EQ.length + EQ_SIN_MOV.length) + ' EQ.';
    nota.title = (EQ.length + EQ_SIN_MOV.length) + ' equipos con estos filtros'
      + (hayFiltroEq() ? ' · el filtro rige en todas las pestañas' : '');
  }
  var op = function(e){ return '<option value="' + esc(e.id) + '">' + esc(textoEq(e)) + '</option>'; };
  htm('selector', '<optgroup label="CON COSTO EN EL PERIODO (' + EQ.length + ')">' + EQ.map(op).join('') + '</optgroup>'
    + (EQ_SIN_MOV.length ? '<optgroup label="SIN COSTO EN EL PERIODO (' + EQ_SIN_MOV.length + ')">'
       + EQ_SIN_MOV.map(op).join('') + '</optgroup>' : ''));
  /* sugerencias del buscador: el codigo y, al lado, modelo, clase y tipo */
  htm('listaEqSel', EQ.concat(EQ_SIN_MOV).map(function(e){
    return '<option value="' + esc(e.id) + '">' + esc([e.mod, e.clasif, e.tipo].filter(Boolean).join(' · ')) + '</option>';
  }).join(''));
}

/* buscar: primero el codigo exacto; si no, el primero cuyo codigo, modelo,
   clase o marca contenga lo escrito (sin importar espacios ni mayusculas) */
function buscarEquipo(q){
  var n = String(q || '').toUpperCase().replace(/\s+/g, '');
  if(!n) return null;
  var todos = EQ.concat(EQ_SIN_MOV), i, e;
  for(i = 0; i < todos.length; i++) if(todos[i].id.toUpperCase() === n) return todos[i].id;
  var pega = function(s){ return String(s || '').toUpperCase().replace(/\s+/g, ''); };
  for(i = 0; i < todos.length; i++){ e = todos[i]; if(pega(e.id).indexOf(n) === 0) return e.id; }
  for(i = 0; i < todos.length; i++){
    e = todos[i];
    if((pega(e.id) + '|' + pega(e.mod) + '|' + pega(e.clasif) + '|' + pega(e.marca) + '|' + pega(e.fam)).indexOf(n) >= 0) return e.id;
  }
  return null;
}
(function buscadorEquipo(){
  var inp = $('buscaEq');
  if(!inp) return;
  var ir = function(final){
    var id = buscarEquipo(inp.value);
    inp.classList.toggle('mal', !!inp.value && !id && final);
    if(id && (final || byId[id] && id.toUpperCase() === inp.value.toUpperCase().trim())){
      elegirEquipo(id);
      if(final){ inp.value = id; inp.select(); }
    }
  };
  /* al elegir una sugerencia o escribir un codigo completo, se va directo;
     con Enter, al mejor parecido */
  inp.addEventListener('input', function(){ inp.classList.remove('mal'); ir(false); });
  inp.addEventListener('change', function(){ ir(true); });
  inp.addEventListener('keydown', function(ev){ if(ev.key === 'Enter'){ ev.preventDefault(); ir(true); } });
  /* si se elige en el desplegable, lo escrito ya no corresponde */
  var sel = $('selector');
  if(sel) sel.addEventListener('change', function(){ inp.value = ''; inp.classList.remove('mal'); });
})();

/* ── las órdenes en un bloque desplegable (30/10) ──
   Cerrado al entrar: la cabecera dice cuántas órdenes son, cuántas correctivas
   (PM01) y cuánto suman, con la misma lista de la tabla (otsDelEquipo). Al
   cambiar de equipo queda abierto o cerrado como se dejó. Cerrado, su
   contenido es inert: el tabulador no entra a una tabla que no se ve. */
function otsResumen(lista){
  var r = $('otsRes');
  if(!r) return;
  var tot = 0, corr = 0;
  lista.forEach(function(o){ tot += o.v || 0; if(o.pm === 'PM01') corr++; });
  r.innerHTML = lista.length
    ? '<b>' + fmt(lista.length) + '</b> órdenes · <b>' + fmt(corr) + '</b> correctivas · <b>US$ ' + fmt(tot) + '</b>'
      + (lista.length > 60 ? ' <span>· la tabla muestra las 60 de mayor costo</span>' : '')
    : 'Sin órdenes en ' + esc(rotuloRango());
}
(function otsDesplegable(){
  var b = $('otsCab'), caja = $('otsEq'), dentro = $('otsIn');
  if(!b || !caja) return;
  b.addEventListener('click', function(){
    var abre = b.getAttribute('aria-expanded') !== 'true';
    b.setAttribute('aria-expanded', abre ? 'true' : 'false');
    caja.classList.toggle('abierto', abre);
    if(dentro) dentro.inert = !abre;
    txt('otsVerTxt', abre ? 'OCULTAR' : 'VER LISTA');
  });
})();

/* ── al cambiar de equipo, las cifras de arriba se renuevan con un fundido corto ──
   Sin él, diez números cambian de golpe y no se nota que cambiaron. Sólo con la
   hoja a la vista y sin «reducir movimiento». */
elegirEquipo = (function(base){
  return function(id){
    var antes = eqActual;
    base.apply(this, arguments);
    if(id === antes || !estudioVisible || !document.body.animate) return;
    if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    Array.prototype.forEach.call(document.querySelectorAll('#v-equipo .eqCifras .v'), function(v, i){
      v.animate([{ opacity: 0.2, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }],
                { duration: 240, delay: (i % 5) * 18, easing: 'cubic-bezier(.23,1,.32,1)', fill: 'backwards' });
    });
  };
})(elegirEquipo);

/* ── el periodo en la fila de filtros (30/10) ──
   El mismo DESDE – HASTA de Tendencia y Filtros (construirPanelMeses, sufijo 5;
   ponerRango lo mantiene al día): como ellos, manda en toda la torre. Va justo
   después del proyecto. */
function periodoEq(){
  var cont = $('filtrosEq5');
  if(!cont || $('mesDesde5')) return;
  var g = document.createElement('div');
  g.className = 'fl flPer';
  g.innerHTML = 'PERIODO<span class="perSel"><select id="mesDesde5" aria-label="Periodo desde"></select>'
    + '<span aria-hidden="true">–</span><select id="mesHasta5" aria-label="Periodo hasta"></select></span>';
  var sede = cont.querySelector('.sedeF');
  cont.insertBefore(g, sede ? sede.nextSibling : cont.firstChild);
  construirPanelMeses('5');
}

/* ── buscador, equipo y ayuda en la misma fila de los filtros (30/10) ──
   La hoja no lleva título: arranca en una sola fila con proyecto, periodo,
   filtros, buscador, el equipo elegido y su ficha, y al final «?» con la
   explicación de la hoja (el mismo <details> de siempre, abierto como globo).
   Así el camión entra en la primera pantalla. Se mueven los mismos nodos,
   con sus id y sus eventos. */
(function equipoEnFiltros(){
  var fila = document.querySelector('#v-equipo .selEq'), b = $('buscaEq');
  if(!fila || !b) return;
  var caja = document.createElement('div');
  caja.className = 'eqElige';
  b.placeholder = 'Buscar';
  [b.closest('label'), $('selector'), $('sinMovEq'), $('ficha')].forEach(function(n){ if(n) caja.appendChild(n); });
  var ayuda = document.querySelector('#v-equipo .tituloV .expl');
  if(ayuda){
    var sm = ayuda.querySelector('summary');
    if(sm){ sm.title = 'Cómo se lee esta hoja'; sm.setAttribute('aria-label', 'Cómo se lee esta hoja'); }
    caja.appendChild(ayuda);
  }
  fila.appendChild(caja);
})();

/* ── el detalle del costado, sin órdenes (30/10) ──
   Las órdenes ya están en el panel desplegable de abajo, que marca las del
   conjunto elegido: aquí queda la ficha del equipo o del conjunto y un botón
   que abre ese panel en sus órdenes. Reemplaza a la pintarDetalle de
   nuevo_js_nav.js (ensamblar.py le cambia el nombre a pintarDetalleTorre). */
function pintarDetalle(e){
  var el = $('detalle');
  if(!el) return;
  var s = null;
  sysRango(e).forEach(function(x){ if(x.c === sysActual) s = x; });
  if(!s){
    el.innerHTML = '<div class="dt">' + esc(e.id) + '</div>'
      + '<div class="dm">' + esc([e.fam, e.mod].filter(Boolean).join(' · ')) + '</div>'
      + '<p class="dp">Acumula US$ ' + fmt(eqR(e).v) + ' en ' + fmt(eqR(e).hm) + ' horas máquina. '
      + 'Elige una pieza del modelo o un conjunto de la lista para ver su detalle.</p>';
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
    + (rel.length
       ? '<button type="button" class="verOts" id="verOts">VER SUS ' + rel.length + ' ÓRDENES <i aria-hidden="true">↓</i></button>'
       : '<p class="dp">El consumo de este sistema llegó por salidas de almacén sin una orden entre las de mayor costo.</p>');
}
/* abre el panel de órdenes (si está cerrado) y lleva la vista a la primera del conjunto */
document.addEventListener('click', function(ev){
  if(!ev.target.closest || !ev.target.closest('#verOts')) return;
  var cab = $('otsCab'), panel = $('otsEq');
  if(!cab || !panel) return;
  var abierto = cab.getAttribute('aria-expanded') === 'true';
  if(!abierto) cab.click();
  setTimeout(function(){
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    var fila = document.querySelector('#q-ots tr.sel'), caja = fila && fila.closest('.tablaEnv');
    if(fila && caja) caja.scrollTop = Math.max(0, fila.offsetTop - 44);
  }, abierto ? 0 : 320);
});
