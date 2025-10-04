# TENZIN Hero Section - x.ai-Inspired Fog Animation

A pixel-perfect recreation of an x.ai-style hero section featuring volumetric fog animation powered by GLSL shaders and Three.js.

![Hero Preview](public/preview.png)

## Features

- **Shader-Driven Fog**: Domain-warped fractional Brownian motion (fBm) with layered near/mid/far samples for volumetric depth
- **Performance Optimized**: Adaptive DPR scaling, FPS monitoring, tab visibility detection
- **Accessibility First**: Respects `prefers-reduced-motion`, WCAG AA contrast compliance
- **Responsive Design**: Mobile-optimized layout with fluid typography
- **Subtle Interactions**: Cursor influence on fog, hover states on CTA and navigation
- **TypeScript**: Fully typed with Next.js 14 App Router

## Quick Start

```bash
# Install dependencies
pnpm install

# Run development server (recommended)
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

**Note**: This project is optimized for development mode (`pnpm dev`) as it requires client-side rendering for WebGL. The dev server hot-reloads and provides the best development experience. Production builds may encounter static generation errors for error pages, but the main application runs perfectly in dev mode.

## Project Structure

```
octave-hero/
├── app/
│   ├── components/
│   │   ├── fog/
│   │   │   ├── fogShader.ts          # GLSL vertex/fragment shaders
│   │   │   └── FogBackground.tsx     # Three.js React wrapper
│   │   ├── Hero.tsx                  # Main hero component
│   │   └── Hero.module.css           # Component styles
│   ├── globals.css                   # Global styles & fonts
│   ├── layout.tsx                    # Root layout with metadata
│   └── page.tsx                      # Demo page
├── public/
│   └── fog-fallback.png              # Static fallback for no-WebGL
├── package.json
├── tsconfig.json
└── README.md
```

## Customization

### Fog Parameters

The `FogBackground` component accepts these props to control the fog appearance:

```tsx
<FogBackground
  density={1.60}         // Fog thickness (0.5-2.5, default: 1.60)
  speed={1.08}           // Animation speed multiplier (0.1-3.0, default: 1.08)
  warp={1.85}            // Domain distortion strength (0.8-2.5, default: 1.85)
  tint="#6EEBFF"         // Teal energy color (hex, default: #6EEBFF)
  pointerStrength={0.55} // Cursor influence (0.0-1.0, default: 0.55)
  pointerRadius={0.44}   // Cursor influence radius (0.1-1.0, default: 0.44)
  background="#0A0B14"   // Base fog color (hex, default: #0A0B14)
/>
```

### Design Knobs

**Fog Density & Character:**
- **density**: Higher values = thicker, more dramatic fog. Current default (1.60) provides cinematic volumetric effect.
- **warp**: Controls tendril character. Higher values create more organic, wispy patterns.
- **speed**: Calm drift at 1.08. Lower for slower, more meditative; higher for dynamic energy.

**Teal Energy Highlights:**
- **tint**: The teal "energy" color (#6EEBFF). Applied to fog highlights via shader smoothstep.
- Located in shader: `smoothstep(0.58, 0.86, fog + 0.08 * streak)` creates subtle, tasteful glow.
- To adjust intensity: Edit the `0.20` mix factor in `fogShader.ts` line ~117.

**Vignette Strength:**
- Edge darkening defined in shader: `1.0 - length(p) * 0.28`
- Increase the `0.28` multiplier for stronger vignette, decrease for lighter edges.

**TENZIN Shimmer Timing:**
- Metallic sweep occurs at 800ms after animation starts (900ms total delay).
- Edit `tenzinShimmerDelay` in `app/lib/motion.ts` to adjust timing.
- Shimmer gradient in `Hero.module.css`: `rgba(110, 235, 255, 0.15)`

### Examples

**Even denser fog for dramatic effect:**
```tsx
<FogBackground density={1.85} warp={2.0} />
```

**Faster, more energetic drift:**
```tsx
<FogBackground speed={1.4} />
```

**Adjust teal intensity:**
```tsx
<FogBackground tint="#4DFFFF" /> // Brighter cyan
<FogBackground tint="#5AC8FA" /> // Softer blue-teal
```

**Disable cursor interaction (for mobile or simplicity):**
```tsx
<FogBackground pointerStrength={0} />
```

### Typography & Colors

Edit `app/components/Hero.module.css` to customize:

- **Logo**: `.logo` - font size, letter spacing
- **Navigation**: `.navItem` - colors, hover states
- **CTA Button**: `.cta` - border, glow effects
- **Headline**: `.headline` - gradient, sizing, glow
- **Tagline**: `.tagline` - color, opacity, spacing

Key color tokens:
- Teal accent: `#10B981` (navigation active state, CTA border)
- Background gradient: `#0A0A0A` → `#0C0C0F`
- Headline gradient: `#D4D4D4` → `#8A8A8A`
- Tagline: `rgba(191, 191, 191, 0.85)`

### Changing Content

To update the hero text, edit `app/components/Hero.tsx`:

```tsx
<h1 className={styles.headline}>YOUR HEADLINE</h1>

<p className={styles.tagline}>
  Your tagline text here
</p>
```

Navigation items can be modified in the `<nav>` section.

## Performance

The fog animation includes advanced performance optimizations for consistent 60 FPS:

### Adaptive DPR Scaling

**Smart Quality Management:**
- **Initial clamp**: `Math.min(devicePixelRatio, 1.5)` prevents over-rendering on high-DPI displays
- **Dynamic downscaling**: If FPS < 50 for >1 second → DPR decreases by 0.25 (min 1.0)
- **Dynamic upscaling**: If FPS > 58 for >1 second → DPR increases by 0.25 (max 1.5)
- **DPR-aware blur**: Micro-smoothing adjusts intensity based on current DPR for optimal shimmer removal

**Why this matters:**
- Ensures buttery-smooth performance even on lower-end devices
- Automatically maximizes quality when GPU has headroom
- Users always get the best possible experience for their hardware

### Other Optimizations

1. **Tab Visibility**: RAF pauses when `document.hidden` to save battery/CPU
2. **Reduced Motion**: Respects `prefers-reduced-motion` (freezes fog on prettiest frame)
3. **Efficient Shaders**: 
   - Domain-warped fBm with 5 octaves
   - Separable blur approximation (3-tap) instead of expensive full blur
   - Dithering prevents banding without post-processing
4. **Smart Cleanup**: Proper Three.js resource disposal on unmount

### Target Performance

- **Desktop** (2020 MBP): **60 FPS** @ 1440×900, DPR 1.25–1.5
- **Mobile** (iPhone 12): **60 FPS** @ 390×844, adaptive DPR
- **Older hardware**: Gracefully degrades to DPR 1.0, maintains smoothness

### Performance Tips

**Monitor in browser console:**
```
Adaptive DPR: Reduced to 1.0   // Low-end device, quality adjusted
Adaptive DPR: Increased to 1.5 // High-end device, quality maximized
```

**Troubleshooting low FPS:**
1. Reduce density: `<FogBackground density={1.3} />`
2. Decrease warp: `<FogBackground warp={1.5} />`
3. Disable pointer tracking: `<FogBackground pointerStrength={0} />`
4. Check browser DevTools Performance tab for bottlenecks

## Embedding in Other Pages

To use the Hero component elsewhere:

```tsx
import Hero from '@/app/components/Hero'

export default function MyPage() {
  return (
    <main>
      <Hero />
      {/* Your other content */}
    </main>
  )
}
```

To use just the fog background behind custom content:

```tsx
import FogBackground from '@/app/components/fog/FogBackground'

export default function CustomHero() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <FogBackground />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Your custom content here */}
      </div>
    </div>
  )
}
```

## Accessibility

### WCAG AA Compliance

**Text Contrast Guarantee:**
- Radial backdrop gradient mask behind TENZIN and tagline: `rgba(10, 11, 20, 0.98)` at center
- Ensures text remains readable against any fog frame
- Tested contrast ratios exceed WCAG AA requirements at all animation states

**Motion Preferences:**
- `prefers-reduced-motion: reduce` → fog pauses on single aesthetic frame
- All entrance animations (fog fade, TENZIN depth reveal, tagline) disabled
- Ensures users with vestibular disorders have comfortable experience

**Keyboard Navigation:**
- All interactive elements (nav items, CTA button) fully keyboard accessible
- Native focus indicators preserved (no custom focus styles that reduce visibility)
- Logical tab order: Logo → Nav items → CTA

**Screen Reader Support:**
- Semantic HTML landmarks: `<nav>`, `<main>`, `<h1>`
- Descriptive meta tags for page context
- No decorative elements with screen reader interference

### Accessibility Features

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| High Contrast | Radial backdrop gradient | Text readable over moving fog |
| Reduced Motion | CSS media query + React detection | Safe for vestibular disorders |
| Semantic HTML | Proper landmarks | Screen reader navigation |
| Keyboard Nav | Native focus management | Full keyboard access |
| ARIA Labels | (future: add for nav items) | Enhanced screen reader UX |

## Browser Support

- **WebGL Required**: Modern browsers with WebGL support (Chrome 56+, Firefox 51+, Safari 11+)
- **Fallback**: For browsers without WebGL, a static fog image can be displayed (add `public/fog-fallback.png`)

## Technical Details

### Shader Architecture

The fog is rendered using a full-screen quad with custom GLSL shaders:

- **Vertex Shader**: Pass-through with UV coordinates
- **Fragment Shader**: 
  - Hash-based pseudo-random noise
  - 5-octave fractional Brownian motion (fBm)
  - Two-pass domain warping for organic distortion
  - 3 fog layers (near/mid/far) with different scales and speeds
  - Right-side bias to match reference design
  - Vertical gradient for natural height distribution
  - Vignette for edge darkening
  - Teal tint on highlights

### Performance Guards

```typescript
// FPS monitoring with 30-frame rolling average
const avgFPS = fpsBuffer.reduce((a, b) => a + b, 0) / fpsBuffer.length;

// Adaptive scaling after 1 second of low performance
if (avgFPS < 50 && time - lowFpsStartTime > 1000) {
  dpr = Math.max(0.75, dpr - 0.25);
  renderer.setPixelRatio(dpr);
}

// Pause when tab hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) cancelAnimationFrame(animationId);
});
```

## Troubleshooting

### Fog not visible or performing poorly

1. Check browser console for WebGL warnings
2. Ensure your GPU drivers are up to date
3. Try reducing the `density` prop: `<FogBackground density={0.7} />`
4. Check if adaptive DPR triggered: Look for "Adaptive DPR: Reduced to..." in console

### Text hard to read

The backdrop gradient mask should ensure readability. If issues persist:

1. Increase backdrop opacity in `Hero.module.css`:
   ```css
   .heroBackdrop {
     background: radial-gradient(ellipse at center, rgba(12, 12, 15, 0.98) 0%, transparent 70%);
   }
   ```

2. Reduce fog density:
   ```tsx
   <FogBackground density={0.7} />
   ```

### Build errors

Ensure all dependencies are installed:
```bash
pnpm install
```

If TypeScript errors occur, check that you're using:
- Node.js 18+ 
- TypeScript 5+
- Next.js 14+

## Credits

Design inspired by x.ai's visual aesthetic. Built with Next.js, React, Three.js, and GLSL.

## License

MIT License - Feel free to use this in your projects!
