# Guía para hacer un modelo 3D de detalle de la Torre de Setiembre

La hoja **Equipo** de la Torre muestra cada máquina de la flota en 3D (Three.js r128, sin otras
librerías) y pinta sobre sus piezas el costo de mantenimiento de SAP («mapa de calor»). El objetivo es
que **cada equipo de la flota se vea como su modelo real**: medidas de la hoja del fabricante, la
cabina en su lugar, colores y rótulos de la marca, y el detalle que se ve en las fotos.

**La vara de calidad es `modelo_hd1500.js` (Komatsu HD1500-7).** Léelo entero antes de empezar: así
se hace, con ese nivel de detalle o más.

## Archivos

| Archivo | Para qué | ¿Lo tocas? |
|---|---|---|
| `detalle3d.js` | `kitDetalle`, `registrarModelo3d`, `mod3d`, `texNumero3d`, `entornoEstudio`, `geoCajaB`… | **No** (solo leer) |
| `modelos3d.js` | `kit3d` (base de `kitDetalle`), `texRotulo3d`, `rotuloTexto`, `rotuloCAT`, `texLabrado`, colores `CAT_*`, y los modelos viejos de baja calidad | **No** (solo leer) |
| `modelo_hd1500.js` | la referencia de calidad | **No** |
| `modelo_<tuyo>.js` | tu archivo: el que te asignaron | **Sí, solo este** |
| `prueba3d.py` | banco de pruebas: fotos de un equipo en 6 ángulos | usar |
| `ensamblar.py`, `artifact.html` | arman y son la página publicada | **No** corras `ensamblar.py` a mano ni toques `artifact.html`: hay otros agentes trabajando a la vez. `prueba3d.py` arma su propia copia. |

No publiques nada, no toques GitHub, no edites archivos fuera de tu `modelo_<tuyo>.js` (y tus
archivos temporales en el scratchpad).

## Todos los archivos comparten un solo ámbito

Todo el JavaScript de la página vive dentro de un único `(function(){ ... })()`. Una función o
variable de nivel superior con el mismo nombre que otra **pisa a la otra sin avisar**. Por eso:

- **Todo** lo que declares en el nivel superior de tu archivo empieza con **tu prefijo** (te lo dan en
  la tarea): `function rigConstruir785(...)`, `var RIG_MEDIDAS = {...}`. Nada sin prefijo.
- Estilo ES5 como el resto: `var`, `function`, sin `=>`, sin `let/const`, sin clases. Comentarios
  en español, sin tildes en el código no hace falta pero sí se usan en comentarios; explican el porqué.

## Cómo se registra un modelo

Al final de tu archivo:

```js
registrarModelo3d({
  nombre: 'CAT 785C y 785D',
  /* la clave dice si el equipo e es de este modelo y con qué variante; null si no */
  clave: function(e){
    var m = mod3d(e);                       /* 'TLH 135' -> 'TLH135', sin espacios ni guiones */
    return /^785C/.test(m) ? '785C' : /^785D/.test(m) ? '785D' : null;
  },
  construir: function(e, piezas, clave){ return rigConstruir(clave, piezas); }
});
```

- `e` trae `id, fam, clasif, mod, marca, tipo, prov, sys, ots`. Para camiones con cuerpos distintos
  (cisterna de agua, de combustible, ANFO, volquete…) la clave incluye la variante, p. ej.
  `'ACTROS3344K|CISTERNA DE AGUA'`: dos equipos con la misma clave comparten el 3D sin reconstruirlo.
- Las claves de distintos archivos no deben chocar: empiézalas con tu prefijo si hay duda.
- Tu registro manda sobre el modelo viejo de `modelos3d.js` (si existía).

## Convenciones del modelo

- Metros. **Frente hacia −X, arriba +Y, la izquierda del operador +Z.** El suelo es y = 0: las ruedas
  y orugas apoyan en 0, nada queda por debajo. El grupo se centra más o menos en X y Z (el estudio
  gira alrededor del origen).
- `G.userData.mirarY` (altura a la que mira la cámara, ~mitad de la altura) y `G.userData.dist`
  (distancia de cámara para que entre entero; un camión de 11 m usa ~30).
- Ruedas con `D.ruedaDet` y al final `G.userData.ruedas = D.ruedas`.
- Tolva o caja basculante: marcar sus piezas con `esTolva()` o código `'TLV'` y llamar a
  `D.colgarTolva(pivote, nombre)` como en el HD1500.
- Número de unidad pintado (los camiones mineros lo llevan): `texNumero3d(fondo, tinta)` y
  `G.userData.ponerNumero = function(id){ tex.userData.poner(id); }`.
- Rótulos y logos: solo lienzos dibujados (`texRotulo3d`, `rotuloTexto`, o tu propia función de
  dibujo). **Nada de imágenes, modelos ni texturas bajados de internet.**
- Presupuesto: entre ~300 y ~1500 mallas por máquina. Lo repetido y chico (pernos, tejas de oruga,
  tacos, lamas, peldaños) con `THREE.InstancedMesh`. Que construir no tarde más de ~1 s.

## Los códigos de sistema de SAP

Cada pieza que corresponde a un sistema lleva su código (primer argumento de `bloque`, `tubo`,
`cilindro`, `pon`…): el mapa de calor la pinta según su costo y al pasar el mouse dice el sistema
y su costo. Para ver qué códigos tienen tus equipos y cuánto cuestan:

```bash
cd TORRE_SETIEMBRE
PYTHONIOENCODING=utf-8 python -c "
import json,collections,sys
d=json.load(open('datos.json',encoding='utf-8')); sd=d['sysdesc']
mods=sys.argv[1:]
for m in mods:
  eqs=[e for e in d['equipos'] if e['mod']==m]
  c=collections.Counter()
  for e in eqs:
    for s in e['sys']: c[s['c']]+=s['v']
  print(m, len(eqs), 'equipos:', [e['id'] for e in eqs][:8], {e['clasif'] for e in eqs}, {e['marca'] for e in eqs})
  print('   ', ', '.join('%s=%s(%d)'%(k,(sd.get(k) or '?')[:24],v) for k,v in c.most_common(60)))
" "785C" "785D"
```

(En `datos.json` el campo `mod` va tal cual: `'TLH 135'`, `'R 9100 G8'`, `'DR412i'`…)

Pon cada código en la pieza física que corresponde (motor `ENG1`, cabina `CBN`, radiador `RAD1`,
tolva `TLV`, llantas `LL1…LLn`, orugas, lampón `LPN`, elementos de desgaste `GET`…). Las llantas siguen
la numeración de SAP: 1 delantera izquierda, 2 delantera derecha, luego las traseras de izquierda a
derecha (exterior, interior…), eje por eje. Un código que no sabes dónde va, no lo inventes: déjalo
fuera. Las piezas sin código llevan `null`.

## Calidad que se espera

1. **Medidas reales** de la hoja de especificaciones del fabricante (largo, ancho, alto, batalla o
   largo de orugas, trocha, llantas o tejas, altura de cabina, pluma/brazo/cucharón, etc.). Busca con
   WebSearch/WebFetch; los PDF se bajan con `curl -sL -A "Mozilla/5.0 ..."` y se leen con PyMuPDF
   (`import fitz`; `page.get_text()`, `page.get_pixmap(dpi=120).save(...)`). Lo que no está acotado,
   mídelo sobre el dibujo y dilo en el comentario.
2. **Fotos de referencia**: mira 2–4 fotos (guárdalas en tu scratchpad, ábrelas con Read) y copia lo
   que se ve: dónde va la cabina y hacia dónde mira, escaleras, pasarelas y barandas, rejillas, faros,
   escapes, tanques, cilindros, colores (qué es del color de la marca, qué es negro o gris) y rótulos
   (marca y modelo donde los pinta el fabricante).
3. **Detalle del HD1500 o más**: `D.bloque` de cantos redondeados en vez de cajas, pintura con laca
   (`'pintura'`), cromo en vástagos, vidrios con marco, barandas con rodapié, escaleras con peldaños,
   faros con aro, rejillas de lamas, mangueras, pernos. Nada de piezas flotando ni metidas unas en
   otras de forma visible.
4. **Colores de la marca** fieles (prueba con `--base` para verlos sin el mapa de calor).

## Cómo probar

```bash
cd TORRE_SETIEMBRE
python prueba3d.py FC-87 --solo modelo_<tuyo>.js --base --salida "<tu scratchpad>/pruebas"
python prueba3d.py FC-87 --solo modelo_<tuyo>.js --base --cerca --salida "<tu scratchpad>/pruebas"
```

Saca una imagen con 6 ángulos (3/4 delantero, frente, costados, atrás). Arriba dice el modelo usado,
cuántas mallas y piezas SAP tiene y **en rojo los errores** (incluido «SIN MODELO REGISTRADO» si tu
clave no reconoce el equipo). Ábrela con Read, compárala con las fotos y corrige hasta que esté bien
desde todos los ángulos. Prueba **un equipo de cada modelo y variante** que te tocó. Tarda ~15–30 s.

Antes de terminar: `node -e "new Function(require('fs').readFileSync('modelo_<tuyo>.js','utf8'))"`
para la sintaxis, y una última pasada de `prueba3d.py` de todos tus equipos sin `--solo` restringido
a otro archivo (con `--solo modelo_<tuyo>.js,modelo_hd1500.js` basta).

## Qué entregar

Tu `modelo_<tuyo>.js` terminado y un informe corto: modelos cubiertos con su clave y un equipo de
prueba de cada uno, fuentes (URL) de las medidas, supuestos (lo que no se encontró), y las rutas de
las imágenes finales de prueba.
