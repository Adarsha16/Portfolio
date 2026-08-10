import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BootLoader({ onComplete }) {
    const [lines, setLines] = useState([]);
    const [isExiting, setIsExiting] = useState(false);

    const bootSequence = [
        "BOOT_SEQ_INIT: Starting virtual environment...",
        "MOUNTING REACT DOM: Success.",
        "LOADING NEURAL WEIGHTS: [████████████] 100%",
        "RESOLVING DEPENDENCIES: 0 vulnerabilities found.",
        "ESTABLISHING SECURE CONNECTION...",
        "ACCESS GRANTED."
    ];

    useEffect(() => {
        let currentLine = 0;
        const interval = setInterval(() => {
            if (currentLine < bootSequence.length) {
                setLines((prev) => [...prev, bootSequence[currentLine]]);
                currentLine++;
            } else {
                clearInterval(interval);
                setTimeout(() => setIsExiting(true), 800); // Pause before fading out
            }
        }, 300); // Speed of the typing effect

        return () => clearInterval(interval);
    }, []);

    // When exit animation finishes, tell App to show the website
    return (
        <AnimatePresence onExitComplete={onComplete}>
            {!isExiting && (
                <motion.div
                    exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex flex-col justify-center bg-void text-text-primary font-mono text-sm sm:text-base p-6 sm:p-20"
                >
                    <div className="w-full max-w-2xl mx-auto">
                        {lines.map((line, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="mb-2"
                            >
                                <span className="text-emerald mr-2">[{i === bootSequence.length - 1 ? "OK" : ".."}]</span>
                                {line}
                            </motion.div>
                        ))}

                        {/* Blinking Terminal Cursor */}
                        <motion.div
                            animate={{ opacity: [1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="inline-block w-2.5 h-5 bg-accent ml-2 align-middle mt-2"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}