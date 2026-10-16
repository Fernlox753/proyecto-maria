/* ══════════════════════════════════════════════════════════════════
   CARGADORES Y TORRES (segundo lote) — modelos de detalle de:
     CAT 962H (C-81) · CAT 980H (C-73, C-74, C-79) · CAT 980L (C-356-AL)
     CAT 988H (C-46) · retroexcavadora CAT 420E (RE-56)
     torres de iluminacion Terex RL4000 (EI-55, EI-58…) y Magnum MLT4060 (EI-78)

   Todos con el frente hacia -X, arriba +Y y la izquierda del operador +Z.
   Las herramientas comunes de los cargadores (cabina, cucharon, varillaje en
   Z, ejes, articulacion) son copia de las de modelo_cargadores.js con el
   prefijo cgt; las de las torres, copia de modelo_torres.js con el prefijo
   cgtT (mas la lampara redonda de halogenuro que aqui hace falta). No se
   llama a nada de esos dos archivos: si cambian, estos modelos no se mueven.

   Llantas en la numeracion de SAP: LL1 delantera izquierda, LL2 delantera
   derecha, LL3 trasera izquierda, LL4 trasera derecha (en las torres LL1 la
   izquierda y LL2 la derecha).

   Codigos SAP que se ponen en las piezas: CBN cabina, ENG1 capot o motor,
   RAD1 rejillas del radiador, AL1 alternador, TRM transmision, CON
   convertidor, DIFD/DIFP diferenciales, BMLH/BMRH/BPLH/BPRH bocamazas,
   DLH/DRH/MLH/MRH mandos finales, LPN cucharon, GET cuchilla y dientes, PVL
   cilindro de volteo, PHY e HRH cilindros de levante, SLH/SRH direccion, PYB
   pines, TQC1/TQH1 tanques, BAT baterias, TAB tablero electrico, EC
   controlador, HAR y 42065915 arneses (el mazo que corre por el bastidor y
   el de la cabina), SEN engrase centralizado, AAC aire acondicionado, LSM y
   FDI/FDD/FPI/FPD luces, CIR circulina, 42023615 bastidores, LPH mangueras,
   TLH1 turbo (en las torres Terex, donde SAP lo tiene cargado).
   ══════════════════════════════════════════════════════════════════ */
var CGT_CAT = '#DE9A08', CGT_CAT2 = '#A87405', CGT_NEGRO = '#1B1D20', CGT_GRIS = '#3B4148', CGT_GRIS2 = '#5B636C',
    CGT_PERNO = '#4A4F55', CGT_ROJO = '#D52B1E';

/* ═══ utilidades y conjuntos copiados de modelo_cargadores.js ═══ */
/* ═══ utilidades ═══ */

/* punto a la fraccion t entre a y b (plano XY) */
function cgtEn(a, b, t){ return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; }
/* p corrido d metros en perpendicular al tramo a-b (positivo hacia arriba) */
function cgtNormal(a, b, p, d){
  var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  if(ny < 0){ nx = -nx; ny = -ny; }
  return [p[0] + nx * d, p[1] + ny * d];
}
/* poligonal gruesa: el contorno cerrado de una linea con un alto en cada vertice
   (asi salen los brazos curvos de una sola pieza, no de cajas sueltas) */
function cgtPoli(pts, altos){
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
function cgtViga(D, code, a, b, z, ancho, alto, tipo, hex, r){
  var dx = b[0] - a[0], dy = b[1] - a[1];
  return D.bloque(code, Math.hypot(dx, dy), alto, ancho, tipo, hex, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z,
    r === undefined ? Math.min(0.03, alto * 0.2, ancho * 0.2) : r, [0, 0, Math.atan2(dy, dx)]);
}
/* arco (guardabarros) alrededor de (x, y): anillo entre rIn y rOut, de a0 a a1
   (angulos desde +X, o sea desde atras), extruido a lo ancho en Z */
function cgtArco(D, code, x, y, rIn, rOut, a0, a1, zc, ancho, tipo, hex){
  var pts = [], n = 22, i, t;
  for(i = 0; i <= n; i++){ t = a0 + (a1 - a0) * i / n; pts.push([x + Math.cos(t) * rOut, y + Math.sin(t) * rOut]); }
  for(i = n; i >= 0; i--){ t = a0 + (a1 - a0) * i / n; pts.push([x + Math.cos(t) * rIn, y + Math.sin(t) * rIn]); }
  return D.perfil(code, pts, ancho, zc, tipo, hex, 0.025);
}
/* perno con su buje: el ojo del color de la maquina y el pasador de acero que asoma */
function cgtPerno(D, code, p, z, r, largo, hex){
  D.cilindro(null, r, r, largo, 'pintura', hex, p[0], p[1], z, [Math.PI / 2, 0, 0], 24);
  D.cilindro(code, r * 0.52, r * 0.52, largo + 0.06, 'metal', CGT_PERNO, p[0], p[1], z, [Math.PI / 2, 0, 0], 14);
}
/* escalerilla vertical; eje 'x': peldanos a lo largo de X (se sube mirando a ±Z),
   eje 'z': peldanos a lo ancho (se sube mirando a ±X) */
function cgtEscalerilla(D, x, z, y0, y1, ancho, eje, hexL, hexP){
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
function cgtEscaleraInc(D, a, b, z, ancho, hexL, hexP, hexB){
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
function cgtLuz(D, code, x, y, z, s, w, h, mica){
  D.bloque(null, 0.10, h + 0.05, w + 0.05, 'mate', '#202327', x, y, z, 0.02);
  D.bloque(code, 0.03, h, w, 'vidrio', mica || '#F4EDCF', x + s * 0.055, y, z, 0.008);
}
/* circulina ambar que brilla un poco */
function cgtBaliza(D, G, x, y, z, r){
  r = r || 0.07;
  D.cilindro(null, r * 1.15, r * 1.25, 0.05, 'mate', '#202327', x, y + 0.025, z, null, 16);
  var b = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.85, r, r * 1.9, 16),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.45, roughness: 0.3 }));
  b.position.set(x, y + 0.05 + r * 0.95, z);
  D.reg('CIR', b, '#F0A41C');
}
/* rejilla de malla (barras finas en dos sentidos) sobre un plano z = cte, una sola malla */
function cgtMalla(D, x0, x1, y0, y1, z, paso, hex, grosor){
  var g = grosor || 0.012, nx = Math.max(1, Math.round((x1 - x0) / paso)), ny = Math.max(1, Math.round((y1 - y0) / paso));
  var inst = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), D.M.mate(hex), nx + ny + 2);
  var d = new THREE.Object3D(), k = 0, i;
  for(i = 0; i <= nx; i++){ d.position.set(x0 + (x1 - x0) * i / nx, (y0 + y1) / 2, z); d.scale.set(g, y1 - y0, g); d.updateMatrix(); inst.setMatrixAt(k++, d.matrix); }
  for(i = 0; i <= ny; i++){ d.position.set((x0 + x1) / 2, y0 + (y1 - y0) * i / ny, z); d.scale.set(x1 - x0, g, g); d.updateMatrix(); inst.setMatrixAt(k++, d.matrix); }
  D.reg(null, inst, hex);
  return inst;
}
/* lamas horizontales en un costado (cara que mira a ±Z): rejillas de enfriamiento laterales */
function cgtLamasZ(D, code, x0, x1, y0, y1, z, s, n, hexMarco){
  D.bloque(code, x1 - x0 + 0.08, y1 - y0 + 0.08, 0.05, 'mate', hexMarco, (x0 + x1) / 2, (y0 + y1) / 2, z, 0.015);
  var paso = (y1 - y0) / n, inst = new THREE.InstancedMesh(new THREE.BoxGeometry(x1 - x0, paso * 0.62, 0.035), D.M.mate('#0B0C0E'), n);
  var d = new THREE.Object3D();
  for(var i = 0; i < n; i++){
    d.position.set((x0 + x1) / 2, y0 + paso * (i + 0.5), z + s * 0.03); d.rotation.set(-s * 0.55, 0, 0);
    d.updateMatrix(); inst.setMatrixAt(i, d.matrix);
  }
  D.reg(null, inst, '#0B0C0E');
}

/* el CAT de Caterpillar: letras blancas y el triangulo amarillo bajo la A */
function cgtLetrasCAT(g, x, y, alto, tinta){
  g.font = 'bold ' + Math.round(alto) + 'px "Arial Black", Arial, sans-serif';
  g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  g.fillStyle = tinta || '#FFFFFF';
  g.fillText('CAT', x, y);
  var wC = g.measureText('C').width, wA = g.measureText('A').width, xa = x + wC + wA / 2;
  g.fillStyle = CGT_CAT;
  g.beginPath(); g.moveTo(xa - wA * 0.20, y); g.lineTo(xa + wA * 0.20, y); g.lineTo(xa, y - alto * 0.30); g.closePath(); g.fill();
  return g.measureText('CAT').width;
}

/* ═══ conjuntos comunes ═══ */

/* cabina con base, postes (los del frente siguen el parabrisas inclinado),
   vidrios con marco, techo con alero, puerta, asiento, volante, espejos,
   limpiaparabrisas, faros de techo y circulina.
   o: x0 frente arriba, x1 atras, z0 z1, y0 piso, yV pie de los vidrios, y1 techo,
      inc adelanto del pie del parabrisas, base/marco/techo colores, puerta (+1/-1),
      xPuerta (poste de la puerta), malla (rejilla en los vidrios laterales) */
function cgtCabina(D, G, o){
  var inc = o.inc || 0, hT = o.hT || 0.16, cz = (o.z0 + o.z1) / 2, d = o.z1 - o.z0, e = o.poste || 0.10;
  var xa = o.x0 - inc, yA = o.yV, yB = o.y1 - hT, vidH = o.vidrio || '#0C131B';
  /* base hasta el pie de los vidrios */
  D.bloque('CBN', o.x1 - xa, yA - o.y0, d, 'pintura', o.base, (xa + o.x1) / 2, (o.y0 + yA) / 2, cz, 0.05);
  /* techo con alero adelante */
  D.bloque('CBN', o.x1 - o.x0 + 0.18, hT, d + 0.12, 'pintura', o.techo, (o.x0 + o.x1) / 2 - 0.05, o.y1 - hT / 2, cz, 0.05);
  D.bloque(null, o.x1 - o.x0 - 0.30, 0.05, d - 0.30, 'mate', o.techo2 || o.techo, (o.x0 + o.x1) / 2 + 0.05, o.y1 + 0.02, cz, 0.02);
  /* postes y travesanos */
  [o.z0 + e / 2, o.z1 - e / 2].forEach(function(z){
    cgtViga(D, 'CBN', [xa + e / 2, yA], [o.x0 + e / 2, yB], z, e, e, 'pintura', o.marco);
    D.bloque('CBN', e, yB - yA, e, 'pintura', o.marco, o.x1 - e / 2, (yA + yB) / 2, z, 0.025);
    if(o.xPuerta) D.bloque(null, e * 0.7, yB - yA, e * 0.8, 'pintura', o.marco, o.xPuerta, (yA + yB) / 2, z, 0.02);
    D.bloque(null, o.x1 - xa, 0.06, e * 0.9, 'pintura', o.marco, (xa + o.x1) / 2, yA + 0.03, z, 0.02);
  });
  D.bloque(null, e, 0.06, d, 'pintura', o.marco, o.x1 - e / 2, yA + 0.03, cz, 0.02);
  /* vidrios: laterales trapecio, parabrisas inclinado, luneta */
  [o.z0 + 0.025, o.z1 - 0.025].forEach(function(z){
    D.perfil(null, [[xa + e, yA + 0.06], [o.x1 - e, yA + 0.06], [o.x1 - e, yB - 0.02], [o.x0 + e, yB - 0.02]], 0.02, z, 'vidrio', vidH, 0.004);
    if(o.malla) cgtMalla(D, xa + e + 0.06, o.x1 - e - 0.04, yA + 0.10, yB - 0.06, z + (z > cz ? 0.02 : -0.02), 0.09, '#0E0F11', 0.010);
  });
  cgtViga(D, null, [xa + 0.03, yA + 0.05], [o.x0 + 0.03, yB - 0.02], cz, d - 2 * e + 0.02, 0.02, 'vidrio', vidH, 0.004);
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
      cgtLuz(D, s > 0 ? 'FDI' : 'FDD', o.x0 - 0.14, o.y1 - hT / 2, z, -1, 0.20, 0.10);
      cgtLuz(D, s > 0 ? 'FPI' : 'FPD', o.x1 + 0.12, o.y1 - hT / 2, z, 1, 0.20, 0.10);
    });
  }
  if(o.baliza) cgtBaliza(D, G, o.baliza[0], o.y1 + 0.04, o.baliza[1]);
}

/* cucharon: costados con su perfil, piso, talon redondeado, espalda, techo
   con guarda de derrame, cuchilla, dientes o cuchilla empernada y orejas.
   o: xe (filo, X), Dp (fondo), H (alto), ancho, col, B y Q (pines), zB (orejas
   del brazo), zQ (orejas del eslabon), dientes (n), lDiente, colDiente */
function cgtCucharon(D, o){
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
  tramos.forEach(function(t){ cgtViga(D, 'LPN', [X(t[0][0]), t[0][1]], [X(t[1][0]), t[1][1]], 0, wi, esp, 'pintura', c, 0.015); });
  cgtViga(D, 'LPN', [X(Dp * 0.42), H - 0.02], [X(Dp * 0.28), H + 0.16 * H], 0, wi, esp, 'pintura', c, 0.015);
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
function cgtVarillaje(D, P){
  var c = P.col, c2 = P.col2 || c, rP = P.rPerno || 0.14;
  [-1, 1].forEach(function(s){
    var z = s * P.zBr;
    D.perfil(null, cgtPoli([P.A, P.K, P.B], P.hBr), P.eBr, z, 'pintura', c, 0.03);
    /* chapa de refuerzo sobre el codo */
    D.perfil(null, cgtPoli([cgtEn(P.A, P.K, 0.55), P.K, cgtEn(P.K, P.B, 0.35)], [P.hBr[1] * 0.70, P.hBr[1] * 0.75, P.hBr[2] * 0.70]),
      0.03, z + s * (P.eBr / 2 + 0.012), 'pintura', c2, 0.008);
    cgtPerno(D, 'PYB', P.A, z, rP * 1.25, P.eBr + 0.14, c);
    cgtPerno(D, 'PYB', P.B, z, rP * 1.10, P.eBr + 0.10, c);
    /* cilindro de levante: base en el bastidor, vastago al brazo */
    D.cilHidD(s > 0 ? 'PHY' : 'HRH', [P.L0[0], P.L0[1], s * P.zL], [P.L1[0], P.L1[1], s * P.zL], P.rL, P.colCil, 0.58);
    cgtPerno(D, 'PYB', P.L1, s * P.zL, P.rL * 1.1, P.rL * 2.6, c);
    cgtPerno(D, null, P.L0, s * P.zL, P.rL * 1.1, P.rL * 2.6, c2);
  });
  /* tubo transversal entre los brazos, en el pivote de la palanca */
  D.cilindro(null, P.rTubo || rP * 1.3, P.rTubo || rP * 1.3, 2 * P.zBr, 'pintura', c, P.L[0], P.L[1], 0, [Math.PI / 2, 0, 0], 26);
  /* palanca: dos chapas T-L-U */
  [-1, 1].forEach(function(s){
    D.perfil(null, cgtPoli([P.T, P.L, P.U], [P.hP * 0.8, P.hP * 1.15, P.hP * 0.8]), 0.08, s * P.dzP, 'pintura', c, 0.02);
  });
  [P.T, P.L, P.U].forEach(function(p, i){ cgtPerno(D, i === 1 ? 'PYB' : null, p, 0, P.hP * 0.42, 2 * P.dzP + 0.12, c); });
  /* eslabon de volteo, entre las chapas, hasta el cucharon */
  D.perfil(null, cgtPoli([P.U, P.Q], [P.hP * 0.55, P.hP * 0.55]), 2 * P.dzP - 0.10, 0, 'pintura', c2, 0.02);
  cgtPerno(D, 'PYB', P.Q, 0, P.hP * 0.30, 2 * P.zQ + 0.16, c);
  /* cilindro de volteo al centro, de la torre a la punta de la palanca */
  D.cilHidD('PVL', [P.C0[0], P.C0[1], 0], [P.T[0], P.T[1], 0], P.rV, P.colCil, 0.60);
  cgtPerno(D, null, P.C0, 0, P.rV * 1.1, P.rV * 2.6, c2);
  /* mangueras del volteo y del levante */
  [-1, 1].forEach(function(s){
    D.tubo('LPH', [P.C0[0] - 0.05, P.C0[1] - 0.20, s * 0.20], [cgtEn(P.C0, P.T, 0.35)[0], cgtEn(P.C0, P.T, 0.35)[1] - P.rV, s * 0.16], 0.03, 'goma', '#202326', 8);
    D.tubo('LPH', [P.L0[0] + 0.10, P.L0[1] + 0.25, s * (P.zL - 0.12)], [cgtEn(P.L0, P.L1, 0.4)[0], cgtEn(P.L0, P.L1, 0.4)[1], s * (P.zL - P.rL - 0.03)], 0.028, 'goma', '#202326', 8);
  });
}

/* ejes, diferenciales, bocamazas y mandos finales; transmision y cardanes */
function cgtEjes(D, o){
  [[o.XD, 'DIFD', 'BMLH', 'BMRH', 'DLH', 'DRH', 1], [o.XT, 'DIFP', 'BPLH', 'BPRH', 'MLH', 'MRH', -1]].forEach(function(q){
    var x = q[0], y = o.R, zi = o.TR - o.AT * 0.42, rd = o.rDif;
    D.pon(q[1], new THREE.SphereGeometry(rd, 28, 18), 'pintura', o.colEje, x, y, 0);
    /* nariz del pinon hacia la transmision */
    D.cilindro(q[1], rd * 0.45, rd * 0.62, rd * 0.9, 'pintura', o.colEje, x + q[6] * rd * 1.1, y, 0, [0, 0, Math.PI / 2], 20);
    [-1, 1].forEach(function(s){
      var zc = s * (zi + rd * 0.6) / 2;
      D.cilindro(null, o.rTubo, rd * 0.70, zi - rd * 0.6, 'pintura', o.colEje, x, y, zc, [s * Math.PI / 2, 0, 0], 24);
      D.cilindro(s > 0 ? q[2] : q[3], o.rMasa, o.rMasa * 0.92, o.AT * 0.14, 'metal', CGT_GRIS, x, y, s * (zi - o.AT * 0.07), [Math.PI / 2, 0, 0], 28);
      D.cilindro(s > 0 ? q[4] : q[5], o.rMasa * 0.82, o.rMasa * 0.82, o.AT * 0.10, 'metal', CGT_GRIS2, x, y, s * (zi - o.AT * 0.19), [Math.PI / 2, 0, 0], 28);
      /* soportes del eje al bastidor */
      D.bloque(null, rd * 1.2, rd * 0.5, 0.20, 'pintura', o.colEje, x, y + o.rTubo + rd * 0.2, s * zi * 0.55, 0.03);
    });
  });
  /* transmision y convertidor bajo el bastidor trasero, cardanes con cruceta */
  D.bloque('TRM', o.trm[2], o.trm[3], o.trm[4], 'metal', CGT_GRIS, o.trm[0], o.trm[1], 0, 0.06);
  for(var i = 0; i < 3; i++) D.bloque(null, 0.04, o.trm[3] + 0.04, o.trm[4] + 0.04, 'metal', CGT_GRIS2, o.trm[0] - o.trm[2] * 0.3 + i * o.trm[2] * 0.3, o.trm[1], 0, 0.01);
  D.cilindro('CON', o.trm[3] * 0.48, o.trm[3] * 0.48, o.trm[2] * 0.35, 'metal', CGT_GRIS2, o.trm[0] + o.trm[2] * 0.62, o.trm[1] + o.trm[3] * 0.08, 0, [0, 0, Math.PI / 2], 28);
  var xa = o.trm[0] - o.trm[2] / 2, xb = o.trm[0] + o.trm[2] / 2, yc = o.trm[1] - o.trm[3] * 0.30, rc = o.rCardan;
  D.tubo(null, [xa, yc, 0], [o.XH, (yc + o.R) / 2 + 0.05, 0], rc, 'metal', '#5E646B', 14);
  D.tubo(null, [o.XH, (yc + o.R) / 2 + 0.05, 0], [o.XD + o.rDif * 1.6, o.R, 0], rc, 'metal', '#5E646B', 14);
  D.tubo(null, [xb - o.trm[2] * 0.2, yc, 0], [o.XT - o.rDif * 1.6, o.R, 0], rc, 'metal', '#5E646B', 14);
  D.cilindro('FDP', rc * 3.2, rc * 3.2, 0.06, 'metal', '#6E747B', xa - 0.06, yc, 0, [0, 0, Math.PI / 2], 24);
  D.bloque(null, 0.18, 0.22, 0.30, 'metal', CGT_GRIS, o.XH, (yc + o.R) / 2 + 0.05, 0, 0.03);
}

/* articulacion: lengua del bastidor delantero, pines verticales y cilindros de direccion */
function cgtArticulacion(D, o){
  [o.yA, o.yB].forEach(function(y){
    D.bloque('42023615', o.lLengua, 0.14, o.anchoL, 'pintura', o.colF, o.XH - o.lLengua * 0.25, y, 0, 0.03);
    D.bloque(null, o.lLengua * 0.55, 0.12, o.anchoL * 1.15, 'pintura', o.colR, o.XH + o.lLengua * 0.30, y + 0.14, 0, 0.03);
    D.cilindro('PYB', o.rPin, o.rPin, 0.44, 'metal', CGT_PERNO, o.XH, y + 0.07, 0, null, 18);
    D.cilindro(null, o.rPin * 1.5, o.rPin * 1.5, 0.05, 'metal', '#2E3238', o.XH, y + 0.30, 0, null, 18);
  });
  [-1, 1].forEach(function(s){
    D.cilHidD(s > 0 ? 'SLH' : 'SRH', [o.XH + o.lDir * 0.55, o.yDir, s * o.zDir], [o.XH - o.lDir * 0.45, o.yDir, s * (o.zDir - 0.10)], o.rDir, o.colCil, 0.55);
  });
}

/* ═══ rotulos de los cargadores ═══ */

/* la placa negra del capot de la serie H y L: CAT, el modelo y el corte rojo */
function cgtRotuloModelo(txt){
  return function(g, w, h){
    g.fillStyle = CGT_NEGRO; g.fillRect(0, 0, w, h);
    var wc = cgtLetrasCAT(g, w * 0.04, h * 0.84, h * 0.76);
    g.fillStyle = '#FFFFFF'; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.50) + 'px "Arial Narrow", Arial, sans-serif';
    g.fillText(txt, w * 0.08 + wc, h * 0.54, w * 0.74 - wc);
    /* el corte: franja roja y filo amarillo inclinados en la punta de atras */
    g.fillStyle = CGT_ROJO;
    g.beginPath(); g.moveTo(w * 0.86, h); g.lineTo(w * 0.93, 0); g.lineTo(w, 0); g.lineTo(w, h); g.closePath(); g.fill();
    g.fillStyle = CGT_CAT;
    g.beginPath(); g.moveTo(w * 0.83, h); g.lineTo(w * 0.90, 0); g.lineTo(w * 0.915, 0); g.lineTo(w * 0.845, h); g.closePath(); g.fill();
  };
}
/* CAT solo, negro sobre amarillo (pluma de la retro) o blanco sobre negro */
function cgtRotuloCAT(fondo, tinta){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    cgtLetrasCAT(g, w * 0.08, h * 0.84, h * 0.78, tinta);
  };
}

/* numero de unidad en los dos costados (plano transparente con la textura) */
function cgtNumero(G, tex, w, h, x, y, z){
  [-1, 1].forEach(function(s){
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, transparent: true, roughness: 0.5 }));
    m.position.set(x, y, s * z); m.rotation.y = s > 0 ? 0 : Math.PI; G.add(m);
  });
}

/* ═══════════════════════════════════════════════════════════════════
   CAT 962H, 980H y 980L — cargadores medianos

   Specalog de la serie H (datos de la hoja reproducidos por RitchieSpecs):
                                962H     980H     980L
     batalla                    3.353    3.700    3.800
     largo con cucharon         8.153    9.473    9.516
     eje trasero al contrapeso  1.954    2.493    2.565 (supuesto)
     eje trasero a la articul.  1.676    1.850    1.900 (supuesto)
     techo del ROPS             3.453    3.764    3.813
     capot                      2.463    2.716    2.83  (supuesto)
     escape                     3.368    3.716    3.75  (supuesto)
     despeje                    0.411    0.442    0.48
     ancho sobre llantas        2.795    3.225    3.296
     trocha                     2.20 *   2.440    2.440
     llantas                    23.5R25  29.5R25  29.5R25
     cucharon (ancho)           2.95     3.53     3.53  (GP con dientes)
   (* la trocha del 962H sale del ancho sobre llantas menos una llanta.)
   El 980L es el de mercados emergentes (motor C13), con la carroceria de la
   serie K: capot que baja hacia atras y rejilla grande en la cola; su hoja
   (Trakindo) da batalla 3.800, trocha 2.440, ancho 3.296 y ROPS 3.813.

   Lo no acotado (brazo, palanca, bastidor delantero, cabina) se arma con
   las proporciones del 966 de modelo_cargadores.js llevadas a la batalla de
   cada uno; la cabina y el capot salen de las fotos del 980H (Werdohl,
   Wikimedia Commons): cabina negra con techo amarillo, capot casi plano que
   cae en curva a la rejilla, ventana negra de enfriamiento atras en el
   costado, placa negra CAT 980H, escape negro y prefiltro delante, guardafango
   ancho sobre la rueda trasera, escalera bajo la puerta (izquierda) y
   varillaje en Z con un cilindro de volteo al centro.
   ═══════════════════════════════════════════════════════════════════ */
var CGT_H = {
  '962H': { WB: 3.353, cola: 1.954, hitch: 1.676, largo: 8.153, rops: 3.453, capot: 2.463, escape: 3.368, despeje: 0.41,
            trocha: 2.20, R: 0.808, AT: 0.60, cuch: 2.95, Hc: 1.28, dientes: 8, estilo: 'H' },
  '980H': { WB: 3.700, cola: 2.493, hitch: 1.850, largo: 9.473, rops: 3.764, capot: 2.716, escape: 3.716, despeje: 0.44,
            trocha: 2.44, R: 0.925, AT: 0.75, cuch: 3.53, Hc: 1.45, dientes: 9, estilo: 'H' },
  '980L': { WB: 3.800, cola: 2.565, hitch: 1.900, largo: 9.516, rops: 3.813, capot: 2.83, escape: 3.75, despeje: 0.48,
            trocha: 2.44, R: 0.925, AT: 0.75, cuch: 3.53, Hc: 1.50, dientes: 9, estilo: 'K' }
};
function cgtConstruirH(modelo, piezas){
  var M = CGT_H[modelo];
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var bloque = D.bloque, tubo = D.tubo, cil = D.cilindro, perfil = D.perfil, letrero = D.letrero;
  var AM = CGT_CAT, AM2 = CGT_CAT2, NE = CGT_NEGRO, K = M.estilo === 'K';
  var am = function(code, w, h, d, x, y, z, r, rot){ return bloque(code, w, h, d, 'pintura', AM, x, y, z, r, rot); };

  /* escalas: k lleva las cotas del 966 (frente) a este modelo; e las del 980H (atras) */
  var k = M.WB / 3.55, e = M.WB / 3.70;
  var XB = M.largo / 2, XT = XB - M.cola, XD = XT - M.WB, XH = XT - M.hitch, XP = -M.largo / 2;
  var R = M.R, AT = M.AT, TR = M.trocha / 2, YR = M.rops, YK = M.capot;
  /* punto del dibujo del 966 (x, y) llevado a este modelo, desde el eje delantero */
  var f = function(x, y){ return [XD + (x + 1.35) * k, y * k]; };

  /* ═══ bastidor trasero ═══ */
  var yRiel = R + 0.06;
  [-1, 1].forEach(function(s){
    bloque('42023615', XB - 0.40 - (XH + 0.25), 0.66 * e, 0.24 * e, 'pintura', AM2, (XH + 0.25 + XB - 0.40) / 2, yRiel, s * 0.48 * e, 0.04);
    bloque(null, XB - 0.50 - (XH + 0.30), 0.03, 0.27 * e, 'pintura', AM, (XH + 0.30 + XB - 0.50) / 2, yRiel + 0.34 * e, s * 0.48 * e, 0.01);
  });
  am('42023615', 0.50 * e, 1.05 * e, 1.18 * e, XH + 0.42 * e, yRiel, 0, 0.05);
  [XT - 0.55 * e, XT + 0.75 * e].forEach(function(x){ bloque('42023615', 0.26 * e, 0.50 * e, 0.96 * e, 'pintura', AM2, x, yRiel, 0, 0.03); });

  /* ═══ cabina: base amarilla y cabina negra con el techo amarillo ═══ */
  var XC0 = XH - 0.12 * e, XC1 = XH + 1.62 * e, ZC = 0.80 * e, YC0 = YR - 1.86 * e;
  am(null, XC1 - XC0 + 0.10, YC0 - (yRiel + 0.20), 1.76 * e, (XC0 + XC1) / 2 + 0.03, (YC0 + yRiel + 0.20) / 2, 0, 0.06);
  bloque(null, XC1 - XC0 + 0.14, 0.05, 1.80 * e, 'mate', '#26292D', (XC0 + XC1) / 2 + 0.03, YC0 - 0.02, 0, 0.01);
  cgtCabina(D, G, { x0: XC0, x1: XC1, z0: -ZC, z1: ZC, y0: YC0, yV: YC0 + 0.22 * e, y1: YR, inc: K ? 0.16 * e : 0.10 * e, hT: 0.17 * e,
    base: NE, marco: NE, techo: AM, techo2: AM2, puerta: 1, xPuerta: XC0 + 0.95 * e, asideros: NE, espejos: true,
    baliza: [XC1 - 0.22, ZC - 0.22], asiento: 0.50 * e });
  /* aire acondicionado y antena en el techo; CAT sobre el parabrisas */
  bloque('AAC', 0.72 * e, 0.13, 1.00 * e, 'mate', CGT_GRIS, XC1 - 0.48 * e, YR + 0.07, 0, 0.03);
  tubo(null, [XC1 - 0.12, YR, -ZC + 0.20], [XC1 - 0.12, YR + 0.55, -ZC + 0.20], 0.008, 'mate', '#111', 6);
  var texCAT = texRotulo3d(cgtRotuloCAT(AM, '#16181C'), 256, 96);
  letrero(texCAT, 0.42 * e, 0.13 * e, XC0 - 0.105, YR - 0.085 * e, 0, -Math.PI / 2);
  /* arnes de la cabina que baja por el poste trasero derecho (42065915) */
  tubo('42065915', [XC1 - 0.06, YC0 + 0.05, -ZC - 0.03], [XC1 - 0.06, YR - 0.35, -ZC - 0.03], 0.022, 'goma', '#1C1E21', 8);
  /* tablero electrico detras de la cabina, a la derecha */
  am('TAB', 0.24 * e, 0.62 * e, 0.62 * e, XC1 + 0.18 * e, YC0 + 0.24 * e, -0.48 * e, 0.03);
  bloque(null, 0.03, 0.50 * e, 0.50 * e, 'mate', '#202327', XC1 + 0.31 * e, YC0 + 0.24 * e, -0.48 * e, 0.01);

  /* ═══ capot: casi plano y cae en curva a la rejilla (H) o baja hacia atras (K) ═══ */
  var X0 = XC1 + 0.14, X1 = XB - 0.22 * e, YB0 = yRiel + 0.28 * e, ZK = 0.90 * e;
  var cap = K
    ? [[X0, YB0], [X0, YK - 0.06], [X0 + 0.16, YK], [X1 - 1.10 * e, YK - 0.30 * e], [X1 - 0.35 * e, YK - 0.52 * e], [X1 - 0.05, YK - 0.66 * e], [X1, YK - 0.72 * e], [X1, YB0]]
    : [[X0, YB0], [X0, YK - 0.06], [X0 + 0.14, YK], [X1 - 0.75 * e, YK - 0.05], [X1 - 0.30 * e, YK - 0.20 * e], [X1 - 0.06, YK - 0.48 * e], [X1, YK - 0.62 * e], [X1, YB0]];
  perfil('ENG1', cap, 2 * ZK, 0, 'pintura', AM, 0.10);
  /* tapa de servicio arriba y sus juntas */
  if(!K) bloque(null, (X1 - X0) * 0.55, 0.02, 2 * ZK - 0.50, 'mate', '#7A5A08', X0 + (X1 - X0) * 0.38, YK + 0.065, 0, 0.005);
  var texMod = texRotulo3d(cgtRotuloModelo(modelo), 512, 112);
  [-1, 1].forEach(function(s){
    var zs = s * (ZK + 0.07);
    /* juntas de las puertas laterales y manijas */
    [X0 + 0.35 * e, X0 + (X1 - X0) * 0.52].forEach(function(x){ bloque(null, 0.02, YK - YB0 - 0.40, 0.02, 'mate', '#7A5A08', x, (YK + YB0) / 2 - 0.10, zs - s * 0.005, 0.004); });
    [X0 + 0.80 * e, X0 + (X1 - X0) * 0.72].forEach(function(x){ bloque(null, 0.14, 0.035, 0.035, 'cromo', null, x, YB0 + 0.45 * e, zs + s * 0.01, 0.01); });
    /* ventana negra de enfriamiento atras, con lamas */
    if(K) cgtLamasZ(D, 'RAD1', X1 - 1.05 * e, X1 - 0.45 * e, YB0 + 0.22 * e, YK - 0.68 * e, zs, s, 8, NE);
    else cgtLamasZ(D, 'RAD1', X1 - 0.78 * e, X1 - 0.40 * e, YB0 + 0.26 * e, YK - 0.28 * e, zs, s, 9, NE);
    /* placa CAT con el modelo, adelante y arriba */
    letrero(texMod, 1.10 * e, 0.24 * e, X0 + 0.80 * e, YK - 0.36 * e, zs + s * 0.012, s > 0 ? 0 : Math.PI);
  });
  /* rejilla del radiador en la cola */
  var yr0 = YB0 + 0.08, yr1 = K ? YK - 0.84 * e : YK - 0.74 * e;
  bloque(null, 0.08, yr1 - yr0 + 0.10, 2 * ZK - 0.62, 'mate', NE, X1 + 0.04, (yr0 + yr1) / 2, 0, 0.03);
  D.lamas('RAD1', X1 + 0.10, yr0, yr1, -ZK + 0.40, ZK - 0.40, K ? 10 : 9, NE, 1);
  /* escape negro y prefiltro, delante del capot */
  var xe = X0 + (K ? 0.55 : 0.85) * e;
  cil(null, 0.15 * e, 0.16 * e, 0.08, 'mate', NE, xe, YK + 0.03, -0.26 * e, null, 18);
  cil(null, 0.10 * e, 0.11 * e, M.escape - 0.12 - YK, 'mate', '#202226', xe, (YK + M.escape - 0.12) / 2, -0.26 * e, null, 18);
  cil(null, 0.10 * e, 0.10 * e, 0.22, 'mate', '#202226', xe + 0.05, M.escape - 0.08, -0.26 * e, [0, 0, -0.5], 18);
  cil(null, 0.075, 0.075, 0.22, 'mate', NE, X0 + 0.38 * e, YK + 0.10, 0.36 * e, null, 14);
  D.pon(null, new THREE.SphereGeometry(0.17 * e, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), 'mate', NE, X0 + 0.38 * e, YK + 0.21, 0.36 * e);
  cil(null, 0.17 * e, 0.17 * e, 0.10, 'vidrio', '#5A6470', X0 + 0.38 * e, YK + 0.18, 0.36 * e, null, 18);
  /* alternador asomado bajo el capot, adelante a la derecha */
  cil('AL1', 0.10 * e, 0.10 * e, 0.16 * e, 'metal', CGT_GRIS2, X0 + 0.32 * e, YB0 - 0.06, -0.62 * e, [Math.PI / 2, 0, 0], 16);

  /* ═══ guardafangos traseros: arco ancho amarillo con faldon de goma ═══ */
  [-1, 1].forEach(function(s){
    cgtArco(D, null, XT, R, R + 0.06, R + 0.15 * e, 0.10, Math.PI - 0.28, s * TR, AT + 0.16, 'pintura', AM);
    /* tapa plana sobre el arco que hace de pasillo, y su escuadra al capot */
    am(null, 1.25 * e, 0.06, TR + AT / 2 - ZK - 0.02, XT - 0.05, R + 0.20 * e, s * (ZK + (TR + AT / 2 - ZK) / 2), 0.02);
    bloque(null, 0.05, 0.70 * e, AT * 0.90, 'goma', '#16181A', XT - R * 0.94, R * 0.70, s * TR, 0.01, [0, 0, 0.35]);
  });

  /* ═══ contrapeso con luces, enganche y peldanos ═══ */
  var XCP = XT + 0.62 * e;
  am(null, XB - XCP, 0.98 * e, 2.46 * e, (XB + XCP) / 2, R * 0.98, 0, 0.16);
  bloque(null, XB - XCP - 0.30, 0.04, 2.30 * e, 'pintura', AM2, (XB + XCP) / 2 - 0.05, R * 0.98 + 0.49 * e, 0, 0.01);
  bloque(null, 0.12, 0.28, 0.42, 'metal', '#2E3238', XB + 0.03, R * 0.72, 0, 0.03);
  cil(null, 0.04, 0.04, 0.30, 'metal', '#5A5F66', XB + 0.10, R * 0.72, 0, null, 12);
  [-1, 1].forEach(function(s){
    cgtLuz(D, s > 0 ? 'FPI' : 'FPD', XB + 0.01, R * 0.98 + 0.25 * e, s * 0.98 * e, 1, 0.24, 0.13, '#C2241B');
    cgtLuz(D, 'LSM', XB + 0.01, R * 0.98 + 0.25 * e, s * 0.68 * e, 1, 0.15, 0.13, '#F2A31A');
    bloque(null, 0.30, 0.04, 0.24, 'metal', '#3A3E43', XB - 0.45 * e, 0.42 * R, s * 1.12 * e, 0.008);
    tubo(null, [XB - 0.45 * e, 0.44 * R, s * 1.0 * e], [XB - 0.45 * e, R * 0.98 - 0.45 * e, s * 1.0 * e], 0.02, 'pintura', NE, 8);
    /* faros de trabajo traseros en la cola del capot */
    cgtLuz(D, 'LSM', X1 + 0.06, YK - (K ? 0.90 : 0.80) * e, s * (ZK - 0.17), 1, 0.20, 0.12);
  });
  bloque('BAT', 0.50 * e, 0.32 * e, 0.42 * e, 'mate', NE, XCP + 0.05, R * 0.98 + 0.66 * e, -1.05 * e, 0.03);
  /* tanque de combustible en el bastidor trasero, delante del contrapeso */
  am('TQC1', 0.70 * e, 0.62 * e, 1.40 * e, XT + 0.40 * e, 0.80 * R, 0, 0.06);
  cil(null, 0.08, 0.08, 0.10, 'mate', NE, XT + 0.40 * e, 0.80 * R + 0.36 * e, 0.55 * e, null, 14);

  /* ═══ escalera bajo la puerta (izquierda), pasamanos y tanque hidraulico (derecha) ═══ */
  cgtEscalerilla(D, XC0 + 0.62 * e, ZC + 0.16, 0.42 * R, YC0 - 0.02, 0.46, 'x', NE, '#3A3E43');
  tubo(null, [XC0 + 0.32 * e, YC0 + 0.10, ZC + 0.12], [XC0 + 0.32 * e, YC0 + 0.95 * e, ZC + 0.12], 0.02, 'pintura', NE, 8);
  am('TQH1', 0.62 * e, 0.66 * e, 0.42 * e, XC0 + 0.62 * e, yRiel + 0.08, -0.70 * e, 0.06);
  bloque(null, 0.05, 0.30 * e, 0.03, 'vidrio', '#9BB7C9', XC0 + 0.40 * e, yRiel + 0.08, -0.92 * e, 0.01);
  /* mazo de cables principal a lo largo del bastidor (HAR) */
  [-1, 1].forEach(function(s){
    tubo(s > 0 ? 'HAR' : 'LPH', [XH + 0.40, yRiel + 0.38 * e, s * 0.62 * e], [XT + 0.70 * e, yRiel + 0.38 * e, s * 0.62 * e], 0.026, 'goma', '#1C1E21', 8);
  });

  /* ═══ bastidor delantero, guardafangos amarillos y faros ═══ */
  var bastD = [[XH + 0.28, 0.48 * k], [XH + 0.28, 1.30 * k], f(0.05, 1.42), f(-0.28, 2.40), f(-0.95, 2.44), f(-1.15, 1.95),
               f(-1.90, 1.45), f(-2.08, 1.10), f(-1.75, 0.88), f(-0.95, 0.80), f(-0.10, 0.48)];
  [-1, 1].forEach(function(s){ perfil('42023615', bastD, 0.09 * k, s * 0.42 * k, 'pintura', AM, 0.025); });
  am('42023615', 0.65 * k, 0.26 * k, 0.75 * k, f(-0.60, 0)[0], 2.28 * k, 0, 0.04);
  am(null, 0.08, 0.40 * k, 0.75 * k, f(-2.04, 0)[0], 1.15 * k, 0, 0.02);
  [-1, 1].forEach(function(s){
    cgtArco(D, null, XD, R, R + 0.07, R + 0.13, 0.45, 2.50, s * TR, AT + 0.14, 'pintura', AM);
    bloque(null, 0.10, 0.10, TR - 0.45 * k, 'pintura', AM2, XD + 0.12, R + 0.86, s * (0.45 * k + (TR - 0.45 * k) / 2), 0.02);
    am(null, 0.16, 0.26, 0.24, f(-1.08, 0)[0], 2.05 * k, s * 0.30 * k, 0.03);
    D.faro(s > 0 ? 'FDI' : 'FDD', f(-1.17, 0)[0], 2.05 * k, s * 0.30 * k, 0.08 * k);
  });
  bloque('SEN', 0.26 * k, 0.32 * k, 0.20 * k, 'mate', CGT_GRIS, f(-0.10, 0)[0], 1.70 * k, 0.55 * k, 0.03);
  cil(null, 0.06 * k, 0.06 * k, 0.22 * k, 'metal', CGT_GRIS2, f(-0.10, 0)[0], 1.97 * k, 0.55 * k, null, 12);

  cgtArticulacion(D, { XH: XH, yA: 1.30 * k, yB: 0.52 * k, lLengua: 0.55 * k, anchoL: 0.65 * k, rPin: 0.09 * k, colF: AM, colR: AM2,
    lDir: 1.10 * k, yDir: 0.88 * k, zDir: 0.58 * k, rDir: 0.08 * k, colCil: AM2 });
  cgtEjes(D, { XD: XD, XT: XT, R: R, TR: TR, AT: AT, rDif: 0.36 * k, rTubo: 0.20 * k, rMasa: 0.34 * k, colEje: AM2,
    trm: [XH + 0.78 * e, 0.80 * k, 0.90 * e, 0.55 * k, 0.60 * k], rCardan: 0.06 * k, XH: XH });

  /* ═══ brazo en Z y cucharon de uso general con dientes ═══ */
  var A = f(-0.74, 2.02), Kd = f(-1.95, 1.62), B = f(-2.909, 0.45);
  var L = cgtEn(Kd, B, 0.30), T = f(-2.36, 2.26), U = [L[0] + 0.12 * k, L[1] - 0.52 * k], Q = [B[0] + 0.08 * k, B[1] + 0.62 * k];
  cgtVarillaje(D, { A: A, K: Kd, B: B, zBr: 0.60 * k, eBr: 0.16 * k, hBr: [0.52 * k, 0.48 * k, 0.38 * k], col: AM, col2: AM2, colCil: AM, rPerno: 0.09 * k,
    L: L, T: T, U: U, Q: Q, dzP: 0.10 * k, zQ: 0.13 * k, hP: 0.26 * k, C0: f(-0.58, 2.30), rV: 0.11 * k, rTubo: 0.13 * k,
    L0: f(-0.55, 0.98), L1: cgtNormal(A, Kd, cgtEn(A, Kd, 0.62), -0.24 * k), rL: 0.10 * k, zL: 0.60 * k });
  cgtCucharon(D, { xe: XP + 0.30 * k, Dp: (B[0] - 0.10 * k) - (XP + 0.30 * k), H: M.Hc, ancho: M.cuch, col: AM, col2: AM2, esp: 0.045,
    dientes: M.dientes, lDiente: 0.30 * k, colDiente: '#5A5E63', B: B, Q: Q, zB: 0.60 * k, eB: 0.12 * k, rB: 0.09 * k, zQ: 0.13 * k, rQ: 0.08 * k });

  /* ═══ llantas en aros amarillos ═══ */
  var LLc = { r: R, ancho: AT, rAro: R * 0.44, aro: AM, aro2: AM2, pernos: 20, paso: 0.26 * R / 0.875 };
  D.ruedaDet('LL1', XD, TR, 1, LLc);
  D.ruedaDet('LL2', XD, -TR, -1, LLc);
  D.ruedaDet('LL3', XT, TR, 1, LLc);
  D.ruedaDet('LL4', XT, -TR, -1, LLc);

  var texNum = texNumero3d(null, '#16181C');
  cgtNumero(G, texNum, 0.80 * e, 0.25 * e, XB - 0.48 * e, R * 0.98 + 0.10, 1.235 * e);

  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = 1.75 * e;
  G.userData.dist = 23 * e;
  return G;
}

/* ═══════════════════════════════════════════════════════════════════
   CAT 988H — cargador grande (C-46)

   Specalog 988H (datos reproducidos por RitchieSpecs y Equipment World):
   batalla 4.550, largo con cucharon en el suelo 11.765, eje delantero a la
   articulacion 2.274, eje trasero al parachoques 3.133, techo de la cabina
   4.128, escape 4.112, filtro de aire 3.383, capot 3.156, despeje 0.51,
   ancho sobre llantas 3.58, llantas 35/65R33 (radio ~1.0, 0.89 de ancho;
   la trocha 2.69 sale del ancho sobre llantas), cucharon de roca de
   6.4 m3 y 3.81 de ancho.

   Del dibujo y las fotos (Wikimedia Commons, Cat988H.jpg y las del
   Steinbruchtag de Wuppertal): cabina negra con techo amarillo sobre una
   plataforma a la altura del techo de las llantas, columna amarilla bajo la
   cabina (aqui los tanques), barandas amarillas alrededor de la plataforma,
   capot alto con la placa CAT 988H y la ventana negra de enfriamiento atras,
   escape negro y prefiltro delante del capot, escalerillas en las esquinas
   del parachoques. El brazo, la palanca y el cilindro de volteo (uno, al
   centro, casi horizontal) son los del 992K de modelo_cargadores.js
   llevados a la batalla del 988H (factor 0.7725).
   ═══════════════════════════════════════════════════════════════════ */
function cgtConstruir988H(piezas){
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var bloque = D.bloque, tubo = D.tubo, cil = D.cilindro, perfil = D.perfil, letrero = D.letrero;
  var AM = CGT_CAT, AM2 = CGT_CAT2, NE = CGT_NEGRO, BAR = AM;
  var am = function(code, w, h, d, x, y, z, r, rot){ return bloque(code, w, h, d, 'pintura', AM, x, y, z, r, rot); };

  var k = 4.55 / 5.89;
  var XB = 11.765 / 2, XT = XB - 3.133, XD = XT - 4.55, XH = XD + 2.274, XP = -11.765 / 2;
  var R = 1.00, AT = 0.89, TR = 2.69 / 2;
  var YPL = 2.18, YR = 4.128, YK = 3.156, ZD = 1.76;
  /* punto del dibujo del 992K llevado al 988H, desde el eje delantero */
  var f = function(x, y){ return [XD + (x + 2.217) * k, y * k]; };

  /* ═══ bastidor trasero ═══ */
  [-0.62, 0.62].forEach(function(z){
    bloque('42023615', XB - 0.45 - (XH + 0.35), 0.86, 0.28, 'pintura', AM2, (XH + 0.35 + XB - 0.45) / 2, 1.30, z, 0.05);
    bloque(null, XB - 0.55 - (XH + 0.40), 0.03, 0.31, 'pintura', AM, (XH + 0.40 + XB - 0.55) / 2, 1.745, z, 0.01);
  });
  [XT - 0.70, XT + 0.90, XB - 1.00].forEach(function(x){ bloque('42023615', 0.28, 0.66, 1.05, 'pintura', AM2, x, 1.30, 0, 0.03); });
  am('42023615', 0.60, 1.45, 1.45, XH + 0.55, 1.30, 0, 0.06);

  /* ═══ columna bajo la cabina: los tanques (combustible izq., hidraulico der.; supuesto) ═══ */
  [-1, 1].forEach(function(s){
    am(s > 0 ? 'TQC1' : 'TQH1', 1.20, YPL - 0.92, 1.02, XH + 0.95, (YPL + 0.92) / 2, s * 0.62, 0.08);
    bloque(null, 0.05, 0.55, 0.04, 'vidrio', '#9BB7C9', XH + 0.42, 1.45, s * 1.14, 0.01);
    bloque(null, 0.025, YPL - 1.10, 0.02, 'mate', '#7A5A08', XH + 1.30, (YPL + 0.95) / 2, s * 1.135, 0.004);
  });
  cil(null, 0.09, 0.09, 0.10, 'mate', NE, XH + 0.60, YPL - 0.02, 0.85, null, 14);

  /* ═══ plataforma: piso de chapa antideslizante sobre las ruedas traseras ═══ */
  var XPL0 = XH - 0.20, XPL1 = XT + 0.62;
  am(null, XPL1 - XPL0, 0.12, ZD * 2, (XPL0 + XPL1) / 2, YPL - 0.06, 0, 0.03);
  bloque(null, XPL1 - XPL0 - 0.08, 0.015, ZD * 2 - 0.08, 'mate', '#4B4F55', (XPL0 + XPL1) / 2, YPL + 0.005, 0, 0.004);
  [-1, 1].forEach(function(s){
    am(null, XPL1 - XPL0, 0.42, 0.08, (XPL0 + XPL1) / 2, YPL - 0.27, s * (ZD - 0.04), 0.03);
    /* faldones de goma detras de las ruedas traseras */
    bloque(null, 0.05, 0.95, AT * 0.95, 'goma', '#16181A', XT + R + 0.12, 1.20, s * TR, 0.01);
  });
  am(null, 0.10, 0.42, ZD * 2, XPL0 + 0.05, YPL - 0.27, 0, 0.03);

  /* ═══ cabina negra con techo amarillo ═══ */
  var XC0 = XH - 0.05, XC1 = XH + 1.50, ZC0 = -0.86, ZC1 = 0.98;
  cgtCabina(D, G, { x0: XC0 + 0.10, x1: XC1, z0: ZC0, z1: ZC1, y0: YPL, yV: YPL + 0.52, y1: YR, inc: 0.12, hT: 0.19,
    base: NE, marco: NE, techo: AM, techo2: AM2, puerta: 1, xPuerta: XC0 + 0.90, asideros: BAR, espejos: true,
    baliza: [XC1 - 0.25, ZC1 - 0.25], asiento: 0.62 });
  bloque('AAC', 0.85, 0.18, 1.10, 'mate', CGT_GRIS, XC1 - 0.55, YR + 0.10, (ZC0 + ZC1) / 2, 0.04);
  var texCAT = texRotulo3d(cgtRotuloCAT(AM, '#16181C'), 256, 96);
  letrero(texCAT, 0.52, 0.16, XC0 - 0.115, YR - 0.095, (ZC0 + ZC1) / 2, -Math.PI / 2);
  tubo('42065915', [XC1 - 0.06, YPL + 0.05, ZC0 - 0.03], [XC1 - 0.06, YR - 0.40, ZC0 - 0.03], 0.024, 'goma', '#1C1E21', 8);
  /* tablero electrico y baterias en la plataforma detras de la cabina, a la derecha */
  am('TAB', 0.30, 0.80, 0.70, XC1 + 0.32, YPL + 0.40, -1.30, 0.04);
  bloque(null, 0.03, 0.66, 0.56, 'mate', '#202327', XC1 + 0.48, YPL + 0.40, -1.30, 0.01);
  bloque('BAT', 0.62, 0.48, 0.55, 'mate', NE, XB - 0.95, 1.30, -1.20, 0.04);

  /* ═══ capot alto, rejilla y escape ═══ */
  var X0 = XC1 + 0.32, X1 = XB - 0.30, YB0 = 1.25, ZK = 1.10;
  var cap = [[X0, YB0], [X0, YK - 0.07], [X0 + 0.16, YK], [X1 - 0.85, YK - 0.06], [X1 - 0.32, YK - 0.24], [X1 - 0.06, YK - 0.55], [X1, YK - 0.72], [X1, YB0]];
  perfil('ENG1', cap, 2 * ZK, 0, 'pintura', AM, 0.11);
  bloque(null, (X1 - X0) * 0.55, 0.02, 2 * ZK - 0.60, 'mate', '#7A5A08', X0 + (X1 - X0) * 0.40, YK + 0.075, 0, 0.005);
  var texMod = texRotulo3d(cgtRotuloModelo('988H'), 512, 112);
  [-1, 1].forEach(function(s){
    var zs = s * (ZK + 0.08);
    [X0 + 0.55, X0 + (X1 - X0) * 0.50].forEach(function(x){ bloque(null, 0.02, YK - YPL - 0.25, 0.02, 'mate', '#7A5A08', x, (YK + YPL) / 2, zs - s * 0.005, 0.004); });
    [X0 + 1.05, X0 + (X1 - X0) * 0.70].forEach(function(x){ bloque(null, 0.16, 0.04, 0.04, 'cromo', null, x, YPL + 0.35, zs + s * 0.01, 0.01); });
    cgtLamasZ(D, 'RAD1', X1 - 0.85, X1 - 0.40, YB0 + 0.55, YK - 0.30, zs, s, 11, NE);
    letrero(texMod, 1.30, 0.285, X0 + 0.95, YK - 0.36, zs + s * 0.012, s > 0 ? 0 : Math.PI);
  });
  bloque(null, 0.08, YK - 0.80 - YB0, 2 * ZK - 0.68, 'mate', NE, X1 + 0.04, (YK - 0.70 + YB0) / 2, 0, 0.03);
  D.lamas('RAD1', X1 + 0.10, YB0 + 0.12, YK - 0.82, -ZK + 0.45, ZK - 0.45, 12, NE, 1);
  cil(null, 0.19, 0.20, 0.10, 'mate', NE, X0 + 0.42, YK + 0.04, -0.42, null, 20);
  cil(null, 0.14, 0.15, 4.112 - 0.14 - YK, 'mate', '#202226', X0 + 0.42, (YK + 4.112 - 0.14) / 2, -0.42, null, 20);
  cil(null, 0.14, 0.14, 0.26, 'mate', '#202226', X0 + 0.48, 4.112 - 0.10, -0.42, [0, 0, -0.5], 20);
  /* filtro de aire y prefiltros (techo del filtro a 3.383) */
  am(null, 0.60, 0.22, 0.85, X0 + 0.50, YK + 0.09, 0.45, 0.04);
  [0.25, 0.65].forEach(function(z){
    cil(null, 0.09, 0.09, 0.10, 'mate', NE, X0 + 0.50, YK + 0.25, z, null, 14);
    cil(null, 0.11, 0.11, 0.06, 'mate', NE, X0 + 0.50, 3.383 - 0.03, z, null, 16);
  });
  cil('AL1', 0.12, 0.12, 0.18, 'metal', CGT_GRIS2, X0 + 0.35, YB0 - 0.08, -0.78, [Math.PI / 2, 0, 0], 16);

  /* ═══ parachoques trasero con escalerillas y escalones a la plataforma ═══ */
  var XPA = XB - 0.95, YPA = 1.78;
  am(null, XB - XPA, YPA - 0.95, 3.20, (XB + XPA) / 2, (YPA + 0.95) / 2, 0, 0.10);
  bloque(null, XB - XPA - 0.10, 0.02, 3.10, 'mate', '#4B4F55', (XB + XPA) / 2, YPA + 0.01, 0, 0.005);
  bloque(null, 0.10, 0.22, 0.50, 'metal', '#2E3238', XB + 0.03, 1.15, 0, 0.03);
  [-1, 1].forEach(function(s){
    cgtEscalerilla(D, XB - 0.03, s * 1.30, 0.50, 0.95, 0.42, 'z', AM2, '#3A3E43');
    cgtLuz(D, s > 0 ? 'FPI' : 'FPD', XB + 0.02, 1.55, s * 1.42, 1, 0.24, 0.14, '#C2241B');
    cgtLuz(D, 'LSM', XB + 0.02, 1.25, s * 0.82, 1, 0.20, 0.12, '#F2A31A');
    cgtLuz(D, 'LSM', X1 + 0.08, YK - 0.95, s * (ZK - 0.20), 1, 0.22, 0.13);
    /* escalones del parachoques a la plataforma, por el costado del capot */
    cgtEscaleraInc(D, [XPA + 0.05, YPA], [XPL1 + 0.02, YPL], s * 1.45, 0.55, BAR, '#3A3E43', BAR);
    /* baranda de las esquinas traseras */
    D.baranda([[XPA + 0.25, s * 1.55], [XB - 0.06, s * 1.55], [XB - 0.06, s * 1.15]], YPA, 1.0, BAR);
    /* tapa del costado entre la rueda trasera y el parachoques */
    am(null, XPA - (XT + R + 0.15), 0.70, 0.08, (XPA + XT + R + 0.15) / 2, 1.42, s * 1.12, 0.02);
  });

  /* ═══ barandas amarillas de la plataforma ═══ */
  D.baranda([[XPL1 - 0.05, ZD - 0.06], [XPL0 + 0.06, ZD - 0.06], [XPL0 + 0.06, -ZD + 0.06], [XPL1 - 0.05, -ZD + 0.06]], YPL, 1.05, BAR);
  /* pasamanos verticales a los lados del frente del capot, donde termina la plataforma */
  [-1, 1].forEach(function(s){ tubo(null, [X0 - 0.05, YPL, s * (ZK + 0.18)], [X0 - 0.05, YK + 0.55, s * (ZK + 0.18)], 0.028, 'pintura', BAR, 10); });
  D.escalera(XPL0 - 0.02, 1.45, 0.62, YPL, 0.45, AM2, '#3A3E43');

  /* ═══ bastidor delantero ═══ */
  var bastD = [[XH + 0.32, 0.70], [XH + 0.32, 1.70], f(-0.55, 2.35), f(-0.62, 4.02), f(-1.55, 4.08), f(-1.85, 3.30),
               f(-2.75, 2.55), f(-3.30, 2.15), f(-3.30, 1.55), f(-2.80, 1.48), f(-1.60, 1.48), f(-0.75, 0.75)];
  [-1, 1].forEach(function(s){ perfil('42023615', bastD, 0.11, s * 0.50, 'pintura', AM, 0.03); });
  am('42023615', 0.75, 0.32, 1.10, f(-1.08, 0)[0], 3.85 * k, 0, 0.05);
  am(null, 0.12, 0.50, 1.10, f(-3.25, 0)[0], 1.85 * k, 0, 0.03);
  am(null, XH - f(-1.35, 0)[0], 0.10, 1.10, (XH + f(-1.35, 0)[0]) / 2, 1.75, 0, 0.02);
  [-1, 1].forEach(function(s){
    am(null, 0.18, 0.34, 0.30, f(-1.72, 0)[0], 3.62 * k, s * 0.36, 0.04);
    D.faro(s > 0 ? 'FDI' : 'FDD', f(-1.84, 0)[0], 3.62 * k, s * 0.36, 0.11);
    /* guardafangos delanteros cortos sobre la rueda */
    cgtArco(D, null, XD, R, R + 0.08, R + 0.15, 0.55, 2.30, s * TR, AT + 0.12, 'pintura', AM);
    bloque(null, 0.12, 0.12, TR - 0.55, 'pintura', AM2, XD + 0.10, R + 0.95, s * (0.55 + (TR - 0.55) / 2), 0.02);
  });
  bloque('SEN', 0.34, 0.40, 0.26, 'mate', CGT_GRIS, f(-0.30, 0)[0], 2.20, 0.66, 0.04);
  cil('GP1', 0.08, 0.08, 0.30, 'metal', CGT_GRIS2, f(-0.30, 0)[0], 2.55, 0.66, null, 14);

  cgtArticulacion(D, { XH: XH, yA: 1.62, yB: 0.70, lLengua: 0.75, anchoL: 0.78, rPin: 0.12, colF: AM, colR: AM2,
    lDir: 1.40, yDir: 1.10, zDir: 0.76, rDir: 0.11, colCil: AM2 });
  cgtEjes(D, { XD: XD, XT: XT, R: R, TR: TR, AT: AT, rDif: 0.48, rTubo: 0.30, rMasa: 0.44, colEje: AM2,
    trm: [XH + 1.20, 1.05, 1.15, 0.78, 0.82], rCardan: 0.09, XH: XH });

  /* ═══ brazo, varillaje en Z y cucharon de roca ═══ */
  var A = f(-1.267, 3.08), Kd = f(-3.347, 2.53), B = f(-5.587, 0.59);
  var L = cgtEn(Kd, B, 0.30), T = f(-4.327, 3.42), U = f(-4.527, 1.25), Q = f(-5.54, 1.55);
  cgtVarillaje(D, { A: A, K: Kd, B: B, zBr: 0.82 * k, eBr: 0.32 * k, hBr: [0.95 * k, 0.85 * k, 0.62 * k], col: AM, col2: AM2, colCil: AM, rPerno: 0.17 * k,
    L: L, T: T, U: U, Q: Q, dzP: 0.16 * k, zQ: 0.20 * k, hP: 0.46 * k, C0: f(-0.90, 3.88), rV: 0.20 * k, rTubo: 0.24 * k,
    L0: f(-1.087, 1.36), L1: cgtNormal(A, Kd, cgtEn(A, Kd, 0.66), -0.40 * k), rL: 0.21 * k, zL: 0.82 * k });
  cgtCucharon(D, { xe: XP + 0.30, Dp: (B[0] - 0.14 * k) - (XP + 0.30), H: 2.10 * k, ancho: 3.81, col: AM, col2: AM2, esp: 0.06,
    dientes: 8, lDiente: 0.36, colDiente: '#5A5E63', B: B, Q: Q, zB: 0.82 * k, eB: 0.22 * k, rB: 0.16 * k, zQ: 0.20 * k, rQ: 0.14 * k });

  /* ═══ llantas 35/65R33 en aros amarillos ═══ */
  var LL = { r: R, ancho: AT, rAro: R * 0.45, aro: AM, aro2: AM2, pernos: 24, paso: 0.34 };
  D.ruedaDet('LL1', XD, TR, 1, LL);
  D.ruedaDet('LL2', XD, -TR, -1, LL);
  D.ruedaDet('LL3', XT, TR, 1, LL);
  D.ruedaDet('LL4', XT, -TR, -1, LL);

  var texNum = texNumero3d(null, '#16181C');
  cgtNumero(G, texNum, 0.95, 0.30, X1 - 1.25, YB0 + 0.45, ZK + 0.09);

  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ texNum.userData.poner(id); };
  G.userData.mirarY = 2.2;
  G.userData.dist = 29;
  return G;
}

/* ═══════════════════════════════════════════════════════════════════
   CAT 420E — retroexcavadora cargadora (RE-56)

   Hoja 420E (RitchieSpecs y TractorData): largo de transporte 7.35, ancho
   de transporte 2.43, alto de transporte 3.58 (la pluma recogida), batalla
   2.20, despeje 0.32, techo de la cabina 2.82, escape 2.74; llantas
   delanteras 12.5/80-18 (radio 0.48) y traseras 19.5L-24 (radio 0.685);
   cucharon cargador de 1 m3 y 2.26 de ancho. Las trochas (1.86 adelante,
   1.72 atras) y el reparto del largo (2.25 del eje delantero a la punta del
   cucharon, 2.90 del eje trasero a la cola) son supuestos sobre las fotos.

   De las fotos (Cat420E left/right, Wikimedia Commons): capot amarillo
   angosto que baja hacia el frente con la parrilla negra, escape negro a la
   derecha delante de la cabina, cabina de vidrio grande con marco negro y
   techo amarillo sobre el eje trasero, guardafango trasero amarillo en arco,
   caja amarilla bajo la cabina, brazos del cargador desde la torre junto al
   parabrisas, y atras la torre de giro con dos estabilizadores y la pluma
   curva recogida (CAT en negro), el balancin colgando por fuera y el
   cucharon negro plegado abajo. Aqui los estabilizadores van apoyados.
   ═══════════════════════════════════════════════════════════════════ */
function cgtConstruir420E(piezas){
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var bloque = D.bloque, tubo = D.tubo, cil = D.cilindro, perfil = D.perfil, letrero = D.letrero;
  var AM = CGT_CAT, AM2 = CGT_CAT2, NE = CGT_NEGRO;
  var am = function(code, w, h, d, x, y, z, r, rot){ return bloque(code, w, h, d, 'pintura', AM, x, y, z, r, rot); };

  var XD = -1.45, XT = 0.75, XP = XD - 2.25;
  var Rd = 0.48, ATd = 0.32, TRd = 0.93, Rt = 0.685, ATt = 0.50, TRt = 0.86;
  var YR = 2.82;

  /* ═══ chasis: largueros y caja central ═══ */
  [-1, 1].forEach(function(s){ bloque('42023615', XT + 1.10 - (XD - 0.55), 0.42, 0.14, 'pintura', AM2, (XT + 1.10 + XD - 0.55) / 2, 0.70, s * 0.36, 0.03); });
  [XD + 0.40, XT - 0.45, XT + 0.75].forEach(function(x){ bloque('42023615', 0.14, 0.32, 0.72, 'pintura', AM2, x, 0.70, 0, 0.02); });

  /* ═══ frente: contrapeso, parrilla y capot angosto que baja hacia adelante ═══ */
  var XF = XD - 0.72, XC0 = -0.62;
  am(null, 0.32, 0.55, 0.92, XF + 0.10, 0.70, 0, 0.06);
  bloque(null, 0.10, 0.12, 0.40, 'metal', '#2E3238', XF - 0.08, 0.62, 0, 0.02);
  var capot = [[XF + 0.02, 0.96], [XF + 0.02, 1.38], [XF + 0.14, 1.52], [XC0 - 0.05, 1.74], [XC0 + 0.02, 1.70], [XC0 + 0.02, 0.96]];
  perfil('ENG1', capot, 0.90, 0, 'pintura', AM, 0.08);
  /* parrilla negra al frente y faros en las esquinas */
  bloque('RAD1', 0.06, 0.40, 0.62, 'mate', NE, XF - 0.035, 1.18, 0, 0.02);
  D.lamas('RAD1', XF - 0.065, 1.00, 1.36, -0.26, 0.26, 6, NE, -1);
  [-1, 1].forEach(function(s){
    am(null, 0.14, 0.18, 0.18, XF + 0.04, 1.40, s * 0.36, 0.03);
    D.faro(s > 0 ? 'FDI' : 'FDD', XF - 0.04, 1.40, s * 0.36, 0.065);
    /* rejillas del costado del capot y juntas */
    cgtLamasZ(D, null, XF + 0.65, XF + 1.05, 1.10, 1.42, s * 0.495, s, 6, NE);
    bloque(null, 0.02, 0.55, 0.02, 'mate', '#7A5A08', XF + 1.35, 1.25, s * 0.49, 0.004);
  });
  var texMod = texRotulo3d(cgtRotuloModelo('420E'), 512, 112);
  /* escape negro a la derecha y prefiltro a la izquierda, junto al parabrisas */
  cil(null, 0.06, 0.06, 2.74 - 1.70, 'mate', '#202226', XC0 - 0.25, (2.74 + 1.70) / 2, -0.30, null, 14);
  cil(null, 0.065, 0.065, 0.12, 'mate', NE, XC0 - 0.25, 2.70, -0.30, [0, 0, -0.45], 14);
  cil(null, 0.05, 0.05, 0.36, 'mate', NE, XC0 - 0.22, 1.90, 0.30, null, 12);
  D.pon(null, new THREE.SphereGeometry(0.10, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), 'mate', NE, XC0 - 0.22, 2.08, 0.30);

  /* ═══ cabina de vidrio grande, marco negro y techo amarillo ═══ */
  var XC1 = XT + 0.42, YC0 = 1.02, ZC = 0.74;
  cgtCabina(D, G, { x0: XC0, x1: XC1, z0: -ZC, z1: ZC, y0: YC0, yV: YC0 + 0.12, y1: YR, inc: 0.02, hT: 0.13, poste: 0.07,
    base: NE, marco: NE, techo: AM, techo2: AM2, puerta: 1, xPuerta: XC0 + 0.80, asideros: NE, espejos: true,
    baliza: [XC1 - 0.20, ZC - 0.20], asiento: 0.45 });
  var texCAT = texRotulo3d(cgtRotuloCAT(AM, '#16181C'), 256, 96);
  letrero(texCAT, 0.36, 0.105, XC0 - 0.095, YR - 0.065, 0, -Math.PI / 2);
  bloque('AAC', 0.55, 0.08, 0.80, 'mate', CGT_GRIS, XC1 - 0.45, YR + 0.04, 0, 0.02);
  /* consola del cargador y asiento girado hacia atras (se ven por el vidrio) */
  tubo(null, [XC0 + 0.55, YC0 + 0.10, -0.40], [XC0 + 0.62, YC0 + 0.85, -0.42], 0.025, 'mate', '#202327', 8);
  /* caja amarilla bajo la cabina (herramientas a la izquierda, tanques a la derecha; supuesto) */
  am(null, 0.62, 0.42, 0.32, XC0 + 0.62, 0.78, 0.60, 0.05);
  am('TQC1', 0.62, 0.42, 0.32, XC0 + 0.62, 0.78, -0.60, 0.05);
  am('TQH1', 0.40, 0.55, 0.30, XT + 0.70, 0.95, -0.55, 0.05);
  /* peldanos bajo la puerta */
  [0.42, 0.72].forEach(function(y, i){ bloque(null, 0.34, 0.035, 0.22, 'metal', '#3A3E43', XC0 + 0.50, y, 0.88 + i * 0.0, 0.008); });
  [XC0 + 0.33, XC0 + 0.67].forEach(function(x){ bloque(null, 0.04, 0.42, 0.04, 'pintura', AM, x, 0.62, 0.88, 0.01); });
  bloque('BAT', 0.30, 0.22, 0.22, 'mate', NE, XC0 + 0.62, 0.78, 0.30, 0.02);

  /* ═══ guardafangos: traseros amarillos en arco, delanteros negros ═══ */
  [-1, 1].forEach(function(s){
    cgtArco(D, null, XT, Rt, Rt + 0.05, Rt + 0.12, 0.12, Math.PI - 0.20, s * TRt, ATt + 0.10, 'pintura', AM);
    cgtArco(D, null, XD, Rd, Rd + 0.05, Rd + 0.10, 0.35, 2.75, s * TRd, ATd + 0.08, 'mate', '#1A1C1F');
    bloque(null, 0.08, 0.08, 0.30, 'mate', '#1A1C1F', XD, Rd + 0.40, s * (TRd - 0.25), 0.02);
  });

  /* ═══ ejes ═══ */
  [[XD, Rd, TRd, ATd, 'DIFD', 'BMLH', 'BMRH'], [XT, Rt, TRt, ATt, 'DIFP', 'BPLH', 'BPRH']].forEach(function(q){
    D.pon(q[4], new THREE.SphereGeometry(0.20, 20, 14), 'pintura', AM2, q[0], q[1], 0);
    cil(null, 0.09, 0.12, q[2] * 2 - q[3] * 0.9, 'pintura', AM2, q[0], q[1], 0, [Math.PI / 2, 0, 0], 18);
    [-1, 1].forEach(function(s){ cil(s > 0 ? q[5] : q[6], 0.15, 0.14, 0.10, 'metal', CGT_GRIS, q[0], q[1], s * (q[2] - q[3] * 0.48), [Math.PI / 2, 0, 0], 20); });
  });
  bloque('TRM', 0.75, 0.42, 0.45, 'metal', CGT_GRIS, XT - 0.75, 0.55, 0, 0.04);
  tubo(null, [XT - 1.15, 0.52, 0], [XD + 0.22, Rd, 0], 0.035, 'metal', '#5E646B', 12);
  D.cilHidD('SLH', [XD + 0.35, Rd + 0.08, 0.20], [XD + 0.05, Rd + 0.08, TRd - 0.30], 0.035, AM2, 0.55);

  /* ═══ cargador: torres, brazos, cilindros de levante y de volteo ═══ */
  var A = [XC0 + 0.10, 1.66], Kb = [XD - 0.10, 1.28], B = [XP + 0.92, 0.40], ZB = 0.66;
  [-1, 1].forEach(function(s){
    var z = s * ZB;
    /* torre del brazo junto al poste del parabrisas */
    perfil('42023615', [[XC0 - 0.12, 0.70], [XC0 + 0.30, 0.70], [XC0 + 0.30, 1.78], [XC0 - 0.02, 1.84], [XC0 - 0.30, 1.30]], 0.08, s * (ZB - 0.02), 'pintura', AM, 0.02);
    perfil(null, cgtPoli([A, Kb, B], [0.20, 0.22, 0.14]), 0.10, z, 'pintura', AM, 0.025);
    cgtPerno(D, 'PYB', A, z, 0.06, 0.20, AM);
    cgtPerno(D, 'PYB', B, z, 0.055, 0.18, AM);
    /* levante: del bastidor bajo el capot al brazo */
    var L0 = [XD + 0.55, 0.78], L1 = cgtNormal(A, Kb, cgtEn(A, Kb, 0.55), -0.12);
    D.cilHidD(s > 0 ? 'PHY' : 'HRH', [L0[0], L0[1], s * (ZB - 0.12)], [L1[0], L1[1], s * (ZB - 0.12)], 0.055, AM, 0.58);
    /* volteo: cilindro sobre el brazo, palanca y eslabon al cucharon */
    var C0 = cgtNormal(A, Kb, cgtEn(A, Kb, 0.20), 0.16), Tt = cgtNormal(Kb, B, cgtEn(Kb, B, 0.42), 0.30),
        Lv = cgtNormal(Kb, B, cgtEn(Kb, B, 0.48), 0.06), Uu = cgtNormal(Kb, B, cgtEn(Kb, B, 0.62), -0.18), Q = [B[0] + 0.02, B[1] + 0.40];
    D.cilHidD('PVL', [C0[0], C0[1], z], [Tt[0], Tt[1], z], 0.05, AM, 0.60);
    perfil(null, cgtPoli([Tt, Lv, Uu], [0.12, 0.15, 0.12]), 0.05, z + s * 0.08, 'pintura', AM2, 0.01);
    cgtPerno(D, null, Lv, z + s * 0.05, 0.04, 0.16, AM2);
    perfil(null, cgtPoli([Uu, Q], [0.08, 0.08]), 0.04, z - s * 0.02, 'pintura', AM2, 0.01);
    cgtPerno(D, 'PYB', Q, z, 0.04, 0.14, AM2);
    tubo('LPH', [C0[0] + 0.05, C0[1] - 0.10, s * (ZB - 0.08)], [XD + 0.20, 0.95, s * 0.45], 0.018, 'goma', '#202326', 8);
  });
  tubo(null, [cgtEn(Kb, B, 0.25)[0], cgtEn(Kb, B, 0.25)[1], -ZB], [cgtEn(Kb, B, 0.25)[0], cgtEn(Kb, B, 0.25)[1], ZB], 0.07, 'pintura', AM, 18);
  /* placa 420E en el brazo izquierdo */
  var pm = cgtEn(A, Kb, 0.55), ang = Math.atan2(Kb[1] - A[1], Kb[0] - A[0]);
  var lg = letrero(texMod, 0.62, 0.135, pm[0], pm[1], ZB + 0.052, 0); lg.rotation.z = ang - Math.PI;
  var lg2 = letrero(texMod, 0.62, 0.135, pm[0], pm[1], -ZB - 0.052, Math.PI); lg2.rotation.z = -(ang - Math.PI);
  /* cucharon de uso general con cuchilla empernada */
  cgtCucharon(D, { xe: XP, Dp: B[0] - 0.06 - XP, H: 0.82, ancho: 2.26, col: AM, col2: AM2, esp: 0.03, dientes: 0, colDiente: '#3A3E43',
    B: B, Q: [B[0] + 0.02, B[1] + 0.40], zB: ZB, eB: 0.07, rB: 0.06, zQ: ZB, rQ: 0.05 });

  /* ═══ atras: torre de giro, estabilizadores apoyados y retro recogida ═══ */
  var XS = XT + 1.20;
  am('42023615', 0.50, 0.60, 1.30, XS - 0.30, 0.82, 0, 0.05);
  /* torres de los estabilizadores, brazos inclinados, cilindros y zapatas */
  [-1, 1].forEach(function(s){
    var top = [XS - 0.30, 1.30, s * 0.58], pie = [XS - 0.18, 0.12, s * 1.12];
    bloque('42023615', 0.30, 0.95, 0.20, 'pintura', AM, XS - 0.30, 0.95, s * 0.58, 0.03);
    var brazo = new THREE.Vector3(pie[0] - top[0], pie[1] - top[1], pie[2] - top[2]);
    var vb = bloque(null, 0.18, brazo.length(), 0.16, 'pintura', AM, (top[0] + pie[0]) / 2, (top[1] + pie[1]) / 2, (top[2] + pie[2]) / 2, 0.03);
    vb.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), brazo.clone().normalize());
    D.cilHidD(null, [XS - 0.30, 1.55, s * 0.50], [XS - 0.22, 0.55, s * 1.00], 0.045, AM, 0.55);
    bloque(null, 0.40, 0.06, 0.30, 'metal', '#2E3238', pie[0], 0.03, pie[2], 0.01);
    bloque(null, 0.12, 0.10, 0.12, 'metal', '#3A3E43', pie[0], 0.10, pie[2], 0.01);
    /* luces traseras en las torres */
    cgtLuz(D, s > 0 ? 'FPI' : 'FPD', XS - 0.13, 1.30, s * 0.58, 1, 0.12, 0.10, '#C2241B');
    /* cilindros de giro */
    D.cilHidD(null, [XS - 0.55, 0.78, s * 0.42], [XS + 0.05, 0.80, s * 0.18], 0.05, AM, 0.55);
  });
  /* poste de giro */
  am('42023615', 0.30, 0.95, 0.60, XS + 0.02, 0.95, 0, 0.04);
  cil('PYB', 0.06, 0.06, 1.05, 'metal', CGT_PERNO, XS + 0.02, 0.95, 0, null, 14);

  /* pluma curva hacia atras, recogida (con CAT en negro) */
  var P0 = [XS + 0.12, 1.12], Pk = [XS + 0.78, 2.42], P1 = [XS + 0.98, 3.28];
  perfil(null, cgtPoli([P0, Pk, P1], [0.30, 0.44, 0.30]), 0.30, 0, 'pintura', AM, 0.03);
  cgtPerno(D, 'PYB', P0, 0, 0.07, 0.40, AM);
  var texCATp = texRotulo3d(cgtRotuloCAT(NE, '#FFFFFF'), 256, 96);
  var pk = cgtEn(P0, Pk, 0.62), angP = Math.atan2(Pk[1] - P0[1], Pk[0] - P0[0]);
  [-1, 1].forEach(function(s){
    var lp = letrero(texCATp, 0.58, 0.20, pk[0], pk[1], s * 0.158, s > 0 ? 0 : Math.PI);
    lp.rotation.z = s > 0 ? angP - Math.PI / 2 : -(angP - Math.PI / 2);
  });
  /* cilindro de la pluma, del poste al vientre de la pluma */
  D.cilHidD(null, [XS - 0.08, 0.72, 0], cgtNormal(P0, Pk, cgtEn(P0, Pk, 0.55), 0.22).concat([0]), 0.07, AM, 0.55);
  /* balancin colgando por fuera, del extremo de la pluma hasta el cucharon */
  var S0 = [P1[0] + 0.02, P1[1] + 0.20], S1 = [XS + 1.38, 1.08];
  perfil(null, cgtPoli([S0, P1, S1], [0.22, 0.30, 0.20]), 0.22, 0, 'pintura', AM, 0.025);
  cgtPerno(D, 'PYB', P1, 0, 0.06, 0.36, AM);
  /* cilindro del balancin: por detras de la pluma, del codo al tope del balancin */
  D.cilHidD(null, cgtNormal(P0, Pk, cgtEn(P0, Pk, 0.80), -0.24).concat([0]), [S0[0] - 0.02, S0[1] + 0.02, 0], 0.06, AM, 0.55);
  /* cilindro del cucharon a lo largo del balancin */
  var b0 = cgtNormal(P1, S1, cgtEn(P1, S1, 0.12), 0.16), b1 = cgtNormal(P1, S1, cgtEn(P1, S1, 0.85), 0.14);
  D.cilHidD('PVL', [b0[0] - 0.22, b0[1], 0], [b1[0] - 0.22, b1[1], 0], 0.05, AM, 0.58);
  /* cucharon negro de la retro, plegado hacia la maquina */
  var cb = [[S1[0] + 0.05, S1[1] + 0.05], [S1[0] - 0.05, S1[1] - 0.25], [S1[0] - 0.35, S1[1] - 0.40], [S1[0] - 0.62, S1[1] - 0.18],
            [S1[0] - 0.55, S1[1] + 0.25], [S1[0] - 0.22, S1[1] + 0.32]];
  perfil('LPN', cb, 0.60, 0, 'pintura', NE, 0.03);
  /* dientes de la retro */
  for(var i = 0; i < 4; i++){
    D.pon('GET', new THREE.BoxGeometry(0.18, 0.05, 0.06), 'metal', '#5A5E63', S1[0] - 0.68, S1[1] - 0.14, -0.21 + i * 0.14, [0, 0, -0.9]);
  }
  cgtPerno(D, null, S1, 0, 0.05, 0.66, NE);
  /* mangueras de la retro por la pluma */
  [-1, 1].forEach(function(s){ tubo('LPH', [XS - 0.05, 1.20, s * 0.10], [Pk[0] - 0.10, Pk[1], s * 0.17], 0.02, 'goma', '#202326', 8); });

  /* ═══ llantas ═══ */
  var LLd = { r: Rd, ancho: ATd, rAro: Rd * 0.50, aro: AM, aro2: AM2, paso: 0.13 };
  var LLt = { r: Rt, ancho: ATt, rAro: Rt * 0.52, aro: AM, aro2: AM2, paso: 0.17 };
  /* la masa de ruedaDet es de llanta minera: aqui va sin ella, con disco y tuercas */
  [['LL1', XD, 1, LLd, TRd], ['LL2', XD, -1, LLd, TRd], ['LL3', XT, 1, LLt, TRt], ['LL4', XT, -1, LLt, TRt]].forEach(function(q){
    var o = q[3], gr = D.ruedaDet(q[0], q[1], q[2] * q[4], 0, o), s = q[2], rA = o.rAro, zf = s * o.ancho * 0.30;
    var mk = function(geo, mat, z){ var m = new THREE.Mesh(geo, mat); m.rotation.x = Math.PI / 2; m.position.z = z; m.castShadow = true; gr.add(m); return m; };
    mk(new THREE.CylinderGeometry(rA * 0.96, rA * 0.96, 0.03, 32), D.M.pintura(AM), zf);
    mk(new THREE.CylinderGeometry(rA * 0.34, rA * 0.42, 0.08, 20), D.M.pintura(AM), zf + s * 0.04);
    mk(new THREE.CylinderGeometry(rA * 0.16, rA * 0.16, 0.04, 16), D.M.metal('#8E8E8A'), zf + s * 0.09);
    var tu = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.018, 0.018, 0.04, 6), D.M.metal('#9A9A96'), 8), d = new THREE.Object3D();
    for(var b = 0; b < 8; b++){
      var a = b / 8 * Math.PI * 2;
      d.position.set(Math.cos(a) * rA * 0.55, Math.sin(a) * rA * 0.55, zf + s * 0.025); d.rotation.set(Math.PI / 2, 0, 0);
      d.updateMatrix(); tu.setMatrixAt(b, d.matrix);
    }
    gr.add(tu);
  });

  G.userData.ruedas = D.ruedas;
  G.userData.mirarY = 1.40;
  G.userData.dist = 17;
  return G;
}

/* ═══════════════════════════════════════════════════════════════════
   TORRES DE ILUMINACION — herramientas copiadas de modelo_torres.js
   (prefijo cgtT), con la lampara redonda de halogenuro agregada
   ═══════════════════════════════════════════════════════════════════ */
var CGTT_NEGRO = '#1A1C1F', CGTT_GALV = '#BCC3C9', CGTT_GALV2 = '#99A1A8', CGTT_GOMA = '#141619', CGTT_FORRO = '#2C2F33';

/* ═══ geometria y piezas sueltas ═══ */

/* color de marca (sRGB, como se ve en la foto) al lineal con que trabaja el material */
/* el paso de sRGB a lineal ahora lo hace cambiarModelo3d para todos los
   modelos registrados: aqui ya no se convierte (se convertiria dos veces) */
function cgtTLin(hex){ return hex; }

/* caja con todas las aristas redondeadas: el contorno en planta lleva un
   arco minimo para que el bisel tambien redondee las aristas a lo largo de Z
   (con el rectangulo de esquinas vivas de geoCajaB esas quedan vivas) */
function cgtTGeoRed(w, h, d, r){
  r = Math.max(0.004, Math.min(r, w / 2 - 0.003, h / 2 - 0.003, d / 2 - 0.003));
  var a = w / 2 - r, b = h / 2 - r, e = Math.max(0.0015, Math.min(0.01, a * 0.3, b * 0.3));
  var sh = new THREE.Shape();
  sh.moveTo(-a + e, -b);
  sh.lineTo(a - e, -b); sh.absarc(a - e, -b + e, e, -Math.PI / 2, 0, false);
  sh.lineTo(a, b - e); sh.absarc(a - e, b - e, e, 0, Math.PI / 2, false);
  sh.lineTo(-a + e, b); sh.absarc(-a + e, b - e, e, Math.PI / 2, Math.PI, false);
  sh.lineTo(-a, -b + e); sh.absarc(-a + e, -b + e, e, Math.PI, Math.PI * 1.5, false);
  var g = new THREE.ExtrudeGeometry(sh, { depth: Math.max(0.001, d - 2 * r), bevelEnabled: true,
    bevelThickness: r, bevelSize: r, bevelSegments: 4, curveSegments: 3 });
  g.translate(0, 0, -(d - 2 * r) / 2);
  return g;
}

/* saca una malla del grupo principal y la cuelga de un subgrupo (puerta,
   lampara, tablero); la posicion que tenia pasa a ser local al subgrupo */
function cgtTMete(G, grp, m){ G.remove(m); grp.add(m); return m; }

/* viga de seccion rectangular entre dos puntos cualesquiera */
function cgtTViga(D, code, a, b, ancho, alto, tipo, hex, r){
  var va = new THREE.Vector3(a[0], a[1], a[2]), vb = new THREE.Vector3(b[0], b[1], b[2]);
  var dir = vb.clone().sub(va), L = dir.length();
  var m = D.bloque(code, L, alto, ancho, tipo, hex, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2, r === undefined ? 0.008 : r);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir.normalize());
  return m;
}

/* calcomania: plano con transparencia pegado a una cara */
function cgtTCalco(G, tex, w, h, x, y, z, rx, ry, rz, opaco){
  var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, transparent: !opaco,
    roughness: 0.42, metalness: 0.02, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
  m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, rz || 0);
  m.receiveShadow = true;
  G.add(m);
  return m;
}

/* tramo de la carcasa: perfil (z,y) extruido a lo largo, con las esquinas de
   arriba redondeadas ('red') o achaflanadas ('chaflan') solo donde el tramo
   toca el costado y el techo; asi los tramos de la puerta calzan entre si */
function cgtTSeg(D, F, code, hex, x0, x1, y0, y1, z0, z1, tipo){
  var k = F.k, W2 = F.W / 2, pts = [[z0, y0], [z1, y0]];
  var arriba = y1 >= F.y1 - 0.001;
  var esq = function(cz, cy, a0, a1){
    for(var i = 0; i <= 6; i++){ var t = a0 + (a1 - a0) * i / 6; pts.push([cz + k * Math.cos(t), cy + k * Math.sin(t)]); }
  };
  if(F.forma === 'chaflan'){
    if(arriba && z1 >= W2 - 0.001){ pts.push([z1, y1 - k]); pts.push([z1 - k, y1]); } else pts.push([z1, y1]);
    if(arriba && z0 <= -W2 + 0.001){ pts.push([z0 + k, y1]); pts.push([z0, y1 - k]); } else pts.push([z0, y1]);
  } else {
    if(arriba && z1 >= W2 - 0.001) esq(z1 - k, y1 - k, 0, Math.PI / 2); else pts.push([z1, y1]);
    if(arriba && z0 <= -W2 + 0.001) esq(z0 + k, y1 - k, Math.PI / 2, Math.PI); else pts.push([z0, y1]);
  }
  return D.perfilX(code, pts, x1 - x0, (x0 + x1) / 2, tipo || 'pintura', hex, F.r || 0.02);
}

/* rejilla de lamas en un costado (cara que mira a +Z con s = 1, a -Z con s = -1) */
function cgtTLamasZ(D, x0, x1, y0, y1, z, s, n, hexMarco, hexLama){
  D.bloque(null, x1 - x0 + 0.06, y1 - y0 + 0.06, 0.016, 'pintura', hexMarco, (x0 + x1) / 2, (y0 + y1) / 2, z + s * 0.004, 0.006);
  D.bloque(null, x1 - x0, y1 - y0, 0.01, 'mate', '#121416', (x0 + x1) / 2, (y0 + y1) / 2, z + s * 0.011, 0.003);
  var paso = (y1 - y0) / n;
  for(var i = 0; i < n; i++){
    D.bloque(null, x1 - x0 - 0.01, paso * 0.86, 0.012, 'pintura', hexLama, (x0 + x1) / 2, y0 + paso * (i + 0.5), z + s * 0.026, 0.004, [s * 0.75, 0, 0]);
  }
}

/* ═══ rotulos dibujados ═══ */
function cgtTDibTerex(g, w, h){
  var s = h * 0.78, y0 = (h - s) / 2, x0 = h * 0.05, ew = s * 1.2;
  g.fillStyle = '#D0102C'; g.fillRect(x0, y0, ew, s);
  /* la corona blanca de tres puntas del emblema */
  var a = x0 + ew * 0.13, b = x0 + ew * 0.87, yb = y0 + s * 0.80, yt = y0 + s * 0.18, ym = y0 + s * 0.50;
  g.fillStyle = '#FFFFFF';
  g.beginPath(); g.moveTo(a, yb); g.lineTo(a, yt); g.lineTo(a + (b - a) * 0.25, ym); g.lineTo(a + (b - a) * 0.5, yt);
  g.lineTo(a + (b - a) * 0.75, ym); g.lineTo(b, yt); g.lineTo(b, yb); g.closePath(); g.fill();
  g.fillStyle = '#D0102C'; g.fillRect(a, y0 + s * 0.60, b - a, s * 0.07);
  g.fillStyle = '#131416'; g.textBaseline = 'middle'; g.textAlign = 'left';
  g.font = 'bold ' + Math.round(h * 0.78) + 'px "Arial Black", Arial, sans-serif';
  var xt = x0 + ew + h * 0.16;
  g.fillText('TEREX', xt, h * 0.54, w - xt - h * 0.22);
  g.font = 'bold ' + Math.round(h * 0.16) + 'px Arial'; g.fillText('®', w - h * 0.2, h * 0.22);
}
function cgtTDibVertical(txt, fondo, tinta, apilar){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    if(apilar){
      g.font = 'bold ' + Math.round(w * 0.62) + 'px Arial, sans-serif';
      for(var i = 0; i < txt.length; i++) g.fillText(txt[i], w / 2, h * (i + 0.5) / txt.length);
    } else {
      g.save(); g.translate(w / 2, h / 2); g.rotate(Math.PI / 2);
      g.font = '900 ' + Math.round(w * 0.42) + 'px "Arial Black", Arial, sans-serif';
      g.fillText(txt, 0, 0, h * 0.9); g.restore();
    }
  };
}
/* franjas amarillas y negras de las patas */
function cgtTTexRayas(largo){
  var c = document.createElement('canvas'); c.width = 64; c.height = 64;
  var g = c.getContext('2d');
  g.fillStyle = '#F2C200'; g.fillRect(0, 0, 64, 64);
  g.fillStyle = '#141414';
  for(var k = -2; k < 3; k++){ g.beginPath(); g.moveTo(0, k * 32 + 0); g.lineTo(64, k * 32 + 32); g.lineTo(64, k * 32 + 48); g.lineTo(0, k * 32 + 16); g.closePath(); g.fill(); }
  var t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1, largo / 0.16);
  t.encoding = THREE.sRGBEncoding;
  return t;
}

/* la cara de una lampara encendida: halogenuro (reflector con el arco), LED
   en rejilla (una o dos ventanas) o COB (dos lentes redondos, Atlas Copco) */
function cgtTTexLente(tipo, ventanas, vert){
  var c = document.createElement('canvas'); c.width = 256; c.height = 256;
  var g = c.getContext('2d'), i, j;
  if(tipo === 'MH'){
    var gr = g.createRadialGradient(128, 128, 6, 128, 128, 182);
    gr.addColorStop(0, '#FFFFFF'); gr.addColorStop(0.2, '#FFF8E6'); gr.addColorStop(0.6, '#F3DBA6'); gr.addColorStop(1, '#9C7C45');
    g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
    g.strokeStyle = 'rgba(110,80,35,0.28)'; g.lineWidth = 3;
    for(i = 0; i < 12; i++){ var a = i / 12 * Math.PI * 2; g.beginPath(); g.moveTo(128 + Math.cos(a) * 30, 128 + Math.sin(a) * 30); g.lineTo(128 + Math.cos(a) * 190, 128 + Math.sin(a) * 190); g.stroke(); }
    g.fillStyle = '#FFFFFF'; g.fillRect(64, 119, 128, 18);
  } else if(tipo === 'COB'){
    g.fillStyle = '#121416'; g.fillRect(0, 0, 256, 256);
    g.fillStyle = '#25292E';
    for(i = 0; i < 7; i++) g.fillRect(14, 12 + i * 15, 228, 7);
    [72, 184].forEach(function(cx){
      g.fillStyle = '#4A4F55'; g.beginPath(); g.arc(cx, 182, 52, 0, Math.PI * 2); g.fill();
      var gl = g.createRadialGradient(cx, 182, 4, cx, 182, 46);
      gl.addColorStop(0, '#FFFFFF'); gl.addColorStop(0.45, '#F4F8FF'); gl.addColorStop(1, '#8FA6C0');
      g.fillStyle = gl; g.beginPath(); g.arc(cx, 182, 44, 0, Math.PI * 2); g.fill();
    });
  } else {
    g.fillStyle = '#16191C'; g.fillRect(0, 0, 256, 256);
    var n = ventanas || 1, m = 10;
    for(var v = 0; v < n; v++){
      var x0 = vert ? m : m + v * (256 - m) / n, y0 = vert ? m + v * (256 - m) / n : m;
      var ww = vert ? 256 - 2 * m : (256 - m) / n - m, hh = vert ? (256 - m) / n - m : 256 - 2 * m;
      g.fillStyle = '#30363D'; g.fillRect(x0, y0, ww, hh);
      var nc = Math.max(4, Math.round(ww / 16)), nr = Math.max(3, Math.round(hh / 16));
      for(i = 0; i < nc; i++) for(j = 0; j < nr; j++){
        var px = x0 + ww * (i + 0.5) / nc, py = y0 + hh * (j + 0.5) / nr;
        var gd = g.createRadialGradient(px, py, 0.5, px, py, 7.5);
        gd.addColorStop(0, '#FFFFFF'); gd.addColorStop(0.5, '#EEF4FF'); gd.addColorStop(1, 'rgba(160,185,215,0)');
        g.fillStyle = gd; g.fillRect(px - 8, py - 8, 16, 16);
      }
    }
  }
  var t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding;
  return t;
}
function cgtTTexHalo(){
  var c = document.createElement('canvas'); c.width = 128; c.height = 128;
  var g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 4, 64, 64, 64);
  gr.addColorStop(0, 'rgba(255,255,255,0.45)'); gr.addColorStop(0.4, 'rgba(255,250,235,0.14)'); gr.addColorStop(1, 'rgba(255,245,220,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

/* ═══ conjuntos ═══ */

/* rueda de remolque: la de kitDetalle con pestanas finas (las suyas son de
   llanta minera) y, afuera, el plato del aro con agujeros, masa y tuercas */
function cgtTRueda(D, code, x, z, s, o){
  var gr = D.ruedaDet(code, x, z, 0, { r: o.R, ancho: o.A, rAro: o.rAro, aro: o.aro, aro2: o.aro, pernos: 5, paso: 0.055, goma: CGTT_GOMA });
  gr.children.forEach(function(m){
    if(m.geometry && m.geometry.type === 'TorusGeometry'){ m.geometry.dispose(); m.geometry = new THREE.TorusGeometry(o.rAro * 1.03, 0.010, 8, 40); }
  });
  var M = D.M, zA = s * o.A * 0.22, ra = o.rAro;
  var mk = function(geo, mat, zz, rotX){ var m = new THREE.Mesh(geo, mat); m.rotation.x = rotX === undefined ? s * Math.PI / 2 : rotX; m.position.z = zz; m.castShadow = true; m.receiveShadow = true; gr.add(m); return m; };
  mk(new THREE.CylinderGeometry(ra * 0.60, ra * 0.97, 0.05, 32), M.pintura(o.aro), zA);
  mk(new THREE.CylinderGeometry(ra * 0.36, ra * 0.40, 0.05, 24), M.pintura(o.aro), zA + s * 0.045);
  mk(new THREE.CylinderGeometry(ra * 0.16, ra * 0.20, 0.05, 18), M.cromo(), zA + s * 0.085);
  var d = new THREE.Object3D();
  var tu = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.011, 0.011, 0.03, 6), M.metal('#7E848A'), 5);
  var ag = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.02, 0.02, 0.006, 14), M.mate('#141518'), 6);
  for(var i = 0; i < 6; i++){
    var a = i / 6 * Math.PI * 2;
    d.position.set(Math.cos(a) * ra * 0.74, Math.sin(a) * ra * 0.74, zA + s * 0.012); d.rotation.set(Math.PI / 2, 0, 0); d.updateMatrix(); ag.setMatrixAt(i, d.matrix);
    if(i < 5){ var b = i / 5 * Math.PI * 2; d.position.set(Math.cos(b) * ra * 0.29, Math.sin(b) * ra * 0.29, zA + s * 0.075); d.updateMatrix(); tu.setMatrixAt(i, d.matrix); }
  }
  gr.add(tu); gr.add(ag);
  return gr;
}
function cgtTGuarda(D, x, z, R, A, hex, s){
  var rr = R + 0.06, ww = A + 0.07;
  var m = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr, ww, 30, 1, true, Math.PI / 2 - 0.22, Math.PI + 0.44), D.M.pintura(hex));
  m.material.side = THREE.DoubleSide; m.rotation.x = Math.PI / 2; m.position.set(x, R, z);
  D.reg(null, m, hex);
  [-1, 1].forEach(function(e){
    D.pon(null, new THREE.TorusGeometry(rr, 0.012, 6, 30, Math.PI + 0.44), 'pintura', hex, x, R, z + e * ww / 2, [0, 0, -0.22]);
  });
  /* escuadra que la toma de la carcasa */
  D.bloque(null, 0.24, 0.05, 0.10, 'pintura', hex, x, R + rr - 0.01, z - s * (ww / 2 + 0.03), 0.01);
}
/* pata estabilizadora: camisa, tubo interior galvanizado, base y manivela */
function cgtTPata(D, x, z, yRef, estilo, texRayas){
  var top = yRef + 0.30, cam0 = 0.30;
  var hexC = estilo === 'galv' ? CGTT_GALV : estilo === 'rayas' ? '#FFFFFF' : CGTT_NEGRO;
  var cam = D.pon(null, new THREE.BoxGeometry(0.08, top - cam0, 0.08), estilo === 'galv' ? 'metal' : 'pintura', hexC, x, (top + cam0) / 2, z);
  if(estilo === 'rayas' && texRayas){ cam.material.map = texRayas; cam.material.needsUpdate = true; }
  D.bloque(null, 0.088, 0.03, 0.088, 'metal', CGTT_GALV2, x, cam0 + 0.015, z, 0.005);
  D.bloque(null, 0.058, cam0 - 0.01, 0.058, 'metal', CGTT_GALV, x, (cam0 + 0.02) / 2, z, 0.006);
  D.bloque(null, 0.18, 0.014, 0.18, 'metal', CGTT_GALV2, x, 0.007, z, 0.004);
  D.bloque(null, 0.03, 0.06, 0.10, 'metal', CGTT_GALV2, x, 0.035, z, 0.004);
  /* pasador de altura y manivela arriba */
  D.cilindro(null, 0.011, 0.011, 0.14, 'metal', '#5E646A', x, cam0 + 0.07, z, [Math.PI / 2, 0, 0], 8);
  D.cilindro(null, 0.03, 0.03, 0.04, 'metal', CGTT_GALV2, x, top + 0.02, z, null, 14);
  D.tubo(null, [x, top + 0.04, z], [x, top + 0.09, z], 0.011, 'metal', CGTT_GALV, 8);
  D.tubo(null, [x, top + 0.09, z], [x - 0.13, top + 0.09, z], 0.010, 'metal', CGTT_GALV, 8);
  D.cilindro(null, 0.015, 0.015, 0.075, 'mate', '#111317', x - 0.13, top + 0.125, z, null, 10);
}

/* chasis: largueros, travesanos, eje con ballestas, ruedas, guardafangos,
   lanza con enganche y gato, patas estabilizadoras y luces traseras */
function cgtTChasis(D, h){
  var hx = h.hex, texR = h.pata === 'rayas' ? cgtTTexRayas(h.yL) : null;
  [-1, 1].forEach(function(s){ D.bloque('42023615', h.xR - h.xF, 0.09, 0.06, 'pintura', hx, (h.xF + h.xR) / 2, h.yL, s * h.zL, 0.012); });
  [h.xF + 0.03, h.xa, h.xR - 0.03].forEach(function(x){ D.bloque('42023615', 0.06, 0.07, 2 * h.zL - 0.04, 'pintura', hx, x, h.yL, 0, 0.01); });
  /* eje tubular, ballestas de tres hojas, colgadores y abrazaderas */
  D.tubo(null, [h.xa, h.R, -h.via / 2 + h.A * 0.3], [h.xa, h.R, h.via / 2 - h.A * 0.3], 0.032, 'pintura', hx, 16);
  [-1, 1].forEach(function(s){
    var z = s * h.zL;
    for(var k = 0; k < 3; k++) D.bloque(null, 0.62 - k * 0.15, 0.014, 0.05, 'metal', '#3E4347', h.xa, h.R + 0.045 + k * 0.016, z, 0.004);
    [h.xa - 0.31, h.xa + 0.31].forEach(function(x){ D.bloque(null, 0.035, h.yL - h.R - 0.07, 0.05, 'pintura', hx, x, (h.yL + h.R + 0.02) / 2, z, 0.006); });
    D.bloque(null, 0.09, 0.07, 0.075, 'metal', '#3E4347', h.xa, h.R + 0.01, z, 0.008);
    D.bloque(null, 0.06, 0.03, 0.03, 'metal', '#3E4347', h.xa, h.R + 0.01, s * (h.via / 2 - h.A * 0.5 - 0.02), 0.006);
  });
  var o = { R: h.R, A: h.A, rAro: h.rAro, aro: h.aro };
  cgtTRueda(D, 'LL1', h.xa, h.via / 2, 1, o);
  cgtTRueda(D, 'LL2', h.xa, -h.via / 2, -1, o);
  [-1, 1].forEach(function(s){ cgtTGuarda(D, h.xa, s * h.via / 2, h.R, h.A, h.guarda, s); });

  /* lanza: viga recta con dos tirantes al travesano, o en A */
  var L = h.lanza;
  if(L.tipo === 'A'){
    [-1, 1].forEach(function(s){ cgtTViga(D, '42023615', [h.xF + 0.03, h.yL, s * h.zL], [L.xh + 0.32, L.yh, 0], 0.07, 0.08, 'pintura', L.hex); });
    cgtTViga(D, '42023615', [L.xh + 0.34, L.yh, 0], [L.xh + 0.05, L.yh, 0], 0.08, 0.08, 'pintura', L.hex);
  } else {
    cgtTViga(D, '42023615', [h.xF + 0.06, h.yL, 0], [L.xh + 0.05, L.yh, 0], 0.09, 0.09, 'pintura', L.hex);
    [-1, 1].forEach(function(s){ cgtTViga(D, null, [h.xF + 0.03, h.yL, s * (h.zL - 0.02)], [h.xF - 0.40, h.yL - 0.01, s * 0.04], 0.05, 0.05, 'pintura', L.hex); });
  }
  /* enganche: ojo de pivote o acople de bola */
  if(L.enganche === 'ojo'){
    D.bloque(null, 0.14, 0.05, 0.07, 'metal', '#3B3F44', L.xh + 0.04, L.yh, 0, 0.012);
    D.pon(null, new THREE.TorusGeometry(0.05, 0.02, 10, 24), 'metal', '#3B3F44', L.xh - 0.06, L.yh, 0, [Math.PI / 2, 0, 0]);
  } else {
    D.bloque(null, 0.26, 0.08, 0.11, 'metal', '#5A6067', L.xh + 0.03, L.yh + 0.01, 0, 0.02);
    D.pon(null, new THREE.SphereGeometry(0.055, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), 'metal', '#5A6067', L.xh - 0.08, L.yh + 0.02, 0, [Math.PI, 0, 0]);
    D.tubo(null, [L.xh + 0.06, L.yh + 0.05, 0], [L.xh - 0.06, L.yh + 0.10, 0], 0.012, 'metal', '#5A6067', 8);
  }
  /* cadenas de seguridad colgando del enganche */
  if(L.cadenas){
    var gC = new THREE.TorusGeometry(0.018, 0.005, 6, 12), nC = 14;
    var ic = new THREE.InstancedMesh(gC, D.M.metal('#C9A64A'), nC * 2), oc = new THREE.Object3D(), kc = 0;
    [-1, 1].forEach(function(s){
      for(var i = 0; i < nC; i++){
        var t = i / (nC - 1), xx = L.xh + 0.30 - t * 0.32, yy = L.yh - 0.02 - Math.sin(t * Math.PI) * 0.16;
        oc.position.set(xx, yy, s * 0.06); oc.rotation.set(i % 2 ? Math.PI / 2 : 0, 0, 0); oc.updateMatrix(); ic.setMatrixAt(kc++, oc.matrix);
      }
    });
    ic.castShadow = true; D.reg(null, ic, '#C9A64A');
  }
  /* gato de la lanza, al costado izquierdo */
  if(L.gato !== null && L.gato !== undefined){
    var xg = L.gato, yg = L.yh + (h.yL - L.yh) * (xg - L.xh) / (h.xF - L.xh), zg = 0.085;
    D.bloque(null, 0.06, 0.10, 0.10, 'pintura', L.hex, xg, yg, 0.05, 0.01);
    D.cilindro(null, 0.035, 0.035, 0.52, 'pintura', L.hex, xg, yg + 0.05, zg, null, 16);
    D.cilindro(null, 0.026, 0.026, 0.30, 'metal', CGTT_GALV, xg, yg - 0.34, zg, null, 14);
    D.bloque(null, 0.16, 0.014, 0.16, 'metal', CGTT_GALV2, xg, 0.007, zg, 0.004);
    D.tubo(null, [xg, yg + 0.31, zg], [xg - 0.12, yg + 0.33, zg], 0.010, 'metal', CGTT_GALV, 8);
    D.cilindro(null, 0.015, 0.015, 0.07, 'mate', '#111317', xg - 0.12, yg + 0.37, zg, null, 10);
  }
  /* patas: viga del chasis a la pata, con su perno de giro */
  (h.patas || []).forEach(function(p){
    cgtTViga(D, null, [p[0], h.yL, p[1]], [p[2], h.yL, p[3]], 0.07, 0.07, h.tipoViga || 'pintura', h.hexViga || hx);
    D.cilindro(null, 0.03, 0.03, 0.14, 'metal', CGTT_GALV2, p[0], h.yL, p[1], null, 12);
    cgtTPata(D, p[2], p[3], h.yL, h.pata, texR);
  });
  /* gatos traseros fijos en placas (VTevo) */
  (h.gatosTras || []).forEach(function(p){
    D.bloque(null, 0.14, 0.20, 0.012, 'pintura', hx, p[0], h.yL + 0.10, p[1], 0.004);
    cgtTPata(D, p[0], p[1] + (p[1] > 0 ? 0.05 : -0.05), h.yL, 'galv', null);
  });
  /* luces traseras: caja negra y mica roja y ambar */
  [-1, 1].forEach(function(s){
    D.bloque(null, 0.05, 0.10, 0.16, 'mate', '#1B1C1E', h.xR + 0.025, h.yL, s * (h.zL + 0.10), 0.01);
    D.bloque('LSM', 0.02, 0.07, 0.07, 'vidrio', '#C2241B', h.xR + 0.055, h.yL, s * (h.zL + 0.135), 0.006);
    D.bloque('LSM', 0.02, 0.07, 0.05, 'vidrio', '#F2A31A', h.xR + 0.055, h.yL, s * (h.zL + 0.065), 0.006);
  });
}

/* carcasa en tramos: frente, fondo y la bahia del motor con la puerta abierta
   del lado derecho (-Z). F: forma, P: puerta. Devuelve la puerta para pegarle
   rotulos (coordenadas del mundo con la puerta cerrada) */
function cgtTCarcasa(D, G, F, P){
  var W = F.W, zA = -W / 2, ret = {};
  if(!P){ cgtTSeg(D, F, null, F.hex, F.x0, F.x1, F.y0, F.y1, -W / 2, W / 2); return ret; }
  var zB = zA + P.rec;
  cgtTSeg(D, F, null, F.hexFrente || F.hex, F.x0, P.x0, F.y0, F.y1, -W / 2, W / 2);
  cgtTSeg(D, F, null, F.hex, P.x1, F.x1, F.y0, F.y1, -W / 2, W / 2);
  cgtTSeg(D, F, null, F.hex, P.x0, P.x1, F.y0, F.y1, zB, W / 2);
  cgtTSeg(D, F, null, F.hex, P.x0, P.x1, P.y1, F.y1, -W / 2, zB + 0.01);
  cgtTSeg(D, F, null, F.hex, P.x0, P.x1, F.y0, P.y0, -W / 2, zB + 0.01);
  /* forro de espuma oscura en la bahia */
  var li = CGTT_FORRO, xm = (P.x0 + P.x1) / 2, ym = (P.y0 + P.y1) / 2, Lx = P.x1 - P.x0, Hy = P.y1 - P.y0, dz = P.rec - 0.02;
  D.bloque(null, Lx, Hy, 0.012, 'mate', li, xm, ym, zB - 0.004, 0.003);
  D.bloque(null, Lx, 0.012, dz, 'mate', li, xm, P.y1 - 0.004, zA + 0.01 + dz / 2, 0.003);
  D.bloque(null, Lx, 0.012, dz, 'mate', li, xm, P.y0 + 0.004, zA + 0.01 + dz / 2, 0.003);
  D.bloque(null, 0.012, Hy, dz, 'mate', li, P.x0 + 0.004, ym, zA + 0.01 + dz / 2, 0.003);
  D.bloque(null, 0.012, Hy, dz, 'mate', li, P.x1 - 0.004, ym, zA + 0.01 + dz / 2, 0.003);
  /* la puerta, colgada de sus bisagras */
  var gp = new THREE.Group(), hin = P.bisagra, a = P.ang, zP = zA + 0.013;
  if(hin === 'arriba'){ gp.position.set(xm, P.y1, zP); gp.rotation.x = a; }
  else if(hin === 'adelante'){ gp.position.set(P.x0, ym, zP); gp.rotation.y = a; }
  else { gp.position.set(P.x1, ym, zP); gp.rotation.y = -a; }
  G.add(gp);
  var mete = function(m){ return cgtTMete(G, gp, m); };
  var lx = function(xw){ return xw - gp.position.x; }, ly = function(yw){ return yw - gp.position.y; };
  mete(D.bloque(null, Lx - 0.012, Hy - 0.012, 0.024, 'pintura', P.hex || F.hex, lx(xm), ly(ym), 0, 0.008));
  mete(D.bloque(null, Lx - 0.09, Hy - 0.09, 0.02, 'mate', li, lx(xm), ly(ym), 0.02, 0.004));
  var xMan = hin === 'adelante' ? P.x1 - 0.06 : hin === 'atras' ? P.x0 + 0.06 : xm;
  var yMan = hin === 'arriba' ? P.y0 + 0.05 : ym;
  mete(D.bloque(null, hin === 'arriba' ? 0.16 : 0.035, hin === 'arriba' ? 0.035 : 0.13, 0.025, 'mate', '#16181A', lx(xMan), ly(yMan), -0.024, 0.006));
  if(hin === 'arriba'){
    [P.x0 + 0.12, P.x1 - 0.12].forEach(function(xh){ mete(D.cilindro(null, 0.014, 0.014, 0.09, 'metal', '#2B2E33', lx(xh), 0, -0.012, [0, 0, Math.PI / 2], 10)); });
    /* amortiguadores a gas que sostienen la puerta levantada */
    gp.updateMatrixWorld(true);
    [P.x0 + 0.05, P.x1 - 0.05].forEach(function(xs){
      var pt = gp.localToWorld(new THREE.Vector3(lx(xs), -Hy * 0.55, 0.03));
      D.tubo(null, [xs, P.y0 + 0.12, zA + 0.03], [pt.x, pt.y, pt.z], 0.009, 'cromo', null, 8);
    });
  } else {
    var xb = hin === 'adelante' ? P.x0 + 0.015 : P.x1 - 0.015;
    [P.y0 + 0.10, P.y1 - 0.10].forEach(function(yh){ mete(D.bloque(null, 0.05, 0.07, 0.014, 'mate', '#16181A', lx(xb), ly(yh), -0.02, 0.003)); });
  }
  ret.puerta = gp; ret.lx = lx; ret.ly = ly; ret.mete = mete; ret.zB = zB;
  return ret;
}

/* grupo electrogeno en la bahia: motor diesel de dos o tres cilindros,
   generador acoplado, radiador con ventilador, bateria, filtro de aire y
   silenciador con el escape saliendo por el techo */
function cgtTMotor(D, B, o){
  var Lb = B.x1 - B.x0, Hb = B.y1 - B.y0, Db = B.zB - B.zA;
  var ez = Math.min(0.30, Db - 0.22), ey = Math.min(0.34, Hb * 0.52), ex = Math.min(0.40, Lb * 0.40);
  var zc = B.zB - ez / 2 - 0.035, xe = B.x0 + Lb * 0.56, ye = B.y0 + 0.08 + ey / 2;
  /* soportes de goma */
  [xe - ex * 0.35, xe + ex * 0.35].forEach(function(x){ D.bloque(null, 0.06, 0.05, ez * 0.7, 'goma', '#1A1C1F', x, B.y0 + 0.035, zc, 0.01); });
  D.bloque('ENG1', ex, ey, ez, 'pintura', o.motor, xe, ye, zc, 0.03);
  D.bloque('ENG1', ex * 0.92, 0.05, ez * 0.8, 'metal', '#3A3F45', xe, ye - ey / 2 - 0.02, zc, 0.01);
  D.bloque('ENG1', ex * 0.86, 0.07, ez * 0.62, 'pintura', o.tapa || '#26292D', xe + 0.01, ye + ey / 2 + 0.035, zc, 0.02);
  /* inyectores con sus caños */
  for(var i = 0; i < (o.cil || 2); i++){
    var xi = xe - ex * 0.2 + i * ex * 0.4 / Math.max(1, (o.cil || 2) - 1);
    D.cilindro(null, 0.013, 0.013, 0.07, 'metal', '#A9AFB4', xi, ye + ey / 2 + 0.10, zc - ez * 0.18, null, 8);
    D.tubo(null, [xi, ye + ey / 2 + 0.13, zc - ez * 0.18], [xe - ex * 0.5 + 0.02, ye + ey * 0.2, zc - ez / 2 - 0.01], 0.005, 'metal', '#A9AFB4', 6);
  }
  /* filtro de aceite, varilla, motor de arranque */
  D.cilindro('ENG1', 0.042, 0.042, 0.10, 'pintura', o.filtro || '#E6E1D3', xe + ex * 0.15, ye + 0.04, zc - ez / 2 - 0.05, [Math.PI / 2, 0, 0], 18);
  D.cilindro(null, 0.012, 0.012, 0.03, 'pintura', '#F2C200', xe - ex * 0.30, ye + ey / 2 + 0.02, zc - ez / 2 + 0.02, null, 8);
  D.cilindro(null, 0.05, 0.05, 0.16, 'mate', '#1E2023', xe - ex * 0.25, ye - ey * 0.25, zc + ez / 2 - 0.02, [0, 0, Math.PI / 2], 14);
  /* polea, correa y ventilador hacia el radiador */
  var xr = B.x1 - 0.07;
  D.cilindro(null, 0.07, 0.07, 0.03, 'metal', '#3A3F45', xe + ex / 2 + 0.03, ye - ey * 0.15, zc, [0, 0, Math.PI / 2], 20);
  D.pon(null, new THREE.TorusGeometry(Math.min(0.14, Hb * 0.22), 0.025, 8, 28), 'mate', '#202326', (xe + ex / 2 + xr) / 2 + 0.02, ye + 0.02, zc, [0, Math.PI / 2, 0]);
  D.bloque('RAD1', 0.06, Hb * 0.74, Db * 0.80, 'mate', '#1E2124', xr, B.y0 + Hb * 0.47, (B.zA + B.zB) / 2 + 0.03, 0.01);
  D.lamas(null, xr - 0.02, B.y0 + Hb * 0.16, B.y0 + Hb * 0.78, (B.zA + B.zB) / 2 - Db * 0.34, (B.zA + B.zB) / 2 + Db * 0.38, 9, '#2E3236', -1);
  D.cilindro('RAD1', 0.03, 0.03, 0.06, 'metal', '#8C9298', xr, B.y0 + Hb * 0.88, zc, null, 12);
  /* mangueras del radiador */
  D.tubo(null, [xe + ex / 2 - 0.02, ye + ey * 0.40, zc - 0.05], [xr - 0.04, B.y0 + Hb * 0.78, zc - 0.05], 0.021, 'goma', '#1A1C1F', 10);
  D.tubo(null, [xe + ex / 2 - 0.02, ye - ey * 0.30, zc + 0.05], [xr - 0.04, B.y0 + Hb * 0.20, zc + 0.05], 0.021, 'goma', '#1A1C1F', 10);
  /* generador: campana, cuerpo con ventilacion, tapa y caja de bornes */
  var ra = Math.min(0.15, Hb * 0.24, ez * 0.55), la = Math.max(0.12, Math.min(0.30, (xe - ex / 2) - B.x0 - 0.08));
  var xa = xe - ex / 2 - la / 2 - 0.035;
  D.cilindro('AL1', ra * 1.04, ra * 0.92, 0.05, 'metal', '#5A6068', xe - ex / 2 - 0.012, ye, zc, [0, 0, Math.PI / 2], 28);
  D.cilindro('AL1', ra, ra, la, 'pintura', o.alt, xa, ye, zc, [0, 0, Math.PI / 2], 32);
  [-0.3, 0.3].forEach(function(f){ D.pon(null, new THREE.TorusGeometry(ra, 0.008, 6, 32), 'mate', '#16181A', xa + f * la, ye, zc, [0, Math.PI / 2, 0]); });
  D.cilindro('AL1', ra * 0.85, ra * 0.85, 0.03, 'pintura', o.alt, xa - la / 2 - 0.012, ye, zc, [0, 0, Math.PI / 2], 28);
  D.bloque('AL1', Math.min(0.13, la * 0.8), 0.07, 0.11, 'pintura', o.alt, xa, ye + ra + 0.03, zc, 0.012);
  D.bloque(null, la * 0.9, 0.04, ez * 0.9, 'metal', '#3A3F45', xa, ye - ra - 0.01, zc, 0.006);
  /* bateria en el piso, delante del motor */
  var xbat = Math.min(xe, B.x1 - 0.30);
  D.bloque('BAT', 0.22, 0.17, 0.14, 'mate', '#1B1C1E', xbat, B.y0 + 0.095, B.zA + 0.10, 0.012);
  D.cilindro(null, 0.015, 0.015, 0.03, 'pintura', '#C8201A', xbat - 0.07, B.y0 + 0.19, B.zA + 0.10, null, 10);
  D.cilindro(null, 0.015, 0.015, 0.03, 'mate', '#111', xbat + 0.07, B.y0 + 0.19, B.zA + 0.10, null, 10);
  D.tubo(null, [xbat - 0.07, B.y0 + 0.20, B.zA + 0.10], [xe - ex * 0.25, ye - ey * 0.15, zc - ez / 2], 0.009, 'goma', '#B32019', 6);
  /* filtro de aire contra el fondo, arriba, y silenciador sobre el motor */
  D.cilindro(null, 0.06, 0.06, 0.20, 'mate', '#1E2023', xe - 0.02, B.y1 - 0.08, B.zB - 0.075, [0, 0, Math.PI / 2], 18);
  D.tubo(null, [xe + 0.08, B.y1 - 0.08, B.zB - 0.075], [xe + ex * 0.3, ye + ey / 2 + 0.07, zc + 0.04], 0.025, 'goma', '#1A1C1F', 10);
  var ym = Math.min(ye + ey / 2 + 0.14, B.y1 - 0.08), xm = xe + ex * 0.15, zm = zc - ez * 0.20;
  D.cilindro(null, 0.06, 0.06, 0.22, 'metal', '#8A8F94', xm, ym, zm, [0, 0, Math.PI / 2], 18);
  D.tubo(null, [xm + 0.11, ym, zm], [xm + 0.11, B.yTecho + 0.12, zm], 0.022, 'metal', '#7A7F84', 12);
  D.bloque(null, 0.08, 0.008, 0.06, 'metal', '#6A6F74', xm + 0.13, B.yTecho + 0.13, zm, 0.002, [0, 0, -0.5]);
  /* turbo en el multiple de escape, del lado de la puerta (SAP le carga costo en
     las RL4000): caracol de la turbina y su salida al silenciador */
  if(o.turbo){
    var xt = xe - ex * 0.10, yt = ye + ey * 0.22, zt = zc - ez / 2 - 0.05;
    D.pon('TLH1', new THREE.TorusGeometry(0.045, 0.028, 10, 20), 'metal', '#9A8F80', xt, yt, zt, [0, 0, 0]);
    D.cilindro('TLH1', 0.04, 0.04, 0.07, 'metal', '#8A8F94', xt + 0.06, yt, zt, [0, 0, Math.PI / 2], 14);
    D.tubo(null, [xt, yt + 0.05, zt], [xm, ym - 0.05, zm], 0.018, 'metal', '#7A7F84', 10);
  }
}

/* tablero de control: marco, placa de interruptores y tomas (TAB) y el
   controlador con pantalla (EC); la cara mira a -Z en coordenadas locales */
function cgtTPanel(D, G, x, y, z, ry){
  var grp = new THREE.Group(); grp.position.set(x, y, z); grp.rotation.y = ry || 0; G.add(grp);
  var mete = function(m){ return cgtTMete(G, grp, m); };
  mete(D.bloque(null, 0.38, 0.30, 0.02, 'mate', '#202326', 0, 0, -0.008, 0.006));
  mete(D.bloque('TAB', 0.34, 0.26, 0.012, 'mate', '#3A3F45', 0, 0, -0.022, 0.004));
  mete(D.bloque('EC', 0.13, 0.10, 0.03, 'mate', '#17191C', -0.08, 0.055, -0.035, 0.006));
  var pant = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.045), new THREE.MeshStandardMaterial({ color: '#000000', emissive: '#7BE0A0', emissiveIntensity: 0.9 }));
  pant.rotation.y = Math.PI; pant.position.set(-0.08, 0.065, -0.0515); grp.add(pant);
  for(var b = 0; b < 3; b++) mete(D.cilindro(null, 0.007, 0.007, 0.01, 'mate', b ? '#2F8C4A' : '#C8201A', -0.11 + b * 0.03, 0.025, -0.052, [Math.PI / 2, 0, 0], 10));
  for(var i = 0; i < 4; i++) mete(D.bloque(null, 0.028, 0.06, 0.03, 'mate', i ? '#E8E8E4' : '#2B2E33', 0.03 + i * 0.034, 0.06, -0.035, 0.004));
  mete(D.cilindro(null, 0.036, 0.036, 0.012, 'pintura', '#F2C200', -0.10, -0.07, -0.03, [Math.PI / 2, 0, 0], 20));
  mete(D.cilindro(null, 0.026, 0.030, 0.03, 'pintura', '#C8201A', -0.10, -0.07, -0.05, [Math.PI / 2, 0, 0], 20));
  mete(D.cilindro(null, 0.034, 0.034, 0.05, 'pintura', '#1F5FB8', 0.03, -0.07, -0.045, [Math.PI / 2, 0, 0], 20));
  mete(D.cilindro(null, 0.03, 0.03, 0.04, 'mate', '#26292D', 0.115, -0.07, -0.04, [Math.PI / 2, 0, 0], 18));
  return grp;
}

/* mastil telescopico: manga, tramos con collares y trabas, cabrestante con
   manivela, cable de acero, y el cable en espiral hasta el cabezal */
function cgtTMastil(D, G, m){
  var cuad = m.forma !== 'red';
  var sec = function(s, y0, y1, tipo, hex){
    if(cuad) return D.bloque(null, s, y1 - y0, s, tipo, hex, m.x, (y0 + y1) / 2, 0, Math.min(0.012, s * 0.1));
    return D.cilindro(null, s / 2, s / 2, y1 - y0, tipo, hex, m.x, (y0 + y1) / 2, 0, null, 24);
  };
  sec(m.s0, m.y0, m.yManga, m.tipoManga, m.hexManga);
  var Lv = (m.yTop - m.yManga) / m.n;
  for(var i = 1; i <= m.n; i++){
    var si = m.s0 - i * m.ds;
    sec(si, m.yManga + (i - 1) * Lv - 0.25, m.yManga + i * Lv, m.tipoTramo, m.hexTramo);
    /* collar en la boca del tramo de afuera, con su perilla de traba */
    var yc = m.yManga + (i - 1) * Lv, sc = m.s0 - (i - 1) * m.ds + 0.02, hc = i === 1 ? m.hexManga : m.hexTramo, tc = i === 1 ? m.tipoManga : m.tipoTramo;
    if(cuad) D.bloque(null, sc, 0.07, sc, tc, hc, m.x, yc - 0.035, 0, 0.01);
    else D.cilindro(null, sc / 2, sc / 2, 0.07, tc, hc, m.x, yc - 0.035, 0, null, 24);
    D.cilindro(null, 0.012, 0.012, 0.06, 'metal', '#5E646A', m.x - sc / 2 - 0.028, yc - 0.035, 0, [0, 0, Math.PI / 2], 8);
    D.cilindro(null, 0.02, 0.02, 0.025, 'mate', '#C8201A', m.x - sc / 2 - 0.065, yc - 0.035, 0, [0, 0, Math.PI / 2], 12);
  }
  /* soportes de la manga a la carcasa */
  [m.yApoyo1 || 0.78, m.yApoyo2 || 1.15].forEach(function(y){
    var x0 = m.x + m.s0 / 2, x1 = m.xCarc;
    if(x1 - x0 > 0.005) D.bloque(null, x1 - x0 + 0.02, 0.06, m.s0 * 0.8, 'pintura', m.hexApoyo || CGTT_NEGRO, (x0 + x1) / 2, y, 0, 0.008);
  });
  D.bloque(null, m.s0 + 0.06, 0.02, m.s0 + 0.06, 'metal', CGTT_GALV2, m.x, m.y0 + 0.01, 0, 0.004);
  /* cabrestante en la cara de adelante de la manga */
  var xw = m.x - m.s0 / 2 - 0.085, yw = m.yWinch;
  D.bloque(null, 0.025, 0.26, 0.20, 'metal', CGTT_GALV2, m.x - m.s0 / 2 - 0.012, yw, 0, 0.006);
  [-1, 1].forEach(function(s){ D.cilindro(null, 0.10, 0.10, 0.012, 'metal', CGTT_GALV, xw, yw, s * 0.06, [Math.PI / 2, 0, 0], 28); });
  D.cilindro(null, 0.05, 0.05, 0.11, 'metal', '#8E959B', xw, yw, 0, [Math.PI / 2, 0, 0], 18);
  D.cilindro(null, 0.055, 0.055, 0.05, 'metal', CGTT_GALV, xw, yw, 0.095, [Math.PI / 2, 0, 0], 18);
  D.tubo(null, [xw, yw, 0.12], [xw - 0.03, yw + 0.20, 0.13], 0.011, 'metal', CGTT_GALV, 8);
  D.cilindro(null, 0.016, 0.016, 0.09, 'mate', '#111317', xw - 0.03, yw + 0.20, 0.18, [Math.PI / 2, 0, 0], 10);
  D.tubo(null, [xw + 0.03, yw + 0.05, 0], [m.x - m.s0 / 2 + 0.004, m.yManga - 0.06, 0], 0.004, 'metal', '#C9CED2', 6);
  /* cable en espiral, estirado a lo largo de los tramos */
  var y0c = m.yManga + 0.35, y1c = m.yTop - 0.12, rc = 0.042, zc = m.s0 / 2 + 0.065, vueltas = Math.round((y1c - y0c) / 0.10);
  var curva = new THREE.Curve();
  curva.getPoint = function(t, opt){
    var p = opt || new THREE.Vector3(), a = t * vueltas * Math.PI * 2;
    return p.set(m.x + Math.cos(a) * rc, y0c + (y1c - y0c) * t, zc + Math.sin(a) * rc);
  };
  var esp = new THREE.Mesh(new THREE.TubeGeometry(curva, vueltas * 12, 0.007, 5, false), D.M.goma('#17191B'));
  esp.castShadow = true; G.add(esp);
  D.tubo(null, [m.x, y0c, zc], [m.x + m.s0 / 2 + 0.02, m.yApoyo2 || 1.15, zc], 0.008, 'goma', '#17191B', 6);
}

/* reflector redondo de halogenuro (el de las torres viejas de 1000 W): tambor
   de aluminio que se abre hacia el frente, aro, vidrio encendido, rejilla de
   alambre (si L.rejilla) y la caja del balasto atras. Mira a -X. */
function cgtTLamparaRedonda(D, G, L, grp, mete){
  var r = L.r, d = L.d, hx = L.hex, tc = L.tipoCaja || 'metal', bz = L.bisel || hx;
  mete(D.cilindro('LSM', r * 1.02, r * 0.78, d, tc, hx, 0, 0, 0, [0, 0, Math.PI / 2], 36));
  /* tapa trasera abombada */
  mete(D.pon(null, new THREE.SphereGeometry(r * 0.78, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2), tc, hx, d / 2, 0, 0, [0, 0, -Math.PI / 2])).scale.set(1, 0.35, 1);
  /* aro del frente y vidrio encendido */
  mete(D.pon(null, new THREE.TorusGeometry(r * 1.02, 0.022, 10, 40), tc, bz, -d / 2, 0, 0, [0, Math.PI / 2, 0]));
  var lente = new THREE.Mesh(new THREE.CircleGeometry(r * 0.99, 40), L.matLente);
  lente.rotation.y = -Math.PI / 2; lente.position.set(-d / 2 - 0.004, 0, 0); grp.add(lente);
  var halo = new THREE.Mesh(new THREE.PlaneGeometry(r * 3.4, r * 3.4), L.matHalo);
  halo.rotation.y = -Math.PI / 2; halo.position.set(-d / 2 - 0.05, 0, 0); halo.renderOrder = 3; grp.add(halo);
  /* tornillos del aro */
  for(var i = 0; i < 6; i++){
    var a = i / 6 * Math.PI * 2;
    mete(D.cilindro(null, 0.009, 0.009, 0.02, 'metal', '#5E646A', -d / 2 - 0.012, Math.sin(a) * r * 1.02, Math.cos(a) * r * 1.02, [0, 0, Math.PI / 2], 6));
  }
  if(L.rejilla){
    /* rejilla de alambre: un aro y cuatro alambres cruzados delante del vidrio */
    var xg = -d / 2 - 0.035;
    mete(D.pon(null, new THREE.TorusGeometry(r * 0.55, 0.005, 6, 28), 'metal', '#2A2D31', xg, 0, 0, [0, Math.PI / 2, 0]));
    [-0.5, 0.5].forEach(function(f){
      var c = Math.sqrt(1 - f * f) * r * 0.98;
      mete(D.tubo(null, [xg, -c, f * r], [xg, c, f * r], 0.005, 'metal', '#2A2D31', 6));
      mete(D.tubo(null, [xg, f * r, -c], [xg, f * r, c], 0.005, 'metal', '#2A2D31', 6));
    });
  }
}

/* una lampara mirando a -X: caja, marco, vidrio encendido, halo, aletas y horquilla */
function cgtTLampara(D, G, L, x, y, z, ry, rz){
  var grp = new THREE.Group(); grp.position.set(x, y, z); grp.rotation.set(0, ry, rz); G.add(grp);
  var mete = function(m){ return cgtTMete(G, grp, m); };
  var w = L.w, h = L.h, d = L.d, hx = L.hex, tc = L.tipoCaja || 'mate', bz = L.bisel || hx, e = L.marco || 0.03;
  if(L.redonda) cgtTLamparaRedonda(D, G, L, grp, mete);
  else {
  mete(D.bloque('LSM', d, h, w, tc, hx, 0, 0, 0, Math.min(0.025, d * 0.18)));
  mete(D.bloque(null, 0.025, e, w + 0.006, tc, bz, -d / 2 - 0.004, h / 2 - e / 2, 0, 0.006));
  mete(D.bloque(null, 0.025, e, w + 0.006, tc, bz, -d / 2 - 0.004, -h / 2 + e / 2, 0, 0.006));
  mete(D.bloque(null, 0.025, h - 2 * e, e, tc, bz, -d / 2 - 0.004, 0, w / 2 - e / 2, 0.006));
  mete(D.bloque(null, 0.025, h - 2 * e, e, tc, bz, -d / 2 - 0.004, 0, -w / 2 + e / 2, 0.006));
  var lente = new THREE.Mesh(new THREE.PlaneGeometry(w - 2 * e + 0.004, h - 2 * e + 0.004), L.matLente);
  lente.rotation.y = -Math.PI / 2; lente.position.set(-d / 2 - 0.003, 0, 0); grp.add(lente);
  var halo = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.7, h * 1.7), L.matHalo);
  halo.rotation.y = -Math.PI / 2; halo.position.set(-d / 2 - 0.04, 0, 0); halo.renderOrder = 3; grp.add(halo);
  if(L.aletas){
    var nA = Math.max(5, Math.round(w / 0.045)), ia = new THREE.InstancedMesh(new THREE.BoxGeometry(0.05, h * 0.84, 0.008), D.M.mate(hx), nA), o3 = new THREE.Object3D();
    for(var i = 0; i < nA; i++){ o3.position.set(d / 2 + 0.022, 0, -w / 2 + w * (i + 0.5) / nA); o3.updateMatrix(); ia.setMatrixAt(i, o3.matrix); }
    ia.castShadow = true; grp.add(ia);
  } else {
    /* halogenuro: tapa trasera abombada con el balasto */
    mete(D.bloque(null, 0.06, h * 0.7, w * 0.7, tc, hx, d / 2 + 0.025, 0, 0, 0.02));
  }
  }
  var zy = w / 2 + 0.028, xb = d / 2 + 0.09, hy = L.hexYugo || CGTT_GALV2;
  [-1, 1].forEach(function(s){
    mete(D.tubo(null, [0, 0, s * zy], [xb, 0, s * zy], 0.014, 'metal', hy, 8));
    mete(D.cilindro(null, 0.034, 0.034, 0.025, 'mate', '#202326', 0, 0, s * (zy - 0.006), [Math.PI / 2, 0, 0], 16));
  });
  mete(D.tubo(null, [xb, 0, -zy], [xb, 0, zy], 0.016, 'metal', hy, 8));
  mete(D.tubo(null, [d / 2, -h * 0.3, 0], [xb, -h * 0.45, 0.04], 0.008, 'goma', '#16181A', 6));
  return grp;
}

/* cabezal: barra, abrazadera, postes, cuatro lamparas, caja de conexiones y
   una luz puntual que alumbra el propio cabezal */
function cgtTCabezal(D, G, m, L){
  var x = m.x, yC = L.yC, zmax = 0;
  L.pos.forEach(function(p){ zmax = Math.max(zmax, Math.abs(p[0])); });
  var mh = L.tipo === 'MH';
  var tex = cgtTTexLente(L.tipo, L.ventanas, L.vert);
  L.matLente = new THREE.MeshStandardMaterial({ color: '#000000', emissive: mh ? '#FFF1D6' : '#F2F7FF', emissiveMap: tex, emissiveIntensity: 1.35, roughness: 0.25, metalness: 0 });
  L.matHalo = new THREE.MeshBasicMaterial({ map: cgtTTexHalo(), color: mh ? '#FFE7B8' : '#E4EEFF', transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  D.bloque(null, 0.07, 0.07, 2 * zmax + 0.06, L.tipoBarra || 'pintura', L.hexBarra, x, yC, 0, 0.01);
  D.bloque(null, 0.12, 0.18, 0.12, L.tipoBarra || 'pintura', L.hexBarra, x, yC, 0, 0.012);
  D.cilindro(null, 0.03, 0.03, 0.08, 'metal', CGTT_GALV2, x, m.yTop + 0.04, 0, null, 14);
  var xl = x - (L.d / 2 + 0.10);
  L.pos.forEach(function(p){
    var dz = p[0], dy = p[1], s = dz > 0 ? 1 : -1;
    D.tubo(null, [x, yC, dz], [x, yC + dy, dz], 0.022, L.tipoBarra === 'metal' ? 'metal' : 'pintura', L.hexBarra, 10);
    D.bloque(null, 0.05, 0.05, 0.05, 'metal', CGTT_GALV2, x, yC + dy, dz, 0.008);
    cgtTLampara(D, G, L, xl, yC + dy, dz, s * (L.abre || 0.12), L.baja || 0.10);
  });
  if(L.caja){
    var c = L.caja;
    D.bloque(null, c.d, c.h, c.w, 'pintura', c.hex, x - 0.03, yC + (c.dy || 0), 0, 0.015);
    if(c.dib) cgtTCalco(G, texRotulo3d(c.dib, 128, 320), c.w * 0.86, c.h * 0.88, x - 0.03 - c.d / 2 - 0.003, yC + (c.dy || 0), 0, 0, -Math.PI / 2, 0, true);
  }
  var luz = new THREE.PointLight(mh ? 0xFFEBCB : 0xEEF4FF, 0.55, 8, 2);
  luz.position.set(xl - 0.7, yC, 0); G.add(luz);
}

/* ═══ armado general ═══ */
function cgtTArmar(c, piezas){
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  /* el estudio sale en sRGB pero en r128 el color hex del material se toma
     como lineal: el negro se veia gris, el arena de Doosan crema y el
     amarillo de Atlas Copco limon. Los colores de marca de este archivo
     estan en sRGB (como en las fotos), asi que aqui se pasan a lineal, en
     los materiales y en el color base al que vuelve el mapa de calor. Y la
     laca de los tonos oscuros refleja menos cielo (solo en esta construccion) */
  var oscuro = function(hex){ var c3 = new THREE.Color(hex); return c3.r + c3.g + c3.b < 0.6; };
  ['pintura', 'mate', 'metal', 'goma', 'vidrio', 'cromo'].forEach(function(t){
    var f = D.M[t];
    D.M[t] = function(hex){
      var m = f(hex ? cgtTLin(hex) : hex);
      if(hex && oscuro(hex) && (t === 'pintura' || t === 'mate')){ m.envMapIntensity = 0.3; if(t === 'pintura'){ m.clearcoat = 0.4; m.roughness = 0.42; } else m.metalness = 0.12; }
      return m;
    };
  });
  var F = c.carc, P = c.puerta, h = c.chasis, W = F.W;
  cgtTChasis(D, h);
  /* la batea bajo la carcasa es el tanque de combustible, con su tapa */
  var yb0 = h.yL + 0.045, bW = c.baseW || W - 0.04;
  D.bloque('TQC1', F.x1 - F.x0 - 0.02, F.y0 - yb0 + 0.01, bW, 'pintura', c.baseHex, (F.x0 + F.x1) / 2, (F.y0 + yb0) / 2, 0, 0.015);
  D.cilindro(null, 0.045, 0.045, 0.04, 'mate', '#16181A', F.x1 - 0.22, (F.y0 + yb0) / 2, bW / 2 + 0.018, [Math.PI / 2, 0, 0], 20);
  D.cilindro(null, 0.02, 0.02, 0.012, 'mate', '#16181A', F.x1 - 0.12, yb0 + 0.01, bW / 2 - 0.03, null, 10);
  var car = cgtTCarcasa(D, G, F, P);
  /* argolla de izaje en el techo */
  var xo = (F.x0 + F.x1) / 2 + (c.dxArgolla || 0);
  D.bloque(null, 0.16, 0.02, 0.10, 'metal', CGTT_GALV2, xo, F.y1 + 0.01, W * 0.12, 0.005);
  D.pon(null, new THREE.TorusGeometry(0.05, 0.013, 8, 20), 'metal', CGTT_GALV, xo, F.y1 + 0.07, W * 0.12, null);
  if(P) cgtTMotor(D, { x0: P.x0 + 0.02, x1: P.x1 - 0.02, y0: P.y0 + 0.01, y1: P.y1 - 0.01, zA: -W / 2, zB: car.zB - 0.01, yTecho: F.y1 }, c.motor);
  /* tablero: en el costado derecho del bloque delantero o en el frente */
  if(c.panel === 'frente') cgtTPanel(D, G, F.x0, F.y0 + (F.y1 - F.y0) * 0.45, -W * 0.27, Math.PI / 2);
  else cgtTPanel(D, G, (F.x0 + (P ? P.x0 : F.x1)) / 2, F.y0 + Math.min(0.30, (F.y1 - F.y0) * 0.42), -W / 2, 0);
  var Ms = c.mastil; Ms.xCarc = F.x0;
  cgtTMastil(D, G, Ms);
  cgtTCabezal(D, G, Ms, c.lamp);
  /* numero de unidad: placa atras */
  var texN = texNumero3d('#F4F4F2', '#111214');
  cgtTCalco(G, texN, 0.40, 0.125, F.x1 + 0.004, c.yNumero || F.y0 + 0.12, c.zNumero || 0, 0, Math.PI / 2, 0, true);
  if(c.extra) c.extra(D, G, c, car);
  G.traverse(function(m){ if(m.userData && m.userData.base) m.userData.base = cgtTLin(m.userData.base); });
  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ texN.userData.poner(id); };
  G.userData.mirarY = c.alto * 0.45;
  G.userData.dist = c.alto * 2.2 + 1.2;
  return G;
}

/* ═══ las dos torres de este archivo ═══ */

/* MAGNUM en rojo, cursiva gruesa con sombra negra, y el subrayado en cuna */
function cgtTDibMagnum(g, w, h){
  g.save(); g.setTransform(1, 0, -0.18, 1, h * 0.18, 0);
  g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  g.font = '900 ' + Math.round(h * 0.62) + 'px "Arial Black", Arial, sans-serif';
  g.fillStyle = '#111214'; g.fillText('MAGNUM', w * 0.045, h * 0.70, w * 0.90);
  g.fillStyle = '#D21F26'; g.fillText('MAGNUM', w * 0.035, h * 0.67, w * 0.90);
  g.restore();
  g.fillStyle = '#111214';
  g.beginPath(); g.moveTo(w * 0.04, h * 0.80); g.lineTo(w * 0.96, h * 0.76); g.lineTo(w * 0.94, h * 0.86); g.lineTo(w * 0.02, h * 0.90); g.closePath(); g.fill();
}
/* el modelo en letras negras, con la franja roja delante */
function cgtTDibModelo(txt, rojo){
  return function(g, w, h){
    g.fillStyle = rojo; g.fillRect(w * 0.02, h * 0.25, w * 0.04, h * 0.55);
    g.fillStyle = '#16171A'; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.font = '900 ' + Math.round(h * 0.72) + 'px "Arial Black", Arial, sans-serif';
    g.fillText(txt, w * 0.09, h * 0.55, w * 0.88);
  };
}

/* Terex RL4000 (heredera de la Amida AL4000): gabinete crema de cantos muy
   redondeados, remolque negro con lanza en A, mastil galvanizado de 30 pies
   y cuatro reflectores redondos de halogenuro de 1000 W */
function cgtTExtraRL4000(D, G, c, car){
  var F = c.carc, W2 = F.W / 2, tT = texRotulo3d(cgtTDibTerex, 512, 96), tM = texRotulo3d(cgtTDibModelo('RL4000', '#D0102C'), 384, 96);
  cgtTCalco(G, tT, 0.66, 0.124, 0.40, 1.06, W2 + 0.004, 0, 0, 0);
  cgtTCalco(G, tM, 0.40, 0.10, 1.12, 0.70, W2 + 0.004, 0, 0, 0);
  cgtTCalco(G, tT, 0.52, 0.098, F.x0 - 0.004, 1.05, -0.26, 0, -Math.PI / 2, 0);
  car.mete(cgtTCalco(G, tT, 0.56, 0.105, 0, 0, 0, 0, Math.PI, 0)).position.set(car.lx(0.86), car.ly(0.98), -0.016);
  car.mete(cgtTCalco(G, tM, 0.34, 0.085, 0, 0, 0, 0, Math.PI, 0)).position.set(car.lx(0.80), car.ly(0.74), -0.016);
  /* salida del radiador atras, cerraduras de las tapas y tapa del tanque */
  D.lamas(null, F.x1 + 0.006, 0.78, 1.10, -0.32, 0.32, 7, '#1E2124', 1);
  [[0.30, W2], [1.30, W2]].forEach(function(p){ D.bloque(null, 0.06, 0.03, 0.012, 'mate', '#16181A', p[0], 1.12, p[1] + 0.005, 0.004); });
  /* plataforma de rejilla delante del mastil */
  D.bloque(null, 0.30, 0.025, 0.56, 'metal', '#3A3F45', c.mastil.x - 0.34, c.chasis.yL + 0.07, 0, 0.006);
  for(var i = 0; i < 6; i++) D.bloque(null, 0.02, 0.012, 0.54, 'metal', '#2A2D31', c.mastil.x - 0.47 + i * 0.052, c.chasis.yL + 0.088, 0, 0.003);
}
function cgtTCfgRL4000(){
  return {
    alto: 9.14,
    carc: { forma: 'red', k: 0.22, r: 0.02, x0: -0.06, x1: 1.52, y0: 0.52, y1: 1.32, W: 1.10, hex: '#E6E0CE' },
    baseHex: CGTT_NEGRO,
    puerta: { x0: 0.42, x1: 1.30, y0: 0.60, y1: 1.10, rec: 0.58, bisagra: 'atras', ang: 1.92 },
    chasis: { xF: -0.36, xR: 1.55, zL: 0.36, yL: 0.42, hex: CGTT_NEGRO, xa: 0.90, R: 0.30, A: 0.15, via: 1.30, rAro: 0.165, aro: '#D9D9D4', guarda: CGTT_NEGRO,
      lanza: { tipo: 'A', xh: -1.85, yh: 0.48, hex: CGTT_NEGRO, enganche: 'ojo', gato: -1.30, cadenas: true },
      patas: [[-0.30, 0.34, -0.30, 1.45], [-0.30, -0.34, -0.30, -1.45], [1.48, 0.34, 1.48, 1.45], [1.48, -0.34, 1.48, -1.45]],
      hexViga: CGTT_GALV, tipoViga: 'metal', pata: 'galv' },
    mastil: { x: -0.22, y0: 0.40, yManga: 2.25, yTop: 8.82, n: 5, s0: 0.16, ds: 0.022, forma: 'red', hexManga: CGTT_GALV, tipoManga: 'metal',
      hexTramo: CGTT_GALV, tipoTramo: 'metal', yWinch: 1.35, yApoyo1: 0.75, yApoyo2: 1.15, hexApoyo: CGTT_NEGRO },
    lamp: { tipo: 'MH', redonda: true, r: 0.235, d: 0.26, w: 0.47, h: 0.47, hex: '#A9AFB4', tipoCaja: 'metal', bisel: '#C9CED3', aletas: false,
      pos: [[0.37, 0.30], [-0.37, 0.30], [0.37, -0.28], [-0.37, -0.28]], yC: 8.76, hexBarra: CGTT_GALV, tipoBarra: 'metal', abre: 0.16, baja: 0.14 },
    motor: { motor: '#5E6670', alt: '#3D4A57', cil: 3, turbo: true },
    extra: cgtTExtraRL4000
  };
}

/* Magnum MLT4060: caja de acero blanca de chaflanes, base y tapa negras,
   remolque ancho con cuatro patas, mastil negro y cuatro reflectores
   redondos de halogenuro con rejilla */
function cgtTExtraMLT(D, G, c, car){
  var F = c.carc, W2 = F.W / 2, k = F.k, tG = texRotulo3d(cgtTDibMagnum, 512, 128), tM = texRotulo3d(cgtTDibModelo('MLT4060', '#D21F26'), 384, 96);
  cgtTCalco(G, tG, 0.54, 0.135, 0.62, 1.12, W2 + 0.004, 0, 0, 0);
  cgtTCalco(G, tM, 0.36, 0.09, 0.66, 0.82, W2 + 0.004, 0, 0, 0);
  car.mete(cgtTCalco(G, tG, 0.50, 0.125, 0, 0, 0, 0, Math.PI, 0)).position.set(car.lx(0.74), car.ly(1.08), -0.016);
  car.mete(cgtTCalco(G, tM, 0.32, 0.08, 0, 0, 0, 0, Math.PI, 0)).position.set(car.lx(0.74), car.ly(0.82), -0.016);
  cgtTCalco(G, tG, 0.44, 0.11, F.x1 + 0.004, 1.12, 0, 0, Math.PI / 2, 0);
  /* filete negro arriba, siguiendo los chaflanes */
  [-1, 1].forEach(function(s){
    D.bloque(null, F.x1 - F.x0 + 0.01, 0.035, 0.02, 'mate', '#16181A', (F.x0 + F.x1) / 2, F.y1 - k - 0.03, s * (W2 + 0.002), 0.006);
  });
  /* toma de aire en el frente y salida del radiador atras */
  D.lamas(null, F.x0 - 0.005, 0.72, 1.18, -0.36, -0.08, 8, '#121416', -1);
  D.lamas(null, F.x1 + 0.006, 0.66, 0.98, -0.30, 0.30, 6, '#1E2124', 1);
  /* bisagras y cerradura del lado izquierdo */
  [0.74, 1.16].forEach(function(y){ D.bloque(null, 0.05, 0.07, 0.014, 'mate', '#16181A', 0.06, y, W2 + 0.006, 0.003); });
  D.bloque(null, 0.035, 0.05, 0.016, 'mate', '#16181A', 1.10, 0.95, W2 + 0.007, 0.004);
  /* plataforma de rejilla al pie del mastil */
  D.bloque(null, 0.34, 0.025, 0.60, 'metal', '#3A3F45', c.mastil.x - 0.30, c.chasis.yL + 0.07, 0, 0.006);
}
function cgtTCfgMLT(){
  return {
    alto: 7.1,
    carc: { forma: 'chaflan', k: 0.10, r: 0.015, x0: 0.00, x1: 1.30, y0: 0.58, y1: 1.36, W: 0.98, hex: '#EDEDEA' },
    baseHex: CGTT_NEGRO, baseW: 0.98,
    puerta: { x0: 0.30, x1: 1.18, y0: 0.64, y1: 1.22, rec: 0.56, bisagra: 'adelante', ang: 1.95 },
    chasis: { xF: -0.25, xR: 1.32, zL: 0.36, yL: 0.40, hex: CGTT_NEGRO, xa: 0.72, R: 0.30, A: 0.165, via: 1.42, rAro: 0.165, aro: '#D9D9D4', guarda: CGTT_NEGRO,
      lanza: { tipo: 'recta', xh: -1.50, yh: 0.47, hex: CGTT_NEGRO, enganche: 'ojo', gato: -1.05, cadenas: true },
      patas: [[-0.20, 0.34, -0.38, 0.88], [-0.20, -0.34, -0.38, -0.88], [1.28, 0.34, 1.42, 0.88], [1.28, -0.34, 1.42, -0.88]],
      hexViga: CGTT_NEGRO, pata: 'galv' },
    mastil: { x: -0.13, y0: 0.40, yManga: 2.10, yTop: 6.82, n: 4, s0: 0.17, ds: 0.024, forma: 'cuad', hexManga: CGTT_NEGRO, tipoManga: 'pintura',
      hexTramo: '#26282C', tipoTramo: 'pintura', yWinch: 1.45 },
    lamp: { tipo: 'MH', redonda: true, r: 0.215, d: 0.24, w: 0.43, h: 0.43, hex: '#B4B9BE', tipoCaja: 'metal', bisel: '#D0D4D8', aletas: false, rejilla: true,
      pos: [[0.33, 0.26], [-0.33, 0.26], [0.33, -0.24], [-0.33, -0.24]], yC: 6.78, hexBarra: CGTT_NEGRO, abre: 0.14, baja: 0.12 },
    motor: { motor: '#4E5966', alt: '#3D4A57', cil: 3 },
    yNumero: 0.70,
    extra: cgtTExtraMLT
  };
}

/* ═══ registro ═══
   Cada clave reconoce solo su modelo exacto y su marca: el 966 y el 992K
   (modelo_cargadores.js) y las torres RL4 (modelo_torres.js) no se tocan. */
function cgtMarca(e){ return String((e && e.marca) || '').toUpperCase(); }
registrarModelo3d({
  nombre: 'CAT 962H, 980H y 980L',
  clave: function(e){
    var m = mod3d(e);
    if(!/^CAT/.test(cgtMarca(e))) return null;
    return m === '962H' ? 'CGT962H' : m === '980H' ? 'CGT980H' : m === '980L' ? 'CGT980L' : null;
  },
  construir: function(e, piezas, clave){ return cgtConstruirH(String(clave).replace(/^CGT/, ''), piezas); }
});
registrarModelo3d({
  nombre: 'CAT 988H',
  clave: function(e){ return mod3d(e) === '988H' && /^CAT/.test(cgtMarca(e)) ? 'CGT988H' : null; },
  construir: function(e, piezas){ return cgtConstruir988H(piezas); }
});
registrarModelo3d({
  nombre: 'CAT 420E (retroexcavadora)',
  clave: function(e){ return mod3d(e) === '420E' && /^CAT/.test(cgtMarca(e)) ? 'CGT420E' : null; },
  construir: function(e, piezas){ return cgtConstruir420E(piezas); }
});
registrarModelo3d({
  nombre: 'Torre de iluminacion Terex RL4000',
  clave: function(e){ return mod3d(e) === 'RL4000' && /TEREX/.test(cgtMarca(e)) ? 'CGTRL4000' : null; },
  construir: function(e, piezas){ return cgtTArmar(cgtTCfgRL4000(), piezas); }
});
registrarModelo3d({
  nombre: 'Torre de iluminacion Magnum MLT4060',
  clave: function(e){ return mod3d(e) === 'MLT4060' && /MAGNUM/.test(cgtMarca(e)) ? 'CGTMLT4060' : null; },
  construir: function(e, piezas){ return cgtTArmar(cgtTCfgMLT(), piezas); }
});
