import { useEffect, useRef, useState } from "react";

const TAIL_LENGTH = 12; // Number of dots trailing behind

export default function CustomCursor() {
    const mainCursorRef = useRef(null);
    const tailRefs = useRef([]);
    const [isHovering, setIsHovering] = useState(false);

    // Store raw mouse position
    const mouse = useRef({ x: -100, y: -100 });
    // Store the positions for the trailing physics
    const dots = useRef(Array.from({ length: TAIL_LENGTH }, () => ({ x: -100, y: -100 })));

    useEffect(() => {
        const onMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;
        };

        // Detect when hovering over clickable elements
        const onMouseOver = (e) => {
            if (e.target.closest("a, button, input, textarea")) setIsHovering(true);
        };
        const onMouseOut = (e) => {
            if (e.target.closest("a, button, input, textarea")) setIsHovering(false);
        };

        window.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseover", onMouseOver);
        document.addEventListener("mouseout", onMouseOut);

        // High-performance animation loop
        let rafId;
        const animate = () => {
            // 1. Move the main cursor instantly
            if (mainCursorRef.current) {
                mainCursorRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
            }

            // 2. Calculate the stretchy physics for the tail
            let targetX = mouse.current.x;
            let targetY = mouse.current.y;

            dots.current.forEach((dot, index) => {
                // Easing factor (lower = stretchier/slower)
                dot.x += (targetX - dot.x) * 0.45;
                dot.y += (targetY - dot.y) * 0.45;

                // The next dot follows THIS dot
                targetX = dot.x;
                targetY = dot.y;

                // Apply to the DOM
                if (tailRefs.current[index]) {
                    tailRefs.current[index].style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) scale(${1 - index * 0.06})`;
                }
            });

            rafId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseover", onMouseOver);
            document.removeEventListener("mouseout", onMouseOut);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[10000] pointer-events-none hidden md:block overflow-hidden">

            {/* The Trailing Comet Tail */}
            {Array.from({ length: TAIL_LENGTH }).map((_, i) => (
                <div
                    key={i}
                    ref={(el) => (tailRefs.current[i] = el)}
                    className="absolute top-0 left-0 w-3 h-3 rounded-full bg-cyan -ml-1.5 -mt-1.5 transition-opacity duration-300"
                    style={{
                        // Fade out the tail when hovering a button
                        opacity: isHovering ? 0 : 0.8 - (i / TAIL_LENGTH) * 0.8,
                        filter: `blur(${i * 0.4}px)`, // Gets blurrier towards the end
                    }}
                />
            ))}

            {/* Main Leading Cursor */}
            <div
                ref={mainCursorRef}
                className={`absolute top-0 left-0 rounded-full transition-all duration-300 ease-out border-2 ${isHovering
                        ? "w-12 h-12 -ml-6 -mt-6 bg-accent/20 border-accent backdrop-blur-sm shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                        : "w-4 h-4 -ml-2 -mt-2 border-cyan bg-cyan shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                    }`}
            />
        </div>
    );
}