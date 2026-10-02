/* ══════════════════════════════════════════════════════════════════
   TELEFONO Y TABLETA (movil.html tiene los estilos)
   ══════════════════════════════════════════════════════════════════ */

/* En el telefono vertical la cabecera se come la pantalla: al bajar la
   pagina se aparta la identidad y quedan las pestanas; al volver arriba se
   pone de nuevo. Dos umbrales distintos para que no parpadee en el borde. */
(function navMovil(){
  if(!window.matchMedia) return;
  var angosto = window.matchMedia('(max-width:620px)');
  var min = false;
  var mirar = function(){
    var poner = angosto.matches && !document.body.classList.contains('dividida') &&
                (min ? window.scrollY > 8 : window.scrollY > 90);
    if(poner === min) return;
    min = poner;
    document.body.classList.toggle('navMin', min);
    requestAnimationFrame(hxAjustarAlto);
  };
  window.addEventListener('scroll', mirar, { passive: true });
  window.addEventListener('resize', mirar);
  mirar();
})();

/* «Solo la tabla»: la tabla de Propios o Alquilados a toda la pantalla,
   con una barra para volver. Para el telefono (mejor girado) y la tableta. */
function hxMaxi(s, poner){
  var v = $(hxSeccion(s));
  if(!v) return;
  if(poner === undefined) poner = !v.classList.contains('xlMaxi');
  v.classList.toggle('xlMaxi', poner);
  document.body.classList.toggle('xlMaxiOn', !!document.querySelector('.hojaXl.xlMaxi'));
  var b = v.querySelector('.xlMaxBtn');
  if(b) b.setAttribute('aria-pressed', poner);
  var foco = poner ? v.querySelector('.xlMaxSalir') : b;
  if(foco) try { foco.focus({ preventScroll: true }); } catch(e){ foco.focus(); }
}
document.addEventListener('click', function(ev){
  var b = ev.target.closest && ev.target.closest('.xlMaxBtn,.xlMaxSalir');
  if(b){ hxMaxi(b.getAttribute('data-s'), b.classList.contains('xlMaxSalir') ? false : undefined); return; }
  /* el boton TABLERO de una fila lleva a otra pestana: la hoja deja de verse
     y no puede quedar puesta a toda pantalla */
  requestAnimationFrame(function(){
    HX_HOJAS.forEach(function(s){
      var v = $(hxSeccion(s));
      if(v && v.classList.contains('xlMaxi') && !v.classList.contains('on')) hxMaxi(s, false);
    });
  });
});
document.addEventListener('keydown', function(ev){
  if(ev.key !== 'Escape' || !document.body.classList.contains('xlMaxiOn')) return;
  /* Esc cierra primero la ventanita que este abierta (filtro, eleccion, comentario) */
  if(ev.target.closest && ev.target.closest('.xlFiltroPop,.xlEditor')) return;
  if(document.querySelector('.xlFiltroPop:not([hidden]),.xlEditor:not([hidden])')) return;
  HX_HOJAS.forEach(function(s){ hxMaxi(s, false); });
});
