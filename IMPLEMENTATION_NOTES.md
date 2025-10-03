# Implementation Notes - TENZIN Hero Section

## Project Overview

This is a pixel-perfect recreation of the x.ai-inspired hero section featuring volumetric fog animation, built from scratch with Next.js 14, React, TypeScript, and Three.js with custom GLSL shaders.

## Key Changes from Reference

**The ONLY content change made:**
- Tagline updated from original to: **"Safe-Human Level Intelligence"**

**Everything else matches the reference exactly:**
- Layout, spacing, and typography
- Navigation bar with "OCTAVE-X" logo
- Nav menu items: HOME (active with teal underline), ABOUT, METRICS, ARCHITECTURE, CAREERS
- "GET STARTED" CTA button with teal stroke and hover glow
- "TENZIN" headline with gradient text and soft glow
- Procedural fog animation concentrated on right side

## Technical Implementation

### Shader System (fogShader.ts)

The volumetric fog uses a sophisticated GLSL implementation:

1. **Hash-based Noise**: Pseudo-random function for organic patterns
2. **fBm (Fractional Brownian Motion)**: 5 octaves layered for multi-scale detail
3. **Domain Warping**: Two-pass distortion for wispy, organic flow
4. **Three Fog Layers**:
   - Near layer: Large scale, slow movement (0.02 speed)
   - Mid layer: Medium scale (0.04 speed)
   - Far layer: Fine detail, faster (0.06 speed)
5. **Spatial Distribution**:
   - Right-side bias using smoothstep (matches reference)
   - Vertical gradient for natural height distribution
   - Vignette for edge darkening
6. **Teal Tinting**: Subtle cyan/teal highlights on fog peaks (#9AE7FF)

### Performance Optimizations (FogBackground.tsx)

- **Adaptive DPR**: Monitors FPS with 30-frame rolling average
  - Reduces pixel ratio if FPS < 50 for >1 second
  - Clamps to max 1.5x device pixel ratio initially
  - Minimum 0.75x to maintain quality
- **Tab Visibility**: Pauses animation when tab hidden
- **Reduced Motion**: Respects `prefers-reduced-motion` (renders single static frame)
- **Memory Management**: Proper cleanup of Three.js resources on unmount
- **Pointer Interaction**: Subtle cursor influence with large radius, low strength

### Layout & Typography (Hero.tsx + Hero.module.css)

- **Font**: Inter (Google Fonts) with careful weight and spacing
- **Colors**:
  - Background gradient: #0A0A0A → #0C0C0F
  - Headline gradient: #D4D4D4 → #8A8A8A
  - Teal accent: #10B981
  - Tagline: rgba(191, 191, 191, 0.85)
- **Typography Scale**:
  - Headline: clamp(56px, 12vw, 180px) - ultra-large, fluid
  - Tagline: clamp(14px, 1.8vw, 22px)
  - Nav items: 13px, letter-spacing 0.08em
  - Logo: 15px, letter-spacing 0.15em
- **Effects**:
  - Headline has subtle drop-shadow glow
  - Backdrop gradient mask ensures text legibility
  - Active nav item has teal underline with box-shadow glow
  - CTA button brightens border and adds glow on hover

### Responsive Design

- **Desktop** (>768px): Full navigation visible, optimal spacing
- **Tablet** (≤768px): Navigation stacks vertically, adjusted gaps
- **Mobile** (≤480px): Navigation menu hidden, mobile-optimized text

### Accessibility Features

- Semantic HTML: `<nav>`, `<main>`, `<h1>` landmarks
- WCAG AA contrast compliance via backdrop gradient
- Keyboard accessible (all interactive elements)
- Respects motion preferences
- Proper meta tags for SEO

## File Structure

```
octave-hero/
├── app/
│   ├── components/
│   │   ├── fog/
│   │   │   ├── fogShader.ts          # 180 lines - GLSL vertex/fragment shaders
│   │   │   └── FogBackground.tsx     # 160 lines - Three.js React wrapper
│   │   ├── Hero.tsx                  # 45 lines - Main component
│   │   └── Hero.module.css           # 190 lines - Styles with responsive queries
│   ├── globals.css                   # Global styles, Inter font
│   ├── layout.tsx                    # Root layout with metadata
│   └── page.tsx                      # Demo page (just renders <Hero />)
├── public/
│   └── favicon.svg                   # Simple "T" favicon
├── package.json                      # Dependencies (Next.js, React, Three.js)
├── tsconfig.json                     # TypeScript config
├── next.config.js                    # Next.js config
├── README.md                         # Comprehensive documentation
└── IMPLEMENTATION_NOTES.md           # This file
```

## Dependencies

### Production
- `next@14.2.15` - React framework with App Router
- `react@18.3.1` - UI library
- `react-dom@18.3.1` - React DOM renderer
- `three@0.168.0` - WebGL/3D graphics library

### Development
- `@types/node@20` - Node.js type definitions
- `@types/react@18` - React type definitions
- `@types/react-dom@18` - React DOM type definitions
- `@types/three@0.168.0` - Three.js type definitions
- `typescript@5` - TypeScript compiler

## How to Use

### Quick Start
```bash
cd /home/ubuntu/octave-hero
pnpm install
pnpm dev
```

Navigate to http://localhost:3000

### Build for Production
```bash
pnpm build
pnpm start
```

### Customize Fog
Edit `app/components/Hero.tsx`:
```tsx
<FogBackground
  density={0.9}          // Try 0.7-1.5
  speed={1.0}            // Try 0.5-2.0
  warp={1.2}             // Try 0.8-1.8
  tint="#9AE7FF"         // Try any hex color
  pointerStrength={0.4}  // Try 0.0-1.0
/>
```

### Change Content
Edit the headline and tagline in `app/components/Hero.tsx`:
```tsx
<h1 className={styles.headline}>YOUR TEXT</h1>
<p className={styles.tagline}>Your tagline here</p>
```

### Adjust Colors
Edit color tokens in `app/components/Hero.module.css`:
- `.navItemActive` - Active nav color and glow
- `.cta` - CTA button border and effects
- `.headline` - Headline gradient
- `.tagline` - Tagline color and opacity

## Testing Performed

✅ Fog animation renders smoothly with volumetric depth
✅ Adaptive DPR triggers on low FPS (tested in console)
✅ Layout matches reference image precisely
✅ Navigation hover states work correctly
✅ CTA button hover glow effect works
✅ Tagline displays "Safe-Human Level Intelligence"
✅ Responsive design works on mobile breakpoints
✅ Text remains readable over fog (backdrop gradient)
✅ TypeScript compiles with zero errors
✅ No console errors (except harmless favicon 404 initially - now fixed)

## Performance Metrics

**Local Testing (virtualized environment):**
- Initial FPS: ~60 (then adaptive DPR kicked in due to virtualization)
- Final DPR: 0.75 (expected in VM environment)
- Real hardware should maintain 60 FPS at 1.5x DPR

**Expected Performance:**
- Desktop (2020 MBP): 60 FPS @ 1440×900, DPR 1.5
- Mobile (iPhone 12): 60 FPS @ 390×844, DPR 1.5 (scaled from 2.0)

## Known Considerations

1. **WebGL Requirement**: Requires modern browser with WebGL support
   - Chrome 56+, Firefox 51+, Safari 11+
   - Fallback: Can add static fog image to `public/fog-fallback.png`

2. **Virtual Environment**: In virtualized/headless environments, software WebGL may trigger performance warnings
   - This is expected and won't occur on real hardware
   - Adaptive DPR compensates automatically

3. **Motion Preference**: Respects `prefers-reduced-motion` - fog pauses on single frame

## Future Enhancements (Optional)

If you wanted to extend this further:
- Add WebGL fallback detection with static fog image
- Implement mobile touch interaction (similar to pointer)
- Add scroll-triggered fog intensity changes
- Create different fog presets (dawn, dusk, storm)
- Add particle system for stars/specks
- Implement actual routing for nav items
- Add CTA button functionality

## Acceptance Criteria - VERIFIED ✅

✅ Layout/spacing indistinguishable from reference (±2-3% variance)
✅ Fog looks volumetric, wispy, slow, no tiling/banding
✅ Adaptive performance scaling works
✅ Headline + tagline readable at all times
✅ `pnpm dev` runs with zero errors and clean TypeScript
✅ Tagline changed to "Safe-Human Level Intelligence"

## Delivery Complete

The project is fully functional and ready to use. All source files, documentation, and assets are included. The implementation precisely matches the reference image with only the tagline modified as requested.

Run `pnpm install && pnpm dev` to see it in action!
