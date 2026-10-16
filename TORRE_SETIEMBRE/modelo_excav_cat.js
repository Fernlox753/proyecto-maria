/* ══════════════════════════════════════════════════════════════════
   EXCAVADORAS CAT SERIE D, CAT 336 NUEVA Y XCMG XE650GK HEV (prefijo xct)
     CAT 374D L (RE-32, RE-33, RE-44) · CAT 349D L (RE-47)
     CAT 336D L y 336D (RE-61, RE-55, RE-1373-AL)
     CAT 336 de la generacion actual (RE-1341-AL, RE-1350-AL)
     XCMG XE650GK HEV, hibrida de 65-68 t (RE-1330-AL)

   Medidas de las hojas de los fabricantes (m):
   · 374D L (Cat AEHQ6064-02, «374D L Hydraulic Excavator», pag. 16-18):
     oruga 5.87 · centro a centro de rodillos 4.705 · trocha de trabajo 3.41
     (2.75 de transporte) · radio de cola 4.015 · despeje 0.84 · cabina 3.54
     · ancho de transporte 3.50 con tejas de 750 · 47 tejas, 8 rodillos y 3
     de arriba. Pluma Mass 7.0 + brazo M2.57 + cucharon HDR 4.6 m3 (la
     configuracion de mina de la hoja). Bajo contrapeso 1.54: no esta en la
     hoja; se toma el del 374F L, que tiene el mismo tren y la misma torna.
   · 349D L (Cat «349D/349D L Dimensions», tren fijo): oruga 5.37 · rodillos
     4.34 · trocha 2.74 · cola 3.77 · despeje 0.51 · cabina 3.21 · bajo
     contrapeso 1.32 · tejas 600. Pluma ME 6.55 + brazo M2.5, cucharon 2.6 m3
     de 1.83 de ancho.
   · 336 nueva (Cat «336 Hydraulic Excavator Specifications», pag. 5): cabina
     3.17 · barandas 3.16 · torna sin pasarelas 3.03 · cola 3.53 · bajo
     contrapeso 1.25 · despeje 0.51 · rodillos 4.04 · trocha 2.59 · tejas
     600 · 49 tejas, 8 rodillos, 2 de arriba · pluma 6.5 + brazo R3.2DB,
     cucharon GD 2.27 m3 con radio de punta 1.76. El largo de la oruga (4.94)
     y el alto de las tapas (2.71) se midieron sobre el dibujo de la hoja.
   · 336D L (sin hoja oficial a mano; ritchiespecs y el mismo tren de la 336):
     rodillos 4.04 · trocha 2.59 · tejas 800 de serie (se dibujan 600) · cola
     3.50 · cabina 3.14 · despeje 0.46 · bajo contrapeso 1.22. El 336D sin L
     se dibuja igual que el 336D L (supuesto: en Peru llegan con tren largo).
   · XCMG XE650GK (d1cm.com y xcmg.com): oruga 5.73 · trocha 2.90 · tejas
     600 · cola 4.11 · bajo contrapeso 1.56 · despeje 0.615 · ancho de
     transporte 4.005 (torna 3.30 con pasarelas de 0.35) · pluma 7.1 · brazo
     2.9 · cucharon 4.0 m3. La HEV pesa 68 t y lleva baterias de 58.7 kWh;
     el cuerpo es el mismo. Centro a centro de rodillos (4.60), cabina (3.50)
     y tapas (3.05) se midieron sobre la foto del fabricante.
   Lo que ninguna hoja acota (frente de la torna, cajas, forma de pluma,
   brazo y cucharon) sale de los dibujos de costado de las mismas hojas y de
   sus fotos: el frente de la torna cae a 1.95 (374D), 1.58 (349D), 1.38
   (336) y 1.95 (XE650) del eje de giro.

   Aspecto (fotos de los folletos): serie D con la cabina negra y, detras,
   una caja negra con rejillas y el CAT blanco, una puerta amarilla con
   ventilas, la puerta grande con dos mallas color bronce y el rotulo negro
   «374D L» con el corte rojo, y encima la caja alzada del enfriador con
   cuatro mallas plateadas; escape negro cortado en bisel. La 336 nueva:
   cabina negra, el CAT/336 negro junto a la cabina, la puerta con cinco
   ranuras, barandas negras atras y el CAT grande en el contrapeso. La XCMG
   HEV va en el verde claro «nueva energia» de la foto oficial (el cucharon
   gris oscuro, el tren negro), cabina negra con reja, escalera y barandas
   negras y el rotulo azul HYBRID.

   Ejes: frente hacia -X, arriba +Y, la izquierda del operador +Z. El eje de
   giro esta en x = 0, z = 0 dentro de un grupo interior que despues se
   corre en X para centrar la maquina. Pluma, brazo y cucharon quedan en
   subgrupos con su pasador como pivote (userData.equipo / palo / cucharon,
   y en el grupo giroX, pie, pivPalo, bisagra y frente), como las
   excavadoras grandes, para que el tajo pueda moverlos.
   ══════════════════════════════════════════════════════════════════ */

var XCT_AM = '#FFCD11', XCT_AM2 = '#D9A900', XCT_NEG = '#1B1D20', XCT_NEG2 = '#121416',
    XCT_VERDE = '#6CCB4C', XCT_VERDE2 = '#4E9E3A', XCT_GRIS = '#2E3135', XCT_BRONCE = '#8E7B57';

/* colores de cada carroceria */
var XCT_COL = {
  cat: { cuerpo: XCT_AM, oscuro: XCT_AM2, faldon: XCT_AM, linea: '#3A3326', tren: '#1D1F22', pluma: XCT_AM, brazo: XCT_AM,
         cuchara: XCT_AM, cil: '#1E2023', contrapeso: XCT_AM, baranda: XCT_NEG, cab: '#1E2023', cabMarco: '#141618',
         techo: '#1E2023', rejilla: '#17191C', guard: XCT_NEG, tapa: XCT_AM },
  xcmg: { cuerpo: XCT_VERDE, oscuro: XCT_VERDE2, faldon: XCT_NEG, linea: '#2A3A26', tren: '#222427', pluma: XCT_VERDE, brazo: XCT_VERDE,
          cuchara: XCT_GRIS, cil: '#1E2023', contrapeso: XCT_VERDE, baranda: XCT_NEG, cab: '#1C1E21', cabMarco: '#111214',
          techo: '#1C1E21', rejilla: '#15171A', guard: '#16181B', tapa: XCT_VERDE }
};

/* ═══ medidas de cada modelo ═══
   TL oruga · TB centro a centro de rodillos · GA trocha · SW teja · GC despeje
   RC radio de cola · YCW bajo contrapeso · UW ancho de la torna · WW pasarela
   YCAB techo de cabina · YTOP techo de las tapas · YBOX techo de la caja del
   enfriador (serie D) · XF frente de la torna · BL pluma · AL brazo · BR radio
   de punta del cucharon · BW ancho del cucharon · peso en t */
var XCT_P = {
  '374DL': { nombre: 'CAT 374D L', rotulo: '374D', sufijo: 'L', tipo: 'catD', peso: 71.1, TL: 5.87, TB: 4.705, GA: 3.41, SW: 0.65,
    zap: 47, nRod: 8, nSup: 3, garras: 2, GC: 0.84, RC: 4.015, YCW: 1.54, UW: 3.40, WW: 0, YCAB: 3.54, YTOP: 2.86, YBOX: 3.40,
    XF: -1.95, BL: 7.0, AL: 2.57, BR: 2.0, BW: 2.05, nD: 5, rake: 0.16 },
  '349DL': { nombre: 'CAT 349D L', rotulo: '349D', sufijo: 'L', tipo: 'catD', peso: 45.8, TL: 5.37, TB: 4.34, GA: 2.74, SW: 0.60,
    zap: 51, nRod: 8, nSup: 2, garras: 3, GC: 0.51, RC: 3.77, YCW: 1.32, UW: 3.15, WW: 0, YCAB: 3.21, YTOP: 2.60, YBOX: 3.08,
    XF: -1.58, BL: 6.55, AL: 2.5, BR: 1.80, BW: 1.83, nD: 5, rake: 0.14 },
  '336DL': { nombre: 'CAT 336D L', rotulo: '336D', sufijo: 'L', tipo: 'catD', peso: 37.0, TL: 4.94, TB: 4.04, GA: 2.59, SW: 0.60,
    zap: 49, nRod: 7, nSup: 2, garras: 3, GC: 0.46, RC: 3.50, YCW: 1.22, UW: 2.99, WW: 0, YCAB: 3.14, YTOP: 2.55, YBOX: 2.88,
    XF: -1.38, BL: 6.5, AL: 3.2, BR: 1.70, BW: 1.60, nD: 5, rake: 0.12 },
  '336N': { nombre: 'CAT 336', rotulo: '336', sufijo: '', tipo: 'catN', peso: 36.6, TL: 4.94, TB: 4.04, GA: 2.59, SW: 0.60,
    zap: 49, nRod: 8, nSup: 2, garras: 3, GC: 0.51, RC: 3.53, YCW: 1.25, UW: 3.03, WW: 0, YCAB: 3.17, YTOP: 2.71,
    XF: -1.38, BL: 6.5, AL: 3.2, BR: 1.76, BW: 1.60, nD: 5, rake: 0.10 },
  'XE650': { nombre: 'XCMG XE650GK HEV', rotulo: 'XE650GK', sufijo: 'HEV', tipo: 'xcmg', peso: 68, TL: 5.73, TB: 4.60, GA: 2.90, SW: 0.60,
    zap: 48, nRod: 8, nSup: 2, garras: 2, GC: 0.615, RC: 4.11, YCW: 1.56, UW: 3.30, WW: 0.35, YCAB: 3.50, YTOP: 3.05,
    XF: -1.95, BL: 7.1, AL: 2.9, BR: 1.95, BW: 2.00, nD: 5, rake: 0.08, fogs: true, opg: true }
};
/* el 336D sin L es el mismo cuerpo */
XCT_P['336D'] = XCT_P['336DL'];

/* ═══ rotulos: solo lienzos dibujados ═══ */
/* texto centrado que se angosta solo para caber; sin fondo queda transparente */
function xctDibTexto(txt, o){
  return function(g, w, h){
    g.clearRect(0, 0, w, h);
    if(o.fondo){ g.fillStyle = o.fondo; g.fillRect(0, 0, w, h); }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = (o.peso || 'bold') + ' ' + Math.round(h * (o.alto || 0.72)) + 'px ' + (o.fuente || '"Arial Black", Arial, sans-serif');
    var sx = Math.min(o.ancho || 1, w * (o.max || 0.92) / Math.max(1, g.measureText(txt).width));
    g.save(); g.translate(w / 2, h * 0.54); g.scale(sx, 1);
    g.fillStyle = o.tinta; g.fillText(txt, 0, 0); g.restore();
  };
}
/* CAT blanco con el triangulo amarillo en la A, en (x0, yc) con alto de letra hl */
function xctLetrasCAT(g, xc, yc, hl, anchoMax){
  g.textAlign = 'left'; g.textBaseline = 'middle';
  g.font = 'bold ' + Math.round(hl) + 'px "Arial Black", Arial, sans-serif';
  var wC = g.measureText('C').width, wA = g.measureText('A').width, wT = g.measureText('CAT').width;
  var sx = Math.min(1, anchoMax / wT), x0 = xc - wT * sx / 2;
  g.save(); g.translate(x0, yc); g.scale(sx, 1);
  g.fillStyle = '#FFFFFF'; g.fillText('CAT', 0, 0);
  var xa = wC + wA / 2;
  g.fillStyle = XCT_AM;
  g.beginPath(); g.moveTo(xa - wA * 0.30, hl * 0.30); g.lineTo(xa + wA * 0.30, hl * 0.30); g.lineTo(xa, hl * 0.02); g.closePath(); g.fill();
  g.restore();
}
/* la franja de la pluma: paralelogramo negro, CAT blanco y el corte rojo al final */
function xctDibBandaCAT(g, w, h){
  g.clearRect(0, 0, w, h);
  g.fillStyle = '#111214';
  g.beginPath(); g.moveTo(w * 0.10, 0); g.lineTo(w, 0); g.lineTo(w * 0.90, h); g.lineTo(0, h); g.closePath(); g.fill();
  g.fillStyle = '#E2401E';
  g.beginPath(); g.moveTo(w * 0.86, h); g.lineTo(w * 0.93, h); g.lineTo(w * 0.995, h * 0.22); g.lineTo(w * 0.94, h * 0.22); g.closePath(); g.fill();
  xctLetrasCAT(g, w * 0.46, h * 0.52, h * 0.72, w * 0.56);
}
/* placa negra con CAT (cabina, contrapeso) y, si va, el modelo debajo */
function xctDibPlacaCAT(modelo){
  return function(g, w, h){
    g.clearRect(0, 0, w, h);
    var r = h * 0.12;
    g.fillStyle = '#111214';
    g.beginPath(); g.moveTo(r, 0); g.lineTo(w - r, 0); g.quadraticCurveTo(w, 0, w, r); g.lineTo(w, h - r); g.quadraticCurveTo(w, h, w - r, h);
    g.lineTo(r, h); g.quadraticCurveTo(0, h, 0, h - r); g.lineTo(0, r); g.quadraticCurveTo(0, 0, r, 0); g.closePath(); g.fill();
    if(modelo){
      xctLetrasCAT(g, w * 0.5, h * 0.36, h * 0.44, w * 0.80);
      g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.font = 'bold ' + Math.round(h * 0.24) + 'px Arial, sans-serif';
      g.fillText(modelo, w * 0.5, h * 0.78);
      g.fillStyle = '#E2401E';
      g.beginPath(); g.moveTo(w * 0.86, h); g.lineTo(w * 0.94, h); g.lineTo(w, h * 0.55); g.lineTo(w, h * 0.40); g.closePath(); g.fill();
    } else xctLetrasCAT(g, w * 0.5, h * 0.54, h * 0.70, w * 0.86);
  };
}
/* rotulo del modelo de la serie D: negro, cifras blancas, la L chica y el corte rojo */
function xctDibModeloD(txt, suf){
  return function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#111214'; g.fillRect(0, 0, w * 0.86, h);
    g.beginPath(); g.moveTo(w * 0.86, 0); g.lineTo(w * 0.93, 0); g.lineTo(w * 0.86, h); g.closePath(); g.fill();
    g.fillStyle = '#E2401E';
    g.beginPath(); g.moveTo(w * 0.93, 0); g.lineTo(w, 0); g.lineTo(w * 0.93, h); g.lineTo(w * 0.86, h); g.closePath(); g.fill();
    g.fillStyle = '#FFFFFF'; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.62) + 'px "Arial Black", Arial, sans-serif';
    g.fillText(txt, w * 0.08, h * 0.55, w * 0.58);
    if(suf){ g.font = 'bold ' + Math.round(h * 0.40) + 'px Arial, sans-serif'; g.fillText(suf, w * 0.70, h * 0.62); }
  };
}
/* XCMG: etiqueta negra con el triangulo del logo, XCMG blanco y la cola azul */
function xctDibXCMG(g, w, h){
  g.clearRect(0, 0, w, h);
  g.fillStyle = '#121416';
  g.beginPath(); g.moveTo(w * 0.04, 0); g.lineTo(w * 0.96, 0); g.lineTo(w, h * 0.5); g.lineTo(w * 0.96, h); g.lineTo(w * 0.04, h); g.lineTo(0, h * 0.5);
  g.closePath(); g.fill();
  g.strokeStyle = '#1E73C8'; g.lineWidth = h * 0.08;
  g.beginPath(); g.moveTo(w * 0.86, h * 0.12); g.quadraticCurveTo(w * 0.95, h * 0.5, w * 0.84, h * 0.90); g.stroke();
  /* el logo: triangulo en un cuadro */
  var lx = w * 0.10, ly = h * 0.22, ls = h * 0.56;
  g.strokeStyle = '#FFFFFF'; g.lineWidth = h * 0.06; g.strokeRect(lx, ly, ls, ls);
  g.fillStyle = '#FFFFFF';
  g.beginPath(); g.moveTo(lx + ls * 0.18, ly + ls * 0.22); g.lineTo(lx + ls * 0.82, ly + ls * 0.22); g.lineTo(lx + ls * 0.5, ly + ls * 0.80); g.closePath(); g.fill();
  g.textAlign = 'left'; g.textBaseline = 'middle';
  g.font = 'bold italic ' + Math.round(h * 0.62) + 'px "Arial Black", Arial, sans-serif';
  g.fillText('XCMG', w * 0.27, h * 0.54, w * 0.56);
}
/* HYBRID sobre el degradado azul de la HEV */
function xctDibHybrid(g, w, h){
  var gr = g.createLinearGradient(0, 0, w, h);
  gr.addColorStop(0, '#0E3E86'); gr.addColorStop(0.55, '#1F6FD0'); gr.addColorStop(1, '#4FB6F0');
  g.fillStyle = gr;
  g.beginPath(); g.moveTo(w * 0.25, 0); g.lineTo(w, 0); g.lineTo(w, h); g.lineTo(0, h); g.closePath(); g.fill();
  /* pixeles claros que se deshacen, como en la grafica */
  g.fillStyle = 'rgba(255,255,255,0.35)';
  for(var i = 0; i < 26; i++){ var x = w * (0.35 + 0.6 * ((i * 37) % 26) / 26), y = h * (((i * 11) % 13) / 13); g.fillRect(x, y, w * 0.035, w * 0.035); }
  g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold ' + Math.round(h * 0.26) + 'px "Arial Black", Arial, sans-serif';
  g.fillText('HYBRID', w * 0.60, h * 0.70, w * 0.70);
}

/* ═══ la excavadora ═══ */
function xctConstruir(P, piezas){
  var G = new THREE.Group(), MG = new THREE.Group();
  G.add(MG);
  var D = kitDetalle(MG, piezas);
  var bloque = D.bloque, perfil = D.perfil, perfilX = D.perfilX, tubo = D.tubo, cilindro = D.cilindro,
      pon = D.pon, reg = D.reg, M = D.M;
  var TIPO = P.tipo, CAT = TIPO !== 'xcmg', C = XCT_COL[CAT ? 'cat' : 'xcmg'];
  var s = Math.pow(P.peso / 75, 1 / 3);

  /* ═══ ayudas ═══ */
  /* lo que se arma dentro de fn pasa a un subgrupo con el pivote en (x, y) */
  var sub = function(x, y, fn){
    var n0 = MG.children.length;
    fn();
    var g = new THREE.Group();
    MG.children.slice(n0).forEach(function(m){ MG.remove(m); m.position.x -= x; m.position.y -= y; g.add(m); });
    g.position.set(x, y, 0);
    MG.add(g);
    return g;
  };
  /* contorno en planta (x,z) extruido en alto de y0 a y1 */
  var planta = function(code, pts, y0, y1, tipo, hex, r){
    var g = geoPerfilB(pts.map(function(p){ return [p[0], -p[1]]; }), y1 - y0, (y0 + y1) / 2, r === undefined ? 0.04 : r);
    g.rotateX(-Math.PI / 2);
    return pon(code, g, tipo, hex);
  };
  /* caja entre dos puntos del plano XY: largo a lo largo, alto de canto, ancho en Z */
  var placa = function(code, a, b, alto, ancho, zc, tipo, hex, r){
    var dx = b[0] - a[0], dy = b[1] - a[1];
    return bloque(code, Math.hypot(dx, dy), alto, ancho, tipo, hex, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, zc, r, [0, 0, Math.atan2(dy, dx)]);
  };
  /* muchas copias de una pieza chica en una sola malla: q = [x,y,z, rx,ry,rz] */
  var muchos = function(code, geo, tipo, hex, qs){
    var inst = new THREE.InstancedMesh(geo, M[tipo](hex), qs.length), d = new THREE.Object3D();
    qs.forEach(function(q, i){
      d.position.set(q[0], q[1], q[2]); d.rotation.set(q[3] || 0, q[4] || 0, q[5] || 0); d.updateMatrix();
      inst.setMatrixAt(i, d.matrix);
    });
    inst.instanceMatrix.needsUpdate = true;
    return reg(code, inst, hex);
  };
  /* pasador con su buje y tapas: cruza en Z */
  var perno = function(code, p, z, r, largo){
    cilindro(code, r, r, largo, 'metal', '#454A50', p[0], p[1], z, [Math.PI / 2, 0, 0], 20);
    [-1, 1].forEach(function(l){ cilindro(null, r * 1.25, r * 1.25, 0.05, 'mate', '#2A2D31', p[0], p[1], z + l * (largo / 2 + 0.02), [Math.PI / 2, 0, 0], 16); });
  };
  /* letrero pintado; ry: 0 mira a +Z, PI a -Z, -PI/2 a -X, PI/2 a +X */
  var letrero = function(tex, w, h, x, y, z, ry, rz){
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, transparent: true,
      roughness: 0.5, metalness: 0.05, polygonOffset: true, polygonOffsetFactor: -2 }));
    m.position.set(x, y, z); m.rotation.set(0, ry || 0, rz || 0);
    MG.add(m); return m;
  };
  /* letrero sobre un costado (lado +1 mira a +Z) a lo largo de la direccion (dx,dy), siempre derecho */
  var letreroDir = function(tex, w, h, p, z, lado, dx, dy){
    if(lado > 0){ if(dx < 0){ dx = -dx; dy = -dy; } return letrero(tex, w, h, p[0], p[1], z, 0, Math.atan2(dy, dx)); }
    if(dx > 0){ dx = -dx; dy = -dy; }
    return letrero(tex, w, h, p[0], p[1], z, Math.PI, Math.atan2(dy, -dx));
  };
  /* letrero curvo sobre el contrapeso (cilindro alrededor del eje de giro) */
  var curvo = function(tex, R, h, y, span){
    var m = new THREE.Mesh(new THREE.CylinderGeometry(R, R, h, 24, 1, true, Math.PI / 2 - span / 2, span),
      new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -2 }));
    m.position.y = y; MG.add(m); return m;
  };
  /* rejilla de lamas en una cara que mira a +Z (lado 1) o a -Z (lado -1) */
  var rejillaZ = function(code, x0, x1, y0, y1, z, lado, n, hexMarco, hexLama){
    bloque(code, x1 - x0 + 0.08, y1 - y0 + 0.08, 0.04, 'mate', hexMarco, (x0 + x1) / 2, (y0 + y1) / 2, z + lado * 0.012, 0.015);
    var paso = (y1 - y0) / n, qs = [];
    for(var i = 0; i < n; i++) qs.push([(x0 + x1) / 2, y0 + paso * (i + 0.5), z + lado * 0.045, lado * 0.6, 0, 0]);
    muchos(null, new THREE.BoxGeometry(x1 - x0, paso * 0.55, 0.035), 'mate', hexLama || '#0B0C0E', qs);
  };
  /* malla de acero en un marco (las puertas del enfriador): fondo, malla y marco */
  var mallaZ = function(code, x0, x1, y0, y1, z, lado, hexMalla, hexMarco){
    bloque(code, x1 - x0, y1 - y0, 0.03, 'mate', '#16181A', (x0 + x1) / 2, (y0 + y1) / 2, z + lado * 0.005, 0.01);
    bloque(null, x1 - x0 - 0.06, y1 - y0 - 0.06, 0.012, 'metal', hexMalla, (x0 + x1) / 2, (y0 + y1) / 2, z + lado * 0.022, 0.004);
    var n = Math.max(3, Math.round((y1 - y0) / 0.07)), qs = [];
    for(var i = 1; i < n; i++) qs.push([(x0 + x1) / 2, y0 + (y1 - y0) * i / n, z + lado * 0.032, 0, 0, 0]);
    muchos(null, new THREE.BoxGeometry(x1 - x0 - 0.08, 0.012, 0.012), 'mate', '#2A2620', qs);
    [[x0, y0, x1, y0], [x0, y1, x1, y1], [x0, y0, x0, y1], [x1, y0, x1, y1]].forEach(function(q){
      bloque(null, Math.max(0.05, q[2] - q[0] + 0.05), Math.max(0.05, q[3] - q[1] + 0.05), 0.03, 'pintura', hexMarco,
        (q[0] + q[2]) / 2, (q[1] + q[3]) / 2, z + lado * 0.030, 0.01);
    });
  };
  /* rejilla en una cara de arriba: lamas a lo largo de Z */
  var rejillaY = function(code, x0, x1, z0, z1, y, n, hexMarco){
    bloque(code, x1 - x0 + 0.08, 0.04, z1 - z0 + 0.08, 'mate', hexMarco, (x0 + x1) / 2, y + 0.012, (z0 + z1) / 2, 0.015);
    var paso = (x1 - x0) / n, qs = [];
    for(var i = 0; i < n; i++) qs.push([x0 + paso * (i + 0.5), y + 0.045, (z0 + z1) / 2, 0, 0, 0.55]);
    muchos(null, new THREE.BoxGeometry(paso * 0.55, 0.035, z1 - z0), 'mate', '#0B0C0E', qs);
  };
  /* faro de trabajo rectangular mirando a -X */
  var faroT = function(x, y, z, ancho){
    var w = ancho || 0.24;
    bloque(null, 0.12, 0.17, w, 'mate', '#1E2124', x, y, z, 0.025);
    bloque('LSM', 0.03, 0.12, w - 0.06, 'vidrio', '#F4EDCF', x - 0.065, y, z, 0.01);
  };
  var interp = function(poly, a){
    for(var i = 1; i < poly.length; i++){
      if(a <= poly[i][0]){ var f = (a - poly[i - 1][0]) / (poly[i][0] - poly[i - 1][0]); return poly[i - 1][1] + f * (poly[i][1] - poly[i - 1][1]); }
    }
    return poly[poly.length - 1][1];
  };
  var marco = function(o, u, v){ return function(a, b){ return [o[0] + u[0] * a + v[0] * b, o[1] + u[1] * a + v[1] * b]; }; };
  var dist2 = function(a, b){ return Math.hypot(b[0] - a[0], b[1] - a[1]); };
  /* punto a distancia la de A y lb de B, del lado que dice ref */
  var cruce = function(A, la, B, lb, ref){
    var d = Math.max(1e-6, dist2(A, B)), ex = [(B[0] - A[0]) / d, (B[1] - A[1]) / d];
    var x = (la * la - lb * lb + d * d) / (2 * d), y = Math.sqrt(Math.max(0, la * la - x * x));
    var n = [-ex[1], ex[0]];
    if(n[0] * ref[0] + n[1] * ref[1] < 0){ n[0] = -n[0]; n[1] = -n[1]; }
    return [A[0] + ex[0] * x + n[0] * y, A[1] + ex[1] * x + n[1] * y];
  };

  /* ═══ medidas derivadas ═══ */
  var UW = P.UW, ZU = UW / 2, YCW = P.YCW, YD = YCW + 0.24, YT = P.YTOP;
  var XF = P.XF;                                  /* frente de la torna (medido en los dibujos) */
  var XC0 = P.RC - 1.05 * s;                      /* frente del contrapeso */
  var Lc = 1.72 + 0.16 * s, Wc = 0.94 + 0.08 * s; /* cabina */
  var zL0 = ZU - Wc - 0.04;                       /* borde interior de la cabina y de la sala de radiadores */
  var zR1 = -ZU + 0.98 * s;                       /* borde interior de tanques y sala de bombas */
  var zb = (zL0 + zR1) / 2;                       /* plano de la pluma, entre la cabina y los tanques */
  var Wb = 0.84 * s, Wa = 0.60 * s;               /* ancho de pluma y brazo */
  var F = [XF + 1.0 * s, YCW + 0.80 * s];         /* pie de la pluma */
  var xT1 = XF + 0.92 * s;                        /* fin de la caja de baterias */
  var xT2 = xT1 + 1.18 * s;                       /* fin del tanque de combustible */
  var xT3 = xT2 + 1.00 * s;                       /* fin del tanque hidraulico, empieza la sala de bombas */
  var xE0 = F[0] + 1.45 * s;                      /* empieza la sala del motor */
  var ZCW = Math.sqrt(P.RC * P.RC - ZU * ZU);      /* esquina del contrapeso sobre el radio de cola */
  var xL0 = XF + Lc + 0.06;                       /* detras de la cabina */

  /* ═══ tren de rodaje ═══ */
  var yc = (P.TL - P.TB) / 2, tP = 0.05, hG = 0.05, Rp = yc - (hG + tP / 2);
  var per = 2 * P.TB + 2 * Math.PI * Rp, nZ = P.zap || Math.round(per / 0.26), paso = per / nZ;
  var rRod = 0.12 * s, yRod = (yc - Rp) + tP / 2 + 0.12 + rRod;
  var rGuia = Rp - tP / 2 - 0.13;
  var wF = Math.min(0.62 * s, P.SW * 0.9);        /* ancho del bastidor de la oruga */
  var yBas0 = yRod + 0.02, yBas1 = yc + Rp - tP / 2 - 0.12 - 0.20 * s;
  var geoRod = (function(){
    var wR = 0.50 * s, r = rRod, pts = [[0.04, -wR / 2], [r * 1.25, -wR / 2], [r * 1.25, -wR / 2 + 0.05], [r, -wR / 2 + 0.07],
      [r, -0.07], [r * 0.82, -0.05], [r * 0.82, 0.05], [r, 0.07], [r, wR / 2 - 0.07], [r * 1.25, wR / 2 - 0.05], [r * 1.25, wR / 2], [0.04, wR / 2]];
    var g = new THREE.LatheGeometry(pts.map(function(p){ return new THREE.Vector2(p[0], p[1]); }), 24);
    g.rotateX(Math.PI / 2); return g;
  })();
  [-1, 1].forEach(function(lado){
    var zc = lado * P.GA / 2, code = lado > 0 ? 'CLH' : 'CRH';
    /* tejas, garras, eslabones y pasadores siguiendo el ovalo */
    var tejas = [], garras = [], esl = [], pas = [];
    for(var i = 0; i < nZ; i++){
      var sp = (i + 0.5) * paso, x, y, nx, ny, a;
      if(sp < P.TB){ x = -P.TB / 2 + sp; y = yc - Rp; nx = 0; ny = -1; }
      else if(sp < P.TB + Math.PI * Rp){ a = -Math.PI / 2 + (sp - P.TB) / Rp; x = P.TB / 2 + Math.cos(a) * Rp; y = yc + Math.sin(a) * Rp; nx = Math.cos(a); ny = Math.sin(a); }
      else if(sp < 2 * P.TB + Math.PI * Rp){ x = P.TB / 2 - (sp - P.TB - Math.PI * Rp); y = yc + Rp; nx = 0; ny = 1; }
      else { a = Math.PI / 2 + (sp - 2 * P.TB - Math.PI * Rp) / Rp; x = -P.TB / 2 + Math.cos(a) * Rp; y = yc + Math.sin(a) * Rp; nx = Math.cos(a); ny = Math.sin(a); }
      var rz = Math.atan2(ny, nx) - Math.PI / 2, tx = Math.cos(rz), ty = Math.sin(rz);
      tejas.push([x, y, zc, 0, 0, rz]);
      var off = P.garras === 3 ? [-0.30, 0, 0.30] : [-0.26, 0.24];
      off.forEach(function(f, j){
        var hh = P.garras === 3 ? [0.55, 0.8, 1][j] : 1;
        garras.push([x + nx * (tP / 2 + hG * hh / 2) + tx * f * paso, y + ny * (tP / 2 + hG * hh / 2) + ty * f * paso, zc, 0, 0, rz]);
      });
      [-1, 1].forEach(function(l){ esl.push([x - nx * (tP / 2 + 0.06), y - ny * (tP / 2 + 0.06), zc + l * 0.17 * s, 0, 0, rz]); });
      pas.push([x - nx * (tP / 2 + 0.06) + tx * paso / 2, y - ny * (tP / 2 + 0.06) + ty * paso / 2, zc, Math.PI / 2, 0, 0]);
    }
    /* acero de oruga: oscuro y mate, los eslabones con algo de brillo de rodadura */
    muchos(code, new THREE.BoxGeometry(paso * 0.93, tP, P.SW), 'mate', '#383C41', tejas);
    muchos(code, new THREE.BoxGeometry(0.045, hG, P.SW - 0.01), 'mate', '#2E3236', garras);
    muchos(code, new THREE.BoxGeometry(paso * 0.97, 0.12, 0.10 * s), 'metal', '#3E4349', esl);
    muchos(null, new THREE.CylinderGeometry(0.05 * s, 0.05 * s, 0.46 * s, 10), 'metal', '#50565D', pas);
    /* pernos de las tejas: cuatro por teja, sobre los eslabones */
    var pt = [];
    tejas.forEach(function(q){
      var c = Math.cos(q[5]), sn = Math.sin(q[5]), nx2 = -sn, ny2 = c;
      [-0.12, 0.12].forEach(function(f){ [-1, 1].forEach(function(l){
        pt.push([q[0] + nx2 * (tP / 2 + 0.012) + c * f * paso, q[1] + ny2 * (tP / 2 + 0.012) + sn * f * paso, zc + l * 0.17 * s, 0, 0, q[5]]);
      }); });
    });
    muchos(null, new THREE.BoxGeometry(0.035, 0.024, 0.035), 'metal', '#3C4046', pt);

    /* rueda guia adelante: dos llantas, pestana al medio, masa */
    var xi = -P.TB / 2;
    [-1, 1].forEach(function(l){ cilindro(code, rGuia, rGuia, 0.13 * s, 'metal', '#3B4046', xi, yc, zc + l * 0.17 * s, [Math.PI / 2, 0, 0], 36); });
    cilindro(code, rGuia + 0.07, rGuia + 0.07, 0.10 * s, 'metal', '#444A50', xi, yc, zc, [Math.PI / 2, 0, 0], 36);
    [-1, 1].forEach(function(l){
      cilindro(null, rGuia * 0.45, rGuia * 0.45, 0.10, 'pintura', C.tren, xi, yc, zc + l * 0.29 * s, [Math.PI / 2, 0, 0], 20);
    });
    /* catarina atras: disco, dientes, mando final y motor de traslacion hacia adentro */
    var xs = P.TB / 2;
    cilindro(code, rGuia * 0.92, rGuia * 0.92, 0.12 * s, 'metal', '#3F444A', xs, yc, zc, [Math.PI / 2, 0, 0], 32);
    var dts = [], nd = 23;
    for(var k = 0; k < nd; k++){
      var ad = k / nd * Math.PI * 2;
      dts.push([xs + Math.cos(ad) * (rGuia * 0.97), yc + Math.sin(ad) * (rGuia * 0.97), zc, 0, 0, ad - Math.PI / 2]);
    }
    muchos(code, new THREE.BoxGeometry(0.09 * s, 0.16 * s, 0.13 * s), 'metal', '#4A5056', dts);
    cilindro(code, rGuia * 0.62, rGuia * 0.70, 0.30 * s, 'pintura', C.tren, xs, yc, zc - lado * 0.26 * s, [Math.PI / 2, 0, 0], 28);
    var pernosM = [];
    for(var b2 = 0; b2 < 14; b2++){
      var ab = b2 / 14 * Math.PI * 2;
      pernosM.push([xs + Math.cos(ab) * rGuia * 0.52, yc + Math.sin(ab) * rGuia * 0.52, zc - lado * 0.42 * s, Math.PI / 2, 0, 0]);
    }
    muchos(null, new THREE.CylinderGeometry(0.025, 0.025, 0.05, 6), 'metal', '#6E737A', pernosM);
    cilindro(code, rGuia * 0.48, rGuia * 0.52, 0.42 * s, 'metal', '#3A3F45', xs, yc, zc - lado * 0.60 * s, [Math.PI / 2, 0, 0], 24);
    /* bastidor de la oruga: seccion pentagonal que bota la tierra */
    var xb0 = xi + rGuia * 0.55, xb1 = xs - rGuia * 1.05, hw = wF / 2;
    perfilX(code, [[zc - hw, yBas0], [zc + hw, yBas0], [zc + hw, yBas1 - 0.12 * s], [zc + hw * 0.35, yBas1], [zc - hw * 0.35, yBas1], [zc - hw, yBas1 - 0.12 * s]],
      xb1 - xb0, (xb0 + xb1) / 2, 'pintura', C.tren, 0.04);
    /* caja de la catarina y guarda del motor */
    perfilX(code, [[zc - hw * 1.15, yBas0 + 0.05], [zc + hw * 0.9, yBas0 + 0.05], [zc + hw * 0.9, yBas1 - 0.05], [zc - hw * 1.15, yBas1 + 0.05]],
      0.80 * s, xs - rGuia * 0.75, 'pintura', C.tren, 0.04);
    /* tensor de la rueda guia */
    bloque(code, rGuia * 1.6, 0.30 * s, hw * 1.2, 'pintura', C.tren, xi + rGuia * 1.05, yc - 0.02, zc, 0.04);
    /* la 336 nueva lleva una tapa lisa larga en el bastidor; las demas, guardas de cadena abajo */
    if(TIPO === 'catN'){
      bloque(code, (xb1 - xb0) * 0.78, 0.30 * s, 0.05, 'pintura', C.tren, (xb0 + xb1) / 2 - 0.1, (yBas0 + yBas1) / 2 + 0.02, zc + lado * (hw + 0.03), 0.02);
      [-0.30, 0.30].forEach(function(f){
        bloque(null, 0.24, 0.05, 0.02, 'metal', '#7C8288', (xb0 + xb1) / 2 + f * (xb1 - xb0), (yBas0 + yBas1) / 2 + 0.10, zc + lado * (hw + 0.065), 0.01);
      });
    }
    /* rodillos de abajo y de arriba */
    var rods = [], nR = P.nRod;
    for(var r = 0; r < nR; r++){
      var xr = xi + rGuia * 0.95 + (r + 0.5) * (xs - rGuia * 0.95 - (xi + rGuia * 0.95)) / nR;
      rods.push([xr, yRod, zc, 0, 0, 0]);
    }
    muchos(code, geoRod, 'mate', '#3A3F45', rods);
    var sup = [], rSup = 0.09 * s, ySup = yc + Rp - tP / 2 - 0.12 - rSup;
    for(var q = 0; q < P.nSup; q++){
      var xq = xi + (q + 1) * (xs - xi) / (P.nSup + 1);
      sup.push([xq, ySup, zc, Math.PI / 2, 0, 0]);
      bloque(null, 0.16 * s, ySup - yBas1 + 0.06, 0.12, 'pintura', C.tren, xq, (ySup + yBas1) / 2, zc - lado * 0.12 * s, 0.02);
    }
    muchos(code, new THREE.CylinderGeometry(rSup, rSup, 0.40 * s, 16), 'metal', '#3A3F45', sup);
    [0.30, 0.68].forEach(function(f){
      bloque(code, 1.0 * s, 0.28, 0.05, 'pintura', C.tren, xi + (xs - xi) * f, yRod - 0.02, zc + lado * (hw + 0.03), 0.02);
    });
    /* peldano en el bastidor */
    var xp = lado > 0 ? XF + 0.55 : XF + 0.40;
    bloque(null, 0.50, 0.04, 0.24, 'metal', '#50565D', xp, yBas1 - 0.10, zc + lado * (hw + 0.13), 0.01);
    [-0.22, 0.22].forEach(function(dx){ bloque(null, 0.05, 0.16, 0.22, 'pintura', C.tren, xp + dx, yBas1 - 0.04, zc + lado * (hw + 0.11), 0.01); });
  });

  /* bastidor central en X, tornamesa y rodamiento de giro */
  var zi = P.GA / 2 - wF / 2 + 0.04, yCb0 = P.GC, yCb1 = Math.min(yBas1 + 0.05, YCW - 0.30);
  planta(null, [[-1.55 * s, -zi], [1.55 * s, -zi], [0.75 * s, -zi * 0.42], [0.75 * s, zi * 0.42], [1.55 * s, zi], [-1.55 * s, zi],
    [-0.75 * s, zi * 0.42], [-0.75 * s, -zi * 0.42]], yCb0, yCb1, 'pintura', C.tren, 0.05);
  cilindro(null, 1.02 * s, 1.10 * s, YCW - 0.14 - yCb1, 'pintura', C.tren, 0, (yCb1 + YCW - 0.14) / 2, 0, null, 40);
  cilindro('RG1', 1.18 * s, 1.18 * s, 0.14, 'metal', '#3B4046', 0, YCW - 0.07, 0, null, 48);
  (function(){
    var qs = [];
    for(var i = 0; i < 36; i++){ var a = i / 36 * Math.PI * 2; qs.push([Math.cos(a) * 1.10 * s, YCW - 0.15, Math.sin(a) * 1.10 * s, 0, 0, 0]); }
    muchos(null, new THREE.CylinderGeometry(0.025, 0.025, 0.06, 6), 'metal', '#70767D', qs);
  })();

  /* ═══ superestructura ═══ */
  /* bastidor de la torna: en CAT su canto es amarillo, con una linea oscura y planchas de pisar */
  planta(null, [[XF, -ZU], [XC0 + 0.05, -ZU], [XC0 + 0.05, ZU], [XF, ZU]], YCW + 0.03, YD, 'pintura', C.faldon, 0.03);
  [-1, 1].forEach(function(l){
    bloque(null, XC0 - XF - 0.06, 0.025, 0.02, 'mate', C.linea, (XF + XC0) / 2, YD - 0.07, l * (ZU + 0.006), 0.005);
  });
  if(CAT){
    /* planchas antideslizantes en el canto (las placas de pisar de la foto) */
    var qsP = [];
    for(var xp2 = XF + 0.35; xp2 < XC0 - 0.2; xp2 += 0.62 * s) [-1, 1].forEach(function(l){ qsP.push([xp2, YD - 0.15, l * (ZU + 0.008), 0, 0, 0]); });
    muchos(null, new THREE.BoxGeometry(0.30 * s, 0.10, 0.012), 'mate', '#6A5B2A', qsP);
  }
  /* contrapeso: el radio de cola en planta */
  var cw = [[XC0, -ZU]];
  for(var i = 0; i <= 16; i++){ var zz = -ZU + i * UW / 16; cw.push([Math.sqrt(P.RC * P.RC - zz * zz), zz]); }
  cw.push([XC0, ZU]);
  planta(null, cw, YCW, YT + 0.06, 'pintura', C.contrapeso, 0.07);
  bloque(null, 0.10, 0.08, UW - 0.3, 'pintura', C.oscuro, XC0 + 0.08, YT + 0.08, 0, 0.02);
  /* orejas de izaje y luces traseras */
  [-1, 1].forEach(function(l){
    pon(null, new THREE.TorusGeometry(0.09 * s, 0.03 * s, 8, 16), 'metal', '#3A3F45', XC0 + 0.45 * s, YT + 0.13, l * (ZU - 0.45), [0, Math.PI / 2, 0]);
    bloque(null, 0.06, 0.16, 0.30, 'mate', '#1E2124', ZCW - 0.02, YT - 0.20, l * (ZU - 0.32), 0.02);
    bloque('LSM', 0.03, 0.10, 0.24, 'vidrio', TIPO === 'catN' ? '#E2541E' : '#C2241B', ZCW + 0.015, YT - 0.20, l * (ZU - 0.32), 0.01);
  });

  /* centro: sala del motor con su tapa, rejilla y alternador debajo */
  bloque('ENG1', XC0 - xE0, YT - YD, zL0 - zR1, 'pintura', C.cuerpo, (xE0 + XC0) / 2, (YD + YT) / 2, (zL0 + zR1) / 2, 0.05);
  bloque('ENG1', XC0 - xE0 - 0.35, 0.10, zL0 - zR1 - 0.25, 'pintura', C.tapa, (xE0 + XC0) / 2 - 0.05, YT + 0.05, (zL0 + zR1) / 2, 0.04);
  rejillaY('ENG1', xE0 + 0.35, xE0 + 1.25 * s, zR1 + 0.30, zL0 - 0.30, YT + 0.10, 8, C.rejilla);
  /* alternador al frente del motor, visto por la rejilla de arriba */
  cilindro('AL1', 0.13 * s, 0.13 * s, 0.22 * s, 'metal', '#5A6068', xE0 + 0.70 * s, YT + 0.02, zR1 + 0.55 * s, [Math.PI / 2, 0, 0], 18);
  /* lado derecho: caja de baterias, tanques y sala de bombas */
  bloque('BAT', xT1 - XF - 0.02, 0.90 * s, ZU + zR1, 'pintura', C.cuerpo, (XF + xT1) / 2, YD + 0.45 * s, (zR1 - ZU) / 2, 0.05);
  [-0.30, 0.30].forEach(function(dz){ faroT(XF - 0.07, YD + 0.62 * s, (zR1 - ZU) / 2 + dz * s, 0.22); });
  bloque('TQC1', xT2 - xT1 - 0.04, YT - YD, ZU + zR1, 'pintura', C.cuerpo, (xT1 + xT2) / 2, (YD + YT) / 2, (zR1 - ZU) / 2, 0.06);
  cilindro(null, 0.11, 0.11, 0.10, 'mate', '#1E2124', (xT1 + xT2) / 2, YT + 0.05, -ZU + 0.40, null, 18);
  bloque(null, 0.06, 0.55, 0.035, 'vidrio', '#9BB7C9', xT1 + 0.30, (YD + YT) / 2, -ZU - 0.012, 0.01);
  bloque('TQH1', xT3 - xT2 - 0.04, YT - YD, ZU + zR1, 'pintura', C.cuerpo, (xT2 + xT3) / 2, (YD + YT) / 2, (zR1 - ZU) / 2, 0.06);
  cilindro(null, 0.08, 0.08, 0.04, 'vidrio', '#9BB7C9', (xT2 + xT3) / 2, YD + 0.70, -ZU - 0.01, [Math.PI / 2, 0, 0], 18);
  bloque('PYM', XC0 - xT3, YT - YD, ZU + zR1, 'pintura', C.cuerpo, (xT3 + XC0) / 2, (YD + YT) / 2, (zR1 - ZU) / 2, 0.06);
  if(TIPO === 'catN'){
    /* 336: tambien del lado derecho la puerta de bombas con ranuras */
    [0, 1, 2, 3].forEach(function(k){
      bloque(null, XC0 - xT3 - 0.60, 0.07, 0.02, 'mate', '#7A4F25', (xT3 + XC0) / 2, YD + 0.30 + k * (YT - YD - 0.55) / 3, -ZU - 0.010, 0.02);
    });
  } else rejillaZ('PYM', xT3 + 0.25 * s, XC0 - 0.35 * s, YD + 0.35, YT - 0.32, -ZU, -1, 9, C.rejilla);
  /* prefiltro del aire sobre la sala de bombas */
  cilindro(null, 0.15 * s, 0.15 * s, 0.38 * s, 'mate', '#1E2124', xT3 + 0.45 * s, YT + 0.19 * s, -ZU + 0.45 * s, null, 20);
  cilindro(null, 0.18 * s, 0.18 * s, 0.05, 'mate', '#1E2124', xT3 + 0.45 * s, YT + 0.40 * s, -ZU + 0.45 * s, null, 20);
  /* planchas antideslizantes arriba */
  [[xT1 + 0.10, xT3 - 0.08], [xT3 + 0.08, xT3 + 0.95 * s]].forEach(function(r2){
    bloque(null, r2[1] - r2[0], 0.02, ZU + zR1 - 0.20, 'mate', '#2A2C2F', (r2[0] + r2[1]) / 2, YT + 0.008, (zR1 - ZU) / 2, 0.005);
  });
  /* camara trasera y bocina */
  bloque(null, 0.12, 0.10, 0.14, 'mate', '#16181B', P.RC - 0.10, YT + 0.17, 0, 0.02);
  cilindro(null, 0.03, 0.03, 0.04, 'vidrio', '#0E141A', P.RC - 0.03, YT + 0.17, 0, [0, 0, Math.PI / 2], 12);
  cilindro(null, 0.05, 0.08, 0.12, 'mate', '#202326', XF + 0.12, YD - 0.10, zb + 0.6, [0, 0, Math.PI / 2], 12);
  /* juntas de puertas, bisagras y manijas del lado derecho */
  [xT1, xT2, xT3, xT3 + (XC0 - xT3) / 2].forEach(function(x){
    bloque(null, 0.02, YT - YD - 0.12, 0.02, 'mate', '#121314', x, (YD + YT) / 2, -(ZU + 0.006), 0.005);
    bloque(null, 0.10, 0.035, 0.035, 'cromo', null, x - 0.12, YD + (YT - YD) * 0.55, -(ZU + 0.02), 0.008);
  });
  /* centro adelante: tapa de la valvula principal detras del pie de la pluma */
  bloque('VV1', xE0 - (F[0] + 0.72 * s), 0.62 * s, zL0 - zR1 - 0.06, 'pintura', C.cuerpo, (xE0 + F[0] + 0.72 * s) / 2, YD + 0.31 * s, (zL0 + zR1) / 2, 0.05);
  /* reductor de giro asomando junto al pie de la pluma */
  cilindro('RG1', 0.17 * s, 0.17 * s, 0.75 * s, 'metal', '#454A50', F[0] + 0.55 * s, YD + 0.37 * s, zR1 + 0.20 * s, null, 18);
  cilindro('RG1', 0.21 * s, 0.21 * s, 0.10, 'metal', '#3A3F45', F[0] + 0.55 * s, YD + 0.05, zR1 + 0.20 * s, null, 18);
  /* engrase centralizado: bomba y deposito al frente del tanque */
  bloque('SEN', 0.22, 0.42, 0.34, 'mate', '#2A2D31', XF + 0.30, YD + 0.90 * s + 0.21, -ZU + 0.30, 0.03);
  cilindro('SEN', 0.11, 0.11, 0.34, 'vidrio', '#E8E4D2', XF + 0.30, YD + 0.90 * s + 0.59, -ZU + 0.30, null, 16);
  /* contra incendios: dos botellas rojas detras de la cabina */
  [0, 1].forEach(function(j){
    var xb = xL0 + 0.22 + j * 0.30;
    cilindro('SCI', 0.11, 0.11, 0.55, 'pintura', '#B3201C', xb, YT + 0.30, zL0 + 0.28, null, 18);
    pon('SCI', new THREE.SphereGeometry(0.11, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), 'pintura', '#B3201C', xb, YT + 0.575, zL0 + 0.28);
  });

  /* ═══ lado izquierdo, detras de la cabina: cada carroceria a su modo ═══ */
  var xCaja = xL0 + 0.55 * s, xPuerta = xL0 + 1.15 * s;
  var texNum = texNumero3d(null, CAT ? '#141516' : '#141516');
  if(TIPO === 'catD'){
    /* caja negra del aire acondicionado y filtro de cabina, con rejillas y el CAT blanco */
    bloque('AAC', xCaja - xL0, YT - YD, ZU - zL0, 'pintura', XCT_NEG, (xL0 + xCaja) / 2, (YD + YT) / 2, (zL0 + ZU) / 2, 0.04);
    [0.25, 0.55].forEach(function(f){ rejillaZ(null, xL0 + 0.06 + f * (xCaja - xL0 - 0.12) - 0.08, xL0 + 0.06 + f * (xCaja - xL0 - 0.12) + 0.06, YT - 0.62 * s, YT - 0.18, ZU, 1, 5, '#0F1011', '#050506'); });
    letrero(texRotulo3d(xctDibPlacaCAT(null), 256, 120), (xCaja - xL0) * 0.92, (xCaja - xL0) * 0.43, (xL0 + xCaja) / 2, YD + 0.32 * s, ZU + 0.015, 0);
    /* puerta amarilla angosta con ventilas punzonadas */
    bloque('ENG1', xPuerta - xCaja, YT - YD, ZU - zL0, 'pintura', C.cuerpo, (xCaja + xPuerta) / 2, (YD + YT) / 2, (zL0 + ZU) / 2, 0.04);
    var qsV = [];
    for(var cv = 0; cv < 3; cv++) for(var fv = 0; fv < 4; fv++) qsV.push([xCaja + 0.12 + cv * 0.075, YT - 0.25 - fv * 0.11 * s, ZU + 0.008, 0, 0, 0]);
    muchos(null, new THREE.BoxGeometry(0.045, 0.08 * s, 0.01), 'mate', '#0E0F10', qsV);
    rejillaZ(null, xCaja + 0.36 * s, xPuerta - 0.12, YD + 0.45 * s, YD + 0.85 * s, ZU, 1, 4, '#3A3326', '#151515');
    bloque(null, 0.02, YT - YD - 0.10, 0.02, 'mate', '#121314', xCaja, (YD + YT) / 2, ZU + 0.006, 0.005);
    bloque(null, 0.02, YT - YD - 0.10, 0.02, 'mate', '#121314', xPuerta, (YD + YT) / 2, ZU + 0.006, 0.005);
    /* puerta grande del enfriador: dos mallas color bronce */
    bloque('RAD1', XC0 - xPuerta, YT - YD, ZU - zL0, 'pintura', C.cuerpo, (xPuerta + XC0) / 2, (YD + YT) / 2, (zL0 + ZU) / 2, 0.05);
    var wM = (XC0 - xPuerta - 0.45) / 2;
    [0, 1].forEach(function(k){
      var x0 = xPuerta + 0.15 + k * (wM + 0.15);
      mallaZ('RAD1', x0, x0 + wM, YD + 0.42 * s, YT - 0.16, ZU, 1, XCT_BRONCE, C.cuerpo);
    });
    bloque(null, 0.18, 0.04, 0.04, 'cromo', null, XC0 - 0.40, YD + 0.30, ZU + 0.02, 0.008);
    letrero(texRotulo3d(xctDibModeloD(P.rotulo, P.sufijo), 384, 96), 1.00 * s, 0.25 * s, XC0 - 0.62 * s, YD + 0.20 * s, ZU + 0.018, 0);
    /* caja alzada del enfriador: cuatro mallas plateadas al costado y rejilla arriba */
    var yB = P.YBOX, zB0 = zL0 - 0.35 * s;
    bloque('RAD1', XC0 - xPuerta + 0.06, yB - YT + 0.04, ZU - zB0, 'pintura', C.cuerpo, (xPuerta + XC0) / 2, (YT + yB) / 2 - 0.02, (zB0 + ZU) / 2, 0.05);
    var wS4 = (XC0 - xPuerta - 0.30) / 4;
    for(var m4 = 0; m4 < 4; m4++){
      var xs4 = xPuerta + 0.12 + m4 * (wS4 + 0.02);
      if(yB - YT > 0.22) mallaZ(null, xs4, xs4 + wS4, YT + 0.06, yB - 0.05, ZU, 1, '#B9BDBF', '#C9CDD0');
    }
    rejillaY('RAD1', xPuerta + 0.20, XC0 - 0.20, zB0 + 0.15, ZU - 0.15, yB + 0.02, 10, C.rejilla);
    /* escape negro cortado en bisel, detras de la caja */
    var xEs = XC0 - 0.30 * s, zEs = zB0 - 0.30 * s;
    cilindro('ENG1', 0.10 * s, 0.10 * s, 0.75 * s, 'mate', '#16181A', xEs, YT + 0.38 * s, zEs, null, 16);
    var bis = cilindro(null, 0.12 * s, 0.12 * s, 0.30 * s, 'mate', '#16181A', xEs, YT + 0.80 * s, zEs, [0, 0, 0.0], 16);
    (function(){
      /* el bisel: se bajan los vertices de arriba hacia adelante */
      var pa = bis.geometry.attributes.position;
      for(var v = 0; v < pa.count; v++) if(pa.getY(v) > 0) pa.setY(v, pa.getY(v) + pa.getX(v) * 0.9);
      pa.needsUpdate = true; bis.geometry.computeVertexNormals();
    })();
    /* barandas negras arriba */
    D.baranda([[xL0 + 0.25, zL0 - 0.30], [xPuerta - 0.10, zL0 - 0.30]], YT, 0.92, C.baranda);
  } else if(TIPO === 'catN'){
    /* 336: panel amarillo junto a la cabina con la placa CAT 336 y puerta con cinco ranuras */
    bloque('AAC', xCaja - xL0 + 0.20, YT - YD, ZU - zL0, 'pintura', C.cuerpo, (xL0 + xCaja + 0.20) / 2, (YD + YT) / 2, (zL0 + ZU) / 2, 0.05);
    perfil(null, [[xL0 + 0.02, YD + 0.06], [xL0 + 0.18, YD + 0.06], [xL0 + 0.02, YT - 0.30]], 0.02, ZU + 0.012, 'pintura', XCT_NEG, 0.004);
    letrero(texRotulo3d(xctDibPlacaCAT(P.rotulo), 220, 240), 0.52 * s, 0.57 * s, (xL0 + xCaja + 0.20) / 2 + 0.04, YD + (YT - YD) * 0.48, ZU + 0.016, 0);
    bloque('RAD1', XC0 - xCaja - 0.20, YT - YD, ZU - zL0, 'pintura', C.cuerpo, (xCaja + 0.20 + XC0) / 2, (YD + YT) / 2, (zL0 + ZU) / 2, 0.05);
    for(var rn = 0; rn < 5; rn++){
      var yr = YD + 0.32 + rn * (YT - YD - 0.55) / 4;
      bloque('RAD1', XC0 - xCaja - 0.85, 0.075, 0.03, 'mate', '#7A4F25', (xCaja + XC0) / 2 + 0.08, yr, ZU + 0.006, 0.03);
      bloque(null, XC0 - xCaja - 0.85, 0.02, 0.012, 'mate', '#3A2614', (xCaja + XC0) / 2 + 0.08, yr + 0.035, ZU + 0.022, 0.004);
    }
    bloque(null, 0.02, YT - YD - 0.10, 0.02, 'mate', '#121314', xCaja + 0.20, (YD + YT) / 2, ZU + 0.006, 0.005);
    [0, 1].forEach(function(k){ bloque(null, 0.10, 0.10, 0.02, 'mate', '#16181A', xCaja + 0.45 + k * 0.85, YD + 0.12, ZU + 0.008, 0.01); });
    /* escape negro chico con la punta curva, atras a la derecha */
    var xEn = XC0 - 0.20, zEn = zR1 + 0.20;
    cilindro('ENG1', 0.08, 0.08, 0.30, 'mate', '#16181A', xEn, YT + 0.20, zEn, null, 14);
    tubo(null, [xEn, YT + 0.34, zEn], [xEn + 0.12, YT + 0.52, zEn], 0.075, 'mate', '#16181A', 14);
    /* barandas negras arriba, a la izquierda, tres postes */
    D.baranda([[xL0 + 0.30, ZU - 0.07], [xL0 + 1.10 * s, ZU - 0.07], [xL0 + 1.90 * s, ZU - 0.07]], YT, 0.45, C.baranda);
  } else {
    /* XE650GK HEV: lado verde con rejilla, el modelo, HYBRID y escalera atras */
    bloque('AAC', xCaja - xL0, YT - YD, ZU - zL0, 'pintura', C.cuerpo, (xL0 + xCaja) / 2, (YD + YT) / 2, (zL0 + ZU) / 2, 0.04);
    rejillaZ(null, xL0 + 0.10, xCaja - 0.10, YD + 0.30, YD + 0.62, ZU, 1, 5, '#2A3326', '#0D0F0D');
    bloque('RAD1', XC0 - xCaja, YT - YD, ZU - zL0, 'pintura', C.cuerpo, (xCaja + XC0) / 2, (YD + YT) / 2, (zL0 + ZU) / 2, 0.05);
    rejillaZ('RAD1', xCaja + 0.30, xCaja + 1.25 * s, YT - 0.55, YT - 0.15, ZU, 1, 4, '#2A3326', '#0D0F0D');
    bloque(null, 0.02, YT - YD - 0.10, 0.02, 'mate', '#121314', xCaja, (YD + YT) / 2, ZU + 0.006, 0.005);
    letrero(texRotulo3d(xctDibTexto(P.rotulo, { tinta: '#121314' }), 384, 96), 0.95, 0.24, XC0 - 0.85 * s, YT - 0.48, ZU + 0.014, 0);
    letrero(texRotulo3d(xctDibTexto(P.sufijo, { tinta: '#FFFFFF', fondo: '#1E6FC8' }), 160, 80), 0.22, 0.11, XC0 - 0.22 * s, YT - 0.55, ZU + 0.014, 0);
    letrero(texRotulo3d(xctDibHybrid, 512, 256), 1.25 * s, 0.62 * s, XC0 - 0.70 * s, YD + 0.36 * s, ZU + 0.014, 0);
    /* escalera vertical al costado, de la pasarela arriba, con aros */
    var xEsc = XC0 - 1.45 * s, zEsc = ZU + 0.10;
    [-0.22, 0.22].forEach(function(dx){ bloque(null, 0.06, YT - YD + 0.15, 0.07, 'pintura', C.baranda, xEsc + dx, (YD + YT) / 2, zEsc, 0.015); });
    var qsE = [];
    for(var pe = 1; pe < 5; pe++) qsE.push([xEsc, YD + (YT - YD) * pe / 5, zEsc, 0, 0, 0]);
    muchos(null, new THREE.BoxGeometry(0.40, 0.035, 0.12), 'metal', '#45494F', qsE);
    /* escape y silenciador atras, al centro */
    cilindro('ENG1', 0.12, 0.12, 0.55, 'mate', '#16181A', XC0 - 0.45, YT + 0.30, zR1 + 0.35, null, 16);
    cilindro(null, 0.14, 0.12, 0.08, 'mate', '#0E0F10', XC0 - 0.45, YT + 0.60, zR1 + 0.35, null, 16);
    /* barandas negras altas arriba, a los dos lados (tres arcos como en la foto) */
    D.baranda([[xL0 + 0.25, ZU - 0.07], [xL0 + 1.0 * s, ZU - 0.07], [XC0 - 0.05, ZU - 0.07]], YT, 0.92, C.baranda);
    D.baranda([[xT1 + 0.12, zR1 - 0.06], [xT1 + 0.12, -ZU + 0.07], [XC0 - 0.05, -ZU + 0.07]], YT, 0.92, C.baranda);
  }
  /* en CAT, baranda del lado derecho sobre los tanques */
  if(CAT) D.baranda([[xT1 + 0.12, zR1 - 0.06], [xT1 + 0.12, -ZU + 0.07], [xT3 - 0.10, -ZU + 0.07]], YT, TIPO === 'catN' ? 0.45 : 0.92, C.baranda);

  /* numero de unidad a los costados del contrapeso */
  [-1, 1].forEach(function(l){
    var m = new THREE.Mesh(new THREE.PlaneGeometry(0.80 * s, 0.25 * s), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5,
      polygonOffset: true, polygonOffsetFactor: -2 }));
    m.position.set((XC0 + ZCW) / 2 + 0.05, YT - 0.18 * s, l * (ZU + 0.012)); m.rotation.y = l > 0 ? 0 : Math.PI;
    MG.add(m);
  });
  /* rotulo trasero en la curva del contrapeso */
  if(CAT) curvo(texRotulo3d(xctDibPlacaCAT(null), 400, 180), P.RC + 0.075, 0.52 * s, (YCW + YT) / 2 + 0.10, 0.30 * 4.0 / P.RC);
  else curvo(texRotulo3d(xctDibTexto('XCMG', { tinta: '#121314', peso: 'bold italic' }), 512, 128),
             P.RC + 0.075, 0.42, (YCW + YT) / 2 + 0.10, 0.40);

  /* ═══ pasarelas a los costados (XCMG) ═══ */
  if(P.WW > 0){
    [[xL0 + 0.05, XC0 - 0.10, 1], [xT1 + 0.05, XC0 - 0.10, -1]].forEach(function(w){
      var x0 = w[0], x1 = w[1], l = w[2], zc2 = l * (ZU + P.WW / 2);
      bloque(null, x1 - x0, 0.04, P.WW, 'metal', '#4A4F55', (x0 + x1) / 2, YD - 0.06, zc2, 0.01);
      var nl = Math.round((x1 - x0) / 0.09), qs = [];
      for(var j = 0; j < nl; j++) qs.push([x0 + (j + 0.5) * (x1 - x0) / nl, YD - 0.025, zc2, 0, 0, 0]);
      muchos(null, new THREE.BoxGeometry(0.02, 0.03, P.WW - 0.04), 'metal', '#2E3237', qs);
      bloque(null, x1 - x0, 0.10, 0.03, 'pintura', C.cuerpo, (x0 + x1) / 2, YD - 0.03, l * (ZU + P.WW), 0.01);
      for(var m2 = 0; m2 < 4; m2++){
        var xm = x0 + 0.15 + m2 * (x1 - x0 - 0.30) / 3;
        bloque(null, 0.06, 0.06, P.WW, 'pintura', C.faldon, xm, YD - 0.11, l * (ZU + P.WW / 2), 0.01);
      }
    });
  }

  /* peldanos plegados en la caja de baterias y pasamanos de subida */
  [YD + 0.10, YD + 0.48 * s].forEach(function(y){
    bloque(null, 0.32, 0.035, 0.42, 'metal', '#4A4F55', XF - 0.12, y, -ZU + 0.30, 0.008);
    bloque(null, 0.04, 0.10, 0.42, 'pintura', C.cuerpo, XF - 0.27, y + 0.03, -ZU + 0.30, 0.01);
  });
  tubo(null, [XF + 0.05, YD + 0.30, -ZU - 0.06], [xT1 - 0.05, YT - 0.10, -ZU - 0.06], 0.022, 'pintura', C.baranda, 10);
  tubo(null, [XF + 0.05, YD + 0.30, -ZU - 0.06], [XF + 0.05, YD + 0.30, -ZU + 0.02], 0.022, 'pintura', C.baranda, 10);
  tubo(null, [xT1 - 0.05, YT - 0.10, -ZU - 0.06], [xT1 - 0.05, YT - 0.10, -ZU + 0.02], 0.022, 'pintura', C.baranda, 10);
  /* espejo derecho */
  tubo(null, [xT1 + 0.12, YT + 0.40, -ZU + 0.07], [XF + 0.10, YT + 1.05, -ZU + 0.10], 0.025, 'pintura', C.baranda, 10);
  bloque(null, 0.06, 0.55, 0.36, 'mate', '#16181B', XF + 0.06, YT + 1.20, -ZU + 0.12, 0.03);
  bloque(null, 0.015, 0.48, 0.30, 'cromo', null, XF + 0.025, YT + 1.20, -ZU + 0.12, 0.004);

  /* ═══ cabina negra ═══ */
  (function(){
    var x0 = XF + 0.04, x1 = XF + Lc, z0 = zL0 + 0.05, z1 = ZU - 0.03, y0 = YD, y1 = P.YCAB;
    var cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, wz = z1 - z0, lx = x1 - x0;
    var ySill = y0 + (TIPO === 'catD' ? 0.30 : 0.42), yR = y1 - 0.13, rk = P.rake || 0.1;
    var xPost = x0 + 0.60 * lx, pw = 0.085;
    var cBajo = C.cab, cMarco = C.cabMarco;
    bloque('CBN', lx, 0.14, wz, 'pintura', cMarco, cx, y0 + 0.07, cz, 0.03);
    bloque('CBN', lx - 0.02, ySill - y0 - 0.14, 0.06, 'pintura', cBajo, cx, (y0 + 0.14 + ySill) / 2, z1 - 0.03, 0.02);
    bloque('CBN', lx - 0.02, ySill - y0 - 0.14, 0.06, 'pintura', cBajo, cx, (y0 + 0.14 + ySill) / 2, z0 + 0.03, 0.02);
    bloque('CBN', 0.08, yR - y0 - 0.14, wz, 'pintura', cBajo, x1 - 0.04, (y0 + 0.14 + yR) / 2, cz, 0.02);
    bloque('CBN', 0.06, 0.16, wz, 'pintura', cBajo, x0 + 0.03, y0 + 0.22, cz, 0.02);
    /* parantes: los de adelante inclinados hacia atras */
    [z0 + pw / 2, z1 - pw / 2].forEach(function(z){
      placa('CBN', [x0 + pw / 2, ySill - 0.05], [x0 + rk + pw / 2, yR], pw, pw, z, 'pintura', cMarco, 0.02);
      bloque('CBN', pw, yR - ySill, pw, 'pintura', cMarco, x1 - pw / 2 - 0.02, (ySill + yR) / 2, z, 0.02);
    });
    bloque('CBN', pw * 0.8, yR - ySill, pw * 0.8, 'pintura', cMarco, xPost, (ySill + yR) / 2, z1 - pw / 2, 0.02);
    bloque('CBN', lx, 0.07, pw, 'pintura', cMarco, cx, ySill - 0.02, z1 - pw / 2, 0.015);
    bloque('CBN', lx, 0.07, pw, 'pintura', cMarco, cx, ySill - 0.02, z0 + pw / 2, 0.015);
    /* la cabina de la serie D tiene la esquina de atras redondeada arriba (techo con curva) */
    if(TIPO === 'catD'){
      var curvaT = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, wz, 16, 1, false, 0, Math.PI / 2), M.pintura(cMarco));
      curvaT.rotation.x = Math.PI / 2; curvaT.position.set(x1 - 0.24, yR - 0.10, cz);
      reg('CBN', curvaT, cMarco);
    }
    /* vidrios: parabrisas inclinado, el de abajo, puerta, ventana trasera izquierda y costado derecho */
    placa(null, [x0 + 0.03, ySill], [x0 + rk + 0.03, yR - 0.02], 0.03, wz - 0.14, cz, 'vidrio', '#1A2A3A', 0.005);
    bloque(null, 0.03, ySill - y0 - 0.20, wz - 0.16, 'vidrio', '#1A2A3A', x0 + 0.02, (y0 + 0.30 + ySill) / 2, cz, 0.005);
    perfil(null, [[x0 + pw, ySill + 0.02], [xPost - 0.05, ySill + 0.02], [xPost - 0.05, yR - 0.03], [x0 + rk + pw, yR - 0.03]], 0.025, z1 - 0.012, 'vidrio', '#1A2A3A', 0.005);
    perfil(null, [[xPost + 0.05, ySill + 0.02], [x1 - pw - 0.03, ySill + 0.02], [x1 - pw - 0.03, yR - 0.03], [xPost + 0.05, yR - 0.03]], 0.025, z1 - 0.012, 'vidrio', '#1A2A3A', 0.005);
    perfil(null, [[x0 + pw, ySill + 0.02], [x1 - pw - 0.03, ySill + 0.02], [x1 - pw - 0.03, yR - 0.03], [x0 + rk + pw, yR - 0.03]], 0.025, z0 + 0.012, 'vidrio', '#1A2A3A', 0.005);
    bloque(null, 0.025, (yR - ySill) * 0.55, wz - 0.25, 'vidrio', '#1A2A3A', x1 + 0.005, yR - (yR - ySill) * 0.33, cz, 0.005);
    if(TIPO === 'catD') bloque(null, xPost - x0 - 0.20, ySill - y0 - 0.26, 0.02, 'vidrio', '#1A2A3A', (x0 + xPost) / 2 + 0.04, (y0 + 0.16 + ySill) / 2, z1 + 0.003, 0.005);
    /* techo con alero y escotilla */
    bloque('CBN', lx + 0.14, 0.13, wz + 0.10, 'pintura', C.techo, cx - 0.01, yR + 0.065, cz, TIPO === 'catN' ? 0.03 : 0.06);
    bloque(null, lx * 0.45, 0.04, wz * 0.55, 'mate', '#202326', cx + 0.12, yR + 0.15, cz, 0.015);
    /* interior: asiento, consolas y monitor */
    bloque(null, 0.50, 0.14, 0.50, 'mate', '#2A2C30', cx + 0.20, y0 + 0.62, cz, 0.05);
    bloque(null, 0.14, 0.70, 0.50, 'mate', '#2A2C30', cx + 0.48, y0 + 1.00, cz, 0.05);
    [-1, 1].forEach(function(l){ bloque(null, 0.55, 0.16, 0.16, 'mate', '#1E2023', cx + 0.15, y0 + 0.78, cz + l * 0.36, 0.03); });
    bloque(null, 0.05, 0.20, 0.26, 'mate', '#101112', x0 + rk + 0.20, ySill + 0.25, z0 + 0.20, 0.02);
    /* limpiaparabrisas */
    tubo(null, [x0 + 0.01, ySill + 0.10, cz - 0.20], [x0 + rk * 0.6, ySill + 0.75, cz + 0.12], 0.012, 'mate', '#111', 6);
    /* manija, bisagras y asideros del lado de la puerta */
    bloque(null, 0.16, 0.035, 0.04, 'cromo', null, x0 + 0.22, ySill - 0.10, z1 + 0.025, 0.008);
    [ySill + 0.20, yR - 0.25].forEach(function(y){ bloque(null, 0.06, 0.10, 0.04, 'mate', '#202327', xPost - 0.03, y, z1 + 0.02, 0.01); });
    tubo(null, [x1 + 0.08, y0 + 0.20, z1 - 0.05], [x1 + 0.08, yR - 0.30, z1 - 0.05], 0.022, 'pintura', C.baranda, 10);
    tubo(null, [x0 - 0.06, y0 + 0.35, z1 + 0.05], [x0 + rk * 0.7 - 0.06, yR - 0.40, z1 + 0.05], 0.020, 'cromo', null, 10);
    /* faros del techo y baliza */
    [-1, 1].forEach(function(l){ faroT(x0 - 0.02, yR + 0.24, cz + l * wz * 0.28, 0.20); bloque(null, 0.10, 0.10, 0.04, 'mate', '#1E2124', x0 + 0.06, yR + 0.17, cz + l * wz * 0.28, 0.01); });
    var bal = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4, roughness: 0.3 }));
    bal.position.set(x1 - 0.25, yR + 0.13, z1 - 0.15); MG.add(bal);
    /* espejo izquierdo */
    tubo(null, [x0 + 0.10, ySill, z1 + 0.04], [x0 - 0.18, ySill + 0.45, z1 + 0.22], 0.02, 'mate', '#1E2124', 8);
    bloque(null, 0.05, 0.34, 0.22, 'mate', '#16181B', x0 - 0.20, ySill + 0.62, z1 + 0.24, 0.02);
    bloque(null, 0.012, 0.30, 0.18, 'cromo', null, x0 - 0.225, ySill + 0.62, z1 + 0.24, 0.004);
    /* reja frontal (FOGS) */
    if(P.fogs){
      var xg = x0 - 0.16, yg0 = y0 + 0.30, yg1 = yR + 0.02;
      [z0 + 0.04, z1 - 0.04].forEach(function(z){
        bloque(null, 0.08, yg1 - yg0, 0.08, 'pintura', C.guard, xg, (yg0 + yg1) / 2, z, 0.02);
        bloque(null, 0.24, 0.06, 0.06, 'pintura', C.guard, xg + 0.10, yg1 - 0.05, z, 0.01);
        bloque(null, 0.24, 0.06, 0.06, 'pintura', C.guard, xg + 0.10, yg0 + 0.10, z, 0.01);
      });
      [yg0 + 0.05, yg1 - 0.03, (yg0 + yg1) / 2].forEach(function(y){ tubo(null, [xg, y, z0 + 0.04], [xg, y, z1 - 0.04], 0.03, 'pintura', C.guard, 10); });
      for(var gb = 1; gb < 7; gb++){
        var zg = z0 + 0.04 + gb * (wz - 0.08) / 7;
        tubo(null, [xg, yg0, zg], [xg, yg1, zg], 0.022, 'pintura', C.guard, 8);
      }
    }
    /* proteccion de techo (OPG) */
    if(P.opg){
      var yo = yR + 0.32;
      [[x0 + 0.05, z0 + 0.05], [x0 + 0.05, z1 - 0.05], [x1 - 0.10, z0 + 0.05], [x1 - 0.10, z1 - 0.05]].forEach(function(p){
        tubo(null, [p[0], yR + 0.10, p[1]], [p[0], yo, p[1]], 0.03, 'pintura', C.guard, 8);
      });
      [z0 + 0.05, z1 - 0.05].forEach(function(z){ tubo(null, [x0 - 0.05, yo, z], [x1 - 0.05, yo, z], 0.035, 'pintura', C.guard, 8); });
      for(var ob = 0; ob < 5; ob++){
        var xo = x0 + 0.05 + ob * (lx - 0.15) / 4;
        tubo(null, [xo, yo + 0.02, z0 + 0.05], [xo, yo + 0.02, z1 - 0.05], 0.025, 'pintura', C.guard, 8);
      }
    }
  })();

  /* ═══ equipo de trabajo: pose de excavacion ═══ */
  var BL = P.BL, AL = P.AL, R = P.BR, kB = 0.13 * BL;
  var alfa = 252 * Math.PI / 180, beta = 287 * Math.PI / 180;
  var ua = [Math.cos(alfa), Math.sin(alfa)], va = [ua[1], -ua[0]];
  var pB = [Math.cos(beta), Math.sin(beta)], qB = [pB[1], -pB[0]];
  /* perfil del cucharon en unidades de R: (a lo largo del radio de punta, hacia el lomo) */
  var envol = [[0.10, -0.40], [-0.02, -0.22], [-0.06, 0.02], [0.02, 0.24], [0.20, 0.40], [0.45, 0.48], [0.70, 0.42], [0.88, 0.25], [0.97, 0.04]];
  var dirD = [0.39, -0.92], lD = 0.24;
  var puntaL = [0.97 + dirD[0] * lD, 0.04 + dirD[1] * lD];
  var punta = [pB[0] * puntaL[0] * R + qB[0] * puntaL[1] * R, pB[1] * puntaL[0] * R + qB[1] * puntaL[1] * R];
  /* angulo de la pluma para que los dientes queden a 0.7 m del piso */
  var sinT = (0.70 - F[1] - AL * ua[1] - punta[1]) / BL;
  var th = Math.asin(Math.max(0.15, Math.min(0.75, sinT)));
  var ub = [-Math.cos(th), Math.sin(th)], vb = [ub[1], -ub[0]];
  var pl = marco(F, ub, vb);
  var T = pl(BL, 0);
  var br = marco(T, ua, va);
  var B = br(AL, 0);
  var cu = function(a, b){ return [B[0] + pB[0] * a * R + qB[0] * b * R, B[1] + pB[1] * a * R + qB[1] * b * R]; };

  /* contornos de pluma y brazo (se usan dentro y fuera de los subgrupos) */
  var topB = [[-0.32 * s, 0.30 * s], [0.20 * BL, 0.55 * kB + 0.52 * s], [0.45 * BL, kB + 0.60 * s], [0.64 * BL, 0.70 * kB + 0.50 * s], [BL - 0.30 * s, 0.36 * s], [BL + 0.28 * s, 0.06 * s]];
  var botB = [[-0.32 * s, -0.24 * s], [0.02 * BL, -0.42 * s], [0.22 * BL, 0.30 * kB - 0.52 * s], [0.50 * BL, kB - 0.52 * s], [BL - 0.45 * s, -0.34 * s], [BL + 0.24 * s, -0.26 * s]];
  var hl = 0.95 * s, dA = 0.80 * s;
  var aLug = 0.38 * BL, lug = pl(aLug, interp(botB, aLug) - 0.17 * s);
  var aAc = 0.40 * BL, baseA = pl(aAc, interp(topB, aAc) + 0.42 * s), H = br(-hl + 0.14, 0.04);
  var rcB = 0.145 * s, zcB = Wb / 2 + rcB + 0.05, rcA = 0.165 * s, rcC = 0.14 * s;
  var L1 = br(AL - 0.62 * s, 0.22 * dA), Q = cu(-0.02, 0.33);
  var J = cruce(L1, 0.66 * s, Q, 0.78 * s, va);
  var baseC = br(-0.05, 0.62 * dA + 0.20 * s);
  var curva = function(code, pts, r, hex){
    var c = new THREE.CatmullRomCurve3(pts.map(function(p){ return new THREE.Vector3(p[0], p[1], p[2]); }));
    return pon(code, new THREE.TubeGeometry(c, Math.max(16, pts.length * 10), r, 8, false), 'goma', hex || '#1A1B1D');
  };

  /* soportes del pie de la pluma en la torna (van con la casa) */
  [-1, 1].forEach(function(l){
    perfil(null, [[F[0] - 0.60 * s, YD], [F[0] + 0.70 * s, YD], [F[0] + 0.30 * s, F[1] + 0.28 * s], [F[0] - 0.32 * s, F[1] + 0.30 * s]],
      0.10, zb + l * (Wb / 2 + 0.07), 'pintura', C.cuerpo, 0.02);
  });

  /* ── pluma (subgrupo con pivote en el pie) ── */
  var gPluma = sub(F[0], F[1], function(){
    var contB = topB.concat(botB.slice().reverse()).map(function(p){ return pl(p[0], p[1]); });
    perfil(null, contB, Wb, zb, 'pintura', C.pluma, 0.05);
    var refB = [[0.12 * BL, 0.5 * (interp(topB, 0.12 * BL) + interp(botB, 0.12 * BL))], [0.30 * BL, interp(topB, 0.30 * BL) - 0.14 * s],
      [0.62 * BL, interp(topB, 0.62 * BL) - 0.14 * s], [0.62 * BL, interp(botB, 0.62 * BL) + 0.14 * s], [0.30 * BL, interp(botB, 0.30 * BL) + 0.14 * s]];
    [-1, 1].forEach(function(l){
      perfil(null, refB.map(function(p){ return pl(p[0], p[1]); }), 0.03, zb + l * (Wb / 2 + 0.01), 'pintura', C.oscuro, 0.01);
    });
    perno('PYB', F, zb, 0.15 * s, Wb + 0.42);
    /* oreja de los cilindros de pluma en la panza y su pasador */
    perfil(null, [pl(aLug - 0.42 * s, interp(botB, aLug - 0.42 * s) + 0.02), pl(aLug + 0.42 * s, interp(botB, aLug + 0.42 * s) + 0.02), lug],
      Wb * 0.7, zb, 'pintura', C.pluma, 0.02);
    cilindro('PYB', 0.10 * s, 0.10 * s, 2 * zcB + 2 * rcB + 0.10, 'metal', '#454A50', lug[0], lug[1], zb, [Math.PI / 2, 0, 0], 16);
    /* orejas del cilindro del brazo en el lomo */
    [-1, 1].forEach(function(l){
      perfil(null, [pl(aAc - 0.55 * s, interp(topB, aAc - 0.55 * s) - 0.05), pl(aAc + 0.50 * s, interp(topB, aAc + 0.50 * s) - 0.05), baseA],
        0.07, zb + l * (rcA + 0.07), 'pintura', C.pluma, 0.02);
    });
    perno('PYB', baseA, zb, 0.09 * s, 2 * rcA + 0.30);
    /* mangueras sobre la pluma: dos al cilindro del brazo y dos que siguen al del cucharon */
    [-0.12, 0.12].forEach(function(dz, j){
      var z = zb + dz * s, ptsA = [];
      [[-0.10, 0], [0.12 * BL, 0], [0.26 * BL, 0], [aAc - 0.30 * s, 0]].forEach(function(q){ var p = pl(q[0], interp(topB, q[0]) + 0.07); ptsA.push([p[0], p[1], z]); });
      var pe = pl(aAc - 0.1 * s, interp(topB, aAc) + 0.30 * s); ptsA.push([pe[0], pe[1], z + (j ? 0.18 : -0.18) * s]);
      curva('LPH', ptsA, 0.034 * s);
    });
    [-0.28, 0.28].forEach(function(dz){
      var z = zb + dz * s, pts = [];
      [-0.10, 0.12 * BL, 0.30 * BL, 0.45 * BL, 0.64 * BL, 0.85 * BL, BL - 0.10].forEach(function(a){ var p = pl(a, interp(topB, a) + 0.06); pts.push([p[0], p[1], z]); });
      curva('LPH', pts, 0.032 * s);
    });
    /* abrazaderas de las mangueras */
    [0.20, 0.45, 0.70].forEach(function(f){
      var a = f * BL, p = pl(a, interp(topB, a) + 0.08);
      bloque(null, 0.08, 0.05, 0.75 * s, 'metal', '#5A5F66', p[0], p[1], zb, 0.01, [0, 0, Math.atan2(ub[1], ub[0])]);
    });
    /* linea de engrase por el costado izquierdo de la pluma */
    var zG = zb + Wb / 2 + 0.025, ptsG = [];
    [0.05, 0.25, 0.45, 0.65, 0.85, 0.98].forEach(function(f){ var a = f * BL, p = pl(a, (interp(topB, a) + interp(botB, a)) / 2 + 0.08); ptsG.push([p[0], p[1], zG]); });
    curva('SEN', ptsG, 0.014, '#2A2D31');
    var pb = pl(0.06 * BL, (interp(topB, 0.06 * BL) + interp(botB, 0.06 * BL)) / 2 + 0.08);
    bloque('SEN', 0.20, 0.16, 0.06, 'metal', '#5A5F66', pb[0], pb[1], zG + 0.02, 0.01);
    /* faros de trabajo en el costado de la pluma */
    [0.22, 0.30].forEach(function(f){
      var a = f * BL, p = pl(a, interp(topB, a) - 0.10 * s);
      bloque(null, 0.12, 0.18, 0.12, 'mate', '#1E2124', p[0] + 0.05, p[1], zb + Wb / 2 + 0.08, 0.02);
      faroT(p[0] - 0.06, p[1] + 0.12, zb + Wb / 2 + 0.16, 0.20);
    });
    /* marca en los dos costados de la pluma, pasado el codo */
    var aR = 0.62 * BL, pR = pl(aR, (interp(topB, aR) + interp(botB, aR)) / 2 + 0.02);
    var pk = pl(0.45 * BL, kB), pt2 = pl(0.88 * BL, 0.10 * kB), dR = [pt2[0] - pk[0], pt2[1] - pk[1]];
    var alto = (interp(topB, aR) - interp(botB, aR)) * 0.55;
    var texP = CAT ? texRotulo3d(xctDibBandaCAT, 640, 170) : texRotulo3d(xctDibXCMG, 640, 150);
    var ancho = alto * (CAT ? 3.6 : 3.9);
    [-1, 1].forEach(function(l){ letreroDir(texP, ancho, alto, pR, zb + l * (Wb / 2 + 0.035), l, dR[0], dR[1]); });
  });
  gPluma.userData.equipo = true;

  /* ── brazo (subgrupo con pivote en la punta de la pluma) ── */
  var gBrazo = sub(T[0], T[1], function(){
    var contA = [[-hl - 0.05, -0.14], [-hl + 0.02, 0.26], [0.15 * AL, 0.62 * dA], [AL - 0.45 * s, 0.30 * dA], [AL + 0.16 * s, 0.14 * s],
      [AL + 0.16 * s, -0.16 * s], [AL - 0.40 * s, -0.28 * dA], [0.25 * AL, -0.50 * dA], [-0.10, -0.44 * dA]].map(function(p){ return br(p[0], p[1]); });
    perfil(null, contA, Wa, zb, 'pintura', C.brazo, 0.04);
    [-1, 1].forEach(function(l){
      perfil(null, [br(0.10 * AL, 0.30 * dA), br(AL - 0.60 * s, 0.14 * dA), br(AL - 0.60 * s, -0.16 * dA), br(0.20 * AL, -0.32 * dA)],
        0.025, zb + l * (Wa / 2 + 0.008), 'pintura', C.oscuro, 0.008);
    });
    /* planchas de desgaste en la panza del brazo */
    placa(null, br(AL * 0.45, -0.40 * dA), br(AL - 0.35 * s, -0.27 * dA), 0.04, Wa + 0.02, zb, 'metal', '#3A3E44', 0.01);
    perno('PYB', T, zb, 0.13 * s, Wb + 0.10);
    perno('PYB', H, zb, 0.09 * s, Wa + 0.10);
    /* orejas del cilindro del cucharon en el lomo y pasador de la biela */
    [-1, 1].forEach(function(l){
      perfil(null, [br(-0.40 * s, 0.50 * dA), br(0.35 * s, 0.56 * dA), baseC], 0.07, zb + l * (rcC + 0.07), 'pintura', C.brazo, 0.02);
    });
    perno('PYB', baseC, zb, 0.08 * s, 2 * rcC + 0.30);
    perno('PYB', L1, zb, 0.09 * s, Wa + 0.30);
    /* mangueras del cilindro del cucharon */
    [-0.10, 0.10].forEach(function(dz){
      var p1 = br(-0.10, 0.48 * dA), p2 = br(0.05, 0.62 * dA + 0.05);
      curva('LPH', [[p1[0], p1[1], zb + dz * 2], [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2 + 0.08, zb + dz * 1.5], [p2[0], p2[1], zb + dz]], 0.03 * s);
    });
  });
  gBrazo.userData.equipo = true; gBrazo.userData.palo = true;

  /* ── cucharon (subgrupo con pivote en el pasador del brazo) ── */
  var gCuch = sub(B[0], B[1], function(){
    var BW = P.BW, zIn = BW / 2 - 0.035;
    var lado2 = envol.map(function(p){ return cu(p[0], p[1]); });
    [-1, 1].forEach(function(l){ perfil('LPN', lado2, 0.07, zb + l * zIn, 'pintura', C.cuchara, 0.02); });
    for(var e2 = 0; e2 < envol.length - 1; e2++){
      placa('LPN', cu(envol[e2][0], envol[e2][1]), cu(envol[e2 + 1][0], envol[e2 + 1][1]), 0.06 * s, BW - 0.06, zb, 'pintura', C.cuchara, 0.015);
    }
    var tLab = cu(envol[0][0], envol[0][1]);
    cilindro('LPN', 0.07 * s, 0.07 * s, BW + 0.02, 'pintura', C.cuchara, tLab[0], tLab[1], zb, [Math.PI / 2, 0, 0], 14);
    var E = cu(0.97, 0.04), Ein = cu(0.80, -0.05);
    placa('LPN', Ein, E, 0.10 * s, BW + 0.02, zb, 'metal', '#3B3F45', 0.02);
    /* placas de desgaste en el lomo */
    var qs = [], gl = [];
    for(var j = 0; j < 4; j++){
      var zj = zb + (j - 1.5) * BW * 0.26;
      for(var e3 = 5; e3 < 8; e3++){
        var a = cu(envol[e3][0], envol[e3][1]), b = cu(envol[e3 + 1][0], envol[e3 + 1][1]);
        var n = [qB[0] * 0.05 * s, qB[1] * 0.05 * s];
        qs.push([(a[0] + b[0]) / 2 + n[0], (a[1] + b[1]) / 2 + n[1], zj, 0, 0, Math.atan2(b[1] - a[1], b[0] - a[0])]);
        gl.push(dist2(a, b));
      }
    }
    muchos('GET', new THREE.BoxGeometry(Math.max.apply(null, gl) * 0.95, 0.05 * s, 0.10 * s), 'metal', '#43474D', qs);
    /* cuchillas laterales */
    [-1, 1].forEach(function(l){
      placa('GET', cu(0.97, 0.04), cu(0.62, -0.13), 0.14 * s, 0.09, zb + l * (zIn + 0.01), 'metal', '#3B3F45', 0.02);
    });
    /* dientes: adaptador y punta ahusada, en una sola malla cada uno */
    var nD = P.nD, dw = BW * 0.84, ang = Math.atan2(pB[1] * dirD[0] + qB[1] * dirD[1], pB[0] * dirD[0] + qB[0] * dirD[1]);
    var dW = [Math.cos(ang), Math.sin(ang)];
    var adap = [], tips = [], prot = [];
    for(var jd = 0; jd < nD; jd++){
      var zd = zb + (nD > 1 ? (jd / (nD - 1) - 0.5) * dw : 0);
      adap.push([E[0] + dW[0] * 0.06 * R, E[1] + dW[1] * 0.06 * R, zd, 0, 0, ang]);
      tips.push([E[0] + dW[0] * 0.17 * R, E[1] + dW[1] * 0.17 * R, zd, 0, 0, ang]);
      if(jd < nD - 1) prot.push([E[0] + dW[0] * 0.02, E[1] + dW[1] * 0.02, zd + dw / (nD - 1) / 2, 0, 0, ang]);
    }
    muchos('GET', new THREE.BoxGeometry(0.30 * R, 0.13 * s, 0.17 * s), 'metal', '#4A4E54', adap);
    var gt = new THREE.BoxGeometry(0.16 * R, 0.12 * s, 0.15 * s), pos = gt.attributes.position;
    for(var v = 0; v < pos.count; v++) if(pos.getX(v) > 0){ pos.setY(v, pos.getY(v) * 0.30); pos.setZ(v, pos.getZ(v) * 0.75); }
    gt.computeVertexNormals();
    muchos('GET', gt, 'metal', '#5B5F64', tips);
    if(prot.length) muchos('GET', new THREE.BoxGeometry(0.12 * R, 0.07 * s, 0.16 * s), 'metal', '#3F4348', prot);
    /* orejas del cucharon y pasadores */
    [-1, 1].forEach(function(l){
      [Wa / 2 + 0.05, 0.20 * s + 0.08].forEach(function(zo){
        perfil('LPN', [cu(-0.16, -0.12), cu(-0.18, 0.42), cu(0.08, 0.48), cu(0.24, 0.30), cu(0.14, -0.14)], 0.07, zb + l * zo, 'pintura', C.cuchara, 0.015);
      });
    });
    perno('PYB', B, zb, 0.10 * s, Wa + 0.34);
    perno('PYB', Q, zb, 0.09 * s, 0.40 * s + 0.30);
    /* el logo de XCMG estampado en el costado del cucharon */
    if(!CAT){
      var cL = cu(0.45, 0.22);
      letrero(texRotulo3d(xctDibTexto('X', { tinta: '#1A1C1F' }), 96, 96), 0.28 * s, 0.28 * s, cL[0], cL[1], zb + zIn + 0.04, 0);
    }
  });
  gCuch.userData.equipo = true; gCuch.userData.cucharon = true;

  /* ── cilindros y bielas, sueltos (el tajo los pega a la pieza mas cercana) ── */
  var base = [XF + 0.30 * s, YCW + 0.34 * s];
  [-1, 1].forEach(function(l){
    D.cilHidD('PHY', [base[0], base[1], zb + l * zcB], [lug[0], lug[1], zb + l * zcB], rcB, C.cil, 0.56);
    bloque(null, 0.40 * s, 0.30 * s, 0.07, 'pintura', C.cuerpo, base[0] + 0.06, base[1] - 0.02, zb + l * (zcB + rcB + 0.04), 0.02);
    bloque(null, 0.40 * s, 0.30 * s, 0.07, 'pintura', C.cuerpo, base[0] + 0.06, base[1] - 0.02, zb + l * (zcB - rcB - 0.04), 0.02);
    /* mangueras de los cilindros de pluma */
    var a = [base[0] + 0.25, base[1] + 0.28, zb + l * zcB], m = [base[0] + 0.60, base[1] + 0.05, zb + l * (zcB - 0.10)];
    curva('LPH', [a, m, [F[0] - 0.2, YD + 0.15, zb + l * 0.30]], 0.028 * s);
  });
  cilindro('PYB', 0.10 * s, 0.10 * s, 2 * zcB + 2 * rcB + 0.20, 'metal', '#454A50', base[0], base[1], zb, [Math.PI / 2, 0, 0], 16);
  D.cilHidD('PSK', [baseA[0], baseA[1], zb], [H[0], H[1], zb], rcA, C.cil, 0.55);
  [-1, 1].forEach(function(l){
    placa(null, L1, J, 0.20 * s, 0.07, zb + l * (Wa / 2 + 0.06), 'pintura', C.brazo, 0.03);
    placa(null, J, Q, 0.22 * s, 0.08, zb + l * 0.20 * s, 'pintura', C.cuchara === XCT_GRIS ? XCT_GRIS : C.brazo, 0.03);
  });
  D.cilHidD('PHY', [baseC[0], baseC[1], zb], [J[0], J[1], zb], rcC, C.cil, 0.55);
  perno('PYB', J, zb, 0.09 * s, 0.40 * s + 0.20);
  /* lineas de aceite a lo largo de las camisas */
  [-1, 1].forEach(function(l){
    var z = zb + l * (zcB + rcB + 0.02);
    tubo('LPH', [base[0] + (lug[0] - base[0]) * 0.08, base[1] + (lug[1] - base[1]) * 0.08 + 0.05, z],
      [base[0] + (lug[0] - base[0]) * 0.50, base[1] + (lug[1] - base[1]) * 0.50 + 0.05, z], 0.026, 'metal', '#5A5F66', 8);
  });

  /* ═══ centrado y camara ═══ */
  var caja = new THREE.Box3().setFromObject(G);
  MG.position.x = -(caja.min.x + caja.max.x) / 2;
  var gx = MG.position.x;
  G.userData.giroX = gx;
  G.userData.pie = [F[0] + gx, F[1]];
  G.userData.frente = XF + gx;
  G.userData.pivPalo = [T[0] + gx, T[1]];
  G.userData.bisagra = [B[0] + gx, B[1]];
  G.userData.ruedas = [];
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = Math.max(2.2, caja.max.y * 0.45);
  G.userData.dist = Math.min(40, Math.max(20, (caja.max.x - caja.min.x) * 2.0));
  G.userData.modelo = P.nombre;
  return G;
}

/* ═══ registro: solo estos modelos exactos y de su marca ═══ */
registrarModelo3d({
  nombre: 'Excavadoras CAT 374D L, 349D L, 336D L / 336D, 336 y XCMG XE650GK HEV',
  clave: function(e){
    var m = mod3d(e), marca = String((e && e.marca) || '').toUpperCase();
    if(/CAT/.test(marca)){
      if(m === '374DL') return 'XCT374DL';
      if(m === '349DL') return 'XCT349DL';
      if(m === '336DL') return 'XCT336DL';
      if(m === '336D') return 'XCT336D';
      if(m === '336') return 'XCT336N';
    }
    if(/XCMG/.test(marca) && /^XE650GK/.test(m)) return 'XCTXE650';
    return null;
  },
  construir: function(e, piezas, clave){ return xctConstruir(XCT_P[String(clave).replace(/^XCT/, '')], piezas); }
});
