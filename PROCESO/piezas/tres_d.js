/* ══════════════════════════════════════════════════════════════════
   8 · el camion — geometria construida pieza a pieza
   ══════════════════════════════════════════════════════════════════ */
var HAY3D = (typeof THREE !== 'undefined');

/* paleta de materiales: librea de contratista sobre chasis de acero */
/* El color del camion es el de la marca: CAT y Komatsu amarillos, el resto
   verdes. PINTURA/PINTURA2 son el verde y siguen siendo el color con el que
   se construye; despues se repinta segun la marca. */
var PINTURA_AM = '#EDBB16', PINTURA2_AM = '#A8830E';
var PINTURA = '#3E8E41', PINTURA2 = '#2C6B30', ACERO = '#2F3740', ACERO2 = '#414B56',
    CROMO = '#9AA6B2', CAUCHO = '#15191E', LLANTA_R = '#79848F', VIDRIO = '#8FB8D4',
    AZUL = '#25498E', ROJO = '#95321F';

function crearEntorno(rend){
  var c = document.createElement('canvas'); c.width = 32; c.height = 32;
  var g = c.getContext('2d'), gr = g.createLinearGradient(0,0,0,32);
  gr.addColorStop(0, '#FFFFFF'); gr.addColorStop(0.45, '#D6E1EC');
  gr.addColorStop(0.55, '#9FAEBC'); gr.addColorStop(1, '#5D6875');
  g.fillStyle = gr; g.fillRect(0,0,32,32);
  var tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  var pm = new THREE.PMREMGenerator(rend);
  pm.compileEquirectangularShader();
  var rt = pm.fromEquirectangular(tex);
  pm.dispose(); tex.dispose();
  return rt.texture;
}

/* Se compara por palabra entera: BOBCAT contiene "CAT" y no es Caterpillar. */
function esMarcaAmarilla(marca){
  var m = (marca || '').toUpperCase();
  return /(^|[^A-Z])(CAT|CATERPILLAR|KOMATSU)([^A-Z]|$)/.test(m);
}
/* Repinta solo la carroceria: las piezas llevan en userData.base el color
   con el que se construyeron, asi que el acero, el cromo y el caucho no se
   tocan. Tambien se actualiza esa base para que el mapa de calor por
   sistema sepa a que color volver. */
function pintarCarroceria(grupo, amarillo){
  if(!grupo) return;
  var a = amarillo ? PINTURA_AM : PINTURA;
  var b = amarillo ? PINTURA2_AM : PINTURA2;
  grupo.traverse(function(m){
    if(!m.isMesh || !m.userData) return;
    var base = m.userData.base;
    if(base === PINTURA || base === PINTURA_AM){
      m.userData.base = a;
      if(m.material && m.material.color) m.material.color.set(a);
    } else if(base === PINTURA2 || base === PINTURA2_AM){
      m.userData.base = b;
      if(m.material && m.material.color) m.material.color.set(b);
    }
  });
}

function matMetal(hex, rug, met){
  var m = new THREE.MeshStandardMaterial({
    color: new THREE.Color(hex),
    roughness: rug === undefined ? 0.62 : rug,
    metalness: met === undefined ? 0.45 : met
  });
  m.envMapIntensity = 0.38;      /* el estudio ilumina, no lava el color */
  return m;
}
/* Constructor del camion rigido de acarreo.
   Proporciones de un camion minero real: 12.6 m de largo, 7.2 m de ancho,
   5.9 m de alto, llantas de 3.2 m de diametro. Todas las piezas llevan el
   codigo de sistema del maestro SAP, para que el mapa de costo caiga sobre
   la pieza que corresponde.
   fino=true  -> version inspeccionable del capitulo 05
   fino=false -> version ligera que circula por la rampa del tajo          */
var _texLabrado = null;
function texLabrado(){
  if(_texLabrado) return _texLabrado;
  var c = document.createElement('canvas'); c.width = 128; c.height = 32;
  var g = c.getContext('2d');
  g.clearRect(0,0,128,32);
  g.fillStyle = 'rgba(255,255,255,1)';
  for(var i=0; i<16; i++){
    var x = i*8;
    g.save(); g.translate(x,0); g.transform(1,0,-0.35,1,0,0);
    g.fillRect(1.6, -4, 4.4, 40);
    g.restore();
  }
  _texLabrado = new THREE.CanvasTexture(c);
  _texLabrado.wrapS = _texLabrado.wrapT = THREE.RepeatWrapping;
  return _texLabrado;
}

function construirCamion(fino, piezas){
  var G = new THREE.Group();
  var lados = fino ? 22 : 8;

  var caja = function(w,h,d){ return new THREE.BoxGeometry(w,h,d); };
  var cil  = function(r1,r2,h,s){ return new THREE.CylinderGeometry(r1,r2,h,s||lados); };
  var reg = function(code, malla, base){
    malla.userData.code = code || null;
    malla.userData.base = base || null;
    malla.castShadow = fino; malla.receiveShadow = fino;
    G.add(malla);
    if(code && piezas) piezas.push(malla);
    return malla;
  };
  var poner = function(code, geo, hex, x,y,z, rot, rug, met){
    var m = new THREE.Mesh(geo, matMetal(hex, rug, met));
    m.position.set(x,y,z);
    if(rot) m.rotation.set(rot[0]||0, rot[1]||0, rot[2]||0);
    return reg(code, m, hex);
  };
  /* los camiones que circulan por la rampa se ven a 30 px: solo volumenes */
  var det = fino ? poner : function(){};
  /* lo que sube con la tolva al descargar; se reparenta al final */
  var esTolva = function(m){ if(m) m.userData.tolva = true; return m; };
  /* extruye un perfil transversal (z,y) a lo largo del eje X */
  var extruir = function(pts, largo, xc, yc){
    var sh = new THREE.Shape();
    pts.forEach(function(p,i){ i ? sh.lineTo(p[0],p[1]) : sh.moveTo(p[0],p[1]); });
    sh.closePath();
    var g = new THREE.ExtrudeGeometry(sh, { depth:largo, bevelEnabled:false });
    g.rotateY(Math.PI/2);
    g.translate(xc - largo/2, yc, 0);
    return g;
  };

  /* ═══ bastidor ═══ */
  var perfilLarguero = [
    [-6.30,-0.34],[-5.10, 0.30],[-1.60, 0.62],[ 2.60, 0.62],[ 5.10, 0.24],
    [ 5.80,-0.12],[ 5.80,-0.60],[ 2.40,-0.86],[-1.80,-0.86],[-5.30,-0.62],[-6.30,-0.72]
  ];
  (function(){
    var sh = new THREE.Shape();
    perfilLarguero.forEach(function(p,i){ i ? sh.lineTo(p[0],p[1]) : sh.moveTo(p[0],p[1]); });
    sh.closePath();
    var g = new THREE.ExtrudeGeometry(sh, { depth:0.46, bevelEnabled:false });
    g.translate(0,0,-0.23);
    poner(null, g.clone(), ACERO, 0, 2.12, -1.45, null, 0.74, 0.72);
    poner(null, g.clone(), ACERO, 0, 2.12,  1.45, null, 0.74, 0.72);
  })();
  [-4.9,-2.6, 0.2, 2.8, 5.1].forEach(function(x){
    det(null, caja(0.36, 0.50, 2.95), ACERO2, x, 2.05, 0, null, 0.72, 0.62);
  });
  /* parachoques y contrapeso delantero */
  poner(null, caja(0.52, 1.05, 5.10), ACERO2, -6.30, 1.85, 0, null, 0.78, 0.6);
  det(null, caja(0.30, 0.60, 4.20), ACERO,  -6.58, 1.35, 0, null, 0.8, 0.55);

  /* ═══ tolva: seccion en V, paredes con espesor ═══ */
  var perfilTolva = [
    [-3.34, 2.85],[-3.34, 0.66],[-2.58,-0.56],[ 0.00,-1.02],[ 2.58,-0.56],
    [ 3.34, 0.66],[ 3.34, 2.85],[ 3.04, 2.85],[ 3.04, 0.74],[ 2.44,-0.30],
    [ 0.00,-0.72],[-2.44,-0.30],[-3.04, 0.74],[-3.04, 2.85]
  ];
  poner('TLV', extruir(perfilTolva, 9.55, 0.95, 3.62), PINTURA, 0,0,0, null, 0.52, 0.12);
  /* pared frontal inclinada y visera sobre la cabina */
  var frontal = new THREE.Mesh(caja(0.34, 3.35, 6.80), matMetal(PINTURA, 0.52, 0.12));
  frontal.position.set(-3.98, 4.22, 0); frontal.rotation.z = 0.10;
  reg('TLV', frontal, PINTURA);
  var visera = new THREE.Mesh(caja(2.45, 0.32, 6.80), matMetal(PINTURA, 0.52, 0.12));
  visera.position.set(-5.05, 6.12, 0); visera.rotation.z = -0.10;
  reg('TLV', visera, PINTURA);
  [-3.05, 3.05].forEach(function(z){
    esTolva(poner(null, caja(0.16, 1.35, 0.16), PINTURA2, -4.30, 5.55, z, [0,0,0.14], 0.55, 0.14));
  });
  /* cola con eyector de roca */
  det('TLV', caja(0.60, 0.34, 6.30), PINTURA2, 5.72, 2.72, 0, [0,0,-0.34], 0.55, 0.12);

  if(fino){
    /* nervios exteriores y franja de la contratista */
    [-2.5,-0.7, 1.1, 2.9, 4.6].forEach(function(x){
      esTolva(poner(null, caja(0.16, 1.95, 0.12), PINTURA2, x, 5.34, -3.38, null, 0.55, 0.12));
      esTolva(poner(null, caja(0.16, 1.95, 0.12), PINTURA2, x, 5.34,  3.38, null, 0.55, 0.12));
    });
    esTolva(poner(null, caja(8.9, 0.50, 0.07), AZUL, 0.95, 5.62, -3.42, null, 0.45, 0.1));
    esTolva(poner(null, caja(8.9, 0.50, 0.07), AZUL, 0.95, 5.62,  3.42, null, 0.45, 0.1));
    esTolva(poner(null, caja(8.9, 0.10, 0.09), '#12161B', 0.95, 6.32, -3.42, null, 0.7, 0.2));
    esTolva(poner(null, caja(8.9, 0.10, 0.09), '#12161B', 0.95, 6.32,  3.42, null, 0.7, 0.2));
  }
  /* cilindros de levante, apoyados entre bastidor y tolva */
  if(fino) [-1.15, 1.15].forEach(function(z){
    var cu = new THREE.Mesh(cil(0.30,0.30,2.55,fino?14:6), matMetal(ACERO2, 0.5, 0.72));
    cu.position.set(-0.55, 2.62, z); cu.rotation.z = 0.72; reg('HLH', cu, ACERO2);
    var va = new THREE.Mesh(cil(0.17,0.17,1.60,fino?14:6), matMetal(CROMO, 0.16, 0.96));
    va.position.set(0.60, 3.75, z); va.rotation.z = 0.72; reg('HLH', va, CROMO);
  });

  /* ═══ trompa: motor a la derecha, cabina a la izquierda ═══ */
  poner('ENG1', caja(3.10, 2.05, 2.35), ACERO2, -5.05, 2.95, 1.15, null, 0.54, 0.68);
  det('ENG1', caja(2.70, 0.36, 0.70), ACERO,  -5.05, 4.10, 0.62, null, 0.48, 0.76);
  det('ENG1', caja(2.70, 0.36, 0.70), ACERO,  -5.05, 4.10, 1.68, null, 0.48, 0.76);
  poner('RAD1', caja(0.46, 2.55, 2.70), ACERO2, -6.36, 3.05, 1.10, null, 0.7, 0.55);
  det(null,   caja(0.16, 2.25, 2.40), CROMO,  -6.60, 3.05, 1.10, null, 0.4, 0.88);
  det('MFC1', new THREE.TorusGeometry(0.88, 0.11, 7, fino?22:8), ACERO,
        -5.98, 3.05, 1.10, [0, Math.PI/2, 0], 0.55, 0.7);
  det('MFC1', cil(0.26,0.26,0.40,fino?12:6), ACERO, -5.98, 3.05, 1.10, [0,0,Math.PI/2], 0.5, 0.8);
  det('TLH1', cil(0.28,0.21,0.62,fino?12:6), ACERO, -3.75, 3.95, 0.55, [0,0,Math.PI/2], 0.42, 0.86);
  det('TRH1', cil(0.28,0.21,0.62,fino?12:6), ACERO, -3.75, 3.95, 1.75, [0,0,Math.PI/2], 0.42, 0.86);
  det('INY1', caja(0.60,0.26,1.95), ACERO, -5.05, 3.62, 2.15, null, 0.5, 0.8);
  det('AL1',  cil(0.28,0.28,0.48,fino?12:6), ACERO, -6.05, 2.30, 2.00, [0,0,Math.PI/2], 0.44, 0.86);
  det('AR1',  cil(0.24,0.24,0.54,fino?12:6), ACERO, -6.05, 2.30, 0.30, [0,0,Math.PI/2], 0.44, 0.86);
  det('CMP',  caja(0.76,0.62,0.66), ACERO2, -3.55, 2.62, 2.15, null, 0.6, 0.6);
  det(null, caja(3.30, 1.70, 0.14), PINTURA, -5.05, 2.90, 2.42, null, 0.5, 0.12);
  det(null, caja(3.30, 0.16, 1.45), PINTURA, -5.05, 3.72, 2.42, null, 0.5, 0.12);
  /* chimeneas */
  [0.55, 1.75].forEach(function(z){
    det(null, cil(0.19,0.19,1.95,fino?12:6), ACERO, -3.62, 4.90, z, null, 0.55, 0.8);
  });

  /* ═══ cabina ═══ */
  poner('CBN', caja(2.20, 2.00, 2.10), PINTURA, -5.15, 4.42, -2.10, null, 0.46, 0.12);
  det('CBN', caja(2.60, 0.20, 2.50), ACERO2,  -5.15, 3.34, -2.10, null, 0.7, 0.52);
  var vidrioMat = new THREE.MeshStandardMaterial({
    color:new THREE.Color(VIDRIO), roughness:0.06, metalness:0.2,
    transparent:true, opacity:0.40 });
  if(fino){
    var vf = new THREE.Mesh(caja(0.08, 1.30, 1.78), vidrioMat);
    vf.position.set(-6.27, 4.62, -2.10); G.add(vf);
    var vl = new THREE.Mesh(caja(1.72, 1.20, 0.08), vidrioMat.clone());
    vl.position.set(-5.15, 4.62, -3.17); G.add(vl);
  }
  det('AAC', caja(1.05, 0.40, 1.00), ACERO2, -5.05, 5.62, -2.10, null, 0.6, 0.5);

  if(fino){
    /* espejo, plataforma y escalera de acceso */
    poner(null, cil(0.06,0.06,1.25,8), ACERO, -6.60, 5.30, -2.10, [0,0,Math.PI/2.3], 0.5, 0.8);
    poner(null, caja(0.06, 0.58, 0.38), ACERO, -7.02, 5.66, -2.10, null, 0.38, 0.86);
    poner(null, caja(2.20, 0.10, 0.85), ACERO2, -5.55, 3.28, -3.55, null, 0.76, 0.5);
    poner(null, caja(0.10, 1.05, 0.85), ACERO2, -4.50, 3.80, -3.55, null, 0.76, 0.5);
    for(var st=0; st<4; st++){
      poner(null, caja(0.72, 0.07, 0.16), ACERO2, -5.55, 2.62 - st*0.66, -3.62, null, 0.76, 0.5);
    }
    poner(null, cil(0.05,0.05,3.4,8), ACERO, -5.22, 1.75, -3.68, null, 0.5, 0.8);
    poner(null, cil(0.05,0.05,3.4,8), ACERO, -5.90, 1.75, -3.68, null, 0.5, 0.8);
    /* barandas sobre la plataforma del motor */
    [-4.10,-6.00].forEach(function(x){
      poner(null, cil(0.05,0.05,1.05,8), ACERO, x, 4.60, 3.30, null, 0.5, 0.8);
    });
    poner(null, cil(0.05,0.05,1.95,8), ACERO, -5.05, 5.10, 3.30, [0,0,Math.PI/2], 0.5, 0.8);
  }

  /* luces */
  var luzMat = function(){ return new THREE.MeshStandardMaterial({
    color:new THREE.Color('#F7ECC4'), roughness:0.2, metalness:0.1,
    emissive:new THREE.Color('#3E3818') }); };
  if(fino){
    [-2.35,-0.85, 0.85, 2.35].forEach(function(z){
      poner(null, caja(0.20,0.26,0.44), '#191E24', -5.98, 5.86, z, null, 0.7, 0.3);
      var l = new THREE.Mesh(caja(0.10,0.17,0.32), luzMat());
      l.position.set(-6.10, 5.86, z); reg('LSM', l, '#F7ECC4');
    });
    [-2.05, 2.85].forEach(function(z){
      poner(null, caja(0.16,0.40,0.54), '#191E24', -6.48, 2.42, z, null, 0.7, 0.3);
      poner('LSM', caja(0.10,0.28,0.40), '#F7ECC4', -6.58, 2.42, z, null, 0.2, 0.1);
    });
  }
  det('FPD', caja(0.18,0.26,0.34), ROJO, 5.90, 2.55, 2.60, null, 0.4, 0.2);
  det('FPD', caja(0.18,0.26,0.34), ROJO, 5.90, 2.55, -2.60, null, 0.4, 0.2);

  /* ═══ tren de fuerza ═══ */
  det('CON',  cil(0.60,0.60,1.05), ACERO2, -2.55, 1.62, 0, [0,0,Math.PI/2], 0.5, 0.75);
  det('TRM',  caja(2.75, 1.30, 1.55), ACERO2, -0.80, 1.55, 0, null, 0.52, 0.72);
  det('CAR',  cil(0.18,0.18,2.55,fino?12:6), CROMO, 1.30, 1.48, 0, [0,0,Math.PI/2], 0.3, 0.9);
  det('DIFP', new THREE.SphereGeometry(0.95, fino?18:8, fino?12:6), ACERO2, 2.98, 1.48, 0, null, 0.5, 0.72);
  det('DIFD', cil(0.48,0.48,0.80,fino?12:6), ACERO2, -3.60, 1.62, 0, [0,0,Math.PI/2], 0.55, 0.7);
  det(null,   cil(0.32,0.32,5.20,fino?12:6), ACERO, 2.98, 1.48, 0, [Math.PI/2,0,0], 0.6, 0.7);
  det('MLH',  cil(0.92,0.92,0.70,fino?16:8), ACERO2, 2.98, 1.48, -2.70, [Math.PI/2,0,0], 0.5, 0.72);
  det('MRH',  cil(0.92,0.92,0.70,fino?16:8), ACERO2, 2.98, 1.48,  2.70, [Math.PI/2,0,0], 0.5, 0.72);
  det('FDP',  cil(0.50,0.50,0.34,fino?12:6), ACERO, 2.10, 1.55, 0, [0,0,Math.PI/2], 0.5, 0.7);
  det('BPRH', cil(0.34,0.34,0.30,fino?10:6), ACERO, 2.98, 1.48, 3.35, [Math.PI/2,0,0], 0.55, 0.72);

  /* ═══ suspension y direccion ═══ */
  function amortiguador(code, x, z, incl){
    det(code, cil(0.30,0.30,1.85,fino?12:6), ACERO2, x, 2.55, z, [incl||0,0,0], 0.55, 0.7);
    det(null, cil(0.16,0.16,1.20,fino?12:6), CROMO,  x, 1.72, z, [incl||0,0,0], 0.16, 0.96);
  }
  amortiguador('SDI', -3.60, -2.70, 0.14);
  amortiguador('SDD', -3.60,  2.70,-0.14);
  amortiguador('SPI',  3.85, -2.75, 0.18);
  amortiguador('SPD',  3.85,  2.75,-0.18);
  det('SLH', cil(0.14,0.14,1.55,fino?10:6), CROMO, -2.95, 2.10, -2.10, [0,0.45,Math.PI/2], 0.2, 0.94);
  det('SRH', cil(0.14,0.14,1.55,fino?10:6), CROMO, -2.95, 2.10,  2.10, [0,-0.45,Math.PI/2], 0.2, 0.94);
  det('BMLH', cil(0.46,0.46,0.42,fino?12:6), ACERO, -3.60, 1.62, -2.20, [Math.PI/2,0,0], 0.55, 0.72);
  det('BMRH', cil(0.46,0.46,0.42,fino?12:6), ACERO, -3.60, 1.62,  2.20, [Math.PI/2,0,0], 0.55, 0.72);
  det('PYB', cil(0.12,0.12,0.46,fino?10:6), CROMO, -3.05, 1.72, -1.20, [0,0,Math.PI/2], 0.26, 0.92);

  /* ═══ servicios sobre el bastidor ═══ */
  det('TQH1', cil(0.66,0.66,2.55,fino?16:8), ACERO2, -1.55, 2.72, -2.25, [0,0,Math.PI/2], 0.55, 0.68);
  det('TQC1', cil(0.72,0.72,2.85,fino?16:8), ACERO2, -1.55, 2.72,  2.25, [0,0,Math.PI/2], 0.55, 0.68);
  det('SEN',  caja(0.82,0.66,0.64), ACERO2,  0.70, 2.72, -2.25, null, 0.6, 0.6);
  det('GP1',  cil(0.22,0.22,0.46,fino?10:6), ACERO, 1.42, 2.72, -2.25, [0,0,Math.PI/2], 0.5, 0.8);
  det('MLB',  caja(0.46,0.36,0.42), ACERO,   1.42, 2.72, -1.70, null, 0.5, 0.75);
  det('BAT',  caja(0.90,0.54,0.72), ACERO2,  0.70, 2.72,  2.25, null, 0.6, 0.55);
  det('SCI',  caja(0.62,0.66,0.52), ROJO,    1.95, 2.72,  2.25, null, 0.42, 0.24);
  det('SENS', caja(0.38,0.32,0.30), ACERO,   1.95, 2.72, -1.70, null, 0.5, 0.7);
  det('HPM',  cil(0.28,0.28,0.60,fino?10:6), ACERO, -2.45, 2.35, 1.55, [0,0,Math.PI/2], 0.44, 0.84);
  det('PTB1', caja(0.46,0.44,0.46), ACERO,   -3.05, 2.10, 1.10, null, 0.5, 0.75);
  det('CBR3', caja(0.44,0.56,0.34), ACERO2,   2.55, 2.42, -1.45, null, 0.62, 0.6);
  det('PHY',  cil(0.15,0.15,0.95,fino?10:6), CROMO, 3.55, 2.48, -1.45, [0,0,Math.PI/2], 0.2, 0.94);
  det('MAV',  caja(0.34,0.28,0.32), ACERO, 4.35, 2.35, -1.15, null, 0.55, 0.7);
  [-1.80, 1.80].forEach(function(z){
    det('LPH', cil(0.08,0.08,8.2,fino?8:5), '#2A3038', 0.0, 2.44, z, [0,0,Math.PI/2], 0.88, 0.15);
    det('LPH', cil(0.08,0.08,8.2,fino?8:5), '#2A3038', 0.0, 2.30, z, [0,0,Math.PI/2], 0.88, 0.15);
  });

  /* ═══ llantas: 505/95R29, 3.2 m de diametro ═══ */
  var perfilLl = [];
  [[0.62,-0.50],[0.76,-0.53],[1.10,-0.58],[1.40,-0.545],[1.555,-0.40],
   [1.615,-0.18],[1.63,0],[1.615,0.18],[1.555,0.40],[1.40,0.545],
   [1.10,0.58],[0.76,0.53],[0.62,0.50]].forEach(function(p){
    perfilLl.push(new THREE.Vector2(p[0], p[1]));
  });

  /* Cada rueda en su grupo: girar la llanta sola dejaria el aro, la banda
     y los esparragos quietos. El grupo gira sobre Z, el eje lateral. */
  var ruedas = [];
  function rueda(code, x, z, ancho, ladoAfuera){
    var gr = new THREE.Group();
    gr.position.set(x, 1.63, z);
    G.add(gr); ruedas.push(gr);

    var gT = new THREE.LatheGeometry(perfilLl, fino ? 24 : 9);
    gT.scale(1, ancho, 1);
    var t = new THREE.Mesh(gT, matMetal(CAUCHO, 0.94, 0.04));
    t.rotation.x = Math.PI/2;
    t.userData.isLlanta = true;
    t.userData.code = code || null;
    t.userData.base = CAUCHO;
    t.castShadow = fino; t.receiveShadow = fino;
    gr.add(t);
    if(code && piezas) piezas.push(t);

    var aro = new THREE.Mesh(cil(0.72, 0.72, ancho*1.04, fino?18:7), matMetal(LLANTA_R, 0.4, 0.86));
    aro.rotation.x = Math.PI/2;
    aro.castShadow = fino; gr.add(aro);
    if(fino && ladoAfuera){
      var lado = ladoAfuera;
      var hub = new THREE.Mesh(cil(0.32, 0.32, 0.12, 14), matMetal(ACERO, 0.5, 0.8));
      hub.rotation.x = Math.PI/2; hub.position.set(0, 0, lado*(ancho*0.55));
      gr.add(hub);
      for(var b=0; b<8; b++){
        var a = b/8 * Math.PI*2;
        var pn = new THREE.Mesh(cil(0.06,0.06,0.09,6), matMetal(CROMO, 0.32, 0.92));
        pn.rotation.x = Math.PI/2;
        pn.position.set(Math.cos(a)*0.52, Math.sin(a)*0.52, lado*(ancho*0.56));
        gr.add(pn);
      }
      var band = new THREE.Mesh(
        new THREE.CylinderGeometry(1.638, 1.638, ancho*1.62, 26, 1, true),
        new THREE.MeshStandardMaterial({ map:texLabrado(), color:new THREE.Color('#20262D'),
          roughness:0.95, metalness:0.03, transparent:true }));
      band.rotation.x = Math.PI/2;
      band.castShadow = false; gr.add(band);
    }
  }
  rueda('LL1', -3.60, -2.72, 0.56, -1);
  rueda('LL2', -3.60,  2.72, 0.56,  1);
  rueda('LL3',  2.98, -3.30, 0.50, -1);
  rueda('LL4',  2.98, -2.22, 0.50,  0);
  rueda('LL5',  2.98,  2.22, 0.50,  0);
  rueda('LL6',  2.98,  3.30, 0.50,  1);

  /* ═══ la tolva se cuelga de un pivote en el gancho trasero ═══
     Se hace al final, cuando ya estan todas las piezas: se sacan del
     camion las que son tolva y se vuelven a colgar del grupo, restando
     el pivote para que no se muevan de sitio. */
  var PIV = new THREE.Vector3(5.42, 2.62, 0);
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

  return G;
}
/* ══════════════════════════════════════════════════════════════════
   9 · estudio 3D del capitulo 05
   ══════════════════════════════════════════════════════════════════ */
var rE, escE, camE, camion, piezas = [], rayE, punteroE, sobre = null;
var rotY = 2.35, rotX = 0.27, dist = 30, arrastra = false, ultX = 0, ultY = 0, gira = true;
var estudioVisible = false, modelo3d = true;

function iniciarEstudio(){
  if(!$('lienzo-eq')) return;
  var cv = $('lienzo-eq');
  rE = new THREE.WebGLRenderer({ canvas:cv, antialias:true, alpha:true, powerPreference:'high-performance' });
  rE.setPixelRatio(Math.min(window.devicePixelRatio || 1, MOVIL ? 1.5 : 2));
  rE.outputEncoding = THREE.sRGBEncoding;
  rE.shadowMap.enabled = !MOVIL;
  rE.shadowMap.type = THREE.PCFSoftShadowMap;

  escE = new THREE.Scene();
  camE = new THREE.PerspectiveCamera(30, 1.6, 0.5, 160);
  var env = crearEntorno(rE);
  escE.environment = env;

  escE.add(new THREE.HemisphereLight(0xEDF4FA, 0x6D7A87, 0.48));
  var key = new THREE.DirectionalLight(0xFFF6E8, 2.35);
  key.position.set(11, 15, 9);
  if(!MOVIL){
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    var c = key.shadow.camera;
    c.left = -13; c.right = 13; c.top = 13; c.bottom = -13; c.near = 4; c.far = 50;
    key.shadow.bias = -0.0012; key.shadow.normalBias = 0.03;
  }
  escE.add(key);
  var relleno = new THREE.DirectionalLight(0xB9D2EA, 0.62); relleno.position.set(-13, 6, -11);
  escE.add(relleno);
  if(!MOVIL){
    var catch_ = new THREE.Mesh(new THREE.PlaneGeometry(44, 44),
      new THREE.ShadowMaterial({ opacity:0.34 }));
    catch_.rotation.x = -Math.PI/2; catch_.position.y = 0.004;
    catch_.receiveShadow = true; escE.add(catch_);
  }

  /* suelo de estudio que se desvanece en los bordes */
  var cs = document.createElement('canvas'); cs.width = cs.height = 128;
  var gg = cs.getContext('2d'), rg = gg.createRadialGradient(64,64,10, 64,64,64);
  rg.addColorStop(0,'#ffffff'); rg.addColorStop(0.62,'#ffffff'); rg.addColorStop(1,'#000000');
  gg.fillStyle = rg; gg.fillRect(0,0,128,128);
  var alfa = new THREE.CanvasTexture(cs);
  var suelo = new THREE.Mesh(new THREE.CircleGeometry(21, 48),
    new THREE.MeshStandardMaterial({ color:0xEFF4F9, roughness:0.94, metalness:0,
      alphaMap:alfa, transparent:true }));
  suelo.rotation.x = -Math.PI/2; suelo.position.y = 0; suelo.receiveShadow = !MOVIL;
  escE.add(suelo);

  camion = construirCamion(true, piezas);
  camion.position.y = 0;
  escE.add(camion);

  rayE = new THREE.Raycaster(); punteroE = new THREE.Vector2();
  ajustarEstudio();

  cv.addEventListener('pointerdown', function(ev){
    arrastra = true; ultX = ev.clientX; ultY = ev.clientY;
    cv.classList.add('arrastra');
    if(cv.setPointerCapture) try{ cv.setPointerCapture(ev.pointerId); }catch(e){}
  });
  var soltar = function(){ arrastra = false; cv.classList.remove('arrastra'); };
  cv.addEventListener('pointerup', soltar);
  cv.addEventListener('pointercancel', soltar);
  cv.addEventListener('pointerleave', function(){ soltar(); globo(null); });
  cv.addEventListener('pointermove', function(ev){
    if(arrastra){
      rotY += (ev.clientX - ultX) * 0.0075;
      rotX = clamp(rotX + (ev.clientY - ultY) * 0.0045, -0.10, 0.92);
      ultX = ev.clientX; ultY = ev.clientY;
      gira = false; $('v-giro').setAttribute('aria-pressed','false');
      pedirCuadro();
    }
    var r = cv.getBoundingClientRect();
    punteroE.x = ((ev.clientX - r.left)/r.width)*2 - 1;
    punteroE.y = -((ev.clientY - r.top)/r.height)*2 + 1;
    probarSobre(ev.clientX - r.left, ev.clientY - r.top);
  });
  cv.addEventListener('wheel', function(ev){
    ev.preventDefault();
    dist = clamp(dist + (ev.deltaY > 0 ? 1.6 : -1.6), 16, 46);
    pedirCuadro();
  }, { passive:false });
  cv.addEventListener('click', function(){
    if(sobre && sobre.userData.code) elegirSistema(sobre.userData.code);
  });

  var io = new IntersectionObserver(function(es){
    estudioVisible = es[0].isIntersecting;
    if(estudioVisible){ ajustarEstudio(); pedirCuadro(); }
  }, { rootMargin:'120px' });
  io.observe($('estudio'));
}
function ajustarEstudio(){
  if(!rE) return;
  var cv = $('lienzo-eq'), w = cv.clientWidth, h = cv.clientHeight;
  if(!w || !h) return;
  rE.setSize(w, h, false);
  camE.aspect = w/h; camE.updateProjectionMatrix();
}
function globo(contenido, x, y){
  var g = $('globo');
  if(!g) return;
  if(!contenido){ g.className = 'globo'; return; }
  g.innerHTML = contenido; g.className = 'globo on';
  g.style.left = x + 'px'; g.style.top = y + 'px';
}
function probarSobre(mx, my){
  if(!rayE || !camion || !estudioVisible) return;
  rayE.setFromCamera(punteroE, camE);
  var hits = rayE.intersectObjects(piezas, false);
  var h = hits.length ? hits[0].object : null;
  if(h !== sobre){
    if(sobre && sobre.material.emissive) sobre.material.emissive.setHex(0x000000);
    sobre = h;
    if(sobre && sobre.material.emissive) sobre.material.emissive.setHex(0x24344A);
    pedirCuadro();
  }
  if(sobre && sobre.userData.code){
    var e = byId[eqActual], v = 0, nm = SD[sobre.userData.code] || sobre.userData.code;
    e.sys.forEach(function(s){ if(s.c === sobre.userData.code) v = s.v; });
    globo(esc(nm) + '&nbsp;&nbsp;<b>' + (v ? 'US$ ' + fmt(v) : 'sin consumo') + '</b>', mx, my);
  } else globo(null);
}
function pintarCamion(e){
  if(!camion) return;
  var mapa = {}; sysRango(e).forEach(function(s){ mapa[s.c] = s.v; });
  var _sr = sysRango(e); var max = _sr.length ? _sr[0].v : 1;
  piezas.forEach(function(m){
    var c = m.userData.code, v = mapa[c] || 0;
    var hex = v ? hexCalorEq(v, max) : (m.userData.base || PINTURA);
    if(c === sysActual) hex = css('--hivis') || '#FCE624';
    m.material.color.set(hex);
  });
}
function renderEstudio(t){
  if(!rE) return;
  if(gira && !arrastra && !REDUCIR) rotY += 0.0026;
  camion.rotation.y = rotY;
  var ry = 2.6 + Math.sin(rotX) * dist * 0.62;
  camE.position.set(0, ry, dist * Math.cos(rotX * 0.62));
  camE.lookAt(0, 2.85, 0);
  rE.render(escE, camE);
}

/* ══════════════════════════════════════════════════════════════════
   10 · el tajo — fondo del acto I

   Lo que se quiere leer de un vistazo es EL RECORRIDO: por dónde sube el
   material desde la cara de carguío hasta la chancadora. Por eso el
   camino de acarreo es un objeto propio —cinta compactada, bermas a los
   lados, postes de señalización y una guía luminosa que corre en el
   sentido de la marcha— y no un tono apenas distinto del terreno.

   Los camiones no dan vueltas en bucle: hacen el ciclo real. Cargados
   suben por el carril interior, vacíos bajan por el exterior, paran a
   cargar abajo y a descargar arriba, y se les ve la carga en la tolva.
   ══════════════════════════════════════════════════════════════════ */
var rT, escT, camT, polvo, velos = [], tajoVivo = false, camiones = [];
var cintaLuz = null, estelaGeo = null, estelaPts = null, estela = [], estelaN = 0;
/* El camion mide 10.8 unidades de ancho y va a escala 1.5: 16.2 en pista.
   Con los carriles a 6.2 de separacion se atravesaban, asi que la pista se
   ensancha a 38 (dos carriles de 19) y la espiral se abre —C_RAMPA de 8.2 a
   11— para que entre vuelta y vuelta siga quedando banco y no se fundan. */
var R_TAJO = 188, PROF = 82, BANCO = 14.5, C_RAMPA = 11, W_RAMPA = 20;
var ANCHO_PISTA = 38, SEP_CARRIL = 9.5, ESCALA_CAM = 1.5;
var LARGO_CAM_U = 0.0095;      /* lo que ocupa un camion medido en u */

/* el contorno del tajo no es un circulo: se abre y se cierra segun el rumbo */
function radioTajo(th){
  return R_TAJO * (1 + 0.175*Math.sin(2*th + 0.7) + 0.085*Math.cos(3*th - 1.2)
                     + 0.045*Math.sin(5*th + 2.1));
}
/* rampa en espiral: distancia del punto al eje del camino, y su altura */
function rampa(r, th){
  var mejor = 1e9, hR = 0;
  for(var k=0; k<4; k++){
    var phi = th + Math.PI*2*k;
    var rr = radioTajo(phi)*0.965 - C_RAMPA*phi;
    if(rr < 30) continue;
    var d = Math.abs(r - rr);
    if(d < mejor){ mejor = d; hR = -PROF * (1 - rr/radioTajo(phi)); }
  }
  return { d:mejor, h:hR };
}
function alturaTajo(x, z){
  var r = Math.hypot(x, z);
  var th = Math.atan2(z, x); if(th < 0) th += Math.PI*2;
  var R = radioTajo(th);
  var ruido = Math.sin(x*0.048)*Math.cos(z*0.041)*3.1 + Math.sin(x*0.115 + z*0.083)*1.4;
  if(r > R) return 5 + ruido*0.9 + (r - R)*0.055;
  var t = 1 - r/R;
  var nivel = (PROF*t)/BANCO;
  var hBanco = -Math.floor(nivel)*BANCO;
  var fr = nivel - Math.floor(nivel);
  if(fr < 0.13) hBanco += Math.sin(fr/0.13*Math.PI)*0.95;      /* berma de seguridad */
  hBanco += Math.sin(th*7 + r*0.05)*0.9;                        /* el banco no es plano */
  var ram = rampa(r, th);
  if(ram.d < W_RAMPA){
    var m = 1 - Math.pow(ram.d/W_RAMPA, 2.2);
    return lerp(hBanco + ruido*0.3, ram.h + 0.9, m);
  }
  return hBanco + ruido*0.45;
}
function esRampa(x, z){
  var r = Math.hypot(x, z);
  var th = Math.atan2(z, x); if(th < 0) th += Math.PI*2;
  if(r > radioTajo(th)) return 0;
  var d = rampa(r, th).d;
  return d < W_RAMPA ? 1 - Math.pow(d/W_RAMPA, 2.2) : 0;
}

/* ---------- el camino, como curva ----------
   u crece hacia el fondo: u=U_TOP es la salida a chancadora y u=U_BOT la
   cara de carguio. Los camiones no bajan mas alla porque abajo el giro se
   cierra y el camion no cabria. */
var U_TOP = 0.045, U_BOT = 0.615, U_MAX = 0.62;
function puntoRampa(u){
  var phi = u * Math.PI*2*3.05;
  var rr = radioTajo(phi)*0.965 - C_RAMPA*phi;
  return { x: Math.cos(phi)*rr, z: Math.sin(phi)*rr,
           y: -PROF*(1 - rr/radioTajo(phi)) + 1.1 };
}
/* punto desplazado al carril: +1 exterior, -1 interior */
function puntoCarril(u, carril, alto){
  var a = puntoRampa(u), b = puntoRampa(Math.min(U_MAX, u + 0.002));
  var tx = b.x - a.x, tz = b.z - a.z;
  var L = Math.hypot(tx, tz) || 1;
  var nx = -tz/L, nz = tx/L;          /* normal horizontal al avance */
  var d = (carril || 0) * SEP_CARRIL;
  return { x: a.x + nx*d, y: a.y + (alto || 0), z: a.z + nz*d };
}

var _ade = null, _ejeX = null, _ejeY = null, _ejeZ = null, _base = null;
/* alinea el camion con la rampa: el morro del modelo apunta a -X y el vehiculo
   se inclina con la pendiente, en vez de girar sobre si mismo */
function orientarCamion(obj, a, b){
  if(!_ade){
    _ade = new THREE.Vector3(); _ejeX = new THREE.Vector3();
    _ejeY = new THREE.Vector3(); _ejeZ = new THREE.Vector3();
    _base = new THREE.Matrix4();
  }
  _ade.set(b.x - a.x, b.y - a.y, b.z - a.z);
  if(_ade.lengthSq() < 1e-9) return;
  _ade.normalize();
  _ejeX.copy(_ade).multiplyScalar(-1);
  _ejeY.set(0, 1, 0);
  _ejeY.addScaledVector(_ejeX, -_ejeY.dot(_ejeX));
  if(_ejeY.lengthSq() < 1e-9) return;
  _ejeY.normalize();
  _ejeZ.crossVectors(_ejeX, _ejeY).normalize();
  _base.makeBasis(_ejeX, _ejeY, _ejeZ);
  obj.quaternion.setFromRotationMatrix(_base);
}

/* ---------- cintas a lo largo del camino ----------
   Construye una banda siguiendo la curva: sirve para la calzada, para las
   bermas de los bordes y para la guia luminosa. */
function cintaCamino(u0, u1, pasos, ancho, offLat, alto, repite){
  var pos = [], uv = [], idx = [];
  for(var i=0; i<=pasos; i++){
    var u = u0 + (u1-u0)*i/pasos;
    var a = puntoRampa(u), b = puntoRampa(Math.min(U_MAX, u + 0.0015));
    var tx = b.x-a.x, tz = b.z-a.z, L = Math.hypot(tx,tz) || 1;
    var nx = -tz/L, nz = tx/L;
    var cx = a.x + nx*offLat, cz = a.z + nz*offLat, cy = a.y + alto;
    pos.push(cx - nx*ancho/2, cy, cz - nz*ancho/2);
    pos.push(cx + nx*ancho/2, cy, cz + nz*ancho/2);
    var v = i/pasos * (repite || 1);
    uv.push(0, v, 1, v);
    if(i < pasos){
      var k = i*2;
      idx.push(k, k+1, k+2, k+1, k+3, k+2);
    }
  }
  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/* textura de guia: trazos que corren en el sentido de la marcha */
function texGuia(){
  var c = document.createElement('canvas');
  c.width = 8; c.height = 64;
  var x = c.getContext('2d');
  x.clearRect(0,0,8,64);
  var gr = x.createLinearGradient(0,0,0,64);
  gr.addColorStop(0.00,'rgba(0,170,234,0)');
  gr.addColorStop(0.30,'rgba(0,170,234,.95)');
  gr.addColorStop(0.55,'rgba(150,225,255,1)');
  gr.addColorStop(0.80,'rgba(0,170,234,.35)');
  gr.addColorStop(1.00,'rgba(0,170,234,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 8, 40);
  var t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/* ---------- carga visible en la tolva ---------- */
function rocaTolva(){
  /* una piramide achatada lee como material colmado; una caja parecia una
     tapa apoyada encima */
  var g = new THREE.CylinderGeometry(4.6, 5.3, 1.7, 4, 1);
  g.rotateY(Math.PI/4);
  g.scale(1.05, 1, 0.78);
  var m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({
    color:new THREE.Color('#332D25'), roughness:1, metalness:0, flatShading:true }));
  m.position.set(0.7, 5.75, 0);
  return m;
}
/* baliza ambar: a la distancia a la que se ven, es lo que delata que hay
   un camion moviendose */
var _texBal = null;
function balizaCamion(){
  if(!_texBal){
    var c = document.createElement('canvas'); c.width = c.height = 32;
    var x = c.getContext('2d');
    var rg = x.createRadialGradient(16,16,0, 16,16,16);
    rg.addColorStop(0,'rgba(255,214,120,1)');
    rg.addColorStop(0.35,'rgba(255,170,40,.65)');
    rg.addColorStop(1,'rgba(255,150,0,0)');
    x.fillStyle = rg; x.fillRect(0,0,32,32);
    _texBal = new THREE.CanvasTexture(c);
  }
  var s = new THREE.Sprite(new THREE.SpriteMaterial({
    map:_texBal, transparent:true, depthWrite:false,
    blending:THREE.AdditiveBlending, opacity:0.9 }));
  s.scale.setScalar(5.6);
  s.position.set(-2.2, 8.6, 0);
  return s;
}

/* ---------- la pala hidraulica de carguio ----------
   Medidas en la misma escala que el camion: ~14 de largo por ~8 de ancho,
   que junto a un 785 da la proporcion correcta —la pala carga el camion en
   cuatro o cinco pasadas—. */
function construirPala(){
  var G = new THREE.Group();
  var AM = PINTURA_AM, AM2 = PINTURA2_AM;
  var fino = !MOVIL;
  var caja = function(w,h,d){ return new THREE.BoxGeometry(w,h,d); };
  var cil = function(r1,r2,h,s){ return new THREE.CylinderGeometry(r1,r2,h,s||(fino?14:7)); };
  var poner = function(padre, geo, hex, x,y,z, rot, rug, met){
    var m = new THREE.Mesh(geo, matMetal(hex, rug === undefined ? 0.62 : rug,
                                         met === undefined ? 0.5 : met));
    m.position.set(x,y,z);
    if(rot) m.rotation.set(rot[0]||0, rot[1]||0, rot[2]||0);
    m.castShadow = fino; m.receiveShadow = fino;
    padre.add(m);
    return m;
  };

  /* ═══ tren de rodaje ═══ */
  function carro(z){
    var g = new THREE.Group();
    var sh = new THREE.Shape();
    sh.absarc(-6.0, 0, 1.55, Math.PI/2, Math.PI*1.5, false);
    sh.absarc( 6.0, 0, 1.55, Math.PI*1.5, Math.PI/2, false);
    sh.closePath();
    var ge = new THREE.ExtrudeGeometry(sh, { depth:2.05, bevelEnabled:false });
    ge.translate(0, 0, -1.02);
    poner(g, ge, '#23282E', 0, 0, 0, null, 0.95, 0.25);
    /* motriz y tensora, que es lo que da la silueta de oruga */
    poner(g, cil(1.15,1.15,2.15,fino?16:8), ACERO2, -6.0, 0, 0, [Math.PI/2,0,0], 0.7, 0.55);
    poner(g, cil(1.15,1.15,2.15,fino?16:8), ACERO2,  6.0, 0, 0, [Math.PI/2,0,0], 0.7, 0.55);
    if(fino){
      for(var i=0; i<5; i++){
        poner(g, cil(0.55,0.55,2.2,10), ACERO, -4.0 + i*2.0, -0.95, 0, [Math.PI/2,0,0], 0.72, 0.5);
      }
      /* zapatas: solo la corrida de abajo, que es la que se ve */
      for(var s=0; s<13; s++){
        poner(g, caja(0.78, 0.30, 2.35), '#31373E', -5.9 + s*0.98, -1.58, 0, null, 0.95, 0.2);
        poner(g, caja(0.16, 0.34, 2.35), ACERO, -5.9 + s*0.98, -1.86, 0, null, 0.9, 0.3);
      }
    }
    g.position.set(0, 1.7, z);
    G.add(g);
    return g;
  }
  carro(-3.15); carro(3.15);
  /* bastidor en X que une los dos carros */
  poner(G, caja(5.2, 1.5, 7.0), ACERO2, 0, 2.0, 0, null, 0.72, 0.55);
  poner(G, cil(2.5, 2.5, 1.1, fino?20:8), ACERO, 0, 3.0, 0, null, 0.6, 0.65);

  /* ═══ la parte que gira ═══ */
  var giro = new THREE.Group();
  giro.position.set(0, 3.5, 0);
  G.add(giro);

  poner(giro, caja(12.4, 0.5, 7.4), ACERO2, -0.3, 0.2, 0, null, 0.72, 0.5);
  /* contrapeso: el volumen macizo de atras, sin el no lee como pala */
  poner(giro, caja(3.5, 3.2, 7.2), AM2, 4.9, 1.9, 0, null, 0.6, 0.2);
  poner(giro, caja(0.5, 3.4, 7.4), ACERO, 6.6, 1.9, 0, null, 0.7, 0.55);
  /* capot del motor */
  poner(giro, caja(5.6, 2.7, 6.9), AM, 1.6, 1.85, 0, null, 0.52, 0.16);
  poner(giro, caja(5.7, 0.3, 7.0), AM2, 1.6, 3.3, 0, null, 0.55, 0.18);
  /* frente donde se anclan pluma y cilindros */
  poner(giro, caja(3.0, 2.3, 3.4), AM, -3.4, 1.6, 0, null, 0.52, 0.16);
  if(fino){
    [1.1, 2.3].forEach(function(dx){
      poner(giro, cil(0.26,0.26,1.7,10), ACERO, dx, 4.1, -2.1, null, 0.6, 0.7);
    });
    /* barandas de la plataforma */
    [-3.5, 3.5].forEach(function(z){
      poner(giro, cil(0.07,0.07,11.0,6), ACERO, 0, 1.3, z, [0,0,Math.PI/2], 0.6, 0.7);
      [-2.2, 1.2, 4.4].forEach(function(x){
        poner(giro, cil(0.07,0.07,1.2,6), ACERO, x, 0.85, z, null, 0.6, 0.7);
      });
    });
  }
  /* cabina adelante a la izquierda, elevada */
  poner(giro, caja(2.9, 3.0, 2.7), AM, -3.9, 2.1, -2.5, null, 0.5, 0.14);
  poner(giro, caja(3.0, 0.3, 2.8), AM2, -3.9, 3.75, -2.5, null, 0.55, 0.16);
  var vid = new THREE.MeshStandardMaterial({ color:new THREE.Color(VIDRIO),
    roughness:0.06, metalness:0.2, transparent:true, opacity:0.42 });
  var vf = new THREE.Mesh(caja(0.12, 2.1, 2.1), vid);
  vf.position.set(-5.38, 2.25, -2.5); giro.add(vf);
  if(fino){
    var vl = new THREE.Mesh(caja(2.3, 1.9, 0.12), vid.clone());
    vl.position.set(-3.9, 2.3, -3.88); giro.add(vl);
    /* proteccion de rocas delante del vidrio */
    for(var b2=0; b2<4; b2++){
      poner(giro, cil(0.08,0.08,2.2,6), ACERO, -5.5, 1.3 + b2*0.62, -2.5, [Math.PI/2,0,0], 0.6, 0.7);
    }
  }

  /* ═══ pluma ═══
     El contrapeso esta en +X, asi que el frente es -X. La pluma se
     construye comoda hacia +X y se cuelga de una base girada media vuelta,
     que es lo que la manda hacia adelante. Con eso, dentro de la pluma un
     giro positivo en Z la LEVANTA. */
  var plumaBase = new THREE.Group();
  plumaBase.position.set(-4.3, 1.4, 0);
  plumaBase.rotation.y = Math.PI;
  giro.add(plumaBase);
  var pluma = new THREE.Group();
  plumaBase.add(pluma);
  var vigaPluma = function(z){
    poner(pluma, caja(7.0, 1.9, 0.9), AM, 3.5, 0, z, null, 0.55, 0.18);
    poner(pluma, caja(7.0, 0.26, 1.0), AM2, 3.5, 0.92, z, null, 0.58, 0.2);
  };
  vigaPluma(-1.4); vigaPluma(1.4);
  poner(pluma, caja(6.2, 1.1, 2.0), AM2, 3.5, 0, 0, null, 0.6, 0.2);
  poner(pluma, cil(0.72,0.72,3.5,fino?14:7), ACERO, 0, 0, 0, [Math.PI/2,0,0], 0.7, 0.6);
  poner(pluma, cil(0.6,0.6,3.3,fino?14:7), ACERO, 7.0, 0, 0, [Math.PI/2,0,0], 0.7, 0.6);

  /* ═══ brazo, colgado de la punta de la pluma ═══ */
  var brazo = new THREE.Group();
  brazo.position.set(7.0, 0, 0);
  pluma.add(brazo);
  poner(brazo, caja(4.4, 1.55, 2.4), AM, 2.2, 0, 0, null, 0.55, 0.18);
  poner(brazo, caja(4.4, 0.24, 2.5), AM2, 2.2, 0.78, 0, null, 0.58, 0.2);
  poner(brazo, cil(0.5,0.5,2.7,fino?12:6), ACERO, 4.4, 0, 0, [Math.PI/2,0,0], 0.7, 0.6);

  /* ═══ cuchara frontal con dientes ═══ */
  var cuchara = new THREE.Group();
  cuchara.position.set(4.4, 0, 0);
  brazo.add(cuchara);
  poner(cuchara, caja(3.3, 3.4, 4.3), AM2, 1.5, -0.9, 0, null, 0.62, 0.22);
  poner(cuchara, caja(0.4, 3.5, 4.4), ACERO2, -0.1, -0.9, 0, null, 0.7, 0.5);
  poner(cuchara, caja(3.4, 0.45, 4.4), ACERO2, 1.5, -2.55, 0, null, 0.7, 0.5);
  if(fino){
    [-1.9, -0.65, 0.65, 1.9].forEach(function(z){
      poner(cuchara, caja(0.2, 3.2, 0.2), ACERO, 3.15, -0.9, z, null, 0.7, 0.5);
    });
  }
  /* los dientes, que es lo que identifica una pala de lejos */
  for(var d=0; d<6; d++){
    var zz = -1.75 + d*0.7;
    poner(cuchara, cil(0.3, 0.09, 1.1, fino?8:5), '#6E7782', 3.55, -2.4, zz,
          [0,0,Math.PI/2 + 0.12], 0.55, 0.75);
  }

  /* ═══ cilindros: barril de acero y vastago cromado ═══ */
  function cilindro(padre, x0,y0, x1,y1, r, z){
    var dx = x1-x0, dy = y1-y0, L = Math.hypot(dx,dy), a = Math.atan2(dy,dx);
    var bar = poner(padre, cil(r, r, L*0.62, fino?12:6), ACERO2,
                    x0 + dx*0.31, y0 + dy*0.31, z, [0,0,a - Math.PI/2], 0.5, 0.72);
    var vas = poner(padre, cil(r*0.55, r*0.55, L*0.55, fino?12:6), CROMO,
                    x0 + dx*0.72, y0 + dy*0.72, z, [0,0,a - Math.PI/2], 0.16, 0.96);
    return [bar, vas];
  }
  /* los dos de pluma van del frente de la superestructura a media pluma */
  [-1.9, 1.9].forEach(function(z){
    cilindro(giro, 2.6, 0.6, -1.9, 2.4, 0.42, z);
  });
  cilindro(pluma, 1.0, 1.2, 6.2, 1.0, 0.40, 0);      /* el del brazo */
  cilindro(brazo, 0.7, 1.0, 3.9, 0.6, 0.34, 0);      /* el de la cuchara */

  G.userData.giro = giro;
  G.userData.pluma = pluma;
  G.userData.brazo = brazo;
  G.userData.cuchara = cuchara;
  return G;
}

/* Un ciclo de carguio en cuatro tiempos. Los angulos son los de una pala
   frontal trabajando contra el banco: excava abajo y adelante, gira unos
   cien grados hasta el camion y descarga alto. */
var _pala = null, _palaT = 0, _palaCiclo = 0;
function pasoPala(dt){
  if(!_pala) return;
  var u = _pala.userData;
  if(dt > 0) _palaT += dt;
  var DUR = 9200;                       /* un ciclo completo */
  var f = (_palaT % DUR) / DUR;
  var ciclo = Math.floor(_palaT / DUR);
  var sua = function(a){ return a*a*(3-2*a); };
  var gir, plu, bra, cuc;

  /* signo: en Z positivo LEVANTA, tanto la pluma como el brazo y la
     cuchara, porque los tres cuelgan de la base girada media vuelta */
  if(f < 0.30){                         /* excava: baja, entra y recoge */
    var k = sua(f/0.30);
    gir = -0.85;
    plu = 0.02 - 0.20*k;
    bra = -0.85 + 0.50*k;
    cuc = -0.60 + 1.10*k;
  } else if(f < 0.54){                  /* levanta y gira hacia el camion */
    var k2 = sua((f-0.30)/0.24);
    gir = -0.85 + 1.70*k2;
    plu = -0.18 + 0.96*k2;
    bra = -0.35 + 0.62*k2;
    cuc = 0.50;
  } else if(f < 0.70){                  /* vuelca sobre la tolva */
    var k3 = sua((f-0.54)/0.16);
    gir = 0.85;
    plu = 0.78;
    bra = 0.27;
    cuc = 0.50 - 1.50*k3;
  } else {                              /* vuelve vacia al banco */
    var k4 = sua((f-0.70)/0.30);
    gir = 0.85 - 1.70*k4;
    plu = 0.78 - 0.76*k4;
    bra = 0.27 - 1.12*k4;
    cuc = -1.00 + 0.40*k4;
  }
  u.giro.rotation.y = gir;
  u.pluma.rotation.z = plu;
  u.brazo.rotation.z = bra;
  u.cuchara.rotation.z = cuc;

  /* al vaciar la cuchara, el monton del camion que espera abajo crece */
  if(dt > 0 && ciclo !== _palaCiclo && f >= 0.52 && f < 0.68){
    _palaCiclo = ciclo;
    for(var i=0; i<camiones.length; i++){
      var c = camiones[i];
      if(c.estado === 'carga'){ c.pases = Math.min(4, (c.pases||0) + 1); break; }
    }
  }
}

function iniciarTajo(){
  if(!$('lienzo-tajo')) return;
  var cv = $('lienzo-tajo');
  rT = new THREE.WebGLRenderer({ canvas:cv, antialias:!MOVIL, alpha:true, powerPreference:'high-performance' });
  rT.setPixelRatio(Math.min(window.devicePixelRatio || 1, MOVIL ? 1.25 : 1.75));
  rT.outputEncoding = THREE.sRGBEncoding;
  rT.toneMapping = THREE.ACESFilmicToneMapping;
  rT.toneMappingExposure = 0.94;

  escT = new THREE.Scene();
  escT.fog = new THREE.FogExp2(0x14384E, 0.0016);
  camT = new THREE.PerspectiveCamera(44, 1.6, 1, 1100);

  var N = MOVIL ? 112 : 208, LADO = 460;
  var g = new THREE.PlaneGeometry(LADO, LADO, N, N);
  g.rotateX(-Math.PI/2);
  var pos = g.attributes.position, col = new Float32Array(pos.count*3);
  var cHondo = new THREE.Color('#0B1620');   /* fondo del tajo, en sombra   */
  var cPiso  = new THREE.Color('#544E3E');   /* piso de banco, polvo seco   */
  var cCara  = new THREE.Color('#1C242C');   /* cara de banco, roca         */
  var cCam   = new THREE.Color('#9A907A');   /* camino de acarreo compactado*/
  var tmp = new THREE.Color();
  var dd = LADO/N;
  for(var i=0; i<pos.count; i++){
    var x = pos.getX(i), z = pos.getZ(i);
    var y = alturaTajo(x, z);
    pos.setY(i, y);
    var hx = (alturaTajo(x+dd,z) - alturaTajo(x-dd,z)) / (2*dd);
    var hz = (alturaTajo(x,z+dd) - alturaTajo(x,z-dd)) / (2*dd);
    var pend = Math.min(1, Math.hypot(hx,hz) * 0.78);
    var f = clamp((y + PROF) / (PROF + 12), 0, 1);
    tmp.copy(cHondo).lerp(cPiso, Math.pow(f, 0.72));
    tmp.lerp(cCara, pend);
    var rp = esRampa(x, z);
    if(rp > 0.18) tmp.lerp(cCam, Math.min(1,(rp - 0.18)*1.6) * (1 - pend*0.55));
    var vn = 0.9 + ((Math.sin(x*0.83)*Math.cos(z*0.71) + 1)/2) * 0.2;
    col[i*3] = tmp.r*vn; col[i*3+1] = tmp.g*vn; col[i*3+2] = tmp.b*vn;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.computeVertexNormals();
  var terreno = new THREE.Mesh(g, new THREE.MeshStandardMaterial({
    vertexColors:true, flatShading:true, roughness:0.99, metalness:0.0 }));
  escT.add(terreno);

  /* ═══ el camino de acarreo, como objeto propio ═══ */
  var PAS = MOVIL ? 150 : 300;
  var calzada = new THREE.Mesh(
    cintaCamino(U_TOP - 0.02, U_BOT + 0.02, PAS, ANCHO_PISTA, 0, 1.35, 1),
    new THREE.MeshStandardMaterial({ color:new THREE.Color('#A2977E'),
      roughness:0.98, metalness:0.0 }));
  escT.add(calzada);

  /* bermas: el cordon de seguridad del borde exterior y el pie del talud */
  var matBerma = new THREE.MeshStandardMaterial({ color:new THREE.Color('#6E6552'),
    roughness:1, metalness:0, flatShading:true });
  escT.add(new THREE.Mesh(
    cintaCamino(U_TOP - 0.02, U_BOT + 0.02, PAS, 3.4, ANCHO_PISTA/2 - 0.6, 2.8, 1), matBerma));
  escT.add(new THREE.Mesh(
    cintaCamino(U_TOP - 0.02, U_BOT + 0.02, PAS, 2.6, -ANCHO_PISTA/2 + 0.5, 2.3, 1), matBerma));

  /* la guia luminosa: corre hacia arriba, en el sentido en que sube el
     material. Es lo que hace legible el recorrido de un vistazo. */
  var texG = texGuia();
  texG.repeat.set(1, 26);
  cintaLuz = new THREE.Mesh(
    cintaCamino(U_TOP, U_BOT, PAS, 3.0, 0, 1.75, 26),
    new THREE.MeshBasicMaterial({ map:texG, transparent:true, depthWrite:false,
      blending:THREE.AdditiveBlending, opacity:0.85 }));
  escT.add(cintaLuz);

  /* postes de señalizacion en el borde exterior */
  if(!MOVIL){
    var nP = 54;
    var gPo = new THREE.CylinderGeometry(0.26, 0.26, 3.4, 5);
    var iPo = new THREE.InstancedMesh(gPo, new THREE.MeshStandardMaterial({
      color:new THREE.Color('#D8CDB6'), roughness:0.9, emissive:new THREE.Color('#2A2415'),
      emissiveIntensity:0.6 }), nP);
    var mm = new THREE.Matrix4();
    for(var q=0; q<nP; q++){
      var u = U_TOP + (U_BOT-U_TOP)*q/(nP-1);
      var pt = puntoCarril(u, (ANCHO_PISTA/2 - 1.6)/SEP_CARRIL, 2.9);
      mm.makeTranslation(pt.x, pt.y, pt.z);
      iPo.setMatrixAt(q, mm);
    }
    iPo.instanceMatrix.needsUpdate = true;
    escT.add(iPo);
  }

  /* ═══ los dos extremos del ciclo, para que el recorrido tenga sentido ═══ */
  var matObra = new THREE.MeshStandardMaterial({ color:new THREE.Color('#3A4450'),
    roughness:0.85, metalness:0.15, flatShading:true });
  /* Se apoyan en el terreno, no en la altura del eje del camino: al lado
     de la calzada el banco esta a otra cota y quedaban flotando. */
  function enSuelo(obj, x, z, hundir){
    obj.position.set(x, alturaTajo(x, z) - (hundir || 0), z);
    escT.add(obj);
  }
  /* arriba: tolva de chancado, junto a la salida del camino */
  var pTop = puntoRampa(U_TOP);
  var chanc = new THREE.Group();
  var tolva = new THREE.Mesh(new THREE.CylinderGeometry(6.6, 3.4, 7, 8), matObra);
  tolva.position.y = 5.2; chanc.add(tolva);
  var pata = new THREE.Mesh(new THREE.BoxGeometry(12, 1.6, 12), matObra);
  pata.position.y = 0.8; chanc.add(pata);
  enSuelo(chanc, pTop.x - 17, pTop.z - 13, 0.8);
  /* abajo: pila de material y la pala que carga */
  var pBot = puntoRampa(U_BOT);
  var pila = new THREE.Mesh(new THREE.ConeGeometry(13, 9, 7),
    new THREE.MeshStandardMaterial({ color:new THREE.Color('#38322A'),
      roughness:1, metalness:0, flatShading:true }));
  pila.geometry.translate(0, 4.5, 0);
  enSuelo(pila, pBot.x - 19, pBot.z - 12, 1.2);
  var pala = construirPala();
  pala.scale.setScalar(1.45);
  /* mirando al camino, que es hacia donde descarga */
  pala.rotation.y = Math.atan2(pBot.z, pBot.x) + Math.PI/2;
  enSuelo(pala, pBot.x - 13, pBot.z - 9, 0.4);
  _pala = pala;
  pasoPala(0);
  /* Luz de faena sobre la cara de carguio. El fondo del tajo esta en
     sombra —es lo que le da profundidad— y ahi la pala no se veia. En una
     operacion de verdad la cara de carguio va iluminada, asi que la luz
     cuenta algo ademas de resolver el problema: es donde nace el material. */
  var faena = new THREE.PointLight(0xFFD9A0, 2.6, 165, 1.6);
  faena.position.set(pala.position.x - 6, pala.position.y + 34, pala.position.z + 8);
  escT.add(faena);
  var rebote = new THREE.PointLight(0xBFD8F0, 0.9, 120, 1.8);
  rebote.position.set(pala.position.x + 22, pala.position.y + 14, pala.position.z - 18);
  escT.add(rebote);

  escT.add(new THREE.HemisphereLight(0x3F76A4, 0x080F16, 0.40));
  var sol = new THREE.DirectionalLight(0xFFBE7C, 1.95);
  sol.position.set(300, 74, -70); escT.add(sol);
  var contra = new THREE.DirectionalLight(0x2E6E9E, 0.5);
  contra.position.set(-140, 60, 150); escT.add(contra);

  /* polvo: nada de bokeh. Particulas finas bajas + dos velos de polvo
     tendidos sobre el fondo del tajo, que es donde el polvo se queda. */
  var NP = MOVIL ? 130 : 320;
  var gp = new THREE.BufferGeometry(), pp = new Float32Array(NP*3);
  for(var j=0; j<NP; j++){
    var a2 = Math.random()*Math.PI*2, rr = 20 + Math.random()*160;
    pp[j*3] = Math.cos(a2)*rr;
    pp[j*3+1] = -PROF*0.92 + Math.random()*PROF*0.8;
    pp[j*3+2] = Math.sin(a2)*rr;
  }
  gp.setAttribute('position', new THREE.BufferAttribute(pp, 3));
  var cp = document.createElement('canvas'); cp.width = cp.height = 32;
  var gc = cp.getContext('2d'), rgp = gc.createRadialGradient(16,16,0, 16,16,16);
  rgp.addColorStop(0,'rgba(214,196,168,.8)'); rgp.addColorStop(1,'rgba(214,196,168,0)');
  gc.fillStyle = rgp; gc.fillRect(0,0,32,32);
  var texPolvo = new THREE.CanvasTexture(cp);
  polvo = new THREE.Points(gp, new THREE.PointsMaterial({
    size: 1.5, map:texPolvo, transparent:true, opacity:0.20,
    depthWrite:false, blending:THREE.AdditiveBlending, sizeAttenuation:true }));
  escT.add(polvo);

  velos = [];
  for(var vi=0; vi<3; vi++){
    var vel = new THREE.Mesh(new THREE.PlaneGeometry(230, 230),
      new THREE.MeshBasicMaterial({ map:texPolvo, transparent:true,
        opacity:0.055 + vi*0.02, depthWrite:false, blending:THREE.AdditiveBlending,
        color:new THREE.Color('#C9B79A') }));
    vel.rotation.x = -Math.PI/2;
    vel.position.set(0, -PROF*0.86 + vi*14, 0);
    escT.add(vel); velos.push(vel);
  }

  /* estela de polvo detras de cada camion: un solo Points reciclado */
  estelaN = MOVIL ? 40 : 110;
  estela = [];
  var ep = new Float32Array(estelaN*3), et = new Float32Array(estelaN);
  for(var s2=0; s2<estelaN; s2++){
    estela.push({ x:0, y:-9999, z:0, v:0 });
    ep[s2*3+1] = -9999;
  }
  estelaGeo = new THREE.BufferGeometry();
  estelaGeo.setAttribute('position', new THREE.BufferAttribute(ep, 3));
  estelaGeo.setAttribute('vida', new THREE.BufferAttribute(et, 1));
  estelaPts = new THREE.Points(estelaGeo, new THREE.PointsMaterial({
    size: 13, map:texPolvo, transparent:true, opacity:0.5,
    depthWrite:false, blending:THREE.NormalBlending, sizeAttenuation:true,
    color:new THREE.Color('#D3C3A8') }));
  escT.add(estelaPts);

  /* ═══ camiones haciendo el ciclo ═══
     Las marcas no se inventan: se toman los equipos de acarreo de mayor
     costo, uno por modelo, para que la mezcla de amarillos y verdes del
     tajo sea la de la flota de verdad. */
  var nC = MOVIL ? 3 : 5;
  var marcasTajo = [], vistosMod = {};
  (typeof EQ !== 'undefined' ? EQ : []).forEach(function(e){
    if(e.fam !== 'ACARREO' || marcasTajo.length >= nC) return;
    var k = e.mod || e.id;
    if(vistosMod[k]) return;
    vistosMod[k] = 1;
    marcasTajo.push(e.marca || '');
  });
  while(marcasTajo.length < nC) marcasTajo.push(marcasTajo.length % 2 ? '' : 'CATERPILLAR');

  camiones = [];
  for(var c2=0; c2<nC; c2++){
    /* en escritorio se usa el modelo detallado: con la camara a esta
       distancia el de volumenes se veia de juguete */
    var m = construirCamion(!MOVIL, null);
    pintarCarroceria(m, esMarcaAmarilla(marcasTajo[c2]));
    m.scale.setScalar(ESCALA_CAM);
    var roca = rocaTolva();
    /* de la tolva, no del camion: al bascular tiene que subir con ella */
    if(m.userData.tolvaG){
      roca.position.sub(m.userData.pivTolva);
      m.userData.tolvaG.add(roca);
    } else m.add(roca);
    var bal = balizaCamion(); m.add(bal);
    escT.add(m);
    /* la mitad sube cargada y la otra baja vacia, repartidas por la rampa */
    var sube = c2 % 2 === 0;
    camiones.push({
      obj: m, roca: roca, baliza: bal,
      tolva: m.userData.tolvaG || null,
      ruedas: m.userData.ruedas || [],
      u: U_TOP + (U_BOT-U_TOP) * ((c2 + 0.5)/nC),
      dir: sube ? -1 : 1, cargado: sube,
      estado: 'viaja', espera: 0, basc: 0, pases: sube ? 4 : 0,
      vel: 0.000015 + Math.random()*0.000004
    });
    roca.visible = sube;
  }
  ajustarTajo();
}

function ajustarTajo(){
  if(!rT) return;
  var w = window.innerWidth, h = window.innerHeight;
  rT.setSize(w, h, false);
  var asp = w/h;
  camT.aspect = asp;
  /* fijamos el campo horizontal: en vertical el tajo no se convierte en una rendija */
  var hFov = 60 * Math.PI/180;
  var v = 2*Math.atan(Math.tan(hFov/2)/asp) * 180/Math.PI;
  camT.fov = clamp(v, 42, 58);   /* en vertical se recorta, no se aleja */
  camT.updateProjectionMatrix();
}

/* ---------- el ciclo de acarreo ---------- */
function pasoCamiones(dt){
  for(var i=0; i<camiones.length; i++){
    var c = camiones[i];

    if(dt <= 0){
      /* sin movimiento: solo se coloca donde esta */
    } else if(c.estado !== 'viaja'){
      c.espera -= dt;
      if(c.espera <= 0){
        if(c.estado === 'carga'){ c.cargado = true; c.dir = -1; c.pases = 4; }
        else { c.cargado = false; c.dir = 1; c.pases = 0; }
        c.roca.visible = c.cargado;
        c.estado = 'viaja';
      }
    } else {
      /* cargado y cuesta arriba se avanza mas despacio: es lo que hace que
         la fila de subida se vea distinta de la de bajada */
      var f = c.dir < 0 ? (c.cargado ? 0.62 : 0.8) : 1.18;
      /* y no se le entra encima al de delante: en el mismo carril se
         levanta el pie hasta recuperar la distancia de seguridad */
      f *= frenoPorDelantero(c, i);
      c.u += c.dir * c.vel * f * dt;
      if(c.u <= U_TOP){
        c.u = U_TOP; c.estado = 'descarga';
        c.espera = c.total = 3400 + Math.random()*900;
      } else if(c.u >= U_BOT){
        c.u = U_BOT; c.estado = 'carga'; c.pases = 0;
        c.espera = c.total = 4200 + Math.random()*1200;
      }
    }

    /* ── la tolva bascula en la descarga ──
       Sube durante el primer tercio de la parada, se mantiene arriba
       mientras cae el material y baja al final. */
    var quiere = 0;
    if(c.estado === 'descarga' && c.total){
      var av = 1 - c.espera/c.total;
      quiere = av < 0.34 ? (av/0.34) : (av < 0.72 ? 1 : (1 - (av-0.72)/0.28));
      quiere = clamp(quiere, 0, 1);
    }
    c.basc += (quiere - c.basc) * (dt > 0 ? Math.min(1, dt*0.004) : 1);
    if(c.tolva) c.tolva.rotation.z = -c.basc * 0.82;
    /* el material se vacia cuando la tolva pasa de media */
    if(c.estado === 'descarga') c.roca.visible = c.basc < 0.55;

    /* ── el monton crece con cada pasada de la pala ── */
    if(c.estado === 'carga'){
      c.roca.visible = (c.pases || 0) > 0;
      var esc = 0.42 + 0.58 * Math.min(1, (c.pases || 0)/4);
      c.roca.scale.setScalar(esc);
    } else if(c.estado === 'viaja' && c.cargado){
      c.roca.scale.setScalar(1);
    }

    var carril = c.dir < 0 ? -1 : 1;       /* sube por dentro, baja por fuera */
    var a = puntoCarril(c.u, carril, 0);
    var b = puntoCarril(clamp(c.u + c.dir*0.0022, U_TOP, U_BOT), carril, 0);
    c.obj.position.set(a.x, a.y, a.z);
    if(c.dir < 0) orientarCamion(c.obj, b, a); else orientarCamion(c.obj, a, b);

    /* ── las ruedas giran con lo que se avanza ──
       Se mide el avance REAL del camion entre cuadros en vez de convertir
       u a metros con una constante: la rampa es una espiral y esa constante
       habria que reajustarla cada vez que cambie el tajo. Medido asi, la
       llanta rueda lo que rueda el suelo y no patina. */
    if(dt > 0 && c.ruedas && c.ruedas.length){
      if(!c._pPrev) c._pPrev = c.obj.position.clone();
      var avance = c.obj.position.distanceTo(c._pPrev);
      c._pPrev.copy(c.obj.position);
      if(avance > 0){
        var w = avance / (1.63 * ESCALA_CAM) * (c.dir < 0 ? 1 : -1);
        for(var rr=0; rr<c.ruedas.length; rr++) c.ruedas[rr].rotation.z -= w;
      }
    }

    if(dt > 0){
      /* la baliza late; en la parada late mas rapido */
      var per = c.estado === 'viaja' ? 900 : 420;
      c.baliza.material.opacity = 0.35 + 0.55*Math.abs(Math.sin(performance.now()/per));
      /* polvo detras de las ruedas, solo si va rodando */
      if(c.estado === 'viaja' && Math.random() < 0.34) soltarPolvo(a);
      if(c.estado === 'descarga' && Math.random() < 0.5) soltarPolvo(a);
    } else {
      c.baliza.material.opacity = 0.7;
    }
  }
}

/* Cuanto hay que levantar el pie por el camion de delante: 0 pegado,
   1 con la via libre. Solo cuentan los que van en el mismo sentido. */
function frenoPorDelantero(c, idx){
  var cerca = 1e9;
  for(var k=0; k<camiones.length; k++){
    if(k === idx) continue;
    var o = camiones[k];
    if(o.dir !== c.dir) continue;
    var gap = c.dir < 0 ? (c.u - o.u) : (o.u - c.u);
    if(gap > 0 && gap < cerca) cerca = gap;
  }
  var seg = LARGO_CAM_U * 1.9;
  if(cerca >= seg) return 1;
  if(cerca <= LARGO_CAM_U) return 0;
  return (cerca - LARGO_CAM_U) / (seg - LARGO_CAM_U);
}

var _iEstela = 0;
function soltarPolvo(p){
  if(!estelaGeo) return;
  var s = estela[_iEstela];
  s.x = p.x + (Math.random()-0.5)*3;
  s.y = p.y + 0.6;
  s.z = p.z + (Math.random()-0.5)*3;
  s.v = 1;
  _iEstela = (_iEstela + 1) % estelaN;
}
function pasoEstela(dt){
  if(!estelaGeo) return;
  var pos = estelaGeo.attributes.position.array;
  for(var i=0; i<estelaN; i++){
    var s = estela[i];
    if(s.v <= 0){ pos[i*3+1] = -9999; continue; }
    s.v -= dt * 0.00042;
    s.y += dt * 0.004;                 /* el polvo sube y se abre */
    s.x += dt * 0.0004;
    pos[i*3] = s.x; pos[i*3+1] = s.y; pos[i*3+2] = s.z;
  }
  estelaGeo.attributes.position.needsUpdate = true;
}

var _tPrev = 0;
function renderTajo(t, p){
  if(!rT) return;
  var dt = Math.min(64, t - _tPrev || 16); _tPrev = t;

  /* la camara orbita muy despacio: en un fondo fijo la espiral no se lee,
     y girando se entiende que el camino sube dando vueltas */
  /* Vista aerea desde fuera del borde: metida dentro del tajo la espiral
     no se distingue de un talud cualquiera. El parametro p acerca un poco,
     pero nunca tanto como para perder el conjunto. */
  var e = p*p*(3-2*p);
  var giro = REDUCIR ? 0.9 : 0.9 + t*0.0000125;
  var radio = MOVIL ? lerp(345, 285, e) : lerp(360, 292, e);
  var altura = lerp(168, 128, e);
  var resp = REDUCIR ? 0 : Math.sin(t*0.00009)*7;
  camT.position.set(Math.cos(giro)*radio, altura + resp, Math.sin(giro)*radio);
  camT.lookAt(0, -34, 0);

  pasoCamiones(REDUCIR ? 0 : dt);
  pasoPala(REDUCIR ? 0 : dt);
  if(!REDUCIR){
    pasoEstela(dt);
    /* la guia corre hacia arriba: el sentido en que sube el material */
    if(cintaLuz && cintaLuz.material.map){
      cintaLuz.material.map.offset.y = (t*0.00013) % 1;
      cintaLuz.material.opacity = 0.62 + 0.26*Math.sin(t*0.0007);
    }
    if(polvo) polvo.rotation.y = t*0.000010;
    for(var vv=0; vv<velos.length; vv++) velos[vv].rotation.z = t*0.0000065*(vv+1);
  }
  rT.render(escT, camT);
}

/* ══════════════════════════════════════════════════════════════════
   11 · esquema 2D (alterna y respaldo sin WebGL)
   ══════════════════════════════════════════════════════════════════ */
var ZONAS = [
  {c:'TLV',  l:'TOLVA',        x:230, y:16,  w:640, h:98, f:'tolva'},
  {c:'AAC',  l:'A/A',          x:104, y:56,  w:104, h:20},
  {c:'CBN',  l:'CABINA',       x:104, y:80,  w:104, h:52},
  {c:'LSM',  l:'LUCES',        x:34,  y:80,  w:64,  h:52},
  {c:'MFC1', l:'VENTIL.',      x:34,  y:138, w:64,  h:22},
  {c:'TLH1', l:'TURBO',        x:104, y:138, w:64,  h:22},
  {c:'CMP',  l:'COMPR.',       x:174, y:138, w:64,  h:22},
  {c:'RAD1', l:'RAD.',         x:34,  y:166, w:42,  h:76},
  {c:'ENG1', l:'MOTOR',        x:82,  y:166, w:156, h:76},
  {c:'TQH1', l:'TQ. HIDR.',    x:246, y:124, w:104, h:52},
  {c:'TQC1', l:'TQ. COMB.',    x:356, y:124, w:104, h:52},
  {c:'SEN',  l:'ENGRASE',      x:466, y:124, w:86,  h:52},
  {c:'LPH',  l:'MANGUERAS',    x:558, y:124, w:124, h:52},
  {c:'BAT',  l:'BATERÍA',      x:688, y:124, w:70,  h:52},
  {c:'SCI',  l:'C. INCENDIO',  x:764, y:124, w:106, h:52},
  {c:'SDI',  l:'SUSP. DEL.',   x:246, y:184, w:78,  h:58},
  {c:'CON',  l:'CONVERT.',     x:330, y:184, w:70,  h:58},
  {c:'TRM',  l:'TRANSMISIÓN',  x:406, y:184, w:116, h:58},
  {c:'CAR',  l:'CARDÁN',       x:528, y:184, w:70,  h:58},
  {c:'DIFP', l:'DIFERENCIAL',  x:604, y:184, w:96,  h:58},
  {c:'MLH',  l:'M. FINAL LH',  x:706, y:184, w:82,  h:28},
  {c:'MRH',  l:'M. FINAL RH',  x:706, y:214, w:82,  h:28},
  {c:'SPI',  l:'SUSP. POST.',  x:794, y:184, w:76,  h:58}
];
function pintarEsquema(e){
  if(!$('esquema')) return;
  var mapa = {}; sysRango(e).forEach(function(s){ mapa[s.c] = s.v; });
  var _sr = sysRango(e); var max = _sr.length ? _sr[0].v : 1;
  var svg = '<svg viewBox="0 0 900 282" role="img" aria-label="Esquema del equipo con el costo por sistema">';
  if(e.fam === 'ACARREO'){
    svg += '<rect x="30" y="250" width="846" height="14" fill="#EEF2F6" stroke="#CBD6E1"></rect>';
    ZONAS.forEach(function(z){
      var v = mapa[z.c] || 0, f = varCalorEq(v, max), act = (sysActual === z.c ? ' act' : '');
      var claro = nivelCalor(v,max) >= 3 ? '#FFFFFF' : '#08192A';
      if(z.f === 'tolva'){
        /* visera hacia la cabina (izquierda) y caja que baja hacia la cola */
        svg += '<g class="zona' + act + '" data-c="' + z.c + '" tabindex="0" role="button">'
          + '<path data-f d="M' + (z.x-80) + ' ' + (z.y+6)
          + ' L' + (z.x+z.w) + ' ' + (z.y+30)
          + ' L' + (z.x+z.w) + ' ' + (z.y+z.h)
          + ' L' + z.x + ' ' + (z.y+z.h)
          + ' L' + z.x + ' ' + (z.y+34)
          + ' L' + (z.x-80) + ' ' + (z.y+34)
          + ' Z" fill="' + f + '" stroke="#7389A0"></path>';
      } else {
        svg += '<g class="zona' + act + '" data-c="' + z.c + '" tabindex="0" role="button">'
          + '<rect data-f x="' + z.x + '" y="' + z.y + '" width="' + z.w + '" height="' + z.h
          + '" fill="' + f + '" stroke="#7389A0"></rect>';
      }
      var cx = z.f === 'tolva' ? z.x + z.w/2 + 30 : z.x + z.w/2;
      svg += '<text class="zlbl" x="' + cx + '" y="' + (z.y + z.h/2) + '" text-anchor="middle" fill="' + claro + '">' + z.l + '</text>'
        + '<text class="zval" x="' + cx + '" y="' + (z.y + z.h/2 + 13) + '" text-anchor="middle" fill="' + claro + '">'
        + (v ? fmtK(v) : '—') + '</text></g>';
    });
  } else {
    var cols = 4, cw = 208, ch = 76, i = 0;
    e.sys.slice(0,12).forEach(function(s){
      var x = 18 + (i % cols)*(cw + 10), y = 14 + Math.floor(i/cols)*(ch + 10); i++;
      var claro = nivelCalor(s.v,max) >= 3 ? '#FFFFFF' : '#08192A';
      svg += '<g class="zona' + (sysActual === s.c ? ' act' : '') + '" data-c="' + s.c + '" tabindex="0" role="button">'
        + '<rect data-f x="' + x + '" y="' + y + '" width="' + cw + '" height="' + ch + '" fill="'
        + varCalorEq(s.v, max) + '" stroke="#7389A0"></rect>'
        + '<text class="zlbl" x="' + (x+12) + '" y="' + (y+24) + '" fill="' + claro + '">' + esc(s.n.slice(0,26)) + '</text>'
        + '<text class="zval" x="' + (x+12) + '" y="' + (y+44) + '" fill="' + claro + '" style="font-size:12px">S/ '
        + fmtK(s.v) + '</text></g>';
    });
  }
  svg += '</svg>';
  $('esquema').innerHTML = svg;
  Array.prototype.forEach.call($('esquema').querySelectorAll('.zona'), function(g){
    var pick = function(){ elegirSistema(g.getAttribute('data-c')); };
    g.addEventListener('click', pick);
    g.addEventListener('keydown', function(ev){
      if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); pick(); }
    });
  });
}

/* ---------- mapa de posiciones de llanta: vista en planta ---------- */
function pintarLlantas(e){
  if(!$('llantas')) return;
  var mapa = {};
  e.sys.forEach(function(s){ mapa[s.c] = s.v; });
  var cods = [], n = 0;
  for(var i=1; i<=14; i++){ if(mapa['LL'+i] !== undefined) n = i; }
  if(e.fam === 'ACARREO' && n < 6) n = 6;          /* el camion siempre tiene seis */
  if(n < 2){ $('llantas').innerHTML = ''; return; }
  for(var i2=1; i2<=n; i2++) cods.push('LL'+i2);
  var max = Math.max.apply(null, cods.map(function(c){ return mapa[c] || 0; })) || 1;

  var AN = 66, AL = 25;
  var filaDel = [12, 147], filaPost = [12, 41, 118, 147];
  var pos = [];
  var xDel = 74;
  pos.push({ c:cods[0], x:xDel, y:filaDel[0] });
  pos.push({ c:cods[1], x:xDel, y:filaDel[1] });
  var resto = cods.slice(2);
  var ejes = Math.max(1, Math.ceil(resto.length/4));
  for(var a=0; a<ejes; a++){
    for(var k=0; k<4; k++){
      var idx = a*4 + k;
      if(idx >= resto.length) break;
      pos.push({ c:resto[idx], x: 262 + a*86, y: filaPost[k] });
    }
  }
  var ancho = 262 + ejes*86 + 34;
  var xCh = xDel + AN/2, xCh2 = 262 + (ejes-1)*86 + AN/2;

  /* silueta en planta: morro y cabina delante, tolva detras. El frente
     queda a la izquierda, que es donde estan las dos llantas directrices. */
  var xIni = xDel - 14, xFin = xCh2 + AN/2 + 16, largo = xFin - xIni;
  var svg = '<svg viewBox="0 0 ' + ancho + ' 198" role="img" '
    + 'aria-label="Costo del mes por posición de llanta, camión visto desde arriba">'
    + '<defs><linearGradient id="llCu" x1="0" y1="0" x2="0" y2="1">'
    + '<stop offset="0" stop-color="#F6F9FC"/><stop offset="1" stop-color="#E7EDF3"/>'
    + '</linearGradient></defs>'
    /* cuerpo */
    + '<rect x="' + xIni + '" y="44" width="' + largo + '" height="96" rx="13" '
    + 'fill="url(#llCu)" stroke="#C3CFDB"></rect>'
    /* cabina, sobre el eje delantero */
    + '<rect x="' + (xDel - 4) + '" y="58" width="' + (AN + 8) + '" height="68" rx="8" '
    + 'fill="#DCE5ED" stroke="#C3CFDB"></rect>'
    /* por donde mira: al pie, para no cruzarse con la silueta */
    + '<path d="M' + xIni + ' 188 l12 -7 v14 z" fill="#8496A8"></path>'
    + '<text class="zlbl" x="' + (xIni + 19) + '" y="192" fill="#7389A0" '
    + 'letter-spacing="1.5">FRENTE</text>'
    /* ejes: unen las dos llantas de cada lado */
    + '<line x1="' + xCh + '" y1="26" x2="' + xCh + '" y2="158" stroke="#B9C6D4" stroke-width="3.5" '
    + 'stroke-linecap="round"></line>';
  for(var a2=0; a2<ejes; a2++){
    var xe = 262 + a2*86 + AN/2;
    svg += '<line x1="' + xe + '" y1="24" x2="' + xe + '" y2="160" stroke="#B9C6D4" '
      + 'stroke-width="3.5" stroke-linecap="round"></line>';
  }
  pos.forEach(function(p){
    var v = mapa[p.c] || 0;
    var nivel = nivelCalor(v, max);
    var tinta = nivel >= 3 ? '#FFFFFF' : '#08192A';
    var suave = nivel >= 3 ? 'rgba(255,255,255,.78)' : '#41566C';
    svg += '<g class="zona' + (sysActual === p.c ? ' act' : '') + '" data-c="' + p.c + '" tabindex="0" role="button">'
      + '<rect data-f x="' + p.x + '" y="' + p.y + '" width="' + AN + '" height="' + AL + '" rx="5" fill="'
      + varCalorEq(v, max) + '" stroke="#8496A8" stroke-width="1.1"></rect>'
      + '<text class="zlbl" x="' + (p.x+7) + '" y="' + (p.y+17) + '" fill="' + tinta + '">' + p.c + '</text>'
      + '<text class="zval" x="' + (p.x+AN-7) + '" y="' + (p.y+17) + '" text-anchor="end" fill="' + suave + '">'
      + (v ? fmtK(v) : '—') + '</text></g>';
  });
  svg += '</svg>';
  $('llantas').innerHTML = '<div class="tt">POSICIONES DE LLANTA · COSTO DEL MES · '
    + cods.length + ' POSICIONES</div>' + svg;
  Array.prototype.forEach.call($('llantas').querySelectorAll('.zona'), function(g){
    var pick = function(){ elegirSistema(g.getAttribute('data-c')); };
    g.addEventListener('click', pick);
    g.addEventListener('keydown', function(ev){
      if(ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); pick(); }
    });
  });
}


