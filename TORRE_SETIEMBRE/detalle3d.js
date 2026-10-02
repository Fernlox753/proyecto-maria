/* ══════════════════════════════════════════════════════════════════
   DETALLE 3D — herramientas para los modelos con mas detalle

   Lo que hace que un modelo se vea «de verdad» y no de cajas: cantos
   redondeados que agarran la luz, pintura con laca (clearcoat), cromo que
   refleja, llantas con tacos de verdad, rejillas de lamas, faros con aro y
   un estudio con cajas de luz para que todo tenga reflejos.

   kitDetalle(G, piezas) devuelve todo lo de kit3d mas:
     bloque(code, w,h,d, tipo, hex, x,y,z, r, rot)   caja de cantos redondeados
     perfil(code, pts, espesor, zc, tipo, hex, r)    perfil (x,y) extruido en Z
     perfilX(code, pts, largo, xc, tipo, hex, r)     perfil (z,y) extruido en X
     tubo(code, a, b, r, tipo, hex)                  tubo entre dos puntos
     cilindro(code, rArr, rAb, h, tipo, hex, x,y,z, rot, seg)
     cilHidD(code, a, b, r, hex)                     camisa, vastago cromado y ojos
     lamas(code, x0, y0, y1, z0, z1, n, hex, haciaX) rejilla de lamas inclinadas
     faro(code, x, y, z, r)                          faro redondo mirando a -X
     ruedaDet(code, x, z, afuera, o)                 llanta con tacos y aro con pernos
     baranda(pts, y0, alto, hex)                     pasamanos con postes y rodapie
     escalera(x, z, y0, y1, ancho, hexL, hexP)       escalera vertical mirando a -X
   tipo: 'pintura' | 'mate' | 'metal' | 'cromo' | 'goma' | 'vidrio'
   ══════════════════════════════════════════════════════════════════ */

/* ═══ registro de modelos ═══
   Cada archivo modelo_*.js registra los suyos:
     registrarModelo3d({ nombre: '...', clave: function(e){ return 'XYZ' o null; },
                         construir: function(e, piezas, clave){ return grupo; } });
   clave(e) dice si el equipo e es de ese modelo y con que variante: dos
   equipos con la misma clave comparten el mismo 3D (no se reconstruye al
   pasar de uno a otro). Va antes que los modelos viejos de modelos3d.js. */
var MODELOS3D = [];
function registrarModelo3d(def){ MODELOS3D.push(def); }
function modelo3dRegistrado(e){
  for(var i = 0; i < MODELOS3D.length; i++){
    var k = null;
    try { k = MODELOS3D[i].clave(e); } catch(err){ k = null; }
    if(k) return { def: MODELOS3D[i], k: 'R:' + k };
  }
  return null;
}
/* el modelo del equipo en mayusculas, sin espacios ni guiones: 'TLH 135' -> 'TLH135' */
function mod3d(e){ return String((e && e.mod) || '').toUpperCase().replace(/[\s\-_]+/g, ''); }

/* un estudio de fotografia como entorno: cielo claro, horizonte y cajas de
   luz que dejan reflejos largos en la pintura y el vidrio */
var _entornoEst = null;
function entornoEstudio(rend){
  if(_entornoEst) return _entornoEst;
  var c = document.createElement('canvas'); c.width = 1024; c.height = 512;
  var g = c.getContext('2d');
  var gr = g.createLinearGradient(0, 0, 0, 512);
  gr.addColorStop(0, '#EEF2F6'); gr.addColorStop(0.44, '#D3DBE3');
  gr.addColorStop(0.5, '#9AA5B0'); gr.addColorStop(0.62, '#6E7883'); gr.addColorStop(1, '#3B434C');
  g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
  g.fillStyle = '#FFFFFF'; g.shadowColor = '#FFFFFF'; g.shadowBlur = 28;
  [[80, 70, 230, 95], [420, 34, 190, 60], [690, 80, 260, 90], [300, 175, 120, 34]].forEach(function(r){ g.fillRect(r[0], r[1], r[2], r[3]); });
  g.shadowBlur = 0;
  g.fillStyle = 'rgba(255,255,255,0.30)'; g.fillRect(0, 238, 1024, 8);
  var tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.encoding = THREE.sRGBEncoding;
  var pm = new THREE.PMREMGenerator(rend);
  pm.compileEquirectangularShader();
  _entornoEst = pm.fromEquirectangular(tex).texture;
  pm.dispose(); tex.dispose();
  return _entornoEst;
}

/* caja de cantos redondeados: el perfil se extruye con bisel en las dos caras */
function geoCajaB(w, h, d, r){
  r = Math.max(0.004, Math.min(r, w / 2 - 0.002, h / 2 - 0.002, d / 2 - 0.002));
  var sh = new THREE.Shape(), a = w / 2 - r, b = h / 2 - r;
  sh.moveTo(-a, -b); sh.lineTo(a, -b); sh.lineTo(a, b); sh.lineTo(-a, b); sh.closePath();
  var g = new THREE.ExtrudeGeometry(sh, { depth: Math.max(0.001, d - 2 * r), bevelEnabled: true,
    bevelThickness: r, bevelSize: r, bevelSegments: 2, curveSegments: 4 });
  g.translate(0, 0, -(d - 2 * r) / 2);
  return g;
}
/* perfil (x,y) extruido a lo ancho (Z) con cantos biselados */
function geoPerfilB(pts, espesor, zc, r){
  var sh = new THREE.Shape();
  pts.forEach(function(p, i){ i ? sh.lineTo(p[0], p[1]) : sh.moveTo(p[0], p[1]); });
  sh.closePath();
  r = Math.min(r || 0.02, espesor / 3);
  var g = new THREE.ExtrudeGeometry(sh, { depth: Math.max(0.001, espesor - 2 * r), bevelEnabled: true,
    bevelThickness: r, bevelSize: r * 0.6, bevelSegments: 2 });
  g.translate(0, 0, zc - (espesor - 2 * r) / 2);
  return g;
}

function kitDetalle(G, piezas){
  var K = kit3d(G, piezas);
  var M = {
    pintura: function(hex){ var m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(hex), roughness: 0.36, metalness: 0.06,
               clearcoat: 0.65, clearcoatRoughness: 0.22 }); m.envMapIntensity = 0.95; return m; },
    mate:    function(hex){ var m = new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), roughness: 0.68, metalness: 0.25 }); m.envMapIntensity = 0.6; return m; },
    metal:   function(hex){ var m = new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), roughness: 0.34, metalness: 0.85 }); m.envMapIntensity = 0.9; return m; },
    cromo:   function(hex){ var m = new THREE.MeshStandardMaterial({ color: new THREE.Color(hex || '#E4E8EC'), roughness: 0.10, metalness: 1.0 }); m.envMapIntensity = 1.3; return m; },
    goma:    function(hex){ return new THREE.MeshStandardMaterial({ color: new THREE.Color(hex || '#15171A'), roughness: 0.94, metalness: 0.0 }); },
    vidrio:  function(hex){ var m = new THREE.MeshPhysicalMaterial({ color: new THREE.Color(hex || '#1C2C3C'), roughness: 0.04, metalness: 0.2,
               clearcoat: 1, clearcoatRoughness: 0.02, transparent: true, opacity: 0.86 }); m.envMapIntensity = 1.4; return m; }
  };
  var pon = function(code, geo, tipo, hex, x, y, z, rot){
    var m = new THREE.Mesh(geo, M[tipo](hex));
    m.position.set(x || 0, y || 0, z || 0);
    if(rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
    return K.reg(code, m, hex);
  };
  var bloque = function(code, w, h, d, tipo, hex, x, y, z, r, rot){
    return pon(code, geoCajaB(w, h, d, r === undefined ? Math.min(0.05, Math.min(w, h, d) * 0.22) : r), tipo, hex, x, y, z, rot);
  };
  var perfil = function(code, pts, esp, zc, tipo, hex, r){ return pon(code, geoPerfilB(pts, esp, zc, r), tipo, hex); };
  /* perfil (z,y) extruido a lo largo de X */
  var perfilX = function(code, pts, largo, xc, tipo, hex, r){
    var g = geoPerfilB(pts.map(function(p){ return [-p[0], p[1]]; }), largo, 0, r);
    g.rotateY(Math.PI / 2);
    g.translate(xc, 0, 0);
    return pon(code, g, tipo, hex);
  };
  var EJE_Y = new THREE.Vector3(0, 1, 0);
  var tubo = function(code, a, b, r, tipo, hex, seg){
    var va = new THREE.Vector3(a[0], a[1], a[2]), vb = new THREE.Vector3(b[0], b[1], b[2]);
    var dir = vb.clone().sub(va), L = dir.length();
    var m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, L, seg || 12), M[tipo](hex));
    m.position.copy(va).add(vb).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(EJE_Y, dir.normalize());
    return K.reg(code, m, hex);
  };
  var cilindro = function(code, rA, rB, h, tipo, hex, x, y, z, rot, seg){
    return pon(code, new THREE.CylinderGeometry(rA, rB, h, seg || 24), tipo, hex, x, y, z, rot);
  };
  /* cilindro hidraulico: camisa, vastago cromado, ojos en las puntas */
  var cilHidD = function(code, a, b, r, hex, parte){
    var p = parte || 0.56, m = [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p];
    tubo(code, a, m, r, 'pintura', hex, 20);
    tubo(null, m, b, r * 0.58, 'cromo', null, 16);
    var cuello = [a[0] + (b[0] - a[0]) * (p - 0.02), a[1] + (b[1] - a[1]) * (p - 0.02), a[2] + (b[2] - a[2]) * (p - 0.02)];
    tubo(null, cuello, m, r * 1.12, 'pintura', hex, 20);
    [a, b].forEach(function(q){ pon(null, new THREE.SphereGeometry(r * 0.95, 14, 10), 'metal', '#3A3F45', q[0], q[1], q[2]); });
  };
  /* rejilla de lamas inclinadas sobre una cara que mira a -X (haciaX=-1) o a +X */
  var lamas = function(code, x, y0, y1, z0, z1, n, hex, haciaX){
    var s = haciaX || -1, paso = (y1 - y0) / n;
    bloque(code, 0.10, y1 - y0 + 0.12, z1 - z0 + 0.12, 'mate', hex, x - s * 0.02, (y0 + y1) / 2, (z0 + z1) / 2, 0.02);
    for(var i = 0; i < n; i++){
      var l = pon(null, new THREE.BoxGeometry(0.05, paso * 0.72, z1 - z0), 'mate', '#0B0C0E', x + s * 0.05, y0 + paso * (i + 0.5), (z0 + z1) / 2);
      l.rotation.z = s * 0.5;
    }
  };
  /* faro redondo con caja, aro cromado y mica que brilla un poco */
  var faro = function(code, x, y, z, r, hexCaja){
    cilindro(null, r * 1.18, r * 1.25, 0.20, 'mate', hexCaja || '#202327', x + 0.04, y, z, [0, 0, Math.PI / 2], 28);
    pon(null, new THREE.TorusGeometry(r * 1.06, r * 0.10, 8, 32), 'cromo', null, x - 0.07, y, z, [0, Math.PI / 2, 0]);
    var mica = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2.6),
      new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#F7F1DA'), emissive: new THREE.Color('#5A4E2E'), roughness: 0.05,
        clearcoat: 1, transmission: 0, metalness: 0.1 }));
    mica.position.set(x - 0.06, y, z); mica.rotation.z = Math.PI / 2;
    K.reg(code, mica, '#F7F1DA');
  };

  /* rueda: carcasa con hombros, tacos en chevron (una sola malla instanciada
     con el mismo material, asi el mapa de calor la pinta entera), aro del
     color de la maquina con pestana, anillo de traba, pernos y masa */
  var ruedas = [];
  var ruedaDet = function(code, x, z, afuera, o){
    var R = o.r, A = o.ancho, rA = o.rAro || R * 0.45;
    var gr = new THREE.Group();
    gr.userData.rueda = true;
    gr.position.set(x, R, z);
    G.add(gr); ruedas.push(gr);
    var goma = M.goma(o.goma || '#141619');
    var perfilR = [[rA * 1.00, -A * 0.40], [rA * 1.07, -A * 0.47], [R * 0.66, -A * 0.50], [R * 0.82, -A * 0.495], [R * 0.90, -A * 0.46],
                   [R * 0.945, -A * 0.38], [R * 0.958, -A * 0.20], [R * 0.962, 0]];
    var pts = perfilR.concat(perfilR.slice(0, -1).reverse().map(function(p){ return [p[0], -p[1]]; }))
                     .map(function(p){ return new THREE.Vector2(p[0], p[1]); });
    var t = new THREE.Mesh(new THREE.LatheGeometry(pts, 56), goma);
    t.rotation.x = Math.PI / 2;
    t.userData.isLlanta = true; t.userData.code = code; t.userData.base = o.goma || '#141619';
    t.castShadow = true; t.receiveShadow = true;
    gr.add(t);
    if(piezas && code) piezas.push(t);
    /* tacos: dos filas en chevron, alternadas, que bajan un poco por el hombro */
    var n = Math.round(2 * Math.PI * R / (o.paso || 0.36));
    var hT = R * 0.05, gT = new THREE.BoxGeometry(2 * Math.PI * R / n * 0.50, hT, A * 0.47);
    var inst = new THREE.InstancedMesh(gT, goma, n * 2);
    var d = new THREE.Object3D(), k = 0;
    for(var i = 0; i < n; i++){
      [-1, 1].forEach(function(s){
        var a = (i + (s > 0 ? 0.5 : 0)) / n * Math.PI * 2, rr = R * 0.962 + hT / 2 - 0.004;
        d.position.set(Math.cos(a) * rr, Math.sin(a) * rr, s * A * 0.25);
        d.rotation.set(0, 0, a - Math.PI / 2);
        d.rotateY(s * 0.42);
        d.updateMatrix();
        inst.setMatrixAt(k++, d.matrix);
      });
    }
    inst.castShadow = true; inst.receiveShadow = true;
    gr.add(inst);
    /* aro: barril, pestanas y, del lado de afuera, disco, anillo de traba, pernos y masa */
    var aro = new THREE.Mesh(new THREE.CylinderGeometry(rA, rA, A * 0.84, 40, 1, true), M.pintura(o.aro));
    aro.material.side = THREE.DoubleSide;
    aro.rotation.x = Math.PI / 2; gr.add(aro);
    [-1, 1].forEach(function(s){
      var p = new THREE.Mesh(new THREE.TorusGeometry(rA * 1.02, 0.045, 10, 48), M.pintura(o.aro));
      p.position.z = s * A * 0.42; gr.add(p);
    });
    var dz = afuera ? afuera * A * 0.30 : 0;
    var disco = new THREE.Mesh(new THREE.CylinderGeometry(rA * 0.98, rA * 0.98, 0.06, 40), M.pintura(o.aro));
    disco.rotation.x = Math.PI / 2; disco.position.z = afuera ? dz : 0; gr.add(disco);
    if(afuera){
      var traba = new THREE.Mesh(new THREE.TorusGeometry(rA * 0.92, 0.03, 8, 48), M.pintura(o.aro2));
      traba.position.z = dz + afuera * 0.035; gr.add(traba);
      var rings = [[rA * 0.80, o.pernos || 24, 0.032], [rA * 0.36, Math.round((o.pernos || 24) * 0.5), 0.026]];
      rings.forEach(function(q, j){
        var gp = new THREE.CylinderGeometry(q[2], q[2], 0.07, 6);
        var ip = new THREE.InstancedMesh(gp, M.metal(o.perno || '#6E6A5E'), q[1]);
        for(var b = 0; b < q[1]; b++){
          var ang = b / q[1] * Math.PI * 2;
          d.position.set(Math.cos(ang) * q[0], Math.sin(ang) * q[0], dz + afuera * (j ? 0.20 : 0.05));
          d.rotation.set(Math.PI / 2, 0, 0);
          d.updateMatrix(); ip.setMatrixAt(b, d.matrix);
        }
        gr.add(ip);
      });
      /* masa del mando final: cono escalonado con tapa */
      var masa = new THREE.Mesh(new THREE.CylinderGeometry(rA * 0.42, rA * 0.55, 0.20, 32), M.pintura(o.aro));
      masa.rotation.x = Math.PI / 2; masa.position.z = dz + afuera * 0.10; gr.add(masa);
      var tapa = new THREE.Mesh(new THREE.CylinderGeometry(rA * 0.20, rA * 0.26, 0.10, 24), M.pintura(o.aro2));
      tapa.rotation.x = Math.PI / 2; tapa.position.z = dz + afuera * 0.24; gr.add(tapa);
    }
    gr.traverse(function(m){ if(m.isMesh){ m.castShadow = true; m.receiveShadow = true; } });
    return gr;
  };

  /* pasamanos: postes, pasamano y travesano tubulares y rodapie, sobre una
     poligonal pts = [[x,z], ...] a la altura y0 */
  var baranda = function(pts, y0, alto, hex, rodapie){
    for(var k = 0; k < pts.length; k++){
      var p = pts[k];
      tubo(null, [p[0], y0, p[1]], [p[0], y0 + alto, p[1]], 0.028, 'pintura', hex, 10);
      if(!k) continue;
      var q = pts[k - 1];
      tubo(null, [q[0], y0 + alto, q[1]], [p[0], y0 + alto, p[1]], 0.028, 'pintura', hex, 10);
      tubo(null, [q[0], y0 + alto * 0.52, q[1]], [p[0], y0 + alto * 0.52, p[1]], 0.022, 'pintura', hex, 10);
      /* postes intermedios cada metro y medio */
      var L = Math.hypot(p[0] - q[0], p[1] - q[1]), np = Math.floor(L / 1.5);
      for(var j = 1; j <= np; j++){
        var f = j / (np + 1);
        tubo(null, [q[0] + (p[0] - q[0]) * f, y0, q[1] + (p[1] - q[1]) * f], [q[0] + (p[0] - q[0]) * f, y0 + alto, q[1] + (p[1] - q[1]) * f], 0.024, 'pintura', hex, 10);
      }
      if(rodapie){
        var m = pon(null, new THREE.BoxGeometry(L, 0.12, 0.012), 'pintura', rodapie, (p[0] + q[0]) / 2, y0 + 0.06, (p[1] + q[1]) / 2);
        m.rotation.y = -Math.atan2(p[1] - q[1], p[0] - q[0]);
      }
    }
  };
  /* escalera vertical en el plano x, mirando a -X: largueros y peldanos de rejilla */
  var escalera = function(x, z, y0, y1, ancho, hexL, hexP){
    [-1, 1].forEach(function(s){ bloque(null, 0.06, y1 - y0, 0.08, 'pintura', hexL, x, (y0 + y1) / 2, z + s * ancho / 2, 0.015); });
    var n = Math.max(2, Math.round((y1 - y0) / 0.30));
    for(var i = 1; i < n; i++){
      bloque(null, 0.20, 0.035, ancho - 0.06, 'metal', hexP || '#4A4F55', x - 0.04, y0 + (y1 - y0) * i / n, z, 0.008);
    }
  };

  var D = {};
  for(var k in K) D[k] = K[k];
  D.M = M; D.pon = pon; D.bloque = bloque; D.perfil = perfil; D.perfilX = perfilX; D.tubo = tubo;
  D.cilindro = cilindro; D.cilHidD = cilHidD; D.lamas = lamas; D.faro = faro; D.ruedaDet = ruedaDet;
  D.ruedas = ruedas; D.baranda = baranda; D.escalera = escalera;
  return D;
}

/* numero de unidad pintado en la maquina (FC-100...): una sola textura que
   se vuelve a dibujar al elegir otra unidad del mismo modelo */
function texNumero3d(fondo, tinta){
  var c = document.createElement('canvas'); c.width = 512; c.height = 160;
  var t = new THREE.CanvasTexture(c);
  t.encoding = THREE.sRGBEncoding; t.anisotropy = 4;
  t.userData = { poner: function(txt){
    var g = c.getContext('2d');
    g.clearRect(0, 0, c.width, c.height);
    if(fondo){ g.fillStyle = fondo; g.fillRect(0, 0, c.width, c.height); }
    g.fillStyle = tinta; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold 118px "Arial Black", Arial, sans-serif';
    g.fillText(txt, c.width / 2, c.height * 0.55, c.width * 0.94);
    t.needsUpdate = true;
  } };
  return t;
}
