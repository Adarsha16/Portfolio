import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

const TEAR_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const TEAR_FRAG = `
  uniform float uTime;
  uniform float uTear; // 0 to 1
  varying vec2 vUv;

  // Voronoi noise functions
  vec2 random2(vec2 p) {
    return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
  }
  float voronoi(vec2 x) {
    vec2 n = floor(x);
    vec2 f = fract(x);
    float res = 8.0;
    for(int j=-1; j<=1; j++) {
      for(int i=-1; i<=1; i++) {
        vec2 g = vec2(float(i),float(j));
        vec2 o = random2(n + g);
        o = 0.5 + 0.5*sin(uTime + 6.2831*o);
        vec2 r = g + o - f;
        float d = dot(r,r);
        res = min(res, d);
      }
    }
    return sqrt(res);
  }

  void main() {
    // Base distortion
    float noise = voronoi(vUv * 6.0 + uTime * 0.2);
    float noise2 = voronoi(vUv * 12.0 - uTime * 0.4);
    
    // Create the tear shape (a vertical ellipse)
    float dX = vUv.x - 0.5;
    float dY = vUv.y - 0.5;
    float tearShape = smoothstep(0.4, 0.0, abs(dX) * 2.0 + abs(dY) * 0.2 + noise * 0.1);
    
    // Apply tear animation
    float mask = tearShape * uTear;
    
    // Shimmer effect (always visible slightly)
    float shimmer = smoothstep(0.7, 0.9, noise2) * 0.15;
    
    // Core of the tear
    vec3 coreColor = vec3(0.0, 0.0, 0.0); // Void black inside
    vec3 edgeColor = vec3(0.3, 0.8, 0.94) * 2.0; // Cyan glow
    
    float edge = smoothstep(0.0, 0.1, mask) - smoothstep(0.1, 0.2, mask);
    
    // Combine
    vec3 finalColor = mix(vec3(0.0), edgeColor, edge); // Edges
    finalColor = mix(finalColor, coreColor, smoothstep(0.15, 0.3, mask)); // Inside
    finalColor += edgeColor * shimmer * (1.0 - uTear); // Shimmer when closed
    
    float alpha = smoothstep(0.0, 0.1, mask + shimmer);
    
    gl_FragColor = vec4(finalColor, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function TearMesh({ isTorn, onOpened }) {
  const materialRef = useRef();
  
  const material = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTear: { value: 0 }
    },
    vertexShader: TEAR_VERT,
    fragmentShader: TEAR_FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  }), []);

  useFrame((state, delta) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    
    // Smoothly animate uTear
    const targetTear = isTorn ? 1.0 : 0.0;
    const currentTear = material.uniforms.uTear.value;
    
    if (Math.abs(currentTear - targetTear) > 0.01) {
      material.uniforms.uTear.value = THREE.MathUtils.damp(currentTear, targetTear, 4, delta);
      
      // Trigger opened callback when fully torn
      if (isTorn && material.uniforms.uTear.value > 0.9 && onOpened) {
        onOpened();
      }
    }
  });

  return (
    <mesh material={material}>
      <planeGeometry args={[4, 8]} />
    </mesh>
  );
}

export default function PortalTear() {
  const [isTorn, setIsTorn] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const handleClick = () => {
    if (isTorn) return;
    setIsTorn(true);
    
    // Auto close after 3 seconds
    setTimeout(() => {
      setIsTorn(false);
      setShowSecret(false);
    }, 3000);
  };

  return (
    <div className="relative w-64 h-96 cursor-crosshair z-30 flex items-center justify-center" onClick={handleClick}>
      <div className="absolute inset-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <TearMesh isTorn={isTorn} onOpened={() => setShowSecret(true)} />
        </Canvas>
      </div>
      
      <AnimatePresence>
        {showSecret && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            className="absolute z-10 text-center pointer-events-none"
          >
            <p className="font-mono text-cyan text-sm uppercase tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] mix-blend-screen">
              Anomaly Detected
              <br/>
              <span className="text-xs text-emerald mt-2 inline-block">Depth: -128m</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
