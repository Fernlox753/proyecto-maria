/* ══════════════════════════════════════════════════════════════════
   CAT 6040 FS y 6050 FS — palas hidraulicas frontales (CH-04, CH-08, CH-06)
   HYDROKHAN UG-3300 y UG-5000 — martillos hidraulicos (MH-86, 89, 92, 93)

   PALAS. Medidas de las hojas de Caterpillar (6040: hoja tecnica 2021,
   «Dimensions» y «Working Range – TriPower FS»; 6050: folleto 6050/6050 FS):
                              6040 FS    6050 FS
     techo de la cabina        7.93       8.76
     tope del contrapeso       5.605      6.46
     bajo el contrapeso        2.615      2.78
     ancho del contrapeso      6.10       7.00
     cola desde el giro        6.79       7.35
     orugas: largo · ejes      8.09·6.17  8.54·6.40
     trocha · tejas            5.395·1.20 5.60·1.40
     alto de orugas            2.25       2.48
     despeje bajo el carbody   0.935      1.12
     pluma / brazo             7.3 / 4.6  8.0 / 5.1
     cucharon (ancho)          4.77 m     4.80 m, seis dientes
   La cinematica TriPower (pie de pluma, balancin triangular, biela de
   compresion, cilindros de pluma, de empuje y de volteo) se midio sobre el
   dibujo de rangos del 6050 (cuadricula de 1 m) y se escala con la pluma
   para el 6040. La pose se resuelve sola: la pluma baja hasta que el brazo
   cuelga a ~75 grados y el cucharon apoya los dientes en el piso, como en el
   render de estudio del 6040. Puesto de la cabina, escalera vertical,
   nicho de bombas, escalera de 35-50 grados y rejillas salen de medir las
   vistas laterales de las hojas; el contrapeso, las rejillas de lamas, el
   CAT grande y los cuatro escapes de las fotos traseras.

   Ejes: frente hacia -X, arriba +Y, la izquierda del operador +Z. La cabina
   va adelante a la izquierda; la pluma al centro. Cada pieza lleva su codigo
   de sistema SAP (TPW2 es el balancin TriPower derecho, HRH el cilindro de
   levante derecho, PAL/PSK los de empuje, PVL el de volteo izquierdo).

   MARTILLOS. Los UG-3300 y UG-5000 de Hydrokhan (Corea, distribuidos en
   Peru por Maquinarias U-Guil) son martillos rompedores de tipo «silencioso»
   (carcasa cerrada) que se montan en el brazo de una excavadora; en SAP el
   equipo alquilado es el martillo, no la excavadora. Ficha del fabricante:
     UG-3300: 2 822 kg · largo 3 281 mm · punta de 158 mm · excavadora 29-38 t
     UG-5000: 3 842 kg · largo 3 618 mm · punta de 180 mm · excavadora 40-75 t
   Se muestran como se ven en patio: echados sobre durmientes, la punta
   hacia adelante, la carcasa azul con el soporte superior negro y las dos
   mangueras. El ancho y alto de la carcasa no estan en la ficha: salen de
   las fotos de U-Guil (proporcion de la carcasa ~1 : 3).
   ══════════════════════════════════════════════════════════════════ */
var PAL_AM = '#E39E0E', PAL_AM2 = '#B07B0C', PAL_NEGRO = '#1C1F23', PAL_GRIS = '#3B4149', PAL_GRIS2 = '#5A626B',
    PAL_ORUGA = '#25282C', PAL_BAR = '#1E2125', PAL_REJA = '#45494E';

var PAL_MEDIDAS = {
  '6040': { nombre: '6040', frente: 3.0, cola: 6.79, ancho: 6.10, bajo: 2.615, deck: 5.605,
            cab: [-2.72, -0.22], cabTop: 7.93, cabAncho: 1.90,
            oruga: 8.09, ejes: 6.17, trocha: 5.395, teja: 1.20, altoOr: 2.25, despeje: 0.935,
            esc: 0.9125, brazo: 4.6, balde: 4.77, escBalde: 0.946, B0: [3.30, 3.10],
            escalera: -1.22, nicho: [0.43, 1.82], descanso: 3.70, pieEsc: [6.9, 0.25],
            rejas: [3.66, 5.35], logo: 2.55, botellas: 2 },
  '6050': { nombre: '6050', frente: 2.24, cola: 7.35, ancho: 7.00, bajo: 2.78, deck: 6.46,
            cab: [-1.50, 1.22], cabTop: 8.76, cabAncho: 2.30,
            oruga: 8.54, ejes: 6.40, trocha: 5.60, teja: 1.40, altoOr: 2.48, despeje: 1.12,
            esc: 1.0, brazo: 5.1, balde: 4.80, escBalde: 1.0, B0: [2.97, 3.20],
            escalera: -2.0, nicho: [1.80, 4.10], descanso: 3.90, pieEsc: [7.2, 0.17],
            rejas: [5.0, 5.9], logo: 3.75, botellas: 6 }
};

/* franja del brazo: paralelogramo negro con el CAT y el triangulo amarillo */
function palRotuloBrazo(g, w, h){
  g.clearRect(0, 0, w, h);
  g.fillStyle = '#16181B';
  g.beginPath(); g.moveTo(w * 0.10, 0); g.lineTo(w, 0); g.lineTo(w * 0.90, h); g.lineTo(0, h); g.closePath(); g.fill();
  g.fillStyle = '#B8261C';
  g.beginPath(); g.moveTo(w * 0.86, 0); g.lineTo(w, 0); g.lineTo(w * 0.94, h * 0.45); g.lineTo(w * 0.81, h * 0.45); g.closePath(); g.fill();
  g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold ' + Math.round(h * 0.62) + 'px "Arial Black", Arial, sans-serif';
  g.fillText('CAT', w * 0.47, h * 0.52);
  g.fillStyle = '#E9A915';
  g.beginPath(); g.moveTo(w * 0.445, h * 0.80); g.lineTo(w * 0.505, h * 0.80); g.lineTo(w * 0.475, h * 0.64); g.closePath(); g.fill();
}
/* rotulo del modelo: «6040» blanco sobre negro con el borde rojo */
function palRotuloModelo(txt){
  return function(g, w, h){
    g.fillStyle = '#16181B'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#B8261C'; g.fillRect(w * 0.93, 0, w * 0.07, h);
    g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.70) + 'px "Arial Black", Arial, sans-serif';
    g.fillText(txt, w * 0.46, h * 0.54);
  };
}

/* casco convexo (Andrew) de una nube de puntos (x,y): sirve para placas
   redondeadas que abrazan pernos (balancin, brazo, orejas) */
function palCasco(pts){
  var p = pts.slice().sort(function(a, b){ return a[0] - b[0] || a[1] - b[1]; });
  var cruz = function(o, a, b){ return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); };
  var lo = [], hi = [], i;
  for(i = 0; i < p.length; i++){ while(lo.length >= 2 && cruz(lo[lo.length - 2], lo[lo.length - 1], p[i]) <= 0) lo.pop(); lo.push(p[i]); }
  for(i = p.length - 1; i >= 0; i--){ while(hi.length >= 2 && cruz(hi[hi.length - 2], hi[hi.length - 1], p[i]) <= 0) hi.pop(); hi.push(p[i]); }
  hi.pop(); lo.pop();
  return lo.concat(hi);
}
/* los puntos de un circulo, para palCasco */
function palCirc(c, r, n){
  var o = [];
  for(var i = 0; i < (n || 14); i++){ var a = i / (n || 14) * Math.PI * 2; o.push([c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r]); }
  return o;
}
/* contorno suave cerrado que pasa por los puntos de control */
function palSuave(pts, n){
  var c = new THREE.CatmullRomCurve3(pts.map(function(p){ return new THREE.Vector3(p[0], p[1], 0); }), true, 'centripetal');
  var o = c.getPoints(n).map(function(v){ return [v.x, v.y]; });
  o.pop();
  return o;
}
/* giro de un punto (x,y) alrededor de c */
function palGiro(p, c, a){
  var cs = Math.cos(a), sn = Math.sin(a), dx = p[0] - c[0], dy = p[1] - c[1];
  return [c[0] + dx * cs - dy * sn, c[1] + dx * sn + dy * cs];
}

function palConstruirPala(id, piezas){
  var C = PAL_MEDIDAS[id], N50 = id === '6050';
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var bloque = D.bloque, perfil = D.perfil, tubo = D.tubo, cilindro = D.cilindro, pon = D.pon, letrero = D.letrero;
  var AM = function(code, w, h, d, x, y, z, r, rot){ return bloque(code, w, h, d, 'pintura', PAL_AM, x, y, z, r, rot); };
  var NG = function(code, w, h, d, x, y, z, r, rot){ return bloque(code, w, h, d, 'mate', PAL_NEGRO, x, y, z, r, rot); };
  var EJE_Z = [Math.PI / 2, 0, 0], EJE_X = [0, 0, Math.PI / 2];
  /* el dibujo esta en X hacia adelante; el modelo tiene el frente en -X */
  var mz = function(p, z){ return [-p[0], p[1], z]; };
  var mp = function(pts){ return pts.map(function(p){ return [-p[0], p[1]]; }); };
  /* planta (x,z) extruida en alto, de y0 a y1, con cantos biselados */
  var planta = function(code, pts, y0, y1, tipo, hex, r){
    var sh = new THREE.Shape();
    pts.forEach(function(p, i){ i ? sh.lineTo(p[0], -p[1]) : sh.moveTo(p[0], -p[1]); });
    sh.closePath();
    var h = y1 - y0; r = Math.min(r === undefined ? 0.04 : r, h / 3);
    var g = new THREE.ExtrudeGeometry(sh, { depth: Math.max(0.001, h - 2 * r), bevelEnabled: true, bevelThickness: r, bevelSize: r * 0.6, bevelSegments: 2 });
    g.rotateX(-Math.PI / 2);
    g.translate(0, y0 + r, 0);
    return pon(code, g, tipo, hex);
  };
  /* pasador: perno cromado de lado a lado con tapas */
  var perno = function(code, p, z0, z1, r){
    cilindro(code, r, r, Math.abs(z1 - z0), 'metal', '#6E737A', -p[0], p[1], (z0 + z1) / 2, EJE_Z, 18);
    [z0, z1].forEach(function(z){ cilindro(null, r * 1.45, r * 1.45, 0.06, 'mate', PAL_GRIS, -p[0], p[1], z + (z > (z0 + z1) / 2 ? 0.03 : -0.03), EJE_Z, 18); });
  };
  /* oreja: placa redondeada que abraza un perno y se apoya en otros puntos */
  var oreja = function(code, c, r, otros, z, esp, hex){
    var pts = palCirc(c, r, 16);
    otros.forEach(function(q){ pts.push(q); });
    return perfil(code, mp(palCasco(pts)), esp, z, 'pintura', hex || PAL_AM, 0.03);
  };
  /* manguera curva por puntos [x,y,z] del modelo */
  var manguera = function(code, pts, r, hex){
    var cur = new THREE.CatmullRomCurve3(pts.map(function(p){ return new THREE.Vector3(p[0], p[1], p[2]); }));
    return pon(code, new THREE.TubeGeometry(cur, Math.max(12, pts.length * 8), r, 8, false), 'goma', hex || '#17191C');
  };

  var XF = -C.frente, XR = C.cola, ZL = C.ancho / 2, YB = C.bajo, YD = C.deck, YM = YB + 0.75;
  var s = C.esc;

  /* ═══ tren de orugas ═══ */
  var LO = C.oruga / 2, ZT = C.trocha / 2, RO = C.altoOr / 2, AT = C.teja;
  var orugaLado = function(lado){
    var zc = lado * ZT, codF = lado > 0 ? 'CLH' : 'CRH';
    var x0 = -LO, x1 = LO, cxI = x0 + RO, cxS = x1 - RO, Rp = RO - 0.07, recto = cxS - cxI;
    var per = 2 * recto + 2 * Math.PI * Rp, paso = 0.40 + (AT - 1.2) * 0.1, n = Math.round(per / paso);
    paso = per / n;
    var gPl = new THREE.BoxGeometry(paso * 0.93, 0.11, AT), gGr = new THREE.BoxGeometry(0.075, 0.075, AT * 0.98),
        gLk = new THREE.BoxGeometry(paso * 0.80, 0.16, AT * 0.34);
    var mT = D.M.metal(PAL_ORUGA); mT.roughness = 0.72; mT.metalness = 0.55;
    var iPl = new THREE.InstancedMesh(gPl, mT, n), iGr = new THREE.InstancedMesh(gGr, mT, n * 2), iLk = new THREE.InstancedMesh(gLk, mT, n);
    var d = new THREE.Object3D();
    for(var i = 0; i < n; i++){
      var sp = (i + 0.5) * paso, x, y, tx, ty, nx, ny, a;
      if(sp < recto){ x = cxI + sp; y = RO - Rp; tx = 1; ty = 0; nx = 0; ny = -1; }
      else if(sp < recto + Math.PI * Rp){ a = -Math.PI / 2 + (sp - recto) / Rp; x = cxS + Math.cos(a) * Rp; y = RO + Math.sin(a) * Rp; tx = -Math.sin(a); ty = Math.cos(a); nx = Math.cos(a); ny = Math.sin(a); }
      else if(sp < 2 * recto + Math.PI * Rp){ x = cxS - (sp - recto - Math.PI * Rp); y = RO + Rp; tx = -1; ty = 0; nx = 0; ny = 1; }
      else { a = Math.PI / 2 + (sp - 2 * recto - Math.PI * Rp) / Rp; x = cxI + Math.cos(a) * Rp; y = RO + Math.sin(a) * Rp; tx = -Math.sin(a); ty = Math.cos(a); nx = Math.cos(a); ny = Math.sin(a); }
      var ang = Math.atan2(ty, tx);
      d.rotation.set(0, 0, ang);
      d.position.set(x, y, zc); d.updateMatrix(); iPl.setMatrixAt(i, d.matrix);
      d.position.set(x - nx * 0.12, y - ny * 0.12, zc); d.updateMatrix(); iLk.setMatrixAt(i, d.matrix);
      [-1, 1].forEach(function(k, j){
        d.position.set(x + nx * 0.085 + tx * k * paso * 0.24, y + ny * 0.085 + ty * k * paso * 0.24, zc);
        d.updateMatrix(); iGr.setMatrixAt(i * 2 + j, d.matrix);
      });
    }
    D.reg(codF, iPl, PAL_ORUGA); D.reg(codF, iGr, PAL_ORUGA); D.reg(null, iLk, PAL_ORUGA);
    /* bastidor de la oruga: viga cajon con tapa lateral y protector de rodillos */
    bloque(codF, recto + 0.3, RO * 0.95, AT * 0.62, 'mate', PAL_NEGRO, 0, RO + 0.05, zc, 0.06);
    bloque(codF, recto - 0.6, RO * 0.55, 0.08, 'mate', '#23262A', 0.1, RO + 0.02, zc + lado * AT * 0.32, 0.03);
    for(var b = 0; b < 5; b++) bloque(null, 0.10, RO * 0.75, 0.06, 'mate', '#2A2E33', -recto / 2 + 0.9 + b * (recto - 1.8) / 4, RO + 0.02, zc + lado * AT * 0.37, 0.02);
    /* rodillos inferiores y de apoyo superiores */
    var nR = Math.round(recto / 0.62);
    for(var r = 0; r < nR; r++){
      cilindro(null, 0.20, 0.20, AT * 0.58, 'metal', PAL_GRIS, cxI + 0.45 + r * (recto - 0.9) / (nR - 1), RO - Rp + 0.27, zc, EJE_Z, 16);
    }
    [-0.28, 0.28].forEach(function(f){ cilindro(null, 0.16, 0.16, AT * 0.42, 'metal', PAL_GRIS, f * recto, RO + Rp - 0.25, zc, EJE_Z, 14); });
    /* rueda guia adelante y catarina atras con sus dientes */
    cilindro(lado > 0 ? 'RGL' : null, Rp - 0.16, Rp - 0.16, AT * 0.50, 'metal', '#34383E', cxI, RO, zc, EJE_Z, 30);
    cilindro(null, Rp * 0.45, Rp * 0.45, AT * 0.66, 'metal', PAL_GRIS2, cxI, RO, zc, EJE_Z, 20);
    cilindro(lado < 0 ? 'SPR' : null, Rp - 0.20, Rp - 0.20, AT * 0.40, 'metal', '#34383E', cxS, RO, zc, EJE_Z, 30);
    var gD = new THREE.BoxGeometry(0.16, 0.22, AT * 0.36), iD = new THREE.InstancedMesh(gD, D.M.metal('#34383E'), 13);
    for(var t = 0; t < 13; t++){
      var at = t / 13 * Math.PI * 2;
      d.position.set(cxS + Math.cos(at) * (Rp - 0.14), RO + Math.sin(at) * (Rp - 0.14), zc); d.rotation.set(0, 0, at); d.updateMatrix(); iD.setMatrixAt(t, d.matrix);
    }
    D.reg(lado < 0 ? 'SPR' : null, iD, '#34383E');
    /* mando final por fuera de la catarina, con pernos */
    var zM = zc + lado * (AT * 0.50 + 0.10);
    cilindro(lado > 0 ? 'MLH' : 'MRH', Rp * 0.62, Rp * 0.70, 0.30, 'metal', PAL_GRIS, cxS, RO, zM, EJE_Z, 30);
    cilindro(null, Rp * 0.34, Rp * 0.40, 0.14, 'metal', PAL_GRIS2, cxS, RO, zM + lado * 0.20, EJE_Z, 24);
    var iPb = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.035, 0.035, 0.06, 6), D.M.metal('#8A8F96'), 16);
    for(var q = 0; q < 16; q++){
      var aq = q / 16 * Math.PI * 2;
      d.position.set(cxS + Math.cos(aq) * Rp * 0.55, RO + Math.sin(aq) * Rp * 0.55, zM + lado * 0.16); d.rotation.set(Math.PI / 2, 0, 0); d.updateMatrix(); iPb.setMatrixAt(q, d.matrix);
    }
    D.reg(null, iPb, '#8A8F96');
    /* motor de traslacion por dentro, junto a la catarina */
    cilindro(lado > 0 ? 'TML' : null, 0.24, 0.24, 0.55, 'metal', PAL_GRIS2, cxS - 0.25, RO + 0.30, zc - lado * (AT * 0.50 + 0.30), EJE_Z, 18);
  };
  orugaLado(1); orugaLado(-1);
  /* carbody: viga central entre las orugas, despeje real por debajo */
  var ZI = ZT - AT * 0.31;
  bloque(null, 3.6, C.altoOr - C.despeje - 0.15, ZI * 2, 'mate', PAL_NEGRO, 0, (C.despeje + C.altoOr - 0.15) / 2, 0, 0.08);
  [-1, 1].forEach(function(l){
    perfil(null, [[-1.8, C.despeje + 0.15], [1.8, C.despeje + 0.15], [2.6, RO + 0.2], [-2.6, RO + 0.2]], 0.6, l * (ZI - 0.4), 'mate', PAL_NEGRO, 0.04);
  });
  bloque(null, 0.06, 0.6, ZI * 2 - 0.4, 'mate', '#2A2E33', -1.82, C.despeje + 0.55, 0, 0.02);
  /* anillo de giro y su corona */
  cilindro(null, 2.25 * s + 0.1, 2.35 * s + 0.1, YB - C.altoOr + 0.15, 'mate', PAL_NEGRO, 0, (YB + C.altoOr - 0.15) / 2, 0, null, 48);
  cilindro(null, 2.42 * s + 0.1, 2.42 * s + 0.1, 0.10, 'metal', '#2C3035', 0, YB - 0.06, 0, null, 48);
  /* reductores de giro colgando bajo la superestructura, con sus frenos */
  [['RG1', 'SB1', -1.6, 1.75], ['RG2', 'SB2', -1.6, -1.75], ['RG3', null, 2.3, -0.9]].forEach(function(q){
    cilindro(q[0], 0.30, 0.34, 0.32, 'metal', PAL_GRIS, q[2] * s, YB - 0.16, q[3] * s, null, 20);
    if(q[1]) cilindro(q[1], 0.22, 0.22, 0.10, 'metal', PAL_GRIS2, q[2] * s, YB - 0.36, q[3] * s, null, 16);
  });

  /* ═══ superestructura ═══ */
  var xr0 = C.nicho[0], xr1 = C.nicho[1], YL = C.descanso, ZN = ZL - 1.2;
  /* faldon de abajo con los cantos achaflanados adelante y atras */
  perfil(null, [[XF + 0.45, YB], [XR - 0.40, YB], [XR - 0.02, YB + 0.45], [XR - 0.02, YM], [XF + 0.02, YM]], C.ancho - 0.14, 0, 'pintura', PAL_AM, 0.04);
  /* cuerpo: bloque delantero, trasero (contrapeso con cantos achaflanados),
     el del medio y el nicho de bombas a la izquierda */
  planta(null, [[XF, -ZL], [xr0, -ZL], [xr0, ZL], [XF, ZL]], YM, YD, 'pintura', PAL_AM, 0.05);
  planta(null, [[xr1, -ZL], [XR - 0.5, -ZL], [XR, -ZL + 0.5], [XR, ZL - 0.5], [XR - 0.5, ZL], [xr1, ZL]], YM, YD, 'pintura', PAL_AM, 0.05);
  planta(null, [[xr0, -ZL], [xr1, -ZL], [xr1, ZN], [xr0, ZN]], YM, YD, 'pintura', PAL_AM, 0.05);
  planta(null, [[xr0, ZN], [xr1, ZN], [xr1, ZL], [xr0, ZL]], YM, YL, 'pintura', PAL_AM, 0.04);
  /* juntas de paneles y bisagras en los dos costados */
  [-1, 1].forEach(function(l){
    [XF + 1.6, -0.3, xr1 + 1.3, XR - 1.6].forEach(function(x){ bloque(null, 0.05, YD - YM - 0.3, 0.03, 'pintura', PAL_AM2, x, (YM + YD) / 2, l * (ZL + 0.01), 0.01); });
    bloque(null, XR - XF - 0.4, 0.05, 0.04, 'pintura', PAL_AM2, (XF + XR) / 2, YM + 0.02, l * (ZL - 0.04), 0.01);
    /* bandeja del arnes bajo el borde de la cubierta */
    bloque(l > 0 ? 'HAR' : null, XR - xr1 - 0.8, 0.08, 0.10, 'mate', '#22262B', (xr1 + XR) / 2, YD - 0.18, l * (ZL + 0.05), 0.01);
  });
  /* cubierta: pasillos de rejilla por los bordes */
  var reja = function(w, d, x, z, y){ return bloque(null, w, 0.03, d, 'mate', PAL_REJA, x, (y || YD) + 0.015, z, 0.01); };
  reja(XR - xr1 - 0.3, 0.75, (xr1 + XR) / 2, ZL - 0.42);
  reja(XR - XF - 0.3, 0.75, (XF + XR) / 2, -ZL + 0.42);
  reja(0.75, C.ancho - 1.6, XR - 0.45, 0);

  /* ═══ frente: orejas del pie de pluma y de los cilindros de levante ═══ */
  var WB = 1.5 * s, ZC = WB / 2 + 0.42;
  var F = [C.frente - 0.14 * s, YD - 0.36 * s];
  var rel = function(p){ return [F[0] + p[0] * s, F[1] + p[1] * s]; };
  [-1, 1].forEach(function(l){
    oreja('PYB', F, 0.62 * s, [[F[0] - 1.7, YD - 0.05], [F[0] - 1.7, YD - 1.4], [F[0] + 0.25, YD - 1.9]], l * (WB / 2 + 0.14), 0.18);
  });
  perno('PYB', F, -WB / 2 - 0.30, WB / 2 + 0.30, 0.22 * s);
  var B0 = C.B0, C0 = rel([0.20, 0.07]);
  [-1, 1].forEach(function(l){
    [-1, 1].forEach(function(k){
      oreja(null, B0, 0.38 * s, [[C.frente - 0.25, YB + 0.05], [C.frente - 0.25, YM + 0.75]], l * ZC + k * 0.30, 0.12);
      oreja(null, C0, 0.32 * s, [[F[0] - 1.1, YD - 0.05], [F[0] - 0.2, YD - 1.2]], l * ZC + k * 0.26, 0.12);
    });
    perno('PYB', B0, l * ZC - 0.38, l * ZC + 0.38, 0.13 * s);
    perno(null, C0, l * ZC - 0.34, l * ZC + 0.34, 0.12 * s);
  });

  /* ═══ cabina adelante a la izquierda, con pasillo y escalera vertical ═══ */
  var cx0 = C.cab[0], cx1 = C.cab[1], cz1 = ZL - 0.10, cz0 = cz1 - C.cabAncho, cy0 = YD, cy1 = C.cabTop - 0.16;
  var cxm = (cx0 + cx1) / 2, czm = (cz0 + cz1) / 2;
  if(N50){
    /* el 6050 lleva la cabina sobre un modulo propio, un poco mas alto que la cubierta */
    AM(null, cx1 - cx0 + 0.5, 0.30, cz1 - cz0 + 0.3, cxm, YD + 0.15, czm, 0.04);
    cy0 = YD + 0.30;
  }
  NG('CBN', cx1 - cx0, 0.42, cz1 - cz0, cxm, cy0 + 0.21, czm, 0.05);
  /* postes, travesano alto y vidrios con marco */
  [[cx0, cz0], [cx0, cz1], [cx1, cz0], [cx1, cz1], [cx0 + 1.05, cz1], [cx1 - 0.05, czm]].forEach(function(p, i){
    if(i === 5) return;
    NG('CBN', 0.11, cy1 - cy0 - 0.42, 0.11, p[0], (cy0 + 0.42 + cy1) / 2, p[1], 0.03);
  });
  NG('CBN', cx1 - cx0, 0.16, cz1 - cz0, cxm, cy1 - 0.08, czm, 0.04);
  var hV = cy1 - cy0 - 0.62, yV = cy0 + 0.44 + hV / 2;
  var vid = function(w, h, d, x, y, z){ var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), D.M.vidrio('#1B2B3B')); m.position.set(x, y, z); G.add(m); return m; };
  vid(0.03, hV, cz1 - cz0 - 0.12, cx0 - 0.01, yV, czm);
  vid(0.98, hV, 0.03, cx0 + 0.55, yV, cz1 + 0.01);
  vid(cx1 - cx0 - 1.20, hV * 0.55, 0.03, (cx0 + 1.1 + cx1) / 2, yV - hV * 0.22, cz1 + 0.01);
  vid(cx1 - cx0 - 0.12, hV, 0.03, cxm, yV, cz0 - 0.01);
  vid(0.03, hV * 0.6, cz1 - cz0 - 0.12, cx1 + 0.01, yV + hV * 0.15, czm);
  /* parasol de lamas en la parte alta trasera del costado (como en la hoja) */
  NG(null, cx1 - cx0 - 1.20, hV * 0.42, 0.06, (cx0 + 1.1 + cx1) / 2, yV + hV * 0.28, cz1 + 0.02, 0.02);
  for(var pl = 0; pl < 6; pl++){
    bloque(null, cx1 - cx0 - 1.30, 0.04, 0.07, 'mate', '#0D0E10', (cx0 + 1.1 + cx1) / 2, yV + hV * 0.10 + pl * hV * 0.068, cz1 + 0.07, 0.01, [0.5, 0, 0]);
  }
  /* rejilla de proteccion sobre el vidrio delantero, alta */
  for(var gv = 0; gv < 5; gv++) tubo(null, [cx0 - 0.10, yV + hV * 0.05, cz0 + 0.3 + gv * (C.cabAncho - 0.6) / 4], [cx0 - 0.10, cy1 - 0.05, cz0 + 0.3 + gv * (C.cabAncho - 0.6) / 4], 0.018, 'mate', PAL_NEGRO, 6);
  tubo(null, [cx0 - 0.10, yV + hV * 0.05, cz0 + 0.25], [cx0 - 0.10, yV + hV * 0.05, cz1 - 0.25], 0.022, 'mate', PAL_NEGRO, 6);
  /* techo amarillo con alero (FOPS) y su canto negro */
  AM('CBN', cx1 - cx0 + 0.36, 0.14, cz1 - cz0 + 0.26, cxm - 0.06, C.cabTop - 0.07, czm, 0.04);
  bloque(null, cx1 - cx0 + 0.2, 0.06, cz1 - cz0 + 0.1, 'mate', PAL_NEGRO, cxm, C.cabTop - 0.17, czm, 0.02);
  /* limpiaparabrisas, asiento y palancas que se ven por el vidrio */
  tubo(null, [cx0 - 0.03, yV - hV * 0.40, czm - 0.3], [cx0 - 0.03, yV + hV * 0.10, czm + 0.15], 0.012, 'mate', '#111', 6);
  bloque(null, 0.55, 0.55, 0.60, 'mate', '#2C3036', cxm + 0.25, cy0 + 0.80, czm, 0.08);
  bloque(null, 0.15, 0.75, 0.58, 'mate', '#2C3036', cxm + 0.55, cy0 + 1.30, czm, 0.05);
  bloque('JLH', 0.30, 0.16, 0.14, 'mate', '#15171A', cxm, cy0 + 0.95, czm + 0.40, 0.03);
  bloque('JRH', 0.30, 0.16, 0.14, 'mate', '#15171A', cxm, cy0 + 0.95, czm - 0.40, 0.03);
  cilindro('JLH', 0.03, 0.03, 0.20, 'mate', '#111', cxm - 0.08, cy0 + 1.12, czm + 0.40, null, 8);
  cilindro('JRH', 0.03, 0.03, 0.20, 'mate', '#111', cxm - 0.08, cy0 + 1.12, czm - 0.40, null, 8);
  /* aire acondicionado y baliza en el techo, espejo */
  bloque('AAC', 0.85, 0.24, 1.10, 'mate', PAL_GRIS, cx1 - 0.55, C.cabTop + 0.12, czm, 0.05);
  var bal = new THREE.Mesh(new THREE.SphereGeometry(0.10, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4, roughness: 0.3 }));
  bal.position.set(cx0 + 0.25, C.cabTop, cz1 - 0.2); D.reg('CIR', bal, '#F0A41C');
  /* tablero electrico detras de la cabina */
  AM('TAB', 0.70, 1.35, 0.85, cx1 + 0.55, YD + 0.675, cz1 - 0.45, 0.05);
  bloque(null, 0.03, 1.15, 0.03, 'mate', PAL_AM2, cx1 + 0.19, YD + 0.675, cz1 - 0.45, 0.01);

  /* pasillo volado a la izquierda de la cabina: aqui llega la escalera vertical */
  var zW = ZL + 0.62;
  bloque(null, cx1 - XF + 0.5, 0.08, 0.66, 'mate', PAL_REJA, (XF - 0.3 + cx1 + 0.2) / 2, YD - 0.04, ZL + 0.31, 0.02);
  bloque(null, cx1 - XF + 0.5, 0.18, 0.08, 'pintura', PAL_AM, (XF - 0.3 + cx1 + 0.2) / 2, YD - 0.13, zW, 0.02);
  [XF + 0.3, cx1].forEach(function(x){ tubo(null, [x, YD - 0.15, zW], [x, YD - 0.9, ZL + 0.02], 0.05, 'pintura', PAL_AM, 10); });
  /* ledge delantero frente a la cabina */
  bloque(null, 0.42, 0.08, ZL - cz0 + 0.62, 'mate', PAL_REJA, XF - 0.21, YD - 0.04, (cz0 + zW) / 2, 0.02);
  bloque(null, 0.10, 0.20, ZL - cz0 + 0.62, 'pintura', PAL_AM, XF - 0.40, YD - 0.12, (cz0 + zW) / 2, 0.02);
  D.baranda([[XF - 0.38, cz0 - 0.10], [XF - 0.38, zW], [cx1 + 0.15, zW], [cx1 + 0.15, ZL]], YD, 1.05, PAL_BAR);
  /* faros de trabajo en la baranda delantera */
  [[cz0 + 0.15, 'FDD'], [zW - 0.15, 'FDI']].forEach(function(q){
    bloque(null, 0.14, 0.20, 0.26, 'mate', PAL_NEGRO, XF - 0.48, YD + 1.18, q[0], 0.03);
    bloque(q[1], 0.03, 0.15, 0.20, 'vidrio', '#F4EDCF', XF - 0.56, YD + 1.18, q[0], 0.01);
  });
  /* para el tajo: las escaleras van con la casa (al girar no se quedan en el suelo) */
  var nCasa = G.children.length;
  /* escalera vertical con jaula, por fuera del pasillo */
  var xe = C.escalera, yE0 = Math.max(1.0, C.altoOr - 0.5);
  [-0.24, 0.24].forEach(function(dx){ bloque(null, 0.06, YD + 1.0 - yE0, 0.07, 'pintura', PAL_BAR, xe + dx, (YD + 1.0 + yE0) / 2, zW + 0.06, 0.015); });
  var nPe = Math.round((YD - yE0) / 0.30);
  var iPe = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.018, 0.018, 0.46, 8), D.M.metal('#4A4F55'), nPe);
  var dd = new THREE.Object3D();
  for(var pe = 0; pe < nPe; pe++){ dd.position.set(xe, yE0 + 0.2 + pe * 0.30, zW + 0.06); dd.rotation.set(0, 0, Math.PI / 2); dd.updateMatrix(); iPe.setMatrixAt(pe, dd.matrix); }
  D.reg(null, iPe, '#4A4F55');
  for(var aro = 0; aro < 4; aro++){
    var ya = YD - 1.6 + aro * 0.8;
    var ar = pon(null, new THREE.TorusGeometry(0.38, 0.018, 6, 20, Math.PI), 'pintura', PAL_BAR, xe, ya, zW + 0.06, [Math.PI / 2, 0, 0]);
    ar.rotation.set(-Math.PI / 2, 0, 0);
  }
  [-0.3, 0, 0.3].forEach(function(dx){ tubo(null, [xe + dx, YD - 1.6, zW + 0.06 + Math.sqrt(0.144 - dx * dx) + 0.0], [xe + dx, YD + 0.8, zW + 0.06 + Math.sqrt(0.144 - dx * dx)], 0.014, 'pintura', PAL_BAR, 6); });

  /* ═══ nicho de bombas a la izquierda, descanso y escalera de acceso ═══ */
  reja(xr1 - xr0 - 0.05, ZL - ZN, (xr0 + xr1) / 2, (ZN + ZL) / 2, YL);
  /* cajas de engranajes de las bombas (una por motor) con sus bombas */
  var xpm = (xr0 + xr1) / 2;
  bloque('PTB1', 0.70, 0.80, 0.60, 'metal', PAL_GRIS, xpm - 0.30 * (xr1 - xr0) / 1.4, YL + 0.40, ZN + 0.35, 0.05);
  bloque('PTB2', 0.70, 0.80, 0.60, 'metal', PAL_GRIS, xpm + 0.30 * (xr1 - xr0) / 1.4, YL + 0.40, ZN + 0.35, 0.05);
  [['PYM', -0.22, 0.55], ['WP3', 0.22, 0.55], ['SP2', -0.22, 0.25], ['TPR', 0.22, 0.25]].forEach(function(q, i){
    var xb = xpm + (i % 2 ? 1 : -1) * 0.30 * (xr1 - xr0) / 1.4;
    cilindro(q[0], 0.13, 0.13, 0.40, 'metal', PAL_GRIS2, xb + q[1] * 0.6, YL + q[2] + 0.1, ZN + 0.85, EJE_Z, 16);
  });
  manguera('LPH', [[xpm - 0.4, YL + 0.9, ZN + 0.6], [xpm, YL + 1.35, ZN + 0.9], [xpm + 0.5, YL + 0.95, ZN + 0.95]], 0.045);
  /* escalerita interior del nicho a la cubierta */
  var ei0 = [xr0 + 0.25, YL], ei1 = [xr0 + 0.25 + (YD - YL) * 0.6, YD];
  [ZN + 0.15, ZN + 0.75].forEach(function(z){ tubo(null, [ei0[0] + 0.5, ei0[1], z], [ei0[0], ei1[1] + 0.9, z], 0.025, 'pintura', PAL_BAR, 8); });
  /* descanso volado afuera y la escalera grande que baja hacia atras */
  var zS = ZL + 0.58, aS = 0.90, xs0 = xr1, ys0 = YL, xs1 = C.pieEsc[0], ys1 = C.pieEsc[1];
  bloque(null, 1.35, 0.08, 1.05, 'mate', PAL_REJA, xr1 - 0.55, YL - 0.04, ZL + 0.52, 0.02);
  bloque(null, 1.35, 0.20, 0.08, 'pintura', PAL_AM, xr1 - 0.55, YL - 0.14, ZL + 1.05, 0.02);
  var Ls = Math.hypot(xs1 - xs0, ys0 - ys1), angS = Math.atan2(ys1 - ys0, xs1 - xs0);
  [-1, 1].forEach(function(k){
    bloque(null, Ls, 0.22, 0.07, 'pintura', PAL_AM, (xs0 + xs1) / 2, (ys0 + ys1) / 2 - 0.08, zS + k * aS / 2, 0.02, [0, 0, angS]);
    tubo(null, [xs0 - 0.1, ys0 + 1.0, zS + k * (aS / 2 + 0.04)], [xs1, ys1 + 0.95, zS + k * (aS / 2 + 0.04)], 0.025, 'pintura', PAL_BAR, 8);
    tubo(null, [xs0 - 0.1, ys0 + 0.52, zS + k * (aS / 2 + 0.04)], [xs1, ys1 + 0.50, zS + k * (aS / 2 + 0.04)], 0.02, 'pintura', PAL_BAR, 8);
    for(var pp = 0; pp <= 4; pp++){
      var f = pp / 4, xp = xs0 + (xs1 - xs0) * f, yp = ys0 + (ys1 - ys0) * f;
      tubo(null, [xp, yp, zS + k * (aS / 2 + 0.04)], [xp, yp + 0.97, zS + k * (aS / 2 + 0.04)], 0.022, 'pintura', PAL_BAR, 8);
    }
  });
  var nE = Math.round((ys0 - ys1) / 0.23);
  var iEs = new THREE.InstancedMesh(new THREE.BoxGeometry(0.26, 0.04, aS - 0.06), D.M.metal('#8D9096'), nE - 1);
  for(var es = 1; es < nE; es++){
    var fe = es / nE; dd.rotation.set(0, 0, 0);
    dd.position.set(xs0 + (xs1 - xs0) * fe, ys0 + (ys1 - ys0) * fe - 0.06, zS); dd.updateMatrix(); iEs.setMatrixAt(es - 1, dd.matrix);
  }
  D.reg(null, iEs, '#8D9096');
  /* tirante amarillo que cuelga la escalera del costado */
  tubo(null, [xs0 + (xs1 - xs0) * 0.45, ys0 + (ys1 - ys0) * 0.45 - 0.1, zS], [xs0 + (xs1 - xs0) * 0.15, YB + 0.2, ZL - 0.02], 0.07, 'pintura', PAL_AM, 10);
  tubo(null, [xs0 + (xs1 - xs0) * 0.45, ys0 + (ys1 - ys0) * 0.45 - 0.1, zS], [xs0 + (xs1 - xs0) * 0.62, YB + 0.05, ZL - 0.05], 0.06, 'pintura', PAL_AM, 10);
  /* el cilindro que la sube y baja */
  D.cilHidD('PHY', [xs0 + 0.2, YB + 0.55, ZL + 0.08], [xs0 + (xs1 - xs0) * 0.32, ys0 + (ys1 - ys0) * 0.32 - 0.12, zS - aS / 2], 0.05, PAL_NEGRO, 0.55);
  G.children.slice(nCasa).forEach(function(m){ m.userData.casa = true; });

  /* ═══ cubierta: tanque, engrase, capots de motores, filtros y escapes ═══ */
  /* tanque hidraulico adelante a la derecha, con filtros y respiradero */
  var xT = -0.2 * s;
  AM('TQH1', 2.0 * s, 1.35, 1.6, xT, YD + 0.675, -ZL + 1.25, 0.06);
  [-0.5, 0, 0.5].forEach(function(dx){ cilindro(null, 0.12, 0.12, 0.25, 'metal', PAL_GRIS2, xT + dx, YD + 1.47, -ZL + 1.25, null, 16); });
  bloque(null, 0.06, 0.70, 0.03, 'vidrio', '#9BB7C9', xT - 1.01 * s, YD + 0.70, -ZL + 1.0, 0.01);
  /* engrase centralizado en la esquina delantera derecha */
  bloque('SEN', 0.80, 0.95, 0.75, 'mate', PAL_GRIS, XF + 0.65, YD + 0.475, -ZL + 0.75, 0.04);
  cilindro('SEN', 0.22, 0.22, 0.25, 'mate', '#C2241B', XF + 0.65, YD + 1.07, -ZL + 0.75, null, 18);
  /* enfriadores de aceite: rejilla en el costado derecho del medio */
  var xCh0 = xr0 - 0.2, xCh1 = xr1 + 0.2;
  bloque('CHD1', xCh1 - xCh0, 1.25, 0.05, 'mate', '#202326', (xCh0 + xCh1) / 2, YD - 0.95, -ZL - 0.02, 0.01);
  var nCh = 9, iCh = new THREE.InstancedMesh(new THREE.BoxGeometry(xCh1 - xCh0 - 0.1, 0.05, 0.10), D.M.pintura(PAL_AM), nCh);
  for(var ch = 0; ch < nCh; ch++){ dd.position.set((xCh0 + xCh1) / 2, YD - 1.48 + ch * 0.13, -ZL - 0.06); dd.rotation.set(-0.55, 0, 0); dd.updateMatrix(); iCh.setMatrixAt(ch, dd.matrix); }
  D.reg(null, iCh, PAL_AM);
  /* capots de los dos motores con sus filtros de aire negros */
  var xE0 = xr1 + 0.4, xE1 = XR - 1.0;
  [[1, 'ENG1'], [-1, 'ENG2']].forEach(function(q){
    var l = q[0], ze = l * (ZL * 0.48);
    AM(q[1], xE1 - xE0, 0.38, ZL * 0.62, (xE0 + xE1) / 2, YD + 0.19, ze, 0.05);
    [0, 1].forEach(function(k){ bloque(null, 0.70, 0.04, ZL * 0.5, 'pintura', PAL_AM2, xE0 + 0.6 + k * 1.2, YD + 0.39, ze, 0.01); });
    NG(null, 0.85, 0.95, 0.85, xE0 + 0.55, YD + 0.85, l * (ZL - 0.95), 0.06);
    NG(null, 0.85, 0.95, 0.85, xE0 + 1.55, YD + 0.85, l * (ZL - 0.95), 0.06);
    [0.55, 1.55].forEach(function(dx){ cilindro(null, 0.20, 0.22, 0.18, 'mate', PAL_NEGRO, xE0 + dx, YD + 1.42, l * (ZL - 0.95), null, 18); });
    /* rejillas de ventilacion del cuarto de motores en el costado */
    var xg0 = C.rejas[0], xg1 = C.rejas[1], cols = N50 ? 3 : 3, filas = N50 ? 4 : 4;
    for(var cg = 0; cg < cols; cg++){
      for(var fg = 0; fg < filas; fg++){
        var wg = (xg1 - xg0) / cols, hg = (YD - 0.2 - (YM + 0.45)) / filas;
        bloque(q[1], wg * 0.62, hg * 0.70, 0.05, 'mate', '#121416', xg0 + wg * (cg + 0.5), YM + 0.45 + hg * (fg + 0.5), l * (ZL + 0.005), 0.015);
      }
    }
  });
  /* cuatro escapes cromados con silenciadores plateados, atras */
  var xEx = XR - 1.05;
  [-1.85, -1.10, 1.10, 1.85].forEach(function(zz){
    var z = zz * ZL / 3.05;
    bloque(null, 0.70, 0.50, 0.55, 'metal', '#BFC4C9', xEx, YD + 0.30, z, 0.08);
    tubo(null, [xEx - 0.05, YD + 0.5, z], [xEx - 0.05, YD + 0.95, z], 0.12, 'cromo', null, 16);
    tubo(null, [xEx - 0.05, YD + 0.93, z], [xEx + 0.22, YD + 1.18, z], 0.12, 'cromo', null, 16);
    cilindro(null, 0.125, 0.125, 0.02, 'mate', '#0B0C0D', xEx + 0.24, YD + 1.20, z, [0, 0, Math.PI / 4], 16);
  });
  /* botellas rojas del sistema contra incendios */
  for(var bt = 0; bt < C.botellas; bt++){
    var zb = N50 ? -1.9 + bt * 0.32 : -0.30 + bt * 0.6;
    cilindro('SCI', 0.15, 0.15, 0.80, 'pintura', '#C3271D', XR - 2.1, YD + 0.45, zb, null, 18);
    pon(null, new THREE.SphereGeometry(0.15, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), 'pintura', '#C3271D', XR - 2.1, YD + 0.85, zb);
    cilindro(null, 0.04, 0.04, 0.12, 'metal', '#8A8F96', XR - 2.1, YD + 1.0, zb, null, 8);
  }
  /* luces de trabajo en las esquinas traseras */
  [-1, 1].forEach(function(l){
    bloque(null, 0.12, 0.18, 0.24, 'mate', PAL_NEGRO, XR - 0.25, YD + 1.25, l * (ZL - 0.25), 0.03);
    bloque('LSM', 0.03, 0.14, 0.18, 'vidrio', '#F4EDCF', XR - 0.18, YD + 1.25, l * (ZL - 0.25), 0.01);
  });
  /* barandas negras alrededor de la cubierta */
  D.baranda([[cx1 + 0.15, ZL - 0.05], [xr0, ZL - 0.05], [xr0, ZN - 0.05], [xr1 - 0.9, ZN - 0.05]], YD, 1.05, PAL_BAR);
  D.baranda([[xr1, ZL - 0.05], [XR - 0.12, ZL - 0.05], [XR - 0.12, -ZL + 0.05], [XF + 0.12, -ZL + 0.05], [XF + 0.12, -WB / 2 - 0.9]], YD, 1.05, PAL_BAR);
  D.baranda([[xr1 - 1.2, ZL + 1.02], [xr1 + 0.05, ZL + 1.02]], YL, 1.0, PAL_BAR);

  /* ═══ contrapeso: dos rejillas de lamas, ventiladores y el CAT grande ═══ */
  var kR = (YD - YB) / 2.99, yR0 = YD - 1.65 * kR, yR1 = YD - 0.33 * kR;
  [[1, 'RAD1', 'FAN1', 'FMT1'], [-1, 'RAD2', 'FAN3', 'FMT2']].forEach(function(q){
    var zc = q[0] * 1.51 * C.ancho / 6.1, wR = 1.80 * C.ancho / 6.1;
    bloque(q[1], 0.06, yR1 - yR0, wR, 'mate', '#16181B', XR + 0.045, (yR0 + yR1) / 2, zc, 0.01);
    /* el ventilador se ve detras de las lamas */
    pon(q[2], new THREE.TorusGeometry(Math.min(wR, yR1 - yR0) * 0.40, 0.05, 8, 32), 'metal', '#34383E', XR + 0.06, (yR0 + yR1) / 2, zc, [0, Math.PI / 2, 0]);
    cilindro(q[3], 0.18, 0.18, 0.10, 'metal', '#4A4F55', XR + 0.07, (yR0 + yR1) / 2, zc, EJE_X, 16);
    var nL = 10, iL = new THREE.InstancedMesh(new THREE.BoxGeometry(0.16, 0.05, wR - 0.06), D.M.pintura(PAL_AM), nL);
    for(var li = 0; li < nL; li++){ dd.position.set(XR + 0.12, yR0 + (li + 0.5) * (yR1 - yR0) / nL, zc); dd.rotation.set(0, 0, 0.45); dd.updateMatrix(); iL.setMatrixAt(li, dd.matrix); }
    D.reg(null, iL, PAL_AM);
    /* marco */
    [-1, 1].forEach(function(k){
      bloque(null, 0.14, yR1 - yR0 + 0.12, 0.07, 'pintura', PAL_AM2, XR + 0.07, (yR0 + yR1) / 2, zc + k * wR / 2, 0.02);
      bloque(null, 0.14, 0.07, wR + 0.06, 'pintura', PAL_AM2, XR + 0.07, k > 0 ? yR1 + 0.03 : yR0 - 0.03, zc, 0.02);
    });
  });
  var texCAT = texRotulo3d(rotuloCAT, 512, 256);
  var wCat = 1.62 * C.ancho / 6.1;
  letrero(texCAT, wCat, 0.93 * kR, XR + 0.05, YD - 2.27 * kR, 0, Math.PI / 2);
  /* CAT y modelo en los costados */
  var texMod = texRotulo3d(palRotuloModelo(C.nombre), 256, 96);
  [-1, 1].forEach(function(l){
    if(N50 && l < 0){
      /* el 6050 lleva el CAT 6050 en vertical en el costado derecho, atras */
      letrero(texCAT, 1.0, 0.55, XR - 0.75, YD - 0.45, -ZL - 0.05, Math.PI);
      letrero(texMod, 0.95, 0.36, XR - 0.75, YD - 0.92, -ZL - 0.05, Math.PI);
      return;
    }
    letrero(texCAT, 1.05, 0.55, C.logo, YD - 0.45, l * (ZL + 0.05), l > 0 ? 0 : Math.PI);
    letrero(texMod, 0.78, 0.29, C.logo - 0.12, YD - 0.92, l * (ZL + 0.05), l > 0 ? 0 : Math.PI);
  });
  letrero(texCAT, 0.95, 0.5, XF - 0.05, YD - 0.85, ZL - 1.0, -Math.PI / 2);
  /* numero de unidad en el costado delantero */
  var texNum = texNumero3d(null, '#16181C');
  [-1, 1].forEach(function(l){
    var mN = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.50), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
    mN.position.set(XF + 1.25, YM + 0.45, l * (ZL + 0.05)); mN.rotation.y = l > 0 ? 0 : Math.PI;
    G.add(mN);
  });

  /* ═══ equipo frontal TriPower: pose resuelta ═══
     puntos medidos en el dibujo del 6050, relativos al pie de pluma F */
  var T0 = rel([4.82, 4.62]), P0 = rel([2.82, 3.57]), R10 = rel([3.82, 3.97]), R20 = rel([1.81, 4.07]), R30 = rel([2.82, 2.90]),
      K00 = rel([0.92, 0.29]);
  var LC = Math.hypot(R20[0] - C0[0], R20[1] - C0[1]);
  var sb = C.escBalde, Lb = C.brazo;
  /* el cucharon en su marco: pivote en (0,0), espalda hacia atras, labio adelante abajo */
  var BAL = [[0.35, 0.50], [1.60, 0.62], [2.30, 0.20], [3.80, -2.42], [3.72, -2.62], [3.30, -2.80], [1.30, -2.80], [0.85, -2.70], [0.52, -2.45], [0.36, -2.05]]
    .map(function(p){ return [p[0] * sb, p[1] * sb]; });
  var bK = -8 * Math.PI / 180;
  var bkMin = 0;
  BAL.concat([[4.35 * sb, -2.75 * sb]]).forEach(function(p){ var q = palGiro(p, [0, 0], bK); bkMin = Math.min(bkMin, q[1]); });
  var yBp = 0.10 - bkMin, tB = 0, T, aBr;
  /* la pluma baja hasta que el brazo cuelga a unos 75 grados */
  for(var gb = 0; gb <= 60; gb++){
    tB = -gb * Math.PI / 180;
    T = palGiro(T0, F, tB);
    if(T[1] - yBp <= Lb * Math.sin(75 * Math.PI / 180)) break;
  }
  var dyB = Math.min(Lb, T[1] - yBp);
  aBr = -Math.asin(dyB / Lb);
  var Bp = [T[0] + Lb * Math.cos(aBr), T[1] + Lb * Math.sin(aBr)];
  var Pp = palGiro(P0, F, tB);
  /* el balancin gira con la pluma y un poco mas, lo que pida la biela */
  var phi = 0, mejor = 1e9;
  for(var ph = -40; ph <= 40; ph += 0.25){
    var r2 = palGiro(palGiro(R20, F, tB), Pp, ph * Math.PI / 180);
    var e = Math.abs(Math.hypot(r2[0] - C0[0], r2[1] - C0[1]) - LC);
    if(e < mejor){ mejor = e; phi = ph * Math.PI / 180; }
  }
  var rk = function(p){ return palGiro(palGiro(p, F, tB), Pp, phi); };
  var R1 = rk(R10), R2 = rk(R20), R3 = rk(R30), K0 = palGiro(K00, F, tB);
  var dB = [Math.cos(aBr), Math.sin(aBr)], nB = [dB[1], -dB[0]];
  var S2 = [T[0] + dB[0] * 0.40 * Lb + nB[0] * 0.46 * s, T[1] + dB[1] * 0.40 * Lb + nB[1] * 0.46 * s];
  var bk = function(p){ var q = palGiro([p[0] * sb, p[1] * sb], [0, 0], bK); return [Bp[0] + q[0], Bp[1] + q[1]]; };

  /* ═══ pluma: cajon curvo y macizo ═══ */
  var CTRL = [[-0.75, -0.35], [-0.75, 0.70], [-0.45, 1.90], [0.35, 3.30], [1.30, 4.55], [2.40, 5.25], [3.40, 5.42], [4.30, 5.25], [5.00, 4.95],
              [5.40, 4.50], [5.10, 4.00], [4.30, 3.85], [3.40, 3.30], [2.40, 2.30], [1.50, 1.10], [0.95, 0.15], [0.45, -0.55], [-0.20, -0.75]];
  var pluma = palSuave(CTRL.map(function(p){ return palGiro(rel(p), F, tB); }), 90);
  perfil('PYB', mp(pluma), WB, 0, 'pintura', PAL_AM, 0.06);
  /* almas laterales un tono mas oscuras para que se lea el volumen */
  var alma = palSuave([[0.0, 0.2], [0.1, 1.6], [1.0, 3.4], [2.4, 4.6], [3.6, 4.85], [4.4, 4.5], [3.4, 3.7], [2.2, 2.7], [1.2, 1.3], [0.6, 0.1]]
    .map(function(p){ return palGiro(rel(p), F, tB); }), 60);
  [-1, 1].forEach(function(l){ perfil(null, mp(alma), 0.04, l * (WB / 2 + 0.01), 'pintura', '#D99C12', 0.01); });
  /* pie de pluma: los dos ojos y el perno */
  [-1, 1].forEach(function(l){ cilindro(null, 0.50 * s, 0.50 * s, 0.10, 'pintura', PAL_AM2, -F[0], F[1], l * (WB / 2 + 0.03), EJE_Z, 24); });
  /* pasarela con barandas sobre el lomo de la pluma */
  var lomo = [[-0.62, 0.75], [-0.33, 1.95], [0.45, 3.35], [1.38, 4.58], [2.40, 5.30]].map(function(p){ return palGiro(rel(p), F, tB); });
  for(var lb = 1; lb < lomo.length; lb++){
    var a0 = lomo[lb - 1], a1 = lomo[lb];
    var largo = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]), angL = Math.atan2(a1[1] - a0[1], -(a1[0] - a0[0]));
    bloque(null, largo, 0.04, WB - 0.1, 'mate', PAL_REJA, -(a0[0] + a1[0]) / 2, (a0[1] + a1[1]) / 2 + 0.06, 0, 0.01, [0, 0, angL]);
  }
  [-1, 1].forEach(function(l){
    var zb = l * (WB / 2 - 0.04);
    lomo.forEach(function(p, i){
      tubo(null, [-p[0], p[1] + 0.05, zb], [-p[0], p[1] + 1.0, zb], 0.024, 'pintura', PAL_BAR, 8);
      if(i) tubo(null, [-lomo[i - 1][0], lomo[i - 1][1] + 1.0, zb], [-p[0], p[1] + 1.0, zb], 0.024, 'pintura', PAL_BAR, 8);
      if(i) tubo(null, [-lomo[i - 1][0], lomo[i - 1][1] + 0.52, zb], [-p[0], p[1] + 0.52, zb], 0.02, 'pintura', PAL_BAR, 8);
    });
  });
  /* valvula principal sobre el pie de la pluma y el haz de mangueras */
  var pV = palGiro(rel([0.0, 2.6]), F, tB);
  bloque('VV1', 1.0 * s, 0.55, 0.95 * s, 'metal', PAL_GRIS, -pV[0] + 0.2, pV[1], 0, 0.05, [0, 0, -0.9 - tB]);
  bloque('SENS', 0.20, 0.16, 0.20, 'mate', PAL_GRIS2, -pV[0] - 0.4, pV[1] + 0.6, WB / 2 - 0.25, 0.02);
  [-0.42, -0.22, 0.22, 0.42].forEach(function(z, i){
    var cam = [[-0.55, 0.2], [-0.25, 1.95], [0.55, 3.45], [1.45, 4.70], [2.45, 5.48], [3.45, 5.62], [4.35, 5.45], [5.05, 5.15]]
      .map(function(p){ var q = palGiro(rel(p), F, tB); return [-q[0], q[1] + 0.08 + (i % 2) * 0.06, z]; });
    manguera('LPH', cam, 0.055 * s);
  });
  /* el lazo de mangueras que pasa de la punta de la pluma al brazo */
  [-0.35, 0.35].forEach(function(z){
    var tp = palGiro(rel([5.05, 5.15]), F, tB);
    manguera('LPH', [[-tp[0], tp[1] + 0.1, z], [-T[0] - 0.9, T[1] + 1.1, z * 1.4], [-T[0] - 1.5, T[1] + 0.2, z * 1.6], [-(T[0] + dB[0] * 1.6) - 0.6, T[1] + dB[1] * 1.6, z * 1.8]], 0.05 * s);
  });
  /* luces en la pluma */
  [-1, 1].forEach(function(l){
    var pl2 = palGiro(rel([1.3, 3.2]), F, tB);
    bloque(null, 0.14, 0.20, 0.24, 'mate', PAL_NEGRO, -pl2[0], pl2[1], l * (WB / 2 + 0.14), 0.03);
    bloque('LSM', 0.03, 0.15, 0.18, 'vidrio', '#F4EDCF', -pl2[0] - 0.08, pl2[1], l * (WB / 2 + 0.14), 0.01);
  });

  /* ═══ balancines TriPower (uno por lado) ═══ */
  [[1, null], [-1, 'TPW2']].forEach(function(q){
    var l = q[0];
    [WB / 2 + 0.12, WB / 2 + 0.74].forEach(function(z){
      perfil(q[1], mp(palCasco(palCirc(R1, 0.36 * s, 12).concat(palCirc(R2, 0.36 * s, 12), palCirc(R3, 0.38 * s, 12), palCirc(Pp, 0.50 * s, 14)))), 0.14, l * z, 'pintura', PAL_AM, 0.03);
    });
    perno('PYB', Pp, l * (WB / 2 - 0.05), l * (WB / 2 + 0.88), 0.20 * s);
    [R1, R2, R3].forEach(function(p){ perno(null, p, l * (WB / 2 + 0.05), l * (WB / 2 + 0.84), 0.12 * s); });
  });

  /* ═══ cilindros: levante, biela, empuje y volteo ═══ */
  [[1, 'PHY', 'PHY'], [-1, 'HRH', 'PHY']].forEach(function(q){
    var l = q[0], z = l * ZC;
    D.cilHidD(q[1], mz(R3, z), mz(B0, z), 0.30 * s, PAL_NEGRO, 0.55);
    /* biela de compresion: barra amarilla con ojos */
    tubo(null, mz(R2, z), mz(C0, z), 0.17 * s, 'pintura', PAL_AM, 18);
    [R2, C0].forEach(function(p){ cilindro(null, 0.27 * s, 0.27 * s, 0.26, 'pintura', PAL_AM2, -p[0], p[1], z, EJE_Z, 20); });
  });
  /* cilindros de empuje: bajo la pluma hasta la oreja del brazo */
  [[1, 'PAL'], [-1, 'PSK']].forEach(function(q){
    var z = q[0] * 0.48 * s;
    D.cilHidD(q[1], mz(K0, z), mz(S2, z), 0.27 * s, PAL_NEGRO, 0.52);
  });
  oreja('PYB', K0, 0.30 * s, [palGiro(rel([0.3, 0.3]), F, tB), palGiro(rel([1.4, 1.2]), F, tB)], 0, 1.3 * s, PAL_AM2);

  /* ═══ brazo corto y macizo con la franja CAT ═══ */
  var brazo = palCasco(palCirc(T, 0.86 * s, 18).concat(palCirc(Bp, 0.68 * s, 16), palCirc(S2, 0.38 * s, 12),
    palCirc([T[0] + dB[0] * Lb * 0.55 - nB[0] * 0.22 * s, T[1] + dB[1] * Lb * 0.55 - nB[1] * 0.22 * s], 0.80 * s, 12)));
  var WBr = 1.40 * s;
  perfil('PSK', mp(brazo), WBr, 0, 'pintura', PAL_AM, 0.06);
  [-1, 1].forEach(function(l){
    cilindro(null, 0.52 * s, 0.52 * s, 0.10, 'pintura', PAL_AM2, -T[0], T[1], l * (WBr / 2 + 0.03), EJE_Z, 24);
    cilindro(null, 0.40 * s, 0.40 * s, 0.10, 'pintura', PAL_AM2, -Bp[0], Bp[1], l * (WBr / 2 + 0.03), EJE_Z, 22);
  });
  perno('PYB', T, -WB / 2 - 0.1, WB / 2 + 0.1, 0.22 * s);
  /* franja CAT en los dos costados del brazo */
  var texBr = texRotulo3d(palRotuloBrazo, 512, 160);
  [-1, 1].forEach(function(l){
    var mB = new THREE.Mesh(new THREE.PlaneGeometry(1.8 * s, 0.56 * s), new THREE.MeshStandardMaterial({ map: texBr, transparent: true, roughness: 0.5 }));
    var pm = [T[0] + dB[0] * Lb * 0.42, T[1] + dB[1] * Lb * 0.42];
    var am = Math.atan2(dB[1], -dB[0]);
    mB.position.set(-pm[0], pm[1], l * (WBr / 2 + 0.065));
    mB.rotation.set(0, l > 0 ? 0 : Math.PI, l > 0 ? am + Math.PI : -am - Math.PI);
    G.add(mB);
  });

  /* ═══ cucharon de descarga por el fondo ═══ */
  /* para el tajo: la almeja (costados, piso, labio y dientes) se marca para
     poder abrirla sobre su bisagra; la espalda y la viga quedan con el brazo */
  var marcarAlmeja = function(n0){ G.children.slice(n0).forEach(function(m){ m.userData.almeja = true; }); };
  var nAl = G.children.length;
  var WC = C.balde, zLc = WC / 2 - 0.07;
  var lado = BAL.map(function(p){ return bk([p[0] / sb, p[1] / sb]); });
  [-1, 1].forEach(function(l){
    perfil('LPN', mp(lado), 0.14, l * zLc, 'pintura', PAL_AM, 0.03);
    /* placas de desgaste en el costado (cuadricula del render) */
    [[1.4, -1.2], [2.3, -1.2], [1.4, -2.15], [2.3, -2.15], [3.1, -2.1]].forEach(function(c){
      var pc = bk(c), pq = palCasco(palCirc([0, 0], 0.32 * sb, 4).map(function(v){ return [v[0] * 1.2, v[1]]; }));
      var g = geoPerfilB(pq.map(function(v){ var r2 = palGiro(v, [0, 0], bK + Math.PI / 4 * 0); return [-r2[0] - pc[0], r2[1] + pc[1]]; }), 0.05, l * (zLc + 0.09), 0.01);
      pon('GET', g, 'pintura', PAL_AM2);
    });
    /* refuerzo del canto delantero del costado */
    var f0 = bk([2.30, 0.20]), f1 = bk([3.80, -2.42]);
    tubo(null, [-f0[0], f0[1], l * (zLc + 0.02)], [-f1[0], f1[1], l * (zLc + 0.02)], 0.10 * sb, 'pintura', PAL_AM2, 12);
  });
  marcarAlmeja(nAl);
  /* piso, espalda y viga de arriba */
  nAl = G.children.length;
  var piso = [[0.33, -2.00], [0.55, -2.45], [1.05, -2.72], [3.30, -2.80], [3.72, -2.62], [3.80, -2.42], [3.55, -2.40], [3.15, -2.58], [1.10, -2.50], [0.70, -2.30], [0.52, -1.95]]
    .map(function(p){ return bk(p); });
  perfil('LPN', mp(piso), WC - 0.12, 0, 'pintura', PAL_AM, 0.03);
  marcarAlmeja(nAl);
  var espalda = [[0.33, 0.52], [0.58, 0.52], [0.58, -2.0], [0.33, -2.0]].map(function(p){ return bk(p); });
  perfil('LPN', mp(espalda), WC - 0.12, 0, 'pintura', PAL_AM, 0.03);
  /* nervios verticales en la espalda */
  [-2.2, -1.55, 1.55, 2.2].forEach(function(z){
    var nv = [[0.18, 0.42], [0.34, 0.42], [0.34, -1.98], [0.24, -1.98]].map(function(p){ return bk(p); });
    perfil(null, mp(nv), 0.10, z * WC / 4.8, 'pintura', PAL_AM2, 0.02);
  });
  var viga = [[0.33, 0.66], [1.60, 0.76], [1.65, 0.50], [0.33, 0.40]].map(function(p){ return bk(p); });
  perfil('LPN', mp(viga), WC + 0.04, 0, 'pintura', PAL_AM, 0.04);
  /* interior gastado del piso (se ve desde arriba) */
  nAl = G.children.length;
  var gast = [[0.62, -1.95], [0.75, -2.28], [1.10, -2.46], [3.15, -2.54], [3.50, -2.38], [3.45, -2.30], [1.10, -2.38], [0.70, -1.95]].map(function(p){ return bk(p); });
  perfil(null, mp(gast), WC - 0.5, 0, 'metal', '#8E8676', 0.02);
  /* labio, dientes y protectores entre dientes */
  var lip0 = bk([3.80, -2.50]), dirD = bK - 12 * Math.PI / 180;
  bloque('GET', 0.34 * sb, 0.30 * sb, WC + 0.06, 'pintura', PAL_AM2, -lip0[0] + 0.05, lip0[1], 0, 0.05, [0, 0, -bK]);
  for(var dt = 0; dt < 6; dt++){
    var zd = -WC / 2 + 0.42 + dt * (WC - 0.84) / 5;
    var pa = [lip0[0] + Math.cos(dirD) * 0.28 * sb, lip0[1] + Math.sin(dirD) * 0.28 * sb];
    bloque('GET', 0.55 * sb, 0.26 * sb, 0.26, 'metal', '#5D6167', -pa[0], pa[1], zd, 0.04, [0, 0, -dirD]);
    var pt = [lip0[0] + Math.cos(dirD) * 0.70 * sb, lip0[1] + Math.sin(dirD) * 0.70 * sb];
    var dn = cilindro('GET', 0.02, 0.13 * sb, 0.42 * sb, 'metal', '#71757B', -pt[0], pt[1], zd, null, 4);
    dn.rotation.set(0, 0, Math.PI / 2 - dirD);
    dn.scale.set(1, 1, 1.6);
    if(dt < 5) bloque('GET', 0.40 * sb, 0.16 * sb, 0.36, 'metal', '#5D6167', -pa[0] + 0.05, pa[1] + 0.03, zd + (WC - 0.84) / 10, 0.03, [0, 0, -dirD]);
  }
  marcarAlmeja(nAl);
  /* orejas del brazo y de los cilindros de volteo en la espalda */
  var Bl = bk([0.05, -1.30]);
  [-1, 1].forEach(function(l){
    [l * (WBr / 2 + 0.10)].forEach(function(z){ oreja('PYB', Bp, 0.42 * sb, [bk([0.45, 0.45]), bk([0.45, -0.8])], z, 0.16); });
    [l * ZC - 0.26, l * ZC + 0.26].forEach(function(z){ oreja(null, Bl, 0.26 * sb, [bk([0.45, -0.85]), bk([0.45, -1.85])], z, 0.12); });
  });
  perno('PYB', Bp, -WBr / 2 - 0.25, WBr / 2 + 0.25, 0.17 * s);
  [-1, 1].forEach(function(l){ perno(null, Bl, l * ZC - 0.34, l * ZC + 0.34, 0.11 * s); });
  /* cilindros de volteo (del balancin a la espalda) y de la almeja */
  [[1, 'PVL'], [-1, 'PHY']].forEach(function(q){
    var z = q[0] * ZC;
    D.cilHidD(q[1], mz(R1, z), mz(Bl, z), 0.22 * s, PAL_NEGRO, 0.55);
    var za = q[0] * (WC / 2 - 0.55);
    var c0 = bk([0.10, 0.30]), c1 = bk([0.20, -1.70]);
    D.cilHidD('PHY', mz(c0, za), mz(c1, za), 0.13 * s, PAL_NEGRO, 0.55);
    [c0, c1].forEach(function(p){ oreja(null, p, 0.18, [bk([0.45, (p === c0 ? 0.3 : -1.7) + 0.2]), bk([0.45, (p === c0 ? 0.3 : -1.7) - 0.2])], za, 0.20); });
  });

  /* centrar en X: la pala va del cucharon a la cola */
  var caja = new THREE.Box3().setFromObject(G);
  var off = -(caja.min.x + caja.max.x) / 2;
  G.children.forEach(function(m){ m.position.x += off; });
  /* lo que el tajo necesita para girar la casa, levantar el frente y abrir la
     almeja, ya centrado (el modelo esta en espejo: x del dibujo -> -x) */
  var hb = bk([0.50, 0.62]);
  G.userData.giroX = off;
  G.userData.pie = [-F[0] + off, F[1]];
  G.userData.frente = XF + off;
  G.userData.bisagra = [-hb[0] + off, hb[1]];

  G.userData.ruedas = [];
  G.userData.ponerNumero = function(id2){ texNum.userData.poner(id2); };
  G.userData.mirarY = 4.6 * s + 0.4;
  G.userData.dist = N50 ? 50 : 46;
  G.userData.modelo = 'PAL' + id;
  return G;
}

/* ══════════════════════════════════════════════════════════════════
   MARTILLO HIDRAULICO HYDROKHAN UG — tipo silencioso (carcasa cerrada)
   ══════════════════════════════════════════════════════════════════ */
var PAL_UG = {
  'UG3300': { largo: 3.281, punta: 0.158, kg: 2822, caja: 1.92, alto: 0.60, ancho: 0.66, soporte: 0.47, cincel: 0.76 },
  'UG5000': { largo: 3.618, punta: 0.180, kg: 3842, caja: 2.12, alto: 0.68, ancho: 0.74, soporte: 0.50, cincel: 0.86 }
};
var PAL_UG_AZUL = '#1650A6', PAL_UG_AZUL2 = '#123F82', PAL_UG_NEGRO = '#141518';

/* rotulo pegado en la carcasa: «UG3300» azul sobre blanco, como en las fotos */
function palRotuloUG(txt){
  return function(g, w, h){
    g.fillStyle = '#F4F6F8'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#174A91'; g.lineWidth = h * 0.08; g.strokeRect(h * 0.06, h * 0.06, w - h * 0.12, h - h * 0.12);
    g.fillStyle = '#174A91'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.62) + 'px "Arial Black", Arial, sans-serif';
    g.fillText(txt, w / 2, h * 0.54);
  };
}
function palRotuloHK(g, w, h){
  g.fillStyle = PAL_UG_AZUL; g.fillRect(0, 0, w, h);
  g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold italic ' + Math.round(h * 0.58) + 'px "Arial Black", Arial, sans-serif';
  g.fillText('HYDROKHAN', w / 2, h * 0.55);
}

function palConstruirMartillo(id, piezas){
  var C = PAL_UG[id];
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var bloque = D.bloque, perfil = D.perfil, tubo = D.tubo, cilindro = D.cilindro, pon = D.pon, letrero = D.letrero;
  var EJE_Z = [Math.PI / 2, 0, 0], EJE_X = [0, 0, Math.PI / 2];
  /* echado sobre su costado angosto: el eje del martillo va en X, la punta
     hacia -X; las caras grandes (con los rotulos) miran a +Z y -Z */
  var H = C.alto, W = C.ancho, yc = 0.16 + H / 2;
  var xP = -C.largo / 2, xC0 = xP + C.cincel + 0.12, xC1 = xC0 + C.caja, xS1 = xC1 + C.soporte;

  /* durmientes de madera y cunas */
  [xC0 + 0.35, xC1 - 0.35].forEach(function(x){
    bloque(null, 0.22, 0.16, W + 0.55, 'mate', '#7A5634', x, 0.08, 0, 0.02);
    [-1, 1].forEach(function(l){ perfil(null, [[x - 0.10, 0.16], [x + 0.10, 0.16], [x + 0.10, 0.24], [x - 0.10, 0.30]].map(function(p){ return [p[0], p[1]]; }), 0.08, l * (W / 2 + 0.12), 'mate', '#6B4A2C', 0.01); });
  });

  /* ═══ carcasa azul ═══ */
  bloque(null, C.caja, H, W, 'pintura', PAL_UG_AZUL, (xC0 + xC1) / 2, yc, 0, 0.05);
  /* refuerzos negros en las esquinas de la punta y del soporte */
  [xC0 + 0.08, xC1 - 0.08].forEach(function(x){ bloque(null, 0.20, H + 0.05, W + 0.05, 'mate', PAL_UG_NEGRO, x, yc, 0, 0.03); });
  /* placas de desgaste a lo largo de los cantos angostos */
  [-1, 1].forEach(function(k){ bloque(null, C.caja - 0.5, 0.04, W * 0.55, 'metal', '#3A3D42', (xC0 + xC1) / 2, yc + k * (H / 2 + 0.02), 0, 0.01); });
  /* ventana lateral que deja ver el cilindro, pernos y rotulos */
  var texUG = texRotulo3d(palRotuloUG(id), 384, 128), texHK = texRotulo3d(palRotuloHK, 512, 96);
  var gPn = new THREE.CylinderGeometry(0.038, 0.038, 0.05, 6);
  var iPn = new THREE.InstancedMesh(gPn, D.M.metal('#2B2D31'), 16);
  var dd = new THREE.Object3D(), kp = 0;
  [-1, 1].forEach(function(l){
    var zf = l * (W / 2);
    bloque(null, C.caja * 0.30, H * 0.36, 0.04, 'mate', '#0B0C0E', xC0 + C.caja * 0.55, yc + H * 0.10, zf, 0.02);
    cilindro('PHY', H * 0.16, H * 0.16, C.caja * 0.28, 'metal', '#4A4E55', xC0 + C.caja * 0.55, yc + H * 0.10, zf - l * 0.05, EJE_X, 18);
    letrero(texUG, 0.50, 0.17, xC0 + C.caja * 0.80, yc + H * 0.22, zf + l * 0.012, l > 0 ? 0 : Math.PI);
    letrero(texHK, 0.62, 0.12, xC0 + C.caja * 0.30, yc - H * 0.26, zf + l * 0.012, l > 0 ? 0 : Math.PI);
    [[0.10, 0.36], [0.10, -0.36], [0.40, -0.36], [0.62, -0.36], [0.90, 0.36], [0.90, -0.36], [0.30, 0.36], [0.70, 0.36]].forEach(function(q){
      dd.position.set(xC0 + C.caja * q[0], yc + H * q[1], zf + l * 0.02); dd.rotation.set(Math.PI / 2, 0, 0); dd.updateMatrix(); iPn.setMatrixAt(kp++, dd.matrix);
    });
    /* pasadores de retencion del cincel, cerca de la punta */
    [-0.18, 0.18].forEach(function(dy){ cilindro('PYB', 0.045, 0.045, 0.04, 'metal', '#8A8F96', xC0 + 0.30, yc + dy, zf + l * 0.02, EJE_Z, 14); });
  });
  D.reg(null, iPn, '#2B2D31');
  /* cantoneras negras a lo largo de las aristas de la carcasa */
  [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function(q){
    bloque(null, C.caja - 0.36, 0.06, 0.06, 'mate', PAL_UG_NEGRO, (xC0 + xC1) / 2, yc + q[0] * (H / 2 - 0.01), q[1] * (W / 2 - 0.01), 0.015);
  });
  /* pernos de la cabeza delantera en anillo */
  var iPf = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03, 0.03, 0.05, 6), D.M.metal('#6E737A'), 8);
  for(var bf = 0; bf < 8; bf++){
    var af = bf / 8 * Math.PI * 2;
    dd.position.set(xC0 - 0.01, yc + Math.cos(af) * C.punta * 1.95, Math.sin(af) * C.punta * 1.95); dd.rotation.set(0, 0, Math.PI / 2); dd.updateMatrix(); iPf.setMatrixAt(bf, dd.matrix);
  }
  D.reg('PYB', iPf, '#6E737A');
  /* placa de serie y las lineas que se ven por la ventana */
  bloque(null, 0.16, 0.09, 0.01, 'metal', '#C9CED3', xC0 + C.caja * 0.15, yc + H * 0.22, W / 2 + 0.035, 0.003);
  [-1, 1].forEach(function(l){
    tubo('LPH', [xC0 + C.caja * 0.43, yc + H * 0.20, l * (W / 2 - 0.04)], [xC0 + C.caja * 0.68, yc + H * 0.20, l * (W / 2 - 0.04)], 0.018, 'metal', '#8A8F96', 8);
  });
  /* cabeza delantera con buje y el cincel de punta (pieza de desgaste) */
  cilindro(null, C.punta * 1.25, C.punta * 1.4, 0.12, 'metal', PAL_UG_NEGRO, xC0 - 0.06, yc, 0, EJE_X, 24);
  cilindro('PYB', C.punta * 0.72, C.punta * 0.72, 0.04, 'metal', '#6E737A', xC0 - 0.13, yc, 0, EJE_X, 20);
  var lC = C.cincel - 0.18;
  cilindro('GET', C.punta / 2, C.punta / 2, lC, 'metal', '#3F4348', xP + 0.18 + lC / 2, yc, 0, EJE_X, 22);
  var punta = cilindro('GET', 0.012, C.punta / 2, 0.20, 'metal', '#9DA3AA', xP + 0.10, yc, 0, [0, 0, Math.PI / 2], 22);
  punta.rotation.set(0, 0, Math.PI / 2);
  /* ranuras de los pasadores en el cincel */
  [-1, 1].forEach(function(l){ bloque(null, 0.16, 0.03, 0.02, 'mate', '#1A1C1F', xP + C.cincel - 0.05, yc, l * (C.punta / 2 - 0.004), 0.005); });

  /* ═══ soporte superior negro con los dos ojos para la excavadora ═══ */
  [-1, 1].forEach(function(l){
    perfil(null, [[xC1, yc - H / 2 - 0.03], [xC1 + C.soporte * 0.75, yc - H / 2 + 0.02], [xS1, yc - H * 0.15], [xS1, yc + H * 0.42], [xC1 + C.soporte * 0.55, yc + H / 2 + 0.10], [xC1, yc + H / 2 + 0.03]],
      0.06, l * (W / 2 - 0.02), 'mate', PAL_UG_NEGRO, 0.015);
  });
  bloque(null, 0.05, H + 0.06, W, 'mate', PAL_UG_NEGRO, xC1 + 0.02, yc, 0, 0.015);
  bloque(null, C.soporte * 0.7, 0.05, W - 0.08, 'mate', PAL_UG_NEGRO, xC1 + C.soporte * 0.35, yc + H / 2 + 0.06, 0, 0.015);
  [[xS1 - 0.11, yc - H * 0.05], [xC1 + C.soporte * 0.42, yc + H * 0.30]].forEach(function(p){
    [-1, 1].forEach(function(l){ cilindro(null, 0.10, 0.10, 0.05, 'pintura', '#2A2C30', p[0], p[1], l * (W / 2 + 0.02), EJE_Z, 22); });
    cilindro('PYB', 0.055, 0.055, W + 0.16, 'metal', '#B9BEC4', p[0], p[1], 0, EJE_Z, 16);
  });
  /* acumulador y tapa de nitrogeno en el canto de arriba */
  pon(null, new THREE.SphereGeometry(0.14, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), 'metal', '#2F3236', xC1 - 0.55, yc + H / 2 + 0.04, 0);
  cilindro(null, 0.04, 0.04, 0.08, 'metal', '#9DA3AA', xC1 - 0.55, yc + H / 2 + 0.20, 0, null, 10);
  /* argolla de izaje */
  pon(null, new THREE.TorusGeometry(0.07, 0.02, 8, 16), 'metal', '#5A5F66', xC0 + C.caja * 0.45, yc + H / 2 + 0.09, 0, [0, Math.PI / 2, 0]);
  /* puertos de entrada y retorno con sus dos mangueras sueltas */
  [-0.12, 0.12].forEach(function(dz, i){
    var p0 = [xC1 - 0.22, yc + H / 2 + 0.05, dz];
    cilindro('LPH', 0.05, 0.05, 0.10, 'metal', '#B9BEC4', p0[0], p0[1] + 0.04, dz, null, 12);
    pon('LPH', new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(p0[0], p0[1] + 0.08, dz), new THREE.Vector3(p0[0] - 0.05, p0[1] + 0.55 + i * 0.08, dz * 1.6),
      new THREE.Vector3(p0[0] + 0.55, p0[1] + 0.80 + i * 0.06, dz * 2.2), new THREE.Vector3(xS1 + 0.35, p0[1] + 0.25, dz * 2.6),
      new THREE.Vector3(xS1 + 0.55, 0.20, dz * 3.0)]), 48, 0.035, 8, false), 'goma', '#141618');
    cilindro(null, 0.045, 0.045, 0.14, 'metal', '#C9A43A', xS1 + 0.57, 0.17, dz * 3.0, null, 12);
  });

  G.userData.ruedas = [];
  G.userData.mirarY = 0.55;
  G.userData.dist = 6.2;
  G.userData.modelo = 'PAL' + id;
  return G;
}

registrarModelo3d({
  nombre: 'CAT 6040 FS y 6050 FS',
  clave: function(e){
    var m = mod3d(e);
    return /^6040/.test(m) ? 'PAL6040' : /^6050/.test(m) ? 'PAL6050' : null;
  },
  construir: function(e, piezas, clave){ return palConstruirPala(clave.replace(/^PAL/, ''), piezas); }
});
registrarModelo3d({
  nombre: 'Hydrokhan UG-3300 y UG-5000',
  clave: function(e){
    var m = mod3d(e);
    return /^UG3300/.test(m) ? 'PALUG3300' : /^UG5000/.test(m) ? 'PALUG5000' : null;
  },
  construir: function(e, piezas, clave){ return palConstruirMartillo(clave.replace(/^PAL/, ''), piezas); }
});
