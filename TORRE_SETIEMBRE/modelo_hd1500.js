/* ══════════════════════════════════════════════════════════════════
   KOMATSU HD1500-7 — modelo de detalle (FC-58, FC-61, FC-62, FC-100, FC-108)

   Medidas de la hoja «Dimensions and Performance» del folleto de Komatsu:
     largo 11.37 · batalla 5.40 · eje trasero a la cola 3.495 · voladizo 2.475
     alero 5.85 · techo de cabina 5.25 · plataforma 3.635 · carga 4.965
     tolva 6.09 de ancho (interior 5.705), alero 6.89
     delanteras: centros a 5.01, 5.915 sobre llantas · traseras: duales con
     centros a 4.02, 5.985 sobre llantas y 2.055 entre las interiores
     llantas 33.00R51
   Lo que no esta acotado (cabina, guardafangos, motor, tanques) sale de las
   fotos del mismo folleto: frente, costado y tres cuartos.

   Ejes: frente hacia -X, arriba +Y, la izquierda del operador +Z. La cabina
   va a la izquierda; a la derecha de la plataforma la caja del filtro de aire.
   Cada pieza lleva su codigo de sistema SAP para el mapa de calor.
   ══════════════════════════════════════════════════════════════════ */
var KOM_AM = '#E9BA0A', KOM_AM2 = '#B38D05', KOM_AZUL = '#1B2540', KOM_GRIS = '#3A4047', KOM_GRIS2 = '#5A626B',
    KOM_NEGRO = '#17191C';

/* el logo HD1500: tres franjas azules y el nombre en blanco sobre negro */
function rotuloHD(g, w, h){
  g.fillStyle = '#16181C'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#2D5BC4';
  for(var i = 0; i < 3; i++) g.fillRect(w * 0.03, h * (0.22 + i * 0.22), w * 0.17, h * 0.13);
  g.fillStyle = '#FFFFFF'; g.textAlign = 'left'; g.textBaseline = 'middle';
  g.font = 'bold ' + Math.round(h * 0.42) + 'px "Arial Black", Arial, sans-serif';
  g.fillText('HD', w * 0.23, h * 0.56);
  g.font = 'bold ' + Math.round(h * 0.70) + 'px "Arial Black", Arial, sans-serif';
  g.fillText('1500', w * 0.42, h * 0.53);
}

function construirHD1500(piezas){
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var bloque = D.bloque, perfil = D.perfil, perfilX = D.perfilX, tubo = D.tubo, cilindro = D.cilindro,
      pon = D.pon, letrero = D.letrero, esTolva = D.esTolva;
  var AM = function(code, w, h, d, x, y, z, r, rot){ return bloque(code, w, h, d, 'pintura', KOM_AM, x, y, z, r, rot); };

  /* ═══ medidas ═══ */
  var XD = -2.80, XT = 2.60, R = 1.485, A = 0.88;
  var XC = XT + 3.495, XP = XC - 11.37;          /* cola 6.095 · parachoques -5.275 */
  var YP = 3.60, ZP = 2.98, XF = -4.95, XPL = -1.92;   /* plataforma: piso, mitad de ancho, frente, fondo */
  var YB = 4.965, ZB = 3.045, YS = 2.95;          /* tolva: borde, mitad de ancho, piso */
  var XA = -4.62, YA = 5.85, ZA = 6.89 / 2;       /* alero */
  var XW0 = -1.60;                                /* pared delantera de la tolva, abajo */

  /* ═══ bastidor ═══ */
  [-0.72, 0.72].forEach(function(z){
    bloque('42023615', 10.3, 0.62, 0.36, 'pintura', KOM_AM2, 0.30, 1.62, z, 0.04);
    bloque(null, 10.3, 0.04, 0.40, 'pintura', KOM_AM2, 0.30, 1.95, z, 0.01);
  });
  [-3.9, -1.05, 1.15, 4.4].forEach(function(x){ bloque('42023615', 0.32, 0.46, 1.10, 'pintura', KOM_AM2, x, 1.58, 0, 0.03); });
  /* soportes de la articulacion de la tolva, atras */
  [-1.0, 1.0].forEach(function(z){
    perfil(null, [[XC - 1.75, 1.92], [XC - 0.95, 1.92], [XC - 1.15, 2.55], [XC - 1.55, 2.55]], 0.16, z, 'pintura', KOM_AM2, 0.02);
    cilindro('PYB', 0.15, 0.15, 0.42, 'metal', '#4A4F55', XC - 1.35, 2.40, z, [Math.PI / 2, 0, 0], 18);
  });

  /* ═══ parachoques, ganchos y peldanos colgantes ═══ */
  AM('42023615', 0.52, 0.68, 4.70, XP + 0.26, 1.40, 0, 0.06);
  bloque(null, 0.50, 0.03, 4.62, 'mate', '#2A2E33', XP + 0.26, 1.75, 0, 0.01);
  [-1.95, 1.95].forEach(function(z){
    AM(null, 0.30, 0.30, 0.34, XP - 0.10, 1.30, z, 0.04);
    cilindro(null, 0.07, 0.07, 0.46, 'metal', '#5A5F66', XP - 0.12, 1.30, z, null, 14);
  });
  [-1.30, 1.30].forEach(function(z){
    [-0.20, 0.20].forEach(function(dz){ bloque(null, 0.05, 0.70, 0.06, 'pintura', KOM_AM, XP + 0.06, 0.73, z + dz, 0.012); });
    [0.48, 0.80].forEach(function(y){ bloque(null, 0.20, 0.03, 0.40, 'metal', '#4A4F55', XP + 0.04, y, z, 0.006); });
  });
  /* luces chicas del parachoques */
  [-2.2, -1.75, 1.75, 2.2].forEach(function(z){
    bloque(null, 0.08, 0.16, 0.24, 'mate', '#202327', XP - 0.02, 1.52, z, 0.02);
    bloque('LSM', 0.03, 0.10, 0.17, 'vidrio', '#F4EDCF', XP - 0.06, 1.52, z, 0.01);
  });

  /* ═══ frente: parrilla negra con KOMATSU ═══ */
  bloque('RAD1', 0.18, 1.98, 2.40, 'mate', KOM_NEGRO, XF + 0.12, 2.64, 0, 0.04);
  for(var i = 0; i < 10; i++){
    var l = pon(null, new THREE.BoxGeometry(0.05, 0.11, 2.20), 'mate', '#0A0B0D', XF + 0.01, 1.82 + i * 0.148, 0);
    l.rotation.z = -0.55;
  }
  bloque(null, 0.06, 0.26, 2.40, 'mate', KOM_NEGRO, XF + 0.02, 3.47, 0, 0.02);
  var texKom = texRotulo3d(rotuloTexto('KOMATSU', KOM_NEGRO, '#FFFFFF', 0.95), 512, 96);
  letrero(texKom, 1.30, 0.22, XF - 0.012, 3.47, 0, -Math.PI / 2);
  /* radiador y ventilador detras */
  bloque('RAD1', 0.40, 1.80, 2.10, 'metal', KOM_GRIS, XF + 0.50, 2.62, 0, 0.03);
  pon('FAN1', new THREE.TorusGeometry(0.70, 0.08, 10, 36), 'metal', KOM_GRIS2, XF + 0.85, 2.60, 0, [0, Math.PI / 2, 0]);
  cilindro('MFC1', 0.22, 0.22, 0.40, 'metal', KOM_GRIS, XF + 1.05, 2.60, 0, [0, 0, Math.PI / 2], 16);
  cilindro('AFT1', 0.18, 0.18, 1.2, 'metal', KOM_GRIS2, XF + 0.95, 3.25, 0, [Math.PI / 2, 0, 0], 16);

  /* ═══ torres delanteras: anchas arriba, angostas abajo, con el faro grande ═══ */
  [-1, 1].forEach(function(lado){
    var pts = [[1.40, 1.76], [2.12, 1.76], [2.98, 2.66], [2.98, YP - 0.02], [1.40, YP - 0.02]].map(function(p){ return [lado * p[0], p[1]]; });
    if(lado < 0) pts.reverse();
    perfilX(null, pts, 0.78, XF + 0.36, 'pintura', KOM_AM, 0.035);
    /* caja del faro y faro redondo */
    var zf = lado * 2.10;
    AM(null, 0.26, 0.64, 0.64, XF - 0.10, 3.02, zf, 0.05);
    D.faro(lado > 0 ? 'FDI' : 'LSM', XF - 0.24, 3.05, zf, 0.23);
    /* pares de luces chicas en las esquinas */
    [[3.38, 2.68], [3.38, 2.44], [1.92, 1.88], [1.92, 2.06]].forEach(function(q){
      bloque(null, 0.06, 0.16, 0.16, 'mate', '#202327', XF - 0.02, q[0], lado * q[1], 0.02);
      bloque('LSM', 0.03, 0.10, 0.11, 'vidrio', '#F4EDCF', XF - 0.05, q[0], lado * q[1], 0.01);
    });
    /* tapa del guardafango sobre la rueda y su faldon */
    AM(null, 2.45, 0.12, 1.55, XD - 0.15, YP - 0.06, lado * 2.20, 0.03);
    AM(null, 2.45, 0.55, 0.10, XD - 0.15, YP - 0.33, lado * (ZP - 0.04), 0.03);
    /* brazo inclinado del frente del guardafango (como en la foto de costado) */
    tubo(null, [XF + 0.55, YP - 0.25, lado * 2.55], [XP + 0.40, 1.50, lado * 2.40], 0.15, 'pintura', KOM_AM, 18);
    /* escalera pegada a la parrilla y su pasamanos que sigue a la plataforma */
    D.escalera(XF - 0.14, lado * 1.30, 1.76, YP + 0.02, 0.42, KOM_AM, '#4A4F55');
    [lado * 1.30 - 0.21, lado * 1.30 + 0.21].forEach(function(z){
      tubo(null, [XF - 0.16, YP, z], [XF - 0.16, YP + 1.0, z], 0.026, 'pintura', KOM_AM, 10);
    });
  });

  /* ═══ plataforma ═══ */
  AM(null, XPL - (XF - 0.06), 0.13, ZP * 2, (XF - 0.06 + XPL) / 2, YP - 0.065, 0, 0.03);
  /* tapa del radiador y del motor al centro, detras de la parrilla */
  AM(null, 1.10, 0.62, 2.30, XF + 0.70, YP + 0.31, 0, 0.06);
  bloque(null, 0.70, 0.05, 1.6, 'mate', KOM_GRIS, XF + 0.70, YP + 0.64, 0, 0.02);
  /* caja del filtro de aire a la derecha, con su rejilla y los prefiltros */
  AM(null, 1.15, 1.30, 1.25, -4.15, YP + 0.65, -2.05, 0.06);
  D.lamas(null, -4.73, YP + 0.25, YP + 1.10, -2.55, -1.55, 8, KOM_NEGRO, -1);
  [-2.35, -1.75].forEach(function(z){
    cilindro(null, 0.16, 0.16, 0.28, 'mate', KOM_NEGRO, -3.95, YP + 1.44, z, null, 20);
    cilindro(null, 0.19, 0.19, 0.05, 'mate', KOM_NEGRO, -3.95, YP + 1.60, z, null, 20);
  });
  /* engrase y baterias en la plataforma derecha, atras */
  bloque('SEN', 0.55, 0.62, 0.45, 'mate', KOM_GRIS, -2.55, YP + 0.31, -2.55, 0.04);
  cilindro('GP1', 0.11, 0.11, 0.42, 'metal', KOM_GRIS2, -2.55, YP + 0.82, -2.55, null, 14);
  bloque('BAT', 0.80, 0.42, 0.60, 'mate', KOM_NEGRO, -4.40, YP - 0.70, -2.50, 0.03);
  bloque('SENS', 0.20, 0.16, 0.20, 'mate', KOM_GRIS2, -2.95, YP + 0.08, -1.75, 0.02);

  /* ═══ cabina a la izquierda: abajo amarilla, arriba azul marino ═══ */
  var CX0 = -4.45, CX1 = -2.36, CZ0 = 0.95, CZ1 = 2.92, CYV = 4.18, CY1 = 5.25;
  var cx = (CX0 + CX1) / 2, cz = (CZ0 + CZ1) / 2;
  AM('CBN', CX1 - CX0, CYV - YP, CZ1 - CZ0, cx, (YP + CYV) / 2, cz, 0.06);
  /* toma del aire acondicionado en el frente de la cabina */
  D.lamas(null, CX0 - 0.01, YP + 0.12, CYV - 0.12, CZ0 + 0.25, CZ0 + 1.15, 6, KOM_NEGRO, -1);
  /* franja azul con KOMATSU y techo azul con alero */
  bloque('CBN', CX1 - CX0 + 0.02, 0.20, CZ1 - CZ0 + 0.02, 'pintura', KOM_AZUL, cx, CYV + 0.10, cz, 0.03);
  bloque('CBN', CX1 - CX0 + 0.16, 0.16, CZ1 - CZ0 + 0.16, 'pintura', KOM_AZUL, cx, CY1 - 0.08, cz, 0.05);
  bloque(null, CX1 - CX0 - 0.1, 0.06, CZ1 - CZ0 - 0.1, 'pintura', KOM_AZUL, cx, CY1 + 0.02, cz, 0.03);
  /* postes del ROPS y el poste de la puerta */
  [[CX0, CZ0], [CX0, CZ1], [CX1, CZ0], [CX1, CZ1], [CX0 + 0.98, CZ1], [CX0 + 0.98, CZ0]].forEach(function(p){
    bloque('CBN', 0.12, CY1 - CYV - 0.36, 0.12, 'pintura', KOM_AZUL, p[0], (CYV + 0.20 + CY1 - 0.16) / 2, p[1], 0.03);
  });
  /* vidrios con marco, un poco hundidos */
  var hV = CY1 - CYV - 0.40, yV = CYV + 0.21 + hV / 2;
  var vid = function(w, h, d, x, y, z){ var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), D.M.vidrio('#1A2A3A')); m.position.set(x, y, z); G.add(m); return m; };
  vid(0.03, hV, CZ1 - CZ0 - 0.14, CX0 + 0.02, yV, cz);
  vid(0.92, hV, 0.03, CX0 + 0.50, yV, CZ1 - 0.02);
  vid(CX1 - CX0 - 1.10, hV, 0.03, (CX0 + 1.0 + CX1) / 2, yV, CZ1 - 0.02);
  vid(0.92, hV, 0.03, CX0 + 0.50, yV, CZ0 + 0.02);
  vid(CX1 - CX0 - 1.10, hV, 0.03, (CX0 + 1.0 + CX1) / 2, yV, CZ0 + 0.02);
  vid(0.03, hV * 0.70, CZ1 - CZ0 - 0.14, CX1 - 0.02, yV + hV * 0.12, cz);
  /* limpiaparabrisas */
  tubo(null, [CX0 - 0.02, CYV + 0.30, cz - 0.25], [CX0 - 0.02, CYV + 0.78, cz + 0.20], 0.012, 'mate', '#111', 6);
  /* KOMATSU en la franja de la puerta, manija y bisagras */
  letrero(texKom, 0.95, 0.16, CX0 + 0.52, CYV + 0.10, CZ1 + 0.012, 0);
  bloque(null, 0.18, 0.04, 0.05, 'cromo', null, CX0 + 0.82, CYV - 0.22, CZ1 + 0.04, 0.01);
  [CYV - 0.40, CY1 - 0.40].forEach(function(y){ bloque(null, 0.06, 0.10, 0.05, 'mate', '#202327', CX0 + 0.05, y, CZ1 + 0.03, 0.01); });
  /* asideros a los lados de la puerta */
  [CX0 - 0.12, CX0 + 1.10].forEach(function(x){ tubo(null, [x, YP + 0.25, CZ1 + 0.10], [x, CY1 - 0.30, CZ1 + 0.10], 0.022, 'pintura', KOM_AM, 10); });
  /* luces de carga en el poste trasero: rojo, ambar, verde, con visera */
  bloque(null, 0.16, 0.66, 0.22, 'mate', KOM_NEGRO, CX1 + 0.10, CYV + 0.42, CZ1 + 0.13, 0.03);
  ['#D9301F', '#F0A41C', '#2FA84F'].forEach(function(c, k){
    var lz = new THREE.Mesh(new THREE.SphereGeometry(0.072, 16, 10),
      new THREE.MeshStandardMaterial({ color: new THREE.Color(c), emissive: new THREE.Color(c), emissiveIntensity: 0.45, roughness: 0.25 }));
    lz.position.set(CX1 + 0.10, CYV + 0.63 - k * 0.20, CZ1 + 0.23); G.add(lz);
    bloque(null, 0.18, 0.02, 0.10, 'mate', KOM_NEGRO, CX1 + 0.10, CYV + 0.71 - k * 0.20, CZ1 + 0.27, 0.005);
  });
  /* baliza y aire acondicionado en el techo */
  var bal = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4, roughness: 0.3 }));
  bal.position.set(CX0 + 0.35, CY1 + 0.05, CZ1 - 0.30); G.add(bal);
  bloque('AAC', 0.80, 0.22, 1.10, 'mate', KOM_GRIS, CX1 - 0.55, CY1 + 0.13, cz, 0.04);
  /* tablero electrico y modulos detras de la cabina */
  bloque('TAB', 0.36, 0.86, 0.95, 'pintura', KOM_AM, CX1 + 0.25, YP + 0.43, CZ0 + 0.55, 0.04);
  bloque('EC', 0.30, 0.40, 0.50, 'mate', KOM_GRIS2, CX1 + 0.25, YP + 1.06, CZ0 + 0.55, 0.03);
  bloque('HAR', 0.05, 0.05, 1.70, 'mate', '#22262B', CX1 + 0.08, YP + 0.12, 0.0, 0.01);

  /* ═══ pasamanos azul marino, espejos y faros de trabajo ═══ */
  var XB = XF - 0.02;
  D.baranda([[XB, -1.53], [XB, -ZP + 0.05], [-3.30, -ZP + 0.05], [XPL + 0.10, -ZP + 0.05]], YP, 1.05, KOM_AZUL, KOM_AM);
  D.baranda([[XB, 1.53], [XB, ZP - 0.05], [CX0 + 0.40, ZP - 0.05], [XPL + 0.10, ZP - 0.05]], YP, 1.05, KOM_AZUL, KOM_AM);
  D.baranda([[XB, -1.07], [XB, 1.07]], YP, 1.05, KOM_AZUL, KOM_AM);
  [-1, 1].forEach(function(lado){
    tubo(null, [XB, YP + 1.05, lado * (ZP - 0.05)], [XB - 0.16, YP + 1.45, lado * (ZP + 0.22)], 0.03, 'pintura', KOM_AZUL, 10);
    bloque(null, 0.08, 0.78, 0.40, 'mate', KOM_NEGRO, XB - 0.18, YP + 1.62, lado * (ZP + 0.27), 0.04);
    bloque(null, 0.02, 0.70, 0.33, 'cromo', null, XB - 0.22, YP + 1.62, lado * (ZP + 0.27), 0.005);
    /* faro de trabajo en la baranda */
    bloque(null, 0.10, 0.16, 0.22, 'mate', KOM_NEGRO, XB - 0.04, YP + 1.17, lado * 1.75, 0.02);
    bloque('LSM', 0.03, 0.12, 0.18, 'vidrio', '#F4EDCF', XB - 0.10, YP + 1.17, lado * 1.75, 0.01);
  });

  /* ═══ motor SDA16V159 bajo la plataforma ═══ */
  bloque('ENG1', 2.50, 1.15, 1.40, 'metal', KOM_GRIS, -3.20, 2.45, 0, 0.06);
  [-0.42, 0.42].forEach(function(z){
    bloque('ENG1', 2.20, 0.30, 0.42, 'metal', KOM_GRIS2, -3.20, 3.12, z, 0.04);
    for(var c = 0; c < 8; c++) cilindro(null, 0.035, 0.035, 0.06, 'metal', '#2E3238', -4.15 + c * 0.27, 3.30, z, null, 8);
  });
  bloque('INY1', 2.10, 0.08, 0.30, 'metal', KOM_GRIS, -3.20, 3.27, 0, 0.02);
  [-0.30, 0.30].forEach(function(z){ pon('TLH1', new THREE.TorusGeometry(0.16, 0.08, 10, 20), 'metal', '#6B7178', -1.95, 3.05, z, [0, Math.PI / 2, 0]); });
  bloque('CMP', 0.50, 0.42, 0.42, 'metal', KOM_GRIS2, -2.40, 2.05, -0.92, 0.04);
  cilindro('ARN', 0.16, 0.16, 0.45, 'metal', KOM_GRIS2, -3.95, 2.00, 0.92, [0, 0, Math.PI / 2], 14);
  cilindro('AR1', 0.15, 0.15, 0.40, 'metal', KOM_GRIS2, -3.45, 2.00, 0.95, [0, 0, Math.PI / 2], 14);
  cilindro('DAM1', 0.36, 0.36, 0.14, 'metal', '#2E3238', -4.48, 2.35, 0, [0, 0, Math.PI / 2], 24);
  cilindro('FP1', 0.14, 0.14, 0.30, 'metal', KOM_GRIS2, -4.30, 1.95, -0.55, [0, 0, Math.PI / 2], 14);

  /* ═══ suspension delantera MacPherson, direccion y masas ═══ */
  [-1, 1].forEach(function(lado){
    var z = lado * 1.70;
    cilindro(lado > 0 ? 'SDI' : 'SDD', 0.30, 0.30, 1.05, 'pintura', KOM_AM, XD + 0.05, YP - 0.68, z, null, 24);
    cilindro(null, 0.34, 0.34, 0.12, 'pintura', KOM_AM2, XD + 0.05, YP - 0.17, z, null, 24);
    cilindro(null, 0.18, 0.18, 0.80, 'cromo', null, XD + 0.05, YP - 1.55, z, null, 20);
    cilindro(lado > 0 ? 'BMLH' : 'BMRH', 0.46, 0.50, 0.42, 'metal', KOM_GRIS, XD, R, lado * 1.95, [Math.PI / 2, 0, 0], 28);
    cilindro(lado > 0 ? 'DLH' : 'DRH', 0.32, 0.36, 0.18, 'metal', '#2E3238', XD, R, lado * 1.70, [Math.PI / 2, 0, 0], 24);
  });
  D.cilHidD('SRH', [XD + 0.85, 1.55, -0.70], [XD + 0.30, 1.55, -1.55], 0.10, KOM_AM, 0.5);
  D.cilHidD(null, [XD + 0.85, 1.55, 0.70], [XD + 0.30, 1.55, 1.55], 0.10, KOM_AM, 0.5);
  tubo(null, [XD + 0.40, 1.30, -1.55], [XD + 0.40, 1.30, 1.55], 0.07, 'metal', '#4A4F55', 14);
  cilindro('SPM', 0.18, 0.18, 0.40, 'metal', KOM_GRIS2, -1.55, 1.30, 0.62, [0, 0, Math.PI / 2], 14);

  /* ═══ tren de fuerza ═══ */
  cilindro('CON', 0.55, 0.55, 0.62, 'metal', KOM_GRIS, -1.70, 1.62, 0, [0, 0, Math.PI / 2], 30);
  bloque('TRM', 1.85, 1.02, 1.05, 'metal', KOM_GRIS, -0.45, 1.50, 0, 0.06);
  for(var tr = 0; tr < 4; tr++) bloque(null, 0.05, 1.06, 1.09, 'metal', KOM_GRIS2, -1.20 + tr * 0.5, 1.50, 0, 0.01);
  cilindro('HPM', 0.20, 0.20, 0.45, 'metal', KOM_GRIS2, -1.50, 1.30, -0.62, [0, 0, Math.PI / 2], 14);
  bloque('VV1', 0.45, 0.36, 0.42, 'metal', KOM_GRIS2, 0.80, 1.95, -0.55, 0.03);
  tubo(null, [0.50, 1.45, 0], [XT - 0.75, R, 0], 0.11, 'cromo', null, 16);
  [0.50, XT - 0.75].forEach(function(x){ cilindro(null, 0.17, 0.17, 0.14, 'metal', '#2E3238', x, x < 1 ? 1.45 : R, 0, [0, 0, Math.PI / 2], 16); });
  cilindro('FDP', 0.32, 0.32, 0.18, 'metal', KOM_GRIS, 1.15, 1.40, 0, [0, 0, Math.PI / 2], 24);
  /* puente trasero: banjo, diferencial y tubos de eje */
  pon('DIFP', new THREE.SphereGeometry(0.80, 32, 20), 'pintura', KOM_AM2, XT, R, 0);
  cilindro('DIFP', 0.55, 0.55, 0.40, 'pintura', KOM_AM2, XT - 0.55, R, 0, [0, 0, Math.PI / 2], 28);
  cilindro(null, 0.38, 0.50, 1.10, 'pintura', KOM_AM2, XT, R, 0.95, [Math.PI / 2, 0, 0], 28);
  cilindro(null, 0.38, 0.50, 1.10, 'pintura', KOM_AM2, XT, R, -0.95, [Math.PI / 2, 0, 0], 28);
  cilindro('MLH', 0.62, 0.62, 0.26, 'metal', KOM_GRIS, XT, R, 1.42, [Math.PI / 2, 0, 0], 30);
  cilindro('MRH', 0.62, 0.62, 0.26, 'metal', KOM_GRIS, XT, R, -1.42, [Math.PI / 2, 0, 0], 30);
  cilindro('BPD', 0.52, 0.52, 0.12, 'metal', KOM_GRIS2, XT, R, -1.25, [Math.PI / 2, 0, 0], 28);
  /* brazo en A del puente y suspension trasera */
  tubo(null, [XT - 0.4, R + 0.2, 0.55], [0.4, 1.35, 0], 0.13, 'pintura', KOM_AM2, 16);
  tubo(null, [XT - 0.4, R + 0.2, -0.55], [0.4, 1.35, 0], 0.13, 'pintura', KOM_AM2, 16);
  D.cilHidD('SPI', [XT + 0.20, R + 0.55, 0.95], [XT + 0.85, 2.40, 0.85], 0.21, KOM_AM, 0.6);
  D.cilHidD('SPD', [XT + 0.20, R + 0.55, -0.95], [XT + 0.85, 2.40, -0.85], 0.21, KOM_AM, 0.6);
  /* mangueras a lo largo del bastidor */
  [-0.98, 0.98].forEach(function(z){
    tubo('LPH', [-4.2, 1.98, z], [4.1, 1.98, z], 0.045, 'goma', '#22262B', 8);
    tubo('21003297', [-4.2, 1.86, z * 0.96], [3.4, 1.86, z * 0.96], 0.032, 'goma', '#2E3238', 8);
  });

  /* ═══ tanques entre las ruedas ═══ */
  /* combustible a la izquierda, con tapa, indicador de nivel y peldanos */
  AM('TQC1', 1.90, 1.15, 0.80, -0.55, 1.68, 1.62, 0.10);
  cilindro(null, 0.10, 0.10, 0.10, 'mate', KOM_NEGRO, -0.10, 2.30, 1.62, null, 18);
  bloque(null, 0.08, 0.60, 0.04, 'vidrio', '#9BB7C9', -1.10, 1.70, 2.035, 0.01);
  /* hidraulico a la derecha, con visor */
  AM('TQH1', 1.60, 1.15, 0.80, -0.70, 1.68, -1.62, 0.10);
  cilindro(null, 0.07, 0.07, 0.03, 'vidrio', '#9BB7C9', -0.30, 1.85, -2.03, [Math.PI / 2, 0, 0], 18);
  cilindro(null, 0.06, 0.06, 0.18, 'mate', KOM_NEGRO, -1.05, 2.33, -1.62, null, 14);

  /* ═══ cilindros de levante telescopicos (tres etapas) ═══ */
  [-1.40, 1.40].forEach(function(z){
    var a = [0.25, 1.05, z], b = [1.00, 2.70, z];
    var p = function(f){ return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, z]; };
    tubo('PHY', a, p(0.48), 0.22, 'pintura', KOM_AM, 22);
    tubo(null, p(0.46), p(0.76), 0.16, 'cromo', null, 20);
    tubo(null, p(0.74), b, 0.11, 'cromo', null, 18);
    pon(null, new THREE.SphereGeometry(0.20, 14, 10), 'metal', '#3A3F45', a[0], a[1], z);
  });

  /* ═══ luces traseras y alarma de retroceso ═══ */
  bloque(null, 0.12, 0.42, 1.70, 'mate', KOM_NEGRO, XC - 0.68, 2.05, 0, 0.03);
  [-0.60, -0.20, 0.20, 0.60].forEach(function(z, k){
    bloque('LSM', 0.04, 0.24, 0.30, 'vidrio', k === 1 || k === 2 ? '#F2A31A' : '#C2241B', XC - 0.61, 2.05, z, 0.01);
  });
  bloque(null, 0.16, 0.16, 0.22, 'mate', KOM_NEGRO, XC - 0.68, 1.70, 0.0, 0.02);

  /* ═══ tolva de piso plano, costados nervados y alero alto ═══ */
  var bajo = function(x){
    if(x <= 4.35) return YS;
    return YS + (x - 4.35) * (3.95 - YS) / (XC - 4.35);
  };
  var costado = [[-2.05, 5.08], [-1.55, YB], [XC - 0.05, YB - 0.06], [XC, 3.95], [4.35, YS], [XW0 + 0.25, YS], [-2.05, 4.20]];
  var texHD = texRotulo3d(rotuloHD, 384, 96);
  var texNum = texNumero3d(null, '#16181C');
  [-1, 1].forEach(function(lado){
    var zc = lado * (ZB - 0.05);
    esTolva(perfil('TLV', costado, 0.10, zc, 'pintura', KOM_AM, 0.02));
    /* larguero superior redondeado y viga inferior a lo largo */
    esTolva(bloque('TLV', XC + 1.62, 0.30, 0.30, 'pintura', KOM_AM, (XC - 1.62) / 2, YB - 0.12, lado * (ZB + 0.06), 0.08));
    esTolva(bloque('TLV', 4.35 - XW0 + 0.2, 0.24, 0.22, 'pintura', KOM_AM2, (4.35 + XW0) / 2 + 0.1, YS + 0.10, lado * (ZB + 0.06), 0.05));
    var tramoCola = esTolva(bloque('TLV', Math.hypot(XC - 4.35, 3.95 - YS), 0.24, 0.22, 'pintura', KOM_AM2,
      (4.35 + XC) / 2, (YS + 3.95) / 2 + 0.10, lado * (ZB + 0.06), 0.05));
    tramoCola.rotation.z = Math.atan2(3.95 - YS, XC - 4.35);
    /* nervios de seccion cajon, mas hondos abajo */
    /* sin nervios donde van el logo (adelante) y el numero (atras) */
    for(var x = 0.05; x < XC - 0.4; x += 0.62){
      if(x > XC - 2.75 && x < XC - 0.55) continue;
      var yb = bajo(x) + 0.22, yt = YB - 0.28;
      var gN = new THREE.BoxGeometry(0.16, yt - yb, 0.20);
      var pos = gN.attributes.position;
      for(var v = 0; v < pos.count; v++) if(pos.getY(v) > 0) pos.setZ(v, pos.getZ(v) * 0.45);
      gN.computeVertexNormals();
      var nr = esTolva(pon('TLV', gN, 'pintura', '#D4A808', x, (yb + yt) / 2, lado * (ZB + 0.07)));
      nr.position.z = lado * (ZB + 0.06);
    }
    /* logo HD1500 y numero de unidad en el costado */
    esTolva(letrero(texHD, 1.25, 0.31, -0.95, 4.60, lado * (ZB + 0.20), lado > 0 ? 0 : Math.PI));
    var mN = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.60), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
    mN.position.set(XC - 1.65, 4.25, lado * (ZB + 0.08)); mN.rotation.y = lado > 0 ? 0 : Math.PI;
    G.add(mN); esTolva(mN);
    /* ojo de izaje y traba de la tolva */
    esTolva(pon(null, new THREE.TorusGeometry(0.11, 0.035, 8, 16), 'mate', KOM_NEGRO, -1.30, YB - 0.42, lado * (ZB + 0.08)));
  });
  /* piso plano, rampa de cola y su labio */
  esTolva(bloque('TLV', 4.35 - XW0, 0.12, ZB * 2 - 0.12, 'pintura', KOM_AM, (4.35 + XW0) / 2, YS + 0.06, 0, 0.03));
  var rampa = esTolva(bloque('TLV', Math.hypot(XC - 4.35, 3.95 - YS), 0.12, ZB * 2 - 0.12, 'pintura', KOM_AM,
    (4.35 + XC) / 2, (YS + 3.95) / 2 + 0.06, 0, 0.03));
  rampa.rotation.z = Math.atan2(3.95 - YS, XC - 4.35);
  esTolva(bloque('TLV', 0.22, 0.20, ZB * 2 + 0.14, 'pintura', KOM_AM2, XC - 0.02, 3.96, 0, 0.05));
  /* vigas y nervios bajo el piso */
  [-0.72, 0.72].forEach(function(z){ esTolva(bloque('TLV', 5.6, 0.42, 0.30, 'pintura', KOM_AM2, 1.25, YS - 0.20, z, 0.04)); });
  for(var cr = 0; cr < 9; cr++) esTolva(bloque(null, 0.14, 0.22, ZB * 2 - 0.4, 'pintura', KOM_AM2, XW0 + 0.5 + cr * 0.68, YS - 0.11, 0, 0.03));
  /* almohadillas sobre el bastidor */
  [-0.72, 0.72].forEach(function(z){ esTolva(bloque(null, 0.40, 0.12, 0.34, 'goma', '#22262B', -0.2, YS - 0.47, z, 0.03)); });
  /* pared delantera inclinada con nervios verticales */
  var largoP = Math.hypot(XW0 + 0.45 - (-2.05), 4.95 - YS);
  var pared = esTolva(bloque('TLV', 0.14, largoP, ZB * 2 - 0.06, 'pintura', KOM_AM, (XW0 + 0.45 - 2.05) / 2 - 0.02, (YS + 4.95) / 2, 0, 0.03));
  pared.rotation.z = Math.atan2(XW0 + 0.45 + 2.05, 4.95 - YS);
  for(var nv = -2; nv <= 2; nv++){
    var nf = esTolva(bloque(null, 0.18, largoP - 0.3, 0.16, 'pintura', '#D4A808', (XW0 + 0.45 - 2.05) / 2 - 0.12, (YS + 4.95) / 2, nv * 1.2, 0.03));
    nf.rotation.z = pared.rotation.z;
  }
  /* alero: sube hasta 5.85 m, con lamas por debajo, cantos y labio */
  var largoA = Math.hypot(-2.05 - XA, YA - 5.08), angA = -Math.atan2(YA - 5.08, -2.05 - XA);
  var al = esTolva(bloque('TLV', largoA, 0.14, ZA * 2, 'pintura', KOM_AM, (XA - 2.05) / 2, (YA + 5.08) / 2, 0, 0.03));
  al.rotation.z = angA;
  for(var lm = 0; lm < 7; lm++){
    var xl = -2.35 - lm * 0.30, yl = 5.08 + (xl + 2.05) / (XA + 2.05) * (YA - 5.08) - 0.22;
    esTolva(bloque(null, 0.08, 0.26, ZA * 2 - 0.5, 'pintura', '#C9A006', xl, yl, 0, 0.02));
  }
  [-1, 1].forEach(function(lado){
    var bo = esTolva(bloque('TLV', largoA, 0.42, 0.10, 'pintura', KOM_AM, (XA - 2.05) / 2, (YA + 5.08) / 2 - 0.20, lado * (ZA - 0.05), 0.03));
    bo.rotation.z = angA;
    /* cartelas entre el alero y los costados */
    esTolva(perfil('TLV', [[-2.10, 5.06], [-3.45, 5.50], [-1.85, 4.30]], 0.10, lado * (ZB - 0.22), 'pintura', KOM_AM, 0.02));
  });
  esTolva(bloque('TLV', 0.14, 0.40, ZA * 2, 'pintura', KOM_AM, XA - 0.02, YA - 0.12, 0, 0.04));
  var labio = esTolva(bloque(null, 0.34, 0.08, ZA * 2, 'pintura', KOM_AM, XA - 0.12, YA + 0.11, 0, 0.02));
  labio.rotation.z = -0.6;
  esTolva(letrero(texHD, 1.15, 0.29, XA - 0.10, YA - 0.12, -1.70, -Math.PI / 2));
  var mNa = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.38), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
  mNa.position.set(XA - 0.10, YA - 0.12, 1.70); mNa.rotation.y = -Math.PI / 2; G.add(mNa); esTolva(mNa);
  /* expulsores de roca entre las duales */
  [-2.01, 2.01].forEach(function(z){
    esTolva(D.tubo(null, [XT, 3.30, z], [XT + 0.05, 2.25, z], 0.06, 'metal', KOM_GRIS2, 10));
    esTolva(bloque(null, 0.30, 0.10, 0.10, 'metal', KOM_GRIS2, XT + 0.02, 3.32, z, 0.02));
  });

  /* ═══ llantas 33.00R51 en aros amarillos ═══ */
  var LL = { r: R, ancho: A, rAro: R * 0.452, aro: KOM_AM, aro2: KOM_AM2, pernos: 28, paso: 0.40 };
  var zIn = 2.055 / 2 + A / 2, zOut = 5.985 / 2 - A / 2;
  D.ruedaDet('LL1', XD, 2.505, 1, LL);
  D.ruedaDet('LL2', XD, -2.505, -1, LL);
  D.ruedaDet('LL3', XT, zOut, 1, LL);
  D.ruedaDet('LL4', XT, zIn, 0, LL);
  D.ruedaDet('LL5', XT, -zIn, 0, LL);
  D.ruedaDet('LL6', XT, -zOut, -1, LL);

  D.colgarTolva(new THREE.Vector3(XC - 1.35, 2.40, 0), 'HD1500');
  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = 2.9;
  G.userData.dist = 30;
  return G;
}

registrarModelo3d({
  nombre: 'Komatsu HD1500-7',
  clave: function(e){ return /^HD1500/.test(mod3d(e)) ? 'HD1500' : null; },
  construir: function(e, piezas){ return construirHD1500(piezas); }
});
