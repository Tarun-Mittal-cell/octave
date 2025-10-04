
export const MOTION_TIMINGS = {
  fogFadeInDuration: 520,
  fogFadeInDelay: 0,
  
  tenzinFadeInDuration: 2000,
  tenzinScaleFrom: 0.985,
  tenzinScaleTo: 1.0,
  tenzinDepthFrom: -30,
  tenzinDepthTo: 0,
  tenzinOpacityFrom: 0.05,
  tenzinOpacityTo: 1.0,
  tenzinDelay: 100,
  tenzinShimmerDelay: 800,
  
  taglineDelay: 2500,
  taglineFadeInDuration: 1000,
  taglineTranslateFrom: 6,
  taglineTranslateTo: 0,
} as const;

export const MOTION_EASINGS = {
  fog: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  tenzin: 'cubic-bezier(0.22, 0.61, 0.36, 1.0)',
  tagline: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
} as const;
