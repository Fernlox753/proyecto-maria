/* ══════════════════════════════════════════════════════════════════
   HOJAS PROPIOS Y ALQUILADOS — el consolidado, en tabla

   Sustituyen a la hoja Flota. Son SHGN PROP y SHGN ALQ tal como se leen
   en el Excel, en una sola tabla que se despliega como su dinamica:
   familia > modelo > equipo > orden de trabajo.

   Todo sale de SETIEMBRE.eq (la fila completa de cada equipo) y de
   SETIEMBRE.ots (sus ordenes). Familias y modelos se suman aqui, asi que
   no puede haber dos cifras distintas para lo mismo.

   En cada fila  c = costo real  y  v = venta interna, los dos como
   [RyM, MOV, Dep o Alq, total]; A es el acumulado del anio. En alquilados
   los totales NO suman el tercer componente, igual que en el Excel.
   ══════════════════════════════════════════════════════════════════ */
var HX = { P: { tipo: 'PROPIO' }, A: { tipo: 'ALQUILADO' } };
var HX_NIVELES = ['FAMILIA', 'MODELO', 'EQUIPO', 'ORDEN'];

/* simbolo de cada grupo: ▼ costo · ▲ venta · ± diferencia · ◷ horas ·
   /h por hora · Σ acumulado */
var HX_SIM = { costo: '▼', oper: '◷', venta: '▲', desv: '±', treal: '▼/h', tventa: '▲/h',
               tacum: 'Σ/h', cacum: 'Σ▼', vacum: 'Σ▲', dacum: 'Σ±' };

/* ---------- las columnas ----------
   Cada grupo lleva una columna clave (k): es la que queda a la vista
   cuando el grupo se pliega. f: n entero · n1 un decimal · d desviacion
   con signo y color · p porcentaje. */
/* ---------- con o sin el tercer componente ----------
   El total de costo y de venta es RyM + MOV, mas la depreciacion o el
   alquiler cuando el boton lo pide (st.ter). Por defecto, como el Excel:
   propios CON depreciacion, alquilados SIN alquiler. Los totales se
   calculan aqui y no se leen del dato, para que el boton valga en todo. */
function hxTc(o, ter){ return o.c[0] + o.c[1] + (ter ? o.c[2] : 0); }
function hxTv(o, ter){ return o.v[0] + o.v[1] + (ter ? o.v[2] : 0); }
function hxTac(o, ter){ return o.A.c[0] + o.A.c[1] + (ter ? o.A.c[2] : 0); }
function hxTav(o, ter){ return o.A.v[0] + o.A.v[1] + (ter ? o.A.v[2] : 0); }

function hxColumnas(esProp, st){
  var t = esProp ? 'Dep' : 'Alq';
  var por = function(x, h){ return h ? x / h : null; };
  var per = (SEP.acumPeriodos || []).length;
  var tc = function(o){ return hxTc(o, st.ter); }, tv = function(o){ return hxTv(o, st.ter); };
  var tac = function(o){ return hxTac(o, st.ter); }, tav = function(o){ return hxTav(o, st.ter); };
  /* t3: la columna del tercer componente; se oculta cuando no se suma */
  return [
    { id: 'costo', t: 'COSTO REAL AL ' + hxCorte(), cols: [
      { t: 'RyM', f: 'n', v: function(o){ return o.c[0]; } },
      { t: 'MOV', f: 'n', v: function(o){ return o.c[1]; } },
      { t: t, f: 'n', t3: 1, v: function(o){ return o.c[2]; } },
      { t: 'Total', f: 'n', k: 1, v: tc } ] },
    { id: 'oper', t: 'OPERACIÓN', cols: [
      { t: '% DM', f: 'p', v: function(o){ return o.dm; } },
      { t: '% Uso', f: 'p', v: function(o){ return o.use; } },
      { t: 'Horas real', f: 'n1', k: 1, v: function(o){ return o.hr; } },
      { t: 'HM prof', f: 'n', v: function(o){ return o.hrProf; } } ] },
    { id: 'venta', t: 'VENTA INTERNA AL ' + hxCorte(), cols: [
      { t: 'RyM', f: 'n', v: function(o){ return o.v[0]; } },
      { t: 'MOV', f: 'n', v: function(o){ return o.v[1]; } },
      { t: t, f: 'n', t3: 1, v: function(o){ return o.v[2]; } },
      { t: 'Total', f: 'n', k: 1, v: tv } ] },
    { id: 'desv', t: 'DESVIACIÓN VENTA − COSTO', cols: [
      { t: 'RyM', f: 'd', v: function(o){ return o.v[0] - o.c[0]; } },
      { t: 'MOV', f: 'd', v: function(o){ return o.v[1] - o.c[1]; } },
      { t: t, f: 'd', t3: 1, v: function(o){ return o.v[2] - o.c[2]; } },
      { t: 'Total', f: 'd', k: 1, v: function(o){ return tv(o) - tc(o); } } ] },
    { id: 'treal', t: 'TARIFA REAL US$/H', cols: [
      { t: 'RyM', f: 'n1', v: function(o){ return por(o.c[0], o.hr); } },
      { t: 'MOV', f: 'n1', v: function(o){ return por(o.c[1], o.hr); } },
      { t: t, f: 'n1', t3: 1, v: function(o){ return por(o.c[2], o.hr); } },
      { t: 'Real', f: 'n1', k: 1, v: function(o){ return por(tc(o), o.hr); } } ] },
    { id: 'tventa', t: 'TARIFA DE VENTA US$/H', cols: [
      { t: 'RyM', f: 'n1', v: function(o){ return por(o.v[0], o.hr); } },
      { t: 'MOV', f: 'n1', v: function(o){ return por(o.v[1], o.hr); } },
      { t: t, f: 'n1', t3: 1, v: function(o){ return por(o.v[2], o.hr); } },
      { t: 'Venta', f: 'n1', k: 1, v: function(o){ return por(tv(o), o.hr); } } ] },
    { id: 'tacum', ac: 1, t: 'TARIFA ACUMULADA US$/H', cols: [
      { t: 'RyM', f: 'n1', v: function(o){ return por(o.A.c[0], o.A.h); } },
      { t: 'MOV', f: 'n1', v: function(o){ return por(o.A.c[1], o.A.h); } },
      { t: t, f: 'n1', t3: 1, v: function(o){ return por(o.A.c[2], o.A.h); } },
      { t: 'Real acum', f: 'n1', k: 1, v: function(o){ return por(tac(o), o.A.h); } } ] },
    { id: 'cacum', ac: 1, t: 'COSTO ACUMULADO 2026 · ' + per + ' MESES + SET', cols: [
      { t: 'RyM', f: 'n', v: function(o){ return o.A.c[0]; } },
      { t: 'MOV', f: 'n', v: function(o){ return o.A.c[1]; } },
      { t: t, f: 'n', t3: 1, v: function(o){ return o.A.c[2]; } },
      { t: 'Seg', f: 'n', v: function(o){ return o.A.c[3]; } },
      { t: 'Costo acum', f: 'n', k: 1, v: tac },
      { t: 'Horas acum', f: 'n1', v: function(o){ return o.A.h; } } ] },
    { id: 'vacum', ac: 1, t: 'VENTA ACUMULADA 2026', cols: [
      { t: 'RyM', f: 'n', v: function(o){ return o.A.v[0]; } },
      { t: 'MOV', f: 'n', v: function(o){ return o.A.v[1]; } },
      { t: t, f: 'n', t3: 1, v: function(o){ return o.A.v[2]; } },
      { t: 'Venta acum', f: 'n', k: 1, v: tav } ] },
    { id: 'dacum', ac: 1, t: 'DESVIACIÓN ACUMULADA', cols: [
      { t: 'RyM', f: 'd', v: function(o){ return o.A.v[0] - o.A.c[0]; } },
      { t: 'MOV', f: 'd', v: function(o){ return o.A.v[1] - o.A.c[1]; } },
      { t: t, f: 'd', t3: 1, v: function(o){ return o.A.v[2] - o.A.c[2]; } },
      { t: 'Total', f: 'd', k: 1, v: function(o){ return tav(o) - tac(o); } } ] }
  ];
}
function hxCorte(){ return ((SEP && SEP.corte) || '').replace(/\D/g, '') || '—'; }

/* ---------- el arbol ---------- */
function hxCero(){ return { c: [0, 0, 0, 0], v: [0, 0, 0, 0], hr: 0, hrProf: 0, dm: null, use: null, n: 0,
                            A: { c: [0, 0, 0, 0, 0], h: 0, v: [0, 0, 0, 0] } }; }
/* varias filas en una. DM y uso son el promedio simple de los equipos que
   lo tienen, que es lo que hace el PROMEDIO.SI del Excel. */
function hxSuma(filas){
  var o = hxCero(), sd = 0, nd = 0, su = 0, nu = 0, i;
  filas.forEach(function(f){
    for(i = 0; i < 4; i++){ o.c[i] += f.c[i]; o.v[i] += f.v[i]; o.A.v[i] += f.A.v[i]; }
    for(i = 0; i < 5; i++) o.A.c[i] += f.A.c[i];
    o.A.h += f.A.h; o.hr += f.hr; o.hrProf += f.hrProf; o.n += f.n;
    /* se arrastran suma y cuenta: el promedio de una familia es el de sus
       equipos, no el promedio de los promedios de sus modelos */
    sd += f.sd; nd += f.nd; su += f.su; nu += f.nu;
  });
  o.sd = sd; o.nd = nd; o.su = su; o.nu = nu;
  o.dm = nd ? sd / nd : null; o.use = nu ? su / nu : null;
  return o;
}
function hxArbol(s){
  var st = HX[s], q = SEP.eq, fams = {}, orden = [], id;
  for(id in q) if(q[id].tipo === st.tipo){
    var x = q[id];
    var e = { k: 'e|' + id, lv: 2, et: id, fam: x.fam, mod: x.mod, sub: x.prov && s === 'A' ? x.prov.slice(0, 24) : '', id: id,
              busca: (id + ' ' + x.mod + ' ' + x.fam + ' ' + (x.prov || '')).toUpperCase(),
              o: { c: x.c, v: x.v, hr: x.hr || 0, hrProf: x.hrProf || 0, dm: x.dm, use: x.use, n: 1, A: x.A,
                   sd: x.dm === null || x.dm === undefined ? 0 : x.dm, nd: x.dm === null || x.dm === undefined ? 0 : 1,
                   su: x.use === null || x.use === undefined ? 0 : x.use,
                   nu: x.use === null || x.use === undefined ? 0 : 1 },
              hijos: ((SEP.ots || {})[id] || []).map(function(r){
                return { k: 'o|' + r[0], lv: 3, et: r[0], sub: (r[1] ? r[1] + ' · ' : '') + r[2], ot: 1,
                         o: { c: [r[3], r[4], 0, r[3] + r[4]] }, hijos: [] };
              }) };
    if(!fams[x.fam]){ fams[x.fam] = {}; orden.push(x.fam); }
    (fams[x.fam][x.mod] = fams[x.fam][x.mod] || []).push(e);
  }
  st.todos = [];
  st.arbol = orden.map(function(f){
    var mods = Object.keys(fams[f]).map(function(m){
      var es = fams[f][m];
      es.forEach(function(e){ st.todos.push(e); });
      return { k: 'm|' + f + '|' + m, lv: 1, et: m || '(sin modelo)', sub: '', hijos: es, fam: f, mod: m,
               o: hxSuma(es.map(function(e){ return e.o; })) };
    });
    return { k: 'f|' + f, lv: 0, et: f, sub: '', hijos: mods, fam: f, mod: '',
             o: hxSuma(mods.map(function(m){ return m.o; })) };
  });
  st.total = hxSuma(st.arbol.map(function(f){ return f.o; }));
}

/* ---------- celdas ---------- */
function hxN(x, dec){
  if(x === null || x === undefined || !isFinite(x)) return '<span class="z">–</span>';
  if(Math.abs(x) < (dec ? 0.05 : 0.5)) return '<span class="z">–</span>';
  return dec ? x.toLocaleString('es-PE', { minimumFractionDigits: dec, maximumFractionDigits: dec })
             : fmt(x);
}
function hxD(x){
  if(x === null || x === undefined || !isFinite(x) || Math.abs(x) < 0.5) return '<span class="z">–</span>';
  return '<span class="' + (x < 0 ? 'neg' : 'pos') + '">' + (x > 0 ? '+' : '') + fmt(x) + '</span>';
}
function hxCelda(c, o){
  var x = c.v(o);
  if(c.f === 'p') return (x === null || x === undefined) ? '<span class="z">–</span>' : (x * 100).toFixed(0) + '%';
  if(c.f === 'd') return hxD(x);
  return hxN(x, c.f === 'n1' ? 1 : 0);
}
/* el titulo de un grupo plegado: corto, para que la columna no se ensanche */
var HX_CORTO = { costo: 'COSTO REAL', oper: 'OPERA&shy;CIÓN', venta: 'VENTA INTERNA', desv: 'DESVIA&shy;CIÓN',
  treal: 'TARIFA REAL', tventa: 'TARIFA VENTA', tacum: 'TARIFA ACUM.', cacum: 'COSTO ACUM.',
  vacum: 'VENTA ACUM.', dacum: 'DESV. ACUM.' };
/* las columnas de un grupo que estan a la vista */
function hxVisibles(st, g){
  /* con SÓLO EL MES los grupos del acumulado salen enteros, no plegados */
  if(st.oculto && st.oculto[g.id]) return [];
  return g.cols.filter(function(c){
    if(c.t3 && !st.ter) return false;       /* sin el tercer componente, su columna no se ensena */
    return st.cerrado[g.id] ? c.k : true;
  });
}
/* la esquina de una celda comentada, como el triangulo rojo de Excel */
function hxMarca(st, n, col){
  if(!n.k) return '';
  var t = (HX_NOTAS[hxClaveNota(st.s, n, col)] || {}).texto;
  return t ? '<button type="button" class="xlC" data-cn="' + col + '" title="' + esc(t)
           + '" aria-label="Ver el comentario de esta celda"></button>' : '';
}
/* o0: la misma fila sin filtros; su cifra va debajo, chica, para comparar */
function hxCeldas(st, n, o0){
  return st.cols.map(function(g){
    var vis = hxVisibles(st, g);
    /* una orden de trabajo solo tiene costo: lo demas es del equipo */
    if(n.ot && g.id !== 'costo'){
      return vis.map(function(c, i){ return '<td class="g-' + g.id + (i ? '' : ' ini') + '"></td>'; }).join('');
    }
    return vis.map(function(c, i){
      var col = g.id + '-' + g.cols.indexOf(c), h = hxCelda(c, n.o), m = hxMarca(st, n, col);
      var sel = st.sel && n.k && st.sel.k === n.k && st.sel.col === col;
      return '<td class="g-' + g.id + (i ? '' : ' ini') + (m ? ' cn' : '') + (sel ? ' sel' : '') + '">'
        + (c.k ? '<b>' + h + '</b>' : h)
        + (o0 ? '<span class="xo" title="Sin filtros">' + hxCelda(c, o0).replace(/<[^>]+>/g, '') + '</span>' : '') + m + '</td>';
    }).join('');
  }).join('');
}

/* ---------- de donde sale cada cifra ----------
   Lo que se ensena al elegir una celda, como la barra de formulas de Excel:
   la hoja y la columna del consolidado, la regla, y el alcance de la fila. */
function hxOrTot(st, que){
  var esProp = st.s === 'P', t3 = esProp ? 'Dep' : 'Alq';
  return que + ' = RyM + MOV' + (st.ter ? ' + ' + t3 : '') + ' de esta misma fila. '
    + (st.ter ? (esProp ? '' : 'El alquiler está sumado (botón CON ALQ); el Excel no lo suma.')
              : (esProp ? 'La depreciación está fuera (botón SIN DEP); el Excel sí la suma.' : 'El alquiler no se suma, igual que en SHGN ALQ.'));
}
function hxOrigen(st, n, col){
  var esProp = st.s === 'P', p = col.split('-'), g = p[0], i = parseInt(p[1], 10);
  var corte = hxCorte(), t3 = esProp ? 'Dep' : 'Alq';
  var hoja = 'Hoja «' + ((META.val || {}).hoja || 'BASE DATOS') + '», columna COSTO RYM';
  var rg = ((META.val || {}).reglas || {})[st.tipo] || {}, dias = SEP.diasMes || 30;
  var filtro = ' Filtros de la dinámica de ' + (esProp ? 'SHGN PROP' : 'SHGN ALQ') + ': equipo ' + st.tipo
             + ', fecha hasta el día ' + corte
             + (rg.CONSIDERAR ? ', CONSIDERAR = ' + rg.CONSIDERAR.join(' · ') : '') + '.';
  var nivel = n.ot ? ' Alcance: sólo las líneas de esta orden de trabajo.'
            : n.lv === 2 ? ' Alcance: sólo este equipo.'
            : ' Alcance: suma de los ' + n.o.n + ' equipos de ' + (n.lv === 0 ? 'esta familia.' : 'este modelo.');
  var per = (SEP.acumPeriodos || []).length;
  var nomC = ['RyM', 'MOV', t3, 'Total'];
  var tv = function(j){ return 'BASE VARIOS, bloque TARIFAS VENTA, columna ' + ['RyM', 'MOV', 'DEP/ALQ'][j] + ' del equipo'; };
  var o = '';
  if(g === 'costo') o = [
      hoja + ', filas con RECURSO = MAT o SERV.' + filtro + ' Materiales: cantidad × precio unitario ÷ 3.4 (descarga Z MAT). Servicios: importe en dólares, o en soles ÷ 3.4 (descarga Z SERV).',
      hoja + ', filas con RECURSO = MO.' + filtro + ' Cada línea es horas aplicadas × US$ 35 (descarga Z HH).',
      esProp ? 'Tarifa de depreciación × horas reales. La tarifa sale de BASE VARIOS, bloque PROFORMA: depreciación del mes ÷ horas proformadas. '
               + ((SEP.depPorDias || []).length ? SEP.depPorDias.join(' y ') + ' van por días (importe del mes ÷ ' + dias + ' × ' + corte + ').' : '')
             : 'NO ES UN COSTO REAL. Como la columna Alq de SHGN ALQ: tarifa de VENTA de alquiler (BASE VARIOS, bloque TARIFAS VENTA, columna DEP/ALQ) × horas reales. '
               + ((SEP.alqPorDias || []).length ? SEP.alqPorDias.join(', ') + ' tienen tarifa mensual y van por días (÷ ' + dias + ' × ' + corte + '). ' : '')
               + (st.ter ? 'Está sumado al total (botón CON ALQ).' : 'NO entra al total.'),
      hxOrTot(st, 'Costo')][i];
  else if(g === 'oper') o = [
      'BASE VARIOS, bloque DM-USAJE, columna DM.' + (n.lv < 2 ? ' En un grupo es el promedio simple de los equipos que tienen dato.' : ''),
      'BASE VARIOS, bloque DM-USAJE, columna USAJE.' + (n.lv < 2 ? ' En un grupo es el promedio simple de los equipos que tienen dato.' : ''),
      'BASE VARIOS, bloque HOROMETRO REAL: suma de HM del horómetro de SAP' + ((META.val || {}).fuenteHoras ? ' (' + META.val.fuenteHoras + ')' : '') + ' hasta el día ' + corte + '. Es la columna V de la hoja.',
      'BASE VARIOS, bloque PROFORMA, columna HM: horas proformadas para TODO el mes, no sólo hasta el día ' + corte + '.'][i];
  else if(g === 'venta') o = i < 3 ? (!esProp && i === 2 ? 'La misma cifra que la columna Alq del costo: las dos salen de la tarifa de venta, así que aquí no hay margen que medir.'
                                                         : tv(i) + ' × horas reales.') + (!st.ter && i === 2 ? ' No entra al total.' : '')
                                  : hxOrTot(st, 'Venta');
  else if(g === 'desv') o = 'Venta interna − costo real, columna ' + ['RyM', 'MOV', t3, 'Total'][i] + '. Negativo (rojo): se gastó más de lo que la venta da.';
  else if(g === 'treal') o = 'Costo real ' + nomC[i] + ' ÷ horas reales.';
  else if(g === 'tventa') o = 'Venta interna ' + nomC[i] + ' ÷ horas reales. En un equipo es su tarifa de venta de BASE VARIOS; en un grupo, el promedio ponderado por horas.';
  else if(g === 'tacum') o = ['Costo acumulado RyM', 'Costo acumulado MOV', 'Costo acumulado ' + t3 + ' más Seg', 'Costo acumulado total'][i] + ' ÷ horas acumuladas.';
  else if(g === 'cacum') o = [
      'BASE VARIOS, bloque ACUMULADO 2026 (libro mayor, ' + per + ' meses), columna RYM, más el RyM del mes.',
      'BASE VARIOS, bloque ACUMULADO 2026, columna FIJO, más el MOV del mes.',
      esProp ? 'BASE VARIOS, bloque ACUMULADO 2026, columna DEP, más la depreciación del mes.'
             : 'BASE VARIOS, bloque ACUMULADO 2026, columna ALQ del propio equipo, más el alquiler del mes (tarifa de venta, no costo real).' + (st.ter ? '' : ' No entra al costo acumulado.'),
      'BASE VARIOS, bloque ACUMULADO 2026, columna SEG/OTR.',
      hxOrTot(st, 'Costo acumulado'),
      'BASE VARIOS, bloque ACUMULADO 2026, columna HM, más las horas reales del mes.'][i]
      + ((SEP.acumPeriodos || []).length ? ' El libro trae hasta el periodo ' + SEP.acumPeriodos[SEP.acumPeriodos.length - 1] + '.' : ' El libro no trae ningún periodo.');
  else if(g === 'vacum') o = i < 3 ? tv(i) + ' × horas acumuladas.' : hxOrTot(st, 'Venta acumulada');
  else if(g === 'dacum') o = 'Venta acumulada − costo acumulado, columna ' + ['RyM', 'MOV', t3, 'Total'][i] + '.';
  return o + nivel;
}
function hxBarraOrigen(s){
  var st = HX[s], el = $('hx-origen-' + s);
  if(!el) return;
  var n = st.sel ? hxBuscarNodo(st, st.sel.k) : null;
  if(!n){
    el.innerHTML = '<span class="fx">fx</span><span class="txt">Haz clic en cualquier cifra para ver <b>de dónde sale</b> '
      + 'y comentarla. Para desplegar una fila, clic en la primera columna.</span>';
    return;
  }
  var col = st.sel.col, p = col.split('-'), gr = null;
  st.cols.forEach(function(g){ if(g.id === p[0]) gr = g; });
  var cc = gr.cols[parseInt(p[1], 10)];
  var valor = hxCelda(cc, n.o).replace(/<[^>]+>/g, '');
  var nota = (HX_NOTAS[hxClaveNota(s, n, col)] || {}).texto;
  el.innerHTML = '<span class="fx">fx</span><span class="txt"><b>' + esc(n.et) + ' · ' + esc(hxTituloCol(st, col)) + ' = ' + esc(valor)
    + '</b><br>' + esc(hxOrigen(st, n, col))
    + (nota ? '<br><span class="nt">Comentario: ' + esc(nota) + '</span>' : '') + '</span>'
    + '<button class="fbt" type="button" data-com="1">' + (nota ? 'EDITAR COMENTARIO' : 'COMENTAR ESTA CELDA') + '</button>';
}

/* ---------- que filas se ven, y en que orden ---------- */
function hxValorOrden(st, n){
  if(!st.ord) return 0;
  if(st.ord.g === '_et') return n.et;
  var g = null;
  st.cols.forEach(function(x){ if(x.id === st.ord.g) g = x; });
  if(!g || (n.ot && g.id !== 'costo')) return null;
  var x = g.cols[st.ord.i].v(n.o);
  return (x === null || x === undefined || !isFinite(x)) ? null : x;
}
function hxOrdenar(st, lista){
  var d = st.ord.dir;
  return lista.slice().sort(function(a, b){
    var x = hxValorOrden(st, a), y = hxValorOrden(st, b);
    if(x === null && y === null) return 0;
    if(x === null) return 1;               /* lo vacio siempre al final */
    if(y === null) return -1;
    if(typeof x === 'string') return d * (x < y ? -1 : x > y ? 1 : 0);
    return d * (x - y);
  });
}
/* ---------- filtros por valor, como el filtro de numero de Excel ----------
   st.filtros: { 'grupo-indice': { op, a, b } }. Se aplican a los EQUIPOS con
   la cifra que muestra la celda (en % se escribe 85 para 85%); familias,
   modelos y el total se vuelven a sumar solo con los equipos que pasan. */
var HX_OPS = { '>': 'mayor que', '>=': 'mayor o igual que', '<': 'menor que', '<=': 'menor o igual que',
               '=': 'igual a', '!=': 'distinto de', 'entre': 'entre' };
var HX_OPS_C = { '>': '>', '>=': '≥', '<': '<', '<=': '≤', '=': '=', '!=': '≠' };
function hxColDe(st, col){
  var p = col.split('-'), g = null;
  st.cols.forEach(function(x){ if(x.id === p[0]) g = x; });
  return g ? { g: g, c: g.cols[parseInt(p[1], 10)] } : null;
}
/* el valor tal como se lee en la celda, redondeado igual: en % es 85, no
   0.853. Asi «mayor que 85%» no deja pasar un equipo que se ve con 85% */
function hxValorFiltro(c, o){
  var x = c.v(o);
  if(x === null || x === undefined || !isFinite(x)) return null;
  if(c.f === 'p') return Math.round(x * 100);
  if(c.f === 'n1') return Math.round(x * 10) / 10;
  return Math.round(x);
}
function hxCumple(f, c, x){
  if(x === null) return false;
  switch(f.op){
    case '>': return x > f.a;
    case '>=': return x >= f.a - 1e-9;
    case '<': return x < f.a;
    case '<=': return x <= f.a + 1e-9;
    case '=': return Math.abs(x - f.a) < 1e-9;
    case '!=': return Math.abs(x - f.a) >= 1e-9;
    case 'entre': return x >= Math.min(f.a, f.b) - 1e-9 && x <= Math.max(f.a, f.b) + 1e-9;
  }
  return true;
}
function hxHayFiltros(st){ return !!(st.filtros && Object.keys(st.filtros).length); }
function hxPasaFiltros(st, e){
  for(var col in st.filtros){
    var cc = hxColDe(st, col);
    if(cc && !hxCumple(st.filtros[col], cc.c, hxValorFiltro(cc.c, e.o))) return false;
  }
  return true;
}
/* el arbol que se ve: con filtros, solo los equipos que pasan y sumas nuevas */
function hxArbolVista(st){
  if(!hxHayFiltros(st)){ st.vista = st.arbol; st.totalVista = st.total; return; }
  st.vista = st.arbol.map(function(f){
    var mods = f.hijos.map(function(m){
      var es = m.hijos.filter(function(e){ return hxPasaFiltros(st, e); });
      return es.length ? { k: m.k, lv: 1, et: m.et, sub: '', hijos: es, fam: m.fam, mod: m.mod,
                           o: hxSuma(es.map(function(e){ return e.o; })) } : null;
    }).filter(Boolean);
    return mods.length ? { k: f.k, lv: 0, et: f.et, sub: '', hijos: mods, fam: f.fam, mod: '',
                           o: hxSuma(mods.map(function(m){ return m.o; })) } : null;
  }).filter(Boolean);
  st.totalVista = st.vista.length ? hxSuma(st.vista.map(function(f){ return f.o; })) : hxCero();
}
function hxTextoFiltro(st, col){
  var f = st.filtros[col], cc = hxColDe(st, col);
  if(!f || !cc) return '';
  var pc = cc.c.f === 'p' ? '%' : '';
  var num = function(x){ return (Math.abs(x) >= 1000 ? fmt(x) : String(x)) + pc; };
  var nom = cc.g.t.split(' ·')[0].replace(/ AL \d+$/, '') + ' › ' + cc.c.t;
  return nom + ' ' + (f.op === 'entre' ? 'entre ' + num(f.a) + ' y ' + num(f.b) : HX_OPS_C[f.op] + ' ' + num(f.a));
}
function hxLeerNumero(t){
  t = String(t || '').replace(/[−–]/g, '-').replace(/[%\s,]/g, '').replace(/US\$/i, '');
  var x = parseFloat(t);
  return isFinite(x) ? x : null;
}

function hxLista(st){
  var out = [], b = st.busca.trim().toUpperCase();
  var pasa = function(n){
    if(!b) return true;
    if(n.lv === 2) return n.busca.indexOf(b) >= 0;
    if(n.lv === 3) return true;
    return n.hijos.some(pasa);
  };
  var baja = function(lista){
    hxOrdenar(st, lista).forEach(function(n){
      if(!pasa(n)) return;
      out.push(n);
      /* buscando, familias y modelos van abiertos para que se vea lo hallado */
      var abierto = (b && n.lv < 2) || st.ab[n.k];
      if(abierto && n.hijos.length) baja(n.hijos);
    });
  };
  baja(st.vista || st.arbol);
  return out;
}

/* ---------- comentarios ---------- */
var HX_NOTAS = {}, hxDb = null, hxUser = null, hxUid = null, hxNotaAbierta = null;
function hxClaveNota(s, n, col){
  /* los ids de documento solo admiten letras, digitos y unos pocos signos */
  return s + '.' + n.k.replace(/[^A-Za-z0-9-]/g, '_').slice(0, 150) + '.' + col;
}
function hxNotasLocal(){
  try { return JSON.parse(localStorage.getItem('torreSet.notas') || '{}') || {}; } catch(e){ return {}; }
}
function hxEstado(){
  ['P', 'A'].forEach(function(s){
    var st = HX[s];
    if(!st.arbol) return;
    var n = 0, k;
    for(k in HX_NOTAS) if(k.indexOf(s + '.') === 0 && HX_NOTAS[k].texto) n++;
    htm('hx-estado-' + s, (s === 'A' && st.ter ? '<span class="neg" style="color:#B3261E">' + esc(hxAvisoAlq(st.todos).toUpperCase()) + '</span><br>' : '')
      + fmt(st.vistas || 0) + ' FILAS A LA VISTA · <b>' + n
      + (n === 1 ? ' COMENTARIO' : ' COMENTARIOS') + '</b> · '
      + (hxDb ? 'LOS COMENTARIOS SE GUARDAN EN LA PÁGINA Y LOS VE QUIEN LA ABRA'
              : 'LOS COMENTARIOS SE GUARDAN SÓLO EN ESTE NAVEGADOR')
      + ' · LA ESQUINA ROJA DE UNA CELDA ABRE SU COMENTARIO · PRIMERA COLUMNA: DESPLEGAR');
  });
}
function hxTituloCol(st, col){
  if(col === 'et') return 'toda la fila';
  var p = col.split('-'), out = col;
  st.cols.forEach(function(g){
    if(g.id === p[0]) out = g.t.split(' ·')[0] + ' › ' + g.cols[parseInt(p[1], 10)].t;
  });
  return out;
}
function hxAbrirNota(s, n, col){
  var k = hxClaveNota(s, n, col), nota = HX_NOTAS[k] || {};
  hxNotaAbierta = { k: k, fila: (s === 'P' ? 'PROPIOS' : 'ALQUILADOS') + ' · ' + HX_NIVELES[n.lv] + ' ' + n.et
                              + ' · ' + hxTituloCol(HX[s], col) };
  txt('hx-ed-fila', hxNotaAbierta.fila);
  var ta = $('hx-ed-txt'); ta.value = nota.texto || '';
  var meta = $('hx-ed-meta'); meta.className = 'meta';
  meta.textContent = nota.ts ? 'Último cambio: ' + String(nota.ts).slice(0, 16).replace('T', ' ') : '';
  if(nota.autor && hxUser){
    hxUser.profiles([nota.autor]).then(function(ps){
      if(hxNotaAbierta && hxNotaAbierta.k === k && ps[nota.autor] && ps[nota.autor].name)
        meta.textContent += ' · ' + ps[nota.autor].name;
    });
  }
  $('hx-editor').hidden = false;
  ta.focus();
}
function hxCerrarNota(){ $('hx-editor').hidden = true; hxNotaAbierta = null; }
function hxGuardarNota(texto){
  if(!hxNotaAbierta) return;
  var k = hxNotaAbierta.k, meta = $('hx-ed-meta');
  var reg = { k: k, fila: hxNotaAbierta.fila, texto: texto, autor: hxUid || null, ts: new Date().toISOString() };
  var listo = function(){ hxCerrarNota(); hxPintarTodo(); };
  if(hxDb){
    meta.className = 'meta'; meta.textContent = 'Guardando…';
    var ref = hxDb.collection('notas').doc(k);
    (texto ? ref.set(reg) : ref.delete()).then(function(){
      if(texto) HX_NOTAS[k] = reg; else delete HX_NOTAS[k];
      listo();
    }, function(e){
      meta.className = 'meta mal';
      meta.textContent = e && e.code === 'invalid_argument'
        ? 'No se guardó: tu acceso a esta página es de sólo lectura. Pide al dueño permiso de colaborador.'
        : 'No se guardó. Vuelve a intentarlo en un momento.';
    });
    return;
  }
  if(texto) HX_NOTAS[k] = reg; else delete HX_NOTAS[k];
  try { localStorage.setItem('torreSet.notas', JSON.stringify(HX_NOTAS)); } catch(e){}
  listo();
}

/* ---------- pintado ---------- */
function hxCifras(s){
  var st = HX[s], tot = st.total, esProp = s === 'P', ter = st.ter, h = tot.hr;
  var tc = hxTc(tot, ter), tv = hxTv(tot, ter), d = tv - tc;
  var it = function(l, v, dsc, cl){
    return '<div><div class="gl">' + l + '</div><div class="gt' + (cl ? ' ' + cl : '') + '">' + v
         + '</div><div class="gd">' + dsc + '</div></div>';
  };
  htm('hx-cifras-' + s,
      it('COSTO REAL AL DÍA ' + hxCorte(), 'US$ ' + fmt(tc),
         'RyM ' + fmt(tot.c[0]) + ' · MOV ' + fmt(tot.c[1])
         + (ter ? ' · ' + (esProp ? 'Dep ' : 'Alq ') + fmt(tot.c[2]) : (esProp ? ' · sin depreciación' : ' · sin alquiler')))
    + it('VENTA INTERNA', 'US$ ' + fmt(tv), 'tarifa de venta × horas reales')
    + it('DESVIACIÓN VENTA − COSTO', (d > 0 ? '+' : d < 0 ? '−' : '') + 'US$ ' + fmt(Math.abs(d)),
         d < 0 ? 'el costo supera a la venta' : 'la venta cubre el costo', d < 0 ? 'alza' : 'bien')
    + it('HORAS MÁQUINA', fmt(h) + ' h', 'de ' + fmt(tot.hrProf) + ' h proformadas en el mes')
    + it('TARIFA REAL', 'US$ ' + (h ? (tc / h).toFixed(1) : '—') + '/h',
         'contra US$ ' + (h ? (tv / h).toFixed(1) : '—') + '/h de venta')
    + it('COSTO ACUMULADO 2026', 'US$ ' + fmtK(hxTac(tot, ter)),
         'venta US$ ' + fmtK(hxTav(tot, ter)) + ' · ' + fmt(tot.n) + ' equipos'));
}

function hxTabla(s){
  var st = HX[s];
  hxArbolVista(st);
  var filas = hxLista(st);
  st.vistas = filas.length;
  /* que columna es cada celda, para saber cual se comenta al hacer clic */
  st.vis = [];
  st.cols.forEach(function(g){
    hxVisibles(st, g).forEach(function(c){ st.vis.push(g.id + '-' + g.cols.indexOf(c)); });
  });
  var cab1 = '<th class="fija t"></th>' + st.cols.map(function(g){
    var n = hxVisibles(st, g).length, c = st.cerrado[g.id];
    if(!n) return '';
    return '<th colspan="' + n + '" class="g-' + g.id + (c ? ' cerr' : '') + '"><button type="button" class="xlG" data-g="'
      + g.id + '" aria-expanded="' + !c + '" title="' + (c ? 'Desplegar «' + esc(g.t) + '»' : 'Plegar este grupo de columnas') + '">'
      + '<i>' + (c ? '+' : '−') + '</i><span class="sim">' + HX_SIM[g.id] + '</span><span class="gt">'
      + (c ? (HX_CORTO[g.id] || g.t.split(' ·')[0]) : g.t) + '</span></button></th>';
  }).join('');
  /* con algun grupo plegado la tabla se ajusta a sus columnas (ver hojas.html) */
  var plegada = st.cols.some(function(g){ return st.cerrado[g.id] && hxVisibles(st, g).length; });
  var tEl = $('hx-tabla-' + s);
  if(tEl) tEl.classList.toggle('plegada', plegada);
  var marca = function(g, i){
    return st.ord.g === g && st.ord.i === i ? ' xord' + (st.ord.dir > 0 ? ' asc' : '') : '';
  };
  var cab2 = '<th class="fija t' + marca('_et', 0) + '" data-s="_et|0">Familia › Modelo › Equipo › Orden</th>'
    + st.cols.map(function(g){
        return hxVisibles(st, g).map(function(c, i){
          var col = g.id + '-' + g.cols.indexOf(c), fon = !!(st.filtros && st.filtros[col]);
          return '<th class="g-' + g.id + (i ? '' : ' ini') + (st.cerrado[g.id] ? ' cerr' : '') + (fon ? ' xf' : '') + marca(g.id, g.cols.indexOf(c)) + '" data-s="' + g.id + '|'
            + g.cols.indexOf(c) + '">' + c.t
            + '<button type="button" class="xlF' + (fon ? ' on' : '') + '" data-f="' + col + '" title="'
            + (fon ? 'Filtro: ' + esc(hxTextoFiltro(st, col)) : 'Filtrar por valor') + '" aria-label="Filtrar esta columna por valor">▾</button></th>';
        }).join('');
      }).join('');
  /* con filtros, familias, modelos y total llevan debajo su cifra original */
  var filt = hxHayFiltros(st), orig = {};
  if(filt) st.arbol.forEach(function(f){ orig[f.k] = f; f.hijos.forEach(function(m){ orig[m.k] = m; }); });
  var cuerpo = filas.map(function(n){
    var tiene = n.hijos.length > 0, ab = st.ab[n.k] || (st.busca && n.lv < 2), m = hxMarca(st, n, 'et');
    var o0 = filt && n.lv < 2 && orig[n.k] ? orig[n.k].o : null;
    return '<tr class="n' + n.lv + '" tabindex="0" data-k="' + esc(n.k) + '"'
      + (tiene ? ' aria-expanded="' + !!ab + '"' : '') + '>'
      + '<td class="fija' + (m ? ' cn' : '') + '"><span class="car">' + (tiene ? (ab ? '▾' : '▸') : '') + '</span>' + esc(n.et)
      + (n.lv < 2 ? '<span class="sub">' + n.o.n + (o0 ? ' de ' + o0.n : '') + (n.o.n === 1 && !o0 ? ' equipo' : ' equipos') + '</span>' : '')
      + (n.sub ? '<span class="sub">' + esc(n.sub) + '</span>' : '')
      + (n.lv < 2 ? '<button type="button" class="xlIr" data-tb="' + esc(n.k)
          + '" title="Abrir el tablero de análisis de ' + (n.lv ? 'este modelo' : 'esta familia') + '">TABLERO ▦</button>' : '')
      + (n.lv === 2 && byId[n.id] ? '<button type="button" class="xlIr" data-ir="' + esc(n.id)
          + '" title="Abrir este equipo en la pestaña Equipo">VER ↗</button>' : '')
      + m + '</td>' + hxCeldas(st, n, o0) + '</tr>';
  }).join('') || '<tr><td class="fija">Ningún equipo ' + (filt ? 'cumple los filtros' : 'con esa búsqueda') + '.</td><td colspan="80"></td></tr>';
  var tot = st.totalVista || st.total;
  var pie = '<tr><td class="fija">Total · ' + fmt(tot.n) + (filt ? ' de ' + fmt(st.total.n) : '') + ' equipos'
    + (filt ? '<span class="xo">original, sin filtros</span>' : '') + '</td>'
    + hxCeldas(st, { o: tot }, filt ? st.total : null) + '</tr>';
  hxBarraFiltros(s);
  htm('hx-tabla-' + s, '<thead><tr class="g">' + cab1 + '</tr><tr class="c">' + cab2 + '</tr></thead>'
    + '<tbody>' + cuerpo + '</tbody><tfoot>' + pie + '</tfoot>');
  hxBarraOrigen(s);
  hxEstado();
}
/* Con el alquiler sumado la cifra no es un costo real: el consolidado lo
   calcula con la tarifa de VENTA, asi que es la misma a los dos lados. Se
   dice cada vez. */
function hxAvisoAlq(nodos){
  var nc = 0;
  nodos.forEach(function(e){ if(e.o.c[2] > 0) nc++; });
  return 'EL ALQUILER NO ES UN COSTO REAL: el consolidado lo calcula con la tarifa de VENTA de alquiler × horas (' + nc
    + ' de ' + nodos.length + ' equipos lo tienen), así que suma lo mismo al costo y a la venta. '
    + 'Úsalo para ver cuánto pesa el alquiler, no para concluir si se cumple.';
}
/* con o sin el tercer componente: vale para la hoja y para el tablero de esa flota */
function hxPonerTer(s, si){
  var st = HX[s];
  if(!st.arbol || st.ter === si) return;
  st.ter = si;
  hxCifras(s); hxBotones(s); hxTabla(s);
  if(typeof tbTer === 'function') tbTer(s);
}
function hxPintarTodo(){ ['P', 'A'].forEach(function(s){ if(HX[s].arbol) hxTabla(s); }); }

/* abre todo hasta un nivel, como los botones 1 2 3 4 del esquema de Excel */
function hxNivel(s, nivel){
  var st = HX[s];
  st.ab = {};
  var baja = function(lista){
    lista.forEach(function(n){
      if(n.lv < nivel){ st.ab[n.k] = 1; baja(n.hijos); }
    });
  };
  baja(st.arbol);
  st.nivel = nivel;
}
function hxBotones(s){
  var st = HX[s];
  htm('hx-nivel-' + s, HX_NIVELES.map(function(n, i){
    return '<button class="fbt" type="button" data-n="' + i + '" aria-pressed="' + (st.nivel === i) + '">'
      + (i + 1) + ' · ' + n + '</button>';
  }).join(''));
  /* el boton marcado dice que vista hay; si se plego un grupo a mano, ninguno */
  var hayOculto = st.cols.some(function(g){ return st.oculto && st.oculto[g.id]; });
  var todas = !hayOculto && st.cols.every(function(g){ return !st.cerrado[g.id]; });
  var soloMes = hayOculto && st.cols.every(function(g){ return !st.cerrado[g.id]; });
  var totales = !hayOculto && st.cols.every(function(g){ return st.cerrado[g.id]; });
  var nom = s === 'P' ? 'DEP' : 'ALQ';
  htm('hx-ter-' + s,
      '<button class="fbt" type="button" data-t="1" aria-pressed="' + !!st.ter + '">CON ' + nom + '</button>'
    + '<button class="fbt" type="button" data-t="0" aria-pressed="' + !st.ter + '">SIN ' + nom + '</button>');
  htm('hx-cols-' + s,
      '<button class="fbt" type="button" data-c="abrir" aria-pressed="' + todas + '">TODAS</button>'
    + '<button class="fbt" type="button" data-c="mes" aria-pressed="' + soloMes + '" title="Quita las columnas del acumulado 2026">SÓLO EL MES</button>'
    + '<button class="fbt" type="button" data-c="totales" aria-pressed="' + totales + '" title="Pliega cada grupo a su columna de total">SÓLO TOTALES</button>');
}

/* la fila de filtros puestos, encima de la tabla: cada uno se quita con su × */
function hxBarraFiltros(s){
  var st = HX[s], tabla = $('hx-tabla-' + s);
  if(!tabla) return;
  var bar = $('hx-filtros-' + s);
  if(!bar){
    bar = document.createElement('div');
    bar.className = 'xlFiltros'; bar.id = 'hx-filtros-' + s;
    tabla.parentElement.parentElement.insertBefore(bar, tabla.parentElement);
    bar.addEventListener('click', function(ev){
      var x = ev.target.closest ? ev.target.closest('[data-fx]') : null;
      var ed = ev.target.closest ? ev.target.closest('[data-f]') : null;
      if(x){
        var c = x.getAttribute('data-fx');
        if(c === '*') HX[s].filtros = {}; else delete HX[s].filtros[c];
        hxCerrarFiltro(); hxTabla(s);
      } else if(ed){
        ev.stopPropagation();
        hxAbrirFiltro(s, ed.getAttribute('data-f'), ed);
      }
    });
  }
  if(!hxHayFiltros(st)){ bar.hidden = true; bar.innerHTML = ''; return; }
  bar.hidden = false;
  var tot = st.totalVista || st.total;
  bar.innerHTML = '<span class="t">FILTRADO · ' + fmt(tot.n) + ' DE ' + fmt(st.total.n) + ' EQUIPOS</span>'
    + Object.keys(st.filtros).map(function(col){
        return '<span class="chip"><button type="button" class="ed" data-f="' + col + '" title="Cambiar este filtro">'
          + esc(hxTextoFiltro(st, col)) + '</button><button type="button" class="x" data-fx="' + col
          + '" aria-label="Quitar este filtro" title="Quitar">×</button></span>';
      }).join('')
    + '<button type="button" class="todos" data-fx="*">QUITAR FILTROS</button>'
    + '<span class="nt">Familias, modelos y total suman sólo estos equipos; la cifra chica de debajo es la original, sin filtros. Las cifras grandes de arriba siguen siendo de toda la hoja.</span>';
}
/* la ventanita del filtro de una columna */
var hxFiltroAbierto = null;
function hxAbrirFiltro(s, col, ancla){
  var st = HX[s], cc = hxColDe(st, col);
  if(!cc) return;
  var pop = $('hx-filtroPop');
  if(!pop){
    pop = document.createElement('div');
    pop.id = 'hx-filtroPop'; pop.className = 'xlFiltroPop'; pop.setAttribute('role', 'dialog');
    document.body.appendChild(pop);
    pop.addEventListener('click', function(ev){ ev.stopPropagation(); });
    pop.addEventListener('pointerdown', function(ev){ ev.stopPropagation(); });
  }
  var f = (st.filtros || {})[col] || { op: '>', a: '', b: '' }, pc = cc.c.f === 'p';
  hxFiltroAbierto = { s: s, col: col };
  pop.innerHTML = '<div class="tt">' + esc(cc.g.t.split(' ·')[0]) + ' › <b>' + esc(cc.c.t) + '</b></div>'
    + '<label class="fl">MOSTRAR LOS EQUIPOS CON VALOR<select id="hxfOp">'
    + Object.keys(HX_OPS).map(function(k){ return '<option value="' + k + '"' + (k === f.op ? ' selected' : '') + '>' + HX_OPS[k] + '</option>'; }).join('')
    + '</select></label>'
    + '<div class="vals"><input id="hxfA" inputmode="decimal" autocomplete="off" value="' + (f.a === '' ? '' : f.a) + '" placeholder="' + (pc ? 'p. ej. 85' : 'valor') + '" aria-label="Valor">'
    + '<span id="hxfY">y</span><input id="hxfB" inputmode="decimal" autocomplete="off" value="' + (f.b === '' || f.b === undefined ? '' : f.b) + '" placeholder="' + (pc ? 'p. ej. 95' : 'valor') + '" aria-label="Segundo valor">'
    + (pc ? '<span class="u">%</span>' : '') + '</div>'
    + '<small>' + (pc ? 'En porcentaje: 85 es 85%. ' : '') + 'Se mira la cifra de cada equipo, la que se ve en la celda. Enter aplica, Esc cierra.</small>'
    + '<div class="bts"><button type="button" class="fbt" data-x="ok">APLICAR</button>'
    + ((st.filtros || {})[col] ? '<button type="button" class="fbt" data-x="quitar">QUITAR</button>' : '')
    + '<button type="button" class="fbt" data-x="no">CANCELAR</button></div>'
    + '<div class="err" id="hxfErr" aria-live="polite"></div>';
  var ver = function(){ var y = $('hxfOp').value === 'entre'; $('hxfY').hidden = !y; $('hxfB').hidden = !y; };
  ver();
  $('hxfOp').addEventListener('change', ver);
  var aplicar = function(){
    var op = $('hxfOp').value, a = hxLeerNumero($('hxfA').value), b = hxLeerNumero($('hxfB').value);
    if(a === null || (op === 'entre' && b === null)){ txt('hxfErr', 'Escribe ' + (op === 'entre' ? 'los dos valores' : 'un valor') + ' numérico.'); return; }
    st.filtros = st.filtros || {};
    st.filtros[col] = { op: op, a: a, b: op === 'entre' ? b : '' };
    hxCerrarFiltro(); hxTabla(s);
  };
  pop.onclick = function(ev){
    var b = ev.target.closest ? ev.target.closest('[data-x]') : null;
    if(!b) return;
    var x = b.getAttribute('data-x');
    if(x === 'ok') aplicar();
    else if(x === 'quitar'){ delete st.filtros[col]; hxCerrarFiltro(); hxTabla(s); }
    else hxCerrarFiltro();
  };
  pop.onkeydown = function(ev){
    if(ev.key === 'Enter'){ ev.preventDefault(); aplicar(); }
    else if(ev.key === 'Escape'){ hxCerrarFiltro(); }
  };
  pop.hidden = false;
  /* junto a la cabecera, sin salirse de la pantalla */
  var r = ancla.getBoundingClientRect(), w = Math.min(320, window.innerWidth - 20);
  pop.style.width = w + 'px';
  pop.style.left = Math.max(10, Math.min(window.innerWidth - w - 10, r.left - 20)) + 'px';
  var top = r.bottom + 6;
  if(top + 230 > window.innerHeight) top = Math.max(10, r.top - 236);
  pop.style.top = top + 'px';
  setTimeout(function(){ var a = $('hxfA'); if(a){ a.focus(); a.select(); } }, 0);
}
function hxCerrarFiltro(){
  var pop = $('hx-filtroPop');
  if(pop) pop.hidden = true;
  hxFiltroAbierto = null;
}
document.addEventListener('click', function(){ if(hxFiltroAbierto) hxCerrarFiltro(); });
/* la ventanita va fija en pantalla: si la pagina o la tabla se desplazan, se cierra */
window.addEventListener('scroll', function(ev){
  var pop = $('hx-filtroPop');
  if(hxFiltroAbierto && pop && !pop.contains(ev.target)) hxCerrarFiltro();
}, true);

function hxBuscarNodo(st, k){
  var hit = null;
  var baja = function(lista){
    lista.forEach(function(n){ if(n.k === k) hit = n; else if(!hit) baja(n.hijos); });
  };
  /* primero en lo que se ve: con filtros, una familia lleva sus sumas filtradas */
  baja(st.vista || st.arbol);
  if(!hit) baja(st.arbol);
  return hit;
}

function hxIniciar(s){
  var st = HX[s], tabla = $('hx-tabla-' + s);
  if(!tabla || !SEP || !SEP.eq) return;
  st.s = s; st.sel = null;
  st.ter = s === 'P';
  st.cols = hxColumnas(s === 'P', st);
  st.cerrado = {}; st.oculto = {}; st.filtros = {}; st.busca = ''; st.ab = {};
  st.ord = { g: 'costo', i: 3, dir: -1 };
  hxArbol(s);
  hxNivel(s, 1);
  hxCifras(s); hxBotones(s); hxTabla(s);

  var repinta = function(foco){
    hxBotones(s); hxTabla(s);
    if(foco){
      var tr = tabla.querySelector('tr[data-k="' + foco.replace(/["\\]/g, '\\$&') + '"]');
      if(tr) tr.focus();
    }
  };
  var alternar = function(k, abrir){
    var n = hxBuscarNodo(st, k);
    if(!n || !n.hijos.length) return;
    var ab = !!st.ab[k];
    if(abrir === undefined) abrir = !ab;
    if(abrir === ab) return;
    if(abrir) st.ab[k] = 1; else delete st.ab[k];
    st.nivel = -1;
    repinta(k);
  };

  tabla.addEventListener('click', function(ev){
    var el = ev.target, q = function(sel){ return el.closest ? el.closest(sel) : null; };
    /* el ▾ de una cabecera abre su filtro y no ordena la columna */
    var fb = q('[data-f]');
    if(fb){ ev.stopPropagation(); hxAbrirFiltro(s, fb.getAttribute('data-f'), fb); return; }
    var g = q('[data-g]'), cn = q('[data-cn]'), ir = q('[data-ir]'), th = q('th[data-s]'), tb = q('[data-tb]');
    var tr = q('tbody tr[data-k]'), td = q('tbody td');
    if(g){ var id = g.getAttribute('data-g'); st.cerrado[id] = !st.cerrado[id]; return repinta(); }
    var nodo = tr ? hxBuscarNodo(st, tr.getAttribute('data-k')) : null;
    /* la esquina de una celda comentada abre su comentario */
    if(cn && nodo){ hxAbrirNota(s, nodo, cn.getAttribute('data-cn')); return; }
    if(tb && nodo){ abrirTablero(st.tipo, nodo.fam, nodo.mod); return; }
    /* una cifra se elige, y la barra de arriba dice de donde sale; la primera
       columna es la que despliega, como el signo + de una dinamica */
    if(td && nodo && td.cellIndex > 0){
      var col = st.vis[td.cellIndex - 1];
      if(!col || (nodo.ot && col.indexOf('costo-') !== 0)) return;
      st.sel = { k: nodo.k, col: col };
      return repinta();
    }
    if(ir){ elegirEquipo(ir.getAttribute('data-ir')); irA('v-equipo'); return; }
    if(th){
      var p = th.getAttribute('data-s').split('|'), i = parseInt(p[1], 10);
      /* segundo clic en la misma columna invierte el orden */
      if(st.ord.g === p[0] && st.ord.i === i) st.ord.dir = -st.ord.dir;
      else st.ord = { g: p[0], i: i, dir: p[0] === '_et' ? 1 : -1 };
      return repinta();
    }
    if(tr) alternar(tr.getAttribute('data-k'));
  });
  /* el teclado, como en Excel: flechas para moverse, derecha e izquierda
     para desplegar y plegar, Enter para alternar */
  tabla.addEventListener('keydown', function(ev){
    var tr = ev.target;
    if(!tr.matches || !tr.matches('tbody tr[data-k]')) return;
    var k = tr.getAttribute('data-k');
    if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); alternar(k); }
    else if(ev.key === 'ArrowRight'){ ev.preventDefault(); alternar(k, true); }
    else if(ev.key === 'ArrowLeft'){ ev.preventDefault(); alternar(k, false); }
    else if(ev.key === 'ArrowDown' || ev.key === 'ArrowUp'){
      ev.preventDefault();
      var otro = ev.key === 'ArrowDown' ? tr.nextElementSibling : tr.previousElementSibling;
      if(otro) otro.focus();
    }
  });
  esc_('hx-nivel-' + s, 'click', function(ev){
    var b = ev.target.closest ? ev.target.closest('[data-n]') : null;
    if(!b) return;
    hxNivel(s, parseInt(b.getAttribute('data-n'), 10));
    repinta();
  });
  esc_('hx-cols-' + s, 'click', function(ev){
    var b = ev.target.closest ? ev.target.closest('[data-c]') : null;
    if(!b) return;
    var c = b.getAttribute('data-c');
    st.cerrado = {}; st.oculto = {};
    st.cols.forEach(function(g){
      if(c === 'totales') st.cerrado[g.id] = true;
      if(c === 'mes' && g.ac) st.oculto[g.id] = true;
    });
    /* si se ordenaba por una columna que ya no esta, vuelve al costo total */
    if(st.oculto[st.ord.g]) st.ord = { g: 'costo', i: 3, dir: -1 };
    repinta();
  });
  esc_('hx-ter-' + s, 'click', function(ev){
    var b = ev.target.closest ? ev.target.closest('[data-t]') : null;
    if(!b) return;
    hxPonerTer(s, b.getAttribute('data-t') === '1');
  });
  esc_('hx-origen-' + s, 'click', function(ev){
    var b = ev.target.closest ? ev.target.closest('[data-com]') : null, n = st.sel ? hxBuscarNodo(st, st.sel.k) : null;
    if(b && n) hxAbrirNota(s, n, st.sel.col);
  });
  var temp = null;
  esc_('hx-buscar-' + s, 'input', function(){
    var v = this.value;
    clearTimeout(temp);
    temp = setTimeout(function(){ st.busca = v; hxTabla(s); }, 140);
  });
}

HX_NOTAS = hxNotasLocal();
['P', 'A'].forEach(hxIniciar);

esc_('hx-ed-cerrar', 'click', hxCerrarNota);
esc_('hx-ed-guardar', 'click', function(){ hxGuardarNota($('hx-ed-txt').value.trim().slice(0, 4000)); });
esc_('hx-ed-borrar', 'click', function(){ hxGuardarNota(''); });
esc_('hx-ed-txt', 'keydown', function(ev){
  if(ev.key === 'Escape') hxCerrarNota();
  if(ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) hxGuardarNota(this.value.trim().slice(0, 4000));
});

/* Con la pagina publicada los comentarios van al almacen compartido del
   artifact y los ve quien la abra. Si no hay almacen (vista previa local,
   sesion sin iniciar) quedan en este navegador, y se dice. */
if(window.claude && typeof window.claude.use === 'function'){
  window.claude.use('user').then(function(u){
    hxUser = u;
    return u ? u.id() : null;
  }).then(function(id){ hxUid = id; }, function(){});
  window.claude.use('db').then(function(db){
    if(!db) return;
    hxDb = db;
    db.collection('notas').onSnapshot(function(snap){
      var m = {};
      snap.docs.forEach(function(d){
        var x = d.data();
        if(x && x.texto) m[d.id] = { texto: String(x.texto), autor: x.autor || null, ts: x.ts || '' };
      });
      HX_NOTAS = m;
      hxPintarTodo();
    }, function(){ hxDb = null; HX_NOTAS = hxNotasLocal(); hxPintarTodo(); });
  }, function(){});
}

/* Las tarjetas de flota del inicio llevaban a la hoja Flota, que ya no
   existe: dejan puesto el filtro y abren Tendencia, que lo ensena. */
function verFlota(n){
  modFiltro = 'TODOS'; provFiltro = 'TODOS'; eqFiltro = 'TODOS';
  ponerFiltroEq('fam', n);
  irA('v-costos');
}
