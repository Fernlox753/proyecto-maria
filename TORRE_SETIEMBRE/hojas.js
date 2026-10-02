/* ══════════════════════════════════════════════════════════════════
   HOJAS PROPIOS Y ALQUILADOS — el consolidado, en tabla

   Sustituyen a la hoja Flota. Son las hojas PROP y ALQ de cada proyecto
   (SHGN, ATOC, TRMA, TEMB) tal como se leen en el Excel, en una sola tabla
   que se despliega como su dinamica: familia > modelo > equipo > orden de
   trabajo. Solo entran los equipos de los proyectos elegidos (proyecto.js).

   Todo sale de SETIEMBRE.eq (la fila completa de cada equipo) y de
   SETIEMBRE.ots (sus ordenes). Familias y modelos se suman aqui, asi que
   no puede haber dos cifras distintas para lo mismo.

   En cada fila  c = costo real  y  v = venta interna, los dos como
   [RyM, MOV, Dep o Alq, total]; A es el acumulado del anio. En alquilados
   los totales NO suman el tercer componente, igual que en el Excel.
   ══════════════════════════════════════════════════════════════════ */
var HX = { P: { tipo: 'PROPIO' }, A: { tipo: 'ALQUILADO' }, T: { tipo: '*' } };
/* T: FLOTA COMPLETA, las dos hojas en una. Cada fila lleva los cuatro
   componentes por separado —c, v y A.v = [RyM, MOV, Dep, Alq]; A.c =
   [RyM, MOV, Dep, Alq, Seg]— y cuantos equipos propios (np) y alquilados
   (nq) suma: sin propios la columna Dep va con guion, sin alquilados la de
   Alq. Dep y Alq entran al total con dos botones propios (terD, terA). */
var HX_HOJAS = ['P', 'A', 'T'];
function hxSeccion(s){ return s === 'A' ? 'v-alquilados' : s === 'T' ? 'v-toda' : 'v-propios'; }
function hxTcT(st, o){ return o.c[0] + o.c[1] + (st.terD && o.np ? o.c[2] : 0) + (st.terA && o.nq ? o.c[3] : 0); }
function hxTvT(st, o){ return o.v[0] + o.v[1] + (st.terD && o.np ? o.v[2] : 0) + (st.terA && o.nq ? o.v[3] : 0); }
function hxTacT(st, o){ return o.A.c[0] + o.A.c[1] + (st.terD && o.np ? o.A.c[2] : 0) + (st.terA && o.nq ? o.A.c[3] : 0); }
function hxTavT(st, o){ return o.A.v[0] + o.A.v[1] + (st.terD && o.np ? o.A.v[2] : 0) + (st.terA && o.nq ? o.A.v[3] : 0); }
/* el tipo de flota de una fila de FLOTA COMPLETA, si es uno solo (para el TABLERO) */
function hxTipoNodo(st, n){
  if(st.s !== 'T') return st.tipo;
  if(n.id && SEP.eq[n.id]) return SEP.eq[n.id].tipo;
  var o = n.o || {};
  return o.np && !o.nq ? 'PROPIO' : o.nq && !o.np ? 'ALQUILADO' : null;
}
var HX_NIVELES = ['FAMILIA', 'MODELO', 'EQUIPO', 'FASE', 'ORDEN'];
var HX_FASES = { LU: 'LUBRICACIÓN', MM: 'MANTENIMIENTO MECÁNICO', LL: 'LLANTAS', ED: 'ELEMENTOS DE DESGASTE',
                 RM: 'REPARACIÓN MAYOR', CA: 'CARRILERÍA' };
/* debajo del equipo van sus fases y debajo de cada fase sus ordenes. Las dos
   llevan ot: 1 (solo tienen costo); la fase ademas esFase: 1 */
function hxFases(id){
  var por = {}, orden = [];
  ((SEP.ots || {})[id] || []).forEach(function(r){
    var f = r[1] || '';
    if(!por[f]){ por[f] = []; orden.push(f); }
    por[f].push({ k: 'o|' + r[0], lv: 4, et: r[0], sub: r[2], ot: 1, fase: f,
                  o: { c: [r[3], r[4], 0, r[3] + r[4]] }, hijos: [] });
  });
  return orden.map(function(f){ return hxNodoFase(id, f, por[f]); });
}
function hxNodoFase(id, f, os){
  var rym = 0, mov = 0;
  os.forEach(function(o){ rym += o.o.c[0]; mov += o.o.c[1]; });
  return { k: 'fa|' + id + '|' + f, lv: 3, et: HX_FASES[f] || f || '(SIN FASE)', fase: f, ot: 1, esFase: 1,
           sub: os.length + (os.length === 1 ? ' orden' : ' órdenes'), o: { c: [rym, mov, 0, rym + mov] }, hijos: os };
}
/* el orden de los niveles del medio (modelo, equipo, fase) se elige
   arrastrando sus botones; familia va siempre primero y orden al final.
   Un nivel que queda por debajo de la fase solo tiene costo (ot: 1): horas,
   venta y depreciacion no se reparten por fase. */
var HX_NIV_NOM = { mod: 'MODELO', eq: 'EQUIPO', fa: 'FASE' };
var HX_NIV_LOG = { mod: 1, eq: 2, fa: 3 };      /* su indice en HX_ELEG / HX_NIVELES */
function hxOrdenNiv(st){ return (st && st.ordenNiv) || ['mod', 'eq', 'fa']; }
function hxEsNormal(st){ return hxOrdenNiv(st).join() === 'mod,eq,fa'; }
function hxNivelesDe(st){
  return ['FAMILIA'].concat(hxOrdenNiv(st).map(function(k){ return HX_NIV_NOM[k]; })).concat(['ORDEN']);
}
/* posicion en la tabla (0-4) de cada nivel logico (0 familia ... 4 orden) */
function hxPosDe(st, logico){
  if(logico === 0 || logico === 4) return logico;
  var k = ['fam', 'mod', 'eq', 'fa'][logico];
  return 1 + hxOrdenNiv(st).indexOf(k);
}
/* bajo una familia, los niveles en el orden pedido. recs: [{ e, fa }] con fa
   en null hasta que el nivel FASE parte cada equipo en sus fases */
function hxArmar(recs, niv, lv, pk, fam, eqArriba){
  if(!niv.length){
    var os = [];
    recs.forEach(function(r){ os = os.concat(r.fa ? r.fa.hijos : hxOrdenes(r.e)); });
    return os;
  }
  var k = niv[0], resto = niv.slice(1), grupos = {}, orden = [];
  if(k === 'fa'){
    var nuevos = [];
    recs.forEach(function(r){ r.e.hijos.forEach(function(fa){ nuevos.push({ e: r.e, fa: fa }); }); });
    recs = nuevos;
  }
  var partido = recs.length && !!recs[0].fa;
  recs.forEach(function(r){
    var v = k === 'mod' ? r.e.mod : k === 'eq' ? r.e.id : r.fa.fase;
    if(!grupos[v]){ grupos[v] = []; orden.push(v); }
    grupos[v].push(r);
  });
  return orden.map(function(v){
    var rs = grupos[v], eqs = [];
    rs.forEach(function(r){ if(eqs.indexOf(r.e) < 0) eqs.push(r.e); });
    var n = { lv: lv, fam: fam, hijos: null };
    /* las claves de equipo y de modelo bajo la familia son las de siempre:
       asi se conservan los comentarios y lo abierto */
    if(k === 'eq' && !partido) n.k = 'e|' + v;
    else if(k === 'mod' && !partido && lv === 1) n.k = 'm|' + fam + '|' + v;
    else n.k = pk + '>' + k + ':' + v;
    if(k === 'mod'){ n.esMod = 1; n.mod = v; n.et = v || '(sin modelo)'; }
    if(k === 'eq'){ var e = rs[0].e; n.id = e.id; n.et = e.id; n.busca = e.busca; n.mod = e.mod; }
    if(k === 'fa'){ n.esFase = 1; n.fase = v; n.et = HX_FASES[v] || v || '(SIN FASE)'; }
    if(partido){
      var rym = 0, mov = 0, nos = 0;
      rs.forEach(function(r){ rym += r.fa.o.c[0]; mov += r.fa.o.c[1]; nos += r.fa.hijos.length; });
      n.o = { c: [rym, mov, 0, rym + mov] }; n.ot = 1;
      n.sub = (k === 'eq' || eqArriba) && eqs.length === 1 ? nos + (nos === 1 ? ' orden' : ' órdenes')
            : eqs.length + (eqs.length === 1 ? ' equipo' : ' equipos');
    } else {
      n.o = eqs.length === 1 && k === 'eq' ? eqs[0].o : hxSuma(eqs.map(function(e){ return e.o; }));
      if(k === 'eq') n.sub = rs[0].e.sub;
    }
    n.hijos = hxArmar(rs, resto, lv + 1, n.k, fam, eqArriba || k === 'eq');
    return n;
  });
}
/* la vista con otro orden: se rearma bajo cada familia (las familias y sus
   cifras no cambian; el arbol original no se toca) */
function hxVistaOrden(st){
  if(hxEsNormal(st)) return;
  var niv = hxOrdenNiv(st);
  st.vista = st.vista.map(function(f){
    var recs = [];
    f.hijos.forEach(function(m){ m.hijos.forEach(function(e){ recs.push({ e: e, fa: null }); }); });
    var c = {}, k;
    for(k in f) c[k] = f[k];
    c.hijos = hxArmar(recs, niv, 1, f.k, f.fam, false);
    return c;
  });
}
/* cuantas ordenes cuelgan de una fila */
function hxNOrdenes(n){
  if(/^o\|/.test(n.k || '')) return 1;
  var t = 0;
  (n.hijos || []).forEach(function(h){ t += hxNOrdenes(h); });
  return t;
}
/* las ordenes de un equipo, de todas sus fases */
function hxOrdenes(e){
  var out = [];
  (e.hijos || []).forEach(function(f){ out = out.concat(f.esFase ? f.hijos : [f]); });
  return out;
}

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
  /* primero la operacion y despues el costo: el orden de los grupos es solo
     de vista; comentarios, orden y filtros van por el id del grupo */
  return [
    { id: 'oper', t: 'OPERACIÓN', cols: [
      /* sem: semaforo de la celda, verde desde ese valor y rojo por debajo */
      { t: '% DM', f: 'p', sem: 85, v: function(o){ return o.dm; } },
      { t: '% Uso', f: 'p', v: function(o){ return o.use; } },
      { t: 'Horas real', f: 'n1', k: 1, v: function(o){ return o.hr; } },
      { t: 'HM prof', f: 'n', v: function(o){ return o.hrProf; } } ] },
    { id: 'costo', t: 'COSTO REAL AL ' + hxCorte(), cols: [
      { t: 'RyM', f: 'n', v: function(o){ return o.c[0]; } },
      { t: 'MOV', f: 'n', v: function(o){ return o.c[1]; } },
      { t: t, f: 'n', t3: 1, v: function(o){ return o.c[2]; } },
      { t: 'Total', f: 'n', k: 1, v: tc } ] },
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
function hxColumnasT(st){
  var por = function(x, h){ return h ? x / h : null; };
  var per = (SEP.acumPeriodos || []).length;
  var D = function(o, x){ return o.np ? x : null; }, Q = function(o, x){ return o.nq ? x : null; };
  var tc = function(o){ return hxTcT(st, o); }, tv = function(o){ return hxTvT(st, o); };
  var tac = function(o){ return hxTacT(st, o); }, tav = function(o){ return hxTavT(st, o); };
  /* las cuatro columnas de un grupo: f(o, i) da el valor del componente i.
     Dep y Alq quedan en gris cuando su boton los saca del total (fuera); en
     las desviaciones (desv) ademas van con guion: sin el componente no hay
     desviacion que mirar. Asi el alquiler de tarifa mensual, que el Excel
     vende por horas, no asoma como desviacion con SIN ALQ. */
  var sinD = function(){ return !st.terD; }, sinA = function(){ return !st.terA; };
  var cuatro = function(f, fm, desv){
    return [{ t: 'RyM', f: fm, v: function(o){ return f(o, 0); } },
            { t: 'MOV', f: fm, v: function(o){ return f(o, 1); } },
            { t: 'Dep', f: fm, fuera: sinD, v: function(o){ return desv && !st.terD ? null : D(o, f(o, 2)); } },
            { t: 'Alq', f: fm, fuera: sinA, v: function(o){ return desv && !st.terA ? null : Q(o, f(o, 3)); } }];
  };
  return [
    { id: 'oper', t: 'OPERACIÓN', cols: [
      { t: '% DM', f: 'p', sem: 85, v: function(o){ return o.dm; } },
      { t: '% Uso', f: 'p', v: function(o){ return o.use; } },
      { t: 'Horas real', f: 'n1', k: 1, v: function(o){ return o.hr; } },
      { t: 'HM prof', f: 'n', v: function(o){ return o.hrProf; } } ] },
    { id: 'costo', t: 'COSTO REAL AL ' + hxCorte(), cols: cuatro(function(o, i){ return o.c[i]; }, 'n')
        .concat([{ t: 'Total', f: 'n', k: 1, v: tc }]) },
    { id: 'venta', t: 'VENTA INTERNA AL ' + hxCorte(), cols: cuatro(function(o, i){ return o.v[i]; }, 'n')
        .concat([{ t: 'Total', f: 'n', k: 1, v: tv }]) },
    { id: 'desv', t: 'DESVIACIÓN VENTA − COSTO', cols: cuatro(function(o, i){ return o.v[i] - o.c[i]; }, 'd', true)
        .concat([{ t: 'Total', f: 'd', k: 1, v: function(o){ return tv(o) - tc(o); } }]) },
    { id: 'treal', t: 'TARIFA REAL US$/H', cols: cuatro(function(o, i){ return por(o.c[i], o.hr); }, 'n1')
        .concat([{ t: 'Real', f: 'n1', k: 1, v: function(o){ return por(tc(o), o.hr); } }]) },
    { id: 'tventa', t: 'TARIFA DE VENTA US$/H', cols: cuatro(function(o, i){ return por(o.v[i], o.hr); }, 'n1')
        .concat([{ t: 'Venta', f: 'n1', k: 1, v: function(o){ return por(tv(o), o.hr); } }]) },
    { id: 'tacum', ac: 1, t: 'TARIFA ACUMULADA US$/H', cols: cuatro(function(o, i){ return por(o.A.c[i], o.A.h); }, 'n1')
        .concat([{ t: 'Real acum', f: 'n1', k: 1, v: function(o){ return por(tac(o), o.A.h); } }]) },
    { id: 'cacum', ac: 1, t: 'COSTO ACUMULADO 2026 · ' + per + ' MESES + SET', cols: cuatro(function(o, i){ return o.A.c[i]; }, 'n')
        .concat([{ t: 'Seg', f: 'n', v: function(o){ return o.A.c[4]; } },
                 { t: 'Costo acum', f: 'n', k: 1, v: tac },
                 { t: 'Horas acum', f: 'n1', v: function(o){ return o.A.h; } }]) },
    { id: 'vacum', ac: 1, t: 'VENTA ACUMULADA 2026', cols: cuatro(function(o, i){ return o.A.v[i]; }, 'n')
        .concat([{ t: 'Venta acum', f: 'n', k: 1, v: tav }]) },
    { id: 'dacum', ac: 1, t: 'DESVIACIÓN ACUMULADA', cols: cuatro(function(o, i){ return o.A.v[i] - o.A.c[i]; }, 'd', true)
        .concat([{ t: 'Total', f: 'd', k: 1, v: function(o){ return tav(o) - tac(o); } }]) }
  ];
}
/* la columna del total de cada hoja (para ordenar por ella) */
function hxIdxTotal(s){ return s === 'T' ? 4 : 3; }
function hxCorte(){ return ((SEP && SEP.corte) || '').replace(/\D/g, '') || '—'; }

/* ---------- el arbol ---------- */
function hxCero(){ return { c: [0, 0, 0, 0], v: [0, 0, 0, 0], hr: 0, hrProf: 0, dm: null, use: null, n: 0, np: 0, nq: 0,
                            A: { c: [0, 0, 0, 0, 0], h: 0, v: [0, 0, 0, 0] } }; }
/* varias filas en una. DM y uso son el promedio simple de los equipos que
   lo tienen, que es lo que hace el PROMEDIO.SI del Excel. */
function hxSuma(filas){
  var o = hxCero(), sd = 0, nd = 0, su = 0, nu = 0, i;
  filas.forEach(function(f){
    for(i = 0; i < 4; i++){ o.c[i] += f.c[i]; o.v[i] += f.v[i]; o.A.v[i] += f.A.v[i]; }
    for(i = 0; i < 5; i++) o.A.c[i] += f.A.c[i];
    o.A.h += f.A.h; o.hr += f.hr; o.hrProf += f.hrProf; o.n += f.n;
    o.np += f.np || 0; o.nq += f.nq || 0;
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
  /* solo los equipos de los proyectos elegidos (proyecto.js) */
  for(id in q) if((st.tipo === '*' || q[id].tipo === st.tipo) && sedeOk(q[id].sede)){
    var x = q[id], pr = x.tipo === 'PROPIO';
    var sub = s === 'T' ? (pr ? 'propio' : 'alquilado' + (x.prov ? ' · ' + x.prov.slice(0, 18) : ''))
                        : x.prov && s === 'A' ? x.prov.slice(0, 24) : '';
    /* en T el tercer componente va a Dep o a Alq segun la flota del equipo */
    var c4 = function(a){ return s === 'T' ? [a[0], a[1], pr ? a[2] : 0, pr ? 0 : a[2]] : a; };
    var A = s === 'T' ? { c: c4(x.A.c).concat([x.A.c[3]]), h: x.A.h, v: c4(x.A.v) } : x.A;
    var e = { k: 'e|' + id, lv: 2, et: id, fam: x.fam, mod: x.mod, sub: sub, id: id,
              busca: (id + ' ' + x.mod + ' ' + x.fam + ' ' + (x.prov || '') + (s === 'T' ? ' ' + x.tipo : '')).toUpperCase(),
              o: { c: c4(x.c), v: c4(x.v), hr: x.hr || 0, hrProf: x.hrProf || 0, dm: x.dm, use: x.use, n: 1, A: A,
                   np: pr ? 1 : 0, nq: pr ? 0 : 1,
                   sd: x.dm === null || x.dm === undefined ? 0 : x.dm, nd: x.dm === null || x.dm === undefined ? 0 : 1,
                   su: x.use === null || x.use === undefined ? 0 : x.use,
                   nu: x.use === null || x.use === undefined ? 0 : 1 },
              hijos: hxFases(id) };
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
      /* el semaforo mira la cifra como se ve (redondeada), igual que los filtros */
      if(c.sem !== undefined){
        var vs = hxValorFiltro(c, n.o);
        if(vs !== null) h = '<span class="sem ' + (vs >= c.sem ? 'v' : 'r') + '">' + h + '</span>';
      }
      var sel = st.sel && n.k && st.sel.k === n.k && st.sel.col === col;
      return '<td class="g-' + g.id + (i ? '' : ' ini') + (m ? ' cn' : '') + (sel ? ' sel' : '') + (c.fuera && c.fuera() ? ' fuera' : '') + '">'
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
              : (esProp ? 'La depreciación está fuera (botón SIN DEP); el Excel sí la suma.' : 'El alquiler no se suma, igual que en las hojas ALQ.'));
}
/* los proyectos de los equipos que cuelgan de una fila */
function hxSedesDe(n){
  var ss = [];
  var junta = function(x){
    var q = x.id && SEP.eq[x.id];
    if(q && ss.indexOf(q.sede) < 0) ss.push(q.sede);
    (x.hijos || []).forEach(junta);
  };
  junta(n);
  if(!ss.length) ss = sedesL().filter(sedeOk);
  return ss.sort(function(a, b){ return sedesL().indexOf(a) - sedesL().indexOf(b); });
}
function hxNivelOrigen(st, n){
  return n.esTot ? ' Alcance: suma de los ' + n.o.n + ' equipos de la tabla' + (hxHayRecorte(st) ? ' que quedan con la selección y los filtros.' : '.')
            : /^o\|/.test(n.k || '') ? ' Alcance: sólo las líneas de esta orden de trabajo.'
            : n.ot ? ' Alcance: sólo el costo de las ' + hxNOrdenes(n) + ' órdenes que cuelgan de esta fila'
                     + (n.esFase ? ' (fase ' + n.et + ')' : '') + '; horas, venta y depreciación no se reparten por fase.'
            : n.id ? ' Alcance: sólo este equipo.'
            : n.esMod && n.lv > 1 ? ' Alcance: suma de los ' + n.o.n + ' equipos de este modelo en esta rama.'
            : n.lv === 2 ? ' Alcance: sólo este equipo.'
            : ' Alcance: suma de los ' + n.o.n + ' equipos de ' + (n.lv === 0 ? 'esta familia.' : 'este modelo.');
}
/* FLOTA COMPLETA: Dep se explica como en la hoja PROP y Alq como en la ALQ; en
   las demas columnas, una fila de una sola flota como la hoja de esa flota y
   una mezclada con las dos explicaciones */
function hxOrigen(st, n, col){
  if(st.s !== 'T') return hxOrigenPA(st, n, col);
  var p = col.split('-'), g = p[0], i = parseInt(p[1], 10);
  if(g === 'oper') return hxOrigenPA(HX.P, n, col, true) + hxNivelOrigen(st, n);
  var esDep = i === 2, esAlq = i === 3, nTot = g === 'cacum' ? 5 : 4;
  var ps = function(x){ return { s: x, tipo: x === 'P' ? 'PROPIO' : 'ALQUILADO', ter: x === 'P' ? st.terD : st.terA, cols: HX[x].cols }; };
  var mc = g + '-' + (i <= 1 ? i : i <= 3 ? 2 : i - 1);
  if(i === nTot && { costo: 1, venta: 1, cacum: 1, vacum: 1 }[g]){
    var que = { costo: 'Costo', venta: 'Venta', cacum: 'Costo acumulado', vacum: 'Venta acumulada' }[g];
    return que + ' = RyM + MOV' + (st.terD ? ' + Dep de los propios' : '') + (st.terA ? ' + Alq de los alquilados' : '')
      + ' de esta misma fila. ' + (st.terD ? '' : 'La depreciación está fuera (botón DEP); el Excel sí la suma. ')
      + (st.terA ? 'El alquiler está sumado (botón ALQ): sale de la tarifa de venta, no es un costo real.' : 'El alquiler no se suma, igual que en las hojas ALQ.')
      + hxNivelOrigen(st, n);
  }
  var tipo = esDep ? 'P' : esAlq ? 'A' : (n.o && n.o.np && !n.o.nq ? 'P' : n.o && n.o.nq && !n.o.np ? 'A' : null);
  if(tipo) return hxOrigenPA(ps(tipo), n, mc, true) + hxNivelOrigen(st, n);
  var x = hxOrigenPA(ps('P'), n, mc, true), y = hxOrigenPA(ps('A'), n, mc, true);
  return (x === y ? x : 'PROPIOS: ' + x + ' ALQUILADOS: ' + y) + hxNivelOrigen(st, n);
}
function hxOrigenPA(st, n, col, sinNivel){
  var esProp = st.s === 'P', p = col.split('-'), g = p[0], i = parseInt(p[1], 10);
  var corte = hxCorte(), t3 = esProp ? 'Dep' : 'Alq', dias = SEP.diasMes || 30;
  /* la hoja de reporte de la fila: la de su proyecto, o la de cada uno */
  var ss = hxSedesDe(n), suf = esProp ? ' PROP' : ' ALQ';
  var hoja = ss.length === 1 ? 'la hoja ' + ss[0] + suf : 'las hojas ' + ss.map(function(s){ return s + suf; }).join(', ');
  var vs = (META.val || {}).sedes || {};
  var regla = ss.map(function(s){
    var r = ((vs[s] || {}).reglas || {})[st.tipo] || {}, x = [];
    for(var c in r) if(c !== 'TIPO') x.push(c + ' = ' + r[c].map(function(v){ return v === '(vacío)' ? 'sin marcar' : v; }).join(' · '));
    return (ss.length > 1 ? s + ': ' : '') + (x.length ? x.join(', ') : 'ningún otro filtro');
  }).join(' | ');
  var base = 'Recalculado desde la hoja BASE DATOS ' + (ss.length === 1 ? 'del libro de ' + ss[0] : 'del libro de cada proyecto')
           + ', columna COSTO RYM, con los filtros de la dinámica de ' + hoja + ' (equipo ' + st.tipo + '; ' + regla
           + '), hasta el día ' + corte + '. Cuadra con la hoja equipo por equipo.';
  /* lo que en el Excel es formula se toma de la fila del equipo, tal cual */
  var de = function(bloque, rot){ return 'Columna «' + rot + '» del bloque «' + bloque + '» de ' + hoja + ', tal cual.'; };
  var nivel = hxNivelOrigen(st, n);
  var grupo = n.lv < 2 && !n.id ? ' En un grupo es la suma de sus equipos.' : '';
  var nomC = ['RyM', 'MOV', t3, 'Total'];
  var porDias = (esProp ? SEP.depPorDias : SEP.alqPorDias) || [];
  var o = '';
  if(g === 'costo') o = [
      base + ' Filas con RECURSO = MAT o SERV: materiales (descarga Z MAT) y servicios (Z SERV). Es la columna RYM del costo real.',
      base + ' Filas con RECURSO = MO: horas hombre aplicadas (descarga Z HH). Es la columna MOV del costo real.',
      esProp ? de('Costo Real al ' + corte, 'Dep') + ' En el Excel es la tarifa de depreciación de la proforma × horas reales'
               + (porDias.length ? '; ' + porDias.join(', ') + ' van por días (importe del mes ÷ ' + dias + ' × ' + corte + ')' : '') + '.' + grupo
             : 'NO ES UN COSTO REAL. ' + de('Costo Real al ' + corte, 'Alq') + ' En el Excel es la tarifa de VENTA de alquiler × horas reales'
               + (porDias.length ? '; ' + porDias.join(', ') + ' tienen tarifa mensual y van por días' : '') + '. '
               + (st.ter ? 'Está sumado al total (botón CON ALQ).' : 'NO entra al total.') + grupo,
      hxOrTot(st, 'Costo')][i];
  else if(g === 'oper') o = [
      de('%DM', '%DM') + (n.lv < 2 ? ' En un grupo es el promedio simple de los equipos que tienen dato.' : ''),
      de('%Utiliz.', '%Utiliz.') + (n.lv < 2 ? ' En un grupo es el promedio simple de los equipos que tienen dato.' : ''),
      de('Hras Real al ' + corte, 'Hras Real') + ' Son las horas del horómetro de SAP hasta el día ' + corte + '.' + grupo,
      de('Hras Prof (mes)', 'Hras Prof') + ' Son las horas proformadas para TODO el mes, no sólo hasta el día ' + corte + '.' + grupo][i];
  else if(g === 'venta') o = i < 3 ? de('Venta Interna al ' + corte, nomC[i]) + ' En el Excel es la tarifa de venta × horas reales.'
                                     + (!esProp && i === 2 ? ' Es la misma cifra que la columna Alq del costo: las dos salen de la tarifa de venta.' : '')
                                     + (!st.ter && i === 2 ? ' No entra al total.' : '') + grupo
                                  : hxOrTot(st, 'Venta');
  else if(g === 'desv') o = 'Venta interna − costo real, columna ' + nomC[i] + '. Negativo (rojo): se gastó más de lo que la venta da.';
  else if(g === 'treal') o = 'Costo real ' + nomC[i] + ' ÷ horas reales.';
  else if(g === 'tventa') o = 'Venta interna ' + nomC[i] + ' ÷ horas reales. En un grupo es el promedio ponderado por horas.';
  else if(g === 'tacum') o = ['Costo acumulado RyM', 'Costo acumulado MOV', 'Costo acumulado ' + t3, 'Costo acumulado total'][i] + ' ÷ horas acumuladas.';
  else if(g === 'cacum') o = i === 4 ? hxOrTot(st, 'Costo acumulado')
      : de('Acumulado 2026', ['RYM', 'MOV', t3, 'Seg', '', 'Horas'][i]) + ' Es el libro mayor del año más el mes, como lo arma el Excel.' + grupo;
  else if(g === 'vacum') o = i < 3 ? de('Acumulado 2026 (venta)', nomC[i]) + grupo : hxOrTot(st, 'Venta acumulada');
  else if(g === 'dacum') o = 'Venta acumulada − costo acumulado, columna ' + nomC[i] + '.';
  return sinNivel ? o : o + nivel;
}
function hxBarraOrigen(s){
  var st = HX[s], el = $('hx-origen-' + s);
  if(!el) return;
  var n = st.sel ? hxBuscarNodo(st, st.sel.k) : null;
  if(!n){
    el.innerHTML = '<span class="fx">fx</span><span class="txt">Haz clic en cualquier cifra para ver <b>de dónde sale</b> '
      + 'y comentarla. Para desplegar una fila, clic en la primera columna.</span>';
    txt('hx-origenRes-' + s, 'DE DÓNDE SALE CADA CIFRA · haz clic en una celda');
    return;
  }
  var col = st.sel.col, p = col.split('-'), gr = null;
  st.cols.forEach(function(g){ if(g.id === p[0]) gr = g; });
  var cc = gr.cols[parseInt(p[1], 10)];
  var valor = hxCelda(cc, n.o).replace(/<[^>]+>/g, '');
  var nota = (HX_NOTAS[hxClaveNota(s, n, col)] || {}).texto;
  /* plegado, el resumen dice que celda es y cuanto vale */
  htm('hx-origenRes-' + s, '<b>' + esc(n.et) + ' · ' + esc(hxTituloCol(st, col)) + ' = ' + esc(valor) + '</b>'
    + (nota ? ' · comentada' : '') + ' · despliega para ver de dónde sale' + (nota ? '' : ' o comentarla'));
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

/* ---------- SELECCIONAR: elegir que familias, modelos, equipos u ordenes se ven ----------
   st.eleg guarda lo elegido por nivel (claves de nodo de familia y modelo,
   codigo de equipo, numero de orden). Vacio es todo. Cada nivel solo ofrece
   lo que queda dentro de lo elegido en los niveles de arriba. */
var HX_ELEG = ['fam', 'mod', 'eq', 'fa', 'ot'];
var HX_ELEG_PL = ['FAMILIAS', 'MODELOS', 'EQUIPOS', 'FASES', 'ÓRDENES'];
function hxHayEleccion(st){
  var x = st.eleg;
  return !!(x && (x.fam.length || x.mod.length || x.eq.length || x.fa.length || x.ot.length));
}
function hxHayRecorte(st){ return hxHayFiltros(st) || hxHayEleccion(st); }
function hxPasaEleccion(st, f, m, e){
  var x = st.eleg;
  if(!x) return true;
  if(x.fam.length && x.fam.indexOf(f.k) < 0) return false;
  if(x.mod.length && x.mod.indexOf(m.k) < 0) return false;
  if(x.eq.length && x.eq.indexOf(e.id) < 0) return false;
  /* con fases u ordenes elegidas, el equipo tiene que tener alguna */
  if(x.fa.length || x.ot.length){
    return e.hijos.some(function(fa){
      if(x.fa.length && x.fa.indexOf(fa.fase) < 0) return false;
      return !x.ot.length || fa.hijos.some(function(o){ return x.ot.indexOf(o.et) >= 0; });
    });
  }
  return true;
}
/* las opciones de un nivel, dentro de lo elegido arriba */
function hxOpciones(st, i){
  var x = st.eleg, out = [], fases = {}, orden = [];
  st.arbol.forEach(function(f){
    if(i === 0){ out.push({ v: f.k, t: f.et, d: f.o.n + (f.o.n === 1 ? ' equipo' : ' equipos') }); return; }
    if(x.fam.length && x.fam.indexOf(f.k) < 0) return;
    f.hijos.forEach(function(m){
      if(i === 1){ out.push({ v: m.k, t: m.et, d: f.et }); return; }
      if(x.mod.length && x.mod.indexOf(m.k) < 0) return;
      m.hijos.forEach(function(e){
        if(i === 2){ out.push({ v: e.id, t: e.id, d: m.et + (e.sub ? ' · ' + e.sub : '') }); return; }
        if(x.eq.length && x.eq.indexOf(e.id) < 0) return;
        e.hijos.forEach(function(fa){
          if(i === 3){
            /* una fase se ofrece una vez, con cuantas ordenes y equipos la tienen */
            if(!fases[fa.fase]){ fases[fa.fase] = { n: 0, eqs: 0, t: fa.et }; orden.push(fa.fase); }
            fases[fa.fase].n += fa.hijos.length; fases[fa.fase].eqs++;
            return;
          }
          if(x.fa.length && x.fa.indexOf(fa.fase) < 0) return;
          fa.hijos.forEach(function(o){ out.push({ v: o.et, t: o.et, d: e.id + ' · ' + fa.et + ' · ' + o.sub }); });
        });
      });
    });
  });
  if(i === 3) out = orden.map(function(c){
    var z = fases[c];
    return { v: c, t: z.t, d: z.n + (z.n === 1 ? ' orden' : ' órdenes') + ' · ' + z.eqs + (z.eqs === 1 ? ' equipo' : ' equipos') };
  });
  return out;
}
/* al cambiar un nivel, los de abajo pierden lo que quedo fuera */
function hxPodarEleccion(st, desde){
  for(var j = desde + 1; j < HX_ELEG.length; j++){
    var k = HX_ELEG[j];
    if(!st.eleg[k].length) continue;
    var ok = {};
    hxOpciones(st, j).forEach(function(o){ ok[o.v] = 1; });
    st.eleg[k] = st.eleg[k].filter(function(v){ return ok[v]; });
  }
}
function hxNombreEleg(st, i, v){
  if(i === 0) return v.replace(/^f\|/, '');
  if(i === 1) return v.split('|').slice(2).join('|') || '(sin modelo)';
  if(i === 3) return HX_FASES[v] || v || '(SIN FASE)';
  return v;
}
function hxPasaFiltros(st, e){
  for(var col in st.filtros){
    var cc = hxColDe(st, col);
    if(cc && !hxCumple(st.filtros[col], cc.c, hxValorFiltro(cc.c, e.o))) return false;
  }
  return true;
}
/* el arbol que se ve: con filtros, solo los equipos que pasan y sumas nuevas */
function hxArbolVista(st){
  if(!hxHayRecorte(st)){ st.vista = st.arbol; st.totalVista = st.total; hxVistaOrden(st); return; }
  /* con fases u ordenes elegidas, cada equipo ensena solo esas fases y
     ordenes (la suma de cada fase es la de sus ordenes a la vista) */
  var fas = st.eleg && st.eleg.fa.length ? st.eleg.fa : null;
  var ots = st.eleg && st.eleg.ot.length ? st.eleg.ot : null;
  st.vista = st.arbol.map(function(f){
    var mods = f.hijos.map(function(m){
      var es = m.hijos.filter(function(e){ return hxPasaFiltros(st, e) && hxPasaEleccion(st, f, m, e); })
        .map(function(e){
          if(!fas && !ots) return e;
          var c = {}, k;
          for(k in e) c[k] = e[k];
          c.hijos = e.hijos.filter(function(fa){ return !fas || fas.indexOf(fa.fase) >= 0; })
            .map(function(fa){
              if(!ots) return fa;
              var os = fa.hijos.filter(function(o){ return ots.indexOf(o.et) >= 0; });
              return os.length ? hxNodoFase(e.id, fa.fase, os) : null;
            }).filter(Boolean);
          return c;
        });
      return es.length ? { k: m.k, lv: 1, et: m.et, sub: '', hijos: es, fam: m.fam, mod: m.mod,
                           o: hxSuma(es.map(function(e){ return e.o; })) } : null;
    }).filter(Boolean);
    return mods.length ? { k: f.k, lv: 0, et: f.et, sub: '', hijos: mods, fam: f.fam, mod: '',
                           o: hxSuma(mods.map(function(m){ return m.o; })) } : null;
  }).filter(Boolean);
  st.totalVista = st.vista.length ? hxSuma(st.vista.map(function(f){ return f.o; })) : hxCero();
  hxVistaOrden(st);
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
    /* el equipo (tenga el lugar que tenga, con o sin ⇄) es el que se busca;
       lo que cuelga de el (fases, ordenes) pasa con su equipo */
    if(n.busca) return n.busca.indexOf(b) >= 0;
    if(n.lv >= 3) return true;
    return n.hijos.some(pasa);
  };
  var baja = function(lista){
    hxOrdenar(st, lista).forEach(function(n){
      if(!pasa(n)) return;
      out.push(n);
      /* buscando, familias y modelos van abiertos para que se vea lo hallado */
      var abierto = (b && n.lv < hxPosDe(st, 2)) || st.ab[n.k];
      if(abierto && n.hijos.length) baja(n.hijos);
    });
  };
  baja(st.vista || st.arbol);
  return out;
}

/* ---------- comentarios ---------- */
var HX_NOTAS = {}, hxDb = null, hxUser = null, hxUid = null, hxNotaAbierta = null;
/* una copia de los comentarios del artifact, para la version de GitHub, que no
   tiene su base de datos: ensamblar.py la mete desde notas_artifact.json. Con
   la base (en el artifact) no se usa. Lo que se escribe aqui se guarda en este
   navegador y manda sobre la copia; borrar uno copiado lo esconde (texto vacio). */
var HX_NOTAS_COPIA = { fecha: '', notas: {} };
function hxNotasSinBase(){
  var m = {}, k, loc = hxNotasLocal();
  for(k in HX_NOTAS_COPIA.notas) m[k] = HX_NOTAS_COPIA.notas[k];
  for(k in loc) m[k] = loc[k];
  return m;
}
/* a este navegador va solo lo que difiere de la copia */
function hxGuardarLocal(){
  var out = {}, k, c = HX_NOTAS_COPIA.notas;
  for(k in HX_NOTAS) if(!c[k] || c[k].texto !== HX_NOTAS[k].texto) out[k] = HX_NOTAS[k];
  for(k in c) if(!HX_NOTAS[k]) out[k] = { texto: '', ts: new Date().toISOString() };
  try { localStorage.setItem('torreSet.notas', JSON.stringify(out)); } catch(e){}
}
function hxClaveNota(s, n, col){
  /* los ids de documento solo admiten letras, digitos y unos pocos signos */
  return s + '.' + n.k.replace(/[^A-Za-z0-9-]/g, '_').slice(0, 150) + '.' + col;
}
function hxNotasLocal(){
  try { return JSON.parse(localStorage.getItem('torreSet.notas') || '{}') || {}; } catch(e){ return {}; }
}
function hxEstado(){
  HX_HOJAS.forEach(function(s){
    var st = HX[s];
    if(!st.arbol) return;
    var alq = (s === 'A' && st.ter) || (s === 'T' && st.terA);
    var n = 0, k;
    for(k in HX_NOTAS) if(k.indexOf(s + '.') === 0 && HX_NOTAS[k].texto) n++;
    /* lo esencial queda a la vista aunque el bloque este plegado */
    htm('hx-infoRes-' + s, ' · <b>' + n + (n === 1 ? ' comentario' : ' comentarios') + '</b> · '
      + fmt(st.vistas || 0) + ' filas a la vista'
      + (alq ? ' · <span class="av">⚠ el alquiler no es costo real</span>' : ''));
    htm('hx-estado-' + s, (alq ? '<span class="neg" style="color:#B3261E">' + esc(hxAvisoAlq(s === 'T' ? st.todos.filter(function(e){ return e.o.nq; }) : st.todos, s === 'T' ? 3 : 2).toUpperCase()) + '</span><br>' : '')
      + fmt(st.vistas || 0) + ' FILAS A LA VISTA · <b>' + n
      + (n === 1 ? ' COMENTARIO' : ' COMENTARIOS') + '</b> · '
      + (hxDb ? 'LOS COMENTARIOS SE GUARDAN EN LA PÁGINA Y LOS VE QUIEN LA ABRA'
              : 'LOS COMENTARIOS NUEVOS SE GUARDAN SÓLO EN ESTE NAVEGADOR'
                + (HX_NOTAS_COPIA.fecha ? ' · LOS DEMÁS SON UNA COPIA DE LOS DEL ARTIFACT AL ' + HX_NOTAS_COPIA.fecha.split('-').reverse().join('/') : ''))
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
  hxNotaAbierta = { k: k, fila: (s === 'P' ? 'PROPIOS' : s === 'A' ? 'ALQUILADOS' : 'FLOTA COMPLETA') + ' · ' + (n.esTot ? 'TOTAL DE LA TABLA' : hxNivelesDe(HX[s])[n.lv] + ' ' + n.et)
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
  hxGuardarLocal();
  listo();
}

/* ---------- pintado ---------- */
function hxCifras(s){
  /* las tarjetas siguen a lo que se ve: con una seleccion o un filtro, suman solo eso */
  var st = HX[s], tot = st.totalVista || st.total, esProp = s === 'P', ter = st.ter, h = tot.hr, esT = s === 'T';
  var tc = esT ? hxTcT(st, tot) : hxTc(tot, ter), tv = esT ? hxTvT(st, tot) : hxTv(tot, ter), d = tv - tc;
  var comps = [['RyM', 0], ['MOV', 1]];
  if(esT){ if(st.terD && tot.np) comps.push(['Dep', 2]); if(st.terA && tot.nq) comps.push(['Alq', 3]); }
  else if(ter) comps.push([esProp ? 'Dep' : 'Alq', 2]);
  var fuera = esT ? [st.terD ? '' : 'sin depreciación', st.terA ? 'con alquiler (no es costo real)' : 'sin alquiler'].filter(Boolean).join(' · ')
                  : (ter ? '' : (esProp ? 'sin depreciación' : 'sin alquiler'));
  var tarjeta = function(l, v, cuerpo, cl){
    return '<div><div class="gl">' + l + '</div><div class="gt' + (cl ? ' ' + cl : '') + '">' + v + '</div>' + cuerpo + '</div>';
  };
  var gd = function(t){ return '<div class="gd">' + t + '</div>'; };
  /* costo contra venta por componente (paso 1 del Tablero en chico):
     barra = costo, raya negra = venta; rojo si el costo la pasa */
  var cv = function(c, v, div){
    var num = function(x){ return div === 1 ? fmt(x) : x.toFixed(1); };
    var xs = comps.map(function(k){ return { n: k[0], c: c[k[1]] / div, v: v[k[1]] / div }; });
    var mx = Math.max.apply(null, xs.map(function(x){ return Math.max(x.c, x.v); }).concat([1e-9]));
    return hxBarras(xs.map(function(x){
      return { n: x.n, txt: num(x.c), w: x.c / mx, t: x.v ? x.v / mx : null, cl: (x.v ? x.c > x.v : x.c > 0) ? 'mal' : 'bien',
               title: x.n + ': costo ' + num(x.c) + ' · venta ' + num(x.v) };
    }));
  };
  /* la venta por componente: cuanto pesa cada uno */
  var ventas = hxBarras(comps.map(function(k){
    var x = tot.v[k[1]];
    return { n: k[0], txt: fmt(x), w: tv ? x / tv : 0, t: null, cl: 'neu', title: k[0] + ': ' + (tv ? (x / tv * 100).toFixed(0) : 0) + '% de la venta' };
  }));
  /* la diferencia por componente: verde a favor, rojo en contra */
  var difs = comps.map(function(k){ return tot.v[k[1]] - tot.c[k[1]]; });
  var mxd = Math.max.apply(null, difs.map(Math.abs).concat([1e-9]));
  var desv = hxBarras(comps.map(function(k, i){
    var x = difs[i];
    return { n: k[0], txt: (x > 0 ? '+' : x < 0 ? '−' : '') + fmt(Math.abs(x)), w: Math.abs(x) / mxd, t: null, cl: x < 0 ? 'mal' : 'bien',
             title: k[0] + ': venta − costo ' + fmt(x) };
  }));
  /* horas contra la proforma a la fecha, y la disponibilidad y el uso */
  var corte = SEP.corteDia || 0, dias = SEP.diasMes || 30, hFecha = tot.hrProf * corte / dias;
  var mxh = Math.max(h, hFecha, 1e-9);
  var oper = hxBarras([
    { n: 'Hrs', txt: hFecha ? (h / hFecha * 100).toFixed(0) + '%' : '—', w: h / mxh, t: hFecha ? hFecha / mxh : null,
      cl: hFecha && h < hFecha ? 'mal' : 'bien', title: 'Horas reales ' + fmt(h) + ' contra ' + fmt(hFecha) + ' proformadas a la fecha (raya)' },
    { n: 'DM', txt: tot.dm === null ? '—' : (tot.dm * 100).toFixed(0) + '%', w: tot.dm || 0, t: 0.85,
      cl: tot.dm !== null && Math.round(tot.dm * 100) < 85 ? 'mal' : 'bien', title: 'Disponibilidad mecánica; la raya es 85%' },
    { n: 'Uso', txt: tot.use === null ? '—' : (tot.use * 100).toFixed(0) + '%', w: tot.use || 0, t: null, cl: 'neu',
      title: 'Uso: horas trabajadas sobre horas disponibles' }
  ]);
  htm('hx-cifras-' + s,
      tarjeta('COSTO REAL AL DÍA ' + hxCorte(), 'US$ ' + fmt(tc),
              cv(tot.c, tot.v, 1) + (fuera ? gd(fuera) : ''))
    + tarjeta('VENTA INTERNA', 'US$ ' + fmt(tv), ventas + gd('tarifa de venta × horas reales'))
    + tarjeta('VENTA − COSTO', (d > 0 ? '+' : d < 0 ? '−' : '') + 'US$ ' + fmt(Math.abs(d)),
              desv + gd(d < 0 ? 'el costo supera a la venta' : 'la venta cubre el costo'), d < 0 ? 'alza' : 'bien')
    + tarjeta('HORAS MÁQUINA', fmt(h) + ' h', oper + gd('proforma del mes ' + fmt(tot.hrProf) + ' h'))
    + tarjeta('TARIFA REAL', 'US$ ' + (h ? (tc / h).toFixed(1) : '—') + '/h',
              (h ? cv(tot.c, tot.v, h) : '') + gd('contra US$ ' + (h ? (tv / h).toFixed(1) : '—') + '/h de venta'))
    + hxTarjetaAcum(st, tot, ter, esProp, comps));
  /* recortadas, las tarjetas llevan una raya azul: no son de toda la hoja */
  var cif = $('hx-cifras-' + s);
  if(cif) cif.classList.toggle('recorte', hxHayRecorte(st));
}
/* barritas chicas de las tarjetas: filas { n, txt, w (0-1), t (raya 0-1 o
   null), cl (mal / bien / neu), title } */
function hxBarras(filas){
  var pc = function(x){ return (Math.max(0, Math.min(1, x)) * 100).toFixed(1) + '%'; };
  return '<div class="gMini">' + filas.map(function(f){
    return '<div class="gm" title="' + esc(f.title || '') + '"><span class="gn">' + f.n + '</span>'
      + '<span class="gb"><i class="' + f.cl + '" style="width:' + pc(f.w) + '"></i>'
      + (f.t === null || f.t === undefined ? '' : '<b style="left:' + pc(f.t) + '"></b>') + '</span>'
      + '<span class="gv">' + f.txt + '</span></div>';
  }).join('') + '</div>';
}
/* la tarjeta del acumulado se despliega con su desglose: costo, venta y
   diferencia por componente, horas y tarifas del anio */
var HX_MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'setiembre',
                'octubre', 'noviembre', 'diciembre'];
function hxTarjetaAcum(st, tot, ter, esProp, comps){
  var esT = st.s === 'T';
  var A = tot.A, tac = esT ? hxTacT(st, tot) : hxTac(tot, ter), tav = esT ? hxTavT(st, tot) : hxTav(tot, ter), h = A.h, t3 = esProp ? 'Depreciación' : 'Alquiler';
  var per = SEP.acumPeriodos || [];
  var desde = per.length ? HX_MESES[per[0] - 1] + (per.length > 1 ? ' a ' + HX_MESES[per[per.length - 1] - 1] : '') : 'ningún mes';
  var dv = function(x){ return '<span class="' + (x < -0.5 ? 'neg' : x > 0.5 ? 'pos' : '') + '">' + (x > 0.5 ? '+' : '') + fmt(x) + '</span>'; };
  var fila = function(n, c, v, cl){
    return '<tr' + (cl ? ' class="' + cl + '"' : '') + '><td>' + n + '</td><td>' + fmt(c) + '</td><td>'
      + (v === null ? '–' : fmt(v)) + '</td><td>' + (v === null ? '–' : dv(v - c)) + '</td></tr>';
  };
  /* en la tarjeta, el acumulado por componente: costo contra venta del anio */
  var mx = Math.max.apply(null, (comps || []).map(function(k){ return Math.max(A.c[k[1]], A.v[k[1]]); }).concat([1e-9]));
  var barras = hxBarras((comps || []).map(function(k){
    var c = A.c[k[1]], v = A.v[k[1]];
    return { n: k[0], txt: fmtK(c), w: c / mx, t: v ? v / mx : null, cl: (v ? c > v : c > 0) ? 'mal' : 'bien',
             title: k[0] + ' acumulado: costo ' + fmt(c) + ' · venta ' + fmt(v) };
  }));
  return '<details class="gAcum"' + (st.acumAb ? ' open' : '') + '><summary>'
    + '<div class="gl">COSTO ACUMULADO 2026</div><div class="gt">US$ ' + fmtK(tac) + '</div>' + barras
    + '<div class="gd">venta US$ ' + fmtK(tav) + ' · ' + fmt(tot.n)
      + (hxHayRecorte(st) ? ' de ' + fmt(st.total.n) : '') + ' equipos</div></summary>'
    + '<div class="gDet"><table><thead><tr><th>ACUMULADO 2026</th><th>▼ COSTO</th><th>▲ VENTA</th><th>± V − C</th></tr></thead><tbody>'
    + fila('RyM', A.c[0], A.v[0])
    + fila('MOV', A.c[1], A.v[1])
    + (esT ? fila('Depreciación' + (st.terD ? '' : ' · fuera del total'), A.c[2], A.v[2], st.terD ? '' : 'z')
           + fila('Alquiler' + (st.terA ? '' : ' · fuera del total'), A.c[3], A.v[3], st.terA ? '' : 'z')
           + fila('Seg / otros', A.c[4], null)
         : fila(t3 + (ter ? '' : ' · fuera del total'), A.c[2], A.v[2], ter ? '' : 'z')
           + fila('Seg / otros', A.c[3], null))
    + fila('Total', tac, tav, 'tot')
    + '<tr><td>Horas</td><td colspan="3">' + fmt(h) + ' h</td></tr>'
    + '<tr><td>Tarifa por hora</td><td colspan="3">real US$ ' + (h ? (tac / h).toFixed(1) : '—')
      + ' · venta US$ ' + (h ? (tav / h).toFixed(1) : '—') + '</td></tr>'
    + '</tbody></table>'
    + '<p>Los bloques «Acumulado 2026» de las hojas PROP y ALQ, tal cual: el libro mayor de ' + desde + ' más setiembre al día ' + hxCorte()
    + '. ' + (esT ? '' : (ter ? '' : 'El ' + t3.toLowerCase() + ' no entra al total (botón ' + (esProp ? 'SIN DEP' : 'SIN ALQ') + '). '))
    + 'Seg / otros no suma al costo, como en el Excel.</p></div></details>';
}

function hxTabla(s){
  var st = HX[s];
  hxArbolVista(st);
  hxCifras(s);
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
  var cab2 = '<th class="fija t' + marca('_et', 0) + '" data-s="_et|0">'
    + hxNivelesDe(st).map(function(x){ return x.charAt(0) + x.slice(1).toLowerCase(); }).join(' › ') + '</th>'
    + st.cols.map(function(g){
        return hxVisibles(st, g).map(function(c, i){
          var col = g.id + '-' + g.cols.indexOf(c), fon = !!(st.filtros && st.filtros[col]);
          return '<th class="g-' + g.id + (i ? '' : ' ini') + (st.cerrado[g.id] ? ' cerr' : '') + (fon ? ' xf' : '') + (c.fuera && c.fuera() ? ' fuera' : '') + marca(g.id, g.cols.indexOf(c))
            + '"' + (c.fuera && c.fuera() ? ' title="No entra al total (botón ' + (c.t === 'Dep' ? 'DEP' : 'ALQ') + ')"' : '') + ' data-s="' + g.id + '|'
            + g.cols.indexOf(c) + '">' + c.t
            + '<button type="button" class="xlF' + (fon ? ' on' : '') + '" data-f="' + col + '" title="'
            + (fon ? 'Filtro: ' + esc(hxTextoFiltro(st, col)) : 'Filtrar por valor') + '" aria-label="Filtrar esta columna por valor">▾</button></th>';
        }).join('');
      }).join('');
  /* con filtros, familias, modelos y total llevan debajo su cifra original */
  var filt = hxHayRecorte(st), orig = {};
  if(filt) st.arbol.forEach(function(f){ orig[f.k] = f; f.hijos.forEach(function(m){ orig[m.k] = m; }); });
  var cuerpo = filas.map(function(n){
    var tiene = n.hijos.length > 0, ab = st.ab[n.k] || (st.busca && n.lv < hxPosDe(st, 2)), m = hxMarca(st, n, 'et');
    var o0 = filt && n.lv < 2 && orig[n.k] ? orig[n.k].o : null;
    return '<tr class="n' + n.lv + '" tabindex="0" data-k="' + esc(n.k) + '"'
      + (tiene ? ' aria-expanded="' + !!ab + '"' : '') + '>'
      + '<td class="fija' + (m ? ' cn' : '') + '"><span class="car">' + (tiene ? (ab ? '▾' : '▸') : '') + '</span>' + esc(n.et)
      + ((n.lv === 0 || n.esMod || /^m\|/.test(n.k)) && !n.ot ? '<span class="sub">' + n.o.n + (o0 ? ' de ' + o0.n : '') + (n.o.n === 1 && !o0 ? ' equipo' : ' equipos') + '</span>' : '')
      + (n.sub ? '<span class="sub">' + esc(n.sub) + '</span>' : '')
      /* familia, modelo y equipo llevan TABLERO; el equipo ademas VER (en
         cualquiera de los dos ordenes: el equipo es el nodo con id) */
      + ((n.lv === 0 || n.esMod || /^m\|/.test(n.k) || n.id) && hxTipoNodo(st, n) ? '<button type="button" class="xlIr" data-tb="' + esc(n.k)
          + '" title="Abrir el tablero de análisis de ' + (n.id ? 'este equipo' : n.lv ? 'este modelo' : 'esta familia') + '">TABLERO ▦</button>' : '')
      + (n.id && byId[n.id] ? '<button type="button" class="xlIr" data-ir="' + esc(n.id)
          + '" title="Abrir este equipo en la pestaña Equipo">VER ↗</button>' : '')
      + m + '</td>' + hxCeldas(st, n, o0) + '</tr>';
  }).join('') || '<tr><td class="fija">Ningún equipo ' + (filt ? 'cumple los filtros' : 'con esa búsqueda') + '.</td><td colspan="80"></td></tr>';
  var tot = st.totalVista || st.total, nt = hxNodoTotal(st);
  var pie = '<tr data-k="' + esc(nt.k) + '"><td class="fija">Total · ' + fmt(tot.n) + (filt ? ' de ' + fmt(st.total.n) : '') + ' equipos'
    + (filt ? '<span class="xo">original, sin filtros</span>' : '') + hxMarca(st, nt, 'et') + '</td>'
    + hxCeldas(st, nt, filt ? st.total : null) + '</tr>';
  hxBarraFiltros(s);
  htm('hx-tabla-' + s, '<thead><tr class="g">' + cab1 + '</tr><tr class="c">' + cab2 + '</tr></thead>'
    + '<tbody>' + cuerpo + '</tbody><tfoot>' + pie + '</tfoot>');
  hxBarraOrigen(s);
  hxEstado();
  requestAnimationFrame(hxAjustarAlto);
}
/* Con el alquiler sumado la cifra no es un costo real: el consolidado lo
   calcula con la tarifa de VENTA, asi que es la misma a los dos lados. Se
   dice cada vez. */
function hxAvisoAlq(nodos, i){
  var nc = 0;
  nodos.forEach(function(e){ if(e.o.c[i || 2] > 0) nc++; });
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
function hxPintarTodo(){ HX_HOJAS.forEach(function(s){ if(HX[s].arbol) hxTabla(s); }); }

/* abre todo hasta un nivel, como los botones 1 2 3 4 del esquema de Excel */
function hxNivel(s, nivel){
  var st = HX[s];
  st.ab = {};
  var baja = function(lista){
    lista.forEach(function(n){
      if(n.lv < nivel){ st.ab[n.k] = 1; baja(n.hijos); }
    });
  };
  /* se abre lo que se ve: con ⇄ las fases y equipos de la vista no estan en el arbol */
  hxArbolVista(st);
  baja(st.vista || st.arbol);
  st.nivel = nivel;
}
function hxBotones(s){
  var st = HX[s];
  /* DESPLEGAR: los botones abren la tabla hasta su nivel. SELECCIONAR: cada
     uno abre la lista de su nivel para elegir que se ve */
  var selec = st.modo === 'seleccionar';
  htm('hx-modo-' + s,
      '<button type="button" data-m="desplegar" aria-pressed="' + !selec + '" title="Los botones abren la tabla hasta ese nivel">DESPLEGAR</button>'
    + '<button type="button" data-m="seleccionar" aria-pressed="' + selec + '" title="Los botones abren una lista para elegir qué se muestra">SELECCIONAR</button>');
  /* el orden de los botones sigue al de la tabla. Modelo, equipo y fase se
     arrastran (data-arr) para cambiar de lugar; familia y orden quedan fijos.
     En SELECCIONAR cada boton sigue eligiendo su propio nivel (data-e). */
  var orden = [0].concat(hxOrdenNiv(st).map(function(k){ return HX_NIV_LOG[k]; })).concat([4]);
  htm('hx-nivel-' + s, orden.map(function(j, i){
    var n = HX_NIVELES[j], arr = i >= 1 && i <= 3 ? ' data-arr="' + ['', 'mod', 'eq', 'fa'][j] + '"' : '';
    var ayuda = arr ? ' · mantén presionado y arrastra para cambiarlo de lugar' : '';
    if(!selec) return '<button class="fbt' + (arr ? ' xlArr' : '') + '" type="button" data-n="' + i + '"' + arr
        + ' aria-pressed="' + (st.nivel === i) + '" title="Desplegar hasta ' + n.toLowerCase() + ayuda + '">'
        + (i + 1) + ' · ' + n + '</button>';
    var c = st.eleg[HX_ELEG[j]].length;
    return '<button class="fbt' + (arr ? ' xlArr' : '') + '" type="button" data-e="' + j + '"' + arr
      + ' aria-haspopup="dialog" aria-pressed="' + (c > 0) + '"'
      + ' title="Elegir ' + HX_ELEG_PL[j].toLowerCase() + ayuda + '">' + (i + 1) + ' · ' + n + (c ? ' (' + c + ')' : '') + ' ▾</button>';
  }).join(''));
  /* el boton marcado dice que vista hay; si se plego un grupo a mano, ninguno */
  var hayOculto = st.cols.some(function(g){ return st.oculto && st.oculto[g.id]; });
  var todas = !hayOculto && st.cols.every(function(g){ return !st.cerrado[g.id]; });
  var soloMes = hayOculto && st.cols.every(function(g){ return !st.cerrado[g.id]; });
  var totales = !hayOculto && st.cols.every(function(g){ return st.cerrado[g.id]; });
  var nom = s === 'P' ? 'DEP' : 'ALQ';
  if(s === 'T') htm('hx-ter-T',
      '<button class="fbt" type="button" data-t="d" aria-pressed="' + !!st.terD + '" title="Depreciación de los propios: '
        + (st.terD ? 'sumada al costo y a la venta (clic para quitarla)' : 'fuera del total (clic para sumarla)') + '">' + (st.terD ? 'CON' : 'SIN') + ' DEP</button>'
    + '<button class="fbt" type="button" data-t="a" aria-pressed="' + !!st.terA + '" title="Alquiler de los alquilados (tarifa de venta, no costo real): '
        + (st.terA ? 'sumado al total (clic para quitarlo)' : 'fuera del total, como en el Excel (clic para sumarlo)') + '">' + (st.terA ? 'CON' : 'SIN') + ' ALQ</button>');
  else htm('hx-ter-' + s,
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
      var ex = ev.target.closest ? ev.target.closest('[data-ex]') : null;
      var ee = ev.target.closest ? ev.target.closest('[data-ee]') : null;
      if(x){
        var c = x.getAttribute('data-fx');
        if(c === '*'){ HX[s].filtros = {}; HX[s].eleg = { fam: [], mod: [], eq: [], fa: [], ot: [] }; }
        else delete HX[s].filtros[c];
        hxCerrarFiltro(); hxCerrarEleccion(); hxBotones(s); hxTabla(s);
      } else if(ex){
        var i = parseInt(ex.getAttribute('data-ex'), 10);
        HX[s].eleg[HX_ELEG[i]] = [];
        hxPodarEleccion(HX[s], i);
        hxCerrarEleccion(); hxBotones(s); hxTabla(s);
      } else if(ee){
        ev.stopPropagation();
        hxAbrirEleccion(s, parseInt(ee.getAttribute('data-ee'), 10), ee);
      } else if(ed){
        ev.stopPropagation();
        hxAbrirFiltro(s, ed.getAttribute('data-f'), ed);
      }
    });
  }
  if(!hxHayRecorte(st)){ bar.hidden = true; bar.innerHTML = ''; return; }
  bar.hidden = false;
  var tot = st.totalVista || st.total;
  /* lo elegido con SELECCIONAR, un chip por nivel: hasta dos nombres y cuantos mas */
  var eleg = HX_ELEG.map(function(k, i){
    var xs = st.eleg[k];
    if(!xs.length) return '';
    var nom = xs.slice(0, 2).map(function(v){ return hxNombreEleg(st, i, v); }).join(', ') + (xs.length > 2 ? ' +' + (xs.length - 2) : '');
    return '<span class="chip"><button type="button" class="ed" data-ee="' + i + '" title="Cambiar la selección de ' + HX_ELEG_PL[i].toLowerCase() + '">'
      + HX_NIVELES[i] + ': ' + esc(nom) + '</button><button type="button" class="x" data-ex="' + i
      + '" aria-label="Quitar esta selección" title="Quitar">×</button></span>';
  }).join('');
  bar.innerHTML = '<span class="t">' + (hxHayFiltros(st) ? 'FILTRADO' : 'SELECCIÓN') + ' · ' + fmt(tot.n) + ' DE ' + fmt(st.total.n) + ' EQUIPOS</span>'
    + eleg
    + Object.keys(st.filtros).map(function(col){
        return '<span class="chip"><button type="button" class="ed" data-f="' + col + '" title="Cambiar este filtro">'
          + esc(hxTextoFiltro(st, col)) + '</button><button type="button" class="x" data-fx="' + col
          + '" aria-label="Quitar este filtro" title="Quitar">×</button></span>';
      }).join('')
    + '<button type="button" class="todos" data-fx="*">QUITAR TODO</button>'
    + '<span class="nt">Las tarjetas de arriba, las familias, los modelos y el total suman sólo esto; la cifra chica de debajo es la original, de toda la hoja.'
    + (st.eleg.ot.length || st.eleg.fa.length ? ' Con fases u órdenes elegidas, cada equipo sigue con sus cifras completas: horas, venta y depreciación no se reparten por fase ni por orden.' : '')
    + '</span>';
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
  /* con el telefono girado la pantalla es baja: se mide la ventanita y no se sale por abajo */
  var alto = pop.offsetHeight || 230, top = r.bottom + 6;
  if(top + alto > window.innerHeight - 6) top = r.top - alto - 6;
  pop.style.top = Math.max(6, Math.min(top, window.innerHeight - alto - 6)) + 'px';
  if(!HX_TACTIL) setTimeout(function(){ var a = $('hxfA'); if(a){ a.focus(); a.select(); } }, 0);
}
function hxCerrarFiltro(){
  var pop = $('hx-filtroPop');
  if(pop) pop.hidden = true;
  hxFiltroAbierto = null;
}
document.addEventListener('click', function(){ if(hxFiltroAbierto) hxCerrarFiltro(); });
/* la ventanita va fija en pantalla: si la pagina o la tabla se desplazan, se cierra */
/* En el telefono o la tableta el campo no se enfoca solo (abriria el teclado
   sin pedirlo), y mientras se escribe en la ventanita no se cierra: al salir
   el teclado el navegador desplaza la pagina por su cuenta. */
var HX_TACTIL = window.matchMedia && window.matchMedia('(pointer:coarse)').matches;
window.addEventListener('scroll', function(ev){
  var pop = $('hx-filtroPop'), pe = $('hx-elegirPop');
  var escribe = function(p){ return HX_TACTIL && p.contains(document.activeElement); };
  if(hxFiltroAbierto && pop && !pop.contains(ev.target) && !escribe(pop)) hxCerrarFiltro();
  /* al marcar una casilla la tabla se repinta y la pagina puede moverse sola: eso no cierra */
  if(hxElegirAbierto && pe && !pe.contains(ev.target) && !escribe(pe) && Date.now() - (pe._quieto || 0) > 700) hxCerrarEleccion();
}, true);

/* la ventanita de SELECCIONAR: casillas de un nivel, con buscador */
var hxElegirAbierto = null;
var HX_ELEG_MAX = 400;        /* mas que esto no se dibuja: se pide escribir para acotar */
function hxAbrirEleccion(s, i, ancla){
  var st = HX[s], pop = $('hx-elegirPop');
  if(!pop){
    pop = document.createElement('div');
    pop.id = 'hx-elegirPop'; pop.className = 'xlFiltroPop xlElegir'; pop.setAttribute('role', 'dialog');
    document.body.appendChild(pop);
    pop.addEventListener('click', function(ev){ ev.stopPropagation(); });
    pop.addEventListener('pointerdown', function(ev){ ev.stopPropagation(); });
  }
  hxCerrarFiltro();
  hxElegirAbierto = { s: s, i: i };
  var k = HX_ELEG[i];
  pop.innerHTML = '<div class="tt">ELEGIR <b>' + HX_ELEG_PL[i] + '</b> · <span id="hxeN"></span></div>'
    + '<input class="busca" id="hxeBusca" type="search" autocomplete="off" placeholder="escribe para acotar la lista" aria-label="Buscar en la lista">'
    + '<div class="lista" id="hxeLista" role="group" aria-label="' + HX_ELEG_PL[i] + '"></div>'
    + '<small>Marca uno o varios; la tabla y las tarjetas cambian al momento. Sin ninguno marcado se ven todos.</small>'
    + '<div class="bts"><button type="button" class="fbt" data-x="todos">TODOS</button>'
    + '<button type="button" class="fbt" data-x="visibles">MARCAR LOS DE LA LISTA</button>'
    + '<button type="button" class="fbt" data-x="listo">LISTO</button></div>';
  var pinta = function(){
    var q = ($('hxeBusca').value || '').trim().toUpperCase(), sel = st.eleg[k];
    var ops = hxOpciones(st, i).filter(function(o){ return !q || (o.t + ' ' + o.d).toUpperCase().indexOf(q) >= 0; });
    var vis = ops.slice(0, HX_ELEG_MAX);
    htm('hxeLista', vis.map(function(o){
      return '<label class="it"><input type="checkbox" value="' + esc(o.v) + '"' + (sel.indexOf(o.v) >= 0 ? ' checked' : '') + '>'
        + '<span>' + esc(o.t) + '</span><small>' + esc(o.d) + '</small></label>';
    }).join('') + (ops.length > vis.length ? '<div class="mas">Hay ' + fmt(ops.length) + '; se muestran ' + HX_ELEG_MAX + '. Escribe arriba para acotar.</div>' : '')
      + (!ops.length ? '<div class="mas">Nada con «' + esc(q) + '».</div>' : ''));
    txt('hxeN', sel.length ? sel.length + ' marcado' + (sel.length === 1 ? '' : 's') : 'todos');
    pop._vis = vis;
  };
  /* una seleccion cambia: se podan los niveles de abajo, se abre la tabla
     hasta lo elegido y se repinta todo (tarjetas incluidas) */
  var aplicar = function(){
    pop._quieto = Date.now();
    hxPodarEleccion(st, i);
    var hondo = -1;
    HX_ELEG.forEach(function(kk, j){ if(st.eleg[kk].length) hondo = j; });
    /* el nivel elegido mas hondo, en la posicion que tiene en la tabla */
    if(hondo >= 0) hxNivel(s, Math.max(1, hxPosDe(st, hondo)));
    hxBotones(s); hxTabla(s);
    txt('hxeN', st.eleg[k].length ? st.eleg[k].length + ' marcado' + (st.eleg[k].length === 1 ? '' : 's') : 'todos');
  };
  pop.onchange = function(ev){
    var x = ev.target;
    if(!x.matches || !x.matches('#hxeLista input')) return;
    var a = st.eleg[k], j = a.indexOf(x.value);
    if(x.checked && j < 0) a.push(x.value);
    if(!x.checked && j >= 0) a.splice(j, 1);
    aplicar();
  };
  pop.onclick = function(ev){
    var b = ev.target.closest ? ev.target.closest('[data-x]') : null;
    if(!b) return;
    var x = b.getAttribute('data-x');
    if(x === 'todos'){ st.eleg[k] = []; pinta(); aplicar(); }
    else if(x === 'visibles'){
      (pop._vis || []).forEach(function(o){ if(st.eleg[k].indexOf(o.v) < 0) st.eleg[k].push(o.v); });
      pinta(); aplicar();
    } else hxCerrarEleccion();
  };
  pop.onkeydown = function(ev){ if(ev.key === 'Escape') hxCerrarEleccion(); };
  $('hxeBusca').addEventListener('input', pinta);
  pinta();
  pop.hidden = false;
  var r = ancla.getBoundingClientRect(), w = Math.min(380, window.innerWidth - 20);
  pop.style.width = w + 'px';
  pop.style.left = Math.max(10, Math.min(window.innerWidth - w - 10, r.left)) + 'px';
  /* debajo del boton si cabe entera; si no, subida lo justo para que se vea completa */
  var alto = pop.offsetHeight;
  pop.style.top = Math.max(10, Math.min(r.bottom + 6, window.innerHeight - alto - 10)) + 'px';
  if(!HX_TACTIL) setTimeout(function(){ var b = $('hxeBusca'); if(b) b.focus(); }, 0);
}
/* el alto de la tabla: lo que queda de pantalla debajo de ella al abrir la
   hoja, para que se vea entera con su fila Total sin bajar la pagina (como en
   Excel). En pantalla dividida manda el alto del panel (division.html). */
function hxAjustarAlto(){
  HX_HOJAS.forEach(function(s){
    var t = $('hx-tabla-' + s), env = t && t.parentElement;
    if(!env) return;
    if(document.body.classList.contains('dividida') || !env.offsetParent){ env.style.maxHeight = ''; return; }
    var arriba = env.getBoundingClientRect().top + window.scrollY;
    /* la tabla llega casi al borde de abajo: de la barra «fx» y de
       comentarios y leyenda solo asoma el canto, y se ven al bajar la pagina */
    var alto = window.innerHeight - arriba - 22;
    /* en el telefono o la tableta girada la tabla no cabe debajo de las
       tarjetas: ahi toma la pantalla menos la barra de pestanas, y al bajar
       la pagina hasta ella la llena entera */
    if(alto < 320 && hxPantChica()){
      var nav = $('nav');
      env.style.maxHeight = Math.max(220, Math.round(window.innerHeight - (nav ? nav.offsetHeight : 0) - 14)) + 'px';
      return;
    }
    env.style.maxHeight = Math.max(320, Math.round(alto)) + 'px';
  });
}
function hxPantChica(){
  return !!(window.matchMedia && window.matchMedia('(max-width:1180px), (max-height:500px), (pointer:coarse)').matches);
}
window.addEventListener('resize', hxAjustarAlto);
/* abrir una pestana, plegar algo o poner un filtro mueve la tabla: se vuelve a medir */
document.addEventListener('click', function(){ requestAnimationFrame(hxAjustarAlto); });
document.addEventListener('toggle', function(){ requestAnimationFrame(hxAjustarAlto); }, true);

function hxCerrarEleccion(){
  var pop = $('hx-elegirPop');
  if(pop) pop.hidden = true;
  hxElegirAbierto = null;
}
document.addEventListener('click', function(){ if(hxElegirAbierto) hxCerrarEleccion(); });

/* la fila Total como un nodo mas, para elegir sus cifras y comentarlas. Su
   clave va con los proyectos elegidos: el comentario del total de ATOC no es
   el del total de todos. Los filtros por valor no cambian la clave. */
function hxNodoTotal(st){
  var ss = todasLasSedes() ? 'TODOS' : sedeSel.join('+');
  return { k: 'tot|' + ss, lv: -1, esTot: 1, et: 'Total' + (ss === 'TODOS' ? '' : ' ' + ss.replace(/\+/g, ' + ')),
           o: st.totalVista || st.total, hijos: [] };
}
function hxBuscarNodo(st, k){
  if(/^tot\|/.test(k || '')){ var nt = hxNodoTotal(st); return nt.k === k ? nt : null; }
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
  /* FLOTA COMPLETA abre como el Excel: con depreciacion, sin alquiler */
  st.terD = true; st.terA = false;
  st.cols = s === 'T' ? hxColumnasT(st) : hxColumnas(s === 'P', st);
  st.cerrado = {}; st.oculto = {}; st.filtros = {}; st.busca = ''; st.ab = {};
  st.modo = 'desplegar'; st.eleg = { fam: [], mod: [], eq: [], fa: [], ot: [] };
  /* el orden de modelo, equipo y fase que se dejo la ultima vez en esta hoja */
  st.ordenNiv = null;
  try {
    var on = JSON.parse(localStorage.getItem('torreSet.ordenNiv.' + s) || 'null');
    if(on && on.length === 3 && on.slice().sort().join() === 'eq,fa,mod') st.ordenNiv = on;
    else if(localStorage.getItem('torreSet.faseAntes.' + s) === '1') st.ordenNiv = ['mod', 'fa', 'eq'];
  } catch(e){}
  st.ord = { g: 'costo', i: hxIdxTotal(s), dir: -1 };
  hxArbol(s);
  hxNivel(s, 1);
  hxCifras(s); hxBotones(s); hxTabla(s);

  /* la tarjeta del acumulado: recuerda si esta abierta al repintar y se
     cierra con un clic fuera */
  var cif = $('hx-cifras-' + s);
  if(cif){
    cif.addEventListener('toggle', function(ev){
      if(ev.target.classList && ev.target.classList.contains('gAcum')) st.acumAb = ev.target.open;
    }, true);
    document.addEventListener('click', function(ev){
      var d = cif.querySelector('.gAcum[open]');
      if(d && !d.contains(ev.target)){ d.open = false; st.acumAb = false; }
    });
  }
  /* comentarios y leyenda, y el origen de la celda: plegados o no, como
     se dejaron la ultima vez (vale para las dos hojas) */
  Array.prototype.forEach.call((tabla.closest ? tabla.closest('section') : document).querySelectorAll('.xlPlg'), function(d){
    var k = 'torreSet.plg.' + d.getAttribute('data-plg');
    try { d.open = localStorage.getItem(k) === '1'; } catch(e){}
    d.addEventListener('toggle', function(){
      try { localStorage.setItem(k, d.open ? '1' : '0'); } catch(e){}
      /* el otro par de bloques (la otra hoja) sigue la misma eleccion */
      Array.prototype.forEach.call(document.querySelectorAll('.xlPlg[data-plg="' + d.getAttribute('data-plg') + '"]'), function(x){
        if(x !== d && x.open !== d.open) x.open = d.open;
      });
    });
  });

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
    var tr = q('tbody tr[data-k], tfoot tr[data-k]'), td = q('tbody td, tfoot td');
    if(g){ var id = g.getAttribute('data-g'); st.cerrado[id] = !st.cerrado[id]; return repinta(); }
    var nodo = tr ? hxBuscarNodo(st, tr.getAttribute('data-k')) : null;
    /* la esquina de una celda comentada abre su comentario */
    if(cn && nodo){ hxAbrirNota(s, nodo, cn.getAttribute('data-cn')); return; }
    if(tb && nodo && hxTipoNodo(st, nodo)){ abrirTablero(hxTipoNodo(st, nodo), nodo.fam, nodo.mod, nodo.id || ''); return; }
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
  /* arrastrar MODELO, EQUIPO o FASE para cambiar el orden de la tabla:
     se mantiene presionado (o se mueve un poco con el boton pulsado), una
     raya marca donde cae y al soltar se rearma. Un clic corto hace lo de
     siempre. El orden se recuerda por hoja. */
  var cNiv = $('hx-nivel-' + s), arr = null, ignorarClic = false;
  var limpiarArr = function(){
    if(!arr) return;
    clearTimeout(arr.timer);
    Array.prototype.forEach.call(cNiv.querySelectorAll('.xlArr'), function(b){ b.classList.remove('arrMovil', 'arrAntes', 'arrDespues'); });
    document.body.classList.remove('arrNiv');
    arr = null;
  };
  var empezarArr = function(){
    if(!arr || arr.activo) return;
    arr.activo = true;
    try { arr.btn.setPointerCapture(arr.id); } catch(e2){}
    arr.btn.classList.add('arrMovil');
    document.body.classList.add('arrNiv');
  };
  /* a que lugar caeria: cuantos de los otros botones arrastrables quedan a la izquierda del puntero */
  var destinoArr = function(x){
    var otros = Array.prototype.filter.call(cNiv.querySelectorAll('[data-arr]'), function(b){ return b !== arr.btn; });
    var i = 0;
    otros.forEach(function(b){ var r = b.getBoundingClientRect(); if(x > r.left + r.width / 2) i++; });
    return { i: i, otros: otros };
  };
  cNiv.addEventListener('pointerdown', function(ev){
    var b = ev.target.closest ? ev.target.closest('[data-arr]') : null;
    if(!b || (ev.button !== undefined && ev.button > 0)) return;
    limpiarArr();
    arr = { btn: b, k: b.getAttribute('data-arr'), x0: ev.clientX, y0: ev.clientY, id: ev.pointerId, activo: false };
    arr.timer = setTimeout(empezarArr, 280);
  });
  cNiv.addEventListener('pointermove', function(ev){
    if(!arr) return;
    if(!arr.activo){
      if(Math.abs(ev.clientX - arr.x0) + Math.abs(ev.clientY - arr.y0) < 7) return;
      empezarArr();
    }
    var d = destinoArr(ev.clientX);
    d.otros.forEach(function(b, j){
      b.classList.toggle('arrAntes', j === d.i);
      b.classList.toggle('arrDespues', d.i === d.otros.length && j === d.otros.length - 1);
    });
  });
  cNiv.addEventListener('pointerup', function(ev){
    if(!arr) return;
    if(!arr.activo){ limpiarArr(); return; }
    var d = destinoArr(ev.clientX), k = arr.k;
    var nuevo = d.otros.map(function(b){ return b.getAttribute('data-arr'); });
    nuevo.splice(d.i, 0, k);
    limpiarArr();
    /* el clic que el navegador manda justo al soltar (si lo manda) se ignora;
       pasado ese instante, los clics vuelven a funcionar */
    ignorarClic = true;
    setTimeout(function(){ ignorarClic = false; }, 0);
    if(nuevo.join() !== hxOrdenNiv(st).join()){
      st.ordenNiv = nuevo;
      try { localStorage.setItem('torreSet.ordenNiv.' + s, JSON.stringify(nuevo)); } catch(e2){}
      hxNivel(s, st.nivel >= 0 ? st.nivel : 1);
      repinta();
    }
  });
  cNiv.addEventListener('pointercancel', limpiarArr);
  /* el clic que llega al soltar un arrastre no despliega ni abre la lista */
  cNiv.addEventListener('click', function(ev){
    if(ignorarClic){ ignorarClic = false; ev.stopPropagation(); ev.preventDefault(); }
  }, true);
  esc_('hx-nivel-' + s, 'click', function(ev){
    var e = ev.target.closest ? ev.target.closest('[data-e]') : null;
    if(e){ ev.stopPropagation(); hxAbrirEleccion(s, parseInt(e.getAttribute('data-e'), 10), e); return; }
    var b = ev.target.closest ? ev.target.closest('[data-n]') : null;
    if(!b) return;
    hxNivel(s, parseInt(b.getAttribute('data-n'), 10));
    repinta();
  });
  /* el modo de los botones de nivel; lo ya elegido se mantiene al cambiar */
  esc_('hx-modo-' + s, 'click', function(ev){
    var b = ev.target.closest ? ev.target.closest('[data-m]') : null;
    if(!b) return;
    st.modo = b.getAttribute('data-m');
    hxCerrarEleccion();
    hxBotones(s);
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
    if(st.oculto[st.ord.g]) st.ord = { g: 'costo', i: hxIdxTotal(s), dir: -1 };
    repinta();
  });
  esc_('hx-ter-' + s, 'click', function(ev){
    var b = ev.target.closest ? ev.target.closest('[data-t]') : null;
    if(!b) return;
    var w = b.getAttribute('data-t');
    if(s === 'T'){
      if(w === 'd') st.terD = !st.terD; else st.terA = !st.terA;
      hxBotones(s); hxTabla(s);
      return;
    }
    hxPonerTer(s, w === '1');
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

HX_NOTAS = hxNotasSinBase();
HX_HOJAS.forEach(hxIniciar);

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
    }, function(){ hxDb = null; HX_NOTAS = hxNotasSinBase(); hxPintarTodo(); });
  }, function(){});
}

/* Las tarjetas de flota del inicio llevaban a la hoja Flota, que ya no
   existe: dejan puesto el filtro y abren Tendencia, que lo ensena. */
function verFlota(n){
  modFiltro = 'TODOS'; provFiltro = 'TODOS'; eqFiltro = 'TODOS';
  ponerFiltroEq('fam', n);
  irA('v-costos');
}
