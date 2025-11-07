# 3D Models Directory

This directory contains 3D models for the Path Selection component.

## Current Models

- **Bull Head** (`bull_head_1k.blend`) - Assigned to **Employers** card
- **Lion Head** (`lion_head_1k.blend`) - Assigned to **Clients** card
- **Horse Head** (`horse_head_1k.blend`) - Assigned to **Browse** card

## Converting Blender Files to GLB

Your models are currently in `.blend` format (Blender files). To use them in Three.js, you need to export them as `.glb` format.

### Option 1: Using Blender (Recommended)

1. Open Blender
2. Open each `.blend` file
3. Go to **File → Export → glTF 2.0 (.glb/.gltf)**
4. Select **glTF Binary (.glb)** format
5. In export settings:
   - Check **Selected Objects** (if you only want the head)
   - Check **Apply Modifiers**
   - Uncheck **Images** (textures will be separate)
   - Or check **Images** to embed textures
6. Click **Export glTF 2.0**
7. Save as:
   - `bull_head_1k.glb` → place in `public/models/`
   - `lion_head_1k.glb` → place in `public/models/`
   - `horse_head_1k.glb` → place in `public/models/`

### Option 2: Online Converter

If you don't have Blender:

1. Use an online converter like:
   - https://products.aspose.app/3d/conversion/blend-to-gltf
   - https://www.aconvert.com/3d/blend-to-gltf/
2. Upload your `.blend` files
3. Download the `.glb` files
4. Place them in `public/models/`

### Option 3: Using Blender CLI (Automated)

If you have Blender installed, you can use a script:

```bash
# Install Blender command line tools
# Then run:
blender --background --python export_models.py
```

## File Structure

After conversion, your `public/models/` directory should look like:

```
public/
  models/
    bull_head_1k.glb      ← Employers card
    lion_head_1k.glb      ← Clients card
    horse_head_1k.glb     ← Browse card
```

## Texture Files

Your texture files are already in the model folders:

- `bull_head_diff_1k.jpg` - Diffuse texture
- `bull_head_metal_1k.exr` - Metallic texture
- `bull_head_nor_gl_1k.exr` - Normal map
- `bull_head_rough_1k.exr` - Roughness map

**Note:** If you export with textures embedded (check "Images" in Blender), the textures will be included in the `.glb` file. Otherwise, you'll need to copy the texture files to `public/models/textures/` and update the paths in the component.

## Model Assignments

- **Bull** (`bull_head_1k.glb`) → **Employers** (Blue card, position: left)
- **Lion** (`lion_head_1k.glb`) → **Clients** (Purple card, position: center)
- **Horse** (`horse_head_1k.glb`) → **Browse** (Green card, position: right)

## Testing

Once you've converted the models:

1. Place `.glb` files in `public/models/`
2. Start your dev server: `npm run dev`
3. Navigate to `/examples` page
4. Go to "3D Animations" tab
5. You should see the 3D models rotating inside the cards!

## Troubleshooting

If models don't appear:

1. Check browser console for errors
2. Verify files are in `public/models/` (not `models/`)
3. Check file names match exactly: `bull_head_1k.glb`, `lion_head_1k.glb`, `horse_head_1k.glb`
4. Ensure files are `.glb` format (not `.gltf` or `.blend`)
5. Check file sizes - very large files may take time to load
