/* ══════════════════════════════════════════════════════════════════
   2 · datos derivados — todo sale de DATA, el libro mayor de costos
   de equipos (00 TARIFAS_LM_2025_2026, hoja Data ABR2025_26).

   El importe es la columna V, "Importe valorado en ML3", en dolares.
   Las horas son horas maquina contadas UNA VEZ por equipo y mes: la
   columna AS las repite en cada asiento y sumarla las multiplica por 6.5.

   FORMA DEL DATO. El libro entero cabe, sin perder nada, en una tabla de
   hechos con seis dimensiones —equipo, proyecto, RO, centro de coste,
   cuenta contable, tipo de gasto— mas el mes. Viaja en arreglos paralelos
   (DATA.F) y se recorre completa en cada cambio de seleccion.

   Eso hace que CUALQUIER dimension sea un filtro exacto, no solo las que
   alguien previo: por eso se puede reproducir el recorte de una tabla
   dinamica del Excel, incluido el que deja fuera las lineas sin centro de
   coste y que en agosto 2026 esconde US$ 8,478,845.

   UNA SOLA SELECCION para las nueve pestanas: cambiar un filtro en
   cualquiera vale en todas.
   ══════════════════════════════════════════════════════════════════ */
var META = DATA.meta, MESES = DATA.meses;
var PROYS = DATA.proys || [], ROS = DATA.ros || [], CECOS = DATA.cecos || [];
var CUENTAS = DATA.cuentas || [], GASTOSD = DATA.gastos || [];
var TODOS = DATA.equipos || [];
var F = DATA.F, HH = DATA.H;
var OTS = DATA.ots || [], SD = DATA.sysdesc || {};
var NM = MESES.length;
var CEROS = [];
for(var _i = 0; _i < NM; _i++) CEROS.push(0);

/* ---------- la seleccion, compartida por todas las hojas ---------- */
var rangoA = 0, rangoB = NM - 1;
var proyFiltro = 'TODOS';
var roSel = ROS.slice();
var cecoSel = CECOS.slice();
var cuentaSel = CUENTAS.slice();
var gastoSel = GASTOSD.slice();
var famFiltro = 'TODAS', modFiltro = 'TODOS', provFiltro = 'TODOS';
var marcaFiltro = 'TODAS', clasifFiltro = 'TODAS', tipoFiltro = 'TODOS';
var eqFiltro = 'TODOS';            /* un equipo concreto */

function proyActivos(){
  return proyFiltro === 'TODOS' ? PROYS : [proyFiltro];
}
function todosLosRO(){ return roSel.length === ROS.length; }
function todosLosCeco(){ return cecoSel.length === CECOS.length; }
function todasLasCuentas(){ return cuentaSel.length === CUENTAS.length; }
function todosLosGastos(){ return gastoSel.length === GASTOSD.length; }
function hayFiltroEq(){
  return famFiltro !== 'TODAS' || modFiltro !== 'TODOS' || provFiltro !== 'TODOS'
      || marcaFiltro !== 'TODAS' || clasifFiltro !== 'TODAS' || tipoFiltro !== 'TODOS'
      || eqFiltro !== 'TODOS';
}
function hayFiltroFino(){
  return !todosLosCeco() || !todasLasCuentas() || !todosLosGastos()
      || marcaFiltro !== 'TODAS' || clasifFiltro !== 'TODAS' || tipoFiltro !== 'TODOS';
}
function pasaEquipo(e){
  return (eqFiltro === 'TODOS' || e.id === eqFiltro)
      && (famFiltro === 'TODAS' || e.fam === famFiltro)
      && (modFiltro === 'TODOS' || e.mod === modFiltro)
      && (provFiltro === 'TODOS' || e.prov === provFiltro)
      && (marcaFiltro === 'TODAS' || e.marca === marcaFiltro)
      && (clasifFiltro === 'TODAS' || e.clasif === clasifFiltro)
      && (tipoFiltro === 'TODOS' || e.tipo === tipoFiltro);
}
function sumaTodo(arr){
  var s = 0;
  for(var i = 0; i < arr.length; i++) s += arr[i] || 0;
  return s;
}
function sumaRango(arr){
  if(!arr) return 0;
  var s = 0;
  for(var i = rangoA; i <= rangoB && i < arr.length; i++) s += arr[i] || 0;
  return s;
}
/* de una lista de nombres elegidos a un vector de si/no por indice */
function mascara(vocab, elegidos){
  var m = [], i;
  for(i = 0; i < vocab.length; i++) m.push(0);
  for(i = 0; i < elegidos.length; i++){
    var k = vocab.indexOf(elegidos[i]);
    if(k >= 0) m[k] = 1;
  }
  return m;
}

/* ---------- lo que se rehace con cada cambio de seleccion ---------- */
var SERIE, SERIEHM, FASES, FASESM, EQ, byId;
var FAM, TIPOS, CATG, ART, PROVL, PROYT, MARCAS, MODELOS, PROVS;
var GASTOS, SISG, CECOT, HECHOSMES;

/* Un total de cero en los diecisiete meses no significa que no haya
   movimiento: puede ser un cargo de un mes anulado en otro. Si se descarta
   por el total, al elegir ese mes el elemento desaparece aunque tenga
   importe. Por eso se mira si ALGUN mes trae algo. */
function algunMes(arr){
  for(var i = 0; i < arr.length; i++) if(arr[i] !== 0) return true;
  return false;
}
function cerrar(acc){
  var out = [];
  for(var k in acc){
    var a = acc[k];
    a.v = sumaTodo(a.m);
    a.hm = sumaTodo(a.mh);
    a.cph = a.hm ? a.v / a.hm : 0;
    a.eq = a.eqs ? Object.keys(a.eqs).length : 0;
    delete a.eqs;
    if(algunMes(a.m) || algunMes(a.mh)) out.push(a);
  }
  return out.sort(function(x, y){ return y.v - x.v; });
}
function meter(acc, clave, i, valor, campo, id){
  if(clave === undefined || clave === null || clave === '') return;
  var a = acc[clave];
  if(!a) a = acc[clave] = { n: clave, m: CEROS.slice(), mh: CEROS.slice(), eqs: {} };
  a[campo][i] += valor;
  if(id !== undefined) a.eqs[id] = 1;
}

function aplicarFiltros(){
  var i, j, n;
  var okP = mascara(PROYS, proyActivos());
  var okR = mascara(ROS, roSel);
  var okC = mascara(CECOS, cecoSel);
  var okU = mascara(CUENTAS, cuentaSel);
  var okG = mascara(GASTOSD, gastoSel);
  var okE = [];
  for(i = 0; i < TODOS.length; i++) okE.push(pasaEquipo(TODOS[i]) ? 1 : 0);

  SERIE = CEROS.slice(); SERIEHM = CEROS.slice();
  FASESM = {};
  for(i = 0; i < ROS.length; i++) FASESM[ROS[i]] = CEROS.slice();

  var mEq = {}, hEq = {};
  var aF = {}, aT = {}, aC = {}, aM = {}, aV = {}, aP = {}, aG = {}, aU = {}, aK = {}, aR = {};
  /* cuantas celdas del libro sobreviven, por mes: asi el contador de la
     hoja Filtros tambien sigue al periodo y no solo a las dimensiones */
  HECHOSMES = CEROS.slice();

  var Fe = F.e, Fp = F.p, Fr = F.r, Fc = F.c, Fu = F.u, Fg = F.g, Fm = F.m, Fv = F.v;
  for(j = 0, n = Fv.length; j < n; j++){
    if(!okP[Fp[j]] || !okR[Fr[j]] || !okC[Fc[j]] || !okU[Fu[j]] || !okG[Fg[j]]) continue;
    var ie = Fe[j];
    if(!okE[ie]) continue;
    var mm = Fm[j], vv = Fv[j], e = TODOS[ie];
    HECHOSMES[mm]++;
    var s = mEq[ie];
    if(!s) s = mEq[ie] = CEROS.slice();
    s[mm] += vv;
    SERIE[mm] += vv;
    FASESM[ROS[Fr[j]]][mm] += vv;
    meter(aP, PROYS[Fp[j]], mm, vv, 'm', e.id);
    meter(aG, GASTOSD[Fg[j]], mm, vv, 'm', e.id);
    meter(aU, CUENTAS[Fu[j]], mm, vv, 'm', e.id);
    meter(aK, CECOS[Fc[j]], mm, vv, 'm', e.id);
    meter(aR, ROS[Fr[j]], mm, vv, 'm', e.id);
  }

  var He = HH.e, Hp2 = HH.p, Hm2 = HH.m, Hv2 = HH.v;
  for(j = 0, n = Hv2.length; j < n; j++){
    if(!okP[Hp2[j]]) continue;
    var ie2 = He[j];
    if(!okE[ie2]) continue;
    var sh = hEq[ie2];
    if(!sh) sh = hEq[ie2] = CEROS.slice();
    sh[Hm2[j]] += Hv2[j];
    SERIEHM[Hm2[j]] += Hv2[j];
    meter(aP, PROYS[Hp2[j]], Hm2[j], Hv2[j], 'mh');
  }

  EQ = [];
  var vistos = {};
  for(var k in mEq) vistos[k] = 1;
  for(k in hEq) vistos[k] = 1;
  for(k in vistos){
    var idx = +k, at = TODOS[idx];
    var m = mEq[idx] || CEROS.slice(), mh = hEq[idx] || CEROS.slice();
    var v = sumaTodo(m), hm = sumaTodo(mh);
    /* mismo motivo: no se descarta por el total del periodo, sino por no
       tener movimiento en ningun mes */
    if(!algunMes(m) && !algunMes(mh)) continue;
    EQ.push({ id: at.id, fam: at.fam, tipo: at.tipo, mod: at.mod, marca: at.marca,
              prov: at.prov, clasif: at.clasif, proys: at.proys,
              sys: at.sys || [], ots: at.ots || [],
              m: m, mh: mh, v: v, hm: hm, cph: hm ? v / hm : 0 });
    meter(aF, at.fam, 0, 0, 'm', at.id);
    meter(aT, at.tipo, 0, 0, 'm', at.id);
    meter(aC, at.clasif, 0, 0, 'm', at.id);
    meter(aM, at.mod, 0, 0, 'm', at.id);
    meter(aV, at.prov, 0, 0, 'm', at.id);
    for(var t = 0; t < NM; t++){
      if(aF[at.fam]){ aF[at.fam].m[t] += m[t]; aF[at.fam].mh[t] += mh[t]; }
      if(aT[at.tipo]){ aT[at.tipo].m[t] += m[t]; aT[at.tipo].mh[t] += mh[t]; }
      if(at.clasif && aC[at.clasif]){ aC[at.clasif].m[t] += m[t]; aC[at.clasif].mh[t] += mh[t]; }
      if(at.mod && aM[at.mod]){ aM[at.mod].m[t] += m[t]; aM[at.mod].mh[t] += mh[t]; }
      if(at.prov && aV[at.prov]){ aV[at.prov].m[t] += m[t]; aV[at.prov].mh[t] += mh[t]; }
    }
  }

  EQ.sort(function(a, b){ return b.v - a.v; });
  byId = {};
  EQ.forEach(function(x){ byId[x.id] = x; });

  FAM = cerrar(aF); TIPOS = cerrar(aT); CATG = cerrar(aC);
  ART = cerrar(aM); PROVL = cerrar(aV); PROYT = cerrar(aP);
  GASTOS = cerrar(aG); SISG = cerrar(aU); CECOT = cerrar(aK);

  FASES = [];
  for(i = 0; i < ROS.length; i++){
    var vr = sumaTodo(FASESM[ROS[i]]);
    if(vr !== 0) FASES.push({ c: ROS[i], n: ROS[i], v: vr });
  }
  FASES.sort(function(a, b){ return b.v - a.v; });

  MODELOS = []; PROVS = []; MARCAS = [];
  EQ.forEach(function(x){
    if(x.mod && MODELOS.indexOf(x.mod) < 0) MODELOS.push(x.mod);
    if(x.prov && PROVS.indexOf(x.prov) < 0) PROVS.push(x.prov);
    if(x.marca && MARCAS.indexOf(x.marca) < 0) MARCAS.push(x.marca);
  });
  MODELOS.sort(); PROVS.sort(); MARCAS.sort();
}
aplicarFiltros();

function contarEquipos(){
  var n = 0;
  for(var i = 0; i < EQ.length; i++) if(sumaRango(EQ[i].m) !== 0) n++;
  return n;
}

/* ---------- rotulos de la seleccion ---------- */
function mesCorto(m){
  var p = m.split('-'), mm = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SET','OCT','NOV','DIC'];
  return mm[parseInt(p[1],10)-1] + ' ' + p[0].slice(2);
}
function todoElPeriodo(){ return rangoA === 0 && rangoB === NM - 1; }
function rotuloRango(){
  if(todoElPeriodo()) return mesCorto(MESES[0]) + ' – ' + mesCorto(MESES[NM-1]);
  if(rangoA === rangoB) return mesCorto(MESES[rangoA]);
  return mesCorto(MESES[rangoA]) + ' – ' + mesCorto(MESES[rangoB]);
}
function rotuloProy(){
  return proyFiltro === 'TODOS' ? 'TODOS LOS PROYECTOS' : proyFiltro;
}
function rotuloLista(sel, vocab, nombreTodo){
  if(sel.length === vocab.length) return nombreTodo;
  if(!sel.length) return 'NINGUNO';
  if(sel.length <= 2) return sel.join(' + ');
  return sel.length + ' DE ' + vocab.length;
}
function rotuloRO(){ return rotuloLista(roSel, ROS, 'TODO EL COSTO'); }
function rotuloEq(){
  var p = [];
  if(eqFiltro !== 'TODOS') p.push(eqFiltro);
  if(famFiltro !== 'TODAS') p.push(famFiltro);
  if(modFiltro !== 'TODOS') p.push(modFiltro);
  if(provFiltro !== 'TODOS') p.push(provFiltro);
  if(marcaFiltro !== 'TODAS') p.push(marcaFiltro);
  if(clasifFiltro !== 'TODAS') p.push(clasifFiltro);
  if(tipoFiltro !== 'TODOS') p.push(tipoFiltro);
  return p.join(' · ');
}
function rotuloSeleccion(){
  var p = [rotuloProy(), rotuloRango()];
  if(!todosLosRO()) p.push(rotuloRO());
  if(!todosLosCeco()) p.push('CECO: ' + rotuloLista(cecoSel, CECOS, ''));
  if(!todasLasCuentas()) p.push('CUENTA: ' + rotuloLista(cuentaSel, CUENTAS, ''));
  if(!todosLosGastos()) p.push('GASTO: ' + rotuloLista(gastoSel, GASTOSD, ''));
  if(hayFiltroEq()) p.push(rotuloEq());
  return p.join(' · ');
}

function totalR(){ return sumaRango(SERIE); }

/* ---------- el anio en curso, para el acumulado de En vivo ----------
   Los meses llegan como '2026-08'. El anio en curso es el del ultimo mes
   que tiene el libro, no una constante: asi no hay que tocar nada cuando
   entren meses de otro anio. Respeta los filtros de proyecto, RO y demas
   —SERIE ya viene filtrada— pero no el rango de meses, que es justamente
   lo que este numero ignora. */
function anioEnCurso(){ return (MESES[NM-1] || '').split('-')[0]; }
function tramoAnio(){
  var y = anioEnCurso(), ini = -1, fin = -1, i;
  for(i = 0; i < NM; i++){
    if(MESES[i].split('-')[0] === y){ if(ini < 0) ini = i; fin = i; }
  }
  return ini < 0 ? null : { ini: ini, fin: fin };
}
function totalAnio(){
  var t = tramoAnio();
  if(!t) return 0;
  var s = 0, i;
  for(i = t.ini; i <= t.fin && i < SERIE.length; i++) s += SERIE[i] || 0;
  return s;
}
function rotuloAnio(){
  var t = tramoAnio();
  if(!t) return '—';
  return t.ini === t.fin ? mesCorto(MESES[t.ini])
       : mesCorto(MESES[t.ini]) + ' – ' + mesCorto(MESES[t.fin]);
}
function hmR(){ return sumaRango(SERIEHM); }
function cphR(){ var h = hmR(); return h ? totalR() / h : 0; }
function famR(f){
  var v = sumaRango(f.m), h = sumaRango(f.mh);
  return { n: f.n, v: v, hm: h, eq: f.eq, cph: h ? v / h : 0 };
}
function eqR(e){
  var v = sumaRango(e.m), h = sumaRango(e.mh);
  return { v: v, hm: h, cph: h ? v / h : 0 };
}
function enRango(lista){
  return lista.map(function(a){
    var o = {}; for(var k in a) o[k] = a[k];
    o.v = a.m ? sumaRango(a.m) : a.v;
    return o;
  }).filter(function(a){ return a.v !== 0; })
    .sort(function(a, b){ return b.v - a.v; });
}

var extra = 0, movHoy = 0, vivo = false, seg = 0, pmFiltro = 'TODAS';
/* El detalle de mantenimiento sólo existe para la sede de Shougang: con
   otro proyecto activo no hay ordenes que mostrar, y se dice. */
function hayOts(){
  return proyFiltro === 'TODOS' || proyFiltro === (META.proyDetalle || 'SHOUGANG');
}
function otsRango(){
  if(!hayOts()) return [];
  return OTS.filter(function(o){ return o.mi === undefined || (o.mi >= rangoA && o.mi <= rangoB); });
}
function sysRango(e){
  return enRango(e.sys || []);
}

function nivelCalor(v, max){
  if(!v) return 0;
  var p = Math.pow(v/max, 0.6);
  return p > 0.62 ? 4 : p > 0.34 ? 3 : p > 0.14 ? 2 : 1;
}
function varCalor(v, max){ return 'var(--h' + nivelCalor(v, max) + ')'; }
function hexCalor(v, max){ return css('--h' + nivelCalor(v, max)) || '#888888'; }
/* el equipo se pinta en la escala verde: el camion es verde, y el costo
   lo oscurece en vez de cambiarle el color */
/* La escala del equipo tiene dos familias: ambar para Caterpillar y
   Komatsu, verde para el resto. Asi el mapa de calor no borra el color de
   la marca, que es lo que pasaba cuando todos los sistemas tenian costo. */
var RAMPA = 'g';
function ponerRampa(marca){
  RAMPA = (typeof esMarcaAmarilla === 'function' && esMarcaAmarilla(marca)) ? 'a' : 'g';
  var el = $('escalaCalor');
  if(el){
    Array.prototype.forEach.call(el.querySelectorAll('i[data-n]'), function(i){
      i.style.background = css('--' + RAMPA + i.getAttribute('data-n'));
    });
  }
}
function varCalorEq(v, max){ return 'var(--' + RAMPA + nivelCalor(v, max) + ')'; }
function hexCalorEq(v, max){
  return css('--' + RAMPA + nivelCalor(v, max)) || (RAMPA === 'a' ? '#EDBB16' : '#6FBF73');
}

/* ══════════════════════════════════════════════════════════════════
   3 · barras genericas
   ══════════════════════════════════════════════════════════════════ */
function barras(el, arr, opt){
  if(!el) return;
  opt = opt || {};
  var max = 0;
  arr.forEach(function(a){ if(a.v > max) max = a.v; });
  var suma = arr.reduce(function(s,a){ return s + a.v; }, 0);
  el.innerHTML = arr.map(function(a, i){
    var extra2 = opt.extra ? opt.extra(a) : '';
    return '<div class="fase' + (i === 0 ? ' top' : '') + '">'
      + '<div class="nm">' + esc(a.n) + '</div>'
      + '<div class="via" style="--w:' + (max ? a.v / max * 100 : 0).toFixed(1) + '%"><i></i></div>'
      + '<div class="vl">' + (opt.k ? fmtK(a.v) : fmt(a.v)) + '</div>'
      + '<div class="pc">' + (extra2 || (suma ? (a.v / suma * 100).toFixed(1) : '0') + '%') + '</div>'
      + '</div>';
  }).join('');
  setTimeout(function(){
    Array.prototype.forEach.call(el.querySelectorAll('.via i'), function(i2){
      i2.style.width = i2.parentElement.style.getPropertyValue('--w');
    });
  }, 40);
}

/* ══════════════════════════════════════════════════════════════════
   4 · serie mensual: globo al pasar el raton, clic para aislar el mes
   ══════════════════════════════════════════════════════════════════ */
function pintarSerie(el, ejeIni, ejeFin){
  if(!el) return;
  var max = Math.max.apply(null, SERIE);
  el.innerHTML = SERIE.map(function(v, i){
    return '<div class="col" role="button" tabindex="0" data-i="' + i + '"'
      + ' style="--h:' + (v / max * 100).toFixed(1) + '%"><i style="height:0"></i></div>';
  }).join('');
  setTimeout(function(){
    Array.prototype.forEach.call(el.querySelectorAll('.col'), function(c){
      c.querySelector('i').style.height = c.style.getPropertyValue('--h');
    });
  }, 60);
  txt(ejeIni, mesCorto(MESES[0]));
  txt(ejeFin, mesCorto(MESES[MESES.length - 1]));

  var glob = $('globoMes');
  Array.prototype.forEach.call(el.querySelectorAll('.col'), function(c){
    var i = parseInt(c.getAttribute('data-i'), 10);
    c.addEventListener('mouseenter', function(){
      if(!glob) return;
      var hm = SERIEHM[i] || 0;
      glob.innerHTML = '<b>' + esc(mesCorto(MESES[i])) + '</b>'
        + 'US$ ' + fmt(SERIE[i]) + '<br><i>' + fmt(hm) + ' h máquina · US$ '
        + (hm ? (SERIE[i] / hm).toFixed(1) : '—') + ' por hora</i>';
      glob.className = 'globoMes on';
      var r = c.getBoundingClientRect(), rp = el.parentElement.getBoundingClientRect();
      var mitad = glob.offsetWidth / 2, x = r.left - rp.left + r.width / 2;
      glob.style.left = Math.max(mitad + 2, Math.min(rp.width - mitad - 2, x)) + 'px';
      glob.style.top = (r.top - rp.top) + 'px';
    });
    c.addEventListener('mouseleave', function(){ if(glob) glob.className = 'globoMes'; });
    var pick = function(){
      if(rangoA === i && rangoB === i) ponerRango(0, MESES.length - 1);
      else ponerRango(i, i);
    };
    c.addEventListener('click', pick);
    c.addEventListener('keydown', function(ev){
      if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); pick(); }
    });
  });
  marcarRango();
}

/* Aviso de que se esta viendo menos que todo el periodo, con la salida
   a mano. Estaba en el HTML desde el principio pero nadie lo encendia. */
function marcarMesSel(){
  var caja = $('mesSel');
  if(!caja) return;
  caja.hidden = todoElPeriodo();
  txt('mesSel-n', rotuloRango());
  var x = $('mesSel-x');
  if(x && !x.getAttribute('data-listo')){
    x.setAttribute('data-listo', '1');
    x.addEventListener('click', function(){ ponerRango(0, MESES.length - 1); });
  }
}

function marcarRango(){
  ['serie','serie2'].forEach(function(id){
    var el = $(id);
    if(!el) return;
    Array.prototype.forEach.call(el.querySelectorAll('.col'), function(c){
      var i = parseInt(c.getAttribute('data-i'), 10);
      c.classList.toggle('sel', i >= rangoA && i <= rangoB && !todoElPeriodo());
    });
  });
}

/* Cambiar el periodo repinta las tres vistas que dependen de el. */
function ponerRango(a, b){
  rangoA = Math.max(0, Math.min(a, b));
  rangoB = Math.min(MESES.length - 1, Math.max(a, b));
  txt('periodoAct', rotuloRango());
  ['', '2', '3', '4'].forEach(function(suf){
    var sa = $('mesDesde' + suf), sb = $('mesHasta' + suf);
    if(sa) sa.value = rangoA;
    if(sb) sb.value = rangoB;
  });
  marcarRango();
  marcarMesSel();
  pintarInicio();
  pintarFlota();
  pintarTendencia();
  pintarOrdenes();
  pintarArticulos();
  pintarTicker();
  pintarPulso();
  if(typeof pintarFiltros === 'function') pintarFiltros();
  if(eqActual) elegirEquipo(eqActual);
}

/* ══════════════════════════════════════════════════════════════════
   5 · INICIO — cifras del periodo y ratio por flota
   ══════════════════════════════════════════════════════════════════ */
function pintarRatiosEn(el, arr, ir){
  if(!el) return;
  var max = Math.max.apply(null, arr.map(function(f){ return f.cph; })) || 1;
  el.innerHTML = arr.map(function(f){
    var abre = ir ? ' ir" role="button" tabindex="0" data-f="' + esc(f.n) + '"' : '"';
    return '<div class="ratio' + abre + '>'
      + '<div class="rn">' + esc(f.n) + '</div>'
      + (f.hm
          ? '<div class="rv"><span class="u">US$</span>' + f.cph.toFixed(1) + '<span class="h">/h</span></div>'
          : '<div class="rv">—<span class="h">sin horas</span></div>')
      + '<div class="rb"><i style="--w:' + (f.hm ? (f.cph / max * 100).toFixed(1) : 0) + '%"></i></div>'
      + '<div class="rd">' + f.eq + ' equipos · ' + fmtK(f.hm) + ' h · US$ ' + fmtK(f.v) + '</div>'
      + (ir ? '<div class="rir">VER ESTA FLOTA →</div>' : '')
      + '</div>';
  }).join('') || '<div class="ratio"><div class="rn">SIN DATOS</div>'
      + '<div class="rv">—</div><div class="rd">Ningún equipo cumple el filtro en este periodo.</div></div>';
  if(ir){
    Array.prototype.forEach.call(el.querySelectorAll('.ratio.ir'), function(t){
      var abrir = function(){ verFlota(t.getAttribute('data-f')); };
      t.addEventListener('click', abrir);
      t.addEventListener('keydown', function(ev){
        if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); abrir(); }
      });
    });
  }
  setTimeout(function(){
    Array.prototype.forEach.call(el.querySelectorAll('.rb i'), function(i2){
      i2.style.width = i2.style.getPropertyValue('--w');
    });
  }, 40);
}

/* FAM ya sale de los equipos que pasan el filtro, asi que el ratio de la
   pestana Flota y el de la tarjeta del inicio son literalmente el mismo
   calculo: no hay dos caminos que puedan dar cifras distintas. */
function ratiosFlota(){
  return FAM.map(famR)
            .filter(function(f){ return f.hm > 0 || f.v !== 0; })
            .sort(function(a, b){ return b.cph - a.cph; });
}

/* El costo de cada tipo de flota, de una pasada por el libro. No lo trae
   el JSON y no vale la pena regenerarlo por esto: son 44 mil celdas y se
   cuenta una sola vez al arrancar. Como las fichas de proyecto, la cifra
   es del libro entero y no sigue a la seleccion. */
var TOT_TIPO = (function(){
  var t = {}, Fe = F.e, Fv = F.v, j, n;
  for(j = 0, n = Fv.length; j < n; j++){
    var k = TODOS[Fe[j]].tipo || 'SIN TIPO';
    t[k] = (t[k] || 0) + Fv[j];
  }
  return t;
})();
var TIPOS_FLOTA = (function(){
  var l = [];
  TODOS.forEach(function(e){ if(e.tipo && l.indexOf(e.tipo) < 0) l.push(e.tipo); });
  return l.sort();
})();

/* ══════════════════════════════════════════════════════════════════
   4b · filtro de proyecto
   ══════════════════════════════════════════════════════════════════ */
function construirFiltroProy(){
  var cont = $('filtroProy');
  if(!cont || cont.getAttribute('data-listo')) return;
  cont.setAttribute('data-listo', '1');
  var pp = META.porProy || {};
  var items = [{ n: 'TODOS', v: META.total }].concat(PROYS.map(function(p){
    return { n: p, v: (pp[p] || {}).v || 0 };
  }));
  cont.innerHTML = items.map(function(it){
    return '<button class="pchip" type="button" data-p="' + esc(it.n) + '"'
      + ' aria-pressed="' + (it.n === proyFiltro) + '">'
      + '<b>' + esc(it.n === 'TODOS' ? 'TODOS LOS PROYECTOS' : it.n) + '</b>'
      + '<small>US$ ' + fmtK(it.v) + '</small></button>';
  }).join('');
  Array.prototype.forEach.call(cont.querySelectorAll('.pchip'), function(b){
    b.addEventListener('click', function(){ ponerProyecto(b.getAttribute('data-p')); });
  });
}

/* ---------- fichas de PROPIO / ALQUILADO ---------- */
function construirFiltroTipo(){
  var cont = $('filtroTipo');
  if(!cont || cont.getAttribute('data-listo')) return;
  if(TIPOS_FLOTA.length < 2) return;      /* con un solo tipo no hay nada que elegir */
  cont.setAttribute('data-listo', '1');
  var items = [{ n: 'TODOS', r: 'TODA LA FLOTA', v: META.total }]
    .concat(TIPOS_FLOTA.map(function(t){
      return { n: t, r: t, v: TOT_TIPO[t] || 0 };
    }));
  cont.innerHTML = items.map(function(it){
    return '<button class="pchip" type="button" data-t="' + esc(it.n) + '"'
      + ' aria-pressed="' + (it.n === tipoFiltro) + '">'
      + '<b>' + esc(it.r) + '</b>'
      + '<small>US$ ' + fmtK(it.v) + '</small></button>';
  }).join('');
  Array.prototype.forEach.call(cont.querySelectorAll('.pchip'), function(b){
    b.addEventListener('click', function(){ ponerFiltroEq('tipo', b.getAttribute('data-t')); });
  });
}

function marcarFiltroTipo(){
  var cont = $('filtroTipo');
  if(!cont) return;
  Array.prototype.forEach.call(cont.querySelectorAll('.pchip'), function(b){
    b.setAttribute('aria-pressed', b.getAttribute('data-t') === tipoFiltro);
  });
}

function marcarFiltroProy(){
  var cont = $('filtroProy');
  if(!cont) return;
  Array.prototype.forEach.call(cont.querySelectorAll('.pchip'), function(b){
    b.setAttribute('aria-pressed', b.getAttribute('data-p') === proyFiltro);
  });
  txt('proyAct', rotuloProy());
}

/* Mover proyecto o RO cambia los datos de todas las vistas, no solo su
   escala: hay que rehacer las listas y volver a pintar de cero. */
function rehacerTodo(){
  aplicarFiltros();
  refrescarFiltros();
  marcarFiltroProy();
  marcarFiltroTipo();
  marcarFiltroRO();
  if(typeof pintarFiltros === 'function') pintarFiltros();
  /* las series dibujadas pertenecen a la seleccion anterior */
  ['serie', 'serie2'].forEach(function(id){ var el = $(id); if(el) el.innerHTML = ''; });
  htm('selector', EQ.map(function(e){
    return '<option value="' + esc(e.id) + '">' + esc(e.id + ' — ' + (e.mod || e.fam)) + '</option>';
  }).join(''));
  pintarInicio();
  pintarFlota();
  pintarTendencia();
  pintarOrdenes();
  pintarArticulos();
  pintarFicha();
  pintarTicker();
  pintarPulso();
  if(EQ.length) elegirEquipo(byId[eqActual] ? eqActual : EQ[0].id);
}

/* ---------- desplegable de RO, seleccion multiple ---------- */
function construirFiltroRO(){
  var caja = $('roCaja'), bt = $('roBtn');
  if(!caja || caja.getAttribute('data-listo')) return;
  caja.setAttribute('data-listo', '1');
  var pr = META.porRO || {};
  caja.innerHTML = ROS.map(function(r){
    return '<label class="despIt"><input type="checkbox" value="' + esc(r) + '"'
      + (roSel.indexOf(r) >= 0 ? ' checked' : '') + '>'
      + '<span>' + esc(r) + '</span>'
      + '<span class="v">US$ ' + fmtK(pr[r] || 0) + '</span></label>';
  }).join('')
    + '<div class="despPie"><button type="button" data-a="todo">TODOS</button>'
    + '<button type="button" data-a="nada">NINGUNO</button></div>';

  Array.prototype.forEach.call(caja.querySelectorAll('input'), function(x){
    x.addEventListener('change', function(){
      var sel = [];
      /* se respeta el orden de ROS para que el rotulo salga siempre igual */
      ROS.forEach(function(r){
        var y = caja.querySelector('input[value="' + r.replace(/"/g, '&quot;') + '"]');
        if(y && y.checked) sel.push(r);
      });
      roSel = sel;
      marcarFiltroRO();
      rehacerTodo();
    });
  });
  Array.prototype.forEach.call(caja.querySelectorAll('.despPie button'), function(b){
    b.addEventListener('click', function(){
      roSel = b.getAttribute('data-a') === 'todo' ? ROS.slice() : [];
      marcarFiltroRO();
      rehacerTodo();
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
}

function marcarFiltroRO(){
  var caja = $('roCaja');
  if(caja){
    Array.prototype.forEach.call(caja.querySelectorAll('input'), function(x){
      x.checked = roSel.indexOf(x.value) >= 0;
    });
  }
  txt('roRotulo', rotuloRO());
}

function ponerProyecto(p){
  if(p === proyFiltro) return;
  proyFiltro = p;
  rehacerTodo();
}

/* Desde el inicio se entra al detalle de una flota. */
function verFlota(n){
  modFiltro = 'TODOS'; provFiltro = 'TODOS'; eqFiltro = 'TODOS';
  ponerFiltroEq('fam', n);
  irA('v-flota');
  setTimeout(function(){
    var t = $('f-ro');
    if(t) t.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 140);
}

function pintarInicio(){
  marcarMesSel();
  var sr = $('serie');
  if(sr && !sr.children.length) pintarSerie(sr, 'serie-ini', 'serie-fin');
  contar($('k-total'), totalR());
  contar($('k-hm'), hmR());
  contar($('k-eq'), contarEquipos());
  txt('k-eq-l', 'equipos con costo imputado en el periodo'
      + (proyFiltro === 'TODOS' ? '' : ', en ' + proyFiltro));
  txt('k-total-l', todosLosRO()
      ? 'costo total de equipos del periodo, en dólares'
      : 'sólo ' + rotuloRO().toLowerCase() + ', en dólares');
  txt('k-periodo', rotuloRango());
  construirFiltroProy();
  marcarFiltroProy();
  construirFiltroTipo();
  marcarFiltroTipo();
  construirFiltroRO();
  marcarFiltroRO();
  txt('ratiosNotaInicio', 'US$ POR HORA'
      + (proyFiltro === 'TODOS' ? '' : ' · ' + proyFiltro)
      + (todosLosRO() ? '' : ' · SOLO ' + rotuloRO())
      + ' · CLIC EN UNA FLOTA PARA VER SU DETALLE');
  pintarRatiosEn($('ratios'), FAM.map(famR).filter(function(f){ return f.hm > 0 || f.v !== 0; })
                                 .sort(function(a,b){
                                   if(!a.hm !== !b.hm) return a.hm ? -1 : 1;
                                   return b.cph - a.cph;
                                 }), true);
}

/* ══════════════════════════════════════════════════════════════════
   6 · FLOTA — controles arriba, reparto por RO y tabla de equipos
   ══════════════════════════════════════════════════════════════════ */
/* Lo primero de la vista Flota: en que concepto se va el costo de la
   seleccion. Es lo que se quiere ver al entrar desde una tarjeta. */
function pintarRO(){
  var el = $('f-ro');
  if(!el) return;
  var arr = FASES.map(function(f){ return { n: f.n, v: sumaRango(FASESM[f.c]) }; })
                 .filter(function(f){ return f.v !== 0; })
                 .sort(function(a, b){ return b.v - a.v; });
  var max = arr.length ? Math.abs(arr[0].v) : 1;
  var suma = arr.reduce(function(s, f){ return s + f.v; }, 0) || 1;
  el.innerHTML = arr.map(function(f){
    return '<div class="roIt"><div class="rn">' + esc(f.n) + '</div>'
      + '<div class="rv">US$ ' + fmtK(f.v) + '</div>'
      + '<div class="rb"><i style="--w:' + (Math.abs(f.v) / max * 100).toFixed(1) + '%"></i></div>'
      + '<div class="rp">' + (f.v / suma * 100).toFixed(1) + '% de la selección</div></div>';
  }).join('') || '<div class="roIt"><div class="rn">SIN COSTO</div>'
      + '<div class="rv">—</div><div class="rp">Nada que mostrar con estos filtros.</div></div>';
  txt('f-roPeriodo', rotuloSeleccion());
  setTimeout(function(){
    /* la variable --w va en la propia barra, no en su contenedor */
    Array.prototype.forEach.call(el.querySelectorAll('.rb i'), function(i2){
      i2.style.width = i2.style.getPropertyValue('--w');
    });
  }, 40);
}

function pintarFlota(){
  construirPanelMeses('2');
  construirFiltros('');
  pintarRO();
  pintarTablaEq();
}

function opciones(lista, sel, todos){
  return ['<option value="' + todos + '">' + todos + '</option>'].concat(
    lista.map(function(x){
      return '<option value="' + esc(x) + '"' + (x === sel ? ' selected' : '') + '>' + esc(x) + '</option>';
    })).join('');
}

/* Los mismos tres desplegables viven en la hoja 2 y en la 3, y mandan
   sobre toda la torre: se construyen con sufijo y se mantienen en sincronia.
   Las opciones NO salen del recorte activo sino del universo del proyecto,
   porque si no, elegir una flota borraria del desplegable a las demas. */
var SUFS = ['', '3'];

function universo(){
  var fam = [], mod = [], prov = [], marca = [], clasif = [], tipo = [];
  TODOS.forEach(function(e){
    if(proyFiltro !== 'TODOS' && e.proys.indexOf(proyFiltro) < 0) return;
    if(e.fam && fam.indexOf(e.fam) < 0) fam.push(e.fam);
    if(e.mod && mod.indexOf(e.mod) < 0) mod.push(e.mod);
    if(e.prov && prov.indexOf(e.prov) < 0) prov.push(e.prov);
    if(e.marca && marca.indexOf(e.marca) < 0) marca.push(e.marca);
    if(e.clasif && clasif.indexOf(e.clasif) < 0) clasif.push(e.clasif);
    if(e.tipo && tipo.indexOf(e.tipo) < 0) tipo.push(e.tipo);
  });
  return { fam: fam.sort(), mod: mod.sort(), prov: prov.sort(),
           marca: marca.sort(), clasif: clasif.sort(), tipo: tipo.sort() };
}

function construirFiltros(suf){
  suf = suf || '';
  var cont = $('filtrosEq' + suf);
  if(!cont || cont.getAttribute('data-listo')) return;
  cont.setAttribute('data-listo', '1');
  cont.innerHTML =
      '<label class="fl">PROPIO / ALQUILADO<select id="fTipoP' + suf + '"></select></label>'
    + '<label class="fl">FLOTA / FAMILIA<select id="fFam' + suf + '"></select></label>'
    + '<label class="fl">MODELO<select id="fMod' + suf + '"></select></label>'
    + '<label class="fl">PROVEEDOR<select id="fProv' + suf + '"></select></label>'
    + '<button class="fbt" id="fLimpia' + suf + '">LIMPIAR</button>';
  refrescarFiltros();
  esc_('fTipoP' + suf, 'change', function(){ ponerFiltroEq('tipo', this.value); });
  esc_('fFam' + suf, 'change', function(){ ponerFiltroEq('fam', this.value); });
  esc_('fMod' + suf, 'change', function(){ ponerFiltroEq('mod', this.value); });
  esc_('fProv' + suf, 'change', function(){ ponerFiltroEq('prov', this.value); });
  esc_('fLimpia' + suf, 'click', function(){ ponerFiltroEq('limpiar'); });
}

/* La lista de equipos elegibles: todos los del proyecto activo, con su
   modelo al lado para reconocerlos. Se comparte entre los dos campos. */
function construirListaEq(){
  var dl = $('listaEq');
  if(!dl) return;
  var marca = proyFiltro + '|' + TODOS.length;
  if(dl.getAttribute('data-marca') === marca) return;
  dl.setAttribute('data-marca', marca);
  dl.innerHTML = TODOS.filter(function(e){
    return proyFiltro === 'TODOS' || e.proys.indexOf(proyFiltro) >= 0;
  }).map(function(e){
    return '<option value="' + esc(e.id) + '">' + esc(e.mod || e.fam) + '</option>';
  }).join('');
}

var CAMPOS_EQ = ['fEq3', 'fEq4'];
function conectarCampoEq(id){
  var el = $(id);
  if(!el || el.getAttribute('data-listo')) return;
  el.setAttribute('data-listo', '1');
  el.addEventListener('change', function(){
    var v = (this.value || '').trim().toUpperCase();
    if(!v) return ponerFiltroEq('eq', 'TODOS');
    var hit = null;
    for(var i = 0; i < TODOS.length && !hit; i++){
      if(TODOS[i].id.toUpperCase() === v) hit = TODOS[i].id;
    }
    /* si lo escrito no es un equipo del libro se repone lo anterior, en
       vez de dejar la torre en una seleccion vacia sin explicacion */
    if(hit) ponerFiltroEq('eq', hit);
    else this.value = eqFiltro === 'TODOS' ? '' : eqFiltro;
  });
}
function marcarCampoEq(){
  CAMPOS_EQ.forEach(function(id){
    var el = $(id);
    if(!el) return;
    conectarCampoEq(id);
    el.value = eqFiltro === 'TODOS' ? '' : eqFiltro;
  });
}

function refrescarFiltros(){
  construirListaEq();
  marcarCampoEq();
  var u = universo();
  SUFS.forEach(function(suf){
    if(!$('fFam' + suf)) return;
    htm('fTipoP' + suf, opciones(u.tipo, tipoFiltro, 'TODOS'));
    htm('fFam' + suf, opciones(u.fam, famFiltro, 'TODAS'));
    htm('fMod' + suf, opciones(u.mod, modFiltro, 'TODOS'));
    htm('fProv' + suf, opciones(u.prov, provFiltro, 'TODOS'));
  });
  marcarActivos();
}

function ponerFiltroEq(campo, valor){
  if(campo === 'eq') eqFiltro = valor;
  else if(campo === 'fam') famFiltro = valor;
  else if(campo === 'mod') modFiltro = valor;
  else if(campo === 'prov') provFiltro = valor;
  else if(campo === 'marca') marcaFiltro = valor;
  else if(campo === 'clasif') clasifFiltro = valor;
  else if(campo === 'tipo') tipoFiltro = valor;
  else {
    famFiltro = 'TODAS'; modFiltro = 'TODOS'; provFiltro = 'TODOS';
    marcaFiltro = 'TODAS'; clasifFiltro = 'TODAS'; tipoFiltro = 'TODOS';
    eqFiltro = 'TODOS';
  }
  rehacerTodo();
}

/* En el inicio no hay desplegables, asi que los filtros de equipo activos
   se anuncian ahi con su boton para quitarlos. */
function marcarActivos(){
  var el = $('activosEq');
  if(!el) return;
  var p = [];
  if(famFiltro !== 'TODAS') p.push(['fam', 'FLOTA', famFiltro]);
  if(modFiltro !== 'TODOS') p.push(['mod', 'MODELO', modFiltro]);
  if(provFiltro !== 'TODOS') p.push(['prov', 'PROVEEDOR', provFiltro]);
  if(eqFiltro !== 'TODOS') p.push(['eq', 'EQUIPO', eqFiltro]);
  if(marcaFiltro !== 'TODAS') p.push(['marca', 'MARCA', marcaFiltro]);
  if(clasifFiltro !== 'TODAS') p.push(['clasif', 'CLASIFICACIÓN', clasifFiltro]);
  if(tipoFiltro !== 'TODOS') p.push(['tipo', 'TIPO', tipoFiltro]);
  if(!todosLosCeco()) p.push(['ceco', 'CENTRO DE COSTE', rotuloLista(cecoSel, CECOS, '')]);
  if(!todasLasCuentas()) p.push(['cuenta', 'CUENTA', rotuloLista(cuentaSel, CUENTAS, '')]);
  if(!todosLosGastos()) p.push(['gasto', 'TIPO DE GASTO', rotuloLista(gastoSel, GASTOSD, '')]);
  el.hidden = !p.length;
  if(!p.length) return;
  el.innerHTML = '<span class="et">FILTRO ACTIVO EN TODAS LAS PESTAÑAS</span>'
    + p.map(function(a){
        return '<button class="quitar" type="button" data-c="' + a[0] + '">'
             + a[1] + ' <b>' + esc(a[2]) + '</b> ✕</button>';
      }).join('');
  Array.prototype.forEach.call(el.querySelectorAll('.quitar'), function(b){
    b.addEventListener('click', function(){
      var c2 = b.getAttribute('data-c');
      if(c2 === 'ceco'){ cecoSel = CECOS.slice(); return rehacerTodo(); }
      if(c2 === 'cuenta'){ cuentaSel = CUENTAS.slice(); return rehacerTodo(); }
      if(c2 === 'gasto'){ gastoSel = GASTOSD.slice(); return rehacerTodo(); }
      ponerFiltroEq(c2, (c2 === 'fam' || c2 === 'marca' || c2 === 'clasif') ? 'TODAS' : 'TODOS');
    });
  });
}

function equiposFiltrados(){
  return EQ.map(function(e){
    var r = eqR(e);
    return { e: e, v: r.v, hm: r.hm, cph: r.cph };
  }).filter(function(x){ return x.v !== 0; })
    .sort(function(a, b){ return b.v - a.v; });
}

function pintarTablaEq(){
  var tb = $('tablaEq');
  if(!tb) return;
  var vis = equiposFiltrados();

  /* el ratio por flota sigue a los filtros */
  pintarRO();
  pintarRatiosEn($('ratiosFlota'), ratiosFlota());
  txt('ratiosNota', 'US$ POR HORA · ' + rotuloSeleccion());
  txt('f-neq', fmt(vis.length));
  tb.innerHTML = vis.slice(0, 40).map(function(x, i){
    var e = x.e;
    return '<tr data-eq="' + esc(e.id) + '" tabindex="0">'
      + '<td class="rank">' + String(i + 1).padStart(2, '0') + '</td>'
      + '<td class="id">' + esc(e.id) + '</td>'
      + '<td>' + esc(e.fam) + '</td>'
      + '<td>' + esc(e.mod || '—') + '</td>'
      + '<td>' + esc((e.prov || '').slice(0, 24)) + '</td>'
      + '<td class="nn">' + fmt(x.hm) + '</td>'
      + '<td class="nn fuerte">' + fmt(x.v) + '</td>'
      + '<td class="nn">' + x.cph.toFixed(1) + '</td></tr>';
  }).join('') || '<tr><td colspan="8" style="padding:26px;text-align:center">Ningún equipo con ese filtro en el periodo elegido.</td></tr>';
  Array.prototype.forEach.call(tb.querySelectorAll('tr[data-eq]'), function(tr){
    var ir = function(){ elegirEquipo(tr.getAttribute('data-eq')); irA('v-equipo'); };
    tr.addEventListener('click', ir);
    tr.addEventListener('keydown', function(ev){
      if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); ir(); }
    });
  });
}

/* ══════════════════════════════════════════════════════════════════
   7 · panel de periodo, compartido por las hojas 1, 2 y 3
   ══════════════════════════════════════════════════════════════════ */
function construirPanelMeses(suf){
  suf = suf || '';
  var sa = $('mesDesde' + suf), sb = $('mesHasta' + suf);
  if(!sa || sa.getAttribute('data-listo')) return;
  sa.setAttribute('data-listo', '1');
  var ops = MESES.map(function(m, i){ return '<option value="' + i + '">' + mesCorto(m) + '</option>'; }).join('');
  sa.innerHTML = ops; sb.innerHTML = ops;
  sa.value = rangoA; sb.value = rangoB;
  sa.addEventListener('change', function(){ ponerRango(parseInt(this.value,10), rangoB); });
  sb.addEventListener('change', function(){ ponerRango(rangoA, parseInt(this.value,10)); });
  /* los anos que se ofrecen salen de los meses que trae la fuente:
     antes habia un boton 2024 fijo que no seleccionaba nada */
  var anos = [];
  MESES.forEach(function(m){
    var a = m.slice(0, 4);
    if(anos.indexOf(a) < 0) anos.push(a);
  });
  var atajos = $('atajos' + suf);
  if(atajos){
    atajos.innerHTML = ''
      + '<button class="fbt" data-r="todo">TODO</button>'
      + '<button class="fbt" data-r="12">ÚLTIMOS 12 MESES</button>'
      + '<button class="fbt" data-r="6">ÚLTIMOS 6 MESES</button>'
      + '<button class="fbt" data-r="3">ÚLTIMO TRIMESTRE</button>'
      + anos.map(function(a){
          return '<button class="fbt" data-r="' + a + '">' + a + '</button>'; }).join('');
    Array.prototype.forEach.call(atajos.querySelectorAll('.fbt'), function(b){
      b.addEventListener('click', function(){
        var r = b.getAttribute('data-r'), u = MESES.length - 1;
        if(r === 'todo') return ponerRango(0, u);
        if(r === '12' || r === '6' || r === '3') return ponerRango(u - (parseInt(r,10) - 1), u);
        var ini = -1, fin = -1;
        MESES.forEach(function(m, i){ if(m.indexOf(r) === 0){ if(ini < 0) ini = i; fin = i; } });
        if(ini >= 0) ponerRango(ini, fin);
      });
    });
  }
}

/* ══════════════════════════════════════════════════════════════════
   8 · ORDENES
   ══════════════════════════════════════════════════════════════════ */
function pintarOrdenes(){
  var base = otsRango(), clases = {};
  base.forEach(function(o){ if(o.pm && o.pm !== '-' && o.pm !== '0') clases[o.pm] = (clases[o.pm] || 0) + 1; });
  var lista = ['TODAS'].concat(Object.keys(clases).sort());
  var cont = $('filtrosPM');
  if(cont){
    cont.innerHTML = lista.map(function(c){
      var n = (c === 'TODAS') ? base.length : clases[c];
      return '<button class="fbt" data-c="' + esc(c) + '" aria-pressed="' + (c === pmFiltro) + '">'
        + esc(c) + ' <span style="opacity:.6">' + n + '</span></button>';
    }).join('');
    Array.prototype.forEach.call(cont.querySelectorAll('.fbt'), function(b){
      b.addEventListener('click', function(){
        pmFiltro = b.getAttribute('data-c');
        Array.prototype.forEach.call(cont.querySelectorAll('.fbt'), function(x){
          x.setAttribute('aria-pressed', x.getAttribute('data-c') === pmFiltro);
        });
        pintarTablaOts();
      });
    });
  }
  txt('o-tot', fmt(otsRango().length));
  txt('o-periodo', rotuloRango());
  pintarTablaOts();
}

function pintarTablaOts(){
  var tb = $('tablaOts');
  if(!tb) return;
  var vis = otsRango().filter(function(o){ return pmFiltro === 'TODAS' || o.pm === pmFiltro; });
  if(!vis.length){
    tb.innerHTML = '<tr><td colspan="7" style="padding:26px;text-align:center">'
      + (hayOts()
         ? 'Ninguna orden en ' + esc(rotuloRango()) + ' con ese filtro.'
         : 'El detalle de órdenes sólo existe para Shougang. Con ' + esc(proyFiltro)
           + ' activo no hay nada que mostrar aquí; las cifras de costo de las demás '
           + 'pestañas sí cubren este proyecto.')
      + '</td></tr>';
    return;
  }
  tb.innerHTML = vis.slice(0, 160).map(function(o){
    /* la orden lleva al equipo al que pertenece: es lo primero que se
       pregunta al ver una OT cara y antes no habia como llegar */
    var lleva = o.eq && byId[o.eq];
    return '<tr' + (lleva ? ' data-eq="' + esc(o.eq) + '" tabindex="0" class="ir"' : '') + '>'
      + '<td class="o">' + esc(o.ot) + '</td>'
      + '<td class="q">' + esc(o.eq || '—') + '</td>'
      + '<td><span class="pmc ' + esc(o.pm) + '">' + esc(o.pm || '—') + '</span></td>'
      + '<td>' + esc(SD[o.sis] || o.sis || '—')
      + (o.f === 'C' ? '<span class="marcaF c">SAP</span>' : '') + '</td>'
      + '<td class="d">' + esc(o.txt) + '</td>'
      + '<td>' + esc(o.d) + '</td>'
      + '<td class="n">' + fmt(o.v) + '</td></tr>';
  }).join('');
  Array.prototype.forEach.call(tb.querySelectorAll('tr[data-eq]'), function(tr){
    var ir = function(){ elegirEquipo(tr.getAttribute('data-eq')); irA('v-equipo'); };
    tr.addEventListener('click', ir);
    tr.addEventListener('keydown', function(ev){
      if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); ir(); }
    });
  });
}

/* ══════════════════════════════════════════════════════════════════
   9 · ARTICULOS
   ══════════════════════════════════════════════════════════════════ */
function pintarArticulos(){
  function lista(el, arr){
    if(!el || !arr.length) return;
    var max = arr[0].v;
    el.innerHTML = arr.slice(0, 10).map(function(a, i){
      return '<div class="it"><span class="i">' + String(i + 1).padStart(2, '0') + '</span>'
        + '<span class="n">' + esc(a.n) + '</span>'
        + '<span class="v">US$ ' + fmt(a.v) + '</span>'
        + '<span class="barra" style="--w:' + (a.v / max * 100).toFixed(1) + '%"><i></i></span></div>';
    }).join('');
    setTimeout(function(){
      Array.prototype.forEach.call(el.querySelectorAll('.barra i'), function(i2){
        i2.style.width = i2.parentElement.style.getPropertyValue('--w');
      });
    }, 40);
  }
  lista($('lista-art'), enRango(ART).slice(0, 10));
  lista($('lista-prov'), enRango(PROVL).slice(0, 10));
  barras($('categorias'), enRango(CATG).slice(0, 8).map(function(c){ return { n: c.n, v: c.v }; }), { k: true });
  barras($('sistemasGlob'), enRango(SISG).slice(0, 8).map(function(s){ return { n: s.n, v: s.v }; }), { k: true });
  barras($('gastosGlob'), enRango(GASTOS).slice(0, 8).map(function(g){ return { n: g.n, v: g.v }; }), { k: true });
  barras($('proyGlob'), enRango(PROYT).slice(0, 8).map(function(p){ return { n: p.n, v: p.v }; }), { k: true });
  txt('a-periodo', rotuloRango());
  txt('a-proy', rotuloSeleccion());
}

/* ══════════════════════════════════════════════════════════════════
   10 · EN VIVO
   ══════════════════════════════════════════════════════════════════ */
function pintarTicker(){
  if(!$('pista')) return;
  var its = [], totProy = totalR() || META.total;
  FASES.forEach(function(f){
    its.push('<span class="it"><b>' + esc(f.n) + '</b> US$ ' + fmtK(f.v)
      + ' <em>' + (f.v / totProy * 100).toFixed(1) + '%</em></span>');
  });
  FAM.slice(0, 5).forEach(function(f){
    /* el cph venia crudo y se leia US$ 56.22900611221473/H */
    its.push('<span class="it"><b>' + esc(f.n) + '</b> ' + fmt(f.eq)
      + ' EQUIPOS · US$ ' + f.cph.toFixed(1) + '/H</span>');
  });
  EQ.slice(0, 5).forEach(function(e){
    its.push('<span class="it"><b>' + esc(e.id) + '</b> ' + esc(e.mod || e.fam) + ' · US$ ' + fmtK(e.v) + '</span>');
  });
  var uno = its.join('');
  htm('pista', uno + uno);
}

var ACC = ['Salida de almacén','Conformidad de servicio','Imputación de horas','Devolución a almacén'];
function nuevoMovimiento(){
  var e = EQ[Math.floor(Math.random() * Math.min(EQ.length, 26))];
  var s = (e.sys && e.sys.length) ? e.sys[Math.floor(Math.random() * Math.min(e.sys.length, 9))]
        : { c: 'IN', n: 'INDIRECTOS' };
  var monto = Math.round((300 + Math.random() * Math.random() * 26000) / 10) * 10;
  var acc = ACC[Math.floor(Math.random() * (Math.random() < 0.7 ? 2 : ACC.length))];
  extra += monto; movHoy++;
  var f = $('flujo');
  if(f){
    var d = document.createElement('div');
    d.className = 'mov';
    d.innerHTML = '<span class="q"></span><span class="m"></span><span class="t"></span>';
    d.children[0].textContent = e.id + '  ' + s.c;
    d.children[1].textContent = 'US$ ' + fmt(monto);
    d.children[2].textContent = acc + ' — ' + s.n;
    f.insertBefore(d, f.firstChild);
    while(f.children.length > 34) f.removeChild(f.lastChild);
    f.scrollTop = 0;
  }
  pintarPulso();
}
function pintarPulso(){
  txt('p-mov', fmt(movHoy));
  txt('p-acum', 'US$ ' + fmtK(totalAnio() + extra));
  txt('p-acum-l', 'acumulado ' + anioEnCurso() + ' · ' + rotuloAnio() + ', con el flujo en curso');
  txt('p-cph', 'US$ ' + cphR().toFixed(1));
  txt('p-ot', fmt(otsRango().length));
}

/* ══════════════════════════════════════════════════════════════════
   11 · FICHA
   ══════════════════════════════════════════════════════════════════ */
function pintarFicha(){
  txt('fi-lin', fmt(META.nLin));
  txt('fi-rango', mesCorto(MESES[0]) + ' y ' + mesCorto(MESES[MESES.length - 1]));
  txt('fi-total', 'US$ ' + fmtK(META.total));
  txt('fi-hm', fmt(META.hm) + ' horas');
  txt('fi-det', fmt(META.nEqDet || 0) + ' equipos');
  var d = [
    { n: 'ASIENTOS CONTABLES', v: META.nLin },
    { n: 'EQUIPOS EN EL LIBRO', v: META.nEq },
    { n: 'EQUIPOS CON COSTO EN EL PERIODO', v: contarEquipos() },
    { n: 'EQUIPOS EN LA TABLA', v: EQ.length },
    { n: 'ÓRDENES CON DETALLE', v: META.nOT },
    { n: 'MESES DE OPERACIÓN', v: MESES.length }
  ];
  var el = $('fichaDatos');
  if(!el) return;
  var max = d[0].v;
  el.innerHTML = d.map(function(a){
    return '<div class="fase"><div class="nm">' + esc(a.n) + '</div>'
      + '<div class="via" style="--w:' + (a.v / max * 100).toFixed(1) + '%"><i></i></div>'
      + '<div class="vl">' + fmt(a.v) + '</div><div class="pc"></div></div>';
  }).join('');
  setTimeout(function(){
    Array.prototype.forEach.call(el.querySelectorAll('.via i'), function(i2){
      i2.style.width = i2.parentElement.style.getPropertyValue('--w');
    });
  }, 40);
}
