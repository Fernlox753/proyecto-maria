/* ══════════════════════════════════════════════════════════════════
   MESES — al cargar, antes de que la torre lea DATA (va justo despues de
   var DATA / var SETIEMBRE / var TRES_MESES / var SEP_MESES)

   1. Las ordenes viajan una sola vez (DATA.ots): cada equipo trae oi, los
      indices de las suyas, y aqui se vuelven a enlazar en el mismo orden.
   2. La torre abre con setiembre, como siempre. Con el universo de TRES
      MESES (lo elige el boton de Tendencia, que recarga la pagina) se le
      suman julio y agosto a DATA antes de que nada lo lea: los dias de
      setiembre se corren al final (julio, agosto, setiembre) y lo de los
      otros meses entra en la cola de cada lista. Todo lo demas de la torre
      funciona igual, sobre todos los dias de los meses. TRES_MESES lo arma juntar_meses.py.
   ══════════════════════════════════════════════════════════════════ */
(function enlazarOrdenes(){
  (DATA.equipos || []).forEach(function(q){
    if(q.oi){ q.ots = q.oi.map(function(j){ return DATA.ots[j]; }); delete q.oi; }
  });
})();

var MODO_MESES = (function(){
  if(typeof TRES_MESES === 'undefined') return 'set';
  var m = '';
  try { m = sessionStorage.getItem('torreSet.universo') || ''; } catch(e){}
  if(/tresmeses/.test(location.hash || '')) m = 'tres';
  return m === 'tres' ? 'tres' : 'set';
})();

/* julio – octubre 2026: el nombre de los meses juntos */
var MESES_ROT_TRES = (function(){
  if(typeof TRES_MESES === 'undefined') return '';
  var m = TRES_MESES.meses;
  return (m[0].rotulo.split(' ')[0] + ' – ' + m[m.length - 1].rotulo).toLowerCase();
})();

/* 2026-07 -> JUL 26, para el eje POR MES de Tendencia */
function mesNombreTres(am){
  var x = (typeof TRES_MESES !== 'undefined' ? TRES_MESES.meses : []).filter(function(m){ return m.mes === am; })[0];
  return x ? x.rotulo.slice(0, 3) + ' ' + am.slice(2, 4) : am;
}

(function sumarMeses(){
  if(MODO_MESES !== 'tres') return;
  var X = TRES_MESES, D = DATA, off = X.off, i, k;
  D.meses = X.dias;
  ['proys', 'cecos', 'cuentas', 'gastos'].forEach(function(k){ D[k] = D[k].concat(X[k] || []); });
  /* hechos y horas: los de setiembre corren sus dias; despues, los otros meses */
  for(i = 0; i < D.F.m.length; i++) D.F.m[i] += off;
  for(k in D.F) D.F[k] = D.F[k].concat(X.F[k]);
  for(i = 0; i < D.H.m.length; i++) D.H.m[i] += off;
  for(k in D.H) D.H[k] = D.H[k].concat(X.H[k]);
  /* las ordenes de setiembre (las mismas que cuelgan de cada equipo) corren su dia */
  D.ots.forEach(function(o){ if(o.mi !== undefined) o.mi += off; });
  D.ots = D.ots.concat(X.ots);
  var ceros = [];
  for(i = 0; i < off; i++) ceros.push(0);
  D.equipos.forEach(function(q, i){
    if(X.eqSys[i]) q.sys = X.eqSys[i];
    else q.sys = (q.sys || []).map(function(s){ return { c: s.c, n: s.n, v: s.v, m: ceros.concat(s.m) }; });
    if(X.eqProys[i]) q.proys = X.eqProys[i];
  });
  X.eqNuevos.forEach(function(q){ q.ots = []; D.equipos.push(q); });
  for(k in X.eqOi) X.eqOi[k].forEach(function(j){ D.equipos[+k].ots.push(D.ots[j]); });
  for(k in X.sysdesc) D.sysdesc[k] = X.sysdesc[k];
  D.meta.meses = X.meses;
  D.meta.desde = X.dias[0];
  D.meta.hasta = X.dias[X.dias.length - 1];
})();
