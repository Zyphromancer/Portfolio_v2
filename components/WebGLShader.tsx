'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface WebGLShaderProps {
  fragmentShader?: string;
}

export function WebGLShader({ fragmentShader }: WebGLShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  const defaultFragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;

    // Simplex noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      
      // Create flowing liquid effect
      float time = uTime * 0.3;
      float noise = snoise(uv * 3.0 + time);
      noise += snoise(uv * 5.0 - time * 0.7) * 0.5;
      noise += snoise(uv * 8.0 + time * 0.5) * 0.25;
      
      // Mouse disturbance
      vec2 mouseNorm = uMouse / uResolution;
      float dist = distance(uv, mouseNorm);
      float disturbance = sin(dist * 10.0 - time) * exp(-dist * 3.0);
      noise += disturbance * 0.3;
      
      // Gold veins with opacity
      vec3 goldColor = vec3(0.79, 0.66, 0.30); // #C9A84C
      float veinIntensity = smoothstep(-0.3, 0.7, noise);
      float opacity = mix(0.15, 0.35, veinIntensity);
      
      vec3 bgColor = vec3(0.04, 0.04, 0.04); // #0A0A0A
      vec3 finalColor = mix(bgColor, goldColor, veinIntensity * 0.4);
      
      gl_FragColor = vec4(finalColor, opacity);
    }
  `;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Shader material
    const material = new THREE.ShaderMaterial({
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: fragmentShader || defaultFragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uResolution: { value: new THREE.Vector2(width, height) },
      },
      transparent: true,
    });
    materialRef.current = material;

    // Geometry
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      if (materialRef.current) {
        materialRef.current.uniforms.uMouse.value.set(
          e.clientX / width,
          1 - e.clientY / height
        );
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      timeRef.current += 0.016; // ~60fps
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = timeRef.current;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const newWidth = containerRef.current?.clientWidth || width;
      const newHeight = containerRef.current?.clientHeight || height;
      renderer.setSize(newWidth, newHeight);
      if (materialRef.current) {
        materialRef.current.uniforms.uResolution.value.set(newWidth, newHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [fragmentShader]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#0a0a0a' }}
    />
  );
}
