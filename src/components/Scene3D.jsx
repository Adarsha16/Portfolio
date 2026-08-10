import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import * as THREE from "three";

function NeuralNetwork() {
  const groupRef = useRef();
  const nodesRef = useRef([]);
  const linesRef = useRef();

  const { nodes, connections } = useMemo(() => {
    const nodePositions = [];
    const layers = [5, 8, 10, 8, 5];
    const layerSpacing = 2.8;

    layers.forEach((count, layerIdx) => {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = 1.2 + layerIdx * 0.3;
        const x = (layerIdx - (layers.length - 1) / 2) * layerSpacing;
        const y = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        nodePositions.push(new THREE.Vector3(x, y, z));
      }
    });

    const conns = [];
    let offset = 0;
    for (let l = 0; l < layers.length - 1; l++) {
      const nextOffset = offset + layers[l];
      for (let i = 0; i < layers[l]; i++) {
        for (let j = 0; j < layers[l + 1]; j++) {
          if (Math.random() > 0.6) {
            conns.push([offset + i, nextOffset + j]);
          }
        }
      }
      offset = nextOffset;
    }

    return { nodes: nodePositions, connections: conns };
  }, []);

  const lineGeometry = useMemo(() => {
    const points = [];
    connections.forEach(([a, b]) => {
      points.push(nodes[a], nodes[b]);
    });
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [nodes, connections]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.06;
      groupRef.current.rotation.x = Math.sin(t * 0.04) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Connection lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Nodes */}
      {nodes.map((pos, i) => (
        <NodeSphere key={i} position={pos} index={i} />
      ))}
    </group>
  );
}

function NodeSphere({ position, index }) {
  const meshRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.position.y =
        position.y + Math.sin(t * 0.8 + index * 0.5) * 0.15;
      const scale = 0.8 + Math.sin(t * 1.2 + index * 0.3) * 0.2;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef} position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[0.06, 16, 16]} />
      <meshBasicMaterial
        color="#818cf8"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function FloatingParticles({ count = 200 }) {
  const meshRef = useRef();

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      sz[i] = Math.random() * 0.03 + 0.01;
    }
    return [pos, sz];
  }, [count]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.01;
      meshRef.current.rotation.x = t * 0.005;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#6366f1"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function DataStream() {
  const ref = useRef();
  const count = 80;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const posArray = ref.current.geometry.attributes.position.array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] -= 0.02;
      if (posArray[i * 3 + 1] < -10) {
        posArray[i * 3 + 1] = 10;
      }
      posArray[i * 3] += Math.sin(t + i) * 0.002;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#22d3ee"
        transparent
        opacity={0.35}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CameraRig() {
  const { camera } = useThree();

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 0.5;
      const y = (e.clientY / window.innerHeight - 0.5) * 0.3;
      camera.position.x += (x - camera.position.x) * 0.02;
      camera.position.y += (-y - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [camera]);

  return null;
}

export default function Scene3D({ className = "" }) {
  return (
    <div className={`canvas-container ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.3} />
        <CameraRig />
        <NeuralNetwork />
        <FloatingParticles count={150} />
        <DataStream />
        <Stars
          radius={80}
          depth={60}
          count={1500}
          factor={3}
          saturation={0}
          fade
          speed={0.5}
        />
      </Canvas>
    </div>
  );
}
