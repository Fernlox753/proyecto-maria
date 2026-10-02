# -*- coding: utf-8 -*-
"""Datos de la Torre de Setiembre, desde los consolidados de cada proyecto.

Un libro por proyecto en CONSOLIDADO\\ (el mas reciente de cada uno):

  0 SHGN_RO EQUIPOS*.xlsx    SHGN  Shougang
  00 ATOC_RO EQUIPOS*.xlsx   ATOC  Atocongo
  00 TRMA_RO EQUIPOS*.xlsx   TRMA  Tarma
  00 TEMB_RO EQUIPOS*.xlsx   TEMB  Tembladera

o los que se pasen como argumento. Lee los .xlsx directamente (no hace falta
tenerlos abiertos en Excel) y escribe:

  datos.json       la misma forma que tarifas.json de la Torre original, para
                   que el mismo frontend lo recorra: una tabla de hechos plana
                   con el dia en el sitio del mes. Cada equipo lleva su
                   proyecto (sede), que es el filtro de proyecto de la pagina.
  setiembre.json   la fila de cada equipo como la ensenan las hojas
                   <SEDE> PROP y <SEDE> ALQ, y las ordenes de cada uno.
  validacion.json  los cuadres de cada proyecto contra sus dos hojas.

DOS FUENTES, Y SE CRUZAN:

  la base      la hoja «BASE DATOS dd.mm» se recalcula con las reglas que el
               script lee de las propias dinamicas de las hojas de reporte (los
               filtros de cada una): una fila entra al resultado operativo si
               pasa todos los filtros de la dinamica de su TIPO (PROPIO ->
               <SEDE> PROP, ALQUILADO -> <SEDE> ALQ). Lo que no pasa no se
               tira: viaja en su propio alcance (CAPEX, PASAR A VENTA...). De
               aqui sale todo el detalle: dia, fase, recurso, orden.
               RYM = MAT + SERV.  MOV = MO.
  las hojas    lo que en el Excel es formula (depreciacion o alquiler, venta
               interna, horas, horas de proforma, DM, usaje y todo el
               acumulado 2026) se toma TAL CUAL de la fila de cada equipo en
               la dinamica de <SEDE> PROP / ALQ. Cada proyecto tiene sus
               propias formulas (Tarma no cuenta servicios en propios,
               Atocongo filtra el centro...), y lo que la pagina ensena tiene
               que ser lo mismo que el Excel.

El cruce: RyM y MOV recalculados desde la base tienen que dar, equipo por
equipo, lo mismo que la hoja. Si no cuadran al centavo, el script se detiene.

Las horas por dia salen del cache de la dinamica del parte de horas (export
de SAP); se escalan para que cada equipo sume lo que dice su hoja. La
depreciacion de cada dia es la de la hoja repartida por esas horas.

Las columnas se buscan POR NOMBRE DE ENCABEZADO. Si falta una, el script se
detiene: mejor eso que un numero corrido sin aviso.

    cd ...\\MARIA\\TORRE_SETIEMBRE
    python gen_datos.py  [libro.xlsx ...]
"""
import calendar, collections, datetime, glob, io, json, os, posixpath, re, shutil, sys, tempfile, zipfile
import urllib.parse
import xml.etree.ElementTree as ET

try:
    import openpyxl
except ImportError:
    sys.exit("Falta openpyxl:  pip install openpyxl")

AQUI = os.path.dirname(os.path.abspath(__file__))
CONSOLIDADO = os.path.join(os.path.dirname(AQUI), "CONSOLIDADO")

# los proyectos, en el orden en que salen en la pagina
SEDES = [("SHGN", "SHOUGANG"), ("ATOC", "ATOCONGO"), ("TRMA", "TARMA"), ("TEMB", "TEMBLADERA")]
NOM_SEDE = dict(SEDES)
PAT_LIBRO = re.compile(r"^\d*\s*([A-Za-z]{3,5})_RO EQUIPOS.*\.xlsx$")
# las conformidades de Z SERV de cada proyecto se reconocen por el final del CECO
CECO_SEDE = {"SHGN": "SHEP"}

RO = "RESULTADO OPERATIVO"
RM_PROPIA = "REPARACIÓN MAYOR PROPIA"
FUERA = "FUERA DEL REPORTE"
OTRO_CENTRO = "OTRO CENTRO"
ORDEN_ALC = [RO, "CAPEX", "PROCESO CAPEX", "PASAR A VENTA", "PARTE DE LA TARIFA", "DESM. UNOP",
             RM_PROPIA, OTRO_CENTRO, FUERA]
# la misma marca de CONSIDERAR escrita distinto en cada libro
ALC_IGUAL = {"EN PROCESO DE CAPEX": "PROCESO CAPEX", "PROCESO DE CAPEX": "PROCESO CAPEX", "VENTA": "PASAR A VENTA"}
ROS = ["MATERIALES", "SERVICIOS", "MANO DE OBRA", "DEPRECIACIÓN"]
DE_RECURSO = {"MAT": "MATERIALES", "SERV": "SERVICIOS", "MO": "MANO DE OBRA"}
FASES = {"LU": "LUBRICACIÓN", "MM": "MANTENIMIENTO MECÁNICO", "LL": "LLANTAS",
         "ED": "ELEMENTOS DE DESGASTE", "RM": "REPARACIÓN MAYOR", "CA": "CARRILERÍA"}
SIN_FASE = "(SIN FASE)"
NO_MANT = "(NO ES MANTENIMIENTO)"
SIN_CLASE = "(SIN CLASE DE ORDEN)"
TITULOS_VARIOS = ("HOROMETRO REAL", "TARIFAS VENTA", "PROFORMA", "DM-USAJE", "OT PARA EL CAPEX", "ACUMULADO 2026")
VACIO = "(vacío)"
# campos del parte de horas, segun la version del libro: (equipo, fecha, horas)
CAMPOS_HORAS = (("Equipo", "Fe.prest.actividad", "Cantidad"), ("Número de equipo", "Fecha de notificación", "HM"),
                ("Codigo", "FECHA", "HORAS OPERATIVAS"))

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
NR = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"


def falla(msg):
    sys.exit("\nNO SE PUEDE SEGUIR: " + msg)


def num(x):
    return float(x) if isinstance(x, (int, float)) and not isinstance(x, bool) else 0.0


def num_o_nada(x):
    return float(x) if isinstance(x, (int, float)) and not isinstance(x, bool) else None


def txt(x):
    return "" if x is None else str(x).strip()


def norm(x):
    return re.sub(r"\s+", " ", txt(x)).upper()


def clave(x):
    """Un valor de celda escrito como lo guarda el cache de una dinamica."""
    if x is None or (isinstance(x, str) and not x.strip()): return VACIO
    if isinstance(x, datetime.datetime): return x.strftime("%Y-%m-%dT%H:%M:%S")
    if isinstance(x, bool): return "1" if x else "0"
    if isinstance(x, (int, float)): return str(int(x)) if float(x).is_integer() else repr(float(x))
    return str(x)


def familia_flota(desc):
    """La flota no viene en el consolidado: se deduce de la descripcion."""
    x = (desc or "").upper()
    if "FUERA DE CARRETERA" in x: return "ACARREO"
    if "VOLQUETE" in x or "ANFO" in x: return "ACARREO MENOR"
    if "PALA" in x or "CARGADOR" in x or "EXCAVADORA" in x: return "CARGUIO"
    if "PERFORADORA" in x: return "PERFO"
    return "AUXILIARES"


def sede_de(ruta):
    m = PAT_LIBRO.match(os.path.basename(ruta))
    if not m: falla("no se de que proyecto es «%s» (se espera «… XXXX_RO EQUIPOS….xlsx»)" % os.path.basename(ruta))
    return m.group(1).upper()


def elegir_libros():
    """[(sede, ruta)]: los pasados como argumento, o el mas reciente de cada proyecto."""
    if len(sys.argv) > 1:
        libros = [(sede_de(p), os.path.abspath(p)) for p in sys.argv[1:]]
    else:
        por = {}
        for p in glob.glob(os.path.join(CONSOLIDADO, "*.xlsx")):
            b = os.path.basename(p)
            if b.startswith("~$") or not PAT_LIBRO.match(b): continue
            s = sede_de(p)
            if s not in por or os.path.getmtime(p) > os.path.getmtime(por[s]): por[s] = p
        libros = list(por.items())
    if not libros: falla("no hay ningun «… XXXX_RO EQUIPOS….xlsx» en " + CONSOLIDADO)
    orden = [s for s, _ in SEDES]
    libros.sort(key=lambda x: (orden.index(x[0]) if x[0] in orden else len(orden), x[0]))
    vistos = [s for s, _ in libros]
    if len(set(vistos)) != len(vistos): falla("hay dos libros del mismo proyecto: %s" % libros)
    return libros


# ── lectura de celdas ─────────────────────────────────────────────────
def filas_de(ws):
    return [list(r) for r in ws.iter_rows(values_only=True)]


def tabla(filas, fila_enc, pedidas, hoja):
    """Filas como dict, con las columnas pedidas buscadas por encabezado."""
    enc = [txt(c) for c in filas[fila_enc]]
    pos = {}
    for p in pedidas:
        if p not in enc:
            falla("en la hoja «%s» falta la columna «%s».\n  Hay: %s" % (hoja, p, [e for e in enc if e]))
        pos[p] = enc.index(p)
    out = []
    for r in filas[fila_enc + 1:]:
        out.append({p: (r[i] if i < len(r) else None) for p, i in pos.items()})
    return out


def bloque(filas, titulo, pedidas, fila_tit=0, fila_enc=7):
    """Un bloque de BASE VARIOS: empieza donde esta su titulo en la fila 1 y
    llega hasta el titulo siguiente. Dentro, las columnas por encabezado.
    Una columna pedida puede ser una lista de nombres posibles: vale el primero
    que este, y el dict la guarda con el primer nombre de la lista."""
    # solo los titulos conocidos parten la hoja: en la fila 1 hay tambien
    # celdas sueltas (EP-40 en T1, MO en D1) que no son el comienzo de ningun bloque
    tit = [(i, txt(c)) for i, c in enumerate(filas[fila_tit]) if txt(c) in TITULOS_VARIOS]
    ini = [i for i, t in tit if t == titulo]
    if not ini:
        falla("en «BASE VARIOS» no esta el bloque «%s». Titulos: %s" % (titulo, [t for _, t in tit]))
    ini = ini[0]
    sig = [i for i, _ in tit if i > ini]
    fin = min(sig) if sig else len(filas[fila_enc])
    enc = {}
    for i in range(ini, fin):
        e = txt(filas[fila_enc][i]) if i < len(filas[fila_enc]) else ""
        if e and e not in enc: enc[e] = i
    pos = {}
    for p in pedidas:
        ops = p if isinstance(p, (list, tuple)) else (p,)
        esta = [o for o in ops if o in enc]
        if not esta:
            falla("en el bloque «%s» de BASE VARIOS falta la columna «%s». Hay: %s" % (titulo, " / ".join(ops), list(enc)))
        pos[ops[0]] = enc[esta[0]]
    out = []
    for r in filas[fila_enc + 1:]:
        out.append({p: (r[i] if i < len(r) else None) for p, i in pos.items()})
    return out


def primero(filas, col):
    """Como BUSCARV: si un codigo se repite, vale la primera fila."""
    d = {}
    for f in filas:
        k = txt(f[col])
        if k and k not in d: d[k] = f
    return d


# ── lectura del xml del libro: dinamicas y formulas ───────────────────
def rels(z, parte):
    d, b = posixpath.split(parte)
    rp = posixpath.join(d, "_rels", b + ".rels")
    if rp not in z.namelist(): return {}
    out = {}
    for r in ET.fromstring(z.read(rp)):
        t = r.get("Target")
        if r.get("TargetMode") != "External":
            t = t.lstrip("/") if t.startswith("/") else posixpath.normpath(posixpath.join(d, t))
        out[r.get("Id")] = (r.get("Type").rsplit("/", 1)[-1], t)
    return out


def parte_hoja(z, nombre):
    wb = ET.fromstring(z.read("xl/workbook.xml"))
    rr = rels(z, "xl/workbook.xml")
    for s in wb.find(NS + "sheets"):
        if s.get("name") == nombre: return rr[s.get(NR + "id")][1]
    falla("no encuentro la hoja «%s» dentro del libro" % nombre)


def valor_cache(e):
    if e.tag == NS + "m": return VACIO
    v = e.get("v")
    if e.tag == NS + "n":
        f = float(v)
        return str(int(f)) if f.is_integer() else repr(f)
    return v


def cache(z, parte_def):
    raiz = ET.fromstring(z.read(parte_def))
    campos, comp = [], []
    for cf in raiz.find(NS + "cacheFields"):
        campos.append(cf.get("name"))
        si = cf.find(NS + "sharedItems")
        comp.append([valor_cache(e) for e in si] if si is not None else [])
    ws = raiz.find(NS + "cacheSource/" + NS + "worksheetSource")
    externo = [t for tipo, t in rels(z, parte_def).values() if tipo == "externalLinkPath"]
    return {"campos": campos, "comp": comp, "hoja": ws.get("sheet") if ws is not None else None,
            "externo": urllib.parse.unquote(posixpath.basename(externo[0])) if externo else None,
            "registros": [t for tipo, t in rels(z, parte_def).values() if tipo == "pivotCacheRecords"]}


def reglas_dinamica(z, hoja):
    """Los filtros de la dinamica de una hoja: {campo: {ver, ocultos}}, solo
    los campos que esconden algo, con los valores como los guarda el cache."""
    ph = parte_hoja(z, hoja)
    tablas = [t for tipo, t in rels(z, ph).values() if tipo == "pivotTable"]
    if len(tablas) != 1: falla("esperaba una dinamica en «%s»; hay %d" % (hoja, len(tablas)))
    pt = ET.fromstring(z.read(tablas[0]))
    cdef = [t for tipo, t in rels(z, tablas[0]).values() if tipo == "pivotCacheDefinition"][0]
    c = cache(z, cdef)
    pf_el = pt.find(NS + "pageFields")
    pagina = {int(p.get("fld")): p.get("item") for p in (list(pf_el) if pf_el is not None else [])}
    filtros = {}
    for i, pf in enumerate(pt.find(NS + "pivotFields")):
        its = pf.find(NS + "items")
        if its is None: continue
        its = list(its)
        vis, ocu = [], []
        for it in its:
            if it.get("x") is None: continue           # subtotales y el item por defecto
            v = c["comp"][i][int(it.get("x"))]
            (ocu if it.get("h") == "1" else vis).append(v)
        # filtro de pagina con un solo valor elegido (sin seleccion multiple)
        if i in pagina and pagina[i] is not None and pf.get("multipleItemSelectionAllowed") != "1":
            sel = c["comp"][i][int(its[int(pagina[i])].get("x"))]
            vis, ocu = [sel], [v for v in vis + ocu if v != sel]
        if ocu: filtros[c["campos"][i]] = {"ver": vis, "ocultos": ocu}
    return filtros, c["hoja"]


def equipos_en_formula(z, hoja, letra):
    """Los codigos de equipo que la formula de una columna nombra con D#="…"
    (los que el Excel prorratea por dias en vez de multiplicar por horas)."""
    ph = parte_hoja(z, hoja)
    pat = re.compile(r"^%s\d+$" % letra)
    cods = []
    for _, e in ET.iterparse(z.open(ph)):
        if e.tag == NS + "c":
            if pat.match(e.get("r") or ""):
                f = e.find(NS + "f")
                if f is not None and f.text:
                    for cod in re.findall(r'D\d+="([^"]+)"', f.text):
                        if cod not in cods: cods.append(cod)
            e.clear()
    return tuple(cods)


def partes_de_horas(z):
    """Las horas por equipo y dia de cada cache que tenga el parte de horas:
    [(horas, fuente)]. BASE VARIOS solo ensena el total por equipo, pero la
    dinamica guarda en su cache el parte completo. Puede haber mas de uno."""
    out_all = []
    for d in sorted(n for n in z.namelist() if n.startswith("xl/pivotCache/pivotCacheDefinition")):
        c = cache(z, d)
        for trio in CAMPOS_HORAS:
            if all(x in c["campos"] for x in trio): break
        else:
            continue
        if not c["registros"]: continue
        ic, ifc, ih = (c["campos"].index(x) for x in trio)
        out = collections.defaultdict(collections.Counter)
        for _, r in ET.iterparse(z.open(c["registros"][0])):
            if r.tag != NS + "r": continue
            v = []
            for i, e in enumerate(r):
                if e.tag == NS + "x": v.append(c["comp"][i][int(e.get("v"))])
                elif e.tag == NS + "m": v.append(None)
                else: v.append(e.get("v"))
            r.clear()
            cod, f, h = v[ic], v[ifc], v[ih]
            if not cod or cod == VACIO or not f or f == VACIO or h in (None, "", VACIO): continue
            try: h = float(h)
            except ValueError: continue
            out[cod.strip()][f[:10]] += h
        out_all.append((out, c["externo"] or c["hoja"] or "cache de la dinamica"))
    return out_all


# ── la hoja de reporte: columnas por encabezado y la fila de cada equipo ──
def columnas_reporte(filas, hoja):
    """Las columnas de <SEDE> PROP / ALQ por su encabezado de dos filas: el
    grupo (fila 4: «Costo Real al 30», «Acumulado 2026»...) y el rotulo
    (fila 5: RYM, MOV, Dep...). El primer «Acumulado 2026» es el costo y el
    segundo la venta."""
    g4, g5 = filas[3], filas[4]
    grupo, nac, cols = "", 0, {}
    for j in range(max(len(g4), len(g5))):
        a = norm(g4[j]) if j < len(g4) else ""
        b = norm(g5[j]) if j < len(g5) else ""
        if a:
            grupo = a
            if grupo.startswith("ACUMULADO 2026"):
                nac += 1
                grupo = "ACUM%d" % nac
        cols.setdefault((grupo, b), j)
    def col(grupos, rotulos, oblig=True):
        for (g, b), j in sorted(cols.items(), key=lambda x: x[1]):
            if any(g.startswith(x) for x in grupos) and b in rotulos: return j
        if oblig: falla("en «%s» no encuentro la columna %s / %s" % (hoja, grupos, rotulos))
        return None
    TER = ("DEP", "ALQ")
    m = {
        "c": [col(["COSTO REAL"], ("RYM",)), col(["COSTO REAL"], ("MOV",)), col(["COSTO REAL"], TER),
              col(["COSTO REAL"], ("TOTAL",))],
        "seg": col(["COSTO REAL"], ("SEG",)),
        "prof": col(["COSTO PROF", "COSTO PLAN"], ("",), False),
        "dm": col(["%DM"], ("",)), "use": col(["UTILIZ", "%UTILIZ", "%USE", "USAJE"], ("",)),
        "hr": col(["HRAS REAL", "HORAS REAL", "HM REAL"], ("",)),
        "hrProf": col(["HRAS PROF", "HORAS PLAN", "HM PLAN", "HORAS PROF"], ("",)),
        "v": [col(["VENTA INTERNA"], ("RYM",)), col(["VENTA INTERNA"], ("MOV",)), col(["VENTA INTERNA"], TER),
              col(["VENTA INTERNA"], ("TOTAL",))],
        "t": [col(["TARIFA "], ("RYM",), False), col(["TARIFA "], ("MOV",), False), col(["TARIFA "], TER, False),
              col(["TARIFA "], ("VENTA",), False)],
        "Ac": [col(["ACUM1"], ("RYM",)), col(["ACUM1"], ("MOV",)), col(["ACUM1"], TER), col(["ACUM1"], ("SEG",)),
               col(["ACUM1"], ("COSTO",))],
        "Ah": col(["ACUM1"], ("HORAS",)),
        "Av": [col(["ACUM2"], ("RYM",)), col(["ACUM2"], ("MOV",)), col(["ACUM2"], TER), col(["ACUM2"], ("VENTA",))],
    }
    return m


def fila_reporte(r, m):
    g = lambda j: num(r[j]) if j is not None and j < len(r) else 0.0
    go = lambda j: num_o_nada(r[j]) if j is not None and j < len(r) else None
    return {"c": [g(j) for j in m["c"]], "seg": g(m["seg"]), "prof": g(m["prof"]),
            "dm": go(m["dm"]), "use": go(m["use"]), "hr": g(m["hr"]), "hrProf": g(m["hrProf"]),
            "v": [g(j) for j in m["v"]], "t": [g(j) for j in m["t"]],
            "Ac": [g(j) for j in m["Ac"]], "Ah": g(m["Ah"]), "Av": [g(j) for j in m["Av"]]}


def leer_reporte(filas, hoja):
    """La fila Total y la fila de cada equipo de la dinamica de una hoja de
    reporte. Arriba van los modelos (formulas sobre la dinamica), despues la
    fila Total y debajo la dinamica con un equipo por fila (columna D)."""
    m = columnas_reporte(filas, hoja)
    tot = [i for i, r in enumerate(filas) if len(r) > 3 and txt(r[1]) == "Total"]
    if not tot: falla("no encuentro la fila Total en «%s»" % hoja)
    enc = [i for i, r in enumerate(filas) if len(r) > 3 and txt(r[1]) == "DESCRIPCION EQP" and i > tot[0]]
    if not enc: falla("no encuentro el encabezado de la dinamica (DESCRIPCION EQP) en «%s»" % hoja)
    eqs, orden, vacias = {}, [], 0
    for r in filas[enc[0] + 1:]:
        cod = txt(r[3]) if len(r) > 3 else ""
        if txt(r[1]).startswith("Total general") or cod.startswith("Total general"): break
        if not cod or not isinstance(r[3], str):
            vacias += 1
            if orden and vacias > 8: break
            continue
        vacias = 0
        if cod in eqs: falla("el equipo %s esta dos veces en la dinamica de «%s»" % (cod, hoja))
        x = fila_reporte(r, m)
        x["fam"], x["mod"] = txt(r[1]), txt(r[2])
        eqs[cod] = x
        orden.append(cod)
    total = fila_reporte(filas[tot[0]], m)
    total["nEq"] = num(filas[tot[0]][3])
    return {"eq": eqs, "orden": orden, "total": total, "filaTotal": tot[0] + 1, "filaDin": enc[0] + 1}


def corte_del_encabezado(filas):
    """«Costo Real al 30»: el dia de corte que dice la hoja."""
    for c in filas[3]:
        m = re.match(r"COSTO REAL AL (\d{1,2})\b", norm(c))
        if m: return int(m.group(1))
    return None


# ── un proyecto ───────────────────────────────────────────────────────
def leer_proyecto(sede, LIBRO):
    if not os.path.exists(LIBRO): falla("no existe " + LIBRO)
    H_PROP, H_ALQ = sede + " PROP", sede + " ALQ"
    nombre_libro = os.path.splitext(os.path.basename(LIBRO))[0]
    # se trabaja sobre una copia: copiar funciona aunque el libro este abierto
    tmp = os.path.join(tempfile.mkdtemp(prefix="torre_set_"), "consolidado.xlsx")
    shutil.copy2(LIBRO, tmp)
    print("\n== %s · leyendo %s ..." % (sede, os.path.basename(LIBRO)))
    z = zipfile.ZipFile(tmp)

    # ── las reglas, de las dinamicas de las hojas de reporte ───────────
    REGLAS, fuentes = {}, {}
    for tipo, hoja in (("PROPIO", H_PROP), ("ALQUILADO", H_ALQ)):
        REGLAS[tipo], fuentes[tipo] = reglas_dinamica(z, hoja)
    DEP_POR_DIAS = equipos_en_formula(z, H_PROP, "N")
    ALQ_POR_DIAS = equipos_en_formula(z, H_ALQ, "N")
    partes = partes_de_horas(z)
    z.close()

    wb = openpyxl.load_workbook(tmp, read_only=True, data_only=True)
    hoja_base = [n for n in wb.sheetnames if n.upper().startswith("BASE DATOS")]
    if len(hoja_base) != 1:
        falla("%s: esperaba una sola hoja «BASE DATOS dd.mm»; hay %s" % (sede, hoja_base))
    for tipo, h in fuentes.items():
        if h and h != hoja_base[0]:
            print("OJO: la dinamica de %s apunta a «%s», no a «%s»" % (tipo, h, hoja_base[0]))
    for n in ("BASE OTS", "BASE VARIOS", H_PROP, H_ALQ):
        if n not in wb.sheetnames: falla("%s: falta la hoja «%s»" % (sede, n))

    C_COD = "Código Recurso/Usuario Conformidad/Categoria"
    C_OS = "Id Personal/OS/Articulo"
    pedidas = ["RECURSO", "Equipo", "OT", "Fase", C_COD, C_OS, "Fecha de Tran", "COSTO RYM", "Descripcion OT",
               "DESCRIPCION EQP", "MARCA", "MODELO", "PROVEEDOR", "TIPO", "CONSIDERAR"]
    filtrados = sorted({c for r in REGLAS.values() for c in r} - {"Fecha de Tran", "TIPO"})
    base = tabla(filas_de(wb[hoja_base[0]]), 0, pedidas + [c for c in filtrados if c not in pedidas], hoja_base[0])
    base = [f for f in base if txt(f["RECURSO"])]
    ots_sap = {f["Orden"]: f for f in tabla(filas_de(wb["BASE OTS"]), 0,
               ["Orden", "Conjunto", "Denom.conjunto", "Clase de orden", "Texto breve"], "BASE OTS") if f["Orden"]}
    fv = filas_de(wb["BASE VARIOS"])
    hb = bloque(fv, "HOROMETRO REAL", [["Número de equipo", "Equipo", "Codigo"],
                                       ["Suma de HM", "Suma de Cantidad", "Suma de HORAS OPERATIVAS"]])
    horom = {e: num(f["Suma de HM"]) for e, f in primero(hb, "Número de equipo").items() if e != "Total general"}
    periodos = set()
    try:
        for f in bloque(fv, "ACUMULADO 2026", ["Asignación", "Período"]):
            if not txt(f["Asignación"]) or txt(f["Período"]) == "": continue
            try: periodos.add(int(float(txt(f["Período"]))))
            except ValueError: pass
    except SystemExit:
        print("OJO: %s no tiene el bloque ACUMULADO 2026 en BASE VARIOS" % sede)
    fp, fa = filas_de(wb[H_PROP]), filas_de(wb[H_ALQ])
    # servicios conformados en Z SERV que no llegaron a la base (informativo)
    zserv = None
    if "Z SERV" in wb.sheetnames and sede in CECO_SEDE:
        zf = filas_de(wb["Z SERV"])
        enc = [txt(c) for c in zf[0]]
        need = ("CECO", "COSTO", "Codigo de la orden de Trabajo", "Id de la Orden de Servicio")
        if all(n in enc for n in need):
            ots_os = {(clave(f["OT"]), clave(f[C_OS])) for f in base if txt(f["RECURSO"]) == "SERV"}
            falt = [f for f in tabla(zf, 0, list(need), "Z SERV")
                    if txt(f["CECO"]).endswith(CECO_SEDE[sede]) and num(f["COSTO"])
                    and (clave(f["Codigo de la orden de Trabajo"]), clave(f["Id de la Orden de Servicio"])) not in ots_os]
            zserv = {"n": len(falt), "v": round(sum(num(f["COSTO"]) for f in falt), 2)}
    wb.close()
    shutil.rmtree(os.path.dirname(tmp), ignore_errors=True)

    rep = {"PROPIO": leer_reporte(fp, H_PROP), "ALQUILADO": leer_reporte(fa, H_ALQ)}

    # ── el corte: el filtro de fecha de la dinamica, o lo que dice la hoja ──
    fechas_base = [f["Fecha de Tran"] for f in base if isinstance(f["Fecha de Tran"], datetime.datetime)]
    if not fechas_base: falla("%s: la base no trae ninguna fecha" % sede)
    fecha_max = max(fechas_base)
    con_fecha = {t: sorted(v for v in r["Fecha de Tran"]["ver"] if v != VACIO)
                 for t, r in REGLAS.items() if r.get("Fecha de Tran")}
    if con_fecha:
        ult = max(v[-1] for v in con_fecha.values())
        ult = datetime.datetime.strptime(ult[:10], "%Y-%m-%d")
        if len({v[-1] for v in con_fecha.values()}) > 1:
            print("OJO: las dos dinamicas de %s tienen distinto corte: %s" % (sede, {t: v[-1] for t, v in con_fecha.items()}))
        ANIO, MES, CORTE = ult.year, ult.month, ult.day
        corte_de = "filtro «Fecha de Tran» de la dinámica"
    else:
        ANIO, MES = fecha_max.year, fecha_max.month
        CORTE = corte_del_encabezado(fp) or fecha_max.day
        corte_de = "encabezado «Costo Real al %d» de %s" % (CORTE, H_PROP)
    DIAS_MES = calendar.monthrange(ANIO, MES)[1]
    dias = ["%04d-%02d-%02d" % (ANIO, MES, d) for d in range(1, CORTE + 1)]
    idia = {d: i for i, d in enumerate(dias)}

    def alcance(f):
        """RO si la fila pasa todos los filtros de la dinamica de su TIPO."""
        r = REGLAS.get(txt(f["TIPO"]))
        if r is None: return "(SIN TIPO)"
        falla_en = [c for c, x in r.items() if c not in ("Fecha de Tran", "TIPO") and clave(f[c]) not in x["ver"]]
        if not falla_en: return RO
        if "CONSIDERAR" in falla_en:
            a = txt(f["CONSIDERAR"]).upper() or "(SIN CONSIDERAR)"
            return ALC_IGUAL.get(a, a)
        if "Fase" in falla_en and txt(f["Fase"]) == "RM": return RM_PROPIA
        if "CENTRO" in falla_en: return OTRO_CENTRO
        return FUERA
    def en_fecha(f):
        r = REGLAS.get(txt(f["TIPO"]), REGLAS["PROPIO"])
        if r.get("Fecha de Tran"): return clave(f["Fecha de Tran"]) in r["Fecha de Tran"]["ver"]
        x = f["Fecha de Tran"]
        return x.year == ANIO and x.month == MES and x.day <= CORTE

    # ── equipos: todos los de la base, tengan gasto o no ───────────────
    equipos = collections.OrderedDict()
    for f in base:
        e = txt(f["Equipo"])
        if e in equipos: continue
        desc = txt(f["DESCRIPCION EQP"])
        equipos[e] = {"id": e, "sede": sede, "fam": familia_flota(desc), "tipo": txt(f["TIPO"]),
                      "mod": txt(f["MODELO"]), "marca": txt(f["MARCA"]), "prov": txt(f["PROVEEDOR"]),
                      "clasif": desc}
    for tipo, R in rep.items():
        for e in R["orden"]:
            if e not in equipos:
                print("OJO: %s esta en la hoja %s %s pero no en la base" % (e, sede, tipo))
                x = R["eq"][e]
                equipos[e] = {"id": e, "sede": sede, "fam": familia_flota(x["fam"]), "tipo": tipo, "mod": x["mod"],
                              "marca": "", "prov": "", "clasif": x["fam"]}

    # ── hechos: (equipo, alcance, recurso, fase, categoria, clase, dia) ──
    H = collections.defaultdict(float)
    ot_acc = {}
    fuera_corte = collections.Counter()
    sin_fecha = 0.0
    nlin = 0
    for f in base:
        fecha, costo = f["Fecha de Tran"], num(f["COSTO RYM"])
        if not isinstance(fecha, datetime.datetime):
            sin_fecha += costo                    # las filas de equipo sin gasto
            continue
        if not en_fecha(f):
            fuera_corte[txt(f["RECURSO"])] += costo
            continue
        dia = fecha.strftime("%Y-%m-%d")
        if dia not in idia: falla("%s: la fecha %s entra al reporte pero esta fuera del corte" % (sede, dia))
        e, fase = txt(f["Equipo"]), txt(f["Fase"])
        alc = alcance(f)
        rec = txt(f["RECURSO"])
        if rec not in DE_RECURSO: falla("%s: recurso desconocido en la base: «%s»" % (sede, rec))
        sap = ots_sap.get(f["OT"], {})
        cat = "SERVICIO DE TERCEROS" if rec == "SERV" else (txt(f[C_COD]) or "(SIN CATEGORÍA)")
        clase = txt(sap.get("Clase de orden")) or SIN_CLASE
        H[(e, alc, ROS.index(DE_RECURSO[rec]), FASES.get(fase, SIN_FASE), cat, clase, dia)] += costo
        nlin += 1
        if f["OT"]:
            o = ot_acc.setdefault(f["OT"], {"eq": e, "alc": alc, "txt": txt(f["Descripcion OT"]),
                                            "m": collections.Counter(), "sap": sap, "fase": fase, "rym": 0.0, "mov": 0.0})
            o["m"][dia] += costo
            o["mov" if rec == "MO" else "rym"] += costo

    # ── el cruce: RyM y MOV de la base contra la fila de cada equipo ───
    rym, mov = collections.Counter(), collections.Counter()
    for (e, alc, r, *_), v in H.items():
        if alc != RO: continue
        if r in (0, 1): rym[e] += v
        elif r == 2: mov[e] += v
    descuadre = []
    for tipo, R in rep.items():
        for e in R["orden"]:
            x = R["eq"][e]
            for k, a, b in (("RyM", rym.get(e, 0.0), x["c"][0]), ("MOV", mov.get(e, 0.0), x["c"][1])):
                if abs(a - b) >= 0.01: descuadre.append((tipo, e, k, round(b, 2), round(a, 2)))
        if equipos and True:
            for e in set(rym) | set(mov):
                if equipos.get(e, {}).get("tipo") == tipo and e not in R["eq"] and (abs(rym[e]) >= 0.01 or abs(mov[e]) >= 0.01):
                    descuadre.append((tipo, e, "no esta en la hoja", 0.0, round(rym[e] + mov[e], 2)))

    # ── horas por dia: el parte de SAP, escalado a lo que dice la hoja ──
    en_hoja = {}
    for tipo, R in rep.items():
        for e in R["orden"]: en_hoja[e] = R["eq"][e]
    meta_h = {e: (en_hoja[e]["hr"] if e in en_hoja else horom.get(e, 0.0)) for e in equipos}
    def dif_parte(p):
        return sum(abs(sum(h for d, h in p.get(e, {}).items() if d in idia) - t) for e, t in meta_h.items())
    parte, fuente_horas = (min(partes, key=lambda x: dif_parte(x[0])) if partes else ({}, "sin parte por día"))
    Hh = collections.defaultdict(float)
    sin_parte = []
    for e, tot in meta_h.items():
        if not tot: continue
        dd = {d: h for d, h in parte.get(e, {}).items() if d in idia and h}
        s = sum(dd.values())
        if not s:
            dd = {d: 1.0 for d in dias}          # sin parte por dia: se reparte parejo
            s = float(len(dias))
            sin_parte.append(e)
        for d, h in dd.items(): Hh[(e, d)] += h * tot / s

    # ── depreciacion por dia: la de la hoja, repartida por las horas ───
    for e, x in rep["PROPIO"]["eq"].items():
        dep = x["c"][2]
        if not dep: continue
        hd = {d: Hh.get((e, d), 0.0) for d in dias}
        s = sum(hd.values())
        if e in DEP_POR_DIAS or not s:
            hd, s = {d: 1.0 for d in dias}, float(len(dias))
        for d, h in hd.items():
            if h: H[(e, RO, 3, NO_MANT, "DEPRECIACIÓN", NO_MANT, d)] += dep * h / s

    # ── la fila de cada equipo, como la hoja ──────────────────────────
    filas = {}
    for tipo, R in rep.items():
        for e in R["orden"]:
            x = R["eq"][e]
            q = equipos[e]
            filas[e] = {"id": e, "sede": sede, "tipo": tipo, "fam": q["clasif"] or x["fam"], "mod": q["mod"] or x["mod"],
                        "prov": q["prov"], "c": x["c"], "v": x["v"], "seg": x["seg"], "hr": x["hr"],
                        "hrProf": x["hrProf"], "dm": x["dm"], "use": x["use"], "t": x["t"],
                        "A": {"c": x["Ac"], "h": x["Ah"], "v": x["Av"]},
                        "conTarifa": any(x["t"]) or any(x["v"]),
                        "porDias": e in (DEP_POR_DIAS if tipo == "PROPIO" else ALQ_POR_DIAS)}

    # ── cuadres de la hoja consigo misma: el Total contra sus equipos ──
    def suma_eq(R):
        xs = [R["eq"][e] for e in R["orden"]]
        s = lambda f: sum(f(x) for x in xs)
        return {"rym": s(lambda x: x["c"][0]), "mov": s(lambda x: x["c"][1]), "terc": s(lambda x: x["c"][2]),
                "seg": s(lambda x: x["seg"]), "hr": s(lambda x: x["hr"]), "nEq": len(xs),
                "venta": s(lambda x: x["v"][3]), "hrProf": s(lambda x: x["hrProf"])}
    def total_hoja(R):
        t = R["total"]
        return {"rym": t["c"][0], "mov": t["c"][1], "terc": t["c"][2], "seg": t["seg"], "hr": t["hr"],
                "nEq": t["nEq"], "venta": t["v"][3], "hrProf": t["hrProf"]}
    def recalc(tipo):
        es = rep[tipo]["orden"]
        return {"rym": sum(rym.get(e, 0.0) for e in es), "mov": sum(mov.get(e, 0.0) for e in es)}
    r2 = lambda d: {k: round(v, 2) for k, v in d.items()}
    val = {"sede": sede, "libro": os.path.basename(LIBRO), "hoja": hoja_base[0], "corte": CORTE,
           "corteDe": corte_de, "diasMes": DIAS_MES, "mes": MES, "anio": ANIO,
           "fechaMaxBase": fecha_max.strftime("%Y-%m-%d"),
           "hojas": {"PROPIO": H_PROP, "ALQUILADO": H_ALQ},
           "reglas": {t: {c: x["ver"] for c, x in r.items() if c != "Fecha de Tran"} for t, r in REGLAS.items()},
           "reglasFuera": {t: {c: x["ocultos"] for c, x in r.items() if c != "Fecha de Tran"} for t, r in REGLAS.items()},
           "fuenteHoras": fuente_horas, "alqPorDias": list(ALQ_POR_DIAS), "depPorDias": list(DEP_POR_DIAS),
           "propio": {"hoja": r2(total_hoja(rep["PROPIO"])), "equipos": r2(suma_eq(rep["PROPIO"])), "calc": r2(recalc("PROPIO"))},
           "alquilado": {"hoja": r2(total_hoja(rep["ALQUILADO"])), "equipos": r2(suma_eq(rep["ALQUILADO"])), "calc": r2(recalc("ALQUILADO"))},
           "acumPeriodos": sorted(periodos), "fueraCorte": r2(fuera_corte), "sinFecha": round(sin_fecha, 2),
           "sinTarifa": sum(1 for x in filas.values() if not x["conTarifa"]),
           "sinHoras": sum(1 for x in filas.values() if not x["hr"]),
           "sinDM": sum(1 for x in filas.values() if x["dm"] is None),
           "sinParte": len(sin_parte), "serviciosFueraBase": zserv, "descuadre": descuadre[:40]}

    return {"sede": sede, "libro": nombre_libro, "hojaBase": hoja_base[0], "dias": dias, "anio": ANIO, "mes": MES,
            "corte": CORTE, "diasMes": DIAS_MES, "equipos": equipos, "H": H, "Hh": Hh, "ots": ot_acc,
            "filas": filas, "rep": rep, "val": val, "nlin": nlin, "periodos": periodos, "descuadre": descuadre}


# ── principal ─────────────────────────────────────────────────────────
def main():
    libros = elegir_libros()
    P = [leer_proyecto(s, l) for s, l in libros]
    sedes = [p["sede"] for p in P]

    # ── un solo calendario: el mes de todos, hasta el corte mas tardio ──
    meses = {(p["anio"], p["mes"]) for p in P}
    if len(meses) > 1: falla("los libros son de meses distintos: %s" % {p["sede"]: (p["anio"], p["mes"]) for p in P})
    ANIO, MES = meses.pop()
    CORTE = max(p["corte"] for p in P)
    DIAS_MES = P[0]["diasMes"]
    dias = ["%04d-%02d-%02d" % (ANIO, MES, d) for d in range(1, CORTE + 1)]
    idia = {d: i for i, d in enumerate(dias)}
    ND = len(dias)

    # ── vocabularios y equipos de todos los proyectos ─────────────────
    equipos, ieq = [], {}
    for p in P:
        for e, q in p["equipos"].items():
            if e in ieq: falla("el equipo %s esta en dos proyectos (%s y %s)" % (e, equipos[ieq[e]]["sede"], p["sede"]))
            ieq[e] = len(equipos)
            equipos.append(dict(q, proys=[], sys=[], ots=[]))
    cecos = list(FASES.values()) + [SIN_FASE, NO_MANT]
    cuentas, gastos = [], ["PM01", "PM02", "PM03", SIN_CLASE, NO_MANT]
    def idx(lista, v):
        if v not in lista: lista.append(v)
        return lista.index(v)
    # el resultado operativo primero; un alcance sin importe no se ofrece
    con = collections.Counter()
    for p in P:
        for k, v in p["H"].items():
            if abs(v) >= 0.005: con[k[1]] += 1
    rango = lambda a: ORDEN_ALC.index(a) if a in ORDEN_ALC else len(ORDEN_ALC)
    alcances = sorted(set(con) | {RO}, key=lambda a: (rango(a), a))

    H = collections.defaultdict(float)
    for p in P:
        for (e, alc, r, ceco, cat, clase, d), v in p["H"].items():
            H[(ieq[e], alcances.index(alc), r, idx(cecos, ceco), idx(cuentas, cat), idx(gastos, clase), idia[d])] += v
    F = {k: [] for k in "eprcugmv"}
    for (e, pp, r, c, u, g, m), v in sorted(H.items()):
        if abs(v) < 0.005: continue
        for k, x in zip("eprcugm", (e, pp, r, c, u, g, m)): F[k].append(x)
        F["v"].append(round(v, 2))
    Hh = collections.defaultdict(float)
    for p in P:
        for (e, d), h in p["Hh"].items(): Hh[(ieq[e], idia[d])] += h
    HM = {k: [] for k in "epmv"}
    for (e, m), v in sorted(Hh.items()):
        if abs(v) < 0.005: continue
        HM["e"].append(e); HM["p"].append(0); HM["m"].append(m); HM["v"].append(round(v, 2))

    por = {n: collections.Counter() for n in ("proy", "ro", "ceco", "cuenta", "gasto", "sede")}
    alc_eq = collections.defaultdict(set)
    for e, pp, r, c, u, g, v in zip(F["e"], F["p"], F["r"], F["c"], F["u"], F["g"], F["v"]):
        por["proy"][alcances[pp]] += v; por["ro"][ROS[r]] += v; por["ceco"][cecos[c]] += v
        por["cuenta"][cuentas[u]] += v; por["gasto"][gastos[g]] += v
        if pp == 0: por["sede"][equipos[e]["sede"]] += v
        alc_eq[e].add(alcances[pp])
    for e in HM["e"]: alc_eq[e].add(RO)
    for i, q in enumerate(equipos):
        q["proys"] = [a for a in alcances if a in alc_eq[i]] or [RO]

    # ── ordenes y conjuntos ────────────────────────────────────────────
    sysdesc, ots = {}, []
    sis_eq = collections.defaultdict(lambda: collections.defaultdict(lambda: [0.0] * ND))
    ots_eq = collections.defaultdict(list)
    for p in P:
        for ot, o in p["ots"].items():
            m = [o["m"].get(d, 0.0) for d in dias]
            v = sum(m)
            cj = txt(o["sap"].get("Conjunto"))
            if cj: sysdesc[cj] = txt(o["sap"].get("Denom.conjunto")) or cj
            mi = next((i for i, x in enumerate(m) if x), 0)
            reg = {"ot": str(ot), "eq": o["eq"], "s": p["sede"], "txt": o["txt"] or txt(o["sap"].get("Texto breve")) or "-",
                   "sis": cj, "pm": txt(o["sap"].get("Clase de orden")) or "-", "v": round(v),
                   "d": "%02d/%02d/%02d" % (mi + 1, MES, ANIO % 100), "mi": mi, "f": "C", "p": o["alc"]}
            ots.append(reg)
            equipos[ieq[o["eq"]]]["ots"].append(reg)
            if cj and o["alc"] == RO:
                for i, x in enumerate(m): sis_eq[o["eq"]][cj][i] += x
            # las ordenes de cada equipo dentro del resultado operativo: [orden, fase, texto, RyM, MOV]
            if o["alc"] == RO and (abs(o["rym"]) >= 0.005 or abs(o["mov"]) >= 0.005):
                ots_eq[o["eq"]].append([str(ot), o["fase"], o["txt"] or "-", round(o["rym"], 2), round(o["mov"], 2)])
    ots.sort(key=lambda o: -o["v"])
    for e in ots_eq: ots_eq[e].sort(key=lambda r: -(r[3] + r[4]))
    for e, d in sis_eq.items():
        equipos[ieq[e]]["sys"] = sorted(
            ({"c": c, "n": sysdesc.get(c, c), "v": round(sum(m), 2), "m": [round(x, 2) for x in m]}
             for c, m in d.items() if any(m)), key=lambda s: -s["v"])

    # ── la fila de cada equipo (de su hoja) y los modelos ──────────────
    por_eq = [x for p in P for x in p["filas"].values()]
    def tri(a, b, c, prop, hr):
        if not hr: return {"a": 0.0, "b": 0.0, "c": 0.0, "tot": 0.0}
        return {"a": a / hr, "b": b / hr, "c": c / hr, "tot": (a + b + (c if prop else 0.0)) / hr}
    grupos = collections.OrderedDict()
    for x in por_eq: grupos.setdefault((x["tipo"], x["fam"], x["mod"]), []).append(x)
    modelos = []
    for (tipo, fam, mod), xs in grupos.items():
        prop = tipo == "PROPIO"
        s = lambda f: sum(f(x) for x in xs)
        hr = s(lambda x: x["hr"])
        dms = [x["dm"] for x in xs if x["dm"] is not None]
        uss = [x["use"] for x in xs if x["use"] is not None]
        ca, cb, cc = s(lambda x: x["c"][0]), s(lambda x: x["c"][1]), s(lambda x: x["c"][2])
        va, vb, vc = s(lambda x: x["v"][0]), s(lambda x: x["v"][1]), s(lambda x: x["v"][2])
        m = {"fam": fam, "mod": mod, "tipo": tipo, "nEq": len(xs), "sedes": sorted({x["sede"] for x in xs}),
             "costo": {"a": ca, "b": cb, "c": cc, "seg": s(lambda x: x["seg"]), "tot": s(lambda x: x["c"][3])},
             "costoProf": 0.0, "dm": sum(dms) / len(dms) if dms else 0.0, "use": sum(uss) / len(uss) if uss else 0.0,
             "hr": hr, "hrProf": s(lambda x: x["hrProf"]),
             "venta": {"a": va, "b": vb, "c": vc, "tot": s(lambda x: x["v"][3])},
             "tReal": tri(ca, cb, cc, prop, hr), "tProy": tri(va, vb, vc, prop, hr), "famT": familia_flota(fam)}
        m["dTar"] = (m["tReal"]["tot"] - m["tProy"]["tot"]) if m["tProy"]["tot"] else None
        modelos.append(m)
    tot = {"costo": sum(m["costo"]["tot"] for m in modelos), "hr": sum(m["hr"] for m in modelos),
           "hrProf": sum(m["hrProf"] for m in modelos), "venta": sum(m["venta"]["tot"] for m in modelos),
           "nEq": sum(m["nEq"] for m in modelos)}
    tot["tReal"] = tot["costo"] / tot["hr"] if tot["hr"] else 0
    tot["tProy"] = tot["venta"] / tot["hr"] if tot["hr"] else 0
    con_t = [m for m in modelos if m["tProy"]["tot"] > 0 and m["hr"] > 0]
    con_dm = [m for m in modelos if m["dm"] > 0]
    h_dm = sum(m["hr"] for m in con_dm)
    r2v = lambda xs: [round(v, 2) for v in xs]
    eqs = {}
    for x in por_eq:
        hr = x["hr"]
        eqs[x["id"]] = {"sede": x["sede"], "dm": x["dm"], "use": x["use"], "hr": round(hr, 2),
                        "hrProf": round(x["hrProf"], 2),
                        "tReal": round(x["c"][3] / hr, 2) if hr else None,
                        "tProy": round(x["v"][3] / hr, 2) if hr and x["v"][3] else None,
                        "conTarifa": x["conTarifa"],
                        # la fila completa del equipo, para las hojas Propios y Alquilados:
                        # c = costo real, v = venta interna, cada uno [RyM, MOV, Dep o Alq, total]
                        "fam": x["fam"], "mod": x["mod"], "tipo": x["tipo"], "prov": x["prov"],
                        "c": r2v(x["c"]), "v": r2v(x["v"]),
                        # acumulado: c = [RyM, MOV, Dep o Alq, Seg, costo], h = horas, v = venta
                        "A": {"c": r2v(x["A"]["c"]), "h": round(x["A"]["h"], 2), "v": r2v(x["A"]["v"])}}
        if x["porDias"]: eqs[x["id"]]["porDias"] = True
    periodos = sorted(set().union(*[p["periodos"] for p in P]))
    MESES = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SETIEMBRE",
             "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"]
    setiembre = {
        "mes": "%04d-%02d" % (ANIO, MES), "rotulo": "%s %d" % (MESES[MES - 1], ANIO), "corte": "al día %d" % CORTE,
        "sede": " · ".join(sedes), "sedes": sedes, "sedeNom": {s: NOM_SEDE.get(s, s) for s in sedes},
        "corteSede": {p["sede"]: p["corte"] for p in P},
        "corteDia": CORTE, "diasMes": DIAS_MES,
        "fuente": " + ".join(p["libro"] for p in P) + " · filas de las hojas PROP y ALQ",
        "nModelos": len(modelos), "nProp": sum(1 for m in modelos if m["tipo"] == "PROPIO"),
        "nAlq": sum(1 for m in modelos if m["tipo"] == "ALQUILADO"),
        "nConTarifa": len(con_t), "nCumplen": sum(1 for m in con_t if m["tReal"]["tot"] <= m["tProy"]["tot"]),
        "nConDM": len(con_dm),
        "dm": sum(m["dm"] * m["hr"] for m in con_dm) / h_dm if h_dm else 0,
        "use": sum(m["use"] * m["hr"] for m in con_dm) / h_dm if h_dm else 0,
        "total": tot, "modelos": modelos, "eq": eqs, "ots": ots_eq,
        "acumPeriodos": periodos, "acumIncluyeMes": MES in periodos,
        "alqPorDias": [e for p in P for e in p["val"]["alqPorDias"]],
        "depPorDias": [e for p in P for e in p["val"]["depPorDias"]]}

    # ── validacion: la de cada proyecto, y la suma para lo que lee la Ficha ──
    vs = {p["sede"]: p["val"] for p in P}
    def suma_val(tipo):
        out = {"hoja": collections.Counter(), "calc": collections.Counter()}
        for v in vs.values():
            out["hoja"].update(v[tipo]["hoja"]); out["calc"].update(v[tipo]["calc"])
        # lo que la Ficha compara: RyM y MOV de la base contra la hoja
        return {"hoja": {k: round(x, 2) for k, x in out["hoja"].items()},
                "calc": dict({k: round(x, 2) for k, x in out["hoja"].items()},
                             **{k: round(x, 2) for k, x in out["calc"].items()})}
    fuera = collections.Counter()
    for v in vs.values(): fuera.update(v["fueraCorte"])
    val = {"libro": " + ".join(v["libro"] for v in vs.values()),
           "hoja": " · ".join("%s: %s" % (s, v["hoja"]) for s, v in vs.items()),
           "corte": CORTE, "diasMes": DIAS_MES, "mes": MES, "anio": ANIO,
           "fechaMaxBase": max(v["fechaMaxBase"] for v in vs.values()),
           "generado": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
           "sedes": vs, "sedeNom": {s: NOM_SEDE.get(s, s) for s in sedes},
           # como antes, las reglas de un proyecto en la raiz (las de Shougang si esta)
           "reglas": vs[sedes[0]]["reglas"], "reglasFuera": vs[sedes[0]]["reglasFuera"],
           "fuenteHoras": " · ".join(sorted({v["fuenteHoras"] for v in vs.values()})),
           "alqPorDias": setiembre["alqPorDias"], "depPorDias": setiembre["depPorDias"],
           "propio": suma_val("propio"), "alquilado": suma_val("alquilado"),
           "acumPeriodos": periodos, "fueraCorte": {k: round(x, 2) for k, x in fuera.items()},
           "sinFecha": round(sum(v["sinFecha"] for v in vs.values()), 2),
           "sinTarifa": sum(v["sinTarifa"] for v in vs.values()),
           "sinHoras": sum(v["sinHoras"] for v in vs.values()),
           "sinDM": sum(v["sinDM"] for v in vs.values()),
           "parteTarifa": round(por["proy"].get("PARTE DE LA TARIFA", 0.0), 2),
           "serviciosFueraBase": vs.get("SHGN", {}).get("serviciosFueraBase")}

    total = round(sum(F["v"]), 2)
    hm = round(sum(HM["v"]), 2)
    meta = {"fuente": " + ".join(p["libro"] for p in P) + " · recalculado",
            "desde": dias[0], "hasta": dias[-1], "total": total, "hm": hm, "cph": round(total / hm, 1) if hm else 0,
            "nEq": len(equipos), "nEqCosto": len(set(F["e"])), "nLin": sum(p["nlin"] for p in P), "nOT": len(ots),
            "nHechos": len(F["v"]), "nEqDet": sum(1 for q in equipos if q["sys"]), "nSis": len(sysdesc),
            "proyDetalle": RO, "sinCeco": SIN_FASE,
            "porProy": {a: {"v": round(por["proy"][a], 2)} for a in alcances},
            "porRO": {k: round(v, 2) for k, v in por["ro"].items()},
            "porCeco": {k: round(v, 2) for k, v in por["ceco"].items()},
            "porCuenta": {k: round(v, 2) for k, v in por["cuenta"].items()},
            "porGasto": {k: round(v, 2) for k, v in por["gasto"].items()},
            "porSede": {k: round(v, 2) for k, v in por["sede"].items()},
            "val": val}
    datos = {"meta": meta, "meses": dias, "proys": alcances, "ros": ROS, "cecos": cecos, "cuentas": cuentas,
             "gastos": gastos, "equipos": equipos, "F": F, "H": HM, "ots": ots, "sysdesc": sysdesc,
             "sedes": sedes, "sedeNom": {s: NOM_SEDE.get(s, s) for s in sedes}}

    def graba(nombre, obj):
        io.open(os.path.join(AQUI, nombre), "w", encoding="utf8").write(
            json.dumps(obj, ensure_ascii=False, separators=(",", ":")))
        print("  ->", nombre, os.path.getsize(os.path.join(AQUI, nombre)), "bytes")

    # ── lo que hay que mirar ───────────────────────────────────────────
    ok = True
    for p in P:
        v = p["val"]
        print("\n== %s · %s · base %s · corte día %d (%s)" % (p["sede"], v["libro"], v["hoja"], v["corte"], v["corteDe"]))
        print("   reglas:", {t: r for t, r in v["reglas"].items()})
        print("   horas de: %s · sin parte por día: %d equipos · prorrateo por días: dep %s alq %s"
              % (v["fuenteHoras"], v["sinParte"], v["depPorDias"], v["alqPorDias"]))
        print("   %-10s %-8s %15s %15s %15s" % ("", "", "fila Total", "suma equipos", "base recalc."))
        for tipo, k in (("PROPIO", "propio"), ("ALQUILADO", "alquilado")):
            h, s, c = v[k]["hoja"], v[k]["equipos"], v[k]["calc"]
            for kk, et in (("rym", "RYM"), ("mov", "MOV"), ("terc", "Dep/Alq"), ("seg", "Seg"), ("hr", "horas"),
                           ("hrProf", "h prof"), ("venta", "venta"), ("nEq", "equipos")):
                print("   %-10s %-8s %15.2f %15.2f %15s%s" % (tipo if kk == "rym" else "", et, h[kk], s[kk],
                      "%.2f" % c[kk] if kk in c else "", "   <-- DIFIERE" if abs(h[kk] - s[kk]) >= 0.01 and kk != "nEq"
                      else ""))
        if p["descuadre"]:
            ok = False
            print("   DESCUADRE base contra hoja (equipo, hoja, base):")
            for d in p["descuadre"][:25]: print("     ", d)
        else:
            print("   RyM y MOV de la base cuadran con la hoja, equipo por equipo: OK")
    print("\nalcances:", {a: round(por["proy"][a]) for a in alcances})
    print("resultado operativo por proyecto:", {k: round(x) for k, x in por["sede"].items()})
    print("dias %s a %s · hechos %d · equipos %d · ordenes %d · horas %.1f" % (dias[0], dias[-1], len(F["v"]), len(equipos), len(ots), hm))
    graba("datos.json", datos); graba("setiembre.json", setiembre)
    io.open(os.path.join(AQUI, "validacion.json"), "w", encoding="utf8").write(json.dumps(val, ensure_ascii=False, indent=1))
    if not ok:
        print("\nHAY DESCUADRES: revisar antes de publicar")
        sys.exit(1)


if __name__ == "__main__":
    main()
