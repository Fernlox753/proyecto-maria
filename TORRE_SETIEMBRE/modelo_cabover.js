/* ══════════════════════════════════════════════════════════════════
   CAMIONES DE CABINA AVANZADA (cab-over) — volquetes, cisternas, ANFO y tracto

   Un solo sistema de chasis y cabina con la cabina de cada marca y el cuerpo
   que dice la clasificacion del equipo:
     Scania G540 B8X4HZ  CAMION VOLQUETE (58 unidades, V-2363-AL...)
     Scania G500 B6X4 y P450 B6X4  CISTERNA DE COMBUSTIBLE
     Scania P460 B6X4  TRACTO (sin semirremolque)
     Mercedes-Benz Actros 3344K (ANFO, agua, combustible), Actros 3344,
       Actros 3345K, Arocs 3345K, Axor 3341
     Foton FH (Auman, cabina avanzada)  CISTERNA DE AGUA
   La clave junta modelo y cuerpo: 'CBO|G540B8X4HZ|VOLQUETE'.

   Medidas:
   · Scania G540 B8x4HZ, ficha de chasis de Scania del Peru (seminuevos,
     YS2G8X400K5529189): distancia entre ejes 4350 (primer eje a primer eje
     motriz), bogie 1450, chasis alto (H), cabina CG14 de techo bajo color
     «Blaze Orange», llantas 325/95 R24 en aros 8.5-24 (radio de rodadura
     595 mm), tanque de 380 L a la izquierda, escape corto vertical.
     Tolva de 24.5 m3 (nota de Energiminas sobre la entrega de 50 Heavy
     Tipper a San Martin) con las proporciones de la hoja «G 440 XT 8x4
     Heavy Tipper» de Scania India (tolva de roca de 6.37 m de largo medio,
     2.58 m de ancho, 1.53 m de alto, cilindro frontal Hyva FE169-4).
     Separacion entre los dos ejes delanteros 1.70 m: supuesta (tipica).
   · Actros 3344K 6x4 (ficha tecnica de Mercedes-Benz Peru): 3600 + 1350,
     voladizo delantero 1.44, alto 3.317, trocha delantera 2.034, trasera
     1.804, llantas 13 R 22.5, tanque de 300 L.
   · Scania P460 tracto: ficha 6x4 de Scania del Peru (3100 + 1350,
     295/80 R22.5). Cisternas Scania: 3900 + 1350 y 315/80 R22.5 (supuesto).
   · Foton Auman: 3300 + 1350, cabina de 2.49 m; para la cisterna de agua se
     supone 3900 + 1350 y 12 R22.5.
   Ancho de cabina: Scania 2.45, Mercedes M 2.30, Foton 2.49.

   Colores: los G540 son de San Martin (foto de la entrega de Energiminas):
   cabina naranja con frente negro XT, cinta lima bajo SCANIA, baliza azul,
   tolva azul con «San Martín» en blanco. Los demas son alquilados de
   terceros sin foto: cabina blanca (supuesto), el tracto rojo (supuesto),
   cisterna de combustible blanca con franja roja, de agua gris claro con
   franja azul, ANFO de acero inoxidable.

   Ejes: frente hacia -X, arriba +Y, izquierda del operador +Z (volante a
   la izquierda). Llantas SAP: 1-2 delanteras (izq, der), en el 8x4 3-4 el
   segundo eje delantero; luego cada eje trasero de izquierda a derecha:
   exterior, interior, interior, exterior.
   ══════════════════════════════════════════════════════════════════ */
var CBO_NEGRO = '#17191C', CBO_GRIS = '#3B4047', CBO_GRIS2 = '#5E656D', CBO_ACERO = '#8D949C', CBO_INOX = '#BCC2C8',
    CBO_BLANCO = '#E8EAE7', CBO_NARANJA = '#EB5A22', CBO_AZUL = '#1F45B2', CBO_AZUL2 = '#173894', CBO_CHASIS = '#1C1E21',
    CBO_ROJO = '#A8161B', CBO_LIMA = '#B4DE1F', CBO_PLAST = '#232629', CBO_VIDRIO = '#22303C';

/* ═══ que camion es ═══ */
function cboSpec(e){
  var m = mod3d(e), marca = String((e && e.marca) || '').toUpperCase(), q;
  if(/SCANIA/.test(marca) && (q = m.match(/^([GPR])(\d{3})B?(\d)X(\d)/))){
    return { marca: 'SCANIA', cab: q[1] === 'P' ? 'P' : 'G', nombre: q[1] + q[2], ejes: q[3] + 'x' + q[4] };
  }
  if(/MERCEDES/.test(marca) && (q = m.match(/^(ACTROS|AROCS|AXOR)(\d{4})(K?)/))){
    return { marca: 'MB', cab: q[1], nombre: q[2] + q[3], ejes: '6x4' };
  }
  if(/FOTON/.test(marca)) return { marca: 'FOTON', cab: 'AUMAN', nombre: m, ejes: '6x4' };
  return null;
}
function cboCuerpo(e){
  var c = String((e && e.clasif) || '').toUpperCase();
  return /VOLQUETE/.test(c) ? 'VOLQUETE' : /ANFO/.test(c) ? 'ANFO' : /COMBUSTIBLE/.test(c) ? 'COMBUSTIBLE'
       : /AGUA/.test(c) ? 'AGUA' : /TRACTO/.test(c) ? 'TRACTO' : null;
}

/* ═══ medidas de cada combinacion (ver la cabecera) ═══ */
function cboMedidas(S, cuerpo){
  var L = { cuerpo: cuerpo };
  var ll = S.ejes === '8x4' ? [0.605, 0.325, 0.31, 1.20]                 /* 325/95 R24 */
         : S.marca === 'MB' ? [0.575, 0.32, 0.29, 1.10]                  /* 13 R22.5 */
         : cuerpo === 'TRACTO' ? [0.52, 0.295, 0.29, 1.02]                /* 295/80 R22.5 */
         : [0.535, 0.31, 0.29, 1.06];                                     /* 315/80 R22.5, 12 R22.5 */
  L.R = ll[0]; L.A = ll[1]; L.rAro = ll[2]; L.YF = ll[3];
  L.ejes = S.ejes === '8x4' ? [0, 1.70, 4.35, 5.80]
         : S.marca === 'MB' ? [0, 3.60, 4.95]
         : cuerpo === 'TRACTO' ? [0, 3.10, 4.45]
         : [0, 3.90, 5.25];
  L.nDel = S.ejes === '8x4' ? 2 : 1;
  L.zR = 0.43;
  /* cabina: ancho, alto del casco, inclinacion del parabrisas, borde bajo del parabrisas */
  var cab = { G: [2.45, 2.05, 0.14, 1.00], P: [2.45, 1.90, 0.11, 0.95], ACTROS: [2.30, 2.12, 0.19, 1.02],
              AROCS: [2.30, 2.14, 0.15, 1.05], AXOR: [2.30, 1.98, 0.13, 0.97], AUMAN: [2.49, 2.08, 0.17, 1.00] }[S.cab];
  L.W = cab[0]; L.H = cab[1]; L.rake = cab[2]; L.wsb = cab[3]; L.wst = L.H - 0.20;
  L.Y0 = S.ejes === '8x4' ? 1.30 : S.marca === 'MB' ? (S.cab === 'AXOR' ? 1.18 : 1.20) : S.cab === 'P' ? 1.12 : 1.17;
  L.Lc = cuerpo === 'VOLQUETE' ? 1.75 : cuerpo === 'ANFO' ? 1.92 : 2.05;
  L.xc0 = S.marca === 'MB' ? -1.38 : -1.42;
  L.xB = S.marca === 'MB' ? -1.44 : -1.57;
  L.xCB = L.xc0 + L.Lc;
  L.zD = S.marca === 'MB' ? 1.017 : 1.03;
  var sep = L.A + 0.04, tr = S.marca === 'MB' ? 0.902 : 0.915;
  L.zO = tr + sep / 2; L.zI = tr - sep / 2;
  var ult = L.ejes[L.ejes.length - 1];
  L.xFin = ult + (cuerpo === 'VOLQUETE' ? 0.95 : cuerpo === 'TRACTO' ? 0.85 : cuerpo === 'ANFO' ? 1.40 : 1.75);
  return L;
}

/* ═══ letreros dibujados ═══ */
function cboTexLetras(txt, fondo, tinta, esp, w, h, fuente){
  return texRotulo3d(function(g, W, H){
    if(fondo){ g.fillStyle = fondo; g.fillRect(0, 0, W, H); } else g.clearRect(0, 0, W, H);
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = (fuente || 'bold ') + Math.round(H * 0.72) + 'px "Arial Black", Arial, sans-serif';
    if(esp){
      var n = txt.length, paso = W * 0.92 / n;
      for(var i = 0; i < n; i++) g.fillText(txt.charAt(i), W * 0.04 + paso * (i + 0.5), H * 0.54);
    } else g.fillText(txt, W / 2, H * 0.54, W * 0.96);
  }, w || 512, h || 96);
}
/* el grifo de Scania: circulo azul, aro plateado y la cabeza del grifo coronada */
function cboTexGrifo(){
  return texRotulo3d(function(g, w, h){
    g.clearRect(0, 0, w, h);
    var c = w / 2;
    g.fillStyle = '#C9CED3'; g.beginPath(); g.arc(c, c, c - 2, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#16297A'; g.beginPath(); g.arc(c, c, c * 0.84, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#E8ECF0'; g.lineWidth = w * 0.02; g.beginPath(); g.arc(c, c, c * 0.74, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#F2F3F4';
    g.beginPath();
    [[0.40, 0.78], [0.38, 0.55], [0.30, 0.47], [0.24, 0.50], [0.28, 0.42], [0.36, 0.36], [0.42, 0.30], [0.50, 0.32],
     [0.56, 0.38], [0.62, 0.32], [0.66, 0.40], [0.62, 0.52], [0.66, 0.64], [0.60, 0.78]].forEach(function(p, i){
      i ? g.lineTo(p[0] * w, p[1] * h) : g.moveTo(p[0] * w, p[1] * h);
    });
    g.closePath(); g.fill();
    /* corona */
    g.fillStyle = '#E2B53A';
    g.beginPath(); g.moveTo(0.40 * w, 0.27 * h); g.lineTo(0.42 * w, 0.18 * h); g.lineTo(0.46 * w, 0.24 * h); g.lineTo(0.50 * w, 0.16 * h);
    g.lineTo(0.54 * w, 0.24 * h); g.lineTo(0.58 * w, 0.18 * h); g.lineTo(0.60 * w, 0.27 * h); g.closePath(); g.fill();
    g.fillStyle = '#16297A'; g.beginPath(); g.arc(0.35 * w, 0.43 * h, w * 0.025, 0, Math.PI * 2); g.fill();
  }, 128, 128);
}
/* logo Foton: triangulo plateado partido por franjas diagonales */
function cboTexFoton(){
  return texRotulo3d(function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#D5D9DD';
    g.beginPath(); g.moveTo(w * 0.08, h * 0.12); g.lineTo(w * 0.92, h * 0.12); g.lineTo(w * 0.5, h * 0.90); g.closePath(); g.fill();
    g.strokeStyle = '#2A2E33'; g.lineWidth = w * 0.06;
    [0.34, 0.50, 0.66].forEach(function(f){ g.beginPath(); g.moveTo(w * (f - 0.14), h * 0.10); g.lineTo(w * (f + 0.10), h * 0.62); g.stroke(); });
  }, 128, 128);
}
/* «San Martín» con las olas del logo, blanco sobre fondo transparente */
function cboTexSanMartin(){
  return texRotulo3d(function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.strokeStyle = 'rgba(255,255,255,0.92)'; g.lineWidth = h * 0.035;
    for(var i = 0; i < 4; i++){
      g.beginPath();
      g.moveTo(w * 0.02, h * (0.30 + i * 0.12));
      g.bezierCurveTo(w * 0.10, h * (0.10 + i * 0.12), w * 0.18, h * (0.50 + i * 0.12), w * 0.26, h * (0.28 + i * 0.12));
      g.stroke();
    }
    g.fillStyle = '#FFFFFF'; g.textBaseline = 'middle'; g.textAlign = 'left';
    g.font = 'italic bold ' + Math.round(h * 0.42) + 'px Georgia, "Times New Roman", serif';
    g.fillText('San Martín', w * 0.30, h * 0.48, w * 0.68);
    g.font = 'bold ' + Math.round(h * 0.11) + 'px Arial, sans-serif';
    g.fillText('CONTRATISTAS GENERALES', w * 0.31, h * 0.80, w * 0.66);
  }, 512, 200);
}
/* rombo de peligro: clase 3 (rojo con llama) o 1.5D (naranja) */
function cboTexRombo(clase){
  return texRotulo3d(function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.fillStyle = clase === 3 ? '#C8201B' : '#F07A13';
    g.beginPath(); g.moveTo(w / 2, 4); g.lineTo(w - 4, h / 2); g.lineTo(w / 2, h - 4); g.lineTo(4, h / 2); g.closePath(); g.fill();
    var tinta = clase === 3 ? '#FFFFFF' : '#111111';
    g.strokeStyle = tinta; g.lineWidth = 5;
    g.beginPath(); g.moveTo(w / 2, 18); g.lineTo(w - 18, h / 2); g.lineTo(w / 2, h - 18); g.lineTo(18, h / 2); g.closePath(); g.stroke();
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    if(clase === 3){
      /* llama */
      g.beginPath(); g.moveTo(w * 0.42, h * 0.46); g.quadraticCurveTo(w * 0.36, h * 0.30, w * 0.50, h * 0.18);
      g.quadraticCurveTo(w * 0.47, h * 0.30, w * 0.56, h * 0.30); g.quadraticCurveTo(w * 0.66, h * 0.38, w * 0.58, h * 0.46); g.closePath(); g.fill();
      g.fillRect(w * 0.36, h * 0.48, w * 0.28, h * 0.03);
      g.font = 'bold ' + Math.round(h * 0.16) + 'px Arial, sans-serif'; g.fillText('3', w / 2, h * 0.80);
    } else {
      g.font = 'bold ' + Math.round(h * 0.20) + 'px Arial, sans-serif'; g.fillText('1.5D', w / 2, h * 0.50);
      g.font = 'bold ' + Math.round(h * 0.12) + 'px Arial, sans-serif'; g.fillText('1', w / 2, h * 0.80);
    }
  }, 256, 256);
}
/* panel naranja de las Naciones Unidas: arriba el codigo de riesgo, abajo el numero ONU */
function cboTexONU(arriba, abajo){
  return texRotulo3d(function(g, w, h){
    g.fillStyle = '#F07A13'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#111'; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8);
    g.fillStyle = '#111'; g.textAlign = 'center'; g.textBaseline = 'middle';
    if(arriba){
      g.fillRect(4, h / 2 - 3, w - 8, 6);
      g.font = 'bold ' + Math.round(h * 0.34) + 'px Arial, sans-serif';
      g.fillText(arriba, w / 2, h * 0.27); g.fillText(abajo, w / 2, h * 0.75);
    } else {
      g.font = 'bold ' + Math.round(h * 0.55) + 'px Arial, sans-serif'; g.fillText(abajo, w / 2, h * 0.55);
    }
  }, 256, 160);
}

/* plano con textura (letrero, calcomania); ry: 0 mira a +Z, PI a -Z, -PI/2 a -X, PI/2 a +X */
function cboPlano(C, tex, w, h, x, y, z, ry, transp){
  var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ map: tex, transparent: !!transp, roughness: 0.45, metalness: 0.05 }));
  m.position.set(x, y, z); m.rotation.y = ry;
  C.G.add(m);
  return m;
}
/* luz que brilla un poco (ambar, roja, azul, blanca) */
function cboLuz(C, code, w, h, d, hex, x, y, z, k){
  var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), emissive: new THREE.Color(hex), emissiveIntensity: k || 0.45, roughness: 0.2 }));
  m.position.set(x, y, z);
  return C.D.reg(code, m, hex);
}
/* rejilla: fondo oscuro con barras horizontales, mirando a -X */
function cboRejilla(C, code, x, y0, y1, z0, z1, n, hexB, tipoB, gruesa){
  var D = C.D;
  D.bloque(code, 0.03, y1 - y0, z1 - z0, 'mate', '#0B0C0E', x + 0.01, (y0 + y1) / 2, (z0 + z1) / 2, 0.01);
  var paso = (y1 - y0) / n;
  for(var i = 0; i <= n; i++){
    if((i === 0 || i === n) && !gruesa) continue;
    D.bloque(null, 0.04, paso * (gruesa ? 0.42 : 0.24), z1 - z0, tipoB || 'mate', hexB, x - 0.012, y0 + paso * i, (z0 + z1) / 2, 0.012);
  }
}
/* estrella de Mercedes: aro y tres brazos cromados, mirando a -X */
function cboEstrella(C, x, y, z, r){
  var D = C.D;
  D.pon(null, new THREE.TorusGeometry(r, r * 0.075, 10, 48), 'cromo', null, x, y, z, [0, Math.PI / 2, 0]);
  D.cilindro(null, r * 0.94, r * 0.94, 0.02, 'mate', '#15171A', x + 0.02, y, z, [0, 0, Math.PI / 2], 40);
  [90, 210, 330].forEach(function(gr){
    var a = gr * Math.PI / 180, w = r * 0.15, c = Math.cos(a), s = Math.sin(a);
    D.perfilX(null, [[z + r * 0.93 * c, y + r * 0.93 * s], [z - w * s, y + w * c], [z - w * 0.4 * c, y - w * 0.4 * s], [z + w * s, y - w * c]],
      0.03, x - 0.01, 'cromo', null, 0.004);
  });
}
/* separa una poligonal de su centro (marcos de vidrios) */
function cboEnsanchar(pts, d){
  var cx = 0, cy = 0;
  pts.forEach(function(p){ cx += p[0]; cy += p[1]; });
  cx /= pts.length; cy /= pts.length;
  return pts.map(function(p){
    var dx = p[0] - cx, dy = p[1] - cy, l = Math.hypot(dx, dy) || 1;
    return [p[0] + dx / l * d, p[1] + dy / l * d];
  });
}

/* ═══ bastidor, ejes, suspension, motor y lo que cuelga del chasis ═══ */
function cboChasis(C){
  var D = C.D, L = C.L, S = C.S, bl = D.bloque, tubo = D.tubo, cil = D.cilindro;
  var YF = L.YF, zR = L.zR, R = L.R, col = C.colChasis, E = L.ejes;
  var xF0 = L.xc0 + 0.10, xF1 = L.xFin, lar = xF1 - xF0, xm = (xF0 + xF1) / 2;
  /* largueros en C: alma afuera, alas hacia adentro */
  [-1, 1].forEach(function(s){
    bl('42023615', lar, 0.30, 0.022, 'pintura', col, xm, YF - 0.15, s * (zR + 0.035), 0.008);
    [YF - 0.011, YF - 0.289].forEach(function(y){ bl('42023615', lar, 0.022, 0.09, 'pintura', col, xm, y, s * zR, 0.006); });
    /* pernos de los travesanos en el alma */
  });
  var trav = [xF0 + 0.25, L.xCB + 0.05];
  for(var xt = L.xCB + 1.1; xt < xF1 - 0.4; xt += 1.25) trav.push(xt);
  trav.push(xF1 - 0.06);
  trav.forEach(function(x){ bl('42023615', 0.10, 0.24, zR * 2 + 0.04, 'pintura', col, x, YF - 0.15, 0, 0.012); });
  /* cubrecanto trasero con las luces y el paragolpes */
  bl(null, 0.12, 0.16, 2.30, 'pintura', col, xF1 + 0.02, YF - 0.45, 0, 0.02);
  [-1, 1].forEach(function(s){ bl(null, 0.08, 0.32, 0.08, 'pintura', col, xF1 - 0.02, YF - 0.30, s * 0.70, 0.01); });
  for(var f = 0; f < 10; f++) bl(null, 0.01, 0.10, 0.22, 'mate', f % 2 ? '#F2F2F2' : '#C62A1E', xF1 + 0.085, YF - 0.45, -1.0 + f * 0.222, 0.004);
  [-1, 1].forEach(function(s){
    bl(null, 0.08, 0.22, 0.46, 'mate', CBO_NEGRO, xF1 + 0.04, YF - 0.20, s * 0.86, 0.02);
    cboLuz(C, s > 0 ? 'FPI' : 'FPD', 0.02, 0.15, 0.13, '#C2241B', xF1 + 0.085, YF - 0.20, s * 1.00, 0.4);
    cboLuz(C, s > 0 ? 'FPI' : 'FPD', 0.02, 0.15, 0.10, '#F2A31A', xF1 + 0.085, YF - 0.20, s * 0.86, 0.4);
    cboLuz(C, 'LSM', 0.02, 0.15, 0.10, '#F4F1E6', xF1 + 0.085, YF - 0.20, s * 0.73, 0.3);
    /* faldones de goma detras del ultimo eje */
    bl(null, 0.02, 0.62, 0.60, 'goma', '#141618', E[E.length - 1] + L.R + 0.22, 0.52, s * L.zO, 0.01);
  });

  /* ═══ ejes delanteros: viga en I, munones, muelles, amortiguadores y frenos ═══ */
  for(var i = 0; i < L.nDel; i++){
    var xe = E[i];
    bl(null, 0.12, 0.15, L.zD * 2 - 0.62, 'pintura', col, xe, R - 0.06, 0, 0.03);
    [-1, 1].forEach(function(s){
      bl(null, 0.12, 0.15, 0.30, 'pintura', col, xe, R - 0.02, s * (L.zD - 0.40), 0.03, [s * 0.35, 0, 0]);
      cil(null, 0.07, 0.07, 0.30, 'metal', CBO_GRIS, xe, R, s * (L.zD - 0.30), null, 16);
      /* tambor de freno y masa, adentro del aro */
      cil(i === 0 ? (s > 0 ? 'BMLH' : 'BMRH') : null, L.rAro * 0.80, L.rAro * 0.80, 0.22, 'metal', CBO_GRIS, xe, R, s * (L.zD - 0.17), [Math.PI / 2, 0, 0], 28);
      /* paquete de muelles bajo el larguero, con sus gemelas */
      var hojas = [1.50, 1.32, 1.12, 0.90];
      hojas.forEach(function(lh, k){ bl('42020008', lh, 0.026, 0.09, 'metal', '#2C3035', xe, R + 0.10 + k * 0.03, s * zR, 0.008); });
      bl(null, 0.12, 0.10, 0.12, 'metal', CBO_GRIS, xe, R + 0.06, s * zR, 0.02);
      [-0.74, 0.74].forEach(function(dx){
        bl(null, 0.08, YF - 0.30 - (R + 0.10), 0.07, 'pintura', col, xe + dx, (YF - 0.30 + R + 0.10) / 2, s * zR, 0.01);
      });
      /* amortiguador inclinado */
      D.cilHidD(s > 0 ? 'SDI' : 'SDD', [xe + 0.20, R + 0.08, s * (zR + 0.12)], [xe + 0.35, YF - 0.10, s * (zR + 0.10)], 0.035, '#2E3236', 0.55);
    });
    /* barra de acoplamiento */
    tubo(null, [xe + 0.22, R - 0.02, -(L.zD - 0.36)], [xe + 0.22, R - 0.02, L.zD - 0.36], 0.025, 'metal', CBO_GRIS, 10);
  }
  /* caja de direccion a la izquierda adelante y la barra de mando a los munones */
  bl('CDR', 0.26, 0.24, 0.20, 'metal', CBO_GRIS, E[0] - 0.62, YF - 0.20, zR + 0.16, 0.03);
  cil(null, 0.04, 0.04, 0.16, 'metal', '#2E3236', E[0] - 0.62, YF - 0.38, zR + 0.16, null, 10);
  tubo(null, [E[0] - 0.62, YF - 0.42, zR + 0.18], [E[0] - 0.08, R + 0.10, L.zD - 0.36], 0.03, 'metal', CBO_GRIS, 10);
  if(L.nDel === 2) tubo(null, [E[0] - 0.02, R + 0.12, zR + 0.20], [E[1] - 0.10, R + 0.12, zR + 0.20], 0.03, 'metal', CBO_GRIS, 10);

  /* ═══ motor (seis en linea), radiador, caja y ejes cardan bajo la cabina ═══ */
  var xm0 = L.xc0 + 0.30, xm1 = L.xc0 + 1.55;
  bl('RAD1', 0.12, 0.85, 1.00, 'metal', CBO_GRIS, xm0 - 0.10, YF + 0.05, 0, 0.02);
  bl('ENG1', xm1 - xm0, 0.62, 0.62, 'metal', CBO_GRIS, (xm0 + xm1) / 2, YF - 0.05, 0, 0.05);
  bl('ENG1', xm1 - xm0 - 0.10, 0.20, 0.42, 'metal', CBO_GRIS2, (xm0 + xm1) / 2, YF + 0.34, 0, 0.04);
  bl('ENG1', xm1 - xm0 - 0.20, 0.24, 0.50, 'metal', '#2E3236', (xm0 + xm1) / 2, YF - 0.45, 0, 0.04);
  cil('42001655', 0.09, 0.09, 0.22, 'metal', CBO_GRIS2, xm0 + 0.12, YF + 0.05, -0.38, [0, 0, Math.PI / 2], 16);
  cil('AL1', 0.10, 0.10, 0.24, 'metal', '#9AA1A8', xm0 + 0.14, YF + 0.20, 0.36, [0, 0, Math.PI / 2], 18);
  cil('AR1', 0.07, 0.07, 0.30, 'metal', '#2E3236', xm1 - 0.15, YF - 0.30, -0.36, [0, 0, Math.PI / 2], 14);
  D.pon(null, new THREE.TorusGeometry(0.11, 0.06, 10, 18), 'metal', '#6B7178', xm1 - 0.30, YF + 0.30, -0.42, [0, Math.PI / 2, 0]);
  cil('CMP', 0.08, 0.08, 0.24, 'metal', CBO_GRIS2, xm0 + 0.50, YF - 0.08, 0.40, [0, 0, Math.PI / 2], 14);
  var xg1 = xm1 + 0.85;
  cil('TRM', 0.27, 0.22, xg1 - xm1, 'metal', CBO_GRIS, (xm1 + xg1) / 2, YF - 0.12, 0, [0, 0, Math.PI / 2], 24);
  /* cardan al primer eje motriz y entre los ejes del bogie */
  var xT1 = E[L.nDel], xT2 = E[L.nDel + 1];
  tubo(null, [xg1, YF - 0.15, 0], [xT1 - 0.30, R + 0.05, 0], 0.055, 'metal', '#9AA1A8', 14);
  tubo(null, [xT1 + 0.25, R + 0.12, 0], [xT2 - 0.30, R + 0.05, 0], 0.05, 'metal', '#9AA1A8', 14);
  if(L.nDel === 2){
    /* soporte central del cardan largo */
    bl(null, 0.10, 0.20, 0.30, 'pintura', col, (xg1 + xT1) / 2, YF - 0.30, 0, 0.02);
  }

  /* ═══ bogie trasero: puentes con reduccion en las masas, muelles de bogie ═══ */
  var xb = (xT1 + xT2) / 2;
  [xT1, xT2].forEach(function(x){
    tubo(null, [x, R, -(L.zI - L.A / 2 - 0.05)], [x, R, L.zI - L.A / 2 - 0.05], 0.10, 'pintura', col, 18);
    D.pon('DIFP', new THREE.SphereGeometry(0.27, 24, 16), 'pintura', col, x, R, 0.06);
    cil('DIFP', 0.15, 0.20, 0.30, 'pintura', col, x - 0.28, R + 0.03, 0.06, [0, 0, Math.PI / 2], 18);
    [-1, 1].forEach(function(s){
      cil(s > 0 ? 'BPLH' : 'BPRH', L.rAro * 0.80, L.rAro * 0.80, 0.24, 'metal', CBO_GRIS, x, R, s * (L.zI - L.A / 2 - 0.10), [Math.PI / 2, 0, 0], 28);
      /* pulmon de freno detras del puente */
      cil('42066068', 0.10, 0.10, 0.20, 'metal', '#2C3035', x + 0.24, R + 0.06, s * (L.zI - L.A / 2 - 0.30), [Math.PI / 2, 0, 0], 16);
      tubo('21003297', [x + 0.24, R + 0.10, s * (L.zI - L.A / 2 - 0.40)], [x + 0.10, YF - 0.30, s * zR], 0.012, 'goma', '#1A1C1F', 6);
    });
    /* barras de reaccion en V arriba de cada puente */
    tubo(null, [x, R + 0.24, 0.06], [x + (x < xb ? 0.55 : -0.55), YF - 0.25, zR - 0.05], 0.035, 'metal', CBO_GRIS, 10);
    tubo(null, [x, R + 0.24, 0.06], [x + (x < xb ? 0.55 : -0.55), YF - 0.25, -zR + 0.05], 0.035, 'metal', CBO_GRIS, 10);
  });
  [-1, 1].forEach(function(s){
    var zm = s * (zR + 0.08);
    /* soporte del eje de muñón y el paquete de muelles del bogie */
    bl(null, 0.42, YF - 0.30 - (R + 0.30), 0.10, 'pintura', col, xb, (YF - 0.30 + R + 0.30) / 2, s * (zR + 0.04), 0.02);
    cil(null, 0.10, 0.10, 0.22, 'metal', CBO_GRIS, xb, R + 0.30, zm, [Math.PI / 2, 0, 0], 18);
    var largo = xT2 - xT1 + 0.25;
    [1.0, 0.82, 0.66, 0.50, 0.36].forEach(function(f, k){
      bl(s > 0 ? '42041233' : 'SPD', largo * f, 0.032, 0.10, 'metal', '#2C3035', xb, R + 0.14 + k * 0.034, zm, 0.008);
    });
    bl(null, 0.16, 0.16, 0.14, 'metal', CBO_GRIS, xb, R + 0.22, zm, 0.02);
  });

  /* ═══ cañerias de aire y el arnes a lo largo del bastidor ═══ */
  [-1, 1].forEach(function(s){
    tubo('LPA', [xF0 + 0.3, YF - 0.06, s * (zR - 0.08)], [xF1 - 0.3, YF - 0.06, s * (zR - 0.08)], 0.012, 'goma', '#2A2D31', 6);
  });
  tubo('HAR', [xF0 + 0.3, YF - 0.22, zR - 0.06], [xF1 - 0.2, YF - 0.22, zR - 0.06], 0.018, 'goma', '#1B1D20', 6);
}

/* lo que va colgado afuera de los largueros entre los ejes */
function cboEquipChasis(C, op){
  var D = C.D, L = C.L, bl = D.bloque, cil = D.cilindro, YF = L.YF, zR = L.zR, E = L.ejes;
  var xa = E[L.nDel - 1] + L.R + 0.18, xz = E[L.nDel] - L.R - 0.18;
  if(op.xa) xa = op.xa;
  /* tanque de combustible a la izquierda: aluminio, con zunchos, tapa y escalon */
  var lt = Math.min(op.lTanque || 1.10, xz - xa - 0.05), xt = xa + lt / 2, zt = zR + 0.10 + 0.32;
  bl('TQC1', lt, 0.62, 0.64, 'metal', '#C6CBD0', xt, YF - 0.40, zt, 0.12);
  [-0.30, 0.30].forEach(function(d){
    bl(null, 0.05, 0.66, 0.68, 'mate', CBO_NEGRO, xt + d * lt / 1.2, YF - 0.40, zt, 0.01);
  });
  cil(null, 0.07, 0.07, 0.06, 'mate', CBO_NEGRO, xt - lt * 0.30, YF - 0.06, zt + 0.08, null, 16);
  bl(null, 0.04, 0.08, 0.30, 'pintura', C.colChasis, xa - 0.02, YF - 0.24, zR + 0.22, 0.01);
  /* a la derecha: caja de baterias, tanques de aire y lo que pida el cuerpo */
  var xbat = op.xBat || xa + 0.33;
  bl('BAT', 0.62, 0.48, 0.52, 'mate', CBO_PLAST, xbat, YF - 0.34, -(zR + 0.36), 0.04);
  bl(null, 0.64, 0.04, 0.54, 'mate', '#2E3236', xbat, YF - 0.08, -(zR + 0.36), 0.01);
  [-0.2, 0.2].forEach(function(d){ bl(null, 0.08, 0.05, 0.05, 'mate', '#C9A13A', xbat + d, YF - 0.20, -(zR + 0.63), 0.01); });
  var xaire = xbat + 0.85;
  if(xaire + 0.35 < xz) [0, 1].forEach(function(k){ cil('LPA', 0.12, 0.12, 0.70, 'pintura', '#2B2F34', xaire, YF - 0.28 - k * 0.27, -(zR + 0.18), [0, 0, Math.PI / 2], 18); });
  /* sistema de engrase centralizado: bomba con su deposito transparente */
  var xse = op.xSen || xz - 0.25;
  bl('SEN', 0.22, 0.26, 0.20, 'mate', '#2C3035', xse, YF - 0.25, zR + 0.15, 0.02);
  D.cilindro('SEN', 0.08, 0.08, 0.22, 'vidrio', '#D8C892', xse, YF - 0.0, zR + 0.15, null, 16);
  /* modulos electronicos y sensores */
  bl('EC', 0.24, 0.18, 0.08, 'mate', '#2A2D31', L.xCB + 0.25, YF - 0.12, zR + 0.10, 0.02);
  bl('SENS', 0.06, 0.06, 0.06, 'mate', CBO_GRIS2, E[L.nDel] - 0.22, L.R + 0.25, zR - 0.02, 0.01);
  /* defensas laterales entre los ejes (cisternas y ANFO) */
  if(op.defensa){
    [-1, 1].forEach(function(s){
      [0.55, 0.85].forEach(function(y){ bl(null, xz - xa + 0.1, 0.08, 0.04, 'pintura', op.defensa, (xa + xz) / 2, y, s * 1.17, 0.015); });
      [xa + 0.05, (xa + xz) / 2, xz - 0.05].forEach(function(x){ bl(null, 0.05, YF - 0.45, 0.05, 'pintura', C.colChasis, x, (YF + 0.45) / 2 - 0.05, s * 1.13, 0.01); });
    });
  }
}

/* ═══ cabina ═══ */
function cboCabina(C){
  var D = C.D, L = C.L, S = C.S, bl = D.bloque, tubo = D.tubo;
  var X0 = L.xc0, Y0 = L.Y0, H = L.H, W = L.W, Lc = L.Lc, rk = L.rake, wsb = Y0 + L.wsb, wst = Y0 + L.wst;
  var col = C.colCab, techo = Y0 + H, SZ = W / 2, FX = X0 - 0.045;
  /* casco: el perfil de costado extruido a lo ancho, con el faldon bajo el frente */
  D.perfil('CBN', [[X0, Y0 - 0.30], [X0 - 0.01, wsb], [X0 + rk, wst], [X0 + rk + 0.09, techo - 0.05], [X0 + rk + 0.26, techo],
    [X0 + Lc, techo], [X0 + Lc, Y0], [X0 + 0.80, Y0], [X0 + 0.58, Y0 - 0.30]], W, 0, 'pintura', col, 0.07);
  /* parabrisas con su marco negro */
  var dy = wst - wsb, Ls = Math.hypot(rk, dy), a = Math.atan2(rk, dy), nx = -Math.cos(a), ny = Math.sin(a);
  var cx = X0 + rk / 2 - 0.005, cy = (wsb + wst) / 2;
  bl(null, 0.02, Ls + 0.06, W - 0.14, 'mate', '#0F1012', cx + nx * 0.040, cy + ny * 0.040, 0, 0.008, [0, 0, -a]);
  bl(null, 0.02, Ls - 0.06, W - 0.30, 'vidrio', CBO_VIDRIO, cx + nx * 0.054, cy + ny * 0.054, 0, 0.006, [0, 0, -a]);
  /* limpiaparabrisas */
  [-0.62, 0.18].forEach(function(z){
    tubo(null, [X0 - 0.09, wsb + 0.07, z], [X0 - 0.09 + rk * 0.35, wsb + 0.07 + dy * 0.35, z + 0.52], 0.010, 'mate', '#0E0F11', 6);
  });
  /* ventanas de las puertas con marco de goma, costuras, manijas y asideros */
  var dip = S.marca === 'SCANIA' ? 0.14 : 0.0;
  var vent = [[X0 + 0.16, wsb - dip], [X0 + 1.12, wsb + 0.02], [X0 + 1.12, wst - 0.05], [X0 + 0.16 + rk * 0.95, wst - 0.05], [X0 + 0.16 + rk * 0.15, wsb + 0.14]];
  [-1, 1].forEach(function(s){
    D.perfil(null, cboEnsanchar(vent, 0.05), 0.012, s * (SZ + 0.002), 'mate', '#0F1012', 0.004);
    D.perfil(null, vent, 0.012, s * (SZ + 0.010), 'vidrio', CBO_VIDRIO, 0.004);
    bl(null, 0.014, wsb - Y0 + 0.20, 0.008, 'mate', '#0E0F11', X0 + 0.09, Y0 - 0.08 + (wsb - Y0) / 2, s * (SZ + 0.002), 0.002);
    bl(null, 0.014, wst - Y0 + 0.02, 0.008, 'mate', '#0E0F11', X0 + 1.20, (Y0 + wst) / 2, s * (SZ + 0.002), 0.002);
    bl(null, 0.22, 0.05, 0.03, 'mate', CBO_NEGRO, X0 + 0.98, wsb - 0.13, s * (SZ + 0.014), 0.012);
    tubo(null, [X0 + 1.30, Y0 - 0.15, s * (SZ + 0.05)], [X0 + 1.30, wsb - 0.05, s * (SZ + 0.05)], 0.018, 'mate', CBO_NEGRO, 8);
    [Y0 - 0.12, wsb - 0.08].forEach(function(y){ tubo(null, [X0 + 1.30, y, s * SZ], [X0 + 1.30, y, s * (SZ + 0.05)], 0.014, 'mate', CBO_NEGRO, 6); });
    /* numero de la unidad en la puerta */
    if(C.texNumPuerta) cboPlano(C, C.texNumPuerta, 0.62, 0.19, X0 + 0.66, Y0 + 0.30, s * (SZ + 0.006), s > 0 ? 0 : Math.PI, true);
    /* espejos: brazo, retrovisor principal y gran angular */
    var zE = s * (SZ + 0.30);
    tubo(null, [X0 + 0.10, wst - 0.08, s * (SZ - 0.02)], [X0 - 0.04, wst - 0.02, zE], 0.022, 'mate', CBO_NEGRO, 8);
    tubo(null, [X0 + 0.10, wsb + 0.05, s * (SZ - 0.02)], [X0 - 0.04, wsb + 0.10, zE], 0.020, 'mate', CBO_NEGRO, 8);
    bl(null, 0.12, 0.46, 0.25, 'mate', CBO_NEGRO, X0 - 0.06, wst - 0.30, zE, 0.04);
    bl(null, 0.012, 0.42, 0.21, 'cromo', null, X0 + 0.005, wst - 0.30, zE, 0.004);
    bl(null, 0.11, 0.22, 0.22, 'mate', CBO_NEGRO, X0 - 0.06, wsb + 0.20, zE, 0.04);
    bl(null, 0.012, 0.18, 0.18, 'cromo', null, X0 + 0.0, wsb + 0.20, zE, 0.004);
    /* escalones bajo la puerta, delante de la rueda */
    var xs0 = X0 + 0.62, xs1 = L.ejes[0] - L.R - 0.07, xsm = (xs0 + xs1) / 2, ws = xs1 - xs0;
    bl(null, ws, Y0 - 0.40, 0.34, 'mate', CBO_PLAST, xsm, (Y0 + 0.40) / 2, s * (SZ - 0.26), 0.03);
    var nEsc = Math.max(2, Math.round((Y0 - 0.45) / 0.36));
    for(var k = 0; k < nEsc; k++){
      var ye = 0.46 + k * (Y0 - 0.46) / nEsc;
      bl(null, ws - 0.04, 0.04, 0.30, 'metal', '#8B9198', xsm, ye, s * (SZ - 0.19), 0.008);
      bl(null, ws - 0.02, 0.10, 0.02, 'mate', CBO_PLAST, xsm, ye - 0.04, s * (SZ - 0.04), 0.006);
    }
  });
  /* espejo de acera sobre el parabrisas, del lado derecho */
  tubo(null, [X0 + rk + 0.10, techo - 0.02, -SZ + 0.25], [X0 - 0.10, techo - 0.10, -SZ + 0.30], 0.018, 'mate', CBO_NEGRO, 8);
  bl(null, 0.20, 0.20, 0.24, 'mate', CBO_NEGRO, X0 - 0.12, techo - 0.22, -SZ + 0.30, 0.04, [0, 0, 0.5]);
  /* visera sobre el parabrisas con luces de galibo */
  var visera = C.colVisera || col;
  bl('CBN', 0.34, 0.05, W - 0.18, 'pintura', visera, X0 + rk - 0.02, techo - 0.01, 0, 0.02, [0, 0, -0.10]);
  for(var m = 0; m < 5; m++) cboLuz(C, 'LSM', 0.06, 0.03, 0.10, '#F0A41C', X0 + rk - 0.18, techo - 0.05, -0.80 + m * 0.40, 0.4);
  /* techo: escotilla y baliza; reflector («faro pirata») giratorio adelante a la izquierda */
  bl(null, 0.62, 0.05, 0.62, 'mate', '#2A2D31', X0 + Lc * 0.62, techo + 0.055, 0, 0.02);
  var xBal = C.cuerpo === 'VOLQUETE' ? X0 + rk + 0.45 : X0 + Lc - 0.35;
  D.cilindro('CIR', 0.11, 0.12, 0.06, 'mate', CBO_NEGRO, xBal, techo + 0.07, 0.35, null, 20);
  var bal = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.10, 0.17, 20),
    new THREE.MeshPhysicalMaterial({ color: new THREE.Color(C.colBaliza), emissive: new THREE.Color(C.colBaliza), emissiveIntensity: 0.5,
      roughness: 0.15, transparent: true, opacity: 0.9, clearcoat: 1 }));
  bal.position.set(xBal, techo + 0.18, 0.35); D.reg('CIR', bal, C.colBaliza);
  D.cilindro(null, 0.04, 0.04, 0.16, 'mate', CBO_NEGRO, X0 + rk + 0.45, techo + 0.10, SZ - 0.30, null, 10);
  D.cilindro('FPR', 0.10, 0.10, 0.16, 'mate', CBO_NEGRO, X0 + rk + 0.40, techo + 0.25, SZ - 0.30, [0, 0, Math.PI / 2], 18);
  D.cilindro(null, 0.085, 0.085, 0.01, 'vidrio', '#F4EDCF', X0 + rk + 0.31, techo + 0.25, SZ - 0.30, [0, 0, Math.PI / 2], 18);
  /* espalda de la cabina: ventanita y el arnes que baja al chasis */
  bl(null, 0.02, 0.40, 0.80, 'mate', '#0F1012', X0 + Lc + 0.044, wsb + 0.25, 0.25, 0.01);
  bl(null, 0.02, 0.32, 0.72, 'vidrio', CBO_VIDRIO, X0 + Lc + 0.050, wsb + 0.25, 0.25, 0.01);
  /* guardafangos delanteros: arcos negros sobre cada rueda y faldon */
  for(var i = 0; i < L.nDel; i++){
    [-1, 1].forEach(function(s){
      var arco = new THREE.Shape(), r1 = L.R + 0.10, r0 = L.R + 0.05;
      arco.absarc(0, 0, r1, 0.15, Math.PI - 0.15, false);
      arco.absarc(0, 0, r0, Math.PI - 0.15, 0.15, true);
      var gA = new THREE.ExtrudeGeometry(arco, { depth: L.A + 0.12, bevelEnabled: false, curveSegments: 18 });
      gA.translate(0, 0, -(L.A + 0.12) / 2);
      D.pon(null, gA, 'mate', CBO_PLAST, L.ejes[i], L.R, s * L.zD);
      bl(null, 0.02, 0.48, L.A + 0.10, 'goma', '#141618', L.ejes[i] + L.R + 0.12, 0.40, s * L.zD, 0.01);
    });
  }
  /* toma de aire alta detras de la cabina (izquierda) y escape vertical (derecha) */
  var xe = X0 + Lc + 0.16;
  if(S.marca === 'SCANIA' && S.cab === 'G'){
    /* cabina G: la toma de aire va en el costado izquierdo de la cabina, detras
       de la puerta: rejilla negra de lamas en un marco, y el ducto baja por detras */
    var xa0 = X0 + 1.27, xa1 = X0 + Lc - 0.08, ya0 = wsb - 0.10, ya1 = wst - 0.04;
    bl(null, xa1 - xa0 + 0.06, ya1 - ya0 + 0.06, 0.03, 'mate', '#0D0E10', (xa0 + xa1) / 2, (ya0 + ya1) / 2, SZ + 0.010, 0.012);
    for(var la = 0; la < 7; la++){
      var lm = bl(null, xa1 - xa0, 0.035, 0.04, 'mate', '#25282C', (xa0 + xa1) / 2, ya0 + 0.05 + la * (ya1 - ya0 - 0.10) / 6, SZ + 0.028, 0.006);
      lm.rotation.x = -0.5;
    }
    bl(null, 0.20, 0.55, 0.26, 'mate', CBO_PLAST, xe - 0.02, wsb - 0.05, SZ - 0.20, 0.04);
    tubo(null, [xe, wsb - 0.30, SZ - 0.20], [xe, Y0 - 0.15, SZ - 0.45], 0.08, 'goma', '#1B1D20', 12);
  } else {
    bl(null, 0.22, techo - wsb + 0.30, 0.30, 'pintura', col, xe, (wsb + techo + 0.30) / 2 - 0.15, SZ - 0.22, 0.05);
    bl(null, 0.30, 0.12, 0.38, 'mate', CBO_NEGRO, xe, techo + 0.20, SZ - 0.22, 0.04);
    tubo(null, [xe, wsb - 0.10, SZ - 0.22], [xe, Y0 - 0.15, SZ - 0.45], 0.08, 'goma', '#1B1D20', 12);
  }
  D.cilindro(null, 0.075, 0.075, techo - L.YF + 0.15, 'metal', '#A9AFB5', xe, (L.YF + techo + 0.15) / 2, -SZ + 0.22, null, 18);
  bl(null, 0.06, 1.0, 0.20, 'metal', '#C2C7CC', xe - 0.08, techo - 0.55, -SZ + 0.22, 0.01);
  bl(null, 0.62, 0.40, 0.44, 'metal', '#9AA1A8', xe + 0.10, L.YF - 0.10, -(L.zR + 0.30), 0.06);
  D.cilindro('42064643', 0.08, 0.08, 0.20, 'metal', CBO_GRIS, xe - 0.30, L.YF + 0.02, -(L.zR + 0.10), [0, 0, Math.PI / 2], 14);
}

/* ═══ frente Scania: parrilla negra con SCANIA, grifo, faros con guia de luz ═══ */
function cboFrenteScania(C){
  var D = C.D, L = C.L, S = C.S, bl = D.bloque;
  var X0 = L.xc0, Y0 = L.Y0, W = L.W, FX = X0 - 0.045, wsb = Y0 + L.wsb;
  var xt = C.cuerpo === 'VOLQUETE', NEG = '#121316', PLATA = '#C9CED3';
  /* Scania de la generacion actual (NTG, 2016-): la parrilla negra alta ocupa
     casi todo el frente entre el parabrisas y los faros; las esquinas quedan
     del color de la cabina y bajan hasta los faros, que van en las esquinas
     bajas con su guia de luz LED inclinada. Arriba SCANIA en letras plateadas
     (en los de San Martin con la cinta lima debajo), al medio las lamas del
     radiador, abajo la toma del condensador entre los faros. */
  var gy0 = Y0 + 0.11, gy1 = wsb - 0.015, gw = W - 0.50, gm = (gy0 + gy1) / 2;
  /* el panel sobresale un poco y tiene canto redondeado: no es una calcomania */
  bl('RAD1', 0.07, gy1 - gy0, gw, 'pintura', NEG, FX - 0.02, gm, 0, 0.035);
  /* moldura plateada fina bajo el parabrisas y canto inferior */
  bl(null, 0.03, 0.022, gw - 0.10, 'metal', PLATA, FX - 0.058, gy1 - 0.05, 0, 0.008);
  C.D.letrero(cboTexLetras('SCANIA', NEG, '#DCE0E4', true, 1024, 140), 1.30, 0.18, FX - 0.057, gy1 - 0.22, 0, -Math.PI / 2);
  if(C.cinta) bl(null, 0.012, 0.05, 1.30, 'mate', CBO_LIMA, FX - 0.058, gy1 - 0.345, 0, 0.004);
  /* lamas del radiador: cuatro barras negras brillantes con filo plateado */
  var ly0 = gy0 + 0.26, ly1 = gy1 - 0.42, nL = 4;
  bl('RAD1', 0.02, ly1 - ly0, gw - 0.20, 'mate', '#060708', FX - 0.058, (ly0 + ly1) / 2, 0, 0.006);
  for(var i = 0; i < nL; i++){
    var yl = ly0 + (i + 0.5) * (ly1 - ly0) / nL;
    bl(null, 0.06, (ly1 - ly0) / nL * 0.55, gw - 0.24, 'pintura', '#1B1D21', FX - 0.07, yl, 0, 0.012);
    bl(null, 0.01, 0.010, gw - 0.26, 'metal', '#7E858D', FX - 0.10, yl + (ly1 - ly0) / nL * 0.27, 0, 0.003);
  }
  /* toma baja del condensador del aire, entre los faros */
  cboRejilla(C, 'AAC', FX - 0.06, Y0 - 0.22, Y0 + 0.07, -W / 2 + 0.70, W / 2 - 0.70, 3, '#2A2D31', 'mate');
  /* emblemas como en la foto de la entrega: G540 y XT abajo a la derecha del
     camion (izquierda de quien lo mira), el grifo en su medallon abajo a la izquierda */
  C.D.letrero(cboTexLetras(S.nombre, NEG, PLATA, false, 256, 64), 0.26, 0.065, FX - 0.057, gy0 + 0.13, -gw / 2 + 0.22, -Math.PI / 2);
  if(xt) C.D.letrero(cboTexLetras('XT', NEG, '#E8521E', false, 128, 64), 0.11, 0.055, FX - 0.057, gy0 + 0.13, -gw / 2 + 0.43, -Math.PI / 2);
  D.pon(null, new THREE.TorusGeometry(0.075, 0.010, 8, 32), 'cromo', null, FX - 0.06, gy0 + 0.13, gw / 2 - 0.22, [0, Math.PI / 2, 0]);
  cboPlano(C, cboTexGrifo(), 0.15, 0.15, FX - 0.058, gy0 + 0.13, gw / 2 - 0.22, -Math.PI / 2, true);
  /* faldon bajo el frente: negro en el XT, del color de la cabina en los demas */
  bl(null, 0.04, 0.40, W - 0.10, 'mate', xt ? CBO_PLAST : '#2A2D31', FX - 0.012, Y0 - 0.10, 0, 0.012);
  /* deflectores de viento en las esquinas: aleta del color de la cabina que
     sigue el pilar A, separada de la puerta por una junta negra */
  var dyw = L.wst - L.wsb;
  [-1, 1].forEach(function(s){
    var zd = s * (W / 2 + 0.035);
    D.perfil('CBN', [[X0 - 0.07, Y0 - 0.04], [X0 + 0.20, Y0 - 0.04], [X0 + 0.20 + L.rake * 0.9, Y0 + L.wst - 0.10],
      [X0 - 0.05 + L.rake * 0.9, Y0 + L.wst - 0.10], [X0 - 0.08, wsb]], 0.05, zd, 'pintura', C.colCab, 0.02);
    D.perfil(null, [[X0 + 0.21, Y0 - 0.02], [X0 + 0.235, Y0 - 0.02], [X0 + 0.235 + L.rake * 0.9, Y0 + L.wst - 0.12], [X0 + 0.21 + L.rake * 0.9, Y0 + L.wst - 0.12]],
      0.02, s * (W / 2 + 0.012), 'mate', '#0B0C0E', 0.004);
    /* faros bajo las esquinas de la parrilla: caja en trapecio (sube hacia la
       esquina de la cabina), mica, tres lentes y la guia de luz LED por el canto
       de arriba, como en la foto de la entrega */
    var zi = s * (W / 2 - 0.66), zo = s * (W / 2 - 0.05), yb = Y0 - 0.20;
    var tr = [[zi, yb + 0.03], [zo, yb], [zo, yb + 0.30], [zi, yb + 0.21]];
    if(s < 0) tr.reverse();
    D.perfilX(null, tr, 0.08, FX - 0.025, 'mate', '#0D0E10', 0.01);
    D.perfilX(s > 0 ? 'FDI' : 'FDD', cboEnsanchar(tr, -0.025), 0.02, FX - 0.072, 'vidrio', '#9FB0BC', 0.004);
    [0.22, 0.48, 0.74].forEach(function(f, k){
      D.faro(s > 0 ? 'FDI' : 'FDD', FX - 0.035, yb + 0.12 + f * 0.04, zi + (zo - zi) * f, k === 1 ? 0.058 : 0.048);
    });
    var lz = Math.abs(zo - zi) - 0.04, ang = Math.atan2(0.09, lz);
    cboLuz(C, 'LSM', 0.012, 0.026, lz, '#FFFFFF', FX - 0.088, yb + 0.235, (zi + zo) / 2, 0.95).rotation.x = -s * ang;
    cboLuz(C, 'LSM', 0.012, 0.10, 0.03, '#F2A31A', FX - 0.088, yb + 0.16, zo - s * 0.04, 0.6);
    /* esquina del faldon: protector negro en el XT */
    if(xt) bl(null, 0.16, 0.30, 0.12, 'mate', CBO_PLAST, FX + 0.03, Y0 - 0.15, s * (W / 2 - 0.03), 0.03);
  });
}

/* ═══ frente Mercedes-Benz: Actros, Arocs o Axor ═══ */
function cboFrenteMB(C){
  var D = C.D, L = C.L, S = C.S, bl = D.bloque;
  var X0 = L.xc0, Y0 = L.Y0, W = L.W, FX = X0 - 0.045, wsb = Y0 + L.wsb, serie = S.cab;
  var gw = serie === 'AROCS' ? 1.60 : serie === 'AXOR' ? 1.25 : 1.40;
  var gy0 = Y0 + (serie === 'AROCS' ? 0.02 : 0.20), gy1 = wsb - 0.06;
  /* marco de la parrilla y lamas: Arocs gruesas en gris oscuro, Actros plata, Axor negro con marco cromado */
  bl(null, 0.03, gy1 - gy0 + 0.06, gw + 0.06, serie === 'AXOR' ? 'cromo' : 'mate', serie === 'AXOR' ? null : '#1C1E21', FX - 0.012, (gy0 + gy1) / 2, 0, 0.02);
  if(serie === 'AROCS') cboRejilla(C, 'RAD1', FX - 0.03, gy0, gy1, -gw / 2, gw / 2, 4, '#3A3F45', 'pintura', true);
  else if(serie === 'ACTROS') cboRejilla(C, 'RAD1', FX - 0.03, gy0, gy1, -gw / 2, gw / 2, 5, '#B8BEC4', 'metal', false);
  else cboRejilla(C, 'RAD1', FX - 0.03, gy0, gy1, -gw / 2, gw / 2, 7, '#24272A', 'pintura', false);
  /* la estrella al medio */
  cboEstrella(C, FX - 0.07, (gy0 + gy1) / 2 + 0.02, 0, serie === 'AROCS' ? 0.21 : 0.17);
  /* nombre de la serie en la puerta y Mercedes-Benz en la visera */
  [-1, 1].forEach(function(s){
    C.D.letrero(cboTexLetras(serie, C.colCab, '#5A6067', true, 512, 80), 0.62, 0.09, X0 + 0.72, wsb - 0.30, s * (W / 2 + 0.004), s > 0 ? 0 : Math.PI);
  });
  /* aletas de las esquinas (deflectores) en color de la cabina */
  [-1, 1].forEach(function(s){
    bl('CBN', 0.20, wsb - Y0 + 0.10, 0.08, 'pintura', C.colCab, X0 + 0.06, (Y0 + wsb) / 2 + 0.02, s * (W / 2 + 0.02), 0.03);
  });
  /* faldon bajo la parrilla con el escalon del parabrisas */
  bl(null, 0.03, 0.30, W - 0.06, 'mate', serie === 'AROCS' ? '#2A2D31' : C.colCab, FX - 0.012, Y0 - 0.15, 0, 0.01);
  bl(null, 0.20, 0.04, 0.60, 'metal', '#8B9198', FX - 0.10, Y0 - 0.06, 0, 0.008);
}

/* ═══ frente Foton Auman ═══ */
function cboFrenteFoton(C){
  var D = C.D, L = C.L, bl = D.bloque;
  var X0 = L.xc0, Y0 = L.Y0, W = L.W, FX = X0 - 0.045, wsb = Y0 + L.wsb;
  var gw = 1.50, gy0 = Y0 + 0.16, gy1 = wsb - 0.24;
  bl(null, 0.03, gy1 - gy0 + 0.06, gw + 0.06, 'cromo', null, FX - 0.012, (gy0 + gy1) / 2, 0, 0.02);
  cboRejilla(C, 'RAD1', FX - 0.03, gy0, gy1, -gw / 2, gw / 2, 4, '#C9CED3', 'cromo', false);
  C.D.letrero(cboTexLetras('FOTON', C.colCab, '#4A5057', true, 512, 80), 0.80, 0.12, FX - 0.022, wsb - 0.13, 0, -Math.PI / 2);
  cboPlano(C, cboTexFoton(), 0.20, 0.20, FX - 0.06, (gy0 + gy1) / 2, 0, -Math.PI / 2, true);
  bl(null, 0.03, 0.30, W - 0.06, 'mate', '#9AA0A6', FX - 0.012, Y0 - 0.15, 0, 0.01);
  [-1, 1].forEach(function(s){
    var zf = s * (W / 2 - 0.26);
    bl(null, 0.06, 0.22, 0.38, 'mate', '#15171A', FX - 0.02, Y0 + 0.04, zf, 0.03);
    bl(s > 0 ? 'FDI' : 'FDD', 0.02, 0.17, 0.34, 'vidrio', '#B9C4CC', FX - 0.052, Y0 + 0.04, zf, 0.01);
    D.faro(s > 0 ? 'FDI' : 'FDD', FX - 0.01, Y0 + 0.04, zf, 0.06);
  });
  [-1, 1].forEach(function(s){
    C.D.letrero(cboTexLetras('AUMAN', C.colCab, '#5A6067', true, 512, 80), 0.55, 0.08, X0 + 0.72, wsb - 0.30, s * (W / 2 + 0.004), s > 0 ? 0 : Math.PI);
  });
}

/* ═══ parachoques ═══ */
function cboParachoques(C){
  var D = C.D, L = C.L, S = C.S, bl = D.bloque;
  var by0 = L.R < 0.56 ? 0.40 : 0.46, by1 = L.Y0 - 0.30, xb = L.xB, W = L.W;
  if(S.marca === 'SCANIA') return cboParachoquesScania(C, by0, by1);
  var hexP = S.marca === 'SCANIA' ? (C.cuerpo === 'VOLQUETE' ? '#24272B' : '#3A3F45') : S.cab === 'AROCS' ? '#2A2D31' : '#6E757C';
  var tipo = S.marca === 'SCANIA' && C.cuerpo === 'VOLQUETE' ? 'mate' : 'pintura';
  bl('42023615', 0.26, by1 - by0, W - 0.06, tipo, hexP, xb + 0.13, (by0 + by1) / 2, 0, 0.04);
  /* placa de proteccion abajo y el pasador de remolque al medio */
  bl(null, 0.40, 0.03, 1.40, 'metal', '#4A4F55', xb + 0.25, by0 - 0.02, 0, 0.01);
  bl(null, 0.12, 0.16, 0.24, 'metal', '#2E3236', xb - 0.03, by0 + 0.12, 0, 0.02);
  D.cilindro(null, 0.03, 0.03, 0.26, 'cromo', null, xb - 0.06, by0 + 0.12, 0, null, 10);
  /* escalones del parabrisas en el parachoques */
  [-0.45, 0.45].forEach(function(z){ bl(null, 0.04, 0.10, 0.32, 'mate', '#0E0F11', xb - 0.002, by1 - 0.10, z, 0.01); });
  /* neblineros en las esquinas; en Mercedes los faros principales tambien van aqui */
  [-1, 1].forEach(function(s){
    var zf = s * (W / 2 - 0.30);
    if(S.marca === 'MB'){
      bl(null, 0.04, 0.20, 0.42, 'mate', '#15171A', xb - 0.002, (by0 + by1) / 2 + 0.06, zf, 0.02);
      bl(s > 0 ? 'FDI' : 'FDD', 0.02, 0.15, 0.38, 'vidrio', '#C3CCD3', xb - 0.022, (by0 + by1) / 2 + 0.06, zf, 0.01);
      [-0.10, 0.08].forEach(function(dz){ D.faro(s > 0 ? 'FDI' : 'FDD', xb + 0.02, (by0 + by1) / 2 + 0.06, zf + s * dz, 0.055); });
      cboLuz(C, 'LSM', 0.01, 0.05, 0.10, '#F2A31A', xb - 0.03, (by0 + by1) / 2 + 0.06, s * (W / 2 - 0.05), 0.4);
    }
    D.faro('FNB', xb + 0.02, by0 + 0.12, zf, 0.06);
  });
}

/* parachoques Scania: al medio el cuerpo del parachoques (negro y alto en el XT,
   gris en los demas) con la placa reflectiva roja y blanca, el pasador y la
   placa de proteccion; a cada lado la esquina de subida con dos peldaños que
   se ven de frente y de costado, y el neblinero */
function cboParachoquesScania(C, by0, by1){
  var D = C.D, L = C.L, bl = D.bloque, xb = L.xB, W = L.W, X0 = L.xc0;
  var xt = C.cuerpo === 'VOLQUETE', hexP = xt ? '#1E2024' : '#4A5057', zc = W / 2 - 0.36;
  /* cuerpo central con la cara de arriba biselada hacia atras */
  bl('42023615', 0.22, by1 - by0 - 0.06, zc * 2, 'pintura', hexP, xb + 0.11, (by0 + by1) / 2 - 0.03, 0, 0.04);
  var tapa = bl('42023615', 0.20, 0.06, zc * 2, 'pintura', hexP, xb + 0.16, by1 - 0.04, 0, 0.02);
  tapa.rotation.z = -0.35;
  /* esquinas que se doblan hacia las ruedas */
  [-1, 1].forEach(function(s){
    var esq = bl('42023615', 0.22, by1 - by0 - 0.06, 0.20, 'pintura', hexP, xb + 0.17, (by0 + by1) / 2 - 0.03, s * (zc + 0.06), 0.04);
    esq.rotation.y = s * 0.45;
  });
  /* placa reflectiva roja y blanca al medio, y su marco */
  bl(null, 0.02, 0.17, 0.66, 'mate', '#0B0C0E', xb - 0.005, (by0 + by1) / 2 + 0.04, 0, 0.006);
  for(var f = 0; f < 6; f++) bl(null, 0.01, 0.12, 0.10, 'mate', f % 2 ? '#F2F2F2' : '#C62A1E', xb - 0.018, (by0 + by1) / 2 + 0.04, -0.25 + f * 0.10, 0.003);
  /* placa de proteccion y pasador de remolque */
  bl(null, 0.42, 0.03, zc * 2 - 0.2, 'metal', '#5A6067', xb + 0.25, by0 - 0.02, 0, 0.01);
  bl(null, 0.14, 0.16, 0.26, 'metal', '#2E3236', xb - 0.03, by0 + 0.12, 0, 0.02);
  D.cilindro(null, 0.03, 0.03, 0.28, 'cromo', null, xb - 0.07, by0 + 0.12, 0, null, 10);
  /* rendijas de los escalones del parabrisas */
  [-0.42, 0.42].forEach(function(z){ bl(null, 0.04, 0.08, 0.30, 'mate', '#060708', xb - 0.004, by1 - 0.14, z, 0.01); });
  [-1, 1].forEach(function(s){
    /* neblinero en el extremo del cuerpo central */
    D.faro('FNB', xb + 0.01, by0 + 0.16, s * (zc - 0.16), 0.055);
    /* esquina de subida: caja negra hundida con dos peldaños de rejilla */
    var ze = s * (W / 2 - 0.16), x0e = X0 + 0.02, x1e = X0 + 0.58;
    bl(null, x1e - x0e, by1 - 0.36, 0.30, 'mate', CBO_PLAST, (x0e + x1e) / 2 + 0.03, (by1 + 0.36) / 2, ze, 0.03);
    [0.48, (0.48 + by1) / 2 + 0.06].forEach(function(y){
      bl(null, x1e - x0e + 0.04, 0.035, 0.30, 'metal', '#8B9198', (x0e + x1e) / 2, y, ze + s * 0.02, 0.006);
      bl(null, 0.03, 0.08, 0.30, 'pintura', C.colCab, x0e - 0.02, y - 0.04, ze + s * 0.02, 0.008);
    });
  });
}

/* ═══ CUERPO: tolva de roca con cilindro frontal (G540 San Martin) ═══ */
function cboVolquete(C){
  var D = C.D, L = C.L, bl = D.bloque, est = D.esTolva, tubo = D.tubo;
  var YF = L.YF, YS = YF + 0.22, x0 = L.xCB + 0.44, x1 = x0 + 6.25, xc = x1 - 1.25, YB = YS + 1.58, ZB = 1.30;
  var YH = L.Y0 + L.H + 0.16, xa = L.xCB - 0.62;
  var AZ = C.colCuerpo, AZ2 = C.colCuerpo2;
  /* falso chasis fijo sobre los largueros */
  [-1, 1].forEach(function(s){ bl(null, L.xFin - x0 + 0.15, 0.16, 0.10, 'pintura', C.colChasis, (x0 + L.xFin) / 2 - 0.05, YF + 0.08, s * L.zR, 0.02); });
  /* largueros y travesanos bajo el piso */
  [-1, 1].forEach(function(s){ est(bl('TLV', xc - x0, 0.20, 0.14, 'pintura', AZ2, (x0 + xc) / 2, YS - 0.06, s * (L.zR + 0.02), 0.03)); });
  for(var k = 0; k < 9; k++) est(bl(null, 0.10, 0.14, ZB * 2 - 0.2, 'pintura', AZ2, x0 + 0.35 + k * (xc - x0 - 0.4) / 8, YS - 0.04, 0, 0.02));
  /* piso y cola inclinada (sin compuerta: tolva de roca) */
  est(bl('TLV', xc - x0, 0.10, ZB * 2 - 0.10, 'pintura', AZ, (x0 + xc) / 2, YS + 0.05, 0, 0.03));
  var cola = est(bl('TLV', Math.hypot(x1 - xc, 0.34), 0.12, ZB * 2 - 0.10, 'pintura', AZ, (xc + x1) / 2, YS + 0.05 + 0.17, 0, 0.03));
  cola.rotation.z = Math.atan2(0.34, x1 - xc);
  est(bl('TLV', 0.20, 0.22, ZB * 2 + 0.10, 'pintura', AZ2, x1 - 0.02, YS + 0.40, 0, 0.05));
  var texSM = cboTexSanMartin();
  [-1, 1].forEach(function(s){
    var zc = s * (ZB - 0.04);
    est(D.perfil('TLV', [[x0, YS - 0.02], [xc, YS - 0.02], [x1, YS + 0.32], [x1, YB], [x0, YB]], 0.08, zc, 'pintura', AZ, 0.02));
    /* pasamano superior redondo, larguero inferior y cartelas del frente */
    est(bl('TLV', x1 - x0 + 0.06, 0.18, 0.16, 'pintura', AZ2, (x0 + x1) / 2, YB - 0.04, s * (ZB + 0.02), 0.06));
    est(bl('TLV', xc - x0, 0.14, 0.12, 'pintura', AZ2, (x0 + xc) / 2, YS + 0.03, s * (ZB + 0.02), 0.03));
    var tr = est(bl('TLV', Math.hypot(x1 - xc, 0.34), 0.14, 0.12, 'pintura', AZ2, (xc + x1) / 2, YS + 0.20, s * (ZB + 0.02), 0.03));
    tr.rotation.z = Math.atan2(0.34, x1 - xc);
    est(D.perfil('TLV', [[x0, YB - 0.05], [x0, YH], [x0 + 0.35, YH], [x0 + 1.10, YB - 0.05]], 0.08, s * (ZB - 0.04), 'pintura', AZ, 0.02));
    /* nervios verticales ahusados (dejan libre el logo y el numero) */
    [x0 + 0.25, x0 + 3.05, x0 + 4.05, x1 - 0.12].forEach(function(x){
      var yb = x > xc ? YS + 0.32 * (x - xc) / (x1 - xc) + 0.10 : YS + 0.10, yt = YB - 0.14;
      var gN = new THREE.BoxGeometry(0.14, yt - yb, 0.16), pos = gN.attributes.position;
      for(var v = 0; v < pos.count; v++) if(pos.getY(v) < 0) pos.setZ(v, pos.getZ(v) * 0.45);
      gN.computeVertexNormals();
      est(D.pon('TLV', gN, 'pintura', AZ2, x, (yb + yt) / 2, s * (ZB + 0.04)));
    });
    /* «San Martín» adelante y el numero de la unidad atras */
    est(cboPlano(C, texSM, 2.30, 0.90, x0 + 1.60, (YS + YB) / 2 + 0.08, s * (ZB + 0.004), s > 0 ? 0 : Math.PI, true));
    est(cboPlano(C, C.texNum, 1.55, 0.48, x0 + 5.05, (YS + YB) / 2 + 0.20, s * (ZB + 0.004), s > 0 ? 0 : Math.PI, true));
    /* cinta reflectiva en el borde bajo */
    for(var c = 0; c < 8; c++) est(bl(null, 0.24, 0.05, 0.01, 'mate', c % 2 ? '#F2F2F2' : '#C62A1E', x0 + 0.5 + c * 0.6, YS + 0.03, s * (ZB + 0.085), 0.004));
    /* cartela entre el frontal alto y la visera */
    est(D.perfil('TLV', [[x0 - 0.02, YH - 0.02], [xa + 0.05, YH + 0.06], [x0 - 0.02, YH - 0.40]], 0.08, s * (ZB - 0.10), 'pintura', AZ2, 0.02));
  });
  /* frontal alto con refuerzos horizontales */
  est(bl('TLV', 0.10, YH - YS + 0.04, ZB * 2, 'pintura', AZ, x0 - 0.03, (YS + YH) / 2, 0, 0.03));
  [YS + 0.55, YB - 0.30, YH - 0.35].forEach(function(y){ est(bl(null, 0.12, 0.10, ZB * 2 - 0.10, 'pintura', AZ2, x0 - 0.12, y, 0, 0.03)); });
  [-0.70, 0.70].forEach(function(z){ est(bl(null, 0.12, YH - YS - 0.2, 0.10, 'pintura', AZ2, x0 - 0.12, (YS + YH) / 2, z, 0.03)); });
  /* visera protectora sobre la cabina, con labio y nervios */
  est(bl('TLV', x0 - xa + 0.05, 0.08, ZB * 2 - 0.06, 'pintura', AZ, (xa + x0) / 2, YH + 0.02, 0, 0.03));
  var lab = est(bl(null, 0.22, 0.06, ZB * 2 - 0.06, 'pintura', AZ2, xa - 0.06, YH + 0.06, 0, 0.02)); lab.rotation.z = -0.4;
  [-0.9, 0, 0.9].forEach(function(z){ est(bl(null, x0 - xa - 0.1, 0.12, 0.08, 'pintura', AZ2, (xa + x0) / 2, YH - 0.07, z, 0.02)); });
  /* numero en el frontal (se lee de atras entre las barandas) y en la cola */
  est(cboPlano(C, C.texNum, 1.30, 0.40, x1 + 0.09, YS + 0.40, 0, Math.PI / 2, true));
  /* ojos de izaje y bisagras traseras de la tolva */
  var xp = L.xFin - 0.18, yp = YF + 0.12;
  [-1, 1].forEach(function(s){
    est(D.perfil(null, [[xp - 0.30, YS - 0.16], [xp + 0.25, YS - 0.16], [xp + 0.10, yp - 0.04], [xp - 0.10, yp - 0.04]], 0.06, s * (L.zR + 0.10), 'pintura', AZ2, 0.01));
    D.perfil('PYB', [[xp - 0.25, YF], [xp + 0.15, YF], [xp + 0.05, yp + 0.08], [xp - 0.12, yp + 0.08]], 0.05, s * (L.zR + 0.17), 'pintura', C.colChasis, 0.01);
    D.cilindro('PYB', 0.055, 0.055, 0.28, 'metal', '#4A4F55', xp, yp, s * (L.zR + 0.14), [Math.PI / 2, 0, 0], 16);
  });
  /* cilindro telescopico frontal (Hyva FE de cuatro etapas) */
  var xcil = (L.xCB + x0) / 2 + 0.02, yc0 = YF - 0.05, yc1 = YB - 0.30;
  bl(null, 0.24, 0.12, 0.70, 'pintura', C.colChasis, xcil, YF + 0.02, 0, 0.02);
  D.cilindro('PHY', 0.13, 0.13, 0.95, 'pintura', '#1E2023', xcil, yc0 + 0.55, 0, null, 24);
  D.cilindro('PHY', 0.15, 0.15, 0.06, 'pintura', '#1E2023', xcil, yc0 + 1.03, 0, null, 24);
  [[0.11, 1.06, 1.38], [0.095, 1.38, 1.62], [0.08, 1.62, yc1 - yc0 - 0.08]].forEach(function(q){
    D.cilindro(null, q[0], q[0], q[2] - q[1], 'cromo', null, xcil, yc0 + (q[1] + q[2]) / 2, 0, null, 20);
  });
  D.pon(null, new THREE.SphereGeometry(0.10, 14, 10), 'metal', '#3A3F45', xcil, yc0 + 0.08, 0);
  est(bl(null, 0.30, 0.16, 0.40, 'pintura', AZ2, xcil + 0.08, yc1, 0, 0.03));
  /* bomba de levante en la toma de fuerza, tanque hidraulico y mangueras */
  D.cilindro('HPM', 0.09, 0.09, 0.26, 'metal', CBO_GRIS2, L.xc0 + 2.45, YF - 0.35, -0.22, [0, 0, Math.PI / 2], 16);
  bl('TQH1', 0.34, 0.52, 0.42, 'pintura', '#26292D', xcil, YF + 0.32, 0.78, 0.04);
  D.cilindro(null, 0.05, 0.05, 0.08, 'mate', CBO_NEGRO, xcil, YF + 0.62, 0.78, null, 12);
  tubo('LPH', [L.xc0 + 2.45, YF - 0.30, -0.22], [xcil, yc0 + 0.25, -0.12], 0.022, 'goma', '#1A1C1F', 8);
  tubo('LPH', [xcil, YF + 0.10, 0.60], [xcil, yc0 + 0.20, 0.12], 0.022, 'goma', '#1A1C1F', 8);
  /* aleta sobre el bogie, colgada del falso chasis */
  [-1, 1].forEach(function(s){
    var xg0 = L.ejes[2] - L.R - 0.12, xg1 = L.ejes[3] + L.R + 0.12;
    bl(null, xg1 - xg0, 0.03, 0.80, 'mate', CBO_PLAST, (xg0 + xg1) / 2, 2 * L.R + 0.12, s * (L.zO - 0.10), 0.01);
    bl(null, 0.05, 0.05, 0.40, 'pintura', C.colChasis, (xg0 + xg1) / 2, 2 * L.R + 0.10, s * (L.zR + 0.25), 0.01);
  });
  return new THREE.Vector3(xp, yp, 0);
}

/* ═══ CUERPO: cisterna eliptica (combustible o agua) ═══ */
function cboCisterna(C, agua){
  var D = C.D, L = C.L, bl = D.bloque, tubo = D.tubo, cil = D.cilindro;
  var YF = L.YF, x0 = L.xCB + 0.32, x1 = L.xFin - (agua ? 0.55 : 0.85);
  var a = 1.17, b = 0.78, yc = YF + 0.18 + b, ytop = yc + b;
  var colT = C.colCuerpo, col2 = C.colCuerpo2;
  /* casco eliptico y casquetes */
  var cas = cil(null, 1, 1, x1 - x0 - 0.40, 'pintura', colT, (x0 + x1) / 2, yc, 0, [0, 0, Math.PI / 2], 48);
  cas.scale.set(b, 1, a);
  [x0 + 0.20, x1 - 0.20].forEach(function(x, k){
    var cq = D.pon(null, new THREE.SphereGeometry(1, 40, 20), 'pintura', colT, x, yc, 0);
    cq.scale.set(0.26, b, a);
    /* aro del borde del casquete */
    var ar = D.pon(null, new THREE.TorusGeometry(1, 0.022, 8, 56), 'pintura', col2, x, yc, 0, [0, Math.PI / 2, 0]);
    ar.scale.set(a + 0.005, b + 0.005, 1);
  });
  /* anillos de refuerzo */
  for(var r = 1; r <= 3; r++){
    var ar2 = D.pon(null, new THREE.TorusGeometry(1, 0.02, 8, 56), 'pintura', col2, x0 + 0.20 + r * (x1 - x0 - 0.40) / 4, yc, 0, [0, Math.PI / 2, 0]);
    ar2.scale.set(a + 0.004, b + 0.004, 1);
  }
  /* franja de color y letrero a los costados */
  var texL = agua ? cboTexLetras('AGUA NO POTABLE', '#1E5AA8', '#FFFFFF', false, 1024, 96)
                  : cboTexLetras('INFLAMABLE', colT, '#C3161B', true, 1024, 110);
  /* la franja sigue la curva del casco: un gajo de cilindro abierto bajo el ecuador */
  /* (girado a lo largo de X, el angulo t cae en y = b sen t, z = a cos t) */
  [-0.26, Math.PI + 0.26].forEach(function(tc){
    var gF = new THREE.CylinderGeometry(1, 1, x1 - x0 - 0.42, 48, 1, true, tc - 0.07, 0.14);
    var fr = D.pon(null, gF, 'pintura', agua ? '#1E5AA8' : '#C3161B', (x0 + x1) / 2, yc, 0, [0, 0, Math.PI / 2]);
    fr.material.side = THREE.DoubleSide;
    fr.scale.set(b + 0.004, 1, a + 0.004);
  });
  /* letreros planos en el ecuador del casco, donde la curva casi no se nota */
  [-1, 1].forEach(function(s){
    var ry = s > 0 ? 0 : Math.PI, zp = s * (a + 0.032);   /* por delante de los anillos */
    cboPlano(C, texL, 2.0, agua ? 0.19 : 0.22, (x0 + x1) / 2 - 0.05, yc + 0.02, zp, ry, false);
    cboPlano(C, C.texNum, 1.00, 0.30, x1 - 0.90, yc + 0.02, zp, ry, true);
    if(!agua){
      cboPlano(C, C.texRombo, 0.36, 0.36, x0 + 0.52, yc + 0.0, zp, ry, true);
      cboPlano(C, C.texONU, 0.38, 0.24, x0 + 0.96, yc + 0.0, zp, ry, false);
    }
  });
  /* cunas sobre el falso chasis, que siguen la panza del tanque */
  var yEl = function(z){ return yc - b * Math.sqrt(Math.max(0, 1 - (z / a) * (z / a))) - 0.012; };
  [-1, 1].forEach(function(s){ bl(null, x1 - x0, 0.14, 0.12, 'pintura', C.colChasis, (x0 + x1) / 2, YF + 0.07, s * L.zR, 0.02); });
  [x0 + 0.45, (x0 + x1) / 2 - 0.6, (x0 + x1) / 2 + 0.6, x1 - 0.45].forEach(function(x){
    var pts = [[-0.80, YF + 0.10], [0.80, YF + 0.10]];
    for(var z = 0.80; z >= -0.801; z -= 0.20) pts.push([z, yEl(z)]);
    D.perfilX(null, pts, 0.10, x, 'pintura', C.colChasis, 0.01);
  });
  /* arriba: tapas de buzon al centro, pasarela de rejilla a la derecha sobre
     mensulas y barandas abatibles que nacen del casco */
  var yTop = function(z){ return yc + b * Math.sqrt(Math.max(0, 1 - (z / a) * (z / a))); };
  var nB = agua ? 2 : 3, xw0 = x0 + 0.35, xw1 = x1 - 0.35, zw = -0.50, yw = ytop + 0.04;
  bl(null, xw1 - xw0, 0.035, 0.36, 'metal', '#8E959C', (xw0 + xw1) / 2, yw, zw, 0.01);
  for(var t = 0; t < 16; t++) bl(null, 0.018, 0.04, 0.36, 'metal', '#5E656D', xw0 + 0.1 + t * (xw1 - xw0 - 0.2) / 15, yw + 0.004, zw, 0.004);
  [xw0 + 0.15, (xw0 + xw1) / 2, xw1 - 0.15].forEach(function(x){
    bl(null, 0.05, yw - yTop(zw - 0.10) + 0.02, 0.05, 'metal', '#5E656D', x, (yw + yTop(zw - 0.10)) / 2, zw - 0.10, 0.008);
  });
  for(var n = 0; n < nB; n++){
    var xn = x0 + (n + 0.5) * (x1 - x0) / nB;
    cil(null, 0.27, 0.29, 0.14, 'pintura', col2, xn, ytop + 0.05, 0.05, null, 32);
    cil(null, 0.25, 0.25, 0.05, 'metal', '#A9AFB5', xn, ytop + 0.14, 0.05, null, 32);
    bl(null, 0.08, 0.06, 0.12, 'metal', CBO_GRIS, xn - 0.20, ytop + 0.16, 0.05, 0.01);
    if(!agua) cil(null, 0.05, 0.05, 0.16, 'metal', CBO_GRIS, xn + 0.20, ytop + 0.10, 0.30, null, 12);
  }
  D.baranda([[xw0, -0.74], [xw1, -0.74]], yTop(-0.74) - 0.02, 0.95, '#E0B21A');
  D.baranda([[xw0, 0.55], [xw1, 0.55]], yTop(0.55) - 0.02, 0.90, '#E0B21A');
  /* escalera atras a la derecha */
  var xe = x1 + 0.12;
  D.escalera(xe, -0.55, 0.50, ytop + 0.10, 0.42, '#8E959C', '#5E656D');
  tubo(null, [xe, ytop + 0.10, -0.76], [xe - 0.20, ytop + 0.95, -0.76], 0.025, 'metal', '#8E959C', 10);
  tubo(null, [xe, ytop + 0.10, -0.34], [xe - 0.20, ytop + 0.95, -0.34], 0.025, 'metal', '#8E959C', 10);
  if(!agua){
    /* gabinete trasero con el carrete de manguera, la bomba y el medidor */
    var gx0 = x1 + 0.30, gx1 = L.xFin + 0.02, gy0 = YF + 0.02, gy1 = YF + 1.12, gz = 1.12, gxm = (gx0 + gx1) / 2;
    bl(null, gx1 - gx0, 0.05, gz * 2, 'pintura', colT, gxm, gy1, 0, 0.02);
    bl(null, gx1 - gx0, 0.05, gz * 2, 'metal', '#8E959C', gxm, gy0 + 0.02, 0, 0.01);
    [-1, 1].forEach(function(s){ bl(null, gx1 - gx0, gy1 - gy0, 0.04, 'pintura', colT, gxm, (gy0 + gy1) / 2, s * gz, 0.01); });
    bl(null, 0.04, gy1 - gy0, 0.70, 'pintura', colT, gx0 + 0.02, (gy0 + gy1) / 2, -0.70, 0.01);
    var yr = gy0 + 0.50;
    cil(null, 0.16, 0.16, 0.80, 'metal', '#9AA1A8', gxm, yr, 0.25, [Math.PI / 2, 0, 0], 20);
    [-0.15, 0.65].forEach(function(z){ cil(null, 0.40, 0.40, 0.03, 'pintura', '#C3161B', gxm, yr, z, [Math.PI / 2, 0, 0], 32); });
    for(var v = 0; v < 6; v++) D.pon(null, new THREE.TorusGeometry(0.24, 0.035, 8, 28), 'goma', '#16181B', gxm, yr, -0.07 + v * 0.12, null);
    tubo(null, [gxm + 0.24, yr - 0.05, 0.25], [gx1 + 0.05, gy0 + 0.25, 0.70], 0.035, 'goma', '#16181B', 10);
    bl(null, 0.08, 0.20, 0.10, 'metal', '#2E3236', gx1 + 0.06, gy0 + 0.30, 0.70, 0.02);
    bl('PYM', 0.30, 0.26, 0.30, 'pintura', '#C3161B', gxm, gy0 + 0.20, -0.70, 0.03);
    bl(null, 0.20, 0.24, 0.16, 'mate', CBO_NEGRO, gxm, gy0 + 0.55, -0.70, 0.02);
    cil(null, 0.08, 0.08, 0.02, 'vidrio', '#D9E4EA', gx1 - 0.10, gy0 + 0.55, -0.70, [0, 0, Math.PI / 2], 18);
    tubo('LPH', [x1 + 0.10, yc - b + 0.15, -0.40], [gxm, gy0 + 0.20, -0.62], 0.04, 'metal', '#9AA1A8', 10);
    /* rombo y panel ONU atras */
    cboPlano(C, C.texRombo, 0.36, 0.36, gx1 + 0.03, gy1 - 0.30, -0.70, Math.PI / 2, true);
    cboPlano(C, C.texONU, 0.36, 0.22, gx1 + 0.03, gy1 - 0.26, 0.70, Math.PI / 2, false);
    /* extintores a los costados */
    [-1, 1].forEach(function(s){
      cil('SCI', 0.08, 0.08, 0.50, 'pintura', '#C3161B', x0 + 0.05, YF + 0.10, s * 1.02, null, 16);
      bl(null, 0.20, 0.60, 0.04, 'pintura', C.colChasis, x0 + 0.05, YF + 0.12, s * 0.92, 0.01);
    });
  } else {
    /* bomba centrifuga con motor hidraulico, flauta de riego y valvulas */
    var xb = L.xFin - 0.30;
    cil('WPM1', 0.20, 0.20, 0.22, 'pintura', '#1E5AA8', xb, YF - 0.30, 0, [Math.PI / 2, 0, 0], 28);
    cil('PYM', 0.09, 0.09, 0.25, 'metal', CBO_GRIS, xb, YF - 0.30, 0.22, [Math.PI / 2, 0, 0], 16);
    tubo(null, [x1 - 0.15, yc - b + 0.10, 0], [xb, YF - 0.12, 0], 0.08, 'metal', '#8E959C', 16);
    var xf = L.xFin + 0.12, yf = 0.52;
    tubo(null, [xb + 0.15, YF - 0.30, 0], [xf, yf + 0.10, 0], 0.06, 'metal', '#8E959C', 14);
    tubo(null, [xf, yf, -1.15], [xf, yf, 1.15], 0.06, 'metal', '#8E959C', 16);
    [-1.0, -0.35, 0.35, 1.0].forEach(function(z){
      bl(null, 0.12, 0.08, 0.24, 'metal', '#5E656D', xf + 0.05, yf - 0.06, z, 0.02, [0, 0, -0.5]);
      cil(null, 0.045, 0.045, 0.16, 'pintura', '#E0B21A', xf - 0.02, yf + 0.13, z, null, 12);
    });
    /* cañon monitor arriba atras */
    cil(null, 0.06, 0.06, 0.40, 'metal', '#8E959C', x1 - 0.40, ytop + 0.30, 0, null, 14);
    tubo(null, [x1 - 0.40, ytop + 0.48, 0], [x1 + 0.25, ytop + 0.60, 0], 0.05, 'metal', '#8E959C', 14);
    cil(null, 0.035, 0.06, 0.18, 'metal', '#5E656D', x1 + 0.32, ytop + 0.62, 0, [0, 0, Math.PI / 2 + 0.18], 14);
    /* aspersores laterales y el tanque hidraulico de la bomba */
    bl('TQH1', 0.45, 0.45, 0.40, 'pintura', '#26292D', L.xCB + 0.25, YF + 0.30, -0.70, 0.04);
  }
  /* aletas sobre el bogie */
  [-1, 1].forEach(function(s){
    var xg0 = L.ejes[1] - L.R - 0.10, xg1 = L.ejes[2] + L.R + 0.10;
    bl(null, xg1 - xg0, 0.03, 0.78, 'mate', CBO_PLAST, (xg0 + xg1) / 2, 2 * L.R + 0.10, s * (L.zO - 0.08), 0.01);
    bl(null, 0.05, 0.12, 0.40, 'pintura', C.colChasis, (xg0 + xg1) / 2, 2 * L.R + 0.16, s * (L.zR + 0.25), 0.01);
  });
  /* tanque hidraulico y cuadro de valvulas adelante, detras de la cabina */
  if(!agua) bl('TQH1', 0.30, 0.42, 0.40, 'pintura', '#26292D', L.xCB + 0.18, YF + 0.26, 0.72, 0.04);
}

/* ═══ CUERPO: fabrica de ANFO (tolva de nitrato inoxidable y tornillos) ═══ */
function cboAnfo(C){
  var D = C.D, L = C.L, bl = D.bloque, tubo = D.tubo, cil = D.cilindro;
  var YF = L.YF, XB0 = L.xCB + 0.25, XB1 = L.xFin, YD = YF + 0.14;
  /* plataforma con cinta reflectiva */
  bl(null, XB1 - XB0, 0.12, 2.40, 'metal', '#5A6067', (XB0 + XB1) / 2, YF + 0.07, 0, 0.02);
  for(var c = 0; c < 12; c++){
    [-1.205, 1.205].forEach(function(z){ bl(null, 0.18, 0.06, 0.01, 'mate', c % 2 ? '#F2F2F2' : '#C62A1E', XB0 + 0.25 + c * (XB1 - XB0 - 0.5) / 11, YF + 0.07, z, 0.003); });
  }
  /* tolva de nitrato: fondo en V y paredes rectas con nervios */
  var TX0 = XB0 + 0.70, TX1 = XB1 - 0.25, YV = YD + 0.70, YT = L.Y0 + L.H + 0.20;
  var tolvaV = new THREE.Shape();
  [[-0.30, YD + 0.06], [0.30, YD + 0.06], [1.10, YV], [-1.10, YV]].forEach(function(p, k){ k ? tolvaV.lineTo(p[0], p[1]) : tolvaV.moveTo(p[0], p[1]); });
  var gV = new THREE.ExtrudeGeometry(tolvaV, { depth: TX1 - TX0, bevelEnabled: false });
  gV.rotateY(Math.PI / 2); gV.translate(TX0, 0, 0);
  D.pon('TLV', gV, 'metal', CBO_INOX);
  bl('TLV', TX1 - TX0, YT - YV, 2.20, 'metal', CBO_INOX, (TX0 + TX1) / 2, (YV + YT) / 2, 0, 0.04);
  bl(null, TX1 - TX0 + 0.08, 0.08, 2.28, 'metal', '#A7AEB5', (TX0 + TX1) / 2, YT, 0, 0.02);
  for(var n = 0; n <= 6; n++){
    var xn = TX0 + 0.06 + n * (TX1 - TX0 - 0.12) / 6;
    [-1.11, 1.11].forEach(function(z){ bl(null, 0.07, YT - YV, 0.05, 'metal', '#9EA5AD', xn, (YV + YT) / 2, z, 0.01); });
  }
  /* tapas de la tolva arriba */
  [0.25, 0.75].forEach(function(f){ bl(null, 0.70, 0.05, 0.70, 'metal', '#A7AEB5', TX0 + f * (TX1 - TX0), YT + 0.06, -0.45, 0.02); });
  /* tornillo de descarga bajo la V, columna vertical y tornillo pluma sobre la tolva */
  cil(null, 0.13, 0.13, TX1 - TX0 + 0.5, 'metal', '#8A9097', (TX0 + TX1) / 2 + 0.25, YD + 0.04, 0, [0, 0, Math.PI / 2], 16);
  var XCOL = TX1 + 0.12, ZCOL = -0.75, YCOL = YT + 0.55;
  cil(null, 0.16, 0.16, YCOL - YD, 'metal', '#8A9097', XCOL, (YD + YCOL) / 2, ZCOL, null, 18);
  bl('PYM', 0.36, 0.30, 0.36, 'pintura', '#26292D', XCOL, YCOL, ZCOL, 0.03);
  tubo(null, [XCOL, YCOL + 0.05, ZCOL], [TX0 + 0.10, YT + 0.35, ZCOL], 0.13, 'metal', '#8A9097', 18);
  bl(null, 0.30, 0.30, 0.30, 'pintura', '#26292D', TX0 + 0.10, YT + 0.30, ZCOL, 0.03);
  /* soporte en V y cilindro de la pluma */
  tubo(null, [TX0 + 0.10, YT, ZCOL], [TX0 + 0.10, YT + 0.22, ZCOL], 0.05, 'metal', '#5A6067', 10);
  D.cilHidD('PHY', [XCOL - 0.10, YT - 0.40, ZCOL + 0.22], [XCOL - 0.75, YT + 0.32, ZCOL + 0.08], 0.05, '#26292D', 0.55);
  /* manguera de carga colgando atras */
  tubo(null, [XCOL + 0.10, YCOL - 0.20, ZCOL], [XB1 + 0.15, YD + 0.40, ZCOL], 0.06, 'goma', '#16181B', 10);
  tubo(null, [XB1 + 0.15, YD + 0.40, ZCOL], [XB1 + 0.22, 0.45, ZCOL - 0.15], 0.06, 'goma', '#16181B', 10);
  /* tanque de petroleo (para la mezcla) bajo la plataforma a la derecha */
  cil(null, 0.30, 0.30, 1.20, 'pintura', '#E8EAEC', XB0 + 1.85, YF - 0.30, -(L.zR + 0.35), [0, 0, Math.PI / 2], 24);
  [-0.4, 0.4].forEach(function(d){ cil(null, 0.31, 0.31, 0.05, 'mate', CBO_NEGRO, XB0 + 1.85 + d, YF - 0.30, -(L.zR + 0.35), [0, 0, Math.PI / 2], 24); });
  /* tanque hidraulico, bombas en la toma de fuerza y la de lubricacion */
  bl('TQH1', 0.45, 0.70, 0.55, 'pintura', '#26292D', XB0 + 0.28, YD + 0.35, 0.78, 0.04);
  cil(null, 0.05, 0.05, 0.08, 'mate', CBO_NEGRO, XB0 + 0.28, YD + 0.74, 0.78, null, 12);
  bl('PTB1', 0.26, 0.22, 0.22, 'metal', CBO_GRIS2, L.xc0 + 2.55, YF - 0.30, -0.22, 0.02);
  cil('PYM', 0.09, 0.09, 0.28, 'metal', CBO_GRIS2, L.xc0 + 2.80, YF - 0.30, -0.22, [0, 0, Math.PI / 2], 16);
  cil('GLP1', 0.08, 0.08, 0.24, 'pintura', '#C3161B', L.xc0 + 2.80, YF - 0.30, 0.22, [0, 0, Math.PI / 2], 16);
  tubo('LPH', [L.xc0 + 2.95, YF - 0.25, -0.22], [XB0 + 0.28, YD + 0.10, 0.60], 0.025, 'goma', '#1A1C1F', 8);
  /* tablero de control atras a la derecha */
  bl('TAB', 0.30, 0.60, 0.50, 'metal', CBO_INOX, XB1 - 0.18, YD + 0.42, -0.80, 0.03);
  bl(null, 0.01, 0.40, 0.36, 'mate', '#2A2D31', XB1 - 0.02, YD + 0.45, -0.80, 0.004);
  /* escalera adelante a la izquierda y baranda arriba */
  D.escalera(TX0 - 0.20, 1.00, YD, YT + 0.05, 0.40, '#C4C9CE', '#8A9097');
  D.baranda([[TX0 + 0.10, 1.02], [TX1 - 0.05, 1.02]], YT + 0.04, 0.90, '#C4C9CE');
  D.baranda([[TX0 + 0.10, -1.02], [TX1 - 0.45, -1.02]], YT + 0.04, 0.90, '#C4C9CE');
  /* rombos 1.5D, panel 0331 y EXPLOSIVOS a los costados y atras */
  var texR = cboTexRombo(15), texU = cboTexONU(null, '0331'), texE = cboTexLetras('EXPLOSIVOS', '#B9BFC5', '#C3161B', true, 1024, 110);
  [-1, 1].forEach(function(s){
    var zt = s * 1.142;
    cboPlano(C, texR, 0.60, 0.60, (TX0 + TX1) / 2 - 0.30, (YV + YT) / 2 + 0.10, zt, s > 0 ? 0 : Math.PI, true);
    cboPlano(C, texU, 0.50, 0.25, (TX0 + TX1) / 2 + 0.55, (YV + YT) / 2 + 0.10, zt, s > 0 ? 0 : Math.PI, false);
    cboPlano(C, texE, 1.60, 0.18, (TX0 + TX1) / 2, YV + 0.12, zt, s > 0 ? 0 : Math.PI, false);
    cboPlano(C, C.texNum, 0.85, 0.27, (TX0 + TX1) / 2, YT - 0.22, zt, s > 0 ? 0 : Math.PI, true);
  });
  cboPlano(C, texR, 0.60, 0.60, TX1 + 0.005, (YV + YT) / 2, 0.30, Math.PI / 2, true);
  /* extintores (obligatorios en el transporte de explosivos) */
  [-1, 1].forEach(function(s){
    cil('SCI', 0.08, 0.08, 0.50, 'pintura', '#C3161B', XB0 + 0.15, YD + 0.30, s * 1.08, null, 16);
  });
  /* aletas sobre el bogie */
  [-1, 1].forEach(function(s){
    var xg0 = L.ejes[1] - L.R - 0.10, xg1 = L.ejes[2] + L.R + 0.10;
    bl(null, xg1 - xg0, 0.03, 0.78, 'mate', CBO_PLAST, (xg0 + xg1) / 2, 2 * L.R + 0.10, s * (L.zO - 0.08), 0.01);
  });
}

/* ═══ CUERPO: tracto con quinta rueda (sin semirremolque) ═══ */
function cboTracto(C){
  var D = C.D, L = C.L, bl = D.bloque, tubo = D.tubo, cil = D.cilindro;
  var YF = L.YF, xb = (L.ejes[1] + L.ejes[2]) / 2, xq = xb - 0.30, yq = YF + 0.20;
  /* placa de montaje, soportes basculantes y la quinta rueda con su ranura en V */
  [-1, 1].forEach(function(s){ bl(null, 1.30, 0.12, 0.14, 'pintura', C.colChasis, xq, YF + 0.06, s * L.zR, 0.02); });
  [-1, 1].forEach(function(s){ D.perfil(null, [[xq - 0.25, YF + 0.10], [xq + 0.25, YF + 0.10], [xq + 0.12, yq - 0.02], [xq - 0.12, yq - 0.02]], 0.10, s * 0.58, 'pintura', C.colChasis, 0.01); });
  var qr = new THREE.Shape();
  qr.absarc(0, 0, 0.45, 0.20, Math.PI * 2 - 0.20, false);
  qr.lineTo(0.05, -0.03); qr.lineTo(0.05, 0.03); qr.closePath();
  var gq = new THREE.ExtrudeGeometry(qr, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2 });
  gq.rotateX(-Math.PI / 2);
  var q5 = D.pon(null, gq, 'pintura', '#2B2F34', xq, yq + 0.02, 0);
  q5.rotation.y = Math.PI;
  bl(null, 0.06, 0.04, 0.24, 'metal', '#C9A13A', xq + 0.20, yq + 0.10, 0.25, 0.01);
  cil(null, 0.03, 0.03, 0.35, 'metal', '#B8BEC4', xq, yq - 0.02, -0.55, [Math.PI / 2, 0, 0], 10);
  /* pasarela de plancha estriada detras de la cabina, con las mangueras */
  var xp0 = L.xCB + 0.05, xp1 = xq - 0.62;
  bl(null, xp1 - xp0, 0.04, 1.10, 'metal', '#9AA1A8', (xp0 + xp1) / 2, YF + 0.04, 0, 0.01);
  for(var t = 0; t < 8; t++) bl(null, 0.02, 0.012, 1.06, 'metal', '#6E757C', xp0 + 0.05 + t * (xp1 - xp0 - 0.1) / 7, YF + 0.065, 0, 0.003);
  /* espirales de aire (rojo, amarillo) y el cable electrico */
  [['#C3161B', -0.30], ['#D9B11A', 0.0], ['#16181B', 0.30]].forEach(function(q){
    var pts = [];
    for(var i = 0; i <= 60; i++){
      var u = i / 60, ang = u * Math.PI * 14;
      pts.push(new THREE.Vector3(xp0 + 0.15 + Math.cos(ang) * 0.06 + u * 0.25, L.Y0 + 1.0 - u * 0.75 + Math.sin(ang) * 0.06, q[1]));
    }
    var g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.012, 6, false);
    D.pon('LPA', g, 'goma', q[0]);
  });
  /* aletas de cuarto sobre cada eje motriz y la barra de luces de atras */
  [L.ejes[1], L.ejes[2]].forEach(function(x){
    [-1, 1].forEach(function(s){
      var arco = new THREE.Shape(), r1 = L.R + 0.12, r0 = L.R + 0.08;
      arco.absarc(0, 0, r1, 0.55, Math.PI - 0.55, false);
      arco.absarc(0, 0, r0, Math.PI - 0.55, 0.55, true);
      var gA = new THREE.ExtrudeGeometry(arco, { depth: 0.78, bevelEnabled: false, curveSegments: 14 });
      gA.translate(0, 0, -0.39);
      D.pon(null, gA, 'mate', CBO_PLAST, x, L.R, s * (L.zO - 0.08));
    });
  });
  bl(null, 0.06, 0.16, 2.30, 'pintura', C.colChasis, L.xFin + 0.04, YF - 0.05, 0, 0.02);
  [-1, 1].forEach(function(s){
    bl(null, 0.02, 0.62, 0.60, 'goma', '#141618', L.xFin + 0.06, 0.55, s * L.zO, 0.01);
  });
}

/* ═══ armado ═══ */
function cboConstruir(e, clave, piezas){
  var S = cboSpec(e), cuerpo = String(clave).split('|')[2];
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var L = cboMedidas(S, cuerpo);
  var sm = cuerpo === 'VOLQUETE' && S.marca === 'SCANIA';
  var C = { G: G, D: D, L: L, S: S, cuerpo: cuerpo,
    colCab: sm ? CBO_NARANJA : cuerpo === 'TRACTO' ? CBO_ROJO : CBO_BLANCO,
    colChasis: CBO_CHASIS, colBaliza: sm ? '#2F6BEA' : '#F0A41C',
    colCuerpo: sm ? CBO_AZUL : cuerpo === 'AGUA' ? '#A9C2D8' : cuerpo === 'COMBUSTIBLE' ? '#EEF0EE' : CBO_INOX,
    colCuerpo2: sm ? CBO_AZUL2 : cuerpo === 'AGUA' ? '#7E99B2' : cuerpo === 'COMBUSTIBLE' ? '#C9CDD1' : '#9EA5AD',
    cinta: sm };
  if(sm) C.colVisera = CBO_PLAST;
  /* numero de unidad: blanco en la tolva azul; negro en las cisternas y la ANFO; en la puerta de todas */
  C.texNum = texNumero3d(null, sm ? '#FFFFFF' : '#1A1C1F');
  C.texNumPuerta = texNumero3d(null, cuerpo === 'TRACTO' ? '#FFFFFF' : '#1A1C1F');
  C.texRombo = cboTexRombo(3); C.texONU = cboTexONU('30', '1202');

  cboChasis(C);
  cboCabina(C);
  if(S.marca === 'SCANIA') cboFrenteScania(C);
  else if(S.marca === 'MB') cboFrenteMB(C);
  else cboFrenteFoton(C);
  cboParachoques(C);
  var piv = null;
  var E = L.ejes;
  if(cuerpo === 'VOLQUETE'){ piv = cboVolquete(C); cboEquipChasis(C, { lTanque: 1.00, xBat: E[1] + L.R + 0.50, xSen: E[2] - L.R - 0.30 }); }
  else if(cuerpo === 'TRACTO'){ cboTracto(C); cboEquipChasis(C, { lTanque: 1.30, xBat: E[0] + L.R + 1.10 }); }
  else if(cuerpo === 'ANFO'){ cboAnfo(C); cboEquipChasis(C, { lTanque: 0.95, xBat: E[0] + L.R + 0.45, defensa: '#E0B21A' }); }
  else { cboCisterna(C, cuerpo === 'AGUA'); cboEquipChasis(C, { lTanque: 1.20, xBat: E[0] + L.R + 0.45, defensa: '#E0B21A' }); }

  /* ═══ llantas ═══ */
  var LL = { r: L.R, ancho: L.A, rAro: L.rAro, aro: sm ? '#2E3236' : '#B9BEC3', aro2: sm ? '#1E2023' : '#8E949A', pernos: 10, paso: 0.15, perno: '#8A8F95' };
  var n = 1;
  for(var i = 0; i < E.length; i++){
    if(i < L.nDel){
      D.ruedaDet('LL' + n++, E[i], L.zD, 1, LL);
      D.ruedaDet('LL' + n++, E[i], -L.zD, -1, LL);
    } else {
      D.ruedaDet('LL' + n++, E[i], L.zO, 1, LL);
      D.ruedaDet('LL' + n++, E[i], L.zI, 0, LL);
      D.ruedaDet('LL' + n++, E[i], -L.zI, 0, LL);
      D.ruedaDet('LL' + n++, E[i], -L.zO, -1, LL);
    }
  }

  /* centrar el camion en X para que el estudio gire alrededor de su medio */
  var caja = new THREE.Box3().setFromObject(G);
  var xc = (caja.min.x + caja.max.x) / 2;
  G.children.forEach(function(m){ m.position.x -= xc; });
  if(piv){ piv.x -= xc; D.colgarTolva(piv, 'CBO-' + S.nombre); }
  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ C.texNum.userData.poner(id); C.texNumPuerta.userData.poner(id); };
  G.userData.mirarY = 1.75;
  G.userData.dist = 19;
  G.userData.modelo = 'CBO-' + S.nombre;
  return G;
}

registrarModelo3d({
  nombre: 'Camiones de cabina avanzada (Scania, Mercedes-Benz, Foton)',
  clave: function(e){
    var S = cboSpec(e), cu = cboCuerpo(e);
    if(!S || !cu) return null;
    if(cu === 'VOLQUETE' && S.ejes !== '8x4') return null;
    return 'CBO|' + mod3d(e) + '|' + cu;
  },
  construir: function(e, piezas, clave){ return cboConstruir(e, clave, piezas); }
});
