import { Suspense, useMemo, useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, OrbitControls, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { skills } from "../data/portfolio";

// Ghostly / desaturated colors for the melancholic theme
const ETHEREAL_COLORS = {
  accent: "#ffb4ac",  // pale rust/rose
  cyan: "#b5e8f7",    // pale icy cyan
  emerald: "#c1efcb", // pale moss green
  amber: "#fde8b4",   // pale sunset amber
};

const allSkills = Object.entries(skills).flatMap(([key, category]) =>
  category.items.map((item) => ({
    name: item,
    categoryKey: key,
    categoryLabel: category.label,
    categoryColor: category.color,
  }))
);

function ObsidianCluster({ pulseColor, pulseTime }) {
  const groupRef = useRef(null);
  
  // A dark, glassy, scratched material
  const material = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: "#020202",
    metalness: 0.8,
    roughness: 0.15,
    transmission: 0.6,
    thickness: 1.5,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    emissive: new THREE.Color("#000000"),
    emissiveIntensity: 0
  }), []);

  const colorObj = useMemo(() => new THREE.Color(), []);
  const pulseTarget = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    // Slow eerie floating/rotation of the whole cluster
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.2;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.2) * 0.1;

    // Handle pulsing emissive glow
    const timeSincePulse = clock.elapsedTime - pulseTime;
    let targetEmissiveIntensity = 0;
    
    if (timeSincePulse >= 0 && timeSincePulse < 2.0) {
      // Quick spike, slow fade
      targetEmissiveIntensity = Math.max(0, (1 - timeSincePulse / 2.0) * 1.5);
      pulseTarget.set(pulseColor);
    } else {
      // Idle faint cyan glow
      targetEmissiveIntensity = 0.1 + Math.sin(clock.elapsedTime * 1.2) * 0.05;
      pulseTarget.set("#0a2a35");
    }

    colorObj.lerp(pulseTarget, 0.1);
    material.emissive.copy(colorObj);
    material.emissiveIntensity = THREE.MathUtils.damp(
      material.emissiveIntensity, 
      targetEmissiveIntensity, 
      4, 
      1/60 // delta approximation
    );
  });

  return (
    <group ref={groupRef}>
      {/* Central big shard */}
      <mesh material={material} scale={[1.2, 3, 1.2]}>
        <octahedronGeometry args={[1, 0]} />
      </mesh>
      {/* Side shards */}
      <mesh material={material} position={[0.8, -0.5, 0.5]} rotation={[0, 0, -0.3]} scale={[0.7, 1.8, 0.7]}>
        <octahedronGeometry args={[1, 0]} />
      </mesh>
      <mesh material={material} position={[-0.7, 0.2, -0.6]} rotation={[0.2, 0.5, 0.2]} scale={[0.5, 1.5, 0.5]}>
        <octahedronGeometry args={[1, 0]} />
      </mesh>
      <mesh material={material} position={[0.2, -1.2, -0.8]} rotation={[-0.4, 0, 0.4]} scale={[0.6, 1.2, 0.6]}>
        <octahedronGeometry args={[1, 0]} />
      </mesh>
    </group>
  );
}

function SkillSoul({ item, index, total, onPulse, isVisible }) {
  const groupRef = useRef(null);
  const textRef = useRef(null);
  const glowRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const colorHex = ETHEREAL_COLORS[item.categoryColor] || ETHEREAL_COLORS.accent;

  const params = useMemo(() => {
    const angleOffset = (index / total) * Math.PI * 2;
    const radiusX = 4.5 + Math.random() * 2.5;
    const radiusZ = 4.5 + Math.random() * 2.5;
    const speed = 0.08 + Math.random() * 0.08;
    const yOffset = (Math.random() - 0.5) * 6;
    const yDrift = 0.5 + Math.random() * 1.5;
    const dir = index % 2 === 0 ? 1 : -1;
    return { angleOffset, radiusX, radiusZ, speed, yOffset, yDrift, dir };
  }, [index, total]);

  useFrame(({ clock, camera }, delta) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    const { angleOffset, radiusX, radiusZ, speed, yOffset, yDrift, dir } = params;

    // Organic elliptical orbit
    const angle = angleOffset + t * speed * dir;
    groupRef.current.position.x = Math.cos(angle) * radiusX;
    groupRef.current.position.z = Math.sin(angle) * radiusZ;
    groupRef.current.position.y = yOffset + Math.sin(t * 0.8 + angleOffset) * yDrift;

    // Always face camera
    groupRef.current.quaternion.copy(camera.quaternion);

    // Scale on hover
    const targetScale = hovered ? 1.4 : 1;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.damp(groupRef.current.scale.x, targetScale, 8, delta)
    );

    // Opacity management
    const targetTextOpacity = isVisible ? (hovered ? 1 : 0.85) : 0.05;
    const targetGlowOpacity = isVisible ? (hovered ? 0.4 : 0.0) : 0.0;
    
    if (textRef.current) {
      const currentFillOpacity = textRef.current.fillOpacity !== undefined ? textRef.current.fillOpacity : 1;
      textRef.current.fillOpacity = THREE.MathUtils.damp(
        currentFillOpacity,
        targetTextOpacity,
        4,
        delta
      );
    }
    if (glowRef.current) {
      glowRef.current.material.opacity = THREE.MathUtils.damp(
        glowRef.current.material.opacity,
        targetGlowOpacity,
        6,
        delta
      );
    }
  });

  return (
    <group ref={groupRef}>
      <Text
        ref={textRef}
        color={colorHex}
        fontSize={0.35}
        anchorX="center"
        anchorY="middle"
        fillOpacity={1}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onPulse(colorHex);
        }}
      >
        {item.name}
      </Text>
      
      {/* Soft hover glow behind text */}
      <mesh ref={glowRef} position={[0, 0, -0.05]} scale={2.5}>
        <planeGeometry args={[1, 0.5]} />
        <meshBasicMaterial
          color={colorHex}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function SceneWrapper({ searchQuery, activeFilter }) {
  const [pulseData, setPulseData] = useState({ color: ETHEREAL_COLORS.cyan, time: -999 });
  const { clock } = useThree();

  const handlePulse = useCallback(
    (colorHex) => {
      setPulseData({ color: colorHex, time: clock.elapsedTime });
    },
    [clock]
  );

  const query = searchQuery.trim().toLowerCase();

  return (
    <>
      <ambientLight intensity={0.4} />
      {/* Cold directional moonlight */}
      <directionalLight position={[5, 10, 5]} intensity={1.2} color="#a9b8cc" />
      {/* Base cyan fill */}
      <pointLight position={[-5, -5, -5]} intensity={1} color="#1d4e5f" />
      
      {/* Interactive Orbiting */}
      <OrbitControls 
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
        autoRotate
        autoRotateSpeed={0.5}
        enableDamping
        dampingFactor={0.05}
      />

      <ObsidianCluster pulseColor={pulseData.color} pulseTime={pulseData.time} />
      
      {/* Atmospheric Dust */}
      <Sparkles count={150} scale={12} size={2} speed={0.2} opacity={0.3} color="#b5e8f7" />

      {allSkills.map((item, i) => {
        const matchesSearch = !query || item.name.toLowerCase().includes(query);
        const matchesFilter = activeFilter === "all" || item.categoryKey === activeFilter;
        const isVisible = matchesSearch && matchesFilter;

        return (
          <SkillSoul
            key={`${item.categoryKey}-${item.name}`}
            item={item}
            index={i}
            total={allSkills.length}
            onPulse={handlePulse}
            isVisible={isVisible}
          />
        );
      })}
    </>
  );
}

export default function Skills() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { margin: "0px", amount: 0.1 });
  const [showHelper, setShowHelper] = useState(true);

  // Auto-hide the helper text after a while
  useEffect(() => {
    const timer = setTimeout(() => setShowHelper(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="skills" className="w-full relative z-20" ref={containerRef}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
        className="mb-10 text-center"
      >
        <p className="mb-2 font-mono text-sm uppercase tracking-wider text-accent">
          03. Skills
        </p>
        <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
          The Crystal Monolith
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-text-muted sm:text-base">
          A fractured obsidian record of disciplines mastered. Search the void, isolate a
          skillset, or trigger a resonance pulse.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.08 }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="mx-auto max-w-6xl"
      >
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-[#05070a] shadow-2xl shadow-black/50">
          <div className="relative z-20 border-b border-border/40 bg-void/85 px-4 py-4 backdrop-blur-xl sm:px-5">
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 shrink-0 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.7}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search the void..."
                aria-label="Search skills"
                className="min-w-0 flex-1 border-none bg-transparent font-mono text-sm text-text-primary outline-none placeholder:text-text-muted/55 focus:ring-0 sm:text-base"
              />
            </div>

            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setActiveFilter("all")}
                className={`whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[11px] transition ${
                  activeFilter === "all"
                    ? "border-accent/45 bg-accent/15 text-accent"
                    : "border-border/40 text-text-secondary hover:border-border hover:bg-surface/60"
                }`}
              >
                All souls
              </button>

              {Object.entries(skills).map(([key, category]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[11px] transition ${
                    activeFilter === key
                      ? "border-white/15 bg-white/[0.07] text-text-primary"
                      : "border-border/35 text-text-secondary hover:border-border hover:bg-surface/60"
                  }`}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full shadow-[0_0_10px_currentColor]"
                    style={{
                      color: ETHEREAL_COLORS[category.color] || ETHEREAL_COLORS.cyan,
                      backgroundColor: "currentColor",
                    }}
                  />
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-[500px] sm:h-[590px] lg:h-[640px] cursor-grab active:cursor-grabbing">
            <Canvas
              camera={{ position: [0, 0, 15], fov: 45, near: 0.1, far: 100 }}
              gl={{ antialias: true, powerPreference: "high-performance" }}
            >
              <Suspense fallback={null}>
                <SceneWrapper searchQuery={searchQuery} activeFilter={activeFilter} />
              </Suspense>
            </Canvas>

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_35%,rgba(5,7,10,0.5)_70%,rgba(5,7,10,0.9)_100%)]" />
            
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between gap-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: showHelper ? 1 : 0 }}
                transition={{ duration: 1 }}
                className="hidden text-right font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted/45 sm:block ml-auto"
              >
                <div>drag · orbit</div>
                <div>hover · inspect</div>
                <div>click · pulse</div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
