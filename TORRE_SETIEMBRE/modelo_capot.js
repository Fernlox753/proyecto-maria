/* ══════════════════════════════════════════════════════════════════
   CAMIONES DE CAPOT LARGO (convencionales) — modelos de detalle

     Kenworth T800 ............ TV-34, TV-35   CAMION PARA ANFO
     Mack Granite ............. TV-384-AL      CAMION PARA ANFO
     Mack Granite GU813E ...... TV-330-AL      CAMION PARA ANFO
     International 5600i 6x4 .. TV-327-AL      CAMION PARA ANFO
     International 7600 SBA 8x4 R-218-AL       CAMA BAJA (tracto + semirremolque cama baja)

   Un solo sistema para todos: chasis de largueros, ejes, muelles, tren
   motriz, cabina convencional, espejos, escape, tanques y llantas son
   comunes; cada marca pone su frente (capot, parrilla, guardafangos, faros,
   parachoques y emblemas) y cada clasificacion su cuerpo.

   Medidas (m):
   · Kenworth T800 — Body Builder Manual de Kenworth (08/12), seccion 3:
     parachoques a eje delantero 1.232 (48.5"), eje a espalda de cabina
     1.882 (74.1"), BBC 3.114 (122.6"), cabina 1.834 de ancho y techo a
     2.083 sobre el bajo del bastidor, trocha delantera 2.101 (82.7"),
     duales con centros a 1.900 (74.8") y 2.502 sobre llantas (98.5"),
     tandem 1.321. Batalla 5.60 supuesta (la tipica de un cuerpo de ANFO).
   · Mack Granite GU813 (eje atras) — BBC 117.5" (2.985) segun Mack
     (macktrucks.com, Granite; la nueva generacion bajo a 113.5"); llantas
     11R24.5 (ritchiespecs GU813). Batalla 5.40 y tandem 52" supuestos.
   · International 5600i SBA 6x4 — ritchiespecs: largo 22.5 ft con batalla
     163.6", eje trasero a punta de bastidor 54", espalda de cabina a punta
     156" => parachoques a eje 1.33 y BBC 2.885 (113.6"); tandem 56".
     Batalla 5.08 (200", una de las de fabrica) para el cuerpo de ANFO.
   · International 7600 SBA (WorkStar) — ficha de International Camiones
     del Peru (proposal 27209-01): cabina extendida, largo de cabina 133"
     (BBC 3.38), batalla 197" en 6x4, 11R22.5, tanques redondos de 26",
     quinta rueda Fontaine fija, tandem de 55". El 8x4 agrega un segundo
     eje direccional a 1.52 m (supuesto) y la batalla se lleva a 6.0 m.
   Lo que no esta acotado (capot, guardafangos, alturas del frente, ancho
   de cabina de Mack e International) sale de las fotos y del dibujo del T800.

   «Cama baja» es el semirremolque de plataforma rebajada para mover
   maquinaria: el equipo R-218-AL es el tracto 8x4 (sus llantas LL1..LL12
   son las 12 del tracto), pero se dibuja enganchado a una cama baja de
   cuello fijo y tres ejes, porque asi trabaja y asi lo reconoce cualquiera.
   Las llantas del semirremolque no llevan codigo (SAP no las numera).

   Colores (supuestos, de las fotos): T800 rojo Kenworth, Granite guinda
   (como los camiones de explosivos de la foto), GU813E blanco, 5600i
   amarillo International, 7600 rojo de la ficha. Tolva de ANFO de acero
   inoxidable con rombos naranjas 1.5D y placa UN 0331.

   Ejes: frente hacia -X, arriba +Y, izquierda del operador +Z.
   ══════════════════════════════════════════════════════════════════ */
var CAP_CROMO = '#DCE1E6', CAP_NEGRO = '#16181B', CAP_GRIS = '#3C434B', CAP_GRIS2 = '#5A626B',
    CAP_INOX = '#C3C9CF', CAP_ALU = '#C9CED3', CAP_VIDRIO = '#1B2836';

/* medidas por modelo (ver la cabecera). bf: parachoques a eje delantero; bbc:
   parachoques a espalda de cabina; cab: largo de cabina; wb: batalla al centro
   del tandem; tan: entre ejes del tandem; eof: tandem a punta de bastidor;
   cw: media cabina; techo: techo sobre el bajo del bastidor; capo: altura del
   capot junto a la cabina; rake: cuanto se acuesta el parabrisas */
var CAP_CFG = {
  T800:    { nombre: 'Kenworth T800', marca: 'kw', bf: 1.232, bbc: 3.114, cab: 1.414, wb: 5.60, tan: 1.321, eof: 1.55,
             cw: 0.917, techo: 2.083, capo: 2.12, rake: 0.22, puerta: 1.00, rl: 0.527, al: 0.28, rAro: 0.286,
             trD: 2.101, trI: 1.900, sobre: 2.502, color: '#780D09', color2: '#520906', tinta: '#FFFFFF', escape: -1, aro: '#D5D9DD' },
  GRANITE: { nombre: 'Mack Granite', marca: 'mack', nuevo: true, bf: 1.22, bbc: 2.985, cab: 1.50, wb: 5.40, tan: 1.32, eof: 1.55,
             cw: 0.99, techo: 2.20, capo: 2.16, rake: 0.34, puerta: 1.05, rl: 0.553, al: 0.28, rAro: 0.311,
             trD: 2.08, trI: 1.86, sobre: 2.49, color: '#5A0E10', color2: '#3E0A0B', tinta: '#FFFFFF', escape: -1, aro: '#C8CDD2' },
  GU813E:  { nombre: 'Mack Granite GU813E', marca: 'mack', nuevo: false, bf: 1.22, bbc: 2.985, cab: 1.50, wb: 5.40, tan: 1.32, eof: 1.55,
             cw: 0.99, techo: 2.20, capo: 2.16, rake: 0.34, puerta: 1.05, rl: 0.553, al: 0.28, rAro: 0.311,
             trD: 2.08, trI: 1.86, sobre: 2.49, color: '#E9E8E2', color2: '#B9B8B2', tinta: '#1A1C20', escape: -1, aro: '#C8CDD2' },
  I5600:   { nombre: 'International 5600i 6x4', marca: 'i56', bf: 1.33, bbc: 2.885, cab: 1.45, wb: 5.08, tan: 1.42, eof: 1.40,
             cw: 0.99, techo: 2.15, capo: 2.10, rake: 0.20, puerta: 1.00, rl: 0.527, al: 0.28, rAro: 0.286,
             trD: 2.08, trI: 1.86, sobre: 2.48, color: '#D98A0C', color2: '#A86A08', tinta: '#16181B', escape: -1, aro: '#E8E8E4' },
  I7600:   { nombre: 'International 7600 SBA 8x4', marca: 'i76', bf: 1.25, bbc: 3.38, cab: 1.95, eje2: 1.52, wb: 6.00, tan: 1.40, eof: 1.15,
             cw: 1.015, techo: 2.25, capo: 2.20, rake: 0.36, puerta: 1.05, rl: 0.527, al: 0.28, rAro: 0.286,
             trD: 2.08, trI: 1.86, sobre: 2.48, color: '#86100F', color2: '#5C0B0B', tinta: '#FFFFFF', escape: 1, aro: '#D5D9DD' }
};
/* cama baja: del perno rey a la cola */
var CAP_CB = { largo: 12.6, ancho: 3.00, piso: 0.86, cola: 1.18, r: 0.40, al: 0.235, rAro: 0.222 };

/* ═══ utilidades de geometria ═══ */

/* seccion (z,y) de un capot: costados que se recogen hacia arriba, cantos
   redondeados y una comba en el techo; abierta por abajo */
function capSeccion(hw, hwT, y0, y1, r, comba){
  var pts = [[hw, y0]], nA = 4, nC = 4, i, a, zc = hwT - r;
  for(i = 0; i <= nA; i++){ a = i / nA * Math.PI / 2; pts.push([zc + r * Math.cos(a), y1 - r + r * Math.sin(a)]); }
  for(i = 1; i < nC; i++){ var z = zc - i / nC * 2 * zc; pts.push([z, y1 + comba * (1 - Math.pow(z / zc, 2))]); }
  for(i = nA; i >= 0; i--){ a = i / nA * Math.PI / 2; pts.push([-(zc + r * Math.cos(a)), y1 - r + r * Math.sin(a)]); }
  pts.push([-hw, y0]);
  return pts;
}
/* superficie que une secciones a lo largo de X (todas con el mismo numero de puntos) */
function capLoft(secs){
  var m = secs[0].pts.length, pos = [], idx = [], i, j;
  secs.forEach(function(s){ s.pts.forEach(function(p){ pos.push(s.x, p[1], p[0]); }); });
  for(i = 0; i < secs.length - 1; i++) for(j = 0; j < m - 1; j++){
    var a = i * m + j, b = a + 1, c = a + m, d = c + 1;
    idx.push(a, b, c, b, d, c);
  }
  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
/* tapa plana de una seccion (abanico desde el centro) */
function capTapa(s){
  var m = s.pts.length, cz = 0, cy = 0, pos = [], idx = [], j;
  s.pts.forEach(function(p){ cz += p[0]; cy += p[1]; });
  pos.push(s.x, cy / m, cz / m);
  s.pts.forEach(function(p){ pos.push(s.x, p[1], p[0]); });
  for(j = 1; j < m; j++) idx.push(0, j, j + 1);
  idx.push(0, m, 1);
  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}
/* puntos de un arco (x,y) */
function capArco(cx, cy, r, a0, a1, n){
  var p = [];
  for(var i = 0; i <= n; i++){ var a = a0 + (a1 - a0) * i / n; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return p;
}
/* muchas piezas iguales en una sola malla: lista de [x,y,z, rx,ry,rz] */
function capInst(D, code, geo, tipo, hex, lista){
  var im = new THREE.InstancedMesh(geo, D.M[tipo](hex), lista.length), o = new THREE.Object3D();
  lista.forEach(function(q, i){
    o.position.set(q[0], q[1], q[2]); o.rotation.set(q[3] || 0, q[4] || 0, q[5] || 0); o.updateMatrix();
    im.setMatrixAt(i, o.matrix);
  });
  im.instanceMatrix.needsUpdate = true;
  return D.reg(code, im, hex);
}
/* letrero con transparencia (letras sueltas, rombos) */
function capCartel(G, tex, w, h, x, y, z, ry, rz){
  var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.04, roughness: 0.42, metalness: 0.15 }));
  m.position.set(x, y, z); m.rotation.set(0, ry || 0, rz || 0);
  G.add(m);
  return m;
}
/* pieza con textura propia (rejillas, plancha diamantada, madera) */
function capConTex(D, code, geo, tex, hex, rug, met, x, y, z, rot, transp){
  var mat = new THREE.MeshStandardMaterial({ map: tex, color: new THREE.Color(hex), roughness: rug, metalness: met });
  if(transp){ mat.transparent = true; mat.alphaTest = 0.3; mat.side = THREE.DoubleSide; }
  mat.envMapIntensity = 0.9;
  var m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  if(rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
  return D.reg(code, m, hex);
}
/* hojas de muelle apiladas: la maestra arriba; curv > 0 sube las puntas */
function capMuelle(D, code, xc, yTop, largo, n, z, ancho, curv, hex){
  for(var k = 0; k < n; k++){
    var L = largo * (1 - k * 0.15), e = 0.024, y0 = yTop - k * e, pts = [], i, x, N = 8;
    for(i = 0; i <= N; i++){ x = -L / 2 + L * i / N; pts.push([xc + x, y0 + curv * Math.pow(2 * x / largo, 2)]); }
    for(i = N; i >= 0; i--){ x = -L / 2 + L * i / N; pts.push([xc + x, y0 - e + 0.002 + curv * Math.pow(2 * x / largo, 2)]); }
    D.perfil(code, pts, ancho, z, 'metal', hex || '#2E3238', 0.004);
  }
}

/* ═══ lienzos ═══ */

/* malla de alambre de la parrilla: transparente entre los alambres, asi se
   ve el condensador detras (y su costo en el mapa de calor) */
function capTexMalla(paso){
  return texRotulo3d(function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 5;
    for(var i = -h; i < w + h; i += paso){
      g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke();
      g.beginPath(); g.moveTo(i, h); g.lineTo(i + h, 0); g.stroke();
    }
  }, 256, 256);
}
function capTexPerforado(){
  var t = texRotulo3d(function(g, w, h){
    g.fillStyle = '#C8CDD2'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2A2E33';
    for(var y = 6; y < h; y += 14) for(var x = (y / 14 % 2) * 7 + 6; x < w; x += 14){ g.beginPath(); g.arc(x, y, 3.6, 0, Math.PI * 2); g.fill(); }
  }, 128, 128);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 6);
  return t;
}
function capTexDiamante(){
  var t = texRotulo3d(function(g, w, h){
    g.fillStyle = '#9EA4AA'; g.fillRect(0, 0, w, h);
    for(var y = 0; y < h; y += 16) for(var x = (y / 16 % 2) * 8; x < w; x += 16){
      g.save(); g.translate(x + 4, y + 8); g.rotate(y / 16 % 2 ? 0.8 : -0.8);
      g.fillStyle = '#D9DDE1'; g.fillRect(-5, -1.6, 10, 3.2);
      g.fillStyle = '#6E747A'; g.fillRect(-5, 1.6, 10, 1.2);
      g.restore();
    }
  }, 128, 128);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 4);
  return t;
}
function capTexMadera(){
  var t = texRotulo3d(function(g, w, h){
    for(var i = 0; i < 8; i++){
      var y = i * h / 8;
      g.fillStyle = ['#6B4A2E', '#7A5634', '#5E4128', '#73502F'][i % 4]; g.fillRect(0, y, w, h / 8);
      g.fillStyle = 'rgba(0,0,0,0.45)'; g.fillRect(0, y, w, 2);
      g.fillStyle = 'rgba(255,255,255,0.06)';
      for(var k = 0; k < 6; k++) g.fillRect(0, y + 5 + k * 4, w, 1);
    }
  }, 256, 256);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
/* rombo naranja de explosivos clase 1.5D */
function capTexRombo(){
  return texRotulo3d(function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.beginPath(); g.moveTo(w / 2, 3); g.lineTo(w - 3, h / 2); g.lineTo(w / 2, h - 3); g.lineTo(3, h / 2); g.closePath();
    g.fillStyle = '#F07A13'; g.fill();
    g.beginPath(); g.moveTo(w / 2, 16); g.lineTo(w - 16, h / 2); g.lineTo(w / 2, h - 16); g.lineTo(16, h / 2); g.closePath();
    g.strokeStyle = '#111'; g.lineWidth = 4; g.stroke();
    g.fillStyle = '#111'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.22) + 'px Arial, sans-serif'; g.fillText('1.5', w / 2, h * 0.40);
    g.font = 'bold ' + Math.round(h * 0.17) + 'px Arial, sans-serif'; g.fillText('D', w / 2, h * 0.60);
    g.font = 'bold ' + Math.round(h * 0.10) + 'px Arial, sans-serif'; g.fillText('1', w / 2, h * 0.83);
  }, 256, 256);
}
/* placa naranja con el numero ONU */
function capTexUN(num){
  return texRotulo3d(function(g, w, h){
    g.fillStyle = '#F07A13'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#111'; g.lineWidth = 8; g.strokeRect(4, 4, w - 8, h - 8);
    g.fillStyle = '#111'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.64) + 'px Arial, sans-serif'; g.fillText(num, w / 2, h * 0.54);
  }, 256, 100);
}
/* texto suelto sobre fondo transparente (emblemas, nombres de modelo) */
function capTexTexto(txt, tinta, fuente, w, h, sombra){
  return texRotulo3d(function(g, W, H){
    g.clearRect(0, 0, W, H);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = fuente.replace('#', Math.round(H * 0.72));
    if(sombra){ g.fillStyle = sombra; g.fillText(txt, W / 2 + 2, H * 0.54 + 2, W * 0.96); }
    g.fillStyle = tinta; g.fillText(txt, W / 2, H * 0.54, W * 0.96);
  }, w, h);
}
/* el emblema KW: escudo cromado con fondo rojo y las letras */
function capTexKW(){
  return texRotulo3d(function(g, w, h){
    g.clearRect(0, 0, w, h);
    var esc = function(m){ g.beginPath(); g.moveTo(m, h * 0.10 + m); g.quadraticCurveTo(w / 2, -h * 0.02 + m, w - m, h * 0.10 + m);
      g.lineTo(w - m - w * 0.06, h * 0.80 - m); g.quadraticCurveTo(w / 2, h + m * 0.2 - m, m + w * 0.06, h * 0.80 - m); g.closePath(); };
    esc(2); g.fillStyle = '#E2E6EA'; g.fill();
    esc(12); g.fillStyle = '#B5171B'; g.fill();
    g.fillStyle = '#F4F4F4'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.52) + 'px Georgia, "Times New Roman", serif';
    g.fillText('KW', w / 2, h * 0.47);
  }, 128, 128);
}
/* el diamante de International: rombo negro con la I naranja y el nombre */
function capTexDiamanteIH(){
  return texRotulo3d(function(g, w, h){
    g.clearRect(0, 0, w, h);
    var rombo = function(m){ g.beginPath(); g.moveTo(w / 2, m); g.lineTo(w - m, h / 2); g.lineTo(w / 2, h - m); g.lineTo(m, h / 2); g.closePath(); };
    rombo(2); g.fillStyle = '#D9DDE1'; g.fill();
    rombo(10); g.fillStyle = '#1A1A1A'; g.fill();
    g.fillStyle = '#F07A13';
    g.beginPath(); g.moveTo(w / 2, h * 0.16); g.lineTo(w * 0.70, h * 0.36); g.lineTo(w * 0.30, h * 0.36); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(w / 2, h * 0.84); g.lineTo(w * 0.70, h * 0.64); g.lineTo(w * 0.30, h * 0.64); g.closePath(); g.fill();
    g.fillStyle = '#FFFFFF'; g.fillRect(w * 0.12, h * 0.42, w * 0.76, h * 0.16);
    g.fillStyle = '#1A1A1A'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.10) + 'px Arial, sans-serif'; g.fillText('INTERNATIONAL', w / 2, h * 0.505, w * 0.72);
  }, 256, 256);
}
function capTexLetrero(txt, fondo, tinta, borde){
  return texRotulo3d(function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    g.strokeStyle = borde; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10);
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.56) + 'px "Arial Black", Arial, sans-serif'; g.fillText(txt, w / 2, h * 0.54, w * 0.9);
  }, 512, 110);
}

/* ═══ llanta de camion: carcasa, banda con tacos, aro de disco con agujeros
   de mano, 10 tuercas y masa. Mismo contrato que ruedaDet: grupo que gira,
   la carcasa lleva el codigo SAP y los tacos comparten su material ═══ */
function capRueda(D, G, piezas, code, x, z, afuera, o){
  var R = o.r, A = o.ancho, rA = o.rAro;
  var gr = new THREE.Group();
  gr.userData.rueda = true;
  gr.position.set(x, R, z);
  G.add(gr); D.ruedas.push(gr);
  var goma = D.M.goma('#17191C');
  var perfilR = [[rA * 1.00, -A * 0.40], [rA * 1.08, -A * 0.47], [R * 0.74, -A * 0.50], [R * 0.88, -A * 0.49], [R * 0.95, -A * 0.44],
                 [R * 0.972, -A * 0.30], [R * 0.976, 0]];
  var pts = perfilR.concat(perfilR.slice(0, -1).reverse().map(function(p){ return [p[0], -p[1]]; }))
                   .map(function(p){ return new THREE.Vector2(p[0], p[1]); });
  var t = new THREE.Mesh(new THREE.LatheGeometry(pts, 48), goma);
  t.rotation.x = Math.PI / 2;
  t.userData.isLlanta = true; t.userData.code = code; t.userData.base = '#17191C';
  gr.add(t);
  if(piezas && code) piezas.push(t);
  /* tacos: traccion en chevron cerrado; direccion en bloques rectos */
  var n = Math.round(2 * Math.PI * R / (o.trac ? 0.105 : 0.085)), hT = 0.016;
  var gT = new THREE.BoxGeometry(2 * Math.PI * R / n * (o.trac ? 0.52 : 0.60), hT, A * (o.trac ? 0.44 : 0.27));
  var filas = o.trac ? [-1, 1] : [-1.5, -0.5, 0.5, 1.5];
  var inst = new THREE.InstancedMesh(gT, goma, n * filas.length), d = new THREE.Object3D(), k = 0;
  for(var i = 0; i < n; i++){
    filas.forEach(function(s){
      var a = (i + (o.trac && s > 0 ? 0.5 : 0)) / n * Math.PI * 2, rr = R * 0.976 + hT / 2 - 0.003;
      d.position.set(Math.cos(a) * rr, Math.sin(a) * rr, s * A * (o.trac ? 0.24 : 0.205));
      d.rotation.set(0, 0, a - Math.PI / 2);
      if(o.trac) d.rotateY(s * 0.38);
      d.updateMatrix();
      inst.setMatrixAt(k++, d.matrix);
    });
  }
  gr.add(inst);
  /* aro: barril, pestanas; del lado de afuera el disco con agujeros de mano */
  var mAro = D.M.pintura(o.aro);
  var aro = new THREE.Mesh(new THREE.CylinderGeometry(rA * 0.97, rA * 0.97, A * 0.80, 36, 1, true), mAro);
  aro.material.side = THREE.DoubleSide;
  aro.rotation.x = Math.PI / 2; gr.add(aro);
  [-1, 1].forEach(function(s){
    var p = new THREE.Mesh(new THREE.TorusGeometry(rA * 1.0, 0.013, 8, 40), mAro);
    p.position.z = s * A * 0.40; gr.add(p);
  });
  if(afuera){
    var dz = afuera * A * 0.30;
    var disco = new THREE.Mesh(new THREE.CylinderGeometry(rA * 0.95, rA * 0.95, 0.02, 36), mAro);
    disco.rotation.x = Math.PI / 2; disco.position.z = dz; gr.add(disco);
    var hoyos = [], tuercas = [], j, ang;
    for(j = 0; j < 10; j++){
      ang = (j + 0.5) / 10 * Math.PI * 2;
      hoyos.push([Math.cos(ang) * rA * 0.66, Math.sin(ang) * rA * 0.66]);
      ang = j / 10 * Math.PI * 2;
      tuercas.push([Math.cos(ang) * 0.143, Math.sin(ang) * 0.143]);
    }
    var gh = new THREE.CylinderGeometry(rA * 0.13, rA * 0.13, 0.024, 14);
    var ih = new THREE.InstancedMesh(gh, D.M.mate('#0E0F11'), 10);
    hoyos.forEach(function(q, b){ d.position.set(q[0], q[1], dz + afuera * 0.002); d.rotation.set(Math.PI / 2, 0, 0); d.updateMatrix(); ih.setMatrixAt(b, d.matrix); });
    gr.add(ih);
    var gn = new THREE.CylinderGeometry(0.017, 0.017, 0.05, 6);
    var inn = new THREE.InstancedMesh(gn, D.M.cromo(), 10);
    tuercas.forEach(function(q, b){ d.position.set(q[0], q[1], dz + afuera * 0.025); d.rotation.set(Math.PI / 2, 0, 0); d.updateMatrix(); inn.setMatrixAt(b, d.matrix); });
    gr.add(inn);
    var masa = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.125, 0.07, 28), D.M.metal('#5C6268'));
    masa.rotation.x = Math.PI / 2; masa.position.z = dz + afuera * 0.035; gr.add(masa);
    /* tapa: domo cromado en direccion, brida del palier en traccion */
    var tapa = o.trac ? new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.05, 20), D.M.metal('#4A5056'))
                      : new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.10, 0.11, 24), D.M.cromo());
    tapa.rotation.x = Math.PI / 2; tapa.position.z = dz + afuera * (o.trac ? 0.09 : 0.12);
    if(afuera < 0) tapa.rotation.x = -Math.PI / 2;
    gr.add(tapa);
  }
  gr.traverse(function(m){ if(m.isMesh){ m.castShadow = true; m.receiveShadow = true; } });
  return gr;
}

/* ═══ medidas derivadas ═══ */
function capMedidas(C, cuerpo){
  var P = { C: C, cuerpo: cuerpo };
  var largo = C.bf + C.wb + C.eof;
  if(cuerpo === 'CAMABAJA') largo = C.bf + C.wb - 0.25 + CAP_CB.largo;
  P.XF = -largo / 2;
  P.XD = P.XF + C.bf;
  P.XD2 = C.eje2 ? P.XD + C.eje2 : null;
  P.XT = P.XD + C.wb; P.X1 = P.XT - C.tan / 2; P.X2 = P.XT + C.tan / 2; P.XC = P.XT + C.eof;
  P.XCB = P.XF + C.bbc; P.XCF = P.XCB - C.cab; P.XG = P.XF + 0.23;
  P.YB = 0.80; P.YR = 1.07; P.YP = 1.20; P.YT = P.YB + C.techo; P.YCO = C.capo;
  P.YW = P.YCO + 0.06;
  P.RL = C.rl; P.AL = C.al; P.CW = C.cw; P.ZR = 0.39;
  P.ZD = C.trD / 2; P.ZO = C.sobre / 2 - C.al / 2; P.ZI = C.trI - P.ZO;
  P.XDA = P.XCF + 0.10; P.XDB = P.XDA + C.puerta;
  P.YBELT = P.YT - 0.74;
  return P;
}

/* ═══ chasis, ejes, suspension, tren motriz y tanques (comun) ═══ */
function capChasis(D, P, G, piezas){
  var C = P.C, XF = P.XF, XD = P.XD, XC = P.XC, YB = P.YB, YR = P.YR, RL = P.RL, ZR = P.ZR;
  var NEG = '#1A1C1F';
  /* largueros en C y travesanos */
  [-1, 1].forEach(function(s){
    D.bloque('42023615', XC - XF - 0.22, YR - YB, 0.075, 'pintura', NEG, (XF + 0.22 + XC) / 2, (YB + YR) / 2, s * ZR, 0.012);
    D.bloque(null, XC - XF - 0.24, 0.012, 0.09, 'pintura', '#26292D', (XF + 0.22 + XC) / 2, YR - 0.006, s * (ZR - 0.01), 0.004);
  });
  var tr = [];
  for(var x = XF + 0.40; x < XC; x += 0.95) tr.push([x, (YB + YR) / 2 + 0.02, 0]);
  tr.push([XC - 0.05, (YB + YR) / 2, 0]);
  capInst(D, '42023615', new THREE.BoxGeometry(0.09, 0.20, ZR * 2 - 0.07), 'pintura', NEG, tr);

  /* ═══ eje delantero (y el segundo direccional del 8x4) ═══ */
  var ejesD = [[XD, 'LL1', 'LL2']];
  if(P.XD2) ejesD.push([P.XD2, 'LL3', 'LL4']);
  ejesD.forEach(function(q, k){
    var xa = q[0], zk = P.ZD - 0.20;
    /* viga en I con caida al centro */
    D.bloque(null, 0.12, 0.13, zk * 2 - 0.50, 'pintura', '#2A2D31', xa, RL - 0.11, 0, 0.02);
    [-1, 1].forEach(function(s){
      var t = D.bloque(null, 0.12, 0.13, 0.36, 'pintura', '#2A2D31', xa, RL - 0.055, s * (zk - 0.14), 0.02);
      t.rotation.x = s * 0.30;
      D.cilindro(null, 0.06, 0.06, 0.24, 'metal', CAP_GRIS2, xa, RL, s * zk, null, 14);
      /* tambor de freno y brazo de direccion */
      D.cilindro(null, 0.20, 0.20, 0.17, 'metal', '#33373C', xa, RL, s * (P.ZD - 0.12), [Math.PI / 2, 0, 0], 26);
      D.tubo(null, [xa, RL, s * zk], [xa + 0.22, RL - 0.06, s * (zk - 0.12)], 0.025, 'metal', CAP_GRIS, 8);
      /* muelle delantero bajo el larguero, con ojos y gemelo */
      capMuelle(D, '42020008', xa, RL + 0.17, 1.40, 4, s * ZR, 0.075, 0.07, '#2E3238');
      D.cilindro(null, 0.035, 0.035, 0.10, 'metal', CAP_GRIS, xa - 0.70, RL + 0.25, s * ZR, [Math.PI / 2, 0, 0], 10);
      D.cilindro(null, 0.035, 0.035, 0.10, 'metal', CAP_GRIS, xa + 0.70, RL + 0.25, s * ZR, [Math.PI / 2, 0, 0], 10);
      D.bloque(null, 0.10, YB - RL - 0.22, 0.10, 'pintura', NEG, xa - 0.70, (YB + RL + 0.25) / 2, s * ZR, 0.015);
      D.bloque(null, 0.06, YB - RL - 0.20, 0.10, 'pintura', NEG, xa + 0.73, (YB + RL + 0.22) / 2, s * ZR, 0.012);
      /* grapas en U y amortiguador */
      [-0.05, 0.05].forEach(function(dx){ D.tubo(null, [xa + dx, RL - 0.05, s * (ZR + 0.05)], [xa + dx, RL + 0.22, s * (ZR + 0.05)], 0.011, 'metal', CAP_GRIS, 6); });
      D.cilHidD(s > 0 ? 'SDI' : 'SDD', [xa + 0.20, RL - 0.02, s * (ZR + 0.10)], [xa + 0.30, YR - 0.05, s * (ZR + 0.10)], 0.04, '#202326', 0.55);
    });
    /* barra de acople detras del eje */
    D.tubo(null, [xa + 0.22, RL - 0.06, -(zk - 0.12)], [xa + 0.22, RL - 0.06, zk - 0.12], 0.025, 'metal', CAP_GRIS, 10);
    capRueda(D, G, piezas, q[1], xa, P.ZD, 1, { r: RL, ancho: P.AL, rAro: C.rAro, aro: C.aro, trac: false });
    capRueda(D, G, piezas, q[2], xa, -P.ZD, -1, { r: RL, ancho: P.AL, rAro: C.rAro, aro: C.aro, trac: false });
  });
  /* caja de direccion en el larguero izquierdo y barra de mando */
  D.bloque('CDR', 0.24, 0.22, 0.16, 'metal', CAP_GRIS, XD - 0.42, YR - 0.10, ZR + 0.12, 0.03);
  D.tubo(null, [XD - 0.42, YR - 0.22, ZR + 0.16], [XD + 0.22, RL - 0.04, P.ZD - 0.32], 0.022, 'metal', CAP_GRIS, 8);
  if(P.XD2) D.tubo(null, [XD + 0.22, RL - 0.04, P.ZD - 0.34], [P.XD2 + 0.22, RL - 0.04, P.ZD - 0.34], 0.022, 'metal', CAP_GRIS, 8);

  /* ═══ tandem trasero ═══ */
  var trac = { r: RL, ancho: P.AL, rAro: C.rAro, aro: C.aro, trac: true };
  var n0 = P.XD2 ? 5 : 3;
  [[P.X1, 'DIFD'], [P.X2, 'DIFP']].forEach(function(q, k){
    var xa = q[0];
    D.cilindro(null, 0.085, 0.085, (P.ZI - 0.16) * 2, 'pintura', '#2A2D31', xa, RL, 0, [Math.PI / 2, 0, 0], 16);
    var banjo = D.pon(q[1], new THREE.SphereGeometry(0.26, 24, 16), 'pintura', '#2A2D31', xa, RL, 0);
    banjo.scale.set(1, 1, 0.62);
    D.cilindro(q[1], 0.18, 0.13, 0.30, 'pintura', '#2A2D31', xa - 0.22, RL + 0.03, 0, [0, 0, Math.PI / 2], 20);
    if(!k) D.cilindro(null, 0.11, 0.11, 0.18, 'pintura', '#2A2D31', xa + 0.20, RL + 0.05, 0, [0, 0, Math.PI / 2], 16);
    [-1, 1].forEach(function(s){
      /* tambor, pulmon de freno doble y su manguera */
      D.cilindro(null, 0.21, 0.21, 0.20, 'metal', '#33373C', xa, RL, s * (P.ZI - 0.18), [Math.PI / 2, 0, 0], 26);
      D.cilindro('42066068', 0.095, 0.095, 0.26, 'pintura', '#202326', xa - 0.24, RL + 0.14, s * (P.ZI - 0.40), [0, 0, Math.PI / 2 - 0.25], 18);
      D.cilindro(null, 0.10, 0.10, 0.03, 'metal', CAP_GRIS2, xa - 0.24, RL + 0.14, s * (P.ZI - 0.40), [0, 0, Math.PI / 2 - 0.25], 18);
      D.tubo('21003297', [xa - 0.36, RL + 0.18, s * (P.ZI - 0.40)], [xa - 0.30, YB - 0.02, s * (ZR - 0.06)], 0.012, 'goma', '#111', 6);
    });
    var bi = n0 + k * 4;
    capRueda(D, G, piezas, 'LL' + bi, xa, P.ZO, 1, trac);
    capRueda(D, G, piezas, 'LL' + (bi + 1), xa, P.ZI, 0, trac);
    capRueda(D, G, piezas, 'LL' + (bi + 2), xa, -P.ZI, 0, trac);
    capRueda(D, G, piezas, 'LL' + (bi + 3), xa, -P.ZO, -1, trac);
  });
  /* suspension trasera. Mack: «camelback», un muelle arqueado por lado
     apoyado en un muñon al centro. Los demas: dos muelles por lado con
     balancin al centro. El paquete de hojas es 42041233; soportes,
     balancin y barras de torsion del lado derecho son SPD */
  [-1, 1].forEach(function(s){
    var cS = s < 0 ? 'SPD' : null, zs = s * (ZR + 0.02);
    if(C.marca === 'mack'){
      capMuelle(D, '42041233', P.XT, RL + 0.42, C.tan + 0.36, 6, zs, 0.10, -0.26, '#2E3238');
      D.bloque(cS, 0.36, YB - RL - 0.18, 0.20, 'pintura', NEG, P.XT, (YB + RL + 0.36) / 2 + 0.02, s * (ZR + 0.02), 0.03);
      D.cilindro(cS, 0.09, 0.09, 0.30, 'metal', CAP_GRIS, P.XT, RL + 0.36, zs, [Math.PI / 2, 0, 0], 16);
      [P.X1, P.X2].forEach(function(xa){ D.bloque(cS, 0.26, 0.10, 0.16, 'pintura', NEG, xa, RL + 0.12, zs, 0.02); });
    } else {
      [P.X1, P.X2].forEach(function(xa){
        capMuelle(D, '42041233', xa, RL + 0.19, 1.05, 5, zs, 0.09, 0.05, '#2E3238');
        [-0.05, 0.05].forEach(function(dx){ D.tubo(null, [xa + dx, RL - 0.10, zs + s * 0.06], [xa + dx, RL + 0.20, zs + s * 0.06], 0.012, 'metal', CAP_GRIS, 6); });
      });
      [P.X1 - 0.56, P.X2 + 0.56].forEach(function(xh){ D.bloque(cS, 0.12, YB - RL - 0.12, 0.14, 'pintura', NEG, xh, (YB + RL + 0.22) / 2, zs, 0.02); });
      D.bloque(cS, 0.22, YB - RL - 0.08, 0.16, 'pintura', NEG, P.XT, (YB + RL + 0.20) / 2, zs, 0.02);
      D.bloque(cS, 0.62, 0.09, 0.08, 'pintura', NEG, P.XT, RL + 0.26, zs, 0.02);
    }
    /* barras de torsion del eje al soporte central */
    [P.X1, P.X2].forEach(function(xa){ D.tubo(cS, [xa, RL - 0.06, s * (ZR - 0.06)], [P.XT, RL + 0.22, s * (ZR - 0.06)], 0.035, 'metal', '#2E3238', 10); });
  });

  /* ═══ motor, radiador y tren de fuerza ═══ */
  var XM0 = P.XG + 0.55, XM1 = P.XCF + 0.18, XMc = (XM0 + XM1) / 2, LM = XM1 - XM0;
  D.bloque('ENG1', LM, 0.62, 0.66, 'metal', CAP_GRIS, XMc, 1.12, 0, 0.05);
  D.bloque('ENG1', LM * 0.92, 0.22, 0.50, 'metal', '#2E3238', XMc, 0.72, 0, 0.04);
  D.bloque('42064643', LM * 0.88, 0.14, 0.42, 'metal', '#5D646C', XMc, 1.50, 0, 0.04);
  D.cilindro('ENG1', 0.11, 0.11, 0.30, 'metal', '#6B7178', XM1 - 0.18, 1.30, -0.42, [Math.PI / 2, 0, 0], 16);
  D.cilindro('AL1', 0.10, 0.10, 0.16, 'metal', '#9AA1A8', XM0 + 0.12, 1.22, -0.36, [0, 0, Math.PI / 2], 16);
  D.cilindro('CMP', 0.09, 0.09, 0.24, 'metal', '#7D848B', XM0 + 0.45, 0.98, 0.40, [0, 0, Math.PI / 2], 14);
  D.cilindro('AR1', 0.08, 0.08, 0.30, 'metal', '#5C6268', XM1 - 0.10, 0.82, 0.38, [0, 0, Math.PI / 2], 14);
  D.cilindro('SPM', 0.07, 0.07, 0.18, 'metal', '#7D848B', XM0 + 0.30, 1.30, 0.40, [0, 0, Math.PI / 2], 14);
  /* campana, caja, toma de fuerza y bomba hidraulica a la derecha */
  var XTR0 = P.XCF + 0.18;
  D.cilindro('TRM', 0.30, 0.22, 0.28, 'metal', CAP_GRIS, XTR0 + 0.14, 1.00, 0, [0, 0, Math.PI / 2], 24);
  D.bloque('TRM', 0.80, 0.42, 0.44, 'metal', CAP_GRIS, XTR0 + 0.68, 0.94, 0, 0.05);
  D.bloque('PTB1', 0.24, 0.20, 0.16, 'metal', '#565F69', XTR0 + 0.55, 0.84, -0.30, 0.03);
  D.cilindro('42047231', 0.08, 0.08, 0.28, 'pintura', '#2B2F34', XTR0 + 0.80, 0.84, -0.32, [0, 0, Math.PI / 2], 16);
  D.tubo('LPH', [XTR0 + 0.92, 0.88, -0.32], [XTR0 + 1.30, YR - 0.05, -0.30], 0.022, 'goma', '#15171A', 8);
  D.tubo('LPH', [XTR0 + 0.92, 0.80, -0.30], [XTR0 + 1.30, YR - 0.12, -0.24], 0.022, 'goma', '#15171A', 8);
  /* cardanes con crucetas */
  var ejeS = [XTR0 + 1.10, 0.92, 0], pin1 = [P.X1 - 0.38, RL + 0.03, 0];
  D.tubo(null, ejeS, pin1, 0.055, 'metal', '#8A9097', 14);
  D.tubo(null, [P.X1 + 0.30, RL + 0.05, 0], [P.X2 - 0.38, RL + 0.03, 0], 0.05, 'metal', '#8A9097', 14);
  [ejeS, pin1].forEach(function(p){ D.cilindro(null, 0.075, 0.075, 0.08, 'metal', '#3A3F45', p[0], p[1], 0, [0, 0, Math.PI / 2], 12); });
  /* tanques de aire entre largueros, detras de la cabina */
  [-0.24, 0.24].forEach(function(z){
    D.cilindro(null, 0.11, 0.11, 0.85, 'pintura', '#30343A', P.XCB + 0.70, YR - 0.13, z, [0, 0, Math.PI / 2], 18);
  });
  D.tubo('LPA', [P.XCB + 0.25, YR - 0.20, 0.20], [P.X1 - 0.6, YR - 0.20, 0.30], 0.012, 'goma', '#2E5E9E', 6);
  return P;
}

/* ═══ cabina convencional (comun) ═══ */
function capCabina(D, P, G){
  var C = P.C, col = C.color, CW = P.CW, XCF = P.XCF, XCB = P.XCB, YP = P.YP, YT = P.YT, YW = P.YW, YR = P.YR, rk = C.rake;
  var NEG = CAP_NEGRO;
  /* carroceria: perfil de costado extruido a lo ancho */
  D.perfil('CBN', [[XCF, YP], [XCB, YP], [XCB, YT - 0.03], [XCB - 0.05, YT], [XCF + rk + 0.05, YT], [XCF + rk, YT - 0.04], [XCF, YW]],
    CW * 2, 0, 'pintura', col, 0.06);
  /* techo combado */
  D.bloque('CBN', XCB - XCF - rk - 0.12, 0.05, CW * 2 - 0.16, 'pintura', col, (XCF + rk + XCB) / 2, YT + 0.02, 0, 0.025);
  /* parabrisas: una o dos lunas sobre un marco de goma negra */
  var ang = Math.atan2(rk, YT - YW), Lw = Math.hypot(rk, YT - YW) - 0.16;
  var nx = -Math.cos(ang), ny = Math.sin(ang), mx = XCF + rk / 2 + nx * 0.012, my = (YW + YT) / 2 + ny * 0.012;
  D.bloque(null, 0.02, Lw + 0.06, CW * 2 - 0.10, 'mate', '#0E0F11', mx - nx * 0.004, my - ny * 0.004, 0, 0.008, [0, 0, -ang]);
  var lunas = C.marca === 'kw' || C.marca === 'i56' ? [-1, 1] : [0];
  lunas.forEach(function(s){
    var w = s ? CW - 0.12 : CW * 2 - 0.20;
    D.bloque(null, 0.02, Lw, w, 'vidrio', CAP_VIDRIO, mx + nx * 0.004, my + ny * 0.004, s * (CW / 2 - 0.01), 0.006, [0, 0, -ang]);
  });
  if(lunas.length > 1) D.bloque('CBN', 0.03, Lw + 0.04, 0.06, 'pintura', col, mx + nx * 0.010, my + ny * 0.010, 0, 0.01, [0, 0, -ang]);
  /* ventanas de puerta (la del T800 con su escalon adelante) y ventana de atras */
  var xf = function(y){ return XCF + rk * (y - YW) / (YT - YW) + 0.11; };
  var yb = P.YBELT, yt = YT - 0.12, XDB = P.XDB;
  var vent = C.marca === 'kw'
    ? [[xf(yb - 0.14), yb - 0.14], [xf(yb - 0.14) + 0.28, yb - 0.14], [xf(yb - 0.14) + 0.36, yb], [XDB - 0.06, yb], [XDB - 0.06, yt], [xf(yt), yt]]
    : [[xf(yb), yb], [XDB - 0.06, yb], [XDB - 0.06, yt], [xf(yt), yt]];
  var ancho = function(pts, m){ return pts.map(function(p){ return [p[0] + (p[0] < (XCF + XDB) / 2 ? -m : m), p[1] + (p[1] < (yb + yt) / 2 ? -m : m)]; }); };
  [-1, 1].forEach(function(s){
    D.perfil(null, ancho(vent, 0.025), 0.012, s * (CW + 0.002), 'mate', '#0E0F11', 0.003);
    D.perfil(null, vent, 0.014, s * (CW + 0.006), 'vidrio', CAP_VIDRIO, 0.004);
    /* cabina extendida: ventanita detras de la puerta */
    if(XCB - XDB > 0.55){
      var vq = [[XDB + 0.12, yb + 0.05], [XCB - 0.14, yb + 0.05], [XCB - 0.14, yt], [XDB + 0.12, yt]];
      D.perfil(null, ancho(vq, 0.02), 0.012, s * (CW + 0.002), 'mate', '#0E0F11', 0.003);
      D.perfil(null, vq, 0.014, s * (CW + 0.006), 'vidrio', CAP_VIDRIO, 0.004);
    }
    /* juntas de la puerta, manija y bisagras */
    var zj = s * (CW + 0.003);
    D.bloque(null, 0.012, YT - YP - 0.12, 0.008, 'mate', '#0B0C0E', P.XDA, (YP + YT) / 2 - 0.02, zj, 0.002);
    D.bloque(null, 0.012, YT - YP - 0.12, 0.008, 'mate', '#0B0C0E', XDB, (YP + YT) / 2 - 0.02, zj, 0.002);
    D.bloque(null, XDB - P.XDA, 0.012, 0.008, 'mate', '#0B0C0E', (P.XDA + XDB) / 2, YP + 0.06, zj, 0.002);
    D.bloque(null, 0.16, 0.04, 0.04, 'cromo', null, XDB - 0.16, yb - 0.10, s * (CW + 0.02), 0.012);
    [YP + 0.30, yb - 0.05].forEach(function(y){ D.bloque(null, 0.05, 0.10, 0.03, 'mate', NEG, P.XDA + 0.02, y, s * (CW + 0.012), 0.008); });
    /* asideros cromados a los dos lados de la puerta */
    D.tubo(null, [P.XDA - 0.05, YP + 0.25, s * (CW + 0.05)], [P.XDA - 0.05 + rk * 0.25, yb + 0.05, s * (CW + 0.05)], 0.016, 'cromo', null, 8);
    D.tubo(null, [XDB + 0.07, YP + 0.20, s * (CW + 0.05)], [XDB + 0.07, yb + 0.15, s * (CW + 0.05)], 0.016, 'cromo', null, 8);
    /* espejos de brazo (tipo costa oeste) con el convexo debajo */
    var xm = XCF + 0.06, zm = s * (CW + 0.34), y1 = YT - 0.16, y0 = yb - 0.02;
    D.tubo(null, [XCF + rk * 0.85 + 0.10, YT - 0.18, s * CW], [xm, y1, zm], 0.014, 'cromo', null, 8);
    D.tubo(null, [P.XDA + 0.02, yb - 0.02, s * CW], [xm, y0, zm], 0.014, 'cromo', null, 8);
    D.tubo(null, [xm, y0 - 0.12, zm], [xm, y1 + 0.02, zm], 0.013, 'cromo', null, 8);
    D.bloque(null, 0.07, 0.38, 0.19, 'mate', NEG, xm + 0.01, (y0 + y1) / 2 + 0.04, zm + s * 0.11, 0.025);
    D.bloque(null, 0.01, 0.34, 0.16, 'cromo', null, xm + 0.05, (y0 + y1) / 2 + 0.04, zm + s * 0.11, 0.004);
    D.cilindro(null, 0.075, 0.075, 0.05, 'mate', NEG, xm + 0.01, y0 - 0.14, zm + s * 0.09, [0, 0, Math.PI / 2], 18);
    D.pon(null, new THREE.SphereGeometry(0.07, 16, 8, 0, Math.PI * 2, 0, Math.PI / 3), 'cromo', null, xm + 0.025, y0 - 0.14, zm + s * 0.09, [0, 0, -Math.PI / 2]);
    /* luz de galibo ambar al costado */
    D.bloque('LSM', 0.08, 0.05, 0.03, 'vidrio', '#F0A020', XCB - 0.20, YT - 0.10, s * (CW + 0.01), 0.008);
  });
  /* ventana de atras */
  D.bloque(null, 0.012, 0.50, 1.00, 'mate', '#0E0F11', XCB + 0.003, YT - 0.42, 0, 0.004);
  D.bloque(null, 0.014, 0.44, 0.94, 'vidrio', CAP_VIDRIO, XCB + 0.008, YT - 0.42, 0, 0.004);
  /* luces de cabina ambar sobre el parabrisas, antena y bocinas de aire */
  var xl = XCF + rk + 0.08;
  if(C.marca === 'i76' || C.marca === 'mack'){
    /* visera sobre el parabrisas */
    var vis = D.bloque('CBN', 0.30, 0.04, CW * 2 - 0.04, 'pintura', col, XCF + rk - 0.08, YT - 0.03, 0, 0.015);
    vis.rotation.z = 0.12; xl = XCF + rk - 0.17;
  }
  var luces = [];
  for(var i = 0; i < 5; i++) luces.push([xl, YT + 0.04, -0.40 + i * 0.20]);
  luces.forEach(function(q){
    var l = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4, roughness: 0.3 }));
    l.position.set(q[0], q[1], q[2]); l.scale.set(1, 0.8, 1.6); G.add(l);
  });
  D.tubo(null, [XCB - 0.30, YT + 0.04, CW - 0.12], [XCB - 0.36, YT + 0.90, CW - 0.12], 0.006, 'metal', '#222', 4);
  [-0.30, -0.12].forEach(function(z, k){
    D.cilindro(null, 0.022, 0.06, 0.34 + k * 0.10, 'cromo', null, XCB - 0.40 - k * 0.05, YT + 0.10, z, [0, 0, Math.PI / 2], 14);
  });
  /* circulina en el techo */
  var bal = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#F09A1C'), emissive: new THREE.Color('#F09A1C'), emissiveIntensity: 0.45, roughness: 0.3 }));
  bal.position.set(XCB - 0.22, YT + 0.08, 0.30); D.reg('CIR', bal, '#F09A1C');
  D.cilindro(null, 0.10, 0.10, 0.06, 'mate', NEG, XCB - 0.22, YT + 0.06, 0.30, null, 16);

  /* peldanos bajo la puerta: caja de aluminio con dos pisaderas diamantadas */
  var xs0 = P.XD2 ? P.XD + 0.58 : P.XD + 0.86, xs1 = P.XD2 ? P.XD + 0.95 : P.XD + 1.22, texD = capTexDiamante();
  [-1, 1].forEach(function(s){
    var zc = s * (CW - 0.12);
    D.bloque(null, 0.035, YP - 0.45, 0.30, 'metal', CAP_ALU, xs0, (YP + 0.45) / 2, zc, 0.01);
    D.bloque(null, 0.035, YP - 0.45, 0.30, 'metal', CAP_ALU, xs1, (YP + 0.45) / 2, zc, 0.01);
    [0.52, 0.88].forEach(function(y){
      capConTex(D, null, new THREE.BoxGeometry(xs1 - xs0, 0.03, 0.30), texD, '#D8DCE0', 0.4, 0.75, (xs0 + xs1) / 2, y, zc + s * 0.03);
    });
  });
  /* tanque de combustible redondo a la izquierda; a la derecha baterias */
  var xt0 = P.XD2 ? P.XD2 + 0.62 : xs1 + 0.04, LT = P.XD2 ? 1.25 : 1.15, zt = 0.43 + 0.36;
  D.cilindro('TQC1', 0.33, 0.33, LT, 'cromo', '#C9CED3', xt0 + LT / 2, YR - 0.22, zt, [0, 0, Math.PI / 2], 30);
  [0.18, LT - 0.18].forEach(function(dx){
    D.pon(null, new THREE.TorusGeometry(0.336, 0.014, 8, 36), 'mate', NEG, xt0 + dx, YR - 0.22, zt, [0, Math.PI / 2, 0]);
  });
  D.cilindro(null, 0.055, 0.055, 0.05, 'cromo', null, xt0 + 0.30, YR + 0.12, zt, null, 16);
  D.bloque('42076084', 0.10, 0.08, 0.08, 'metal', '#8A6A2A', xt0 + 0.15, YR - 0.50, zt - 0.10, 0.015);
  D.tubo('42076084', [xt0 + 0.15, YR - 0.50, zt - 0.10], [xt0 - 0.05, YR - 0.30, 0.44], 0.012, 'goma', '#111', 6);
  [0.25, LT - 0.25].forEach(function(dx){ D.bloque(null, 0.06, 0.30, 0.06, 'pintura', NEG, xt0 + dx, YR - 0.12, 0.50, 0.01); });
  D.bloque('BAT', 0.60, 0.42, 0.50, 'metal', CAP_ALU, xt0 + 0.30, YR - 0.18, -0.74, 0.03);
  D.bloque(null, 0.62, 0.03, 0.52, 'metal', '#9EA4AA', xt0 + 0.30, YR + 0.045, -0.74, 0.01);
  /* tanque hidraulico de la bomba del cuerpo, con su filtro y visor */
  D.bloque('TQH1', 0.72, 0.52, 0.44, 'pintura', '#2B2F34', xt0 + 1.05, YR - 0.20, -0.72, 0.04);
  D.cilindro('40000054', 0.07, 0.07, 0.20, 'metal', '#A0A6AC', xt0 + 1.25, YR + 0.16, -0.72, null, 14);
  D.bloque(null, 0.03, 0.22, 0.05, 'vidrio', '#9BB7C9', xt0 + 0.85, YR - 0.20, -0.95, 0.008);
  /* engrase centralizado y modulos electronicos en el larguero */
  D.bloque('SEN', 0.20, 0.26, 0.16, 'mate', '#1E2023', P.XCB + 0.25, YR - 0.18, -(P.ZR + 0.12), 0.02);
  D.cilindro('SEN', 0.07, 0.07, 0.16, 'vidrio', '#D9D2A8', P.XCB + 0.25, YR + 0.03, -(P.ZR + 0.12), null, 14);
  D.bloque('EC', 0.28, 0.20, 0.06, 'mate', '#1E2023', P.XCB + 0.30, YR - 0.12, P.ZR + 0.07, 0.015);

  /* escape vertical detras de la cabina: silenciador con escudo perforado y chimenea cromada */
  var ze = C.escape * (CW - 0.20), xe = XCB + 0.19, texP = capTexPerforado();
  D.cilindro(null, 0.14, 0.14, 1.05, 'metal', '#8A9097', xe, YR + 0.80, ze, null, 22);
  capConTex(D, null, new THREE.CylinderGeometry(0.165, 0.165, 0.80, 26, 1, true, Math.PI * 0.15 * C.escape, Math.PI * 1.3), texP, '#E6EAEE', 0.3, 0.9,
    xe, YR + 0.80, ze, [0, C.escape > 0 ? Math.PI : 0, 0], true);
  D.tubo(null, [xe, YR + 1.30, ze], [xe, YT + 0.78, ze], 0.065, 'cromo', null, 20);
  D.tubo(null, [xe, YT + 0.76, ze], [xe + 0.12, YT + 0.94, ze], 0.065, 'cromo', null, 20);
  [YR + 0.55, YT - 0.25].forEach(function(y){ D.bloque(null, 0.18, 0.05, 0.05, 'mate', NEG, xe - 0.09, y, ze, 0.01); });
  D.tubo(null, [xe, YR + 0.27, ze], [P.XCF + 0.60, 0.80, 0.0], 0.06, 'metal', '#5C6268', 14);
  /* guardabarros traseros (faldones) detras del tandem */
  [-1, 1].forEach(function(s){
    D.bloque(null, 0.02, 0.62, 0.62, 'goma', '#121315', P.X2 + P.RL + 0.16, 0.48, s * (P.ZO + P.ZI) / 2, 0.01);
    D.bloque(null, 0.04, 0.04, 0.62, 'metal', CAP_GRIS2, P.X2 + P.RL + 0.16, 0.80, s * (P.ZO + P.ZI) / 2, 0.01);
    D.tubo(null, [P.X2 + P.RL + 0.16, 0.80, s * (P.ZO + P.ZI) / 2], [P.X2 + P.RL + 0.16, YR - 0.05, s * (P.ZR + 0.05)], 0.02, 'metal', CAP_GRIS2, 6);
  });
  /* numero de unidad en las puertas */
  var texNum = texNumero3d(null, C.tinta);
  var matN = new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 });
  [-1, 1].forEach(function(s){
    var mn = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.21), matN);
    mn.position.set((P.XDA + XDB) / 2 + 0.04, YP + 0.42, s * (CW + 0.012)); mn.rotation.y = s > 0 ? 0 : Math.PI; G.add(mn);
  });
  return { texNum: texNum, matNum: matN };
}

/* ═══ piezas de frente comunes ═══ */
/* guardafango delantero: perfil de costado con el arco de la rueda, extruido
   a lo ancho con cantos muy redondeados. o: { x0, yBajo, yFrente, yTop,
   xFin, yFin, a1, a2, z0, z1, r, hex } */
function capGuardafango(D, P, o, xa){
  var XD = xa === undefined ? P.XD : xa, RL = P.RL, ra = RL + 0.10;
  var pts = [[o.x0 + 0.04, o.yBajo], [o.x0, o.yFrente - 0.18], [o.x0 + 0.05, o.yFrente - 0.04], [o.x0 + 0.20, o.yFrente],
             [XD - 0.30, o.yTop], [XD + 0.20, o.yTop - 0.02], [o.xFin - 0.22, o.yFin + 0.25], [o.xFin, o.yFin], [o.xFin + 0.02, o.yAtras]];
  pts = pts.concat(capArco(XD, RL, ra, o.a1, o.a2, 14));
  var zc = (o.z0 + o.z1) / 2, e = o.z1 - o.z0;
  [-1, 1].forEach(function(s){ D.perfil(null, pts, e, s * zc, 'pintura', o.hex, o.r); });
  return pts;
}
/* ceja negra de goma alrededor del arco */
function capCeja(D, P, z, a0, a1, ancho, xa){
  var XD = xa === undefined ? P.XD : xa, ra = P.RL + 0.10;
  var pts = capArco(XD, P.RL, ra + 0.075, a0, a1, 16).concat(capArco(XD, P.RL, ra - 0.005, a1, a0, 16));
  [-1, 1].forEach(function(s){ D.perfil(null, pts, ancho, s * z, 'mate', '#202226', 0.012); });
}
/* parrilla: radiador, enfriador y condensador detras, malla transparente,
   marco y barras. o: { x, hz, y0, y1, barras, vertical, t, hexMarco, tipoMarco } */
function capParrilla(D, P, G, o){
  var x = o.x, hz = o.hz, y0 = o.y0, y1 = o.y1, yc = (y0 + y1) / 2, h = y1 - y0, t = o.t || 0.06;
  D.bloque('AAC', 0.04, h - 0.06, hz * 2 - 0.08, 'metal', '#3F454C', x + 0.09, yc, 0, 0.008);
  D.bloque('AFT1', 0.07, h - 0.04, hz * 2 - 0.04, 'metal', '#5C636B', x + 0.15, yc, 0, 0.01);
  D.bloque('RAD1', 0.11, h, hz * 2, 'metal', '#2E3338', x + 0.25, yc, 0, 0.015);
  D.pon('FAN1', new THREE.TorusGeometry(Math.min(h, hz * 2) * 0.42, 0.03, 8, 30), 'mate', '#1E2023', x + 0.34, yc, 0, [0, Math.PI / 2, 0]);
  D.cilindro('FAN1', Math.min(h, hz * 2) * 0.40, Math.min(h, hz * 2) * 0.40, 0.04, 'mate', '#26292D', x + 0.38, yc, 0, [0, 0, Math.PI / 2], 9);
  /* fondo oscuro de la caja de la parrilla y malla de alambre */
  [-1, 1].forEach(function(s){ D.bloque(null, 0.20, h, 0.02, 'mate', '#121315', x + 0.10, yc, s * (hz - 0.02), 0.005); });
  var tex = capTexMalla(o.malla || 26);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(hz * 2 / 0.16, h / 0.16);
  capConTex(D, null, new THREE.PlaneGeometry(hz * 2 - 0.02, h - 0.02), tex, '#2B2E33', 0.45, 0.6, x + 0.035, yc, 0, [0, -Math.PI / 2, 0], true);
  /* marco */
  var tm = o.tipoMarco || 'cromo', hm = o.hexMarco || null;
  D.bloque(null, 0.08, t, hz * 2 + t, tm, hm, x, y1, 0, 0.02);
  D.bloque(null, 0.08, t, hz * 2 + t, tm, hm, x, y0, 0, 0.02);
  [-1, 1].forEach(function(s){ D.bloque(null, 0.08, h, t, tm, hm, x, yc, s * hz, 0.02); });
  /* barras */
  var lista = [], n = o.barras, i;
  if(o.vertical){
    for(i = 1; i < n; i++) lista.push([x + 0.005, yc, -hz + i * 2 * hz / n]);
    capInst(D, null, new THREE.BoxGeometry(0.035, h - t * 0.5, o.grosor || 0.022), 'cromo', null, lista);
  } else {
    for(i = 1; i < n; i++) lista.push([x + 0.005, y0 + i * h / n, 0]);
    capInst(D, null, new THREE.BoxGeometry(0.04, o.grosor || 0.035, hz * 2 - t * 0.5), 'cromo', null, lista);
  }
}
/* capot: superficie por secciones [x, hw, hwT, y0, y1, r, comba] y su tapa delantera */
function capCapo(D, P, secs, hex, conTapa){
  var S = secs.map(function(q){ return { x: q[0], pts: capSeccion(q[1], q[2], q[3], q[4], q[5], q[6]) }; });
  var m = D.pon(null, capLoft(S), 'pintura', hex, 0, 0, 0);
  m.material.side = THREE.DoubleSide;
  /* la tapa solo donde el frente es chapa; detras de una parrilla se ve el radiador */
  if(conTapa){
    var t = D.pon(null, capTapa(S[0]), 'pintura', hex, 0, 0, 0);
    t.material.side = THREE.DoubleSide;
  }
  /* ancho y alto del capot en cualquier x, para ubicar rotulos y rejillas */
  return {
    hw: function(x){ return capInterp(secs, x, 2); },
    y1: function(x){ return capInterp(secs, x, 4); }
  };
}
function capInterp(secs, x, k){
  if(x <= secs[0][0]) return secs[0][k];
  for(var i = 1; i < secs.length; i++){
    if(x <= secs[i][0]){ var f = (x - secs[i - 1][0]) / (secs[i][0] - secs[i - 1][0]); return secs[i - 1][k] + f * (secs[i][k] - secs[i - 1][k]); }
  }
  return secs[secs.length - 1][k];
}
/* faro rectangular doble en bisel cromado, mirando a -X */
function capFaroRect(D, code, x, y, z, w, h, hexBisel){
  D.bloque(null, 0.06, h + 0.05, w + 0.05, hexBisel ? 'mate' : 'cromo', hexBisel || null, x + 0.02, y, z, 0.015);
  [-1, 1].forEach(function(s){
    D.bloque(null, 0.02, h - 0.02, w / 2 - 0.03, 'metal', '#E8ECEF', x - 0.012, y, z + s * w / 4, 0.006);
    D.bloque(code, 0.02, h - 0.04, w / 2 - 0.05, 'vidrio', '#F4F0DC', x - 0.022, y, z + s * w / 4, 0.006);
  });
}

/* ═══ KENWORTH T800: capot inclinado, parrilla cromada con malla y cuatro
   barras, emblema KW, guardafangos redondos, faros dobles rectangulares y
   filtros de aire a los costados del capot ═══ */
function capFrenteKW(D, P, G){
  var C = P.C, col = C.color, XF = P.XF, XG = P.XG, XD = P.XD, XCF = P.XCF;
  /* parachoques cromado con ganchos y faros de niebla */
  D.bloque(null, 0.20, 0.34, 2.44, 'cromo', null, XF + 0.10, 0.76, 0, 0.05);
  D.bloque(null, 0.12, 0.06, 2.30, 'mate', CAP_NEGRO, XF + 0.16, 0.56, 0, 0.02);
  [-0.55, 0.55].forEach(function(z){ D.pon(null, new THREE.TorusGeometry(0.05, 0.02, 8, 16), 'pintura', '#1E2023', XF - 0.03, 0.62, z, [Math.PI / 2, 0, 0]); });
  [-1, 1].forEach(function(s){
    D.bloque(null, 0.03, 0.12, 0.22, 'mate', '#202326', XF - 0.005, 0.77, s * 0.98, 0.01);
    D.bloque('FNB', 0.02, 0.08, 0.18, 'vidrio', '#F4F0DC', XF - 0.015, 0.77, s * 0.98, 0.005);
  });
  /* parrilla */
  capParrilla(D, P, G, { x: XG, hz: 0.55, y0: 0.95, y1: 1.79, barras: 5, vertical: true, t: 0.07, grosor: 0.04, malla: 22 });
  D.bloque(null, 0.10, 0.06, 1.10, 'mate', CAP_NEGRO, XG + 0.02, 0.93, 0, 0.02);
  /* capot */
  var cp = capCapo(D, P, [[XG + 0.03, 0.58, 0.56, 0.95, 1.80, 0.07, 0.01], [XG + 0.22, 0.62, 0.60, 0.97, 1.86, 0.12, 0.02],
    [XG + 0.70, 0.70, 0.67, 1.00, 1.96, 0.16, 0.03], [XCF - 0.30, 0.79, 0.75, 1.04, 2.08, 0.18, 0.03], [XCF + 0.03, 0.81, 0.77, 1.05, 2.12, 0.18, 0.03]], col);
  /* emblema KW sobre la parrilla y KENWORTH a los costados */
  D.bloque(null, 0.03, 0.18, 0.17, 'cromo', null, XG - 0.05, 1.70, 0, 0.02);
  capCartel(G, capTexKW(), 0.16, 0.16, XG - 0.068, 1.70, 0, -Math.PI / 2);
  var texKen = capTexTexto('KENWORTH', '#E8ECEF', 'bold italic # Arial, sans-serif', 512, 80, '#3A3F45');
  [-1, 1].forEach(function(s){
    var x = XG + 0.62, z = s * (cp.hw(x) + 0.006);
    capCartel(G, texKen, 0.62, 0.10, x, 1.72, z, s > 0 ? 0 : Math.PI);
    capCartel(G, capTexTexto('T800', '#E8ECEF', 'bold # Arial, sans-serif', 256, 80, '#3A3F45'), 0.20, 0.06, XCF - 0.32, 1.86, s * (cp.hw(XCF - 0.32) + 0.006), s > 0 ? 0 : Math.PI);
  });
  /* guardafangos redondos */
  var ra = P.RL + 0.10;
  capGuardafango(D, P, { x0: XF + 0.28, yBajo: 0.86, yFrente: 1.30, yTop: 1.47, xFin: XD + 0.82, yFin: 0.98, yAtras: 0.52,
    a1: -0.04, a2: Math.PI - 0.34, z0: 0.64, z1: 1.22, r: 0.08, hex: col });
  [-1, 1].forEach(function(s){
    /* faros dobles en el frente del guardafango */
    capFaroRect(D, s > 0 ? 'FDI' : 'FDD', XF + 0.255, 1.08, s * 0.93, 0.40, 0.15);
    /* direccional ambar en el costado del guardafango */
    D.bloque('LSM', 0.10, 0.06, 0.02, 'vidrio', '#F0A020', XD + 0.42, 1.30, s * 1.215, 0.008);
    /* espejo de guardafango */
    D.tubo(null, [XD - 0.30, 1.47, s * 1.00], [XD - 0.36, 1.74, s * 1.10], 0.012, 'cromo', null, 6);
    D.pon(null, new THREE.SphereGeometry(0.07, 14, 8, 0, Math.PI * 2, 0, Math.PI / 3), 'cromo', null, XD - 0.33, 1.78, s * 1.12, [0, 0, -Math.PI / 2]);
    D.cilindro(null, 0.072, 0.072, 0.04, 'mate', CAP_NEGRO, XD - 0.36, 1.78, s * 1.12, [0, 0, Math.PI / 2], 16);
    /* filtro de aire exterior a cada lado del capot, junto a la cabina */
    var zf = s * (cp.hw(XCF - 0.40) + 0.22);
    D.cilindro(null, 0.20, 0.20, 0.62, 'pintura', CAP_NEGRO, XCF - 0.42, 1.90, zf, [0, 0, Math.PI / 2], 26);
    [-0.22, 0.22].forEach(function(dx){ D.cilindro(null, 0.206, 0.206, 0.04, 'cromo', null, XCF - 0.42 + dx, 1.90, zf, [0, 0, Math.PI / 2], 26); });
    D.cilindro(null, 0.10, 0.10, 0.12, 'cromo', null, XCF - 0.78, 1.90, zf, [0, 0, Math.PI / 2], 18);
    D.tubo(null, [XCF - 0.12, 1.90, zf], [XCF - 0.05, 1.70, s * (cp.hw(XCF) - 0.05)], 0.07, 'goma', '#1A1C1F', 14);
    D.bloque(null, 0.08, 0.30, 0.06, 'pintura', CAP_NEGRO, XCF - 0.42, 1.65, zf, 0.01);
  });
  return cp;
}

/* el bulldog cromado de Mack sobre la nariz del capot */
function capBulldog(D, x, y){
  var cro = 'cromo';
  var cuerpo = D.pon(null, new THREE.SphereGeometry(0.08, 18, 12), cro, null, x + 0.05, y + 0.07, 0); cuerpo.scale.set(1.5, 0.75, 0.75);
  var pecho = D.pon(null, new THREE.SphereGeometry(0.07, 16, 12), cro, null, x - 0.04, y + 0.075, 0); pecho.scale.set(0.9, 0.95, 1.05);
  var cab = D.pon(null, new THREE.SphereGeometry(0.052, 16, 12), cro, null, x - 0.10, y + 0.11, 0); cab.scale.set(0.9, 0.85, 1.1);
  var hoc = D.pon(null, new THREE.SphereGeometry(0.035, 12, 10), cro, null, x - 0.145, y + 0.095, 0); hoc.scale.set(0.8, 0.8, 1.2);
  [-1, 1].forEach(function(s){
    D.tubo(null, [x - 0.05, y + 0.06, s * 0.035], [x - 0.08, y, s * 0.04], 0.016, cro, null, 8);
    D.tubo(null, [x + 0.10, y + 0.06, s * 0.03], [x + 0.13, y, s * 0.035], 0.016, cro, null, 8);
    D.pon(null, new THREE.SphereGeometry(0.016, 8, 6), cro, null, x - 0.11, y + 0.155, s * 0.035);
  });
  D.bloque(null, 0.32, 0.015, 0.10, cro, null, x + 0.02, y + 0.004, 0, 0.005);
}

/* ═══ MACK GRANITE: nariz con bulldog, parrilla cromada alta (la nueva de
   barras horizontales con MACK en el panel de abajo; la GU813E de barras
   verticales con MACK arriba), guardafangos con ceja gris y respiraderos
   en el costado del capot ═══ */
function capFrenteMack(D, P, G){
  var C = P.C, col = C.color, XF = P.XF, XG = P.XG, XD = P.XD, XCF = P.XCF, nuevo = C.nuevo;
  /* parachoques: acero negro en la nueva, cromado en la GU */
  D.bloque(null, 0.22, 0.40, 2.46, nuevo ? 'pintura' : 'cromo', nuevo ? '#1E2023' : null, XF + 0.11, 0.74, 0, 0.04);
  D.bloque(null, 0.10, 0.08, 2.30, 'mate', CAP_NEGRO, XF + 0.16, 0.51, 0, 0.02);
  [-0.62, 0.62].forEach(function(z){ D.bloque(null, 0.06, 0.12, 0.16, 'mate', '#0E0F11', XF - 0.005, 0.80, z, 0.01); });
  /* parrilla */
  if(nuevo){
    capParrilla(D, P, G, { x: XG, hz: 0.50, y0: 1.10, y1: 1.86, barras: 7, vertical: false, t: 0.07, grosor: 0.035, malla: 22 });
    /* panel gris bajo la parrilla con MACK */
    D.bloque(null, 0.08, 0.17, 1.30, 'mate', '#3A3E43', XG - 0.01, 1.02, 0, 0.02);
    capCartel(G, capTexTexto('M A C K', '#D9DDE1', 'bold # "Arial Black", Arial, sans-serif', 512, 80), 0.80, 0.13, XG - 0.052, 1.02, 0, -Math.PI / 2);
  } else {
    capParrilla(D, P, G, { x: XG, hz: 0.50, y0: 0.98, y1: 1.80, barras: 16, vertical: true, t: 0.06, grosor: 0.022, malla: 26 });
    D.bloque(null, 0.08, 0.11, 1.06, 'cromo', null, XG - 0.01, 1.85, 0, 0.02);
    capCartel(G, capTexTexto('M A C K', '#2A2E33', 'bold # "Arial Black", Arial, sans-serif', 512, 80), 0.62, 0.09, XG - 0.052, 1.85, 0, -Math.PI / 2);
  }
  /* capot */
  var cp = capCapo(D, P, [[XG + 0.03, 0.54, 0.52, nuevo ? 1.08 : 0.98, 1.90, 0.08, 0.01], [XG + 0.25, 0.64, 0.61, 1.04, 1.98, 0.14, 0.02],
    [XG + 0.70, 0.78, 0.73, 1.06, 2.07, 0.18, 0.03], [XCF + 0.03, 0.90, 0.84, 1.08, 2.16, 0.20, 0.03]], col);
  capBulldog(D, XG + 0.12, cp.y1(XG + 0.12) + 0.01);
  /* guardafangos y ceja gris */
  capGuardafango(D, P, { x0: XF + 0.30, yBajo: 0.92, yFrente: 1.32, yTop: 1.52, xFin: XD + 0.84, yFin: 1.00, yAtras: 0.54,
    a1: -0.03, a2: Math.PI - 0.40, z0: 0.62, z1: 1.20, r: 0.06, hex: col });
  capCeja(D, P, 1.17, -0.03, Math.PI - 0.40, 0.08);
  var texGr = capTexTexto('GRANITE', '#E4E8EC', 'bold # Arial, sans-serif', 512, 80, '#30343A');
  [-1, 1].forEach(function(s){
    /* faros: carcasa horizontal con dos focos en la nueva, rectangulares en la GU */
    if(nuevo){
      D.bloque(null, 0.08, 0.17, 0.42, 'mate', '#1A1C1F', XF + 0.33, 1.20, s * 0.92, 0.06);
      D.bloque(null, 0.02, 0.15, 0.40, 'cromo', null, XF + 0.30, 1.20, s * 0.92, 0.05);
      D.faro(s > 0 ? 'FDI' : 'FDD', XF + 0.29, 1.20, s * 0.84, 0.055);
      D.faro(s > 0 ? 'FDI' : 'FDD', XF + 0.29, 1.20, s * 1.00, 0.055);
    } else {
      capFaroRect(D, s > 0 ? 'FDI' : 'FDD', XF + 0.30, 1.16, s * 0.92, 0.38, 0.15);
    }
    D.bloque('LSM', 0.03, 0.06, 0.14, 'vidrio', '#F0A020', XF + 0.30, 1.38, s * 1.02, 0.01);
    /* tres respiraderos con borde cromado en el costado del capot */
    for(var k = 0; k < 3; k++){
      var x = XG + 0.66 + k * 0.10, z = s * (cp.hw(x) + 0.004);
      D.bloque(null, 0.06, 0.26, 0.012, 'cromo', null, x, 1.72, z, 0.004);
      D.bloque(null, 0.04, 0.22, 0.014, 'mate', '#0B0C0E', x, 1.72, z + s * 0.002, 0.003);
    }
    capCartel(G, texGr, 0.46, 0.07, XCF - 0.40, 1.95, s * (cp.hw(XCF - 0.40) + 0.008), s > 0 ? 0 : Math.PI);
  });
  return cp;
}

/* ═══ INTERNATIONAL 5600i (PayStar): frente ancho y plano de punta a punta,
   parrilla rectangular de barras verticales en marco negro, diamante encima,
   faros cuadrados en las esquinas bajas, capot de caja ═══ */
function capFrente5600(D, P, G){
  var C = P.C, col = C.color, XF = P.XF, XG = P.XG, XD = P.XD, XCF = P.XCF, RL = P.RL, ra = RL + 0.10;
  D.bloque(null, 0.22, 0.32, 2.50, 'cromo', null, XF + 0.11, 0.76, 0, 0.04);
  D.bloque(null, 0.10, 0.06, 2.36, 'mate', CAP_NEGRO, XF + 0.16, 0.57, 0, 0.02);
  [-0.42, 0.42].forEach(function(z){ D.bloque(null, 0.03, 0.09, 0.22, 'mate', '#0E0F11', XF - 0.005, 0.78, z, 0.02); });
  /* guardafangos de caja: frente vertical y techo plano, arco solo arriba */
  var aT = Math.asin((1.00 - RL) / ra), aF = Math.PI - Math.asin((0.92 - RL) / ra);
  var pts = [[XG, 0.92], [XG, 1.58], [XCF + 0.02, 1.58], [XCF + 0.02, 1.00]].concat(capArco(XD, RL, ra, aT, aF, 12));
  [-1, 1].forEach(function(s){ D.perfil(null, pts, 0.46, s * 0.95, 'pintura', col, 0.03); });
  capCeja(D, P, 1.16, aT, aF, 0.06);
  /* caja del radiador al centro y capot de caja encima */
  D.bloque(null, 0.30, 0.62, 1.44, 'pintura', col, XG + 0.15, 1.23, 0, 0.02);
  var cp = capCapo(D, P, [[XG, 1.17, 1.04, 1.50, 1.98, 0.10, 0.01], [XG + 0.10, 1.17, 1.05, 1.50, 2.01, 0.14, 0.015],
    [XCF - 0.30, 1.13, 1.02, 1.50, 2.08, 0.16, 0.02], [XCF + 0.03, 1.08, 0.98, 1.50, 2.10, 0.16, 0.02]], col, true);
  /* marco negro hundido, parrilla de barras verticales y diamante */
  D.bloque(null, 0.05, 0.86, 1.20, 'mate', '#121315', XG - 0.005, 1.38, 0, 0.03);
  capParrilla(D, P, G, { x: XG - 0.02, hz: 0.53, y0: 1.00, y1: 1.76, barras: 18, vertical: true, t: 0.04, grosor: 0.02,
    tipoMarco: 'pintura', hexMarco: col, malla: 26 });
  capCartel(G, capTexDiamanteIH(), 0.17, 0.17, XG - 0.035, 1.87, 0, -Math.PI / 2);
  [-1, 1].forEach(function(s){
    /* faro cuadrado en su nicho negro y luz ambar encima */
    D.bloque(null, 0.05, 0.25, 0.34, 'mate', '#121315', XG - 0.005, 1.10, s * 0.92, 0.03);
    D.bloque(null, 0.02, 0.17, 0.22, 'metal', '#E8ECEF', XG - 0.03, 1.10, s * 0.92, 0.006);
    D.bloque(s > 0 ? 'FDI' : 'FDD', 0.02, 0.14, 0.18, 'vidrio', '#F4F0DC', XG - 0.04, 1.10, s * 0.92, 0.006);
    D.bloque(null, 0.04, 0.10, 0.14, 'mate', '#121315', XG - 0.005, 1.45, s * 1.03, 0.02);
    D.bloque('LSM', 0.02, 0.08, 0.12, 'vidrio', '#F0A020', XG - 0.03, 1.45, s * 1.03, 0.006);
    capCartel(G, capTexTexto('5600i', '#E4E8EC', 'bold italic # Arial, sans-serif', 256, 80, '#30343A'), 0.24, 0.075, XG + 0.55, 1.68, s * 1.186, s > 0 ? 0 : Math.PI);
    capCartel(G, capTexTexto('PAYSTAR', '#E4E8EC', 'bold # Arial, sans-serif', 512, 80, '#30343A'), 0.40, 0.065, XCF - 0.40, 1.68, s * 1.186, s > 0 ? 0 : Math.PI);
  });
  return cp;
}

/* ═══ INTERNATIONAL 7600 (WorkStar): capot inclinado, gran parrilla cromada
   de barras verticales con el diamante arriba, faros redondos dobles en
   carcasa negra, cejas negras y respiradero en el costado ═══ */
function capFrente7600(D, P, G){
  var C = P.C, col = C.color, XF = P.XF, XG = P.XG, XD = P.XD, XCF = P.XCF;
  D.bloque(null, 0.24, 0.38, 2.50, 'cromo', null, XF + 0.12, 0.75, 0, 0.05);
  D.bloque(null, 0.12, 0.10, 2.30, 'mate', CAP_NEGRO, XF + 0.18, 0.52, 0, 0.02);
  D.bloque(null, 0.02, 0.05, 1.10, 'vidrio', '#F2A51C', XF - 0.005, 0.90, 0, 0.01);
  [-1, 1].forEach(function(s){
    D.bloque(null, 0.03, 0.10, 0.20, 'mate', '#202326', XF - 0.005, 0.70, s * 0.85, 0.01);
    D.bloque('FNB', 0.02, 0.07, 0.16, 'vidrio', '#F4F0DC', XF - 0.015, 0.70, s * 0.85, 0.005);
  });
  capParrilla(D, P, G, { x: XG, hz: 0.58, y0: 0.98, y1: 1.88, barras: 16, vertical: true, t: 0.09, grosor: 0.025, malla: 24 });
  var cp = capCapo(D, P, [[XG + 0.03, 0.62, 0.60, 0.98, 1.94, 0.08, 0.01], [XG + 0.32, 0.76, 0.72, 1.02, 2.04, 0.15, 0.02],
    [XG + 0.75, 0.88, 0.82, 1.04, 2.12, 0.20, 0.03], [XCF + 0.03, 0.96, 0.90, 1.06, 2.20, 0.22, 0.03]], col);
  capCartel(G, capTexDiamanteIH(), 0.20, 0.20, XG - 0.05, 1.88, 0, -Math.PI / 2);
  capGuardafango(D, P, { x0: XF + 0.30, yBajo: 0.90, yFrente: 1.30, yTop: 1.50, xFin: XD + 0.80, yFin: 0.98, yAtras: 0.52,
    a1: -0.03, a2: Math.PI - 0.36, z0: 0.66, z1: 1.20, r: 0.07, hex: col });
  capCeja(D, P, 1.18, -0.03, Math.PI - 0.36, 0.09);
  var texWS = capTexTexto('WorkStar', '#E4E8EC', 'bold italic # Arial, sans-serif', 512, 80, '#30343A');
  [-1, 1].forEach(function(s){
    /* faros redondos dobles en carcasa negra con borde cromado */
    D.bloque(null, 0.10, 0.22, 0.46, 'mate', '#16181B', XF + 0.35, 1.20, s * 0.93, 0.07);
    D.bloque(null, 0.02, 0.24, 0.48, 'cromo', null, XF + 0.30, 1.20, s * 0.93, 0.06);
    D.faro(s > 0 ? 'FDI' : 'FDD', XF + 0.28, 1.20, s * 0.84, 0.065);
    D.faro(s > 0 ? 'FDI' : 'FDD', XF + 0.28, 1.20, s * 1.02, 0.065);
    D.bloque('LSM', 0.08, 0.05, 0.03, 'vidrio', '#F0A020', XD - 0.55, 1.36, s * 1.20, 0.008);
    /* respiradero negro de lamas en el costado del capot, junto a la cabina */
    var xv = XCF - 0.40, zv = s * (cp.hw(xv) + 0.004);
    D.bloque(null, 0.34, 0.20, 0.012, 'mate', '#121315', xv, 1.80, zv, 0.004);
    for(var k = 0; k < 5; k++) D.bloque(null, 0.025, 0.17, 0.016, 'mate', '#2A2D31', xv - 0.13 + k * 0.065, 1.80, zv + s * 0.004, 0.003);
    capCartel(G, texWS, 0.44, 0.07, XG + 0.62, 1.84, s * (cp.hw(XG + 0.62) + 0.008), s > 0 ? 0 : Math.PI);
  });
  /* guardafango de cuarto negro sobre el segundo eje direccional */
  if(P.XD2){
    [-1, 1].forEach(function(s){
      var g = new THREE.CylinderGeometry(P.RL + 0.10, P.RL + 0.10, 0.40, 28, 1, true, -Math.PI * 0.45, Math.PI * 0.9);
      var m = D.pon(null, g, 'mate', '#1C1E21', P.XD2, P.RL, s * P.ZD, [Math.PI / 2, 0, 0]);
      m.material.side = THREE.DoubleSide;
    });
  }
  return cp;
}

/* ═══ cuerpo de ANFO: tolva de nitrato de inoxidable con fondo en V, tornillo
   inferior, columna vertical detras de la cabina con el tornillo pluma
   recogido sobre la tolva, escalera, barandas plegables, gabinetes y tanque
   de petroleo bajo la tolva, puesto de mando atras, rombos 1.5D y placa UN ═══ */
function capAnfo(D, P, G, cab){
  var C = P.C, XB0 = P.XCB + 0.40, XB1 = P.XC, YR = P.YR, YD = YR + 0.16;
  var TX0 = XB0 + 0.62, TX1 = XB1 - 0.72, HW = 1.22, YV = YD + 0.95, YTT = Math.min(3.62, P.YT + 0.58);
  var INOX = CAP_INOX, NEG = '#1E2023';
  /* subchasis y travesanos */
  [-1, 1].forEach(function(s){ D.bloque(null, XB1 - XB0, 0.14, 0.11, 'metal', '#4A5058', (XB0 + XB1) / 2, YR + 0.07, s * P.ZR, 0.015); });
  var sl = [];
  for(var x = XB0 + 0.20; x < XB1; x += 0.60) sl.push([x, YD - 0.03, 0]);
  capInst(D, null, new THREE.BoxGeometry(0.09, 0.10, HW * 2 - 0.10), 'metal', '#4A5058', sl);
  /* plataforma delantera de rejilla al pie de la escalera */
  capConTex(D, null, new THREE.BoxGeometry(TX0 - XB0, 0.04, HW * 2 - 0.10), capTexDiamante(), '#C8CDD2', 0.4, 0.7, (XB0 + TX0) / 2, YD + 0.02, 0);

  /* ═══ tolva: fondo en V y paredes rectas ═══ */
  D.perfilX('TLV', [[-0.28, YD + 0.24], [0.28, YD + 0.24], [HW, YV], [HW, YTT], [-HW, YTT], [-HW, YV]], TX1 - TX0, (TX0 + TX1) / 2, 'metal', INOX, 0.03);
  /* nervios verticales que siguen por la pendiente, cinta superior y faja en el quiebre */
  var nerv = [], paso = (TX1 - TX0 - 0.16) / Math.max(4, Math.round((TX1 - TX0) / 0.62)), xr;
  for(xr = TX0 + 0.08; xr <= TX1 - 0.07; xr += paso) [-1, 1].forEach(function(s){ nerv.push([xr, (YV + YTT) / 2, s * (HW + 0.022)]); });
  capInst(D, null, new THREE.BoxGeometry(0.07, YTT - YV - 0.04, 0.045), 'metal', '#A9B0B7', nerv);
  var ang = Math.atan2(YV - (YD + 0.24), HW - 0.28), Ls = Math.hypot(YV - YD - 0.24, HW - 0.28);
  var nervP = [];
  nerv.forEach(function(q){
    var s = q[2] > 0 ? 1 : -1, zc = s * ((0.28 + HW) / 2 + 0.03 * Math.sin(ang)), yc = (YD + 0.24 + YV) / 2 - 0.03 * Math.cos(ang);
    nervP.push([q[0], yc, zc, s * (Math.PI / 2 - ang), 0, 0]);
  });
  capInst(D, null, new THREE.BoxGeometry(0.07, Ls - 0.06, 0.045), 'metal', '#A9B0B7', nervP);
  [-1, 1].forEach(function(s){
    D.bloque('TLV', TX1 - TX0 + 0.10, 0.10, 0.08, 'metal', '#A9B0B7', (TX0 + TX1) / 2, YTT - 0.03, s * (HW + 0.03), 0.02);
    D.bloque('TLV', TX1 - TX0 + 0.06, 0.08, 0.07, 'metal', '#A9B0B7', (TX0 + TX1) / 2, YV, s * (HW + 0.025), 0.02);
  });
  /* esquineros de las tapas delantera y trasera */
  [TX0, TX1].forEach(function(xx){
    [-1, 1].forEach(function(s){ D.bloque(null, 0.08, YTT - YV, 0.08, 'metal', '#A9B0B7', xx, (YV + YTT) / 2, s * (HW - 0.01), 0.015); });
  });
  /* patas de la tolva sobre el subchasis */
  [TX0 + 0.20, (TX0 + TX1) / 2, TX1 - 0.20].forEach(function(xx){
    [-1, 1].forEach(function(s){ D.tubo(null, [xx, YD + 0.02, s * (HW - 0.10)], [xx, YV - 0.05, s * (HW - 0.02)], 0.035, 'metal', '#8C939A', 8); });
  });
  /* techo: pasarela de rejilla, tres escotillas y barandas plegables */
  capConTex(D, null, new THREE.BoxGeometry(TX1 - TX0 - 0.20, 0.03, 0.62), capTexDiamante(), '#B9BEC4', 0.45, 0.7, (TX0 + TX1) / 2, YTT + 0.015, -0.30);
  for(var h = 0; h < 3; h++){
    var xh = TX0 + (TX1 - TX0) * (h + 0.5) / 3;
    D.cilindro(null, 0.27, 0.27, 0.10, 'metal', '#B0B7BE', xh, YTT + 0.05, 0.50, null, 28);
    D.cilindro(null, 0.29, 0.29, 0.03, 'metal', '#9AA1A8', xh, YTT + 0.11, 0.50, null, 28);
    D.bloque(null, 0.06, 0.05, 0.10, 'metal', '#6E757C', xh + 0.29, YTT + 0.10, 0.50, 0.01);
  }
  [-1, 1].forEach(function(s){ D.baranda([[TX0 + 0.06, s * (HW - 0.05)], [TX1 - 0.06, s * (HW - 0.05)]], YTT, 0.95, '#E5C21A'); });
  D.baranda([[TX1 - 0.06, -(HW - 0.05)], [TX1 - 0.06, HW - 0.05]], YTT, 0.95, '#E5C21A');

  /* tornillo inferior bajo la V, que lleva el producto hacia adelante */
  D.cilindro(null, 0.15, 0.15, TX1 - TX0 + 0.30, 'metal', '#A0A7AE', (TX0 + TX1) / 2 - 0.15, YD + 0.13, 0, [0, 0, Math.PI / 2], 20);
  D.cilindro('PYM', 0.10, 0.10, 0.22, 'pintura', '#2B2F34', TX1 + 0.15, YD + 0.13, 0, [0, 0, Math.PI / 2], 16);
  D.bloque(null, 0.30, 0.34, 0.34, 'metal', '#A0A7AE', XB0 + 0.26, YD + 0.17, -0.40, 0.03);
  D.tubo(null, [XB0 + 0.40, YD + 0.13, -0.30], [TX0 - 0.10, YD + 0.13, 0], 0.15, 'metal', '#A0A7AE', 18);

  /* ═══ columna vertical y tornillo pluma ═══ */
  var XCOL = XB0 + 0.26, ZCOL = -0.70, YCT = YTT + 0.62;
  D.cilindro(null, 0.17, 0.17, YCT - YD - 0.30, 'metal', '#A0A7AE', XCOL, (YCT + YD + 0.30) / 2, ZCOL, null, 22);
  [YD + 0.80, YD + 1.60, YTT - 0.10].forEach(function(y){ D.cilindro(null, 0.20, 0.20, 0.04, 'metal', '#7D848B', XCOL, y, ZCOL, null, 22); });
  D.cilindro(null, 0.26, 0.26, 0.07, 'pintura', '#2B2F34', XCOL, YCT + 0.02, ZCOL, null, 26);
  D.bloque('PYM', 0.46, 0.30, 0.44, 'pintura', '#2B2F34', XCOL, YCT + 0.20, ZCOL, 0.04);
  D.cilindro('PYM', 0.09, 0.09, 0.22, 'pintura', '#202326', XCOL - 0.10, YCT + 0.46, ZCOL + 0.10, null, 16);
  var pivote = [XCOL + 0.12, YCT + 0.22, ZCOL], resto = [TX1 - 0.15, YTT + 0.48, ZCOL];
  D.tubo(null, pivote, resto, 0.125, 'metal', '#A0A7AE', 20);
  var fb = function(f){ return [pivote[0] + (resto[0] - pivote[0]) * f, pivote[1] + (resto[1] - pivote[1]) * f, ZCOL]; };
  [0.25, 0.5, 0.75].forEach(function(f){ var p = fb(f); D.cilindro(null, 0.15, 0.15, 0.04, 'metal', '#7D848B', p[0], p[1], ZCOL, [0, 0, Math.PI / 2 + Math.atan2(resto[1] - pivote[1], resto[0] - pivote[0])], 20); });
  /* boca de descarga en la punta y su manga */
  D.tubo(null, resto, [resto[0] + 0.22, resto[1] - 0.18, ZCOL], 0.11, 'metal', '#A0A7AE', 16);
  D.tubo(null, [resto[0] + 0.25, resto[1] - 0.20, ZCOL], [resto[0] + 0.30, resto[1] - 0.95, ZCOL], 0.085, 'goma', '#1B1D20', 14);
  /* cuna donde descansa la pluma */
  D.tubo(null, [TX1 - 0.15, YTT, ZCOL], [TX1 - 0.15, YTT + 0.34, ZCOL], 0.04, 'metal', '#5C6268', 8);
  D.bloque(null, 0.10, 0.06, 0.34, 'goma', NEG, TX1 - 0.15, YTT + 0.36, ZCOL, 0.02);
  /* cilindro de levante de la pluma y mangueras */
  var pc = fb(0.16);
  D.cilHidD('PHY', [XCOL + 0.18, YTT + 0.05, ZCOL + 0.06], [pc[0], pc[1] - 0.12, ZCOL + 0.06], 0.05, '#2B2F34', 0.55);
  [0.06, -0.06].forEach(function(dz){
    D.tubo('LPH', [XCOL - 0.14, YD + 0.30, ZCOL + dz], [XCOL - 0.14, YCT + 0.05, ZCOL + dz], 0.016, 'goma', '#111', 6);
    D.tubo('LPH', [pivote[0] + 0.1, pivote[1] + 0.12, ZCOL + dz * 1.6], [resto[0] - 0.2, resto[1] + 0.12, ZCOL + dz * 1.6], 0.014, 'goma', '#111', 6);
  });

  /* escalera al techo delante de la tolva, con aros de pasamanos arriba */
  D.escalera(TX0 - 0.10, 0.62, YD + 0.04, YTT, 0.46, '#E5C21A', '#5C6268');
  [0.39, 0.85].forEach(function(z){
    D.tubo(null, [TX0 - 0.10, YTT - 0.05, z], [TX0 - 0.10, YTT + 0.95, z], 0.024, 'pintura', '#E5C21A', 8);
    D.tubo(null, [TX0 - 0.10, YTT + 0.95, z], [TX0 + 0.08, YTT + 0.95, z], 0.024, 'pintura', '#E5C21A', 8);
  });

  /* ═══ bajo la tolva: tanque de petroleo a la derecha, gabinetes, extintores ═══ */
  var XG0 = XB0 + 0.12, XG1 = P.X1 - P.RL - 0.20, YG0 = YR - 0.58, YG1 = YR + 0.12;
  var LFO = Math.min(1.30, (XG1 - XG0) * 0.48);
  D.cilindro(null, 0.30, 0.30, LFO, 'pintura', '#ECEDEB', XG0 + LFO / 2, YR - 0.24, -0.86, [0, 0, Math.PI / 2], 26);
  [0.15, LFO - 0.15].forEach(function(dx){ D.pon(null, new THREE.TorusGeometry(0.305, 0.014, 8, 32), 'mate', NEG, XG0 + dx, YR - 0.24, -0.86, [0, Math.PI / 2, 0]); });
  D.cilindro(null, 0.06, 0.06, 0.06, 'mate', NEG, XG0 + 0.30, YR + 0.08, -0.86, null, 14);
  var gab = function(x0, x1, s){
    var zc = s * (HW - 0.36);
    D.bloque(null, x1 - x0, YG1 - YG0, 0.68, 'metal', INOX, (x0 + x1) / 2, (YG0 + YG1) / 2, zc, 0.02);
    var nP = Math.max(1, Math.round((x1 - x0) / 0.70)), w = (x1 - x0) / nP;
    for(var k = 0; k < nP; k++){
      var xm = x0 + w * (k + 0.5);
      D.bloque(null, w - 0.06, YG1 - YG0 - 0.08, 0.012, 'metal', '#D3D8DC', xm, (YG0 + YG1) / 2, s * (HW - 0.015), 0.006);
      D.bloque(null, 0.10, 0.04, 0.03, 'cromo', null, xm, YG1 - 0.12, s * (HW + 0.002), 0.008);
    }
  };
  gab(XG0 + LFO + 0.08, XG1, -1);
  gab(XG0 + 0.62, XG1, 1);
  /* extintores rojos delante del gabinete izquierdo */
  [0, 0.24].forEach(function(dx){
    D.cilindro('SCI', 0.08, 0.08, 0.50, 'pintura', '#C8201A', XG0 + 0.20 + dx, YR - 0.24, HW - 0.14, null, 18);
    D.cilindro(null, 0.03, 0.03, 0.08, 'mate', NEG, XG0 + 0.20 + dx, YR + 0.06, HW - 0.14, null, 10);
    D.bloque(null, 0.18, 0.04, 0.05, 'mate', NEG, XG0 + 0.20 + dx, YR - 0.20, HW - 0.04, 0.01);
  });
  /* cuñas amarillas colgadas */
  D.perfil(null, [[XG1 - 0.40, YG0 - 0.02], [XG1 - 0.10, YG0 - 0.02], [XG1 - 0.10, YG0 + 0.16]], 0.20, HW + 0.12, 'pintura', '#E5C21A', 0.02);

  /* ═══ atras: puesto de mando, carrete de manguera, parachoques y luces ═══ */
  var XM = (TX1 + XB1) / 2;
  D.bloque('TAB', XB1 - TX1 - 0.12, 1.10, 0.80, 'metal', INOX, XM, YD + 0.58, -0.72, 0.03);
  D.bloque(null, 0.012, 0.92, 0.66, 'metal', '#D3D8DC', XB1 - 0.05, YD + 0.58, -0.72, 0.006);
  D.bloque(null, 0.03, 0.05, 0.12, 'cromo', null, XB1 - 0.04, YD + 0.80, -0.48, 0.01);
  [0.40, 0.75].forEach(function(r, k){
    D.cilindro(null, k ? 0.04 : 0.32, k ? 0.04 : 0.32, k ? 0.66 : 0.03, k ? 'metal' : 'pintura', k ? '#6E757C' : '#2B2F34',
      XM, YD + 0.55, 0.62 + (k ? 0 : 0.30), [Math.PI / 2, 0, 0], 26);
  });
  D.cilindro(null, 0.32, 0.32, 0.03, 'pintura', '#2B2F34', XM, YD + 0.55, 0.32, [Math.PI / 2, 0, 0], 26);
  D.cilindro(null, 0.24, 0.24, 0.56, 'goma', '#1B1D20', XM, YD + 0.55, 0.62, [Math.PI / 2, 0, 0], 26);
  /* parachoques trasero con cinta reflectiva roja y blanca */
  D.bloque(null, 0.12, 0.14, 2.30, 'pintura', NEG, XB1 + 0.08, 0.56, 0, 0.02);
  [-0.40, 0.40].forEach(function(z){ D.bloque(null, 0.08, YR - 0.62, 0.08, 'pintura', NEG, XB1 + 0.02, (YR + 0.56) / 2, z, 0.01); });
  var cintaR = [], cintaB = [];
  for(var c = 0; c < 10; c++) (c % 2 ? cintaB : cintaR).push([XB1 + 0.142, 0.56, -1.04 + c * 0.231]);
  capInst(D, null, new THREE.BoxGeometry(0.01, 0.07, 0.22), 'vidrio', '#C62A1E', cintaR);
  capInst(D, null, new THREE.BoxGeometry(0.01, 0.07, 0.22), 'mate', '#F2F2F2', cintaB);
  [-1, 1].forEach(function(s){
    D.bloque(null, 0.06, 0.18, 0.34, 'mate', NEG, XB1 + 0.02, YR - 0.10, s * 0.92, 0.02);
    D.bloque(s > 0 ? 'FPI' : 'FPD', 0.02, 0.12, 0.13, 'vidrio', '#C2241B', XB1 + 0.055, YR - 0.10, s * 0.99, 0.006);
    D.bloque('LSM', 0.02, 0.12, 0.13, 'vidrio', '#F2A51C', XB1 + 0.055, YR - 0.10, s * 0.84, 0.006);
  });
  D.bloque(null, 0.01, 0.15, 0.30, 'mate', '#F2F2F2', XB1 + 0.06, YR - 0.32, 0, 0.004);

  /* ═══ rombos 1.5D, placas UN 0331, letrero EXPLOSIVOS, numero y bandera ═══ */
  var texR = capTexRombo(), texUN = capTexUN('0331');
  var xr0 = (TX0 + TX1) / 2 - 0.55, ym = (YV + YTT) / 2;
  [-1, 1].forEach(function(s){
    var z = s * (HW + 0.05), ry = s > 0 ? 0 : Math.PI;
    capCartel(G, texR, 0.62, 0.62, xr0, ym + 0.08, z, ry);
    capCartel(G, texUN, 0.48, 0.19, xr0 + (s > 0 ? 0.70 : -0.70) * 1, ym + 0.08, z, ry);
    var mn = new THREE.Mesh(new THREE.PlaneGeometry(0.90, 0.29), cab.matNum);
    mn.position.set(TX0 + 0.62, YTT - 0.30, s * (HW + 0.05)); mn.rotation.y = ry; G.add(mn);
  });
  capCartel(G, texR, 0.62, 0.62, TX1 + 0.05, ym + 0.05, 0.40, Math.PI / 2);
  capCartel(G, texUN, 0.48, 0.19, TX1 + 0.05, ym + 0.05, -0.40, Math.PI / 2);
  capCartel(G, texR, 0.36, 0.36, P.XF - 0.012, 0.76, 0.62, -Math.PI / 2);
  /* letrero EXPLOSIVOS sobre el techo de la cabina */
  var xe = P.XCF + C.rake + 0.30;
  [-0.55, 0.55].forEach(function(z){ D.tubo(null, [xe, P.YT + 0.03, z], [xe, P.YT + 0.30, z], 0.018, 'metal', '#3A3F45', 6); });
  D.bloque(null, 0.04, 0.26, 1.42, 'mate', '#F4F4F2', xe, P.YT + 0.38, 0, 0.01);
  D.letrero(capTexLetrero('EXPLOSIVOS', '#F4F4F2', '#C8201A', '#C8201A'), 1.38, 0.24, xe - 0.022, P.YT + 0.38, 0, -Math.PI / 2);
  D.letrero(capTexLetrero('EXPLOSIVOS', '#F4F4F2', '#C8201A', '#C8201A'), 1.38, 0.24, xe + 0.022, P.YT + 0.38, 0, Math.PI / 2);
  /* bandera roja en un mastil atras */
  D.tubo(null, [TX1 - 0.12, YTT, HW - 0.15], [TX1 - 0.12, YTT + 1.90, HW - 0.15], 0.012, 'metal', '#C9CED3', 6);
  var sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(0.42, -0.13); sh.lineTo(0, -0.26); sh.closePath();
  var fl = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshStandardMaterial({ color: new THREE.Color('#D3221A'), roughness: 0.8, side: THREE.DoubleSide }));
  fl.position.set(TX1 - 0.12, YTT + 1.88, HW - 0.15); fl.rotation.y = -0.4; G.add(fl);
}

/* ═══ cama baja: quinta rueda y accesorios del tracto, y el semirremolque de
   cuello fijo, plataforma rebajada de madera, tres ejes y rampas atras ═══ */
function capCamaBaja(D, P, G, piezas, cab){
  var C = P.C, YR = P.YR, NEG = '#1A1C1F', CB = CAP_CB;
  var XK = P.XT - 0.25, YK = YR + 0.30;
  /* quinta rueda: plato con garganta, soportes y rampas */
  D.bloque(null, 1.00, 0.08, 1.06, 'metal', '#2B2F34', XK, YK - 0.04, 0, 0.02);
  D.bloque(null, 0.50, 0.085, 0.20, 'mate', '#0E0F11', XK + 0.30, YK - 0.04, 0, 0.01);
  [-0.45, 0.45].forEach(function(z){
    D.bloque(null, 0.40, YK - YR - 0.08, 0.10, 'pintura', NEG, XK, (YR + YK - 0.08) / 2, z, 0.015);
    var rp = D.bloque(null, 0.50, 0.03, 0.18, 'metal', '#4A5058', XK + 0.70, YK - 0.14, z, 0.01); rp.rotation.z = -0.22;
  });
  D.bloque(null, 0.16, 0.08, 0.10, 'pintura', '#C8201A', XK - 0.40, YK - 0.04, -0.58, 0.01);
  /* plataforma de rejilla detras de la cabina y rack de mangueras */
  capConTex(D, null, new THREE.BoxGeometry(0.80, 0.03, 1.10), capTexDiamante(), '#C8CDD2', 0.4, 0.7, P.XCB + 0.55, YR + 0.03, 0);
  var xr = P.XCB + 0.38;
  [-0.62, 0.62].forEach(function(z){ D.bloque(null, 0.08, P.YT - YR - 0.20, 0.08, 'pintura', NEG, xr, (YR + P.YT - 0.20) / 2, z, 0.015); });
  D.bloque(null, 0.08, 0.08, 1.32, 'pintura', NEG, xr, P.YT - 0.20, 0, 0.015);
  var rej = [];
  for(var k = 0; k < 7; k++) rej.push([xr, YR + 0.35 + k * 0.20, 0]);
  capInst(D, null, new THREE.BoxGeometry(0.03, 0.03, 1.20), 'pintura', NEG, rej);
  /* mangueras de aire (roja, azul) y cable electrico al cuello, con su catenaria */
  [['#C8201A', 0.10, 'LPA'], ['#2453A8', 0.20, 'LPA'], ['#E5C21A', -0.10, null]].forEach(function(q){
    var a = new THREE.Vector3(xr + 0.06, P.YT - 0.45, q[1]), b = new THREE.Vector3(XK - 0.85, YK + 0.30, q[1] * 1.6);
    var m = new THREE.Vector3((a.x + b.x) / 2, Math.min(a.y, b.y) - 0.35, q[1]);
    var curva = new THREE.CatmullRomCurve3([a, new THREE.Vector3(a.x + 0.15, a.y - 0.10, q[1]), m, b]);
    D.pon(q[2], new THREE.TubeGeometry(curva, 40, 0.014, 6, false), 'goma', q[0], 0, 0, 0);
  });
  /* manguera hidraulica del kit para el cuello */
  D.tubo('LPH', [P.XCF + 1.48, YR - 0.08, -0.24], [xr + 0.05, P.YT - 0.50, -0.30], 0.02, 'goma', '#111', 8);
  /* guardafangos del tandem, planos y negros */
  [-1, 1].forEach(function(s){
    var zc = s * (P.ZO + P.ZI) / 2, yF = 2 * P.RL + 0.10;
    D.bloque(null, P.X2 - P.X1 + 0.70, 0.03, 0.70, 'mate', '#1C1E21', P.XT, yF, zc, 0.01);
    [-1, 1].forEach(function(e){
      var t = D.bloque(null, 0.45, 0.03, 0.70, 'mate', '#1C1E21', P.XT + e * ((P.X2 - P.X1) / 2 + 0.52), yF - 0.12, zc, 0.01);
      t.rotation.z = e * -0.55;
    });
    D.tubo(null, [P.XT, yF, s * (P.ZR + 0.05)], [P.XT, yF, zc], 0.02, 'metal', CAP_GRIS2, 6);
  });
  /* luces del bastidor del tracto */
  [-1, 1].forEach(function(s){ D.bloque('LSM', 0.03, 0.10, 0.18, 'vidrio', '#C2241B', P.XC + 0.01, YR - 0.10, s * 0.32, 0.006); });

  /* ═══ semirremolque ═══ */
  var W = CB.ancho / 2, YW = CB.piso, YC = CB.cola, COL = '#25282C', COL2 = '#3A3E44';
  var XG0 = XK - 0.85, XG1 = XK + 1.75, YGb = YK + 0.02, YGt = YGb + 0.42;
  var XW0 = XG1 + 0.95, XW1 = XW0 + 6.6, XR0 = XW1 + 0.55, XR1 = XK + CB.largo - 0.40;
  /* cuello: vigas laterales, placa superior con frente redondeado, perno rey */
  D.bloque(null, XG1 - XG0, 0.04, 2.40, 'pintura', COL, (XG0 + XG1) / 2, YGt, 0, 0.015);
  [-1, 1].forEach(function(s){ D.bloque(null, XG1 - XG0, YGt - YGb, 0.12, 'pintura', COL, (XG0 + XG1) / 2, (YGb + YGt) / 2, s * 1.14, 0.02); });
  D.bloque(null, 0.10, YGt - YGb, 2.40, 'pintura', COL, XG0, (YGb + YGt) / 2, 0, 0.02);
  [-0.45, 0.45].forEach(function(z){ D.bloque(null, XG1 - XG0 - 0.1, YGt - YGb, 0.14, 'pintura', COL2, (XG0 + XG1) / 2, (YGb + YGt) / 2, z, 0.015); });
  D.bloque(null, 1.10, 0.03, 1.00, 'metal', '#4A5058', XK, YGb - 0.01, 0, 0.01);
  D.cilindro(null, 0.04, 0.04, 0.12, 'metal', '#6E757C', XK, YGb - 0.07, 0, null, 12);
  /* patas de apoyo levantadas con su manivela */
  [-1, 1].forEach(function(s){
    D.bloque(null, 0.12, 0.70, 0.12, 'pintura', COL2, XK + 1.30, YGb - 0.35, s * 0.85, 0.015);
    D.bloque(null, 0.09, 0.30, 0.09, 'metal', '#6E757C', XK + 1.30, YGb - 0.85, s * 0.85, 0.01);
    D.bloque(null, 0.26, 0.04, 0.26, 'metal', '#4A5058', XK + 1.30, YGb - 1.01, s * 0.85, 0.01);
  });
  D.tubo(null, [XK + 1.30, YGb - 0.30, -0.85], [XK + 1.30, YGb - 0.30, 0.85], 0.02, 'metal', '#6E757C', 6);
  /* bajada del cuello: vigas en rampa hasta la plataforma */
  [-1, 1].forEach(function(s){
    D.perfil(null, [[XG1, YGt], [XG1, YGb], [XW0, YW - 0.42], [XW0 + 0.4, YW - 0.42], [XW0 + 0.4, YW], [XW0, YW]], 0.14, s * 0.45, 'pintura', COL2, 0.02);
    D.perfil(null, [[XG1, YGt], [XG1, YGt - 0.20], [XW0, YW - 0.20], [XW0, YW]], 0.10, s * 1.14, 'pintura', COL, 0.02);
  });
  var lb = Math.hypot(XW0 - XG1, YGt - YW), ab = Math.atan2(YW - YGt, XW0 - XG1);
  var pl = D.bloque(null, lb, 0.04, 2.36, 'pintura', COL, (XG1 + XW0) / 2, (YGt + YW) / 2, 0, 0.015); pl.rotation.z = ab;
  /* plataforma baja: vigas principales, travesanos, largueros laterales y piso de madera */
  [-0.45, 0.45].forEach(function(z){ D.bloque(null, XW1 - XW0, 0.46, 0.14, 'pintura', COL2, (XW0 + XW1) / 2, YW - 0.23, z, 0.02); });
  [-1, 1].forEach(function(s){ D.bloque(null, XR1 - XW0, 0.26, 0.10, 'pintura', COL, (XW0 + XR1) / 2, YW - 0.11, s * (W - 0.05), 0.02); });
  var tv = [];
  for(var xt = XW0 + 0.3; xt < XW1; xt += 0.60) tv.push([xt, YW - 0.12, 0]);
  capInst(D, null, new THREE.BoxGeometry(0.08, 0.18, W * 2 - 0.12), 'pintura', COL2, tv);
  var texM = capTexMadera(); texM.repeat.set((XW1 - XW0) / 1.2, 2);
  capConTex(D, null, new THREE.BoxGeometry(XW1 - XW0, 0.05, W * 2 - 0.20), texM, '#FFFFFF', 0.85, 0.02, (XW0 + XW1) / 2, YW + 0.005, 0);
  /* cola sobre los ejes: subida corta y plataforma alta */
  var lc = Math.hypot(XR0 - XW1, YC - YW), ac = Math.atan2(YC - YW, XR0 - XW1);
  var sb = D.bloque(null, lc, 0.06, W * 2 - 0.10, 'pintura', COL, (XW1 + XR0) / 2, (YW + YC) / 2, 0, 0.015); sb.rotation.z = ac;
  [-0.45, 0.45].forEach(function(z){
    D.perfil(null, [[XW1, YW], [XW1, YW - 0.46], [XR0 + 0.3, YC - 0.40], [XR1, YC - 0.40], [XR1, YC], [XR0, YC]], 0.14, z, 'pintura', COL2, 0.02);
  });
  var texM2 = capTexMadera(); texM2.repeat.set((XR1 - XR0) / 1.2, 2);
  capConTex(D, null, new THREE.BoxGeometry(XR1 - XR0, 0.05, W * 2 - 0.10), texM2, '#FFFFFF', 0.85, 0.02, (XR0 + XR1) / 2, YC + 0.005, 0);
  [-1, 1].forEach(function(s){ D.bloque(null, XR1 - XR0, 0.22, 0.10, 'pintura', COL, (XR0 + XR1) / 2, YC - 0.10, s * (W - 0.05), 0.02); });
  /* cinta reflectiva y luces de galibo en los costados */
  var amb = [], cin = [];
  for(var xa = XG0 + 0.4; xa < XR1; xa += 1.4){
    var ya = xa < XG1 ? (YGb + YGt) / 2 : xa < XW0 ? YW : xa < XW1 ? YW - 0.11 : YC - 0.10;
    if(xa > XG1 && xa < XW0) continue;
    [-1, 1].forEach(function(s){
      var zz = xa < XG1 ? s * 1.205 : s * (W + 0.002);
      amb.push([xa, ya, zz]); cin.push([xa + 0.45, ya, zz]);
    });
  }
  capInst(D, 'LSM', new THREE.BoxGeometry(0.08, 0.06, 0.02), 'vidrio', '#F2A51C', amb);
  capInst(D, null, new THREE.BoxGeometry(0.50, 0.05, 0.012), 'vidrio', '#C62A1E', cin);
  /* tres ejes con muelles y balancines; llantas 235/75R17.5 duales sin codigo */
  var ejes = [XR0 + 0.95, XR0 + 2.30, XR0 + 3.65], zO = 1.25 - CB.al / 2 - 0.02, zI = zO - 0.30;
  var oT = { r: CB.r, ancho: CB.al, rAro: CB.rAro, aro: '#C8CDD2', trac: true };
  ejes.forEach(function(xe, k){
    D.cilindro(null, 0.07, 0.07, zI * 2 - 0.20, 'pintura', COL2, xe, CB.r, 0, [Math.PI / 2, 0, 0], 14);
    [-1, 1].forEach(function(s){
      D.cilindro(null, 0.17, 0.17, 0.18, 'metal', '#33373C', xe, CB.r, s * (zI - 0.17), [Math.PI / 2, 0, 0], 22);
      capMuelle(D, null, xe, CB.r + 0.16, 0.95, 4, s * 0.45, 0.08, 0.04, '#2E3238');
      D.cilindro(null, 0.08, 0.08, 0.20, 'pintura', '#202326', xe - 0.22, CB.r + 0.10, s * 0.62, [0, 0, Math.PI / 2 - 0.25], 14);
      if(k < 2) D.bloque(null, 0.16, YC - 0.40 - CB.r - 0.14, 0.10, 'pintura', COL, xe + 0.67, (YC - 0.40 + CB.r + 0.14) / 2, s * 0.45, 0.015);
    });
    capRueda(D, G, null, null, xe, zO, 1, oT);
    capRueda(D, G, null, null, xe, zI, 0, oT);
    capRueda(D, G, null, null, xe, -zI, 0, oT);
    capRueda(D, G, null, null, xe, -zO, -1, oT);
  });
  /* rampas traseras levantadas, con tacos */
  var aR = 1.15, LR = 1.60;
  [-0.78, 0.78].forEach(function(z){
    var cx = XR1 + Math.cos(aR) * LR / 2, cy = YC + Math.sin(aR) * LR / 2;
    var r = D.bloque(null, LR, 0.08, 0.62, 'pintura', COL, cx, cy, z, 0.02); r.rotation.z = aR;
    var tc = [];
    for(var t = 0; t < 7; t++){ var f = (t + 0.5) / 7 * LR; tc.push([XR1 + Math.cos(aR) * f - Math.sin(aR) * 0.05, YC + Math.sin(aR) * f + Math.cos(aR) * 0.05, z, 0, 0, aR]); }
    capInst(D, null, new THREE.BoxGeometry(0.04, 0.04, 0.60), 'metal', '#6E757C', tc);
    D.cilindro(null, 0.05, 0.05, 0.66, 'metal', '#4A5058', XR1, YC, z, [Math.PI / 2, 0, 0], 12);
  });
  /* parachoques, luces y franjas de peligro atras */
  D.bloque(null, 0.12, 0.16, 2.40, 'pintura', COL, XR1 + 0.10, 0.62, 0, 0.02);
  var am = [], ne = [];
  for(var f2 = 0; f2 < 8; f2++) (f2 % 2 ? ne : am).push([XR1 + 0.165, 0.62, -1.05 + f2 * 0.30, 0.6, 0, 0]);
  capInst(D, null, new THREE.BoxGeometry(0.01, 0.10, 0.20), 'mate', '#E5C21A', am);
  capInst(D, null, new THREE.BoxGeometry(0.01, 0.10, 0.20), 'mate', '#16181B', ne);
  [-1, 1].forEach(function(s){
    D.bloque(null, 0.06, 0.14, 0.40, 'mate', NEG, XR1 + 0.02, YC - 0.20, s * 1.15, 0.02);
    D.bloque('LSM', 0.02, 0.10, 0.14, 'vidrio', '#C2241B', XR1 + 0.055, YC - 0.20, s * 1.24, 0.006);
    D.bloque('LSM', 0.02, 0.10, 0.14, 'vidrio', '#F2A51C', XR1 + 0.055, YC - 0.20, s * 1.07, 0.006);
  });
  /* letrero CARGA ANCHA y numero de la unidad atras */
  D.letrero(capTexLetrero('CARGA ANCHA', '#F2C21A', '#16181B', '#16181B'), 1.30, 0.28, XR1 + 0.17, 0.92, 0, Math.PI / 2);
  var mn = new THREE.Mesh(new THREE.PlaneGeometry(0.80, 0.25), cab.matNum);
  mn.position.set(XG0 - 0.055, (YGb + YGt) / 2, 0); mn.rotation.y = -Math.PI / 2; G.add(mn);
  return XR1 + 0.2;
}

/* ═══ armado ═══ */
function capConstruir(clave, piezas){
  var q = String(clave).replace(/^cap/, '').split('|'), C = CAP_CFG[q[0]], cuerpo = q[1];
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var P = capMedidas(C, cuerpo);
  capChasis(D, P, G, piezas);
  var cab = capCabina(D, P, G);
  var frentes = { kw: capFrenteKW, mack: capFrenteMack, i56: capFrente5600, i76: capFrente7600 };
  frentes[C.marca](D, P, G);
  if(cuerpo === 'CAMABAJA') capCamaBaja(D, P, G, piezas, cab);
  else capAnfo(D, P, G, cab);
  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ cab.texNum.userData.poner(id); };
  G.userData.mirarY = cuerpo === 'CAMABAJA' ? 1.4 : 1.7;
  G.userData.dist = cuerpo === 'CAMABAJA' ? 38 : 20;
  G.userData.modelo = C.nombre;
  return G;
}

registrarModelo3d({
  nombre: 'Camiones de capot: Kenworth T800, Mack Granite, International 5600i y 7600',
  clave: function(e){
    var m = mod3d(e), c = String((e && e.clasif) || '').toUpperCase();
    var mod = /^T800/.test(m) ? 'T800' : /^GRANITE/.test(m) ? 'GRANITE' : /^GU[78]1[34]/.test(m) ? 'GU813E'
            : /^5600I?/.test(m) ? 'I5600' : /^7600/.test(m) ? 'I7600' : null;
    if(!mod) return null;
    var cuerpo = /ANFO/.test(c) ? 'ANFO' : /CAMA\s*BAJA/.test(c) ? 'CAMABAJA' : null;
    return cuerpo ? 'cap' + mod + '|' + cuerpo : null;
  },
  construir: function(e, piezas, clave){ return capConstruir(clave, piezas); }
});
