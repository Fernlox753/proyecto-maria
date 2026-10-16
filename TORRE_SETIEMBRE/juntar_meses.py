# -*- coding: utf-8 -*-
"""Junta setiembre con los otros meses (julio, agosto) para la pagina.

Cada mes se lee aparte con gen_datos.py y las MISMAS reglas (las de las
dinamicas de su propio libro):

    python gen_datos.py                                    setiembre (como siempre)
    python gen_datos.py --salida=meses\\2026-07 <4 libros de julio>
    python gen_datos.py --salida=meses\\2026-08 <4 libros de agosto>
    python juntar_meses.py

y aqui se juntan sin tocar nada de setiembre:

  meses\\datos_meses.json   la tabla de hechos de los tres meses en una sola
                           linea de dias (julio, agosto y setiembre). Es la
                           misma forma de datos.json: setiembre va primero en
                           cada lista (equipos, alcances, categorias) en su
                           mismo orden, y lo que solo trae otro mes se agrega
                           al final. Los indices de dia de setiembre se corren
                           (empiezan despues de agosto). meta es la de
                           setiembre; meta.meses dice que meses hay.
                           Las ordenes van una sola vez (en ots); cada equipo
                           lleva oi, los indices de las suyas, y la pagina las
                           vuelve a enlazar al cargar (pesan la mitad).
  meses\\tabla_meses.json  para Flota completa: la fila de cada equipo de las
                           hojas PROP y ALQ (como setiembre.json) y la
                           validacion de cada mes, para el filtro de mes.

ensamblar.py usa estos dos si existen; si no, la pagina queda como antes.
"""
import io, json, os, sys

AQUI = os.path.dirname(os.path.abspath(__file__))
MESES_DIR = os.path.join(AQUI, "meses")


def lee(p):
    return json.load(io.open(p, encoding="utf-8"))


def otros_meses():
    """Las carpetas meses\\AAAA-MM que tienen los tres json, en orden."""
    if not os.path.isdir(MESES_DIR): return []
    out = []
    for m in sorted(os.listdir(MESES_DIR)):
        d = os.path.join(MESES_DIR, m)
        if os.path.isdir(d) and all(os.path.exists(os.path.join(d, f)) for f in ("datos.json", "setiembre.json", "validacion.json")):
            out.append(m)
    return out


def main():
    S = lee(os.path.join(AQUI, "datos.json"))
    sep_mes = lee(os.path.join(AQUI, "setiembre.json"))["mes"]
    meses = [m for m in otros_meses() if m != sep_mes]
    if not meses:
        sys.exit("no hay otros meses en " + MESES_DIR)
    O = {m: lee(os.path.join(MESES_DIR, m, "datos.json")) for m in meses}
    orden = sorted(meses + [sep_mes])
    fuente = dict(O, **{sep_mes: S})

    # ── la linea de dias y donde empieza cada mes ──────────────────────
    dias, off = [], {}
    for m in orden:
        off[m] = len(dias)
        dias += fuente[m]["meses"]
    if len(set(dias)) != len(dias): sys.exit("hay dias repetidos entre meses")
    ND = len(dias)

    # ── listas: las de setiembre primero, en su orden; lo nuevo al final ──
    def unir(clave):
        lista = list(S[clave])
        for m in sorted(meses, reverse=True):          # agosto antes que julio
            for v in fuente[m][clave]:
                if v not in lista: lista.append(v)
        return lista
    proys, cecos, cuentas, gastos = unir("proys"), unir("cecos"), unir("cuentas"), unir("gastos")
    if S["ros"] != O[meses[0]]["ros"]: sys.exit("los recursos no son los mismos")
    ros = S["ros"]

    # ── equipos: setiembre en su orden; despues los que solo estan en otro mes ──
    equipos, ieq = [], {}
    def base_eq(q):
        x = {k: v for k, v in q.items() if k not in ("sys", "ots", "proys")}
        x["proys"], x["sys"], x["oi"] = list(q.get("proys") or []), [], []
        return x
    for q in S["equipos"]:
        ieq[q["id"]] = len(equipos); equipos.append(base_eq(q))
    for m in sorted(meses, reverse=True):
        for q in fuente[m]["equipos"]:
            if q["id"] not in ieq:
                ieq[q["id"]] = len(equipos); equipos.append(base_eq(q))

    # ── hechos, horas y ordenes, con los indices de la union ──────────
    F = {k: [] for k in "eprcugmv"}
    H = {k: [] for k in "epmv"}
    ots, sysdesc = [], {}
    nuevos = {"proys": [], "cuentas": []}
    sis = [dict() for _ in equipos]                # por equipo: {codigo: [n, v, m]}
    for m in [sep_mes] + sorted(meses, reverse=True):    # setiembre primero
        D, o = fuente[m], off[m]
        e_map = [ieq[q["id"]] for q in D["equipos"]]
        p_map = [proys.index(v) for v in D["proys"]]
        c_map = [cecos.index(v) for v in D["cecos"]]
        u_map = [cuentas.index(v) for v in D["cuentas"]]
        g_map = [gastos.index(v) for v in D["gastos"]]
        f = D["F"]
        for i in range(len(f["v"])):
            F["e"].append(e_map[f["e"][i]]); F["p"].append(p_map[f["p"][i]]); F["r"].append(f["r"][i])
            F["c"].append(c_map[f["c"][i]]); F["u"].append(u_map[f["u"][i]]); F["g"].append(g_map[f["g"][i]])
            F["m"].append(f["m"][i] + o); F["v"].append(f["v"][i])
        h = D["H"]
        for i in range(len(h["v"])):
            H["e"].append(e_map[h["e"][i]]); H["p"].append(h["p"][i]); H["m"].append(h["m"][i] + o); H["v"].append(h["v"][i])
        # ordenes: una sola lista; cada equipo apunta a las suyas en su orden
        de_ot = {}
        for x in D["ots"]:
            y = dict(x)
            if "mi" in y: y["mi"] = y["mi"] + o
            de_ot[x["ot"]] = len(ots)
            ots.append(y)
        for q in D["equipos"]:
            k = ieq[q["id"]]
            equipos[k]["oi"] += [de_ot[x["ot"]] for x in (q.get("ots") or [])]
            for a in q.get("proys") or []:
                if a not in equipos[k]["proys"]: equipos[k]["proys"].append(a)
            for s in q.get("sys") or []:
                z = sis[k].setdefault(s["c"], {"n": s["n"], "v": 0.0, "m": [0.0] * ND, "orden": len(sis[k])})
                z["v"] += s["v"]
                for j, val in enumerate(s["m"]): z["m"][o + j] += val
        for c, n in D["sysdesc"].items(): sysdesc.setdefault(c, n)
    for k, d in enumerate(sis):
        equipos[k]["sys"] = [{"c": c, "n": z["n"], "v": round(z["v"], 2), "m": [round(v, 2) for v in z["m"]]}
                             for c, z in sorted(d.items(), key=lambda kv: kv[1]["orden"])]
    for k, q in enumerate(equipos):
        q["proys"] = [a for a in proys if a in q["proys"]]

    meta = dict(S["meta"])
    rot = {"01": "ENERO", "02": "FEBRERO", "03": "MARZO", "04": "ABRIL", "05": "MAYO", "06": "JUNIO", "07": "JULIO",
           "08": "AGOSTO", "09": "SETIEMBRE", "10": "OCTUBRE", "11": "NOVIEMBRE", "12": "DICIEMBRE"}
    meta["meses"] = [{"mes": m, "rotulo": rot[m[5:7]] + " " + m[:4], "desde": fuente[m]["meses"][0],
                      "hasta": fuente[m]["meses"][-1], "ini": off[m], "fin": off[m] + len(fuente[m]["meses"]) - 1}
                     for m in orden]
    datos = {"meta": meta, "meses": dias, "proys": proys, "ros": ros, "cecos": cecos, "cuentas": cuentas,
             "gastos": gastos, "equipos": equipos, "F": F, "H": H, "ots": ots, "sysdesc": sysdesc,
             "sedes": S["sedes"], "sedeNom": S["sedeNom"]}

    # ── Flota completa: la fila de cada equipo de cada mes, y su validacion ──
    tabla = {"def": sep_mes, "meses": [{"mes": x["mes"], "rotulo": x["rotulo"]} for x in meta["meses"]],
             "sep": {}, "val": {}}
    for m in meses:
        tabla["sep"][m] = lee(os.path.join(MESES_DIR, m, "setiembre.json"))
        tabla["val"][m] = lee(os.path.join(MESES_DIR, m, "validacion.json"))

    # ── lo que la pagina le suma a setiembre para los tres meses ───────
    # En cada lista setiembre va primero: lo de los otros meses es la cola.
    # La pagina lo agrega al cargar en modo tres meses (meses.js), corriendo
    # los dias de setiembre; asi no viaja dos veces lo de setiembre.
    nS = {k: len(S[k]) for k in ("proys", "cecos", "cuentas", "gastos", "equipos", "ots")}
    nF, nH = len(S["F"]["v"]), len(S["H"]["v"])
    de_ots_s = {x["ot"]: j for j, x in enumerate(S["ots"])}
    ext = {"off": off[sep_mes], "dias": dias, "meses": meta["meses"],
           "proys": proys[nS["proys"]:], "cecos": cecos[nS["cecos"]:], "cuentas": cuentas[nS["cuentas"]:],
           "gastos": gastos[nS["gastos"]:],
           "F": {k: F[k][nF:] for k in F}, "H": {k: H[k][nH:] for k in H},
           "ots": ots[nS["ots"]:], "sysdesc": {c: n for c, n in sysdesc.items() if c not in S["sysdesc"]},
           "eqNuevos": [], "eqSys": {}, "eqProys": {}, "eqOi": {}}
    for k, q in enumerate(equipos):
        extra_oi = [j for j in q["oi"] if j >= nS["ots"]]
        if k < nS["equipos"]:
            s0 = S["equipos"][k]
            if [z["c"] for z in q["sys"]] != [z["c"] for z in s0.get("sys") or []] or \
               any(abs(z["v"] - z0["v"]) >= 0.005 for z, z0 in zip(q["sys"], s0.get("sys") or [])):
                ext["eqSys"][k] = q["sys"]
            if q["proys"] != (s0.get("proys") or []): ext["eqProys"][k] = q["proys"]
            if extra_oi: ext["eqOi"][k] = extra_oi
        else:
            x = {kk: v for kk, v in q.items() if kk != "oi"}
            ext["eqNuevos"].append(x)
            if extra_oi: ext["eqOi"][k] = extra_oi

    for nombre, obj in (("datos_meses.json", datos), ("tabla_meses.json", tabla), ("tres_meses.json", ext)):
        p = os.path.join(MESES_DIR, nombre)
        io.open(p, "w", encoding="utf-8").write(json.dumps(obj, ensure_ascii=False, separators=(",", ":")))
        print("  ->", p, os.path.getsize(p), "bytes")

    # ── control: cada mes suma lo mismo que su datos.json ─────────────
    for m in orden:
        D, o = fuente[m], off[m]
        n = len(D["meses"])
        t1 = round(sum(D["F"]["v"]), 2)
        t2 = round(sum(v for v, d in zip(F["v"], F["m"]) if o <= d < o + n), 2)
        h1 = round(sum(D["H"]["v"]), 2)
        h2 = round(sum(v for v, d in zip(H["v"], H["m"]) if o <= d < o + n), 2)
        ro1 = round(sum(v for v, p in zip(D["F"]["v"], D["F"]["p"]) if p == 0), 2)
        ro2 = round(sum(v for v, p, d in zip(F["v"], F["p"], F["m"]) if p == 0 and o <= d < o + n), 2)
        ok = abs(t1 - t2) < 0.05 and abs(h1 - h2) < 0.05 and abs(ro1 - ro2) < 0.05
        print("  %s  dias %3d  hechos US$ %14.2f / %14.2f  RO %13.2f / %13.2f  horas %11.2f / %11.2f  %s"
              % (m, n, t1, t2, ro1, ro2, h1, h2, "OK" if ok else "DIFIERE"))
        if not ok: sys.exit("la union no cuadra con " + m)
    print("  dias %d (%s a %s) · equipos %d (setiembre %d) · hechos %d · ordenes %d"
          % (ND, dias[0], dias[-1], len(equipos), len(S["equipos"]), len(F["v"]), len(ots)))


if __name__ == "__main__":
    main()
