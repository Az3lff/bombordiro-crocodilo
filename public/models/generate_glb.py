import numpy as np
import trimesh
from trimesh.creation import box
from trimesh.scene import Scene

# Цвета RGBA
COLORS = {
    0: [255, 255, 255, 0],     # пусто
    1: [50, 50, 50, 255],      # стена горизонтальная
    2: [70, 70, 70, 255],      # стена вертикальная
    4: [0, 255, 0, 255],       # финиш
    5: [255, 255, 0, 255],     # точка интереса
    6: [0, 0, 255, 255],       # спаун
}

BLOCK_SIZE = 1.0

def make_block(x, y, cell_type):
    color = COLORS.get(cell_type, [255, 0, 0, 255])

    # Размеры: [X, Y, Z] → XZ — плоскость карты, Y — вверх
    if cell_type == 1:
        # Горизонтальная стена: тонкая по Z
        width, height, depth = 1.0, 1.0, 0.1
    elif cell_type == 2:
        # Вертикальная стена: тонкая по X
        width, height, depth = 0.1, 1.0, 1.0
    elif cell_type == 0:
        return None
    else:
        # Плоские плитки (финиш/интерес/спаун)
        width, height, depth = BLOCK_SIZE, 0, BLOCK_SIZE

    # Создаём меш
    mesh = box(extents=(width, height, depth))
    # Смещение: X, Y (вверх), Z
    mesh.apply_translation([
        x * BLOCK_SIZE,
        -0.166,              # Высота относительно пола
        y * BLOCK_SIZE           # Прямое направление (без инверсии)
    ])
    mesh.visual.face_colors = np.tile(color, (mesh.faces.shape[0], 1))
    return mesh

def array_to_glb(array, output_path="map.glb"):
    scene = Scene()
    for y, row in enumerate(array):
        for x, val in enumerate(row):
            mesh = make_block(x, -y, val)  # -y: чтобы [0][0] была сверху, как в 2D
            if mesh:
                scene.add_geometry(mesh)
    scene.export(output_path)
    print(f"✅ Файл сохранён как {output_path}")

# Пример карты
map_array = [
    [1, 1, 1, 1, 1],
    [2, 0, 5, 0, 2],
    [2, 0, 0, 0, 2],
    [2, 6, 0, 4, 2],
    [1, 1, 1, 1, 1],
]

array_to_glb(map_array, "map.glb")
