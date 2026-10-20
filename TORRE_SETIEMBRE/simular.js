/* ══════════════════════════════════════════════════════════════════
   SIMULAR — cambiar cifras de Flota completa y ver cómo se mueve todo

   Con ✎ SIMULAR (junto al título) un clic en una cifra abre su editor;
   doble clic también, siempre. Se pueden cambiar las horas reales, las
   horas de proforma, el costo y la venta (por componente o el total) y
   las dos tarifas. Lo demás se recalcula como en la hoja:

     venta interna  = tarifa de venta × horas reales
     Dep (propios)  = tarifa de depreciación × horas reales (salvo los que van por días)
     Alq            = tarifa de alquiler × horas reales (salvo los que van por días)
     tarifa real    = costo ÷ horas reales;  tarifa de venta = venta ÷ horas reales
     desviación     = venta − costo;  acumulado = año anterior + el mes

   Así, al cambiar las horas se mueven la venta, Dep y Alq (con su tarifa
   fija) y las tarifas reales (con el costo fijo); RyM y MOV no, porque son
   lo gastado. Un cambio en un grupo (proyecto, flota, familia, modelo o el
   total) se reparte entre sus equipos en proporción a lo que cada uno
   tiene (parejo si todos están en cero).

   Cada cambio guarda los equipos que tocó (los de la fila al hacerlo) y el
   valor buscado; se aplican en orden al armar el árbol (hxArbol), así un
   cambio sobre algo ya simulado parte de lo simulado. La celda cambiada
   lleva una esquina azul, las que se movieron por él un velo azul con la
   cifra real debajo, y la barra de arriba de la tabla los lista con IR y
   ✕; VOLVER A LO REAL los borra y VER REAL los aparta sin borrarlos. Son
   de cada hoja (T y U por separado, para comparar real contra simulado en
   la pantalla dividida) y de cada mes, y se guardan sólo en este
   navegador: no tocan el Excel, la base ni los comentarios. Un cambio
   cuyos equipos no están con el filtro de ahora (proyecto o flota) queda
   en pausa. El Tablero y las demás pestañas siguen con lo real.
   Va después de hojas.js y comentarios.js: envuelve hxArbol, hxTabla,
   hxCifras, hxBarraOrigen y hxContexto, y vuelve a declarar hxCeldas.
   ══════════════════════════════════════════════════════════════════ */
var SIM = { T: [], U: [] }, SIM_VER = { T: true, U: true }, SIM_MODO = { T: false, U: false };
var simAbierto = null;
function simGuardar(s){ try { localStorage.setItem('torreSet.sim.' + s, JSON.stringify(SIM[s] || [])); } catch(e){} }
function simCargar(s){
  try { var x = JSON.parse(localStorage.getItem('torreSet.sim.' + s) || '[]'); if(x && x.length) SIM[s] = x; } catch(e){}
}
/* los cambios del mes que muestra la hoja, en orden */
/* hojas.js arma las tablas antes de que este archivo asigne sus variables
   (hxCeldas ya es esta): hasta entonces no hay simulacion */
function simLista(s){ var st = HX[s]; return (SIM && SIM[s] || []).filter(function(c){ return c.mes === hxMesDe(st); }); }
function simActivo(s){ return !!(SIM_VER && SIM_VER[s] && hxEsT(s) && simLista(s).length); }

/* ---------- qué es cada columna ---------- */
/* campo: hr horas reales, hp horas de proforma; c costo, v venta, r tarifa
   real, t tarifa de venta, seguidos del componente (0 RyM, 1 MOV, 2 Dep,
   3 Alq) o T (el total) */
function simCampo(col){
  var p = String(col).split('-'), g = p[0], i = parseInt(p[1], 10);
  if(g === 'oper') return i === 2 ? 'hr' : i === 3 ? 'hp' : null;
  var L = { costo: 'c', venta: 'v', treal: 'r', tventa: 't' }[g];
  if(!L || isNaN(i)) return null;
  return L + (i === 4 ? 'T' : i);
}
var SIM_COMP = ['RyM', 'MOV', 'Dep', 'Alq'];
function simFormula(col){
  var p = String(col).split('-'), g = p[0], i = parseInt(p[1], 10), cp = SIM_COMP[i] || 'total';
  if(g === 'oper') return ['%DM: disponibilidad mecánica, tal cual de la hoja.', '% Uso: tal cual de la hoja.',
    'Horas reales del horómetro de SAP: es una entrada. Con ellas se calculan la venta, Dep, Alq y las tarifas.',
    'Horas proformadas del mes: es una entrada. Sólo se comparan con las reales.'][i];
  if(g === 'costo') return i === 4 ? 'Costo total = RyM + MOV + Dep (si está CON DEP) + Alq (si está CON ALQ).'
    : i === 2 ? 'Dep = tarifa de depreciación × horas reales (por días en los equipos prorrateados).'
    : i === 3 ? 'Alq = tarifa de alquiler × horas reales: es tarifa de venta, no costo real.'
    : cp + ' = lo cargado en SAP en el mes: es una entrada.';
  if(g === 'venta') return i === 4 ? 'Venta total = suma de sus componentes, con el mismo CON / SIN.'
    : 'Venta ' + cp + ' = tarifa de venta × horas reales.';
  if(g === 'desv') return 'Desviación ' + cp + ' = venta ' + cp + ' − costo ' + cp + '. Se calcula: cambia la venta o el costo.';
  if(g === 'treal') return 'Tarifa real ' + cp + ' = costo ' + cp + ' ÷ horas reales.';
  if(g === 'tventa') return 'Tarifa de venta ' + cp + ' = venta ' + cp + ' ÷ horas reales.';
  if(g === 'tacum') return 'Tarifa acumulada = costo acumulado ÷ horas acumuladas. Se calcula.';
  if(g === 'cacum') return 'Costo acumulado = libro mayor del año + el mes. Se mueve solo cuando cambia el mes.';
  if(g === 'vacum') return 'Venta acumulada = la del año + la del mes. Se mueve sola cuando cambia el mes.';
  if(g === 'dacum') return 'Desviación acumulada = venta acumulada − costo acumulado. Se calcula.';
  return '';
}
function simMueve(campo, grupo){
  var L = campo.charAt(0), X = campo.slice(1);
  var t = campo === 'hr'
      ? 'Con las horas se mueven la venta interna (tarifa de venta × horas), la depreciación y el alquiler (tarifa × horas; los que van por días no), las tarifas reales (costo ÷ horas), la desviación y los acumulados. RyM y MOV no: son lo gastado.'
    : campo === 'hp' ? 'Sólo cambia la comparación de horas reales contra la proforma (tarjeta HORAS MÁQUINA).'
    : L === 'c' ? 'Cambian el costo total, la tarifa real (costo ÷ horas), la desviación y el costo acumulado. La venta no.'
    : L === 'v' ? 'Es cambiar la tarifa de venta con las mismas horas. Cambian la tarifa de venta, la desviación y la venta acumulada.'
    : L === 'r' ? 'Fija la tarifa real: el costo pasa a ser tarifa × horas reales. Cambian el costo, la desviación y el acumulado.'
    : 'Fija la tarifa de venta: la venta pasa a ser tarifa × horas reales. Cambian la venta, la desviación y el acumulado.';
  if(X === 'T') t += ' El total se reparte entre sus componentes en la misma proporción que tienen hoy.';
  if(grupo > 1) t += ' Se reparte entre los ' + grupo + ' equipos de la fila en proporción a lo que cada uno tiene hoy (parejo si todos están en cero).';
  return t;
}

/* ---------- los equipos de una fila ---------- */
function simIdsDe(st, n){
  var ids = [], vistos = {};
  var baja = function(lista){
    lista.forEach(function(x){
      if(x.ot) return;
      if(x.id){ if(!vistos[x.id]){ vistos[x.id] = 1; ids.push(x.id); } return; }
      baja(x.hijos || []);
    });
  };
  if(n.esTot) baja(st.vista || st.arbol); else if(n.id && !n.ot) ids.push(n.id); else baja(n.hijos || []);
  return ids;
}
function simCopia(o){
  var x = {}, k;
  for(k in o) x[k] = o[k];
  x.c = o.c.slice(); x.v = o.v.slice();
  x.A = { c: o.A.c.slice(), h: o.A.h, v: o.A.v.slice() };
  return x;
}
/* lo real de una fila: la suma de sus equipos sin simular */
function simRealDe(st, n){
  var cache = st.simCacheR || (st.simCacheR = {});
  if(n.k && cache[n.k]) return cache[n.k];
  var ids = simIdsDe(st, n), os = [];
  ids.forEach(function(id){ if(st.simEqReal && st.simEqReal[id]) os.push(st.simEqReal[id]); });
  var r = !os.length ? null : (n.id && !n.ot ? os[0] : hxSuma(os));
  if(n.k) cache[n.k] = r;
  return r;
}

/* ---------- aplicar un cambio ---------- */
/* reparte "objetivo" entre los equipos en proporción a f(o) */
function simRepartir(es, get, objetivo){
  var actual = 0;
  es.forEach(function(e){ actual += get(e.o); });
  return es.map(function(e){ return Math.abs(actual) > 1e-9 ? get(e.o) * objetivo / actual : objetivo / es.length; });
}
function simHoras(es, objetivo, sp){
  var dep = sp.depPorDias || [], alq = sp.alqPorDias || [];
  var nuevas = simRepartir(es, function(o){ return o.hr || 0; }, objetivo);
  es.forEach(function(e, j){
    var o = e.o, h0 = o.hr || 0, h1 = nuevas[j], i, d;
    /* con horas se puede escalar lo que es tarifa × horas; sin horas no hay tarifa */
    if(h0 > 1e-9){
      var f = h1 / h0;
      for(i = 0; i < 4; i++){ d = o.v[i] * (f - 1); o.v[i] += d; o.A.v[i] += d; }
      if(o.np && dep.indexOf(e.id) < 0){ d = o.c[2] * (f - 1); o.c[2] += d; o.A.c[2] += d; }
      if(o.nq && alq.indexOf(e.id) < 0){ d = o.c[3] * (f - 1); o.c[3] += d; o.A.c[3] += d; }
    }
    o.A.h += h1 - h0; o.hr = h1;
  });
}
function simAplicar(st, c, eqs, sp){
  var es = [];
  for(var j = 0; j < c.ids.length; j++){ if(!eqs[c.ids[j]]) return false; es.push(eqs[c.ids[j]]); }
  if(!es.length) return false;
  var L = c.campo.charAt(0), X = c.campo.slice(1), val = c.val;
  if(c.campo === 'hr'){ simHoras(es, val, sp); return true; }
  if(c.campo === 'hp'){
    var hp = simRepartir(es, function(o){ return o.hrProf || 0; }, val);
    es.forEach(function(e, k){ e.o.hrProf = hp[k]; });
    return true;
  }
  var comps = X === 'T' ? (c.comps || [0, 1]) : [parseInt(X, 10)];
  if(L === 'r' || L === 't'){
    var h = 0;
    es.forEach(function(e){ h += e.o.hr || 0; });
    val = val * h;
    L = L === 'r' ? 'c' : 'v';
  }
  var get = function(o){ var x = 0; comps.forEach(function(i){ x += o[L][i]; }); return x; };
  var actual = 0;
  es.forEach(function(e){ actual += get(e.o); });
  es.forEach(function(e){
    comps.forEach(function(i, q){
      var x0 = e.o[L][i];
      var x1 = Math.abs(actual) > 1e-9 ? x0 * val / actual : (q === 0 ? val / es.length : 0);
      e.o[L][i] = x1; e.o.A[L][i] += x1 - x0;
    });
  });
  return true;
}
/* el árbol simulado: se arma como siempre y encima se aplican los cambios */
function simTrasArbol(s){
  var st = HX[s];
  st.simEqReal = null; st.simCacheR = null; st.simPausa = {};
  if(!simActivo(s)) return;
  var eqs = {};
  st.todos.forEach(function(e){ eqs[e.id] = e; });
  st.simEqReal = {};
  st.todos.forEach(function(e){ st.simEqReal[e.id] = simCopia(e.o); });
  var sp = hxSep(st);
  simLista(s).forEach(function(c){ if(!simAplicar(st, c, eqs, sp)) st.simPausa[c.id] = 1; });
  st.arbol.forEach(function(p){
    p.hijos.forEach(function(f){
      f.hijos.forEach(function(m){ m.o = hxSuma(m.hijos.map(function(e){ return e.o; })); });
      f.o = hxSuma(f.hijos.map(function(m){ return m.o; }));
    });
    p.o = hxSuma(p.hijos.map(function(f){ return f.o; }));
  });
  st.total = hxSuma(st.arbol.map(function(p){ return p.o; }));
}
/* los cambios hechos sobre una fila: { col: cambio } */
function simCambiosDe(st, n){
  var m = {};
  if(!n.k) return m;
  simLista(st.s).forEach(function(c){ if(c.k === n.k && !(st.simPausa || {})[c.id]) m[c.col] = c; });
  return m;
}

/* ---------- las celdas (la de hojas.js, más lo simulado) ---------- */
function hxCeldas(st, n, o0){
  var r = hxEsT(st.s) && simActivo(st.s) && !n.ot ? simRealDe(st, n) : null;
  var cambios = r ? simCambiosDe(st, n) : {};
  return st.cols.map(function(g){
    var vis = hxVisibles(st, g);
    /* una orden de trabajo solo tiene costo: lo demas es del equipo */
    if((n.ot && g.id !== 'costo') || hxSinTarifa(n, g.id)){
      return vis.map(function(c, i){ return '<td class="g-' + g.id + (i ? '' : ' ini') + '"></td>'; }).join('');
    }
    return vis.map(function(c, i){
      var col = g.id + '-' + g.cols.indexOf(c), h = hxCelda(c, n.o), m = hxMarca(st, n, col), h0 = h;
      /* el semaforo mira la cifra como se ve (redondeada), igual que los filtros */
      if(c.sem !== undefined){
        var vs = hxValorFiltro(c, n.o);
        if(vs !== null) h = '<span class="sem ' + (vs >= c.sem ? 'v' : 'r') + '">' + h + '</span>';
      }
      /* horas reales contra la proforma: el numero en verde o rojo, como las desviaciones */
      var sh = hxSemHoras(st, c, n.o);
      if(sh) h = '<span class="' + sh + '">' + h + '</span>';
      var sel = st.sel && n.k && st.sel.k === n.k && st.sel.col === col;
      var bajo = o0 ? '<span class="xo" title="Sin filtros">' + hxCelda(c, o0).replace(/<[^>]+>/g, '') + '</span>' : '';
      var cl = '', ms = '';
      if(r){
        var hr = hxCelda(c, r);
        /* se movio: la real va debajo, chica */
        if(hr !== h0){ cl += ' simD'; bajo = '<span class="xo xs" title="Cifra real, sin la simulación">' + hr.replace(/<[^>]+>/g, '') + '</span>'; }
        var ch = cambios[col];
        if(ch){
          cl += ' simC';
          ms = '<button type="button" class="xlS" data-sc="' + ch.id + '" title="Cifra cambiada: ' + esc(ch.realTxt + ' → ' + ch.valTxt)
             + (ch.nota ? ' · ' + ch.nota : '') + '" aria-label="Ver el cambio de esta celda"></button>';
        }
      }
      return '<td class="g-' + g.id + (i ? '' : ' ini') + (m ? ' cn' : '') + (sel ? ' sel' : '') + cl + '">'
        + (c.k ? '<b>' + h + '</b>' : h) + bajo + m + ms + '</td>';
    }).join('');
  }).join('');
}

/* ---------- leer lo que se escribe ---------- */
/* 60,000 · 1.2k · 2mm · +10% · -5% · +500 · -500 · x1.2 ; sobre la cifra de ahora */
function simLeer(t, ahora){
  var x = String(t || '').trim().replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/,/g, '').replace(/^US\$/i, '');
  if(!x) return NaN;
  var m;
  if((m = /^([+-])(\d+(?:\.\d+)?)%$/.exec(x))) return ahora * (1 + (m[1] === '-' ? -1 : 1) * parseFloat(m[2]) / 100);
  if((m = /^[x*×](\d+(?:\.\d+)?)$/i.exec(x))) return ahora * parseFloat(m[1]);
  var mult = function(s){ return /mm$/i.test(s) ? 1e6 : /k$/i.test(s) ? 1e3 : 1; };
  if((m = /^([+-])(\d+(?:\.\d+)?)(k|mm)?$/i.exec(x))) return ahora + (m[1] === '-' ? -1 : 1) * parseFloat(m[2]) * mult(x);
  if((m = /^(\d+(?:\.\d+)?)(k|mm)?$/i.exec(x))) return parseFloat(m[1]) * mult(x);
  return NaN;
}
function simTxt(c, v){
  var dec = c && c.f === 'n1' ? 1 : 0;
  if(v === null || v === undefined || !isFinite(v)) return '—';
  return dec ? v.toLocaleString('es-PE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : fmt(v);
}

/* ---------- el editor ---------- */
function simFila(st, n){
  return n.esTot ? 'TOTAL DE LA TABLA' : hxNivelesDe(st)[n.lv] + ' ' + n.et
    + (n.sede && !n.esSede ? ' (' + n.sede + (n.fl && !n.esFl && !n.id ? ' · ' + HX_FL_NOM[n.fl] : '') + ')' : '');
}
/* por que no se puede cambiar esta cifra (o nada si se puede) */
function simNoSePuede(st, n, col){
  var campo = simCampo(col);
  if(n.ot) return 'Las fases y órdenes sólo tienen costo por orden: cambia la cifra en el equipo o en un grupo.';
  if(hxSinTarifa(n, String(col).split('-')[0])) return 'La fila Total no lleva tarifas: cambia la de un proyecto, una flota, una familia o un modelo.';
  if(!campo) return 'Esta cifra se calcula a partir de otras: cambia las horas, el costo, la venta o una tarifa y se mueve sola.';
  var X = campo.slice(1), o = n.o || {};
  if(X === '2' && !o.np) return 'Esta fila no tiene equipos propios: no lleva depreciación.';
  if(X === '3' && !o.nq) return 'Esta fila no tiene equipos alquilados: no lleva alquiler.';
  if((campo.charAt(0) === 'r' || campo.charAt(0) === 't') && !(o.hr > 0)) return 'Sin horas reales no hay tarifa: cambia primero las horas.';
  if(!simIdsDe(st, n).length) return 'Esta fila no tiene equipos.';
  return '';
}
/* prueba un cambio sobre copias de los equipos de la fila: como queda la fila */
function simProbar(st, n, campo, val){
  var ids = simIdsDe(st, n), eqs = {}, es = [];
  var buscar = {};
  st.todos.forEach(function(e){ buscar[e.id] = e; });
  ids.forEach(function(id){ if(buscar[id]){ var x = { id: id, o: simCopia(buscar[id].o) }; eqs[id] = x; es.push(x); } });
  var antes = hxSuma(es.map(function(e){ return simCopia(e.o); }));
  simAplicar(st, { campo: campo, val: val, ids: ids, comps: simComps(st) }, eqs, hxSep(st));
  return { antes: antes, despues: hxSuma(es.map(function(e){ return e.o; })) };
}
function simComps(st){ return [0, 1].concat(st.terD ? [2] : []).concat(st.terA ? [3] : []); }
function simAbrir(s, n, col){
  var st = HX[s], cc = hxColDe(st, col);
  if(!n || !cc) return;
  SIM_MODO[s] = true;
  var previo = simCambiosDe(st, n)[col] || null;
  var no = simNoSePuede(st, n, col);
  var ahora = cc.c.v(n.o), r = simActivo(s) ? simRealDe(st, n) : null, real = r ? cc.c.v(r) : ahora;
  simAbierto = { s: s, k: n.k, kn: n.kn || n.k, col: col, campo: simCampo(col), ahora: ahora, real: real,
                 previo: previo, n: n, c: cc.c, ids: no ? [] : simIdsDe(st, n) };
  txt('sim-ed-fila', simFila(st, n) + ' · ' + hxTituloCol(st, col));
  txt('sim-ed-real', simTxt(cc.c, real));
  txt('sim-ed-ahora', simTxt(cc.c, ahora));
  txt('sim-ed-formula', simFormula(col));
  var inp = $('sim-ed-val'), ed = $('sim-editor');
  ed.classList.toggle('soloLee', !!no);
  txt('sim-ed-mueve', no || simMueve(simAbierto.campo, simAbierto.ids.length));
  inp.value = previo ? simTxt(cc.c, previo.val).replace(/,/g, '') : '';
  $('sim-ed-nota').value = previo ? previo.nota || '' : '';
  $('sim-ed-quitar').hidden = !previo;
  txt('sim-ed-meta', '');
  simPrevia();
  ed.hidden = false;
  simBarra(s);
  if(!no) setTimeout(function(){ try { inp.focus(); inp.select(); } catch(e){} }, 0);
}
function simCerrar(){ $('sim-editor').hidden = true; simAbierto = null; }
/* lo que pasaria con la fila si se aplica */
function simPrevia(){
  var A = simAbierto, el = $('sim-ed-prev');
  if(!A || !el) return;
  var st = HX[A.s], v = simLeer($('sim-ed-val').value, A.ahora);
  if(!A.campo || !A.ids.length || !isFinite(v)){
    el.innerHTML = A.campo && A.ids.length ? '<span class="nt">Escribe el valor nuevo: 60000 · +10% · −5% · +500 · x1.2</span>' : '';
    return;
  }
  var p = simProbar(st, A.n, A.campo, v), a = p.antes, d = p.despues;
  var tc = function(o){ return hxTcT(st, o); }, tv = function(o){ return hxTvT(st, o); };
  var fila = function(nom, x, y, dec, dif){
    var f = function(z){ return z === null || !isFinite(z) ? '—' : dec ? z.toFixed(1) : fmt(z); };
    var cambio = Math.abs((y || 0) - (x || 0)) > (dec ? 0.05 : 0.5);
    return '<tr' + (cambio ? ' class="mv"' : '') + '><td>' + nom + '</td><td>' + f(x) + '</td><td>' + f(y) + '</td><td>'
      + (cambio ? ((y - x) > 0 ? '+' : '−') + (dec ? Math.abs(y - x).toFixed(1) : fmt(Math.abs(y - x))) : '') + '</td></tr>';
  };
  var t = function(x, h){ return h ? x / h : null; };
  el.innerHTML = '<table><thead><tr><th>LA FILA</th><th>AHORA</th><th>QUEDARÍA</th><th>±</th></tr></thead><tbody>'
    + fila('Horas reales', a.hr, d.hr, 1)
    + fila('Costo total', tc(a), tc(d))
    + fila('Venta total', tv(a), tv(d))
    + fila('Venta − costo', tv(a) - tc(a), tv(d) - tc(d))
    + fila('Tarifa real US$/h', t(tc(a), a.hr), t(tc(d), d.hr), 1)
    + fila('Tarifa de venta US$/h', t(tv(a), a.hr), t(tv(d), d.hr), 1)
    + '</tbody></table>';
}
function simAplicarEditor(){
  var A = simAbierto;
  if(!A || !A.campo || !A.ids.length) return;
  var v = simLeer($('sim-ed-val').value, A.ahora);
  if(!isFinite(v)){ txt('sim-ed-meta', 'No entiendo ese valor. Ejemplos: 60000 · +10% · −5% · +500 · x1.2'); return; }
  if(v < 0 && (A.campo === 'hr' || A.campo === 'hp')){ txt('sim-ed-meta', 'Las horas no pueden ser negativas.'); return; }
  var st = HX[A.s], lista = SIM[A.s] || (SIM[A.s] = []);
  var reg = { id: A.previo ? A.previo.id : 's' + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36),
              mes: hxMesDe(st), k: A.k, kn: A.kn, col: A.col, campo: A.campo, comps: simComps(st),
              ids: A.ids, val: v, real: A.real, fila: simFila(st, A.n), colTxt: hxTituloCol(st, A.col),
              realTxt: simTxt(A.c, A.real), valTxt: simTxt(A.c, v), nota: $('sim-ed-nota').value.trim().slice(0, 400),
              flota: hxFlota(st), ts: new Date().toISOString() };
  var i = A.previo ? lista.indexOf(A.previo) : -1;
  if(i >= 0) lista[i] = reg; else lista.push(reg);
  SIM_VER[A.s] = true;
  simGuardar(A.s); simCerrar(); simRehacer(A.s);
}
function simQuitar(s, id){
  SIM[s] = (SIM[s] || []).filter(function(c){ return c.id !== id; });
  simGuardar(s); simRehacer(s);
}
function simTodoReal(s){
  var mes = hxMesDe(HX[s]);
  SIM[s] = (SIM[s] || []).filter(function(c){ return c.mes !== mes; });
  simGuardar(s); simCerrar(); simRehacer(s);
}
function simRehacer(s){
  if(!HX[s] || !HX[s].arbol) return;
  hxArbol(s); hxBotones(s); hxTabla(s);
}

/* ---------- ir a una celda cambiada ---------- */
function simIr(s, id){
  var st = HX[s], c = null;
  (SIM[s] || []).forEach(function(x){ if(x.id === id) c = x; });
  if(!c) return;
  if(c.mes !== hxMesDe(st)) hxPonerMes(s, c.mes);
  hxArbolVista(st);
  var camino = null;
  var baja = function(lista, arriba){
    for(var i = 0; i < lista.length && !camino; i++){
      var n = lista[i];
      if(n.k === c.k || (n.kn && n.kn === c.kn && !camino)) camino = { n: n, arriba: arriba };
      else if(!n.ot) baja(n.hijos || [], arriba.concat([n.k]));
    }
  };
  if(/^tot\|/.test(c.k)) camino = { n: hxNodoTotal(st), arriba: [] };
  else baja(st.vista || st.arbol, []);
  if(!camino){ simAviso(s, 'Esa fila no está a la vista con la selección o los filtros de ahora.'); return; }
  camino.arriba.forEach(function(k){ st.ab[k] = 1; });
  st.sel = { k: camino.n.k, col: c.col }; st.nivel = -1;
  hxBotones(s); hxTabla(s);
  var tr = document.querySelector('#hx-tabla-' + s + ' tr[data-k="' + String(camino.n.k).replace(/["\\]/g, '\\$&') + '"]');
  if(tr){ tr.scrollIntoView({ block: 'center' }); try { tr.focus({ preventScroll: true }); } catch(e){} }
}
function simAviso(s, t){
  var a = $('sim-aviso-' + s);
  if(a){ a.textContent = t; a.hidden = false; clearTimeout(a._t); a._t = setTimeout(function(){ a.hidden = true; }, 4500); }
}

/* ---------- la barra de arriba de la tabla ---------- */
function simBarra(s){
  var st = HX[s], tabla = $('hx-tabla-' + s);
  if(!tabla || !hxEsT(s)) return;
  var bar = $('sim-barra-' + s);
  if(!bar){
    bar = document.createElement('div');
    bar.className = 'xlFiltros xlSimBar'; bar.id = 'sim-barra-' + s;
    /* encima de la tabla y del boton ⤢ (tiene que quedar pegado a la tabla) */
    var ref = tabla.parentElement, esq = ref.previousElementSibling;
    if(esq && esq.classList.contains('xlEsq')) ref = esq;
    ref.parentElement.insertBefore(bar, ref);
    bar.addEventListener('click', function(ev){
      var b = ev.target.closest ? ev.target.closest('[data-sa]') : null;
      if(!b) return;
      var a = b.getAttribute('data-sa'), id = b.getAttribute('data-id');
      if(a === 'ir') simIr(s, id);
      else if(a === 'x') simQuitar(s, id);
      else if(a === 'ed'){ simIr(s, id); var n = st.sel ? hxBuscarNodo(st, st.sel.k) : null; if(n) simAbrir(s, n, st.sel.col); }
      else if(a === 'real'){ SIM_VER[s] = !SIM_VER[s]; simRehacer(s); }
      else if(a === 'todo') simTodoReal(s);
      else if(a === 'salir'){ SIM_MODO[s] = false; simCerrar(); simBarra(s); simBoton(s); }
    });
  }
  var lista = simLista(s), activo = simActivo(s);
  if(!SIM_MODO[s] && !lista.length){ bar.hidden = true; bar.innerHTML = ''; simBoton(s); return; }
  bar.hidden = false;
  var pausa = st.simPausa || {};
  var cab = lista.length
    ? '<span class="t">✎ ' + (activo ? 'SIMULACIÓN' : 'VIENDO LO REAL') + ' · ' + lista.length + (lista.length === 1 ? ' CAMBIO' : ' CAMBIOS') + '</span>'
      + '<button type="button" class="todos" data-sa="real">' + (SIM_VER[s] ? 'VER LO REAL' : 'VER LO SIMULADO') + '</button>'
      + '<button type="button" class="todos" data-sa="todo" title="Borra todos los cambios de este mes">VOLVER TODO A LO REAL</button>'
    : '<span class="t">✎ SIMULACIÓN</span>';
  bar.innerHTML = cab + '<button type="button" class="todos" data-sa="salir" title="Deja de abrir el editor con un clic (los cambios siguen)">✕ SALIR</button>'
    + '<span class="nt">' + (lista.length
        ? (activo ? 'Las cifras con velo azul se movieron por la simulación (debajo, en chico, la real); la esquina azul marca la que cambiaste. Las tarjetas también suman lo simulado.'
                  : 'Los cambios siguen guardados, pero la tabla muestra las cifras reales.')
        : 'Haz clic en una cifra de horas, costo, venta o tarifa para cambiarla y ver cómo se mueve lo demás.')
      + ' Nada se guarda en el Excel ni en la base: sólo en este navegador.</span>'
    + (lista.length ? '<ol class="simL">' + lista.map(function(c){
        var d = c.val - c.real, pc = Math.abs(c.real) > 1e-9 ? d / Math.abs(c.real) * 100 : null;
        return '<li' + (pausa[c.id] ? ' class="pausa"' : '') + '><span class="q">' + esc(c.fila) + ' · <b>' + esc(c.colTxt) + '</b></span> '
          + '<span class="v">' + esc(c.realTxt) + ' → <b>' + esc(c.valTxt) + '</b>'
          + (pc !== null && isFinite(pc) ? ' (' + (pc >= 0 ? '+' : '−') + Math.abs(pc).toFixed(1) + '%)' : '') + '</span>'
          + (c.nota ? ' <span class="nota">«' + esc(c.nota) + '»</span>' : '')
          + (pausa[c.id] ? ' <span class="nota">en pausa: sus equipos no están con el proyecto o la flota de ahora</span>' : '')
          + ' <button type="button" data-sa="ir" data-id="' + c.id + '" title="Ir a la celda">IR</button>'
          + '<button type="button" data-sa="ed" data-id="' + c.id + '" title="Cambiar el valor">EDITAR</button>'
          + '<button type="button" data-sa="x" data-id="' + c.id + '" title="Quitar este cambio (vuelve a lo real)" aria-label="Quitar este cambio">✕</button></li>';
      }).join('') + '</ol>' : '')
    + '<span class="simAviso" id="sim-aviso-' + s + '" hidden></span>';
  simBoton(s);
}
/* el boton ✎ SIMULAR de la linea del titulo */
function simBoton(s){
  var b = document.querySelector('#' + hxSeccion(s) + ' .xlSimBtn');
  if(!b) return;
  var n = simLista(s).length, on = SIM_MODO[s] || n > 0;
  b.setAttribute('aria-pressed', on);
  b.textContent = '✎ SIMULAR' + (n ? ' · ' + n : '');
}

/* ---------- envolturas ---------- */
var simBase = { arbol: hxArbol, tabla: hxTabla, cifras: hxCifras, origen: hxBarraOrigen, ctx: hxContexto, ctxTxt: hxContextoTxt };
hxArbol = function(s){ simBase.arbol(s); if(hxEsT(s)) simTrasArbol(s); };
hxTabla = function(s){
  var st = HX[s];
  if(st) st.simCacheR = null;
  simBase.tabla(s);
  if(!hxEsT(s)) return;
  simBarra(s);
  /* la primera columna: ✎ en la fila que cambiaste y un punto en las que lo contienen */
  if(!simActivo(s)) return;
  var lista = simLista(s).filter(function(c){ return !(st.simPausa || {})[c.id]; });
  if(!lista.length) return;
  Array.prototype.forEach.call(document.querySelectorAll('#hx-tabla-' + s + ' tbody tr[data-k], #hx-tabla-' + s + ' tfoot tr[data-k]'), function(tr){
    var k = tr.getAttribute('data-k'), td = tr.firstElementChild;
    if(!td) return;
    var propio = lista.some(function(c){ return c.k === k; });
    var n = propio ? null : hxBuscarNodo(st, k);
    var dentro = !propio && n && !n.ot && lista.some(function(c){
      var ids = simIdsDe(st, n);
      return c.ids.every(function(id){ return ids.indexOf(id) >= 0; });
    });
    if(propio || dentro) td.insertAdjacentHTML('afterbegin', '<i class="simPt' + (propio ? ' yo' : '') + '" title="'
      + (propio ? 'Aquí cambiaste una cifra' : 'Dentro de esta fila hay una cifra cambiada') + '">' + (propio ? '✎' : '•') + '</i>');
  });
};
hxCifras = function(s){
  simBase.cifras(s);
  var cif = $('hx-cifras-' + s);
  if(cif) cif.classList.toggle('simOn', simActivo(s));
};
/* la barra de origen: lo simulado y el boton para cambiar la cifra */
hxBarraOrigen = function(s){
  simBase.origen(s);
  var st = HX[s], el = $('hx-origen-' + s);
  if(!hxEsT(s) || !el || !st.sel) return;
  var n = hxBuscarNodo(st, st.sel.k), cc = hxColDe(st, st.sel.col);
  if(!n || !cc) return;
  var com = el.querySelector('[data-com]');
  if(com) com.insertAdjacentHTML('afterend', '<button class="fbt" type="button" data-simc="1">✎ SIMULAR ESTA CIFRA</button>');
  if(simActivo(s) && !n.ot){
    var r = simRealDe(st, n), ch = simCambiosDe(st, n)[st.sel.col];
    var a = r ? cc.c.v(r) : null, b = cc.c.v(n.o);
    var t = el.querySelector('.txt');
    if(t && r && hxCelda(cc.c, r) !== hxCelda(cc.c, n.o))
      t.insertAdjacentHTML('beforeend', '<br><span class="simO">SIMULADO · real ' + esc(simTxt(cc.c, a)) + ' → ahora ' + esc(simTxt(cc.c, b))
        + (ch ? ' · la cambiaste tú' + (ch.nota ? ': «' + esc(ch.nota) + '»' : '') : ' · se movió por los cambios de la simulación') + '</span>');
  }
};
/* un comentario hecho con la simulación puesta lo dice */
hxContexto = function(st){
  var x = simBase.ctx(st);
  if(st && hxEsT(st.s) && simActivo(st.s)) x.sim = simLista(st.s).length;
  return x;
};
hxContextoTxt = function(x){
  var t = simBase.ctxTxt(x);
  return x && x.sim ? t + ' · CON SIMULACIÓN (' + x.sim + (x.sim === 1 ? ' CAMBIO' : ' CAMBIOS') + ')' : t;
};

/* ---------- arranque ---------- */
(function simIniciar(){
  var ed = $('sim-editor');
  if(!ed) return;
  esc_('sim-ed-val', 'input', simPrevia);
  esc_('sim-ed-val', 'keydown', function(ev){ if(ev.key === 'Enter'){ ev.preventDefault(); simAplicarEditor(); } });
  esc_('sim-ed-aplicar', 'click', simAplicarEditor);
  esc_('sim-ed-cerrar', 'click', simCerrar);
  esc_('sim-ed-quitar', 'click', function(){ if(simAbierto && simAbierto.previo){ var A = simAbierto; simCerrar(); simQuitar(A.s, A.previo.id); } });
  document.addEventListener('keydown', function(ev){ if(ev.key === 'Escape' && simAbierto) simCerrar(); });
  ['T', 'U'].forEach(function(s){
    var tabla = $('hx-tabla-' + s), sec = $(hxSeccion(s));
    if(!tabla || !sec || !HX[s]) return;
    simCargar(s);
    /* ✎ SIMULAR, al lado de OCULTAR TARJETAS */
    var tb = sec.querySelector('.xlTarjBtn');
    if(tb && !sec.querySelector('.xlSimBtn')){
      tb.insertAdjacentHTML('afterend', '<button type="button" class="xlSimBtn" aria-pressed="false" title="Cambiar horas, costos, ventas o tarifas y ver cómo se mueve todo (no toca el Excel)">✎ SIMULAR</button>');
      sec.querySelector('.xlSimBtn').addEventListener('click', function(){
        SIM_MODO[s] = !SIM_MODO[s];
        if(!SIM_MODO[s]) simCerrar();
        simBarra(s);
      });
    }
    /* en modo simular, un clic en una cifra abre su editor (despues de que la tabla la elija) */
    tabla.addEventListener('click', function(ev){
      if(!SIM_MODO[s]) return;
      var td = ev.target.closest ? ev.target.closest('tbody td, tfoot td') : null;
      if(!td || td.cellIndex < 1 || (ev.target.closest && ev.target.closest('[data-cn], .xlS'))) return;
      var tr = td.parentElement, k = tr && tr.getAttribute('data-k'), ci = td.cellIndex;
      setTimeout(function(){
        var st = HX[s];
        if(!st.sel || st.sel.k !== k) return;
        var n = hxBuscarNodo(st, k);
        if(n) simAbrir(s, n, st.vis[ci - 1]);
      }, 0);
    }, true);
    /* doble clic: siempre. El primer clic elige la celda y la tabla se
       vuelve a dibujar, asi que el navegador no ve un dblclick (los dos
       clics caen en celdas distintas): se cuentan aqui, por fila y columna */
    var ultimo = null;
    tabla.addEventListener('click', function(ev){
      var td = ev.target.closest ? ev.target.closest('tbody td, tfoot td') : null;
      if(!td || td.cellIndex < 1 || (ev.target.closest && ev.target.closest('[data-cn], .xlS, [data-tb], [data-ir]'))){ ultimo = null; return; }
      var tr = td.parentElement, k = tr && tr.getAttribute('data-k'), st = HX[s], col = st.vis[td.cellIndex - 1], t = Date.now();
      if(ultimo && ultimo.k === k && ultimo.col === col && t - ultimo.t < 450){
        ultimo = null;
        setTimeout(function(){ var n = k ? hxBuscarNodo(HX[s], k) : null; if(n && col) simAbrir(s, n, col); }, 0);
        return;
      }
      ultimo = { k: k, col: col, t: t };
    }, true);
    /* la esquina azul abre el editor de ese cambio */
    tabla.addEventListener('click', function(ev){
      var b = ev.target.closest ? ev.target.closest('.xlS') : null;
      if(!b) return;
      ev.stopPropagation();
      var td = b.closest('td'), tr = td.parentElement, st = HX[s], n = hxBuscarNodo(st, tr.getAttribute('data-k'));
      if(n) simAbrir(s, n, st.vis[td.cellIndex - 1]);
    }, true);
    esc_('hx-origen-' + s, 'click', function(ev){
      var b = ev.target.closest ? ev.target.closest('[data-simc]') : null, st = HX[s];
      if(!b || !st.sel) return;
      var n = hxBuscarNodo(st, st.sel.k);
      if(n) simAbrir(s, n, st.sel.col);
    });
    if(HX[s].arbol && simLista(s).length) simRehacer(s); else simBarra(s);
  });
})();
