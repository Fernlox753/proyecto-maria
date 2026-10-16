/* ══════════════════════════════════════════════════════════════════
   PERFORADORAS VARIAS Y MARTILLO MB 1200 — modelos de detalle (prefijo pfv)

   Martillo en cabeza (top hammer) sobre orugas, con cabina y pluma:
     Sandvik Ranger DX700 ...... EP-34, EP-25
     Sandvik Pantera DP1100 .... EP-37
     Everdigm T450 ............. EP-174-AL, EP-186-AL (ROCK DRILL)
     Soosan JD-1400E ........... EP-159-AL
     Soosan JD-2000 ............ EP-122-AL
   Rotativa de torre (multi pass):
     Atlas Copco DM45 (DM45E) .. EP-18
   Martillo hidraulico para excavadora:
     Atlas Copco MB 1200 ....... MH-06

   Medidas (m):              DX700   DP1100   T450    JD1400*  JD2000*  DM45
     largo de transporte     11.3    11.1-11.5 9.29   ~10.3    ~11.0    13.3 (torre abajo)
     ancho                    2.45    2.50    2.305   ~2.45    ~2.50    5.23 (torre arriba)
     alto (cabina)            3.2     3.3     2.86    ~2.9     ~3.0     13.3 con la torre
     viga de avance           7.70   ~8.6     6.95    7.9 (26')~8.5     torre de 30' (9.1)
     orugas: contacto/teja  2.59/0.31 ~3.2/0.40 ~2.9/0.30 ~2.6/0.33 ~2.9/0.35  4.6/0.60
     peso (t)                15.2    22.9    14.0    ~15      ~17      35-41
   Fuentes: Sandvik «Ranger DX700 T3 technical specification» (2024-02-29,
   con el dibujo acotado de transporte: de ahi salen cabina, capot y
   orugas medidos a escala); Sandvik Pantera DPi brochure y ficha DP1100i
   (11.1/11.5 x 2.5 x 3.28/3.34 m, 22 900 kg); Everdigm «T350/T400/T450
   Top-Hammer drill rigs» (2014: 9 290 x 2 305 x 2 860 mm, viga 6 950 mm,
   pluma telescopica 4 300 mm; el dibujo lateral se midio a escala con la
   viga); Atlas Copco «DM45-series» (2015: 9.7 x 5.23 x 13.3 m torre
   arriba, tejas de 600 mm, tres gatas, carrusel de cinco barras).
   *Soosan no publica medidas del JD1400E ni del JD-2000: salen de fotos de
   Soosan America (JD1400E-II) con la teja de 13" y el mastil de 26' de un
   aviso de venta como escala; el JD-2000 se supone un punto mas grande.
   El DP-1100 de la EP-37 (sin la «i») se arma con las medidas del DP1100i.

   Disposicion (fotos y dibujos): la superestructura gira sobre el tren;
   la cabina adelante a la izquierda (+Z), la pluma sale del frente
   derecho y la viga de avance queda vertical delante, perforando. Detras
   de la cabina el capot del motor y el compresor, y al fondo el colector
   de polvo. La DM45 se arma como la DML de modelo_perforadoras.js (es su
   hermana chica): torre al centro, cabina a su lado en el extremo de
   perforacion y el enfriador atras.

   Colores: Sandvik cuerpo rojo anaranjado, pluma y viga naranja, cabina
   gris claro con el panel oscuro RANGER (DX700) o el negro PANTERA y la
   tapa negra del enfriador (DP1100); Everdigm turquesa con pluma, viga y
   tren gris; Soosan amarillo con pluma, viga, tren y colector negros y la
   manguera de succion azul; DM45 amarilla con la torre gris.
   ══════════════════════════════════════════════════════════════════ */

/* ═══ herramientas comunes (adaptadas de modelo_perforadoras.js, con el prefijo pfv) ═══ */
var PFV_NEGRO = '#17191C', PFV_GOMA = '#141619', PFV_ACERO = '#6E747B', PFV_GRIS = '#3A3F45', PFV_GRIS2 = '#565D65';

/* ═══ lienzos ═══ */
/* malla de alambre de las rejillas (enfriadores, puertas del motor) */
function pfvTexMalla(fondo, hilo, n, grueso){
  var c = document.createElement('canvas'); c.width = 128; c.height = 128;
  var g = c.getContext('2d');
  g.fillStyle = fondo; g.fillRect(0, 0, 128, 128);
  g.strokeStyle = hilo; g.lineWidth = grueso || 2.4;
  var p = 128 / n;
  for(var i = 0; i <= n; i++){
    g.beginPath(); g.moveTo(i * p, 0); g.lineTo(i * p, 128); g.stroke();
    g.beginPath(); g.moveTo(0, i * p); g.lineTo(128, i * p); g.stroke();
  }
  var t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
  return t;
}
/* piso de rejilla de las pasarelas: platinas paralelas con travesanos */
function pfvTexPiso(fondo, platina){
  var c = document.createElement('canvas'); c.width = 128; c.height = 128;
  var g = c.getContext('2d');
  g.fillStyle = '#0E0F11'; g.fillRect(0, 0, 128, 128);
  g.fillStyle = platina;
  for(var i = 0; i < 8; i++) g.fillRect(0, i * 16, 128, 6);
  g.fillStyle = fondo;
  for(var j = 0; j < 4; j++) g.fillRect(j * 32, 0, 4, 128);
  var t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
  return t;
}

/* ═══ herramientas: kitDetalle mas lo que piden las perforadoras ═══ */
function pfvKit(H, piezas){
  var D = kitDetalle(H, piezas);
  var P = {};
  for(var k in D) P[k] = D[k];
  var M = D.M;
  var EJE_Y = new THREE.Vector3(0, 1, 0);
  var o3 = new THREE.Object3D();

  /* muchas piezas iguales en una sola malla: [x,y,z, rx,ry,rz, sx,sy,sz] */
  P.inst = function(code, geo, tipo, hex, lista){
    if(!lista.length) return null;
    var m = new THREE.InstancedMesh(geo, M[tipo](hex), lista.length);
    lista.forEach(function(q, i){
      o3.position.set(q[0], q[1], q[2]);
      o3.rotation.set(q[3] || 0, q[4] || 0, q[5] || 0);
      o3.scale.set(q[6] || 1, q[7] || 1, q[8] || 1);
      o3.updateMatrix(); m.setMatrixAt(i, o3.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    /* la geometria esta en el origen: sin esto se apagaria al salir el origen de cuadro */
    m.frustumCulled = false;
    return D.reg(code, m, hex);
  };
  /* barras entre pares de puntos [[a],[b],r?] en una sola malla (celosias, barandas) */
  P.barras = function(code, lista, r, tipo, hex, redonda){
    if(!lista.length) return null;
    var geo = redonda ? new THREE.CylinderGeometry(1, 1, 1, 10) : new THREE.BoxGeometry(1, 1, 1);
    var m = new THREE.InstancedMesh(geo, M[tipo](hex), lista.length);
    var va = new THREE.Vector3(), vb = new THREE.Vector3();
    lista.forEach(function(b, i){
      va.set(b[0][0], b[0][1], b[0][2]); vb.set(b[1][0], b[1][1], b[1][2]);
      var dir = vb.clone().sub(va), L = dir.length(), rr = b[2] || r;
      o3.position.copy(va).add(vb).multiplyScalar(0.5);
      o3.rotation.set(0, 0, 0);
      o3.quaternion.setFromUnitVectors(EJE_Y, dir.normalize());
      o3.scale.set(rr * 2, L, rr * 2);
      o3.updateMatrix(); m.setMatrixAt(i, o3.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
    m.frustumCulled = false;
    return D.reg(code, m, hex);
  };
  /* acumuladores: lo chico y sin codigo se junta por color y se vuelca al final */
  var cubos = {};
  var cubo = function(clave){ return cubos[clave] || (cubos[clave] = []); };
  P.barra = function(a, b, r, hex, tipo){ cubo('b|' + (tipo || 'pintura') + '|' + hex).push([a, b, r]); };
  P.caja = function(x, y, z, sx, sy, sz, ry, hex, tipo){ cubo('c|' + (tipo || 'pintura') + '|' + hex).push([x, y, z, 0, ry || 0, 0, sx, sy, sz]); };
  P.vaciar = function(){
    for(var c in cubos){
      var p = c.split('|');
      if(p[0] === 'b') P.barras(null, cubos[c], 0.02, p[1], p[2], true);
      else P.inst(null, new THREE.BoxGeometry(1, 1, 1), p[1], p[2], cubos[c]);
    }
    cubos = {};
  };

  /* plano con textura (rejillas, pisos): mira a +Z con ry = 0 */
  P.plano = function(code, tex, w, h, ru, rv, x, y, z, rot, hex){
    var t = tex.clone(); t.needsUpdate = true; t.repeat.set(ru, rv);
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
      new THREE.MeshStandardMaterial({ map: t, color: new THREE.Color(hex || '#FFFFFF'), roughness: 0.6, metalness: 0.35 }));
    m.position.set(x, y, z);
    if(rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
    return D.reg(code, m, hex || '#FFFFFF');
  };
  var texMalla = pfvTexMalla('#121315', '#8C939A', 9, 2.6);
  var texPiso = pfvTexPiso('#6A7077', '#80868D');
  /* rejilla: fondo oscuro, malla y marco; n = normal de la cara ('+x','-x','+z','-z') */
  P.rejilla = function(code, w, h, x, y, z, n, hexMarco){
    var ry = { '+z': 0, '-z': Math.PI, '+x': Math.PI / 2, '-x': -Math.PI / 2 }[n];
    var nx = Math.round(Math.sin(ry)), nz = Math.round(Math.cos(ry));
    P.bloque(null, nx ? 0.05 : w, h, nx ? w : 0.05, 'mate', '#0D0E10', x - nx * 0.02, y, z - nz * 0.02, 0.01);
    P.plano(code, texMalla, w - 0.08, h - 0.08, (w - 0.08) / 0.30, (h - 0.08) / 0.30, x + nx * 0.012, y, z + nz * 0.012, [0, ry, 0]);
    /* marco de angulo */
    var e = 0.05, dx = nx ? 0 : 1, dz = nx ? 1 : 0;
    [[0, (h - e) / 2, w, e], [0, -(h - e) / 2, w, e]].forEach(function(q){
      P.caja(x + nx * 0.03, y + q[1], z + nz * 0.03, dx ? q[2] : 0.04, q[3], dz ? q[2] : 0.04, 0, hexMarco);
    });
    [-(w - e) / 2, (w - e) / 2].forEach(function(o){
      P.caja(x + nx * 0.03 + dx * o, y, z + nz * 0.03 + dz * o, dx ? e : 0.04, h, dz ? e : 0.04, 0, hexMarco);
    });
  };
  /* cubierta: losa con canto, piso de rejilla encima */
  P.piso = function(x0, x1, z0, z1, y, esp, hex){
    P.bloque(null, x1 - x0, esp, z1 - z0, 'pintura', hex, (x0 + x1) / 2, y - esp / 2, (z0 + z1) / 2, 0.03);
    P.plano(null, texPiso, x1 - x0 - 0.12, z1 - z0 - 0.12, (x1 - x0) / 0.6, (z1 - z0) / 0.6,
      (x0 + x1) / 2, y + 0.004, (z0 + z1) / 2, [-Math.PI / 2, 0, 0], '#B9BEC4');
  };
  /* baranda tubular con postes cada 1.4 m y rodapie */
  P.baranda = function(pts, y0, alto, hex, rodapie){
    for(var k = 0; k < pts.length; k++){
      var p = pts[k];
      P.barra([p[0], y0, p[1]], [p[0], y0 + alto, p[1]], 0.026, hex);
      if(!k) continue;
      var q = pts[k - 1];
      P.barra([q[0], y0 + alto, q[1]], [p[0], y0 + alto, p[1]], 0.026, hex);
      P.barra([q[0], y0 + alto * 0.52, q[1]], [p[0], y0 + alto * 0.52, p[1]], 0.02, hex);
      var L = Math.hypot(p[0] - q[0], p[1] - q[1]), np = Math.floor(L / 1.4);
      for(var j = 1; j <= np; j++){
        var f = j / (np + 1), xx = q[0] + (p[0] - q[0]) * f, zz = q[1] + (p[1] - q[1]) * f;
        P.barra([xx, y0, zz], [xx, y0 + alto, zz], 0.022, hex);
      }
      if(rodapie) P.caja((p[0] + q[0]) / 2, y0 + 0.07, (p[1] + q[1]) / 2, L, 0.12, 0.012, -Math.atan2(p[1] - q[1], p[0] - q[0]), rodapie);
    }
  };
  /* escalera de gato vertical; eje = direccion de los peldanos ('x' o 'z') */
  P.escaleraV = function(x, z, y0, y1, ancho, eje, hex){
    var dx = eje === 'x' ? ancho / 2 : 0, dz = eje === 'z' ? ancho / 2 : 0;
    P.caja(x - dx, (y0 + y1) / 2, z - dz, eje === 'x' ? 0.05 : 0.07, y1 - y0, eje === 'z' ? 0.05 : 0.07, 0, hex);
    P.caja(x + dx, (y0 + y1) / 2, z + dz, eje === 'x' ? 0.05 : 0.07, y1 - y0, eje === 'z' ? 0.05 : 0.07, 0, hex);
    var n = Math.max(2, Math.round((y1 - y0) / 0.30));
    for(var i = 0; i < n; i++){
      var y = y0 + 0.08 + (y1 - y0 - 0.1) * i / (n - 1);
      P.barra([x - dx, y, z - dz], [x + dx, y, z + dz], 0.019, '#4A4F55', 'metal');
    }
  };
  /* escalera inclinada de a (abajo) a b (arriba): largueros y peldanos de rejilla */
  P.escaleraI = function(a, b, ancho, hex){
    var hx = b[0] - a[0], hz = b[2] - a[2], Lh = Math.hypot(hx, hz), ux = hx / Lh, uz = hz / Lh;
    var px = -uz * ancho / 2, pz = ux * ancho / 2, ry = -Math.atan2(hz, hx);
    [-1, 1].forEach(function(s){
      P.barra([a[0] + s * px, a[1], a[2] + s * pz], [b[0] + s * px, b[1], b[2] + s * pz], 0.035, hex);
      P.barra([a[0] + s * px * 1.05, a[1] + 0.9, a[2] + s * pz * 1.05], [b[0] + s * px * 1.05, b[1] + 0.9, b[2] + s * pz * 1.05], 0.022, hex);
      P.barra([a[0] + s * px * 1.05, a[1], a[2] + s * pz * 1.05], [a[0] + s * px * 1.05, a[1] + 0.9, a[2] + s * pz * 1.05], 0.022, hex);
    });
    var n = Math.max(2, Math.round((b[1] - a[1]) / 0.24));
    for(var i = 1; i < n; i++){
      var f = i / n;
      P.caja(a[0] + hx * f, a[1] + (b[1] - a[1]) * f, a[2] + hz * f, 0.22, 0.03, ancho - 0.04, ry, '#50565D', 'metal');
    }
  };
  /* manguera por una curva suave */
  P.manguera = function(code, pts, r, hex){
    var curva = new THREE.CatmullRomCurve3(pts.map(function(p){ return new THREE.Vector3(p[0], p[1], p[2]); }));
    var m = new THREE.Mesh(new THREE.TubeGeometry(curva, Math.max(12, pts.length * 8), r, 8, false), M.goma(hex || '#1C1E21'));
    return D.reg(code, m, hex || '#1C1E21');
  };
  /* faro de trabajo rectangular; n = normal hacia donde alumbra */
  P.faroT = function(code, x, y, z, n){
    var ry = { '+z': 0, '-z': Math.PI, '+x': Math.PI / 2, '-x': -Math.PI / 2 }[n];
    var nx = Math.round(Math.sin(ry)), nz = Math.round(Math.cos(ry));
    P.bloque(null, nx ? 0.12 : 0.22, 0.16, nx ? 0.22 : 0.12, 'mate', '#1E2125', x, y, z, 0.025);
    var m = P.bloque(code, nx ? 0.02 : 0.17, 0.11, nx ? 0.17 : 0.02, 'vidrio', '#F4EDCF', x + nx * 0.065, y, z + nz * 0.065, 0.005);
    m.material.emissive = new THREE.Color('#5C5440');
    P.caja(x - nx * 0.08, y - 0.12, z - nz * 0.08, 0.05, 0.10, 0.05, 0, '#1E2125', 'mate');
  };
  /* baliza ambar */
  P.baliza = function(code, x, y, z){
    P.cilindro(code, 0.07, 0.08, 0.06, 'mate', '#2A2D31', x, y + 0.03, z, null, 16);
    var b = new THREE.Mesh(new THREE.SphereGeometry(0.085, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.45, roughness: 0.3 }));
    b.position.set(x, y + 0.06, z); H.add(b);
  };
  /* gata niveladora bajada: camisa, vastago cromado, rotula y zapata */
  P.gata = function(code, x, z, yTop, hex, r){
    r = r || 0.17;
    var yB = 0.92;
    P.cilindro(code, r, r, yTop - yB, 'pintura', hex, x, (yTop + yB) / 2, z, null, 22);
    P.cilindro(null, r * 1.25, r * 1.25, 0.14, 'pintura', hex, x, yTop - 0.10, z, null, 22);
    P.cilindro(null, r * 1.15, r * 1.15, 0.08, 'pintura', hex, x, yB + 0.04, z, null, 22);
    P.cilindro(null, r * 0.62, r * 0.62, yB - 0.12, 'cromo', null, x, (yB + 0.18) / 2, z, null, 18);
    P.pon(null, new THREE.SphereGeometry(r * 0.72, 14, 10), 'metal', '#3A3F45', x, 0.17, z);
    P.cilindro(null, 0.30, 0.38, 0.07, 'mate', '#2A2D31', x, 0.115, z, null, 28);
    P.cilindro(null, 0.40, 0.40, 0.08, 'mate', '#2A2D31', x, 0.04, z, null, 28);
  };

  /* oruga: tejas de triple garra, eslabones, rueda guia adelante, catarina y
     mando final atras, rodillos abajo y arriba, bastidor. Las tejas de una
     oruga van en una sola malla instanciada (el mapa de calor la pinta entera) */
  P.oruga = function(o){
    var A = o.alto, R = A / 2, yc = R, x0 = o.x0, x1 = o.x1, zc = o.zc, W = o.ancho, s = o.lado;
    var recto = x1 - x0 - A, paso = o.paso || 0.24, tE = Math.max(0.05, A * 0.07);
    var Rp = R - tE / 2, per = 2 * recto + 2 * Math.PI * Rp, n = Math.round(per / paso);
    var zap = [], gar = [], esl = [];
    var loc = function(x, y, ang, lx, ly){ return [x + Math.cos(ang) * lx - Math.sin(ang) * ly, y + Math.sin(ang) * lx + Math.cos(ang) * ly]; };
    for(var i = 0; i < n; i++){
      var d = i / n * per, x, y, ang;
      if(d < recto){ x = x0 + R + d; y = yc + Rp; ang = 0; }
      else if(d < recto + Math.PI * Rp){ var t = (d - recto) / Rp; x = x1 - R + Math.sin(t) * Rp; y = yc + Math.cos(t) * Rp; ang = -t; }
      else if(d < 2 * recto + Math.PI * Rp){ x = x1 - R - (d - recto - Math.PI * Rp); y = yc - Rp; ang = Math.PI; }
      else { var t2 = (d - 2 * recto - Math.PI * Rp) / Rp; x = x0 + R - Math.sin(t2) * Rp; y = yc - Math.cos(t2) * Rp; ang = Math.PI - t2; }
      zap.push([x, y, zc, 0, 0, ang]);
      (o.garras === 1 ? [0] : [-0.30, 0, 0.30]).forEach(function(f){
        var q = loc(x, y, ang, f * paso, tE / 2 + 0.02);
        gar.push([q[0], q[1], zc, 0, 0, ang]);
      });
      [-1, 1].forEach(function(lz){
        var q = loc(x, y, ang, 0, -(tE / 2 + A * 0.055));
        esl.push([q[0], q[1], zc + lz * W * 0.23, 0, 0, ang]);
      });
    }
    P.inst(o.code, new THREE.BoxGeometry(paso * 0.92, tE, W), 'mate', '#2B2E32', zap);
    P.inst(o.code, new THREE.BoxGeometry(0.03, o.garras === 1 ? A * 0.07 : A * 0.045, W * 0.98), 'mate', '#25282C', gar);
    P.inst(null, new THREE.BoxGeometry(paso * 0.96, A * 0.11, W * 0.09), 'metal', '#3B3F44', esl);
    /* radio donde corren los eslabones: la rueda guia y la catarina ruedan ahi */
    var Ri = Rp - tE / 2 - A * 0.11;
    /* rueda guia con su llanta y masa */
    P.cilindro(null, Ri, Ri, W * 0.34, 'metal', '#3D4248', x0 + R, yc, zc, [Math.PI / 2, 0, 0], 32);
    P.cilindro(null, Ri * 0.92, Ri * 0.92, W * 0.62, 'metal', '#33373C', x0 + R, yc, zc, [Math.PI / 2, 0, 0], 28);
    P.cilindro(null, Ri * 0.35, Ri * 0.35, W * 0.70, 'metal', '#5A6067', x0 + R, yc, zc, [Math.PI / 2, 0, 0], 16);
    /* tensor de la cadena: cilindro cromado detras de la rueda guia */
    P.tubo(null, [x0 + R + Ri * 0.6, yc, zc], [x0 + R + Ri * 0.6 + A * 0.7, yc, zc], A * 0.06, 'cromo', null, 12);
    /* catarina: dos discos dentados y el mando final por dentro */
    var xs = x1 - R, dientes = [];
    [-1, 1].forEach(function(lz){
      P.cilindro(null, Ri * 0.97, Ri * 0.97, 0.07, 'metal', '#3B3F45', xs, yc, zc + lz * W * 0.10, [Math.PI / 2, 0, 0], 32);
      for(var k = 0; k < 13; k++){
        var a = k / 13 * Math.PI * 2;
        dientes.push([xs + Math.cos(a) * (Ri + 0.02), yc + Math.sin(a) * (Ri + 0.02), zc + lz * W * 0.10, 0, 0, a]);
      }
    });
    P.inst(null, new THREE.BoxGeometry(0.10, A * 0.09, 0.07), 'metal', '#3B3F45', dientes);
    P.cilindro(o.mando, Ri * 0.80, Ri * 0.92, W * 0.42, 'metal', '#454B52', xs, yc, zc - s * (W * 0.35), [Math.PI / 2, 0, 0], 28);
    P.cilindro(o.mando, Ri * 0.55, Ri * 0.65, 0.16, 'metal', '#3A3F45', xs, yc, zc - s * (W * 0.62), [Math.PI / 2, 0, 0], 24);
    var pern = [];
    for(var b = 0; b < 12; b++){
      var ab = b / 12 * Math.PI * 2;
      pern.push([xs + Math.cos(ab) * Ri * 0.68, yc + Math.sin(ab) * Ri * 0.68, zc - s * (W * 0.56 + 0.02), Math.PI / 2, 0, 0]);
    }
    P.inst(null, new THREE.CylinderGeometry(0.025, 0.025, 0.05, 6), 'metal', '#8A8F95', pern);
    /* bastidor de rodillos con su tapa inclinada */
    var yr0 = tE + A * 0.11, rR = A * 0.12, yF0 = yr0 + rR, yF1 = A - tE - A * 0.11 - A * 0.17;
    P.bloque(o.code, recto - Ri * 0.6, yF1 - yF0, W * 0.40, 'pintura', o.hexB, (x0 + x1) / 2, (yF0 + yF1) / 2, zc, 0.04);
    P.bloque(null, recto - Ri, 0.05, W * 0.62, 'pintura', o.hexB, (x0 + x1) / 2, yF1 + 0.02, zc, 0.015);
    /* rodillos inferiores con pestanas */
    var nr = Math.max(5, Math.round(recto / (A * 0.42))), rod = [], pes = [];
    for(var r2 = 0; r2 < nr; r2++){
      var xr = x0 + R + (r2 + 0.5) * recto / nr;
      rod.push([xr, yr0 + rR, zc, Math.PI / 2, 0, 0]);
      [-1, 1].forEach(function(lz){ pes.push([xr, yr0 + rR, zc + lz * W * 0.17, Math.PI / 2, 0, 0]); });
    }
    P.inst(null, new THREE.CylinderGeometry(rR, rR, W * 0.40, 18), 'metal', '#4A5056', rod);
    P.inst(null, new THREE.CylinderGeometry(rR * 1.28, rR * 1.28, 0.04, 18), 'metal', '#4A5056', pes);
    /* guarda de rodillos por fuera y fila de pernos del bastidor */
    P.bloque(null, recto - Ri * 0.8, yF0 - yr0 + 0.04, 0.035, 'pintura', o.hexB, (x0 + x1) / 2, (yr0 + yF0) / 2 + 0.04, zc + s * W * 0.31, 0.01);
    var pf = [];
    for(var b2 = 0; b2 < nr * 2; b2++){
      pf.push([x0 + R + (b2 + 0.5) * recto / (nr * 2), (yF0 + yF1) / 2 + 0.05, zc + s * W * 0.205, Math.PI / 2, 0, 0]);
    }
    P.inst(null, new THREE.CylinderGeometry(0.022, 0.022, 0.03, 6), 'metal', '#8A8F95', pf);
    /* rodillos superiores con su soporte */
    [0.33, 0.67].forEach(function(f){
      var xr = x0 + R + recto * f, yr = A - tE - A * 0.11 - A * 0.09;
      P.cilindro(null, A * 0.09, A * 0.09, W * 0.40, 'metal', '#4A5056', xr, yr, zc, [Math.PI / 2, 0, 0], 16);
      P.caja(xr, (yr + yF1) / 2, zc - s * W * 0.25, 0.12, yr - yF1 + 0.1, 0.06, 0, o.hexB);
    });
  };
  return P;
}

/* ═══ el mastil de celosia con todo lo que corre en el ═══
   o: xa < xb caras delantera y trasera, za < zb, y0, y1, hex, cuerda, paso;
      xe, ze eje de perforacion (delante de la cara xa); yRot altura del cabezal;
      hexRot, rTubo, carr {x,z,rc,n,r,y0,y1,tapa}, lev [[a,b],..], hexLev,
      yMesa, campana {x0,x1,z0,z1}, escalera hex, codRed (reductor) */
function pfvTorre(P, o){
  /* los mastiles oscuros van en 'mate': con laca el estudio los blanquea */
  var c = o.cuerda, h = o.y1 - o.y0, xm = (o.xa + o.xb) / 2, zm = (o.za + o.zb) / 2;
  var xa = o.xa + c / 2, xb = o.xb - c / 2, za = o.za + c / 2, zb = o.zb - c / 2;
  /* cuerdas de tubo rectangular */
  [[xa, za], [xa, zb], [xb, za], [xb, zb]].forEach(function(q){
    P.bloque(null, c, h, c, o.tipo || 'pintura', o.hex, q[0], o.y0 + h / 2, q[1], 0.012);
  });
  /* celosia: horizontales en las cuatro caras y diagonales alternadas en
     tres (la cara delantera queda libre para las guias del cabezal) */
  var L = [], n = Math.round(h / o.paso), ps = h / n;
  for(var i = 0; i <= n; i++){
    var y = o.y0 + i * ps;
    L.push([[xa, y, za], [xb, y, za]], [[xa, y, zb], [xb, y, zb]], [[xb, y, za], [xb, y, zb]]);
    if(i % 2 === 0) L.push([[xa, y, za], [xa, y, zb]]);
    if(i === n) break;
    var y2 = y + ps, s = i % 2;
    L.push([[s ? xa : xb, y, za], [s ? xb : xa, y2, za]]);
    L.push([[s ? xa : xb, y, zb], [s ? xb : xa, y2, zb]]);
    L.push([[xb, y, s ? za : zb], [xb, y2, s ? zb : za]]);
  }
  P.barras(null, L, c * 0.28, o.tipo || 'pintura', o.hex, false);
  /* corona arriba: marco, poleas de las cadenas y pararrayos */
  P.bloque(null, o.xb - o.xa + 0.22, 0.22, o.zb - o.za + 0.22, o.tipo || 'pintura', o.hex, xm, o.y1 + 0.11, zm, 0.03);
  [-1, 1].forEach(function(sz){
    P.pon('MAV', new THREE.TorusGeometry(0.24, 0.06, 10, 24), 'metal', '#3A3F45', o.xa + 0.10, o.y1 - 0.30, zm + sz * 0.20);
    P.cilindro(null, 0.06, 0.06, 0.5, 'metal', '#8A9097', o.xa + 0.10, o.y1 - 0.30, zm, [Math.PI / 2, 0, 0], 10);
  });
  P.tubo(null, [xb, o.y1 + 0.22, zb], [xb, o.y1 + 1.0, zb], 0.018, 'metal', '#8A9097', 6);
  /* letrero de la marca en lo alto del mastil, a los dos costados */
  if(o.letrero){
    [o.zb, o.za].forEach(function(z, k){
      P.bloque(null, o.xb - o.xa - 0.1, 0.42, 0.03, o.tipo || 'pintura', o.hex, xm, o.y1 - 1.0, z + (k ? -0.03 : 0.03), 0.01);
      P.letrero(o.letrero, o.xb - o.xa - 0.16, 0.34, xm, o.y1 - 1.0, z + (k ? -0.047 : 0.047), k ? Math.PI : 0);
    });
  }
  /* abrazaderas de mangueras en la cara trasera */
  var abr = [];
  for(var ya2 = o.y0 + 1.5; ya2 < o.y1 - 1; ya2 += 1.6) abr.push([o.xb + 0.08, ya2, zm + 0.05]);
  P.inst(null, new THREE.BoxGeometry(0.10, 0.06, 0.42), 'metal', '#2A2D31', abr);
  P.faroT('LSM', o.xa - 0.05, o.y1 - 0.05, zb - 0.1, '-x');
  /* guias del cabezal en la cara delantera */
  [o.za + 0.08, o.zb - 0.08].forEach(function(z){
    P.bloque(null, 0.08, h - 0.4, 0.10, 'metal', '#80878E', o.xa - 0.04, o.y0 + h / 2, z, 0.01);
  });
  /* cadenas de avance (dos) y cilindro de avance dentro del mastil */
  [-0.20, 0.20].forEach(function(dz){
    P.bloque('MAV', 0.05, h - 0.8, 0.06, 'metal', '#2B2E33', o.xa - 0.02, o.y0 + h / 2, zm + dz, 0.01);
  });
  P.tubo('MAV', [xm, o.y0 + 0.5, zm], [xm, o.y0 + h * 0.58, zm], 0.12, 'pintura', '#3B3F45', 18);
  P.tubo(null, [xm, o.y0 + h * 0.58, zm], [xm, o.y1 - 1.0, zm], 0.07, 'cromo', null, 14);
  P.pon('MAV', new THREE.TorusGeometry(0.20, 0.05, 10, 22), 'metal', '#3A3F45', o.xa + 0.12, o.y0 + 0.45, zm + 0.20);
  /* pivote del mastil (pasadores y bocinas) */
  P.cilindro('PYB', 0.14, 0.14, o.zb - o.za + 0.36, 'metal', '#4A5056', o.xb - 0.15, o.y0 + 0.15, zm, [Math.PI / 2, 0, 0], 18);
  [o.za - 0.16, o.zb + 0.16].forEach(function(z){
    P.cilindro(null, 0.20, 0.20, 0.08, o.tipo || 'pintura', o.hex, o.xb - 0.15, o.y0 + 0.15, z, [Math.PI / 2, 0, 0], 18);
  });

  /* cabezal de rotacion: carro en las guias, caja reductora, dos motores, gooseneck */
  var yR = o.yRot, xe = o.xe, ze = o.ze, wR = Math.min(1.05, o.zb - o.za + 0.12);
  P.bloque('CRT', o.xa - xe + 0.12, 0.95, wR, 'pintura', o.hexRot, (xe + o.xa) / 2 - 0.02, yR + 0.55, ze, 0.05);
  P.cilindro(o.codRed || 'CRT', 0.42, 0.46, 0.42, 'pintura', o.hexRot, xe, yR + 0.21, ze, null, 28);
  [-1, 1].forEach(function(sz){
    P.cilindro('CRT', 0.13, 0.13, 0.42, 'metal', '#4A5058', xe + 0.05, yR + 1.24, ze + sz * 0.26, null, 18);
    P.cilindro(null, 0.15, 0.15, 0.06, 'metal', '#3A3F45', xe + 0.05, yR + 1.04, ze + sz * 0.26, null, 18);
    P.manguera('LPH', [[xe + 0.05, yR + 1.45, ze + sz * 0.26], [xe + 0.25, yR + 1.75, ze + sz * 0.32], [o.xa - 0.05, yR + 2.0, ze + sz * 0.42]], 0.035);
    /* zapatas del carro sobre las guias */
    P.bloque(null, 0.14, 0.70, 0.12, 'metal', '#2E3237', o.xa - 0.10, yR + 0.55, sz > 0 ? o.zb - 0.08 : o.za + 0.08, 0.02);
  });
  /* cuello de cisne del aire */
  P.cilindro(null, 0.10, 0.10, 0.28, 'metal', '#5A6067', xe, yR + 1.16, ze, null, 16);
  P.pon(null, new THREE.TorusGeometry(0.20, 0.07, 10, 18, Math.PI), 'metal', '#5A6067', xe + 0.20, yR + 1.30, ze, [0, 0, 0]);
  /* sustituto y barra de perforacion hasta el suelo */
  P.cilindro(null, o.rTubo * 1.35, o.rTubo * 1.35, 0.32, 'metal', '#5A6067', xe, yR - 0.16, ze, null, 20);
  P.cilindro(null, o.rTubo, o.rTubo, yR - 0.32, 'metal', PFV_ACERO, xe, (yR - 0.32) / 2, ze, null, 20);
  P.cilindro(null, o.rTubo * 1.18, o.rTubo * 1.18, 0.30, 'metal', '#5E646B', xe, o.yMesa + 1.4, ze, null, 20);
  /* mesa: buje centralizador y llave de quiebre (cilindro de llave U) */
  P.pon(null, new THREE.TorusGeometry(o.rTubo + 0.10, 0.05, 10, 24), 'metal', '#3A3F45', xe, o.yMesa + 0.04, ze, [Math.PI / 2, 0, 0]);
  P.cilHidD('PHW', [xe + 0.25, o.yMesa + 0.16, ze + 0.95], [xe + 0.05, o.yMesa + 0.16, ze + 0.32], 0.075, o.hexLev, 0.55);
  P.bloque(null, 0.30, 0.10, 0.10, 'metal', '#3A3F45', xe, o.yMesa + 0.16, ze + 0.22, 0.02);
  [-1, 1].forEach(function(sx){ P.bloque(null, 0.08, 0.10, 0.24, 'metal', '#3A3F45', xe + sx * 0.15, o.yMesa + 0.16, ze + 0.12, 0.02); });

  /* carrusel de barras */
  if(o.carr){
    var C = o.carr, tubos = [];
    P.tubo('MCR', [C.x, C.y0 - 0.2, C.z], [C.x, C.y1 + 0.3, C.z], 0.06, 'metal', '#5A6067', 12);
    [C.y0, C.y1, (C.y0 + C.y1) / 2].forEach(function(y, k){
      P.cilindro('MCR', C.rc + C.r + 0.06, C.rc + C.r + 0.06, k === 2 ? 0.03 : 0.07, o.tipo || 'pintura', o.hex, C.x, y, C.z, null, 24);
    });
    for(var t = 0; t < C.n; t++){
      var a = t / C.n * Math.PI * 2;
      tubos.push([C.x + Math.cos(a) * C.rc, (C.y0 + C.y1) / 2 + 0.2, C.z + Math.sin(a) * C.rc]);
    }
    P.inst(null, new THREE.CylinderGeometry(C.r, C.r, C.y1 - C.y0 + 0.2, 16), 'metal', PFV_ACERO, tubos);
    P.cilindro('MCR', 0.12, 0.12, 0.30, 'metal', '#3A3F45', C.x, C.y1 + 0.2, C.z, null, 14);
    /* brazos de giro que lo llevan al eje */
    [C.y0 + 0.4, C.y1 - 0.4].forEach(function(y){
      P.tubo('MCR', [C.x, y, C.z], [o.xa + 0.05, y, C.z > zm ? zb : za], 0.06, o.tipo || 'pintura', o.hex, 10);
    });
    if(C.tapa){
      var tapa = new THREE.Mesh(new THREE.CylinderGeometry(C.rc + C.r + 0.12, C.rc + C.r + 0.12, C.y1 - C.y0, 24, 1, true, 0, Math.PI),
        P.M.pintura(C.tapa));
      tapa.material.side = THREE.DoubleSide;
      tapa.position.set(C.x, (C.y0 + C.y1) / 2, C.z);
      tapa.rotation.y = C.z > zm ? 0 : Math.PI;
      P.reg(null, tapa, C.tapa);
    }
  }
  /* cilindros de levante del mastil */
  (o.lev || []).forEach(function(q){
    P.cilHidD('HRH', q[0], q[1], o.rLev || 0.12, o.hexLev, 0.58);
    P.bloque(null, 0.34, 0.20, 0.24, o.tipo || 'pintura', o.hex, q[1][0] + 0.10, q[1][1], q[1][2], 0.03);
  });
  /* manguera del aire y mazo hidraulico colgando de la corona al cabezal */
  P.manguera('LPA', [[o.xa - 0.10, o.y1 - 0.5, o.zb + 0.12], [o.xa - 0.35, (o.y1 + yR) / 2 + 1.5, o.zb + 0.30],
    [xe - 0.20, yR + 2.2, ze + 0.45], [xe + 0.20, yR + 1.42, ze]], 0.075, '#202326');
  P.manguera('LPH', [[o.xb + 0.05, o.y0 + 0.4, zm + 0.15], [o.xb + 0.10, o.y0 + h * 0.5, zm + 0.15], [o.xb + 0.02, o.y1 - 1.2, zm + 0.15]], 0.04);
  P.manguera('LPH', [[o.xb + 0.05, o.y0 + 0.4, zm - 0.05], [o.xb + 0.12, o.y0 + h * 0.5, zm - 0.05], [o.xb + 0.02, o.y1 - 1.2, zm - 0.05]], 0.035);
  /* escalera por la cara trasera con aros de jaula */
  if(o.escalera){
    P.escaleraV(o.xb + 0.12, zm, o.y0 + 1.2, o.y1 - 0.3, 0.46, 'z', o.escalera);
    var aros = [];
    for(var ya = o.y0 + 3.2; ya < o.y1 - 0.6; ya += 0.9) aros.push([o.xb + 0.12, ya, zm, Math.PI / 2, 0, -Math.PI / 2]);
    P.inst(null, new THREE.TorusGeometry(0.38, 0.018, 6, 14, Math.PI), 'pintura', o.escalera, aros);
  }
  /* campana de polvo bajo la mesa con cortina de goma */
  if(o.campana){
    var K = o.campana, cx = (K.x0 + K.x1) / 2, cz = (K.z0 + K.z1) / 2, wx = K.x1 - K.x0, wz = K.z1 - K.z0;
    P.bloque(null, wx, o.yMesa - 0.25 - 0.55, wz, 'pintura', o.hexCampana || '#3A3F45', cx, (o.yMesa - 0.25 + 0.55) / 2, cz, 0.04);
    [[cx, K.z0, wx, 0.03], [cx, K.z1, wx, 0.03], [K.x0, cz, 0.03, wz], [K.x1, cz, 0.03, wz]].forEach(function(q){
      P.bloque(null, q[2] + 0.04, 0.62, q[3] + 0.04, 'goma', PFV_GOMA, q[0], 0.31, q[1], 0.01);
    });
  }
}

/* ═══ cabina con postes, vidrios con marco, techo con alero, puerta e interior ═══ */
function pfvCabina(P, o){
  var x0 = o.x0, x1 = o.x1, z0 = o.z0, z1 = o.z1, y0 = o.y0, y1 = o.y1;
  var cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, w = x1 - x0, d = z1 - z0;
  var yv = y0 + (y1 - y0) * (o.fv || 0.38), yt = y1 - 0.24, pb = o.parabrisas || 0;
  var techo = o.techo || o.hex;
  /* cuerpo bajo (el frente baja menos si el parabrisas es alto) */
  P.bloque('CBN', w, yv - y0, d, 'pintura', o.hex, cx, (y0 + yv) / 2, cz, 0.05);
  P.bloque('CBN', w + 0.16, 0.16, d + 0.16, 'pintura', techo, cx, y1 - 0.08, cz, 0.06);
  P.bloque(null, w - 0.3, 0.07, d - 0.3, 'pintura', techo, cx, y1 + 0.03, cz, 0.03);
  P.bloque('CBN', w + 0.01, y1 - 0.16 - yt, d + 0.01, 'pintura', o.marco, cx, (yt + y1 - 0.16) / 2, cz, 0.02);
  var pp = 0.11, postes = [[x0 + pp / 2, z0 + pp / 2], [x0 + pp / 2, z1 - pp / 2], [x1 - pp / 2, z0 + pp / 2], [x1 - pp / 2, z1 - pp / 2]];
  var xmed = x0 + w * (o.posteMedio || 0.45);
  postes.push([xmed, z1 - pp / 2], [xmed, z0 + pp / 2]);
  postes.forEach(function(p){ P.bloque('CBN', pp, yt - yv + 0.02, pp, 'pintura', o.marco, p[0], (yv + yt) / 2, p[1], 0.02); });
  /* vidrios: frente, costados en dos panos y atras */
  var hV = yt - yv - 0.02, yV = (yv + yt) / 2;
  var vid = function(a, b, c, x, y, z){
    var m = new THREE.Mesh(new THREE.BoxGeometry(a, b, c), P.M.vidrio('#1A2A3A'));
    m.position.set(x, y, z); P.reg(null, m, null); return m;
  };
  vid(0.03, hV, d - 0.2, x0 + 0.03, yV, cz);
  vid(0.03, hV, d - 0.2, x1 - 0.03, yV, cz);
  [z0 + 0.03, z1 - 0.03].forEach(function(z){
    vid(xmed - x0 - 0.16, hV, 0.03, (x0 + xmed) / 2, yV, z);
    vid(x1 - xmed - 0.16, hV, 0.03, (xmed + x1) / 2, yV, z);
  });
  /* parabrisas bajo (cabina de una pieza de la DML) */
  if(pb){
    P.bloque('CBN', 0.04, 0.06, d - 0.04, 'pintura', o.marco, x0 - 0.005, yv - pb - 0.03, cz, 0.01);
    vid(0.03, pb, d - 0.2, x0 + 0.03, yv - pb / 2, cz);
  }
  /* burletes negros de los vidrios */
  [[x0 - 0.005, 'x'], [x1 + 0.005, 'x']].forEach(function(q){
    P.caja(q[0], yt - 0.01, cz, 0.02, 0.03, d - 0.12, 0, '#111214', 'mate');
    P.caja(q[0], yv - pb + 0.01, cz, 0.02, 0.03, d - 0.12, 0, '#111214', 'mate');
  });
  /* interior: asiento, consola y palancas */
  P.bloque(null, 0.50, 0.42, 0.52, 'mate', '#25282C', cx + 0.15, yv - 0.15, cz, 0.06);
  P.bloque(null, 0.12, 0.60, 0.52, 'mate', '#25282C', cx + 0.42, yv + 0.25, cz, 0.05);
  P.bloque(null, 0.40, 0.12, 0.20, 'mate', '#2E3237', cx - 0.15, yv + 0.08, cz + 0.36, 0.03);
  P.bloque(null, 0.40, 0.12, 0.20, 'mate', '#2E3237', cx - 0.15, yv + 0.08, cz - 0.36, 0.03);
  P.cilindro('JLH', 0.025, 0.025, 0.18, 'mate', '#111', cx - 0.10, yv + 0.22, cz + 0.36, null, 8);
  P.cilindro('JRH', 0.025, 0.025, 0.18, 'mate', '#111', cx - 0.10, yv + 0.22, cz - 0.36, null, 8);
  P.bloque(null, 0.06, 0.32, 0.46, 'mate', '#1A1C1F', x0 + 0.30, yv + 0.22, cz, 0.02);
  /* puerta en la cara +Z: contorno, manija y bisagras */
  var xp0 = o.puerta ? x0 + w * o.puerta[0] : x0 + 0.12, xp1 = o.puerta ? x0 + w * o.puerta[1] : xmed - 0.05;
  [[xp0, 'v'], [xp1, 'v']].forEach(function(q){ P.caja(q[0], (y0 + yt) / 2 + 0.02, z1 + 0.006, 0.02, yt - y0 - 0.12, 0.012, 0, '#121316', 'mate'); });
  P.caja((xp0 + xp1) / 2, y0 + 0.08, z1 + 0.006, xp1 - xp0, 0.02, 0.012, 0, '#121316', 'mate');
  P.bloque(null, 0.16, 0.04, 0.05, 'cromo', null, xp1 - 0.12, yv - 0.15, z1 + 0.03, 0.01);
  /* limpiaparabrisas */
  P.tubo(null, [x0 - 0.02, yv + 0.12, cz - 0.30], [x0 - 0.02, yv + 0.62, cz + 0.12], 0.012, 'mate', '#111', 6);
  /* techo: aire acondicionado, baliza y faros */
  P.bloque('AAC', 0.80, 0.24, 0.95, 'mate', o.hexAAC || '#3C434B', x1 - 0.55, y1 + 0.18, cz, 0.05);
  P.lamas(null, x1 - 0.15, y1 + 0.08, y1 + 0.28, cz - 0.38, cz + 0.38, 4, '#2A2E33', 1);
  P.baliza('CIR', x1 - 0.20, y1 + 0.06, z1 - 0.18);
  [cz - d * 0.32, cz + d * 0.32].forEach(function(z){ P.faroT('LSM', x0 + 0.05, y1 + 0.16, z, '-x'); });
  P.faroT('LSM', x1 - 0.05, y1 + 0.16, cz - d * 0.32, '+x');
  /* asidero junto a la puerta */
  P.tubo(null, [xp1 + 0.10, y0 + 0.30, z1 + 0.08], [xp1 + 0.10, yv + 0.30, z1 + 0.08], 0.02, 'pintura', o.asidero || o.hex, 8);
  /* espejos en brazos a los dos lados del frente */
  [z0, z1].forEach(function(z, k){
    var s = k ? 1 : -1;
    P.tubo(null, [x0 + 0.05, yt - 0.05, z], [x0 - 0.22, yt + 0.05, z + s * 0.28], 0.018, 'mate', '#1E2125', 8);
    P.bloque(null, 0.06, 0.34, 0.20, 'mate', '#1E2125', x0 - 0.24, yt - 0.10, z + s * 0.30, 0.02);
    P.bloque(null, 0.01, 0.29, 0.15, 'cromo', null, x0 - 0.275, yt - 0.10, z + s * 0.30, 0.004);
  });
  /* pasamanos del techo y antena de radio */
  P.tubo(null, [x0 + 0.25, y1 + 0.10, z1 - 0.06], [x1 - 1.0, y1 + 0.10, z1 - 0.06], 0.018, 'pintura', o.asidero || o.marco, 8);
  P.tubo(null, [x1 - 0.30, y1 + 0.06, z0 + 0.15], [x1 - 0.30, y1 + 0.75, z0 + 0.15], 0.008, 'mate', '#111', 6);
  /* placa de certificacion FOPS y limpiaparabrisas trasero */
  P.bloque(null, 0.16, 0.10, 0.01, 'metal', '#B9BEC4', x1 - 0.25, yv - 0.20, z1 + 0.006, 0.003);
  P.tubo(null, [x1 + 0.02, yv + 0.12, cz + 0.30], [x1 + 0.02, yv + 0.55, cz - 0.05], 0.010, 'mate', '#111', 6);
}

/* cartelas bajo el canto de la cubierta y orejas de izaje en las esquinas */
function pfvCubiertaDet(P, y, hex, cantos, orejas){
  cantos.forEach(function(q){
    /* q = [x0, x1, z, lado]: cartelas cada 1.2 m bajo un canto que mira a lado*Z */
    var n = Math.max(2, Math.round((q[1] - q[0]) / 1.2)), zi = q[2] - q[3] * (q[4] || 0.7);
    for(var i = 0; i <= n; i++){
      var x = q[0] + (q[1] - q[0]) * i / n;
      P.perfilX(null, [[q[2] - q[3] * 0.04, y - 0.22], [zi, y - 0.22], [zi, y - 0.75]], 0.06, x, 'pintura', hex, 0.01);
    }
  });
  (orejas || []).forEach(function(q){
    P.pon(null, new THREE.TorusGeometry(0.09, 0.035, 8, 16), 'pintura', hex, q[0], y + 0.10, q[1], [0, q[2] || 0, 0]);
    P.bloque(null, 0.24, 0.06, 0.10, 'pintura', hex, q[0], y + 0.03, q[1], 0.01);
  });
}
/* ═══ lienzos propios ═══ */
/* espiral de la manguera de succion: franjas a lo largo del tubo */
function pfvTexEspiral(fondo, raya){
  var c = document.createElement('canvas'); c.width = 64; c.height = 16;
  var g = c.getContext('2d');
  g.fillStyle = fondo; g.fillRect(0, 0, 64, 16);
  g.fillStyle = raya; g.fillRect(40, 0, 12, 16);
  g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(0, 0, 6, 16); g.fillRect(30, 0, 4, 16);
  var t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
  return t;
}
/* texto en vertical (RANGER, PANTERA, DP1100) sobre un panel */
function pfvRotVertical(txt, fondo, tinta, sub){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    g.save(); g.translate(w / 2, h / 2); g.rotate(-Math.PI / 2);
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(w * 0.62) + 'px "Arial Black", Arial, sans-serif';
    g.fillText(txt, 0, sub ? -w * 0.08 : 0, h * 0.86);
    if(sub){ g.font = 'bold ' + Math.round(w * 0.22) + 'px Arial, sans-serif'; g.fillText(sub, 0, w * 0.34, h * 0.8); }
    g.restore();
  };
}
/* el «hombre de hierro» de Sandvik: circulo con cuatro rayas diagonales */
function pfvRotSandvikTexto(fondo, tinta){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    var r = h * 0.36, cx = h * 0.5, cy = h * 0.5;
    g.save(); g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.clip();
    g.fillStyle = tinta; g.fillRect(cx - r, cy - r, r * 2, r * 2);
    g.strokeStyle = fondo; g.lineWidth = r * 0.16;
    for(var i = -2; i <= 2; i++){ g.beginPath(); g.moveTo(cx - r + i * r * 0.5, cy + r); g.lineTo(cx + r + i * r * 0.5, cy - r); g.stroke(); }
    g.restore();
    g.fillStyle = tinta; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.56) + 'px Arial, sans-serif';
    g.fillText('SANDVIK', h * 1.0, h * 0.54, w - h * 1.05);
  };
}
/* placa negra del modelo con letra blanca (DX700 en el capot) */
function pfvRotPlaca(txt, fondo, tinta){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.62) + 'px Arial, sans-serif';
    g.fillText(txt, w / 2, h * 0.55, w * 0.9);
  };
}
/* Everdigm: el emblema de tres alas negras y el modelo debajo (como en el folleto) */
function pfvRotEverdigmT(fondo, txt){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    g.fillStyle = '#15171A';
    var cx = w / 2, y0 = h * 0.08, y1 = h * 0.52;
    g.beginPath(); g.moveTo(cx - w * 0.40, y0); g.lineTo(cx - w * 0.14, y0); g.lineTo(cx - w * 0.06, y1); g.lineTo(cx - w * 0.22, y1 - h * 0.12); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(cx + w * 0.40, y0); g.lineTo(cx + w * 0.14, y0); g.lineTo(cx + w * 0.06, y1); g.lineTo(cx + w * 0.22, y1 - h * 0.12); g.closePath(); g.fill();
    g.fillRect(cx - w * 0.07, y0, w * 0.14, y1 - y0);
    g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.26) + 'px "Arial Narrow", Arial, sans-serif';
    g.fillText(txt, cx, h * 0.74, w * 0.9);
  };
}
function pfvRotEverdigm(fondo, tinta){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    g.fillStyle = tinta; g.fillRect(w * 0.03, h * 0.12, w * 0.94, h * 0.76);
    g.fillStyle = fondo; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.60) + 'px "Arial Black", Arial, sans-serif';
    g.save(); g.translate(w / 2, h * 0.53); g.scale(1.25, 1); g.fillText('EVERDIGM', 0, 0, w * 0.72); g.restore();
  };
}
/* Soosan: rotulo de la puerta (azul y blanco) */
function pfvRotSoosan(g, w, h){
  g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#1C4C9C'; g.fillRect(0, 0, w, h * 0.60);
  g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold ' + Math.round(h * 0.42) + 'px "Arial Black", Arial, sans-serif';
  g.fillText('SOOSAN', w / 2, h * 0.31, w * 0.9);
  g.fillStyle = '#1C4C9C'; g.font = 'bold ' + Math.round(h * 0.26) + 'px Arial, sans-serif';
  g.fillText('AMERICA', w / 2, h * 0.80, w * 0.9);
}
function pfvRotTexto(txt, fondo, tinta, fuente){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = (fuente || 'bold italic') + ' ' + Math.round(h * 0.62) + 'px Georgia, "Times New Roman", serif';
    g.fillText(txt, w / 2, h * 0.55, w * 0.94);
  };
}

/* caja de cantos redondeados puesta entre dos puntos (plumas de seccion cajon) */
function pfvViga(P, code, a, b, w, h, tipo, hex, r){
  var va = new THREE.Vector3(a[0], a[1], a[2]), vb = new THREE.Vector3(b[0], b[1], b[2]);
  var dir = vb.clone().sub(va), L = dir.length();
  var m = P.bloque(code, L, h, w, tipo, hex, 0, 0, 0, r === undefined ? 0.03 : r);
  m.position.copy(va).add(vb).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir.normalize());
  return m;
}
function pfvLerp(a, b, f){ return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]; }

/* ══════════════════════════════════════════════════════════════════
   PERFORADORAS DE MARTILLO EN CABEZA CON CABINA (top hammer)
   Medidas (m). x desde el frente de la superestructura (0) hacia atras;
   la viga de avance queda vertical delante, en XF, perforando.
     LC largo de la superestructura · W ancho · OL/OA largo y alto de oruga
     TJ teja · XO centro de orugas · YD piso de la superestructura
     CL/CW largo y ancho de la cabina · CY techo de cabina
     XM2 donde empieza el capot alto · MY/MY2 alto del capot bajo/alto
     TW/TY largo y alto del bloque trasero (colector de polvo)
     FL largo total de la viga de avance · XF/ZF donde queda la viga
     YB/YC altura de la raiz de la pluma y de la cuna
   ══════════════════════════════════════════════════════════════════ */
var PFV_TH = {
  DX700:  { LC: 4.82, W: 2.45, OL: 3.27, OA: 0.73, TJ: 0.31, XO: 1.37, YD: 1.10, CL: 2.00, CW: 1.18, CY: 2.74,
            XM2: 3.15, MY: 2.40, MY2: 2.64, TW: 0.30, TY: 2.74, tapa: 0, FL: 7.70, XF: -4.15, ZF: -0.30, YB: 1.40, YC: 2.55,
            pluma: 'art', colores: 'sandvik', panel: 'cab', nombre: 'RANGER', modelo: 'DX700', rodillos: 6, ganchoTras: true },
  DP1100: { LC: 5.60, W: 2.50, OL: 3.72, OA: 0.82, TJ: 0.40, XO: 1.65, YD: 1.20, CL: 2.05, CW: 1.22, CY: 3.05,
            XM2: 2.30, MY: 2.78, MY2: 2.78, TW: 0.32, TY: 2.95, tapa: 3.30, FL: 8.60, XF: -4.40, ZF: -0.30, YB: 1.50, YC: 2.70,
            pluma: 'tele', colores: 'sandvik', panel: 'cuerpo', nombre: 'PANTERA', modelo: 'DP1100', rodillos: 7, ganchoTras: true },
  T450:   { LC: 4.27, W: 2.305, OL: 2.94, OA: 0.74, TJ: 0.30, XO: 1.17, YD: 1.08, CL: 1.52, CW: 1.12, CY: 2.64,
            XM2: 3.20, MY: 1.93, MY2: 2.19, TW: 0.14, TY: 1.93, tapa: 0, FL: 6.95, XF: -3.42, ZF: -0.25, YB: 1.30, YC: 2.49,
            pluma: 'tele', colores: 'everdigm', panel: '', nombre: '', modelo: 'T450', rodillos: 6, ganchoTras: false },
  JD1400: { LC: 4.70, W: 2.45, OL: 3.10, OA: 0.75, TJ: 0.33, XO: 1.30, YD: 1.12, CL: 1.55, CW: 1.25, CY: 2.82,
            XM2: 2.70, MY: 2.22, MY2: 2.22, TW: 0.55, TY: 2.40, tapa: 0, FL: 7.90, XF: -3.70, ZF: -0.25, YB: 1.40, YC: 2.70,
            pluma: 'art', colores: 'soosan', panel: '', nombre: 'ROCK COMMANDER', modelo: 'JD-1400E', rodillos: 6, ganchoTras: false },
  JD2000: { LC: 5.05, W: 2.50, OL: 3.40, OA: 0.80, TJ: 0.35, XO: 1.45, YD: 1.18, CL: 1.60, CW: 1.28, CY: 2.92,
            XM2: 2.85, MY: 2.34, MY2: 2.34, TW: 0.60, TY: 2.52, tapa: 0, FL: 8.50, XF: -3.95, ZF: -0.25, YB: 1.45, YC: 2.80,
            pluma: 'art', colores: 'soosan', panel: '', nombre: 'ROCK COMMANDER', modelo: 'JD-2000', rodillos: 7, ganchoTras: false }
};
/* colores (el estudio aclara: van un punto mas oscuros que la pintura real) */
var PFV_COL = {
  sandvik:  { cuerpo: '#C23A1C', cuerpo2: '#8A2913', viga: '#D2461E', cab: '#BFC3C7', cab2: '#9EA3A8', panel: '#33373D',
              bajo: '#1C1F22', tras: '#16181B', succion: '#141618', espiral: '#E3AE1A', baranda: '#E3AE1A', tinta: '#FFFFFF' },
  everdigm: { cuerpo: '#078A86', cuerpo2: '#056663', viga: '#5E6369', cab: '#078A86', cab2: '#056663', panel: '#3A3F45',
              bajo: '#4A4E54', tras: '#4A4E54', succion: '#2A2D31', espiral: '#5E6369', baranda: '#5E6369', tinta: '#FFFFFF' },
  soosan:   { cuerpo: '#DDA20C', cuerpo2: '#A87A06', viga: '#1E2125', cab: '#DDA20C', cab2: '#A87A06', panel: '#1E2125',
              bajo: '#1E2125', tras: '#1E2125', succion: '#1D4FA0', espiral: '#1D4FA0', baranda: '#1E2125', tinta: '#16181B' }
};

function pfvConstruirTH(v, piezas){
  var G = new THREE.Group(), H = new THREE.Group(); G.add(H);
  var P = pfvKit(H, piezas);
  var C = PFV_TH[v], K = PFV_COL[C.colores];
  var san = C.colores === 'sandvik', soo = C.colores === 'soosan', eve = C.colores === 'everdigm';
  var W2 = C.W / 2, YD = C.YD, LC = C.LC, XF = C.XF, ZF = C.ZF, FL = C.FL;
  var CB = function(code, w, h, d, x, y, z, r){ return P.bloque(code, w, h, d, 'pintura', K.cuerpo, x, y, z, r); };

  /* ═══ tren de orugas de garra larga ═══ */
  var ZT = W2 - C.TJ / 2;
  P.oruga({ code: 'CLH', mando: 'MLH', x0: C.XO - C.OL / 2, x1: C.XO + C.OL / 2, zc: ZT, ancho: C.TJ, alto: C.OA, lado: 1, hexB: K.bajo, paso: 0.19, garras: 1 });
  P.oruga({ code: 'CRH', mando: 'MRH', x0: C.XO - C.OL / 2, x1: C.XO + C.OL / 2, zc: -ZT, ancho: C.TJ, alto: C.OA, lado: -1, hexB: K.bajo, paso: 0.19, garras: 1 });
  /* cuerpo central que une los bastidores y cilindros de oscilacion */
  P.bloque(null, 1.30, 0.42, 2 * ZT - C.TJ * 0.8, 'pintura', K.bajo, C.XO, C.OA * 0.55, 0, 0.05);
  [-1, 1].forEach(function(s){ P.cilHidD('PYB', [C.XO + 0.45, C.OA * 0.85, s * 0.30], [C.XO + 0.45, C.OA * 0.55, s * (ZT - C.TJ * 0.45)], 0.055, K.bajo, 0.5); });
  /* tornamesa: la superestructura gira sobre el tren */
  P.cilindro('PYB', 0.62, 0.66, YD - 0.24 - C.OA, 'metal', '#2A2D31', C.XO, (C.OA + YD - 0.24) / 2, 0, null, 32);
  /* bastidor de la superestructura */
  P.bloque(null, LC - 0.10, 0.26, C.W - 0.04, 'pintura', K.bajo, LC / 2, YD - 0.13, 0, 0.04);
  P.bloque(null, LC - 0.30, 0.03, C.W - 0.10, 'mate', '#121315', LC / 2, YD - 0.275, 0, 0.01);

  /* ═══ cabina adelante a la izquierda ═══ */
  var CZ1 = W2 - 0.04, CZ0 = CZ1 - C.CW, CX0 = 0.06, CX1 = C.CL;
  pfvCabina(P, { x0: CX0, x1: CX1, z0: CZ0, z1: CZ1, y0: YD, y1: C.CY, hex: K.cab, marco: san ? K.panel : K.cab2, techo: K.cab,
    fv: 0.16, parabrisas: 0.0, posteMedio: 0.55, puerta: [0.12, 0.52], asidero: K.cab2, hexAAC: san ? '#9EA3A8' : K.cab2 });
  /* reja FOPS delante del parabrisas y sobre el techo (fotos del DX700 y del JD1400) */
  if(san || soo){
    var rx = CX0 - 0.12, ry0 = YD + 0.55, ry1 = C.CY - 0.05, L = [];
    for(var rz = CZ0 + 0.08; rz <= CZ1 - 0.05; rz += 0.14) L.push([[rx, ry0, rz], [rx, ry1, rz]]);
    for(var ry = ry0; ry <= ry1 + 0.01; ry += 0.30) L.push([[rx, ry, CZ0 + 0.05], [rx, ry, CZ1 - 0.05]]);
    P.barras(null, L, 0.012, 'mate', '#1A1C1F', true);
    [[CZ0 + 0.05, ry0], [CZ1 - 0.05, ry0], [CZ0 + 0.05, ry1], [CZ1 - 0.05, ry1]].forEach(function(q){
      P.barra([rx, q[1], q[0]], [CX0 + 0.02, q[1], q[0]], 0.02, '#1A1C1F', 'mate');
    });
    var Lt = [];
    for(var tx = CX0 + 0.10; tx < CX0 + 0.9; tx += 0.16) Lt.push([[tx, C.CY + 0.16, CZ0 + 0.08], [tx, C.CY + 0.16, CZ1 - 0.08]]);
    P.barras(null, Lt, 0.012, 'mate', '#1A1C1F', true);
    P.barra([rx, ry1, CZ0 + 0.08], [CX0 + 0.9, C.CY + 0.16, CZ0 + 0.08], 0.02, '#1A1C1F', 'mate');
    P.barra([rx, ry1, CZ1 - 0.08], [CX0 + 0.9, C.CY + 0.16, CZ1 - 0.08], 0.02, '#1A1C1F', 'mate');
  }
  /* rotulos de la cabina */
  if(san){
    P.letrero(texRotulo3d(pfvRotSandvikTexto(K.cab, '#1A1C1F'), 384, 80), 0.62, 0.13, CX0 + 0.55, YD + 0.32, CZ1 + 0.012, 0);
    if(C.panel === 'cab'){
      /* panel gris oscuro con RANGER en vertical, en el poste trasero */
      P.bloque(null, 0.26, C.CY - YD - 0.55, 0.03, 'pintura', K.panel, CX1 - 0.16, (YD + C.CY) / 2 - 0.05, CZ1 + 0.01, 0.01);
      P.letrero(texRotulo3d(pfvRotVertical(C.nombre, K.panel, '#FFFFFF'), 64, 320), 0.20, 1.00, CX1 - 0.16, (YD + C.CY) / 2 - 0.05, CZ1 + 0.028, 0);
    } else {
      P.letrero(texRotulo3d(pfvRotVertical(C.modelo, K.cab, '#2A2D31'), 48, 260), 0.10, 0.55, CX1 - 0.10, C.CY - 0.75, CZ1 + 0.012, 0);
    }
  }
  if(soo){
    P.letrero(texRotulo3d(pfvRotSoosan, 256, 112), 0.36, 0.16, CX0 + 0.62, YD + 0.62, CZ1 + 0.012, 0);
    /* bandera chica en la puerta, como las de Soosan America */
    P.bloque(null, 0.10, 0.06, 0.01, 'mate', '#B22234', CX0 + 0.62, YD + 0.92, CZ1 + 0.008, 0.003);
  }

  /* ═══ frente derecho: soporte de la pluma, tanque hidraulico y engrase ═══ */
  var ZB = -W2 + 0.48;
  CB(null, 0.80, 0.70, 0.80, 0.42, YD + 0.35, ZB, 0.05);
  [-0.30, 0.30].forEach(function(dz){ P.bloque(null, 0.55, 0.62, 0.08, 'pintura', K.viga, 0.20, C.YB, ZB + dz, 0.02); });
  CB('TQH1', CX1 - 0.95, 0.92, CZ0 - (-W2) - 0.12, (0.85 + CX1) / 2 + 0.05, YD + 0.46, (CZ0 - W2) / 2, 0.05);
  P.cilindro(null, 0.06, 0.06, 0.03, 'vidrio', '#9BB7C9', 1.05, YD + 0.55, -W2 + 0.005, [Math.PI / 2, 0, 0], 16);
  P.cilindro(null, 0.07, 0.07, 0.12, 'mate', PFV_NEGRO, 1.35, YD + 0.98, (CZ0 - W2) / 2, null, 14);
  P.cilindro('SEN', 0.13, 0.13, 0.40, 'pintura', '#B9302A', 0.95, YD + 1.12, CZ0 - 0.25, null, 18);
  P.cilindro('GP1', 0.05, 0.05, 0.16, 'metal', PFV_GRIS2, 0.95, YD + 1.40, CZ0 - 0.25, null, 10);

  /* ═══ capot del grupo motor-compresor ═══ */
  var XT = LC - C.TW, xm2 = Math.min(C.XM2, XT);
  if(xm2 > CX1 + 0.05) CB(null, xm2 - CX1 - 0.02, C.MY - YD, C.W - 0.04, (CX1 + xm2) / 2, (YD + C.MY) / 2, 0, 0.06);
  CB(null, XT - xm2, C.MY2 - YD, C.W - 0.04, (xm2 + XT) / 2, (YD + C.MY2) / 2, 0, 0.06);
  /* tapa del enfriador: negra en Sandvik (Pantera), del color del cuerpo en las demas */
  if(C.tapa){
    P.bloque(null, XT - xm2 - 0.55, C.tapa - C.MY2, C.W - 0.30, 'pintura', PFV_NEGRO, (xm2 + XT) / 2 + 0.2, (C.MY2 + C.tapa) / 2, 0, 0.08);
    P.lamas('CHD1', XT - 0.02, C.MY2 + 0.05, C.tapa - 0.08, -W2 + 0.35, W2 - 0.35, 5, '#0E0F11', 1);
    P.plano('RAD1', pfvTexMalla('#121315', '#5C6168', 8, 2.2), XT - xm2 - 1.0, C.W - 0.6, 6, 6, (xm2 + XT) / 2 + 0.2, C.tapa + 0.004, 0, [-Math.PI / 2, 0, 0]);
  } else {
    P.plano('RAD1', pfvTexMalla('#121315', '#8C939A', 9, 2.6), Math.min(1.4, XT - xm2 - 0.3), C.W - 0.6, 5, 6, XT - 0.85, C.MY2 + 0.004, 0, [-Math.PI / 2, 0, 0]);
  }
  /* rejillas a los dos costados: grande en el capot alto (radiador) y chica en el bajo */
  var hR = C.MY2 - YD - 0.45, xR = xm2 + (XT - xm2) * 0.52, wR = Math.min(1.35, (XT - xm2) * 0.68);
  [-1, 1].forEach(function(s){
    var n = s > 0 ? '+z' : '-z';
    P.rejilla(s > 0 ? 'RAD1' : 'CHD1', wR, hR, xR, YD + 0.22 + hR / 2, s * (W2 - 0.015), n, K.cuerpo2);
    if(xm2 - CX1 > 0.6) P.rejilla('ENG1', 0.36, C.MY - YD - 0.55, CX1 + (xm2 - CX1) * 0.62, (YD + C.MY) / 2, s * (W2 - 0.015), n, K.cuerpo2);
    /* panel oscuro rehundido justo detras de la cabina (DX700) y faja del piso */
    P.caja((CX1 + xm2) / 2, YD + 0.06, s * (W2 - 0.005), XT - CX1, 0.10, 0.012, 0, PFV_NEGRO, 'mate');
    /* puertas: juntas verticales, manijas y cerraduras */
    [CX1 + 0.05, xm2 + 0.02, XT - 0.04].forEach(function(x){ P.caja(x, (YD + C.MY) / 2 + 0.05, s * (W2 - 0.008), 0.02, C.MY - YD - 0.25, 0.012, 0, '#121316', 'mate'); });
    P.bloque(null, 0.05, 0.16, 0.04, 'cromo', null, xm2 + 0.25, (YD + C.MY2) / 2, s * (W2 + 0.01), 0.01);
    /* tapas de llenado: combustible a la izquierda, aceite hidraulico a la derecha */
    P.bloque(s > 0 ? 'TQC1' : 'TQH1', 0.26, 0.20, 0.03, 'mate', PFV_NEGRO, XT - 0.40, YD + 0.32, s * (W2 + 0.005), 0.01);
  });
  if(san && xm2 - CX1 > 0.6){
    [-1, 1].forEach(function(s){ P.bloque(null, 0.24, C.MY - YD - 0.35, 0.03, 'pintura', K.panel, CX1 + 0.20, (YD + C.MY) / 2, s * (W2 - 0.005), 0.01); });
  }
  /* panel negro PANTERA en el frente del cuerpo (Pantera) */
  if(san && C.panel === 'cuerpo'){
    [1, -1].forEach(function(s){
      P.bloque(null, 0.34, C.MY - YD - 0.10, 0.04, 'pintura', '#1B1D20', CX1 + 0.20, (YD + C.MY) / 2, s * (W2 + 0.005), 0.01);
      P.letrero(texRotulo3d(pfvRotVertical(C.nombre, '#1B1D20', '#FFFFFF'), 64, 360), 0.26, 1.30, CX1 + 0.20, (YD + C.MY) / 2, s * (W2 + 0.028), s > 0 ? 0 : Math.PI);
    });
  }
  /* rotulos del capot */
  var texNum = texNumero3d(null, soo ? '#16181C' : '#FFFFFF');
  if(san){
    var texMod = texRotulo3d(pfvRotPlaca(C.modelo, '#1B1D20', '#FFFFFF'), 256, 72);
    [1, -1].forEach(function(s){ P.letrero(texMod, 0.50, 0.14, xm2 + 0.45, C.MY2 - 0.12, s * (W2 + 0.012), s > 0 ? 0 : Math.PI); });
  }
  if(eve){
    var texT = texRotulo3d(pfvRotEverdigmT(K.cuerpo, 'T450'), 160, 200);
    [1, -1].forEach(function(s){ P.letrero(texT, 0.34, 0.42, XT - 0.30, YD + 0.62, s * (W2 + 0.012), s > 0 ? 0 : Math.PI); });
    P.letrero(texRotulo3d(pfvRotEverdigm(K.cuerpo, '#15171A'), 384, 72), 0.85, 0.16, (CX1 + XT) / 2 - 0.2, C.MY - 0.12, W2 + 0.012, 0);
    /* caja alta de los filtros sobre el capot (dibujo del folleto) */
    P.bloque(null, 0.85, C.MY2 - C.MY + 0.20, C.W - 0.6, 'pintura', K.cuerpo, XT - 0.75, C.MY + (C.MY2 - C.MY) / 2, 0, 0.04);
  }
  if(soo){
    var texRC = texRotulo3d(pfvRotTexto(C.nombre, K.cuerpo, '#16181B'), 512, 80);
    [1, -1].forEach(function(s){ P.letrero(texRC, 0.95, 0.15, (CX1 + XT) / 2, C.MY - 0.14, s * (W2 + 0.012), s > 0 ? 0 : Math.PI); });
    var texJD = texRotulo3d(pfvRotPlaca(C.modelo, K.cuerpo, '#16181B'), 256, 64);
    [1, -1].forEach(function(s){ P.letrero(texJD, 0.42, 0.11, XT - 0.30, YD + 0.25, s * (W2 + 0.012), s > 0 ? 0 : Math.PI); });
  }
  /* numero de unidad en el costado izquierdo, adelante del capot */
  var mN = new THREE.Mesh(new THREE.PlaneGeometry(0.70, 0.22), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
  mN.position.set(xm2 - 0.40, YD + 0.16, W2 + 0.014); H.add(mN);
  /* escape y prefiltro sobre el capot */
  P.tubo(null, [XT - 0.35, C.MY2 - 0.1, -W2 + 0.45], [XT - 0.35, Math.max(C.MY2, C.tapa) + 0.45, -W2 + 0.45], 0.06, 'metal', '#6E747B', 12);
  P.cilindro(null, 0.075, 0.075, 0.04, 'mate', PFV_NEGRO, XT - 0.35, Math.max(C.MY2, C.tapa) + 0.47, -W2 + 0.45, [0, 0, 0.4], 12);
  P.cilindro('ENG1', 0.13, 0.13, 0.32, 'mate', PFV_NEGRO, xm2 + 0.35, C.MY2 + 0.16, W2 - 0.40, null, 18);
  P.cilindro(null, 0.16, 0.16, 0.05, 'mate', PFV_NEGRO, xm2 + 0.35, C.MY2 + 0.33, W2 - 0.40, null, 18);

  /* ═══ atras: colector de polvo (negro en Sandvik y Soosan), apoyo y escalera ═══ */
  P.bloque('CPV', C.TW, C.TY - YD + 0.10, C.W - 0.02, 'pintura', K.tras, XT + C.TW / 2, (YD - 0.10 + C.TY) / 2, 0, 0.05);
  P.lamas(null, LC + 0.01, YD + 0.25, Math.min(C.TY, YD + 1.15), -W2 + 0.35, -0.15, 6, '#0B0C0E', 1);
  P.bloque('CPV', 0.06, 0.40, 0.70, 'metal', PFV_GRIS2, LC + 0.03, C.TY - 0.40, W2 - 0.55, 0.02);
  if(C.ganchoTras){
    /* apoyo trasero inclinado (dibujo de Sandvik) */
    var ap = P.bloque('PG3', 0.10, 0.75, 0.70, 'pintura', K.tras, LC + 0.05, YD - 0.38, 0, 0.03);
    ap.rotation.z = 0.25;
    P.cilHidD('PG3', [LC - 0.25, YD - 0.10, 0.25], [LC + 0.10, YD - 0.55, 0.25], 0.05, K.tras, 0.5);
  }
  P.escaleraV(LC + 0.08, W2 - 0.35, 0.35, YD, 0.42, 'z', K.baranda);
  P.baranda([[XT - 0.6, W2 - 0.10], [LC - 0.05, W2 - 0.10]], C.TY, 0.9, K.baranda, null);
  P.faroT('LSM', LC + 0.04, C.TY - 0.12, W2 - 0.55, '+x');
  P.faroT('LSM', LC + 0.04, C.TY - 0.12, -W2 + 0.55, '+x');
  P.bloque('BAT', 0.55, 0.36, 0.40, 'mate', PFV_NEGRO, XT - 0.55, YD + 0.18, -W2 + 0.35, 0.03);
  /* numero tambien atras */
  var mN2 = new THREE.Mesh(new THREE.PlaneGeometry(0.70, 0.22), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
  mN2.position.set(LC + 0.012, YD + 0.10, 0.30); mN2.rotation.y = Math.PI / 2; H.add(mN2);

  /* ═══ pluma: raiz al frente derecho, cabezal con la cuna de la viga ═══ */
  var A = [0.15, C.YB, ZB], B = [XF + 0.42, C.YC, ZF];
  var hx = C.colores === 'soosan' ? 'mate' : 'pintura';
  if(C.pluma === 'tele'){
    var Km = pfvLerp(A, B, 0.64);
    pfvViga(P, null, A, Km, 0.32, 0.36, hx, K.viga);
    pfvViga(P, null, pfvLerp(A, B, 0.58), B, 0.24, 0.27, hx, K.viga);
    /* placas de desgaste en la boca del telescopio y cilindro de extension */
    pfvViga(P, null, pfvLerp(A, B, 0.60), pfvLerp(A, B, 0.645), 0.36, 0.40, hx, K.viga);
    P.cilHidD('LPH', pfvLerp(A, B, 0.15).map(function(c, i){ return i === 1 ? c + 0.26 : c; }), pfvLerp(A, B, 0.90).map(function(c, i){ return i === 1 ? c + 0.20 : c; }), 0.05, K.viga, 0.45);
  } else {
    /* articulada (DB 800H de Sandvik, pluma de Soosan): dos tramos y el codo */
    var Ka = pfvLerp(A, B, 0.52); Ka[1] += 0.35;
    pfvViga(P, null, A, Ka, 0.30, 0.36, hx, K.viga);
    pfvViga(P, null, Ka, B, 0.26, 0.30, hx, K.viga);
    P.cilindro('PYB', 0.20, 0.20, 0.42, 'metal', '#3A3F45', Ka[0], Ka[1], Ka[2], [Math.PI / 2, 0, 0], 20);
    P.cilHidD('LPH', [A[0] - 0.4, A[1] + 0.35, A[2]], [Ka[0] - 0.6, Ka[1] + 0.32, Ka[2]], 0.06, K.viga, 0.5);
  }
  /* cilindro de levante por debajo */
  P.cilHidD('HPM', [0.30, YD + 0.15, ZB], [pfvLerp(A, B, 0.42)[0], pfvLerp(A, B, 0.42)[1] - 0.20, pfvLerp(A, B, 0.42)[2]], 0.085, K.viga, 0.55);
  P.cilindro('PYB', 0.12, 0.12, 0.62, 'metal', '#3A3F45', A[0], A[1], A[2], [Math.PI / 2, 0, 0], 18);
  /* cabezal de la pluma y cuna de la viga, con los cilindros de giro y de inclinacion */
  P.bloque(null, 0.42, 0.50, 0.44, hx, K.viga, B[0], B[1], B[2], 0.04);
  P.bloque(null, 0.30, 1.00, 0.46, hx, K.viga, XF + 0.25, C.YC, ZF, 0.04);
  P.cilHidD('LPH', [B[0] + 0.55, B[1] - 0.22, ZF], [XF + 0.30, C.YC - 0.42, ZF], 0.055, K.viga, 0.5);
  P.cilHidD('LPH', [B[0] + 0.10, B[1] + 0.32, ZF - 0.25], [XF + 0.20, C.YC + 0.42, ZF + 0.18], 0.045, K.viga, 0.5);
  P.cilindro('PYB', 0.10, 0.10, 0.56, 'metal', '#5A6067', B[0], B[1], ZF, [Math.PI / 2, 0, 0], 16);

  /* ═══ viga de avance vertical con la perforadora ═══ */
  var y0 = 0.30, y1 = FL - 0.05, xv = XF, xd = XF - 0.30;
  P.bloque('MAV', 0.24, y1 - y0, 0.30, hx, K.viga, xv, (y0 + y1) / 2, ZF, 0.03);
  /* guias de deslizamiento de la cuna (la viga corre sobre ellas) */
  P.bloque(null, 0.05, y1 - y0 - 0.5, 0.36, 'metal', '#7A8087', xv + 0.13, (y0 + y1) / 2, ZF, 0.01);
  /* rieles del carro en la cara de afuera y la cadena de avance */
  [-0.12, 0.12].forEach(function(dz){ P.bloque(null, 0.05, y1 - y0 - 0.4, 0.05, 'metal', '#80878E', xv - 0.135, (y0 + y1) / 2, ZF + dz, 0.01); });
  P.bloque('MAV', 0.035, y1 - y0 - 0.9, 0.06, 'metal', '#2B2E33', xv - 0.13, (y0 + y1) / 2, ZF, 0.01);
  /* cilindro de extension de la viga por detras */
  P.tubo('MAV', [xv + 0.20, y0 + 0.5, ZF + 0.10], [xv + 0.20, y0 + 2.2, ZF + 0.10], 0.05, 'pintura', K.viga, 14);
  P.tubo(null, [xv + 0.20, y0 + 2.2, ZF + 0.10], [xv + 0.20, C.YC - 0.4, ZF + 0.10], 0.03, 'cromo', null, 12);
  /* polea / carrete de mangueras arriba y abajo */
  P.cilindro('MAV', 0.24, 0.24, 0.20, 'metal', '#2B2E33', xv - 0.05, y1 - 0.10, ZF, [Math.PI / 2, 0, 0], 26);
  P.bloque(null, 0.40, 0.22, 0.36, hx, K.viga, xv, y1 + 0.06, ZF, 0.03);
  if(san){
    /* carrete de mangueras redondo (se ve en las fotos del DX700) */
    P.cilindro('LPH', 0.36, 0.36, 0.12, 'metal', '#1E2125', xv + 0.05, y1 - 0.55, ZF + 0.22, [Math.PI / 2, 0, 0], 28);
  }
  P.cilindro('MAV', 0.14, 0.14, 0.34, 'metal', '#2B2E33', xv - 0.08, y0 + 0.25, ZF, [Math.PI / 2, 0, 0], 20);
  /* perforadora (martillo) en su carro, a media carrera */
  var yR = y0 + (y1 - y0) * 0.56;
  P.bloque(null, 0.06, 0.80, 0.36, 'metal', '#3A3F45', xv - 0.17, yR, ZF, 0.02);
  P.bloque('HAM', 0.30, 0.62, 0.30, hx, K.viga, xd, yR + 0.05, ZF, 0.04);
  P.cilindro('HAM', 0.12, 0.12, 0.40, 'metal', '#3B4047', xd, yR + 0.55, ZF, null, 18);
  P.cilindro('HAM', 0.10, 0.10, 0.24, 'metal', '#4A5058', xd + 0.02, yR + 0.30, ZF - 0.20, [Math.PI / 2, 0, 0], 16);
  P.pon(null, new THREE.SphereGeometry(0.09, 14, 10), 'metal', '#2F3236', xd, yR + 0.82, ZF);
  /* culata y adaptador: la barra baja hasta el suelo */
  P.cilindro(null, 0.05, 0.05, 0.22, 'metal', '#8A8F95', xd, yR - 0.36, ZF, null, 14);
  P.cilindro('GET', 0.026, 0.026, yR - 0.47, 'metal', PFV_ACERO, xd, (yR - 0.47) / 2, ZF, null, 12);
  [1.2, 1.2 + 3.66].forEach(function(y){ if(y < yR - 0.6) P.cilindro(null, 0.042, 0.042, 0.20, 'metal', '#5E646B', xd, y, ZF, null, 14); });
  /* soporte de barra (mordazas) cerca del pie y campana de succion */
  P.bloque(null, 0.40, 0.22, 0.42, hx, K.viga, xd + 0.05, 0.90, ZF, 0.03);
  [-1, 1].forEach(function(s){ P.bloque(null, 0.10, 0.12, 0.10, 'metal', '#3A3F45', xd, 0.90, ZF + s * 0.10, 0.02); });
  P.bloque('CPV', 0.46, 0.28, 0.46, 'pintura', soo ? '#26292D' : K.viga, xd + 0.02, 0.45, ZF, 0.04);
  P.cilindro(null, 0.20, 0.24, 0.22, 'goma', PFV_GOMA, xd, 0.16, ZF, null, 22);
  /* punzon del pie de la viga */
  P.bloque('GET', 0.16, 0.30, 0.20, 'metal', '#3A3F45', xv + 0.02, 0.15, ZF, 0.02);
  /* cambiador de barras de revolver al costado de la viga */
  var MZ = ZF + 0.42, ry0b = 1.25, ry1b = Math.min(y1 - 1.3, 1.25 + 4.4), barras = [];
  for(var t = 0; t < 7; t++){ var a = t / 7 * Math.PI * 2; barras.push([xv - 0.10 + Math.cos(a) * 0.15, (ry0b + ry1b) / 2, MZ + Math.sin(a) * 0.15]); }
  P.inst(null, new THREE.CylinderGeometry(0.026, 0.026, ry1b - ry0b + 0.2, 10), 'metal', PFV_ACERO, barras);
  [ry0b, ry1b].forEach(function(y){
    P.cilindro('MCR', 0.22, 0.22, 0.07, hx, K.viga, xv - 0.10, y, MZ, null, 22);
    P.tubo('MCR', [xv - 0.10, y, MZ], [xv, y, ZF + 0.14], 0.04, hx, K.viga, 8);
  });
  P.tubo('MCR', [xv - 0.10, ry0b - 0.15, MZ], [xv - 0.10, ry1b + 0.2, MZ], 0.04, 'metal', '#5A6067', 10);
  /* faros de trabajo en la viga */
  P.faroT('LSM', xv - 0.15, y1 - 0.45, ZF - 0.22, '-x');
  P.faroT('LSM', xv + 0.15, y1 - 0.45, ZF - 0.22, '+x');

  /* ═══ mangueras ═══ */
  /* haz hidraulico de la raiz de la pluma a lo alto de la viga, colgando hasta la perforadora */
  /* van por encima de la pluma, suben por detras de la viga, pasan por la polea de arriba y bajan en lazo */
  [-0.10, 0.0, 0.10].forEach(function(dz, k){
    var q1 = pfvLerp(A, B, 0.35), q2 = pfvLerp(A, B, 0.80);
    P.manguera(k ? 'LPH' : 'LPA', [[0.35, YD + 0.85, ZB + dz], [q1[0], q1[1] + 0.36, q1[2] + dz], [q2[0], q2[1] + 0.40, q2[2] + dz],
      [xv + 0.42, C.YC + 1.2, ZF - 0.30 + dz], [xv + 0.30, y1 - 1.6 - k * 0.2, ZF - 0.30 + dz], [xv + 0.05, y1 + 0.05, ZF - 0.26 + dz],
      [xv - 0.40, y1 - 0.6, ZF - 0.24 + dz], [xd - 0.25, yR + 1.6, ZF - 0.20 + dz], [xd - 0.06, yR + 0.70, ZF + dz]], k ? 0.03 : 0.045, '#1A1C1F');
  });
  /* manguera de succion: del pie de la viga al colector de atras, con su espiral */
  var cs = new THREE.CatmullRomCurve3([[xd - 0.10, 0.50, ZF - 0.22], [XF - 0.75, 0.70, ZF - 0.75], [XF - 0.15, 1.45, ZF - 0.95], [XF * 0.45, 1.70, ZB - 0.40],
    [0.10, 1.40, -W2 - 0.14], [CX1, 1.30, -W2 - 0.12], [XT - 0.6, 1.30, -W2 - 0.12], [XT - 0.05, 1.55, -W2 + 0.25]].map(function(p){ return new THREE.Vector3(p[0], p[1], p[2]); }));
  var texE = pfvTexEspiral(K.succion, K.espiral);
  texE.repeat.set(cs.getLength() / 0.10, 1);
  var mS = new THREE.Mesh(new THREE.TubeGeometry(cs, 120, 0.10, 12, false), new THREE.MeshStandardMaterial({ map: texE, roughness: 0.75, metalness: 0.05 }));
  P.reg('CPV', mS, '#FFFFFF');
  /* abrazaderas de mangueras sobre la pluma */
  [0.25, 0.5, 0.75].forEach(function(f){ var q = pfvLerp(A, B, f); P.bloque(null, 0.08, 0.10, 0.40, 'metal', '#2A2D31', q[0], q[1] + 0.28, q[2], 0.02); });

  /* peldanos de acceso bajo la puerta y asidero */
  P.escaleraV(CX0 + C.CW * 0.30 + 0.25, W2 + 0.06, 0.40, YD - 0.02, 0.44, 'x', K.baranda);
  P.tubo(null, [CX0 + 0.08, YD + 0.15, CZ1 + 0.09], [CX0 + 0.08, C.CY - 0.45, CZ1 + 0.09], 0.02, 'pintura', K.baranda, 8);
  /* extintor junto a la cabina */
  P.cilindro('SCI', 0.08, 0.08, 0.50, 'pintura', '#C62A1E', CX1 + 0.12, YD + 0.28, W2 - 0.20, null, 14);
  /* ═══ techo de la cabina: faros, baliza; espejos ═══ */
  P.faroT('LSM', CX0 + 0.05, C.CY + 0.16, CZ0 + 0.20, '-x');
  P.faroT('LSM', 0.30, YD + 0.85, ZB + 0.30, '-x');

  P.vaciar();
  H.position.set(-(XF + LC) / 2, 0, 0);
  G.userData.ruedas = [];
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = FL * 0.40;
  G.userData.dist = Math.max(FL * 2.9, (LC - XF) * 2.6);
  return G;
}

/* Atlas Copco: letra serif cursiva entre dos franjas negras, sobre amarillo */
function pfvRotAtlas(g, w, h){
  g.fillStyle = '#F0B310'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#16181B';
  g.fillRect(w * 0.08, h * 0.06, w * 0.84, h * 0.13); g.fillRect(w * 0.08, h * 0.81, w * 0.84, h * 0.13);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'italic bold ' + Math.round(h * 0.46) + 'px Georgia, "Times New Roman", serif';
  g.fillText('Atlas Copco', w / 2, h * 0.51, w * 0.86);
}

/* banda gris oscura en paralelogramo con el modelo (DML HP) */
function pfvRotBanda(txt, sub, fondo, banda, tinta){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    g.fillStyle = banda;
    g.beginPath(); g.moveTo(0, h * 0.12); g.lineTo(w, h * 0.12); g.lineTo(w * 0.86, h * 0.88); g.lineTo(0, h * 0.88); g.closePath(); g.fill();
    g.fillStyle = tinta; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.font = 'italic bold ' + Math.round(h * 0.56) + 'px "Arial Black", Arial, sans-serif';
    g.fillText(txt, w * 0.08, h * 0.52);
    var m = g.measureText(txt).width;
    g.font = 'italic bold ' + Math.round(h * 0.28) + 'px Arial, sans-serif';
    g.fillText(sub, w * 0.10 + m, h * 0.64);
  };
}

/* ═══════════════════ ATLAS COPCO DM45 (armada como la DML de modelo_perforadoras.js) ═══════════════════ */
function pfvConstruirDM45(piezas){
  var G = new THREE.Group(), H = new THREE.Group(); G.add(H);
  var P = pfvKit(H, piezas);
  /* el estudio aclara mucho: los tonos van un punto mas oscuros que la pintura real */
  var AM = '#E6A200', AM2 = '#B07C00', GR = '#474B51', GR2 = '#30333A', MAS = '#5E6369';
  /* la torre de la DM45 es gris (galvanizada), no casi negra como la de la DML */
  /* x desde el extremo de perforacion; z con 0 entre orugas (cabina a +Z) */
  var YD = 1.38, L = 9.70, XC = 3.4, ZE = 3.25, ZI = -1.98, ZEa = 2.0, ZIa = -1.70;
  var ZT = 2.60 / 2, XO0 = 2.85, XO1 = 7.45;

  /* ═══ tren tipo excavadora, tejas de triple garra de 600 mm ═══ */
  P.oruga({ code: 'CLH', mando: 'MLH', x0: XO0, x1: XO1, zc: ZT, ancho: 0.60, alto: 0.95, lado: 1, hexB: GR2, paso: 0.235 });
  P.oruga({ code: 'CRH', mando: 'MRH', x0: XO0, x1: XO1, zc: -ZT, ancho: 0.60, alto: 0.95, lado: -1, hexB: GR2, paso: 0.235 });
  /* travesanos al bastidor y yugo de oscilacion */
  [3.35, 7.05].forEach(function(x, k){
    P.bloque(null, 0.46, 0.26, 2 * ZT - 0.25, 'pintura', GR2, x, 0.48, 0, 0.04);
    P.bloque(k ? 'PYB' : null, 0.60, 0.62, 1.30, 'pintura', GR2, x, 0.86, 0, 0.05);
  });
  /* largueros del bastidor principal bajo la cubierta */
  [-0.62, 0.62].forEach(function(z){ P.bloque(null, 9.2, 0.40, 0.30, 'pintura', GR2, 4.95, YD - 0.42, z, 0.04); });

  /* ═══ cubiertas: el extremo de perforacion ancho y el resto angosto ═══ */
  P.piso(0.0, XC, ZI, ZE, YD, 0.24, GR);
  P.piso(XC, L, ZIa, ZEa, YD, 0.24, GR);
  /* mesa de perforacion: cajones a los lados de la campana */
  P.bloque(null, 1.30, YD - 0.24 - 0.62, 0.70, 'pintura', GR, 0.65, (YD - 0.24 + 0.62) / 2, -1.05, 0.05);
  P.bloque(null, 1.30, YD - 0.24 - 0.62, 0.55, 'pintura', GR, 0.65, (YD - 0.24 + 0.62) / 2, 0.88, 0.05);

  /* ═══ cabina de una pieza (FOPS) en la esquina izquierda ═══ */
  var CX0 = 0.20, CX1 = 2.47, CZ0 = 0.89, CZ1 = 2.52;
  pfvCabina(P, { x0: CX0, x1: CX1, z0: CZ0, z1: CZ1, y0: YD, y1: 3.62, hex: AM, marco: AM, fv: 0.42,
    parabrisas: 0.38, posteMedio: 0.40, puerta: [0.06, 0.38], hexAAC: '#4A4F55' });
  var texAtlas = texRotulo3d(pfvRotAtlas, 512, 150);
  P.letrero(texAtlas, 1.15, 0.34, CX0 - 0.012, YD + 0.32, (CZ0 + CZ1) / 2, -Math.PI / 2);
  P.letrero(texAtlas, 0.85, 0.25, CX0 + 1.62, YD + 0.62, CZ1 + 0.012, 0);
  var texDML = texRotulo3d(pfvRotBanda('DM45', '', AM, '#3B4047', '#FFFFFF'), 384, 96);
  P.letrero(texDML, 0.90, 0.24, CX0 + 1.62, YD + 0.28, CZ1 + 0.012, 0);
  var texNum = texNumero3d(null, '#16181C');
  var mN = new THREE.Mesh(new THREE.PlaneGeometry(0.80, 0.25), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
  mN.position.set(CX0 - 0.014, YD + 0.72, (CZ0 + CZ1) / 2); mN.rotation.y = -Math.PI / 2; H.add(mN);

  /* ═══ torre de 30 pies (cambio de barra de 9.1 m), 13.3 m de alto; carrusel de cinco barras ═══ */
  pfvTorre(P, { xa: 0.85, xb: 1.85, za: -0.485, zb: 0.485, y0: YD + 0.05, y1: 13.05, hex: MAS, cuerda: 0.12, paso: 0.92,
    xe: 0.50, ze: 0, yRot: 6.4, hexRot: AM, codRed: 'RG1', rTubo: 0.080,
    carr: { x: 0.42, z: -0.92, rc: 0.21, n: 5, r: 0.07, y0: YD + 0.55, y1: 11.6 },
    lev: [[[3.75, YD + 0.25, 0.32], [1.85, 4.9, 0.32]], [[3.75, YD + 0.25, -0.32], [1.85, 4.9, -0.32]]],
    hexLev: AM, rLev: 0.13, yMesa: YD, campana: { x0: -0.05, x1: 1.0, z0: -0.62, z1: 0.62 }, tipo: 'mate',
    letrero: texRotulo3d(rotuloTexto('Atlas Copco', MAS, '#E6A200', 0.9), 256, 80) });
  pfvCubiertaDet(P, YD, GR2, [[0.4, XC - 0.2, ZE, 1, 1.3], [XO1 + 0.25, L - 0.3, ZEa, 1, 0.55], [XO1 + 0.25, L - 0.3, ZIa, -1, 0.55], [0.4, 2.3, ZI, -1, 0.3]],
    [[0.15, ZE - 0.15], [0.15, ZI + 0.15], [L - 0.15, ZEa - 0.15], [L - 0.15, ZIa + 0.15]]);
  /* soporte del mastil en la cubierta */
  [-0.55, 0.55].forEach(function(z){ P.perfil(null, [[1.25, YD], [2.25, YD], [1.95, YD + 0.75], [1.55, YD + 0.75]], 0.10, z, 'pintura', AM2, 0.02); });

  /* ═══ colector de polvo gris junto al mastil, lado derecho ═══ */
  var XP = 1.30, ZP = -1.45;
  P.cilindro('CPV', 0.36, 0.36, 2.0, 'pintura', '#7A7F85', XP, YD + 0.85, ZP, null, 26);
  P.cilindro('CPV', 0.36, 0.10, 0.55, 'pintura', '#7A7F85', XP, YD - 0.43, ZP, null, 26);
  P.cilindro(null, 0.40, 0.40, 0.08, 'pintura', '#5E6369', XP, YD + 1.88, ZP, null, 26);
  P.cilindro(null, 0.16, 0.16, 0.30, 'metal', '#4A4F55', XP, YD + 2.07, ZP, null, 16);
  [-0.15, 0.15].forEach(function(dz){ P.cilindro(null, 0.05, 0.05, 0.4, 'metal', '#5E646B', XP + 0.38, YD + 1.4, ZP + dz, null, 10); });
  P.manguera('CPV', [[XP, YD - 0.70, ZP], [XP - 0.2, 0.75, ZP + 0.35], [0.70, 0.75, -0.55]], 0.13, '#202326');
  /* cadenas de la cortina */
  P.barra([XP - 0.36, YD + 1.7, ZP], [0.05, YD - 0.25, -0.62], 0.012, '#9AA0A6', 'metal');

  /* ═══ tanque hidraulico ═══ */
  P.bloque('TQH1', 1.80, 1.20, 0.70, 'pintura', AM, 3.70, YD + 0.60, -1.36, 0.05);
  P.cilindro(null, 0.06, 0.06, 0.03, 'vidrio', '#9BB7C9', 3.20, YD + 0.70, -1.01, [Math.PI / 2, 0, 0], 16);
  P.cilindro(null, 0.08, 0.08, 0.20, 'mate', PFV_NEGRO, 4.30, YD + 1.30, -1.36, null, 14);
  P.bloque('40000054', 0.25, 0.35, 0.25, 'mate', PFV_GRIS, 3.20, YD + 1.38, -1.36, 0.03);
  /* baterias y extintores */
  P.bloque('BAT', 0.60, 0.42, 0.42, 'mate', PFV_NEGRO, 3.90, YD + 0.21, 1.70, 0.03);
  [3.70, 4.10].forEach(function(x){ P.cilindro(null, 0.03, 0.03, 0.05, 'metal', '#C9A04A', x, YD + 0.45, 1.70, null, 8); });
  [-0.30, 0.0].forEach(function(dz){ P.cilindro('SCI', 0.10, 0.10, 0.62, 'pintura', '#C62A1E', 4.90, YD + 0.31, -1.40 + dz, null, 16); });

  /* ═══ enfriador alto (radiador, aceite hidraulico, compresor) a la izquierda ═══ */
  var EX0 = 4.40, EX1 = 6.90, EZ0 = 0.96, EZ1 = ZEa, EY = 3.74;
  P.bloque(null, EX1 - EX0, EY - YD, EZ1 - EZ0, 'pintura', AM, (EX0 + EX1) / 2, (YD + EY) / 2, (EZ0 + EZ1) / 2, 0.06);
  P.rejilla('RAD1', 1.12, 1.90, EX0 + 0.66, YD + 1.18, EZ1, '+z', AM2);
  P.rejilla('CHD1', 1.12, 1.90, EX1 - 0.66, YD + 1.18, EZ1, '+z', AM2);
  P.rejilla('VAC', 0.86, 1.55, EX0, YD + 1.15, (EZ0 + EZ1) / 2, '-x', AM2);
  P.bloque(null, 0.70, 0.26, 0.55, 'pintura', AM, EX0 + 0.6, EY + 0.13, (EZ0 + EZ1) / 2, 0.04);
  P.bloque('FAN1', 0.4, 0.4, 0.1, 'metal', PFV_GRIS, EX1 - 0.8, YD + 1.18, EZ0 - 0.05, 0.03);
  P.faroT('LSM', EX0 + 0.05, EY - 0.12, EZ1 - 0.15, '-x');

  /* ═══ motor, compresor y separador ═══ */
  var MZ = -0.25;
  P.bloque('ENG1', 2.00, 0.80, 0.86, 'metal', '#3E4349', 6.00, YD + 0.62, MZ, 0.06);
  P.bloque('ENG1', 1.90, 0.20, 0.70, 'metal', '#2E3237', 6.00, YD + 0.14, MZ, 0.04);
  [-1, 1].forEach(function(s){
    var ta = P.bloque('ENG1', 1.80, 0.18, 0.34, 'pintura', '#E3A20B', 6.00, YD + 1.12, MZ + s * 0.24, 0.05);
    ta.rotation.x = s * 0.45;
  });
  P.pon('ENG1', new THREE.TorusGeometry(0.16, 0.08, 10, 20), 'metal', '#6B7178', 5.15, YD + 1.25, MZ, [0, Math.PI / 2, 0]);
  P.cilindro(null, 0.16, 0.16, 0.95, 'metal', '#8A8F95', 5.30, YD + 2.15, MZ - 0.30, null, 18);
  P.tubo(null, [5.30, YD + 1.2, MZ - 0.30], [5.30, YD + 3.25, MZ - 0.30], 0.07, 'metal', '#6E747B', 12);
  P.cilindro(null, 0.10, 0.10, 0.04, 'mate', PFV_NEGRO, 5.30, YD + 3.28, MZ - 0.30, [0, 0, 0.4], 12);
  P.cilindro('WPM1', 0.12, 0.12, 0.18, 'metal', PFV_GRIS2, 4.95, YD + 0.55, MZ + 0.20, [0, 0, Math.PI / 2], 14);
  P.cilindro('AR1', 0.09, 0.09, 0.36, 'metal', '#2E3237', 6.60, YD + 0.35, MZ - 0.52, [0, 0, Math.PI / 2], 12);
  P.cilindro('AL1', 0.10, 0.10, 0.18, 'metal', PFV_GRIS2, 5.10, YD + 0.95, MZ + 0.45, [0, 0, Math.PI / 2], 14);
  /* caja de bombas adelante y bombas hidraulicas */
  P.bloque('PTB1', 0.40, 0.75, 0.80, 'metal', PFV_GRIS, 4.78, YD + 0.48, MZ, 0.05);
  [[0.48, 0.22], [0.48, -0.22], [0.22, 0.0]].forEach(function(q){
    P.cilindro('PYM', 0.11, 0.11, 0.42, 'metal', '#2E3237', 4.40, YD + q[0], MZ + q[1], [0, 0, Math.PI / 2], 14);
  });
  /* compresor de tornillo atras del volante */
  P.cilindro('CMP', 0.46, 0.46, 0.95, 'pintura', AM, 7.55, YD + 0.72, MZ, [0, 0, Math.PI / 2], 26);
  P.bloque('CMP', 0.40, 0.40, 0.40, 'pintura', AM, 7.55, YD + 1.30, MZ, 0.05);
  P.cilindro(null, 0.40, 0.40, 0.12, 'metal', PFV_GRIS, 7.04, YD + 0.72, MZ, [0, 0, Math.PI / 2], 24);
  /* tanque separador de aire acostado a la derecha, con tapas abombadas */
  P.cilindro('CMP', 0.36, 0.36, 1.90, 'pintura', AM, 6.30, YD + 0.55, -1.30, [0, 0, Math.PI / 2], 26);
  [5.35, 7.25].forEach(function(x, k){
    var cap = P.pon('CMP', new THREE.SphereGeometry(0.36, 22, 12), 'pintura', AM, x, YD + 0.55, -1.30);
    cap.scale.set(0.35, 1, 1);
  });
  P.cilindro(null, 0.05, 0.05, 0.25, 'cromo', null, 6.8, YD + 1.02, -1.30, null, 10);
  /* filtros de aire atras y sus ductos */
  [-1.30, -0.65].forEach(function(z){
    P.cilindro(null, 0.25, 0.25, 0.90, 'pintura', AM, 8.55, YD + 0.62, z, null, 22);
    P.cilindro(null, 0.27, 0.27, 0.10, 'pintura', AM2, 8.55, YD + 1.12, z, null, 22);
    P.cilindro(null, 0.10, 0.12, 0.28, 'mate', PFV_NEGRO, 8.55, YD + 1.30, z, null, 14);
  });
  P.manguera(null, [[8.55, YD + 0.85, -0.65], [8.1, YD + 1.2, -0.3], [7.55, YD + 1.5, MZ]], 0.10, '#2A2D31');
  P.manguera(null, [[8.55, YD + 0.85, -1.30], [7.4, YD + 1.4, -0.9], [5.6, YD + 1.4, MZ - 0.1]], 0.09, '#2A2D31');
  /* engrase central y su bomba */
  P.cilindro('SEN', 0.24, 0.24, 0.70, 'pintura', '#B9302A', 8.10, YD + 0.35, 1.55, null, 20);
  P.cilindro('GP1', 0.08, 0.08, 0.32, 'metal', PFV_GRIS2, 8.10, YD + 0.86, 1.55, null, 12);
  /* combustible bajo la cubierta trasera */
  P.bloque('TQC1', 1.30, 0.55, 1.10, 'pintura', AM2, 8.95, YD - 0.60, 0, 0.05);

  /* ═══ mangueras y mazo por la cubierta hasta el mastil ═══ */
  P.manguera('LPA', [[7.25, YD + 0.9, -1.0], [5.0, YD + 0.15, -0.70], [2.6, YD + 0.15, -0.70], [1.95, YD + 0.6, -0.30]], 0.08, '#202326');
  P.manguera('LPH', [[4.4, YD + 0.5, MZ + 0.2], [3.2, YD + 0.12, 0.45], [2.0, YD + 0.4, 0.40]], 0.045);
  P.manguera('LPH', [[4.4, YD + 0.3, MZ - 0.2], [3.2, YD + 0.10, 0.62], [2.0, YD + 0.3, 0.55]], 0.040);
  P.tubo('HAR', [2.6, YD + 0.05, 0.75], [8.0, YD + 0.05, 0.75], 0.025, 'goma', '#22262B', 8);

  /* ═══ gatas: dos en el extremo de perforacion y una atras ═══ */
  P.gata(null, 2.40, 1.475, YD + 0.40, AM);
  P.gata(null, 2.40, -1.475, YD + 0.40, AM);
  P.gata('PG3', 8.95, 0.95, YD + 0.40, AM);

  /* ═══ barandas amarillas, escaleras y faros ═══ */
  var YB = YD;
  P.baranda([[0.32, CZ1 + 0.04], [0.32, ZE - 0.05], [2.60, ZE - 0.05]], YB, 1.05, AM, GR2);
  P.baranda([[XC - 0.05, ZE - 0.05], [XC - 0.05, ZEa + 0.04]], YB, 1.05, AM, GR2);
  P.baranda([[XC + 0.05, ZEa - 0.05], [EX0 - 0.10, ZEa - 0.05]], YB, 1.05, AM, GR2);
  P.baranda([[EX1 + 0.10, ZEa - 0.05], [L - 0.05, ZEa - 0.05], [L - 0.05, 0.62]], YB, 1.05, AM, GR2);
  P.baranda([[L - 0.05, -0.20], [L - 0.05, ZIa + 0.05], [2.95, ZIa + 0.05]], YB, 1.05, AM, GR2);
  P.escaleraV(3.0, ZE + 0.06, 0.35, YD, 0.50, 'x', AM);
  P.escaleraV(L + 0.06, 0.21, 0.35, YD, 0.50, 'z', AM);
  P.faroT('LSM', 0.02, YD - 0.12, 2.6, '-x');
  P.faroT('LSM', 0.02, YD - 0.12, -1.5, '-x');
  P.faroT('LSM', L + 0.02, YD + 1.15, 1.6, '+x');

  P.vaciar();
  H.position.set(-L / 2, 0, -(ZE + ZI) / 2);
  G.userData.ruedas = [];
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = 5.6;
  G.userData.dist = 40;
  return G;
}
/* ══════════════════════════════════════════════════════════════════
   MARTILLO HIDRAULICO ATLAS COPCO MB 1200 (MH-06)
   Epiroc / Atlas Copco: peso de servicio 1 200 kg, excavadora de 15 a
   26 t, herramienta de 120 mm con 600 mm de largo util. Largo total
   2 469 mm, ancho 472 mm y alto 608 mm (ficha de un equipo usado en
   Boom & Bucket). El reparto del largo (herramienta 0.60 · carcasa 1.62
   · adaptador 0.25) y la forma de la carcasa (cabeza delantera mas baja
   con la grasera y el DustProtector, ventanas laterales, placas de
   desgaste) salen de fotos de catalogo. Como los Hydrokhan, va echado
   sobre durmientes, la punta hacia -X y las caras con rotulos a +Z y -Z.
   ══════════════════════════════════════════════════════════════════ */
var PFV_MB_AM = '#E0A00A', PFV_MB_AM2 = '#A87806', PFV_MB_NEGRO = '#1A1C1F';

function pfvRotAtlasMB(g, w, h){
  g.fillStyle = PFV_MB_AM; g.fillRect(0, 0, w, h);
  g.fillStyle = '#16181B';
  g.fillRect(w * 0.06, h * 0.04, w * 0.88, h * 0.12); g.fillRect(w * 0.06, h * 0.84, w * 0.88, h * 0.12);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'italic bold ' + Math.round(h * 0.50) + 'px Georgia, "Times New Roman", serif';
  g.fillText('Atlas Copco', w / 2, h * 0.52, w * 0.88);
}

function pfvConstruirMB1200(piezas){
  var G = new THREE.Group(), H = new THREE.Group(); G.add(H);
  var P = pfvKit(H, piezas);
  var EJE_Z = [Math.PI / 2, 0, 0], EJE_X = [0, 0, Math.PI / 2];
  var LT = 0.60, LCa = 1.62, LA = 0.25, Y = 0.608, Z = 0.472;
  var xP = -(LT + LCa + LA) / 2, xC0 = xP + LT, xC1 = xC0 + LCa, xA1 = xC1 + LA;
  var y0 = 0.18, yc = y0 + Y / 2;

  /* durmientes de madera */
  [xC0 + 0.30, xC1 - 0.25].forEach(function(x){
    P.bloque(null, 0.20, y0, Z + 0.50, 'mate', '#7A5634', x, y0 / 2, 0, 0.02);
    [-1, 1].forEach(function(l){ P.bloque(null, 0.16, 0.10, 0.07, 'mate', '#6B4A2C', x, y0 + 0.05, l * (Z / 2 + 0.06), 0.01); });
  });

  /* ═══ carcasa amarilla: cabeza delantera baja y cuerpo alto, cantos achaflanados ═══ */
  var ch = 0.06, xH = xC0 + 0.34;
  var perfilC = [[xC0, yc - 0.20], [xC0 + 0.05, yc - 0.23], [xH - 0.08, yc - 0.23], [xH, y0 + 0.004], [xC1 - ch, y0 + 0.004], [xC1, y0 + ch],
                 [xC1, y0 + Y - ch], [xC1 - ch, y0 + Y], [xH, y0 + Y], [xH - 0.08, yc + 0.23], [xC0 + 0.05, yc + 0.23], [xC0, yc + 0.20]];
  P.perfil('HAM', perfilC, Z, 0, 'pintura', PFV_MB_AM, 0.025);
  /* placas de desgaste atornilladas en los cantos de arriba y abajo */
  P.bloque(null, LCa - 0.55, 0.025, Z * 0.70, 'metal', '#3A3D42', (xH + xC1) / 2 + 0.05, y0 + Y + 0.012, 0, 0.008);
  /* ventanas laterales que dejan ver el cilindro y sus pernos; rotulos */
  var texAC = texRotulo3d(pfvRotAtlasMB, 384, 110), texMB = texRotulo3d(pfvRotPlaca('MB 1200', PFV_MB_AM, '#16181B'), 320, 80);
  var pernos = [];
  [-1, 1].forEach(function(l){
    var zf = l * Z / 2, ry = l > 0 ? 0 : Math.PI;
    P.bloque(null, 0.42, 0.20, 0.03, 'mate', '#0B0C0E', xH + 0.62, yc + 0.12, zf, 0.02);
    P.cilindro('HAM', 0.075, 0.075, 0.40, 'metal', '#4A4E55', xH + 0.62, yc + 0.12, zf - l * 0.03, EJE_X, 18);
    P.letrero(texAC, 0.62, 0.18, xH + 0.55, yc - 0.13, zf + l * 0.012, ry);
    P.letrero(texMB, 0.40, 0.10, xC1 - 0.22, yc + 0.18, zf + l * 0.012, ry);
    /* refuerzos negros en las esquinas de atras */
    P.bloque(null, 0.10, Y + 0.02, 0.03, 'mate', PFV_MB_NEGRO, xC1 - 0.05, yc, zf + l * 0.006, 0.01);
    [[0.15, 0.22], [0.15, -0.22], [0.55, -0.24], [0.95, -0.24], [1.15, 0.24], [0.75, 0.24]].forEach(function(q){
      pernos.push([xH + q[0], yc + q[1], zf + l * 0.012, Math.PI / 2, 0, 0]);
    });
    /* pasadores de retencion de la herramienta en la cabeza */
    [-0.10, 0.10].forEach(function(dy){ P.cilindro('PYB', 0.035, 0.035, 0.03, 'metal', '#8A8F96', xC0 + 0.16, yc + dy, l * 0.235 + l * 0.012, EJE_Z, 14); });
  });
  P.inst(null, new THREE.CylinderGeometry(0.026, 0.026, 0.03, 6), 'metal', '#2B2D31', pernos);
  /* grasera y DustProtector en la cabeza */
  P.cilindro('SEN', 0.018, 0.018, 0.06, 'metal', '#C9A43A', xC0 + 0.22, yc + 0.26, 0, null, 8);

  /* ═══ buje delantero, guardapolvo de goma y la herramienta (punta) ═══ */
  P.cilindro(null, 0.11, 0.12, 0.05, 'goma', PFV_GOMA, xC0 - 0.025, yc, 0, EJE_X, 24);
  P.cilindro('PYB', 0.085, 0.085, 0.03, 'metal', '#6E737A', xC0 - 0.06, yc, 0, EJE_X, 20);
  P.cilindro('GET', 0.06, 0.06, LT - 0.16, 'metal', '#3F4348', xP + 0.16 + (LT - 0.16) / 2, yc, 0, EJE_X, 22);
  P.cilindro('GET', 0.008, 0.06, 0.16, 'metal', '#9DA3AA', xP + 0.08, yc, 0, [0, 0, Math.PI / 2], 22);
  [-1, 1].forEach(function(l){ P.bloque(null, 0.12, 0.02, 0.02, 'mate', '#1A1C1F', xC0 - 0.12, yc, l * 0.058, 0.004); });

  /* ═══ adaptador negro (placa al brazo) con las dos orejas y pasadores ═══ */
  P.bloque(null, 0.06, Y + 0.04, Z + 0.04, 'mate', PFV_MB_NEGRO, xC1 + 0.03, yc, 0, 0.015);
  [-1, 1].forEach(function(l){
    P.perfil(null, [[xC1 + 0.05, y0 + 0.02], [xA1 - 0.06, y0 + 0.10], [xA1, yc - 0.05], [xA1, yc + 0.20], [xA1 - 0.10, y0 + Y + 0.02], [xC1 + 0.05, y0 + Y - 0.02]],
      0.05, l * (Z / 2 - 0.06), 'mate', PFV_MB_NEGRO, 0.012);
  });
  [[xA1 - 0.07, yc + 0.02], [xC1 + 0.13, yc + 0.20]].forEach(function(p){
    [-1, 1].forEach(function(l){ P.cilindro(null, 0.075, 0.075, 0.04, 'mate', '#2A2C30', p[0], p[1], l * (Z / 2 - 0.02), EJE_Z, 22); });
    P.cilindro('PYB', 0.040, 0.040, Z + 0.06, 'metal', '#B9BEC4', p[0], p[1], 0, EJE_Z, 16);
  });
  /* tope de goma del adaptador */
  P.bloque(null, 0.04, 0.30, Z - 0.16, 'goma', PFV_GOMA, xC1 + 0.075, yc - 0.05, 0, 0.01);

  /* ═══ puertos de presion y retorno, con sus mangueras sueltas ═══ */
  [-0.09, 0.09].forEach(function(dz, i){
    var p0 = [xC1 - 0.24, y0 + Y + 0.01, dz];
    P.cilindro('LPH', 0.04, 0.04, 0.08, 'metal', '#B9BEC4', p0[0], p0[1] + 0.04, dz, null, 12);
    P.manguera('LPH', [[p0[0], p0[1] + 0.07, dz], [p0[0] - 0.04, p0[1] + 0.38 + i * 0.06, dz * 1.4], [p0[0] + 0.40, p0[1] + 0.52 + i * 0.05, dz * 2.0],
      [xA1 + 0.25, p0[1] + 0.12, dz * 2.4], [xA1 + 0.42, 0.14, dz * 2.8]], 0.028, '#141618');
    P.cilindro(null, 0.035, 0.035, 0.10, 'metal', '#C9A43A', xA1 + 0.43, 0.10, dz * 2.8, null, 12);
  });
  /* argolla de izaje */
  P.pon(null, new THREE.TorusGeometry(0.06, 0.017, 8, 16), 'metal', '#5A5F66', xH + 0.35, y0 + Y + 0.07, 0, [0, Math.PI / 2, 0]);
  /* placa de serie */
  P.bloque(null, 0.12, 0.07, 0.008, 'metal', '#C9CED3', xC1 - 0.30, yc - 0.10, Z / 2 + 0.008, 0.002);

  P.vaciar();
  G.userData.ruedas = [];
  G.userData.mirarY = 0.42;
  G.userData.dist = 4.8;
  return G;
}

/* ═══ registro ═══
   Solo los modelos exactos con su marca: otra T450 o un DM45 de otra marca
   no entran por error. */
registrarModelo3d({
  nombre: 'Perforadoras DX700, DP1100, T450, JD1400/JD2000, DM45 y martillo MB 1200',
  clave: function(e){
    var m = mod3d(e), ma = String((e && e.marca) || '').toUpperCase(), cl = String((e && e.clasif) || '').toUpperCase();
    var perfo = /PERFORA/.test(cl);
    if(m === 'DX700' && /SANDVI/.test(ma)) return 'PFVDX700';
    if(m === 'DP1100' && /SANDVI/.test(ma)) return 'PFVDP1100';
    if(m === 'T450' && /EVERDIGM|HYUNDAI/.test(ma) && perfo) return 'PFVT450';
    if(m === 'JD1400' && /SOOSAN|JUNJIN/.test(ma)) return 'PFVJD1400';
    if(m === 'JD2000' && /SOOSAN|JUNJIN/.test(ma)) return 'PFVJD2000';
    if(/^DM45E?$/.test(m) && /ATLAS|EPIROC/.test(ma)) return 'PFVDM45';
    if(m === 'MB1200' && /ATLAS|EPIROC/.test(ma) && /MARTILLO/.test(cl)) return 'PFVMB1200';
    return null;
  },
  construir: function(e, piezas, clave){
    var k = clave.replace(/^PFV/, '');
    if(k === 'DM45') return pfvConstruirDM45(piezas);
    if(k === 'MB1200') return pfvConstruirMB1200(piezas);
    return pfvConstruirTH(k, piezas);
  }
});
