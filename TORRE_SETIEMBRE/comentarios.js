/* ══════════════════════════════════════════════════════════════════
   COMENTARIOS — la lista de todos, con el filtro con que se hicieron

   Lee HX_NOTAS (hojas.js: la base del artifact, o la copia y este
   navegador en GitHub). Cada comentario guarda su fila, su columna, el
   valor de la celda, el filtro (ctx) y su estado: pendiente o tratado.
   IR vuelve a poner ese filtro en Flota completa y abre la celda.
   ══════════════════════════════════════════════════════════════════ */
var CM = { ver: 'pendiente', busca: '' };

/* lo que dice la clave de un comentario viejo, sin filtro guardado:
   hoja . nodo [. flota [. proyectos] [. huella]] . columna */
function cmDeClave(k){
  var p = k.split('.'), x = { hoja: p[0], col: p[p.length - 1] };
  p.slice(2, -1).forEach(function(f){
    if(f === 'PRO' || f === 'ALQ' || f === 'TOD') x.flota = f === 'PRO' ? 'PROPIO' : f === 'ALQ' ? 'ALQUILADO' : '*';
    else if(f.charAt(0) !== 'r') x.sedes = f;
  });
  return x;
}
function cmLista(){
  var out = [], k;
  for(k in HX_NOTAS){
    var x = HX_NOTAS[k];
    if(!x || !x.texto) continue;
    var d = cmDeClave(k);
    out.push({ k: k, x: x, estado: x.estado === 'tratado' ? 'tratado' : 'pendiente',
               ctx: x.ctx || { hoja: d.hoja, flota: d.flota || '*', sedes: d.sedes || 'TODOS' } });
  }
  return out.sort(function(a, b){ return String(b.x.ts || '').localeCompare(String(a.x.ts || '')); });
}
function cmPintar(){
  var tabla = $('cm-tabla');
  if(!tabla) return;
  var todos = cmLista(), np = 0, nt = 0;
  todos.forEach(function(c){ if(c.estado === 'tratado') nt++; else np++; });
  htm('cm-cifras', '<div>PENDIENTES<b class="pend">' + np + '</b></div><div>TRATADOS<b>' + nt + '</b></div>'
    + '<div>EN TOTAL<b>' + todos.length + '</b></div>');
  htm('cm-ver', [['pendiente', 'PENDIENTES'], ['tratado', 'TRATADOS'], ['*', 'TODOS']].map(function(o){
    return '<button class="fbt" type="button" data-cmv="' + o[0] + '" aria-pressed="' + (CM.ver === o[0]) + '">' + o[1] + '</button>';
  }).join(''));
  var q = CM.busca.trim().toUpperCase();
  var xs = todos.filter(function(c){
    if(CM.ver !== '*' && c.estado !== CM.ver) return false;
    if(!q) return true;
    return (c.x.texto + ' ' + (c.x.fila || '') + ' ' + hxContextoTxt(c.ctx)).toUpperCase().indexOf(q) >= 0;
  });
  if(!xs.length){
    tabla.innerHTML = '<tbody><tr><td class="cmNada">' + (todos.length ? 'Ningún comentario con eso.'
      : 'Todavía no hay comentarios. Se hacen en Flota completa: clic en una cifra y COMENTAR ESTA CELDA.') + '</td></tr></tbody>';
  } else {
    tabla.innerHTML = '<thead><tr><th>ESTADO</th><th>DÓNDE</th><th>VALOR AL COMENTAR</th><th>FILTRO USADO</th>'
      + '<th>COMENTARIO</th><th>QUIÉN · CUÁNDO</th><th></th></tr></thead><tbody>'
      + xs.map(function(c){
          var x = c.x, ok = c.estado === 'tratado';
          return '<tr class="' + (ok ? 'tratado' : '') + '" data-ck="' + esc(c.k) + '">'
            + '<td><button type="button" class="cmEst' + (ok ? ' ok' : '') + '" data-cme="1" title="'
              + (ok ? 'Volver a ponerlo pendiente' : 'Marcarlo como tratado') + '">' + (ok ? '✓ TRATADO' : '● PENDIENTE') + '</button></td>'
            + '<td class="fil">' + esc(x.fila || c.k) + '</td>'
            + '<td class="val">' + esc(x.valor || '—') + '</td>'
            + '<td class="fil">' + esc(hxContextoTxt(c.ctx)) + '</td>'
            + '<td class="txt">' + esc(x.texto) + '</td>'
            + '<td class="quien"><span data-autor="' + esc(x.autor || '') + '"></span>' + esc(String(x.ts || '').slice(0, 16).replace('T', ' ')) + '</td>'
            + '<td>' + (x.nodo ? '<button type="button" class="cmIr" data-cmi="1" title="Poner este filtro en Flota completa y abrir la celda">IR ↗</button>' : '') + '</td>'
            + '</tr>';
        }).join('') + '</tbody>';
  }
  txt('cm-nota', hxDb ? 'Los comentarios y su estado se guardan en la página: los ve quien la abra.'
    : 'Sin la base del artifact (GitHub): los comentarios son una copia de los del artifact'
      + (HX_NOTAS_COPIA.fecha ? ' al ' + HX_NOTAS_COPIA.fecha.split('-').reverse().join('/') : '')
      + ', más lo escrito en este navegador.');
  /* el nombre de quien comento, si la pagina lo sabe */
  if(hxUser){
    var ids = [];
    Array.prototype.forEach.call(tabla.querySelectorAll('[data-autor]'), function(s){ var a = s.getAttribute('data-autor'); if(a && ids.indexOf(a) < 0) ids.push(a); });
    if(ids.length) hxUser.profiles(ids).then(function(ps){
      Array.prototype.forEach.call(tabla.querySelectorAll('[data-autor]'), function(s){
        var p = ps[s.getAttribute('data-autor')];
        if(p && p.name) s.textContent = p.name + ' · ';
      });
    }, function(){});
  }
}
/* pendiente <-> tratado */
function cmEstado(k){
  var x = HX_NOTAS[k];
  if(!x) return;
  var nuevo = {}, c;
  for(c in x) nuevo[c] = x[c];
  nuevo.estado = x.estado === 'tratado' ? 'pendiente' : 'tratado';
  if(hxDb){
    hxDb.collection('notas').doc(k).set(nuevo).then(function(){ HX_NOTAS[k] = nuevo; cmPintar(); }, function(){
      txt('cm-nota', 'No se pudo cambiar el estado: tu acceso a esta página puede ser de sólo lectura.');
    });
    return;
  }
  HX_NOTAS[k] = nuevo;
  hxGuardarLocal();
  cmPintar();
}
/* la fila de un comentario y las de arriba, para abrir la rama. Se busca
   por la clave del comentario y no por la de la fila: la misma familia
   lleva otra clave de fila bajo PROPIOS o ALQUILADOS (nivel FLOTA) */
function cmCamino(lista, k, col, arriba){
  for(var i = 0; i < lista.length; i++){
    var n = lista[i];
    if(n.k && hxClaveNota('T', n, col) === k) return { n: n, arriba: arriba };
    var r = cmCamino(n.hijos || [], k, col, arriba.concat([n.k]));
    if(r) return r;
  }
  return null;
}
/* vuelve a poner el filtro del comentario en Flota completa y abre su celda */
function cmIr(k){
  var x = HX_NOTAS[k], st = HX.T;
  if(!x || !x.nodo || !st || !st.arbol) return;
  var c = x.ctx || cmDeClave(k);
  if(c.flota && c.flota !== hxFlota(st)){ st.flota = c.flota; hxArbol('T'); }
  if(c.sedes){
    var quiero = c.sedes === 'TODOS' ? sedesL().slice() : c.sedes.split('+');
    var hay = todasLasSedes() ? sedesL() : sedeSel;
    if(quiero.join() !== hay.join()){ sedeSel = quiero; sedeCambio(); }
  }
  if('terD' in c){ st.terD = !!c.terD; st.terA = !!c.terA; }
  st.eleg = hxElegDe(c.eleg);
  st.filtros = c.filtros ? JSON.parse(JSON.stringify(c.filtros)) : {};
  st.busca = ''; var b = $('hx-buscar-T'); if(b) b.value = '';
  hxArbolVista(st);
  var hit = /^tot\|/.test(x.nodo) ? { n: hxNodoTotal(st), arriba: [] } : cmCamino(st.vista || st.arbol, k, x.col, []);
  /* un comentario de una rama PROPIOS hecho con TODA la flota: con el nivel
     FLOTA mas abajo, la fila esta con el filtro de esa flota */
  var fk = cmDeClave(k).flota;
  if(!hit && fk && fk !== '*' && fk !== hxFlota(st)){
    st.flota = fk; hxArbol('T'); hxArbolVista(st);
    hit = cmCamino(st.vista || st.arbol, k, x.col, []);
  }
  if(hit) hit.arriba.forEach(function(a){ st.ab[a] = 1; });
  var nk = hit ? hit.n.k : x.nodo;
  st.sel = { k: nk, col: x.col };
  hxBotones('T'); hxTabla('T');
  irA('v-toda');
  setTimeout(function(){
    var d = $('hx-origenD-T'); if(d) d.open = true;
    var tr = document.querySelector('#hx-tabla-T tr[data-k="' + String(nk).replace(/["\\]/g, '\\$&') + '"]');
    if(tr){ tr.scrollIntoView({ block: 'center' }); try { tr.focus({ preventScroll: true }); } catch(e){} }
  }, 90);
}
(function cmIniciar(){
  if(!$('v-notas')) return;
  esc_('cm-ver', 'click', function(ev){
    var b = ev.target.closest ? ev.target.closest('[data-cmv]') : null;
    if(!b) return;
    CM.ver = b.getAttribute('data-cmv'); cmPintar();
  });
  var t = null;
  esc_('cm-buscar', 'input', function(){ var v = this.value; clearTimeout(t); t = setTimeout(function(){ CM.busca = v; cmPintar(); }, 140); });
  esc_('cm-tabla', 'click', function(ev){
    var tr = ev.target.closest ? ev.target.closest('tr[data-ck]') : null;
    if(!tr) return;
    var k = tr.getAttribute('data-ck');
    if(ev.target.closest('[data-cme]')) cmEstado(k);
    else if(ev.target.closest('[data-cmi]')) cmIr(k);
  });
  cmPintar();
})();
