# Rotation Controls Guide

## 🎯 Three Places Where Rotation is Controlled

### 1. **Individual Model Rotation** (Animal Heads)

**Location:** `Model3D` component, lines 110-114

```tsx
useFrame((state, delta) => {
  if (modelRef.current && gltf?.scene) {
    modelRef.current.rotation.y += delta * 0.5; // ← THIS LINE
  }
});
```

**What it does:**

- Rotates each **individual animal model** (bull, lion, horse) around the Y-axis
- Speed: `0.5` radians per second
- Each model rotates independently

**To change:**

- **Faster rotation:** Increase `0.5` to `1.0`, `1.5`, `2.0`, etc.
- **Slower rotation:** Decrease `0.5` to `0.2`, `0.1`, etc.
- **Stop rotation:** Change to `modelRef.current.rotation.y += 0;` or comment out the line
- **Rotate different axis:** Change `.y` to `.x` or `.z`

**Examples:**

```tsx
// Fast rotation
modelRef.current.rotation.y += delta * 2.0;

// Slow rotation
modelRef.current.rotation.y += delta * 0.1;

// No rotation
modelRef.current.rotation.y += 0;

// Rotate on X axis instead
modelRef.current.rotation.x += delta * 0.5;
```

---

### 2. **Card Group Rotation** (Entire Group)

**Location:** `FloatingCard` component, lines 161-167

```tsx
// Slow rotation
if (!hovered) {
  // initialRotation.current.y += delta * 1;  // ← COMMENTED OUT
  // initialRotation.current.x = Math.cos(timeRef.current * 0.3) * 0.05;  // ← COMMENTED OUT
  meshRef.current.rotation.y = initialRotation.current.y;
  meshRef.current.rotation.x = initialRotation.current.x;
}
```

**What it does:**

- Rotates the **entire card group** (including the model) around Y and X axes
- Currently **commented out** (disabled)
- Only rotates when **not hovered**

**To enable:**

- Uncomment the lines:

```tsx
if (!hovered) {
  initialRotation.current.y += delta * 1; // Y-axis rotation
  initialRotation.current.x = Math.cos(timeRef.current * 0.3) * 0.05; // X-axis wobble
  meshRef.current.rotation.y = initialRotation.current.y;
  meshRef.current.rotation.x = initialRotation.current.x;
}
```

**To customize:**

- **Y-axis speed:** Change `delta * 1` to faster/slower
- **X-axis wobble:** Adjust `0.05` (amplitude) and `0.3` (frequency)

---

### 3. **Background Particles Rotation**

**Location:** `ParticleSystem` component, line 224

```tsx
useFrame(() => {
  if (particlesRef.current) {
    particlesRef.current.rotation.y += 0.0005; // ← THIS LINE
  }
});
```

**What it does:**

- Rotates the **background particle system** very slowly
- Creates a subtle animated background effect
- Speed: `0.0005` radians per frame (very slow)

**To change:**

- **Faster particles:** Increase `0.0005` to `0.001`, `0.002`, etc.
- **Slower particles:** Decrease to `0.0001`, `0.0002`
- **Stop particles:** Change to `0` or comment out

---

## 📝 Summary

| Rotation Type           | Location      | Current Status          | Speed Control |
| ----------------------- | ------------- | ----------------------- | ------------- |
| **Model Rotation**      | Line 112      | ✅ Active               | `delta * 0.5` |
| **Card Group Rotation** | Lines 163-164 | ❌ Disabled (commented) | N/A           |
| **Particle Rotation**   | Line 224      | ✅ Active               | `0.0005`      |

---

## 🎮 Quick Controls

### Stop Model Rotation

```tsx
// Line 112 - Change to:
modelRef.current.rotation.y += 0;
```

### Make Models Rotate Faster

```tsx
// Line 112 - Change to:
modelRef.current.rotation.y += delta * 2.0; // 4x faster
```

### Enable Card Group Rotation

```tsx
// Lines 163-164 - Uncomment:
initialRotation.current.y += delta * 1;
initialRotation.current.x = Math.cos(timeRef.current * 0.3) * 0.05;
```

### Rotate Models on Multiple Axes

```tsx
// Line 112 - Add X rotation:
modelRef.current.rotation.y += delta * 0.5;
modelRef.current.rotation.x += delta * 0.3; // Add this
```

---

## 💡 Tips

1. **Model rotation** (line 112) is the most visible - this is what spins the animal heads
2. **Card group rotation** (lines 163-164) rotates everything together - currently disabled
3. **Particle rotation** (line 224) is subtle - just background ambiance
4. Use `delta` for smooth, frame-rate independent rotation
5. Higher values = faster rotation
6. Lower values = slower rotation
