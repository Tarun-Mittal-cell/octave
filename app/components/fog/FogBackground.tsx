'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { vertexShader, fragmentShader } from './fogShader';

interface FogBackgroundProps {
  density?: number;
  speed?: number;
  warp?: number;
  tint?: string;
  pointerStrength?: number;
  pointerRadius?: number;
  background?: string;
}

export default function FogBackground({
  density = 1.35,
  speed = 1.15,
  warp = 1.60,
  tint = '#9BE9FF',
  pointerStrength = 0.55,
  pointerRadius = 0.42,
  background = '#0A0B14',
}: FogBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    material: THREE.ShaderMaterial;
    animationId: number | null;
    isHidden: boolean;
    fps: number[];
    lastTime: number;
    dpr: number;
  } | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const initialDPR = Math.min(window.devicePixelRatio, 1.5);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: false,
    });
    renderer.setPixelRatio(initialDPR);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const tintColor = new THREE.Color(tint);
    const backgroundColor = new THREE.Color(background);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uDensity: { value: density },
        uSpeed: { value: prefersReducedMotion ? 0 : speed },
        uWarp: { value: warp },
        uTint: { value: new THREE.Vector3(tintColor.r, tintColor.g, tintColor.b) },
        uPointerStrength: { value: prefersReducedMotion ? 0 : pointerStrength },
        uPointerRadius: { value: pointerRadius },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uBackground: { value: new THREE.Vector3(backgroundColor.r, backgroundColor.g, backgroundColor.b) },
      },
      transparent: true,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const fpsBuffer: number[] = [];
    let lastTime = performance.now();
    let lowFpsStartTime = 0;

    sceneRef.current = {
      scene,
      camera,
      renderer,
      material,
      animationId: null,
      isHidden: false,
      fps: fpsBuffer,
      lastTime,
      dpr: initialDPR,
    };

    const animate = (time: number) => {
      if (!sceneRef.current || sceneRef.current.isHidden) return;

      sceneRef.current.material.uniforms.uTime.value = time * 0.001;

      const deltaTime = time - sceneRef.current.lastTime;
      const currentFPS = 1000 / deltaTime;
      sceneRef.current.lastTime = time;

      sceneRef.current.fps.push(currentFPS);
      if (sceneRef.current.fps.length > 30) {
        sceneRef.current.fps.shift();
      }

      const avgFPS = sceneRef.current.fps.reduce((a, b) => a + b, 0) / sceneRef.current.fps.length;
      if (avgFPS < 50) {
        if (lowFpsStartTime === 0) {
          lowFpsStartTime = time;
        } else if (time - lowFpsStartTime > 1000 && sceneRef.current.dpr > 0.75) {
          sceneRef.current.dpr = Math.max(0.75, sceneRef.current.dpr - 0.25);
          sceneRef.current.renderer.setPixelRatio(sceneRef.current.dpr);
          lowFpsStartTime = 0;
          console.log('Adaptive DPR: Reduced to', sceneRef.current.dpr);
        }
      } else {
        lowFpsStartTime = 0;
      }

      sceneRef.current.renderer.render(sceneRef.current.scene, sceneRef.current.camera);
      sceneRef.current.animationId = requestAnimationFrame(animate);
    };

    if (!prefersReducedMotion) {
      sceneRef.current.animationId = requestAnimationFrame(animate);
    } else {
      renderer.render(scene, camera);
    }

    const handleResize = () => {
      if (!sceneRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      sceneRef.current.renderer.setSize(width, height);
      sceneRef.current.material.uniforms.uResolution.value.set(width, height);
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (prefersReducedMotion || !sceneRef.current) return;
      
      pointerRef.current.x = e.clientX / window.innerWidth;
      pointerRef.current.y = 1.0 - e.clientY / window.innerHeight;
      
      sceneRef.current.material.uniforms.uPointer.value.set(
        pointerRef.current.x,
        pointerRef.current.y
      );
    };

    const handleVisibilityChange = () => {
      if (!sceneRef.current) return;
      
      if (document.hidden) {
        sceneRef.current.isHidden = true;
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId);
          sceneRef.current.animationId = null;
        }
      } else {
        sceneRef.current.isHidden = false;
        if (!prefersReducedMotion) {
          sceneRef.current.animationId = requestAnimationFrame(animate);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      if (sceneRef.current) {
        if (sceneRef.current.animationId) {
          cancelAnimationFrame(sceneRef.current.animationId);
        }
        sceneRef.current.renderer.dispose();
        sceneRef.current.material.dispose();
        geometry.dispose();
        sceneRef.current = null;
      }
    };
  }, [density, speed, warp, tint, pointerStrength, pointerRadius, background]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
