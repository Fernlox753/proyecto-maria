# Proyecto Maria

Torre de Control de equipos de **Shougang (SHGN), setiembre 2026**, armada a partir del consolidado
`0 SHGN_RO EQUIPOS` que prepara María en Excel. Recalcula el reporte desde la hoja `BASE DATOS`
con las mismas reglas de las tablas dinámicas del libro y lo presenta como una página navegable.

- **La torre:** `index.html` (en GitHub Pages, la página principal del sitio).
- **La revisión del consolidado 27.09:** `revision.html`, con las incongruencias encontradas en el Excel,
  dónde están y cómo verlas.

## Qué trae la página

- **Propios** y **Alquilados**: las hojas SHGN PROP y SHGN ALQ como tablas desplegables
  (familia › modelo › equipo › fase › orden; modelo, equipo y fase se reordenan arrastrando
  sus botones), con operación, costo real, venta interna, desviación,
  tarifas y acumulado 2026. Tarjetas de resumen con barritas de costo contra venta, botones
  CON/SIN depreciación o alquiler, columnas plegables, semáforo de disponibilidad (DM ≥ 85%),
  filtros por valor en cada columna, **DESPLEGAR / SELECCIONAR** para elegir familias, modelos,
  equipos u órdenes (las tarjetas y los totales se recalculan), comentarios por celda y una barra
  que dice de dónde sale cada cifra.
- **Tablero**: el análisis de una o varias familias, modelos o equipos en siete pasos (resultado,
  horas, tarifa, causa, RyM y MOV, equipos, acumulado).
- **Pantalla dividida** (botón ⊟ o tecla D): dos pestañas a la vez, una arriba y otra abajo.
- **Pantalla completa** con la tecla F y una burbuja de herramientas con calculadora y suma.
- **Teléfono y tableta**: cabecera corta que se aparta al bajar la página, vista horizontal en la
  que la tabla ocupa toda la pantalla y el botón «⤢ SOLO LA TABLA».

Los comentarios por celda se guardan en el navegador de quien los escribe cuando la página se abre
desde GitHub Pages. En la versión publicada como Artifact de Claude se comparten entre quienes la abren.

## Cómo se regenera

Necesita Python 3 y `openpyxl` (`pip install openpyxl`).

```bat
:: 1. copiar el Excel del mes a CONSOLIDADO\  (no se sube al repositorio)
:: 2. recalcular los datos desde el Excel
python TORRE_SETIEMBRE\gen_datos.py
:: 3. armar la página
python TORRE_SETIEMBRE\ensamblar.py
:: 4. armar index.html y revision.html para el sitio
python armar_sitio.py
```

`gen_datos.py` toma el `CONSOLIDADO\0 SHGN_RO EQUIPOS*.xlsx` más reciente, lee las reglas de los
filtros de las dinámicas de SHGN PROP y SHGN ALQ, y se detiene si RyM o MOV dejan de cuadrar al
centavo con esas hojas. `ensamblar.py` toma las piezas de la Torre en `PROCESO\` y les aplica los
cambios de esta versión; al final imprime una lista `OK` / `FALTA` / `SOBRA` que es su verificación.

## Carpetas

| Carpeta | Qué hay |
| --- | --- |
| `TORRE_SETIEMBRE\` | generador de datos, ensamblador y las piezas propias de esta torre (hojas, tablero, burbuja, división, teléfono y tableta) |
| `PROCESO\` | las piezas de la Torre de Control original que se reutilizan (estilos, utilidades, 3D, navegación) |
| `REVISION\` | la revisión de incongruencias del consolidado 27.09 |
| `CONSOLIDADO\` | aquí va el Excel para regenerar; no se sube |

Las cifras son de gestión (resultado operativo de mantenimiento), no reemplazan al cierre contable.
