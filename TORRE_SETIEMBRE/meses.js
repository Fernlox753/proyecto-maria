/* ══════════════════════════════════════════════════════════════════
   MESES — el interruptor de Tendencia: SETIEMBRE | JUL – SET

   Va en la linea del titulo de Tendencia. La torre abre con setiembre, como siempre. JUL – SET recarga la pagina
   con julio y agosto sumados a DATA (meses_carga.js): toda la torre pasa a
   los 92 dias y el periodo se elige como siempre; en Tendencia el eje abre
   POR MES. SETIEMBRE vuelve a la torre de siempre. La eleccion dura lo que
   la pestana del navegador (sessionStorage) y vuelve a Tendencia al recargar.
   Va despues de nuevo_js_nav.js: necesita irA() y la pestana armada.
   ══════════════════════════════════════════════════════════════════ */
function mesesUniverso(u){
  if(u === MODO_MESES) return;
  try {
    sessionStorage.setItem('torreSet.universo', u);
    sessionStorage.setItem('torreSet.volverA', 'v-costos');
  } catch(e){}
  /* sin sessionStorage, el universo viaja en el hash */
  try { location.hash = u === 'tres' ? 'tresmeses' : ''; } catch(e){}
  location.reload();
}
(function mesesIniciar(){
  if(typeof TRES_MESES === 'undefined') return;
  var tres = MODO_MESES === 'tres';
  /* en la linea del titulo, a la derecha: ahi sobra lugar y la fila de
     controles del grafico sigue entera */
  var gc = document.querySelector('#v-costos .tituloV');
  if(gc && !$('g-universo')){
    var d = document.createElement('div');
    d.className = 'gcMeses';
    d.innerHTML = '<span class="gcT">MESES</span><div class="gcB" id="g-universo" role="group" aria-label="Meses">'
      + '<button class="fbt" type="button" data-u="set" aria-pressed="' + !tres + '" title="Sólo setiembre, la torre de siempre">SETIEMBRE</button>'
      + '<button class="fbt" type="button" data-u="tres" aria-pressed="' + tres + '" title="' + esc(MESES_ROT_TRES)
      + ' juntos, para ver cómo se mueve entre meses (recarga la página; toda la torre pasa a los tres meses)">JUL – SET</button></div>';
    gc.appendChild(d);
    d.addEventListener('click', function(ev){
      var b = ev.target.closest ? ev.target.closest('[data-u]') : null;
      if(b) mesesUniverso(b.getAttribute('data-u'));
    });
  }
  /* al recargar, de vuelta a Tendencia */
  var ir = '';
  try { ir = sessionStorage.getItem('torreSet.volverA') || ''; sessionStorage.removeItem('torreSet.volverA'); } catch(e){}
  if(ir && $(ir)) setTimeout(function(){ irA(ir); }, 0);
  if(!tres) return;
  /* los rotulos que dicen el mes */
  var lema = $('lemaSub');
  if(lema) Array.prototype.forEach.call(lema.childNodes, function(n){
    if(n.nodeType === 3 && /SETIEMBRE 2026/.test(n.nodeValue)) n.nodeValue = n.nodeValue.replace('SETIEMBRE 2026', MESES_ROT_TRES.toUpperCase());
  });
  document.body.classList.add('tresMeses');
})();
