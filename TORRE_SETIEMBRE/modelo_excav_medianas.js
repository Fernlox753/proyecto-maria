/* ══════════════════════════════════════════════════════════════════
   EXCAVADORAS SOBRE ORUGAS MEDIANAS Y GRANDES (retroexcavadora)
   CAT 374F L · John Deere 870G LC · Hyundai HX500L (T3) · Hyundai
   R380LC-9SH · Sany SY750H · Sany SY980H · LGMG ME106

   Una sola excavadora parametrica (exmConstruir) que cada modelo arma con
   sus medidas de la hoja del fabricante, sus colores, su cabina y sus
   rotulos. Lo que cambia de un modelo a otro no es solo la escala: la
   cabina (negra de CAT, amarilla con rejas de la Robex, negra con techo
   amarillo de la HX, negra con protecciones de Sany, roja de LGMG), el
   reparto de colores (pluma negra de Deere, cuerpo pizarra de Hyundai),
   las pasarelas laterales y el contrapeso.

   Medidas (hojas del fabricante; m):
     CAT 374F L (folleto «374F L Hydraulic Excavator», tabla Dimensions,
       pluma Mass 7.0 m + brazo M2.57, cucharon SDV 4.6 m3, radio de punta 2.0):
       largo de oruga 5.87 · centro a centro de rodillos 4.705 · trocha 3.41
       tejas 650 · radio de cola 4.015 · bajo contrapeso 1.54 · altura de
       baranda 3.97 · cabina 3.56 · superestructura 3.45 (4.51 con pasarelas
       de 0.53) · despeje 0.84 · 47 tejas por lado
     JOHN DEERE 870G LC (folleto 670G LC/870G LC, pluma ME 7.1 + brazo ME 2.95):
       tumbler 5.11 · tren 6.36 · trocha 3.45 · tejas 900 · cola 4.54
       bajo contrapeso 1.68 · superestructura 4.12 · cabina 3.69 · despeje 0.89
     HYUNDAI HX500L T3 (catalogo HX500L T3 y hoja HX520L, igual cuerpo):
       tumbler 4.47 · oruga 5.46 · trocha 2.94 · tejas 600 (triple garra)
       cola 3.80 · bajo contrapeso 1.445 · superestructura 2.98 · cabina 3.34
       baranda 3.595 · pluma 7.06 · brazo 3.38 · 53 tejas, 9 rodillos, 2 de arriba
     HYUNDAI R380LC-9SH (catalogo R380LC-9SH): tumbler 4.34 · oruga 5.217
       trocha 2.74 · tejas 600 · cola 3.425 · bajo contrapeso 1.295
       superestructura 2.98 · cabina 3.175 · despeje 0.55 · pluma 6.5 · brazo 3.2
       cucharon 1.62 m3
     SANY SY750H (hoja SANY America SY750H): oruga 5.986 · en piso 4.77
       trocha 3.38 · tejas 650 · cola 4.175 · cabina 3.795 · superestructura
       4.479 con peldano (3.50 de ancho de transporte) · despeje 0.892
       pluma 7.0 · brazo 3.0 · 8 rodillos, 3 de arriba
     SANY SY980H (folleto SY980H): oruga 6.35 · en piso 5.07 · trocha 3.51
       tejas 650 · cola 4.70 · superestructura 3.48 · cabina 3.88 · despeje
       0.945 · pluma 7.25 · brazo 2.92 · cucharon 6.1 m3 · 51 tejas, 9 y 3 rodillos
     LGMG ME106 (lgmgjs.com, excavadora minera de 102 t, motor Perkins
       2806, cucharon 6.5–8 m3): solo publica 13.70 x 4.51 x 5.20 de
       transporte. El tren, la cola y la cabina se toman de la SY980H, que
       es de la misma clase (95.8 t); el ancho de 4.51 se reparte en 3.55 de
       superestructura y pasarelas de 0.48.
   Lo que ninguna hoja acota (frente de la superestructura, alto de las
   tapas, forma de pluma y brazo, cucharon) sale de las fotos de los
   mismos folletos, medido contra las cotas que si estan.

   Ejes: frente hacia -X, arriba +Y, la izquierda del operador +Z. La
   cabina va adelante a la izquierda; a la derecha la caja de baterias, los
   tanques y la sala de bombas; atras el motor y el contrapeso. Pose de
   excavacion: pluma levantada, brazo casi vertical y cucharon recogido
   con los dientes cerca del piso.
   ══════════════════════════════════════════════════════════════════ */

/* colores de marca */
var EXM_CAT = '#FFCD11', EXM_JD = '#FFDE00', EXM_HY = '#F5B400', EXM_HYP = '#3D4946', EXM_HXP = '#34403D',
    EXM_SANY = '#F4AA1A', EXM_LG = '#D7191F', EXM_NEGRO = '#1B1D20', EXM_NEGRO2 = '#121416';

/* ═══ medidas y aspecto de cada modelo ═══
   TL largo de oruga · TB centro de rueda guia a centro de catarina · GA trocha
   SW teja · GC despeje · RC radio de cola · YCW bajo contrapeso · UW ancho de
   la superestructura sin pasarelas · WW pasarela de cada lado · YCAB techo
   de cabina · YTOP techo de las tapas · BL pluma · AL brazo · BR radio de
   punta del cucharon · BW ancho del cucharon · nD dientes · peso en t */
var EXM_P = {
  '374FL': { nombre: 'CAT 374F L', peso: 75, TL: 5.87, TB: 4.705, GA: 3.41, SW: 0.65, zap: 47, nRod: 8, nSup: 3, garras: 2,
    GC: 0.84, RC: 4.015, YCW: 1.54, UW: 3.45, WW: 0.53, YCAB: 3.56, YTOP: 3.02, BL: 7.0, AL: 2.57, BR: 2.0, BW: 2.05, nD: 5,
    cabTipo: 'cat', fogs: false, opg: false, rake: 0.16,
    col: { cuerpo: EXM_CAT, oscuro: '#D9A900', faldon: '#1C1F23', tren: '#1D1F22', pluma: EXM_CAT, brazo: EXM_CAT,
           cuchara: EXM_CAT, cil: EXM_CAT, contrapeso: EXM_CAT, baranda: EXM_CAT, cab: '#202328', cabMarco: '#1C1F21',
           techo: '#202328', rejilla: '#17191C', guard: EXM_NEGRO, tapa: EXM_CAT } },
  '870GLC': { nombre: 'John Deere 870G LC', peso: 85.6, TL: 6.36, TB: 5.11, GA: 3.45, SW: 0.90, zap: 51, nRod: 9, nSup: 3, garras: 2,
    GC: 0.89, RC: 4.54, YCW: 1.68, UW: 3.56, WW: 0.28, YCAB: 3.69, YTOP: 3.14, BL: 7.1, AL: 2.95, BR: 2.05, BW: 2.15, nD: 5,
    cabTipo: 'jd', fogs: false, opg: false, rake: 0.12,
    col: { cuerpo: EXM_JD, oscuro: '#D4B600', faldon: '#1A1C1F', tren: EXM_NEGRO, pluma: '#25272A', brazo: '#25272A',
           cuchara: EXM_JD, cil: '#25272A', contrapeso: EXM_JD, baranda: '#25272A', cab: '#2A2E33', cabMarco: '#141618',
           techo: '#2A2E33', rejilla: '#15171A', guard: EXM_NEGRO, tapa: EXM_JD } },
  'HX500L': { nombre: 'Hyundai HX500L', peso: 49.9, TL: 5.46, TB: 4.47, GA: 2.94, SW: 0.60, zap: 53, nRod: 9, nSup: 2, garras: 3,
    GC: 0.77, RC: 3.80, YCW: 1.445, UW: 2.98, WW: 0, YCAB: 3.34, YTOP: 2.65, BL: 7.06, AL: 3.38, BR: 1.78, BW: 1.62, nD: 5,
    cabTipo: 'hx', fogs: false, opg: false, rake: 0.10,
    col: { cuerpo: EXM_HXP, oscuro: '#232B2A', faldon: '#232B2A', tren: '#2B3533', pluma: EXM_HXP, brazo: EXM_HXP,
           cuchara: EXM_HXP, cil: EXM_HXP, contrapeso: EXM_HXP, baranda: '#1C2120', cab: '#1C1F21', cabMarco: '#101213',
           techo: EXM_HY, rejilla: '#141817', guard: EXM_NEGRO, tapa: EXM_HXP, acento: EXM_HY } },
  'R380LC9SH': { nombre: 'Hyundai R380LC-9SH', peso: 38.45, TL: 5.217, TB: 4.34, GA: 2.74, SW: 0.60, zap: 48, nRod: 8, nSup: 2, garras: 3,
    GC: 0.55, RC: 3.425, YCW: 1.295, UW: 2.98, WW: 0, YCAB: 3.175, YTOP: 2.50, BL: 6.5, AL: 3.2, BR: 1.65, BW: 1.45, nD: 5,
    cabTipo: 'hy9', fogs: true, opg: false, rake: 0.08,
    col: { cuerpo: EXM_HY, oscuro: '#C99400', faldon: EXM_HYP, tren: '#2E3936', pluma: EXM_HYP, brazo: EXM_HYP,
           cuchara: EXM_HYP, cil: EXM_HYP, contrapeso: EXM_HYP, baranda: EXM_HYP, cab: EXM_HY, cabMarco: '#15181A',
           techo: EXM_HY, rejilla: '#1A1E1D', guard: '#1E2322', tapa: EXM_HYP } },
  'SY750H': { nombre: 'Sany SY750H', peso: 78.5, TL: 5.986, TB: 4.77, GA: 3.38, SW: 0.65, zap: 48, nRod: 8, nSup: 3, garras: 2,
    GC: 0.892, RC: 4.175, YCW: 1.55, UW: 3.45, WW: 0.51, YCAB: 3.795, YTOP: 3.20, BL: 7.0, AL: 3.0, BR: 2.0, BW: 2.05, nD: 5,
    cabTipo: 'sany', fogs: false, opg: true, rake: 0.10,
    col: { cuerpo: EXM_SANY, oscuro: '#C98A10', faldon: EXM_NEGRO, tren: EXM_NEGRO, pluma: EXM_SANY, brazo: EXM_SANY,
           cuchara: '#1E2023', cil: '#1E2023', contrapeso: EXM_SANY, baranda: '#2A2D31', cab: '#1B1D20', cabMarco: '#0F1012',
           techo: '#1B1D20', rejilla: '#141618', guard: '#1B1D20', tapa: EXM_SANY } },
  'SY980H': { nombre: 'Sany SY980H', peso: 95.8, TL: 6.35, TB: 5.07, GA: 3.51, SW: 0.65, zap: 51, nRod: 9, nSup: 3, garras: 2,
    GC: 0.945, RC: 4.70, YCW: 1.65, UW: 3.48, WW: 0.45, YCAB: 3.88, YTOP: 3.30, BL: 7.25, AL: 2.92, BR: 2.2, BW: 2.40, nD: 6,
    cabTipo: 'sany', fogs: true, opg: true, rake: 0.10,
    col: { cuerpo: EXM_SANY, oscuro: '#C98A10', faldon: EXM_NEGRO, tren: EXM_NEGRO, pluma: EXM_SANY, brazo: EXM_SANY,
           cuchara: '#1E2023', cil: '#1E2023', contrapeso: EXM_SANY, baranda: '#2A2D31', cab: '#1B1D20', cabMarco: '#0F1012',
           techo: '#1B1D20', rejilla: '#141618', guard: '#1B1D20', tapa: EXM_SANY } },
  'ME106': { nombre: 'LGMG ME106', peso: 102, TL: 6.40, TB: 5.10, GA: 3.50, SW: 0.70, zap: 51, nRod: 9, nSup: 3, garras: 2,
    GC: 0.95, RC: 4.75, YCW: 1.65, UW: 3.55, WW: 0.48, YCAB: 3.90, YTOP: 3.35, BL: 7.3, AL: 3.0, BR: 2.25, BW: 2.45, nD: 6,
    cabTipo: 'lg', fogs: true, opg: true, rake: 0.06,
    col: { cuerpo: EXM_LG, oscuro: '#A51217', faldon: EXM_NEGRO, tren: EXM_NEGRO, pluma: EXM_LG, brazo: EXM_LG,
           cuchara: '#1E2023', cil: '#1E2023', contrapeso: EXM_LG, baranda: EXM_LG, cab: EXM_LG, cabMarco: '#121416',
           techo: EXM_LG, rejilla: '#141618', guard: '#1B1D20', tapa: EXM_LG } }
};

/* ═══ rotulos: solo lienzos dibujados ═══ */
/* texto centrado que se angosta solo para caber; sin fondo queda transparente */
function exmDibTexto(txt, o){
  return function(g, w, h){
    if(o.fondo){ g.fillStyle = o.fondo; g.fillRect(0, 0, w, h); }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = (o.peso || 'bold') + ' ' + Math.round(h * (o.alto || 0.72)) + 'px ' + (o.fuente || '"Arial Black", Arial, sans-serif');
    var sx = Math.min(o.ancho || 1, w * (o.max || 0.92) / Math.max(1, g.measureText(txt).width));
    g.save(); g.translate(w / 2, h * 0.54); g.scale(sx, 1);
    if(o.borde){ g.lineWidth = h * 0.06; g.strokeStyle = o.borde; g.strokeText(txt, 0, 0); }
    g.fillStyle = o.tinta; g.fillText(txt, 0, 0); g.restore();
  };
}
/* CAT de la pluma: letras negras sobre el amarillo, con el triangulo de la A */
function exmDibCAT(g, w, h){
  g.textAlign = 'left'; g.textBaseline = 'middle';
  g.font = 'bold ' + Math.round(h * 0.86) + 'px "Arial Black", Arial, sans-serif';
  var wC = g.measureText('C').width, wA = g.measureText('A').width, wT = g.measureText('CAT').width;
  var sx = Math.min(1, w * 0.94 / wT), x0 = (w - wT * sx) / 2;
  g.save(); g.translate(x0, h * 0.52); g.scale(sx, 1);
  g.fillStyle = '#121212'; g.fillText('CAT', 0, 0);
  g.fillStyle = EXM_CAT;
  var xa = wC + wA / 2;
  g.beginPath(); g.moveTo(xa - wA * 0.20, h * 0.30); g.lineTo(xa + wA * 0.20, h * 0.30); g.lineTo(xa, h * 0.05); g.closePath(); g.fill();
  g.restore();
}
/* HYUNDAI blanco con las barras rojas de la HX */
function exmDibHyundai(conBarras){
  return function(g, w, h){
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.70) + 'px "Arial Black", Arial, sans-serif';
    var anchoT = conBarras ? 0.66 : 0.94;
    var sx = Math.min(1, w * anchoT / g.measureText('HYUNDAI').width);
    g.save(); g.translate(w / 2, h * 0.54); g.scale(sx, 1); g.fillStyle = '#F4F4F2'; g.fillText('HYUNDAI', 0, 0); g.restore();
    if(conBarras){
      g.fillStyle = '#D52B1E';
      [[0.02, 1], [0.84, -1]].forEach(function(b){
        var x = w * b[0], bw = w * 0.14;
        g.fillRect(x, h * 0.26, bw, h * 0.22);
        g.fillRect(x + (b[1] > 0 ? bw * 0.25 : 0), h * 0.52, bw * 0.75, h * 0.22);
      });
    }
  };
}
/* logo SANY: cuadro azul (SY750H) o franja negra con corte rojo (SY980H) */
function exmDibSany(azul){
  return function(g, w, h){
    if(azul){
      g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#1D3F78'; g.fillRect(w * 0.035, h * 0.09, w * 0.93, h * 0.82);
    } else {
      g.fillStyle = '#121314';
      g.beginPath(); g.moveTo(w * 0.10, 0); g.lineTo(w, 0); g.lineTo(w * 0.90, h); g.lineTo(0, h); g.closePath(); g.fill();
      g.fillStyle = '#D42A20';
      g.beginPath(); g.moveTo(w * 0.80, 0); g.lineTo(w * 0.88, 0); g.lineTo(w * 0.78, h); g.lineTo(w * 0.70, h); g.closePath(); g.fill();
    }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.62) + 'px "Arial Black", Arial, sans-serif';
    var sx = Math.min(1, w * 0.62 / g.measureText('SANY').width);
    g.save(); g.translate(azul ? w / 2 : w * 0.42, h * 0.54); g.scale(sx, 1); g.fillStyle = '#FFFFFF'; g.fillText('SANY', 0, 0); g.restore();
  };
}

/* ═══ la excavadora parametrica ═══ */
function exmConstruir(P, piezas){
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var bloque = D.bloque, perfil = D.perfil, perfilX = D.perfilX, tubo = D.tubo, cilindro = D.cilindro,
      pon = D.pon, reg = D.reg, M = D.M;
  var C = P.col, s = Math.pow(P.peso / 75, 1 / 3);
  var TIPO = P.cabTipo;

  /* ═══ ayudas ═══ */
  /* contorno en planta (x,z) extruido en alto de y0 a y1 */
  var planta = function(code, pts, y0, y1, tipo, hex, r){
    var g = geoPerfilB(pts.map(function(p){ return [p[0], -p[1]]; }), y1 - y0, (y0 + y1) / 2, r === undefined ? 0.04 : r);
    g.rotateX(-Math.PI / 2);
    return pon(code, g, tipo, hex);
  };
  /* caja entre dos puntos del plano XY: largo a lo largo, alto de canto, ancho en Z */
  var placa = function(code, a, b, alto, ancho, zc, tipo, hex, r){
    var dx = b[0] - a[0], dy = b[1] - a[1];
    return bloque(code, Math.hypot(dx, dy), alto, ancho, tipo, hex, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, zc, r, [0, 0, Math.atan2(dy, dx)]);
  };
  /* muchas copias de una pieza chica en una sola malla: q = [x,y,z, rx,ry,rz] */
  var muchos = function(code, geo, tipo, hex, qs){
    var inst = new THREE.InstancedMesh(geo, M[tipo](hex), qs.length), d = new THREE.Object3D();
    qs.forEach(function(q, i){
      d.position.set(q[0], q[1], q[2]); d.rotation.set(q[3] || 0, q[4] || 0, q[5] || 0); d.updateMatrix();
      inst.setMatrixAt(i, d.matrix);
    });
    inst.instanceMatrix.needsUpdate = true;
    return reg(code, inst, hex);
  };
  /* pasador con su buje y tapas: cruza en Z */
  var perno = function(code, p, z, r, largo){
    cilindro(code, r, r, largo, 'metal', '#454A50', p[0], p[1], z, [Math.PI / 2, 0, 0], 20);
    [-1, 1].forEach(function(l){ cilindro(null, r * 1.25, r * 1.25, 0.05, 'mate', '#2A2D31', p[0], p[1], z + l * (largo / 2 + 0.02), [Math.PI / 2, 0, 0], 16); });
  };
  /* letrero pintado; sin fondo lleva transparencia. ry: 0 mira a +Z, PI a -Z, -PI/2 a -X, PI/2 a +X */
  var letrero = function(tex, w, h, x, y, z, ry, rz){
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, transparent: true,
      roughness: 0.5, metalness: 0.05, polygonOffset: true, polygonOffsetFactor: -2 }));
    m.position.set(x, y, z); m.rotation.set(0, ry || 0, rz || 0);
    G.add(m); return m;
  };
  /* letrero sobre un costado (lado +1 mira a +Z) a lo largo de la direccion (dx,dy), siempre derecho */
  var letreroDir = function(tex, w, h, p, z, lado, dx, dy){
    if(lado > 0){ if(dx < 0){ dx = -dx; dy = -dy; } return letrero(tex, w, h, p[0], p[1], z, 0, Math.atan2(dy, dx)); }
    if(dx > 0){ dx = -dx; dy = -dy; }
    return letrero(tex, w, h, p[0], p[1], z, Math.PI, Math.atan2(dy, -dx));
  };
  /* rejilla de lamas en una cara que mira a +Z (lado 1) o a -Z (lado -1) */
  var rejillaZ = function(code, x0, x1, y0, y1, z, lado, n, hexMarco){
    bloque(code, x1 - x0 + 0.08, y1 - y0 + 0.08, 0.04, 'mate', hexMarco, (x0 + x1) / 2, (y0 + y1) / 2, z + lado * 0.012, 0.015);
    var paso = (y1 - y0) / n, qs = [];
    for(var i = 0; i < n; i++) qs.push([(x0 + x1) / 2, y0 + paso * (i + 0.5), z + lado * 0.045, lado * 0.6, 0, 0]);
    muchos(null, new THREE.BoxGeometry(x1 - x0, paso * 0.55, 0.035), 'mate', '#0B0C0E', qs);
  };
  /* rejilla en una cara de arriba: lamas a lo largo de Z */
  var rejillaY = function(code, x0, x1, z0, z1, y, n, hexMarco){
    bloque(code, x1 - x0 + 0.08, 0.04, z1 - z0 + 0.08, 'mate', hexMarco, (x0 + x1) / 2, y + 0.012, (z0 + z1) / 2, 0.015);
    var paso = (x1 - x0) / n, qs = [];
    for(var i = 0; i < n; i++) qs.push([x0 + paso * (i + 0.5), y + 0.045, (z0 + z1) / 2, 0, 0, 0.55]);
    muchos(null, new THREE.BoxGeometry(paso * 0.55, 0.035, z1 - z0), 'mate', '#0B0C0E', qs);
  };
  /* faro de trabajo rectangular mirando a -X (o a +X con s = 1) */
  var faroT = function(x, y, z, s2, ancho){
    var w = ancho || 0.24;
    bloque(null, 0.12, 0.17, w, 'mate', '#1E2124', x, y, z, 0.025);
    bloque('LSM', 0.03, 0.12, w - 0.06, 'vidrio', '#F4EDCF', x + (s2 || -1) * 0.065, y, z, 0.01);
  };
  var interp = function(poly, a){
    for(var i = 1; i < poly.length; i++){
      if(a <= poly[i][0]){ var f = (a - poly[i - 1][0]) / (poly[i][0] - poly[i - 1][0]); return poly[i - 1][1] + f * (poly[i][1] - poly[i - 1][1]); }
    }
    return poly[poly.length - 1][1];
  };
  var marco = function(o, u, v){ return function(a, b){ return [o[0] + u[0] * a + v[0] * b, o[1] + u[1] * a + v[1] * b]; }; };
  var dist2 = function(a, b){ return Math.hypot(b[0] - a[0], b[1] - a[1]); };
  /* punto a distancia la de A y lb de B, del lado que dice ref */
  var cruce = function(A, la, B, lb, ref){
    var d = Math.max(1e-6, dist2(A, B)), ex = [(B[0] - A[0]) / d, (B[1] - A[1]) / d];
    var x = (la * la - lb * lb + d * d) / (2 * d), y = Math.sqrt(Math.max(0, la * la - x * x));
    var n = [-ex[1], ex[0]];
    if(n[0] * ref[0] + n[1] * ref[1] < 0){ n[0] = -n[0]; n[1] = -n[1]; }
    return [A[0] + ex[0] * x + n[0] * y, A[1] + ex[1] * x + n[1] * y];
  };

  /* ═══ medidas derivadas ═══ */
  var UW = P.UW, ZU = UW / 2, YCW = P.YCW, YD = YCW + 0.24, YT = P.YTOP;
  var XF = -0.56 * P.RC;                          /* frente de la superestructura (medido en las fotos) */
  var XC0 = P.RC - 1.05 * s;                      /* frente del contrapeso */
  var Lc = 1.72 + 0.16 * s, Wc = 0.94 + 0.08 * s; /* cabina */
  var zL0 = ZU - Wc - 0.04;                       /* borde interior de la cabina y de la sala de radiadores */
  var zR1 = -ZU + 0.98 * s;                       /* borde interior de tanques y sala de bombas */
  var zb = (zL0 + zR1) / 2;                       /* plano de la pluma, entre la cabina y los tanques */
  var Wb = 0.84 * s, Wa = 0.60 * s;               /* ancho de pluma y brazo */
  var F = [XF + 1.0 * s, YCW + 0.80 * s];         /* pie de la pluma */
  var xT1 = XF + 0.92 * s;                        /* fin de la caja de baterias */
  var xT2 = xT1 + 1.18 * s;                       /* fin del tanque de combustible */
  var xT3 = xT2 + 1.00 * s;                       /* fin del tanque hidraulico, empieza la sala de bombas */
  var xE0 = F[0] + 1.45 * s;                      /* empieza la sala del motor */
  var ZCW = Math.sqrt(P.RC * P.RC - ZU * ZU);      /* esquina del contrapeso sobre el radio de cola */

  /* ═══ tren de rodaje ═══ */
  var yc = (P.TL - P.TB) / 2, tP = 0.05, hG = 0.05, Rp = yc - (hG + tP / 2);
  var per = 2 * P.TB + 2 * Math.PI * Rp, nZ = P.zap || Math.round(per / 0.26), paso = per / nZ;
  var rRod = 0.12 * s, yRod = (yc - Rp) + tP / 2 + 0.12 + rRod;
  var rGuia = Rp - tP / 2 - 0.13;
  var wF = Math.min(0.62 * s, P.SW * 0.9);        /* ancho del bastidor de la oruga */
  var yBas0 = yRod + 0.02, yBas1 = yc + Rp - tP / 2 - 0.12 - 0.20 * s;
  var geoRod = (function(){
    var wR = 0.50 * s, r = rRod, pts = [[0.04, -wR / 2], [r * 1.25, -wR / 2], [r * 1.25, -wR / 2 + 0.05], [r, -wR / 2 + 0.07],
      [r, -0.07], [r * 0.82, -0.05], [r * 0.82, 0.05], [r, 0.07], [r, wR / 2 - 0.07], [r * 1.25, wR / 2 - 0.05], [r * 1.25, wR / 2], [0.04, wR / 2]];
    var g = new THREE.LatheGeometry(pts.map(function(p){ return new THREE.Vector2(p[0], p[1]); }), 24);
    g.rotateX(Math.PI / 2); return g;
  })();
  [-1, 1].forEach(function(lado){
    var zc = lado * P.GA / 2, code = lado > 0 ? 'CLH' : 'CRH';
    /* tejas, garras, eslabones y pasadores siguiendo el ovalo */
    var tejas = [], garras = [], esl = [], pas = [];
    for(var i = 0; i < nZ; i++){
      var sp = (i + 0.5) * paso, x, y, nx, ny, a;
      if(sp < P.TB){ x = -P.TB / 2 + sp; y = yc - Rp; nx = 0; ny = -1; }
      else if(sp < P.TB + Math.PI * Rp){ a = -Math.PI / 2 + (sp - P.TB) / Rp; x = P.TB / 2 + Math.cos(a) * Rp; y = yc + Math.sin(a) * Rp; nx = Math.cos(a); ny = Math.sin(a); }
      else if(sp < 2 * P.TB + Math.PI * Rp){ x = P.TB / 2 - (sp - P.TB - Math.PI * Rp); y = yc + Rp; nx = 0; ny = 1; }
      else { a = Math.PI / 2 + (sp - 2 * P.TB - Math.PI * Rp) / Rp; x = -P.TB / 2 + Math.cos(a) * Rp; y = yc + Math.sin(a) * Rp; nx = Math.cos(a); ny = Math.sin(a); }
      var rz = Math.atan2(ny, nx) - Math.PI / 2, tx = Math.cos(rz), ty = Math.sin(rz);
      tejas.push([x, y, zc, 0, 0, rz]);
      var off = P.garras === 3 ? [-0.30, 0, 0.30] : [-0.26, 0.24];
      off.forEach(function(f, j){
        var hh = P.garras === 3 ? [0.55, 0.8, 1][j] : 1;
        garras.push([x + nx * (tP / 2 + hG * hh / 2) + tx * f * paso, y + ny * (tP / 2 + hG * hh / 2) + ty * f * paso, zc, 0, 0, rz]);
      });
      [-1, 1].forEach(function(l){ esl.push([x - nx * (tP / 2 + 0.06), y - ny * (tP / 2 + 0.06), zc + l * 0.17 * s, 0, 0, rz]); });
      pas.push([x - nx * (tP / 2 + 0.06) + tx * paso / 2, y - ny * (tP / 2 + 0.06) + ty * paso / 2, zc, Math.PI / 2, 0, 0]);
    }
    /* acero de oruga: oscuro y mate, los eslabones con algo de brillo de rodadura */
    muchos(code, new THREE.BoxGeometry(paso * 0.93, tP, P.SW), 'mate', '#383C41', tejas);
    muchos(code, new THREE.BoxGeometry(0.045, hG, P.SW - 0.01), 'mate', '#2E3236', garras);
    muchos(code, new THREE.BoxGeometry(paso * 0.97, 0.12, 0.10 * s), 'metal', '#3E4349', esl);
    muchos(null, new THREE.CylinderGeometry(0.05 * s, 0.05 * s, 0.46 * s, 10), 'metal', '#50565D', pas);
    /* pernos de las tejas: cuatro por teja, sobre los eslabones */
    var pt = [];
    tejas.forEach(function(q){
      var c = Math.cos(q[5]), sn = Math.sin(q[5]), nx2 = -sn, ny2 = c;
      [-0.12, 0.12].forEach(function(f){ [-1, 1].forEach(function(l){
        pt.push([q[0] + nx2 * (tP / 2 + 0.012) + c * f * paso, q[1] + ny2 * (tP / 2 + 0.012) + sn * f * paso, zc + l * 0.17 * s, 0, 0, q[5]]);
      }); });
    });
    muchos(null, new THREE.BoxGeometry(0.035, 0.024, 0.035), 'metal', '#3C4046', pt);

    /* rueda guia adelante: dos llantas, pestana al medio, masa */
    var xi = -P.TB / 2, codeG = lado > 0 ? 'RGL' : code;
    [-1, 1].forEach(function(l){ cilindro(codeG, rGuia, rGuia, 0.13 * s, 'metal', '#3B4046', xi, yc, zc + l * 0.17 * s, [Math.PI / 2, 0, 0], 36); });
    cilindro(codeG, rGuia + 0.07, rGuia + 0.07, 0.10 * s, 'metal', '#444A50', xi, yc, zc, [Math.PI / 2, 0, 0], 36);
    [-1, 1].forEach(function(l){
      cilindro(null, rGuia * 0.45, rGuia * 0.45, 0.10, 'pintura', C.tren, xi, yc, zc + l * 0.29 * s, [Math.PI / 2, 0, 0], 20);
    });
    /* catarina atras: disco, dientes, mando final y motor de traslacion hacia adentro */
    var xs = P.TB / 2, codeS = lado > 0 ? code : 'SPR';
    cilindro(codeS, rGuia * 0.92, rGuia * 0.92, 0.12 * s, 'metal', '#3F444A', xs, yc, zc, [Math.PI / 2, 0, 0], 32);
    var dts = [], nd = 23;
    for(var k = 0; k < nd; k++){
      var ad = k / nd * Math.PI * 2;
      dts.push([xs + Math.cos(ad) * (rGuia * 0.97), yc + Math.sin(ad) * (rGuia * 0.97), zc, 0, 0, ad - Math.PI / 2]);
    }
    muchos(codeS, new THREE.BoxGeometry(0.09 * s, 0.16 * s, 0.13 * s), 'metal', '#4A5056', dts);
    cilindro(codeS, rGuia * 0.62, rGuia * 0.70, 0.30 * s, 'pintura', C.tren, xs, yc, zc - lado * 0.26 * s, [Math.PI / 2, 0, 0], 28);
    var pernosM = [];
    for(var b2 = 0; b2 < 14; b2++){
      var ab = b2 / 14 * Math.PI * 2;
      pernosM.push([xs + Math.cos(ab) * rGuia * 0.52, yc + Math.sin(ab) * rGuia * 0.52, zc - lado * 0.42 * s, Math.PI / 2, 0, 0]);
    }
    muchos(null, new THREE.CylinderGeometry(0.025, 0.025, 0.05, 6), 'metal', '#6E737A', pernosM);
    cilindro(lado > 0 ? 'TML' : code, rGuia * 0.48, rGuia * 0.52, 0.42 * s, 'metal', '#3A3F45', xs, yc, zc - lado * 0.60 * s, [Math.PI / 2, 0, 0], 24);
    /* bastidor de la oruga: seccion pentagonal que bota la tierra */
    var xb0 = xi + rGuia * 0.55, xb1 = xs - rGuia * 1.05, hw = wF / 2;
    perfilX(code, [[zc - hw, yBas0], [zc + hw, yBas0], [zc + hw, yBas1 - 0.12 * s], [zc + hw * 0.35, yBas1], [zc - hw * 0.35, yBas1], [zc - hw, yBas1 - 0.12 * s]],
      xb1 - xb0, (xb0 + xb1) / 2, 'pintura', C.tren, 0.04);
    /* caja de la catarina y guarda del motor */
    perfilX(code, [[zc - hw * 1.15, yBas0 + 0.05], [zc + hw * 0.9, yBas0 + 0.05], [zc + hw * 0.9, yBas1 - 0.05], [zc - hw * 1.15, yBas1 + 0.05]],
      0.80 * s, xs - rGuia * 0.75, 'pintura', C.tren, 0.04);
    /* tensor de la rueda guia */
    bloque(code, rGuia * 1.6, 0.30 * s, hw * 1.2, 'pintura', C.tren, xi + rGuia * 1.05, yc - 0.02, zc, 0.04);
    /* rodillos de abajo y de arriba */
    var rods = [], nR = P.nRod;
    for(var r = 0; r < nR; r++){
      var xr = xi + rGuia * 0.95 + (r + 0.5) * (xs - rGuia * 0.95 - (xi + rGuia * 0.95)) / nR;
      rods.push([xr, yRod, zc, 0, 0, 0]);
    }
    muchos(code, geoRod, 'mate', '#3A3F45', rods);
    var sup = [], rSup = 0.09 * s, ySup = yc + Rp - tP / 2 - 0.12 - rSup;
    for(var q = 0; q < P.nSup; q++){
      var xq = xi + (q + 1) * (xs - xi) / (P.nSup + 1);
      sup.push([xq, ySup, zc, Math.PI / 2, 0, 0]);
      bloque(null, 0.16 * s, ySup - yBas1 + 0.06, 0.12, 'pintura', C.tren, xq, (ySup + yBas1) / 2, zc - lado * 0.12 * s, 0.02);
    }
    muchos(code, new THREE.CylinderGeometry(rSup, rSup, 0.40 * s, 16), 'metal', '#3A3F45', sup);
    /* guardas de cadena abajo, por fuera */
    [0.30, 0.68].forEach(function(f){
      bloque(code, 1.0 * s, 0.28, 0.05, 'pintura', C.tren, xi + (xs - xi) * f, yRod - 0.02, zc + lado * (hw + 0.03), 0.02);
    });
    /* peldano en el bastidor (lado de la cabina y de la escalera) */
    var xp = lado > 0 ? XF + 0.55 : XF + 0.40;
    bloque(null, 0.50, 0.04, 0.24, 'metal', '#50565D', xp, yBas1 - 0.10, zc + lado * (hw + 0.13), 0.01);
    [-0.22, 0.22].forEach(function(dx){ bloque(null, 0.05, 0.16, 0.22, 'pintura', C.tren, xp + dx, yBas1 - 0.04, zc + lado * (hw + 0.11), 0.01); });
  });

  /* bastidor central en X, tornamesa y rodamiento de giro */
  var zi = P.GA / 2 - wF / 2 + 0.04, yCb0 = P.GC, yCb1 = Math.min(yBas1 + 0.05, YCW - 0.30);
  planta(null, [[-1.55 * s, -zi], [1.55 * s, -zi], [0.75 * s, -zi * 0.42], [0.75 * s, zi * 0.42], [1.55 * s, zi], [-1.55 * s, zi],
    [-0.75 * s, zi * 0.42], [-0.75 * s, -zi * 0.42]], yCb0, yCb1, 'pintura', C.tren, 0.05);
  cilindro(null, 1.02 * s, 1.10 * s, YCW - 0.14 - yCb1, 'pintura', C.tren, 0, (yCb1 + YCW - 0.14) / 2, 0, null, 40);
  cilindro('RG1', 1.18 * s, 1.18 * s, 0.14, 'metal', '#3B4046', 0, YCW - 0.07, 0, null, 48);
  (function(){
    var qs = [];
    for(var i = 0; i < 36; i++){ var a = i / 36 * Math.PI * 2; qs.push([Math.cos(a) * 1.10 * s, YCW - 0.15, Math.sin(a) * 1.10 * s, 0, 0, 0]); }
    muchos(null, new THREE.CylinderGeometry(0.025, 0.025, 0.06, 6), 'metal', '#70767D', qs);
  })();

  /* ═══ superestructura ═══ */
  /* bastidor de la torna: su canto se ve como un faldon oscuro */
  planta(null, [[XF, -ZU], [XC0 + 0.05, -ZU], [XC0 + 0.05, ZU], [XF, ZU]], YCW + 0.03, YD, 'pintura', C.faldon, 0.03);
  /* contrapeso: el radio de cola en planta */
  var cw = [[XC0, -ZU]];
  for(var i = 0; i <= 16; i++){ var zz = -ZU + i * UW / 16; cw.push([Math.sqrt(P.RC * P.RC - zz * zz), zz]); }
  cw.push([XC0, ZU]);
  planta(null, cw, YCW, YT + 0.06, 'pintura', C.contrapeso, 0.07);
  /* moldura del contrapeso: un escalon mas atras arriba */
  bloque(null, 0.10, 0.08, UW - 0.3, 'pintura', C.contrapeso === C.cuerpo ? C.oscuro : C.contrapeso, XC0 + 0.08, YT + 0.08, 0, 0.02);
  /* orejas de izaje y luces traseras */
  [-1, 1].forEach(function(l){
    pon(null, new THREE.TorusGeometry(0.09 * s, 0.03 * s, 8, 16), 'metal', '#3A3F45', XC0 + 0.45 * s, YT + 0.13, l * (ZU - 0.45), [0, Math.PI / 2, 0]);
    bloque(null, 0.06, 0.16, 0.30, 'mate', '#1E2124', ZCW - 0.02, YT - 0.20, l * (ZU - 0.32), 0.02);
    bloque('LSM', 0.03, 0.10, 0.24, 'vidrio', '#C2241B', ZCW + 0.015, YT - 0.20, l * (ZU - 0.32), 0.01);
  });

  /* lado izquierdo, detras de la cabina: radiadores y enfriadores */
  var xL0 = XF + Lc + 0.06;
  bloque('RAD1', XC0 - xL0, YT - YD, ZU - zL0, 'pintura', C.cuerpo, (xL0 + XC0) / 2, (YD + YT) / 2, (zL0 + ZU) / 2, 0.06);
  rejillaZ('RAD1', xL0 + 0.35 * s, xL0 + 1.55 * s, YD + 0.35, YT - 0.30, ZU, 1, 9, C.rejilla);
  /* centro: sala del motor con su tapa levantada, rejilla y escape */
  bloque('ENG1', XC0 - xE0, YT - YD, zL0 - zR1, 'pintura', C.cuerpo, (xE0 + XC0) / 2, (YD + YT) / 2, (zL0 + zR1) / 2, 0.05);
  bloque('ENG1', XC0 - xE0 - 0.35, 0.16, zL0 - zR1 - 0.25, 'pintura', C.tapa, (xE0 + XC0) / 2 - 0.05, YT + 0.08, (zL0 + zR1) / 2, 0.05);
  rejillaY('ENG1', xE0 + 0.35, xE0 + 1.25 * s, zR1 + 0.30, zL0 - 0.30, YT + 0.16, 8, C.rejilla);
  cilindro('ENG1', 0.10 * s, 0.10 * s, 0.70 * s, 'metal', '#3B3F44', XC0 - 0.55 * s, YT + 0.16 + 0.35 * s, zR1 + 0.40 * s, null, 16);
  cilindro(null, 0.13 * s, 0.10 * s, 0.07, 'mate', '#202326', XC0 - 0.55 * s, YT + 0.19 + 0.70 * s, zR1 + 0.40 * s, [0, 0, 0.35], 16);
  /* lado derecho: caja de baterias, tanques y sala de bombas */
  bloque('BAT', xT1 - XF - 0.02, 0.90 * s, ZU + zR1 - 0.04 + 0.04, 'pintura', C.cuerpo, (XF + xT1) / 2, YD + 0.45 * s, (zR1 - ZU) / 2, 0.05);
  [-0.30, 0.30].forEach(function(dz){ faroT(XF - 0.07, YD + 0.62 * s, (zR1 - ZU) / 2 + dz * s, -1, 0.22); });
  bloque('TQC1', xT2 - xT1 - 0.04, YT - YD, ZU + zR1, 'pintura', C.cuerpo, (xT1 + xT2) / 2, (YD + YT) / 2, (zR1 - ZU) / 2, 0.06);
  cilindro(null, 0.11, 0.11, 0.10, 'mate', '#1E2124', (xT1 + xT2) / 2, YT + 0.05, -ZU + 0.40, null, 18);
  bloque(null, 0.06, 0.55, 0.035, 'vidrio', '#9BB7C9', xT1 + 0.30, (YD + YT) / 2, -ZU - 0.012, 0.01);
  bloque('TQH1', xT3 - xT2 - 0.04, YT - YD, ZU + zR1, 'pintura', C.cuerpo, (xT2 + xT3) / 2, (YD + YT) / 2, (zR1 - ZU) / 2, 0.06);
  cilindro(null, 0.08, 0.08, 0.04, 'vidrio', '#9BB7C9', (xT2 + xT3) / 2, YD + 0.70, -ZU - 0.01, [Math.PI / 2, 0, 0], 18);
  bloque('PYM', XC0 - xT3, YT - YD, ZU + zR1, 'pintura', C.cuerpo, (xT3 + XC0) / 2, (YD + YT) / 2, (zR1 - ZU) / 2, 0.06);
  rejillaZ('PYM', xT3 + 0.25 * s, XC0 - 0.35 * s, YD + 0.35, YT - 0.32, -ZU, -1, 9, C.rejilla);
  /* prefiltro del aire sobre la sala de bombas */
  cilindro(null, 0.15 * s, 0.15 * s, 0.38 * s, 'mate', '#1E2124', xT3 + 0.45 * s, YT + 0.19 * s, -ZU + 0.45 * s, null, 20);
  cilindro(null, 0.18 * s, 0.18 * s, 0.05, 'mate', '#1E2124', xT3 + 0.45 * s, YT + 0.40 * s, -ZU + 0.45 * s, null, 20);
  /* planchas antideslizantes arriba, por donde se camina al hacer servicio */
  [[xT1 + 0.10, xT3 - 0.08], [xT3 + 0.08, xT3 + 0.95 * s]].forEach(function(r2){
    bloque(null, r2[1] - r2[0], 0.02, ZU + zR1 - 0.20, 'mate', '#2A2C2F', (r2[0] + r2[1]) / 2, YT + 0.008, (zR1 - ZU) / 2, 0.005);
  });
  bloque(null, 1.30 * s, 0.02, ZU - zL0 - 0.22, 'mate', '#2A2C2F', xL0 + 0.85 * s, YT + 0.008, (zL0 + ZU) / 2, 0.005);
  /* contra incendios: dos botellas rojas detras de la cabina, con su linea */
  [0, 1].forEach(function(j){
    var xb = xL0 + 0.22 + j * 0.30;
    cilindro('SCI', 0.11, 0.11, 0.55, 'pintura', '#B3201C', xb, YT + 0.30, zL0 + 0.28, null, 18);
    pon('SCI', new THREE.SphereGeometry(0.11, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), 'pintura', '#B3201C', xb, YT + 0.575, zL0 + 0.28);
    cilindro(null, 0.035, 0.035, 0.08, 'metal', '#8A8F96', xb, YT + 0.70, zL0 + 0.28, null, 10);
  });
  tubo(null, [xL0 + 0.22, YT + 0.74, zL0 + 0.28], [xL0 + 0.52, YT + 0.74, zL0 + 0.28], 0.015, 'metal', '#8A8F96', 8);
  /* camara trasera y bocina */
  bloque(null, 0.12, 0.10, 0.14, 'mate', '#16181B', P.RC - 0.10, YT + 0.17, 0, 0.02);
  cilindro(null, 0.03, 0.03, 0.04, 'vidrio', '#0E141A', P.RC - 0.03, YT + 0.17, 0, [0, 0, Math.PI / 2], 12);
  cilindro(null, 0.05, 0.08, 0.12, 'mate', '#202326', XF + 0.12, YD - 0.10, zb + 0.6, [0, 0, Math.PI / 2], 12);
  /* juntas de puertas, bisagras y manijas a los costados */
  [[xT1, -1], [xT2, -1], [xT3, -1], [xT3 + (XC0 - xT3) / 2, -1], [xL0 + (XC0 - xL0) * 0.55, 1]].forEach(function(q){
    bloque(null, 0.02, YT - YD - 0.12, 0.02, 'mate', '#121314', q[0], (YD + YT) / 2, q[1] * (ZU + 0.006), 0.005);
    bloque(null, 0.10, 0.035, 0.035, 'cromo', null, q[0] - 0.12, YD + (YT - YD) * 0.55, q[1] * (ZU + 0.02), 0.008);
  });
  /* centro adelante: tapa de la valvula principal detras del pie de la pluma */
  bloque('VV1', xE0 - (F[0] + 0.72 * s), 0.62 * s, zL0 - zR1 - 0.06, 'pintura', C.cuerpo, (xE0 + F[0] + 0.72 * s) / 2, YD + 0.31 * s, (zL0 + zR1) / 2, 0.05);
  /* reductor de giro asomando junto al pie de la pluma */
  cilindro('RG1', 0.17 * s, 0.17 * s, 0.75 * s, 'metal', '#454A50', F[0] + 0.55 * s, YD + 0.37 * s, zR1 + 0.20 * s, null, 18);
  cilindro('RG1', 0.21 * s, 0.21 * s, 0.10, 'metal', '#3A3F45', F[0] + 0.55 * s, YD + 0.05, zR1 + 0.20 * s, null, 18);
  /* lubricacion centralizada: bomba y deposito al frente del tanque */
  bloque('SEN', 0.22, 0.42, 0.34, 'mate', '#2A2D31', XF + 0.30, YD + 0.90 * s + 0.21, -ZU + 0.30, 0.03);
  cilindro('SEN', 0.11, 0.11, 0.34, 'vidrio', '#E8E4D2', XF + 0.30, YD + 0.90 * s + 0.59, -ZU + 0.30, null, 16);

  /* ═══ lo que distingue cada carroceria: contrapeso, tapas y escaleras ═══ */
  var angCola = Math.asin(Math.min(0.99, (ZU - 0.06) / P.RC));
  /* franja que abraza la curva del contrapeso */
  var franjaCola = function(y, h, hex, tipo){
    var m = new THREE.Mesh(new THREE.CylinderGeometry(P.RC + 0.05, P.RC + 0.05, h, 32, 1, true, Math.PI / 2 - angCola, 2 * angCola),
      M[tipo || 'pintura'](hex));
    m.position.y = y; G.add(m); return m;
  };
  /* escalera vertical contra un costado (mira a +Z o -Z), con aros arriba */
  var escaleraZ = function(x, z, y0, y1, lado, hex){
    [-0.22, 0.22].forEach(function(dx){ bloque(null, 0.06, y1 - y0, 0.07, 'pintura', hex, x + dx, (y0 + y1) / 2, z, 0.015); });
    var n = Math.max(2, Math.round((y1 - y0) / 0.30)), qs = [];
    for(var i = 1; i < n; i++) qs.push([x, y0 + (y1 - y0) * i / n, z, 0, 0, 0]);
    muchos(null, new THREE.BoxGeometry(0.40, 0.035, 0.16), 'metal', '#45494F', qs);
    [-0.22, 0.22].forEach(function(dx){
      tubo(null, [x + dx, y1, z], [x + dx, y1 + 0.90, z], 0.025, 'pintura', hex, 8);
      tubo(null, [x + dx, y1 + 0.90, z], [x + dx, y1 + 0.90, z - lado * 0.45], 0.025, 'pintura', hex, 8);
    });
  };
  if(TIPO === 'cat'){
    /* 374F: dos puertas con lamas a la izquierda, filete negro en el contrapeso y caja del filtro sobre la tapa */
    rejillaZ(null, xL0 + 1.85 * s, XC0 - 0.30, YD + 0.35, YT - 0.30, ZU, 1, 9, C.rejilla);
    franjaCola(YCW + 0.10, 0.20, C.faldon);
    bloque('ENG1', 0.85 * s, 0.32, 0.95 * s, 'pintura', C.cuerpo, xE0 + 0.95 * s, YT + 0.30, zL0 - 0.60 * s, 0.05);
  }
  if(TIPO === 'jd'){
    /* 870G: contrapeso con la parte baja negra y rejilla larga en el lado de bombas */
    franjaCola(YCW + 0.20, 0.40, '#16181B');
    rejillaZ(null, xL0 + 1.85 * s, XC0 - 0.30, YD + 0.35, YT - 0.75, ZU, 1, 6, C.rejilla);
  }
  if(TIPO === 'hy9' || TIPO === 'hx'){
    /* Robex y HX: contrapeso pizarra con un escalon en la parte alta */
    franjaCola(YT - 0.30, 0.04, '#0E1312', 'mate');
    franjaCola(YCW + 0.05, 0.10, '#0E1312', 'mate');
  }
  if(TIPO === 'sany' || TIPO === 'lg'){
    /* mineras: franja negra baja, caja de radiadores alzada atras con rejilla y escalera de subida */
    franjaCola(YCW + 0.14, 0.28, EXM_NEGRO);
    var xr0 = XC0 - 1.55 * s, xr1 = XC0 - 0.10, zr0 = -ZU + 0.10, zr1 = zR1 + 0.08;
    bloque('RAD1', xr1 - xr0, 0.55 * s, zr1 - zr0, 'pintura', TIPO === 'sany' ? EXM_NEGRO : C.cuerpo, (xr0 + xr1) / 2, YT + 0.275 * s, (zr0 + zr1) / 2, 0.05);
    rejillaY('RAD1', xr0 + 0.12, xr1 - 0.12, zr0 + 0.12, zr1 - 0.12, YT + 0.55 * s, 9, C.rejilla);
    rejillaZ(null, xr0 + 0.15, xr1 - 0.15, YT + 0.10, YT + 0.48 * s, zr0 - 0.0, -1, 4, C.rejilla);
    escaleraZ(xL0 + 0.45, ZU + 0.16, YD - 0.04, YT, 1, C.baranda);
  }

  /* ═══ pasarelas a los costados (rejilla sobre mensulas) ═══ */
  if(P.WW > 0){
    [[xL0 + 0.05, XC0 - 0.10, 1], [xT1 + 0.05, XC0 - 0.10, -1]].forEach(function(w){
      var x0 = w[0], x1 = w[1], l = w[2], zc2 = l * (ZU + P.WW / 2);
      bloque(null, x1 - x0, 0.04, P.WW, 'metal', '#4A4F55', (x0 + x1) / 2, YD - 0.06, zc2, 0.01);
      var nl = Math.round((x1 - x0) / 0.09), qs = [];
      for(var j = 0; j < nl; j++) qs.push([x0 + (j + 0.5) * (x1 - x0) / nl, YD - 0.025, zc2, 0, 0, 0]);
      muchos(null, new THREE.BoxGeometry(0.02, 0.03, P.WW - 0.04), 'metal', '#2E3237', qs);
      bloque(null, x1 - x0, 0.10, 0.03, 'pintura', C.cuerpo, (x0 + x1) / 2, YD - 0.03, l * (ZU + P.WW), 0.01);
      for(var m2 = 0; m2 < 4; m2++){
        var xm = x0 + 0.15 + m2 * (x1 - x0 - 0.30) / 3;
        perfil(null, [[xm - 0.05, YD - 0.08], [xm + 0.05, YD - 0.08], [xm + 0.05, YD - 0.40]], 0.05, l * (ZU + P.WW * 0.5), 'pintura', C.faldon, 0.01)
          .scale.set(1, 1, 1);
        bloque(null, 0.06, 0.06, P.WW, 'pintura', C.faldon, xm, YD - 0.11, l * (ZU + P.WW / 2), 0.01);
      }
    });
  }

  /* ═══ barandas arriba, escalones del lado derecho y espejo ═══ */
  D.baranda([[xL0 + 0.25, ZU - 0.07], [XC0 - 0.05, ZU - 0.07]], YT, 0.92, C.baranda);
  D.baranda([[xT1 + 0.12, zR1 - 0.06], [xT1 + 0.12, -ZU + 0.07], [XC0 - 0.05, -ZU + 0.07]], YT, 0.92, C.baranda);
  /* peldanos plegados en la caja de baterias y pasamanos de subida */
  [YD + 0.10, YD + 0.48 * s].forEach(function(y, j){
    bloque(null, 0.32, 0.035, 0.42, 'metal', '#4A4F55', XF - 0.12 - j * 0.0, y, -ZU + 0.30 + 0.0, 0.008);
    bloque(null, 0.04, 0.10, 0.42, 'pintura', C.cuerpo, XF - 0.27, y + 0.03, -ZU + 0.30, 0.01);
  });
  tubo(null, [XF + 0.05, YD + 0.30, -ZU - 0.06], [xT1 - 0.05, YT - 0.10, -ZU - 0.06], 0.022, 'pintura', C.baranda, 10);
  tubo(null, [XF + 0.05, YD + 0.30, -ZU - 0.06], [XF + 0.05, YD + 0.30, -ZU + 0.02], 0.022, 'pintura', C.baranda, 10);
  tubo(null, [xT1 - 0.05, YT - 0.10, -ZU - 0.06], [xT1 - 0.05, YT - 0.10, -ZU + 0.02], 0.022, 'pintura', C.baranda, 10);
  tubo(null, [xT1 + 0.12, YT + 0.92, -ZU + 0.07], [XF + 0.10, YT + 1.25, -ZU + 0.10], 0.025, 'pintura', C.baranda, 10);
  bloque(null, 0.06, 0.55, 0.36, 'mate', '#16181B', XF + 0.06, YT + 1.40, -ZU + 0.12, 0.03);
  bloque(null, 0.015, 0.48, 0.30, 'cromo', null, XF + 0.025, YT + 1.40, -ZU + 0.12, 0.004);

  /* ═══ cabina ═══ */
  (function(){
    var x0 = XF + 0.04, x1 = XF + Lc, z0 = zL0 + 0.05, z1 = ZU - 0.03, y0 = YD, y1 = P.YCAB;
    var cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, wz = z1 - z0, lx = x1 - x0;
    var ySill = y0 + (TIPO === 'cat' || TIPO === 'jd' ? 0.30 : 0.45), yR = y1 - 0.13, rk = P.rake || 0.1;
    var xPost = x0 + 0.60 * lx, pw = 0.085;
    var cBajo = C.cab, cMarco = C.cabMarco;
    /* piso, montajes y faldones bajos */
    bloque('CBN', lx, 0.14, wz, 'pintura', cMarco, cx, y0 + 0.07, cz, 0.03);
    bloque('CBN', lx - 0.02, ySill - y0 - 0.14, 0.06, 'pintura', cBajo, cx, (y0 + 0.14 + ySill) / 2, z1 - 0.03, 0.02);
    bloque('CBN', lx - 0.02, ySill - y0 - 0.14, 0.06, 'pintura', cBajo, cx, (y0 + 0.14 + ySill) / 2, z0 + 0.03, 0.02);
    bloque('CBN', 0.08, yR - y0 - 0.14, wz, 'pintura', cBajo, x1 - 0.04, (y0 + 0.14 + yR) / 2, cz, 0.02);
    bloque('CBN', 0.06, 0.16, wz, 'pintura', cBajo, x0 + 0.03, y0 + 0.22, cz, 0.02);
    /* parantes: los de adelante inclinados hacia atras */
    [z0 + pw / 2, z1 - pw / 2].forEach(function(z){
      placa('CBN', [x0 + pw / 2, ySill - 0.05], [x0 + rk + pw / 2, yR], pw, pw, z, 'pintura', cMarco, 0.02);
      bloque('CBN', pw, yR - ySill, pw, 'pintura', cMarco, x1 - pw / 2 - 0.02, (ySill + yR) / 2, z, 0.02);
    });
    bloque('CBN', pw * 0.8, yR - ySill, pw * 0.8, 'pintura', cMarco, xPost, (ySill + yR) / 2, z1 - pw / 2, 0.02);
    bloque('CBN', lx, 0.07, pw, 'pintura', cMarco, cx, ySill - 0.02, z1 - pw / 2, 0.015);
    bloque('CBN', lx, 0.07, pw, 'pintura', cMarco, cx, ySill - 0.02, z0 + pw / 2, 0.015);
    /* vidrios: parabrisas inclinado, el de abajo, puerta, ventana trasera izquierda y costado derecho */
    placa(null, [x0 + 0.03, ySill], [x0 + rk + 0.03, yR - 0.02], 0.03, wz - 0.14, cz, 'vidrio', '#1A2A3A', 0.005);
    bloque(null, 0.03, ySill - y0 - 0.20, wz - 0.16, 'vidrio', '#1A2A3A', x0 + 0.02, (y0 + 0.30 + ySill) / 2, cz, 0.005);
    perfil(null, [[x0 + pw, ySill + 0.02], [xPost - 0.05, ySill + 0.02], [xPost - 0.05, yR - 0.03], [x0 + rk + pw, yR - 0.03]], 0.025, z1 - 0.012, 'vidrio', '#1A2A3A', 0.005);
    perfil(null, [[xPost + 0.05, ySill + 0.02], [x1 - pw - 0.03, ySill + 0.02], [x1 - pw - 0.03, yR - 0.03], [xPost + 0.05, yR - 0.03]], 0.025, z1 - 0.012, 'vidrio', '#1A2A3A', 0.005);
    perfil(null, [[x0 + pw, ySill + 0.02], [x1 - pw - 0.03, ySill + 0.02], [x1 - pw - 0.03, yR - 0.03], [x0 + rk + pw, yR - 0.03]], 0.025, z0 + 0.012, 'vidrio', '#1A2A3A', 0.005);
    bloque(null, 0.025, (yR - ySill) * 0.55, wz - 0.25, 'vidrio', '#1A2A3A', x1 + 0.005, yR - (yR - ySill) * 0.33, cz, 0.005);
    /* puerta: el vidrio de abajo de la puerta en las cabinas grandes */
    if(TIPO === 'cat' || TIPO === 'jd') bloque(null, xPost - x0 - 0.20, ySill - y0 - 0.26, 0.02, 'vidrio', '#1A2A3A', (x0 + xPost) / 2 + 0.04, (y0 + 0.16 + ySill) / 2, z1 + 0.003, 0.005);
    /* techo con alero y escotilla */
    var rT = TIPO === 'jd' || TIPO === 'hy9' ? 0.08 : 0.04;
    bloque('CBN', lx + 0.14, 0.13, wz + 0.10, 'pintura', C.techo, cx - 0.01, yR + 0.065, cz, rT);
    bloque(null, lx * 0.45, 0.04, wz * 0.55, 'mate', '#202326', cx + 0.12, yR + 0.15, cz, 0.015);
    if(TIPO === 'hx') bloque('CBN', lx + 0.10, 0.05, wz + 0.06, 'pintura', '#1C1F21', cx - 0.01, yR + 0.155, cz, 0.02);
    /* visera sobre el parabrisas */
    if(TIPO === 'jd' || TIPO === 'hy9'){
      var vis = bloque(null, 0.34, 0.03, wz - 0.06, 'vidrio', '#2A3440', x0 - 0.10, yR + 0.02, cz, 0.01);
      vis.rotation.z = 0.35;
    }
    /* interior: asiento, consolas y monitor */
    bloque(null, 0.50, 0.14, 0.50, 'mate', '#2A2C30', cx + 0.20, y0 + 0.62, cz, 0.05);
    bloque(null, 0.14, 0.70, 0.50, 'mate', '#2A2C30', cx + 0.48, y0 + 1.00, cz, 0.05);
    [-1, 1].forEach(function(l){ bloque(null, 0.55, 0.16, 0.16, 'mate', '#1E2023', cx + 0.15, y0 + 0.78, cz + l * 0.36, 0.03); });
    bloque(null, 0.05, 0.20, 0.26, 'mate', '#101112', x0 + rk + 0.20, ySill + 0.25, z0 + 0.20, 0.02);
    /* limpiaparabrisas */
    tubo(null, [x0 + 0.01, ySill + 0.10, cz - 0.20], [x0 + rk * 0.6, ySill + 0.75, cz + 0.12], 0.012, 'mate', '#111', 6);
    /* manija, bisagras y asideros del lado de la puerta */
    bloque(null, 0.16, 0.035, 0.04, 'cromo', null, x0 + 0.22, ySill - 0.10, z1 + 0.025, 0.008);
    [ySill + 0.20, yR - 0.25].forEach(function(y){ bloque(null, 0.06, 0.10, 0.04, 'mate', '#202327', xPost - 0.03, y, z1 + 0.02, 0.01); });
    tubo(null, [x1 + 0.08, y0 + 0.20, z1 - 0.05], [x1 + 0.08, yR - 0.30, z1 - 0.05], 0.022, 'pintura', C.baranda, 10);
    tubo(null, [x0 - 0.06, y0 + 0.35, z1 + 0.05], [x0 + rk * 0.7 - 0.06, yR - 0.40, z1 + 0.05], 0.020, 'cromo', null, 10);
    /* faros del techo y baliza */
    [-1, 1].forEach(function(l){ faroT(x0 - 0.02, yR + 0.24, cz + l * wz * 0.28, -1, 0.20); bloque(null, 0.10, 0.10, 0.04, 'mate', '#1E2124', x0 + 0.06, yR + 0.17, cz + l * wz * 0.28, 0.01); });
    var bal = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4, roughness: 0.3 }));
    bal.position.set(x1 - 0.25, yR + 0.13, z1 - 0.15); G.add(bal);
    /* espejo izquierdo */
    tubo(null, [x0 + 0.10, ySill, z1 + 0.04], [x0 - 0.18, ySill + 0.45, z1 + 0.22], 0.02, 'mate', '#1E2124', 8);
    bloque(null, 0.05, 0.34, 0.22, 'mate', '#16181B', x0 - 0.20, ySill + 0.62, z1 + 0.24, 0.02);
    bloque(null, 0.012, 0.30, 0.18, 'cromo', null, x0 - 0.225, ySill + 0.62, z1 + 0.24, 0.004);
    /* reja frontal (FOGS) */
    if(P.fogs){
      var xg = x0 - 0.16, yg0 = y0 + 0.30, yg1 = yR + 0.02;
      [z0 + 0.04, z1 - 0.04].forEach(function(z){
        bloque(null, 0.08, yg1 - yg0, 0.08, 'pintura', C.guard, xg, (yg0 + yg1) / 2, z, 0.02);
        bloque(null, 0.24, 0.06, 0.06, 'pintura', C.guard, xg + 0.10, yg1 - 0.05, z, 0.01);
        bloque(null, 0.24, 0.06, 0.06, 'pintura', C.guard, xg + 0.10, yg0 + 0.10, z, 0.01);
      });
      [yg0 + 0.05, yg1 - 0.03, (yg0 + yg1) / 2].forEach(function(y){ tubo(null, [xg, y, z0 + 0.04], [xg, y, z1 - 0.04], 0.03, 'pintura', C.guard, 10); });
      for(var gb = 1; gb < 6; gb++){
        var zg = z0 + 0.04 + gb * (wz - 0.08) / 6;
        tubo(null, [xg, yg0, zg], [xg, yg1, zg], 0.022, 'pintura', C.guard, 8);
      }
    }
    /* proteccion de techo (OPG) */
    if(P.opg){
      var yo = yR + 0.32;
      [[x0 + 0.05, z0 + 0.05], [x0 + 0.05, z1 - 0.05], [x1 - 0.10, z0 + 0.05], [x1 - 0.10, z1 - 0.05]].forEach(function(p){
        tubo(null, [p[0], yR + 0.10, p[1]], [p[0], yo, p[1]], 0.03, 'pintura', C.guard, 8);
      });
      [z0 + 0.05, z1 - 0.05].forEach(function(z){ tubo(null, [x0 - 0.05, yo, z], [x1 - 0.05, yo, z], 0.035, 'pintura', C.guard, 8); });
      for(var ob = 0; ob < 5; ob++){
        var xo = x0 + 0.05 + ob * (lx - 0.15) / 4;
        tubo(null, [xo, yo + 0.02, z0 + 0.05], [xo, yo + 0.02, z1 - 0.05], 0.025, 'pintura', C.guard, 8);
      }
    }
    /* rotulos en la cabina */
    if(TIPO === 'cat'){
      letrero(texRotulo3d(rotuloCAT, 256, 96), 0.42, 0.16, x0 + 0.38, ySill - 0.10, z1 + 0.006, 0);
      letrero(texRotulo3d(exmDibTexto('374F', { tinta: '#FFFFFF' }), 256, 96), 0.42, 0.16, x0 + 0.38, ySill - 0.27, z1 + 0.006, 0);
    }
    if(TIPO === 'sany' || TIPO === 'lg'){
      letrero(texRotulo3d(exmDibTexto(TIPO === 'lg' ? 'LGMG' : 'SANY', { tinta: '#FFFFFF' }), 256, 80), 0.36, 0.11, x1 - 0.30, ySill - 0.12, z1 + 0.006, 0);
    }
  })();

  /* ═══ franjas y rotulos de cada marca sobre la carroceria ═══ */
  var xLtxt = (xL0 + XC0) / 2;
  var banda = function(y0, y1, hex, soloIzq){
    bloque(null, XC0 - xL0 - 0.10, y1 - y0, 0.02, 'pintura', hex, (xL0 + XC0) / 2, (y0 + y1) / 2, ZU + 0.012, 0.005);
    if(!soloIzq) bloque(null, XC0 - XF - 0.10, y1 - y0, 0.02, 'pintura', hex, (XF + XC0) / 2, (y0 + y1) / 2, -ZU - 0.012, 0.005);
  };
  if(P === EXM_P['374FL']){
    /* CAT al contrapeso, en la curva */
    var texCw = texRotulo3d(exmDibCAT, 512, 160);
    var cyl = new THREE.Mesh(new THREE.CylinderGeometry(P.RC + 0.07, P.RC + 0.07, 0.62, 24, 1, true, Math.PI / 2 - 0.21, 0.42),
      new THREE.MeshStandardMaterial({ map: texCw, transparent: true, roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -2 }));
    cyl.position.y = (YCW + YT) / 2 + 0.15; G.add(cyl);
  }
  if(TIPO === 'jd'){
    /* tapa negra arriba atras con el modelo, como en el folleto */
    bloque(null, XC0 - xL0 - 0.3, 0.48, 0.02, 'pintura', '#16181B', xLtxt, YT - 0.30, ZU + 0.012, 0.01);
    bloque(null, XC0 - xT3 - 0.1, 0.48, 0.02, 'pintura', '#16181B', (xT3 + XC0) / 2, YT - 0.30, -ZU - 0.012, 0.01);
    var texJ = texRotulo3d(exmDibTexto('870G LC', { tinta: '#FFFFFF', fuente: 'Arial, sans-serif' }), 512, 112);
    letrero(texJ, 1.60, 0.36, XC0 - 1.05, YT - 0.30, ZU + 0.025, 0);
    letrero(texJ, 1.60, 0.36, XC0 - 1.05, YT - 0.30, -ZU - 0.025, Math.PI);
    banda(YD - 0.01, YD + 0.10, '#16181B');
    var texJD = texRotulo3d(exmDibTexto('JOHN DEERE', { tinta: '#141414', fuente: 'Arial, sans-serif' }), 640, 110);
    var cj = new THREE.Mesh(new THREE.CylinderGeometry(P.RC + 0.07, P.RC + 0.07, 0.30, 24, 1, true, Math.PI / 2 - 0.22, 0.44),
      new THREE.MeshStandardMaterial({ map: texJD, transparent: true, roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -2 }));
    cj.position.y = (YCW + YT) / 2 + 0.10; G.add(cj);
  }
  if(TIPO === 'hy9' || TIPO === 'hx'){
    var texHy = texRotulo3d(exmDibHyundai(TIPO === 'hx'), 768, 128);
    var ch = new THREE.Mesh(new THREE.CylinderGeometry(P.RC + 0.07, P.RC + 0.07, 0.36, 24, 1, true, Math.PI / 2 - 0.30, 0.60),
      new THREE.MeshStandardMaterial({ map: texHy, transparent: true, roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -2 }));
    ch.position.y = (YCW + YT) / 2 + 0.10; G.add(ch);
  }
  if(TIPO === 'hy9'){
    /* R380: costados amarillos con tapas, contrapeso y faldon pizarra, filete gris */
    bloque(null, XC0 - xL0 - 0.10, 0.06, ZU - zL0, 'pintura', C.tapa, (xL0 + XC0) / 2, YT + 0.02, (zL0 + ZU) / 2, 0.02);
    bloque(null, XC0 - XF - 0.10, 0.06, ZU + zR1, 'pintura', C.tapa, (XF + XC0) / 2 + 0.05, YT + 0.02, (zR1 - ZU) / 2, 0.02);
    banda(YD - 0.01, YD + 0.16, EXM_HYP);
    banda(YD + 0.16, YD + 0.21, '#B4BABC');
    letrero(texRotulo3d(exmDibTexto('380LC-9SH', { tinta: '#FFFFFF' }), 512, 96), 0.95, 0.18, XC0 - 0.60, YD + 0.075, ZU + 0.025, 0);
    letrero(texRotulo3d(exmDibTexto('Robex', { tinta: '#FFFFFF', fuente: 'Georgia, serif' }), 256, 96), 0.40, 0.15, xL0 + 0.40, YD + 0.075, ZU + 0.025, 0);
  }
  if(TIPO === 'hx'){
    /* HX: carroceria pizarra con la cuña amarilla detras de la cabina */
    perfil(null, [[xL0 + 0.02, YD + 0.20], [xL0 + 1.75 * s, YD + 0.20], [xL0 + 1.35 * s, YT - 0.04], [xL0 + 0.02, YT - 0.04]], 0.02, ZU + 0.013, 'pintura', C.acento, 0.005);
    rejillaZ(null, xL0 + 0.55 * s, xL0 + 1.15 * s, YT - 0.62, YT - 0.25, ZU + 0.02, 1, 4, '#3D3A20');
    bloque(null, 1.55 * s, 0.18, 0.02, 'pintura', '#1C1F21', xL0 + 0.85 * s, YD + 0.10, ZU + 0.014, 0.005);
    letrero(texRotulo3d(exmDibTexto('HX500L', { tinta: '#141414' }), 384, 96), 0.62, 0.16, xL0 + 1.05 * s, YD + 0.42, ZU + 0.03, 0);
    letrero(texHy, 1.40, 0.24, XC0 - 0.75, YT - 0.40, ZU + 0.02, 0);
    letrero(texHy, 1.40, 0.24, XC0 - 0.75, YT - 0.40, -ZU - 0.02, Math.PI);
  }
  if(TIPO === 'sany'){
    /* Sany: faldon negro con el corte rojo y el modelo junto a la cabina */
    banda(YD - 0.01, YD + 0.26, EXM_NEGRO);
    perfil(null, [[xL0 + 0.05, YD + 0.25], [xL0 + 0.35, YD + 0.25], [xL0 + 0.15, YD + 0.80], [xL0 + 0.05, YD + 0.80]], 0.02, ZU + 0.013, 'pintura', EXM_NEGRO, 0.005);
    perfil(null, [[xL0 + 0.38, YD + 0.25], [xL0 + 0.46, YD + 0.25], [xL0 + 0.26, YD + 0.80], [xL0 + 0.18, YD + 0.80]], 0.02, ZU + 0.014, 'pintura', '#D42A20', 0.005);
    var texSy = texRotulo3d(exmDibTexto(P.nombre.replace('Sany ', ''), { tinta: '#FFFFFF' }), 384, 96);
    letrero(texSy, 0.85, 0.20, xL0 + 1.05, YD + 0.125, ZU + 0.03, 0);
    letrero(texSy, 0.85, 0.20, XC0 - 1.0, YD + 0.125, -ZU - 0.03, Math.PI);
    var texSc = texRotulo3d(exmDibTexto('SANY', { tinta: '#141414' }), 384, 110);
    var cs = new THREE.Mesh(new THREE.CylinderGeometry(P.RC + 0.07, P.RC + 0.07, 0.50, 24, 1, true, Math.PI / 2 - 0.20, 0.40),
      new THREE.MeshStandardMaterial({ map: texSc, transparent: true, roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -2 }));
    cs.position.y = (YCW + YT) / 2 + 0.12; G.add(cs);
    rejillaZ(null, XC0 - 1.45 * s, XC0 - 0.35, YT - 0.55, YT - 0.25, ZU, 1, 3, C.rejilla);
  }
  if(TIPO === 'lg'){
    banda(YD - 0.01, YD + 0.22, EXM_NEGRO);
    var texM = texRotulo3d(exmDibTexto('ME106', { tinta: '#FFFFFF', fondo: '#141414' }), 320, 96);
    letrero(texM, 0.55, 0.17, xL0 + 0.45, YT - 0.40, ZU + 0.02, 0);
    var texLc = texRotulo3d(exmDibTexto('LGMG', { tinta: '#FFFFFF' }), 384, 110);
    var cl = new THREE.Mesh(new THREE.CylinderGeometry(P.RC + 0.07, P.RC + 0.07, 0.52, 24, 1, true, Math.PI / 2 - 0.21, 0.42),
      new THREE.MeshStandardMaterial({ map: texLc, transparent: true, roughness: 0.5, polygonOffset: true, polygonOffsetFactor: -2 }));
    cl.position.y = (YCW + YT) / 2 + 0.12; G.add(cl);
  }

  /* ═══ equipo de trabajo: pose de excavacion ═══ */
  var BL = P.BL, AL = P.AL, R = P.BR, kB = 0.13 * BL;
  var alfa = 252 * Math.PI / 180, beta = 287 * Math.PI / 180;
  var ua = [Math.cos(alfa), Math.sin(alfa)], va = [ua[1], -ua[0]];
  var pB = [Math.cos(beta), Math.sin(beta)], qB = [pB[1], -pB[0]];
  /* perfil del cucharon en unidades de R: (a lo largo del radio de punta, hacia el lomo) */
  var envol = [[0.10, -0.40], [-0.02, -0.22], [-0.06, 0.02], [0.02, 0.24], [0.20, 0.40], [0.45, 0.48], [0.70, 0.42], [0.88, 0.25], [0.97, 0.04]];
  var dirD = [0.39, -0.92], lD = 0.24;
  var puntaL = [0.97 + dirD[0] * lD, 0.04 + dirD[1] * lD];
  var punta = [pB[0] * puntaL[0] * R + qB[0] * puntaL[1] * R, pB[1] * puntaL[0] * R + qB[1] * puntaL[1] * R];
  /* angulo de la pluma para que los dientes queden a 0.7 m del piso */
  var sinT = (0.70 - F[1] - AL * ua[1] - punta[1]) / BL;
  var th = Math.asin(Math.max(0.15, Math.min(0.75, sinT)));
  var ub = [-Math.cos(th), Math.sin(th)], vb = [ub[1], -ub[0]];
  var pl = marco(F, ub, vb);
  var T = pl(BL, 0);
  var br = marco(T, ua, va);
  var B = br(AL, 0);
  var cu = function(a, b){ return [B[0] + pB[0] * a * R + qB[0] * b * R, B[1] + pB[1] * a * R + qB[1] * b * R]; };

  /* pluma en banana: contorno arriba y abajo en el marco de la cuerda pie-punta */
  var topB = [[-0.32 * s, 0.30 * s], [0.20 * BL, 0.55 * kB + 0.52 * s], [0.45 * BL, kB + 0.60 * s], [0.64 * BL, 0.70 * kB + 0.50 * s], [BL - 0.30 * s, 0.36 * s], [BL + 0.28 * s, 0.06 * s]];
  var botB = [[-0.32 * s, -0.24 * s], [0.02 * BL, -0.42 * s], [0.22 * BL, 0.30 * kB - 0.52 * s], [0.50 * BL, kB - 0.52 * s], [BL - 0.45 * s, -0.34 * s], [BL + 0.24 * s, -0.26 * s]];
  var contB = topB.concat(botB.slice().reverse()).map(function(p){ return pl(p[0], p[1]); });
  perfil(null, contB, Wb, zb, 'pintura', C.pluma, 0.05);
  /* planchas de refuerzo a los costados, un tono mas oscuro */
  var refB = [[0.12 * BL, 0.5 * (interp(topB, 0.12 * BL) + interp(botB, 0.12 * BL))], [0.30 * BL, interp(topB, 0.30 * BL) - 0.14 * s],
    [0.62 * BL, interp(topB, 0.62 * BL) - 0.14 * s], [0.62 * BL, interp(botB, 0.62 * BL) + 0.14 * s], [0.30 * BL, interp(botB, 0.30 * BL) + 0.14 * s]];
  [-1, 1].forEach(function(l){
    perfil(null, refB.map(function(p){ return pl(p[0], p[1]); }), 0.03, zb + l * (Wb / 2 + 0.01), 'pintura', C.pluma === C.cuerpo ? C.oscuro : C.pluma, 0.01);
  });
  /* soportes del pie de la pluma en la torna */
  [-1, 1].forEach(function(l){
    perfil(null, [[F[0] - 0.60 * s, YD], [F[0] + 0.70 * s, YD], [F[0] + 0.30 * s, F[1] + 0.28 * s], [F[0] - 0.32 * s, F[1] + 0.30 * s]],
      0.10, zb + l * (Wb / 2 + 0.07), 'pintura', C.cuerpo, 0.02);
  });
  perno('PYB', F, zb, 0.15 * s, Wb + 0.42);

  /* brazo: talon arriba para el cilindro del brazo, se angosta hacia el cucharon */
  var hl = 0.95 * s, dA = 0.80 * s;
  var contA = [[-hl - 0.05, -0.14], [-hl + 0.02, 0.26], [0.15 * AL, 0.62 * dA], [AL - 0.45 * s, 0.30 * dA], [AL + 0.16 * s, 0.14 * s],
    [AL + 0.16 * s, -0.16 * s], [AL - 0.40 * s, -0.28 * dA], [0.25 * AL, -0.50 * dA], [-0.10, -0.44 * dA]].map(function(p){ return br(p[0], p[1]); });
  perfil(null, contA, Wa, zb, 'pintura', C.brazo, 0.04);
  [-1, 1].forEach(function(l){
    perfil(null, [br(0.10 * AL, 0.30 * dA), br(AL - 0.60 * s, 0.14 * dA), br(AL - 0.60 * s, -0.16 * dA), br(0.20 * AL, -0.32 * dA)],
      0.025, zb + l * (Wa / 2 + 0.008), 'pintura', C.brazo === C.cuerpo ? C.oscuro : C.brazo, 0.008);
  });
  /* planchas de desgaste en la panza del brazo */
  placa(null, br(AL * 0.45, -0.40 * dA), br(AL - 0.35 * s, -0.27 * dA), 0.04, Wa + 0.02, zb, 'metal', '#3A3E44', 0.01);
  perno('PYB', T, zb, 0.13 * s, Wb + 0.10);

  /* cilindros de la pluma: de la torna a la panza de la pluma */
  var aLug = 0.38 * BL, lug = pl(aLug, interp(botB, aLug) - 0.17 * s);
  var base = [XF + 0.30 * s, YCW + 0.34 * s], rcB = 0.145 * s, zcB = Wb / 2 + rcB + 0.05;
  [-1, 1].forEach(function(l){
    D.cilHidD('PHY', [base[0], base[1], zb + l * zcB], [lug[0], lug[1], zb + l * zcB], rcB, C.cil, 0.56);
    bloque(null, 0.40 * s, 0.30 * s, 0.07, 'pintura', C.faldon, base[0] + 0.06, base[1] - 0.02, zb + l * (zcB + rcB + 0.04), 0.02);
    bloque(null, 0.40 * s, 0.30 * s, 0.07, 'pintura', C.faldon, base[0] + 0.06, base[1] - 0.02, zb + l * (zcB - rcB - 0.04), 0.02);
  });
  perfil(null, [pl(aLug - 0.42 * s, interp(botB, aLug - 0.42 * s) + 0.02), pl(aLug + 0.42 * s, interp(botB, aLug + 0.42 * s) + 0.02), lug],
    Wb * 0.7, zb, 'pintura', C.pluma, 0.02);
  cilindro('PYB', 0.10 * s, 0.10 * s, 2 * zcB + 2 * rcB + 0.10, 'metal', '#454A50', lug[0], lug[1], zb, [Math.PI / 2, 0, 0], 16);
  cilindro('PYB', 0.10 * s, 0.10 * s, 2 * zcB + 2 * rcB + 0.20, 'metal', '#454A50', base[0], base[1], zb, [Math.PI / 2, 0, 0], 16);

  /* cilindro del brazo: lomo de la pluma al talon del brazo */
  var aAc = 0.40 * BL, baseA = pl(aAc, interp(topB, aAc) + 0.42 * s), H = br(-hl + 0.14, 0.04), rcA = 0.165 * s;
  [-1, 1].forEach(function(l){
    perfil(null, [pl(aAc - 0.55 * s, interp(topB, aAc - 0.55 * s) - 0.05), pl(aAc + 0.50 * s, interp(topB, aAc + 0.50 * s) - 0.05), baseA],
      0.07, zb + l * (rcA + 0.07), 'pintura', C.pluma, 0.02);
  });
  D.cilHidD('PSK', [baseA[0], baseA[1], zb], [H[0], H[1], zb], rcA, C.cil, 0.55);
  perno('PYB', baseA, zb, 0.09 * s, 2 * rcA + 0.30);
  perno('PYB', H, zb, 0.09 * s, Wa + 0.10);

  /* varillaje del cucharon: biela del brazo, balancin en H y cilindro */
  var L1 = br(AL - 0.62 * s, 0.22 * dA), Q = cu(-0.02, 0.33);
  var J = cruce(L1, 0.66 * s, Q, 0.78 * s, va);
  var baseC = br(-0.05, 0.62 * dA + 0.20 * s), rcC = 0.14 * s;
  [-1, 1].forEach(function(l){
    perfil(null, [br(-0.40 * s, 0.50 * dA), br(0.35 * s, 0.56 * dA), baseC], 0.07, zb + l * (rcC + 0.07), 'pintura', C.brazo, 0.02);
    placa(null, L1, J, 0.20 * s, 0.07, zb + l * (Wa / 2 + 0.06), 'pintura', C.brazo, 0.03);
    placa(null, J, Q, 0.22 * s, 0.08, zb + l * 0.20 * s, 'pintura', C.brazo, 0.03);
  });
  D.cilHidD('PHY', [baseC[0], baseC[1], zb], [J[0], J[1], zb], rcC, C.cil, 0.55);
  perno('PYB', baseC, zb, 0.08 * s, 2 * rcC + 0.30);
  perno('PYB', L1, zb, 0.09 * s, Wa + 0.30);
  perno('PYB', J, zb, 0.09 * s, 0.40 * s + 0.20);

  /* ═══ cucharon ═══ */
  var BW = P.BW, zIn = BW / 2 - 0.035;
  var lado2 = envol.map(function(p){ return cu(p[0], p[1]); });
  [-1, 1].forEach(function(l){ perfil('LPN', lado2, 0.07, zb + l * zIn, 'pintura', C.cuchara, 0.02); });
  /* envolvente: planchas entre los puntos del contorno */
  for(var e2 = 0; e2 < envol.length - 1; e2++){
    placa('LPN', cu(envol[e2][0], envol[e2][1]), cu(envol[e2 + 1][0], envol[e2 + 1][1]), 0.06 * s, BW - 0.06, zb, 'pintura', C.cuchara, 0.015);
  }
  /* labio de arriba reforzado y labio de corte grueso */
  var tLab = cu(envol[0][0], envol[0][1]);
  cilindro('LPN', 0.07 * s, 0.07 * s, BW + 0.02, 'pintura', C.cuchara, tLab[0], tLab[1], zb, [Math.PI / 2, 0, 0], 14);
  var E = cu(0.97, 0.04), Ein = cu(0.80, -0.05);
  placa('LPN', Ein, E, 0.10 * s, BW + 0.02, zb, 'metal', '#3B3F45', 0.02);
  /* placas de desgaste en el lomo (GET) */
  (function(){
    var qs = [], g = [];
    for(var j = 0; j < 4; j++){
      var zj = zb + (j - 1.5) * BW * 0.26;
      for(var e3 = 5; e3 < 8; e3++){
        var a = cu(envol[e3][0], envol[e3][1]), b = cu(envol[e3 + 1][0], envol[e3 + 1][1]);
        var n = [qB[0] * 0.05 * s, qB[1] * 0.05 * s];
        qs.push([(a[0] + b[0]) / 2 + n[0], (a[1] + b[1]) / 2 + n[1], zj, 0, 0, Math.atan2(b[1] - a[1], b[0] - a[0])]);
        g.push(dist2(a, b));
      }
    }
    var gmax = Math.max.apply(null, g);
    muchos('GET', new THREE.BoxGeometry(gmax * 0.95, 0.05 * s, 0.10 * s), 'metal', '#43474D', qs);
  })();
  /* cuchillas laterales (GET) en el canto de la boca */
  [-1, 1].forEach(function(l){
    placa('GET', cu(0.97, 0.04), cu(0.62, -0.13), 0.14 * s, 0.09, zb + l * (zIn + 0.01), 'metal', '#3B3F45', 0.02);
  });
  /* dientes: adaptador y punta ahusada, en una sola malla cada uno */
  (function(){
    var nD = P.nD, dw = BW * 0.84, ang = Math.atan2(pB[1] * dirD[0] + qB[1] * dirD[1], pB[0] * dirD[0] + qB[0] * dirD[1]);
    var dW = [Math.cos(ang), Math.sin(ang)];
    var adap = [], tips = [], prot = [];
    for(var j = 0; j < nD; j++){
      var zj = zb + (nD > 1 ? (j / (nD - 1) - 0.5) * dw : 0);
      adap.push([E[0] + dW[0] * 0.06 * R, E[1] + dW[1] * 0.06 * R, zj, 0, 0, ang]);
      tips.push([E[0] + dW[0] * 0.17 * R, E[1] + dW[1] * 0.17 * R, zj, 0, 0, ang]);
      if(j < nD - 1) prot.push([E[0] + dW[0] * 0.02, E[1] + dW[1] * 0.02, zj + dw / (nD - 1) / 2, 0, 0, ang]);
    }
    muchos('GET', new THREE.BoxGeometry(0.30 * R, 0.13 * s, 0.17 * s), 'metal', '#4A4E54', adap);
    var gt = new THREE.BoxGeometry(0.16 * R, 0.12 * s, 0.15 * s), pos = gt.attributes.position;
    for(var v = 0; v < pos.count; v++) if(pos.getX(v) > 0){ pos.setY(v, pos.getY(v) * 0.30); pos.setZ(v, pos.getZ(v) * 0.75); }
    gt.computeVertexNormals();
    muchos('GET', gt, 'metal', '#5B5F64', tips);
    if(prot.length) muchos('GET', new THREE.BoxGeometry(0.12 * R, 0.07 * s, 0.16 * s), 'metal', '#3F4348', prot);
  })();
  /* orejas del cucharon: pasador del brazo y del balancin */
  [-1, 1].forEach(function(l){
    [Wa / 2 + 0.05, 0.20 * s + 0.08].forEach(function(zo, j){
      perfil('LPN', [cu(-0.16, -0.12), cu(-0.18, 0.42), cu(0.08, 0.48), cu(0.24, 0.30), cu(0.14, -0.14)], 0.07, zb + l * (zo + j * 0.0), 'pintura', C.cuchara, 0.015);
    });
  });
  perno('PYB', B, zb, 0.10 * s, Wa + 0.34);
  perno('PYB', Q, zb, 0.09 * s, 0.40 * s + 0.30);

  /* ═══ mangueras, engrase y faros de la pluma ═══ */
  var curva = function(code, pts, r, hex){
    var c = new THREE.CatmullRomCurve3(pts.map(function(p){ return new THREE.Vector3(p[0], p[1], p[2]); }));
    return pon(code, new THREE.TubeGeometry(c, Math.max(16, pts.length * 10), r, 8, false), 'goma', hex || '#1A1B1D');
  };
  /* dos al cilindro del brazo y dos que siguen por el brazo al del cucharon */
  [-0.12, 0.12].forEach(function(dz, j){
    var z = zb + dz * s, ptsA = [];
    [[-0.10, 0], [0.12 * BL, 0], [0.26 * BL, 0], [aAc - 0.30 * s, 0]].forEach(function(q){ var p = pl(q[0], interp(topB, q[0]) + 0.07); ptsA.push([p[0], p[1], z]); });
    var pe = pl(aAc - 0.1 * s, interp(topB, aAc) + 0.30 * s); ptsA.push([pe[0], pe[1], z + (j ? 0.18 : -0.18) * s]);
    curva('LPH', ptsA, 0.034 * s);
  });
  [-0.28, 0.28].forEach(function(dz){
    var z = zb + dz * s, pts = [];
    [-0.10, 0.12 * BL, 0.30 * BL, 0.45 * BL, 0.64 * BL, 0.85 * BL, BL - 0.10].forEach(function(a){ var p = pl(a, interp(topB, a) + 0.06); pts.push([p[0], p[1], z]); });
    var p1 = br(-0.10, 0.48 * dA), p2 = br(0.05, 0.62 * dA + 0.05);
    pts.push([p1[0], p1[1], z + (dz > 0 ? 0.12 : -0.12)]); pts.push([p2[0], p2[1], zb + (dz > 0 ? 0.10 : -0.10)]);
    curva('LPH', pts, 0.032 * s);
  });
  /* mangueras de los cilindros de la pluma */
  [-1, 1].forEach(function(l){
    var a = [base[0] + 0.25, base[1] + 0.28, zb + l * zcB], m = [base[0] + 0.60, base[1] + 0.05, zb + l * (zcB - 0.10)];
    curva('LPH', [a, m, [F[0] - 0.2, YD + 0.15, zb + l * 0.30]], 0.028 * s);
  });
  /* linea de engrase por el costado izquierdo de la pluma hasta la punta */
  (function(){
    var z = zb + Wb / 2 + 0.025, pts = [];
    [0.05, 0.25, 0.45, 0.65, 0.85, 0.98].forEach(function(f){ var a = f * BL, p = pl(a, (interp(topB, a) + interp(botB, a)) / 2 + 0.08); pts.push([p[0], p[1], z]); });
    curva('SEN', pts, 0.014, '#2A2D31');
    var pb = pl(0.06 * BL, (interp(topB, 0.06 * BL) + interp(botB, 0.06 * BL)) / 2 + 0.08);
    bloque('SEN', 0.20, 0.16, 0.06, 'metal', '#5A5F66', pb[0], pb[1], z + 0.02, 0.01);
  })();
  /* faros de trabajo en el costado de la pluma */
  [0.22, 0.30].forEach(function(f){
    var a = f * BL, p = pl(a, interp(topB, a) - 0.10 * s);
    bloque(null, 0.12, 0.18, 0.12, 'mate', '#1E2124', p[0] + 0.05, p[1], zb + Wb / 2 + 0.08, 0.02);
    faroT(p[0] - 0.06, p[1] + 0.12, zb + Wb / 2 + 0.16, -1, 0.20);
  });

  /* ═══ rotulos de la pluma ═══ */
  var aR = 0.62 * BL, pR = pl(aR, (interp(topB, aR) + interp(botB, aR)) / 2 + 0.02), dR = [ub[0], ub[1]];
  /* direccion de la pluma pasado el codo, para que el rotulo siga la plancha */
  var pk = pl(0.45 * BL, kB), pt2 = pl(0.88 * BL, 0.10 * kB);
  dR = [pt2[0] - pk[0], pt2[1] - pk[1]];
  var alto = (interp(topB, aR) - interp(botB, aR)) * 0.55;
  var texP = null, ancho = alto * 3.4;
  if(TIPO === 'cat') { texP = texRotulo3d(exmDibCAT, 512, 170); ancho = alto * 3.0; }
  else if(TIPO === 'jd') texP = texRotulo3d(exmDibTexto('DEERE', { tinta: '#FFFFFF', fuente: 'Arial, sans-serif', alto: 0.80 }), 640, 150);
  else if(TIPO === 'hy9' || TIPO === 'hx') { texP = texRotulo3d(exmDibTexto('HYUNDAI', { tinta: '#F4F4F2' }), 768, 130); ancho = alto * 5.0; }
  else if(TIPO === 'sany') { texP = texRotulo3d(exmDibSany(P.nombre === 'Sany SY750H'), 512, 170); ancho = alto * 2.6; }
  else if(TIPO === 'lg') texP = texRotulo3d(exmDibTexto('LGMG', { tinta: '#FFFFFF', alto: 0.80 }), 512, 150);
  if(texP){
    [-1, 1].forEach(function(l){ letreroDir(texP, ancho, alto, pR, zb + l * (Wb / 2 + 0.035), l, dR[0], dR[1]); });
  }

  /* ═══ centrado y camara ═══ */
  var caja = new THREE.Box3().setFromObject(G), cxG = (caja.min.x + caja.max.x) / 2, czG = (caja.min.z + caja.max.z) / 2;
  G.children.forEach(function(m){ m.position.x -= cxG; m.position.z -= czG; });
  var largo = caja.max.x - caja.min.x;
  G.userData.mirarY = Math.max(2.4, (caja.max.y) * 0.45);
  G.userData.dist = Math.min(40, Math.max(22, largo * 2.0));
  return G;
}

/* ═══ registro ═══ */
var EXM_CLAVES = [[/^374F/, '374FL'], [/^870G/, '870GLC'], [/^HX5[02]0/, 'HX500L'], [/^R380/, 'R380LC9SH'],
                  [/^SY750/, 'SY750H'], [/^SY980/, 'SY980H'], [/^ME106/, 'ME106']];
registrarModelo3d({
  nombre: 'Excavadoras medianas y grandes (CAT 374F L, JD 870G LC, Hyundai HX500L y R380LC-9SH, Sany SY750H y SY980H, LGMG ME106)',
  clave: function(e){
    var m = mod3d(e);
    for(var i = 0; i < EXM_CLAVES.length; i++) if(EXM_CLAVES[i][0].test(m)) return 'exm' + EXM_CLAVES[i][1];
    return null;
  },
  construir: function(e, piezas, clave){ return exmConstruir(EXM_P[String(clave).replace(/^exm/, '')], piezas); }
});
