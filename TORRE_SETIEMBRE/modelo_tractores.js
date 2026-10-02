/* ══════════════════════════════════════════════════════════════════
   TRACTORES DE ORUGAS Y RODILLOS LISOS — modelos de detalle
     CAT D8 y D8T (T-577…T-601) · Komatsu D155AX y D155AX-6 (T-583…T-603)
     HAMM HC 200 C (RO-409) · SANY SSR120C-10, SSR200C-10S y SSR200C-8H

   Medidas de las hojas del fabricante (lo que no esta acotado se midio
   sobre el dibujo acotado de la misma hoja, escalado con las cotas):
   CAT D8T (Specalog AEHQ7251): trocha 2.083 · oruga en el suelo 3.206 ·
     tejas de 610 mm, 44 por lado, garra 78 mm · 8 rodillos · despeje
     0.613 · alto al escape 3.472 y a la baranda de la cabina 3.566 ·
     largo basico 4.647 (+1.844 hoja SU, +1.519 ripper de un diente,
     +1.613 ripper multiple) · ancho sin munones 2.693, con 3.057 ·
     hoja 8SU 3.94 x 1.69. El D8 nuevo usa el mismo cuerpo.
   Komatsu D155AX-6 (CEN00103-04): trocha 2.140 · oruga en el suelo 3.275 ·
     tejas de 560, 42 por lado, garra 80 · 7 rodillos (K-Bogie) y 2
     portantes · despeje 0.500 · alto a la cabina 3.395 · largo con hoja
     semi-U 6.175 y con ripper gigante 8.225 · hoja semi-U 4.13 x 1.79 ·
     cabina 1.735 x 1.755 · ripper gigante: viga 1.40; multiple: 2.32.
   HAMM HC 200 C: largo 6.610 · ancho 2.474 · alto con cabina 3.046 ·
     bandaje 1.600 x 2.140. Batalla supuesta 3.06 (como el SSR200).
   SANY SSR200C-8H (hoja SANY): largo 6.797 · ancho 2.318 · alto 3.330 ·
     batalla 3.182 · bandaje 1.600 x 2.130 · despeje 0.410 · llantas
     23.1-26. SSR200C-10S: mismas medidas (no se hallo su hoja).
   SANY SSR120C-10: largo 5.78 · ancho 2.29 · alto 3.23 · bandaje 1.50 x
     2.13 (batalla 2.90 y llantas 20.5-25 supuestas).

   Ejes: frente hacia -X (la hoja o el bandaje), arriba +Y, la izquierda
   del operador +Z. Las orugas: tejas, eslabones y rodillos en mallas
   instanciadas; el camino de la oruga es la envolvente de sus ruedas.
   ══════════════════════════════════════════════════════════════════ */
/* los tonos van un poco mas oscuros que la pintura real: el estudio quema los techos */
var TRC_CAT = '#DC990A', TRC_CAT2 = '#A87406', TRC_NEGRO = '#1B1D20', TRC_GRIS = '#3C4148', TRC_GRIS2 = '#5B636C',
    TRC_ACERO = '#55595F', TRC_TEJA = '#36393D', TRC_GET = '#2C2F33', TRC_KOM = '#E6B20C', TRC_KOM2 = '#AD8508',
    TRC_KOMAZ = '#1F48A8', TRC_HAMM = '#D24E18', TRC_HAMM2 = '#9E3A0F', TRC_HAMMGR = '#373B40', TRC_SANY = '#E69D0E',
    TRC_SANY2 = '#B47C08', TRC_SANYROJO = '#C8201A', TRC_TAMBOR = '#8D949B';

/* ═══ geometria ═══ */

/* junta varias geometrias en una sola (sin indices): asi una teja con su
   garra o un eslabon con su buje son una sola malla instanciada */
function trcFundir(geos){
  var pos = [], nor = [];
  geos.forEach(function(g){
    var n = g.index ? g.toNonIndexed() : g;
    var p = n.attributes.position.array, q = n.attributes.normal.array;
    for(var i = 0; i < p.length; i++){ pos.push(p[i]); nor.push(q[i]); }
  });
  var out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  return out;
}

/* el camino de la oruga: la envolvente de las ruedas (circulos {x,y,r} en
   sentido antihorario visto desde +Z), con tangentes exteriores entre
   ruedas y arcos sobre ellas. en(s) da el punto y el angulo de avance a
   la distancia s; la normal hacia afuera queda a la derecha del avance */
function trcCamino(cs){
  var n = cs.length, nor = [], segs = [], L = 0, i;
  for(i = 0; i < n; i++){
    var A = cs[i], B = cs[(i + 1) % n];
    var dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
    var g = Math.asin((A.r - B.r) / d), c = Math.cos(g), s = Math.sin(g);
    nor.push([uy * c + ux * s, -ux * c + uy * s]);
  }
  for(i = 0; i < n; i++){
    var A2 = cs[i], B2 = cs[(i + 1) % n], q = nor[i], q2 = nor[(i + 1) % n];
    var pa = [A2.x + A2.r * q[0], A2.y + A2.r * q[1]], pb = [B2.x + B2.r * q[0], B2.y + B2.r * q[1]];
    segs.push({ arco: false, a: pa, b: pb, L: Math.hypot(pb[0] - pa[0], pb[1] - pa[1]), ang: Math.atan2(pb[1] - pa[1], pb[0] - pa[0]) });
    var a0 = Math.atan2(q[1], q[0]), da = Math.atan2(q2[1], q2[0]) - a0;
    while(da < -1e-6) da += Math.PI * 2;
    segs.push({ arco: true, c: B2, a0: a0, da: da, L: B2.r * da });
  }
  segs.forEach(function(sg){ L += sg.L; });
  return { L: L, en: function(sv){
    sv = ((sv % L) + L) % L;
    for(var k = 0; k < segs.length; k++){
      var sg = segs[k];
      if(sv <= sg.L || k === segs.length - 1){
        if(!sg.arco){
          var f = sg.L ? sv / sg.L : 0;
          return { x: sg.a[0] + (sg.b[0] - sg.a[0]) * f, y: sg.a[1] + (sg.b[1] - sg.a[1]) * f, ang: sg.ang };
        }
        var t = sg.a0 + sv / sg.c.r;
        return { x: sg.c.x + Math.cos(t) * sg.c.r, y: sg.c.y + Math.sin(t) * sg.c.r, ang: t + Math.PI / 2 };
      }
      sv -= sg.L;
    }
  } };
}

/* ═══ oruga completa ═══
   o = { code, z, cs (ruedas del camino: centro de la plancha de la teja),
         n (tejas), ancho, gr (garra), hE (alto del eslabon), zRiel,
         rodillos [x], rRod, yFondo, portantes [x], rPor, yPort,
         guias [{i, code}], catarina {i, code, codeMando}, hex, hexTeja }
   La teja lleva la garra hacia afuera; el eslabon, el buje y el pasador
   hacia adentro. Rodillos y portantes tambien instanciados. */
function trcOruga(D, o){
  var cam = trcCamino(o.cs), N = o.n, p = cam.L / N, e = 0.03, gr = o.gr, hE = o.hE, A = o.ancho, zc = o.z, zr = o.zRiel;
  var so = zc > 0 ? 1 : -1, ROT = [Math.PI / 2, 0, 0];
  /* tejas: plancha, garra y su filete */
  var gGa = new THREE.BoxGeometry(0.05, gr, A * 0.99); gGa.translate(-p * 0.18, -e / 2 - gr / 2 + 0.002, 0);
  var gFi = new THREE.BoxGeometry(p * 0.34, 0.022, A * 0.99); gFi.translate(-p * 0.18, -e / 2 - 0.010, 0);
  var gBo = new THREE.BoxGeometry(p * 0.10, e * 0.8, A * 0.99); gBo.translate(p * 0.44, e * 0.25, 0);
  var gZ = trcFundir([new THREE.BoxGeometry(p * 0.90, e, A), gGa, gFi, gBo]);
  /* eslabones: dos placas con su riel, buje al medio y cabeza del pasador afuera */
  var gs = [];
  [-1, 1].forEach(function(s){
    var b = new THREE.BoxGeometry(p * 0.97, hE * 0.70, 0.068); b.translate(0, e / 2 + hE * 0.40, s * zr); gs.push(b);
    var b2 = new THREE.BoxGeometry(p * 0.80, hE * 0.26, 0.078); b2.translate(-p * 0.06, e / 2 + hE * 0.86, s * zr); gs.push(b2);
    var pc = new THREE.CylinderGeometry(0.036, 0.036, 0.05, 8); pc.rotateX(Math.PI / 2); pc.translate(p / 2, e / 2 + hE * 0.45, s * (zr + 0.05)); gs.push(pc);
  });
  var bu = new THREE.CylinderGeometry(0.052, 0.052, 2 * zr - 0.05, 10); bu.rotateX(Math.PI / 2); bu.translate(p / 2, e / 2 + hE * 0.45, 0); gs.push(bu);
  var mZ = D.M.metal(o.hexTeja || TRC_TEJA); mZ.roughness = 0.6; mZ.metalness = 0.7;
  var mE = D.M.metal(TRC_ACERO); mE.roughness = 0.42;
  var zap = new THREE.InstancedMesh(gZ, mZ, N), esl = new THREE.InstancedMesh(trcFundir(gs), mE, N);
  var d = new THREE.Object3D();
  for(var k = 0; k < N; k++){
    var q = cam.en((k + 0.5) * p);
    d.position.set(q.x, q.y, zc); d.rotation.set(0, 0, q.ang); d.updateMatrix();
    zap.setMatrixAt(k, d.matrix); esl.setMatrixAt(k, d.matrix);
  }
  [zap, esl].forEach(function(m){ m.frustumCulled = false; });
  D.reg(o.code, zap, o.hexTeja || TRC_TEJA);
  D.reg(o.code, esl, TRC_ACERO);

  /* rodillos de doble pestana sobre los rieles (instanciados) */
  var rodillo = function(r, n){
    var g = [];
    [-1, 1].forEach(function(s){
      var t = new THREE.CylinderGeometry(r, r, 0.11, 22); t.rotateX(Math.PI / 2); t.translate(0, 0, s * zr); g.push(t);
      var f = new THREE.CylinderGeometry(r + 0.045, r + 0.045, 0.035, 22); f.rotateX(Math.PI / 2); f.translate(0, 0, s * (zr + 0.072)); g.push(f);
      var c = new THREE.CylinderGeometry(r * 0.45, r * 0.52, 0.07, 14); c.rotateX(Math.PI / 2); c.translate(0, 0, s * (zr + 0.12)); g.push(c);
    });
    var h = new THREE.CylinderGeometry(r * 0.72, r * 0.72, 2 * zr - 0.1, 18); h.rotateX(Math.PI / 2); g.push(h);
    var im = new THREE.InstancedMesh(trcFundir(g), D.M.metal('#3D4147'), n);
    im.frustumCulled = false;
    return im;
  };
  if(o.rodillos && o.rodillos.length){
    var yR = o.yFondo + e / 2 + hE + o.rRod, ir = rodillo(o.rRod, o.rodillos.length);
    o.rodillos.forEach(function(x, j){ d.position.set(x, yR, zc); d.rotation.set(0, 0, 0); d.updateMatrix(); ir.setMatrixAt(j, d.matrix); });
    D.reg(o.code, ir, '#3D4147');
  }
  if(o.portantes && o.portantes.length){
    var yP = o.yPort - e / 2 - hE - o.rPor, ip = rodillo(o.rPor, o.portantes.length);
    o.portantes.forEach(function(x, j){ d.position.set(x, yP, zc); d.rotation.set(0, 0, 0); d.updateMatrix(); ip.setMatrixAt(j, d.matrix); });
    D.reg(o.code, ip, '#3D4147');
  }

  /* ruedas guia: dos rodaduras sobre los rieles, pestana al medio, disco y masa */
  (o.guias || []).forEach(function(gu){
    var c = o.cs[gu.i], rt = c.r - e / 2 - hE;
    [-1, 1].forEach(function(s){ D.cilindro(gu.code, rt, rt, 0.10, 'metal', '#474B51', c.x, c.y, zc + s * zr, ROT, 36); });
    D.cilindro(gu.code, rt + hE * 0.30, rt + hE * 0.30, 2 * zr - 0.12, 'metal', '#4D5157', c.x, c.y, zc, ROT, 36);
    [-1, 1].forEach(function(s){
      D.cilindro(null, rt * 0.86, rt * 0.86, 0.05, 'pintura', o.hex, c.x, c.y, zc + s * (zr + 0.07), ROT, 32);
      D.cilindro(null, rt * 0.34, rt * 0.40, 0.12, 'metal', '#3A3E44', c.x, c.y, zc + s * (zr + 0.14), ROT, 18);
      for(var b = 0; b < 6; b++){
        var a = b / 6 * Math.PI * 2;
        D.cilindro(null, 0.022, 0.022, 0.04, 'metal', '#6A6E74', c.x + Math.cos(a) * rt * 0.55, c.y + Math.sin(a) * rt * 0.55, zc + s * (zr + 0.11), ROT, 6);
      }
    });
  });

  /* catarina: corona dentada segmentada, pernos de los segmentos, masa del mando final */
  if(o.catarina){
    var c = o.cs[o.catarina.i], Rp = c.r - e / 2 - hE * 0.45, nd = Math.max(9, Math.round(2 * Math.PI * Rp / p));
    var rr = Rp - 0.065, rt2 = Rp + 0.07, sh = new THREE.Shape(), w = Math.PI * 2 / nd;
    for(var t = 0; t < nd; t++){
      var a0 = t * w;
      [[rr, 0], [rr, 0.20], [rt2 - 0.02, 0.36], [rt2, 0.45], [rt2, 0.55], [rt2 - 0.02, 0.64], [rr, 0.80]].forEach(function(pt, j){
        var x = Math.cos(a0 + pt[1] * w) * pt[0], y = Math.sin(a0 + pt[1] * w) * pt[0];
        if(t === 0 && j === 0) sh.moveTo(x, y); else sh.lineTo(x, y);
      });
    }
    sh.closePath();
    var gC = new THREE.ExtrudeGeometry(sh, { depth: 0.12, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.012, bevelSegments: 1, curveSegments: 2 });
    gC.translate(0, 0, -0.06);
    D.pon(o.catarina.code, gC, 'metal', '#6B6457', c.x, c.y, zc);
    /* disco del cubo hacia afuera, anillo de pernos y tapa del mando final */
    D.cilindro(o.catarina.code, rr - 0.03, rr - 0.03, 0.05, 'pintura', o.hex, c.x, c.y, zc + so * 0.09, ROT, 40);
    var ib = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.026, 0.026, 0.05, 6), D.M.metal('#7A7466'), nd);
    for(var b = 0; b < nd; b++){
      var ab = (b + 0.5) * w;
      d.position.set(c.x + Math.cos(ab) * (rr - 0.09), c.y + Math.sin(ab) * (rr - 0.09), zc + so * 0.125);
      d.rotation.set(Math.PI / 2, 0, 0); d.updateMatrix(); ib.setMatrixAt(b, d.matrix);
    }
    ib.frustumCulled = false; D.reg(null, ib, null);
    D.cilindro(o.catarina.codeMando, rr * 0.62, rr * 0.70, 0.16, 'pintura', o.hex, c.x, c.y, zc + so * 0.19, ROT, 32);
    D.cilindro(o.catarina.codeMando, rr * 0.30, rr * 0.36, 0.08, 'metal', '#4A4F55', c.x, c.y, zc + so * 0.30, ROT, 20);
    /* caja del mando final hacia adentro, contra el casco */
    D.cilindro(o.catarina.codeMando, rr * 0.86, rr * 0.86, 0.36, 'pintura', o.hex2 || o.hex, c.x, c.y, zc - so * (zr + 0.26), ROT, 32);
  }
  return { p: p, cam: cam };
}

/* ═══ piezas comunes ═══ */

/* viga recta entre dos puntos del plano XY, a la altura z */
function trcViga(D, code, a, b, z, alto, ancho, tipo, hex, r){
  var L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return D.bloque(code, L, alto, ancho, tipo, hex, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z, r === undefined ? 0.04 : r,
    [0, 0, Math.atan2(b[1] - a[1], b[0] - a[0])]);
}

/* faro de trabajo rectangular (LED): caja negra, mica que brilla; n = normal [nx, nz] */
function trcLuz(D, code, x, y, z, n, w, h){
  var dx = n[0], dz = n[1], ax = Math.abs(dx) > 0.5;
  D.bloque(null, ax ? 0.12 : w, h, ax ? w : 0.12, 'mate', TRC_NEGRO, x, y, z, 0.02);
  var m = new THREE.Mesh(new THREE.BoxGeometry(ax ? 0.02 : w * 0.82, h * 0.72, ax ? w * 0.82 : 0.02),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#FFF6DA'), emissive: new THREE.Color('#7A6E4A'), roughness: 0.12, metalness: 0.1 }));
  m.position.set(x + dx * 0.065, y, z + dz * 0.065);
  return D.reg(code, m, '#FFF6DA');
}

/* rejilla de lamas en una cara que mira a +Z (sz = 1) o a -Z (sz = -1) */
function trcLamasZ(D, code, x0, x1, y0, y1, z, n, hex, sz){
  var paso = (y1 - y0) / n;
  D.bloque(code, x1 - x0 + 0.10, y1 - y0 + 0.10, 0.06, 'mate', hex, (x0 + x1) / 2, (y0 + y1) / 2, z - sz * 0.01, 0.02);
  for(var i = 0; i < n; i++){
    D.pon(null, new THREE.BoxGeometry(x1 - x0, paso * 0.70, 0.04), 'mate', '#0B0C0E', (x0 + x1) / 2, y0 + paso * (i + 0.5), z + sz * 0.035, [sz * 0.5, 0, 0]);
  }
}

/* chapa perforada (puertas del motor): textura con agujeros que se
   recortan con alphaTest, asi el motor se ve detras */
function trcChapaPerforada(G, hex, w, h, x, y, z, ry){
  var c = document.createElement('canvas'); c.width = 128; c.height = 128;
  var g = c.getContext('2d');
  g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, 128, 128);
  g.globalCompositeOperation = 'destination-out';
  /* agujeros mas grandes que los reales (~1 cm) para que se lean a la distancia de la camara */
  for(var i = 0; i < 4; i++) for(var j = 0; j < 4; j++){
    g.beginPath(); g.arc(16 + i * 32 + (j % 2) * 16, 16 + j * 32, 12, 0, Math.PI * 2); g.fill();
  }
  var t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(w / 0.16, h / 0.16);
  var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), map: t,
    alphaTest: 0.5, side: THREE.DoubleSide, roughness: 0.45, metalness: 0.15 }));
  m.position.set(x, y, z); m.rotation.y = ry || 0;
  m.castShadow = true; G.add(m);
  return m;
}

/* cabina con vidrios de marco, postes, techo, asiento y mandos adentro.
   o = { x0, x1, z0, z1, yp (piso exterior), yb (bajo los vidrios), yt (techo),
         et, hexP, hexT, hexB, fp (poste de la puerta), vBajo (vidrio delantero
         hasta yv), mando: 'palancas' | 'volante' } */
function trcCabina(D, G, o){
  var x0 = o.x0, x1 = o.x1, z0 = o.z0, z1 = o.z1, w = x1 - x0, d = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, P = 0.10;
  var yb = o.yb, yt = o.yt, hV = yt - yb, ym = (yb + yt) / 2, xp = x0 + w * (o.fp || 0.42);
  var vid = function(w2, h2, d2, x, y, z){
    var m = new THREE.Mesh(new THREE.BoxGeometry(w2, h2, d2), D.M.vidrio('#1E3142'));
    m.position.set(x, y, z); G.add(m); return m;
  };
  if(o.yp < yb - 0.01){
    if(o.vBajo){
      /* adelante el vidrio baja hasta yv: el panel bajo solo detras */
      D.bloque('CBN', x1 - (x0 + o.vBajo.x), yb - o.yp, d, 'pintura', o.hexB, (x0 + o.vBajo.x + x1) / 2, (o.yp + yb) / 2, cz, 0.05);
      D.bloque('CBN', o.vBajo.x, o.vBajo.y - o.yp, d, 'pintura', o.hexB, x0 + o.vBajo.x / 2, (o.yp + o.vBajo.y) / 2, cz, 0.04);
      var hb = yb - o.vBajo.y, yv = (yb + o.vBajo.y) / 2;
      vid(0.03, hb, d - 2 * P, x0 + 0.03, yv, cz);
      [z0, z1].forEach(function(z){ vid(o.vBajo.x - P, hb, 0.03, x0 + o.vBajo.x / 2 + P / 2, yv, z + (z === z0 ? 0.03 : -0.03)); });
      D.bloque('CBN', 0.08, hb, 0.08, 'pintura', o.hexP, x0 + o.vBajo.x, yv, z0 + 0.04, 0.02);
      D.bloque('CBN', 0.08, hb, 0.08, 'pintura', o.hexP, x0 + o.vBajo.x, yv, z1 - 0.04, 0.02);
      /* asiento interior mas abajo que el borde del vidrio */
    } else {
      D.bloque('CBN', w, yb - o.yp, d, 'pintura', o.hexB, cx, (o.yp + yb) / 2, cz, 0.05);
    }
  }
  /* postes de las esquinas y de la puerta */
  [[x0 + P / 2, z0 + P / 2], [x0 + P / 2, z1 - P / 2], [x1 - P / 2, z0 + P / 2], [x1 - P / 2, z1 - P / 2]].forEach(function(q){
    D.bloque('CBN', P, hV, P, 'pintura', o.hexP, q[0], ym, q[1], 0.025);
  });
  [z0 + 0.04, z1 - 0.04].forEach(function(z){ D.bloque('CBN', 0.07, hV, 0.08, 'pintura', o.hexP, xp, ym, z, 0.02); });
  /* marco bajo y alto */
  [[cx, z0 + 0.03, w, 0.06], [cx, z1 - 0.03, w, 0.06]].forEach(function(q){
    D.bloque('CBN', q[2], 0.08, q[3], 'pintura', o.hexP, q[0], yb + 0.04, q[1], 0.015);
    D.bloque('CBN', q[2], 0.10, q[3], 'pintura', o.hexP, q[0], yt - 0.05, q[1], 0.015);
  });
  [x0 + 0.03, x1 - 0.03].forEach(function(x){
    D.bloque('CBN', 0.06, 0.08, d, 'pintura', o.hexP, x, yb + 0.04, cz, 0.015);
    D.bloque('CBN', 0.06, 0.10, d, 'pintura', o.hexP, x, yt - 0.05, cz, 0.015);
  });
  /* vidrios */
  var hv = hV - 0.18, yv2 = yb + 0.08 + hv / 2;
  vid(0.03, hv, d - 2 * P, x0 + 0.03, yv2, cz);
  vid(0.03, hv, d - 2 * P, x1 - 0.03, yv2, cz);
  [z0 + 0.03, z1 - 0.03].forEach(function(z){
    vid(xp - x0 - P - 0.04, hv, 0.03, (x0 + P + xp - 0.04) / 2, yv2, z);
    vid(x1 - xp - P - 0.04, hv, 0.03, (xp + 0.04 + x1 - P) / 2, yv2, z);
  });
  /* techo con alero */
  D.bloque('CBN', w + 0.14, o.et, d + 0.14, 'pintura', o.hexT, cx, yt + o.et / 2, cz, 0.05);
  /* limpiaparabrisas */
  D.tubo(null, [x0 - 0.01, yb + 0.12, cz - 0.30], [x0 - 0.01, yb + hV * 0.62, cz + 0.12], 0.012, 'mate', '#111', 6);
  /* manijas de la puerta */
  [z0 - 0.02, z1 + 0.02].forEach(function(z){ D.bloque(null, 0.16, 0.04, 0.04, 'cromo', null, xp + 0.20, yb + hV * 0.35, z, 0.01); });
  /* adentro: asiento, consola y mandos */
  var ys = Math.max(o.yp, yb - 0.25), xs = x0 + w * 0.62;
  D.bloque(null, 0.50, 0.14, 0.52, 'mate', '#2A2D31', xs, ys + 0.12, cz, 0.05);
  D.bloque(null, 0.12, 0.62, 0.50, 'mate', '#2A2D31', xs + 0.26, ys + 0.48, cz, 0.05, [0, 0, -0.12]);
  [-1, 1].forEach(function(s){
    D.bloque(null, 0.42, 0.20, 0.14, 'mate', '#26292D', xs - 0.05, ys + 0.22, cz + s * 0.36, 0.03);
    if(o.mando !== 'volante'){
      D.tubo(s > 0 ? 'JLH' : 'JRH', [xs - 0.14, ys + 0.32, cz + s * 0.36], [xs - 0.16, ys + 0.50, cz + s * 0.36], 0.018, 'mate', '#111', 8);
      D.pon(s > 0 ? 'JLH' : 'JRH', new THREE.SphereGeometry(0.045, 12, 8), 'mate', '#202326', xs - 0.16, ys + 0.53, cz + s * 0.36);
    }
  });
  if(o.mando === 'volante'){
    D.tubo(null, [x0 + 0.30, ys + 0.10, cz], [xs - 0.30, ys + 0.62, cz], 0.035, 'mate', '#202326', 10);
    D.pon('JLH', new THREE.TorusGeometry(0.19, 0.02, 8, 28), 'mate', '#151719', xs - 0.30, ys + 0.64, cz, [0, Math.PI / 2, 0.5]);
  }
  /* tablero al frente */
  D.bloque(null, 0.18, 0.30, d * 0.5, 'mate', '#25282C', x0 + 0.16, ys + 0.30, cz, 0.03);
  return { xp: xp };
}

/* hoja topadora: vertedera curva al centro, alas sesgadas hacia adelante,
   cuchillas y cantoneras (GET), costillas y vigas atras.
   o = { x0 (filo), H, lean, bulge, prof, zc (medio ancho del centro),
         ww (ancho de cada ala), ang, hex, hex2 } */
function trcHoja(D, o){
  var x0 = o.x0, H = o.H, xt = x0 + o.lean, tg = Math.tan(o.ang);
  var pf = [];
  for(var i = 0; i <= 12; i++){ var t = i / 12; pf.push([x0 + o.lean * t + o.bulge * Math.sin(Math.PI * t), H * t]); }
  pf.push([xt - 0.09, H + 0.03], [xt + 0.05, H + 0.07], [xt + 0.30, H - 0.02], [x0 + o.prof, 0.35], [x0 + 0.30, 0.02]);
  var xAtras = function(y){ var xb0 = x0 + o.prof, xb1 = xt + 0.30; return xb0 + (y - 0.35) / (H - 0.37) * (xb1 - xb0); };
  /* centro */
  D.perfil('LPN', pf, o.zc * 2, 0, 'pintura', o.hex, 0.03);
  /* alas: el mismo perfil, cizallado hacia adelante para que empalme sin costura */
  var ala = function(geo, s, ancho){
    geo.translate(0, 0, s * ancho / 2);
    var pos = geo.attributes.position;
    for(var v = 0; v < pos.count; v++){
      var z = pos.getZ(v);
      pos.setX(v, pos.getX(v) - Math.abs(z) * tg);
      pos.setZ(v, z + s * o.zc);
    }
    pos.needsUpdate = true; geo.computeVertexNormals();
    return geo;
  };
  [-1, 1].forEach(function(s){
    D.pon('LPN', ala(geoPerfilB(pf, o.ww, 0, 0.03), s, o.ww), 'pintura', o.hex);
    /* placa del extremo, en el borde del ala */
    var dx = -o.ww * tg, ext = [[x0 + dx - 0.05, 0.0], [xt + dx + 0.02, H + 0.05], [xAtras(H) + dx + 0.10, H], [xAtras(0.4) + dx + 0.12, 0.40], [x0 + dx + 0.45, 0.0]];
    D.perfil('LPN', ext, 0.06, s * (o.zc + o.ww - 0.03), 'pintura', o.hex, 0.015);
    /* cuchilla del ala y cantonera de la esquina */
    D.pon('GET', ala(new THREE.BoxGeometry(0.07, 0.24, o.ww - 0.05).translate(x0 + 0.03, 0.12, 0), s, o.ww - 0.05), 'metal', TRC_GET);
    D.bloque('GET', 0.30, 0.30, 0.10, 'metal', TRC_GET, x0 + dx + 0.10, 0.15, s * (o.zc + o.ww - 0.07), 0.03, [0, s * o.ang, 0]);
    /* costillas del ala atras */
    var cr = trcViga(D, null, [xAtras(0.40) + 0.04 - o.ww * 0.5 * tg, 0.40], [xAtras(H - 0.05) + 0.04 - o.ww * 0.5 * tg, H - 0.05], s * (o.zc + o.ww * 0.5), 0.14, 0.06, 'pintura', o.hex2, 0.02);
    cr.rotation.y = s * o.ang;
  });
  /* cuchillas del centro: tres segmentos con pernos */
  for(var c = 0; c < 3; c++){
    var zz = -o.zc + o.zc * 2 / 3 * (c + 0.5);
    D.bloque('GET', 0.07, 0.24, o.zc * 2 / 3 - 0.02, 'metal', TRC_GET, x0 + 0.03, 0.12, zz, 0.012);
    for(var b = 0; b < 4; b++) D.cilindro(null, 0.022, 0.022, 0.02, 'metal', '#77706A', x0 - 0.005, 0.15, zz - 0.32 + b * 0.21, [0, 0, Math.PI / 2], 6);
  }
  /* atras: dos vigas cajon y costillas verticales */
  [0.45, H - 0.40].forEach(function(y){ D.bloque('LPN', 0.20, 0.22, o.zc * 2, 'pintura', o.hex2, xAtras(y) + 0.09, y, 0, 0.03); });
  for(var r = -3; r <= 3; r++){
    trcViga(D, null, [xAtras(0.35) + 0.05, 0.35], [xAtras(H - 0.05) + 0.05, H - 0.05], r * o.zc / 3.4, 0.16, 0.06, 'pintura', o.hex2, 0.02);
  }
  /* labio de arriba */
  D.bloque('LPN', 0.10, 0.08, o.zc * 2, 'pintura', o.hex, xt - 0.05, H + 0.06, 0, 0.02);
  return { xAtras: xAtras };
}

/* diente de ripper: placa con el perfil, punta y protector de GET */
function trcDiente(D, pts, punta, z, hex){
  D.perfil(null, pts, 0.10, z, 'pintura', hex, 0.02);
  D.perfil('GET', punta, 0.11, z, 'metal', TRC_GET, 0.01);
}

/* ═══ CAT D8 y D8T ═══ */
function trcConstruirCat(v, piezas){
  var G = new THREE.Group(), D = kitDetalle(G, piezas);
  var bloque = D.bloque, tubo = D.tubo, cil = D.cilindro, AM = TRC_CAT, AM2 = TRC_CAT2, NG = TRC_NEGRO;
  var am = function(code, w, h, dd, x, y, z, r, rot){ return bloque(code, w, h, dd, 'pintura', AM, x, y, z, r, rot); };
  var ROTZ = [Math.PI / 2, 0, 0];

  /* ═══ orugas de rueda motriz elevada: guia adelante, guia atras y catarina arriba ═══ */
  var ZT = 2.083 / 2, FI = { x: -1.73, y: 0.50, r: 0.407 }, RI = { x: 1.72, y: 0.50, r: 0.407 }, SP = { x: 0.96, y: 1.36, r: 0.39 };
  var rods = []; for(var i = 0; i < 8; i++) rods.push(-1.26 + i * 0.36);
  [-1, 1].forEach(function(s){
    var izq = s > 0, zc = s * ZT, cO = izq ? 'CLH' : 'CRH';
    trcOruga(D, { code: cO, z: zc, cs: [FI, RI, SP], n: 44, ancho: 0.61, gr: 0.078, hE: 0.15, zRiel: 0.19,
      rodillos: rods, rRod: 0.12, yFondo: 0.093, hex: AM, hex2: AM2,
      guias: [{ i: 0, code: izq ? 'RGL' : cO }, { i: 1, code: cO }],
      catarina: { i: 2, code: izq ? cO : 'SPR', codeMando: izq ? 'DLH' : 'DRH' } });
    /* bastidor de rodillos con bogies mayores y menores (tren suspendido) */
    am(null, 2.90, 0.26, 0.36, 0, 0.68, zc, 0.05);
    am(null, 2.40, 0.10, 0.44, 0, 0.83, zc, 0.03);
    for(var b = 0; b < 4; b++){
      var xb = (rods[2 * b] + rods[2 * b + 1]) / 2;
      bloque(null, 0.62, 0.15, 0.50, 'pintura', AM2, xb, 0.50, zc, 0.04);
      cil('PYB', 0.06, 0.06, 0.56, 'metal', '#4A4F55', xb, 0.53, zc, ROTZ, 12);
    }
    [-0.72, 0.72].forEach(function(xb){ am(null, 1.30, 0.20, 0.06, xb, 0.60, zc + s * 0.25, 0.03); cil('PYB', 0.08, 0.08, 0.10, 'metal', '#4A4F55', xb, 0.62, zc + s * 0.29, ROTZ, 14); });
    /* horquillas de las guias y la proteccion de los extremos */
    [FI, RI].forEach(function(c){
      var sx = c.x < 0 ? 1 : -1;
      [-1, 1].forEach(function(t){ am(null, 0.52, 0.22, 0.06, c.x + sx * 0.20, c.y + 0.02, zc + t * 0.33, 0.03); });
      bloque(null, 0.40, 0.08, 0.66, 'mate', TRC_GRIS, c.x + sx * 0.32, 0.26, zc, 0.02);
    });
    /* munon del brazo de empuje y su soporte */
    tubo('PYB', [0.53, 0.70, zc + s * 0.18], [0.53, 0.70, s * 1.42], 0.10, 'metal', '#4A4F55', 18);
    cil(null, 0.15, 0.15, 0.14, 'pintura', AM, 0.53, 0.70, s * 1.40, ROTZ, 22);
    /* peldano en la cola del bastidor */
    bloque(null, 0.30, 0.04, 0.24, 'metal', '#4A4F55', 1.40, 0.92, zc + s * 0.25, 0.01);
  });

  /* ═══ casco, barra igualadora y protector inferior ═══ */
  am(null, 4.20, 0.80, 1.16, -0.20, 1.03, 0, 0.06);
  bloque(null, 3.60, 0.04, 1.10, 'mate', TRC_GRIS, -0.50, 0.64, 0, 0.01);
  bloque(null, 0.22, 0.18, 2.36, 'pintura', AM2, -0.78, 0.90, 0, 0.04);
  [-1, 1].forEach(function(s){ cil('PYB', 0.07, 0.07, 0.18, 'metal', '#4A4F55', -0.78, 0.90, s * 1.10, ROTZ, 12); });
  bloque('TRM', 1.10, 0.50, 1.20, 'metal', TRC_GRIS, 0.95, 1.20, 0, 0.05);

  /* ═══ capot del motor: marco amarillo, puertas de chapa perforada y el C15 adentro ═══ */
  var HX0 = -2.12, HX1 = -0.25, HY0 = 1.42, HY1 = 2.70, HZ = 0.62;
  am(null, HX1 - HX0 + 0.06, 0.10, HZ * 2 + 0.08, (HX0 + HX1) / 2, HY1 + 0.05, 0, 0.04);
  [-1, 1].forEach(function(s){
    am(null, HX1 - HX0, 0.22, 0.06, (HX0 + HX1) / 2, HY1 - 0.11, s * HZ, 0.02);
    am(null, HX1 - HX0, 0.20, 0.06, (HX0 + HX1) / 2, HY0 + 0.10, s * HZ, 0.02);
    [HX0 + 0.04, -1.20, HX1 - 0.04].forEach(function(x){ am(null, 0.08, HY1 - HY0, 0.07, x, (HY0 + HY1) / 2, s * HZ, 0.02); });
    trcChapaPerforada(G, AM, 0.86, HY1 - HY0 - 0.42, (HX0 + 0.08 - 1.24) / 2, (HY0 + HY1) / 2 - 0.01, s * (HZ + 0.005), 0);
    trcChapaPerforada(G, AM, 0.86, HY1 - HY0 - 0.42, (-1.16 + HX1 - 0.08) / 2, (HY0 + HY1) / 2 - 0.01, s * (HZ + 0.005), 0);
    /* bisagras y manijas de las puertas */
    [-1.62, -0.70].forEach(function(x){ bloque(null, 0.12, 0.04, 0.04, 'cromo', null, x, HY0 + 0.32, s * (HZ + 0.04), 0.01); });
  });
  /* el motor: bloque, tapas de valvulas, turbo, posenfriador y multiple */
  bloque('ENG1', 1.45, 0.86, 0.80, 'metal', TRC_GRIS, -1.20, 1.78, 0, 0.06);
  bloque('ENG1', 1.30, 0.16, 0.50, 'metal', TRC_GRIS2, -1.20, 2.28, 0.08, 0.03);
  bloque('INY1', 1.20, 0.06, 0.20, 'metal', '#2E3238', -1.20, 2.38, 0.08, 0.02);
  bloque('AFT1', 0.90, 0.16, 0.36, 'metal', '#7B8188', -1.10, 2.48, -0.20, 0.03);
  D.pon('TLH2', new THREE.TorusGeometry(0.13, 0.07, 10, 18), 'metal', '#6B7178', -0.62, 2.10, -0.30, [0, Math.PI / 2, 0]);
  tubo(null, [-1.75, 2.02, -0.42], [-0.70, 2.02, -0.42], 0.06, 'metal', '#7A5F48', 10);
  cil('AL1', 0.10, 0.10, 0.20, 'metal', TRC_GRIS2, -1.85, 1.55, 0.42, [0, 0, Math.PI / 2], 16);
  cil('AR1', 0.09, 0.09, 0.30, 'metal', TRC_GRIS2, -0.75, 1.52, 0.44, [0, 0, Math.PI / 2], 14);
  bloque('EC', 0.24, 0.30, 0.06, 'mate', '#2A2D31', -0.95, 1.72, 0.43, 0.02);
  /* D8T en la esquina alta del capot */
  var texMod = texRotulo3d(rotuloTexto(v === 'D8' ? 'D8' : 'D8T', '#17191C', '#FFFFFF', 0.92), 256, 96);
  [-1, 1].forEach(function(s){ D.letrero(texMod, 0.48, 0.18, -0.62, HY1 - 0.11, s * (HZ + 0.035), s > 0 ? 0 : Math.PI); });
  /* pasamanos sobre el capot */
  [-1, 1].forEach(function(s){
    var zz = s * (HZ - 0.08);
    tubo(null, [-1.80, HY1 + 0.10, zz], [-1.80, HY1 + 0.30, zz], 0.022, 'pintura', AM, 8);
    tubo(null, [-0.65, HY1 + 0.10, zz], [-0.65, HY1 + 0.30, zz], 0.022, 'pintura', AM, 8);
    tubo(null, [-1.80, HY1 + 0.30, zz], [-0.65, HY1 + 0.30, zz], 0.022, 'pintura', AM, 8);
  });
  /* escape y prefiltro sobre el capot */
  cil(null, 0.11, 0.11, 0.10, 'mate', NG, -1.02, HY1 + 0.15, 0.20, null, 16);
  tubo(null, [-1.02, HY1 + 0.15, 0.20], [-1.02, 3.40, 0.20], 0.072, 'mate', '#1E2023', 16);
  cil(null, 0.085, 0.072, 0.10, 'mate', '#1E2023', -1.02, 3.42, 0.20, null, 16);
  cil(null, 0.06, 0.06, 0.32, 'metal', TRC_GRIS2, -1.48, HY1 + 0.26, -0.18, null, 14);
  cil(null, 0.19, 0.19, 0.30, 'mate', NG, -1.48, HY1 + 0.55, -0.18, null, 24);
  cil(null, 0.21, 0.12, 0.10, 'mate', NG, -1.48, HY1 + 0.75, -0.18, null, 24);
  D.pon(null, new THREE.SphereGeometry(0.12, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), 'mate', NG, -1.48, HY1 + 0.79, -0.18);

  /* ═══ caja del radiador al frente con su rejilla ═══ */
  am(null, 0.30, 1.85, 1.62, -2.24, 1.97, 0, 0.06);
  D.lamas('RAD1', -2.42, 1.20, 2.62, -0.62, 0.62, 11, NG, -1);
  bloque('RAD1', 0.30, 1.40, 1.20, 'metal', '#2E3238', -1.98, 1.95, 0, 0.03);
  D.pon('FAN1', new THREE.TorusGeometry(0.52, 0.06, 10, 32), 'metal', TRC_GRIS2, -1.80, 1.95, 0, [0, Math.PI / 2, 0]);
  bloque(null, 0.34, 0.12, 1.70, 'pintura', AM2, -2.24, 2.94, 0, 0.03);
  /* gancho de remolque y protector bajo el radiador */
  bloque(null, 0.40, 0.10, 1.40, 'mate', TRC_GRIS, -2.30, 0.98, 0, 0.02);
  D.pon(null, new THREE.TorusGeometry(0.10, 0.035, 8, 16), 'metal', '#4A4F55', -2.48, 1.10, 0, [0, Math.PI / 2, 0]);
  /* soportes de los cilindros de levante a los lados de la caja */
  [-1, 1].forEach(function(s){ am(null, 0.34, 0.34, 0.22, -2.30, 2.55, s * 0.90, 0.04); cil('PYB', 0.07, 0.07, 0.30, 'metal', '#4A4F55', -2.37, 2.55, s * 0.93, ROTZ, 12); });

  /* ═══ hoja 8SU ═══ */
  var X0 = -4.25, hoja = trcHoja(D, { x0: X0, H: 1.69, lean: 0.50, bulge: 0.22, prof: 0.80, zc: 1.35, ww: 0.62, ang: 0.44, hex: AM, hex2: AM2 });
  var xh = function(y){ return hoja.xAtras(y); };
  [-1, 1].forEach(function(s){
    var z = s * 1.49;
    /* brazos de empuje por fuera de las orugas, con su ojo en la hoja */
    trcViga(D, null, [xh(0.50) + 0.10, 0.50], [0.53, 0.70], z, 0.34, 0.22, 'pintura', AM, 0.05);
    am(null, 0.40, 0.46, 0.34, xh(0.50) + 0.02, 0.50, z, 0.05);
    cil('PYB', 0.10, 0.10, 0.40, 'metal', '#4A4F55', xh(0.50) + 0.02, 0.50, z, ROTZ, 14);
    /* cilindros de levante negros desde la caja del radiador hasta la hoja */
    var top = [-1.80, 3.32, s * 1.00], rod = [xh(1.30) + 0.12, 1.30, s * 1.00];
    am(null, 0.26, 0.30, 0.24, xh(1.30) + 0.06, 1.30, s * 1.00, 0.04);
    D.cilHidD(s > 0 ? 'PHY' : 'HRH', top, rod, 0.115, NG, 0.58);
    am(null, 0.22, 0.22, 0.30, -2.37, 2.55, s * 1.00, 0.04);
    /* cabezal con el faro delantero arriba del cilindro */
    bloque(null, 0.26, 0.20, 0.24, 'mate', NG, top[0] + 0.02, top[1] + 0.16, top[2], 0.03);
    trcLuz(D, s > 0 ? 'FDI' : 'FDD', top[0] - 0.14, top[1] + 0.30, top[2], [-1, 0], 0.30, 0.20);
    /* manguera del cilindro a la caja */
    tubo('LPH', [top[0] + 0.05, top[1] - 0.20, s * 0.95], [-2.15, 2.75, s * 0.80], 0.025, 'goma', '#22262B', 8);
    /* cilindro de inclinacion a la derecha y tirante a la izquierda */
    var a = [-2.20, 0.86, s * 1.42], b = [xh(1.45) + 0.06, 1.45, s * 1.30];
    am(null, 0.30, 0.16, 0.24, -2.20, 0.76, s * 1.49, 0.04);
    if(s < 0) D.cilHidD('PHY', a, b, 0.085, AM, 0.55);
    else tubo(null, a, b, 0.075, 'pintura', AM, 16);
  });

  /* ═══ cajas laterales con el arco sobre la catarina y el logo CAT ═══ */
  var arco = [];
  for(var k = 0; k <= 8; k++){ var t = (41.5 + k / 8 * (107.7 - 41.5)) * Math.PI / 180; arco.push([SP.x + Math.cos(t) * 0.55, SP.y + Math.sin(t) * 0.55]); }
  var perfLat = [[-0.22, 2.55], [1.53, 2.55], [1.53, 1.72], [1.37, 1.72]].concat(arco).concat([[0.02, 1.62], [-0.22, 1.62]]);
  var texCAT = texRotulo3d(rotuloCAT, 256, 112), texNum = texNumero3d(null, '#17191C');
  [-1, 1].forEach(function(s){
    D.perfil(s > 0 ? 'BAT' : 'TQH1', perfLat, 0.64, s * 1.02, 'pintura', AM, 0.03);
    D.letrero(texCAT, 0.78, 0.34, 0.40, 2.22, s * 1.345, s > 0 ? 0 : Math.PI);
    /* tapa de la caja con bisagras y cierre */
    bloque(null, 0.06, 0.40, 0.04, 'mate', NG, 1.20, 2.18, s * 1.345, 0.01);
    /* pasamanos vertical y peldano al costado */
    tubo(null, [1.50, 1.80, s * 1.37], [1.50, 2.48, s * 1.37], 0.022, 'pintura', NG, 8);
    bloque(null, 0.34, 0.04, 0.20, 'metal', '#4A4F55', 1.32, 1.66, s * 1.36, 0.01);
  });
  /* visor del aceite hidraulico en la caja derecha */
  cil(null, 0.06, 0.06, 0.03, 'vidrio', '#9BB7C9', 0.95, 2.05, -1.347, ROTZ, 16);
  /* matafuego en la izquierda */
  cil('SCI', 0.09, 0.09, 0.42, 'pintura', '#C0201A', -0.08, 2.78, 1.12, null, 16);
  /* base de la cabina al centro */
  am(null, 1.75, 1.10, 1.40, 0.65, 2.00, 0, 0.05);

  /* ═══ cabina con ROPS amarillo de dos postes ═══ */
  var CX0 = -0.18, CX1 = 1.40, CZ = 0.84, CYB = 2.55, CYT = 3.36;
  var cab = trcCabina(D, G, { x0: CX0, x1: CX1, z0: -CZ, z1: CZ, yp: CYB, yb: CYB, yt: CYT, et: 0.06, hexP: NG, hexT: NG, hexB: AM, fp: 0.30 });
  [-1, 1].forEach(function(s){
    am('CBN', 0.18, 3.47 - 1.95, 0.16, 1.40, (3.47 + 1.95) / 2, s * 1.12, 0.04);
    am('CBN', 0.30, 0.14, 0.40, 1.40, 2.58, s * 1.02, 0.03);
    /* espejos en los postes delanteros */
    tubo(null, [CX0 + 0.05, 3.10, s * (CZ + 0.02)], [CX0 - 0.12, 3.20, s * (CZ + 0.28)], 0.018, 'mate', NG, 8);
    bloque(null, 0.05, 0.30, 0.20, 'mate', NG, CX0 - 0.14, 3.18, s * (CZ + 0.32), 0.02);
    bloque(null, 0.01, 0.26, 0.17, 'cromo', null, CX0 - 0.17, 3.18, s * (CZ + 0.32), 0.004);
    /* pasamanos de la puerta */
    tubo(null, [cab.xp - 0.06, 2.62, s * (CZ + 0.08)], [cab.xp - 0.06, 3.20, s * (CZ + 0.08)], 0.02, 'pintura', AM, 8);
  });
  am('CBN', 1.80, 0.12, 2.40, 0.61, 3.47, 0, 0.04);
  /* baranda del techo, faros y baliza */
  [-1, 1].forEach(function(s){ tubo(null, [-0.20, 3.56, s * 1.12], [1.45, 3.56, s * 1.12], 0.02, 'pintura', AM, 8); });
  [-0.20, 1.45].forEach(function(x){ [-1, 1].forEach(function(s){ tubo(null, [x, 3.53, s * 1.12], [x, 3.56, s * 1.12], 0.02, 'pintura', AM, 6); }); });
  [-0.85, -0.35, 0.35, 0.85].forEach(function(z){ trcLuz(D, 'LSM', -0.30, 3.46, z, [-1, 0], 0.22, 0.14); });
  [-1, 1].forEach(function(s){ trcLuz(D, s > 0 ? 'FPI' : 'FPD', 1.58, 3.40, s * 0.95, [1, 0], 0.24, 0.16); });
  bloque('AAC', 0.70, 0.18, 0.90, 'mate', TRC_GRIS, 0.95, 3.62, 0, 0.04);
  var bal = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4, roughness: 0.3 }));
  bal.position.set(0.20, 3.53, -0.95); D.reg('CIR', bal, '#F0A41C');
  bloque('TAB', 0.10, 0.50, 0.70, 'mate', '#25282C', CX1 - 0.12, 2.82, 0, 0.02);

  /* ═══ tanque de combustible atras: faros, catadiopticos y numero ═══ */
  am('TQC1', 0.58, 0.95, 2.62, 1.84, 2.075, 0, 0.08);
  cil(null, 0.09, 0.09, 0.08, 'mate', NG, 1.80, 2.58, 0.80, null, 16);
  [-1, 1].forEach(function(s){
    trcLuz(D, s > 0 ? 'FPI' : 'FPD', 2.17, 2.36, s * 1.05, [1, 0], 0.26, 0.18);
    cil(null, 0.05, 0.05, 0.02, 'vidrio', '#C2241B', 2.14, 2.38, s * 0.72, [0, 0, Math.PI / 2], 16);
  });
  var mN = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.30), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
  mN.position.set(2.136, 2.34, 0); mN.rotation.y = Math.PI / 2; G.add(mN);
  /* camara de retroceso */
  bloque('SENS', 0.10, 0.10, 0.12, 'mate', NG, 2.16, 2.62, 0.0, 0.02);

  /* ═══ ripper: un diente (D8T) o multiple de tres (D8) ═══ */
  [-1, 1].forEach(function(s){
    [0.32, 0.60].forEach(function(zz){ am(null, 0.44, 1.10, 0.06, 2.08, 1.12, s * zz, 0.02); });
    cil('PYB', 0.07, 0.07, 0.40, 'metal', '#4A4F55', 2.18, 1.50, s * 0.46, ROTZ, 12);
    cil('PYB', 0.07, 0.07, 0.40, 'metal', '#4A4F55', 2.18, 0.82, s * 0.46, ROTZ, 12);
  });
  var multi = v === 'D8';
  var XB = 3.12;
  [-1, 1].forEach(function(s){
    var z = s * 0.46;
    /* brazo inferior del paralelogramo */
    trcViga(D, null, [2.18, 0.82], [XB, 1.16], z, 0.24, 0.16, 'pintura', AM, 0.04);
    /* cilindros de inclinacion arriba y de levante en diagonal */
    D.cilHidD('PHY', [2.18, 1.50, z], [XB, 1.98, z], 0.085, AM, 0.55);
    D.cilHidD('PHY', [2.20, 1.02, s * 0.70], [XB - 0.05, 1.70, s * 0.70], 0.095, AM, 0.55);
    tubo('LPH', [2.10, 1.60, s * 0.38], [2.40, 1.80, s * 0.30], 0.022, 'goma', '#22262B', 8);
  });
  if(!multi){
    /* bastidor del diente con su bolsillo */
    am(null, 0.34, 1.10, 1.10, XB + 0.04, 1.57, 0, 0.05);
    am(null, 0.40, 0.40, 0.20, XB + 0.20, 1.80, 0, 0.04);
    trcDiente(D, [[3.30, 2.95], [3.62, 2.95], [3.62, 0.95], [3.55, 0.64], [3.38, 0.42], [3.14, 0.24], [3.02, 0.22], [3.08, 0.34],
                  [3.24, 0.58], [3.30, 0.88]], [[2.88, 0.18], [3.06, 0.20], [3.16, 0.30], [3.02, 0.36], [2.90, 0.26]], 0, AM);
    cil('PYB', 0.05, 0.05, 0.24, 'metal', '#4A4F55', 3.46, 2.10, 0, ROTZ, 12);
  } else {
    am(null, 0.34, 0.50, 2.30, XB + 0.04, 1.50, 0, 0.05);
    [-0.85, 0, 0.85].forEach(function(z){
      trcDiente(D, [[3.08, 1.95], [3.40, 1.95], [3.40, 0.95], [3.33, 0.66], [3.16, 0.44], [2.92, 0.26], [2.80, 0.24], [2.86, 0.36],
                    [3.02, 0.60], [3.08, 0.90]], [[2.66, 0.20], [2.84, 0.22], [2.94, 0.32], [2.80, 0.38], [2.68, 0.28]], z, AM);
      am(null, 0.42, 0.30, 0.22, 3.24, 1.50, z, 0.03);
    });
  }

  /* centrar en X (de la hoja a la punta del ripper) */
  var cx = (X0 + (multi ? 3.40 : 3.62)) / 2;
  G.children.forEach(function(m){ m.position.x -= cx; });
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = 1.75;
  G.userData.dist = 18;
  return G;
}

/* ═══ Komatsu D155AX y D155AX-6 ═══ */

/* el rotulo del modelo: franjas azules arriba y el numero en negro */
function trcRotuloKom(txt){
  return function(g, w, h){
    /* sin fondo: va sobre la chapa amarilla */
    g.fillStyle = TRC_KOMAZ;
    for(var i = 0; i < 4; i++) g.fillRect(w * 0.04, h * (0.06 + i * 0.09), w * 0.92, h * 0.05);
    g.fillStyle = '#16181C'; g.fillRect(w * 0.04, h * 0.46, w * 0.92, h * 0.50);
    g.fillStyle = '#FFFFFF'; g.textBaseline = 'middle'; g.textAlign = 'left';
    g.font = 'bold ' + Math.round(h * 0.20) + 'px "Arial Black", Arial, sans-serif';
    g.fillText('D', w * 0.08, h * 0.60);
    g.font = 'bold ' + Math.round(h * 0.36) + 'px "Arial Black", Arial, sans-serif';
    g.save(); g.translate(w * 0.22, h * 0.73); g.scale(0.82, 1); g.fillText(txt, 0, 0); g.restore();
  };
}

function trcConstruirKomatsu(v, piezas){
  var G = new THREE.Group(), D = kitDetalle(G, piezas);
  var bloque = D.bloque, tubo = D.tubo, cil = D.cilindro, AM = TRC_KOM, AM2 = TRC_KOM2, NG = TRC_NEGRO;
  var am = function(code, w, h, dd, x, y, z, r, rot){ return bloque(code, w, h, dd, 'pintura', AM, x, y, z, r, rot); };
  var ROTZ = [Math.PI / 2, 0, 0];

  /* ═══ orugas ovaladas: guia adelante, catarina atras, 7 rodillos y 2 portantes ═══ */
  var ZT = 2.14 / 2, FI = { x: -1.58, y: 0.66, r: 0.565 }, SP = { x: 1.63, y: 0.66, r: 0.565 };
  var rods = [-1.08, -0.72, -0.36, -0.02, 0.38, 0.74, 1.12];
  [-1, 1].forEach(function(s){
    var izq = s > 0, zc = s * ZT, cO = izq ? 'CLH' : 'CRH';
    trcOruga(D, { code: cO, z: zc, cs: [FI, SP], n: 42, ancho: 0.56, gr: 0.08, hE: 0.17, zRiel: 0.18,
      rodillos: rods, rRod: 0.13, yFondo: 0.095, portantes: [-0.36, 0.51], rPor: 0.10, yPort: 1.225, hex: AM, hex2: AM2,
      guias: [{ i: 0, code: izq ? 'RGL' : cO }],
      catarina: { i: 1, code: izq ? cO : 'SPR', codeMando: izq ? 'DLH' : 'DRH' } });
    /* bastidor monocasco, bogies K y soportes de los portantes */
    am(null, 2.60, 0.26, 0.38, -0.12, 0.69, zc, 0.05);
    bloque(null, 2.40, 0.06, 0.44, 'pintura', AM2, -0.12, 0.83, zc, 0.02);
    [[rods[1], rods[2]], [rods[3], rods[4]], [rods[5], rods[6]]].forEach(function(pr){
      var xb = (pr[0] + pr[1]) / 2;
      bloque(null, pr[1] - pr[0] + 0.30, 0.16, 0.50, 'pintura', AM2, xb, 0.52, zc, 0.04);
      cil('PYB', 0.06, 0.06, 0.56, 'metal', '#4A4F55', xb, 0.56, zc, ROTZ, 12);
      bloque(null, 0.16, 0.10, 0.46, 'goma', '#1E2023', xb, 0.62, zc, 0.02);
    });
    [-0.36, 0.51].forEach(function(xp){ am(null, 0.16, 0.16, 0.20, xp, 0.88, zc + s * 0.20, 0.03); });
    /* horquilla de la guia y proteccion */
    [-1, 1].forEach(function(t){ am(null, 0.60, 0.26, 0.06, FI.x + 0.26, FI.y + 0.03, zc + t * 0.32, 0.03); });
    bloque(null, 0.50, 0.10, 0.60, 'mate', TRC_GRIS, FI.x + 0.30, 0.30, zc, 0.02);
    /* munon del brazo de empuje */
    tubo('PYB', [0.37, 0.76, zc + s * 0.18], [0.37, 0.76, s * 1.44], 0.10, 'metal', '#4A4F55', 18);
    cil(null, 0.15, 0.15, 0.14, 'pintura', AM, 0.37, 0.76, s * 1.42, ROTZ, 22);
  });

  /* ═══ casco y barra igualadora ═══ */
  am(null, 4.60, 0.90, 1.24, -0.20, 0.95, 0, 0.06);
  bloque(null, 3.80, 0.04, 1.18, 'mate', TRC_GRIS, -0.60, 0.52, 0, 0.01);
  bloque(null, 0.24, 0.18, 2.40, 'pintura', AM2, -0.90, 0.92, 0, 0.04);
  bloque('TRM', 1.00, 0.50, 1.20, 'metal', TRC_GRIS, 1.00, 1.15, 0, 0.05);

  /* ═══ guardabarros ═══ */
  [-1, 1].forEach(function(s){
    am(null, 2.62, 0.08, 0.78, 0.85, 1.66, s * 1.01, 0.02);
    am(null, 2.62, 0.16, 0.05, 0.85, 1.58, s * 1.375, 0.02);
  });

  /* ═══ capot: abajo chapa perforada con el motor detras, arriba rejillas y la franja negra ═══ */
  var HX0 = -2.32, HX1 = -0.40, HZ = 0.70;
  [-1, 1].forEach(function(s){
    am(null, HX1 - HX0, 0.40, 0.06, (HX0 + HX1) / 2, 2.16, s * HZ, 0.02);
    am(null, HX1 - HX0, 0.12, 0.06, (HX0 + HX1) / 2, 1.46, s * HZ, 0.02);
    [HX0 + 0.04, -1.36, HX1 - 0.04].forEach(function(x){ am(null, 0.08, 0.58, 0.07, x, 1.73, s * HZ, 0.02); });
    trcChapaPerforada(G, AM, 0.86, 0.44, (HX0 + 0.08 - 1.40) / 2, 1.74, s * (HZ + 0.005), 0);
    trcChapaPerforada(G, AM, 0.84, 0.44, (-1.32 + HX1 - 0.08) / 2, 1.74, s * (HZ + 0.005), 0);
    /* tres rejillas de lamas de la tapa alta (alas de gaviota) */
    [-1.95, -1.42, -0.89].forEach(function(x){ trcLamasZ(D, null, x - 0.20, x + 0.20, 2.02, 2.30, s * (HZ + 0.03), 4, '#2A2D31', s); });
    /* franja negra con KOMATSU */
    bloque(null, HX1 - HX0 - 0.02, 0.15, 0.06, 'pintura', NG, (HX0 + HX1) / 2 + 0.40, 2.435, s * (HZ - 0.02), 0.02);
  });
  am(null, HX1 - HX0 + 0.04, 0.08, HZ * 2 + 0.06, (HX0 + HX1) / 2, 2.40, 0, 0.03);
  bloque(null, 1.60, 0.10, HZ * 2 - 0.10, 'pintura', NG, -1.05, 2.47, 0, 0.03);
  var texKom = texRotulo3d(rotuloTexto('KOMATSU', TRC_NEGRO, '#FFFFFF', 0.95), 512, 96);
  [-1, 1].forEach(function(s){ D.letrero(texKom, 0.80, 0.13, -0.85, 2.435, s * (HZ + 0.012), s > 0 ? 0 : Math.PI); });
  /* motor SAA6D140E: bloque, culata, turbo y posenfriador */
  bloque('ENG1', 1.50, 0.70, 0.86, 'metal', TRC_GRIS, -1.35, 1.80, 0, 0.06);
  bloque('ENG1', 1.36, 0.16, 0.50, 'metal', TRC_GRIS2, -1.35, 2.22, 0.06, 0.03);
  bloque('AFT1', 0.80, 0.14, 0.34, 'metal', '#7B8188', -1.30, 2.30, -0.22, 0.03);
  D.pon('TLH2', new THREE.TorusGeometry(0.13, 0.07, 10, 18), 'metal', '#6B7178', -0.75, 2.05, -0.36, [0, Math.PI / 2, 0]);
  cil('AL1', 0.10, 0.10, 0.20, 'metal', TRC_GRIS2, -2.02, 1.62, 0.46, [0, 0, Math.PI / 2], 16);
  cil('AR1', 0.09, 0.09, 0.30, 'metal', TRC_GRIS2, -0.82, 1.60, 0.48, [0, 0, Math.PI / 2], 14);
  /* escape con su codo y prefiltro */
  cil(null, 0.12, 0.12, 0.08, 'mate', NG, -1.31, 2.53, 0.25, null, 16);
  tubo(null, [-1.31, 2.53, 0.25], [-1.31, 3.24, 0.25], 0.085, 'mate', '#1E2023', 16);
  tubo(null, [-1.31, 3.22, 0.25], [-1.18, 3.36, 0.25], 0.085, 'mate', '#1E2023', 16);
  cil(null, 0.06, 0.06, 0.12, 'metal', TRC_GRIS2, -0.86, 2.56, -0.22, null, 14);
  cil(null, 0.15, 0.15, 0.24, 'mate', NG, -0.86, 2.74, -0.22, null, 24);
  cil(null, 0.17, 0.10, 0.10, 'mate', NG, -0.86, 2.90, -0.22, null, 24);
  /* pasamanos negro sobre el capot */
  [-1, 1].forEach(function(s){
    var zz = s * 0.58;
    tubo(null, [-1.60, 2.51, zz], [-1.60, 2.66, zz], 0.02, 'pintura', NG, 8);
    tubo(null, [-0.70, 2.51, zz], [-0.70, 2.66, zz], 0.02, 'pintura', NG, 8);
    tubo(null, [-1.60, 2.66, zz], [-0.70, 2.66, zz], 0.02, 'pintura', NG, 8);
  });

  /* ═══ mascara del radiador con rejilla y faros arriba ═══ */
  am(null, 0.32, 1.52, 1.70, -2.46, 1.91, 0, 0.06);
  D.lamas('RAD1', -2.64, 1.30, 2.40, -0.66, 0.66, 10, NG, -1);
  bloque('RAD1', 0.28, 1.20, 1.30, 'metal', '#2E3238', -2.20, 1.90, 0, 0.03);
  D.pon('FAN1', new THREE.TorusGeometry(0.50, 0.06, 10, 32), 'metal', TRC_GRIS2, -2.02, 1.90, 0, [0, Math.PI / 2, 0]);
  am(null, 0.40, 0.10, 1.74, -2.46, 2.70, 0, 0.03);
  [-1, 1].forEach(function(s){
    D.faro(s > 0 ? 'FDI' : 'FDD', -2.64, 2.56, s * 0.72, 0.09);
    am(null, 0.36, 0.30, 0.20, -2.30, 2.58, s * 0.88, 0.04);
  });
  bloque(null, 0.40, 0.12, 1.30, 'mate', TRC_GRIS, -2.55, 0.92, 0, 0.02);
  D.pon(null, new THREE.TorusGeometry(0.10, 0.035, 8, 16), 'metal', '#4A4F55', -2.72, 1.05, 0, [0, Math.PI / 2, 0]);

  /* ═══ hoja semi-U con inclinacion ═══ */
  var X0 = -3.85, hoja = trcHoja(D, { x0: X0, H: 1.79, lean: 0.55, bulge: 0.24, prof: 0.78, zc: 1.30, ww: 0.765, ang: 0.44, hex: AM, hex2: AM2 });
  var xh = function(y){ return hoja.xAtras(y); };
  [-1, 1].forEach(function(s){
    var z = s * 1.50;
    trcViga(D, null, [xh(0.42) + 0.10, 0.42], [0.37, 0.76], z, 0.36, 0.22, 'pintura', AM, 0.05);
    am(null, 0.40, 0.46, 0.34, xh(0.42) + 0.02, 0.42, z, 0.05);
    cil('PYB', 0.10, 0.10, 0.40, 'metal', '#4A4F55', xh(0.42) + 0.02, 0.42, z, ROTZ, 14);
    /* cilindros de levante amarillos, con el munon en la mascara */
    var top = [-1.90, 3.30, s * 0.98], rod = [xh(1.10) + 0.12, 1.10, s * 0.98];
    am(null, 0.26, 0.30, 0.24, xh(1.10) + 0.06, 1.10, s * 0.98, 0.04);
    D.cilHidD(s > 0 ? 'PHY' : 'HRH', top, rod, 0.11, AM, 0.56);
    cil('PYB', 0.07, 0.07, 0.34, 'metal', '#4A4F55', -2.24, 2.60, s * 0.92, ROTZ, 12);
    tubo('LPH', [top[0] - 0.05, top[1] - 0.25, s * 0.93], [-2.30, 2.68, s * 0.80], 0.025, 'goma', '#22262B', 8);
    /* cilindro de inclinacion a la izquierda (va por dentro del brazo) y tirante a la derecha */
    var a = [-2.00, 0.88, s * 1.44], b = [xh(1.45) + 0.06, 1.45, s * 1.32];
    am(null, 0.30, 0.16, 0.24, -2.00, 0.80, s * 1.50, 0.04);
    if(s > 0) D.cilHidD('PVL', a, b, 0.09, AM, 0.55);
    else tubo(null, a, b, 0.08, 'pintura', AM, 16);
  });

  /* ═══ cabina ROPS integrada, centrada ═══ */
  var CX0 = -0.40, CX1 = 1.45, CZ = 0.88;
  var cab = trcCabina(D, G, { x0: CX0, x1: CX1, z0: -CZ, z1: CZ, yp: 1.70, yb: 2.44, yt: 3.27, et: 0.125, hexP: NG, hexT: AM, hexB: AM,
    fp: 0.48, vBajo: { x: 0.55, y: 1.86 } });
  var texMod = texRotulo3d(trcRotuloKom(v === 'D155AX6' ? '155AX' : '155AX'), 256, 192);
  [-1, 1].forEach(function(s){
    trcLetreroT(G, texMod, 0.62, 0.46, 1.10, 2.08, s * (CZ + 0.012), s > 0 ? 0 : Math.PI);
    D.letrero(texKom, 0.54, 0.09, 0.48, 2.32, s * (CZ + 0.012), s > 0 ? 0 : Math.PI);
    tubo(null, [CX0 - 0.10, 1.80, s * (CZ + 0.10)], [CX0 - 0.10, 3.05, s * (CZ + 0.10)], 0.022, 'pintura', AM, 8);
    /* espejos */
    tubo(null, [CX0 + 0.05, 3.05, s * (CZ + 0.02)], [CX0 - 0.10, 3.14, s * (CZ + 0.26)], 0.018, 'mate', NG, 8);
    bloque(null, 0.05, 0.28, 0.18, 'mate', NG, CX0 - 0.12, 3.12, s * (CZ + 0.30), 0.02);
  });
  [-0.65, 0.65].forEach(function(z){ trcLuz(D, 'LSM', CX0 - 0.02, 3.30, z, [-1, 0], 0.20, 0.13); });
  [-0.55, 0.55].forEach(function(z){ trcLuz(D, z > 0 ? 'FPI' : 'FPD', CX1 + 0.06, 3.30, z, [1, 0], 0.20, 0.13); });
  bloque('AAC', 0.80, 0.14, 1.00, 'mate', TRC_GRIS, 0.75, 3.46, 0, 0.04);
  var bal = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4, roughness: 0.3 }));
  bal.position.set(1.20, 3.40, 0.62); D.reg('CIR', bal, '#F0A41C');
  /* antena */
  tubo(null, [1.30, 3.40, -0.70], [1.30, 3.80, -0.70], 0.008, 'mate', NG, 6);

  /* ═══ tanque hidraulico y valvulas a la derecha, baterias y matafuego a la izquierda ═══ */
  /* van adelante, junto al frente de la cabina, para no tapar el rotulo del modelo */
  am('TQH1', 0.80, 0.56, 0.42, 0.30, 1.98, -1.14, 0.06);
  cil(null, 0.06, 0.06, 0.03, 'vidrio', '#9BB7C9', 0.10, 1.95, -1.355, ROTZ, 16);
  bloque('VV1', 0.34, 0.30, 0.34, 'metal', TRC_GRIS2, -0.22, 1.86, -1.12, 0.03);
  bloque('40000054', 0.14, 0.30, 0.14, 'mate', '#C9CDD2', -0.22, 2.16, -1.12, 0.02);
  bloque('BAT', 0.60, 0.36, 0.42, 'mate', NG, -0.05, 1.88, 1.14, 0.04);
  cil('SCI', 0.09, 0.09, 0.42, 'pintura', '#C0201A', 0.45, 1.92, 1.14, null, 16);
  /* peldanos y asidero de acceso por la izquierda */
  bloque(null, 0.34, 0.04, 0.24, 'metal', '#4A4F55', 1.30, 1.10, 1.42, 0.01);
  tubo(null, [1.62, 1.75, 1.36], [1.62, 2.40, 1.36], 0.022, 'pintura', NG, 8);

  /* ═══ tanque de combustible atras, con el respaldo inclinado ═══ */
  D.perfil('TQC1', [[1.45, 1.70], [2.15, 1.70], [2.15, 1.86], [1.55, 2.44], [1.45, 2.44]], 2.30, 0, 'pintura', AM, 0.05);
  cil(null, 0.09, 0.09, 0.08, 'mate', NG, 1.78, 2.20, 0.75, [0, 0, 0.75], 16);
  [-1, 1].forEach(function(s){ trcLuz(D, s > 0 ? 'FPI' : 'FPD', 2.18, 1.78, s * 0.98, [1, 0], 0.22, 0.14); });
  var texNum = texNumero3d(null, '#17191C');
  var mN = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.20), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
  /* en el respaldo inclinado: primero mira a +X, despues se inclina hacia arriba */
  var angR = Math.atan2(0.60, 0.58);
  mN.rotation.order = 'ZYX'; mN.rotation.set(0, Math.PI / 2, angR);
  mN.position.set(1.85 + Math.cos(angR) * 0.04, 2.15 + Math.sin(angR) * 0.04, 0); G.add(mN);

  /* ═══ ripper: gigante de un diente (D155AX-6) o multiple de tres (D155AX) ═══ */
  var multi = v === 'D155AX';
  [-1, 1].forEach(function(s){
    [0.34, 0.62].forEach(function(zz){ am(null, 0.46, 1.20, 0.06, 2.30, 1.22, s * zz, 0.02); });
    cil('PYB', 0.07, 0.07, 0.40, 'metal', '#4A4F55', 2.30, 0.90, s * 0.48, ROTZ, 12);
    /* brazos del paralelogramo */
    trcViga(D, null, [2.30, 0.90], [3.90, 1.05], s * 0.48, 0.24, 0.18, 'pintura', AM, 0.04);
  });
  /* los dos cilindros al centro: levante arriba, inclinacion abajo */
  D.cilHidD('PHY', [2.38, 1.72, 0.20], [3.72, 1.94, 0.20], 0.10, AM, 0.55);
  D.cilHidD('PHY', [2.47, 1.40, -0.20], [3.68, 1.30, -0.20], 0.11, AM, 0.55);
  [0.20, -0.20].forEach(function(z){ am(null, 0.30, 0.30, 0.18, 2.34, z > 0 ? 1.72 : 1.40, z, 0.04); });
  if(!multi){
    /* porta-diente con el ojo grande del pivote */
    am(null, 0.42, 1.10, 1.10, 3.95, 1.60, 0, 0.05);
    cil('PYB', 0.18, 0.18, 1.14, 'pintura', AM2, 4.11, 1.12, 0, ROTZ, 24);
    trcDiente(D, [[3.98, 2.25], [4.34, 2.25], [4.34, 0.95], [4.25, 0.66], [4.05, 0.38], [3.80, 0.16], [3.66, 0.14], [3.74, 0.26],
                  [3.94, 0.52], [3.98, 0.88]], [[3.52, 0.08], [3.72, 0.12], [3.82, 0.22], [3.66, 0.28], [3.54, 0.18]], 0, AM);
  } else {
    am(null, 0.40, 0.50, 2.32, 3.95, 1.45, 0, 0.05);
    [-0.90, 0, 0.90].forEach(function(z){
      trcDiente(D, [[3.92, 1.95], [4.24, 1.95], [4.24, 0.95], [4.17, 0.66], [3.98, 0.42], [3.74, 0.24], [3.62, 0.22], [3.68, 0.34],
                    [3.86, 0.60], [3.92, 0.90]], [[3.48, 0.18], [3.66, 0.20], [3.76, 0.30], [3.62, 0.36], [3.50, 0.26]], z, AM);
    });
  }

  var cx = (X0 + 4.34) / 2;
  G.children.forEach(function(m){ m.position.x -= cx; });
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = 1.70;
  G.userData.dist = 18.5;
  return G;
}

/* ═══ rodillos lisos de un bandaje ═══ */

function trcRotuloHamm(g, w, h){
  g.fillStyle = TRC_HAMMGR; g.fillRect(0, 0, w, h);
  /* el cuadrito con la W del grupo Wirtgen y HAMM en blanco */
  g.strokeStyle = '#FFFFFF'; g.lineWidth = h * 0.06;
  g.strokeRect(w * 0.04, h * 0.18, h * 0.64, h * 0.64);
  g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold ' + Math.round(h * 0.46) + 'px Arial, sans-serif';
  g.fillText('W', w * 0.04 + h * 0.32, h * 0.52);
  g.font = 'bold ' + Math.round(h * 0.62) + 'px "Arial Black", Arial, sans-serif';
  g.textAlign = 'left'; g.fillText('HAMM', w * 0.04 + h * 0.85, h * 0.54);
}
/* letrero sin fondo: solo la tinta sobre la pintura (el fondo pintado en
   la textura no queda del mismo tono que la chapa con la luz del estudio) */
function trcLetreroT(G, tex, w, h, x, y, z, ry){
  var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, transparent: true,
    roughness: 0.5, metalness: 0.05, polygonOffset: true, polygonOffsetFactor: -2 }));
  m.position.set(x, y, z); m.rotation.y = ry;
  G.add(m);
  return m;
}
function trcTextoT(txt, tinta, ancho){
  return function(g, w, h){
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.66) + 'px "Arial Narrow", Arial, sans-serif';
    g.save(); g.translate(w / 2, h * 0.53); g.scale(ancho || 1, 1); g.fillText(txt, 0, 0); g.restore();
  };
}
function trcRotuloSany(fondo, tinta){
  return function(g, w, h){
    if(fondo){ g.fillStyle = fondo; g.fillRect(0, 0, w, h); }
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.80) + 'px "Arial Black", Arial, sans-serif';
    g.save(); g.translate(w / 2, h * 0.54); g.scale(1.05, 1); g.fillText('SANY', 0, 0); g.restore();
  };
}
/* la ola roja y negra del costado del bastidor del SSR200C-8H */
function trcOlaSany(g, w, h){
  g.fillStyle = TRC_SANYROJO;
  g.beginPath(); g.moveTo(w * 0.30, h * 0.30); g.bezierCurveTo(w * 0.55, h * 0.05, w * 0.85, h * 0.05, w * 0.98, h * 0.12);
  g.lineTo(w * 0.92, h * 0.75); g.bezierCurveTo(w * 0.70, h * 0.80, w * 0.45, h * 0.70, w * 0.28, h * 0.58); g.closePath(); g.fill();
  g.fillStyle = '#1B1D20';
  g.beginPath(); g.moveTo(w * 0.02, h * 0.62); g.bezierCurveTo(w * 0.35, h * 0.50, w * 0.60, h * 0.25, w * 0.88, h * 0.22);
  g.lineTo(w * 0.86, h * 0.36); g.bezierCurveTo(w * 0.62, h * 0.40, w * 0.40, h * 0.62, w * 0.02, h * 0.76); g.closePath(); g.fill();
  g.fillStyle = '#FFFFFF'; g.strokeStyle = '#1B1D20'; g.lineWidth = h * 0.03;
  g.font = 'italic bold ' + Math.round(h * 0.26) + 'px "Arial Black", Arial, sans-serif';
  g.textAlign = 'left'; g.textBaseline = 'middle';
  g.strokeText('C8H', w * 0.03, h * 0.30); g.fillText('C8H', w * 0.03, h * 0.30);
}
/* la placa roja del modelo de los -10 */
function trcPlacaSany(txt){
  return function(g, w, h){
    g.fillStyle = TRC_SANYROJO; g.fillRect(0, 0, w, h);
    g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.42) + 'px "Arial Narrow", Arial, sans-serif';
    g.fillText(txt, w / 2, h * 0.55, w * 0.92);
  };
}

/* medidas de cada rodillo (ver la cabecera) */
var TRC_RODILLOS = {
  HC200C:     { marca: 'HAMM', L: 6.61, W: 2.474, H: 3.046, wb: 3.06, dR: 0.80, dW: 2.14, tR: 0.79, tW: 0.59, modelo: 'HC 200 C' },
  SSR200C8H:  { marca: 'SANY', L: 6.797, W: 2.318, H: 3.33, wb: 3.182, dR: 0.80, dW: 2.13, tR: 0.79, tW: 0.59, modelo: 'SSR200C-8H', ola: true },
  SSR200C10S: { marca: 'SANY', L: 6.797, W: 2.318, H: 3.33, wb: 3.182, dR: 0.80, dW: 2.13, tR: 0.79, tW: 0.59, modelo: 'SSR200C-10S' },
  SSR120C:    { marca: 'SANY', L: 5.78, W: 2.29, H: 3.23, wb: 2.90, dR: 0.75, dW: 2.13, tR: 0.74, tW: 0.52, modelo: 'SSR120C-10' }
};

function trcConstruirRodillo(k, piezas){
  var P = TRC_RODILLOS[k], hamm = P.marca === 'HAMM';
  var G = new THREE.Group(), D = kitDetalle(G, piezas);
  var bloque = D.bloque, tubo = D.tubo, cil = D.cilindro, perfil = D.perfil, NG = TRC_NEGRO;
  var C1 = hamm ? TRC_HAMM : TRC_SANY, C2 = hamm ? TRC_HAMM2 : TRC_SANY2, GR = hamm ? TRC_HAMMGR : '#26292D';
  var c1 = function(code, w, h, dd, x, y, z, r, rot){ return bloque(code, w, h, dd, 'pintura', C1, x, y, z, r, rot); };
  var ROTZ = [Math.PI / 2, 0, 0];
  var dR = P.dR, xF = -P.L / 2, xd = xF + dR + 0.30, xr = xd + P.wb, xE = P.L / 2, xa = xd + dR + 0.52;
  var yT = 2 * dR + 0.04, zP = P.dW / 2 + 0.09, zt = P.dW / 2 - P.tW / 2 + 0.02;

  /* ═══ bandaje liso: virola, aros de los bordes y la cara lateral ═══ */
  var tam = cil(null, dR, dR, P.dW, 'metal', TRC_TAMBOR, xd, dR, 0, ROTZ, 64);
  tam.material.roughness = 0.30;
  [-1, 1].forEach(function(s){
    D.pon(null, new THREE.TorusGeometry(dR - 0.012, 0.022, 8, 64), 'metal', '#7E858C', xd, dR, s * (P.dW / 2 - 0.01));
    cil(null, dR * 0.94, dR * 0.94, 0.02, 'mate', '#4A4F55', xd, dR, s * (P.dW / 2 - 0.03), ROTZ, 48);
  });

  /* ═══ bastidor del bandaje: placas laterales, travesano delantero y trasero ═══ */
  var lat = [[xF, yT], [xd + dR + 0.22, yT], [xd + dR + 0.26, dR * 0.95], [xd + dR * 0.55, dR * 0.52], [xd - dR * 0.55, dR * 0.52], [xF + 0.06, dR * 0.98]];
  var texMarca = hamm ? texRotulo3d(trcRotuloHamm, 512, 112) : texRotulo3d(trcRotuloSany(null, '#25282C'), 512, 140);
  [-1, 1].forEach(function(s){
    var z = s * zP;
    perfil(null, lat, 0.07, z, 'pintura', C1, 0.025);
    if(hamm){
      /* franja gris de arriba y faldon gris de abajo, como en las fotos */
      bloque(null, xd + dR + 0.20 - xF, 0.26, 0.02, 'pintura', TRC_HAMMGR, (xF + xd + dR + 0.20) / 2, yT - 0.20, z + s * 0.04, 0.008);
      D.letrero(texMarca, 1.10, 0.24, xd - 0.35, yT - 0.20, z + s * 0.055, s > 0 ? 0 : Math.PI);
    } else if(P.ola){
      var texOla = texRotulo3d(trcOlaSany, 512, 256);
      trcLetreroT(G, texOla, 1.60, 0.80, xd - 0.05, yT - 0.48, z + s * 0.04, s > 0 ? 0 : Math.PI);
    } else {
      var texPl = texRotulo3d(trcPlacaSany(P.modelo), 256, 96);
      D.letrero(texPl, 0.46, 0.17, xd - 0.75, yT - 0.30, z + s * 0.04, s > 0 ? 0 : Math.PI);
    }
    /* soporte del eje del bandaje: placa redonda, tacos de goma y el motor */
    cil(null, 0.42, 0.42, 0.06, 'pintura', GR, xd, dR, z + s * 0.05, ROTZ, 36);
    for(var b = 0; b < 6; b++){
      var a = b / 6 * Math.PI * 2 + 0.3;
      cil(null, 0.075, 0.075, 0.10, 'goma', '#16181A', xd + Math.cos(a) * 0.30, dR + Math.sin(a) * 0.30, z - s * 0.06, ROTZ, 14);
      cil(null, 0.025, 0.025, 0.03, 'metal', '#8A8F95', xd + Math.cos(a) * 0.30, dR + Math.sin(a) * 0.30, z + s * 0.09, ROTZ, 6);
    }
    /* vibracion a la izquierda, traslacion a la derecha */
    cil(s > 0 ? 'PYM' : 'TML', 0.17, 0.20, 0.26, 'metal', TRC_GRIS2, xd, dR, z + s * 0.20, ROTZ, 24);
    tubo('LPH', [xd + 0.10, dR + 0.15, z + s * 0.28], [xd + dR + 0.25, yT - 0.40, z + s * 0.06], 0.025, 'goma', '#22262B', 8);
    tubo('LPH', [xd + 0.10, dR - 0.05, z + s * 0.28], [xd + dR + 0.25, yT - 0.55, z + s * 0.06], 0.025, 'goma', '#22262B', 8);
    /* pernos a lo largo de los bordes de la placa lateral (las fotos los muestran todos) */
    var pp = [], xB = xd + dR + 0.12;
    for(var i1 = 0; i1 < 10; i1++) pp.push([xF + 0.14 + i1 * (xB - xF - 0.14) / 9, yT - 0.07]);
    for(var i2 = 1; i2 < 5; i2++) pp.push([xB + 0.04 * i2 / 5, yT - 0.07 - i2 * (yT - dR * 1.05) / 5]);
    for(var i3 = 1; i3 < 4; i3++) pp.push([xF + 0.12 + i3 * 0.02, yT - 0.07 - i3 * (yT - dR * 1.05) / 4]);
    var ipb = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.026, 0.026, 0.03, 6), D.M.metal('#8A8F95'), pp.length);
    var dd = new THREE.Object3D();
    pp.forEach(function(q, j){ dd.position.set(q[0], q[1], z + s * 0.045); dd.rotation.set(Math.PI / 2, 0, 0); dd.updateMatrix(); ipb.setMatrixAt(j, dd.matrix); });
    ipb.frustumCulled = false; D.reg(null, ipb, null);
    /* ojos de izaje en las esquinas de arriba */
    [xF + 0.15, xB].forEach(function(x){ D.pon(null, new THREE.TorusGeometry(0.07, 0.025, 8, 16), 'pintura', C2, x, yT + 0.06, z - s * 0.02); });
    /* tapa del extremo del bandaje: anillo de pernos sobre la cara */
    var ia = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.02, 0.02, 0.03, 6), D.M.metal('#6A6E74'), 16);
    for(var b2 = 0; b2 < 16; b2++){
      var a2 = b2 / 16 * Math.PI * 2;
      dd.position.set(xd + Math.cos(a2) * 0.36, dR + Math.sin(a2) * 0.36, z + s * 0.085); dd.rotation.set(Math.PI / 2, 0, 0); dd.updateMatrix(); ia.setMatrixAt(b2, dd.matrix);
    }
    ia.frustumCulled = false; D.reg(null, ia, null);
  });
  /* travesano delantero inclinado (la proa) con la marca */
  perfil(null, [[xF - 0.05, yT], [xF + 0.26, yT], [xF + 0.26, yT - 0.70], [xF + 0.10, yT - 0.80]], zP * 2 + 0.07, 0, 'pintura', C1, 0.03);
  if(hamm){
    bloque(null, 0.03, 0.22, zP * 2, 'pintura', TRC_HAMMGR, xF - 0.035, yT - 0.18, 0, 0.008);
    D.letrero(texMarca, 1.20, 0.22, xF - 0.055, yT - 0.18, 0.30, -Math.PI / 2);
  } else {
    var pf = trcLetreroT(G, texMarca, 1.30, 0.36, xF - 0.025, yT - 0.32, 0, -Math.PI / 2);
    pf.rotation.order = 'YXZ'; pf.rotation.x = -0.08;
  }
  /* raspadores adelante y atras (desgaste) */
  [[-1, 0.42], [1, 0.42]].forEach(function(q){
    var ang = q[0] < 0 ? Math.PI + q[1] : -q[1];
    var xs = xd + Math.cos(ang) * (dR + 0.05), ys = dR + Math.sin(ang) * (dR + 0.05);
    bloque('GET', 0.04, 0.22, P.dW - 0.10, 'metal', TRC_GET, xs, ys, 0, 0.01, [0, 0, ang + Math.PI / 2 + (q[0] < 0 ? 0.5 : -0.5)]);
    [-1, 1].forEach(function(s){ trcViga(D, null, [xs, ys], [q[0] < 0 ? xF + 0.12 : xd + dR + 0.18, yT - 0.75], s * (P.dW / 2 - 0.15), 0.08, 0.06, 'pintura', GR, 0.01); });
  });
  bloque(null, 0.24, 0.80, zP * 2 + 0.07, 'pintura', C1, xd + dR + 0.17, yT - 0.40, 0, 0.04);
  /* el cuello hasta la articulacion */
  perfil(null, [[xd + dR + 0.20, yT - 0.10], [xa, 1.30], [xa, 0.62], [xd + dR + 0.20, 0.80]], 0.80, 0, 'pintura', C1, 0.03);

  /* ═══ articulacion: perno vertical, cilindros de direccion y engrase centralizado ═══ */
  cil('PYB', 0.11, 0.11, 0.86, 'metal', '#4A4F55', xa + 0.05, 0.98, 0, null, 18);
  [0.62, 1.32].forEach(function(y){ cil(null, 0.20, 0.20, 0.10, 'pintura', GR, xa + 0.05, y, 0, null, 24); });
  [-1, 1].forEach(function(s){ D.cilHidD(s > 0 ? 'SLH' : 'SRH', [xa + 0.80, 0.95, s * 0.36], [xa - 0.25, 0.95, s * 0.46], 0.06, GR, 0.55); });
  bloque('SEN', 0.26, 0.30, 0.18, 'mate', NG, xa + 0.55, 1.20, 0.60, 0.03);
  cil('GP1', 0.07, 0.07, 0.22, 'mate', '#C9CDD2', xa + 0.55, 1.46, 0.60, null, 14);
  tubo('LPH', [xa + 0.45, 1.10, 0.52], [xa + 0.05, 1.00, 0.18], 0.012, 'goma', '#22262B', 6);

  /* ═══ chasis trasero ═══ */
  [-1, 1].forEach(function(s){ bloque(null, xE - 0.20 - xa, 0.42, 0.14, 'pintura', GR, (xa + xE - 0.20) / 2, 0.78, s * 0.40, 0.03); });
  /* puente trasero con diferencial y reductores en las masas */
  cil(null, 0.15, 0.15, zt * 2 - 0.30, 'pintura', GR, xr, P.tR, 0, ROTZ, 20);
  D.pon('DIFP', new THREE.SphereGeometry(0.30, 24, 16), 'pintura', GR, xr, P.tR, 0);
  [-1, 1].forEach(function(s){ cil(s > 0 ? 'MLH' : 'MRH', 0.24, 0.20, 0.16, 'pintura', GR, xr, P.tR, s * (zt - P.tW / 2 - 0.06), ROTZ, 24); });
  /* llantas 23.1-26 de traccion con aro del color de la marca */
  var LL = { r: P.tR, ancho: P.tW, rAro: P.tR * 0.42, aro: hamm ? TRC_HAMMGR : C1, aro2: hamm ? '#2E3237' : C2, pernos: 12, paso: 0.30 };
  D.ruedaDet('LL1', xr, zt, 1, LL);
  D.ruedaDet('LL2', xr, -zt, -1, LL);

  /* ═══ plataforma, tanques y escalera ═══ */
  var yP = 2 * P.tR + 0.12, cX0 = xr - 1.42, cX1 = xr + 0.12;
  bloque(null, cX1 - cX0 + 0.40, 0.12, P.W - 0.20, 'pintura', GR, (cX0 + cX1) / 2 - 0.05, yP - 0.06, 0, 0.03);
  /* guardabarros sobre la parte delantera de las llantas */
  [-1, 1].forEach(function(s){
    perfil(null, [[xr - P.tR - 0.12, yP - 0.12], [xr + 0.25, yP - 0.12], [xr + 0.25, yP - 0.02], [xr - P.tR - 0.20, yP - 0.02]], P.tW + 0.12, s * zt, 'pintura', C1, 0.02);
  });
  /* pedestal de la cabina y los dos tanques a los lados */
  c1(null, cX1 - cX0 - 0.60, yP - 1.00 - 0.12, 0.90, (cX0 + cX1) / 2 - 0.35, (yP - 0.12 + 1.00) / 2, 0, 0.04);
  c1('TQC1', 0.80, 0.80, 0.42, xa + 0.62, 1.12, -0.72, 0.06);
  c1('TQH1', 0.70, 0.70, 0.40, xa + 1.05, 1.08, 0.72, 0.06);
  cil(null, 0.06, 0.06, 0.06, 'mate', NG, xa + 0.62, 1.55, -0.72, null, 14);
  cil(null, 0.05, 0.05, 0.02, 'vidrio', '#9BB7C9', xa + 1.05, 1.10, 0.925, ROTZ, 14);
  /* escalera de acceso a la izquierda: largueros y peldanos que miran a +Z */
  var xe = cX0 + 0.25;
  [-0.20, 0.20].forEach(function(dx){ bloque(null, 0.05, yP - 0.40, 0.06, 'pintura', GR, xe + dx, (yP + 0.40) / 2 - 0.08, P.W / 2 - 0.16, 0.012); });
  [0.62, 0.98, 1.34].forEach(function(y){ if(y < yP - 0.15) bloque(null, 0.40, 0.035, 0.22, 'metal', '#4A4F55', xe, y, P.W / 2 - 0.22, 0.008); });
  /* asideros */
  tubo(null, [cX0 - 0.02, yP + 0.10, P.W / 2 - 0.18], [cX0 - 0.02, yP + 0.95, P.W / 2 - 0.18], 0.02, 'pintura', C1, 8);

  /* ═══ cabina ═══ */
  var CZ = Math.min(0.82, P.W / 2 - 0.30);
  var cab = trcCabina(D, G, { x0: cX0, x1: cX1, z0: -CZ, z1: CZ, yp: yP, yb: yP + 0.30, yt: P.H - 0.16, et: 0.16,
    hexP: hamm ? TRC_HAMMGR : NG, hexT: hamm ? '#E7EAEC' : (P.ola ? NG : C1), hexB: hamm ? TRC_HAMMGR : NG, fp: 0.55, mando: 'volante' });
  [-1, 1].forEach(function(s){
    tubo(null, [cX0 + 0.04, P.H - 0.45, s * CZ], [cX0 - 0.10, P.H - 0.38, s * (CZ + 0.28)], 0.016, 'mate', NG, 8);
    bloque(null, 0.05, 0.28, 0.17, 'mate', NG, cX0 - 0.12, P.H - 0.42, s * (CZ + 0.32), 0.02);
    bloque(null, 0.01, 0.24, 0.14, 'cromo', null, cX0 - 0.15, P.H - 0.42, s * (CZ + 0.32), 0.004);
    trcLuz(D, 'LSM', cX0 - 0.06, P.H - 0.06, s * (CZ - 0.12), [-1, 0], 0.18, 0.12);
    trcLuz(D, s > 0 ? 'FPI' : 'FPD', cX1 + 0.06, P.H - 0.06, s * (CZ - 0.12), [1, 0], 0.18, 0.12);
  });
  bloque('AAC', 0.60, 0.12, 0.80, 'mate', TRC_GRIS, cX1 - 0.40, P.H + 0.05, 0, 0.03);
  /* visera sobre el parabrisas */
  bloque(null, 0.26, 0.03, CZ * 2 - 0.10, 'mate', '#202326', cX0 - 0.10, P.H - 0.24, 0, 0.01, [0, 0, -0.25]);
  /* barandas de la plataforma a los lados de la cabina (a la izquierda deja libre la escalera) */
  var zB = P.W / 2 - 0.14;
  D.baranda([[cX0 + 0.55, zB], [cX1 + 0.12, zB]], yP, 0.95, hamm ? TRC_HAMMGR : C1);
  D.baranda([[cX0 - 0.15, -zB], [cX1 + 0.12, -zB]], yP, 0.95, hamm ? TRC_HAMMGR : C1);
  var bal = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4, roughness: 0.3 }));
  bal.position.set(cX0 + 0.40, P.H, 0.45); D.reg('CIR', bal, '#F0A41C');
  bloque('TAB', 0.10, 0.40, 0.60, 'mate', '#25282C', cX1 - 0.10, yP + 0.55, 0, 0.02);

  /* ═══ capot del motor: angosto entre las llantas, ancho detras, techo inclinado ═══ */
  var hF = yP + 0.38, hR = hF - 0.24, xH0 = xr - 0.02, xH1 = xr + P.tR + 0.12, zN = zt - P.tW / 2 - 0.04, zA = P.W / 2 - 0.08;
  var techo = function(x){ return hF + (x - xH0) / (xE - 0.20 - xH0) * (hR - hF); };
  perfil(null, [[xH0, 0.98], [xH1, 0.98], [xH1, techo(xH1)], [xH0, techo(xH0)]], zN * 2, 0, 'pintura', C1, 0.03);
  perfil(null, [[xH1, 0.70], [xE - 0.08, 0.70], [xE, 0.90], [xE, hR - 0.18], [xE - 0.20, hR], [xH1, techo(xH1)]], zA * 2, 0, 'pintura', C1, 0.04);
  /* la parte baja del capot en gris oscuro (como la marca) y la chapa perforada con el motor */
  [-1, 1].forEach(function(s){
    bloque(null, xE - xH1 - 0.10, 0.34, 0.02, 'pintura', GR, (xH1 + xE - 0.10) / 2, 0.88, s * (zA + 0.01), 0.008);
    trcLamasZ(D, null, xH1 + 0.25, xE - 0.45, hR - 0.30, hR - 0.08, s * (zA + 0.01), 4, '#22252A', s);
    /* juntas de las tapas de servicio, cerraduras y bisagras */
    [xH1 + 0.10, xE - 0.30].forEach(function(x){ bloque(null, 0.02, hR - 1.20, 0.012, 'mate', '#1A1C1F', x, (hR + 1.10) / 2 - 0.05, s * (zA + 0.012), 0.004); });
    bloque(null, 0.12, 0.05, 0.04, 'cromo', null, xE - 0.45, 1.70, s * (zA + 0.025), 0.01);
    [1.25, 1.75].forEach(function(y){ bloque(null, 0.05, 0.10, 0.04, 'mate', '#202326', xH1 + 0.16, y, s * (zA + 0.02), 0.01); });
    (hamm ? D.letrero : function(a, b, c, x, y, z, r){ return trcLetreroT(G, a, b, c, x, y, z, r); })(texMarca, hamm ? 0.86 : 0.80, hamm ? 0.19 : 0.22, (xH1 + xE) / 2 - 0.10, 1.40, s * (zA + 0.012), s > 0 ? 0 : Math.PI);
  });
  /* el motor se ve por debajo del capot angosto */
  bloque('ENG1', xH1 - xH0 + 0.80, 0.70, 0.70, 'metal', TRC_GRIS, (xH0 + xH1) / 2 + 0.40, 1.15, 0, 0.05);
  bloque('PYM', 0.30, 0.30, 0.36, 'metal', TRC_GRIS2, xH0 - 0.10, 1.05, 0, 0.03);
  /* rejilla del radiador atras, faros, parachoques y baterias */
  D.lamas('RAD1', xE + 0.035, 0.98, hR - 0.30, -zA + 0.25, zA - 0.25, 9, '#22252A', 1);
  [-1, 1].forEach(function(s){
    trcLuz(D, s > 0 ? 'FPI' : 'FPD', xE + 0.02, hR - 0.30, s * (zA - 0.10), [1, 0], 0.16, 0.22);
  });
  bloque(null, 0.24, 0.30, zA * 2 + 0.10, 'pintura', GR, xE - 0.02, 0.62, 0, 0.06);
  bloque('BAT', 0.40, 0.26, 0.50, 'mate', NG, xE - 0.45, 0.60, 0.45, 0.03);
  /* escape y toma de aire en el techo del capot */
  tubo(null, [xE - 0.80, techo(xE - 0.80), -0.45], [xE - 0.80, techo(xE - 0.80) + 0.30, -0.45], 0.06, 'mate', '#1E2023', 14);
  cil(null, 0.10, 0.10, 0.18, 'mate', NG, xH1 + 0.20, techo(xH1 + 0.20) + 0.08, 0.40, null, 18);
  /* numero de unidad en la cola del capot */
  var texNum = texNumero3d(null, hamm ? '#FFFFFF' : '#1B1D20');
  [-1, 1].forEach(function(s){
    var mN = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.20), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
    mN.position.set(xE - 0.55, 1.12, s * (zA + 0.025)); mN.rotation.y = s > 0 ? 0 : Math.PI; G.add(mN);
  });
  /* el modelo en la placa lateral trasera */
  var texMod = texRotulo3d(trcTextoT(P.modelo, hamm ? '#FFFFFF' : '#1B1D20', 0.9), 384, 80);
  [-1, 1].forEach(function(s){ trcLetreroT(G, texMod, 0.70, 0.15, xd + dR - 0.10, yT - 0.60, s * (zP + 0.04), s > 0 ? 0 : Math.PI); });

  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = 1.50;
  G.userData.dist = 15;
  return G;
}

/* ═══ registro ═══ */
registrarModelo3d({
  nombre: 'CAT D8 y D8T',
  /* D8 de CAT o CATERPILLAR; el D800 es una perforadora Everdigm */
  clave: function(e){
    var m = mod3d(e), mk = String((e && e.marca) || '').toUpperCase();
    if(/^D8T$/.test(m)) return 'D8T';
    if(m === 'D8' && /^CAT/.test(mk)) return 'D8';
    return null;
  },
  construir: function(e, piezas, clave){ return trcConstruirCat(clave, piezas); }
});
registrarModelo3d({
  nombre: 'Komatsu D155AX y D155AX-6',
  clave: function(e){
    var m = mod3d(e);
    return /^D155AX6/.test(m) ? 'D155AX6' : /^D155AX/.test(m) ? 'D155AX' : null;
  },
  construir: function(e, piezas, clave){ return trcConstruirKomatsu(clave, piezas); }
});
registrarModelo3d({
  nombre: 'Rodillos lisos HAMM HC 200 C y SANY SSR',
  clave: function(e){
    var m = mod3d(e);
    if(/^HC200C/.test(m)) return 'HC200C';
    if(/^SSR120C/.test(m)) return 'SSR120C';
    if(/^SSR200C10/.test(m)) return 'SSR200C10S';
    if(/^SSR200C8/.test(m)) return 'SSR200C8H';
    return null;
  },
  construir: function(e, piezas, clave){ return trcConstruirRodillo(clave, piezas); }
});
