/* ══════════════════════════════════════════════════════════════════
   MOTONIVELADORAS — CAT 12M, 14M, 140K y John Deere 620G, 620P
   (MO-257-AL, MO-266-AL, MO-267-AL, MO-255-AL, MO-279-AL, MO-264-AL, MO-265-AL)

   Medidas de las hojas del fabricante (m), u = distancia hacia atras desde
   el eje delantero:
     12M  (Cat C802114 / AEHQ 12M-140M-160M): alto cabina 3.308 · escape 3.076
          · cilindros 3.040 · eje a vertedera 2.552 · eje a centro tandem 6.123
          · entre ejes del tandem 1.523 · llanta delantera a cola 8.754
          · placa de empuje a ripper 10.136 · trocha 2.140 · ancho 2.511
          · llantas 14.00R24 · vertedera 3.7 x 0.61 · circulo 1.53
     14M  (Cat CM20131030-34940-43366): alto 3.535 · escape 3.245 · cilindros
          2.835 · eje a vertedera 2.840 · eje a tandem 6.559 · tandem 1.656
          · llanta a cola 9.349 · contrapeso a ripper 10.896 · trocha 2.366
          · ancho 2.801 · llantas 16.0R24 · vertedera 4.3 x 0.688 · circulo 1.822
     140K (Cat «K Series Motor Graders», pag. 24): alto 3.354 · escape 2.895
          · cilindros 3.049 · eje a vertedera 2.598 · eje a tandem 6.086
          · tandem 1.523 · llanta a cola 8.504 · contrapeso a ripper 10.013
          · trocha 2.065 · ancho 2.481 · llantas 14.00-24 · vertedera 3.7 x 0.61
     620G (folleto John Deere G-Series 4WD, DKAGGDR4): alto 3.18 · escape 3.10
          · cilindros 3.05 · tandem 1.54 · base de hoja 2.57 · batalla 6.16
          · largo 8.89 · con placa y ripper 9.99 · trocha 2.08 · ancho 2.49
          · llantas 14.00-24 · vertedera 3.66 x 0.61 · circulo 1.52 (5 ft)
     620P (deere.com, 620 P-Tier): las mismas medidas del 620G (largo 8.89,
          batalla 6.16, base de hoja 2.57, alto 3.18); se tomo el tandem 1.54.
   Lo que no esta acotado (largo de cabina y capo, nariz del bastidor,
   altura del cuello de ganso, escalera, escape, prefiltro) se midio sobre
   los dibujos de dimensiones de esos mismos folletos (12M a 10.3 mm/px,
   140K a 9.1 mm/px, 620G a 13.4 mm/px); el 14M es el 12M escalado a su
   batalla y su altura.

   Ejes: frente hacia -X, arriba +Y, la izquierda del operador +Z.
   Llantas con la numeracion SAP, eje por eje: 1 delantera izquierda,
   2 delantera derecha, 3-4 eje delantero del tandem (izq, der), 5-6 eje
   trasero del tandem (izq, der); las ordenes «C/NEUMA POS 3 Y 4» cambian
   el par de un mismo eje.

   Estilos: serie M de CAT (cabina negra de vidrio con techo amarillo, capo
   que baja hacia atras y techo del bastidor negro antirreflejo); serie K
   (cabina amarilla con la visera CATERPILLAR, capo cuadrado con pasamanos);
   John Deere G/P (amarillo JD con techo y esquinas gris oscuro, barra y
   circulo grises, calcomania DEERE en el bastidor y el ciervo en el capo).
   ══════════════════════════════════════════════════════════════════ */
var MOT_NEGRO = '#18191C', MOT_GRIS = '#3A3F45', MOT_GRIS2 = '#5B6269', MOT_ACERO = '#4A4F55',
    MOT_JD_AM = '#F4B90A', MOT_JD_AM2 = '#B78A06', MOT_JD_GRIS = '#222528';

var MOT_MEDIDAS = {
  '12M': { marca: 'CAT', serie: 'M', modelo: '12M', R: 0.635, A: 0.371, tread: 2.140, wb: 6.123, tand: 1.523, hoja: 2.552,
           uRear: 8.119, uPP: -0.873, uRip: 9.263, hCab: 3.308, hEx: 3.076, hCil: 3.040,
           cab: { u0: 3.52, u0b: 3.72, u1: 5.45, u1b: 5.45, y: 1.42, w: 1.56 },
           capo: { u0: 5.47, yT0: 2.42, yT1: 2.30, yB: 1.10, w: 1.30 },
           yN: 2.06, yF: 2.39, frH: 0.34, frW: 0.305, uBaja: 3.47, uSad: 2.30, uHitch: 4.55, uEx: 6.52, uPre: 5.80,
           mL: 3.66, mH: 0.61, dC: 1.53, rAro: 0.32, escarif: false },
  /* el 14M: el 12M escalado a su batalla (x1.071) y su alto de cabina (x1.069) */
  '14M': { marca: 'CAT', serie: 'M', modelo: '14M', R: 0.70, A: 0.435, tread: 2.366, wb: 6.559, tand: 1.656, hoja: 2.840,
           uRear: 8.649, uPP: -0.95, uRip: 9.946, hCab: 3.535, hEx: 3.245, hCil: 2.835,
           cab: { u0: 3.77, u0b: 3.98, u1: 5.84, u1b: 5.84, y: 1.52, w: 1.62 },
           capo: { u0: 5.86, yT0: 2.59, yT1: 2.46, yB: 1.18, w: 1.40 },
           yN: 2.20, yF: 2.55, frH: 0.41, frW: 0.305, uBaja: 3.72, uSad: 2.46, uHitch: 4.87, uEx: 6.98, uPre: 6.21,
           mL: 4.27, mH: 0.688, dC: 1.822, rAro: 0.33, escarif: false },
  '140K': { marca: 'CAT', serie: 'K', modelo: '140K', R: 0.64, A: 0.39, tread: 2.065, wb: 6.086, tand: 1.523, hoja: 2.598,
           uRear: 7.864, uPP: -0.85, uRip: 9.163, hCab: 3.354, hEx: 2.895, hCil: 3.049,
           cab: { u0: 3.60, u0b: 3.66, u1: 5.41, u1b: 5.21, y: 1.43, w: 1.50 },
           capo: { u0: 5.45, yT0: 2.39, yT1: 2.39, yB: 1.16, w: 1.30 },
           yN: 1.95, yF: 2.11, frH: 0.30, frW: 0.305, uBaja: 2.85, uSad: 2.39, uHitch: 4.50, uEx: 5.78, uPre: 6.23,
           mL: 3.66, mH: 0.61, dC: 1.53, rAro: 0.32, escarif: false },
  '620G': { marca: 'JD', serie: 'JD', modelo: '620G', R: 0.63, A: 0.375, tread: 2.08, wb: 6.16, tand: 1.54, hoja: 2.57,
           uRear: 8.26, uPP: -0.87, uRip: 9.12, hCab: 3.18, hEx: 3.10, hCil: 3.05,
           cab: { u0: 3.62, u0b: 3.66, u1: 5.25, u1b: 5.30, y: 1.30, w: 1.56 },
           capo: { u0: 5.32, yT0: 2.44, yT1: 2.26, yB: 1.11, w: 1.32 },
           yN: 1.84, yF: 2.11, frH: 0.40, frW: 0.32, uBaja: 3.36, uSad: 2.20, uHitch: 4.45, uEx: 6.88, uPre: 5.75,
           mL: 3.66, mH: 0.61, dC: 1.52, rAro: 0.32, escarif: false }
};
/* el 620P: mismas medidas; las unidades de la flota traen escarificador (OT «C/PUNTAS ESCARIFICADOR») */
MOT_MEDIDAS['620P'] = (function(){
  var p = JSON.parse(JSON.stringify(MOT_MEDIDAS['620G']));
  p.modelo = '620P'; p.escarif = true;
  return p;
})();

/* logo CAT del capo: placa negra con la franja roja y CAT con el triangulo */
function motRotCAT(g, w, h){
  g.fillStyle = '#16181B'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#C8261C';
  g.beginPath(); g.moveTo(w * 0.02, h); g.lineTo(w * 0.17, 0); g.lineTo(w * 0.27, 0); g.lineTo(w * 0.12, h); g.closePath(); g.fill();
  g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold ' + Math.round(h * 0.70) + 'px "Arial Black", Arial, sans-serif';
  g.fillText('CAT', w * 0.63, h * 0.50, w * 0.62);
  g.fillStyle = CAT_AM;
  g.beginPath(); g.moveTo(w * 0.595, h * 0.86); g.lineTo(w * 0.665, h * 0.86); g.lineTo(w * 0.63, h * 0.66); g.closePath(); g.fill();
}
/* el ciervo de John Deere en su escudo negro, sobre el amarillo del capo */
function motRotDeere(fondo){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    var cajaR = function(x, y, ww, hh, r){
      g.beginPath(); g.moveTo(x + r, y); g.lineTo(x + ww - r, y); g.quadraticCurveTo(x + ww, y, x + ww, y + r);
      g.lineTo(x + ww, y + hh - r); g.quadraticCurveTo(x + ww, y + hh, x + ww - r, y + hh);
      g.lineTo(x + r, y + hh); g.quadraticCurveTo(x, y + hh, x, y + hh - r); g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y); g.closePath(); g.fill();
    };
    g.fillStyle = '#FFFFFF'; cajaR(w * 0.06, h * 0.05, w * 0.88, h * 0.90, w * 0.22);
    g.fillStyle = '#141517'; cajaR(w * 0.10, h * 0.09, w * 0.80, h * 0.82, w * 0.19);
    /* ciervo saltando hacia la izquierda */
    g.save(); g.translate(w / 2, h / 2); g.scale(w / 220, h / 220);
    g.fillStyle = '#FFFFFF'; g.strokeStyle = '#FFFFFF'; g.lineCap = 'round'; g.lineJoin = 'round';
    g.save(); g.rotate(-0.30); g.beginPath(); g.ellipse(8, 8, 42, 15, 0, 0, Math.PI * 2); g.fill(); g.restore();
    g.lineWidth = 11; g.beginPath(); g.moveTo(-22, -6); g.lineTo(-44, -30); g.stroke();
    g.beginPath(); g.ellipse(-50, -36, 11, 7, -0.5, 0, Math.PI * 2); g.fill();
    g.lineWidth = 4;
    [[-50, -42, -46, -70], [-47, -58, -36, -66], [-52, -44, -62, -68], [-58, -58, -70, -62]].forEach(function(l){
      g.beginPath(); g.moveTo(l[0], l[1]); g.lineTo(l[2], l[3]); g.stroke();
    });
    g.lineWidth = 7;
    [[-24, 6, -52, 18, -66, 8], [-18, 12, -46, 34, -62, 30], [34, 0, 58, 26, 76, 46], [38, -6, 66, 6, 84, 18]].forEach(function(l){
      g.beginPath(); g.moveTo(l[0], l[1]); g.lineTo(l[2], l[3]); g.lineTo(l[4], l[5]); g.stroke();
    });
    g.lineWidth = 6; g.beginPath(); g.moveTo(44, -14); g.lineTo(56, -26); g.stroke();
    g.restore();
  };
}
/* chapa perforada de las puertas del motor (serie M) */
function motRejilla(fondo, tinta){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    g.fillStyle = tinta;
    for(var y = 7, f = 0; y < h - 4; y += 11, f++){
      for(var x = 7 + (f % 2) * 5.5; x < w - 4; x += 11){ g.beginPath(); g.arc(x, y, 3.4, 0, Math.PI * 2); g.fill(); }
    }
    g.strokeStyle = tinta; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6);
  };
}
/* persiana de ranuras horizontales (serie K y John Deere) */
function motPersiana(fondo, tinta){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    g.fillStyle = tinta;
    for(var y = h * 0.08; y < h * 0.92; y += h * 0.075) g.fillRect(w * 0.08, y, w * 0.84, h * 0.035);
  };
}

function motConstruir(P, piezas){
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var bloque = D.bloque, perfil = D.perfil, tubo = D.tubo, cilindro = D.cilindro, pon = D.pon, letrero = D.letrero;
  var CAT = P.marca === 'CAT', SM = P.serie === 'M', SK = P.serie === 'K', JD = P.marca === 'JD';
  var AM = CAT ? CAT_AM : MOT_JD_AM, AM2 = CAT ? CAT_AM2 : MOT_JD_AM2;
  var OSC = JD ? MOT_JD_GRIS : MOT_NEGRO;                /* antirreflejo, postes, rejillas */
  var cBarra = JD ? MOT_JD_GRIS : AM;                     /* barra de tiro y circulo */
  var cCil = JD ? MOT_JD_GRIS : AM;                       /* camisas de los cilindros */
  var cPost = SK ? AM : OSC;                              /* postes de la cabina */
  var uc = (P.uPP + P.uRip) / 2;
  var X = function(u){ return u - uc; };
  var R = P.R, A = P.A, zW = P.tread / 2;
  var C = P.cab, H = P.capo;
  var uHR = P.uRear - 0.10;                               /* cara trasera del capo */

  /* caja entre dos puntos del plano XY (x ya en coordenadas del modelo) */
  var seg = function(code, a, b, z, ancho, alto, tipo, hex, r){
    var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    return bloque(code, L, alto, ancho, tipo, hex, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z,
      r === undefined ? Math.min(0.03, alto * 0.2, ancho * 0.2) : r, [0, 0, Math.atan2(dy, dx)]);
  };
  /* placa con contorno en planta (x,z) y espesor en Y */
  var placaXZ = function(code, pts, esp, y, tipo, hex){
    var g = geoPerfilB(pts, esp, 0, 0.03);
    g.rotateX(Math.PI / 2);
    return pon(code, g, tipo, hex, 0, y, 0);
  };
  var lineaTubo = function(code, pts, r, tipo, hex){
    for(var i = 1; i < pts.length; i++) tubo(code, pts[i - 1], pts[i], r, tipo, hex, 8);
  };
  /* techo del bastidor delantero: sube de la nariz hasta donde baja el cuello de ganso */
  var frTop = function(u){
    var f = Math.max(0, Math.min(1, (u - 0.30) / (P.uBaja - 0.30)));
    return P.yN + (P.yF - P.yN) * f;
  };
  /* techo del capo */
  var capTop = function(u){
    var f = Math.max(0, Math.min(1, (u - H.u0) / (uHR - 0.22 - H.u0)));
    return H.yT0 + (H.yT1 - H.yT0) * f;
  };

  /* ═══ bastidor delantero: nariz, viga y cuello de ganso hasta la articulacion ═══ */
  var nb = Math.max(P.yN - 1.0, 1.02);                    /* fondo de la nariz */
  bloque('42023615', 0.85, P.yN - nb, 0.56, 'pintura', AM, X(0.025), (P.yN + nb) / 2, 0, 0.06);
  var cuello = [[0.30, P.yN - 0.01], [P.uBaja, P.yF], [C.u0b, C.y - 0.17], [P.uHitch - 0.05, 1.10], [P.uHitch + 0.15, 0.98],
    [P.uHitch + 0.15, 0.62], [P.uHitch - 0.40, 0.62], [C.u0b - 0.20, Math.min(C.y - 0.55, P.yF - P.frH - 0.3)],
    [P.uBaja - 0.40, P.yF - P.frH], [0.30, P.yN - P.frH]];
  perfil('42023615', cuello.map(function(p){ return [X(p[0]), p[1]]; }), P.frW, 0, 'pintura', AM, 0.03);
  /* techo antirreflejo (M y John Deere) o el mismo amarillo (K) */
  var cTecho = SK ? AM2 : OSC;
  seg(null, [X(-0.40), P.yN + 0.02], [X(0.45), P.yN + 0.02], 0, 0.58, 0.04, 'pintura', cTecho, 0.012);
  seg(null, [X(0.30), P.yN + 0.01], [X(P.uBaja), P.yF + 0.015], 0, P.frW + 0.03, 0.035, 'pintura', cTecho, 0.012);
  if(!SK){
    /* el negro antirreflejo baja un poco por los costados de la viga */
    [-1, 1].forEach(function(s){
      seg(null, [X(0.30), P.yN - 0.05], [X(P.uBaja - 0.02), P.yF - 0.05], s * (P.frW / 2 + 0.005), 0.012, 0.11, 'pintura', OSC, 0.004);
    });
  } else {
    /* la serie K lleva a los lados del bastidor la tapa negra de las mangueras */
    [-1, 1].forEach(function(s){
      seg(null, [X(0.75), frTop(0.75) - 0.15], [X(P.uSad - 0.30), frTop(P.uSad - 0.30) - 0.15], s * (P.frW / 2 + 0.012), 0.02, 0.15, 'mate', MOT_NEGRO, 0.005);
    });
  }
  /* nervio inferior del cuello, mas oscuro para que se lea la curva */
  seg(null, [X(P.uBaja - 0.40), P.yF - P.frH], [X(C.u0b - 0.20), Math.min(C.y - 0.55, P.yF - P.frH - 0.3)], 0, P.frW + 0.02, 0.05, 'pintura', AM2, 0.015);

  /* ═══ placa de empuje (contrapeso) adelante ═══ */
  var ppW = JD ? 1.15 : 1.0, ppY0 = JD ? 0.50 : 0.72, ppY1 = JD ? 1.72 : 1.62;
  bloque(null, 0.22, ppY1 - ppY0, ppW, 'pintura', AM, X(P.uPP + 0.11), (ppY0 + ppY1) / 2, 0, 0.04);
  bloque(null, 0.05, ppY1 - ppY0 - 0.12, ppW - 0.14, 'pintura', AM2, X(P.uPP + 0.24), (ppY0 + ppY1) / 2, 0, 0.015);
  [-0.30, 0.30].forEach(function(z){
    bloque(null, -0.40 - (P.uPP + 0.22) + 0.04, 0.50, 0.08, 'pintura', AM, X((P.uPP + 0.22 - 0.40) / 2), nb + 0.30, z, 0.02);
  });
  /* pernos de la placa en dos columnas, como en la foto del 620G */
  var nPp = JD ? 6 : 3, gPp = new THREE.CylinderGeometry(0.028, 0.028, 0.05, 6);
  var iPp = new THREE.InstancedMesh(gPp, D.M.metal('#6A6E73'), nPp * 2), dm = new THREE.Object3D(), k = 0;
  [-1, 1].forEach(function(s){
    for(var i = 0; i < nPp; i++){
      dm.position.set(X(P.uPP) - 0.01, ppY0 + 0.15 + i * (ppY1 - ppY0 - 0.30) / (nPp - 1), s * (ppW / 2 - 0.10));
      dm.rotation.set(0, 0, Math.PI / 2); dm.updateMatrix(); iPp.setMatrixAt(k++, dm.matrix);
    }
  });
  G.add(iPp);
  /* gancho de remolque */
  pon(null, new THREE.TorusGeometry(0.07, 0.022, 8, 16), 'metal', MOT_ACERO, X(P.uPP) - 0.04, ppY0 + 0.10, 0, [Math.PI / 2, 0, 0]);

  /* ═══ eje delantero: viga, pedestal, munones, barra de inclinacion y direccion ═══ */
  var kz = zW - A / 2 - 0.07;
  bloque(null, 0.26, 0.22, 2 * kz, 'pintura', AM, X(0), R + 0.10, 0, 0.04);
  if(nb - (R + 0.21) > 0.02) bloque('PYB', 0.30, nb - (R + 0.21) + 0.02, 0.34, 'pintura', AM2, X(-0.05), (nb + R + 0.21) / 2, 0, 0.03);
  [-1, 1].forEach(function(s){
    cilindro(null, 0.075, 0.075, 0.52, 'metal', MOT_ACERO, X(0), R + 0.08, s * kz, null, 14);
    cilindro(s > 0 ? 'BMLH' : 'BMRH', 0.17, 0.17, 0.12, 'metal', MOT_GRIS, X(0), R, s * (zW - A / 2 - 0.02), [Math.PI / 2, 0, 0], 20);
    /* brazos de la direccion y cilindros de direccion */
    seg(null, [X(0), R + 0.02], [X(0.30), R + 0.02], s * (kz - 0.05), 0.06, 0.08, 'pintura', AM2);
    D.cilHidD(s > 0 ? 'SLH' : 'SRH', [X(0.16), R + 0.05, s * 0.32], [X(0.30), R + 0.03, s * (kz - 0.08)], 0.045, cCil, 0.55);
  });
  /* barra de inclinacion arriba y barra de acople atras */
  tubo(null, [X(0.20), R + 0.33, -kz], [X(0.20), R + 0.33, kz], 0.045, 'pintura', AM2, 14);
  [-1, 1].forEach(function(s){ tubo(null, [X(0), R + 0.30, s * kz], [X(0.20), R + 0.33, s * kz], 0.04, 'pintura', AM2, 10); });
  tubo(null, [X(0.30), R - 0.02, -kz + 0.08], [X(0.30), R - 0.02, kz - 0.08], 0.035, 'metal', MOT_ACERO, 12);
  D.cilHidD('PHY', [X(0.10), R + 0.22, -0.12], [X(0.20), R + 0.33, 0.55], 0.05, cCil, 0.5);

  /* ═══ silla, barra de tiro, circulo y vertedera ═══ */
  var ySad = frTop(P.uSad);
  bloque('42023615', 0.50, 0.26, 1.10, 'pintura', AM, X(P.uSad), ySad - 0.02, 0, 0.05);
  [-1, 1].forEach(function(s){
    /* brazos de levante de la silla con el munon del cilindro */
    bloque(null, 0.34, 0.50, 0.10, 'pintura', AM, X(P.uSad), ySad + 0.16, s * 0.60, 0.04);
    cilindro('PYB', 0.09, 0.09, 0.30, 'metal', MOT_ACERO, X(P.uSad), ySad + 0.30, s * 0.66, [Math.PI / 2, 0, 0], 14);
  });
  /* barra de tiro en A, con la rotula adelante */
  var uC = P.hoja - 0.15, rC = P.dC / 2, yBar = 0.92;
  var barra = [[0.35, -0.16], [uC - rC - 0.15, -0.55], [uC - 0.25, -(rC + 0.08)], [uC + 0.28, -(rC + 0.04)],
               [uC + 0.28, rC + 0.04], [uC - 0.25, rC + 0.08], [uC - rC - 0.15, 0.55], [0.35, 0.16]];
  placaXZ('42023615', barra.map(function(p){ return [X(p[0]), p[1]]; }), 0.15, yBar, 'pintura', cBarra);
  bloque(null, uC - 0.35, 0.05, 0.12, 'pintura', JD ? '#2A2D31' : AM2, X((0.35 + uC) / 2 - 0.1), yBar + 0.10, 0, 0.015);
  pon('PYB', new THREE.SphereGeometry(0.11, 16, 12), 'metal', MOT_ACERO, X(0.35), (yBar + nb) / 2, 0);
  /* mando del circulo: caja de engranajes y motor hidraulico */
  cilindro(null, 0.15, 0.15, 0.30, 'pintura', cBarra, X(uC - rC + 0.05), yBar + 0.22, 0.30, null, 20);
  cilindro(null, 0.09, 0.09, 0.16, 'metal', MOT_GRIS, X(uC - rC + 0.05), yBar + 0.45, 0.30, null, 14);
  /* cilindros de levante, casi verticales, y el de desplazamiento lateral del circulo */
  [-1, 1].forEach(function(s){
    D.cilHidD('PHY', [X(P.uSad), P.hCil - 0.07, s * 0.66], [X(uC + 0.05), yBar + 0.08, s * (rC - 0.02)], 0.065, cCil, 0.62);
    cilindro(null, 0.05, 0.05, 0.14, 'metal', MOT_ACERO, X(P.uSad), P.hCil - 0.07, s * 0.66, [Math.PI / 2, 0, 0], 10);
  });
  D.cilHidD('PHY', [X(P.uSad + 0.10), ySad + 0.05, -0.55], [X(uC - 0.30), yBar + 0.08, rC - 0.05], 0.05, cCil, 0.55);
  /* barra de enlace de la silla al lado izquierdo de la barra de tiro */
  seg(null, [X(P.uSad - 0.05), ySad - 0.10], [X(uC - 0.45), yBar + 0.10], -(rC - 0.10), 0.06, 0.10, 'pintura', AM2);

  /* lo que gira con el circulo se arma en coordenadas locales y despues se cuelga del grupo */
  var n0 = G.children.length;
  var f = P.mH / 0.61, yE = 0.03, mL = P.mL;
  /* corona del circulo con dientes por dentro */
  pon(null, new THREE.TorusGeometry(rC, 0.06, 10, 56), 'pintura', cBarra, 0, 0.76, 0, [Math.PI / 2, 0, 0]);
  var nD = 64, gD = new THREE.BoxGeometry(0.06, 0.07, 0.05);
  var iD = new THREE.InstancedMesh(gD, D.M.metal('#3E4248'), nD);
  for(var d = 0; d < nD; d++){
    var a = d / nD * Math.PI * 2;
    dm.position.set(Math.cos(a) * (rC - 0.07), 0.76, Math.sin(a) * (rC - 0.07));
    dm.rotation.set(0, -a, 0); dm.updateMatrix(); iD.setMatrixAt(d, dm.matrix);
  }
  G.add(iD);
  /* brazos que bajan del circulo a la vertedera */
  [-1, 1].forEach(function(s){
    seg(null, [-0.10, 0.74], [0.37, yE + 0.42 * f], s * 0.55, 0.12, 0.16, 'pintura', cBarra);
    bloque(null, 0.16, 0.30, 0.14, 'pintura', cBarra, 0.37, yE + 0.38 * f, s * 0.55, 0.03);
  });
  /* vertedera curva (concava hacia adelante) */
  var vf = [[0.12, yE], [0.19, yE + 0.12 * f], [0.235, yE + 0.27 * f], [0.235, yE + 0.42 * f], [0.19, yE + 0.54 * f], [0.12, yE + P.mH]];
  var vb = vf.slice().reverse().map(function(p){ return [p[0] + 0.035, p[1]]; });
  perfil('LPN', vf.concat(vb), mL, 0, 'pintura', AM, 0.01);
  /* rieles traseros, tapas de los extremos y labio superior */
  [0.20, 0.45].forEach(function(h){ bloque('LPN', 0.06, 0.10, mL * 0.94, 'pintura', AM2, 0.30, yE + h * f, 0, 0.02); });
  [-1, 1].forEach(function(s){
    perfil('LPN', [[0.12, yE + 0.03], [0.36, yE + 0.10 * f], [0.36, yE + 0.56 * f], [0.14, yE + P.mH - 0.02]], 0.03, s * (mL / 2 - 0.015), 'pintura', AM, 0.008);
  });
  /* cuchillas (GET) con sus pernos y cantoneras en las puntas */
  bloque('GET', 0.03, 0.152, mL - 0.34, 'metal', '#43474D', 0.112, yE + 0.076, 0, 0.008);
  var nPc = Math.round((mL - 0.40) / 0.16), gPc = new THREE.CylinderGeometry(0.018, 0.018, 0.03, 6);
  var iPc = new THREE.InstancedMesh(gPc, D.M.metal('#2A2D31'), nPc);
  for(var b = 0; b < nPc; b++){
    dm.position.set(0.095, yE + 0.09, -(mL - 0.40) / 2 + b * (mL - 0.40) / (nPc - 1));
    dm.rotation.set(0, 0, Math.PI / 2); dm.updateMatrix(); iPc.setMatrixAt(b, dm.matrix);
  }
  G.add(iPc);
  [-1, 1].forEach(function(s){ bloque('GET', 0.04, 0.17, 0.16, 'metal', '#34383D', 0.11, yE + 0.085, s * (mL / 2 - 0.08), 0.01); });
  /* cilindro de desplazamiento de la hoja y cilindro de inclinacion (tip) */
  D.cilHidD('PHY', [0.40, yE + 0.56 * f, -0.95], [0.40, yE + 0.56 * f, 0.75], 0.05, cCil, 0.5);
  D.cilHidD('PHY', [-0.05, 0.80, 0.30], [0.36, yE + 0.50 * f, 0.30], 0.045, cCil, 0.5);
  var circ = new THREE.Group();
  G.children.slice(n0).forEach(function(m){ G.remove(m); circ.add(m); });
  circ.position.set(X(uC), 0, 0);
  circ.rotation.y = 0.45;                                 /* hoja en angulo, la punta derecha adelante */
  G.add(circ);

  /* ═══ articulacion y bastidor trasero ═══ */
  [1.06, 0.55].forEach(function(y){ bloque('42023615', 0.50, 0.12, 0.56, 'pintura', AM, X(P.uHitch + 0.10), y, 0, 0.03); });
  cilindro('PYB', 0.09, 0.09, 0.66, 'metal', MOT_ACERO, X(P.uHitch + 0.05), 0.80, 0, null, 16);
  [-1, 1].forEach(function(s){
    bloque('42023615', P.uRear - 0.25 - (P.uHitch + 0.30), 0.34, 0.14, 'pintura', AM, X((P.uHitch + 0.30 + P.uRear - 0.25) / 2), 0.95, s * 0.40, 0.03);
    D.cilHidD('PHY', [X(P.uHitch + 0.85), 0.98, s * 0.48], [X(P.uHitch - 0.30), 0.86, s * (P.frW / 2 + 0.05)], 0.05, cCil, 0.55);
  });
  bloque('42023615', 0.30, 0.34, 0.66, 'pintura', AM, X(P.uHitch + 0.40), 0.95, 0, 0.03);

  /* ═══ tandems, puente y transmision ═══ */
  var zT = zW - A / 2 - 0.13;
  [-1, 1].forEach(function(s){
    bloque(s > 0 ? 'MLH' : 'MRH', P.tand + 0.62, 0.52, 0.20, 'pintura', AM, X(P.wb), R, s * zT, 0.14);
    bloque(null, P.tand + 0.40, 0.06, 0.21, 'pintura', AM2, X(P.wb), R + 0.20, s * zT, 0.02);
    cilindro(null, 0.30, 0.30, 0.10, 'pintura', AM2, X(P.wb), R, s * (zT - 0.13), [Math.PI / 2, 0, 0], 28);
    cilindro(null, 0.12, 0.12, 0.05, 'metal', MOT_ACERO, X(P.wb), R + 0.15, s * (zT + 0.11), [Math.PI / 2, 0, 0], 12);
  });
  cilindro(null, 0.20, 0.20, 2 * zT - 0.30, 'pintura', AM, X(P.wb), R, 0, [Math.PI / 2, 0, 0], 22);
  pon('DIFP', new THREE.SphereGeometry(0.34, 24, 16), 'pintura', AM, X(P.wb), R + 0.02, 0);
  bloque('TRM', 0.95, 0.52, 0.58, 'metal', MOT_GRIS, X(P.wb - 0.85), R + 0.28, 0, 0.05);
  bloque('FDP', 0.20, 0.30, 0.30, 'metal', MOT_GRIS2, X(P.wb - 1.40), R + 0.30, 0, 0.03);

  /* ═══ cabina ═══ */
  var roofB = P.hCab - 0.24, yb = C.y + (SM ? 0.10 : SK ? 0.20 : 0.15), yt = roofB - 0.04;
  var uf = function(y){ return C.u0b + (C.u0 - C.u0b) * (y - C.y) / (roofB - C.y); };
  var ur = function(y){ return C.u1b + (C.u1 - C.u1b) * (y - C.y) / (roofB - C.y); };
  var w2 = C.w / 2;
  /* piso, base bajo la mitad trasera y panel bajo los vidrios */
  bloque('CBN', C.u1b - C.u0b + 0.06, 0.14, C.w + 0.04, 'pintura', OSC, X((C.u0b + C.u1b) / 2), C.y - 0.07, 0, 0.03);
  bloque(null, C.u1b - (P.uHitch + 0.25), C.y - 0.14 - 1.12, C.w * 0.8, 'pintura', OSC, X((P.uHitch + 0.25 + C.u1b) / 2), (C.y - 0.14 + 1.12) / 2, 0, 0.03);
  if(yb - C.y > 0.12) bloque('CBN', C.u1b - C.u0b, yb - C.y, C.w, 'pintura', SK ? AM : OSC, X((C.u0b + C.u1b) / 2), (C.y + yb) / 2, 0, 0.03);
  /* postes del ROPS y el de la puerta */
  [-1, 1].forEach(function(s){
    var z = s * (w2 - 0.045);
    seg('CBN', [X(C.u0b), C.y], [X(C.u0), roofB], z, 0.09, 0.09, 'pintura', cPost);
    seg('CBN', [X(C.u1b), C.y], [X(C.u1), roofB], z, 0.09, 0.09, 'pintura', cPost);
    seg('CBN', [X(C.u0b + 0.95), C.y], [X(C.u0 + 0.95), roofB], z, 0.07, 0.07, 'pintura', cPost);
    /* marco de la puerta abajo y arriba */
    seg(null, [X(C.u0b), yb], [X(C.u1b), yb], z, 0.08, 0.05, 'pintura', cPost, 0.01);
    /* vidrios laterales */
    perfil(null, [[X(uf(yb)) + 0.04, yb + 0.02], [X(ur(yb)) - 0.04, yb + 0.02], [X(ur(yt)) - 0.04, yt], [X(uf(yt)) + 0.04, yt]],
      0.025, s * (w2 - 0.04), 'vidrio', '#1A2A3A', 0.006);
    /* manija, bisagras y asidero de la puerta */
    bloque(null, 0.16, 0.035, 0.04, 'cromo', null, X(C.u0b + 0.82), yb + 0.45, s * (w2 + 0.01), 0.01);
    [yb + 0.25, roofB - 0.30].forEach(function(y){ bloque(null, 0.05, 0.10, 0.04, 'mate', '#202327', X(uf(y) + 0.06), y, s * (w2 + 0.01), 0.01); });
    tubo(null, [X(C.u0b + 1.05), C.y + 0.05, s * (w2 + 0.07)], [X(C.u0 + 1.05), roofB - 0.25, s * (w2 + 0.07)], 0.02, 'pintura', JD ? MOT_JD_AM : (SK ? MOT_NEGRO : AM), 10);
    [C.y + 0.05, roofB - 0.25].forEach(function(y){
      tubo(null, [X(uf(y) + 1.05), y, s * (w2 + 0.07)], [X(uf(y) + 1.05), y, s * w2], 0.018, 'pintura', JD ? MOT_JD_AM : (SK ? MOT_NEGRO : AM), 8);
    });
  });
  /* parabrisas y vidrio trasero */
  seg(null, [X(uf(yb)) + 0.02, yb], [X(uf(yt)) + 0.02, yt], 0, C.w - 0.10, 0.025, 'vidrio', '#1A2A3A', 0.006);
  seg(null, [X(ur(yb)) - 0.02, yb], [X(ur(yt)) - 0.02, yt], 0, C.w - 0.10, 0.025, 'vidrio', '#1A2A3A', 0.006);
  /* travesano bajo el parabrisas (la serie M lleva vidrio casi hasta el piso) */
  seg('CBN', [X(uf(yb)), yb], [X(uf(yb)) + 0.001, yb + 0.06], 0, C.w, 0.08, 'pintura', cPost, 0.01);
  /* limpiaparabrisas */
  tubo(null, [X(uf(yb + 0.45)) - 0.03, yb + 0.45, -0.25], [X(uf(yb + 1.0)) - 0.03, yb + 1.0, 0.20], 0.010, 'mate', '#111', 6);
  /* techo: amarillo con alero y la base oscura; aire acondicionado al centro */
  bloque('CBN', C.u1 - C.u0 + 0.22, 0.14, C.w + 0.16, 'pintura', AM, X((C.u0 + C.u1) / 2), roofB + 0.07, 0, 0.05);
  bloque(null, C.u1 - C.u0 + 0.10, 0.04, C.w + 0.04, 'pintura', OSC, X((C.u0 + C.u1) / 2), roofB - 0.01, 0, 0.015);
  bloque('AAC', (C.u1 - C.u0) * 0.55, 0.10, C.w * 0.62, 'pintura', SM ? AM : MOT_GRIS, X((C.u0 + C.u1) / 2 + 0.10), P.hCab - 0.05, 0, 0.04);
  if(SK){
    /* visera CATERPILLAR de la serie K */
    bloque(null, 0.10, 0.18, C.w + 0.10, 'pintura', AM, X(C.u0) - 0.07, roofB - 0.04, 0, 0.02);
    letrero(texRotulo3d(rotuloTexto('CATERPILLAR', CAT_AM, '#16181B', 0.95), 512, 72), 1.10, 0.15, X(C.u0) - 0.125, roofB - 0.04, 0, -Math.PI / 2);
  }
  /* luces de techo: delanteras de camino y traseras de trabajo */
  [-1, 1].forEach(function(s){
    var z = s * (w2 - 0.18);
    bloque(null, 0.12, 0.13, 0.20, 'mate', '#202327', X(C.u0) - 0.06, roofB - 0.08, z, 0.02);
    bloque(s > 0 ? 'FDI' : 'FDD', 0.03, 0.09, 0.16, 'vidrio', '#F4EDCF', X(C.u0) - 0.125, roofB - 0.08, z, 0.01);
    bloque(null, 0.12, 0.13, 0.20, 'mate', '#202327', X(C.u1) + 0.06, roofB - 0.08, z, 0.02);
    bloque('LSM', 0.03, 0.09, 0.16, 'vidrio', '#F4EDCF', X(C.u1) + 0.125, roofB - 0.08, z, 0.01);
    /* espejos en brazos desde el poste delantero */
    var pA = [X(C.u0) + 0.02, roofB - 0.30, s * (w2 + 0.02)], pB = [X(C.u0) - 0.12, roofB - 0.42, s * (w2 + 0.34)];
    tubo(null, pA, pB, 0.02, 'mate', '#202327', 8);
    bloque(null, 0.07, 0.34, 0.20, 'mate', '#16181B', pB[0], pB[1] - 0.10, pB[2], 0.03);
    bloque(null, 0.015, 0.30, 0.16, 'cromo', null, pB[0] + 0.04, pB[1] - 0.10, pB[2], 0.004);
  });
  /* baliza (circulina) y antena de radio */
  cilindro(null, 0.09, 0.10, 0.06, 'mate', '#202327', X(C.u1 - 0.25), P.hCab + 0.03, w2 - 0.25, null, 18);
  pon('CIR', new THREE.SphereGeometry(0.085, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), 'vidrio', '#F0A41C', X(C.u1 - 0.25), P.hCab + 0.06, w2 - 0.25);
  tubo(null, [X(C.u1 - 0.30), P.hCab, -(w2 - 0.25)], [X(C.u1 - 0.30), P.hCab + 0.55, -(w2 - 0.25)], 0.006, 'mate', '#111', 6);
  /* adentro: asiento, consola y mandos (la serie M va con palancas, sin volante) */
  bloque(null, 0.50, 0.14, 0.52, 'mate', '#2A2D31', X(ur(C.y + 0.5) - 0.55), C.y + 0.50, 0, 0.05);
  bloque(null, 0.14, 0.62, 0.50, 'mate', '#2A2D31', X(ur(C.y + 0.8) - 0.30), C.y + 0.85, 0, 0.05);
  bloque(null, 0.24, 0.62, 0.32, 'mate', '#22252A', X(uf(C.y + 0.3) + 0.25), C.y + 0.31, 0, 0.04);
  if(SM){
    [-1, 1].forEach(function(s){
      bloque(null, 0.34, 0.10, 0.12, 'mate', '#22252A', X(ur(C.y + 0.6) - 0.62), C.y + 0.70, s * 0.33, 0.03);
      tubo(null, [X(ur(C.y + 0.6) - 0.74), C.y + 0.75, s * 0.33], [X(ur(C.y + 0.6) - 0.76), C.y + 0.92, s * 0.33], 0.02, 'mate', '#111', 8);
    });
  } else {
    pon(null, new THREE.TorusGeometry(0.17, 0.018, 8, 28), 'mate', '#16181B', X(uf(C.y + 0.8) + 0.42), C.y + 0.82, 0, [0, Math.PI / 2, -0.6]);
  }
  /* escaleras bajo las puertas, a los dos lados */
  var cEsc = SK ? AM : OSC;
  [-1, 1].forEach(function(s){
    var ue = C.u0b + 0.32, z = s * (w2 - 0.02), y0 = 0.36, y1 = C.y - 0.14;
    [-1, 1].forEach(function(t){ bloque(null, 0.05, y1 - y0, 0.05, 'pintura', cEsc, X(ue + t * 0.18), (y0 + y1) / 2, z, 0.012); });
    var nE = Math.max(2, Math.round((y1 - y0) / 0.28));
    for(var i = 0; i < nE; i++) bloque(null, 0.36, 0.035, 0.16, 'metal', MOT_ACERO, X(ue), y0 + 0.05 + i * (y1 - y0 - 0.05) / nE, z, 0.008);
    /* soporte de la escalera al piso de la cabina */
    bloque(null, 0.06, 0.06, w2 - 0.25, 'pintura', cEsc, X(ue), y1 + 0.03, s * (w2 + 0.25) / 2, 0.01);
  });

  /* ═══ valvulas, mangueras y engrase centralizado ═══ */
  bloque('VV1', 0.30, 0.20, 0.25, 'metal', MOT_GRIS2, X(C.u0b + 0.40), C.y - 0.27, 0.38, 0.03);
  [-1, 1].forEach(function(s){
    [0.0, 0.05, 0.10].forEach(function(dy, j){
      var z = s * (P.frW / 2 + 0.03 + j * 0.035);
      lineaTubo('LPH', [[X(C.u0b + 0.30), C.y - 0.30, s * 0.30], [X(C.u0b - 0.05), C.y - 0.20, z], [X(P.uBaja - 0.05), P.yF - 0.12 - dy, z],
        [X(P.uSad + 0.30), frTop(P.uSad + 0.30) - 0.12 - dy, z]], 0.018, 'goma', '#22262B');
    });
  });
  /* bomba de engrase (a la izquierda bajo la cabina) con su deposito y las lineas a los pasadores */
  var uS = C.u1b - 0.30;
  bloque(null, 0.15, 0.10, 0.16, 'pintura', OSC, X(uS), 0.98, 0.55, 0.02);
  bloque('SEN', 0.24, 0.24, 0.18, 'mate', '#1E2124', X(uS), 0.90, 0.70, 0.03);
  cilindro('SEN', 0.075, 0.075, 0.22, 'vidrio', '#D8DDE0', X(uS), 1.13, 0.70, null, 18);
  cilindro(null, 0.08, 0.08, 0.03, 'mate', '#1E2124', X(uS), 1.255, 0.70, null, 18);
  lineaTubo('SEN', [[X(uS - 0.10), 0.85, 0.70], [X(P.uHitch + 0.20), 0.85, 0.45], [X(P.uHitch - 0.30), 0.90, P.frW / 2 + 0.02],
    [X(C.u0b - 0.10), C.y - 0.30, P.frW / 2 + 0.02], [X(P.uBaja - 0.10), P.yF - P.frH + 0.06, P.frW / 2 + 0.02],
    [X(P.uSad), ySad - 0.15, P.frW / 2 + 0.02], [X(0.40), P.yN - P.frH + 0.05, P.frW / 2 + 0.02], [X(0.05), R + 0.30, kz - 0.05]], 0.012, 'goma', '#1C1E21');
  lineaTubo('SEN', [[X(uS - 0.05), 0.82, 0.70], [X(P.wb), R + 0.30, zT - 0.05]], 0.012, 'goma', '#1C1E21');
  /* baterias a la izquierda y tanque hidraulico a la derecha */
  bloque(null, 0.15, 0.10, 0.16, 'pintura', OSC, X(P.uHitch + 0.70), 0.98, 0.55, 0.02);
  bloque('BAT', 0.42, 0.30, 0.20, 'pintura', OSC, X(P.uHitch + 0.70), 0.92, 0.70, 0.03);
  bloque(null, 0.38, 0.03, 0.22, 'mate', MOT_GRIS, X(P.uHitch + 0.70), 1.085, 0.70, 0.01);
  bloque(null, 0.15, 0.10, 0.16, 'pintura', OSC, X(C.u1b - 0.55), 0.98, -0.55, 0.02);
  bloque('TQH1', 0.62, 0.36, 0.22, 'pintura', AM, X(C.u1b - 0.55), 0.92, -0.70, 0.05);
  cilindro(null, 0.05, 0.05, 0.02, 'vidrio', '#9BB7C9', X(C.u1b - 0.40), 0.95, -0.815, [Math.PI / 2, 0, 0], 14);

  /* ═══ capo del motor ═══ */
  var hw2 = H.w / 2;
  if(SK){
    bloque(null, uHR - H.u0, H.yT0 - H.yB, H.w, 'pintura', AM, X((H.u0 + uHR) / 2), (H.yT0 + H.yB) / 2, 0, 0.07);
  } else {
    perfil(null, [[X(H.u0), H.yB], [X(uHR), H.yB], [X(uHR), H.yT1 - 0.28], [X(uHR) - 0.06, H.yT1 - 0.09], [X(uHR) - 0.22, H.yT1], [X(H.u0), H.yT0]],
      H.w, 0, 'pintura', AM, 0.05);
  }
  if(JD){
    /* John Deere: techo y esquinas gris oscuro */
    seg(null, [X(H.u0), H.yT0 + 0.02], [X(uHR) - 0.20, H.yT1 + 0.02], 0, H.w + 0.05, 0.06, 'pintura', OSC, 0.02);
    [H.u0 + 0.07, uHR - 0.07].forEach(function(u){ bloque(null, 0.14, capTop(u) - H.yB, H.w + 0.05, 'pintura', OSC, X(u), (capTop(u) + H.yB) / 2, 0, 0.03); });
  }
  /* bastidor bajo el capo y tanque de combustible atras, sobre el parachoques */
  bloque('TQC1', 0.62, H.yB - 0.55, H.w - 0.10, 'pintura', AM, X(P.uRear - 0.55), (H.yB + 0.55) / 2, 0, 0.04);
  cilindro(null, 0.07, 0.07, 0.06, 'mate', MOT_NEGRO, X(P.uRear - 0.70), (H.yB + 0.55) / 2 + 0.10, hw2 - 0.04, [Math.PI / 2, 0, 0], 14);
  bloque('42023615', 0.25, 0.62, H.w + 0.30, 'pintura', JD ? OSC : AM, X(P.uRear - 0.125), 0.80, 0, 0.04);
  /* puertas del motor (ENG1) con chapa perforada o persianas, y las juntas */
  var lH = uHR - H.u0;
  var texPanel = texRotulo3d(SM ? motRejilla(AM, '#2A2416') : motPersiana(AM, '#1E1F22'), 256, 256);
  [-1, 1].forEach(function(s){
    var z = s * (hw2 + 0.012);
    var ua = H.u0 + lH * 0.38, ub = H.u0 + lH * 0.80, yTop = Math.min(capTop(ua), capTop(ub)) - 0.20;
    bloque('ENG1', ub - ua, yTop - (H.yB + 0.10), 0.025, 'pintura', AM, X((ua + ub) / 2), (yTop + H.yB + 0.10) / 2, z, 0.01);
    letrero(texPanel, (ub - ua) * 0.60, (yTop - H.yB - 0.10) * 0.70, X(ua + (ub - ua) * 0.38), (yTop + H.yB + 0.10) / 2, s * (hw2 + 0.027), s > 0 ? 0 : Math.PI);
    [ua, ub, H.u0 + lH * 0.24].forEach(function(u){
      bloque(null, 0.012, capTop(u) - H.yB - 0.14, 0.012, 'mate', '#2A2416', X(u), (capTop(u) + H.yB) / 2 - 0.04, s * (hw2 + 0.026), 0.003);
    });
    /* manijas de las puertas */
    bloque(null, 0.03, 0.12, 0.03, 'cromo', null, X(ub - 0.08), H.yB + 0.55, s * (hw2 + 0.04), 0.008);
  });
  /* rotulos del capo */
  if(CAT){
    var texCat = texRotulo3d(motRotCAT, 512, 200);
    [-1, 1].forEach(function(s){
      letrero(texCat, 0.92, 0.36, X(H.u0 + lH * 0.17), capTop(H.u0 + 0.5) - 0.36, s * (hw2 + 0.014), s > 0 ? 0 : Math.PI);
    });
  } else {
    var texCiervo = texRotulo3d(motRotDeere(MOT_JD_AM), 200, 240);
    var texMod = texRotulo3d(rotuloTexto(P.modelo, OSC, '#FFFFFF', 1), 256, 80);
    [-1, 1].forEach(function(s){
      letrero(texCiervo, 0.42, 0.50, X(H.u0 + lH * 0.20), (H.yB + capTop(H.u0 + 0.5)) / 2 + 0.12, s * (hw2 + 0.014), s > 0 ? 0 : Math.PI);
      bloque(null, 0.52, 0.16, 0.02, 'pintura', OSC, X(H.u0 + 0.40), capTop(H.u0 + 0.40) - 0.12, s * (hw2 + 0.02), 0.005);
      letrero(texMod, 0.44, 0.14, X(H.u0 + 0.40), capTop(H.u0 + 0.40) - 0.12, s * (hw2 + 0.032), s > 0 ? 0 : Math.PI);
    });
  }
  /* parrilla trasera del radiador, rotulo y luces traseras */
  D.lamas('RAD1', X(uHR), H.yB + 0.10, capTop(uHR) - 0.46, -(hw2 - 0.14), hw2 - 0.14, 10, OSC, 1);
  bloque(null, 0.04, 0.22, H.w - 0.30, 'mate', '#16181B', X(uHR) + 0.03, capTop(uHR) - 0.33, 0, 0.01);
  letrero(texRotulo3d(rotuloTexto(CAT ? 'CATERPILLAR' : 'JOHN DEERE', '#16181B', CAT ? '#FFFFFF' : MOT_JD_AM, 0.92), 512, 80),
    0.88, 0.14, X(uHR) + 0.052, capTop(uHR) - 0.33, 0, Math.PI / 2);
  [-1, 1].forEach(function(s){
    var z = s * (hw2 - 0.08);
    bloque(null, 0.08, 0.30, 0.13, 'mate', '#202327', X(uHR) + 0.04, capTop(uHR) - 0.33, z, 0.02);
    bloque(s > 0 ? 'FPI' : 'FPD', 0.03, 0.12, 0.10, 'vidrio', '#C2241B', X(uHR) + 0.085, capTop(uHR) - 0.27, z, 0.01);
    bloque('LSM', 0.03, 0.10, 0.10, 'vidrio', '#F2A31A', X(uHR) + 0.085, capTop(uHR) - 0.40, z, 0.01);
  });
  /* escape y prefiltro sobre el capo */
  var zEx = CAT ? -0.25 : 0.30, yEx0 = capTop(P.uEx);
  cilindro(null, 0.12, 0.13, 0.06, 'mate', MOT_NEGRO, X(P.uEx), yEx0 + 0.02, zEx, null, 18);
  cilindro(null, 0.07, 0.07, P.hEx - yEx0 - 0.14, 'metal', '#2F3338', X(P.uEx), (yEx0 + P.hEx - 0.14) / 2, zEx, null, 16);
  tubo(null, [X(P.uEx), P.hEx - 0.15, zEx], [X(P.uEx) + 0.07, P.hEx, zEx], 0.07, 'metal', '#2F3338', 16);
  var yPre = capTop(P.uPre);
  if(SM){
    bloque(null, 0.42, 0.20, 0.55, 'mate', MOT_GRIS, X(P.uPre), yPre + 0.09, 0.28, 0.05);
    D.lamas(null, X(P.uPre) - 0.21, yPre + 0.03, yPre + 0.16, 0.06, 0.50, 3, '#202327', -1);
  } else {
    cilindro(null, 0.06, 0.06, 0.22, 'mate', MOT_NEGRO, X(P.uPre), yPre + 0.11, 0.30, null, 14);
    cilindro(null, 0.15, 0.13, 0.10, 'mate', MOT_NEGRO, X(P.uPre), yPre + 0.26, 0.30, null, 20);
    cilindro(null, 0.16, 0.16, 0.03, 'mate', MOT_NEGRO, X(P.uPre), yPre + 0.325, 0.30, null, 20);
  }
  /* pasamanos sobre el capo (K y John Deere) */
  if(!SM){
    [-1, 1].forEach(function(s){
      var z = s * (hw2 - 0.10), ua = H.u0 + 0.25, ub = H.u0 + 1.50;
      [ua, (ua + ub) / 2, ub].forEach(function(u){ tubo(null, [X(u), capTop(u), z], [X(u), capTop(u) + 0.20, z], 0.02, 'pintura', JD ? MOT_JD_AM : AM, 8); });
      tubo(null, [X(ua), capTop(ua) + 0.20, z], [X(ub), capTop(ub) + 0.20, z], 0.02, 'pintura', JD ? MOT_JD_AM : AM, 8);
    });
  }

  /* ═══ rotulos del bastidor delantero ═══ */
  if(CAT){
    var texM = texRotulo3d(SM ? rotuloTexto(P.modelo, '#16181B', '#FFFFFF', 1) : rotuloTexto(P.modelo, CAT_AM, '#16181B', 1), 256, 96);
    [-1, 1].forEach(function(s){
      var u = P.uSad + 0.75;
      letrero(texM, 0.44, 0.165, X(u), frTop(u) - 0.13, s * (P.frW / 2 + 0.012), s > 0 ? 0 : Math.PI);
    });
  } else {
    var texD = texRotulo3d(rotuloTexto('DEERE', '#16181B', '#FFFFFF', 0.95), 384, 96);
    [-1, 1].forEach(function(s){
      letrero(texD, 0.86, 0.22, X(1.10), frTop(1.10) - 0.17, s * (P.frW / 2 + 0.012), s > 0 ? 0 : Math.PI);
    });
  }
  /* luces de la nariz (John Deere) y faros de trabajo del bastidor */
  [-1, 1].forEach(function(s){
    if(JD){
      bloque(null, 0.12, 0.14, 0.14, 'mate', '#202327', X(0.10), P.yN + 0.10, s * 0.20, 0.02);
      bloque(s > 0 ? 'FDI' : 'FDD', 0.03, 0.10, 0.10, 'vidrio', '#F4EDCF', X(0.10) - 0.075, P.yN + 0.10, s * 0.20, 0.01);
      bloque('LSM', 0.08, 0.06, 0.10, 'vidrio', '#F06A1A', X(0.40), P.yN + 0.06, s * 0.20, 0.01);
    } else {
      bloque(null, 0.10, 0.12, 0.12, 'mate', '#202327', X(-0.30), P.yN + 0.08, s * 0.20, 0.02);
      bloque('LSM', 0.03, 0.08, 0.09, 'vidrio', '#F2A31A', X(-0.30) - 0.065, P.yN + 0.08, s * 0.20, 0.01);
    }
  });

  /* ═══ ripper trasero (y escarificador en el 620P) ═══ */
  var x0 = X(P.uRip), zR = 0.45;
  [-1, 1].forEach(function(s){
    bloque(null, 0.14, 0.62, 0.10, 'pintura', JD ? OSC : AM, X(P.uRear) + 0.07, 0.82, s * zR, 0.02);
    seg(null, [X(P.uRear) + 0.08, 0.62], [x0 - 0.28, 0.52], s * zR, 0.09, 0.13, 'pintura', JD ? OSC : AM);
    seg(null, [X(P.uRear) + 0.08, 1.04], [x0 - 0.28, 0.90], s * zR, 0.09, 0.13, 'pintura', JD ? OSC : AM);
    bloque(null, 0.20, 0.52, 0.06, 'pintura', JD ? OSC : AM, x0 - 0.28, 0.71, s * zR, 0.02);
    bloque(null, 0.12, 0.26, 0.10, 'pintura', JD ? OSC : AM, X(P.uRear) + 0.06, 1.24, s * 0.22, 0.02);
    D.cilHidD('PHY', [X(P.uRear) + 0.08, 1.30, s * 0.22], [x0 - 0.30, 0.86, s * 0.22], 0.05, cCil, 0.55);
  });
  bloque(null, 0.26, 0.30, 2.20, 'pintura', JD ? OSC : AM, x0 - 0.15, 0.66, 0, 0.04);
  var garra = function(z, chico){
    var e = chico ? 0.6 : 1;
    perfil(null, [[x0 - 0.28, 0.80], [x0 - 0.04, 0.80], [x0 - 0.02, 0.66], [x0 - 0.10, 0.38], [x0 - 0.10 - 0.20 * e, 0.40 - 0.24 * e],
      [x0 - 0.10 - 0.30 * e, 0.40 - 0.27 * e], [x0 - 0.10 - 0.28 * e, 0.40 - 0.20 * e], [x0 - 0.24, 0.40], [x0 - 0.22, 0.60]],
      chico ? 0.035 : 0.06, z, 'pintura', JD ? OSC : AM, 0.01);
    var pT = bloque('GET', 0.15 * e + 0.03, 0.055, chico ? 0.05 : 0.08, 'metal', '#2C2F33', x0 - 0.10 - 0.28 * e, 0.40 - 0.245 * e, z, 0.01);
    pT.rotation.z = 0.35;
  };
  [-0.80, 0, 0.80].forEach(function(z){ garra(z, false); });
  if(P.escarif) [-1.0, -0.534, -0.267, 0.267, 0.534, 1.0].forEach(function(z){ garra(z, true); });

  /* ═══ llantas en aros amarillos ═══ */
  var LL = { r: R, ancho: A, rAro: P.rAro, aro: AM, aro2: AM2, pernos: 10, perno: '#5E5A4E', paso: 0.21 };
  var lean = 0.10;                                        /* las delanteras inclinadas, como trabaja la maquina */
  var rd = D.ruedaDet('LL1', X(0), zW, 1, LL); rd.rotation.x = lean; rd.position.y = R + 0.012;
  rd = D.ruedaDet('LL2', X(0), -zW, -1, LL); rd.rotation.x = lean; rd.position.y = R + 0.012;
  D.ruedaDet('LL3', X(P.wb - P.tand / 2), zW, 1, LL);
  D.ruedaDet('LL4', X(P.wb - P.tand / 2), -zW, -1, LL);
  D.ruedaDet('LL5', X(P.wb + P.tand / 2), zW, 1, LL);
  D.ruedaDet('LL6', X(P.wb + P.tand / 2), -zW, -1, LL);

  G.userData.ruedas = D.ruedas;
  G.userData.mirarY = 1.45;
  G.userData.dist = 17;
  return G;
}

registrarModelo3d({
  nombre: 'Motoniveladoras CAT 12M, 14M, 140K y John Deere 620G, 620P',
  clave: function(e){
    var m = mod3d(e);
    var esMot = /MOTONIV/.test(String((e && e.clasif) || '').toUpperCase());
    var k = /^12M/.test(m) ? '12M' : /^14M/.test(m) ? '14M' : /^140K/.test(m) ? '140K' :
            /^620G/.test(m) ? '620G' : /^620P/.test(m) ? '620P' : null;
    return esMot && k ? 'MOT' + k : null;
  },
  construir: function(e, piezas, clave){ return motConstruir(MOT_MEDIDAS[String(clave).replace(/^(R:)?MOT/, '')], piezas); }
});
