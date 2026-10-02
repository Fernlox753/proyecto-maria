/* ══════════════════════════════════════════════════════════════════
   CAT RIGIDOS — 775F, 777F, 785C, 785D, 793C y 793D (modelo de detalle)
   FC-80 (775F) · FC-71/72/73 (777F) · FC-87… (785C) · FC-104/106/116/126
   (785D) · FC-115 (793C) · FC-113 (793D)

   Medidas de las hojas de dimensiones de Caterpillar (m):
              largo  batalla  cola   ROPS   alero  ancho alero  tolva  carga
     775F   10.338   4.20    2.82   4.12   4.42    4.98      4.27   3.94
     777F   10.535   4.56    3.062  4.715  5.17    6.05      5.524  4.38
     785C   11.02    5.18    3.41   5.122  5.77    6.20      5.894  4.968
     785D   11.548   5.18    3.41   5.122  5.679   6.747     5.894  4.968
     793C   12.87    5.90    3.772  5.584  6.43    7.41      6.94   5.871
     793D   12.862   5.905   3.772  5.584  6.494   7.68      6.94   5.871
   trocha delantera / centro de duales / ancho sobre llantas:
     775F 3.21/2.75/4.42 · 777F 4.05/3.576/5.223 · 785 4.85/4.285/6.277 ·
     793 5.61/4.963/7.605 · llantas 24.00R35, 27.00R49, 33.00R51, 40.00R57
   Lo que no esta acotado (alto de la plataforma, cabina, frente de la
   tolva, tanques, cilindros de levante, parachoques) se midio sobre los
   dibujos de esas mismas hojas (785D, 777F, 793D) y las fotos; el 775F
   sigue al 777F y el 793C al 793D (sin dibujo propio). Del 793C solo se
   hallaron largo, ancho, alto y batalla; lo demas es del 793D.

   Lo que distingue a cada uno (dibujos y fotos):
   · 785D y 793D: cabina negra con parabrisas inclinado, escalera diagonal
     que cruza la parrilla del parachoques derecho a la plataforma izquierda.
   · 793C: cabina amarilla cuadrada, tambien con escalera diagonal (asi se
     ve en las fotos del 793B/793C; no lleva escaleras verticales).
   · 785C: cabina amarilla cuadrada y dos escaleras verticales a los lados
     de la parrilla.
   · 777F y 775F: cabina negra con el CAT grande al costado, escalera que
     sube por la esquina delantera izquierda hacia atras y escalera vertical
     a la derecha; faros en las puntas del parachoques.
   · 793: faros redondos dobles y el modelo en la cara de los guardafangos;
     785D: el CAT en esa cara y faros rectangulares en la parrilla.

   Ejes: frente hacia -X, arriba +Y, la izquierda del operador +Z; cabina a
   la izquierda. Llantas: 1 del. izq., 2 del. der., 3-4 traseras izquierdas
   (exterior, interior), 5-6 traseras derechas (interior, exterior).
   ══════════════════════════════════════════════════════════════════ */
var RIG_AM = '#E9A80C', RIG_AM2 = '#B98309', RIG_AM3 = '#D39608', RIG_NEGRO = '#191B1E', RIG_GRIS = '#3C434B',
    RIG_GRIS2 = '#59626C', RIG_BAR = '#1D2023', RIG_PEL = '#41464D';

/* u = metros detras del eje delantero (negativo = adelante). Ver la tabla
   de arriba; lo medido sobre dibujos lleva su nota. */
var RIG_MEDIDAS = {
  '785D': { L: 11.548, WB: 5.18, COLA: 3.41, R: 1.485, A: 0.84, aro: 51, TRF: 4.85, DUAL: 4.285, TW: 6.277,
            ROPS: 5.122, CANH: 5.679, CANW: 6.747, CANT: 0.30, CANu: -2.45, CANf: -0.18,
            BW: 5.894, YCARGA: 4.968, BTu: 1.14, FW: [0.45, 5.40], BL: [1.75, 3.05], BRK: [5.84, 3.65], YTL: 4.31,
            YDK: 3.45, ZDK: 3.12, DK0: -2.80, DK1: 0.80, PAR: -2.90, YPAR: 1.83, YPARb: 1.36, YGUARD: 1.057,
            BPW: 2.15, GW: 1.33, GRu: -2.22,
            cab: { u0: -2.05, inc: 0.50, u1: -0.10, z0: 1.38, z1: 3.00, color: 'negro' },
            acceso: 'diagonal', subida: [-1.09, 1.15], escCortas: true, faros: 'cat', costado: 'diag',
            tanque: [1.83, 3.05, 1.06, 2.55], levante: [3.13, 1.06, 3.74, 2.87], filtro: 'horizontal', franja: true },
  '777F': { L: 10.535, WB: 4.56, COLA: 3.062, R: 1.345, A: 0.69, aro: 49, TRF: 4.05, DUAL: 3.576, TW: 5.223,
            ROPS: 4.715, CANH: 5.17, CANW: 6.05, CANT: 0.30, CANu: -1.97, CANf: 0.28,
            BW: 5.524, YCARGA: 4.38, BTu: 1.08, FW: [0.92, 4.86], BL: [1.69, 2.62], BRK: [5.2, 3.05], YTL: 3.50,
            YDK: 2.98, ZDK: 2.60, DK0: -2.42, DK1: 1.27, PAR: -2.74, YPAR: 1.60, YPARb: 1.30, YGUARD: 0.864,
            BPW: 2.28, GW: 1.05, GRu: -2.52, SUBu: -1.95,
            cab: { u0: -1.36, inc: 0.22, u1: 0.56, z0: 0.85, z1: 2.45, color: 'negro' },
            acceso: 'lateral', faros: 'paragolpe', costado: 'diag', catCab: true,
            tanque: [1.60, 3.00, 1.15, 2.04], levante: [3.14, 1.05, 3.72, 2.46], filtro: 'vertical', franja: true },
  '775F': { L: 10.338, WB: 4.20, COLA: 2.82, R: 1.13, A: 0.62, aro: 35, TRF: 3.21, DUAL: 2.75, TW: 4.42,
            ROPS: 4.12, CANH: 4.42, CANW: 4.98, CANT: 0.20, CANu: -1.85, CANf: 0.10,
            BW: 4.27, YCARGA: 3.94, BTu: 0.95, FW: [0.78, 4.18], BL: [1.40, 2.30], BRK: [4.6, 2.65], YTL: 3.15,
            YDK: 2.45, ZDK: 2.15, DK0: -2.95, DK1: 1.10, PAR: -3.24, YPAR: 1.40, YPARb: 1.12, YGUARD: 0.75,
            BPW: 1.85, GW: 0.88, GRu: -3.04, SUBu: -2.30,
            cab: { u0: -1.55, inc: 0.20, u1: 0.30, z0: 0.70, z1: 2.05, color: 'negro' },
            acceso: 'lateral', faros: 'paragolpe', costado: 'diag', catCab: true,
            tanque: [1.40, 2.70, 0.95, 1.75], levante: [2.85, 0.90, 3.35, 2.15], filtro: 'vertical', franja: true },
  '793D': { L: 12.862, WB: 5.905, COLA: 3.772, R: 1.79, A: 1.02, aro: 57, TRF: 5.61, DUAL: 4.963, TW: 7.605,
            ROPS: 5.584, CANH: 6.494, CANW: 7.68, CANT: 0.38, CANu: -3.07, CANf: -0.15,
            BW: 6.94, YCARGA: 5.871, BTu: 2.0, FW: [0.70, 6.30], BL: [1.85, 3.45], BRK: [6.4, 4.10], YTL: 4.80,
            YDK: 3.90, ZDK: 3.62, DK0: -3.08, DK1: 1.40, PAR: -3.16, YPAR: 1.85, YPARb: 1.38, YGUARD: 1.294,
            BPW: 2.10, GW: 1.60, GRu: -2.48,
            cab: { u0: -1.05, inc: 0.45, u1: 0.95, z0: 1.55, z1: 3.30, color: 'negro' },
            acceso: 'diagonal', subida: [-1.41, 0.90], faros: 'redondos', costado: 'panel',
            tanque: [2.20, 3.50, 1.25, 2.85], levante: [3.74, 1.30, 3.98, 3.55], filtro: 'horizontal', franja: false }
};
function rigCopia(base, cambios){
  var o = {}, c;
  for(c in base) o[c] = base[c];
  for(c in cambios) o[c] = cambios[c];
  return o;
}
/* 785C: mismo bastidor y tolva que el 785D; frente mas corto, alero mas
   alto y angosto, cabina amarilla cuadrada y escaleras verticales */
RIG_MEDIDAS['785C'] = rigCopia(RIG_MEDIDAS['785D'], { L: 11.02, CANH: 5.77, CANW: 6.20, CANu: -2.05, CANf: 0.0,
  FW: [0.50, 5.47], ZDK: 3.02, DK0: -2.30, PAR: -2.40, GRu: -2.24,
  cab: { u0: -1.65, inc: 0, u1: 0.30, z0: 0.95, z1: 2.92, color: 'amarillo' },
  acceso: 'vertical', escCortas: false, faros: 'rect', filtro: 'doble', franja: false });
/* 793C: el 793D con la cabina amarilla cuadrada y el alero de la hoja del C */
RIG_MEDIDAS['793C'] = rigCopia(RIG_MEDIDAS['793D'], { L: 12.87, CANH: 6.43, CANW: 7.41,
  cab: { u0: -1.05, inc: 0, u1: 0.95, z0: 1.55, z1: 3.30, color: 'amarillo' } });

/* placa del modelo: negra con letras blancas y, en la serie F y el 785D,
   la franja roja y naranja en diagonal */
function rigRotuloModelo(txt, franja){
  return function(g, w, h){
    g.fillStyle = '#141518'; g.fillRect(0, 0, w, h);
    if(franja){
      g.fillStyle = '#D8261C';
      g.beginPath(); g.moveTo(w * 0.80, h); g.lineTo(w * 0.92, 0); g.lineTo(w, 0); g.lineTo(w, h * 0.15); g.lineTo(w * 0.90, h); g.closePath(); g.fill();
      g.fillStyle = '#F29A1D';
      g.beginPath(); g.moveTo(w * 0.91, h); g.lineTo(w, h * 0.25); g.lineTo(w, h); g.closePath(); g.fill();
    }
    g.fillStyle = '#FFFFFF'; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.font = 'italic bold ' + Math.round(h * 0.70) + 'px "Arial Black", Arial, sans-serif';
    g.fillText(txt, w * 0.06, h * 0.54, w * (franja ? 0.72 : 0.88));
  };
}
/* CATERPILLAR del alero con el triangulo amarillo bajo la primera A */
function rigRotuloCater(g, w, h){
  g.fillStyle = '#141518'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#FFFFFF'; g.textBaseline = 'middle'; g.textAlign = 'left';
  g.font = 'bold ' + Math.round(h * 0.70) + 'px "Arial Narrow", Arial, sans-serif';
  var t = 'CATERPILLAR', an = g.measureText(t).width, esc = Math.min(1, w * 0.86 / an), x0 = (w - an * esc) / 2;
  g.save(); g.translate(x0, h * 0.52); g.scale(esc, 1); g.fillText(t, 0, 0); g.restore();
  var xa = x0 + (g.measureText('C').width + g.measureText('A').width * 0.5) * esc;
  g.fillStyle = '#F2B400';
  g.beginPath(); g.moveTo(xa - h * 0.11, h * 0.80); g.lineTo(xa + h * 0.11, h * 0.80); g.lineTo(xa, h * 0.52); g.closePath(); g.fill();
}
/* costado de la cabina negra de la serie F: CAT grande y franjas al fondo */
function rigRotuloCabina(g, w, h){
  g.fillStyle = '#17191C'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold ' + Math.round(h * 0.62) + 'px "Arial Black", Arial, sans-serif';
  g.fillText('CAT', w * 0.42, h * 0.52);
  var xa = w * 0.42;
  g.fillStyle = '#F2B400';
  g.beginPath(); g.moveTo(xa - h * 0.10, h * 0.78); g.lineTo(xa + h * 0.10, h * 0.78); g.lineTo(xa, h * 0.56); g.closePath(); g.fill();
  g.fillStyle = '#D8261C';
  g.beginPath(); g.moveTo(w * 0.80, h); g.lineTo(w * 0.97, h * 0.30); g.lineTo(w, h * 0.30); g.lineTo(w, h * 0.42); g.lineTo(w * 0.86, h); g.closePath(); g.fill();
  g.fillStyle = '#F29A1D';
  g.beginPath(); g.moveTo(w * 0.88, h); g.lineTo(w, h * 0.50); g.lineTo(w, h); g.closePath(); g.fill();
}

function rigConstruir(clave, piezas){
  var P = RIG_MEDIDAS[clave];
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var bloque = D.bloque, perfil = D.perfil, perfilX = D.perfilX, tubo = D.tubo, cilindro = D.cilindro,
      pon = D.pon, letrero = D.letrero, esTolva = D.esTolva;
  var k = P.R / 1.485;
  var TAIL = P.WB + P.COLA;
  var XD = P.L / 2 - TAIL, XT = XD + P.WB;
  var U = function(u){ return XD + u; };
  var R = P.R, A = P.A, YDK = P.YDK, ZDK = P.ZDK, GW = P.GW;
  var negroCab = P.cab.color === 'negro';
  var AM = function(code, w, h, d, x, y, z, r, rot){ return bloque(code, w, h, d, 'pintura', RIG_AM, x, y, z, r, rot); };
  /* caja entre dos puntos del plano XY (vigas, nervios inclinados) */
  var vigaXY = function(code, a, b, z, h, d, tipo, hex, r){
    var dx = b[0] - a[0], dy = b[1] - a[1];
    return bloque(code, Math.hypot(dx, dy), h, d, tipo, hex, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z, r, [0, 0, Math.atan2(dy, dx)]);
  };
  /* caja entre dos puntos cualesquiera, de canto vertical (largueros de escalera) */
  var ARRIBA = new THREE.Vector3(0, 1, 0);
  var cajaEntre = function(code, p, q, alto, grueso, tipo, hex){
    var vp = new THREE.Vector3(p[0], p[1], p[2]), vq = new THREE.Vector3(q[0], q[1], q[2]);
    var d = vq.clone().sub(vp), L = d.length(); d.normalize();
    var t = new THREE.Vector3().crossVectors(d, ARRIBA);
    if(t.lengthSq() < 1e-6) t.set(0, 0, 1);
    t.normalize();
    var n = new THREE.Vector3().crossVectors(t, d).normalize();
    var m = pon(code, geoCajaB(L, alto, grueso, Math.min(0.015, grueso * 0.3)), tipo, hex, (p[0] + q[0]) / 2, (p[1] + q[1]) / 2, (p[2] + q[2]) / 2);
    m.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(d, n, t));
    return m;
  };
  var luz = function(hex, inten, r, x, y, z){
    var m = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 10),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), emissive: new THREE.Color(hex), emissiveIntensity: inten, roughness: 0.3 }));
    m.position.set(x, y, z); G.add(m);
    return m;
  };
  /* faro rectangular mirando a -X: caja negra y mica */
  var faroRect = function(code, x, y, z, w, h){
    bloque(null, 0.10, h + 0.06, w + 0.06, 'mate', '#202327', x + 0.04, y, z, 0.02);
    bloque(code, 0.03, h, w, 'vidrio', '#F4EDCF', x - 0.02, y, z, 0.01);
  };

  var texCAT = texRotulo3d(rotuloCAT, 256, 128);
  var texMod = texRotulo3d(rigRotuloModelo(clave, P.franja), 512, 128);
  var texNum = texNumero3d(null, '#17191C');      /* sobre la pintura amarilla */
  var texNumB = texNumero3d(null, '#F2F2EE');     /* sobre la parrilla negra */

  /* ═══ bastidor: largueros de caja que suben detras de los tanques para
     pasar sobre el puente trasero, travesanos y torres del pivote ═══ */
  var zR = 0.74 * k, yRf = 1.45 * k, yRt = R + 0.86 * k, hR = 0.62 * k, aR = 0.36 * k;
  var uF0 = P.PAR + 0.40 * k, uF1 = P.WB * 0.45, uF15 = P.WB - 0.95 * k;
  var uPiv = P.WB + 0.62 * P.COLA, yPiv = yRt + 0.42 * k, uF2 = uPiv + 0.30 * k;
  [-1, 1].forEach(function(s){
    bloque('42023615', uF1 - uF0, hR, aR, 'pintura', RIG_AM2, U((uF0 + uF1) / 2), yRf, s * zR, 0.04);
    vigaXY('42023615', [U(uF1 - 0.15), yRf], [U(uF15 + 0.15), yRt], s * zR, hR, aR, 'pintura', RIG_AM2, 0.04);
    bloque('42023615', uF2 - uF15, hR, aR, 'pintura', RIG_AM2, U((uF2 + uF15) / 2), yRt, s * zR, 0.04);
    /* torre del pivote de la tolva y su perno */
    perfil('42023615', [[U(uPiv - 0.55 * k), yRt + hR / 2 - 0.02], [U(uPiv + 0.30 * k), yRt + hR / 2 - 0.02],
      [U(uPiv + 0.18 * k), yPiv + 0.12 * k], [U(uPiv - 0.15 * k), yPiv + 0.12 * k]], aR * 0.8, s * zR, 'pintura', RIG_AM2, 0.02);
    cilindro('PYB', 0.11 * k, 0.11 * k, 0.62 * k, 'metal', '#4A4F55', U(uPiv), yPiv, s * (zR + 0.14 * k), [Math.PI / 2, 0, 0], 16);
  });
  [[uF0 + 0.35, yRf], [P.WB * 0.30, yRf], [uF15 + 0.4 * k, yRt], [uF2 - 0.12 * k, yRt]].forEach(function(q){
    bloque('42023615', 0.30 * k, 0.48 * k, 2 * zR - aR + 0.04, 'pintura', RIG_AM2, U(q[0]), q[1], 0, 0.03);
  });

  /* ═══ parachoques, defensa del motor, ganchos y luces ═══ */
  var uPar1 = P.PAR + 0.62 * k, yPm = (P.YPAR + P.YPARb) / 2;
  bloque('42023615', uPar1 - P.PAR, P.YPAR - P.YPARb, 2 * P.BPW, 'pintura', RIG_AM, U((P.PAR + uPar1) / 2), yPm, 0, 0.06);
  bloque(null, uPar1 - P.PAR - 0.10, 0.025, 2 * P.BPW - 0.12, 'mate', '#4A4E54', U((P.PAR + uPar1) / 2), P.YPAR + 0.012, 0, 0.008);
  /* defensa inferior inclinada y placa bajo el motor */
  vigaXY('42023615', [U(P.PAR + 0.20), P.YPARb + 0.02], [U(uPar1 + 0.45 * k), P.YGUARD + 0.08], 0, 0.12, 2 * GW - 0.1, 'pintura', RIG_AM2, 0.03);
  bloque('42023615', 1.30 * k, 0.12, 2 * GW - 0.1, 'pintura', RIG_AM2, U(uPar1 + 0.45 * k + 0.65 * k), P.YGUARD + 0.08, 0, 0.03);
  [-1, 1].forEach(function(s){
    /* ganchos de remolque */
    cilindro(null, 0.07 * k, 0.07 * k, 0.40 * k, 'metal', '#4E535A', U(P.PAR) - 0.05, yPm - 0.06, s * (GW - 0.25), null, 14);
    bloque(null, 0.22, 0.26 * k, 0.12, 'pintura', RIG_AM2, U(P.PAR) - 0.06, yPm - 0.06, s * (GW - 0.25 - 0.13), 0.03);
    bloque(null, 0.22, 0.26 * k, 0.12, 'pintura', RIG_AM2, U(P.PAR) - 0.06, yPm - 0.06, s * (GW - 0.25 + 0.13), 0.03);
    /* luces del parachoques: neblineros o, en la serie F, los faros */
    var zf = s * (P.BPW - 0.38);
    if(P.faros === 'paragolpe'){
      bloque(null, 0.06, 0.30 * k + 0.06, 0.78, 'mate', '#202327', U(P.PAR) - 0.01, yPm, zf, 0.02);
      [-0.19, 0.19].forEach(function(dz){ faroRect(s > 0 ? 'FDI' : 'FDD', U(P.PAR) - 0.04, yPm, zf + dz, 0.28, 0.20 * k); });
    } else {
      [-0.16, 0.16].forEach(function(dz){ faroRect('FNB', U(P.PAR) - 0.02, yPm, zf + dz, 0.22, 0.13); });
    }
  });
  /* extintores en las puntas del parachoques */
  (P.acceso === 'lateral' ? [1] : [-1, 1]).forEach(function(s){
    cilindro(null, 0.09, 0.09, 0.50, 'pintura', '#B3221A', U(P.PAR + 0.25), P.YPAR + 0.26, s * (P.BPW - 0.13), null, 14);
    cilindro(null, 0.04, 0.04, 0.08, 'metal', '#2A2D31', U(P.PAR + 0.25), P.YPAR + 0.55, s * (P.BPW - 0.13), null, 10);
  });

  /* ═══ parrilla del radiador: marco negro, lamas, postes amarillos y el
     capot del radiador detras; el numero de unidad pintado en blanco ═══ */
  var GRu = P.GRu, YG0 = P.YPAR + 0.06, YG1 = YDK + 0.28 * k, xG = U(GRu);
  bloque('RAD1', 0.16, YG1 - YG0, 2 * GW, 'mate', RIG_NEGRO, xG + 0.08, (YG0 + YG1) / 2, 0, 0.03);
  var nL = Math.round((YG1 - YG0) / 0.17), pasoL = (YG1 - YG0) / nL;
  for(var il = 0; il < nL; il++){
    bloque(null, 0.06, pasoL * 0.45, 2 * GW - 0.14, 'mate', '#0B0C0E', xG - 0.02, YG0 + (il + 0.5) * pasoL, 0, 0.012);
  }
  bloque(null, 0.06, YG1 - YG0 - 0.1, 0.07, 'mate', '#0B0C0E', xG - 0.03, (YG0 + YG1) / 2, 0, 0.01);
  [-1, 1].forEach(function(s){ AM(null, 0.26, YG1 - YG0 + 0.10, 0.16, xG + 0.10, (YG0 + YG1) / 2, s * (GW + 0.08), 0.03); });
  AM(null, 0.26, 0.14, 2 * GW + 0.32, xG + 0.10, YG1 + 0.07, 0, 0.03);
  AM(null, 0.26, 0.12, 2 * GW + 0.32, xG + 0.10, YG0 - 0.04, 0, 0.03);
  if(P.acceso === 'lateral' || clave === '793C'){
    /* la serie F (y el 793C) llevan el CATERPILLAR chico sobre la parrilla */
    letrero(texRotulo3d(rigRotuloCater, 512, 64), GW * 1.1, GW * 0.14, xG - 0.035, YG1 - 0.10, 0, -Math.PI / 2);
  }
  if(P.faros === 'cat'){
    /* 785D: faros rectangulares en las esquinas de la parrilla */
    [-1, 1].forEach(function(s){
      [-0.13, 0.13].forEach(function(dz){ faroRect(s > 0 ? 'FDI' : 'FDD', xG - 0.03, YDK - 0.10, s * (GW - 0.32) + dz, 0.22, 0.14); });
    });
  }
  var mNumG = new THREE.Mesh(new THREE.PlaneGeometry(1.25 * k, 0.40 * k), new THREE.MeshStandardMaterial({ map: texNumB, transparent: true, roughness: 0.5 }));
  mNumG.position.set(xG - 0.07, YG0 + (YG1 - YG0) * (P.acceso === 'lateral' ? 0.22 : 0.20), P.acceso === 'lateral' ? 0 : GW * 0.45);
  mNumG.rotation.y = -Math.PI / 2; G.add(mNumG);
  /* radiador, ventilador y su mando detras de la parrilla */
  bloque('RAD1', 0.42, YG1 - YG0 - 0.25, 2 * GW - 0.25, 'metal', RIG_GRIS, xG + 0.48, (YG0 + YG1) / 2, 0, 0.03);
  pon('FAN1', new THREE.TorusGeometry(0.72 * k, 0.08 * k, 10, 36), 'metal', RIG_GRIS2, xG + 0.85, (YG0 + YG1) / 2, 0, [0, Math.PI / 2, 0]);
  cilindro('MFC1', 0.22 * k, 0.22 * k, 0.40, 'metal', RIG_GRIS, xG + 1.05, (YG0 + YG1) / 2, 0, [0, 0, Math.PI / 2], 16);
  /* capot del radiador: de la parrilla hacia atras, un poco mas alto que la plataforma */
  var uCap1 = GRu + 1.05 * k;
  AM(null, uCap1 - GRu - 0.20, YG1 - YDK + 0.10, 2 * GW + 0.2, U((GRu + 0.20 + uCap1) / 2), (YDK + YG1) / 2 - 0.05, 0, 0.06);
  bloque(null, (uCap1 - GRu) * 0.5, 0.04, 2 * GW - 0.4, 'mate', RIG_GRIS, U((GRu + 0.20 + uCap1) / 2), YG1 + 0.02, 0, 0.015);

  /* ═══ guardafangos delanteros: caja con faros en la cara, faldon sobre
     la llanta; en la serie F la izquierda la ocupa la escalera ═══ */
  var FH = 0.95 * k, uM1 = P.DK0 + 0.95 * k, xM = U(P.DK0);
  [-1, 1].forEach(function(s){
    var conCaja = !(P.acceso === 'lateral' && s > 0);
    var z0 = GW + 0.17, z1 = ZDK, zc = s * (z0 + z1) / 2, an = z1 - z0;
    if(conCaja){
      AM(null, uM1 - P.DK0, FH, an, U((P.DK0 + uM1) / 2), YDK - 0.12 - FH / 2, zc, 0.06);
      if(P.faros === 'cat' || P.faros === 'rect'){
        letrero(texCAT, 0.78 * k, 0.39 * k, xM - 0.005, YDK - 0.12 - FH * 0.30, zc + s * 0.10, -Math.PI / 2);
        cilindro('LSM', 0.06, 0.06, 0.05, 'vidrio', '#F29A1D', xM - 0.02, YDK - 0.12 - FH * 0.78, s * (z1 - 0.20), [0, 0, Math.PI / 2], 14);
        if(P.faros === 'rect'){
          [-0.24, 0.24].forEach(function(dz){ faroRect(s > 0 ? 'FDI' : 'FDD', xM - 0.01, YDK - 0.12 - FH * 0.72, zc - s * 0.10 + dz, 0.30, 0.18); });
        }
      } else if(P.faros === 'redondos'){
        [0.36, 0.92].forEach(function(dz){ D.faro(s > 0 ? 'FDI' : 'FDD', xM - 0.14, YDK - 0.12 - FH * 0.42, s * (z0 + dz * k * 0.8), 0.19 * k); });
        letrero(texMod, 0.62 * k, 0.17 * k, xM - 0.005, YDK - 0.12 - FH * 0.42, s * (z1 - 0.40 * k), -Math.PI / 2);
        [0.40, 0.95].forEach(function(dz){
          bloque('LSM', 0.04, 0.10, 0.18, 'vidrio', '#F29A1D', xM - 0.02, YDK - 0.12 - FH * 0.80, s * (z0 + dz * k * 0.8), 0.01);
        });
      } else {
        /* serie F: dos pares de luces chicas en la cara */
        [0.30, 0.62].forEach(function(dz){
          faroRect('LSM', xM - 0.01, YDK - 0.12 - FH * 0.32, s * (z0 + dz * an), 0.16, 0.12);
        });
      }
      /* costado del guardafango: el modelo (785D) o el CAT (793) */
      if(P.faros === 'cat') letrero(texMod, 0.62, 0.155, U(P.DK0 + 0.50 * k), YDK - 0.12 - FH * 0.35, s * (z1 + 0.006), s > 0 ? 0 : Math.PI);
      if(P.faros === 'redondos') letrero(texCAT, 0.80, 0.40, U(P.DK0 + 0.50 * k), YDK - 0.12 - FH * 0.40, s * (z1 + 0.006), s > 0 ? 0 : Math.PI);
    }
    /* faldon sobre la llanta delantera */
    var uS0 = conCaja ? uM1 - 0.02 : -R - 0.20;
    AM(null, P.DK1 - uS0, 0.46 * k, 0.08, U((uS0 + P.DK1) / 2), YDK - 0.12 - 0.23 * k, s * (z1 - 0.04), 0.03);
  });

  /* ═══ plataforma: dos lados de punta a punta y el centro detras del capot ═══ */
  [-1, 1].forEach(function(s){
    var u0 = P.DK0;
    if(P.acceso === 'lateral' && s > 0) u0 = P.SUBu + 0.12;     /* escotadura de la escalera */
    AM(null, P.DK1 - u0, 0.12, ZDK - GW - 0.08, U((u0 + P.DK1) / 2), YDK - 0.06, s * (ZDK + GW + 0.08) / 2, 0.03);
    /* chapa antideslizante del pasillo */
    bloque(null, P.DK1 - u0 - 0.30, 0.02, 0.55, 'mate', '#5B5F64', U((u0 + P.DK1) / 2), YDK + 0.005, s * (ZDK - 0.40), 0.005);
  });
  AM(null, P.DK1 - uCap1 + 0.05, 0.12, 2 * GW + 0.18, U((uCap1 - 0.05 + P.DK1) / 2), YDK - 0.06, 0, 0.03);

  /* ═══ motor bajo la plataforma, entre las llantas delanteras ═══ */
  var uE0 = GRu + 1.0 * k, uE1 = uE0 + 2.5 * k, uEc = (uE0 + uE1) / 2, yE = YDK - 1.0 * k;
  bloque('ENG1', 2.5 * k, 1.10 * k, 1.20 * k, 'metal', RIG_GRIS, U(uEc), yE, 0, 0.06);
  [-0.40, 0.40].forEach(function(z){
    bloque('ENG1', 2.2 * k, 0.28 * k, 0.40 * k, 'metal', RIG_GRIS2, U(uEc), yE + 0.66 * k, z * k, 0.04);
    for(var c = 0; c < 6; c++) cilindro(null, 0.035, 0.035, 0.06, 'metal', '#2E3238', U(uE0 + 0.35 * k + c * 0.36 * k), yE + 0.83 * k, z * k, null, 8);
  });
  bloque('INY1', 2.0 * k, 0.08, 0.28 * k, 'metal', RIG_GRIS, U(uEc), yE + 0.80 * k, 0, 0.02);
  [-0.30, 0.30].forEach(function(z){ pon(null, new THREE.TorusGeometry(0.15 * k, 0.07 * k, 10, 20), 'metal', '#6B7178', U(uE1 - 0.15), yE + 0.55 * k, z * k, [0, Math.PI / 2, 0]); });
  bloque('CMP', 0.50 * k, 0.42 * k, 0.42 * k, 'metal', RIG_GRIS2, U(uE1 - 0.6 * k), yE - 0.35 * k, -0.85 * k, 0.04);
  cilindro('42001655', 0.17 * k, 0.17 * k, 0.32 * k, 'metal', RIG_GRIS2, U(uE0 + 0.35 * k), yE + 0.30 * k, -0.78 * k, [0, 0, Math.PI / 2], 16);
  cilindro('PCP2', 0.18 * k, 0.18 * k, 0.28 * k, 'metal', RIG_GRIS2, U(uE0 + 0.10), yE - 0.30 * k, 0, [0, 0, Math.PI / 2], 16);
  cilindro('ARN', 0.16 * k, 0.16 * k, 0.45 * k, 'metal', RIG_GRIS2, U(uE0 + 0.75 * k), yE - 0.42 * k, 0.82 * k, [0, 0, Math.PI / 2], 14);
  cilindro('AR1', 0.15 * k, 0.15 * k, 0.40 * k, 'metal', RIG_GRIS2, U(uE0 + 1.30 * k), yE - 0.42 * k, 0.85 * k, [0, 0, Math.PI / 2], 14);
  cilindro(null, 0.36 * k, 0.36 * k, 0.14, 'metal', '#2E3238', U(uE0 - 0.05), yE, 0, [0, 0, Math.PI / 2], 24);

  /* ═══ suspension delantera, masas, frenos y direccion ═══ */
  [-1, 1].forEach(function(s){
    var z = s * (P.TRF / 2 - A / 2 - 0.30 * k);
    cilindro(s > 0 ? 'SDI' : 'SDD', 0.27 * k, 0.27 * k, (YDK - 0.20 - R) * 0.55, 'pintura', RIG_AM, XD + 0.05, YDK - 0.20 - (YDK - 0.20 - R) * 0.275, z, null, 24);
    cilindro(null, 0.31 * k, 0.31 * k, 0.10, 'pintura', RIG_AM2, XD + 0.05, YDK - 0.22, z, null, 24);
    cilindro(null, 0.16 * k, 0.16 * k, (YDK - 0.20 - R) * 0.55, 'cromo', null, XD + 0.05, R + 0.15 + (YDK - 0.20 - R) * 0.24, z, null, 20);
    cilindro(s > 0 ? 'BMLH' : 'BMRH', 0.45 * k, 0.50 * k, 0.40 * k, 'metal', RIG_GRIS, XD, R, s * (P.TRF / 2 - A / 2 - 0.12 * k), [Math.PI / 2, 0, 0], 28);
    cilindro(s > 0 ? 'BDI' : null, 0.36 * k, 0.36 * k, 0.16 * k, 'metal', '#2E3238', XD, R, s * (P.TRF / 2 - A / 2 - 0.40 * k), [Math.PI / 2, 0, 0], 24);
  });
  D.cilHidD('SRH', [XD + 0.80 * k, R + 0.05, -0.60 * k], [XD + 0.30 * k, R + 0.05, -(P.TRF / 2 - A / 2 - 0.45 * k)], 0.10 * k, RIG_AM, 0.5);
  D.cilHidD(null, [XD + 0.80 * k, R + 0.05, 0.60 * k], [XD + 0.30 * k, R + 0.05, P.TRF / 2 - A / 2 - 0.45 * k], 0.10 * k, RIG_AM, 0.5);
  tubo(null, [XD + 0.45 * k, R - 0.20 * k, -(P.TRF / 2 - A / 2 - 0.45 * k)], [XD + 0.45 * k, R - 0.20 * k, P.TRF / 2 - A / 2 - 0.45 * k], 0.07 * k, 'metal', '#4A4F55', 14);
  cilindro('HAC2', 0.16 * k, 0.16 * k, 0.70 * k, 'metal', RIG_GRIS2, XD + 1.05 * k, yRf + 0.70 * k, -0.95 * k, null, 16);
  cilindro('SPM', 0.17 * k, 0.17 * k, 0.40 * k, 'metal', RIG_GRIS2, U(uE1 + 0.15), yRf - 0.20 * k, 0.55 * k, [0, 0, Math.PI / 2], 14);

  /* ═══ tren de fuerza: convertidor, transmision, cardan, puente trasero ═══ */
  var uTr0 = uE1 + 0.25 * k;
  cilindro('CON', 0.52 * k, 0.52 * k, 0.60 * k, 'metal', RIG_GRIS, U(uTr0 + 0.30 * k), yRf + 0.05, 0, [0, 0, Math.PI / 2], 30);
  bloque('TRM', 1.80 * k, 0.98 * k, 1.00 * k, 'metal', RIG_GRIS, U(uTr0 + 1.55 * k), yRf + 0.05, 0, 0.06);
  for(var tr = 0; tr < 4; tr++) bloque(null, 0.05, 1.02 * k, 1.04 * k, 'metal', RIG_GRIS2, U(uTr0 + 0.80 * k + tr * 0.5 * k), yRf + 0.05, 0, 0.01);
  cilindro('HPM', 0.20 * k, 0.20 * k, 0.45 * k, 'metal', RIG_GRIS2, U(uTr0 + 0.55 * k), yRf - 0.30 * k, -0.60 * k, [0, 0, Math.PI / 2], 14);
  bloque('VV1', 0.45 * k, 0.36 * k, 0.42 * k, 'metal', RIG_GRIS2, U(uTr0 + 1.9 * k), yRf + 0.62 * k, -0.45 * k, 0.03);
  var uTr1 = uTr0 + 2.45 * k;
  cilindro('FDP', 0.30 * k, 0.30 * k, 0.16, 'metal', RIG_GRIS, U(uTr1), yRf, 0, [0, 0, Math.PI / 2], 24);
  tubo(null, [U(uTr1 + 0.08), yRf, 0], [XT - 0.70 * k, R, 0], 0.10 * k, 'cromo', null, 16);
  /* puente: banjo, diferencial, tubos de eje, mandos finales y freno */
  pon('DIFP', new THREE.SphereGeometry(0.76 * k, 32, 20), 'pintura', RIG_AM2, XT, R, 0);
  cilindro('DIFP', 0.50 * k, 0.50 * k, 0.40 * k, 'pintura', RIG_AM2, XT - 0.55 * k, R, 0, [0, 0, Math.PI / 2], 28);
  var zIn = (P.DUAL / 2) - Math.max(A / 2 + 0.12, Math.min((P.TW / 2 - A / 2) - P.DUAL / 2, A / 2 + 0.18));
  var zOut = P.DUAL - zIn;
  var zEje = zIn - A / 2 - 0.06;
  [-1, 1].forEach(function(s){
    cilindro(null, 0.38 * k, 0.48 * k, zEje - 0.6 * k, 'pintura', RIG_AM2, XT, R, s * (0.6 * k + (zEje - 0.6 * k) / 2), [Math.PI / 2, 0, 0], 28);
    cilindro(s > 0 ? 'MLH' : 'MRH', 0.60 * k, 0.60 * k, 0.26 * k, 'metal', RIG_GRIS, XT, R, s * (zEje - 0.10 * k), [Math.PI / 2, 0, 0], 30);
  });
  cilindro('BPD', 0.50 * k, 0.50 * k, 0.12 * k, 'metal', RIG_GRIS2, XT, R, -(zEje - 0.32 * k), [Math.PI / 2, 0, 0], 28);
  /* brazo en A del puente al bastidor */
  [-1, 1].forEach(function(s){ tubo(null, [XT - 0.45 * k, R + 0.15 * k, s * 0.55 * k], [U(P.WB * 0.48), yRf - 0.10, 0], 0.12 * k, 'pintura', RIG_AM2, 16); });
  /* suspension trasera: del puente sube hacia atras al bastidor */
  D.cilHidD('SPI', [XT + 0.18 * k, R + 0.50 * k, 0.95 * k], [XT + 0.80 * k, yRt - 0.05, 0.92 * k], 0.20 * k, RIG_AM, 0.6);
  D.cilHidD('SPD', [XT + 0.18 * k, R + 0.50 * k, -0.95 * k], [XT + 0.80 * k, yRt - 0.05, -0.92 * k], 0.20 * k, RIG_AM, 0.6);
  /* mangueras a lo largo del bastidor */
  [-1, 1].forEach(function(s){
    tubo('LPH', [U(uF0 + 0.5), yRf + hR / 2 + 0.05, s * (zR + 0.22 * k)], [U(uF1), yRf + hR / 2 + 0.05, s * (zR + 0.22 * k)], 0.045, 'goma', '#22262B', 8);
    tubo('LPA', [U(uF0 + 0.5), yRf + hR / 2 - 0.08, s * (zR + 0.26 * k)], [U(uF1 - 0.3), yRf + hR / 2 - 0.08, s * (zR + 0.26 * k)], 0.032, 'goma', '#2E3238', 8);
  });
  bloque('SENS', 0.20, 0.16, 0.20, 'mate', RIG_GRIS2, U(uF1 - 0.4), yRf + hR / 2 + 0.08, -zR, 0.02);

  /* ═══ tanques entre las ruedas: combustible a la izquierda, hidraulico a la derecha ═══ */
  var T = P.tanque, tz = zR + aR / 2 + 0.04 + 0.42 * k;
  AM('TQC1', T[1] - T[0], T[3] - T[2], 0.84 * k, U((T[0] + T[1]) / 2), (T[2] + T[3]) / 2, tz, 0.10);
  AM('TQH1', (T[1] - T[0]) * 0.85, (T[3] - T[2]) * 0.92, 0.84 * k, U(T[0] + (T[1] - T[0]) * 0.425), T[2] + (T[3] - T[2]) * 0.46, -tz, 0.10);
  [-1, 1].forEach(function(s){
    /* zunchos negros */
    [0.25, 0.75].forEach(function(f){
      bloque(null, 0.07, (T[3] - T[2]) * (s > 0 ? 1 : 0.92) + 0.02, 0.86 * k + 0.02, 'mate', RIG_NEGRO,
        U(T[0] + (T[1] - T[0]) * (s > 0 ? f : f * 0.85)), T[2] + (T[3] - T[2]) * (s > 0 ? 0.5 : 0.46), s * tz, 0.015);
    });
  });
  cilindro(null, 0.11, 0.11, 0.12, 'mate', RIG_NEGRO, U(T[0] + 0.30), T[3] + 0.05, tz, null, 18);
  bloque(null, 0.06, (T[3] - T[2]) * 0.55, 0.03, 'vidrio', '#9BB7C9', U(T[1] - 0.25), (T[2] + T[3]) / 2, tz + 0.42 * k + 0.01, 0.01);
  cilindro(null, 0.08, 0.08, 0.03, 'vidrio', '#9BB7C9', U(T[0] + 0.40), (T[2] + T[3]) / 2, -tz - 0.42 * k - 0.01, [Math.PI / 2, 0, 0], 18);
  cilindro(null, 0.06, 0.06, 0.20, 'mate', RIG_NEGRO, U(T[0] + 0.25), T[2] + (T[3] - T[2]) * 0.92 + 0.08, -tz, null, 14);

  /* ═══ cilindros de levante de dos etapas, delante de las duales ═══ */
  var H = P.levante, zH = 1.25 * k;
  [-1, 1].forEach(function(s){
    var a = [U(H[0]), H[1], s * zH], b = [U(H[2]), H[3], s * zH];
    var p = function(f){ return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, s * zH]; };
    tubo('PHY', a, p(0.50), 0.21 * k, 'pintura', RIG_AM, 22);
    tubo(null, p(0.48), p(0.52), 0.24 * k, 'pintura', RIG_AM2, 22);
    tubo(null, p(0.50), p(0.80), 0.15 * k, 'cromo', null, 20);
    tubo(null, p(0.78), b, 0.10 * k, 'cromo', null, 18);
    pon(null, new THREE.SphereGeometry(0.17 * k, 14, 10), 'metal', '#3A3F45', a[0], a[1], a[2]);
    /* oreja del bastidor para el pie del cilindro */
    bloque(null, 0.40 * k, Math.max(0.2, yRf - H[1] + 0.1), 0.10, 'pintura', RIG_AM2, a[0], (a[1] + yRf) / 2, s * (zH - 0.18 * k), 0.02);
  });

  /* ═══ luces traseras y alarma de retroceso en el travesano de cola ═══ */
  var xCola = U(uF2) + 0.02;
  bloque(null, 0.12, 0.40 * k, 2 * zR + 0.2, 'mate', RIG_NEGRO, xCola + 0.04, yRt - 0.05, 0, 0.03);
  [-0.55, -0.22, 0.22, 0.55].forEach(function(z, i){
    bloque('LSM', 0.04, 0.22 * k, 0.24 * k, 'vidrio', i === 1 || i === 2 ? '#F2A31A' : '#C2241B', xCola + 0.11, yRt - 0.05, z * k, 0.01);
  });
  bloque(null, 0.16, 0.16, 0.22, 'mate', RIG_NEGRO, xCola + 0.05, yRt - 0.32 * k, 0, 0.02);

  /* ═══ cabina a la izquierda ═══ */
  var C = P.cab, CU0 = U(C.u0), CU1 = U(C.u1), CUT = U(C.u0 + C.inc), CZ0 = C.z0, CZ1 = C.z1, cz = (CZ0 + CZ1) / 2;
  var CY1 = P.ROPS, CYB = YDK + 0.45 * (CY1 - YDK), colCab = negroCab ? '#0C0D0F' : RIG_AM, colMarco = negroCab ? '#0C0D0F' : RIG_AM;
  var cabT = 'pintura';
  bloque('CBN', CU1 - CU0, CYB - YDK, CZ1 - CZ0, cabT, colCab, (CU0 + CU1) / 2, (YDK + CYB) / 2, cz, 0.06);
  /* burlete negro entre la caja y los vidrios */
  bloque(null, CU1 - CU0 + 0.02, 0.05, CZ1 - CZ0 + 0.02, 'mate', '#0E0F11', (CU0 + CU1) / 2, CYB + 0.02, cz, 0.02);
  /* techo */
  bloque('CBN', CU1 - CUT + 0.14, 0.14, CZ1 - CZ0 + 0.12, cabT, colCab, (CUT + CU1) / 2, CY1 - 0.07, cz, 0.05);
  /* postes del ROPS: delanteros inclinados, traseros rectos y el de la puerta */
  [CZ0 + 0.05, CZ1 - 0.05].forEach(function(z){
    tubo('CBN', [CU0 + 0.05, CYB, z], [CUT + 0.05, CY1 - 0.12, z], 0.055, 'pintura', colMarco, 12);
    tubo('CBN', [CU1 - 0.06, CYB, z], [CU1 - 0.06, CY1 - 0.12, z], 0.06, 'pintura', colMarco, 12);
  });
  var uPu = C.u0 + (C.u1 - C.u0) * 0.50, xPu = U(uPu), xPuT = xPu + C.inc * 0.15;
  tubo('CBN', [xPu, CYB, CZ1 + 0.005], [xPuT, CY1 - 0.12, CZ1 + 0.005], 0.04, 'pintura', colMarco, 10);
  /* vidrios: parabrisas inclinado, laterales en trapecio y trasero */
  var hV = CY1 - 0.14 - CYB;
  var vid = function(w, h, d, x, y, z, rz){ var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), D.M.vidrio('#1A2A3A')); m.position.set(x, y, z); if(rz) m.rotation.z = rz; G.add(m); return m; };
  vid(0.03, Math.hypot(hV, C.inc), CZ1 - CZ0 - 0.14, (CU0 + CUT) / 2 + 0.03, CYB + hV / 2, cz, -Math.atan2(C.inc, hV));
  [CZ0 + 0.015, CZ1 - 0.015].forEach(function(z){
    perfil(null, [[CU0 + 0.08, CYB + 0.03], [CU1 - 0.09, CYB + 0.03], [CU1 - 0.09, CY1 - 0.15], [CUT + 0.08, CY1 - 0.15]], 0.03, z, 'vidrio', '#1A2A3A', 0.008);
  });
  vid(0.03, hV * 0.80, CZ1 - CZ0 - 0.16, CU1 - 0.03, CYB + hV * 0.45, cz);
  /* limpiaparabrisas, manija, bisagras, asideros */
  tubo(null, [CU0 + 0.01, CYB + 0.10, cz - 0.25], [CU0 + C.inc * 0.55 + 0.01, CYB + hV * 0.55, cz + 0.15], 0.012, 'mate', '#111', 6);
  bloque(null, 0.18, 0.04, 0.05, 'cromo', null, xPu + 0.12, CYB - 0.20, CZ1 + 0.03, 0.01);
  [CYB - 0.35, CY1 - 0.45].forEach(function(y){ bloque(null, 0.06, 0.10, 0.05, 'mate', '#202327', CU1 - 0.10, y, CZ1 + 0.03, 0.01); });
  tubo(null, [CU1 + 0.08, YDK + 0.30, CZ1 + 0.06], [CU1 + 0.08, CY1 - 0.40, CZ1 + 0.06], 0.022, 'pintura', RIG_AM, 10);
  /* asiento y volante, que se ven por los vidrios */
  bloque(null, 0.55, 0.55, 0.55, 'mate', '#2A2D31', (CU0 + CU1) / 2 + 0.25, CYB + 0.10, cz, 0.08);
  bloque(null, 0.14, 0.70, 0.55, 'mate', '#2A2D31', (CU0 + CU1) / 2 + 0.52, CYB + 0.45, cz, 0.06);
  pon(null, new THREE.TorusGeometry(0.19, 0.025, 8, 24), 'mate', '#15171A', (CU0 + CU1) / 2 - 0.30, CYB + 0.30, cz, [0, Math.PI / 2 - 0.5, 0]);
  /* costado: el CAT grande (serie F) o el numero de unidad (cabinas amarillas) */
  if(P.catCab){
    letrero(texRotulo3d(rigRotuloCabina, 512, 160), (CU1 - CU0) * 0.96, (CYB - YDK) * 0.80, (CU0 + CU1) / 2, (YDK + CYB) / 2 + 0.02, CZ1 + 0.006, 0);
  }
  if(!negroCab){
    var mNc = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.30), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
    mNc.position.set((CU0 + CU1) / 2 + 0.25, (YDK + CYB) / 2 + 0.08, CZ1 + 0.006); G.add(mNc);
  }
  /* modulo detras de la cabina: tablero electrico, modulos, aire acondicionado */
  /* bajo la pared frontal de la tolva: el modulo no puede pasar de ella */
  var yPared = function(u){ return P.BL[1] + (u - P.BL[0]) * (P.FW[1] - P.BL[1]) / (P.FW[0] - P.BL[0]); };
  var xMod = CU1 + 0.30, colMod = negroCab ? RIG_NEGRO : RIG_GRIS;
  var hMod = Math.max(0.6, Math.min((CYB - YDK) * 1.35, yPared(C.u1 + 0.65) - 0.55 - YDK)), yMod = YDK + hMod;
  bloque('TAB', 0.55, hMod, (CZ1 - CZ0) * 0.72, 'pintura', colMod, xMod, YDK + hMod / 2, cz + 0.10, 0.04);
  if(yMod + 0.40 < yPared(C.u1 + 0.62) - 0.08){
    bloque('EC', 0.30, 0.36, 0.50, 'mate', RIG_GRIS2, xMod + 0.05, yMod + 0.18, cz - 0.20, 0.03);
    bloque('AAC', 0.50, 0.30, 0.70, 'mate', RIG_GRIS, xMod - 0.02, yMod + 0.15, cz + 0.42, 0.04);
  } else {
    /* sin lugar bajo la tolva: van en la plataforma, al lado del modulo */
    bloque('EC', 0.30, 0.40, 0.45, 'mate', RIG_GRIS2, xMod + 0.05, YDK + 0.20, CZ0 - 0.30, 0.03);
    bloque('AAC', 0.55, 0.32, 0.60, 'mate', RIG_GRIS, xMod - 0.40, YDK + 0.16, CZ0 - 0.40, 0.04);
  }
  bloque('HAR', 0.05, 0.05, CZ1 - CZ0 + 0.6, 'mate', '#22262B', CU1 + 0.06, YDK + 0.10, cz - 0.3, 0.01);
  /* luces de carga (roja, ambar, verde) al costado del modulo */
  ['#D9301F', '#F0A41C', '#2FA84F'].forEach(function(c, i){
    luz(c, 0.45, 0.06, xMod - 0.12 + i * 0.12, YDK + hMod * 0.70, cz + 0.10 + (CZ1 - CZ0) * 0.36 + 0.03);
  });
  /* baliza: sobre el techo si cabe bajo el alero, si no sobre el modulo */
  var hueco = P.CANH - P.CANT - CY1;
  var bal = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4, roughness: 0.3 }));
  if(hueco > 0.22) bal.position.set(CU1 - 0.30, CY1 + 0.005, CZ0 + 0.25);
  else bal.position.set(xMod + 0.05, yMod + 0.36, cz - 0.20);
  G.add(bal);

  /* ═══ filtros de aire y prefiltros en la plataforma ═══ */
  var uFi = P.DK0 + 0.75 * k;
  if(P.filtro === 'horizontal'){
    /* caja cilindrica acostada en la plataforma derecha, a lo ancho */
    var zf0 = -(ZDK - 0.35), zf1 = -(GW + 0.30), rf = 0.32 * k;
    cilindro(null, rf, rf, zf0 - zf1 < 0 ? zf1 - zf0 : zf0 - zf1, 'pintura', RIG_AM, U(uFi), YDK + rf + 0.08, (zf0 + zf1) / 2, [Math.PI / 2, 0, 0], 28);
    [zf0, zf1].forEach(function(z){ cilindro(null, rf * 0.96, rf * 0.96, 0.08, 'pintura', RIG_AM2, U(uFi), YDK + rf + 0.08, z, [Math.PI / 2, 0, 0], 28); });
    [-0.35, 0.35].forEach(function(f){ bloque(null, 0.12, 0.10, 0.14, 'mate', RIG_NEGRO, U(uFi + f * rf), YDK + 0.05, (zf0 + zf1) / 2, 0.02); });
    tubo(null, [U(uFi + rf * 0.8), YDK + rf + 0.08, zf1 + 0.2], [U(uFi + 1.0 * k), YDK + 0.05, -0.55 * k], 0.12 * k, 'goma', '#2A2D31', 12);
  } else if(P.filtro === 'vertical'){
    var zv = -(ZDK - 0.42);
    cilindro(null, 0.25 * k, 0.25 * k, 0.75 * k, 'pintura', RIG_AM, U(uFi), YDK + 0.375 * k, zv, null, 24);
    cilindro(null, 0.27 * k, 0.27 * k, 0.07, 'pintura', RIG_AM2, U(uFi), YDK + 0.75 * k, zv, null, 24);
    tubo(null, [U(uFi + 0.2 * k), YDK + 0.55 * k, zv + 0.2 * k], [U(uFi + 0.9 * k), YDK + 0.08, -0.5 * k], 0.10 * k, 'goma', '#2A2D31', 12);
  } else {
    [-1, 1].forEach(function(s){
      cilindro(null, 0.30 * k, 0.30 * k, 0.90 * k, 'pintura', RIG_AM, U(uCap1 + 0.40 * k), YDK + 0.45 * k, s * 0.62 * k, null, 24);
      cilindro(null, 0.33 * k, 0.33 * k, 0.09, 'mate', RIG_NEGRO, U(uCap1 + 0.40 * k), YDK + 0.92 * k, s * 0.62 * k, null, 24);
    });
  }
  /* prefiltros tipo hongo detras del capot */
  if(P.filtro !== 'doble'){
    [-1, 1].forEach(function(s){
      cilindro(null, 0.09 * k, 0.09 * k, 0.35 * k, 'mate', RIG_NEGRO, U(uCap1 + 0.30 * k), YDK + 0.175 * k, s * 0.55 * k, null, 14);
      cilindro(null, 0.20 * k, 0.24 * k, 0.16 * k, 'pintura', RIG_AM, U(uCap1 + 0.30 * k), YDK + 0.40 * k, s * 0.55 * k, null, 20);
    });
  }
  /* engrase centralizado con su bomba y bateria */
  bloque('SEN', 0.55 * k, 0.60 * k, 0.45 * k, 'mate', RIG_GRIS, U(P.DK1 - 0.45), YDK + 0.30 * k, -(ZDK - 0.45), 0.04);
  cilindro('GP1', 0.11 * k, 0.11 * k, 0.42 * k, 'metal', RIG_GRIS2, U(P.DK1 - 0.45), YDK + 0.81 * k, -(ZDK - 0.45), null, 14);
  bloque('BAT', 0.60 * k, 0.45 * k, 0.70 * k, 'mate', RIG_NEGRO, U(P.DK0 + 0.55 * k), YDK - 0.12 - FH - 0.24 * k, -(ZDK - 0.75 * k), 0.03);

  /* ═══ accesos ═══ */
  /* escalera recta entre dos puntos (abajo a, arriba b): peldanos de rejilla,
     largueros amarillos y pasamanos negros a los dos lados */
  var escalera3 = function(a, b, ancho){
    var hx = b[0] - a[0], hz = b[2] - a[2], hl = Math.hypot(hx, hz);
    hx /= hl; hz /= hl;
    var tx = -hz, tz = hx, th = Math.atan2(-hz, hx), n = Math.max(3, Math.round((b[1] - a[1]) / 0.25));
    for(var i = 1; i <= n; i++){
      var f = i / (n + 1);
      bloque(null, 0.24, 0.04, ancho - 0.08, 'metal', RIG_PEL, a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f, 0.01, [0, th, 0]);
    }
    [-1, 1].forEach(function(s){
      var o = [tx * s * ancho / 2, 0, tz * s * ancho / 2];
      cajaEntre(null, [a[0] + o[0], a[1] - 0.06, a[2] + o[2]], [b[0] + o[0], b[1] - 0.06, b[2] + o[2]], 0.22, 0.05, 'pintura', RIG_AM);
      var oo = [tx * s * (ancho / 2 + 0.04), 0, tz * s * (ancho / 2 + 0.04)];
      tubo(null, [a[0] + oo[0], a[1] + 0.95, a[2] + oo[2]], [b[0] + oo[0], b[1] + 0.95, b[2] + oo[2]], 0.026, 'pintura', RIG_BAR, 10);
      tubo(null, [a[0] + oo[0], a[1] + 0.50, a[2] + oo[2]], [b[0] + oo[0], b[1] + 0.50, b[2] + oo[2]], 0.020, 'pintura', RIG_BAR, 10);
      [0, 0.5, 1].forEach(function(f){
        var q = [a[0] + (b[0] - a[0]) * f + oo[0], a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f + oo[2]];
        tubo(null, q, [q[0], q[1] + 0.95, q[2]], 0.024, 'pintura', RIG_BAR, 10);
      });
    });
  };
  var uf = P.DK0 + 0.05, zA = -(ZDK - 0.05), zB = ZDK - 0.05, uH = uCap1 + 0.10;
  /* el pasamanos de atras queda delante de la pared frontal de la tolva */
  var uR = Math.min(P.DK1 - 0.1, P.BL[0] + (YDK + 1.15 - P.BL[1]) * (P.FW[0] - P.BL[0]) / (P.FW[1] - P.BL[1]) - 0.10);
  var tramos = [];
  if(P.acceso === 'diagonal'){
    /* cruza la parrilla: del parachoques (derecha) a la plataforma (izquierda) */
    var xS = U(P.PAR + 0.36), zS0 = P.subida[0], zS1 = P.subida[1];
    escalera3([xS, P.YPAR, zS0], [xS, YDK, zS1], 0.60);
    /* descanso arriba, frente a la parrilla */
    bloque(null, GRu - P.PAR - 0.06, 0.06, GW + 0.20 - (zS1 - 0.30), 'metal', RIG_PEL, U((P.PAR + 0.06 + GRu) / 2), YDK - 0.03, (zS1 - 0.30 + GW + 0.20) / 2, 0.01);
    AM(null, GRu - P.PAR - 0.06, 0.12, 0.08, U((P.PAR + 0.06 + GRu) / 2), YDK - 0.10, zS1 - 0.30, 0.02);
    tramos.push([[uR, zA], [uf, zA], [uf, -(GW + 0.15)], [uH, -(GW + 0.15)], [uH, zS1 - 0.45]]);
    tramos.push([[uf, zS1 + 0.42], [uf, zB], [C.u0 - 0.10, zB]]);
    /* escalerillas del parachoques a los guardafangos (785D) */
    if(P.escCortas){
      [-1, 1].forEach(function(s){ D.escalera(U(P.PAR) - 0.02, s * (GW + 0.55), P.YPAR, YDK - 0.12 - FH, 0.40, RIG_AM, RIG_PEL); });
    }
  } else if(P.acceso === 'vertical'){
    /* 785C: dos escaleras verticales del suelo a la plataforma, delante del parachoques */
    var zL = GW + 0.45;
    [-1, 1].forEach(function(s){
      D.escalera(U(P.PAR) - 0.08, s * zL, 0.42, YDK, 0.44, RIG_AM, RIG_PEL);
      [-0.22, 0.22].forEach(function(dz){ tubo(null, [U(P.PAR) - 0.08, YDK, s * zL + dz], [U(P.PAR) - 0.08, YDK + 1.0, s * zL + dz], 0.028, 'pintura', RIG_AM, 10); });
      /* rellano entre la escalera y el guardafango */
      bloque(null, P.DK0 - P.PAR + 0.12, 0.05, 0.50, 'metal', RIG_PEL, U((P.PAR + P.DK0) / 2) - 0.02, YDK - 0.03, s * zL, 0.01);
    });
    tramos.push([[uR, zA], [uf, zA], [uf, -zL - 0.30]]);
    tramos.push([[uf, -zL + 0.30], [uf, -(GW + 0.15)], [uH, -(GW + 0.15)], [uH, GW + 0.15], [uf, GW + 0.15], [uf, zL - 0.30]]);
    tramos.push([[uf, zL + 0.30], [uf, zB], [C.u0 - 0.10, zB]]);
  } else {
    /* serie F: escalera por la esquina delantera izquierda, sube hacia atras
       y hacia afuera; a la derecha una escalera vertical */
    var aS = [U(P.PAR + 0.18), P.YPAR, GW + 0.45], bS = [U(P.SUBu), YDK, ZDK - 0.38];
    escalera3(aS, bS, 0.58);
    var zLd = -(ZDK - 0.38);
    D.escalera(U(P.DK0) - 0.12, zLd, P.YPAR, YDK, 0.44, RIG_AM, RIG_PEL);
    [-0.22, 0.22].forEach(function(dz){ tubo(null, [U(P.DK0) - 0.12, YDK, zLd + dz], [U(P.DK0) - 0.12, YDK + 1.0, zLd + dz], 0.028, 'pintura', RIG_BAR, 10); });
    var uS = P.SUBu + 0.14;
    tramos.push([[uR, zA], [uf + 0.25, zA]]);
    tramos.push([[uf, zLd + 0.30], [uf, -(GW + 0.15)], [uH, -(GW + 0.15)], [uH, GW + 0.15], [uS, GW + 0.15], [uS, ZDK - 0.75]]);
    tramos.push([[uS + 0.45, zB], [C.u0 - 0.10, zB]]);
  }
  /* peldanos colgantes bajo el parachoques */
  (P.acceso === 'lateral' ? [-(GW + 0.30), GW + 0.30] : [-(P.BPW - 0.32), P.BPW - 0.32]).forEach(function(z){
    D.escalera(U(P.PAR) - 0.03, z, Math.max(0.35, P.YPARb - 0.85 * k), P.YPARb + 0.02, 0.40, RIG_BAR, RIG_PEL);
  });
  /* pasamanos negros con rodapie amarillo: frente, costados y atras */
  if(C.u1 + 0.65 < uR - 0.25) tramos.push([[C.u1 + 0.65, zB], [uR, zB], [uR, GW + 0.30]]);
  tramos.push([[uR, zA], [uR, -(GW + 0.30)]]);
  tramos.forEach(function(t){
    D.baranda(t.map(function(p){ return [U(p[0]), p[1]]; }), YDK, 1.05, RIG_BAR, RIG_AM);
  });

  /* ═══ espejos y faros de trabajo ═══ */
  [-1, 1].forEach(function(s){
    var x0 = U(uf), z0 = s * (ZDK - 0.05);
    tubo(null, [x0, YDK + 1.05, z0], [x0 - 0.18, YDK + 1.45, z0 + s * 0.30], 0.03, 'pintura', RIG_BAR, 10);
    bloque(null, 0.08, 0.80 * k, 0.42 * k, 'mate', RIG_NEGRO, x0 - 0.20, YDK + 1.62, z0 + s * 0.36, 0.04);
    bloque(null, 0.02, 0.72 * k, 0.35 * k, 'cromo', null, x0 - 0.25, YDK + 1.62, z0 + s * 0.36, 0.005);
  });
  /* faros de trabajo bajo el canto del alero */
  [-1, 1].forEach(function(s){
    esTolva(bloque(null, 0.16, 0.18, 0.26, 'mate', RIG_NEGRO, U(P.CANu) + 0.20, P.CANH - P.CANT - 0.10, s * (P.BW / 2 - 0.70), 0.02));
    esTolva(bloque('FPR', 0.03, 0.12, 0.20, 'vidrio', '#F4EDCF', U(P.CANu) + 0.11, P.CANH - P.CANT - 0.10, s * (P.BW / 2 - 0.70), 0.01));
  });

  /* ═══ tolva de doble pendiente ═══ */
  var BW2 = P.BW / 2, YC = P.YCARGA;
  var yInf = function(u){
    if(u <= P.BRK[0]) return P.BL[1] + (u - P.BL[0]) * (P.BRK[1] - P.BL[1]) / (P.BRK[0] - P.BL[0]);
    return P.BRK[1] + (u - P.BRK[0]) * (P.YTL - P.BRK[1]) / (TAIL - P.BRK[0]);
  };
  var yBorde = function(u){   /* canto superior del costado: baja del alero al larguero */
    if(u <= P.CANf) return P.CANH;
    if(u >= P.BTu) return YC;
    return P.CANH + (u - P.CANf) * (YC - P.CANH) / (P.BTu - P.CANf);
  };
  /* donde la pared frontal corta el canto del costado */
  var tI = 1;
  for(var it = 0; it <= 60; it++){
    var tt = it / 60, uu = P.BL[0] + (P.FW[0] - P.BL[0]) * tt, yy = P.BL[1] + (P.FW[1] - P.BL[1]) * tt;
    if(yy >= yBorde(uu)){ tI = tt; break; }
  }
  var pI = [P.BL[0] + (P.FW[0] - P.BL[0]) * tI, P.BL[1] + (P.FW[1] - P.BL[1]) * tI];
  var costado = [[pI[0], pI[1]], [P.BTu, YC], [TAIL, YC], [TAIL, P.YTL], P.BRK, P.BL].map(function(p){ return [U(p[0]), p[1]]; });
  /* altura de los nervios inferiores sin tocar las llantas traseras */
  var techoLl = function(u){
    var d = Math.abs(u - P.WB);
    return d >= R ? 0 : R + Math.sqrt(R * R - d * d);
  };
  [-1, 1].forEach(function(s){
    var zP = s * (BW2 - 0.20);
    esTolva(perfil('TLV', costado, 0.10, zP, 'pintura', RIG_AM, 0.02));
    /* cartela del alero: une el costado con el alero */
    esTolva(perfil('TLV', [[U(P.CANf - 0.45), P.CANH - P.CANT + 0.02], [U(P.CANf), P.CANH - 0.02], [U(pI[0]), pI[1]],
      [U(pI[0] + (P.BL[0] - P.FW[0]) * 0.12), pI[1] + (P.BL[1] - P.FW[1]) * 0.12]], 0.10, zP, 'pintura', RIG_AM, 0.02));
    /* larguero superior redondeado, canto inclinado y canto de cola */
    esTolva(bloque('TLV', TAIL - P.BTu + 0.05, 0.30 * k, 0.16, 'pintura', RIG_AM, U((P.BTu + TAIL) / 2), YC - 0.15 * k, s * (BW2 - 0.08), 0.06));
    esTolva(vigaXY('TLV', [U(P.CANf - 0.05), P.CANH - 0.10], [U(P.BTu + 0.05), YC - 0.12], s * (BW2 - 0.08), 0.22 * k, 0.16, 'pintura', RIG_AM, 0.05));
    esTolva(vigaXY('TLV', [U(TAIL) - 0.04, YC], [U(TAIL) - 0.04, P.YTL], s * (BW2 - 0.10), 0.16, 0.18, 'pintura', RIG_AM2, 0.03));
    /* viga inferior del costado, siguiendo el canto */
    esTolva(vigaXY('TLV', [U(P.BL[0]), P.BL[1] + 0.08], [U(P.BRK[0]), P.BRK[1] + 0.08], s * (BW2 - 0.10), 0.20 * k, 0.18, 'pintura', RIG_AM2, 0.04));
    esTolva(vigaXY('TLV', [U(P.BRK[0]), P.BRK[1] + 0.08], [U(TAIL), P.YTL + 0.08], s * (BW2 - 0.10), 0.20 * k, 0.18, 'pintura', RIG_AM2, 0.04));
    /* el numero va en una franja sin nervios de todo el alto del costado,
       sobre el quiebre del piso (mas atras el costado es muy bajo) */
    var uNum1 = P.BRK[0] + 0.40 * k, uNum0 = uNum1 - 2.25 * k;
    var yNumB = function(u){ return yInf(u) + 0.22; }, yNumT = function(){ return YC - 0.32 * k; };
    var yMed = function(u){ return yInf(u) + 0.48 * (YC - yInf(u)); };
    if(P.costado === 'diag'){
      /* nervio largo (cortado donde va el numero) y nervios inclinados (arriba) y rectos (abajo) */
      var ua = P.BTu + 0.25, ub = TAIL - 0.20;
      esTolva(vigaXY('TLV', [U(ua), yMed(ua)], [U(uNum0 - 0.10), yMed(uNum0 - 0.10)], s * (BW2 - 0.10), 0.20 * k, 0.17, 'pintura', RIG_AM3, 0.04));
      esTolva(vigaXY('TLV', [U(uNum1 + 0.05), yMed(uNum1 + 0.05)], [U(ub), yMed(ub)], s * (BW2 - 0.10), 0.20 * k, 0.17, 'pintura', RIG_AM3, 0.04));
      for(var ur = P.BTu + 0.75 * k; ur < TAIL - 0.35; ur += 0.95 * k){
        var enNum = ur > uNum0 - 0.25 && ur < uNum1 + 0.1, enMod = ur < P.BTu + 1.45 * k;
        if(enNum) continue;
        if(!enMod){
          esTolva(vigaXY('TLV', [U(ur - 0.16), YC - 0.28 * k], [U(ur + 0.16), yMed(ur) + 0.08], s * (BW2 - 0.09), 0.17, 0.15, 'pintura', RIG_AM3, 0.03));
        }
        var y0 = yInf(ur) + 0.14, y1 = yMed(ur) - 0.08;
        if(y1 - y0 > 0.2) esTolva(vigaXY('TLV', [U(ur), y0], [U(ur), y1], s * (BW2 - 0.09), 0.17, 0.15, 'pintura', RIG_AM3, 0.03));
      }
    } else {
      /* 793: panel grande en relieve con marco, nervios cortos abajo */
      var pu0 = P.BTu + 0.85, pu1 = TAIL - 0.60, pyT = YC - 0.42 * k;
      var pyB = function(u){ return yInf(u) + 0.22 * (YC - yInf(u)); };
      esTolva(vigaXY('TLV', [U(pu0), pyT], [U(pu1), pyT], s * (BW2 - 0.10), 0.16, 0.16, 'pintura', RIG_AM3, 0.03));
      esTolva(vigaXY('TLV', [U(pu0), pyB(pu0)], [U(pu1), pyB(pu1)], s * (BW2 - 0.10), 0.16, 0.16, 'pintura', RIG_AM3, 0.03));
      [pu0, pu1].forEach(function(u){ esTolva(vigaXY('TLV', [U(u), pyB(u)], [U(u), pyT], s * (BW2 - 0.10), 0.16, 0.16, 'pintura', RIG_AM3, 0.03)); });
      esTolva(bloque(null, pu1 - pu0 - 0.2, 0.04, 0.05, 'pintura', RIG_AM2, U((pu0 + pu1) / 2), pyT - 0.12, s * (BW2 - 0.13), 0.01));
      for(var ur2 = pu0 + 0.9; ur2 < pu1; ur2 += 0.95 * k){
        var y02 = yInf(ur2) + 0.14, y12 = pyB(ur2) - 0.08;
        if(y12 - y02 > 0.2) esTolva(vigaXY('TLV', [U(ur2), y02], [U(ur2), y12], s * (BW2 - 0.09), 0.17, 0.15, 'pintura', RIG_AM3, 0.03));
      }
      /* en el 793 el numero va dentro del panel, hacia el medio */
      uNum0 = pu0 + 0.9; uNum1 = uNum0 + 2.2 * k;
      yNumB = function(u){ return pyB(u) + 0.10; }; yNumT = function(){ return pyT - 0.14; };
    }
    /* placa del modelo adelante y numero de unidad atras */
    esTolva(letrero(texMod, 1.05 * k, 0.26 * k, U(P.BTu + 0.70 * k), YC - 0.52 * k, s * (BW2 + 0.005), s > 0 ? 0 : Math.PI));
    var uN = (uNum0 + uNum1) / 2, yB = Math.max(yNumB(uNum0), yNumB(uNum1)), yT = yNumT();
    var hNum = Math.min(0.60 * k, yT - yB);
    var mN = new THREE.Mesh(new THREE.PlaneGeometry(hNum * 3.2, hNum), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
    mN.position.set(U(uN), (yB + yT) / 2, s * (BW2 - 0.13)); mN.rotation.y = s > 0 ? 0 : Math.PI;
    G.add(mN); esTolva(mN);
    /* ojo de izaje */
    esTolva(pon(null, new THREE.TorusGeometry(0.10 * k, 0.035, 8, 16), 'mate', RIG_NEGRO, U(P.BTu + 2.2 * k), YC - 0.38 * k, s * (BW2 + 0.02)));
  });
  /* piso: tramo delantero y tramo de cola */
  var losa = function(p, q, ancho, grueso, hex, code){
    return esTolva(vigaXY(code === undefined ? 'TLV' : code, [U(p[0]), p[1] + grueso / 2], [U(q[0]), q[1] + grueso / 2], 0, grueso, ancho, 'pintura', hex || RIG_AM, 0.03));
  };
  losa(P.BL, P.BRK, P.BW - 0.42, 0.12);
  losa(P.BRK, [TAIL, P.YTL], P.BW - 0.42, 0.12);
  /* labio de cola */
  esTolva(bloque('TLV', 0.24, 0.20, P.BW - 0.10, 'pintura', RIG_AM2, U(TAIL) - 0.06, P.YTL + 0.06, 0, 0.05));
  /* pared frontal, tapa inclinada hasta el alero y nervios verticales */
  losa(P.BL, P.FW, P.BW - 0.42, 0.14);
  var pared = Math.atan2(P.FW[1] - P.BL[1], P.FW[0] - P.BL[0]);
  for(var nv = -2; nv <= 2; nv++){
    esTolva(vigaXY(null, [U(P.BL[0]) - 0.10 * Math.sin(pared), P.BL[1] + 0.25], [U(P.FW[0]) - 0.10 * Math.sin(pared), P.FW[1] - 0.15],
      nv * (P.BW - 0.8) / 5, 0.16, 0.14, 'pintura', RIG_AM3, 0.03));
  }
  losa([P.CANf, P.CANH - 0.10], P.FW, P.BW - 0.42, 0.12);
  /* vigas y nervios bajo el piso; mas cortos sobre las llantas */
  [-1, 1].forEach(function(s){
    esTolva(vigaXY('TLV', [U(P.BL[0] + 0.3), P.BL[1] - 0.18 * k], [U(P.BRK[0]), P.BRK[1] - 0.18 * k], s * 0.74 * k, 0.36 * k, 0.28 * k, 'pintura', RIG_AM2, 0.04));
    esTolva(vigaXY('TLV', [U(P.BRK[0]), P.BRK[1] - 0.18 * k], [U(TAIL - 0.3), yInf(TAIL - 0.3) - 0.18 * k], s * 0.74 * k, 0.36 * k, 0.28 * k, 'pintura', RIG_AM2, 0.04));
    /* almohadillas sobre el bastidor */
    esTolva(bloque(null, 0.40 * k, 0.10, 0.32 * k, 'goma', '#22262B', U(P.WB * 0.30), yInf(P.WB * 0.30) - 0.38 * k, s * zR, 0.03));
  });
  for(var ux = P.BL[0] + 0.45; ux < TAIL - 0.25; ux += 0.70 * k){
    var hN = Math.min(0.26 * k, yInf(ux) - techoLl(ux) - 0.06);
    if(hN > 0.06) esTolva(bloque(null, 0.13 * k, hN, P.BW - 0.6, 'pintura', RIG_AM2, U(ux), yInf(ux) - hN / 2, 0, 0.03));
  }
  /* orejas del pivote y del cilindro de levante, bajo el piso */
  [-1, 1].forEach(function(s){
    var zO = s * (zR + 0.30 * k);
    esTolva(perfil(null, [[U(uPiv - 0.60 * k), yInf(uPiv - 0.60 * k) + 0.02], [U(uPiv + 0.45 * k), yInf(uPiv + 0.45 * k) + 0.02],
      [U(uPiv + 0.18 * k), yPiv - 0.14 * k], [U(uPiv - 0.20 * k), yPiv - 0.14 * k]], 0.12, zO, 'pintura', RIG_AM2, 0.02));
    esTolva(perfil(null, [[U(H[2] - 0.35 * k), yInf(H[2] - 0.35 * k) + 0.02], [U(H[2] + 0.35 * k), yInf(H[2] + 0.35 * k) + 0.02],
      [U(H[2] + 0.10 * k), H[3] - 0.08], [U(H[2] - 0.12 * k), H[3] - 0.08]], 0.10, s * (zH + 0.17 * k), 'pintura', RIG_AM2, 0.02));
  });
  /* expulsores de roca entre las duales */
  [-1, 1].forEach(function(s){
    var zE = s * P.DUAL / 2, yE0 = yInf(P.WB) - 0.02;
    esTolva(bloque(null, 0.36 * k, 0.12, 0.12, 'metal', RIG_GRIS2, XT + 0.10, yE0 - 0.05, zE, 0.02));
    esTolva(tubo(null, [XT + 0.10, yE0 - 0.08, zE], [XT + 0.18, R * 1.42, zE], 0.055 * k, 'metal', RIG_GRIS2, 10));
  });

  /* ═══ alero sobre la cabina ═══ */
  var CW2 = P.CANW / 2, uA0 = P.CANu, uA1 = P.CANf, xA0 = U(uA0);
  esTolva(bloque('TLV', uA1 - uA0, 0.10, P.BW + 0.30, 'pintura', RIG_AM, U((uA0 + uA1) / 2), P.CANH - 0.05, 0, 0.03));
  /* canto delantero con el CATERPILLAR */
  esTolva(bloque('TLV', 0.14, P.CANT, P.BW + 0.30, 'pintura', RIG_AM, xA0 + 0.07, P.CANH - P.CANT / 2, 0, 0.04));
  esTolva(letrero(texRotulo3d(rigRotuloCater, 1024, 96), P.BW * 0.42, P.CANT * 0.66, xA0 - 0.006, P.CANH - P.CANT * 0.48, 0, -Math.PI / 2));
  /* alas laterales que bajan inclinadas hacia afuera */
  [-1, 1].forEach(function(s){
    var pts = [[BW2 + 0.10, P.CANH - 0.02], [CW2, P.CANH - 0.30 * k], [CW2, P.CANH - 0.40 * k], [BW2 + 0.10, P.CANH - 0.14]];
    if(s < 0) pts = pts.map(function(p){ return [-p[0], p[1]]; }).reverse();
    esTolva(perfilX('TLV', pts, uA1 - uA0 + 0.25, U((uA0 + uA1) / 2 + 0.12), 'pintura', RIG_AM, 0.02));
    esTolva(bloque(null, 0.14, 0.38 * k, CW2 - BW2 - 0.05, 'pintura', RIG_AM, xA0 + 0.07, P.CANH - 0.22 * k, s * (BW2 + CW2) / 2, 0.03,
      [s * Math.atan2(0.30 * k, CW2 - BW2), 0, 0]));
  });
  /* nervios bajo el alero, a lo largo */
  for(var na = -2; na <= 2; na++){
    esTolva(bloque(null, uA1 - uA0 - 0.2, 0.16 * k, 0.10, 'pintura', RIG_AM2, U((uA0 + uA1) / 2 + 0.05), P.CANH - 0.10 - 0.08 * k, na * (P.BW - 0.6) / 4.4, 0.02));
  }
  /* numero de unidad al frente del alero, del lado derecho */
  var mNa = new THREE.Mesh(new THREE.PlaneGeometry(1.15 * k, 0.36 * k), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
  mNa.position.set(xA0 - 0.008, P.CANH - P.CANT * 0.48, -(P.BW * 0.21 + 0.75 * k)); mNa.rotation.y = -Math.PI / 2; G.add(mNa); esTolva(mNa);

  /* ═══ llantas en aros amarillos ═══ */
  var LL = { r: R, ancho: A, rAro: P.aro * 0.0127 + 0.05, aro: RIG_AM, aro2: RIG_AM2, pernos: Math.round(26 * k + 4), paso: 0.40 * k };
  D.ruedaDet('LL1', XD, P.TRF / 2, 1, LL);
  D.ruedaDet('LL2', XD, -P.TRF / 2, -1, LL);
  D.ruedaDet('LL3', XT, zOut, 1, LL);
  D.ruedaDet('LL4', XT, zIn, 0, LL);
  D.ruedaDet('LL5', XT, -zIn, 0, LL);
  D.ruedaDet('LL6', XT, -zOut, -1, LL);

  D.colgarTolva(new THREE.Vector3(U(uPiv), yPiv, 0), 'CAT ' + clave);
  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); texNumB.userData.poner(id); };
  G.userData.mirarY = P.ROPS * 0.52;
  G.userData.dist = P.L * 2.65;
  return G;
}

registrarModelo3d({
  nombre: 'CAT 775F, 777F, 785C, 785D, 793C y 793D',
  clave: function(e){
    var m = mod3d(e).match(/^(775F|777F|785C|785D|793C|793D)/);
    return m ? m[1] : null;
  },
  construir: function(e, piezas, clave){ return rigConstruir(clave, piezas); }
});
