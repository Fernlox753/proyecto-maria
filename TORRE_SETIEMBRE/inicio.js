/* ══════════════════════════════════════════════════════════════════
   INICIO — los filtros en una barra que se despliega (inicio.html)

   Para que el inicio se vea limpio, las fichas de proyecto, alcance,
   flota y tipo de costo van guardadas detras de la barra FILTROS: cerrada
   dice en una linea lo que esta puesto; con la flecha se abren de
   izquierda a derecha. Siempre abre cerrada. Va despues de proyecto.js,
   que es quien pone la fila de proyectos (filtroSede).
   ══════════════════════════════════════════════════════════════════ */
(function iniFiltros(){
  var v = $('v-inicio');
  var piezas = ['filtroSede', 'filtroProy', 'filtroTipo'].map(function(id){ return $(id); }).filter(Boolean);
  if(!v || !piezas.length) return;
  [v.querySelector('.filtros2'), $('activosEq'), $('filtroProyPie')].forEach(function(x){ if(x) piezas.push(x); });

  var barra = document.createElement('div');
  barra.className = 'iniFil'; barra.id = 'iniFil';
  barra.innerHTML = '<button type="button" class="iniFilBtn" id="iniFilBtn" aria-expanded="false" aria-controls="iniFilCaja"'
    + ' title="Ver y cambiar los filtros"><span class="fl" aria-hidden="true">❯</span>FILTROS</button>'
    + '<span class="iniFilRes" id="iniFilRes" aria-live="polite"></span>';
  var caja = document.createElement('div');
  caja.className = 'iniFilCaja'; caja.id = 'iniFilCaja';
  var dentro = document.createElement('div');
  caja.appendChild(dentro);
  piezas[0].parentNode.insertBefore(barra, piezas[0]);
  barra.parentNode.insertBefore(caja, barra.nextSibling);
  piezas.forEach(function(x){ dentro.appendChild(x); });

  /* cerrada, la barra dice lo elegido en cada fila */
  var elegidos = function(id){
    return Array.prototype.map.call(document.querySelectorAll('#' + id + ' .pchip[aria-pressed="true"] b'), function(b){
      return b.textContent.trim();
    }).join(' + ');
  };
  var resumen = function(){
    var p = [elegidos('filtroSede'), elegidos('filtroProy'), elegidos('filtroTipo')];
    var ro = $('roRotulo');
    if(ro) p.push(ro.textContent.trim());
    var act = $('activosEq');
    if(act && !act.hidden) p.push('+ FILTROS DE LA PESTAÑA FILTROS');
    htm('iniFilRes', p.filter(Boolean).map(function(x){ return '<b>' + esc(x) + '</b>'; }).join('<i>·</i>'));
  };
  resumen();
  if(window.MutationObserver) new MutationObserver(resumen).observe(dentro, {
    subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['aria-pressed', 'hidden'] });

  var t = null;
  var abrir = function(si){
    clearTimeout(t);
    if(si){
      caja.classList.add('ab'); barra.classList.add('ab');
      /* al terminar de entrar ya no se recorta (el desplegable de tipo de costo) */
      t = setTimeout(function(){ caja.classList.add('fin'); }, 620);
    } else {
      /* se vuelve a recortar antes de cerrar, para que salga de derecha a izquierda */
      caja.classList.remove('fin');
      void caja.offsetWidth;
      caja.classList.remove('ab'); barra.classList.remove('ab');
    }
    $('iniFilBtn').setAttribute('aria-expanded', si);
  };
  $('iniFilBtn').addEventListener('click', function(){ abrir(!caja.classList.contains('ab')); });
})();
