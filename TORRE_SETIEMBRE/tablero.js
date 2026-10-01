/* ══════════════════════════════════════════════════════════════════
   TABLERO — el analisis de una flota, una familia o un modelo

   Siempre los mismos siete pasos y en el mismo orden, para que dos
   personas que miren modelos distintos los lean igual:

     1 resultado   ¿la venta interna cubre el costo?
     2 horas       ¿trabajo lo que se proformo?
     3 tarifa      ¿la hora cuesta lo que se cobra por ella?
     4 causa       ¿es problema de gasto o de horas?
     5 RyM y MOV   ¿en que se fue el costo de mantenimiento? (solo ordenes: sin depreciacion)
     6 equipos     ¿quienes lo explican? (y sus ordenes)
     7 acumulado   ¿como viene el anio?

   Es un presupuesto flexible: la venta interna (tarifa x horas reales) es
   lo que corresponde gastar para las horas que de verdad se trabajaron.
   Usa los mismos nodos de equipo que las hojas Propios y Alquilados
   (HX[..].todos), asi que las cifras son las mismas.
   ══════════════════════════════════════════════════════════════════ */
/* mods: los modelos elegidos; vacio es todos. Se pueden juntar varios,
   por ejemplo 785C y 785D, y el tablero los analiza como un solo grupo. */
var TB = { tipo: 'PROPIO', fams: [], mods: [], eqs: [], ab: {}, eqModo: 'lista' };
/* eqs: los equipos elegidos (vacio es todos los del modelo). Se eligen de
   una lista con casillas o escribiendo sus codigos; la forma se recuerda. */
try { if(localStorage.getItem('torreSet.tbEqModo') === 'escribir') TB.eqModo = 'escribir'; } catch(e){}
var TB_FASE = { LU: 'LUBRICACIÓN', MM: 'MANTENIMIENTO MECÁNICO', LL: 'LLANTAS', ED: 'ELEMENTOS DE DESGASTE',
                RM: 'REPARACIÓN MAYOR', CA: 'CARRILERÍA' };
/* el tipo de tecnico de la mano de obra; TEC-ALQ se deja con su codigo */
var TB_TEC = { 'MECANI-A': 'Mecánico', 'LLANTE-A': 'Llantero', 'MECLUB-A': 'Mecánico lubricador',
               'SOLDA-A': 'Soldador', 'ELECTR-A': 'Electricista' };
/* la clase de cada orden esta en el listado general de ordenes */
var TB_PM = {};
OTS.forEach(function(o){ TB_PM[o.ot] = o.pm; });

function tbHoja(){ return TB.tipo === 'PROPIO' ? 'P' : 'A'; }
/* los equipos que dejan familia y modelo: entre ellos se eligen los equipos */
function tbEqDisponibles(){
  return (HX[tbHoja()].todos || []).filter(function(e){
    return (!TB.fams.length || TB.fams.indexOf(e.fam) >= 0) && (!TB.mods.length || TB.mods.indexOf(e.mod) >= 0);
  });
}
function tbNodos(){
  return tbEqDisponibles().filter(function(e){ return !TB.eqs.length || TB.eqs.indexOf(e.id) >= 0; });
}
function tbUS(x){ return 'US$ ' + fmt(x); }
function tbSig(x){ return (x > 0 ? '+' : x < 0 ? '−' : '') + 'US$ ' + fmt(Math.abs(x)); }
function tbPc(x){ return (x === null || x === undefined || !isFinite(x)) ? '—' : (x * 100).toFixed(0) + '%'; }
function tbN1(x){ return (x === null || x === undefined || !isFinite(x)) ? '—' : x.toFixed(1); }
function tbDv(x, dec){
  if(x === null || x === undefined || !isFinite(x) || Math.abs(x) < (dec ? 0.05 : 0.5)) return '<span class="z">–</span>';
  return '<span class="' + (x < 0 ? 'neg' : 'pos') + '">' + (x > 0 ? '+' : '') + (dec ? x.toFixed(dec) : fmt(x)) + '</span>';
}
/* barra del valor real contra una referencia marcada con una raya */
function tbBarra(v, ref, max, clase){
  if(!max) return '';
  return '<span class="tbBar"><i class="' + (clase || '') + '" style="width:' + Math.max(0, Math.min(100, v / max * 100)).toFixed(1)
    + '%"></i>' + (ref === null ? '' : '<span class="ref" style="left:' + Math.max(0, Math.min(100, ref / max * 100)).toFixed(1) + '%"></span>')
    + '</span>';
}
/* el tipo de cada cifra decide su color y su simbolo, igual que en las tablas */
var TB_SIM = { costo: '▼', venta: '▲', desv: '±', oper: '◷', treal: '▼/h', tventa: '▲/h', acosto: 'Σ▼', aventa: 'Σ▲', adesv: 'Σ±', atar: 'Σ/h' };
var TB_KIND = { 'COSTO REAL': 'costo', 'VENTA INTERNA': 'venta', 'DESVIACIÓN': 'desv', 'COBERTURA': 'desv',
  'HORAS REALES': 'oper', 'PROFORMA A LA FECHA': 'oper', 'CUMPLIMIENTO DE HORAS': 'oper', 'PROYECCIÓN AL CIERRE': 'oper',
  'DISPONIBILIDAD MECÁNICA': 'oper', 'USO': 'oper', 'EFECTO GASTO': 'desv', 'EFECTO HORAS': 'oper',
  'HORAS DE EQUILIBRIO': 'oper', 'COSTO ACUMULADO': 'acosto', 'VENTA ACUMULADA': 'aventa',
  'DESVIACIÓN ACUMULADA': 'adesv', 'TARIFA REAL ACUMULADA': 'atar' };
/* el paso: resultado y causa son diferencias, horas es operacion, tarifa va por hora,
   destino es costo, equipos compara costo contra venta, acumulado es suma del anio */
var TB_PASO = { 1: 'desv', 2: 'oper', 3: 'treal', 4: 'desv', 5: 'costo', 6: 'venta', 7: 'acosto', 8: 'nada' };
var TB_PASO_SIM = { 1: '±', 2: '◷', 3: '/h', 4: '±', 5: '▼', 6: '▼▲', 7: 'Σ', 8: '?' };
/* los pasos armados en la ultima pintada: se muestran como nubes y solo se
   abre el elegido (TB.paso; 0 abre todos, uno debajo de otro) */
var TB_SECS = [];
function tbCf(l, v, d, cl){
  var k = TB_KIND[l];
  return '<div class="tbCf' + (k ? ' k-' + k : '') + '"><div class="l">' + (k ? '<span class="sm">' + TB_SIM[k] + '</span>' : '') + l
       + '</div><div class="v' + (cl ? ' ' + cl : '') + '">' + v + '</div><div class="d">' + d + '</div></div>';
}
/* colorea una tabla: una clase por columna en la cabecera y un colgroup que
   tine las celdas. kinds va en orden de columna; vacio es sin color. */
function tbColor(t){
  return t.replace(/<table class="tb"( id="[^"]*")? data-k="([^"]*)">([\s\S]*?)<\/table>/g, function(m, id, ks, cuerpo){
    var kinds = ks.split(','), i = 0;
    cuerpo = cuerpo.replace(/<th( class="([^"]*)")?>/g, function(th, a, cl){
      var k = kinds[i++];
      return k ? '<th class="' + ((cl || '') + ' k-' + k).trim() + '">' : th;
    });
    return '<table class="tb"' + (id || '') + '><colgroup>' + kinds.map(function(k){
      return '<col' + (k ? ' class="k-' + k + '"' : '') + '>';
    }).join('') + '</colgroup>' + cuerpo + '</table>';
  });
}
function tbSec(n, titulo, pregunta, como, cuerpo){
  TB_SECS.push({ n: n, titulo: titulo, html: tbSecHtml(n, titulo, pregunta, como, cuerpo) });
  return '';
}
function tbSecHtml(n, titulo, pregunta, como, cuerpo){
  /* con «ver todo» cada paso lleva su titulo; con uno solo, lo dice la nube */
  var todos = TB.paso === 0, ab = TB.como && TB.como[n];
  var expl = como ? '<details class="tbDet" data-como="' + n + '"' + (ab ? ' open' : '') + '>'
    + '<summary>CÓMO SE LEE ESTE PASO</summary><p class="tbComo">' + como + '</p></details>' : '';
  if(!todos) return '<div class="tbSec solo">' + expl + cuerpo + '</div>';
  return '<div class="tbSec"><h3><span class="paso k-' + TB_PASO[n] + '">PASO ' + n + '</span>'
       + '<span class="sm k-' + TB_PASO[n] + '">' + TB_PASO_SIM[n] + '</span>' + titulo
       + '<span class="preg">' + pregunta + '</span></h3>'
       + expl + cuerpo + '</div>';
}

function tbPintar(){
  var cont = $('tb-cuerpo');
  if(!cont) return;
  var esProp = TB.tipo === 'PROPIO', t3 = esProp ? 'Depreciación' : 'Alquiler';
  var nodos = tbNodos();
  TB_SECS = [];
  if(TB.paso === undefined) TB.paso = 1;
  if(!nodos.length){ cont.innerHTML = '<p class="tbComo">No hay equipos con esa selección.</p>'; return; }
  var o = hxSuma(nodos.map(function(e){ return e.o; }));
  var corte = SEP.corteDia || 6, dias = SEP.diasMes || 30;
  /* con o sin el tercer componente, el mismo estado que la hoja de esa flota */
  var ter = HX[tbHoja()].ter;
  var c = o.c.slice(), v = o.v.slice(), h = o.hr;
  c[3] = hxTc(o, ter); v[3] = hxTv(o, ter);
  var desv = v[3] - c[3];
  var tR = h ? c[3] / h : null, tV = h ? v[3] / h : null;
  var hFecha = o.hrProf * corte / dias;

  /* ---------- veredicto ---------- */
  var chip, frase;
  if(!c[3] && !v[3]){ chip = ['nd', 'SIN MOVIMIENTO']; frase = 'No tiene costo ni venta al día ' + corte + '.'; }
  else if(!h){ chip = ['mal', 'SIN HORAS']; frase = 'Lleva ' + tbUS(c[3]) + ' de costo y ninguna hora trabajada: no genera venta que lo cubra.'; }
  else if(!v[3]){ chip = ['nd', 'SIN TARIFA DE VENTA']; frase = 'Trabajó ' + fmt(h) + ' h pero no tiene tarifa de venta en el consolidado: no se puede evaluar.'; }
  else if(desv >= -v[3] * 0.005){ chip = ['bien', 'CUMPLE']; frase = 'La venta interna cubre el costo, con ' + tbUS(desv) + ' a favor.'; }
  else { chip = ['mal', 'NO CUMPLE']; frase = 'El costo supera a la venta interna en ' + tbUS(-desv) + ' (' + (-desv / v[3] * 100).toFixed(0) + '% sobre la venta).'; }
  var quien = TB.eqs.length ? (TB.eqs.length <= 4 ? TB.eqs.join(' + ') : TB.eqs.length + ' EQUIPOS ELEGIDOS')
            : TB.mods.length ? TB.mods.join(' + ')
            : TB.fams.length ? (TB.fams.length <= 3 ? TB.fams.join(' + ') : TB.fams.length + ' FAMILIAS')
            : 'TODA LA FLOTA ' + (esProp ? 'PROPIA' : 'ALQUILADA');
  var html = '<div class="tbVer"><span class="quien">' + esc(quien) + '</span>'
    + '<span class="tbChip ' + chip[0] + '">' + chip[1] + '</span>'
    + '<span class="sub">' + ((TB.mods.length || TB.eqs.length) && TB.fams.length ? esc(TB.fams.join(' + ')) + ' · ' : '')
    + (TB.eqs.length && TB.mods.length ? esc(TB.mods.join(' + ')) + ' · ' : '') + (esProp ? 'FLOTA PROPIA' : 'FLOTA ALQUILADA')
    + ' · ' + o.n + (o.n === 1 ? ' EQUIPO' : ' EQUIPOS') + ' · ' + (ter ? 'CON ' : 'SIN ') + (esProp ? 'DEPRECIACIÓN' : 'ALQUILER') + ' · AL DÍA ' + corte + ' · ' + esc(frase) + '</span></div>';

  if(!esProp && ter){
    html += '<p class="tbComo" style="border-left-color:#B3261E; color:#B3261E">' + esc(hxAvisoAlq(nodos)) + '</p>';
  }

  /* ---------- 1 · resultado ---------- */
  var comp = [['RyM (materiales y servicios)', 0], ['MOV (mano de obra)', 1], [t3, 2]];
  var maxC = Math.max(c[0], c[1], c[2], v[0], v[1], v[2], 1);
  var filas1 = comp.map(function(x){
    var i = x[1], fuera = !ter && i === 2;
    return '<tr' + (fuera ? ' class="fuera"' : '') + '><td class="t">' + x[0] + (fuera ? ' · no entra al total' : '') + '</td>'
      + '<td>' + fmt(c[i]) + tbBarra(c[i], v[i], maxC, c[i] > v[i] ? 'mal' : 'bien') + '</td>'
      + '<td>' + fmt(v[i]) + '</td><td>' + tbDv(v[i] - c[i]) + '</td>'
      + '<td>' + (c[i] ? tbPc(v[i] / c[i]) : '—') + '</td></tr>';
  }).join('');
  html += tbSec(1, 'Resultado', '¿La venta interna cubre el costo?',
    '<b>Venta interna</b> = tarifa de venta × horas reales: es lo que corresponde gastar por las horas que se trabajaron. '
    + '<b>Costo real</b> = lo cargado en SAP hasta el día ' + corte + (ter ? ', más ' + (esProp ? 'la depreciación' : 'el alquiler (tarifa de venta, no costo real)') : (esProp ? ' (sin la depreciación: botón SIN DEP)' : ' (sin el alquiler, igual que el reporte)'))
    + '. <b>Cobertura</b> = venta ÷ costo: 100% o más es que alcanza. En la barra, la raya negra es la venta; si la barra la pasa, ese componente gastó de más.',
    '<div class="tbCifras">'
    + tbCf('COSTO REAL', tbUS(c[3]), 'lo gastado al día ' + corte)
    + tbCf('VENTA INTERNA', tbUS(v[3]), 'lo que corresponde gastar')
    + tbCf('DESVIACIÓN', tbSig(desv), desv < 0 ? 'se gastó más de lo que la venta da' : 'queda a favor', desv < 0 ? 'mal' : 'bien')
    + tbCf('COBERTURA', c[3] ? tbPc(v[3] / c[3]) : '—', 'venta ÷ costo · la meta es 100% o más', c[3] && v[3] / c[3] < 0.995 ? 'mal' : 'bien')
    + '</div><div class="tbEnv"><table class="tb" data-k=",costo,venta,desv,desv"><thead><tr><th class="t">COMPONENTE</th><th>▼ COSTO REAL</th><th>▲ VENTA</th>'
    + '<th>± VENTA − COSTO</th><th>▲÷▼ COBERTURA</th></tr></thead><tbody>' + filas1
    + '<tr class="tot"><td class="t">Total' + (esProp ? '' : ' (RyM + MOV)') + '</td><td>' + fmt(c[3]) + '<span class="tbBar" style="visibility:hidden"></span></td><td>' + fmt(v[3])
    + '</td><td>' + tbDv(desv) + '</td><td>' + (c[3] ? tbPc(v[3] / c[3]) : '—') + '</td></tr></tbody></table></div>');

  /* ---------- 2 · horas ---------- */
  var proy = h / corte * dias;
  html += tbSec(2, 'Horas', '¿Se trabajó lo que se proformó?',
    'La proforma es del mes completo; para compararla con ' + corte + ' días se prorratea (proforma × ' + corte + ' ÷ ' + dias
    + '). Las horas mandan sobre todo lo demás: <b>con menos horas se vende menos, y el costo que no baja con las horas queda sin cubrir</b>. '
    + 'La disponibilidad mecánica (DM) dice si el equipo estaba listo; el uso, si estando listo se le hizo trabajar. '
    + 'DM alta con uso bajo es un problema de operación, no de mantenimiento. Como referencia general publicada para flotas mineras: DM de 85 a 95% y uso de 70 a 85%; no son metas de San Martín.',
    '<div class="tbCifras">'
    + tbCf('HORAS REALES', fmt(h) + ' h', 'horómetro SAP, al día ' + corte)
    + tbCf('PROFORMA A LA FECHA', fmt(hFecha) + ' h', fmt(o.hrProf) + ' h del mes × ' + corte + '/' + dias)
    + tbCf('CUMPLIMIENTO DE HORAS', hFecha ? tbPc(h / hFecha) : '—', hFecha ? (h >= hFecha ? '+' : '−') + fmt(Math.abs(h - hFecha)) + ' h contra la proforma a la fecha' : 'sin proforma',
           hFecha && h / hFecha < 0.95 ? 'mal' : 'bien')
    + tbCf('PROYECCIÓN AL CIERRE', fmt(proy) + ' h', 'al ritmo actual, contra ' + fmt(o.hrProf) + ' h proformadas')
    + tbCf('DISPONIBILIDAD MECÁNICA', tbPc(o.dm), o.nd + ' de ' + o.n + ' equipos con dato · promedio simple')
    + tbCf('USO', tbPc(o.use), o.nu + ' de ' + o.n + ' equipos con dato · promedio simple')
    + '</div>');

  /* ---------- 3 · tarifa ---------- */
  var maxT = 1;
  comp.forEach(function(x){ if(h) maxT = Math.max(maxT, c[x[1]] / h, v[x[1]] / h); });
  if(h) maxT = Math.max(maxT, tR, tV);
  var filaT = function(nom, cr, vr, cls, fuera){
    var a = h ? cr / h : null, b = h ? vr / h : null;
    return '<tr class="' + (cls || '') + (fuera ? ' fuera' : '') + '"><td class="t">' + nom + '</td>'
      + '<td>' + tbN1(a) + (h ? tbBarra(a, b, maxT, a > b ? 'mal' : 'bien') : '') + '</td>'
      + '<td>' + tbN1(b) + '</td><td>' + (h ? tbDv(a - b, 1) : '—') + '</td>'
      + '<td>' + (h && b ? tbDv((a - b) / b * 100, 0) + '%' : '—') + '</td></tr>';
  };
  /* aqui el signo va al reves que en el resultado: tarifa real por encima de la de venta es malo */
  var tablaT = comp.map(function(x){ return filaT(x[0], c[x[1]], v[x[1]], '', !ter && x[1] === 2); }).join('')
             + filaT('Total' + (ter ? '' : ' (RyM + MOV)'), c[3], v[3], 'tot');
  tablaT = tablaT.replace(/class="neg"/g, 'class="_p"').replace(/class="pos"/g, 'class="neg"').replace(/class="_p"/g, 'class="pos"');
  html += tbSec(3, 'Tarifa', '¿La hora cuesta lo que se cobra por ella?',
    '<b>Tarifa real</b> = costo ÷ horas reales. <b>Tarifa de venta</b> = lo que Operaciones paga por hora. '
    + 'Es la misma comparación del paso 1 llevada a la hora, y sirve para comparar modelos de distinto tamaño. '
    + 'Cuidado con pocas horas: una tarifa real muy alta en un equipo que casi no trabajó no dice que sea caro, dice que estuvo parado.',
    '<div class="tbEnv"><table class="tb" data-k=",treal,tventa,desv,desv"><thead><tr><th class="t">US$ POR HORA</th><th>▼/h TARIFA REAL</th><th>▲/h TARIFA DE VENTA</th>'
    + '<th>± REAL − VENTA</th><th>± %</th></tr></thead><tbody>' + tablaT + '</tbody></table></div>');

  /* ---------- 4 · causa ---------- */
  var efVol = tV !== null && hFecha ? (h - hFecha) * tV : null;
  var hEq = tV ? c[3] / tV : null;
  /* la lectura con las cifras de la seleccion: los dos efectos NO se suman,
     contestan dos preguntas distintas (cuanto costo cada hora y cuantas horas hubo) */
  var casos = [
    ['−', '+', 'Se trabajó más de lo proformado y aun así cada hora costó más de lo que se vende. El problema es el gasto: revisar con mantenimiento (pasos 5 y 6).'],
    ['−', '−', 'Se trabajó menos y cada hora salió cara. Puede ser gasto de más o costo fijo repartido en pocas horas: mirar DM y uso (paso 2) antes de culpar al gasto.'],
    ['+', '−', 'Lo gastado está cubierto, pero se dejaron de trabajar horas proformadas: la conversación es con operaciones y disponibilidad.'],
    ['+', '+', 'Cubre el costo y trabajó más de lo previsto.']];
  var sG = desv < 0 ? '−' : '+', sH = efVol === null ? null : (efVol < 0 ? '−' : '+');
  var lectura = (tR === null || tV === null) ? '' :
    '<p class="tbComo"><b>Con esta selección.</b> Cada hora costó <b>US$ ' + tbN1(tR) + '</b> y se vende a <b>US$ ' + tbN1(tV)
    + '</b>: ' + (tR > tV ? 'US$ ' + tbN1(tR - tV) + ' de más' : 'US$ ' + tbN1(tV - tR) + ' de menos') + ' por hora × ' + fmt(h) + ' h = <b>' + tbSig(desv) + '</b> de efecto gasto. '
    + (efVol === null ? 'No hay proforma para medir el efecto horas.' :
       'Se trabajaron ' + fmt(h) + ' h contra ' + fmt(hFecha) + ' h proformadas a la fecha: ' + (h >= hFecha ? fmt(h - hFecha) + ' h de más' : fmt(hFecha - h) + ' h de menos')
       + ' × US$ ' + tbN1(tV) + ' = <b>' + tbSig(efVol) + '</b> de efecto horas. ')
    + '<b>Las dos cifras no se suman.</b> El efecto gasto ya es el resultado completo del paso 1; el efecto horas dice cuánta venta '
    + (efVol !== null && efVol < 0 ? 'se perdió' : 'de más trajo') + ' el volumen, y esa venta ya está dentro de ese resultado.</p>'
    + '<div class="tbEnv"><table class="tb" data-k=",desv,oper,"><thead><tr><th class="t">CÓMO LEER LA COMBINACIÓN</th><th>± GASTO</th><th>◷ HORAS</th><th class="t">QUÉ SIGNIFICA</th></tr></thead><tbody>'
    + casos.map(function(k){
        var es = k[0] === sG && k[1] === sH;
        return '<tr' + (es ? ' class="tot"' : '') + '><td class="t">' + (es ? '► ESTE CASO' : '') + '</td><td>' + k[0] + '</td><td>' + k[1]
          + '</td><td class="t" style="white-space:normal;min-width:260px">' + k[2] + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  html += tbSec(4, 'Causa', '¿Es un problema de gasto o de horas?',
    'Dos preguntas distintas, cada una con su cifra. '
    + '<b>Efecto gasto</b> = (tarifa de venta − tarifa real) × horas reales. Pregunta: por cada hora que sí se trabajó, ¿se gastó más o menos de lo que se vende? Es la misma desviación del paso 1. Negativo: cada hora costó más de lo que se cobra por ella. '
    + '<b>Efecto horas</b> = (horas reales − proforma a la fecha) × tarifa de venta. Pregunta: ¿se trabajó lo proformado? Positivo: hubo más horas y por eso más venta; negativo: venta que no se generó porque el equipo trabajó menos. '
    + 'No se suman: la venta que trae el efecto horas ya está dentro del resultado del paso 1. '
    + '<b>Horas de equilibrio</b> = costo ÷ tarifa de venta: las horas que habría que trabajar para que la venta cubra lo ya gastado. Debajo de las cifras está la lectura con los números de esta selección.',
    '<div class="tbCifras">'
    + tbCf('EFECTO GASTO', tbSig(desv), 'a las horas reales, contra la tarifa de venta', desv < 0 ? 'mal' : 'bien')
    + tbCf('EFECTO HORAS', efVol === null ? '—' : tbSig(efVol), efVol === null ? 'sin tarifa o sin proforma' : 'venta ' + (efVol < 0 ? 'no generada' : 'adicional') + ' contra la proforma a la fecha',
           efVol !== null && efVol < 0 ? 'mal' : 'bien')
    + tbCf('HORAS DE EQUILIBRIO', hEq === null ? '—' : fmt(hEq) + ' h', hEq === null ? 'sin tarifa de venta' : 'trabajó ' + fmt(h) + ' h · ' + (h >= hEq ? 'ya las pasó' : 'faltan ' + fmt(hEq - h) + ' h'))
    + '</div>' + lectura);

  /* ---------- 5 · destino del costo de mantenimiento ---------- */
  var pf = {}, pp = {}, ots = [], totM = 0;
  nodos.forEach(function(e){
    hxOrdenes(e).forEach(function(x){
      var val = x.o.c[3], fase = x.fase, ot = x.et;
      totM += val;
      var nf = TB_FASE[fase] || '(SIN FASE)', np = TB_PM[ot] || '(SIN CLASE)';
      pf[nf] = (pf[nf] || 0) + val; pp[np] = (pp[np] || 0) + val;
      ots.push({ ot: ot, eq: e.id, txt: (fase ? fase + ' · ' : '') + x.sub, v: val, pm: np });
    });
  });
  ots.sort(function(a, b){ return b.v - a.v; });
  /* RyM por categoria y MOV por tipo de tecnico: salen de la tabla de hechos
     (DATA.F), resultado operativo al corte, solo los equipos elegidos */
  var dRym = {}, dMov = {}, tRym = 0, tMov = 0, esta = {};
  nodos.forEach(function(e){ esta[e.id] = 1; });
  for(var j = 0, nf = F.v.length; j < nf; j++){
    if(F.p[j] !== 0 || !esta[TODOS[F.e[j]].id]) continue;
    var rr = ROS[F.r[j]], cat = CUENTAS[F.u[j]], val = F.v[j];
    if(rr === 'MATERIALES' || rr === 'SERVICIOS'){ dRym[cat] = (dRym[cat] || 0) + val; tRym += val; }
    else if(rr === 'MANO DE OBRA'){
      var nm = TB_TEC[cat] ? TB_TEC[cat] + ' · ' + cat : cat;
      dMov[nm] = (dMov[nm] || 0) + val; tMov += val;
    }
  }
  var desglose = function(acc, tot, tit, sim){
    var arr = Object.keys(acc).map(function(k){ return { n: k, v: acc[k] }; })
                  .filter(function(a){ return Math.abs(a.v) >= 0.5; })
                  .sort(function(a, b){ return b.v - a.v; });
    var mx = arr.length ? Math.abs(arr[0].v) : 1;
    return '<div class="tbEnv"><table class="tb" data-k=",costo,costo"><thead><tr><th class="t">' + sim + ' ' + tit + '</th><th>US$</th><th>%</th></tr></thead><tbody>'
      + (arr.map(function(a){
          return '<tr><td class="t">' + esc(a.n) + '</td><td>' + fmt(a.v) + tbBarra(Math.abs(a.v), null, mx) + '</td><td>'
            + (tot ? (a.v / tot * 100).toFixed(0) : 0) + '%</td></tr>';
        }).join('') || '<tr><td class="t" colspan="3">Sin cargos hasta el día ' + corte + '.</td></tr>')
      + '<tr class="tot"><td class="t">Total</td><td>' + fmt(tot) + '<span class="tbBar" style="visibility:hidden"></span></td><td>100%</td></tr>'
      + '</tbody></table></div>';
  };
  /* primero las diez mas caras; el boton de abajo despliega todas */
  var lim = TB.todasOts ? ots.length : Math.min(10, ots.length);
  var lista = function(acc){
    var arr = Object.keys(acc).map(function(k){ return { n: k, v: acc[k] }; }).sort(function(a, b){ return b.v - a.v; });
    var mx = arr.length ? Math.abs(arr[0].v) : 1;
    return '<div class="tbEnv"><table class="tb"><tbody>' + arr.map(function(a){
      return '<tr><td class="t">' + esc(a.n) + '</td><td>' + fmt(a.v) + tbBarra(Math.abs(a.v), null, mx) + '</td><td>'
        + (totM ? (a.v / totM * 100).toFixed(0) : 0) + '%</td></tr>';
    }).join('') + '</tbody></table></div>';
  };
  var acum = 0, n80 = 0;
  ots.forEach(function(x, i){ if(acum < totM * 0.8){ acum += x.v; n80 = i + 1; } });
  acum = 0;
  html += tbSec(5, 'RyM y MOV', '¿En qué se fue el costo de mantenimiento?',
    'Sólo RyM y mano de obra, que son lo que pasa por órdenes de trabajo (' + tbUS(totM) + ' en ' + fmt(ots.length) + ' órdenes). '
    + 'A la izquierda el <b>RyM</b> abierto por categoría: qué se compró o contrató (repuestos, llantas, lubricantes, servicios de terceros…). '
    + 'A la derecha la <b>mano de obra</b> abierta por tipo de técnico. Debajo, las órdenes de la más cara a la más barata (primero diez; el botón de abajo despliega todas). En esa tabla, <b>% del total</b> es la parte de cada orden y <b>% acumulado</b> va sumando de arriba hacia abajo (lectura de Pareto); '
    + 'la fila «las otras órdenes» completa hasta 100%. Casi siempre unas pocas órdenes explican la mayor parte: aquí <b>' + n80 + ' de ' + ots.length + ' órdenes hacen el 80%</b> del costo. Esas son las que hay que revisar una por una.',
    '<div class="duo" style="gap:16px 24px"><div>' + desglose(dRym, tRym, 'RYM · MATERIALES Y SERVICIOS POR CATEGORÍA', '▼')
    + '</div><div>' + desglose(dMov, tMov, 'MOV · MANO DE OBRA POR TIPO DE TÉCNICO', '▼') + '</div></div>'
    + '<div class="tbEnv"><table class="tb" data-k=",,,costo,costo,costo"><thead><tr><th class="t">ORDEN</th><th class="t">EQUIPO</th>'
    + '<th class="t">FASE · TRABAJO</th><th>▼ COSTO US$</th><th>% DEL TOTAL</th><th>% ACUMULADO</th></tr></thead><tbody>'
    + (ots.slice(0, lim).map(function(x){
        acum += x.v;
        return '<tr><td class="t">' + esc(x.ot) + '</td><td class="t">' + esc(x.eq)
          + '</td><td class="t" style="white-space:normal;min-width:240px">' + esc(x.txt) + '</td><td>' + fmt(x.v) + '</td><td>'
          + (totM ? (x.v / totM * 100).toFixed(1) : 0) + '%</td><td>'
          + (totM ? (acum / totM * 100).toFixed(0) : 0) + '%</td></tr>';
      }).join('') || '<tr><td class="t" colspan="6">Sin órdenes con cargo hasta el día ' + corte + '.</td></tr>')
    /* plegada, el resto va en una fila para que el acumulado llegue a 100%
       y no parezca que falta costo; desplegada, llega sola en la ultima orden */
    + (ots.length > lim ? '<tr class="fuera"><td class="t" colspan="3">Las otras ' + (ots.length - lim) + ' órdenes</td><td>'
        + fmt(totM - acum) + '</td><td>' + (totM ? ((totM - acum) / totM * 100).toFixed(1) : 0) + '%</td><td>100%</td></tr>' : '')
    + (ots.length ? '<tr class="tot"><td class="t" colspan="3">Total de mantenimiento · ' + ots.length + ' órdenes</td><td>'
        + fmt(totM) + '</td><td>100%</td><td></td></tr>' : '')
    + '</tbody></table></div>'
    + (ots.length > 10 ? '<div class="bot" style="margin-top:10px"><button class="fbt" type="button" data-todas="1" aria-expanded="'
        + !!TB.todasOts + '">' + (TB.todasOts ? 'VER SÓLO LAS 10 MÁS CARAS' : 'VER LAS ' + ots.length + ' ÓRDENES') + '</button></div>' : ''));

  /* ---------- 6 · equipos ---------- */
  var eqs = nodos.slice().sort(function(a, b){
    return (hxTv(a.o, ter) - hxTc(a.o, ter)) - (hxTv(b.o, ter) - hxTc(b.o, ter));
  });
  var negTot = 0, negN = 0, ac2 = 0;
  eqs.forEach(function(e){ var d = hxTv(e.o, ter) - hxTc(e.o, ter); if(d < 0) negTot += d; });
  eqs.forEach(function(e){ var d = hxTv(e.o, ter) - hxTc(e.o, ter); if(d < 0 && ac2 > negTot * 0.8){ ac2 += d; negN++; } });
  var filasE = eqs.map(function(e){
    var q = e.o, qc = hxTc(q, ter), qv = hxTv(q, ter), d = qv - qc, hf = q.hrProf * corte / dias, ab = TB.ab[e.id];
    var ords = hxOrdenes(e);
    var fila = '<tr class="eq" tabindex="0" data-eq="' + esc(e.id) + '"><td class="t">' + (ords.length ? (ab ? '▾ ' : '▸ ') : '&nbsp;&nbsp;') + '<b>' + esc(e.id) + '</b>'
      + (TB.mods.length === 1 ? '' : ' <span class="z">' + esc(e.mod) + '</span>') + '</td>'
      + '<td>' + fmt(qc) + '</td><td>' + fmt(qv) + '</td><td>' + tbDv(d) + '</td>'
      + '<td>' + tbN1(q.hr) + '</td><td>' + (hf ? tbPc(q.hr / hf) : '—') + '</td>'
      + '<td>' + tbPc(q.dm) + '</td><td>' + tbPc(q.use) + '</td>'
      + '<td>' + tbN1(q.hr ? qc / q.hr : null) + '</td><td>' + tbN1(q.hr ? qv / q.hr : null) + '</td></tr>';
    if(ab) fila += ords.map(function(x){
      return '<tr class="ot"><td class="t">' + esc(x.et) + ' · ' + esc((x.fase ? x.fase + ' · ' : '') + x.sub) + '</td><td>' + fmt(x.o.c[3])
        + '</td><td colspan="8" class="t">RyM ' + fmt(x.o.c[0]) + ' · MOV ' + fmt(x.o.c[1]) + '</td></tr>';
    }).join('');
    return fila;
  }).join('');
  html += tbSec(6, 'Equipos', '¿Quiénes lo explican?',
    'Ordenados del que más pierde al que más gana. ' + (negTot < 0
      ? '<b>' + negN + ' de ' + eqs.length + (negN === 1 ? ' equipos explica' : ' equipos explican') + ' el 80% de la desviación negativa</b> (' + tbUS(-negTot) + ' en total): ahí está la conversación. '
      : 'Ningún equipo tiene desviación negativa. ')
    + 'Un equipo en rojo con pocas horas es un equipo parado, no necesariamente caro: mira su DM y su uso antes de concluir. Clic en un equipo para ver sus órdenes de trabajo.',
    '<div class="tbEnv"><table class="tb" id="tb-eqs" data-k=",costo,venta,desv,oper,oper,oper,oper,treal,tventa"><thead><tr><th class="t">EQUIPO</th><th>▼ COSTO</th><th>▲ VENTA</th><th>± VENTA − COSTO</th>'
    + '<th>◷ HORAS</th><th>◷ % DE PROFORMA</th><th>◷ DM</th><th>◷ USO</th><th>▼/h TARIFA REAL</th><th>▲/h T. VENTA</th></tr></thead><tbody>'
    + filasE + '</tbody></table></div>');

  /* ---------- 7 · acumulado ---------- */
  var A = { c: o.A.c.slice(), v: o.A.v.slice(), h: o.A.h };
  A.c[4] = hxTac(o, ter); A.v[3] = hxTav(o, ter);
  var dA = A.v[3] - A.c[4], per = (SEP.acumPeriodos || []).length;
  html += tbSec(7, 'Acumulado 2026', '¿Es cosa de este mes o viene de antes?',
    'Libro mayor de los ' + per + ' meses que trae el consolidado, más setiembre al día ' + corte + '. <b>No incluye agosto</b>, porque el consolidado no lo trae. '
    + 'Sirve para distinguir un mes malo de una tendencia: si el mes no cumple pero el año sí, puede ser una orden puntual; si ninguno cumple, la tarifa de venta o el costo del modelo están desalineados.',
    '<div class="tbCifras">'
    + tbCf('COSTO ACUMULADO', tbUS(A.c[4]), 'RyM ' + fmtK(A.c[0]) + ' · MOV ' + fmtK(A.c[1]) + (ter ? (esProp ? ' · Dep ' : ' · Alq ') + fmtK(A.c[2]) : ''))
    + tbCf('VENTA ACUMULADA', tbUS(A.v[3]), 'tarifa de venta × ' + fmt(A.h) + ' h acumuladas')
    + tbCf('DESVIACIÓN ACUMULADA', tbSig(dA), A.c[4] ? 'cobertura ' + tbPc(A.v[3] / A.c[4]) : '', dA < 0 ? 'mal' : 'bien')
    + tbCf('TARIFA REAL ACUMULADA', 'US$ ' + tbN1(A.h ? A.c[4] / A.h : null) + '/h', 'contra US$ ' + tbN1(A.h ? A.v[3] / A.h : null) + '/h de venta · este mes ' + tbN1(tR))
    + '</div>');

  html += tbSec(8, 'Criterio', '¿De dónde sale este orden de análisis?', '',
    '<div class="tbRefs"><p>Los siete pasos siguen tres ideas de uso común en gestión de flotas y en contabilidad de gestión. Los rangos citados son referencias generales publicadas, no metas de San Martín.</p><ul>'
    + '<li><b>Presupuesto flexible:</b> comparar el costo contra lo que correspondía gastar al nivel real de actividad, y separar el efecto del volumen del efecto del gasto. '
    + '<a href="https://www.accountingtools.com/articles/what-is-a-flexible-budget-variance.html" target="_blank" rel="noopener">AccountingTools</a> · '
    + '<a href="https://courses.lumenlearning.com/wm-managerialaccounting/chapter/flexible-budget-variance/" target="_blank" rel="noopener">Lumen, Managerial Accounting</a></li>'
    + '<li><b>Recuperación de costos de equipo:</b> la tarifa interna debe cubrir al menos el costo, y es muy sensible a las horas: a menos horas, más cara sale la hora. '
    + '<a href="https://www.constructionequipment.com/topical/executive-institute/article/10758472/time-to-rethink-the-equipment-rate-calculation" target="_blank" rel="noopener">Construction Equipment</a> · '
    + '<a href="https://equipmentwatch.com/resource/cost-recovery-2/" target="_blank" rel="noopener">EquipmentWatch</a></li>'
    + '<li><b>Indicadores de flota minera:</b> disponibilidad, uso, costo de mantenimiento por hora y peso del trabajo planificado. '
    + '<a href="https://honestdig.io/blog/mining-equipment-maintenance-kpis" target="_blank" rel="noopener">HonestDig</a> · '
    + '<a href="https://heavyvehicleinspection.com/fleet-management/uptime/mining-uptime-benchmark" target="_blank" rel="noopener">HVI</a></li>'
    + '</ul></div>');

  /* lo que adelanta cada nube: la cifra que responde su pregunta */
  var R = {
    1: [tbSig(desv), desv < 0 ? 'mal' : 'bien'],
    2: [hFecha ? tbPc(h / hFecha) + ' de la proforma' : fmt(h) + ' h', hFecha && h / hFecha < 0.95 ? 'mal' : 'bien'],
    3: [tR === null ? 'sin horas' : tbN1(tR) + ' vs ' + tbN1(tV) + ' /h', tR !== null && tR > tV ? 'mal' : 'bien'],
    4: [efVol === null ? 'gasto ' + tbSig(desv) : 'gasto ' + (desv < 0 ? '−' : '+') + fmtK(Math.abs(desv)) + ' · horas ' + (efVol < 0 ? '−' : '+') + fmtK(Math.abs(efVol)), desv < 0 ? 'mal' : 'bien'],
    5: [tbUS(totM) + ' · ' + ots.length + ' OT', ''],
    6: [negTot < 0 ? negN + ' de ' + eqs.length + ' explican el 80%' : 'ninguno pierde', negTot < 0 ? 'mal' : 'bien'],
    7: [tbSig(dA), dA < 0 ? 'mal' : 'bien'],
    8: ['fuentes y referencias', '']
  };
  var sel = TB.paso;
  if(sel && !TB_SECS.some(function(x){ return x.n === sel; })) sel = TB.paso = 1;
  var nubes = '<div class="tbNubes" role="tablist" aria-label="Pasos del análisis">' + TB_SECS.map(function(x){
    var on = sel === x.n, r = R[x.n] || ['', ''];
    return '<button type="button" role="tab" class="tbNube k-' + TB_PASO[x.n] + (on ? ' on' : '') + '" data-paso="' + x.n + '"'
      + ' aria-selected="' + on + '" tabindex="' + (on || (!sel && x.n === 1) ? '0' : '-1') + '">'
      + '<span class="np">' + (x.n === 8 ? 'CRITERIO' : 'PASO ' + x.n) + '<span class="sm">' + TB_PASO_SIM[x.n] + '</span></span>'
      + '<b>' + x.titulo + '</b><span class="res ' + r[1] + '">' + r[0] + '</span></button>';
  }).join('')
    + '<button type="button" class="tbNube todos' + (sel === 0 ? ' on' : '') + '" data-paso="0" aria-pressed="' + (sel === 0) + '">'
    + '<span class="np">TODO</span><b>' + (sel === 0 ? 'Plegar' : 'Ver todo') + '</b><span class="res">'
    + (sel === 0 ? 'volver a un paso' : 'los ' + TB_SECS.length + ' seguidos') + '</span></button></div>';
  var panel = TB_SECS.filter(function(x){ return !sel || x.n === sel; }).map(function(x){ return x.html; }).join('');
  cont.innerHTML = tbColor(html + nubes + '<div class="tbPanel" role="tabpanel">' + panel + '</div>');
}

/* conFam === false: la lista de familias no se rehace (se esta marcando en ella) */
function tbOpciones(conFam){
  var nodos = HX[tbHoja()].todos || [], fams = [], mods = [], nEq = {}, nFam = {};
  nodos.forEach(function(e){
    if(fams.indexOf(e.fam) < 0) fams.push(e.fam);
    nFam[e.fam] = (nFam[e.fam] || 0) + 1;
  });
  TB.fams = TB.fams.filter(function(f){ return fams.indexOf(f) >= 0; });
  nodos.forEach(function(e){
    if(!TB.fams.length || TB.fams.indexOf(e.fam) >= 0){
      if(mods.indexOf(e.mod) < 0) mods.push(e.mod);
      nEq[e.mod] = (nEq[e.mod] || 0) + 1;
    }
  });
  TB.mods = TB.mods.filter(function(m){ return mods.indexOf(m) >= 0; });
  /* la lista de familias con casillas, igual que la de modelos */
  if(conFam !== false){
    htm('tb-famCaja', fams.sort().map(function(f){
      return '<label class="despIt"><input type="checkbox" value="' + esc(f) + '"'
        + (TB.fams.indexOf(f) >= 0 ? ' checked' : '') + '><span>' + esc(f || '(sin familia)') + '</span>'
        + '<small>' + nFam[f] + (nFam[f] === 1 ? ' eq' : ' eqs') + '</small></label>';
    }).join('') + '<div class="despPie"><button type="button" data-a="todos">TODAS</button>'
      + '<button type="button" data-a="listo">LISTO</button></div>');
  }
  txt('tb-famRot', !TB.fams.length ? 'TODAS' : TB.fams.length <= 2 ? TB.fams.join(' + ') : TB.fams.length + ' FAMILIAS');
  /* la lista de modelos con casillas; cada uno con sus equipos al costado */
  htm('tb-modCaja', mods.sort().map(function(m){
    return '<label class="despIt"><input type="checkbox" value="' + esc(m) + '"'
      + (TB.mods.indexOf(m) >= 0 ? ' checked' : '') + '><span>' + esc(m || '(sin modelo)') + '</span>'
      + '<small>' + nEq[m] + (nEq[m] === 1 ? ' eq' : ' eqs') + '</small></label>';
  }).join('') + '<div class="despPie"><button type="button" data-a="todos">TODOS</button>'
    + '<button type="button" data-a="listo">LISTO</button></div>');
  txt('tb-modRot', !TB.mods.length ? 'TODOS' : TB.mods.length <= 3 ? TB.mods.join(' + ') : TB.mods.length + ' MODELOS');
  tbEqPodar(); tbEqFiltro();
  var st = $('tb-tipo'); if(st) st.value = TB.tipo;
  var ter = HX[tbHoja()].ter, nom = TB.tipo === 'PROPIO' ? 'DEP' : 'ALQ';
  txt('tb-ter-t', (TB.tipo === 'PROPIO' ? 'DEPRECIACIÓN' : 'ALQUILER') + ' EN EL COSTO');
  htm('tb-ter', '<button class="fbt" type="button" data-t="1" aria-pressed="' + !!ter + '">CON ' + nom + '</button>'
    + '<button class="fbt" type="button" data-t="0" aria-pressed="' + !ter + '">SIN ' + nom + '</button>');
}
/* ---------- el filtro de equipos ---------- */
/* al cambiar familia o modelo quedan solo los equipos elegidos que siguen dentro */
function tbEqPodar(){
  var ids = tbEqDisponibles().map(function(e){ return e.id; });
  TB.eqs = TB.eqs.filter(function(id){ return ids.indexOf(id) >= 0; });
}
function tbEqRotulo(){
  txt('tb-eqRot', !TB.eqs.length ? 'TODOS' : TB.eqs.length <= 3 ? TB.eqs.join(' + ') : TB.eqs.length + ' EQUIPOS');
}
function tbEqItems(){
  var f = (($('tb-eqBusca') || {}).value || '').trim().toUpperCase();
  var xs = tbEqDisponibles().filter(function(e){ return !f || e.busca.indexOf(f) >= 0; })
                            .sort(function(a, b){ return a.id < b.id ? -1 : a.id > b.id ? 1 : 0; });
  htm('tb-eqItems', xs.map(function(e){
    return '<label class="despIt"><input type="checkbox" value="' + esc(e.id) + '"'
      + (TB.eqs.indexOf(e.id) >= 0 ? ' checked' : '') + '><span>' + esc(e.id) + '</span>'
      + '<small>' + esc(e.mod || '') + '</small></label>';
  }).join('') || '<p class="tbEqNada">Ningún equipo con «' + esc(f) + '».</p>');
}
function tbEqChips(){
  htm('tb-eqChips', TB.eqs.map(function(id){
    return '<span class="tbEqChip">' + esc(id) + '<button type="button" data-q="' + esc(id) + '" aria-label="Quitar ' + esc(id) + '" title="Quitar">×</button></span>';
  }).join('') + (TB.eqs.length > 1 ? '<button type="button" class="tbLimpiar" data-q="*">quitar todos</button>' : ''));
}
function tbEqFiltro(){
  tbEqRotulo(); tbEqItems(); tbEqChips();
  htm('tb-eqDl', tbEqDisponibles().map(function(e){
    return '<option value="' + esc(e.id) + '">' + esc(e.mod || '') + '</option>';
  }).join(''));
  var lista = TB.eqModo === 'lista', a = $('tb-eqLista'), b = $('tb-eqEsc');
  if(a) a.hidden = !lista;
  if(b) b.hidden = lista;
  Array.prototype.forEach.call(document.querySelectorAll('#v-tablero .tbModo button'), function(x){
    x.setAttribute('aria-pressed', x.getAttribute('data-m') === TB.eqModo);
  });
}
/* cambio la seleccion de equipos: se repinta el tablero y los dos modos */
function tbEqCambio(){
  TB.ab = {};
  tbEqRotulo(); tbEqChips();
  tbPintar();
}
/* codigos escritos: separados por coma, espacio o punto y coma, sin
   importar mayusculas; los que no estan entre los equipos disponibles se avisan */
function tbEqAgregar(texto){
  var disp = tbEqDisponibles(), malos = [];
  (texto || '').split(/[\s,;]+/).forEach(function(t){
    t = t.trim().toUpperCase();
    if(!t) return;
    var e = disp.filter(function(x){ return x.id.toUpperCase() === t; })[0];
    if(!e){
      var parecidos = disp.filter(function(x){ return x.id.toUpperCase().indexOf(t) >= 0; });
      if(parecidos.length === 1) e = parecidos[0];
    }
    if(e){ if(TB.eqs.indexOf(e.id) < 0) TB.eqs.push(e.id); }
    else malos.push(t);
  });
  txt('tb-eqMsg', malos.length ? 'No está en la selección de familia y modelo: ' + malos.join(', ') : '');
  tbEqItems();
  tbEqCambio();
}

/* la hoja de esa flota cambio con o sin el tercer componente: el tablero la sigue */
function tbTer(s){
  if(s !== tbHoja()) return;
  tbOpciones(); tbPintar();
}
/* desde las hojas Propios y Alquilados: abre el tablero de esa familia, modelo o equipo */
function abrirTablero(tipo, fam, mod, eq){
  TB.tipo = tipo; TB.fams = fam ? [fam] : []; TB.mods = mod ? [mod] : []; TB.eqs = eq ? [eq] : []; TB.ab = {};
  tbOpciones(); tbPintar();
  irA('v-tablero');
}

if($('tb-cuerpo') && SEP && SEP.eq){
  esc_('tb-tipo', 'change', function(){ TB.tipo = this.value; TB.fams = []; TB.mods = []; TB.eqs = []; TB.ab = {}; tbOpciones(); tbPintar(); });
  /* un desplegable abierto cierra los otros dos */
  var tbCerrarOtros = function(menos){
    ['tb-famCaja', 'tb-modCaja', 'tb-eqCaja'].forEach(function(id){
      var c = $(id);
      if(id === menos || !c || c.hidden) return;
      c.hidden = true;
      var b = $(id.replace('Caja', 'Btn')); if(b) b.setAttribute('aria-expanded', 'false');
    });
  };
  /* varias familias a la vez: los modelos y equipos se acotan a ellas */
  var fCaja = $('tb-famCaja'), fBt = $('tb-famBtn');
  var cerrarFam = function(){ fCaja.hidden = true; fBt.setAttribute('aria-expanded', 'false'); };
  fBt.addEventListener('click', function(ev){
    ev.stopPropagation();
    var abierto = fBt.getAttribute('aria-expanded') === 'true';
    tbCerrarOtros('tb-famCaja');
    fBt.setAttribute('aria-expanded', !abierto);
    fCaja.hidden = abierto;
  });
  fCaja.addEventListener('change', function(){
    TB.fams = Array.prototype.filter.call(fCaja.querySelectorAll('input'), function(x){ return x.checked; })
                .map(function(x){ return x.value; });
    TB.ab = {};
    tbOpciones(false); tbPintar();
  });
  fCaja.addEventListener('click', function(ev){
    ev.stopPropagation();
    var b = ev.target.closest ? ev.target.closest('[data-a]') : null;
    if(!b) return;
    if(b.getAttribute('data-a') === 'todos'){
      TB.fams = []; TB.ab = {};
      Array.prototype.forEach.call(fCaja.querySelectorAll('input'), function(x){ x.checked = false; });
      tbOpciones(false); tbPintar();
    } else cerrarFam();
  });
  document.addEventListener('click', function(){ if(!fCaja.hidden) cerrarFam(); });
  fCaja.addEventListener('keydown', function(ev){ if(ev.key === 'Escape'){ cerrarFam(); fBt.focus(); } });
  /* varios modelos a la vez: cada casilla repinta al momento */
  var caja = $('tb-modCaja'), bt = $('tb-modBtn');
  var cerrarCaja = function(){ caja.hidden = true; bt.setAttribute('aria-expanded', 'false'); };
  bt.addEventListener('click', function(ev){
    ev.stopPropagation();
    var abierto = bt.getAttribute('aria-expanded') === 'true';
    tbCerrarOtros('tb-modCaja');
    bt.setAttribute('aria-expanded', !abierto);
    caja.hidden = abierto;
  });
  caja.addEventListener('click', function(ev){ ev.stopPropagation(); });
  caja.addEventListener('change', function(){
    TB.mods = Array.prototype.filter.call(caja.querySelectorAll('input'), function(x){ return x.checked; })
                .map(function(x){ return x.value; });
    TB.ab = {};
    txt('tb-modRot', !TB.mods.length ? 'TODOS' : TB.mods.length <= 3 ? TB.mods.join(' + ') : TB.mods.length + ' MODELOS');
    tbEqPodar(); tbEqFiltro();
    tbPintar();
  });
  caja.addEventListener('click', function(ev){
    var b = ev.target.closest ? ev.target.closest('[data-a]') : null;
    if(!b) return;
    if(b.getAttribute('data-a') === 'todos'){
      TB.mods = []; TB.ab = {};
      Array.prototype.forEach.call(caja.querySelectorAll('input'), function(x){ x.checked = false; });
      txt('tb-modRot', 'TODOS');
      tbEqFiltro();
      tbPintar();
    } else cerrarCaja();
  });
  document.addEventListener('click', function(){ if(!caja.hidden) cerrarCaja(); });
  caja.addEventListener('keydown', function(ev){ if(ev.key === 'Escape'){ cerrarCaja(); bt.focus(); } });

  /* ---------- equipos: lista con casillas o codigos escritos ---------- */
  var eCaja = $('tb-eqCaja'), eBt = $('tb-eqBtn'), eIn = $('tb-eqIn');
  var cerrarEq = function(){ eCaja.hidden = true; eBt.setAttribute('aria-expanded', 'false'); };
  eBt.addEventListener('click', function(ev){
    ev.stopPropagation();
    var abierto = eBt.getAttribute('aria-expanded') === 'true';
    tbCerrarOtros('tb-eqCaja');
    eBt.setAttribute('aria-expanded', !abierto);
    eCaja.hidden = abierto;
    if(!abierto){ var bq = $('tb-eqBusca'); if(bq) bq.focus(); }
  });
  eCaja.addEventListener('click', function(ev){
    ev.stopPropagation();
    var b = ev.target.closest ? ev.target.closest('[data-a]') : null;
    if(!b) return;
    var a = b.getAttribute('data-a');
    if(a === 'todos'){ TB.eqs = []; tbEqItems(); tbEqCambio(); }
    else if(a === 'visibles'){
      Array.prototype.forEach.call(eCaja.querySelectorAll('#tb-eqItems input'), function(x){
        if(TB.eqs.indexOf(x.value) < 0) TB.eqs.push(x.value);
      });
      tbEqItems(); tbEqCambio();
    } else cerrarEq();
  });
  eCaja.addEventListener('change', function(ev){
    var x = ev.target;
    if(!x.matches || !x.matches('#tb-eqItems input')) return;
    var i = TB.eqs.indexOf(x.value);
    if(x.checked && i < 0) TB.eqs.push(x.value);
    if(!x.checked && i >= 0) TB.eqs.splice(i, 1);
    tbEqCambio();
  });
  esc_('tb-eqBusca', 'input', tbEqItems);
  document.addEventListener('click', function(){ if(!eCaja.hidden) cerrarEq(); });
  eCaja.addEventListener('keydown', function(ev){ if(ev.key === 'Escape'){ cerrarEq(); eBt.focus(); } });
  /* el modo: lista o escribir; la seleccion es la misma en los dos */
  Array.prototype.forEach.call(document.querySelectorAll('#v-tablero .tbModo button'), function(b){
    b.addEventListener('click', function(){
      TB.eqModo = b.getAttribute('data-m');
      try { localStorage.setItem('torreSet.tbEqModo', TB.eqModo); } catch(e){}
      cerrarEq(); tbEqFiltro();
      if(TB.eqModo === 'escribir' && eIn) eIn.focus();
    });
  });
  /* escribir: Enter, coma o salir del campo agregan; elegir de la lista sugerida agrega al momento */
  eIn.addEventListener('keydown', function(ev){
    if(ev.key === 'Enter' || ev.key === ','){
      ev.preventDefault();
      if(eIn.value.trim()){ tbEqAgregar(eIn.value); eIn.value = ''; }
    } else if(ev.key === 'Backspace' && !eIn.value && TB.eqs.length){
      TB.eqs.pop(); tbEqItems(); tbEqCambio();
    }
  });
  eIn.addEventListener('input', function(ev){
    if(ev.inputType === 'insertReplacementText' || !ev.inputType){
      var v = eIn.value.trim().toUpperCase();
      if(tbEqDisponibles().some(function(x){ return x.id.toUpperCase() === v; })){ tbEqAgregar(v); eIn.value = ''; }
    }
  });
  eIn.addEventListener('change', function(){ if(eIn.value.trim()){ tbEqAgregar(eIn.value); eIn.value = ''; } });
  /* clic en el espacio libre del campo: se escribe ahi */
  esc_('tb-eqCampo', 'click', function(ev){ if(ev.target === this) eIn.focus(); });
  esc_('tb-eqChips', 'click', function(ev){
    var b = ev.target.closest ? ev.target.closest('[data-q]') : null;
    if(!b) return;
    var q = b.getAttribute('data-q');
    TB.eqs = q === '*' ? [] : TB.eqs.filter(function(id){ return id !== q; });
    tbEqItems(); tbEqCambio();
    eIn.focus();
  });
  esc_('tb-ter', 'click', function(ev){
    var b = ev.target.closest ? ev.target.closest('[data-t]') : null;
    if(b) hxPonerTer(tbHoja(), b.getAttribute('data-t') === '1');
  });
  /* la explicacion abierta sigue abierta al repintar (al abrir un equipo,
     al cambiar de modelo): se recuerda por paso */
  $('tb-cuerpo').addEventListener('toggle', function(ev){
    var d = ev.target;
    if(d.matches && d.matches('details[data-como]')){
      TB.como = TB.como || {};
      TB.como[d.getAttribute('data-como')] = d.open;
    }
  }, true);
  var tbFocoNube = function(n){
    var b = $('tb-cuerpo').querySelector('.tbNube[data-paso="' + n + '"]');
    if(b) b.focus();
  };
  var tbAlternar = function(ev){
    var nube = ev.target.closest ? ev.target.closest('[data-paso]') : null;
    if(nube){
      var n = parseInt(nube.getAttribute('data-paso'), 10);
      /* «ver todo» es un interruptor: si ya estan todos, vuelve al primero */
      TB.paso = (n === 0 && TB.paso === 0) ? 1 : n;
      tbPintar(); tbFocoNube(n === 0 ? 0 : TB.paso);
      return;
    }
    var bt = ev.target.closest ? ev.target.closest('[data-todas]') : null;
    if(bt){
      TB.todasOts = !TB.todasOts;
      tbPintar();
      var otro = $('tb-cuerpo').querySelector('[data-todas]');
      if(otro) otro.focus();
      return;
    }
    var tr = ev.target.closest ? ev.target.closest('tr.eq') : null;
    if(!tr) return;
    var id = tr.getAttribute('data-eq');
    if(TB.ab[id]) delete TB.ab[id]; else TB.ab[id] = 1;
    tbPintar();
    var otra = $('tb-cuerpo').querySelector('tr.eq[data-eq="' + id.replace(/["\\]/g, '\\$&') + '"]');
    if(otra) otra.focus();
  };
  $('tb-cuerpo').addEventListener('click', tbAlternar);
  $('tb-cuerpo').addEventListener('keydown', function(ev){
    var nube = ev.target.closest ? ev.target.closest('.tbNube[role="tab"]') : null;
    if(nube && (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft')){
      /* flechas entre nubes, como en unas pestañas */
      ev.preventDefault();
      var ns = TB_SECS.map(function(x){ return x.n; }), i = ns.indexOf(parseInt(nube.getAttribute('data-paso'), 10));
      var sig = ns[(i + (ev.key === 'ArrowRight' ? 1 : ns.length - 1)) % ns.length];
      TB.paso = sig; tbPintar(); tbFocoNube(sig);
      return;
    }
    if(nube) return;                         /* un boton ya responde a Enter y espacio */
    if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); tbAlternar(ev); }
  });
  tbOpciones(); tbPintar();
}
