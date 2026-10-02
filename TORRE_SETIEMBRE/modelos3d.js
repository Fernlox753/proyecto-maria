/* ══════════════════════════════════════════════════════════════════
   MODELOS 3D POR MODELO — CAT 785C, 785D, 777F y 775F (mas abajo el
   Komatsu HD1500-7 y los anchos de tres ejes TONLY TLH135 y LGMG RTH100)

   El camion generico de la Torre (construirCamion) es uno solo para toda la
   flota y esta armado en espejo: con el frente hacia -X, su cabina cae a la
   derecha. Aqui cada modelo tiene su propia geometria, sacada de las hojas
   de dimensiones de Caterpillar (785C C643950 y folleto 785D):

     largo total 11.02 m (C) / 11.55 m (D) · ancho de operacion 6.64 m
     alto al ROPS 5.12 m · alero delantero 5.77 m (C) / 5.68 m (D)
     batalla 5.18 m · eje trasero a la cola 3.41 m · llantas 33.00R51
     trocha delantera 4.85 m · centro de duales traseras 4.285 m
     ancho total de llantas 6.27 m · tolva 5.89 m de ancho exterior

   Ejes: frente hacia -X, arriba +Y; con el frente hacia -X la IZQUIERDA del
   operador es +Z. En los CAT la cabina va a la izquierda, el radiador al
   centro del frente y los filtros de aire en la plataforma derecha. Las
   llantas siguen la numeracion de Caterpillar: 1 delantera izquierda,
   2 delantera derecha, 3-4 traseras izquierdas (exterior, interior),
   5-6 traseras derechas (interior, exterior).

   785D: cabina negra, escalera diagonal de 600 mm cruzando el frente, alero
   largo. 785C: cabina amarilla, escaleras verticales a los dos lados de la
   parrilla, alero corto. Todo lo demas en amarillo CAT; ruedas amarillas.

   Cada pieza lleva el codigo de sistema del maestro SAP (los mismos que usa
   el camion generico) para que el mapa de costo caiga donde corresponde.
   ══════════════════════════════════════════════════════════════════ */
var CAT_AM = '#E3A20B', CAT_AM2 = '#A97A07', CAT_NEGRO = '#1C1F23', CAT_GRIS = '#3C434B',
    CAT_GRIS2 = '#565F69', CAT_VIDRIO = '#2E4A63';

/* el modelo 3D que corresponde a un equipo; lo que no esta aqui usa el generico */
/* palas y perforadoras comparten constructor: el modelo exacto sale del equipo */
function modelo3dPala(e){ return /^6050/.test(String(e.mod).toUpperCase()) ? '6050FS' : '6040FS'; }
function modelo3dPerfo(e){
  var m = String(e.mod).toUpperCase().replace(/\s+/g, '');
  return /^DML/.test(m) ? 'DMLHP' : /^D75/.test(m) ? 'D75KS' : 'DR412I';
}
function modelo3dDe(e){
  /* primero los modelos registrados (modelo_*.js); despues los de este archivo */
  var reg = modelo3dRegistrado(e);
  if(reg) return reg.k;
  var m = String((e && e.mod) || '').toUpperCase().replace(/\s+/g, '');
  if(/^785C/.test(m)) return '785C';
  if(/^785D/.test(m)) return '785D';
  if(/^777F/.test(m)) return '777F';
  if(/^775F/.test(m)) return '775F';
  if(/^T800$/.test(m)) return 'T800';
  if(/^R9100/.test(m)) return 'R9100';
  if(/^992K/.test(m)) return '992K';
  if(/^60[45]0FS/.test(m)) return 'PALA' + m.slice(0, 4);
  if(/^(DMLHP|D75KS|DR412I)/.test(m)) return 'PERFO' + m.slice(0, 3);
  if(/^TLH135/.test(m)) return 'TLH135';
  if(/^RTH100/.test(m)) return 'RTH100';
  return 'generico';
}

/* letrero pintado en un lienzo: CATERPILLAR del alero, el CAT de los
   guardafangos y el numero de modelo en la tolva */
function texRotulo3d(dibujar, w, h){
  var c = document.createElement('canvas'); c.width = w; c.height = h;
  dibujar(c.getContext('2d'), w, h);
  var t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding;
  t.anisotropy = 4;
  return t;
}
function rotuloCAT(g, w, h){
  g.fillStyle = CAT_NEGRO; g.fillRect(0, 0, w, h);
  g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold ' + Math.round(h * 0.62) + 'px "Arial Black", Arial, sans-serif';
  g.fillText('CAT', w / 2, h * 0.50);
  /* el triangulo amarillo bajo la A */
  g.fillStyle = CAT_AM;
  g.beginPath(); g.moveTo(w * 0.47, h * 0.80); g.lineTo(w * 0.53, h * 0.80); g.lineTo(w * 0.50, h * 0.66);
  g.closePath(); g.fill();
}
function rotuloTexto(txt, fondo, tinta, ancho){
  return function(g, w, h){
    g.fillStyle = fondo; g.fillRect(0, 0, w, h);
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.66) + 'px "Arial Narrow", "Arial", sans-serif';
    g.save(); g.translate(w / 2, h * 0.53); g.scale(ancho || 1, 1);
    g.fillText(txt, 0, 0); g.restore();
  };
}

/* las herramientas con que se arma cualquier camion: cada pieza queda
   registrada con su codigo de sistema SAP y su color base, que es a donde
   vuelve el mapa de calor */
function kit3d(G, piezas){
  var L = 24;

  var caja = function(w, h, d){ return new THREE.BoxGeometry(w, h, d); };
  var cil = function(r1, r2, h, s){ return new THREE.CylinderGeometry(r1, r2, h, s || L); };
  var reg = function(code, malla, base){
    malla.userData.code = code || null;
    malla.userData.base = base || null;
    malla.castShadow = true; malla.receiveShadow = true;
    G.add(malla);
    if(code && piezas) piezas.push(malla);
    return malla;
  };
  var poner = function(code, geo, hex, x, y, z, rot, rug, met){
    var m = new THREE.Mesh(geo, matMetal(hex, rug === undefined ? 0.5 : rug, met === undefined ? 0.2 : met));
    m.position.set(x, y, z);
    if(rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
    return reg(code, m, hex);
  };
  /* pintura CAT: semibrillo, poco metal */
  var amarillo = function(code, geo, x, y, z, rot){ return poner(code, geo, CAT_AM, x, y, z, rot, 0.48, 0.10); };
  /* nervios y largueros: un tono mas oscuro para que se lean con la luz plana del estudio */
  var nervio = function(code, geo, x, y, z){ return poner(code, geo, '#C78F08', x, y, z, null, 0.5, 0.12); };
  var esTolva = function(m){ if(m) m.userData.tolva = true; return m; };
  /* barra entre dos puntos (pasamanos, largueros de escalera, mangueras) */
  var EJE_Y = new THREE.Vector3(0, 1, 0);
  var barra = function(code, a, b, r, hex, rug, met){
    var va = new THREE.Vector3(a[0], a[1], a[2]), vb = new THREE.Vector3(b[0], b[1], b[2]);
    var dir = vb.clone().sub(va), largo = dir.length();
    var m = new THREE.Mesh(cil(r, r, largo, 8), matMetal(hex, rug === undefined ? 0.45 : rug, met === undefined ? 0.5 : met));
    m.position.copy(va).add(vb).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(EJE_Y, dir.normalize());
    return reg(code, m, hex);
  };
  /* placa con perfil (x,y) extruida a lo ancho (Z) */
  var placa = function(pts, espesor, zc){
    var sh = new THREE.Shape();
    pts.forEach(function(p, i){ i ? sh.lineTo(p[0], p[1]) : sh.moveTo(p[0], p[1]); });
    sh.closePath();
    var g = new THREE.ExtrudeGeometry(sh, { depth: espesor, bevelEnabled: false });
    g.translate(0, 0, zc - espesor / 2);
    return g;
  };
  /* letrero plano: mira hacia +Z con ry = 0, hacia -X con ry = -PI/2, hacia -Z con ry = PI */
  var letrero = function(tex, w, h, x, y, z, ry){
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: 0.05 }));
    m.position.set(x, y, z); m.rotation.y = ry;
    G.add(m);
    return m;
  };
  var esTolva = function(m){ if(m) m.userData.tolva = true; return m; };

  /* rueda en su grupo (gira entera): llanta con perfil, banda con taco, aro
     del color de la marca y, del lado de afuera, pestana, cubo y pernos.
     o = { r, ancho, aro, aro2, pernos } */
  var ruedas = [];
  var rueda = function(code, x, z, afuera, o){
    var R = o.r, A = o.ancho, perfil = [];
    [[0.445, -0.476], [0.54, -0.50], [0.727, -0.524], [0.889, -0.50], [0.963, -0.393], [0.993, -0.19], [1, 0],
     [0.993, 0.19], [0.963, 0.393], [0.889, 0.50], [0.727, 0.524], [0.54, 0.50], [0.445, 0.476]].forEach(function(q){
      perfil.push(new THREE.Vector2(q[0] * R, q[1] * A));
    });
    var gr = new THREE.Group();
    gr.userData.rueda = true;
    gr.position.set(x, R, z);
    G.add(gr); ruedas.push(gr);
    var t = new THREE.Mesh(new THREE.LatheGeometry(perfil, 40), matMetal('#101215', 0.96, 0.02));
    t.rotation.x = Math.PI / 2;
    t.userData.isLlanta = true; t.userData.code = code; t.userData.base = '#101215';
    t.castShadow = true; t.receiveShadow = true;
    gr.add(t);
    if(piezas) piezas.push(t);
    var band = new THREE.Mesh(new THREE.CylinderGeometry(R + 0.012, R + 0.012, A * 0.80, 40, 1, true),
      new THREE.MeshStandardMaterial({ map: texLabrado(), color: new THREE.Color('#20262D'),
        roughness: 0.95, metalness: 0.03, transparent: true }));
    band.rotation.x = Math.PI / 2; gr.add(band);
    var rAro = R * 0.451;
    var aro = new THREE.Mesh(cil(rAro, rAro, A * 0.94, 32), matMetal(o.aro, 0.42, 0.15));
    aro.rotation.x = Math.PI / 2; gr.add(aro);
    if(afuera){
      var dz = afuera * A * 0.47;
      var pestana = new THREE.Mesh(new THREE.TorusGeometry(rAro - 0.01, 0.035, 8, 40), matMetal(o.aro2, 0.45, 0.2));
      pestana.position.z = dz; gr.add(pestana);
      var cubo = new THREE.Mesh(cil(rAro * 0.57, rAro * 0.63, 0.22, 24), matMetal(o.aro, 0.42, 0.15));
      cubo.rotation.x = Math.PI / 2; cubo.position.z = dz + afuera * 0.10; gr.add(cubo);
      var tapa = new THREE.Mesh(cil(rAro * 0.25, rAro * 0.30, 0.10, 18), matMetal(o.aro2, 0.45, 0.2));
      tapa.rotation.x = Math.PI / 2; tapa.position.z = dz + afuera * 0.24; gr.add(tapa);
      var nP = o.pernos || 12;
      for(var b = 0; b < nP; b++){
        var a = b / nP * Math.PI * 2;
        var pn = new THREE.Mesh(cil(0.035, 0.035, 0.07, 6), matMetal('#8E7A3A', 0.4, 0.7));
        pn.rotation.x = Math.PI / 2;
        pn.position.set(Math.cos(a) * rAro * 0.79, Math.sin(a) * rAro * 0.79, dz + afuera * 0.02);
        gr.add(pn);
      }
    }
    return gr;
  };

  /* la tolva cuelga del pivote trasero: se sacan del camion las piezas que
     son tolva y se cuelgan de un grupo, restando el pivote para que no se muevan */
  var colgarTolva = function(PIV, modelo){
    var tolvaG = new THREE.Group();
    tolvaG.position.copy(PIV);
    G.add(tolvaG);
    G.children.slice().forEach(function(m){
      if(!m.userData) return;
      if(m.userData.code === 'TLV' || m.userData.tolva){
        G.remove(m);
        m.position.sub(PIV);
        tolvaG.add(m);
      }
    });
    G.userData.tolvaG = tolvaG;
    G.userData.ruedas = ruedas;
    G.userData.pivTolva = PIV;
    G.userData.modelo = modelo;
  };

  /* ═══ para maquinas de cadenas y brazos (excavadoras, palas, perforadoras) ═══ */

  /* viga entre dos puntos del plano XY, a la altura z: brazos, plumas, mastiles.
     ancho = en Z, alto = de canto; alto2 la hace ahusada hacia b */
  var viga = function(code, a, b, z, ancho, alto, hex, alto2){
    var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
    var g = new THREE.BoxGeometry(L, alto, ancho);
    if(alto2 !== undefined && alto2 !== alto){
      var pos = g.attributes.position, k = alto2 / alto;
      for(var i = 0; i < pos.count; i++){ if(pos.getX(i) > 0) pos.setY(i, pos.getY(i) * k); }
      pos.needsUpdate = true; g.computeVertexNormals();
    }
    var m = poner(code, g, hex, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z, null, 0.48, 0.12);
    m.rotation.z = Math.atan2(dy, dx);
    return m;
  };
  /* cilindro hidraulico: camisa del color de la maquina y vastago cromado */
  var cilHid = function(code, a, b, r, hex, parte){
    var p = parte || 0.55, m = [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p];
    barra(code, a, m, r, hex, 0.45, 0.25);
    barra(null, m, b, r * 0.55, '#C9D2DA', 0.15, 0.95);
  };
  /* oruga: tejas de acero alrededor de un ovalo (rueda guia adelante, catarina
     atras), rodillos abajo y el bastidor al medio. x0 < x1, zc centro, alto = diametro */
  var oruga = function(code, x0, x1, zc, ancho, alto, hexBastidor){
    var R = alto / 2, yc = R, recto = x1 - x0 - alto, paso = Math.max(0.22, alto * 0.16);
    var gT = new THREE.BoxGeometry(paso * 0.92, R * 0.16 + 0.04, ancho);
    var mT = matMetal('#2B2F34', 0.8, 0.35);
    var per = 2 * recto + Math.PI * alto, n = Math.round(per / paso);
    for(var i = 0; i < n; i++){
      var s = i / n * per, x, y, ang;
      if(s < recto){ x = x0 + R + s; y = alto - 0.02; ang = 0; }
      else if(s < recto + Math.PI * R){ var t = (s - recto) / R; x = x1 - R + Math.sin(t) * R; y = yc + Math.cos(t) * R; ang = -t; }
      else if(s < 2 * recto + Math.PI * R){ x = x1 - R - (s - recto - Math.PI * R); y = 0.02; ang = Math.PI; }
      else { var t2 = (s - 2 * recto - Math.PI * R) / R; x = x0 + R - Math.sin(t2) * R; y = yc - Math.cos(t2) * R; ang = Math.PI - t2; }
      var te = new THREE.Mesh(gT, mT);
      te.position.set(x, y, zc); te.rotation.z = ang;
      reg(code, te, '#2B2F34');
    }
    poner(code, cil(R * 0.82, R * 0.82, ancho * 0.7, 22), hexBastidor, x0 + R, yc, zc, [Math.PI / 2, 0, 0], 0.5, 0.3);
    poner(code, cil(R * 0.86, R * 0.86, ancho * 0.7, 18), '#3A3F45', x1 - R, yc, zc, [Math.PI / 2, 0, 0], 0.5, 0.5);
    poner(code, caja(recto, alto * 0.62, ancho * 0.62), hexBastidor, (x0 + x1) / 2, yc + alto * 0.04, zc, null, 0.5, 0.2);
    for(var r = 0; r < Math.max(3, Math.round(recto / (alto * 0.55))); r++){
      var xr = x0 + R + (r + 0.5) * recto / Math.max(3, Math.round(recto / (alto * 0.55)));
      poner(null, cil(R * 0.28, R * 0.28, ancho * 0.66, 12), '#3A3F45', xr, R * 0.36, zc, [Math.PI / 2, 0, 0], 0.5, 0.5);
    }
  };

  return { caja: caja, cil: cil, reg: reg, poner: poner, barra: barra, placa: placa, letrero: letrero,
           esTolva: esTolva, rueda: rueda, colgarTolva: colgarTolva, viga: viga, cilHid: cilHid, oruga: oruga };
}

/* que equipos se ven en 3D: los camiones de acarreo (los que no tienen modelo
   propio con el generico) y cualquier otro que tenga su modelo. prefiere3d
   recuerda si el usuario eligio la vista 2D, para no cambiarsela al cambiar de equipo */
function tiene3d(e){ return !!e && (e.fam === 'ACARREO' || modelo3dDe(e) !== 'generico'); }
var prefiere3d = true;

/* 777F y 775F son de la misma familia que el 785D (escalera diagonal, cabina
   negra) pero no son un 785 en chico: tienen el frente mas largo respecto a
   su batalla. Se arma el 785D y despues se deforma por tramos: el frente, los
   dos ejes y la cola caen en sus medidas reales (hojas de dimensiones CAT),
   la altura sigue al ROPS y el ancho a la tolva; las ruedas se ponen aparte,
   con su tamano real, para que sigan redondas.
     777F: largo 10.535 · batalla 4.56 · eje a cola 3.062 · ROPS 4.715 · tolva 5.524
           llantas 27.00R49 · trocha delantera 4.05 · duales 3.576 · 5.223 sobre llantas
     775F: largo 10.334 · batalla 4.206 · eje a cola 2.833 · ROPS 4.108 · tolva 4.257
           llantas 24.00R35 · trocha delantera 3.205 · duales 2.729 · 4.411 sobre llantas */
var CAT_ESCALA = {
  '777F': { largo: 10.535, batalla: 4.56, cola: 3.062, rops: 4.715, tolva: 5.524,
            r: 1.345, a: 0.69, trochaD: 4.05, duales: 3.576, anchoLl: 5.223 },
  '775F': { largo: 10.334, batalla: 4.206, cola: 2.833, rops: 4.108, tolva: 4.257,
            r: 1.13, a: 0.66, trochaD: 3.205, duales: 2.729, anchoLl: 4.411 }
};
/* pasa cada malla a coordenadas del camion, mueve sus vertices con fx en X y
   escala Y y Z; las ruedas (grupos marcados) se saltan: se ubican despues */
function deformar3d(G, fx, sy, sz){
  G.updateMatrixWorld(true);
  var v = new THREE.Vector3(), mallas = [];
  G.traverse(function(m){
    if(!m.isMesh) return;
    for(var p = m.parent; p && p !== G; p = p.parent) if(p.userData && p.userData.rueda) return;
    mallas.push(m);
  });
  mallas.forEach(function(m){
    var g = m.geometry.clone();
    g.applyMatrix4(m.matrixWorld);
    var pos = g.attributes.position;
    for(var i = 0; i < pos.count; i++){
      v.fromBufferAttribute(pos, i);
      pos.setXYZ(i, fx(v.x), v.y * sy, v.z * sz);
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
    m.geometry.dispose();
    m.geometry = g;
    m.position.set(0, 0, 0); m.rotation.set(0, 0, 0); m.scale.set(1, 1, 1); m.quaternion.identity();
    if(m.parent !== G){ m.parent.remove(m); G.add(m); }
  });
}
/* recta por tramos que pasa por los puntos (de -> a) y sigue igual por fuera */
function tramos3d(de, a){
  return function(x){
    var k = 0;
    while(k < de.length - 2 && x > de[k + 1]) k++;
    return a[k] + (x - de[k]) * (a[k + 1] - a[k]) / (de[k + 1] - de[k]);
  };
}

function construirCatRigido(variante, piezas){
  var D = variante !== '785C';                /* 785D y la serie F: misma carroceria */
  var F = /F$/.test(variante);
  var G = new THREE.Group();
  var K = kit3d(G, piezas);
  var caja = K.caja, cil = K.cil, poner = K.poner, barra = K.barra, placa = K.placa,
      letrero = K.letrero, esTolva = K.esTolva;
  /* pintura CAT: semibrillo, poco metal */
  var amarillo = function(code, geo, x, y, z, rot){ return poner(code, geo, CAT_AM, x, y, z, rot, 0.48, 0.10); };
  /* nervios y largueros: un tono mas oscuro para que se lean con la luz plana del estudio */
  var nervio = function(code, geo, x, y, z){ return poner(code, geo, '#C78F08', x, y, z, null, 0.5, 0.12); };

  /* ═══ medidas (m) ═══ */
  var XD = -2.70, XT = 2.48;                 /* ejes: batalla 5.18 */
  var R_LL = 1.485, A_LL = 0.84;             /* 33.00R51 */
  var X_COLA = XT + 3.41;                    /* 5.89 */
  var X_ALERO = X_COLA - (D ? 11.55 : 10.615);
  var X_PARA = D ? -5.42 : -5.10;            /* frente del parachoques */
  var Y_PISO = 3.45;                          /* plataforma superior */
  var Z_PLAT = D ? 3.12 : 3.02;
  var ANCHO_ALERO = D ? 6.75 : 6.20;
  var Y_ALERO = D ? 5.68 : 5.77;
  var X_FR = -4.92;                           /* cara del radiador y guardafangos */

  /* ═══ bastidor (chasis amarillo, de caja) ═══ */
  [-0.74, 0.74].forEach(function(z){
    amarillo('42023615', caja(9.7, 0.62, 0.36), 0.0, 1.62, z);
  });
  amarillo('42023615', caja(0.9, 0.55, 1.84), X_COLA - 1.25, 1.78, 0);   /* travesano de cola */
  [-3.6, -1.2, 1.1].forEach(function(x){
    poner('42023615', caja(0.34, 0.42, 1.48), CAT_AM2, x, 1.55, 0, null, 0.5, 0.15);
  });
  /* pernos del pivote de la tolva */
  [-1.02, 1.02].forEach(function(z){
    poner('PYB', cil(0.17, 0.17, 0.42, 14), CAT_GRIS, X_COLA - 1.30, 2.30, z, [Math.PI / 2, 0, 0], 0.4, 0.75);
  });

  /* ═══ parachoques y frente ═══ */
  amarillo('42023615', caja(0.62, 0.86, 4.10), X_PARA + 0.31, 1.40, 0);
  /* faros del parachoques, dos pares */
  [-1.35, -0.95, 0.95, 1.35].forEach(function(z){
    poner(null, caja(0.06, 0.22, 0.30), CAT_NEGRO, X_PARA - 0.01, 1.55, z, null, 0.6, 0.3);
    poner('FNB', caja(0.04, 0.15, 0.20), '#F4EDCF', X_PARA - 0.04, 1.55, z, null, 0.2, 0.1);
  });
  /* defensa del motor bajo la parrilla */
  poner('42023615', caja(0.55, 0.20, 2.9), CAT_AM2, X_PARA + 0.65, 1.02, 0, null, 0.55, 0.15);

  /* parrilla del radiador: marco amarillo y lamas negras */
  poner('RAD1', caja(0.30, 1.62, 3.30), CAT_NEGRO, X_FR + 0.22, 2.62, 0, null, 0.7, 0.35);
  for(var i = 0; i < 11; i++){
    poner(null, caja(0.07, 0.05, 3.22), '#0E1013', X_FR + 0.05, 1.92 + i * 0.137, 0, null, 0.6, 0.4);
  }
  amarillo(null, caja(0.30, 0.12, 3.62), X_FR + 0.18, 3.43, 0);
  amarillo(null, caja(0.30, 1.70, 0.16), X_FR + 0.18, 2.62, -1.73);
  amarillo(null, caja(0.30, 1.70, 0.16), X_FR + 0.18, 2.62, 1.73);
  amarillo(null, caja(0.30, 0.14, 3.62), X_FR + 0.18, 1.80, 0);
  /* el radiador detras de la parrilla y su ventilador */
  poner('RAD1', caja(0.40, 1.55, 3.10), CAT_GRIS, X_FR + 0.62, 2.62, 0, null, 0.6, 0.5);
  poner('FAN1', new THREE.TorusGeometry(0.72, 0.09, 8, 28), CAT_GRIS2, X_FR + 0.98, 2.60, 0, [0, Math.PI / 2, 0], 0.5, 0.6);
  poner('MFC1', cil(0.24, 0.24, 0.42, 14), CAT_GRIS, X_FR + 1.16, 2.60, 0, [0, 0, Math.PI / 2], 0.45, 0.8);

  /* guardafangos delanteros: cara frontal con el CAT y los faros, y la tapa
     lateral que baja sobre la llanta */
  var texCAT = texRotulo3d(rotuloCAT, 256, 128);
  [-1, 1].forEach(function(lado){
    var zc = lado * ((1.85 + Z_PLAT) / 2), ancho = Z_PLAT - 1.85;
    amarillo(null, caja(0.20, 0.82, ancho), X_FR + 0.10, Y_PISO - 0.41, zc);
    letrero(texCAT, 0.78, 0.39, X_FR - 0.005, Y_PISO - 0.30, zc, -Math.PI / 2);
    /* faros del guardafango: el izquierdo es FDI */
    [-0.22, 0.22].forEach(function(dz){
      poner(null, caja(0.05, 0.20, 0.26), CAT_NEGRO, X_FR - 0.01, Y_PISO - 0.66, zc + dz, null, 0.6, 0.3);
      poner(lado > 0 ? 'FDI' : 'FDD', caja(0.04, 0.13, 0.18), '#F4EDCF', X_FR - 0.04, Y_PISO - 0.66, zc + dz, null, 0.2, 0.1);
    });
    /* tapa lateral del guardafango, sobre la llanta delantera */
    amarillo(null, caja(2.70, 0.55, 0.10), XD - 0.35, Y_PISO - 0.30, lado * (Z_PLAT - 0.05));
  });

  /* ═══ plataforma superior ═══ */
  amarillo(null, caja(-2.05 - (X_FR - 0.10), 0.14, Z_PLAT * 2), (X_FR - 0.10 - 2.05) / 2, Y_PISO - 0.07, 0);

  /* ═══ motor 3512, bajo la plataforma entre las ruedas delanteras ═══ */
  poner('ENG1', caja(2.55, 1.20, 1.45), CAT_GRIS, -3.25, 2.45, 0, null, 0.5, 0.65);
  poner('ENG1', caja(2.30, 0.36, 0.50), CAT_GRIS2, -3.25, 3.05, -0.45, null, 0.45, 0.7);
  poner('ENG1', caja(2.30, 0.36, 0.50), CAT_GRIS2, -3.25, 3.05, 0.45, null, 0.45, 0.7);
  poner('INY1', caja(2.10, 0.10, 0.36), CAT_GRIS, -3.25, 3.15, 0, null, 0.45, 0.75);
  poner('CMP', caja(0.55, 0.45, 0.45), CAT_GRIS2, -2.55, 2.10, -0.92, null, 0.5, 0.7);
  poner('42001655', cil(0.16, 0.16, 0.30, 14), CAT_GRIS2, -4.15, 2.85, -0.85, [0, 0, Math.PI / 2], 0.4, 0.8);
  poner('PCP2', cil(0.18, 0.18, 0.28, 14), CAT_GRIS2, -4.30, 2.20, 0.0, [0, 0, Math.PI / 2], 0.4, 0.8);
  poner('ARN', cil(0.17, 0.17, 0.45, 12), CAT_GRIS2, -3.95, 2.05, 0.92, [0, 0, Math.PI / 2], 0.4, 0.8);
  poner('AR1', cil(0.15, 0.15, 0.40, 12), CAT_GRIS2, -3.45, 2.05, 0.95, [0, 0, Math.PI / 2], 0.4, 0.8);

  /* ═══ cabina, a la IZQUIERDA (+Z) ═══ */
  var CX0 = -4.35, CX1 = -2.30, CZ0 = 0.95, CZ1 = 2.92, CY0 = Y_PISO, CY1 = 5.08;
  var colCab = D ? CAT_NEGRO : CAT_AM;
  var vidrio = new THREE.MeshStandardMaterial({ color: new THREE.Color(D ? '#1F3346' : '#4A6F8C'),
    roughness: 0.06, metalness: 0.45, transparent: true, opacity: D ? 0.9 : 0.7 });
  vidrio.envMapIntensity = 0.9;
  /* zocalo y techo de la cabina */
  poner('CBN', caja(CX1 - CX0, 0.55, CZ1 - CZ0), colCab, (CX0 + CX1) / 2, CY0 + 0.275, (CZ0 + CZ1) / 2, null, 0.45, 0.12);
  poner('CBN', caja(CX1 - CX0 + 0.16, 0.14, CZ1 - CZ0 + 0.16), colCab, (CX0 + CX1) / 2, CY1 - 0.07, (CZ0 + CZ1) / 2, null, 0.45, 0.12);
  /* los cuatro postes del ROPS */
  [[CX0, CZ0], [CX0, CZ1], [CX1, CZ0], [CX1, CZ1]].forEach(function(p){
    poner('CBN', caja(0.14, CY1 - CY0 - 0.6, 0.14), CAT_NEGRO, p[0], (CY0 + 0.55 + CY1 - 0.14) / 2, p[1], null, 0.5, 0.2);
  });
  /* vidrios: frente, costados y atras */
  var hV = CY1 - CY0 - 0.69, yV = CY0 + 0.55 + hV / 2;
  var vid = function(w, h, d, x, y, z){ var m = new THREE.Mesh(caja(w, h, d), vidrio); m.position.set(x, y, z); G.add(m); return m; };
  vid(0.04, hV, CZ1 - CZ0 - 0.12, CX0 - 0.01, yV, (CZ0 + CZ1) / 2);
  vid(CX1 - CX0 - 0.12, hV, 0.04, (CX0 + CX1) / 2, yV, CZ1 + 0.01);
  vid(CX1 - CX0 - 0.12, hV, 0.04, (CX0 + CX1) / 2, yV, CZ0 - 0.01);
  vid(0.04, hV * 0.7, CZ1 - CZ0 - 0.12, CX1 + 0.01, yV + hV * 0.12, (CZ0 + CZ1) / 2);
  /* puerta izquierda: el marco de la puerta y la manija */
  poner(null, caja(0.06, hV + 0.5, 0.04), CAT_NEGRO, CX0 + 0.95, CY0 + 0.3 + hV / 2 + 0.2, CZ1 + 0.03, null, 0.5, 0.3);
  poner(null, caja(0.18, 0.05, 0.05), '#9AA6B2', CX0 + 0.80, CY0 + 0.85, CZ1 + 0.05, null, 0.3, 0.9);
  /* aire acondicionado sobre el techo, atras */
  poner('AAC', caja(0.80, 0.24, 1.20), CAT_GRIS, CX1 - 0.55, CY1 + 0.12, (CZ0 + CZ1) / 2, null, 0.55, 0.4);
  /* faro pirata (de trabajo) sobre el techo, al frente */
  poner(null, caja(0.18, 0.20, 0.30), CAT_NEGRO, CX0 + 0.15, CY1 + 0.10, CZ1 - 0.35, null, 0.6, 0.3);
  poner('FPR', caja(0.05, 0.14, 0.22), '#F4EDCF', CX0 + 0.05, CY1 + 0.10, CZ1 - 0.35, null, 0.2, 0.1);
  /* la serie F lleva el CAT en el costado de la cabina */
  if(F) letrero(texCAT, 0.80, 0.40, (CX0 + CX1) / 2, CY0 + 0.28, CZ1 + 0.012, 0);
  /* tablero electrico y modulos detras de la cabina */
  poner('TAB', caja(0.35, 0.80, 0.90), CAT_GRIS, CX1 + 0.25, CY0 + 0.40, CZ0 + 0.55, null, 0.55, 0.45);
  poner('EC', caja(0.30, 0.40, 0.50), CAT_GRIS2, CX1 + 0.25, CY0 + 1.00, CZ0 + 0.55, null, 0.5, 0.5);
  poner('HAR', caja(0.06, 0.06, 1.70), '#22262B', CX1 + 0.10, CY0 + 0.15, 0.0, null, 0.8, 0.1);

  /* ═══ plataforma derecha: filtros de aire y extintores ═══ */
  var filtrosZ = D ? -2.25 : -0.55;
  (D ? [-4.15, -3.35] : [-4.45, -4.45]).forEach(function(x, k){
    var z = D ? filtrosZ : (k ? 0.55 : -0.55);
    amarillo(null, cil(0.32, 0.32, 0.92, 22), x, Y_PISO + 0.46, z);
    poner(null, cil(0.34, 0.34, 0.10, 22), CAT_NEGRO, x, Y_PISO + 0.96, z, null, 0.6, 0.3);
  });
  [-1.05, -1.30, -1.55].forEach(function(z){
    poner(null, cil(0.09, 0.09, 0.55, 12), '#B3261E', -4.60, Y_PISO + 0.30, z, null, 0.35, 0.3);
  });
  /* engrase centralizado y su bomba, en la plataforma derecha atras */
  poner('SEN', caja(0.55, 0.60, 0.45), CAT_GRIS, -2.55, Y_PISO + 0.30, -2.60, null, 0.5, 0.5);
  poner('GP1', cil(0.12, 0.12, 0.45, 12), CAT_GRIS2, -2.55, Y_PISO + 0.82, -2.60, null, 0.4, 0.8);
  poner('SENS', caja(0.22, 0.18, 0.20), CAT_GRIS2, -2.90, Y_PISO + 0.09, -1.90, null, 0.5, 0.6);
  poner('BAT', caja(0.70, 0.45, 0.55), CAT_NEGRO, -4.30, Y_PISO - 0.75, -2.55, null, 0.6, 0.3);

  /* ═══ pasamanos negros alrededor de la plataforma ═══ */
  var NEGRO_P = '#202327';
  var baranda = function(pts, alto){
    for(var k = 0; k < pts.length; k++){
      var p = pts[k];
      barra(null, [p[0], Y_PISO, p[1]], [p[0], Y_PISO + alto, p[1]], 0.03, NEGRO_P);
      if(k){
        var q = pts[k - 1];
        barra(null, [q[0], Y_PISO + alto, q[1]], [p[0], Y_PISO + alto, p[1]], 0.03, NEGRO_P);
        barra(null, [q[0], Y_PISO + alto * 0.52, q[1]], [p[0], Y_PISO + alto * 0.52, p[1]], 0.025, NEGRO_P);
      }
    }
  };
  var XB = X_FR - 0.05;
  /* derecha: del frente hacia atras por el borde; izquierda: el pasillo junto a la cabina */
  /* en el 785C quedan huecos donde llegan las dos escaleras verticales */
  baranda([[XB, D ? -0.15 : -2.35], [XB, -Z_PLAT + 0.06], [-3.30, -Z_PLAT + 0.06], [-2.15, -Z_PLAT + 0.06]], 1.05);
  baranda([[XB, D ? 0.55 : 2.35], [XB, Z_PLAT - 0.06], [-3.30, Z_PLAT - 0.06], [-2.15, Z_PLAT - 0.06]], 1.05);
  if(!D) baranda([[XB, -1.68], [XB, 0], [XB, 1.68]], 1.05);

  /* espejos: brazo desde la cabina (izquierdo) y en el poste delantero derecho */
  barra(null, [CX0 + 0.2, CY1 - 0.5, CZ1], [CX0 - 0.35, CY1 - 0.35, CZ1 + 0.55], 0.03, NEGRO_P);
  poner(null, caja(0.06, 0.55, 0.36), NEGRO_P, CX0 - 0.38, CY1 - 0.45, CZ1 + 0.60, null, 0.4, 0.6);
  barra(null, [XB, Y_PISO + 1.05, -Z_PLAT + 0.06], [XB - 0.15, Y_PISO + 1.55, -Z_PLAT - 0.25], 0.03, NEGRO_P);
  poner(null, caja(0.06, 0.55, 0.36), NEGRO_P, XB - 0.17, Y_PISO + 1.62, -Z_PLAT - 0.28, null, 0.4, 0.6);

  /* ═══ accesos ═══ */
  if(D){
    /* escalera diagonal de 600 mm que cruza el frente: sube de la esquina
       derecha del parachoques hacia el centro de la plataforma */
    var n = 7, y0 = 1.83, y1 = Y_PISO, z0 = -1.85, z1 = 0.15, xe1 = X_FR - 0.02, xe0 = xe1 - 0.60;
    for(var s = 1; s <= n; s++){
      var f = s / (n + 1);
      poner(null, caja(0.60, 0.05, 0.26), '#2A2E33', (xe0 + xe1) / 2, y0 + (y1 - y0) * f, z0 + (z1 - z0) * f, null, 0.7, 0.4);
    }
    [xe0, xe1].forEach(function(x){
      barra(null, [x, y0, z0 - 0.15], [x, y1, z1 + 0.15], 0.045, CAT_AM, 0.45, 0.15);
    });
    /* pasamanos de la escalera, por fuera */
    barra(null, [xe0 - 0.02, y0 + 0.95, z0 - 0.10], [xe0 - 0.02, y1 + 0.95, z1], 0.03, NEGRO_P);
    [0, 0.5, 1].forEach(function(f){
      var y = y0 + (y1 - y0) * f, z = z0 - 0.10 + (z1 - z0 + 0.10) * f;
      barra(null, [xe0 - 0.02, y, z], [xe0 - 0.02, y + 0.95, z], 0.03, NEGRO_P);
    });
    /* escalera vertical amarilla, del parachoques a la plataforma, frente a la cabina */
    var zl = 0.78;
    [zl - 0.22, zl + 0.22].forEach(function(z){
      barra(null, [X_PARA + 0.08, 1.83, z], [X_PARA + 0.08, Y_PISO + 0.95, z], 0.04, CAT_AM, 0.45, 0.15);
    });
    for(var r = 0; r < 6; r++){
      barra(null, [X_PARA + 0.08, 2.05 + r * 0.25, zl - 0.22], [X_PARA + 0.08, 2.05 + r * 0.25, zl + 0.22], 0.025, '#2A2E33');
    }
    /* peldanos colgantes bajo la esquina derecha del parachoques */
    [-2.20, -1.80].forEach(function(z){
      barra(null, [X_PARA + 0.05, 0.42, z], [X_PARA + 0.05, 1.00, z], 0.035, NEGRO_P);
    });
    [0.50, 0.78].forEach(function(y){
      barra(null, [X_PARA + 0.05, y, -2.20], [X_PARA + 0.05, y, -1.80], 0.03, NEGRO_P);
    });
  } else {
    /* 785C: dos escaleras verticales amarillas, a cada lado de la parrilla,
       desde debajo del parachoques hasta la plataforma */
    [-1, 1].forEach(function(lado){
      var zc = lado * 2.02;
      [zc - 0.20, zc + 0.20].forEach(function(z){
        barra(null, [X_PARA - 0.06, 0.45, z], [X_PARA - 0.06, Y_PISO + 0.95, z], 0.04, CAT_AM, 0.45, 0.15);
      });
      for(var r2 = 0; r2 < 11; r2++){
        barra(null, [X_PARA - 0.06, 0.60 + r2 * 0.27, zc - 0.20], [X_PARA - 0.06, 0.60 + r2 * 0.27, zc + 0.20], 0.025, '#2A2E33');
      }
    });
  }

  /* ═══ tren de fuerza bajo la tolva ═══ */
  poner('CON', cil(0.55, 0.55, 0.70, 22), CAT_GRIS, -1.70, 1.62, 0, [0, 0, Math.PI / 2], 0.45, 0.7);
  poner('TRM', caja(1.90, 1.05, 1.05), CAT_GRIS, -0.45, 1.50, 0, null, 0.5, 0.7);
  poner('HPM', cil(0.20, 0.20, 0.45, 12), CAT_GRIS2, -1.45, 1.30, -0.62, [0, 0, Math.PI / 2], 0.4, 0.8);
  poner('SPM', cil(0.18, 0.18, 0.40, 12), CAT_GRIS2, -1.45, 1.30, 0.62, [0, 0, Math.PI / 2], 0.4, 0.8);
  poner('VV1', caja(0.45, 0.35, 0.40), CAT_GRIS2, 0.75, 1.95, -0.55, null, 0.5, 0.6);
  poner(null, cil(0.12, 0.12, 1.75, 12), '#9AA6B2', 1.30, 1.45, 0, [0, 0, Math.PI / 2], 0.3, 0.9);
  poner('FDP', cil(0.32, 0.32, 0.20, 18), CAT_GRIS, 1.15, 1.45, 0, [0, 0, Math.PI / 2], 0.45, 0.7);
  /* puente trasero: carcasa, diferencial y mandos finales en cada rueda */
  poner('DIFP', new THREE.SphereGeometry(0.78, 22, 14), CAT_AM2, XT, R_LL, 0, null, 0.5, 0.2);
  poner(null, cil(0.42, 0.50, 2.20, 18), CAT_AM2, XT, R_LL, 0, [Math.PI / 2, 0, 0], 0.5, 0.2);
  poner('MLH', cil(0.66, 0.66, 0.45, 22), CAT_GRIS, XT, R_LL, 1.30, [Math.PI / 2, 0, 0], 0.45, 0.7);
  poner('MRH', cil(0.66, 0.66, 0.45, 22), CAT_GRIS, XT, R_LL, -1.30, [Math.PI / 2, 0, 0], 0.45, 0.7);
  poner('BPD', cil(0.50, 0.50, 0.18, 18), CAT_GRIS2, XT, R_LL, -1.05, [Math.PI / 2, 0, 0], 0.45, 0.7);

  /* tanques entre las ruedas: combustible a la izquierda, hidraulico a la derecha */
  amarillo('TQC1', caja(1.15, 1.15, 0.78), -0.85, 1.62, 1.55);
  amarillo('TQH1', caja(1.15, 1.15, 0.78), -0.85, 1.62, -1.55);

  /* ═══ suspension y direccion ═══ */
  var cilSusp = function(code, x, z, yb, yt, incl){
    poner(code, cil(0.24, 0.24, (yt - yb) * 0.62, 16), CAT_AM2, x, yb + (yt - yb) * 0.66, z, [incl || 0, 0, 0], 0.45, 0.2);
    poner(null, cil(0.13, 0.13, (yt - yb) * 0.48, 14), '#C9D2DA', x, yb + (yt - yb) * 0.25, z, [incl || 0, 0, 0], 0.15, 0.95);
  };
  cilSusp('SDI', XD, 1.62, 1.75, 3.30);
  cilSusp('SDD', XD, -1.62, 1.75, 3.30);
  cilSusp('SPI', XT + 0.75, 1.00, 1.55, 2.45, 0.10);
  cilSusp('SPD', XT + 0.75, -1.00, 1.55, 2.45, -0.10);
  poner('BMLH', cil(0.48, 0.48, 0.40, 20), CAT_GRIS, XD, R_LL, 1.82, [Math.PI / 2, 0, 0], 0.45, 0.7);
  poner('BDI', cil(0.42, 0.42, 0.14, 18), CAT_GRIS2, XD, R_LL, 1.55, [Math.PI / 2, 0, 0], 0.45, 0.7);
  poner('HAC2', cil(0.16, 0.16, 0.70, 14), CAT_GRIS2, XD + 1.10, 2.30, -1.05, null, 0.4, 0.75);
  poner('BMRH', cil(0.48, 0.48, 0.40, 20), CAT_GRIS, XD, R_LL, -1.82, [Math.PI / 2, 0, 0], 0.45, 0.7);
  barra('SRH', [XD + 0.75, 1.55, -0.80], [XD + 0.25, 1.55, -1.62], 0.10, '#C9D2DA', 0.15, 0.95);
  barra(null, [XD + 0.75, 1.55, 0.80], [XD + 0.25, 1.55, 1.62], 0.10, '#C9D2DA', 0.15, 0.95);

  /* mangueras hidraulicas y neumaticas a lo largo del bastidor */
  [-0.98, 0.98].forEach(function(z){
    barra('LPH', [-4.2, 1.95, z], [3.8, 1.95, z], 0.045, '#23272C', 0.85, 0.1);
    barra('LPA', [-4.2, 1.82, z * 0.96], [3.2, 1.82, z * 0.96], 0.035, '#30353B', 0.85, 0.1);
  });

  /* luces traseras */
  [-0.70, 0.70].forEach(function(z){
    poner(null, caja(0.10, 0.28, 0.40), CAT_NEGRO, X_COLA - 0.78, 1.95, z, null, 0.6, 0.3);
    poner('LSM', caja(0.06, 0.20, 0.30), '#C2241B', X_COLA - 0.72, 1.95, z, null, 0.3, 0.2);
  });

  /* ═══ cilindros de levante (pistones hidraulicos), entre las ruedas ═══ */
  [-1.30, 1.30].forEach(function(z){
    barra('PHY', [0.00, 1.05, z], [0.55, 2.25, z], 0.20, CAT_AM2, 0.45, 0.2);
    barra(null, [0.55, 2.25, z], [0.78, 2.72, z], 0.11, '#C9D2DA', 0.15, 0.95);
  });

  /* ═══ tolva (doble pendiente) ═══ */
  var Y_BORDE = 4.97;            /* altura de carga vacio */
  var ZB = 2.945;                /* ancho exterior 5.89 */
  var bajo = function(x){         /* canto inferior del costado */
    return x <= 2.75 ? 2.22 : 2.22 + (x - 2.75) * (4.05 - 2.22) / (X_COLA + 0.10 - 2.75);
  };
  var perfilCostado = [[-2.40, 5.40], [-1.70, 5.02], [X_COLA + 0.06, Y_BORDE], [X_COLA + 0.10, 4.05],
                       [2.75, 2.22], [-1.05, 2.22], [-1.30, 2.62]];
  [-1, 1].forEach(function(lado){
    esTolva(amarillo('TLV', placa(perfilCostado, 0.10, lado * (ZB - 0.05)), 0, 0, 0));
    /* larguero superior del borde */
    esTolva(nervio('TLV', caja(X_COLA + 1.75, 0.28, 0.30), (X_COLA - 1.70) / 2, Y_BORDE - 0.10, lado * (ZB + 0.06)));
    /* larguero intermedio, paralelo al piso */
    var xa = -1.0, xb = X_COLA - 0.2, ya = 3.35, yb = 4.35;
    var ri = esTolva(nervio('TLV', caja(Math.hypot(xb - xa, yb - ya), 0.20, 0.24), (xa + xb) / 2, (ya + yb) / 2, lado * (ZB + 0.06)));
    ri.rotation.z = Math.atan2(yb - ya, xb - xa);
    /* nervios verticales */
    [-0.55, 0.65, 1.85, 3.05, 4.20, 5.25].forEach(function(x){
      var y0 = bajo(x) + 0.05, y1 = Y_BORDE - 0.15;
      esTolva(nervio('TLV', caja(0.20, y1 - y0, 0.22), x, (y0 + y1) / 2, lado * (ZB + 0.06)));
    });
  });
  /* piso: tramo plano y tramo que sube hacia la cola */
  esTolva(amarillo('TLV', caja(3.75, 0.12, ZB * 2 - 0.2), 0.70, 2.84, 0));
  var piso2 = esTolva(amarillo('TLV', caja(Math.hypot(X_COLA - 2.55, 4.12 - 2.84), 0.12, ZB * 2 - 0.2), (2.58 + X_COLA) / 2, (2.84 + 4.12) / 2, 0));
  piso2.rotation.z = Math.atan2(4.12 - 2.84, X_COLA - 2.58);
  /* vigas bajo el piso */
  [-0.70, 0.70].forEach(function(z){
    esTolva(poner('TLV', caja(3.9, 0.55, 0.30), CAT_AM2, 0.85, 2.48, z, null, 0.5, 0.15));
  });
  /* pared frontal inclinada */
  var fr = esTolva(amarillo('TLV', caja(0.14, Math.hypot(1.10, 2.78), ZB * 2 - 0.1), -1.85, 4.01, 0));
  fr.rotation.z = Math.atan2(1.10, 2.78);
  /* alero sobre la cabina: placa, cantos y bordes */
  var largoAl = -2.30 - X_ALERO;
  var al = esTolva(amarillo('TLV', caja(largoAl, 0.14, ANCHO_ALERO), (X_ALERO - 2.30) / 2, (Y_ALERO + 5.40) / 2 - 0.05, 0));
  al.rotation.z = -Math.atan2(Y_ALERO - 5.40, largoAl);
  esTolva(amarillo('TLV', caja(0.16, 0.42, ANCHO_ALERO), X_ALERO + 0.08, Y_ALERO - 0.17, 0));
  [-1, 1].forEach(function(lado){
    esTolva(amarillo('TLV', caja(largoAl, 0.34, 0.10), (X_ALERO - 2.30) / 2, (Y_ALERO + 5.40) / 2 - 0.20, lado * (ANCHO_ALERO / 2 - 0.05)));
    /* cartela que une el alero con la pared frontal */
    esTolva(amarillo('TLV', placa([[-2.36, 5.38], [-3.70, 5.48], [-2.00, 4.40]], 0.10, lado * (ANCHO_ALERO / 2 - 0.40)), 0, 0, 0));
  });
  /* CATERPILLAR en negro en el canto del alero */
  var texCater = texRotulo3d(rotuloTexto('CATERPILLAR', CAT_NEGRO, '#FFFFFF', 0.78), 1024, 96);
  esTolva(letrero(texCater, ANCHO_ALERO * 0.62, 0.36, X_ALERO - 0.005, Y_ALERO - 0.17, 0, -Math.PI / 2));
  /* el numero de modelo en los dos costados de la tolva, adelante */
  var texMod = texRotulo3d(rotuloTexto(variante, CAT_NEGRO, '#FFFFFF', 0.95), 256, 96);
  esTolva(letrero(texMod, 0.95, 0.36, -1.15, 4.55, ZB + 0.06, 0));
  esTolva(letrero(texMod, 0.95, 0.36, -1.15, 4.55, -ZB - 0.06, Math.PI));
  /* expulsores de roca entre las duales */
  [-2.14, 2.14].forEach(function(z){
    esTolva(barra(null, [XT, 3.40, z], [XT + 0.05, 2.20, z], 0.06, CAT_GRIS2, 0.5, 0.6));
  });

  /* ═══ llantas 33.00R51 en aros amarillos ═══ */
  /* trocha delantera 4.85; duales con centros a 4.285 y 6.27 de ancho total */
  var LL = { r: R_LL, ancho: A_LL, aro: CAT_AM, aro2: CAT_AM2, pernos: 12 };
  var zOut = 3.135 - A_LL / 2, zIn = 2 * 2.1425 - zOut;
  var rs = [K.rueda('LL1', XD, 2.425, 1, LL), K.rueda('LL2', XD, -2.425, -1, LL),
            K.rueda('LL3', XT, zOut, 1, LL), K.rueda('LL4', XT, zIn, 0, LL),
            K.rueda('LL5', XT, -zIn, 0, LL), K.rueda('LL6', XT, -zOut, -1, LL)];
  var PIV = new THREE.Vector3(X_COLA - 1.30, 2.30, 0);

  var E = CAT_ESCALA[variante];
  if(E){
    /* frente, eje delantero, eje trasero y cola del 785D -> los del modelo */
    var fr0 = X_ALERO, sy = E.rops / 5.122, sz = E.tolva / 5.89;
    var tR = E.largo / 2, tD = tR - E.cola - E.batalla, tT = tR - E.cola;
    var fx = tramos3d([fr0, XD, XT, X_COLA], [-E.largo / 2, tD, tT, tR]);
    deformar3d(G, fx, sy, sz);
    var o = E.anchoLl / 2 - E.a / 2, ii = E.duales - o;
    var lug = [[tD, E.trochaD / 2], [tD, -E.trochaD / 2], [tT, o], [tT, ii], [tT, -ii], [tT, -o]];
    rs.forEach(function(gr, k){
      gr.position.set(lug[k][0], E.r, lug[k][1]);
      gr.scale.set(E.r / R_LL, E.r / R_LL, E.a / A_LL);
    });
    PIV.set(fx(PIV.x), PIV.y * sy, 0);
  }
  K.colgarTolva(PIV, variante);
  return G;
}

/* el Komatsu HD1500-7 esta en modelo_hd1500.js (modelo de detalle) */

/* ══════════════════════════════════════════════════════════════════
   CAMIONES ANCHOS DE TRES EJES (6x4) — TONLY TLH135 y LGMG RTH100

   Son los hibridos chinos que llegaron a Marcona para Shougang Hierro Peru
   (62 TLH135 y 30 RTH100). No son camiones rigidos de dos ejes como los CAT
   o el Komatsu: llevan un eje delantero y dos traseros, llantas radiales
   R29, la cabina adelante y la tolva larga con alero. En SAP tienen diez
   posiciones de llanta, asi que los dos ejes traseros van con duales:
     1 delantera izquierda, 2 delantera derecha;
     eje medio: 3 izquierda exterior, 4 izquierda interior, 5 derecha interior, 6 derecha exterior;
     eje trasero: 7, 8, 9, 10 en el mismo orden.

   TLH135 (ficha TONLY): 10.611 x 4.120 x 4.755 m · ejes 4.175 + 1.900 ·
     trocha 3.139 / 2.860 · llantas 480/95R29 · verde agua y negro · cabina
     a la izquierda y a la derecha el gabinete negro del sistema hibrido ·
     un solo cilindro de levante telescopico, adelante de la tolva.
   RTH100 (ficha LGMG): 10.700 x 5.258 x 4.421 m · ejes 4.060 + 1.850 ·
     trocha 3.414 / 3.240 · llantas 505/95R29 adelante y 530/95R29 atras ·
     tolva 6.4 x 4.2 x 1.85 · verde claro y negro · nariz angosta al
     centro con la parrilla, cabina detras, bateria negra con la hoja verde ·
     dos cilindros de levante entre los ejes.
   ══════════════════════════════════════════════════════════════════ */
var ANCHO6X4 = {
  'TLH135': { marca: 'TONLY', largo: 10.611, ancho: 4.12, alto: 4.755, ejes: [4.175, 1.90], vuelo: 1.95,
              trD: 3.139, trT: 2.86, llD: { r: 0.825, a: 0.48 }, llT: { r: 0.825, a: 0.48 },
              c1: '#3DBE9A', c2: '#2B8E71', negro: '#1A1D21', aro: '#25292E', aro2: '#3A4047',
              tolva: { largo: 6.30, alto: 1.95, piso: 1.78 }, nariz: false, cilindro: 'frontal' },
  'RTH100': { marca: 'LGMG', largo: 10.70, ancho: 4.20, alto: 4.421, ejes: [4.06, 1.85], vuelo: 2.05,
              trD: 3.414, trT: 3.24, llD: { r: 0.848, a: 0.505 }, llT: { r: 0.872, a: 0.53 },
              c1: '#B7D59A', c2: '#8DAE72', negro: '#1B1E22', aro: '#D3E5C4', aro2: '#9FB98A',
              tolva: { largo: 6.40, alto: 1.85, piso: 1.72 }, nariz: true, cilindro: 'doble' }
};

/* logos: TONLY (rombo rojo y nombre negro sobre blanco) y el de LGMG
   (franja negra con el nombre chino y una raya roja) */
function rotuloTonly(g, w, h){
  g.fillStyle = '#F4F6F5'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#D52B1E';
  g.beginPath(); g.moveTo(w * 0.06, h * 0.78); g.lineTo(w * 0.16, h * 0.22); g.lineTo(w * 0.26, h * 0.22);
  g.lineTo(w * 0.16, h * 0.78); g.closePath(); g.fill();
  g.fillStyle = '#111316'; g.textAlign = 'left'; g.textBaseline = 'middle';
  g.font = 'bold ' + Math.round(h * 0.62) + 'px "Arial Black", Arial, sans-serif';
  g.fillText('TONLY', w * 0.30, h * 0.53);
}
function rotuloLgmg(txt){
  return function(g, w, h){
    g.fillStyle = '#16181B'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#D52B1E'; g.fillRect(0, h * 0.84, w, h * 0.10);
    g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.52) + 'px "Microsoft YaHei", "SimHei", "Arial Black", Arial, sans-serif';
    g.fillText(txt, w / 2, h * 0.44);
  };
}
function rotuloHoja(g, w, h){
  g.fillStyle = '#16181B'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#7CC243'; g.lineWidth = w * 0.05;
  g.beginPath(); g.ellipse(w * 0.5, h * 0.5, w * 0.24, h * 0.36, -0.7, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.moveTo(w * 0.33, h * 0.72); g.lineTo(w * 0.67, h * 0.28); g.stroke();
}

function construirAncho6x4(id, piezas){
  var C = ANCHO6X4[id], RTH = C.nariz;
  var G = new THREE.Group();
  var K = kit3d(G, piezas);
  var caja = K.caja, cil = K.cil, poner = K.poner, barra = K.barra, placa = K.placa,
      letrero = K.letrero, esTolva = K.esTolva;
  var color = function(code, geo, x, y, z, rot){ return poner(code, geo, C.c1, x, y, z, rot, 0.45, 0.10); };
  var negro = function(code, geo, x, y, z, rot){ return poner(code, geo, C.negro, x, y, z, rot, 0.6, 0.25); };
  var nervio = function(code, geo, x, y, z){ return poner(code, geo, C.c2, x, y, z, null, 0.5, 0.12); };

  /* ═══ medidas ═══ */
  var XF = -C.largo / 2, XC = C.largo / 2;
  var XD = XF + C.vuelo, X1 = XD + C.ejes[0], X2 = X1 + C.ejes[1];
  var T = C.tolva, ZB = C.ancho / 2, YP = T.piso, YB = T.piso + T.alto;
  var X0 = XC - T.largo;                    /* pared delantera de la tolva */
  var Y_CAB = RTH ? 1.92 : 1.80;            /* piso de la cabina */

  /* ═══ bastidor negro, travesanos y defensa ═══ */
  [-0.50, 0.50].forEach(function(z){ negro('42023615', caja(C.largo - 0.9, 0.42, 0.26), 0.15, 1.15, z); });
  [XD - 0.9, X0 + 0.3, (X1 + X2) / 2, XC - 0.8].forEach(function(x){
    negro('42023615', caja(0.24, 0.30, 1.02), x, 1.12, 0);
  });
  /* parachoques con luces y peldanos colgantes en las puntas */
  if(RTH) color('42023615', caja(0.42, 0.42, 3.40), XF + 0.21, 0.98, 0);
  else negro('42023615', caja(0.42, 0.52, 3.70), XF + 0.21, 0.92, 0);
  [-1, 1].forEach(function(lado){
    [0.45, 0.70].forEach(function(dz){
      poner(null, caja(0.05, 0.14, 0.20), '#2A2E33', XF - 0.01, RTH ? 0.98 : 1.00, lado * (dz + 0.35), null, 0.6, 0.3);
      poner('LSM', caja(0.04, 0.09, 0.15), RTH ? '#F0A41C' : '#F4EDCF', XF - 0.04, RTH ? 0.98 : 1.00, lado * (dz + 0.35), null, 0.2, 0.1);
    });
    var zp = lado * (RTH ? 1.55 : 1.70);
    [zp - 0.16, zp + 0.16].forEach(function(z){ barra(null, [XF + 0.05, 0.30, z], [XF + 0.05, 0.75, z], 0.025, C.negro); });
    [0.38, 0.60].forEach(function(y){ barra(null, [XF + 0.05, y, zp - 0.16], [XF + 0.05, y, zp + 0.16], 0.02, C.negro); });
  });

  /* ═══ guardafangos delanteros ═══ */
  var zLLD = C.trD / 2, aD = C.llD.a, rD = C.llD.r;
  [-1, 1].forEach(function(lado){
    var zf = lado * zLLD;
    (RTH ? color : negro)(null, caja(2.10, 0.12, aD + 0.36), XD, rD * 2 + 0.16, zf);
    negro(null, caja(0.12, 0.55, aD + 0.36), XD - 1.02, rD * 2 - 0.10, zf);
    if(RTH){
      /* cara frontal verde con dos pares de faros */
      color(null, caja(0.30, 0.70, aD + 0.36), XD - 1.0, rD * 2 + 0.55, zf);
      [-0.12, 0.12].forEach(function(dz){
        poner(null, caja(0.05, 0.16, 0.18), '#2A2E33', XD - 1.16, rD * 2 + 0.60, zf + dz, null, 0.6, 0.3);
        poner(lado > 0 ? 'FDI' : 'LSM', caja(0.04, 0.11, 0.13), '#F4EDCF', XD - 1.18, rD * 2 + 0.60, zf + dz, null, 0.2, 0.1);
      });
    }
  });

  /* ═══ frente: nariz con parrilla (RTH100) o gabinete hibrido (TLH135) ═══ */
  var CX0, CX1, CZ0, CZ1, CY1;
  if(RTH){
    var NX0 = XF + 0.10, NX1 = XF + 1.45;
    color(null, caja(NX1 - NX0, 1.55, 1.70), (NX0 + NX1) / 2, 1.95, -0.10);
    poner('RAD1', caja(0.08, 1.30, 1.40), '#15171A', NX0 - 0.03, 1.98, -0.10, null, 0.7, 0.35);
    for(var i = 0; i < 7; i++) poner(null, caja(0.05, 0.04, 1.34), '#0B0C0E', NX0 - 0.08, 1.45 + i * 0.17, -0.10, null, 0.6, 0.4);
    /* el logo redondo rojo en la parrilla */
    poner(null, cil(0.13, 0.13, 0.04, 20), '#C62A1E', NX0 - 0.11, 2.42, -0.10, [0, 0, Math.PI / 2], 0.4, 0.3);
    /* paneles negros a los costados de la nariz, con RTH100 en vertical */
    var texNar = texRotulo3d(function(g, w, h){
      g.fillStyle = '#16181B'; g.fillRect(0, 0, w, h);
      g.save(); g.translate(w / 2, h / 2); g.rotate(-Math.PI / 2);
      g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = 'bold ' + Math.round(w * 0.62) + 'px "Arial Black", Arial, sans-serif';
      g.fillText('RTH100', 0, 0); g.restore();
    }, 96, 384);
    [-1, 1].forEach(function(lado){
      negro(null, caja(1.20, 1.30, 0.06), (NX0 + NX1) / 2 + 0.05, 1.98, -0.10 + lado * 0.88);
      letrero(texNar, 0.30, 1.15, (NX0 + NX1) / 2 + 0.05, 1.98, -0.10 + lado * 0.92, lado > 0 ? 0 : Math.PI);
    });
    /* cabina detras de la nariz, corrida a la izquierda */
    CX0 = XF + 1.30; CX1 = XF + 3.30; CZ0 = -0.50; CZ1 = 1.85; CY1 = 3.78;
    /* bateria negra con la hoja verde, detras de la cabina a la izquierda */
    negro('EC', caja(0.95, 1.85, 1.75), CX1 + 0.55, Y_CAB + 0.40, 1.05);
    var texHoja = texRotulo3d(rotuloHoja, 128, 128);
    letrero(texHoja, 0.55, 0.55, CX1 + 0.55, Y_CAB + 0.75, 1.935, 0);
    /* a la derecha, otro gabinete negro sobre el guardafango */
    negro('TAB', caja(1.90, 1.10, 1.30), CX0 + 0.90, Y_CAB + 0.30, -1.35);
  } else {
    CX0 = XF + 0.40; CX1 = XF + 2.45; CZ0 = 0.08; CZ1 = 2.00; CY1 = 3.92;
    /* gabinete negro del sistema hibrido a la derecha, con el radiador al frente
       y los cables de alta tension naranjas a la vista */
    negro('TAB', caja(2.05, 2.10, 1.90), (CX0 + CX1) / 2, Y_CAB + 0.75, -1.02);
    poner('RAD1', caja(0.08, 1.50, 1.60), '#121417', CX0 - 0.04, Y_CAB + 0.85, -1.02, null, 0.7, 0.35);
    for(var j = 0; j < 9; j++) poner(null, caja(0.05, 0.04, 1.55), '#08090A', CX0 - 0.09, Y_CAB + 0.20 + j * 0.16, -1.02, null, 0.6, 0.4);
    [-0.55, -0.85, -1.15, -1.45].forEach(function(z, k){
      barra('HAR', [CX0 + 0.3, Y_CAB + 1.95, z], [CX1 - 0.2, Y_CAB + 1.40 - k * 0.08, z], 0.035, '#E8741C', 0.5, 0.1);
    });
    /* rejilla negra del frente bajo la cabina y escalera de acceso */
    negro(null, caja(0.30, 0.65, 3.0), XF + 0.40, 1.48, 0.0);
    [1.62, 1.95].forEach(function(z){ barra(null, [CX0 - 0.10, 0.95, z], [CX0 - 0.10, Y_CAB + 0.95, z], 0.03, C.negro); });
    for(var r = 0; r < 6; r++) barra(null, [CX0 - 0.10, 1.10 + r * 0.30, 1.62], [CX0 - 0.10, 1.10 + r * 0.30, 1.95], 0.022, C.negro);
  }
  /* plataforma bajo la cabina */
  negro(null, caja(CX1 - CX0 + 0.40, 0.12, 4.0), (CX0 + CX1) / 2, Y_CAB - 0.06, 0);

  /* ═══ cabina ═══ */
  var cx = (CX0 + CX1) / 2, cz = (CZ0 + CZ1) / 2, CYV = Y_CAB + 0.75;
  color('CBN', caja(CX1 - CX0, CYV - Y_CAB, CZ1 - CZ0), cx, (Y_CAB + CYV) / 2, cz);
  color('CBN', caja(CX1 - CX0 + 0.06, 0.16, CZ1 - CZ0 + 0.06), cx, CY1 - 0.08, cz);
  [[CX0, CZ0], [CX0, CZ1], [CX1, CZ0], [CX1, CZ1], [CX0 + 0.85, CZ1], [CX0 + 0.85, CZ0]].forEach(function(p){
    poner('CBN', caja(0.11, CY1 - CYV - 0.16, 0.11), RTH ? C.c1 : C.negro, p[0], (CYV + CY1 - 0.16) / 2, p[1], null, 0.45, 0.15);
  });
  var vidrio = new THREE.MeshStandardMaterial({ color: new THREE.Color('#24394F'), roughness: 0.06, metalness: 0.45,
    transparent: true, opacity: 0.84 });
  vidrio.envMapIntensity = 0.9;
  var hV = CY1 - CYV - 0.16, yV = CYV + hV / 2;
  var vid = function(w, h, d, x, y, z){ var m = new THREE.Mesh(caja(w, h, d), vidrio); m.position.set(x, y, z); G.add(m); };
  vid(0.04, hV, CZ1 - CZ0 - 0.08, CX0 - 0.01, yV, cz);
  vid(CX1 - CX0 - 0.08, hV, 0.04, cx, yV, CZ1 + 0.01);
  vid(CX1 - CX0 - 0.08, hV, 0.04, cx, yV, CZ0 - 0.01);
  vid(0.04, hV * 0.6, CZ1 - CZ0 - 0.08, CX1 + 0.01, yV + hV * 0.15, cz);
  poner(null, caja(0.16, 0.05, 0.05), '#9AA6B2', CX0 + 0.70, CYV - 0.20, CZ1 + 0.03, null, 0.3, 0.9);
  poner('AAC', caja(0.70, 0.18, 0.90), C.negro, CX1 - 0.45, CY1 + 0.09, cz, null, 0.55, 0.4);
  /* espejos en brazos, a los dos lados */
  [[CZ1, 1], [RTH ? -1.95 : -1.95, -1]].forEach(function(q){
    var z0 = q[0], lado = q[1];
    barra(null, [CX0 + 0.2, Y_CAB + 1.10, z0], [CX0 - 0.30, Y_CAB + 1.30, z0 + lado * 0.45], 0.025, C.negro);
    poner(null, caja(0.05, 0.50, 0.30), '#16181B', CX0 - 0.32, Y_CAB + 1.20, z0 + lado * 0.48, null, 0.4, 0.6);
  });
  /* baliza ambar sobre el techo */
  var bal = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 8),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4 }));
  bal.position.set(CX0 + 0.3, CY1 + 0.08, cz); G.add(bal);

  /* ═══ motor, transmision y ejes ═══ */
  poner('ENG1', caja(1.90, 0.85, 1.05), '#3C434B', XD + 0.30, 1.75, 0, null, 0.5, 0.65);
  poner('CMP', caja(0.40, 0.35, 0.35), '#565F69', XD + 0.10, 1.55, -0.70, null, 0.5, 0.7);
  poner('TRM', caja(1.10, 0.70, 0.80), '#3C434B', XD + 1.80, 1.45, 0, null, 0.5, 0.7);
  poner('SEN', caja(0.45, 0.45, 0.35), '#3C434B', X0 - 0.40, 1.65, 0.75, null, 0.5, 0.5);
  barra(null, [XD + 2.35, 1.30, 0], [X1 - 0.35, 0.95, 0], 0.09, '#9AA6B2', 0.3, 0.9);
  barra(null, [X1 + 0.35, 0.95, 0], [X2 - 0.35, 0.95, 0], 0.09, '#9AA6B2', 0.3, 0.9);
  /* eje delantero y bocamazas */
  negro(null, caja(0.22, 0.22, C.trD - 0.5), XD, rD, 0);
  poner('BMLH', cil(0.30, 0.30, 0.26, 18), '#3C434B', XD, rD, zLLD - aD / 2 - 0.15, [Math.PI / 2, 0, 0], 0.45, 0.7);
  poner('BMRH', cil(0.30, 0.30, 0.26, 18), '#3C434B', XD, rD, -zLLD + aD / 2 + 0.15, [Math.PI / 2, 0, 0], 0.45, 0.7);
  /* los dos ejes traseros: carcasa, diferencial y mandos finales */
  var rT = C.llT.r, aT = C.llT.a;
  [[X1, 'DIFD', 'DLH', 'DRH'], [X2, 'DIFP', 'MLH', 'MRH']].forEach(function(q){
    negro(null, cil(0.20, 0.20, C.trT - 0.2, 14), q[0], rT, 0, [Math.PI / 2, 0, 0]);
    poner(q[1], new THREE.SphereGeometry(0.42, 18, 12), '#3C434B', q[0], rT, 0, null, 0.5, 0.6);
    poner(q[2], cil(0.34, 0.34, 0.18, 18), '#565F69', q[0], rT, C.trT / 2 - aT - 0.10, [Math.PI / 2, 0, 0], 0.45, 0.7);
    poner(q[3], cil(0.34, 0.34, 0.18, 18), '#565F69', q[0], rT, -C.trT / 2 + aT + 0.10, [Math.PI / 2, 0, 0], 0.45, 0.7);
  });
  poner('BPLH', cil(0.30, 0.30, 0.10, 16), '#3C434B', X2, rT, C.trT / 2 - aT - 0.24, [Math.PI / 2, 0, 0], 0.45, 0.7);
  /* suspension: amortiguadores adelante, balancin atras */
  [-1, 1].forEach(function(lado){
    poner(lado > 0 ? 'SDI' : 'SDD', cil(0.13, 0.13, 0.75, 14), '#3C434B', XD + 0.10, rD + 0.55, lado * 0.72, null, 0.45, 0.7);
    negro(lado > 0 ? 'SPI' : 'SPD', caja(C.ejes[1] + 0.6, 0.22, 0.18), (X1 + X2) / 2, rT + 0.30, lado * 0.72);
    barra('LPH', [XD, 1.40, lado * 0.62], [X2, 1.40, lado * 0.62], 0.035, '#23272C', 0.85, 0.1);
  });
  /* tanques entre ejes: combustible a la izquierda, hidraulico a la derecha */
  color('TQC1', caja(1.20, 0.70, 0.55), (XD + X1) / 2 + 0.6, 1.20, 1.40);
  color('TQH1', caja(0.90, 0.70, 0.55), (XD + X1) / 2 + 0.6, 1.20, -1.40);

  /* ═══ cilindros de levante ═══ */
  if(C.cilindro === 'frontal'){
    /* uno solo, telescopico, entre la cabina y la tolva */
    [[0.24, 0, 0.75], [0.19, 0.75, 1.45], [0.14, 1.45, 2.15]].forEach(function(e, k){
      poner(k ? null : 'PHY', cil(e[0], e[0], e[2] - e[1], 16), k ? '#C9D2DA' : C.negro,
            X0 - 0.35, 1.35 + (e[1] + e[2]) / 2, 0, null, k ? 0.15 : 0.5, k ? 0.95 : 0.3);
    });
  } else {
    [-0.95, 0.95].forEach(function(z){
      barra('PHY', [X1 - 1.4, 1.00, z], [X1 - 1.05, 1.80, z], 0.15, C.negro, 0.5, 0.3);
      barra(null, [X1 - 1.05, 1.80, z], [X1 - 0.90, YP + 0.10, z], 0.08, '#C9D2DA', 0.15, 0.95);
    });
  }

  /* ═══ tolva con alero sobre la cabina ═══ */
  var perfilCostado = [[X0, YB + 0.20], [X0 + 0.40, YB], [XC, YB], [XC, YP + 0.25], [XC - 0.6, YP - 0.10], [X0 + 0.15, YP - 0.10]];
  var texMarca = RTH ? texRotulo3d(rotuloLgmg('临工重机'), 512, 96) : texRotulo3d(rotuloTonly, 384, 96);
  var texMod = texRotulo3d(RTH ? rotuloLgmg(id) : rotuloTexto(id, '#16181B', '#FFFFFF', 0.95), 320, 96);
  [-1, 1].forEach(function(lado){
    esTolva(color('TLV', placa(perfilCostado, 0.08, lado * (ZB - 0.04)), 0, 0, 0));
    esTolva(nervio('TLV', caja(XC - X0, 0.20, 0.20), (X0 + XC) / 2, YB - 0.08, lado * (ZB + 0.04)));
    /* viga inferior negra a lo largo y nervios verticales */
    esTolva(negro('TLV', caja(XC - X0 - 0.4, 0.22, 0.20), (X0 + XC) / 2, YP + 0.02, lado * (ZB + 0.04)));
    for(var x = X0 + 0.85; x < XC - 0.3; x += 0.78){
      esTolva(nervio('TLV', caja(0.12, T.alto - 0.30, 0.16), x, YP + 0.12 + (T.alto - 0.30) / 2, lado * (ZB + 0.05)));
    }
    esTolva(letrero(texMod, 1.05, 0.32, X0 + 1.0, YB - 0.45, lado * (ZB + 0.07), lado > 0 ? 0 : Math.PI));
  });
  esTolva(color('TLV', caja(XC - X0 - 0.1, 0.12, ZB * 2 - 0.12), (X0 + XC) / 2, YP + 0.05, 0));
  esTolva(color('TLV', caja(0.12, T.alto + 0.30, ZB * 2), X0 + 0.04, YP + (T.alto + 0.30) / 2, 0));
  esTolva(color('TLV', caja(0.10, T.alto * 0.55, ZB * 2 - 0.1), XC - 0.05, YB - T.alto * 0.27, 0));
  /* alero: sube desde la pared delantera hasta el frente de la cabina */
  var XA = CX0 - 0.20, largoAl = Math.hypot(X0 - XA, C.alto - (YB + 0.20));
  var al = esTolva(color('TLV', caja(largoAl, 0.12, ZB * 2), (X0 + XA) / 2, (C.alto + YB + 0.20) / 2 - 0.06, 0));
  al.rotation.z = -Math.atan2(C.alto - (YB + 0.20), X0 - XA);
  [-1, 1].forEach(function(lado){
    var bo = esTolva(color('TLV', caja(largoAl, 0.40, 0.08), (X0 + XA) / 2, (C.alto + YB + 0.20) / 2 - 0.26, lado * (ZB - 0.04)));
    bo.rotation.z = al.rotation.z;
  });
  esTolva(color('TLV', caja(0.10, 0.42, ZB * 2), XA - 0.04, C.alto - 0.18, 0));
  esTolva(letrero(texMarca, RTH ? 1.80 : 1.50, 0.38, XA - 0.10, C.alto - 0.18, RTH ? 0 : 0.25, -Math.PI / 2));

  /* ═══ llantas: simples adelante, duales en los dos ejes traseros ═══ */
  var LLD = { r: rD, ancho: aD, aro: C.aro, aro2: C.aro2, pernos: 10 };
  var LLT = { r: rT, ancho: aT, aro: C.aro, aro2: C.aro2, pernos: 10 };
  var zO = C.trT / 2 + aT / 2 + 0.03, zI = C.trT / 2 - aT / 2 - 0.03;
  K.rueda('LL1', XD, zLLD, 1, LLD);
  K.rueda('LL2', XD, -zLLD, -1, LLD);
  [[X1, ['LL3', 'LL4', 'LL5', 'LL6']], [X2, ['LL7', 'LL8', 'LL9', 'LL10']]].forEach(function(q){
    K.rueda(q[1][0], q[0], zO, 1, LLT);
    K.rueda(q[1][1], q[0], zI, 0, LLT);
    K.rueda(q[1][2], q[0], -zI, 0, LLT);
    K.rueda(q[1][3], q[0], -zO, -1, LLT);
  });
  /* luces traseras */
  [-0.80, 0.80].forEach(function(z){
    poner(null, caja(0.08, 0.20, 0.36), '#16181B', XC - 0.55, 1.15, z, null, 0.6, 0.3);
    poner('LSM', caja(0.05, 0.14, 0.28), '#C2241B', XC - 0.50, 1.15, z, null, 0.3, 0.2);
  });

  K.colgarTolva(new THREE.Vector3(XC - 0.45, YP - 0.15, 0), id);
  return G;
}

/* @@modelo T800 */
/* ══════════════════════════════════════════════════════════════════
   KENWORTH T800 — CAMION PARA ANFO (TV-34, TV-35)

   Chasis segun el plano del T800 estandar del manual de carroceros de
   Kenworth (08/12): parachoques a eje delantero 1.232 m, eje delantero a la
   espalda de la cabina 1.882 m, cabina de 1.834 m de ancho y techo a 2.083 m
   sobre el bajo del bastidor (~0.83 m del suelo), trocha delantera 2.101 m,
   duales traseras con centros a 1.900 m y 2.502 m sobre llantas, tandem a
   1.321 m. Batalla 5.6 m (supuesta: es la tipica para un cuerpo de ANFO de
   unos 5 m; la de esta unidad no se encontro). Llantas 11R22.5.

   Cuerpo de explosivos como los de las fotos de referencia: tolva de nitrato
   de acero inoxidable con nervios y fondo en V, columna de tornillo vertical
   detras de la cabina que alimenta el tornillo pluma que corre sobre la
   tolva, escalera y baranda, tanque de petroleo bajo la plataforma, rombos
   naranjas «1.5D» y placa «0331». Capo largo e inclinado, parrilla cromada
   con el emblema KW, guardafangos redondos, chimenea detras de la cabina y
   tanques pulidos bajo las puertas. El color de la cabina (rojo) es supuesto.
   ══════════════════════════════════════════════════════════════════ */
var KW_ROJO = '#981510', KW_ROJO2 = '#6E0F0B', KW_CROMO = '#D3D8DD', KW_INOX = '#B7BDC4';

function construirT800Anfo(piezas){
  var G = new THREE.Group();
  var K = kit3d(G, piezas);
  var caja = K.caja, cil = K.cil, poner = K.poner, barra = K.barra, placa = K.placa, letrero = K.letrero;
  var rojo = function(code, geo, x, y, z, rot){ return poner(code, geo, KW_ROJO, x, y, z, rot, 0.32, 0.18); };
  var cromo = function(code, geo, x, y, z, rot){ return poner(code, geo, KW_CROMO, x, y, z, rot, 0.18, 0.92); };
  var inox = function(code, geo, x, y, z, rot){ return poner(code, geo, KW_INOX, x, y, z, rot, 0.35, 0.65); };

  /* ═══ medidas ═══ */
  var WB = 5.60, EOF = 1.50, TAN = 1.321;
  var XF = -(1.232 + WB + EOF) / 2;          /* frente del parachoques */
  var XD = XF + 1.232, XT = XD + WB, X1 = XT - TAN / 2, X2 = XT + TAN / 2, XC = XT + EOF;
  var XCB = XD + 1.882, XCF = XCB - 1.47;   /* espalda y frente de la cabina */
  var YB = 0.83, YR = YB + 0.27;             /* bajo y alto del bastidor */
  var YT = YB + 2.083;                       /* techo de la cabina */
  var RL = 0.525, AL = 0.28;                 /* 11R22.5 */

  /* ═══ bastidor y parachoques ═══ */
  [-0.39, 0.39].forEach(function(z){ poner('42023615', caja(XC - XF - 0.20, YR - YB, 0.08), '#1B1E22', (XF + XC) / 2 + 0.10, (YB + YR) / 2, z, null, 0.6, 0.3); });
  cromo(null, caja(0.18, 0.36, 2.50), XF + 0.09, 0.93, 0);
  poner(null, caja(0.06, 0.12, 0.30), '#2A2E33', XF - 0.01, 0.93, 0, null, 0.6, 0.4);

  /* ═══ capo inclinado, parrilla cromada y guardafangos ═══ */
  var XG = XF + 0.12;
  var capo = placa([[XG, 1.10], [XG, 1.87], [XCF, 2.20], [XCF, 1.10]], 1.05, 0);
  rojo(null, capo, 0, 0, 0);
  cromo('RAD1', caja(0.08, 0.72, 0.92), XG - 0.03, 1.48, 0);
  for(var i = 0; i < 4; i++) poner(null, caja(0.05, 0.66, 0.035), '#8A9097', XG - 0.08, 1.48, -0.30 + i * 0.20, null, 0.3, 0.8);
  /* el emblema KW arriba de la parrilla */
  var texKW = texRotulo3d(function(g, w, h){
    g.fillStyle = '#C62A1E'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.62) + 'px Georgia, serif'; g.fillText('KW', w / 2, h * 0.55);
  }, 128, 128);
  letrero(texKW, 0.16, 0.16, XG - 0.075, 1.93, 0, -Math.PI / 2);
  var texKen = texRotulo3d(rotuloTexto('KENWORTH', KW_ROJO, '#FFFFFF', 0.85), 512, 80);
  [-1, 1].forEach(function(lado){
    letrero(texKen, 0.70, 0.11, XG + 0.60, 1.86, lado * 0.53, lado > 0 ? 0 : Math.PI);
  });
  /* guardafangos redondos sobre las ruedas delanteras, con su faldon hacia el parachoques */
  var arco = new THREE.Shape();
  arco.absarc(0, 0, 0.66, 0, Math.PI, false);
  arco.absarc(0, 0, 0.58, Math.PI, 0, true);
  [-1, 1].forEach(function(lado){
    var zf = lado * 2.101 / 2;
    var gA = new THREE.ExtrudeGeometry(arco, { depth: 0.46, bevelEnabled: false });
    gA.translate(0, 0, -0.23);
    rojo(null, gA, XD, RL, zf);
    rojo(null, placa([[XF + 0.15, 1.05], [XF + 0.15, 1.55], [XD - 0.40, 1.80], [XD - 0.62, 1.30]], 0.46, zf), 0, 0, 0);
    /* faros rectangulares dobles en el frente del guardafango */
    poner(null, caja(0.05, 0.16, 0.32), '#2A2E33', XF + 0.13, 1.30, zf, null, 0.6, 0.3);
    poner(lado > 0 ? 'FDI' : 'FDD', caja(0.04, 0.12, 0.28), '#F4EDCF', XF + 0.11, 1.30, zf, null, 0.2, 0.1);
    /* filtros de aire de acero en los costados del capo, junto a la cabina */
    inox(null, cil(0.17, 0.17, 0.62, 18), XCF - 0.20, 2.05, lado * 0.66);
    /* escalon de lamina diamantada y tanque pulido bajo la puerta:
       combustible a la izquierda, hidraulico (bomba del cuerpo) a la derecha */
    poner(null, caja(0.40, 0.28, 0.30), '#C4C9CE', XCF + 0.20, 0.72, lado * 0.98, null, 0.4, 0.8);
    var tq = cromo(lado > 0 ? 'TQC1' : 'TQH1', cil(0.30, 0.30, 0.95, 22), XCB - 0.35, 0.80, lado * 0.80, [0, 0, Math.PI / 2]);
  });

  /* ═══ cabina ═══ */
  var W = 1.834 / 2, CY0 = 1.12;
  rojo('CBN', caja(XCB - XCF, YT - CY0 - 0.06, W * 2), (XCF + XCB) / 2, (CY0 + YT - 0.06) / 2, 0);
  rojo('CBN', caja(XCB - XCF + 0.04, 0.08, W * 2 + 0.04), (XCF + XCB) / 2, YT - 0.04, 0);
  var vidrio = new THREE.MeshStandardMaterial({ color: new THREE.Color('#1E2E40'), roughness: 0.06, metalness: 0.45, transparent: true, opacity: 0.88 });
  [-1, 1].forEach(function(lado){
    /* parabrisas en dos piezas y ventanas de puerta */
    var pb = new THREE.Mesh(caja(0.04, 0.55, W - 0.10), vidrio);
    pb.position.set(XCF - 0.01, YT - 0.42, lado * W / 2); pb.rotation.z = -0.18; G.add(pb);
    var vp = new THREE.Mesh(caja(0.80, 0.52, 0.04), vidrio);
    vp.position.set(XCF + 0.55, YT - 0.45, lado * (W + 0.01)); G.add(vp);
    poner(null, caja(0.16, 0.04, 0.05), '#C4C9CE', XCF + 1.05, YT - 0.85, lado * (W + 0.03), null, 0.3, 0.9);
    /* espejos cromados en brazos */
    barra(null, [XCF + 0.10, YT - 0.40, lado * W], [XCF + 0.05, YT - 0.40, lado * 1.30], 0.02, KW_CROMO, 0.2, 0.9);
    cromo(null, caja(0.06, 0.42, 0.22), XCF + 0.05, YT - 0.45, lado * 1.37);
  });
  var vt = new THREE.Mesh(caja(0.04, 0.45, 0.94), vidrio); vt.position.set(XCB + 0.01, YT - 0.45, 0); G.add(vt);
  /* visera y luces de galibo ambar sobre el parabrisas */
  rojo(null, caja(0.22, 0.05, W * 2), XCF - 0.08, YT - 0.10, 0);
  for(var m = 0; m < 5; m++){
    var lm = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8),
      new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.35 }));
    lm.position.set(XCF - 0.04, YT - 0.06, -0.50 + m * 0.25); G.add(lm);
  }
  /* chimenea cromada detras de la cabina, a la derecha */
  cromo(null, cil(0.07, 0.07, 2.70, 16), XCB + 0.10, YR + 1.35, -0.72);
  poner(null, cil(0.10, 0.10, 0.90, 16), '#9AA1A8', XCB + 0.10, YR + 1.10, -0.72, null, 0.4, 0.7);

  /* ═══ tren motriz ═══ */
  poner('ENG1', caja(1.10, 0.62, 0.70), '#3C434B', XD + 0.10, 1.35, 0, null, 0.5, 0.65);
  poner('TRM', caja(0.70, 0.45, 0.50), '#3C434B', XCF + 0.65, 1.05, 0, null, 0.5, 0.7);
  /* toma de fuerza que mueve las bombas hidraulicas del cuerpo */
  poner('PTB1', caja(0.30, 0.25, 0.25), '#565F69', XCF + 0.95, 0.95, -0.30, null, 0.5, 0.7);
  barra(null, [XCF + 1.0, 0.95, 0], [X1 - 0.25, 0.70, 0], 0.05, '#9AA1A8', 0.3, 0.9);
  barra(null, [X1 + 0.25, 0.70, 0], [X2 - 0.25, 0.70, 0], 0.05, '#9AA1A8', 0.3, 0.9);
  poner(null, caja(0.16, 0.16, 2.0), '#1B1E22', XD, RL, 0, null, 0.6, 0.3);
  [X1, X2].forEach(function(x, k){
    poner(null, cil(0.10, 0.10, 1.95, 12), '#1B1E22', x, RL, 0, [Math.PI / 2, 0, 0], 0.6, 0.3);
    poner(k ? 'DIFP' : 'DIFD', new THREE.SphereGeometry(0.26, 16, 12), '#3C434B', x, RL, 0, null, 0.5, 0.6);
  });
  /* suspension trasera: balancines entre los dos ejes */
  [-1, 1].forEach(function(lado){
    poner(lado > 0 ? 'SPI' : 'SPD', caja(TAN + 0.40, 0.16, 0.12), '#1B1E22', XT, RL + 0.22, lado * 0.52, null, 0.6, 0.3);
    barra('LPH', [XCB, YR - 0.05, lado * 0.30], [XC - 0.3, YR - 0.05, lado * 0.30], 0.025, '#23272C', 0.85, 0.1);
  });

  /* ═══ cuerpo de explosivos ═══ */
  var XB0 = XCB + 0.25, XB1 = XC - 0.10, YD = YR + 0.12;
  poner(null, caja(XB1 - XB0 + 0.10, 0.12, 2.40), '#4B5158', (XB0 + XB1) / 2, YR + 0.06, 0, null, 0.6, 0.4);
  /* cinta reflectiva roja y blanca en el canto de la plataforma */
  for(var c = 0; c < 14; c++){
    var xc = XB0 + 0.15 + c * (XB1 - XB0 - 0.30) / 13;
    [-1.205, 1.205].forEach(function(z){ poner(null, caja(0.16, 0.06, 0.01), c % 2 ? '#F2F2F2' : '#C62A1E', xc, YR + 0.06, z, null, 0.4, 0.1); });
  }
  /* tolva de nitrato: fondo en V y paredes rectas con nervios */
  var TX0 = XB0 + 0.55, TX1 = XB1 - 0.20, YV = YD + 0.75, YTT = YT + 0.40;
  var tolvaV = new THREE.Shape();
  [[-0.30, YD + 0.05], [0.30, YD + 0.05], [1.10, YV], [-1.10, YV]].forEach(function(p, k){ k ? tolvaV.lineTo(p[0], p[1]) : tolvaV.moveTo(p[0], p[1]); });
  var gV = new THREE.ExtrudeGeometry(tolvaV, { depth: TX1 - TX0, bevelEnabled: false });
  gV.rotateY(Math.PI / 2); gV.translate(TX0, 0, 0);
  inox('TLV', gV, 0, 0, 0);
  inox('TLV', caja(TX1 - TX0, YTT - YV, 2.20), (TX0 + TX1) / 2, (YV + YTT) / 2, 0);
  inox(null, caja(TX1 - TX0 + 0.06, 0.08, 2.26), (TX0 + TX1) / 2, YTT, 0);
  for(var n = 0; n <= 6; n++){
    var xn = TX0 + 0.10 + n * (TX1 - TX0 - 0.20) / 6;
    [-1.11, 1.11].forEach(function(z){ poner(null, caja(0.07, YTT - YV, 0.05), '#9EA5AD', xn, (YV + YTT) / 2, z, null, 0.35, 0.7); });
  }
  /* tornillo de descarga bajo el fondo en V */
  poner(null, cil(0.13, 0.13, TX1 - TX0 + 0.4, 14), '#8A9097', (TX0 + TX1) / 2, YD + 0.05, 0, [0, 0, Math.PI / 2], 0.4, 0.7);
  /* columna vertical del tornillo detras de la cabina y el tornillo pluma sobre la tolva */
  var XCOL = XB0 + 0.22, ZCOL = 0.55, YCOL = YTT + 0.55;
  poner('PHY', cil(0.17, 0.17, YCOL - YD, 16), '#8A9097', XCOL, (YD + YCOL) / 2, ZCOL, null, 0.4, 0.7);
  poner(null, caja(0.40, 0.30, 0.40), '#3C434B', XCOL, YCOL, ZCOL, null, 0.5, 0.6);
  barra(null, [XCOL, YCOL, ZCOL], [TX1 - 0.15, YTT + 0.30, ZCOL], 0.13, '#8A9097', 0.4, 0.7);
  poner(null, caja(0.10, 0.35, 0.40), '#3C434B', TX1 - 0.15, YTT + 0.12, ZCOL, null, 0.5, 0.6);
  /* tanque de petroleo bajo la plataforma, a la derecha */
  poner(null, cil(0.30, 0.30, 1.30, 20), '#E8EAEC', (XCB + X1) / 2 + 0.25, YB + 0.02, -0.82, [0, 0, Math.PI / 2], 0.35, 0.2);
  /* escalera en la esquina delantera izquierda y baranda arriba */
  [TX0 - 0.10, TX0 + 0.25].forEach(function(x){ barra(null, [x, YD, 1.18], [x, YTT + 0.95, 1.18], 0.025, '#C4C9CE', 0.3, 0.85); });
  for(var r = 0; r < 8; r++) barra(null, [TX0 - 0.10, YD + 0.25 + r * 0.30, 1.18], [TX0 + 0.25, YD + 0.25 + r * 0.30, 1.18], 0.02, '#C4C9CE', 0.3, 0.85);
  [-1.05, 1.05].forEach(function(z){
    barra(null, [TX0 + 0.3, YTT + 0.90, z], [TX1 - 0.1, YTT + 0.90, z], 0.025, '#C4C9CE', 0.3, 0.85);
    [TX0 + 0.3, (TX0 + TX1) / 2, TX1 - 0.1].forEach(function(x){ barra(null, [x, YTT, z], [x, YTT + 0.90, z], 0.022, '#C4C9CE', 0.3, 0.85); });
  });
  /* rombos naranjas de clase 1.5D y la placa UN 0331 */
  var texRombo = texRotulo3d(function(g, w, h){
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#F07A13'; g.beginPath(); g.moveTo(w / 2, 4); g.lineTo(w - 4, h / 2); g.lineTo(w / 2, h - 4); g.lineTo(4, h / 2); g.closePath(); g.fill();
    g.strokeStyle = '#111'; g.lineWidth = 4; g.stroke();
    g.fillStyle = '#111'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.20) + 'px Arial, sans-serif'; g.fillText('1.5D', w / 2, h * 0.52);
    g.font = 'bold ' + Math.round(h * 0.11) + 'px Arial, sans-serif'; g.fillText('1', w / 2, h * 0.80);
  }, 256, 256);
  var texUN = texRotulo3d(function(g, w, h){
    g.fillStyle = '#F07A13'; g.fillRect(0, 0, w, h); g.strokeStyle = '#111'; g.lineWidth = 6; g.strokeRect(3, 3, w - 6, h - 6);
    g.fillStyle = '#111'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.62) + 'px Arial, sans-serif'; g.fillText('0331', w / 2, h * 0.55);
  }, 256, 96);
  var mRombo = new THREE.MeshStandardMaterial({ map: texRombo, transparent: true, roughness: 0.5 });
  [[1, 0], [-1, Math.PI]].forEach(function(q){
    var pr = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), mRombo);
    pr.position.set((TX0 + TX1) / 2, (YV + YTT) / 2 + 0.10, q[0] * 1.142); pr.rotation.y = q[1]; G.add(pr);
    letrero(texUN, 0.52, 0.20, (TX0 + TX1) / 2 + 1.0, (YV + YTT) / 2 + 0.10, q[0] * 1.142, q[1]);
  });
  var prT = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), mRombo);
  prT.position.set(TX1 + 0.005, (YV + YTT) / 2, 0); prT.rotation.y = Math.PI / 2; G.add(prT);
  /* luces traseras y faldones */
  [-0.95, 0.95].forEach(function(z){
    poner('LSM', caja(0.05, 0.12, 0.26), '#C2241B', XC + 0.01, YR - 0.10, z, null, 0.3, 0.2);
    poner(null, caja(0.03, 0.55, 0.62), '#16181B', X2 + 0.62, 0.42, z * 1.17, null, 0.8, 0.1);
  });

  /* ═══ llantas: simples adelante, duales en el tandem (10 llantas) ═══ */
  var LL = { r: RL, ancho: AL, aro: '#C9CED3', aro2: '#8E949A', pernos: 10 };
  var zD = 2.101 / 2, zO = 2.502 / 2 - AL / 2, zI = 1.900 - zO;
  K.rueda('LL1', XD, zD, 1, LL);
  K.rueda('LL2', XD, -zD, -1, LL);
  [[X1, ['LL3', 'LL4', 'LL5', 'LL6']], [X2, ['LL7', 'LL8', 'LL9', 'LL10']]].forEach(function(q){
    K.rueda(q[1][0], q[0], zO, 1, LL);
    K.rueda(q[1][1], q[0], zI, 0, LL);
    K.rueda(q[1][2], q[0], -zI, 0, LL);
    K.rueda(q[1][3], q[0], -zO, -1, LL);
  });

  G.userData.ruedas = [];
  G.userData.mirarY = 1.7;
  G.userData.dist = 20;
  G.userData.modelo = 'T800';
  return G;
}

/* @@fin T800 */
/* @@modelo R9100 */
/* ══════════════════════════════════════════════════════════════════
   LIEBHERR R 9100 — EXCAVADORA RETRO SOBRE ORUGAS (RE-62 a RE-66)

   Hoja de dimensiones del R 9100 B (Liebherr): superestructura 4.059 m de
   ancho (5.443 con la pasarela izquierda), techo de cabina 4.143 m, capot
   4.114 m, radio de cola 4.630 m, del eje de giro al frente 2.107 m,
   contrapeso a 1.803 m del suelo, orugas de 6.107 m con trocha 3.900 m,
   tejas de 0.600 m y 1.663 m de alto. Pluma mono de 7.60 m, brazo de 3.20 m,
   cucharon de 7 m3 y 2.40 m de ancho.

   Cabina adelante a la izquierda (+Z) con la pluma a su derecha, pasarela con
   baranda a todo lo largo del lado izquierdo y escalera fija colgando de ella,
   dos rejillas del radiador atras a la derecha, cupula del prefiltro en el
   techo. Blanco Liebherr con techos gris medio, bastidor de orugas gris
   oscuro, cilindros negros con vastagos cromados, LIEBHERR en la pluma y 9100
   en los costados.
   ══════════════════════════════════════════════════════════════════ */
var LH_BLANCO = '#E2E0D8', LH_GRIS = '#8E949B', LH_OSCURO = '#3A3F45';

function construirR9100(piezas){
  var G = new THREE.Group();
  var K = kit3d(G, piezas);
  var caja = K.caja, cil = K.cil, poner = K.poner, barra = K.barra, placa = K.placa, letrero = K.letrero;
  var blanco = function(code, geo, x, y, z, rot){ return poner(code, geo, LH_BLANCO, x, y, z, rot, 0.5, 0.08); };

  /* ═══ tren de orugas ═══ */
  K.oruga('CLH', -3.053, 3.053, 1.95, 0.60, 1.663, LH_OSCURO);
  K.oruga('CRH', -3.053, 3.053, -1.95, 0.60, 1.663, LH_OSCURO);
  poner(null, caja(2.6, 0.55, 3.3), LH_OSCURO, 0, 1.08, 0, null, 0.55, 0.3);       /* bastidor central */
  poner('MLH', cil(0.42, 0.42, 0.30, 18), '#2B2F34', 2.45, 0.83, 1.45, [Math.PI / 2, 0, 0], 0.5, 0.6);
  poner('MRH', cil(0.42, 0.42, 0.30, 18), '#2B2F34', 2.45, 0.83, -1.45, [Math.PI / 2, 0, 0], 0.5, 0.6);
  /* corona y reductores de giro */
  poner(null, cil(1.55, 1.55, 0.20, 32), '#2B2F34', 0, 1.70, 0, null, 0.5, 0.6);
  poner('RG1', cil(0.22, 0.22, 0.70, 14), LH_GRIS, 0.9, 2.05, -0.9, null, 0.45, 0.6);
  poner('RG2', cil(0.22, 0.22, 0.70, 14), LH_GRIS, 0.9, 2.05, 0.9, null, 0.45, 0.6);

  /* ═══ superestructura ═══ */
  var XF = -2.107, XR = 4.63, ZL = 2.03, YU = 1.80, YH = 4.114;
  /* plataforma base y contrapeso redondeado atras */
  blanco(null, caja(XR - XF - 0.9, 0.55, ZL * 2), (XF + XR - 0.9) / 2, YU + 0.28, 0);
  var cp = blanco(null, placa([[XR - 1.4, YU], [XR - 0.15, YU], [XR, YU + 0.4], [XR, YH - 0.35], [XR - 0.25, YH - 0.05], [XR - 1.4, YH - 0.05]], ZL * 2, 0), 0, 0, 0);
  /* cuarto de maquinas detras de la cabina */
  blanco('ENG1', caja(XR - 1.4 - 0.25, YH - YU - 0.55, ZL * 2 - 0.10), (0.25 + XR - 1.4) / 2, (YU + 0.55 + YH) / 2, 0);
  poner(null, caja(XR - 0.4, 0.06, ZL * 2 - 0.30), LH_GRIS, (0.25 + XR) / 2 - 0.1, YH + 0.02, 0, null, 0.55, 0.2);
  /* rejillas del radiador atras a la derecha, y una chica a la izquierda */
  [2.55, 3.35].forEach(function(x){
    poner('RAD1', caja(0.68, 0.95, 0.04), '#1B1D20', x, 3.15, -ZL - 0.01, null, 0.7, 0.3);
    for(var i = 0; i < 6; i++) poner(null, caja(0.62, 0.035, 0.05), '#4A4F55', x, 2.78 + i * 0.15, -ZL - 0.03, null, 0.6, 0.3);
  });
  poner(null, caja(0.55, 0.60, 0.04), '#1B1D20', 3.35, 3.30, ZL + 0.01, null, 0.7, 0.3);
  /* cupula del prefiltro y escape en el techo */
  poner(null, cil(0.18, 0.18, 0.45, 14), LH_GRIS, 3.20, YH + 0.25, -0.70, null, 0.5, 0.4);
  poner(null, new THREE.SphereGeometry(0.32, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), LH_GRIS, 3.20, YH + 0.47, -0.70, null, 0.5, 0.4);
  poner(null, cil(0.10, 0.12, 0.55, 12), LH_OSCURO, 2.10, YH + 0.28, 0.80, null, 0.5, 0.6);
  /* servicios dentro del cuarto de maquinas: lo que tiene costo en SAP */
  poner('TQH1', caja(1.1, 1.1, 1.0), LH_BLANCO, 0.75, 2.90, -1.45, null, 0.5, 0.08);
  poner('TQC1', caja(1.0, 1.0, 0.95), LH_BLANCO, 0.75, 2.85, 1.45, null, 0.5, 0.08);
  poner('PTB1', caja(0.55, 0.50, 0.55), LH_GRIS, 1.55, 2.60, 0, null, 0.5, 0.5);
  poner('AL1', cil(0.16, 0.16, 0.30, 12), LH_OSCURO, 2.30, YH + 0.10, -0.15, [0, 0, Math.PI / 2], 0.45, 0.7);
  poner('AR1', cil(0.14, 0.14, 0.30, 12), LH_OSCURO, 2.70, YH + 0.10, -0.15, [0, 0, Math.PI / 2], 0.45, 0.7);
  poner('INY2', caja(0.80, 0.08, 0.30), LH_OSCURO, 2.50, YH + 0.06, 0.35, null, 0.45, 0.7);
  poner('SEN', caja(0.55, 0.65, 0.45), LH_GRIS, 0.55, 2.70, ZL + 0.25, null, 0.5, 0.5);
  poner('GP1', cil(0.10, 0.10, 0.40, 12), LH_OSCURO, 0.55, 3.25, ZL + 0.25, null, 0.4, 0.8);
  poner('EC', caja(0.40, 0.55, 0.45), LH_GRIS, 0.15, 3.0, -0.60, null, 0.5, 0.5);
  poner('HAR', caja(3.6, 0.05, 0.05), '#22262B', 1.6, YH - 0.10, 1.85, null, 0.8, 0.1);
  /* botellas rojas del sistema contra incendio en la pasarela */
  [0, 0.25].forEach(function(dz){ poner('SCI', cil(0.10, 0.10, 0.70, 12), '#C62A1E', -0.05, 2.70, ZL + 0.45 + dz, null, 0.4, 0.3); });

  /* ═══ cabina adelante a la izquierda ═══ */
  var CX0 = XF, CX1 = XF + 2.0, CZ0 = 0.85, CZ1 = 2.07, CY0 = 2.35, CY1 = 4.143;
  blanco(null, caja(CX1 - CX0, CY0 - YU - 0.55, CZ1 - CZ0 + 0.1), (CX0 + CX1) / 2, (YU + 0.55 + CY0) / 2, (CZ0 + CZ1) / 2);
  blanco('CBN', caja(CX1 - CX0, 0.40, CZ1 - CZ0), (CX0 + CX1) / 2, CY0 + 0.20, (CZ0 + CZ1) / 2);
  blanco('CBN', caja(CX1 - CX0 + 0.06, 0.12, CZ1 - CZ0 + 0.06), (CX0 + CX1) / 2, CY1 - 0.06, (CZ0 + CZ1) / 2);
  [[CX0, CZ0], [CX0, CZ1], [CX1, CZ0], [CX1, CZ1]].forEach(function(p){
    blanco('CBN', caja(0.10, CY1 - CY0 - 0.52, 0.10), p[0], (CY0 + 0.40 + CY1 - 0.12) / 2, p[1]);
  });
  var vidrio = new THREE.MeshStandardMaterial({ color: new THREE.Color('#1E2B38'), roughness: 0.06, metalness: 0.4, transparent: true, opacity: 0.88 });
  var hV = CY1 - CY0 - 0.52, yV = CY0 + 0.40 + hV / 2;
  [[0.04, hV, CZ1 - CZ0 - 0.08, CX0 - 0.01, (CZ0 + CZ1) / 2], [CX1 - CX0 - 0.08, hV, 0.04, (CX0 + CX1) / 2, CZ1 + 0.01],
   [CX1 - CX0 - 0.08, hV, 0.04, (CX0 + CX1) / 2, CZ0 - 0.01]].forEach(function(v){
    var m = new THREE.Mesh(caja(v[0], v[1], v[2]), vidrio); m.position.set(v[3], yV, v[4]); G.add(m);
  });
  poner('AAC', caja(0.80, 0.20, 0.90), LH_GRIS, CX1 - 0.55, CY1 + 0.10, (CZ0 + CZ1) / 2, null, 0.55, 0.4);
  /* faros de trabajo sobre la cabina y en el frente de la superestructura */
  [-0.5, 0.0].forEach(function(dz){
    poner(null, caja(0.12, 0.16, 0.24), '#2A2E33', CX0 + 0.10, CY1 + 0.12, (CZ0 + CZ1) / 2 + dz, null, 0.6, 0.3);
    poner('LSM', caja(0.04, 0.11, 0.19), '#F4EDCF', CX0 + 0.03, CY1 + 0.12, (CZ0 + CZ1) / 2 + dz, null, 0.2, 0.1);
  });

  /* ═══ pasarela izquierda con baranda y escalera fija ═══ */
  var ZP = 2.72, YP = 2.30;
  poner(null, caja(XR - XF - 0.6, 0.08, ZP - ZL + 0.05), LH_GRIS, (XF + XR - 0.6) / 2, YP, (ZL + ZP) / 2, null, 0.6, 0.4);
  var BR = '#D9D7CF';
  var xsB = [XF, -0.1, 1.2, 2.5, 3.8];
  xsB.forEach(function(x){ barra(null, [x, YP, ZP], [x, YP + 1.0, ZP], 0.03, BR, 0.5, 0.2); });
  barra(null, [XF, YP + 1.0, ZP], [3.8, YP + 1.0, ZP], 0.03, BR, 0.5, 0.2);
  barra(null, [XF, YP + 0.5, ZP], [3.8, YP + 0.5, ZP], 0.025, BR, 0.5, 0.2);
  barra(null, [XF, YP + 1.0, ZP], [XF, YP + 1.0, CZ1], 0.03, BR, 0.5, 0.2);
  /* baranda del techo del cuarto de maquinas */
  [[0.3, 4.2]].forEach(function(q){
    [-1.85, 1.85].forEach(function(z){ barra(null, [q[0], YH, z], [q[0], YH + 0.9, z], 0.025, BR); barra(null, [q[1], YH, z], [q[1], YH + 0.9, z], 0.025, BR);
      barra(null, [q[0], YH + 0.9, z], [q[1], YH + 0.9, z], 0.025, BR); });
  });
  [-1.2, -0.85].forEach(function(dx){ barra(null, [dx + 0.6, 0.40, ZP - 0.2], [dx + 0.6, YP, ZP - 0.2], 0.03, BR); });
  for(var r = 0; r < 6; r++) barra(null, [-0.6, 0.55 + r * 0.30, ZP - 0.2], [-0.25, 0.55 + r * 0.30, ZP - 0.2], 0.022, BR);

  /* ═══ equipo de trabajo: pluma, brazo y cucharon, a la derecha de la cabina ═══ */
  var ZB = -0.15;
  var PIE = [-0.55, 2.75], CODO = [-2.75, 5.95], PUNTA = [-6.30, 5.30];
  var BRAZO = [-7.25, 2.30], PALANCA = [-5.85, 6.25];
  poner('PYB', cil(0.22, 0.22, 1.30, 16), LH_OSCURO, PIE[0], PIE[1], ZB, [Math.PI / 2, 0, 0], 0.45, 0.7);
  K.viga(null, PIE, CODO, ZB, 1.05, 1.05, LH_BLANCO, 1.20);
  K.viga(null, CODO, PUNTA, ZB, 1.0, 1.20, LH_BLANCO, 0.80);
  poner('PYB', cil(0.20, 0.20, 1.20, 16), LH_OSCURO, PUNTA[0], PUNTA[1], ZB, [Math.PI / 2, 0, 0], 0.45, 0.7);
  K.viga(null, PALANCA, BRAZO, ZB, 0.85, 0.95, LH_BLANCO, 0.70);
  /* LIEBHERR en los dos costados de la pluma, antes del codo */
  var texLH = texRotulo3d(rotuloTexto('LIEBHERR', LH_BLANCO, '#16181B', 0.95), 512, 96);
  var ang = Math.atan2(PUNTA[1] - CODO[1], PUNTA[0] - CODO[0]);
  [1, -1].forEach(function(lado){
    var l = letrero(texLH, 2.2, 0.42, (CODO[0] + PUNTA[0]) / 2 + 0.3, (CODO[1] + PUNTA[1]) / 2 - 0.05, ZB + lado * 0.51, lado > 0 ? 0 : Math.PI);
    l.rotation.z = lado > 0 ? ang - Math.PI : Math.PI - ang;
  });
  /* 9100 en los costados de la superestructura */
  var tex91 = texRotulo3d(rotuloTexto('9100', LH_BLANCO, '#16181B', 0.95), 256, 96);
  letrero(tex91, 1.1, 0.42, 0.85, 3.25, ZL + 0.012, 0);
  letrero(tex91, 1.1, 0.42, 1.35, 3.25, -ZL - 0.012, Math.PI);
  /* cilindros: dos de pluma, uno de brazo sobre la pluma, uno de cucharon */
  [-0.62, 0.32].forEach(function(z){ K.cilHid('PHY', [-1.55, 2.10, z], [-2.55, 4.70, z], 0.24, '#202327'); });
  K.cilHid('PSK', [-2.55, 6.55, ZB], [PALANCA[0], PALANCA[1], ZB], 0.24, '#202327');
  K.cilHid('PHY', [-6.15, 4.95, ZB], [-7.05, 2.75, ZB], 0.19, '#202327');
  barra(null, [-7.05, 2.75, ZB], [-7.55, 2.30, ZB], 0.10, LH_OSCURO);
  /* mangueras a lo largo de la pluma */
  barra('LPH', [PIE[0], PIE[1] + 0.6, ZB + 0.45], [CODO[0], CODO[1] + 0.6, ZB + 0.45], 0.05, '#23272C', 0.85, 0.1);
  barra('LPH', [CODO[0], CODO[1] + 0.6, ZB + 0.45], [PUNTA[0], PUNTA[1] + 0.5, ZB + 0.45], 0.05, '#23272C', 0.85, 0.1);

  /* cucharon: perfil lateral extruido a lo ancho, con dientes y adaptadores */
  var cu = [[-7.25, 2.30], [-7.95, 2.0], [-8.25, 1.15], [-8.0, 0.45], [-7.30, 0.22], [-6.35, 0.55], [-6.55, 1.05], [-7.05, 1.65]];
  poner('LPN', placa(cu, 2.40, ZB), LH_BLANCO, 0, 0, 0, null, 0.55, 0.12);
  for(var d = 0; d < 6; d++){
    var gz = ZB - 1.0 + d * 0.40;
    var dt = poner('GET', caja(0.42, 0.12, 0.16), '#55595E', -6.15, 0.62, gz, null, 0.6, 0.5);
    dt.rotation.z = -0.55;
  }

  G.userData.ruedas = [];
  G.userData.mirarY = 3.3;
  G.userData.dist = 40;
  G.userData.modelo = 'R9100';
  return G;
}

/* @@fin R9100 */
/* @@modelo 992K */
/* ══════════════════════════════════════════════════════════════════
   CAT 992K — CARGADOR FRONTAL (C-66)

   Specalog del 992K: batalla 5.890 m, trocha 3.302 m, ejes a 1.352 m del
   suelo, eje trasero al parachoques 4.195 m, largo con el cucharon en el suelo
   15.736 m (del eje delantero a la punta de los dientes 5.651 m), techo del
   ROPS 5.678 m, chimeneas 5.248 m, capot 4.043 m, parachoques 1.176 a 1.830 m,
   llantas 45/65-R45, cucharon de roca de 11.5 m3 y 4.884 m de ancho.

   Articulado: el bastidor delantero lleva el brazo en Z (dos brazos, dos
   cilindros de levante y uno de volteo arriba al centro) y el cucharon; el
   trasero la cabina negra, el capot amarillo, las dos chimeneas negras, la
   rejilla negra del radiador atras y las escaleras diagonales a cada lado
   que suben del parachoques a la plataforma. Franja negra con CAT y 992K
   bajo la cabina.
   ══════════════════════════════════════════════════════════════════ */
function construir992K(piezas){
  var G = new THREE.Group();
  var K = kit3d(G, piezas);
  var caja = K.caja, cil = K.cil, poner = K.poner, barra = K.barra, placa = K.placa, letrero = K.letrero;
  var amarillo = function(code, geo, x, y, z, rot){ return poner(code, geo, CAT_AM, x, y, z, rot, 0.48, 0.10); };
  var negro = function(code, geo, x, y, z, rot){ return poner(code, geo, CAT_NEGRO, x, y, z, rot, 0.6, 0.25); };

  /* ═══ medidas ═══ */
  var XP = -7.868, XB = 7.868;                  /* punta de dientes y parachoques */
  var XD = XP + 5.651, XT = XB - 4.195;          /* ejes: batalla 5.89 */
  var R = 1.352, A = 1.10, TR = 3.302 / 2;
  var XH = XT - 2.95;                             /* articulacion */
  var YPL = 3.50;                                 /* plataforma */

  /* ═══ bastidor delantero ═══ */
  amarillo(null, caja(XH - (XD - 1.2), 1.30, 1.70), (XH + XD - 1.2) / 2, 1.75, 0);
  amarillo(null, caja(0.9, 1.6, 1.9), XD + 0.15, 2.7, 0);      /* torre de los pivotes */
  negro('42023615', cil(0.25, 0.25, 0.9, 16), XH, 1.55, 0);     /* articulacion */
  /* guardafangos delanteros */
  [-1, 1].forEach(function(l){ amarillo(null, caja(2.2, 0.10, A + 0.3), XD, 2 * R + 0.12, l * TR); });

  /* ═══ bastidor trasero, capot y radiador ═══ */
  amarillo(null, caja(XB - XH - 0.4, 1.40, 2.40), (XH + XB) / 2 + 0.2, 1.85, 0);
  amarillo('ENG1', caja(XB - 0.55 - (XT - 0.4), 4.043 - 2.55, 2.70), (XT - 0.4 + XB - 0.55) / 2, (2.55 + 4.043) / 2, 0);
  negro(null, caja(XB - 0.6 - XT, 0.05, 2.40), (XT + XB - 0.6) / 2, 4.07, 0);
  /* rejilla negra del radiador atras */
  negro('RAD1', caja(0.10, 1.85, 2.30), XB - 0.50, 3.05, 0);
  for(var i = 0; i < 9; i++) poner(null, caja(0.06, 0.05, 2.25), '#08090A', XB - 0.44, 2.25 + i * 0.20, 0, null, 0.6, 0.4);
  /* persianas negras a los costados, atras */
  [-1, 1].forEach(function(l){ negro(null, caja(1.2, 0.9, 0.04), XB - 1.3, 3.3, l * 1.37); });
  /* parachoques trasero */
  amarillo(null, caja(0.60, 1.830 - 1.176, 3.60), XB - 0.30, (1.176 + 1.830) / 2, 0);
  /* chimeneas negras gemelas */
  [-0.45, 0.45].forEach(function(z){ negro(null, cil(0.17, 0.19, 5.248 - 4.043 + 0.1, 16), XT + 1.75, (4.0 + 5.248) / 2, z); });
  poner('TRM', caja(1.6, 0.9, 1.0), CAT_GRIS, XT - 1.2, 1.35, 0, null, 0.5, 0.7);
  /* guardafangos traseros */
  [-1, 1].forEach(function(l){ amarillo(null, caja(2.4, 0.10, A + 0.3), XT, 2 * R + 0.12, l * TR); });

  /* ═══ plataforma, cabina y franja ═══ */
  amarillo(null, caja(XT + 0.3 - (XH - 0.2), 0.12, 4.0), (XH - 0.2 + XT + 0.3) / 2, YPL, 0);
  var CX0 = XT - 3.60, CX1 = XT - 1.65, CZ = 1.0;
  negro('CBN', caja(CX1 - CX0, 0.55, CZ * 2), (CX0 + CX1) / 2, YPL + 0.33, 0);
  negro('CBN', caja(CX1 - CX0 + 0.12, 0.14, CZ * 2 + 0.12), (CX0 + CX1) / 2, 5.678 - 0.07, 0);
  [[CX0, -CZ], [CX0, CZ], [CX1, -CZ], [CX1, CZ]].forEach(function(p){
    negro('CBN', caja(0.12, 5.678 - YPL - 0.74, 0.12), p[0], (YPL + 0.6 + 5.678 - 0.14) / 2, p[1]);
  });
  var vidrio = new THREE.MeshStandardMaterial({ color: new THREE.Color('#22364A'), roughness: 0.06, metalness: 0.45, transparent: true, opacity: 0.82 });
  var hV = 5.678 - YPL - 0.74, yV = YPL + 0.60 + hV / 2;
  [[0.04, hV, CZ * 2 - 0.08, CX0 - 0.01, 0], [CX1 - CX0 - 0.08, hV, 0.04, (CX0 + CX1) / 2, CZ + 0.01],
   [CX1 - CX0 - 0.08, hV, 0.04, (CX0 + CX1) / 2, -CZ - 0.01], [0.04, hV * 0.8, CZ * 2 - 0.08, CX1 + 0.01, 0]].forEach(function(v){
    var m = new THREE.Mesh(caja(v[0], v[1], v[2]), vidrio); m.position.set(v[3], yV, v[4]); G.add(m);
  });
  var texCAT = texRotulo3d(rotuloCAT, 256, 128);
  letrero(texCAT, 0.62, 0.30, CX0 - 0.075, 5.678 - 0.07, 0, -Math.PI / 2);
  /* balizas ambar en el techo */
  [-0.7, 0.7].forEach(function(z){
    var b = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4 }));
    b.position.set(CX0 + 0.2, 5.678 + 0.06, z); G.add(b);
  });
  poner('AAC', caja(0.7, 0.18, 0.9), CAT_GRIS, CX1 - 0.45, 5.678 + 0.09, 0, null, 0.55, 0.4);
  /* franja negra con CAT y 992K en los costados del bastidor trasero */
  var texFr = texRotulo3d(function(g, w, h){
    g.fillStyle = CAT_NEGRO; g.fillRect(0, 0, w, h);
    g.fillStyle = '#FFFFFF'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.70) + 'px "Arial Black", Arial, sans-serif'; g.textAlign = 'left'; g.fillText('CAT', w * 0.05, h * 0.52);
    g.fillStyle = '#D52B1E'; g.beginPath(); g.moveTo(w * 0.42, h * 0.85); g.lineTo(w * 0.50, h * 0.15); g.lineTo(w * 0.54, h * 0.15); g.lineTo(w * 0.46, h * 0.85); g.fill();
    g.fillStyle = '#FFFFFF'; g.font = 'bold ' + Math.round(h * 0.42) + 'px Arial, sans-serif'; g.fillText('992K', w * 0.60, h * 0.55);
  }, 512, 128);
  [1, -1].forEach(function(l){ letrero(texFr, 1.6, 0.40, (CX0 + CX1) / 2, 2.95, l * 1.215, l > 0 ? 0 : Math.PI); });

  /* barandas negras de la plataforma y escaleras diagonales traseras */
  var NB = '#202327';
  [-1, 1].forEach(function(l){
    var z = l * 1.95;
    [XH - 0.1, CX0 + 1.0, XT + 0.3].forEach(function(x){ barra(null, [x, YPL, z], [x, YPL + 0.95, z], 0.03, NB); });
    barra(null, [XH - 0.1, YPL + 0.95, z], [XT + 0.3, YPL + 0.95, z], 0.03, NB);
    barra(null, [XH - 0.1, YPL + 0.48, z], [XT + 0.3, YPL + 0.48, z], 0.025, NB);
    /* escalera: del parachoques sube hacia adelante por el costado del capot */
    var zs = l * 1.58;
    var x0 = XB - 0.55, y0 = 1.85, x1 = XT + 0.4, y1 = YPL;
    barra(null, [x0, y0, zs + l * 0.30], [x1, y1, zs + l * 0.30], 0.035, NB);
    barra(null, [x0, y0 + 0.95, zs + l * 0.30], [x1, y1 + 0.95, zs + l * 0.30], 0.03, NB);
    for(var s = 1; s < 8; s++){
      var f = s / 8;
      poner(null, caja(0.25, 0.04, 0.55), '#2A2E33', x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, zs, null, 0.7, 0.4);
    }
  });
  /* escalerilla bajo el parachoques */
  [-0.18, 0.18].forEach(function(z){ barra(null, [XB + 0.05, 0.45, z - 1.2], [XB + 0.05, 1.20, z - 1.2], 0.03, NB); });
  [0.6, 0.9].forEach(function(y){ barra(null, [XB + 0.05, y, -1.38], [XB + 0.05, y, -1.02], 0.025, NB); });

  /* ═══ brazo en Z, cilindros y cucharon ═══ */
  var PIV = [XD + 0.30, 3.25], BP = [XP + 2.10, 0.75];
  [-0.95, 0.95].forEach(function(z){
    K.viga('PYB', PIV, [BP[0] + 0.7, 1.85], z, 0.38, 0.95, CAT_AM, 0.75);
    K.viga(null, [BP[0] + 0.7, 1.85], BP, z, 0.38, 0.75, CAT_AM, 0.55);
    /* cilindros de levante, del bastidor al brazo */
    K.cilHid('PHY', [XD + 0.6, 1.40, z * 1.15], [XD - 1.55, 2.55, z * 1.15], 0.17, CAT_AM2);
  });
  amarillo(null, cil(0.20, 0.20, 1.9, 14), BP[0] + 0.9, 1.75, 0, [Math.PI / 2, 0, 0]);
  /* palanca de volteo y su cilindro, arriba al centro */
  var PL = [XD - 1.75, 2.75];
  K.viga(null, [PL[0] + 0.25, 3.80], [PL[0] - 0.35, 1.60], 0, 0.35, 0.40, CAT_AM);
  K.cilHid('PHY', [XD + 0.55, 3.95, 0], [PL[0] + 0.25, 3.80, 0], 0.17, CAT_AM2);
  barra(null, [PL[0] - 0.35, 1.60, 0], [BP[0] - 0.15, 1.75, 0], 0.11, CAT_AM2);
  /* cucharon: piso, espalda y costados, abierto hacia adelante */
  var W = 4.884, ZC = W / 2;
  amarillo('LPN', caja(2.30, 0.10, W), XP + 1.30, 0.10, 0);
  var esp = amarillo('LPN', caja(0.12, 2.20, W), BP[0] + 0.15, 1.25, 0);
  esp.rotation.z = -0.12;
  amarillo('LPN', caja(1.25, 0.10, W), XP + 1.60, 2.40, 0);
  [-1, 1].forEach(function(l){
    amarillo('LPN', placa([[XP + 0.05, 0.05], [BP[0] + 0.15, 0.05], [BP[0] + 0.25, 2.45], [XP + 0.95, 2.45]], 0.10, l * (ZC - 0.05)), 0, 0, 0);
  });
  for(var d = 0; d < 9; d++){
    poner('GET', caja(0.40, 0.10, 0.18), '#55595E', XP + 0.05, 0.12, -ZC + 0.35 + d * (W - 0.7) / 8, null, 0.6, 0.5);
  }

  /* ═══ llantas 45/65-R45 en aros amarillos ═══ */
  var LL = { r: R, ancho: A, aro: CAT_AM, aro2: CAT_AM2, pernos: 16 };
  K.rueda('LL1', XD, TR, 1, LL);
  K.rueda('LL2', XD, -TR, -1, LL);
  K.rueda('LL3', XT, TR, 1, LL);
  K.rueda('LL4', XT, -TR, -1, LL);

  G.userData.mirarY = 2.8;
  G.userData.dist = 36;
  G.userData.modelo = '992K';
  return G;
}

/* @@fin 992K */
/* @@modelo PALA */
/* ══════════════════════════════════════════════════════════════════
   CAT 6040 FS y 6050 FS — PALAS HIDRAULICAS FRONTALES (CH-04, CH-08, CH-06)

   Hojas tecnicas de Caterpillar (6040: 2021; 6050: folleto 6050/6050 FS):
                         6040 FS    6050 FS
     techo de la cabina   7.93       8.76
     cubierta / techo     5.605      6.46
     bajo la superestr.   2.615      2.78
     ancho superestr.     6.10       7.00
     cola desde el giro   6.79       7.35
     orugas (largo)       8.09       8.54
     trocha               5.395      5.60
     tejas                1.20       1.40
     alto de orugas       2.25       2.48
     pluma / brazo        7.3 / 4.6  8.0 / 5.1
     cucharon             22 m3 · 4.77 m de ancho · 26 m3 · 4.80 m
   Lo que no esta en las hojas (largo de la superestructura, puesto de la
   cabina, pie de la pluma) sale de medir los dibujos.

   Cabina adelante a la izquierda (+Z) sobre la cubierta, pluma TriPower al
   centro con dos cilindros de pluma casi verticales, el balancin triangular
   y la biela de compresion, dos cilindros de empuje horizontales, dos de
   volteo y el cucharon de descarga por el fondo. Escalera de acceso a 45
   grados en el lado izquierdo que baja hacia atras, escalera vertical
   adelante, contrapeso con dos rejillas, cuatro escapes y el CAT atras.
   Amarillo CAT, orugas y anillo de giro negros. El 6050 es el diseno O&K
   anterior: mas grande, cabina sobre un pedestal y botellas rojas.
   ══════════════════════════════════════════════════════════════════ */
var PALA_CAT = {
  '6040FS': { cab: 7.93, deck: 5.605, bajo: 2.615, ancho: 6.10, frente: 3.0, cola: 6.79, oruga: 8.09,
              trocha: 5.395, teja: 1.20, altoOr: 2.25, pluma: 7.3, brazo: 4.6, balde: 4.768, pedestal: 0 },
  '6050FS': { cab: 8.76, deck: 6.46, bajo: 2.78, ancho: 7.00, frente: 2.4, cola: 7.35, oruga: 8.54,
              trocha: 5.60, teja: 1.40, altoOr: 2.48, pluma: 8.0, brazo: 5.1, balde: 4.80, pedestal: 0.45 }
};

function construirPalaCat(id, piezas){
  var C = PALA_CAT[id], N50 = id === '6050FS';
  var G = new THREE.Group();
  var K = kit3d(G, piezas);
  var caja = K.caja, cil = K.cil, poner = K.poner, barra = K.barra, placa = K.placa, letrero = K.letrero;
  var amarillo = function(code, geo, x, y, z, rot){ return poner(code, geo, CAT_AM, x, y, z, rot, 0.48, 0.10); };
  var negro = function(code, geo, x, y, z, rot){ return poner(code, geo, CAT_NEGRO, x, y, z, rot, 0.6, 0.25); };
  var s = C.pluma / 7.3;                         /* el equipo de trabajo escala con la pluma */

  /* ═══ orugas, mandos finales y anillo de giro ═══ */
  var LO = C.oruga / 2, ZT = C.trocha / 2;
  K.oruga('CLH', -LO, LO, ZT, C.teja, C.altoOr, CAT_NEGRO);
  K.oruga('CRH', -LO, LO, -ZT, C.teja, C.altoOr, CAT_NEGRO);
  negro(null, caja(3.2, 0.9, C.trocha - C.teja), 0, C.altoOr * 0.55, 0);
  poner('MLH', cil(0.62, 0.62, 0.40, 20), '#2B2F34', LO - C.altoOr / 2, C.altoOr / 2, ZT - C.teja / 2 - 0.25, [Math.PI / 2, 0, 0], 0.5, 0.6);
  poner('MRH', cil(0.62, 0.62, 0.40, 20), '#2B2F34', LO - C.altoOr / 2, C.altoOr / 2, -ZT + C.teja / 2 + 0.25, [Math.PI / 2, 0, 0], 0.5, 0.6);
  poner('SPR', cil(C.altoOr * 0.46, C.altoOr * 0.46, 0.20, 18), '#2B2F34', LO - C.altoOr / 2, C.altoOr / 2, -ZT - C.teja / 2 - 0.06, [Math.PI / 2, 0, 0], 0.5, 0.6);
  negro(null, cil(2.2, 2.3, C.bajo - C.altoOr + 0.05, 36), 0, (C.altoOr + C.bajo) / 2, 0);

  /* ═══ superestructura ═══ */
  var XF = -C.frente, XR = C.cola, ZL = C.ancho / 2, YB = C.bajo, YD = C.deck;
  amarillo(null, caja(XR - 0.9 - XF, YD - YB, C.ancho), (XF + XR - 0.9) / 2, (YB + YD) / 2, 0);
  /* contrapeso atras, con los cantos de abajo achaflanados */
  amarillo(null, placa([[XR - 0.9, YB], [XR - 0.35, YB], [XR, YB + 0.5], [XR, YD], [XR - 0.9, YD]], C.ancho, 0), 0, 0, 0);
  /* dos rejillas del radiador en el contrapeso y el CAT entre ellas */
  [-1, 1].forEach(function(l){
    poner(l > 0 ? 'FAN1' : 'FAN3', caja(0.04, 1.4, C.ancho * 0.36), '#1B1D20', XR + 0.01, YD - 0.95, l * C.ancho * 0.22, null, 0.7, 0.3);
    for(var i = 0; i < 8; i++) poner(null, caja(0.05, 0.05, C.ancho * 0.34), '#4A4F55', XR + 0.03, YD - 1.55 + i * 0.17, l * C.ancho * 0.22, null, 0.6, 0.3);
  });
  var texCAT = texRotulo3d(rotuloCAT, 256, 128);
  letrero(texCAT, 1.3, 0.65, XR + 0.015, YD - 2.35, 0, Math.PI / 2);
  /* motores lado a lado bajo la cubierta trasera, bombas adelante */
  poner('ENG1', caja(3.2, 1.6, 1.8), CAT_GRIS, XR - 2.6, YD - 1.2, 1.2, null, 0.5, 0.65);
  poner('ENG2', caja(3.2, 1.6, 1.8), CAT_GRIS, XR - 2.6, YD - 1.2, -1.2, null, 0.5, 0.65);
  poner('TLH2', cil(0.25, 0.25, 0.4, 14), CAT_GRIS2, XR - 4.3, YD - 0.6, -1.2, [0, 0, Math.PI / 2], 0.45, 0.7);
  poner('PTB1', caja(0.8, 0.9, 1.0), CAT_GRIS2, XR - 4.7, YD - 1.4, 1.2, null, 0.5, 0.65);
  poner('PTB2', caja(0.8, 0.9, 1.0), CAT_GRIS2, XR - 4.7, YD - 1.4, -1.2, null, 0.5, 0.65);
  poner('PYM', caja(1.6, 0.7, 2.6), CAT_GRIS2, 0.6, YB + 0.55, 0, null, 0.5, 0.65);
  poner('FMT2', cil(0.22, 0.22, 0.4, 12), CAT_GRIS2, XR - 0.6, YD - 0.3, 0, null, 0.45, 0.7);
  /* reductores de giro con sus frenos, alrededor de la corona */
  [['RG1', 'SB1', 1.4, 1.2], ['RG2', 'SB2', 1.4, -1.2], ['RG3', null, -1.4, -1.2]].forEach(function(q){
    poner(q[0], cil(0.30, 0.30, 1.0, 14), CAT_GRIS, q[2], YB + 0.5, q[3], null, 0.45, 0.6);
    if(q[1]) poner(q[1], cil(0.24, 0.24, 0.35, 14), CAT_GRIS2, q[2], YB + 1.15, q[3], null, 0.45, 0.6);
  });
  poner('SEN', caja(0.8, 0.8, 0.6), CAT_GRIS, 1.2, YD + 0.40, -ZL + 0.6, null, 0.5, 0.5);
  poner('HAR', caja(5.5, 0.05, 0.05), '#22262B', 2.0, YD + 0.05, ZL - 0.3, null, 0.8, 0.1);
  /* cuatro escapes cromados sobre el techo, atras */
  [-1.6, -0.9, 0.9, 1.6].forEach(function(z){ poner(null, cil(0.13, 0.13, 1.1, 12), '#C4C9CE', XR - 1.6, YD + 0.55, z, null, 0.2, 0.9); });
  if(N50) [-0.3, 0, 0.3].forEach(function(z){ poner(null, cil(0.13, 0.13, 0.8, 12), '#C62A1E', XR - 2.6, YD + 0.40, z, null, 0.4, 0.3); });
  /* rejilla lateral izquierda en la mitad trasera */
  poner(null, caja(2.6, 1.3, 0.04), '#1B1D20', XR - 2.4, YD - 1.4, ZL + 0.01, null, 0.7, 0.3);

  /* ═══ cabina adelante a la izquierda ═══ */
  var CX0 = XF + 0.25, CX1 = CX0 + (N50 ? 2.7 : 2.5), CZ1 = ZL - 0.05, CZ0 = CZ1 - 2.0, CY0 = YD + C.pedestal, CY1 = C.cab;
  if(C.pedestal) amarillo(null, caja(CX1 - CX0 + 0.3, C.pedestal, CZ1 - CZ0 + 0.3), (CX0 + CX1) / 2, YD + C.pedestal / 2, (CZ0 + CZ1) / 2);
  negro('CBN', caja(CX1 - CX0, 0.45, CZ1 - CZ0), (CX0 + CX1) / 2, CY0 + 0.22, (CZ0 + CZ1) / 2);
  amarillo('CBN', caja(CX1 - CX0 + 0.25, 0.16, CZ1 - CZ0 + 0.20), (CX0 + CX1) / 2, CY1 - 0.08, (CZ0 + CZ1) / 2);
  [[CX0, CZ0], [CX0, CZ1], [CX1, CZ0], [CX1, CZ1]].forEach(function(p){
    negro('CBN', caja(0.12, CY1 - CY0 - 0.6, 0.12), p[0], (CY0 + 0.45 + CY1 - 0.16) / 2, p[1]);
  });
  var vidrio = new THREE.MeshStandardMaterial({ color: new THREE.Color('#22364A'), roughness: 0.06, metalness: 0.45, transparent: true, opacity: 0.84 });
  var hV = CY1 - CY0 - 0.6, yV = CY0 + 0.45 + hV / 2;
  [[0.04, hV, CZ1 - CZ0 - 0.08, CX0 - 0.01, (CZ0 + CZ1) / 2], [CX1 - CX0 - 0.08, hV, 0.04, (CX0 + CX1) / 2, CZ1 + 0.01],
   [CX1 - CX0 - 0.08, hV, 0.04, (CX0 + CX1) / 2, CZ0 - 0.01]].forEach(function(v){
    var m = new THREE.Mesh(caja(v[0], v[1], v[2]), vidrio); m.position.set(v[3], yV, v[4]); G.add(m);
  });
  poner('JLH', caja(0.15, 0.25, 0.15), '#16181B', CX0 + 0.6, CY0 + 0.70, CZ1 - 0.35, null, 0.5, 0.3);
  poner('AAC', caja(0.8, 0.22, 0.9), CAT_GRIS, CX1 - 0.55, CY1 + 0.11, (CZ0 + CZ1) / 2, null, 0.55, 0.4);
  var bal = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 8), new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4 }));
  bal.position.set(CX1 - 0.2, CY1 + 0.08, CZ0 + 0.2); G.add(bal);
  /* CAT y el modelo en el costado izquierdo */
  letrero(texCAT, 0.9, 0.45, XF + 2.2, YD - 0.9, ZL + 0.012, 0);
  var texMod = texRotulo3d(rotuloTexto(id.replace('FS', ''), CAT_NEGRO, '#FFFFFF', 0.95), 256, 96);
  letrero(texMod, 0.6, 0.22, XF + 2.2, YD - 1.45, ZL + 0.012, 0);

  /* ═══ barandas, escalera vertical adelante y escalera a 45 grados atras ═══ */
  var NB = '#202327';
  var bordes = [[CX1 + 0.1, ZL - 0.05], [XR - 0.1, ZL - 0.05], [XR - 0.1, -ZL + 0.05], [XF + 0.1, -ZL + 0.05], [XF + 0.1, CZ0 - 0.2]];
  for(var k = 0; k < bordes.length; k++){
    var p = bordes[k];
    barra(null, [p[0], YD, p[1]], [p[0], YD + 1.05, p[1]], 0.035, NB);
    if(k){ var q = bordes[k - 1];
      barra(null, [q[0], YD + 1.05, q[1]], [p[0], YD + 1.05, p[1]], 0.035, NB);
      barra(null, [q[0], YD + 0.52, q[1]], [p[0], YD + 0.52, p[1]], 0.03, NB); }
  }
  var xl = XF + 1.4, zl = ZL + 0.35;
  [xl - 0.22, xl + 0.22].forEach(function(x){ barra(null, [x, 2.8, zl], [x, YD + 1.0, zl], 0.035, NB); });
  for(var r = 0; r < Math.round((YD - 2.8) / 0.3); r++) barra(null, [xl - 0.22, 3.0 + r * 0.3, zl], [xl + 0.22, 3.0 + r * 0.3, zl], 0.025, NB);
  /* descanso al costado y escalera que baja hacia atras */
  var YL = N50 ? 4.0 : 3.6, XL = 2.6, ZE = ZL + 0.75;
  poner(null, caja(1.4, 0.10, 1.1), '#3A3F45', XL, YL, ZL + 0.55, null, 0.6, 0.4);
  var X0e = XL + 0.7, X1e = X0e + YL;            /* 45 grados: baja tanto como avanza */
  [ZE - 0.45, ZE + 0.45].forEach(function(z){
    amarillo(null, caja(Math.hypot(YL, YL), 0.20, 0.08), (X0e + X1e) / 2, YL / 2, z, [0, 0, -Math.PI / 4]);
    barra(null, [X0e, YL + 0.95, z], [X1e, 0.95, z], 0.03, NB);
  });
  for(var e = 1; e < Math.round(YL / 0.25); e++){
    var f = e / Math.round(YL / 0.25);
    poner(null, caja(0.25, 0.04, 0.9), '#2A2E33', X0e + YL * f, YL * (1 - f), ZE, null, 0.7, 0.4);
  }
  barra(null, [XL - 0.6, YL, ZL + 0.25], [XL - 0.1, YD, ZL - 0.2], 0.035, NB);

  /* ═══ equipo frontal TriPower ═══ */
  var ZB = -0.35;
  /* pose de carga (como el dibujo de rangos): la pluma sube desde el frente,
     se dobla y baja hacia la punta; el brazo cuelga hacia el cucharon */
  var PIE = [XF + 0.3, YD - 0.5], CODO = [XF - 2.6 * s, YD + 2.6 * s], PUNTA = [XF - 5.0 * s, YD + 0.9 * s];
  var BAL = [XF - 1.7 * s, YD + 0.6 * s];
  var BRZ = [PUNTA[0] - 0.5 * s, PUNTA[1] - C.brazo * 0.72];
  poner('PYB', cil(0.30, 0.30, 1.9, 16), CAT_GRIS, PIE[0], PIE[1], ZB, [Math.PI / 2, 0, 0], 0.45, 0.7);
  K.viga(null, PIE, CODO, ZB, 1.6, 1.7, CAT_AM, 1.9);
  K.viga(null, CODO, PUNTA, ZB, 1.5, 1.9, CAT_AM, 1.2);
  /* bloque de valvulas principal sobre la pluma y mangueras */
  poner('VV1', caja(1.1, 0.5, 0.9), CAT_GRIS, (PIE[0] + CODO[0]) / 2, (PIE[1] + CODO[1]) / 2 + 1.05, ZB, null, 0.5, 0.6);
  barra('LPH', [PIE[0], PIE[1] + 1.0, ZB + 0.6], [CODO[0], CODO[1] + 0.9, ZB + 0.6], 0.07, '#23272C', 0.85, 0.1);
  barra('LPH', [CODO[0], CODO[1] + 0.9, ZB + 0.6], [PUNTA[0], PUNTA[1] + 0.8, ZB + 0.6], 0.07, '#23272C', 0.85, 0.1);
  /* balancin triangular y biela de compresion */
  amarillo(null, placa([[BAL[0] + 0.5, BAL[1] - 0.4], [BAL[0] - 0.6, BAL[1] - 0.5], [BAL[0], BAL[1] + 0.7]], 0.5, ZB), 0, 0, 0);
  K.viga(null, [BAL[0] + 0.4, BAL[1]], [XF + 0.2, YD + 0.2], ZB, 0.45, 0.5, CAT_AM);
  /* dos cilindros de pluma casi verticales, desde abajo del frente */
  [ZB - 0.95, ZB + 0.95].forEach(function(z){ K.cilHid('PHY', [XF - 0.1, YB + 0.7, z], [BAL[0], BAL[1] - 0.3, z], 0.30, CAT_NEGRO, 0.5); });
  /* brazo corto y curvo bajo la punta de la pluma, con la franja CAT */
  K.viga(null, PUNTA, BRZ, ZB, 1.4, 1.3, CAT_AM, 1.1);
  var texCAT2 = texRotulo3d(rotuloCAT, 256, 128);
  [1, -1].forEach(function(l){
    var lt = letrero(texCAT2, 0.9, 0.45, (PUNTA[0] + BRZ[0]) / 2, (PUNTA[1] + BRZ[1]) / 2, ZB + l * 0.72, l > 0 ? 0 : Math.PI);
    lt.rotation.z = l * (Math.atan2(BRZ[1] - PUNTA[1], BRZ[0] - PUNTA[0]) + Math.PI / 2) * 0.5;
  });
  /* dos cilindros de empuje casi horizontales y dos de volteo */
  K.cilHid('PAL', [PIE[0] - 0.8, PIE[1] + 0.6, ZB + 0.85], [BRZ[0] + 0.5, BRZ[1] + 1.2, ZB + 0.85], 0.26, CAT_NEGRO, 0.5);
  K.cilHid('PHY', [PIE[0] - 0.8, PIE[1] + 0.6, ZB - 0.85], [BRZ[0] + 0.5, BRZ[1] + 1.2, ZB - 0.85], 0.26, CAT_NEGRO, 0.5);
  [ZB - 0.45, ZB + 0.45].forEach(function(z){ K.cilHid('PHY', [BAL[0] - 0.4, BAL[1] + 0.5, z], [BRZ[0] - 0.8, BRZ[1] + 0.6, z], 0.22, CAT_NEGRO, 0.55); });

  /* cucharon de descarga por el fondo: casco trasero y la almeja delantera */
  var W = C.balde, bx = BRZ[0], by = BRZ[1];
  var Hc = 2.9 * s, Lc = 3.1 * s;
  amarillo('LPN', placa([[bx + 0.6, by + 0.7], [bx + 0.4, by - Hc + 0.9], [bx - 0.2, by - Hc + 0.6], [bx - Lc * 0.55, by - Hc + 0.5],
                          [bx - Lc * 0.6, by + 0.6], [bx - 0.2, by + 1.0]], W - 0.3, ZB), 0, 0, 0);
  amarillo('LPN', placa([[bx - Lc * 0.6, by + 0.6], [bx - Lc * 0.55, by - Hc + 0.5], [bx - Lc, by - Hc + 0.45], [bx - Lc * 1.02, by + 0.3]], W, ZB), 0, 0, 0);
  /* placas de desgaste y seis dientes */
  for(var g2 = 0; g2 < 4; g2++) poner(null, caja(0.06, Hc * 0.7, 0.05), CAT_AM2, bx - 0.4 - g2 * 0.45 * s, by - Hc * 0.25, ZB + W / 2 + 0.03, null, 0.5, 0.15);
  for(var d = 0; d < 6; d++){
    var dt = poner('GET', caja(0.55, 0.16, 0.24), '#55595E', bx - Lc - 0.15, by - Hc + 0.40, ZB - W / 2 + 0.45 + d * (W - 0.9) / 5, null, 0.6, 0.5);
    dt.rotation.z = 0.35;
  }
  [ZB - 0.9, ZB + 0.9].forEach(function(z){ K.cilHid('PHY', [bx - 0.3, by + 0.8, z], [bx - Lc * 0.75, by + 0.5, z], 0.14, CAT_NEGRO, 0.5); });

  G.userData.ruedas = [];
  G.userData.mirarY = 4.6;
  G.userData.dist = 48;
  G.userData.modelo = id;
  return G;
}

/* @@fin PALA */
/* @@modelo PERFO */
/* ══════════════════════════════════════════════════════════════════
   PERFORADORAS DE CADENAS — ATLAS COPCO DML HP, SANDVIK D75KS y DR412i

   Hojas tecnicas (Epiroc DML 2018 / Atlas Copco DML 2013, Sandvik D75KS
   y D75KX, Sandvik DR412i 2024):
                          DML HP   D75KS   DR412i
     alto con mastil       13.4     16.33   19.2
     largo del cuerpo       9.82    10.97   14.5
     ancho de operacion     5.17     5.05    7.4
     orugas (largo)         5.01     5.3     6.454
     trocha (centros)       2.91     3.45    3.67
     tejas                  0.85     0.85    0.90
     techo de la cabina     3.62    ~3.8    ~4.35
   Lo que no esta en las hojas (alto de la cubierta, puesto de las orugas y
   del mastil) sale de medir los dibujos.

   El extremo de perforacion va adelante (-X): la cabina en la esquina
   izquierda (+Z), el mastil de celosia al centro a su lado con el cabezal
   de rotacion, el carrusel de barras y los dos cilindros de levante; el
   colector de polvo en la esquina opuesta a la cabina; atras el motor, el
   compresor y el enfriador alto con su rejilla; gatas niveladoras (dos
   adelante y una o dos atras), barandas y escaleras.
   Colores: DML amarilla Atlas Copco con el mastil gris oscuro; D75KS roja
   Sandvik con la cabina blanca; DR412i como las Sandvik de San Martin en
   Shougang (la DR460 EP-39): roja, frente de cabina azul marino, franjas
   amarillas y mastil oxido oscuro.
   ══════════════════════════════════════════════════════════════════ */
var PERFO = {
  'DMLHP':  { mastil: 13.4, largo: 9.82, ancho: 5.17, anchoAtras: 3.8, oruga: 5.01, trocha: 2.91, teja: 0.85, altoOr: 1.0,
              cubierta: 1.75, cab: 3.62, cabAncho: 1.63, cabLargo: 2.3, enfriador: 3.74, ladoMastil: 0.97,
              orugaDesde: 2.7, gatasAtras: 1,
              c1: '#E9B714', c2: '#B48A0B', cabC: '#E9B714', cabFrente: '#E9B714', mastC: '#2E3237', marca: 'Atlas Copco', nombre: 'DML HP' },
  'D75KS':  { mastil: 16.33, largo: 10.97, ancho: 5.05, anchoAtras: 4.2, oruga: 5.3, trocha: 3.45, teja: 0.85, altoOr: 1.15,
              cubierta: 1.5, cab: 3.8, cabAncho: 1.9, cabLargo: 1.8, enfriador: 3.2, ladoMastil: 1.0,
              orugaDesde: 3.2, gatasAtras: 1,
              c1: '#D9401E', c2: '#A32C12', cabC: '#F2F2EE', cabFrente: '#F2F2EE', mastC: '#D9401E', marca: 'SANDVIK', nombre: 'D75KS' },
  'DR412I': { mastil: 19.2, largo: 14.5, ancho: 7.4, anchoAtras: 5.5, oruga: 6.454, trocha: 3.67, teja: 0.90, altoOr: 1.3,
              cubierta: 1.8, cab: 4.35, cabAncho: 2.4, cabLargo: 2.1, enfriador: 4.0, ladoMastil: 1.5,
              orugaDesde: 4.0, gatasAtras: 2,
              c1: '#C8281C', c2: '#8E1A12', cabC: '#C8281C', cabFrente: '#1F2A44', mastC: '#5A3A2A', marca: 'SANDVIK', nombre: 'DR412i' }
};

function construirPerforadora(id, piezas){
  var C = PERFO[id];
  var G = new THREE.Group();
  var K = kit3d(G, piezas);
  var caja = K.caja, cil = K.cil, poner = K.poner, barra = K.barra, letrero = K.letrero;
  var color = function(code, geo, x, y, z, rot){ return poner(code, geo, C.c1, x, y, z, rot, 0.45, 0.12); };
  var oscuro = '#2B2F34';

  /* ═══ medidas: el extremo de perforacion en XF ═══ */
  var XF = -C.largo / 2, XR = C.largo / 2, YD = C.cubierta, ZW = C.ancho / 2, ZA = C.anchoAtras / 2;
  var XO0 = XF + C.orugaDesde, XO1 = XO0 + C.oruga, ZT = C.trocha / 2;

  /* ═══ orugas y bastidor ═══ */
  K.oruga('MLH', XO0, XO1, ZT, C.teja, C.altoOr, oscuro);
  K.oruga('MRH', XO0, XO1, -ZT, C.teja, C.altoOr, oscuro);
  poner(null, caja(C.largo - 0.4, YD - C.altoOr - 0.05, 1.6), C.c2, 0, (C.altoOr + YD) / 2, 0, null, 0.5, 0.2);
  /* cubierta: ancha en el extremo de perforacion, mas angosta atras */
  color(null, caja(3.4, 0.22, C.ancho - 0.3), XF + 1.7, YD - 0.11, 0);
  color(null, caja(C.largo - 3.4, 0.22, C.anchoAtras), XF + 3.4 + (C.largo - 3.4) / 2, YD - 0.11, 0);

  /* ═══ gatas niveladoras ═══ */
  var gata = function(code, x, z){
    poner(code, cil(0.16, 0.16, YD + 0.2, 14), C.c2, x, (YD + 0.2) / 2 + 0.35, z, null, 0.45, 0.2);
    poner(null, cil(0.38, 0.38, 0.08, 18), oscuro, x, 0.40, z, null, 0.6, 0.4);
  };
  gata('PG3', XF + 0.6, ZW - 0.6);
  gata(null, XF + 0.6, -ZW + 0.6);
  if(C.gatasAtras === 1) gata(null, XR - 0.4, 0);
  else { gata(null, XR - 0.4, ZA - 0.4); gata(null, XR - 0.4, -ZA + 0.4); }

  /* ═══ cabina en la esquina izquierda del extremo de perforacion ═══ */
  var CX0 = XF + 0.05, CX1 = CX0 + C.cabLargo, CZ1 = ZW - 0.1, CZ0 = CZ1 - C.cabAncho, CY0 = YD, CY1 = C.cab;
  poner('CBN', caja(CX1 - CX0, 0.55, CZ1 - CZ0), C.cabC, (CX0 + CX1) / 2, CY0 + 0.27, (CZ0 + CZ1) / 2, null, 0.45, 0.12);
  poner('CBN', caja(CX1 - CX0 + 0.08, 0.14, CZ1 - CZ0 + 0.08), C.cabC, (CX0 + CX1) / 2, CY1 - 0.07, (CZ0 + CZ1) / 2, null, 0.45, 0.12);
  poner('CBN', caja(0.10, CY1 - CY0 - 0.69, CZ1 - CZ0), C.cabFrente, CX0 + 0.02, (CY0 + 0.55 + CY1 - 0.14) / 2, (CZ0 + CZ1) / 2, null, 0.45, 0.12);
  [[CX1, CZ0], [CX1, CZ1], [CX0 + 0.6, CZ1], [CX0 + 0.6, CZ0]].forEach(function(p){
    poner('CBN', caja(0.10, CY1 - CY0 - 0.69, 0.10), C.cabC, p[0], (CY0 + 0.55 + CY1 - 0.14) / 2, p[1], null, 0.45, 0.12);
  });
  var vidrio = new THREE.MeshStandardMaterial({ color: new THREE.Color('#22364A'), roughness: 0.06, metalness: 0.45, transparent: true, opacity: 0.84 });
  var hV = CY1 - CY0 - 0.75, yV = CY0 + 0.55 + hV / 2;
  [[0.04, hV, CZ1 - CZ0 - 0.30, CX0 - 0.04, (CZ0 + CZ1) / 2], [CX1 - CX0 - 0.7, hV, 0.04, (CX0 + 0.6 + CX1) / 2, CZ1 + 0.01],
   [CX1 - CX0 - 0.7, hV, 0.04, (CX0 + 0.6 + CX1) / 2, CZ0 - 0.01], [0.6, hV, 0.04, CX0 + 0.3, CZ1 + 0.01]].forEach(function(v){
    var m = new THREE.Mesh(caja(v[0], v[1], v[2]), vidrio); m.position.set(v[3], yV, v[4]); G.add(m);
  });
  poner('JLH', caja(0.14, 0.22, 0.14), '#16181B', CX0 + 0.5, CY0 + 0.75, CZ0 + 0.4, null, 0.5, 0.3);
  poner('AAC', caja(0.7, 0.20, 0.8), '#3C434B', CX1 - 0.45, CY1 + 0.10, (CZ0 + CZ1) / 2, null, 0.55, 0.4);
  var cir = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 8), new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.4 }));
  cir.position.set(CX1 - 0.2, CY1 + 0.08, CZ1 - 0.2); G.add(cir);
  poner('CIR', cil(0.06, 0.06, 0.05, 10), '#3C434B', CX1 - 0.2, CY1 + 0.02, CZ1 - 0.2, null, 0.5, 0.4);
  [-0.3, 0.3].forEach(function(dz){
    poner('LSM', caja(0.04, 0.10, 0.18), '#F4EDCF', CX0 - 0.06, CY1 - 0.15, (CZ0 + CZ1) / 2 + dz, null, 0.2, 0.1);
  });
  /* nombre y marca en el costado de la cabina */
  var texNom = texRotulo3d(rotuloTexto(C.nombre, C.cabC === '#F2F2EE' ? '#F2F2EE' : C.cabFrente, C.cabC === '#F2F2EE' ? '#16181B' : '#FFFFFF', 0.95), 256, 80);
  letrero(texNom, 0.8, 0.25, (CX0 + CX1) / 2 + 0.2, CY0 + 0.30, CZ1 + 0.012, 0);
  var texMarca = texRotulo3d(rotuloTexto(C.marca, C.c1, '#16181B', 0.9), 384, 80);
  letrero(texMarca, 1.3, 0.27, XF + 6.0, YD - 0.45, ZA + 0.012, 0);

  /* ═══ mastil de celosia al centro, junto a la cabina ═══ */
  var XM = CX1 + 0.15 + C.ladoMastil / 2, ZM = Math.max(-0.4, CZ0 - 0.15 - C.ladoMastil / 2), a = C.ladoMastil / 2;
  var Y0 = YD + 0.1, Y1 = C.mastil;
  [[-a, -a], [-a, a], [a, -a], [a, a]].forEach(function(q){
    barra(null, [XM + q[0], Y0, ZM + q[1]], [XM + q[0], Y1, ZM + q[1]], 0.07, C.mastC, 0.5, 0.25);
  });
  var paso = 0.9;
  for(var y = Y0; y < Y1 - 0.2; y += paso){
    [[[-a, -a], [a, -a]], [[-a, a], [a, a]], [[-a, -a], [-a, a]], [[a, -a], [a, a]]].forEach(function(l){
      barra(null, [XM + l[0][0], y, ZM + l[0][1]], [XM + l[1][0], y, ZM + l[1][1]], 0.035, C.mastC, 0.5, 0.25);
    });
    barra(null, [XM - a, y, ZM - a], [XM + a, y + paso, ZM - a], 0.03, C.mastC, 0.5, 0.25);
    barra(null, [XM - a, y, ZM + a], [XM + a, y + paso, ZM + a], 0.03, C.mastC, 0.5, 0.25);
  }
  poner(null, caja(C.ladoMastil + 0.3, 0.25, C.ladoMastil + 0.3), C.mastC, XM, Y1, ZM, null, 0.5, 0.25);
  /* cabezal de rotacion a media altura, cadena de avance y barra de perforacion */
  poner('CRT', caja(0.9, 0.9, 0.8), '#3C434B', XM - a - 0.2, Y0 + (Y1 - Y0) * 0.45, ZM, null, 0.5, 0.6);
  poner('MAV', caja(0.10, Y1 - Y0 - 0.4, 0.10), '#6B7178', XM - a + 0.05, (Y0 + Y1) / 2, ZM + a * 0.6, null, 0.5, 0.6);
  poner(null, cil(0.11, 0.11, Y0 + (Y1 - Y0) * 0.45 - 0.3, 14), '#6B7178', XM - a - 0.2, (Y0 + (Y1 - Y0) * 0.45) / 2, ZM, null, 0.4, 0.7);
  /* carrusel de barras en el lado opuesto a la cabina, y la llave de barras al pie */
  poner('MCR', cil(0.32, 0.32, (Y1 - Y0) * 0.75, 16), '#7A8087', XM + 0.1, Y0 + (Y1 - Y0) * 0.45, ZM - a - 0.4, null, 0.5, 0.5);
  poner('PHW', cil(0.12, 0.12, 0.7, 12), '#202327', XM - a - 0.2, Y0 + 0.5, ZM + 0.4, [0, 0, Math.PI / 2], 0.45, 0.3);
  /* dos cilindros de levante del mastil, inclinados hacia atras */
  [ZM - a, ZM + a].forEach(function(z){ K.cilHid('HRH', [XM + 2.4, YD + 0.2, z], [XM + a, YD + (Y1 - YD) * 0.22, z], 0.13, '#202327', 0.55); });
  /* campana de polvo bajo la mesa, entre las gatas */
  poner(null, caja(1.2, YD - 0.35, 1.2), '#202327', XM - a - 0.2, (YD + 0.35) / 2, ZM, null, 0.8, 0.1);

  /* ═══ colector de polvo en la esquina opuesta a la cabina ═══ */
  var ZC = -ZW + 0.8;
  poner('CPV', cil(0.6, 0.6, 1.8, 20), C.c1, XF + 1.0, YD + 1.15, ZC, null, 0.45, 0.12);
  poner(null, cil(0.6, 0.15, 0.6, 20), C.c1, XF + 1.0, YD - 0.05, ZC, null, 0.45, 0.12);
  barra(null, [XF + 1.0, YD + 1.6, ZC + 0.5], [XM - a - 0.2, YD - 0.1, ZM - 0.5], 0.12, '#202327', 0.8, 0.1);

  /* ═══ cuarto de maquinas: motor, compresor y enfriador alto atras ═══ */
  var XE0 = CX1 + 2.7, XE1 = XR - 1.6;
  color('ENG1', caja(XE1 - XE0, 1.55, C.anchoAtras * 0.62), (XE0 + XE1) / 2, YD + 0.78, -0.15);
  poner('CMP', cil(0.55, 0.55, 1.5, 18), '#3C434B', XE0 + 0.9, YD + 0.95, C.anchoAtras * 0.31 + 0.15, [0, 0, Math.PI / 2], 0.5, 0.6);
  poner('PTB1', caja(0.6, 0.6, 0.6), '#3C434B', XE0 + 0.1, YD + 0.4, -0.15, null, 0.5, 0.6);
  poner('PYM', caja(0.7, 0.5, 0.6), '#3C434B', XE0 + 0.1, YD + 0.3, 0.75, null, 0.5, 0.6);
  color('RAD1', caja(1.2, C.enfriador - YD, C.anchoAtras - 0.3), XR - 0.9, (YD + C.enfriador) / 2, 0);
  [-1, 1].forEach(function(l){
    poner('CHD1', caja(1.0, (C.enfriador - YD) * 0.7, 0.04), '#1B1D20', XR - 0.9, YD + (C.enfriador - YD) * 0.48, l * (ZA - 0.13), null, 0.7, 0.3);
  });
  poner('VAC', caja(0.9, 0.5, 0.7), '#3C434B', XE1 - 0.3, YD + 1.8, 0.6, null, 0.5, 0.6);
  poner('BAT', caja(0.6, 0.4, 0.5), '#16181B', XE0 + 0.4, YD + 0.2, -ZA + 0.4, null, 0.6, 0.3);
  poner('SEN', caja(0.5, 0.6, 0.4), '#3C434B', XE0 - 0.6, YD + 0.3, -ZA + 0.4, null, 0.5, 0.5);
  poner('AR1', cil(0.12, 0.12, 0.3, 12), '#202327', XE0 + 1.8, YD + 1.65, -0.6, [0, 0, Math.PI / 2], 0.45, 0.7);
  poner('SCI', cil(0.10, 0.10, 0.65, 12), '#C62A1E', XE0 - 0.3, YD + 0.32, ZA - 0.3, null, 0.4, 0.3);
  poner(null, cil(0.10, 0.12, 1.2, 12), '#202327', XE1 - 0.8, YD + 2.0, -0.6, null, 0.5, 0.6);
  barra('LPH', [XF + 2.0, YD + 0.1, 0.9], [XE1, YD + 0.1, 0.9], 0.04, '#23272C', 0.85, 0.1);
  barra('LPA', [XF + 2.0, YD + 0.1, 1.1], [XE1, YD + 0.1, 1.1], 0.04, '#30353B', 0.85, 0.1);
  poner('HAR', caja(C.largo - 3, 0.05, 0.05), '#22262B', 0.6, YD + 0.05, -1.0, null, 0.8, 0.1);
  poner('RG1', cil(0.18, 0.18, 0.4, 12), '#3C434B', XM - a - 0.2, Y0 + (Y1 - Y0) * 0.45 + 0.65, ZM, null, 0.45, 0.6);

  /* ═══ barandas y escaleras ═══ */
  var BR = id === 'DMLHP' ? C.c1 : (id === 'DR412I' ? '#E8C21A' : C.c1);
  var lado = function(pts){
    for(var k = 0; k < pts.length; k++){
      var p = pts[k];
      barra(null, [p[0], YD, p[1]], [p[0], YD + 1.0, p[1]], 0.03, BR);
      if(k){ var q = pts[k - 1];
        barra(null, [q[0], YD + 1.0, q[1]], [p[0], YD + 1.0, p[1]], 0.03, BR);
        barra(null, [q[0], YD + 0.5, q[1]], [p[0], YD + 0.5, p[1]], 0.025, BR); }
    }
  };
  lado([[CX1 + 0.2, ZA - 0.05], [XR - 0.1, ZA - 0.05], [XR - 0.1, -ZA + 0.05], [XF + 3.4, -ZA + 0.05]]);
  lado([[XF + 0.1, -ZW + 0.05], [XF + 3.4, -ZW + 0.05]]);
  [[CX1 + 1.0, ZA + 0.05], [XR - 0.6, -ZA - 0.05]].forEach(function(q){
    [-0.2, 0.2].forEach(function(dx){ barra(null, [q[0] + dx, 0.4, q[1]], [q[0] + dx, YD, q[1]], 0.03, BR); });
    for(var r = 0; r < 4; r++) barra(null, [q[0] - 0.2, 0.55 + r * (YD - 0.6) / 4, q[1]], [q[0] + 0.2, 0.55 + r * (YD - 0.6) / 4, q[1]], 0.022, BR);
  });
  /* franjas reflectivas amarillas en la cubierta (como la DR460 de San Martin) */
  if(id === 'DR412I') [-1, 1].forEach(function(l){
    for(var f = 0; f < 10; f++) poner(null, caja(0.5, 0.06, 0.01), '#E8C21A', XF + 0.6 + f * (C.largo - 1.2) / 9, YD - 0.12, l * (f < 3 ? ZW - 0.15 : ZA) + l * 0.006, null, 0.4, 0.1);
  });

  G.userData.ruedas = [];
  /* el mastil entero en cuadro */
  G.userData.mirarY = C.mastil * 0.45;
  G.userData.dist = C.mastil * 3.2;
  G.userData.modelo = id;
  return G;
}

/* @@fin PERFO */
/* cambia el camion del estudio cuando el equipo elegido es de otro modelo */
var MODELO3D_ACTUAL = 'generico';
function liberar3d(obj){
  obj.traverse(function(m){
    if(m.geometry) m.geometry.dispose();
    if(m.material){
      (Array.isArray(m.material) ? m.material : [m.material]).forEach(function(x){
        /* la textura del labrado es compartida; los letreros son de este camion */
        if(x.map && x.map !== _texLabrado) x.map.dispose();
        x.dispose();
      });
    }
  });
}
function ponerModelo3d(e){
  if(!HAY3D || !escE) return;
  /* el estudio con cajas de luz: reflejos en la pintura y el vidrio */
  if(!escE.userData.entornoDet){ escE.environment = entornoEstudio(rE); escE.userData.entornoDet = true; }
  var k = modelo3dDe(e);
  if(k !== MODELO3D_ACTUAL) cambiarModelo3d(e, k);
  /* el numero de unidad pintado en la maquina */
  if(camion && camion.userData.ponerNumero) camion.userData.ponerNumero(e.id);
}
function cambiarModelo3d(e, k){
  var nuevas = [];
  var reg = /^R:/.test(k) ? modelo3dRegistrado(e) : null;
  var nuevo = reg ? reg.def.construir(e, nuevas, k.slice(2))
            : k === 'generico' ? construirCamion(true, nuevas)
            : k === 'T800' ? construirT800Anfo(nuevas)
            : k === 'R9100' ? construirR9100(nuevas)
            : k === '992K' ? construir992K(nuevas)
            : /^PALA/.test(k) ? construirPalaCat(modelo3dPala(e), nuevas)
            : /^PERFO/.test(k) ? construirPerforadora(modelo3dPerfo(e), nuevas)
            : k === 'TLH135' || k === 'RTH100' ? construirAncho6x4(k, nuevas)
            : construirCatRigido(k, nuevas);
  /* El estudio sale en sRGB pero un color puesto con un hex se toma como
     lineal: los modelos de detalle se veian deslavados (el amarillo CAT
     limon, el rojo Sandvik salmon). Se pasa cada color a lineal una vez y la
     base del mapa de calor queda en ese valor; pintarCamion convierte igual
     los colores de calor. Los letreros con textura no se tocan. */
  if(reg){
    nuevo.traverse(function(m){
      if(!m.isMesh || !m.material) return;
      (Array.isArray(m.material) ? m.material : [m.material]).forEach(function(mt){
        if(!mt.color || mt.map || (mt.userData && mt.userData.lin)) return;
        mt.userData.lin = true;
        mt.color.convertSRGBToLinear();
        if(mt.emissive) mt.emissive.convertSRGBToLinear();
      });
      if(m.userData.base && m.material.color && !m.material.map) m.userData.base = '#' + m.material.color.getHexString();
    });
    nuevo.userData.colorLineal = true;
  }
  if(camion){ escE.remove(camion); liberar3d(camion); }
  camion = nuevo; piezas = nuevas; sobre = null;
  camion.position.y = 0;
  escE.add(camion);
  /* cada maquina trae a que altura mirar y desde que distancia */
  dist = camion.userData.dist || 30;
  MODELO3D_ACTUAL = k;
}
