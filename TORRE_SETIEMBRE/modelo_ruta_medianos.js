/* ══════════════════════════════════════════════════════════════════
   CAMIONES MEDIANOS Y LIVIANOS DE RUTA — cisternas, MATPEL y ANFO

     Freightliner M2 106 (capot) ......... CI-32      CISTERNA DE AGUA
     Hino FC (Serie 500, cabina avanzada)  CI-708-AL  CISTERNA DE COMBUSTIBLE
     Volkswagen Worker 17.220 ............ CI-31      CISTERNA DE COMBUSTIBLE
     Hino Dutro 300 4x2 .................. TV-334-AL  CAMION MATPEL (furgon)
     Mitsubishi Fuso Canter .............. TV-42      CAMION PARA ANFO

   Un solo sistema: chasis de largueros, ejes, muelles, tren motriz,
   tanques y llantas son comunes; cada marca pone su cabina y su frente, y
   cada clasificacion su cuerpo. La cabina avanzada es un casco hecho por
   anillos (plantas de esquinas redondeadas a varias alturas), asi el frente
   tiene las esquinas curvas de estas cabinas japonesas y brasilenas.

   Medidas (m):
   · Hino FC 1021 / FC 1118 Serie 500 — fichas de Hino Peru (Toyota del
     Peru, CAM0004-0822) y Suzuval Chile: largo 7.405, ancho 2.190 (cabina
     2.190), alto 2.465, batalla 4.350, voladizos 1.145 / 1.910, trocha
     1.800 / 1.660, cabina al centro del eje trasero 3.725 (la espalda de la
     cabina queda a 1.77 del parachoques), bastidor arriba a 0.785 adelante
     y 0.875 atras, llantas 235/75R17.5 en aros 6.75x17.5, tanque de 200 L.
   · Hino Dutro Serie 300 — ficha de Hino Peru (doble cabina, CAM0003-0822;
     se usa la misma plataforma 4x2): ancho 1.995, alto de cabina 2.230,
     batalla 3.430, voladizo delantero 1.115, trocha 1.660 / 1.480,
     7.00R16 en aros 5.50x16, frenos hidraulicos. El furgon MATPEL (4.6 x
     2.10 x 2.10 por fuera) es supuesto.
   · Mitsubishi Fuso Canter FE85 — ficha de Sojitz Fuso Philippines: largo
     7.210, ancho 2.135, alto 2.270, batalla 4.170, trocha 1.665 / 1.660,
     bastidor de 840, 7.50R16. Se supone esta version (la de 8.2 t) por ser
     la que se carroza para ANFO; voladizo delantero 1.10 y cabina de 1.995
     de ancho, supuestos (cabina ancha).
   · Volkswagen Worker 17.220 — carzin.com.br (17.220 Worker 4x2): ancho
     2.510 (con espejos), alto 2.831, tanque de 275 L. Batalla 4.80,
     voladizo delantero 1.28, cabina de 2.30 y llantas 275/80R22.5 son
     supuestos (los tipicos del 17.220 para cisterna).
   · Freightliner M2 106 — Freightliner: cabina de dia de 106" (BBC 2.692);
     los M2 106 cisterna de agua que se venden son 4x2 de 2,000 galones con
     batalla de 150–156" (3.91 aqui) y 11R22.5. Parachoques a eje delantero
     1.00 y cabina de 2.03 de ancho, supuestos; capot, guardafangos y faros
     medidos sobre fotos (Wikimedia Commons: M2 106 de Home Depot y la
     cisterna de Herc Rentals).

   Colores: no hay fotos de las unidades de la flota. Se supone cabina
   blanca en las cinco (es el color de fabrica de los Hino y Fuso que se
   venden en Peru y el mas comun en alquiladas). Cisterna de combustible
   blanca con franja roja, rombo clase 3 y placa ONU 1202; cisterna de agua
   gris claro con franja azul; furgon MATPEL blanco con rombos naranjas de
   clase 1; tolva de ANFO de acero inoxidable con rombo 1.5D y placa 0331.

   Ejes: frente hacia -X, arriba +Y, izquierda del operador +Z (volante a
   la izquierda). Llantas SAP: 1 delantera izquierda, 2 delantera derecha,
   3-6 el eje trasero de izquierda a derecha (exterior, interior, interior,
   exterior).
   ══════════════════════════════════════════════════════════════════ */
var RMD_NEGRO = '#16181B', RMD_GRIS = '#3C434B', RMD_GRIS2 = '#5A626B', RMD_ALU = '#C9CED3', RMD_INOX = '#D3D8DD',
    RMD_VIDRIO = '#1C2A37', RMD_CHASIS = '#1B1D20', RMD_BLANCO = '#ECEDEA', RMD_PLAST = '#232629';

/* configuracion por modelo. foh: parachoques a eje delantero; wb: batalla;
   roh: eje trasero a punta de bastidor; R/A/rAro: llanta; trD: trocha
   delantera; trT: centro de los pares de duales; sep: entre llantas de un
   par; YR: arriba del bastidor; hR: alto del larguero; ZR: medio ancho del
   bastidor. Cabina avanzada: X0 frente, xb espalda, hw medio ancho, Yb borde
   bajo del casco, YT techo, wsb/wst parabrisas, rake, rc esquina del frente. */
var RMD_CFG = {
  M2:     { nombre: 'Freightliner M2 106', marca: 'fl', conv: true, foh: 1.00, wb: 3.91, roh: 1.65,
            R: 0.527, A: 0.28, rAro: 0.286, nP: 10, trD: 2.06, trT: 1.83, sep: 0.325, aire: true,
            YR: 1.06, hR: 0.27, ZR: 0.43, X0: 1.30, xb: 2.69, hw: 1.015, Yb: 1.14, YT: 2.76, wsb: 1.86, wst: 2.58,
            rake: 0.30, rc: 0.10, color: RMD_BLANCO, aro: '#D7DBDF' },
  FC:     { nombre: 'Hino FC Serie 500', marca: 'hino5', foh: 1.145, wb: 4.35, roh: 1.91,
            R: 0.398, A: 0.235, rAro: 0.222, nP: 8, trD: 1.80, trT: 1.66, sep: 0.27, aire: true,
            YR: 0.83, hR: 0.21, ZR: 0.42, X0: 0.07, xb: 1.77, hw: 1.095, Yb: 0.90, YT: 2.465, wsb: 1.60, wst: 2.31,
            rake: 0.09, rc: 0.17, color: RMD_BLANCO, aro: '#D9DCDF' },
  WORKER: { nombre: 'Volkswagen Worker 17.220', marca: 'vw', foh: 1.28, wb: 4.80, roh: 1.70,
            R: 0.506, A: 0.276, rAro: 0.286, nP: 10, trD: 2.04, trT: 1.82, sep: 0.32, aire: true,
            YR: 1.04, hR: 0.27, ZR: 0.43, X0: 0.07, xb: 1.88, hw: 1.15, Yb: 1.10, YT: 2.83, wsb: 1.84, wst: 2.60,
            rake: 0.07, rc: 0.10, color: RMD_BLANCO, aro: '#D7DBDF' },
  DUTRO:  { nombre: 'Hino Dutro Serie 300 4x2', marca: 'hino3', foh: 1.115, wb: 3.43, roh: 1.80,
            R: 0.388, A: 0.20, rAro: 0.203, nP: 6, trD: 1.66, trT: 1.48, sep: 0.235, aire: false,
            YR: 0.76, hR: 0.18, ZR: 0.38, X0: 0.06, xb: 1.70, hw: 0.9975, Yb: 0.86, YT: 2.23, wsb: 1.36, wst: 2.03,
            rake: 0.17, rc: 0.22, color: RMD_BLANCO, aro: '#D9DCDF' },
  CANTER: { nombre: 'Mitsubishi Fuso Canter FE85', marca: 'fuso', foh: 1.10, wb: 4.17, roh: 1.935,
            R: 0.402, A: 0.215, rAro: 0.203, nP: 6, trD: 1.665, trT: 1.66, sep: 0.245, aire: false,
            YR: 0.80, hR: 0.19, ZR: 0.42, X0: 0.06, xb: 1.80, hw: 0.9975, Yb: 0.89, YT: 2.27, wsb: 1.40, wst: 2.08,
            rake: 0.15, rc: 0.19, color: RMD_BLANCO, aro: '#D9DCDF' }
};

/* ═══ que camion es: solo estos cinco, con su marca y su clase ═══ */
function rmdClave(e){
  var m = mod3d(e), marca = String((e && e.marca) || '').toUpperCase(), c = String((e && e.clasif) || '').toUpperCase();
  if(/FREIGHTLINER/.test(marca) && /^M2106/.test(m) && /AGUA/.test(c)) return 'RMD|M2|AGUA';
  if(/HINO/.test(marca) && m === 'FC' && /COMBUSTIBLE/.test(c)) return 'RMD|FC|COMB';
  if(/VOLKSWAGEN/.test(marca) && /^WORKER17220/.test(m) && /COMBUSTIBLE/.test(c)) return 'RMD|WORKER|COMB';
  if(/HINO/.test(marca) && /^DUTRO300/.test(m) && /MATPEL/.test(c)) return 'RMD|DUTRO|MATPEL';
  if(/MITSUBISHI|FUSO/.test(marca) && /^CANTER/.test(m) && /ANFO/.test(c)) return 'RMD|CANTER|ANFO';
  return null;
}

/* ═══ geometria ═══ */

/* superficie entre anillos de puntos [x,y,z] (todos con el mismo numero);
   cerrado: el ultimo punto de cada anillo se une con el primero */
function rmdLoft(anillos, cerrado){
  var m = anillos[0].length, pos = [], idx = [], i, j;
  anillos.forEach(function(a){ a.forEach(function(p){ pos.push(p[0], p[1], p[2]); }); });
  var tope = cerrado ? m : m - 1;
  for(i = 0; i < anillos.length - 1; i++) for(j = 0; j < tope; j++){
    var a = i * m + j, b = i * m + (j + 1) % m, c = a + m, d = b + m;
    idx.push(a, b, c, b, d, c);
  }
  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
/* tapa de un anillo: abanico desde su centro */
function rmdTapa(anillo){
  var m = anillo.length, c = [0, 0, 0], pos = [], idx = [], j;
  anillo.forEach(function(p){ c[0] += p[0] / m; c[1] += p[1] / m; c[2] += p[2] / m; });
  pos.push(c[0], c[1], c[2]);
  anillo.forEach(function(p){ pos.push(p[0], p[1], p[2]); });
  for(j = 1; j < m; j++) idx.push(0, j, j + 1);
  idx.push(0, m, 1);
  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
/* planta de esquinas redondeadas a la altura y: frente xf, espalda xb, medio
   ancho hw, radio de las esquinas del frente rf y de atras rb (siempre 22 puntos) */
function rmdPlanta(y, xf, xb, hw, rf, rb){
  var p = [], i, a, nf = 7, nb = 4;
  var arco = function(cx, cz, r, a0, a1, n){ for(i = 0; i < n; i++){ a = a0 + (a1 - a0) * i / (n - 1); p.push([cx + r * Math.cos(a), y, cz + r * Math.sin(a)]); } };
  arco(xb - rb, hw - rb, rb, 0, Math.PI / 2, nb);
  arco(xf + rf, hw - rf, rf, Math.PI / 2, Math.PI, nf);
  arco(xf + rf, -hw + rf, rf, Math.PI, Math.PI * 1.5, nf);
  arco(xb - rb, -hw + rb, rb, Math.PI * 1.5, Math.PI * 2, nb);
  return p;
}
/* seccion (z,y) de un capot con guardafangos: faldon, hombro del
   guardafango, bajada al capot y el lomo combado (siempre 21 puntos) */
function rmdSeccionCapo(x, hwF, hwT, yb, yF, yH, comba){
  var p = [], i, a;
  var lado = function(s){
    var q = [[hwF, yb], [hwF, yF - 0.16]];
    for(i = 1; i <= 3; i++){ a = i / 3 * Math.PI / 2; q.push([hwF - 0.10 * (1 - Math.cos(a)), yF - 0.16 + 0.16 * Math.sin(a)]); }
    q.push([hwT + 0.07, yH - 0.05]);
    q.push([hwT, yH]);
    return q.map(function(r){ return [x, r[1], s * r[0]]; });
  };
  p = lado(1);
  for(i = 1; i <= 6; i++){ var z = hwT - i * 2 * hwT / 7; p.push([x, yH + comba * (1 - Math.pow(z / hwT, 2)), z]); }
  return p.concat(lado(-1).reverse());
}
function rmdArco(cx, cy, r, a0, a1, n){
  var p = [];
  for(var i = 0; i <= n; i++){ var a = a0 + (a1 - a0) * i / n; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return p;
}
/* muchas piezas iguales en una sola malla: lista de [x,y,z, rx,ry,rz] */
function rmdInst(D, code, geo, tipo, hex, lista){
  var im = new THREE.InstancedMesh(geo, D.M[tipo](hex), lista.length), o = new THREE.Object3D();
  lista.forEach(function(q, i){
    o.position.set(q[0], q[1], q[2]); o.rotation.set(q[3] || 0, q[4] || 0, q[5] || 0); o.updateMatrix();
    im.setMatrixAt(i, o.matrix);
  });
  im.instanceMatrix.needsUpdate = true;
  return D.reg(code, im, hex);
}
/* plano con textura; ry: 0 mira a +Z, PI a -Z, -PI/2 a -X, PI/2 a +X */
function rmdPlano(G, tex, w, h, x, y, z, ry, transp){
  var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ map: tex, transparent: !!transp, alphaTest: transp ? 0.04 : 0, roughness: 0.45, metalness: 0.05 }));
  m.position.set(x, y, z); m.rotation.y = ry;
  G.add(m);
  return m;
}
/* luz que brilla un poco */
function rmdLuz(D, code, w, h, d, hex, x, y, z, k){
  var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), emissive: new THREE.Color(hex), emissiveIntensity: k || 0.45, roughness: 0.2 }));
  m.position.set(x, y, z);
  return D.reg(code, m, hex);
}
/* hojas de muelle apiladas: la maestra arriba; curv > 0 sube las puntas */
function rmdMuelle(D, code, xc, yTop, largo, n, z, ancho, curv){
  for(var k = 0; k < n; k++){
    var L = largo * (1 - k * 0.16), e = 0.020, y0 = yTop - k * e, pts = [], i, x, N = 8;
    for(i = 0; i <= N; i++){ x = -L / 2 + L * i / N; pts.push([xc + x, y0 + curv * Math.pow(2 * x / largo, 2)]); }
    for(i = N; i >= 0; i--){ x = -L / 2 + L * i / N; pts.push([xc + x, y0 - e + 0.002 + curv * Math.pow(2 * x / largo, 2)]); }
    D.perfil(code, pts, ancho, z, 'metal', '#2E3238', 0.004);
  }
}
/* separa una poligonal (x,y) de su centro (marcos de vidrios) */
function rmdEnsanchar(pts, d){
  var cx = 0, cy = 0;
  pts.forEach(function(p){ cx += p[0] / pts.length; cy += p[1] / pts.length; });
  return pts.map(function(p){
    var dx = p[0] - cx, dy = p[1] - cy, l = Math.hypot(dx, dy) || 1;
    return [p[0] + dx / l * d, p[1] + dy / l * d];
  });
}

/* ═══ lienzos ═══ */
function rmdTexLetras(txt, fondo, tinta, w, h, fuente, esp){
  return texRotulo3d(function(g, W, H){
    if(fondo){ g.fillStyle = fondo; g.fillRect(0, 0, W, H); } else g.clearRect(0, 0, W, H);
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = (fuente || 'bold #px "Arial Black", Arial, sans-serif').replace('#', Math.round(H * 0.70));
    if(esp){
      var n = txt.length, paso = W * 0.94 / n;
      for(var i = 0; i < n; i++) g.fillText(txt.charAt(i), W * 0.03 + paso * (i + 0.5), H * 0.54);
    } else g.fillText(txt, W / 2, H * 0.54, W * 0.96);
  }, w || 512, h || 96);
}
/* el ovalo de Hino: aro cromado y la H de dos alas que se juntan */
function rmdTexHino(){
  return texRotulo3d(function(g, w, h){
    g.clearRect(0, 0, w, h);
    var cx = w / 2, cy = h / 2;
    g.strokeStyle = '#E6EAEE'; g.lineWidth = h * 0.09;
    g.beginPath(); g.ellipse(cx, cy, w * 0.44, h * 0.40, 0, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#E6EAEE';
    [-1, 1].forEach(function(s){
      g.beginPath();
      g.moveTo(cx + s * w * 0.06, cy - h * 0.05);
      g.quadraticCurveTo(cx + s * w * 0.20, cy - h * 0.10, cx + s * w * 0.34, cy - h * 0.30);
      g.lineTo(cx + s * w * 0.38, cy - h * 0.20);
      g.quadraticCurveTo(cx + s * w * 0.24, cy + h * 0.02, cx + s * w * 0.06, cy + h * 0.05);
      g.closePath(); g.fill();
      g.beginPath();
      g.moveTo(cx + s * w * 0.06, cy + h * 0.05);
      g.quadraticCurveTo(cx + s * w * 0.20, cy + h * 0.10, cx + s * w * 0.34, cy + h * 0.30);
      g.lineTo(cx + s * w * 0.38, cy + h * 0.20);
      g.quadraticCurveTo(cx + s * w * 0.24, cy - h * 0.02, cx + s * w * 0.06, cy - h * 0.05);
      g.closePath(); g.fill();
    });
  }, 256, 160);
}
/* VW: circulo con la V sobre la W */
function rmdTexVW(){
  return texRotulo3d(function(g, w, h){
    g.clearRect(0, 0, w, h);
    var c = w / 2, r = c - 4;
    g.fillStyle = '#E4E8EC'; g.beginPath(); g.arc(c, c, r, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#1D3F7A'; g.beginPath(); g.arc(c, c, r * 0.86, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#E4E8EC'; g.lineWidth = w * 0.065; g.lineJoin = 'miter';
    g.beginPath(); g.moveTo(c - r * 0.42, c - r * 0.62); g.lineTo(c, c + r * 0.08); g.lineTo(c + r * 0.42, c - r * 0.62); g.stroke();
    g.beginPath(); g.moveTo(c - r * 0.78, c - r * 0.18); g.lineTo(c - r * 0.40, c + r * 0.66); g.lineTo(c, c + r * 0.12);
    g.lineTo(c + r * 0.40, c + r * 0.66); g.lineTo(c + r * 0.78, c - r * 0.18); g.stroke();
  }, 256, 256);
}
/* tres diamantes de Mitsubishi */
function rmdTexMitsu(){
  return texRotulo3d(function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#D9001B';
    var c = w / 2, cy = h * 0.56, L = w * 0.24;
    [0, 2 * Math.PI / 3, 4 * Math.PI / 3].forEach(function(a){
      g.save(); g.translate(c, cy); g.rotate(a);
      g.beginPath(); g.moveTo(0, 0); g.lineTo(L * 0.42, -L * 0.72); g.lineTo(0, -L * 1.44); g.lineTo(-L * 0.42, -L * 0.72); g.closePath(); g.fill();
      g.restore();
    });
  }, 256, 256);
}
/* rombo de peligro: fondo, texto central y numero de clase abajo */
function rmdTexRombo(fondo, centro, clase, tinta, llama){
  return texRotulo3d(function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.fillStyle = fondo;
    g.beginPath(); g.moveTo(w / 2, 4); g.lineTo(w - 4, h / 2); g.lineTo(w / 2, h - 4); g.lineTo(4, h / 2); g.closePath(); g.fill();
    g.strokeStyle = tinta; g.lineWidth = 5;
    g.beginPath(); g.moveTo(w / 2, 18); g.lineTo(w - 18, h / 2); g.lineTo(w / 2, h - 18); g.lineTo(18, h / 2); g.closePath(); g.stroke();
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    if(llama){
      g.beginPath(); g.moveTo(w * 0.42, h * 0.46); g.quadraticCurveTo(w * 0.36, h * 0.30, w * 0.50, h * 0.18);
      g.quadraticCurveTo(w * 0.47, h * 0.30, w * 0.56, h * 0.30); g.quadraticCurveTo(w * 0.66, h * 0.38, w * 0.58, h * 0.46); g.closePath(); g.fill();
      g.fillRect(w * 0.36, h * 0.48, w * 0.28, h * 0.03);
    } else if(centro){
      g.font = 'bold ' + Math.round(h * 0.18) + 'px Arial, sans-serif'; g.fillText(centro, w / 2, h * 0.47);
    }
    g.font = 'bold ' + Math.round(h * 0.15) + 'px Arial, sans-serif'; g.fillText(clase, w / 2, h * 0.79);
  }, 256, 256);
}
/* panel naranja de las Naciones Unidas */
function rmdTexONU(arriba, abajo){
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
/* plancha diamantada de los peldanos y la pasarela */
function rmdTexDiamante(){
  var t = texRotulo3d(function(g, w, h){
    g.fillStyle = '#9EA4AA'; g.fillRect(0, 0, w, h);
    for(var y = 0; y < h; y += 16) for(var x = (y / 16 % 2) * 8; x < w; x += 16){
      g.save(); g.translate(x + 4, y + 8); g.rotate(y / 16 % 2 ? 0.8 : -0.8);
      g.fillStyle = '#D9DDE1'; g.fillRect(-5, -1.6, 10, 3.2);
      g.fillStyle = '#6E747A'; g.fillRect(-5, 1.6, 10, 1.2);
      g.restore();
    }
  }, 128, 128);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 2);
  return t;
}

/* ═══ llanta de camion: carcasa, banda con tacos, aro de disco con agujeros
   de mano, tuercas y masa. Mismo contrato que ruedaDet: grupo que gira, la
   carcasa lleva el codigo SAP y los tacos comparten su material ═══ */
function rmdRueda(C, code, x, z, afuera, trac){
  var D = C.D, P = C.P, R = P.R, A = P.A, rA = P.rAro;
  var gr = new THREE.Group();
  gr.userData.rueda = true;
  gr.position.set(x, R, z);
  C.G.add(gr); D.ruedas.push(gr);
  var goma = D.M.goma('#17191C');
  var perfilR = [[rA * 1.00, -A * 0.40], [rA * 1.08, -A * 0.47], [R * 0.74, -A * 0.50], [R * 0.88, -A * 0.49], [R * 0.95, -A * 0.44],
                 [R * 0.972, -A * 0.30], [R * 0.976, 0]];
  var pts = perfilR.concat(perfilR.slice(0, -1).reverse().map(function(p){ return [p[0], -p[1]]; }))
                   .map(function(p){ return new THREE.Vector2(p[0], p[1]); });
  var t = new THREE.Mesh(new THREE.LatheGeometry(pts, 44), goma);
  t.rotation.x = Math.PI / 2;
  t.userData.isLlanta = true; t.userData.code = code; t.userData.base = '#17191C';
  gr.add(t);
  if(C.piezas && code) C.piezas.push(t);
  /* tacos: traccion en chevron; direccion en costillas */
  var n = Math.round(2 * Math.PI * R / (trac ? 0.09 : 0.075)), hT = 0.013;
  var gT = new THREE.BoxGeometry(2 * Math.PI * R / n * (trac ? 0.52 : 0.60), hT, A * (trac ? 0.44 : 0.27));
  var filas = trac ? [-1, 1] : [-1.5, -0.5, 0.5, 1.5];
  var inst = new THREE.InstancedMesh(gT, goma, n * filas.length), d = new THREE.Object3D(), k = 0;
  for(var i = 0; i < n; i++){
    filas.forEach(function(s){
      var a = (i + (trac && s > 0 ? 0.5 : 0)) / n * Math.PI * 2, rr = R * 0.976 + hT / 2 - 0.003;
      d.position.set(Math.cos(a) * rr, Math.sin(a) * rr, s * A * (trac ? 0.24 : 0.205));
      d.rotation.set(0, 0, a - Math.PI / 2);
      if(trac) d.rotateY(s * 0.38);
      d.updateMatrix();
      inst.setMatrixAt(k++, d.matrix);
    });
  }
  gr.add(inst);
  var mAro = D.M.pintura(C.cfg.aro);
  var aro = new THREE.Mesh(new THREE.CylinderGeometry(rA * 0.97, rA * 0.97, A * 0.80, 32, 1, true), mAro);
  aro.material.side = THREE.DoubleSide;
  aro.rotation.x = Math.PI / 2; gr.add(aro);
  [-1, 1].forEach(function(s){
    var p = new THREE.Mesh(new THREE.TorusGeometry(rA, 0.011, 8, 36), mAro);
    p.position.z = s * A * 0.40; gr.add(p);
  });
  if(afuera){
    /* el disco va hundido en la de adelante y saliente en la dual de afuera */
    var dz = afuera * A * (trac ? 0.30 : 0.22), nP = C.cfg.nP;
    var disco = new THREE.Mesh(new THREE.CylinderGeometry(rA * 0.95, rA * 0.95, 0.018, 32), mAro);
    disco.rotation.x = Math.PI / 2; disco.position.z = dz; gr.add(disco);
    var nh = nP > 8 ? 10 : 6, j, ang;
    var gh = new THREE.CylinderGeometry(rA * 0.13, rA * 0.13, 0.022, 14);
    var ih = new THREE.InstancedMesh(gh, D.M.mate('#0E0F11'), nh);
    for(j = 0; j < nh; j++){
      ang = (j + 0.5) / nh * Math.PI * 2;
      d.position.set(Math.cos(ang) * rA * 0.66, Math.sin(ang) * rA * 0.66, dz + afuera * 0.002); d.rotation.set(Math.PI / 2, 0, 0); d.updateMatrix(); ih.setMatrixAt(j, d.matrix);
    }
    gr.add(ih);
    var rT = nP > 8 ? 0.143 : nP > 6 ? 0.112 : 0.090;
    var inn = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.015, 0.015, 0.045, 6), D.M.cromo(), nP);
    for(j = 0; j < nP; j++){
      ang = j / nP * Math.PI * 2;
      d.position.set(Math.cos(ang) * rT, Math.sin(ang) * rT, dz + afuera * 0.022); d.rotation.set(Math.PI / 2, 0, 0); d.updateMatrix(); inn.setMatrixAt(j, d.matrix);
    }
    gr.add(inn);
    var masa = new THREE.Mesh(new THREE.CylinderGeometry(rT * 0.78, rT * 0.86, 0.07, 26), D.M.metal('#5C6268'));
    masa.rotation.x = Math.PI / 2; masa.position.z = dz + afuera * 0.035; gr.add(masa);
    /* tapa: domo en la direccion, brida del palier en traccion */
    var tapa = trac ? new THREE.Mesh(new THREE.CylinderGeometry(rT * 0.50, rT * 0.62, 0.05, 20), D.M.metal('#4A5056'))
                    : new THREE.Mesh(new THREE.CylinderGeometry(rT * 0.36, rT * 0.66, 0.10, 22), D.M.cromo());
    tapa.rotation.x = afuera > 0 ? Math.PI / 2 : -Math.PI / 2; tapa.position.z = dz + afuera * (trac ? 0.08 : 0.10);
    gr.add(tapa);
  }
  gr.traverse(function(m){ if(m.isMesh){ m.castShadow = true; m.receiveShadow = true; } });
  return gr;
}

/* ═══ medidas derivadas ═══ */
function rmdMedidas(cfg){
  var P = {};
  for(var k in cfg) P[k] = cfg[k];
  P.XD = cfg.foh; P.XT = cfg.foh + cfg.wb; P.XFin = P.XT + cfg.roh;
  P.XFr = cfg.conv ? 0.30 : 0.32;
  P.YB = cfg.YR - cfg.hR;
  P.ZD = cfg.trD / 2; P.ZO = cfg.trT / 2 + cfg.sep / 2; P.ZI = cfg.trT / 2 - cfg.sep / 2;
  P.xCuerpo = cfg.xb + (cfg.conv ? 0.18 : 0.14);
  return P;
}

/* ═══ chasis, ejes, suspension, tren motriz y lo que cuelga (comun) ═══ */
function rmdChasis(C){
  var D = C.D, P = C.P, bl = D.bloque, cil = D.cilindro, tubo = D.tubo;
  var YR = P.YR, YB = P.YB, ZR = P.ZR, R = P.R, XD = P.XD, XT = P.XT, XFin = P.XFin, XFr = P.XFr, col = RMD_CHASIS;
  var ym = (YR + YB) / 2, hR = P.hR;
  /* largueros en C: alma afuera, alas hacia adentro */
  [-1, 1].forEach(function(s){
    bl('42023615', XFin - XFr, hR, 0.018, 'pintura', col, (XFr + XFin) / 2, ym, s * (ZR + 0.03), 0.006);
    [YR - 0.009, YB + 0.009].forEach(function(y){ bl('42023615', XFin - XFr, 0.018, 0.07, 'pintura', col, (XFr + XFin) / 2, y, s * ZR, 0.005); });
  });
  var tr = [];
  for(var x = XFr + 0.25; x < XFin - 0.3; x += 0.95) tr.push([x, ym, 0]);
  tr.push([XFin - 0.05, ym, 0]);
  rmdInst(D, '42023615', new THREE.BoxGeometry(0.07, hR * 0.80, ZR * 2 + 0.03), 'pintura', col, tr);

  /* ═══ eje delantero: viga en I, munones, tambores, muelles, amortiguadores ═══ */
  var zk = P.ZD - 0.18;
  bl(null, 0.10, 0.11, zk * 2 - 0.40, 'pintura', '#2A2D31', XD, R - 0.09, 0, 0.02);
  [-1, 1].forEach(function(s){
    var t = bl(null, 0.10, 0.11, 0.30, 'pintura', '#2A2D31', XD, R - 0.045, s * (zk - 0.12), 0.02);
    t.rotation.x = s * 0.32;
    cil(null, 0.05, 0.05, 0.20, 'metal', RMD_GRIS2, XD, R, s * zk, null, 14);
    cil(s > 0 ? 'BMLH' : 'BMRH', P.rAro * 0.78, P.rAro * 0.78, 0.15, 'metal', '#33373C', XD, R, s * (P.ZD - 0.10), [Math.PI / 2, 0, 0], 24);
    tubo(null, [XD, R, s * zk], [XD + 0.18, R - 0.05, s * (zk - 0.10)], 0.02, 'metal', RMD_GRIS, 8);
    var lm = Math.min(1.30, P.wb * 0.30), yM = YB - 0.06;
    rmdMuelle(D, '42020008', XD, yM, lm, 4, s * ZR, 0.065, 0.05);
    [-lm / 2, lm / 2].forEach(function(dx){
      cil(null, 0.03, 0.03, 0.09, 'metal', RMD_GRIS, XD + dx, yM + 0.05, s * ZR, [Math.PI / 2, 0, 0], 10);
      bl(null, 0.07, 0.10, 0.08, 'pintura', col, XD + dx, YB - 0.01, s * ZR, 0.01);
    });
    /* grapas en U del muelle al eje */
    [-0.045, 0.045].forEach(function(dx){ tubo(null, [XD + dx, R - 0.06, s * (ZR + 0.04)], [XD + dx, yM, s * (ZR + 0.04)], 0.009, 'metal', RMD_GRIS, 6); });
    D.cilHidD(s > 0 ? 'SDI' : 'SDD', [XD + 0.16, R - 0.03, s * (ZR + 0.09)], [XD + 0.24, YR - 0.03, s * (ZR + 0.09)], 0.032, '#202326', 0.55);
  });
  tubo(null, [XD + 0.18, R - 0.07, -(zk - 0.10)], [XD + 0.18, R - 0.07, zk - 0.10], 0.02, 'metal', RMD_GRIS, 10);
  /* caja de direccion en el larguero izquierdo y barra de mando */
  bl('CDR', 0.20, 0.18, 0.14, 'metal', RMD_GRIS, XD - 0.40, YB + 0.02, ZR + 0.12, 0.03);
  tubo(null, [XD - 0.40, YB - 0.08, ZR + 0.15], [XD + 0.18, R - 0.03, P.ZD - 0.28], 0.018, 'metal', RMD_GRIS, 8);

  /* ═══ eje trasero: puente, banjo, tambores, muelles con el auxiliar ═══ */
  var zH = P.ZI - P.A / 2 - 0.05;
  cil(null, 0.07, 0.08, zH * 2, 'pintura', '#2A2D31', XT, R, 0, [Math.PI / 2, 0, 0], 16);
  var banjo = D.pon('DIFP', new THREE.SphereGeometry(P.R * 0.52, 24, 16), 'pintura', '#2A2D31', XT, R, 0);
  banjo.scale.set(1, 1, 0.66);
  cil('DIFP', P.R * 0.33, P.R * 0.24, 0.26, 'pintura', '#2A2D31', XT - 0.22, R + 0.03, 0, [0, 0, Math.PI / 2], 18);
  [-1, 1].forEach(function(s){
    cil(s > 0 ? 'BPLH' : 'BPRH', P.rAro * 0.80, P.rAro * 0.80, 0.16, 'metal', '#33373C', XT, R, s * (zH + 0.02), [Math.PI / 2, 0, 0], 24);
    var lt = Math.min(1.45, P.wb * 0.34), yM = YB - 0.06;
    rmdMuelle(D, '42041233', XT, yM, lt, 6, s * ZR, 0.075, 0.04);
    rmdMuelle(D, '42041233', XT, yM + 0.10, lt * 0.55, 3, s * ZR, 0.075, -0.02);
    [-lt / 2, lt / 2].forEach(function(dx){ bl(null, 0.08, 0.12, 0.09, 'pintura', col, XT + dx, YB - 0.02, s * ZR, 0.012); });
    [-0.05, 0.05].forEach(function(dx){ tubo(null, [XT + dx, R - 0.10, s * (ZR + 0.045)], [XT + dx, yM, s * (ZR + 0.045)], 0.010, 'metal', RMD_GRIS, 6); });
    D.cilHidD(s > 0 ? 'SPI' : 'SPD', [XT - 0.18, R - 0.02, s * (ZR - 0.10)], [XT - 0.28, YR - 0.04, s * (ZR - 0.10)], 0.032, '#202326', 0.55);
    if(P.aire){
      /* pulmon de freno doble y su manguera */
      cil('42066068', 0.085, 0.085, 0.22, 'pintura', '#202326', XT - 0.22, R + 0.12, s * (zH - 0.20), [0, 0, Math.PI / 2 - 0.25], 16);
      tubo('21003297', [XT - 0.33, R + 0.15, s * (zH - 0.20)], [XT - 0.40, YB, s * (ZR - 0.05)], 0.010, 'goma', '#111', 6);
    }
  });

  /* ═══ motor, caja y cardan ═══ */
  var XM0 = P.conv ? 0.42 : XD - 0.62, XM1 = P.conv ? 1.52 : XD + 0.55, yE = P.conv ? 1.18 : YR + 0.10;
  var hE = P.R > 0.45 ? 0.62 : 0.50, wE = P.R > 0.45 ? 0.62 : 0.52;
  bl('ENG1', XM1 - XM0, hE, wE, 'metal', RMD_GRIS, (XM0 + XM1) / 2, yE, 0, 0.05);
  bl('ENG1', (XM1 - XM0) * 0.90, 0.18, wE * 0.78, 'metal', '#2E3238', (XM0 + XM1) / 2, yE - hE / 2 - 0.08, 0, 0.04);
  bl('42064643', (XM1 - XM0) * 0.85, 0.12, wE * 0.66, 'metal', '#5D646C', (XM0 + XM1) / 2, yE + hE / 2 + 0.05, 0, 0.03);
  cil('AL1', 0.085, 0.085, 0.14, 'metal', '#9AA1A8', XM0 + 0.10, yE + 0.08, -(wE / 2 + 0.06), [0, 0, Math.PI / 2], 16);
  cil('CMP', 0.075, 0.075, 0.20, 'metal', '#7D848B', XM0 + 0.36, yE - 0.12, wE / 2 + 0.07, [0, 0, Math.PI / 2], 14);
  cil('AR1', 0.07, 0.07, 0.24, 'metal', '#5C6268', XM1 - 0.12, yE - 0.18, wE / 2 + 0.06, [0, 0, Math.PI / 2], 14);
  D.pon('TLH1', new THREE.TorusGeometry(0.09, 0.05, 10, 18), 'metal', '#6B7178', XM1 - 0.25, yE + 0.12, -(wE / 2 + 0.08), [0, Math.PI / 2, 0]);
  /* radiador delante del motor en el capot; debajo de la cabina en las avanzadas */
  if(!P.conv) bl('RAD1', 0.10, 0.62, 0.80, 'metal', '#2E3338', XM0 - 0.16, yE + 0.08, 0, 0.015);
  var XG0 = XM1, XG1 = XM1 + (P.R > 0.45 ? 0.95 : 0.75);
  cil('TRM', 0.24, 0.18, 0.26, 'metal', RMD_GRIS, XG0 + 0.12, yE - 0.06, 0, [0, 0, Math.PI / 2], 22);
  bl('TRM', XG1 - XG0 - 0.24, 0.34, 0.36, 'metal', RMD_GRIS, (XG0 + XG1) / 2 + 0.12, yE - 0.10, 0, 0.04);
  var pA = [XG1 + 0.05, yE - 0.12, 0], pB = [XT - 0.36, R + 0.05, 0], pM = [(pA[0] + pB[0]) / 2, (pA[1] + pB[1]) / 2 + 0.02, 0];
  tubo(null, pA, pM, 0.042, 'metal', '#8A9097', 12);
  tubo(null, pM, pB, 0.042, 'metal', '#8A9097', 12);
  bl(null, 0.08, YB - pM[1] + 0.02, 0.24, 'pintura', col, pM[0], (YB + pM[1]) / 2, 0, 0.01);
  [pA, pM, pB].forEach(function(p){ cil(null, 0.06, 0.06, 0.07, 'metal', '#3A3F45', p[0], p[1], 0, [0, 0, Math.PI / 2], 12); });

  /* ═══ cañerias de aire, arnes y engrase ═══ */
  tubo('HAR', [XFr + 0.4, YB + 0.05, ZR - 0.05], [XFin - 0.2, YB + 0.05, ZR - 0.05], 0.014, 'goma', '#1B1D20', 6);
  if(P.aire) tubo('LPA', [XFr + 0.4, YR - 0.05, -(ZR - 0.05)], [XFin - 0.3, YR - 0.05, -(ZR - 0.05)], 0.010, 'goma', '#2E5E9E', 6);

  /* ═══ cola: travesano de luces, parachoques antiempotramiento y faldones ═══ */
  var xc = XFin + (C.cuerpo === 'MATPEL' ? 0.25 : 0.06);
  bl(null, 0.08, 0.12, P.ZO * 2 + 0.20, 'pintura', col, xc, YB - 0.04, 0, 0.02);
  [-1, 1].forEach(function(s){
    bl(null, 0.08, 0.20, 0.42, 'mate', RMD_NEGRO, xc + 0.04, YB - 0.04, s * (P.ZO - 0.05), 0.02);
    rmdLuz(D, s > 0 ? 'FPI' : 'FPD', 0.02, 0.14, 0.13, '#C2241B', xc + 0.085, YB - 0.04, s * (P.ZO + 0.08), 0.4);
    rmdLuz(D, s > 0 ? 'FPI' : 'FPD', 0.02, 0.14, 0.10, '#F2A31A', xc + 0.085, YB - 0.04, s * (P.ZO - 0.05), 0.4);
    rmdLuz(D, 'LSM', 0.02, 0.14, 0.09, '#F4F1E6', xc + 0.085, YB - 0.04, s * (P.ZO - 0.17), 0.3);
    bl(null, 0.02, 0.55, 0.50, 'goma', '#141618', XT + R + 0.20, 0.42, s * (P.ZO + P.ZI) / 2, 0.01);
    bl(null, 0.03, 0.03, 0.52, 'metal', RMD_GRIS2, XT + R + 0.20, 0.70, s * (P.ZO + P.ZI) / 2, 0.008);
    tubo(null, [XT + R + 0.20, 0.70, s * (P.ZO + P.ZI) / 2], [XT + R + 0.20, YB + 0.05, s * (ZR + 0.04)], 0.016, 'metal', RMD_GRIS2, 6);
  });
  var yP = 0.50;
  bl(null, 0.10, 0.12, P.ZO * 2 + 0.10, 'pintura', col, xc + 0.02, yP, 0, 0.02);
  for(var f = 0; f < 10; f++) bl(null, 0.01, 0.08, (P.ZO * 2) / 10 - 0.01, 'mate', f % 2 ? '#F2F2F2' : '#C62A1E', xc + 0.075, yP, -P.ZO + (f + 0.5) * P.ZO * 2 / 10, 0.003);
  [-1, 1].forEach(function(s){ tubo(null, [xc + 0.02, yP + 0.05, s * (ZR + 0.04)], [xc - 0.10, YB - 0.10, s * (ZR + 0.04)], 0.03, 'pintura', col, 8); });
}

/* lo que cuelga afuera de los largueros entre la cabina y el eje trasero */
function rmdEquipChasis(C){
  var D = C.D, P = C.P, bl = D.bloque, cil = D.cilindro, tubo = D.tubo;
  var YR = P.YR, YB = P.YB, ZR = P.ZR;
  /* en el capot el tanque va detras de los escalones de la puerta */
  var x0 = P.conv ? P.XD + P.R + 0.58 : Math.max(P.XD + P.R + 0.20, P.xb + 0.05), x1 = P.XT - P.R - 0.20;
  /* tanque de combustible a la izquierda: aluminio en los grandes, resina negra en los livianos */
  var grande = P.R > 0.45, lt = Math.min(grande ? 1.00 : 0.75, x1 - x0 - 0.05), xt = x0 + lt / 2;
  var rt = grande ? 0.30 : 0.22, zt = ZR + 0.08 + rt;
  if(grande || P.conv){
    cil('TQC1', rt, rt, lt, 'metal', RMD_ALU, xt, YB - 0.05, zt, [0, 0, Math.PI / 2], 30);
    [-0.32, 0.32].forEach(function(d){ D.pon(null, new THREE.TorusGeometry(rt + 0.005, 0.012, 8, 30), 'mate', RMD_NEGRO, xt + d * lt, YB - 0.05, zt, [0, Math.PI / 2, 0]); });
    [-0.32, 0.32].forEach(function(d){ bl(null, 0.05, 0.22, 0.05, 'pintura', RMD_CHASIS, xt + d * lt, YB + 0.05, ZR + 0.08, 0.01); });
  } else {
    bl('TQC1', lt, 0.40, 0.36, 'mate', '#202326', xt, YB - 0.12, ZR + 0.25, 0.08);
    [-0.32, 0.32].forEach(function(d){ bl(null, 0.03, 0.44, 0.40, 'metal', RMD_GRIS2, xt + d * lt, YB - 0.12, ZR + 0.25, 0.008); });
  }
  cil(null, 0.05, 0.05, 0.05, 'mate', RMD_NEGRO, xt - lt * 0.28, YB - 0.05 + rt, zt, null, 14);
  /* a la derecha: caja de baterias, y tanques de aire si tiene frenos de aire */
  var xbat = x0 + 0.30;
  bl('BAT', 0.55, 0.36, 0.44, 'mate', RMD_PLAST, xbat, YB - 0.10, -(ZR + 0.30), 0.04);
  bl(null, 0.57, 0.03, 0.46, 'metal', RMD_ALU, xbat, YB + 0.09, -(ZR + 0.30), 0.008);
  if(P.aire){
    var xa = xbat + 0.95;
    if(xa + 0.35 < x1) [0, 1].forEach(function(k){ cil('LPA', 0.10, 0.10, 0.62, 'pintura', '#2B2F34', xa, YB - 0.10 - k * 0.22, -(ZR + 0.14), [0, 0, Math.PI / 2], 16); });
    bl('42076084', 0.12, 0.10, 0.10, 'metal', '#7E848A', x1 - 0.10, YB + 0.02, ZR + 0.10, 0.015);
  }
  /* silenciador bajo el larguero derecho y la cola del escape hacia afuera (las avanzadas) */
  if(!P.conv){
    var xs = P.xb + 0.45;
    cil('42064643', 0.13, 0.13, 0.62, 'metal', '#8A9097', xs, YB - 0.14, -(ZR + 0.20), [0, 0, Math.PI / 2], 20);
    tubo(null, [P.XD + 0.40, YB - 0.10, -0.20], [xs - 0.31, YB - 0.14, -(ZR + 0.20)], 0.045, 'metal', '#5C6268', 12);
    tubo(null, [xs + 0.31, YB - 0.14, -(ZR + 0.20)], [xs + 0.55, YB - 0.22, -(ZR + 0.38)], 0.04, 'metal', '#5C6268', 12);
  }
  /* modulo electronico y engrase */
  bl('EC', 0.22, 0.16, 0.05, 'mate', '#1E2023', P.xb + 0.25, YB + P.hR * 0.5, ZR + 0.06, 0.012);
}

/* ═══ cabina avanzada (comun a Hino, VW y Fuso) ═══ */
function rmdCabinaAvanzada(C){
  var D = C.D, P = C.P, bl = D.bloque, tubo = D.tubo, G = C.G;
  var X0 = P.X0, XB = P.xb, hw = P.hw, Yb = P.Yb, YT = P.YT, wsb = P.wsb, wst = P.wst, rk = P.rake, rc = P.rc, col = P.color;
  var xf = function(y){ return y <= wsb ? X0 : y >= wst ? X0 + rk : X0 + rk * (y - wsb) / (wst - wsb); };
  C.xf = xf;
  /* casco por anillos: frente recto bajo el parabrisas, parabrisas inclinado,
     techo que se redondea hacia adentro */
  var ys = [Yb, Yb + 0.30, wsb - 0.02, (wsb + wst) / 2, wst, YT - 0.09, YT - 0.035, YT];
  var enc = [0, 0, 0, 0, 0, 0.012, 0.045, 0.11];
  var an = ys.map(function(y, i){
    var e = enc[i], x = xf(Math.min(y, wst)) + (i >= 5 ? e * 1.4 : 0);
    return rmdPlanta(y, x, XB - e * 0.6, hw - e, Math.max(0.03, rc - e * 0.4), Math.max(0.03, 0.07 - e * 0.2));
  });
  var casco = D.pon('CBN', rmdLoft(an, true), 'pintura', col, 0, 0, 0);
  casco.material.side = THREE.DoubleSide;
  D.pon('CBN', rmdTapa(an[an.length - 1]), 'pintura', col, 0, 0, 0).material.side = THREE.DoubleSide;
  /* piso de la cabina, para que no se vea adentro desde abajo */
  bl(null, XB - X0 - 0.10, 0.03, hw * 2 - 0.10, 'mate', '#202326', (X0 + XB) / 2, Yb + 0.01, 0, 0.01);

  /* parabrisas: marco negro y luna, entre las esquinas redondeadas */
  var dy = wst - wsb, Ls = Math.hypot(rk, dy), a = Math.atan2(rk, dy), nx = -Math.cos(a), ny = Math.sin(a);
  var cx = X0 + rk / 2, cy = (wsb + wst) / 2, wv = hw * 2 - rc * 0.9;
  bl(null, 0.02, Ls + 0.02, wv + 0.04, 'mate', '#0F1012', cx + nx * 0.006, cy + ny * 0.006, 0, 0.008, [0, 0, -a]);
  bl(null, 0.02, Ls - 0.08, wv - 0.10, 'vidrio', RMD_VIDRIO, cx + nx * 0.014, cy + ny * 0.014, 0, 0.006, [0, 0, -a]);
  /* limpiaparabrisas */
  [-0.45, 0.25].forEach(function(z){
    tubo(null, [X0 - 0.03, wsb + 0.06, z], [X0 - 0.03 + rk * 0.40, wsb + 0.06 + dy * 0.40, z + 0.42], 0.009, 'mate', '#0E0F11', 6);
  });
  /* puertas: ventana con marco, ventanilla de la esquina, juntas, manija, asideros y escalones */
  var xd0 = X0 + rc + 0.10, xd1 = XB - (P.marca === 'vw' ? 0.30 : 0.22), yv0 = Yb + (wsb - Yb) * 0.80, yv1 = wst - 0.06;
  var vent = [[xd0 + 0.04 + rk * 0.10, yv0], [xd1 - 0.06, yv0], [xd1 - 0.06, yv1], [xd0 + 0.04 + rk * 0.95, yv1]];
  C.texNum = texNumero3d(null, '#1A1C1F');
  [-1, 1].forEach(function(s){
    var zs = s * (hw + 0.003);
    D.perfil(null, rmdEnsanchar(vent, 0.035), 0.010, zs, 'mate', '#0F1012', 0.003);
    D.perfil(null, vent, 0.012, s * (hw + 0.008), 'vidrio', RMD_VIDRIO, 0.003);
    /* ventanilla baja junto al parabrisas en los Hino (vision de la acera) */
    if(P.marca === 'hino5' || P.marca === 'hino3'){
      var vb = [[xd0 + 0.04, yv0 - 0.36], [xd0 + 0.28, yv0 - 0.36], [xd0 + 0.28, yv0 - 0.06], [xd0 + 0.04, yv0 - 0.06]];
      D.perfil(null, rmdEnsanchar(vb, 0.02), 0.010, zs, 'mate', '#0F1012', 0.003);
      D.perfil(null, vb, 0.012, s * (hw + 0.008), 'vidrio', RMD_VIDRIO, 0.003);
    }
    /* juntas de la puerta */
    bl(null, 0.010, YT - Yb - 0.16, 0.006, 'mate', '#0B0C0E', xd0, (Yb + YT) / 2 - 0.04, zs, 0.002);
    bl(null, 0.010, YT - Yb - 0.16, 0.006, 'mate', '#0B0C0E', xd1, (Yb + YT) / 2 - 0.04, zs, 0.002);
    bl(null, 0.20, 0.04, 0.035, 'mate', RMD_NEGRO, xd1 - 0.18, yv0 - 0.10, s * (hw + 0.015), 0.012);
    tubo(null, [xd1 + 0.08, Yb + 0.10, s * (hw + 0.045)], [xd1 + 0.08, yv0 + 0.10, s * (hw + 0.045)], 0.016, 'mate', RMD_NEGRO, 8);
    [Yb + 0.10, yv0 + 0.10].forEach(function(y){ tubo(null, [xd1 + 0.08, y, s * hw], [xd1 + 0.08, y, s * (hw + 0.045)], 0.012, 'mate', RMD_NEGRO, 6); });
    /* numero de la unidad en la puerta */
    rmdPlano(G, C.texNum, 0.56, 0.17, (xd0 + xd1) / 2, Yb + 0.30, s * (hw + 0.006), s > 0 ? 0 : Math.PI, true);
    /* espejos: brazo, principal y gran angular abajo */
    var zE = s * (hw + 0.28), xE = X0 - 0.10;
    tubo(null, [X0 + rc * 0.6, wst - 0.08, s * (hw - 0.02)], [xE, wst - 0.04, zE], 0.018, 'mate', RMD_NEGRO, 8);
    tubo(null, [X0 + rc * 0.6, wsb + 0.02, s * (hw - 0.02)], [xE, wsb + 0.05, zE], 0.016, 'mate', RMD_NEGRO, 8);
    tubo(null, [xE, wsb, zE], [xE, wst - 0.02, zE], 0.014, 'mate', RMD_NEGRO, 8);
    bl(null, 0.10, 0.36, 0.20, 'mate', RMD_NEGRO, xE + 0.01, wst - 0.24, zE + s * 0.05, 0.035);
    bl(null, 0.01, 0.32, 0.16, 'cromo', null, xE + 0.065, wst - 0.24, zE + s * 0.05, 0.004);
    bl(null, 0.09, 0.18, 0.18, 'mate', RMD_NEGRO, xE + 0.01, wsb + 0.14, zE + s * 0.04, 0.035);
    bl(null, 0.01, 0.15, 0.15, 'cromo', null, xE + 0.06, wsb + 0.14, zE + s * 0.04, 0.004);
    /* escalones: caja negra delante de la rueda, bajo la puerta, con dos pisaderas */
    var xs0 = X0 + 0.24, xs1 = P.XD - P.R - 0.06, ws = xs1 - xs0, xsm = (xs0 + xs1) / 2;
    if(ws > 0.14){
      bl(null, ws, Yb - 0.34, 0.26, 'mate', RMD_PLAST, xsm, (Yb + 0.34) / 2, s * (hw - 0.17), 0.03);
      var nE = Yb > 1.0 ? 2 : 1;
      for(var k = 0; k < nE; k++){
        var ye = 0.42 + k * (Yb - 0.42) / (nE + 0.4);
        bl(null, ws - 0.03, 0.035, 0.24, 'metal', '#8B9198', xsm, ye, s * (hw - 0.12), 0.008);
        bl(null, ws - 0.01, 0.08, 0.02, 'mate', RMD_PLAST, xsm, ye - 0.035, s * (hw - 0.01), 0.005);
      }
    }
    /* guardafango delantero: arco negro sobre la rueda y faldon detras */
    var arco = new THREE.Shape(), r1 = P.R + 0.09, r0 = P.R + 0.05;
    arco.absarc(0, 0, r1, 0.10, Math.PI - 0.25, false);
    arco.absarc(0, 0, r0, Math.PI - 0.25, 0.10, true);
    var gA = new THREE.ExtrudeGeometry(arco, { depth: P.A + 0.10, bevelEnabled: false, curveSegments: 16 });
    gA.translate(0, 0, -(P.A + 0.10) / 2);
    D.pon(null, gA, 'mate', RMD_PLAST, P.XD, P.R, s * P.ZD);
    bl(null, 0.02, 0.42, P.A + 0.08, 'goma', '#141618', P.XD + P.R + 0.12, 0.38, s * P.ZD, 0.01);
    /* luz de posicion ambar al costado */
    rmdLuz(D, 'LSM', 0.12, 0.05, 0.02, '#F2A31A', X0 + rc + 0.06, Yb + 0.06, s * (hw + 0.006), 0.5);
  });
  /* ventana de atras y la espalda */
  bl(null, 0.012, 0.36, 0.80, 'mate', '#0F1012', XB + 0.004, wsb + 0.30, 0, 0.004);
  bl(null, 0.014, 0.30, 0.72, 'vidrio', RMD_VIDRIO, XB + 0.010, wsb + 0.30, 0, 0.004);
  /* luces de galibo ambar en el techo y la circulina (obligatoria en mina) */
  for(var i = 0; i < 3; i++) rmdLuz(D, 'LSM', 0.05, 0.03, 0.12, '#F0A41C', X0 + rk + 0.20, YT + 0.008, -0.40 + i * 0.40, 0.4);
  var xBal = XB - 0.30;
  D.cilindro(null, 0.10, 0.11, 0.05, 'mate', RMD_NEGRO, xBal, YT + 0.025, 0.30, null, 18);
  var bal = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.16, 20),
    new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.5,
      roughness: 0.15, transparent: true, opacity: 0.9, clearcoat: 1 }));
  bal.position.set(xBal, YT + 0.13, 0.30); D.reg('CIR', bal, '#F0A41C');
  /* antena de radio (en mina todas llevan radio) */
  tubo(null, [XB - 0.20, YT, -hw + 0.20], [XB - 0.22, YT + 0.80, -hw + 0.20], 0.005, 'metal', '#222', 4);
  /* toma de aire detras de la cabina, a la derecha (Hino 500 y VW) */
  if(P.R > 0.39 && P.marca !== 'fuso'){
    bl('AFT1', 0.15, 0.62, 0.34, 'mate', RMD_PLAST, XB + 0.085, P.YR + 0.62, -(hw - 0.35), 0.04);
    D.cilindro(null, 0.07, 0.07, 0.30, 'mate', RMD_NEGRO, XB + 0.085, P.YR + 0.97, -(hw - 0.35), [Math.PI / 2, 0, 0], 16);
    D.tubo(null, [XB + 0.085, P.YR + 0.32, -(hw - 0.35)], [XB - 0.10, P.YR + 0.15, -0.30], 0.07, 'goma', '#1B1D20', 12);
  }
}

/* parachoques de cabina avanzada: hex del cuerpo, alto y lo que lleva */
function rmdParachoques(C, hex, tipo, y0, y1, prof){
  var D = C.D, P = C.P, bl = D.bloque, X0 = P.X0, hw = P.hw;
  var xb = X0 - 0.05, w = hw * 2 - 0.04;
  bl('42023615', prof, y1 - y0, w, tipo, hex, xb + prof / 2, (y0 + y1) / 2, 0, 0.04);
  /* esquinas que se doblan hacia las ruedas */
  [-1, 1].forEach(function(s){
    var esq = bl('42023615', 0.30, y1 - y0, 0.10, tipo, hex, xb + 0.14, (y0 + y1) / 2, s * (hw - 0.07), 0.03);
    esq.rotation.y = s * 0.35;
  });
  /* gancho de remolque y placa */
  bl(null, 0.10, 0.10, 0.14, 'metal', '#2E3236', xb - 0.03, y0 + 0.06, 0, 0.02);
  D.cilindro(null, 0.022, 0.022, 0.16, 'metal', '#4A4F55', xb - 0.05, y0 + 0.06, 0, null, 8);
  return xb;
}

/* ═══ frente Hino Serie 500 (FC): banda negra con el ovalo y dos barras
   cromadas, HINO bajo el parabrisas, faros en las esquinas del parachoques ═══ */
function rmdFrenteHino5(C){
  var D = C.D, P = C.P, bl = D.bloque, X0 = P.X0, hw = P.hw, Yb = P.Yb, wsb = P.wsb, FX = X0 - 0.012;
  var y0 = 0.42, y1 = Yb + 0.02;
  var xb = rmdParachoques(C, P.color, 'pintura', y0, y1, 0.26);
  /* faros en cajas negras en las esquinas del parachoques, con la luz de giro */
  [-1, 1].forEach(function(s){
    var zf = s * (hw - 0.30);
    bl(null, 0.04, 0.17, 0.42, 'mate', '#0D0E10', xb - 0.005, y1 - 0.13, zf, 0.02);
    [-0.10, 0.08].forEach(function(dz){ D.faro(s > 0 ? 'FDI' : 'FDD', xb + 0.03, y1 - 0.13, zf + s * dz, 0.055); });
    rmdLuz(D, 'LSM', 0.02, 0.06, 0.08, '#F2A31A', xb - 0.03, y1 - 0.13, s * (hw - 0.06), 0.5);
    D.faro('FNB', xb + 0.02, y0 + 0.10, s * (hw - 0.42), 0.040);
  });
  /* placa negra con HINO al medio del parachoques */
  bl(null, 0.02, 0.14, 0.62, 'mate', '#0D0E10', xb - 0.012, (y0 + y1) / 2 + 0.03, 0, 0.01);
  C.D.letrero(rmdTexLetras('HINO', '#0D0E10', '#E8ECEF', 512, 96, null, true), 0.42, 0.08, xb - 0.024, (y0 + y1) / 2 + 0.03, 0, -Math.PI / 2);
  /* banda de la parrilla: trapecio oscuro con dos barras cromadas y el ovalo */
  var gy0 = Yb + 0.07, gy1 = wsb - 0.30, gw = hw * 2 - 0.62;
  bl('RAD1', 0.04, gy1 - gy0, gw, 'pintura', '#2A2D31', FX - 0.01, (gy0 + gy1) / 2, 0, 0.03);
  [0.32, 0.68].forEach(function(f){ bl(null, 0.03, 0.035, gw - 0.10, 'cromo', null, FX - 0.035, gy0 + f * (gy1 - gy0), 0, 0.01); });
  D.pon(null, new THREE.CylinderGeometry(0.17, 0.17, 0.03, 32), 'mate', '#2A2D31', FX - 0.04, (gy0 + gy1) / 2, 0, [0, 0, Math.PI / 2]).scale.set(1, 1, 1.45);
  rmdPlano(C.G, rmdTexHino(), 0.42, 0.26, FX - 0.058, (gy0 + gy1) / 2, 0, -Math.PI / 2, true);
  /* tapa de servicio con su manija y HINO / 500 bajo el parabrisas */
  bl(null, 0.02, 0.012, hw * 2 - 0.50, 'mate', '#9AA0A6', FX - 0.004, wsb - 0.22, 0, 0.004);
  bl(null, 0.03, 0.04, 0.40, 'mate', '#202326', FX - 0.012, wsb - 0.13, 0, 0.01);
  C.D.letrero(rmdTexLetras('HINO', null, '#7D848B', 512, 96, null, true), 0.40, 0.08, FX - 0.006, wsb - 0.10, hw - 0.48, -Math.PI / 2).material.transparent = true;
  C.D.letrero(rmdTexLetras('500', null, '#7D848B', 256, 96), 0.22, 0.08, FX - 0.006, wsb - 0.10, -hw + 0.42, -Math.PI / 2).material.transparent = true;
  /* bajo el parachoques: protector negro */
  bl(null, 0.20, 0.06, hw * 2 - 0.40, 'mate', '#1C1E21', xb + 0.16, y0 - 0.03, 0, 0.01);
}

/* ═══ frente Hino Serie 300 (Dutro): parrilla negra trapezoidal con lamas
   cromadas y el ovalo, faros envolventes en las esquinas altas ═══ */
function rmdFrenteHino3(C){
  var D = C.D, P = C.P, bl = D.bloque, X0 = P.X0, hw = P.hw, Yb = P.Yb, wsb = P.wsb, FX = X0 - 0.012;
  var y0 = 0.40, y1 = Yb + 0.06;
  var xb = rmdParachoques(C, P.color, 'pintura', y0, y1, 0.22);
  /* toma baja negra y neblineros en el parachoques */
  bl(null, 0.02, 0.10, 0.70, 'mate', '#0D0E10', xb - 0.012, (y0 + y1) / 2, 0, 0.01);
  [-1, 1].forEach(function(s){
    bl(null, 0.02, 0.12, 0.20, 'mate', '#0D0E10', xb - 0.012, (y0 + y1) / 2, s * (hw - 0.30), 0.01);
    D.faro('FNB', xb + 0.02, (y0 + y1) / 2, s * (hw - 0.30), 0.040);
  });
  /* parrilla: trapecio negro, cuatro lamas cromadas */
  var gy0 = Yb + 0.08, gy1 = wsb - 0.22;
  D.perfilX('RAD1', [[-0.60, gy0], [0.60, gy0], [0.72, gy1], [-0.72, gy1]], 0.04, FX - 0.012, 'pintura', '#16181B', 0.01);
  for(var i = 1; i <= 4; i++){
    var y = gy0 + i * (gy1 - gy0) / 5, wl = 1.20 + 0.24 * i / 5;
    bl(null, 0.02, 0.022, wl - 0.10, 'cromo', null, FX - 0.040, y, 0, 0.006);
  }
  D.pon(null, new THREE.CylinderGeometry(0.11, 0.11, 0.025, 32), 'mate', '#16181B', FX - 0.05, (gy0 + gy1) / 2, 0, [0, 0, Math.PI / 2]).scale.set(1, 1, 1.45);
  rmdPlano(C.G, rmdTexHino(), 0.28, 0.18, FX - 0.064, (gy0 + gy1) / 2, 0, -Math.PI / 2, true);
  C.D.letrero(rmdTexLetras('HINO', null, '#6E757C', 512, 96, null, true), 0.30, 0.06, FX - 0.004, gy1 + 0.07, 0, -Math.PI / 2).material.transparent = true;
  /* faros: caja que sigue la esquina, mica y luz de giro */
  [-1, 1].forEach(function(s){
    var z0 = s * (hw - 0.42), z1 = s * (hw - 0.05), yf0 = gy0 + 0.02, yf1 = gy1 - 0.02;
    var pts = [[z0, yf0 + 0.03], [z1, yf0], [z1, yf1 + 0.04], [z0, yf1]];
    if(s < 0) pts.reverse();
    D.perfilX(null, pts, 0.06, FX - 0.012, 'mate', '#0D0E10', 0.008);
    D.perfilX(s > 0 ? 'FDI' : 'FDD', rmdEnsanchar(pts, -0.018), 0.02, FX - 0.046, 'vidrio', '#A9B8C4', 0.004);
    D.faro(s > 0 ? 'FDI' : 'FDD', FX - 0.02, (yf0 + yf1) / 2, z0 + (z1 - z0) * 0.35, 0.050);
    rmdLuz(D, 'LSM', 0.012, (yf1 - yf0) * 0.7, 0.07, '#F2A31A', FX - 0.050, (yf0 + yf1) / 2, z0 + (z1 - z0) * 0.80, 0.5);
  });
}

/* ═══ frente Fuso Canter: banda negra entre los faros con los tres
   diamantes, faros rectangulares en las esquinas altas, CANTER en la puerta ═══ */
function rmdFrenteFuso(C){
  var D = C.D, P = C.P, bl = D.bloque, X0 = P.X0, hw = P.hw, Yb = P.Yb, wsb = P.wsb, FX = X0 - 0.012;
  var y0 = 0.42, y1 = Yb + 0.04;
  var xb = rmdParachoques(C, '#8E959C', 'pintura', y0, y1, 0.22);
  [-1, 1].forEach(function(s){ D.faro('FNB', xb + 0.02, (y0 + y1) / 2, s * (hw - 0.28), 0.040); });
  bl(null, 0.02, 0.08, 0.80, 'mate', '#0D0E10', xb - 0.012, (y0 + y1) / 2, 0, 0.01);
  /* banda negra con lamas */
  var gy0 = Yb + 0.10, gy1 = wsb - 0.12, gw = hw * 2 - 0.88;
  bl('RAD1', 0.03, gy1 - gy0, gw, 'pintura', '#121316', FX - 0.008, (gy0 + gy1) / 2, 0, 0.02);
  for(var i = 1; i <= 3; i++) bl(null, 0.02, 0.025, gw - 0.08, 'pintura', '#2C2F34', FX - 0.028, gy0 + i * (gy1 - gy0) / 4, 0, 0.006);
  rmdPlano(C.G, rmdTexMitsu(), 0.22, 0.22, FX - 0.040, (gy0 + gy1) / 2 + 0.01, 0, -Math.PI / 2, true);
  /* faros rectangulares que doblan la esquina */
  [-1, 1].forEach(function(s){
    var z0 = s * (gw / 2 + 0.02), z1 = s * (hw - 0.06);
    var pts = [[z0, gy0], [z1, gy0 + 0.02], [z1, gy1], [z0, gy1]];
    if(s < 0) pts.reverse();
    D.perfilX(null, pts, 0.05, FX - 0.010, 'mate', '#0D0E10', 0.008);
    D.perfilX(s > 0 ? 'FDI' : 'FDD', rmdEnsanchar(pts, -0.016), 0.02, FX - 0.040, 'vidrio', '#B3C0CA', 0.004);
    D.faro(s > 0 ? 'FDI' : 'FDD', FX - 0.012, (gy0 + gy1) / 2, z0 + (z1 - z0) * 0.38, 0.055);
    rmdLuz(D, 'LSM', 0.012, (gy1 - gy0) * 0.70, 0.06, '#F2A31A', FX - 0.044, (gy0 + gy1) / 2, z0 + (z1 - z0) * 0.82, 0.5);
  });
  C.D.letrero(rmdTexLetras('FUSO', null, '#6E757C', 512, 96, null, true), 0.36, 0.07, FX - 0.004, gy1 + 0.07, 0, -Math.PI / 2).material.transparent = true;
  [-1, 1].forEach(function(s){
    C.D.letrero(rmdTexLetras('CANTER', null, '#5A6067', 512, 96, 'italic bold #px Arial, sans-serif'), 0.50, 0.09,
      X0 + P.rc + 0.42, P.wsb - 0.10, s * (hw + 0.007), s > 0 ? 0 : Math.PI).material.transparent = true;
  });
}

/* ═══ frente VW Worker: panel del color de la cabina con tres lamas y el
   circulo VW, 17-220 arriba a la derecha; parachoques gris con faros redondos ═══ */
function rmdFrenteVW(C){
  var D = C.D, P = C.P, bl = D.bloque, X0 = P.X0, hw = P.hw, Yb = P.Yb, wsb = P.wsb, FX = X0 - 0.012;
  var y0 = 0.52, y1 = Yb + 0.06;
  var xb = rmdParachoques(C, '#8C9298', 'pintura', y0, y1, 0.24);
  /* cuatro faros redondos y la luz de giro en cada esquina */
  [-1, 1].forEach(function(s){
    [0.30, 0.52].forEach(function(dz){ D.faro(dz < 0.4 ? 'FDI' : 'FNB', xb + 0.03, (y0 + y1) / 2 + 0.02, s * (hw - dz), 0.068); });
    if(s < 0) [0.30].forEach(function(dz){ D.faro('FDD', xb + 0.03, (y0 + y1) / 2 + 0.02, s * (hw - dz), 0.068); });
    rmdLuz(D, 'LSM', 0.02, 0.07, 0.11, '#F2A31A', xb - 0.012, (y0 + y1) / 2 + 0.02, s * (hw - 0.11), 0.5);
    bl(null, 0.02, 0.20, 0.10, 'mate', '#202326', xb - 0.006, (y0 + y1) / 2, s * 0.20, 0.008);
  });
  /* panel frontal con tres lamas hundidas */
  var gy0 = Yb + 0.06, gy1 = wsb - 0.18, gw = hw * 2 - 0.70;
  bl('RAD1', 0.03, gy1 - gy0, gw, 'mate', '#15171A', FX + 0.006, (gy0 + gy1) / 2, 0, 0.02);
  for(var i = 0; i < 3; i++){
    var y = gy0 + (i + 0.5) * (gy1 - gy0) / 3;
    bl(null, 0.05, (gy1 - gy0) / 3 * 0.50, gw - 0.04, 'pintura', P.color, FX - 0.012, y, 0, 0.015);
  }
  D.pon(null, new THREE.TorusGeometry(0.135, 0.012, 8, 36), 'cromo', null, FX - 0.045, (gy0 + gy1) / 2, 0, [0, Math.PI / 2, 0]);
  rmdPlano(C.G, rmdTexVW(), 0.26, 0.26, FX - 0.048, (gy0 + gy1) / 2, 0, -Math.PI / 2, true);
  C.D.letrero(rmdTexLetras('17-220', null, '#3E444B', 256, 80), 0.26, 0.08, FX - 0.004, gy1 + 0.08, -hw + 0.55, -Math.PI / 2).material.transparent = true;
  C.D.letrero(rmdTexLetras('VOLKSWAGEN', null, '#3E444B', 512, 80, null, true), 0.60, 0.07, FX - 0.004, gy1 + 0.08, hw - 0.62, -Math.PI / 2).material.transparent = true;
  [-1, 1].forEach(function(s){
    C.D.letrero(rmdTexLetras('WORKER', null, '#5A6067', 512, 80, null, true), 0.48, 0.07,
      X0 + P.rc + 0.46, P.wsb - 0.12, s * (hw + 0.007), s > 0 ? 0 : Math.PI).material.transparent = true;
  });
}

/* ═══ Freightliner M2 106: capot inclinado con guardafangos integrados,
   parrilla cromada de barras, faros barridos, cabina de dia ═══ */
function rmdCapoFL(C){
  var D = C.D, P = C.P, bl = D.bloque, tubo = D.tubo, col = P.color, XD = P.XD, R = P.R;
  var xF = 0.20, xC = P.X0, ra = R + 0.08;
  var yb0 = 0.70, ybC = P.Yb - 0.02;
  var secs = [], n = 16;
  for(var i = 0; i <= n; i++){
    var x = xF + (xC - xF) * i / n, f = (x - xF) / (xC - xF);
    var hwF = 0.86 + 0.32 * Math.sin(Math.min(1, f * 1.6) * Math.PI / 2) - (f > 0.85 ? (f - 0.85) * 0.6 : 0);
    var hwT = 0.46 + 0.30 * f;
    var yH = 1.46 + 0.30 * Math.pow(f, 0.8);
    var yF = yH - 0.10 - 0.06 * f;
    var yb = yb0 + (ybC - yb0) * f;
    var dx = Math.abs(x - XD);
    if(dx < ra) yb = Math.max(yb, R + Math.sqrt(ra * ra - dx * dx));
    yb = Math.min(yb, yF - 0.20);
    secs.push(rmdSeccionCapo(x, hwF, hwT, yb, yF, yH, 0.035));
  }
  var capo = D.pon('CBN', rmdLoft(secs, false), 'pintura', col, 0, 0, 0);
  capo.material.side = THREE.DoubleSide;
  var tapa = D.pon('CBN', rmdTapa(secs[0]), 'pintura', col, 0, 0, 0);
  tapa.material.side = THREE.DoubleSide;
  /* ceja negra alrededor del arco de la rueda */
  [-1, 1].forEach(function(s){
    var pts = rmdArco(XD, R, ra + 0.06, 0.10, Math.PI - 0.10, 16).concat(rmdArco(XD, R, ra, Math.PI - 0.10, 0.10, 16));
    D.perfil(null, pts, 0.10, s * 1.13, 'mate', '#202226', 0.012);
  });
  /* parrilla: marco cromado, barras horizontales y radiador detras */
  var gy0 = 0.86, gy1 = 1.42, gz = 0.44, gx = xF - 0.03;
  bl('RAD1', 0.10, gy1 - gy0, gz * 2, 'metal', '#2E3338', gx + 0.20, (gy0 + gy1) / 2, 0, 0.015);
  bl(null, 0.03, gy1 - gy0, gz * 2, 'mate', '#101113', gx + 0.04, (gy0 + gy1) / 2, 0, 0.01);
  bl(null, 0.06, gy1 - gy0 + 0.08, gz * 2 + 0.08, 'mate', '#26292D', gx + 0.035, (gy0 + gy1) / 2, 0, 0.03);
  var lista = [];
  for(var b = 1; b < 11; b++) lista.push([gx - 0.005, gy0 + b * (gy1 - gy0) / 11, 0]);
  rmdInst(D, null, new THREE.BoxGeometry(0.03, 0.026, gz * 2 - 0.04), 'cromo', null, lista);
  [gy0 + 0.01, gy1 - 0.01].forEach(function(y){ bl(null, 0.05, 0.035, gz * 2 + 0.04, 'cromo', null, gx - 0.01, y, 0, 0.012); });
  [-1, 1].forEach(function(s){ bl(null, 0.05, gy1 - gy0, 0.035, 'cromo', null, gx - 0.01, (gy0 + gy1) / 2, s * (gz + 0.005), 0.012); });
  /* emblema Freightliner sobre la parrilla */
  bl(null, 0.02, 0.06, 0.26, 'cromo', null, gx + 0.005, gy1 + 0.07, 0, 0.01);
  rmdPlano(C.G, rmdTexLetras('FREIGHTLINER', '#1E3F8A', '#EEF1F4', 512, 64), 0.22, 0.035, gx - 0.008, gy1 + 0.07, 0, -Math.PI / 2, false);
  /* faros: la parte de frente en la esquina del capot, junto a la parrilla, y
     la que dobla hacia atras por el costado del guardafango */
  var anchoF = function(x){ var f = (x - xF) / (xC - xF); return 0.86 + 0.32 * Math.sin(Math.min(1, f * 1.6) * Math.PI / 2); };
  [-1, 1].forEach(function(s){
    var ym = 1.13, zf = s * 0.67, code = s > 0 ? 'FDI' : 'FDD';
    bl(null, 0.05, 0.23, 0.34, 'mate', '#0D0E10', xF - 0.012, ym, zf, 0.02);
    bl(code, 0.02, 0.19, 0.30, 'vidrio', '#BFCBD4', xF - 0.040, ym, zf, 0.006);
    D.faro(code, xF - 0.03, ym + 0.01, zf - s * 0.06, 0.055);
    D.faro(code, xF - 0.03, ym + 0.01, zf + s * 0.07, 0.045);
    var xl = xF + 0.15, zl = anchoF(xl), ang = Math.atan2(anchoF(xl + 0.05) - anchoF(xl - 0.05), 0.10);
    var cs = bl(null, 0.28, 0.20, 0.04, 'mate', '#0D0E10', xl, ym, s * (zl + 0.005), 0.015);
    cs.rotation.y = -s * ang;
    var ms = bl(code, 0.24, 0.16, 0.02, 'vidrio', '#BFCBD4', xl, ym, s * (zl + 0.022), 0.006);
    ms.rotation.y = -s * ang;
    rmdLuz(D, 'LSM', 0.08, 0.06, 0.02, '#F2A31A', xl + 0.06, ym, s * (zl + 0.04), 0.5).rotation.y = -s * ang;
    /* rejilla de ventilacion en el costado del capot */
    /* va en la bajada del capot al guardafango, como en la foto */
    var vp = bl(null, 0.30, 0.02, 0.15, 'mate', '#26292D', 0.80, 1.585, s * 0.90, 0.008);
    vp.rotation.x = s * 0.22;
    for(var k = 0; k < 4; k++){
      var l = bl(null, 0.28, 0.018, 0.016, 'pintura', P.color, 0.80, 1.598 - k * 0.008, s * (0.85 + k * 0.035), 0.004);
      l.rotation.x = s * 0.22;
    }
  });
  /* parachoques de acero y su faldon */
  bl('42023615', 0.18, 0.30, 2.30, 'cromo', '#E4E8EC', 0.09, 0.66, 0, 0.05);
  bl(null, 0.10, 0.05, 2.20, 'mate', RMD_NEGRO, 0.14, 0.49, 0, 0.015);
  [-0.55, 0.55].forEach(function(z){ D.pon(null, new THREE.TorusGeometry(0.05, 0.02, 8, 16), 'pintura', '#1E2023', -0.02, 0.56, z, [Math.PI / 2, 0, 0]); });
  [-1, 1].forEach(function(s){ D.faro('FNB', 0.0, 0.66, s * 0.88, 0.045); });
  /* cisterna de agua: rociadores delanteros en el parachoques */
  [-1, 1].forEach(function(s){
    D.cilindro(null, 0.05, 0.05, 0.22, 'metal', '#9AA1A8', -0.04, 0.80, s * 0.95, null, 14);
    D.cilindro(null, 0.07, 0.04, 0.08, 'metal', '#C9A13A', -0.04, 0.95, s * 0.95, null, 14);
    tubo(null, [-0.04, 0.70, s * 0.95], [0.40, 0.55, s * 0.70], 0.03, 'metal', '#8E959C', 10);
  });
  /* escape vertical detras de la cabina, a la derecha */
  var xe = P.xb + 0.12, ze = -(P.hw - 0.22);
  D.cilindro('42064643', 0.13, 0.13, 0.80, 'metal', '#8A9097', xe, P.YR + 0.70, ze, null, 22);
  tubo(null, [xe, P.YR + 1.10, ze], [xe, P.YT + 0.55, ze], 0.055, 'cromo', null, 18);
  tubo(null, [xe, P.YT + 0.54, ze], [xe + 0.10, P.YT + 0.68, ze], 0.055, 'cromo', null, 18);
  tubo(null, [xe, P.YR + 0.30, ze], [1.40, 0.80, -0.20], 0.05, 'metal', '#5C6268', 12);
  [P.YR + 0.45, P.YT - 0.30].forEach(function(y){ bl(null, 0.14, 0.04, 0.04, 'mate', RMD_NEGRO, xe - 0.08, y, ze, 0.01); });
  /* filtro de aire contra la espalda de la cabina, a la izquierda */
  D.cilindro('AFT1', 0.17, 0.17, 0.62, 'mate', '#2A2D31', xe, P.YR + 0.62, P.hw - 0.25, null, 22);
  tubo(null, [xe, P.YR + 0.95, P.hw - 0.25], [xe - 0.10, P.YR + 1.12, P.hw - 0.25], 0.09, 'mate', '#2A2D31', 14);
}

/* cabina de dia del M2: casco por anillos sobre el capot, puertas con su
   ventana de linea baja, espejos de brazo y escalones con el tanque */
function rmdCabinaFL(C){
  var D = C.D, P = C.P, bl = D.bloque, tubo = D.tubo, G = C.G;
  var X0 = P.X0, XB = P.xb, hw = P.hw, Yb = P.Yb, YT = P.YT, wsb = P.wsb, wst = P.wst, rk = P.rake, col = P.color;
  var xf = function(y){ return y <= wsb ? X0 : y >= wst ? X0 + rk : X0 + rk * (y - wsb) / (wst - wsb); };
  var ys = [Yb, wsb - 0.02, (wsb + wst) / 2, wst, YT - 0.08, YT - 0.03, YT];
  var enc = [0, 0, 0.012, 0.025, 0.04, 0.07, 0.13];
  var an = ys.map(function(y, i){
    var e = enc[i], x = xf(Math.min(y, wst)) + (i >= 4 ? e : 0);
    return rmdPlanta(y, x, XB - e * 0.4, hw - e, Math.max(0.03, 0.12 - e * 0.3), Math.max(0.03, 0.08 - e * 0.3));
  });
  D.pon('CBN', rmdLoft(an, true), 'pintura', col, 0, 0, 0).material.side = THREE.DoubleSide;
  D.pon('CBN', rmdTapa(an[an.length - 1]), 'pintura', col, 0, 0, 0).material.side = THREE.DoubleSide;
  bl(null, XB - X0 - 0.10, 0.03, hw * 2 - 0.10, 'mate', '#202326', (X0 + XB) / 2, Yb + 0.01, 0, 0.01);
  /* parabrisas partido de dos lunas */
  var dy = wst - wsb, Ls = Math.hypot(rk, dy), a = Math.atan2(rk, dy), nx = -Math.cos(a), ny = Math.sin(a);
  var cx = X0 + rk / 2, cy = (wsb + wst) / 2;
  bl(null, 0.02, Ls + 0.02, hw * 2 - 0.14, 'mate', '#0F1012', cx + nx * 0.005, cy + ny * 0.005, 0, 0.008, [0, 0, -a]);
  [-1, 1].forEach(function(s){
    bl(null, 0.02, Ls - 0.08, hw - 0.14, 'vidrio', RMD_VIDRIO, cx + nx * 0.012, cy + ny * 0.012, s * (hw / 2 - 0.02), 0.006, [0, 0, -a]);
  });
  [-0.55, 0.20].forEach(function(z){ tubo(null, [X0 - 0.01, wsb + 0.06, z], [X0 + rk * 0.40, wsb + 0.06 + dy * 0.40, z + 0.40], 0.009, 'mate', '#0E0F11', 6); });
  /* visera de luces ambar */
  for(var i = 0; i < 5; i++) rmdLuz(D, 'LSM', 0.06, 0.035, 0.09, '#F0A41C', X0 + rk + 0.06, YT + 0.005, -0.50 + i * 0.25, 0.45);
  /* puertas */
  var xd0 = X0 + 0.10, xd1 = XB - 0.20, yv0 = wsb - 0.18, yv1 = wst - 0.05;
  var vent = [[xd0 + 0.10, yv0 - 0.10], [xd0 + 0.36, yv0 - 0.10], [xd0 + 0.44, yv0], [xd1 - 0.05, yv0], [xd1 - 0.05, yv1], [xd0 + 0.04 + rk * 0.95, yv1]];
  C.texNum = texNumero3d(null, '#1A1C1F');
  [-1, 1].forEach(function(s){
    var zs = s * (hw + 0.003);
    D.perfil(null, rmdEnsanchar(vent, 0.03), 0.010, zs, 'mate', '#0F1012', 0.003);
    D.perfil(null, vent, 0.012, s * (hw + 0.008), 'vidrio', RMD_VIDRIO, 0.003);
    bl(null, 0.010, YT - Yb - 0.14, 0.006, 'mate', '#0B0C0E', xd0, (Yb + YT) / 2 - 0.04, zs, 0.002);
    bl(null, 0.010, YT - Yb - 0.14, 0.006, 'mate', '#0B0C0E', xd1, (Yb + YT) / 2 - 0.04, zs, 0.002);
    bl(null, 0.16, 0.04, 0.035, 'mate', RMD_NEGRO, xd1 - 0.16, yv0 - 0.12, s * (hw + 0.015), 0.012);
    tubo(null, [xd1 + 0.07, Yb + 0.10, s * (hw + 0.045)], [xd1 + 0.07, yv0, s * (hw + 0.045)], 0.016, 'cromo', null, 8);
    [Yb + 0.10, yv0].forEach(function(y){ tubo(null, [xd1 + 0.07, y, s * hw], [xd1 + 0.07, y, s * (hw + 0.045)], 0.012, 'cromo', null, 6); });
    rmdPlano(G, C.texNum, 0.56, 0.17, (xd0 + xd1) / 2, Yb + 0.30, s * (hw + 0.006), s > 0 ? 0 : Math.PI, true);
    /* espejos de brazo con el convexo debajo */
    var xm = X0 + 0.02, zm = s * (hw + 0.30), y1 = yv1 - 0.04, y0 = yv0 - 0.02;
    tubo(null, [X0 + rk * 0.8 + 0.06, yv1 - 0.04, s * hw], [xm, y1, zm], 0.013, 'mate', RMD_NEGRO, 8);
    tubo(null, [xd0 + 0.06, y0, s * hw], [xm, y0, zm], 0.013, 'mate', RMD_NEGRO, 8);
    tubo(null, [xm, y0 - 0.10, zm], [xm, y1 + 0.02, zm], 0.012, 'mate', RMD_NEGRO, 8);
    bl(null, 0.07, 0.36, 0.18, 'mate', RMD_NEGRO, xm + 0.01, (y0 + y1) / 2 + 0.04, zm + s * 0.10, 0.025);
    bl(null, 0.01, 0.32, 0.15, 'cromo', null, xm - 0.03, (y0 + y1) / 2 + 0.04, zm + s * 0.10, 0.004);
    D.cilindro(null, 0.07, 0.07, 0.05, 'mate', RMD_NEGRO, xm + 0.01, y0 - 0.12, zm + s * 0.08, [0, 0, Math.PI / 2], 18);
    /* espejo del guardafango (para ver el frente) */
    tubo(null, [0.62, 1.40, s * 1.02], [0.52, 1.62, s * 1.12], 0.010, 'mate', RMD_NEGRO, 6);
    D.cilindro(null, 0.06, 0.06, 0.03, 'mate', RMD_NEGRO, 0.52, 1.66, s * 1.12, [0, 0, Math.PI / 2], 16);
  });
  /* ventana de atras */
  bl(null, 0.012, 0.42, 0.90, 'mate', '#0F1012', XB + 0.004, YT - 0.42, 0, 0.004);
  bl(null, 0.014, 0.36, 0.84, 'vidrio', RMD_VIDRIO, XB + 0.010, YT - 0.42, 0, 0.004);
  /* circulina y antena */
  D.cilindro(null, 0.10, 0.11, 0.05, 'mate', RMD_NEGRO, XB - 0.25, YT + 0.025, 0.30, null, 18);
  var bal = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.16, 20),
    new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.5,
      roughness: 0.15, transparent: true, opacity: 0.9, clearcoat: 1 }));
  bal.position.set(XB - 0.25, YT + 0.13, 0.30); D.reg('CIR', bal, '#F0A41C');
  tubo(null, [XB - 0.20, YT, -hw + 0.20], [XB - 0.22, YT + 0.80, -hw + 0.20], 0.005, 'metal', '#222', 4);
  /* escalones de aluminio bajo cada puerta: a la izquierda en el soporte
     del tanque, a la derecha en la caja de baterias */
  var texD = rmdTexDiamante(), xs0 = P.XD + P.R + 0.10, xs1 = P.XD + P.R + 0.50;
  [-1, 1].forEach(function(s){
    var zc = s * (hw - 0.12);
    [xs0, xs1].forEach(function(x){ bl(null, 0.03, Yb - 0.42, 0.28, 'metal', RMD_ALU, x, (Yb + 0.42) / 2, zc, 0.01); });
    [0.50, 0.82].forEach(function(y){
      var m = new THREE.Mesh(new THREE.BoxGeometry(xs1 - xs0, 0.03, 0.28),
        new THREE.MeshStandardMaterial({ map: texD, color: new THREE.Color('#D8DCE0'), roughness: 0.4, metalness: 0.75 }));
      m.position.set((xs0 + xs1) / 2, y, zc + s * 0.02); D.reg(null, m, '#D8DCE0');
    });
  });
}

/* ═══ CUERPO: cisterna eliptica (combustible o agua) ═══ */
function rmdCisterna(C, agua){
  var D = C.D, P = C.P, bl = D.bloque, tubo = D.tubo, cil = D.cilindro, G = C.G;
  var YR = P.YR, grande = P.R > 0.45;
  var a = grande ? 1.12 : 1.02, b = grande ? (agua ? 0.68 : 0.72) : 0.60;
  var x0 = P.xCuerpo + 0.08, x1 = P.XFin - (agua ? 0.25 : 0.62);
  var yc = YR + 0.14 + b, ytop = yc + b;
  var colT = agua ? '#B7C6D3' : RMD_BLANCO, col2 = agua ? '#8EA3B6' : '#C9CDD1';
  /* falso chasis y cunas que siguen la panza */
  [-1, 1].forEach(function(s){ bl(null, x1 - x0 + 0.20, 0.12, 0.10, 'pintura', RMD_CHASIS, (x0 + x1) / 2, YR + 0.06, s * P.ZR, 0.02); });
  var yEl = function(z){ return yc - b * Math.sqrt(Math.max(0, 1 - (z / a) * (z / a))) - 0.010; };
  [x0 + 0.40, (x0 + x1) / 2, x1 - 0.40].forEach(function(x){
    var pts = [[-0.70, YR + 0.10], [0.70, YR + 0.10]];
    for(var z = 0.70; z >= -0.701; z -= 0.175) pts.push([z, yEl(z)]);
    D.perfilX(null, pts, 0.10, x, 'pintura', RMD_CHASIS, 0.01);
  });
  /* casco y casquetes */
  var cas = cil(null, 1, 1, x1 - x0 - 0.36, 'pintura', colT, (x0 + x1) / 2, yc, 0, [0, 0, Math.PI / 2], 48);
  cas.scale.set(b, 1, a);
  [x0 + 0.18, x1 - 0.18].forEach(function(x, k){
    var cq = D.pon(null, new THREE.SphereGeometry(1, 36, 18, k ? Math.PI : 0, Math.PI), 'pintura', colT, x, yc, 0, [0, 0, 0]);
    cq.rotation.y = -Math.PI / 2;
    cq.scale.set(a, b, 0.22);
    var ar = D.pon(null, new THREE.TorusGeometry(1, 0.02, 8, 52), 'pintura', col2, x, yc, 0, [0, Math.PI / 2, 0]);
    ar.scale.set(a + 0.004, b + 0.004, 1);
  });
  /* anillos de refuerzo (rompeolas por dentro) */
  for(var r = 1; r <= 2; r++){
    var ar2 = D.pon(null, new THREE.TorusGeometry(1, 0.018, 8, 52), 'pintura', col2, x0 + 0.18 + r * (x1 - x0 - 0.36) / 3, yc, 0, [0, Math.PI / 2, 0]);
    ar2.scale.set(a + 0.003, b + 0.003, 1);
  }
  /* franja de color que sigue la curva del casco */
  [-0.24, Math.PI + 0.24].forEach(function(tc){
    var gF = new THREE.CylinderGeometry(1, 1, x1 - x0 - 0.38, 48, 1, true, tc - 0.06, 0.12);
    var fr = D.pon(null, gF, 'pintura', agua ? '#1E5AA8' : '#C3161B', (x0 + x1) / 2, yc, 0, [0, 0, Math.PI / 2]);
    fr.material.side = THREE.DoubleSide;
    fr.scale.set(b + 0.004, 1, a + 0.004);
  });
  /* letreros en el ecuador del casco */
  var texL = agua ? rmdTexLetras('AGUA NO POTABLE', '#1E5AA8', '#FFFFFF', 1024, 96)
                  : rmdTexLetras('INFLAMABLE', colT, '#C3161B', 1024, 110, null, true);
  var texR = rmdTexRombo('#C8201B', null, '3', '#FFFFFF', true), texU = rmdTexONU('30', '1202');
  [-1, 1].forEach(function(s){
    var ry = s > 0 ? 0 : Math.PI, zp = s * (a + 0.024);
    rmdPlano(G, texL, Math.min(2.0, (x1 - x0) * 0.42), agua ? 0.17 : 0.20, (x0 + x1) / 2 - 0.05, yc + 0.03, zp, ry, false);
    rmdPlano(G, C.texNumC, 0.90, 0.27, x1 - 0.75, yc + 0.03, zp, ry, true);
    if(!agua){
      rmdPlano(G, texR, 0.32, 0.32, x0 + 0.48, yc + 0.02, zp, ry, true);
      rmdPlano(G, texU, 0.34, 0.21, x0 + 0.88, yc + 0.02, zp, ry, false);
    }
  });
  /* arriba: buzones, pasarela de rejilla y barandas abatibles */
  var yTop = function(z){ return yc + b * Math.sqrt(Math.max(0, 1 - (z / a) * (z / a))); };
  var nB = agua ? 1 : 2, xw0 = x0 + 0.30, xw1 = x1 - 0.30, zw = -0.45, yw = ytop + 0.035;
  bl(null, xw1 - xw0, 0.03, 0.32, 'metal', '#8E959C', (xw0 + xw1) / 2, yw, zw, 0.01);
  var trv = [];
  for(var t = 0; t < 14; t++) trv.push([xw0 + 0.1 + t * (xw1 - xw0 - 0.2) / 13, yw + 0.004, zw]);
  rmdInst(D, null, new THREE.BoxGeometry(0.016, 0.035, 0.32), 'metal', '#5E656D', trv);
  [xw0 + 0.12, xw1 - 0.12].forEach(function(x){ bl(null, 0.05, yw - yTop(zw - 0.10) + 0.03, 0.05, 'metal', '#5E656D', x, (yw + yTop(zw - 0.10)) / 2, zw - 0.10, 0.008); });
  for(var nn = 0; nn < nB; nn++){
    var xn = x0 + (nn + 0.5) * (x1 - x0) / nB;
    cil(null, 0.25, 0.27, 0.12, 'pintura', col2, xn, ytop + 0.04, 0.10, null, 30);
    cil(null, 0.23, 0.23, 0.05, 'metal', '#A9AFB5', xn, ytop + 0.12, 0.10, null, 30);
    bl(null, 0.07, 0.05, 0.10, 'metal', RMD_GRIS, xn - 0.18, ytop + 0.14, 0.10, 0.01);
    if(!agua) cil(null, 0.045, 0.045, 0.14, 'metal', RMD_GRIS, xn + 0.18, ytop + 0.09, 0.36, null, 12);
  }
  D.baranda([[xw0, -0.68], [xw1, -0.68]], yTop(-0.68) - 0.02, 0.85, '#E0B21A');
  /* escalera atras a la derecha con sus pasamanos */
  var xe = x1 + 0.10;
  D.escalera(xe, -0.50, 0.50, ytop + 0.08, 0.40, '#8E959C', '#5E656D');
  [-0.70, -0.30].forEach(function(z){ tubo(null, [xe, ytop + 0.08, z], [xe - 0.18, ytop + 0.85, z], 0.022, 'metal', '#8E959C', 8); });
  if(!agua){
    /* gabinete trasero: carrete de manguera, bomba y medidor */
    var gx0 = x1 + 0.22, gx1 = P.XFin + 0.02, gy0 = YR + 0.02, gy1 = YR + 1.00, gz = a - 0.02, gxm = (gx0 + gx1) / 2;
    if(gx1 - gx0 > 0.25){
      bl(null, gx1 - gx0, 0.04, gz * 2, 'pintura', colT, gxm, gy1, 0, 0.015);
      bl(null, gx1 - gx0, 0.04, gz * 2, 'metal', '#8E959C', gxm, gy0 + 0.02, 0, 0.01);
      [-1, 1].forEach(function(s){ bl(null, gx1 - gx0, gy1 - gy0, 0.03, 'pintura', colT, gxm, (gy0 + gy1) / 2, s * gz, 0.01); });
      bl(null, 0.03, gy1 - gy0, 0.60, 'pintura', colT, gx0 + 0.02, (gy0 + gy1) / 2, -0.60, 0.01);
      var yr = gy0 + 0.46;
      cil(null, 0.13, 0.13, 0.70, 'metal', '#9AA1A8', gxm, yr, 0.25, [Math.PI / 2, 0, 0], 18);
      [-0.08, 0.58].forEach(function(z){ cil(null, 0.33, 0.33, 0.025, 'pintura', '#C3161B', gxm, yr, z, [Math.PI / 2, 0, 0], 30); });
      var vueltas = [];
      for(var v = 0; v < 5; v++) vueltas.push([gxm, yr, 0.0 + v * 0.11, 0, 0, 0]);
      rmdInst(D, null, new THREE.TorusGeometry(0.20, 0.03, 8, 26), 'goma', '#16181B', vueltas);
      tubo(null, [gxm + 0.20, yr - 0.05, 0.25], [gx1 + 0.05, gy0 + 0.22, 0.62], 0.03, 'goma', '#16181B', 8);
      bl(null, 0.07, 0.18, 0.09, 'metal', '#2E3236', gx1 + 0.06, gy0 + 0.26, 0.62, 0.02);
      bl('PYM', 0.26, 0.22, 0.26, 'pintura', '#C3161B', gxm, gy0 + 0.17, -0.60, 0.03);
      bl(null, 0.18, 0.20, 0.14, 'mate', RMD_NEGRO, gxm, gy0 + 0.48, -0.60, 0.02);
      cil(null, 0.07, 0.07, 0.02, 'vidrio', '#D9E4EA', gx1 - 0.08, gy0 + 0.48, -0.60, [0, 0, Math.PI / 2], 16);
      tubo('LPH', [x1, yc - b + 0.12, -0.35], [gxm, gy0 + 0.17, -0.52], 0.035, 'metal', '#9AA1A8', 10);
      rmdPlano(G, texR, 0.32, 0.32, gx1 + 0.022, gy1 - 0.26, -0.60, Math.PI / 2, true);
      rmdPlano(G, texU, 0.32, 0.20, gx1 + 0.022, gy1 - 0.22, 0.60, Math.PI / 2, false);
    }
    /* extintores a los costados (transporte de combustible) */
    [-1, 1].forEach(function(s){
      cil('SCI', 0.075, 0.075, 0.46, 'pintura', '#C3161B', x0 + 0.05, YR - 0.05, s * (P.ZR + 0.50), null, 16);
      bl(null, 0.18, 0.55, 0.04, 'pintura', RMD_CHASIS, x0 + 0.05, YR - 0.03, s * (P.ZR + 0.40), 0.01);
    });
  } else {
    /* bomba centrifuga en la toma de fuerza, flauta de riego y valvulas */
    var xb = P.XFin - 0.20;
    cil('WPM1', 0.17, 0.17, 0.20, 'pintura', '#1E5AA8', xb, P.YB - 0.22, 0, [Math.PI / 2, 0, 0], 26);
    cil('PYM', 0.08, 0.08, 0.22, 'metal', RMD_GRIS, xb, P.YB - 0.22, 0.20, [Math.PI / 2, 0, 0], 16);
    tubo(null, [x1 - 0.20, yc - b + 0.10, 0], [xb, P.YB - 0.08, 0], 0.07, 'metal', '#8E959C', 14);
    var xf = P.XFin + 0.26, yfl = 0.50;
    tubo(null, [xb + 0.12, P.YB - 0.22, 0], [xf, yfl + 0.08, 0], 0.05, 'metal', '#8E959C', 12);
    tubo(null, [xf, yfl, -1.05], [xf, yfl, 1.05], 0.05, 'metal', '#8E959C', 14);
    [-0.95, -0.32, 0.32, 0.95].forEach(function(z){
      bl(null, 0.10, 0.07, 0.20, 'metal', '#5E656D', xf + 0.04, yfl - 0.05, z, 0.02, [0, 0, -0.5]);
      cil(null, 0.04, 0.04, 0.14, 'pintura', '#E0B21A', xf - 0.02, yfl + 0.11, z, null, 12);
    });
    /* cañon monitor arriba atras y la toma de llenado arriba adelante */
    cil(null, 0.05, 0.05, 0.36, 'metal', '#8E959C', x1 - 0.35, ytop + 0.26, 0, null, 14);
    tubo(null, [x1 - 0.35, ytop + 0.42, 0], [x1 + 0.20, ytop + 0.52, 0], 0.045, 'metal', '#8E959C', 12);
    cil(null, 0.03, 0.05, 0.16, 'metal', '#5E656D', x1 + 0.26, ytop + 0.54, 0, [0, 0, Math.PI / 2 + 0.18], 12);
    tubo(null, [x0 + 0.40, ytop + 0.02, 0.45], [x0 + 0.40, ytop + 0.25, 0.45], 0.06, 'metal', '#8E959C', 12);
    cil(null, 0.08, 0.08, 0.04, 'pintura', '#E0B21A', x0 + 0.40, ytop + 0.27, 0.45, null, 16);
    bl('TQH1', 0.40, 0.42, 0.36, 'pintura', '#26292D', P.xCuerpo + 0.05, YR + 0.25, -0.70, 0.04);
  }
  /* guardafangos planos sobre las duales */
  [-1, 1].forEach(function(s){
    var xg0 = P.XT - P.R - 0.12, xg1 = P.XT + P.R + 0.12;
    bl(null, xg1 - xg0, 0.025, P.sep + P.A + 0.10, 'mate', RMD_PLAST, (xg0 + xg1) / 2, 2 * P.R + 0.10, s * (P.ZO + P.ZI) / 2, 0.01);
    bl(null, 0.04, 2 * P.R + 0.10 - YR + 0.04, 0.04, 'pintura', RMD_CHASIS, P.XT, (2 * P.R + 0.10 + YR) / 2, s * (P.ZR + 0.15), 0.01);
  });
}

/* ═══ CUERPO: furgon cerrado MATPEL (materiales peligrosos) ═══ */
function rmdFurgon(C){
  var D = C.D, P = C.P, bl = D.bloque, tubo = D.tubo, cil = D.cilindro, G = C.G;
  var x0 = P.xCuerpo, x1 = P.XFin + 0.25, ZB = 1.05, yP = P.YR + 0.16, yT = yP + 2.05;
  var BL = '#F2F3F1', PER = '#C9CED3';
  /* travesanos del falso chasis bajo el piso */
  [-1, 1].forEach(function(s){ bl(null, x1 - x0, 0.12, 0.10, 'pintura', RMD_CHASIS, (x0 + x1) / 2, P.YR + 0.06, s * P.ZR, 0.02); });
  var trv = [];
  for(var t = 0; t < 9; t++) trv.push([x0 + 0.15 + t * (x1 - x0 - 0.3) / 8, yP - 0.05, 0]);
  rmdInst(D, null, new THREE.BoxGeometry(0.08, 0.08, ZB * 2 - 0.06), 'pintura', RMD_CHASIS, trv);
  /* caja: paneles lisos con perfiles de aluminio en las esquinas y la cumbrera */
  bl(null, x1 - x0, yT - yP, ZB * 2, 'pintura', BL, (x0 + x1) / 2, (yP + yT) / 2, 0, 0.03);
  [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function(q){
    var x = q[0] < 0 ? x0 : x1, z = q[1] * ZB;
    bl(null, 0.07, yT - yP + 0.02, 0.07, 'metal', PER, x, (yP + yT) / 2, z, 0.015);
  });
  [-1, 1].forEach(function(s){
    bl(null, x1 - x0 + 0.06, 0.07, 0.07, 'metal', PER, (x0 + x1) / 2, yT, s * ZB, 0.015);
    bl(null, x1 - x0 + 0.06, 0.09, 0.07, 'metal', PER, (x0 + x1) / 2, yP, s * ZB, 0.015);
  });
  bl(null, 0.07, 0.07, ZB * 2, 'metal', PER, x0, yT, 0, 0.015);
  /* uniones de los paneles laterales */
  var cost = [];
  for(var k = 1; k < 5; k++){ var xk = x0 + k * (x1 - x0) / 5; cost.push([xk, (yP + yT) / 2, ZB + 0.004]); cost.push([xk, (yP + yT) / 2, -ZB - 0.004]); }
  rmdInst(D, null, new THREE.BoxGeometry(0.035, yT - yP - 0.06, 0.012), 'metal', '#B9BEC4', cost);
  /* puertas traseras: dos hojas, bisagras, barras de cierre y manijas */
  var xp = x1 + 0.036;
  bl(null, 0.012, yT - yP - 0.10, 0.012, 'mate', '#6E747A', xp, (yP + yT) / 2, 0, 0.004);
  [-1, 1].forEach(function(s){
    for(var h = 0; h < 4; h++) bl(null, 0.04, 0.10, 0.06, 'metal', '#7E848A', xp, yP + 0.20 + h * (yT - yP - 0.40) / 3, s * (ZB - 0.04), 0.01);
    [0.30, 0.68].forEach(function(f){
      var zb = s * ZB * f;
      cil(null, 0.018, 0.018, yT - yP - 0.14, 'metal', '#C9CED3', xp + 0.03, (yP + yT) / 2, zb, null, 10);
      [yP + 0.10, yT - 0.10].forEach(function(y){ bl(null, 0.05, 0.06, 0.06, 'metal', '#7E848A', xp + 0.02, y, zb, 0.01); });
      bl(null, 0.04, 0.03, 0.22, 'metal', '#C9CED3', xp + 0.06, yP + 0.95, zb - s * 0.10, 0.008);
    });
  });
  /* luces de galibo arriba, adelante ambar y atras rojas */
  [-1, 1].forEach(function(s){
    rmdLuz(D, 'LSM', 0.05, 0.07, 0.03, '#F0A41C', x0 + 0.10, yT - 0.06, s * (ZB + 0.04), 0.5);
    rmdLuz(D, 'LSM', 0.03, 0.07, 0.08, '#C2241B', x1 + 0.05, yT - 0.06, s * (ZB - 0.10), 0.5);
    for(var g = 1; g <= 3; g++) rmdLuz(D, 'LSM', 0.06, 0.04, 0.02, '#F0A41C', x0 + g * (x1 - x0) / 4, yP + 0.08, s * (ZB + 0.04), 0.4);
  });
  /* rombos de clase 1 (explosivos), panel ONU y MATERIALES PELIGROSOS */
  var texR = rmdTexRombo('#F07A13', '1.1D', '1', '#111111', false), texU = rmdTexONU(null, '0081');
  var texM = rmdTexLetras('MATERIALES PELIGROSOS', null, '#C3161B', 1024, 90);
  var texX = rmdTexLetras('EXPLOSIVOS', null, '#111111', 1024, 110, null, true);
  [-1, 1].forEach(function(s){
    var zt = s * (ZB + 0.006), ry = s > 0 ? 0 : Math.PI;
    rmdPlano(G, texR, 0.50, 0.50, x0 + 0.70, (yP + yT) / 2 + 0.25, zt, ry, true);
    rmdPlano(G, texU, 0.42, 0.20, x0 + 0.70, (yP + yT) / 2 - 0.25, zt, ry, false);
    rmdPlano(G, texM, 2.40, 0.21, (x0 + x1) / 2 + 0.45, yT - 0.42, zt, ry, true);
    rmdPlano(G, texX, 1.60, 0.20, (x0 + x1) / 2 + 0.45, yT - 0.70, zt, ry, true);
    rmdPlano(G, C.texNumC, 0.90, 0.28, x1 - 0.60, yP + 0.40, zt, ry, true);
    /* cinta reflectiva roja y blanca abajo */
    for(var c = 0; c < 10; c++) bl(null, 0.20, 0.05, 0.008, 'mate', c % 2 ? '#F2F2F2' : '#C62A1E', x0 + 0.25 + c * (x1 - x0 - 0.5) / 9, yP + 0.14, s * (ZB + 0.006), 0.003);
  });
  rmdPlano(G, texR, 0.50, 0.50, xp + 0.012, (yP + yT) / 2 + 0.35, -ZB * 0.62, Math.PI / 2, true);
  rmdPlano(G, texU, 0.42, 0.20, xp + 0.012, (yP + yT) / 2 + 0.35, ZB * 0.62, Math.PI / 2, false);
  rmdPlano(G, texR, 0.50, 0.50, x0 - 0.002, yT - 0.40, ZB * 0.55, -Math.PI / 2, true);
  /* caja de herramientas, conos y extintores bajo la caja */
  bl(null, 0.62, 0.40, 0.40, 'metal', '#9AA0A6', P.XT - P.R - 0.55, P.YB - 0.06, ZB - 0.22, 0.03);
  [-1, 1].forEach(function(s){
    cil('SCI', 0.07, 0.07, 0.42, 'pintura', '#C3161B', x0 + 0.30, P.YB - 0.10, s * (P.ZR + 0.40), null, 16);
    bl(null, 0.16, 0.50, 0.04, 'pintura', RMD_CHASIS, x0 + 0.30, P.YB - 0.06, s * (P.ZR + 0.32), 0.01);
  });
  /* tacos de rueda colgados y guardafangos sobre las duales */
  [-1, 1].forEach(function(s){
    var xg0 = P.XT - P.R - 0.10, xg1 = P.XT + P.R + 0.10;
    bl(null, xg1 - xg0, 0.025, P.sep + P.A + 0.10, 'mate', RMD_PLAST, (xg0 + xg1) / 2, Math.min(2 * P.R + 0.08, yP - 0.10), s * (P.ZO + P.ZI) / 2, 0.01);
  });
  bl(null, 0.20, 0.12, 0.10, 'mate', '#E0B21A', P.XT + P.R + 0.40, P.YB - 0.08, -(P.ZR + 0.12), 0.02);
}

/* ═══ CUERPO: equipo de ANFO del Canter: tolva de inoxidable con fondo en V,
   tornillo de descarga, pluma de carga y tanque de petroleo ═══ */
function rmdAnfo(C){
  var D = C.D, P = C.P, bl = D.bloque, tubo = D.tubo, cil = D.cilindro, G = C.G;
  var YR = P.YR, XB0 = P.xCuerpo, XB1 = P.XFin, YD = YR + 0.14, ZW = 1.02;
  /* plataforma de plancha estriada con cinta reflectiva */
  bl(null, XB1 - XB0, 0.10, ZW * 2, 'metal', '#5A6067', (XB0 + XB1) / 2, YR + 0.06, 0, 0.02);
  for(var c = 0; c < 10; c++){
    [-1, 1].forEach(function(s){ bl(null, 0.16, 0.05, 0.01, 'mate', c % 2 ? '#F2F2F2' : '#C62A1E', XB0 + 0.20 + c * (XB1 - XB0 - 0.4) / 9, YR + 0.06, s * (ZW + 0.005), 0.003); });
  }
  /* tolva de nitrato: fondo en V y paredes rectas con nervios */
  var TX0 = XB0 + 0.55, TX1 = XB1 - 0.70, YV = YD + 0.55, YT = YD + 1.55;
  var tolvaV = new THREE.Shape();
  [[-0.22, YD + 0.06], [0.22, YD + 0.06], [0.92, YV], [-0.92, YV]].forEach(function(p, k){ k ? tolvaV.lineTo(p[0], p[1]) : tolvaV.moveTo(p[0], p[1]); });
  var gV = new THREE.ExtrudeGeometry(tolvaV, { depth: TX1 - TX0, bevelEnabled: false });
  gV.rotateY(Math.PI / 2); gV.translate(TX0, 0, 0);
  D.pon('TLV', gV, 'metal', RMD_INOX);
  bl('TLV', TX1 - TX0, YT - YV, 1.84, 'metal', RMD_INOX, (TX0 + TX1) / 2, (YV + YT) / 2, 0, 0.04);
  bl(null, TX1 - TX0 + 0.08, 0.07, 1.92, 'metal', '#A7AEB5', (TX0 + TX1) / 2, YT, 0, 0.02);
  var nerv = [];
  for(var n = 0; n <= 5; n++){
    var xn = TX0 + 0.06 + n * (TX1 - TX0 - 0.12) / 5;
    nerv.push([xn, (YV + YT) / 2, 0.935]); nerv.push([xn, (YV + YT) / 2, -0.935]);
  }
  rmdInst(D, null, new THREE.BoxGeometry(0.06, YT - YV, 0.04), 'metal', '#9EA5AD', nerv);
  /* tapas de la tolva y su rejilla */
  [0.28, 0.72].forEach(function(f){ bl(null, 0.62, 0.04, 0.62, 'metal', '#A7AEB5', TX0 + f * (TX1 - TX0), YT + 0.05, -0.38, 0.02); });
  /* tornillo de descarga bajo la V que sale atras y sube por la columna */
  cil(null, 0.11, 0.11, TX1 - TX0 + 0.40, 'metal', '#8A9097', (TX0 + TX1) / 2 + 0.20, YD + 0.06, 0, [0, 0, Math.PI / 2], 16);
  var XCOL = TX1 + 0.32, ZCOL = -0.62, YCOL = YT + 0.45;
  cil(null, 0.13, 0.13, YCOL - YD, 'metal', '#8A9097', XCOL, (YD + YCOL) / 2, ZCOL, null, 18);
  bl('PYM', 0.30, 0.26, 0.30, 'pintura', '#26292D', XCOL, YCOL, ZCOL, 0.03);
  /* pluma de carga apoyada sobre la tolva, con su soporte */
  tubo(null, [XCOL, YCOL + 0.04, ZCOL], [TX0 + 0.05, YT + 0.30, ZCOL], 0.11, 'metal', '#8A9097', 16);
  bl(null, 0.26, 0.26, 0.26, 'pintura', '#26292D', TX0 + 0.05, YT + 0.26, ZCOL, 0.03);
  tubo(null, [TX0 + 0.05, YT + 0.02, ZCOL], [TX0 + 0.05, YT + 0.14, ZCOL], 0.04, 'metal', '#5A6067', 10);
  D.cilHidD('PHY', [XCOL - 0.08, YT - 0.35, ZCOL + 0.18], [XCOL - 0.60, YT + 0.25, ZCOL + 0.06], 0.04, '#26292D', 0.55);
  /* manguera de carga colgando atras */
  tubo(null, [XCOL + 0.08, YCOL - 0.18, ZCOL], [XB1 + 0.12, YD + 0.35, ZCOL], 0.05, 'goma', '#16181B', 10);
  tubo(null, [XB1 + 0.12, YD + 0.35, ZCOL], [XB1 + 0.18, 0.45, ZCOL - 0.12], 0.05, 'goma', '#16181B', 10);
  /* tanque de petroleo para la mezcla, adelante a la izquierda sobre la plataforma */
  cil(null, 0.26, 0.26, 0.42, 'pintura', '#E8EAEC', XB0 + 0.25, YD + 0.40, 0.62, null, 24);
  cil(null, 0.06, 0.06, 0.06, 'mate', RMD_NEGRO, XB0 + 0.25, YD + 0.64, 0.62, null, 12);
  /* tanque hidraulico, bomba en la toma de fuerza y tablero */
  bl('TQH1', 0.36, 0.55, 0.42, 'pintura', '#26292D', XB0 + 0.22, YD + 0.28, -0.62, 0.04);
  bl('PTB1', 0.22, 0.18, 0.18, 'metal', RMD_GRIS2, P.XD + 0.95, P.YB - 0.12, -0.20, 0.02);
  cil('PYM', 0.075, 0.075, 0.22, 'metal', RMD_GRIS2, P.XD + 1.15, P.YB - 0.12, -0.20, [0, 0, Math.PI / 2], 14);
  tubo('LPH', [P.XD + 1.28, P.YB - 0.10, -0.20], [XB0 + 0.22, YD + 0.06, -0.48], 0.022, 'goma', '#1A1C1F', 8);
  bl('TAB', 0.24, 0.50, 0.40, 'metal', RMD_INOX, XB1 - 0.14, YD + 0.35, 0.62, 0.03);
  bl(null, 0.01, 0.34, 0.30, 'mate', '#2A2D31', XB1 - 0.015, YD + 0.38, 0.62, 0.004);
  /* escalera adelante a la izquierda y baranda arriba */
  D.escalera(TX0 - 0.16, 0.80, YD, YT + 0.04, 0.36, '#C4C9CE', '#8A9097');
  D.baranda([[TX0 + 0.08, 0.90], [TX1 - 0.05, 0.90]], YT + 0.03, 0.80, '#C4C9CE');
  /* rombos 1.5D, panel 0331 y EXPLOSIVOS */
  var texR = rmdTexRombo('#F07A13', '1.5D', '1', '#111111', false), texU = rmdTexONU(null, '0331');
  var texE = rmdTexLetras('EXPLOSIVOS', '#B9BFC5', '#C3161B', 1024, 110, null, true);
  [-1, 1].forEach(function(s){
    var zt = s * 0.958, ry = s > 0 ? 0 : Math.PI;
    rmdPlano(G, texR, 0.48, 0.48, (TX0 + TX1) / 2 - 0.30, (YV + YT) / 2 + 0.08, zt, ry, true);
    rmdPlano(G, texU, 0.40, 0.20, (TX0 + TX1) / 2 + 0.42, (YV + YT) / 2 + 0.08, zt, ry, false);
    rmdPlano(G, texE, 1.30, 0.15, (TX0 + TX1) / 2, YV + 0.10, zt, ry, false);
    rmdPlano(G, C.texNumC, 0.70, 0.22, (TX0 + TX1) / 2, YT - 0.18, zt, ry, true);
  });
  rmdPlano(G, texR, 0.48, 0.48, TX1 + 0.004, (YV + YT) / 2, 0.30, Math.PI / 2, true);
  /* extintores (obligatorios con explosivos) y guardafangos */
  [-1, 1].forEach(function(s){
    cil('SCI', 0.07, 0.07, 0.42, 'pintura', '#C3161B', XB0 + 0.10, P.YB - 0.10, s * (P.ZR + 0.40), null, 16);
    var xg0 = P.XT - P.R - 0.10, xg1 = P.XT + P.R + 0.10;
    bl(null, xg1 - xg0, 0.025, P.sep + P.A + 0.10, 'mate', RMD_PLAST, (xg0 + xg1) / 2, 2 * P.R + 0.08, s * (P.ZO + P.ZI) / 2, 0.01);
  });
}

/* ═══ armado ═══ */
function rmdConstruir(clave, piezas){
  var q = String(clave).split('|'), cfg = RMD_CFG[q[1]], cuerpo = q[2];
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var P = rmdMedidas(cfg);
  var C = { G: G, D: D, P: P, cfg: cfg, cuerpo: cuerpo, piezas: piezas };
  C.texNumC = texNumero3d(null, '#1A1C1F');
  rmdChasis(C);
  if(cfg.conv){ rmdCapoFL(C); rmdCabinaFL(C); }
  else {
    rmdCabinaAvanzada(C);
    if(cfg.marca === 'hino5') rmdFrenteHino5(C);
    else if(cfg.marca === 'hino3') rmdFrenteHino3(C);
    else if(cfg.marca === 'fuso') rmdFrenteFuso(C);
    else rmdFrenteVW(C);
  }
  rmdEquipChasis(C);
  if(cuerpo === 'AGUA') rmdCisterna(C, true);
  else if(cuerpo === 'COMB') rmdCisterna(C, false);
  else if(cuerpo === 'MATPEL') rmdFurgon(C);
  else rmdAnfo(C);

  /* ═══ llantas: delanteras sencillas, traseras duales ═══ */
  rmdRueda(C, 'LL1', P.XD, P.ZD, 1, false);
  rmdRueda(C, 'LL2', P.XD, -P.ZD, -1, false);
  rmdRueda(C, 'LL3', P.XT, P.ZO, 1, true);
  rmdRueda(C, 'LL4', P.XT, P.ZI, 0, true);
  rmdRueda(C, 'LL5', P.XT, -P.ZI, 0, true);
  rmdRueda(C, 'LL6', P.XT, -P.ZO, -1, true);

  /* centrar el camion en X para que el estudio gire alrededor de su medio */
  var caja = new THREE.Box3().setFromObject(G);
  var xc = (caja.min.x + caja.max.x) / 2;
  G.children.forEach(function(m){ m.position.x -= xc; });
  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ C.texNum.userData.poner(id); C.texNumC.userData.poner(id); };
  G.userData.mirarY = cfg.R > 0.45 ? 1.50 : 1.25;
  G.userData.dist = cfg.R > 0.45 ? 17 : 15;
  G.userData.modelo = cfg.nombre;
  return G;
}

registrarModelo3d({
  nombre: 'Camiones medianos de ruta: Freightliner M2 106, Hino FC y Dutro, VW Worker 17.220, Fuso Canter',
  clave: rmdClave,
  construir: function(e, piezas, clave){ return rmdConstruir(clave, piezas); }
});
