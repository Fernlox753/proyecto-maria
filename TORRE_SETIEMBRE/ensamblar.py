# -*- coding: utf-8 -*-
"""Arma artifact.html de la Torre de Setiembre.

No hay un segundo frontend: se toman las piezas de la Torre original, en
..\\PROCESO, y se les aplica la lista de cambios de abajo. Asi esta copia
sigue a la original cuando aquella mejora, y lo que las separa esta escrito
en un solo sitio.

  ..\\PROCESO\\piezas\\      cabecera, CSS, utilidades, contadores y el 3D
  ..\\PROCESO\\nuevo_*       el HTML de las vistas y el JS
  extra.js                  funciones que se vuelven a declarar para esta copia
  hojas.html, hojas.js      las hojas Propios y Alquilados, que sustituyen a Flota
  tablero.html, tablero.js  la hoja Tablero: el analisis de una flota o un modelo
  burbuja.html, burbuja.js  la burbuja de herramientas (calculadora rapida, suma)
  division.html, .js        la pantalla dividida en dos pestanas
  equipo.html, equipo.js    hoja Equipo: todos los equipos en el selector y un buscador
  detalle3d.js              herramientas de los modelos de detalle (pintura, llantas, faros...)
  modelo_*.js               los modelos 3D de detalle, uno o varios por archivo (registrarModelo3d)
  modelos3d.js              el camion 3D de cada modelo (CAT 785C y 785D); el resto usa el generico
  tendencia.html            Tendencia compacta: cifras, filtros y controles del grafico en filas
  movil.html, movil.js      telefono y tableta: cabecera corta, vista girada, «solo la tabla»
  datos.json                la tabla de hechos de setiembre (gen_datos.py)
  setiembre.json            tarifa real contra venta, DM y usaje (gen_datos.py)

Cada cambio tiene que encontrar su texto. Si la Torre original cambio y uno
ya no aparece, el ensamblado se detiene y dice cual: hay que revisarlo aqui.

    python gen_datos.py
    python ensamblar.py      # escribe artifact.html en esta carpeta
"""
import io, json, os, re, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
ORIG = os.path.join(os.path.dirname(AQUI), "PROCESO")
# TORRE_SALIDA cambia el archivo de salida (lo usa prueba3d.py para no pisar artifact.html)
SALIDA = os.environ.get("TORRE_SALIDA") or os.path.join(AQUI, "artifact.html")


def lee(base, *partes):
    return io.open(os.path.join(base, *partes), encoding="utf-8").read()


def cambia(t, viejo, nuevo, donde, todas=False):
    if viejo not in t:
        sys.exit("NO ENCONTRADO en %s:\n  %s" % (donde, viejo[:160]))
    return t.replace(viejo, nuevo) if todas else t.replace(viejo, nuevo, 1)


def entre(t, ini, fin, nuevo, donde):
    """Sustituye desde `ini` hasta `fin` inclusive. Para parrafos enteros,
    donde copiar el texto viejo letra por letra seria fragil."""
    a = t.find(ini)
    if a < 0: sys.exit("NO ENCONTRADO en %s (inicio):\n  %s" % (donde, ini[:160]))
    b = t.find(fin, a + len(ini))
    if b < 0: sys.exit("NO ENCONTRADO en %s (final de «%s»):\n  %s" % (donde, ini[:60], fin[:160]))
    return t[:a] + nuevo + t[b + len(fin):]


datos = lee(AQUI, "datos.json")
sep = lee(AQUI, "setiembre.json")
META = json.loads(datos)["meta"]
N_EQ = "{:,}".format(META["nEq"])
CORTE = META["val"]["corte"]
# los meses del libro mayor que entran al acumulado, dichos en palabras
_MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "setiembre",
          "octubre", "noviembre", "diciembre"]
_per = json.loads(sep).get("acumPeriodos") or []
PERIODOS = ("%s a %s" % (_MESES[_per[0] - 1], _MESES[_per[-1] - 1])) if len(_per) > 1 else \
           (_MESES[_per[0] - 1] if _per else "ningún mes")
# las reglas que gen_datos.py leyo de las dinamicas, dichas en palabras
VAL = META["val"]
def _fecha(iso):
    return "%d de %s" % (int(iso[8:10]), _MESES[int(iso[5:7]) - 1]) if iso else "—"
def _lista(xs):
    xs = ["sin marcar" if x == "(vacío)" else x for x in xs]
    return (", ".join(xs[:-1]) + " y " + xs[-1]) if len(xs) > 1 else (xs[0] if xs else "—")
BASE_HASTA = _fecha(VAL.get("fechaMaxBase"))
_rv, _rf = VAL.get("reglas", {}), VAL.get("reglasFuera", {})
REG_PROP = _lista(_rv.get("PROPIO", {}).get("CONSIDERAR", []))
FUERA_PROP = _lista(_rf.get("PROPIO", {}).get("CONSIDERAR", []))
FUERA_ALQ = _lista(_rf.get("ALQUILADO", {}).get("CONSIDERAR", [])) if _rf.get("ALQUILADO", {}).get("CONSIDERAR") else ""
ALQ_TXT = ("todo menos lo marcado %s" % FUERA_ALQ) if FUERA_ALQ else "todo"
RM_TXT = ("sin la fase de reparación mayor" if "RM" in _rf.get("PROPIO", {}).get("Fase", [])
          else "incluida la reparación mayor")
HORAS_DE = VAL.get("fuenteHoras") or "SAP"
POR_DIAS_DEP = " y ".join(VAL.get("depPorDias") or []) or "ninguno"
POR_DIAS_ALQ = ", ".join(VAL.get("alqPorDias") or []) or "ninguno"

cabecera = lee(ORIG, "piezas", "cabecera.html")
css = lee(ORIG, "piezas", "css.html")
util = lee(ORIG, "piezas", "util.js")
cont = lee(ORIG, "piezas", "contadores.js")
tres_d = lee(ORIG, "piezas", "tres_d.js")
cuerpo = lee(ORIG, "nuevo_cuerpo.html")
js_datos = lee(ORIG, "nuevo_js_datos.js")
js_tend = lee(ORIG, "nuevo_js_tendencia.js")
js_filt = lee(ORIG, "nuevo_js_filtros.js")
js_sep = lee(ORIG, "nuevo_js_setiembre.js")
js_nav = lee(ORIG, "nuevo_js_nav.js")
extra = lee(AQUI, "extra.js")
hojas_html = lee(AQUI, "hojas.html")
hojas_js = lee(AQUI, "hojas.js")
tablero_html = lee(AQUI, "tablero.html")
tablero_js = lee(AQUI, "tablero.js")
burbuja_html = lee(AQUI, "burbuja.html")
burbuja_js = lee(AQUI, "burbuja.js")
division_html = lee(AQUI, "division.html")
division_js = lee(AQUI, "division.js")
modelos3d_js = lee(AQUI, "modelos3d.js")
detalle3d_js = lee(AQUI, "detalle3d.js")
# los modelos 3D de detalle: todos los modelo_*.js de esta carpeta, en orden de
# nombre. TORRE_MODELOS (lista separada por comas) deja solo esos, para probar
# uno sin que otro a medio hacer rompa la pagina.
_solo = [x.strip() for x in (os.environ.get("TORRE_MODELOS") or "").split(",") if x.strip()]
MODELOS_JS = sorted(f for f in os.listdir(AQUI) if f.startswith("modelo_") and f.endswith(".js")
                    and (not _solo or f in _solo))
modelos_det_js = "\n".join("/* ---- %s ---- */\n" % f + lee(AQUI, f) for f in MODELOS_JS)
equipo_html = lee(AQUI, "equipo.html")
equipo_js = lee(AQUI, "equipo.js")
tendencia_html = lee(AQUI, "tendencia.html")
movil_html = lee(AQUI, "movil.html")
movil_js = lee(AQUI, "movil.js")

# ══════════════════════════════════════════════════════════════════════
#  cabecera
# ══════════════════════════════════════════════════════════════════════
cabecera = cambia(cabecera, "<title>Torre de Control de Flota</title>",
                  "<title>Torre de Control Setiembre</title>", "cabecera")

# ══════════════════════════════════════════════════════════════════════
#  cuerpo: los textos que hablaban del libro mayor y de meses
# ══════════════════════════════════════════════════════════════════════
C = "cuerpo"
cuerpo = cambia(cuerpo, "Torre de Control<i>San Martín en general</i>",
                "Torre de Control<i>Shougang · setiembre 2026</i>", C)

# ---- las pestanas: con la letra de sala son doce y no caben; menos aire entre ellas
cuerpo = cambia(cuerpo, "font-size:10.5px; letter-spacing:.16em; padding:10px 16px 11px;",
                "font-size:10.5px; letter-spacing:.06em; padding:10px 9px 11px;", C)

# ---- Inicio
cuerpo = cambia(cuerpo, "Toda la flota de <em>San Martín</em>, medida hora por hora.",
                "La flota de <em>Shougang</em> en setiembre, día por día.", C)
cuerpo = entre(cuerpo, '<p class="filtroProyPie" id="filtroProyPie">', "</p>",
    '<p class="filtroProyPie" id="filtroProyPie">ALCANCE = FILTROS DE LAS DINÁMICAS SHGN PROP Y SHGN ALQ (CONSIDERAR) · TIPO DE COSTO = '
    'RECURSO (MAT · SERV · MO) MÁS DEPRECIACIÓN · PROPIO/ALQUILADO = CÓDIGO TERMINADO EN «AL» · '
    'UNA SOLA SELECCIÓN PARA TODAS LAS PESTAÑAS</p>', C)
cuerpo = cambia(cuerpo, "horas máquina del periodo, contadas una vez por equipo y mes",
                "horas máquina del periodo, del horómetro de SAP", C)
cuerpo = cambia(cuerpo, "se elige en Flota, Tendencia o Filtros, o haciendo clic en un mes</div>",
                "se elige en Tendencia o Filtros, o haciendo clic en un día</div>", C)
cuerpo = cambia(cuerpo, "COSTO MENSUAL · CLIC EN UN MES PARA VERLO", "COSTO DIARIO · CLIC EN UN DÍA PARA VERLO", C)
cuerpo = entre(cuerpo, '<p class="nota" style="margin-top:16px; max-width:78ch"><b>Ojo con agosto 2026.</b>', "</p>",
    '<p class="nota" style="margin-top:16px; max-width:78ch"><b>Esto no es el libro mayor.</b> '
    'Es el resultado operativo de Shougang: mantenimiento —materiales, servicios y mano de obra, orden por '
    'orden— más la depreciación de la flota propia. No trae alquiler real ni combustible, así que el costo '
    'por hora no es comparable con el de la Torre general. La base tiene movimientos hasta el %s; '
    'el reporte se corta al día %d y esta torre también.</p>' % (BASE_HASTA, CORTE), C)

# ---- Flota
cuerpo = cambia(cuerpo, "PERIODO — ELIGE UN RANGO DE MESES O UN ATAJO",
                "PERIODO — ELIGE UN RANGO DE DÍAS O UN ATAJO", C, todas=True)
# La hoja Flota sale entera: en su sitio van Propios y Alquilados, que son
# las dos hojas del consolidado en tabla. El periodo y los filtros de flota
# siguen estando en Tendencia y en Filtros.
cuerpo = entre(cuerpo, "<!-- ═══════════════════ FLOTA ═══════════════════ -->", "</section>",
               (hojas_html + "\n" + tablero_html + "\n" + burbuja_html + "\n" + division_html
                + "\n" + tendencia_html + "\n" + movil_html).replace("__CORTE__", str(CORTE)).replace("__PERIODOS__", PERIODOS), C)

# ---- Tendencia
cuerpo = entre(cuerpo, '<p class="lede">La misma selección de la pestaña Flota, dibujada en el tiempo.', "</p></details>",
    '<p class="lede">La selección activa, dibujada día por día. El eje horizontal se '
    'ajusta al periodo elegido y se puede ver <b>día a día</b> o en <b>un solo punto</b>. Arrastra sobre el '
    'gráfico para acotar, o haz clic en un punto para aislarlo: el recorte queda puesto en toda la torre. '
    'Son pocos días, así que un salto de un día a otro dice poco: basta una salida de almacén cara para '
    'moverlo. Puedes fijar un <b>objetivo</b> —de tarifa, de costo o de horas— y se dibuja como línea a '
    'trazos contra la que medir cada punto.</p></details>', C)
cuerpo = cambia(cuerpo, 'id="t3-var-l">DEL PRIMER AL ÚLTIMO MES', 'id="t3-var-l">DEL PRIMER AL ÚLTIMO DÍA', C)
cuerpo = cambia(cuerpo, 'aria-label="Evolución mensual"', 'aria-label="Evolución diaria"', C)
cuerpo = cambia(cuerpo, ">Mes a mes</h3>", ">Día a día</h3>", C)
cuerpo = cambia(cuerpo, '<span class="gcT">LÍNEAS A LA VEZ</span>',
                '<span class="gcT" title="Cuántas líneas se dibujan a la vez">LÍNEAS</span>', C)
cuerpo = cambia(cuerpo, "CLIC EN UN MES PARA AISLARLO · LOS MESES FUERA DEL PERIODO VAN ATENUADOS",
                "CLIC EN UN DÍA PARA AISLARLO · LOS DÍAS FUERA DEL PERIODO VAN ATENUADOS", C)
cuerpo = cambia(cuerpo, "<th>Mes</th>", "<th>Día</th>", C)

# ---- Equipo
cuerpo = entre(cuerpo, '<p class="lede">Las cifras de arriba salen del libro mayor', "</p></details>",
    '<p class="lede">Las cifras de arriba salen de las transacciones de SAP del mes: horas hombre, salidas '
    'de almacén y conformidades de servicio, más la depreciación si el equipo es propio. Gira el modelo, '
    'toca una pieza y al costado aparecen sus órdenes; más abajo está la lista completa. <b>El conjunto '
    'sale de la orden de trabajo</b>: cada orden lleva el suyo en SAP, y su costo es la suma de lo que se '
    'le cargó hasta el día %d.</p></details>' % CORTE, C)
cuerpo = cambia(cuerpo, "Tarifa proyectada, disponibilidad y usaje", "Tarifa de venta, disponibilidad y usaje", C)

# ---- Órdenes
cuerpo = entre(cuerpo, '<p class="lede"><b>Esta vista viene del detalle de mantenimiento de SHGN</b>', "</p></details>",
    '<p class="lede">Son las órdenes de trabajo reales de SAP que recibieron algún cargo hasta el día %d, '
    'con su clase, su conjunto y su costo. El costo de cada orden es la suma de la mano de obra, los '
    'materiales y los servicios cargados a ella; la depreciación no pasa por órdenes. La lista sigue al '
    '<b>alcance</b> elegido en Inicio.</p></details>' % CORTE, C)
cuerpo = cambia(cuerpo, "Se cambia en <b>Flota</b>, <b>Tendencia</b> o <b>Filtros</b>.",
                "Se cambia en <b>Tendencia</b> o <b>Filtros</b>.", C)
cuerpo = entre(cuerpo, '<p class="nota" style="margin-top:16px">Se listan las órdenes de mayor costo', "</p>",
    '<p class="nota" style="margin-top:16px">Se listan las 160 órdenes de mayor costo, de un total de '
    '<b id="o-tot">0</b> en el periodo y el alcance elegidos.</p>', C)

# ---- Cortes
cuerpo = entre(cuerpo, '<p class="lede">El costo del periodo visto por quién lo factura', "</p></details>",
    '<p class="lede">El costo del periodo visto por el dueño del equipo, el modelo, el recurso o la '
    'categoría, la clase de orden y el alcance. Son lecturas de la misma cifra: cada bloque suma el total '
    'del periodo.</p></details>', C)
cuerpo = cambia(cuerpo, 'Proyecto: <b id="a-proy">', 'Selección: <b id="a-proy">', C)
cuerpo = cambia(cuerpo, "El proyecto se cambia en <b>Inicio</b> y el periodo en <b>Flota</b>, <b>Tendencia</b> o <b>Filtros</b>.",
                "El alcance se cambia en <b>Inicio</b> y el periodo en <b>Tendencia</b> o <b>Filtros</b>.", C)
cuerpo = cambia(cuerpo, ">Por cuenta contable</h3>", ">Por recurso o categoría</h3>", C)
cuerpo = cambia(cuerpo, ">Por naturaleza del gasto</h3>", ">Por clase de orden</h3>", C)
cuerpo = cambia(cuerpo, ">Por proyecto</h3>", ">Por alcance</h3>", C)
cuerpo = entre(cuerpo, '<p class="nota" style="margin-top:16px">Shougang concentra el grueso', "</p>",
    '<p class="nota" style="margin-top:16px">El resultado operativo es lo que entra al reporte. Lo demás '
    '(CAPEX, pasar a venta, parte de la tarifa) es lo que las tablas dinámicas del consolidado dejan fuera '
    'por la columna CONSIDERAR; aparece al elegir «TODO LO CARGADO» en Inicio.</p>', C)

# ---- Ficha: toda la columna de texto
cuerpo = entre(cuerpo, '<p class="lede"><b>Una sola fuente para el dinero.</b>',
               'Ninguna cifra de esta pantalla reemplaza al cierre contable.</p>',
    '<p class="lede"><b>Una sola fuente.</b> Todo sale del consolidado <b id="fi-libro">0 SHGN_RO EQUIPOS</b>, el '
    'resultado operativo de equipos de Shougang del mes en curso. El costo viene de la hoja '
    '<b id="fi-hoja">—</b>: <b id="fi-lin">0</b> transacciones de SAP entre <b id="fi-rango">—</b>, que '
    'suman <b id="fi-total">—</b>. De eso, <b id="fi-ro">—</b> es resultado operativo; el resto es lo que '
    'las hojas dejan fuera (CAPEX, pasar a venta, parte de la tarifa). Leído el <b id="fi-gen">—</b>.</p>'

    '<p class="lede" style="margin-top:18px"><b>Cómo se valoriza, igual que en el Excel.</b> Mano de obra: '
    'horas aplicadas × US$ 35. Materiales: cantidad × precio unitario ÷ 3.4. Servicios: el importe si está '
    'en dólares y, si no, ÷ 3.4. El tipo de cambio y la tarifa de hora-hombre son constantes escritas en '
    'el libro, no salen de SAP.</p>'

    '<p class="lede" style="margin-top:18px"><b>Recalculado, no copiado.</b> Las cifras no se toman de las '
    'hojas SHGN PROP y SHGN ALQ: se vuelven a sumar desde la base con sus mismas reglas, que se leen de '
    'los filtros de sus propias tablas dinámicas. Las dos cuadran <b id="fi-cuadre">—</b> en RyM, mano de '
    'obra, depreciación o alquiler, horas y número de equipos: RyM + MOV de <b id="fi-propHoja">—</b> en '
    'la flota propia y de <b id="fi-alqHoja">—</b> en la alquilada. El <b>acumulado</b> sigue una sola '
    'regla —libro mayor más el mes— y por eso algunas de sus columnas no coinciden con el Excel.</p>'

    '<p class="lede" style="margin-top:18px"><b>Qué entra al resultado operativo.</b> De la flota propia, '
    'lo que la columna CONSIDERAR marca %s, %s; queda fuera %s. De la alquilada, %s. Y sólo hasta el día '
    '%d: la base trae además <b id="fi-fuera">—</b> de los días siguientes, que quedan fuera.</p>'

    '<p class="lede" style="margin-top:18px"><b>Horas, depreciación y alquiler.</b> Las horas máquina son '
    'las del horómetro de SAP (%s), <b id="fi-hm">—</b> en el periodo. La depreciación de cada equipo '
    'propio es su tarifa de la proforma por sus horas reales; %s van por días. <b>El alquiler no es un '
    'costo real</b>: el Excel lo calcula con la tarifa de <i>venta</i> de alquiler por las horas (%s, de '
    'tarifa mensual, por días). Por eso aquí va aparte, marcado, y no se suma al costo salvo con el '
    'botón CON ALQ.</p>'

    '<p class="lede" style="margin-top:18px"><b>Lo que ni el Excel ni la torre cuentan.</b> '
    '<b id="fi-parte">—</b> de servicios marcados «Parte de la Tarifa», que ninguna de las dos hojas '
    'toma; aquí viajan en su propio alcance. Y <b id="fi-zserv">—</b> en <b id="fi-zservN">0</b> '
    'conformidades de la descarga Z SERV que no llegaron a la base: no están en ningún total.</p>'

    '<p class="lede" style="margin-top:18px"><b>Huecos conocidos.</b> De los equipos del resultado '
    'operativo, <b id="fi-sinTarifa">0</b> no tienen tarifa de venta, <b id="fi-sinHoras">0</b> no tienen '
    'horas en el parte y <b id="fi-sinDM">0</b> no tienen disponibilidad ni usaje. El costo por conjunto '
    'existe para <b id="fi-det">0</b> de los <b id="fi-nEq">0</b> equipos de la base: los demás no tuvieron '
    'órdenes con conjunto. La flota (acarreo, carguío, perforación…) no viene en el libro: se deduce de la '
    'descripción del equipo.</p>'

    '<p class="lede" style="margin-top:18px"><b>Qué es simulación.</b> El flujo de movimientos de '
    'la pestaña <b>En vivo</b> y el desplazamiento de los camiones por el tajo son una recreación '
    'para la demostración. Ninguna cifra de esta pantalla reemplaza al cierre contable.</p>'
    % (REG_PROP, RM_TXT, FUERA_PROP, ALQ_TXT, CORTE, HORAS_DE, POR_DIAS_DEP, POR_DIAS_ALQ), C)

# ---- Tarifa (la antigua pestaña Setiembre)
cuerpo = cambia(cuerpo, 'id="v-setiembre" data-pes="Setiembre"', 'id="v-setiembre" data-pes="Tarifa"', C)

# ---- Ordenes, Cortes, Ficha y Tarifa salen de la barra de pestanas. Las
#      secciones quedan en la pagina, ocultas y sin la clase «vista» (asi no
#      generan pestana ni se pueden abrir): el JS que las pinta sigue igual y
#      no hay que tocar sus funciones.
for _id, _pes in [("v-ordenes", "Órdenes"), ("v-articulos", "Cortes"), ("v-ficha", "Ficha"), ("v-setiembre", "Tarifa")]:
    cuerpo = cambia(cuerpo, '<section class="vista luz" id="%s" data-pes="%s">' % (_id, _pes),
                    '<section class="pesQuitada" id="%s" hidden>' % _id, C)
cuerpo = entre(cuerpo, '<p class="lede">Ésta es la única pestaña que no sale del libro mayor.', "</p></details>",
    '<p class="lede">El costo real por hora contra la <b>tarifa de venta</b> interna, más la '
    '<b>disponibilidad mecánica</b> y el <b>usaje</b>. Las tres salen de las tablas de apoyo del '
    'consolidado, en la hoja BASE VARIOS.</p></details>', C)
cuerpo = entre(cuerpo, "<p><b>De dónde sale y qué no es.</b>", "</p>",
    '<p><b>De dónde sale.</b> El costo es el mismo de las demás pestañas: resultado operativo, cortado al '
    '<b>día %d</b>. La venta interna es la tarifa de venta de cada equipo por sus horas reales. La tabla '
    'va por <b>modelo</b>; el dato de cada equipo está en la pestaña Equipo. Esta hoja no sigue al '
    'periodo ni a los filtros de las demás.</p>' % CORTE, C)
cuerpo = entre(cuerpo, "<p><b>El tercer componente no es el mismo en las dos flotas.</b>", "</p>",
    '<p><b>Las dos flotas no se miden igual.</b> En la propia, costo y tarifa de venta son RyM + mano de '
    'obra + <b>depreciación</b>. En la alquilada son sólo RyM + mano de obra: el alquiler queda fuera de '
    'los dos lados, como en el Excel, que además lo calcula con la tarifa de venta.</p>', C)
cuerpo = cambia(cuerpo, '<th class="r">Tarifa real</th><th class="r">Proyectada</th>',
                '<th class="r">Tarifa real</th><th class="r">De venta</th>', C)

# ---- Filtros
cuerpo = entre(cuerpo, '<p class="lede">Los filtros de uso diario están donde se usan', "</p></details>",
    '<p class="lede">Los filtros de uso diario están donde se usan: alcance y tipo de costo en '
    '<b>Inicio</b>, periodo y flota en <b>Tendencia</b>. Aquí quedan los demás —fase de '
    'mantenimiento, recurso o categoría, clase de orden, marca, clasificación y propio contra alquilado—. '
    'Todo lo que se marque aquí vale en todas las pestañas y se anuncia en el inicio.</p></details>', C)
cuerpo = cambia(cuerpo, "CELDAS DEL LIBRO", "CELDAS DE LA BASE", C)
cuerpo = cambia(cuerpo, ">Dimensiones del asiento contable</h3>", ">Dimensiones de la transacción</h3>", C)
cuerpo = cambia(cuerpo, "COLUMNAS DEL LIBRO · SELECCIÓN MÚLTIPLE · EL IMPORTE AL COSTADO ES EL TOTAL DE LOS 17 MESES",
                "COLUMNAS DE LA BASE · SELECCIÓN MÚLTIPLE · EL IMPORTE AL COSTADO ES TODO LO CARGADO HASTA EL DÍA %d" % CORTE, C)
cuerpo = cambia(cuerpo, "CENTRO DE COSTE (COLUMNA AB)", "FASE DE MANTENIMIENTO", C)
cuerpo = cambia(cuerpo, "CUENTA CONTABLE (COLUMNA F)", "RECURSO O CATEGORÍA", C)
cuerpo = cambia(cuerpo, "NATURALEZA DEL GASTO (COLUMNA B)", "CLASE DE ORDEN (DE BASE OTS)", C)
cuerpo = cambia(cuerpo, "RESULTADO OPERATIVO · RO (COLUMNA C)", "TIPO DE COSTO", C)
cuerpo = entre(cuerpo, '<p class="avisoDoble">', "</p>",
    '<p class="avisoDoble"><b>«Recurso o categoría» mezcla tres cosas, igual que la base.</b> En mano de '
    'obra es el tipo de técnico (TEC-ALQ, MECANI-A…); en materiales, la categoría del artículo; y los '
    'servicios van juntos como SERVICIO DE TERCEROS.</p>', C)
cuerpo = cambia(cuerpo, ">POR RESULTADO OPERATIVO</h4>", ">POR TIPO DE COSTO</h4>", C)
cuerpo = cambia(cuerpo, ">POR CENTRO DE COSTE</h4>", ">POR FASE DE MANTENIMIENTO</h4>", C)
cuerpo = cambia(cuerpo, ">POR PROYECTO</h4>", ">POR ALCANCE</h4>", C)
cuerpo = cambia(cuerpo, ">POR CUENTA CONTABLE</h4>", ">POR RECURSO O CATEGORÍA</h4>", C)
cuerpo = cambia(cuerpo, ">POR NATURALEZA DEL GASTO</h4>", ">POR CLASE DE ORDEN</h4>", C)
cuerpo = entre(cuerpo, '<p class="nota" style="margin-top:clamp(30px,4vh,44px); max-width:82ch">', "</p>",
    '<p class="nota" style="margin-top:clamp(30px,4vh,44px); max-width:82ch">'
    '<b>Para qué sirve.</b> Con el alcance en RESULTADO OPERATIVO la torre usa el mismo recorte que las '
    'hojas SHGN PROP y SHGN ALQ: flota propia %s (%s), flota alquilada %s, '
    'todo hasta el día %d. Los ajustes de arriba llevan a los otros recortes sin marcar casillas a '
    'mano.</p>' % (REG_PROP, RM_TXT, ALQ_TXT, CORTE), C)

# Al quitar una hoja y meter dos, el numero de cada seccion ya no coincide con
# el de su pestana: se vuelven a numerar en el orden en que quedaron.
_n = [0]
def _renum(m):
    _n[0] += 1
    return '<div class="ord"><span class="num">%02d</span>' % _n[0]
cuerpo = re.sub(r'<div class="ord"><span class="num">\d\d</span>', _renum, cuerpo)

# ══════════════════════════════════════════════════════════════════════
#  JS: constantes y rotulos. Las funciones que cambian enteras van en extra.js
# ══════════════════════════════════════════════════════════════════════
D = "nuevo_js_datos.js"
# se abre en lo que entra al reporte, no en todo lo cargado
js_datos = cambia(js_datos, "var proyFiltro = 'TODOS';", "var proyFiltro = PROYS[0];", D)
js_datos = cambia(js_datos, "return proyFiltro === 'TODOS' ? 'TODOS LOS PROYECTOS' : proyFiltro;",
                  "return proyFiltro === 'TODOS' ? 'TODO LO CARGADO' : proyFiltro;", D)
js_datos = cambia(js_datos, "esc(it.n === 'TODOS' ? 'TODOS LOS PROYECTOS' : it.n)",
                  "esc(it.n === 'TODOS' ? 'TODO LO CARGADO' : it.n)", D)
js_datos = cambia(js_datos, "var items = [{ n: 'TODOS', r: 'TODA LA FLOTA', v: META.total }]",
                  "var items = [{ n: 'TODOS', r: 'TODA LA FLOTA', v: ((META.porProy || {})[PROYS[0]] || {}).v || 0 }]", D)
js_datos = cambia(js_datos, "? 'costo total de equipos del periodo, en dólares'",
                  "? 'mantenimiento y depreciación del periodo, en dólares'", D)
js_datos = entre(js_datos, "+ '<button class=\"fbt\" data-r=\"12\">ÚLTIMOS 12 MESES</button>'",
                 "return '<button class=\"fbt\" data-r=\"' + a + '\">' + a + '</button>'; }).join('');",
                 "+ '<button class=\"fbt\" data-r=\"3\">ÚLTIMOS 3 DÍAS</button>';", D)

T = "nuevo_js_tendencia.js"
js_tend = cambia(js_tend, "  { c: 'mes',  n: 'MENSUAL' },\n  { c: 'ano',  n: 'POR AÑO' },",
                 "  { c: 'mes',  n: 'DÍA A DÍA' },", T)
js_tend = cambia(js_tend, "return 'HORAS POR MES';", "return 'HORAS POR DÍA';", T)
js_tend = cambia(js_tend, "return 'US$ POR MES · SE ACUMULA';", "return 'US$ POR DÍA · SE ACUMULA';", T)
js_tend = cambia(js_tend, "return 'US$ POR MES';", "return 'US$ POR DÍA';", T)
js_tend = cambia(js_tend, "(gMetrica === 'cph' ? '' : '/MES')", "(gMetrica === 'cph' ? '' : '/DÍA')", T)
js_tend = cambia(js_tend, "{ c: 'proy',    n: 'POR PROYECTO' }", "{ c: 'proy',    n: 'POR ALCANCE' }", T)
js_tend = cambia(js_tend, "' · EL ATAJO «TODO» REABRE LOS DIECISIETE MESES'",
                 "' · EL ATAJO «TODO» REABRE TODO EL PERIODO'", T)
js_tend = cambia(js_tend, "(gEscalaX === 'ano' ? 'año' : 'mes') + ' anterior</em>'", "'día anterior</em>'", T)
js_tend = cambia(js_tend, ": 'DEL PRIMER AL ÚLTIMO MES');", ": 'DEL PRIMER AL ÚLTIMO DÍA');", T)
# ---- los controles del grafico en una sola fila: rotulos cortos, y el nombre
#      entero en el globo de ayuda de cada boton (botonera lee o.t)
js_tend = cambia(js_tend, "+ (o.c === valor) + '\">' + esc(o.n) + '</button>';",
                 "+ (o.c === valor) + '\"' + (o.t ? ' title=\"' + esc(o.t) + '\"' : '') + '>' + esc(o.n) + '</button>';", T)
for _v, _n in [("  { c: 'cph',    n: 'US$ POR HORA', u: 'US$/h' },",
                "  { c: 'cph',    n: 'US$/HORA', t: 'Costo por hora máquina', u: 'US$/h' },"),
               ("  { c: 'horas',  n: 'HORAS MÁQUINA', u: 'h' },",
                "  { c: 'horas',  n: 'HORAS', t: 'Horas máquina', u: 'h' },"),
               ("  { c: 'auto', n: 'AUTOMÁTICA' },", "  { c: 'auto', n: 'AUTO', t: 'Escala automática' },"),
               ("  { c: 'cero', n: 'DESDE CERO' },", "  { c: 'cero', n: 'DESDE 0', t: 'El eje empieza en cero' },"),
               ("  { c: 'log',  n: 'LOGARÍTMICA' }", "  { c: 'log',  n: 'LOG', t: 'Escala logarítmica' }"),
               ("  { c: 'todo', n: 'TODO EL PERIODO' }", "  { c: 'todo', n: 'PERIODO', t: 'Todo el periodo en un solo punto' }"),
               ("  { c: 'fam',     n: 'POR FLOTA' },", "  { c: 'fam',     n: 'FLOTA', t: 'Una línea por flota' },"),
               ("  { c: 'tipo',    n: 'PROPIO / ALQUILADO' },", "  { c: 'tipo',    n: 'PROP/ALQ', t: 'Propio contra alquilado' },"),
               ("{ c: 'proy',    n: 'POR ALCANCE' }", "{ c: 'proy',    n: 'ALCANCE', t: 'Una línea por alcance' }"),
               ("  { c: 'ro',      n: 'POR TIPO DE COSTO' },", "  { c: 'ro',      n: 'RECURSO', t: 'Una línea por recurso (MAT, SERV, MO) y depreciación' },"),
               ("  { c: 'eq',      n: 'POR EQUIPO' }", "  { c: 'eq',      n: 'EQUIPO', t: 'Una línea por equipo' }")]:
    js_tend = cambia(js_tend, _v, _n, T)

js_filt = cambia(js_filt, "+ '% del libro');", "+ '% de lo cargado');", "nuevo_js_filtros.js")

S = "nuevo_js_setiembre.js"
js_sep = cambia(js_sep, "'/h proyectada');", "'/h de venta');", S)
js_sep = cambia(js_sep, "' con tarifa proyectada y horas en el mes · SE CUENTA EN TARIFA HASTA MEDIO PUNTO'",
                "' con tarifa de venta y horas en el mes · SE CUENTA EN TARIFA HASTA MEDIO PUNTO'", S)
js_sep = cambia(js_sep, "'Ningún modelo de ese tipo tiene tarifa proyectada y horas en setiembre.</td></tr>'",
                "'Ningún modelo de ese tipo tiene tarifa de venta y horas en setiembre.</td></tr>'", S)

# del modelo que se pasa de tarifa ya no se va a Flota, sino a Tendencia
js_sep = cambia(js_sep, "irA('v-flota');", "irA('v-costos');", S)

N = "nuevo_js_nav.js"
js_nav = entre(js_nav, "av.innerHTML = '<b>Este equipo no tiene detalle por conjunto.</b>",
               "' del libro; el resto sólo tiene su costo total.';",
               "av.innerHTML = '<b>Este equipo no tiene costo por conjunto.</b> Ninguna de sus órdenes "
               "con cargo lleva conjunto en SAP, o no tuvo órdenes.';", N)
js_nav = entre(js_nav, "av.innerHTML = '<b>Cuidado: estas dos cifras no son comparables.</b>",
               "'cuadrar contra el total.</b>';",
               "av.innerHTML = '<b>Los conjuntos suman más que el equipo porque hay un filtro puesto.</b> "
               "Con la selección actual el equipo lleva <b>US$ ' + fmt(Math.round(tot)) + '</b> y sus "
               "conjuntos <b>US$ ' + fmt(Math.round(suma)) + '</b>. El costo por conjunto sigue al periodo, "
               "pero no a los filtros de tipo de costo, fase, categoría ni clase de orden.';", N)
js_nav = entre(js_nav, "av.innerHTML = '<b>Esto no suma el costo del equipo, y no debería.</b>",
               "'de gasto: esas dimensiones no existen en esa fuente.';",
               "av.innerHTML = '<b>Esto no suma el costo del equipo, y no debería.</b> En ' "
               "+ esc(rotuloRango()) + ' el equipo lleva <b>US$ ' + fmt(Math.round(tot)) + '</b> y por "
               "conjunto se explican <b>US$ ' + fmt(Math.round(suma)) + '</b> (' + pc.toFixed(0) + '%). "
               "La diferencia es la depreciación y las órdenes que no llevan conjunto en SAP.';", N)
js_nav = cambia(js_nav, "+ '. El detalle de mantenimiento sólo cubre la sede SHGN.</td></tr>';",
                "+ '.</td></tr>';", N)
# la tecla F (extra.js) pulsa el boton de pantalla completa: que el boton lo diga
js_nav = cambia(js_nav, "dentro ? 'Salir de pantalla completa' : 'Ver a pantalla completa'",
                "dentro ? 'Salir de pantalla completa (F)' : 'Ver a pantalla completa (F)'", N)
cuerpo = cambia(cuerpo, 'title="Ver a pantalla completa">', 'title="Ver a pantalla completa (F)">', C)
# girar el camion y soltar contaba como clic y elegia el sistema que quedaba bajo el puntero
T3 = "piezas/tres_d.js"
tres_d = cambia(tres_d, "var estudioVisible = false, modelo3d = true;",
                "var estudioVisible = false, modelo3d = true, movioE = 0;", T3)
tres_d = cambia(tres_d, "arrastra = true; ultX = ev.clientX; ultY = ev.clientY;",
                "arrastra = true; ultX = ev.clientX; ultY = ev.clientY; movioE = 0;", T3)
tres_d = cambia(tres_d, "      rotY += (ev.clientX - ultX) * 0.0075;",
                "      movioE += Math.abs(ev.clientX - ultX) + Math.abs(ev.clientY - ultY);\n"
                "      rotY += (ev.clientX - ultX) * 0.0075;", T3)
tres_d = cambia(tres_d, "  cv.addEventListener('click', function(){\n    if(sobre && sobre.userData.code)",
                "  cv.addEventListener('click', function(){\n    if(movioE > 6) return;\n    if(sobre && sobre.userData.code)", T3)
# la camara mira a la altura de cada maquina (una perforadora con el mastil arriba
# pasa los 15 m) y se puede alejar mas; la sombra cubre maquinas mas largas
tres_d = cambia(tres_d, "  var ry = 2.6 + Math.sin(rotX) * dist * 0.62;",
                "  var my = (camion && camion.userData.mirarY) || 2.85;\n"
                "  var ry = my - 0.25 + Math.sin(rotX) * dist * 0.62;", T3)
tres_d = cambia(tres_d, "  camE.lookAt(0, 2.85, 0);", "  camE.lookAt(0, my, 0);", T3)
tres_d = cambia(tres_d, "dist = clamp(dist + (ev.deltaY > 0 ? 1.6 : -1.6), 16, 46);",
                "dist = clamp(dist + (ev.deltaY > 0 ? 1.6 : -1.6), 16, 72);", T3)
tres_d = cambia(tres_d, "key.shadow.mapSize.set(1024, 1024);", "key.shadow.mapSize.set(2048, 2048);", T3)
tres_d = cambia(tres_d, "c.left = -13; c.right = 13; c.top = 13; c.bottom = -13;",
                "c.left = -20; c.right = 20; c.top = 20; c.bottom = -20;", T3)
# en 3D se ve todo equipo que tenga modelo (modelos3d.js), no solo los de acarreo;
# y si el usuario eligio la vista 2D, se respeta al cambiar de equipo
js_nav = cambia(js_nav, "  ponerModo(e.fam === 'ACARREO' && modelo3d, e.fam !== 'ACARREO');",
                "  ponerModo(tiene3d(e) && prefiere3d, !tiene3d(e));", N)
js_nav = cambia(js_nav, "esc_('v-3d', 'click', function(){ ponerModo(true); });",
                "esc_('v-3d', 'click', function(){ prefiere3d = true; ponerModo(true); });", N)
js_nav = cambia(js_nav, "esc_('v-2d', 'click', function(){ ponerModo(false); });",
                "esc_('v-2d', 'click', function(){ prefiere3d = false; ponerModo(false); });", N)
# Atlas Copco / Epiroc tambien son amarillas: su mapa de calor va en la escala ambar
tres_d = cambia(tres_d, "(CAT|CATERPILLAR|KOMATSU)([^A-Z]|$)", "(CAT|CATERPILLAR|KOMATSU|ATLAS COPCO|EPIROC)([^A-Z]|$)", T3)
# hoja Equipo: todos los equipos en el selector (equipo.js) y un buscador al lado
cuerpo = cambia(cuerpo, '      <select id="selector" aria-label="Elegir equipo"></select>\n', equipo_html, C)
_SEL = ("htm('selector', EQ.map(function(e){\n"
        "    return '<option value=\"' + esc(e.id) + '\">' + esc(e.id + ' — ' + (e.mod || e.fam)) + '</option>';\n"
        "  }).join(''));")
js_datos = cambia(js_datos, "  " + _SEL, "  llenarSelectorEq();", D)
# con un filtro que solo deja equipos sin costo, la hoja Equipo elige igual uno de ellos
js_datos = cambia(js_datos, "  if(EQ.length) elegirEquipo(byId[eqActual] ? eqActual : EQ[0].id);",
                  "  var eqLista = EQ.concat(EQ_SIN_MOV);\n"
                  "  if(eqLista.length) elegirEquipo(byId[eqActual] ? eqActual : eqLista[0].id);", D)
# los filtros de flota tambien arriba de la hoja Equipo (sufijo 5, equipo.js)
js_datos = cambia(js_datos, "var SUFS = ['', '3'];", "var SUFS = ['', '3', '5'];", D)
# filtros en cascada: cada desplegable ofrece solo lo que queda con los demas (equipo.js)
for _c, _v, _t in [("tipo", "tipoFiltro", "TODOS"), ("fam", "famFiltro", "TODAS"), ("mod", "modFiltro", "TODOS"), ("prov", "provFiltro", "TODOS")]:
    js_datos = cambia(js_datos, "opciones(u.%s, %s, '%s')" % (_c, _v, _t), "opciones(universoPara('%s'), %s, '%s')" % (_c, _v, _t), D)
js_nav = cambia(js_nav, _SEL.replace("\n    ", "\n  ").replace("\n  })", "\n})"), "llenarSelectorEq();", N)
js_nav = cambia(js_nav, "  var e = byId[id];\n",
                "  var e = byId[id];\n  var sm = $('sinMovEq'); if(sm) sm.hidden = !e.sinMov;\n", N)
# con los modelos de detalle en espacio lineal, los colores del mapa de calor
# tambien se pasan a lineal (la base ya lo esta)
tres_d = cambia(tres_d, "    if(c === sysActual) hex = css('--hivis') || '#FCE624';\n    m.material.color.set(hex);",
                "    if(c === sysActual) hex = css('--hivis') || '#FCE624';\n    m.material.color.set(hex);\n"
                "    if(camion.userData.colorLineal && hex !== m.userData.base) m.material.color.convertSRGBToLinear();", T3)
# el camion del estudio es el del modelo del equipo (modelos3d.js), antes de pintarlo
js_nav = cambia(js_nav, "  pintarCarroceria(camion, esMarcaAmarilla(e.marca));",
                "  ponerModelo3d(e);\n  pintarCarroceria(camion, esMarcaAmarilla(e.marca));", N)

# ══════════════════════════════════════════════════════════════════════
#  letra para proyectar: los rotulos, notas y cabeceras chicos se agrandan
# ══════════════════════════════════════════════════════════════════════
# La Torre original se penso para pantalla de escritorio y usa rotulos de 8 a
# 11 px. En una sala, proyectados, no se leen. Aqui se suben todos los que
# esten en ese rango, en todas las hojas de estilo, sin tocar las cifras
# grandes ni el cuerpo de las tablas (11.5 px en adelante queda igual).
LETRA_SALA = {"8": "11", "8.5": "11", "9": "11.5", "9.5": "11.5", "10": "12", "10.5": "12.5", "11": "12.5"}

def agrandar(t):
    def en_estilo(m):
        return re.sub(r"font-size:(\s*)(\d+(?:\.\d+)?)px",
                      lambda f: "font-size:%s%spx" % (f.group(1), LETRA_SALA.get(f.group(2), f.group(2))),
                      m.group(0))
    return re.sub(r"<style>.*?</style>", en_estilo, t, flags=re.S)

# ══════════════════════════════════════════════════════════════════════
#  ensamblado, en el mismo orden que la Torre original
# ══════════════════════════════════════════════════════════════════════
fondo = ('<div class="cielo" id="cielo" aria-hidden="true"></div>\n'
         '<div class="tajo" id="tajo" aria-hidden="true"><canvas id="lienzo-tajo"></canvas></div>\n')
if 'id="tajo"' not in cuerpo:
    cuerpo = cuerpo.replace('<header class="nav" id="nav">', fondo + '<header class="nav" id="nav">', 1)

nuevo = (cabecera + css + "\n" + cuerpo + "\n<script>\n(function(){\n"
         + util + "\nvar DATA = " + datos + ";\n"
         + "var SETIEMBRE = " + sep + ";\n"
         + js_datos + "\n" + js_tend + "\n" + js_filt + "\n" + js_sep + "\n" + cont + tres_d
         + "\n" + extra + "\n" + hojas_js + "\n" + tablero_js + "\n" + burbuja_js
         # los modelos 3D antes de la navegacion: al final de ella se elige el primer equipo
         + "\n" + modelos3d_js + "\n" + detalle3d_js + "\n" + modelos_det_js + "\n" + equipo_js + "\n" + js_nav
         # la division envuelve irA(): tiene que ir despues de nuevo_js_nav.js
         + "\n" + division_js + "\n" + movil_js + "\n})();\n</script>\n")

nuevo = agrandar(nuevo)
io.open(SALIDA, "w", encoding="utf-8", newline="\n").write(nuevo)
print("artifact.html:", len(nuevo), "bytes ->", SALIDA)

for marca in ["<title>Torre de Control Setiembre</title>", "PIONEROS EN CAMIONES", 'class="pes"',
              "function iniciarTajo", "function construirCamion", "function irA(", "var DATA = {",
              "var SETIEMBRE = {", 'id="tajo"', "TORRE DE SETIEMBRE — lo que esta copia hace distinto",
              'id="fi-cuadre"', 'id="fi-zserv"', "var proyFiltro = PROYS[0];", 'id="v-propios"', 'id="v-alquilados"',
              "function hxTabla", 'id="hx-editor"', 'id="v-tablero"',
              "function tbPintar", "function hxOrigen", 'id="bz"', "function bzNumero",
              'id="divisor"', "function divAplicar", "function hxMaxi", "body.navMin"]:
    print(("  OK      " if marca in nuevo else "  FALTA   ") + marca)
# nada de esto debe quedar a la vista: es vocabulario de la Torre del libro mayor
for sobra in ["libro mayor le carga", "DIECISIETE", "<b>1,291 del libro</b>", "Ojo con agosto",
              "TODOS LOS PROYECTOS'", "n: 'POR AÑO'", "ÚLTIMOS 12 MESES", "COLUMNA AB",
              'id="v-flota"', "<b>Flota</b>", "__CORTE__", "__PERIODOS__", "sin refrescar", "parte diario",
              "AL DÍA 6", "hasta el día 6", "hasta el 9 de setiembre"]:
    print(("  SOBRA   " if sobra in nuevo else "  limpio  ") + sobra)
