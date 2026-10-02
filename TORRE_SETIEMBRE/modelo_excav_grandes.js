/* ══════════════════════════════════════════════════════════════════
   EXCAVADORAS GRANDES RETRO — modelos de detalle (prefijo exg)
     Liebherr R 9100 (RE-62 a RE-66) y R 9100 G8 (RE-1297-AL)
     Liebherr R 980 SME (RE-1293-AL a RE-1296-AL)
     Hitachi EX1200-7 BH (RE-1247-AL, RE-1248-AL)
     Volvo EC950 y EC950EL (RE-1243-AL, RE-1245-AL, RE-1275-AL a RE-1279-AL)

   Medidas de las hojas de los fabricantes (mm -> m):
   · R 9100 B (folleto Liebherr, pag. 18): superestructura 4.059 de ancho
     (5.443 con la plataforma izquierda), techo de cabina 4.143, capot 4.114,
     radio de cola 4.630, eje de giro al frente 2.107, contrapeso a 1.803 del
     suelo, ruedas 4.810 entre ejes, orugas de 6.107 con trocha 3.900, tejas de
     0.600, 1.663 de alto, despeje 0.812. Pluma mono 7.60, brazo 3.20,
     cucharon 7.0 m3.
   · R 9100 G8 (Liebherr, 2026): mismas medidas y cucharones que el G6; cambia
     el tren (mandos sellados de por vida), la hidraulica y los asistentes
     (camaras Skyview 360, IoMine). Se dibuja igual que el R 9100 con camaras,
     barra de faros LED, mandos finales lisos y escalera de 45 grados (supuesto:
     las notas de prensa no muestran cambios de forma).
   · R 980 SME (folleto Liebherr Generacion 6): ancho 3.565 (4.730 con
     pasarelas), alto de superestructura 3.965, cabina 3.935, contrapeso a
     1.860, cola 4.640, ejes 4.810, oruga 6.095, trocha 3.600, teja 0.600, alto
     de oruga 1.715, despeje 0.810. Pluma SME 7.20, brazo 2.90, cucharon 6.3 m3.
   · EX1200-7 (Hitachi KS-EN408P): ancho total 5.410 (barandas 5.470), cabina
     4.350, cola 4.900, contrapeso a 1.820, ejes 5.090, oruga 6.500, trocha
     3.900, teja 0.700, alto de oruga 1.660, despeje 1.020. Pluma 7.55, brazo
     3.40, cucharon 5.2 m3 de 2.14. Lo no acotado (ancho sin pasarelas 3.70,
     cabina 1.9 x 1.17, alturas del capot 3.60/4.10 y del contrapeso 3.69,
     escape 5.24, filtro de aire 4.56) se midio sobre el dibujo de costado.
   · EC950E/EL (Volvo 20050247): ancho 3.485 (4.505 con pasarelas), cabina
     3.655, escape 3.930, prefiltros 4.025, barandas 4.265, cola 4.700,
     contrapeso a 1.620, ejes 5.120, oruga 6.380, trocha 3.550, teja 0.650,
     despeje 0.915. Pluma 7.25, brazo 2.95, cucharon 5.6 m3. Alto de oruga
     1.22 y eje de giro a la cabina 1.90 medidos sobre el dibujo.

   Ejes: frente hacia -X, arriba +Y, la izquierda del operador +Z. El eje de
   giro esta en x = 0, z = 0 y todo se arma en un grupo interior que despues
   se corre para que la maquina quede centrada. La cabina va adelante a la
   izquierda y la pluma al centro, un poco a la derecha.
   ══════════════════════════════════════════════════════════════════ */

var EXG_LH_BL = '#E7E5DE', EXG_LH_GR = '#8D9399', EXG_LH_AM = '#F4B817',
    EXG_HIT_NA = '#E8641E', EXG_HIT_GR = '#45494F', EXG_VOL_AM = '#F2B705', EXG_VOL_GR = '#3D4044';

/* una ficha por modelo. tren: U largo de oruga, L entre ejes, S trocha, N teja,
   P alto, Pc alto de la cadena (si la oruga lleva guardas mas altas), Q despeje.
   superestructura: A ancho, D cola, F eje de giro al frente, H capot, K contrapeso.
   pluma Lb y brazo Ls de pasador a pasador. */
var EXG_MAQ = {
  R9100: {
    nombre: 'LIEBHERR R 9100', marca: 'LH', modelo: '9100',
    col: { cu: EXG_LH_BL, base: EXG_LH_BL, cw: EXG_LH_BL, techo: EXG_LH_GR, tren: '#55595F', cil: '#232629',
           pluma: EXG_LH_BL, cab: EXG_LH_BL, cabTecho: EXG_LH_GR, bar: '#DAD8D0', pas: '#6E7378', cuch: '#5F6266', rodapie: '#F0C419' },
    U: 6.107, L: 4.81, S: 3.90, N: 0.60, P: 1.663, Q: 0.812, nRod: 7, paso: 0.30,
    A: 4.059, D: 4.63, F: 2.107, H: 4.114, H1: 4.114, K: 1.803, yCw: 4.00,
    cabL: 2.0, cabW: 1.20, cabC: 4.143, cabElev: 0.12,
    pasIzq: 0.78, platCab: 1.38, pasDer: 0, acceso: 'escalera',
    Lb: 7.60, Ls: 3.20, wB: 0.98, sc: 1.0, zB: -0.25, rC: 0.23, rS: 0.24, rK: 0.20,
    cap: 7.0, W: 2.40, dientes: 6, beta: -68, phi: -0.60
  },
  R980: {
    nombre: 'LIEBHERR R 980 SME', marca: 'LH', modelo: '980',
    col: { cu: EXG_LH_AM, base: '#4A4E54', cw: EXG_LH_AM, techo: '#43474D', tren: '#4B4F55', cil: '#3A3E44',
           pluma: EXG_LH_AM, cab: '#E4E2DB', cabTecho: '#4A4E54', bar: '#9DA2A8', pas: '#5E6369', cuch: '#5F6266', rodapie: '#4A4E54' },
    U: 6.095, L: 4.81, S: 3.60, N: 0.60, P: 1.715, Pc: 1.56, Q: 0.81, nRod: 7, paso: 0.28,
    A: 3.565, D: 4.64, F: 1.70, H: 3.965, H1: 3.70, K: 1.86, yCw: 3.455,
    cabL: 1.85, cabW: 1.10, cabC: 3.935, cabElev: 0.05, fops: true,
    pasIzq: 0.58, platCab: 0, pasDer: 0.58, acceso: 'escalera',
    Lb: 7.20, Ls: 2.90, wB: 0.86, sc: 0.88, zB: -0.28, rC: 0.20, rS: 0.21, rK: 0.18,
    cap: 6.3, W: 2.25, dientes: 5, beta: -68, phi: -0.60
  },
  EX1200: {
    nombre: 'HITACHI EX1200-7', marca: 'HIT', modelo: 'EX1200',
    col: { cu: EXG_HIT_NA, base: EXG_HIT_GR, cw: EXG_HIT_GR, techo: '#D85A18', tren: '#2F3236', cil: EXG_HIT_NA,
           pluma: EXG_HIT_NA, cab: '#3E4247', cabTecho: '#55595F', bar: '#8E949A', pas: '#5E6369', cuch: '#55585C', rodapie: '#8E949A' },
    U: 6.50, L: 5.09, S: 3.90, N: 0.70, P: 1.66, Pc: 1.60, Q: 1.02, nRod: 8, paso: 0.30,
    A: 3.70, D: 4.90, F: 2.20, H: 4.10, H1: 3.60, K: 1.82, yCw: 3.69,
    cabL: 1.90, cabW: 1.17, cabC: 4.29, cabElev: 0.05,
    pasIzq: 0.85, platCab: 0, pasDer: 0.85, acceso: 'inclinada',
    Lb: 7.55, Ls: 3.40, wB: 0.92, sc: 0.95, zB: -0.30, rC: 0.21, rS: 0.22, rK: 0.19,
    cap: 5.2, W: 2.14, dientes: 5, beta: -68, phi: -0.60
  },
  EC950: {
    nombre: 'VOLVO EC950', marca: 'VOL', modelo: 'EC950',
    col: { cu: EXG_VOL_GR, base: EXG_VOL_GR, cw: '#44474B', techo: '#36393D', tren: '#26282B', cil: '#3A3D41',
           pluma: '#46494D', cab: '#26282B', cabTecho: EXG_VOL_AM, bar: '#9DA2A8', pas: '#55595E', cuch: '#4E5155', rodapie: '#26282B' },
    U: 6.38, L: 5.12, S: 3.55, N: 0.65, P: 1.22, Q: 0.915, nRod: 9, paso: 0.27,
    A: 3.485, D: 4.70, F: 1.90, H: 3.55, H1: 3.55, K: 1.62, yCw: 3.58,
    cabL: 1.80, cabW: 1.08, cabC: 3.655, cabElev: 0.05,
    pasIzq: 0.51, platCab: 0, pasDer: 0.51, acceso: 'peldanos',
    Lb: 7.25, Ls: 2.95, wB: 0.86, sc: 0.88, zB: -0.28, rC: 0.20, rS: 0.21, rK: 0.18,
    cap: 5.6, W: 2.20, dientes: 5, beta: -68, phi: -0.60
  }
};
/* el G8 es el R 9100 con lo que cambia; el EL es el mismo EC950 de oruga larga con su rotulo */
EXG_MAQ.R9100G8 = (function(){
  var o = {}, b = EXG_MAQ.R9100;
  for(var k in b) o[k] = b[k];
  o.nombre = 'LIEBHERR R 9100 G8'; o.g8 = true; o.acceso = 'gradas';
  return o;
})();
EXG_MAQ.EC950EL = (function(){
  var o = {}, b = EXG_MAQ.EC950;
  for(var k in b) o[k] = b[k];
  o.nombre = 'VOLVO EC950EL'; o.modelo = 'EC950E';
  return o;
})();

/* ═══ rotulos: lienzos dibujados (fondo transparente) ═══ */
function exgDibTexto(txt, tinta, fuente, esc, borde){
  return function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = fuente.replace('%', Math.round(h * 0.80));
    g.save(); g.translate(w / 2, h * 0.53); g.scale(esc || 1, 1);
    g.fillText(txt, 0, 0, w * 0.97 / (esc || 1));
    if(borde){ g.lineWidth = h * 0.03; g.strokeStyle = borde; g.strokeText(txt, 0, 0, w * 0.97 / (esc || 1)); }
    g.restore();
  };
}
/* LIEBHERR: letra de palo con remate, negra */
function exgDibLiebherr(tinta){
  return exgDibTexto('LIEBHERR', tinta, 'bold %px "Rockwell Extra Bold", "Rockwell", "Clarendon", "Georgia", serif', 1.0);
}
/* numero de modelo Liebherr: cifras negras gruesas cortadas por una linea
   clara, como el 9100 rotulado de las fotos */
function exgDibNumLH(txt, chico){
  return function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#16181B'; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.82) + 'px "Arial Black", Arial, sans-serif';
    var ancho = chico ? w * 0.70 : w * 0.96;
    g.fillText(txt, w * 0.02, h * 0.54, ancho);
    g.globalCompositeOperation = 'destination-out';
    g.fillRect(0, h * 0.50, w * 0.98, h * 0.06);
    g.globalCompositeOperation = 'source-over';
    if(chico){
      g.font = 'bold ' + Math.round(h * 0.30) + 'px Arial, sans-serif';
      g.fillText(chico, w * 0.76, h * 0.70);
    }
  };
}
/* VOLVO: mayusculas con remate, espaciadas */
function exgDibVolvo(tinta){
  return function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.86) + 'px "Georgia", "Times New Roman", serif';
    var L = 'VOLVO'.split(''), paso = w / 6.0;
    L.forEach(function(c, i){ g.fillText(c, w / 2 + (i - 2) * paso, h * 0.55); });
  };
}
/* EX1200: EX con el corte en diagonal y el numero */
function exgDibEX(txt, tinta){
  return function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.fillStyle = tinta; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.font = 'bold italic ' + Math.round(h * 0.80) + 'px "Arial Black", Arial, sans-serif';
    g.fillText(txt, w * 0.03, h * 0.55, w * 0.94);
  };
}

function exgConstruir(clave, piezas){
  var C = EXG_MAQ[clave];
  var G = new THREE.Group(), MG = new THREE.Group();
  G.add(MG);
  var D = kitDetalle(MG, piezas);
  var bloque = D.bloque, tubo = D.tubo, cilindro = D.cilindro, pon = D.pon, perfil = D.perfil;
  var col = C.col, PI = Math.PI, LH = C.marca === 'LH', HIT = C.marca === 'HIT', VOL = C.marca === 'VOL';
  var CU = function(code, w, h, d, x, y, z, r, rot){ return bloque(code, w, h, d, 'pintura', col.cu, x, y, z, r, rot); };

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
  /* muchas copias de una pieza chica en una sola malla */
  var obj = new THREE.Object3D();
  var inst = function(code, geo, tipo, hex, lista){
    var im = new THREE.InstancedMesh(geo, D.M[tipo](hex), lista.length);
    lista.forEach(function(q, i){
      obj.position.set(q[0], q[1], q[2]);
      obj.rotation.set(q[3] || 0, q[4] || 0, q[5] || 0);
      obj.scale.set(q[6] || 1, q[7] || 1, q[8] || 1);
      obj.updateMatrix(); im.setMatrixAt(i, obj.matrix);
    });
    im.instanceMatrix.needsUpdate = true;
    return D.reg(code, im, hex);
  };
  /* rotulo de fondo transparente; ry como letrero (0 mira a +Z) */
  var cartel = function(tex, w, h, x, y, z, ry, rz){
    var mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.5, metalness: 0.05,
      polygonOffset: true, polygonOffsetFactor: -2 });
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    m.position.set(x, y, z); m.rotation.set(0, ry || 0, rz || 0);
    MG.add(m);
    return m;
  };
  /* rotulo curvo sobre el contrapeso (cilindro de radio R alrededor del eje de giro) */
  var cartelCurvo = function(tex, R, h, y, span){
    var mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -2 });
    var m = new THREE.Mesh(new THREE.CylinderGeometry(R, R, h, 24, 1, true, PI / 2 - span / 2, span), mat);
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
    bloque(code, x1 - x0 + 0.10, y1 - y0 + 0.10, 0.05, 'mate', hexMarco || '#1E2124', (x0 + x1) / 2, (y0 + y1) / 2, z + lado * 0.02, 0.015);
    var paso = (y1 - y0) / n, l = [];
    for(var i = 0; i < n; i++) l.push([(x0 + x1) / 2, y0 + paso * (i + 0.5), z + lado * 0.055, lado * 0.55, 0, 0]);
    inst(null, new THREE.BoxGeometry(x1 - x0 - 0.04, paso * 0.70, 0.035), 'mate', '#0D0E10', l);
  };
  /* escalera vertical que mira a +Z o -Z (peldanos a lo largo de X) */
  var escaleraZ = function(x, z, y0, y1, ancho, hexL){
    [-1, 1].forEach(function(s){ bloque(null, 0.08, y1 - y0, 0.06, 'pintura', hexL, x + s * ancho / 2, (y0 + y1) / 2, z, 0.015); });
    var n = Math.max(2, Math.round((y1 - y0) / 0.30)), l = [];
    for(var i = 0; i <= n; i++) l.push([x, y0 + 0.10 + (y1 - y0 - 0.2) * i / n, z]);
    inst(null, new THREE.BoxGeometry(ancho - 0.04, 0.035, 0.18), 'metal', '#5A5F66', l);
  };

  /* ══════════ TREN DE ORUGAS ══════════ */
  var tS = 0.11, hL = 0.12, L2 = C.L / 2, Pc = C.Pc || C.P;
  var RW = (C.U - C.L) / 2 - hL - tS;            /* radio de rueda guia y catarina */
  var yW = Pc - tS - hL - RW;                    /* altura de sus ejes */
  var rr = 0.15 + 0.02 * (C.N - 0.6) / 0.1, yR = tS + hL + rr;
  var xR0 = -L2 + RW * 1.05, xR1 = L2 - RW * 1.05;
  var rc = 0.12, yCr = Pc - tS - hL - rc;        /* rodillos superiores */
  var yFt = yCr - rc * 0.6, yFb = yR + rr * 0.35; /* bastidor de oruga, arriba y abajo */
  var circ = [[-L2, yW, RW + hL], [xR0, yR, rr + hL], [xR1, yR, rr + hL], [L2, yW, RW + hL]];
  var cor = exgCorrea(circ, C.paso), p = cor.paso;
  /* teja de una garra: perfil (largo, alto hacia afuera) extruido a lo ancho */
  var gTeja = geoPerfilB([[-p * 0.47, 0], [p * 0.47, 0], [p * 0.47, 0.055], [p * 0.20, 0.062], [p * 0.12, tS], [-p * 0.08, tS],
                          [-p * 0.16, 0.062], [-p * 0.47, 0.055]], C.N, 0, 0.008);
  var gEsl = new THREE.BoxGeometry(p * 0.86, hL * 0.85, 0.14); gEsl.translate(0, -hL * 0.5, 0);
  [-1, 1].forEach(function(s){
    var zc = s * C.S / 2, codO = s > 0 ? 'CLH' : 'CRH';
    var lT = [], lE = [];
    cor.pts.forEach(function(q){
      lT.push([q[0], q[1], zc, 0, 0, q[2] - PI / 2]);
      [-1, 1].forEach(function(k){ lE.push([q[0], q[1], zc + k * C.N * 0.21, 0, 0, q[2] - PI / 2]); });
    });
    inst(codO, gTeja, 'metal', '#3A3D41', lT);
    inst(codO, gEsl, 'metal', '#2A2C30', lE);
    /* bastidor de la oruga con los extremos achaflanados */
    var bf = [[-L2 + RW * 0.2, yW + RW * 0.35], [-L2 + RW * 1.3, yFt], [L2 - RW * 1.5, yFt], [L2 - RW * 0.75, yFt - 0.22],
              [L2 - RW * 0.75, yFb + 0.12], [L2 - RW * 1.15, yFb], [-L2 + RW * 1.2, yFb], [-L2 + RW * 0.2, yW - RW * 0.35]];
    perfil(codO, bf, C.N * 0.66, zc, 'pintura', col.tren, 0.03);
    /* nervios y guardas de rodillos en la cara de afuera */
    for(var i = 0; i < 5; i++){
      var xn = -L2 + RW * 1.6 + i * (C.L - RW * 3.2) / 4;
      bloque(null, 0.10, yFt - yFb - 0.06, 0.05, 'pintura', col.tren, xn, (yFt + yFb) / 2, zc + s * C.N * 0.34, 0.015);
    }
    bloque(null, C.L - RW * 2.4, 0.10, 0.05, 'pintura', col.tren, 0, yFb + 0.10, zc + s * C.N * 0.345, 0.015);
    /* pelda y asidero sobre la oruga */
    bloque(null, 0.50, 0.04, 0.22, 'metal', '#5A5F66', -0.6, yFt - 0.02, zc + s * C.N * 0.40, 0.01);
    /* rodillos inferiores (pestanas dobles) y superiores */
    var a = C.N * 0.28;
    var gRod = new THREE.LatheGeometry([[0.05, -a], [rr + 0.05, -a], [rr + 0.05, -a + 0.04], [rr, -a + 0.06], [rr, a - 0.06],
      [rr + 0.05, a - 0.04], [rr + 0.05, a], [0.05, a]].map(function(v){ return new THREE.Vector2(v[0], v[1]); }), 20);
    gRod.rotateX(PI / 2);
    var lR = [];
    for(var r = 0; r < C.nRod; r++) lR.push([xR0 + (xR1 - xR0) * r / (C.nRod - 1), yR, zc]);
    inst(null, gRod, 'metal', '#3E4246', lR);
    var gSup = new THREE.CylinderGeometry(rc, rc, C.N * 0.36, 16); gSup.rotateX(PI / 2);
    inst(null, gSup, 'metal', '#3E4246', [[-C.L * 0.2, yCr, zc], [C.L * 0.2, yCr, zc]]);
    [-C.L * 0.2, C.L * 0.2].forEach(function(x){ bloque(null, 0.22, yCr - yFt + 0.05, C.N * 0.30, 'pintura', col.tren, x, (yCr + yFt) / 2 - 0.05, zc, 0.02); });
    /* rueda guia adelante con su pestana al centro */
    var gG = new THREE.LatheGeometry([[0.12, -a], [RW - 0.03, -a], [RW, -a + 0.03], [RW, -0.07], [RW + 0.07, -0.035], [RW + 0.07, 0.035],
      [RW, 0.07], [RW, a - 0.03], [RW - 0.03, a], [0.12, a]].map(function(v){ return new THREE.Vector2(v[0], v[1]); }), 32);
    gG.rotateX(PI / 2);
    pon(codO, gG, 'metal', '#3E4246', -L2, yW, zc);
    cilindro(null, RW * 0.35, RW * 0.35, C.N * 0.70, 'metal', '#2E3135', -L2, yW, zc, [PI / 2, 0, 0], 18);
    /* catarina atras: disco, dientes y maza */
    cilindro(null, RW * 0.95, RW * 0.95, 0.12, 'metal', '#34373B', L2, yW, zc, [PI / 2, 0, 0], 32);
    var nD = 13, lD = [];
    for(var d = 0; d < nD; d++){ var ang = d / nD * PI * 2; lD.push([L2 + Math.cos(ang) * (RW + 0.02), yW + Math.sin(ang) * (RW + 0.02), zc, 0, 0, ang]); }
    inst(null, new THREE.BoxGeometry(0.16, 0.11, 0.10), 'metal', '#2C2F33', lD);
    cilindro(null, RW * 0.55, RW * 0.62, 0.16, 'metal', '#34373B', L2, yW, zc + s * 0.12, [PI / 2, 0, 0], 28);
    /* mando final y motor de traslado hacia adentro */
    var codM = s > 0 ? 'MLH' : 'MRH', zM = zc - s * (C.N * 0.5 + 0.18);
    cilindro(codM, RW * 0.78, RW * 0.70, 0.40, C.g8 ? 'pintura' : 'metal', C.g8 ? col.tren : '#4A4E54', L2, yW, zM, [PI / 2, 0, 0], 30);
    cilindro(codM, RW * 0.50, RW * 0.50, 0.25, 'metal', '#3A3E42', L2, yW, zM - s * 0.30, [PI / 2, 0, 0], 22);
    if(!C.g8){
      var lP = [];
      for(var b = 0; b < 16; b++){ var ab = b / 16 * PI * 2; lP.push([L2 + Math.cos(ab) * RW * 0.68, yW + Math.sin(ab) * RW * 0.68, zM + s * 0.21, PI / 2, 0, 0]); }
      inst(null, new THREE.CylinderGeometry(0.025, 0.025, 0.05, 6), 'metal', '#8A8E93', lP);
    }
  });

  /* ═══ chasis central en X y anillo de giro ═══ */
  var yCb = C.Q + 0.62, zF = C.S / 2;
  D.perfilX(null, [[-zF, yFt - 0.06], [-1.15, yCb], [1.15, yCb], [zF, yFt - 0.06], [zF, yFb + 0.16], [1.0, C.Q], [-1.0, C.Q], [-zF, yFb + 0.16]],
    2.3, 0, 'pintura', col.tren, 0.05);
  bloque(null, 3.0, yCb - C.Q - 0.12, 1.30, 'pintura', col.tren, 0, (yCb + C.Q) / 2, 0, 0.05);
  var Rg = Math.min(1.5, C.A * 0.36);
  cilindro(null, Rg + 0.12, Rg + 0.12, 0.10, 'metal', '#3A3E43', 0, yCb + 0.05, 0, null, 48);
  cilindro(null, Rg, Rg, C.K - yCb, 'metal', '#2C2F33', 0, (C.K + yCb) / 2, 0, null, 48);
  var lPg = [];
  for(var pg = 0; pg < 40; pg++){ var apg = pg / 40 * PI * 2; lPg.push([Math.cos(apg) * (Rg + 0.06), yCb + 0.13, Math.sin(apg) * (Rg + 0.06)]); }
  inst(null, new THREE.CylinderGeometry(0.035, 0.035, 0.07, 6), 'metal', '#7E8388', lPg);

  /* ══════════ SUPERESTRUCTURA ══════════ */
  var XF = -C.F, A2 = C.A / 2, K = C.K, Ydk = K + 0.48;
  var xCw0 = C.D - (HIT ? 0.95 : LH ? 0.95 : 0.90);
  var a0 = Math.asin(A2 / C.D), xA = C.D * Math.cos(a0);
  var xE0 = XF + C.cabL + 0.85;                 /* frente del cuarto de maquinas */
  var cabZ1 = A2 - 0.02, cabZ0 = cabZ1 - C.cabW;
  /* bastidor de la plataforma */
  bloque(null, xCw0 - XF + 0.15, Ydk - K, C.A, 'pintura', col.base, (XF + xCw0 + 0.15) / 2, (K + Ydk) / 2, 0, 0.05);
  bloque(null, xCw0 - XF, 0.06, C.A + 0.04, 'mate', '#2A2D31', (XF + xCw0) / 2, K + 0.04, 0, 0.02);
  /* contrapeso: planta con la cola en arco de radio D */
  var arco = [];
  for(var ia = 0; ia <= 14; ia++){ var an = -a0 + 2 * a0 * ia / 14; arco.push([C.D * Math.cos(an), C.D * Math.sin(an)]); }
  var pCw = [[xCw0, -A2]].concat(arco).concat([[xCw0, A2]]);
  planta(null, pCw, K, C.yCw, 'pintura', col.cw, 0.06);
  /* faja inferior y ojos de izaje del contrapeso */
  var arco2 = arco.map(function(q){ return [q[0] * 1.004, q[1] * 1.004]; });
  planta(null, [[xCw0 + 0.1, -A2 - 0.005]].concat(arco2).concat([[xCw0 + 0.1, A2 + 0.005]]), K, K + 0.16, 'mate', '#2A2D31', 0.03);
  [-0.6, 0.6].forEach(function(z){ pon(null, new THREE.TorusGeometry(0.10, 0.035, 8, 16), 'mate', '#2A2D31', C.D - 0.35, C.yCw + 0.06, z, [0, PI / 2, 0]); });
  /* luces traseras del contrapeso */
  [-1, 1].forEach(function(s){
    var an = s * a0 * 0.80, xl = C.D * Math.cos(an) + 0.04, zl = C.D * Math.sin(an);
    if(VOL){
      /* las barras rojas en L de Volvo */
      var m1 = bloque('LSM', 0.06, 0.12, 0.42, 'vidrio', '#C8231B', xl, C.yCw - 0.75, zl * 0.92, 0.02); m1.rotation.y = -an;
      var m2 = bloque('LSM', 0.06, 0.55, 0.12, 'vidrio', '#C8231B', xl - 0.02, C.yCw - 1.05, zl * 0.92 + s * 0.16, 0.02); m2.rotation.y = -an;
    } else {
      var mb = bloque(null, 0.10, 0.20, 0.34, 'mate', '#1E2124', xl, K + 0.45, zl * 0.95, 0.02); mb.rotation.y = -an;
      var ml = bloque('LSM', 0.04, 0.12, 0.26, 'vidrio', s > 0 ? '#C8231B' : '#F2A31A', xl + 0.04, K + 0.45, zl * 0.95, 0.01); ml.rotation.y = -an;
    }
  });

  /* ═══ cuarto de maquinas hueco: paredes, techo con rejilla y el motor a la vista ═══ */
  var zW = A2 - 0.04, xM = HIT ? XF + 4.70 : xE0;        /* Hitachi: tramo trasero mas alto */
  var paredes = function(x0, x1, yt, hex){
    [-1, 1].forEach(function(s){ bloque(null, x1 - x0, yt - Ydk, 0.06, 'pintura', hex, (x0 + x1) / 2, (Ydk + yt) / 2, s * zW, 0.025); });
    bloque(null, 0.06, yt - Ydk, zW * 2, 'pintura', hex, x0 + 0.03, (Ydk + yt) / 2, 0, 0.025);
  };
  var hexCasa = VOL ? EXG_VOL_GR : col.cu;
  if(HIT){
    paredes(xE0, xM, C.H1, hexCasa);
    bloque(null, xM - xE0, 0.08, zW * 2 + 0.04, 'pintura', col.techo, (xE0 + xM) / 2, C.H1 + 0.04, 0, 0.03);
  }
  var xC0 = HIT ? xM : xE0, Ht = C.H;
  paredes(xC0, xCw0 + 0.02, Ht, hexCasa);
  /* motor transversal bajo una rejilla en el techo */
  var zE0 = -A2 + 0.58, zE1 = zE0 + C.A * 0.55, xEn = (xC0 + xCw0) / 2 + 0.10;
  var xG0 = xEn - 0.70, xG1 = xEn + 0.70, zG0 = zE0 - 0.05, zG1 = zE1 + 0.30;
  var techoT = function(x0, x1, z0, z1){ if(x1 - x0 > 0.05 && z1 - z0 > 0.05) bloque('ENG1', x1 - x0, 0.08, z1 - z0, 'pintura', col.techo, (x0 + x1) / 2, Ht + 0.04, (z0 + z1) / 2, 0.03); };
  techoT(xC0, xG0, -zW - 0.02, zW + 0.02);
  techoT(xG1, xCw0 + 0.02, -zW - 0.02, zW + 0.02);
  techoT(xG0, xG1, zG1, zW + 0.02);
  techoT(xG0, xG1, -zW - 0.02, zG0);
  var lRj = [];
  for(var xr = xG0 + 0.05; xr < xG1; xr += 0.11) lRj.push([xr, Ht + 0.03, (zG0 + zG1) / 2]);
  inst(null, new THREE.BoxGeometry(0.025, 0.06, zG1 - zG0), 'metal', '#3A3E43', lRj);
  [xG0 + 0.01, xG1 - 0.01].forEach(function(x){ bloque(null, 0.05, 0.08, zG1 - zG0, 'metal', '#3A3E43', x, Ht + 0.04, (zG0 + zG1) / 2, 0.01); });
  /* el motor: block, culatas, multiple de escape, turbos */
  var yEt = Ht - 0.30, lE = zE1 - zE0, zEc = (zE0 + zE1) / 2;
  bloque('ENG1', 0.95, 0.85, lE, 'metal', '#4A4F55', xEn, yEt - 0.45, zEc, 0.06);
  var bancos = LH ? [-0.24, 0.24] : [0];
  bancos.forEach(function(dx){
    bloque('ENG1', 0.34, 0.16, lE - 0.25, 'metal', '#5C6268', xEn + dx, yEt - 0.02, zEc, 0.03);
    bloque('INY2', 0.08, 0.06, lE - 0.40, 'metal', '#2E3135', xEn + dx, yEt + 0.08, zEc, 0.01);
  });
  bloque(null, 0.16, 0.18, lE - 0.3, 'metal', '#6E5A48', xEn + (LH ? 0 : 0.36), yEt - 0.15, zEc, 0.03);
  [zE0 + 0.45, zE1 - 0.45].forEach(function(z){ pon(null, new THREE.TorusGeometry(0.13, 0.07, 10, 18), 'metal', '#7A8086', xEn + 0.05, yEt + 0.05, z, [PI / 2, 0, 0]); });
  cilindro('AL1', 0.14, 0.14, 0.30, 'metal', '#6E747A', xEn - 0.55, yEt - 0.25, zE0 + 0.35, [0, 0, PI / 2], 16);
  cilindro('AR1', 0.11, 0.11, 0.34, 'metal', '#2E3135', xEn + 0.55, yEt - 0.62, zE1 - 0.30, [0, 0, PI / 2], 14);
  /* caja de mando de bombas y bombas, del lado izquierdo */
  bloque('PTB1', 0.80, 0.70, 0.35, 'metal', '#5A6067', xEn, yEt - 0.45, zE1 + 0.18, 0.04);
  [-0.22, 0.22].forEach(function(dx){ cilindro('PTB1', 0.15, 0.15, 0.45, 'metal', '#6E747A', xEn + dx, yEt - 0.45, zE1 + 0.55, [PI / 2, 0, 0], 16); });
  /* radiador y ventilador del lado derecho, detras de las rejillas */
  bloque('RAD1', 1.10, Ht - Ydk - 0.35, 0.30, 'metal', '#3C4147', xEn + 0.15, (Ydk + Ht) / 2, -A2 + 0.30, 0.03);
  pon('RAD1', new THREE.TorusGeometry(0.42, 0.05, 8, 28), 'metal', '#6E747A', xEn + 0.15, (Ydk + Ht) / 2, -A2 + 0.50, null);
  /* rejillas del radiador en el costado derecho y una de admision a la izquierda */
  var yG0 = Ydk + 0.30, yG1 = Ht - 0.25;
  if(LH){
    var xg = xCw0 - 0.15;
    rejillaZ('RAD1', xg - 1.95, xg - 1.05, yG0 + 0.35, yG1, -A2 + 0.01, -1, 8);
    rejillaZ('RAD1', xg - 0.95, xg - 0.05, yG0 + 0.35, yG1, -A2 + 0.01, -1, 8);
    rejillaZ(null, xg - 0.95, xg - 0.05, yG0 + 0.80, yG1, A2 - 0.01, 1, 6);
  } else if(HIT){
    rejillaZ('RAD1', xM + 0.25, xCw0 - 0.20, Ht - 0.95, Ht - 0.20, -A2 + 0.01, -1, 7, '#2A2D31');
    rejillaZ(null, xM + 0.25, xCw0 - 0.20, Ht - 0.95, Ht - 0.20, A2 - 0.01, 1, 7, '#2A2D31');
  } else {
    rejillaZ('RAD1', xCw0 - 1.25, xCw0 - 0.20, Ht - 0.75, Ht - 0.20, -A2 + 0.01, -1, 6);
    rejillaZ(null, xCw0 - 1.25, xCw0 - 0.20, Ht - 0.75, Ht - 0.20, A2 - 0.01, 1, 6);
  }
  /* puertas de servicio: juntas oscuras y manillas en los costados */
  [-1, 1].forEach(function(s){
    var xs = LH ? [xE0 + 0.9, xE0 + 1.8] : HIT ? [xE0 + 0.85, xE0 + 1.7, xM] : [xE0 + 0.9, xE0 + 1.8];
    xs.forEach(function(x){
      if(x > xCw0 - 0.3) return;
      bloque(null, 0.03, (HIT && x < xM ? C.H1 : Ht) - Ydk - 0.3, 0.02, 'mate', '#1E2124', x, (Ydk + (HIT && x < xM ? C.H1 : Ht)) / 2, s * (A2 - 0.005), 0.005);
      bloque(null, 0.16, 0.04, 0.04, 'cromo', null, x - 0.18, Ydk + 1.0, s * (A2 + 0.01), 0.01);
    });
  });
  /* Volvo: costados grises con el panel amarillo en diagonal */
  if(VOL){
    [-1, 1].forEach(function(s){
      var pv = [[xE0 - 0.05, Ydk + 0.10], [xE0 + 0.75, Ht - 0.04], [xCw0 - 0.95, Ht - 0.04], [xCw0 - 0.05, Ht - 0.04],
                [xCw0 - 0.05, Ydk + 0.85], [xCw0 - 0.75, Ydk + 0.10]];
      perfil(null, pv, 0.03, s * (A2 + 0.005), 'pintura', EXG_VOL_AM, 0.01);
      /* el frente del panel tambien en el bastidor bajo la cabina */
    });
    /* tapa amarilla del capot (franja al frente del techo) */
    bloque(null, 0.5, 0.06, zW * 2, 'pintura', EXG_VOL_AM, xE0 + 0.30, Ht + 0.10, 0, 0.02);
  }
  if(HIT){
    /* faja gris bajo el capot naranja */
    [-1, 1].forEach(function(s){ bloque(null, xCw0 - xE0, 0.20, 0.03, 'pintura', EXG_HIT_GR, (xE0 + xCw0) / 2, Ydk + 0.10, s * (A2 + 0.005), 0.01); });
  }

  /* ═══ techo: escape, prefiltros, baranda ═══ */
  if(LH){
    tubo(null, [xG1 + 0.35, Ht, -0.90], [xG1 + 0.35, Ht + 0.55, -0.90], 0.13, 'metal', '#5E646A', 16);
    var esc = cilindro(null, 0.15, 0.15, 0.32, 'metal', '#5E646A', xG1 + 0.47, Ht + 0.62, -0.90, [0, 0, PI / 2 - 0.5], 16);
    /* prefiltro en cupula, a la izquierda atras */
    cilindro(null, 0.20, 0.20, 0.40, 'pintura', EXG_LH_GR, xCw0 - 0.45, Ht + 0.24, 1.05, null, 20);
    pon(null, new THREE.SphereGeometry(0.34, 22, 12, 0, PI * 2, 0, PI / 2), 'pintura', EXG_LH_GR, xCw0 - 0.45, Ht + 0.44, 1.05);
    cilindro(null, 0.36, 0.36, 0.08, 'pintura', '#6E7479', xCw0 - 0.45, Ht + 0.44, 1.05, null, 22);
  } else if(HIT){
    /* silenciador alto y filtro de aire naranja */
    bloque(null, 0.50, 0.55, 0.65, 'metal', '#55595F', xCw0 - 0.35, Ht + 0.27, -1.20, 0.04);
    tubo(null, [xCw0 - 0.35, Ht + 0.5, -1.20], [xCw0 - 0.35, 5.24, -1.20], 0.13, 'metal', '#55595F', 16);
    cilindro(null, 0.16, 0.13, 0.10, 'mate', '#202326', xCw0 - 0.35, 5.24, -1.20, null, 16);
    cilindro(null, 0.26, 0.26, 0.38, 'pintura', EXG_HIT_NA, xEn - 0.2, Ht + 0.20, 0.95, null, 22);
    cilindro(null, 0.30, 0.30, 0.06, 'pintura', '#C54E12', xEn - 0.2, Ht + 0.42, 0.95, null, 22);
    pon(null, new THREE.SphereGeometry(0.14, 14, 8, 0, PI * 2, 0, PI / 2), 'mate', '#202326', xEn - 0.2, Ht + 0.45, 0.95);
  } else {
    /* tubo de escape curvo y dos prefiltros negros en hongo */
    tubo(null, [xG1 + 0.30, Ht, -0.95], [xG1 + 0.30, 3.80, -0.95], 0.10, 'metal', '#2A2C2F', 14);
    tubo(null, [xG1 + 0.30, 3.80, -0.95], [xG1 + 0.45, 3.93, -0.95], 0.10, 'metal', '#2A2C2F', 14);
    [0.30, 0.80].forEach(function(z){
      cilindro(null, 0.10, 0.10, 0.30, 'mate', '#1C1E21', xE0 + 1.0, Ht + 0.18, z, null, 16);
      cilindro(null, 0.24, 0.24, 0.16, 'mate', '#1C1E21', xE0 + 1.0, 3.95, z, null, 20);
    });
  }
  /* baranda del techo a los dos lados */
  var yBar = Ht + 0.08;
  [-1, 1].forEach(function(s){
    var zb = s * (zW - 0.10);
    D.baranda([[xC0 + 0.25, zb], [xCw0 - 0.10, zb]], yBar, VOL ? 0.70 : 0.95, col.bar);
  });
  if(HIT) D.baranda([[xE0 + 0.2, A2 - 0.15], [xE0 + 0.2, 0.2], [xM - 0.1, 0.2]], C.H1 + 0.08, 0.95, col.bar);

  /* ═══ tanques adelante a la derecha ═══ */
  var zTi = C.zB - C.wB / 2 - 2 * C.rC - 0.15, zTo = -A2 + 0.02, yTt = (HIT ? C.H1 : Ht) - 0.15;
  var xT0 = XF + 0.35, xTm = XF + 0.35 + (xE0 - XF - 0.35) * 0.48;
  var hexTq = VOL ? EXG_VOL_AM : col.cu;
  bloque('TQH1', xTm - xT0 - 0.04, yTt - Ydk, zTi - zTo, 'pintura', hexTq, (xT0 + xTm) / 2, (Ydk + yTt) / 2, (zTi + zTo) / 2, 0.06);
  bloque('TQC1', xE0 - xTm - 0.06, yTt - Ydk, zTi - zTo, 'pintura', hexTq, (xTm + xE0) / 2 - 0.02, (Ydk + yTt) / 2, (zTi + zTo) / 2, 0.06);
  cilindro(null, 0.10, 0.10, 0.10, 'mate', '#1E2124', (xT0 + xTm) / 2, yTt + 0.05, (zTi + zTo) / 2, null, 16);
  cilindro(null, 0.12, 0.12, 0.10, 'mate', '#1E2124', (xTm + xE0) / 2, yTt + 0.05, (zTi + zTo) / 2 - 0.2, null, 16);
  bloque(null, 0.06, 0.45, 0.025, 'vidrio', '#9BB7C9', (xT0 + xTm) / 2, Ydk + 0.7, zTo - 0.01, 0.01);
  /* filtros de retorno y valvula principal entre el tanque y la pluma */
  [0, 0.3].forEach(function(dx){ cilindro('LPH', 0.08, 0.08, 0.35, 'metal', '#6E747A', xTm + dx - 0.2, yTt + 0.18, zTi + 0.02 - 0.2, null, 12); });
  bloque('LPH', 0.70, 0.40, 0.40, 'metal', '#5A6067', XF + C.cabL + 0.40, Ydk + 0.20, C.zB, 0.03);
  /* reductores de giro de pie sobre la plataforma, detras de la pluma */
  [['RG1', 0.55], ['RG2', -0.95]].forEach(function(q){
    var zr = q[1] * C.A / 4.06, xr2 = XF + C.cabL + 0.40 + (q[0] === 'RG1' ? 0.0 : 0.15);
    if(q[0] === 'RG1') zr = Math.min(zr, cabZ0 - 0.25);
    cilindro(q[0], 0.24, 0.26, 0.55, 'metal', '#4A4F55', xr2 + 0.05, Ydk + 0.27, zr, null, 22);
    cilindro(q[0], 0.17, 0.17, 0.35, 'metal', '#6E747A', xr2 + 0.05, Ydk + 0.72, zr, null, 18);
  });

  /* ═══ cabina adelante a la izquierda ═══ */
  var cy0 = Ydk + C.cabElev, cy1 = C.cabC, cx0 = XF + 0.03, cx1 = XF + C.cabL, czm = (cabZ0 + cabZ1) / 2;
  if(C.cabElev > 0.02) bloque(null, cx1 - cx0, C.cabElev, C.cabW, 'pintura', col.base, (cx0 + cx1) / 2, Ydk + C.cabElev / 2, czm, 0.02);
  var yVb = cy0 + 0.30, yVt = cy1 - 0.20;
  bloque('CBN', cx1 - cx0, yVb - cy0, C.cabW, 'pintura', col.cab, (cx0 + cx1) / 2, (cy0 + yVb) / 2, czm, 0.04);
  bloque('CBN', cx1 - cx0 + 0.10, cy1 - yVt, C.cabW + 0.08, 'pintura', col.cabTecho, (cx0 + cx1) / 2 - 0.03, (yVt + cy1) / 2, czm, 0.05);
  /* parante delantero, de la puerta y trasero */
  [[cx0 + 0.04, cabZ0 + 0.04], [cx0 + 0.04, cabZ1 - 0.04], [cx1 - 0.05, cabZ0 + 0.04], [cx1 - 0.05, cabZ1 - 0.04],
   [cx0 + 0.95, cabZ1 - 0.04], [cx0 + 1.05, cabZ0 + 0.04]].forEach(function(q){
    bloque('CBN', 0.09, yVt - yVb + 0.02, 0.09, 'pintura', col.cab, q[0], (yVb + yVt) / 2, q[1], 0.025);
  });
  var vid = function(w, h, d, x, y, z){ return pon(null, new THREE.BoxGeometry(w, h, d), 'vidrio', '#1A2A3A', x, y, z); };
  var hV = yVt - yVb;
  vid(0.03, hV + 0.20, C.cabW - 0.12, cx0 + 0.01, (yVb - 0.20 + yVt) / 2, czm);                          /* parabrisas hasta abajo */
  vid(0.86, hV, 0.03, cx0 + 0.50, (yVb + yVt) / 2, cabZ1 + 0.005);                                       /* puerta */
  vid(cx1 - cx0 - 1.08, hV, 0.03, (cx0 + 1.0 + cx1) / 2, (yVb + yVt) / 2, cabZ1 + 0.005);
  vid(cx1 - cx0 - 0.20, hV, 0.03, (cx0 + cx1) / 2, (yVb + yVt) / 2, cabZ0 - 0.005);                       /* lado de la pluma */
  vid(0.03, hV * 0.60, C.cabW - 0.14, cx1 + 0.005, yVt - hV * 0.30, czm);
  /* limpiaparabrisas, visera, manilla y asideros */
  tubo(null, [cx0 - 0.02, yVb + 0.05, czm - 0.25], [cx0 - 0.02, yVb + 0.75, czm + 0.15], 0.012, 'mate', '#111', 6);
  bloque(null, 0.30, 0.03, C.cabW, 'mate', '#202326', cx0 - 0.12, yVt + 0.02, czm, 0.01);
  bloque(null, 0.16, 0.04, 0.05, 'cromo', null, cx0 + 0.80, yVb + 0.60, cabZ1 + 0.03, 0.01);
  [cx0 - 0.05, cx0 + 1.05].forEach(function(x){ tubo(null, [x, yVb, cabZ1 + 0.08], [x, yVt - 0.1, cabZ1 + 0.08], 0.02, 'pintura', col.bar, 8); });
  /* aire acondicionado y modulos detras de la cabina */
  bloque('AAC', 0.55, 0.85, C.cabW * 0.75, 'pintura', LH ? EXG_LH_GR : col.cab, cx1 + 0.30, cy0 + 0.70, czm, 0.04);
  bloque('EC', 0.40, 0.70, 0.45, 'mate', '#5A6067', cx1 + 0.28, cy0 + 1.50, czm + 0.2, 0.03);
  tubo('HAR', [cx1 + 0.1, Ydk + 0.05, cabZ0 + 0.1], [xCw0 - 0.2, Ydk + 0.05, cabZ0 + 0.1], 0.035, 'goma', '#1E2124', 8);
  /* faros de trabajo en el techo y baliza */
  [-0.30, 0.30].forEach(function(dz){
    bloque(null, 0.14, 0.18, 0.26, 'mate', '#1E2124', cx0 + 0.12, cy1 + 0.10, czm + dz, 0.03);
    bloque('LSM', 0.03, 0.12, 0.20, 'vidrio', '#F4EDCF', cx0 + 0.04, cy1 + 0.10, czm + dz, 0.01);
  });
  if(C.g8){
    /* barra de faros LED y camaras Skyview */
    bloque(null, 0.10, 0.10, C.cabW * 0.8, 'mate', '#1E2124', cx0 - 0.02, cy1 + 0.24, czm, 0.02);
    bloque('LSM', 0.02, 0.05, C.cabW * 0.72, 'vidrio', '#F8F4E4', cx0 - 0.08, cy1 + 0.24, czm, 0.01);
    [[C.D * 0.96, A2 * 0.6], [C.D * 0.96, -A2 * 0.6], [XF + 0.2, -A2 + 0.1], [xCw0, A2 + 0.03], [xCw0, -A2 - 0.03]].forEach(function(q){
      bloque(null, 0.14, 0.12, 0.12, 'mate', '#16181B', q[0], (q[0] > C.D * 0.9 ? C.yCw : Ht) + 0.08, q[1], 0.02);
    });
  }
  var bal = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 10, 0, PI * 2, 0, PI / 2),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4, roughness: 0.3 }));
  bal.position.set(cx1 - 0.25, cy1 + 0.01, cabZ1 - 0.25); MG.add(bal);
  /* rejilla FOPS al frente y arriba (R 980) */
  if(C.fops){
    var lF = [];
    for(var fz = cabZ0 + 0.12; fz < cabZ1 - 0.05; fz += 0.14) lF.push([cx0 - 0.16, (yVb + yVt) / 2, fz]);
    inst(null, new THREE.BoxGeometry(0.04, hV + 0.15, 0.04), 'pintura', '#2A2D31', lF);
    [yVb - 0.05, yVt + 0.05].forEach(function(y){ bloque(null, 0.10, 0.08, C.cabW, 'pintura', '#2A2D31', cx0 - 0.16, y, czm, 0.02); });
    var lF2 = [];
    for(var fx = cx0 + 0.15; fx < cx1; fx += 0.16) lF2.push([fx, cy1 + 0.12, czm]);
    inst(null, new THREE.BoxGeometry(0.04, 0.04, C.cabW), 'pintura', '#2A2D31', lF2);
  }

  /* ═══ pasarelas, plataforma de la cabina, barandas y acceso ═══ */
  var yPs = Ydk - 0.04;
  var pasarela = function(x0, x1, zi, zo){
    bloque(null, x1 - x0, 0.05, Math.abs(zo - zi), 'metal', col.pas, (x0 + x1) / 2, yPs, (zi + zo) / 2, 0.01);
    var l = [];
    for(var x = x0 + 0.15; x < x1 - 0.05; x += 0.30) l.push([x, yPs + 0.03, (zi + zo) / 2]);
    inst(null, new THREE.BoxGeometry(0.03, 0.02, Math.abs(zo - zi) - 0.04), 'metal', '#3E4246', l);
    /* mensulas bajo la pasarela */
    for(var xm = x0 + 0.3; xm < x1; xm += 1.4) bloque(null, 0.08, 0.30, Math.abs(zo - zi), 'pintura', col.base, xm, yPs - 0.17, (zi + zo) / 2, 0.01);
  };
  var xPf = xCw0 + 0.1;
  if(C.pasIzq){
    var zoI = A2 + C.pasIzq, xPl1 = XF + C.cabL + 0.35;
    if(C.platCab){
      var zoP = A2 + C.platCab;
      pasarela(XF + 0.05, xPl1, A2, zoP);
      pasarela(xPl1, xPf, A2, zoI);
      var bI = C.acceso === 'gradas'
        ? [[XF + 0.15, A2 + 0.05], [XF + 0.15, zoP - 0.05], [xPl1 - 0.70, zoP - 0.05]]
        : [[XF + 0.15, A2 + 0.05], [XF + 0.15, zoP - 0.05], [xPl1 - 0.05, zoP - 0.05], [xPl1 - 0.05, zoI - 0.05]];
      D.baranda(bI, yPs, 1.05, col.bar, col.rodapie);
      D.baranda([[xPl1 + (C.acceso === 'escalera' ? 0.85 : 0.10), zoI - 0.05], [xPf - 0.1, zoI - 0.05]], yPs, 1.05, col.bar, col.rodapie);
    } else {
      pasarela(XF + 0.05, xPf, A2, zoI);
      D.baranda([[XF + 0.15, A2 + 0.05], [XF + 0.15, zoI - 0.05], [xPl1 - 0.2, zoI - 0.05]], yPs, 1.05, col.bar, col.rodapie);
      D.baranda([[xPl1 + 0.75, zoI - 0.05], [xPf - 0.1, zoI - 0.05]], yPs, 1.05, col.bar, col.rodapie);
    }
    /* el acceso desde el suelo: siempre por fuera de la oruga */
    var zOr = C.S / 2 + C.N / 2 + 0.10;
    if(C.acceso === 'escalera'){
      var xl = xPl1 + 0.40, zl = Math.max(zoI - 0.25, zOr + 0.05);
      escaleraZ(xl, zl, 0.45, yPs + 0.02, 0.55, col.bar);
      [-1, 1].forEach(function(s){ tubo(null, [xl + s * 0.30, yPs, zl], [xl + s * 0.30, yPs + 1.0, zl], 0.025, 'pintura', col.bar, 8); });
    } else if(C.acceso === 'gradas'){
      /* escalera de 45 grados que baja desde la plataforma hacia atras */
      var zs = A2 + C.platCab - 0.40, xs0 = xPl1 - 0.55, nG = Math.round((yPs - 0.45) / 0.24), run = (yPs - 0.45);
      [-1, 1].forEach(function(s){
        tubo(null, [xs0, yPs, zs + s * 0.33], [xs0 + run, 0.45, zs + s * 0.33], 0.05, 'pintura', col.bar, 10);
        tubo(null, [xs0 - 0.05, yPs + 1.0, zs + s * 0.38], [xs0 + run, 1.40, zs + s * 0.38], 0.026, 'pintura', col.bar, 8);
        tubo(null, [xs0 + run, 0.45, zs + s * 0.38], [xs0 + run, 1.40, zs + s * 0.38], 0.026, 'pintura', col.bar, 8);
      });
      var lG = [];
      for(var ig = 1; ig <= nG; ig++){ var f = ig / (nG + 0.5); lG.push([xs0 + run * f, yPs - (yPs - 0.45) * f, zs]); }
      inst(null, new THREE.BoxGeometry(0.24, 0.035, 0.62), 'metal', '#5A5F66', lG);
    } else if(C.acceso === 'inclinada'){
      var xi = xPl1 + 0.30, zi = Math.max(zoI - 0.28, zOr + 0.05), dxI = 0.55;
      [-1, 1].forEach(function(s){ tubo(null, [xi, yPs, zi + s * 0.28], [xi + dxI, 0.45, zi + s * 0.28], 0.04, 'pintura', col.bar, 8); });
      var lI = [];
      for(var k2 = 1; k2 < 7; k2++){ var f2 = k2 / 7; lI.push([xi + dxI * f2, yPs - (yPs - 0.45) * f2, zi]); }
      inst(null, new THREE.BoxGeometry(0.16, 0.035, 0.54), 'metal', '#5A5F66', lI);
      [-1, 1].forEach(function(s){ tubo(null, [xi - 0.05, yPs + 1.0, zi + s * 0.32], [xi + dxI, 1.5, zi + s * 0.32], 0.025, 'pintura', col.bar, 8); });
    } else {
      /* peldanos: uno sobre la oruga y asideros hasta la plataforma */
      var xp = XF + C.cabL + 0.45;
      bloque(null, 0.40, 0.05, 0.30, 'metal', '#5A5F66', xp, Pc + 0.35, C.S / 2 + 0.05, 0.01);
      tubo(null, [xp - 0.25, Pc + 0.40, C.S / 2 + 0.18], [xp - 0.25, yPs, C.S / 2 + 0.18], 0.03, 'pintura', col.bar, 8);
      tubo(null, [xp - 0.25, yPs, zoI - 0.05], [xp - 0.25, yPs + 1.0, zoI - 0.05], 0.025, 'pintura', col.bar, 8);
    }
  }
  if(C.pasDer){
    var zoD = -A2 - C.pasDer;
    pasarela(XF + 0.05, xPf, -A2, zoD);
    D.baranda([[XF + 0.15, -A2 - 0.05], [XF + 0.15, zoD + 0.05], [xPf - 0.1, zoD + 0.05]], yPs, 1.05, col.bar, col.rodapie);
  }
  /* sistema contra incendio (botellas rojas) y engrase centralizado en la pasarela izquierda */
  /* botellas detras de la cabina; la estacion de engrase atras, cerca del contrapeso */
  var xSC = XF + C.cabL + 0.22, zSC = A2 + 0.20, xSE = xCw0 - 0.55;
  [0, 0.26].forEach(function(dx){ cilindro('SCI', 0.11, 0.11, 0.75, 'pintura', '#C62A1E', xSC + dx, yPs + 0.40, zSC, null, 16); });
  tubo('SCI', [xSC + 0.13, yPs + 0.80, zSC], [xSC + 0.9, Ht - 0.1, A2 - 0.05], 0.018, 'mate', '#B22A1E', 6);
  bloque('SEN', 0.55, 0.70, 0.38, 'pintura', LH ? EXG_LH_GR : '#5A6067', xSE, yPs + 0.38, zSC + 0.02, 0.04);
  cilindro('GP1', 0.12, 0.12, 0.45, 'metal', '#6E747A', xSE, yPs + 0.95, zSC + 0.02, null, 14);
  tubo('SEN', [xSE - 0.25, yPs + 0.2, zSC - 0.1], [XF + C.cabL + 0.6, yPs + 0.2, A2 + 0.05], 0.02, 'goma', '#22262B', 6);
  tubo('SEN', [XF + C.cabL + 0.6, yPs + 0.2, A2 + 0.05], [XF + C.cabL * 0.78, Ydk + 0.6, C.zB + C.wB / 2 + 0.1], 0.02, 'goma', '#22262B', 6);
  /* faros del frente de la plataforma */
  [cabZ0 - 0.25, zTi - 0.3].forEach(function(z){ D.faro('LSM', XF - 0.06, Ydk - 0.20, z, 0.10); });

  /* ══════════ EQUIPO DE TRABAJO: pluma, brazo, cucharon ══════════ */
  var sc = C.sc, zB = C.zB, Lb = C.Lb, Ls = C.Ls, wB = C.wB;
  var sb = Math.sqrt((C.cap / C.W) / (7.0 / 2.4));
  var xBF = XF + C.cabL * 0.78, yBF = Ydk + 0.78 * sc;
  var kn = 0.21 * Lb, hF = 0.92 * sc, hK = 1.50 * sc, hT = 0.82 * sc;
  var spine = new THREE.CatmullRomCurve3([[0, 0], [-0.12 * Lb, 0.45 * kn], [-0.30 * Lb, 0.90 * kn], [-0.42 * Lb, kn],
    [-0.60 * Lb, 0.83 * kn], [-0.80 * Lb, 0.44 * kn], [-Lb, 0]].map(function(v){ return new THREE.Vector3(v[0], v[1], 0); }));
  var hAt = function(t){
    var s = function(u){ return u * u * (3 - 2 * u); };
    return t < 0.42 ? hF + (hK - hF) * s(t / 0.42) : hK + (hT - hK) * s((t - 0.42) / 0.58);
  };
  var esp = function(t){ var q = spine.getPoint(t), tg = spine.getTangent(t); return { x: q.x, y: q.y, nx: tg.y, ny: -tg.x, h: hAt(t) }; };
  var bordeB = function(t, f){ var e = esp(t); return [e.x + e.nx * e.h / 2 * f, e.y + e.ny * e.h / 2 * f]; };
  var fB = function(x){ return 1 - 0.16 * Math.min(1, Math.max(0, -x / Lb)); };   /* angostamiento hacia la punta */
  var wBt = wB * fB(-Lb);
  /* ── el brazo: perfil con la palanca atras, para el cilindro del brazo ── */
  var wS = wBt + 0.26;
  var sPts = [[0.70, 1.22], [1.12, 1.02], [1.05, 0.55], [0.55, -0.52], [-0.6, -0.55], [-Ls / sc + 0.40, -0.34], [-Ls / sc - 0.16, -0.20],
    [-Ls / sc - 0.22, 0.12], [-Ls / sc + 0.20, 0.34], [-Ls / sc + 0.75, 0.42], [-0.6, 0.66], [0.05, 0.90], [0.30, 1.10]].map(function(q){ return [q[0] * sc, q[1] * sc]; });
  var pPal = [0.86 * sc, 1.02 * sc];          /* pasador del cilindro del brazo */
  var pBaseK = [-0.05 * sc, 0.98 * sc];       /* base del cilindro del cucharon */
  var pQ = [-Ls + 0.72 * sc, 0.36 * sc];      /* pasador de la biela guia */
  /* ── cucharon (marco propio con el pasador del brazo en el origen; mira hacia -Y) ── */
  var bPts = [[-0.25, -0.55], [-0.15, -0.20], [-0.20, 0.30], [-0.45, 0.75], [-1.00, 0.95], [-1.60, 0.85], [-2.05, 0.40],
    [-2.20, -0.30], [-2.00, -0.90], [-1.75, -1.40]].map(function(q){ return [q[0] * sb, q[1] * sb]; });
  /* la espalda y el fondo del cucharon son curvos: se suaviza el contorno */
  var curB = new THREE.CatmullRomCurve3(bPts.map(function(q){ return new THREE.Vector3(q[0], q[1], 0); }), false, 'centripetal');
  var bSuave = [];
  for(var ib = 0; ib <= 26; ib++){ var vb = curB.getPoint(ib / 26); bSuave.push([vb.x, vb.y]); }
  var pBk = [0.05 * sb, 0.45 * sb];           /* pasador de la biela del cucharon */
  var lg = 0.95 * sc, lb = 0.80 * sb;
  var dirL = [bPts[9][0] - bPts[8][0], bPts[9][1] - bPts[8][1]], nl = Math.hypot(dirL[0], dirL[1]);
  dirL = [dirL[0] / nl, dirL[1] / nl];
  var pT = [bPts[9][0] + dirL[0] * 0.42 * sb, bPts[9][1] + dirL[1] * 0.42 * sb];   /* punta de los dientes */

  /* ── cinematica: se busca el angulo de pluma que deja los dientes a ras del suelo ── */
  var aMundo = function(fr, q){ var c = Math.cos(fr.ang), s = Math.sin(fr.ang); return [fr.x + q[0] * c - q[1] * s, fr.y + q[0] * s + q[1] * c]; };
  var beta = C.beta * PI / 180, thS = Math.atan2(-Math.sin(beta), -Math.cos(beta));
  var pose = function(al){
    var fb = { x: xBF, y: yBF, ang: -al };
    var tip = aMundo(fb, [-Lb, 0]);
    var fs = { x: tip[0], y: tip[1], ang: thS };
    var bk = aMundo(fs, [-Ls, 0]);
    var fc = { x: bk[0], y: bk[1], ang: thS + C.phi };
    var low = 99, xmin = 99;
    bPts.concat([pT]).forEach(function(q){ var w = aMundo(fc, q); low = Math.min(low, w[1]); xmin = Math.min(xmin, w[0]); });
    return { fb: fb, fs: fs, fc: fc, low: low, xmin: xmin };
  };
  var a0p = -0.3, a1p = 1.0, ps;
  for(var it = 0; it < 40; it++){ var am = (a0p + a1p) / 2; ps = pose(am); if(ps.low < 0.12) a0p = am; else a1p = am; }
  ps = pose(a1p);
  var fb = ps.fb, fs = ps.fs, fc = ps.fc;

  /* ── pluma ── */
  var hexP = col.pluma;
  sub(fb.x, fb.y, fb.ang, function(){
    var NS = 30, top = [], bot = [];
    for(var i = 0; i <= NS; i++){ top.push(bordeB(i / NS, 1)); bot.push(bordeB(i / NS, -1)); }
    var g = geoPerfilB(top.concat(bot.reverse()), wB, zB, 0.05);
    exgAhusar(g, fB, zB);
    pon(null, g, 'pintura', hexP);
    /* cantoneras de las placas laterales: franjas un tono mas oscuro arriba y abajo */
    [1, -1].forEach(function(lado){
      var l = [];
      for(var j = 2; j <= NS - 2; j++){ var t = j / NS, q = bordeB(t, lado * 0.88); l.push([q[0], q[1]]); }
      for(j = NS - 2; j >= 2; j--){ var t2 = j / NS, q2 = bordeB(t2, lado * 0.76); l.push([q2[0], q2[1]]); }
      [1, -1].forEach(function(s){
        var gp = geoPerfilB(l, 0.03, zB + s * wB / 2, 0.01);
        exgAhusar(gp, fB, zB);
        pon(null, gp, 'pintura', LH ? '#D6D4CC' : HIT ? '#D45A1A' : '#3A3D41');
      });
    });
    /* jefes de los pasadores en el pie y en la punta */
    cilindro(null, hF * 0.50, hF * 0.50, wB + 0.10, 'pintura', hexP, 0, 0, zB, [PI / 2, 0, 0], 28);
    cilindro('PYB', 0.17 * sc, 0.17 * sc, wB + 0.70, 'metal', '#4A4F55', 0, 0, zB, [PI / 2, 0, 0], 18);
    cilindro(null, hT * 0.48, hT * 0.48, wBt + 0.06, 'pintura', hexP, -Lb, 0, zB, [PI / 2, 0, 0], 28);
    /* orejas del cilindro del brazo arriba, cerca del codo */
    var eS = esp(0.34), tS2 = bordeB(0.34, 1);
    [-1, 1].forEach(function(s){
      perfil(null, [[tS2[0] + 0.45, tS2[1] - 0.05], [tS2[0] - 0.40, tS2[1] - 0.05], [tS2[0] + eS.nx * 0.40, tS2[1] + eS.ny * 0.40]],
        0.09, zB + s * 0.30 * sc, 'pintura', hexP, 0.02);
    });
    /* ojos de los cilindros de pluma en los costados */
    var eB = esp(0.36);
    [-1, 1].forEach(function(s){
      cilindro(null, 0.20 * sc, 0.20 * sc, C.rC + 0.10, 'pintura', hexP, eB.x - eB.nx * eB.h * 0.20, eB.y - eB.ny * eB.h * 0.20,
        zB + s * (wB * fB(eB.x) / 2 + (C.rC + 0.10) / 2), [PI / 2, 0, 0], 20);
    });
    /* mangueras sobre la pluma */
    [-0.22, -0.08, 0.10, 0.24].forEach(function(dz, k){
      var pts = [];
      for(var j = 1; j <= 10; j++){ var t = 0.03 + 0.94 * j / 10, e = esp(t); pts.push(new THREE.Vector3(e.x + e.nx * (e.h / 2 + 0.06 + k * 0.012), e.y + e.ny * (e.h / 2 + 0.06 + k * 0.012), zB + dz * sc)); }
      pts.unshift(new THREE.Vector3(0.35, 0.40 * sc, zB + dz * sc));
      pon('LPH', new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.04, 8, false), 'goma', '#1C1E21');
    });
    /* abrazaderas de las mangueras */
    for(var c = 1; c < 6; c++){
      var ec = esp(c / 6);
      bloque(null, 0.08, 0.06, 0.62 * sc, 'metal', '#5A5F66', ec.x + ec.nx * (ec.h / 2 + 0.11), ec.y + ec.ny * (ec.h / 2 + 0.11), zB, 0.01, [0, 0, Math.atan2(ec.ny, ec.nx) - PI / 2]);
    }
    /* faros en la pluma */
    var eL = esp(0.16);
    [-1, 1].forEach(function(s){
      var zl = zB + s * (wB * fB(eL.x) / 2 + 0.12);
      bloque(null, 0.24, 0.18, 0.16, 'mate', '#1E2124', eL.x, eL.y, zl, 0.02);
      bloque('LSM', 0.03, 0.12, 0.12, 'vidrio', '#F4EDCF', eL.x - 0.13, eL.y, zl, 0.01);
    });
    /* marca en los dos costados de la pluma, despues del codo */
    var eM = esp(0.62);
    var texM = LH ? texRotulo3d(exgDibLiebherr('#16181B'), 1024, 160)
             : HIT ? texRotulo3d(exgDibTexto('HITACHI', '#FFFFFF', 'bold %px "Arial Black", Arial, sans-serif', 1.0), 1024, 170)
             : texRotulo3d(exgDibVolvo('#F2F2F0'), 1024, 190);
    var anchoM = 2.35 * sc, altoM = anchoM * (LH ? 0.156 : HIT ? 0.166 : 0.185);
    var zm = wB * fB(eM.x) / 2 + 0.035;
    [1, -1].forEach(function(s){
      var m = cartel(texM, anchoM, altoM, eM.x, eM.y + eM.ny * 0.04, zB + s * zm, s > 0 ? 0 : PI);
      /* se lee del pie hacia la punta mirando de cada lado, con la parte alta hacia arriba */
      m.rotation.z = s > 0 ? Math.atan2(-eM.nx, eM.ny) : Math.atan2(eM.nx, eM.ny);
    });
  });

  /* ── brazo ── */
  sub(fs.x, fs.y, fs.ang, function(){
    var fS = function(x){ return 1 - 0.18 * Math.min(1, Math.max(0, -x / Ls)); };
    var g = geoPerfilB(sPts, wS, zB, 0.05);
    exgAhusar(g, fS, zB);
    pon(null, g, 'pintura', hexP);
    /* placas de desgaste abajo y jefes */
    var gW = geoPerfilB([[-0.5 * sc, -0.54 * sc], [-Ls + 0.4 * sc, -0.33 * sc], [-Ls + 0.4 * sc, -0.42 * sc], [-0.5 * sc, -0.64 * sc]], wS * 0.86, zB, 0.02);
    exgAhusar(gW, fS, zB);
    pon(null, gW, 'metal', '#5A5F66');
    cilindro(null, 0.42 * sc, 0.42 * sc, wS + 0.06, 'pintura', hexP, 0, 0, zB, [PI / 2, 0, 0], 28);
    cilindro('PYB', 0.15 * sc, 0.15 * sc, wS + 0.30, 'metal', '#4A4F55', 0, 0, zB, [PI / 2, 0, 0], 18);
    cilindro(null, 0.27 * sc, 0.27 * sc, wS * fS(-Ls) + 0.06, 'pintura', hexP, -Ls, 0, zB, [PI / 2, 0, 0], 24);
    cilindro(null, 0.19 * sc, 0.19 * sc, wS + 0.16, 'metal', '#4A4F55', pPal[0], pPal[1], zB, [PI / 2, 0, 0], 16);
    cilindro(null, 0.17 * sc, 0.17 * sc, wS * fS(pQ[0]) + 0.22, 'metal', '#4A4F55', pQ[0], pQ[1], zB, [PI / 2, 0, 0], 16);
    /* mangueras del cilindro del cucharon */
    [-0.15, 0.15].forEach(function(dz){ tubo('LPH', [0.35 * sc, 1.02 * sc, zB + dz], [-0.9 * sc, 0.80 * sc, zB + dz], 0.035, 'goma', '#1C1E21', 8); });
  });

  /* ── cucharon ── */
  sub(fc.x, fc.y, fc.ang, function(){
    var W2 = C.W / 2, hexC = col.cuch;
    /* placas laterales con su refuerzo */
    [-1, 1].forEach(function(s){
      perfil('LPN', bSuave, 0.07, zB + s * (W2 - 0.035), 'mate', hexC, 0.015);
      /* refuerzo en el canto de la placa lateral */
      var ref = [], refI = [];
      for(var kr = 3; kr <= 24; kr++){
        var q = bSuave[kr];
        ref.push([q[0] * 0.995, q[1] * 0.995]); refI.push([q[0] * 0.90 - 0.05 * sb, q[1] * 0.90 - 0.02 * sb]);
      }
      perfil(null, ref.concat(refI.reverse()), 0.05, zB + s * (W2 + 0.02), 'mate', '#45484C', 0.01);
      var lab = [bPts[9], bPts[0]], dl = [lab[1][0] - lab[0][0], lab[1][1] - lab[0][1]];
      var cl = Math.hypot(dl[0], dl[1]);
      /* cuchilla lateral en el borde de la boca */
      var mC = bloque('GET', cl * 0.55, 0.09, 0.10, 'metal', '#3E4246', lab[0][0] + dl[0] * 0.28, lab[0][1] + dl[1] * 0.28, zB + s * (W2 + 0.02), 0.02,
        [0, 0, Math.atan2(dl[1], dl[0])]);
    });
    /* envolvente: de la boca arriba, por la espalda y el fondo, hasta el labio */
    var cur = bSuave, inn = [];
    for(var i = 0; i < cur.length; i++){
      var a = cur[Math.max(0, i - 1)], b = cur[Math.min(cur.length - 1, i + 1)];
      var tx = b[0] - a[0], ty = b[1] - a[1], tl = Math.hypot(tx, ty);
      inn.push([cur[i][0] - ty / tl * 0.08, cur[i][1] + tx / tl * 0.08]);
    }
    perfil('LPN', cur.concat(inn.reverse()), C.W - 0.10, zB, 'mate', hexC, 0.02);
    /* placas de desgaste del fondo, apoyadas sobre la envolvente */
    [[15, 18], [18, 21], [21, 24]].forEach(function(r){
      var q0 = bSuave[r[0]], q1 = bSuave[r[1]], tx = q1[0] - q0[0], ty = q1[1] - q0[1], ln = Math.hypot(tx, ty);
      bloque('GET', ln * 0.92, 0.05, C.W * 0.86, 'metal', '#4A4E52', (q0[0] + q1[0]) / 2 + ty / ln * 0.035, (q0[1] + q1[1]) / 2 - tx / ln * 0.035, zB, 0.015,
        [0, 0, Math.atan2(ty, tx)]);
    });
    /* labio, adaptadores y dientes */
    var lab0 = bPts[9], aL = Math.atan2(dirL[1], dirL[0]);
    bloque('LPN', 0.30 * sb, 0.14, C.W - 0.04, 'metal', '#4A4E52', lab0[0] - dirL[0] * 0.06, lab0[1] - dirL[1] * 0.06, zB, 0.02, [0, 0, aL]);
    var nd = C.dientes, lA = [], lDn = [], lPr = [];
    for(var d = 0; d < nd; d++){
      var z = zB - W2 + 0.22 + (C.W - 0.44) * d / (nd - 1);
      lA.push([lab0[0] + dirL[0] * 0.08 * sb, lab0[1] + dirL[1] * 0.08 * sb, z, 0, 0, aL]);
      lDn.push([lab0[0] + dirL[0] * 0.30 * sb, lab0[1] + dirL[1] * 0.30 * sb, z, 0, 0, aL]);
      if(d < nd - 1) lPr.push([lab0[0] + dirL[0] * 0.05, lab0[1] + dirL[1] * 0.05, z + (C.W - 0.44) / (nd - 1) / 2, 0, 0, aL]);
    }
    inst('GET', new THREE.BoxGeometry(0.34 * sb, 0.20, 0.17), 'metal', '#3E4246', lA);
    var gD = new THREE.BoxGeometry(0.28 * sb, 0.16, 0.15), pd = gD.attributes.position;
    for(var v = 0; v < pd.count; v++) if(pd.getX(v) > 0){ pd.setY(v, pd.getY(v) * 0.25); pd.setZ(v, pd.getZ(v) * 0.75); }
    gD.computeVertexNormals();
    inst('GET', gD, 'metal', '#C9A227', lDn);
    inst('GET', new THREE.BoxGeometry(0.18, 0.07, 0.20), 'metal', '#3E4246', lPr);
    /* orejas de los pasadores arriba, por fuera del brazo */
    var zO = wS * 0.82 / 2 + 0.06;
    [-1, 1].forEach(function(s){
      perfil(null, [[-0.40 * sb, -0.30 * sb], [0.17 * sb, -0.16 * sb], [0.24 * sb, 0.45 * sb], [0.06 * sb, 0.64 * sb], [-0.55 * sb, 0.78 * sb]],
        0.10, zB + s * zO, 'pintura', hexC, 0.02);
    });
    cilindro('PYB', 0.15 * sc, 0.15 * sc, zO * 2 + 0.20, 'metal', '#4A4F55', 0, 0, zB, [PI / 2, 0, 0], 18);
    cilindro('PYB', 0.14 * sc, 0.14 * sc, zO * 2 + 0.20, 'metal', '#4A4F55', pBk[0], pBk[1], zB, [PI / 2, 0, 0], 18);
  });

  /* ── cilindros, bielas y pasadores en coordenadas del mundo ── */
  var w3 = function(fr, q, z){ var w = aMundo(fr, q); return [w[0], w[1], z]; };
  var hexCil = col.cil;
  /* dos cilindros de pluma, desde el frente de la plataforma a los costados de la pluma */
  var eB = esp(0.36), pB = [eB.x - eB.nx * eB.h * 0.20, eB.y - eB.ny * eB.h * 0.20];
  var xBC = XF + 0.18, yBC = K + 0.30;
  [-1, 1].forEach(function(s){
    var zc = zB + s * (wB * fB(pB[0]) / 2 + C.rC + 0.10);
    D.cilHidD('PHY', [xBC, yBC, zc], w3(fb, pB, zc), C.rC, hexCil, 0.52);
    /* orejas al frente de la plataforma */
    [-1, 1].forEach(function(k){
      perfil(null, [[xBC + 0.55, K + 0.02], [xBC + 0.55, Ydk - 0.02], [xBC - 0.05, yBC + 0.30], [xBC - 0.28, yBC], [xBC - 0.05, K + 0.02]],
        0.07, zc + k * (C.rC + 0.07), 'pintura', col.base, 0.015);
    });
    cilindro('PYB', 0.11, 0.11, 2 * C.rC + 0.30, 'metal', '#4A4F55', xBC, yBC, zc, [PI / 2, 0, 0], 14);
  });
  /* torres del pie de la pluma */
  [-1, 1].forEach(function(s){
    perfil(null, [[xBF - 0.75, Ydk - 0.02], [xBF + 0.85, Ydk - 0.02], [xBF + 0.40, yBF + 0.30], [xBF - 0.25, yBF + 0.42], [xBF - 0.55, yBF]],
      0.12, zB + s * (wB / 2 + 0.12), 'pintura', col.base, 0.02);
  });
  /* cilindro del brazo arriba de la pluma */
  var eS = esp(0.34), tS2 = bordeB(0.34, 1), pSb = [tS2[0] + eS.nx * 0.30, tS2[1] + eS.ny * 0.30];
  D.cilHidD('PSK', w3(fb, pSb, zB), w3(fs, pPal, zB), C.rS, hexCil, 0.55);
  /* bielas: guia en el brazo, del cucharon al ojo del vastago */
  var Qw = aMundo(fs, pQ), Bw = aMundo(fc, pBk), dQB = Math.hypot(Bw[0] - Qw[0], Bw[1] - Qw[1]);
  var Jw;
  if(dQB < lg + lb && dQB > Math.abs(lg - lb)){
    var aa = (lg * lg - lb * lb + dQB * dQB) / (2 * dQB), hh = Math.sqrt(Math.max(0, lg * lg - aa * aa));
    var ux = (Bw[0] - Qw[0]) / dQB, uy = (Bw[1] - Qw[1]) / dQB, mx = Qw[0] + ux * aa, my = Qw[1] + uy * aa;
    var J1 = [mx - uy * hh, my + ux * hh], J2 = [mx + uy * hh, my - ux * hh];
    /* la que queda del lado del cilindro (lado +Y del brazo) */
    var nS = [-Math.sin(fs.ang), Math.cos(fs.ang)];
    Jw = ((J1[0] - Qw[0]) * nS[0] + (J1[1] - Qw[1]) * nS[1]) > ((J2[0] - Qw[0]) * nS[0] + (J2[1] - Qw[1]) * nS[1]) ? J1 : J2;
  } else {
    Jw = [(Qw[0] + Bw[0]) / 2 - Math.sin(fs.ang) * 0.4, (Qw[1] + Bw[1]) / 2 + Math.cos(fs.ang) * 0.4];
  }
  var zL = wS * 0.82 / 2 + 0.06 + 0.08;
  [-1, 1].forEach(function(s){
    var z = zB + s * zL;
    tubo('PYB', [Qw[0], Qw[1], z], [Jw[0], Jw[1], z], 0.11 * sc, 'pintura', hexP, 14);
    tubo('PYB', [Bw[0], Bw[1], z + s * 0.08], [Jw[0], Jw[1], z + s * 0.08], 0.13 * sc, 'pintura', LH ? hexP : col.cuch, 14);
  });
  cilindro('PYB', 0.13 * sc, 0.13 * sc, zL * 2 + 0.30, 'metal', '#4A4F55', Jw[0], Jw[1], zB, [PI / 2, 0, 0], 16);
  D.cilHidD('PHY', w3(fs, pBaseK, zB), [Jw[0], Jw[1], zB], C.rK, hexCil, 0.55);
  /* manguera que pasa de la pluma al brazo */
  [-0.18, 0.18].forEach(function(dz){
    var a = aMundo(fb, bordeB(0.94, 1.25)), b = aMundo(fs, [0.10 * sc, 1.00 * sc]), m = [(a[0] + b[0]) / 2 + 0.12, Math.max(a[1], b[1]) + 0.12];
    pon('LPH', new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(a[0], a[1], zB + dz), new THREE.Vector3(m[0], m[1], zB + dz * 1.6),
      new THREE.Vector3(b[0], b[1], zB + dz)]), 20, 0.04, 8, false), 'goma', '#1C1E21');
  });

  /* lineas de aceite a lo largo de las camisas de los cilindros */
  var linea = function(a, b, dz, parte){
    var p = parte || 0.5, m = [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p];
    tubo('LPH', [a[0] + (b[0] - a[0]) * 0.08, a[1] + (b[1] - a[1]) * 0.08 + 0.05, a[2] + dz], [m[0], m[1] + 0.05, a[2] + dz], 0.028, 'metal', '#5A5F66', 8);
  };
  [-1, 1].forEach(function(s){
    var zc = zB + s * (wB * fB(pB[0]) / 2 + C.rC + 0.10), bb = w3(fb, pB, zc);
    linea([xBC, yBC, zc], bb, s * (C.rC + 0.03), 0.5);
  });
  linea(w3(fb, pSb, zB), w3(fs, pPal, zB), C.rS + 0.03, 0.53);
  linea(w3(fs, pBaseK, zB), [Jw[0], Jw[1], zB], C.rK + 0.03, 0.53);
  /* espejos: en la baranda delantera izquierda y sobre el tanque derecho */
  [[XF + 0.15, A2 + (C.platCab || C.pasIzq || 0.3) - 0.10, yPs + 1.05], [XF + 0.40, zTo + 0.10, yTt]].forEach(function(q){
    tubo(null, [q[0], q[2], q[1]], [q[0] - 0.15, q[2] + 0.45, q[1]], 0.025, 'pintura', col.bar, 8);
    bloque(null, 0.07, 0.48, 0.30, 'mate', '#16181B', q[0] - 0.17, q[2] + 0.70, q[1], 0.03);
    bloque(null, 0.02, 0.42, 0.25, 'cromo', null, q[0] - 0.21, q[2] + 0.70, q[1], 0.005);
  });
  /* faros de trabajo en el frente del cuarto de maquinas */
  [-1, 1].forEach(function(s){ D.faro('LSM', xE0 - 0.10, (HIT ? C.H1 : Ht) - 0.22, s > 0 ? cabZ0 - 0.20 : zTi + 0.15, 0.09); });

  /* ══════════ ROTULOS ══════════ */
  if(LH){
    var texN = texRotulo3d(exgDibNumLH(C.modelo, clave === 'R980' ? 'SME' : (C.g8 ? 'G8' : null)), 512, 128);
    var wN = clave === 'R980' ? 1.20 : 1.60;
    cartel(texN, wN, wN * 0.25, xE0 + 1.25, Ydk + 1.25, A2 + 0.012, 0);
    cartel(texN, wN, wN * 0.25, clave !== 'R980' ? xCw0 - 3.0 : xE0 + 1.3, Ydk + 1.05, -A2 - 0.012, PI);
    if(clave === 'R980'){
      /* la franja gris que corre por los costados del R 980 */
      [-1, 1].forEach(function(s){
        perfil(null, [[xE0 - 0.2, Ydk + 0.55], [xCw0 + 0.6, Ydk + 0.95], [xCw0 + 0.6, Ydk + 1.12], [xE0 - 0.2, Ydk + 0.70]], 0.02, s * (A2 + 0.008), 'pintura', '#4A4E54', 0.005);
      });
    }
  } else if(HIT){
    var texEX = texRotulo3d(exgDibEX('EX1200', '#F2F2F0'), 512, 110);
    cartel(texEX, 1.10, 0.24, XF - 0.012, (K + Ydk) / 2, czm, -PI / 2);
    cartel(texEX, 1.10, 0.24, xE0 + 0.40, (K + Ydk) / 2, A2 + 0.012, 0);
    var texHc = texRotulo3d(exgDibTexto('HITACHI', '#F4F4F2', 'bold %px "Arial Black", Arial, sans-serif', 1.0), 1024, 170);
    cartelCurvo(texHc, C.D + 0.012, 0.42, (K + C.yCw) / 2 + 0.25, 0.62);
  } else {
    var texVc = texRotulo3d(exgDibVolvo('#F2F2F0'), 1024, 190);
    cartelCurvo(texVc, C.D + 0.012, 0.36, C.yCw - 0.55, 0.42);
    var texEC = texRotulo3d(exgDibTexto(C.modelo === 'EC950E' ? 'EC950EL' : 'EC950', '#16181B', 'bold %px "Arial Narrow", "Arial", sans-serif', 0.9), 512, 110);
    cartel(texEC, 1.05, 0.23, xCw0 - 1.85, Ydk + 0.62, A2 + 0.03, 0);
    cartel(texEC, 1.05, 0.23, xCw0 - 1.85, Ydk + 0.62, -A2 - 0.03, PI);
    var texVs = texRotulo3d(exgDibVolvo('#F2F2F0'), 512, 96);
    cartel(texVs, 0.60, 0.11, XF - 0.012, (K + Ydk) / 2, czm, -PI / 2);
  }
  /* numero de unidad en los costados del contrapeso */
  var texNum = texNumero3d(null, LH ? '#16181B' : '#F2F2F0');
  [-1, 1].forEach(function(s){
    var m = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.30), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5,
      polygonOffset: true, polygonOffsetFactor: -2 }));
    m.position.set((xCw0 + xA) / 2, K + 0.50, s * (A2 + 0.012)); m.rotation.y = s > 0 ? 0 : PI;
    MG.add(m);
  });

  /* el estudio toma los hex como lineales y sale en sRGB: sin esto el naranja
     Hitachi sale durazno y los grises oscuros salen claros. Se pasa cada color
     (y su base para el mapa de calor) a lineal una sola vez por material. */
  MG.traverse(function(m){
    if(!m.isMesh || !m.material || m.material.map || m.material.userData.lin) return;
    m.material.userData.lin = true;
    m.material.color.convertSRGBToLinear();
    if(m.userData.base) m.userData.base = '#' + m.material.color.getHexString();
  });

  /* centrar: de la punta del cucharon a la cola */
  MG.position.x = -(ps.xmin + C.D) / 2;
  G.userData.ruedas = [];
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = 3.4;
  G.userData.dist = 32;
  G.userData.modelo = clave;
  return G;
}

/* correa de orugas alrededor de circulos [x, y, r] recorridos en sentido
   antihorario (rueda guia, rodillos, catarina): devuelve puntos con el angulo
   de la normal hacia afuera, a paso parejo */
function exgCorrea(circ, paso){
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
function exgAhusar(geo, f, zc){
  var p = geo.attributes.position;
  for(var i = 0; i < p.count; i++){ var k = f(p.getX(i)); p.setZ(i, zc + (p.getZ(i) - zc) * k); }
  p.needsUpdate = true;
  geo.computeVertexNormals();
}

registrarModelo3d({
  nombre: 'Excavadoras grandes retro (R 9100, R 980, EX1200, EC950)',
  clave: function(e){
    var m = mod3d(e);
    if(/^R9100G8/.test(m)) return 'R9100G8';
    if(/^R9100/.test(m)) return 'R9100';
    if(/^R980/.test(m)) return 'R980';
    if(/^EX1200/.test(m)) return 'EX1200';
    if(/^EC950EL/.test(m)) return 'EC950EL';
    if(/^EC950/.test(m)) return 'EC950';
    return null;
  },
  construir: function(e, piezas, clave){ return exgConstruir(clave, piezas); }
});
