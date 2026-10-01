/* ══════════════════════════════════════════════════════════════════
   18 · FILTROS — la sala de máquinas

   Aquí viven los cortes que no merecen ocupar sitio en las pestañas
   principales: centro de coste, cuenta contable, tipo de gasto, marca,
   clasificación y propio/alquilado. Todos son filtros de primera clase
   sobre la tabla de hechos, valen para toda la torre y se anuncian en el
   inicio para que nadie se olvide de que están puestos.

   Sirve además para auditar: los ajustes predefinidos reproducen recortes
   concretos del Excel, como el de la dinámica "Prom Tarifa acumulado",
   que deja fuera las lineas sin centro de coste.
   ══════════════════════════════════════════════════════════════════ */

/* ---------- desplegable genérico de selección múltiple ---------- */
function multi(id, vocab, obtener, poner, pesos, rotulo){
  var caja = $(id + 'Caja'), bt = $(id + 'Btn');
  if(!caja || caja.getAttribute('data-listo')) return;
  caja.setAttribute('data-listo', '1');
  var sel = obtener();
  caja.innerHTML = vocab.map(function(x){
    return '<label class="despIt"><input type="checkbox" value="' + esc(x) + '"'
      + (sel.indexOf(x) >= 0 ? ' checked' : '') + '>'
      + '<span>' + esc(x) + '</span>'
      + '<span class="v">US$ ' + fmtK((pesos || {})[x] || 0) + '</span></label>';
  }).join('')
    + '<div class="despPie"><button type="button" data-a="todo">TODOS</button>'
    + '<button type="button" data-a="nada">NINGUNO</button>'
    + '<button type="button" data-a="invertir">INVERTIR</button></div>';

  function leer(){
    var out = [];
    vocab.forEach(function(x){
      var y = caja.querySelector('input[value="' + x.replace(/"/g, '&quot;') + '"]');
      if(y && y.checked) out.push(x);
    });
    return out;
  }
  Array.prototype.forEach.call(caja.querySelectorAll('input'), function(x){
    x.addEventListener('change', function(){ poner(leer()); });
  });
  Array.prototype.forEach.call(caja.querySelectorAll('.despPie button'), function(b){
    b.addEventListener('click', function(){
      var a = b.getAttribute('data-a'), act = leer();
      if(a === 'todo') poner(vocab.slice());
      else if(a === 'nada') poner([]);
      else poner(vocab.filter(function(x){ return act.indexOf(x) < 0; }));
    });
  });
  bt.addEventListener('click', function(ev){
    ev.stopPropagation();
    var abierto = bt.getAttribute('aria-expanded') === 'true';
    bt.setAttribute('aria-expanded', !abierto);
    caja.hidden = abierto;
  });
  caja.addEventListener('click', function(ev){ ev.stopPropagation(); });
  document.addEventListener('click', function(){
    if(!caja.hidden){ caja.hidden = true; bt.setAttribute('aria-expanded', 'false'); }
  });
  multi.marcar = multi.marcar || [];
  multi.marcar.push(function(){
    var s = obtener();
    Array.prototype.forEach.call(caja.querySelectorAll('input'), function(x){
      x.checked = s.indexOf(x.value) >= 0;
    });
    txt(id + 'Rot', rotulo());
  });
}

function marcarMultis(){
  (multi.marcar || []).forEach(function(f){ f(); });
}

/* ---------- ajustes predefinidos ----------
   Cada uno reproduce un recorte concreto, para poder comparar contra el
   Excel sin ir marcando casillas a mano. */
var AJUSTES = [
  { c: 'todo', n: 'TODO EL LIBRO',
    d: 'Sin ningún filtro: US$ 180.63 MM en los diecisiete meses.' },
  { c: 'dinamica', n: 'COMO LA DINÁMICA «PROM TARIFA ACUMULADO»',
    d: 'Deja fuera las líneas sin centro de coste, que es lo que esa tabla esconde.' },
  { c: 'combustible', n: 'SÓLO COMBUSTIBLE',
    d: 'La cuenta CONSUMO SUM COMBUST, que sólo aparece imputada en agosto 2026.' },
  { c: 'sincombustible', n: 'SIN COMBUSTIBLE',
    d: 'Todo menos esa cuenta, para comparar agosto contra los demás meses.' },
  { c: 'propio', n: 'SÓLO FLOTA PROPIA', d: 'Equipos de San Martín, sin los alquilados.' },
  { c: 'alquilado', n: 'SÓLO FLOTA ALQUILADA', d: 'Los equipos de terceros.' }
];

function cuentaCombustible(){
  var out = [];
  CUENTAS.forEach(function(c){ if(c.indexOf('COMBUST') >= 0) out.push(c); });
  return out;
}

function aplicarAjuste(c){
  if(c === 'todo'){
    roSel = ROS.slice(); cecoSel = CECOS.slice();
    cuentaSel = CUENTAS.slice(); gastoSel = GASTOSD.slice();
    famFiltro = 'TODAS'; modFiltro = 'TODOS'; provFiltro = 'TODOS';
    marcaFiltro = 'TODAS'; clasifFiltro = 'TODAS'; tipoFiltro = 'TODOS';
    proyFiltro = 'TODOS'; eqFiltro = 'TODOS';
  } else if(c === 'dinamica'){
    cecoSel = CECOS.filter(function(x){ return x !== META.sinCeco; });
  } else if(c === 'combustible'){
    cuentaSel = cuentaCombustible();
  } else if(c === 'sincombustible'){
    var comb = cuentaCombustible();
    cuentaSel = CUENTAS.filter(function(x){ return comb.indexOf(x) < 0; });
  } else if(c === 'propio'){
    tipoFiltro = 'PROPIO';
  } else if(c === 'alquilado'){
    tipoFiltro = 'ALQUILADO';
  }
  rehacerTodo();
}

function construirAjustes(){
  var el = $('f-ajustes');
  if(!el || el.getAttribute('data-listo')) return;
  el.setAttribute('data-listo', '1');
  el.innerHTML = AJUSTES.map(function(a){
    return '<button class="ajuste" type="button" data-c="' + esc(a.c) + '">'
      + '<b>' + esc(a.n) + '</b><span>' + esc(a.d) + '</span></button>';
  }).join('');
  Array.prototype.forEach.call(el.querySelectorAll('.ajuste'), function(b){
    b.addEventListener('click', function(){ aplicarAjuste(b.getAttribute('data-c')); });
  });
}

/* ---------- desplegables simples de atributo ---------- */
function construirSelectorFino(id, campo, lista, valor, todos){
  var el = $(id);
  if(!el) return;
  if(!el.getAttribute('data-listo')){
    el.setAttribute('data-listo', '1');
    el.addEventListener('change', function(){ ponerFiltroEq(campo, this.value); });
  }
  htm(id, opciones(lista, valor, todos));
}

/* ---------- reparto de la selección, para ver dónde está el dinero ---------- */
function repartoEn(el, lista, k){
  if(!$(el)) return;
  var arr = enRango(lista).slice(0, k || 10);
  barras($(el), arr.map(function(a){ return { n: a.n, v: a.v }; }), { k: true });
}

function pintarFiltros(){
  if(!$('f-total')) return;
  construirPanelMeses('4');
  construirAjustes();

  multi('fCeco', CECOS, function(){ return cecoSel; },
        function(s){ cecoSel = s; rehacerTodo(); },
        META.porCeco, function(){ return rotuloLista(cecoSel, CECOS, 'TODOS'); });
  multi('fCuenta', CUENTAS, function(){ return cuentaSel; },
        function(s){ cuentaSel = s; rehacerTodo(); },
        META.porCuenta, function(){ return rotuloLista(cuentaSel, CUENTAS, 'TODAS'); });
  multi('fGasto', GASTOSD, function(){ return gastoSel; },
        function(s){ gastoSel = s; rehacerTodo(); },
        META.porGasto, function(){ return rotuloLista(gastoSel, GASTOSD, 'TODOS'); });
  multi('fRo2', ROS, function(){ return roSel; },
        function(s){ roSel = s; rehacerTodo(); },
        META.porRO, function(){ return rotuloLista(roSel, ROS, 'TODOS'); });
  marcarMultis();

  var u = universo();
  construirSelectorFino('fTipo', 'tipo', u.tipo, tipoFiltro, 'TODOS');
  construirSelectorFino('fMarca', 'marca', u.marca, marcaFiltro, 'TODAS');
  construirSelectorFino('fClasif', 'clasif', u.clasif, clasifFiltro, 'TODAS');
  construirSelectorFino('fFam4', 'fam', u.fam, famFiltro, 'TODAS');
  construirSelectorFino('fMod4', 'mod', u.mod, modFiltro, 'TODOS');
  construirSelectorFino('fProv4', 'prov', u.prov, provFiltro, 'TODOS');
  marcarCampoEq();

  var tot = totalR(), hm = hmR();
  txt('f-total', 'US$ ' + fmt(Math.round(tot)));
  txt('f-totalK', 'US$ ' + fmtK(tot));
  txt('f-hm', fmt(Math.round(hm)) + ' h');
  txt('f-cph', hm ? 'US$ ' + (tot / hm).toFixed(2) + '/h' : '—');
  txt('f-eq', fmt(contarEquipos()));
  txt('f-celdas', fmt(sumaRango(HECHOSMES)) + ' de ' + fmt(META.nHechos));
  txt('f-sel', rotuloSeleccion());
  txt('f-pc', (META.total ? (tot / META.total * 100) : 0).toFixed(2) + '% del libro');

  repartoEn('f-porRo', CECOT.length ? FASES.map(function(f){
    return { n: f.n, m: FASESM[f.c] }; }) : [], 8);
  repartoEn('f-porCeco', CECOT, 10);
  repartoEn('f-porCuenta', SISG, 12);
  repartoEn('f-porGasto', GASTOS, 12);
  repartoEn('f-porProy', PROYT, 6);
  repartoEn('f-porTipo', TIPOS, 4);
}
