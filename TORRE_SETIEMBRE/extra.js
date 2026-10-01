/* ══════════════════════════════════════════════════════════════════
   TORRE DE SETIEMBRE — lo que esta copia hace distinto

   El frontend es el de la Torre original, tal cual. Aqui solo se vuelven
   a declarar las funciones que dependen de que el periodo sean meses del
   libro mayor. Todo va dentro del mismo cierre, asi que la ultima
   declaracion de cada funcion es la que vale.

   El periodo son DIAS ('2026-09-01'), no meses, y el sitio del proyecto
   lo ocupa el ALCANCE: que entra al resultado operativo y que no.
   ══════════════════════════════════════════════════════════════════ */
function mesCorto(m){
  var p = m.split('-'), mm = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SET','OCT','NOV','DIC'];
  if(p.length < 3) return mm[parseInt(p[1],10)-1] + ' ' + p[0].slice(2);
  return p[2] + ' ' + mm[parseInt(p[1],10)-1];
}

/* ---------- las ordenes siguen al alcance ----------
   En la Torre original el detalle de ordenes era de una sola sede y por eso
   se apagaba con otro proyecto. Aqui cada orden pertenece a un alcance. */
function hayOts(){ return true; }
function otDelAlcance(o){ return proyFiltro === 'TODOS' || o.p === proyFiltro; }
function otsRango(){
  return OTS.filter(function(o){
    return otDelAlcance(o) && o.mi >= rangoA && o.mi <= rangoB;
  });
}
function otsDelEquipo(e){
  return (e.ots || []).filter(function(o){
    return otDelAlcance(o) && o.mi >= rangoA && o.mi <= rangoB;
  }).sort(function(a, b){ return (b.v || 0) - (a.v || 0); });
}
function fuenteOts(lista){
  return lista.length ? 'ÓRDENES REALES DE SAP · CONSOLIDADO 0 SHGN_RO EQUIPOS'
                      : 'SIN ÓRDENES EN EL PERIODO';
}

/* Las fichas de propio y alquilado ensenan lo que entra al reporte, que es
   con lo que abre la pagina, y no todo lo cargado. */
TOT_TIPO = (function(){
  var t = {}, Fe = F.e, Fp = F.p, Fv = F.v, j, n;
  for(j = 0, n = Fv.length; j < n; j++){
    if(Fp[j] !== 0) continue;
    var k = TODOS[Fe[j]].tipo || 'SIN TIPO';
    t[k] = (t[k] || 0) + Fv[j];
  }
  return t;
})();

/* ---------- ajustes rapidos de la hoja Filtros ---------- */
AJUSTES = [
  { c: 'reporte', n: 'COMO EL REPORTE',
    d: 'El recorte de SHGN PROP y SHGN ALQ: resultado operativo, hasta el día ' + SETIEMBRE.corteDia + '.' },
  { c: 'todo', n: 'TODO LO CARGADO',
    d: 'Suma también lo que las hojas dejan fuera: CAPEX, lo que pasa a venta y lo que es parte de la tarifa.' },
  { c: 'rym', n: 'SÓLO RYM',
    d: 'Materiales y servicios, que es lo que el reporte llama RYM.' },
  { c: 'sindep', n: 'SIN DEPRECIACIÓN',
    d: 'Sólo mantenimiento: materiales, servicios y mano de obra.' },
  { c: 'propio', n: 'SÓLO FLOTA PROPIA', d: 'Equipos de San Martín, sin los alquilados.' },
  { c: 'alquilado', n: 'SÓLO FLOTA ALQUILADA', d: 'Los equipos de terceros.' }
];
function aplicarAjuste(c){
  if(c === 'reporte' || c === 'todo'){
    roSel = ROS.slice(); cecoSel = CECOS.slice();
    cuentaSel = CUENTAS.slice(); gastoSel = GASTOSD.slice();
    famFiltro = 'TODAS'; modFiltro = 'TODOS'; provFiltro = 'TODOS';
    marcaFiltro = 'TODAS'; clasifFiltro = 'TODAS'; tipoFiltro = 'TODOS';
    eqFiltro = 'TODOS';
    proyFiltro = c === 'todo' ? 'TODOS' : PROYS[0];
  } else if(c === 'rym'){
    roSel = ROS.filter(function(r){ return r === 'MATERIALES' || r === 'SERVICIOS'; });
  } else if(c === 'sindep'){
    roSel = ROS.filter(function(r){ return r !== 'DEPRECIACIÓN'; });
  } else if(c === 'propio'){
    tipoFiltro = 'PROPIO';
  } else if(c === 'alquilado'){
    tipoFiltro = 'ALQUILADO';
  }
  rehacerTodo();
}

/* ---------- Ficha: de donde sale y cuanto se aparta del Excel ---------- */
function pintarFicha(){
  var v = META.val || {}, a = v.alquilado || { hoja: {}, calc: {} };
  txt('fi-lin', fmt(META.nLin));
  txt('fi-rango', 'el ' + mesCorto(MESES[0]) + ' y el ' + mesCorto(MESES[MESES.length - 1]));
  txt('fi-total', 'US$ ' + fmt(META.total));
  txt('fi-ro', 'US$ ' + fmt(((META.porProy || {})[PROYS[0]] || {}).v || 0));
  txt('fi-hm', fmt(META.hm) + ' horas');
  txt('fi-det', fmt(META.nEqDet || 0));
  txt('fi-nEq', fmt(META.nEq));
  txt('fi-hoja', v.hoja || '—');
  txt('fi-libro', v.libro || '—');
  // el mayor descuadre del mes entre la base recalculada y las dos hojas
  var dif = 0, p = v.propio || { hoja: {}, calc: {} };
  [p, a].forEach(function(x){
    ['rym', 'mov', 'terc', 'hr'].forEach(function(k){
      dif = Math.max(dif, Math.abs((x.calc[k] || 0) - (x.hoja[k] || 0)));
    });
  });
  txt('fi-cuadre', dif < 0.01 ? 'al centavo' : 'con una diferencia de hasta ' + fmt(dif));
  txt('fi-propHoja', 'US$ ' + fmt((p.hoja.rym || 0) + (p.hoja.mov || 0)));
  txt('fi-alqHoja', 'US$ ' + fmt((a.hoja.rym || 0) + (a.hoja.mov || 0)));
  txt('fi-parte', 'US$ ' + fmt(v.parteTarifa || 0));
  txt('fi-zserv', 'US$ ' + fmt((v.serviciosFueraBase || {}).v || 0));
  txt('fi-zservN', fmt((v.serviciosFueraBase || {}).n || 0));
  txt('fi-sinTarifa', fmt(v.sinTarifa || 0));
  txt('fi-sinHoras', fmt(v.sinHoras || 0));
  txt('fi-sinDM', fmt(v.sinDM || 0));
  var fuera = 0, k;
  for(k in (v.fueraCorte || {})) fuera += v.fueraCorte[k];
  txt('fi-fuera', 'US$ ' + fmt(fuera));
  txt('fi-gen', v.generado || '—');

  var d = [
    { n: 'TRANSACCIONES HASTA EL CORTE', v: META.nLin },
    { n: 'CELDAS DE LA TABLA DE HECHOS', v: META.nHechos },
    { n: 'ÓRDENES CON CARGO', v: META.nOT },
    { n: 'EQUIPOS EN LA BASE', v: META.nEq },
    { n: 'EQUIPOS CON COSTO EN EL PERIODO', v: contarEquipos() },
    { n: 'EQUIPOS CON COSTO POR CONJUNTO', v: META.nEqDet || 0 },
    { n: 'DÍAS', v: MESES.length }
  ];
  var el = $('fichaDatos');
  if(!el) return;
  var max = d[0].v || 1;
  el.innerHTML = d.map(function(x){
    return '<div class="fase"><div class="nm">' + esc(x.n) + '</div>'
      + '<div class="via" style="--w:' + (x.v / max * 100).toFixed(1) + '%"><i></i></div>'
      + '<div class="vl">' + fmt(x.v) + '</div><div class="pc"></div></div>';
  }).join('');
  setTimeout(function(){
    Array.prototype.forEach.call(el.querySelectorAll('.via i'), function(i2){
      i2.style.width = i2.parentElement.style.getPropertyValue('--w');
    });
  }, 40);
}

/* ---------- el bloque de tarifa, DM y usaje de la hoja Equipo ----------
   En la Torre original iba por modelo porque no habia otra cosa. Aqui el
   dato es del propio equipo. */
function pintarSepEquipo(e){
  var caja = $('q-sep');
  if(!caja) return;
  var q = SEP && SEP.eq ? SEP.eq[e.id] : null;
  if(!q){
    caja.innerHTML = '<div class="sinDato"><b>Este equipo no entra al resultado operativo.</b> '
      + 'Sólo tiene órdenes que las hojas dejan fuera (CAPEX, venta o parte de la tarifa), así que el reporte no le calcula '
      + 'tarifa, disponibilidad ni usaje.</div>';
    return;
  }
  var d = (q.tReal !== null && q.tProy !== null) ? q.tReal - q.tProy : null;
  var num = function(x, pre){ return x === null || x === undefined ? '—' : (pre || '') + x.toFixed(1); };
  caja.innerHTML =
      '<div class="sepCifras">'
    + '<div><div class="l">DISPONIBILIDAD MECÁNICA</div><div class="v">'
      + (q.dm === null ? '—' : pc(q.dm)) + '</div></div>'
    + '<div><div class="l">USAJE</div><div class="v">' + (q.use === null ? '—' : pc(q.use)) + '</div></div>'
    + '<div><div class="l">HORAS REALES / PROFORMA DEL MES</div><div class="v">'
      + fmt(q.hr) + ' / ' + (q.hrProf ? fmt(q.hrProf) : '—') + '</div></div>'
    + '<div><div class="l">TARIFA REAL AL DÍA ' + SETIEMBRE.corteDia + '</div><div class="v">' + num(q.tReal, 'US$ ') + '</div></div>'
    + '<div><div class="l">TARIFA DE VENTA</div><div class="v">' + num(q.tProy, 'US$ ') + '</div></div>'
    + (d === null ? '' :
       '<div><div class="l">DESVIACIÓN</div><div class="v ' + (d <= 0 ? 'bien' : 'alza') + '">'
       + (d >= 0 ? '+' : '') + d.toFixed(1) + '</div></div>')
    + '</div>'
    + '<p class="nota" style="margin-top:12px">DATO DEL EQUIPO · RESULTADO OPERATIVO COMPLETO AL DÍA ' + SETIEMBRE.corteDia + ' · '
    + 'NO SIGUE AL PERIODO NI A LOS FILTROS'
    + (q.conTarifa ? '' : ' · SIN TARIFA DE VENTA EN BASE VARIOS')
    + (e.tipo === 'ALQUILADO' ? ' · EN ALQUILADOS LA TARIFA ES RYM + MANO DE OBRA, SIN EL ALQUILER' : '')
    + '</p>';
}

/* ---------- pantalla completa con la tecla F ----------
   Pulsa el mismo boton PANTALLA COMPLETA, asi que entra, sale y avisa igual.
   No actua mientras se escribe (buscador, comentarios, calculadora) ni con
   Ctrl, Alt o Cmd, para no pisar atajos del navegador. */
document.addEventListener('keydown', function(ev){
  if(ev.key !== 'f' && ev.key !== 'F') return;
  if(ev.ctrlKey || ev.metaKey || ev.altKey || ev.repeat) return;
  var t = ev.target, tag = t && t.tagName;
  if(tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
  var b = $('btnPantalla');
  if(!b) return;
  ev.preventDefault();
  b.click();
});

/* ---------- encabezado: quitar y poner ----------
   Como ocultar la cinta en Excel: se gana alto para las tablas. Tambien con
   Ctrl+F1, el mismo atajo de Excel. Se recuerda en este navegador. */
(function encabezado(){
  var nav = $('nav');
  if(!nav) return;
  var b = document.createElement('button');
  b.type = 'button'; b.className = 'encBtn'; b.id = 'encBtn';
  nav.insertBefore(b, $('pestanas'));
  var poner = function(sin){
    document.body.classList.toggle('sinEnc', sin);
    b.textContent = sin ? '▾' : '▴';
    b.setAttribute('aria-pressed', sin);
    b.title = (sin ? 'Mostrar' : 'Ocultar') + ' el encabezado (Ctrl+F1)';
    b.setAttribute('aria-label', b.title);
    try { localStorage.setItem('torreSet.sinEnc', sin ? '1' : '0'); } catch(e){}
    setTimeout(function(){ try { ajustarTajo(); ajustarEstudio(); } catch(e){} }, 60);
  };
  var guardado = false;
  try { guardado = localStorage.getItem('torreSet.sinEnc') === '1'; } catch(e){}
  poner(guardado);
  b.addEventListener('click', function(){ poner(!document.body.classList.contains('sinEnc')); });
  document.addEventListener('keydown', function(ev){
    if(ev.ctrlKey && ev.key === 'F1'){ ev.preventDefault(); poner(!document.body.classList.contains('sinEnc')); }
  });
})();
