/* ══════════════════════════════════════════════════════════════════
   PROYECTOS — Shougang, Atocongo, Tarma y Tembladera en una sola torre

   Cada equipo es de un proyecto (e.sede: el libro del que salio; ningun
   codigo se repite entre proyectos). El filtro de proyecto es UNO solo
   para toda la torre, como los demas: se dibuja en la fila de filtros de
   cada pestana (cada copia es un grupo de botones con data-sede) y todas
   las copias se marcan juntas.

   Elegir: TODOS los junta. Con todos puestos, un clic en un proyecto deja
   solo ese; despues, cada clic suma o quita uno. Sin ninguno vuelven todos.

   Aqui se vuelven a declarar las funciones de la torre que recorren los
   equipos (la ultima declaracion dentro del cierre es la que vale):
   pasaEquipo, universo, construirListaEq y construirFiltros. Las hojas
   Propios y Alquilados filtran en hxArbol (hojas.js) y el Tablero sigue a
   esas hojas.
   ══════════════════════════════════════════════════════════════════ */
/* como funciones y no como variables: construirFiltros puede correr antes de
   que este archivo llegue a asignarlas */
function sedesL(){ return DATA.sedes || []; }
function sedeNomL(){ return DATA.sedeNom || {}; }
var sedeSel = sedesL().slice();
/* aplicarFiltros corre antes de llegar aqui: sin seleccion todavia, pasan todos */
function todasLasSedes(){ return !sedeSel || sedeSel.length >= sedesL().length; }
function sedeOk(s){ return todasLasSedes() || sedeSel.indexOf(s) >= 0; }
function nomSede(s){
  var n = sedeNomL()[s] || s;
  return n.charAt(0) + n.slice(1).toLowerCase();
}
function listaY(xs){ return xs.length > 1 ? xs.slice(0, -1).join(', ') + ' y ' + xs[xs.length - 1] : (xs[0] || ''); }
function rotuloSedes(largo){
  if(todasLasSedes()) return largo ? (sedesL().length === 1 ? nomSede(sedesL()[0]) : 'los ' + ['', '', 'dos', 'tres', 'cuatro', 'cinco'][sedesL().length] + ' proyectos') : 'TODOS LOS PROYECTOS';
  return largo ? listaY(sedeSel.map(nomSede)) : sedeSel.join(' + ');
}

/* ---------- las funciones de la torre, con el proyecto ---------- */
function pasaEquipo(e){
  return sedeOk(e.sede)
      && (eqFiltro === 'TODOS' || e.id === eqFiltro)
      && (famFiltro === 'TODAS' || e.fam === famFiltro)
      && (modFiltro === 'TODOS' || e.mod === modFiltro)
      && (provFiltro === 'TODOS' || e.prov === provFiltro)
      && (marcaFiltro === 'TODAS' || e.marca === marcaFiltro)
      && (clasifFiltro === 'TODAS' || e.clasif === clasifFiltro)
      && (tipoFiltro === 'TODOS' || e.tipo === tipoFiltro);
}
function universo(){
  var fam = [], mod = [], prov = [], marca = [], clasif = [], tipo = [];
  TODOS.forEach(function(e){
    if(!sedeOk(e.sede)) return;
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
function construirListaEq(){
  var dl = $('listaEq');
  if(!dl) return;
  var marca = proyFiltro + '|' + TODOS.length + '|' + (sedeSel || []).join();
  if(dl.getAttribute('data-marca') === marca) return;
  dl.setAttribute('data-marca', marca);
  dl.innerHTML = TODOS.filter(function(e){
    return sedeOk(e.sede) && (proyFiltro === 'TODOS' || e.proys.indexOf(proyFiltro) >= 0);
  }).map(function(e){
    return '<option value="' + esc(e.id) + '">' + esc(e.mod || e.fam) + '</option>';
  }).join('');
}
/* los filtros de flota de Tendencia (3) y Equipo (5), con el proyecto delante */
function construirFiltros(suf){
  suf = suf || '';
  var cont = $('filtrosEq' + suf);
  if(!cont || cont.getAttribute('data-listo')) return;
  cont.setAttribute('data-listo', '1');
  cont.innerHTML = sedeGrupo('fl')
    + '<label class="fl">PROPIO / ALQUILADO<select id="fTipoP' + suf + '"></select></label>'
    + '<label class="fl">FLOTA / FAMILIA<select id="fFam' + suf + '"></select></label>'
    + '<label class="fl">MODELO<select id="fMod' + suf + '"></select></label>'
    + '<label class="fl">PROVEEDOR<select id="fProv' + suf + '"></select></label>'
    + '<button class="fbt" id="fLimpia' + suf + '">LIMPIAR</button>';
  refrescarFiltros();
  marcarSedes();
  esc_('fTipoP' + suf, 'change', function(){ ponerFiltroEq('tipo', this.value); });
  esc_('fFam' + suf, 'change', function(){ ponerFiltroEq('fam', this.value); });
  esc_('fMod' + suf, 'change', function(){ ponerFiltroEq('mod', this.value); });
  esc_('fProv' + suf, 'change', function(){ ponerFiltroEq('prov', this.value); });
  esc_('fLimpia' + suf, 'click', function(){ ponerFiltroEq('limpiar'); });
}

/* ---------- el grupo de botones ----------
   Con siglas para que quepa en la fila de cada pestana; el nombre entero
   va en el globo de ayuda. clase: 'fl' (fila de desplegables) o 'gc'
   (fila de botones de Propios, Alquilados y Tablero). */
function sedeBotones(){
  return '<span class="gcB sedeB" role="group" aria-label="Proyecto">'
    + ['*'].concat(sedesL()).map(function(s){
        return '<button class="fbt" type="button" data-sede="' + esc(s) + '" aria-pressed="false" title="'
          + esc(s === '*' ? 'Todos los proyectos juntos'
                          : nomSede(s) + ' · con todos puestos deja solo este; después cada clic suma o quita un proyecto')
          + '">' + esc(s === '*' ? 'TODOS' : s) + '</button>';
      }).join('') + '</span>';
}
function sedeGrupo(clase){
  if(sedesL().length < 2) return '';
  return clase === 'fl' ? '<div class="fl sedeF">PROYECTO' + sedeBotones() + '</div>'
                        : '<div class="sedeF"><span class="gcT">PROYECTO</span>' + sedeBotones() + '</div>';
}
function marcarSedes(){
  var todas = todasLasSedes();
  Array.prototype.forEach.call(document.querySelectorAll('[data-sede]'), function(b){
    var s = b.getAttribute('data-sede');
    b.setAttribute('aria-pressed', s === '*' ? todas : (!todas && sedeSel.indexOf(s) >= 0));
  });
}
function ponerSede(s){
  if(s === '*') sedeSel = sedesL().slice();
  else if(todasLasSedes()) sedeSel = [s];
  else {
    var i = sedeSel.indexOf(s);
    if(i >= 0) sedeSel.splice(i, 1); else sedeSel.push(s);
    if(!sedeSel.length) sedeSel = sedesL().slice();
    sedeSel.sort(function(a, b){ return sedesL().indexOf(a) - sedesL().indexOf(b); });
  }
  sedeCambio();
}
document.addEventListener('click', function(ev){
  var b = ev.target.closest ? ev.target.closest('[data-sede]') : null;
  if(!b) return;
  ev.preventDefault();
  ponerSede(b.getAttribute('data-sede'));
});

/* ---------- lo que cambia con el proyecto ---------- */
function sedeCambio(){
  marcarSedes();
  /* un equipo elegido de otro proyecto se suelta */
  if(eqFiltro !== 'TODOS'){
    var e = null;
    TODOS.forEach(function(x){ if(x.id === eqFiltro) e = x; });
    if(e && !sedeOk(e.sede)) eqFiltro = 'TODOS';
  }
  rehacerTodo();
  sedeHojas();
  sedeMontos();
  sedeTextos();
}
/* Propios y Alquilados se rearman con los equipos del proyecto; el Tablero
   las sigue. Lo desplegado y los filtros por valor se conservan. */
function sedeHojas(){
  HX_HOJAS.forEach(function(s){
    var st = HX[s];
    if(!st || !st.arbol) return;
    hxArbol(s);
    st.sel = null;
    hxPodarEleccion(st, -1);
    hxBotones(s); hxTabla(s);
    hxBarraOrigen(s);
  });
  if($('tb-cuerpo') && typeof tbOpciones === 'function' && HX.P.arbol){ tbOpciones(); tbPintar(); }
}
/* los importes de las fichas de Inicio siguen al proyecto: alcance, tipo
   de flota (resultado operativo) y cada proyecto (sin el filtro de proyecto) */
function sedeMontos(){
  var porAlc = {}, porTipo = {}, porSede = {}, todo = 0, ro = 0;
  var Fe = F.e, Fp = F.p, Fv = F.v, j, n;
  for(j = 0, n = Fv.length; j < n; j++){
    var e = TODOS[Fe[j]], v = Fv[j];
    if(Fp[j] === 0) porSede[e.sede] = (porSede[e.sede] || 0) + v;
    if(!sedeOk(e.sede)) continue;
    todo += v;
    porAlc[PROYS[Fp[j]]] = (porAlc[PROYS[Fp[j]]] || 0) + v;
    if(Fp[j] === 0){ ro += v; porTipo[e.tipo] = (porTipo[e.tipo] || 0) + v; }
  }
  var pon = function(cont, attr, f){
    if(!cont) return;
    Array.prototype.forEach.call(cont.querySelectorAll('.pchip'), function(b){
      var sm = b.querySelector('small');
      if(sm) sm.textContent = 'US$ ' + fmtK(f(b.getAttribute(attr)));
    });
  };
  pon($('filtroProy'), 'data-p', function(p){ return p === 'TODOS' ? todo : (porAlc[p] || 0); });
  pon($('filtroTipo'), 'data-t', function(t){ return t === 'TODOS' ? ro : (porTipo[t] || 0); });
  var tot = 0, k;
  for(k in porSede) tot += porSede[k];
  pon($('filtroSede'), 'data-sede', function(s){ return s === '*' ? tot : (porSede[s] || 0); });
}
/* los rotulos que nombran al proyecto */
function sedeTextos(){
  var rot = document.querySelector('.nav .rot i');
  if(rot) rot.textContent = (todasLasSedes() && sedesL().length > 1 ? sedesL().length + ' proyectos' : rotuloSedes(true)) + ' · setiembre 2026';
  var lema = document.querySelector('#v-inicio .lemaGr em');
  if(lema) lema.textContent = rotuloSedes(true);
  var hojaDe = function(suf){
    var ss = todasLasSedes() ? sedesL() : sedeSel;
    return ss.length === 1 ? ss[0] + suf : (ss.length === sedesL().length ? 'LAS HOJAS' + suf : ss.map(function(s){ return s + suf; }).join(' + '));
  };
  txt('hx-como-P', 'FLOTA PROPIA · COMO ' + hojaDe(' PROP'));
  txt('hx-como-A', 'FLOTA ALQUILADA · COMO ' + hojaDe(' ALQ'));
  txt('hx-como-T', 'FLOTA COMPLETA · ' + (todasLasSedes() ? 'LAS HOJAS PROP Y ALQ JUNTAS' : sedeSel.join(' + ') + ' · PROP Y ALQ JUNTAS'));
}

/* ---------- los grupos en cada pestana ---------- */
(function sedeIniciar(){
  if(sedesL().length < 2) return;
  /* Inicio: una fila de fichas propia, encima de la de alcance, con lo que
     cada proyecto lleva en el resultado operativo */
  var fp = $('filtroProy');
  if(fp && !$('filtroSede')){
    var d = document.createElement('div');
    d.className = 'filtroProy sedeIni'; d.id = 'filtroSede';
    d.setAttribute('role', 'group'); d.setAttribute('aria-label', 'Proyecto');
    d.innerHTML = ['*'].concat(sedesL()).map(function(s){
      return '<button class="pchip" type="button" data-sede="' + esc(s) + '" aria-pressed="false"'
        + (s === '*' ? '' : ' title="' + esc(nomSede(s)) + '"') + '><b>'
        + esc(s === '*' ? 'TODOS LOS PROYECTOS' : (sedeNomL()[s] || s)) + '</b><small></small></button>';
    }).join('');
    fp.parentNode.insertBefore(d, fp);
  }
  /* Propios, Alquilados y Tablero traen su hueco en el html */
  Array.prototype.forEach.call(document.querySelectorAll('.sedeHueco'), function(h){
    h.outerHTML = sedeGrupo(h.getAttribute('data-clase') || 'gc');
  });
  /* Filtros: delante de propio / alquilado */
  var ft = $('fTipo'), pf = ft && ft.closest ? ft.closest('.panelF') : null;
  if(pf && !pf.querySelector('[data-sede]')) pf.insertAdjacentHTML('afterbegin', sedeGrupo('fl'));
  /* En vivo: debajo del titulo */
  var tv = document.querySelector('#v-vivo .tituloV');
  if(tv && !document.querySelector('#v-vivo [data-sede]')) tv.insertAdjacentHTML('beforeend', '<div class="sedeVivo">' + sedeGrupo('gc') + '</div>');
  marcarSedes();
  sedeMontos();
  sedeTextos();
})();
