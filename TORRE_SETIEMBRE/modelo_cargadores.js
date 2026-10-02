/* ══════════════════════════════════════════════════════════════════
   CARGADORES — modelos de detalle de los cargadores frontales y los
   minicargadores de la flota:
     CAT 992K (C-66) · CAT 966 de la nueva generacion (966NG, C-368-AL)
     Volvo L150H (C-376-AL) y L180H (C-362-AL…) · Bobcat S570 (MC-22-AL…)
     y S650 (MC-21-AL)

   Todos con el frente hacia -X, arriba +Y y la izquierda del operador +Z.
   Los cargadores son articulados: el bastidor delantero lleva el brazo, los
   cilindros y el cucharon; el trasero la cabina, el motor y el contrapeso.
   Las llantas siguen la numeracion de SAP: LL1 delantera izquierda, LL2
   delantera derecha, LL3 trasera izquierda, LL4 trasera derecha.

   Codigos SAP que se ponen en las piezas: CBN cabina, ENG1 capot del motor,
   RAD1 rejilla del radiador, TRM transmision, CON convertidor, DIFD/DIFP
   diferenciales, BMLH/BMRH y BPLH/BPRH bocamazas, DLH/DRH y MLH/MRH mandos
   finales, LPN cucharon, GET cuchilla y dientes, PVL cilindro de volteo,
   PHY cilindro de levante izquierdo (no hay codigo propio) y HRH el derecho,
   SLH/SRH cilindros de direccion, PYB pines del brazo y la articulacion,
   TQC1/TQH1 tanques, BAT baterias, LSM/FDI/FDD/FPI/FPD luces, CIR circulina,
   AAC aire acondicionado, 42023615 bastidores, LPH mangueras, TML motor de
   traslacion izquierdo (solo en los Bobcat: en un cargador articulado no
   hay pieza que le corresponda y por eso el TML del L180H queda fuera).
   ══════════════════════════════════════════════════════════════════ */
var CRG_CAT = '#DE9A08', CRG_CAT2 = '#A87405', CRG_NEGRO = '#1B1D20', CRG_GRIS = '#3B4148', CRG_GRIS2 = '#5B636C',
    CRG_PERNO = '#4A4F55', CRG_VOL = '#EBA000', CRG_VOL2 = '#AD7600', CRG_VOLGR = '#1F2225', CRG_NARANJA = '#E0581A',
    CRG_BOB_BL = '#E8E8E3', CRG_BOB_NE = '#18191B', CRG_BOB_NA = '#E5461C';

/* ═══ utilidades ═══ */

/* punto a la fraccion t entre a y b (plano XY) */
function crgEn(a, b, t){ return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
/* p corrido d metros en perpendicular al tramo a-b (positivo hacia arriba) */
function crgNormal(a, b, p, d){
  var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  if(ny < 0){ nx = -nx; ny = -ny; }
  return [p[0] + nx * d, p[1] + ny * d];
}
/* poligonal gruesa: el contorno cerrado de una linea con un alto en cada vertice
   (asi salen los brazos curvos de una sola pieza, no de cajas sueltas) */
function crgPoli(pts, altos){
  var arr = [], abj = [];
  for(var i = 0; i < pts.length; i++){
    var a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    var tx = b[0] - a[0], ty = b[1] - a[1], L = Math.hypot(tx, ty), nx = -ty / L, ny = tx / L, h = altos[i] / 2;
    arr.push([pts[i][0] + nx * h, pts[i][1] + ny * h]);
    abj.push([pts[i][0] - nx * h, pts[i][1] - ny * h]);
  }
  return arr.concat(abj.reverse());
}
/* viga de seccion rectangular entre dos puntos del plano XY a la altura z */
function crgViga(D, code, a, b, z, ancho, alto, tipo, hex, r){
  var dx = b[0] - a[0], dy = b[1] - a[1];
  return D.bloque(code, Math.hypot(dx, dy), alto, ancho, tipo, hex, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z,
    r === undefined ? Math.min(0.03, alto * 0.2, ancho * 0.2) : r, [0, 0, Math.atan2(dy, dx)]);
}
/* arco (guardabarros) alrededor de (x, y): anillo entre rIn y rOut, de a0 a a1
   (angulos desde +X, o sea desde atras), extruido a lo ancho en Z */
function crgArco(D, code, x, y, rIn, rOut, a0, a1, zc, ancho, tipo, hex){
  var pts = [], n = 22, i, t;
  for(i = 0; i <= n; i++){ t = a0 + (a1 - a0) * i / n; pts.push([x + Math.cos(t) * rOut, y + Math.sin(t) * rOut]); }
  for(i = n; i >= 0; i--){ t = a0 + (a1 - a0) * i / n; pts.push([x + Math.cos(t) * rIn, y + Math.sin(t) * rIn]); }
  return D.perfil(code, pts, ancho, zc, tipo, hex, 0.025);
}
/* perno con su buje: el ojo del color de la maquina y el pasador de acero que asoma */
function crgPerno(D, code, p, z, r, largo, hex){
  D.cilindro(null, r, r, largo, 'pintura', hex, p[0], p[1], z, [Math.PI / 2, 0, 0], 24);
  D.cilindro(code, r * 0.52, r * 0.52, largo + 0.06, 'metal', CRG_PERNO, p[0], p[1], z, [Math.PI / 2, 0, 0], 14);
}
/* escalerilla vertical; eje 'x': peldanos a lo largo de X (se sube mirando a ±Z),
   eje 'z': peldanos a lo ancho (se sube mirando a ±X) */
function crgEscalerilla(D, x, z, y0, y1, ancho, eje, hexL, hexP){
  var n = Math.max(2, Math.round((y1 - y0) / 0.30));
  [-1, 1].forEach(function(s){
    if(eje === 'x') D.bloque(null, 0.06, y1 - y0, 0.05, 'pintura', hexL, x + s * ancho / 2, (y0 + y1) / 2, z, 0.015);
    else D.bloque(null, 0.05, y1 - y0, 0.06, 'pintura', hexL, x, (y0 + y1) / 2, z + s * ancho / 2, 0.015);
  });
  for(var i = 1; i <= n; i++){
    var y = y0 + (y1 - y0) * i / n - 0.03;
    if(eje === 'x') D.bloque(null, ancho - 0.03, 0.035, 0.16, 'metal', hexP, x, y, z, 0.008);
    else D.bloque(null, 0.16, 0.035, ancho - 0.03, 'metal', hexP, x, y, z, 0.008);
  }
}
/* escalera inclinada en el plano XY (a abajo, b arriba) con largueros, peldanos
   de rejilla y pasamanos a los dos lados */
function crgEscaleraInc(D, a, b, z, ancho, hexL, hexP, hexB){
  var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ang = Math.atan2(dy, dx);
  [-1, 1].forEach(function(s){
    D.bloque(null, L, 0.22, 0.05, 'pintura', hexL, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z + s * ancho / 2, 0.015, [0, 0, ang]);
    if(!hexB) return;
    var zz = z + s * (ancho / 2 + 0.03);
    [a, b].forEach(function(p){ D.tubo(null, [p[0], p[1] + 0.05, zz], [p[0], p[1] + 1.0, zz], 0.026, 'pintura', hexB, 10); });
    D.tubo(null, [a[0], a[1] + 1.0, zz], [b[0], b[1] + 1.0, zz], 0.026, 'pintura', hexB, 10);
    D.tubo(null, [a[0], a[1] + 0.52, zz], [b[0], b[1] + 0.52, zz], 0.02, 'pintura', hexB, 10);
  });
  var n = Math.max(2, Math.round(Math.abs(dy) / 0.24));
  for(var i = 1; i < n; i++){
    var f = i / n;
    D.bloque(null, 0.26, 0.035, ancho - 0.04, 'metal', hexP, a[0] + dx * f, a[1] + dy * f + 0.05, z, 0.008);
  }
}
/* luz rectangular: caja negra y mica; s = -1 mira al frente, +1 atras */
function crgLuz(D, code, x, y, z, s, w, h, mica){
  D.bloque(null, 0.10, h + 0.05, w + 0.05, 'mate', '#202327', x, y, z, 0.02);
  D.bloque(code, 0.03, h, w, 'vidrio', mica || '#F4EDCF', x + s * 0.055, y, z, 0.008);
}
/* circulina ambar que brilla un poco */
function crgBaliza(D, G, x, y, z, r){
  r = r || 0.07;
  D.cilindro(null, r * 1.15, r * 1.25, 0.05, 'mate', '#202327', x, y + 0.025, z, null, 16);
  var b = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.85, r, r * 1.9, 16),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.45, roughness: 0.3 }));
  b.position.set(x, y + 0.05 + r * 0.95, z);
  D.reg('CIR', b, '#F0A41C');
}
/* rejilla de malla (barras finas en dos sentidos) sobre un plano z = cte, una sola malla */
function crgMalla(D, x0, x1, y0, y1, z, paso, hex, grosor){
  var g = grosor || 0.012, nx = Math.max(1, Math.round((x1 - x0) / paso)), ny = Math.max(1, Math.round((y1 - y0) / paso));
  var inst = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), D.M.mate(hex), nx + ny + 2);
  var d = new THREE.Object3D(), k = 0, i;
  for(i = 0; i <= nx; i++){ d.position.set(x0 + (x1 - x0) * i / nx, (y0 + y1) / 2, z); d.scale.set(g, y1 - y0, g); d.updateMatrix(); inst.setMatrixAt(k++, d.matrix); }
  for(i = 0; i <= ny; i++){ d.position.set((x0 + x1) / 2, y0 + (y1 - y0) * i / ny, z); d.scale.set(x1 - x0, g, g); d.updateMatrix(); inst.setMatrixAt(k++, d.matrix); }
  D.reg(null, inst, hex);
  return inst;
}
/* lamas horizontales en un costado (cara que mira a ±Z): rejillas de enfriamiento laterales */
function crgLamasZ(D, code, x0, x1, y0, y1, z, s, n, hexMarco){
  D.bloque(code, x1 - x0 + 0.08, y1 - y0 + 0.08, 0.05, 'mate', hexMarco, (x0 + x1) / 2, (y0 + y1) / 2, z, 0.015);
  var paso = (y1 - y0) / n, inst = new THREE.InstancedMesh(new THREE.BoxGeometry(x1 - x0, paso * 0.62, 0.035), D.M.mate('#0B0C0E'), n);
  var d = new THREE.Object3D();
  for(var i = 0; i < n; i++){
    d.position.set((x0 + x1) / 2, y0 + paso * (i + 0.5), z + s * 0.03); d.rotation.set(-s * 0.55, 0, 0);
    d.updateMatrix(); inst.setMatrixAt(i, d.matrix);
  }
  D.reg(null, inst, '#0B0C0E');
}

/* ═══ rotulos (lienzos dibujados) ═══ */

/* el CAT de Caterpillar: letras blancas y el triangulo amarillo bajo la A */
function crgLetrasCAT(g, x, y, alto, tinta){
  g.font = 'bold ' + Math.round(alto) + 'px "Arial Black", Arial, sans-serif';
  g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  g.fillStyle = tinta || '#FFFFFF';
  g.fillText('CAT', x, y);
  var wC = g.measureText('C').width, wA = g.measureText('A').width, xa = x + wC + wA / 2;
  g.fillStyle = CRG_CAT;
  g.beginPath(); g.moveTo(xa - wA * 0.20, y); g.lineTo(xa + wA * 0.20, y); g.lineTo(xa, y - alto * 0.30); g.closePath(); g.fill();
  return g.measureText('CAT').width;
}
/* franja negra del 992K: modelo a la izquierda, el corte rojo y CAT grande */
function crgRotulo992(g, w, h){
  g.fillStyle = CRG_NEGRO; g.fillRect(0, 0, w, h);
  g.fillStyle = '#D52B1E';
  g.beginPath(); g.moveTo(w * 0.05, h); g.lineTo(w * 0.15, 0); g.lineTo(w * 0.19, 0); g.lineTo(w * 0.09, h); g.closePath(); g.fill();
  g.fillStyle = '#FFFFFF'; g.textBaseline = 'middle'; g.textAlign = 'left';
  g.font = 'bold ' + Math.round(h * 0.34) + 'px Arial, sans-serif';
  g.fillText('992K', w * 0.02, h * 0.24);
  crgLetrasCAT(g, w * 0.48, h * 0.86, h * 0.80);
}
/* placa del 966: CAT con el filo rojo y el modelo en blanco */
function crgRotulo966(g, w, h){
  g.fillStyle = CRG_CAT; g.fillRect(0, 0, w, h);
  g.fillStyle = CRG_NEGRO;
  g.beginPath(); g.moveTo(0, h * 0.08); g.lineTo(w * 0.60, h * 0.08); g.lineTo(w * 0.66, h * 0.50); g.lineTo(w * 0.60, h * 0.92); g.lineTo(0, h * 0.92); g.closePath(); g.fill();
  g.fillStyle = '#D52B1E';
  g.beginPath(); g.moveTo(w * 0.61, h * 0.08); g.lineTo(w * 0.645, h * 0.08); g.lineTo(w * 0.705, h * 0.50); g.lineTo(w * 0.645, h * 0.92); g.lineTo(w * 0.61, h * 0.92); g.lineTo(w * 0.67, h * 0.50); g.closePath(); g.fill();
  crgLetrasCAT(g, w * 0.05, h * 0.80, h * 0.70);
  g.fillStyle = CRG_NEGRO; g.fillRect(w * 0.74, h * 0.22, w * 0.25, h * 0.56);
  g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold ' + Math.round(h * 0.42) + 'px Arial, sans-serif';
  g.fillText('966', w * 0.865, h * 0.52);
}
/* VOLVO en letras con serifa, separadas, sobre la franja oscura */
function crgRotuloVolvo(fondo, tinta){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.78) + 'px "Times New Roman", Georgia, serif';
    var L = 'VOLVO';
    for(var i = 0; i < 5; i++) g.fillText(L[i], w * (0.12 + i * 0.19), h * 0.55);
  };
}
/* la marca de hierro de Volvo: circulo con la flecha y la banda diagonal */
function crgRotuloHierro(g, w, h){
  g.fillStyle = '#121315'; g.fillRect(0, 0, w, h);
  var cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.30;
  g.strokeStyle = '#C9CED3'; g.lineWidth = r * 0.22;
  g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke();
  g.fillStyle = '#C9CED3';
  g.save(); g.translate(cx, cy); g.rotate(-Math.PI / 4);
  g.beginPath(); g.moveTo(r * 0.95, -r * 0.20); g.lineTo(r * 1.55, 0); g.lineTo(r * 0.95, r * 0.20); g.closePath(); g.fill();
  g.restore();
  g.save(); g.translate(cx, cy); g.rotate(-0.42);
  g.fillRect(-r * 1.6, -r * 0.22, r * 3.2, r * 0.44);
  g.fillStyle = '#121315'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold ' + Math.round(r * 0.36) + 'px "Times New Roman", serif';
  g.fillText('V O L V O', 0, r * 0.02);
  g.restore();
}
/* texto vertical (el modelo en el panel negro de la cola del Volvo) */
function crgRotuloVertical(txt, fondo, tinta){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    g.save(); g.translate(w / 2, h / 2); g.rotate(-Math.PI / 2);
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(w * 0.62) + 'px "Arial Narrow", Arial, sans-serif';
    g.fillText(txt, 0, 0, h * 0.92);
    g.restore();
  };
}
/* el logo de Bobcat: placa naranja con la cabeza de gato y Bobcat en blanco */
function crgRotuloBobcat(g, w, h){
  g.fillStyle = CRG_BOB_BL; g.fillRect(0, 0, w, h);
  var r = h * 0.22;
  g.fillStyle = CRG_BOB_NA;
  g.beginPath(); g.moveTo(r, h * 0.06); g.lineTo(w - r, h * 0.06); g.quadraticCurveTo(w, h * 0.06, w, h * 0.06 + r);
  g.lineTo(w, h * 0.94 - r); g.quadraticCurveTo(w, h * 0.94, w - r, h * 0.94); g.lineTo(r, h * 0.94);
  g.quadraticCurveTo(0, h * 0.94, 0, h * 0.94 - r); g.lineTo(0, h * 0.06 + r); g.quadraticCurveTo(0, h * 0.06, r, h * 0.06); g.fill();
  /* cabeza: orejas en punta y cara */
  var cx = w * 0.13, cy = h * 0.52, s = h * 0.30;
  g.fillStyle = '#FFFFFF';
  g.beginPath(); g.moveTo(cx - s, cy - s * 0.2); g.lineTo(cx - s * 0.75, cy - s * 1.05); g.lineTo(cx - s * 0.25, cy - s * 0.55);
  g.lineTo(cx + s * 0.25, cy - s * 0.55); g.lineTo(cx + s * 0.75, cy - s * 1.05); g.lineTo(cx + s, cy - s * 0.2);
  g.lineTo(cx + s * 0.6, cy + s * 0.75); g.lineTo(cx, cy + s); g.lineTo(cx - s * 0.6, cy + s * 0.75); g.closePath(); g.fill();
  g.fillStyle = CRG_BOB_NA;
  [-1, 1].forEach(function(k){ g.beginPath(); g.ellipse(cx + k * s * 0.38, cy - s * 0.05, s * 0.14, s * 0.09, 0, 0, Math.PI * 2); g.fill(); });
  g.fillStyle = '#FFFFFF'; g.textAlign = 'left'; g.textBaseline = 'middle';
  g.font = 'italic bold ' + Math.round(h * 0.62) + 'px "Arial Black", Arial, sans-serif';
  g.fillText('Bobcat', w * 0.27, h * 0.54, w * 0.70);
}
/* placa de la cola del Bobcat: roja con el modelo en un recuadro negro */
function crgRotuloModeloBob(txt){
  return function(g, w, h){
    g.fillStyle = CRG_BOB_NA; g.fillRect(0, 0, w, h);
    g.fillStyle = CRG_BOB_NE; g.fillRect(w * 0.08, h * 0.25, w * 0.84, h * 0.50);
    g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.36) + 'px "Arial Narrow", Arial, sans-serif';
    g.fillText(txt, w / 2, h * 0.52, w * 0.78);
  };
}

/* ═══ conjuntos comunes ═══ */

/* cabina con base, postes (los del frente siguen el parabrisas inclinado),
   vidrios con marco, techo con alero, puerta, asiento, volante, espejos,
   limpiaparabrisas, faros de techo y circulina.
   o: x0 frente arriba, x1 atras, z0 z1, y0 piso, yV pie de los vidrios, y1 techo,
      inc adelanto del pie del parabrisas, base/marco/techo colores, puerta (+1/-1),
      xPuerta (poste de la puerta), malla (rejilla en los vidrios laterales) */
function crgCabina(D, G, o){
  var inc = o.inc || 0, hT = o.hT || 0.16, cz = (o.z0 + o.z1) / 2, d = o.z1 - o.z0, e = o.poste || 0.10;
  var xa = o.x0 - inc, yA = o.yV, yB = o.y1 - hT, vidH = o.vidrio || '#0C131B';
  /* base hasta el pie de los vidrios */
  D.bloque('CBN', o.x1 - xa, yA - o.y0, d, 'pintura', o.base, (xa + o.x1) / 2, (o.y0 + yA) / 2, cz, 0.05);
  /* techo con alero adelante */
  D.bloque('CBN', o.x1 - o.x0 + 0.18, hT, d + 0.12, 'pintura', o.techo, (o.x0 + o.x1) / 2 - 0.05, o.y1 - hT / 2, cz, 0.05);
  D.bloque(null, o.x1 - o.x0 - 0.30, 0.05, d - 0.30, 'mate', o.techo2 || o.techo, (o.x0 + o.x1) / 2 + 0.05, o.y1 + 0.02, cz, 0.02);
  /* postes y travesanos */
  [o.z0 + e / 2, o.z1 - e / 2].forEach(function(z){
    crgViga(D, 'CBN', [xa + e / 2, yA], [o.x0 + e / 2, yB], z, e, e, 'pintura', o.marco);
    D.bloque('CBN', e, yB - yA, e, 'pintura', o.marco, o.x1 - e / 2, (yA + yB) / 2, z, 0.025);
    if(o.xPuerta) D.bloque(null, e * 0.7, yB - yA, e * 0.8, 'pintura', o.marco, o.xPuerta, (yA + yB) / 2, z, 0.02);
    D.bloque(null, o.x1 - xa, 0.06, e * 0.9, 'pintura', o.marco, (xa + o.x1) / 2, yA + 0.03, z, 0.02);
  });
  D.bloque(null, e, 0.06, d, 'pintura', o.marco, o.x1 - e / 2, yA + 0.03, cz, 0.02);
  /* vidrios: laterales trapecio, parabrisas inclinado, luneta */
  [o.z0 + 0.025, o.z1 - 0.025].forEach(function(z){
    D.perfil(null, [[xa + e, yA + 0.06], [o.x1 - e, yA + 0.06], [o.x1 - e, yB - 0.02], [o.x0 + e, yB - 0.02]], 0.02, z, 'vidrio', vidH, 0.004);
    if(o.malla) crgMalla(D, xa + e + 0.06, o.x1 - e - 0.04, yA + 0.10, yB - 0.06, z + (z > cz ? 0.02 : -0.02), 0.09, '#0E0F11', 0.010);
  });
  crgViga(D, null, [xa + 0.03, yA + 0.05], [o.x0 + 0.03, yB - 0.02], cz, d - 2 * e + 0.02, 0.02, 'vidrio', vidH, 0.004);
  D.bloque(null, 0.02, yB - yA - 0.10, d - 2 * e + 0.02, 'vidrio', vidH, o.x1 - 0.02, (yA + yB) / 2 + 0.03, cz, 0.004);
  /* puerta: canto, bisagras y manija */
  if(o.puerta){
    var zp = o.puerta > 0 ? o.z1 + 0.012 : o.z0 - 0.012, xq = o.xPuerta || (o.x0 + o.x1) / 2;
    D.bloque(null, 0.12, 0.04, 0.035, 'cromo', null, xq + 0.10, yA + 0.30, zp, 0.01);
    [yA + 0.25, yB - 0.25].forEach(function(y){ D.bloque(null, 0.05, 0.10, 0.03, 'mate', '#202327', (o.xPuerta ? o.x0 : xq) + 0.08, y, zp, 0.01); });
    /* pasamanos a los lados de la puerta */
    if(o.asideros) [o.x0 + 0.02, o.x1 - 0.04].forEach(function(x){
      D.tubo(null, [x, o.y0 + 0.15, zp + o.puerta * 0.08], [x, yB - 0.20, zp + o.puerta * 0.08], 0.018, 'pintura', o.asideros, 10);
    });
  }
  /* asiento, consola y volante (se ven por el vidrio) */
  var xs = o.x1 - (o.x1 - o.x0) * 0.32, ys = o.y0 + (o.asiento || 0.45);
  D.bloque(null, 0.50, 0.12, 0.52, 'mate', '#26292D', xs, ys, cz, 0.04);
  D.bloque(null, 0.12, 0.62, 0.50, 'mate', '#26292D', xs + 0.24, ys + 0.34, cz, 0.04);
  D.bloque(null, 0.30, ys - o.y0, 0.30, 'mate', '#3A3E43', xs, (o.y0 + ys) / 2, cz, 0.03);
  if(o.volante !== false){
    var xv = xa + (o.x1 - xa) * 0.30;
    D.tubo(null, [xv, o.y0 + 0.10, cz], [xv - 0.10, ys + 0.42, cz], 0.035, 'mate', '#202327', 10);
    D.pon(null, new THREE.TorusGeometry(0.17, 0.02, 8, 24), 'mate', '#141517', xv - 0.04, ys + 0.48, cz, [0, Math.PI / 2, -0.6]);
  }
  /* limpiaparabrisas */
  D.tubo(null, [xa - 0.01, yA + 0.12, cz - 0.20], [o.x0 - 0.02 - inc * 0.4, yA + (yB - yA) * 0.62, cz + 0.12], 0.010, 'mate', '#111214', 6);
  /* espejos en brazos */
  if(o.espejos){
    [-1, 1].forEach(function(s){
      var zb = s > 0 ? o.z1 : o.z0, ye = yA + (yB - yA) * 0.75;
      D.tubo(null, [o.x0 + 0.02, ye, zb], [o.x0 - 0.20, ye + 0.05, zb + s * 0.32], 0.018, 'mate', '#202327', 8);
      D.bloque(null, 0.06, 0.34, 0.20, 'mate', '#17191C', o.x0 - 0.22, ye + 0.05, zb + s * 0.38, 0.02);
      D.bloque(null, 0.015, 0.30, 0.16, 'cromo', null, o.x0 - 0.255, ye + 0.05, zb + s * 0.38, 0.005);
    });
  }
  /* faros de trabajo en el techo: delanteros (FDI izquierda, FDD derecha) y traseros */
  if(o.faros !== false){
    [-1, 1].forEach(function(s){
      var z = cz + s * (d / 2 - 0.20);
      crgLuz(D, s > 0 ? 'FDI' : 'FDD', o.x0 - 0.14, o.y1 - hT / 2, z, -1, 0.20, 0.10);
      crgLuz(D, s > 0 ? 'FPI' : 'FPD', o.x1 + 0.12, o.y1 - hT / 2, z, 1, 0.20, 0.10);
    });
  }
  if(o.baliza) crgBaliza(D, G, o.baliza[0], o.y1 + 0.04, o.baliza[1]);
}

/* cucharon: costados con su perfil, piso, talon redondeado, espalda, techo
   con guarda de derrame, cuchilla, dientes o cuchilla empernada y orejas.
   o: xe (filo, X), Dp (fondo), H (alto), ancho, col, B y Q (pines), zB (orejas
   del brazo), zQ (orejas del eslabon), dientes (n), lDiente, colDiente */
function crgCucharon(D, o){
  var X = function(u){ return o.xe + u; }, Dp = o.Dp, H = o.H, hw = o.ancho / 2, esp = o.esp || 0.06, c = o.col;
  var lado = [[0, 0.02], [Dp - 0.22 * H, 0], [Dp - 0.05 * H, 0.10 * H], [Dp, 0.26 * H], [Dp, H * 0.86], [Dp - 0.08 * H, H],
              [Dp * 0.42, H], [Dp * 0.30, H * 0.94], [0.02, 0.10 * H]];
  [-1, 1].forEach(function(s){
    D.perfil('LPN', lado.map(function(p){ return [X(p[0]), p[1]]; }), esp * 1.3, s * (hw - esp * 0.65), 'pintura', c, 0.02);
    /* cuchilla lateral y su refuerzo */
    D.perfil('GET', [[X(-0.02), 0.0], [X(Dp * 0.45), 0.0], [X(Dp * 0.45), 0.07 * H], [X(0.02), 0.16 * H]], esp * 1.8, s * (hw + esp * 0.4), 'metal', o.colDiente || '#4A4E54', 0.015);
  });
  var wi = o.ancho - esp * 2.4;
  /* piso, talon, espalda, techo y guarda */
  var tramos = [[[0.10, 0.03], [Dp - 0.22 * H, 0.02]], [[Dp - 0.22 * H, 0.02], [Dp - 0.04 * H, 0.11 * H]], [[Dp - 0.04 * H, 0.11 * H], [Dp - 0.005, 0.28 * H]],
                [[Dp - 0.005, 0.28 * H], [Dp - 0.005, 0.86 * H]], [[Dp - 0.005, 0.86 * H], [Dp - 0.08 * H, H - 0.02]], [[Dp - 0.08 * H, H - 0.02], [Dp * 0.40, H - 0.02]]];
  tramos.forEach(function(t){ crgViga(D, 'LPN', [X(t[0][0]), t[0][1]], [X(t[1][0]), t[1][1]], 0, wi, esp, 'pintura', c, 0.015); });
  crgViga(D, 'LPN', [X(Dp * 0.42), H - 0.02], [X(Dp * 0.28), H + 0.16 * H], 0, wi, esp, 'pintura', c, 0.015);
  /* nervios de la espalda y planchas de desgaste bajo el piso */
  for(var k = -2; k <= 2; k++){
    D.perfil(null, [[X(Dp), 0.30 * H], [X(Dp + 0.08), 0.32 * H], [X(Dp + 0.08), 0.84 * H], [X(Dp), 0.86 * H]], 0.06, k * hw * 0.42, 'pintura', o.col2 || c, 0.01);
  }
  for(var w = -1; w <= 1; w++) D.bloque('GET', Dp * 0.55, 0.03, 0.16, 'metal', '#4A4E54', X(Dp * 0.45), -0.005 + 0.02, w * hw * 0.6, 0.008);
  /* cuchilla de filo: mas gruesa que el piso */
  D.bloque('GET', 0.26, 0.07, o.ancho - 0.02, 'metal', o.colDiente || '#4A4E54', X(0.11), 0.04, 0, 0.012);
  if(o.dientes){
    /* adaptadores soldados y puntas: dos mallas instanciadas */
    var n = o.dientes, lD = o.lDiente || 0.32, hD = Math.max(0.08, lD * 0.32), wD = Math.min(0.24, wi / n * 0.55);
    var gP = new THREE.BoxGeometry(lD, hD, wD), pos = gP.attributes.position;
    for(var v = 0; v < pos.count; v++) if(pos.getX(v) < 0){ pos.setY(v, pos.getY(v) * 0.30 - hD * 0.25); pos.setZ(v, pos.getZ(v) * 0.70); }
    gP.computeVertexNormals();
    var gA = new THREE.BoxGeometry(lD * 0.9, hD * 1.1, wD * 1.1);
    var iP = new THREE.InstancedMesh(gP, D.M.metal(o.colDiente || '#5A5E63'), n), iA = new THREE.InstancedMesh(gA, D.M.pintura(o.col2 || c), n);
    var d = new THREE.Object3D();
    for(var i = 0; i < n; i++){
      var z = -wi / 2 + wD + (wi - 2 * wD) * i / (n - 1);
      d.position.set(X(-lD / 2 + 0.06), hD * 0.55, z); d.updateMatrix(); iP.setMatrixAt(i, d.matrix);
      d.position.set(X(lD * 0.45 + 0.04), hD * 0.62, z); d.updateMatrix(); iA.setMatrixAt(i, d.matrix);
    }
    D.reg('GET', iP, o.colDiente || '#5A5E63'); D.reg('GET', iA, o.col2 || c);
  } else {
    /* cuchilla empernada: segmentos con su fila de pernos */
    var nS = Math.max(3, Math.round(o.ancho / 0.6));
    for(var sg = 0; sg < nS; sg++){
      var zs = -o.ancho / 2 + (sg + 0.5) * o.ancho / nS;
      D.bloque('GET', 0.18, 0.05, o.ancho / nS - 0.02, 'metal', '#34383D', X(-0.06), 0.035, zs, 0.01);
    }
    var nb = nS * 3, ib = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 6), D.M.metal('#8A8C8E'), nb), db = new THREE.Object3D();
    for(var b = 0; b < nb; b++){ db.position.set(X(0.12), 0.08, -o.ancho / 2 + (b + 0.5) * o.ancho / nb); db.updateMatrix(); ib.setMatrixAt(b, db.matrix); }
    D.reg(null, ib, '#8A8C8E');
  }
  /* orejas para los pines del brazo (B) y del eslabon (Q) */
  if(o.B){
    var oreja = function(p, z, r){
      D.perfil(null, [[X(Dp) - 0.02, p[1] - r * 2.4], [p[0] + r * 0.2, p[1] - r * 1.2], [p[0] + r * 1.2, p[1]], [p[0] + r * 0.2, p[1] + r * 1.2], [X(Dp) - 0.02, p[1] + r * 2.4]],
        0.07, z, 'pintura', c, 0.015);
    };
    [-1, 1].forEach(function(s){
      [-1, 1].forEach(function(t){ oreja(o.B, s * o.zB + t * o.eB, o.rB); });
      oreja(o.Q, s * o.zQ, o.rQ);
    });
  }
}

/* brazo de levante con varillaje en Z (CAT) o TP (Volvo): dos brazos, tubo
   transversal, palanca al centro, eslabon al cucharon, cilindro de volteo
   arriba al centro y dos cilindros de levante.
   P: A pivote, K codo, B pin del cucharon, zBr, eBr, hBr [A,K,B], col, colCil,
      L pivote de la palanca, T y U puntas, Q pin del eslabon, dzP (media
      separacion de las chapas de la palanca), C0 base del volteo, rV,
      L0 base del levante, L1 vastago del levante, rL, zL */
function crgVarillaje(D, P){
  var c = P.col, c2 = P.col2 || c, rP = P.rPerno || 0.14;
  [-1, 1].forEach(function(s){
    var z = s * P.zBr;
    D.perfil(null, crgPoli([P.A, P.K, P.B], P.hBr), P.eBr, z, 'pintura', c, 0.03);
    /* chapa de refuerzo sobre el codo */
    D.perfil(null, crgPoli([crgEn(P.A, P.K, 0.55), P.K, crgEn(P.K, P.B, 0.35)], [P.hBr[1] * 0.70, P.hBr[1] * 0.75, P.hBr[2] * 0.70]),
      0.03, z + s * (P.eBr / 2 + 0.012), 'pintura', c2, 0.008);
    crgPerno(D, 'PYB', P.A, z, rP * 1.25, P.eBr + 0.14, c);
    crgPerno(D, 'PYB', P.B, z, rP * 1.10, P.eBr + 0.10, c);
    /* cilindro de levante: base en el bastidor, vastago al brazo */
    D.cilHidD(s > 0 ? 'PHY' : 'HRH', [P.L0[0], P.L0[1], s * P.zL], [P.L1[0], P.L1[1], s * P.zL], P.rL, P.colCil, 0.58);
    crgPerno(D, 'PYB', P.L1, s * P.zL, P.rL * 1.1, P.rL * 2.6, c);
    crgPerno(D, null, P.L0, s * P.zL, P.rL * 1.1, P.rL * 2.6, c2);
  });
  /* tubo transversal entre los brazos, en el pivote de la palanca */
  D.cilindro(null, P.rTubo || rP * 1.3, P.rTubo || rP * 1.3, 2 * P.zBr, 'pintura', c, P.L[0], P.L[1], 0, [Math.PI / 2, 0, 0], 26);
  /* palanca: dos chapas T-L-U */
  [-1, 1].forEach(function(s){
    D.perfil(null, crgPoli([P.T, P.L, P.U], [P.hP * 0.8, P.hP * 1.15, P.hP * 0.8]), 0.08, s * P.dzP, 'pintura', c, 0.02);
  });
  [P.T, P.L, P.U].forEach(function(p, i){ crgPerno(D, i === 1 ? 'PYB' : null, p, 0, P.hP * 0.42, 2 * P.dzP + 0.12, c); });
  /* eslabon de volteo, entre las chapas, hasta el cucharon */
  D.perfil(null, crgPoli([P.U, P.Q], [P.hP * 0.55, P.hP * 0.55]), 2 * P.dzP - 0.10, 0, 'pintura', c2, 0.02);
  crgPerno(D, 'PYB', P.Q, 0, P.hP * 0.30, 2 * P.zQ + 0.16, c);
  /* cilindro de volteo al centro, de la torre a la punta de la palanca */
  D.cilHidD('PVL', [P.C0[0], P.C0[1], 0], [P.T[0], P.T[1], 0], P.rV, P.colCil, 0.60);
  crgPerno(D, null, P.C0, 0, P.rV * 1.1, P.rV * 2.6, c2);
  /* mangueras del volteo y del levante */
  [-1, 1].forEach(function(s){
    D.tubo('LPH', [P.C0[0] - 0.05, P.C0[1] - 0.20, s * 0.20], [crgEn(P.C0, P.T, 0.35)[0], crgEn(P.C0, P.T, 0.35)[1] - P.rV, s * 0.16], 0.03, 'goma', '#202326', 8);
    D.tubo('LPH', [P.L0[0] + 0.10, P.L0[1] + 0.25, s * (P.zL - 0.12)], [crgEn(P.L0, P.L1, 0.4)[0], crgEn(P.L0, P.L1, 0.4)[1], s * (P.zL - P.rL - 0.03)], 0.028, 'goma', '#202326', 8);
  });
}

/* ejes, diferenciales, bocamazas y mandos finales; transmision y cardanes */
function crgEjes(D, o){
  [[o.XD, 'DIFD', 'BMLH', 'BMRH', 'DLH', 'DRH', 1], [o.XT, 'DIFP', 'BPLH', 'BPRH', 'MLH', 'MRH', -1]].forEach(function(q){
    var x = q[0], y = o.R, zi = o.TR - o.AT * 0.42, rd = o.rDif;
    D.pon(q[1], new THREE.SphereGeometry(rd, 28, 18), 'pintura', o.colEje, x, y, 0);
    /* nariz del pinon hacia la transmision */
    D.cilindro(q[1], rd * 0.45, rd * 0.62, rd * 0.9, 'pintura', o.colEje, x + q[6] * rd * 1.1, y, 0, [0, 0, Math.PI / 2], 20);
    [-1, 1].forEach(function(s){
      var zc = s * (zi + rd * 0.6) / 2;
      D.cilindro(null, o.rTubo, rd * 0.70, zi - rd * 0.6, 'pintura', o.colEje, x, y, zc, [s * Math.PI / 2, 0, 0], 24);
      D.cilindro(s > 0 ? q[2] : q[3], o.rMasa, o.rMasa * 0.92, o.AT * 0.14, 'metal', CRG_GRIS, x, y, s * (zi - o.AT * 0.07), [Math.PI / 2, 0, 0], 28);
      D.cilindro(s > 0 ? q[4] : q[5], o.rMasa * 0.82, o.rMasa * 0.82, o.AT * 0.10, 'metal', CRG_GRIS2, x, y, s * (zi - o.AT * 0.19), [Math.PI / 2, 0, 0], 28);
      /* soportes del eje al bastidor */
      D.bloque(null, rd * 1.2, rd * 0.5, 0.20, 'pintura', o.colEje, x, y + o.rTubo + rd * 0.2, s * zi * 0.55, 0.03);
    });
  });
  /* transmision y convertidor bajo el bastidor trasero, cardanes con cruceta */
  D.bloque('TRM', o.trm[2], o.trm[3], o.trm[4], 'metal', CRG_GRIS, o.trm[0], o.trm[1], 0, 0.06);
  for(var i = 0; i < 3; i++) D.bloque(null, 0.04, o.trm[3] + 0.04, o.trm[4] + 0.04, 'metal', CRG_GRIS2, o.trm[0] - o.trm[2] * 0.3 + i * o.trm[2] * 0.3, o.trm[1], 0, 0.01);
  D.cilindro('CON', o.trm[3] * 0.48, o.trm[3] * 0.48, o.trm[2] * 0.35, 'metal', CRG_GRIS2, o.trm[0] + o.trm[2] * 0.62, o.trm[1] + o.trm[3] * 0.08, 0, [0, 0, Math.PI / 2], 28);
  var xa = o.trm[0] - o.trm[2] / 2, xb = o.trm[0] + o.trm[2] / 2, yc = o.trm[1] - o.trm[3] * 0.30, rc = o.rCardan;
  D.tubo(null, [xa, yc, 0], [o.XH, (yc + o.R) / 2 + 0.05, 0], rc, 'metal', '#5E646B', 14);
  D.tubo(null, [o.XH, (yc + o.R) / 2 + 0.05, 0], [o.XD + o.rDif * 1.6, o.R, 0], rc, 'metal', '#5E646B', 14);
  D.tubo(null, [xb - o.trm[2] * 0.2, yc, 0], [o.XT - o.rDif * 1.6, o.R, 0], rc, 'metal', '#5E646B', 14);
  D.cilindro('FDP', rc * 3.2, rc * 3.2, 0.06, 'metal', '#6E747B', xa - 0.06, yc, 0, [0, 0, Math.PI / 2], 24);
  D.bloque(null, 0.18, 0.22, 0.30, 'metal', CRG_GRIS, o.XH, (yc + o.R) / 2 + 0.05, 0, 0.03);
}

/* articulacion: lengua del bastidor delantero, pines verticales y cilindros de direccion */
function crgArticulacion(D, o){
  [o.yA, o.yB].forEach(function(y){
    D.bloque('42023615', o.lLengua, 0.14, o.anchoL, 'pintura', o.colF, o.XH - o.lLengua * 0.25, y, 0, 0.03);
    D.bloque(null, o.lLengua * 0.55, 0.12, o.anchoL * 1.15, 'pintura', o.colR, o.XH + o.lLengua * 0.30, y + 0.14, 0, 0.03);
    D.cilindro('PYB', o.rPin, o.rPin, 0.44, 'metal', CRG_PERNO, o.XH, y + 0.07, 0, null, 18);
    D.cilindro(null, o.rPin * 1.5, o.rPin * 1.5, 0.05, 'metal', '#2E3238', o.XH, y + 0.30, 0, null, 18);
  });
  [-1, 1].forEach(function(s){
    D.cilHidD(s > 0 ? 'SLH' : 'SRH', [o.XH + o.lDir * 0.55, o.yDir, s * o.zDir], [o.XH - o.lDir * 0.45, o.yDir, s * (o.zDir - 0.10)], o.rDir, o.colCil, 0.55);
  });
}

/* ═══════════════════════════════════════════════════════════════════
   CAT 992K — cargador frontal minero (C-66)

   Specalog 992K (AEHQ7183), laminas «Dimensions»: techo del ROPS 5.678,
   chimeneas 5.248, capot 4.043, parachoques 1.176-1.830, despeje bajo la
   articulacion 0.682, eje trasero al parachoques 4.195, batalla 5.890,
   largo con el cucharon en el suelo 15.736, ejes a 1.352 del suelo, trocha
   3.302, llantas 45/65-R45 (1.143 de ancho), cucharon de roca de 11.5 m3
   y 4.884 de ancho. Lo que la hoja no acota (brazo, palanca, cabina,
   plataforma, escaleras, tanques) se midio sobre el dibujo de costado de la
   misma lamina, a escala con la batalla (10.24 mm por pixel del dibujo
   ampliado) y la altura de los ejes.

   Bastidor trasero: plataforma con barandas negras, cabina negra corrida a
   la izquierda, capot amarillo con dos chimeneas negras, rejilla del
   radiador atras, parachoques ancho con escalerillas y una escalera
   inclinada a cada lado que sube del parachoques a la plataforma; franja
   negra con 992K y CAT bajo la cabina. Bastidor delantero: torre alta con el
   cilindro de volteo arriba al centro, dos brazos en caja, palanca en Z
   central y dos cilindros de levante bajo los brazos.
   ═══════════════════════════════════════════════════════════════════ */
function crgConstruir992K(piezas){
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var bloque = D.bloque, tubo = D.tubo, cil = D.cilindro, perfil = D.perfil, letrero = D.letrero;
  var AM = CRG_CAT, AM2 = CRG_CAT2, NE = CRG_NEGRO, BAR = '#1E2023';
  var am = function(code, w, h, d, x, y, z, r, rot){ return bloque(code, w, h, d, 'pintura', AM, x, y, z, r, rot); };

  /* ═══ medidas ═══ */
  var XB = 7.868, XT = XB - 4.195, XD = XT - 5.890, XP = XD - 5.651;
  var R = 1.355, AT = 1.143, TR = 3.302 / 2;
  var XH = XD + 2.35, YPL = 3.46, YC = 4.043, YR = 5.678;
  var ZD = 2.12;                                   /* media anchura de la plataforma */
  var XC0 = 0.50, XC1 = 2.08, ZC0 = -0.92, ZC1 = 1.22;   /* cabina */
  var XK0 = 4.00, XK1 = 7.55, ZK = 1.45;           /* capot */

  /* ═══ bastidor trasero ═══ */
  [-0.72, 0.72].forEach(function(z){
    bloque('42023615', 6.70, 1.05, 0.32, 'pintura', AM2, (XH + 0.45 + 7.25) / 2, 1.55, z, 0.05);
    bloque(null, 6.70, 0.04, 0.36, 'pintura', AM, (XH + 0.45 + 7.25) / 2, 2.10, z, 0.01);
  });
  [1.0, 2.6, 5.2, 6.9].forEach(function(x){ bloque('42023615', 0.30, 0.80, 1.20, 'pintura', AM2, x, 1.55, 0, 0.03); });
  /* cajon delantero del bastidor trasero, donde entra la articulacion */
  am('42023615', 0.70, 1.75, 1.70, XH + 0.62, 1.55, 0, 0.06);

  /* ═══ plataforma y su faldon ═══ */
  am(null, XK0 + 0.45 - 0.15, 0.12, ZD * 2, (0.15 + XK0 + 0.45) / 2, YPL - 0.06, 0, 0.03);
  bloque(null, XK0 + 0.40 - 0.20, 0.02, ZD * 2 - 0.10, 'mate', '#4B4F55', (0.20 + XK0 + 0.40) / 2, YPL + 0.005, 0, 0.005);
  [-1, 1].forEach(function(s){
    am(null, XK0 + 0.45 - 0.15, 0.62, 0.10, (0.15 + XK0 + 0.45) / 2, YPL - 0.31, s * (ZD - 0.05), 0.03);
    /* franja negra con 992K y CAT bajo la cabina */
    bloque(null, 2.10, 0.44, 0.03, 'pintura', NE, 1.49, YPL - 0.38, s * (ZD + 0.005), 0.01);
  });
  var texFr = texRotulo3d(crgRotulo992, 512, 108);
  letrero(texFr, 2.04, 0.43, 1.49, YPL - 0.38, ZD + 0.025, 0);
  letrero(texFr, 2.04, 0.43, 1.49, YPL - 0.38, -ZD - 0.025, Math.PI);
  /* columnas de la plataforma sobre el bastidor y el frente de la plataforma */
  [0.35, 2.25, 4.15].forEach(function(x){ [-1, 1].forEach(function(s){ am(null, 0.22, YPL - 2.15, 0.22, x, (YPL + 2.10) / 2 - 0.10, s * 1.05, 0.04); }); });
  am(null, 0.10, 0.62, ZD * 2, 0.20, YPL - 0.31, 0, 0.03);

  /* ═══ tanques a los costados, bajo la plataforma (izquierda combustible, derecha hidraulico; supuesto) ═══ */
  [-1, 1].forEach(function(s){
    am(s > 0 ? 'TQC1' : 'TQH1', 0.82, 1.55, 1.00, 1.78, 2.05, s * 1.55, 0.10);
    cil(null, 0.09, 0.09, 0.10, 'mate', NE, 1.78, 2.86, s * 1.55, null, 16);
    bloque(null, 0.05, 0.55, 0.06, 'vidrio', '#9BB7C9', 1.36, 2.0, s * 1.62, 0.01);
  });
  /* mangueras y caneria que se ven bajo la cabina, entre la articulacion y los tanques */
  for(var hm = 0; hm < 5; hm++){
    tubo('LPH', [XH + 0.2, 1.70 + hm * 0.12, 0.85 - hm * 0.05], [1.30, 2.30 + hm * 0.08, 0.95], 0.035, 'goma', '#202326', 8);
  }

  /* ═══ cabina negra ═══ */
  crgCabina(D, G, { x0: XC0 + 0.10, x1: XC1, z0: ZC0, z1: ZC1, y0: YPL, yV: YPL + 0.62, y1: YR, inc: 0.12, hT: 0.20,
    base: NE, marco: NE, techo: NE, techo2: CRG_GRIS, puerta: 1, xPuerta: XC0 + 0.95, asideros: BAR, espejos: true,
    baliza: [XC1 - 0.25, ZC1 - 0.25], asiento: 0.80 });
  crgBaliza(D, G, XC1 - 0.25, YR + 0.04, ZC0 + 0.25);
  var texCAT = texRotulo3d(function(g, w, h){ g.fillStyle = NE; g.fillRect(0, 0, w, h); crgLetrasCAT(g, w * 0.10, h * 0.86, h * 0.80); }, 256, 96);
  letrero(texCAT, 0.62, 0.20, XC0 - 0.105, YR - 0.10, (ZC0 + ZC1) / 2, -Math.PI / 2);
  bloque('AAC', 0.90, 0.20, 1.10, 'mate', CRG_GRIS, XC1 - 0.55, YR + 0.12, (ZC0 + ZC1) / 2, 0.04);
  /* antenas */
  [0.35, -0.35].forEach(function(dz){ tubo(null, [XC1 - 0.15, YR, (ZC0 + ZC1) / 2 + dz], [XC1 - 0.15, YR + 0.70, (ZC0 + ZC1) / 2 + dz], 0.008, 'mate', '#111', 6); });

  /* ═══ capot del motor, rejilla del radiador y chimeneas ═══ */
  am('ENG1', XK1 - XK0, YC - 2.0, ZK * 2, (XK0 + XK1) / 2, (YC + 2.0) / 2, 0, 0.10);
  bloque(null, XK1 - XK0 - 0.30, 0.03, ZK * 2 - 0.40, 'mate', '#4B4F55', (XK0 + XK1) / 2, YC + 0.01, 0, 0.005);
  /* juntas de las puertas de servicio en los costados */
  [-1, 1].forEach(function(s){
    [4.65, 5.45, 6.45].forEach(function(x){ bloque(null, 0.025, YC - 2.25, 0.02, 'mate', '#7A5A08', x, (YC + 2.10) / 2, s * (ZK + 0.005), 0.005); });
    /* rejilla vertical de enfriamiento a los costados, atras */
    crgLamasZ(D, 'RAD1', 5.75, 6.30, 2.35, 3.75, s * (ZK + 0.01), s, 10, NE);
    /* manijas */
    [5.05, 6.95].forEach(function(x){ bloque(null, 0.16, 0.04, 0.04, 'cromo', null, x, 2.75, s * (ZK + 0.025), 0.01); });
  });
  /* rejilla del radiador atras, negra, con sus faros */
  bloque(null, 0.10, YC - 2.0, ZK * 2 - 0.10, 'mate', NE, XK1 + 0.01, (YC + 2.0) / 2, 0, 0.03);
  D.lamas('RAD1', XK1 + 0.08, 2.15, 3.85, -1.20, 1.20, 12, NE, 1);
  [-1, 1].forEach(function(s){
    crgLuz(D, s > 0 ? 'FPI' : 'FPD', XK1 + 0.12, 3.40, s * 1.32, 1, 0.16, 0.22, '#C2241B');
    crgLuz(D, 'LSM', XK1 + 0.12, 3.12, s * 1.32, 1, 0.16, 0.16, '#F4EDCF');
  });
  /* chimeneas negras gemelas con el remate cortado */
  [-0.36, 0.36].forEach(function(z){
    cil(null, 0.22, 0.24, 0.12, 'mate', NE, 5.41, YC + 0.06, z, null, 20);
    cil(null, 0.17, 0.18, 5.10 - YC, 'mate', '#202226', 5.41, (YC + 5.10) / 2, z, null, 20);
    var tp = cil(null, 0.17, 0.17, 0.30, 'mate', '#202226', 5.47, 5.16, z, [0, 0, -0.45], 20);
  });
  /* prefiltros de aire y tapa del radiador sobre el capot */
  [-0.95, 0.95].forEach(function(z){
    cil(null, 0.20, 0.20, 0.42, 'mate', NE, 4.55, YC + 0.21, z, null, 20);
    cil(null, 0.23, 0.23, 0.06, 'mate', NE, 4.55, YC + 0.45, z, null, 20);
  });
  cil(null, 0.10, 0.10, 0.10, 'metal', CRG_GRIS2, 7.15, YC + 0.05, 0.6, null, 14);

  /* ═══ parachoques trasero con plataforma, escalerillas y baterias ═══ */
  am(null, XB - 6.00, 1.83 - 1.176, ZD * 2, (XB + 6.00) / 2, (1.176 + 1.83) / 2, 0, 0.08);
  bloque(null, XB - 6.10, 0.02, ZD * 2 - 0.10, 'mate', '#4B4F55', (XB + 6.10) / 2, 1.84, 0, 0.005);
  bloque(null, 0.10, 0.20, 0.50, 'metal', '#2E3238', XB + 0.02, 1.40, 0, 0.03);
  [-1, 1].forEach(function(s){
    crgEscalerilla(D, XB - 0.02, s * 1.68, 0.50, 1.176, 0.42, 'z', BAR, '#3A3E43');
    /* barandas de las esquinas traseras */
    D.baranda([[6.25, s * (ZD - 0.06)], [XB - 0.06, s * (ZD - 0.06)], [XB - 0.06, s * 1.40]], 1.83, 1.0, BAR);
    crgLuz(D, 'LSM', XB + 0.02, 1.62, s * 1.95, 1, 0.20, 0.12, '#F2A31A');
  });
  bloque('BAT', 0.62, 0.55, 0.50, 'mate', NE, 6.45, 1.50, -1.55, 0.04);

  /* ═══ escaleras inclinadas: del parachoques a la plataforma, por fuera del capot ═══ */
  [-1, 1].forEach(function(s){
    crgEscaleraInc(D, [6.00, 1.85], [XK0 + 0.30, YPL], s * 1.86, 0.55, BAR, '#3A3E43', BAR);
  });

  /* ═══ barandas de la plataforma y del techo del capot ═══ */
  D.baranda([[XK0 + 0.30, ZD - 0.06], [0.22, ZD - 0.06], [0.22, -ZD + 0.06], [XK0 + 0.30, -ZD + 0.06]], YPL, 1.05, BAR);
  [-1, 1].forEach(function(s){ D.baranda([[XK0 + 0.40, s * (ZK - 0.08)], [XK1 - 0.10, s * (ZK - 0.08)]], YC, 1.0, BAR); });
  D.baranda([[XK1 - 0.10, ZK - 0.08], [XK1 - 0.10, -ZK + 0.08]], YC, 1.0, BAR);
  /* escalerilla de servicio al frente izquierdo de la plataforma */
  D.escalera(0.08, 1.75, 0.70, YPL, 0.45, BAR, '#3A3E43');

  /* ═══ guardabarros y faldones traseros (la plataforma hace de guardabarros) ═══ */
  [-1, 1].forEach(function(s){
    bloque(null, 0.05, 1.10, AT * 0.95, 'goma', '#16181A', XT + R + 0.10, 1.25, s * TR, 0.01);
  });

  /* ═══ bastidor delantero ═══ */
  var bastD = [[XH + 0.30, 0.72], [XH + 0.30, 2.15], [-0.55, 2.35], [-0.62, 4.02], [-1.55, 4.08], [-1.85, 3.30],
               [-2.75, 2.55], [-3.30, 2.15], [-3.30, 1.55], [-2.80, 1.48], [-1.60, 1.48], [-0.75, 0.75]];
  [-1, 1].forEach(function(s){ perfil('42023615', bastD, 0.12, s * 0.55, 'pintura', AM, 0.03); });
  am('42023615', 0.95, 0.40, 1.00, -1.08, 3.85, 0, 0.05);
  am(null, 0.12, 0.60, 1.00, -3.25, 1.85, 0, 0.03);
  am(null, 1.40, 0.10, 1.00, -1.35, 2.40, 0, 0.02);
  /* faros del frente de la torre */
  [-1, 1].forEach(function(s){
    am(null, 0.20, 0.40, 0.34, -1.72, 3.62, s * 0.40, 0.04);
    D.faro(s > 0 ? 'FDI' : 'FDD', -1.84, 3.62, s * 0.40, 0.13);
  });
  /* engrase centralizado en la torre */
  bloque('SEN', 0.40, 0.48, 0.30, 'mate', CRG_GRIS, -0.30, 2.75, 0.75, 0.04);
  cil('GP1', 0.09, 0.09, 0.36, 'metal', CRG_GRIS2, -0.30, 3.17, 0.75, null, 14);

  /* ═══ articulacion, ejes y tren de fuerza ═══ */
  crgArticulacion(D, { XH: XH, yA: 2.05, yB: 0.82, lLengua: 0.90, anchoL: 0.90, rPin: 0.15, colF: AM, colR: AM2,
    lDir: 1.70, yDir: 1.30, zDir: 0.88, rDir: 0.13, colCil: AM2 });
  crgEjes(D, { XD: XD, XT: XT, R: R, TR: TR, AT: AT, rDif: 0.62, rTubo: 0.40, rMasa: 0.58, colEje: AM2,
    trm: [1.75, 1.35, 1.40, 0.95, 1.00], rCardan: 0.11, XH: XH });

  /* ═══ brazo, varillaje en Z y cucharon ═══ */
  var A = [-1.267, 3.08], K = [-3.347, 2.53], B = [-5.587, 0.59];
  var L = crgEn(K, B, 0.30), T = [-4.327, 3.42], U = [-4.527, 1.25], Q = [-5.54, 1.55];
  crgVarillaje(D, { A: A, K: K, B: B, zBr: 0.82, eBr: 0.32, hBr: [0.95, 0.85, 0.62], col: AM, col2: AM2, colCil: AM, rPerno: 0.17,
    L: L, T: T, U: U, Q: Q, dzP: 0.16, zQ: 0.20, hP: 0.46, C0: [-0.90, 3.88], rV: 0.20, rTubo: 0.24,
    L0: [-1.087, 1.36], L1: crgNormal(A, K, crgEn(A, K, 0.66), -0.40), rL: 0.21, zL: 0.82 });
  crgCucharon(D, { xe: XP + 0.32, Dp: (B[0] - 0.14) - (XP + 0.32), H: 2.10, ancho: 4.884, col: AM, col2: AM2, esp: 0.07,
    dientes: 9, lDiente: 0.45, colDiente: '#5A5E63', B: B, Q: Q, zB: 0.82, eB: 0.22, rB: 0.16, zQ: 0.20, rQ: 0.14 });

  /* ═══ llantas 45/65-R45 en aros amarillos ═══ */
  var LL = { r: R, ancho: AT, rAro: R * 0.47, aro: AM, aro2: AM2, pernos: 30, paso: 0.42 };
  D.ruedaDet('LL1', XD, TR, 1, LL);
  D.ruedaDet('LL2', XD, -TR, -1, LL);
  D.ruedaDet('LL3', XT, TR, 1, LL);
  D.ruedaDet('LL4', XT, -TR, -1, LL);

  /* numero de unidad en los costados del capot */
  var texNum = texNumero3d(null, '#16181C');
  [-1, 1].forEach(function(s){
    var mN = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 0.33), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
    mN.position.set(6.92, 3.20, s * (ZK + 0.012)); mN.rotation.y = s > 0 ? 0 : Math.PI; G.add(mN);
  });

  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = 2.8;
  G.userData.dist = 38;
  return G;
}

/* ═══════════════════════════════════════════════════════════════════
   CAT 966 de la nueva generacion («966NG», C-368-AL) — cargador mediano

   Hoja tecnica Cat 966 AEXQ3248-00 (06-2021, motor C9.3B): capot 2.850,
   escape 3.531, techo del ROPS 3.593, despeje 0.424, eje trasero al
   contrapeso 2.290, eje trasero a la articulacion 1.775, batalla 3.550,
   largo sin cucharon 7.399, ancho sobre llantas 3.012, trocha 2.230,
   llantas 26.5R25 (radio de rodadura 0.849), cucharon de uso general de
   4.2 m3 con cuchilla empernada (BOCE). El largo con el cucharon en el
   suelo (8.98) y el ancho del cucharon (3.20) son los del 4.2 m3 GP del
   966M; la cabina, el brazo y la palanca se tomaron de la foto del folleto.

   Cabina negra sobre una base amarilla, capot inclinado con la rejilla
   negra del radiador atras y paneles de malla a los costados, un escape
   negro a la derecha, contrapeso con las luces, escalera bajo la puerta a
   la izquierda, guardabarros delanteros negros, varillaje en Z con un
   cilindro de volteo arriba al centro.
   ═══════════════════════════════════════════════════════════════════ */
function crgConstruir966(piezas){
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var bloque = D.bloque, tubo = D.tubo, cil = D.cilindro, perfil = D.perfil, letrero = D.letrero;
  var AM = CRG_CAT, AM2 = CRG_CAT2, NE = CRG_NEGRO;
  var am = function(code, w, h, d, x, y, z, r, rot){ return bloque(code, w, h, d, 'pintura', AM, x, y, z, r, rot); };

  var XB = 4.49, XT = XB - 2.290, XD = XT - 3.550, XH = XT - 1.775, XP = -4.49;
  var R = 0.875, AT = 0.70, TR = 2.230 / 2;
  var YR = 3.593, YK = 2.850;

  /* ═══ bastidor trasero ═══ */
  [-0.45, 0.45].forEach(function(z){ bloque('42023615', XB - 0.35 - (XH + 0.25), 0.62, 0.20, 'pintura', AM2, (XH + 0.25 + XB - 0.35) / 2, 0.92, z, 0.04); });
  am('42023615', 0.45, 0.95, 1.05, XH + 0.40, 0.95, 0, 0.05);

  /* ═══ base de la cabina y cabina negra ═══ */
  am(null, 1.95, 0.48, 1.70, 0.30, 1.40, 0, 0.06);
  crgCabina(D, G, { x0: -0.55, x1: 1.19, z0: -0.78, z1: 0.78, y0: 1.64, yV: 1.80, y1: YR, inc: 0.10, hT: 0.15,
    base: NE, marco: NE, techo: NE, techo2: CRG_GRIS, puerta: 1, xPuerta: 0.30, asideros: NE, espejos: true,
    baliza: [1.00, 0.55], asiento: 0.55 });
  bloque('AAC', 0.70, 0.12, 0.90, 'mate', CRG_GRIS, 0.85, YR + 0.06, 0, 0.03);
  var texCAT = texRotulo3d(function(g, w, h){ g.fillStyle = NE; g.fillRect(0, 0, w, h); crgLetrasCAT(g, w * 0.10, h * 0.86, h * 0.80); }, 256, 96);
  letrero(texCAT, 0.42, 0.14, -0.65, YR - 0.075, 0, -Math.PI / 2);

  /* ═══ capot inclinado ═══ */
  var cap = [[1.20, 1.96], [1.20, YK - 0.05], [1.34, YK], [3.70, YK - 0.07], [4.16, YK - 0.18], [4.36, 2.50], [4.36, 1.32], [3.25, 1.32], [3.25, 1.96]];
  perfil('ENG1', cap, 1.70, 0, 'pintura', AM, 0.10);
  bloque(null, 2.20, 0.02, 1.10, 'mate', '#4B4F55', 2.50, YK - 0.02, 0, 0.005);
  [-1, 1].forEach(function(s){
    /* paneles de malla negra atras, a los costados */
    bloque(null, 0.62, 1.00, 0.03, 'mate', '#121315', 3.68, 2.10, s * 0.86, 0.02);
    crgMalla(D, 3.40, 3.96, 1.64, 2.56, s * 0.88, 0.07, '#34383D', 0.012);
    /* juntas de la tapa y manija */
    bloque(null, 0.02, 0.80, 0.02, 'mate', '#7A5A08', 3.20, 2.40, s * 0.855, 0.005);
    bloque(null, 0.14, 0.035, 0.035, 'cromo', null, 2.95, 2.20, s * 0.87, 0.01);
    /* placa CAT con el filo rojo y 966 */
    letrero(texRotulo3d(crgRotulo966, 512, 112), 1.05, 0.23, 2.30, 2.45, s * 0.857, s > 0 ? 0 : Math.PI);
  });
  /* rejilla del radiador atras */
  bloque(null, 0.08, 1.20, 1.62, 'mate', NE, 4.38, 1.95, 0, 0.03);
  D.lamas('RAD1', 4.44, 1.42, 2.48, -0.70, 0.70, 10, NE, 1);
  /* escape a la derecha y prefiltro */
  cil(null, 0.14, 0.15, 0.08, 'mate', NE, 2.10, YK - 0.04, -0.45, null, 18);
  cil(null, 0.10, 0.11, YR - 0.06 - YK, 'mate', '#202226', 2.10, (YK + YR - 0.06) / 2, -0.45, null, 18);
  cil(null, 0.10, 0.10, 0.18, 'mate', '#202226', 2.15, YR - 0.05, -0.45, [0, 0, -0.5], 18);
  cil(null, 0.06, 0.06, 0.20, 'mate', NE, 1.62, YK + 0.08, 0.30, null, 14);
  D.pon(null, new THREE.SphereGeometry(0.15, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), 'mate', NE, 1.62, YK + 0.18, 0.30);

  /* ═══ guardabarros traseros amarillos ═══ */
  [-1, 1].forEach(function(s){
    crgArco(D, null, XT, R, R + 0.08, R + 0.15, 0.10, Math.PI - 0.30, s * TR, AT + 0.10, 'pintura', AM);
    am(null, 1.30, 0.06, 0.40, XT + 0.10, 1.92, s * 0.98, 0.02);
  });

  /* ═══ contrapeso con luces y enganche ═══ */
  am(null, XB - 3.68, 0.86, 2.40, (XB + 3.68) / 2, 0.92, 0, 0.14);
  bloque(null, 0.12, 0.30, 0.45, 'metal', '#2E3238', XB + 0.02, 0.80, 0, 0.03);
  [-1, 1].forEach(function(s){
    crgLuz(D, s > 0 ? 'FPI' : 'FPD', XB + 0.01, 1.18, s * 0.95, 1, 0.22, 0.12, '#C2241B');
    crgLuz(D, 'LSM', XB + 0.01, 1.18, s * 0.66, 1, 0.14, 0.12, '#F2A31A');
    /* peldano en la esquina trasera */
    bloque(null, 0.30, 0.04, 0.24, 'metal', '#3A3E43', XB - 0.50, 0.42, s * 1.12, 0.008);
  });
  bloque('BAT', 0.45, 0.30, 0.40, 'mate', NE, 3.75, 0.62, -0.95, 0.03);

  /* ═══ escalera bajo la puerta y pasamanos ═══ */
  crgEscalerilla(D, 0.62, 1.14, 0.42, 1.62, 0.44, 'x', NE, '#3A3E43');
  D.baranda([[1.30, 0.93], [2.70, 0.93]], YK - 0.05, 0.75, NE);
  /* tanques: combustible a la izquierda bajo la cabina, hidraulico a la derecha (supuesto) */
  am('TQC1', 0.55, 0.70, 0.40, 1.00, 0.90, 0.82, 0.06);
  am('TQH1', 0.55, 0.70, 0.40, 1.00, 0.90, -0.82, 0.06);

  /* ═══ bastidor delantero, guardabarros negros y luces ═══ */
  var bastD = [[XH + 0.28, 0.48], [XH + 0.28, 1.30], [0.05, 1.42], [-0.28, 2.40], [-0.95, 2.44], [-1.15, 1.95],
               [-1.90, 1.45], [-2.08, 1.10], [-1.75, 0.88], [-0.95, 0.80], [-0.10, 0.48]];
  [-1, 1].forEach(function(s){ perfil('42023615', bastD, 0.09, s * 0.42, 'pintura', AM, 0.025); });
  am('42023615', 0.65, 0.26, 0.75, -0.60, 2.28, 0, 0.04);
  am(null, 0.08, 0.40, 0.75, -2.04, 1.15, 0, 0.02);
  [-1, 1].forEach(function(s){
    crgArco(D, null, XD, R, R + 0.07, R + 0.12, 0.45, 2.55, s * TR, AT + 0.12, 'mate', '#1A1C1F');
    bloque(null, 0.10, 0.10, 0.70, 'mate', '#1A1C1F', XD + 0.10, R + 0.90, s * 0.78, 0.02);
    am(null, 0.16, 0.26, 0.24, -1.08, 2.05, s * 0.30, 0.03);
    D.faro(s > 0 ? 'FDI' : 'FDD', -1.17, 2.05, s * 0.30, 0.08);
  });
  bloque('SEN', 0.26, 0.32, 0.20, 'mate', CRG_GRIS, -0.10, 1.70, 0.55, 0.03);

  crgArticulacion(D, { XH: XH, yA: 1.30, yB: 0.52, lLengua: 0.55, anchoL: 0.65, rPin: 0.09, colF: AM, colR: AM2,
    lDir: 1.10, yDir: 0.88, zDir: 0.58, rDir: 0.08, colCil: AM2 });
  crgEjes(D, { XD: XD, XT: XT, R: R, TR: TR, AT: AT, rDif: 0.36, rTubo: 0.20, rMasa: 0.34, colEje: AM2,
    trm: [1.20, 0.80, 0.90, 0.55, 0.60], rCardan: 0.06, XH: XH });

  /* ═══ brazo en Z y cucharon de uso general ═══ */
  var A = [-0.74, 2.02], K = [-1.95, 1.62], B = [-2.909, 0.45];
  var L = crgEn(K, B, 0.30), T = [-2.36, 2.26], U = [L[0] + 0.12, L[1] - 0.52], Q = [B[0] + 0.08, B[1] + 0.62];
  crgVarillaje(D, { A: A, K: K, B: B, zBr: 0.60, eBr: 0.16, hBr: [0.52, 0.48, 0.38], col: AM, col2: AM2, colCil: AM, rPerno: 0.09,
    L: L, T: T, U: U, Q: Q, dzP: 0.10, zQ: 0.13, hP: 0.26, C0: [-0.58, 2.30], rV: 0.11, rTubo: 0.13,
    L0: [-0.55, 0.98], L1: crgNormal(A, K, crgEn(A, K, 0.62), -0.24), rL: 0.10, zL: 0.60 });
  crgCucharon(D, { xe: XP + 0.06, Dp: (B[0] - 0.10) - (XP + 0.06), H: 1.35, ancho: 3.20, col: AM, col2: AM2, esp: 0.04,
    dientes: 0, B: B, Q: Q, zB: 0.60, eB: 0.12, rB: 0.09, zQ: 0.13, rQ: 0.08 });

  /* ═══ llantas 26.5R25 en aros amarillos ═══ */
  var LL = { r: R, ancho: AT, rAro: R * 0.44, aro: AM, aro2: AM2, pernos: 18, paso: 0.26 };
  D.ruedaDet('LL1', XD, TR, 1, LL);
  D.ruedaDet('LL2', XD, -TR, -1, LL);
  D.ruedaDet('LL3', XT, TR, 1, LL);
  D.ruedaDet('LL4', XT, -TR, -1, LL);

  var texNum = texNumero3d(null, '#16181C');
  [-1, 1].forEach(function(s){
    var mN = new THREE.Mesh(new THREE.PlaneGeometry(0.80, 0.25), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
    mN.position.set(4.05, 1.05, s * 1.21); mN.rotation.y = s > 0 ? 0 : Math.PI; G.add(mN);
  });

  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = 1.7;
  G.userData.dist = 22;
  return G;
}

/* ═══════════════════════════════════════════════════════════════════
   VOLVO L150H y L180H — cargadores medianos (C-376-AL, C-362-AL…)

   Folleto Volvo L150H/L180H/L220H (Ref. 20039761_G, 2016), pagina 21,
   brazo estandar, llantas 26.5 R25 L3:
                               L150H   L180H
     batalla (C)               3.550   3.550
     techo de la cabina (F)    3.580   3.580
     trocha (X)                2.280   2.280
     ancho sobre llantas (Y)   2.960   2.960
     cola al pin del cucharon  7.070   7.190
     largo con cucharon (A)    8.790   9.000   (4.0 / 4.6 m3 GP con dientes)
     ancho del cucharon (V)    3.230   3.200
   El resto (capot, cabina, contrapeso, brazo y varillaje TP) se midio sobre
   el dibujo de costado de la misma pagina (es el L220H: se lleva a la escala
   de la batalla y del techo de la cabina de cada modelo).

   Amarillo Volvo, techo del capot gris oscuro, guardabarros grises, rejilla
   negra atras con la marca de hierro y el modelo en vertical, toma de aire
   negra en aleta, baranda naranja detras de la cabina, escalera bajo la
   puerta, varillaje TP: cilindro de volteo arriba al centro, palanca sobre
   el brazo y eslabon corto al cucharon.
   ═══════════════════════════════════════════════════════════════════ */
var CRG_VOLVO = {
  L150H: { largo: 8.79, colaPin: 7.07, cola: 2.165, cuch: 3.23, alto: 1.42, contrapeso: 0 },
  L180H: { largo: 9.00, colaPin: 7.19, cola: 2.225, cuch: 3.20, alto: 1.48, contrapeso: 0.06 }
};
function crgConstruirVolvo(modelo, piezas){
  var M = CRG_VOLVO[modelo];
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var bloque = D.bloque, tubo = D.tubo, cil = D.cilindro, perfil = D.perfil, letrero = D.letrero;
  var AM = CRG_VOL, AM2 = CRG_VOL2, GR = CRG_VOLGR, NE = CRG_NEGRO, NA = CRG_NARANJA;
  var am = function(code, w, h, d, x, y, z, r, rot){ return bloque(code, w, h, d, 'pintura', AM, x, y, z, r, rot); };

  var XB = M.largo / 2, XT = XB - M.cola, XD = XT - 3.55, XP = -M.largo / 2, XH = XT - 1.76;
  var R = 0.88, AT = 0.68, TR = 2.28 / 2, YR = 3.58;
  /* del dibujo: X hacia adelante desde el eje trasero y alto desde el suelo */
  var x = function(dx){ return XT - dx; };

  /* ═══ bastidor trasero ═══ */
  [-0.42, 0.42].forEach(function(z){ bloque('42023615', XB - 0.40 - (XH + 0.20), 0.65, 0.20, 'pintura', AM2, (XH + 0.20 + XB - 0.40) / 2, 0.98, z, 0.04); });
  am('42023615', 0.45, 1.00, 1.00, XH + 0.38, 1.00, 0, 0.05);
  am(null, 1.70, 0.40, 1.60, x(1.55), 1.70, 0, 0.06);

  /* ═══ cabina amarilla de vidrio grande ═══ */
  crgCabina(D, G, { x0: x(2.165), x1: x(0.80), z0: -0.80, z1: 0.80, y0: 1.96, yV: 2.24, y1: YR, inc: 0.235, hT: 0.16,
    base: AM, marco: AM, techo: AM, techo2: AM2, puerta: 1, xPuerta: x(1.45), asideros: NE, espejos: true,
    baliza: [x(0.95), 0.62], asiento: 0.55 });
  /* juntas negras de los vidrios y visera */
  bloque(null, 0.10, 0.05, 1.50, 'mate', NE, x(2.165) - 0.10, YR - 0.20, 0, 0.02);

  /* ═══ capot: costados amarillos y techo gris oscuro ═══ */
  var cap = [[x(-1.92), 1.62], [x(-1.90), 2.30], [x(-1.75), 2.45], [x(-0.72), 2.735], [x(0.03), 2.87], [x(0.79), 2.81],
             [x(0.79), 2.02], [x(-0.95), 2.02], [x(-0.95), 1.62]];
  perfil('ENG1', cap, 1.90, 0, 'pintura', AM, 0.12);
  /* el bisel del perfil agranda el contorno ~7 cm: el techo gris va por encima de eso */
  perfil(null, [[x(-1.80), 2.51], [x(-0.72), 2.845], [x(0.03), 2.98], [x(0.62), 2.945], [x(0.62), 2.80], [x(0.03), 2.84], [x(-0.72), 2.71], [x(-1.80), 2.37]],
    1.50, 0, 'pintura', GR, 0.05);
  [-1, 1].forEach(function(s){
    /* franja gris con VOLVO en el costado, adelante y arriba */
    perfil(null, [[x(0.70), 2.56], [x(-0.30), 2.50], [x(-0.30), 2.68], [x(0.70), 2.74]], 0.03, s * 0.955, 'pintura', GR, 0.006);
    letrero(texRotulo3d(crgRotuloVolvo(GR, '#F2F2EE'), 512, 96), 0.72, 0.14, x(0.22), 2.615, s * 0.973, s > 0 ? 0 : Math.PI);
    /* ventana de enfriamiento del costado, atras */
    crgLamasZ(D, 'RAD1', x(-1.43), x(-0.96), 1.70, 2.30, s * 0.955, s, 7, GR);
    bloque(null, 0.14, 0.035, 0.035, 'cromo', null, x(-0.55), 2.15, s * 0.965, 0.01);
  });
  /* aleta negra de la toma de aire, a la derecha */
  perfil(null, [[x(0.26), 2.82], [x(-0.02), 2.86], [x(-0.02), 3.12], [x(0.10), 3.47], [x(0.25), 3.45], [x(0.21), 3.10]], 0.16, -0.38, 'pintura', NE, 0.03);
  /* escape: boca corta junto a la aleta */
  cil(null, 0.07, 0.08, 0.20, 'mate', '#202226', x(0.50), 2.92, -0.38, null, 14);

  /* ═══ rejilla negra atras con la marca de hierro y el modelo ═══ */
  bloque(null, 0.10, 0.80, 1.74, 'mate', NE, x(-1.86), 2.02, 0, 0.03);
  D.lamas('RAD1', x(-1.93), 1.68, 2.36, -0.52, 0.52, 9, NE, 1);
  letrero(texRotulo3d(crgRotuloHierro, 256, 256), 0.34, 0.34, x(-1.99), 2.02, 0, Math.PI / 2);
  var texMod = texRotulo3d(crgRotuloVertical(modelo, '#111214', '#F2F2EE'), 96, 384);
  [-1, 1].forEach(function(s){
    bloque(null, 0.06, 0.74, 0.26, 'mate', '#111214', x(-1.90), 2.02, s * 0.74, 0.02);
    letrero(texMod, 0.17, 0.66, x(-1.935), 2.02, s * 0.74, Math.PI / 2);
  });

  /* ═══ contrapeso amarillo con luces y enganche ═══ */
  var cp0 = x(-1.46), cp1 = XB;
  am(null, cp1 - cp0, 0.80 + M.contrapeso, 2.50, (cp0 + cp1) / 2, 1.22, 0, 0.16);
  bloque(null, 0.12, 0.26, 0.40, 'metal', '#2E3238', XB + 0.02, 1.00, 0, 0.03);
  [-1, 1].forEach(function(s){
    crgLuz(D, s > 0 ? 'FPI' : 'FPD', XB + 0.01, 1.42, s * 1.00, 1, 0.24, 0.12, '#C2241B');
    crgLuz(D, 'LSM', XB + 0.01, 1.42, s * 0.72, 1, 0.14, 0.12, '#F2A31A');
    /* peldano naranja bajo el contrapeso */
    bloque(null, 0.28, 0.04, 0.24, 'pintura', NA, XB - 0.45, 0.62, s * 1.10, 0.008);
    tubo(null, [XB - 0.45, 0.64, s * 0.98], [XB - 0.45, 0.82, s * 0.98], 0.02, 'pintura', NA, 8);
  });
  bloque('BAT', 0.50, 0.32, 0.40, 'mate', NE, x(-1.25), 0.95, -1.0, 0.03);

  /* ═══ guardabarros grises sobre las ruedas traseras ═══ */
  [-1, 1].forEach(function(s){
    crgArco(D, null, XT, R, R + 0.07, R + 0.15, 0.05, Math.PI - 0.35, s * TR, AT + 0.12, 'pintura', GR);
    bloque(null, 1.40, 0.08, 0.30, 'pintura', AM, XT + 0.10, 2.04, s * 1.02, 0.03);
  });

  /* ═══ plataforma y baranda naranja detras de la cabina, a la izquierda ═══ */
  bloque(null, 0.80, 0.05, 0.42, 'metal', '#3A3E43', x(0.28), 2.22, 1.17, 0.01);
  D.baranda([[x(0.62), 1.36], [x(-0.05), 1.36], [x(-0.05), 0.96]], 2.22, 0.95, NA);
  /* escalera bajo la puerta y su pasamanos inclinado */
  crgEscalerilla(D, x(1.39), 1.17, 0.50, 1.96, 0.42, 'x', AM2, '#3A3E43');
  tubo(null, [x(1.05), 1.30, 1.25], [x(0.98), 2.05, 1.25], 0.022, 'pintura', NA, 8);
  /* tanques entre las ruedas (supuesto): combustible izquierda, hidraulico derecha */
  am('TQC1', 0.55, 0.65, 0.36, x(1.95), 1.02, 0.80, 0.06);
  am('TQH1', 0.60, 0.80, 0.36, x(1.40), 1.10, -0.86, 0.06);

  /* ═══ bastidor delantero, guardabarros y faros ═══ */
  var bastD = [[XH + 0.28, 0.55], [XH + 0.28, 1.55], [XD + 1.30, 1.72], [XD + 1.12, 2.50], [XD + 0.55, 2.56], [XD + 0.35, 2.05],
               [XD - 0.45, 1.45], [XD - 0.62, 1.05], [XD - 0.30, 0.85], [XD + 0.50, 0.72], [XD + 1.30, 0.55]];
  [-1, 1].forEach(function(s){ perfil('42023615', bastD, 0.09, s * 0.40, 'pintura', AM, 0.025); });
  am('42023615', 0.55, 0.26, 0.71, XD + 0.85, 2.40, 0, 0.04);
  am(null, 0.08, 0.40, 0.71, XD - 0.58, 1.10, 0, 0.02);
  [-1, 1].forEach(function(s){
    crgArco(D, null, XD, R, R + 0.07, R + 0.13, 0.40, 2.45, s * TR, AT + 0.12, 'pintura', GR);
    bloque(null, 0.10, 0.10, 0.65, 'pintura', GR, XD + 0.15, R + 0.93, s * 0.78, 0.02);
    am(null, 0.16, 0.24, 0.22, XD + 0.40, 2.25, s * 0.30, 0.03);
    crgLuz(D, 'LSM', XD + 0.32, 2.25, s * 0.30, -1, 0.16, 0.14);
  });
  bloque('SEN', 0.24, 0.30, 0.20, 'mate', CRG_GRIS, XD + 1.30, 1.95, 0.52, 0.03);

  crgArticulacion(D, { XH: XH, yA: 1.45, yB: 0.62, lLengua: 0.55, anchoL: 0.62, rPin: 0.09, colF: AM, colR: AM2,
    lDir: 1.10, yDir: 0.95, zDir: 0.56, rDir: 0.08, colCil: AM2 });
  crgEjes(D, { XD: XD, XT: XT, R: R, TR: TR, AT: AT, rDif: 0.36, rTubo: 0.20, rMasa: 0.34, colEje: AM2,
    trm: [x(1.05), 0.85, 0.90, 0.55, 0.60], rCardan: 0.06, XH: XH });

  /* ═══ brazo TP y cucharon con dientes ═══ */
  var A = [x(2.771), 2.05], K = [x(4.54), 1.45], B = [XB - M.colaPin, 0.45];
  var L = crgEn(K, B, 0.10), T = [x(4.008), 2.47], U = crgEn(T, L, 1.20), Q = [B[0] - 0.02, B[1] + 0.48];
  crgVarillaje(D, { A: A, K: K, B: B, zBr: 0.58, eBr: 0.14, hBr: [0.50, 0.46, 0.36], col: AM, col2: AM2, colCil: AM, rPerno: 0.09,
    L: L, T: T, U: U, Q: Q, dzP: 0.10, zQ: 0.13, hP: 0.26, C0: [x(2.598), 2.35], rV: 0.11, rTubo: 0.13,
    L0: [x(2.561), 1.70], L1: crgNormal(A, K, crgEn(A, K, 0.48), -0.22), rL: 0.10, zL: 0.58 });
  crgCucharon(D, { xe: XP + 0.24, Dp: (B[0] - 0.14) - (XP + 0.24), H: M.alto, ancho: M.cuch, col: AM, col2: AM2, esp: 0.04,
    dientes: 8, lDiente: 0.26, colDiente: '#5A5E63', B: B, Q: Q, zB: 0.58, eB: 0.11, rB: 0.09, zQ: 0.13, rQ: 0.08 });

  /* ═══ llantas 26.5 R25 en aros amarillos ═══ */
  var LL = { r: R, ancho: AT, rAro: R * 0.44, aro: AM, aro2: AM2, pernos: 18, paso: 0.26 };
  D.ruedaDet('LL1', XD, TR, 1, LL);
  D.ruedaDet('LL2', XD, -TR, -1, LL);
  D.ruedaDet('LL3', XT, TR, 1, LL);
  D.ruedaDet('LL4', XT, -TR, -1, LL);

  var texNum = texNumero3d(null, '#16181C');
  [-1, 1].forEach(function(s){
    var mN = new THREE.Mesh(new THREE.PlaneGeometry(0.80, 0.25), new THREE.MeshStandardMaterial({ map: texNum, transparent: true, roughness: 0.5 }));
    mN.position.set(XB - 0.42, 1.30, s * 1.256); mN.rotation.y = s > 0 ? 0 : Math.PI; G.add(mN);
  });

  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = 1.7;
  G.userData.dist = 22;
  return G;
}

/* ═══════════════════════════════════════════════════════════════════
   BOBCAT S570 y S650 — minicargadores (MC-22/23/24-AL y MC-21-AL)

   Especificaciones Bobcat (S570 / S650): batalla 1.08 / 1.15, largo sin
   cucharon 2.66 / 2.76, con cucharon 3.38 / 3.47, alto a la cabina
   1.97 / 2.07, ancho sobre llantas 1.65 / 1.83, cucharon de 68" (1.73) /
   74" (1.88), llantas 10-16.5 / 12-16.5, brazo de levante vertical en los
   dos. Lo que no esta acotado (voladizo trasero, torres, puesto de la
   cabina) sale de las fotos de estudio de Bobcat.

   Blanco Bobcat en el chasis, las torres y los brazos; cabina ROPS negra con
   la puerta de vidrio al frente y rejillas en los costados; aros naranjas;
   cucharon negro sobre el Bob-Tach; placa naranja Bobcat en los brazos y
   colas rojas con el modelo. Los brazos giran atras sobre dos eslabones
   (levante vertical) y suben con un cilindro en cada torre; el cucharon se
   inclina con dos cilindros al frente.
   ═══════════════════════════════════════════════════════════════════ */
var CRG_BOBCAT = {
  S570: { bat: 1.08, sin: 2.66, con: 3.38, alto: 1.97, ancho: 1.65, cuch: 1.73, r: 0.395, at: 0.26, voladizo: 0.80 },
  S650: { bat: 1.15, sin: 2.76, con: 3.47, alto: 2.07, ancho: 1.83, cuch: 1.88, r: 0.415, at: 0.31, voladizo: 0.82 }
};
function crgConstruirBobcat(modelo, piezas){
  var M = CRG_BOBCAT[modelo];
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var bloque = D.bloque, tubo = D.tubo, cil = D.cilindro, perfil = D.perfil, letrero = D.letrero;
  var BL = CRG_BOB_BL, NE = CRG_BOB_NE, NA = CRG_BOB_NA, GR = '#2A2C2F';
  var bl = function(code, w, h, d, x, y, z, r, rot){ return bloque(code, w, h, d, 'pintura', BL, x, y, z, r, rot); };

  var XB = M.con / 2, XT = XB - M.voladizo, XD = XT - M.bat, XF = XB - M.sin, XP = XB - M.con;
  var R = M.r, AT = M.at, TR = (M.ancho - AT) / 2, H = M.alto;
  var zi = TR - AT / 2 - 0.02;                       /* cara interior de las llantas */
  var ZA = TR + AT / 2 - 0.10;                       /* brazos, sobre el borde de las llantas */
  var e = (M.alto - 1.97) / 0.10;                    /* 0 en el S570, 1 en el S650 */

  /* ═══ chasis: tina blanca entre las ruedas y laterales negros ═══ */
  bl('42023615', XB - 0.06 - (XF + 0.30), 0.48, zi * 2, (XF + 0.30 + XB - 0.06) / 2, 0.52, 0, 0.06);
  [-1, 1].forEach(function(s){
    /* caja de cadenas: costado negro con la tapa del motor de traslacion */
    bloque(null, M.bat + 0.70, 0.30, 0.05, 'mate', GR, (XD + XT) / 2, 0.42, s * (zi + 0.02), 0.02);
    cil(s > 0 ? 'TML' : null, 0.10, 0.10, 0.08, 'metal', '#3A3E43', (XD + XT) / 2, 0.40, s * (zi + 0.05), [Math.PI / 2, 0, 0], 18);
    /* guardabarros blancos sobre las llantas, con el costado negro de rejillas */
    bl(null, M.bat + 2 * R + 0.06, 0.06, AT + 0.14, (XD + XT) / 2, 2 * R + 0.07, s * TR, 0.02);
    bloque(null, M.bat + 0.30, 0.34, 0.04, 'mate', GR, (XD + XT) / 2 + 0.10, 2 * R + 0.30, s * (zi + 0.07), 0.02);
    for(var v = 0; v < 4; v++) bloque(null, 0.04, 0.20, 0.02, 'mate', '#0B0C0E', XT - 0.55 + v * 0.07, 2 * R + 0.30, s * (zi + 0.095), 0.004);
  });

  /* ═══ compartimiento del motor atras: tapa blanca, puerta trasera negra con rejilla ═══ */
  bl('ENG1', XB - 0.06 - (XT - 0.25), 0.40, zi * 2 + 0.04, (XT - 0.25 + XB - 0.06) / 2, 0.98, 0, 0.06);
  bloque(null, XB - 0.20 - (XT - 0.15), 0.03, zi * 2 - 0.20, 'mate', '#BDBDB8', (XT - 0.15 + XB - 0.20) / 2, 1.19, 0, 0.005);
  bloque('RAD1', 0.06, 0.62, zi * 2 - 0.20, 'pintura', NE, XB - 0.03, 0.80, 0, 0.02);
  crgMalla(D, XB + 0.005, XB + 0.005, 0.60, 1.05, 0, 0.05, '#3A3E43', 0.012);
  D.lamas('RAD1', XB + 0.02, 0.58, 1.05, -zi + 0.20, zi - 0.20, 6, NE, 1);
  letrero(texRotulo3d(function(g, w, h){ g.fillStyle = NE; g.fillRect(0, 0, w, h); g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'italic bold ' + Math.round(h * 0.62) + 'px "Arial Black", Arial, sans-serif'; g.fillText('Bobcat', w / 2, h * 0.55, w * 0.9); }, 256, 64),
    0.42, 0.10, XB + 0.08, 1.13, 0, Math.PI / 2);
  bloque(null, 0.08, 0.10, 0.30, 'metal', '#2E3238', XB + 0.02, 0.30, 0, 0.02);

  /* ═══ torres traseras blancas con las colas rojas ═══ */
  var texCola = texRotulo3d(crgRotuloModeloBob(modelo), 128, 256);
  [-1, 1].forEach(function(s){
    var z = s * (ZA - 0.02);
    perfil('42023615', [[XT - 0.30, 2 * R + 0.10], [XB - 0.02, 2 * R + 0.10], [XB - 0.02, 1.32], [XB - 0.22, 1.50], [XT + 0.05, 1.55], [XT - 0.30, 1.10]],
      0.12, z, 'pintura', BL, 0.03);
    /* cola: caja roja en la esquina con la placa del modelo y el faro trasero */
    bloque(null, 0.20, 0.50, 0.16, 'pintura', NA, XB - 0.08, 1.05, s * (ZA + 0.02), 0.03);
    letrero(texCola, 0.14, 0.36, XB - 0.08, 1.07, s * (ZA + 0.105), s > 0 ? 0 : Math.PI);
    crgLuz(D, s > 0 ? 'FPI' : 'FPD', XB + 0.02, 1.18, s * (ZA + 0.02), 1, 0.10, 0.12, '#C2241B');
    crgLuz(D, 'LSM', XB + 0.02, 1.00, s * (ZA + 0.02), 1, 0.10, 0.10, '#F2A31A');
  });

  /* ═══ cabina ROPS negra ═══ */
  var CX0 = XF + 0.42, CX1 = XT - 0.22, CZ = 0.47, CY0 = 0.74;
  crgCabina(D, G, { x0: CX0, x1: CX1, z0: -CZ, z1: CZ, y0: CY0, yV: 0.86, y1: H, inc: 0.0, hT: 0.10, poste: 0.07,
    base: NE, marco: NE, techo: NE, techo2: GR, puerta: 0, malla: true, volante: false, espejos: false, faros: false,
    asiento: 0.32, vidrio: '#0E151C' });
  /* puerta delantera de vidrio con su marco y manija */
  bloque(null, 0.04, H - 0.14 - 0.90, 0.05, 'mate', NE, CX0 - 0.01, (H - 0.14 + 0.90) / 2, 0, 0.01);
  bloque(null, 0.03, 0.04, 0.10, 'cromo', null, CX0 - 0.03, 1.30, 0.30, 0.008);
  /* palancas de mando junto al asiento */
  [-1, 1].forEach(function(s){
    tubo(s > 0 ? 'JLH' : 'JRH', [CX1 - 0.40, CY0 + 0.45, s * 0.26], [CX1 - 0.50, CY0 + 0.70, s * 0.26], 0.018, 'mate', '#111214', 8);
    D.pon(null, new THREE.SphereGeometry(0.035, 10, 8), 'mate', '#111214', CX1 - 0.51, CY0 + 0.72, s * 0.26);
  });
  /* faros de trabajo en el techo, adelante y atras */
  [-1, 1].forEach(function(s){
    crgLuz(D, s > 0 ? 'FDI' : 'FDD', CX0 - 0.06, H - 0.09, s * (CZ - 0.10), -1, 0.12, 0.08);
    crgLuz(D, 'LSM', CX1 + 0.06, H - 0.09, s * (CZ - 0.10), 1, 0.12, 0.08);
  });

  /* ═══ brazos de levante vertical ═══ */
  var Pa = [XT + 0.10, 1.62],            /* cola del brazo, sobre el eslabon superior */
      Pk = [CX0 + 0.12, 1.40 + 0.05 * e],/* codo, junto al frente de la cabina */
      Pb = [XF + 0.14, 0.42];            /* pin del Bob-Tach */
  var texLogo = texRotulo3d(crgRotuloBobcat, 512, 128);
  [-1, 1].forEach(function(s){
    var z = s * ZA;
    perfil(null, crgPoli([[Pa[0] + 0.10, Pa[1] - 0.02], Pa, Pk, Pb], [0.20, 0.24, 0.22, 0.16]), 0.10, z, 'pintura', BL, 0.025);
    /* eslabones: superior (torre-cola del brazo) e inferior de control */
    crgViga(D, 'PYB', [XB - 0.18, 1.50], Pa, z - s * 0.10, 0.06, 0.10, 'pintura', BL);
    crgViga(D, 'PYB', [XT - 0.15, 0.95], crgEn(Pa, Pk, 0.22), z - s * 0.10, 0.06, 0.10, 'pintura', BL);
    crgPerno(D, 'PYB', Pa, z, 0.06, 0.24, BL);
    crgPerno(D, null, [XB - 0.18, 1.50], z - s * 0.10, 0.05, 0.12, BL);
    crgPerno(D, 'PYB', Pb, z, 0.055, 0.16, BL);
    /* cilindro de levante en la torre */
    D.cilHidD(s > 0 ? 'PHY' : 'HRH', [XT + 0.30, 0.55, s * (ZA - 0.13)], [crgEn(Pa, Pk, 0.35)[0], crgEn(Pa, Pk, 0.35)[1] - 0.10, s * (ZA - 0.13)], 0.05, NE, 0.62);
    /* cilindro de volteo al frente, del travesano al Bob-Tach */
    D.cilHidD(s > 0 ? 'PVL' : 'PHY', [Pk[0] - 0.12, Pk[1] - 0.10, s * (ZA - 0.14)], [XF + 0.10, 0.92, s * (ZA - 0.14)], 0.045, NE, 0.55);
    /* placa Bobcat en el brazo */
    var pm = crgEn(Pa, Pk, 0.48), ang = Math.atan2(Pk[1] - Pa[1], Pk[0] - Pa[0]);
    var lg = letrero(texLogo, 0.52, 0.13, pm[0], pm[1], z + s * 0.052, s > 0 ? 0 : Math.PI);
    lg.rotation.z = s > 0 ? ang - Math.PI : -(ang - Math.PI);
  });
  /* travesano de los brazos, bajo, delante de la puerta (no tapa el vidrio) */
  var Pt = crgEn(Pk, Pb, 0.55);
  tubo(null, [Pt[0], Pt[1], -ZA], [Pt[0], Pt[1], ZA], 0.06, 'pintura', BL, 18);
  /* mangueras auxiliares por el brazo izquierdo */
  tubo('LPH', [Pk[0] - 0.05, Pk[1] + 0.02, ZA - 0.07], [XF + 0.25, 0.70, ZA - 0.07], 0.016, 'goma', '#202326', 8);

  /* ═══ Bob-Tach y cucharon negro ═══ */
  bloque(null, 0.10, 0.70, M.cuch - 0.20, 'pintura', GR, XF + 0.06, 0.44, 0, 0.03);
  [-1, 1].forEach(function(s){
    tubo(null, [XF + 0.12, 0.35, s * 0.25], [XF + 0.12, 0.80, s * 0.25], 0.018, 'metal', '#5A5F66', 8);
    D.pon(null, new THREE.SphereGeometry(0.03, 10, 8), 'pintura', NA, XF + 0.12, 0.81, s * 0.25);
  });
  crgCucharon(D, { xe: XP, Dp: XF - XP - 0.01, H: 0.64 + 0.03 * e, ancho: M.cuch, col: '#1E2023', col2: '#151618', esp: 0.025,
    dientes: 0, colDiente: '#3A3E43' });

  /* ═══ llantas 10-16.5 / 12-16.5 en aros naranjas ═══ */
  /* la masa de ruedaDet esta hecha para llantas mineras (sobresale 30 cm): aqui
     se arma sin ella y se le pone un disco chico con sus ocho tuercas */
  var LL = { r: R, ancho: AT, rAro: R * 0.53, aro: NA, aro2: '#B5360F', paso: 0.13 };
  [['LL1', XD, 1], ['LL2', XD, -1], ['LL3', XT, 1], ['LL4', XT, -1]].forEach(function(q){
    var gr = D.ruedaDet(q[0], q[1], q[2] * TR, 0, LL), s = q[2], rA = R * 0.53, zf = s * AT * 0.36;
    var mk = function(geo, mat, z){ var m = new THREE.Mesh(geo, mat); m.rotation.x = Math.PI / 2; m.position.z = z; m.castShadow = true; gr.add(m); return m; };
    mk(new THREE.CylinderGeometry(rA * 0.96, rA * 0.96, 0.03, 32), D.M.pintura(NA), zf);
    mk(new THREE.TorusGeometry(rA * 0.72, 0.012, 6, 32), D.M.pintura('#B5360F'), zf + s * 0.018).rotation.x = 0;
    mk(new THREE.CylinderGeometry(rA * 0.30, rA * 0.38, 0.07, 20), D.M.pintura(NA), zf + s * 0.04);
    mk(new THREE.CylinderGeometry(rA * 0.16, rA * 0.16, 0.03, 16), D.M.metal('#8E8E8A'), zf + s * 0.08);
    var tu = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.016, 0.016, 0.04, 6), D.M.metal('#9A9A96'), 8), d = new THREE.Object3D();
    for(var b = 0; b < 8; b++){
      var a = b / 8 * Math.PI * 2;
      d.position.set(Math.cos(a) * rA * 0.52, Math.sin(a) * rA * 0.52, zf + s * 0.025); d.rotation.set(Math.PI / 2, 0, 0);
      d.updateMatrix(); tu.setMatrixAt(b, d.matrix);
    }
    gr.add(tu);
  });

  G.userData.ruedas = D.ruedas;
  G.userData.mirarY = 0.95;
  G.userData.dist = 9.5;
  return G;
}

/* ═══ registro ═══ */
registrarModelo3d({
  nombre: 'CAT 992K',
  clave: function(e){ return /^992K/.test(mod3d(e)) ? 'CRG992K' : null; },
  construir: function(e, piezas){ return crgConstruir992K(piezas); }
});
registrarModelo3d({
  nombre: 'CAT 966 (nueva generacion)',
  clave: function(e){ return /^966/.test(mod3d(e)) && /CAT/i.test(String(e.marca || 'CAT')) ? 'CRG966' : null; },
  construir: function(e, piezas){ return crgConstruir966(piezas); }
});
registrarModelo3d({
  nombre: 'Volvo L150H y L180H',
  clave: function(e){ var m = mod3d(e); return /^L150/.test(m) ? 'CRGL150H' : /^L180/.test(m) ? 'CRGL180H' : null; },
  construir: function(e, piezas, clave){ return crgConstruirVolvo(/L180/.test(clave) ? 'L180H' : 'L150H', piezas); }
});
registrarModelo3d({
  nombre: 'Bobcat S570 y S650',
  clave: function(e){ var m = mod3d(e); return /^S570/.test(m) ? 'CRGS570' : /^S650/.test(m) ? 'CRGS650' : null; },
  construir: function(e, piezas, clave){ return crgConstruirBobcat(/S650/.test(clave) ? 'S650' : 'S570', piezas); }
});
