/* ══════════════════════════════════════════════════════════════════
   PERFORADORAS — modelos de detalle (prefijo per)

   Rotativas de mastil de celosia (perforacion de produccion):
     Atlas Copco DML HP ........ EP-19, EP-28, EP-32, EP-33
     Sandvik D75KS ............. EP-41
     Sandvik D75KX ............. EP-153-AL, EP-154-AL
     Sandvik DR412i ............ EP-42 (propia), EP-129/130/131/151/152-AL
     Sandvik DR460 ............. EP-39 (San Martin)
   DTH de pluma con viga de avance (Leopard / Hyundai Everdigm):
     Sandvik Leopard DI650i .... EP-155-AL, EP-156-AL
     Everdigm D800 ............. EP-146/147/157/160-AL

   Medidas (m) de las hojas del fabricante:
                         DML HP   D75KS   D75KX   DR412i  DR460*  DI650i  D800
     alto con mastil      13.4    16.33   16.52   19.2    ~19     ~12.1   ~10.6
     largo del cuerpo      9.82   10.97   12.69   14.5    ~13.1    ~7.4   ~6.7
                                          (+1.65 genset)
     ancho                 5.17    5.05    6.46    7.4    ~5.6     3.0     2.5
     orugas (largo)        5.01   ~5.2     5.1     6.454   5.36    ~3.6    ~3.5
     trocha (centros)      2.91    2.83    3.41    3.67   ~3.0     2.6     2.15
     tejas                 0.85    0.85    0.85    0.90    0.90    0.40    0.35
     techo de la cabina    3.62   ~3.8     3.78   ~4.2    ~3.4    ~3.35   ~2.8
   Fuentes: Epiroc «DML» (2018) y Atlas Copco DML (2013), tabla A..YY con el
   tren Cat 330L; Sandvik TS2-408 D75KS (2018) y TS2-423 D75KX (2020);
   Sandvik DR412i (2024, dibujos con el mastil extendido de 25.8 m: de ahi
   salen las cotas medidas); Sandvik Leopard DI650i T3 (2022): viga de
   avance 11.4 m, alcance de pluma 4.19 m, 3.0 x 3.5 m de transporte;
   Hyundai Everdigm D800 (Drill Connex): 11.3 x 2.5 x 3.9 m, orugas de
   2.91 m de contacto y tejas de 350 mm. *El DR460 no tiene hoja de
   medidas publicada: sale de la foto de la EP-39 (orugas Cat 345 de
   5.36 m como escala) y de su hermana DR412i.

   Disposicion (fotos y dibujos): el extremo de perforacion va adelante
   (-X). La cabina en la esquina izquierda (+Z) de ese extremo; el mastil
   al centro, a su lado, con el eje de perforacion por delante de la cara
   del mastil; el colector de polvo en la esquina opuesta a la cabina;
   detras el motor, el compresor y el enfriador; gatas niveladoras abajo y
   el mastil arriba (perforando). En las DTH la pluma sale del frente
   derecho y la viga de avance queda vertical delante de la cabina.

   Colores: DML amarilla Atlas Copco con el mastil gris oscuro; D75KS roja
   Sandvik con cabina blanca y barandas rojas; D75KX naranja con barandas
   amarillas; DR412i alquiladas en los colores de fabrica (cuerpo gris,
   mastil naranja, cabina blanca, barandas amarillas); DR460 y DR412i
   propias como las de San Martin en Shougang (supuesto para la EP-42):
   rojas, cabina azul marino, franjas amarillas y mastil oxido oscuro.
   Leopard roja con techo de cabina blanco; D800 turquesa Everdigm.
   ══════════════════════════════════════════════════════════════════ */

var PER_NEGRO = '#17191C', PER_GOMA = '#141619', PER_ACERO = '#6E747B', PER_GRIS = '#3A3F45', PER_GRIS2 = '#565D65';

/* ═══ lienzos ═══ */
/* malla de alambre de las rejillas (enfriadores, puertas del motor) */
function perTexMalla(fondo, hilo, n, grueso){
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
function perTexPiso(fondo, platina){
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
/* Atlas Copco: letra serif cursiva entre dos franjas negras, sobre amarillo */
function perRotAtlas(g, w, h){
  g.fillStyle = '#F0B310'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#16181B';
  g.fillRect(w * 0.08, h * 0.06, w * 0.84, h * 0.13); g.fillRect(w * 0.08, h * 0.81, w * 0.84, h * 0.13);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'italic bold ' + Math.round(h * 0.46) + 'px Georgia, "Times New Roman", serif';
  g.fillText('Atlas Copco', w / 2, h * 0.51, w * 0.86);
}
/* banda gris oscura en paralelogramo con el modelo (DML HP) */
function perRotBanda(txt, sub, fondo, banda, tinta){
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
/* SANDVIK: letras gruesas en un recuadro */
function perRotSandvik(fondo, tinta, caja){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    if(caja){ g.fillStyle = caja; g.fillRect(w * 0.04, h * 0.12, w * 0.92, h * 0.76); }
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.58) + 'px "Arial Black", Arial, sans-serif';
    g.fillText('SANDVIK', w / 2, h * 0.54, w * 0.86);
  };
}
/* logo de San Martin: circulo negro con franjas y el nombre al lado */
function perRotSM(fondo){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    var r = h * 0.40, cx = h * 0.50, cy = h * 0.5;
    g.fillStyle = '#121316'; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
    g.fillStyle = fondo;
    for(var i = -2; i <= 2; i++) g.fillRect(cx + i * r * 0.36 - r * 0.07, cy - r, r * 0.12, r * 2);
    g.fillStyle = '#121316'; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.36) + 'px Arial, sans-serif';
    g.fillText('San', h * 1.02, h * 0.31); g.fillText('Martín', h * 1.02, h * 0.71);
  };
}
/* el escudo negro del D800 y la palabra EVERDIGM */
function perRotD800(g, w, h){
  g.fillStyle = '#17A2A8'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#121418';
  g.beginPath(); g.moveTo(w * 0.06, h * 0.06); g.lineTo(w * 0.94, h * 0.06); g.lineTo(w * 0.94, h * 0.66);
  g.lineTo(w * 0.5, h * 0.96); g.lineTo(w * 0.06, h * 0.66); g.closePath(); g.fill();
  g.strokeStyle = '#E8ECEF'; g.lineWidth = h * 0.025; g.stroke();
  g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold ' + Math.round(h * 0.34) + 'px "Arial Black", Arial, sans-serif';
  g.fillText('D800', w / 2, h * 0.32, w * 0.82);
  g.font = 'bold ' + Math.round(h * 0.11) + 'px Arial, sans-serif';
  g.fillText('DRILL RIG', w / 2, h * 0.60);
}
function perRotEverdigm(g, w, h){
  g.fillStyle = '#17A2A8'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#F2C230'; g.fillRect(w * 0.02, h * 0.25, h * 0.5, h * 0.5);
  g.fillStyle = '#2FA84F'; g.fillRect(w * 0.02 + h * 0.25, h * 0.25, h * 0.25, h * 0.5);
  g.fillStyle = '#FFFFFF'; g.textAlign = 'left'; g.textBaseline = 'middle';
  g.font = 'bold ' + Math.round(h * 0.52) + 'px Arial, sans-serif';
  g.fillText('EVERDIGM', w * 0.04 + h * 0.6, h * 0.54, w * 0.82);
}

/* ═══ herramientas: kitDetalle mas lo que piden las perforadoras ═══ */
function perKit(H, piezas){
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
  var texMalla = perTexMalla('#121315', '#8C939A', 9, 2.6);
  var texPiso = perTexPiso('#6A7077', '#80868D');
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
function perTorre(P, o){
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
  P.cilindro(null, o.rTubo, o.rTubo, yR - 0.32, 'metal', PER_ACERO, xe, (yR - 0.32) / 2, ze, null, 20);
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
    P.inst(null, new THREE.CylinderGeometry(C.r, C.r, C.y1 - C.y0 + 0.2, 16), 'metal', PER_ACERO, tubos);
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
      P.bloque(null, q[2] + 0.04, 0.62, q[3] + 0.04, 'goma', PER_GOMA, q[0], 0.31, q[1], 0.01);
    });
  }
}

/* ═══ cabina con postes, vidrios con marco, techo con alero, puerta e interior ═══ */
function perCabina(P, o){
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
function perCubiertaDet(P, y, hex, cantos, orejas){
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

/* ═══════════════════ ATLAS COPCO DML HP ═══════════════════ */
function perConstruirDML(piezas){
  var G = new THREE.Group(), H = new THREE.Group(); G.add(H);
  var P = perKit(H, piezas);
  /* el estudio aclara mucho: los tonos van un punto mas oscuros que la pintura real */
  var AM = '#E6A200', AM2 = '#B07C00', GR = '#474B51', GR2 = '#30333A', MAS = '#1C1F23';
  /* x desde el extremo de perforacion; z con 0 entre orugas (cabina a +Z) */
  var YD = 1.40, L = 9.82, XC = 3.4, ZE = 3.31, ZI = -1.79, ZEa = 2.06, ZIa = -1.74;
  var ZT = 2.91 / 2, XO0 = 2.7, XO1 = 7.71;

  /* ═══ tren Cat 330L ═══ */
  P.oruga({ code: 'CLH', mando: 'MLH', x0: XO0, x1: XO1, zc: ZT, ancho: 0.85, alto: 1.0, lado: 1, hexB: GR2, paso: 0.235 });
  P.oruga({ code: 'CRH', mando: 'MRH', x0: XO0, x1: XO1, zc: -ZT, ancho: 0.85, alto: 1.0, lado: -1, hexB: GR2, paso: 0.235 });
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
  perCabina(P, { x0: CX0, x1: CX1, z0: CZ0, z1: CZ1, y0: YD, y1: 3.62, hex: AM, marco: AM, fv: 0.42,
    parabrisas: 0.38, posteMedio: 0.40, puerta: [0.06, 0.38], hexAAC: '#4A4F55' });
  var texAtlas = texRotulo3d(perRotAtlas, 512, 150);
  P.letrero(texAtlas, 1.15, 0.34, CX0 - 0.012, YD + 0.32, (CZ0 + CZ1) / 2, -Math.PI / 2);
  P.letrero(texAtlas, 0.85, 0.25, CX0 + 1.62, YD + 0.62, CZ1 + 0.012, 0);
  var texDML = texRotulo3d(perRotBanda('DML', 'HP', AM, '#3B4047', '#FFFFFF'), 384, 96);
  P.letrero(texDML, 0.90, 0.24, CX0 + 1.62, YD + 0.28, CZ1 + 0.012, 0);
  var texNum = texNumero3d(null, '#16181C');
  var mN = new THREE.Mesh(new THREE.PlaneGeometry(0.80, 0.25), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
  mN.position.set(CX0 - 0.014, YD + 0.72, (CZ0 + CZ1) / 2); mN.rotation.y = -Math.PI / 2; H.add(mN);

  /* ═══ mastil: torre de 30 pies, gris oscuro ═══ */
  perTorre(P, { xa: 0.85, xb: 1.85, za: -0.485, zb: 0.485, y0: YD + 0.05, y1: 13.2, hex: MAS, cuerda: 0.12, paso: 0.92,
    xe: 0.50, ze: 0, yRot: 6.4, hexRot: AM, codRed: 'RG1', rTubo: 0.080,
    carr: { x: 0.42, z: -0.92, rc: 0.21, n: 5, r: 0.07, y0: YD + 0.55, y1: 11.6 },
    lev: [[[3.75, YD + 0.25, 0.32], [1.85, 4.9, 0.32]], [[3.75, YD + 0.25, -0.32], [1.85, 4.9, -0.32]]],
    hexLev: AM, rLev: 0.13, yMesa: YD, campana: { x0: -0.05, x1: 1.0, z0: -0.62, z1: 0.62 }, tipo: 'mate',
    letrero: texRotulo3d(rotuloTexto('Atlas Copco', MAS, '#E6A200', 0.9), 256, 80) });
  perCubiertaDet(P, YD, GR2, [[0.4, XC - 0.2, ZE, 1, 1.3], [XO1 + 0.25, L - 0.3, ZEa, 1, 0.55], [XO1 + 0.25, L - 0.3, ZIa, -1, 0.55], [0.4, 2.3, ZI, -1, 0.3]],
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
  P.cilindro(null, 0.08, 0.08, 0.20, 'mate', PER_NEGRO, 4.30, YD + 1.30, -1.36, null, 14);
  P.bloque('40000054', 0.25, 0.35, 0.25, 'mate', PER_GRIS, 3.20, YD + 1.38, -1.36, 0.03);
  /* baterias y extintores */
  P.bloque('BAT', 0.60, 0.42, 0.42, 'mate', PER_NEGRO, 3.90, YD + 0.21, 1.70, 0.03);
  [3.70, 4.10].forEach(function(x){ P.cilindro(null, 0.03, 0.03, 0.05, 'metal', '#C9A04A', x, YD + 0.45, 1.70, null, 8); });
  [-0.30, 0.0].forEach(function(dz){ P.cilindro('SCI', 0.10, 0.10, 0.62, 'pintura', '#C62A1E', 4.90, YD + 0.31, -1.40 + dz, null, 16); });

  /* ═══ enfriador alto (radiador, aceite hidraulico, compresor) a la izquierda ═══ */
  var EX0 = 4.40, EX1 = 6.90, EZ0 = 0.96, EZ1 = ZEa, EY = 3.74;
  P.bloque(null, EX1 - EX0, EY - YD, EZ1 - EZ0, 'pintura', AM, (EX0 + EX1) / 2, (YD + EY) / 2, (EZ0 + EZ1) / 2, 0.06);
  P.rejilla('RAD1', 1.12, 1.90, EX0 + 0.66, YD + 1.18, EZ1, '+z', AM2);
  P.rejilla('CHD1', 1.12, 1.90, EX1 - 0.66, YD + 1.18, EZ1, '+z', AM2);
  P.rejilla('VAC', 0.86, 1.55, EX0, YD + 1.15, (EZ0 + EZ1) / 2, '-x', AM2);
  P.bloque(null, 0.70, 0.26, 0.55, 'pintura', AM, EX0 + 0.6, EY + 0.13, (EZ0 + EZ1) / 2, 0.04);
  P.bloque('FAN1', 0.4, 0.4, 0.1, 'metal', PER_GRIS, EX1 - 0.8, YD + 1.18, EZ0 - 0.05, 0.03);
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
  P.cilindro(null, 0.10, 0.10, 0.04, 'mate', PER_NEGRO, 5.30, YD + 3.28, MZ - 0.30, [0, 0, 0.4], 12);
  P.cilindro('WPM1', 0.12, 0.12, 0.18, 'metal', PER_GRIS2, 4.95, YD + 0.55, MZ + 0.20, [0, 0, Math.PI / 2], 14);
  P.cilindro('AR1', 0.09, 0.09, 0.36, 'metal', '#2E3237', 6.60, YD + 0.35, MZ - 0.52, [0, 0, Math.PI / 2], 12);
  P.cilindro('AL1', 0.10, 0.10, 0.18, 'metal', PER_GRIS2, 5.10, YD + 0.95, MZ + 0.45, [0, 0, Math.PI / 2], 14);
  /* caja de bombas adelante y bombas hidraulicas */
  P.bloque('PTB1', 0.40, 0.75, 0.80, 'metal', PER_GRIS, 4.78, YD + 0.48, MZ, 0.05);
  [[0.48, 0.22], [0.48, -0.22], [0.22, 0.0]].forEach(function(q){
    P.cilindro('PYM', 0.11, 0.11, 0.42, 'metal', '#2E3237', 4.40, YD + q[0], MZ + q[1], [0, 0, Math.PI / 2], 14);
  });
  /* compresor de tornillo atras del volante */
  P.cilindro('CMP', 0.46, 0.46, 0.95, 'pintura', AM, 7.55, YD + 0.72, MZ, [0, 0, Math.PI / 2], 26);
  P.bloque('CMP', 0.40, 0.40, 0.40, 'pintura', AM, 7.55, YD + 1.30, MZ, 0.05);
  P.cilindro(null, 0.40, 0.40, 0.12, 'metal', PER_GRIS, 7.04, YD + 0.72, MZ, [0, 0, Math.PI / 2], 24);
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
    P.cilindro(null, 0.10, 0.12, 0.28, 'mate', PER_NEGRO, 8.55, YD + 1.30, z, null, 14);
  });
  P.manguera(null, [[8.55, YD + 0.85, -0.65], [8.1, YD + 1.2, -0.3], [7.55, YD + 1.5, MZ]], 0.10, '#2A2D31');
  P.manguera(null, [[8.55, YD + 0.85, -1.30], [7.4, YD + 1.4, -0.9], [5.6, YD + 1.4, MZ - 0.1]], 0.09, '#2A2D31');
  /* engrase central y su bomba */
  P.cilindro('SEN', 0.24, 0.24, 0.70, 'pintura', '#B9302A', 8.10, YD + 0.35, 1.55, null, 20);
  P.cilindro('GP1', 0.08, 0.08, 0.32, 'metal', PER_GRIS2, 8.10, YD + 0.86, 1.55, null, 12);
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

/* ═══════════════════ SANDVIK D75KS y D75KX ═══════════════════ */
function perConstruirD75(piezas, kx){
  var G = new THREE.Group(), H = new THREE.Group(); G.add(H);
  var P = perKit(H, piezas);
  var R1 = kx ? '#C83A12' : '#B3240E', R2 = kx ? '#8C2809' : '#7A1808', BL = '#E4E5E0', BAR = kx ? '#E8AE10' : R1;
  var YD = 1.55, L = kx ? 12.69 : 10.97, XC = 3.6, ZE = kx ? 3.2 : 3.1, ZI = kx ? -2.1 : -1.95, ZA = kx ? 2.1 : 1.95;
  var ZT = (kx ? 3.41 : 2.83) / 2, XO0 = 3.2, XO1 = kx ? 8.3 : 8.4, MAST = kx ? 16.52 : 16.33;

  /* ═══ tren S35HD ═══ */
  P.oruga({ code: 'CLH', mando: 'MLH', x0: XO0, x1: XO1, zc: ZT, ancho: 0.85, alto: 1.10, lado: 1, hexB: '#2E3236', paso: 0.25 });
  P.oruga({ code: 'CRH', mando: 'MRH', x0: XO0, x1: XO1, zc: -ZT, ancho: 0.85, alto: 1.10, lado: -1, hexB: '#2E3236', paso: 0.25 });
  [XO0 + 0.8, XO1 - 0.9].forEach(function(x, k){
    P.bloque(null, 0.50, 0.28, 2 * ZT - 0.25, 'pintura', R2, x, 0.55, 0, 0.04);
    P.bloque(k ? 'PYB' : null, 0.60, 0.80, 1.40, 'pintura', R2, x, 0.98, 0, 0.05);
  });
  [-0.70, 0.70].forEach(function(z){ P.bloque(null, L - 0.6, 0.45, 0.32, 'pintura', R2, L / 2, YD - 0.47, z, 0.04); });

  /* ═══ cubiertas ═══ */
  P.piso(0.0, XC, ZI, ZE, YD, 0.24, R1);
  P.piso(XC, L, -ZA, ZA, YD, 0.24, R1);
  P.bloque(null, 1.40, YD - 0.24 - 0.62, 0.70, 'pintura', R1, 1.0, (YD - 0.24 + 0.62) / 2, -1.25, 0.05);
  P.bloque(null, 1.40, YD - 0.24 - 0.62, 0.60, 'pintura', R1, 1.0, (YD - 0.24 + 0.62) / 2, 1.05, 0.05);

  /* ═══ cabina blanca ═══ */
  var CX0 = 0.25, CX1 = 2.35, CZ0 = 1.10, CZ1 = 3.0;
  perCabina(P, { x0: CX0, x1: CX1, z0: CZ0, z1: CZ1, y0: YD, y1: 3.80, hex: BL, marco: BL, fv: 0.36,
    posteMedio: 0.48, puerta: [0.52, 0.92], asidero: R1 });
  var texSdk = texRotulo3d(perRotSandvik(BL, '#1D4E9E', null), 384, 96);
  P.letrero(texSdk, 0.95, 0.24, (CX0 + CX1) / 2 - 0.35, YD + 0.40, CZ1 + 0.012, 0);
  var texNum = texNumero3d(null, '#16181C');
  var mN = new THREE.Mesh(new THREE.PlaneGeometry(0.80, 0.25), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
  mN.position.set(CX0 - 0.014, YD + 0.40, (CZ0 + CZ1) / 2); mN.rotation.y = -Math.PI / 2; H.add(mN);

  /* ═══ mastil rojo de celosia ═══ */
  perTorre(P, { xa: 1.60, xb: 2.70, za: -0.55, zb: 0.55, y0: YD + 0.05, y1: MAST - 0.25, hex: R1, cuerda: 0.14, paso: 1.0,
    xe: 1.20, ze: 0, yRot: 7.6, hexRot: R2, rTubo: 0.095,
    carr: { x: 2.15, z: 0.95, rc: 0.24, n: 6, r: 0.085, y0: 4.6, y1: 13.8, tapa: kx ? R1 : null },
    lev: [[[4.55, YD + 0.28, 0.38], [2.70, 5.6, 0.38]], [[4.55, YD + 0.28, -0.38], [2.70, 5.6, -0.38]]],
    hexLev: R1, rLev: 0.14, yMesa: YD, campana: { x0: 0.55, x1: 1.85, z0: -0.70, z1: 0.70 }, escalera: kx ? BAR : null,
    letrero: texRotulo3d(perRotSandvik('#FFFFFF', '#1D4E9E', null), 256, 80) });
  perCubiertaDet(P, YD, R2, [[0.4, XO0 - 0.3, ZE, 1, 1.2], [XO1 + 0.3, L - 0.3, ZA, 1, 0.5], [XO1 + 0.3, L - 0.3, -ZA, -1, 0.5], [0.4, 2.4, ZI, -1, 0.4]],
    [[0.15, ZE - 0.15], [0.15, ZI + 0.15], [L - 0.15, ZA - 0.15], [L - 0.15, -ZA + 0.15]]);
  /* tanque de agua para la inyeccion (600 gal) bajo la cubierta, entre el frente y las orugas */
  P.bloque(null, 0.9, 0.55, 1.2, 'pintura', R2, 2.45, YD - 0.98, 0, 0.06);
  [-0.62, 0.62].forEach(function(z){ P.perfil(null, [[2.0, YD], [3.1, YD], [2.85, YD + 0.85], [2.45, YD + 0.85]], 0.10, z, 'pintura', R2, 0.02); });

  /* ═══ colector de polvo en la esquina derecha ═══ */
  var XP = kx ? 1.35 : 1.05, ZP = kx ? -2.55 : -1.50, rP = kx ? 0.70 : 0.50, yP0 = kx ? 2.6 : YD + 0.1, yP1 = kx ? 4.6 : YD + 1.9;
  P.cilindro('CPV', rP, rP, yP1 - yP0, 'pintura', R1, XP, (yP0 + yP1) / 2, ZP, null, 28);
  P.cilindro('CPV', rP, 0.16, kx ? 1.35 : 0.7, 'pintura', R1, XP, yP0 - (kx ? 0.675 : 0.35), ZP, null, 28);
  P.cilindro(null, rP + 0.05, rP + 0.05, 0.10, 'pintura', R2, XP, yP1 + 0.05, ZP, null, 28);
  P.bloque(null, rP * 1.2, 0.40, rP * 1.2, 'pintura', R1, XP, yP1 + 0.30, ZP, 0.05);
  P.cilindro(null, 0.12, 0.12, 0.35, 'metal', PER_GRIS, XP + rP * 0.4, yP1 + 0.68, ZP, null, 14);
  if(kx){
    /* patas del colector colgado fuera de la cubierta */
    [[-0.5, -0.4], [0.5, -0.4], [0, 0.6]].forEach(function(q){
      P.tubo(null, [XP + q[0], 2.6, ZP + q[1] * 0.8], [XP + q[0] * 0.6, YD - 0.1, ZI + 0.15], 0.06, 'pintura', R2, 10);
    });
    P.manguera('CPV', [[XP, yP1 + 0.4, ZP + 0.3], [XP - 0.6, yP1 + 0.6, ZP + 1.2], [0.9, YD + 0.8, -0.9], [1.0, YD - 0.6, -0.6]], 0.17, '#B0B4B8');
  } else {
    P.manguera('CPV', [[XP, YD - 0.70, ZP], [XP + 0.1, 0.85, ZP + 0.5], [1.20, 0.80, -0.65]], 0.14, '#202326');
  }
  P.barra([XP, YD - 0.2, ZP + rP], [1.2, YD - 0.3, -0.7], 0.012, '#9AA0A6', 'metal');

  /* ═══ enfriador plano al centro (ventiladores que soplan arriba) ═══ */
  var EX0 = 4.30, EX1 = 7.25, EZ0 = -1.0, EZ1 = 1.30, EY = YD + 1.35;
  P.bloque(null, EX1 - EX0, EY - YD, EZ1 - EZ0, 'pintura', R1, (EX0 + EX1) / 2, (YD + EY) / 2, (EZ0 + EZ1) / 2, 0.06);
  P.plano('RAD1', perTexMalla('#121315', '#8C939A', 9, 2.6), 1.30, EZ1 - EZ0 - 0.25, 1.30 / 0.30, (EZ1 - EZ0 - 0.25) / 0.30,
    EX0 + 0.80, EY + 0.006, (EZ0 + EZ1) / 2, [-Math.PI / 2, 0, 0]);
  P.plano('CHD1', perTexMalla('#121315', '#8C939A', 9, 2.6), 1.20, EZ1 - EZ0 - 0.25, 1.20 / 0.30, (EZ1 - EZ0 - 0.25) / 0.30,
    EX1 - 0.75, EY + 0.006, (EZ0 + EZ1) / 2, [-Math.PI / 2, 0, 0]);
  [EX0 + 0.80, EX1 - 0.75].forEach(function(x){
    P.pon(x < 6 ? 'FAN1' : 'PMT1', new THREE.TorusGeometry(0.50, 0.04, 8, 30), 'metal', '#2A2D31', x, EY + 0.04, (EZ0 + EZ1) / 2, [Math.PI / 2, 0, 0]);
    P.cilindro(null, 0.12, 0.12, 0.18, 'metal', '#3A3F45', x, EY + 0.10, (EZ0 + EZ1) / 2, null, 14);
  });
  P.rejilla(null, 1.6, 0.9, (EX0 + EX1) / 2, YD + 0.6, EZ1, '+z', R2);

  /* ═══ tanque hidraulico con los rotulos ═══ */
  P.bloque('TQH1', 1.80, 1.05, 0.70, 'pintura', R1, 5.30, YD + 0.525, -1.55, 0.05);
  P.cilindro(null, 0.06, 0.06, 0.03, 'vidrio', '#9BB7C9', 4.70, YD + 0.62, -1.91, [Math.PI / 2, 0, 0], 16);
  P.letrero(texRotulo3d(perRotSandvik('#FFFFFF', '#1D4E9E', null), 384, 96), 0.62, 0.16, 5.0, YD + 0.82, -1.907, Math.PI);
  var texMod = texRotulo3d(rotuloTexto(kx ? 'D75KX' : 'D75KS', R1, '#16181B', 0.95), 384, 110);
  P.letrero(texMod, 0.95, 0.28, 5.55, YD + 0.45, -1.907, Math.PI);
  P.letrero(texMod, 0.95, 0.28, 5.0, YD + 0.45, EZ1 + 0.03, 0);

  /* ═══ motor, compresor y tanque recibidor ═══ */
  var MX = kx ? 8.6 : 8.1, MZ = 0.15;
  P.bloque('ENG1', 1.90, 0.85, 0.90, 'metal', '#3E4349', MX, YD + 0.62, MZ, 0.06);
  P.bloque('ENG1', 1.80, 0.20, 0.72, 'metal', '#2E3237', MX, YD + 0.13, MZ, 0.04);
  [-1, 1].forEach(function(s){
    var ta = P.bloque('ENG1', 1.70, 0.18, 0.34, 'pintura', R1, MX, YD + 1.14, MZ + s * 0.25, 0.05);
    ta.rotation.x = s * 0.45;
  });
  P.pon(null, new THREE.TorusGeometry(0.17, 0.08, 10, 20), 'metal', '#6B7178', MX + 0.9, YD + 1.25, MZ, [0, Math.PI / 2, 0]);
  P.cilindro(null, 0.17, 0.17, 1.0, 'metal', '#8A8F95', MX + 0.75, YD + 2.2, MZ + 0.45, null, 18);
  P.tubo(null, [MX + 0.75, YD + 1.2, MZ + 0.45], [MX + 0.75, YD + 3.30, MZ + 0.45], 0.075, 'metal', '#6E747B', 12);
  P.bloque('PTB1', 0.40, 0.78, 0.85, 'metal', PER_GRIS, MX - 1.15, YD + 0.50, MZ, 0.05);
  [[0.52, 0.24], [0.52, -0.24], [0.24, 0.0]].forEach(function(q, k){
    P.cilindro(k === 2 ? 'PMT1' : 'PYM', 0.11, 0.11, 0.42, 'metal', '#2E3237', MX - 1.55, YD + q[0], MZ + q[1], [0, 0, Math.PI / 2], 14);
  });
  P.cilindro('AR1', 0.09, 0.09, 0.36, 'metal', '#2E3237', MX + 0.3, YD + 0.35, MZ - 0.55, [0, 0, Math.PI / 2], 12);
  P.cilindro('CMP', 0.50, 0.50, 1.0, 'pintura', R1, MX + 1.55, YD + 0.75, MZ, [0, 0, Math.PI / 2], 26);
  P.bloque('CMP', 0.42, 0.42, 0.42, 'pintura', R1, MX + 1.55, YD + 1.38, MZ, 0.05);
  /* tanque recibidor rojo acostado (se ve en la foto del lado derecho) */
  P.cilindro('CMP', 0.42, 0.42, 1.70, 'pintura', R1, MX + 0.3, YD + 0.62, -1.42, [0, 0, Math.PI / 2], 26);
  [MX - 0.55, MX + 1.15].forEach(function(x){ P.pon('CMP', new THREE.SphereGeometry(0.42, 22, 12), 'pintura', R1, x, YD + 0.62, -1.42).scale.set(0.35, 1, 1); });
  P.cilindro(null, 0.05, 0.05, 0.25, 'cromo', null, MX + 0.6, YD + 1.12, -1.42, null, 10);
  /* filtros de aire */
  [-0.9, 0.9].forEach(function(z){
    P.cilindro(null, 0.27, 0.27, 0.95, 'pintura', R1, MX + 2.45, YD + 0.62, z, null, 22);
    P.cilindro(null, 0.29, 0.29, 0.10, 'pintura', R2, MX + 2.45, YD + 1.15, z, null, 22);
    P.manguera(null, [[MX + 2.45, YD + 0.9, z], [MX + 2.0, YD + 1.4, z * 0.4], [MX + 1.55, YD + 1.55, MZ]], 0.09, '#2A2D31');
  });
  P.cilindro('SEN', 0.24, 0.24, 0.70, 'pintura', '#B9302A', 4.0, YD + 0.35, 1.55, null, 20);
  P.cilindro('GP1', 0.08, 0.08, 0.30, 'metal', PER_GRIS2, 4.0, YD + 0.85, 1.55, null, 12);
  P.bloque('BAT', 0.60, 0.42, 0.42, 'mate', PER_NEGRO, 7.6, YD + 0.21, 1.55, 0.03);
  [-0.25, 0.05].forEach(function(dz){ P.cilindro('SCI', 0.10, 0.10, 0.62, 'pintura', '#C62A1E', 7.0, YD + 0.31, 1.62 + dz, null, 16); });
  P.bloque('TQC1', 1.40, 0.55, 1.10, 'pintura', R2, L - 1.6, YD - 0.62, 0, 0.05);
  P.tubo('HAR', [3.0, YD + 0.05, 0.80], [MX, YD + 0.05, 0.80], 0.025, 'goma', '#22262B', 8);
  P.manguera('LPA', [[MX + 1.6, YD + 1.1, -0.4], [6.5, YD + 0.15, -0.9], [3.6, YD + 0.15, -0.9], [2.85, YD + 0.6, -0.30]], 0.085, '#202326');
  P.manguera('LPH', [[MX - 1.6, YD + 0.5, 0.3], [4.0, YD + 0.12, 0.62], [2.9, YD + 0.4, 0.45]], 0.045);
  P.manguera('LPH', [[MX - 1.6, YD + 0.3, -0.2], [4.0, YD + 0.10, 0.48], [2.9, YD + 0.3, 0.30]], 0.040);

  /* ═══ atras: apoyo del mastil y, en la KX, el genset ═══ */
  var XR = L - 0.30;
  [-0.95, 0.95].forEach(function(z){ P.bloque(null, 0.18, 4.05 - YD, 0.18, 'pintura', R1, XR, (YD + 4.05) / 2, z, 0.03); });
  P.barra([XR, YD + 0.2, -0.95], [XR, 3.9, 0.95], 0.05, R1);
  P.barra([XR, YD + 0.2, 0.95], [XR, 3.9, -0.95], 0.05, R1);
  P.bloque(null, 0.40, 0.20, 2.30, 'pintura', R1, XR, 4.10, 0, 0.04);
  [-0.55, 0.55].forEach(function(z){ P.bloque(null, 0.40, 0.35, 0.10, 'pintura', R1, XR, 4.35, z, 0.02); });
  if(kx){
    var GX0 = L, GX1 = L + 1.65;
    P.bloque(null, GX1 - GX0, 0.30, 2.6, 'pintura', R2, (GX0 + GX1) / 2, YD - 0.15, 0, 0.04);
    P.bloque('ENG2', GX1 - GX0 - 0.1, 1.55, 2.4, 'pintura', R1, (GX0 + GX1) / 2, YD + 0.78, 0, 0.06);
    P.plano('RAD2', perTexMalla('#121315', '#8C939A', 9, 2.6), GX1 - GX0 - 0.3, 2.1, 4, 6, (GX0 + GX1) / 2, YD + 1.565, 0, [-Math.PI / 2, 0, 0]);
    P.rejilla(null, 2.0, 1.1, GX1 - 0.05, YD + 0.78, 0, '+x', R2);
    P.cilindro(null, 0.08, 0.08, 0.8, 'metal', '#6E747B', GX0 + 0.4, YD + 1.95, 0.9, null, 10);
  }

  /* ═══ gatas: dos adelante y una atras ═══ */
  P.gata(null, 2.95, 1.60, YD + 0.45, R1);
  P.gata(null, 2.95, -1.60, YD + 0.45, R1);
  P.gata('PG3', L - 0.9, 0, YD + 0.45, R1);

  /* ═══ barandas, escaleras y faros ═══ */
  P.baranda([[0.10, CZ1 - 0.6], [0.10, ZE - 0.05], [3.0, ZE - 0.05]], YD, 1.05, BAR, R2);
  P.baranda([[XC - 0.05, ZE - 0.05], [XC - 0.05, ZA + 0.04]], YD, 1.05, BAR, R2);
  P.baranda([[XC + 0.05, ZA - 0.05], [L - 0.05, ZA - 0.05], [L - 0.05, 1.2]], YD, 1.05, BAR, R2);
  P.baranda([[L - 0.05, -1.2], [L - 0.05, -ZA + 0.05], [XC + 0.4, -ZA + 0.05]], YD, 1.05, BAR, R2);
  P.baranda([[XC - 0.05, -ZA + 0.05], [XC - 0.05, ZI + 0.05], [2.0, ZI + 0.05]], YD, 1.05, BAR, R2);
  P.escaleraV(3.3, ZE + 0.06, 0.40, YD, 0.50, 'x', BAR);
  P.escaleraV(XC + 0.15, -ZA - 0.06, 0.40, YD, 0.50, 'x', BAR);
  P.faroT('LSM', 0.02, YD - 0.12, 2.6, '-x');
  P.faroT('LSM', 0.02, YD - 0.12, -1.6, '-x');
  P.faroT('LSM', XR + 0.12, 3.9, 0, '+x');

  P.vaciar();
  H.position.set(-(L + (kx ? 1.65 : 0)) / 2, 0, -(ZE + (kx ? -3.26 : ZI)) / 2);
  G.userData.ruedas = [];
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = MAST * 0.42;
  G.userData.dist = MAST * 2.9;
  return G;
}

/* ═══════════════ SANDVIK DR412i y DR460 ═══════════════
   v: 'DR412I' (colores de fabrica), 'DR412ISM' (San Martin), 'DR460' (San Martin) */
function perConstruirDR(piezas, v){
  var G = new THREE.Group(), H = new THREE.Group(); G.add(H);
  var P = perKit(H, piezas);
  var sm = v !== 'DR412I', d460 = v === 'DR460';
  var C1 = sm ? '#A9180D' : '#35383C', C2 = sm ? '#6E1008' : '#24272A', MAS = sm ? '#3B281D' : '#D2460E',
      CAB = sm ? '#121A30' : '#E4E4E0', CABM = sm ? '#121A30' : '#1E2125', BAR = sm ? '#A9180D' : '#E8AE10', AMA = '#EAB000';
  /* medidas: DR412i de la hoja; DR460 de la foto de la EP-39 */
  var YD = d460 ? 1.38 : 1.60, L = d460 ? 13.1 : 13.3, XF = d460 ? 0.0 : 0.4;
  var XC = d460 ? 4.5 : 4.6, ZE = d460 ? 3.3 : 3.9, ZI = d460 ? -2.1 : -2.36, ZA = d460 ? 1.95 : 2.37;
  var ZT = (d460 ? 3.0 : 3.67) / 2, XO0 = d460 ? 3.45 : 3.96, XO1 = d460 ? 8.81 : 10.414, AO = d460 ? 1.10 : 1.15;
  var MAST = d460 ? 19.0 : 19.2;

  /* ═══ tren (S46HD en la DR412i, Cat 345 en la DR460) ═══ */
  P.oruga({ code: 'CLH', mando: 'MLH', x0: XO0, x1: XO1, zc: ZT, ancho: 0.90, alto: AO, lado: 1, hexB: '#2E3236', paso: 0.26 });
  P.oruga({ code: 'CRH', mando: 'MRH', x0: XO0, x1: XO1, zc: -ZT, ancho: 0.90, alto: AO, lado: -1, hexB: '#2E3236', paso: 0.26 });
  [XO0 + 0.9, XO1 - 1.0].forEach(function(x, k){
    P.bloque(null, 0.55, 0.30, 2 * ZT - 0.3, 'pintura', C2, x, 0.58, 0, 0.04);
    P.bloque(k ? 'PYB' : null, 0.65, YD - 0.24 - 0.55, 1.5, 'pintura', C2, x, (YD - 0.24 + 0.55) / 2, 0, 0.05);
  });
  [-0.75, 0.75].forEach(function(z){ P.bloque(null, L - XF - 0.6, 0.50, 0.34, 'pintura', C2, (L + XF) / 2, YD - 0.50, z, 0.04); });

  /* ═══ cubiertas ═══ */
  P.piso(XF, XC, ZI, ZE, YD, 0.26, C1);
  P.piso(XC, L, -ZA, ZA, YD, 0.26, C1);
  if(!d460) P.piso(XC, 8.7, ZA, ZA + 0.75, YD, 0.20, C1);
  P.bloque(null, 1.50, YD - 0.26 - 0.62, 0.80, 'pintura', C1, 2.2, (YD - 0.26 + 0.62) / 2, -1.30, 0.05);
  P.bloque(null, 1.50, YD - 0.26 - 0.62, 0.55, 'pintura', C1, 2.2, (YD - 0.26 + 0.62) / 2, 1.10, 0.05);
  /* franjas reflectivas amarillas en los cantos (las Sandvik de San Martin) */
  if(sm){
    var franja = function(x0, x1, z, n){
      for(var f = 0; f < n; f++){
        var x = x0 + (f + 0.5) * (x1 - x0) / n;
        P.caja(x, YD - 0.13, z, 0.42, 0.07, 0.012, 0, AMA, 'mate');
      }
    };
    franja(XF + 0.1, XC, ZE + 0.006, 5); franja(XC, L - 0.1, ZA + 0.006, 11); franja(XC, L - 0.1, -ZA - 0.006, 11);
    franja(XF + 0.1, XC, ZI - 0.006, 5);
  }

  /* ═══ cabina en la esquina izquierda ═══ */
  var CX0 = d460 ? 0.55 : 0.55, CX1 = d460 ? 2.60 : 2.90, CZ0 = d460 ? 1.0 : 0.72, CZ1 = d460 ? 3.0 : 3.0, CY1 = d460 ? 3.42 : 4.25;
  perCabina(P, { x0: CX0, x1: CX1, z0: CZ0, z1: CZ1, y0: YD, y1: CY1, hex: CAB, marco: CABM, techo: sm ? C1 : '#F4F4F1',
    fv: sm ? 0.30 : 0.36, posteMedio: 0.55, puerta: [0.58, 0.95], asidero: BAR, hexAAC: sm ? '#3C434B' : '#D8D9D5' });
  if(sm){
    /* franja amarilla bajo el techo, como la EP-39 */
    P.caja((CX0 + CX1) / 2, CY1 - 0.20, CZ1 + 0.008, CX1 - CX0, 0.05, 0.012, 0, AMA, 'mate');
    P.caja(CX0 - 0.008, CY1 - 0.20, (CZ0 + CZ1) / 2, 0.012, 0.05, CZ1 - CZ0, 0, AMA, 'mate');
  }
  var texSdk = texRotulo3d(perRotSandvik(CAB, sm ? '#FFFFFF' : '#16181B', null), 384, 96);
  P.letrero(texSdk, 0.80, 0.20, CX0 + 0.55, YD + 0.62, CZ1 + 0.012, 0);
  P.letrero(texSdk, 0.80, 0.20, CX0 - 0.012, YD + 0.62, (CZ0 + CZ1) / 2, -Math.PI / 2);
  var texNom = texRotulo3d(rotuloTexto(d460 ? 'DR460' : 'DR412i', CAB, sm ? '#FFFFFF' : '#16181B', 0.95), 384, 110);
  P.letrero(texNom, 0.85, 0.25, CX0 + 0.55, YD + 0.32, CZ1 + 0.012, 0);
  if(sm) P.letrero(texRotulo3d(perRotSM('#E8ECEF'), 256, 96), 0.55, 0.21, CX0 + 1.35, YD + 0.32, CZ1 + 0.012, 0);

  /* ═══ mastil ═══ */
  var MXa = d460 ? 3.0 : 2.65, MXb = d460 ? 4.1 : 3.95, MZa = d460 ? -0.55 : -0.75, MZb = d460 ? 0.55 : 0.62;
  perTorre(P, { xa: MXa, xb: MXb, za: MZa, zb: MZb, y0: YD + 0.05, y1: MAST - 0.25, hex: MAS, cuerda: 0.16, paso: 1.12,
    xe: MXa - 0.38, ze: (MZa + MZb) / 2, yRot: 8.4, hexRot: sm ? '#3A3F45' : MAS, rTubo: 0.12,
    carr: { x: (MXa + MXb) / 2, z: MZa - 0.50, rc: 0.26, n: 4, r: 0.12, y0: 3.2, y1: 15.6, tapa: sm ? null : '#2E3135' },
    lev: [[[MXb + 2.2, YD + 0.30, MZb - 0.25], [MXb, 6.6, MZb - 0.25]], [[MXb + 2.2, YD + 0.30, MZa + 0.25], [MXb, 6.6, MZa + 0.25]]],
    hexLev: sm ? C1 : '#3F4347', rLev: 0.16, yMesa: YD, campana: { x0: MXa - 1.0, x1: MXa + 0.25, z0: MZa - 0.15, z1: MZb + 0.05 },
    escalera: sm ? null : AMA, hexCampana: C2, tipo: sm ? 'mate' : 'pintura',
    letrero: texRotulo3d(perRotSandvik(MAS, sm ? '#FFFFFF' : '#16181B', null), 256, 80) });
  perCubiertaDet(P, YD, C2, [[XF + 0.4, XO0 - 0.3, ZE, 1, ZE - 1.0], [XO1 + 0.3, L - 0.3, ZA, 1, 0.5], [XO1 + 0.3, L - 0.3, -ZA, -1, 0.5], [XF + 0.4, XO0 - 0.6, ZI, -1, 0.5]],
    [[XF + 0.15, ZE - 0.15], [XF + 0.15, ZI + 0.15], [L - 0.15, ZA - 0.15], [L - 0.15, -ZA + 0.15]]);
  [MZa - 0.05, MZb + 0.05].forEach(function(z){ P.perfil(null, [[MXa + 0.3, YD], [MXb + 0.6, YD], [MXb + 0.2, YD + 0.95], [MXa + 0.7, YD + 0.95]], 0.12, z, 'pintura', C2, 0.02); });
  /* plataforma con baranda al pie del mastil */
  P.baranda([[MXb + 0.15, MZa - 0.1], [MXb + 0.15, MZb + 0.1]], YD + 0.95, 1.0, BAR, null);

  /* ═══ colector de polvo en la esquina derecha ═══ */
  var XP = d460 ? 1.3 : 1.5, ZP = ZI + 0.65;
  P.cilindro('CPV', 0.48, 0.48, 1.5, 'pintura', C1, XP, YD + 0.90, ZP, null, 26);
  P.cilindro('CPV', 0.48, 0.14, 0.6, 'pintura', C1, XP, YD - 0.45, ZP, null, 26);
  P.cilindro(null, 0.52, 0.52, 0.08, 'pintura', C2, XP, YD + 1.68, ZP, null, 26);
  P.bloque(null, 0.6, 0.30, 0.6, 'pintura', C1, XP, YD + 1.87, ZP, 0.04);
  P.manguera('CPV', [[XP, YD - 0.75, ZP], [XP + 0.4, 0.85, ZP + 0.5], [MXa - 0.5, 0.80, MZa]], 0.14, '#202326');

  /* ═══ cuarto de maquinas ═══ */
  var texNum = texNumero3d(null, sm ? AMA : '#16181C');
  if(d460){
    /* casa cerrada roja con puerta, ventana, rotulos y numero */
    var KX0 = 4.9, KX1 = 9.9, KY = 3.45, KZ = 1.90;
    P.bloque('ENG1', KX1 - KX0, KY - YD, 2 * KZ, 'pintura', C1, (KX0 + KX1) / 2, (YD + KY) / 2, 0, 0.06);
    P.bloque(null, KX1 - KX0 + 0.12, 0.10, 2 * KZ + 0.12, 'pintura', C2, (KX0 + KX1) / 2, KY + 0.04, 0, 0.03);
    [-1, 1].forEach(function(s){
      var z = s * (KZ + 0.006);
      P.caja((KX0 + KX1) / 2, KY - 0.10, z, KX1 - KX0, 0.05, 0.012, 0, AMA, 'mate');
      P.caja(KX0 + 0.02, (YD + KY) / 2, z, 0.05, KY - YD, 0.012, 0, AMA, 'mate');
      /* ventana y puerta */
      var vz = new THREE.Mesh(new THREE.BoxGeometry(1.20, 0.65, 0.03), P.M.vidrio('#141C26'));
      vz.position.set(6.4, YD + 1.55, s * (KZ + 0.01)); H.add(vz);
      P.caja(6.4, YD + 1.55, s * (KZ + 0.012), 1.28, 0.73, 0.01, 0, '#16181B', 'mate');
      [8.4, 9.2].forEach(function(x){ P.caja(x, YD + 0.98, s * (KZ + 0.012), 0.02, 1.85, 0.012, 0, C2, 'mate'); });
      P.bloque(null, 0.14, 0.04, 0.05, 'cromo', null, 9.05, YD + 1.0, s * (KZ + 0.03), 0.01);
      P.rejilla(s > 0 ? 'RAD1' : 'CHD1', 0.9, 1.1, 7.6, YD + 0.85, s * KZ, s > 0 ? '+z' : '-z', C2);
    });
    P.letrero(texRotulo3d(perRotSM(C1), 320, 120), 0.95, 0.36, 7.25, YD + 1.60, KZ + 0.014, 0);
    var mN = new THREE.Mesh(new THREE.PlaneGeometry(1.20, 0.38), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
    mN.position.set(6.2, YD + 0.95, KZ + 0.014); H.add(mN);
    var texV = texRotulo3d(rotuloTexto('DR460', C1, '#16181B', 0.95), 256, 80);
    var lv = P.letrero(texV, 0.75, 0.22, 7.0, YD + 0.95, KZ + 0.014, 0); lv.rotation.z = Math.PI / 2;
    P.letrero(texRotulo3d(perRotSandvik('#FFFFFF', '#1D4E9E', null), 256, 64), 0.50, 0.12, 6.2, YD + 1.30, KZ + 0.014, 0);
    /* escape y respiraderos en el techo */
    P.tubo(null, [8.8, KY, -0.6], [8.8, KY + 0.9, -0.6], 0.10, 'metal', '#6E747B', 12);
    P.bloque('CMP', 1.4, 0.35, 1.1, 'pintura', C2, 6.0, KY + 0.20, -0.6, 0.04);
    /* atras: radiador y tanques, apoyo del mastil */
    P.bloque(null, 1.0, 2.0, 3.4, 'pintura', C1, 11.9, YD + 1.0, 0, 0.06);
    P.rejilla('VAC', 2.6, 1.6, 12.4, YD + 1.0, 0, '+x', C2);
    P.bloque('TQH1', 1.2, 1.0, 0.8, 'pintura', C1, 10.6, YD + 0.5, -1.3, 0.05);
    P.bloque('TQC1', 1.4, 0.55, 1.2, 'pintura', C2, 11.5, YD - 0.62, 0, 0.05);
  } else {
    /* DR412i abierta: tanque hidraulico, caja del compresor, motor y enfriador transversal */
    P.bloque('TQH1', 2.30, 1.30, 1.20, 'pintura', C1, 6.20, YD + 0.65, 0, 0.06);
    P.cilindro(null, 0.07, 0.07, 0.03, 'vidrio', '#9BB7C9', 5.5, YD + 0.75, 0.61, [Math.PI / 2, 0, 0], 16);
    P.bloque('CMP', 2.10, 1.60, 1.30, 'pintura', C1, 8.55, YD + 0.80, -0.10, 0.06);
    P.bloque(null, 1.40, 0.60, 0.02, 'pintura', sm ? AMA : '#E8561E', 8.55, YD + 0.80, 0.56, 0.01);
    P.letrero(texRotulo3d(perRotSandvik(sm ? AMA : '#E8561E', '#16181B', null), 256, 64), 0.9, 0.22, 8.55, YD + 0.80, 0.575, 0);
    P.bloque('ENG1', 1.10, 1.10, 1.10, 'metal', '#3E4349', 10.05, YD + 0.70, -0.1, 0.06);
    [-1, 1].forEach(function(s){
      var ta = P.bloque('ENG1', 1.00, 0.18, 0.36, 'pintura', C1, 10.05, YD + 1.32, -0.1 + s * 0.28, 0.05); ta.rotation.x = s * 0.45;
      P.tubo(null, [10.3, YD + 1.2, -0.1 + s * 0.45], [10.3, YD + 3.1, -0.1 + s * 0.45], 0.09, 'metal', '#6E747B', 12);
      P.cilindro(null, 0.18, 0.18, 0.9, 'metal', '#8A8F95', 10.3, YD + 2.2, -0.1 + s * 0.45, null, 16);
      /* filtros de aire grandes a los lados */
      P.cilindro(null, 0.32, 0.32, 1.10, 'pintura', C2, 9.2, YD + 0.62, s * 1.65, null, 22);
      P.cilindro(null, 0.34, 0.34, 0.10, 'pintura', C1, 9.2, YD + 1.22, s * 1.65, null, 22);
      P.manguera(null, [[9.2, YD + 1.0, s * 1.65], [9.0, YD + 1.7, s * 1.0], [8.6, YD + 1.7, -0.1]], 0.10, '#2A2D31');
    });
    P.bloque('PTB1', 0.40, 0.80, 0.90, 'metal', PER_GRIS, 9.35, YD + 0.50, -0.1, 0.05);
    /* enfriador transversal con su bastidor */
    P.bloque(null, 1.20, 2.50, 3.70, 'pintura', C1, 11.20, YD + 1.25, -0.15, 0.06);
    P.rejilla('RAD1', 3.2, 2.1, 11.80, YD + 1.25, -0.15, '+x', C2);
    P.rejilla('CHD1', 3.2, 0.5, 10.60, YD + 2.18, -0.15, '-x', C2);
    P.bloque('TQC1', 1.5, 0.55, 1.3, 'pintura', C2, 12.2, YD - 0.65, 0, 0.05);
    /* tanque de aire del separador */
    P.cilindro('CMP', 0.42, 0.42, 1.8, 'pintura', C1, 8.2, YD + 0.55, -1.65, [0, 0, Math.PI / 2], 24);
    [7.3, 9.1].forEach(function(x){ P.pon('CMP', new THREE.SphereGeometry(0.42, 20, 12), 'pintura', C1, x, YD + 0.55, -1.65).scale.set(0.35, 1, 1); });
    /* antenas GPS con brazo */
    [[XF + 0.3, ZI + 0.3], [L - 0.3, ZA - 0.3], [L - 0.3, -ZA + 0.3]].forEach(function(q){
      P.barra([q[0], YD, q[1]], [q[0], YD + 2.6, q[1]], 0.03, '#3A3F45', 'metal');
      P.barra([q[0], YD + 2.2, q[1]], [q[0] + 0.5, YD + 2.2, q[1]], 0.025, '#3A3F45', 'metal');
      P.cilindro(null, 0.10, 0.10, 0.08, 'mate', '#E6E6E2', q[0], YD + 2.66, q[1], null, 14);
    });
    var mN2 = new THREE.Mesh(new THREE.PlaneGeometry(1.10, 0.34), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
    mN2.position.set(6.2, YD + 0.85, 0.614); H.add(mN2);
  }
  /* comun: engrase, baterias, extintores, mangueras */
  P.cilindro('SEN', 0.24, 0.24, 0.70, 'pintura', '#B9302A', XC + 0.4, YD + 0.35, ZA - 0.40, null, 20);
  P.cilindro('GP1', 0.08, 0.08, 0.30, 'metal', PER_GRIS2, XC + 0.4, YD + 0.85, ZA - 0.40, null, 12);
  P.bloque('BAT', 0.62, 0.42, 0.42, 'mate', PER_NEGRO, XC + 1.2, YD + 0.21, ZA - 0.40, 0.03);
  [-0.6, 0.6].forEach(function(z){ P.cilindro('SCI', 0.13, 0.13, 0.70, 'pintura', '#C62A1E', L - 0.35, YD + 0.35, z, null, 16); });
  P.tubo('HAR', [MXb + 0.3, YD + 0.05, 0.95], [10.0, YD + 0.05, 0.95], 0.025, 'goma', '#22262B', 8);
  P.manguera('LPA', [[8.6, YD + 1.4, -0.8], [7.0, YD + 0.18, -1.15], [MXb + 1.0, YD + 0.18, -1.0], [MXb - 0.1, YD + 0.7, MZa + 0.2]], 0.10, '#202326');
  P.manguera('LPH', [[9.3, YD + 0.5, 0.4], [6.0, YD + 0.12, 1.15], [MXb + 0.2, YD + 0.5, 0.40]], 0.05);

  /* ═══ apoyo del mastil atras (marco en X) ═══ */
  var XR = d460 ? 10.8 : L + 0.55, yR = d460 ? 3.6 : 4.1;
  [-1.05, 1.05].forEach(function(z){
    P.bloque(null, 0.20, yR - YD + 0.2, 0.20, 'pintura', d460 ? C1 : C2, XR, (YD + yR) / 2 - 0.1, z, 0.03);
    if(!d460) P.barra([L - 0.1, YD, z], [XR, yR - 0.2, z], 0.07, C2);
  });
  P.barra([XR, YD + 0.2, -1.05], [XR, yR - 0.3, 1.05], 0.06, d460 ? C1 : C2);
  P.barra([XR, YD + 0.2, 1.05], [XR, yR - 0.3, -1.05], 0.06, d460 ? C1 : C2);
  P.bloque(null, 0.45, 0.22, 2.50, 'pintura', d460 ? C1 : C2, XR, yR, 0, 0.04);
  if(!d460) P.bloque(null, 0.9, 0.22, 2.3, 'pintura', C2, L + 0.15, YD - 0.11, 0, 0.04);

  /* ═══ cuatro gatas ═══ */
  var xg0 = d460 ? 2.9 : 3.2, xg1 = d460 ? 10.1 : 12.0, zg = d460 ? 1.65 : 1.95;
  P.gata(null, xg0, zg, YD + 0.45, C2, 0.19);
  P.gata(null, xg0, -zg, YD + 0.45, C2, 0.19);
  P.gata('PG3', xg1, zg, YD + 0.45, C2, 0.19);
  P.gata(null, xg1, -zg, YD + 0.45, C2, 0.19);

  /* ═══ barandas, escaleras y faros ═══ */
  P.baranda([[XF + 0.1, CZ1 - 0.4], [XF + 0.1, ZE - 0.05], [XC - 0.05, ZE - 0.05], [XC - 0.05, ZA + (d460 ? 0.04 : 0.75)]], YD, 1.05, BAR, sm ? C2 : '#3F4347');
  if(d460){
    P.baranda([[XC + 0.05, ZA - 0.05], [4.75, ZA - 0.05]], YD, 1.05, BAR, C2);
    P.baranda([[10.0, ZA - 0.05], [L - 0.05, ZA - 0.05], [L - 0.05, -ZA + 0.05], [10.0, -ZA + 0.05]], YD, 1.05, BAR, C2);
    P.baranda([[4.75, -ZA + 0.05], [XC + 0.05, -ZA + 0.05]], YD, 1.05, BAR, C2);
    P.escaleraI([4.85, 0.30, ZE - 0.45], [3.75, YD, ZE - 0.45], 0.60, BAR);
    P.escaleraV(12.3, ZA + 0.06, 0.40, YD, 0.45, 'x', BAR);
  } else {
    P.baranda([[XC + 0.05, ZA + 0.70], [8.65, ZA + 0.70]], YD, 1.05, BAR, '#3F4347');
    P.baranda([[8.75, ZA - 0.05], [L - 0.05, ZA - 0.05], [L - 0.05, -ZA + 0.05], [XC + 0.05, -ZA + 0.05]], YD, 1.05, BAR, '#3F4347');
    P.escaleraI([10.4, 0.30, ZA + 0.38], [8.6, YD, ZA + 0.38], 0.62, BAR);
  }
  P.baranda([[XC - 0.05, -ZA + 0.05], [XC - 0.05, ZI + 0.05], [XF + 2.6, ZI + 0.05]], YD, 1.05, BAR, null);
  P.escaleraV(XF + 2.0, ZI - 0.06, 0.40, YD, 0.50, 'x', BAR);
  P.faroT('LSM', XF + 0.02, YD - 0.13, 2.8, '-x');
  P.faroT('LSM', XF + 0.02, YD - 0.13, -1.8, '-x');
  P.faroT('LSM', L + 0.02, YD + 1.15, 1.5, '+x');

  P.vaciar();
  H.position.set(-(XF + (d460 ? L : L + 0.7)) / 2, 0, -(ZE + ZI) / 2);
  G.userData.ruedas = [];
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = MAST * 0.40;
  G.userData.dist = MAST * 2.75;
  return G;
}

/* ═══════════ DTH DE PLUMA: SANDVIK LEOPARD DI650i y EVERDIGM D800 ═══════════
   el carro (x desde el frente de la cabina hacia atras), la pluma sale del
   frente derecho (-Z) y la viga de avance queda vertical delante de la cabina */
function perConstruirDTH(piezas, v){
  var G = new THREE.Group(), H = new THREE.Group(); G.add(H);
  var P = perKit(H, piezas);
  var leo = v === 'DI650I';
  var C1 = leo ? '#B82A12' : '#04676C', C2 = leo ? '#821C0B' : '#034A4E', OS = leo ? '#1E2125' : '#24272B',
      VIGA = leo ? '#B82A12' : '#2A2E33', CABT = leo ? '#E4E4E0' : '#04676C', TV = leo ? 'pintura' : 'mate';
  var LC = leo ? 7.4 : 6.7, WZ = leo ? 1.25 : 1.25, ZT = (leo ? 2.6 : 2.15) / 2, TJ = leo ? 0.40 : 0.35;
  var XO0 = leo ? 1.7 : 1.5, XO1 = leo ? 5.3 : 5.0, AO = 0.78, YC = 1.05, YT = leo ? 3.05 : 2.59;

  /* ═══ orugas oscilantes ═══ */
  P.oruga({ code: 'CLH', mando: 'MLH', x0: XO0, x1: XO1, zc: ZT, ancho: TJ, alto: AO, lado: 1, hexB: OS, paso: 0.20, garras: 1 });
  P.oruga({ code: 'CRH', mando: 'MRH', x0: XO0, x1: XO1, zc: -ZT, ancho: TJ, alto: AO, lado: -1, hexB: OS, paso: 0.20, garras: 1 });
  P.bloque('PYB', 0.5, 0.35, 2 * ZT - 0.2, 'metal', OS, (XO0 + XO1) / 2, 0.50, 0, 0.04);
  P.bloque(null, LC - 0.4, 0.40, 1.1, 'pintura', OS, LC / 2 + 0.1, YC - 0.15, 0, 0.05);
  P.bloque(null, LC - 0.3, 0.12, 2 * WZ, 'pintura', OS, LC / 2 + 0.05, YC + 0.06, 0, 0.03);

  /* ═══ cabina adelante a la izquierda ═══ */
  var CX0 = 0.25, CX1 = leo ? 2.35 : 2.15, CZ0 = leo ? 0.05 : 0.10, CZ1 = WZ, CY1 = leo ? 3.35 : 2.85;
  perCabina(P, { x0: CX0, x1: CX1, z0: CZ0, z1: CZ1, y0: YC + 0.12, y1: CY1, hex: leo ? OS : C1, marco: OS, techo: CABT,
    fv: 0.30, parabrisas: 0.25, posteMedio: 0.5, puerta: [0.52, 0.95], asidero: OS, hexAAC: leo ? '#D8D9D5' : C2 });

  /* ═══ capot del motor: lados con paneles de rejilla, techo inclinado ═══ */
  var KX0 = CX1 + 0.05, KX1 = LC, KY = YT;
  P.perfil('ENG1', [[KX0, YC + 0.12], [KX1, YC + 0.12], [KX1, KY - 0.15], [KX1 - 0.25, KY], [KX0 + 0.7, KY], [KX0, KY - 0.55]], 2 * WZ - 0.04, 0, 'pintura', C1, 0.05);
  [-1, 1].forEach(function(s){
    var z = s * WZ;
    for(var i = 0; i < 3; i++){
      var x = KX0 + 0.75 + i * (KX1 - KX0 - 1.0) / 3 + (KX1 - KX0 - 1.0) / 6;
      P.rejilla(i === 2 && s > 0 ? 'RAD1' : null, (KX1 - KX0 - 1.2) / 3, KY - YC - 0.75, x, (YC + KY) / 2, z, s > 0 ? '+z' : '-z', C2);
    }
    P.caja((KX0 + KX1) / 2, YC + 0.30, z + s * 0.01, KX1 - KX0 - 0.2, 0.06, 0.012, 0, OS, 'mate');
  });
  /* el perfil del capot sobresale 3 cm por el bisel: la rejilla va por fuera */
  P.rejilla('RAD1', 2 * WZ - 0.4, KY - YC - 0.6, KX1 + 0.035, (YC + KY) / 2, 0, '+x', OS);
  P.tubo(null, [KX1 - 1.2, KY - 0.1, -0.6], [KX1 - 1.2, KY + 0.55, -0.6], 0.08, 'metal', '#6E747B', 12);
  P.cilindro(null, 0.09, 0.09, 0.04, 'mate', PER_NEGRO, KX1 - 1.2, KY + 0.57, -0.6, [0, 0, 0.4], 12);
  P.bloque('CMP', 0.9, 0.25, 0.9, 'pintura', C2, KX0 + 1.8, KY + 0.12, 0.3, 0.04);
  if(!leo){
    /* barandas amarillas en el techo (foto del D800) */
    var BAR = '#F2C230';
    P.baranda([[KX0 + 0.9, -WZ + 0.08], [KX1 - 0.15, -WZ + 0.08], [KX1 - 0.15, WZ - 0.08], [KX0 + 0.9, WZ - 0.08]], KY, 1.0, BAR, null);
    P.escaleraV(KX1 + 0.05, WZ - 0.35, 0.35, KY, 0.40, 'z', BAR);
    P.letrero(texRotulo3d(perRotD800, 256, 300), 0.62, 0.72, KX0 + 1.2, (YC + KY) / 2 + 0.25, WZ + 0.03, 0);
    P.letrero(texRotulo3d(perRotEverdigm, 384, 64), 1.2, 0.20, KX0 + 2.6, KY - 0.35, WZ + 0.03, 0);
  } else {
    P.letrero(texRotulo3d(perRotSandvik(C1, '#FFFFFF', null), 384, 96), 1.0, 0.25, KX0 + 1.3, KY - 0.40, WZ + 0.03, 0);
    P.letrero(texRotulo3d(rotuloTexto('DI650i', C1, '#FFFFFF', 0.95), 256, 80), 0.75, 0.24, KX0 + 2.6, KY - 0.40, WZ + 0.03, 0);
  }
  var texNum = texNumero3d(null, leo ? '#FFFFFF' : '#16181C');
  var mN = new THREE.Mesh(new THREE.PlaneGeometry(0.90, 0.28), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
  mN.position.set(KX1 + 0.04, KY - 0.30, 0); mN.rotation.y = Math.PI / 2; H.add(mN);
  /* colector de polvo detras de la raiz de la pluma, a la derecha */
  P.bloque('CPV', 1.40, 1.30, 0.95, 'pintura', leo ? OS : C1, 1.30, YC + 0.77, -0.75, 0.05);
  P.cilindro('CPV', 0.28, 0.28, 0.90, 'pintura', leo ? OS : C1, 0.70, YC + 1.60, -0.95, null, 22);
  P.cilindro(null, 0.28, 0.08, 0.40, 'pintura', leo ? OS : C1, 0.70, YC + 0.95, -0.95, null, 22);
  P.lamas(null, 0.60, YC + 0.35, YC + 1.25, -1.15, -0.40, 6, PER_NEGRO, -1);
  /* gata trasera de apoyo */
  P.gata(null, LC - 0.35, 0, YC, OS, 0.12);

  /* ═══ pluma fija y viga de avance ═══ */
  var XV = -2.85, ZV = -0.35, YV0 = 0.08, YV1 = leo ? 12.1 : 10.6;
  var raiz = [0.35, YC + 0.25, -0.55], codo = [XV + 0.55, 2.35, ZV];
  P.tubo(null, raiz, codo, 0.22, TV, VIGA, 4);
  P.bloque(null, 0.6, 0.7, 0.6, TV, VIGA, 0.15, YC + 0.25, -0.55, 0.05);
  P.cilHidD('PHY', [0.20, YC - 0.05, -0.30], [XV + 1.4, 2.05, ZV - 0.05], 0.09, VIGA, 0.55);
  P.cilHidD('PHY', [0.20, YC + 0.55, -0.85], [XV + 1.2, 2.75, ZV - 0.10], 0.08, VIGA, 0.55);
  /* cuna y cilindro de inclinacion */
  P.bloque(null, 0.45, 1.2, 0.55, TV, VIGA, XV + 0.42, 2.35, ZV, 0.04);
  P.cilHidD('PHY', [XV + 0.55, 1.75, ZV + 0.35], [XV + 0.25, 3.45, ZV + 0.30], 0.07, VIGA, 0.55);
  /* la viga: perfil hueco con la cadena por delante */
  P.bloque('MAV', 0.30, YV1 - YV0, 0.36, TV, VIGA, XV, (YV0 + YV1) / 2, ZV, 0.03);
  P.bloque(null, 0.06, YV1 - YV0 - 0.6, 0.30, 'metal', '#80878E', XV - 0.18, (YV0 + YV1) / 2, ZV, 0.01);
  P.bloque('MAV', 0.04, YV1 - YV0 - 1.0, 0.07, 'metal', '#2B2E33', XV - 0.22, (YV0 + YV1) / 2, ZV, 0.01);
  P.cilindro('MAV', 0.17, 0.17, 0.20, 'metal', '#3A3F45', XV - 0.05, YV1 - 0.25, ZV, [Math.PI / 2, 0, 0], 22);
  P.bloque(null, 0.40, 0.30, 0.46, TV, VIGA, XV, YV1 + 0.10, ZV, 0.04);
  /* carrete de mangueras arriba */
  P.cilindro('LPA', 0.42, 0.42, 0.22, 'metal', '#2B2E33', XV + 0.15, YV1 + 0.48, ZV, [Math.PI / 2, 0, 0], 28);
  /* pie de la viga y succion de polvo */
  P.bloque(null, 0.55, 0.25, 0.55, 'pintura', leo ? OS : C1, XV - 0.15, 0.20, ZV, 0.04);
  P.bloque(null, 0.70, 0.40, 0.70, 'pintura', leo ? VIGA : C1, XV - 0.30, 0.55, ZV, 0.05);
  /* cabezal de rotacion a media carrera y tuberia */
  var yR = leo ? 6.5 : 5.8, XE = XV - 0.42;
  P.bloque('CRT', 0.55, 0.85, 0.50, TV, leo ? VIGA : OS, XE + 0.12, yR + 0.40, ZV, 0.05);
  P.cilindro('CRT', 0.13, 0.13, 0.40, 'metal', '#4A5058', XE + 0.15, yR + 1.0, ZV, null, 16);
  P.cilindro(null, 0.07, 0.07, yR - 0.2, 'metal', PER_ACERO, XE, yR / 2, ZV, null, 16);
  P.cilindro(null, 0.08, 0.08, 0.25, 'metal', '#5E646B', XE, 2.6, ZV, null, 16);
  /* centralizador y llave abajo */
  P.bloque(null, 0.30, 0.20, 0.50, 'metal', '#3A3F45', XE, 1.25, ZV, 0.03);
  /* cambiador de tubos de carrusel al costado de la viga */
  var CZ = ZV + 0.55, tubos = [];
  for(var t = 0; t < 8; t++){ var a = t / 8 * Math.PI * 2; tubos.push([XV - 0.15 + Math.cos(a) * 0.22, 4.0, CZ + Math.sin(a) * 0.22]); }
  P.inst(null, new THREE.CylinderGeometry(0.055, 0.055, 6.0, 12), 'metal', PER_ACERO, tubos);
  [1.05, 6.95].forEach(function(y){ P.cilindro('MCR', 0.33, 0.33, 0.07, TV, VIGA, XV - 0.15, y, CZ, null, 22); });
  P.tubo('MCR', [XV - 0.15, 0.9, CZ], [XV - 0.15, 7.2, CZ], 0.05, 'metal', '#5A6067', 10);
  [1.6, 6.4].forEach(function(y){ P.tubo('MCR', [XV - 0.15, y, CZ], [XV, y, ZV + 0.15], 0.05, TV, VIGA, 8); });
  /* manguera de succion al colector y mangueras de la pluma */
  P.manguera('CPV', [[XV - 0.30, 0.65, ZV - 0.35], [XV + 0.2, 0.40, -1.1], [-0.6, 0.9, -1.1], [0.70, YC + 0.75, -0.95]], 0.14, '#1E2124');
  P.manguera('LPA', [[XV + 0.15, YV1 + 0.3, ZV - 0.12], [XV - 0.7, YV1 - 2.5, ZV - 0.4], [XE - 0.2, yR + 1.5, ZV - 0.2], [XE + 0.15, yR + 1.2, ZV]], 0.06, '#1E2124');
  P.manguera('LPH', [[0.3, YC + 0.6, -0.4], [-1.0, 2.6, -0.5], [XV + 0.3, 2.9, ZV - 0.2]], 0.045);
  P.manguera('LPH', [[0.3, YC + 0.5, -0.25], [-1.2, 2.3, -0.2], [XV + 0.3, 2.5, ZV + 0.2]], 0.04);
  /* mangueras por el costado de la pluma con sus abrazaderas */
  [0.10, 0.22, 0.34].forEach(function(dz, k){
    P.manguera(k ? 'LPH' : 'LPA', [[0.55, YC + 0.75, -0.55 - dz], [-1.2, 2.05, ZV - 0.35 - dz], [XV + 0.6, 2.9, ZV - 0.25 - dz * 0.5], [XV + 0.1, 3.6, ZV - 0.2]], k ? 0.035 : 0.05);
  });
  [-0.6, -1.5].forEach(function(x){ P.bloque(null, 0.08, 0.12, 0.55, 'metal', '#2A2D31', x, YC + 0.25 + (0.35 - x) * 0.33, -0.95, 0.02); });
  /* guias de mangueras en la viga y placas laterales de la pluma */
  for(var gm = 0; gm < 4; gm++) P.bloque(null, 0.24, 0.06, 0.06, 'metal', '#2A2D31', XV + 0.12, 4.0 + gm * 1.9, ZV - 0.22, 0.01);
  /* martillo DTH y broca asomando bajo el centralizador */
  P.cilindro(null, 0.085, 0.085, 0.9, 'metal', '#4A5056', XE, 0.55, ZV, null, 16);
  P.cilindro(null, 0.075, 0.06, 0.12, 'metal', '#8A8F95', XE, 0.06, ZV, null, 16);
  /* peldanos de la cabina y pasamanos */
  P.escaleraV((CX0 + CX1) / 2 + 0.45, WZ + 0.08, 0.30, YC + 0.10, 0.42, 'x', OS);
  P.tubo(null, [CX1 - 0.10, YC + 0.2, WZ + 0.10], [CX1 - 0.10, CY1 - 0.5, WZ + 0.10], 0.022, 'pintura', leo ? '#E8AE10' : '#E8B820', 8);
  /* manijas de las puertas del capot y cerraduras */
  [-1, 1].forEach(function(s){
    for(var i = 0; i < 3; i++){
      var x = KX0 + 0.75 + (i + 1) * (KX1 - KX0 - 1.0) / 3 - 0.12;
      P.bloque(null, 0.05, 0.16, 0.04, 'cromo', null, x, (YC + KY) / 2, s * (WZ + 0.035), 0.01);
    }
    /* tapas de llenado (combustible a la izquierda, aceite hidraulico a la derecha) */
    P.bloque(s > 0 ? 'TQC1' : 'TQH1', 0.30, 0.22, 0.03, 'mate', PER_NEGRO, KX1 - 0.9, YC + 0.55, s * (WZ + 0.02), 0.01);
  });
  /* cilindros de oscilacion de las orugas */
  [-1, 1].forEach(function(s){ P.cilHidD('PYB', [XO0 + 0.9, 0.95, s * 0.55], [XO0 + 0.9, 0.62, s * (ZT - 0.10)], 0.06, OS, 0.5); });
  /* faros de trabajo */
  P.faroT('LSM', XV + 0.2, YV1 - 0.6, ZV + 0.25, '-x');
  P.faroT('LSM', -0.05, CY1 - 0.15, 0.5, '-x');
  P.faroT('LSM', KX1 - 0.4, KY + 0.12, WZ - 0.25, '+x');
  P.faroT('LSM', KX1 - 0.4, KY + 0.12, -WZ + 0.25, '+x');
  P.faroT('LSM', KX0 + 0.8, KY + 0.12, -WZ + 0.25, '-x');
  P.baliza('CIR', KX0 + 1.4, KY, WZ - 0.3);
  P.cilindro('SCI', 0.09, 0.09, 0.55, 'pintura', '#C62A1E', KX1 - 0.2, YC + 0.40, -WZ + 0.2, null, 14);
  P.bloque('SEN', 0.30, 0.45, 0.30, 'mate', PER_GRIS, KX1 - 0.8, YC - 0.05, -WZ + 0.25, 0.03);
  P.vaciar();
  H.position.set(-(XV + LC) / 2, 0, 0);
  G.userData.ruedas = [];
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = YV1 * 0.42;
  G.userData.dist = YV1 * 2.9;
  return G;
}

/* ═══ registro ═══ */
registrarModelo3d({
  nombre: 'Perforadoras rotativas y DTH (DML HP, D75KS/KX, DR412i, DR460, DI650i, D800)',
  clave: function(e){
    var m = mod3d(e), al = /-AL$/i.test(String(e.id || ''));
    if(/^DMLHP|^DML$/.test(m)) return 'perDMLHP';
    if(/^D75KS/.test(m)) return 'perD75KS';
    if(/^D75KX/.test(m)) return 'perD75KX';
    if(/^DR412I/.test(m)) return al ? 'perDR412I' : 'perDR412ISM';
    if(/^DR460/.test(m)) return 'perDR460';
    if(/^DI650I/.test(m)) return 'perDI650I';
    if(/^D800$/.test(m) && /EVERDIGM|HYUNDAI/i.test(String(e.marca || ''))) return 'perD800';
    return null;
  },
  construir: function(e, piezas, clave){
    var k = clave.replace(/^per/, '');
    if(k === 'DMLHP') return perConstruirDML(piezas);
    if(k === 'D75KS' || k === 'D75KX') return perConstruirD75(piezas, k === 'D75KX');
    if(k === 'DR412I' || k === 'DR412ISM' || k === 'DR460') return perConstruirDR(piezas, k);
    return perConstruirDTH(piezas, k);
  }
});
