/* ══════════════════════════════════════════════════════════════════
   VOLVO FMX, FM y VM — volquetes y cisternas de agua de cabina avanzada

   Cubre (campo mod de datos.json, marca VOLVO):
     FMX 8X4R, FMX 8X4 R, FMX 8X4, FMX (Tarma)      volquete 8x4, tolva 20-22 m3
     FMX 8X4 MAX, FMX 8X4 R MAX                     volquete 8x4 MAX, tolva 24-25 m3
     FMX 6X4R  CAMION VOLQUETE                       volquete 6x4, tolva ~15 m3
     FMX 6X4R  CISTERNA DE AGUA                      cisterna 6x4
     FM 6X4R   CAMION VOLQUETE                       volquete 6x4 con cabina FM (de carretera)
     VM 6X4R / VM 6X4 R  CISTERNA DE AGUA            cisterna 6x4 con la cabina chica VM
   La clave junta cabina, ejes, cuerpo y dueno: 'VFX|FMX8x4MAX|VOLQUETE|ALQ'.

   Medidas (fichas tecnicas de Volvo Trucks Argentina, «Nuevo FMX 8x4R»,
   «Nuevo FMX 540 8x4R MAX» y «Nuevo FMX 540 6x4R MAX», cabina extendida):
     voladizo delantero 1.520 · entre ejes delanteros 1.995 · entre ejes [C]
     4.350 (primer eje a primer eje motriz) · bogie 1.370 · voladizo trasero
     0.825 (MAX 1.175) · alto de techo 3.103 (MAX 3.161) · cabina 2.495 de
     ancho y 1.970 de largo; el eje delantero queda 0.453 delante de la
     espalda de la cabina. 6x4 MAX: 3.700 + 1.370.
     Llantas: 13.00R22.5 (FMX 8x4R), 324/95R24 (MAX).
   VM: ficha «VM 270 6x2R 2020» de Volvo Argentina (alto 2.894, ancho 2.444
     sobre las ruedas, voladizo 1.320; cabina corta 0.503 detras del eje) y
     nota de Volvo Brasil del VM 6x4R (voladizo 1.390, bogie 1.370, entre ejes
     3.650 a 5.150). Llantas 295/80R22.5.
   Tolvas: la nota de Volvo Peru (Energiminas 2023) da 20-22 m3 para el FMX
     8x4 y 24-25 m3 para el FMX MAX 8x4; las medidas de la tolva roquera
     (largo, alto) se suponen para dar esos volumenes. La del 6x4 (~15 m3) y
     las cisternas (4.3 + 1.37 en el FMX, 4.55 + 1.37 en el VM) son supuestas.
   Lo que no esta acotado (alturas del parabrisas, faros, parachoques) se
     midio sobre el dibujo de costado de la ficha (escala del voladizo).

   Colores: de las fotos de la entrega de FMX MAX a San Martin (Mineria y
     Energia, marzo 2025): cabina blanca, frente gris oscuro con la banda
     diagonal de Volvo, franja amarilla limon bajo la parrilla alta, faros con
     rejilla protectora, tolva azul con «San Martín», aros oscuros con
     indicadores de tuerca verde limon. Los propios (SAN MARTIN) llevan esos
     colores. Los alquilados (Inversiones Fortune, Rivera, AC & AS, Volvo Peru,
     Keclann) no tienen foto: cabina blanca, tolva gris acero y aros plateados
     (supuesto); la cisterna alquilada blanca con franja azul (supuesto), la
     propia azul San Martin (supuesto).
   Se modela el FMX de la generacion 2020 para todos los FMX (el nombre del
     equipo no dice el ano; los propios mas viejos tienen otro frente).

   Ejes: frente hacia -X, arriba +Y, izquierda del operador +Z (volante a la
   izquierda). Llantas SAP: 1-2 delanteras (izq, der), en el 8x4 3-4 el
   segundo eje delantero; luego cada eje trasero de izquierda a derecha:
   exterior, interior, interior, exterior.
   ══════════════════════════════════════════════════════════════════ */
var VFX_BLANCO = '#ECEEEC', VFX_NEGRO = '#16181B', VFX_PLAST = '#232629', VFX_GRIS = '#3B4047', VFX_GRIS2 = '#5E656D',
    VFX_CHASIS = '#1C1E21', VFX_PANEL = '#3A3E44', VFX_AZUL = '#1F45B2', VFX_AZUL2 = '#173894', VFX_LIMA = '#D6DC1E',
    VFX_VIDRIO = '#22303C', VFX_ACERO = '#5B6168', VFX_ACERO2 = '#474C53';

/* ═══ que camion es ═══ */
function vfxSpec(e){
  if(!/VOLVO/.test(String((e && e.marca) || '').toUpperCase())) return null;
  var m = mod3d(e), c = String((e && e.clasif) || '').toUpperCase();
  var q = m.match(/^(FMX|FM|VM)(8X4|6X4)?R?(MAX)?$/);
  if(!q) return null;
  if(q[1] !== 'FMX' && !q[2]) return null;
  var cuerpo = /VOLQUETE/.test(c) ? 'VOLQUETE' : (/CISTERNA/.test(c) && /AGUA/.test(c)) ? 'AGUA' : null;
  if(!cuerpo) return null;
  var prop = /PROPIO/.test(String((e && e.tipo) || '').toUpperCase()) || /SAN\s*MARTIN/.test(String((e && e.prov) || '').toUpperCase());
  return { cab: q[1], ejes: q[2] === '6X4' ? '6x4' : '8x4', max: !!q[3], cuerpo: cuerpo, dueno: prop ? 'SM' : 'ALQ' };
}
function vfxClave(S){ return 'VFX|' + S.cab + S.ejes + (S.max ? 'MAX' : '') + '|' + S.cuerpo + '|' + S.dueno; }
function vfxDeClave(k){
  var p = String(k).split('|'), q = p[1].match(/^(FMX|FM|VM)(8x4|6x4)(MAX)?$/);
  return { cab: q[1], ejes: q[2], max: !!q[3], cuerpo: p[2], dueno: p[3] };
}

/* ═══ medidas de cada combinacion (ver la cabecera) ═══ */
function vfxMedidas(S){
  var L = { cab: S.cab };
  var ll = S.max ? [0.605, 0.33, 0.31] : S.cab === 'VM' ? [0.522, 0.295, 0.285] : S.cab === 'FM' ? [0.535, 0.315, 0.29] : [0.55, 0.32, 0.29];
  L.R = ll[0]; L.A = ll[1]; L.rAro = ll[2];
  L.ejes = S.ejes === '8x4' ? [0, 1.995, 4.35, 5.72]
         : S.cab === 'VM' ? [0, 4.55, 5.92]
         : S.cuerpo === 'AGUA' ? [0, 4.30, 5.67]
         : [0, 3.70, 5.07];
  L.nDel = S.ejes === '8x4' ? 2 : 1;
  L.zR = 0.43;
  L.zD = S.max ? 1.04 : 1.015;
  var sep = L.A + 0.04, tr = S.max ? 0.93 : 0.915;
  L.zO = tr + sep / 2; L.zI = tr - sep / 2;
  /* alturas: la base es el FMX con 13R22.5; el MAX va 6 cm mas alto (ficha),
     el FM unos 9 cm mas bajo (supuesto: cabina de carretera) */
  if(S.cab === 'VM'){
    L.W = 2.25; L.X0 = -1.34; L.Lc = 1.84; L.YF = 1.00; L.Y0 = 1.00; L.yFB = 1.00;
    L.wsb = 1.82; L.wst = 2.60; L.techo = 2.84; L.rake = 0.10; L.xB = -1.39; L.by0 = 0.38; L.by1 = 1.00;
  } else {
    var dy = S.max ? 0.06 : S.cab === 'FM' ? -0.09 : 0;
    L.W = 2.44; L.X0 = -1.44; L.Lc = 1.89; L.YF = 1.12 + dy; L.Y0 = 1.22 + dy; L.yFB = 0.90 + dy;
    L.wsb = 1.74 + dy; L.wst = 2.78 + dy; L.techo = 2.98 + dy; L.rake = 0.17; L.xB = -1.52;
    L.by0 = 0.32 + dy * 0.5; L.by1 = 0.90 + dy;
    L.deflector = S.cab === 'FMX';
  }
  L.xCB = L.X0 + L.Lc;
  var ult = L.ejes[L.ejes.length - 1];
  /* tolva: largo, alto de costado, medio ancho */
  if(S.cuerpo === 'VOLQUETE'){
    L.tLar = S.ejes === '8x4' ? (S.max ? 6.40 : 6.00) : 4.90;
    L.tAlt = S.ejes === '8x4' ? (S.max ? 1.70 : 1.55) : 1.35;
    L.tZB = S.ejes === '8x4' ? 1.27 : 1.24;
    L.tX0 = L.xCB + 0.48;
    L.tX1 = L.tX0 + L.tLar;
    L.xFin = Math.max(ult + 0.80, L.tX1 - 0.12);
  } else {
    L.xFin = ult + 1.45;
  }
  return L;
}

/* ═══ letreros dibujados ═══ */
function vfxTexLetras(txt, fondo, tinta, esp, w, h, fuente){
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
/* la marca de hierro de Volvo: banda diagonal plateada de punta a punta, el
   aro con la flecha arriba a la derecha y VOLVO en la barra del medio */
function vfxTexHierro(){
  return texRotulo3d(function(g, W, H){
    g.clearRect(0, 0, W, H);
    var gr = g.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, '#F2F4F6'); gr.addColorStop(0.5, '#9EA6AE'); gr.addColorStop(1, '#DDE1E5');
    var cx = W / 2, cy = H / 2, r = H * 0.33;
    g.strokeStyle = gr; g.lineCap = 'round';
    g.lineWidth = H * 0.075;
    g.beginPath(); g.moveTo(W * 0.03, H * 0.84); g.lineTo(cx - r * 0.9, cy + r * 0.32); g.stroke();
    g.beginPath(); g.moveTo(cx + r * 0.9, cy - r * 0.32); g.lineTo(W * 0.97, H * 0.16); g.stroke();
    g.fillStyle = '#2A2E33'; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
    g.lineWidth = H * 0.085; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke();
    /* flecha */
    var a = -Math.PI / 4, x1 = cx + Math.cos(a) * r, y1 = cy + Math.sin(a) * r;
    g.lineWidth = H * 0.07; g.lineCap = 'butt';
    g.beginPath(); g.moveTo(x1, y1); g.lineTo(x1 + H * 0.13, y1 - H * 0.13); g.stroke();
    g.fillStyle = '#E4E8EB'; g.beginPath(); g.moveTo(x1 + H * 0.22, y1 - H * 0.22); g.lineTo(x1 + H * 0.03, y1 - H * 0.18);
    g.lineTo(x1 + H * 0.18, y1 - H * 0.03); g.closePath(); g.fill();
    /* barra del medio con VOLVO */
    g.fillStyle = gr; g.fillRect(cx - r * 1.02, cy - H * 0.075, r * 2.04, H * 0.15);
    g.fillStyle = '#1E2125'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(H * 0.12) + 'px Georgia, "Times New Roman", serif';
    var t = 'VOLVO', paso = r * 1.6 / t.length;
    for(var i = 0; i < t.length; i++) g.fillText(t.charAt(i), cx - r * 0.8 + paso * (i + 0.5), cy + H * 0.005);
  }, 1024, 256);
}
/* insignia FMX: letras blancas y la X naranja, como en la parrilla */
function vfxTexInsignia(txt){
  return texRotulo3d(function(g, W, H){
    g.fillStyle = '#25282C'; g.fillRect(0, 0, W, H);
    g.strokeStyle = '#8C939A'; g.lineWidth = 4; g.strokeRect(2, 2, W - 4, H - 4);
    g.textBaseline = 'middle'; g.textAlign = 'left';
    g.font = 'bold ' + Math.round(H * 0.62) + 'px Arial, sans-serif';
    var base = txt.replace(/X$/, ''), w0 = g.measureText(base).width, wx = g.measureText('X').width, x0 = (W - w0 - wx) / 2;
    g.fillStyle = '#F2F3F4'; g.fillText(base, x0, H * 0.55);
    if(/X$/.test(txt)){ g.fillStyle = '#F29A1C'; g.fillText('X', x0 + w0, H * 0.55); }
  }, 256, 96);
}
/* «San Martín» con las olas del logo, blanco sobre fondo transparente */
function vfxTexSanMartin(){
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
/* banderin naranja de la pertiga (obligatorio en mina) */
function vfxTexBanderin(){
  return texRotulo3d(function(g, w, h){
    g.fillStyle = '#F06A12'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#F4F4F2'; g.fillRect(0, h * 0.42, w, h * 0.16);
  }, 128, 96);
}

/* plano con textura; ry: 0 mira a +Z, PI a -Z, -PI/2 a -X, PI/2 a +X */
function vfxPlano(C, tex, w, h, x, y, z, ry, transp){
  var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ map: tex, transparent: !!transp, roughness: 0.45, metalness: 0.05, side: THREE.DoubleSide }));
  m.position.set(x, y, z); m.rotation.y = ry;
  C.G.add(m);
  return m;
}
/* luz que brilla un poco (ambar, roja, blanca) */
function vfxLuz(C, code, w, h, d, hex, x, y, z, k){
  var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), emissive: new THREE.Color(hex), emissiveIntensity: k || 0.45, roughness: 0.2 }));
  m.position.set(x, y, z);
  return C.D.reg(code, m, hex);
}
/* rejilla mirando a -X: fondo oscuro y barras horizontales */
function vfxRejilla(C, code, x, y0, y1, z0, z1, n, hexB, tipoB){
  var D = C.D;
  D.bloque(code, 0.03, y1 - y0, z1 - z0, 'mate', '#0B0C0E', x + 0.01, (y0 + y1) / 2, (z0 + z1) / 2, 0.01);
  var paso = (y1 - y0) / n;
  for(var i = 1; i < n; i++){
    D.bloque(null, 0.04, paso * 0.30, z1 - z0 - 0.02, tipoB || 'mate', hexB, x - 0.012, y0 + paso * i, (z0 + z1) / 2, 0.01);
  }
}
/* malla de panal: rombos instanciados sobre un fondo negro, mirando a -X */
function vfxPanal(C, code, x, y0, y1, z0, z1, hex){
  var D = C.D;
  D.bloque(code, 0.03, y1 - y0, z1 - z0, 'mate', '#08090A', x + 0.012, (y0 + y1) / 2, (z0 + z1) / 2, 0.008);
  var p = 0.055, nz = Math.floor((z1 - z0) / p), ny = Math.floor((y1 - y0) / (p * 0.6));
  var geo = new THREE.BoxGeometry(0.03, p * 0.42, p * 0.42);
  var inst = new THREE.InstancedMesh(geo, D.M.mate(hex), nz * ny);
  var d = new THREE.Object3D(), k = 0;
  for(var j = 0; j < ny; j++){
    for(var i = 0; i < nz; i++){
      d.position.set(x - 0.004, y0 + (j + 0.5) * (y1 - y0) / ny, z0 + (i + 0.5 + (j % 2) * 0.5) * (z1 - z0) / (nz + 0.5));
      d.rotation.set(Math.PI / 4, 0, 0); d.updateMatrix(); inst.setMatrixAt(k++, d.matrix);
    }
  }
  inst.count = k;
  C.G.add(inst);
}
/* separa una poligonal de su centro (marcos de vidrios) */
function vfxEnsanchar(pts, d){
  var cx = 0, cy = 0;
  pts.forEach(function(p){ cx += p[0]; cy += p[1]; });
  cx /= pts.length; cy /= pts.length;
  return pts.map(function(p){
    var dx = p[0] - cx, dy = p[1] - cy, l = Math.hypot(dx, dy) || 1;
    return [p[0] + dx / l * d, p[1] + dy / l * d];
  });
}

/* ═══ bastidor, ejes, suspension, motor y tren de fuerza ═══ */
function vfxChasis(C){
  var D = C.D, L = C.L, bl = D.bloque, tubo = D.tubo, cil = D.cilindro;
  var YF = L.YF, zR = L.zR, R = L.R, col = C.colChasis, E = L.ejes;
  var xF0 = L.X0 + 0.10, xF1 = L.xFin, lar = xF1 - xF0, xm = (xF0 + xF1) / 2;
  /* largueros en C: alma afuera, alas hacia adentro */
  [-1, 1].forEach(function(s){
    bl('42023615', lar, 0.30, 0.022, 'pintura', col, xm, YF - 0.15, s * (zR + 0.035), 0.008);
    [YF - 0.011, YF - 0.289].forEach(function(y){ bl('42023615', lar, 0.022, 0.09, 'pintura', col, xm, y, s * zR, 0.006); });
  });
  var trav = [xF0 + 0.25, L.xCB + 0.05];
  for(var xt = L.xCB + 1.1; xt < xF1 - 0.4; xt += 1.25) trav.push(xt);
  trav.push(xF1 - 0.06);
  trav.forEach(function(x){ bl('42023615', 0.10, 0.24, zR * 2 + 0.04, 'pintura', col, x, YF - 0.15, 0, 0.012); });
  /* travesano trasero con las luces, la placa rayada y los faldones */
  bl(null, 0.12, 0.16, 2.30, 'pintura', col, xF1 + 0.02, YF - 0.45, 0, 0.02);
  [-1, 1].forEach(function(s){ bl(null, 0.08, 0.32, 0.08, 'pintura', col, xF1 - 0.02, YF - 0.30, s * 0.70, 0.01); });
  for(var f = 0; f < 10; f++) bl(null, 0.01, 0.10, 0.22, 'mate', f % 2 ? '#F2F2F2' : '#C62A1E', xF1 + 0.085, YF - 0.45, -1.0 + f * 0.222, 0.004);
  [-1, 1].forEach(function(s){
    bl(null, 0.08, 0.22, 0.46, 'mate', VFX_NEGRO, xF1 + 0.04, YF - 0.20, s * 0.86, 0.02);
    vfxLuz(C, s > 0 ? 'FPI' : 'FPD', 0.02, 0.15, 0.13, '#C2241B', xF1 + 0.085, YF - 0.20, s * 1.00, 0.4);
    vfxLuz(C, s > 0 ? 'FPI' : 'FPD', 0.02, 0.15, 0.10, '#F2A31A', xF1 + 0.085, YF - 0.20, s * 0.86, 0.4);
    vfxLuz(C, s > 0 ? 'FPI' : 'FPD', 0.02, 0.15, 0.10, '#F4F1E6', xF1 + 0.085, YF - 0.20, s * 0.73, 0.3);
    bl(null, 0.02, 0.62, 0.60, 'goma', '#141618', E[E.length - 1] + L.R + 0.22, 0.52, s * L.zO, 0.01);
  });

  /* ═══ ejes delanteros: viga, munones, ballestas parabolicas, amortiguadores ═══ */
  for(var i = 0; i < L.nDel; i++){
    var xe = E[i];
    bl(null, 0.12, 0.15, L.zD * 2 - 0.62, 'pintura', col, xe, R - 0.06, 0, 0.03);
    [-1, 1].forEach(function(s){
      bl(null, 0.12, 0.15, 0.30, 'pintura', col, xe, R - 0.02, s * (L.zD - 0.40), 0.03, [s * 0.35, 0, 0]);
      cil(null, 0.07, 0.07, 0.30, 'metal', VFX_GRIS, xe, R, s * (L.zD - 0.30), null, 16);
      cil(i === 0 ? (s > 0 ? 'BMLH' : 'BMRH') : null, L.rAro * 0.80, L.rAro * 0.80, 0.22, 'metal', VFX_GRIS, xe, R, s * (L.zD - 0.17), [Math.PI / 2, 0, 0], 28);
      /* parabolicas: pocas hojas gruesas, mas delgadas en las puntas */
      [1.55, 1.40, 1.20].forEach(function(lh, k){ bl('42020008', lh, 0.030, 0.09, 'metal', '#2C3035', xe, R + 0.10 + k * 0.036, s * zR, 0.010); });
      bl(null, 0.14, 0.12, 0.12, 'metal', VFX_GRIS, xe, R + 0.06, s * zR, 0.02);
      [-0.76, 0.76].forEach(function(dx){
        bl(null, 0.08, YF - 0.30 - (R + 0.12), 0.07, 'pintura', col, xe + dx, (YF - 0.30 + R + 0.12) / 2, s * zR, 0.01);
      });
      D.cilHidD(s > 0 ? 'SDI' : 'SDD', [xe + 0.20, R + 0.08, s * (zR + 0.12)], [xe + 0.35, YF - 0.10, s * (zR + 0.10)], 0.035, '#2E3236', 0.55);
    });
    tubo(null, [xe + 0.22, R - 0.02, -(L.zD - 0.36)], [xe + 0.22, R - 0.02, L.zD - 0.36], 0.025, 'metal', VFX_GRIS, 10);
  }
  /* caja de direccion adelante a la izquierda y su barra a los munones */
  bl('CDR', 0.26, 0.24, 0.20, 'metal', VFX_GRIS, E[0] - 0.62, YF - 0.20, zR + 0.16, 0.03);
  cil(null, 0.04, 0.04, 0.16, 'metal', '#2E3236', E[0] - 0.62, YF - 0.38, zR + 0.16, null, 10);
  tubo(null, [E[0] - 0.62, YF - 0.42, zR + 0.18], [E[0] - 0.08, R + 0.10, L.zD - 0.36], 0.03, 'metal', VFX_GRIS, 10);
  if(L.nDel === 2) tubo(null, [E[0] - 0.02, R + 0.12, zR + 0.20], [E[1] - 0.10, R + 0.12, zR + 0.20], 0.03, 'metal', VFX_GRIS, 10);

  /* ═══ motor (D13 de seis en linea; D8 en el VM), radiador, embrague y caja ═══ */
  var xm0 = L.X0 + 0.30, xm1 = L.X0 + (L.cab === 'VM' ? 1.30 : 1.55), ym = YF - 0.05;
  bl('RAD1', 0.12, 0.85, 1.00, 'metal', VFX_GRIS, xm0 - 0.10, YF + 0.05, 0, 0.02);
  bl('AAC', 0.04, 0.70, 0.90, 'metal', '#6E757C', xm0 - 0.20, YF + 0.05, 0, 0.01);
  bl('ENG1', xm1 - xm0, 0.62, 0.62, 'metal', VFX_GRIS, (xm0 + xm1) / 2, ym, 0, 0.05);
  bl('ENG1', xm1 - xm0 - 0.10, 0.20, 0.42, 'metal', VFX_GRIS2, (xm0 + xm1) / 2, ym + 0.39, 0, 0.04);
  for(var cc = 0; cc < 6; cc++) cil(null, 0.03, 0.03, 0.05, 'metal', '#2E3236', xm0 + 0.12 + cc * (xm1 - xm0 - 0.24) / 5, ym + 0.51, 0.10, null, 8);
  bl('ENG1', xm1 - xm0 - 0.20, 0.24, 0.50, 'metal', '#2E3236', (xm0 + xm1) / 2, ym - 0.40, 0, 0.04);
  cil('42001655', 0.09, 0.09, 0.22, 'metal', VFX_GRIS2, xm0 + 0.12, YF + 0.05, -0.38, [0, 0, Math.PI / 2], 16);
  cil('AL1', 0.10, 0.10, 0.24, 'metal', '#9AA1A8', xm0 + 0.14, YF + 0.20, 0.36, [0, 0, Math.PI / 2], 18);
  cil('AR1', 0.07, 0.07, 0.30, 'metal', '#2E3236', xm1 - 0.15, YF - 0.30, -0.36, [0, 0, Math.PI / 2], 14);
  D.pon('TLH1', new THREE.TorusGeometry(0.11, 0.06, 10, 18), 'metal', '#6B7178', xm1 - 0.30, YF + 0.30, -0.42, [0, Math.PI / 2, 0]);
  cil('CMP', 0.08, 0.08, 0.24, 'metal', VFX_GRIS2, xm0 + 0.50, YF - 0.08, 0.40, [0, 0, Math.PI / 2], 14);
  /* campana del embrague y la caja I-Shift */
  cil('EMB', 0.30, 0.26, 0.26, 'metal', VFX_GRIS, xm1 + 0.13, YF - 0.12, 0, [0, 0, Math.PI / 2], 24);
  var xg1 = xm1 + 1.00;
  cil('TRM', 0.25, 0.21, xg1 - xm1 - 0.26, 'metal', VFX_GRIS, (xm1 + 0.26 + xg1) / 2, YF - 0.14, 0, [0, 0, Math.PI / 2], 24);
  bl('TRM', 0.40, 0.18, 0.30, 'metal', VFX_GRIS2, xg1 - 0.35, YF + 0.05, -0.12, 0.03);
  /* cardan al primer eje motriz y entre los ejes del bogie */
  var xT1 = E[L.nDel], xT2 = E[L.nDel + 1];
  tubo(null, [xg1, YF - 0.15, 0], [xT1 - 0.30, R + 0.05, 0], 0.055, 'metal', '#9AA1A8', 14);
  tubo(null, [xT1 + 0.25, R + 0.12, 0], [xT2 - 0.30, R + 0.05, 0], 0.05, 'metal', '#9AA1A8', 14);
  if(L.nDel === 2) bl(null, 0.10, 0.20, 0.30, 'pintura', col, (xg1 + xT1) / 2, YF - 0.30, 0, 0.02);

  /* ═══ bogie: puentes con reduccion en las masas (RTH), muelles de bogie ═══ */
  var xb = (xT1 + xT2) / 2;
  [xT1, xT2].forEach(function(x){
    tubo(null, [x, R, -(L.zI - L.A / 2 - 0.05)], [x, R, L.zI - L.A / 2 - 0.05], 0.10, 'pintura', col, 18);
    D.pon('DIFP', new THREE.SphereGeometry(0.27, 24, 16), 'pintura', col, x, R, 0.06);
    cil('DIFP', 0.15, 0.20, 0.30, 'pintura', col, x - 0.28, R + 0.03, 0.06, [0, 0, Math.PI / 2], 18);
    [-1, 1].forEach(function(s){
      cil(s > 0 ? 'BPLH' : 'BPRH', L.rAro * 0.80, L.rAro * 0.80, 0.24, 'metal', VFX_GRIS, x, R, s * (L.zI - L.A / 2 - 0.10), [Math.PI / 2, 0, 0], 28);
      cil('42066068', 0.10, 0.10, 0.20, 'metal', '#2C3035', x + 0.24, R + 0.06, s * (L.zI - L.A / 2 - 0.30), [Math.PI / 2, 0, 0], 16);
      tubo('21003297', [x + 0.24, R + 0.10, s * (L.zI - L.A / 2 - 0.40)], [x + 0.10, YF - 0.30, s * zR], 0.012, 'goma', '#1A1C1F', 6);
    });
    tubo(null, [x, R + 0.24, 0.06], [x + (x < xb ? 0.55 : -0.55), YF - 0.25, zR - 0.05], 0.035, 'metal', VFX_GRIS, 10);
    tubo(null, [x, R + 0.24, 0.06], [x + (x < xb ? 0.55 : -0.55), YF - 0.25, -zR + 0.05], 0.035, 'metal', VFX_GRIS, 10);
  });
  [-1, 1].forEach(function(s){
    var zm = s * (zR + 0.08);
    bl(null, 0.42, Math.max(0.10, YF - 0.30 - (R + 0.30)), 0.10, 'pintura', col, xb, (YF - 0.30 + R + 0.30) / 2, s * (zR + 0.04), 0.02);
    cil(null, 0.10, 0.10, 0.22, 'metal', VFX_GRIS, xb, R + 0.30, zm, [Math.PI / 2, 0, 0], 18);
    var largo = xT2 - xT1 + 0.25;
    [1.0, 0.82, 0.66, 0.50, 0.36].forEach(function(f, k){
      bl(s > 0 ? '42041233' : 'SPD', largo * f, 0.032, 0.10, 'metal', '#2C3035', xb, R + 0.14 + k * 0.034, zm, 0.008);
    });
    bl(null, 0.16, 0.16, 0.14, 'metal', VFX_GRIS, xb, R + 0.22, zm, 0.02);
  });

  /* ═══ caños de aire y el arnes a lo largo del bastidor ═══ */
  [-1, 1].forEach(function(s){
    tubo('LPA', [xF0 + 0.3, YF - 0.06, s * (zR - 0.08)], [xF1 - 0.3, YF - 0.06, s * (zR - 0.08)], 0.012, 'goma', '#2A2D31', 6);
  });
  tubo('HAR', [xF0 + 0.3, YF - 0.22, zR - 0.06], [xF1 - 0.2, YF - 0.22, zR - 0.06], 0.018, 'goma', '#1B1D20', 6);
}

/* lo que cuelga afuera de los largueros: tanque de plastico negro de 400 L a
   la izquierda con el de AdBlue, baterias y tanques de aire a la derecha */
function vfxEquipChasis(C){
  var D = C.D, L = C.L, bl = D.bloque, cil = D.cilindro, YF = L.YF, zR = L.zR, E = L.ejes, R = L.R;
  /* hueco para el tanque: entre los ejes delanteros en el 8x4, detras del delantero en los 6x4 */
  var xa = L.nDel === 2 ? E[0] + R + 0.12 : Math.max(E[0] + R + 0.12, L.xCB + 0.05);
  var xz = L.nDel === 2 ? E[1] - R - 0.12 : xa + 1.15;
  var lt = Math.min(1.10, xz - xa), xt = xa + lt / 2, zt = zR + 0.10 + 0.30, ht = L.nDel === 2 ? 0.66 : 0.60;
  bl('TQC1', lt, ht, 0.60, 'mate', '#1E2023', xt, YF - 0.40, zt, 0.08);
  [-0.28, 0.28].forEach(function(d){ bl(null, 0.05, ht + 0.04, 0.64, 'metal', '#8B9198', xt + d * lt, YF - 0.40, zt, 0.01); });
  cil(null, 0.07, 0.07, 0.06, 'mate', VFX_NEGRO, xt - lt * 0.30, YF - 0.05, zt + 0.10, null, 16);
  /* AdBlue: tanquecito con tapa azul detras del de combustible */
  var xad = L.nDel === 2 ? E[1] + R + 0.32 : xz + 0.28;
  bl(null, 0.40, 0.42, 0.38, 'mate', '#26292D', xad, YF - 0.36, zR + 0.30, 0.05);
  cil(null, 0.06, 0.06, 0.05, 'pintura', '#2F6BEA', xad, YF - 0.13, zR + 0.36, null, 14);
  /* silenciador y caja del catalizador a la derecha, bajo la espalda de la cabina */
  bl('42064643', 0.75, 0.48, 0.50, 'metal', '#9AA1A8', L.xCB + 0.35, YF - 0.20, -(zR + 0.32), 0.07);
  /* baterias, tanques de aire */
  var xbat = L.nDel === 2 ? E[1] + R + 0.45 : xa + 1.30;
  bl('BAT', 0.62, 0.48, 0.52, 'mate', VFX_PLAST, xbat, YF - 0.34, -(zR + 0.36), 0.04);
  bl(null, 0.64, 0.04, 0.54, 'mate', '#2E3236', xbat, YF - 0.08, -(zR + 0.36), 0.01);
  [-0.2, 0.2].forEach(function(d){ bl(null, 0.08, 0.05, 0.05, 'mate', '#C9A13A', xbat + d, YF - 0.20, -(zR + 0.63), 0.01); });
  var xaire = xbat + 0.80, xmax = E[L.nDel] - R - 0.15;
  if(xaire + 0.35 < xmax) [0, 1].forEach(function(k){ cil('LPA', 0.12, 0.12, 0.66, 'pintura', '#2B2F34', xaire, YF - 0.28 - k * 0.27, -(zR + 0.18), [0, 0, Math.PI / 2], 18); });
  /* engrase centralizado: bomba con su deposito transparente */
  var xse = E[L.nDel] - R - 0.35;
  bl('SEN', 0.22, 0.26, 0.20, 'mate', '#2C3035', xse, YF - 0.25, zR + 0.15, 0.02);
  cil('SEN', 0.08, 0.08, 0.22, 'vidrio', '#D8C892', xse, YF, zR + 0.15, null, 16);
  bl('EC', 0.24, 0.18, 0.08, 'mate', '#2A2D31', L.xCB + 0.25, YF - 0.12, zR + 0.10, 0.02);
  bl('SENS', 0.06, 0.06, 0.06, 'mate', VFX_GRIS2, E[L.nDel] - 0.22, R + 0.25, zR - 0.02, 0.01);
}

/* ═══ cabina (FMX, FM o VM) ═══ */
function vfxCabina(C){
  var D = C.D, L = C.L, bl = D.bloque, tubo = D.tubo;
  var X0 = L.X0, Y0 = L.Y0, W = L.W, Lc = L.Lc, rk = L.rake, wsb = L.wsb, wst = L.wst, techo = L.techo, yFB = L.yFB;
  var col = C.colCab, SZ = W / 2, R = L.R, vm = L.cab === 'VM';
  /* casco: perfil de costado extruido a lo ancho; si el piso de la cabina
     queda bajo el tope de la rueda (VM) el perfil lleva el arco recortado */
  var pts = [[X0, yFB], [X0 - 0.01, wsb], [X0 + rk, wst], [X0 + rk + 0.08, techo - 0.05], [X0 + rk + 0.24, techo],
             [X0 + Lc, techo], [X0 + Lc, Y0]];
  var rA = R + 0.09, xa = -(R + 0.16);
  if(Y0 < R + rA - 0.01){
    var dx = Math.sqrt(rA * rA - (Y0 - R) * (Y0 - R)), t0 = Math.atan2(Y0 - R, dx);
    pts.push([dx, Y0]);
    for(var k = 1; k < 12; k++){ var t = t0 + (Math.PI - 2 * t0) * k / 12; pts.push([Math.cos(t) * rA, R + Math.sin(t) * rA]); }
    pts.push([-dx, Y0]);
    xa = Math.min(xa, -dx - 0.02);
  }
  if(Y0 > yFB + 0.01){ pts.push([xa + 0.12, Y0]); pts.push([xa, yFB]); }
  D.perfil('CBN', pts, W, 0, 'pintura', col, 0.07);
  /* parabrisas con su marco negro */
  var dy = wst - wsb, Ls = Math.hypot(rk, dy), a = Math.atan2(rk, dy), nx = -Math.cos(a), ny = Math.sin(a);
  var cx = X0 + rk / 2 - 0.005, cy = (wsb + wst) / 2;
  bl(null, 0.02, Ls + 0.06, W - 0.14, 'mate', '#0F1012', cx + nx * 0.040, cy + ny * 0.040, 0, 0.008, [0, 0, -a]);
  bl(null, 0.02, Ls - 0.06, W - 0.30, 'vidrio', VFX_VIDRIO, cx + nx * 0.054, cy + ny * 0.054, 0, 0.006, [0, 0, -a]);
  [-0.62, 0.18].forEach(function(z){
    tubo(null, [X0 - 0.09, wsb + 0.07, z], [X0 - 0.09 + rk * 0.35, wsb + 0.07 + dy * 0.35, z + 0.52], 0.010, 'mate', '#0E0F11', 6);
  });
  /* parasol oscuro sobre el parabrisas (en las fotos del FMX San Martin) */
  bl('CBN', 0.30, 0.06, W - 0.20, 'pintura', vm ? col : '#2A2D31', X0 + rk + 0.02, techo - 0.04, 0, 0.02, [0, 0, -0.12]);
  for(var m = 0; m < 5; m++) vfxLuz(C, null, 0.06, 0.03, 0.10, '#F0A41C', X0 + rk - 0.12, techo - 0.08, -0.80 + m * 0.40, 0.4);

  /* puertas: ventana con la «ventanita» baja adelante (rasgo de Volvo),
     marco de goma, costuras, manija, asideros y escalones */
  var xd1 = X0 + (vm ? 1.05 : 1.14);
  var vent = [[X0 + 0.20, wsb - 0.26], [X0 + 0.42, wsb - 0.26], [X0 + 0.48, wsb + 0.02], [xd1, wsb + 0.04], [xd1, wst - 0.06],
              [X0 + 0.20 + rk * 0.95, wst - 0.06], [X0 + 0.20 + rk * 0.20, wsb + 0.10]];
  [-1, 1].forEach(function(s){
    D.perfil(null, vfxEnsanchar(vent, 0.05), 0.012, s * (SZ + 0.002), 'mate', '#0F1012', 0.004);
    D.perfil(null, vent, 0.012, s * (SZ + 0.010), 'vidrio', VFX_VIDRIO, 0.004);
    /* costuras de la puerta */
    bl(null, 0.014, wst - Y0 + 0.02, 0.008, 'mate', '#0E0F11', xd1 + 0.08, (Y0 + wst) / 2, s * (SZ + 0.002), 0.002);
    bl(null, 0.014, wsb - Y0 + 0.02, 0.008, 'mate', '#0E0F11', X0 + 0.12, (Y0 + wsb) / 2, s * (SZ + 0.002), 0.002);
    bl(null, 0.20, 0.05, 0.03, 'mate', VFX_NEGRO, xd1 - 0.16, wsb - 0.14, s * (SZ + 0.014), 0.012);
    tubo(null, [xd1 + 0.18, Y0 - 0.05, s * (SZ + 0.05)], [xd1 + 0.18, wsb - 0.05, s * (SZ + 0.05)], 0.018, 'mate', VFX_NEGRO, 8);
    [Y0 + 0.02, wsb - 0.08].forEach(function(y){ tubo(null, [xd1 + 0.18, y, s * SZ], [xd1 + 0.18, y, s * (SZ + 0.05)], 0.014, 'mate', VFX_NEGRO, 6); });
    if(C.texNumPuerta) vfxPlano(C, C.texNumPuerta, 0.62, 0.19, X0 + 0.70, Y0 + 0.24, s * (SZ + 0.006), s > 0 ? 0 : Math.PI, true);
    /* esquinas bajas de plastico negro delante de la rueda (FMX, FM) */
    if(!vm){
      D.perfil(null, [[X0 + 0.02, yFB + 0.02], [xa - 0.01, yFB + 0.02], [xa + 0.11, Y0 - 0.01], [X0 + 0.02, Y0 - 0.01]], 0.03, s * (SZ + 0.008), 'mate', VFX_PLAST, 0.01);
    }
    /* espejos: brazo, retrovisor principal y gran angular */
    var zE = s * (SZ + 0.30);
    tubo(null, [X0 + 0.10, wst - 0.08, s * (SZ - 0.02)], [X0 - 0.04, wst - 0.02, zE], 0.022, 'mate', VFX_NEGRO, 8);
    tubo(null, [X0 + 0.10, wsb + 0.05, s * (SZ - 0.02)], [X0 - 0.04, wsb + 0.10, zE], 0.020, 'mate', VFX_NEGRO, 8);
    bl(null, 0.12, 0.46, 0.25, 'mate', VFX_NEGRO, X0 - 0.06, wst - 0.30, zE, 0.04);
    bl(null, 0.012, 0.42, 0.21, 'cromo', null, X0 + 0.005, wst - 0.30, zE, 0.004);
    bl(null, 0.11, 0.22, 0.22, 'mate', VFX_NEGRO, X0 - 0.06, wsb + 0.20, zE, 0.04);
    bl(null, 0.012, 0.18, 0.18, 'cromo', null, X0, wsb + 0.20, zE, 0.004);
    /* escalones bajo la puerta, delante de la rueda */
    var xs0 = X0 + 0.50, xs1 = L.ejes[0] - R - 0.08, xsm = (xs0 + xs1) / 2, ws = xs1 - xs0;
    var ys1 = vm ? L.by1 - 0.05 : Y0 - 0.05;
    bl(null, ws, ys1 - 0.40, 0.30, 'mate', VFX_PLAST, xsm, (ys1 + 0.40) / 2, s * (SZ - 0.24), 0.03);
    var nEsc = Math.max(2, Math.round((ys1 - 0.45) / 0.34));
    for(var j = 0; j < nEsc; j++){
      var ye = 0.46 + j * (ys1 - 0.46) / nEsc;
      bl(null, ws - 0.04, 0.04, 0.28, 'metal', '#8B9198', xsm, ye, s * (SZ - 0.19), 0.008);
      bl(null, ws - 0.02, 0.10, 0.02, 'mate', VFX_PLAST, xsm, ye - 0.04, s * (SZ - 0.05), 0.006);
    }
  });
  /* espejo de acera sobre el parabrisas, del lado derecho */
  tubo(null, [X0 + rk + 0.10, techo - 0.02, -SZ + 0.25], [X0 - 0.10, techo - 0.10, -SZ + 0.30], 0.018, 'mate', VFX_NEGRO, 8);
  bl(null, 0.20, 0.20, 0.24, 'mate', VFX_NEGRO, X0 - 0.12, techo - 0.22, -SZ + 0.30, 0.04, [0, 0, 0.5]);
  /* techo: deflector de la cabina extendida (FMX), escotilla, circulina y faro pirata */
  if(L.deflector){
    D.perfil('CBN', [[X0 + Lc - 0.70, techo - 0.01], [X0 + Lc + 0.04, techo - 0.01], [X0 + Lc + 0.04, techo + 0.13], [X0 + Lc - 0.40, techo + 0.13]],
      W - 0.10, 0, 'mate', '#26292D', 0.03);
  }
  bl(null, 0.62, 0.05, 0.62, 'mate', '#2A2D31', X0 + Lc * 0.50, techo + 0.055, 0, 0.02);
  var xBal = X0 + rk + 0.45;
  D.cilindro('CIR', 0.11, 0.12, 0.06, 'mate', VFX_NEGRO, xBal, techo + 0.07, 0.35, null, 20);
  var bal = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.10, 0.17, 20),
    new THREE.MeshPhysicalMaterial({ color: new THREE.Color(C.colBaliza), emissive: new THREE.Color(C.colBaliza), emissiveIntensity: 0.5,
      roughness: 0.15, transparent: true, opacity: 0.9, clearcoat: 1 }));
  bal.position.set(xBal, techo + 0.18, 0.35); D.reg('CIR', bal, C.colBaliza);
  D.cilindro(null, 0.04, 0.04, 0.16, 'mate', VFX_NEGRO, X0 + rk + 0.45, techo + 0.10, SZ - 0.30, null, 10);
  D.cilindro('FPR', 0.10, 0.10, 0.16, 'mate', VFX_NEGRO, X0 + rk + 0.40, techo + 0.25, SZ - 0.30, [0, 0, Math.PI / 2], 18);
  D.cilindro(null, 0.085, 0.085, 0.01, 'vidrio', '#F4EDCF', X0 + rk + 0.31, techo + 0.25, SZ - 0.30, [0, 0, Math.PI / 2], 18);
  /* antena de radio */
  tubo(null, [X0 + Lc - 0.30, techo + 0.02, -SZ + 0.30], [X0 + Lc - 0.10, techo + 0.85, -SZ + 0.30], 0.008, 'mate', VFX_NEGRO, 6);
  /* espalda: ventanita y el ducto de aire de admision a la derecha, que baja al filtro */
  bl(null, 0.02, 0.36, 0.70, 'mate', '#0F1012', X0 + Lc + 0.044, wsb + 0.30, 0.30, 0.01);
  bl(null, 0.02, 0.28, 0.62, 'vidrio', VFX_VIDRIO, X0 + Lc + 0.050, wsb + 0.30, 0.30, 0.01);
  var xe = X0 + Lc + 0.16, za = -SZ + 0.24;
  bl(null, 0.24, techo - Y0 + 0.10, 0.34, 'pintura', col, xe, (Y0 + techo + 0.10) / 2, za, 0.05);
  bl(null, 0.25, 0.20, 0.35, 'mate', VFX_PLAST, xe, techo - 0.02, za, 0.03);
  for(var l = 0; l < 4; l++) bl(null, 0.02, 0.025, 0.30, 'mate', '#0B0C0E', xe - 0.13, techo - 0.08 + l * 0.04, za, 0.004);
  tubo(null, [xe, Y0, za], [xe - 0.05, L.YF - 0.05, -(L.zR + 0.40)], 0.09, 'goma', '#1B1D20', 12);
  bl(null, 0.50, 0.40, 0.40, 'mate', '#2A2D31', xe - 0.10, L.YF - 0.25, -(L.zR + 0.42), 0.06);
  /* escape vertical a la izquierda detras de la cabina, con su escudo */
  var zx = SZ - 0.22;
  D.cilindro(null, 0.075, 0.075, techo + 0.25 - L.YF, 'metal', '#A9AFB5', xe, (L.YF + techo + 0.25) / 2, zx, null, 18);
  bl(null, 0.06, 1.0, 0.20, 'metal', '#C2C7CC', xe - 0.09, techo - 0.40, zx, 0.01);
  D.cilindro(null, 0.08, 0.075, 0.10, 'mate', '#2A2D31', xe, techo + 0.30, zx, [0, 0, 0.35], 18);
  tubo(null, [xe, L.YF - 0.05, zx], [L.xCB + 0.35, L.YF - 0.20, -(L.zR + 0.10)], 0.07, 'metal', '#9AA1A8', 12);
  /* guardafangos negros sobre las ruedas delanteras y faldon */
  for(var i = 0; i < L.nDel; i++){
    [-1, 1].forEach(function(s){
      var arco = new THREE.Shape(), r1 = R + 0.10, r0 = R + 0.05;
      arco.absarc(0, 0, r1, 0.15, Math.PI - 0.15, false);
      arco.absarc(0, 0, r0, Math.PI - 0.15, 0.15, true);
      var gA = new THREE.ExtrudeGeometry(arco, { depth: L.A + 0.12, bevelEnabled: false, curveSegments: 18 });
      gA.translate(0, 0, -(L.A + 0.12) / 2);
      D.pon(null, gA, 'mate', VFX_PLAST, L.ejes[i], R, s * L.zD);
      bl(null, 0.02, 0.48, L.A + 0.10, 'goma', '#141618', L.ejes[i] + R + 0.12, 0.40, s * L.zD, 0.01);
    });
  }
}

/* faro de esquina: caja en trapecio, mica, dos proyectores y la luz de dia
   en V (LED); en el FMX con rejilla protectora delante */
function vfxFaro(C, s, zi, zo, y0, y1, x, guarda){
  var D = C.D, code = s > 0 ? 'FDI' : 'FDD';
  var tr = [[zi, y0 + 0.04], [zo, y0], [zo, y1], [zi, y1 - 0.06]];
  if(s < 0) tr.reverse();
  D.perfilX(null, tr, 0.08, x + 0.02, 'mate', '#0D0E10', 0.012);
  D.perfilX(code, vfxEnsanchar(tr, -0.025), 0.02, x - 0.028, 'vidrio', '#A8B6C0', 0.004);
  var ym = (y0 + y1) / 2;
  [0.30, 0.66].forEach(function(f){ D.faro(code, x + 0.01, ym - 0.02, zi + (zo - zi) * f, 0.060); });
  /* V de la luz de dia: dos trazos que bajan hacia afuera */
  var zc = zi + (zo - zi) * 0.48, hv = (y1 - y0) * 0.42, wv = Math.abs(zo - zi) * 0.40;
  [-1, 1].forEach(function(k){
    var b = vfxLuz(C, 'LSM', 0.012, 0.022, Math.hypot(hv, wv * 0.5), '#FFFFFF', x - 0.045, ym + 0.02, zc + k * s * wv * 0.22, 0.95);
    b.rotation.x = -k * s * Math.atan2(hv, wv * 0.5) + (k * s > 0 ? Math.PI / 2 : -Math.PI / 2);
  });
  vfxLuz(C, 'LSM', 0.012, 0.06, 0.05, '#F2A31A', x - 0.045, y0 + 0.07, zo - s * 0.05, 0.6);
  if(guarda){
    var zz0 = Math.min(zi, zo) - 0.03, zz1 = Math.max(zi, zo) + 0.03, zm = (zz0 + zz1) / 2, wz = zz1 - zz0, xg = x - 0.11;
    [y0 - 0.02, y1 + 0.02].forEach(function(y){ D.bloque(null, 0.04, 0.035, wz, 'mate', VFX_NEGRO, xg, y, zm, 0.01); });
    [zz0, zz1].forEach(function(z){ D.bloque(null, 0.04, y1 - y0 + 0.07, 0.035, 'mate', VFX_NEGRO, xg, (y0 + y1) / 2, z, 0.01); });
    for(var i = 1; i <= 3; i++) D.bloque(null, 0.025, 0.018, wz, 'mate', VFX_NEGRO, xg, y0 + (y1 - y0) * i / 4, zm, 0.005);
    for(var j = 1; j <= 3; j++) D.bloque(null, 0.025, y1 - y0, 0.018, 'mate', VFX_NEGRO, xg, (y0 + y1) / 2, zz0 + wz * j / 4, 0.005);
    /* brazos que la sujetan a la cabina */
    [zz0 + 0.04, zz1 - 0.04].forEach(function(z){ D.bloque(null, 0.10, 0.04, 0.03, 'mate', VFX_NEGRO, x - 0.06, y1 + 0.02, z, 0.01); });
  }
}

/* ═══ frente FMX / FM (generacion 2020) ═══ */
function vfxFrenteFM(C){
  var D = C.D, L = C.L, bl = D.bloque, fmx = L.cab === 'FMX';
  var X0 = L.X0, Y0 = L.Y0, W = L.W, FX = X0 - 0.045, wsb = L.wsb, yFB = L.yFB;
  var gw = W - 0.74;
  /* panel alto gris oscuro con la marca de hierro, bajo el parabrisas */
  var yp0 = Y0 + 0.18, yp1 = wsb - 0.03;
  bl('CBN', 0.07, yp1 - yp0, gw, 'mate', VFX_PANEL, FX - 0.02, (yp0 + yp1) / 2, 0, 0.03);
  /* esquinas del panel que bajan hacia los faros (como en la foto) */
  [-1, 1].forEach(function(s){
    D.perfilX('CBN', s > 0 ? [[gw / 2 - 0.10, yp1], [gw / 2, yp1], [gw / 2, yFB + 0.40], [gw / 2 - 0.10, yp0]].map(function(p){ return p; })
      : [[-gw / 2, yp1], [-gw / 2 + 0.10, yp1], [-gw / 2 + 0.10, yp0], [-gw / 2, yFB + 0.40]], 0.06, FX - 0.02, 'pintura', VFX_PANEL, 0.01);
  });
  vfxPlano(C, C.texHierro, gw - 0.06, (gw - 0.06) / 4, FX - 0.058, (yp0 + yp1) / 2 + 0.01, 0, -Math.PI / 2, true);
  D.pon(null, new THREE.TorusGeometry((gw - 0.06) / 4 * 0.33, 0.012, 8, 40), 'cromo', null, FX - 0.062, (yp0 + yp1) / 2 + 0.01, 0, [0, Math.PI / 2, 0]);
  /* parrilla alta de panal con la insignia, y la franja (limon en San Martin) */
  var yg0 = Y0 + 0.035, yg1 = yp0 - 0.01;
  vfxPanal(C, 'RAD1', FX - 0.03, yg0, yg1, -gw / 2 + 0.06, gw / 2 - 0.06, '#2B2E33');
  D.letrero(C.texInsignia, 0.24, 0.09, FX - 0.065, (yg0 + yg1) / 2, gw / 2 - 0.30, -Math.PI / 2);
  bl(null, 0.03, 0.045, gw - 0.20, C.franja ? 'pintura' : 'metal', C.franja || '#A9B0B7', FX - 0.05, Y0 + 0.01, 0, 0.01);
  /* parrilla baja de lamas con los neblineros redondos al medio */
  var yl0 = yFB + 0.03, yl1 = Y0 - 0.02;
  bl(null, 0.06, yl1 - yl0 + 0.04, gw - 0.04, 'pintura', '#202327', FX - 0.015, (yl0 + yl1) / 2, 0, 0.02);
  vfxRejilla(C, 'AAC', FX - 0.04, yl0 + 0.02, yl1 - 0.02, -gw / 2 + 0.55, gw / 2 - 0.55, 4, '#2E3237', 'mate');
  [-1, 1].forEach(function(s){
    var zf = s * (gw / 2 - 0.30);
    D.bloque(null, 0.05, yl1 - yl0 - 0.04, 0.34, 'mate', '#121316', FX - 0.04, (yl0 + yl1) / 2, zf, 0.02);
    D.faro('FNB', FX - 0.05, (yl0 + yl1) / 2, zf, 0.075);
  });
  /* faros en las esquinas blancas */
  [-1, 1].forEach(function(s){
    vfxFaro(C, s, s * (gw / 2 + 0.03), s * (W / 2 - 0.07), yFB + 0.05, Y0 + 0.13, FX - 0.02, fmx);
  });
}

/* ═══ frente VM ═══ */
function vfxFrenteVM(C){
  var D = C.D, L = C.L, bl = D.bloque;
  var X0 = L.X0, W = L.W, FX = X0 - 0.045, wsb = L.wsb, yFB = L.yFB;
  var gw = W - 0.62;
  /* panel gris oscuro bajo el parabrisas con la marca de hierro */
  var yp0 = wsb - 0.30, yp1 = wsb - 0.03;
  bl('CBN', 0.06, yp1 - yp0, gw + 0.10, 'pintura', VFX_PANEL, FX - 0.015, (yp0 + yp1) / 2, 0, 0.03);
  vfxPlano(C, C.texHierro, gw - 0.10, (gw - 0.10) / 4, FX - 0.05, (yp0 + yp1) / 2, 0, -Math.PI / 2, true);
  /* parrilla negra de lamas con VOLVO arriba a la izquierda */
  var yg0 = yFB + 0.10, yg1 = yp0 - 0.08;
  bl(null, 0.05, yg1 - yg0 + 0.06, gw + 0.04, 'pintura', '#1E2124', FX - 0.01, (yg0 + yg1) / 2, 0, 0.02);
  vfxRejilla(C, 'RAD1', FX - 0.04, yg0, yg1, -gw / 2 + 0.04, gw / 2 - 0.04, 6, '#2C3035', 'mate');
  D.letrero(vfxTexLetras('VOLVO', '#1E2124', '#C9CED3', true, 256, 64), 0.30, 0.07, FX - 0.065, yg1 + 0.01, gw / 2 - 0.24, -Math.PI / 2);
  /* parachoques gris claro con los faros arriba en las esquinas */
  var by0 = L.by0, by1 = L.by1;
  bl('42023615', 0.26, by1 - by0, W - 0.04, 'pintura', '#9DA3A9', L.xB + 0.13, (by0 + by1) / 2, 0, 0.05);
  vfxRejilla(C, 'AAC', L.xB - 0.005, by0 + 0.14, by0 + 0.36, -0.55, 0.55, 3, '#2E3237', 'mate');
  bl(null, 0.03, 0.18, 0.70, 'mate', '#121316', L.xB - 0.002, by1 - 0.20, 0, 0.01);
  [-1, 1].forEach(function(s){
    vfxFaro(C, s, s * (W / 2 - 0.62), s * (W / 2 - 0.08), by1 - 0.30, by1 - 0.04, L.xB - 0.01, false);
    D.faro('FNB', L.xB + 0.01, by0 + 0.14, s * (W / 2 - 0.30), 0.05);
    bl(null, 0.04, 0.10, 0.20, 'mate', '#121316', L.xB - 0.003, by0 + 0.14, s * (W / 2 - 0.30), 0.01);
  });
  bl(null, 0.40, 0.03, 1.20, 'metal', '#4A4F55', L.xB + 0.25, by0 - 0.02, 0, 0.01);
}

/* ═══ parachoques FMX (acero, con placa de proteccion) y FM ═══ */
function vfxParachoques(C){
  var D = C.D, L = C.L, bl = D.bloque, xb = L.xB, W = L.W, fmx = L.cab === 'FMX';
  var by0 = L.by0, by1 = L.by1, hexP = fmx ? '#24272B' : '#4A5057', zc = W / 2 - 0.30;
  bl('42023615', 0.24, by1 - by0 - 0.10, zc * 2, 'pintura', hexP, xb + 0.12, (by0 + by1) / 2 + 0.02, 0, 0.04);
  var tapa = bl('42023615', 0.22, 0.06, zc * 2, 'pintura', hexP, xb + 0.17, by1 - 0.03, 0, 0.02);
  tapa.rotation.z = -0.30;
  /* esquinas que se doblan hacia las ruedas */
  [-1, 1].forEach(function(s){
    var esq = bl('42023615', 0.24, by1 - by0 - 0.12, 0.26, 'pintura', hexP, xb + 0.20, (by0 + by1) / 2 + 0.03, s * (zc + 0.08), 0.04);
    esq.rotation.y = s * 0.50;
  });
  if(fmx){
    /* placa de proteccion plateada inclinada abajo (la que se ve en la foto) */
    var pl = bl(null, 0.36, 0.035, zc * 2 - 0.30, 'metal', '#8E959C', xb + 0.10, by0 + 0.06, 0, 0.01);
    pl.rotation.z = 0.45;
    bl(null, 0.03, 0.10, zc * 2 - 0.40, 'metal', '#9AA1A8', xb - 0.01, by0 + 0.18, 0, 0.01);
    /* gancho de remolque y escalones del parabrisas */
    bl(null, 0.14, 0.16, 0.26, 'metal', '#2E3236', xb - 0.03, by0 + 0.32, 0, 0.02);
    D.cilindro(null, 0.03, 0.03, 0.28, 'cromo', null, xb - 0.07, by0 + 0.32, 0, null, 10);
  } else {
    bl(null, 0.40, 0.03, 1.40, 'metal', '#4A4F55', xb + 0.25, by0 - 0.02, 0, 0.01);
    [-1, 1].forEach(function(s){ D.faro('FNB', xb + 0.01, (by0 + by1) / 2, s * (zc - 0.12), 0.05); });
  }
  [-0.45, 0.45].forEach(function(z){ bl(null, 0.04, 0.07, 0.30, 'mate', '#060708', xb - 0.004, by1 - 0.14, z, 0.01); });
  /* placa reflectiva roja y blanca */
  for(var f = 0; f < 6; f++) bl(null, 0.01, 0.10, 0.10, 'mate', f % 2 ? '#F2F2F2' : '#C62A1E', xb - 0.012, by1 - 0.30, -0.25 + f * 0.10, 0.003);
}

/* ═══ CUERPO: tolva roquera con cilindro frontal ═══ */
function vfxVolquete(C){
  var D = C.D, L = C.L, bl = D.bloque, est = D.esTolva, tubo = D.tubo;
  var YF = L.YF, YS = YF + 0.22, x0 = L.tX0, x1 = L.tX1, xc = x1 - 1.25, YB = YS + L.tAlt, ZB = L.tZB;
  var YH = L.techo + 0.16, xa = L.xCB - 0.62;
  var AZ = C.colCuerpo, AZ2 = C.colCuerpo2;
  /* falso chasis fijo sobre los largueros */
  [-1, 1].forEach(function(s){ bl(null, L.xFin - x0 + 0.15, 0.16, 0.10, 'pintura', C.colChasis, (x0 + L.xFin) / 2 - 0.05, YF + 0.08, s * L.zR, 0.02); });
  /* largueros y travesanos bajo el piso */
  [-1, 1].forEach(function(s){ est(bl('TLV', xc - x0, 0.20, 0.14, 'pintura', AZ2, (x0 + xc) / 2, YS - 0.06, s * (L.zR + 0.02), 0.03)); });
  for(var k = 0; k < 9; k++) est(bl(null, 0.10, 0.14, ZB * 2 - 0.2, 'pintura', AZ2, x0 + 0.35 + k * (xc - x0 - 0.4) / 8, YS - 0.04, 0, 0.02));
  /* piso y cola inclinada (sin compuerta: tolva de roca) */
  est(bl('TLV', xc - x0, 0.10, ZB * 2 - 0.10, 'pintura', AZ, (x0 + xc) / 2, YS + 0.05, 0, 0.03));
  var cola = est(bl('TLV', Math.hypot(x1 - xc, 0.34), 0.12, ZB * 2 - 0.10, 'pintura', AZ, (xc + x1) / 2, YS + 0.22, 0, 0.03));
  cola.rotation.z = Math.atan2(0.34, x1 - xc);
  est(bl('TLV', 0.20, 0.22, ZB * 2 + 0.10, 'pintura', AZ2, x1 - 0.02, YS + 0.40, 0, 0.05));
  [-1, 1].forEach(function(s){
    var zc = s * (ZB - 0.04);
    est(D.perfil('TLV', [[x0, YS - 0.02], [xc, YS - 0.02], [x1, YS + 0.32], [x1, YB], [x0, YB]], 0.08, zc, 'pintura', AZ, 0.02));
    /* pasamano superior, larguero inferior */
    est(bl('TLV', x1 - x0 + 0.06, 0.18, 0.16, 'pintura', AZ2, (x0 + x1) / 2, YB - 0.04, s * (ZB + 0.02), 0.06));
    est(bl('TLV', xc - x0, 0.14, 0.12, 'pintura', AZ2, (x0 + xc) / 2, YS + 0.03, s * (ZB + 0.02), 0.03));
    var tr = est(bl('TLV', Math.hypot(x1 - xc, 0.34), 0.14, 0.12, 'pintura', AZ2, (xc + x1) / 2, YS + 0.20, s * (ZB + 0.02), 0.03));
    tr.rotation.z = Math.atan2(0.34, x1 - xc);
    est(D.perfil('TLV', [[x0, YB - 0.05], [x0, YH], [x0 + 0.35, YH], [x0 + 1.10, YB - 0.05]], 0.08, s * (ZB - 0.04), 'pintura', AZ, 0.02));
    /* nervios verticales ahusados (dejan libre el logo y el numero) */
    var xs = [x0 + 0.25, x0 + L.tLar * 0.47, x0 + L.tLar * 0.62, x1 - 0.12];
    xs.forEach(function(x){
      var yb = x > xc ? YS + 0.32 * (x - xc) / (x1 - xc) + 0.10 : YS + 0.10, yt = YB - 0.14;
      var gN = new THREE.BoxGeometry(0.14, yt - yb, 0.16), pos = gN.attributes.position;
      for(var v = 0; v < pos.count; v++) if(pos.getY(v) < 0) pos.setZ(v, pos.getZ(v) * 0.45);
      gN.computeVertexNormals();
      est(D.pon('TLV', gN, 'pintura', AZ2, x, (yb + yt) / 2, s * (ZB + 0.04)));
    });
    /* logo adelante (San Martin) y numero atras */
    var ry = s > 0 ? 0 : Math.PI, ym = (YS + YB) / 2;
    if(C.texLogo) est(vfxPlano(C, C.texLogo, Math.min(2.30, L.tLar * 0.36), Math.min(2.30, L.tLar * 0.36) * 0.39, x0 + L.tLar * 0.25, ym + 0.08, s * (ZB + 0.004), ry, true));
    est(vfxPlano(C, C.texNum, 1.45, 0.45, x0 + L.tLar * 0.80, ym + 0.20, s * (ZB + 0.004), ry, true));
    /* cinta reflectiva en el borde bajo */
    var nC = Math.floor((xc - x0 - 0.5) / 0.6);
    for(var c = 0; c < nC; c++) est(bl(null, 0.24, 0.05, 0.01, 'mate', c % 2 ? '#F2F2F2' : '#C62A1E', x0 + 0.5 + c * 0.6, YS + 0.03, s * (ZB + 0.085), 0.004));
    /* cartela entre el frontal alto y la visera */
    est(D.perfil('TLV', [[x0 - 0.02, YH - 0.02], [xa + 0.05, YH + 0.06], [x0 - 0.02, YH - 0.40]], 0.08, s * (ZB - 0.10), 'pintura', AZ2, 0.02));
  });
  /* frontal alto con refuerzos */
  est(bl('TLV', 0.10, YH - YS + 0.04, ZB * 2, 'pintura', AZ, x0 - 0.03, (YS + YH) / 2, 0, 0.03));
  [YS + 0.55, YB - 0.30, YH - 0.35].forEach(function(y){ est(bl(null, 0.12, 0.10, ZB * 2 - 0.10, 'pintura', AZ2, x0 - 0.12, y, 0, 0.03)); });
  [-0.70, 0.70].forEach(function(z){ est(bl(null, 0.12, YH - YS - 0.2, 0.10, 'pintura', AZ2, x0 - 0.12, (YS + YH) / 2, z, 0.03)); });
  /* visera sobre la espalda de la cabina, con labio y nervios */
  est(bl('TLV', x0 - xa + 0.05, 0.08, ZB * 2 - 0.06, 'pintura', AZ, (xa + x0) / 2, YH + 0.02, 0, 0.03));
  var lab = est(bl(null, 0.22, 0.06, ZB * 2 - 0.06, 'pintura', AZ2, xa - 0.06, YH + 0.06, 0, 0.02)); lab.rotation.z = -0.4;
  [-0.9, 0, 0.9].forEach(function(z){ est(bl(null, x0 - xa - 0.1, 0.12, 0.08, 'pintura', AZ2, (xa + x0) / 2, YH - 0.07, z, 0.02)); });
  /* numero en la cola */
  est(vfxPlano(C, C.texNum, 1.20, 0.37, x1 + 0.09, YS + 0.40, 0, Math.PI / 2, true));
  /* pertiga con banderin en la esquina delantera izquierda */
  est(tubo(null, [x0 + 0.10, YB, ZB - 0.10], [x0 + 0.10, YB + 1.50, ZB - 0.10], 0.018, 'pintura', '#E8E8E4', 8));
  est(vfxPlano(C, C.texBanderin, 0.42, 0.30, x0 + 0.33, YB + 1.34, ZB - 0.10, 0, false));
  /* bisagras traseras de la tolva */
  var xp = L.xFin - 0.18, yp = YF + 0.12;
  [-1, 1].forEach(function(s){
    est(D.perfil(null, [[xp - 0.30, YS - 0.16], [xp + 0.25, YS - 0.16], [xp + 0.10, yp - 0.04], [xp - 0.10, yp - 0.04]], 0.06, s * (L.zR + 0.10), 'pintura', AZ2, 0.01));
    D.perfil('PYB', [[xp - 0.25, YF], [xp + 0.15, YF], [xp + 0.05, yp + 0.08], [xp - 0.12, yp + 0.08]], 0.05, s * (L.zR + 0.17), 'pintura', C.colChasis, 0.01);
    D.cilindro('PYB', 0.055, 0.055, 0.28, 'metal', '#4A4F55', xp, yp, s * (L.zR + 0.14), [Math.PI / 2, 0, 0], 16);
  });
  /* cilindro telescopico frontal de cuatro etapas */
  var xcil = (L.xCB + x0) / 2 + 0.02, yc0 = YF - 0.05, yc1 = YB - 0.30;
  bl(null, 0.24, 0.12, 0.70, 'pintura', C.colChasis, xcil, YF + 0.02, 0, 0.02);
  D.cilindro('PHY', 0.13, 0.13, 0.95, 'pintura', '#1E2023', xcil, yc0 + 0.55, 0, null, 24);
  D.cilindro('PHY', 0.15, 0.15, 0.06, 'pintura', '#1E2023', xcil, yc0 + 1.03, 0, null, 24);
  [[0.11, 1.06, 1.38], [0.095, 1.38, 1.62], [0.08, 1.62, yc1 - yc0 - 0.08]].forEach(function(q){
    if(q[2] > q[1]) D.cilindro(null, q[0], q[0], q[2] - q[1], 'cromo', null, xcil, yc0 + (q[1] + q[2]) / 2, 0, null, 20);
  });
  D.pon(null, new THREE.SphereGeometry(0.10, 14, 10), 'metal', '#3A3F45', xcil, yc0 + 0.08, 0);
  est(bl(null, 0.30, 0.16, 0.40, 'pintura', AZ2, xcil + 0.08, yc1, 0, 0.03));
  /* bomba de levante en la toma de fuerza, tanque hidraulico y mangueras */
  D.cilindro('HPM', 0.09, 0.09, 0.26, 'metal', VFX_GRIS2, L.X0 + 2.45, YF - 0.35, -0.22, [0, 0, Math.PI / 2], 16);
  bl('TQH1', 0.34, 0.52, 0.42, 'pintura', '#26292D', xcil, YF + 0.32, 0.78, 0.04);
  D.cilindro(null, 0.05, 0.05, 0.08, 'mate', VFX_NEGRO, xcil, YF + 0.62, 0.78, null, 12);
  tubo('LPH', [L.X0 + 2.45, YF - 0.30, -0.22], [xcil, yc0 + 0.25, -0.12], 0.022, 'goma', '#1A1C1F', 8);
  tubo('LPH', [xcil, YF + 0.10, 0.60], [xcil, yc0 + 0.20, 0.12], 0.022, 'goma', '#1A1C1F', 8);
  /* aleta sobre el bogie */
  [-1, 1].forEach(function(s){
    var xg0 = L.ejes[L.nDel] - L.R - 0.12, xg1 = L.ejes[L.nDel + 1] + L.R + 0.12;
    bl(null, xg1 - xg0, 0.03, 0.80, 'mate', VFX_PLAST, (xg0 + xg1) / 2, 2 * L.R + 0.12, s * (L.zO - 0.10), 0.01);
    bl(null, 0.05, 0.05, 0.40, 'pintura', C.colChasis, (xg0 + xg1) / 2, 2 * L.R + 0.10, s * (L.zR + 0.25), 0.01);
  });
  return new THREE.Vector3(xp, yp, 0);
}

/* ═══ CUERPO: cisterna eliptica de agua con flauta de riego ═══ */
function vfxCisterna(C){
  var D = C.D, L = C.L, bl = D.bloque, tubo = D.tubo, cil = D.cilindro;
  var vm = L.cab === 'VM';
  var YF = L.YF, x0 = L.xCB + 0.32, x1 = L.xFin - 0.55;
  var a = vm ? 1.10 : 1.17, b = vm ? 0.72 : 0.78, yc = YF + 0.18 + b, ytop = yc + b;
  var colT = C.colCuerpo, col2 = C.colCuerpo2;
  /* casco eliptico y casquetes */
  var cas = cil(null, 1, 1, x1 - x0 - 0.40, 'pintura', colT, (x0 + x1) / 2, yc, 0, [0, 0, Math.PI / 2], 48);
  cas.scale.set(b, 1, a);
  [x0 + 0.20, x1 - 0.20].forEach(function(x){
    var cq = D.pon(null, new THREE.SphereGeometry(1, 40, 20), 'pintura', colT, x, yc, 0);
    cq.scale.set(0.26, b, a);
    var ar = D.pon(null, new THREE.TorusGeometry(1, 0.022, 8, 56), 'pintura', col2, x, yc, 0, [0, Math.PI / 2, 0]);
    ar.scale.set(a + 0.005, b + 0.005, 1);
  });
  for(var r = 1; r <= 3; r++){
    var ar2 = D.pon(null, new THREE.TorusGeometry(1, 0.02, 8, 56), 'pintura', col2, x0 + 0.20 + r * (x1 - x0 - 0.40) / 4, yc, 0, [0, Math.PI / 2, 0]);
    ar2.scale.set(a + 0.004, b + 0.004, 1);
  }
  /* franja que sigue la curva del casco (gajo de cilindro bajo el ecuador) */
  [-0.26, Math.PI + 0.26].forEach(function(tc){
    var gF = new THREE.CylinderGeometry(1, 1, x1 - x0 - 0.42, 48, 1, true, tc - 0.07, 0.14);
    var fr = D.pon(null, gF, 'pintura', C.colFranja, (x0 + x1) / 2, yc, 0, [0, 0, Math.PI / 2]);
    fr.material.side = THREE.DoubleSide;
    fr.scale.set(b + 0.004, 1, a + 0.004);
  });
  var texL = vfxTexLetras('AGUA NO POTABLE', C.colLetrero, '#FFFFFF', false, 1024, 96);
  [-1, 1].forEach(function(s){
    var ry = s > 0 ? 0 : Math.PI, zp = s * (a + 0.032);
    vfxPlano(C, texL, 2.0, 0.19, (x0 + x1) / 2 - 0.05, yc + 0.02, zp, ry, false);
    vfxPlano(C, C.texNum, 1.00, 0.30, x1 - 0.90, yc + 0.30, zp, ry, true);
    if(C.texLogo) vfxPlano(C, C.texLogo, 1.20, 0.47, x0 + 1.00, yc + 0.36, s * (a * 0.96 + 0.04), ry, true);
  });
  /* cunas sobre el falso chasis, que siguen la panza del tanque */
  var yEl = function(z){ return yc - b * Math.sqrt(Math.max(0, 1 - (z / a) * (z / a))) - 0.012; };
  [-1, 1].forEach(function(s){ bl(null, x1 - x0, 0.14, 0.12, 'pintura', C.colChasis, (x0 + x1) / 2, YF + 0.07, s * L.zR, 0.02); });
  [x0 + 0.45, (x0 + x1) / 2 - 0.6, (x0 + x1) / 2 + 0.6, x1 - 0.45].forEach(function(x){
    var pts = [[-0.80, YF + 0.10], [0.80, YF + 0.10]];
    for(var z = 0.80; z >= -0.801; z -= 0.20) pts.push([z, yEl(z)]);
    D.perfilX(null, pts, 0.10, x, 'pintura', C.colChasis, 0.01);
  });
  /* arriba: buzones, pasarela de rejilla y barandas */
  var yTop = function(z){ return yc + b * Math.sqrt(Math.max(0, 1 - (z / a) * (z / a))); };
  var xw0 = x0 + 0.35, xw1 = x1 - 0.35, zw = -0.50, yw = ytop + 0.04;
  bl(null, xw1 - xw0, 0.035, 0.36, 'metal', '#8E959C', (xw0 + xw1) / 2, yw, zw, 0.01);
  for(var t = 0; t < 16; t++) bl(null, 0.018, 0.04, 0.36, 'metal', '#5E656D', xw0 + 0.1 + t * (xw1 - xw0 - 0.2) / 15, yw + 0.004, zw, 0.004);
  [xw0 + 0.15, (xw0 + xw1) / 2, xw1 - 0.15].forEach(function(x){
    bl(null, 0.05, yw - yTop(zw - 0.10) + 0.02, 0.05, 'metal', '#5E656D', x, (yw + yTop(zw - 0.10)) / 2, zw - 0.10, 0.008);
  });
  for(var n = 0; n < 2; n++){
    var xn = x0 + (n + 0.5) * (x1 - x0) / 2;
    cil(null, 0.27, 0.29, 0.14, 'pintura', col2, xn, ytop + 0.05, 0.05, null, 32);
    cil(null, 0.25, 0.25, 0.05, 'metal', '#A9AFB5', xn, ytop + 0.14, 0.05, null, 32);
    bl(null, 0.08, 0.06, 0.12, 'metal', VFX_GRIS, xn - 0.20, ytop + 0.16, 0.05, 0.01);
  }
  D.baranda([[xw0, -0.74], [xw1, -0.74]], yTop(-0.74) - 0.02, 0.95, '#E0B21A');
  D.baranda([[xw0, 0.55], [xw1, 0.55]], yTop(0.55) - 0.02, 0.90, '#E0B21A');
  var xe = x1 + 0.12;
  D.escalera(xe, -0.55, 0.50, ytop + 0.10, 0.42, '#8E959C', '#5E656D');
  tubo(null, [xe, ytop + 0.10, -0.76], [xe - 0.20, ytop + 0.95, -0.76], 0.025, 'metal', '#8E959C', 10);
  tubo(null, [xe, ytop + 0.10, -0.34], [xe - 0.20, ytop + 0.95, -0.34], 0.025, 'metal', '#8E959C', 10);
  /* bomba centrifuga con motor hidraulico, flauta de riego y valvulas */
  var xb = L.xFin - 0.30;
  cil('WPM1', 0.20, 0.20, 0.22, 'pintura', '#1E5AA8', xb, YF - 0.30, 0, [Math.PI / 2, 0, 0], 28);
  cil('PYM', 0.09, 0.09, 0.25, 'metal', VFX_GRIS, xb, YF - 0.30, 0.22, [Math.PI / 2, 0, 0], 16);
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
  bl('TQH1', 0.45, 0.45, 0.40, 'pintura', '#26292D', L.xCB + 0.25, YF + 0.30, -0.70, 0.04);
  /* defensas laterales entre los ejes y aletas sobre el bogie */
  var xa = L.ejes[0] + L.R + 1.30, xz = L.ejes[1] - L.R - 0.15;
  [-1, 1].forEach(function(s){
    [0.55, 0.85].forEach(function(y){ bl(null, xz - xa + 0.1, 0.08, 0.04, 'pintura', '#E0B21A', (xa + xz) / 2, y, s * 1.17, 0.015); });
    [xa + 0.05, (xa + xz) / 2, xz - 0.05].forEach(function(x){ bl(null, 0.05, YF - 0.45, 0.05, 'pintura', C.colChasis, x, (YF + 0.45) / 2 - 0.05, s * 1.13, 0.01); });
    var xg0 = L.ejes[1] - L.R - 0.10, xg1 = L.ejes[2] + L.R + 0.10;
    bl(null, xg1 - xg0, 0.03, 0.78, 'mate', VFX_PLAST, (xg0 + xg1) / 2, 2 * L.R + 0.10, s * (L.zO - 0.08), 0.01);
    bl(null, 0.05, 0.12, 0.40, 'pintura', C.colChasis, (xg0 + xg1) / 2, 2 * L.R + 0.16, s * (L.zR + 0.25), 0.01);
    cil('SCI', 0.08, 0.08, 0.50, 'pintura', '#C3161B', x0 + 0.05, YF + 0.10, s * 1.02, null, 16);
  });
  /* pertiga con banderin en la espalda de la cabina */
  tubo(null, [L.xCB + 0.10, YF + 0.10, 0.95], [L.xCB + 0.10, L.techo + 1.05, 0.95], 0.018, 'pintura', '#E8E8E4', 8);
  vfxPlano(C, C.texBanderin, 0.42, 0.30, L.xCB + 0.33, L.techo + 0.88, 0.95, 0, false);
}

/* ═══ armado ═══ */
function vfxConstruir(clave, piezas){
  var S = vfxDeClave(clave);
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var L = vfxMedidas(S);
  var sm = S.dueno === 'SM', agua = S.cuerpo === 'AGUA';
  var C = { G: G, D: D, L: L, S: S, colCab: VFX_BLANCO, colChasis: VFX_CHASIS, colBaliza: sm ? '#2F6BEA' : '#F0A41C',
    colCuerpo: agua ? (sm ? VFX_AZUL : '#E4E7E5') : (sm ? VFX_AZUL : VFX_ACERO),
    colCuerpo2: agua ? (sm ? VFX_AZUL2 : '#B9BFC5') : (sm ? VFX_AZUL2 : VFX_ACERO2),
    colFranja: sm ? '#F2F3F1' : '#1E5AA8', colLetrero: sm ? VFX_AZUL2 : '#1E5AA8',
    franja: sm ? VFX_LIMA : null };
  C.texNum = texNumero3d(null, (sm || !agua) ? '#FFFFFF' : '#1A1C1F');
  C.texNumPuerta = texNumero3d(null, '#1A1C1F');
  C.texHierro = vfxTexHierro();
  C.texInsignia = vfxTexInsignia(S.cab === 'VM' ? 'VM' : S.cab);
  C.texBanderin = vfxTexBanderin();
  C.texLogo = sm ? vfxTexSanMartin() : null;

  vfxChasis(C);
  vfxCabina(C);
  if(S.cab === 'VM') vfxFrenteVM(C);
  else { vfxFrenteFM(C); vfxParachoques(C); }
  vfxEquipChasis(C);
  var piv = null;
  if(S.cuerpo === 'VOLQUETE') piv = vfxVolquete(C);
  else vfxCisterna(C);

  /* ═══ llantas: aros oscuros con indicadores de tuerca verde limon en los de
     San Martin (foto), plateados en los alquilados ═══ */
  var LL = { r: L.R, ancho: L.A, rAro: L.rAro, aro: sm ? '#34383D' : '#B9BEC3', aro2: sm ? '#1E2023' : '#8E949A',
             pernos: 10, paso: 0.15, perno: sm ? '#9BE02A' : '#8A8F95' };
  var E = L.ejes, n = 1;
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

  /* centrar en X para que el estudio gire alrededor del medio del camion */
  var caja = new THREE.Box3().setFromObject(G);
  var xc = (caja.min.x + caja.max.x) / 2;
  G.children.forEach(function(m){ m.position.x -= xc; });
  var nombre = 'VFX-' + S.cab + S.ejes + (S.max ? 'MAX' : '');
  if(piv){ piv.x -= xc; D.colgarTolva(piv, nombre); }
  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ C.texNum.userData.poner(id); C.texNumPuerta.userData.poner(id); };
  G.userData.mirarY = 1.75;
  G.userData.dist = S.ejes === '8x4' ? 21 : 19;
  G.userData.modelo = nombre;
  return G;
}

registrarModelo3d({
  nombre: 'Volvo FMX, FM y VM (volquetes 8x4 y 6x4, cisternas de agua)',
  clave: function(e){ var S = vfxSpec(e); return S ? vfxClave(S) : null; },
  construir: function(e, piezas, clave){ return vfxConstruir(String(clave).replace(/^R:/, ''), piezas); }
});
