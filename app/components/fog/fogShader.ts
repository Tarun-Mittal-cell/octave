
export const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform float uTime;
  uniform float uDensity;
  uniform float uSpeed;
  uniform float uWarp;
  uniform vec3 uTint;
  uniform float uPointerStrength;
  uniform vec2 uPointer;
  uniform vec2 uResolution;
  
  varying vec2 vUv;
  
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // Smoothstep interpolation
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for(int i = 0; i < 5; i++) {
      value += amplitude * noise(p * frequency);
      frequency *= 2.0;  // Each octave doubles frequency (finer detail)
      amplitude *= 0.5;  // Each octave halves amplitude (less influence)
    }
    
    return value;
  }
  
  vec2 domainWarp(vec2 p, float warpStrength) {
    float warp1 = fbm(p + uTime * 0.05 * uSpeed);
    float warp2 = fbm(p + vec2(warp1 * 4.0, uTime * 0.03 * uSpeed));
    
    vec2 offset = vec2(
      fbm(p + warpStrength * vec2(warp1, warp2)),
      fbm(p + warpStrength * vec2(warp2, warp1) + 5.2)
    );
    
    return p + offset * warpStrength;
  }
  
  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * 2.0;
    p.x *= uResolution.x / uResolution.y;
    
    vec2 warpedP = domainWarp(p, uWarp);
    
    vec2 pointerOffset = uPointer - uv;
    float pointerDist = length(pointerOffset);
    float pointerInfluence = exp(-pointerDist * 2.0) * uPointerStrength;
    warpedP += pointerOffset * pointerInfluence * 0.3;
    
    float nearFog = fbm(warpedP * 1.2 + uTime * 0.02 * uSpeed);
    nearFog = pow(nearFog, 1.5); // Increase contrast
    
    float midFog = fbm(warpedP * 2.5 + uTime * 0.04 * uSpeed + vec2(10.0, 5.0));
    midFog = pow(midFog, 1.3);
    
    float farFog = fbm(warpedP * 4.0 + uTime * 0.06 * uSpeed + vec2(20.0, 15.0));
    farFog = pow(farFog, 1.2);
    
    float fog = nearFog * 0.5 + midFog * 0.3 + farFog * 0.2;
    
    float rightBias = smoothstep(0.0, 1.0, uv.x);
    rightBias = pow(rightBias, 1.5);
    fog *= mix(0.3, 1.0, rightBias);
    
    float verticalGradient = 1.0 - abs(uv.y - 0.5) * 1.2;
    fog *= verticalGradient;
    
    fog = pow(fog, 1.0 / uDensity);
    
    float vignette = 1.0 - length(p) * 0.3;
    vignette = smoothstep(0.0, 1.0, vignette);
    
    vec3 fogColor = mix(vec3(0.5, 0.5, 0.52), uTint, fog * 0.15);
    
    float alpha = fog * vignette * 0.85;
    
    gl_FragColor = vec4(fogColor, alpha);
  }
`;
