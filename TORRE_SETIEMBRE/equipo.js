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
