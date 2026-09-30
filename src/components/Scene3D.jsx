import { useRef, useMemo, useEffect, useLayoutEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { QuadraticBezierLine } from "@react-three/drei";
import * as THREE from "three";

/*
  ONE IDEA: you are being lowered down a split-open tower block at dusk.

  Everything is driven by a single number, `world.progress` (0 = rim, 1 = floor):
    - camera height + pitch
    - fog colour / density (magenta haze -> violet -> teal -> black-green)
    - sun light fades out, cyan spore-light fades in
    - the sky "closes" into the fog colour
    - moss / vines / glowing fungus only grow on the lower floors
    - dust motes turn from warm orange to cold cyan spores

  Props:
    scrollProgress  optional framer-motion MotionValue (0..1), e.g. from useScroll().scrollYProgress.
                    If omitted, window scroll is used. No GSAP needed.
*/

const { lerp, damp, clamp, smoothstep } = THREE.MathUtils;

// ---------- Shared constants ----------
const CAM_TOP = 3;
const CAM_BOTTOM = -49;
const GAP = 9; // half-width of the shaft
const FLOOR_Y = -58;
const SUN_DIR = new THREE.Vector3(0.32, 0.1, -0.94).normalize();

const FOG_P = [0, 0.25, 0.55, 1];
const FOG_STOPS = ["#b8506e", "#47305a", "#14282a", "#041210"].map((c) => new THREE.Color(c));

function sampleFog(p, out) {
  for (let i = 0; i < FOG_P.length - 1; i++) {
    if (p <= FOG_P[i + 1]) {
      const t = (p - FOG_P[i]) / (FOG_P[i + 1] - FOG_P[i]);
      return out.copy(FOG_STOPS[i]).lerp(FOG_STOPS[i + 1], t);
    }
  }
  return out.copy(FOG_STOPS[FOG_STOPS.length - 1]);
}

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- 1. Camera rig: scroll -> depth ----------
function CameraRig({ world, scrollProgress }) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ clock }, delta) => {
    let target = 0;
    if (scrollProgress && typeof scrollProgress.get === "function") {
      target = scrollProgress.get();
    } else {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      target = max > 0 ? window.scrollY / max : 0;
    }
    world.progress = damp(world.progress, clamp(target, 0, 1), 3.5, delta);
    const p = world.progress;

    camera.position.y = lerp(CAM_TOP, CAM_BOTTOM, p);
    camera.position.x = damp(camera.position.x, mouse.current.x * 1.5, 2, delta);
    camera.position.z = damp(camera.position.z, 12 + mouse.current.y * 1.2, 2, delta);

    // Start looking UP at the sky, settle to looking down the shaft
    const pitch = lerp(9, -2, smoothstep(p, 0, 0.3));
    camera.lookAt(camera.position.x * 0.3, camera.position.y + pitch, camera.position.z - 14);
    camera.rotateZ(Math.sin(clock.elapsedTime * 0.25) * 0.01); // slow "hanging on a rope" roll
  });

  return null;
}

// ---------- 2. Atmosphere: fog + lights follow depth ----------
function Atmosphere({ world }) {
  const { scene } = useThree();
  const sun = useRef();
  const hemi = useRef();
  const glow = useRef();

  useFrame(() => {
    const p = world.progress;
    sampleFog(p, scene.fog.color);
    scene.fog.near = lerp(8, 3, p);
    scene.fog.far = lerp(120, 36, Math.pow(p, 0.55));

    sun.current.intensity = 3.2 * (1 - smoothstep(p, 0.05, 0.5));
    hemi.current.intensity = lerp(0.9, 0.22, p);
    const g = 120 * smoothstep(p, 0.3, 0.9);
    glow.current.children.forEach((l) => (l.intensity = g));
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={["#9a78b0", "#0c2a22", 0.9]} />
      <directionalLight
        ref={sun}
        position={[SUN_DIR.x * 70, SUN_DIR.y * 70 + 20, SUN_DIR.z * 70]}
        color="#ff9d6b"
      />
      {/* Cold spore-light that takes over once the sun is gone */}
      <group ref={glow}>
        {[-24, -37, -50].map((y, i) => (
          <pointLight
            key={y}
            position={[0, y, -4]}
            color={i === 1 ? "#7fe39a" : "#4cc9f0"}
            distance={34}
            decay={2}
            intensity={0}
          />
        ))}
      </group>
    </>
  );
}

// ---------- 3. Shinkai sky (procedural: gradient, clouds, stars, sun) ----------
const SKY_VERT = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uDeep;
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uHorizon;
  uniform vec3 uSun;
  uniform vec3 uSunDir;
  uniform vec3 uFog;
  varying vec3 vDir;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    vec3 d = normalize(vDir);
    float h = max(d.y, 0.0);

    // Twilight gradient: orange horizon -> magenta -> indigo
    vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.22, h));
    col = mix(col, uTop, smoothstep(0.18, 0.75, h));

    // Sun glow + disc
    float s = max(dot(d, uSunDir), 0.0);
    col += uSun * (pow(s, 6.0) * 0.35 + pow(s, 48.0) * 0.6);
    float disc = smoothstep(0.9985, 0.9993, s);

    // Clouds on a projected plane, lit from the sun side (Shinkai rim light)
    vec2 uv = d.xz / (d.y + 0.12) * 0.9 + vec2(uTime * 0.012, 0.0);
    float dens = fbm(uv * 1.3);
    float lit = clamp((dens - fbm(uv * 1.3 + normalize(uSunDir.xz) * 0.12)) * 6.0 + 0.5, 0.0, 1.0);
    float cloud = smoothstep(0.48, 0.78, dens) * smoothstep(0.0, 0.14, d.y);
    float facing = 0.5 + 0.5 * dot(normalize(d.xz + 1e-4), normalize(uSunDir.xz));
    vec3 cloudShadow = mix(uTop, uMid, 0.5) * 0.8;
    vec3 cloudLit = mix(uHorizon, uSun, 0.6) * 1.2;
    vec3 cloudCol = mix(cloudShadow, cloudLit, clamp(lit * facing * 1.3, 0.0, 1.0));
    col = mix(col, cloudCol, cloud * 0.85);

    // Stars in the upper sky, hidden by clouds
    vec3 sp = d * 220.0;
    vec3 id = floor(sp);
    float hs = hash(id.xy + id.z * 17.0);
    float star = step(0.992, hs) * smoothstep(0.45, 0.0, length(fract(sp) - 0.5));
    star *= (0.6 + 0.4 * sin(uTime * 2.0 + hs * 80.0)) * smoothstep(0.25, 0.6, d.y) * (1.0 - cloud);
    col += star * (1.0 - uDeep);

    col = mix(col, uSun * 1.4, disc * (1.0 - cloud * 0.6) * (1.0 - uDeep));

    // As we descend the sky closes into the same colour as the fog
    col = mix(col, uFog, uDeep);

    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function Sky({ world }) {
  const ref = useRef();
  const { scene } = useThree();

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTime: { value: 0 },
          uDeep: { value: 0 },
          uTop: { value: new THREE.Color("#1a1a4a") },
          uMid: { value: new THREE.Color("#8f395a") },
          uHorizon: { value: new THREE.Color("#f08050") },
          uSun: { value: new THREE.Color("#ffd9a0") },
          uSunDir: { value: SUN_DIR.clone() },
          uFog: { value: new THREE.Color() },
        },
        vertexShader: SKY_VERT,
        fragmentShader: SKY_FRAG,
      }),
    []
  );

  useFrame(({ clock, camera }) => {
    ref.current.position.copy(camera.position); // dome never runs out
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uDeep.value = smoothstep(world.progress, 0.08, 0.6) * 0.96;
    material.uniforms.uFog.value.copy(scene.fog.color);
  });

  return (
    <mesh ref={ref} material={material} renderOrder={-1} frustumCulled={false}>
      <sphereGeometry args={[400, 32, 16]} />
    </mesh>
  );
}

// ---------- 4. The ruin ----------
function buildWorld() {
  const rng = mulberry32(1987);
  const r = (a, b) => a + rng() * (b - a);
  const depthAt = (y) => clamp((CAM_TOP - y) / (CAM_TOP - CAM_BOTTOM), 0, 1);

  const cSil = new THREE.Color("#1a1b30"); // skyline silhouette
  const cConc = new THREE.Color("#44454a"); // bare concrete
  const cMoss = new THREE.Color("#46762f");
  const cMossHi = new THREE.Color("#86b84e");
  const cCyan = new THREE.Color("#4cc9f0").multiplyScalar(1.6);
  const cGreen = new THREE.Color("#84e296").multiplyScalar(1.6);

  const LEVEL = 3.6; // floor height
  const SEG = 6; // bay width along z
  const NSEG = 10;
  const Z0 = 10;
  const TOP = 16;
  const BACK = GAP + 8.5; // rear wall of each cut-away building

  const concrete = [];
  const flora = [];
  const glowPads = [];
  const cables = [];

  // Two cut-away tower faces facing each other: floors, columns, rear wall panels
  for (const s of [-1, 1]) {
    for (let zi = 0; zi < NSEG; zi++) {
      const z = Z0 - zi * SEG;
      const colTop = TOP - Math.pow(rng(), 2) * 13; // jagged broken skyline

      for (let y = TOP; y > FLOOR_Y + 2; y -= LEVEL) {
        if (y > colTop) continue;
        const d = depthAt(y);
        const ruin = 0.05 + 0.32 * Math.min(d * 1.6, 1); // damage grows with depth
        const over = smoothstep(d, 0.3, 0.9); // overgrowth grows with depth

        const base = cSil
          .clone()
          .lerp(cConc, smoothstep(d, 0, 0.2))
          .multiplyScalar(r(0.8, 1.15))
          .lerp(cMoss, over * r(0.15, 0.7));

        // Floor slab, cantilevered from the rear wall into the shaft
        if (rng() > ruin) {
          const w = r(6, 8.5);
          const inner = s * (GAP + r(-0.3, 0.3));
          const cx = inner + (s * w) / 2;
          const th = r(0.3, 0.5);
          const tilt = s * r(-1, 1) * ruin * 0.3;
          concrete.push({ p: [cx, y, z], s: [w, th, SEG * 0.96], r: [0, 0, tilt], c: base });

          if (rng() < over * 0.8) {
            flora.push({
              p: [cx - s * w * 0.1, y + th / 2 + 0.05, z],
              s: [w * r(0.5, 0.9), 0.14, SEG * r(0.5, 0.9)],
              r: [0, 0, tilt],
              c: cMoss.clone().lerp(cMossHi, rng()),
            });
          }
          if (d > 0.45 && rng() < 0.3) {
            glowPads.push({
              p: [cx + s * r(-w / 3, w / 3), y + th / 2 + 0.1, z + r(-2, 2)],
              s: [r(0.3, 0.9), 0.06, r(0.3, 0.9)],
              c: rng() > 0.5 ? cCyan : cGreen,
            });
          }
          // Vines hanging off the slab edge into the shaft
          if (over > 0.05 && rng() < 0.35 * over) {
            const vz = z + r(-SEG / 2, SEG / 2);
            for (let k = 0; k < 3; k++) {
              const len = r(3, 11);
              flora.push({
                p: [inner - s * r(0, 0.4), y - len / 2, vz + r(-0.4, 0.4)],
                s: [r(0.05, 0.1), len, r(0.05, 0.1)],
                r: [r(-0.05, 0.05), 0, r(-0.06, 0.06)],
                c: cMoss.clone().lerp(cMossHi, rng() * 0.5),
              });
            }
          }
        }

        // Column along the inner edge
        if (rng() > ruin * 1.5) {
          concrete.push({
            p: [s * (GAP + 0.5), y - LEVEL / 2, z],
            s: [0.7, LEVEL, 0.7],
            r: [0, 0, r(-1, 1) * ruin * 0.06],
            c: base.clone().multiplyScalar(0.85),
          });
        }

        // Rear wall panel (gaps = blown-out bays)
        if (rng() < 0.55 - ruin * 0.6) {
          concrete.push({
            p: [s * BACK, y - LEVEL / 2, z],
            s: [0.5, LEVEL * 0.92, SEG * 0.97],
            c: base.clone().multiplyScalar(0.6),
          });
        }
      }
    }
  }

  // Three layers of distant city: fog turns them into Shinkai atmospheric perspective
  [-58, -80, -105].forEach((z, L) => {
    for (let x = -70; x < 70; x += r(5, 9)) {
      const top = r(2, 24) - L * 2;
      concrete.push({
        p: [x, (top + FLOOR_Y) / 2, z + r(-4, 4)],
        s: [r(5, 10), top - FLOOR_Y, r(6, 10)],
        c: cSil,
      });
    }
  });

  // Power lines crossing the shaft, only in the upper (still "human") part
  for (let i = 0; i < 9; i++) {
    const y = r(-6, 14);
    const z = r(-30, 6);
    cables.push({
      start: [-GAP - 1, y, z],
      end: [GAP + 1, y - r(0, 3), z - r(0, 4)],
      mid: [0, y - r(5, 9), z - 1],
    });
  }

  return { concrete, flora, glowPads, cables };
}

// One draw call per material, per-instance colour
function Boxes({ items, roughness = 0.95, basic = false }) {
  const ref = useRef();

  useLayoutEffect(() => {
    const mesh = ref.current;
    const o = new THREE.Object3D();
    items.forEach((it, i) => {
      o.position.set(...it.p);
      o.scale.set(...it.s);
      o.rotation.set(...(it.r || [0, 0, 0]));
      o.updateMatrix();
      mesh.setMatrixAt(i, o.matrix);
      mesh.setColorAt(i, it.c);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items]);

  return (
    <instancedMesh key={items.length} ref={ref} args={[null, null, items.length]} frustumCulled={false}>
      <boxGeometry />
      {basic ? (
        <meshBasicMaterial toneMapped={false} />
      ) : (
        <meshStandardMaterial roughness={roughness} metalness={0.05} />
      )}
    </instancedMesh>
  );
}

function PunpunShadow() {
  const ref = useRef();
  const { camera } = useThree();
  const [faded, setFaded] = useState(false);

  // A very subtle dark triangular bird shape
  const geom = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.4);
    shape.lineTo(-0.2, 0);
    shape.lineTo(0.2, 0);
    shape.lineTo(0, 0.4);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false });
  }, []);

  useFrame((state, delta) => {
    if (faded || !ref.current) return;
    
    // Look vaguely towards camera
    const target = camera.position.clone();
    target.y = ref.current.position.y; // Keep it level
    
    // Smoothly turn its "head" to watch the camera/mouse
    const currentRot = new THREE.Quaternion().copy(ref.current.quaternion);
    ref.current.lookAt(target);
    const targetRot = new THREE.Quaternion().copy(ref.current.quaternion);
    ref.current.quaternion.slerpQuaternions(currentRot, targetRot, delta * 2);
  });

  if (faded) return null;

  return (
    <mesh 
      ref={ref}
      position={[-7, -22, -10]} 
      geometry={geom}
      onPointerOver={() => setFaded(true)}
    >
      <meshBasicMaterial color="#020202" toneMapped={false} />
    </mesh>
  );
}

function Ruins() {
  const w = useMemo(buildWorld, []);
  return (
    <group>
      <Boxes items={w.concrete} />
      <Boxes items={w.flora} roughness={1} />
      <Boxes items={w.glowPads} basic />
      {w.cables.map((c, i) => (
        <QuadraticBezierLine key={i} start={c.start} end={c.end} mid={c.mid} color="#050608" lineWidth={1.5} />
      ))}
      <PunpunShadow />
      {/* The bottom: dark wet moss with a faint bioluminescent sheen */}
      <mesh position={[0, FLOOR_Y, -15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0a1c16" emissive="#0a4a48" emissiveIntensity={0.5} roughness={0.35} />
      </mesh>
    </group>
  );
}

// ---------- 5. God-rays: the visual link between the sky and the ruin ----------
function LightShafts({ world }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        fog: false,
        uniforms: { uColor: { value: new THREE.Color("#ffb070") }, uIntensity: { value: 1 } },
        vertexShader: `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: `
          uniform vec3 uColor; uniform float uIntensity; varying vec2 vUv;
          void main() {
            float across = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x);
            float along = smoothstep(0.0, 0.15, vUv.y) * pow(vUv.y, 1.6);
            gl_FragColor = vec4(uColor, across * across * along * 0.22 * uIntensity);
            #include <colorspace_fragment>
          }
        `,
      }),
    []
  );

  const shafts = useMemo(() => {
    const rng = mulberry32(42);
    return Array.from({ length: 6 }, (_, i) => ({
      x: -6 + i * 2.4 + (rng() - 0.5) * 2,
      z: -6 - rng() * 28,
      w: 2 + rng() * 3,
      rot: -0.3 - rng() * 0.15,
    }));
  }, []);

  useFrame(() => {
    material.uniforms.uIntensity.value = 1 - smoothstep(world.progress, 0.15, 0.6);
  });

  return (
    <group>
      {shafts.map((s, i) => (
        <mesh key={i} position={[s.x, -14, s.z]} rotation={[0, 0, s.rot]} material={material}>
          <planeGeometry args={[s.w, 34]} />
        </mesh>
      ))}
    </group>
  );
}

// ---------- 6. Dust -> spores (one system, colour driven by world height) ----------
const SPORE_VERT = /* glsl */ `
  uniform float uTime;
  uniform float uCamY;
  uniform float uPx;
  attribute vec2 aSeed;
  varying vec3 vCol;
  varying float vA;
  const float R = 56.0;

  void main() {
    float speed = 0.25 + aSeed.x * 0.5;
    // Wrap inside a window centred on the camera so density stays constant while descending
    float rel = mod(position.y + uTime * speed - uCamY, R) - R * 0.5;
    vec3 p = vec3(position.x + sin(uTime * 0.3 + aSeed.y * 20.0) * 0.8, uCamY + rel, position.z);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    gl_PointSize = (0.10 + aSeed.y * 0.16) * uPx * 420.0 / dist;

    float deep = smoothstep(-2.0, -26.0, p.y);
    vec3 spore = mix(vec3(0.30, 0.80, 0.94), vec3(0.52, 0.89, 0.59), step(0.5, aSeed.x));
    vCol = mix(vec3(1.0, 0.72, 0.45), spore, deep);

    float twinkle = 0.65 + 0.35 * sin(uTime * (1.0 + aSeed.y * 2.0) + aSeed.x * 40.0);
    float edge = 1.0 - smoothstep(0.35, 0.5, abs(rel) / R);
    float ceiling = smoothstep(7.0, 2.0, p.y);
    vA = twinkle * edge * ceiling * smoothstep(60.0, 10.0, dist) * mix(0.35, 1.0, deep);
  }
`;

const SPORE_FRAG = /* glsl */ `
  varying vec3 vCol;
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = pow(smoothstep(0.5, 0.0, d), 2.0);
    gl_FragColor = vec4(vCol * 1.6, a * vA);
    #include <colorspace_fragment>
  }
`;

function Spores({ count = 600 }) {
  const dpr = useThree((s) => s.viewport.dpr);

  const { geometry, material } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = Math.random() * 56;
      pos[i * 3 + 2] = -38 + Math.random() * 52;
      seed[i * 2] = Math.random();
      seed[i * 2 + 1] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 2));

    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uCamY: { value: 0 }, uPx: { value: 1 } },
      vertexShader: SPORE_VERT,
      fragmentShader: SPORE_FRAG,
    });
    return { geometry: g, material: m };
  }, [count]);

  useFrame(({ clock, camera }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uCamY.value = camera.position.y;
    material.uniforms.uPx.value = dpr;
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

// ---------- Scene ----------
export default function Scene3D({ className = "", scrollProgress }) {
  const world = useRef({ progress: 0 }).current;

  return (
    <div className={`canvas-container w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, CAM_TOP, 12], fov: 60, near: 0.1, far: 600 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true }}
      >
        <fog attach="fog" args={["#b8506e", 8, 120]} />

        <CameraRig world={world} scrollProgress={scrollProgress} />
        <Atmosphere world={world} />
        <Sky world={world} />
        <Ruins />
        <LightShafts world={world} />
        <Spores />
      </Canvas>
    </div>
  );
}