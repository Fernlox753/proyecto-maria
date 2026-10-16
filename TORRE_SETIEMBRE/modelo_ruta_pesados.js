/* ══════════════════════════════════════════════════════════════════
   CAMIONES DE RUTA PESADOS — volquete y tractos de la flota propia, y la
   cama baja que arrastran

     Mercedes-Benz Actros 4144K 8x4 .. V-226, V-231, V-236, V-243, V-269, V-282
                                       CAMION VOLQUETE (ATOC)
     Mercedes-Benz Actros 2640S 6x4 .. R-42 (ATOC), R-41 (TRMA)   CAMION REMOLQUE
     Mack Pinnacle CXU613 6x4 ........ R-43 (ATOC)                CAMION REMOLQUE
     Fameca STANDARD ................. S-31 (ATOC)                SEMITRAYLER

   Medidas (m):
   · Actros 4144K 8x4 (generacion MP3, motor OM 501 LA Euro III, caja G 240-16
     Telligent EPS; Revista Constructivo n.109, ficha «Mercedes Benz Actros
     4144K 8X4»). Avisos de usados del mismo modelo (truckscout24, mascus):
     batalla 4.10 (primer eje a primer eje motriz), largo 8.62-8.78, alto
     3.20, caja de 5.80 x 2.30, llantas 13 R 22.5. Separacion de los ejes
     delanteros 1.70 y bogie 1.35 (los tipicos de Mercedes 8x4, supuestos).
     Voladizo delantero 1.44 y trocha 2.034 / 1.804 de la ficha del Actros
     3344K de Mercedes-Benz Peru (misma cabina y ejes). Cabina corta (S) de
     techo plano, 2.30 de ancho, como en las fotos de 4144 volquete.
   · Actros 2640S 6x4 tracto: batalla 3.30 + 1.35 (avisos de Actros 2641-2645
     6x4 dan 3.40-3.45; se usa la de 3.30 de los tractos «/33»), llantas
     315/80 R22.5 y tanque de 480 L (aviso del 2642). Cabina mediana (M) de
     techo plano: supuesto (no hay foto de R-41 ni R-42).
   · Mack Pinnacle CXU613 (eje adelantado, «Axle Forward»): avisos de
     truckpaper/equipmentexperts de tractos de cabina corta: batalla 170"
     (4.32) al centro del tandem, cabina a eje trasero 102" (2.59), tandem
     52" (1.32), 11R22.5. De ahi: espalda de cabina a 1.73 del eje delantero.
     Parachoques a eje delantero 0.95 (supuesto: el eje adelantado queda
     bajo los faros). Techo a 3.00, cabina de 2.05 de ancho (supuestos sobre
     las fotos). Cabina corta sin dormitorio: supuesto.
   · Fameca «STANDARD»: Fameca (Fabricaciones Metalicas Carranza, Trujillo y
     Lima, fameca.com.pe) no publica un modelo con ese nombre. Se dibuja su
     «Cama baja 3 ejes - 50 TM» de la pagina de productos, porque S-31 es un
     semirremolque de los equipos auxiliares de ATOC que jalan los tractos
     R-41..R-43 (mover maquinaria): plataforma corrida blanca de plancha
     estriada, cuello fijo, tres ejes atras, rampas rojas abatibles con
     bisagras amarillas, cinta reflectiva. Largo 13.6, ancho 2.60, piso a
     1.25, cuello a 1.62, 11R22.5 (supuestos: no hay hoja con medidas).

   Colores: los Actros y el Mack van blancos (supuesto, no hay foto de las
   unidades de San Martin; es el color de fabrica mas comun en el Peru), la
   tolva del volquete azul con «San Martín» en blanco como los volquetes
   Scania de la empresa (supuesto). La cama baja con los colores de la foto
   de Fameca.

   Ejes: frente hacia -X, arriba +Y, izquierda del operador +Z (volante a la
   izquierda). Llantas SAP: 1-2 delanteras (izq, der); en el 8x4 3-4 el
   segundo eje delantero; luego cada eje trasero de izquierda a derecha:
   exterior, interior, interior, exterior. En la cama baja las doce llantas
   de sus tres ejes con el mismo orden.
   ══════════════════════════════════════════════════════════════════ */
var RPZ_NEGRO = '#17191C', RPZ_GRIS = '#3B4047', RPZ_GRIS2 = '#5E656D', RPZ_ALU = '#C9CED3', RPZ_CHASIS = '#1C1E21',
    RPZ_BLANCO = '#E9EBE8', RPZ_PLAST = '#232629', RPZ_VIDRIO = '#22303C', RPZ_GRAFITO = '#4A4F56',
    RPZ_AZUL = '#1F45B2', RPZ_AZUL2 = '#173894';

/* ═══ utilidades ═══ */

/* letras sobre lienzo; esp reparte las letras a lo ancho */
function rpzTexLetras(txt, fondo, tinta, esp, w, h, fuente){
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
/* «San Martín» con las olas del logo, en blanco sobre transparente */
function rpzTexSanMartin(tinta){
  return texRotulo3d(function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.strokeStyle = tinta; g.lineWidth = h * 0.035;
    for(var i = 0; i < 4; i++){
      g.beginPath();
      g.moveTo(w * 0.02, h * (0.30 + i * 0.12));
      g.bezierCurveTo(w * 0.10, h * (0.10 + i * 0.12), w * 0.18, h * (0.50 + i * 0.12), w * 0.26, h * (0.28 + i * 0.12));
      g.stroke();
    }
    g.fillStyle = tinta; g.textBaseline = 'middle'; g.textAlign = 'left';
    g.font = 'italic bold ' + Math.round(h * 0.42) + 'px Georgia, "Times New Roman", serif';
    g.fillText('San Martín', w * 0.30, h * 0.48, w * 0.68);
    g.font = 'bold ' + Math.round(h * 0.11) + 'px Arial, sans-serif';
    g.fillText('CONTRATISTAS GENERALES', w * 0.31, h * 0.80, w * 0.66);
  }, 512, 200);
}
/* plancha estriada (pisos, peldanos, plataformas) */
function rpzTexEstriada(base){
  var t = texRotulo3d(function(g, w, h){
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for(var y = 0; y < h; y += 16) for(var x = (y / 16 % 2) * 8; x < w; x += 16){
      g.save(); g.translate(x + 4, y + 8); g.rotate(y / 16 % 2 ? 0.8 : -0.8);
      g.fillStyle = 'rgba(255,255,255,0.55)'; g.fillRect(-5, -1.6, 10, 3.2);
      g.fillStyle = 'rgba(0,0,0,0.30)'; g.fillRect(-5, 1.6, 10, 1.2);
      g.restore();
    }
  }, 128, 128);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
/* chapa perforada del escudo del escape */
function rpzTexPerforado(){
  var t = texRotulo3d(function(g, w, h){
    g.fillStyle = '#C8CDD2'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2A2E33';
    for(var y = 6; y < h; y += 14) for(var x = (y / 14 % 2) * 7 + 6; x < w; x += 14){ g.beginPath(); g.arc(x, y, 3.6, 0, Math.PI * 2); g.fill(); }
  }, 128, 128);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 6);
  return t;
}
/* malla de alambre de la parrilla: transparente entre alambres */
function rpzTexMalla(paso){
  return texRotulo3d(function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.strokeStyle = '#FFFFFF'; g.lineWidth = 5;
    for(var i = -h; i < w + h; i += paso){
      g.beginPath(); g.moveTo(i, 0); g.lineTo(i + h, h); g.stroke();
      g.beginPath(); g.moveTo(i, h); g.lineTo(i + h, 0); g.stroke();
    }
  }, 256, 256);
}
/* placa con letras y borde (CARGA ANCHA, PELIGRO) */
function rpzTexLetrero(txt, fondo, tinta, borde){
  return texRotulo3d(function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    g.strokeStyle = borde; g.lineWidth = 10; g.strokeRect(5, 5, w - 10, h - 10);
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.56) + 'px "Arial Black", Arial, sans-serif'; g.fillText(txt, w / 2, h * 0.54, w * 0.9);
  }, 512, 110);
}

/* plano con textura; ry: 0 mira a +Z, PI a -Z, -PI/2 a -X, PI/2 a +X */
function rpzPlano(G, tex, w, h, x, y, z, ry, transp){
  var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ map: tex, transparent: !!transp, alphaTest: transp ? 0.04 : 0, roughness: 0.45, metalness: 0.05 }));
  m.position.set(x, y, z); m.rotation.y = ry;
  G.add(m);
  return m;
}
/* luz que brilla un poco */
function rpzLuz(D, code, w, h, d, hex, x, y, z, k){
  var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), emissive: new THREE.Color(hex), emissiveIntensity: k || 0.45, roughness: 0.2 }));
  m.position.set(x, y, z);
  return D.reg(code, m, hex);
}
/* muchas piezas iguales en una sola malla: lista de [x,y,z, rx,ry,rz] */
function rpzInst(D, code, geo, tipo, hex, lista){
  var im = new THREE.InstancedMesh(geo, D.M[tipo](hex), lista.length), o = new THREE.Object3D();
  lista.forEach(function(q, i){
    o.position.set(q[0], q[1], q[2]); o.rotation.set(q[3] || 0, q[4] || 0, q[5] || 0); o.updateMatrix();
    im.setMatrixAt(i, o.matrix);
  });
  im.instanceMatrix.needsUpdate = true;
  return D.reg(code, im, hex);
}
/* pieza con textura propia */
function rpzConTex(D, code, geo, tex, hex, rug, met, x, y, z, rot, transp){
  var mat = new THREE.MeshStandardMaterial({ map: tex, color: new THREE.Color(hex), roughness: rug, metalness: met });
  if(transp){ mat.transparent = true; mat.alphaTest = 0.3; mat.side = THREE.DoubleSide; }
  mat.envMapIntensity = 0.9;
  var m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  if(rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
  return D.reg(code, m, hex);
}
/* hojas de muelle apiladas; curv > 0 sube las puntas, < 0 las baja (camelback) */
function rpzMuelle(D, code, xc, yTop, largo, n, z, ancho, curv, hex){
  for(var k = 0; k < n; k++){
    var L = largo * (1 - k * 0.15), e = 0.024, y0 = yTop - k * e, pts = [], i, x, N = 8;
    for(i = 0; i <= N; i++){ x = -L / 2 + L * i / N; pts.push([xc + x, y0 + curv * Math.pow(2 * x / largo, 2)]); }
    for(i = N; i >= 0; i--){ x = -L / 2 + L * i / N; pts.push([xc + x, y0 - e + 0.002 + curv * Math.pow(2 * x / largo, 2)]); }
    D.perfil(code, pts, ancho, z, 'metal', hex || '#2E3238', 0.004);
  }
}
/* separa una poligonal de su centro (marcos de vidrios) */
function rpzEnsanchar(pts, d){
  var cx = 0, cy = 0;
  pts.forEach(function(p){ cx += p[0]; cy += p[1]; });
  cx /= pts.length; cy /= pts.length;
  return pts.map(function(p){
    var dx = p[0] - cx, dy = p[1] - cy, l = Math.hypot(dx, dy) || 1;
    return [p[0] + dx / l * d, p[1] + dy / l * d];
  });
}
/* puntos de un arco (x,y) */
function rpzArco(cx, cy, r, a0, a1, n){
  var p = [];
  for(var i = 0; i <= n; i++){ var a = a0 + (a1 - a0) * i / n; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return p;
}
/* arco de guardafango (cuarto o medio) sobre una rueda, abierto, en su eje */
function rpzArcoRueda(D, x, yc, z, r, ancho, a0, a1, tipo, hex){
  var g = new THREE.CylinderGeometry(r, r, ancho, 28, 1, true, a0, a1 - a0);
  var m = D.pon(null, g, tipo, hex, x, yc, z, [Math.PI / 2, 0, 0]);
  m.material.side = THREE.DoubleSide;
  return m;
}

/* ═══ llanta de camion de ruta: carcasa, banda con tacos, aro de disco con
   agujeros de mano, diez tuercas y masa. Mismo contrato que ruedaDet: grupo
   que gira; la carcasa lleva el codigo SAP y los tacos comparten su material ═══ */
function rpzRueda(D, G, piezas, code, x, z, afuera, o){
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
  /* tacos: traccion en chevron cerrado (bloques de obra en el volquete); direccion en canales rectos */
  var paso = o.trac ? (o.obra ? 0.14 : 0.105) : 0.085;
  var n = Math.round(2 * Math.PI * R / paso), hT = o.obra ? 0.022 : 0.016;
  var gT = new THREE.BoxGeometry(2 * Math.PI * R / n * (o.trac ? 0.52 : 0.60), hT, A * (o.trac ? 0.44 : 0.27));
  var filas = o.trac ? [-1, 1] : [-1.5, -0.5, 0.5, 1.5];
  var inst = new THREE.InstancedMesh(gT, goma, n * filas.length), d = new THREE.Object3D(), k = 0;
  for(var i = 0; i < n; i++){
    filas.forEach(function(s){
      var a = (i + (o.trac && s > 0 ? 0.5 : 0)) / n * Math.PI * 2, rr = R * 0.976 + hT / 2 - 0.003;
      d.position.set(Math.cos(a) * rr, Math.sin(a) * rr, s * A * (o.trac ? 0.24 : 0.205));
      d.rotation.set(0, 0, a - Math.PI / 2);
      if(o.trac) d.rotateY(s * (o.obra ? 0.25 : 0.38));
      d.updateMatrix();
      inst.setMatrixAt(k++, d.matrix);
    });
  }
  gr.add(inst);
  /* aro: barril y pestanas; del lado de afuera el disco con agujeros de mano */
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
    var ih = new THREE.InstancedMesh(new THREE.CylinderGeometry(rA * 0.13, rA * 0.13, 0.024, 14), D.M.mate('#0E0F11'), 10);
    hoyos.forEach(function(q, b){ d.position.set(q[0], q[1], dz + afuera * 0.002); d.rotation.set(Math.PI / 2, 0, 0); d.updateMatrix(); ih.setMatrixAt(b, d.matrix); });
    gr.add(ih);
    var inn = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.017, 0.017, 0.05, 6), D.M.cromo(), 10);
    tuercas.forEach(function(q, b){ d.position.set(q[0], q[1], dz + afuera * 0.025); d.rotation.set(Math.PI / 2, 0, 0); d.updateMatrix(); inn.setMatrixAt(b, d.matrix); });
    gr.add(inn);
    var masa = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.125, 0.07, 28), D.M.metal('#5C6268'));
    masa.rotation.x = Math.PI / 2; masa.position.z = dz + afuera * 0.035; gr.add(masa);
    /* tapa: domo en direccion, brida del palier en traccion */
    var tapa = o.trac ? new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, 0.05, 20), D.M.metal('#4A5056'))
                      : new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.10, 0.11, 24), D.M.cromo());
    tapa.rotation.x = Math.PI / 2; tapa.position.z = dz + afuera * (o.trac ? 0.09 : 0.12);
    if(afuera < 0) tapa.rotation.x = -Math.PI / 2;
    gr.add(tapa);
  }
  gr.traverse(function(m){ if(m.isMesh){ m.castShadow = true; m.receiveShadow = true; } });
  return gr;
}

/* quinta rueda: plato con garganta en V, soportes basculantes y placa de montaje */
function rpzQuinta(D, xq, YF, zR, col){
  var yq = YF + 0.20;
  [-1, 1].forEach(function(s){ D.bloque(null, 1.30, 0.12, 0.14, 'pintura', col, xq, YF + 0.06, s * zR, 0.02); });
  [-1, 1].forEach(function(s){
    D.perfil(null, [[xq - 0.25, YF + 0.10], [xq + 0.25, YF + 0.10], [xq + 0.12, yq - 0.02], [xq - 0.12, yq - 0.02]], 0.10, s * 0.58, 'pintura', col, 0.01);
    D.cilindro(null, 0.05, 0.05, 0.16, 'metal', '#5A6067', xq, yq - 0.05, s * 0.58, [Math.PI / 2, 0, 0], 12);
  });
  var qr = new THREE.Shape();
  qr.absarc(0, 0, 0.46, 0.22, Math.PI * 2 - 0.22, false);
  qr.lineTo(0.06, -0.035); qr.lineTo(0.06, 0.035); qr.closePath();
  var gq = new THREE.ExtrudeGeometry(qr, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2 });
  gq.rotateX(-Math.PI / 2);
  /* la garganta abre hacia atras (+X) para recibir el perno rey */
  D.pon(null, gq, 'pintura', '#2B2F34', xq, yq + 0.02, 0);
  /* grasa sobre el plato, mordaza y manija de apertura */
  D.pon(null, new THREE.CylinderGeometry(0.40, 0.40, 0.005, 36), 'mate', '#3A3020', xq - 0.05, yq + 0.10, 0);
  D.bloque(null, 0.10, 0.05, 0.20, 'metal', '#C9A13A', xq + 0.05, yq + 0.06, 0, 0.01);
  D.tubo(null, [xq, yq - 0.02, -0.30], [xq - 0.10, yq - 0.02, -0.62], 0.016, 'metal', '#B8BEC4', 8);
  D.bloque(null, 0.06, 0.08, 0.04, 'pintura', '#C3161B', xq - 0.10, yq - 0.02, -0.64, 0.01);
  return yq + 0.08;
}
/* espirales de aire (rojo y amarillo) y el cable electrico, colgados de un soporte */
function rpzEspirales(D, x, yAlto, yBajo, colores, zs){
  colores.forEach(function(c, k){
    var pts = [], z = zs[k];
    for(var i = 0; i <= 60; i++){
      var u = i / 60, ang = u * Math.PI * 14;
      pts.push(new THREE.Vector3(x + Math.cos(ang) * 0.06 + u * 0.25, yAlto - u * (yAlto - yBajo) + Math.sin(ang) * 0.06, z));
    }
    var g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.012, 6, false);
    D.pon(k < 2 ? 'LPA' : 'HAR', g, 'goma', c);
  });
}

/* ════════════════════════════════════════════════════════════════
   MERCEDES-BENZ ACTROS (MP3): cabina avanzada, bastidor y cuerpo
   ════════════════════════════════════════════════════════════════ */
function rpzMedidasMB(tipo){
  var V = tipo === 'V4144';
  var L = { tipo: tipo };
  /* llantas: 13 R 22.5 en el volquete, 315/80 R22.5 en el tracto */
  L.R = V ? 0.562 : 0.536; L.A = V ? 0.33 : 0.315; L.rAro = 0.286;
  L.ejes = V ? [0, 1.70, 4.10, 5.45] : [0, 3.30, 4.65];
  L.nDel = V ? 2 : 1;
  L.YF = V ? 1.20 : 1.10;           /* alto del bastidor */
  L.zR = 0.43;                      /* media trocha de los largueros (alma afuera) */
  L.W = 2.30;
  L.Lc = V ? 1.70 : 2.00;           /* cabina corta S / mediana M */
  L.Y0 = V ? 1.30 : 1.22;           /* bajo de la cabina detras del frente */
  L.H = 1.85;                       /* techo plano */
  L.rake = 0.17; L.wsb = 0.85; L.wst = 1.67;
  L.xc0 = -1.38; L.xB = -1.44;      /* frente de cabina, frente del parachoques (voladizo 1.44) */
  L.xCB = L.xc0 + L.Lc;
  L.zD = 1.017;                     /* trocha delantera 2.034 */
  var sep = L.A + 0.04, tr = 0.902; /* trocha trasera 1.804 entre centros de duales */
  L.zO = tr + sep / 2; L.zI = tr - sep / 2;
  var ult = L.ejes[L.ejes.length - 1];
  L.xFin = ult + (V ? 1.00 : 0.75);
  return L;
}

/* estrella de Mercedes: aro y tres brazos cromados, mirando a -X */
function rpzEstrella(D, x, y, z, r){
  D.pon(null, new THREE.TorusGeometry(r, r * 0.075, 10, 48), 'cromo', null, x, y, z, [0, Math.PI / 2, 0]);
  D.cilindro(null, r * 0.94, r * 0.94, 0.02, 'mate', '#15171A', x + 0.02, y, z, [0, 0, Math.PI / 2], 40);
  [90, 210, 330].forEach(function(gr){
    var a = gr * Math.PI / 180, w = r * 0.15, c = Math.cos(a), s = Math.sin(a);
    D.perfilX(null, [[z + r * 0.93 * c, y + r * 0.93 * s], [z - w * s, y + w * c], [z - w * 0.4 * c, y - w * 0.4 * s], [z + w * s, y - w * c]],
      0.03, x - 0.01, 'cromo', null, 0.004);
  });
}

/* ═══ bastidor, ejes, suspension, motor y tren de fuerza ═══ */
function rpzChasisMB(C){
  var D = C.D, L = C.L, bl = D.bloque, tubo = D.tubo, cil = D.cilindro;
  var YF = L.YF, zR = L.zR, R = L.R, col = RPZ_CHASIS, E = L.ejes;
  var xF0 = L.xc0 + 0.10, xF1 = L.xFin, lar = xF1 - xF0, xm = (xF0 + xF1) / 2;
  /* largueros en C: alma afuera, alas hacia adentro */
  [-1, 1].forEach(function(s){
    bl('42023615', lar, 0.30, 0.022, 'pintura', col, xm, YF - 0.15, s * (zR + 0.035), 0.008);
    [YF - 0.011, YF - 0.289].forEach(function(y){ bl('42023615', lar, 0.022, 0.09, 'pintura', col, xm, y, s * zR, 0.006); });
  });
  /* travesanos y los pernos de sus cartelas en el alma */
  var tr = [], pernos = [];
  for(var xt = xF0 + 0.25; xt < xF1 - 0.3; xt += 1.05) tr.push([xt, YF - 0.15, 0]);
  tr.push([xF1 - 0.06, YF - 0.15, 0]);
  rpzInst(D, '42023615', new THREE.BoxGeometry(0.10, 0.24, zR * 2 + 0.04), 'pintura', col, tr);
  tr.forEach(function(q){
    [-1, 1].forEach(function(s){ [-0.06, 0.06].forEach(function(dy){ pernos.push([q[0], YF - 0.15 + dy, s * (zR + 0.05), 0, 0, Math.PI / 2]); }); });
  });
  rpzInst(D, null, new THREE.CylinderGeometry(0.016, 0.016, 0.03, 6).rotateX(Math.PI / 2).rotateZ(-Math.PI / 2), 'metal', '#6E747A', pernos);

  /* ═══ ejes delanteros: viga en I, munones, muelles parabolicos, amortiguadores y tambores ═══ */
  for(var i = 0; i < L.nDel; i++){
    (function(xe, i){
      bl(null, 0.12, 0.15, L.zD * 2 - 0.62, 'pintura', col, xe, R - 0.06, 0, 0.03);
      [-1, 1].forEach(function(s){
        bl(null, 0.12, 0.15, 0.30, 'pintura', col, xe, R - 0.02, s * (L.zD - 0.40), 0.03, [s * 0.35, 0, 0]);
        cil(null, 0.07, 0.07, 0.30, 'metal', RPZ_GRIS, xe, R, s * (L.zD - 0.30), null, 16);
        cil(i === 0 ? (s > 0 ? 'BMLH' : 'BMRH') : null, L.rAro * 0.80, L.rAro * 0.80, 0.22, 'metal', RPZ_GRIS, xe, R, s * (L.zD - 0.17), [Math.PI / 2, 0, 0], 28);
        rpzMuelle(D, '42020008', xe, R + 0.20, 1.55, 3, s * zR, 0.09, 0.08, '#2C3035');
        [-0.78, 0.78].forEach(function(dx){
          bl(null, 0.08, YF - 0.30 - (R + 0.18), 0.07, 'pintura', col, xe + dx, (YF - 0.30 + R + 0.18) / 2, s * zR, 0.01);
          cil(null, 0.035, 0.035, 0.11, 'metal', RPZ_GRIS, xe + dx, R + 0.24, s * zR, [Math.PI / 2, 0, 0], 10);
        });
        /* grapas en U */
        [-0.06, 0.06].forEach(function(dx){ tubo(null, [xe + dx, R - 0.04, s * (zR + 0.05)], [xe + dx, R + 0.24, s * (zR + 0.05)], 0.011, 'metal', RPZ_GRIS, 6); });
        D.cilHidD(s > 0 ? 'SDI' : 'SDD', [xe + 0.22, R + 0.06, s * (zR + 0.12)], [xe + 0.36, YF - 0.10, s * (zR + 0.10)], 0.035, '#2E3236', 0.55);
      });
      tubo(null, [xe + 0.22, R - 0.02, -(L.zD - 0.36)], [xe + 0.22, R - 0.02, L.zD - 0.36], 0.025, 'metal', RPZ_GRIS, 10);
    })(E[i], i);
  }
  /* caja de direccion adelante a la izquierda y la barra de mando */
  bl('CDR', 0.26, 0.24, 0.20, 'metal', RPZ_GRIS, E[0] - 0.62, YF - 0.20, zR + 0.16, 0.03);
  cil(null, 0.04, 0.04, 0.16, 'metal', '#2E3236', E[0] - 0.62, YF - 0.38, zR + 0.16, null, 10);
  tubo(null, [E[0] - 0.62, YF - 0.42, zR + 0.18], [E[0] - 0.08, R + 0.10, L.zD - 0.36], 0.03, 'metal', RPZ_GRIS, 10);
  if(L.nDel === 2){
    tubo(null, [E[0] - 0.02, R + 0.14, zR + 0.20], [E[1] - 0.10, R + 0.12, zR + 0.20], 0.03, 'metal', RPZ_GRIS, 10);
    /* cilindro de asistencia del segundo eje */
    D.cilHidD(null, [E[1] - 0.55, YF - 0.30, zR + 0.12], [E[1] - 0.08, R + 0.10, zR + 0.30], 0.035, '#2E3236', 0.5);
  }

  /* ═══ motor OM 501 LA (V6), radiador, caja G 240 y cardanes bajo la cabina ═══ */
  var xm0 = L.xc0 + 0.30, xm1 = L.xc0 + 1.55;
  bl('RAD1', 0.12, 0.85, 1.00, 'metal', RPZ_GRIS, xm0 - 0.10, YF + 0.05, 0, 0.02);
  bl('AFT1', 0.06, 0.70, 0.95, 'metal', '#5C636B', xm0 - 0.19, YF + 0.05, 0, 0.01);
  D.pon('FAN1', new THREE.TorusGeometry(0.34, 0.04, 8, 30), 'mate', '#1E2023', xm0 + 0.02, YF + 0.05, 0, [0, Math.PI / 2, 0]);
  bl('ENG1', xm1 - xm0, 0.62, 0.66, 'metal', RPZ_GRIS, (xm0 + xm1) / 2, YF - 0.05, 0, 0.05);
  /* las dos bancadas de la V con sus tapas de valvulas */
  [-1, 1].forEach(function(s){
    var b = bl('ENG1', xm1 - xm0 - 0.12, 0.18, 0.26, 'metal', RPZ_GRIS2, (xm0 + xm1) / 2, YF + 0.32, s * 0.18, 0.04);
    b.rotation.x = -s * 0.35;
  });
  bl('ENG1', xm1 - xm0 - 0.20, 0.24, 0.50, 'metal', '#2E3236', (xm0 + xm1) / 2, YF - 0.45, 0, 0.04);
  cil('42001655', 0.09, 0.09, 0.22, 'metal', RPZ_GRIS2, xm0 + 0.12, YF + 0.05, -0.38, [0, 0, Math.PI / 2], 16);
  cil('AR1', 0.07, 0.07, 0.30, 'metal', '#2E3236', xm1 - 0.15, YF - 0.30, -0.36, [0, 0, Math.PI / 2], 14);
  D.pon(null, new THREE.TorusGeometry(0.11, 0.06, 10, 18), 'metal', '#6B7178', xm1 - 0.30, YF + 0.30, -0.42, [0, Math.PI / 2, 0]);
  cil('CMP', 0.08, 0.08, 0.24, 'metal', RPZ_GRIS2, xm0 + 0.50, YF - 0.08, 0.40, [0, 0, Math.PI / 2], 14);
  cil('SPM', 0.07, 0.07, 0.18, 'metal', '#7D848B', xm0 + 0.30, YF + 0.10, 0.40, [0, 0, Math.PI / 2], 14);
  cil('42064643', 0.08, 0.08, 0.20, 'metal', RPZ_GRIS, xm1 + 0.05, YF + 0.02, -0.30, [0, 0, Math.PI / 2], 14);
  var xg1 = xm1 + 0.85;
  cil('TRM', 0.27, 0.22, xg1 - xm1, 'metal', RPZ_GRIS, (xm1 + xg1) / 2, YF - 0.12, 0, [0, 0, Math.PI / 2], 24);
  for(var a = 0; a < 3; a++) cil(null, 0.235 - a * 0.012, 0.235 - a * 0.012, 0.03, 'metal', RPZ_GRIS2, xm1 + 0.20 + a * 0.22, YF - 0.12, 0, [0, 0, Math.PI / 2], 24);
  var xT1 = E[L.nDel], xT2 = E[L.nDel + 1];
  tubo(null, [xg1, YF - 0.15, 0], [xT1 - 0.30, R + 0.05, 0], 0.055, 'metal', '#9AA1A8', 14);
  tubo(null, [xT1 + 0.25, R + 0.12, 0], [xT2 - 0.30, R + 0.05, 0], 0.05, 'metal', '#9AA1A8', 14);
  [[xg1, YF - 0.15], [xT1 - 0.30, R + 0.05]].forEach(function(p){ cil(null, 0.075, 0.075, 0.08, 'metal', '#3A3F45', p[0], p[1], 0, [0, 0, Math.PI / 2], 12); });
  if(L.nDel === 2) bl(null, 0.10, 0.20, 0.30, 'pintura', col, (xg1 + xT1) / 2, YF - 0.30, 0, 0.02);

  /* ═══ bogie trasero: puentes con reduccion en las masas, muelles de bogie ═══ */
  var xb = (xT1 + xT2) / 2;
  [[xT1, 'DIFD'], [xT2, 'DIFP']].forEach(function(q){
    var x = q[0];
    tubo(null, [x, R, -(L.zI - L.A / 2 - 0.05)], [x, R, L.zI - L.A / 2 - 0.05], 0.10, 'pintura', col, 18);
    D.pon(q[1], new THREE.SphereGeometry(0.27, 24, 16), 'pintura', col, x, R, 0.06);
    cil(q[1], 0.15, 0.20, 0.30, 'pintura', col, x - 0.28, R + 0.03, 0.06, [0, 0, Math.PI / 2], 18);
    [-1, 1].forEach(function(s){
      cil(s > 0 ? 'BPLH' : 'BPRH', L.rAro * 0.80, L.rAro * 0.80, 0.24, 'metal', RPZ_GRIS, x, R, s * (L.zI - L.A / 2 - 0.10), [Math.PI / 2, 0, 0], 28);
      cil('42066068', 0.10, 0.10, 0.20, 'metal', '#2C3035', x + 0.24, R + 0.06, s * (L.zI - L.A / 2 - 0.30), [Math.PI / 2, 0, 0], 16);
      tubo('21003297', [x + 0.24, R + 0.10, s * (L.zI - L.A / 2 - 0.40)], [x + 0.10, YF - 0.30, s * zR], 0.012, 'goma', '#1A1C1F', 6);
    });
    /* barras de reaccion en V arriba de cada puente */
    tubo(null, [x, R + 0.24, 0.06], [x + (x < xb ? 0.55 : -0.55), YF - 0.25, zR - 0.05], 0.035, 'metal', RPZ_GRIS, 10);
    tubo(null, [x, R + 0.24, 0.06], [x + (x < xb ? 0.55 : -0.55), YF - 0.25, -zR + 0.05], 0.035, 'metal', RPZ_GRIS, 10);
  });
  [-1, 1].forEach(function(s){
    var zm = s * (zR + 0.08);
    bl(s < 0 ? 'SPD' : null, 0.42, YF - 0.30 - (R + 0.30), 0.10, 'pintura', col, xb, (YF - 0.30 + R + 0.30) / 2, s * (zR + 0.04), 0.02);
    cil(null, 0.10, 0.10, 0.22, 'metal', RPZ_GRIS, xb, R + 0.30, zm, [Math.PI / 2, 0, 0], 18);
    rpzMuelle(D, s > 0 ? '42041233' : 'SPD', xb, R + 0.28, xT2 - xT1 + 0.25, 6, zm, 0.10, -0.10, '#2C3035');
    bl(null, 0.16, 0.16, 0.14, 'metal', RPZ_GRIS, xb, R + 0.22, zm, 0.02);
  });

  /* ═══ caños de aire y el arnes a lo largo del bastidor ═══ */
  [-1, 1].forEach(function(s){
    tubo('LPA', [xF0 + 0.3, YF - 0.06, s * (zR - 0.08)], [xF1 - 0.3, YF - 0.06, s * (zR - 0.08)], 0.012, 'goma', '#2A2D31', 6);
  });
  tubo('HAR', [xF0 + 0.3, YF - 0.22, zR - 0.06], [xF1 - 0.2, YF - 0.22, zR - 0.06], 0.018, 'goma', '#1B1D20', 6);
}

/* lo que cuelga afuera de los largueros: tanque de combustible a la derecha
   (como en las fotos del 4144), baterias y tanques de aire a la izquierda */
function rpzEquipMB(C, op){
  var D = C.D, L = C.L, bl = D.bloque, cil = D.cilindro, YF = L.YF, zR = L.zR, E = L.ejes;
  var xa = E[L.nDel - 1] + L.R + 0.18, xz = E[L.nDel] - L.R - 0.18;
  var lt = Math.min(op.lTanque, xz - xa - 0.05), xt = op.xTanque || (xz - lt / 2 - 0.05), zt = -(zR + 0.10 + 0.32);
  /* tanque de aluminio con zunchos, tapa y el escalon encima */
  bl('TQC1', lt, 0.62, 0.64, 'metal', '#C6CBD0', xt, YF - 0.40, zt, 0.12);
  [-0.30, 0.30].forEach(function(d){ bl(null, 0.05, 0.66, 0.68, 'mate', RPZ_NEGRO, xt + d * lt / 1.2, YF - 0.40, zt, 0.01); });
  cil(null, 0.07, 0.07, 0.06, 'mate', RPZ_NEGRO, xt - lt * 0.30, YF - 0.06, zt - 0.08, null, 16);
  bl('42076084', 0.10, 0.08, 0.08, 'metal', '#8A6A2A', xt + lt / 2 - 0.10, YF - 0.72, zt + 0.22, 0.015);
  /* a la izquierda: baterias con tapa, tanques de aire y el engrase centralizado */
  var xbat = op.xBat || xa + 0.40;
  bl('BAT', 0.62, 0.48, 0.52, 'mate', RPZ_PLAST, xbat, YF - 0.34, zR + 0.36, 0.04);
  bl(null, 0.64, 0.04, 0.54, 'mate', '#2E3236', xbat, YF - 0.08, zR + 0.36, 0.01);
  [-0.2, 0.2].forEach(function(d){ bl(null, 0.08, 0.05, 0.05, 'mate', '#C9A13A', xbat + d, YF - 0.20, zR + 0.63, 0.01); });
  var xaire = xbat + 0.78;
  if(xaire + 0.35 < xz) [0, 1].forEach(function(k){ cil('LPA', 0.12, 0.12, 0.70, 'pintura', '#2B2F34', xaire, YF - 0.28 - k * 0.27, zR + 0.18, [0, 0, Math.PI / 2], 18); });
  var xse = op.xSen || xz - 0.25;
  bl('SEN', 0.22, 0.26, 0.20, 'mate', '#2C3035', xse, YF - 0.25, -(zR + 0.15), 0.02);
  cil('SEN', 0.08, 0.08, 0.22, 'vidrio', '#D8C892', xse, YF - 0.0, -(zR + 0.15), null, 16);
  bl('EC', 0.24, 0.18, 0.08, 'mate', '#2A2D31', L.xCB + 0.25, YF - 0.12, zR + 0.10, 0.02);
  bl('SENS', 0.06, 0.06, 0.06, 'mate', RPZ_GRIS2, E[L.nDel] - 0.22, L.R + 0.25, zR - 0.02, 0.01);
}

/* ═══ cabina Actros MP3: casco, parabrisas, puertas, espejos, escalones ═══ */
function rpzCabinaMB(C){
  var D = C.D, L = C.L, bl = D.bloque, tubo = D.tubo, G = C.G;
  var X0 = L.xc0, Y0 = L.Y0, H = L.H, W = L.W, Lc = L.Lc, rk = L.rake, wsb = Y0 + L.wsb, wst = Y0 + L.wst;
  var col = C.colCab, techo = Y0 + H, SZ = W / 2, yb0 = Y0 - 0.25;
  /* casco: perfil de costado extruido a lo ancho; adelante baja hasta el parachoques */
  D.perfil('CBN', [[X0 + 0.02, yb0], [X0, wsb], [X0 + rk, wst], [X0 + rk + 0.08, techo - 0.04], [X0 + rk + 0.22, techo],
    [X0 + Lc, techo], [X0 + Lc, Y0], [X0 + 0.72, Y0], [X0 + 0.56, yb0]], W, 0, 'pintura', col, 0.07);
  /* parabrisas con su marco negro */
  var dy = wst - wsb, Ls = Math.hypot(rk, dy), a = Math.atan2(rk, dy), nx = -Math.cos(a), ny = Math.sin(a);
  var cx = X0 + rk / 2 - 0.005, cy = (wsb + wst) / 2;
  bl(null, 0.02, Ls + 0.08, W - 0.12, 'mate', '#0F1012', cx + nx * 0.040, cy + ny * 0.040, 0, 0.008, [0, 0, -a]);
  bl(null, 0.02, Ls - 0.04, W - 0.26, 'vidrio', RPZ_VIDRIO, cx + nx * 0.054, cy + ny * 0.054, 0, 0.006, [0, 0, -a]);
  /* limpiaparabrisas en paralelo */
  [-0.70, 0.10].forEach(function(z){
    tubo(null, [X0 - 0.09, wsb + 0.07, z], [X0 - 0.09 + rk * 0.38, wsb + 0.07 + dy * 0.38, z + 0.56], 0.010, 'mate', '#0E0F11', 6);
    bl(null, 0.03, 0.04, 0.06, 'mate', '#0E0F11', X0 - 0.07, wsb + 0.05, z, 0.01);
  });
  /* visera sobre el parabrisas (la de los volquetes de las fotos, negra) */
  if(C.visera){
    var v = bl('CBN', 0.36, 0.05, W - 0.10, 'mate', RPZ_PLAST, X0 + rk - 0.10, techo - 0.02, 0, 0.02);
    v.rotation.z = 0.16;
  }
  /* luces de galibo sobre el parabrisas y baliza */
  [-1, 1].forEach(function(s){ rpzLuz(D, 'LSM', 0.10, 0.07, 0.12, '#F0A41C', X0 + rk + 0.20, techo + 0.035, s * (SZ - 0.18), 0.4); });
  var bal = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.10, 0.17, 20),
    new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.5,
      roughness: 0.15, transparent: true, opacity: 0.9, clearcoat: 1 }));
  bal.position.set(X0 + rk + 0.45, techo + 0.15, 0); D.reg('CIR', bal, '#F0A41C');
  D.cilindro('CIR', 0.11, 0.12, 0.06, 'mate', RPZ_NEGRO, X0 + rk + 0.45, techo + 0.035, 0, null, 20);
  /* escotilla del techo */
  bl(null, 0.62, 0.05, 0.62, 'mate', '#2A2D31', X0 + Lc * 0.60, techo + 0.025, 0, 0.02);
  /* ventanas de las puertas: la de MP3 baja recta y tiene ventanilla
     triangular adelante; marcos de goma, costuras, manijas y asideros */
  var xp1 = X0 + 1.18;
  var vent = [[X0 + 0.20, wsb - 0.06], [xp1 - 0.06, wsb - 0.06], [xp1 - 0.06, wst - 0.05], [X0 + 0.18 + rk * 0.95, wst - 0.05], [X0 + 0.16 + rk * 0.20, wsb + 0.12]];
  [-1, 1].forEach(function(s){
    var zs = s * SZ;
    D.perfil(null, rpzEnsanchar(vent, 0.05), 0.012, s * (SZ + 0.002), 'mate', '#0F1012', 0.004);
    D.perfil(null, vent, 0.012, s * (SZ + 0.010), 'vidrio', RPZ_VIDRIO, 0.004);
    /* poste de la ventanilla */
    bl(null, 0.04, wst - wsb - 0.12, 0.014, 'mate', '#0F1012', X0 + 0.42, (wsb + wst) / 2, s * (SZ + 0.014), 0.004);
    /* juntas de la puerta */
    bl(null, 0.014, wst - yb0 - 0.05, 0.008, 'mate', '#0E0F11', X0 + 0.10, (yb0 + wst) / 2, s * (SZ + 0.002), 0.002);
    bl(null, 0.014, wst - Y0 + 0.02, 0.008, 'mate', '#0E0F11', xp1 + 0.02, (Y0 + wst) / 2, s * (SZ + 0.002), 0.002);
    bl(null, xp1 - X0 - 0.10, 0.012, 0.008, 'mate', '#0E0F11', (X0 + 0.12 + xp1) / 2, Y0 + 0.04, s * (SZ + 0.002), 0.002);
    /* manija y bisagras */
    bl(null, 0.22, 0.05, 0.03, 'mate', RPZ_NEGRO, xp1 - 0.20, wsb - 0.16, s * (SZ + 0.014), 0.012);
    [Y0 + 0.30, wsb - 0.10].forEach(function(y){ bl(null, 0.05, 0.10, 0.03, 'mate', RPZ_NEGRO, X0 + 0.13, y, s * (SZ + 0.012), 0.008); });
    /* asidero vertical detras de la puerta */
    tubo(null, [xp1 + 0.10, Y0 - 0.12, s * (SZ + 0.05)], [xp1 + 0.10, wsb - 0.05, s * (SZ + 0.05)], 0.018, 'mate', RPZ_NEGRO, 8);
    [Y0 - 0.10, wsb - 0.07].forEach(function(y){ tubo(null, [xp1 + 0.10, y, zs], [xp1 + 0.10, y, s * (SZ + 0.05)], 0.014, 'mate', RPZ_NEGRO, 6); });
    /* numero de la unidad y el modelo en la puerta */
    if(C.texNumPuerta) rpzPlano(G, C.texNumPuerta, 0.62, 0.19, X0 + 0.68, Y0 + 0.36, s * (SZ + 0.006), s > 0 ? 0 : Math.PI, true);
    rpzPlano(G, C.texModelo, 0.30, 0.07, X0 + 0.92, Y0 + 0.12, s * (SZ + 0.006), s > 0 ? 0 : Math.PI, true);
    /* espejos: brazo desde el pilar A, retrovisor principal y gran angular abajo */
    var zE = s * (SZ + 0.30);
    tubo(null, [X0 + 0.12, wst - 0.06, s * (SZ - 0.02)], [X0 - 0.02, wst - 0.02, zE], 0.022, 'mate', RPZ_NEGRO, 8);
    tubo(null, [X0 + 0.12, wsb + 0.10, s * (SZ - 0.02)], [X0 - 0.02, wsb + 0.10, zE], 0.020, 'mate', RPZ_NEGRO, 8);
    bl(null, 0.12, 0.44, 0.24, 'mate', RPZ_NEGRO, X0 - 0.04, wst - 0.30, zE, 0.04);
    bl(null, 0.012, 0.40, 0.20, 'cromo', null, X0 + 0.025, wst - 0.30, zE, 0.004);
    bl(null, 0.11, 0.22, 0.22, 'mate', RPZ_NEGRO, X0 - 0.04, wsb + 0.22, zE, 0.04);
    bl(null, 0.012, 0.18, 0.18, 'cromo', null, X0 + 0.02, wsb + 0.22, zE, 0.004);
    /* luz de giro lateral */
    rpzLuz(D, 'LSM', 0.10, 0.04, 0.02, '#F2A31A', X0 + 0.30, yb0 + 0.10, s * (SZ + 0.006), 0.4);
    /* escalones bajo la puerta, en su hueco negro, delante de la rueda */
    var xs0 = X0 + 0.14, xs1 = L.ejes[0] - L.R - 0.10, xsm = (xs0 + xs1) / 2, ws = xs1 - xs0;
    bl(null, ws, yb0 - 0.40, 0.32, 'mate', RPZ_PLAST, xsm, (yb0 + 0.40) / 2, s * (SZ - 0.24), 0.03);
    var nEsc = 2;
    for(var k = 0; k < nEsc; k++){
      var ye = 0.48 + k * (yb0 - 0.48) / nEsc;
      bl(null, ws - 0.04, 0.04, 0.30, 'metal', '#8B9198', xsm, ye, s * (SZ - 0.19), 0.008);
      bl(null, ws - 0.02, 0.10, 0.02, 'mate', RPZ_PLAST, xsm, ye - 0.04, s * (SZ - 0.04), 0.006);
    }
  });
  /* espejo de rampa sobre el parabrisas, del lado derecho */
  tubo(null, [X0 + rk + 0.12, techo - 0.02, -SZ + 0.25], [X0 - 0.08, techo - 0.10, -SZ + 0.30], 0.018, 'mate', RPZ_NEGRO, 8);
  bl(null, 0.20, 0.20, 0.24, 'mate', RPZ_NEGRO, X0 - 0.10, techo - 0.22, -SZ + 0.30, 0.04, [0, 0, 0.5]);
  /* espalda de la cabina: ventanita y el arnes */
  bl(null, 0.02, 0.40, 0.80, 'mate', '#0F1012', X0 + Lc + 0.044, wsb + 0.25, 0.25, 0.01);
  bl(null, 0.02, 0.32, 0.72, 'vidrio', RPZ_VIDRIO, X0 + Lc + 0.050, wsb + 0.25, 0.25, 0.01);
  tubo('HAR', [X0 + Lc + 0.05, Y0 + 0.20, -0.30], [X0 + Lc + 0.10, L.YF, -0.30], 0.02, 'goma', '#1B1D20', 6);
  /* guardafangos delanteros: arcos negros sobre cada rueda y faldon */
  for(var i = 0; i < L.nDel; i++){
    [-1, 1].forEach(function(s){
      var arco = new THREE.Shape(), r1 = L.R + 0.10, r0 = L.R + 0.05;
      arco.absarc(0, 0, r1, 0.15, Math.PI - 0.15, false);
      arco.absarc(0, 0, r0, Math.PI - 0.15, 0.15, true);
      var gA = new THREE.ExtrudeGeometry(arco, { depth: L.A + 0.12, bevelEnabled: false, curveSegments: 18 });
      gA.translate(0, 0, -(L.A + 0.12) / 2);
      D.pon(null, gA, 'mate', RPZ_PLAST, L.ejes[i], L.R, s * L.zD);
      bl(null, 0.02, 0.48, L.A + 0.10, 'goma', '#141618', L.ejes[i] + L.R + 0.12, 0.40, s * L.zD, 0.01);
    });
  }
  /* detras de la cabina: toma de aire alta a la derecha (caja negra con
     rejilla, como en las fotos) y, en el volquete, el escape vertical a la
     izquierda con su codo; en el tracto el silenciador va bajo el bastidor */
  var xe = X0 + Lc + 0.17;
  bl(null, 0.24, techo - wsb + 0.20, 0.34, 'mate', RPZ_PLAST, xe, (wsb + techo + 0.20) / 2 - 0.10, -SZ + 0.24, 0.05);
  for(var la = 0; la < 6; la++) bl(null, 0.02, 0.03, 0.28, 'mate', '#0A0B0C', xe + 0.13, techo - 0.10 - la * 0.07, -SZ + 0.24, 0.005);
  tubo(null, [xe, wsb - 0.10, -SZ + 0.24], [xe, L.YF + 0.10, -SZ + 0.50], 0.08, 'goma', '#1B1D20', 12);
  if(C.escapeVertical){
    var ze = SZ - 0.20;
    D.cilindro(null, 0.075, 0.075, techo + 0.10 - L.YF, 'metal', '#A9AFB5', xe, (L.YF + techo + 0.10) / 2, ze, null, 18);
    D.tubo(null, [xe, techo + 0.08, ze], [xe - 0.22, techo + 0.24, ze], 0.075, 'metal', '#A9AFB5', 18);
    rpzConTex(D, null, new THREE.CylinderGeometry(0.10, 0.10, 0.90, 22, 1, true, 0, Math.PI * 1.2), rpzTexPerforado(), '#E6EAEE', 0.3, 0.9,
      xe, L.YF + 0.95, ze, [0, Math.PI * 0.4, 0], true);
    [L.YF + 0.40, techo - 0.40].forEach(function(y){ bl(null, 0.20, 0.05, 0.05, 'mate', RPZ_NEGRO, xe - 0.10, y, ze, 0.01); });
  } else {
    bl(null, 0.62, 0.40, 0.44, 'metal', '#9AA1A8', xe + 0.10, L.YF - 0.10, -(L.zR + 0.30), 0.06);
    D.tubo(null, [xe + 0.40, L.YF - 0.18, -(L.zR + 0.30)], [xe + 0.70, L.YF - 0.40, -(L.zR + 0.42)], 0.05, 'metal', '#8A9097', 12);
  }
}

/* ═══ frente Actros MP3: franja del color de la cabina con ACTROS, parrilla
   grafito con la estrella al medio, parachoques grafito con los faros en las
   esquinas (como en las fotos del 4144), escalones y neblineros ═══ */
function rpzFrenteMB(C){
  var D = C.D, L = C.L, bl = D.bloque, G = C.G;
  var X0 = L.xc0, Y0 = L.Y0, W = L.W, FX = X0 - 0.01, wsb = Y0 + L.wsb, yb0 = Y0 - 0.25;
  /* parrilla: trapecio grafito un poco saliente, mas ancho arriba */
  var gy0 = Y0 - 0.17, gy1 = Y0 + 0.50, gt = 0.78, gb = 0.70;
  D.perfilX('RAD1', [[-gb, gy0], [gb, gy0], [gt, gy1], [-gt, gy1]], 0.05, FX - 0.02, 'pintura', RPZ_GRAFITO, 0.02);
  /* tres ranuras negras con su barra al medio */
  [[Y0 + 0.36, 0.14, 0.62], [Y0 + 0.13, 0.15, 0.66], [Y0 - 0.07, 0.11, 0.60]].forEach(function(q){
    bl('RAD1', 0.02, q[1], q[2] * 2, 'mate', '#08090A', FX - 0.050, q[0], 0, 0.01);
    bl(null, 0.04, q[1] * 0.28, q[2] * 2 - 0.04, 'pintura', '#5A6068', FX - 0.062, q[0], 0, 0.008);
  });
  /* la estrella sobre la ranura de arriba, como en el MP3 */
  rpzEstrella(D, FX - 0.075, Y0 + 0.25, 0, 0.15);
  /* ACTROS en la franja, al lado izquierdo del camion (derecha de quien lo mira) */
  rpzPlano(G, C.texActros, 0.46, 0.08, FX - 0.012, Y0 + 0.62, 0.62, -Math.PI / 2, true);
  /* aletas de las esquinas que siguen el pilar A, del color de la cabina, con su junta */
  [-1, 1].forEach(function(s){
    D.perfil('CBN', [[X0 - 0.03, yb0 + 0.02], [X0 + 0.16, yb0 + 0.02], [X0 + 0.16 + L.rake * 0.9, Y0 + L.wst - 0.10],
      [X0 - 0.01 + L.rake * 0.9, Y0 + L.wst - 0.10], [X0 - 0.03, wsb]], 0.05, s * (W / 2 + 0.03), 'pintura', C.colCab, 0.02);
    D.perfil(null, [[X0 + 0.17, yb0 + 0.04], [X0 + 0.19, yb0 + 0.04], [X0 + 0.19 + L.rake * 0.9, Y0 + L.wst - 0.12], [X0 + 0.17 + L.rake * 0.9, Y0 + L.wst - 0.12]],
      0.02, s * (W / 2 + 0.012), 'mate', '#0B0C0E', 0.004);
  });

  /* ═══ parachoques de obra grafito: cuerpo, faros, neblineros, placa y pasador ═══ */
  var xb = L.xB, by0 = 0.58, by1 = yb0 + 0.01, bm = (by0 + by1) / 2;
  bl('42023615', 0.26, by1 - by0, W - 0.04, 'pintura', RPZ_GRAFITO, xb + 0.13, bm, 0, 0.05);
  /* labio de abajo y placa de proteccion de acero */
  bl(null, 0.30, 0.06, W - 0.30, 'mate', RPZ_PLAST, xb + 0.16, by0 - 0.02, 0, 0.02);
  bl(null, 0.50, 0.03, 1.50, 'metal', '#4A4F55', xb + 0.35, by0 - 0.06, 0, 0.01);
  /* placa al medio y pasador de remolque */
  bl(null, 0.02, 0.13, 0.52, 'mate', '#E8E6D8', xb - 0.006, bm + 0.04, 0, 0.004);
  rpzPlano(G, C.texPlaca, 0.50, 0.11, xb - 0.018, bm + 0.04, 0, -Math.PI / 2, false);
  bl(null, 0.12, 0.14, 0.24, 'metal', '#2E3236', xb - 0.02, by0 + 0.06, 0, 0.02);
  D.cilindro(null, 0.03, 0.03, 0.26, 'cromo', null, xb - 0.05, by0 + 0.06, 0, null, 10);
  /* rendijas de los escalones del parabrisas */
  [-0.48, 0.48].forEach(function(z){ bl(null, 0.04, 0.08, 0.30, 'mate', '#060708', xb - 0.004, by1 - 0.09, z, 0.01); });
  [-1, 1].forEach(function(s){
    /* faro principal: caja negra rectangular con el canto de adentro redondeado,
       mica clara, reflector grande de luz baja y chico de alta */
    var zf = s * (W / 2 - 0.30);
    bl(null, 0.05, 0.22, 0.44, 'mate', '#0D0E10', xb - 0.005, bm + 0.04, zf, 0.06);
    bl(s > 0 ? 'FDI' : 'FDD', 0.02, 0.18, 0.40, 'vidrio', '#B9C4CC', xb - 0.030, bm + 0.04, zf, 0.05);
    D.faro(s > 0 ? 'FDI' : 'FDD', xb + 0.02, bm + 0.04, zf + s * 0.08, 0.070);
    D.faro(s > 0 ? 'FDI' : 'FDD', xb + 0.02, bm + 0.04, zf - s * 0.10, 0.055);
    /* direccional ambar en la esquina, que dobla al costado */
    rpzLuz(D, 'LSM', 0.02, 0.10, 0.10, '#F2A31A', xb - 0.012, bm + 0.04, s * (W / 2 - 0.04), 0.45);
    rpzLuz(D, 'LSM', 0.10, 0.10, 0.02, '#F2A31A', xb + 0.06, bm + 0.04, s * (W / 2 - 0.01), 0.45);
    /* neblinero abajo */
    D.faro('FNB', xb + 0.01, by0 + 0.12, s * (W / 2 - 0.42), 0.050);
  });
}

/* ═══ CUERPO: tolva volquete rectangular con compuerta y visera ═══
   Las tolvas peruanas de los 4144 son de caja recta (no de media cana): piso
   de 5.6 m, costados de 1.30 con nervios verticales de seccion cajon,
   compuerta trasera colgada arriba, frontal alto con visera sobre la cabina
   y cilindro telescopico delantero. Unos 17-20 m3 (supuesto). */
function rpzVolqueteMB(C){
  var D = C.D, L = C.L, bl = D.bloque, est = D.esTolva, tubo = D.tubo, G = C.G;
  var YF = L.YF, YS = YF + 0.26, x0 = L.xCB + 0.50, x1 = L.xFin - 0.06, YB = YS + 1.30, ZB = 1.24;
  var YH = L.Y0 + L.H + 0.12, xa = L.xCB - 0.62;
  var AZ = C.colCuerpo, AZ2 = C.colCuerpo2;
  /* falso chasis fijo sobre los largueros */
  [-1, 1].forEach(function(s){ bl(null, L.xFin - x0 + 0.15, 0.16, 0.10, 'pintura', RPZ_CHASIS, (x0 + L.xFin) / 2 - 0.05, YF + 0.08, s * L.zR, 0.02); });
  /* largueros y travesanos bajo el piso */
  [-1, 1].forEach(function(s){ est(bl('TLV', x1 - x0, 0.18, 0.14, 'pintura', AZ2, (x0 + x1) / 2, YS - 0.07, s * (L.zR + 0.02), 0.03)); });
  for(var k = 0; k < 9; k++) est(bl(null, 0.10, 0.12, ZB * 2 - 0.2, 'pintura', AZ2, x0 + 0.30 + k * (x1 - x0 - 0.5) / 8, YS - 0.04, 0, 0.02));
  /* piso */
  est(bl('TLV', x1 - x0, 0.10, ZB * 2 - 0.10, 'pintura', AZ, (x0 + x1) / 2, YS + 0.05, 0, 0.03));
  var texSM = rpzTexSanMartin('#FFFFFF');
  [-1, 1].forEach(function(s){
    var zc = s * (ZB - 0.04);
    /* costado: plancha con la cartela alta adelante */
    est(D.perfil('TLV', [[x0, YS], [x1, YS], [x1, YB], [x0 + 0.40, YB], [x0, YH], [x0 - 0.02, YH]], 0.08, zc, 'pintura', AZ, 0.02));
    /* pasamano superior, larguero inferior */
    est(bl('TLV', x1 - x0 - 0.30, 0.16, 0.14, 'pintura', AZ2, (x0 + 0.40 + x1) / 2, YB - 0.04, s * (ZB + 0.02), 0.05));
    est(bl('TLV', x1 - x0, 0.14, 0.12, 'pintura', AZ2, (x0 + x1) / 2, YS + 0.05, s * (ZB + 0.02), 0.03));
    /* nervios verticales ahusados (dejan libre el logo y el numero) */
    [x0 + 0.20, x0 + 2.70, x0 + 3.55, x1 - 0.10].forEach(function(x){
      var yb = YS + 0.12, yt = YB - 0.12;
      var gN = new THREE.BoxGeometry(0.14, yt - yb, 0.16), pos = gN.attributes.position;
      for(var v = 0; v < pos.count; v++) if(pos.getY(v) < 0) pos.setZ(v, pos.getZ(v) * 0.45);
      gN.computeVertexNormals();
      est(D.pon('TLV', gN, 'pintura', AZ2, x, (yb + yt) / 2, s * (ZB + 0.04)));
    });
    /* «San Martín» adelante y el numero de la unidad atras */
    est(rpzPlano(G, texSM, 2.10, 0.82, x0 + 1.45, (YS + YB) / 2 + 0.05, s * (ZB + 0.004), s > 0 ? 0 : Math.PI, true));
    est(rpzPlano(G, C.texNum, 1.30, 0.40, x0 + 4.45, (YS + YB) / 2 + 0.12, s * (ZB + 0.004), s > 0 ? 0 : Math.PI, true));
    /* cinta reflectiva en el borde bajo */
    for(var c = 0; c < 8; c++) est(bl(null, 0.24, 0.05, 0.01, 'mate', c % 2 ? '#F2F2F2' : '#C62A1E', x0 + 0.5 + c * 0.62, YS + 0.05, s * (ZB + 0.085), 0.004));
    /* cartela entre el frontal alto y la visera */
    est(D.perfil('TLV', [[x0 - 0.02, YH - 0.02], [xa + 0.05, YH + 0.06], [x0 - 0.02, YH - 0.40]], 0.08, s * (ZB - 0.10), 'pintura', AZ2, 0.02));
    /* bisagra superior de la compuerta y su traba abajo */
    est(D.cilindro('PYB', 0.05, 0.05, 0.14, 'metal', '#4A4F55', x1 + 0.05, YB - 0.05, s * (ZB - 0.06), [Math.PI / 2, 0, 0], 14));
    est(bl(null, 0.10, 0.16, 0.10, 'pintura', AZ2, x1 + 0.06, YS + 0.12, s * (ZB - 0.10), 0.02));
    est(tubo(null, [x1 - 0.30, YS + 0.20, s * (ZB + 0.08)], [x1 + 0.04, YS + 0.12, s * (ZB + 0.08)], 0.025, 'metal', '#4A4F55', 8));
  });
  /* frontal alto con refuerzos horizontales y verticales */
  est(bl('TLV', 0.10, YH - YS + 0.04, ZB * 2, 'pintura', AZ, x0 - 0.03, (YS + YH) / 2, 0, 0.03));
  [YS + 0.55, YB - 0.30, YH - 0.35].forEach(function(y){ est(bl(null, 0.12, 0.10, ZB * 2 - 0.10, 'pintura', AZ2, x0 - 0.12, y, 0, 0.03)); });
  [-0.75, 0.75].forEach(function(z){ est(bl(null, 0.12, YH - YS - 0.2, 0.10, 'pintura', AZ2, x0 - 0.12, (YS + YH) / 2, z, 0.03)); });
  /* peldaños soldados en el frontal, a la izquierda, para subir a mirar la carga */
  for(var p = 0; p < 4; p++) est(bl(null, 0.16, 0.035, 0.34, 'metal', '#8E959C', x0 - 0.16, YS + 0.30 + p * 0.38, 0.95, 0.008));
  /* visera protectora sobre la cabina, con labio y nervios */
  est(bl('TLV', x0 - xa + 0.05, 0.08, ZB * 2 - 0.06, 'pintura', AZ, (xa + x0) / 2, YH + 0.02, 0, 0.03));
  var lab = est(bl(null, 0.22, 0.06, ZB * 2 - 0.06, 'pintura', AZ2, xa - 0.06, YH + 0.06, 0, 0.02)); lab.rotation.z = -0.4;
  [-0.9, 0, 0.9].forEach(function(z){ est(bl(null, x0 - xa - 0.1, 0.12, 0.08, 'pintura', AZ2, (xa + x0) / 2, YH - 0.07, z, 0.02)); });
  /* compuerta trasera: plancha con marco, nervios horizontales y el numero */
  est(bl('TLV', 0.10, YB - YS + 0.04, ZB * 2 + 0.02, 'pintura', AZ, x1 + 0.05, (YS + YB) / 2, 0, 0.03));
  [YS + 0.35, YB - 0.40].forEach(function(y){ est(bl(null, 0.08, 0.10, ZB * 2 - 0.10, 'pintura', AZ2, x1 + 0.12, y, 0, 0.02)); });
  est(rpzPlano(G, C.texNum, 1.10, 0.34, x1 + 0.165, (YS + YB) / 2 + 0.04, 0, Math.PI / 2, true));
  /* bisagras traseras de la tolva en la punta del bastidor */
  var xp = L.xFin - 0.20, yp = YF + 0.12;
  [-1, 1].forEach(function(s){
    est(D.perfil(null, [[xp - 0.30, YS - 0.16], [xp + 0.22, YS - 0.16], [xp + 0.10, yp - 0.04], [xp - 0.10, yp - 0.04]], 0.06, s * (L.zR + 0.10), 'pintura', AZ2, 0.01));
    D.perfil('PYB', [[xp - 0.25, YF], [xp + 0.15, YF], [xp + 0.05, yp + 0.08], [xp - 0.12, yp + 0.08]], 0.05, s * (L.zR + 0.17), 'pintura', RPZ_CHASIS, 0.01);
    D.cilindro('PYB', 0.055, 0.055, 0.28, 'metal', '#4A4F55', xp, yp, s * (L.zR + 0.14), [Math.PI / 2, 0, 0], 16);
  });
  /* cilindro telescopico frontal de cuatro etapas, entre la cabina y la tolva */
  var xcil = (L.xCB + x0) / 2 + 0.04, yc0 = YF - 0.05, yc1 = YB - 0.25;
  bl(null, 0.24, 0.12, 0.70, 'pintura', RPZ_CHASIS, xcil, YF + 0.02, 0, 0.02);
  D.cilindro('PHY', 0.13, 0.13, 0.95, 'pintura', '#1E2023', xcil, yc0 + 0.55, 0, null, 24);
  D.cilindro('PHY', 0.15, 0.15, 0.06, 'pintura', '#1E2023', xcil, yc0 + 1.03, 0, null, 24);
  [[0.11, 1.06, 1.36], [0.095, 1.36, 1.58], [0.08, 1.58, yc1 - yc0 - 0.08]].forEach(function(q){
    D.cilindro(null, q[0], q[0], q[2] - q[1], 'cromo', null, xcil, yc0 + (q[1] + q[2]) / 2, 0, null, 20);
  });
  D.pon(null, new THREE.SphereGeometry(0.10, 14, 10), 'metal', '#3A3F45', xcil, yc0 + 0.08, 0);
  est(bl(null, 0.30, 0.16, 0.40, 'pintura', AZ2, xcil + 0.08, yc1, 0, 0.03));
  /* bomba de levante en la toma de fuerza, tanque hidraulico y mangueras */
  D.cilindro('HPM', 0.09, 0.09, 0.26, 'metal', RPZ_GRIS2, L.xc0 + 2.45, YF - 0.35, -0.22, [0, 0, Math.PI / 2], 16);
  bl('PTB1', 0.22, 0.18, 0.16, 'metal', '#565F69', L.xc0 + 2.20, YF - 0.32, -0.24, 0.02);
  bl('TQH1', 0.34, 0.52, 0.42, 'pintura', '#26292D', xcil, YF + 0.32, 0.80, 0.04);
  D.cilindro('40000054', 0.05, 0.05, 0.14, 'metal', '#A0A6AC', xcil, YF + 0.65, 0.80, null, 12);
  tubo('LPH', [L.xc0 + 2.45, YF - 0.30, -0.22], [xcil, yc0 + 0.25, -0.12], 0.022, 'goma', '#1A1C1F', 8);
  tubo('LPH', [xcil, YF + 0.10, 0.62], [xcil, yc0 + 0.20, 0.12], 0.022, 'goma', '#1A1C1F', 8);
  /* aletas sobre el bogie y defensa trasera con franjas */
  [-1, 1].forEach(function(s){
    var xg0 = L.ejes[2] - L.R - 0.12, xg1 = L.ejes[3] + L.R + 0.12;
    bl(null, xg1 - xg0, 0.03, 0.80, 'mate', RPZ_PLAST, (xg0 + xg1) / 2, 2 * L.R + 0.10, s * (L.zO - 0.10), 0.01);
    bl(null, 0.05, 0.05, 0.40, 'pintura', RPZ_CHASIS, (xg0 + xg1) / 2, 2 * L.R + 0.08, s * (L.zR + 0.25), 0.01);
    bl(null, 0.02, 0.62, 0.60, 'goma', '#141618', L.ejes[3] + L.R + 0.20, 0.52, s * L.zO, 0.01);
  });
  var xd = L.xFin + 0.02;
  bl(null, 0.12, 0.16, 2.30, 'pintura', RPZ_CHASIS, xd, 0.58, 0, 0.02);
  [-0.70, 0.70].forEach(function(z){ bl(null, 0.08, YF - 0.62, 0.08, 'pintura', RPZ_CHASIS, xd - 0.05, (YF + 0.60) / 2 - 0.02, z, 0.01); });
  for(var f = 0; f < 10; f++) bl(null, 0.01, 0.10, 0.22, 'mate', f % 2 ? '#F2F2F2' : '#C62A1E', xd + 0.065, 0.58, -1.0 + f * 0.222, 0.004);
  [-1, 1].forEach(function(s){
    bl(null, 0.08, 0.22, 0.46, 'mate', RPZ_NEGRO, xd - 0.02, YF - 0.25, s * 0.86, 0.02);
    rpzLuz(D, s > 0 ? 'FPI' : 'FPD', 0.02, 0.15, 0.13, '#C2241B', xd + 0.025, YF - 0.25, s * 1.00, 0.4);
    rpzLuz(D, s > 0 ? 'FPI' : 'FPD', 0.02, 0.15, 0.10, '#F2A31A', xd + 0.025, YF - 0.25, s * 0.86, 0.4);
    rpzLuz(D, 'LSM', 0.02, 0.15, 0.10, '#F4F1E6', xd + 0.025, YF - 0.25, s * 0.73, 0.3);
  });
  return new THREE.Vector3(xp, yp, 0);
}

/* ═══ CUERPO: tracto con quinta rueda (sin semirremolque) ═══ */
function rpzTractoMB(C){
  var D = C.D, L = C.L, bl = D.bloque, YF = L.YF, E = L.ejes;
  var xb = (E[1] + E[2]) / 2, xq = xb - 0.30;
  rpzQuinta(D, xq, YF, L.zR, RPZ_CHASIS);
  /* pasarela de plancha estriada detras de la cabina y el soporte de las mangueras */
  var xp0 = L.xCB + 0.05, xp1 = xq - 0.75;
  var tex = rpzTexEstriada('#9AA1A8'); tex.repeat.set(3, 2);
  rpzConTex(D, null, new THREE.BoxGeometry(xp1 - xp0, 0.04, 1.10), tex, '#C8CDD2', 0.4, 0.7, (xp0 + xp1) / 2, YF + 0.04, 0);
  var xs = xp0 + 0.10;
  [-0.55, 0.55].forEach(function(z){ bl(null, 0.06, 0.85, 0.06, 'pintura', RPZ_CHASIS, xs, YF + 0.45, z, 0.01); });
  bl(null, 0.06, 0.06, 1.16, 'pintura', RPZ_CHASIS, xs, YF + 0.88, 0, 0.01);
  rpzEspirales(D, xs + 0.05, YF + 0.82, YF + 0.20, ['#C3161B', '#D9B11A', '#16181B'], [-0.30, 0.0, 0.30]);
  /* aletas de cuarto sobre cada eje motriz, con sus soportes */
  [E[1], E[2]].forEach(function(x){
    [-1, 1].forEach(function(s){
      rpzArcoRueda(D, x, L.R, s * (L.zO - 0.06), L.R + 0.10, 0.80, Math.PI * 0.55, Math.PI * 1.20, 'mate', RPZ_PLAST);
      D.tubo(null, [x, L.R + 0.70, s * (L.zR + 0.05)], [x, L.R + 0.70, s * (L.zO - 0.40)], 0.02, 'metal', RPZ_GRIS2, 6);
    });
  });
  /* barra de luces atras, faldones y defensa */
  var xf = L.xFin;
  bl(null, 0.06, 0.16, 2.30, 'pintura', RPZ_CHASIS, xf + 0.04, YF - 0.05, 0, 0.02);
  [-1, 1].forEach(function(s){
    bl(null, 0.02, 0.62, 0.60, 'goma', '#141618', xf + 0.06, 0.55, s * L.zO, 0.01);
    rpzLuz(D, s > 0 ? 'FPI' : 'FPD', 0.02, 0.10, 0.18, '#C2241B', xf + 0.075, YF - 0.05, s * 0.95, 0.4);
    rpzLuz(D, s > 0 ? 'FPI' : 'FPD', 0.02, 0.10, 0.10, '#F2A31A', xf + 0.075, YF - 0.05, s * 0.75, 0.4);
  });
  for(var f = 0; f < 6; f++) bl(null, 0.01, 0.08, 0.18, 'mate', f % 2 ? '#F2F2F2' : '#C62A1E', xf + 0.075, YF - 0.05, -0.50 + f * 0.20, 0.003);
  /* tanque hidraulico chico del kit de volteo de la cama baja, detras de la cabina */
  bl('TQH1', 0.30, 0.40, 0.36, 'pintura', '#26292D', L.xCB + 0.30, YF + 0.24, -0.70, 0.04);
}

/* ═══ armado de los Actros ═══ */
function rpzConstruirMB(tipo, piezas){
  var V = tipo === 'V4144';
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var L = rpzMedidasMB(tipo);
  var C = { G: G, D: D, L: L, colCab: RPZ_BLANCO, colCuerpo: RPZ_AZUL, colCuerpo2: RPZ_AZUL2, visera: V, escapeVertical: V };
  C.texNum = texNumero3d(null, '#FFFFFF');
  C.texNumPuerta = texNumero3d(null, '#1A1C1F');
  C.texModelo = rpzTexLetras(V ? '4144' : '2640', null, '#7A8088', false, 256, 64, 'italic bold ');
  C.texActros = rpzTexLetras('ACTROS', null, '#7E848C', true, 512, 80, 'italic bold ');
  C.texPlaca = rpzTexLetras('PERU', '#F2F0E6', '#1A1C1F', true, 256, 56);
  rpzChasisMB(C);
  rpzCabinaMB(C);
  rpzFrenteMB(C);
  var piv = null, E = L.ejes;
  if(V){ piv = rpzVolqueteMB(C); rpzEquipMB(C, { lTanque: 0.95, xBat: E[1] + L.R + 0.45, xSen: E[2] - L.R - 0.30 }); }
  else { rpzTractoMB(C); rpzEquipMB(C, { lTanque: 1.40, xTanque: E[0] + L.R + 0.95, xBat: E[0] + L.R + 0.50 }); }

  /* ═══ llantas ═══ */
  var del = { r: L.R, ancho: L.A, rAro: L.rAro, aro: '#B9BEC3', trac: false };
  var tra = { r: L.R, ancho: L.A, rAro: L.rAro, aro: '#B9BEC3', trac: true, obra: V };
  var n = 1;
  for(var i = 0; i < E.length; i++){
    if(i < L.nDel){
      rpzRueda(D, G, piezas, 'LL' + n++, E[i], L.zD, 1, V ? tra : del);
      rpzRueda(D, G, piezas, 'LL' + n++, E[i], -L.zD, -1, V ? tra : del);
    } else {
      rpzRueda(D, G, piezas, 'LL' + n++, E[i], L.zO, 1, tra);
      rpzRueda(D, G, piezas, 'LL' + n++, E[i], L.zI, 0, tra);
      rpzRueda(D, G, piezas, 'LL' + n++, E[i], -L.zI, 0, tra);
      rpzRueda(D, G, piezas, 'LL' + n++, E[i], -L.zO, -1, tra);
    }
  }

  /* centrar en X para que el estudio gire alrededor del medio */
  var caja = new THREE.Box3().setFromObject(G);
  var xc = (caja.min.x + caja.max.x) / 2;
  G.children.forEach(function(m){ m.position.x -= xc; });
  if(piv){ piv.x -= xc; D.colgarTolva(piv, 'RPZ-ACTROS4144K'); }
  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ C.texNum.userData.poner(id); C.texNumPuerta.userData.poner(id); };
  G.userData.mirarY = 1.6;
  G.userData.dist = V ? 19 : 17;
  G.userData.modelo = V ? 'RPZ-ACTROS4144K' : 'RPZ-ACTROS2640S';
  return G;
}

/* ════════════════════════════════════════════════════════════════
   MACK PINNACLE CXU613: tracto convencional de capot inclinado
   ════════════════════════════════════════════════════════════════ */
/* seccion (z,y) de un capot: costados que se recogen hacia arriba, cantos
   redondeados y una comba en el techo; abierta por abajo */
function rpzSeccion(hw, hwT, y0, y1, r, comba){
  var pts = [[hw, y0]], nA = 4, nC = 4, i, a, zc = hwT - r;
  for(i = 0; i <= nA; i++){ a = i / nA * Math.PI / 2; pts.push([zc + r * Math.cos(a), y1 - r + r * Math.sin(a)]); }
  for(i = 1; i < nC; i++){ var z = zc - i / nC * 2 * zc; pts.push([z, y1 + comba * (1 - Math.pow(z / zc, 2))]); }
  for(i = nA; i >= 0; i--){ a = i / nA * Math.PI / 2; pts.push([-(zc + r * Math.cos(a)), y1 - r + r * Math.sin(a)]); }
  pts.push([-hw, y0]);
  return pts;
}
/* superficie que une secciones a lo largo de X (todas con el mismo numero de puntos) */
function rpzLoft(secs){
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
function rpzInterp(secs, x, k){
  if(x <= secs[0][0]) return secs[0][k];
  for(var i = 1; i < secs.length; i++){
    if(x <= secs[i][0]){ var f = (x - secs[i - 1][0]) / (secs[i][0] - secs[i - 1][0]); return secs[i - 1][k] + f * (secs[i][k] - secs[i - 1][k]); }
  }
  return secs[secs.length - 1][k];
}

/* medidas del CXU613 (ver la cabecera) */
function rpzMedidasMack(){
  var P = {};
  P.XF = -1.22; P.XD = 0; P.XT = 4.32; P.X1 = P.XT - 0.66; P.X2 = P.XT + 0.66; P.XC = P.X2 + 0.62;
  P.XCB = 1.73; P.XCF = P.XCB - 1.58; P.XG = P.XF + 0.24;
  P.YB = 0.80; P.YR = 1.07; P.YP = 1.24; P.YT = 3.00; P.YW = 2.10;
  P.RL = 0.527; P.AL = 0.28; P.rAro = 0.286; P.CW = 1.025; P.ZR = 0.39;
  P.ZD = 1.04; P.ZO = 2.49 / 2 - P.AL / 2; P.ZI = 1.86 - P.ZO;
  P.XDA = P.XCF + 0.12; P.XDB = P.XDA + 1.02;
  P.YBELT = P.YT - 0.76; P.rake = 0.42;
  P.col = RPZ_BLANCO; P.aro = '#D5D9DD';
  return P;
}

/* ═══ bastidor, ejes, suspension camelback, motor y tren motriz ═══ */
function rpzChasisMack(D, P, G, piezas){
  var XF = P.XF, XD = P.XD, XC = P.XC, YB = P.YB, YR = P.YR, RL = P.RL, ZR = P.ZR, NEG = '#1A1C1F';
  [-1, 1].forEach(function(s){
    D.bloque('42023615', XC - XF - 0.22, YR - YB, 0.075, 'pintura', NEG, (XF + 0.22 + XC) / 2, (YB + YR) / 2, s * ZR, 0.012);
    D.bloque(null, XC - XF - 0.24, 0.012, 0.09, 'pintura', '#26292D', (XF + 0.22 + XC) / 2, YR - 0.006, s * (ZR - 0.01), 0.004);
  });
  var tr = [];
  for(var x = XF + 0.40; x < XC; x += 0.95) tr.push([x, (YB + YR) / 2 + 0.02, 0]);
  tr.push([XC - 0.05, (YB + YR) / 2, 0]);
  rpzInst(D, '42023615', new THREE.BoxGeometry(0.09, 0.20, ZR * 2 - 0.07), 'pintura', NEG, tr);

  /* eje delantero: viga en I con caida, muelles, amortiguadores, tambores */
  var zk = P.ZD - 0.20;
  D.bloque(null, 0.12, 0.13, zk * 2 - 0.50, 'pintura', '#2A2D31', XD, RL - 0.11, 0, 0.02);
  [-1, 1].forEach(function(s){
    var t = D.bloque(null, 0.12, 0.13, 0.36, 'pintura', '#2A2D31', XD, RL - 0.055, s * (zk - 0.14), 0.02);
    t.rotation.x = s * 0.30;
    D.cilindro(null, 0.06, 0.06, 0.24, 'metal', RPZ_GRIS2, XD, RL, s * zk, null, 14);
    D.cilindro(s > 0 ? 'BMLH' : 'BMRH', 0.20, 0.20, 0.17, 'metal', '#33373C', XD, RL, s * (P.ZD - 0.12), [Math.PI / 2, 0, 0], 26);
    D.tubo(null, [XD, RL, s * zk], [XD + 0.22, RL - 0.06, s * (zk - 0.12)], 0.025, 'metal', RPZ_GRIS, 8);
    rpzMuelle(D, '42020008', XD, RL + 0.17, 1.40, 4, s * ZR, 0.075, 0.07, '#2E3238');
    [-0.70, 0.70].forEach(function(dx){
      D.cilindro(null, 0.035, 0.035, 0.10, 'metal', RPZ_GRIS, XD + dx, RL + 0.25, s * ZR, [Math.PI / 2, 0, 0], 10);
      D.bloque(null, 0.08, YB - RL - 0.20, 0.10, 'pintura', NEG, XD + dx, (YB + RL + 0.24) / 2, s * ZR, 0.012);
    });
    [-0.05, 0.05].forEach(function(dx){ D.tubo(null, [XD + dx, RL - 0.05, s * (ZR + 0.05)], [XD + dx, RL + 0.22, s * (ZR + 0.05)], 0.011, 'metal', RPZ_GRIS, 6); });
    D.cilHidD(s > 0 ? 'SDI' : 'SDD', [XD + 0.20, RL - 0.02, s * (ZR + 0.10)], [XD + 0.30, YR - 0.05, s * (ZR + 0.10)], 0.04, '#202326', 0.55);
  });
  D.tubo(null, [XD + 0.22, RL - 0.06, -(zk - 0.12)], [XD + 0.22, RL - 0.06, zk - 0.12], 0.025, 'metal', RPZ_GRIS, 10);
  rpzRueda(D, G, piezas, 'LL1', XD, P.ZD, 1, { r: RL, ancho: P.AL, rAro: P.rAro, aro: P.aro, trac: false });
  rpzRueda(D, G, piezas, 'LL2', XD, -P.ZD, -1, { r: RL, ancho: P.AL, rAro: P.rAro, aro: P.aro, trac: false });
  D.bloque('CDR', 0.24, 0.22, 0.16, 'metal', RPZ_GRIS, XD - 0.42, YR - 0.10, ZR + 0.12, 0.03);
  D.tubo(null, [XD - 0.42, YR - 0.22, ZR + 0.16], [XD + 0.22, RL - 0.04, P.ZD - 0.32], 0.022, 'metal', RPZ_GRIS, 8);

  /* tandem: puentes Mack, frenos de tambor y la suspension camelback */
  var trac = { r: RL, ancho: P.AL, rAro: P.rAro, aro: P.aro, trac: true };
  [[P.X1, 'DIFD'], [P.X2, 'DIFP']].forEach(function(q, k){
    var xa = q[0];
    D.cilindro(null, 0.085, 0.085, (P.ZI - 0.16) * 2, 'pintura', '#2A2D31', xa, RL, 0, [Math.PI / 2, 0, 0], 16);
    var banjo = D.pon(q[1], new THREE.SphereGeometry(0.26, 24, 16), 'pintura', '#2A2D31', xa, RL, 0);
    banjo.scale.set(1, 1, 0.62);
    D.cilindro(q[1], 0.18, 0.13, 0.30, 'pintura', '#2A2D31', xa - 0.22, RL + 0.03, 0, [0, 0, Math.PI / 2], 20);
    [-1, 1].forEach(function(s){
      D.cilindro(s > 0 ? 'BPLH' : 'BPRH', 0.21, 0.21, 0.20, 'metal', '#33373C', xa, RL, s * (P.ZI - 0.18), [Math.PI / 2, 0, 0], 26);
      D.cilindro('42066068', 0.095, 0.095, 0.26, 'pintura', '#202326', xa - 0.24, RL + 0.14, s * (P.ZI - 0.40), [0, 0, Math.PI / 2 - 0.25], 18);
      D.tubo('21003297', [xa - 0.36, RL + 0.18, s * (P.ZI - 0.40)], [xa - 0.30, YB - 0.02, s * (ZR - 0.06)], 0.012, 'goma', '#111', 6);
    });
    var bi = 3 + k * 4;
    rpzRueda(D, G, piezas, 'LL' + bi, xa, P.ZO, 1, trac);
    rpzRueda(D, G, piezas, 'LL' + (bi + 1), xa, P.ZI, 0, trac);
    rpzRueda(D, G, piezas, 'LL' + (bi + 2), xa, -P.ZI, 0, trac);
    rpzRueda(D, G, piezas, 'LL' + (bi + 3), xa, -P.ZO, -1, trac);
  });
  [-1, 1].forEach(function(s){
    var cS = s < 0 ? 'SPD' : null, zs = s * (ZR + 0.02);
    rpzMuelle(D, '42041233', P.XT, RL + 0.42, 1.32 + 0.36, 6, zs, 0.10, -0.26, '#2E3238');
    D.bloque(cS, 0.36, YB - RL - 0.18, 0.20, 'pintura', NEG, P.XT, (YB + RL + 0.36) / 2 + 0.02, zs, 0.03);
    D.cilindro(cS, 0.09, 0.09, 0.30, 'metal', RPZ_GRIS, P.XT, RL + 0.36, zs, [Math.PI / 2, 0, 0], 16);
    [P.X1, P.X2].forEach(function(xa){
      D.bloque(cS, 0.26, 0.10, 0.16, 'pintura', NEG, xa, RL + 0.12, zs, 0.02);
      D.tubo(cS, [xa, RL - 0.06, s * (ZR - 0.06)], [P.XT, RL + 0.22, s * (ZR - 0.06)], 0.035, 'metal', '#2E3238', 10);
    });
  });

  /* motor MP8, radiador, caja y cardanes */
  var XM0 = P.XG + 0.55, XM1 = P.XCF + 0.18, XMc = (XM0 + XM1) / 2, LM = XM1 - XM0;
  D.bloque('ENG1', LM, 0.62, 0.66, 'metal', RPZ_GRIS, XMc, 1.12, 0, 0.05);
  D.bloque('ENG1', LM * 0.92, 0.22, 0.50, 'metal', '#2E3238', XMc, 0.72, 0, 0.04);
  D.bloque('42064643', LM * 0.88, 0.14, 0.42, 'metal', '#5D646C', XMc, 1.50, 0, 0.04);
  D.cilindro('ENG1', 0.11, 0.11, 0.30, 'metal', '#6B7178', XM1 - 0.18, 1.30, -0.42, [Math.PI / 2, 0, 0], 16);
  D.cilindro('AL1', 0.10, 0.10, 0.16, 'metal', '#9AA1A8', XM0 + 0.12, 1.22, -0.36, [0, 0, Math.PI / 2], 16);
  D.cilindro('CMP', 0.09, 0.09, 0.24, 'metal', '#7D848B', XM0 + 0.45, 0.98, 0.40, [0, 0, Math.PI / 2], 14);
  D.cilindro('AR1', 0.08, 0.08, 0.30, 'metal', '#5C6268', XM1 - 0.10, 0.82, 0.38, [0, 0, Math.PI / 2], 14);
  D.cilindro('SPM', 0.07, 0.07, 0.18, 'metal', '#7D848B', XM0 + 0.30, 1.30, 0.40, [0, 0, Math.PI / 2], 14);
  var XTR0 = P.XCF + 0.18;
  D.cilindro('TRM', 0.30, 0.22, 0.28, 'metal', RPZ_GRIS, XTR0 + 0.14, 1.00, 0, [0, 0, Math.PI / 2], 24);
  D.bloque('TRM', 0.80, 0.42, 0.44, 'metal', RPZ_GRIS, XTR0 + 0.68, 0.94, 0, 0.05);
  var ejeS = [XTR0 + 1.10, 0.92, 0], pin1 = [P.X1 - 0.38, RL + 0.03, 0];
  D.tubo(null, ejeS, pin1, 0.055, 'metal', '#8A9097', 14);
  D.tubo(null, [P.X1 + 0.30, RL + 0.05, 0], [P.X2 - 0.38, RL + 0.03, 0], 0.05, 'metal', '#8A9097', 14);
  [ejeS, pin1].forEach(function(p){ D.cilindro(null, 0.075, 0.075, 0.08, 'metal', '#3A3F45', p[0], p[1], 0, [0, 0, Math.PI / 2], 12); });
  [-0.24, 0.24].forEach(function(z){ D.cilindro('LPA', 0.11, 0.11, 0.85, 'pintura', '#30343A', P.XCB + 0.80, YR - 0.13, z, [0, 0, Math.PI / 2], 18); });
  D.tubo('LPA', [P.XCB + 0.25, YR - 0.20, 0.20], [P.X1 - 0.6, YR - 0.20, 0.30], 0.012, 'goma', '#2E5E9E', 6);
  D.tubo('HAR', [P.XF + 0.6, YR - 0.18, ZR - 0.05], [P.XC - 0.2, YR - 0.18, ZR - 0.05], 0.016, 'goma', '#1B1D20', 6);
}

/* ═══ cabina corta del Pinnacle ═══ */
function rpzCabinaMack(D, P, G){
  var col = P.col, CW = P.CW, XCF = P.XCF, XCB = P.XCB, YP = P.YP, YT = P.YT, YW = P.YW, rk = P.rake, NEG = RPZ_NEGRO;
  D.perfil('CBN', [[XCF, YP], [XCB, YP], [XCB, YT - 0.03], [XCB - 0.05, YT], [XCF + rk + 0.05, YT], [XCF + rk, YT - 0.04], [XCF, YW]],
    CW * 2, 0, 'pintura', col, 0.06);
  D.bloque('CBN', XCB - XCF - rk - 0.12, 0.05, CW * 2 - 0.16, 'pintura', col, (XCF + rk + XCB) / 2, YT + 0.02, 0, 0.025);
  /* parabrisas de una pieza en su goma */
  var ang = Math.atan2(rk, YT - YW), Lw = Math.hypot(rk, YT - YW) - 0.16;
  var nx = -Math.cos(ang), ny = Math.sin(ang), mx = XCF + rk / 2 + nx * 0.012, my = (YW + YT) / 2 + ny * 0.012;
  D.bloque(null, 0.02, Lw + 0.06, CW * 2 - 0.10, 'mate', '#0E0F11', mx - nx * 0.004, my - ny * 0.004, 0, 0.008, [0, 0, -ang]);
  D.bloque(null, 0.02, Lw, CW * 2 - 0.22, 'vidrio', RPZ_VIDRIO, mx + nx * 0.004, my + ny * 0.004, 0, 0.006, [0, 0, -ang]);
  [-0.55, 0.25].forEach(function(z){
    D.tubo(null, [XCF + 0.02, YW + 0.06, z], [XCF + 0.02 + rk * 0.40, YW + 0.06 + (YT - YW) * 0.40, z + 0.50], 0.010, 'mate', '#0E0F11', 6);
  });
  /* ventanas de las puertas con la linea baja que sube hacia atras (Pinnacle) */
  var xf = function(y){ return XCF + rk * (y - YW) / (YT - YW) + 0.11; };
  var yb = P.YBELT, yt = YT - 0.12, XDB = P.XDB;
  var vent = [[xf(yb) - 0.04, yb - 0.10], [XDB - 0.06, yb + 0.02], [XDB - 0.06, yt], [xf(yt), yt]];
  [-1, 1].forEach(function(s){
    D.perfil(null, rpzEnsanchar(vent, 0.03), 0.012, s * (CW + 0.002), 'mate', '#0E0F11', 0.003);
    D.perfil(null, vent, 0.014, s * (CW + 0.006), 'vidrio', RPZ_VIDRIO, 0.004);
    var zj = s * (CW + 0.003);
    D.bloque(null, 0.012, YT - YP - 0.12, 0.008, 'mate', '#0B0C0E', P.XDA, (YP + YT) / 2 - 0.02, zj, 0.002);
    D.bloque(null, 0.012, YT - YP - 0.12, 0.008, 'mate', '#0B0C0E', XDB, (YP + YT) / 2 - 0.02, zj, 0.002);
    D.bloque(null, XDB - P.XDA, 0.012, 0.008, 'mate', '#0B0C0E', (P.XDA + XDB) / 2, YP + 0.06, zj, 0.002);
    /* manija empotrada y bisagras */
    D.bloque(null, 0.05, 0.16, 0.02, 'mate', NEG, XDB - 0.12, yb - 0.22, s * (CW + 0.012), 0.008);
    D.bloque(null, 0.03, 0.10, 0.02, 'cromo', null, XDB - 0.12, yb - 0.22, s * (CW + 0.022), 0.006);
    [YP + 0.30, yb - 0.05].forEach(function(y){ D.bloque(null, 0.05, 0.10, 0.03, 'mate', NEG, P.XDA + 0.02, y, s * (CW + 0.012), 0.008); });
    D.tubo(null, [XDB + 0.07, YP + 0.20, s * (CW + 0.05)], [XDB + 0.07, yb + 0.15, s * (CW + 0.05)], 0.016, 'cromo', null, 8);
    /* espejos negros aerodinamicos sobre brazos, con el convexo debajo */
    var xm = XCF + 0.10, zm = s * (CW + 0.30), y1 = YT - 0.22, y0 = yb - 0.02;
    D.tubo(null, [XCF + rk * 0.75 + 0.10, YT - 0.25, s * CW], [xm, y1, zm], 0.016, 'mate', NEG, 8);
    D.tubo(null, [P.XDA + 0.02, yb - 0.04, s * CW], [xm, y0, zm], 0.016, 'mate', NEG, 8);
    D.bloque(null, 0.10, 0.40, 0.20, 'mate', NEG, xm + 0.01, (y0 + y1) / 2 + 0.04, zm, 0.035);
    D.bloque(null, 0.01, 0.35, 0.16, 'cromo', null, xm + 0.065, (y0 + y1) / 2 + 0.04, zm, 0.004);
    D.cilindro(null, 0.075, 0.075, 0.05, 'mate', NEG, xm + 0.01, y0 - 0.14, zm, [0, 0, Math.PI / 2], 18);
    D.pon(null, new THREE.SphereGeometry(0.07, 14, 8, 0, Math.PI * 2, 0, Math.PI / 3), 'cromo', null, xm + 0.035, y0 - 0.14, zm, [0, 0, -Math.PI / 2]);
    /* luz de galibo ambar al costado */
    D.bloque('LSM', 0.08, 0.05, 0.03, 'vidrio', '#F0A020', XCB - 0.20, YT - 0.10, s * (CW + 0.01), 0.008);
  });
  /* ventana de atras */
  D.bloque(null, 0.012, 0.50, 1.00, 'mate', '#0E0F11', XCB + 0.003, YT - 0.42, 0, 0.004);
  D.bloque(null, 0.014, 0.44, 0.94, 'vidrio', RPZ_VIDRIO, XCB + 0.008, YT - 0.42, 0, 0.004);
  /* visera de acero inoxidable con cinco luces ambar y las cajas MACK de los extremos */
  var vis = D.bloque('CBN', 0.36, 0.04, CW * 2 + 0.02, 'cromo', '#D5D9DD', XCF + rk - 0.10, YT - 0.02, 0, 0.015);
  vis.rotation.z = 0.14;
  for(var i = 0; i < 5; i++){
    var l = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4, roughness: 0.3 }));
    l.position.set(XCF + rk - 0.04, YT + 0.02, -0.40 + i * 0.20); l.scale.set(1, 0.8, 1.6); D.reg('LSM', l, '#F0A41C');
  }
  [-1, 1].forEach(function(s){
    D.bloque(null, 0.16, 0.10, 0.22, 'cromo', null, XCF + rk + 0.08, YT + 0.05, s * (CW - 0.18), 0.02);
    D.tubo(null, [XCB - 0.40, YT + 0.04, s * 0.30], [XCB - 0.80, YT + 0.12, s * 0.30], 0.035, 'cromo', null, 14);
  });
  /* circulina y antena */
  var bal = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#F09A1C'), emissive: new THREE.Color('#F09A1C'), emissiveIntensity: 0.45, roughness: 0.3 }));
  bal.position.set(XCB - 0.22, YT + 0.08, 0.0); D.reg('CIR', bal, '#F09A1C');
  D.cilindro('CIR', 0.10, 0.10, 0.06, 'mate', NEG, XCB - 0.22, YT + 0.06, 0.0, null, 16);
  D.tubo(null, [XCB - 0.30, YT + 0.04, CW - 0.12], [XCB - 0.36, YT + 0.90, CW - 0.12], 0.006, 'metal', '#222', 4);
  /* escalones de aluminio bajo la puerta y los tanques redondos de aluminio */
  var xs0 = P.XD + 0.82, xs1 = P.XD + 1.22, texD = rpzTexEstriada('#9EA4AA'); texD.repeat.set(2, 2);
  [-1, 1].forEach(function(s){
    var zc = s * (CW - 0.12);
    D.bloque(null, 0.035, YP - 0.45, 0.30, 'metal', RPZ_ALU, xs0, (YP + 0.45) / 2, zc, 0.01);
    D.bloque(null, 0.035, YP - 0.45, 0.30, 'metal', RPZ_ALU, xs1, (YP + 0.45) / 2, zc, 0.01);
    [0.52, 0.88].forEach(function(y){ rpzConTex(D, null, new THREE.BoxGeometry(xs1 - xs0, 0.03, 0.30), texD, '#D8DCE0', 0.4, 0.75, (xs0 + xs1) / 2, y, zc + s * 0.03); });
    /* tanque de 0.66 de diametro con zunchos, tapa y peldano encima */
    var xt0 = xs1 + 0.06, LT = 1.40, zt = s * (0.43 + 0.36);
    D.cilindro(s > 0 ? 'TQC1' : null, 0.33, 0.33, LT, 'cromo', '#C9CED3', xt0 + LT / 2, P.YR - 0.22, zt, [0, 0, Math.PI / 2], 30);
    [0.18, LT - 0.18].forEach(function(dx){ D.pon(null, new THREE.TorusGeometry(0.336, 0.014, 8, 36), 'mate', NEG, xt0 + dx, P.YR - 0.22, zt, [0, Math.PI / 2, 0]); });
    D.cilindro(null, 0.055, 0.055, 0.05, 'cromo', null, xt0 + 0.30, P.YR + 0.12, zt, null, 16);
    rpzConTex(D, null, new THREE.BoxGeometry(0.60, 0.03, 0.26), texD, '#D8DCE0', 0.4, 0.75, xt0 + 0.40, P.YR - 0.58, zt + s * 0.36);
    [0.25, LT - 0.25].forEach(function(dx){ D.bloque(null, 0.06, 0.30, 0.06, 'pintura', NEG, xt0 + dx, P.YR - 0.12, s * 0.50, 0.01); });
  });
  D.bloque('42076084', 0.10, 0.08, 0.08, 'metal', '#8A6A2A', P.XCB + 0.30, P.YR - 0.50, 0.62, 0.015);
  /* baterias en caja de aluminio detras del tanque derecho */
  D.bloque('BAT', 0.60, 0.42, 0.50, 'metal', RPZ_ALU, P.XCB + 0.95, P.YR - 0.18, -0.74, 0.03);
  D.bloque(null, 0.62, 0.03, 0.52, 'metal', '#9EA4AA', P.XCB + 0.95, P.YR + 0.045, -0.74, 0.01);
  D.bloque('SEN', 0.20, 0.26, 0.16, 'mate', '#1E2023', P.XCB + 1.55, P.YR - 0.18, -(P.ZR + 0.12), 0.02);
  D.cilindro('SEN', 0.07, 0.07, 0.16, 'vidrio', '#D9D2A8', P.XCB + 1.55, P.YR + 0.03, -(P.ZR + 0.12), null, 14);
  D.bloque('EC', 0.28, 0.20, 0.06, 'mate', '#1E2023', P.XCB + 0.30, P.YR - 0.12, P.ZR + 0.07, 0.015);
  /* escape vertical a la izquierda detras de la cabina: escudo perforado y chimenea */
  var ze = CW - 0.22, xe = XCB + 0.20, texP = rpzTexPerforado();
  D.cilindro(null, 0.14, 0.14, 1.05, 'metal', '#8A9097', xe, P.YR + 0.80, ze, null, 22);
  rpzConTex(D, null, new THREE.CylinderGeometry(0.165, 0.165, 0.80, 26, 1, true, Math.PI * 0.15, Math.PI * 1.3), texP, '#E6EAEE', 0.3, 0.9,
    xe, P.YR + 0.80, ze, [0, Math.PI, 0], true);
  D.tubo(null, [xe, P.YR + 1.30, ze], [xe, YT + 0.78, ze], 0.065, 'cromo', null, 20);
  D.tubo(null, [xe, YT + 0.76, ze], [xe + 0.12, YT + 0.94, ze], 0.065, 'cromo', null, 20);
  [P.YR + 0.55, YT - 0.25].forEach(function(y){ D.bloque(null, 0.18, 0.05, 0.05, 'mate', NEG, xe - 0.09, y, ze, 0.01); });
  D.tubo(null, [xe, P.YR + 0.27, ze], [P.XCF + 0.60, 0.80, 0.0], 0.06, 'metal', '#5C6268', 14);
  /* numero de unidad en las puertas */
  var texNum = texNumero3d(null, '#1A1C1F');
  var matN = new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 });
  [-1, 1].forEach(function(s){
    var mn = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.21), matN);
    mn.position.set((P.XDA + XDB) / 2 + 0.04, YP + 0.42, s * (CW + 0.012)); mn.rotation.y = s > 0 ? 0 : Math.PI; G.add(mn);
  });
  return texNum;
}

/* el bulldog cromado sobre la nariz */
function rpzBulldog(D, x, y){
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

/* ═══ frente Pinnacle: capot inclinado de una pieza con los guardafangos,
   parrilla cromada de barras horizontales con MACK, ceja cromada en V sobre
   la parrilla, faros grandes barridos hacia atras en las esquinas, dos
   respiraderos en el costado del capot y parachoques de aluminio pulido ═══ */
function rpzFrenteMack(D, P, G){
  var col = P.col, XF = P.XF, XG = P.XG, XD = P.XD, XCF = P.XCF, RL = P.RL, NEG = RPZ_NEGRO;
  /* parachoques envolvente de aluminio pulido */
  D.bloque(null, 0.22, 0.42, 2.06, 'cromo', '#D9DDE1', XF + 0.11, 0.72, 0, 0.05);
  [-1, 1].forEach(function(s){
    var e = D.bloque(null, 0.40, 0.42, 0.20, 'cromo', '#D9DDE1', XF + 0.26, 0.72, s * 1.11, 0.05);
    e.rotation.y = s * 0.55;
  });
  D.bloque(null, 0.12, 0.06, 2.10, 'mate', NEG, XF + 0.18, 0.49, 0, 0.02);
  /* toma baja del aire y ganchos de remolque */
  D.bloque(null, 0.03, 0.12, 0.90, 'mate', '#0B0C0E', XF - 0.005, 0.76, 0, 0.02);
  [-0.62, 0.62].forEach(function(z){ D.bloque(null, 0.05, 0.12, 0.14, 'mate', '#0E0F11', XF - 0.005, 0.76, z, 0.02); });
  [-1, 1].forEach(function(s){ D.faro('FNB', XF + 0.01, 0.68, s * 0.86, 0.045); });
  /* radiador, enfriador, condensador y la malla de la parrilla */
  var y0 = 1.00, y1 = 1.74, hz = 0.47, yc = (y0 + y1) / 2, h = y1 - y0, x = XG;
  D.bloque('AAC', 0.04, h - 0.06, hz * 2 - 0.08, 'metal', '#3F454C', x + 0.09, yc, 0, 0.008);
  D.bloque('AFT1', 0.07, h - 0.04, hz * 2 - 0.04, 'metal', '#5C636B', x + 0.15, yc, 0, 0.01);
  D.bloque('RAD1', 0.11, h, hz * 2, 'metal', '#2E3338', x + 0.25, yc, 0, 0.015);
  D.pon('FAN1', new THREE.TorusGeometry(0.30, 0.03, 8, 30), 'mate', '#1E2023', x + 0.34, yc, 0, [0, Math.PI / 2, 0]);
  D.cilindro('FAN1', 0.29, 0.29, 0.04, 'mate', '#26292D', x + 0.38, yc, 0, [0, 0, Math.PI / 2], 9);
  [-1, 1].forEach(function(s){ D.bloque(null, 0.20, h, 0.02, 'mate', '#121315', x + 0.10, yc, s * (hz - 0.02), 0.005); });
  var tex = rpzTexMalla(24);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(hz * 2 / 0.16, h / 0.16);
  rpzConTex(D, null, new THREE.PlaneGeometry(hz * 2 - 0.02, h - 0.02), tex, '#2B2E33', 0.45, 0.6, x + 0.035, yc, 0, [0, -Math.PI / 2, 0], true);
  /* marco cromado y barras horizontales; la barra de MACK mas ancha abajo */
  D.bloque(null, 0.08, 0.06, hz * 2 + 0.06, 'cromo', null, x, y0, 0, 0.02);
  [-1, 1].forEach(function(s){ D.bloque(null, 0.08, h, 0.07, 'cromo', null, x, yc, s * hz, 0.02); });
  var barras = [];
  for(var i = 1; i < 9; i++) if(i !== 2) barras.push([x + 0.005, y0 + i * h / 9, 0]);
  rpzInst(D, null, new THREE.BoxGeometry(0.04, 0.035, hz * 2 - 0.04), 'cromo', null, barras);
  D.bloque(null, 0.05, 0.10, hz * 2 - 0.04, 'cromo', null, x - 0.005, y0 + 2 * h / 9, 0, 0.02);
  rpzPlano(G, rpzTexLetras('MACK', null, '#22262B', true, 512, 96), 0.42, 0.075, x - 0.034, y0 + 2 * h / 9, 0, -Math.PI / 2, true);
  /* ceja cromada en V sobre la parrilla */
  [-1, 1].forEach(function(s){
    var c = D.bloque(null, 0.10, 0.12, hz + 0.08, 'cromo', null, x + 0.02, y1 + 0.02, s * (hz + 0.08) / 2, 0.03);
    c.rotation.x = s * 0.16;
  });
  /* capot inclinado */
  var secs = [[XG + 0.05, 0.64, 0.52, 1.00, 1.80, 0.10, 0.01], [XG + 0.30, 0.74, 0.62, 1.00, 1.88, 0.15, 0.02],
              [XG + 0.75, 0.88, 0.78, 1.02, 1.97, 0.18, 0.03], [XCF + 0.03, 1.00, 0.92, 1.06, 2.08, 0.20, 0.03]];
  /* paneles del color de la cabina entre la parrilla y los costados del capot */
  [-1, 1].forEach(function(s){ D.bloque('CBN', 0.06, 0.82, 0.18, 'pintura', col, XG + 0.06, 1.39, s * 0.555, 0.02); });
  var S = secs.map(function(q){ return { x: q[0], pts: rpzSeccion(q[1], q[2], q[3], q[4], q[5], q[6]) }; });
  var mc = D.pon('CBN', rpzLoft(S), 'pintura', col, 0, 0, 0); mc.material.side = THREE.DoubleSide;
  rpzBulldog(D, XG + 0.20, rpzInterp(secs, XG + 0.20, 4) + 0.01);
  /* guardafangos: perfil de costado con el arco de la rueda, que barren hacia atras */
  var ra = RL + 0.10;
  var pts = [[XF + 0.32, 0.90], [XF + 0.28, 1.20], [XF + 0.34, 1.36], [XF + 0.55, 1.48], [XD - 0.30, 1.56], [XD + 0.20, 1.54],
             [XD + 0.62, 1.30], [XD + 0.86, 1.02], [XD + 0.88, 0.56]].concat(rpzArco(XD, RL, ra, -0.03, Math.PI - 0.42, 14));
  [-1, 1].forEach(function(s){ D.perfil('CBN', pts, 0.62, s * 0.90, 'pintura', col, 0.07); });
  /* ceja negra del arco */
  var ceja = rpzArco(XD, RL, ra + 0.07, -0.03, Math.PI - 0.42, 16).concat(rpzArco(XD, RL, ra - 0.005, Math.PI - 0.42, -0.03, 16));
  [-1, 1].forEach(function(s){ D.perfil(null, ceja, 0.08, s * 1.17, 'mate', '#202226', 0.012); });
  var texPin = rpzTexLetras('PINNACLE', null, '#5A6067', true, 512, 80, 'bold ');
  [-1, 1].forEach(function(s){
    /* faro barrido: carcasa negra que sigue el guardafango, mica, dos reflectores y la direccional ambar */
    var zf = s * 0.88, hf = 0.22;
    var car = D.bloque(null, 0.62, hf, 0.42, 'mate', '#15171A', XF + 0.62, 1.34, zf, 0.06);
    car.rotation.z = 0.28;
    var mica = D.bloque(s > 0 ? 'FDI' : 'FDD', 0.64, hf + 0.02, 0.44, 'vidrio', '#8E9AA4', XF + 0.60, 1.345, zf, 0.05);
    mica.rotation.z = 0.28;
    D.faro(s > 0 ? 'FDI' : 'FDD', XF + 0.27, 1.27, zf - s * 0.10, 0.065);
    D.faro(s > 0 ? 'FDI' : 'FDD', XF + 0.27, 1.27, zf + s * 0.07, 0.065);
    rpzLuz(D, 'LSM', 0.16, 0.08, 0.10, '#F2A31A', XF + 0.82, 1.43, s * 1.02, 0.45);
    /* respiraderos con borde cromado en el costado del capot */
    for(var k = 0; k < 2; k++){
      var xv = XCF - 0.62, zv = s * (rpzInterp(secs, xv, 2) + 0.004), yv = 1.82 - k * 0.12;
      D.bloque(null, 0.40, 0.07, 0.012, 'cromo', null, xv, yv, zv, 0.004);
      D.bloque(null, 0.36, 0.04, 0.014, 'mate', '#0B0C0E', xv, yv, zv + s * 0.002, 0.003);
    }
    rpzPlano(G, texPin, 0.44, 0.07, XCF - 0.35, 1.66, s * (rpzInterp(secs, XCF - 0.35, 2) + 0.008), s > 0 ? 0 : Math.PI, true);
  });
}

/* ═══ tracto: quinta rueda, pasarela, espirales, guardafangos de cuarto y luces ═══ */
function rpzTractoMack(D, P, G){
  var YR = P.YR;
  rpzQuinta(D, P.XT - 0.25, YR, P.ZR + 0.035, '#1A1C1F');
  var tex = rpzTexEstriada('#9AA1A8'); tex.repeat.set(3, 2);
  rpzConTex(D, null, new THREE.BoxGeometry(0.80, 0.03, 1.10), tex, '#C8CDD2', 0.4, 0.7, P.XCB + 0.55, YR + 0.03, 0);
  var xr = P.XCB + 0.38;
  [-0.62, 0.62].forEach(function(z){ D.bloque(null, 0.08, P.YT - YR - 0.40, 0.08, 'pintura', '#1A1C1F', xr, (YR + P.YT - 0.40) / 2, z, 0.015); });
  D.bloque(null, 0.08, 0.08, 1.32, 'pintura', '#1A1C1F', xr, P.YT - 0.40, 0, 0.015);
  rpzEspirales(D, xr + 0.06, P.YT - 0.48, YR + 0.25, ['#C3161B', '#2453A8', '#16181B'], [0.10, 0.25, -0.15]);
  /* guardafangos de cuarto de acero inoxidable sobre el tandem y faldones */
  [-1, 1].forEach(function(s){
    var zc = s * (P.ZO + P.ZI) / 2;
    [P.X1, P.X2].forEach(function(xa, k){
      rpzArcoRueda(D, xa, P.RL, zc, P.RL + 0.11, 0.70, k ? Math.PI * 0.62 : Math.PI * 0.10, k ? Math.PI * 1.00 : Math.PI * 0.45, 'cromo', '#D5D9DD');
    });
    D.tubo(null, [P.XT, 2 * P.RL + 0.06, s * (P.ZR + 0.05)], [P.XT, 2 * P.RL + 0.06, zc], 0.02, 'metal', RPZ_GRIS2, 6);
    D.bloque(null, 0.02, 0.62, 0.62, 'goma', '#121315', P.X2 + P.RL + 0.16, 0.48, zc, 0.01);
    D.bloque(null, 0.04, 0.04, 0.62, 'metal', RPZ_GRIS2, P.X2 + P.RL + 0.16, 0.80, zc, 0.01);
    D.tubo(null, [P.X2 + P.RL + 0.16, 0.80, zc], [P.X2 + P.RL + 0.16, YR - 0.05, s * (P.ZR + 0.05)], 0.02, 'metal', RPZ_GRIS2, 6);
    D.bloque('LSM', 0.03, 0.10, 0.18, 'vidrio', '#C2241B', P.XC + 0.01, YR - 0.10, s * 0.32, 0.006);
  });
}

function rpzConstruirMack(piezas){
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var P = rpzMedidasMack();
  rpzChasisMack(D, P, G, piezas);
  var texNum = rpzCabinaMack(D, P, G);
  rpzFrenteMack(D, P, G);
  rpzTractoMack(D, P, G);
  var caja = new THREE.Box3().setFromObject(G);
  var xc = (caja.min.x + caja.max.x) / 2;
  G.children.forEach(function(m){ m.position.x -= xc; });
  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = 1.6;
  G.userData.dist = 18;
  G.userData.modelo = 'RPZ-CXU613';
  return G;
}

/* ════════════════════════════════════════════════════════════════
   FAMECA: semirremolque cama baja de tres ejes, suelto sobre sus patas
   ════════════════════════════════════════════════════════════════ */
function rpzConstruirCamaBaja(piezas){
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var bl = D.bloque, BL = '#E6E7E3', BL2 = '#C9CBC7', ROJO = '#B3121B', AM = '#E5B81A', NEG = '#1A1C1F';
  var W = 1.30, XG0 = 0, XK = 0.90, XG1 = 3.00, YGb = 1.32, YGt = 1.68;
  var XW0 = XG1 + 0.45, XR = 13.6, YD = 1.30, RL = 0.527, AL = 0.28;
  var ejes = [XR - 1.45 - 2.72, XR - 1.45 - 1.36, XR - 1.45];
  var zO = W - AL / 2 - 0.04, zI = zO - 0.31;

  /* ═══ cuello: placa superior, vigas laterales, frente redondeado y perno rey ═══ */
  var texE = rpzTexEstriada('#D8DAD6'); texE.repeat.set(10, 4);
  rpzConTex(D, null, new THREE.BoxGeometry(XG1 - XG0, 0.04, W * 2 - 0.02), texE, '#FFFFFF', 0.5, 0.35, (XG0 + XG1) / 2, YGt, 0);
  [-1, 1].forEach(function(s){ bl('42023615', XG1 - XG0, YGt - YGb, 0.10, 'pintura', BL, (XG0 + XG1) / 2, (YGb + YGt) / 2, s * (W - 0.05), 0.02); });
  bl('42023615', 0.10, YGt - YGb, W * 2, 'pintura', BL, XG0 + 0.05, (YGb + YGt) / 2, 0, 0.02);
  [-0.48, 0.48].forEach(function(z){ bl('42023615', XG1 - XG0 - 0.1, YGt - YGb, 0.14, 'pintura', BL2, (XG0 + XG1) / 2, (YGb + YGt) / 2, z, 0.015); });
  bl(null, 1.20, 0.03, 1.10, 'metal', '#4A5058', XK, YGb - 0.01, 0, 0.01);
  D.cilindro('PYB', 0.045, 0.045, 0.12, 'metal', '#6E757C', XK, YGb - 0.08, 0, null, 14);
  D.cilindro(null, 0.06, 0.06, 0.02, 'metal', '#6E757C', XK, YGb - 0.14, 0, null, 14);
  /* frente del cuello: cabezas de acople (roja y azul), toma electrica y numero */
  [['#C3161B', 0.28], ['#2453A8', 0.46]].forEach(function(q){
    D.cilindro('LPA', 0.045, 0.045, 0.06, 'metal', q[0], XG0 - 0.03, YGb + 0.18, q[1], [0, 0, Math.PI / 2], 12);
  });
  D.cilindro('HAR', 0.05, 0.05, 0.06, 'mate', NEG, XG0 - 0.03, YGb + 0.18, -0.40, [0, 0, Math.PI / 2], 12);
  var texNum = texNumero3d(null, '#1A1C1F');
  rpzPlano(G, texNum, 0.62, 0.19, XG0 - 0.006, YGb + 0.18, -0.02, -Math.PI / 2, true);
  /* tanques de aire y caja de herramientas bajo el cuello */
  [-0.20, 0.20].forEach(function(z){ D.cilindro('LPA', 0.12, 0.12, 0.90, 'pintura', '#30343A', XG0 + 2.20, YGb - 0.18, z, [0, 0, Math.PI / 2], 18); });
  bl(null, 0.80, 0.42, 0.45, 'pintura', BL2, XG0 + 2.30, YGb - 0.25, -0.85, 0.03);
  bl(null, 0.04, 0.10, 0.10, 'metal', '#8A9097', XG0 + 2.30, YGb - 0.15, -1.08, 0.01);
  /* llanta de repuesto acostada sobre el cuello, con su cadena */
  var rep = new THREE.Group(); rep.position.set(XG0 + 1.00, YGt + 0.16, 0); rep.rotation.x = Math.PI / 2; G.add(rep);
  var repM = new THREE.Mesh(new THREE.TorusGeometry(0.39, 0.14, 14, 36), D.M.goma('#17191C')); rep.add(repM);
  var repA = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.20, 30), D.M.pintura('#C9CED3')); repA.rotation.x = Math.PI / 2; rep.add(repA);
  bl(null, 0.04, 0.04, 1.10, 'metal', '#5E656D', XG0 + 1.00, YGt + 0.33, 0, 0.01);
  /* nombre del fabricante en los costados del cuello */
  var texF = rpzTexLetras('FAMECA', null, '#C3161B', true, 512, 96, 'italic bold ');
  [-1, 1].forEach(function(s){ rpzPlano(G, texF, 0.95, 0.18, XG0 + 1.80, (YGb + YGt) / 2, s * (W + 0.004), s > 0 ? 0 : Math.PI, true); });

  /* ═══ patas de apoyo abajo (el semirremolque esta suelto) con la manivela ═══ */
  var XP = XG0 + 2.65;
  [-1, 1].forEach(function(s){
    bl(null, 0.14, 0.72, 0.14, 'pintura', '#2B2F34', XP, YGb - 0.36, s * 0.85, 0.015);
    bl(null, 0.10, YGb - 0.72 - 0.04, 0.10, 'metal', '#7A8188', XP, (YGb - 0.72 + 0.04) / 2 + 0.02, s * 0.85, 0.01);
    bl(null, 0.30, 0.04, 0.30, 'metal', '#4A5058', XP, 0.02, s * 0.85, 0.01);
    D.tubo(null, [XP - 0.10, YGb - 0.20, s * 0.85], [XP - 0.65, YGb - 0.02, s * 0.45], 0.025, 'metal', '#2B2F34', 8);
  });
  D.tubo(null, [XP, YGb - 0.30, -0.85], [XP, YGb - 0.30, 0.85], 0.02, 'metal', '#6E757C', 6);
  D.tubo(null, [XP, YGb - 0.30, -0.85], [XP, YGb - 0.30, -1.10], 0.018, 'metal', '#6E757C', 6);
  bl(null, 0.03, 0.22, 0.03, 'metal', '#6E757C', XP, YGb - 0.40, -1.10, 0.005);

  /* ═══ bajada del cuello a la plataforma ═══ */
  [-0.48, 0.48].forEach(function(z){
    D.perfil('42023615', [[XG1, YGt], [XG1, YGb], [XW0, YD - 0.52], [XW0 + 0.5, YD - 0.52], [XW0 + 0.5, YD], [XW0, YD]], 0.14, z, 'pintura', BL2, 0.02);
  });
  [-1, 1].forEach(function(s){
    D.perfil('42023615', [[XG1, YGt], [XG1, YGb], [XW0, YD - 0.20], [XW0, YD]], 0.10, s * (W - 0.05), 'pintura', BL, 0.02);
  });
  var lb = Math.hypot(XW0 - XG1, YGt - YD), ab = Math.atan2(YD - YGt, XW0 - XG1);
  var pl = rpzConTex(D, null, new THREE.BoxGeometry(lb, 0.04, W * 2 - 0.02), texE, '#FFFFFF', 0.5, 0.35, (XG1 + XW0) / 2, (YGt + YD) / 2, 0);
  pl.rotation.z = ab;

  /* ═══ plataforma corrida: vigas I, travesanos, largueros laterales y piso estriado ═══ */
  [-0.48, 0.48].forEach(function(z){
    bl('42023615', XR - XW0, 0.50, 0.14, 'pintura', BL2, (XW0 + XR) / 2, YD - 0.27, z, 0.02);
    bl(null, XR - XW0, 0.02, 0.26, 'pintura', BL2, (XW0 + XR) / 2, YD - 0.52, z, 0.006);
  });
  [-1, 1].forEach(function(s){ bl('42023615', XR - XW0, 0.20, 0.12, 'pintura', BL, (XW0 + XR) / 2, YD - 0.12, s * (W - 0.06), 0.02); });
  var tv = [];
  for(var xt = XW0 + 0.3; xt < XR - 0.2; xt += 0.55) tv.push([xt, YD - 0.12, 0]);
  rpzInst(D, '42023615', new THREE.BoxGeometry(0.08, 0.16, W * 2 - 0.14), 'pintura', BL2, tv);
  var texP = rpzTexEstriada('#D8DAD6'); texP.repeat.set((XR - XW0) / 0.5, 5);
  rpzConTex(D, null, new THREE.BoxGeometry(XR - XW0, 0.04, W * 2), texP, '#FFFFFF', 0.5, 0.35, (XW0 + XR) / 2, YD + 0.0, 0);
  /* cajuelas para estacas, argollas de amarre, luces de galibo y cinta reflectiva */
  var caj = [], arg = [], amb = [], cin = [], cinB = [];
  for(var xa = XW0 + 0.6; xa < XR - 0.4; xa += 1.10){
    [-1, 1].forEach(function(s){
      caj.push([xa, YD - 0.10, s * (W + 0.002)]);
      arg.push([xa + 0.40, YD - 0.16, s * (W + 0.03), Math.PI / 2, 0, 0]);
    });
  }
  for(var xl = XW0 + 0.9; xl < XR - 0.5; xl += 2.2){ [-1, 1].forEach(function(s){ amb.push([xl, YD - 0.17, s * (W + 0.006)]); }); }
  for(var xc2 = XW0 + 0.30; xc2 < XR - 0.3; xc2 += 0.60){
    [-1, 1].forEach(function(s){ (Math.round((xc2 - XW0) / 0.6) % 2 ? cinB : cin).push([xc2, YD - 0.04, s * (W + 0.004)]); });
  }
  rpzInst(D, null, new THREE.BoxGeometry(0.14, 0.10, 0.012), 'mate', '#26292D', caj);
  rpzInst(D, null, new THREE.TorusGeometry(0.035, 0.010, 6, 14), 'metal', '#5E656D', arg);
  rpzInst(D, 'LSM', new THREE.BoxGeometry(0.08, 0.05, 0.02), 'vidrio', '#F2A51C', amb);
  rpzInst(D, null, new THREE.BoxGeometry(0.30, 0.05, 0.008), 'mate', '#C62A1E', cin);
  rpzInst(D, null, new THREE.BoxGeometry(0.30, 0.05, 0.008), 'mate', '#F2F2F2', cinB);
  /* cinta del cuello */
  [-1, 1].forEach(function(s){
    for(var c = 0; c < 4; c++) bl(null, 0.30, 0.05, 0.008, 'mate', c % 2 ? '#F2F2F2' : '#C62A1E', XG0 + 0.30 + c * 0.32, YGt - 0.06, s * (W + 0.004), 0.002);
  });

  /* ═══ tres ejes con muelles, balancines y frenos de tambor ═══ */
  var oT = { r: RL, ancho: AL, rAro: 0.286, aro: '#C9CED3', trac: true };
  var n = 1;
  ejes.forEach(function(xe, k){
    D.cilindro(null, 0.07, 0.07, zI * 2 - 0.20, 'pintura', '#2B2F34', xe, RL, 0, [Math.PI / 2, 0, 0], 14);
    [-1, 1].forEach(function(s){
      D.cilindro(s > 0 ? 'BPLH' : 'BPRH', 0.20, 0.20, 0.18, 'metal', '#33373C', xe, RL, s * (zI - 0.17), [Math.PI / 2, 0, 0], 22);
      rpzMuelle(D, '42041233', xe, RL + 0.16, 0.95, 4, s * 0.48, 0.08, 0.04, '#2E3238');
      D.cilindro('42066068', 0.08, 0.08, 0.20, 'pintura', '#202326', xe - 0.22, RL + 0.10, s * 0.66, [0, 0, Math.PI / 2 - 0.25], 14);
      D.tubo('21003297', [xe - 0.32, RL + 0.14, s * 0.66], [xe - 0.40, YD - 0.52, s * 0.48], 0.012, 'goma', '#111', 6);
      /* colgadores y balancin entre ejes */
      if(k < 2) bl(null, 0.16, YD - 0.52 - RL - 0.12, 0.10, 'pintura', '#2B2F34', xe + 0.68, (YD - 0.52 + RL + 0.12) / 2, s * 0.48, 0.015);
      [-0.48, 0.48].forEach(function(dx){ D.cilindro(null, 0.03, 0.03, 0.10, 'metal', RPZ_GRIS, xe + dx, RL + 0.20, s * 0.48, [Math.PI / 2, 0, 0], 10); });
    });
    rpzRueda(D, G, piezas, 'LL' + n++, xe, zO, 1, oT);
    rpzRueda(D, G, piezas, 'LL' + n++, xe, zI, 0, oT);
    rpzRueda(D, G, piezas, 'LL' + n++, xe, -zI, 0, oT);
    rpzRueda(D, G, piezas, 'LL' + n++, xe, -zO, -1, oT);
  });
  [-1, 1].forEach(function(s){
    bl(null, 0.16, YD - 0.52 - RL - 0.12, 0.10, 'pintura', '#2B2F34', ejes[0] - 0.68, (YD - 0.52 + RL + 0.12) / 2, s * 0.48, 0.015);
    /* faldones con su soporte rojo y blanco detras del ultimo eje (como en la foto) */
    var zf = s * (zO + zI) / 2;
    bl(null, 0.02, 0.60, 0.62, 'goma', '#121315', ejes[2] + RL + 0.18, 0.50, zf, 0.01);
    bl(null, 0.06, YD - 0.85, 0.08, 'pintura', ROJO, ejes[2] + RL + 0.20, (YD + 0.80) / 2 - 0.02, zf, 0.01);
    [0, 1].forEach(function(k){ bl(null, 0.06, 0.08, 0.20, 'pintura', ROJO, ejes[k] + 0.68, YD - 0.25, s * (W - 0.02), 0.01); });
  });
  D.tubo('LPA', [XG0 + 2.70, YGb - 0.10, 0.20], [ejes[0], YD - 0.56, 0.30], 0.014, 'goma', '#2E5E9E', 6);
  D.tubo('HAR', [XG0 + 0.30, YGb - 0.04, -0.40], [XR - 0.20, YD - 0.56, -0.30], 0.014, 'goma', '#1B1D20', 6);

  /* ═══ cola: paragolpes, cajas de bisagra amarillas, luces y las rampas
     rojas levantadas, con sus cadenas al piso ═══ */
  bl(null, 0.14, 0.18, W * 2 - 0.10, 'pintura', AM, XR + 0.05, YD - 0.20, 0, 0.03);
  bl(null, 0.12, 0.14, W * 2 - 0.40, 'pintura', BL, XR + 0.10, 0.58, 0, 0.02);
  [-0.80, 0.80].forEach(function(z){ bl(null, 0.08, YD - 0.70, 0.08, 'pintura', BL2, XR + 0.04, (YD + 0.60) / 2 - 0.08, z, 0.01); });
  for(var f2 = 0; f2 < 8; f2++) bl(null, 0.01, 0.10, 0.22, 'mate', f2 % 2 ? '#F2F2F2' : '#C62A1E', XR + 0.165, 0.58, -0.90 + f2 * 0.257, 0.003);
  [-1, 1].forEach(function(s){
    bl(null, 0.06, 0.14, 0.40, 'mate', NEG, XR + 0.10, YD - 0.20, s * 1.05, 0.02);
    rpzLuz(D, s > 0 ? 'FPI' : 'FPD', 0.02, 0.10, 0.14, '#C2241B', XR + 0.135, YD - 0.20, s * 1.13, 0.4);
    rpzLuz(D, s > 0 ? 'FPI' : 'FPD', 0.02, 0.10, 0.12, '#F2A51C', XR + 0.135, YD - 0.20, s * 0.97, 0.4);
  });
  var aR = Math.PI / 2 + 0.22, LR = 2.60, WR = 0.62;
  [-0.78, 0.78].forEach(function(z){
    /* bisagra: cajon amarillo con su pasador */
    bl(null, 0.30, 0.26, WR + 0.08, 'pintura', AM, XR + 0.02, YD + 0.06, z, 0.03);
    D.cilindro('PYB', 0.05, 0.05, WR + 0.12, 'metal', '#5E656D', XR + 0.08, YD + 0.14, z, [Math.PI / 2, 0, 0], 12);
    /* dos canales rojos con travesanos y la cara de pisada */
    var c = Math.cos(aR), sn = Math.sin(aR), cx = XR + 0.08 + c * LR / 2, cy = YD + 0.14 + sn * LR / 2;
    [-1, 1].forEach(function(e){
      var r = bl(null, LR, 0.16, 0.10, 'pintura', ROJO, cx, cy, z + e * (WR / 2 - 0.05), 0.02); r.rotation.z = aR;
    });
    var cara = bl(null, LR - 0.05, 0.03, WR - 0.10, 'pintura', ROJO, cx + sn * 0.06, cy - c * 0.06, z, 0.01); cara.rotation.z = aR;
    var hoy = [];
    for(var t = 0; t < 6; t++){ var fz = (t + 0.7) / 6.5 * LR; hoy.push([XR + 0.08 + c * fz, YD + 0.14 + sn * fz, z + (WR / 2 - 0.05) * (t % 2 ? 1 : -1) * 1.0]); }
    rpzInst(D, null, new THREE.CylinderGeometry(0.03, 0.03, 0.105, 12).rotateX(Math.PI / 2), 'mate', '#3A0A0C', hoy);
    var tac = [];
    for(var tq = 0; tq < 8; tq++){ var fq = (tq + 0.5) / 8 * LR; tac.push([XR + 0.08 + c * fq - sn * 0.09, YD + 0.14 + sn * fq + c * 0.09 * -1, z, 0, 0, aR]); }
    rpzInst(D, null, new THREE.BoxGeometry(0.035, 0.035, WR - 0.12), 'pintura', '#8E0E15', tac);
    /* calcomania reflectiva blanca arriba */
    var ref = bl(null, 0.16, 0.012, WR - 0.14, 'mate', '#F2F2F2', XR + 0.08 + c * (LR - 0.25) - sn * 0.075, YD + 0.14 + sn * (LR - 0.25) + c * 0.075 * -1, z, 0.002);
    ref.rotation.z = aR;
    /* cadena de la rampa al piso */
    var top = [XR + 0.08 + c * (LR - 0.35), YD + 0.14 + sn * (LR - 0.35), z], pie = [XR - 1.30, YD + 0.02, z * 0.75];
    var eslabones = [];
    for(var q = 0; q <= 22; q++){
      var u = q / 22, px = top[0] + (pie[0] - top[0]) * u, py = top[1] + (pie[1] - top[1]) * u - Math.sin(u * Math.PI) * 0.18, pz = top[2] + (pie[2] - top[2]) * u;
      eslabones.push([px, py, pz, 0, q % 2 ? Math.PI / 2 : 0, Math.atan2(pie[1] - top[1], pie[0] - top[0])]);
    }
    rpzInst(D, null, new THREE.TorusGeometry(0.03, 0.008, 6, 10), 'metal', '#3A3F45', eslabones);
  });
  D.letrero(rpzTexLetrero('CARGA ANCHA', '#F2C21A', '#16181B', '#16181B'), 1.10, 0.24, XR + 0.175, 0.86, 0, Math.PI / 2);

  var caja = new THREE.Box3().setFromObject(G);
  var xc = (caja.min.x + caja.max.x) / 2;
  G.children.forEach(function(m){ m.position.x -= xc; });
  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = 1.2;
  G.userData.dist = 30;
  G.userData.modelo = 'RPZ-FAMECA';
  return G;
}

registrarModelo3d({
  nombre: 'Mercedes-Benz Actros 4144K 8x4 volquete y 2640S 6x4 tracto, Mack Pinnacle CXU613, cama baja Fameca',
  clave: function(e){
    var m = mod3d(e), mk = String((e && e.marca) || '').toUpperCase();
    if(/MERCEDES/.test(mk)){
      if(/^ACTROS4144K/.test(m)) return 'RPZ|ACTROS4144K';
      if(/^ACTROS2640S/.test(m)) return 'RPZ|ACTROS2640S';
    }
    if(/^MACK/.test(mk) && /^CXU613/.test(m)) return 'RPZ|CXU613';
    if(/FAMECA/.test(mk) && m === 'STANDARD') return 'RPZ|FAMECA';
    return null;
  },
  construir: function(e, piezas, clave){
    var k = String(clave).replace(/^(R:)?RPZ\|/, '');
    if(k === 'ACTROS4144K') return rpzConstruirMB('V4144', piezas);
    if(k === 'ACTROS2640S') return rpzConstruirMB('T2640', piezas);
    if(k === 'CXU613') return rpzConstruirMack(piezas);
    return rpzConstruirCamaBaja(piezas);
  }
});
