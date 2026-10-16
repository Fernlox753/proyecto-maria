/* ══════════════════════════════════════════════════════════════════
   EXCAVADORAS SOBRE ORUGAS VARIAS — modelos de detalle (prefijo xvk)
     Volvo EC380DL (RE-57, RE-58, RE-1370-AL) · Volvo EC210BLC (RE-29)
     Komatsu PC350LC-8 (RE-37) · PC390LC-8M0 (RE-1264-AL, RE-1353-AL)
     Komatsu PC450LC-8 (RE-53) · PC500LC-10M0 (RE-1319-AL)
     Liebherr R 916 (RE-41)

   Una sola excavadora parametrica (xvkConstruir) que cada modelo arma con
   las medidas de su hoja y con la carroceria de su marca: Komatsu toda
   amarilla con la cabina de parantes negros, las franjas azules y el PC
   del modelo atras; Volvo con pluma, brazo y contrapeso gris pizarra (en
   la serie B el gris del contrapeso sube en diagonal por el costado);
   Liebherr amarilla con la cabina blanca y la tapa del motor gris.

   Medidas (m) de las hojas de los fabricantes:
   · EC380DL (folleto Volvo EC380D/EC480D, 20030338): superestructura 2.990,
     ancho 3.340, techo de cabina 3.197, radio de cola 3.560, tapa del motor
     2.720, bajo contrapeso 1.210, ejes 4.240, oruga 5.180, trocha 2.740,
     teja 600, despeje 0.500. Pluma 6.45, brazo 3.2.
   · EC210BLC: Volvo ya no publica la hoja de la serie B; se toman las del
     EC210DL (folleto Volvo EC210D, 20048852), que es el mismo bastidor:
     superestructura 2.700, cabina 2.930, cola 2.850, tapa 2.315, bajo
     contrapeso 1.025, ejes 3.660, oruga 4.460, trocha 2.390, teja 600,
     despeje 0.460. Pluma 5.7, brazo 2.9. Colores y rotulos de la foto del
     EC210BLC (Wikimedia Commons «Volvo EC210B.JPG»).
   · PC350LC-8 (folleto Komatsu PC300/350LC-8M0, columna LC, igual al -8):
     oruga 4.955, ejes 4.030, trocha 2.590, ancho 3.190, cabina 3.145, cola
     3.450, tapa («machine cab height») 2.585, bajo contrapeso 1.185,
     despeje 0.500, teja 600. Pluma 6.47, brazo 3.185.
   · PC390LC-8M0: Komatsu no la publica en linea. Superestructura de la
     PC350LC-8M0 (cabina 3.190, tapa 2.630, bajo contrapeso 1.230, cola
     3.450) con el tren de la clase 40 t de la PC450LC-8 (oruga 5.385, ejes
     4.350, trocha 2.740); supuesto.
   · PC450LC-8 (folleto Komatsu PC450/450LC-8): oruga 5.385, ejes 4.350,
     trocha 2.740, ancho 3.340, cabina 3.285, cola 3.645, tapa 2.920, bajo
     contrapeso 1.320, despeje 0.550, ancho de la casa 3.165, teja 600.
     Pluma 7.06, brazo 3.38.
   · PC500LC-10M0: sin hoja en linea; se toma la PC490LC-11 (misma clase,
     Ritchie Specs): oruga 5.39, trocha 2.89, cola 3.645, cabina 3.36, bajo
     contrapeso 1.39, despeje 0.70; ejes 4.35 y tapa 2.98 supuestos. Pluma
     7.06, brazo de roca 2.9, cucharon 3.0 m3.
   · R 916 (Liebherr Generacion 6/8, 24 t): Liebherr no publica la hoja en
     linea. Transporte 9.45 x 2.98 x 3.06 (LECTURA), teja 600, por lo que la
     trocha es 2.38. Cola 2.85, superestructura 2.55, oruga 4.40, ejes 3.60,
     tapa 2.45 y bajo contrapeso 1.07 se midieron sobre fotos contra la teja
     y la cabina (supuesto). Pluma 5.70, brazo 2.65.
   Lo que ninguna hoja acota (frente de la casa, cabina 1.65-1.75 x 1.0,
   alturas de cajas y tanques, forma de pluma, brazo y cucharon) sale de las
   fotos de los mismos folletos medidas contra lo que si esta acotado.

   Ejes: frente hacia -X, arriba +Y, la izquierda del operador +Z. El eje de
   giro esta en x = 0, z = 0 dentro de un grupo interior que despues se
   corre para centrar la maquina. Cabina adelante a la izquierda; a la
   derecha la caja de herramientas, los tanques y la sala de bombas; atras
   el motor y el contrapeso. Pluma, brazo y cucharon son subgrupos con su
   pasador en el origen (para el tajo), como en modelo_excav_grandes.js.
   ══════════════════════════════════════════════════════════════════ */

var XVK_KOM = '#F1C40A', XVK_KOM2 = '#C79E05', XVK_KOM_AZUL = '#1F3E9A',
    XVK_VOL = '#F2B705', XVK_VOL2 = '#C69403', XVK_VOL_GR = '#4D5154', XVK_VOL_GR2 = '#3B3E41',
    XVK_LH = '#F4B817', XVK_LH2 = '#C99407', XVK_LH_BL = '#E8E7E1', XVK_LH_GR = '#8D9399',
    XVK_NEGRO = '#1B1D20';

/* ═══ una ficha por modelo ═══
   tren: U oruga, L entre ejes, S trocha, N teja, P alto de la oruga, Q despeje
   casa: A ancho, D radio de cola, F eje de giro al frente, H tapa del motor,
   K bajo contrapeso, cabC techo de cabina, cabL x cabW la cabina
   equipo: Lb pluma, Ls brazo, cap m3, W ancho del cucharon, wB ancho de pluma,
   rC rS rK radios de los cilindros de pluma, brazo y cucharon */
var XVK_P = {
  EC380DL: { nombre: 'VOLVO EC380DL', estilo: 'volD', modelo: 'EC380DL', peso: 38.0,
    U: 5.18, L: 4.24, S: 2.74, N: 0.60, P: 1.04, Q: 0.50, nRod: 9, paso: 0.216,
    A: 2.99, D: 3.56, F: 1.62, H: 2.72, K: 1.21, cabC: 3.197, cabL: 1.75, cabW: 1.00,
    Lb: 6.45, Ls: 3.20, cap: 1.9, W: 1.50, dientes: 5, wB: 0.56, rC: 0.10, rS: 0.115, rK: 0.095 },
  EC210BLC: { nombre: 'VOLVO EC210BLC', estilo: 'volB', modelo: 'EC210BLC', peso: 22.0,
    U: 4.46, L: 3.66, S: 2.39, N: 0.60, P: 0.92, Q: 0.46, nRod: 8, paso: 0.19,
    A: 2.70, D: 2.85, F: 1.38, H: 2.315, K: 1.025, cabC: 2.93, cabL: 1.65, cabW: 0.98,
    Lb: 5.70, Ls: 2.90, cap: 0.9, W: 1.15, dientes: 5, wB: 0.46, rC: 0.085, rS: 0.095, rK: 0.08 },
  PC350LC8: { nombre: 'KOMATSU PC350LC-8', estilo: 'kom8', modelo: '350', peso: 35.8,
    U: 4.955, L: 4.03, S: 2.59, N: 0.60, P: 1.02, Q: 0.50, nRod: 8, paso: 0.216,
    A: 3.05, D: 3.45, F: 1.62, H: 2.585, K: 1.185, cabC: 3.145, cabL: 1.75, cabW: 1.00,
    Lb: 6.47, Ls: 3.185, cap: 1.6, W: 1.45, dientes: 5, wB: 0.56, rC: 0.10, rS: 0.115, rK: 0.095 },
  PC390LC8M0: { nombre: 'KOMATSU PC390LC-8M0', estilo: 'kom8', modelo: '390', peso: 39.0,
    U: 5.385, L: 4.35, S: 2.74, N: 0.60, P: 1.08, Q: 0.60, nRod: 9, paso: 0.216,
    A: 3.05, D: 3.45, F: 1.62, H: 2.63, K: 1.23, cabC: 3.19, cabL: 1.75, cabW: 1.00,
    Lb: 6.47, Ls: 2.90, cap: 2.0, W: 1.60, dientes: 5, wB: 0.58, rC: 0.105, rS: 0.12, rK: 0.10 },
  PC450LC8: { nombre: 'KOMATSU PC450LC-8', estilo: 'kom8', modelo: '450', peso: 44.6,
    U: 5.385, L: 4.35, S: 2.74, N: 0.60, P: 1.10, Q: 0.55, nRod: 9, paso: 0.2285,
    A: 3.165, D: 3.645, F: 1.70, H: 2.92, K: 1.32, cabC: 3.285, cabL: 1.75, cabW: 1.00,
    Lb: 7.06, Ls: 3.38, cap: 2.1, W: 1.65, dientes: 5, wB: 0.62, rC: 0.115, rS: 0.13, rK: 0.105 },
  PC500LC10M0: { nombre: 'KOMATSU PC500LC-10M0', estilo: 'kom10', modelo: '500', peso: 49.5,
    U: 5.39, L: 4.35, S: 2.89, N: 0.60, P: 1.12, Q: 0.70, nRod: 9, paso: 0.2285,
    A: 3.165, D: 3.645, F: 1.70, H: 2.98, K: 1.39, cabC: 3.36, cabL: 1.78, cabW: 1.02,
    Lb: 7.06, Ls: 2.90, cap: 3.0, W: 1.85, dientes: 5, wB: 0.64, rC: 0.12, rS: 0.135, rK: 0.11 },
  R916: { nombre: 'LIEBHERR R 916', estilo: 'lh', modelo: '916', peso: 24.0,
    U: 4.40, L: 3.60, S: 2.38, N: 0.60, P: 0.92, Q: 0.47, nRod: 8, paso: 0.19,
    A: 2.55, D: 2.85, F: 1.36, H: 2.45, K: 1.07, cabC: 3.06, cabL: 1.65, cabW: 0.96,
    Lb: 5.70, Ls: 2.65, cap: 1.1, W: 1.25, dientes: 5, wB: 0.46, rC: 0.085, rS: 0.095, rK: 0.08 }
};

/* colores de cada carroceria: cu cuerpo, cu2 su tono oscuro, cw contrapeso,
   base faldon de la casa, tren, pluma, cil camisas, cuch cucharon, cab y
   cabM cabina y sus parantes, techo, bar barandas, tinta de los rotulos */
var XVK_COL = {
  kom8:  { cu: XVK_KOM, cu2: XVK_KOM2, cw: XVK_KOM, base: '#2A2C2F', tren: '#1E2023', pluma: XVK_KOM, cil: XVK_KOM,
           cuch: XVK_KOM, cab: XVK_KOM, cabM: '#16181B', techo: XVK_KOM, bar: XVK_KOM, tinta: XVK_KOM_AZUL, tapa: '#3A3E43' },
  kom10: { cu: XVK_KOM, cu2: XVK_KOM2, cw: XVK_KOM, base: '#2A2C2F', tren: '#1E2023', pluma: XVK_KOM, cil: XVK_KOM,
           cuch: XVK_KOM, cab: XVK_KOM, cabM: '#16181B', techo: XVK_KOM, bar: XVK_KOM, tinta: XVK_KOM_AZUL, tapa: '#3A3E43' },
  volD:  { cu: XVK_VOL, cu2: XVK_VOL2, cw: XVK_VOL_GR2, base: XVK_VOL_GR2, tren: '#2B2D30', pluma: XVK_VOL_GR, cil: XVK_VOL_GR,
           cuch: XVK_VOL_GR, cab: XVK_VOL, cabM: '#17191B', techo: XVK_VOL, bar: XVK_VOL, tinta: '#F2F2F0', tapa: XVK_VOL },
  volB:  { cu: XVK_VOL, cu2: XVK_VOL2, cw: XVK_VOL_GR2, base: XVK_VOL_GR2, tren: '#2E3033', pluma: XVK_VOL_GR, cil: XVK_VOL_GR,
           cuch: XVK_VOL_GR, cab: XVK_VOL, cabM: '#17191B', techo: XVK_VOL, bar: XVK_VOL, tinta: '#F2F2F0', tapa: XVK_VOL },
  lh:    { cu: XVK_LH, cu2: XVK_LH2, cw: XVK_LH, base: '#2C2E31', tren: '#26282B', pluma: XVK_LH, cil: XVK_LH,
           cuch: XVK_LH, cab: XVK_LH_BL, cabM: '#D5D4CD', techo: XVK_LH_GR, bar: XVK_LH_GR, tinta: '#16181B', tapa: XVK_LH_GR }
};

/* ═══ rotulos: lienzos dibujados (fondo transparente) ═══ */
function xvkDibTexto(txt, tinta, fuente, esc){
  return function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = fuente.replace('%', Math.round(h * 0.80));
    g.save(); g.translate(w / 2, h * 0.53); g.scale(esc || 1, 1);
    g.fillText(txt, 0, 0, w * 0.97 / (esc || 1));
    g.restore();
  };
}
/* VOLVO: mayusculas con remate, espaciadas */
function xvkDibVolvo(tinta){
  return function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.86) + 'px "Georgia", "Times New Roman", serif';
    var L = 'VOLVO'.split(''), paso = w / 6.0;
    L.forEach(function(c, i){ g.fillText(c, w / 2 + (i - 2) * paso, h * 0.55); });
  };
}
/* KOMATSU: palo grueso, la T con su comilla */
function xvkDibKomatsu(tinta){
  return function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.fillStyle = tinta; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.84) + 'px "Arial Black", Arial, sans-serif';
    var txt = 'KOMATSU', ancho = g.measureText(txt).width, sx = Math.min(1.25, w * 0.95 / ancho);
    g.save(); g.translate((w - ancho * sx) / 2, h * 0.55); g.scale(sx, 1);
    g.fillText(txt, 0, 0);
    /* la comilla de la T */
    var xT = g.measureText('KOMA').width + g.measureText('T').width * 0.62;
    g.fillRect(xT, -h * 0.40, h * 0.07, h * 0.14);
    g.restore();
  };
}
/* las tres franjas azules y el PC del modelo, en negro, del costado de atras */
function xvkDibFranjasKom(num){
  return function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#16181B'; g.fillRect(w * 0.30, 0, w * 0.70, h);
    g.fillStyle = XVK_KOM_AZUL;
    for(var i = 0; i < 3; i++) g.fillRect(0, h * (0.04 + i * 0.10), w * 0.30, h * 0.065);
    g.fillStyle = XVK_KOM; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.22) + 'px "Arial Black", Arial, sans-serif';
    g.fillText('PC', w * 0.65, h * 0.42);
    g.fillStyle = '#FFFFFF';
    g.font = 'bold ' + Math.round(h * 0.30) + 'px "Arial Black", Arial, sans-serif';
    g.fillText(num, w * 0.65, h * 0.72, w * 0.66);
  };
}
/* LIEBHERR: letra de palo con remate */
function xvkDibLiebherr(tinta){
  return xvkDibTexto('LIEBHERR', tinta, 'bold %px "Rockwell Extra Bold", "Rockwell", "Clarendon", "Georgia", serif', 1.0);
}

/* correa de orugas alrededor de circulos [x, y, r] recorridos en sentido
   antihorario (rueda guia, rodillos, catarina): puntos con el angulo de la
   normal hacia afuera, a paso parejo */
function xvkCorrea(circ, paso){
  var n = circ.length, seg = [], i;
  for(i = 0; i < n; i++){
    var A = circ[i], B = circ[(i + 1) % n];
    var dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy);
    dx /= l; dy /= l;
    var c = (A[2] - B[2]) / l, s = Math.sqrt(Math.max(0, 1 - c * c));
    var nx = c * dx + s * dy, ny = c * dy - s * dx;
    seg.push({ ax: A[0] + A[2] * nx, ay: A[1] + A[2] * ny, bx: B[0] + B[2] * nx, by: B[1] + B[2] * ny, ang: Math.atan2(ny, nx) });
  }
  var tramos = [], total = 0;
  for(i = 0; i < n; i++){
    var sg = seg[i], L = Math.hypot(sg.bx - sg.ax, sg.by - sg.ay);
    tramos.push({ t: 'l', s: sg, L: L }); total += L;
    var k = (i + 1) % n, d = seg[k].ang - sg.ang;
    while(d < -1e-6) d += 2 * Math.PI;
    if(d > 2 * Math.PI - 0.05) d = 0;
    tramos.push({ t: 'a', c: circ[k], a0: sg.ang, L: d * circ[k][2] }); total += d * circ[k][2];
  }
  var nS = Math.round(total / paso), out = [];
  for(var j = 0; j < nS; j++){
    var dd = (j + 0.5) * total / nS, q = 0;
    while(q < tramos.length - 1 && dd > tramos[q].L){ dd -= tramos[q].L; q++; }
    var T = tramos[q];
    if(T.t === 'l'){
      var f = T.L > 0 ? dd / T.L : 0;
      out.push([T.s.ax + (T.s.bx - T.s.ax) * f, T.s.ay + (T.s.by - T.s.ay) * f, T.s.ang]);
    } else {
      var a = T.a0 + dd / T.c[2];
      out.push([T.c[0] + Math.cos(a) * T.c[2], T.c[1] + Math.sin(a) * T.c[2], a]);
    }
  }
  return { pts: out, paso: total / nS };
}

/* angosta en Z una geometria segun su x local (pluma y brazo mas finos en la punta) */
function xvkAhusar(geo, f, zc){
  var p = geo.attributes.position;
  for(var i = 0; i < p.count; i++){ var k = f(p.getX(i)); p.setZ(i, zc + (p.getZ(i) - zc) * k); }
  p.needsUpdate = true;
  geo.computeVertexNormals();
}

function xvkConstruir(clave, piezas){
  var C = XVK_P[clave], E = C.estilo, col = XVK_COL[E];
  var KOM = E === 'kom8' || E === 'kom10', VOL = E === 'volD' || E === 'volB', LH = E === 'lh';
  var G = new THREE.Group(), MG = new THREE.Group();
  G.add(MG);
  var D = kitDetalle(MG, piezas);
  var bloque = D.bloque, tubo = D.tubo, cilindro = D.cilindro, pon = D.pon, perfil = D.perfil;
  var PI = Math.PI, sc = Math.pow(C.peso / 110, 1 / 3);
  var CU = function(code, w, h, d, x, y, z, r, rot){ return bloque(code, w, h, d, 'pintura', col.cu, x, y, z, r, rot); };

  /* ═══ ayudas ═══ */
  /* lo que se arma dentro de fn pasa a un subgrupo girado (pluma, brazo, cucharon) */
  var sub = function(x, y, ang, fn){
    var n0 = MG.children.length;
    fn();
    var g = new THREE.Group();
    MG.children.slice(n0).forEach(function(m){ MG.remove(m); g.add(m); });
    g.position.set(x, y, 0); g.rotation.z = ang;
    MG.add(g);
    return g;
  };
  /* muchas copias de una pieza chica en una sola malla: q = [x,y,z, rx,ry,rz] */
  var obj = new THREE.Object3D();
  var inst = function(code, geo, tipo, hex, lista){
    var im = new THREE.InstancedMesh(geo, D.M[tipo](hex), lista.length);
    lista.forEach(function(q, i){
      obj.position.set(q[0], q[1], q[2]);
      obj.rotation.set(q[3] || 0, q[4] || 0, q[5] || 0);
      obj.updateMatrix(); im.setMatrixAt(i, obj.matrix);
    });
    im.instanceMatrix.needsUpdate = true;
    return D.reg(code, im, hex);
  };
  /* rotulo de fondo transparente; ry 0 mira a +Z, PI a -Z, -PI/2 a -X, PI/2 a +X */
  var cartel = function(tex, w, h, x, y, z, ry, rz){
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, transparent: true,
      roughness: 0.5, metalness: 0.05, polygonOffset: true, polygonOffsetFactor: -2 }));
    m.position.set(x, y, z); m.rotation.set(0, ry || 0, rz || 0);
    MG.add(m);
    return m;
  };
  /* rotulo curvo sobre el contrapeso (cilindro de radio R alrededor del eje de giro) */
  var cartelCurvo = function(tex, R, h, y, span){
    var m = new THREE.Mesh(new THREE.CylinderGeometry(R, R, h, 24, 1, true, PI / 2 - span / 2, span),
      new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -2 }));
    m.position.y = y; MG.add(m);
    return m;
  };
  /* bloque en planta (x,z) levantado de y0 a y1, con cantos redondeados */
  var planta = function(code, pts, y0, y1, tipo, hex, r){
    r = r || 0.04;
    var sh = new THREE.Shape();
    pts.forEach(function(p, i){ i ? sh.lineTo(p[0], -p[1]) : sh.moveTo(p[0], -p[1]); });
    sh.closePath();
    var g = new THREE.ExtrudeGeometry(sh, { depth: Math.max(0.01, y1 - y0 - 2 * r), bevelEnabled: true,
      bevelThickness: r, bevelSize: r * 0.5, bevelSegments: 2, curveSegments: 8 });
    g.rotateX(-PI / 2); g.translate(0, y0 + r, 0);
    return pon(code, g, tipo, hex);
  };
  /* rejilla de lamas en una cara lateral (mira a +Z con lado 1, a -Z con -1) */
  var rejillaZ = function(code, x0, x1, y0, y1, z, lado, n, hexMarco){
    bloque(code, x1 - x0 + 0.08, y1 - y0 + 0.08, 0.04, 'mate', hexMarco || '#1E2124', (x0 + x1) / 2, (y0 + y1) / 2, z + lado * 0.012, 0.012);
    var paso = (y1 - y0) / n, l = [];
    for(var i = 0; i < n; i++) l.push([(x0 + x1) / 2, y0 + paso * (i + 0.5), z + lado * 0.04, lado * 0.55, 0, 0]);
    inst(null, new THREE.BoxGeometry(x1 - x0 - 0.03, paso * 0.62, 0.03), 'mate', '#0D0E10', l);
  };
  /* rejilla en una cara de arriba: lamas a lo largo de Z */
  var rejillaY = function(code, x0, x1, z0, z1, y, n, hexMarco){
    bloque(code, x1 - x0 + 0.08, 0.04, z1 - z0 + 0.08, 'mate', hexMarco || '#1E2124', (x0 + x1) / 2, y + 0.012, (z0 + z1) / 2, 0.012);
    var paso = (x1 - x0) / n, l = [];
    for(var i = 0; i < n; i++) l.push([x0 + paso * (i + 0.5), y + 0.04, (z0 + z1) / 2, 0, 0, 0.55]);
    inst(null, new THREE.BoxGeometry(paso * 0.55, 0.03, z1 - z0 - 0.03), 'mate', '#0D0E10', l);
  };
  /* faro de trabajo rectangular mirando a -X */
  var faroT = function(code, x, y, z, ancho){
    var w = ancho || 0.22;
    bloque(null, 0.12, 0.16, w, 'mate', '#1E2124', x, y, z, 0.025);
    bloque(code, 0.03, 0.11, w - 0.06, 'vidrio', '#F4EDCF', x - 0.065, y, z, 0.01);
  };
  /* vidrio con marco de goma negro un poco mas grande detras */
  var vidrioZ = function(pts, z, lado){
    perfil(null, pts, 0.02, z, 'mate', '#0E0F11', 0.004);
    var c = [0, 0]; pts.forEach(function(p){ c[0] += p[0] / pts.length; c[1] += p[1] / pts.length; });
    var adentro = pts.map(function(p){ return [c[0] + (p[0] - c[0]) * 0.94, c[1] + (p[1] - c[1]) * 0.94]; });
    perfil(null, adentro, 0.02, z + lado * 0.008, 'vidrio', '#1A2A3A', 0.004);
  };

  /* ══════════ TREN DE ORUGAS ══════════ */
  var tS = 0.11 * sc, hL = 0.12 * sc, L2 = C.L / 2;
  var RW = (C.U - C.L) / 2 - hL - tS;              /* radio de rueda guia y catarina */
  var yW = C.P - tS - hL - RW;                     /* altura de sus ejes */
  var rr = 0.17 * sc, yR = tS + hL + rr;
  var xR0 = -L2 + RW * 1.05, xR1 = L2 - RW * 1.05;
  var rc = 0.12 * sc, yCr = C.P - tS - hL - rc;    /* rodillos superiores */
  var yFt = yCr - rc * 0.6, yFb = yR + rr * 0.35;  /* bastidor de oruga, arriba y abajo */
  var circ = [[-L2, yW, RW + hL], [xR0, yR, rr + hL], [xR1, yR, rr + hL], [L2, yW, RW + hL]];
  var cor = xvkCorrea(circ, C.paso), p = cor.paso;
  /* teja de triple garra: perfil (largo, alto hacia afuera) extruido a lo ancho */
  var tB = tS * 0.45, gR = tS - tB;
  var gTeja = geoPerfilB([[-p * 0.48, 0], [p * 0.48, 0], [p * 0.48, tB], [p * 0.40, tB], [p * 0.36, tS], [p * 0.26, tS], [p * 0.22, tB],
    [p * 0.06, tB], [p * 0.03, tS - gR * 0.15], [-p * 0.06, tS - gR * 0.15], [-p * 0.10, tB], [-p * 0.26, tB], [-p * 0.29, tS - gR * 0.35],
    [-p * 0.37, tS - gR * 0.35], [-p * 0.40, tB], [-p * 0.48, tB]], C.N, 0, 0.006);
  var gEsl = new THREE.BoxGeometry(p * 0.86, hL * 0.85, 0.11 * sc / 0.7); gEsl.translate(0, -hL * 0.5, 0);
  [-1, 1].forEach(function(s){
    var zc = s * C.S / 2, codO = s > 0 ? 'CLH' : 'CRH';
    var lT = [], lE = [], lPn = [];
    cor.pts.forEach(function(q){
      lT.push([q[0], q[1], zc, 0, 0, q[2] - PI / 2]);
      [-1, 1].forEach(function(k){ lE.push([q[0], q[1], zc + k * C.N * 0.21, 0, 0, q[2] - PI / 2]); });
      /* pernos de la teja, sobre la cara de adentro */
      [-1, 1].forEach(function(k){
        lPn.push([q[0] + Math.cos(q[2]) * (tB + 0.005), q[1] + Math.sin(q[2]) * (tB + 0.005), zc + k * C.N * 0.36, 0, 0, q[2] - PI / 2]);
      });
    });
    inst(codO, gTeja, 'metal', '#3A3D41', lT);
    inst(codO, gEsl, 'metal', '#2A2C30', lE);
    inst(null, new THREE.BoxGeometry(0.035, 0.012, 0.035), 'metal', '#55595F', lPn);
    /* bastidor de la oruga con los extremos achaflanados */
    var bf = [[-L2 + RW * 0.2, yW + RW * 0.35], [-L2 + RW * 1.3, yFt], [L2 - RW * 1.5, yFt], [L2 - RW * 0.75, yFt - 0.15 * sc],
              [L2 - RW * 0.75, yFb + 0.10 * sc], [L2 - RW * 1.15, yFb], [-L2 + RW * 1.2, yFb], [-L2 + RW * 0.2, yW - RW * 0.35]];
    perfil(codO, bf, C.N * 0.62, zc, 'pintura', col.tren, 0.025);
    /* nervios y guarda de rodillos en la cara de afuera */
    for(var i = 0; i < 4; i++){
      var xn = -L2 + RW * 1.7 + i * (C.L - RW * 3.4) / 3;
      bloque(null, 0.08, yFt - yFb - 0.05, 0.04, 'pintura', col.tren, xn, (yFt + yFb) / 2, zc + s * C.N * 0.32, 0.012);
    }
    bloque(null, C.L - RW * 2.4, 0.08, 0.04, 'pintura', col.tren, 0, yFb + 0.08, zc + s * C.N * 0.325, 0.012);
    /* peldano sobre la oruga del lado de la cabina */
    if(s > 0) bloque(null, 0.42, 0.035, 0.20, 'metal', '#5A5F66', -0.85 * sc, yFt - 0.02, zc + s * C.N * 0.38, 0.008);
    /* rodillos inferiores (pestanas dobles) y superiores */
    var a = C.N * 0.27;
    var gRod = new THREE.LatheGeometry([[0.04, -a], [rr + 0.04, -a], [rr + 0.04, -a + 0.03], [rr, -a + 0.05], [rr, a - 0.05],
      [rr + 0.04, a - 0.03], [rr + 0.04, a], [0.04, a]].map(function(v){ return new THREE.Vector2(v[0], v[1]); }), 20);
    gRod.rotateX(PI / 2);
    var lR = [];
    for(var r = 0; r < C.nRod; r++) lR.push([xR0 + (xR1 - xR0) * r / (C.nRod - 1), yR, zc]);
    inst(codO, gRod, 'metal', '#3E4246', lR);
    var gSup = new THREE.CylinderGeometry(rc, rc, C.N * 0.36, 16); gSup.rotateX(PI / 2);
    inst(codO, gSup, 'metal', '#3E4246', [[-C.L * 0.2, yCr, zc], [C.L * 0.2, yCr, zc]]);
    [-C.L * 0.2, C.L * 0.2].forEach(function(x){ bloque(null, 0.16 * sc / 0.7, yCr - yFt + 0.04, C.N * 0.28, 'pintura', col.tren, x, (yCr + yFt) / 2 - 0.04, zc, 0.015); });
    /* rueda guia adelante con su pestana al centro */
    var gG = new THREE.LatheGeometry([[0.08, -a], [RW - 0.03, -a], [RW, -a + 0.03], [RW, -0.06], [RW + 0.05, -0.03], [RW + 0.05, 0.03],
      [RW, 0.06], [RW, a - 0.03], [RW - 0.03, a], [0.08, a]].map(function(v){ return new THREE.Vector2(v[0], v[1]); }), 32);
    gG.rotateX(PI / 2);
    pon(s > 0 ? 'RGL' : codO, gG, 'metal', '#3E4246', -L2, yW, zc);
    cilindro(null, RW * 0.35, RW * 0.35, C.N * 0.68, 'metal', '#2E3135', -L2, yW, zc, [PI / 2, 0, 0], 18);
    /* tensor de la rueda guia dentro del bastidor */
    bloque(codO, RW * 1.2, 0.16 * sc / 0.7, C.N * 0.40, 'metal', '#3A3E42', -L2 + RW * 0.95, yW, zc, 0.02);
    /* catarina atras: disco, dientes y maza */
    cilindro(s < 0 ? 'SPR' : codO, RW * 0.95, RW * 0.95, 0.09, 'metal', '#34373B', L2, yW, zc, [PI / 2, 0, 0], 32);
    var nD = 21, lD = [];
    for(var d = 0; d < nD; d++){ var ang = d / nD * PI * 2; lD.push([L2 + Math.cos(ang) * (RW + 0.015), yW + Math.sin(ang) * (RW + 0.015), zc, 0, 0, ang]); }
    inst(s < 0 ? 'SPR' : codO, new THREE.BoxGeometry(0.11 * sc / 0.7, 0.07 * sc / 0.7, 0.08), 'metal', '#2C2F33', lD);
    cilindro(null, RW * 0.55, RW * 0.62, 0.12, 'metal', '#34373B', L2, yW, zc + s * 0.09, [PI / 2, 0, 0], 28);
    /* mando final y motor de traslado hacia adentro, con sus pernos */
    var codM = s > 0 ? 'MLH' : 'MRH', zM = zc - s * (C.N * 0.5 + 0.12);
    cilindro(codM, RW * 0.80, RW * 0.72, 0.30, 'pintura', col.tren, L2, yW, zM, [PI / 2, 0, 0], 30);
    cilindro(s > 0 ? 'TML' : codM, RW * 0.48, RW * 0.48, 0.22, 'metal', '#3A3E42', L2, yW, zM - s * 0.24, [PI / 2, 0, 0], 22);
    var lP = [];
    for(var b = 0; b < 14; b++){ var ab = b / 14 * PI * 2; lP.push([L2 + Math.cos(ab) * RW * 0.66, yW + Math.sin(ab) * RW * 0.66, zM + s * 0.155, PI / 2, 0, 0]); }
    inst(null, new THREE.CylinderGeometry(0.02, 0.02, 0.04, 6), 'metal', '#8A8E93', lP);
    /* mangueras del motor de traslado hacia el centro */
    tubo('LPH', [L2 - RW * 0.3, yW + RW * 0.3, zM - s * 0.30], [L2 - RW * 1.6, yFt - 0.05, zM - s * 0.30], 0.022, 'goma', '#1A1B1D', 8);
  });

  /* ═══ chasis central en X y anillo de giro ═══ */
  var yCb = C.Q + 0.42 * sc, zF = C.S / 2, wX = 0.85 * sc;
  D.perfilX(null, [[-zF + C.N * 0.25, yFt - 0.04], [-wX, yCb], [wX, yCb], [zF - C.N * 0.25, yFt - 0.04], [zF - C.N * 0.25, yFb + 0.12],
    [wX * 0.8, C.Q], [-wX * 0.8, C.Q], [-zF + C.N * 0.25, yFb + 0.12]], 1.55 * sc / 0.7, 0, 'pintura', col.tren, 0.04);
  bloque(null, 2.4 * sc / 0.7, yCb - C.Q - 0.08, 0.95 * sc / 0.7, 'pintura', col.tren, 0, (yCb + C.Q) / 2, 0, 0.04);
  var K = C.K, Rg = 0.95 * sc;
  cilindro(null, Rg + 0.08, Rg + 0.08, 0.07, 'metal', '#3A3E43', 0, yCb + 0.035, 0, null, 48);
  cilindro('RG1', Rg, Rg, K - yCb, 'metal', '#2C2F33', 0, (K + yCb) / 2, 0, null, 48);
  (function(){
    var l = [];
    for(var i = 0; i < 36; i++){ var a = i / 36 * PI * 2; l.push([Math.cos(a) * (Rg + 0.04), yCb + 0.09, Math.sin(a) * (Rg + 0.04)]); }
    inst(null, new THREE.CylinderGeometry(0.022, 0.022, 0.05, 6), 'metal', '#7E8388', l);
  })();
  /* junta rotativa al centro */
  cilindro('PYM', 0.10 * sc / 0.7, 0.10 * sc / 0.7, 0.30, 'metal', '#45494F', 0, yCb + 0.05, 0, null, 16);

  /* ══════════ SUPERESTRUCTURA ══════════ */
  var XF = -C.F, A2 = C.A / 2, Ydk = K + 0.42 * sc, H = C.H;
  var dCw = 0.55 + 0.45 * sc, xCw0 = C.D - dCw;
  var a0 = Math.asin(Math.min(0.98, A2 / C.D)), xA = C.D * Math.cos(a0);
  var cabX0 = XF + 0.05, cabX1 = XF + C.cabL, cabZ1 = A2 - 0.02, cabZ0 = cabZ1 - C.cabW;
  var zR1 = -A2 + (C.A > 2.8 ? 0.90 : 0.78);      /* borde de adentro de la caja, los tanques y las bombas */
  var xT1 = XF + 0.80 * sc / 0.7;                 /* fin de la caja de herramientas */
  var xT2 = xT1 + 0.95 * sc / 0.7;                /* fin del tanque de combustible */
  var xT3 = xT2 + 0.70 * sc / 0.7;                /* fin del tanque hidraulico */
  var xBF = XF + C.cabL * 0.55, yBF = Ydk + 0.72 * sc;   /* pie de la pluma */
  var xE0 = cabX1 + 0.05;                         /* frente del cuarto del motor */
  var zB = (cabZ0 + zR1) / 2;                     /* plano de la pluma */
  var zEl = cabZ0, zEr = zR1;                     /* el motor va entre la cabina y los tanques */

  /* bastidor de la plataforma: su canto se ve como faldon */
  bloque(null, xCw0 - XF + 0.10, Ydk - K, C.A - 0.04, 'pintura', col.base, (XF + xCw0 + 0.10) / 2, (K + Ydk) / 2, 0, 0.04);
  bloque(null, xCw0 - XF, 0.05, C.A, 'mate', '#26282B', (XF + xCw0) / 2, K + 0.03, 0, 0.015);
  /* contrapeso: planta con la cola en arco de radio D */
  var arco = [];
  for(var ia = 0; ia <= 16; ia++){ var an = -a0 + 2 * a0 * ia / 16; arco.push([C.D * Math.cos(an), C.D * Math.sin(an)]); }
  var pCw = [[xCw0, -A2]].concat(arco).concat([[xCw0, A2]]);
  var yCwT = H;
  planta(null, pCw, K, yCwT, 'pintura', col.cw, 0.06);
  /* escalon de arriba del contrapeso y ojos de izaje */
  var arcoIn = arco.map(function(q){ return [q[0] - 0.06, q[1] * 0.97]; });
  planta(null, [[xCw0 + 0.10, -A2 + 0.08]].concat(arcoIn).concat([[xCw0 + 0.10, A2 - 0.08]]), yCwT - 0.02, yCwT + 0.05, 'pintura', col.cw === col.cu ? col.cu2 : col.cw, 0.02);
  [-1, 1].forEach(function(s){ pon(null, new THREE.TorusGeometry(0.07, 0.025, 8, 16), 'mate', '#2A2D31', xCw0 + 0.40, yCwT + 0.10, s * (A2 - 0.40), [0, PI / 2, 0]); });
  /* luces traseras empotradas */
  [-1, 1].forEach(function(s){
    var anl = s * a0 * 0.78, xl = C.D * Math.cos(anl) + 0.01, zl = C.D * Math.sin(anl);
    var mb = bloque(null, 0.06, 0.14, 0.26, 'mate', '#1E2124', xl, K + (yCwT - K) * 0.62, zl, 0.02); mb.rotation.y = -anl;
    var ml = bloque('LSM', 0.03, 0.09, 0.20, 'vidrio', '#C8231B', xl + 0.03, K + (yCwT - K) * 0.62, zl, 0.008); ml.rotation.y = -anl;
  });

  /* ═══ lado izquierdo, detras de la cabina: radiadores y enfriadores ═══ */
  var xL0 = cabX1 + 0.04;
  CU('RAD1', xCw0 - xL0 + 0.02, H - Ydk, A2 - zEl + 0.02, (xL0 + xCw0) / 2, (Ydk + H) / 2, (zEl + A2) / 2, 0.05);
  var xRg0 = xL0 + (LH ? 0.62 : 0.18);
  rejillaZ('RAD1', xRg0, xRg0 + 0.85 * sc / 0.7, Ydk + 0.25, H - 0.22, A2, 1, 8, KOM ? '#1A1C1F' : col.cu2);
  /* puerta de servicio con bisagras y manija */
  bloque(null, 0.015, H - Ydk - 0.16, 0.015, 'mate', '#121314', xL0 + 0.10 + 0.95 * sc / 0.7, (Ydk + H) / 2, A2 + 0.004, 0.004);
  bloque(null, 0.09, 0.03, 0.03, 'cromo', null, xL0 + 0.95 * sc / 0.7, Ydk + (H - Ydk) * 0.55, A2 + 0.018, 0.006);
  /* centro: cuarto del motor con tapa, rejilla y escape */
  CU('ENG1', xCw0 - xE0 + 0.02, H - Ydk, zEl - zEr, (xE0 + xCw0) / 2, (Ydk + H) / 2, (zEl + zEr) / 2, 0.05);
  bloque('ENG1', xCw0 - xE0 - 0.20, 0.07, zEl - zEr - 0.20, 'pintura', col.tapa, (xE0 + xCw0) / 2, H + 0.035, (zEl + zEr) / 2, 0.03);
  rejillaY('ENG1', xE0 + 0.20, xE0 + 0.20 + 0.70 * sc / 0.7, zEr + 0.18, zEl - 0.18, H + 0.07, 7, '#1E2124');
  /* turbo y escape: el turbo asoma bajo el tubo de escape */
  var xEx = xCw0 - 0.45 * sc / 0.7, zEx = zEr + 0.30;
  cilindro('TLH1', 0.11 * sc / 0.7, 0.11 * sc / 0.7, 0.10, 'metal', '#5A5F66', xEx, H + 0.10, zEx, null, 16);
  var hEsc = VOL ? 0.95 * sc / 0.7 : LH ? 0.55 : 0.45;
  cilindro('ENG1', 0.065 * sc / 0.7, 0.065 * sc / 0.7, hEsc, 'metal', E === 'volD' ? '#1A1B1D' : '#3A3D41', xEx, H + 0.15 + hEsc / 2, zEx, null, 16);
  /* proteccion perforada alrededor del escape (Komatsu y Liebherr) */
  if(!VOL) cilindro(null, 0.10 * sc / 0.7, 0.10 * sc / 0.7, hEsc * 0.55, 'mate', '#2A2D31', xEx, H + 0.15 + hEsc * 0.30, zEx, null, 16);
  cilindro(null, 0.08 * sc / 0.7, 0.065 * sc / 0.7, 0.06, 'mate', '#202326', xEx, H + 0.15 + hEsc, zEx, [0, 0, 0.30], 16);
  /* frente del motor: tapa baja de la valvula principal detras del pie de la pluma */
  var xV0 = xBF + 0.55 * sc / 0.7;
  if(xE0 - xV0 > 0.2) CU('VV1', xE0 - xV0, 0.48 * sc / 0.7, zEl - zEr - 0.04, (xV0 + xE0) / 2, Ydk + 0.24 * sc / 0.7, (zEl + zEr) / 2, 0.04);
  /* reductor de giro asomando entre el pie de la pluma y los tanques */
  cilindro('RG1', 0.14 * sc / 0.7, 0.14 * sc / 0.7, 0.55 * sc / 0.7, 'metal', '#454A50', xBF + 0.35 * sc / 0.7, Ydk + 0.27 * sc / 0.7, zEr + 0.16, null, 18);
  cilindro('RG1', 0.17 * sc / 0.7, 0.17 * sc / 0.7, 0.07, 'metal', '#3A3F45', xBF + 0.35 * sc / 0.7, Ydk + 0.035, zEr + 0.16, null, 18);

  /* ═══ lado derecho: caja de herramientas, tanques y sala de bombas ═══ */
  var zRc = (-A2 + zR1) / 2, wRz = zR1 + A2;
  var yCaja = KOM ? Ydk + 0.62 * sc / 0.7 : LH ? H - 0.30 : H - 0.06;
  CU('BAT', xT1 - XF - 0.02, yCaja - Ydk, wRz, (XF + xT1) / 2, (Ydk + yCaja) / 2, zRc, 0.05);
  /* tapa de la caja con su cerradura */
  bloque(null, xT1 - XF - 0.14, 0.02, wRz - 0.12, 'pintura', col.cu2, (XF + xT1) / 2, yCaja + 0.006, zRc, 0.005);
  bloque(null, 0.06, 0.03, 0.06, 'cromo', null, XF + 0.12, yCaja - 0.04, -A2 - 0.012, 0.006);
  /* dos faros en el frente de la caja */
  faroT('LSM', XF - 0.04, yCaja - 0.14, zRc + 0.18, 0.20);
  CU('TQC1', xT2 - xT1 - 0.03, H - Ydk, wRz, (xT1 + xT2) / 2, (Ydk + H) / 2, zRc, 0.06);
  cilindro(null, 0.10, 0.10, 0.08, 'mate', '#1E2124', (xT1 + xT2) / 2, H + 0.04, -A2 + 0.30, null, 18);
  bloque(null, 0.05, 0.45, 0.025, 'vidrio', '#9BB7C9', xT1 + 0.22, (Ydk + H) / 2, -A2 - 0.012, 0.008);
  CU('TQH1', xT3 - xT2 - 0.03, H - Ydk, wRz, (xT2 + xT3) / 2, (Ydk + H) / 2, zRc, 0.06);
  cilindro(null, 0.07, 0.07, 0.03, 'vidrio', '#9BB7C9', (xT2 + xT3) / 2, Ydk + 0.55, -A2 - 0.01, [PI / 2, 0, 0], 18);
  cilindro(null, 0.09, 0.09, 0.10, 'mate', '#1E2124', (xT2 + xT3) / 2, H + 0.05, zRc, null, 16);
  CU('PYM', xCw0 - xT3 + 0.02, H - Ydk, wRz, (xT3 + xCw0) / 2, (Ydk + H) / 2, zRc, 0.06);
  if(E !== 'volB') rejillaZ('PYM', xT3 + 0.20, xCw0 - (KOM ? 0.58 : 0.25), Ydk + 0.25, H - 0.22, -A2, -1, 8, KOM ? '#1A1C1F' : col.cu2);
  /* juntas de puertas y manijas del costado derecho */
  [xT1, xT2, xT3].forEach(function(x){
    bloque(null, 0.015, H - Ydk - 0.12, 0.015, 'mate', '#121314', x, (Ydk + H) / 2, -A2 - 0.004, 0.004);
    bloque(null, 0.09, 0.03, 0.03, 'cromo', null, x + 0.14, Ydk + (H - Ydk) * 0.55, -A2 - 0.018, 0.006);
  });
  /* planchas antideslizantes arriba */
  bloque(null, xT3 - xT1 - 0.10, 0.015, wRz - 0.16, 'mate', '#2A2C2F', (xT1 + xT3) / 2, H + 0.006, zRc, 0.004);
  /* filtro de aire con prefiltro sobre la sala de bombas */
  cilindro(null, 0.13 * sc / 0.7, 0.13 * sc / 0.7, 0.30 * sc / 0.7, 'mate', '#1E2124', xT3 + 0.35, H + 0.15 * sc / 0.7, zRc + 0.10, null, 20);
  cilindro(null, 0.16 * sc / 0.7, 0.16 * sc / 0.7, 0.04, 'mate', '#1E2124', xT3 + 0.35, H + 0.30 * sc / 0.7 + 0.02, zRc + 0.10, null, 20);
  /* lubricacion centralizada: bomba y deposito al frente de los tanques */
  bloque('SEN', 0.18, 0.32, 0.26, 'mate', '#2A2D31', xT1 - 0.15, Ydk + 0.30, zR1 + 0.16, 0.025);
  cilindro('SEN', 0.08, 0.08, 0.26, 'mate', '#D9D4C0', xT1 - 0.15, Ydk + 0.59, zR1 + 0.16, null, 16);
  /* baterias en la caja delantera, se ven por la rejilla del costado */
  rejillaZ('BAT', XF + 0.18, xT1 - 0.18, Ydk + 0.12, yCaja - 0.14, -A2, -1, 3, col.cu2);

  /* ═══ lo que distingue cada carroceria ═══ */
  if(KOM){
    /* caja oscura del posenfriador con rejilla, alzada detras de la cabina */
    var xa0 = xL0 + 0.10, xa1 = xL0 + 0.10 + 0.85 * sc / 0.7;
    bloque('AFT1', xa1 - xa0, 0.42 * sc / 0.7, A2 - zEl - 0.10, 'pintura', col.tapa, (xa0 + xa1) / 2, H + 0.21 * sc / 0.7, (zEl + A2) / 2, 0.04);
    rejillaZ('AFT1', xa0 + 0.08, xa1 - 0.08, H + 0.08, H + 0.36 * sc / 0.7, A2 - 0.05, 1, 4, '#2A2D31');
    rejillaY(null, xa0 + 0.08, xa1 - 0.08, zEl + 0.10, A2 - 0.15, H + 0.42 * sc / 0.7, 6, '#2A2D31');
    /* baranda amarilla sobre los tanques */
    D.baranda([[xT1 + 0.10, -A2 + 0.06], [xCw0 - 0.10, -A2 + 0.06]], H, 0.75, col.bar);
    D.baranda([[xL0 + 1.0 * sc / 0.7, A2 - 0.06], [xCw0 - 0.10, A2 - 0.06]], H, 0.60, col.bar);
    /* peldanos plegados en la caja de herramientas */
    [Ydk - 0.12, Ydk + 0.25].forEach(function(y){
      bloque(null, 0.30, 0.03, 0.34, 'metal', '#4A4F55', XF - 0.12, y, -A2 + 0.30, 0.006);
      bloque(null, 0.04, 0.08, 0.34, 'pintura', col.cu, XF - 0.26, y + 0.03, -A2 + 0.30, 0.008);
    });
  }
  if(VOL){
    /* el gris del contrapeso: en la serie B sube en diagonal por el costado, en la D es una faja baja */
    [-1, 1].forEach(function(s){
      var z = s * (A2 + 0.006);
      if(E === 'volB'){
        perfil(null, [[xCw0 - 0.95 * sc / 0.7, Ydk - 0.02], [xCw0 + 0.06, Ydk - 0.02], [xCw0 + 0.06, H + 0.01], [xCw0 - 0.25, H + 0.01]],
          0.02, z, 'pintura', col.cw, 0.005);
      } else {
        perfil(null, [[XF + 0.40, K + 0.02], [xCw0 + 0.06, K + 0.02], [xCw0 + 0.06, Ydk + 0.30], [xCw0 - 0.60, Ydk + 0.30], [xCw0 - 0.95, Ydk + 0.12], [XF + 0.40, Ydk + 0.12]],
          0.02, z, 'pintura', col.cw, 0.005);
      }
    });
    /* baranda amarilla en arco sobre el frente derecho y a lo largo de los tanques */
    var xh = xT1 + 0.05, zh = -A2 + 0.08, yh = H + (E === 'volB' ? 0.95 : 0.85);
    tubo(null, [xh, H, zh], [xh, yh, zh], 0.026, 'pintura', col.bar, 10);
    tubo(null, [xh, yh, zh], [xh + 0.18, yh + 0.06, zh], 0.026, 'pintura', col.bar, 10);
    tubo(null, [xh + 0.18, yh + 0.06, zh], [xT3 + 0.10, yh + 0.06, zh], 0.026, 'pintura', col.bar, 10);
    tubo(null, [xT3 + 0.10, yh + 0.06, zh], [xT3 + 0.10, H, zh], 0.026, 'pintura', col.bar, 10);
    if(E === 'volD') D.baranda([[xT3 + 0.30, -A2 + 0.06], [xCw0 - 0.10, -A2 + 0.06]], H, 0.70, col.bar);
    /* peldanos del frente derecho */
    [Ydk - 0.10, Ydk + 0.32].forEach(function(y){
      bloque(null, 0.28, 0.03, 0.34, 'metal', '#4A4F55', XF - 0.10, y, -A2 + 0.30, 0.006);
    });
    /* tapas laterales con su rejilla de entrada de aire (la D lleva tres) */
    if(E === 'volD') rejillaZ(null, xT2 + 0.10, xT3 - 0.10, H - 0.55, H - 0.20, -A2, -1, 4, XVK_VOL_GR2);
  }
  if(LH){
    /* tapa del motor gris claro de lado a lado y escalones con baranda */
    bloque('ENG1', xCw0 - xL0 - 0.10, 0.05, C.A - 0.20, 'pintura', XVK_LH_GR, (xL0 + xCw0) / 2, H + 0.025, 0, 0.02);
    D.baranda([[xT1 + 0.10, -A2 + 0.06], [xT3 + 0.30, -A2 + 0.06]], H, 0.70, XVK_LH_GR);
    [Ydk - 0.10, Ydk + 0.30].forEach(function(y){
      bloque(null, 0.28, 0.03, 0.34, 'metal', '#4A4F55', XF - 0.10, y, -A2 + 0.30, 0.006);
    });
  }

  /* ═══ cabina ═══ */
  (function(){
    var x0 = cabX0, x1 = cabX1, z0 = cabZ0, z1 = cabZ1, y0 = Ydk, y1 = C.cabC;
    var cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, wz = z1 - z0, lx = x1 - x0;
    var ySill = y0 + 0.36, yR = y1 - 0.12, rk = 0.18, pw = 0.075;
    var xPost = x0 + 0.62 * lx;
    var cBody = col.cab, cMarco = LH ? col.cabM : col.cab;
    /* piso, base y faldones bajos */
    bloque('CBN', lx, 0.12, wz, 'pintura', col.base, cx, y0 + 0.06, cz, 0.02);
    bloque('CBN', lx - 0.02, ySill - y0 - 0.12, 0.05, 'pintura', cBody, cx, (y0 + 0.12 + ySill) / 2, z1 - 0.025, 0.015);
    bloque('CBN', lx - 0.02, ySill - y0 - 0.12, 0.05, 'pintura', cBody, cx, (y0 + 0.12 + ySill) / 2, z0 + 0.025, 0.015);
    bloque('CBN', 0.07, yR - y0 - 0.12, wz, 'pintura', cBody, x1 - 0.035, (y0 + 0.12 + yR) / 2, cz, 0.015);
    /* parantes: los de adelante inclinados; en Komatsu del color de la cabina con el marco negro */
    var parante = function(a, b, z){
      var dx = b[0] - a[0], dy = b[1] - a[1];
      bloque('CBN', Math.hypot(dx, dy), pw, pw, 'pintura', cMarco, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z, 0.015, [0, 0, Math.atan2(dy, dx)]);
    };
    [z0 + pw / 2, z1 - pw / 2].forEach(function(z){
      parante([x0 + pw / 2, ySill - 0.04], [x0 + rk + pw / 2, yR], z);
      bloque('CBN', pw, yR - ySill, pw, 'pintura', cMarco, x1 - pw / 2 - 0.02, (ySill + yR) / 2, z, 0.015);
    });
    bloque('CBN', pw * 0.8, yR - ySill, pw * 0.8, 'pintura', cMarco, xPost, (ySill + yR) / 2, z1 - pw / 2, 0.015);
    bloque('CBN', lx, 0.06, pw, 'pintura', cMarco, cx, ySill - 0.02, z1 - pw / 2, 0.012);
    bloque('CBN', lx, 0.06, pw, 'pintura', cMarco, cx, ySill - 0.02, z0 + pw / 2, 0.012);
    /* vidrios con marco de goma: parabrisas inclinado, el bajo, puerta, ventana trasera y costado derecho */
    var vf = D.bloque(null, Math.hypot(rk, yR - ySill), 0.025, wz - 0.13, 'vidrio', '#1A2A3A', x0 + rk / 2 + 0.02, (ySill + yR) / 2, cz, 0.004,
      [0, 0, Math.atan2(yR - ySill, rk)]);
    bloque(null, 0.025, ySill - y0 - 0.20, wz - 0.16, 'vidrio', '#1A2A3A', x0 + 0.015, (y0 + 0.28 + ySill) / 2, cz, 0.004);
    vidrioZ([[x0 + pw, ySill + 0.02], [xPost - 0.05, ySill + 0.02], [xPost - 0.05, yR - 0.03], [x0 + rk + pw, yR - 0.03]], z1 - 0.012, 1);
    vidrioZ([[xPost + 0.05, ySill + 0.02], [x1 - pw - 0.03, ySill + 0.02], [x1 - pw - 0.03, yR - 0.03], [xPost + 0.05, yR - 0.03]], z1 - 0.012, 1);
    vidrioZ([[x0 + pw, ySill + 0.02], [x1 - pw - 0.03, ySill + 0.02], [x1 - pw - 0.03, yR - 0.03], [x0 + rk + pw, yR - 0.03]], z0 + 0.012, -1);
    bloque(null, 0.022, (yR - ySill) * 0.50, wz - 0.24, 'vidrio', '#1A2A3A', x1 + 0.004, yR - (yR - ySill) * 0.32, cz, 0.004);
    /* vidrio bajo de la puerta (las cabinas Komatsu y Volvo D) */
    if(KOM || E === 'volD') bloque(null, xPost - x0 - 0.22, ySill - y0 - 0.24, 0.02, 'vidrio', '#1A2A3A', (x0 + xPost) / 2 + 0.04, (y0 + 0.14 + ySill) / 2, z1 + 0.003, 0.004);
    /* techo con alero y escotilla */
    bloque('CBN', lx + 0.10, 0.11, wz + 0.06, 'pintura', col.techo, cx - 0.01, yR + 0.055, cz, 0.04);
    bloque(null, lx * 0.45, 0.03, wz * 0.55, 'mate', '#202326', cx + 0.12, yR + 0.12, cz, 0.012);
    /* interior: asiento, consolas y monitor */
    bloque(null, 0.46, 0.13, 0.46, 'mate', '#2A2C30', cx + 0.20, y0 + 0.58, cz, 0.05);
    bloque(null, 0.13, 0.66, 0.46, 'mate', '#2A2C30', cx + 0.46, y0 + 0.95, cz, 0.05);
    [-1, 1].forEach(function(l){ bloque(null, 0.50, 0.15, 0.15, 'mate', '#1E2023', cx + 0.15, y0 + 0.72, cz + l * 0.33, 0.03); });
    bloque(null, 0.05, 0.18, 0.24, 'mate', '#101112', x0 + rk + 0.18, ySill + 0.22, z0 + 0.18, 0.02);
    /* limpiaparabrisas */
    tubo(null, [x0 + 0.01, ySill + 0.10, cz - 0.20], [x0 + rk * 0.6, ySill + 0.72, cz + 0.12], 0.011, 'mate', '#111', 6);
    /* manija, bisagras y asideros del lado de la puerta */
    bloque(null, 0.15, 0.03, 0.035, 'cromo', null, x0 + 0.22, ySill - 0.10, z1 + 0.022, 0.006);
    [ySill + 0.18, yR - 0.22].forEach(function(y){ bloque(null, 0.05, 0.09, 0.035, 'mate', '#202327', xPost - 0.03, y, z1 + 0.018, 0.008); });
    tubo(null, [x1 + 0.07, y0 + 0.20, z1 - 0.05], [x1 + 0.07, yR - 0.28, z1 - 0.05], 0.02, 'pintura', LH ? XVK_LH_GR : col.bar, 10);
    /* faros del techo y baliza */
    [-1, 1].forEach(function(l){ faroT('LSM', x0 - 0.01, yR + 0.20, cz + l * wz * 0.28, 0.18); });
    var bal = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 10, 0, PI * 2, 0, PI / 2),
      new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4, roughness: 0.3 }));
    bal.position.set(x1 - 0.22, yR + 0.11, z1 - 0.15); MG.add(bal);
    /* condensador del aire acondicionado sobre el techo, atras */
    bloque('AAC', 0.42, 0.13, wz * 0.62, 'mate', '#2A2D31', x1 - 0.30, yR + 0.17, cz, 0.03);
    /* espejo izquierdo en su brazo */
    tubo(null, [x0 + 0.10, ySill, z1 + 0.03], [x0 - 0.16, ySill + 0.40, z1 + 0.20], 0.018, 'mate', '#1E2124', 8);
    bloque(null, 0.05, 0.30, 0.20, 'mate', '#16181B', x0 - 0.18, ySill + 0.55, z1 + 0.22, 0.02);
    bloque(null, 0.012, 0.26, 0.16, 'cromo', null, x0 - 0.205, ySill + 0.55, z1 + 0.22, 0.004);
    /* rotulos en la cabina */
    if(KOM) cartel(texRotulo3d(xvkDibKomatsu(XVK_KOM_AZUL), 512, 96), 0.55, 0.10, x1 - 0.30, ySill - 0.11, z1 + 0.004, 0);
    if(VOL) cartel(texRotulo3d(xvkDibVolvo('#16181B'), 512, 100), 0.42, 0.08, x1 - 0.28, ySill - 0.11, z1 + 0.004, 0);
    if(LH) cartel(texRotulo3d(xvkDibLiebherr('#16181B'), 512, 90), 0.55, 0.10, x1 - 0.32, ySill - 0.10, z1 + 0.004, 0);
  })();

  /* ══════════ EQUIPO DE TRABAJO: pluma, brazo, cucharon ══════════ */
  var Lb = C.Lb, Ls = C.Ls, wB = C.wB;
  var sb = Math.sqrt((C.cap / C.W) / (7.0 / 2.4));
  var kn = 0.21 * Lb, hF = 0.92 * sc, hK = 1.32 * sc, hT = 0.80 * sc;
  var spine = new THREE.CatmullRomCurve3([[0, 0], [-0.12 * Lb, 0.45 * kn], [-0.30 * Lb, 0.90 * kn], [-0.42 * Lb, kn],
    [-0.60 * Lb, 0.83 * kn], [-0.80 * Lb, 0.44 * kn], [-Lb, 0]].map(function(v){ return new THREE.Vector3(v[0], v[1], 0); }));
  var hAt = function(t){
    var s = function(u){ return u * u * (3 - 2 * u); };
    return t < 0.42 ? hF + (hK - hF) * s(t / 0.42) : hK + (hT - hK) * s((t - 0.42) / 0.58);
  };
  var esp = function(t){ var q = spine.getPoint(t), tg = spine.getTangent(t); return { x: q.x, y: q.y, nx: tg.y, ny: -tg.x, h: hAt(t) }; };
  var bordeB = function(t, f){ var e = esp(t); return [e.x + e.nx * e.h / 2 * f, e.y + e.ny * e.h / 2 * f]; };
  var fB = function(x){ return 1 - 0.14 * Math.min(1, Math.max(0, -x / Lb)); };
  var wBt = wB * fB(-Lb);
  /* el brazo: perfil con la palanca atras, para el cilindro del brazo */
  var wS = wBt + 0.16 * sc / 0.7;
  var sPts = [[0.70, 1.22], [1.12, 1.02], [1.05, 0.55], [0.55, -0.52], [-0.6, -0.55], [-Ls / sc + 0.40, -0.34], [-Ls / sc - 0.16, -0.20],
    [-Ls / sc - 0.22, 0.12], [-Ls / sc + 0.20, 0.34], [-Ls / sc + 0.75, 0.42], [-0.6, 0.66], [0.05, 0.90], [0.30, 1.10]].map(function(q){ return [q[0] * sc, q[1] * sc]; });
  var pPal = [0.86 * sc, 1.02 * sc];          /* pasador del cilindro del brazo */
  var pBaseK = [-0.05 * sc, 0.98 * sc];       /* base del cilindro del cucharon */
  var pQ = [-Ls + 0.72 * sc, 0.36 * sc];      /* pasador de la biela guia */
  /* cucharon (marco propio con el pasador del brazo en el origen; mira hacia -Y) */
  var bPts = [[-0.25, -0.55], [-0.15, -0.20], [-0.20, 0.30], [-0.45, 0.75], [-1.00, 0.95], [-1.60, 0.85], [-2.05, 0.40],
    [-2.20, -0.30], [-2.00, -0.90], [-1.75, -1.40]].map(function(q){ return [q[0] * sb, q[1] * sb]; });
  var curB = new THREE.CatmullRomCurve3(bPts.map(function(q){ return new THREE.Vector3(q[0], q[1], 0); }), false, 'centripetal');
  var bSuave = [];
  for(var ib = 0; ib <= 26; ib++){ var vb = curB.getPoint(ib / 26); bSuave.push([vb.x, vb.y]); }
  var pBk = [0.05 * sb, 0.45 * sb];           /* pasador de la biela del cucharon */
  var lg = 0.95 * sc, lb = 0.80 * sb;
  var dirL = [bPts[9][0] - bPts[8][0], bPts[9][1] - bPts[8][1]], nl = Math.hypot(dirL[0], dirL[1]);
  dirL = [dirL[0] / nl, dirL[1] / nl];
  var pT = [bPts[9][0] + dirL[0] * 0.42 * sb, bPts[9][1] + dirL[1] * 0.42 * sb];   /* punta de los dientes */

  /* cinematica: el angulo de pluma que deja los dientes a ras del suelo */
  var aMundo = function(fr, q){ var c = Math.cos(fr.ang), s = Math.sin(fr.ang); return [fr.x + q[0] * c - q[1] * s, fr.y + q[0] * s + q[1] * c]; };
  var beta = -74 * PI / 180, thS = Math.atan2(-Math.sin(beta), -Math.cos(beta)), phi = -0.55;
  var pose = function(al){
    var fb = { x: xBF, y: yBF, ang: -al };
    var tip = aMundo(fb, [-Lb, 0]);
    var fs = { x: tip[0], y: tip[1], ang: thS };
    var bk = aMundo(fs, [-Ls, 0]);
    var fc = { x: bk[0], y: bk[1], ang: thS + phi };
    var low = 99, xmin = 99;
    bPts.concat([pT]).forEach(function(q){ var w = aMundo(fc, q); low = Math.min(low, w[1]); xmin = Math.min(xmin, w[0]); });
    return { fb: fb, fs: fs, fc: fc, low: low, xmin: xmin };
  };
  var zO2 = wS * 0.84 / 2 + 0.04;
  var a0p = -0.3, a1p = 1.0, ps;
  for(var it = 0; it < 40; it++){ var am = (a0p + a1p) / 2; ps = pose(am); if(ps.low < 0.10) a0p = am; else a1p = am; }
  ps = pose(a1p);
  var fb = ps.fb, fs = ps.fs, fc = ps.fc;
  var hexP = col.pluma, hexCil = col.cil;
  /* tapas de los pasadores y graseras, en el marco local de cada pieza: q = [x, y, medio largo] */
  var tapas = function(lista){
    var l = [], g = [];
    lista.forEach(function(q){
      [-1, 1].forEach(function(s){ l.push([q[0], q[1], zB + s * q[2], PI / 2, 0, 0]); });
      g.push([q[0], q[1] + 0.12 * sc, zB + q[2] * 0.7, 0, 0, 0]);
    });
    inst('PYB', new THREE.CylinderGeometry(0.14 * sc, 0.14 * sc, 0.03, 16), 'mate', '#2A2D31', l);
    inst('SEN', new THREE.CylinderGeometry(0.012, 0.012, 0.05, 6), 'metal', '#C9A227', g);
  };

  /* ── pluma ── */
  sub(fb.x, fb.y, fb.ang, function(){
    var NS = 30, top = [], bot = [];
    for(var i = 0; i <= NS; i++){ top.push(bordeB(i / NS, 1)); bot.push(bordeB(i / NS, -1)); }
    var g = geoPerfilB(top.concat(bot.reverse()), wB, zB, 0.035);
    xvkAhusar(g, fB, zB);
    pon(null, g, 'pintura', hexP);
    /* cantoneras de las placas laterales, un tono mas oscuro */
    [1, -1].forEach(function(lado){
      var l = [];
      for(var j = 2; j <= NS - 2; j++){ var q = bordeB(j / NS, lado * 0.90); l.push([q[0], q[1]]); }
      for(j = NS - 2; j >= 2; j--){ var q2 = bordeB(j / NS, lado * 0.80); l.push([q2[0], q2[1]]); }
      [1, -1].forEach(function(s){
        var gp = geoPerfilB(l, 0.02, zB + s * wB / 2, 0.006);
        xvkAhusar(gp, fB, zB);
        pon(null, gp, 'pintura', VOL ? XVK_VOL_GR2 : col.cu2);
      });
    });
    /* jefes de los pasadores en el pie y en la punta */
    cilindro(null, hF * 0.48, hF * 0.48, wB + 0.06, 'pintura', hexP, 0, 0, zB, [PI / 2, 0, 0], 28);
    cilindro('PYB', 0.12 * sc, 0.12 * sc, wB + 0.40, 'metal', '#4A4F55', 0, 0, zB, [PI / 2, 0, 0], 18);
    tapas([[0, 0, wB / 2 + 0.215]]);
    cilindro(null, hT * 0.46, hT * 0.46, wBt + 0.04, 'pintura', hexP, -Lb, 0, zB, [PI / 2, 0, 0], 28);
    /* orejas del cilindro del brazo arriba, cerca del codo */
    var eS = esp(0.34), tS2 = bordeB(0.34, 1);
    [-1, 1].forEach(function(s){
      perfil(null, [[tS2[0] + 0.40 * sc, tS2[1] - 0.04], [tS2[0] - 0.36 * sc, tS2[1] - 0.04], [tS2[0] + eS.nx * 0.36 * sc, tS2[1] + eS.ny * 0.36 * sc]],
        0.06, zB + s * (C.rS + 0.05), 'pintura', hexP, 0.012);
    });
    /* ojos de los cilindros de pluma en los costados */
    var eB = esp(0.36);
    [-1, 1].forEach(function(s){
      cilindro(null, 0.16 * sc, 0.16 * sc, C.rC + 0.06, 'pintura', hexP, eB.x - eB.nx * eB.h * 0.20, eB.y - eB.ny * eB.h * 0.20,
        zB + s * (wB * fB(eB.x) / 2 + (C.rC + 0.06) / 2), [PI / 2, 0, 0], 20);
    });
    /* tuberias de acero sobre la pluma (Liebherr) o mangueras */
    [-0.16, -0.06, 0.06, 0.16].forEach(function(dz, k){
      var pts = [];
      for(var j = 1; j <= 10; j++){ var t = 0.03 + 0.94 * j / 10, e = esp(t); pts.push(new THREE.Vector3(e.x + e.nx * (e.h / 2 + 0.05 + k * 0.008), e.y + e.ny * (e.h / 2 + 0.05 + k * 0.008), zB + dz * wB)); }
      pts.unshift(new THREE.Vector3(0.28 * sc, 0.32 * sc, zB + dz * wB));
      pon('LPH', new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.024 * sc / 0.7, 8, false), LH ? 'metal' : 'goma', LH ? '#9AA0A6' : '#1C1E21');
    });
    /* abrazaderas de las mangueras */
    for(var c = 1; c < 6; c++){
      var ec = esp(c / 6);
      bloque(null, 0.06, 0.04, wB * 0.70, 'metal', '#5A5F66', ec.x + ec.nx * (ec.h / 2 + 0.08), ec.y + ec.ny * (ec.h / 2 + 0.08), zB, 0.008, [0, 0, Math.atan2(ec.ny, ec.nx) - PI / 2]);
    }
    /* linea de engrase por el costado izquierdo hasta la punta */
    (function(){
      var pts = [];
      [0.05, 0.25, 0.45, 0.65, 0.85, 0.98].forEach(function(f){ var e = esp(f); pts.push(new THREE.Vector3(e.x, e.y + 0.05, zB + wB * fB(e.x) / 2 + 0.02)); });
      pon('SEN', new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.011, 6, false), 'goma', '#2A2D31');
    })();
    /* faro de trabajo en el costado izquierdo de la pluma */
    var eL = esp(0.16);
    [-1, 1].forEach(function(s){
      var zl = zB + s * (wB * fB(eL.x) / 2 + 0.10);
      bloque(null, 0.18, 0.14, 0.12, 'mate', '#1E2124', eL.x, eL.y, zl, 0.02);
      bloque('LSM', 0.03, 0.10, 0.09, 'vidrio', '#F4EDCF', eL.x - 0.10, eL.y, zl, 0.008);
    });
    /* marca en los dos costados de la pluma, despues del codo */
    var eM = esp(0.62);
    var texM = KOM ? texRotulo3d(xvkDibKomatsu(XVK_KOM_AZUL), 1024, 170)
             : VOL ? texRotulo3d(xvkDibVolvo('#F2F2F0'), 1024, 190)
             : texRotulo3d(xvkDibLiebherr('#16181B'), 1024, 160);
    var anchoM = (KOM ? 1.85 : VOL ? 1.55 : 1.75) * sc / 0.7, altoM = anchoM * (KOM ? 0.166 : VOL ? 0.185 : 0.156);
    var zm = wB * fB(eM.x) / 2 + 0.025;
    [1, -1].forEach(function(s){
      var m = cartel(texM, anchoM, altoM, eM.x, eM.y + eM.ny * 0.03, zB + s * zm, s > 0 ? 0 : PI);
      m.rotation.z = s > 0 ? Math.atan2(-eM.nx, eM.ny) : Math.atan2(eM.nx, eM.ny);
    });
  });

  /* ── brazo ── */
  sub(fs.x, fs.y, fs.ang, function(){
    var fS = function(x){ return 1 - 0.16 * Math.min(1, Math.max(0, -x / Ls)); };
    var g = geoPerfilB(sPts, wS, zB, 0.035);
    xvkAhusar(g, fS, zB);
    pon(null, g, 'pintura', hexP);
    /* placa de desgaste abajo y jefes de los pasadores */
    var gW = geoPerfilB([[-0.5 * sc, -0.54 * sc], [-Ls + 0.4 * sc, -0.33 * sc], [-Ls + 0.4 * sc, -0.42 * sc], [-0.5 * sc, -0.64 * sc]], wS * 0.86, zB, 0.015);
    xvkAhusar(gW, fS, zB);
    pon(null, gW, 'metal', '#5A5F66');
    cilindro(null, 0.40 * sc, 0.40 * sc, wS + 0.05, 'pintura', hexP, 0, 0, zB, [PI / 2, 0, 0], 28);
    cilindro('PYB', 0.12 * sc, 0.12 * sc, wS + 0.22, 'metal', '#4A4F55', 0, 0, zB, [PI / 2, 0, 0], 18);
    tapas([[0, 0, wS / 2 + 0.125], [pQ[0], pQ[1], wS * (1 - 0.16 * Math.min(1, Math.max(0, -pQ[0] / Ls))) / 2 + 0.095]]);
    cilindro(null, 0.25 * sc, 0.25 * sc, wS * fS(-Ls) + 0.05, 'pintura', hexP, -Ls, 0, zB, [PI / 2, 0, 0], 24);
    cilindro(null, 0.15 * sc, 0.15 * sc, wS + 0.12, 'metal', '#4A4F55', pPal[0], pPal[1], zB, [PI / 2, 0, 0], 16);
    cilindro(null, 0.13 * sc, 0.13 * sc, wS * fS(pQ[0]) + 0.16, 'metal', '#4A4F55', pQ[0], pQ[1], zB, [PI / 2, 0, 0], 16);
    /* orejas de la base del cilindro del cucharon */
    [-1, 1].forEach(function(s){
      perfil(null, [[pBaseK[0] - 0.30 * sc, pBaseK[1] - 0.30 * sc], [pBaseK[0] + 0.30 * sc, pBaseK[1] - 0.30 * sc], [pBaseK[0] + 0.12 * sc, pBaseK[1] + 0.14 * sc],
        [pBaseK[0] - 0.12 * sc, pBaseK[1] + 0.14 * sc]], 0.05, zB + s * (C.rK + 0.05), 'pintura', hexP, 0.01);
    });
    /* mangueras del cilindro del cucharon */
    [-0.12, 0.12].forEach(function(dz){ tubo('LPH', [0.30 * sc, 1.00 * sc, zB + dz * wS], [-0.85 * sc, 0.78 * sc, zB + dz * wS], 0.022, 'goma', '#1C1E21', 8); });
  });

  /* ── cucharon ── */
  sub(fc.x, fc.y, fc.ang, function(){
    var W2 = C.W / 2, hexC = col.cuch;
    [-1, 1].forEach(function(s){
      perfil('LPN', bSuave, 0.05, zB + s * (W2 - 0.025), 'pintura', hexC, 0.012);
      /* refuerzo en el canto de la placa lateral */
      var ref = [], refI = [];
      for(var kr = 3; kr <= 24; kr++){
        var q = bSuave[kr];
        ref.push([q[0] * 0.995, q[1] * 0.995]); refI.push([q[0] * 0.90 - 0.04 * sb, q[1] * 0.90 - 0.015 * sb]);
      }
      perfil(null, ref.concat(refI.reverse()), 0.035, zB + s * (W2 + 0.012), 'mate', '#45484C', 0.008);
      var lab = [bPts[9], bPts[0]], dl = [lab[1][0] - lab[0][0], lab[1][1] - lab[0][1]];
      var cl = Math.hypot(dl[0], dl[1]);
      /* cuchilla lateral en el borde de la boca */
      bloque('GET', cl * 0.55, 0.07, 0.07, 'metal', '#3E4246', lab[0][0] + dl[0] * 0.28, lab[0][1] + dl[1] * 0.28, zB + s * (W2 + 0.015), 0.015,
        [0, 0, Math.atan2(dl[1], dl[0])]);
    });
    /* envolvente: de la boca arriba, por la espalda y el fondo, hasta el labio */
    var cur = bSuave, inn = [];
    for(var i = 0; i < cur.length; i++){
      var a = cur[Math.max(0, i - 1)], b = cur[Math.min(cur.length - 1, i + 1)];
      var tx = b[0] - a[0], ty = b[1] - a[1], tl = Math.hypot(tx, ty);
      inn.push([cur[i][0] - ty / tl * 0.05, cur[i][1] + tx / tl * 0.05]);
    }
    perfil('LPN', cur.concat(inn.reverse()), C.W - 0.08, zB, 'pintura', hexC, 0.015);
    /* placas de desgaste del fondo, apoyadas sobre la envolvente */
    [[15, 18], [18, 21], [21, 24]].forEach(function(r){
      var q0 = bSuave[r[0]], q1 = bSuave[r[1]], tx2 = q1[0] - q0[0], ty2 = q1[1] - q0[1], ln = Math.hypot(tx2, ty2);
      bloque('GET', ln * 0.92, 0.035, C.W * 0.86, 'metal', '#4A4E52', (q0[0] + q1[0]) / 2 + ty2 / ln * 0.025, (q0[1] + q1[1]) / 2 - tx2 / ln * 0.025, zB, 0.01,
        [0, 0, Math.atan2(ty2, tx2)]);
    });
    /* labio, adaptadores y dientes */
    var lab0 = bPts[9], aL = Math.atan2(dirL[1], dirL[0]);
    bloque('LPN', 0.30 * sb, 0.10, C.W - 0.03, 'metal', '#4A4E52', lab0[0] - dirL[0] * 0.06, lab0[1] - dirL[1] * 0.06, zB, 0.015, [0, 0, aL]);
    var nd = C.dientes, lA = [], lDn = [], lPr = [];
    for(var d = 0; d < nd; d++){
      var z = zB - W2 + 0.15 + (C.W - 0.30) * d / (nd - 1);
      lA.push([lab0[0] + dirL[0] * 0.08 * sb, lab0[1] + dirL[1] * 0.08 * sb, z, 0, 0, aL]);
      lDn.push([lab0[0] + dirL[0] * 0.30 * sb, lab0[1] + dirL[1] * 0.30 * sb, z, 0, 0, aL]);
      if(d < nd - 1) lPr.push([lab0[0] + dirL[0] * 0.04, lab0[1] + dirL[1] * 0.04, z + (C.W - 0.30) / (nd - 1) / 2, 0, 0, aL]);
    }
    inst('GET', new THREE.BoxGeometry(0.34 * sb, 0.14 * sc / 0.7, 0.12 * sc / 0.7), 'metal', '#3E4246', lA);
    var gD = new THREE.BoxGeometry(0.28 * sb, 0.12 * sc / 0.7, 0.11 * sc / 0.7), pd = gD.attributes.position;
    for(var v = 0; v < pd.count; v++) if(pd.getX(v) > 0){ pd.setY(v, pd.getY(v) * 0.25); pd.setZ(v, pd.getZ(v) * 0.75); }
    gD.computeVertexNormals();
    inst('GET', gD, 'metal', '#5B5F64', lDn);
    inst('GET', new THREE.BoxGeometry(0.15 * sb, 0.05, 0.14 * sc / 0.7), 'metal', '#3E4246', lPr);
    /* orejas de los pasadores arriba, por fuera del brazo */
    var zO = wS * 0.84 / 2 + 0.04;
    [-1, 1].forEach(function(s){
      perfil(null, [[-0.40 * sb, -0.30 * sb], [0.17 * sb, -0.16 * sb], [0.24 * sb, 0.45 * sb], [0.06 * sb, 0.64 * sb], [-0.55 * sb, 0.78 * sb]],
        0.07, zB + s * zO, 'pintura', hexC, 0.012);
    });
    cilindro('PYB', 0.11 * sc, 0.11 * sc, zO * 2 + 0.14, 'metal', '#4A4F55', 0, 0, zB, [PI / 2, 0, 0], 18);
    /* argolla de izaje en el lomo y pernos de las cuchillas laterales */
    var qa = bSuave[9], qb = bSuave[10], ta = Math.atan2(qb[1] - qa[1], qb[0] - qa[0]);
    pon(null, new THREE.TorusGeometry(0.07 * sb / 0.6, 0.025, 8, 16), 'metal', '#3A3D41', qa[0] + Math.sin(ta) * 0.06, qa[1] - Math.cos(ta) * 0.06, zB, [0, 0, ta]);
    var lB = [], lab = [bPts[9], bPts[0]];
    [-1, 1].forEach(function(s){
      for(var k = 0; k < 3; k++){
        var f = 0.12 + k * 0.14;
        lB.push([lab[0][0] + (lab[1][0] - lab[0][0]) * f, lab[0][1] + (lab[1][1] - lab[0][1]) * f, zB + s * (W2 + 0.055), PI / 2, 0, 0]);
      }
    });
    inst(null, new THREE.CylinderGeometry(0.022, 0.022, 0.03, 6), 'metal', '#6A6F76', lB);
    cilindro('PYB', 0.10 * sc, 0.10 * sc, zO * 2 + 0.14, 'metal', '#4A4F55', pBk[0], pBk[1], zB, [PI / 2, 0, 0], 18);
    tapas([[0, 0, zO + 0.085], [pBk[0], pBk[1], zO + 0.085]]);
  });

  /* ── cilindros, bielas y pasadores en coordenadas del mundo ── */
  var w3 = function(fr, q, z){ var w = aMundo(fr, q); return [w[0], w[1], z]; };
  /* dos cilindros de pluma, desde el frente de la plataforma a los costados de la pluma */
  var eB = esp(0.36), pB = [eB.x - eB.nx * eB.h * 0.20, eB.y - eB.ny * eB.h * 0.20];
  var xBC = XF + 0.10, yBC = K + 0.20 * sc;
  [-1, 1].forEach(function(s){
    var zc = zB + s * (wB * fB(pB[0]) / 2 + C.rC + 0.06);
    /* el de la derecha es el «piston de levante RH» de SAP */
    D.cilHidD(s < 0 ? 'HRH' : 'PHY', [xBC, yBC, zc], w3(fb, pB, zc), C.rC, hexCil, 0.52);
    [-1, 1].forEach(function(k){
      perfil(null, [[xBC + 0.42 * sc / 0.7, K + 0.02], [xBC + 0.42 * sc / 0.7, Ydk - 0.02], [xBC - 0.04, yBC + 0.22 * sc / 0.7], [xBC - 0.20 * sc / 0.7, yBC], [xBC - 0.04, K + 0.02]],
        0.05, zc + k * (C.rC + 0.05), 'pintura', col.base, 0.01);
    });
    cilindro('PYB', 0.07, 0.07, 2 * C.rC + 0.20, 'metal', '#4A4F55', xBC, yBC, zc, [PI / 2, 0, 0], 14);
  });
  /* torres del pie de la pluma */
  [-1, 1].forEach(function(s){
    perfil(null, [[xBF - 0.55 * sc / 0.7, Ydk - 0.02], [xBF + 0.62 * sc / 0.7, Ydk - 0.02], [xBF + 0.30 * sc / 0.7, yBF + 0.22 * sc / 0.7],
      [xBF - 0.18 * sc / 0.7, yBF + 0.30 * sc / 0.7], [xBF - 0.40 * sc / 0.7, yBF]], 0.08, zB + s * (wB / 2 + 0.07), 'pintura', col.cu, 0.015);
  });
  /* cilindro del brazo arriba de la pluma */
  var eS = esp(0.34), tS2 = bordeB(0.34, 1), pSb = [tS2[0] + eS.nx * 0.26 * sc, tS2[1] + eS.ny * 0.26 * sc];
  D.cilHidD('PSK', w3(fb, pSb, zB), w3(fs, pPal, zB), C.rS, hexCil, 0.55);
  /* bielas: guia en el brazo, del cucharon al ojo del vastago */
  var Qw = aMundo(fs, pQ), Bw = aMundo(fc, pBk), dQB = Math.hypot(Bw[0] - Qw[0], Bw[1] - Qw[1]);
  var Jw;
  if(dQB < lg + lb && dQB > Math.abs(lg - lb)){
    var aa = (lg * lg - lb * lb + dQB * dQB) / (2 * dQB), hh = Math.sqrt(Math.max(0, lg * lg - aa * aa));
    var ux = (Bw[0] - Qw[0]) / dQB, uy = (Bw[1] - Qw[1]) / dQB, mx = Qw[0] + ux * aa, my = Qw[1] + uy * aa;
    var J1 = [mx - uy * hh, my + ux * hh], J2 = [mx + uy * hh, my - ux * hh];
    var nS = [-Math.sin(fs.ang), Math.cos(fs.ang)];
    Jw = ((J1[0] - Qw[0]) * nS[0] + (J1[1] - Qw[1]) * nS[1]) > ((J2[0] - Qw[0]) * nS[0] + (J2[1] - Qw[1]) * nS[1]) ? J1 : J2;
  } else {
    Jw = [(Qw[0] + Bw[0]) / 2 - Math.sin(fs.ang) * 0.3, (Qw[1] + Bw[1]) / 2 + Math.cos(fs.ang) * 0.3];
  }
  var zL = wS * 0.84 / 2 + 0.04 + 0.06;
  [-1, 1].forEach(function(s){
    var z = zB + s * zL;
    tubo('PYB', [Qw[0], Qw[1], z], [Jw[0], Jw[1], z], 0.08 * sc, 'pintura', hexP, 14);
    tubo('PYB', [Bw[0], Bw[1], z + s * 0.06], [Jw[0], Jw[1], z + s * 0.06], 0.09 * sc, 'pintura', col.cuch, 14);
  });
  cilindro('PYB', 0.09 * sc, 0.09 * sc, zL * 2 + 0.22, 'metal', '#4A4F55', Jw[0], Jw[1], zB, [PI / 2, 0, 0], 16);
  D.cilHidD('PHY', w3(fs, pBaseK, zB), [Jw[0], Jw[1], zB], C.rK, hexCil, 0.55);
  /* manguera que pasa de la pluma al brazo */
  [-0.12, 0.12].forEach(function(dz){
    var a = aMundo(fb, bordeB(0.94, 1.25)), b = aMundo(fs, [0.10 * sc, 1.00 * sc]), m = [(a[0] + b[0]) / 2 + 0.10, Math.max(a[1], b[1]) + 0.10];
    pon('LPH', new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(a[0], a[1], zB + dz), new THREE.Vector3(m[0], m[1], zB + dz * 1.6),
      new THREE.Vector3(b[0], b[1], zB + dz)]), 20, 0.026, 8, false), 'goma', '#1C1E21');
  });
  /* mangueras de los cilindros de pluma, de la plataforma a las camisas */
  [-1, 1].forEach(function(s){
    var zc = zB + s * (wB * fB(pB[0]) / 2 + C.rC + 0.06), bb = w3(fb, pB, zc);
    var m = [xBC + (bb[0] - xBC) * 0.45, yBC + (bb[1] - yBC) * 0.45 + C.rC + 0.03, zc + s * 0.0];
    tubo('LPH', [xBC + (bb[0] - xBC) * 0.08, yBC + (bb[1] - yBC) * 0.08 + C.rC + 0.03, zc], m, 0.018, 'metal', '#5A5F66', 8);
  });

  /* ══════════ DETALLES DE SERVICIO ══════════ */
  /* bisagras y juntas de las tapas de arriba */
  (function(){
    var l = [];
    [xE0 + 0.08, (xE0 + xCw0) / 2, xCw0 - 0.12].forEach(function(x){ [zEr + 0.20, zEl - 0.20].forEach(function(z){ l.push([x, H + 0.075, z]); }); });
    inst(null, new THREE.BoxGeometry(0.12, 0.03, 0.05), 'metal', '#4A4E54', l);
    bloque(null, 0.012, 0.012, zEl - zEr - 0.10, 'mate', '#121314', (xE0 + xCw0) / 2 + 0.25, H + 0.072, (zEl + zEr) / 2, 0.004);
    bloque(null, xT3 - xT1 - 0.10, 0.012, 0.012, 'mate', '#121314', (xT1 + xT3) / 2, H + 0.014, zR1 - 0.05, 0.004);
  })();
  /* tapas de llenado: combustible, hidraulico (con respiradero) y radiador */
  cilindro('TQC1', 0.075, 0.075, 0.05, 'cromo', null, (xT1 + xT2) / 2, H + 0.11, -A2 + 0.30, null, 16);
  cilindro('TQH1', 0.035, 0.035, 0.14, 'metal', '#3A3D41', (xT2 + xT3) / 2 + 0.15, H + 0.07, zRc - 0.15, null, 10);
  cilindro('TQH1', 0.06, 0.05, 0.06, 'mate', '#1E2124', (xT2 + xT3) / 2 + 0.15, H + 0.16, zRc - 0.15, null, 12);
  cilindro('RAD1', 0.06, 0.06, 0.05, 'mate', '#1E2124', xCw0 - 0.35, H + 0.025, (zEl + A2) / 2, null, 14);
  /* pernos del contrapeso a la tornamesa, en la cara de arriba */
  (function(){
    var l = [];
    [-0.62, -0.22, 0.22, 0.62].forEach(function(f){ l.push([xCw0 + 0.22, H + 0.055, f * A2]); });
    inst(null, new THREE.CylinderGeometry(0.045, 0.045, 0.03, 6), 'metal', '#5A5F66', l);
  })();
  /* camara de retroceso y bocina */
  bloque('EC', 0.10, 0.09, 0.12, 'mate', '#16181B', xCw0 + 0.35, H + 0.11, 0.0, 0.015);
  cilindro(null, 0.025, 0.025, 0.03, 'vidrio', '#0E141A', xCw0 + 0.41, H + 0.11, 0.0, [0, 0, PI / 2], 12);
  cilindro(null, 0.045, 0.07, 0.10, 'mate', '#202326', XF + 0.12, Ydk - 0.10, zB + 0.40, [0, 0, PI / 2], 12);
  /* planchas de proteccion bajo la casa, con sus pernos */
  bloque(null, xCw0 - XF - 0.60, 0.025, C.A - 0.50, 'metal', '#3A3D41', (XF + xCw0) / 2, K - 0.005, 0, 0.008);
  (function(){
    var l = [];
    for(var i = 0; i < 6; i++) [-1, 1].forEach(function(s){ l.push([XF + 0.45 + i * (xCw0 - XF - 0.90) / 5, K - 0.02, s * (A2 - 0.30)]); });
    inst(null, new THREE.CylinderGeometry(0.025, 0.025, 0.02, 6), 'metal', '#6A6F76', l);
  })();
  /* gancho de remolque y argolla al frente del bastidor de orugas */
  [-1, 1].forEach(function(s){
    pon(null, new THREE.TorusGeometry(0.07 * sc / 0.7, 0.022, 8, 16), 'metal', '#3A3D41', -L2 + RW * 1.25, yFt + 0.03, s * C.S / 2, [0, 0, 0]);
  });
  /* asidero del lado de la cabina y del frente derecho */
  tubo(null, [XF + 0.05, Ydk + 0.05, cabZ1 + 0.06], [XF + 0.05, Ydk + 0.95, cabZ1 + 0.06], 0.02, 'pintura', LH ? XVK_LH_GR : col.bar, 10);
  tubo(null, [XF - 0.02, yCaja + 0.02, zRc - 0.25], [XF - 0.02, yCaja + 0.02, zRc + 0.25], 0.02, 'pintura', LH ? XVK_LH_GR : col.bar, 10);

  /* mazo de mangueras del pie de la pluma hacia la valvula principal */
  [-0.10, 0.0, 0.10].forEach(function(dz, k){
    var a = aMundo(fb, [0.30 * sc, 0.32 * sc]);
    pon('LPH', new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(a[0], a[1], zB + dz * wB),
      new THREE.Vector3(a[0] + 0.30, a[1] + 0.05 + k * 0.03, zB + dz * wB), new THREE.Vector3(xE0 - 0.10, Ydk + 0.40, zB + dz * wB * 1.5)]), 16, 0.024, 8, false),
      'goma', '#1C1E21');
  });
  /* guardas de cadena en las puntas del bastidor de orugas y valvula del tensor */
  [-1, 1].forEach(function(s){
    var zc = s * C.S / 2;
    [-1, 1].forEach(function(e){
      bloque(s > 0 ? 'CLH' : 'CRH', 0.22, 0.18 * sc / 0.7, C.N * 0.55, 'pintura', col.tren, e * (L2 - RW * 1.45), yFt - 0.05, zc, 0.02);
    });
    cilindro(null, 0.05, 0.05, 0.03, 'metal', '#8A8E93', -L2 + RW * 1.35, yW + 0.02, zc + s * C.N * 0.33, [PI / 2, 0, 0], 10);
  });
  /* luces de trabajo atras, sobre el contrapeso, y faros del frente de la cabina */
  [-1, 1].forEach(function(s){ faroT('LSM', xCw0 + 0.20, H + 0.16, s * (A2 - 0.55), 0.16); });
  /* limpiaparabrisas inferior y canaleta del techo */
  tubo(null, [cabX0 + 0.02, Ydk + 0.18, (cabZ0 + cabZ1) / 2 - 0.15], [cabX0 + 0.02, Ydk + 0.32, (cabZ0 + cabZ1) / 2 + 0.15], 0.01, 'mate', '#111', 6);
  bloque(null, C.cabL - 0.10, 0.025, 0.03, 'mate', '#1E2124', (cabX0 + cabX1) / 2, C.cabC - 0.13, cabZ1 + 0.015, 0.006);
  /* cierres de la caja de herramientas y de las puertas */
  (function(){
    var l = [];
    [XF + 0.20, xT1 - 0.20].forEach(function(x){ l.push([x, yCaja - 0.06, -A2 - 0.015, 0, 0, 0]); });
    [xT1 + 0.15, xT2 + 0.15, xT3 + 0.15].forEach(function(x){ l.push([x, H - 0.10, -A2 - 0.015, 0, 0, 0]); });
    inst(null, new THREE.BoxGeometry(0.06, 0.04, 0.02), 'metal', '#2A2D31', l);
  })();

  /* ══════════ ROTULOS DE LA CASA ══════════ */
  if(KOM){
    /* KOMATSU en la cola y las franjas con el PC del modelo atras en los dos costados */
    cartelCurvo(texRotulo3d(xvkDibKomatsu(XVK_KOM_AZUL), 1024, 170), C.D + 0.035, 0.30 * sc / 0.7, (K + H) / 2 + 0.12, 0.62);
    var texF = texRotulo3d(xvkDibFranjasKom(C.modelo), 300, 400);
    [-1, 1].forEach(function(s){ cartel(texF, 0.36 * sc / 0.7, 0.48 * sc / 0.7, xCw0 - 0.30, (Ydk + H) / 2 + 0.05, s * (A2 + 0.006), s > 0 ? 0 : PI); });
    if(E === 'kom10'){
      /* la -10 lleva el modelo grande en el costado del contrapeso */
      var tex10 = texRotulo3d(xvkDibTexto('PC500LC', '#16181B', 'bold %px "Arial Black", Arial, sans-serif', 0.9), 512, 96);
      [-1, 1].forEach(function(s){ cartel(tex10, 0.90, 0.17, xCw0 - 0.75, Ydk + 0.15, s * (A2 + 0.03), s > 0 ? 0 : PI); });
    }
  } else if(VOL){
    cartelCurvo(texRotulo3d(xvkDibVolvo('#F2F2F0'), 1024, 190), C.D + 0.035, 0.26 * sc / 0.7, (K + H) / 2 + 0.05, 0.42);
    var texEC = texRotulo3d(xvkDibTexto(C.modelo, '#F2F2F0', 'bold %px "Arial Narrow", "Arial", sans-serif', 0.9), 512, 110);
    [-1, 1].forEach(function(s){
      cartel(texEC, 0.80 * sc / 0.7, 0.17 * sc / 0.7, xCw0 - (E === 'volB' ? 0.12 : 0.40), E === 'volB' ? Ydk + 0.18 : K + 0.20, s * (A2 + 0.03), s > 0 ? 0 : PI);
    });
    /* VOLVO gris en el costado derecho, sobre las puertas de los tanques */
    cartel(texRotulo3d(xvkDibVolvo(XVK_VOL_GR2), 512, 96), Math.min(1.05 * sc / 0.7, (xT3 - xT1) * 0.85), 0.19 * sc / 0.7, (xT1 + xT3) / 2, Ydk + (H - Ydk) * 0.36, -A2 - 0.022, PI);
  } else {
    cartelCurvo(texRotulo3d(xvkDibLiebherr('#16181B'), 1024, 160), C.D + 0.035, 0.25, (K + H) / 2 + 0.05, 0.60);
    var texN = texRotulo3d(xvkDibTexto('916', '#16181B', 'bold %px "Arial Black", Arial, sans-serif', 1.0), 256, 110);
    [-1, 1].forEach(function(s){ cartel(texN, 0.42, 0.18, s > 0 ? xL0 + 0.30 : (xT1 + xT2) / 2, H - 0.30, s * (A2 + 0.03), s > 0 ? 0 : PI); });
  }
  /* numero de unidad abajo en la cola del contrapeso */
  var texNum = texNumero3d(null, VOL ? '#F2F2F0' : '#16181B');
  cartelCurvo(texNum, C.D + 0.035, 0.20 * sc / 0.7, K + 0.20 * sc / 0.7, 0.36);

  /* centrar: de la punta del cucharon a la cola */
  MG.position.x = -(ps.xmin + C.D) / 2;
  /* lo que el tajo necesita para girar la casa, levantar la pluma y abrir el
     cucharon, ya en las coordenadas centradas */
  MG.children.forEach(function(g){
    if(!g.isGroup) return;
    if(g.position.x === fb.x && g.position.y === fb.y) g.userData.equipo = true;
    if(g.position.x === fs.x && g.position.y === fs.y){ g.userData.equipo = true; g.userData.palo = true; }
    if(g.position.x === fc.x && g.position.y === fc.y){ g.userData.equipo = true; g.userData.cucharon = true; }
  });
  G.userData.giroX = MG.position.x;
  G.userData.pie = [fb.x + MG.position.x, fb.y];
  G.userData.frente = XF + MG.position.x;
  G.userData.bisagra = [fc.x + MG.position.x, fc.y];
  G.userData.pivPalo = [fs.x + MG.position.x, fs.y];
  G.userData.ruedas = [];
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = Math.max(2.0, C.cabC * 0.62);
  G.userData.dist = Math.min(30, Math.max(19, (C.D - ps.xmin) * 1.95));
  G.userData.modelo = clave;
  return G;
}

/* ═══ registro: solo estos modelos exactos con su marca ═══ */
registrarModelo3d({
  nombre: 'Excavadoras varias (Volvo EC380DL y EC210BLC, Komatsu PC350LC-8, PC390LC-8M0, PC450LC-8 y PC500LC-10M0, Liebherr R 916)',
  clave: function(e){
    var m = mod3d(e), mc = String((e && e.marca) || '').toUpperCase();
    if(/VOLVO/.test(mc)){
      if(m === 'EC380DL') return 'XVK_EC380DL';
      if(m === 'EC210BLC') return 'XVK_EC210BLC';
    }
    if(/KOMATSU/.test(mc)){
      if(m === 'PC350LC8') return 'XVK_PC350LC8';
      if(m === 'PC390LC8M0') return 'XVK_PC390LC8M0';
      if(m === 'PC450LC8') return 'XVK_PC450LC8';
      if(m === 'PC500LC10M0') return 'XVK_PC500LC10M0';
    }
    if(/LIEBHERR/.test(mc) && m === 'R916') return 'XVK_R916';
    return null;
  },
  construir: function(e, piezas, clave){ return xvkConstruir(String(clave).replace(/^XVK_/, ''), piezas); }
});
