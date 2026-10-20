# -*- coding: utf-8 -*-
"""Arma un mes con proyectos de dos lecturas distintas de gen_datos.py.

Para cuando un libro llega a medias: los proyectos listos se leen de nuevo y
los demas se quedan con la lectura anterior (cada uno con su corte).

    python juntar_sedes.py --nuevo=<carpeta> --viejo=<carpeta> --del-viejo=ATOC,TRMA --salida=meses\\2026-10

Las dos carpetas tienen datos.json, setiembre.json y validacion.json de
gen_datos.py (--salida=). De --nuevo se toman todos los proyectos menos los
de --del-viejo, que salen de --viejo. Los dias se juntan por fecha (el mes
queda con la lista mas larga) y los indices de equipos, alcances, categorias
y dias se vuelven a numerar. meta de datos.json es la de --nuevo: juntar_meses.py
no la usa para los otros meses.

La primera vez: octubre del 20/10, con SHGN y TEMB al dia 18 y ATOC (libro sin
base) y TRMA (sin actualizar) al dia 11 de la lectura del 20/10 en la manana.
"""
import io, json, os, sys

def lee(d, n): return json.load(io.open(os.path.join(d, n), encoding="utf-8"))
def graba(d, n, obj):
    io.open(os.path.join(d, n), "w", encoding="utf-8").write(json.dumps(obj, ensure_ascii=False, separators=(",", ":")))

def main():
    arg = dict(a[2:].split("=", 1) for a in sys.argv[1:] if a.startswith("--") and "=" in a)
    for k in ("nuevo", "viejo", "del-viejo", "salida"):
        if k not in arg: sys.exit("falta --%s" % k)
    viejas = set(s.strip() for s in arg["del-viejo"].split(",") if s.strip())
    An, Av = lee(arg["nuevo"], "datos.json"), lee(arg["viejo"], "datos.json")
    Sn, Sv = lee(arg["nuevo"], "setiembre.json"), lee(arg["viejo"], "setiembre.json")
    Vn, Vv = lee(arg["nuevo"], "validacion.json"), lee(arg["viejo"], "validacion.json")
    if Sn["mes"] != Sv["mes"]: sys.exit("no son el mismo mes: %s y %s" % (Sn["mes"], Sv["mes"]))
    if An["ros"] != Av["ros"]: sys.exit("los recursos no son los mismos")
    sedes = list(Sv["sedes"]) + [s for s in Sn["sedes"] if s not in Sv["sedes"]]
    toma = lambda sede: "v" if sede in viejas else "n"
    for s in viejas:
        if s not in Sv["sedes"]: sys.exit("%s no esta en --viejo" % s)

    # ── datos.json ──────────────────────────────────────────────────────
    dias = sorted(set(An["meses"]) | set(Av["meses"]))
    idia = {d: i for i, d in enumerate(dias)}
    def unir(k):
        out = list(An[k])
        for v in Av[k]:
            if v not in out: out.append(v)
        return out
    L = {k: unir(k) for k in ("proys", "cecos", "cuentas", "gastos")}
    fuentes = (("n", An), ("v", Av))
    equipos, ieq = [], {}
    for lado, D in fuentes:
        for q in D["equipos"]:
            if toma(q["sede"]) != lado or q["id"] in ieq: continue
            x = dict(q)
            x["sys"] = []
            for s in q.get("sys") or []:
                m = [0.0] * len(dias)
                for j, val in enumerate(s["m"]): m[idia[D["meses"][j]]] += val
                x["sys"].append({"c": s["c"], "n": s["n"], "v": s["v"], "m": m})
            x["ots"] = [dict(o, mi=idia[D["meses"][o["mi"]]]) if "mi" in o else dict(o) for o in q.get("ots") or []]
            ieq[q["id"]] = len(equipos); equipos.append(x)
    F = {k: [] for k in "eprcugmv"}; H = {k: [] for k in "epmv"}; ots = []; sysdesc = {}
    for lado, D in fuentes:
        mapa = {k: [L[k].index(v) for v in D[k]] for k in L}
        eqs = D["equipos"]
        f = D["F"]
        for i in range(len(f["v"])):
            q = eqs[f["e"][i]]
            if toma(q["sede"]) != lado: continue
            F["e"].append(ieq[q["id"]]); F["p"].append(mapa["proys"][f["p"][i]]); F["r"].append(f["r"][i])
            F["c"].append(mapa["cecos"][f["c"][i]]); F["u"].append(mapa["cuentas"][f["u"][i]])
            F["g"].append(mapa["gastos"][f["g"][i]]); F["m"].append(idia[D["meses"][f["m"][i]]]); F["v"].append(f["v"][i])
        h = D["H"]
        for i in range(len(h["v"])):
            q = eqs[h["e"][i]]
            if toma(q["sede"]) != lado: continue
            H["e"].append(ieq[q["id"]]); H["p"].append(h["p"][i]); H["m"].append(idia[D["meses"][h["m"][i]]]); H["v"].append(h["v"][i])
        for o in D["ots"]:
            sede = o.get("s") or (eqs[ieq.get(o.get("eq"), 0)]["sede"] if o.get("eq") in ieq else None)
            if sede is None or toma(sede) != lado: continue
            ots.append(dict(o, mi=idia[D["meses"][o["mi"]]]) if "mi" in o else dict(o))
        for c, n in D["sysdesc"].items(): sysdesc.setdefault(c, n)
    meta = dict(An["meta"]); meta["desde"], meta["hasta"] = dias[0], dias[-1]
    meta["fuente"] = "%s (%s) + %s (%s)" % (An["meta"].get("fuente", "nuevo"), ", ".join(s for s in sedes if toma(s) == "n"),
                                           Av["meta"].get("fuente", "viejo"), ", ".join(s for s in sedes if toma(s) == "v"))
    datos = {"meta": meta, "meses": dias, "proys": L["proys"], "ros": An["ros"], "cecos": L["cecos"], "cuentas": L["cuentas"],
             "gastos": L["gastos"], "equipos": equipos, "F": F, "H": H, "ots": ots, "sysdesc": sysdesc,
             "sedes": sedes, "sedeNom": dict(Av["sedeNom"], **An["sedeNom"])}

    # ── setiembre.json (la fila de cada equipo en sus hojas) ─────────────
    sep = dict(Sn)
    sep["sedes"] = sedes
    sep["sedeNom"] = dict(Sv["sedeNom"], **Sn["sedeNom"])
    sep["sede"] = " · ".join(sedes)
    sep["corteSede"] = {s: (Sv if toma(s) == "v" else Sn)["corteSede"][s] for s in sedes}
    sep["eq"] = {}; sep["ots"] = {}
    for lado, S in (("n", Sn), ("v", Sv)):
        for k, x in S["eq"].items():
            if toma(x["sede"]) == lado and k not in sep["eq"]:
                sep["eq"][k] = x
                if k in S["ots"]: sep["ots"][k] = S["ots"][k]
    # prorrateados por dias: los de cada proyecto, de su lectura
    for k in ("depPorDias", "alqPorDias"):
        sep[k] = []
        for s in sedes:
            V = Vv if toma(s) == "v" else Vn
            for e in (V["sedes"].get(s) or {}).get(k) or []:
                if e not in sep[k]: sep[k].append(e)
    sep["fuente"] = "%s + %s" % (Sn.get("fuente", ""), Sv.get("fuente", ""))
    sep["juntado"] = {s: ("al día %d" % sep["corteSede"][s]) for s in sedes}

    # ── validacion.json: las reglas y cuadres de cada proyecto, de su lectura ──
    val = dict(Vn)
    val["sedes"] = {s: (Vv if toma(s) == "v" else Vn)["sedes"][s] for s in sedes}
    val["sedes_de"] = {s: ("anterior" if toma(s) == "v" else "nueva") for s in sedes}

    os.makedirs(arg["salida"], exist_ok=True)
    graba(arg["salida"], "datos.json", datos); graba(arg["salida"], "setiembre.json", sep); graba(arg["salida"], "validacion.json", val)

    # ── control: cada proyecto suma lo mismo que en su lectura ─────────
    def ro(D, sede):
        return round(sum(v for e, p, v in zip(D["F"]["e"], D["F"]["p"], D["F"]["v"]) if p == 0 and D["equipos"][e]["sede"] == sede), 2)
    for s in sedes:
        D = Av if toma(s) == "v" else An
        a, b = ro(D, s), ro(datos, s)
        print("  %-5s %-8s RO %14.2f / %14.2f  equipos hoja %4d  %s" % (s, "anterior" if toma(s) == "v" else "nueva", a, b,
              sum(1 for x in sep["eq"].values() if x["sede"] == s), "OK" if abs(a - b) < 0.05 else "DIFIERE"))
        if abs(a - b) >= 0.05: sys.exit("no cuadra " + s)
    print("  dias %s a %s · equipos %d · hechos %d · ordenes %d" % (dias[0], dias[-1], len(equipos), len(F["v"]), len(ots)))

if __name__ == "__main__":
    main()
