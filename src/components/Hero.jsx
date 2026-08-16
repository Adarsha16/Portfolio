import { motion } from "framer-motion";
import { personalInfo } from "../data/portfolio";
import { FiGithub, FiLinkedin, FiMail, FiMapPin } from "react-icons/fi";

/* ─── Interactive Terminal (Pure CSS/HTML, Single View) ─── */
function InteractiveTerminal() {
  return (
    <div className="w-full max-w-2xl mx-auto bg-surface/60 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-2xl shadow-void/50 text-left">
      {/* Title bar */}
      <div className="flex items-center px-5 py-3.5 bg-surface/80 border-b border-border/30 relative">
        <div className="flex gap-2 absolute left-5">
          <div className="w-3 h-3 rounded-full bg-rose/70" />
          <div className="w-3 h-3 rounded-full bg-amber/70" />
          <div className="w-3 h-3 rounded-full bg-emerald/70" />
        </div>
        <div className="flex-1 text-center font-mono text-xs text-text-muted">
          bash — adarsha@portfolio
        </div>
      </div>

      {/* Content */}
      <div className="p-6 font-mono min-h-[260px] max-h-[300px] overflow-auto">
        <div className="space-y-3 text-[13px] leading-relaxed">
          <p>
            <span className="text-emerald">adarsha</span>
            <span className="text-text-muted">@</span>
            <span className="text-cyan">portfolio</span>
            <span className="text-text-muted"> ~ $ </span>
            <span className="text-text-primary">whoami</span>
          </p>
          <p className="text-text-secondary pl-1">
            Software Engineer · Computer Engineering @ Kathmandu University
          </p>

          <p className="mt-2">
            <span className="text-emerald">adarsha</span>
            <span className="text-text-muted">@</span>
            <span className="text-cyan">portfolio</span>
            <span className="text-text-muted"> ~ $ </span>
            <span className="text-text-primary">cat focus.txt</span>
          </p>
          <p className="text-text-secondary pl-1">
            Building scalable backends, training deep learning models,<br />
            and engineering real-time collaborative systems.
          </p>

          <p className="mt-2">
            <span className="text-emerald">adarsha</span>
            <span className="text-text-muted">@</span>
            <span className="text-cyan">portfolio</span>
            <span className="text-text-muted"> ~ $ </span>
            <span className="text-text-primary">cat projects.log | head -3</span>
          </p>
          <p className="text-text-secondary pl-1">
            → Signly: A sign language recognition app from real time video feed<br />
            → CodeRoom: A real-time collaborative online code editor<br />
            → RoadDamageDetector: A YOLOv8 model trained on 10k images
          </p>

          <p className="mt-2">
            <span className="text-emerald">adarsha</span>
            <span className="text-text-muted">@</span>
            <span className="text-cyan">portfolio</span>
            <span className="text-text-muted"> ~ $ </span>
            <span className="text-accent-light animate-pulse">▊</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative w-full min-h-[100svh] flex flex-col items-center justify-center px-6 py-24">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center z-10">

        {/* Location */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-2 text-text-muted font-mono text-xs tracking-widest uppercase mb-8"
        >
          <FiMapPin className="text-accent w-3.5 h-3.5" />
          <span>{personalInfo.location}</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-display font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-text-primary mb-6"
        >
          Adarsha Pant
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-xl text-text-secondary text-base sm:text-lg leading-relaxed mb-10"
        >
          Software Engineer building scalable systems and intelligent
          applications at the intersection of AI and robust backend architecture.
        </motion.p>

        {/* CTA + Social */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-16"
        >
          <button
            onClick={scrollToProjects}
            className="px-8 py-3.5 rounded-full bg-text-primary text-void font-semibold text-sm hover:bg-white transition-colors"
          >
            Explore Projects
          </button>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-full bg-transparent border border-text-primary text-text-primary font-semibold text-sm hover:bg-text-primary hover:text-void transition-colors"
          >
            Download Resume
          </a>

          <div className="flex items-center gap-1 ml-2">
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="p-3 text-text-muted hover:text-text-primary transition-colors" aria-label="GitHub">
              <FiGithub className="w-5 h-5" />
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 text-text-muted hover:text-text-primary transition-colors" aria-label="LinkedIn">
              <FiLinkedin className="w-5 h-5" />
            </a>
            <a href={`mailto:${personalInfo.email}`} className="p-3 text-text-muted hover:text-text-primary transition-colors" aria-label="Email">
              <FiMail className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

        {/* Interactive Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-full"
        >
          <InteractiveTerminal />
        </motion.div>
      </div>
    </section>
  );
}