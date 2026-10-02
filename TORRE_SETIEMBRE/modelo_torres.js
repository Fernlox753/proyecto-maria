/* ══════════════════════════════════════════════════════════════════
   TORRES DE ILUMINACION — modelos de detalle (unas 80 unidades alquiladas)

   Todas son lo mismo en esencia: un remolque de un eje con lanza y gato,
   cuatro patas estabilizadoras, una carcasa con motor diesel y generador, y
   un mastil telescopico vertical con cuatro reflectores. Aqui se muestran
   trabajando: mastil arriba, patas abajo, lamparas encendidas y la puerta
   de servicio abierta para que se vea el grupo electrogeno (motor, generador,
   radiador, bateria), que es donde cae el costo de mantenimiento.

   Medidas de las hojas del fabricante (los numeros entre parentesis son los
   que se usan; lo que no esta acotado se midio sobre los dibujos y fotos):
     Terex RL4 (RL4, RL4J, RL4V2): mastil 7.13 m (hoja CE 2019), largo total
       2.95, largo plegado 2.16, ancho 1.50, trocha 1.24, trocha interior 1.09,
       alto de gabinete 1.22, patas 3.25 entre ejes y 3.45 por fuera,
       llantas de 13", 4 x 1000 W halogenuro metalico de caja cuadrada.
     Doosan LSC: largo con lanza 4.255, ancho con guardafangos 1.245,
       trocha 1.067, alto de viaje 1.763, torre de 9 m galvanizada,
       4 x 1000 W halogenuro metalico. Abertura de las patas: supuesta 2.6 m.
     Atlas Copco HiLight V5+: 2.90 x 2.31 x 7.54 trabajando, 1.95 x 1.10 x 2.50
       en viaje, mastil 7.5 m de 5 tramos, 4 x 350 W LED, llantas 155R13,
       carcasa HardHat de polietileno con puerta que se levanta.
     Generac GLT4-M: 1.656 x 1.264 x 2.433 minimo, 2.756 x 2.193 x 7.20
       maximo, 4 x 320 W LED.
     Generac VTevo K2: 2.48 x 1.31 x 2.45 minimo, 2.48 x 2.40 x 8.0 maximo,
       4 x 320 W LED, carcasa angosta con chaflanes arriba.
     LuxTower LUX M11: 1.78 x 1.38 x 2.60 minimo, 2.41 x 2.52 x 8.0 maximo
       (hoja de LuxTower; algunos distribuidores dicen 9 m), carcasa 1.404 de
       largo y 1.346 de alto (dibujo acotado), 4 x 320 W LED.

   Ejes: frente (la lanza) hacia -X, arriba +Y, la izquierda +Z. El mastil va
   en la punta de la lanza, delante de la carcasa, como en todas las fotos.
   La puerta abierta va del lado derecho (-Z), el que se ve en la vista de
   tres cuartos; del lado izquierdo, los rotulos completos.

   Codigos SAP: lamparas LSM, motor ENG1, generador AL1, radiador RAD1,
   bateria BAT, controlador EC, tablero de interruptores y tomas TAB, tanque
   de combustible (la batea bajo la carcasa) TQC1, chasis y lanza 42023615,
   llantas LL1 (izquierda) y LL2 (derecha). El mastil no tiene codigo.
   ══════════════════════════════════════════════════════════════════ */
var TOR_NEGRO = '#1A1C1F', TOR_GALV = '#BCC3C9', TOR_GALV2 = '#99A1A8', TOR_GOMA = '#141619', TOR_FORRO = '#2C2F33';

/* ═══ geometria y piezas sueltas ═══ */

/* color de marca (sRGB, como se ve en la foto) al lineal con que trabaja el material */
/* el paso de sRGB a lineal ahora lo hace cambiarModelo3d para todos los
   modelos registrados: aqui ya no se convierte (se convertiria dos veces) */
function torLin(hex){ return hex; }

/* caja con todas las aristas redondeadas: el contorno en planta lleva un
   arco minimo para que el bisel tambien redondee las aristas a lo largo de Z
   (con el rectangulo de esquinas vivas de geoCajaB esas quedan vivas) */
function torGeoRed(w, h, d, r){
  r = Math.max(0.004, Math.min(r, w / 2 - 0.003, h / 2 - 0.003, d / 2 - 0.003));
  var a = w / 2 - r, b = h / 2 - r, e = Math.max(0.0015, Math.min(0.01, a * 0.3, b * 0.3));
  var sh = new THREE.Shape();
  sh.moveTo(-a + e, -b);
  sh.lineTo(a - e, -b); sh.absarc(a - e, -b + e, e, -Math.PI / 2, 0, false);
  sh.lineTo(a, b - e); sh.absarc(a - e, b - e, e, 0, Math.PI / 2, false);
  sh.lineTo(-a + e, b); sh.absarc(-a + e, b - e, e, Math.PI / 2, Math.PI, false);
  sh.lineTo(-a, -b + e); sh.absarc(-a + e, -b + e, e, Math.PI, Math.PI * 1.5, false);
  var g = new THREE.ExtrudeGeometry(sh, { depth: Math.max(0.001, d - 2 * r), bevelEnabled: true,
    bevelThickness: r, bevelSize: r, bevelSegments: 4, curveSegments: 3 });
  g.translate(0, 0, -(d - 2 * r) / 2);
  return g;
}

/* saca una malla del grupo principal y la cuelga de un subgrupo (puerta,
   lampara, tablero); la posicion que tenia pasa a ser local al subgrupo */
function torMete(G, grp, m){ G.remove(m); grp.add(m); return m; }

/* viga de seccion rectangular entre dos puntos cualesquiera */
function torViga(D, code, a, b, ancho, alto, tipo, hex, r){
  var va = new THREE.Vector3(a[0], a[1], a[2]), vb = new THREE.Vector3(b[0], b[1], b[2]);
  var dir = vb.clone().sub(va), L = dir.length();
  var m = D.bloque(code, L, alto, ancho, tipo, hex, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, r === undefined ? 0.008 : r);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir.normalize());
  return m;
}

/* calcomania: plano con transparencia pegado a una cara */
function torCalco(G, tex, w, h, x, y, z, rx, ry, rz, opaco){
  var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, transparent: !opaco,
    roughness: 0.42, metalness: 0.02, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
  m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, rz || 0);
  m.receiveShadow = true;
  G.add(m);
  return m;
}

/* tramo de la carcasa: perfil (z,y) extruido a lo largo, con las esquinas de
   arriba redondeadas ('red') o achaflanadas ('chaflan') solo donde el tramo
   toca el costado y el techo; asi los tramos de la puerta calzan entre si */
function torSeg(D, F, code, hex, x0, x1, y0, y1, z0, z1, tipo){
  var k = F.k, W2 = F.W / 2, pts = [[z0, y0], [z1, y0]];
  var arriba = y1 >= F.y1 - 0.001;
  var esq = function(cz, cy, a0, a1){
    for(var i = 0; i <= 6; i++){ var t = a0 + (a1 - a0) * i / 6; pts.push([cz + k * Math.cos(t), cy + k * Math.sin(t)]); }
  };
  if(F.forma === 'chaflan'){
    if(arriba && z1 >= W2 - 0.001){ pts.push([z1, y1 - k]); pts.push([z1 - k, y1]); } else pts.push([z1, y1]);
    if(arriba && z0 <= -W2 + 0.001){ pts.push([z0 + k, y1]); pts.push([z0, y1 - k]); } else pts.push([z0, y1]);
  } else {
    if(arriba && z1 >= W2 - 0.001) esq(z1 - k, y1 - k, 0, Math.PI / 2); else pts.push([z1, y1]);
    if(arriba && z0 <= -W2 + 0.001) esq(z0 + k, y1 - k, Math.PI / 2, Math.PI); else pts.push([z0, y1]);
  }
  return D.perfilX(code, pts, x1 - x0, (x0 + x1) / 2, tipo || 'pintura', hex, F.r || 0.02);
}

/* rejilla de lamas en un costado (cara que mira a +Z con s = 1, a -Z con s = -1) */
function torLamasZ(D, x0, x1, y0, y1, z, s, n, hexMarco, hexLama){
  D.bloque(null, x1 - x0 + 0.06, y1 - y0 + 0.06, 0.016, 'pintura', hexMarco, (x0 + x1) / 2, (y0 + y1) / 2, z + s * 0.004, 0.006);
  D.bloque(null, x1 - x0, y1 - y0, 0.01, 'mate', '#121416', (x0 + x1) / 2, (y0 + y1) / 2, z + s * 0.011, 0.003);
  var paso = (y1 - y0) / n;
  for(var i = 0; i < n; i++){
    D.bloque(null, x1 - x0 - 0.01, paso * 0.86, 0.012, 'pintura', hexLama, (x0 + x1) / 2, y0 + paso * (i + 0.5), z + s * 0.026, 0.004, [s * 0.75, 0, 0]);
  }
}

/* ═══ rotulos dibujados ═══ */
function torDibTerex(g, w, h){
  var s = h * 0.78, y0 = (h - s) / 2, x0 = h * 0.05, ew = s * 1.2;
  g.fillStyle = '#D0102C'; g.fillRect(x0, y0, ew, s);
  /* la corona blanca de tres puntas del emblema */
  var a = x0 + ew * 0.13, b = x0 + ew * 0.87, yb = y0 + s * 0.80, yt = y0 + s * 0.18, ym = y0 + s * 0.50;
  g.fillStyle = '#FFFFFF';
  g.beginPath(); g.moveTo(a, yb); g.lineTo(a, yt); g.lineTo(a + (b - a) * 0.25, ym); g.lineTo(a + (b - a) * 0.5, yt);
  g.lineTo(a + (b - a) * 0.75, ym); g.lineTo(b, yt); g.lineTo(b, yb); g.closePath(); g.fill();
  g.fillStyle = '#D0102C'; g.fillRect(a, y0 + s * 0.60, b - a, s * 0.07);
  g.fillStyle = '#131416'; g.textBaseline = 'middle'; g.textAlign = 'left';
  g.font = 'bold ' + Math.round(h * 0.78) + 'px "Arial Black", Arial, sans-serif';
  var xt = x0 + ew + h * 0.16;
  g.fillText('TEREX', xt, h * 0.54, w - xt - h * 0.22);
  g.font = 'bold ' + Math.round(h * 0.16) + 'px Arial'; g.fillText('®', w - h * 0.2, h * 0.22);
}
function torDibRL4(g, w, h){
  g.textBaseline = 'middle'; g.textAlign = 'left';
  g.font = 'bold ' + Math.round(h * 0.80) + 'px "Arial Black", Arial, sans-serif';
  g.fillStyle = '#131416'; g.fillText('RL', w * 0.06, h * 0.55);
  var x = w * 0.06 + g.measureText('RL').width;
  g.fillStyle = '#D0102C'; g.fillText('4', x + w * 0.02, h * 0.55);
  g.fillStyle = '#131416'; g.font = 'bold ' + Math.round(h * 0.22) + 'px Arial'; g.fillText('TM', x - w * 0.02, h * 0.16);
}
function torDibDoosan(g, w, h){
  g.save(); g.setTransform(1, 0, -0.22, 1, h * 0.25, 0);
  g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  g.fillStyle = '#1D2A55'; g.font = 'italic bold ' + Math.round(h * 0.30) + 'px Arial, sans-serif';
  g.fillText('LSC', w * 0.04, h * 0.32);
  g.fillStyle = '#2A6EC2'; g.fillRect(w * 0.04, h * 0.38, w * 0.22, h * 0.05);
  g.fillStyle = '#1A1E29'; g.font = 'italic 900 ' + Math.round(h * 0.44) + 'px "Arial Black", Arial, sans-serif';
  g.fillText('DOOSAN', w * 0.04, h * 0.88, w * 0.86);
  g.restore();
}
function torDibDoosanMastil(g, w, h){
  g.save(); g.setTransform(1, 0, -0.2, 1, h * 0.2, 0);
  g.fillStyle = '#16181C'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'italic 900 ' + Math.round(h * 0.80) + 'px "Arial Black", Arial, sans-serif';
  g.fillText('DOOSAN', w / 2, h * 0.54, w * 0.92);
  g.restore();
}
/* rejilla de agujeros cuadrados sobre la chapa del color de la carcasa */
function torDibRejilla(hex){
  return function(g, w, h){
    g.fillStyle = hex; g.fillRect(0, 0, w, h);
    g.fillStyle = '#17191B';
    for(var y = 8; y < h - 8; y += 14) for(var x = 8; x < w - 8; x += 14) g.fillRect(x, y, 10, 10);
  };
}
function torDibAtlas(g, w, h){
  g.fillStyle = '#3A3F44'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#0A9BD7'; g.fillRect(w * 0.90, 0, w * 0.10, h);
  var bx = w * 0.07, by = h * 0.30, bw = w * 0.76, bh = h * 0.40;
  g.fillStyle = '#0B8CC8'; g.fillRect(bx, by, bw, bh);
  g.fillStyle = '#FFFFFF';
  g.fillRect(bx + bw * 0.06, by + bh * 0.13, bw * 0.88, bh * 0.07); g.fillRect(bx + bw * 0.06, by + bh * 0.80, bw * 0.88, bh * 0.07);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'italic bold ' + Math.round(bh * 0.40) + 'px Georgia, "Times New Roman", serif';
  g.fillText('Atlas Copco', bx + bw / 2, by + bh * 0.52, bw * 0.86);
}
function torDibHiLight(g, w, h){
  g.fillStyle = '#17191C'; g.textAlign = 'left'; g.textBaseline = 'middle';
  g.font = 'italic bold ' + Math.round(h * 0.70) + 'px Arial, sans-serif';
  g.fillText('HiLight V5+', w * 0.03, h * 0.55, w * 0.94);
}
function torDibGenerac(mobile){
  return function(g, w, h){
    g.fillStyle = '#16171A'; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    g.save(); g.setTransform(1, 0, -0.12, 1, h * 0.08, 0);
    g.font = '900 ' + Math.round(h * 0.50) + 'px "Arial Black", Arial, sans-serif';
    g.fillText('GENERAC', w * 0.03, h * 0.56, w * 0.88);
    g.restore();
    g.font = Math.round(h * 0.13) + 'px Arial'; g.fillText('®', w * 0.93, h * 0.20);
    /* el subrayado naranja en cuña */
    g.fillStyle = '#E2541B';
    g.beginPath(); g.moveTo(w * 0.14, h * 0.66); g.lineTo(w * 0.93, h * 0.62); g.lineTo(w * 0.92, h * 0.71); g.lineTo(w * 0.06, h * 0.74); g.closePath(); g.fill();
    if(mobile){ g.fillStyle = '#16171A'; g.font = 'bold ' + Math.round(h * 0.15) + 'px Arial'; g.textAlign = 'right'; g.fillText('MOBILE', w * 0.92, h * 0.94); }
  };
}
function torDibGLT4(g, w, h){
  g.textAlign = 'left'; g.textBaseline = 'middle';
  g.font = '900 ' + Math.round(h * 0.78) + 'px "Arial Black", Arial, sans-serif';
  g.fillStyle = '#16171A'; g.fillText('GLT', w * 0.04, h * 0.55);
  var x = w * 0.04 + g.measureText('GLT').width;
  g.fillStyle = '#E8561C'; g.fillText('4-M', x, h * 0.55, w - x - 4);
}
function torDibVTevo(g, w, h){
  g.fillStyle = '#F07D1A';
  for(var i = 0; i < 4; i++){
    var x = w * (0.02 + i * 0.065);
    g.beginPath(); g.moveTo(x, h * 0.20); g.lineTo(x + w * 0.03, h * 0.20); g.lineTo(x + w * 0.10, h * 0.86); g.lineTo(x + w * 0.07, h * 0.86); g.closePath(); g.fill();
  }
  g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  g.font = '900 ' + Math.round(h * 0.78) + 'px "Arial Black", Arial, sans-serif';
  g.fillStyle = '#EE6A12'; g.fillText('VT', w * 0.32, h * 0.86);
  var x2 = w * 0.32 + g.measureText('VT').width;
  g.fillStyle = '#1C9A82'; g.font = 'bold ' + Math.round(h * 0.40) + 'px Arial, sans-serif';
  g.fillText('evo', x2 + w * 0.01, h * 0.86);
}
/* la piel del costado de la LUX M11: cuña roja y naranja, filo negro, marca y modelo */
function torDibLux(g, w, h){
  var gr = g.createLinearGradient(w * 0.2, h, w, h * 0.25);
  gr.addColorStop(0, '#E2381E'); gr.addColorStop(0.55, '#C3141C'); gr.addColorStop(1, '#F07A1A');
  g.fillStyle = gr;
  g.beginPath(); g.moveTo(w * 0.06, h); g.lineTo(w * 0.60, h * 0.44); g.lineTo(w, h * 0.32); g.lineTo(w, h); g.closePath(); g.fill();
  g.fillStyle = '#F5A11E';
  g.beginPath(); g.moveTo(w * 0.24, h); g.lineTo(w * 0.62, h * 0.58); g.lineTo(w * 0.66, h * 0.58); g.lineTo(w * 0.30, h); g.closePath(); g.fill();
  g.fillStyle = '#141414';
  g.beginPath(); g.moveTo(w * 0.36, h * 0.62); g.lineTo(w * 0.60, h * 0.37); g.lineTo(w * 0.99, h * 0.25); g.lineTo(w * 0.99, h * 0.29);
  g.lineTo(w * 0.61, h * 0.42); g.closePath(); g.fill();
  g.fillStyle = '#141414'; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  g.font = 'bold ' + Math.round(h * 0.16) + 'px Georgia, "Times New Roman", serif';
  g.fillText('LUXTOWER', w * 0.40, h * 0.22, w * 0.46);
  g.beginPath(); g.moveTo(w * 0.88, h * 0.22); g.quadraticCurveTo(w * 0.92, h * 0.04, w * 0.97, h * 0.10); g.lineTo(w * 0.93, h * 0.22); g.closePath(); g.fill();
  g.font = 'bold ' + Math.round(h * 0.14) + 'px Arial, sans-serif';
  g.fillStyle = '#FFFFFF'; g.fillText('LUX', w * 0.30, h * 0.93);
  g.fillStyle = '#FFD08A'; g.fillText('M11', w * 0.30 + g.measureText('LUX ').width, h * 0.93);
}
function torDibLuxEmblema(g, w, h){
  g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(w / 2, h / 2, w * 0.46, 0, Math.PI * 2); g.fill();
  g.strokeStyle = '#C8161D'; g.lineWidth = w * 0.05; g.beginPath(); g.arc(w / 2, h / 2, w * 0.42, 0, Math.PI * 2); g.stroke();
  g.fillStyle = '#C8161D';
  g.beginPath(); g.moveTo(w * 0.32, h * 0.72); g.lineTo(w * 0.50, h * 0.26); g.lineTo(w * 0.58, h * 0.40); g.lineTo(w * 0.70, h * 0.36);
  g.lineTo(w * 0.60, h * 0.52); g.lineTo(w * 0.66, h * 0.72); g.closePath(); g.fill();
}
/* texto de la caja de conexiones del cabezal: letras apiladas o el texto girado */
function torDibVertical(txt, fondo, tinta, apilar){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    if(apilar){
      g.font = 'bold ' + Math.round(w * 0.62) + 'px Arial, sans-serif';
      for(var i = 0; i < txt.length; i++) g.fillText(txt[i], w / 2, h * (i + 0.5) / txt.length);
    } else {
      g.save(); g.translate(w / 2, h / 2); g.rotate(Math.PI / 2);
      g.font = '900 ' + Math.round(w * 0.42) + 'px "Arial Black", Arial, sans-serif';
      g.fillText(txt, 0, 0, h * 0.9); g.restore();
    }
  };
}
/* franjas amarillas y negras de las patas */
function torTexRayas(largo){
  var c = document.createElement('canvas'); c.width = 64; c.height = 64;
  var g = c.getContext('2d');
  g.fillStyle = '#F2C200'; g.fillRect(0, 0, 64, 64);
  g.fillStyle = '#141414';
  for(var k = -2; k < 3; k++){ g.beginPath(); g.moveTo(0, k * 32 + 0); g.lineTo(64, k * 32 + 32); g.lineTo(64, k * 32 + 48); g.lineTo(0, k * 32 + 16); g.closePath(); g.fill(); }
  var t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, largo / 0.16);
  t.encoding = THREE.sRGBEncoding;
  return t;
}

/* la cara de una lampara encendida: halogenuro (reflector con el arco), LED
   en rejilla (una o dos ventanas) o COB (dos lentes redondos, Atlas Copco) */
function torTexLente(tipo, ventanas, vert){
  var c = document.createElement('canvas'); c.width = 256; c.height = 256;
  var g = c.getContext('2d'), i, j;
  if(tipo === 'MH'){
    var gr = g.createRadialGradient(128, 128, 6, 128, 128, 182);
    gr.addColorStop(0, '#FFFFFF'); gr.addColorStop(0.2, '#FFF8E6'); gr.addColorStop(0.6, '#F3DBA6'); gr.addColorStop(1, '#9C7C45');
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = 'rgba(110,80,35,0.28)'; g.lineWidth = 3;
    for(i = 0; i < 12; i++){ var a = i / 12 * Math.PI * 2; g.beginPath(); g.moveTo(128 + Math.cos(a) * 30, 128 + Math.sin(a) * 30); g.lineTo(128 + Math.cos(a) * 190, 128 + Math.sin(a) * 190); g.stroke(); }
    g.fillStyle = '#FFFFFF'; g.fillRect(64, 119, 128, 18);
  } else if(tipo === 'COB'){
    g.fillStyle = '#121416'; g.fillRect(0, 0, 256, 256);
    g.fillStyle = '#25292E';
    for(i = 0; i < 7; i++) g.fillRect(14, 12 + i * 15, 228, 7);
    [72, 184].forEach(function(cx){
      g.fillStyle = '#4A4F55'; g.beginPath(); g.arc(cx, 182, 52, 0, Math.PI * 2); g.fill();
      var gl = g.createRadialGradient(cx, 182, 4, cx, 182, 46);
      gl.addColorStop(0, '#FFFFFF'); gl.addColorStop(0.45, '#F4F8FF'); gl.addColorStop(1, '#8FA6C0');
      g.fillStyle = gl; g.beginPath(); g.arc(cx, 182, 44, 0, Math.PI * 2); g.fill();
    });
  } else {
    g.fillStyle = '#16191C'; g.fillRect(0, 0, 256, 256);
    var n = ventanas || 1, m = 10;
    for(var v = 0; v < n; v++){
      var x0 = vert ? m : m + v * (256 - m) / n, y0 = vert ? m + v * (256 - m) / n : m;
      var ww = vert ? 256 - 2 * m : (256 - m) / n - m, hh = vert ? (256 - m) / n - m : 256 - 2 * m;
      g.fillStyle = '#30363D'; g.fillRect(x0, y0, ww, hh);
      var nc = Math.max(4, Math.round(ww / 16)), nr = Math.max(3, Math.round(hh / 16));
      for(i = 0; i < nc; i++) for(j = 0; j < nr; j++){
        var px = x0 + ww * (i + 0.5) / nc, py = y0 + hh * (j + 0.5) / nr;
        var gd = g.createRadialGradient(px, py, 0.5, px, py, 7.5);
        gd.addColorStop(0, '#FFFFFF'); gd.addColorStop(0.5, '#EEF4FF'); gd.addColorStop(1, 'rgba(160,185,215,0)');
        g.fillStyle = gd; g.fillRect(px - 8, py - 8, 16, 16);
      }
    }
  }
  var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
  return t;
}
function torTexHalo(){
  var c = document.createElement('canvas'); c.width = 128; c.height = 128;
  var g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,0.45)'); gr.addColorStop(0.4, 'rgba(255,250,235,0.14)'); gr.addColorStop(1, 'rgba(255,245,220,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

/* ═══ conjuntos ═══ */

/* rueda de remolque: la de kitDetalle con pestanas finas (las suyas son de
   llanta minera) y, afuera, el plato del aro con agujeros, masa y tuercas */
function torRueda(D, code, x, z, s, o){
  var gr = D.ruedaDet(code, x, z, 0, { r: o.R, ancho: o.A, rAro: o.rAro, aro: o.aro, aro2: o.aro, pernos: 5, paso: 0.055, goma: TOR_GOMA });
  gr.children.forEach(function(m){
    if(m.geometry && m.geometry.type === 'TorusGeometry'){ m.geometry.dispose(); m.geometry = new THREE.TorusGeometry(o.rAro * 1.03, 0.010, 8, 40); }
  });
  var M = D.M, zA = s * o.A * 0.22, ra = o.rAro;
  var mk = function(geo, mat, zz, rotX){ var m = new THREE.Mesh(geo, mat); m.rotation.x = rotX === undefined ? s * Math.PI / 2 : rotX; m.position.z = zz; m.castShadow = true; m.receiveShadow = true; gr.add(m); return m; };
  mk(new THREE.CylinderGeometry(ra * 0.60, ra * 0.97, 0.05, 32), M.pintura(o.aro), zA);
  mk(new THREE.CylinderGeometry(ra * 0.36, ra * 0.40, 0.05, 24), M.pintura(o.aro), zA + s * 0.045);
  mk(new THREE.CylinderGeometry(ra * 0.16, ra * 0.20, 0.05, 18), M.cromo(), zA + s * 0.085);
  var d = new THREE.Object3D();
  var tu = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.011, 0.011, 0.03, 6), M.metal('#7E848A'), 5);
  var ag = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.02, 0.02, 0.006, 14), M.mate('#141518'), 6);
  for(var i = 0; i < 6; i++){
    var a = i / 6 * Math.PI * 2;
    d.position.set(Math.cos(a) * ra * 0.74, Math.sin(a) * ra * 0.74, zA + s * 0.012); d.rotation.set(Math.PI / 2, 0, 0); d.updateMatrix(); ag.setMatrixAt(i, d.matrix);
    if(i < 5){ var b = i / 5 * Math.PI * 2; d.position.set(Math.cos(b) * ra * 0.29, Math.sin(b) * ra * 0.29, zA + s * 0.075); d.updateMatrix(); tu.setMatrixAt(i, d.matrix); }
  }
  gr.add(tu); gr.add(ag);
  return gr;
}
function torGuarda(D, x, z, R, A, hex, s){
  var rr = R + 0.06, ww = A + 0.07;
  var m = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, ww, 30, 1, true, Math.PI / 2 - 0.22, Math.PI + 0.44), D.M.pintura(hex));
  m.material.side = THREE.DoubleSide; m.rotation.x = Math.PI / 2; m.position.set(x, R, z);
  D.reg(null, m, hex);
  [-1, 1].forEach(function(e){
    D.pon(null, new THREE.TorusGeometry(rr, 0.012, 6, 30, Math.PI + 0.44), 'pintura', hex, x, R, z + e * ww / 2, [0, 0, -0.22]);
  });
  /* escuadra que la toma de la carcasa */
  D.bloque(null, 0.24, 0.05, 0.10, 'pintura', hex, x, R + rr - 0.01, z - s * (ww / 2 + 0.03), 0.01);
}
/* pata estabilizadora: camisa, tubo interior galvanizado, base y manivela */
function torPata(D, x, z, yRef, estilo, texRayas){
  var top = yRef + 0.30, cam0 = 0.30;
  var hexC = estilo === 'galv' ? TOR_GALV : estilo === 'rayas' ? '#FFFFFF' : TOR_NEGRO;
  var cam = D.pon(null, new THREE.BoxGeometry(0.08, top - cam0, 0.08), estilo === 'galv' ? 'metal' : 'pintura', hexC, x, (top + cam0) / 2, z);
  if(estilo === 'rayas' && texRayas){ cam.material.map = texRayas; cam.material.needsUpdate = true; }
  D.bloque(null, 0.088, 0.03, 0.088, 'metal', TOR_GALV2, x, cam0 + 0.015, z, 0.005);
  D.bloque(null, 0.058, cam0 - 0.01, 0.058, 'metal', TOR_GALV, x, (cam0 + 0.02) / 2, z, 0.006);
  D.bloque(null, 0.18, 0.014, 0.18, 'metal', TOR_GALV2, x, 0.007, z, 0.004);
  D.bloque(null, 0.03, 0.06, 0.10, 'metal', TOR_GALV2, x, 0.035, z, 0.004);
  /* pasador de altura y manivela arriba */
  D.cilindro(null, 0.011, 0.011, 0.14, 'metal', '#5E646A', x, cam0 + 0.07, z, [Math.PI / 2, 0, 0], 8);
  D.cilindro(null, 0.03, 0.03, 0.04, 'metal', TOR_GALV2, x, top + 0.02, z, null, 14);
  D.tubo(null, [x, top + 0.04, z], [x, top + 0.09, z], 0.011, 'metal', TOR_GALV, 8);
  D.tubo(null, [x, top + 0.09, z], [x - 0.13, top + 0.09, z], 0.010, 'metal', TOR_GALV, 8);
  D.cilindro(null, 0.015, 0.015, 0.075, 'mate', '#111317', x - 0.13, top + 0.125, z, null, 10);
}

/* chasis: largueros, travesanos, eje con ballestas, ruedas, guardafangos,
   lanza con enganche y gato, patas estabilizadoras y luces traseras */
function torChasis(D, h){
  var hx = h.hex, texR = h.pata === 'rayas' ? torTexRayas(h.yL) : null;
  [-1, 1].forEach(function(s){ D.bloque('42023615', h.xR - h.xF, 0.09, 0.06, 'pintura', hx, (h.xF + h.xR) / 2, h.yL, s * h.zL, 0.012); });
  [h.xF + 0.03, h.xa, h.xR - 0.03].forEach(function(x){ D.bloque('42023615', 0.06, 0.07, 2 * h.zL - 0.04, 'pintura', hx, x, h.yL, 0, 0.01); });
  /* eje tubular, ballestas de tres hojas, colgadores y abrazaderas */
  D.tubo(null, [h.xa, h.R, -h.via / 2 + h.A * 0.3], [h.xa, h.R, h.via / 2 - h.A * 0.3], 0.032, 'pintura', hx, 16);
  [-1, 1].forEach(function(s){
    var z = s * h.zL;
    for(var k = 0; k < 3; k++) D.bloque(null, 0.62 - k * 0.15, 0.014, 0.05, 'metal', '#3E4347', h.xa, h.R + 0.045 + k * 0.016, z, 0.004);
    [h.xa - 0.31, h.xa + 0.31].forEach(function(x){ D.bloque(null, 0.035, h.yL - h.R - 0.07, 0.05, 'pintura', hx, x, (h.yL + h.R + 0.02) / 2, z, 0.006); });
    D.bloque(null, 0.09, 0.07, 0.075, 'metal', '#3E4347', h.xa, h.R + 0.01, z, 0.008);
    D.bloque(null, 0.06, 0.03, 0.03, 'metal', '#3E4347', h.xa, h.R + 0.01, s * (h.via / 2 - h.A * 0.5 - 0.02), 0.006);
  });
  var o = { R: h.R, A: h.A, rAro: h.rAro, aro: h.aro };
  torRueda(D, 'LL1', h.xa, h.via / 2, 1, o);
  torRueda(D, 'LL2', h.xa, -h.via / 2, -1, o);
  [-1, 1].forEach(function(s){ torGuarda(D, h.xa, s * h.via / 2, h.R, h.A, h.guarda, s); });

  /* lanza: viga recta con dos tirantes al travesano, o en A */
  var L = h.lanza;
  if(L.tipo === 'A'){
    [-1, 1].forEach(function(s){ torViga(D, '42023615', [h.xF + 0.03, h.yL, s * h.zL], [L.xh + 0.32, L.yh, 0], 0.07, 0.08, 'pintura', L.hex); });
    torViga(D, '42023615', [L.xh + 0.34, L.yh, 0], [L.xh + 0.05, L.yh, 0], 0.08, 0.08, 'pintura', L.hex);
  } else {
    torViga(D, '42023615', [h.xF + 0.06, h.yL, 0], [L.xh + 0.05, L.yh, 0], 0.09, 0.09, 'pintura', L.hex);
    [-1, 1].forEach(function(s){ torViga(D, null, [h.xF + 0.03, h.yL, s * (h.zL - 0.02)], [h.xF - 0.40, h.yL - 0.01, s * 0.04], 0.05, 0.05, 'pintura', L.hex); });
  }
  /* enganche: ojo de pivote o acople de bola */
  if(L.enganche === 'ojo'){
    D.bloque(null, 0.14, 0.05, 0.07, 'metal', '#3B3F44', L.xh + 0.04, L.yh, 0, 0.012);
    D.pon(null, new THREE.TorusGeometry(0.05, 0.02, 10, 24), 'metal', '#3B3F44', L.xh - 0.06, L.yh, 0, [Math.PI / 2, 0, 0]);
  } else {
    D.bloque(null, 0.26, 0.08, 0.11, 'metal', '#5A6067', L.xh + 0.03, L.yh + 0.01, 0, 0.02);
    D.pon(null, new THREE.SphereGeometry(0.055, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), 'metal', '#5A6067', L.xh - 0.08, L.yh + 0.02, 0, [Math.PI, 0, 0]);
    D.tubo(null, [L.xh + 0.06, L.yh + 0.05, 0], [L.xh - 0.06, L.yh + 0.10, 0], 0.012, 'metal', '#5A6067', 8);
  }
  /* cadenas de seguridad colgando del enganche */
  if(L.cadenas){
    var gC = new THREE.TorusGeometry(0.018, 0.005, 6, 12), nC = 14;
    var ic = new THREE.InstancedMesh(gC, D.M.metal('#C9A64A'), nC * 2), oc = new THREE.Object3D(), kc = 0;
    [-1, 1].forEach(function(s){
      for(var i = 0; i < nC; i++){
        var t = i / (nC - 1), xx = L.xh + 0.30 - t * 0.32, yy = L.yh - 0.02 - Math.sin(t * Math.PI) * 0.16;
        oc.position.set(xx, yy, s * 0.06); oc.rotation.set(i % 2 ? Math.PI / 2 : 0, 0, 0); oc.updateMatrix(); ic.setMatrixAt(kc++, oc.matrix);
      }
    });
    ic.castShadow = true; D.reg(null, ic, '#C9A64A');
  }
  /* gato de la lanza, al costado izquierdo */
  if(L.gato !== null && L.gato !== undefined){
    var xg = L.gato, yg = L.yh + (h.yL - L.yh) * (xg - L.xh) / (h.xF - L.xh), zg = 0.085;
    D.bloque(null, 0.06, 0.10, 0.10, 'pintura', L.hex, xg, yg, 0.05, 0.01);
    D.cilindro(null, 0.035, 0.035, 0.52, 'pintura', L.hex, xg, yg + 0.05, zg, null, 16);
    D.cilindro(null, 0.026, 0.026, 0.30, 'metal', TOR_GALV, xg, yg - 0.34, zg, null, 14);
    D.bloque(null, 0.16, 0.014, 0.16, 'metal', TOR_GALV2, xg, 0.007, zg, 0.004);
    D.tubo(null, [xg, yg + 0.31, zg], [xg - 0.12, yg + 0.33, zg], 0.010, 'metal', TOR_GALV, 8);
    D.cilindro(null, 0.015, 0.015, 0.07, 'mate', '#111317', xg - 0.12, yg + 0.37, zg, null, 10);
  }
  /* patas: viga del chasis a la pata, con su perno de giro */
  (h.patas || []).forEach(function(p){
    torViga(D, null, [p[0], h.yL, p[1]], [p[2], h.yL, p[3]], 0.07, 0.07, h.tipoViga || 'pintura', h.hexViga || hx);
    D.cilindro(null, 0.03, 0.03, 0.14, 'metal', TOR_GALV2, p[0], h.yL, p[1], null, 12);
    torPata(D, p[2], p[3], h.yL, h.pata, texR);
  });
  /* gatos traseros fijos en placas (VTevo) */
  (h.gatosTras || []).forEach(function(p){
    D.bloque(null, 0.14, 0.20, 0.012, 'pintura', hx, p[0], h.yL + 0.10, p[1], 0.004);
    torPata(D, p[0], p[1] + (p[1] > 0 ? 0.05 : -0.05), h.yL, 'galv', null);
  });
  /* luces traseras: caja negra y mica roja y ambar */
  [-1, 1].forEach(function(s){
    D.bloque(null, 0.05, 0.10, 0.16, 'mate', '#1B1C1E', h.xR + 0.025, h.yL, s * (h.zL + 0.10), 0.01);
    D.bloque('LSM', 0.02, 0.07, 0.07, 'vidrio', '#C2241B', h.xR + 0.055, h.yL, s * (h.zL + 0.135), 0.006);
    D.bloque('LSM', 0.02, 0.07, 0.05, 'vidrio', '#F2A31A', h.xR + 0.055, h.yL, s * (h.zL + 0.065), 0.006);
  });
}

/* carcasa en tramos: frente, fondo y la bahia del motor con la puerta abierta
   del lado derecho (-Z). F: forma, P: puerta. Devuelve la puerta para pegarle
   rotulos (coordenadas del mundo con la puerta cerrada) */
function torCarcasa(D, G, F, P){
  var W = F.W, zA = -W / 2, ret = {};
  if(!P){ torSeg(D, F, null, F.hex, F.x0, F.x1, F.y0, F.y1, -W / 2, W / 2); return ret; }
  var zB = zA + P.rec;
  torSeg(D, F, null, F.hexFrente || F.hex, F.x0, P.x0, F.y0, F.y1, -W / 2, W / 2);
  torSeg(D, F, null, F.hex, P.x1, F.x1, F.y0, F.y1, -W / 2, W / 2);
  torSeg(D, F, null, F.hex, P.x0, P.x1, F.y0, F.y1, zB, W / 2);
  torSeg(D, F, null, F.hex, P.x0, P.x1, P.y1, F.y1, -W / 2, zB + 0.01);
  torSeg(D, F, null, F.hex, P.x0, P.x1, F.y0, P.y0, -W / 2, zB + 0.01);
  /* forro de espuma oscura en la bahia */
  var li = TOR_FORRO, xm = (P.x0 + P.x1) / 2, ym = (P.y0 + P.y1) / 2, Lx = P.x1 - P.x0, Hy = P.y1 - P.y0, dz = P.rec - 0.02;
  D.bloque(null, Lx, Hy, 0.012, 'mate', li, xm, ym, zB - 0.004, 0.003);
  D.bloque(null, Lx, 0.012, dz, 'mate', li, xm, P.y1 - 0.004, zA + 0.01 + dz / 2, 0.003);
  D.bloque(null, Lx, 0.012, dz, 'mate', li, xm, P.y0 + 0.004, zA + 0.01 + dz / 2, 0.003);
  D.bloque(null, 0.012, Hy, dz, 'mate', li, P.x0 + 0.004, ym, zA + 0.01 + dz / 2, 0.003);
  D.bloque(null, 0.012, Hy, dz, 'mate', li, P.x1 - 0.004, ym, zA + 0.01 + dz / 2, 0.003);
  /* la puerta, colgada de sus bisagras */
  var gp = new THREE.Group(), hin = P.bisagra, a = P.ang, zP = zA + 0.013;
  if(hin === 'arriba'){ gp.position.set(xm, P.y1, zP); gp.rotation.x = a; }
  else if(hin === 'adelante'){ gp.position.set(P.x0, ym, zP); gp.rotation.y = a; }
  else { gp.position.set(P.x1, ym, zP); gp.rotation.y = -a; }
  G.add(gp);
  var mete = function(m){ return torMete(G, gp, m); };
  var lx = function(xw){ return xw - gp.position.x; }, ly = function(yw){ return yw - gp.position.y; };
  mete(D.bloque(null, Lx - 0.012, Hy - 0.012, 0.024, 'pintura', P.hex || F.hex, lx(xm), ly(ym), 0, 0.008));
  mete(D.bloque(null, Lx - 0.09, Hy - 0.09, 0.02, 'mate', li, lx(xm), ly(ym), 0.02, 0.004));
  var xMan = hin === 'adelante' ? P.x1 - 0.06 : hin === 'atras' ? P.x0 + 0.06 : xm;
  var yMan = hin === 'arriba' ? P.y0 + 0.05 : ym;
  mete(D.bloque(null, hin === 'arriba' ? 0.16 : 0.035, hin === 'arriba' ? 0.035 : 0.13, 0.025, 'mate', '#16181A', lx(xMan), ly(yMan), -0.024, 0.006));
  if(hin === 'arriba'){
    [P.x0 + 0.12, P.x1 - 0.12].forEach(function(xh){ mete(D.cilindro(null, 0.014, 0.014, 0.09, 'metal', '#2B2E33', lx(xh), 0, -0.012, [0, 0, Math.PI / 2], 10)); });
    /* amortiguadores a gas que sostienen la puerta levantada */
    gp.updateMatrixWorld(true);
    [P.x0 + 0.05, P.x1 - 0.05].forEach(function(xs){
      var pt = gp.localToWorld(new THREE.Vector3(lx(xs), -Hy * 0.55, 0.03));
      D.tubo(null, [xs, P.y0 + 0.12, zA + 0.03], [pt.x, pt.y, pt.z], 0.009, 'cromo', null, 8);
    });
  } else {
    var xb = hin === 'adelante' ? P.x0 + 0.015 : P.x1 - 0.015;
    [P.y0 + 0.10, P.y1 - 0.10].forEach(function(yh){ mete(D.bloque(null, 0.05, 0.07, 0.014, 'mate', '#16181A', lx(xb), ly(yh), -0.02, 0.003)); });
  }
  ret.puerta = gp; ret.lx = lx; ret.ly = ly; ret.mete = mete; ret.zB = zB;
  return ret;
}

/* grupo electrogeno en la bahia: motor diesel de dos o tres cilindros,
   generador acoplado, radiador con ventilador, bateria, filtro de aire y
   silenciador con el escape saliendo por el techo */
function torMotor(D, B, o){
  var Lb = B.x1 - B.x0, Hb = B.y1 - B.y0, Db = B.zB - B.zA;
  var ez = Math.min(0.30, Db - 0.22), ey = Math.min(0.34, Hb * 0.52), ex = Math.min(0.40, Lb * 0.40);
  var zc = B.zB - ez / 2 - 0.035, xe = B.x0 + Lb * 0.56, ye = B.y0 + 0.08 + ey / 2;
  /* soportes de goma */
  [xe - ex * 0.35, xe + ex * 0.35].forEach(function(x){ D.bloque(null, 0.06, 0.05, ez * 0.7, 'goma', '#1A1C1F', x, B.y0 + 0.035, zc, 0.01); });
  D.bloque('ENG1', ex, ey, ez, 'pintura', o.motor, xe, ye, zc, 0.03);
  D.bloque('ENG1', ex * 0.92, 0.05, ez * 0.8, 'metal', '#3A3F45', xe, ye - ey / 2 - 0.02, zc, 0.01);
  D.bloque('ENG1', ex * 0.86, 0.07, ez * 0.62, 'pintura', o.tapa || '#26292D', xe + 0.01, ye + ey / 2 + 0.035, zc, 0.02);
  /* inyectores con sus caños */
  for(var i = 0; i < (o.cil || 2); i++){
    var xi = xe - ex * 0.2 + i * ex * 0.4 / Math.max(1, (o.cil || 2) - 1);
    D.cilindro(null, 0.013, 0.013, 0.07, 'metal', '#A9AFB4', xi, ye + ey / 2 + 0.10, zc - ez * 0.18, null, 8);
    D.tubo(null, [xi, ye + ey / 2 + 0.13, zc - ez * 0.18], [xe - ex * 0.5 + 0.02, ye + ey * 0.2, zc - ez / 2 - 0.01], 0.005, 'metal', '#A9AFB4', 6);
  }
  /* filtro de aceite, varilla, motor de arranque */
  D.cilindro('ENG1', 0.042, 0.042, 0.10, 'pintura', o.filtro || '#E6E1D3', xe + ex * 0.15, ye + 0.04, zc - ez / 2 - 0.05, [Math.PI / 2, 0, 0], 18);
  D.cilindro(null, 0.012, 0.012, 0.03, 'pintura', '#F2C200', xe - ex * 0.30, ye + ey / 2 + 0.02, zc - ez / 2 + 0.02, null, 8);
  D.cilindro(null, 0.05, 0.05, 0.16, 'mate', '#1E2023', xe - ex * 0.25, ye - ey * 0.25, zc + ez / 2 - 0.02, [0, 0, Math.PI / 2], 14);
  /* polea, correa y ventilador hacia el radiador */
  var xr = B.x1 - 0.07;
  D.cilindro(null, 0.07, 0.07, 0.03, 'metal', '#3A3F45', xe + ex / 2 + 0.03, ye - ey * 0.15, zc, [0, 0, Math.PI / 2], 20);
  D.pon(null, new THREE.TorusGeometry(Math.min(0.14, Hb * 0.22), 0.025, 8, 28), 'mate', '#202326', (xe + ex / 2 + xr) / 2 + 0.02, ye + 0.02, zc, [0, Math.PI / 2, 0]);
  D.bloque('RAD1', 0.06, Hb * 0.74, Db * 0.80, 'mate', '#1E2124', xr, B.y0 + Hb * 0.47, (B.zA + B.zB) / 2 + 0.03, 0.01);
  D.lamas(null, xr - 0.02, B.y0 + Hb * 0.16, B.y0 + Hb * 0.78, (B.zA + B.zB) / 2 - Db * 0.34, (B.zA + B.zB) / 2 + Db * 0.38, 9, '#2E3236', -1);
  D.cilindro('RAD1', 0.03, 0.03, 0.06, 'metal', '#8C9298', xr, B.y0 + Hb * 0.88, zc, null, 12);
  /* mangueras del radiador */
  D.tubo(null, [xe + ex / 2 - 0.02, ye + ey * 0.40, zc - 0.05], [xr - 0.04, B.y0 + Hb * 0.78, zc - 0.05], 0.021, 'goma', '#1A1C1F', 10);
  D.tubo(null, [xe + ex / 2 - 0.02, ye - ey * 0.30, zc + 0.05], [xr - 0.04, B.y0 + Hb * 0.20, zc + 0.05], 0.021, 'goma', '#1A1C1F', 10);
  /* generador: campana, cuerpo con ventilacion, tapa y caja de bornes */
  var ra = Math.min(0.15, Hb * 0.24, ez * 0.55), la = Math.max(0.12, Math.min(0.30, (xe - ex / 2) - B.x0 - 0.08));
  var xa = xe - ex / 2 - la / 2 - 0.035;
  D.cilindro('AL1', ra * 1.04, ra * 0.92, 0.05, 'metal', '#5A6068', xe - ex / 2 - 0.012, ye, zc, [0, 0, Math.PI / 2], 28);
  D.cilindro('AL1', ra, ra, la, 'pintura', o.alt, xa, ye, zc, [0, 0, Math.PI / 2], 32);
  [-0.3, 0.3].forEach(function(f){ D.pon(null, new THREE.TorusGeometry(ra, 0.008, 6, 32), 'mate', '#16181A', xa + f * la, ye, zc, [0, Math.PI / 2, 0]); });
  D.cilindro('AL1', ra * 0.85, ra * 0.85, 0.03, 'pintura', o.alt, xa - la / 2 - 0.012, ye, zc, [0, 0, Math.PI / 2], 28);
  D.bloque('AL1', Math.min(0.13, la * 0.8), 0.07, 0.11, 'pintura', o.alt, xa, ye + ra + 0.03, zc, 0.012);
  D.bloque(null, la * 0.9, 0.04, ez * 0.9, 'metal', '#3A3F45', xa, ye - ra - 0.01, zc, 0.006);
  /* bateria en el piso, delante del motor */
  var xbat = Math.min(xe, B.x1 - 0.30);
  D.bloque('BAT', 0.22, 0.17, 0.14, 'mate', '#1B1C1E', xbat, B.y0 + 0.095, B.zA + 0.10, 0.012);
  D.cilindro(null, 0.015, 0.015, 0.03, 'pintura', '#C8201A', xbat - 0.07, B.y0 + 0.19, B.zA + 0.10, null, 10);
  D.cilindro(null, 0.015, 0.015, 0.03, 'mate', '#111', xbat + 0.07, B.y0 + 0.19, B.zA + 0.10, null, 10);
  D.tubo(null, [xbat - 0.07, B.y0 + 0.20, B.zA + 0.10], [xe - ex * 0.25, ye - ey * 0.15, zc - ez / 2], 0.009, 'goma', '#B32019', 6);
  /* filtro de aire contra el fondo, arriba, y silenciador sobre el motor */
  D.cilindro(null, 0.06, 0.06, 0.20, 'mate', '#1E2023', xe - 0.02, B.y1 - 0.08, B.zB - 0.075, [0, 0, Math.PI / 2], 18);
  D.tubo(null, [xe + 0.08, B.y1 - 0.08, B.zB - 0.075], [xe + ex * 0.3, ye + ey / 2 + 0.07, zc + 0.04], 0.025, 'goma', '#1A1C1F', 10);
  var ym = Math.min(ye + ey / 2 + 0.14, B.y1 - 0.08), xm = xe + ex * 0.15, zm = zc - ez * 0.20;
  D.cilindro(null, 0.06, 0.06, 0.22, 'metal', '#8A8F94', xm, ym, zm, [0, 0, Math.PI / 2], 18);
  D.tubo(null, [xm + 0.11, ym, zm], [xm + 0.11, B.yTecho + 0.12, zm], 0.022, 'metal', '#7A7F84', 12);
  D.bloque(null, 0.08, 0.008, 0.06, 'metal', '#6A6F74', xm + 0.13, B.yTecho + 0.13, zm, 0.002, [0, 0, -0.5]);
}

/* tablero de control: marco, placa de interruptores y tomas (TAB) y el
   controlador con pantalla (EC); la cara mira a -Z en coordenadas locales */
function torPanel(D, G, x, y, z, ry){
  var grp = new THREE.Group(); grp.position.set(x, y, z); grp.rotation.y = ry || 0; G.add(grp);
  var mete = function(m){ return torMete(G, grp, m); };
  mete(D.bloque(null, 0.38, 0.30, 0.02, 'mate', '#202326', 0, 0, -0.008, 0.006));
  mete(D.bloque('TAB', 0.34, 0.26, 0.012, 'mate', '#3A3F45', 0, 0, -0.022, 0.004));
  mete(D.bloque('EC', 0.13, 0.10, 0.03, 'mate', '#17191C', -0.08, 0.055, -0.035, 0.006));
  var pant = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.045), new THREE.MeshStandardMaterial({ color: '#000000', emissive: '#7BE0A0', emissiveIntensity: 0.9 }));
  pant.rotation.y = Math.PI; pant.position.set(-0.08, 0.065, -0.0515); grp.add(pant);
  for(var b = 0; b < 3; b++) mete(D.cilindro(null, 0.007, 0.007, 0.01, 'mate', b ? '#2F8C4A' : '#C8201A', -0.11 + b * 0.03, 0.025, -0.052, [Math.PI / 2, 0, 0], 10));
  for(var i = 0; i < 4; i++) mete(D.bloque(null, 0.028, 0.06, 0.03, 'mate', i ? '#E8E8E4' : '#2B2E33', 0.03 + i * 0.034, 0.06, -0.035, 0.004));
  mete(D.cilindro(null, 0.036, 0.036, 0.012, 'pintura', '#F2C200', -0.10, -0.07, -0.03, [Math.PI / 2, 0, 0], 20));
  mete(D.cilindro(null, 0.026, 0.030, 0.03, 'pintura', '#C8201A', -0.10, -0.07, -0.05, [Math.PI / 2, 0, 0], 20));
  mete(D.cilindro(null, 0.034, 0.034, 0.05, 'pintura', '#1F5FB8', 0.03, -0.07, -0.045, [Math.PI / 2, 0, 0], 20));
  mete(D.cilindro(null, 0.03, 0.03, 0.04, 'mate', '#26292D', 0.115, -0.07, -0.04, [Math.PI / 2, 0, 0], 18));
  return grp;
}

/* mastil telescopico: manga, tramos con collares y trabas, cabrestante con
   manivela, cable de acero, y el cable en espiral hasta el cabezal */
function torMastil(D, G, m){
  var cuad = m.forma !== 'red';
  var sec = function(s, y0, y1, tipo, hex){
    if(cuad) return D.bloque(null, s, y1 - y0, s, tipo, hex, m.x, (y0 + y1) / 2, 0, Math.min(0.012, s * 0.1));
    return D.cilindro(null, s / 2, s / 2, y1 - y0, tipo, hex, m.x, (y0 + y1) / 2, 0, null, 24);
  };
  sec(m.s0, m.y0, m.yManga, m.tipoManga, m.hexManga);
  var Lv = (m.yTop - m.yManga) / m.n;
  for(var i = 1; i <= m.n; i++){
    var si = m.s0 - i * m.ds;
    sec(si, m.yManga + (i - 1) * Lv - 0.25, m.yManga + i * Lv, m.tipoTramo, m.hexTramo);
    /* collar en la boca del tramo de afuera, con su perilla de traba */
    var yc = m.yManga + (i - 1) * Lv, sc = m.s0 - (i - 1) * m.ds + 0.02, hc = i === 1 ? m.hexManga : m.hexTramo, tc = i === 1 ? m.tipoManga : m.tipoTramo;
    if(cuad) D.bloque(null, sc, 0.07, sc, tc, hc, m.x, yc - 0.035, 0, 0.01);
    else D.cilindro(null, sc / 2, sc / 2, 0.07, tc, hc, m.x, yc - 0.035, 0, null, 24);
    D.cilindro(null, 0.012, 0.012, 0.06, 'metal', '#5E646A', m.x - sc / 2 - 0.028, yc - 0.035, 0, [0, 0, Math.PI / 2], 8);
    D.cilindro(null, 0.02, 0.02, 0.025, 'mate', '#C8201A', m.x - sc / 2 - 0.065, yc - 0.035, 0, [0, 0, Math.PI / 2], 12);
  }
  /* soportes de la manga a la carcasa */
  [m.yApoyo1 || 0.78, m.yApoyo2 || 1.15].forEach(function(y){
    var x0 = m.x + m.s0 / 2, x1 = m.xCarc;
    if(x1 - x0 > 0.005) D.bloque(null, x1 - x0 + 0.02, 0.06, m.s0 * 0.8, 'pintura', m.hexApoyo || TOR_NEGRO, (x0 + x1) / 2, y, 0, 0.008);
  });
  D.bloque(null, m.s0 + 0.06, 0.02, m.s0 + 0.06, 'metal', TOR_GALV2, m.x, m.y0 + 0.01, 0, 0.004);
  /* cabrestante en la cara de adelante de la manga */
  var xw = m.x - m.s0 / 2 - 0.085, yw = m.yWinch;
  D.bloque(null, 0.025, 0.26, 0.20, 'metal', TOR_GALV2, m.x - m.s0 / 2 - 0.012, yw, 0, 0.006);
  [-1, 1].forEach(function(s){ D.cilindro(null, 0.10, 0.10, 0.012, 'metal', TOR_GALV, xw, yw, s * 0.06, [Math.PI / 2, 0, 0], 28); });
  D.cilindro(null, 0.05, 0.05, 0.11, 'metal', '#8E959B', xw, yw, 0, [Math.PI / 2, 0, 0], 18);
  D.cilindro(null, 0.055, 0.055, 0.05, 'metal', TOR_GALV, xw, yw, 0.095, [Math.PI / 2, 0, 0], 18);
  D.tubo(null, [xw, yw, 0.12], [xw - 0.03, yw + 0.20, 0.13], 0.011, 'metal', TOR_GALV, 8);
  D.cilindro(null, 0.016, 0.016, 0.09, 'mate', '#111317', xw - 0.03, yw + 0.20, 0.18, [Math.PI / 2, 0, 0], 10);
  D.tubo(null, [xw + 0.03, yw + 0.05, 0], [m.x - m.s0 / 2 + 0.004, m.yManga - 0.06, 0], 0.004, 'metal', '#C9CED2', 6);
  /* cable en espiral, estirado a lo largo de los tramos */
  var y0c = m.yManga + 0.35, y1c = m.yTop - 0.12, rc = 0.042, zc = m.s0 / 2 + 0.065, vueltas = Math.round((y1c - y0c) / 0.10);
  var curva = new THREE.Curve();
  curva.getPoint = function(t, opt){
    var p = opt || new THREE.Vector3(), a = t * vueltas * Math.PI * 2;
    return p.set(m.x + Math.cos(a) * rc, y0c + (y1c - y0c) * t, zc + Math.sin(a) * rc);
  };
  var esp = new THREE.Mesh(new THREE.TubeGeometry(curva, vueltas * 12, 0.007, 5, false), D.M.goma('#17191B'));
  esp.castShadow = true; G.add(esp);
  D.tubo(null, [m.x, y0c, zc], [m.x + m.s0 / 2 + 0.02, m.yApoyo2 || 1.15, zc], 0.008, 'goma', '#17191B', 6);
}

/* una lampara mirando a -X: caja, marco, vidrio encendido, halo, aletas y horquilla */
function torLampara(D, G, L, x, y, z, ry, rz){
  var grp = new THREE.Group(); grp.position.set(x, y, z); grp.rotation.set(0, ry, rz); G.add(grp);
  var mete = function(m){ return torMete(G, grp, m); };
  var w = L.w, h = L.h, d = L.d, hx = L.hex, tc = L.tipoCaja || 'mate', bz = L.bisel || hx, e = L.marco || 0.03;
  mete(D.bloque('LSM', d, h, w, tc, hx, 0, 0, 0, Math.min(0.025, d * 0.18)));
  mete(D.bloque(null, 0.025, e, w + 0.006, tc, bz, -d / 2 - 0.004, h / 2 - e / 2, 0, 0.006));
  mete(D.bloque(null, 0.025, e, w + 0.006, tc, bz, -d / 2 - 0.004, -h / 2 + e / 2, 0, 0.006));
  mete(D.bloque(null, 0.025, h - 2 * e, e, tc, bz, -d / 2 - 0.004, 0, w / 2 - e / 2, 0.006));
  mete(D.bloque(null, 0.025, h - 2 * e, e, tc, bz, -d / 2 - 0.004, 0, -w / 2 + e / 2, 0.006));
  var lente = new THREE.Mesh(new THREE.PlaneGeometry(w - 2 * e + 0.004, h - 2 * e + 0.004), L.matLente);
  lente.rotation.y = -Math.PI / 2; lente.position.set(-d / 2 - 0.003, 0, 0); grp.add(lente);
  var halo = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.7, h * 1.7), L.matHalo);
  halo.rotation.y = -Math.PI / 2; halo.position.set(-d / 2 - 0.04, 0, 0); halo.renderOrder = 3; grp.add(halo);
  if(L.aletas){
    var nA = Math.max(5, Math.round(w / 0.045)), ia = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, h * 0.84, 0.008), D.M.mate(hx), nA), o3 = new THREE.Object3D();
    for(var i = 0; i < nA; i++){ o3.position.set(d / 2 + 0.022, 0, -w / 2 + w * (i + 0.5) / nA); o3.updateMatrix(); ia.setMatrixAt(i, o3.matrix); }
    ia.castShadow = true; grp.add(ia);
  } else {
    /* halogenuro: tapa trasera abombada con el balasto */
    mete(D.bloque(null, 0.06, h * 0.7, w * 0.7, tc, hx, d / 2 + 0.025, 0, 0, 0.02));
  }
  var zy = w / 2 + 0.028, xb = d / 2 + 0.09, hy = L.hexYugo || TOR_GALV2;
  [-1, 1].forEach(function(s){
    mete(D.tubo(null, [0, 0, s * zy], [xb, 0, s * zy], 0.014, 'metal', hy, 8));
    mete(D.cilindro(null, 0.034, 0.034, 0.025, 'mate', '#202326', 0, 0, s * (zy - 0.006), [Math.PI / 2, 0, 0], 16));
  });
  mete(D.tubo(null, [xb, 0, -zy], [xb, 0, zy], 0.016, 'metal', hy, 8));
  mete(D.tubo(null, [d / 2, -h * 0.3, 0], [xb, -h * 0.45, 0.04], 0.008, 'goma', '#16181A', 6));
  return grp;
}

/* cabezal: barra, abrazadera, postes, cuatro lamparas, caja de conexiones y
   una luz puntual que alumbra el propio cabezal */
function torCabezal(D, G, m, L){
  var x = m.x, yC = L.yC, zmax = 0;
  L.pos.forEach(function(p){ zmax = Math.max(zmax, Math.abs(p[0])); });
  var mh = L.tipo === 'MH';
  var tex = torTexLente(L.tipo, L.ventanas, L.vert);
  L.matLente = new THREE.MeshStandardMaterial({ color: '#000000', emissive: mh ? '#FFF1D6' : '#F2F7FF', emissiveMap: tex, emissiveIntensity: 1.35, roughness: 0.25, metalness: 0 });
  L.matHalo = new THREE.MeshBasicMaterial({ map: torTexHalo(), color: mh ? '#FFE7B8' : '#E4EEFF', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  D.bloque(null, 0.07, 0.07, 2 * zmax + 0.06, L.tipoBarra || 'pintura', L.hexBarra, x, yC, 0, 0.01);
  D.bloque(null, 0.12, 0.18, 0.12, L.tipoBarra || 'pintura', L.hexBarra, x, yC, 0, 0.012);
  D.cilindro(null, 0.03, 0.03, 0.08, 'metal', TOR_GALV2, x, m.yTop + 0.04, 0, null, 14);
  var xl = x - (L.d / 2 + 0.10);
  L.pos.forEach(function(p){
    var dz = p[0], dy = p[1], s = dz > 0 ? 1 : -1;
    D.tubo(null, [x, yC, dz], [x, yC + dy, dz], 0.022, L.tipoBarra === 'metal' ? 'metal' : 'pintura', L.hexBarra, 10);
    D.bloque(null, 0.05, 0.05, 0.05, 'metal', TOR_GALV2, x, yC + dy, dz, 0.008);
    torLampara(D, G, L, xl, yC + dy, dz, s * (L.abre || 0.12), L.baja || 0.10);
  });
  if(L.caja){
    var c = L.caja;
    D.bloque(null, c.d, c.h, c.w, 'pintura', c.hex, x - 0.03, yC + (c.dy || 0), 0, 0.015);
    if(c.dib) torCalco(G, texRotulo3d(c.dib, 128, 320), c.w * 0.86, c.h * 0.88, x - 0.03 - c.d / 2 - 0.003, yC + (c.dy || 0), 0, 0, -Math.PI / 2, 0, true);
  }
  var luz = new THREE.PointLight(mh ? 0xFFEBCB : 0xEEF4FF, 0.55, 8, 2);
  luz.position.set(xl - 0.7, yC, 0); G.add(luz);
}

/* ═══ armado general ═══ */
function torArmar(c, piezas){
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  /* el estudio sale en sRGB pero en r128 el color hex del material se toma
     como lineal: el negro se veia gris, el arena de Doosan crema y el
     amarillo de Atlas Copco limon. Los colores de marca de este archivo
     estan en sRGB (como en las fotos), asi que aqui se pasan a lineal, en
     los materiales y en el color base al que vuelve el mapa de calor. Y la
     laca de los tonos oscuros refleja menos cielo (solo en esta construccion) */
  var oscuro = function(hex){ var c3 = new THREE.Color(hex); return c3.r + c3.g + c3.b < 0.6; };
  ['pintura', 'mate', 'metal', 'goma', 'vidrio', 'cromo'].forEach(function(t){
    var f = D.M[t];
    D.M[t] = function(hex){
      var m = f(hex ? torLin(hex) : hex);
      if(hex && oscuro(hex) && (t === 'pintura' || t === 'mate')){ m.envMapIntensity = 0.3; if(t === 'pintura'){ m.clearcoat = 0.4; m.roughness = 0.42; } else m.metalness = 0.12; }
      return m;
    };
  });
  var F = c.carc, P = c.puerta, h = c.chasis, W = F.W;
  torChasis(D, h);
  /* la batea bajo la carcasa es el tanque de combustible, con su tapa */
  var yb0 = h.yL + 0.045, bW = c.baseW || W - 0.04;
  D.bloque('TQC1', F.x1 - F.x0 - 0.02, F.y0 - yb0 + 0.01, bW, 'pintura', c.baseHex, (F.x0 + F.x1) / 2, (F.y0 + yb0) / 2, 0, 0.015);
  D.cilindro(null, 0.045, 0.045, 0.04, 'mate', '#16181A', F.x1 - 0.22, (F.y0 + yb0) / 2, bW / 2 + 0.018, [Math.PI / 2, 0, 0], 20);
  D.cilindro(null, 0.02, 0.02, 0.012, 'mate', '#16181A', F.x1 - 0.12, yb0 + 0.01, bW / 2 - 0.03, null, 10);
  var car = torCarcasa(D, G, F, P);
  /* argolla de izaje en el techo */
  var xo = (F.x0 + F.x1) / 2 + (c.dxArgolla || 0);
  D.bloque(null, 0.16, 0.02, 0.10, 'metal', TOR_GALV2, xo, F.y1 + 0.01, W * 0.12, 0.005);
  D.pon(null, new THREE.TorusGeometry(0.05, 0.013, 8, 20), 'metal', TOR_GALV, xo, F.y1 + 0.07, W * 0.12, null);
  if(P) torMotor(D, { x0: P.x0 + 0.02, x1: P.x1 - 0.02, y0: P.y0 + 0.01, y1: P.y1 - 0.01, zA: -W / 2, zB: car.zB - 0.01, yTecho: F.y1 }, c.motor);
  /* tablero: en el costado derecho del bloque delantero o en el frente */
  if(c.panel === 'frente') torPanel(D, G, F.x0, F.y0 + (F.y1 - F.y0) * 0.45, -W * 0.27, Math.PI / 2);
  else torPanel(D, G, (F.x0 + (P ? P.x0 : F.x1)) / 2, F.y0 + Math.min(0.30, (F.y1 - F.y0) * 0.42), -W / 2, 0);
  var Ms = c.mastil; Ms.xCarc = F.x0;
  torMastil(D, G, Ms);
  torCabezal(D, G, Ms, c.lamp);
  /* numero de unidad: placa atras */
  var texN = texNumero3d('#F4F4F2', '#111214');
  torCalco(G, texN, 0.40, 0.125, F.x1 + 0.004, c.yNumero || F.y0 + 0.12, c.zNumero || 0, 0, Math.PI / 2, 0, true);
  if(c.extra) c.extra(D, G, c, car);
  G.traverse(function(m){ if(m.userData && m.userData.base) m.userData.base = torLin(m.userData.base); });
  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ texN.userData.poner(id); };
  G.userData.mirarY = c.alto * 0.45;
  G.userData.dist = c.alto * 2.2 + 1.2;
  return G;
}

/* ═══ cada marca ═══ */

/* Terex RL4: gabinete de polimero color hueso con cantos muy redondeados,
   todo lo demas negro, mastil negro y reflectores cuadrados de aluminio */
function torExtraRL4(D, G, c, car){
  var F = c.carc, W2 = F.W / 2, tT = texRotulo3d(torDibTerex, 512, 96), tR = texRotulo3d(torDibRL4, 256, 96);
  torCalco(G, tT, 0.62, 0.116, 0.30, 0.96, W2 + 0.004, 0, 0, 0);
  torCalco(G, tR, 0.26, 0.098, 1.18, 0.62, W2 + 0.004, 0, 0, 0);
  torCalco(G, tT, 0.50, 0.094, F.x0 - 0.004, 0.98, -0.27, 0, -Math.PI / 2, 0);
  /* en la puerta derecha (se abre con ella) */
  car.mete(torCalco(G, tT, 0.56, 0.105, 0, 0, 0, 0, Math.PI, 0)).position.set(car.lx(0.86), car.ly(0.88), -0.016);
  car.mete(torCalco(G, tR, 0.24, 0.09, 0, 0, 0, 0, Math.PI, 0)).position.set(car.lx(0.62), car.ly(0.66), -0.016);
  /* rejilla de salida del radiador atras y cerraduras de las tapas */
  D.lamas(null, F.x1 + 0.006, 0.76, 1.02, -0.30, 0.30, 6, '#1E2124', 1);
  [[0.40, W2], [1.30, W2]].forEach(function(p){ D.bloque(null, 0.06, 0.03, 0.012, 'mate', '#16181A', p[0], 1.02, p[1] + 0.005, 0.004); });
  /* plataforma para alcanzar las lamparas, delante del mastil */
  D.bloque(null, 0.30, 0.025, 0.56, 'metal', '#3A3F45', c.mastil.x - 0.36, c.chasis.yL + 0.07, 0, 0.006);
  for(var i = 0; i < 6; i++) D.bloque(null, 0.02, 0.012, 0.54, 'metal', '#2A2D31', c.mastil.x - 0.49 + i * 0.052, c.chasis.yL + 0.088, 0, 0.003);
}
function torCfgRL4(){
  return {
    alto: 7.13,
    carc: { forma: 'red', k: 0.17, r: 0.02, x0: -0.05, x1: 1.43, y0: 0.50, y1: 1.22, W: 1.02, hex: '#E4E0D2' },
    baseHex: TOR_NEGRO,
    puerta: { x0: 0.45, x1: 1.28, y0: 0.57, y1: 1.02, rec: 0.56, bisagra: 'atras', ang: 1.92 },
    chasis: { xF: -0.32, xR: 1.45, zL: 0.33, yL: 0.40, hex: TOR_NEGRO, xa: 0.85, R: 0.305, A: 0.15, via: 1.24, rAro: 0.165, aro: '#2A2D31', guarda: TOR_NEGRO,
      lanza: { tipo: 'recta', xh: -1.50, yh: 0.46, hex: TOR_NEGRO, enganche: 'bola', gato: -1.15, cadenas: true },
      patas: [[-0.28, 0.30, -0.42, 1.625], [-0.28, -0.30, -0.42, -1.625], [1.40, 0.30, 1.72, 1.55], [1.40, -0.30, 1.72, -1.55]], hexViga: TOR_NEGRO, pata: 'negro' },
    mastil: { x: -0.17, y0: 0.36, yManga: 2.20, yTop: 6.72, n: 4, s0: 0.15, ds: 0.022, forma: 'cuad', hexManga: TOR_NEGRO, tipoManga: 'pintura',
      hexTramo: '#2A2C30', tipoTramo: 'pintura', yWinch: 1.30, yApoyo1: 0.70, yApoyo2: 1.10 },
    lamp: { tipo: 'MH', w: 0.48, h: 0.44, d: 0.17, hex: '#AEB3B8', tipoCaja: 'metal', bisel: '#959BA1', aletas: false,
      pos: [[0.31, 0.26], [-0.31, 0.26], [0.31, -0.26], [-0.31, -0.26]], yC: 6.65, hexBarra: TOR_NEGRO },
    motor: { motor: '#5E6670', alt: '#6B7480', cil: 2 },
    extra: torExtraRL4
  };
}

/* Doosan LSC: caja color arena con chaflanes, torre galvanizada de 9 m con
   DOOSAN escrito, patas galvanizadas, lanza larga con cadenas */
function torExtraLSC(D, G, c, car){
  var F = c.carc, W2 = F.W / 2, tD = texRotulo3d(torDibDoosan, 512, 200);
  torCalco(G, tD, 0.58, 0.226, 1.18, 1.02, W2 + 0.004, 0, 0, 0);
  car.mete(torCalco(G, tD, 0.52, 0.20, 0, 0, 0, 0, Math.PI, 0)).position.set(car.lx(1.24), car.ly(0.92), -0.016);
  /* rejillas de agujeros cuadrados: costado izquierdo adelante y la cara de atras */
  torCalco(G, texRotulo3d(torDibRejilla('#BFA571'), 256, 256), 0.24, 0.30, 0.55, 1.02, W2 + 0.005, 0, 0, 0, true);
  torCalco(G, texRotulo3d(torDibRejilla('#BFA571'), 256, 256), 0.42, 0.36, F.x1 + 0.005, 1.00, 0, 0, Math.PI / 2, 0, true);
  /* faros traseros redondos y placa DOOSAN */
  [-1, 1].forEach(function(s){
    D.cilindro(null, 0.06, 0.06, 0.02, 'mate', '#16181A', F.x1 + 0.006, 0.74, s * 0.30, [0, 0, Math.PI / 2], 24);
    D.cilindro('LSM', 0.05, 0.05, 0.02, 'vidrio', '#C2241B', F.x1 + 0.016, 0.74, s * 0.30, [0, 0, Math.PI / 2], 24);
  });
  torCalco(G, texRotulo3d(rotuloTexto('DOOSAN', '#FFFFFF', '#1B3F8F', 0.9), 256, 64), 0.22, 0.055, F.x1 + 0.005, 0.66, 0.30, 0, Math.PI / 2, 0, true);
  /* DOOSAN a lo largo del primer tramo de la torre, de arriba abajo */
  var m = c.mastil, s1 = m.s0 - m.ds;
  torCalco(G, texRotulo3d(torDibDoosanMastil, 512, 80), 0.80, 0.125, m.x - s1 / 2 - 0.003, m.yManga + 0.62, 0, 0, -Math.PI / 2, -Math.PI / 2);
  /* cuna donde se acuesta la torre para viajar, atras arriba */
  [-1, 1].forEach(function(s){ D.bloque(null, 0.05, 0.26, 0.04, 'pintura', '#A88F5E', F.x1 - 0.12, F.y1 + 0.13, s * 0.13, 0.008); });
  D.bloque(null, 0.08, 0.04, 0.30, 'goma', '#1A1C1F', F.x1 - 0.12, F.y1 + 0.06, 0, 0.01);
  /* horquilla de giro de la torre al pie */
  [-1, 1].forEach(function(s){ D.bloque(null, 0.20, 0.42, 0.015, 'pintura', '#A88F5E', m.x + 0.04, 0.62, s * (m.s0 / 2 + 0.01), 0.004); });
  D.cilindro(null, 0.022, 0.022, m.s0 + 0.08, 'metal', TOR_GALV2, m.x + 0.04, 0.70, 0, [Math.PI / 2, 0, 0], 12);
}
function torCfgLSC(){
  return {
    alto: 9.0,
    carc: { forma: 'chaflan', k: 0.20, r: 0.02, x0: 0.32, x1: 1.92, y0: 0.56, y1: 1.42, W: 0.86, hex: '#BFA571' },
    baseHex: '#A88F5E',
    puerta: { x0: 0.80, x1: 1.62, y0: 0.62, y1: 1.16, rec: 0.54, bisagra: 'adelante', ang: 1.95 },
    chasis: { xF: -0.05, xR: 1.95, zL: 0.30, yL: 0.43, hex: TOR_NEGRO, xa: 1.15, R: 0.305, A: 0.175, via: 1.067, rAro: 0.165, aro: TOR_NEGRO, guarda: TOR_NEGRO,
      lanza: { tipo: 'recta', xh: -2.30, yh: 0.50, hex: TOR_NEGRO, enganche: 'bola', gato: -1.90, cadenas: true },
      patas: [[0.05, 0.28, 0.05, 1.30], [0.05, -0.28, 0.05, -1.30], [1.88, 0.28, 1.88, 1.30], [1.88, -0.28, 1.88, -1.30]], hexViga: TOR_GALV, tipoViga: 'metal', pata: 'galv' },
    mastil: { x: 0.20, y0: 0.43, yManga: 2.40, yTop: 8.60, n: 5, s0: 0.17, ds: 0.022, forma: 'cuad', hexManga: TOR_GALV, tipoManga: 'metal',
      hexTramo: TOR_GALV, tipoTramo: 'metal', yWinch: 1.30, hexApoyo: '#A88F5E' },
    lamp: { tipo: 'MH', w: 0.50, h: 0.40, d: 0.16, hex: '#1E2023', tipoCaja: 'mate', bisel: '#A9AFB5', aletas: false,
      pos: [[0.29, 0.27], [-0.29, 0.27], [0.40, -0.23], [-0.40, -0.23]], yC: 8.53, hexBarra: TOR_GALV, tipoBarra: 'metal' },
    motor: { motor: '#5F6B78', alt: '#2F5E9E', cil: 3 },
    yNumero: 0.62, zNumero: -0.06,
    extra: torExtraLSC
  };
}

/* Atlas Copco HiLight V5+: carcasa HardHat amarilla redondeada sobre base y
   frente gris oscuro, puerta que se levanta, LED negros de dos lentes */
function torExtraV5(D, G, c, car){
  var F = c.carc, W2 = F.W / 2, GR = '#4E5257';
  /* frente gris con rejilla de lamas, a un lado del mastil */
  D.bloque(null, 0.03, F.y1 - F.y0 - 0.12, F.W - 0.16, 'pintura', GR, F.x0 - 0.012, (F.y0 + F.y1) / 2 - 0.03, 0, 0.01);
  D.lamas(null, F.x0 - 0.03, 0.78, 1.26, -0.44, -0.16, 8, '#2A2D31', -1);
  D.lamas(null, F.x0 - 0.03, 0.78, 1.26, 0.16, 0.44, 8, '#2A2D31', -1);
  var tA = texRotulo3d(torDibAtlas, 512, 384);
  torCalco(G, tA, 0.36, 0.27, 1.17, 0.98, W2 + 0.004, 0, 0, 0);
  car.mete(torCalco(G, tA, 0.34, 0.255, 0, 0, 0, 0, Math.PI, 0)).position.set(car.lx(1.08), car.ly(0.98), -0.016);
  var tH = texRotulo3d(torDibHiLight, 512, 96);
  torCalco(G, tH, 0.40, 0.075, 0.42, 1.20, W2 + 0.004, 0, 0, 0);
  /* paro de emergencia en el frente */
  D.cilindro(null, 0.04, 0.04, 0.015, 'pintura', '#F2C200', F.x0 - 0.035, 1.30, -0.30, [0, 0, Math.PI / 2], 20);
  D.cilindro(null, 0.03, 0.034, 0.035, 'pintura', '#C8201A', F.x0 - 0.06, 1.30, -0.30, [0, 0, Math.PI / 2], 20);
  /* ganchos de izaje y franja gris bajo el amarillo */
  [-1, 1].forEach(function(s){ D.bloque(null, F.x1 - F.x0, 0.05, 0.02, 'pintura', GR, (F.x0 + F.x1) / 2, F.y0 + 0.02, s * (W2 + 0.002), 0.008); });
  /* salida del radiador atras */
  D.lamas(null, F.x1 + 0.006, 0.90, 1.26, -0.32, 0.32, 6, '#2A2D31', 1);
  /* columna gris del mastil hasta la carcasa */
  D.bloque(null, 0.14, 0.38, F.W * 0.5, 'pintura', GR, F.x0 - 0.06, 0.52, 0, 0.012);
}
function torCfgV5(){
  return {
    alto: 7.5,
    carc: { forma: 'red', k: 0.13, r: 0.02, x0: 0.02, x1: 1.40, y0: 0.64, y1: 1.42, W: 1.06, hex: '#F2BF14' },
    baseHex: '#4E5257', baseW: 0.72, yNumero: 0.73,
    puerta: { x0: 0.42, x1: 1.30, y0: 0.70, y1: 1.22, rec: 0.58, bisagra: 'arriba', ang: 1.95 },
    chasis: { xF: -0.28, xR: 1.42, zL: 0.28, yL: 0.34, hex: '#4E5257', xa: 0.80, R: 0.29, A: 0.155, via: 0.945, rAro: 0.165, aro: '#2B2E33', guarda: '#4E5257',
      lanza: { tipo: 'recta', xh: -1.48, yh: 0.50, hex: '#5B6066', enganche: 'ojo', gato: -1.10 },
      patas: [[-0.22, 0.26, -0.22, 1.10], [-0.22, -0.26, -0.22, -1.10], [1.36, 0.26, 1.36, 1.10], [1.36, -0.26, 1.36, -1.10]], hexViga: '#5B6066', pata: 'galv' },
    mastil: { x: -0.12, y0: 0.34, yManga: 2.05, yTop: 7.11, n: 4, s0: 0.18, ds: 0.026, forma: 'cuad', hexManga: '#55595E', tipoManga: 'pintura',
      hexTramo: TOR_GALV, tipoTramo: 'metal', yWinch: 1.55, hexApoyo: '#4E5257', yApoyo1: 0.80, yApoyo2: 1.25 },
    lamp: { tipo: 'COB', w: 0.40, h: 0.42, d: 0.13, hex: '#17191B', aletas: true,
      pos: [[0.30, 0.25], [-0.30, 0.25], [0.30, -0.23], [-0.30, -0.23]], yC: 7.04, hexBarra: TOR_GALV, tipoBarra: 'metal' },
    motor: { motor: '#4D5A66', alt: '#7A8088', cil: 2 },
    extra: torExtraV5
  };
}

/* Generac GLT4-M: carcasa blanca con el frente y la base negros, manga negra,
   LED de dos ventanas y caja naranja GENERAC en el cabezal */
function torExtraGLT4(D, G, c, car){
  var F = c.carc, W2 = F.W / 2, tG = texRotulo3d(torDibGenerac(true), 512, 160), tM = texRotulo3d(torDibGLT4, 384, 96);
  torCalco(G, tG, 0.48, 0.15, 0.78, 1.22, W2 + 0.004, 0, 0, 0);
  torCalco(G, tM, 0.36, 0.09, 0.84, 0.76, W2 + 0.004, 0, 0, 0);
  car.mete(torCalco(G, tG, 0.44, 0.137, 0, 0, 0, 0, Math.PI, 0)).position.set(car.lx(0.68), car.ly(1.16), -0.016);
  car.mete(torCalco(G, tM, 0.32, 0.08, 0, 0, 0, 0, Math.PI, 0)).position.set(car.lx(0.72), car.ly(0.78), -0.016);
  /* del lado izquierdo, en el bloque negro: toma azul y paro */
  D.cilindro(null, 0.04, 0.04, 0.05, 'pintura', '#1F5FB8', 0.02, 0.98, W2 + 0.02, [Math.PI / 2, 0, 0], 20);
  D.cilindro(null, 0.034, 0.034, 0.012, 'pintura', '#F2C200', 0.13, 0.98, W2 + 0.006, [Math.PI / 2, 0, 0], 20);
  D.cilindro(null, 0.025, 0.028, 0.03, 'pintura', '#C8201A', 0.13, 0.98, W2 + 0.022, [Math.PI / 2, 0, 0], 20);
  /* rejilla negra de la toma de aire en el frente */
  D.lamas(null, F.x0 - 0.005, 0.74, 1.24, -0.38, -0.12, 8, '#121416', -1);
}
function torCfgGLT4(){
  return {
    alto: 7.2,
    carc: { forma: 'red', k: 0.05, r: 0.015, x0: -0.15, x1: 1.12, y0: 0.60, y1: 1.38, W: 0.90, hex: '#ECEBE6', hexFrente: TOR_NEGRO },
    baseHex: TOR_NEGRO, baseW: 0.86,
    puerta: { x0: 0.30, x1: 1.02, y0: 0.66, y1: 1.31, rec: 0.56, bisagra: 'adelante', ang: 1.95, hex: '#ECEBE6' },
    chasis: { xF: -0.45, xR: 1.14, zL: 0.30, yL: 0.38, hex: TOR_NEGRO, xa: 0.60, R: 0.29, A: 0.155, via: 1.10, rAro: 0.165, aro: '#E9E9E6', guarda: TOR_NEGRO,
      lanza: { tipo: 'recta', xh: -1.60, yh: 0.47, hex: TOR_NEGRO, enganche: 'ojo', gato: -1.22 },
      patas: [[-0.40, 0.25, -0.62, 1.04], [-0.40, -0.25, -0.62, -1.04], [1.10, 0.30, 1.20, 0.52], [1.10, -0.30, 1.20, -0.52]], hexViga: TOR_NEGRO, pata: 'negro' },
    mastil: { x: -0.30, y0: 0.38, yManga: 2.05, yTop: 6.80, n: 4, s0: 0.16, ds: 0.024, forma: 'cuad', hexManga: TOR_NEGRO, tipoManga: 'pintura',
      hexTramo: TOR_GALV, tipoTramo: 'metal', yWinch: 1.55 },
    lamp: { tipo: 'LED', ventanas: 2, vert: true, w: 0.40, h: 0.44, d: 0.12, hex: '#16181B', aletas: true,
      pos: [[0.33, 0.25], [-0.33, 0.25], [0.33, -0.25], [-0.33, -0.25]], yC: 6.73, hexBarra: TOR_NEGRO,
      caja: { w: 0.15, h: 0.34, d: 0.10, hex: '#E0521C', dy: 0.04, dib: torDibVertical('GENERAC', '#E0521C', '#FFFFFF', false) } },
    motor: { motor: '#4E5966', alt: '#3D4A57', cil: 2 },
    extra: torExtraGLT4
  };
}

/* Generac VTevo K2: carcasa blanca angosta con chaflanes, GENERAC en el
   chaflan, rejilla de lamas atras, patas delanteras a rayas */
function torExtraVTevo(D, G, c, car){
  var F = c.carc, W2 = F.W / 2, k = F.k, tG = texRotulo3d(torDibGenerac(false), 512, 160), tV = texRotulo3d(torDibVTevo, 512, 200);
  [-1, 1].forEach(function(s){
    /* GENERAC en el chaflan de arriba, adelante */
    torCalco(G, tG, 0.52, 0.16, -0.12, F.y1 - k / 2 + 0.004, s * (W2 - k / 2 + 0.004), -s * Math.PI / 4, s > 0 ? 0 : Math.PI, 0);
    torLamasZ(D, 0.48, 0.95, 0.86, 1.28, s * W2, s, 8, '#EEEEEA', '#E4E4E0');
  });
  torCalco(G, tV, 0.62, 0.24, 0.0, 0.90, W2 + 0.004, 0, 0, 0);
  car.mete(torCalco(G, tV, 0.58, 0.226, 0, 0, 0, 0, Math.PI, 0)).position.set(car.lx(0.06), car.ly(0.90), -0.016);
  /* bisagras y cerradura del lado izquierdo (puerta cerrada) */
  [0.78, 1.20].forEach(function(y){ D.bloque(null, 0.05, 0.07, 0.014, 'mate', '#16181A', -0.29, y, W2 + 0.006, 0.003); });
  D.bloque(null, 0.035, 0.05, 0.016, 'mate', '#16181A', 0.36, 1.02, W2 + 0.007, 0.004);
  /* tornillos de la chapa */
  for(var x = -0.40; x <= 1.0; x += 0.28){
    [-1, 1].forEach(function(s){ D.cilindro(null, 0.008, 0.008, 0.006, 'metal', '#9AA0A6', x, F.y0 + 0.05, s * (W2 + 0.003), [Math.PI / 2, 0, 0], 8); });
  }
}
function torCfgVTevo(){
  return {
    alto: 8.0,
    carc: { forma: 'chaflan', k: 0.12, r: 0.015, x0: -0.45, x1: 1.02, y0: 0.62, y1: 1.48, W: 0.86, hex: '#EEEEEA' },
    baseHex: TOR_NEGRO, baseW: 0.86,
    puerta: { x0: -0.30, x1: 0.42, y0: 0.68, y1: 1.30, rec: 0.54, bisagra: 'adelante', ang: 1.95 },
    panel: 'frente',
    chasis: { xF: -0.70, xR: 1.04, zL: 0.30, yL: 0.37, hex: TOR_NEGRO, xa: 0.42, R: 0.29, A: 0.155, via: 1.155, rAro: 0.165, aro: '#B9BEC3', guarda: TOR_NEGRO,
      lanza: { tipo: 'recta', xh: -1.43, yh: 0.47, hex: TOR_NEGRO, enganche: 'ojo', gato: null },
      patas: [[-0.62, 0.25, -0.80, 1.12], [-0.62, -0.25, -0.80, -1.12]], hexViga: TOR_NEGRO, pata: 'rayas',
      gatosTras: [[0.96, 0.44], [0.96, -0.44]] },
    mastil: { x: -0.57, y0: 0.37, yManga: 2.15, yTop: 7.68, n: 4, s0: 0.17, ds: 0.024, forma: 'cuad', hexManga: TOR_NEGRO, tipoManga: 'pintura',
      hexTramo: TOR_GALV, tipoTramo: 'metal', yWinch: 1.60 },
    lamp: { tipo: 'LED', ventanas: 1, w: 0.50, h: 0.36, d: 0.12, hex: '#141618', aletas: true,
      pos: [[0.37, 0.22], [-0.37, 0.22], [0.31, -0.20], [-0.31, -0.20]], yC: 7.60, hexBarra: TOR_NEGRO,
      caja: { w: 0.16, h: 0.30, d: 0.12, hex: '#141618', dy: 0.10 } },
    motor: { motor: '#4E5966', alt: '#3D4A57', cil: 2 },
    dxArgolla: 0.15,
    extra: torExtraVTevo
  };
}

/* LuxTower LUX M11: carcasa blanca con la piel roja, naranja y negra,
   mastil celeste galvanizado, LED blancos de dos paneles y caja LUX */
function torExtraLux(D, G, c, car){
  var F = c.carc, W2 = F.W / 2, tL = texRotulo3d(torDibLux, 1024, 470);
  torCalco(G, tL, 1.22, 0.56, 0.31, 0.95, W2 + 0.004, 0, 0, 0);
  car.mete(torCalco(G, tL, 0.54, 0.25, 0, 0, 0, 0, Math.PI, 0)).position.set(car.lx(0.37), car.ly(0.90), -0.016);
  torCalco(G, texRotulo3d(rotuloTexto('LUXTOWER', '#F1F1EE', '#141414', 0.85), 256, 64), 0.28, 0.07, 0.82, 1.12, -W2 - 0.004, 0, Math.PI, 0, true);
  torCalco(G, texRotulo3d(torDibLuxEmblema, 256, 256), 0.22, 0.22, F.x0 - 0.004, 1.02, -0.30, 0, -Math.PI / 2, 0);
  /* rejilla chica gris en el frente */
  D.bloque(null, 0.012, 0.16, 0.22, 'mate', '#5A5F65', F.x0 - 0.006, 1.18, 0.30, 0.004);
}
function torCfgLux(){
  return {
    alto: 8.0,
    carc: { forma: 'chaflan', k: 0.09, r: 0.015, x0: -0.40, x1: 0.99, y0: 0.62, y1: 1.346, W: 1.00, hex: '#F1F1EE' },
    baseHex: TOR_NEGRO, baseW: 0.96,
    puerta: { x0: 0.10, x1: 0.66, y0: 0.68, y1: 1.20, rec: 0.58, bisagra: 'atras', ang: 1.9 },
    chasis: { xF: -0.62, xR: 1.00, zL: 0.32, yL: 0.37, hex: TOR_NEGRO, xa: 0.40, R: 0.30, A: 0.165, via: 1.21, rAro: 0.165, aro: '#3A3D40', guarda: TOR_NEGRO,
      lanza: { tipo: 'recta', xh: -1.41, yh: 0.45, hex: TOR_NEGRO, enganche: 'ojo', gato: null },
      patas: [[-0.55, 0.30, -0.55, 1.20], [-0.55, -0.30, -0.55, -1.20], [0.95, 0.30, 0.95, 1.20], [0.95, -0.30, 0.95, -1.20]], hexViga: TOR_NEGRO, pata: 'rayas' },
    mastil: { x: -0.52, y0: 0.37, yManga: 2.10, yTop: 7.72, n: 5, s0: 0.17, ds: 0.02, forma: 'red', hexManga: '#86AFC2', tipoManga: 'pintura',
      hexTramo: '#93B9CA', tipoTramo: 'pintura', yWinch: 1.55 },
    lamp: { tipo: 'LED', ventanas: 2, vert: false, w: 0.46, h: 0.30, d: 0.11, hex: '#E8E8E4', tipoCaja: 'pintura', bisel: '#D2D3CF', aletas: true,
      pos: [[0.37, 0.19], [-0.37, 0.19], [0.37, -0.19], [-0.37, -0.19]], yC: 7.66, hexBarra: TOR_NEGRO,
      caja: { w: 0.18, h: 0.40, d: 0.12, hex: '#141414', dy: 0, dib: torDibVertical('LUX', '#141414', '#F07A1A', true) } },
    motor: { motor: '#4E5966', alt: '#55606B', cil: 2 },
    extra: torExtraLux
  };
}

/* que torre es cada equipo; una fila tiene modelo y marca cruzados
   (mod 'GENERAC', marca 'GLT4-M') y tambien tiene que caer en el GLT4-M */
var TOR_CFG = { RL4: torCfgRL4, RL4J: torCfgRL4, RL4V2: torCfgRL4, LSC: torCfgLSC, HILIGHTV5: torCfgV5, GLT4M: torCfgGLT4, VTEVO: torCfgVTevo, LUXM11: torCfgLux };
function torClave(e){
  var m = mod3d(e), k = String((e && e.marca) || '').toUpperCase().replace(/[\s\-_]+/g, '');
  if(/^GLT4M/.test(m) || (/^GENERAC/.test(m) && /^GLT4M/.test(k))) return 'GLT4M';
  if(/^VTEVO/.test(m)) return 'VTEVO';
  if(/^HILIGHTV5/.test(m)) return 'HILIGHTV5';
  if(/^LSC$/.test(m) && /DOOSAN/.test(k)) return 'LSC';
  if(/^LUXM11/.test(m)) return 'LUXM11';
  if(m === 'RL4' || m === 'RL4J' || m === 'RL4V2') return m;
  return null;
}
function torConstruir(clave, piezas){ return torArmar(TOR_CFG[clave.replace(/^TOR\|/, '')](), piezas); }
[['Terex RL4 (RL4, RL4J, RL4V2)', ['RL4', 'RL4J', 'RL4V2']], ['Doosan LSC', ['LSC']], ['Atlas Copco HiLight V5+', ['HILIGHTV5']],
 ['Generac GLT4-M', ['GLT4M']], ['Generac VTevo K2', ['VTEVO']], ['LuxTower LUX M11', ['LUXM11']]].forEach(function(r){
  registrarModelo3d({
    nombre: 'Torre de iluminacion ' + r[0],
    clave: function(e){ var k = torClave(e); return k && r[1].indexOf(k) >= 0 ? 'TOR|' + k : null; },
    construir: function(e, piezas, clave){ return torConstruir(clave, piezas); }
  });
});
