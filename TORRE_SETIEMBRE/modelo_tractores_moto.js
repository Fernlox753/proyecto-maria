/* ══════════════════════════════════════════════════════════════════
   TRACTORES, MOTONIVELADORAS Y RODILLO QUE FALTABAN — modelos de detalle
     CAT D6T (T-42) · CAT D9T (T-31) · Komatsu D65EX (T-45)
     CAT 140H (MO-23) · Komatsu GD555-5 (MO-277-AL) · GD675-5 (MO-272-AL)
     CAT CS-533E (RO-08)

   El cuerpo de los tractores sale del D8T y del D155AX de modelo_tractores.js
   (copiado con prefijo tmn): se arma a la medida de esos y despues se
   estira por ejes (tmnEstirar) hasta las cotas del modelo; las orugas, la
   hoja y el ripper se arman con sus medidas reales, asi las ruedas, los
   rodillos y las tejas quedan redondos y con su paso verdadero.

   Medidas (m):
   CAT D6T (Cat D6T specalog; ritchiespecs D6T STD): trocha 1.88 · oruga en
     el suelo 2.67 · tejas de 560, paso 203, 39 por lado · 6 rodillos ·
     despeje 0.38 · alto a la cabina 3.20 · largo basico 3.86 · ancho sobre
     orugas 2.44 · hoja SU 3.26 x 1.41 · ripper multiple de tres dientes.
     Estirado del D8T: largo x0.83, alto x0.92, ancho x0.90.
   CAT D9T (ritchiespecs D9T WH; petersoncat): trocha 2.25 · oruga en el
     suelo 3.47 · tejas de 610, paso 240 · 8 rodillos · despeje 0.60 · alto
     a la cabina 3.82, al ROPS 4.00 · largo basico 4.91, con hoja 6.63 ·
     ancho sin munones 2.86 · hoja 9SU 4.32 x 1.94 · ripper de un diente.
     Estirado del D8T: largo x1.06, alto x1.10, ancho x1.08.
   Komatsu D65EX-18 (lectura-specs y folleto Komatsu D65EX/PX-18): trocha
     1.90 · oruga en el suelo 2.85 · tejas de 560, 7 rodillos, 2 portantes
     · alto a la cabina 3.19 · largo con hoja 5.44 · hoja Sigmadozer 3.415 x
     1.425 · ripper multiple de tres dientes. Estirado del D155AX-6: largo
     x0.87, alto x0.94, ancho x0.89.
   CAT 140H (ritchiespecs 140H): batalla 6.17 · tandem 1.52 · base de hoja
     2.56 · alto a la cabina 3.12 · ancho 2.46 · largo 8.71 (sin placa ni
     ripper) · vertedera 3.66 x 0.61 · circulo 1.53 · llantas 14.00-24.
   Komatsu GD555-5 (ritchiespecs, BIA, komatsu.com/en-au): batalla 6.27 ·
     tandem 1.52 · trocha 2.06 · ancho 2.49 · alto 3.20 · largo 10.37 con
     placa y ripper · vertedera 3.71 x 0.645 · llantas 14.00-24.
   Komatsu GD675-5 (ritchiespecs): batalla 6.48 · tandem 1.53 · ancho 2.63
     · alto 3.20 · largo 10.58 · vertedera 4.33 x 0.645 · llantas 17.5R25.
   CAT CS-533E (trakindo.co.id, bm-cat.com): largo 5.51 · ancho 2.29 · alto
     3.07 · batalla 2.90 · bandaje 1.534 x 2.134 · llantas 23.1-26.
   Lo que no esta acotado (cabina, capot, escape, tanques) sale de las
   fotos y de los dibujos de los modelos hermanos (D8T, D155AX, 12M/140K).

   Ejes: frente hacia -X (la hoja o el bandaje), arriba +Y, la izquierda
   del operador +Z.
   ══════════════════════════════════════════════════════════════════ */
/* los tonos van un poco mas oscuros que la pintura real: el estudio quema los techos */
var TMN_CAT = '#DC990A', TMN_CAT2 = '#A87406', TMN_NEGRO = '#1B1D20', TMN_GRIS = '#3C4148', TMN_GRIS2 = '#5B636C',
    TMN_ACERO = '#55595F', TMN_TEJA = '#36393D', TMN_GET = '#2C2F33', TMN_KOM = '#E6B20C', TMN_KOM2 = '#AD8508',
    TMN_KOMAZ = '#1F48A8', TMN_TAMBOR = '#8D949B';

/* estira por ejes las mallas de G desde el hijo «desde»: hornea su
   transformacion en la geometria (o en cada instancia) y la escala k =
   [kx, ky, kz] queda en coordenadas del modelo, sin torcer lo que estaba
   girado. Asi el cuerpo de un modelo hermano llega a las cotas de otro. */
function tmnEstirar(G, desde, k){
  var S = new THREE.Matrix4().makeScale(k[0], k[1], k[2]), m = new THREE.Matrix4();
  G.children.slice(desde).forEach(function(o){
    o.updateMatrix();
    if(o.isInstancedMesh){
      for(var i = 0; i < o.count; i++){ o.getMatrixAt(i, m); m.premultiply(o.matrix).premultiply(S); o.setMatrixAt(i, m); }
      o.instanceMatrix.needsUpdate = true;
    } else if(o.isMesh){
      var g = o.geometry.clone();
      g.applyMatrix4(o.matrix); g.applyMatrix4(S);
      o.geometry = g;
    } else {
      o.position.multiply(new THREE.Vector3(k[0], k[1], k[2]));
      return;
    }
    o.position.set(0, 0, 0); o.rotation.set(0, 0, 0); o.scale.set(1, 1, 1);
  });
}

/* ═══ geometria ═══ */

/* junta varias geometrias en una sola (sin indices): asi una teja con su
   garra o un eslabon con su buje son una sola malla instanciada */
function tmnFundir(geos){
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
function tmnCamino(cs){
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
function tmnOruga(D, o){
  var cam = tmnCamino(o.cs), N = o.n, p = cam.L / N, e = 0.03, gr = o.gr, hE = o.hE, A = o.ancho, zc = o.z, zr = o.zRiel;
  var so = zc > 0 ? 1 : -1, ROT = [Math.PI / 2, 0, 0];
  /* tejas: plancha, garra y su filete */
  var gGa = new THREE.BoxGeometry(0.05, gr, A * 0.99); gGa.translate(-p * 0.18, -e / 2 - gr / 2 + 0.002, 0);
  var gFi = new THREE.BoxGeometry(p * 0.34, 0.022, A * 0.99); gFi.translate(-p * 0.18, -e / 2 - 0.010, 0);
  var gBo = new THREE.BoxGeometry(p * 0.10, e * 0.8, A * 0.99); gBo.translate(p * 0.44, e * 0.25, 0);
  var gZ = tmnFundir([new THREE.BoxGeometry(p * 0.90, e, A), gGa, gFi, gBo]);
  /* eslabones: dos placas con su riel, buje al medio y cabeza del pasador afuera */
  var gs = [];
  [-1, 1].forEach(function(s){
    var b = new THREE.BoxGeometry(p * 0.97, hE * 0.70, 0.068); b.translate(0, e / 2 + hE * 0.40, s * zr); gs.push(b);
    var b2 = new THREE.BoxGeometry(p * 0.80, hE * 0.26, 0.078); b2.translate(-p * 0.06, e / 2 + hE * 0.86, s * zr); gs.push(b2);
    var pc = new THREE.CylinderGeometry(0.036, 0.036, 0.05, 8); pc.rotateX(Math.PI / 2); pc.translate(p / 2, e / 2 + hE * 0.45, s * (zr + 0.05)); gs.push(pc);
  });
  var bu = new THREE.CylinderGeometry(0.052, 0.052, 2 * zr - 0.05, 10); bu.rotateX(Math.PI / 2); bu.translate(p / 2, e / 2 + hE * 0.45, 0); gs.push(bu);
  var mZ = D.M.metal(o.hexTeja || TMN_TEJA); mZ.roughness = 0.6; mZ.metalness = 0.7;
  var mE = D.M.metal(TMN_ACERO); mE.roughness = 0.42;
  var zap = new THREE.InstancedMesh(gZ, mZ, N), esl = new THREE.InstancedMesh(tmnFundir(gs), mE, N);
  var d = new THREE.Object3D();
  for(var k = 0; k < N; k++){
    var q = cam.en((k + 0.5) * p);
    d.position.set(q.x, q.y, zc); d.rotation.set(0, 0, q.ang); d.updateMatrix();
    zap.setMatrixAt(k, d.matrix); esl.setMatrixAt(k, d.matrix);
  }
  [zap, esl].forEach(function(m){ m.frustumCulled = false; });
  D.reg(o.code, zap, o.hexTeja || TMN_TEJA);
  D.reg(o.code, esl, TMN_ACERO);

  /* rodillos de doble pestana sobre los rieles (instanciados) */
  var rodillo = function(r, n){
    var g = [];
    [-1, 1].forEach(function(s){
      var t = new THREE.CylinderGeometry(r, r, 0.11, 22); t.rotateX(Math.PI / 2); t.translate(0, 0, s * zr); g.push(t);
      var f = new THREE.CylinderGeometry(r + 0.045, r + 0.045, 0.035, 22); f.rotateX(Math.PI / 2); f.translate(0, 0, s * (zr + 0.072)); g.push(f);
      var c = new THREE.CylinderGeometry(r * 0.45, r * 0.52, 0.07, 14); c.rotateX(Math.PI / 2); c.translate(0, 0, s * (zr + 0.12)); g.push(c);
    });
    var h = new THREE.CylinderGeometry(r * 0.72, r * 0.72, 2 * zr - 0.1, 18); h.rotateX(Math.PI / 2); g.push(h);
    var im = new THREE.InstancedMesh(tmnFundir(g), D.M.metal('#3D4147'), n);
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
function tmnViga(D, code, a, b, z, alto, ancho, tipo, hex, r){
  var L = Math.hypot(b[0] - a[0], b[1] - a[1]);
  return D.bloque(code, L, alto, ancho, tipo, hex, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z, r === undefined ? 0.04 : r,
    [0, 0, Math.atan2(b[1] - a[1], b[0] - a[0])]);
}

/* faro de trabajo rectangular (LED): caja negra, mica que brilla; n = normal [nx, nz] */
function tmnLuz(D, code, x, y, z, n, w, h){
  var dx = n[0], dz = n[1], ax = Math.abs(dx) > 0.5;
  D.bloque(null, ax ? 0.12 : w, h, ax ? w : 0.12, 'mate', TMN_NEGRO, x, y, z, 0.02);
  var m = new THREE.Mesh(new THREE.BoxGeometry(ax ? 0.02 : w * 0.82, h * 0.72, ax ? w * 0.82 : 0.02),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#FFF6DA'), emissive: new THREE.Color('#7A6E4A'), roughness: 0.12, metalness: 0.1 }));
  m.position.set(x + dx * 0.065, y, z + dz * 0.065);
  return D.reg(code, m, '#FFF6DA');
}

/* rejilla de lamas en una cara que mira a +Z (sz = 1) o a -Z (sz = -1) */
function tmnLamasZ(D, code, x0, x1, y0, y1, z, n, hex, sz){
  var paso = (y1 - y0) / n;
  D.bloque(code, x1 - x0 + 0.10, y1 - y0 + 0.10, 0.06, 'mate', hex, (x0 + x1) / 2, (y0 + y1) / 2, z - sz * 0.01, 0.02);
  for(var i = 0; i < n; i++){
    D.pon(null, new THREE.BoxGeometry(x1 - x0, paso * 0.70, 0.04), 'mate', '#0B0C0E', (x0 + x1) / 2, y0 + paso * (i + 0.5), z + sz * 0.035, [sz * 0.5, 0, 0]);
  }
}

/* chapa perforada (puertas del motor): textura con agujeros que se
   recortan con alphaTest, asi el motor se ve detras */
function tmnChapaPerforada(G, hex, w, h, x, y, z, ry){
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
function tmnCabina(D, G, o){
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
function tmnHoja(D, o){
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
    D.pon('GET', ala(new THREE.BoxGeometry(0.07, 0.24, o.ww - 0.05).translate(x0 + 0.03, 0.12, 0), s, o.ww - 0.05), 'metal', TMN_GET);
    D.bloque('GET', 0.30, 0.30, 0.10, 'metal', TMN_GET, x0 + dx + 0.10, 0.15, s * (o.zc + o.ww - 0.07), 0.03, [0, s * o.ang, 0]);
    /* costillas del ala atras */
    var cr = tmnViga(D, null, [xAtras(0.40) + 0.04 - o.ww * 0.5 * tg, 0.40], [xAtras(H - 0.05) + 0.04 - o.ww * 0.5 * tg, H - 0.05], s * (o.zc + o.ww * 0.5), 0.14, 0.06, 'pintura', o.hex2, 0.02);
    cr.rotation.y = s * o.ang;
  });
  /* cuchillas del centro: tres segmentos con pernos */
  for(var c = 0; c < 3; c++){
    var zz = -o.zc + o.zc * 2 / 3 * (c + 0.5);
    D.bloque('GET', 0.07, 0.24, o.zc * 2 / 3 - 0.02, 'metal', TMN_GET, x0 + 0.03, 0.12, zz, 0.012);
    for(var b = 0; b < 4; b++) D.cilindro(null, 0.022, 0.022, 0.02, 'metal', '#77706A', x0 - 0.005, 0.15, zz - 0.32 + b * 0.21, [0, 0, Math.PI / 2], 6);
  }
  /* atras: dos vigas cajon y costillas verticales */
  [0.45, H - 0.40].forEach(function(y){ D.bloque('LPN', 0.20, 0.22, o.zc * 2, 'pintura', o.hex2, xAtras(y) + 0.09, y, 0, 0.03); });
  for(var r = -3; r <= 3; r++){
    tmnViga(D, null, [xAtras(0.35) + 0.05, 0.35], [xAtras(H - 0.05) + 0.05, H - 0.05], r * o.zc / 3.4, 0.16, 0.06, 'pintura', o.hex2, 0.02);
  }
  /* labio de arriba */
  D.bloque('LPN', 0.10, 0.08, o.zc * 2, 'pintura', o.hex, xt - 0.05, H + 0.06, 0, 0.02);
  return { xAtras: xAtras };
}

/* diente de ripper: placa con el perfil, punta y protector de GET */
function tmnDiente(D, pts, punta, z, hex){
  D.perfil(null, pts, 0.10, z, 'pintura', hex, 0.02);
  D.perfil('GET', punta, 0.11, z, 'metal', TMN_GET, 0.01);
}


/* ═══ CAT D6T y D9T: el cuerpo del D8T estirado a sus cotas ═══
   P.k = estiramiento [largo, alto, ancho] respecto del D8T; las orugas,
   la hoja y el ripper van con sus medidas reales (ver la cabecera) */
var TMN_DOZ_CAT = {
  D6T: { modelo: 'D6T', k: [0.83, 0.92, 0.90], ZT: 1.88 / 2,
         FI: { x: -1.44, y: 0.42, r: 0.34 }, RI: { x: 1.43, y: 0.42, r: 0.34 }, SP: { x: 0.80, y: 1.25, r: 0.33 },
         nRod: 6, rRod: 0.105, paso: 0.203, ancho: 0.56, gr: 0.065, hE: 0.13, zRiel: 0.165, yFondo: 0.085,
         hojaW: 3.26, hojaH: 1.41, ripper: 'multi', techoNegro: false },
  D9T: { modelo: 'D9T', k: [1.06, 1.10, 1.08], ZT: 2.25 / 2,
         FI: { x: -1.87, y: 0.54, r: 0.44 }, RI: { x: 1.86, y: 0.54, r: 0.44 }, SP: { x: 1.02, y: 1.50, r: 0.42 },
         nRod: 8, rRod: 0.13, paso: 0.240, ancho: 0.61, gr: 0.085, hE: 0.17, zRiel: 0.21, yFondo: 0.10,
         hojaW: 4.32, hojaH: 1.94, ripper: 'uno', techoNegro: true }
};

function tmnConstruirCat(P, piezas){
  var G = new THREE.Group(), D = kitDetalle(G, piezas);
  var bloque = D.bloque, tubo = D.tubo, cil = D.cilindro, AM = TMN_CAT, AM2 = TMN_CAT2, NG = TMN_NEGRO;
  var am = function(code, w, h, dd, x, y, z, r, rot){ return bloque(code, w, h, dd, 'pintura', AM, x, y, z, r, rot); };
  var ROTZ = [Math.PI / 2, 0, 0];
  var v = P.modelo, K = P.k;

  /* ═══ orugas de rueda motriz elevada: guia adelante, guia atras y catarina arriba ═══
     el cuerpo se arma en medidas del D8T (pre) y se estira; las orugas se
     arman despues, ya en sus medidas reales */
  var pre = function(c){ return { x: c.x / K[0], y: c.y / K[1], r: c.r / K[1] }; };
  var FI = pre(P.FI), RI = pre(P.RI), SP = pre(P.SP), ZT = P.ZT / K[2];
  var rodsR = [], paso = (P.RI.x - P.FI.x - P.FI.r * 1.6) / (P.nRod - 1);
  for(var i = 0; i < P.nRod; i++) rodsR.push(P.FI.x + P.FI.r * 0.8 + i * paso);
  var rods = rodsR.map(function(x){ return x / K[0]; });
  [-1, 1].forEach(function(s){
    var zc = s * ZT;
    /* bastidor de rodillos con bogies mayores y menores (tren suspendido) */
    am(null, 2.90, 0.26, 0.36, 0, 0.68, zc, 0.05);
    am(null, 2.40, 0.10, 0.44, 0, 0.83, zc, 0.03);
    for(var b = 0; b < rods.length / 2; b++){
      var xb = (rods[2 * b] + rods[2 * b + 1]) / 2;
      bloque(null, 0.62, 0.15, 0.50, 'pintura', AM2, xb, 0.50, zc, 0.04);
      cil('PYB', 0.06, 0.06, 0.56, 'metal', '#4A4F55', xb, 0.53, zc, ROTZ, 12);
    }
    [-0.72, 0.72].forEach(function(xb){ am(null, 1.30, 0.20, 0.06, xb, 0.60, zc + s * 0.25, 0.03); cil('PYB', 0.08, 0.08, 0.10, 'metal', '#4A4F55', xb, 0.62, zc + s * 0.29, ROTZ, 14); });
    /* horquillas de las guias y la proteccion de los extremos */
    [FI, RI].forEach(function(c){
      var sx = c.x < 0 ? 1 : -1;
      [-1, 1].forEach(function(t){ am(null, 0.52, 0.22, 0.06, c.x + sx * 0.20, c.y + 0.02, zc + t * 0.33, 0.03); });
      bloque(null, 0.40, 0.08, 0.66, 'mate', TMN_GRIS, c.x + sx * 0.32, 0.26, zc, 0.02);
    });
    /* munon del brazo de empuje y su soporte */
    tubo('PYB', [0.53, 0.70, zc + s * 0.18], [0.53, 0.70, s * 1.42], 0.10, 'metal', '#4A4F55', 18);
    cil(null, 0.15, 0.15, 0.14, 'pintura', AM, 0.53, 0.70, s * 1.40, ROTZ, 22);
    /* peldano en la cola del bastidor */
    bloque(null, 0.30, 0.04, 0.24, 'metal', '#4A4F55', 1.40, 0.92, zc + s * 0.25, 0.01);
  });

  /* ═══ casco, barra igualadora y protector inferior ═══ */
  am(null, 4.20, 0.80, 1.16, -0.20, 1.03, 0, 0.06);
  bloque(null, 3.60, 0.04, 1.10, 'mate', TMN_GRIS, -0.50, 0.64, 0, 0.01);
  bloque(null, 0.22, 0.18, 2.36, 'pintura', AM2, -0.78, 0.90, 0, 0.04);
  [-1, 1].forEach(function(s){ cil('PYB', 0.07, 0.07, 0.18, 'metal', '#4A4F55', -0.78, 0.90, s * 1.10, ROTZ, 12); });
  bloque('TRM', 1.10, 0.50, 1.20, 'metal', TMN_GRIS, 0.95, 1.20, 0, 0.05);

  /* ═══ capot del motor: marco amarillo, puertas de chapa perforada y el C15 adentro ═══ */
  var HX0 = -2.12, HX1 = -0.25, HY0 = 1.42, HY1 = 2.70, HZ = 0.62;
  /* el techo del capot: negro antirreflejo en el D9T, amarillo en el D6T (fotos) */
  bloque(null, HX1 - HX0 + 0.06, 0.10, HZ * 2 + 0.08, 'pintura', P.techoNegro ? NG : AM, (HX0 + HX1) / 2, HY1 + 0.05, 0, 0.04);
  [-1, 1].forEach(function(s){
    am(null, HX1 - HX0, 0.22, 0.06, (HX0 + HX1) / 2, HY1 - 0.11, s * HZ, 0.02);
    am(null, HX1 - HX0, 0.20, 0.06, (HX0 + HX1) / 2, HY0 + 0.10, s * HZ, 0.02);
    [HX0 + 0.04, -1.20, HX1 - 0.04].forEach(function(x){ am(null, 0.08, HY1 - HY0, 0.07, x, (HY0 + HY1) / 2, s * HZ, 0.02); });
    tmnChapaPerforada(G, AM, 0.86, HY1 - HY0 - 0.42, (HX0 + 0.08 - 1.24) / 2, (HY0 + HY1) / 2 - 0.01, s * (HZ + 0.005), 0);
    tmnChapaPerforada(G, AM, 0.86, HY1 - HY0 - 0.42, (-1.16 + HX1 - 0.08) / 2, (HY0 + HY1) / 2 - 0.01, s * (HZ + 0.005), 0);
    /* bisagras y manijas de las puertas */
    [-1.62, -0.70].forEach(function(x){ bloque(null, 0.12, 0.04, 0.04, 'cromo', null, x, HY0 + 0.32, s * (HZ + 0.04), 0.01); });
  });
  /* el motor: bloque, tapas de valvulas, turbo, posenfriador y multiple */
  bloque('ENG1', 1.45, 0.86, 0.80, 'metal', TMN_GRIS, -1.20, 1.78, 0, 0.06);
  bloque('ENG1', 1.30, 0.16, 0.50, 'metal', TMN_GRIS2, -1.20, 2.28, 0.08, 0.03);
  bloque('INY1', 1.20, 0.06, 0.20, 'metal', '#2E3238', -1.20, 2.38, 0.08, 0.02);
  bloque('AFT1', 0.90, 0.16, 0.36, 'metal', '#7B8188', -1.10, 2.48, -0.20, 0.03);
  D.pon('TLH2', new THREE.TorusGeometry(0.13, 0.07, 10, 18), 'metal', '#6B7178', -0.62, 2.10, -0.30, [0, Math.PI / 2, 0]);
  tubo(null, [-1.75, 2.02, -0.42], [-0.70, 2.02, -0.42], 0.06, 'metal', '#7A5F48', 10);
  cil('AL1', 0.10, 0.10, 0.20, 'metal', TMN_GRIS2, -1.85, 1.55, 0.42, [0, 0, Math.PI / 2], 16);
  cil('AR1', 0.09, 0.09, 0.30, 'metal', TMN_GRIS2, -0.75, 1.52, 0.44, [0, 0, Math.PI / 2], 14);
  bloque('EC', 0.24, 0.30, 0.06, 'mate', '#2A2D31', -0.95, 1.72, 0.43, 0.02);
  /* el modelo en la esquina alta del capot, sobre su placa negra */
  var texMod = texRotulo3d(rotuloTexto(v, '#17191C', '#FFFFFF', 0.92), 256, 96);
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
  cil(null, 0.06, 0.06, 0.32, 'metal', TMN_GRIS2, -1.48, HY1 + 0.26, -0.18, null, 14);
  cil(null, 0.19, 0.19, 0.30, 'mate', NG, -1.48, HY1 + 0.55, -0.18, null, 24);
  cil(null, 0.21, 0.12, 0.10, 'mate', NG, -1.48, HY1 + 0.75, -0.18, null, 24);
  D.pon(null, new THREE.SphereGeometry(0.12, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), 'mate', NG, -1.48, HY1 + 0.79, -0.18);

  /* ═══ caja del radiador al frente con su rejilla ═══ */
  am(null, 0.30, 1.85, 1.62, -2.24, 1.97, 0, 0.06);
  D.lamas('RAD1', -2.42, 1.20, 2.62, -0.62, 0.62, 11, NG, -1);
  bloque('RAD1', 0.30, 1.40, 1.20, 'metal', '#2E3238', -1.98, 1.95, 0, 0.03);
  D.pon('FAN1', new THREE.TorusGeometry(0.52, 0.06, 10, 32), 'metal', TMN_GRIS2, -1.80, 1.95, 0, [0, Math.PI / 2, 0]);
  bloque(null, 0.34, 0.12, 1.70, 'pintura', AM2, -2.24, 2.94, 0, 0.03);
  /* gancho de remolque y protector bajo el radiador */
  bloque(null, 0.40, 0.10, 1.40, 'mate', TMN_GRIS, -2.30, 0.98, 0, 0.02);
  D.pon(null, new THREE.TorusGeometry(0.10, 0.035, 8, 16), 'metal', '#4A4F55', -2.48, 1.10, 0, [0, Math.PI / 2, 0]);
  /* soportes de los cilindros de levante a los lados de la caja */
  [-1, 1].forEach(function(s){ am(null, 0.34, 0.34, 0.22, -2.30, 2.55, s * 0.90, 0.04); cil('PYB', 0.07, 0.07, 0.30, 'metal', '#4A4F55', -2.37, 2.55, s * 0.93, ROTZ, 12); });

  /* ═══ hoja 8SU ═══ */
  /* la hoja se arma en medidas pre: despues del estirado da su ancho y alto reales */
  var hW = P.hojaW / 2 / K[2], hH = P.hojaH / K[1];
  var X0 = -4.25, hoja = tmnHoja(D, { x0: X0, H: hH, lean: 0.50 * hH / 1.69, bulge: 0.22 * hH / 1.69, prof: 0.80, zc: hW * 0.685, ww: hW * 0.315, ang: 0.44, hex: AM, hex2: AM2 });
  var xh = function(y){ return hoja.xAtras(y); };
  [-1, 1].forEach(function(s){
    var z = s * 1.49;
    /* brazos de empuje por fuera de las orugas, con su ojo en la hoja */
    tmnViga(D, null, [xh(0.50) + 0.10, 0.50], [0.53, 0.70], z, 0.34, 0.22, 'pintura', AM, 0.05);
    am(null, 0.40, 0.46, 0.34, xh(0.50) + 0.02, 0.50, z, 0.05);
    cil('PYB', 0.10, 0.10, 0.40, 'metal', '#4A4F55', xh(0.50) + 0.02, 0.50, z, ROTZ, 14);
    /* cilindros de levante negros desde la caja del radiador hasta la hoja */
    var top = [-1.80, 3.32, s * 1.00], rod = [xh(1.30) + 0.12, 1.30, s * 1.00];
    am(null, 0.26, 0.30, 0.24, xh(1.30) + 0.06, 1.30, s * 1.00, 0.04);
    D.cilHidD(s > 0 ? 'PHY' : 'HRH', top, rod, 0.115, NG, 0.58);
    am(null, 0.22, 0.22, 0.30, -2.37, 2.55, s * 1.00, 0.04);
    /* cabezal con el faro delantero arriba del cilindro */
    bloque(null, 0.26, 0.20, 0.24, 'mate', NG, top[0] + 0.02, top[1] + 0.16, top[2], 0.03);
    tmnLuz(D, s > 0 ? 'FDI' : 'FDD', top[0] - 0.14, top[1] + 0.30, top[2], [-1, 0], 0.30, 0.20);
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
  var cab = tmnCabina(D, G, { x0: CX0, x1: CX1, z0: -CZ, z1: CZ, yp: CYB, yb: CYB, yt: CYT, et: 0.06, hexP: NG, hexT: NG, hexB: AM, fp: 0.30 });
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
  [-0.85, -0.35, 0.35, 0.85].forEach(function(z){ tmnLuz(D, 'LSM', -0.30, 3.46, z, [-1, 0], 0.22, 0.14); });
  [-1, 1].forEach(function(s){ tmnLuz(D, s > 0 ? 'FPI' : 'FPD', 1.58, 3.40, s * 0.95, [1, 0], 0.24, 0.16); });
  bloque('AAC', 0.70, 0.18, 0.90, 'mate', TMN_GRIS, 0.95, 3.62, 0, 0.04);
  var bal = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4, roughness: 0.3 }));
  bal.position.set(0.20, 3.53, -0.95); D.reg('CIR', bal, '#F0A41C');
  bloque('TAB', 0.10, 0.50, 0.70, 'mate', '#25282C', CX1 - 0.12, 2.82, 0, 0.02);

  /* ═══ tanque de combustible atras: faros, catadiopticos y numero ═══ */
  am('TQC1', 0.58, 0.95, 2.62, 1.84, 2.075, 0, 0.08);
  cil(null, 0.09, 0.09, 0.08, 'mate', NG, 1.80, 2.58, 0.80, null, 16);
  [-1, 1].forEach(function(s){
    tmnLuz(D, s > 0 ? 'FPI' : 'FPD', 2.17, 2.36, s * 1.05, [1, 0], 0.26, 0.18);
    cil(null, 0.05, 0.05, 0.02, 'vidrio', '#C2241B', 2.14, 2.38, s * 0.72, [0, 0, Math.PI / 2], 16);
  });
  var mN = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.30), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
  mN.position.set(2.136, 2.34, 0); mN.rotation.y = Math.PI / 2; G.add(mN);
  /* camara de retroceso */
  bloque('SENS', 0.10, 0.10, 0.12, 'mate', NG, 2.16, 2.62, 0.0, 0.02);

  /* ═══ ripper: un diente (D9T) o multiple de tres (D6T) ═══ */
  [-1, 1].forEach(function(s){
    [0.32, 0.60].forEach(function(zz){ am(null, 0.44, 1.10, 0.06, 2.08, 1.12, s * zz, 0.02); });
    cil('PYB', 0.07, 0.07, 0.40, 'metal', '#4A4F55', 2.18, 1.50, s * 0.46, ROTZ, 12);
    cil('PYB', 0.07, 0.07, 0.40, 'metal', '#4A4F55', 2.18, 0.82, s * 0.46, ROTZ, 12);
  });
  var multi = P.ripper === 'multi';
  var XB = 3.12;
  [-1, 1].forEach(function(s){
    var z = s * 0.46;
    /* brazo inferior del paralelogramo */
    tmnViga(D, null, [2.18, 0.82], [XB, 1.16], z, 0.24, 0.16, 'pintura', AM, 0.04);
    /* cilindros de inclinacion arriba y de levante en diagonal */
    D.cilHidD('PHY', [2.18, 1.50, z], [XB, 1.98, z], 0.085, AM, 0.55);
    D.cilHidD('PHY', [2.20, 1.02, s * 0.70], [XB - 0.05, 1.70, s * 0.70], 0.095, AM, 0.55);
    tubo('LPH', [2.10, 1.60, s * 0.38], [2.40, 1.80, s * 0.30], 0.022, 'goma', '#22262B', 8);
  });
  if(!multi){
    /* bastidor del diente con su bolsillo */
    am(null, 0.34, 1.10, 1.10, XB + 0.04, 1.57, 0, 0.05);
    am(null, 0.40, 0.40, 0.20, XB + 0.20, 1.80, 0, 0.04);
    tmnDiente(D, [[3.30, 2.95], [3.62, 2.95], [3.62, 0.95], [3.55, 0.64], [3.38, 0.42], [3.14, 0.24], [3.02, 0.22], [3.08, 0.34],
                  [3.24, 0.58], [3.30, 0.88]], [[2.88, 0.18], [3.06, 0.20], [3.16, 0.30], [3.02, 0.36], [2.90, 0.26]], 0, AM);
    cil('PYB', 0.05, 0.05, 0.24, 'metal', '#4A4F55', 3.46, 2.10, 0, ROTZ, 12);
  } else {
    am(null, 0.34, 0.50, 2.30, XB + 0.04, 1.50, 0, 0.05);
    [-0.85, 0, 0.85].forEach(function(z){
      tmnDiente(D, [[3.08, 1.95], [3.40, 1.95], [3.40, 0.95], [3.33, 0.66], [3.16, 0.44], [2.92, 0.26], [2.80, 0.24], [2.86, 0.36],
                    [3.02, 0.60], [3.08, 0.90]], [[2.66, 0.20], [2.84, 0.22], [2.94, 0.32], [2.80, 0.38], [2.68, 0.28]], z, AM);
      am(null, 0.42, 0.30, 0.22, 3.24, 1.50, z, 0.03);
    });
  }

  /* el cuerpo a las cotas del modelo */
  tmnEstirar(G, 0, K);

  /* ═══ orugas con sus medidas reales (no se estiran) ═══ */
  var cs = [P.FI, P.RI, P.SP];
  var nT = Math.round(tmnCamino(cs.map(function(c){ return { x: c.x, y: c.y, r: c.r }; })).L / P.paso);
  [-1, 1].forEach(function(s){
    var izq = s > 0, cO = izq ? 'CLH' : 'CRH';
    tmnOruga(D, { code: cO, z: s * P.ZT, cs: cs, n: nT, ancho: P.ancho, gr: P.gr, hE: P.hE, zRiel: P.zRiel,
      rodillos: rodsR, rRod: P.rRod, yFondo: P.yFondo, hex: AM, hex2: AM2,
      guias: [{ i: 0, code: izq ? 'RGL' : cO }, { i: 1, code: cO }],
      catarina: { i: 2, code: izq ? cO : 'SPR', codeMando: izq ? 'DLH' : 'DRH' } });
  });

  /* centrar en X (de la hoja a la punta del ripper) */
  var cx = (X0 + (multi ? 3.40 : 3.62)) / 2 * K[0];
  G.children.forEach(function(m){ m.position.x -= cx; });
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = 1.75 * K[1];
  G.userData.dist = 18 * K[0];
  return G;
}

/* ═══ Komatsu D65EX-18: el cuerpo del D155AX-6 estirado a sus cotas ═══ */

/* el rotulo del modelo: franjas azules arriba y el numero en negro */
function tmnRotuloKom(txt){
  return function(g, w, h){
    /* sin fondo: va sobre la chapa amarilla */
    g.fillStyle = TMN_KOMAZ;
    for(var i = 0; i < 4; i++) g.fillRect(w * 0.04, h * (0.06 + i * 0.09), w * 0.92, h * 0.05);
    g.fillStyle = '#16181C'; g.fillRect(w * 0.04, h * 0.46, w * 0.92, h * 0.50);
    g.fillStyle = '#FFFFFF'; g.textBaseline = 'middle'; g.textAlign = 'left';
    g.font = 'bold ' + Math.round(h * 0.20) + 'px "Arial Black", Arial, sans-serif';
    g.fillText('D', w * 0.08, h * 0.60);
    g.font = 'bold ' + Math.round(h * 0.36) + 'px "Arial Black", Arial, sans-serif';
    g.save(); g.translate(w * 0.22, h * 0.73); g.scale(0.82, 1); g.fillText(txt, 0, 0); g.restore();
  };
}

var TMN_DOZ_KOM = {
  D65EX: { modelo: '65EX', k: [0.87, 0.94, 0.89], ZT: 1.90 / 2,
           FI: { x: -1.37, y: 0.56, r: 0.47 }, SP: { x: 1.42, y: 0.56, r: 0.47 },
           paso: 0.203, ancho: 0.56, gr: 0.065, hE: 0.15, zRiel: 0.16, rRod: 0.115, rPor: 0.09, yFondo: 0.085,
           hojaW: 3.415, hojaH: 1.425, ripper: 'multi' }
};
/* KOMATSU en letras azules sobre el amarillo, como en el D65 de las fotos */
function tmnKomAzul(g, w, h){
  g.fillStyle = '#1C3C8C'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'italic bold ' + Math.round(h * 0.78) + 'px "Arial Black", Arial, sans-serif';
  g.save(); g.translate(w / 2, h * 0.54); g.scale(1.08, 1); g.fillText('KOMATSU', 0, 0); g.restore();
}

function tmnConstruirKomatsu(P, piezas){
  var G = new THREE.Group(), D = kitDetalle(G, piezas);
  var bloque = D.bloque, tubo = D.tubo, cil = D.cilindro, AM = TMN_KOM, AM2 = TMN_KOM2, NG = TMN_NEGRO;
  var am = function(code, w, h, dd, x, y, z, r, rot){ return bloque(code, w, h, dd, 'pintura', AM, x, y, z, r, rot); };
  var ROTZ = [Math.PI / 2, 0, 0];
  var K = P.k;

  /* ═══ orugas ovaladas: guia adelante, catarina atras, 7 rodillos y 2 portantes ═══
     el cuerpo va en medidas del D155AX (pre) y se estira; las orugas despues, reales */
  var FI = { x: P.FI.x / K[0], y: P.FI.y / K[1], r: P.FI.r / K[1] }, ZT = P.ZT / K[2];
  var rodsR = [-1.08, -0.72, -0.36, -0.02, 0.38, 0.74, 1.12].map(function(x){ return x * 0.87; });
  var rods = rodsR.map(function(x){ return x / K[0]; });
  [-1, 1].forEach(function(s){
    var zc = s * ZT;
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
    bloque(null, 0.50, 0.10, 0.60, 'mate', TMN_GRIS, FI.x + 0.30, 0.30, zc, 0.02);
    /* munon del brazo de empuje */
    tubo('PYB', [0.37, 0.76, zc + s * 0.18], [0.37, 0.76, s * 1.44], 0.10, 'metal', '#4A4F55', 18);
    cil(null, 0.15, 0.15, 0.14, 'pintura', AM, 0.37, 0.76, s * 1.42, ROTZ, 22);
  });

  /* ═══ casco y barra igualadora ═══ */
  am(null, 4.60, 0.90, 1.24, -0.20, 0.95, 0, 0.06);
  bloque(null, 3.80, 0.04, 1.18, 'mate', TMN_GRIS, -0.60, 0.52, 0, 0.01);
  bloque(null, 0.24, 0.18, 2.40, 'pintura', AM2, -0.90, 0.92, 0, 0.04);
  bloque('TRM', 1.00, 0.50, 1.20, 'metal', TMN_GRIS, 1.00, 1.15, 0, 0.05);

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
    /* el D65EX-18 lleva las puertas del motor lisas (fotos), con su junta y manija */
    am('ENG1', HX1 - HX0 - 0.10, 0.56, 0.04, (HX0 + HX1) / 2, 1.74, s * (HZ + 0.01), 0.015);
    bloque(null, 0.012, 0.50, 0.012, 'mate', '#2A2416', -1.36, 1.74, s * (HZ + 0.032), 0.003);
    bloque(null, 0.03, 0.12, 0.03, 'cromo', null, -1.45, 1.60, s * (HZ + 0.04), 0.008);
    /* tres rejillas de lamas de la tapa alta (alas de gaviota) */
    [-1.95, -1.42, -0.89].forEach(function(x){ tmnLamasZ(D, null, x - 0.20, x + 0.20, 2.02, 2.30, s * (HZ + 0.03), 4, '#2A2D31', s); });
  });
  am(null, HX1 - HX0 + 0.04, 0.08, HZ * 2 + 0.06, (HX0 + HX1) / 2, 2.40, 0, 0.03);
  bloque(null, 1.60, 0.10, HZ * 2 - 0.10, 'pintura', AM2, -1.05, 2.47, 0, 0.03);
  var texKom = texRotulo3d(rotuloTexto('KOMATSU', TMN_NEGRO, '#FFFFFF', 0.95), 512, 96);
  /* el KOMATSU grande en azul sobre las puertas del capot (D65EX-18) */
  var texKomA = texRotulo3d(tmnKomAzul, 512, 96);
  [-1, 1].forEach(function(s){ tmnLetreroT(G, texKomA, 1.30, 0.25, -1.40, 1.80, s * (HZ + 0.034), s > 0 ? 0 : Math.PI); });
  /* motor SAA6D140E: bloque, culata, turbo y posenfriador */
  bloque('ENG1', 1.50, 0.70, 0.86, 'metal', TMN_GRIS, -1.35, 1.80, 0, 0.06);
  bloque('ENG1', 1.36, 0.16, 0.50, 'metal', TMN_GRIS2, -1.35, 2.22, 0.06, 0.03);
  bloque('AFT1', 0.80, 0.14, 0.34, 'metal', '#7B8188', -1.30, 2.30, -0.22, 0.03);
  D.pon('TLH2', new THREE.TorusGeometry(0.13, 0.07, 10, 18), 'metal', '#6B7178', -0.75, 2.05, -0.36, [0, Math.PI / 2, 0]);
  cil('AL1', 0.10, 0.10, 0.20, 'metal', TMN_GRIS2, -2.02, 1.62, 0.46, [0, 0, Math.PI / 2], 16);
  cil('AR1', 0.09, 0.09, 0.30, 'metal', TMN_GRIS2, -0.82, 1.60, 0.48, [0, 0, Math.PI / 2], 14);
  /* escape con su codo y prefiltro */
  cil(null, 0.12, 0.12, 0.08, 'mate', NG, -1.31, 2.53, 0.25, null, 16);
  tubo(null, [-1.31, 2.53, 0.25], [-1.31, 3.24, 0.25], 0.085, 'mate', '#1E2023', 16);
  tubo(null, [-1.31, 3.22, 0.25], [-1.18, 3.36, 0.25], 0.085, 'mate', '#1E2023', 16);
  cil(null, 0.06, 0.06, 0.12, 'metal', TMN_GRIS2, -0.86, 2.56, -0.22, null, 14);
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
  D.pon('FAN1', new THREE.TorusGeometry(0.50, 0.06, 10, 32), 'metal', TMN_GRIS2, -2.02, 1.90, 0, [0, Math.PI / 2, 0]);
  am(null, 0.40, 0.10, 1.74, -2.46, 2.70, 0, 0.03);
  [-1, 1].forEach(function(s){
    D.faro(s > 0 ? 'FDI' : 'FDD', -2.64, 2.56, s * 0.72, 0.09);
    am(null, 0.36, 0.30, 0.20, -2.30, 2.58, s * 0.88, 0.04);
  });
  bloque(null, 0.40, 0.12, 1.30, 'mate', TMN_GRIS, -2.55, 0.92, 0, 0.02);
  D.pon(null, new THREE.TorusGeometry(0.10, 0.035, 8, 16), 'metal', '#4A4F55', -2.72, 1.05, 0, [0, Math.PI / 2, 0]);

  /* ═══ hoja semi-U con inclinacion ═══ */
  /* Sigmadozer: centro mas ancho y alas cortas muy sesgadas; medidas pre para que estirada de 3.415 x 1.425 */
  var hW = P.hojaW / 2 / K[2], hH = P.hojaH / K[1];
  var X0 = -3.85, hoja = tmnHoja(D, { x0: X0, H: hH, lean: 0.55 * hH / 1.79, bulge: 0.28 * hH / 1.79, prof: 0.78, zc: hW * 0.74, ww: hW * 0.26, ang: 0.55, hex: AM, hex2: AM2 });
  var xh = function(y){ return hoja.xAtras(y); };
  [-1, 1].forEach(function(s){
    var z = s * 1.50;
    tmnViga(D, null, [xh(0.42) + 0.10, 0.42], [0.37, 0.76], z, 0.36, 0.22, 'pintura', AM, 0.05);
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
  var cab = tmnCabina(D, G, { x0: CX0, x1: CX1, z0: -CZ, z1: CZ, yp: 1.70, yb: 2.44, yt: 3.27, et: 0.125, hexP: NG, hexT: AM, hexB: AM,
    fp: 0.48, vBajo: { x: 0.55, y: 1.86 } });
  var texMod = texRotulo3d(tmnRotuloKom(P.modelo), 256, 192);
  [-1, 1].forEach(function(s){
    tmnLetreroT(G, texMod, 0.62, 0.46, 1.10, 2.08, s * (CZ + 0.012), s > 0 ? 0 : Math.PI);
    D.letrero(texKom, 0.54, 0.09, 0.48, 2.32, s * (CZ + 0.012), s > 0 ? 0 : Math.PI);
    tubo(null, [CX0 - 0.10, 1.80, s * (CZ + 0.10)], [CX0 - 0.10, 3.05, s * (CZ + 0.10)], 0.022, 'pintura', AM, 8);
    /* espejos */
    tubo(null, [CX0 + 0.05, 3.05, s * (CZ + 0.02)], [CX0 - 0.10, 3.14, s * (CZ + 0.26)], 0.018, 'mate', NG, 8);
    bloque(null, 0.05, 0.28, 0.18, 'mate', NG, CX0 - 0.12, 3.12, s * (CZ + 0.30), 0.02);
  });
  [-0.65, 0.65].forEach(function(z){ tmnLuz(D, 'LSM', CX0 - 0.02, 3.30, z, [-1, 0], 0.20, 0.13); });
  [-0.55, 0.55].forEach(function(z){ tmnLuz(D, z > 0 ? 'FPI' : 'FPD', CX1 + 0.06, 3.30, z, [1, 0], 0.20, 0.13); });
  bloque('AAC', 0.80, 0.14, 1.00, 'mate', TMN_GRIS, 0.75, 3.46, 0, 0.04);
  var bal = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4, roughness: 0.3 }));
  bal.position.set(1.20, 3.40, 0.62); D.reg('CIR', bal, '#F0A41C');
  /* antena */
  tubo(null, [1.30, 3.40, -0.70], [1.30, 3.80, -0.70], 0.008, 'mate', NG, 6);

  /* ═══ tanque hidraulico y valvulas a la derecha, baterias y matafuego a la izquierda ═══ */
  /* van adelante, junto al frente de la cabina, para no tapar el rotulo del modelo */
  am('TQH1', 0.80, 0.56, 0.42, 0.30, 1.98, -1.14, 0.06);
  cil(null, 0.06, 0.06, 0.03, 'vidrio', '#9BB7C9', 0.10, 1.95, -1.355, ROTZ, 16);
  bloque('VV1', 0.34, 0.30, 0.34, 'metal', TMN_GRIS2, -0.22, 1.86, -1.12, 0.03);
  bloque('40000054', 0.14, 0.30, 0.14, 'mate', '#C9CDD2', -0.22, 2.16, -1.12, 0.02);
  bloque('BAT', 0.60, 0.36, 0.42, 'mate', NG, -0.05, 1.88, 1.14, 0.04);
  cil('SCI', 0.09, 0.09, 0.42, 'pintura', '#C0201A', 0.45, 1.92, 1.14, null, 16);
  /* peldanos y asidero de acceso por la izquierda */
  bloque(null, 0.34, 0.04, 0.24, 'metal', '#4A4F55', 1.30, 1.10, 1.42, 0.01);
  tubo(null, [1.62, 1.75, 1.36], [1.62, 2.40, 1.36], 0.022, 'pintura', NG, 8);

  /* ═══ tanque de combustible atras, con el respaldo inclinado ═══ */
  D.perfil('TQC1', [[1.45, 1.70], [2.15, 1.70], [2.15, 1.86], [1.55, 2.44], [1.45, 2.44]], 2.30, 0, 'pintura', AM, 0.05);
  cil(null, 0.09, 0.09, 0.08, 'mate', NG, 1.78, 2.20, 0.75, [0, 0, 0.75], 16);
  [-1, 1].forEach(function(s){ tmnLuz(D, s > 0 ? 'FPI' : 'FPD', 2.18, 1.78, s * 0.98, [1, 0], 0.22, 0.14); });
  var texNum = texNumero3d(null, '#17191C');
  var mN = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.20), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
  /* en el respaldo inclinado: primero mira a +X, despues se inclina hacia arriba */
  var angR = Math.atan2(0.60, 0.58);
  mN.rotation.order = 'ZYX'; mN.rotation.set(0, Math.PI / 2, angR);
  mN.position.set(1.85 + Math.cos(angR) * 0.04, 2.15 + Math.sin(angR) * 0.04, 0); G.add(mN);

  /* ═══ ripper multiple de tres dientes ═══ */
  var multi = P.ripper === 'multi';
  [-1, 1].forEach(function(s){
    [0.34, 0.62].forEach(function(zz){ am(null, 0.46, 1.20, 0.06, 2.30, 1.22, s * zz, 0.02); });
    cil('PYB', 0.07, 0.07, 0.40, 'metal', '#4A4F55', 2.30, 0.90, s * 0.48, ROTZ, 12);
    /* brazos del paralelogramo */
    tmnViga(D, null, [2.30, 0.90], [3.90, 1.05], s * 0.48, 0.24, 0.18, 'pintura', AM, 0.04);
  });
  /* los dos cilindros al centro: levante arriba, inclinacion abajo */
  D.cilHidD('PHY', [2.38, 1.72, 0.20], [3.72, 1.94, 0.20], 0.10, AM, 0.55);
  D.cilHidD('PHY', [2.47, 1.40, -0.20], [3.68, 1.30, -0.20], 0.11, AM, 0.55);
  [0.20, -0.20].forEach(function(z){ am(null, 0.30, 0.30, 0.18, 2.34, z > 0 ? 1.72 : 1.40, z, 0.04); });
  if(!multi){
    /* porta-diente con el ojo grande del pivote */
    am(null, 0.42, 1.10, 1.10, 3.95, 1.60, 0, 0.05);
    cil('PYB', 0.18, 0.18, 1.14, 'pintura', AM2, 4.11, 1.12, 0, ROTZ, 24);
    tmnDiente(D, [[3.98, 2.25], [4.34, 2.25], [4.34, 0.95], [4.25, 0.66], [4.05, 0.38], [3.80, 0.16], [3.66, 0.14], [3.74, 0.26],
                  [3.94, 0.52], [3.98, 0.88]], [[3.52, 0.08], [3.72, 0.12], [3.82, 0.22], [3.66, 0.28], [3.54, 0.18]], 0, AM);
  } else {
    am(null, 0.40, 0.50, 2.32, 3.95, 1.45, 0, 0.05);
    [-0.90, 0, 0.90].forEach(function(z){
      tmnDiente(D, [[3.92, 1.95], [4.24, 1.95], [4.24, 0.95], [4.17, 0.66], [3.98, 0.42], [3.74, 0.24], [3.62, 0.22], [3.68, 0.34],
                    [3.86, 0.60], [3.92, 0.90]], [[3.48, 0.18], [3.66, 0.20], [3.76, 0.30], [3.62, 0.36], [3.50, 0.26]], z, AM);
    });
  }

  /* el cuerpo a las cotas del D65EX */
  tmnEstirar(G, 0, K);

  /* ═══ orugas con sus medidas reales ═══ */
  var cs = [P.FI, P.SP], nT = Math.round(tmnCamino(cs).L / P.paso);
  [-1, 1].forEach(function(s){
    var izq = s > 0, cO = izq ? 'CLH' : 'CRH';
    tmnOruga(D, { code: cO, z: s * P.ZT, cs: cs, n: nT, ancho: P.ancho, gr: P.gr, hE: P.hE, zRiel: P.zRiel,
      rodillos: rodsR, rRod: P.rRod, yFondo: P.yFondo, portantes: [-0.36 * 0.87, 0.51 * 0.87], rPor: P.rPor, yPort: P.FI.y + P.FI.r,
      hex: AM, hex2: AM2, guias: [{ i: 0, code: izq ? 'RGL' : cO }],
      catarina: { i: 1, code: izq ? cO : 'SPR', codeMando: izq ? 'DLH' : 'DRH' } });
  });

  var cx = (X0 + (multi ? 4.24 : 4.34)) / 2 * K[0];
  G.children.forEach(function(m){ m.position.x -= cx; });
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = 1.70 * K[1];
  G.userData.dist = 18.5 * K[0];
  return G;
}

/* letrero sin fondo: solo la tinta sobre la pintura (el fondo pintado en
   la textura no queda del mismo tono que la chapa con la luz del estudio) */
function tmnLetreroT(G, tex, w, h, x, y, z, ry){
  var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, transparent: true,
    roughness: 0.5, metalness: 0.05, polygonOffset: true, polygonOffsetFactor: -2 }));
  m.position.set(x, y, z); m.rotation.y = ry;
  G.add(m);
  return m;
}
function tmnTextoT(txt, tinta, ancho){
  return function(g, w, h){
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.66) + 'px "Arial Narrow", Arial, sans-serif';
    g.save(); g.translate(w / 2, h * 0.53); g.scale(ancho || 1, 1); g.fillText(txt, 0, 0); g.restore();
  };
}

/* ═══ CAT CS-533E: rodillo liso de un bandaje (sale del rodillo de modelo_tractores.js) ═══
   amarillo CAT entero; el bandaje de acero sin pintar, el CAT negro en los
   costados del bastidor, al frente y en el capot, y CS-533E atras */
var TMN_RODILLO = {
  CS533E: { L: 5.51, W: 2.29, H: 3.07, wb: 2.90, dR: 0.767, dW: 2.134, tR: 0.79, tW: 0.59, modelo: 'CS-533E' }
};
function tmnConstruirRodillo(k, piezas){
  var P = TMN_RODILLO[k];
  var G = new THREE.Group(), D = kitDetalle(G, piezas);
  var bloque = D.bloque, tubo = D.tubo, cil = D.cilindro, perfil = D.perfil, NG = TMN_NEGRO;
  var C1 = TMN_CAT, C2 = TMN_CAT2, GR = '#26292D';
  var c1 = function(code, w, h, dd, x, y, z, r, rot){ return bloque(code, w, h, dd, 'pintura', C1, x, y, z, r, rot); };
  var ROTZ = [Math.PI / 2, 0, 0];
  var dR = P.dR, xF = -P.L / 2, xd = xF + dR + 0.30, xr = xd + P.wb, xE = P.L / 2, xa = xd + dR + 0.52;
  var yT = 2 * dR + 0.04, zP = P.dW / 2 + 0.09, zt = P.dW / 2 - P.tW / 2 + 0.02;

  /* ═══ bandaje liso: virola, aros de los bordes y la cara lateral ═══ */
  var tam = cil(null, dR, dR, P.dW, 'metal', TMN_TAMBOR, xd, dR, 0, ROTZ, 64);
  tam.material.roughness = 0.30;
  [-1, 1].forEach(function(s){
    D.pon(null, new THREE.TorusGeometry(dR - 0.012, 0.022, 8, 64), 'metal', '#7E858C', xd, dR, s * (P.dW / 2 - 0.01));
    cil(null, dR * 0.94, dR * 0.94, 0.02, 'mate', '#4A4F55', xd, dR, s * (P.dW / 2 - 0.03), ROTZ, 48);
  });

  /* ═══ bastidor del bandaje: placas laterales, travesano delantero y trasero ═══ */
  var lat = [[xF, yT], [xd + dR + 0.22, yT], [xd + dR + 0.26, dR * 0.95], [xd + dR * 0.55, dR * 0.52], [xd - dR * 0.55, dR * 0.52], [xF + 0.06, dR * 0.98]];
  var texMarca = texRotulo3d(rotuloCAT, 256, 112);
  [-1, 1].forEach(function(s){
    var z = s * zP;
    perfil(null, lat, 0.07, z, 'pintura', C1, 0.025);
    /* el CAT en su placa negra arriba de la placa lateral */
    D.letrero(texMarca, 0.70, 0.31, xd - 0.30, yT - 0.30, z + s * 0.04, s > 0 ? 0 : Math.PI);
    /* soporte del eje del bandaje: placa redonda, tacos de goma y el motor */
    cil(null, 0.42, 0.42, 0.06, 'pintura', GR, xd, dR, z + s * 0.05, ROTZ, 36);
    for(var b = 0; b < 6; b++){
      var a = b / 6 * Math.PI * 2 + 0.3;
      cil(null, 0.075, 0.075, 0.10, 'goma', '#16181A', xd + Math.cos(a) * 0.30, dR + Math.sin(a) * 0.30, z - s * 0.06, ROTZ, 14);
      cil(null, 0.025, 0.025, 0.03, 'metal', '#8A8F95', xd + Math.cos(a) * 0.30, dR + Math.sin(a) * 0.30, z + s * 0.09, ROTZ, 6);
    }
    /* vibracion a la izquierda, traslacion a la derecha */
    cil(s > 0 ? 'PYM' : 'TML', 0.17, 0.20, 0.26, 'metal', TMN_GRIS2, xd, dR, z + s * 0.20, ROTZ, 24);
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
  /* el CAT de la proa, inclinado con la cara del travesano */
  var pf = D.letrero(texMarca, 0.66, 0.29, xF - 0.03, yT - 0.38, 0, -Math.PI / 2);
  pf.rotation.order = 'YXZ'; pf.rotation.x = -0.18;
  /* raspadores adelante y atras (desgaste) */
  [[-1, 0.42], [1, 0.42]].forEach(function(q){
    var ang = q[0] < 0 ? Math.PI + q[1] : -q[1];
    var xs = xd + Math.cos(ang) * (dR + 0.05), ys = dR + Math.sin(ang) * (dR + 0.05);
    bloque('GET', 0.04, 0.22, P.dW - 0.10, 'metal', TMN_GET, xs, ys, 0, 0.01, [0, 0, ang + Math.PI / 2 + (q[0] < 0 ? 0.5 : -0.5)]);
    [-1, 1].forEach(function(s){ tmnViga(D, null, [xs, ys], [q[0] < 0 ? xF + 0.12 : xd + dR + 0.18, yT - 0.75], s * (P.dW / 2 - 0.15), 0.08, 0.06, 'pintura', GR, 0.01); });
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
  var LL = { r: P.tR, ancho: P.tW, rAro: P.tR * 0.42, aro: C1, aro2: C2, pernos: 12, paso: 0.30 };
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
  var cab = tmnCabina(D, G, { x0: cX0, x1: cX1, z0: -CZ, z1: CZ, yp: yP, yb: yP + 0.30, yt: P.H - 0.16, et: 0.16,
    hexP: NG, hexT: C1, hexB: C1, fp: 0.55, mando: 'volante' });
  [-1, 1].forEach(function(s){
    tubo(null, [cX0 + 0.04, P.H - 0.45, s * CZ], [cX0 - 0.10, P.H - 0.38, s * (CZ + 0.28)], 0.016, 'mate', NG, 8);
    bloque(null, 0.05, 0.28, 0.17, 'mate', NG, cX0 - 0.12, P.H - 0.42, s * (CZ + 0.32), 0.02);
    bloque(null, 0.01, 0.24, 0.14, 'cromo', null, cX0 - 0.15, P.H - 0.42, s * (CZ + 0.32), 0.004);
    tmnLuz(D, 'LSM', cX0 - 0.06, P.H - 0.06, s * (CZ - 0.12), [-1, 0], 0.18, 0.12);
    tmnLuz(D, s > 0 ? 'FPI' : 'FPD', cX1 + 0.06, P.H - 0.06, s * (CZ - 0.12), [1, 0], 0.18, 0.12);
  });
  bloque('AAC', 0.60, 0.12, 0.80, 'mate', TMN_GRIS, cX1 - 0.40, P.H + 0.05, 0, 0.03);
  /* visera sobre el parabrisas */
  bloque(null, 0.26, 0.03, CZ * 2 - 0.10, 'mate', '#202326', cX0 - 0.10, P.H - 0.24, 0, 0.01, [0, 0, -0.25]);
  /* barandas de la plataforma a los lados de la cabina (a la izquierda deja libre la escalera) */
  var zB = P.W / 2 - 0.14;
  D.baranda([[cX0 + 0.55, zB], [cX1 + 0.12, zB]], yP, 0.95, C1);
  D.baranda([[cX0 - 0.15, -zB], [cX1 + 0.12, -zB]], yP, 0.95, C1);
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
    tmnLamasZ(D, null, xH1 + 0.25, xE - 0.45, hR - 0.30, hR - 0.08, s * (zA + 0.01), 4, '#22252A', s);
    /* juntas de las tapas de servicio, cerraduras y bisagras */
    [xH1 + 0.10].forEach(function(x){ bloque(null, 0.02, hR - 1.20, 0.012, 'mate', '#1A1C1F', x, (hR + 1.10) / 2 - 0.05, s * (zA + 0.012), 0.004); });
    bloque(null, 0.12, 0.05, 0.04, 'cromo', null, xE - 0.45, 1.70, s * (zA + 0.025), 0.01);
    [1.25, 1.75].forEach(function(y){ bloque(null, 0.05, 0.10, 0.04, 'mate', '#202326', xH1 + 0.16, y, s * (zA + 0.02), 0.01); });
    D.letrero(texMarca, 0.46, 0.20, xH1 + 0.38, 1.50, s * (zA + 0.012), s > 0 ? 0 : Math.PI);
  });
  /* el motor se ve por debajo del capot angosto */
  bloque('ENG1', xH1 - xH0 + 0.80, 0.70, 0.70, 'metal', TMN_GRIS, (xH0 + xH1) / 2 + 0.40, 1.15, 0, 0.05);
  bloque('PYM', 0.30, 0.30, 0.36, 'metal', TMN_GRIS2, xH0 - 0.10, 1.05, 0, 0.03);
  /* rejilla del radiador atras, faros, parachoques y baterias */
  D.lamas('RAD1', xE + 0.035, 0.98, hR - 0.30, -zA + 0.25, zA - 0.25, 9, '#22252A', 1);
  [-1, 1].forEach(function(s){
    tmnLuz(D, s > 0 ? 'FPI' : 'FPD', xE + 0.02, hR - 0.30, s * (zA - 0.10), [1, 0], 0.16, 0.22);
  });
  bloque(null, 0.24, 0.30, zA * 2 + 0.10, 'pintura', GR, xE - 0.02, 0.62, 0, 0.06);
  bloque('BAT', 0.40, 0.26, 0.50, 'mate', NG, xE - 0.45, 0.60, 0.45, 0.03);
  /* escape y toma de aire en el techo del capot */
  tubo(null, [xE - 0.80, techo(xE - 0.80), -0.45], [xE - 0.80, techo(xE - 0.80) + 0.30, -0.45], 0.06, 'mate', '#1E2023', 14);
  cil(null, 0.10, 0.10, 0.18, 'mate', NG, xH1 + 0.20, techo(xH1 + 0.20) + 0.08, 0.40, null, 18);
  /* numero de unidad en la cola del capot */
  var texNum = texNumero3d(null, '#1B1D20');
  [-1, 1].forEach(function(s){
    var mN = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.20), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
    mN.position.set(xE - 0.55, 1.12, s * (zA + 0.025)); mN.rotation.y = s > 0 ? 0 : Math.PI; G.add(mN);
  });
  /* el modelo en la placa lateral trasera */
  var texMod = texRotulo3d(tmnTextoT(P.modelo, '#1B1D20', 0.9), 384, 80);
  [-1, 1].forEach(function(s){ tmnLetreroT(G, texMod, 0.70, 0.15, xd + dR - 0.10, yT - 0.60, s * (zP + 0.04), s > 0 ? 0 : Math.PI); });

  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = 1.50;
  G.userData.dist = 15;
  return G;
}

/* ═══ motoniveladoras CAT 140H y Komatsu GD555-5, GD675-5 ═══
   El constructor sale del de modelo_motoniveladoras.js (12M, 140K, 620G);
   aqui va con la serie K de CAT para el 140H (cabina amarilla con visera
   CATERPILLAR, capo cuadrado) y un estilo Komatsu GD-5 (fotos del GD655-5:
   cabina de postes y techo negros, contrapeso negro adelante, KOMATSU en
   negro en el bastidor delantero, placa GD con franjas azules en el capo).
   u = distancia hacia atras desde el eje delantero. Lo que no esta acotado
   (cabina, capo, cuello) sale del 140K y del 12M corridos a la batalla. */
var TMN_MNEGRO = '#18191C', TMN_MGRIS = '#3A3F45', TMN_MGRIS2 = '#5B6269', TMN_MACERO = '#4A4F55';

var TMN_MOT = {
  '140H': { marca: 'CAT', serie: 'K', modelo: '140H', R: 0.645, A: 0.37, tread: 2.09, wb: 6.17, tand: 1.52, hoja: 2.56,
            uRear: 8.065, uPP: -0.85, uRip: 9.36, hCab: 3.12, hEx: 3.00, hCil: 3.00,
            cab: { u0: 3.68, u0b: 3.74, u1: 5.49, u1b: 5.29, y: 1.40, w: 1.50 },
            capo: { u0: 5.53, yT0: 2.36, yT1: 2.36, yB: 1.16, w: 1.30 },
            yN: 1.95, yF: 2.11, frH: 0.30, frW: 0.305, uBaja: 2.85, uSad: 2.39, uHitch: 4.55, uEx: 5.86, uPre: 6.31,
            mL: 3.66, mH: 0.61, dC: 1.53, rAro: 0.32, escarif: false },
  'GD555': { marca: 'KOM', serie: 'G', modelo: 'GD555', R: 0.645, A: 0.37, tread: 2.06, wb: 6.27, tand: 1.52, hoja: 2.62,
            uRear: 8.17, uPP: -0.95, uRip: 9.42, hCab: 3.20, hEx: 3.10, hCil: 3.00,
            cab: { u0: 3.60, u0b: 3.75, u1: 5.45, u1b: 5.40, y: 1.38, w: 1.60 },
            capo: { u0: 5.50, yT0: 2.40, yT1: 2.30, yB: 1.10, w: 1.32 },
            yN: 1.95, yF: 2.20, frH: 0.36, frW: 0.32, uBaja: 3.30, uSad: 2.30, uHitch: 4.55, uEx: 6.40, uPre: 5.85,
            mL: 3.71, mH: 0.645, dC: 1.53, rAro: 0.32, escarif: false },
  /* llantas 17.5R25 (1.35 m): la trocha sale del ancho 2.63 menos una llanta */
  'GD675': { marca: 'KOM', serie: 'G', modelo: 'GD675', R: 0.675, A: 0.445, tread: 2.19, wb: 6.48, tand: 1.53, hoja: 2.70,
            uRear: 8.38, uPP: -0.95, uRip: 9.63, hCab: 3.20, hEx: 3.12, hCil: 3.02,
            cab: { u0: 3.75, u0b: 3.90, u1: 5.62, u1b: 5.57, y: 1.42, w: 1.62 },
            capo: { u0: 5.67, yT0: 2.45, yT1: 2.35, yB: 1.14, w: 1.36 },
            yN: 2.00, yF: 2.25, frH: 0.38, frW: 0.33, uBaja: 3.40, uSad: 2.40, uHitch: 4.70, uEx: 6.60, uPre: 6.05,
            mL: 4.33, mH: 0.645, dC: 1.60, rAro: 0.34, escarif: false }
};

/* placa del modelo Komatsu GD: franjas azules y el numero en blanco sobre negro */
function tmnRotuloGD(txt){
  return function(g, w, h){
    g.fillStyle = '#16181C'; g.fillRect(0, 0, w, h);
    g.fillStyle = TMN_KOMAZ;
    for(var i = 0; i < 4; i++) g.fillRect(w * 0.06, h * (0.08 + i * 0.09), w * 0.88, h * 0.05);
    g.fillStyle = '#FFFFFF'; g.textBaseline = 'middle'; g.textAlign = 'left';
    g.font = 'bold ' + Math.round(h * 0.20) + 'px "Arial Black", Arial, sans-serif';
    g.fillText('GD', w * 0.08, h * 0.58);
    g.font = 'bold ' + Math.round(h * 0.36) + 'px "Arial Black", Arial, sans-serif';
    g.save(); g.translate(w * 0.06, h * 0.80); g.scale(0.92, 1); g.fillText(txt.replace(/^GD/, ''), 0, 0); g.restore();
  };
}
/* KOMATSU en negro sin fondo, para la chapa amarilla del bastidor */
function tmnKomNegro(g, w, h){
  g.fillStyle = '#16181B'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'italic bold ' + Math.round(h * 0.78) + 'px "Arial Black", Arial, sans-serif';
  g.save(); g.translate(w / 2, h * 0.54); g.scale(1.05, 1); g.fillText('KOMATSU', 0, 0); g.restore();
}

/* logo CAT del capo: placa negra con la franja roja y CAT con el triangulo */
function tmnMotRotCAT(g, w, h){
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
/* chapa perforada de las puertas del motor (serie M) */
function tmnMotRejilla(fondo, tinta){
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
function tmnMotPersiana(fondo, tinta){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    g.fillStyle = tinta;
    for(var y = h * 0.08; y < h * 0.92; y += h * 0.075) g.fillRect(w * 0.08, y, w * 0.84, h * 0.035);
  };
}


function tmnMotConstruir(P, piezas){
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var bloque = D.bloque, perfil = D.perfil, tubo = D.tubo, cilindro = D.cilindro, pon = D.pon, letrero = D.letrero;
  var CAT = P.marca === 'CAT', SM = P.serie === 'M', SK = P.serie === 'K', KOM = P.marca === 'KOM';
  var AM = CAT ? CAT_AM : TMN_KOM, AM2 = CAT ? CAT_AM2 : TMN_KOM2;
  var OSC = TMN_MNEGRO;                                   /* antirreflejo, postes, rejillas */
  var cBarra = AM;                                        /* barra de tiro y circulo */
  var cCil = AM;                                          /* camisas de los cilindros */
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
      seg(null, [X(0.75), frTop(0.75) - 0.15], [X(P.uSad - 0.30), frTop(P.uSad - 0.30) - 0.15], s * (P.frW / 2 + 0.012), 0.02, 0.15, 'mate', TMN_MNEGRO, 0.005);
    });
  }
  /* nervio inferior del cuello, mas oscuro para que se lea la curva */
  seg(null, [X(P.uBaja - 0.40), P.yF - P.frH], [X(C.u0b - 0.20), Math.min(C.y - 0.55, P.yF - P.frH - 0.3)], 0, P.frW + 0.02, 0.05, 'pintura', AM2, 0.015);

  /* ═══ placa de empuje (contrapeso) adelante ═══ */
  var ppW = 1.0, ppY0 = 0.72, ppY1 = 1.62;
  /* el Komatsu GD lleva adelante el contrapeso negro (fotos del GD655-5) */
  if(KOM){ ppW = 1.05; ppY0 = 0.80; ppY1 = 1.78; }
  bloque(null, KOM ? 0.42 : 0.22, ppY1 - ppY0, ppW, 'pintura', KOM ? OSC : AM, X(P.uPP + (KOM ? 0.21 : 0.11)), (ppY0 + ppY1) / 2, 0, 0.04);
  bloque(null, 0.05, ppY1 - ppY0 - 0.12, ppW - 0.14, 'pintura', KOM ? '#2A2D31' : AM2, X(P.uPP + (KOM ? 0.44 : 0.24)), (ppY0 + ppY1) / 2, 0, 0.015);
  [-0.30, 0.30].forEach(function(z){
    bloque(null, -0.40 - (P.uPP + 0.22) + 0.04, 0.50, 0.08, 'pintura', AM, X((P.uPP + 0.22 - 0.40) / 2), nb + 0.30, z, 0.02);
  });
  /* pernos de la placa en dos columnas, como en la foto del 620G */
  var nPp = 3, gPp = new THREE.CylinderGeometry(0.028, 0.028, 0.05, 6);
  var iPp = new THREE.InstancedMesh(gPp, D.M.metal('#6A6E73'), nPp * 2), dm = new THREE.Object3D(), k = 0;
  [-1, 1].forEach(function(s){
    for(var i = 0; i < nPp; i++){
      dm.position.set(X(P.uPP) - 0.01, ppY0 + 0.15 + i * (ppY1 - ppY0 - 0.30) / (nPp - 1), s * (ppW / 2 - 0.10));
      dm.rotation.set(0, 0, Math.PI / 2); dm.updateMatrix(); iPp.setMatrixAt(k++, dm.matrix);
    }
  });
  G.add(iPp);
  /* gancho de remolque */
  pon(null, new THREE.TorusGeometry(0.07, 0.022, 8, 16), 'metal', TMN_MACERO, X(P.uPP) - 0.04, ppY0 + 0.10, 0, [Math.PI / 2, 0, 0]);

  /* ═══ eje delantero: viga, pedestal, munones, barra de inclinacion y direccion ═══ */
  var kz = zW - A / 2 - 0.07;
  bloque(null, 0.26, 0.22, 2 * kz, 'pintura', AM, X(0), R + 0.10, 0, 0.04);
  if(nb - (R + 0.21) > 0.02) bloque('PYB', 0.30, nb - (R + 0.21) + 0.02, 0.34, 'pintura', AM2, X(-0.05), (nb + R + 0.21) / 2, 0, 0.03);
  [-1, 1].forEach(function(s){
    cilindro(null, 0.075, 0.075, 0.52, 'metal', TMN_MACERO, X(0), R + 0.08, s * kz, null, 14);
    cilindro(s > 0 ? 'BMLH' : 'BMRH', 0.17, 0.17, 0.12, 'metal', TMN_MGRIS, X(0), R, s * (zW - A / 2 - 0.02), [Math.PI / 2, 0, 0], 20);
    /* brazos de la direccion y cilindros de direccion */
    seg(null, [X(0), R + 0.02], [X(0.30), R + 0.02], s * (kz - 0.05), 0.06, 0.08, 'pintura', AM2);
    D.cilHidD(s > 0 ? 'SLH' : 'SRH', [X(0.16), R + 0.05, s * 0.32], [X(0.30), R + 0.03, s * (kz - 0.08)], 0.045, cCil, 0.55);
  });
  /* barra de inclinacion arriba y barra de acople atras */
  tubo(null, [X(0.20), R + 0.33, -kz], [X(0.20), R + 0.33, kz], 0.045, 'pintura', AM2, 14);
  [-1, 1].forEach(function(s){ tubo(null, [X(0), R + 0.30, s * kz], [X(0.20), R + 0.33, s * kz], 0.04, 'pintura', AM2, 10); });
  tubo(null, [X(0.30), R - 0.02, -kz + 0.08], [X(0.30), R - 0.02, kz - 0.08], 0.035, 'metal', TMN_MACERO, 12);
  D.cilHidD('PHY', [X(0.10), R + 0.22, -0.12], [X(0.20), R + 0.33, 0.55], 0.05, cCil, 0.5);

  /* ═══ silla, barra de tiro, circulo y vertedera ═══ */
  var ySad = frTop(P.uSad);
  bloque('42023615', 0.50, 0.26, 1.10, 'pintura', AM, X(P.uSad), ySad - 0.02, 0, 0.05);
  [-1, 1].forEach(function(s){
    /* brazos de levante de la silla con el munon del cilindro */
    bloque(null, 0.34, 0.50, 0.10, 'pintura', AM, X(P.uSad), ySad + 0.16, s * 0.60, 0.04);
    cilindro('PYB', 0.09, 0.09, 0.30, 'metal', TMN_MACERO, X(P.uSad), ySad + 0.30, s * 0.66, [Math.PI / 2, 0, 0], 14);
  });
  /* barra de tiro en A, con la rotula adelante */
  var uC = P.hoja - 0.15, rC = P.dC / 2, yBar = 0.92;
  var barra = [[0.35, -0.16], [uC - rC - 0.15, -0.55], [uC - 0.25, -(rC + 0.08)], [uC + 0.28, -(rC + 0.04)],
               [uC + 0.28, rC + 0.04], [uC - 0.25, rC + 0.08], [uC - rC - 0.15, 0.55], [0.35, 0.16]];
  placaXZ('42023615', barra.map(function(p){ return [X(p[0]), p[1]]; }), 0.15, yBar, 'pintura', cBarra);
  bloque(null, uC - 0.35, 0.05, 0.12, 'pintura', AM2, X((0.35 + uC) / 2 - 0.1), yBar + 0.10, 0, 0.015);
  pon('PYB', new THREE.SphereGeometry(0.11, 16, 12), 'metal', TMN_MACERO, X(0.35), (yBar + nb) / 2, 0);
  /* mando del circulo: caja de engranajes y motor hidraulico */
  cilindro(null, 0.15, 0.15, 0.30, 'pintura', cBarra, X(uC - rC + 0.05), yBar + 0.22, 0.30, null, 20);
  cilindro(null, 0.09, 0.09, 0.16, 'metal', TMN_MGRIS, X(uC - rC + 0.05), yBar + 0.45, 0.30, null, 14);
  /* cilindros de levante, casi verticales, y el de desplazamiento lateral del circulo */
  [-1, 1].forEach(function(s){
    D.cilHidD('PHY', [X(P.uSad), P.hCil - 0.07, s * 0.66], [X(uC + 0.05), yBar + 0.08, s * (rC - 0.02)], 0.065, cCil, 0.62);
    cilindro(null, 0.05, 0.05, 0.14, 'metal', TMN_MACERO, X(P.uSad), P.hCil - 0.07, s * 0.66, [Math.PI / 2, 0, 0], 10);
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
  cilindro('PYB', 0.09, 0.09, 0.66, 'metal', TMN_MACERO, X(P.uHitch + 0.05), 0.80, 0, null, 16);
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
    cilindro(null, 0.12, 0.12, 0.05, 'metal', TMN_MACERO, X(P.wb), R + 0.15, s * (zT + 0.11), [Math.PI / 2, 0, 0], 12);
  });
  cilindro(null, 0.20, 0.20, 2 * zT - 0.30, 'pintura', AM, X(P.wb), R, 0, [Math.PI / 2, 0, 0], 22);
  pon('DIFP', new THREE.SphereGeometry(0.34, 24, 16), 'pintura', AM, X(P.wb), R + 0.02, 0);
  bloque('TRM', 0.95, 0.52, 0.58, 'metal', TMN_MGRIS, X(P.wb - 0.85), R + 0.28, 0, 0.05);
  bloque('FDP', 0.20, 0.30, 0.30, 'metal', TMN_MGRIS2, X(P.wb - 1.40), R + 0.30, 0, 0.03);

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
    tubo(null, [X(C.u0b + 1.05), C.y + 0.05, s * (w2 + 0.07)], [X(C.u0 + 1.05), roofB - 0.25, s * (w2 + 0.07)], 0.02, 'pintura', (SK ? TMN_MNEGRO : AM), 10);
    [C.y + 0.05, roofB - 0.25].forEach(function(y){
      tubo(null, [X(uf(y) + 1.05), y, s * (w2 + 0.07)], [X(uf(y) + 1.05), y, s * w2], 0.018, 'pintura', (SK ? TMN_MNEGRO : AM), 8);
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
  bloque('CBN', C.u1 - C.u0 + 0.22, 0.14, C.w + 0.16, 'pintura', KOM ? OSC : AM, X((C.u0 + C.u1) / 2), roofB + 0.07, 0, 0.05);
  bloque(null, C.u1 - C.u0 + 0.10, 0.04, C.w + 0.04, 'pintura', OSC, X((C.u0 + C.u1) / 2), roofB - 0.01, 0, 0.015);
  bloque('AAC', (C.u1 - C.u0) * 0.55, 0.10, C.w * 0.62, 'pintura', SM ? AM : TMN_MGRIS, X((C.u0 + C.u1) / 2 + 0.10), P.hCab - 0.05, 0, 0.04);
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
    for(var i = 0; i < nE; i++) bloque(null, 0.36, 0.035, 0.16, 'metal', TMN_MACERO, X(ue), y0 + 0.05 + i * (y1 - y0 - 0.05) / nE, z, 0.008);
    /* soporte de la escalera al piso de la cabina */
    bloque(null, 0.06, 0.06, w2 - 0.25, 'pintura', cEsc, X(ue), y1 + 0.03, s * (w2 + 0.25) / 2, 0.01);
  });

  /* ═══ valvulas, mangueras y engrase centralizado ═══ */
  bloque('VV1', 0.30, 0.20, 0.25, 'metal', TMN_MGRIS2, X(C.u0b + 0.40), C.y - 0.27, 0.38, 0.03);
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
  bloque(null, 0.38, 0.03, 0.22, 'mate', TMN_MGRIS, X(P.uHitch + 0.70), 1.085, 0.70, 0.01);
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
  /* bastidor bajo el capo y tanque de combustible atras, sobre el parachoques */
  bloque('TQC1', 0.62, H.yB - 0.55, H.w - 0.10, 'pintura', AM, X(P.uRear - 0.55), (H.yB + 0.55) / 2, 0, 0.04);
  cilindro(null, 0.07, 0.07, 0.06, 'mate', TMN_MNEGRO, X(P.uRear - 0.70), (H.yB + 0.55) / 2 + 0.10, hw2 - 0.04, [Math.PI / 2, 0, 0], 14);
  bloque('42023615', 0.25, 0.62, H.w + 0.30, 'pintura', AM, X(P.uRear - 0.125), 0.80, 0, 0.04);
  /* puertas del motor (ENG1) con chapa perforada o persianas, y las juntas */
  var lH = uHR - H.u0;
  var texPanel = texRotulo3d(SM ? tmnMotRejilla(AM, '#2A2416') : tmnMotPersiana(AM, '#1E1F22'), 256, 256);
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
    var texCat = texRotulo3d(tmnMotRotCAT, 512, 200);
    [-1, 1].forEach(function(s){
      letrero(texCat, 0.92, 0.36, X(H.u0 + lH * 0.17), capTop(H.u0 + 0.5) - 0.36, s * (hw2 + 0.014), s > 0 ? 0 : Math.PI);
    });
  } else {
    /* la placa GD con franjas azules al frente del capo, como en la foto del GD655 */
    var texGD = texRotulo3d(tmnRotuloGD(P.modelo), 192, 256);
    [-1, 1].forEach(function(s){
      letrero(texGD, 0.36, 0.48, X(H.u0 + lH * 0.17), (H.yB + capTop(H.u0 + 0.5)) / 2 + 0.18, s * (hw2 + 0.014), s > 0 ? 0 : Math.PI);
    });
  }
  /* parrilla trasera del radiador, rotulo y luces traseras */
  D.lamas('RAD1', X(uHR), H.yB + 0.10, capTop(uHR) - 0.46, -(hw2 - 0.14), hw2 - 0.14, 10, OSC, 1);
  bloque(null, 0.04, 0.22, H.w - 0.30, 'mate', '#16181B', X(uHR) + 0.03, capTop(uHR) - 0.33, 0, 0.01);
  letrero(texRotulo3d(rotuloTexto(CAT ? 'CATERPILLAR' : 'KOMATSU', '#16181B', '#FFFFFF', 0.92), 512, 80),
    0.88, 0.14, X(uHR) + 0.052, capTop(uHR) - 0.33, 0, Math.PI / 2);
  [-1, 1].forEach(function(s){
    var z = s * (hw2 - 0.08);
    bloque(null, 0.08, 0.30, 0.13, 'mate', '#202327', X(uHR) + 0.04, capTop(uHR) - 0.33, z, 0.02);
    bloque(s > 0 ? 'FPI' : 'FPD', 0.03, 0.12, 0.10, 'vidrio', '#C2241B', X(uHR) + 0.085, capTop(uHR) - 0.27, z, 0.01);
    bloque('LSM', 0.03, 0.10, 0.10, 'vidrio', '#F2A31A', X(uHR) + 0.085, capTop(uHR) - 0.40, z, 0.01);
  });
  /* escape y prefiltro sobre el capo */
  var zEx = CAT ? -0.25 : 0.30, yEx0 = capTop(P.uEx);
  cilindro(null, 0.12, 0.13, 0.06, 'mate', TMN_MNEGRO, X(P.uEx), yEx0 + 0.02, zEx, null, 18);
  cilindro(null, 0.07, 0.07, P.hEx - yEx0 - 0.14, 'metal', '#2F3338', X(P.uEx), (yEx0 + P.hEx - 0.14) / 2, zEx, null, 16);
  tubo(null, [X(P.uEx), P.hEx - 0.15, zEx], [X(P.uEx) + 0.07, P.hEx, zEx], 0.07, 'metal', '#2F3338', 16);
  var yPre = capTop(P.uPre);
  if(SM){
    bloque(null, 0.42, 0.20, 0.55, 'mate', TMN_MGRIS, X(P.uPre), yPre + 0.09, 0.28, 0.05);
    D.lamas(null, X(P.uPre) - 0.21, yPre + 0.03, yPre + 0.16, 0.06, 0.50, 3, '#202327', -1);
  } else {
    cilindro(null, 0.06, 0.06, 0.22, 'mate', TMN_MNEGRO, X(P.uPre), yPre + 0.11, 0.30, null, 14);
    cilindro(null, 0.15, 0.13, 0.10, 'mate', TMN_MNEGRO, X(P.uPre), yPre + 0.26, 0.30, null, 20);
    cilindro(null, 0.16, 0.16, 0.03, 'mate', TMN_MNEGRO, X(P.uPre), yPre + 0.325, 0.30, null, 20);
  }
  /* pasamanos sobre el capo (K y John Deere) */
  if(!SM){
    [-1, 1].forEach(function(s){
      var z = s * (hw2 - 0.10), ua = H.u0 + 0.25, ub = H.u0 + 1.50;
      [ua, (ua + ub) / 2, ub].forEach(function(u){ tubo(null, [X(u), capTop(u), z], [X(u), capTop(u) + 0.20, z], 0.02, 'pintura', AM, 8); });
      tubo(null, [X(ua), capTop(ua) + 0.20, z], [X(ub), capTop(ub) + 0.20, z], 0.02, 'pintura', AM, 8);
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
    /* KOMATSU en negro a lo largo del bastidor delantero, y el modelo junto a la silla */
    var texKN = texRotulo3d(tmnKomNegro, 512, 96);
    var texM2 = texRotulo3d(tmnTextoT(P.modelo + '-5', '#16181B', 0.9), 256, 80);
    [-1, 1].forEach(function(s){
      tmnLetreroT(G, texKN, 1.05, 0.20, X(1.20), frTop(1.20) - 0.16, s * (P.frW / 2 + 0.012), s > 0 ? 0 : Math.PI);
      tmnLetreroT(G, texM2, 0.48, 0.15, X(P.uSad + 0.70), frTop(P.uSad + 0.70) - 0.14, s * (P.frW / 2 + 0.012), s > 0 ? 0 : Math.PI);
    });
  }
  /* faros: en el Komatsu sobre las esquinas del contrapeso (foto), en el CAT en la nariz */
  [-1, 1].forEach(function(s){
    if(KOM){
      var xc = X(P.uPP + 0.21);
      bloque(null, 0.20, 0.18, 0.22, 'mate', '#202327', xc, ppY1 + 0.10, s * (ppW / 2 - 0.14), 0.03);
      bloque(s > 0 ? 'FDI' : 'FDD', 0.03, 0.13, 0.17, 'vidrio', '#F4EDCF', xc - 0.11, ppY1 + 0.10, s * (ppW / 2 - 0.14), 0.01);
      bloque('LSM', 0.03, 0.06, 0.10, 'vidrio', '#F06A1A', X(P.uPP) - 0.005, ppY1 - 0.12, s * (ppW / 2 - 0.10), 0.01);
    } else {
      bloque(null, 0.10, 0.12, 0.12, 'mate', '#202327', X(-0.30), P.yN + 0.08, s * 0.20, 0.02);
      bloque('LSM', 0.03, 0.08, 0.09, 'vidrio', '#F2A31A', X(-0.30) - 0.065, P.yN + 0.08, s * 0.20, 0.01);
    }
  });

  /* ═══ ripper trasero (y escarificador en el 620P) ═══ */
  var x0 = X(P.uRip), zR = 0.45;
  [-1, 1].forEach(function(s){
    bloque(null, 0.14, 0.62, 0.10, 'pintura', AM, X(P.uRear) + 0.07, 0.82, s * zR, 0.02);
    seg(null, [X(P.uRear) + 0.08, 0.62], [x0 - 0.28, 0.52], s * zR, 0.09, 0.13, 'pintura', AM);
    seg(null, [X(P.uRear) + 0.08, 1.04], [x0 - 0.28, 0.90], s * zR, 0.09, 0.13, 'pintura', AM);
    bloque(null, 0.20, 0.52, 0.06, 'pintura', AM, x0 - 0.28, 0.71, s * zR, 0.02);
    bloque(null, 0.12, 0.26, 0.10, 'pintura', AM, X(P.uRear) + 0.06, 1.24, s * 0.22, 0.02);
    D.cilHidD('PHY', [X(P.uRear) + 0.08, 1.30, s * 0.22], [x0 - 0.30, 0.86, s * 0.22], 0.05, cCil, 0.55);
  });
  bloque(null, 0.26, 0.30, 2.20, 'pintura', AM, x0 - 0.15, 0.66, 0, 0.04);
  var garra = function(z, chico){
    var e = chico ? 0.6 : 1;
    perfil(null, [[x0 - 0.28, 0.80], [x0 - 0.04, 0.80], [x0 - 0.02, 0.66], [x0 - 0.10, 0.38], [x0 - 0.10 - 0.20 * e, 0.40 - 0.24 * e],
      [x0 - 0.10 - 0.30 * e, 0.40 - 0.27 * e], [x0 - 0.10 - 0.28 * e, 0.40 - 0.20 * e], [x0 - 0.24, 0.40], [x0 - 0.22, 0.60]],
      chico ? 0.035 : 0.06, z, 'pintura', AM, 0.01);
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

/* ═══ registro ═══
   solo los modelos exactos de la flota y con su marca: el D8T, el D155AX,
   el 12M, el 140K y los demas ya tienen su archivo */
registrarModelo3d({
  nombre: 'CAT D6T y D9T',
  clave: function(e){
    var m = mod3d(e), mk = String((e && e.marca) || '').toUpperCase();
    if(!/^CAT/.test(mk)) return null;
    return m === 'D6T' ? 'TMND6T' : m === 'D9T' ? 'TMND9T' : null;
  },
  construir: function(e, piezas, clave){ return tmnConstruirCat(TMN_DOZ_CAT[String(clave).replace(/^(R:)?TMN/, '')], piezas); }
});
registrarModelo3d({
  nombre: 'Komatsu D65EX-18',
  clave: function(e){
    var m = mod3d(e), mk = String((e && e.marca) || '').toUpperCase();
    return m === 'D65EX' && /^KOMATSU/.test(mk) ? 'TMND65EX' : null;
  },
  construir: function(e, piezas){ return tmnConstruirKomatsu(TMN_DOZ_KOM.D65EX, piezas); }
});
registrarModelo3d({
  nombre: 'Motoniveladoras CAT 140H y Komatsu GD555-5, GD675-5',
  clave: function(e){
    var m = mod3d(e), mk = String((e && e.marca) || '').toUpperCase();
    if(m === '140H' && /^CAT/.test(mk)) return 'TMN140H';
    if(m === 'GD5555' && /^KOMATSU/.test(mk)) return 'TMNGD555';
    if(m === 'GD6755' && /^KOMATSU/.test(mk)) return 'TMNGD675';
    return null;
  },
  construir: function(e, piezas, clave){ return tmnMotConstruir(TMN_MOT[String(clave).replace(/^(R:)?TMN/, '')], piezas); }
});
registrarModelo3d({
  nombre: 'Rodillo liso CAT CS-533E',
  clave: function(e){
    var m = mod3d(e), mk = String((e && e.marca) || '').toUpperCase();
    return m === 'CS533E' && /^CAT/.test(mk) ? 'TMNCS533E' : null;
  },
  construir: function(e, piezas){ return tmnConstruirRodillo('CS533E', piezas); }
});
