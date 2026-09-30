import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BootLoader({ onComplete }) {
    const canvasRef = useRef(null);
    const [phase, setPhase] = useState("heartbeat"); // heartbeat -> implode -> burst -> exit
    const particlesRef = useRef([]);
    const animationFrameRef = useRef(null);

    // --- Spore Particle Class ---
    class Spore {
        constructor(x, y, maxDimension) {
            this.x = x;
            this.y = y;

            // Responsive explosive velocity: travels further on larger/taller screens
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * (maxDimension * 0.035) + 8;
            this.vx = Math.cos(angle) * velocity;
            this.vy = Math.sin(angle) * velocity;

            // Slightly larger particles for better mobile visibility
            this.size = Math.random() * 3 + 1;
            this.life = 1.0;
            // Faster decay to match the snappier loading timeline
            this.decay = Math.random() * 0.015 + 0.005;

            // Organic drifting
            this.driftAngle = Math.random() * Math.PI * 2;
            this.driftSpeed = Math.random() * 0.05 + 0.02;

            // Color variation: Blend of Bioluminescent Cyan & Eerie TLOU Green
            const hue = Math.random() > 0.4 ? 192 : 140;
            this.color = `hsl(${hue}, 80%, 70%)`;
        }

        update() {
            // Friction: reduced to 0.92 so they spread over a much wider area
            this.vx *= 0.92;
            this.vy *= 0.92;

            // Organic Drift: lazily wander and float upward
            this.driftAngle += this.driftSpeed;
            this.x += this.vx + Math.sin(this.driftAngle) * 0.8;
            this.y += this.vy + Math.cos(this.driftAngle * 0.8) * 0.8 - 1.0; // Stronger upward draft

            this.life -= this.decay;
        }

        draw(ctx) {
            if (this.life <= 0) return;
            ctx.globalAlpha = this.life;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.fill();
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let width, height, maxDimension;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            maxDimension = Math.max(width, height);
        };
        window.addEventListener("resize", resize);
        resize();

        // Canvas Animation Loop
        const animate = () => {
            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 1;
            ctx.clearRect(0, 0, width, height);

            if (phase === "burst" || phase === "exit") {
                ctx.globalCompositeOperation = "lighter"; // Additive blending for glow
                particlesRef.current.forEach((p, index) => {
                    p.update();
                    p.draw(ctx);
                    if (p.life <= 0) particlesRef.current.splice(index, 1);
                });
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [phase]);

    // --- Faster Sequence Timeline ---
    useEffect(() => {
        // 1. Snappier heartbeat (1.2 seconds instead of 2.0)
        const timer1 = setTimeout(() => {
            setPhase("implode");

            // 2. Trigger the burst almost instantly
            const timer2 = setTimeout(() => {
                setPhase("burst");

                // Spawn 350 spores for a massive, screen-filling bloom
                const cx = window.innerWidth / 2;
                const cy = window.innerHeight / 2;
                const maxDim = Math.max(window.innerWidth, window.innerHeight);
                for (let i = 0; i < 350; i++) {
                    particlesRef.current.push(new Spore(cx, cy, maxDim));
                }

                // 3. Start fading out overlay much quicker
                const timer3 = setTimeout(() => {
                    setPhase("exit");

                    // 4. Finish boot
                    const timer4 = setTimeout(() => {
                        onComplete();
                    }, 800);
                    return () => clearTimeout(timer4);
                }, 1000);
                return () => clearTimeout(timer3);
            }, 100);
            return () => clearTimeout(timer2);
        }, 1200);

        return () => clearTimeout(timer1);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {phase !== "exit" && (
                <motion.div
                    exit={{ backgroundColor: "rgba(5, 5, 7, 0)", opacity: 0 }}
                    transition={{ duration: 1.0, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] bg-void flex justify-center items-center overflow-hidden"
                >
                    {/* Hardware Accelerated Particle Canvas */}
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 pointer-events-none z-0"
                    />

                    {/* The Geometric Seed */}
                    {phase !== "burst" && (
                        <motion.div
                            animate={
                                phase === "heartbeat"
                                    ? {
                                        scale: [0.8, 1.4, 0.9, 1.2, 0.8],
                                        boxShadow: [
                                            "0 0 10px #e2e8f0, 0 0 30px #4CC9F0",
                                            "0 0 25px #e2e8f0, 0 0 80px #4CC9F0",
                                            "0 0 10px #e2e8f0, 0 0 30px #4CC9F0",
                                            "0 0 20px #e2e8f0, 0 0 60px #4CC9F0",
                                            "0 0 10px #e2e8f0, 0 0 30px #4CC9F0",
                                        ],
                                        opacity: [0.7, 1, 0.8, 0.9, 0.7],
                                    }
                                    : {
                                        scale: 0,
                                        boxShadow: "0 0 200px #4CC9F0, 0 0 500px #fff",
                                        opacity: 0,
                                    }
                            }
                            transition={
                                phase === "heartbeat"
                                    ? { repeat: Infinity, duration: 1.0, ease: "easeInOut" }
                                    : { duration: 0.1, ease: "easeIn" }
                            }
                            className="w-3 h-3 md:w-4 md:h-4 bg-text-primary rounded-[1px] rotate-45 relative z-10"
                        />
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}