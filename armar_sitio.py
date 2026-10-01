# -*- coding: utf-8 -*-
"""Arma las paginas del sitio (GitHub Pages) a partir de los fragmentos.

TORRE_SETIEMBRE\\artifact.html y REVISION\\incongruencias_27_09.html son
fragmentos pensados para publicarse como Artifact: no traen <html>, <head>
ni charset. Aqui se les pone el esqueleto minimo para que un navegador los
abra solos:

  index.html     la Torre de Control Setiembre
  revision.html  las incongruencias del consolidado 27.09

    python TORRE_SETIEMBRE\\gen_datos.py     (con el Excel en CONSOLIDADO\\)
    python TORRE_SETIEMBRE\\ensamblar.py
    python armar_sitio.py
"""
import io, os

AQUI = os.path.dirname(os.path.abspath(__file__))
CABEZA = ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
          '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
          '<style>[hidden]{display:none!important}</style>\n</head>\n<body>\n')
PIE = '\n</body>\n</html>\n'

for origen, destino in (("TORRE_SETIEMBRE/artifact.html", "index.html"),
                        ("REVISION/incongruencias_27_09.html", "revision.html")):
    t = io.open(os.path.join(AQUI, origen), encoding="utf-8").read()
    io.open(os.path.join(AQUI, destino), "w", encoding="utf-8", newline="\n").write(CABEZA + t + PIE)
    print(destino, os.path.getsize(os.path.join(AQUI, destino)), "bytes")
