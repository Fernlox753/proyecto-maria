/* ══════════════════════════════════════════════════════════════════
   11 · contadores animados
   ══════════════════════════════════════════════════════════════════ */
var contadores = [];
function contar(el, destino, dec, suf, pre){
  if(!el) return;
  var texto = (pre||'') + (dec ? destino.toFixed(dec) : fmt(destino)) + (suf||'');
  if(REDUCIR){ el.textContent = texto; return; }   /* sin movimiento: la cifra ya esta */
  /* Si este hueco ya estaba contando se reemplaza. Antes cada repintado
     apilaba un contador nuevo: se peleaban por el mismo elemento y la
     lista crecia sin fin, asi que la cifra tardaba en asentarse. */
  for(var j = contadores.length - 1; j >= 0; j--){
    if(contadores[j].el === el) contadores.splice(j, 1);
  }
  contadores.push({ el:el, b:destino, t:0, dec:dec||0, suf:suf||'', pre:pre||'' });
}
function pasoContadores(dt){
  var activos = false;
  for(var i = contadores.length - 1; i >= 0; i--){
    var c = contadores[i];
    c.t = Math.min(1, c.t + dt/1500);
    var p = 1 - Math.pow(1 - c.t, 3);
    var v = c.b * p;
    c.el.textContent = c.pre + (c.dec ? v.toFixed(c.dec) : fmt(v)) + c.suf;
    if(c.t >= 1) contadores.splice(i, 1); else activos = true;
  }
  return activos;
}

