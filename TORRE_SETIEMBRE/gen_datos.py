# -*- coding: utf-8 -*-
"""Datos de la Torre de Setiembre, desde el consolidado 0 SHGN_RO EQUIPOS.

Lee el .xlsx directamente (no hace falta tenerlo abierto en Excel) y escribe:

  datos.json       la misma forma que tarifas.json de la Torre original, para
                   que el mismo frontend lo recorra: una tabla de hechos plana
                   con el dia en el sitio del mes.
  setiembre.json   tarifa real contra tarifa de venta, DM y usaje, por modelo
                   y por equipo.
  validacion.json  los cuadres contra las hojas SHGN PROP y SHGN ALQ.

EL LIBRO: el mas reciente de CONSOLIDADO\\0 SHGN_RO EQUIPOS*.xlsx, o el que se
pase como argumento.

SE RECALCULA DESDE «BASE DATOS», no se copian las cifras de SHGN PROP / ALQ.
Las dos hojas de reporte son dinamicas sobre esa base; el script lee de ELLAS
MISMAS las reglas (los filtros de cada dinamica) y las aplica a la base, asi
que si Maria cambia un filtro la torre lo sigue sin tocar el codigo:

  corte        el ultimo dia visible del filtro «Fecha de Tran».
  alcance      una fila entra al resultado operativo si pasa todos los filtros
               de la dinamica de su TIPO (PROPIO -> SHGN PROP, ALQUILADO ->
               SHGN ALQ). Lo que no pasa no se tira: viaja en su propio
               alcance (CAPEX, PASAR A VENTA, PARTE DE LA TARIFA...) y se
               puede elegir en la pagina.
  RYM          MAT + SERV.   MOV = MO.
  horas        HM real del bloque HOROMETRO REAL de BASE VARIOS; el reparto
               por dia sale del cache de esa dinamica.
  depreciacion tarifa de depreciacion de la proforma x horas reales; los
               equipos que la formula de la columna Dep nombra van
               prorrateados por dias (importe del mes / dias del mes x corte).
  alquiler     como el Excel: tarifa DEP/ALQ del bloque TARIFAS VENTA x horas
               reales, con los equipos que nombra la formula de la columna Alq
               prorrateados por dias. Es la tarifa de VENTA, no un costo real:
               la pagina lo muestra marcado asi y no lo suma al costo.
  venta        tarifa de venta del equipo x horas reales.
  acumulado    lo que el bloque ACUMULADO 2026 de BASE VARIOS trae del libro
               mayor (los periodos que tenga) MAS el mes en curso, igual para
               todos los equipos. Aqui el Excel no es parejo y por eso no se
               copia: en SHGN PROP unas filas suman el mes y otras no, la
               venta acumulada cuenta el mes dos veces, y en SHGN ALQ el
               alquiler busca el equipo de nueve filas mas abajo. La
               diferencia queda en validacion.json.

Las columnas se buscan POR NOMBRE DE ENCABEZADO. Si falta una, el script se
detiene: mejor eso que un numero corrido sin aviso.

    cd ...\\MARIA\\TORRE_SETIEMBRE
    python gen_datos.py  [ruta\\al\\libro.xlsx]
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

# si la formula de la columna Dep / Alq no se puede leer, se usan estos
DEP_POR_DIAS_DEF = ("EP-40", "EP-41")
ALQ_POR_DIAS_DEF = ()

RO = "RESULTADO OPERATIVO"
RM_PROPIA = "REPARACIÓN MAYOR PROPIA"
FUERA = "FUERA DEL REPORTE"
ORDEN_ALC = [RO, "CAPEX", "PROCESO CAPEX", "PASAR A VENTA", "PARTE DE LA TARIFA", RM_PROPIA]
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
CAMPOS_HORAS = (("Número de equipo", "Fecha de notificación", "HM"), ("Codigo", "FECHA", "HORAS OPERATIVAS"))

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
NR = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"


def falla(msg):
    sys.exit("\nNO SE PUEDE SEGUIR: " + msg)


def num(x):
    return float(x) if isinstance(x, (int, float)) and not isinstance(x, bool) else 0.0


def txt(x):
    return "" if x is None else str(x).strip()


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


def elegir_libro():
    if len(sys.argv) > 1:
        return os.path.abspath(sys.argv[1])
    xs = [p for p in glob.glob(os.path.join(CONSOLIDADO, "0 SHGN_RO EQUIPOS*.xlsx"))
          if not os.path.basename(p).startswith("~$")]
    if not xs: falla("no hay ningun «0 SHGN_RO EQUIPOS*.xlsx» en " + CONSOLIDADO)
    return max(xs, key=os.path.getmtime)


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
    # celdas sueltas (EP-40 en T1) que no son el comienzo de ningun bloque
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


def horas_por_dia(z):
    """Horas por equipo y dia. BASE VARIOS solo ensena el total por equipo,
    pero la dinamica guarda en su cache el parte completo."""
    for d in sorted(n for n in z.namelist() if n.startswith("xl/pivotCache/pivotCacheDefinition")):
        c = cache(z, d)
        for trio in CAMPOS_HORAS:
            if all(x in c["campos"] for x in trio): break
        else:
            continue
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
        return out, c["externo"] or c["hoja"] or "cache de la dinamica"
    falla("no encuentro en el libro el cache del parte de horas (campos %s)." % " o ".join("/".join(t) for t in CAMPOS_HORAS))


# ── principal ─────────────────────────────────────────────────────────
def main():
    LIBRO = elegir_libro()
    if not os.path.exists(LIBRO):
        falla("no existe " + LIBRO)
    nombre_libro = os.path.splitext(os.path.basename(LIBRO))[0]
    # se trabaja sobre una copia: copiar funciona aunque el libro este abierto
    tmp = os.path.join(tempfile.mkdtemp(prefix="torre_set_"), "consolidado.xlsx")
    shutil.copy2(LIBRO, tmp)
    print("leyendo", os.path.basename(LIBRO), "...")
    z = zipfile.ZipFile(tmp)

    # ── las reglas, de las dinamicas de las hojas de reporte ───────────
    REGLAS, fuentes = {}, {}
    for tipo, hoja in (("PROPIO", "SHGN PROP"), ("ALQUILADO", "SHGN ALQ")):
        REGLAS[tipo], fuentes[tipo] = reglas_dinamica(z, hoja)
    fechas = {}
    for tipo, r in REGLAS.items():
        ft = r.get("Fecha de Tran")
        if not ft: falla("la dinamica de %s no filtra «Fecha de Tran»: no se puede saber el corte" % tipo)
        fechas[tipo] = sorted(v for v in ft["ver"] if v != VACIO)
    if fechas["PROPIO"][-1] != fechas["ALQUILADO"][-1]:
        falla("las dos dinamicas tienen distinto corte: %s y %s" % (fechas["PROPIO"][-1], fechas["ALQUILADO"][-1]))
    ult = datetime.datetime.strptime(fechas["PROPIO"][-1][:10], "%Y-%m-%d")
    ANIO, MES, CORTE = ult.year, ult.month, ult.day
    DIAS_MES = calendar.monthrange(ANIO, MES)[1]
    dias = ["%04d-%02d-%02d" % (ANIO, MES, d) for d in range(1, CORTE + 1)]
    for tipo in REGLAS:
        faltan = [d for d in dias if d + "T00:00:00" not in REGLAS[tipo]["Fecha de Tran"]["ver"]]
        if faltan: print("OJO: la dinamica de %s deja fuera dias antes del corte: %s" % (tipo, faltan))
    DEP_POR_DIAS = equipos_en_formula(z, "SHGN PROP", "N") or DEP_POR_DIAS_DEF
    ALQ_POR_DIAS = equipos_en_formula(z, "SHGN ALQ", "N") or ALQ_POR_DIAS_DEF
    diario, fuente_horas = horas_por_dia(z)
    z.close()

    wb = openpyxl.load_workbook(tmp, read_only=True, data_only=True)
    hoja_base = [n for n in wb.sheetnames if n.upper().startswith("BASE DATOS")]
    if len(hoja_base) != 1:
        falla("esperaba una sola hoja «BASE DATOS dd.mm»; hay %s" % hoja_base)
    for tipo, h in fuentes.items():
        if h and h != hoja_base[0]:
            print("OJO: la dinamica de %s apunta a «%s», no a «%s»" % (tipo, h, hoja_base[0]))
    for n in ("BASE OTS", "BASE VARIOS", "BASE MASTER", "SHGN PROP", "SHGN ALQ"):
        if n not in wb.sheetnames: falla("falta la hoja «%s»" % n)

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
    hb = bloque(fv, "HOROMETRO REAL", [["Número de equipo", "Codigo"], ["Suma de HM", "Suma de HORAS OPERATIVAS"]])
    horom = {e: num(f["Suma de HM"]) for e, f in primero(hb, "Número de equipo").items() if e != "Total general"}
    tarifa = {e: (num(f["RyM"]), num(f["MOV"]), num(f["DEP/ALQ"]))
              for e, f in primero(bloque(fv, "TARIFAS VENTA", ["EQP", "RyM", "MOV", "DEP/ALQ"]), "EQP").items()}
    prof = primero(bloque(fv, "PROFORMA", ["Equipo", "HM", "Tarifa Dep", "Tarif Alq"]), "Equipo")
    dmuse = primero(bloque(fv, "DM-USAJE", ["EQP", "DM", "USAJE"]), "EQP")
    libro_ac = collections.defaultdict(collections.Counter)
    periodos = set()
    for f in bloque(fv, "ACUMULADO 2026", ["Asignación", "Período", "HM", "RYM", "FIJO", "DEP", "ALQ", "SEG/OTR"]):
        e = txt(f["Asignación"])
        if not e or txt(f["Período"]) == "": continue
        try: periodos.add(int(float(txt(f["Período"]))))
        except ValueError: continue
        for k in ("HM", "RYM", "FIJO", "DEP", "ALQ", "SEG/OTR"): libro_ac[e][k] += num(f[k])
    fp, fa = filas_de(wb["SHGN PROP"]), filas_de(wb["SHGN ALQ"])
    # servicios conformados en Z SERV que no llegaron a la base (informativo)
    zserv = None
    if "Z SERV" in wb.sheetnames:
        zf = filas_de(wb["Z SERV"])
        enc = [txt(c) for c in zf[0]]
        need = ("CECO", "COSTO", "Codigo de la orden de Trabajo", "Id de la Orden de Servicio")
        if all(n in enc for n in need):
            ots_os = {(clave(f["OT"]), clave(f[C_OS])) for f in base if txt(f["RECURSO"]) == "SERV"}
            falt = [f for f in tabla(zf, 0, list(need), "Z SERV")
                    if txt(f["CECO"]).endswith("SHEP") and num(f["COSTO"])
                    and (clave(f["Codigo de la orden de Trabajo"]), clave(f["Id de la Orden de Servicio"])) not in ots_os]
            zserv = {"n": len(falt), "v": round(sum(num(f["COSTO"]) for f in falt), 2)}
    wb.close()
    shutil.rmtree(os.path.dirname(tmp), ignore_errors=True)

    idia = {d: i for i, d in enumerate(dias)}
    ND = len(dias)
    fechas_base = [f["Fecha de Tran"] for f in base if isinstance(f["Fecha de Tran"], datetime.datetime)]
    fecha_max = max(fechas_base).strftime("%Y-%m-%d") if fechas_base else None

    def alcance(f):
        """RO si la fila pasa todos los filtros de la dinamica de su TIPO."""
        r = REGLAS.get(txt(f["TIPO"]))
        if r is None: return "(SIN TIPO)"
        falla_en = [c for c, x in r.items() if c not in ("Fecha de Tran", "TIPO") and clave(f[c]) not in x["ver"]]
        if not falla_en: return RO
        if "CONSIDERAR" in falla_en: return txt(f["CONSIDERAR"]).upper() or "(SIN CONSIDERAR)"
        if "Fase" in falla_en and txt(f["Fase"]) == "RM": return RM_PROPIA
        return FUERA
    def en_fecha(f):
        return clave(f["Fecha de Tran"]) in REGLAS.get(txt(f["TIPO"]), REGLAS["PROPIO"])["Fecha de Tran"]["ver"]

    # ── equipos: todos los de la base, tengan gasto o no ───────────────
    equipos, ieq = [], {}
    for f in base:
        e = txt(f["Equipo"])
        if e in ieq: continue
        desc = txt(f["DESCRIPCION EQP"])
        ieq[e] = len(equipos)
        equipos.append({"id": e, "fam": familia_flota(desc), "tipo": txt(f["TIPO"]), "mod": txt(f["MODELO"]),
                        "marca": txt(f["MARCA"]), "prov": txt(f["PROVEEDOR"]), "clasif": desc,
                        "proys": [], "sys": [], "ots": []})

    # ── hechos ─────────────────────────────────────────────────────────
    cecos = list(FASES.values()) + [SIN_FASE, NO_MANT]
    cuentas, gastos = [], ["PM01", "PM02", "PM03", SIN_CLASE, NO_MANT]
    alcs = [RO]
    def idx(lista, v):
        if v not in lista: lista.append(v)
        return lista.index(v)

    H = collections.defaultdict(float)          # (e,p,r,c,u,g,m) -> US$
    ot_acc = {}                                  # ot -> acumulado
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
        if dia not in idia: falla("la fecha %s entra al reporte pero esta fuera del mes" % dia)
        e, fase = txt(f["Equipo"]), txt(f["Fase"])
        alc = alcance(f)
        rec = txt(f["RECURSO"])
        if rec not in DE_RECURSO: falla("recurso desconocido en la base: «%s»" % rec)
        sap = ots_sap.get(f["OT"], {})
        cat = "SERVICIO DE TERCEROS" if rec == "SERV" else (txt(f[C_COD]) or "(SIN CATEGORÍA)")
        clase = txt(sap.get("Clase de orden")) or SIN_CLASE
        m = idia[dia]
        k = (ieq[e], idx(alcs, alc), ROS.index(DE_RECURSO[rec]), idx(cecos, FASES.get(fase, SIN_FASE)),
             idx(cuentas, cat), idx(gastos, clase), m)
        H[k] += costo
        nlin += 1
        if f["OT"]:
            o = ot_acc.setdefault(f["OT"], {"eq": e, "alc": alc, "txt": txt(f["Descripcion OT"]),
                                            "m": [0.0] * ND, "sap": sap, "fase": fase, "rym": 0.0, "mov": 0.0})
            o["m"][m] += costo
            o["mov" if rec == "MO" else "rym"] += costo

    # ── horas por dia, y con ellas la depreciacion de los propios ──────
    Hh = collections.defaultdict(float)          # (e, m) -> horas
    hm_eq = {}
    descuadre_h = []
    for e, i in ieq.items():
        tot = horom.get(e, 0.0)
        hm_eq[e] = tot
        dd = {d: h for d, h in diario.get(e, {}).items() if d in idia}
        s = sum(dd.values())
        if abs(s - tot) > 0.05: descuadre_h.append((e, round(tot, 2), round(s, 2)))
        if tot and not s:
            dd = {d: tot / ND for d in dias}     # sin parte por dia: se reparte parejo
        elif s and abs(s - tot) > 0.05:
            dd = {d: h * tot / s for d, h in dd.items()}
        for d, h in dd.items():
            if h: Hh[(i, idia[d])] += h
    horas_fuera = {e: h for e, h in horom.items() if h and e not in ieq}

    iu_dep, ig_no, ic_no = idx(cuentas, "DEPRECIACIÓN"), gastos.index(NO_MANT), cecos.index(NO_MANT)
    dep_eq, alq_eq = {}, {}
    for e, i in ieq.items():
        if equipos[i]["tipo"] == "PROPIO":
            p = prof.get(e)
            t = num(p["Tarifa Dep"]) if p else 0.0
            if e in DEP_POR_DIAS:
                dep_eq[e] = t / DIAS_MES * CORTE
                for m in range(ND): H[(i, 0, 3, ic_no, iu_dep, ig_no, m)] += t / DIAS_MES
            else:
                dep_eq[e] = t * hm_eq[e]
                for m in range(ND):
                    h = Hh.get((i, m), 0.0)
                    if h and t: H[(i, 0, 3, ic_no, iu_dep, ig_no, m)] += t * h
        else:
            # como el Excel: la tarifa DEP/ALQ de TARIFAS VENTA (es de venta)
            t = tarifa.get(e, (0.0, 0.0, 0.0))[2]
            alq_eq[e] = t / DIAS_MES * CORTE if e in ALQ_POR_DIAS else t * hm_eq[e]

    # un alcance sin ningun importe no se ofrece como opcion en la pagina
    # (el resultado operativo es el indice 0 y siempre queda); el resto en
    # un orden fijo
    con = {k[1] for k, v in H.items() if abs(v) >= 0.005} | {0}
    rango = lambda a: ORDEN_ALC.index(a) if a in ORDEN_ALC else len(ORDEN_ALC)
    usados = sorted(con, key=lambda i: (rango(alcs[i]), alcs[i]))
    alcances = [alcs[i] for i in usados]
    H = {(e, usados.index(p), r, c, u, g, m): v for (e, p, r, c, u, g, m), v in H.items() if p in usados}

    # ── a arreglos paralelos ───────────────────────────────────────────
    F = {k: [] for k in "eprcugmv"}
    for (e, p, r, c, u, g, m), v in sorted(H.items()):
        if abs(v) < 0.005: continue
        for k, x in zip("eprcugm", (e, p, r, c, u, g, m)): F[k].append(x)
        F["v"].append(round(v, 2))
    HM = {k: [] for k in "epmv"}
    for (e, m), v in sorted(Hh.items()):
        HM["e"].append(e); HM["p"].append(0); HM["m"].append(m); HM["v"].append(round(v, 2))

    por = {n: collections.Counter() for n in ("proy", "ro", "ceco", "cuenta", "gasto")}
    alc_eq = collections.defaultdict(set)
    for e, p, r, c, u, g, v in zip(F["e"], F["p"], F["r"], F["c"], F["u"], F["g"], F["v"]):
        por["proy"][alcances[p]] += v; por["ro"][ROS[r]] += v; por["ceco"][cecos[c]] += v
        por["cuenta"][cuentas[u]] += v; por["gasto"][gastos[g]] += v
        alc_eq[e].add(alcances[p])
    for e in HM["e"]: alc_eq[e].add(RO)
    for i, q in enumerate(equipos):
        q["proys"] = [a for a in alcances if a in alc_eq[i]] or [RO]

    # ── ordenes y conjuntos ────────────────────────────────────────────
    sysdesc, ots = {}, []
    sis_eq = collections.defaultdict(lambda: collections.defaultdict(lambda: [0.0] * ND))
    for ot, o in ot_acc.items():
        v = sum(o["m"])
        cj = txt(o["sap"].get("Conjunto"))
        if cj: sysdesc[cj] = txt(o["sap"].get("Denom.conjunto")) or cj
        mi = next((i for i, x in enumerate(o["m"]) if x), 0)
        reg = {"ot": str(ot), "eq": o["eq"], "txt": o["txt"] or txt(o["sap"].get("Texto breve")) or "-",
               "sis": cj, "pm": txt(o["sap"].get("Clase de orden")) or "-", "v": round(v),
               "d": "%02d/%02d/%02d" % (mi + 1, MES, ANIO % 100), "mi": mi, "f": "C", "p": o["alc"]}
        ots.append(reg)
        equipos[ieq[o["eq"]]]["ots"].append(reg)
        if cj and o["alc"] == RO:
            for i, x in enumerate(o["m"]): sis_eq[o["eq"]][cj][i] += x
    ots.sort(key=lambda o: -o["v"])
    for e, d in sis_eq.items():
        equipos[ieq[e]]["sys"] = sorted(
            ({"c": c, "n": sysdesc.get(c, c), "v": round(sum(m), 2), "m": [round(x, 2) for x in m]}
             for c, m in d.items() if any(m)), key=lambda s: -s["v"])

    # ── tarifa real contra tarifa de venta, por equipo y por modelo ────
    rym = collections.Counter(); mov = collections.Counter()
    for (e, p, r, c, u, g, m), v in H.items():      # sin redondear: el cuadre es al centavo
        if p != 0: continue
        if r in (0, 1): rym[e] += v
        elif r == 2: mov[e] += v
    def por_equipo(i):
        q = equipos[i]; e = q["id"]; prop = q["tipo"] == "PROPIO"
        hr = hm_eq[e]; tv = tarifa.get(e, (0.0, 0.0, 0.0)); du = dmuse.get(e)
        terc = dep_eq.get(e, 0.0) if prop else alq_eq.get(e, 0.0)
        a, b = rym[i], mov[i]
        tot = a + b + (terc if prop else 0.0)     # en alquilados el total del Excel no suma el alquiler
        va, vb = tv[0] * hr, tv[1] * hr
        # la venta del alquiler es la misma cifra que su "costo": los dos salen
        # de la tarifa de venta (y los de tarifa mensual van por dias, no x horas)
        vc = tv[2] * hr if prop else terc
        # Acumulado del anio: libro mayor mas el mes, una sola regla para
        # todos. Venta acumulada = tarifa de venta x horas acumuladas.
        L = libro_ac.get(e, {})
        g = lambda k: L.get(k, 0.0)
        ah = g("HM") + hr
        ac = [g("RYM") + a, g("FIJO") + b, g("DEP") + terc if prop else g("ALQ") + terc, g("SEG/OTR")]
        ac.append(ac[0] + ac[1] + (ac[2] if prop else 0.0))   # en alquilados el costo no suma el alquiler
        av = [tv[0] * ah, tv[1] * ah, tv[2] * ah if (prop or e not in ALQ_POR_DIAS) else ac[2]]
        av.append(av[0] + av[1] + (av[2] if prop else 0.0))
        return {"id": e, "fam": q["clasif"], "mod": q["mod"], "tipo": q["tipo"],
                "t": list(tv), "A": {"c": ac, "h": ah, "v": av},
                "costo": {"a": a, "b": b, "c": terc, "seg": 0.0, "tot": tot},
                "hr": hr, "hrProf": num(prof[e]["HM"]) if e in prof else 0.0,
                "dm": du["DM"] if du and isinstance(du["DM"], (int, float)) else None,
                "use": du["USAJE"] if du and isinstance(du["USAJE"], (int, float)) else None,
                "venta": {"a": va, "b": vb, "c": vc, "tot": va + vb + (vc if prop else 0.0)},
                "conTarifa": e in tarifa}
    # al reporte entran los equipos con alguna fila del alcance, tenga gasto o no
    en_ro = {txt(f["Equipo"]) for f in base
             if (not isinstance(f["Fecha de Tran"], datetime.datetime) or en_fecha(f)) and alcance(f) == RO}
    por_eq = [por_equipo(ieq[e]) for e in sorted(en_ro)]

    def tri(a, b, c, prop, hr):
        if not hr: return {"a": 0.0, "b": 0.0, "c": 0.0, "tot": 0.0}
        return {"a": a / hr, "b": b / hr, "c": c / hr, "tot": (a + b + (c if prop else 0.0)) / hr}
    grupos = collections.OrderedDict()
    for x in por_eq: grupos.setdefault((x["tipo"], x["fam"], x["mod"]), []).append(x)
    modelos = []
    for (tipo, fam, mod), xs in grupos.items():
        prop = tipo == "PROPIO"
        s = lambda k1, k2=None: sum((x[k1][k2] if k2 else x[k1]) for x in xs)
        hr = s("hr")
        dms = [x["dm"] for x in xs if x["dm"] is not None]
        uss = [x["use"] for x in xs if x["use"] is not None]
        m = {"fam": fam, "mod": mod, "tipo": tipo, "nEq": len(xs),
             "costo": {k: s("costo", k) for k in ("a", "b", "c", "seg", "tot")},
             "costoProf": 0.0, "dm": sum(dms) / len(dms) if dms else 0.0, "use": sum(uss) / len(uss) if uss else 0.0,
             "hr": hr, "hrProf": s("hrProf"),
             "venta": {k: s("venta", k) for k in ("a", "b", "c", "tot")},
             "tReal": tri(s("costo", "a"), s("costo", "b"), s("costo", "c"), prop, hr),
             "tProy": tri(s("venta", "a"), s("venta", "b"), s("venta", "c"), prop, hr),
             "famT": familia_flota(fam)}
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
    eqs = {}
    for x in por_eq:
        hr = x["hr"]; prop = x["tipo"] == "PROPIO"
        eqs[x["id"]] = {"dm": x["dm"], "use": x["use"], "hr": round(hr, 2), "hrProf": round(x["hrProf"], 1),
                        "tReal": round(x["costo"]["tot"] / hr, 2) if hr else None,
                        "tProy": round(x["venta"]["tot"] / hr, 2) if hr and x["venta"]["tot"] else None,
                        "conTarifa": x["conTarifa"],
                        # la fila completa del equipo, para las hojas Propios y Alquilados:
                        # c = costo real, v = venta interna, cada uno [RyM, MOV, Dep o Alq, total]
                        "fam": x["fam"], "mod": x["mod"], "tipo": x["tipo"], "prov": equipos[ieq[x["id"]]]["prov"],
                        "c": [round(x["costo"][k], 2) for k in ("a", "b", "c", "tot")],
                        "v": [round(x["venta"][k], 2) for k in ("a", "b", "c", "tot")],
                        # acumulado: c = [RyM, MOV, Dep o Alq, Seg, costo], h = horas, v = venta
                        "A": {"c": [round(v, 2) for v in x["A"]["c"]], "h": round(x["A"]["h"], 2),
                              "v": [round(v, 2) for v in x["A"]["v"]]}}
        if x["id"] in ALQ_POR_DIAS or x["id"] in DEP_POR_DIAS: eqs[x["id"]]["porDias"] = True
    # las ordenes de cada equipo dentro del resultado operativo: [orden, fase, texto, RyM, MOV]
    ots_eq = collections.defaultdict(list)
    for ot, o in ot_acc.items():
        if o["alc"] == RO and (abs(o["rym"]) >= 0.005 or abs(o["mov"]) >= 0.005):
            ots_eq[o["eq"]].append([str(ot), o["fase"], o["txt"] or "-", round(o["rym"], 2), round(o["mov"], 2)])
    for e in ots_eq: ots_eq[e].sort(key=lambda r: -(r[3] + r[4]))
    per = sorted(periodos)
    MESES = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SETIEMBRE",
             "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"]
    setiembre = {
        "mes": "%04d-%02d" % (ANIO, MES), "rotulo": "%s %d" % (MESES[MES - 1], ANIO), "corte": "al día %d" % CORTE,
        "sede": "SHGN", "corteDia": CORTE, "diasMes": DIAS_MES, "fuente": nombre_libro + " · recalculado desde " + hoja_base[0],
        "nModelos": len(modelos), "nProp": sum(1 for m in modelos if m["tipo"] == "PROPIO"),
        "nAlq": sum(1 for m in modelos if m["tipo"] == "ALQUILADO"),
        "nConTarifa": len(con_t), "nCumplen": sum(1 for m in con_t if m["tReal"]["tot"] <= m["tProy"]["tot"]),
        "nConDM": len(con_dm),
        "dm": sum(m["dm"] * m["hr"] for m in con_dm) / h_dm if h_dm else 0,
        "use": sum(m["use"] * m["hr"] for m in con_dm) / h_dm if h_dm else 0,
        "total": tot, "modelos": modelos, "eq": eqs, "ots": ots_eq,
        "acumPeriodos": per, "acumIncluyeMes": MES in per,
        "alqPorDias": list(ALQ_POR_DIAS), "depPorDias": list(DEP_POR_DIAS)}

    # ── cuadres contra las dos hojas de reporte ────────────────────────
    def total_hoja(filas, etiqueta_col=1):
        for r in filas:
            if len(r) > 22 and txt(r[etiqueta_col]) == "Total":
                # L RYM · M MOV · N Dep/Alq · O Seg · V horas
                return {"rym": num(r[11]), "mov": num(r[12]), "terc": num(r[13]), "seg": num(r[14]),
                        "hr": num(r[21]), "nEq": num(r[3])}
        falla("no encuentro la fila Total en una hoja de reporte")
    hp, ha = total_hoja(fp), total_hoja(fa)
    def mio(tipo):
        xs = [x for x in por_eq if x["tipo"] == tipo]
        return {"rym": sum(x["costo"]["a"] for x in xs), "mov": sum(x["costo"]["b"] for x in xs),
                "terc": sum(x["costo"]["c"] for x in xs), "hr": sum(x["hr"] for x in xs), "nEq": len(xs)}
    mp, ma = mio("PROPIO"), mio("ALQUILADO")
    def acum_hoja(filas, cols):
        for r in filas:
            if len(r) > 60 and txt(r[1]) == "Total":
                return {k: num(r[i]) for k, i in cols.items()}
    def acum_mio(tipo):
        xs = [x for x in por_eq if x["tipo"] == tipo]
        return {"rym": sum(x["A"]["c"][0] for x in xs), "mov": sum(x["A"]["c"][1] for x in xs),
                "terc": sum(x["A"]["c"][2] for x in xs), "costo": sum(x["A"]["c"][4] for x in xs),
                "hr": sum(x["A"]["h"] for x in xs), "venta": sum(x["A"]["v"][3] for x in xs)}
    # columnas del total: PROP  AV AW AX AZ BA BF  ·  ALQ  AY AZ BA BC BD BI
    ahp = acum_hoja(fp, {"rym": 47, "mov": 48, "terc": 49, "costo": 51, "hr": 52, "venta": 57})
    aha = acum_hoja(fa, {"rym": 50, "mov": 51, "terc": 52, "costo": 54, "hr": 55, "venta": 60})
    amp, ama = acum_mio("PROPIO"), acum_mio("ALQUILADO")
    r2 = lambda d: {k: round(v, 2) for k, v in d.items()}
    parte_tarifa = round(por["proy"].get("PARTE DE LA TARIFA", 0.0), 2)
    val = {"libro": os.path.basename(LIBRO), "hoja": hoja_base[0], "corte": CORTE, "diasMes": DIAS_MES,
           "mes": MES, "anio": ANIO, "fechaMaxBase": fecha_max,
           "generado": datetime.datetime.now().strftime("%Y-%m-%d %H:%M"),
           "reglas": {t: {c: x["ver"] for c, x in r.items() if c != "Fecha de Tran"} for t, r in REGLAS.items()},
           "reglasFuera": {t: {c: x["ocultos"] for c, x in r.items() if c != "Fecha de Tran"} for t, r in REGLAS.items()},
           "fuenteHoras": fuente_horas, "alqPorDias": list(ALQ_POR_DIAS), "depPorDias": list(DEP_POR_DIAS),
           "propio": {"hoja": r2(hp), "calc": r2(mp)}, "alquilado": {"hoja": r2(ha), "calc": r2(ma)},
           "acumPeriodos": per,
           "acumPropio": {"hoja": r2(ahp), "calc": r2(amp)}, "acumAlquilado": {"hoja": r2(aha), "calc": r2(ama)},
           "difMovAlq": round(ma["mov"] - ha["mov"], 2), "difEqAlq": int(ma["nEq"] - ha["nEq"]),
           "difHrAlq": round(ma["hr"] - ha["hr"], 2),
           "fueraCorte": r2(fuera_corte), "sinFecha": round(sin_fecha, 2),
           "sinTarifa": sum(1 for x in por_eq if not x["conTarifa"]),
           "sinHoras": sum(1 for x in por_eq if not x["hr"]),
           "sinDM": sum(1 for x in por_eq if x["dm"] is None),
           "parteTarifa": parte_tarifa, "serviciosFueraBase": zserv,
           "horasFuera": {"n": len(horas_fuera), "h": round(sum(horas_fuera.values()), 2)},
           "horasDescuadre": descuadre_h[:20]}

    total = round(sum(F["v"]), 2)
    hm = round(sum(HM["v"]), 2)
    meta = {"fuente": nombre_libro + " · hoja " + hoja_base[0] + " · recalculado",
            "desde": dias[0], "hasta": dias[-1], "total": total, "hm": hm, "cph": round(total / hm, 1) if hm else 0,
            "nEq": len(equipos), "nEqCosto": len({e for e in F["e"]}), "nLin": nlin, "nOT": len(ots),
            "nHechos": len(F["v"]), "nEqDet": sum(1 for q in equipos if q["sys"]), "nSis": len(sysdesc),
            "proyDetalle": RO, "sinCeco": SIN_FASE,
            "porProy": {a: {"v": round(por["proy"][a], 2)} for a in alcances},
            "porRO": {k: round(v, 2) for k, v in por["ro"].items()},
            "porCeco": {k: round(v, 2) for k, v in por["ceco"].items()},
            "porCuenta": {k: round(v, 2) for k, v in por["cuenta"].items()},
            "porGasto": {k: round(v, 2) for k, v in por["gasto"].items()},
            "val": val}
    datos = {"meta": meta, "meses": dias, "proys": alcances, "ros": ROS, "cecos": cecos, "cuentas": cuentas,
             "gastos": gastos, "equipos": equipos, "F": F, "H": HM, "ots": ots, "sysdesc": sysdesc}

    def graba(nombre, obj):
        io.open(os.path.join(AQUI, nombre), "w", encoding="utf8").write(
            json.dumps(obj, ensure_ascii=False, separators=(",", ":")))
        print("  ->", nombre, os.path.getsize(os.path.join(AQUI, nombre)), "bytes")
    graba("datos.json", datos); graba("setiembre.json", setiembre)
    io.open(os.path.join(AQUI, "validacion.json"), "w", encoding="utf8").write(
        json.dumps(val, ensure_ascii=False, indent=1))

    # ── lo que hay que mirar ───────────────────────────────────────────
    print("\nreglas de las dinamicas:")
    for t, r in val["reglas"].items(): print("  %-9s" % t, r)
    print("corte: dia %d de %d · base hasta %s · horas de %s" % (CORTE, DIAS_MES, fecha_max, fuente_horas))
    print("prorrateo por dias · dep %s · alq %s" % (DEP_POR_DIAS, ALQ_POR_DIAS))
    print("\nlineas hasta el dia %d: %d | hechos: %d | equipos: %d | ordenes: %d" % (CORTE, nlin, len(F["v"]), len(equipos), len(ots)))
    print("por alcance :", {a: round(por["proy"][a]) for a in alcances})
    print("por recurso :", {k: round(v) for k, v in por["ro"].items()})
    print("fuera del corte:", r2(fuera_corte), "| sin fecha:", round(sin_fecha, 2))
    if zserv: print("Z SERV conformado y no en la base: %d filas, US$ %.2f" % (zserv["n"], zserv["v"]))
    print("horometro de equipos fuera de la base: %d equipos, %.1f h" % (len(horas_fuera), sum(horas_fuera.values())))
    print("\n%-10s %14s %14s %12s" % ("", "hoja", "recalculado", "diferencia"))
    for nom, h, c in (("PROPIO", hp, mp), ("ALQUILADO", ha, ma)):
        for k, et in (("rym", "RYM"), ("mov", "MOV"), ("terc", "Dep/Alq"), ("hr", "horas"), ("nEq", "equipos")):
            print("%-10s %14.2f %14.2f %12.2f  %s" % (nom if k == "rym" else "", h[k], c[k], c[k] - h[k], et))
    print("\nACUMULADO 2026 · periodos del libro en BASE VARIOS: %s, mas el mes al dia %d" % (per, CORTE))
    for nom, h, cc in (("PROPIO", ahp, amp), ("ALQUILADO", aha, ama)):
        for k, et in (("rym", "RYM"), ("mov", "MOV"), ("terc", "Dep/Alq"), ("costo", "costo"), ("hr", "horas"), ("venta", "venta")):
            print("%-10s %14.2f %14.2f %12.2f  %s" % (nom if k == "rym" else "", h[k], cc[k], cc[k] - h[k], et))
    ok = all(abs(c[k] - h[k]) < 0.01 for h, c in ((hp, mp), (ha, ma)) for k in ("rym", "mov"))
    print("\nRYM y MOV de las dos hojas cuadran:", "OK" if ok else "FALLA")
    if descuadre_h: print("horas: %d equipos donde el parte por dia no suma el total de BASE VARIOS: %s" % (len(descuadre_h), descuadre_h[:6]))
    print("tarifa real/venta: %.2f / %.2f US$/h | modelos %d, con tarifa y horas %d" % (tot["tReal"], tot["tProy"], len(modelos), len(con_t)))
    if not ok: sys.exit(1)


if __name__ == "__main__":
    main()
