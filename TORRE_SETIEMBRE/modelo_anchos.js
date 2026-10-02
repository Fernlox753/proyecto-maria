/* ══════════════════════════════════════════════════════════════════
   ANCHOS DE TRES EJES (6x4) — modelos de detalle
     TONLY TLH135   camion hibrido de cuerpo ancho     clave 'TLH135'  (FC-038-AL...)
     TONLY DTH145   hibrido de 91 t                    clave 'DTH145'  (FC-106-AL...)
     LGMG  RTH100   hibrido de 100 t                   clave 'RTH100'  (FC-518-AL...)
     LGMG  MS40     cisterna de agua sobre chasis 6x4  clave 'MS40'    (CI-690-AL...)

   Medidas de las fichas del fabricante:
   TLH135 (ficha TONLY, zaminechile.cl/.../TONLY-TLH135.pdf): 10.611 x 4.120 x
     4.755 m · ejes 4.175 + 1.900 · trocha 3.139 / 2.860 · llantas 480/95R29
     (diametro 1.65 m) · tolva 50 m3 · un cilindro HYVA FCA226 de levante
     frontal · suspension delantera hidroneumatica, tandem de ballestas.
   DTH145 (folleto TONLY «DT145 Series» 2024, disaequipment.co.za): 10.850 x
     4.960 x 4.715 m · ejes 4.200 + 1.900 · trocha 3.140 / 3.240 · llantas
     505/95R29 (1.70 m) · dos cilindros HYVA USE191 de levante frontal ·
     suspension hidroneumatica entera con brazo en A atras.
   RTH100 (ficha LGMG, wme.cn/lgmg-rth100): 10.700 x 5.258 x 4.421 m (el ancho
     es con espejos) · ejes 4.060 + 1.850 · trocha 3.414 / 3.240 · llantas
     505/95R29 adelante y 530/95R29 atras · tolva 6.4 x 4.2 x 1.85 · dos
     cilindros de levante · McPherson adelante, hidroneumatica atras.
   MS40 (LGMG, en.lgmg.com.cn/product/609.htm): 10.000 x 3.450 x 3.790 m ·
     tanque de 40 m3 · ejes 19 + 35 + 35 t. La batalla (5.25 + 1.45), las
     llantas (~14.00R25 duales) y la forma del tanque se midieron sobre las
     fotos del fabricante (costado, frente y cola); el color amarillo LGMG
     tambien sale de esas fotos: el de las unidades de Marcona es supuesto.

   Lo que no esta acotado (cabina, nariz, gabinetes, alero) sale de las fotos:
   TLH135 cabina a la izquierda pegada al frente y a la derecha el gabinete
   negro del sistema hibrido con los cables naranjas de alta tension a la vista,
   jaula gris adelante; DTH145 nariz con la parrilla a la derecha, cabina a la
   izquierda con escalera diagonal y gabinete negro de lamas detras; RTH100
   nariz angosta al centro con el logo rojo redondo y «RTH100» en vertical,
   cabina detras corrida a la izquierda, caja de baterias negra con la hoja
   verde; MS40 cabina avanzada, tanque eliptico, plataforma trasera con
   escalera, canon de agua arriba y barra de riego abajo.

   Ejes: frente hacia -X, arriba +Y, la izquierda del operador +Z. Llantas con
   la numeracion de SAP (diez posiciones): 1 delantera izquierda, 2 delantera
   derecha; eje medio 3 izq. exterior, 4 izq. interior, 5 der. interior,
   6 der. exterior; eje trasero 7, 8, 9, 10 en el mismo orden.
   ══════════════════════════════════════════════════════════════════ */
var ANC_GRIS = '#3C434B', ANC_GRIS2 = '#59616B', ANC_ACERO = '#4A4F55', ANC_HID = '#2E3238';

var ANC_MED = {
  TLH135: { marca: 'TONLY', largo: 10.611, alto: 4.755, vuelo: 1.85, ejes: [4.175, 1.90], trD: 3.139, trT: 2.86,
            llD: { r: 0.825, a: 0.48 }, llT: { r: 0.825, a: 0.48 }, hueco: 0.10, aroF: 0.47,
            c1: '#0F8C55', c2: '#0A6A3F', negro: '#1C1F23', aro: '#24282D', aro2: '#3A4047',
            yRiel: 1.30, altoRiel: 0.50, zRiel: 0.56, ballestas: true, hibrido: true,
            tolva: { x0: 2.55, ancho: 4.12, ys: 1.92, yb: 4.05, xa: 0.15 } },
  DTH145: { marca: 'TONLY', largo: 10.85, alto: 4.715, vuelo: 2.10, ejes: [4.20, 1.90], trD: 3.14, trT: 3.24,
            llD: { r: 0.848, a: 0.505 }, llT: { r: 0.848, a: 0.505 }, hueco: 0.10, aroF: 0.46,
            c1: '#0A7E5E', c2: '#066048', negro: '#1C1F23', aro: '#D5D9D5', aro2: '#A9B0AC',
            yRiel: 1.32, altoRiel: 0.50, zRiel: 0.56, brazoA: true, hibrido: true,
            tolva: { x0: 4.10, ancho: 4.50, ys: 1.95, yb: 4.00, xa: 1.10 } },
  RTH100: { marca: 'LGMG', largo: 10.70, alto: 4.421, vuelo: 2.05, ejes: [4.06, 1.85], trD: 3.414, trT: 3.24,
            llD: { r: 0.848, a: 0.505 }, llT: { r: 0.872, a: 0.53 }, hueco: 0.10, aroF: 0.46,
            c1: '#72A44E', c2: '#557F38', negro: '#1B1E22', aro: '#C8D2C0', aro2: '#A3B09A',
            yRiel: 1.32, altoRiel: 0.50, zRiel: 0.56, mcpherson: true, hibrido: true,
            tolva: { x0: 4.30, ancho: 4.20, ys: 1.95, yb: 3.80, xa: 1.05 } },
  MS40:   { marca: 'LGMG', largo: 10.00, alto: 3.79, vuelo: 1.95, ejes: [5.25, 1.45], trD: 2.65, trT: 2.45,
            llD: { r: 0.69, a: 0.375 }, llT: { r: 0.69, a: 0.375 }, hueco: 0.10, aroF: 0.50,
            c1: '#E07800', c2: '#A85600', negro: '#1C1F23', aro: '#C9CDD2', aro2: '#9EA4AA',
            yRiel: 1.05, altoRiel: 0.36, zRiel: 0.45, ballestas: true, ballestaDel: true, hibrido: false }
};

/* ═══ rotulos dibujados en lienzo (fondo transparente salvo que se diga) ═══ */
/* TONLY: la Z roja partida por una diagonal y el nombre */
function ancDibTonly(tinta){
  return function(g, w, h){
    var u = h;
    g.fillStyle = '#E2231A';
    g.beginPath();
    [[0.05, 0.15], [1.25, 0.15], [1.25, 0.33], [0.52, 0.67], [1.22, 0.67], [1.22, 0.85], [0.0, 0.85], [0.0, 0.67], [0.73, 0.33], [0.05, 0.33]]
      .forEach(function(p, i){ i ? g.lineTo(p[0] * u, p[1] * u) : g.moveTo(p[0] * u, p[1] * u); });
    g.closePath(); g.fill();
    g.globalCompositeOperation = 'destination-out';
    g.lineWidth = u * 0.07; g.beginPath(); g.moveTo(0.15 * u, 0.98 * u); g.lineTo(1.15 * u, 0.02 * u); g.stroke();
    g.globalCompositeOperation = 'source-over';
    g.fillStyle = tinta; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(u * 0.80) + 'px "Arial Black", Arial, sans-serif';
    g.fillText('TONLY', 1.42 * u, 0.53 * u, w - 1.45 * u);
  };
}
/* el cartel inclinado del DTH145: TONLY en rojo y el modelo en azul */
function ancDibBanner(modelo){
  return function(g, w, h){
    g.fillStyle = '#D9251C';
    g.beginPath(); g.moveTo(h * 0.25, 0); g.lineTo(w * 0.58, 0); g.lineTo(w * 0.58 - h * 0.25, h); g.lineTo(0, h); g.closePath(); g.fill();
    g.fillStyle = '#1F2E62';
    g.beginPath(); g.moveTo(w * 0.58, 0); g.lineTo(w, 0); g.lineTo(w - h * 0.25, h); g.lineTo(w * 0.58 - h * 0.25, h); g.closePath(); g.fill();
    g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'italic bold ' + Math.round(h * 0.70) + 'px "Arial Black", Arial, sans-serif';
    g.fillText('TONLY', w * 0.29, h * 0.54, w * 0.46);
    g.font = 'bold ' + Math.round(h * 0.56) + 'px "Arial Black", Arial, sans-serif';
    g.fillText(modelo, w * 0.78, h * 0.54, w * 0.36);
  };
}
/* la franja negra del costado del TLH135: «混合动力 ⚡ TONLY 同力重工» */
function ancDibTonlyLado(g, w, h){
  g.fillStyle = '#17191C'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#FFFFFF'; g.textBaseline = 'middle'; g.textAlign = 'left';
  g.font = 'bold ' + Math.round(h * 0.56) + 'px "Microsoft YaHei", "SimHei", Arial, sans-serif';
  g.fillText('混合动力', w * 0.04, h * 0.52);
  g.fillStyle = '#F2C200';
  g.beginPath(); g.moveTo(w * 0.36, h * 0.12); g.lineTo(w * 0.33, h * 0.56); g.lineTo(w * 0.36, h * 0.56); g.lineTo(w * 0.34, h * 0.90);
  g.lineTo(w * 0.40, h * 0.40); g.lineTo(w * 0.37, h * 0.40); g.lineTo(w * 0.39, h * 0.12); g.closePath(); g.fill();
  g.fillStyle = '#E2231A'; g.font = 'bold ' + Math.round(h * 0.52) + 'px "Arial Black", Arial, sans-serif';
  g.fillText('TONLY', w * 0.43, h * 0.54);
  g.fillStyle = '#FFFFFF'; g.font = 'bold ' + Math.round(h * 0.56) + 'px "Microsoft YaHei", "SimHei", Arial, sans-serif';
  g.fillText('同力重工', w * 0.70, h * 0.52);
}
/* el remolino rojo y azul de la puerta con el modelo */
function ancDibRemolino(txt){
  return function(g, w, h){
    g.lineCap = 'round';
    g.strokeStyle = '#E2231A'; g.lineWidth = h * 0.12;
    g.beginPath(); g.moveTo(w * 0.04, h * 0.62); g.quadraticCurveTo(w * 0.45, h * 0.20, w * 0.96, h * 0.42); g.stroke();
    g.strokeStyle = '#2350A8'; g.lineWidth = h * 0.09;
    g.beginPath(); g.moveTo(w * 0.10, h * 0.80); g.quadraticCurveTo(w * 0.52, h * 0.42, w * 0.96, h * 0.60); g.stroke();
    g.fillStyle = '#1B1E22'; g.textAlign = 'right'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.22) + 'px "Arial Black", Arial, sans-serif';
    g.fillText(txt, w * 0.95, h * 0.16);
  };
}
/* LGMG: el triangulo rojo de tres trazos y el nombre en chino */
function ancDibTriangulo(g, x, y, s){
  g.fillStyle = '#D52B1E';
  g.beginPath(); g.moveTo(x + s * 0.5, y); g.lineTo(x + s, y + s * 0.88); g.lineTo(x, y + s * 0.88); g.closePath(); g.fill();
  g.globalCompositeOperation = 'destination-out';
  g.beginPath(); g.moveTo(x + s * 0.5, y + s * 0.30); g.lineTo(x + s * 0.76, y + s * 0.74); g.lineTo(x + s * 0.24, y + s * 0.74); g.closePath(); g.fill();
  g.lineWidth = s * 0.06; g.beginPath(); g.moveTo(x + s * 0.5, y + s * 0.02); g.lineTo(x + s * 0.30, y + s * 0.62); g.stroke();
  g.beginPath(); g.moveTo(x + s * 0.98, y + s * 0.86); g.lineTo(x + s * 0.40, y + s * 0.74); g.stroke();
  g.globalCompositeOperation = 'source-over';
  g.fillStyle = '#D52B1E';
  g.beginPath(); g.moveTo(x + s * 0.5, y + s * 0.44); g.lineTo(x + s * 0.62, y + s * 0.66); g.lineTo(x + s * 0.38, y + s * 0.66); g.closePath(); g.fill();
}
function ancDibLgmgMarca(tinta){
  return function(g, w, h){
    ancDibTriangulo(g, h * 0.06, h * 0.10, h * 0.80);
    g.fillStyle = tinta; g.textAlign = 'left'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.66) + 'px "Microsoft YaHei", "SimHei", Arial, sans-serif';
    g.fillText('临工重机', h * 1.02, h * 0.52, w - h * 1.05);
  };
}
/* franja negra con texto blanco y raya roja (frente del alero LGMG) */
function ancDibBandaChina(txt){
  return function(g, w, h){
    g.fillStyle = '#16181B'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#D52B1E'; g.fillRect(0, h * 0.80, w, h * 0.10);
    g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.52) + 'px "Microsoft YaHei", "SimHei", Arial, sans-serif';
    g.fillText(txt, w * 0.5, h * 0.42);
  };
}
/* rotulo de modelo LGMG: placa gris oscura inclinada y raya roja debajo */
function ancDibModeloLgmg(txt){
  return function(g, w, h){
    g.fillStyle = '#34373C';
    g.beginPath(); g.moveTo(h * 0.20, 0); g.lineTo(w * 0.62, 0); g.lineTo(w * 0.62 - h * 0.20, h * 0.74); g.lineTo(0, h * 0.74); g.closePath(); g.fill();
    g.fillStyle = '#D52B1E'; g.fillRect(w * 0.08, h * 0.80, w * 0.90, h * 0.08);
    g.fillStyle = '#16181B'; g.fillRect(w * 0.60, h * 0.80, w * 0.38, h * 0.08);
    g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'italic bold ' + Math.round(h * 0.56) + 'px "Arial Black", Arial, sans-serif';
    g.fillText(txt, w * 0.30, h * 0.39, w * 0.52);
  };
}
/* texto blanco en vertical sobre negro (costados de la nariz del RTH100) */
function ancDibVertical(txt){
  return function(g, w, h){
    g.fillStyle = '#16181B'; g.fillRect(0, 0, w, h);
    g.save(); g.translate(w / 2, h / 2); g.rotate(-Math.PI / 2);
    g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(w * 0.62) + 'px "Arial Black", Arial, sans-serif';
    g.fillText(txt, 0, 0, h * 0.92); g.restore();
  };
}
/* la hoja verde con la bateria (caja de baterias del RTH100) */
function ancDibHoja(g, w, h){
  g.fillStyle = '#18191C'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#7CC243'; g.lineWidth = w * 0.045; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(w * 0.22, h * 0.86);
  g.bezierCurveTo(w * 0.10, h * 0.40, w * 0.40, h * 0.12, w * 0.84, h * 0.10);
  g.bezierCurveTo(w * 0.88, h * 0.55, w * 0.62, h * 0.86, w * 0.22, h * 0.86); g.stroke();
  g.beginPath(); g.moveTo(w * 0.22, h * 0.86); g.lineTo(w * 0.70, h * 0.28); g.stroke();
  g.lineWidth = w * 0.03;
  g.strokeRect(w * 0.36, h * 0.46, w * 0.20, h * 0.30);
  g.fillStyle = '#7CC243'; g.fillRect(w * 0.42, h * 0.42, w * 0.08, h * 0.04);
  for(var i = 0; i < 3; i++) g.fillRect(w * 0.39, h * (0.68 - i * 0.07), w * 0.14, h * 0.04);
}
/* la H verde de los hibridos LGMG en la puerta */
function ancDibH(g, w, h){
  g.fillStyle = '#5E9E3A'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'italic bold ' + Math.round(h * 0.92) + 'px "Arial Black", Arial, sans-serif';
  g.fillText('H', w * 0.45, h * 0.52);
  g.fillStyle = '#2F6A1F'; g.font = 'bold ' + Math.round(h * 0.16) + 'px "Microsoft YaHei", Arial, sans-serif';
  g.fillText('混动', w * 0.80, h * 0.80);
}
/* cinta reflectiva roja y blanca (se repite a lo largo) */
function ancDibCinta(g, w, h){
  g.fillStyle = '#F2F2F0'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#D3261C'; g.fillRect(0, 0, w / 2, h);
}
/* rotulo MS40: placa negra inclinada y tres rayas rojas */
function ancDibMs(txt){
  return function(g, w, h){
    g.fillStyle = '#16181B';
    g.beginPath(); g.moveTo(h * 0.25, 0); g.lineTo(w * 0.70, 0); g.lineTo(w * 0.70 - h * 0.25, h); g.lineTo(0, h); g.closePath(); g.fill();
    g.fillStyle = '#D52B1E';
    for(var i = 0; i < 3; i++){
      var x = w * 0.72 + i * w * 0.09;
      g.beginPath(); g.moveTo(x + h * 0.25, 0); g.lineTo(x + h * 0.25 + w * 0.05, 0); g.lineTo(x + w * 0.05, h); g.lineTo(x, h); g.closePath(); g.fill();
    }
    g.fillStyle = '#FFFFFF'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.70) + 'px "Arial Black", Arial, sans-serif';
    g.fillText(txt, w * 0.35, h * 0.54, w * 0.56);
  };
}
/* aviso amarillo de alta tension (cajas de baterias y gabinetes) */
function ancDibAviso(g, w, h){
  g.fillStyle = '#F2C200'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#16181B';
  g.beginPath(); g.moveTo(w * 0.5, h * 0.10); g.lineTo(w * 0.86, h * 0.86); g.lineTo(w * 0.14, h * 0.86); g.closePath(); g.fill();
  g.fillStyle = '#F2C200';
  g.beginPath(); g.moveTo(w * 0.53, h * 0.34); g.lineTo(w * 0.44, h * 0.60); g.lineTo(w * 0.52, h * 0.60); g.lineTo(w * 0.47, h * 0.80);
  g.lineTo(w * 0.58, h * 0.52); g.lineTo(w * 0.50, h * 0.52); g.lineTo(w * 0.56, h * 0.34); g.closePath(); g.fill();
}

/* placa plana con rotulo (transparente donde el lienzo no esta pintado);
   mira hacia +Z con ry = 0, hacia -X con ry = -PI/2, hacia -Z con ry = PI */
function ancPlaca(P, tex, w, h, x, y, z, ry, rz){
  var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.04, roughness: 0.5, metalness: 0.05 }));
  m.position.set(x, y, z); m.rotation.y = ry || 0;
  if(rz) m.rotateZ(rz);
  P.G.add(m);
  return m;
}
/* tramo de cinta reflectiva de largo L */
function ancCinta(P, L, h, x, y, z, ry, rz){
  var t = texRotulo3d(ancDibCinta, 64, 8);
  t.wrapS = THREE.RepeatWrapping; t.repeat.set(Math.max(1, Math.round(L / 0.30)), 1);
  return ancPlaca(P, t, L, h, x, y, z, ry, rz);
}
/* faro rectangular de LED en una cara que mira a -X (s = -1) o a +X (s = 1) */
function ancLuz(P, code, x, y, z, w, h, hex, s){
  s = s || -1;
  P.D.bloque(null, 0.08, h + 0.06, w + 0.06, 'mate', '#1E2125', x, y, z, 0.015);
  P.D.bloque(code, 0.03, h, w, 'vidrio', hex || '#F4EDCF', x + s * 0.045, y, z, 0.008);
}
/* baliza giratoria */
function ancBaliza(P, x, y, z, hex){
  P.D.cilindro(null, 0.07, 0.08, 0.05, 'mate', '#202327', x, y + 0.025, z, null, 16);
  var b = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(hex || '#F0A41C'), emissive: new THREE.Color(hex || '#F0A41C'), emissiveIntensity: 0.45, roughness: 0.3 }));
  b.position.set(x, y + 0.05, z); b.scale.y = 1.4; P.G.add(b);
}
/* espejo retrovisor: brazo de a a b y el espejo colgando de b */
function ancEspejo(P, a, b, hex){
  P.D.tubo(null, a, b, 0.025, 'pintura', hex || '#1C1F23', 8);
  P.D.bloque(null, 0.07, 0.56, 0.32, 'mate', '#16181B', b[0], b[1] - 0.24, b[2], 0.03);
  P.D.bloque(null, 0.015, 0.48, 0.25, 'cromo', null, b[0] + 0.04, b[1] - 0.24, b[2], 0.005);
}
/* escalera de a (abajo) a b (arriba); los largueros se separan en Z (enZ) o en X */
function ancEscalera(P, a, b, ancho, hex, enZ){
  var D = P.D, d = enZ ? [0, 0, ancho / 2] : [ancho / 2, 0, 0];
  [-1, 1].forEach(function(s){
    D.tubo(null, [a[0] + s * d[0], a[1], a[2] + s * d[2]], [b[0] + s * d[0], b[1], b[2] + s * d[2]], 0.026, 'pintura', hex, 8);
  });
  var L = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]), n = Math.max(2, Math.round(L / 0.30));
  for(var i = 1; i <= n; i++){
    var f = (i - 0.4) / n, p = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
    D.bloque(null, enZ ? 0.14 : ancho - 0.04, 0.03, enZ ? ancho - 0.04 : 0.14, 'metal', ANC_ACERO, p[0], p[1], p[2], 0.008);
  }
}
/* guardafango redondo sobre una rueda (cascara de cilindro abierta) */
function ancGuardafango(P, code, x, z, rRueda, ancho, hex){
  var g = new THREE.CylinderGeometry(rRueda + 0.13, rRueda + 0.13, ancho, 30, 1, true, Math.PI / 2 - 0.25, Math.PI + 0.15);
  var m = P.D.pon(code, g, 'pintura', hex, x, rRueda, z, [Math.PI / 2, 0, 0]);
  m.material.side = THREE.DoubleSide;
  return m;
}
/* rejilla de malla en una cara que mira a -X: marco, fondo negro y barras */
function ancRejilla(P, code, x, y0, y1, z0, z1, hexMarco, nH, nV){
  var D = P.D, yc = (y0 + y1) / 2, zc = (z0 + z1) / 2, h = y1 - y0, w = z1 - z0;
  D.bloque(code, 0.08, h, w, 'mate', '#0E0F11', x + 0.04, yc, zc, 0.01);
  [y0, y1].forEach(function(y){ D.bloque(null, 0.10, 0.07, w + 0.07, 'pintura', hexMarco, x, y, zc, 0.02); });
  [z0, z1].forEach(function(z){ D.bloque(null, 0.10, h, 0.07, 'pintura', hexMarco, x, yc, z, 0.02); });
  var i;
  for(i = 1; i < nH; i++) D.bloque(null, 0.03, 0.025, w, 'metal', '#2A2D31', x - 0.01, y0 + h * i / nH, zc, 0.005);
  for(i = 1; i < (nV || 0); i++) D.bloque(null, 0.03, h, 0.025, 'metal', '#2A2D31', x - 0.015, yc, z0 + w * i / nV, 0.005);
}

/* ═══ cabina: abajo del color del cuerpo, postes, vidrios con marco, techo ═══
   o = { x0, x1, z0, z1, y0 (piso), yv (borde de vidrios), y1 (techo), col, colP, colT, puerta (+1/-1) } */
function ancCabina(P, o){
  var D = P.D, b = D.bloque, G = P.G;
  var cx = (o.x0 + o.x1) / 2, cz = (o.z0 + o.z1) / 2, w = o.x1 - o.x0, d = o.z1 - o.z0;
  b('CBN', w, o.yv - o.y0, d, 'pintura', o.col, cx, (o.y0 + o.yv) / 2, cz, 0.07);
  b('CBN', w + 0.03, 0.07, d + 0.03, 'pintura', o.colP, cx, o.yv + 0.035, cz, 0.02);
  /* techo con alero y tapa */
  b('CBN', w + 0.14, 0.15, d + 0.14, 'pintura', o.colT, cx, o.y1 - 0.075, cz, 0.05);
  b(null, w - 0.25, 0.06, d - 0.25, 'pintura', o.colT, cx, o.y1 + 0.03, cz, 0.03);
  /* postes del ROPS y de la puerta */
  var xp = o.x0 + w * 0.50;
  [[o.x0 + 0.05, o.z0 + 0.05], [o.x0 + 0.05, o.z1 - 0.05], [o.x1 - 0.05, o.z0 + 0.05], [o.x1 - 0.05, o.z1 - 0.05], [xp, o.z1 - 0.05], [xp, o.z0 + 0.05]]
    .forEach(function(p){ b('CBN', 0.10, o.y1 - o.yv - 0.20, 0.10, 'pintura', o.colP, p[0], (o.yv + o.y1 - 0.15) / 2 + 0.01, p[1], 0.025); });
  /* vidrios */
  var hV = o.y1 - o.yv - 0.24, yV = o.yv + 0.08 + hV / 2;
  var vid = function(ww, hh, dd, x, y, z){ var m = new THREE.Mesh(new THREE.BoxGeometry(ww, hh, dd), D.M.vidrio('#1A2A3A')); m.position.set(x, y, z); G.add(m); return m; };
  vid(0.03, hV, d - 0.16, o.x0 + 0.012, yV, cz);
  [o.z0 + 0.012, o.z1 - 0.012].forEach(function(z){
    vid(xp - o.x0 - 0.13, hV, 0.03, (o.x0 + xp) / 2, yV, z);
    vid(o.x1 - xp - 0.13, hV, 0.03, (xp + o.x1) / 2, yV, z);
  });
  vid(0.03, hV * 0.62, d - 0.16, o.x1 - 0.012, yV + hV * 0.14, cz);
  /* limpiaparabrisas */
  [cz - d * 0.22, cz + d * 0.22].forEach(function(z){ D.tubo(null, [o.x0 - 0.02, o.yv + 0.12, z], [o.x0 - 0.02, o.yv + 0.62, z + 0.28], 0.012, 'mate', '#111', 6); });
  /* puerta: junta, manilla cromada, bisagras y asideros */
  var zp = o.puerta > 0 ? o.z1 + 0.006 : o.z0 - 0.006, sp = o.puerta > 0 ? 1 : -1;
  b(null, 0.025, o.yv - o.y0 - 0.12, 0.012, 'mate', '#111316', xp - 0.03, (o.y0 + o.yv) / 2 + 0.04, zp, 0.004);
  b(null, w * 0.48, 0.025, 0.012, 'mate', '#111316', (o.x0 + xp) / 2, o.y0 + 0.08, zp, 0.004);
  b(null, 0.20, 0.045, 0.05, 'cromo', null, xp - 0.22, o.yv - 0.20, zp + sp * 0.02, 0.01);
  [o.yv - 0.30, o.y1 - 0.40].forEach(function(y){ b(null, 0.07, 0.11, 0.05, 'mate', '#202327', o.x0 + 0.07, y, zp + sp * 0.015, 0.01); });
  [o.x0 + 0.04, xp + 0.10].forEach(function(x){ D.tubo(null, [x, o.y0 + 0.20, zp + sp * 0.10], [x, o.y1 - 0.35, zp + sp * 0.10], 0.02, 'cromo', null, 8); });
  /* faros de trabajo en el borde del techo y aire acondicionado atras */
  [cz - d * 0.30, cz + d * 0.30].forEach(function(z){ ancLuz(P, null, o.x0 - 0.06, o.y1 + 0.10, z, 0.22, 0.12); });
  b('AAC', Math.min(0.80, w * 0.4), 0.16, d * 0.55, 'mate', ANC_GRIS, o.x1 - Math.min(0.80, w * 0.4) / 2 - 0.12, o.y1 + 0.11, cz, 0.04);
  ancBaliza(P, o.x0 + 0.30, o.y1 + 0.06, o.puerta > 0 ? o.z1 - 0.30 : o.z0 + 0.30);
  return { xp: xp, cx: cx, cz: cz };
}

/* ═══ bastidor, ejes, suspension y tren de fuerza (comun a los cuatro) ═══ */
function ancChasis(P){
  var C = P.C, D = P.D, b = D.bloque, tubo = D.tubo, cil = D.cilindro, N = C.negro;
  var yR = C.yRiel, hR = C.altoRiel, zR = C.zRiel, xr0 = P.XF + 0.50, xr1 = P.XC - 0.50;
  P.yTopeRiel = yR + hR / 2 + 0.03;
  /* largueros de cajon con ala arriba y abajo */
  [-1, 1].forEach(function(s){
    b('42023615', xr1 - xr0, hR, 0.24, 'pintura', N, (xr0 + xr1) / 2, yR, s * zR, 0.03);
    [hR / 2 + 0.015, -hR / 2 - 0.015].forEach(function(dy){ b(null, xr1 - xr0, 0.03, 0.30, 'pintura', N, (xr0 + xr1) / 2, yR + dy, s * zR, 0.01); });
  });
  [P.XF + 0.85, P.XD + 0.85, (P.XD + P.X1) / 2, P.X1 - 0.75, P.X2 + 0.75, P.XC - 0.70].forEach(function(x){
    b('42023615', 0.26, hR * 0.72, zR * 2 - 0.2, 'pintura', N, x, yR, 0, 0.03);
  });
  /* mangueras y arneses a lo largo de los largueros */
  [-1, 1].forEach(function(s){
    tubo('LPH', [P.XF + 0.8, yR + hR / 2 + 0.05, s * (zR + 0.15)], [P.X2, yR + hR / 2 + 0.05, s * (zR + 0.15)], 0.032, 'goma', '#22262B', 8);
    tubo(null, [P.XF + 0.8, yR - 0.10, s * (zR + 0.14)], [P.X2 - 0.4, yR - 0.10, s * (zR + 0.14)], 0.025, 'goma', '#2E3238', 8);
  });

  /* ── eje delantero ── */
  var zIn = P.zD - P.aD / 2;
  [-1, 1].forEach(function(s){
    /* tambor y masa por dentro de la rueda */
    cil(s > 0 ? 'BMLH' : 'BMRH', 0.27, 0.30, 0.30, 'metal', ANC_GRIS, P.XD, P.rD, s * (zIn - 0.15), [Math.PI / 2, 0, 0], 24);
    cil(null, 0.31, 0.31, 0.05, 'metal', ANC_GRIS2, P.XD, P.rD, s * (zIn - 0.02), [Math.PI / 2, 0, 0], 24);
  });
  if(C.mcpherson){
    /* McPherson: columna de cada rueda hasta la plataforma y brazos inferiores */
    [-1, 1].forEach(function(s){
      var zc = s * (zIn - 0.22);
      D.cilHidD(s > 0 ? 'SDI' : 'SDD', [P.XD + 0.10, 1.90, zc], [P.XD + 0.05, P.rD + 0.22, zc], 0.14, ANC_HID, 0.55);
      cil(null, 0.20, 0.20, 0.10, 'metal', ANC_GRIS2, P.XD + 0.10, 1.82, zc, null, 18);
      tubo(null, [P.XD, P.rD - 0.15, s * (zIn - 0.30)], [P.XD - 0.45, yR - hR / 2, s * zR], 0.06, 'pintura', N, 12);
      tubo(null, [P.XD, P.rD - 0.15, s * (zIn - 0.30)], [P.XD + 0.45, yR - hR / 2, s * zR], 0.06, 'pintura', N, 12);
      tubo(null, [P.XD - 0.25, P.rD + 0.05, s * (zIn - 0.28)], [P.XD - 0.25, P.rD + 0.10, s * 0.25], 0.035, 'metal', ANC_ACERO, 10);
    });
  } else {
    /* viga de eje con muñones, barra de direccion y cilindros de direccion */
    b(null, 0.24, 0.26, 2 * (zIn - 0.30), 'pintura', N, P.XD, P.rD - 0.02, 0, 0.04);
    tubo(null, [P.XD + 0.30, P.rD - 0.10, -(zIn - 0.32)], [P.XD + 0.30, P.rD - 0.10, zIn - 0.32], 0.04, 'metal', ANC_ACERO, 12);
    [-1, 1].forEach(function(s){
      cil(null, 0.10, 0.10, 0.42, 'metal', ANC_GRIS2, P.XD, P.rD, s * (zIn - 0.34), null, 14);
      D.cilHidD(null, [P.XD + 0.65, P.rD + 0.10, s * 0.40], [P.XD + 0.30, P.rD - 0.05, s * (zIn - 0.36)], 0.055, ANC_HID, 0.5);
      if(C.ballestaDel){
        /* ballesta delantera bajo el larguero */
        for(var k = 0; k < 5; k++) b(null, 1.50 - k * 0.24, 0.045, 0.10, 'metal', '#2A2D31', P.XD, P.rD + 0.16 + k * 0.05, s * zR, 0.01);
        b(s > 0 ? 'SDI' : 'SDD', 0.16, 0.30, 0.16, 'metal', ANC_GRIS2, P.XD, P.rD + 0.24, s * zR, 0.02);
      } else {
        /* suspension hidroneumatica: del soporte del larguero a la viga */
        b(null, 0.36, 0.30, 0.26, 'pintura', N, P.XD + 0.05, yR + 0.10, s * (zR + 0.22), 0.03);
        D.cilHidD(s > 0 ? 'SDI' : 'SDD', [P.XD + 0.05, yR + 0.02, s * (zR + 0.30)], [P.XD + 0.05, P.rD + 0.13, s * (zR + 0.30)], 0.12, ANC_HID, 0.55);
      }
    });
  }

  /* ── tandem trasero: puentes con diferencial, mandos finales y tambores ── */
  var zH = P.zI - P.aT / 2;
  [[P.X1, 'DIFD', 'DLH', 'DRH'], [P.X2, 'DIFP', 'MLH', 'MRH']].forEach(function(q, j){
    var x = q[0];
    pon3(D, q[1], new THREE.SphereGeometry(0.40, 28, 18), 'pintura', N, x, P.rT, 0);
    cil(q[1], 0.25, 0.30, 0.34, 'pintura', N, x - 0.38, P.rT + 0.04, 0, [0, 0, Math.PI / 2], 22);
    if(!j) cil(null, 0.17, 0.20, 0.25, 'pintura', N, x + 0.36, P.rT + 0.08, 0, [0, 0, Math.PI / 2], 18);
    cil(null, 0.15, 0.22, zH - 0.35, 'pintura', N, x, P.rT, (zH + 0.35) / 2, [Math.PI / 2, 0, 0], 20);
    cil(null, 0.22, 0.15, zH - 0.35, 'pintura', N, x, P.rT, -(zH + 0.35) / 2, [Math.PI / 2, 0, 0], 20);
    [-1, 1].forEach(function(s){
      cil(s > 0 ? q[2] : q[3], 0.30, 0.30, 0.20, 'metal', ANC_GRIS, x, P.rT, s * (zH - 0.11), [Math.PI / 2, 0, 0], 24);
      cil(null, 0.33, 0.33, 0.04, 'metal', ANC_GRIS2, x, P.rT, s * (zH - 0.02), [Math.PI / 2, 0, 0], 24);
    });
  });
  /* bocamaza trasera izquierda: el anillo de la masa por fuera de la rueda 7 */
  var rA = P.rT * C.aroF;
  cil('BPLH', rA * 0.66, rA * 0.66, 0.05, 'metal', ANC_GRIS2, P.X2, P.rT, P.zO + P.aT * 0.30 + 0.035, [Math.PI / 2, 0, 0], 28);

  /* suspension trasera */
  if(C.ballestas){
    /* tandem de ballestas invertidas con su munon al centro */
    var xm = (P.X1 + P.X2) / 2, zB = zR + 0.21;
    [-1, 1].forEach(function(s){
      for(var k = 0; k < 6; k++){
        b(k ? null : (s > 0 ? 'SPI' : 'SPD'), C.ejes[1] + 0.35 - k * 0.26, 0.05, 0.11, 'metal', '#2A2D31', xm, P.rT + 0.27 + k * 0.055, s * zB, 0.012);
      }
      b(null, 0.30, 0.22, 0.20, 'metal', ANC_GRIS2, xm, P.rT + 0.66, s * zB, 0.03);
      b(null, 0.42, yR - P.rT - 0.50, 0.16, 'pintura', N, xm, (P.rT + 0.70 + yR - hR / 2) / 2, s * zR, 0.03);
      cil(null, 0.13, 0.13, 0.30, 'metal', ANC_GRIS2, xm, P.rT + 0.62, s * (zB - 0.12), [Math.PI / 2, 0, 0], 16);
      /* barras de reaccion a los puentes */
      [P.X1, P.X2].forEach(function(x){ tubo(null, [x, P.rT + 0.30, s * 0.30], [xm, yR - hR / 2, s * 0.30], 0.045, 'metal', ANC_ACERO, 10); });
    });
  } else {
    /* hidroneumatica: un cilindro por puente y lado, del larguero al puente */
    [P.X1, P.X2].forEach(function(x, j){
      [-1, 1].forEach(function(s){
        var z = s * (zR + 0.27);
        b(null, 0.40, 0.30, 0.22, 'pintura', N, x + (j ? 0.35 : -0.35), yR + 0.08, z, 0.03);
        D.cilHidD(j ? null : (s > 0 ? 'SPI' : 'SPD'), [x + (j ? 0.35 : -0.35), yR, z], [x + (j ? 0.12 : -0.12), P.rT + 0.24, z], 0.12, ANC_HID, 0.55);
      });
      if(C.brazoA){
        /* brazo en A del puente al travesano */
        tubo(null, [x - 0.30, P.rT + 0.20, 0.40], [x - 1.05, yR - hR / 2, 0], 0.07, 'pintura', N, 12);
        tubo(null, [x - 0.30, P.rT + 0.20, -0.40], [x - 1.05, yR - hR / 2, 0], 0.07, 'pintura', N, 12);
      }
      /* barra estabilizadora transversal */
      tubo(null, [x + 0.30, P.rT + 0.18, -zR], [x + 0.30, P.rT + 0.18, zR], 0.04, 'metal', ANC_ACERO, 10);
    });
  }

  /* ── motor, generador, motor de traccion y caja ── */
  var xe0 = P.XF + 0.85, xe1 = P.XD + 0.35, ye = yR + 0.18;
  b('ENG1', xe1 - xe0, 0.72, 0.80, 'metal', ANC_GRIS, (xe0 + xe1) / 2, ye, 0, 0.06);
  b('ENG1', (xe1 - xe0) * 0.85, 0.12, 0.62, 'metal', ANC_GRIS2, (xe0 + xe1) / 2, ye + 0.42, 0, 0.03);
  cil(null, 0.30, 0.30, 0.10, 'metal', '#2E3238', xe0 - 0.02, ye - 0.05, 0, [0, 0, Math.PI / 2], 24);
  b('CMP', 0.38, 0.30, 0.30, 'metal', ANC_GRIS2, xe0 + 0.35, ye - 0.18, -(zR + 0.28), 0.03);
  cil(null, 0.08, 0.08, 0.6, 'metal', ANC_GRIS2, xe0 + 0.35, ye - 0.18, -(zR - 0.05), [Math.PI / 2, 0, 0], 12);
  var xt = xe1 + 0.15;
  if(C.hibrido){
    /* generador acoplado al motor y motor de traccion electrico */
    cil(null, 0.38, 0.38, 0.55, 'metal', '#4C545D', xt + 0.28, ye - 0.02, 0, [0, 0, Math.PI / 2], 28);
    for(var f = 0; f < 5; f++) cil(null, 0.40, 0.40, 0.03, 'metal', ANC_GRIS2, xt + 0.06 + f * 0.11, ye - 0.02, 0, [0, 0, Math.PI / 2], 28);
    xt += 0.62;
    cil(null, 0.32, 0.32, 0.55, 'metal', '#4C545D', xt + 0.28, yR - 0.05, 0, [0, 0, Math.PI / 2], 26);
    xt += 0.60;
  }
  b('TRM', 0.85, 0.55, 0.66, 'metal', ANC_GRIS, xt + 0.43, yR - 0.12, 0, 0.05);
  [0.15, 0.45, 0.75].forEach(function(dx){ b(null, 0.04, 0.58, 0.69, 'metal', ANC_GRIS2, xt + dx, yR - 0.12, 0, 0.01); });
  /* cardanes con sus crucetas */
  var cardan = function(a, c){
    tubo(null, a, c, 0.075, 'metal', '#80878F', 14);
    [a, c].forEach(function(p){ cil(null, 0.12, 0.12, 0.12, 'metal', '#2E3238', p[0], p[1], p[2], [0, 0, Math.PI / 2], 14); });
  };
  cardan([xt + 0.92, yR - 0.15, 0], [P.X1 - 0.58, P.rT + 0.04, 0]);
  cardan([P.X1 + 0.50, P.rT + 0.08, 0], [P.X2 - 0.58, P.rT + 0.04, 0]);
  /* engrase centralizado y tanques de aire */
  b('SEN', 0.40, 0.42, 0.22, 'mate', ANC_GRIS, P.X1 - 1.35, yR - 0.05, zR + 0.24, 0.03);
  cil(null, 0.09, 0.09, 0.40, 'metal', ANC_GRIS2, P.X1 - 1.35, yR + 0.34, zR + 0.24, null, 14);
  [0, 1].forEach(function(k){ cil(null, 0.13, 0.13, 0.95, 'metal', '#8E959C', P.X1 - 1.55 + k * 0.05, yR - 0.30 - k * 0.27, -(zR + 0.22), [0, 0, Math.PI / 2], 16); });
  /* faldones detras de las ruedas delanteras */
  [-1, 1].forEach(function(s){ b(null, 0.03, 0.65, P.aD + 0.10, 'goma', '#16181B', P.XD + P.rD + 0.30, 0.95, s * P.zD, 0.01); });
}
/* pon con el kit sin traer rot (atajo) */
function pon3(D, code, geo, tipo, hex, x, y, z){ return D.pon(code, geo, tipo, hex, x, y, z); }

/* ═══ llantas con la numeracion de SAP ═══ */
function ancRuedas(P){
  var C = P.C, D = P.D;
  var LD = { r: P.rD, ancho: P.aD, rAro: P.rD * C.aroF, aro: C.aro, aro2: C.aro2, pernos: 12, paso: 0.27, perno: '#8A8F96' };
  var LT = { r: P.rT, ancho: P.aT, rAro: P.rT * C.aroF, aro: C.aro, aro2: C.aro2, pernos: 12, paso: 0.27, perno: '#8A8F96' };
  D.ruedaDet('LL1', P.XD, P.zD, 1, LD);
  D.ruedaDet('LL2', P.XD, -P.zD, -1, LD);
  [[P.X1, 3], [P.X2, 7]].forEach(function(q){
    D.ruedaDet('LL' + q[1], q[0], P.zO, 1, LT);
    D.ruedaDet('LL' + (q[1] + 1), q[0], P.zI, 0, LT);
    D.ruedaDet('LL' + (q[1] + 2), q[0], -P.zI, 0, LT);
    D.ruedaDet('LL' + (q[1] + 3), q[0], -P.zO, -1, LT);
  });
}

/* ═══ tolva de cuerpo ancho: costados con banda lisa arriba y nervios abajo,
   pared delantera inclinada, alero que cubre la cabina y cola levantada ═══ */
function ancTolva(P){
  var C = P.C, T = C.tolva, D = P.D, esT = D.esTolva, b = D.bloque;
  var X0 = P.XF + T.x0, XC = P.XC - 0.02, ZB = T.ancho / 2, YS = T.ys, YB = T.yb;
  var XA = P.XF + T.xa, YA = C.alto;
  var XW = X0 - 0.25, YW = YB + 0.32;          /* arriba de la pared delantera */
  var XR = XC - 1.25, YT = YS + 0.72;          /* comienzo de la cola y su labio */
  var YM = YB - 0.78;                          /* larguero medio: sobre el, la banda lisa */
  var c1 = C.c1, c2 = C.c2;
  var bajo = function(x){ return x <= XR ? YS : YS + (x - XR) * (YT - YS) / (XC - XR); };
  P.T = { X0: X0, XC: XC, ZB: ZB, YS: YS, YB: YB, XA: XA, YA: YA, XW: XW, YW: YW, YM: YM };

  var costado = [[XW, YW], [X0 + 0.55, YB], [XC - 0.06, YB], [XC, YB - 0.06], [XC, YT], [XR, YS], [X0, YS]];
  [-1, 1].forEach(function(s){
    var zo = s * (ZB + 0.06);
    esT(D.perfil('TLV', costado, 0.08, s * (ZB - 0.04), 'pintura', c1, 0.02));
    /* larguero superior, su tramo que sube al alero, el medio y el de abajo */
    esT(b('TLV', XC - X0 - 0.55, 0.22, 0.22, 'pintura', c1, (X0 + 0.55 + XC) / 2, YB - 0.09, zo, 0.07));
    var lr = Math.hypot(X0 + 0.55 - XW, YW - YB);
    var r1 = esT(b('TLV', lr + 0.1, 0.22, 0.22, 'pintura', c1, (XW + X0 + 0.55) / 2, (YW + YB) / 2 - 0.09, zo, 0.07));
    r1.rotation.z = Math.atan2(YB - YW, X0 + 0.55 - XW);
    esT(b('TLV', XC - X0 - 0.25, 0.14, 0.16, 'pintura', c2, (X0 + 0.25 + XC) / 2, YM, s * (ZB + 0.04), 0.04));
    esT(b('TLV', XR - X0, 0.20, 0.20, 'pintura', c2, (X0 + XR) / 2, YS + 0.10, s * (ZB + 0.05), 0.05));
    var rc = esT(b('TLV', Math.hypot(XC - XR, YT - YS), 0.20, 0.20, 'pintura', c2, (XR + XC) / 2, (YS + YT) / 2 + 0.10, s * (ZB + 0.05), 0.05));
    rc.rotation.z = Math.atan2(YT - YS, XC - XR);
    /* nervios verticales bajo el larguero medio, mas hondos abajo */
    for(var x = X0 + 0.45; x < XC - 0.25; x += 0.70){
      var yb = bajo(x) + 0.20, yt = YM - 0.07;
      if(yt - yb < 0.25) continue;
      var gN = new THREE.BoxGeometry(0.13, yt - yb, 0.18);
      var pos = gN.attributes.position;
      for(var v = 0; v < pos.count; v++) if(pos.getY(v) > 0) pos.setZ(v, pos.getZ(v) * 0.5);
      gN.computeVertexNormals();
      esT(D.pon('TLV', gN, 'pintura', c2, x, (yb + yt) / 2, s * (ZB + 0.05)));
    }
    /* cinta reflectiva en el larguero de abajo */
    esT(ancCinta(P, XR - X0 - 0.3, 0.07, (X0 + XR) / 2, YS + 0.10, s * (ZB + 0.152), s > 0 ? 0 : Math.PI));
    /* ojo de izaje */
    esT(D.pon(null, new THREE.TorusGeometry(0.10, 0.032, 8, 16), 'mate', C.negro, X0 + 0.35, YB - 0.30, s * (ZB + 0.07)));
  });
  /* piso, rampa de cola y labio */
  esT(b('TLV', XR - X0 + 0.05, 0.10, ZB * 2 - 0.10, 'pintura', c1, (X0 + XR) / 2, YS + 0.05, 0, 0.03));
  var rampa = esT(b('TLV', Math.hypot(XC - XR, YT - YS), 0.10, ZB * 2 - 0.10, 'pintura', c1, (XR + XC) / 2, (YS + YT) / 2 + 0.05, 0, 0.03));
  rampa.rotation.z = Math.atan2(YT - YS, XC - XR);
  esT(b('TLV', 0.20, 0.18, ZB * 2 + 0.20, 'pintura', c2, XC - 0.04, YT + 0.02, 0, 0.05));
  /* vigas bajo el piso, nervios transversales y tacos de goma sobre el bastidor */
  [-1, 1].forEach(function(s){
    esT(b('TLV', XR - X0, 0.28, 0.26, 'pintura', c2, (X0 + XR) / 2, YS - 0.15, s * C.zRiel, 0.04));
    esT(b(null, 0.40, 0.06, 0.28, 'goma', '#22262B', X0 + 1.2, YS - 0.32, s * C.zRiel, 0.02));
    /* orejas de la articulacion trasera */
    esT(D.perfil(null, [[P.piv.x - 0.30, YS - 0.02], [P.piv.x + 0.40, YS - 0.02], [P.piv.x + 0.15, P.piv.y - 0.08], [P.piv.x - 0.15, P.piv.y - 0.08]], 0.10, s * (C.zRiel + 0.20), 'pintura', c2, 0.02));
  });
  for(var k = 0; k < 8; k++) esT(b(null, 0.12, 0.18, ZB * 2 - 0.40, 'pintura', c2, X0 + 0.40 + k * (XR - X0 - 0.6) / 7, YS - 0.09, 0, 0.03));
  /* pared delantera inclinada con dos nervios horizontales y orejas del cilindro */
  var lp = Math.hypot(X0 - XW, YW - YS);
  var pared = esT(b('TLV', 0.12, lp, ZB * 2 - 0.04, 'pintura', c1, (X0 + XW) / 2 - 0.02, (YS + YW) / 2, 0, 0.03));
  pared.rotation.z = Math.atan2(X0 - XW, YW - YS);
  [0.30, 0.66].forEach(function(f){
    var nv = esT(b(null, 0.16, 0.14, ZB * 2 - 0.10, 'pintura', c2, X0 + (XW - X0) * f - 0.10, YS + (YW - YS) * f, 0, 0.03));
    nv.rotation.z = pared.rotation.z;
  });
  /* alero: placa inclinada, faldones, labio, lamas por debajo y cartelas */
  var la = Math.hypot(XW - XA, YA - 0.07 - YW), angA = -Math.atan2(YA - 0.07 - YW, XW - XA);
  var al = esT(b('TLV', la + 0.05, 0.12, ZB * 2, 'pintura', c1, (XA + XW) / 2, (YA - 0.07 + YW) / 2, 0, 0.03));
  al.rotation.z = angA;
  [-1, 1].forEach(function(s){
    var bo = esT(b('TLV', la, 0.40, 0.08, 'pintura', c1, (XA + XW) / 2, (YA - 0.07 + YW) / 2 - 0.20, s * (ZB - 0.04), 0.03));
    bo.rotation.z = angA;
    esT(D.perfil('TLV', [[XW + 0.05, YW - 0.05], [XW - 1.10, YW + 0.12], [XW + 0.25, YW - 0.95]], 0.08, s * (ZB - 0.30), 'pintura', c1, 0.02));
  });
  for(var m = 1; m <= 5; m++){
    var xl = XW + (XA - XW) * m / 6.2, yl = YW + (YA - 0.07 - YW) * m / 6.2 - 0.16;
    esT(b(null, 0.08, 0.22, ZB * 2 - 0.30, 'pintura', c2, xl, yl, 0, 0.02));
  }
  esT(b('TLV', 0.10, 0.44, ZB * 2, 'pintura', c1, XA - 0.02, YA - 0.24, 0, 0.03));
  /* expulsores de piedras entre las duales */
  [P.X1, P.X2].forEach(function(x){
    [-1, 1].forEach(function(s){
      esT(D.tubo(null, [x + 0.05, YS - 0.04, s * C.trT / 2], [x - 0.02, 2 * P.rT - 0.15, s * C.trT / 2], 0.035, 'metal', ANC_GRIS2, 8));
      esT(b(null, 0.24, 0.08, 0.10, 'metal', ANC_GRIS2, x + 0.05, YS - 0.06, s * C.trT / 2, 0.02));
    });
  });
  /* numero de unidad en la banda lisa, atras, y en el frente del alero */
  [-1, 1].forEach(function(s){
    esT(ancPlaca(P, P.texNum, 1.75, 0.55, XC - 1.40, (YM + YB) / 2 - 0.04, s * (ZB + 0.005), s > 0 ? 0 : Math.PI));
  });
  /* soportes de la articulacion en el bastidor */
  [-1, 1].forEach(function(s){
    D.perfil(null, [[P.piv.x - 0.40, P.yTopeRiel - 0.02], [P.piv.x + 0.30, P.yTopeRiel - 0.02], [P.piv.x + 0.12, P.piv.y + 0.10], [P.piv.x - 0.12, P.piv.y + 0.10]], 0.10, s * (C.zRiel + 0.08), 'pintura', C.negro, 0.02);
    D.cilindro(null, 0.08, 0.08, 0.50, 'metal', '#80878F', P.piv.x, P.piv.y, s * (C.zRiel + 0.12), [Math.PI / 2, 0, 0], 14);
  });
  /* luces traseras en el travesano de cola del bastidor */
  [-1, 1].forEach(function(s){
    b(null, 0.10, 0.22, 0.60, 'mate', '#16181B', P.XC - 0.48, C.yRiel - 0.05, s * 0.85, 0.03);
    [-0.15, 0.15].forEach(function(dz, i){ b('LSM', 0.04, 0.15, 0.24, 'vidrio', i ? '#F2A31A' : '#C2241B', P.XC - 0.42, C.yRiel - 0.05, s * 0.85 + dz, 0.01); });
  });
}

/* cilindro de levante telescopico: camisa pintada y etapas cromadas */
function ancTelescopico(P, a, c, r, hex, n){
  var D = P.D, p = function(f){ return [a[0] + (c[0] - a[0]) * f, a[1] + (c[1] - a[1]) * f, a[2] + (c[2] - a[2]) * f]; };
  D.tubo('PHY', a, p(0.42), r, 'pintura', hex, 22);
  D.tubo(null, p(0.40), p(0.43), r * 1.12, 'pintura', hex, 22);
  var f0 = 0.42;
  for(var i = 1; i < n; i++){
    var f1 = f0 + (1 - 0.42) / (n - 1);
    D.tubo(null, p(f0 - 0.02), p(Math.min(1, f1)), r * (1 - i * 0.16), 'cromo', null, 18);
    f0 = f1;
  }
  D.pon(null, new THREE.SphereGeometry(r * 0.9, 14, 10), 'metal', '#3A3F45', a[0], a[1], a[2]);
  D.pon(null, new THREE.SphereGeometry(r * 0.8, 14, 10), 'metal', '#3A3F45', c[0], c[1], c[2]);
}
/* oreja en la pared delantera de la tolva que toma la punta de un cilindro frontal (sube con la tolva) */
function ancOrejaPared(P, c){
  var T = P.T, xw = T.X0 + (T.XW - T.X0) * (c[1] - T.YS) / (T.YW - T.YS);
  var L = xw - c[0] + 0.05;
  P.D.esTolva(P.D.bloque(null, L, 0.22, 0.36, 'pintura', P.C.c2, c[0] + L / 2 - 0.02, c[1], c[2], 0.03));
}

/* ═══ TONLY TLH135: cabina a la izquierda pegada al frente, gabinete hibrido
   negro a la derecha, jaula gris adelante y un cilindro frontal rojo ═══ */
function ancFrenteTLH(P){
  var C = P.C, D = P.D, b = D.bloque, tubo = D.tubo, N = C.negro, c1 = C.c1, XF = P.XF;
  var YD = 1.98;                                   /* plataforma */
  var X0 = P.XF + C.tolva.x0, XT = -3.06;          /* fondo de cabina y gabinete, delante de la pared */
  /* parachoques negro con luces, ganchos y peldanos colgantes */
  b('42023615', 0.46, 0.50, 3.70, 'pintura', N, XF + 0.23, 0.98, 0, 0.06);
  b(null, 0.44, 0.03, 3.60, 'mate', '#2A2E33', XF + 0.23, 1.245, 0, 0.01);
  [-1, 1].forEach(function(s){
    ancLuz(P, 'LSM', XF - 0.01, 1.04, s * 1.45, 0.24, 0.12, '#F2A31A');
    ancLuz(P, 'LSM', XF - 0.01, 1.04, s * 1.15, 0.24, 0.12);
    b(null, 0.22, 0.20, 0.24, 'pintura', N, XF - 0.06, 0.86, s * 0.65, 0.04);
    D.cilindro(null, 0.05, 0.05, 0.30, 'metal', ANC_ACERO, XF - 0.10, 0.86, s * 0.65, null, 12);
  });
  /* frente bajo la cabina: placa verde con parrilla, TONLY y faros cuadrados */
  b(null, 0.16, YD - 1.24, 2.70, 'pintura', c1, XF + 0.40, (1.24 + YD) / 2, 0, 0.04);
  ancRejilla(P, null, XF + 0.30, 1.32, 1.86, -0.62, 0.62, N, 6, 10);
  var texLogoN = texRotulo3d(ancDibTonly('#FFFFFF'), 512, 112);
  ancPlaca(P, texLogoN, 0.62, 0.135, XF + 0.245, 1.78, 0, -Math.PI / 2);
  [-1, 1].forEach(function(s){
    ancLuz(P, s > 0 ? 'FDI' : 'LSM', XF + 0.30, 1.60, s * 0.96, 0.26, 0.20);
    ancLuz(P, 'LSM', XF + 0.30, 1.38, s * 0.96, 0.26, 0.10, '#F2A31A');
  });
  /* plataforma con guardafangos negros redondos sobre las ruedas */
  b(null, X0 - 0.15 - (XF + 0.32), 0.12, 4.00, 'pintura', N, (XF + 0.32 + X0 - 0.15) / 2, YD - 0.06, 0, 0.03);
  [-1, 1].forEach(function(s){
    ancGuardafango(P, null, P.XD, s * P.zD, P.rD, P.aD + 0.22, N);
    b(null, 1.30, 0.40, 0.10, 'pintura', c1, P.XD + 0.25, YD - 0.26, s * 2.00, 0.03);
    /* escalera de cada lado delante de la rueda, con asideros */
    var xe = P.XD - P.rD - 0.28;
    ancEscalera(P, [xe, 0.38, s * 1.62], [xe, YD - 0.04, s * 1.62], 0.44, N, true);
    tubo(null, [xe, YD, s * 1.84], [xe, YD + 1.0, s * 1.84], 0.025, 'pintura', '#5B6168', 8);
  });

  /* cabina a la izquierda */
  var cab = ancCabina(P, { x0: XF + 0.50, x1: XT, z0: 0.12, z1: 2.00, y0: YD, yv: 2.80, y1: 3.80,
                           col: c1, colP: c1, colT: c1, puerta: 1 });
  var texRem = texRotulo3d(ancDibRemolino('TLH135'), 512, 160);
  ancPlaca(P, texRem, 1.05, 0.33, (XF + 0.50 + cab.xp) / 2 + 0.05, 2.38, 2.007, 0);

  /* gabinete hibrido negro a la derecha: radiador al costado, frente abierto
     con los cables naranjas de alta tension detras de la reja gris */
  var gx0 = XF + 0.55, gz0 = -0.34, gz1 = -2.00, gy1 = 3.86;
  var gcx = (gx0 + XT) / 2, gcz = (gz0 + gz1) / 2;
  b('EC', XT - gx0 - 0.30, gy1 - YD, gz0 - gz1, 'pintura', '#1A1C1F', gcx + 0.15, (YD + gy1) / 2, gcz, 0.05);
  b(null, 0.06, gy1 - YD - 0.10, gz0 - gz1, 'mate', '#0D0E10', gx0 + 0.32, (YD + gy1) / 2, gcz, 0.02);
  for(var k = 0; k < 7; k++){
    var y = YD + 0.30 + k * 0.22;
    tubo('HAR', [gx0 + 0.24, y, gz0 - 0.15], [gx0 + 0.20, y + 0.06, gz1 + 0.15], 0.035, 'mate', '#F25A0C', 8);
  }
  [0, 1, 2].forEach(function(k){ tubo('HAR', [gx0 + 0.22, YD + 0.25, gz0 - 0.4 - k * 0.45], [gx0 + 0.22, gy1 - 0.25, gz0 - 0.4 - k * 0.45], 0.04, 'mate', '#F25A0C', 8); });
  for(var v = 0; v < 8; v++) tubo(null, [gx0 + 0.02, YD + 0.05, gz0 - 0.10 - v * 0.21], [gx0 + 0.02, gy1 - 0.05, gz0 - 0.10 - v * 0.21], 0.022, 'pintura', '#5B6168', 8);
  b(null, 0.10, 0.10, gz0 - gz1, 'pintura', '#5B6168', gx0, gy1 - 0.05, gcz, 0.02);
  b(null, 0.10, 0.10, gz0 - gz1, 'pintura', '#5B6168', gx0, YD + 0.08, gcz, 0.02);
  /* radiador en el costado derecho: marco y lamas */
  b('RAD1', XT - gx0 - 0.70, 1.10, 0.06, 'mate', '#0D0E10', gcx + 0.25, YD + 0.75, gz1 - 0.01, 0.01);
  for(var l = 0; l < 9; l++) b(null, XT - gx0 - 0.74, 0.035, 0.05, 'metal', '#2A2D31', gcx + 0.25, YD + 0.28 + l * 0.118, gz1 - 0.04, 0.005);
  /* aviso de alta tension, baliza roja y escape */
  ancPlaca(P, texRotulo3d(ancDibAviso, 128, 96), 0.26, 0.20, gcx + 1.0, gy1 - 0.45, gz1 - 0.015, Math.PI);
  ancBaliza(P, gx0 + 0.40, gy1, gz1 + 0.25, '#E0281C');
  D.cilindro(null, 0.09, 0.09, 1.10, 'metal', '#80878F', XT - 0.20, gy1 + 0.25, gz1 + 0.35, null, 14);
  D.cilindro(null, 0.11, 0.09, 0.12, 'mate', '#202327', XT - 0.20, gy1 + 0.82, gz1 + 0.35, null, 14);

  /* jaula gris delante de la cabina y el gabinete */
  var JG = '#5B6168', xj = XF + 0.30;
  [-1.98, -1.10, -0.20, 0.55, 1.30, 1.98].forEach(function(z){ tubo(null, [xj, YD, z], [xj, 3.45, z], 0.04, 'pintura', JG, 10); });
  [2.55, 3.45].forEach(function(y){ tubo(null, [xj, y, -1.98], [xj, y, 1.98], 0.04, 'pintura', JG, 10); });
  [-1.98, 1.98].forEach(function(z){ tubo(null, [xj, 3.45, z], [XF + 0.70, 3.80, z * 0.98], 0.035, 'pintura', JG, 10); });
  /* espejos grandes en brazos desde la jaula */
  ancEspejo(P, [xj, 3.40, 1.98], [xj - 0.20, 3.55, 2.40], JG);
  ancEspejo(P, [xj, 3.40, -1.98], [xj - 0.20, 3.55, -2.40], JG);

  /* cilindro frontal unico (HYVA FCA226), rojo, delante de la pared */
  var xc = XT - 0.22;
  D.bloque(null, 0.40, 0.30, 0.50, 'pintura', N, xc, P.yTopeRiel + 0.12, -0.12, 0.03);
  ancTelescopico(P, [xc, P.yTopeRiel + 0.30, -0.12], [xc - 0.04, C.tolva.yb - 0.05, -0.12], 0.17, '#C8322A', 4);
  ancOrejaPared(P, [xc - 0.04, C.tolva.yb - 0.05, -0.12]);

  /* bajo la plataforma: baterias a la izquierda, combustible e hidraulico a la derecha */
  var xb0 = P.XD + P.rD + 0.45, xb1 = P.X1 - P.rT - 0.25;
  var texAv = texRotulo3d(ancDibAviso, 128, 96);
  [0, 1].forEach(function(k){
    var y = 0.95 + k * 0.42;
    b('BAT', xb1 - xb0, 0.38, 0.80, 'pintura', '#1A1C1F', (xb0 + xb1) / 2, y, 1.32, 0.04);
    ancPlaca(P, texAv, 0.30, 0.22, xb0 + 0.30 + k * 0.6, y, 1.725, 0);
  });
  b(null, xb1 - xb0 + 0.1, 0.06, 0.86, 'metal', ANC_ACERO, (xb0 + xb1) / 2, 1.62, 1.32, 0.02);
  b('TQC1', (xb1 - xb0) * 0.58, 0.72, 0.78, 'pintura', N, xb0 + (xb1 - xb0) * 0.29, 1.15, -1.32, 0.10);
  D.cilindro(null, 0.08, 0.08, 0.08, 'mate', '#101114', xb0 + 0.25, 1.55, -1.32, null, 16);
  b('TQH1', (xb1 - xb0) * 0.36, 0.72, 0.78, 'pintura', c1, xb1 - (xb1 - xb0) * 0.18, 1.15, -1.32, 0.10);
  D.cilindro(null, 0.06, 0.06, 0.03, 'vidrio', '#9BB7C9', xb1 - 0.30, 1.20, -1.715, [Math.PI / 2, 0, 0], 16);
  /* cables naranjas de alta tension del gabinete al motor de traccion */
  [-0.20, 0.0].forEach(function(dz){ tubo('HAR', [P.XD + 0.6, YD - 0.15, -0.55 + dz], [P.XD + 1.6, C.yRiel - 0.15, -0.30 + dz], 0.035, 'mate', '#F25A0C', 8); });

  /* rotulos de la tolva: TONLY en el alero, franja negra en el costado */
  var T = P.T, texLogo = texRotulo3d(ancDibTonly('#16181B'), 512, 112);
  D.esTolva(ancPlaca(P, texLogo, 1.75, 0.38, T.XA - 0.08, T.YA - 0.24, 0.55, -Math.PI / 2));
  D.esTolva(ancPlaca(P, P.texNum, 1.05, 0.33, T.XA - 0.08, T.YA - 0.24, -1.30, -Math.PI / 2));
  var texLado = texRotulo3d(ancDibTonlyLado, 768, 96);
  [-1, 1].forEach(function(s){
    D.esTolva(ancPlaca(P, texLado, 2.30, 0.29, T.X0 + 2.10, (T.YM + T.YB) / 2 - 0.04, s * (T.ZB + 0.005), s > 0 ? 0 : Math.PI));
  });
}

/* ═══ TONLY DTH145: nariz con parrilla a la derecha, cabina a la izquierda,
   escalera diagonal, gabinete de lamas y dos cilindros frontales ═══ */
function ancFrenteDTH(P){
  var C = P.C, D = P.D, b = D.bloque, tubo = D.tubo, N = C.negro, c1 = C.c1, XF = P.XF;
  var YD = 1.98, X0 = P.XF + C.tolva.x0;
  var CX0 = -4.05, CX1 = -2.15;
  /* parachoques negro macizo con ganchos y luces */
  b('42023615', 0.50, 0.55, 3.90, 'pintura', N, XF + 0.25, 0.98, 0, 0.06);
  [-1, 1].forEach(function(s){
    b(null, 0.20, 0.26, 0.26, 'pintura', N, XF - 0.06, 0.82, s * 1.10, 0.04);
    D.cilindro(null, 0.05, 0.05, 0.34, 'metal', ANC_ACERO, XF - 0.12, 0.82, s * 1.10, null, 12);
    ancLuz(P, 'LSM', XF - 0.01, 1.10, s * 1.70, 0.28, 0.12);
    [0.30, 0.55].forEach(function(y){ b(null, 0.04, 0.03, 0.40, 'metal', ANC_ACERO, XF + 0.02, y, s * 1.62, 0.006); });
    [-0.20, 0.20].forEach(function(dz){ b(null, 0.04, 0.50, 0.05, 'pintura', N, XF + 0.04, 0.48, s * 1.62 + dz, 0.01); });
  });
  /* nariz del radiador a la derecha: caja verde con parrilla negra y TONLY */
  var NX0 = XF + 0.40, NX1 = XF + 1.95, NZ0 = -2.02, NZ1 = -0.38;
  b(null, 0.78, 1.72, NZ1 - NZ0, 'pintura', c1, NX0 + 0.39, 1.25 + 0.86, (NZ0 + NZ1) / 2, 0.06);
  b(null, NX1 - NX0 - 0.70, 1.00, NZ1 - NZ0, 'pintura', c1, (NX0 + 0.70 + NX1) / 2, YD + 0.48, (NZ0 + NZ1) / 2, 0.06);
  ancRejilla(P, 'RAD1', NX0 - 0.01, 1.32, 2.86, NZ0 + 0.10, NZ1 - 0.10, '#22262A', 5, 14);
  var texT = texRotulo3d(rotuloTexto('TONLY', '#202327', '#E8ECEF', 0.95), 320, 96);
  D.letrero(texT, 0.62, 0.19, NX0 - 0.065, 2.38, (NZ0 + NZ1) / 2, -Math.PI / 2);
  /* asideros a los lados de la parrilla */
  [NZ0 - 0.03, NZ1 + 0.03].forEach(function(z){ tubo(null, [NX0 + 0.10, 2.0, z], [NX0 + 0.10, 2.75, z], 0.025, 'pintura', N, 8); });
  /* ventilador y radiador detras de la parrilla */
  D.pon('RAD1', new THREE.TorusGeometry(0.55, 0.07, 10, 32), 'metal', ANC_GRIS2, NX0 + 0.55, 2.10, (NZ0 + NZ1) / 2, [0, Math.PI / 2, 0]);

  /* plataforma, guardafango verde izquierdo con luces y guardafangos negros */
  b(null, X0 - 0.15 - (XF + 0.40), 0.12, 4.20, 'pintura', N, (XF + 0.40 + X0 - 0.15) / 2, YD - 0.06, 0, 0.03);
  b(null, 0.30, 0.55, 0.95, 'pintura', c1, P.XD - P.rD - 0.22, YD - 0.33, 1.62, 0.05);
  D.faro('FDI', P.XD - P.rD - 0.40, YD - 0.20, 1.40, 0.10);
  ancLuz(P, 'LSM', P.XD - P.rD - 0.38, YD - 0.45, 1.80, 0.22, 0.12);
  b(null, 0.30, 0.55, 0.40, 'pintura', c1, P.XD - P.rD - 0.22, YD - 0.33, -1.62, 0.05);
  [-1, 1].forEach(function(s){
    ancGuardafango(P, null, P.XD, s * P.zD, P.rD, P.aD + 0.24, N);
    b(null, 1.80, 0.36, 0.10, 'pintura', c1, P.XD + 0.10, YD - 0.24, s * 2.08, 0.03);
  });
  /* escalera diagonal de la punta del parachoques a la plataforma, con pasamanos */
  ancEscalera(P, [XF + 0.30, 0.40, 1.20], [XF + 1.15, YD - 0.04, 1.20], 0.52, N, true);
  [0.94, 1.46].forEach(function(z){ tubo(null, [XF + 0.42, 1.30, z], [XF + 1.20, YD + 0.95, z], 0.025, 'pintura', N, 8); });
  /* baranda de la plataforma delante de la cabina */
  D.baranda([[XF + 1.20, -0.30], [XF + 1.20, 0.90]], YD, 1.0, N);
  D.baranda([[XF + 1.20, 1.50], [XF + 1.20, 2.08], [CX0 + 0.10, 2.08]], YD, 1.0, N);

  /* cabina a la izquierda */
  ancCabina(P, { x0: CX0, x1: CX1, z0: 0.12, z1: 2.08, y0: YD, yv: 2.82, y1: 3.86, col: c1, colP: c1, colT: c1, puerta: 1 });
  ancEspejo(P, [CX0 + 0.05, 3.55, 2.08], [CX0 - 0.15, 3.55, 2.48], N);
  ancEspejo(P, [NX0 + 0.40, YD + 0.95, NZ0], [NX0 + 0.20, 3.20, NZ0 - 0.40], N);
  tubo(null, [NX0 + 0.40, YD + 0.95, NZ0], [NX0 + 0.40, YD + 0.95, NZ0 + 0.4], 0.03, 'pintura', N, 8);

  /* gabinete negro de lamas detras de la cabina, a la izquierda */
  var ex0 = CX1 + 0.06, ex1 = X0 - 0.40;
  b('EC', ex1 - ex0, 1.75, 0.85, 'pintura', '#1A1C1F', (ex0 + ex1) / 2, YD + 0.875, 1.70, 0.04);
  for(var l = 0; l < 10; l++) b(null, ex1 - ex0 - 0.10, 0.035, 0.03, 'metal', '#34383D', (ex0 + ex1) / 2, YD + 0.95 + l * 0.075, 2.13, 0.005);
  ancPlaca(P, texRotulo3d(ancDibAviso, 128, 96), 0.22, 0.17, (ex0 + ex1) / 2, YD + 0.55, 2.13, 0);
  /* a la derecha, detras de la nariz: filtro de aire y escape */
  D.cilindro(null, 0.22, 0.22, 0.70, 'mate', N, NX1 + 0.35, YD + 0.80, -1.55, [0, 0, Math.PI / 2], 20);
  D.cilindro(null, 0.10, 0.10, 1.70, 'metal', '#80878F', NX1 + 0.85, YD + 0.85, -1.85, null, 14);
  b('BAT', 1.10, 0.95, 1.10, 'pintura', '#1A1C1F', NX1 + 1.00, YD + 0.475, -0.95, 0.04);

  /* dos cilindros frontales (HYVA USE191) delante de la pared */
  [-0.85, 0.85].forEach(function(z){
    var xc = X0 - 0.48;
    D.bloque(null, 0.40, 0.30, 0.40, 'pintura', N, xc, P.yTopeRiel + 0.12, z, 0.03);
    ancTelescopico(P, [xc, P.yTopeRiel + 0.30, z], [xc - 0.03, C.tolva.yb - 0.10, z], 0.15, ANC_HID, 4);
    ancOrejaPared(P, [xc - 0.03, C.tolva.yb - 0.10, z]);
  });

  /* tanques entre las ruedas: combustible negro a la izquierda, hidraulico a la derecha */
  var xb0 = P.XD + P.rD + 0.45, xb1 = P.X1 - P.rT - 0.25;
  b('TQC1', xb1 - xb0, 0.85, 0.72, 'pintura', '#1A1C1F', (xb0 + xb1) / 2, 1.15, 1.32, 0.10);
  for(var r = 1; r < 4; r++) b(null, 0.05, 0.86, 0.74, 'pintura', '#262A2F', xb0 + (xb1 - xb0) * r / 4, 1.15, 1.32, 0.02);
  D.cilindro(null, 0.08, 0.08, 0.08, 'mate', '#101114', xb0 + 0.25, 1.62, 1.32, null, 16);
  b('TQH1', (xb1 - xb0) * 0.7, 0.85, 0.72, 'pintura', c1, xb0 + (xb1 - xb0) * 0.35, 1.15, -1.32, 0.10);
  D.cilindro(null, 0.06, 0.06, 0.03, 'vidrio', '#9BB7C9', xb0 + 0.40, 1.25, -1.685, [Math.PI / 2, 0, 0], 16);

  /* rotulos: TONLY DTH145 inclinado en el costado, 同力重工 en el alero */
  var T = P.T, texB = texRotulo3d(ancDibBanner('DTH145'), 640, 96);
  [-1, 1].forEach(function(s){
    D.esTolva(ancPlaca(P, texB, 2.30, 0.34, T.X0 + 2.0, (T.YM + T.YB) / 2, s * (T.ZB + 0.005), s > 0 ? 0 : Math.PI, s > 0 ? -0.18 : 0.18));
  });
  var texCh = texRotulo3d(function(g, w, h){
    g.fillStyle = '#16181B'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold ' + Math.round(h * 0.80) + 'px "Microsoft YaHei", "SimHei", Arial, sans-serif';
    g.fillText('同力重工', w / 2, h * 0.52);
  }, 384, 96);
  D.esTolva(ancPlaca(P, texCh, 1.50, 0.36, T.XA - 0.08, T.YA - 0.24, 1.10, -Math.PI / 2));
  D.esTolva(ancPlaca(P, P.texNum, 1.05, 0.33, T.XA - 0.08, T.YA - 0.24, -1.20, -Math.PI / 2));
}

/* ═══ LGMG RTH100: nariz angosta al centro con el logo rojo, cabina detras
   corrida a la izquierda, baterias con la hoja verde, alero con franja negra ═══ */
function ancFrenteRTH(P){
  var C = P.C, D = P.D, b = D.bloque, tubo = D.tubo, N = C.negro, c1 = C.c1, XF = P.XF;
  var YD = 2.00, X0 = P.XF + C.tolva.x0;
  var CX0 = -4.05, CX1 = -2.20;
  /* parachoques verde con ranuras, cuatro luces ambar y peldanos negros */
  b('42023615', 0.44, 0.46, 3.50, 'pintura', c1, XF + 0.22, 1.00, 0, 0.06);
  for(var i = 0; i < 9; i++) b(null, 0.03, 0.20, 0.05, 'mate', '#16181B', XF - 0.005, 1.00, -0.60 + i * 0.15, 0.01);
  [-1, 1].forEach(function(s){
    [1.05, 1.40].forEach(function(z){ ancLuz(P, 'LSM', XF - 0.01, 1.00, s * z, 0.16, 0.13, '#F2A31A'); });
    [0.32, 0.58].forEach(function(y){ b(null, 0.24, 0.03, 0.36, 'metal', ANC_ACERO, XF + 0.10, y, s * 1.55, 0.006); });
    [-0.17, 0.17].forEach(function(dz){ b(null, 0.05, 0.55, 0.05, 'pintura', N, XF + 0.08, 0.50, s * 1.55 + dz, 0.01); });
  });
  D.cilindro(null, 0.06, 0.06, 0.30, 'metal', ANC_ACERO, XF - 0.06, 0.80, 0.55, null, 12);
  /* nariz angosta: parrilla con reja, logo rojo redondo, costados negros con RTH100 */
  var NX0 = XF + 0.14, NX1 = CX0 - 0.02, NZ0 = -1.15, NZ1 = 0.35, nz = (NZ0 + NZ1) / 2;
  b(null, NX1 - NX0, 1.65, NZ1 - NZ0, 'pintura', c1, (NX0 + NX1) / 2, 1.23 + 0.825, nz, 0.07);
  var tapa = b(null, NX1 - NX0 - 0.10, 0.10, NZ1 - NZ0 - 0.06, 'pintura', c1, (NX0 + NX1) / 2, 2.90, nz, 0.03);
  tapa.rotation.z = -0.05;
  ancRejilla(P, 'RAD1', NX0 - 0.01, 1.35, 2.70, NZ0 + 0.14, NZ1 - 0.14, N, 9, 6);
  /* reja de proteccion delante de la parrilla */
  [-0.45, -0.15, 0.15, 0.45].forEach(function(dz){ tubo(null, [NX0 - 0.10, 1.32, nz + dz], [NX0 - 0.10, 2.66, nz + dz], 0.025, 'pintura', '#2A2E33', 8); });
  [1.32, 2.66].forEach(function(y){ tubo(null, [NX0 - 0.10, y, NZ0 + 0.12], [NX0 - 0.10, y, NZ1 - 0.12], 0.025, 'pintura', '#2A2E33', 8); });
  D.cilindro(null, 0.13, 0.13, 0.04, 'pintura', '#C62A1E', NX0 - 0.13, 2.50, nz, [0, 0, Math.PI / 2], 24);
  var texTri = texRotulo3d(function(g, w, h){ ancDibTriangulo(g, w * 0.18, h * 0.18, w * 0.64); }, 128, 128);
  ancPlaca(P, texTri, 0.18, 0.18, NX0 - 0.155, 2.50, nz, -Math.PI / 2);
  var texVer = texRotulo3d(ancDibVertical('RTH100'), 96, 448);
  [NZ0, NZ1].forEach(function(z, k){
    var s = k ? 1 : -1;
    b(null, 1.05, 1.35, 0.05, 'pintura', '#1A1C1F', NX0 + 0.62, 2.02, z + s * 0.01, 0.02);
    ancPlaca(P, texVer, 0.28, 1.20, NX0 + 0.62, 2.02, z + s * 0.04, s > 0 ? 0 : Math.PI);
  });
  /* faros de la nariz en las esquinas */
  [NZ0 + 0.02, NZ1 - 0.02].forEach(function(z, k){ ancLuz(P, k ? 'FDI' : 'LSM', NX0 - 0.02, 1.18, z, 0.20, 0.14); });

  /* plataforma y guardafangos verdes cuadrados con dos faros cada uno */
  b(null, X0 - 0.15 - (CX0 - 0.10), 0.12, 4.10, 'pintura', N, (CX0 - 0.10 + X0 - 0.15) / 2, YD - 0.06, 0, 0.03);
  [-1, 1].forEach(function(s){
    var zf = s * P.zD;
    b(null, 2.10, 0.12, P.aD + 0.40, 'pintura', c1, P.XD - 0.10, YD - 0.06, zf, 0.03);
    b(null, 0.30, 0.72, P.aD + 0.40, 'pintura', c1, P.XD - 1.05, YD - 0.40, zf, 0.05);
    [-0.13, 0.13].forEach(function(dz){ ancLuz(P, 'LSM', P.XD - 1.21, YD - 0.30, zf + dz, 0.17, 0.14); });
    b(null, 1.90, 0.40, 0.08, 'pintura', N, P.XD - 0.05, YD - 0.30, s * (P.zD + P.aD / 2 + 0.18), 0.02);
    ancGuardafango(P, null, P.XD, zf, P.rD, P.aD + 0.22, N);
    /* escaleras delante de las ruedas */
    var xe = P.XD - P.rD - 0.30;
    ancEscalera(P, [xe, 0.40, s * 1.30], [xe, YD - 0.40, s * 1.30], 0.42, N, true);
  });
  /* pasamanos y postes de espejo altos */
  tubo(null, [P.XD - 1.10, YD, -2.05], [P.XD - 1.10, 3.30, -2.05], 0.035, 'pintura', N, 10);
  ancEspejo(P, [P.XD - 1.10, 3.30, -2.05], [P.XD - 1.30, 3.45, -2.45], N);
  tubo(null, [CX0 + 0.05, YD + 0.5, 1.85], [CX0 + 0.05, 3.40, 1.85], 0.03, 'pintura', N, 10);
  ancEspejo(P, [CX0 + 0.05, 3.40, 1.85], [CX0 - 0.20, 3.55, 2.35], N);
  D.baranda([[CX0 - 0.15, -1.45], [CX0 - 0.15, -2.05], [CX1, -2.05]], YD, 1.0, N);

  /* cabina con la H verde de los hibridos en la puerta */
  var cab = ancCabina(P, { x0: CX0, x1: CX1, z0: -0.30, z1: 1.85, y0: YD, yv: 2.85, y1: 3.82, col: c1, colP: c1, colT: c1, puerta: 1 });
  ancPlaca(P, texRotulo3d(ancDibH, 256, 256), 0.55, 0.55, (CX0 + cab.xp) / 2, 2.40, 1.857, 0);

  /* caja de baterias negra con la hoja verde, detras de la cabina */
  var bx0 = CX1 + 0.08, bx1 = X0 - 0.38;
  b('BAT', bx1 - bx0, 1.62, 1.10, 'pintura', '#1A1C1F', (bx0 + bx1) / 2, YD + 0.81, 1.50, 0.05);
  var texHoja = texRotulo3d(ancDibHoja, 256, 256);
  ancPlaca(P, texHoja, 0.52, 0.52, (bx0 + bx1) / 2, YD + 0.95, 2.055, 0);
  b(null, 0.08, 1.30, 0.08, 'mate', ANC_GRIS2, bx0 + 0.05, YD + 0.85, 2.05, 0.01);
  /* a la derecha: modulo electronico con su hoja chica y el escape */
  b('EC', 1.55, 1.00, 1.30, 'pintura', '#1A1C1F', bx1 - 0.95, YD + 0.50, -1.30, 0.05);
  ancPlaca(P, texHoja, 0.36, 0.36, bx1 - 0.95, YD + 0.55, -1.955, Math.PI);
  D.cilindro(null, 0.10, 0.10, 1.60, 'metal', '#80878F', bx1 - 0.15, YD + 1.40, -1.85, null, 14);

  /* dos cilindros de levante entre el eje delantero y el tandem */
  [-0.95, 0.95].forEach(function(z){
    ancTelescopico(P, [P.X1 - 2.05, C.yRiel - 0.20, z], [P.X1 - 1.30, C.tolva.ys - 0.04, z], 0.15, ANC_HID, 3);
    D.esTolva(D.bloque(null, 0.40, 0.18, 0.30, 'pintura', C.c2, P.X1 - 1.30, C.tolva.ys - 0.09, z, 0.03));
  });

  /* tanques entre las ruedas */
  var xb0 = P.XD + P.rD + 0.45, xb1 = P.X1 - P.rT - 0.25;
  b('TQC1', (xb1 - xb0) * 0.55, 0.80, 0.72, 'pintura', N, xb0 + (xb1 - xb0) * 0.30, 1.15, 1.32, 0.10);
  b('TQH1', (xb1 - xb0) * 0.55, 0.80, 0.72, 'pintura', c1, xb0 + (xb1 - xb0) * 0.30, 1.15, -1.32, 0.10);

  /* rotulos: franja negra 临工重机 en el alero, RTH100 y la marca en los costados */
  var T = P.T;
  D.esTolva(ancPlaca(P, texRotulo3d(ancDibBandaChina('临工重机'), 768, 96), T.ZB * 2 - 0.10, 0.36, T.XA - 0.08, T.YA - 0.22, 0, -Math.PI / 2));
  ancBalizaTolva(P, T.XA + 0.30, T.YA + 0.02, 0);
  var texMod = texRotulo3d(ancDibModeloLgmg('RTH100'), 512, 128), texMarca = texRotulo3d(ancDibLgmgMarca('#2A2D31'), 448, 96);
  [-1, 1].forEach(function(s){
    D.esTolva(ancPlaca(P, texMod, 1.90, 0.47, T.X0 + 1.55, (T.YM + T.YB) / 2 + 0.02, s * (T.ZB + 0.005), s > 0 ? 0 : Math.PI));
    D.esTolva(ancPlaca(P, texMarca, 1.35, 0.29, T.X0 + 3.55, (T.YM + T.YB) / 2, s * (T.ZB + 0.005), s > 0 ? 0 : Math.PI));
  });
}
/* baliza montada en el alero: sube con la tolva */
function ancBalizaTolva(P, x, y, z){
  var D = P.D;
  D.esTolva(D.cilindro(null, 0.07, 0.08, 0.05, 'mate', '#202327', x, y + 0.025, z, null, 16));
  var bl = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: new THREE.Color('#F0A41C'), emissive: new THREE.Color('#F0A41C'), emissiveIntensity: 0.45, roughness: 0.3 }));
  bl.position.set(x, y + 0.05, z); bl.scale.y = 1.4; P.G.add(bl); D.esTolva(bl);
}

/* ═══ LGMG MS40: cisterna de agua — cabina avanzada, bomba detras, tanque
   eliptico con pasamanos, plataforma trasera, canon y barra de riego ═══ */
function ancCisternaMS(P){
  var C = P.C, D = P.D, b = D.bloque, tubo = D.tubo, N = C.negro, c1 = C.c1, c2 = C.c2, XF = P.XF, XC = P.XC;
  var CX0 = XF + 0.32, CX1 = CX0 + 1.70, CY0 = 1.55, CYV = 2.45, CY1 = 3.42;
  /* parachoques negro, luces y ganchos */
  b('42023615', 0.40, 0.46, 2.90, 'pintura', N, XF + 0.20, 0.98, 0, 0.05);
  for(var i = 0; i < 6; i++) b(null, 0.03, 0.22, 0.10, 'mate', '#0E0F11', XF - 0.005, 0.98, -0.55 + i * 0.22, 0.01);
  [-1, 1].forEach(function(s){
    ancLuz(P, 'LSM', XF - 0.01, 1.02, s * 1.18, 0.20, 0.13, '#F2A31A');
    D.cilindro(null, 0.05, 0.05, 0.28, 'metal', ANC_ACERO, XF - 0.06, 0.78, s * 0.75, null, 12);
  });
  /* frente bajo la cabina: rejilla negra entre las ruedas */
  ancRejilla(P, null, XF + 0.36, 1.22, 1.54, -0.85, 0.85, N, 3, 8);
  /* cabina avanzada de ancho completo */
  var cab = ancCabina(P, { x0: CX0, x1: CX1, z0: -1.32, z1: 1.32, y0: CY0, yv: CYV, y1: CY1, col: c1, colP: c1, colT: c1, puerta: 1 });
  /* parrilla con el logo redondo rojo y faros bajo el parabrisas */
  ancRejilla(P, 'RAD1', CX0 - 0.01, 1.80, 2.32, -0.62, 0.62, '#2A2E33', 5, 0);
  D.cilindro(null, 0.10, 0.10, 0.04, 'pintura', '#C62A1E', CX0 - 0.10, 2.06, 0, [0, 0, Math.PI / 2], 24);
  [-1, 1].forEach(function(s){
    ancLuz(P, s > 0 ? 'FDI' : 'LSM', CX0 - 0.01, 1.78, s * 0.98, 0.28, 0.18);
    ancLuz(P, 'LSM', CX0 - 0.01, 2.05, s * 0.98, 0.22, 0.10, '#F2A31A');
    /* peldanos y guardafango delante de la rueda */
    ancGuardafango(P, null, P.XD, s * P.zD, P.rD, P.aD + 0.20, c1);
    [0.55, 0.95, 1.32].forEach(function(y){ b(null, 0.32, 0.04, 0.42, 'metal', ANC_ACERO, P.XD - P.rD - 0.30, y, s * 1.30, 0.01); });
    [-0.19, 0.19].forEach(function(dz){ b(null, 0.30, 1.05, 0.04, 'pintura', c1, P.XD - P.rD - 0.30, 0.95, s * 1.30 + dz, 0.01); });
    /* marco exterior amarillo y espejos */
    tubo(null, [CX0 - 0.08, 1.60, s * 1.40], [CX0 - 0.08, CY1 + 0.25, s * 1.40], 0.04, 'pintura', c1, 10);
    ancEspejo(P, [CX0 - 0.08, 3.00, s * 1.40], [CX0 - 0.35, 3.05, s * 1.78], N);
  });
  /* visera con luces de galibo ambar */
  b(null, 0.22, 0.10, 2.50, 'pintura', N, CX0 - 0.05, CY1 - 0.02, 0, 0.02);
  [-0.9, -0.3, 0.3, 0.9].forEach(function(z){ ancBaliza(P, CX0 + 0.10, CY1 + 0.03, z, '#F0A41C'); });
  /* numero de unidad en el frente de la cabina */
  ancPlaca(P, P.texNum, 0.62, 0.20, CX0 - 0.005, 1.66, 0, -Math.PI / 2);
  var texMarca = texRotulo3d(ancDibLgmgMarca('#1C1F23'), 448, 96);
  ancPlaca(P, texMarca, 0.70, 0.15, (CX0 + cab.xp) / 2, 2.30, 1.327, 0);

  /* detras de la cabina: bomba de agua negra a la derecha, filtro y escape a la izquierda */
  var bx = CX1 + 0.40;
  b(null, 0.70, 0.20, 2.60, 'pintura', N, bx, P.yTopeRiel + 0.10, 0, 0.03);
  b(null, 0.62, 1.10, 0.80, 'mate', '#1A1C1F', bx, P.yTopeRiel + 0.75, -0.85, 0.06);
  D.cilindro(null, 0.28, 0.28, 0.40, 'metal', ANC_GRIS2, bx, P.yTopeRiel + 1.45, -0.85, [Math.PI / 2, 0, 0], 22);
  tubo(null, [bx, P.yTopeRiel + 0.30, -1.25], [bx + 0.6, P.yTopeRiel - 0.10, -1.35], 0.09, 'metal', '#8E959C', 14);
  D.cilindro(null, 0.22, 0.22, 0.75, 'mate', N, bx, P.yTopeRiel + 0.95, 0.85, null, 20);
  D.cilindro(null, 0.08, 0.08, 1.90, 'metal', '#80878F', bx + 0.15, P.yTopeRiel + 1.25, 1.20, null, 14);

  /* ── tanque de 40 m3 de seccion eliptica ── */
  var TX0 = CX1 + 0.95, TX1 = XC - 0.80, TZ = 1.55, TY0 = 1.82, TY1 = 3.70, TR = 0.62;
  var seccion = function(z, y0, y1, r){
    var pts = [], k;
    var esq = [[z - r, y1 - r, 0], [-z + r, y1 - r, Math.PI / 2], [-z + r, y0 + r, Math.PI], [z - r, y0 + r, Math.PI * 1.5]];
    esq.forEach(function(q){ for(k = 0; k <= 6; k++){ var a = q[2] + k / 6 * Math.PI / 2; pts.push([q[0] + Math.cos(a) * r, q[1] + Math.sin(a) * r]); } });
    return pts;
  };
  var L = TX1 - TX0, xt = (TX0 + TX1) / 2;
  D.perfilX(null, seccion(TZ, TY0, TY1, TR), L, xt, 'pintura', c1, 0.06);
  /* aros de las tapas y dos zunchos */
  [TX0 + 0.04, TX1 - 0.04, TX0 + L / 3, TX0 + 2 * L / 3].forEach(function(x, k){
    D.perfilX(null, seccion(TZ + 0.03, TY0 - 0.03, TY1 + 0.03, TR + 0.03), k < 2 ? 0.10 : 0.06, x, 'pintura', c2, 0.02);
  });
  /* cintas reflectivas y rotulos en los costados */
  var texMs = texRotulo3d(ancDibMs('MS40'), 384, 96);
  [-1, 1].forEach(function(s){
    [3.18, 2.52].forEach(function(y){ ancCinta(P, L - 0.40, 0.07, xt, y, s * (TZ + 0.012), s > 0 ? 0 : Math.PI); });
    ancPlaca(P, texMs, 1.10, 0.28, TX0 + 1.30, 3.42, s * (TZ + 0.012), s > 0 ? 0 : Math.PI);
    ancPlaca(P, texMarca, 1.30, 0.28, TX0 + 3.20, 2.86, s * (TZ + 0.012), s > 0 ? 0 : Math.PI);
    ancPlaca(P, P.texNum, 1.30, 0.40, TX1 - 1.20, 2.86, s * (TZ + 0.012), s > 0 ? 0 : Math.PI);
    /* pasamanos a lo largo del tanque, arriba */
    var zr = s * (TZ - 0.35);
    tubo(null, [TX0 + 0.30, TY1 + 0.30, zr], [TX1 - 0.30, TY1 + 0.30, zr], 0.022, 'pintura', c1, 8);
    for(var p = 0; p <= 6; p++){ var xpp = TX0 + 0.30 + p * (L - 0.60) / 6; tubo(null, [xpp, TY1 - 0.02, zr], [xpp, TY1 + 0.30, zr], 0.02, 'pintura', c1, 8); }
    /* largueros del falso chasis y cunas del tanque */
    b(null, L + 0.20, 0.24, 0.20, 'pintura', c2, xt, P.yTopeRiel + 0.12, s * C.zRiel, 0.03);
    for(var q = 0; q < 4; q++){
      var xq = TX0 + 0.40 + q * (L - 0.80) / 3;
      b(null, 0.16, TY0 + 0.25 - P.yTopeRiel - 0.24, 0.80, 'pintura', c2, xq, (P.yTopeRiel + 0.24 + TY0 + 0.25) / 2, s * (C.zRiel + 0.25), 0.03);
    }
    /* tuberia de llenado a lo largo del costado */
    tubo(null, [TX0 + 0.20, TY0 - 0.12, s * 1.25], [TX1 - 0.10, TY0 - 0.12, s * 1.25], 0.07, 'metal', '#8E959C', 14);
  });
  /* boca de visita y respiradero arriba */
  D.cilindro(null, 0.32, 0.32, 0.12, 'pintura', c2, TX0 + 1.0, TY1 + 0.06, 0, null, 28);
  D.cilindro(null, 0.26, 0.26, 0.06, 'metal', ANC_GRIS2, TX0 + 1.0, TY1 + 0.14, 0, null, 24);
  D.cilindro(null, 0.06, 0.06, 0.25, 'metal', ANC_GRIS2, TX1 - 1.20, TY1 + 0.12, 0.6, null, 12);

  /* defensas laterales rojas y blancas entre las ruedas */
  var gx0 = P.XD + P.rD + 0.35, gx1 = P.X1 - P.rT - 0.35;
  [-1, 1].forEach(function(s){
    [0.62, 0.92, 1.22].forEach(function(y){
      b(null, gx1 - gx0, 0.10, 0.05, 'pintura', '#F2F2F0', (gx0 + gx1) / 2, y, s * 1.48, 0.01);
      ancCinta(P, gx1 - gx0, 0.10, (gx0 + gx1) / 2, y, s * 1.508, s > 0 ? 0 : Math.PI);
    });
    [gx0, gx1].forEach(function(x){ b(null, 0.08, 0.78, 0.06, 'pintura', '#C2241B', x, 0.92, s * 1.48, 0.01); });
    tubo(null, [gx0 + 0.6, 1.25, s * 1.45], [gx0 + 0.6, P.yTopeRiel, s * (C.zRiel + 0.14)], 0.03, 'pintura', N, 8);
  });
  /* tanque de combustible a la izquierda y de aire a la derecha */
  b('TQC1', 1.20, 0.55, 0.50, 'metal', '#B5BCC3', P.XD + 1.70, 0.95, 0.90, 0.10);
  b('TQH1', 0.70, 0.50, 0.45, 'pintura', N, P.XD + 1.65, 0.95, -0.88, 0.08);

  /* ── cola: plataforma con baranda, escaleras, canon y barra de riego ── */
  var PX0 = TX1 + 0.02, PX1 = XC - 0.02, PY = 1.80;
  b(null, PX1 - PX0, 0.10, 2.70, 'metal', ANC_ACERO, (PX0 + PX1) / 2, PY, 0, 0.02);
  for(var g = 0; g < 7; g++) b(null, PX1 - PX0 - 0.04, 0.02, 0.03, 'metal', '#6A7179', (PX0 + PX1) / 2, PY + 0.06, -1.20 + g * 0.40, 0.005);
  [-1, 1].forEach(function(s){ tubo(null, [PX0 + 0.10, PY, s * 1.20], [PX0 + 0.10, P.yTopeRiel, s * (C.zRiel + 0.1)], 0.05, 'pintura', c2, 10); });
  D.baranda([[PX0 + 0.05, 1.35], [PX1 - 0.04, 1.35], [PX1 - 0.04, 0.55]], PY + 0.05, 1.0, c1);
  D.baranda([[PX0 + 0.05, -1.35], [PX1 - 0.04, -1.35], [PX1 - 0.04, -0.15]], PY + 0.05, 1.0, c1);
  /* escalera del suelo a la plataforma y del la plataforma al techo del tanque */
  ancEscalera(P, [PX1 + 0.06, 0.42, 0.20], [PX1 + 0.06, PY, 0.20], 0.45, c1, true);
  ancEscalera(P, [TX1 + 0.08, PY + 0.10, -0.55], [TX1 + 0.08, TY1 + 0.30, -0.55], 0.45, c1, true);
  /* canon de agua: columna, rotula y boquilla larga hacia atras y arriba */
  var zc = 0.75;
  tubo(null, [PX0 + 0.35, PY, zc], [PX0 + 0.35, TY1 + 0.10, zc], 0.07, 'metal', ANC_HID, 14);
  D.pon(null, new THREE.SphereGeometry(0.12, 16, 12), 'metal', ANC_GRIS2, PX0 + 0.35, TY1 + 0.14, zc);
  tubo(null, [PX0 + 0.35, TY1 + 0.14, zc], [PX0 + 1.05, TY1 + 0.40, zc], 0.055, 'cromo', null, 14);
  D.cilindro(null, 0.07, 0.04, 0.22, 'cromo', null, PX0 + 1.12, TY1 + 0.43, zc, [0, 0, -Math.PI / 2 + 0.36], 14);
  b(null, 0.30, 0.04, 0.04, 'mate', N, PX0 + 0.50, TY1 + 0.00, zc, 0.01);
  /* valvulas y bajadas de la bomba */
  tubo(null, [TX1 - 0.10, TY0 + 0.10, 0.30], [PX0 + 0.35, PY + 0.25, zc], 0.07, 'metal', ANC_HID, 12);
  /* barra de riego trasera baja con boquillas abanico, y aspersores de las esquinas */
  var xr = XC + 0.10, yr = 0.62;
  tubo(null, [xr, yr, -1.45], [xr, yr, 1.45], 0.065, 'pintura', N, 14);
  [-1, 1].forEach(function(s){ tubo(null, [xr, yr, s * 0.60], [XC - 0.35, P.yTopeRiel - 0.25, s * 0.40], 0.05, 'pintura', N, 10); });
  for(var n = 0; n < 7; n++){
    var zn = -1.20 + n * 0.40;
    D.cilindro(null, 0.035, 0.05, 0.12, 'metal', '#A9AFB6', xr + 0.08, yr - 0.05, zn, [0, 0, -Math.PI / 2 - 0.5], 10);
  }
  [-1, 1].forEach(function(s){
    tubo(null, [xr, yr, s * 1.45], [xr - 0.05, yr + 0.35, s * 1.55], 0.045, 'pintura', N, 10);
    D.cilindro(null, 0.04, 0.06, 0.14, 'metal', '#A9AFB6', xr - 0.05, yr + 0.40, s * 1.60, [s * 0.9, 0, 0], 10);
  });
  /* parachoques trasero con luces */
  b(null, 0.16, 0.26, 2.60, 'pintura', N, XC - 0.10, 1.05, 0, 0.03);
  [-1, 1].forEach(function(s){
    [0, 1, 2].forEach(function(k){ b('LSM', 0.04, 0.13, 0.16, 'vidrio', k === 1 ? '#F2A31A' : '#C2241B', XC - 0.005, 1.05, s * (0.85 + k * 0.20), 0.01); });
  });
  /* guardafangos traseros sobre el tandem */
  [-1, 1].forEach(function(s){
    b(null, C.ejes[1] + 2 * P.rT + 0.25, 0.06, P.aT * 2 + 0.25, 'pintura', N, (P.X1 + P.X2) / 2, 2 * P.rT + 0.14, s * C.trT / 2, 0.02);
  });
}

/* ═══ armado ═══ */
function ancConstruir(clave, piezas){
  var C = ANC_MED[clave];
  var G = new THREE.Group();
  var D = kitDetalle(G, piezas);
  var P = { C: C, D: D, G: G };
  P.XF = -C.largo / 2; P.XC = C.largo / 2;
  P.XD = P.XF + C.vuelo; P.X1 = P.XD + C.ejes[0]; P.X2 = P.X1 + C.ejes[1];
  P.rD = C.llD.r; P.aD = C.llD.a; P.rT = C.llT.r; P.aT = C.llT.a;
  P.zD = C.trD / 2;
  P.zO = C.trT / 2 + P.aT / 2 + C.hueco / 2; P.zI = C.trT / 2 - P.aT / 2 - C.hueco / 2;
  P.texNum = texNumero3d(null, '#16181C');
  ancChasis(P);
  ancRuedas(P);
  if(C.tolva){
    P.piv = new THREE.Vector3(P.XC - 0.78, P.yTopeRiel + 0.16, 0);
    ancTolva(P);
    if(clave === 'TLH135') ancFrenteTLH(P);
    else if(clave === 'DTH145') ancFrenteDTH(P);
    else ancFrenteRTH(P);
    D.colgarTolva(P.piv, clave);
  } else {
    ancCisternaMS(P);
  }
  G.userData.ruedas = D.ruedas;
  G.userData.ponerNumero = function(id){ P.texNum.userData.poner(id); };
  G.userData.mirarY = C.alto * 0.48;
  G.userData.dist = 28;
  return G;
}

registrarModelo3d({
  nombre: 'Anchos 6x4: TONLY TLH135 / DTH145, LGMG RTH100 / MS40',
  clave: function(e){
    var m = mod3d(e);
    if(/^TLH135/.test(m)) return 'TLH135';
    if(/^DTH145/.test(m)) return 'DTH145';
    if(/^RTH100/.test(m)) return 'RTH100';
    if(/^MS40/.test(m)) return 'MS40';
    return null;
  },
  construir: function(e, piezas, clave){ return ancConstruir(clave, piezas); }
});
