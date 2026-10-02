# -*- coding: utf-8 -*-
"""Banco de pruebas del 3D de la hoja Equipo: fotos de un equipo desde varios angulos.

Arma una copia propia de la torre (no toca artifact.html), le agrega un gancho
que abre la hoja Equipo, elige el equipo, gira el modelo a cada angulo y pega
las vistas en una sola imagen; Chrome sin ventana la fotografia. Varios
procesos pueden correrlo a la vez.

    python prueba3d.py FC-100                      -> _pruebas3d/FC-100.png
    python prueba3d.py FC-100 RE-62 --base         sin mapa de calor (colores de fabrica)
    python prueba3d.py FC-100 --solo modelo_hd1500.js     solo ese archivo de modelos
    python prueba3d.py FC-100 --cerca              mas cerca (dist x 0.6)
    python prueba3d.py FC-100 --angs 0,1.57,3.14 --alto 0.6 --dist 25

En la imagen: cada vista con su angulo; arriba en rojo los errores de la
pagina si los hubo (si no hay modelo registrado lo dice).
"""
import argparse, os, subprocess, sys, tempfile, time

AQUI = os.path.dirname(os.path.abspath(__file__))
CHROMES = [r"C:\Program Files\Google\Chrome\Application\chrome.exe",
           r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"]

GANCHO = r"""
/* ═══ banco de pruebas 3D (solo en las copias de prueba3d.py) ═══ */
(function banco3d(){
  var q = location.hash.match(/^#prueba3d(.*)$/);
  if(!q) return;
  var p = {}, errores = [];
  q[1].split('&').forEach(function(kv){ var a = kv.split('='); if(a[0]) p[a[0]] = decodeURIComponent(a[1] || ''); });
  window.addEventListener('error', function(ev){ errores.push(String(ev.message)); });
  setTimeout(function(){
    try {
      irA('v-equipo');
      if(!byId[p.eq]) errores.push('NO EXISTE EL EQUIPO ' + p.eq);
      elegirEquipo(p.eq);
      if(!/^R:/.test(MODELO3D_ACTUAL)) errores.push('SIN MODELO REGISTRADO: usa el viejo «' + MODELO3D_ACTUAL + '»');
      if(p.base) piezas.forEach(function(m){ if(m.userData.base && m.material && m.material.color) m.material.color.set(m.userData.base); });
      gira = false;
      var W = 760, H = 480;
      rE.setPixelRatio(1); rE.setSize(W, H, false); camE.aspect = W / H; camE.updateProjectionMatrix();
      var angs = (p.angs || '2.35,0.75,-0.75,3.93,1.57,-1.57').split(',').map(Number);
      var cols = 3, filas = Math.ceil(angs.length / cols);
      var c = document.createElement('canvas'); c.width = W * cols; c.height = H * filas + 40;
      var g = c.getContext('2d'); g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, c.width, c.height);
      var d = +(p.dist || camion.userData.dist || 30) * (p.cerca ? 0.6 : 1);
      var nM = 0; camion.traverse(function(m){ if(m.isMesh) nM++; });
      angs.forEach(function(a, i){
        rotY = a; dist = d; rotX = +(p.alto || 0.27);
        renderEstudio(0);
        g.drawImage(rE.domElement, (i % cols) * W, 40 + Math.floor(i / cols) * H);
        g.fillStyle = '#555'; g.font = '15px monospace';
        g.fillText('ang ' + a, (i % cols) * W + 8, 40 + Math.floor(i / cols) * H + 18);
      });
      g.fillStyle = errores.length ? '#C00' : '#111'; g.font = 'bold 18px monospace';
      g.fillText(p.eq + ' · ' + MODELO3D_ACTUAL + ' · ' + nM + ' mallas · ' + piezas.length + ' piezas SAP'
        + (errores.length ? ' · ERRORES: ' + errores.join(' | ') : ''), 10, 26);
      c.style.cssText = 'position:fixed;left:0;top:0;width:' + c.width + 'px;height:' + c.height + 'px;z-index:99999';
      document.body.appendChild(c);
    } catch(err){
      var t = document.createElement('pre');
      t.textContent = 'ERROR EN EL BANCO: ' + err.message + '\n' + (err.stack || '') + '\n' + errores.join('\n');
      t.style.cssText = 'position:fixed;left:0;top:0;z-index:99999;background:#fff;color:#c00;font:16px monospace;padding:20px';
      document.body.appendChild(t);
    }
  }, 1500);
})();
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("equipos", nargs="+")
    ap.add_argument("--solo", default="", help="modelo_*.js a incluir, separados por coma (por defecto todos)")
    ap.add_argument("--salida", default=os.path.join(AQUI, "_pruebas3d"))
    ap.add_argument("--base", action="store_true", help="colores de fabrica, sin mapa de calor")
    ap.add_argument("--cerca", action="store_true")
    ap.add_argument("--angs", default="")
    ap.add_argument("--alto", default="")
    ap.add_argument("--dist", default="")
    a = ap.parse_args()
    os.makedirs(a.salida, exist_ok=True)
    tmpdir = tempfile.mkdtemp(prefix="torre3d_")
    html = os.path.join(tmpdir, "torre.html")
    env = dict(os.environ, TORRE_SALIDA=html, TORRE_MODELOS=a.solo, PYTHONIOENCODING="utf-8")
    r = subprocess.run([sys.executable, os.path.join(AQUI, "ensamblar.py")], env=env, capture_output=True, text=True, encoding="utf-8")
    if r.returncode != 0 or "FALTA" in r.stdout or "NO ENCONTRADO" in (r.stdout + r.stderr):
        print("ensamblar.py fallo:\n", r.stdout[-2000:], r.stderr[-2000:]); sys.exit(1)
    t = open(html, encoding="utf-8").read()
    i = t.rfind("})();\n</script>")
    t = "<!doctype html><meta charset=utf-8>" + t[:i] + GANCHO + t[i:]
    open(html, "w", encoding="utf-8").write(t)
    chrome = next((c for c in CHROMES if os.path.exists(c)), None)
    perfil = os.path.join(tmpdir, "perfil")
    for eq in a.equipos:
        frag = "#prueba3d&eq=" + eq + ("&base=1" if a.base else "") + ("&cerca=1" if a.cerca else "") \
               + ("&angs=" + a.angs if a.angs else "") + ("&alto=" + a.alto if a.alto else "") + ("&dist=" + a.dist if a.dist else "")
        png = os.path.join(a.salida, eq + ("_base" if a.base else "") + ("_cerca" if a.cerca else "") + ".png")
        url = "file:///" + html.replace("\\", "/") + frag
        cmd = [chrome, "--headless=new", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--hide-scrollbars",
               "--user-data-dir=" + perfil, "--window-size=2280,1000", "--virtual-time-budget=25000",
               "--screenshot=" + png, url]
        t0 = time.time()
        # con la maquina cargada Chrome a veces se cuelga: se reintenta una vez y se sigue
        for intento in range(2):
            try:
                subprocess.run(cmd, capture_output=True, timeout=240)
                break
            except subprocess.TimeoutExpired:
                print("    (Chrome no respondio con %s, %s)" % (eq, "se reintenta" if not intento else "se salta"))
        print(("OK  " if os.path.exists(png) else "MAL ") + png + "  (%.0f s)" % (time.time() - t0))
    try:
        import shutil; shutil.rmtree(tmpdir, ignore_errors=True)
    except Exception:
        pass


if __name__ == "__main__":
    main()
