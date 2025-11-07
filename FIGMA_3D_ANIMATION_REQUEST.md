Hi Figma Make,

I'd like to enhance the landing page with **interactive 3D animations using Three.js** for the path selection cards. The goal is to create a truly memorable, cinematic first impression that showcases technical sophistication.

---

## 🎯 Goal

Replace the path selection cards with **interactive 3D cards** that:
1. **Float and rotate in 3D space** (not just CSS transforms)
2. **Respond to mouse movement** (orbit controls, hover effects)
3. **Use Three.js** for true 3D rendering
4. **Cookie-based auto-redirect** for returning users
5. **Create a memorable, impressive experience**

**Important**: This should enhance the existing landing page, NOT create a separate entry screen gate.

---

## 🎨 3D Animation Specifications

### **Primary: 3D Floating Cards in Space**

**Target:** Path Selection Cards (Employer + Client)

**Technology:** Three.js with React Three Fiber (already in dependencies)

**3D Scene Setup:**

1. **Scene Configuration:**
   - Camera: PerspectiveCamera (75° FOV)
   - Controls: OrbitControls (mouse orbit, scroll zoom)
   - Lighting: Ambient + 2 Directional lights
   - Background: Subtle particle system or gradient

2. **Card 3D Models:**
   - **Geometry**: 3D Box (width: 4, height: 6, depth: 0.2)
   - **Material**: MeshStandardMaterial with gradient colors
   - **Employer Card**: Blue gradient (#2563EB → #06B6D4)
   - **Client Card**: Purple gradient (#9333EA → #EC4899)
   - **Text**: Canvas texture on front face
   - **Glow Effect**: Emissive material around edges

3. **Card Positioning:**
   - Employer card: Position (-5, 0, 0) in 3D space
   - Client card: Position (5, 0, 0) in 3D space
   - Camera: Position (0, 0, 15) looking at center
   - Cards float in space with animation

4. **Animation Behavior:**

   **Idle Animation:**
   - Cards float up/down (sine wave: ±0.5 units)
   - Cards slowly rotate on Y and X axes
   - Continuous, smooth motion
   - Duration: ~8-10 seconds per cycle

   **Hover Animation:**
   - Card scales up (1.0 → 1.1)
   - Glow effect intensifies
   - Rotation pauses
   - Smooth lerp transition

   **Click Animation:**
   - Card scales up dramatically (1.0 → 1.5)
   - Card rotates to face camera
   - Particle burst effect
   - Then navigates to selected path

**Technical Implementation:**

```tsx
'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, MeshDistortMaterial } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

function FloatingCard({ position, color1, color2, text, icon, type, onSelect }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    timeRef.current += delta;
    
    // Float animation
    meshRef.current.position.y = position[1] + Math.sin(timeRef.current) * 0.5;
    meshRef.current.rotation.y = Math.sin(timeRef.current * 0.5) * 0.1;
    meshRef.current.rotation.x = Math.cos(timeRef.current * 0.3) * 0.05;
    
    // Hover scale
    const targetScale = hovered ? 1.1 : 1.0;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group
      ref={meshRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={() => onSelect(type)}
    >
      {/* Card box */}
      <mesh>
        <boxGeometry args={[4, 6, 0.2]} />
        <meshStandardMaterial
          color={color1}
          emissive={color1}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      {/* Text on front */}
      <Text
        position={[0, 0, 0.11]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {icon}\n{text}
      </Text>
      
      {/* Glow effect */}
      {hovered && (
        <mesh>
          <boxGeometry args={[4.2, 6.2, 0.3]} />
          <meshStandardMaterial
            color={color1}
            emissive={color1}
            emissiveIntensity={0.8}
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
}

export default function PathSelection3D() {
  const handleSelect = (type) => {
    const path = type === 'employer' ? 'employers' : 'clients';
    // Save cookie and navigate
    Cookies.set('userPathChoice', type, { expires: 365 });
    router.push(`/${locale}/${path}`);
  };

  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, -5]} intensity={0.4} />
      
      {/* Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={8}
        maxDistance={25}
        enablePan={false}
      />
      
      {/* Cards */}
      <FloatingCard
        position={[-5, 0, 0]}
        color1="#2563EB"
        color2="#06B6D4"
        text="For Employers"
        icon="💼"
        type="employer"
        onSelect={handleSelect}
      />
      
      <FloatingCard
        position={[5, 0, 0]}
        color1="#9333EA"
        color2="#EC4899"
        text="For Clients"
        icon="🚀"
        type="client"
        onSelect={handleSelect}
      />
      
      {/* Background particles */}
      <ParticleSystem count={500} />
    </Canvas>
  );
}
```

---

### **Secondary: Background Particle System**

**Target:** 3D scene background

**Animation Type:** Three.js Points system

**Behavior:**

1. **Particle System:**
   - Count: 300-500 particles
   - Position: Random distribution in 3D space
   - Size: 0.1-0.2 units
   - Color: Subtle gray/white (0x888888)
   - Opacity: 0.4-0.6

2. **Animation:**
   - Particles slowly rotate around Y-axis
   - Creates depth and atmosphere
   - Non-intrusive, doesn't distract

3. **Performance:**
   - Lazy-loaded after initial render
   - Reduced particle count on mobile
   - Can be disabled on low-end devices

---

### **Interactive Controls**

1. **Orbit Controls:**
   - Mouse drag: Orbit around cards
   - Scroll: Zoom in/out
   - Limits: Min distance 8, Max distance 25
   - Pan disabled (focus on cards)

2. **Hover Detection:**
   - Raycaster detects mouse over cards
   - Cursor changes to pointer
   - Card scales up and glows

3. **Click Detection:**
   - Raycaster detects click on card
   - Triggers selection animation
   - Saves cookie and navigates

---

## 🍪 Cookie-Based Auto-Redirect

Same as before - check cookie on load, auto-redirect if exists.

---

## 📱 Responsive Behavior

### **Desktop (> 1024px):**
- Full 3D scene with orbit controls
- All animations enabled
- Particle system active
- Smooth 60fps performance

### **Tablet (768px - 1024px):**
- Reduced particle count (200-300)
- Simplified lighting
- Orbit controls enabled
- Still fully interactive

### **Mobile (< 768px):**
- **Fallback to 2D**: If performance is poor, use CSS animations
- Or: Simplified 3D scene (fewer particles, lower quality)
- Touch controls for orbit
- Reduced animation complexity

---

## ♿ Accessibility Requirements

1. **Reduced Motion:**
   - Detect `prefers-reduced-motion`
   - Fallback to static 2D cards
   - No animations if disabled

2. **Keyboard Navigation:**
   - Tab between cards
   - Enter/Space to select
   - Focus indicators visible

3. **Screen Reader:**
   - ARIA labels on 3D cards
   - Announce card selection
   - Describe 3D scene

---

## 🚀 Performance Requirements

1. **Three.js Optimization:**
   - Use `@react-three/fiber` for React integration
   - Lazy-load Three.js after initial render
   - Use `useFrame` for animations (efficient)
   - Limit particle count based on device

2. **Loading Strategy:**
   - Show loading state while Three.js loads
   - Progressive enhancement (works without 3D)
   - Fallback to 2D cards if 3D fails

3. **Bundle Size:**
   - Three.js: ~500KB (already in dependencies)
   - React Three Fiber: ~100KB (already in dependencies)
   - Total: Acceptable for the impact

---

## 🎬 Animation Sequence

### **On Page Load:**
1. Show loading state (1-2 seconds)
2. 3D scene initializes
3. Cards fade in from center
4. Cards float to their positions
5. Particle system starts rotating

### **On Hover:**
1. Card scales up (1.0 → 1.1)
2. Glow effect intensifies
3. Card rotation pauses
4. Cursor changes to pointer

### **On Click:**
1. Card scales dramatically (1.0 → 1.5)
2. Card rotates to face camera
3. Particle burst effect
4. Cookie saved
5. Smooth transition to next page

### **On Return Visit (Cookie Exists):**
1. Landing page loads
2. Cookie checked (immediate)
3. Auto-redirect (no 3D scene shown)

---

## 📦 Dependencies

**Already Available:**
- ✅ `three` (v0.159.0) - Three.js core
- ✅ `@react-three/fiber` (v9.2.0) - React renderer for Three.js
- ✅ `@react-three/drei` (v10.5.1) - Helpful Three.js utilities
- ✅ `js-cookie` (v3.0.5) - Cookie management

**No Additional Dependencies Needed!**

---

## 🎨 Visual Reference

**3D Scene:**
- Two 3D cards floating in space
- Cards slowly rotate and float
- Background particles create depth
- Camera orbits around center
- Cards glow when hovered

**Card Appearance:**
- 3D box geometry (4x6x0.2 units)
- Gradient materials (blue/purple)
- Text on front face
- Emissive glow on hover
- Smooth, professional look

**Interaction:**
- Mouse movement orbits camera
- Scroll zooms in/out
- Hover highlights card
- Click selects and navigates

---

## 🔍 Technical Details

### **Three.js Setup:**

```tsx
// Scene configuration
<Canvas
  camera={{ position: [0, 0, 15], fov: 75 }}
  gl={{ antialias: true, alpha: true }}
  dpr={[1, 2]} // Device pixel ratio
>
  {/* Scene content */}
</Canvas>
```

### **Performance Optimization:**

1. **Lazy Loading:**
   ```tsx
   const PathSelection3D = dynamic(() => import('./PathSelection3D'), {
     ssr: false, // No SSR for 3D
     loading: () => <LoadingState />
   });
   ```

2. **Conditional Rendering:**
   ```tsx
   const isMobile = window.innerWidth < 768;
   const particleCount = isMobile ? 100 : 500;
   ```

3. **Frame Rate Control:**
   ```tsx
   useFrame((state, delta) => {
     // Limit to 60fps
     if (delta > 0.016) return;
     // Animation code
   });
   ```

---

## 📝 Implementation Checklist

**What to Implement:**

- [ ] Three.js scene setup with Canvas
- [ ] 3D floating cards (employer + client)
- [ ] Orbit controls for camera
- [ ] Hover detection with raycasting
- [ ] Click detection and selection
- [ ] Particle background system
- [ ] Cookie-based auto-redirect
- [ ] Loading state while 3D loads
- [ ] Responsive behavior (mobile fallback)
- [ ] Accessibility support (reduced motion)
- [ ] Performance optimization

**What NOT to Implement:**

- ❌ Separate entry screen gate
- ❌ Full-screen blocking animation
- ❌ Heavy complex 3D models
- ❌ Unnecessary particle effects

---

## 💡 Additional Suggestions

1. **Add Loading Animation:**
   - Show 3D loading spinner
   - Progressive loading of 3D assets
   - Smooth transition when ready

2. **Add Sound Effects (Optional):**
   - Subtle "whoosh" on card hover
   - "Click" sound on selection
   - Only if user hasn't disabled sounds

3. **Add Analytics:**
   - Track 3D interaction rate
   - Track which card is selected
   - Track time spent on landing page

4. **Progressive Enhancement:**
   - If Three.js fails to load → fallback to 2D cards
   - If performance is poor → simplify or disable
   - Always have a working fallback

---

## 📚 Reference

I've created a **demo file** (`animation-demo-3d.html`) that shows the exact 3D effect I'm envisioning. You can open it in a browser to see:
- 3D cards floating in space
- Orbit controls
- Hover effects
- Click selection
- Particle background

---

## ❓ Questions?

If you need clarification on:
- Three.js implementation details
- React Three Fiber setup
- Performance optimization
- Fallback strategies
- Accessibility requirements

Please let me know!

---

**Priority:** Medium-High - This would create a truly memorable first impression and showcase technical skills.

**Timeline:** Can be implemented after employer/client pages are complete, or in parallel if resources allow.

**Note:** The demo file (`animation-demo-3d.html`) shows exactly what I'm looking for. Open it in a browser to see the 3D effect in action!

Thank you!

