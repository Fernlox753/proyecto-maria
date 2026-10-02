# -*- coding: utf-8 -*-
"""Hornea en Blender (Cycles) el mapa de luz del tajo: tajo_tex/luz.jpg.

Hay que volver a correrlo solo si cambia la forma del tajo (tjSuelo en tajo.js)
o la direccion del sol (TJ_SOL). Las texturas de detalle det_roca.jpg y
det_grava.jpg salen de Poly Haven (CC0: marble_cliff_04 y rocky_trail_02) y no
dependen de esto.

1. Las alturas: en la vista previa local con ?tj=1, en la consola del navegador
   se recorre una grilla de 1 m con window.__TJ.suelo(x, z, o) entre -330 y +330
   (661 x 661, fila = z, columna = x) y se guarda como Float32 en alturas.bin.
2. En segundo plano (tarda ~10 min a 4096 px y 64 muestras en la laptop):
     blender -b --factory-startup --python hornear_tajo.py -- alturas.bin luz.jpg 4096 64

El mapa guarda solo la luz (sol + cielo + rebote, sin el color de la roca), vista
desde arriba: u = (x+E)/2E, v = (z+E)/2E en coordenadas de la pagina. Va dividida
por 4 y en sRGB para caber en un JPG; la pagina la decodifica, la multiplica por 4
y la calibra contra su luz por vertice (tjTexturasTerreno).
"""
import bpy, math, mathutils, numpy as np, sys, time

args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
ALT = args[0] if args else 'alturas.bin'
SAL = args[1] if len(args) > 1 else 'luz.jpg'
R = int(args[2]) if len(args) > 2 else 4096
MUESTRAS = int(args[3]) if len(args) > 3 else 64
E, N = 330.0, 661
ESC = 0.25                       # todo dividido por 4 para que quepa en 8 bits
SOL = (-0.50, 0.62, 0.86)        # TJ_SOL de tajo.js, en three (y arriba)

for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
sc = bpy.context.scene

# la superficie: three (x, y, z) -> Blender (x, -z, y)
H = np.fromfile(ALT, dtype=np.float32).reshape(N, N)
xs = np.linspace(-E, E, N, dtype=np.float32)
X, Z = np.meshgrid(xs, xs)
co = np.stack([X, -Z, H], axis=-1).reshape(-1, 3)
ii, jj = np.meshgrid(np.arange(N - 1), np.arange(N - 1))
a = (jj * N + ii).ravel()
quads = np.stack([a, a + N, a + N + 1, a + 1], axis=1)     # antihorario visto desde arriba
me = bpy.data.meshes.new('tajo')
me.vertices.add(len(co)); me.vertices.foreach_set('co', co.ravel())
me.loops.add(quads.size); me.loops.foreach_set('vertex_index', quads.ravel().astype(np.int32))
me.polygons.add(len(quads))
me.polygons.foreach_set('loop_start', (np.arange(len(quads)) * 4).astype(np.int32))
me.update(calc_edges=True)
me.polygons.foreach_set('use_smooth', np.ones(len(quads), dtype=bool))
uv = me.uv_layers.new(name='luz')
lv = quads.ravel()
uv.data.foreach_set('uv', np.stack([(co[lv, 0] + E) / (2 * E), (-co[lv, 1] + E) / (2 * E)], axis=1).ravel())
ob = bpy.data.objects.new('tajo', me)
sc.collection.objects.link(ob)

# material: un pardo rojizo solo para el color del rebote
mat = bpy.data.materials.new('roca_tajo'); mat.use_nodes = True
nt = mat.node_tree
bsdf = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED')
bsdf.inputs['Base Color'].default_value = (0.32, 0.21, 0.15, 1)
bsdf.inputs['Roughness'].default_value = 1.0
me.materials.append(mat)
img = bpy.data.images.new('luz', R, R, float_buffer=True)
tex = nt.nodes.new('ShaderNodeTexImage'); tex.image = img
uvn = nt.nodes.new('ShaderNodeUVMap'); uvn.uv_map = 'luz'
nt.links.new(uvn.outputs['UV'], tex.inputs['Vector'])
nt.nodes.active = tex

# el sol de la tarde y el cielo
d = mathutils.Vector((SOL[0], -SOL[2], SOL[1])).normalized()
ld = bpy.data.lights.new('sol', 'SUN')
ld.energy = 2.5 * ESC; ld.color = (1.0, 0.63, 0.35); ld.angle = math.radians(1.2)
sol = bpy.data.objects.new('sol', ld); sc.collection.objects.link(sol)
sol.rotation_euler = (-d).to_track_quat('-Z', 'Y').to_euler()
w = sc.world or bpy.data.worlds.new('mundo'); sc.world = w; w.use_nodes = True
bg = next(n for n in w.node_tree.nodes if n.type == 'BACKGROUND')
bg.inputs['Color'].default_value = (0.30 * ESC, 0.43 * ESC, 0.66 * ESC, 1)
bg.inputs['Strength'].default_value = 1.0

try:
    sc.render.engine = 'CYCLES'
except TypeError as e:
    sys.exit('sin Cycles: %s' % e)
sc.cycles.device = 'CPU'
sc.cycles.samples = MUESTRAS
b = sc.render.bake
b.margin = 8; b.use_pass_direct = True; b.use_pass_indirect = True; b.use_pass_color = False
for o in bpy.context.view_layer.objects:
    o.select_set(False)
ob.select_set(True); bpy.context.view_layer.objects.active = ob
t0 = time.time()
bpy.ops.object.bake(type='DIFFUSE')
print('HORNEADO', R, MUESTRAS, round(time.time() - t0, 1), 's')

sc.view_settings.view_transform = 'Standard'
sc.view_settings.look = 'None'
sc.view_settings.exposure = 0
sc.view_settings.gamma = 1
sc.render.image_settings.file_format = 'JPEG'
sc.render.image_settings.quality = 82
img.save_render(SAL, scene=sc)
print('GUARDADO', SAL)
