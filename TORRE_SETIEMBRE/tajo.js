/* ══════════════════════════════════════════════════════════════════
   EL TAJO — fondo de Inicio y En vivo, rehecho para la Torre de Setiembre

   Una mina de hierro a tajo abierto en el desierto de la costa, a la hora
   dorada: el sol bajo marca cada banco con su sombra. Reemplaza a
   iniciarTajo / ajustarTajo / renderTajo de tres_d.js (dentro del mismo
   IIFE gana la ultima declaracion) y usa la flota de verdad: los modelos de
   detalle de modelo_*.js.

   Escala real, en metros. El tajo: contorno irregular de ~230 m de radio,
   96 m de hondo en 8 bancos de 12 m con caras empinadas y bermas. La rampa
   baja en espiral, de 26 m de ancho, con su cordon de seguridad del lado
   del vacio. Afuera: el desierto, un botadero en terrazas, el camino
   perimetral, la chancadora con su faja y la ruma, y el mar al oeste.

   Lo que lo hace liviano para una tarjeta de video de laptop:
   - El terreno es una malla polar: los anillos siguen el contorno del tajo,
     asi los bordes de los bancos caen sobre los anillos y salen limpios.
   - La luz del terreno (sol, cielo y la sombra que cada banco echa sobre el
     de abajo) se calcula una vez al armarlo y queda en el color de los
     vertices: no hay mapa de sombras que redibujar en cada cuadro.
   - Cada maquina se fusiona en un punado de mallas con el color en los
     vertices (una por tipo de superficie: pintura, metal, vidrio, luces);
     las piezas de menos de 15 cm se quedan afuera porque a esta distancia
     no se ven. Su sombra es una mancha alargada en el piso, y la maquina se
     oscurece cuando entra a la sombra de un banco.
   - Todo se arma por tandas para no congelar la pagina al cargar.
   ══════════════════════════════════════════════════════════════════ */
var TJ = null;                       /* todo el estado del tajo */
var TJ_PROF = 96, TJ_BANCO = 12, TJ_RHOF = 0.25, TJ_PHI = Math.PI * 2 * 1.85;
var TJ_ANCHO = 26, TJ_CARRIL = 5.6, TJ_UTOP = -0.075, TJ_UBOT = 1.0;
var TJ_RANILLO = 1.075;              /* camino perimetral, en radios del tajo */
/* el sol de la tarde, bajo (32 grados), de costado respecto a la camara:
   marca los bancos sin dejar el fondo del tajo a oscuras */
var TJ_SOL = new THREE.Vector3(-0.50, 0.62, 0.86).normalize();
var TJ_RMAX = 4200;

/* ═══ ruido: valor con interpolacion suave y fbm (deterministico) ═══ */
function tjHash(i, j){
  var h = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return h - Math.floor(h);
}
function tjRuido(x, z){
  var i = Math.floor(x), j = Math.floor(z), fx = x - i, fz = z - j;
  var u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  var a = tjHash(i, j), b = tjHash(i + 1, j), c = tjHash(i, j + 1), d = tjHash(i + 1, j + 1);
  return (a + (b - a) * u) + ((c + (d - c) * u) - (a + (b - a) * u)) * v;
}
function tjFbm(x, z, oct){
  var s = 0, a = 0.5, f = 1;
  for(var k = 0; k < (oct || 4); k++){ s += a * tjRuido(x * f, z * f); f *= 2.03; a *= 0.5; }
  return s;
}
function tjSuave(a, b, x){ var t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }

/* ═══ la forma del tajo ═══ */
function tjRadio(th){
  return 230 * (1 + 0.16 * Math.sin(2 * th + 0.7) + 0.07 * Math.cos(3 * th - 1.2) + 0.04 * Math.sin(5 * th + 2.1));
}
/* radio relativo de la rampa en el parametro u (0 borde, 1 fondo; u<0 sale al borde) */
function tjRhoRampa(u){ return 0.95 - 0.70 * u; }
function tjAltRampa(u){
  var rho = tjRhoRampa(u);
  return -TJ_PROF * clamp((1 - rho) / (1 - TJ_RHOF), 0, 1) + 0.6;
}
/* punto del eje de la rampa */
function tjPuntoRampa(u){
  var phi = u * TJ_PHI, r = tjRadio(phi) * tjRhoRampa(u);
  return { x: Math.cos(phi) * r, y: tjAltRampa(u), z: Math.sin(phi) * r, phi: phi, r: r };
}
/* distancia lateral de (r, th) a la rampa: la vuelta mas cercana */
function tjDistRampa(r, th){
  var mejor = 1e9, u0 = 0, lado = 0;
  for(var k = -1; k < 3; k++){
    var phi = th + Math.PI * 2 * k, u = phi / TJ_PHI;
    if(u < TJ_UTOP - 0.03 || u > TJ_UBOT + 0.015) continue;
    var rr = tjRadio(phi) * tjRhoRampa(u), d = Math.abs(r - rr);
    if(d < mejor){ mejor = d; u0 = u; lado = r < rr ? -1 : 1; }
  }
  return { d: mejor, u: u0, lado: lado };
}

/* los sitios de la faena en el fondo: donde carga el camion, la pala, la
   frente de roca volada y la poza; se calculan antes del terreno porque la
   poza lo modifica */
var TJ_L = null;
function tjLugares(){
  if(TJ_L) return TJ_L;
  var pb = tjPuntoRampa(TJ_UBOT), aB = Math.atan2(pb.z, pb.x);
  /* el piso del fondo es desparejo (de ~30 m junto al pie de la rampa a ~85 m
     del otro lado): la frente va donde el piso es mas ancho y lejos de la
     rampa, para que las maniobras tengan donde dar la vuelta sin meterse en
     el pie de los bancos */
  var thF = 0, rf = 0;
  for(var k = 0; k < 144; k++){
    var th = k / 144 * Math.PI * 2, da = Math.abs(Math.atan2(Math.sin(th - aB), Math.cos(th - aB)));
    if(da < 1.9) continue;
    var r = TJ_RHOF * tjRadio(th);
    if(r > rf){ rf = r; thF = th; }
  }
  var px = Math.cos(thF), pz = Math.sin(thF);       /* de la pala hacia la frente */
  var ex = -pz, ez = px;                            /* de la pala hacia el camion: del lado de la rampa */
  if(ex * pb.x + ez * pb.z < 0){ ex = -ex; ez = -ez; }
  /* la pala mira a la frente; el camion se pone a su costado, de modo que la
     pala gire solo un cuarto de vuelta */
  var S = { x: px * (rf - 25), z: pz * (rf - 25) };
  var F = { x: S.x + px * 17, z: S.z + pz * 17 };
  var B = { x: S.x + ex * 12.5, z: S.z + ez * 12.5 };
  TJ_L = { pb: pb, e: { x: ex, z: ez }, p: { x: px, z: pz }, B: B, S: S, F: F, rf: rf,
           /* la poza, del otro lado de la pala, lejos de las maniobras */
           poza: { x: S.x - ex * 24 - px * 12, z: S.z - ez * 24 - pz * 12 } };
  return TJ_L;
}

/* altura de los bancos segun el radio relativo rho (sin la rampa) */
function tjBancos(rho, th, x, z){
  if(rho <= TJ_RHOF){
    /* el fondo: plano, con un poco de material suelto */
    return { h: -TJ_PROF + (tjFbm(x * 0.06, z * 0.06, 3) - 0.5) * 1.2, cara: 0, pie: 0 };
  }
  /* el borde de cada banco serpentea un poco: no es un anillo perfecto */
  var NB = TJ_PROF / TJ_BANCO;
  var d = (1 - rho) / (1 - TJ_RHOF) * NB + (tjRuido(th * 26, Math.floor((1 - rho) * 40)) - 0.5) * 0.06;
  var k = Math.floor(d), fr = d - k, F = 0.24;
  var h, cara = 0, pie = 0;
  if(fr < F){
    /* la cara: cresta redondeada, pared empinada y pie con escombro */
    var s = fr / F;
    var perfil = s < 0.12 ? (s / 0.12) * (s / 0.12) * 0.06 : 0.06 + (s - 0.12) / 0.88 * 0.94;
    h = -TJ_BANCO * (k + perfil);
    cara = s < 0.92 ? 1 : (1 - s) / 0.08;
    /* la roca de la cara no es lisa: lajas verticales */
    h += (tjRuido(th * 180, h * 0.25) - 0.5) * 1.3 * cara;
  } else {
    h = -TJ_BANCO * (k + 1);
    var b = (fr - F) / (1 - F);
    /* escombro al pie de la cara y cordon de seguridad junto a la cresta siguiente */
    pie = Math.max(0, 1 - b / 0.22);
    h += pie * pie * 1.8;
    if(b > 0.86) h += Math.sin((b - 0.86) / 0.14 * Math.PI) * 1.1;
    h += (tjFbm(x * 0.09, z * 0.09, 2) - 0.5) * 0.7;
  }
  if(k >= NB) h = -TJ_PROF;
  return { h: h, cara: cara, pie: pie };
}

/* el terreno de afuera: desierto, botadero, la costa */
var TJ_BOT = { x: 560, z: -540, r1: 190, r2: 130, h1: 24, h2: 46 };
var TJ_COSTA = -780;
function tjAfuera(x, z){
  var h = 1.2 + (tjFbm(x * 0.004, z * 0.004, 4) - 0.5) * 26 + (tjFbm(x * 0.03, z * 0.03, 3) - 0.5) * 2.2;
  /* lomas de arena largas, como las del desierto costero */
  h += Math.sin(x * 0.006 + z * 0.0035) * 3.5;
  /* cerros lejanos al este, para que el horizonte no sea una raya */
  h += Math.max(0, x - 900) * 0.07 * (0.6 + tjFbm(z * 0.002, 7.7, 3));
  /* el botadero de desmonte: dos terrazas de tope plano */
  var db = Math.hypot(x - TJ_BOT.x, z - TJ_BOT.z) + (tjRuido(x * 0.02, z * 0.02) - 0.5) * 16;
  var hb = 0;
  if(db < TJ_BOT.r1 + 45){
    var t1 = tjSuave(TJ_BOT.r1 + 45, TJ_BOT.r1, db), t2 = tjSuave(TJ_BOT.r2 + 34, TJ_BOT.r2, db);
    hb = TJ_BOT.h1 * t1 + (TJ_BOT.h2 - TJ_BOT.h1) * t2;
  }
  h = Math.max(h, h * 0.3 + hb);
  /* el mar al oeste: la meseta cae en acantilado */
  var costa = TJ_COSTA - 120 + (tjFbm(z * 0.003, 3.1, 3) - 0.5) * 260;
  if(x < costa + 140){
    var c = tjSuave(costa + 140, costa - 40, x);
    h = h * (1 - c) + (-34 - (tjFbm(x * 0.01, z * 0.01, 2) * 6)) * c;
  }
  return h;
}

/* caminos de afuera: al botadero y el acceso que se pierde en el desierto */
var TJ_VIAS = null;
function tjVias(){
  if(TJ_VIAS) return TJ_VIAS;
  var anillo = function(th){ var R = tjRadio(th) * TJ_RANILLO; return [Math.cos(th) * R, Math.sin(th) * R]; };
  var bx = TJ_BOT.x - 0.78 * (TJ_BOT.r1 + 30), bz = TJ_BOT.z + 0.62 * (TJ_BOT.r1 + 30);
  var a = anillo(-0.45), c = anillo(0.35);
  TJ_VIAS = [
    [a, [a[0] + 70, a[1] - 40], [bx - 30, bz + 40], [bx, bz]],
    [c, [c[0] + 160, c[1] + 30], [c[0] + 420, c[1] - 30], [c[0] + 800, c[1] + 90], [c[0] + 1400, c[1] + 40], [c[0] + 2600, c[1] + 260]],
    [anillo(2.2), [-420, 260], [-640, 330], [TJ_COSTA - 60, 420]]
  ];
  return TJ_VIAS;
}
function tjDistVias(x, z){
  var V = tjVias(), mejor = 1e9;
  for(var i = 0; i < V.length; i++){
    var P = V[i];
    for(var k = 0; k < P.length - 1; k++){
      var ax = P[k][0], az = P[k][1], dx = P[k + 1][0] - ax, dz = P[k + 1][1] - az;
      var t = clamp(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz), 0, 1);
      var d = Math.hypot(x - ax - dx * t, z - az - dz * t);
      if(d < mejor) mejor = d;
    }
  }
  return mejor;
}

/* el suelo en (x,z) con lo que hace falta para pintarlo */
function tjSuelo(x, z, o){
  var r = Math.hypot(x, z), th = Math.atan2(z, x); if(th < 0) th += Math.PI * 2;
  var R = tjRadio(th), rho = r / R;
  o.cara = 0; o.pie = 0; o.camino = 0; o.anillo = 0; o.adentro = rho < 1; o.huella = 0; o.poza = 0;
  var h;
  if(rho < 1){
    var b = tjBancos(rho, th, x, z);
    h = b.h; o.cara = b.cara; o.pie = b.pie;
  } else {
    h = rho < 2.6 ? tjAfuera(x, z) * tjSuave(1.0, 1.25, rho) : tjAfuera(x, z);
    /* camino perimetral, aplanado */
    var dA = Math.abs(rho - TJ_RANILLO) * R;
    if(dA < 14){ var m = tjSuave(14, 8, dA); h = h * (1 - m) + 0.4 * m; o.anillo = tjSuave(9, 6, dA); }
    else if(r < 4000){
      var dv = tjDistVias(x, z);
      if(dv < 10) o.anillo = tjSuave(10, 6, dv) * 0.85;
    }
  }
  /* la rampa corta y rellena lo que encuentra */
  if(r < R * 1.08){
    var dr = tjDistRampa(r, th);
    var semi = TJ_ANCHO / 2;
    if(dr.d < semi + 13){
      var yR = tjAltRampa(dr.u);
      var mR = dr.d < semi ? 1 : 1 - tjSuave(semi, semi + 13, dr.d);
      h = h * (1 - mR) + yR * mR;
      if(dr.d < semi){
        o.camino = 1; o.cara = 0;
        /* cordon de seguridad del lado del vacio; se termina antes de llegar al
           piso del fondo, donde ya no hay desnivel y los camiones lo cruzan
           para ir a la pala */
        var cordon = 1 - tjSuave(0.82, 0.92, dr.u);
        if(dr.lado < 0 && dr.d > semi - 3.2 && cordon > 0){ h += Math.sin((dr.d - (semi - 3.2)) / 3.2 * Math.PI) * 1.6 * cordon; o.camino = 0.4; }
        /* huellas de las llantas en cada carril */
        o.huella = Math.abs(dr.d - TJ_CARRIL) < 1.7 ? 1 : 0;
      }
    }
  }
  /* la poza del sumidero en el fondo */
  if(rho < TJ_RHOF){
    var L = tjLugares(), dp = Math.hypot(x - L.poza.x, z - L.poza.z);
    if(dp < 13){ o.poza = 1; h = Math.min(h, -TJ_PROF - 1.0); }
  }
  /* el patio de la chancadora: plano y con color de patio compactado, para
     que los camiones descarguen parejos contra el muro */
  if(rho > 1 && !o._sinPatio){
    var C = tjLugarChancadora(), dx = x - C.x, dz = z - C.z;
    var lx = dx * C.c - dz * C.s, lz = dx * C.s + dz * C.c;
    var fuera = Math.max(C.x0 - lx, lx - C.x1, Math.abs(lz) - C.zh, 0);
    if(fuera < 10){
      var mp = 1 - tjSuave(0, 10, fuera);
      h = h * (1 - mp) + C.h * mp;
      o.anillo = Math.max(o.anillo, mp * 0.9);
    }
  }
  o.h = h;
  return o;
}

/* donde va la chancadora: al salir de la rampa, un poco hacia afuera del
   tajo, con su eje +X mirando hacia afuera (la faja se aleja del tajo). Se
   calcula una sola vez porque el terreno la necesita para nivelar el patio */
var TJ_CH = null;
function tjLugarChancadora(){
  if(TJ_CH) return TJ_CH;
  var p = tjPuntoRampa(TJ_UTOP), r = Math.hypot(p.x, p.z), rx = p.x / r, rz = p.z / r;
  var ang = Math.atan2(-rz, rx);
  TJ_CH = { x: p.x + rx * 46, z: p.z + rz * 46, rx: rx, rz: rz, ang: ang, c: Math.cos(ang), s: Math.sin(ang),
            x0: -32, x1: 44, zh: 26, h: 0 };
  var o = { _sinPatio: true };
  tjSuelo(TJ_CH.x, TJ_CH.z, o);
  TJ_CH.h = o.h;
  return TJ_CH;
}
/* de coordenadas de la chancadora (x hacia afuera, z al costado) al mundo */
function tjDeChancadora(lx, lz){
  var C = tjLugarChancadora();
  return { x: C.x + lx * C.c + lz * C.s, z: C.z - lx * C.s + lz * C.c };
}

/* ═══ colores (albedo, lineal) ═══ */
var TJ_C = null;
function tjColores(){
  if(TJ_C) return TJ_C;
  var c = function(h){ return new THREE.Color(h).convertSRGBToLinear(); };
  TJ_C = {
    arena: c('#C2A27C'), arena2: c('#A48463'), grava: c('#85705C'),
    oxido: c('#8A5038'), roca: c('#5A4440'), roca2: c('#47403F'), magnetita: c('#36302F'),
    berma: c('#9C866C'), pie: c('#76604E'), camino: c('#BFAC8E'), huella: c('#94826A'),
    fondo: c('#76604D'), poza: c('#2A5468'), botadero: c('#A98966'), anillo: c('#CFC2AA')
  };
  return TJ_C;
}
function tjColorSuelo(x, z, o, out){
  var C = tjColores(), n = tjFbm(x * 0.05, z * 0.05, 3), n2 = tjRuido(x * 0.35, z * 0.35);
  if(!o.adentro){
    out.copy(C.arena).lerp(C.arena2, clamp(n * 1.3 - 0.25, 0, 1));
    /* afloramientos de roca oscura y manchas de grava en la pampa */
    var n3 = tjFbm(x * 0.006 + 3.1, z * 0.006 - 1.7, 4);
    if(n3 > 0.56) out.lerp(C.grava, clamp((n3 - 0.56) * 6, 0, 0.75));
    if(n3 < 0.36) out.lerp(C.arena, clamp((0.36 - n3) * 5, 0, 0.5)).multiplyScalar(1.04);
    if(o.h > 14) out.lerp(C.botadero, 0.6);
    if(o.anillo) out.lerp(C.anillo, o.anillo * 0.9);
    if(o.h < -20) out.lerp(C.grava, 0.5);
  } else {
    /* estratos: bandas de mineral oscuro y roca oxidada segun la cota */
    var banda = Math.sin(o.h * 0.42 + n * 3.2) * 0.5 + 0.5;
    out.copy(C.roca).lerp(C.oxido, banda * 0.75);
    if(Math.sin(o.h * 0.13 + 1.3 + n) > 0.55) out.lerp(C.magnetita, 0.55);
    out.lerp(C.roca2, n2 * 0.35);
    /* las bermas llevan polvo encima; el pie, escombro */
    var piso = 1 - o.cara;
    out.lerp(C.berma, piso * 0.78);
    if(o.pie) out.lerp(C.pie, o.pie * 0.6 * piso);
    if(o.h < -TJ_PROF + 1.5) out.lerp(C.fondo, 0.7);
  }
  if(o.camino) out.lerp(o.huella ? C.huella : C.camino, o.camino * 0.92);
  if(o.poza) out.copy(C.poza);
  var vn = 0.9 + n2 * 0.18;
  out.r *= vn; out.g *= vn; out.b *= vn;
  return out;
}

/* textura de grano para el suelo: se multiplica con el color del vertice */
function tjTexGrano(){
  var c = document.createElement('canvas'); c.width = c.height = 256;
  var g = c.getContext('2d'), im = g.createImageData(256, 256);
  for(var i = 0; i < 256 * 256; i++){
    var x = i % 256, y = (i / 256) | 0;
    var v = 205 + tjFbm(x * 0.06, y * 0.06, 4) * 50 + (Math.random() - 0.5) * 30;
    if(Math.random() < 0.015) v -= 60;
    im.data[i * 4] = im.data[i * 4 + 1] = im.data[i * 4 + 2] = clamp(v, 0, 255);
    im.data[i * 4 + 3] = 255;
  }
  g.putImageData(im, 0, 0);
  var t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

/* ═══ el material del terreno ═══
   color de la roca (por vertice) × detalle × luz.
   - La luz sale del mapa horneado en Blender con Cycles (sol, cielo, rebote
     y sombras a 17 cm por pixel) dentro del cuadrado de ±TJ_E m; afuera, y
     mientras carga, de la luz por vertice (luzv). Viene en sRGB dividida por
     4: aqui se decodifica y se multiplica.
   - El detalle son dos texturas de Poly Haven (CC0) guardadas como razon
     contra su promedio (0.5 = sin cambio): roca estratificada en las caras,
     proyectada de costado, y grava en bermas, rampa y desierto, proyectada
     desde arriba. Cada una a dos escalas para que no se note la repeticion.
   Las texturas llegan en TJ_TEX (las pone ensamblar.py desde tajo_tex/);
   sin ellas el terreno se ve como antes, con el grano. */
var TJ_TEX = {};
var TJ_E = 330;
function tjMatTerreno(){
  var u = THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {
    mapaLuz: { value: null }, roca: { value: null }, grava: { value: null }, grano: { value: null },
    hueco: { value: new THREE.Vector4() }, huecoT: { value: new THREE.Vector4() },
    hayLuz: { value: 0 }, hayDet: { value: 0 }, kLuz: { value: 1 }, E: { value: TJ_E }
  }]);
  u.grano.value = tjTexGrano();
  return new THREE.ShaderMaterial({
    uniforms: u, vertexColors: true, fog: true,
    vertexShader: [
      'attribute vec3 luzv;',
      'varying vec3 vCol; varying vec3 vLuz; varying vec3 vPos; varying vec3 vNor;',
      '#include <fog_pars_vertex>',
      'void main(){',
      '  vCol = color; vLuz = luzv; vPos = position; vNor = normal;',
      '  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);',
      '  gl_Position = projectionMatrix * mvPosition;',
      '#include <fog_vertex>',
      '}'].join('\n'),
    fragmentShader: [
      'uniform sampler2D mapaLuz; uniform sampler2D roca; uniform sampler2D grava; uniform sampler2D grano;',
      'uniform float hayLuz; uniform float hayDet; uniform float kLuz; uniform float E;',
      'uniform vec4 hueco; uniform vec4 huecoT;',
      'varying vec3 vCol; varying vec3 vLuz; varying vec3 vPos; varying vec3 vNor;',
      '#include <fog_pars_fragment>',
      'vec3 rocaEn(float esc, vec3 a){',
      '  vec3 x = texture2D(roca, vPos.zy / esc).rgb, z = texture2D(roca, vPos.xy / esc).rgb;',
      '  return (x * a.x + z * a.z) / (a.x + a.z + 1e-4) * 2.0;',
      '}',
      'void main(){',
      /* la boca de la tolva de recepcion de la chancadora: ahi no hay terreno */
      '  vec2 dh = vPos.xz - hueco.xy;',
      '  float hx = dh.x * hueco.z - dh.y * hueco.w, hz = dh.x * hueco.w + dh.y * hueco.z;',
      '  if(hx > huecoT.x && hx < huecoT.y && hz > huecoT.z && hz < huecoT.w) discard;',
      '  vec3 n = normalize(vNor);',
      '  vec3 luz = vLuz;',
      '  if(hayLuz > 0.5){',
      '    float borde = max(abs(vPos.x), abs(vPos.z)) / E;',
      '    float w = 1.0 - smoothstep(0.9, 0.99, borde);',
      '    if(w > 0.0){',
      /* el rebote del cielo azul en Cycles enfria un poco la escena: se templa */
      '      vec3 lm = pow(texture2D(mapaLuz, (vPos.xz + E) / (2.0 * E)).rgb, vec3(2.2)) * 4.0 * kLuz * vec3(1.06, 1.0, 0.9);',
      '      luz = mix(luz, lm, w);',
      '    }',
      '  }',
      '  vec3 det;',
      '  if(hayDet > 0.5){',
      '    float lejos = smoothstep(250.0, 1000.0, length(vPos - cameraPosition));',
      '    vec3 a = pow(abs(n), vec3(4.0));',
      /* cada pixel lee solo lo que usa: la roca en las caras, la grava en lo
         plano; las dos solo en la franja de transicion */
      '    float mR = smoothstep(0.82, 0.6, n.y);',
      '    vec3 dR = vec3(1.0), dG = vec3(1.0);',
      '    if(mR > 0.0) dR = mix(vec3(1.0), rocaEn(12.6, a), 0.85) * mix(vec3(1.0), rocaEn(41.0, a), 0.45);',
      '    if(mR < 1.0) dG = texture2D(grava, vPos.xz / 2.6).rgb * 2.0',
      '            * mix(vec3(1.0), texture2D(grava, vPos.xz / 11.0).rgb * 2.0, 0.6);',
      '    det = mix(dG, dR, mR);',
      '    det = mix(det, vec3(1.0), lejos * 0.6);',
      '  } else {',
      '    det = texture2D(grano, vPos.xz / 7.0).rgb;',
      '  }',
      '  gl_FragColor = vec4(vCol * det * luz, 1.0);',
      '#include <tonemapping_fragment>',
      '#include <encodings_fragment>',
      '#include <fog_fragment>',
      '}'].join('\n')
  });
}
/* carga las texturas del terreno; el mapa de luz se calibra contra la luz por
   vertice (misma luminancia promedio dentro del tajo) para que no haya salto
   en el borde ni cambie el brillo general de la escena */
function tjTexturasTerreno(mat, pos, luzv){
  var U = mat.uniforms;
  var carga = function(src, alListo){
    if(!src) return;
    var im = new Image();
    im.onload = function(){
      var t = new THREE.Texture(im);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = Math.min(4, rT.capabilities.getMaxAnisotropy());
      t.needsUpdate = true;
      alListo(t, im);
    };
    im.src = src;
  };
  var ndet = 0;
  var det = function(nombre){
    return function(t){ U[nombre].value = t; if(++ndet === 2) U.hayDet.value = 1; };
  };
  carga(TJ_TEX.roca, det('roca'));
  carga(TJ_TEX.grava, det('grava'));
  carga(TJ_TEX.luz, function(t, im){
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    /* calibracion: el mapa reducido a 256 px contra la luz de los vertices */
    var c = document.createElement('canvas'); c.width = c.height = 256;
    var g = c.getContext('2d'); g.drawImage(im, 0, 0, 256, 256);
    var px = g.getImageData(0, 0, 256, 256).data, sV = 0, sM = 0;
    var lin = function(v){ return Math.pow(v / 255, 2.2) * 4; };
    for(var k = 0; k < pos.length / 3; k += 7){
      var x = pos[k * 3], z = pos[k * 3 + 2];
      if(Math.abs(x) > TJ_E * 0.85 || Math.abs(z) > TJ_E * 0.85) continue;
      var ix = Math.floor((x + TJ_E) / (2 * TJ_E) * 256), iz = 255 - Math.floor((z + TJ_E) / (2 * TJ_E) * 256);
      var p = (iz * 256 + ix) * 4;
      sM += 0.2126 * lin(px[p]) + 0.7152 * lin(px[p + 1]) + 0.0722 * lin(px[p + 2]);
      sV += 0.2126 * luzv[k * 3] + 0.7152 * luzv[k * 3 + 1] + 0.0722 * luzv[k * 3 + 2];
    }
    U.kLuz.value = sM > 0 ? sV / sM : 1;
    U.mapaLuz.value = t;
    U.hayLuz.value = 1;
    TJ.kLuz = U.kLuz.value;
  });
}

/* ═══ el terreno, por tandas: forma, color y luz ═══ */
function tjTerreno(listo){
  var NA = MOVIL ? 220 : 320, NPIT = MOVIL ? 180 : 270, NOUT = MOVIL ? 50 : 76;
  var NR = NPIT + NOUT + 1, nv = NA * NR;
  var pos = new Float32Array(nv * 3), col = new Float32Array(nv * 3);
  var RT = new Float32Array(NA + 1);
  for(var a0 = 0; a0 <= NA; a0++) RT[a0] = tjRadio(a0 / NA * Math.PI * 2);
  var o = {}, cc = new THREE.Color();
  var radioDe = function(i, R){ return i <= NPIT ? (i / NPIT) * R : R + (TJ_RMAX - R) * Math.pow((i - NPIT) / NOUT, 1.8); };
  /* la altura de la malla en cualquier (x,z), interpolando la grilla polar */
  var alto = function(x, z){
    var th = Math.atan2(z, x); if(th < 0) th += Math.PI * 2;
    var fa = th / (Math.PI * 2) * NA, a = Math.floor(fa), ta = fa - a;
    var R = RT[a] + (RT[a + 1] - RT[a]) * ta, r = Math.hypot(x, z), fi;
    if(r <= R) fi = r / R * NPIT;
    else fi = NPIT + NOUT * Math.pow(Math.min(1, (r - R) / (TJ_RMAX - R)), 1 / 1.8);
    var i = Math.min(NR - 2, Math.floor(fi)), ti = fi - i, a1 = (a + 1) % NA; a = a % NA;
    var h00 = pos[(a * NR + i) * 3 + 1], h01 = pos[(a * NR + i + 1) * 3 + 1];
    var h10 = pos[(a1 * NR + i) * 3 + 1], h11 = pos[(a1 * NR + i + 1) * 3 + 1];
    return (h00 + (h01 - h00) * ti) * (1 - ta) + (h10 + (h11 - h10) * ti) * ta;
  };
  var fila = 0, fase = 0, k0 = 0, g = null;
  var sombra = new Float32Array(nv);
  function tanda(){
    var t0 = performance.now();
    if(fase === 0){
      /* 1. la forma y el color de cada vertice */
      while(fila < NA && performance.now() - t0 < 14){
        var th = fila / NA * Math.PI * 2, R = RT[fila], ct = Math.cos(th), st = Math.sin(th);
        for(var i = 0; i < NR; i++){
          var r = radioDe(i, R), x = ct * r, z = st * r;
          tjSuelo(x, z, o);
          var k = fila * NR + i;
          pos[k * 3] = x; pos[k * 3 + 1] = o.h; pos[k * 3 + 2] = z;
          tjColorSuelo(x, z, o, cc);
          col[k * 3] = cc.r; col[k * 3 + 1] = cc.g; col[k * 3 + 2] = cc.b;
        }
        fila++;
      }
      if(fila < NA){ setTimeout(tanda, 0); return; }
      var idx = new (nv > 65535 ? Uint32Array : Uint16Array)(NA * (NR - 1) * 6), q = 0;
      for(var a = 0; a < NA; a++){
        var a2 = (a + 1) % NA;
        for(var j = 0; j < NR - 1; j++){
          var p = a * NR + j, p2 = a2 * NR + j;
          idx[q++] = p; idx[q++] = p2; idx[q++] = p + 1; idx[q++] = p2; idx[q++] = p2 + 1; idx[q++] = p + 1;
        }
      }
      g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setIndex(new THREE.BufferAttribute(idx, 1));
      g.computeVertexNormals();
      fase = 1; fila = 0;
      setTimeout(tanda, 0); return;
    }
    if(fase === 1){
      /* 2. la sombra del sol: desde cada vertice del tajo y sus alrededores se
         camina hacia el sol; si el terreno tapa el rayo, esta en sombra. La
         penumbra sale de cuanto le falto al rayo para pasar */
      var sh = Math.hypot(TJ_SOL.x, TJ_SOL.z), dx = TJ_SOL.x / sh, dz = TJ_SOL.z / sh, sube = TJ_SOL.y / sh;
      var PASO = 2.5;
      while(fila < NA && performance.now() - t0 < 14){
        var R2 = RT[fila];
        for(var i2 = 0; i2 < NR; i2++){
          var k2 = fila * NR + i2;
          if(radioDe(i2, R2) > R2 * 1.25){ sombra[k2] = 1; continue; }
          var x0 = pos[k2 * 3], y0 = pos[k2 * 3 + 1] + 0.4, z0 = pos[k2 * 3 + 2], luz = 1;
          for(var s = 1; s < 170; s++){
            var d = s * PASO, yr = y0 + d * sube;
            if(yr > 60) break;
            var ht = alto(x0 + dx * d, z0 + dz * d);
            var v = (yr - ht) / (d * 0.05 + 0.4);
            if(v < luz){ luz = v; if(luz <= 0){ luz = 0; break; } }
          }
          sombra[k2] = luz;
        }
        fila++;
      }
      if(fila < NA){ setTimeout(tanda, 0); return; }
      fase = 2;
    }
    /* 3. la luz de cada vertice: sol con su sombra, cielo y un poco de
       rebote; el fondo del tajo ve menos cielo. Va aparte del color de la
       roca porque, donde hay mapa de luz horneado en Blender, este la reemplaza */
    var nor = g.attributes.normal.array, luzv = new Float32Array(nv * 3);
    var sol = new THREE.Color(0xFFD0A0).convertSRGBToLinear().multiplyScalar(2.5);
    var cieloA = new THREE.Color(0x92AED0).convertSRGBToLinear(), suelo = new THREE.Color(0x6A4E38).convertSRGBToLinear();
    for(var k3 = 0; k3 < nv; k3++){
      var nx = nor[k3 * 3], ny = nor[k3 * 3 + 1], nz = nor[k3 * 3 + 2];
      var ndl = Math.max(0, nx * TJ_SOL.x + ny * TJ_SOL.y + nz * TJ_SOL.z) * sombra[k3];
      var hk = pos[k3 * 3 + 1], ve = 1 - 0.32 * clamp(-hk / TJ_PROF, 0, 1);
      var w = 0.5 + 0.5 * ny;
      luzv[k3 * 3] = sol.r * ndl + (suelo.r + (cieloA.r - suelo.r) * w) * ve + 0.06;
      luzv[k3 * 3 + 1] = sol.g * ndl + (suelo.g + (cieloA.g - suelo.g) * w) * ve + 0.06;
      luzv[k3 * 3 + 2] = sol.b * ndl + (suelo.b + (cieloA.b - suelo.b) * w) * ve + 0.075;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.setAttribute('luzv', new THREE.BufferAttribute(luzv, 3));
    var m = new THREE.Mesh(g, tjMatTerreno());
    TJ.esc.add(m);
    TJ.terreno = m;
    tjTexturasTerreno(m.material, pos, luzv);
    /* para las maquinas: cuanta luz de sol hay donde estan */
    TJ.luzEn = function(x, z){
      var th = Math.atan2(z, x); if(th < 0) th += Math.PI * 2;
      var fa = th / (Math.PI * 2) * NA, a = Math.floor(fa) % NA;
      var R = RT[a], r = Math.hypot(x, z);
      var i = r <= R ? Math.round(r / R * NPIT) : NPIT + Math.round(NOUT * Math.pow(Math.min(1, (r - R) / (TJ_RMAX - R)), 1 / 1.8));
      return sombra[a * NR + Math.min(NR - 1, i)];
    };
    if(listo) listo();
  }
  tanda();
}

/* ═══ cielo, mar y luz ═══ */
var TJ_HOR = [0.84, 0.71, 0.60];      /* el color del horizonte (sRGB): cielo bajo y niebla */
function tjCielo(){
  var geo = new THREE.SphereGeometry(5000, 48, 24);
  var mat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { sol: { value: TJ_SOL.clone() }, hor: { value: new THREE.Vector3(TJ_HOR[0], TJ_HOR[1], TJ_HOR[2]) } },
    vertexShader: 'varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: [
      'uniform vec3 sol; uniform vec3 hor; varying vec3 vDir;',
      'vec3 lin(vec3 c){ return pow(c, vec3(2.2)); }',
      'void main(){',
      '  vec3 d = normalize(vDir);',
      '  float h = d.y;',
      '  float s = max(dot(d, normalize(sol)), 0.0);',
      '  vec3 cen = lin(vec3(0.10, 0.20, 0.34));',
      '  vec3 med = lin(vec3(0.36, 0.50, 0.64));',
      '  vec3 c = mix(lin(hor), med, smoothstep(0.015, 0.2, h));',
      '  c = mix(c, cen, smoothstep(0.12, 0.7, h));',
      '  c += lin(vec3(1.0, 0.62, 0.32)) * pow(s, 5.0) * 0.5 * (1.0 - smoothstep(0.0, 0.45, h));',
      '  c += lin(vec3(1.0, 0.88, 0.66)) * pow(s, 420.0) * 5.0;',
      '  c += lin(vec3(1.0, 0.76, 0.52)) * pow(s, 36.0) * 0.5;',
      '  if(h < 0.0) c = lin(hor);',
      '  gl_FragColor = vec4(c, 1.0);',
      '#include <tonemapping_fragment>',
      '#include <encodings_fragment>',
      '}'].join('\n')
  });
  var m = new THREE.Mesh(geo, mat);
  /* el cielo se dibuja despues de todo lo opaco: asi solo se calculan los
     pixeles de cielo que quedan a la vista (dibujado primero, se calculaba
     la pantalla entera y despues el terreno lo tapaba casi todo) */
  m.renderOrder = 1000;
  m.frustumCulled = false;
  return m;
}

/* un color lineal tal como sale en pantalla: tone mapping ACES (el mismo
   del shader de three r128, exposicion 1) y codificacion sRGB */
function tjPantalla(r, g, b){
  r /= 0.6; g /= 0.6; b /= 0.6;
  var x = 0.59719 * r + 0.35458 * g + 0.04823 * b, y = 0.07600 * r + 0.90834 * g + 0.01566 * b, z = 0.02840 * r + 0.13383 * g + 0.83777 * b;
  var f = function(v){ return (v * (v + 0.0245786) - 0.000090537) / (v * (0.983729 * v + 0.4329510) + 0.238081); };
  x = f(x); y = f(y); z = f(z);
  var o = [1.60475 * x - 0.53108 * y - 0.07367 * z, -0.10208 * x + 1.10813 * y - 0.00605 * z, -0.00327 * x - 0.07276 * y + 1.07602 * z];
  var s = function(v){ v = clamp(v, 0, 1); return v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 0.41666) - 0.055; };
  return new THREE.Color().setRGB(s(o[0]), s(o[1]), s(o[2]));
}

/* reflejos: el mismo cielo, pasado a mapa de entorno */
function tjEntorno(cielo){
  var esc = new THREE.Scene();
  esc.add(cielo.clone());
  var pm = new THREE.PMREMGenerator(TJ.rend);
  var rt = pm.fromScene(esc, 0.04);
  pm.dispose();
  return rt.texture;
}

/* olas del mar: normales sacadas de un ruido */
function tjTexOlas(){
  var N = 256, c = document.createElement('canvas'); c.width = c.height = N;
  var g = c.getContext('2d'), im = g.createImageData(N, N);
  var alt = function(x, y){ return tjFbm(x / N * 9, y / N * 5, 4) + Math.sin(y / N * Math.PI * 14) * 0.08; };
  for(var y = 0; y < N; y++) for(var x = 0; x < N; x++){
    var dx = alt((x + 1) % N, y) - alt((x - 1 + N) % N, y), dy = alt(x, (y + 1) % N) - alt(x, (y - 1 + N) % N);
    var k = (y * N + x) * 4;
    im.data[k] = 128 + dx * 220; im.data[k + 1] = 128 + dy * 220; im.data[k + 2] = 255; im.data[k + 3] = 255;
  }
  g.putImageData(im, 0, 0);
  var t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(40, 40);
  return t;
}

/* ═══ fusion: un modelo de detalle a pocas mallas ═══
   particion(malla, centro) dice a que grupo va cada pieza ('base', 'sup',
   'tolva'); dentro de cada grupo, una malla por tipo de superficie, con el
   color de cada pieza en sus vertices. pivotes[grupo] = el punto sobre el
   que gira ese grupo. */
var _tjMats = null;
function tjMatsBase(){
  if(_tjMats) return _tjMats;
  _tjMats = {
    mate:   { roughness: 0.80, metalness: 0.0 },
    brillo: { roughness: 0.42, metalness: 0.05 },
    metal:  { roughness: 0.38, metalness: 0.65 }
  };
  return _tjMats;
}
function tjFusionar(raiz, particion, pivotes){
  raiz.updateMatrixWorld(true);
  var inv = new THREE.Matrix4().copy(raiz.matrixWorld).invert();
  var lotes = {};
  var m4 = new THREE.Matrix4(), im = new THREE.Matrix4(), cen = new THREE.Vector3(), cc = new THREE.Color();
  var v = new THREE.Vector3(), w = new THREE.Vector3(), nm = new THREE.Matrix3();
  function clase(mat){
    if(mat.map) return 'tex' + mat.map.uuid;
    if(mat.transparent && mat.opacity < 0.99) return 'vid' + mat.opacity.toFixed(2);
    if(mat.emissive && (mat.emissive.r + mat.emissive.g + mat.emissive.b) > 0.05)
      return 'luz' + mat.emissive.getHexString() + (mat.emissiveIntensity || 1).toFixed(1);
    if((mat.metalness || 0) >= 0.5) return 'metal';
    if((mat.roughness === undefined ? 1 : mat.roughness) < 0.5) return 'brillo';
    return 'mate';
  }
  function agregar(malla, geo, mat, matriz){
    var p = geo.attributes.position;
    if(!p) return;
    if(!geo.boundingSphere) geo.computeBoundingSphere();
    /* tuercas, pernos, cables: a la distancia de la camara no se ven */
    if(geo.boundingSphere.radius * matriz.getMaxScaleOnAxis() < 0.15) return;
    /* los anillos finos (pestanas y aros de traba de las llantas, mangueras en
       lazo) son casi la mitad de los triangulos de una rueda y desde el dron
       no se distinguen */
    if(geo.type === 'TorusGeometry' && geo.parameters && geo.parameters.tube * matriz.getMaxScaleOnAxis() < 0.12) return;
    cen.copy(geo.boundingSphere.center).applyMatrix4(matriz);
    var grupo = particion ? particion(malla, cen) : 'base';
    var piv = pivotes && pivotes[grupo];
    /* las piezas chicas van aparte: de lejos se apagan (nivel de detalle) */
    var fino = geo.boundingSphere.radius * matriz.getMaxScaleOnAxis() < 0.5 || (malla.isInstancedMesh && malla.count > 8);
    var cl = clase(mat), clave = grupo + '|' + cl + '|' + (mat.side === THREE.DoubleSide ? 'd' : 's') + (fino ? '|f' : '');
    var L = lotes[clave];
    if(!L) L = lotes[clave] = { grupo: grupo, mat: mat, cl: cl, pos: [], nor: [], col: [], uv: [], idx: [], n: 0, conUv: !!mat.map, fino: fino };
    var mm = matriz.clone();
    if(piv) mm.premultiply(new THREE.Matrix4().makeTranslation(-piv.x, -piv.y, -piv.z));
    nm.getNormalMatrix(mm);
    var nrm = geo.attributes.normal, u = geo.attributes.uv, vc = mat.vertexColors && geo.attributes.color;
    /* algunos modelos ya pasaron sus colores a lineal (userData.lin): no dos veces */
    if(mat.map) cc.setRGB(1, 1, 1);
    else { cc.copy(mat.color || cc.setRGB(1, 1, 1)); if(!mat.userData.lin) cc.convertSRGBToLinear(); }
    var base = L.n;
    for(var i = 0; i < p.count; i++){
      v.fromBufferAttribute(p, i).applyMatrix4(mm);
      L.pos.push(v.x, v.y, v.z);
      if(nrm){ w.fromBufferAttribute(nrm, i).applyMatrix3(nm).normalize(); L.nor.push(w.x, w.y, w.z); }
      else L.nor.push(0, 1, 0);
      if(vc) L.col.push(cc.r * vc.getX(i), cc.g * vc.getY(i), cc.b * vc.getZ(i));
      else L.col.push(cc.r, cc.g, cc.b);
      if(L.conUv){ if(u) L.uv.push(u.getX(i), u.getY(i)); else L.uv.push(0, 0); }
    }
    if(geo.index){ for(var k = 0; k < geo.index.count; k++) L.idx.push(base + geo.index.getX(k)); }
    else { for(var k2 = 0; k2 < p.count; k2++) L.idx.push(base + k2); }
    L.n += p.count;
  }
  raiz.traverse(function(o){
    if(!o.isMesh || !o.visible || !o.material || Array.isArray(o.material)) return;
    if(o.isInstancedMesh){
      for(var i = 0; i < o.count; i++){
        o.getMatrixAt(i, im);
        m4.multiplyMatrices(o.matrixWorld, im).premultiply(inv);
        agregar(o, o.geometry, o.material, m4.clone());
      }
    } else {
      m4.multiplyMatrices(inv, o.matrixWorld);
      agregar(o, o.geometry, o.material, m4.clone());
    }
  });
  var grupos = {}, mats = [], finos = [], MB = tjMatsBase();
  Object.keys(lotes).forEach(function(k){
    var L = lotes[k];
    var g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(L.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(L.nor, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(L.col, 3));
    if(L.conUv) g.setAttribute('uv', new THREE.Float32BufferAttribute(L.uv, 2));
    g.setIndex(L.n > 65535 ? new THREE.Uint32BufferAttribute(L.idx, 1) : new THREE.Uint16BufferAttribute(L.idx, 1));
    var o = L.mat, mat;
    if(L.cl.indexOf('tex') === 0){
      mat = o.clone();
      if(mat.color) mat.color.convertSRGBToLinear();
    } else if(L.cl.indexOf('vid') === 0){
      mat = new THREE.MeshStandardMaterial({ roughness: 0.08, metalness: 0.3, transparent: true, opacity: o.opacity });
    } else if(L.cl.indexOf('luz') === 0){
      mat = new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0,
        emissive: o.emissive.clone().convertSRGBToLinear(), emissiveIntensity: o.emissiveIntensity || 1 });
    } else {
      mat = new THREE.MeshStandardMaterial(MB[L.cl]);
    }
    mat.vertexColors = true;
    mat.side = o.side;
    mat.userData.c0 = mat.color.clone();
    mats.push(mat);
    var malla = new THREE.Mesh(g, mat);
    if(L.fino){ malla.userData.fino = true; finos.push(malla); }
    if(!grupos[L.grupo]){
      grupos[L.grupo] = new THREE.Group();
      var pv = pivotes && pivotes[L.grupo];
      if(pv) grupos[L.grupo].position.copy(pv);
    }
    grupos[L.grupo].add(malla);
  });
  grupos._mats = mats;
  grupos._finos = finos;
  return grupos;
}

/* lo que queda del modelo original despues de fusionar: solo las geometrias;
   los materiales y sus texturas los siguen usando las copias fusionadas */
function tjLiberar(G){ G.traverse(function(m){ if(m.geometry) m.geometry.dispose(); }); }

/* construye un equipo de la flota con su modelo registrado */
function tjEquipo(id){
  var e = null;
  for(var i = 0; i < TODOS.length; i++) if(TODOS[i].id === id){ e = TODOS[i]; break; }
  if(!e) return null;
  var reg = modelo3dRegistrado(e);
  if(!reg) return null;
  return reg.def.construir(e, [], reg.k.slice(2));
}
function tjEsTolva(o){
  for(var p = o; p; p = p.parent) if(p.userData && p.userData.esTolvaG) return true;
  return false;
}
/* las ruedas de un modelo, agrupadas por eje: cada eje es un grupo que gira
   sobre su centro (el modelo las marca con userData.rueda). Devuelve los
   pivotes por eje; cada malla de rueda queda marcada con su eje (ejeTj) */
function tjEjes(G){
  G.updateMatrixWorld(true);
  var inv = new THREE.Matrix4().copy(G.matrixWorld).invert(), acu = {}, p = new THREE.Vector3();
  G.traverse(function(o){
    if(!o.userData || !o.userData.rueda) return;
    p.setFromMatrixPosition(o.matrixWorld).applyMatrix4(inv);
    var k = 'eje' + Math.round(p.x * 2);
    if(!acu[k]) acu[k] = { x: 0, y: 0, n: 0 };
    acu[k].x += p.x; acu[k].y += p.y; acu[k].n++;
    o.userData.ejeTj = k;
  });
  var piv = {};
  Object.keys(acu).forEach(function(k){ piv[k] = new THREE.Vector3(acu[k].x / acu[k].n, acu[k].y / acu[k].n, 0); });
  return piv;
}
function tjEjeDe(m){
  for(var p = m; p; p = p.parent) if(p.userData && p.userData.ejeTj) return p.userData.ejeTj;
  return null;
}
/* arma el grupo final con sus medidas para la sombra; los ejes, si hay, quedan
   en userData.ejes con su radio (el pivote esta a la altura del eje) */
function tjArmar(gr, nombres, ejes){
  var T = new THREE.Group();
  nombres.forEach(function(n){ if(gr[n]) T.add(gr[n]); });
  T.userData.ejes = [];
  if(ejes) Object.keys(ejes).forEach(function(k){
    if(!gr[k]) return;
    T.add(gr[k]);
    T.userData.ejes.push({ g: gr[k], r: Math.max(0.3, ejes[k].y) });
  });
  T.userData.mats = gr._mats;
  T.userData.finos = gr._finos || [];
  T.userData.cerca = true;
  if(TJ && TJ.lod) TJ.lod.push(T);
  var bb = new THREE.Box3().setFromObject(T), sz = bb.getSize(new THREE.Vector3());
  T.userData.med = { L: sz.x, W: sz.z, H: sz.y };
  T.userData.xTras = bb.max.x;      /* hasta donde llega la cola (el frente mira a -X) */
  T.userData.luz = 1;
  return T;
}
/* hace rodar las ruedas segun lo que avanzo la maquina desde el cuadro
   anterior: hacia adelante (-X) giran en un sentido, en reversa en el otro */
var _tjAde = null, _tjDel = null;
function tjRodar(obj){
  var E = obj.userData.ejes;
  if(!E || !E.length) return;
  if(!_tjAde){ _tjAde = new THREE.Vector3(); _tjDel = new THREE.Vector3(); }
  var prev = obj.userData.prev;
  if(!prev){ obj.userData.prev = obj.position.clone(); return; }
  _tjDel.subVectors(obj.position, prev);
  prev.copy(obj.position);
  if(_tjDel.lengthSq() > 400) return;           /* un salto no es rodar */
  _tjAde.set(-1, 0, 0).applyQuaternion(obj.quaternion);
  var s = _tjDel.dot(_tjAde);
  for(var i = 0; i < E.length; i++) E[i].g.rotation.z += s / E[i].r;
}

/* la carga: un monton de mineral con la forma de la caja, mas alto al centro
   y con lomo, color de mineral de hierro con vetas, y bolones encima. Se arma
   en coordenadas de la tolva midiendo su borde trasero (la parte delantera es
   la visera sobre la cabina) */
function tjCarga(tolva, mats){
  var x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9, y0 = 1e9, y1 = -1e9, v = new THREE.Vector3();
  tolva.children.forEach(function(m){
    var p = m.geometry && m.geometry.attributes.position;
    if(!p) return;
    for(var i = 0; i < p.count; i++){
      v.fromBufferAttribute(p, i);
      if(v.x < x0) x0 = v.x; if(v.x > x1) x1 = v.x; if(v.z < z0) z0 = v.z; if(v.z > z1) z1 = v.z;
      if(v.y < y0) y0 = v.y; if(v.y > y1) y1 = v.y;
    }
  });
  if(x1 <= x0) return null;
  /* el borde: lo mas alto de la mitad de atras de la caja */
  var xm = (x0 + x1) / 2, borde = -1e9;
  tolva.children.forEach(function(m){
    var p = m.geometry && m.geometry.attributes.position;
    if(!p) return;
    for(var i = 0; i < p.count; i++){ v.fromBufferAttribute(p, i); if(v.x > xm && v.y > borde) borde = v.y; }
  });
  var Lx = x1 - x0, Wz = z1 - z0;
  var xa = x0 + Lx * 0.30, xb = x1 - Lx * 0.07, zh = Wz * 0.40;
  var base = borde - (borde - y0) * 0.45, pico = borde - base + Math.max(0.6, Lx * 0.085);
  var NX = 26, NZ = 14, pos = [], col = [], idx = [];
  var oscuro = new THREE.Color('#3B2C27').convertSRGBToLinear(), rojizo = new THREE.Color('#7A4632').convertSRGBToLinear(),
      gris = new THREE.Color('#6A615C').convertSRGBToLinear(), cc = new THREE.Color();
  var alto = function(u, w){
    var f = (1 - Math.pow(Math.abs(w), 2.2)) * (1 - Math.pow(Math.abs(u), 3.0));
    return pico * Math.pow(Math.max(0, f), 0.7);
  };
  for(var j = 0; j <= NZ; j++) for(var i = 0; i <= NX; i++){
    var u = i / NX * 2 - 1, w = j / NZ * 2 - 1;
    var x = (xa + xb) / 2 + u * (xb - xa) / 2, z = w * zh;
    var f = alto(u, w);
    var n = tjFbm(x * 1.4 + 3, z * 1.4, 3);
    pos.push(x, f + (n - 0.5) * 0.5 * Math.min(1, f / 0.6), z);
    cc.copy(oscuro).lerp(rojizo, clamp(n * 1.6 - 0.4, 0, 1)).lerp(gris, clamp(tjRuido(x * 3, z * 3) - 0.55, 0, 1));
    col.push(cc.r, cc.g, cc.b);
  }
  for(var j2 = 0; j2 < NZ; j2++) for(var i2 = 0; i2 < NX; i2++){
    var a = j2 * (NX + 1) + i2, b = a + 1, c = a + NX + 1, d = c + 1;
    idx.push(a, c, b, b, c, d);
  }
  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  var mm = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: true });
  mm.userData.c0 = mm.color.clone(); mats.push(mm);
  var R = new THREE.Group();
  R.add(new THREE.Mesh(g, mm));
  /* bolones sueltos encima */
  var mb = new THREE.MeshStandardMaterial({ color: new THREE.Color('#4E3A31').convertSRGBToLinear(), roughness: 1, flatShading: true });
  mb.userData.c0 = mb.color.clone(); mats.push(mb);
  var nb = 18, ib = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), mb, nb), m4 = new THREE.Matrix4();
  for(var k = 0; k < nb; k++){
    var uu = (tjHash(k, 21) - 0.5) * 1.5, ww = (tjHash(k, 22) - 0.5) * 1.4, s = (0.18 + tjHash(k, 23) * 0.32) * Math.min(1, Lx / 9);
    var bx = (xa + xb) / 2 + uu * (xb - xa) / 2, bz = ww * zh;
    m4.compose(new THREE.Vector3(bx, alto(uu, ww) + s * 0.3, bz),
               new THREE.Quaternion().setFromEuler(new THREE.Euler(k, k * 1.7, k * 2.3)),
               new THREE.Vector3(s, s * 0.75, s * 0.9));
    ib.setMatrixAt(k, m4);
  }
  R.add(ib);
  R.position.y = base;
  R.userData = { centro: new THREE.Vector3((xa + xb) / 2, borde, 0), cola: x1, borde: borde, ancho: zh };
  tolva.add(R);
  return R;
}

/* camion: cuerpo, tolva (bascula sobre su pivote) y ejes (ruedan) */
function tjCamion(id){
  var G = tjEquipo(id);
  if(!G) return null;
  var tg = G.userData.tolvaG, pt = G.userData.pivTolva ? G.userData.pivTolva.clone() : null;
  if(tg) tg.userData.esTolvaG = true;
  var ejes = tjEjes(G), piv = {};
  Object.keys(ejes).forEach(function(k){ piv[k] = ejes[k]; });
  if(pt) piv.tolva = pt;
  var gr = tjFusionar(G, function(m){
    var e = tjEjeDe(m);
    if(e) return e;
    return tg && tjEsTolva(m) ? 'tolva' : 'base';
  }, piv);
  tjLiberar(G);
  var T = tjArmar(gr, ['base', 'tolva'], ejes);
  T.userData.tolva = gr.tolva || null;
  if(gr.tolva) T.userData.roca = tjCarga(gr.tolva, T.userData.mats);
  return T;
}
/* pala o excavadora, en tres piezas que se mueven: la casa gira sobre su eje
   (el modelo dice donde esta: giroX), el equipo frontal cuelga de la casa y
   sube sobre el pie de la pluma (pie), y el cucharon cuelga del equipo y se
   abre sobre su bisagra (la almeja de la pala, el cucharon de la retro). Las
   orugas se quedan: lo que esta bajo y a los costados, dentro del largo del
   tren. Todo lo demas delante de la casa (frente) va con el equipo frontal. */
function tjCargador(id, yCorte, xMax, zOruga){
  var G = tjEquipo(id);
  if(!G) return null;
  var U = G.userData, gx = U.giroX || 0;
  var piv = { sup: new THREE.Vector3(gx, 0, 0) };
  if(U.pie) piv.brazo = new THREE.Vector3(U.pie[0], U.pie[1], 0);
  if(U.bisagra) piv.balde = new THREE.Vector3(U.bisagra[0], U.bisagra[1], 0);
  if(U.pivPalo) piv.palo = new THREE.Vector3(U.pivPalo[0], U.pivPalo[1], 0);
  var marca = function(m, k){ for(var q = m; q; q = q.parent) if(q.userData && q.userData[k]) return true; return false; };
  /* en la retro, lo del equipo frontal que no es de un subgrupo (cilindros,
     bielas) va con la pieza mas cercana: la pluma o el brazo */
  var aSeg = function(c, a, b){
    var dx = b[0] - a[0], dy = b[1] - a[1], t = clamp(((c.x - a[0]) * dx + (c.y - a[1]) * dy) / (dx * dx + dy * dy), 0, 1);
    return Math.hypot(c.x - a[0] - dx * t, c.y - a[1] - dy * t);
  };
  var frontal = function(c){
    if(U.pivPalo && U.bisagra && aSeg(c, U.pivPalo, U.bisagra) < aSeg(c, U.pie, U.pivPalo)) return 'palo';
    return 'brazo';
  };
  var gr = tjFusionar(G, function(m, c){
    if(U.bisagra && (marca(m, 'almeja') || marca(m, 'cucharon'))) return 'balde';
    if(U.pivPalo && marca(m, 'palo')) return 'palo';
    if(U.pie && marca(m, 'equipo')) return 'brazo';
    if(marca(m, 'casa')) return 'sup';
    var x = c.x - gx;
    if(c.y < yCorte + 0.1 && Math.abs(c.z) > zOruga && Math.abs(x) < xMax) return 'base';
    if(U.pie && U.frente !== undefined && c.x < U.frente) return frontal(c);
    return c.y > yCorte || Math.abs(x) > xMax ? 'sup' : 'base';
  }, piv);
  tjLiberar(G);
  var T = tjArmar(gr, ['base', 'sup']);
  T.userData.sup = gr.sup;
  T.userData.giroX = gx;
  /* la jerarquia: casa > equipo frontal > cucharon (cada pivote, relativo a su padre) */
  if(gr.brazo && gr.sup){ gr.brazo.position.sub(gr.sup.position); gr.sup.add(gr.brazo); T.userData.brazo = gr.brazo; }
  /* el brazo de la retro cuelga de la pluma y gira en su pasador (se estira) */
  if(gr.palo && gr.brazo){ gr.palo.position.sub(piv.brazo); gr.brazo.add(gr.palo); T.userData.palo = gr.palo; }
  if(gr.balde && (gr.brazo || gr.sup)){
    var padre = gr.palo || gr.brazo || gr.sup;
    gr.balde.position.sub(gr.palo ? piv.palo : gr.brazo ? piv.brazo : piv.sup);
    padre.add(gr.balde);
    T.userData.balde = gr.balde;
    /* el centro del cucharon, para que las piedras salgan de ahi */
    var bb = new THREE.Box3();
    gr.balde.children.forEach(function(m){ if(m.geometry){ m.geometry.computeBoundingBox(); bb.union(m.geometry.boundingBox); } });
    T.userData.centroBalde = bb.isEmpty() ? new THREE.Vector3() : bb.getCenter(new THREE.Vector3());
    /* el material dentro del cucharon: un monton de roca que asoma por la boca;
       se llena al excavar y se vacia al abrir (tjPoseCargador) */
    if(!bb.isEmpty()){
      var sz = bb.getSize(new THREE.Vector3());
      var gm = new THREE.DodecahedronGeometry(1, 1), pm = gm.attributes.position;
      for(var i = 0; i < pm.count; i++){
        var k = 1 + (tjHash(Math.round(pm.getX(i) * 50), Math.round(pm.getY(i) * 50 + pm.getZ(i) * 30)) - 0.5) * 0.35;
        pm.setXYZ(i, pm.getX(i) * k, pm.getY(i) * k, pm.getZ(i) * k);
      }
      gm.computeVertexNormals();
      var mc = new THREE.MeshStandardMaterial({ color: new THREE.Color('#57402F').convertSRGBToLinear(), roughness: 1, flatShading: true });
      mc.userData.c0 = mc.color.clone(); T.userData.mats.push(mc);
      var carga = new THREE.Mesh(gm, mc);
      /* la boca del cucharon: del lado contrario al casco (el promedio de los
         vertices cae hacia la espalda y el fondo); el monton se corre hacia ahi
         para que asome */
      var prom = new THREE.Vector3(), nv = 0, vv = new THREE.Vector3();
      gr.balde.children.forEach(function(m){
        var pa = m.geometry && m.geometry.attributes.position;
        if(!pa) return;
        for(var q = 0; q < pa.count; q += 3){ prom.add(vv.fromBufferAttribute(pa, q)); nv++; }
      });
      var boca = nv ? T.userData.centroBalde.clone().sub(prom.multiplyScalar(1 / nv)) : new THREE.Vector3(0, 1, 0);
      if(boca.lengthSq() < 1e-6) boca.set(0, 1, 0);
      boca.normalize();
      carga.position.copy(T.userData.centroBalde).addScaledVector(boca, Math.min(sz.x, sz.y, sz.z) * 0.22);
      carga.scale.set(sz.x * 0.34, sz.y * 0.34, sz.z * 0.36);
      carga.userData.s0 = carga.scale.clone();
      carga.visible = false;
      gr.balde.add(carga);
      T.userData.cargaBalde = carga;
    }
  }
  return T;
}
/* mide donde queda el cucharon en la pose de vaciar (casa sin girar, frente
   arriba): a que distancia del eje de giro, en que angulo y a que altura.
   Con eso se apunta el giro a la tolva y se pone el camion al alcance */
function tjMedirAlcance(obj){
  var U = obj.userData;
  if(!U.balde) return;
  tjPoseCargador(obj, 0, 1, 0, 0);
  obj.updateMatrixWorld(true);
  var l = obj.worldToLocal(U.balde.localToWorld(U.centroBalde.clone()));
  l.x -= U.giroX || 0;
  U.alcance = Math.hypot(l.x, l.z);
  U.angBalde = Math.atan2(-l.z, l.x);
  U.altoBalde = l.y;
  tjPoseCargador(obj, 0, 0, 0, 0);
  obj.updateMatrixWorld(true);
}
/* el giro de la casa (relativo al cuerpo) que deja el cucharon sobre un punto */
function tjGiroHacia(obj, p){
  obj.updateWorldMatrix(true, false);
  var ax = obj.localToWorld(new THREE.Vector3(obj.userData.giroX || 0, 0, 0));
  var a = Math.atan2(-(p.z - ax.z), p.x - ax.x) - obj.rotation.y - (obj.userData.angBalde || Math.PI);
  while(a > Math.PI) a -= Math.PI * 2; while(a < -Math.PI) a += Math.PI * 2;
  return a;
}
/* el centro de la carga de un camion, en el mundo */
function tjCentroCarga(cam){
  var t = cam.tolva || cam.userData && cam.userData.tolva, r = cam.roca || cam.userData && cam.userData.roca;
  if(!t || !r) return null;
  t.updateWorldMatrix(true, false);
  return t.localToWorld(r.userData.centro.clone());
}
function tjFijo(id){
  var G = tjEquipo(id);
  if(!G) return null;
  var ejes = tjEjes(G);
  var gr = tjFusionar(G, function(m){ return tjEjeDe(m) || 'base'; }, ejes);
  tjLiberar(G);
  return tjArmar(gr, ['base'], ejes);
}

/* ═══ el camino, medido: de u a metros y de vuelta ═══ */
function tjTabla(){
  var N = 1600, u = [], s = [0], p0 = tjPuntoRampa(TJ_UTOP), acu = 0;
  u.push(TJ_UTOP);
  for(var i = 1; i <= N; i++){
    var uu = TJ_UTOP + (TJ_UBOT - TJ_UTOP) * i / N, p = tjPuntoRampa(uu);
    acu += Math.hypot(p.x - p0.x, p.y - p0.y, p.z - p0.z);
    u.push(uu); s.push(acu); p0 = p;
  }
  return { u: u, s: s, L: acu };
}
function tjUdeS(s){
  var T = TJ.tabla, a = 0, b = T.s.length - 1;
  s = clamp(s, 0, T.L);
  while(b - a > 1){ var m = (a + b) >> 1; if(T.s[m] < s) a = m; else b = m; }
  var f = (s - T.s[a]) / ((T.s[b] - T.s[a]) || 1);
  return T.u[a] + (T.u[b] - T.u[a]) * f;
}
/* punto del carril: lado +1 afuera (pared), -1 adentro (vacio) */
function tjCarril(u, lado){
  var a = tjPuntoRampa(u), b = tjPuntoRampa(u + 0.0008);
  var tx = b.x - a.x, tz = b.z - a.z, L = Math.hypot(tx, tz) || 1;
  var nx = tz / L, nz = -tx / L;
  if(nx * a.x + nz * a.z < 0){ nx = -nx; nz = -nz; }
  var d = lado * TJ_CARRIL;
  return { x: a.x + nx * d, y: a.y, z: a.z + nz * d };
}
/* la pose de un camion en la rampa: posicion y giro (con la pendiente) */
var _tjDum = null;
function tjPoseRampa(s, dir, out){
  if(!_tjDum) _tjDum = new THREE.Object3D();
  var lado = dir < 0 ? 1 : -1;                /* sube cargado junto a la pared */
  var u = tjUdeS(s), u2 = clamp(u + (dir > 0 ? 0.004 : -0.004), TJ_UTOP - 0.01, TJ_UBOT + 0.01);
  var a = tjCarril(u, lado), b = tjCarril(u2, lado);
  if(Math.abs(u2 - u) < 1e-6){ b = a; a = tjCarril(u - (dir > 0 ? 0.004 : -0.004), lado); }
  orientarCamion(_tjDum, a, b);
  out.x = a.x; out.y = a.y - 0.15; out.z = a.z;
  out.q = _tjDum.quaternion.clone();
  out.dx = b.x - a.x; out.dz = b.z - a.z;
  var l = Math.hypot(out.dx, out.dz) || 1; out.dx /= l; out.dz /= l;
  return out;
}

/* ═══ maniobras: curvas de Bezier que el camion recorre de frente o en reversa ═══ */
function tjBez(p0, p1, p2, p3, t, out){
  var a = 1 - t, b0 = a * a * a, b1 = 3 * a * a * t, b2 = 3 * a * t * t, b3 = t * t * t;
  out.x = b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x;
  out.z = b0 * p0.z + b1 * p1.z + b2 * p2.z + b3 * p3.z;
  return out;
}
function tjTramo(p0, p1, p2, p3, rev, vel){
  var L = 0, a = { x: 0, z: 0 }, b = { x: p0.x, z: p0.z };
  for(var i = 1; i <= 24; i++){ tjBez(p0, p1, p2, p3, i / 24, a); L += Math.hypot(a.x - b.x, a.z - b.z); b.x = a.x; b.z = a.z; }
  return { p: [p0, p1, p2, p3], rev: rev, dur: Math.max(1500, L / vel * 1000) };
}
/* apoya un camion en el terreno: mide la altura bajo el frente, la cola y los
   dos costados, y lo inclina como corresponde (cabeceo y alabeo, suavizados
   entre cuadros). Asi, al pasar de la rampa al piso o por un borde, ninguna
   esquina queda enterrada */
var _tjAp = {};
function tjApoyar(c, x, z, rumbo, hC){
  var obj = c.obj, M = obj.userData.med, lp = M.L * 0.4, wp = M.W * 0.4;
  var fx = -Math.cos(rumbo), fz = Math.sin(rumbo), sx = fz, sz = -fx;   /* adelante (-X local) y costado izquierdo (+Z local) */
  var h = function(u, w){ tjSuelo(x + fx * u + sx * w, z + fz * u + sz * w, _tjAp); return _tjAp.h; };
  var hF = h(lp, 0), hB = h(-lp, 0), hL = h(0, wp), hR = h(0, -wp);
  var cab = -Math.atan2(hF - hB, 2 * lp), ala = -Math.atan2(hL - hR, 2 * wp);
  if(c.cab === undefined){ c.cab = cab; c.ala = ala; }
  c.cab += (cab - c.cab) * 0.3; c.ala += (ala - c.ala) * 0.3;
  obj.position.set(x, Math.max(hC, (hF + hB) / 2, (hL + hR) / 2) - 0.05, z);
  if(!_tjEu) _tjEu = new THREE.Euler();
  obj.quaternion.setFromEuler(_tjEu.set(c.ala, rumbo, c.cab, 'YXZ'));
}
/* coloca el camion en la maniobra (lista de tramos) al tiempo t; devuelve true al terminar */
var _tjEu = null;
function tjManiobra(c, dt){
  var M = c.man, tr = M.tramos[M.i];
  M.t += dt;
  var f = Math.min(1, M.t / tr.dur), e = f * f * (3 - 2 * f);
  var a = tjBez(tr.p[0], tr.p[1], tr.p[2], tr.p[3], e, {}), b = tjBez(tr.p[0], tr.p[1], tr.p[2], tr.p[3], Math.min(1, e + 0.02), {});
  if(e >= 0.98){ var a0 = tjBez(tr.p[0], tr.p[1], tr.p[2], tr.p[3], 0.96, {}); b = { x: a.x + (a.x - a0.x), z: a.z + (a.z - a0.z) }; }
  var dx = b.x - a.x, dz = b.z - a.z;
  if(tr.rev){ dx = -dx; dz = -dz; }
  var o = {}; tjSuelo(a.x, a.z, o);
  var obj = c.obj;
  if(dx * dx + dz * dz > 1e-8) c.rumbo = tjMirar(dx, dz);
  tjApoyar(c, a.x, a.z, c.rumbo || 0, o.h);
  /* polvo de las llantas tambien en la maniobra */
  if(Math.random() < 0.3) tjSoltar(TJ.polvo, a.x + (Math.random() - 0.5) * 5, o.h + 1, a.z + (Math.random() - 0.5) * 5, 5, 1.4, 3000, 0, 0.22);
  if(M.t >= tr.dur){ M.i++; M.t = 0; }
  return M.i >= M.tramos.length;
}

/* ═══ particulas: polvo con tamano y transparencia por particula ═══ */
function tjPolvo(n){
  var g = new THREE.BufferGeometry();
  var pos = new Float32Array(n * 3), tam = new Float32Array(n), alfa = new Float32Array(n), tono = new Float32Array(n);
  for(var i = 0; i < n; i++) pos[i * 3 + 1] = -9999;
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('tam', new THREE.BufferAttribute(tam, 1));
  g.setAttribute('alfa', new THREE.BufferAttribute(alfa, 1));
  g.setAttribute('tono', new THREE.BufferAttribute(tono, 1));
  var c = document.createElement('canvas'); c.width = c.height = 64;
  var x = c.getContext('2d'), rg = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.45, 'rgba(255,255,255,.55)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = rg; x.fillRect(0, 0, 64, 64);
  var mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { mapa: { value: new THREE.CanvasTexture(c) }, escala: { value: 600 },
                c1: { value: new THREE.Color('#C9A784').convertSRGBToLinear() },
                c2: { value: new THREE.Color('#E8E2D8').convertSRGBToLinear() } },
    vertexShader: 'attribute float tam; attribute float alfa; attribute float tono; uniform float escala; varying float vA; varying float vT;\n'
      + 'void main(){ vA = alfa; vT = tono; vec4 mv = modelViewMatrix * vec4(position, 1.0);\n'
      + ' gl_PointSize = min(tam * escala / -mv.z, 140.0); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'uniform sampler2D mapa; uniform vec3 c1; uniform vec3 c2; varying float vA; varying float vT;\n'
      + 'void main(){ vec4 t = texture2D(mapa, gl_PointCoord); gl_FragColor = vec4(mix(c1, c2, vT), t.a * vA);\n'
      + '#include <tonemapping_fragment>\n#include <encodings_fragment>\n}'
  });
  var pts = new THREE.Points(g, mat);
  pts.frustumCulled = false;
  pts.renderOrder = 5;
  return { pts: pts, n: n, i: 0, p: [] };
}
/* suelta una bocanada: x,y,z, tamano inicial, velocidad de subida, vida en ms, tono (0 tierra, 1 agua) */
function tjSoltar(P, x, y, z, tam, sube, vida, tono, alfa){
  if(!P) return;
  var s = P.p[P.i];
  if(!s) s = P.p[P.i] = {};
  s.x = x; s.y = y; s.z = z; s.t0 = tam; s.v = sube; s.vida = vida; s.edad = 0; s.tono = tono || 0; s.a = alfa || 0.5;
  /* la brisa del mar empuja el polvo tierra adentro */
  s.vx = (Math.random() - 0.5) * 1.2 + 1.6; s.vz = (Math.random() - 0.5) * 1.2 - 0.5;
  P.i = (P.i + 1) % P.n;
}
function tjPasoPolvo(P, dt){
  var g = P.pts.geometry, pos = g.attributes.position.array, tam = g.attributes.tam.array,
      alfa = g.attributes.alfa.array, tono = g.attributes.tono.array;
  for(var i = 0; i < P.n; i++){
    var s = P.p[i];
    if(!s || s.edad >= s.vida){ pos[i * 3 + 1] = -9999; alfa[i] = 0; continue; }
    s.edad += dt;
    var f = s.edad / s.vida, seg = dt / 1000;
    s.x += s.vx * seg; s.z += s.vz * seg; s.y += s.v * seg * (1 - f * 0.6);
    pos[i * 3] = s.x; pos[i * 3 + 1] = s.y; pos[i * 3 + 2] = s.z;
    tam[i] = s.t0 * (1 + f * 2.6);
    alfa[i] = s.a * Math.sin(Math.min(1, f * 4) * Math.PI / 2) * (1 - f);
    tono[i] = s.tono;
  }
  g.attributes.position.needsUpdate = true; g.attributes.tam.needsUpdate = true;
  g.attributes.alfa.needsUpdate = true; g.attributes.tono.needsUpdate = true;
}

/* ═══ piedras que caen: del cucharon a la tolva y de la tolva a la chancadora ═══
   Un solo InstancedMesh con su fisica simple (gravedad y giro); cada piedra
   desaparece al llegar a su altura final, a veces con una bocanada de polvo */
var _tjCero = null;
function tjPiedras(n){
  var mat = new THREE.MeshStandardMaterial({ color: new THREE.Color('#4A372E').convertSRGBToLinear(), roughness: 1, flatShading: true });
  var im = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), mat, n);
  im.frustumCulled = false;
  _tjCero = new THREE.Matrix4().makeScale(0, 0, 0);
  for(var i = 0; i < n; i++) im.setMatrixAt(i, _tjCero);
  return { im: im, n: n, i: 0, p: [], q: new THREE.Quaternion(), m: new THREE.Matrix4(), e: new THREE.Euler(),
           s: new THREE.Vector3(), v: new THREE.Vector3() };
}
function tjLanzar(x, y, z, vx, vy, vz, r, yFin){
  var P = TJ.piedras;
  if(!P) return;
  var k = P.i; P.i = (P.i + 1) % P.n;
  P.p[k] = { x: x, y: y, z: z, vx: vx, vy: vy, vz: vz, r: r, yFin: yFin, a: Math.random() * 6, w: (Math.random() - 0.5) * 8, vivo: true };
}
function tjPasoPiedras(dt){
  var P = TJ.piedras;
  if(!P || !dt) return;
  var seg = dt / 1000, cambio = false;
  for(var i = 0; i < P.n; i++){
    var s = P.p[i];
    if(!s || !s.vivo) continue;
    s.vy -= 9.8 * seg; s.x += s.vx * seg; s.y += s.vy * seg; s.z += s.vz * seg; s.a += s.w * seg;
    cambio = true;
    if(s.y < s.yFin){
      s.vivo = false;
      P.im.setMatrixAt(i, _tjCero);
      if(Math.random() < 0.12) tjSoltar(TJ.polvo, s.x, s.yFin + 0.5, s.z, 4, 1.5, 2200, 0, 0.25);
      continue;
    }
    P.e.set(s.a, s.a * 0.7, s.a * 1.3);
    P.q.setFromEuler(P.e);
    P.v.set(s.x, s.y, s.z); P.s.set(s.r, s.r * 0.8, s.r * 0.9);
    P.m.compose(P.v, P.q, P.s);
    P.im.setMatrixAt(i, P.m);
  }
  if(cambio) P.im.instanceMatrix.needsUpdate = true;
}

/* ═══ sombras de las maquinas: una mancha alargada en direccion contraria al sol ═══ */
function tjSombras(n){
  var c = document.createElement('canvas'); c.width = 64; c.height = 64;
  var x = c.getContext('2d'), rg = x.createRadialGradient(32, 32, 4, 32, 32, 32);
  rg.addColorStop(0, 'rgba(0,0,0,.62)'); rg.addColorStop(0.55, 'rgba(0,0,0,.42)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = rg; x.fillRect(0, 0, 64, 64);
  var g = new THREE.PlaneGeometry(1, 1); g.rotateX(-Math.PI / 2);
  var mat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false,
    polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4, toneMapped: false, fog: false });
  var im = new THREE.InstancedMesh(g, mat, n);
  im.count = 0;
  im.frustumCulled = false;
  im.renderOrder = 2;
  return { im: im, lista: [] };
}
var _tjSm = null, _tjSq = null, _tjSs = null, _tjSp = null;
function tjPasoSombras(){
  var S = TJ.sombras;
  if(!S) return;
  if(!_tjSm){ _tjSm = new THREE.Matrix4(); _tjSq = new THREE.Quaternion(); _tjSs = new THREE.Vector3(); _tjSp = new THREE.Vector3(); }
  var sh = Math.hypot(TJ_SOL.x, TJ_SOL.z), dx = -TJ_SOL.x / sh, dz = -TJ_SOL.z / sh, tanE = TJ_SOL.y / sh;
  _tjSq.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.atan2(-dz, dx));
  var o = {};
  for(var i = 0; i < S.lista.length; i++){
    var it = S.lista[i], ob = it.obj, M = ob.userData.med;
    var largo = M.H * 0.8 / tanE;
    var lx = ob.position.x + dx * largo * 0.42, lz = ob.position.z + dz * largo * 0.42;
    tjSuelo(lx, lz, o);
    var base = Math.max(M.L, M.W);
    _tjSp.set(lx, Math.max(o.h, ob.position.y - 0.5) + 0.25, lz);
    _tjSs.set(base * 0.75 + largo * 0.85, 1, Math.min(M.L, M.W) * 1.25 + base * 0.25);
    _tjSm.compose(_tjSp, _tjSq, _tjSs);
    S.im.setMatrixAt(i, _tjSm);
    /* la maquina se oscurece cuando entra a la sombra de un banco */
    if(TJ.luzEn){
      var luz = 0.3 + 0.7 * TJ.luzEn(ob.position.x, ob.position.z);
      if(Math.abs(luz - ob.userData.luz) > 0.02){
        ob.userData.luz += (luz - ob.userData.luz) * 0.25;
        var ms = ob.userData.mats || [];
        for(var k = 0; k < ms.length; k++) ms[k].color.copy(ms[k].userData.c0).multiplyScalar(ob.userData.luz);
      }
    }
  }
  S.im.count = S.lista.length;
  S.im.instanceMatrix.needsUpdate = true;
}
function tjConSombra(obj){
  if(TJ.sombras && obj && obj.userData.med) TJ.sombras.lista.push({ obj: obj });
}

/* lo que no se mueve y no es maquina (la frente de roca): se oscurece una
   vez segun la sombra del terreno donde esta */
function tjSombraFija(obj, x, z){
  if(!TJ.luzEn) return;
  var f = 0.3 + 0.7 * TJ.luzEn(x === undefined ? obj.position.x : x, z === undefined ? obj.position.z : z);
  obj.material.color.multiplyScalar(f);
}

/* resplandor de una lampara (torres de luz) */
var _tjTexBrillo = null;
function tjBrillo(color, tam){
  if(!_tjTexBrillo){
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var x = c.getContext('2d'), rg = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.18, 'rgba(255,255,255,.5)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = rg; x.fillRect(0, 0, 64, 64);
    _tjTexBrillo = new THREE.CanvasTexture(c);
  }
  var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: _tjTexBrillo, color: new THREE.Color(color),
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55, fog: false }));
  s.scale.setScalar(tam);
  return s;
}

/* coloca algo apoyado en el suelo, mirando hacia ang (radianes, frente -X) */
function tjPoner(obj, x, z, ang, hundir){
  var o = {};
  tjSuelo(x, z, o);
  obj.position.set(x, o.h - (hundir || 0), z);
  obj.rotation.y = ang || 0;
  TJ.esc.add(obj);
  return obj;
}
/* corre un cargador ya puesto para que su eje de giro (no el centro del
   modelo) caiga en el punto donde se lo puso */
function tjAlEje(obj){
  var gx = obj.userData.giroX || 0, a = obj.rotation.y;
  obj.position.x -= gx * Math.cos(a);
  obj.position.z += gx * Math.sin(a);
}
/* angulo para que el frente (-X) mire hacia (dx, dz) */
function tjMirar(dx, dz){ return Math.atan2(dz, -dx); }

/* busca una berma libre (sin rampa ni cara) cerca de (th, rho), con espacio alrededor */
function tjBerma(th0, rho0, holgura){
  var o = {}, mejor = null;
  for(var a = 0; a < 24 && !mejor; a++){
    var th = th0 + (a % 2 ? 1 : -1) * Math.floor((a + 1) / 2) * 0.03;
    for(var b = -6; b <= 6 && !mejor; b++){
      var rho = rho0 + b * 0.01, R = tjRadio(th), x = Math.cos(th) * R * rho, z = Math.sin(th) * R * rho;
      tjSuelo(x, z, o);
      if(o.camino || o.cara > 0.05 || o.pie > 0.2) continue;
      var h0 = o.h, bien = true;
      for(var q = 0; q < 8 && bien; q++){
        var ang = q / 8 * Math.PI * 2;
        tjSuelo(x + Math.cos(ang) * holgura, z + Math.sin(ang) * holgura, o);
        if(o.camino || Math.abs(o.h - h0) > 1.6) bien = false;
      }
      if(bien) mejor = { x: x, z: z, th: th, h: h0 };
    }
  }
  return mejor;
}

/* ═══ la chancadora primaria, la faja y la ruma ═══
   En coordenadas propias: +X hacia afuera del tajo, el suelo del patio en
   y = 0. El camion retrocede hasta el tope de llantas (x = -0.9) y vacia en la
   tolva de recepcion (x de 0 a 11), que esta bajo el nivel del patio: el
   terreno se recorta ahi (uniforme 'hueco' del terreno) para que se vea
   adentro. Detras, el edificio del chancador giratorio; de el sale la faja
   en galeria reticulada sobre caballetes hasta la torre de cabeza, que
   descarga en la ruma. Los colores van en hex sRGB como en los modelos de la
   flota: tjFusionar los pasa a lineal y lo junta todo en pocas mallas. */
var TJ_HUECO = { x0: 0.05, x1: 10.95, zh: 9.9 };
function tjChancadora(){
  var G = new THREE.Group();
  var M = {};
  var mat = function(hex, rug, met, extra){
    var k = hex + rug + met + (extra ? 'e' : '');
    if(!M[k]){
      M[k] = new THREE.MeshStandardMaterial({ color: new THREE.Color(hex), roughness: rug, metalness: met || 0 });
      if(extra) M[k].emissive = new THREE.Color(extra);
      if(extra) M[k].emissiveIntensity = 2;
    }
    return M[k];
  };
  var hormigon = mat('#A8A196', 0.95), hormigon2 = mat('#8D877D', 0.95), chapa = mat('#C9CDD0', 0.7, 0.2),
      nervio = mat('#AEB4B9', 0.6, 0.3), estructura = mat('#4C5258', 0.6, 0.4), techo = mat('#B4532E', 0.6, 0.2),
      amarillo = mat('#E5AE1A', 0.5), negro = mat('#1F2022', 0.8), vidrio = mat('#22303A', 0.2, 0.1),
      acero = mat('#7A8086', 0.5, 0.5), oscuro = mat('#2E3033', 0.9), blanco = mat('#E3E5E4', 0.7),
      ruma = mat('#3E2F2B', 1), rejilla = mat('#5D6267', 0.7, 0.4), lampara = mat('#FFF4D8', 0.4, 0, '#FFE6B0');
  var caja = function(m, w, h, d, x, y, z){
    var o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    o.position.set(x, y, z); G.add(o); return o;
  };
  var _a = new THREE.Vector3(), _b = new THREE.Vector3();
  /* una barra de seccion w x h entre dos puntos */
  var barra = function(m, a, b, w, h){
    _a.fromArray(a); _b.fromArray(b);
    var L = _a.distanceTo(_b);
    if(L < 1e-3) return null;
    var o = new THREE.Mesh(new THREE.BoxGeometry(w, h, L), m);
    o.position.copy(_a).add(_b).multiplyScalar(0.5);
    o.up.set(0, 1, 0);
    if(Math.abs(_b.y - _a.y) > L * 0.999) o.up.set(1, 0, 0);
    o.lookAt(_b);
    G.add(o); return o;
  };
  var cilindro = function(m, r, h, x, y, z, seg){
    var o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg || 20), m);
    o.position.set(x, y, z); G.add(o); return o;
  };
  /* baranda entre dos puntos, con parantes cada ~1.5 m */
  var baranda = function(a, b, m){
    barra(m || amarillo, [a[0], a[1] + 1.1, a[2]], [b[0], b[1] + 1.1, b[2]], 0.07, 0.07);
    barra(m || amarillo, [a[0], a[1] + 0.55, a[2]], [b[0], b[1] + 0.55, b[2]], 0.05, 0.05);
    var L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), n = Math.max(1, Math.round(L / 1.5));
    for(var i = 0; i <= n; i++){
      var t = i / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t, z = a[2] + (b[2] - a[2]) * t;
      barra(m || amarillo, [x, y, z], [x, y + 1.1, z], 0.06, 0.06);
    }
  };

  /* ── el patio de descarga: losa, tope de llantas a franjas y muros laterales ── */
  caja(hormigon, 18, 2, 30, -9, -0.98, 0);
  for(var i = 0; i < 20; i++) caja(i % 2 ? negro : amarillo, 1.0, 1.1, 1.0, -0.9, 0.55, -9.5 + i);
  [-1, 1].forEach(function(s){
    caja(hormigon2, 12.4, 1.3, 0.9, 5.3, 0.45, s * 10.4);                    /* bordillo de la tolva */
    baranda([0, 1.1, s * 10.4], [11, 1.1, s * 10.4]);
  });
  /* ── la tolva de recepcion, hundida: cuatro planchas inclinadas y el mineral al fondo ── */
  var tv = new THREE.BufferGeometry(), A = [0, 0.02, -9.9], B = [11, 0.02, -9.9], C = [11, 0.02, 9.9], D = [0, 0.02, 9.9],
      a2 = [3.6, -8, -3], b2 = [8.2, -8, -3], c2 = [8.2, -8, 3], d2 = [3.6, -8, 3];
  var qs = [[A, B, b2, a2], [B, C, c2, b2], [C, D, d2, c2], [D, A, a2, d2]], vs = [];
  qs.forEach(function(q){ vs.push.apply(vs, q[0].concat(q[1], q[2], q[0], q[2], q[3])); });
  tv.setAttribute('position', new THREE.Float32BufferAttribute(vs, 3));
  tv.computeVertexNormals();
  var planchas = new THREE.Mesh(tv, mat('#45484B', 0.85, 0.3));
  planchas.material.side = THREE.DoubleSide;
  G.add(planchas);
  /* planchas de desgaste: franjas mas oscuras en las caras inclinadas */
  for(var f = 1; f < 4; f++){
    var t = f / 4, y = 0.02 + (-8 - 0.02) * t;
    barra(oscuro, [0 + 3.6 * t, y, -9.9 + 6.9 * t], [0 + 3.6 * t, y, 9.9 - 6.9 * t], 0.12, 0.25);
    barra(oscuro, [11 - 2.8 * t, y, -9.9 + 6.9 * t], [11 - 2.8 * t, y, 9.9 - 6.9 * t], 0.12, 0.25);
  }
  caja(oscuro, 5, 0.4, 6.4, 5.9, -8.1, 0);
  var montonG = new THREE.SphereGeometry(1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), pm = montonG.attributes.position;
  for(var j = 0; j < pm.count; j++){ var k = 1 + (tjHash(j, 31) - 0.5) * 0.3; pm.setXYZ(j, pm.getX(j) * k, pm.getY(j) * k, pm.getZ(j) * k); }
  montonG.computeVertexNormals();
  var monton = new THREE.Mesh(montonG, ruma);
  monton.scale.set(3.4, 3.6, 4.6); monton.position.set(5.9, -8, 0); G.add(monton);
  /* ── el picador de rocas: pedestal al costado de la tolva y su pluma sobre la boca ── */
  cilindro(hormigon2, 1.3, 1.6, 6.5, 0.5, 11.9, 16);
  cilindro(amarillo, 0.75, 1.4, 6.5, 2.0, 11.9, 16);
  barra(amarillo, [6.5, 2.8, 11.9], [7.4, 7.6, 6.8], 0.65, 0.85);
  barra(amarillo, [7.4, 7.6, 6.8], [6.9, 2.6, 3.4], 0.5, 0.6);
  barra(acero, [6.5, 2.9, 11.2], [7.3, 6.4, 7.6], 0.18, 0.18);
  barra(negro, [6.9, 2.6, 3.4], [6.9, 0.2, 3.0], 0.55, 0.55);
  barra(acero, [6.9, 0.2, 3.0], [6.9, -1.1, 2.9], 0.18, 0.18);
  /* caseta del operador del picador, en alto, mirando a la tolva */
  [[-0.4, 13.2], [2.6, 13.2], [-0.4, 16.2], [2.6, 16.2]].forEach(function(q){ barra(estructura, [q[0], 0, q[1]], [q[0], 4, q[1]], 0.25, 0.25); });
  caja(rejilla, 3.8, 0.2, 3.8, 1.1, 4.0, 14.7);
  caja(blanco, 3.2, 2.6, 3.2, 1.1, 5.4, 14.7);
  caja(vidrio, 3.25, 1.2, 2.6, 1.1, 5.8, 14.7);
  caja(estructura, 3.6, 0.15, 3.6, 1.1, 6.8, 14.7);
  barra(acero, [2.7, 0, 18.5], [2.7, 4, 15.6], 0.8, 0.12);

  /* ── el edificio del chancador: zocalo de concreto, columnas, forro acanalado ── */
  var X0 = 11, X1 = 27, ZE = 8.5, H = 21;
  caja(hormigon2, X1 - X0 + 0.6, 5, ZE * 2 + 0.6, (X0 + X1) / 2, -0.5, 0);
  caja(chapa, X1 - X0, H - 2, ZE * 2, (X0 + X1) / 2, 2 + (H - 2) / 2, 0);
  for(var xx = X0 + 0.3; xx < X1; xx += 0.55){
    caja(nervio, 0.12, H - 2, 0.14, xx, 2 + (H - 2) / 2, ZE + 0.07);
    caja(nervio, 0.12, H - 2, 0.14, xx, 2 + (H - 2) / 2, -ZE - 0.07);
  }
  for(var zz = -ZE + 0.3; zz < ZE; zz += 0.55){
    caja(nervio, 0.14, H - 2, 0.12, X1 + 0.07, 2 + (H - 2) / 2, zz);
    caja(nervio, 0.14, H - 2 - 5, 0.12, X0 - 0.07, 7 + (H - 7) / 2, zz);
  }
  [[X0, ZE], [X1, ZE], [X0, -ZE], [X1, -ZE]].forEach(function(q){ caja(estructura, 0.7, H + 0.4, 0.7, q[0], H / 2, q[1]); });
  [6.5, 13.5].forEach(function(y){
    caja(vidrio, 12, 1.3, 0.12, (X0 + X1) / 2, y, ZE + 0.16);
    caja(vidrio, 12, 1.3, 0.12, (X0 + X1) / 2, y, -ZE - 0.16);
    caja(vidrio, 0.12, 1.3, 12, X1 + 0.16, y, 0);
    caja(estructura, X1 - X0 + 0.8, 0.3, 0.3, (X0 + X1) / 2, y + 0.9, ZE + 0.2);
    caja(estructura, X1 - X0 + 0.8, 0.3, 0.3, (X0 + X1) / 2, y + 0.9, -ZE - 0.2);
  });
  /* la boca por donde entra el mineral desde la tolva, y el porton de mantencion */
  caja(oscuro, 0.4, 4.6, 12, X0 - 0.1, 2.6, 0);
  caja(nervio, 0.2, 6.5, 5.5, X1 + 0.15, 3.25, -4);
  caja(estructura, 0.3, 0.4, 6, X1 + 0.2, 6.6, -4);
  /* techo: alero, cumbrera y la caseta de la grua puente encima */
  caja(techo, X1 - X0 + 1.2, 0.45, ZE * 2 + 1.2, (X0 + X1) / 2, H + 0.25, 0);
  caja(estructura, X1 - X0 + 1.3, 0.6, 0.3, (X0 + X1) / 2, H + 0.4, ZE + 0.6);
  caja(estructura, X1 - X0 + 1.3, 0.6, 0.3, (X0 + X1) / 2, H + 0.4, -ZE - 0.6);
  caja(chapa, 9, 4.2, 8, (X0 + X1) / 2 + 1.5, H + 2.5, 0);
  for(var xg = (X0 + X1) / 2 - 2.8; xg < (X0 + X1) / 2 + 5.9; xg += 0.55) caja(nervio, 0.1, 4.2, 8.15, xg, H + 2.5, 0);
  caja(techo, 9.8, 0.35, 8.8, (X0 + X1) / 2 + 1.5, H + 4.75, 0);
  /* ventiladores del techo */
  [-4, -1.5].forEach(function(dx){ cilindro(acero, 0.7, 1.0, (X0 + X1) / 2 + dx, H + 1, 4.5, 14); });

  /* ── la escalera exterior: torre de cuatro parantes con descansos y tramos en zigzag ── */
  var SX0 = 20, SX1 = 25, SZ0 = ZE + 0.6, SZ1 = ZE + 4.2;
  [[SX0, SZ0], [SX1, SZ0], [SX0, SZ1], [SX1, SZ1]].forEach(function(q){ barra(estructura, [q[0], 0, q[1]], [q[0], H, q[1]], 0.25, 0.25); });
  var nivel = 4.2;
  for(var nv = 1; nv * nivel <= H + 0.1; nv++){
    var y0 = (nv - 1) * nivel, y1 = nv * nivel, ida = nv % 2;
    caja(rejilla, SX1 - SX0, 0.15, SZ1 - SZ0, (SX0 + SX1) / 2, y1, (SZ0 + SZ1) / 2);
    var xa = ida ? SX0 + 0.6 : SX1 - 0.6, xb = ida ? SX1 - 0.6 : SX0 + 0.6;
    barra(rejilla, [xa, y0, SZ1 - 0.6], [xb, y1, SZ1 - 0.6], 1.0, 0.15);
    baranda([xa, y0, SZ1 - 0.05], [xb, y1, SZ1 - 0.05]);
    baranda([SX0, y1, SZ1], [SX1, y1, SZ1]);
    if(nv % 2 === 0) barra(estructura, [SX0, y0, SZ1], [SX1, y1, SZ1], 0.12, 0.12);
  }

  /* ── la faja: galeria reticulada inclinada sobre caballetes ── */
  var ANG = 0.2, LF = 100, P0 = [X1 + 0.5, 3.0, 0];
  var cu = Math.cos(ANG), su = Math.sin(ANG);
  var P = function(s, dz, dn){ return [P0[0] + cu * s - su * (dn || 0), P0[1] + su * s + cu * (dn || 0), dz || 0]; };
  var AN = 1.7, AL = 2.6;
  [-AN, AN].forEach(function(z){
    barra(estructura, P(0, z, 0), P(LF, z, 0), 0.25, 0.3);
    barra(estructura, P(0, z, AL), P(LF, z, AL), 0.25, 0.25);
  });
  for(var sp = 0; sp <= LF; sp += 5){
    [-AN, AN].forEach(function(z){
      barra(estructura, P(sp, z, 0), P(sp, z, AL), 0.16, 0.16);
      if(sp < LF) barra(estructura, P(sp, z, 0), P(sp + 5, z, AL), 0.12, 0.12);
    });
    barra(estructura, P(sp, -AN, AL), P(sp, AN, AL), 0.14, 0.14);
  }
  barra(rejilla, P(0, 0, 0.12), P(LF, 0, 0.12), AN * 2, 0.1);
  barra(nervio, P(0, -0.4, 1.05), P(LF, -0.4, 1.05), 1.6, 0.8);              /* tapa de la correa */
  barra(negro, P(0, -0.4, 0.55), P(LF, -0.4, 0.55), 1.3, 0.2);               /* la correa */
  barra(chapa, P(0, 0, AL + 0.15), P(LF, 0, AL + 0.15), AN * 2 + 0.5, 0.12); /* techo de la galeria */
  baranda(P(0, AN - 0.2, 0.2), P(LF, AN - 0.2, 0.2));
  /* caballetes cada 20 m: dos patas abiertas, travesano y cruz */
  for(var sc = 14; sc < LF - 4; sc += 20){
    var pb = P(sc, 0, 0), yb = pb[1];
    [-1, 1].forEach(function(s){ barra(estructura, [pb[0], -2, s * 3.4], [pb[0], yb, s * AN], 0.45, 0.45); });
    barra(estructura, [pb[0], yb * 0.5 - 1, -2.6], [pb[0], yb * 0.5 - 1, 2.6], 0.3, 0.3);
    barra(estructura, [pb[0], -1, -3.3], [pb[0], yb * 0.5 - 1, 2.6], 0.18, 0.18);
    barra(estructura, [pb[0], -1, 3.3], [pb[0], yb * 0.5 - 1, -2.6], 0.18, 0.18);
    caja(hormigon2, 1.6, 1.2, 1.6, pb[0], -1.4, -3.4); caja(hormigon2, 1.6, 1.2, 1.6, pb[0], -1.4, 3.4);
  }
  /* la torre de cabeza sobre la ruma */
  var PE = P(LF, 0, 0), TX = PE[0], TY = PE[1];
  [[-2.2, -2.8], [2.2, -2.8], [-2.2, 2.8], [2.2, 2.8]].forEach(function(q){
    barra(estructura, [TX + q[0], -2, q[1]], [TX + q[0], TY + 0.5, q[1]], 0.45, 0.45);
  });
  for(var yt = 5; yt < TY; yt += 6){
    barra(estructura, [TX - 2.2, yt, -2.8], [TX + 2.2, yt, -2.8], 0.2, 0.2);
    barra(estructura, [TX - 2.2, yt, 2.8], [TX + 2.2, yt, 2.8], 0.2, 0.2);
    barra(estructura, [TX - 2.2, yt, -2.8], [TX + 2.2, yt + 6, -2.8], 0.12, 0.12);
    barra(estructura, [TX - 2.2, yt, 2.8], [TX + 2.2, yt + 6, 2.8], 0.12, 0.12);
  }
  caja(rejilla, 6, 0.25, 7, TX, TY + 0.5, 0);
  caja(chapa, 4.6, 3.6, 4.2, TX + 0.6, TY + 2.4, 0);
  caja(techo, 5.2, 0.3, 4.8, TX + 0.6, TY + 4.35, 0);
  caja(oscuro, 1.6, 4, 1.6, TX + 2.6, TY - 1.5, 0);                          /* chute de descarga */
  baranda([TX - 3, TY + 0.6, -3.5], [TX + 3, TY + 0.6, -3.5]);
  baranda([TX - 3, TY + 0.6, 3.5], [TX + 3, TY + 0.6, 3.5]);
  /* la ruma: cono de mineral recien caido, con su talud y franjas de color */
  var RR = 34, RH = TY + 2;
  var rg = new THREE.ConeGeometry(RR, RH, 56, 10), pr = rg.attributes.position, cr = [];
  var c1 = new THREE.Color('#3E2F2B').convertSRGBToLinear(), c2 = new THREE.Color('#5C3C2E').convertSRGBToLinear(),
      c3 = new THREE.Color('#2C2624').convertSRGBToLinear(), cc = new THREE.Color();
  for(var q = 0; q < pr.count; q++){
    var xq = pr.getX(q), yq = pr.getY(q), zq = pr.getZ(q), rq = Math.hypot(xq, zq);
    var n = tjFbm(xq * 0.15 + 9, zq * 0.15 + yq * 0.1, 3);
    if(rq > 0.5){ var kq = 1 + (n - 0.5) * 0.08; pr.setX(q, xq * kq); pr.setZ(q, zq * kq); }
    cc.copy(c1).lerp(c2, clamp(n * 1.8 - 0.5, 0, 1)).lerp(c3, clamp(tjRuido(xq * 0.6, yq * 0.6) - 0.5, 0, 0.6));
    cr.push(cc.r, cc.g, cc.b);
  }
  rg.setAttribute('color', new THREE.Float32BufferAttribute(cr, 3));
  rg.computeVertexNormals();
  var rm = new THREE.Mesh(rg, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1 }));
  rm.position.set(TX + 2.6, RH / 2 - 2, 0);
  G.add(rm);

  /* ── la sala electrica, el transformador con su cerco, el tanque de agua y las luces ── */
  [[13, -13.4], [25, -13.4], [13, -16.6], [25, -16.6]].forEach(function(q){ caja(hormigon2, 0.8, 1.6, 0.8, q[0], 0.2, q[1]); });
  caja(blanco, 14, 3.6, 4.2, 19, 2.8, -15);
  for(var xs = 12.5; xs < 26; xs += 0.6) caja(mat('#CCD0D2', 0.7), 0.08, 3.6, 4.32, xs, 2.8, -15);
  caja(estructura, 14.4, 0.3, 4.6, 19, 4.75, -15);
  [14, 17, 20, 23].forEach(function(x){ caja(acero, 1.3, 1.0, 0.9, x, 2.6, -17.6); });
  barra(rejilla, [26.2, 0, -14], [26.2, 1.0, -14], 1.4, 0.15);
  caja(mat('#6E7F73', 0.6, 0.3), 3.2, 3.2, 2.6, 31, 1.6, -15);                 /* transformador */
  [[28, -11.5], [34, -11.5], [34, -18.5], [28, -18.5]].forEach(function(q, i, arr){
    var b2 = arr[(i + 1) % 4];
    baranda([q[0], 0, q[1]], [b2[0], 0, b2[1]], acero);
  });
  cilindro(mat('#8296A0', 0.5, 0.4), 4, 8, 40, 4, -16, 28);
  var tapa = new THREE.Mesh(new THREE.ConeGeometry(4.2, 1.4, 28), mat('#6F828C', 0.5, 0.4));
  tapa.position.set(40, 8.7, -16); G.add(tapa);
  barra(acero, [40, 0.5, -12], [40, 8, -12], 0.2, 0.2);
  var luces = [];
  [[-12, -14], [-12, 14], [33, 12]].forEach(function(q){
    cilindro(acero, 0.22, 20, q[0], 10, q[1], 10);
    caja(estructura, 2.6, 0.2, 0.4, q[0], 19.8, q[1]);
    [-0.9, 0, 0.9].forEach(function(dx){ caja(lampara, 0.7, 0.35, 0.5, q[0] + dx, 19.5, q[1]); });
    luces.push([q[0], 19.4, q[1]]);
  });
  G.userData.luces = luces;
  G.userData.edificio = { x: (X0 + X1) / 2, z: 0, L: X1 - X0, W: ZE * 2, H: H + 4 };
  G.userData.ruma = { x: TX + 2.6, z: 0, L: RR * 1.6, W: RR * 1.6, H: RH * 0.7 };
  return G;
}

/* ═══ arranque ═══ */
function iniciarTajo(){
  if(!$('lienzo-tajo')) return;
  var cv = $('lienzo-tajo');
  /* sin MSAA: en una tarjeta integrada cuesta ~7 ms por cuadro y hace que el
     movimiento salga a tirones; los bordes los suaviza la resolucion
     adaptativa, que sube por encima de 1 cuando sobra margen */
  rT = new THREE.WebGLRenderer({ canvas: cv, antialias: /[?&]aa=1/.test(location.search), alpha: false, powerPreference: 'high-performance' });
  rT.setPixelRatio(Math.min(window.devicePixelRatio || 1, MOVIL ? 1.25 : 1.5));
  rT.outputEncoding = THREE.sRGBEncoding;
  rT.toneMapping = THREE.ACESFilmicToneMapping;
  rT.toneMappingExposure = 1.0;

  TJ = { rend: rT, esc: new THREE.Scene(), camiones: [], extras: [], listo: false, cuadro: 0, lod: [] };
  escT = TJ.esc;
  /* para revisar la escena desde la consola en la vista previa local */
  if(/[?&]tj=1/.test(location.search)){ window.__TJ = TJ; TJ.suelo = tjSuelo;
    TJ.avanzar = function(ms){ for(var q = 0; q < ms; q += 50){ tjPasoCamiones(50); tjPasoPala(50); } }; }
  camT = new THREE.PerspectiveCamera(42, 1.6, 3, 9000);
  /* la niebla tiene el color del horizonte: el desierto se funde con el cielo.
     En r128 la niebla se mezcla despues del tone mapping y la codificacion,
     asi que su color va ya como se ve en pantalla */
  TJ.esc.fog = new THREE.FogExp2(tjPantalla(Math.pow(TJ_HOR[0], 2.2), Math.pow(TJ_HOR[1], 2.2), Math.pow(TJ_HOR[2], 2.2)), 0.00060);

  var cielo = tjCielo();
  TJ.esc.add(cielo);
  TJ.cielo = cielo;
  TJ.esc.environment = tjEntorno(cielo);

  /* la luz de la tarde para las maquinas (el terreno ya trae la suya) */
  TJ.esc.add(new THREE.HemisphereLight(0x92AED0, 0x6A4E38, 0.7));
  var sol = new THREE.DirectionalLight(0xFFD0A0, 2.4);
  sol.position.copy(TJ_SOL).multiplyScalar(900);
  TJ.esc.add(sol);

  /* el mar, al oeste: solo del acantilado hacia afuera */
  var olas = tjTexOlas();
  var mar = new THREE.Mesh(new THREE.PlaneGeometry(6000, 12000), new THREE.MeshStandardMaterial({
    color: new THREE.Color('#1D4A63').convertSRGBToLinear(), roughness: 0.16, metalness: 0.2, normalMap: olas,
    normalScale: new THREE.Vector2(0.6, 0.6) }));
  mar.rotation.x = -Math.PI / 2; mar.position.set(TJ_COSTA - 3000, -22, 0);
  TJ.esc.add(mar); TJ.olas = olas;

  TJ.polvo = tjPolvo(MOVIL ? 300 : 1000);
  TJ.esc.add(TJ.polvo.pts);
  TJ.sombras = tjSombras(48);
  TJ.esc.add(TJ.sombras.im);
  TJ.piedras = tjPiedras(MOVIL ? 60 : 140);
  TJ.esc.add(TJ.piedras.im);
  TJ.tabla = tjTabla();

  ajustarTajo();
  /* primero el suelo; despues, de a uno, los equipos */
  tjTerreno(function(){ tjCola(tjTareas()); });
}

/* la lista de lo que se agrega despues del terreno, en orden de importancia */
function tjTareas(){
  var T = [];
  var flota = MOVIL ? ['FC-038-AL', 'FC-104', 'FC-518-AL', 'FC-100', 'FC-040-AL'] :
    ['FC-038-AL', 'FC-518-AL', 'FC-104', 'FC-040-AL', 'FC-526-AL', 'FC-100', 'FC-041-AL', 'FC-87', 'FC-527-AL'];
  /* la pala en el fondo, de cara a la frente de roca volada */
  T.push(function(){
    var L = tjLugares();
    var pala = tjCargador('CH-04', 2.3, 4.8, 1.7);
    if(!pala) return;
    var aF = tjMirar(L.F.x - L.S.x, L.F.z - L.S.z), aC = tjMirar(L.B.x - L.S.x, L.B.z - L.S.z);
    tjPoner(pala, L.S.x, L.S.z, aF, 0.1);
    tjAlEje(pala);
    pala.userData.alzaMax = 1.05; pala.userData.abreMax = 0.75;
    /* el camion se pone al alcance del cucharon (de costado, del lado de la rampa) */
    tjMedirAlcance(pala);
    if(pala.userData.alcance){
      var dB = clamp(pala.userData.alcance, 11.5, 15);
      L.B.x = L.S.x + L.e.x * dB; L.B.z = L.S.z + L.e.z * dB;
    }
    tjConSombra(pala);
    /* la frente: un monton de roca volada contra el pie de la pared */
    var gm = new THREE.SphereGeometry(1, 40, 14, 0, Math.PI * 2, 0, Math.PI / 2);
    var pp = gm.attributes.position;
    for(var i = 0; i < pp.count; i++){
      var x0 = pp.getX(i), y0 = pp.getY(i), z0 = pp.getZ(i);
      var k = 1 + (tjFbm(x0 * 3 + 5, z0 * 3 + y0 * 2, 3) - 0.5) * 0.3;
      pp.setXYZ(i, x0 * k, y0 * (0.8 + (k - 0.85) * 0.8), z0 * k);
    }
    gm.computeVertexNormals();
    var muck = new THREE.Mesh(gm, new THREE.MeshStandardMaterial({ color: new THREE.Color('#5F4A3E').convertSRGBToLinear(), roughness: 1 }));
    muck.scale.set(13, 6.5, 26);
    tjPoner(muck, L.F.x + L.p.x * 6, L.F.z + L.p.z * 6, Math.atan2(-L.p.z, L.p.x), 1.2);
    tjSombraFija(muck);
    /* rocas sueltas al pie del monton */
    var gr = new THREE.DodecahedronGeometry(1, 0), mr = new THREE.MeshStandardMaterial({ color: new THREE.Color('#5A463B').convertSRGBToLinear(), roughness: 1, flatShading: true });
    var ins = new THREE.InstancedMesh(gr, mr, 26), m4 = new THREE.Matrix4(), o = {};
    for(var r = 0; r < 26; r++){
      var a = (tjHash(r, 1) - 0.5) * 3.0, d = 9 + tjHash(r, 2) * 9;
      var x = L.F.x + L.p.x * 6 - L.p.x * d * Math.cos(a) + L.e.x * d * Math.sin(a), z = L.F.z + L.p.z * 6 - L.p.z * d * Math.cos(a) + L.e.z * d * Math.sin(a);
      tjSuelo(x, z, o);
      var s = 0.5 + tjHash(r, 3) * 1.1;
      m4.compose(new THREE.Vector3(x, o.h + s * 0.4, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(r, r * 2, r * 3)), new THREE.Vector3(s, s * 0.8, s));
      ins.setMatrixAt(r, m4);
    }
    TJ.esc.add(ins);
    tjSombraFija(ins, L.F.x, L.F.z);
    TJ.pala = { obj: pala, aF: aF, aC: aC, t: 0, pase: -1 };
    /* el agua de la poza: un disco con borde redondo (el terreno solo la hunde;
       con su malla el borde salia dentado) */
    /* agua turbia de mina: mate (con reflejos, en angulo rasante copiaba el
       horizonte claro y se veia blanca) */
    var agua = new THREE.Mesh(new THREE.CircleGeometry(12.2, 64), new THREE.MeshLambertMaterial({
      color: new THREE.Color('#2E5262').convertSRGBToLinear() }));
    agua.rotation.x = -Math.PI / 2;
    agua.position.set(L.poza.x, -TJ_PROF - 0.55, L.poza.z);
    TJ.esc.add(agua);
    /* luces de faena */
    tjTorre(L.S.x - L.e.x * 9 - L.p.x * 2, L.S.z - L.e.z * 9 - L.p.z * 2, 'EI-2176-AL');
    tjTorre(L.B.x + L.e.x * 13 + L.p.x * 12, L.B.z + L.e.z * 13 + L.p.z * 12, 'EI-2133-AL');
  });
  /* los camiones del ciclo, repartidos en la rampa */
  flota.forEach(function(id, k){
    T.push(function(){
      var c = tjCamion(id);
      if(!c) return;
      TJ.esc.add(c);
      var n = flota.length, sube = k % 2 === 0;
      var cam = { obj: c, tolva: c.userData.tolva, roca: c.userData.roca,
        s: TJ.tabla.L * ((k + 0.5) / n), dir: sube ? -1 : 1, cargado: sube, estado: 'viaja',
        t: 0, dur: 1, basc: 0, vel: 12.5 + (tjHash(k, 2) - 0.5) * 2, man: null };
      if(c.userData.roca) c.userData.roca.visible = sube;
      TJ.camiones.push(cam);
      tjConSombra(c);
    });
  });
  /* la chancadora, junto a la salida de la rampa, con la faja hacia afuera */
  T.push(function(){
    var C = tjLugarChancadora(), ch = tjChancadora();
    var luces = ch.userData.luces, partes = [ch.userData.edificio, ch.userData.ruma];
    var gr = tjFusionar(ch, null, null);
    tjLiberar(ch);
    var Ch = tjArmar(gr, ['base']);
    Ch.position.set(C.x, C.h, C.z);
    Ch.rotation.y = C.ang;
    TJ.esc.add(Ch);
    Ch.updateMatrixWorld(true);
    luces.forEach(function(l){
      var b = tjBrillo('#FFE2A8', 9);
      b.position.copy(Ch.localToWorld(new THREE.Vector3(l[0], l[1], l[2])));
      TJ.esc.add(b);
    });
    /* el edificio y la ruma tambien echan sombra (el mapa de luz no los tiene) */
    partes.forEach(function(m){
      var q = tjDeChancadora(m.x, m.z), o = new THREE.Object3D();
      o.position.set(q.x, C.h, q.z); o.rotation.y = C.ang;
      o.userData.med = { L: m.L, W: m.W, H: m.H }; o.userData.luz = 1;
      TJ.sombras.lista.push({ obj: o });
    });
    /* el terreno se recorta sobre la tolva de recepcion para que se vea adentro */
    var U = TJ.terreno && TJ.terreno.material.uniforms;
    if(U && U.hueco){
      U.hueco.value.set(C.x, C.z, C.c, C.s);
      U.huecoT.value.set(TJ_HUECO.x0, TJ_HUECO.x1, -TJ_HUECO.zh, TJ_HUECO.zh);
    }
    /* el camion descarga de retroceso contra el tope: el frente mira al tajo */
    var dp = tjDeChancadora(-9, 0);
    TJ.descarga = { x: dp.x, z: dp.z, y: C.h, o: { x: C.x, z: C.z }, ang: tjMirar(-C.rx, -C.rz), r: { x: C.rx, z: C.rz } };
  });
  /* la excavadora en un banco, cargando un camion parado */
  T.push(function(){
    var sitio = tjBerma(3.3, 0.6, 9);
    if(!sitio) return;
    var th = sitio.th, ox = Math.cos(th), oz = Math.sin(th), tx = -oz, tz = ox;
    var ex = tjCargador('RE-62', 2.0, 3.6, 1.4);
    if(!ex) return;
    /* mira a la pared del banco, hacia afuera del tajo */
    tjPoner(ex, sitio.x, sitio.z, tjMirar(ox, oz), 0.1);
    tjAlEje(ex);
    ex.userData.alzaMax = 0.72; ex.userData.abreMax = 1.3; ex.userData.estiraMax = -0.85;
    tjConSombra(ex);
    tjMedirAlcance(ex);
    var alc = clamp(ex.userData.alcance || 9, 7.5, 13);
    var cam = tjCamion('FC-043-AL'), a1 = tjMirar(tx, tz) - ex.rotation.y;
    if(cam){
      /* el camion, a lo largo del banco, con el centro de su carga justo donde
         cae el cucharon */
      var obj = { x: sitio.x + tx * alc, z: sitio.z + tz * alc };
      tjPoner(cam, obj.x, obj.z, tjMirar(tx, tz), 0.1);
      if(cam.userData.roca) cam.userData.roca.visible = true;
      var cc = tjCentroCarga(cam);
      if(cc){ tjPoner(cam, cam.position.x + obj.x - cc.x, cam.position.z + obj.z - cc.z, tjMirar(tx, tz), 0.1); cc = tjCentroCarga(cam); }
      if(cc) a1 = tjGiroHacia(ex, cc);
      tjConSombra(cam);
    }
    TJ.exc = { obj: ex, a1: a1, t: 0, camion: cam ? { roca: cam.userData.roca, tolva: cam.userData.tolva } : null };
    tjTorre(sitio.x - ox * 6 - tx * 14, sitio.z - oz * 6 - tz * 14, 'EI-2201-AL');
  });
  /* perforadoras en el banco de arriba, con su malla de taladros */
  T.push(function(){
    var sitio = tjBerma(2.0, 0.9, 7);
    if(!sitio) return;
    var th = sitio.th, ox = Math.cos(th), oz = Math.sin(th), tx = -oz, tz = ox;
    ['EP-19', 'EP-28'].forEach(function(id, k){
      var d = tjFijo(id);
      if(!d) return;
      var x = sitio.x + tx * (k * 16 - 8), z = sitio.z + tz * (k * 16 - 8);
      tjPoner(d, x, z, tjMirar(tx, tz), 0.15);
      tjConSombra(d);
      TJ.extras.push({ tipo: 'perfo', x: x, y: d.position.y, z: z, fase: k * 900 });
    });
    /* la malla de taladros: puntos oscuros en el piso del banco */
    var g = new THREE.CylinderGeometry(0.35, 0.35, 0.12, 8);
    var inst = new THREE.InstancedMesh(g, new THREE.MeshBasicMaterial({ color: 0x1a1412 }), 60);
    var m4 = new THREE.Matrix4(), k = 0, o = {};
    for(var a = 0; a < 12; a++) for(var b = 0; b < 5; b++){
      var x2 = sitio.x + tx * (a * 4.5 - 30) + ox * (b * 4.5 - 6), z2 = sitio.z + tz * (a * 4.5 - 30) + oz * (b * 4.5 - 6);
      tjSuelo(x2, z2, o);
      if(o.cara > 0.1 || o.camino || Math.abs(o.h - sitio.h) > 1.5) continue;
      m4.makeTranslation(x2, o.h + 0.06, z2); inst.setMatrixAt(k++, m4);
    }
    inst.count = k;
    TJ.esc.add(inst);
  });
  /* el tractor en el borde del botadero */
  T.push(function(){
    var d = tjFijo('T-577-AL');
    if(!d) return;
    TJ.tractor = { obj: d, t: 0 };
    TJ.esc.add(d);
    tjConSombra(d);
  });
  /* la cisterna riega el perimetral; la motoniveladora lo perfila */
  T.push(function(){
    var ci = tjFijo('CI-692-AL');
    if(ci){ TJ.cisterna = { obj: ci, th: 1.0 }; TJ.esc.add(ci); tjConSombra(ci); }
    var mo = tjFijo('MO-257-AL');
    if(mo){ TJ.moto = { obj: mo, th: 2.4 }; TJ.esc.add(mo); tjConSombra(mo); }
  });
  return T;
}
/* una torre de luz con sus lamparas encendidas */
function tjTorre(x, z, id){
  var t = tjFijo(id || 'EI-2176-AL');
  if(!t) return;
  tjPoner(t, x, z, Math.atan2(-z, x) + Math.PI / 2, 0);
  var bb = new THREE.Box3().setFromObject(t);
  var b = tjBrillo('#FFE2A8', 7);
  b.position.set(x, bb.max.y - 0.6, z);
  TJ.esc.add(b);
}
/* ejecuta las tareas de a una, dejando respirar a la pagina entre cada una */
function tjCola(T){
  var i = 0;
  function sig(){
    if(i >= T.length){ TJ.listo = true; return; }
    try { T[i](); } catch(err){ /* un equipo que falla no detiene el tajo */ }
    i++;
    setTimeout(sig, 30);
  }
  sig();
}

function ajustarTajo(){
  if(!rT || !camT) return;
  var w = window.innerWidth, h = window.innerHeight;
  rT.setSize(w, h, false);
  camT.aspect = w / h;
  var hFov = 66 * Math.PI / 180;
  camT.fov = clamp(2 * Math.atan(Math.tan(hFov / 2) / camT.aspect) * 180 / Math.PI, 36, 64);
  /* en pantallas anchas lo que mira el dron se corre a la derecha y un poco
     hacia arriba: a la izquierda va el titulo y abajo las cifras */
  if(w / h > 1.2) camT.setViewOffset(w, h, -w * 0.2, h * 0.05, w, h);
  else camT.setViewOffset(w, h, 0, -h * 0.04, w, h);
  camT.updateProjectionMatrix();
  if(TJ && TJ.polvo) TJ.polvo.pts.material.uniforms.escala.value = h * 0.75;
}

/* ═══ el ciclo de acarreo ═══
   viaja (en la rampa) → entra (maniobra hasta la pala, retrocediendo al final)
   → carga → sale → viaja cuesta arriba → entra (retrocede al muro de la
   chancadora) → descarga → sale → viaja cuesta abajo */
function tjManiobraCarga(c){
  var L = tjLugares(), A = tjPoseRampa(TJ.tabla.L, 1, {});
  var B = L.B, p = L.p;
  /* el camion queda de costado a la pala, con el frente hacia afuera de la
     frente: pasa de largo y retrocede hasta ponerse bajo el cucharon */
  var P1 = { x: B.x - p.x * 26, z: B.z - p.z * 26 };
  return { i: 0, t: 0, q0: A.q, tramos: [
    tjTramo(A, { x: A.x + A.dx * 22, z: A.z + A.dz * 22 }, { x: P1.x + p.x * 22, z: P1.z + p.z * 22 }, P1, false, 7),
    tjTramo(P1, { x: P1.x + p.x * 8, z: P1.z + p.z * 8 }, { x: B.x - p.x * 8, z: B.z - p.z * 8 }, B, true, 3)
  ]};
}
function tjManiobraSalidaCarga(c){
  var L = tjLugares(), A = tjPoseRampa(TJ.tabla.L, -1, {}), B = L.B, p = L.p;
  return { i: 0, t: 0, tramos: [
    tjTramo(B, { x: B.x - p.x * 24, z: B.z - p.z * 24 }, { x: A.x - A.dx * 24, z: A.z - A.dz * 24 }, A, false, 6)
  ]};
}
/* donde para cada camion para descargar: con la cola justo sobre el tope de
   llantas, segun lo largo que sea */
function tjDescargaDe(c){ return tjDeChancadora(-0.3 - (c.obj.userData.xTras || 5), 0); }
function tjManiobraDescarga(c){
  var D = tjDescargaDe(c), A = tjPoseRampa(0, -1, {}), r = TJ.descarga.r;
  /* se pasa del muro y retrocede contra el */
  var P2 = { x: D.x - r.x * 24, z: D.z - r.z * 24 };
  return { i: 0, t: 0, q0: A.q, tramos: [
    tjTramo(A, { x: A.x + A.dx * 20, z: A.z + A.dz * 20 }, { x: P2.x + r.x * 0 - r.z * 18, z: P2.z + r.z * 0 + r.x * 18 }, P2, false, 6),
    tjTramo(P2, { x: P2.x + r.x * 8, z: P2.z + r.z * 8 }, { x: D.x - r.x * 8, z: D.z - r.z * 8 }, D, true, 3)
  ]};
}
function tjManiobraSalidaDescarga(c){
  var D = tjDescargaDe(c), A = tjPoseRampa(0, 1, {}), r = TJ.descarga.r;
  return { i: 0, t: 0, tramos: [
    tjTramo(D, { x: D.x - r.x * 22, z: D.z - r.z * 22 }, { x: A.x - A.dx * 22, z: A.z - A.dz * 22 }, A, false, 6)
  ]};
}
/* la zona de la pala (C) o de la chancadora (D) esta tomada mientras un
   camion entra, carga o descarga, o sale: uno por vez, para que el que llega
   no se cruce con el que se va */
function tjZonaOcupada(z, yo){
  for(var i = 0; i < TJ.camiones.length; i++){
    var c = TJ.camiones[i];
    if(c === yo) continue;
    if(z === 'C' && (c.estado === 'entraC' || c.estado === 'carga' || c.estado === 'saleC')) return true;
    if(z === 'D' && (c.estado === 'entraD' || c.estado === 'descarga' || c.estado === 'saleD')) return true;
  }
  return false;
}
function tjPasoCamiones(dt){
  var L = TJ.tabla.L, seg = dt / 1000, pose = {};
  for(var i = 0; i < TJ.camiones.length; i++){
    var c = TJ.camiones[i], obj = c.obj;
    if(c.estado === 'viaja'){
      /* cargado y cuesta arriba va mas lento; no se le acerca al de adelante */
      var v = c.vel * (c.dir < 0 ? 0.62 : 1.1);
      var cerca = 1e9;
      for(var k = 0; k < TJ.camiones.length; k++){
        var o = TJ.camiones[k];
        if(k === i || o.estado !== 'viaja' || o.dir !== c.dir) continue;
        var gap = c.dir < 0 ? c.s - o.s : o.s - c.s;
        if(gap > 0 && gap < cerca) cerca = gap;
      }
      if(cerca < 70) v *= clamp((cerca - 26) / 44, 0, 1);
      /* con la zona ocupada, espera 30 m antes del final de la rampa, fuera
         del paso del que sale */
      var tope = c.dir > 0 ? (TJ.pala && tjZonaOcupada('C', c) ? L - 30 : L) : (TJ.descarga && tjZonaOcupada('D', c) ? 30 : 0);
      if(c.dir > 0 && c.s < tope) v *= clamp((tope - c.s) / 12, 0, 1);
      if(c.dir < 0 && c.s > tope) v *= clamp((c.s - tope) / 12, 0, 1);
      c.s = c.dir > 0 ? Math.min(Math.max(c.s, 0) + v * seg, Math.max(tope, c.s)) : Math.max(Math.min(c.s, L) - v * seg, Math.min(tope, c.s));
      c.s = clamp(c.s, 0, L);
      tjPoseRampa(c.s, c.dir, pose);
      obj.position.set(pose.x, pose.y, pose.z);
      obj.quaternion.copy(pose.q);
      /* al llegar: solo uno a la vez en la pala y en la chancadora */
      if(c.dir > 0 && c.s >= L - 0.01 && TJ.pala && !tjZonaOcupada('C', c)){
        c.estado = 'entraC'; c.man = tjManiobraCarga(c);
      } else if(c.dir > 0 && c.s >= L && !TJ.pala){
        c.dir = -1; c.cargado = true;
      }
      if(c.dir < 0 && c.s <= 0.01 && TJ.descarga && !tjZonaOcupada('D', c)){
        c.estado = 'entraD'; c.man = tjManiobraDescarga(c);
      } else if(c.dir < 0 && c.s <= 0 && !TJ.descarga){
        c.dir = 1; c.cargado = false;
      }
      /* polvo de las llantas */
      if(Math.random() < 0.55 * (v / c.vel)){
        tjSoltar(TJ.polvo, pose.x - pose.dx * 4 + (Math.random() - 0.5) * 4, pose.y + 1, pose.z - pose.dz * 4 + (Math.random() - 0.5) * 4,
                 5.5, 1.6, 3800, 0, 0.24);
      }
    } else if(c.estado === 'entraC' || c.estado === 'saleC' || c.estado === 'entraD' || c.estado === 'saleD'){
      if(tjManiobra(c, dt)){
        if(c.estado === 'entraC'){ c.estado = 'carga'; c.t = 0; c.dur = 4 * 5600 + 800; if(c.roca){ c.roca.visible = false; c.roca.scale.y = 0.25; } }
        else if(c.estado === 'entraD'){ c.estado = 'descarga'; c.t = 0; c.dur = 9000; }
        else { c.estado = 'viaja'; c.man = null; }
      }
    } else if(c.estado === 'carga'){
      c.t += dt;
      /* cada pase de la pala agrega un cuarto de la carga */
      var pases = TJ.pala ? TJ.pala.pasesHechos || 0 : 4;
      if(c.roca){
        c.roca.visible = pases > 0;
        c.roca.scale.y = 0.25 + 0.75 * Math.min(1, pases / 4);
      }
      if(c.t >= c.dur){
        c.cargado = true; c.dir = -1; c.estado = 'saleC'; c.man = tjManiobraSalidaCarga(c);
        if(c.roca){ c.roca.visible = true; c.roca.scale.y = 1; }
      }
    } else if(c.estado === 'descarga'){
      c.t += dt;
      var av = c.t / c.dur;
      var quiere = av < 0.3 ? av / 0.3 : (av < 0.7 ? 1 : 1 - (av - 0.7) / 0.3);
      var D = TJ.descarga;
      if(av > 0.32 && av < 0.7 && Math.random() < 0.6){
        tjSoltar(TJ.polvo, D.o.x + D.r.x * 4 + (Math.random() - 0.5) * 10, D.y + 1, D.o.z + D.r.z * 4 + (Math.random() - 0.5) * 12, 10, 4.5, 4400, 0, 0.3);
      }
      c.basc += (clamp(quiere, 0, 1) - c.basc) * Math.min(1, dt * 0.005);
      /* la carga se desliza por la cola de la tolva y cae a la tolva de recepcion */
      if(c.roca){
        var queda = clamp(1 - (c.basc - 0.4) / 0.5, 0, 1);
        c.roca.scale.y = Math.min(c.roca.scale.y, queda);
        c.roca.visible = c.roca.scale.y > 0.04;
        if(c.basc > 0.4 && c.roca.visible && Math.random() < 0.85){
          var ud = c.roca.userData;
          var pw = c.tolva.localToWorld(_tjV1.set(ud.cola + 0.3, ud.borde - 0.4 - Math.random() * 0.9, (Math.random() - 0.5) * ud.ancho * 1.6));
          _tjV2.set(1, 0, 0).applyQuaternion(obj.quaternion);
          tjLanzar(pw.x, pw.y, pw.z, _tjV2.x * (2 + Math.random() * 1.5) + (Math.random() - 0.5), -0.5 - Math.random(),
                   _tjV2.z * (2 + Math.random() * 1.5) + (Math.random() - 0.5), 0.3 + Math.random() * 0.5, D.y - 6);
        }
      }
      if(c.t >= c.dur){
        c.basc = 0; c.cargado = false; c.dir = 1; c.estado = 'saleD'; c.man = tjManiobraSalidaDescarga(c);
      }
    }
    if(c.tolva) c.tolva.rotation.z = -c.basc * 0.8;
    tjRodar(obj);
  }
}
var _tjV1 = new THREE.Vector3(), _tjV2 = new THREE.Vector3();

/* la pala: excava en la frente, gira al camion y vacia el cucharon; sin
   camion debajo, espera con el cucharon lleno */
/* el ciclo de un cargador: excava, gira levantando el equipo (antes de pasar
   sobre el camion), abre el cucharon sobre la tolva, lo cierra y vuelve
   bajando. Devuelve la fraccion del giro, cuanto sube el equipo frontal y
   cuanto abre el cucharon (0 a 1) */
function tjFasesCarga(f, conCamion){
  var sua = function(a){ a = clamp(a, 0, 1); return a * a * (3 - 2 * a); };
  if(!conCamion || f < 0.30) return { g: 0, alza: 0.15 * sua(f / 0.30), abre: 0, lleno: clamp(f / 0.27, 0, 1) };
  if(f < 0.50) return { g: sua((f - 0.30) / 0.20), alza: 0.15 + 0.85 * sua((f - 0.30) / 0.10), abre: 0, lleno: 1 };
  if(f < 0.66){
    var ab = f < 0.56 ? sua((f - 0.52) / 0.04) : f < 0.62 ? 1 : 1 - sua((f - 0.62) / 0.05);
    return { g: 1, alza: 1, abre: ab, lleno: f < 0.56 ? 1 - ab * 0.9 : 0 };
  }
  var v = 1 - sua((f - 0.66) / 0.34);
  return { g: v, alza: v, abre: 0, lleno: 0 };
}
/* pone en pose un cargador: giro de la casa, alza del frente, apertura */
function tjPoseCargador(obj, giro, alza, abre, lleno){
  var U = obj.userData;
  if(U.cargaBalde){
    U.cargaBalde.visible = lleno > 0.04;
    if(lleno > 0.04) U.cargaBalde.scale.copy(U.cargaBalde.userData.s0).multiplyScalar(0.45 + 0.55 * lleno);
  }
  if(U.sup) U.sup.rotation.y = giro;
  /* levantar el frente es girarlo hacia arriba sobre el pie de la pluma (-Z) */
  if(U.brazo) U.brazo.rotation.z = -alza * (U.alzaMax || 0.9);
  if(U.balde) U.balde.rotation.z = abre * (U.abreMax || 0.7);
  /* el brazo se estira junto con la pluma: de recogido al excavar a extendido sobre la tolva */
  if(U.palo) U.palo.rotation.z = alza * (U.estiraMax || 0);
}
/* piedras desde el cucharon hacia la carga de un camion */
function tjPiedrasDelBalde(obj, cam){
  var U = obj.userData;
  if(!U.balde || !cam.roca || !cam.tolva || Math.random() > 0.8) return;
  var cw = cam.tolva.localToWorld(_tjV1.copy(cam.roca.userData.centro));
  var bw = U.balde.localToWorld(_tjV2.copy(U.centroBalde));
  tjLanzar(bw.x + (Math.random() - 0.5) * 2.2, bw.y - 0.8 - Math.random(), bw.z + (Math.random() - 0.5) * 2.2,
           (cw.x - bw.x) * 0.5 + (Math.random() - 0.5), -0.5 - Math.random(), (cw.z - bw.z) * 0.5 + (Math.random() - 0.5),
           0.25 + Math.random() * 0.45, cw.y + 0.2);
}

/* la pala: excava en la frente, gira al camion y vacia el cucharon; sin
   camion debajo, espera con el cucharon lleno */
function tjPasoPala(dt){
  var P = TJ.pala;
  if(!P || !P.obj.userData.sup) return;
  var cam = null;
  for(var i = 0; i < TJ.camiones.length; i++) if(TJ.camiones[i].estado === 'carga') cam = TJ.camiones[i];
  if(cam !== P.cam){
    P.cam = cam; P.t = 0; P.pasesHechos = 0;
    /* el giro que deja el cucharon sobre el centro de la carga de este camion */
    var cc = cam && tjCentroCarga(cam);
    P.dAc = cc ? tjGiroHacia(P.obj, cc) : undefined;
  }
  var DUR = 5600, f;
  if(cam){ P.t += dt; f = (P.t % DUR) / DUR; P.pasesHechos = Math.min(4, Math.floor((P.t + DUR * 0.38) / DUR)); }
  else { P.t = Math.min(P.t + dt, DUR * 0.3); f = P.t / DUR; }
  var dA = P.dAc !== undefined ? P.dAc : P.aC - P.aF;
  while(dA > Math.PI) dA -= Math.PI * 2; while(dA < -Math.PI) dA += Math.PI * 2;
  var F = tjFasesCarga(f, !!cam);
  tjPoseCargador(P.obj, dA * F.g, F.alza, F.abre, F.lleno);
  var L = tjLugares();
  if(f < 0.28 && Math.random() < 0.2) tjSoltar(TJ.polvo, L.F.x + (Math.random() - 0.5) * 10, P.obj.position.y + 2, L.F.z + (Math.random() - 0.5) * 10, 7, 2.5, 3200, 0, 0.26);
  if(cam && F.abre > 0.5 && Math.random() < 0.55)
    tjSoltar(TJ.polvo, L.B.x + (Math.random() - 0.5) * 6, P.obj.position.y + 6, L.B.z + (Math.random() - 0.5) * 6, 8, 3, 3000, 0, 0.3);
  /* con el cucharon abierto, las piedras caen sobre la carga */
  if(cam && F.abre > 0.6) tjPiedrasDelBalde(P.obj, cam);
}

function tjPasoOtros(dt, t){
  var seg = dt / 1000, o = {};
  /* la excavadora: el mismo ciclo que la pala, contra el camion parado a su lado */
  if(TJ.exc && TJ.exc.obj.userData.sup){
    TJ.exc.t += dt;
    var f = (TJ.exc.t % 8400) / 8400, d = TJ.exc.a1;
    while(d > Math.PI) d -= Math.PI * 2; while(d < -Math.PI) d += Math.PI * 2;
    var FE = tjFasesCarga(f, true);
    tjPoseCargador(TJ.exc.obj, d * FE.g, FE.alza, FE.abre, FE.lleno);
    if(FE.abre > 0.6 && TJ.exc.camion) tjPiedrasDelBalde(TJ.exc.obj, TJ.exc.camion);
  }
  /* las perforadoras levantan polvo en el cuello del taladro, por ratos */
  TJ.extras.forEach(function(e){
    if(e.tipo === 'perfo' && ((t + e.fase) % 9000) < 6000 && Math.random() < 0.18)
      tjSoltar(TJ.polvo, e.x + (Math.random() - 0.5) * 3, e.y + 1, e.z + (Math.random() - 0.5) * 3, 4, 2.2, 2600, 0, 0.32);
  });
  /* el tractor empuja en el borde del botadero, de ida y vuelta */
  if(TJ.tractor){
    var T = TJ.tractor; T.t += dt;
    var f2 = (T.t % 24000) / 24000, ida = f2 < 0.55, k = ida ? f2 / 0.55 : 1 - (f2 - 0.55) / 0.45;
    var a = 2.6, rr = TJ_BOT.r2 - 34 + k * 30;
    var x = TJ_BOT.x + Math.cos(a) * rr, z = TJ_BOT.z + Math.sin(a) * rr;
    tjSuelo(x, z, o);
    T.obj.position.set(x, o.h, z);
    T.obj.rotation.y = tjMirar(Math.cos(a), Math.sin(a));
    if(ida && Math.random() < 0.35) tjSoltar(TJ.polvo, x + Math.cos(a) * 5, o.h + 1, z + Math.sin(a) * 5, 6, 2, 3000, 0, 0.3);
  }
  /* la cisterna riega el perimetral; la motoniveladora la sigue de lejos */
  [['cisterna', 9], ['moto', 5]].forEach(function(q){
    var V = TJ[q[0]];
    if(!V) return;
    var R0 = tjRadio(V.th) * TJ_RANILLO;
    V.th = (V.th + q[1] * seg / R0) % (Math.PI * 2);
    var th = V.th, R = tjRadio(th) * TJ_RANILLO, x = Math.cos(th) * R, z = Math.sin(th) * R;
    var th2 = th + 0.01, x2 = Math.cos(th2) * tjRadio(th2) * TJ_RANILLO, z2 = Math.sin(th2) * tjRadio(th2) * TJ_RANILLO;
    tjSuelo(x, z, o);
    V.obj.position.set(x, o.h, z);
    var dx = x2 - x, dz = z2 - z, l = Math.hypot(dx, dz);
    V.obj.rotation.y = tjMirar(dx, dz);
    tjRodar(V.obj);
    if(q[0] === 'cisterna' && Math.random() < 0.9){
      var bx = x - dx / l * 6, bz = z - dz / l * 6;
      tjSoltar(TJ.polvo, bx + (Math.random() - 0.5) * 5, o.h + 0.8, bz + (Math.random() - 0.5) * 5, 3.5, 0.6, 1300, 1, 0.38);
    }
  });
  if(TJ.olas) TJ.olas.offset.set((t * 0.000006) % 1, (t * 0.000011) % 1);
}

/* ═══ el dron ═══
   La camara recorre la faena como un dron: una toma por sitio (la pala
   cargando, un camion subiendo, la chancadora, las perforadoras, la
   excavadora y una vista de todo el tajo), y en cada toma se acerca hasta
   ver el detalle y vuelve a abrirse mientras gira alrededor. Entre una
   toma y la siguiente vuela por arriba: sube, cruza y baja. Nunca queda
   tan lejos como la vista fija de antes ni se mete bajo el terreno.
   Cada toma devuelve { p: donde esta la camara, m: a donde mira }. */
var TJ_TOMA = 20000, TJ_VUELO = 7000;
function tjOrbita(cx, cy, cz, az, dist, alto, out){
  out.p.set(cx + Math.cos(az) * dist, cy + alto, cz + Math.sin(az) * dist);
  out.m.set(cx, cy, cz);
  return out;
}
/* acercarse y volver: lejos al empezar y al terminar, cerca a la mitad */
function tjVaiven(f, lejos, cerca){ return cerca + (lejos - cerca) * (1 - Math.sin(Math.PI * f)); }
/* direccion horizontal desde (x,z) hacia el centro del tajo: del lado del vacio se ve todo */
function tjHaciaCentro(x, z){ return Math.atan2(-z, -x); }
function tjTomas(){
  return [
    /* todo el tajo, mas cerca que antes, bajando de a poco */
    { dur: 18000, pose: function(f, o){
      return tjOrbita(0, -55, 0, 0.95 + (f - 0.5) * 0.7, 330 - 90 * f, 175 - 70 * f, o);
    }},
    /* la pala cargando: por detras y de costado, para ver el camion y la frente */
    { dur: TJ_TOMA, pose: function(f, o){
      if(!TJ.pala) return null;
      var L = tjLugares(), s = TJ.pala.obj.position;
      var az = Math.atan2(-L.p.z + 0.7 * L.e.z, -L.p.x + 0.7 * L.e.x) + (f - 0.5) * 1.1;
      var d = tjVaiven(f, 125, 42);
      return tjOrbita(s.x + L.e.x * 7, s.y + 5, s.z + L.e.z * 7, az, d, d * 0.48 + 9, o);
    }},
    /* un camion cargado subiendo la rampa: el dron vuela a su lado, sobre el vacio */
    { dur: 24000, ini: function(T){
      var mejor = null, L = TJ.tabla.L;
      TJ.camiones.forEach(function(c){
        if(c.estado === 'viaja' && c.dir < 0 && c.s > L * 0.3 && c.s < L * 0.85 && (!mejor || c.s > mejor.s)) mejor = c;
      });
      if(!mejor) TJ.camiones.forEach(function(c){ if(!mejor && c.estado === 'viaja') mejor = c; });
      T.cam = mejor;
    }, pose: function(f, o, T){
      if(!T.cam) return null;
      var q = T.cam.obj.position, az = tjHaciaCentro(q.x, q.z) + (f - 0.5) * 1.6;
      var d = tjVaiven(f, 80, 30);
      return tjOrbita(q.x, q.y + 3, q.z, az, d, 14 + d * 0.32, o);
    }},
    /* la chancadora: el camion retrocede contra el muro y bascula */
    { dur: TJ_TOMA, pose: function(f, o){
      var D = TJ.descarga;
      if(!D) return null;
      var az = Math.atan2(-D.r.z, -D.r.x) + 0.85 - (f - 0.5) * 1.0;
      var d = tjVaiven(f, 150, 72);
      return tjOrbita(D.x + D.r.x * 18, (D.y || 2) + 5, D.z + D.r.z * 18, az, d, d * 0.5 + 10, o);
    }},
    /* las perforadoras en el banco de arriba */
    { dur: 16000, pose: function(f, o){
      var ps = TJ.extras.filter(function(e){ return e.tipo === 'perfo'; });
      if(!ps.length) return null;
      var x = 0, y = 0, z = 0;
      ps.forEach(function(e){ x += e.x; y += e.y; z += e.z; });
      x /= ps.length; y /= ps.length; z /= ps.length;
      var d = tjVaiven(f, 95, 36);
      return tjOrbita(x, y + 2, z, tjHaciaCentro(x, z) + (f - 0.5) * 1.2, d, d * 0.4 + 8, o);
    }},
    /* la excavadora cargando en su banco */
    { dur: 18000, pose: function(f, o){
      if(!TJ.exc) return null;
      var q = TJ.exc.obj.position, d = tjVaiven(f, 100, 34);
      return tjOrbita(q.x, q.y + 3, q.z, tjHaciaCentro(q.x, q.z) - 0.4 + (f - 0.5) * 1.2, d, d * 0.42 + 8, o);
    }}
  ];
}
var _tjPa = null, _tjPb = null, _tjDo = null;
function tjPoseToma(i, f, out){
  var T = TJ.dron.tomas[i];
  return T.pose(clamp(f, 0, 1), out, T);
}
function tjDron(dt, t){
  if(!_tjPa){
    _tjPa = { p: new THREE.Vector3(), m: new THREE.Vector3() };
    _tjPb = { p: new THREE.Vector3(), m: new THREE.Vector3() };
    _tjDo = {};
  }
  if(!TJ.dron) TJ.dron = { tomas: tjTomas(), i: 0, e: 0, vuelo: false };
  var D = TJ.dron, N = D.tomas.length;
  /* mientras el tajo se arma, solo la vista general */
  if(!TJ.listo){ D.i = 0; D.e = Math.min(D.e + dt, D.tomas[0].dur * 0.3); }
  else D.e += dt;
  var A = _tjPa, B = _tjPb, cur = D.tomas[D.i];
  if(!D.vuelo && D.e >= cur.dur){
    /* la siguiente toma que tenga que mostrar */
    var j = D.i;
    for(var k = 0; k < N; k++){
      j = (j + 1) % N;
      var Tj = D.tomas[j];
      if(Tj.ini) Tj.ini(Tj);
      if(tjPoseToma(j, 0, B)) break;
    }
    D.sig = j; D.vuelo = true; D.e = 0;
  }
  var res;
  if(D.vuelo){
    var k2 = Math.min(1, D.e / TJ_VUELO), s = k2 * k2 * (3 - 2 * k2);
    if(!tjPoseToma(D.i, 1, A)) tjPoseToma(0, 0.5, A);
    if(!tjPoseToma(D.sig, 0, B)) tjPoseToma(0, 0.5, B);
    camT.position.copy(A.p).lerp(B.p, s);
    /* sube a cruzar: tanto mas cuanto mas lejos queda la toma siguiente */
    camT.position.y += Math.sin(Math.PI * s) * clamp(A.p.distanceTo(B.p) * 0.28, 15, 140);
    _tjDo.m = A.m.clone().lerp(B.m, s);
    if(k2 >= 1){ D.i = D.sig; D.vuelo = false; D.e = 0; }
  } else {
    res = tjPoseToma(D.i, D.e / cur.dur, A);
    if(!res){ D.e = cur.dur; tjPoseToma(0, 0.5, A); }
    camT.position.copy(A.p);
    _tjDo.m = A.m.clone();
  }
  /* el pulso del dron: un vaiven chico, como suspendido en el aire */
  if(!REDUCIR){
    camT.position.x += Math.sin(t * 0.00071) * 1.6;
    camT.position.y += Math.sin(t * 0.00113) * 1.1;
    camT.position.z += Math.cos(t * 0.00089) * 1.6;
  }
  /* nunca bajo el terreno */
  var o = {};
  tjSuelo(camT.position.x, camT.position.z, o);
  if(camT.position.y < o.h + 9) camT.position.y = o.h + 9;
  camT.lookAt(_tjDo.m);
}

/* ═══ ritmo de cuadros parejo ═══
   Lo que el ojo ve como tirones no es tanto la cantidad de cuadros como que
   lleguen desparejos: con la pantalla refrescando cada 7 ms (144 Hz) o 17 ms
   (60 Hz), un cuadro que a veces tarda 3 refrescos y a veces 4 se nota. Aqui
   se dibuja siempre cada 'cad' refrescos (1, 2, 3 o 4), nunca mezclado:
   - si los cuadros llegan tarde, primero se baja un poco la resolucion (no
     menos de 0.8, para no emborronar) y despues se espacia el ritmo;
   - cuando van a tiempo un rato, se prueba un ritmo mas rapido (o mas
     resolucion); si la prueba falla, se vuelve y se espera mas para volver
     a probar.
   El refresco de la pantalla se mide solo: es el menor intervalo entre
   llamadas que se ve mientras se saltan cuadros. */
function tjRitmo(t){
  var P = TJ.paso;
  if(!P) P = TJ.paso = { vs: 16.7, cad: 1, ult: 0, prev: 0, iv: [], ok: 0, espera: 4, prueba: false,
                         base: rT.getPixelRatio(), esc: 1, crudos: [], nc: 0 };
  var raw = t - P.prev; P.prev = t;
  /* el refresco: el percentil 30 de los ultimos intervalos entre llamadas
     (un intervalo corto suelto, por un cuadro que llego tarde, no lo mueve) */
  if(raw > 2 && raw < 100){
    P.crudos[P.nc++ % 90] = raw;
    if(P.nc % 30 === 0 && P.crudos.length >= 30){
      var cr = P.crudos.slice().sort(function(a, b){ return a - b; });
      P.vs = clamp(cr[Math.floor(cr.length * 0.3)], 4, 34);
    }
  }
  if(P.ult && t - P.ult < P.cad * P.vs - P.vs * 0.5) return -1;        /* este refresco no se dibuja */
  var bruto = P.ult ? t - P.ult : P.vs; P.ult = t;
  if(bruto > 250) return P.vs;                                         /* la pestana estuvo en pausa */
  P.iv.push(bruto);
  if(P.iv.length >= (P.cad === 1 && !P.ok ? 30 : 60)){
    var o = P.iv.slice().sort(function(a, b){ return a - b; }), p90 = o[Math.floor(o.length * 0.9)], p75 = o[Math.floor(o.length * 0.75)];
    P.iv.length = 0;
    var meta = P.cad * P.vs, cambiaRes = 0;
    if(p90 > meta * 1.3){
      P.ok = 0;
      /* mientras se dibuja a destiempo, los intervalos dicen cuanto tarda la
         tarjeta: se salta directo al ritmo que alcanza, sin bajar de a uno */
      var hace = Math.ceil(p75 / P.vs - 0.05);
      if(P.prueba){ P.cad++; P.prueba = false; P.espera = Math.min(P.espera * 2, 40); }
      else if(P.cad < 4) P.cad = Math.min(4, Math.max(P.cad + 1, hace));
      else if(P.esc > 0.8) cambiaRes = -0.1;
    } else {
      P.prueba = false;
      if(++P.ok >= P.espera){
        P.ok = 0;
        if(P.esc < 1) cambiaRes = 0.05;
        else if(P.cad > 1){ P.cad--; P.prueba = true; }
      }
    }
    if(cambiaRes){
      P.esc = Math.round(clamp(P.esc + cambiaRes, 0.8, 1) * 100) / 100;
      rT.setPixelRatio(P.base * P.esc);
      rT.setSize(window.innerWidth, window.innerHeight, false);
    }
  }
  return bruto;
}

/* nivel de detalle: lejos de la camara, las piezas chicas de cada maquina no
   se dibujan (escaleras, barandas, tacos de llanta: a mas de ~140 m no se
   distinguen y son buena parte de los triangulos). Con margen para que no
   parpadeen en el limite. */
var _tjPw = null;
function tjDetalle(){
  if(!_tjPw) _tjPw = new THREE.Vector3();
  for(var i = 0; i < TJ.lod.length; i++){
    var o = TJ.lod[i];
    if(!o.parent || !o.userData.finos.length) continue;
    o.getWorldPosition(_tjPw);
    var d = _tjPw.distanceTo(camT.position), cerca = o.userData.cerca ? d < 150 : d < 130;
    if(cerca !== o.userData.cerca){
      o.userData.cerca = cerca;
      for(var k = 0; k < o.userData.finos.length; k++) o.userData.finos[k].visible = cerca;
    }
  }
}

/* ═══ cada cuadro ═══ */
function renderTajo(t, p){
  if(!rT || !TJ) return;
  var bruto = tjRitmo(t);
  if(bruto < 0) return;
  /* el paso de tiempo se suaviza: un cuadro que llega tarde no produce un salto */
  TJ.dtS = TJ.dtS ? TJ.dtS + (Math.min(bruto, 100) - TJ.dtS) * 0.25 : bruto;
  var dt = Math.min(80, TJ.dtS);
  if(REDUCIR) dt = 0;
  TJ.cuadro++;

  var m0 = TJ.medir ? performance.now() : 0;
  /* la camara es un dron que recorre la faena (tjDron) */
  tjDron(dt, t);
  if(TJ.camDbg){ camT.position.fromArray(TJ.camDbg.p); camT.lookAt(TJ.camDbg.m[0], TJ.camDbg.m[1], TJ.camDbg.m[2]); }

  /* con movimiento reducido dt es 0: las maquinas se ubican pero no avanzan */
  tjPasoCamiones(dt);
  tjPasoPala(dt);
  tjPasoOtros(dt, t);
  tjPasoPolvo(TJ.polvo, dt);
  tjPasoPiedras(dt);
  tjPasoSombras();
  tjDetalle();
  /* el cielo acompana a la camara: su horizonte queda a la altura del ojo */
  if(TJ.cielo) TJ.cielo.position.copy(camT.position);
  var m1 = TJ.medir ? performance.now() : 0;
  rT.render(TJ.esc, camT);
  /* medicion (solo en la vista previa): intervalo entre cuadros, calculo y dibujo */
  if(TJ.medir){ TJ.medir.push([bruto, m1 - m0, performance.now() - m1]); }
}
