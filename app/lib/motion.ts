
export const MOTION_TIMINGS = {
  fogFadeInDuration: 500, // 420-600ms range, using middle
  fogFadeInDelay: 0,
  
  tenzinFadeInDuration: 200, // 180-220ms range
  tenzinScaleFrom: 0.985,
  tenzinScaleTo: 1.0,
  tenzinDelay: 100, // Start after fog begins
  
  taglineDelay: 450, // After TENZIN settles (≈150ms after TENZIN finishes)
  taglineFadeInDuration: 280, // 240-320ms range
  taglineTranslateFrom: 6, // px
  taglineTranslateTo: 0,
} as const;

export const MOTION_EASINGS = {
  fog: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // easeOutQuad
  tenzin: 'cubic-bezier(0.22, 0.61, 0.36, 1.0)', // easeOutCubic
  tagline: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // easeOutQuad
} as const;
