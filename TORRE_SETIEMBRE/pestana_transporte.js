/* ══════════════════════════════════════════════════════════════════
   PESTAÑA 08 TRANSPORTE — el alto del marco (pestana_transporte.html)

   La página de transporte avisa su alto cada vez que cambia (al abrir o
   cerrar el árbol) y el marco toma ese alto: así hay una sola barra de
   desplazamiento, la de la torre. Solo se le cree a ese marco y a un
   número razonable; cualquier otro mensaje se ignora.
   ══════════════════════════════════════════════════════════════════ */
(function marcoTransporte(){
  var marco = $('marco-transporte');
  if(!marco) return;
  window.addEventListener('message', function(ev){
    var d = ev.data;
    if(ev.source !== marco.contentWindow || !d || d.tipo !== 'transporte-altura') return;
    var alto = Number(d.alto);
    if(!isFinite(alto) || alto < 200 || alto > 40000) return;
    marco.style.height = Math.ceil(alto) + 'px';
  });
})();
