Hi Figma Make,

I'd like to enhance the landing page with **interactive animations** for the path selection cards. The goal is to create an engaging, memorable first impression while maintaining performance and accessibility.

---

## 🎯 Goal

Enhance the **existing landing page path selection cards** (Employer + Client) with:

1. **Interactive 3D animations** that respond to user interaction
2. **Cookie-based auto-redirect** for returning users
3. **Subtle background effects** (optional, lazy-loaded)
4. **Smooth, professional animations** that showcase technical sophistication

**Important**: This should enhance the existing landing page, NOT create a separate entry screen gate.

---

## 🎨 Animation Specifications

### **Primary Animation: 3D Card Flip Effect**

**Target:** Path Selection Cards (Employer + Client cards)

**Animation Type:** 3D CSS Transform + Framer Motion

**Behavior:**

1. **Initial State:**

   - Cards are flat (no rotation)
   - Subtle shadow
   - Normal hover state with slight scale-up

2. **On Hover:**

   - **3D Flip Effect**: Card rotates on Y-axis (perspective: 1000px)
   - Rotation: 0° → 15° (subtle, not full flip)
   - Scale: 1.0 → 1.05 (slight lift)
   - Shadow: Increases (elevation effect)
   - Duration: 0.3s with ease-out timing
   - **Particle Trail**: Subtle particle effect follows mouse cursor around card edges

3. **On Click/Tap:**

   - Card completes full rotation (0° → 180°)
   - Reveals back side with checkmark/confirmation
   - Smooth transition to next page
   - Duration: 0.6s with ease-in-out timing

4. **Selection State:**
   - Selected card: Glowing border (blue for employer, purple for client)
   - Unselected card: Fades slightly (opacity: 0.6)
   - Smooth transition between states

**Technical Implementation:**

```tsx
// Using Framer Motion (already in dependencies)
import { motion } from "framer-motion";

<motion.div
  className="path-selection-card"
  whileHover={{
    rotateY: 15,
    scale: 1.05,
    z: 50,
    transition: { duration: 0.3, ease: "easeOut" },
  }}
  whileTap={{
    rotateY: 180,
    scale: 1.1,
    transition: { duration: 0.6, ease: "easeInOut" },
  }}
  style={{
    perspective: 1000,
    transformStyle: "preserve-3d",
  }}
>
  {/* Card content */}
</motion.div>;
```

---

### **Secondary Animation: Particle Trail Effect**

**Target:** Around path selection cards

**Animation Type:** Canvas-based particles (lightweight, not Three.js)

**Behavior:**

1. **On Hover:**

   - Particles appear around card edges
   - Follow mouse cursor movement
   - Particles fade out after 1-2 seconds
   - Color matches card theme (blue for employer, purple for client)

2. **Particle Properties:**
   - Count: 20-30 particles per card
   - Size: 2-4px
   - Speed: Slow, gentle movement
   - Lifespan: 1-2 seconds
   - Opacity: Fades from 1.0 to 0

**Technical Implementation:**

```tsx
// Lightweight canvas particle system
// Use requestAnimationFrame for smooth 60fps
// Only render on hover to save performance
```

---

### **Background Animation: Subtle Gradient Shift**

**Target:** Landing page background

**Animation Type:** CSS Gradient Animation (no JS needed)

**Behavior:**

1. **Gradient Animation:**

   - Background gradient slowly shifts colors
   - From: `#F8FAFC` → `#F1F5F9` (current)
   - Adds: Blue and purple tints that pulse gently
   - Duration: 10-15 seconds per cycle
   - Infinite loop with smooth easing

2. **Optional: Lazy-Loaded Three.js Particles** (Only if performance allows)
   - Simple particle system in background
   - Low particle count (50-100)
   - Fade out on mobile devices
   - Only load after initial page render

**Technical Implementation:**

```css
/* CSS Gradient Animation */
@keyframes gradientShift {
  0% {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }
  50% {
    background: linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 100%);
  }
  100% {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }
}

.landing-page {
  animation: gradientShift 15s ease-in-out infinite;
}
```

---

## 🍪 Cookie-Based Auto-Redirect

### **Implementation Requirements**

1. **Cookie Name:** `userPathChoice`
2. **Cookie Value:** `employer` or `client`
3. **Cookie Duration:** 365 days (1 year)
4. **Behavior:**

   - On landing page load, check for cookie
   - If cookie exists and value is `employer` → redirect to `/{locale}/employers`
   - If cookie exists and value is `client` → redirect to `/{locale}/clients`
   - If no cookie → show landing page normally
   - On card selection → save cookie and navigate

5. **Integration with Locale Routing:**
   - Must preserve locale when redirecting
   - Example: `/en` with `userPathChoice=employer` → `/en/employers`
   - Example: `/he` with `userPathChoice=client` → `/he/clients`

**Technical Implementation:**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie"; // Already in dependencies

export default function LandingPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Check cookie on mount
    const userPath = Cookies.get("userPathChoice");

    if (userPath && (userPath === "employer" || userPath === "client")) {
      // Auto-redirect to saved path
      router.push(
        `/${locale}/${userPath === "employer" ? "employers" : "clients"}`
      );
    } else {
      setHasChecked(true);
    }
  }, [locale, router]);

  const handlePathSelection = (path: "employer" | "client") => {
    // Save to cookie
    Cookies.set("userPathChoice", path, {
      expires: 365, // 1 year
      sameSite: "lax",
    });

    // Navigate to selected path
    router.push(`/${locale}/${path === "employer" ? "employers" : "clients"}`);
  };

  if (!hasChecked) {
    return null; // Show loading state while checking
  }

  return (
    <div>
      {/* Landing page content */}
      <PathSelectionCards onSelect={handlePathSelection} />
    </div>
  );
}
```

---

## 📱 Responsive Behavior

### **Desktop (> 1024px):**

- Full 3D card flip animations
- Particle trail effects
- Background gradient animation
- Optional Three.js particles (if enabled)

### **Tablet (768px - 1024px):**

- Reduced 3D rotation (0° → 10° instead of 15°)
- Simplified particle effects (fewer particles)
- No Three.js background particles
- Background gradient animation (lighter)

### **Mobile (< 768px):**

- No 3D flip (use 2D scale instead)
- No particle effects
- No Three.js background
- Simple hover scale effect (1.0 → 1.02)
- Background gradient animation (minimal)

---

## ♿ Accessibility Requirements

1. **Respect `prefers-reduced-motion`:**

   ```css
   @media (prefers-reduced-motion: reduce) {
     .path-selection-card {
       animation: none;
       transform: none;
     }
   }
   ```

2. **Keyboard Navigation:**

   - Cards must be focusable
   - Enter/Space should trigger selection
   - Focus state must be visible (outline + glow)

3. **Screen Reader Support:**

   - All animations must have ARIA labels
   - State changes must be announced
   - Loading states must be accessible

4. **Skip Option:**
   - Add "Skip" button for users who want to explore
   - Should be visible but not intrusive
   - Links to landing page content directly

---

## 🎯 Design Specifications

### **Path Selection Cards**

**Current Design:** (from `LANDING_PAGE_DESIGN.md`)

- Two large cards side by side
- Employer card: Blue gradient background
- Client card: Purple gradient background
- Each card has: Icon, Title, Description, Features list, CTA button

**Enhanced Design:**

- Same layout and content
- Add 3D perspective container
- Add hover glow effect (border)
- Add particle container (position: absolute, behind card)
- Maintain all existing styling

**Card Dimensions:**

- Width: 100% (max-width: 500px each)
- Height: Auto (min-height: 400px)
- Gap between cards: 32px
- Padding: 32px

**Animation Timing:**

- Hover: 0.3s ease-out
- Click: 0.6s ease-in-out
- Particle spawn: 0.1s
- Particle fade: 1-2s

---

## 🚀 Performance Requirements

1. **Animation Performance:**

   - Target: 60fps on desktop
   - Use `transform` and `opacity` only (GPU-accelerated)
   - Avoid layout-triggering properties

2. **Lazy Loading:**

   - Three.js particles (if used): Load after initial render
   - Particle system: Only initialize on hover
   - Background gradient: CSS-only (no JS)

3. **Mobile Optimization:**

   - Disable heavy animations on mobile
   - Use CSS animations instead of JS where possible
   - Reduce particle count to 0 on mobile

4. **Bundle Size:**
   - Framer Motion: Already in dependencies (OK to use)
   - Three.js: Only import if enabled (conditional import)
   - Particle system: Custom lightweight implementation (no library)

---

## 📦 Dependencies

**Already Available:**

- ✅ `framer-motion` (v12.23.3) - For card animations
- ✅ `three` (v0.159.0) - For optional background particles
- ✅ `@react-three/fiber` (v9.2.0) - For React Three.js integration
- ✅ `js-cookie` (v3.0.5) - For cookie management

**No Additional Dependencies Needed** - Use existing libraries!

---

## 🎬 Animation Sequence

### **On Page Load:**

1. Landing page content fades in (0.5s)
2. Path selection cards slide up (staggered, 0.3s delay)
3. Background gradient starts animating

### **On Card Hover:**

1. Card rotates slightly (15° on Y-axis)
2. Card scales up (1.05x)
3. Shadow increases (elevation)
4. Particles spawn around edges
5. Particles follow mouse cursor

### **On Card Click:**

1. Card completes full rotation (180°)
2. Back side shows confirmation
3. Cookie saved
4. Page transition to `/employers` or `/clients`
5. Smooth fade-out transition

### **On Return Visit (Cookie Exists):**

1. Landing page loads
2. Cookie checked (immediate)
3. Auto-redirect to saved path
4. No animation shown (instant redirect)

---

## 📝 Implementation Checklist

**What to Implement:**

- [ ] 3D card flip animation on path selection cards
- [ ] Particle trail effect on hover
- [ ] Cookie-based auto-redirect logic
- [ ] Background gradient animation
- [ ] Responsive behavior (desktop/tablet/mobile)
- [ ] Accessibility support (reduced motion, keyboard nav)
- [ ] Skip button for accessibility
- [ ] Loading state while checking cookie
- [ ] Smooth page transitions
- [ ] Optional Three.js background particles (lazy-loaded)

**What NOT to Implement:**

- ❌ Separate entry screen gate
- ❌ Full-screen blocking animation
- ❌ Heavy Three.js scenes (unless optional and lazy-loaded)
- ❌ Complex particle systems (keep it lightweight)

---

## 🎨 Visual Reference

**Card Hover State:**

- Rotation: 15° on Y-axis (subtle 3D effect)
- Scale: 1.05x
- Shadow: Increased (elevation: 8px → 16px)
- Border: Glowing (blue for employer, purple for client)
- Particles: 20-30 particles around edges

**Card Click State:**

- Rotation: 180° (full flip)
- Scale: 1.1x
- Back side: Shows checkmark + "Selected!" message
- Transition: Smooth to next page

**Background Animation:**

- Gradient shifts between slate colors
- Adds subtle blue/purple tints
- Very slow, gentle animation
- Non-intrusive, doesn't distract

---

## 🔍 Testing Requirements

1. **Performance Tests:**

   - Animation runs at 60fps on desktop
   - No jank or stuttering
   - Mobile performance is acceptable

2. **Accessibility Tests:**

   - Reduced motion works correctly
   - Keyboard navigation works
   - Screen readers announce state changes
   - Focus states are visible

3. **Functionality Tests:**

   - Cookie saves correctly
   - Auto-redirect works on return visits
   - Locale is preserved in redirects
   - Navigation works correctly

4. **Browser Tests:**
   - Works in Chrome, Firefox, Safari, Edge
   - Graceful degradation for older browsers
   - Mobile browsers (iOS Safari, Chrome Mobile)

---

## 💡 Additional Suggestions

1. **Add Loading State:**

   - Show subtle loading indicator while checking cookie
   - Prevents flash of content before redirect

2. **Add Skip Option:**

   - Small "Skip" button in top-right
   - Allows users to explore landing page
   - Useful for accessibility

3. **Add Sound Effects (Optional):**

   - Subtle "whoosh" sound on card flip
   - Only if user hasn't disabled sounds
   - Very quiet, professional tone

4. **Add Analytics:**
   - Track which path users choose
   - Track return visitor rate
   - Track animation interaction

---

## 📚 Reference Files

- **Landing Page Design:** `docs/figma-design/LANDING_PAGE_DESIGN.md`
- **Design Specifications:** `docs/figma-design/DESIGN_SPECIFICATIONS.md`
- **Component Breakdown:** `docs/figma-design/COMPONENT_BREAKDOWN.md`

---

## ❓ Questions?

If you need clarification on:

- Animation timing or easing
- Cookie implementation details
- Performance optimization
- Accessibility requirements

Please let me know!

---

**Priority:** Medium - This is an enhancement, not critical. The landing page works fine without it, but this would make it more engaging and memorable.

**Timeline:** Can be implemented after employer/client pages are complete.

Thank you!
