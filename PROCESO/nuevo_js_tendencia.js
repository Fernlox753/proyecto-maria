/* ══════════════════════════════════════════════════════════════════
   7 · TENDENCIA — el costo leido como una cotizacion

   Diecisiete puntos, uno por mes: el libro contabiliza cada mes en su
   ultimo dia, asi que no hay granularidad mas fina que esta y dibujar
   por dia seria inventar movimiento que el dato no tiene.

   El grafico muestra SIEMPRE los diecisiete meses y resalta el periodo
   activo: arrastrando sobre el se recorta, y ese recorte queda puesto
   en toda la torre porque el periodo es estado compartido.
   ══════════════════════════════════════════════════════════════════ */
var gMetrica = 'costo', gEscala = 'auto', gComparar = 'ninguno', gLineas = 6;
var gEscalaX = 'mes';
/* un objetivo por metrica; el acumulado usa el de costo */
var OBJ = { costo: null, cph: null, horas: null };
var OBJ_COLOR = '--pa';

/* Se guarda en el navegador para no volver a teclearlo en cada visita.
   Puede fallar —ventana privada, datos bloqueados—, y si falla no pasa
   nada: se sigue sin memoria. */
function objLeer(){
  try{
    var s = localStorage.getItem('tcf.obj');
    if(!s) return;
    var o = JSON.parse(s);
    ['costo', 'cph', 'horas'].forEach(function(k){
      var v = o && o[k];
      if(typeof v === 'number' && isFinite(v)) OBJ[k] = v;
    });
  }catch(e){}
}
function objGuardar(){
  try{ localStorage.setItem('tcf.obj', JSON.stringify(OBJ)); }catch(e){}
}
objLeer();

/* que objetivo toca segun la metrica, y con que unidad se teclea */
function objClave(){
  return gMetrica === 'cph' ? 'cph' : gMetrica === 'horas' ? 'horas' : 'costo';
}
function objUnidad(){
  if(gMetrica === 'cph')   return 'US$ POR HORA';
  if(gMetrica === 'horas') return 'HORAS POR MES';
  if(gMetrica === 'acum')  return 'US$ POR MES · SE ACUMULA';
  return 'US$ POR MES';
}
function objValor(){
  var v = OBJ[objClave()];
  return (typeof v === 'number' && isFinite(v)) ? v : null;
}

/* El objetivo llevado a los cubos del eje. Las tasas no se multiplican por
   los meses del cubo; las cantidades si. */
function serieObjetivo(){
  var o = objValor();
  if(o === null) return null;
  var out = [], ac = 0, k, n;
  for(k = 0; k < BX.length; k++){
    n = BX[k].fin - BX[k].ini + 1;
    if(gMetrica === 'cph') out.push(o);
    else if(gMetrica === 'acum'){ ac += n * o; out.push(ac); }
    else out.push(n * o);
  }
  return out;
}
/* Como se nombra el objetivo que el usuario teclea. En costo y horas lleva
   "/MES" porque la linea se escalona: sin eso, con el eje POR AÑO el rotulo
   diria 80 MM —el escalon de 2026— y pareceria que el objetivo es ese. */
function objRotulo(){
  var v = objValor();
  if(v === null) return '';
  return objTexto(v) + (gMetrica === 'cph' ? '' : '/MES');
}
function objTexto(v){
  if(gMetrica === 'cph')   return 'US$ ' + v.toFixed(1) + '/h';
  if(gMetrica === 'horas') return fmt(Math.round(v)) + ' h';
  return 'US$ ' + fmtK(v);
}
var G = { x0: 64, x1: 986, y0: 26, y1: 306, w: 1000, h: 356 };
/* El viewBox de 1000 de ancho en un telefono se reduce a un tercio y los
   rotulos del eje bajan de cuatro pixeles. Con un lienzo mas estrecho y
   mas alto el factor de reduccion queda cerca de uno y se lee. */
function ajustarG(){
  var el = $('graf');
  var ancho = el ? el.getBoundingClientRect().width : 0;
  if(ancho && ancho < 560) G = { x0: 78, x1: 410, y0: 20, y1: 424, w: 420, h: 466 };
  else                     G = { x0: 64, x1: 986, y0: 26, y1: 306, w: 1000, h: 356 };
}
/* Las seis primeras son las de la marca; las otras seis se anaden para
   poder comparar mas series sin que dos queden del mismo color. */
var COLORES = ['--sm', '--cian', '--verde', '--mineral', '--ok', '--sm-cl'];
var COLORES_EXTRA = ['#7E3F9D', '#C0453E', '#0E7490', '#6B7A12', '#B0459B', '#545C66'];

var METRICAS = [
  { c: 'costo',  n: 'COSTO',        u: 'US$' },
  { c: 'cph',    n: 'US$ POR HORA', u: 'US$/h' },
  { c: 'horas',  n: 'HORAS MÁQUINA', u: 'h' },
  { c: 'acum',   n: 'ACUMULADO',    u: 'US$' }
];
var ESCALAS = [
  { c: 'auto', n: 'AUTOMÁTICA' },
  { c: 'cero', n: 'DESDE CERO' },
  { c: 'log',  n: 'LOGARÍTMICA' }
];
var LINEAS = [
  { c: 6,  n: '6' },
  { c: 12, n: '12' },
  { c: 20, n: '20' }
];
var ESCALAS_X = [
  { c: 'mes',  n: 'MENSUAL' },
  { c: 'ano',  n: 'POR AÑO' },
  { c: 'todo', n: 'TODO EL PERIODO' }
];
var COMPARAR = [
  { c: 'ninguno', n: 'UNA LÍNEA' },
  { c: 'fam',     n: 'POR FLOTA' },
  { c: 'tipo',    n: 'PROPIO / ALQUILADO' },
  { c: 'proy',    n: 'POR PROYECTO' },
  { c: 'ro',      n: 'POR TIPO DE COSTO' },
  { c: 'eq',      n: 'POR EQUIPO' }
];

/* ---------- los cubos del eje X ----------
   Siempre dentro del periodo elegido: si se pide POR AÑO con un periodo de
   abril a agosto, el cubo de ese año trae abril-agosto y nada mas. Agrupar
   por el año natural completo daria una cifra que no es la de la seleccion. */
var BX = [], NB = 1;
function calcularBuckets(){
  var out = [], i;
  if(gEscalaX === 'todo'){
    out.push({ rot: rotuloRango(), largo: rotuloRango(), ini: rangoA, fin: rangoB });
  } else if(gEscalaX === 'ano'){
    var ano = null;
    for(i = rangoA; i <= rangoB; i++){
      var a = MESES[i].slice(0, 4);
      if(a !== ano){ ano = a; out.push({ rot: a, ini: i, fin: i }); }
      else out[out.length - 1].fin = i;
    }
    out.forEach(function(b){
      b.largo = b.rot + ' · ' + mesCorto(MESES[b.ini])
              + (b.ini === b.fin ? '' : ' – ' + mesCorto(MESES[b.fin]));
    });
  } else {
    for(i = rangoA; i <= rangoB; i++){
      out.push({ rot: mesCorto(MESES[i]), largo: mesCorto(MESES[i]), ini: i, fin: i });
    }
  }
  BX = out; NB = out.length || 1;
  return out;
}
/* con tan pocos puntos una linea no dice nada: se pasan a columnas */
function enColumnas(){ return NB < 4; }

function metricaAct(){
  for(var i = 0; i < METRICAS.length; i++) if(METRICAS[i].c === gMetrica) return METRICAS[i];
  return METRICAS[0];
}

/* Convierte un par (costo, horas) mensual en la metrica elegida, agrupado
   ya por los cubos del eje. El US$/hora se calcula con los totales del cubo
   —no promediando ratios— y el acumulado sigue corriendo entre cubos. */
function aMetrica(m, mh){
  var out = [], ac = 0, b, j, c, h;
  for(var k = 0; k < BX.length; k++){
    b = BX[k]; c = 0; h = 0;
    for(j = b.ini; j <= b.fin; j++){ c += m[j] || 0; h += mh[j] || 0; }
    if(gMetrica === 'costo') out.push(c);
    else if(gMetrica === 'horas') out.push(h);
    else if(gMetrica === 'cph') out.push(h ? c / h : null);
    else { ac += c; out.push(ac); }
  }
  return out;
}

/* Las lineas a dibujar: una sola, o una por cada corte elegido.
   Se guarda cuantas habia en total para poder decir en pantalla si se esta
   viendo solo una parte: antes se recortaba a seis en silencio y un equipo
   que quedara decimoquinto parecia no existir. */
var _totalSeries = 1;
function seriesGraf(){
  if(gComparar === 'ninguno'){
    _totalSeries = 1;
    return [{ n: hayFiltroEq() ? rotuloEq() : 'TODA LA SELECCIÓN', v: aMetrica(SERIE, SERIEHM) }];
  }
  var todas;
  if(gComparar === 'ro'){
    todas = FASES.map(function(f){ return { n: f.n, m: FASESM[f.c], mh: SERIEHM }; });
  } else if(gComparar === 'eq'){
    todas = EQ.map(function(e){
      return { n: e.id + (e.mod ? ' · ' + e.mod : ''), m: e.m, mh: e.mh };
    });
  } else {
    todas = (gComparar === 'fam' ? FAM : gComparar === 'tipo' ? TIPOS : PROYT)
      .map(function(a){ return { n: a.n, m: a.m, mh: a.mh }; });
  }
  _totalSeries = todas.length;
  return todas.slice(0, gLineas).map(function(a){
    return { n: a.n, v: aMetrica(a.m, a.mh) };
  });
}

function colorSerie(i){
  if(i < COLORES.length) return css(COLORES[i]) || '#1f6feb';
  return COLORES_EXTRA[(i - COLORES.length) % COLORES_EXTRA.length];
}
/* pasadas las doce se repiten colores: se distinguen con trazo discontinuo */
function trazoSerie(i){
  var v = Math.floor(i / (COLORES.length + COLORES_EXTRA.length));
  return v === 0 ? '' : (v === 1 ? '7 5' : '2 4');
}

/* ---------- escalas ---------- */
function escalaY(series){
  var min = Infinity, max = -Infinity, hayNoPos = false;
  var ob = serieObjetivo();
  var conObj = ob ? series.concat([{ v: ob }]) : series;
  conObj.forEach(function(s){
    s.v.forEach(function(v){
      if(v === null) return;
      if(v < min) min = v;
      if(v > max) max = v;
      if(v <= 0) hayNoPos = true;
    });
  });
  if(min === Infinity){ min = 0; max = 1; }
  if(max === min) max = min + Math.abs(min || 1) * 0.1;

  var modo = gEscala;
  /* el logaritmo no admite ceros ni negativos: si los hay se avisa y se
     cae a la escala automatica en vez de dibujar una linea rota */
  if(modo === 'log' && hayNoPos) modo = 'auto';
  if(modo === 'cero') min = Math.min(0, min);
  /* Una columna se lee por su largo, asi que si el eje no arranca en cero
     miente: con 94.69 y 85.94 MM la escala automatica dibujaba la primera
     cuatro veces mas alta que la segunda. En columnas el suelo es cero. */
  var forzadoCero = false;
  if(enColumnas() && modo === 'auto'){
    modo = 'cero'; min = Math.min(0, min); forzadoCero = true;
    max += (max - min) * 0.14;          /* aire para el rotulo de encima */
  }
  if(modo === 'auto'){
    var col = (max - min) * 0.12;
    var pisoCero = min >= 0;       /* nada de ejes negativos en una serie positiva */
    min -= col; max += col;
    if(pisoCero && min < 0) min = 0;
  }
  return { min: min, max: max, modo: modo, forzadoCero: forzadoCero,
           cayo: gEscala === 'log' && modo !== 'log' };
}

function posY(v, e){
  if(v === null) return null;
  var t;
  if(e.modo === 'log'){
    var lmin = Math.log(Math.max(e.min, 1e-6)), lmax = Math.log(Math.max(e.max, 1e-6));
    t = (Math.log(Math.max(v, 1e-6)) - lmin) / (lmax - lmin || 1);
  } else {
    t = (v - e.min) / (e.max - e.min || 1);
  }
  return G.y1 - t * (G.y1 - G.y0);
}
function posX(i){
  /* en columnas los puntos van centrados en su banda, no en los extremos */
  if(enColumnas()) return G.x0 + (i + 0.5) * (G.x1 - G.x0) / NB;
  return G.x0 + i * (G.x1 - G.x0) / (NB - 1 || 1);
}
function anchoBanda(){ return (G.x1 - G.x0) / NB; }

function ticksY(e){
  var out = [], n = 5, i;
  if(e.modo === 'log'){
    var lmin = Math.log(Math.max(e.min, 1e-6)), lmax = Math.log(Math.max(e.max, 1e-6));
    for(i = 0; i <= n; i++) out.push(Math.exp(lmin + (lmax - lmin) * i / n));
  } else {
    for(i = 0; i <= n; i++) out.push(e.min + (e.max - e.min) * i / n);
  }
  return out;
}

function rotuloY(v){
  if(gMetrica === 'cph') return v.toFixed(1);
  /* En el telefono "19.78 MM" no cabe en el margen y se cortaba por la
     izquierda. Se acorta el rotulo en vez de comerle ancho al grafico. */
  if(G.w < 600){
    var sg = v < 0 ? '-' : '', a2 = Math.abs(v);
    if(a2 >= 1e6)  return sg + (a2/1e6).toFixed(1) + 'M';
    if(a2 >= 1000) return sg + Math.round(a2/1000) + 'k';
    return sg + Math.round(a2);
  }
  return fmtK(v);
}
function valorTexto(v){
  if(v === null) return '—';
  if(gMetrica === 'cph') return 'US$ ' + v.toFixed(1) + '/h';
  if(gMetrica === 'horas') return fmt(v) + ' h';
  return 'US$ ' + fmt(v);
}

/* ---------- la linea de objetivo ---------- */
function trazarObjetivo(p, e){
  var ob = serieObjetivo();
  if(!ob) return null;
  var col = css(OBJ_COLOR) || '#B0431A', d = '', i, y;
  if(enColumnas()){
    /* en columnas el objetivo cruza toda la banda, no solo su centro */
    for(i = 0; i < NB; i++){
      y = posY(ob[i], e);
      if(y === null) continue;
      var xa = G.x0 + i * anchoBanda(), xb = xa + anchoBanda();
      d += ' M' + xa.toFixed(1) + ' ' + y.toFixed(1) + ' L' + xb.toFixed(1) + ' ' + y.toFixed(1);
    }
  } else {
    /* escalonada cuando los cubos no traen los mismos meses */
    var ab = false;
    for(i = 0; i < NB; i++){
      y = posY(ob[i], e);
      if(y === null){ ab = false; continue; }
      d += (ab ? ' L' : ' M') + posX(i).toFixed(1) + ' ' + y.toFixed(1);
      ab = true;
    }
  }
  p.push('<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="2"'
       + ' stroke-dasharray="8 5" stroke-linecap="round"/>');
  var yUlt = posY(ob[NB - 1], e);
  if(yUlt !== null){
    p.push('<text x="' + (G.x1 - 6) + '" y="' + (yUlt - 8).toFixed(1)
         + '" class="gObjRot" text-anchor="end">OBJETIVO ' + esc(objRotulo()) + '</text>');
  }
  return ob;
}

/* cuantos puntos de la serie principal se pasan del objetivo */
function resumenObjetivo(series){
  var ob = serieObjetivo();
  if(!ob || !series.length) return '';
  var s = series[0].v, sobre = 0, con = 0;
  for(var i = 0; i < ob.length; i++){
    if(s[i] === null || s[i] === undefined) continue;
    con++;
    if(s[i] > ob[i]) sobre++;
  }
  if(!con) return '';
  return ' · OBJETIVO ' + objRotulo()
       + ' · ' + sobre + ' DE ' + con + (con === 1 ? ' PUNTO' : ' PUNTOS') + ' POR ENCIMA';
}

/* ---------- dibujo ---------- */
function pintarGrafico(){
  var svg = $('graf');
  if(!svg) return;
  ajustarG();
  calcularBuckets();
  var series = seriesGraf(), e = escalaY(series);
  var p = [];

  p.push('<rect x="' + G.x0 + '" y="' + G.y0 + '" width="' + (G.x1 - G.x0)
       + '" height="' + (G.y1 - G.y0) + '" class="gFondo"/>');


  ticksY(e).forEach(function(v){
    var y = posY(v, e);
    p.push('<line x1="' + G.x0 + '" y1="' + y.toFixed(1) + '" x2="' + G.x1
         + '" y2="' + y.toFixed(1) + '" class="gRejilla"/>');
    p.push('<text x="' + (G.x0 - 10) + '" y="' + (y + 4).toFixed(1)
         + '" class="gEjeY">' + esc(rotuloY(v)) + '</text>');
  });

  /* la linea del cero, cuando el recorte la cruza */
  if(e.modo !== 'log' && e.min < 0 && e.max > 0){
    var y0 = posY(0, e);
    p.push('<line x1="' + G.x0 + '" y1="' + y0.toFixed(1) + '" x2="' + G.x1
         + '" y2="' + y0.toFixed(1) + '" class="gCero"/>');
  }

  var paso = NB > (G.w < 600 ? 5 : 12) ? (G.w < 600 ? 3 : 2) : 1;
  /* el ultimo rotulo se pone siempre, pero si cae encima del anterior se
     quita ese: "JUL 26" y "AGO 26" se solapaban en el telefono */
  var minSep = G.w < 600 ? 62 : 54, ultimoX = -1e9;
  var aPintar = [];
  BX.forEach(function(b, i){
    if(i % paso === 0 || i === NB - 1) aPintar.push(i);
  });
  if(aPintar.length > 1){
    var u = aPintar[aPintar.length-1], v = aPintar[aPintar.length-2];
    if(posX(u) - posX(v) < minSep) aPintar.splice(aPintar.length-2, 1);
  }
  aPintar.forEach(function(i){
    var x = posX(i);
    if(x - ultimoX < minSep*0.6) return;
    ultimoX = x;
    p.push('<text x="' + x.toFixed(1) + '" y="' + (G.y1 + 22)
         + '" class="gEjeX">' + esc(BX[i].rot) + '</text>');
  });

  if(enColumnas()){
    /* una o dos columnas por cubo y serie, apoyadas en la base del eje */
    var base = posY(e.modo === 'log' ? e.min : Math.max(e.min, Math.min(0, e.min)), e);
    var hueco = anchoBanda() * 0.24;
    var anchoS = (anchoBanda() - hueco * 2) / series.length;
    series.forEach(function(s, k){
      var col = colorSerie(k);
      for(var i = 0; i < NB; i++){
        var y = posY(s.v[i], e);
        if(y === null) continue;
        var x = G.x0 + i * anchoBanda() + hueco + k * anchoS;
        p.push('<rect x="' + x.toFixed(1) + '" y="' + Math.min(y, base).toFixed(1)
             + '" width="' + Math.max(1, anchoS - 2).toFixed(1)
             + '" height="' + Math.max(1, Math.abs(base - y)).toFixed(1)
             + '" fill="' + col + '" opacity=".85"/>');
        /* el rotulo encima solo si la columna es mas ancha que el texto:
           con seis series se pisaban entre si. Si no cabe, esta en el globo. */
        if(anchoS >= 62){
          p.push('<text x="' + (x + anchoS / 2).toFixed(1) + '" y="'
               + (Math.min(y, base) - 7).toFixed(1) + '" class="gEjeX" text-anchor="middle">'
               + esc(rotuloY(s.v[i])) + '</text>');
        }
      }
    });
    trazarObjetivo(p, e);
    p.push('<g id="g-cruz" style="display:none">'
         + '<line class="gCruz" x1="0" y1="' + G.y0 + '" x2="0" y2="' + G.y1 + '"/></g>');
    p.push('<rect id="g-captura" x="' + G.x0 + '" y="' + G.y0 + '" width="' + (G.x1 - G.x0)
         + '" height="' + (G.y1 - G.y0) + '" fill="transparent" style="cursor:crosshair"/>');
    p.push('<rect id="g-brocha" class="gBrocha" x="0" y="' + G.y0 + '" width="0" height="'
         + (G.y1 - G.y0) + '" style="display:none"/>');
    svg.innerHTML = p.join('');
    svg.setAttribute('viewBox', '0 0 ' + G.w + ' ' + G.h);
    engancharGrafico(svg, series, e);
    pintarLeyenda(series, e);
    return;
  }

  series.forEach(function(s, k){
    var col = colorSerie(k), d = '', d2 = '', abierto = false;
    for(var i = 0; i < NB; i++){
      var y = posY(s.v[i], e);
      if(y === null){ abierto = false; continue; }
      d += (abierto ? ' L' : ' M') + posX(i).toFixed(1) + ' ' + y.toFixed(1);
      abierto = true;
    }
    if(series.length === 1){
      /* area bajo la curva solo cuando hay una linea: con varias ensucia */
      var base = posY(e.modo === 'log' ? e.min : Math.max(e.min, Math.min(0, e.min)), e);
      d2 = d + ' L' + posX(NB - 1).toFixed(1) + ' ' + base.toFixed(1)
             + ' L' + posX(0).toFixed(1) + ' ' + base.toFixed(1) + ' Z';
      p.push('<path d="' + d2 + '" fill="' + col + '" opacity=".13"/>');
    }
    var guion = trazoSerie(k);
    p.push('<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="2.4"'
         + (guion ? ' stroke-dasharray="' + guion + '"' : '')
         + ' stroke-linejoin="round" stroke-linecap="round"/>');
    if(series.length <= 8){
      for(var i2 = 0; i2 < NB; i2++){
        var y2 = posY(s.v[i2], e);
        if(y2 === null) continue;
        p.push('<circle cx="' + posX(i2).toFixed(1) + '" cy="' + y2.toFixed(1)
             + '" r="' + (series.length === 1 ? 3.4 : 2.6) + '" fill="' + col + '"/>');
      }
    }
  });

  trazarObjetivo(p, e);

  p.push('<g id="g-cruz" style="display:none">'
       + '<line class="gCruz" x1="0" y1="' + G.y0 + '" x2="0" y2="' + G.y1 + '"/></g>');
  p.push('<rect id="g-captura" x="' + G.x0 + '" y="' + G.y0 + '" width="' + (G.x1 - G.x0)
       + '" height="' + (G.y1 - G.y0) + '" fill="transparent" style="cursor:crosshair"/>');
  p.push('<rect id="g-brocha" class="gBrocha" x="0" y="' + G.y0 + '" width="0" height="'
       + (G.y1 - G.y0) + '" style="display:none"/>');

  svg.innerHTML = p.join('');
  svg.setAttribute('viewBox', '0 0 ' + G.w + ' ' + G.h);
  engancharGrafico(svg, series, e);
  pintarLeyenda(series, e);
}

function pintarLeyenda(series, e){
  htm('g-leyenda', series.length === 1 ? '' : series.map(function(s, k){
    var gu = trazoSerie(k), col2 = colorSerie(k);
    return '<span class="gLeg"><i style="background:' + col2
         + (gu ? ';background-image:repeating-linear-gradient(90deg,'
                 + col2 + ' 0 4px,transparent 4px 7px)' : '')
         + '"></i>' + esc(s.n) + '</span>';
  }).join(''));

  var aviso = '';
  if(gComparar !== 'ninguno'){
    aviso = ' · ' + (series.length < _totalSeries
      ? 'MOSTRANDO LAS ' + series.length + ' MAYORES DE ' + _totalSeries
        + ' — SUBE EL NÚMERO DE LÍNEAS PARA VER MÁS'
      : series.length + ' DE ' + _totalSeries);
  }
  var escX = 'mes';
  for(var z = 0; z < ESCALAS_X.length; z++) if(ESCALAS_X[z].c === gEscalaX) escX = ESCALAS_X[z].n;
  txt('g-pie', metricaAct().n + ' · ' + rotuloSeleccion() + ' · EJE ' + escX
      + ' (' + NB + (NB === 1 ? ' PUNTO' : ' PUNTOS') + ')' + aviso
      + (e.cayo ? ' · LA ESCALA LOGARÍTMICA NO APLICA CON VALORES CERO O NEGATIVOS' : '')
      + (e.forzadoCero ? ' · EN COLUMNAS EL EJE ARRANCA EN CERO PARA QUE EL LARGO SEA COMPARABLE' : '')
      + resumenObjetivo(series)
      + (NB > 1 ? ' · ARRASTRA SOBRE EL GRÁFICO PARA ACOTAR' : '')
      + (todoElPeriodo() ? '' : ' · EL ATAJO «TODO» REABRE LOS DIECISIETE MESES'));
}

/* ---------- cruz, globo y brocha ---------- */
function engancharGrafico(svg, series, e){
  var cap = svg.querySelector('#g-captura');
  var cruz = svg.querySelector('#g-cruz');
  var brocha = svg.querySelector('#g-brocha');
  var globo = $('g-globo');
  if(!cap) return;
  var arrastre = null;

  function indiceDe(ev){
    var r = svg.getBoundingClientRect();
    var x = (ev.clientX - r.left) / r.width * G.w;
    var i = enColumnas()
      ? Math.floor((x - G.x0) / anchoBanda())
      : Math.round((x - G.x0) / ((G.x1 - G.x0) / (NB - 1 || 1)));
    return Math.max(0, Math.min(NB - 1, i));
  }

  cap.addEventListener('pointermove', function(ev){
    var i = indiceDe(ev);
    cruz.style.display = '';
    cruz.firstChild.setAttribute('x1', posX(i).toFixed(1));
    cruz.firstChild.setAttribute('x2', posX(i).toFixed(1));
    if(arrastre !== null){
      var a = Math.min(arrastre, i), b = Math.max(arrastre, i);
      brocha.style.display = '';
      brocha.setAttribute('x', posX(a).toFixed(1));
      brocha.setAttribute('width', Math.max(2, posX(b) - posX(a)).toFixed(1));
    }
    if(globo){
      /* con muchas lineas el globo se haria una pared: se listan las de
         mayor valor en ese mes y se dice cuantas quedan fuera */
      var orden = series.map(function(s2, k2){ return { s: s2, k: k2 }; });
      if(series.length > 8){
        orden.sort(function(a, b){
          var va = a.s.v[i] === null ? -1e18 : a.s.v[i];
          var vb = b.s.v[i] === null ? -1e18 : b.s.v[i];
          return vb - va;
        });
      }
      var recorte = orden.slice(0, 8);
      var filas = recorte.map(function(o){
        return '<i style="background:' + colorSerie(o.k) + '"></i>'
             + (series.length > 1 ? esc(o.s.n) + ' ' : '')
             + '<b>' + valorTexto(o.s.v[i]) + '</b>';
      }).join('<br>');
      if(orden.length > recorte.length){
        filas += '<br><span style="opacity:.6">y ' + (orden.length - recorte.length) + ' mas</span>';
      }
      var prev = series[0].v[i - 1], act = series[0].v[i], vr = '';
      if(i > 0 && prev && act !== null && prev !== 0){
        var d = (act - prev) / Math.abs(prev) * 100;
        vr = '<em class="' + (d >= 0 ? 'sube' : 'baja') + '">'
           + (d >= 0 ? '▲ ' : '▼ ') + Math.abs(d).toFixed(1) + '% vs '
           + (gEscalaX === 'ano' ? 'año' : 'mes') + ' anterior</em>';
      }
      var ob2 = serieObjetivo(), obl = '';
      if(ob2 && series[0].v[i] !== null && series[0].v[i] !== undefined){
        var dd = series[0].v[i] - ob2[i];
        obl = '<em class="' + (dd > 0 ? 'sube' : 'baja') + '">'
            + (dd > 0 ? '▲ ' : '▼ ') + objTexto(Math.abs(dd))
            + (dd > 0 ? ' sobre' : ' bajo') + ' el objetivo</em>';
      }
      globo.innerHTML = '<span class="gm">' + esc((BX[i] || {}).largo || '') + '</span>'
                      + filas + vr + obl;
      globo.className = 'grafGlobo on';
      var rp = svg.parentElement.getBoundingClientRect();
      var rs = svg.getBoundingClientRect();
      var px = rs.left - rp.left + posX(i) / G.w * rs.width;
      var mitad = globo.offsetWidth / 2;
      globo.style.left = Math.max(mitad + 4, Math.min(rp.width - mitad - 4, px)) + 'px';
    }
  });
  cap.addEventListener('pointerleave', function(){
    cruz.style.display = 'none';
    if(globo) globo.className = 'grafGlobo';
    if(arrastre === null && brocha) brocha.style.display = 'none';
  });
  cap.addEventListener('pointerdown', function(ev){
    arrastre = indiceDe(ev);
    cap.setPointerCapture(ev.pointerId);
  });
  cap.addEventListener('pointerup', function(ev){
    if(arrastre === null) return;
    var i = indiceDe(ev), a = Math.min(arrastre, i), b = Math.max(arrastre, i);
    arrastre = null;
    brocha.style.display = 'none';
    if(!BX[a] || !BX[b]) return;
    var ma = BX[a].ini, mb = BX[b].fin;
    /* un clic sin arrastre aisla ese cubo; un segundo clic vuelve a todo */
    if(a === b && rangoA === ma && rangoB === mb) ponerRango(0, NM - 1);
    else ponerRango(ma, mb);
  });
}

/* ---------- controles ---------- */
function botonera(id, lista, valor, fn){
  var el = $(id);
  if(!el) return;
  el.innerHTML = lista.map(function(o){
    return '<button class="fbt" type="button" data-c="' + esc(o.c) + '" aria-pressed="'
         + (o.c === valor) + '">' + esc(o.n) + '</button>';
  }).join('');
  Array.prototype.forEach.call(el.querySelectorAll('.fbt'), function(b){
    b.addEventListener('click', function(){ fn(b.getAttribute('data-c')); });
  });
}

function construirGrafControles(){
  botonera('g-metrica', METRICAS, gMetrica, function(c){ gMetrica = c; pintarTendencia(); });
  botonera('g-escala', ESCALAS, gEscala, function(c){ gEscala = c; pintarTendencia(); });
  botonera('g-escalax', ESCALAS_X, gEscalaX, function(c){ gEscalaX = c; pintarTendencia(); });
  botonera('g-comparar', COMPARAR, gComparar, function(c){ gComparar = c; pintarTendencia(); });
  botonera('g-lineas', LINEAS, gLineas, function(c){ gLineas = +c; pintarTendencia(); });
  construirObjetivo();
}

/* ---------- el campo de objetivo ---------- */
function construirObjetivo(){
  var el = $('g-obj');
  if(!el) return;
  if(!el.getAttribute('data-listo')){
    el.setAttribute('data-listo', '1');
    var leer = function(){
      /* se acepta 10,000,000 y 10 000 000: se limpia todo lo que no sea cifra */
      var s = (el.value || '').replace(/[^0-9.,-]/g, '').replace(/,/g, '');
      var v = parseFloat(s);
      OBJ[objClave()] = (s !== '' && isFinite(v) && v !== 0) ? v : null;
      objGuardar();
      pintarTendencia();
    };
    el.addEventListener('change', leer);
    el.addEventListener('keydown', function(ev){ if(ev.key === 'Enter') leer(); });
    esc_('g-obj-x', 'click', function(){
      OBJ[objClave()] = null; objGuardar(); pintarTendencia();
    });
  }
  var v = objValor();
  /* no se pisa lo que el usuario esta teclanado */
  if(document.activeElement !== el) el.value = v === null ? '' : String(v);
  txt('g-obj-u', objUnidad());
  var q = $('g-obj-x');
  if(q) q.hidden = v === null;
}

function pintarTablaMeses(){
  var tb = $('g-tabla');
  if(!tb) return;
  var f = [];
  for(var i = 0; i < NM; i++){
    var v = SERIE[i], h = SERIEHM[i], prev = SERIE[i - 1];
    var d = (i > 0 && prev) ? (v - prev) / Math.abs(prev) * 100 : null;
    var dentro = i >= rangoA && i <= rangoB;
    f.push('<tr class="' + (dentro ? 'dentro' : 'fuera') + '" data-i="' + i + '" tabindex="0">'
      + '<td class="id">' + esc(mesCorto(MESES[i])) + '</td>'
      + '<td class="nn fuerte">' + fmt(v) + '</td>'
      + '<td class="nn">' + fmt(h) + '</td>'
      + '<td class="nn">' + (h ? (v / h).toFixed(1) : '—') + '</td>'
      + '<td class="nn ' + (d === null ? '' : d >= 0 ? 'sube' : 'baja') + '">'
      + (d === null ? '—' : (d >= 0 ? '+' : '') + d.toFixed(1) + '%') + '</td></tr>');
  }
  tb.innerHTML = f.join('');
  Array.prototype.forEach.call(tb.querySelectorAll('tr'), function(tr){
    var ir = function(){
      var i = parseInt(tr.getAttribute('data-i'), 10);
      if(rangoA === i && rangoB === i) ponerRango(0, NM - 1); else ponerRango(i, i);
    };
    tr.addEventListener('click', ir);
    tr.addEventListener('keydown', function(ev){
      if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); ir(); }
    });
  });
}

function pintarTendencia(){
  construirPanelMeses('3');
  construirFiltros('3');
  marcarCampoEq();
  construirGrafControles();
  txt('t3-total', 'US$ ' + fmtK(totalR()));
  txt('t3-hm', fmtK(hmR()) + ' h');
  txt('t3-cph', 'US$ ' + cphR().toFixed(1) + '/h');
  txt('t3-cph-l', todosLosRO() ? 'COSTO POR HORA' : rotuloRO() + ' POR HORA');

  /* cuanto se movio el costo entre el primer y el ultimo punto del eje:
     sigue a la escala, asi que POR AÑO compara años y no meses */
  calcularBuckets();
  var cubo = function(b){
    var s = 0;
    for(var j = b.ini; j <= b.fin; j++) s += SERIE[j] || 0;
    return s;
  };
  var a = NB > 1 ? cubo(BX[0]) : 0, b = NB > 1 ? cubo(BX[NB - 1]) : 0;
  var mudo = NB < 2 || !a;
  txt('t3-var', mudo ? '—'
      : ((b - a) / Math.abs(a) * 100 >= 0 ? '+' : '') + ((b - a) / Math.abs(a) * 100).toFixed(1) + '%');
  cls('t3-var', 'v ' + (mudo ? '' : (b >= a ? 'sube' : 'baja')));
  txt('t3-var-l', gEscalaX === 'ano' ? 'DEL PRIMER AL ÚLTIMO AÑO'
      : gEscalaX === 'todo' ? 'UN SOLO PUNTO: NO HAY VARIACIÓN'
      : 'DEL PRIMER AL ÚLTIMO MES');

  pintarGrafico();
  pintarTablaMeses();
}
