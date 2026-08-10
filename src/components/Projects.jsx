import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, additionalProjects } from "../data/portfolio";
import {
  FiGithub,
  FiExternalLink,
  FiChevronRight,
  FiCpu,
  FiLayout,
  FiDatabase,
  FiTrendingUp,
  FiTerminal
} from "react-icons/fi";

const categories = ["All", "AI / Computer Vision", "Full Stack", "Backend / AI", "Finance / Math"];

const getCategoryIcon = (category) => {
  switch (category) {
    case "AI / Computer Vision": return <FiCpu />;
    case "Full Stack": return <FiLayout />;
    case "Backend / AI": return <FiDatabase />;
    case "Finance / Math": return <FiTrendingUp />;
    default: return <FiLayout />;
  }
};

/* ─── Premium Wide Project Card ─── */
function ProjectCard({ project }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!divRef.current || isFocused) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className="relative rounded-3xl bg-surface/20 border border-border/30 overflow-hidden transition-colors duration-500 hover:border-border h-full flex flex-col"
    >
      {/* ─── Hover Spotlight Glow ─── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-in-out"
        style={{
          opacity: isFocused ? 1 : 0,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(99,102,241,0.06), transparent 40%)`,
        }}
      />

      <div className="relative z-10 p-6 sm:p-7 flex flex-col flex-1">

        {/* ─── Top Row: Header & Links (Saves vertical space) ─── */}
        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-void border border-border/50 text-xl text-accent shadow-lg shadow-accent/5">
              {getCategoryIcon(project.category)}
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-text-primary group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-text-primary group-hover:to-accent-light transition-all duration-300">
                {project.title}
              </h3>
              <p className="text-sm text-accent/80 font-mono tracking-wide">{project.subtitle}</p>
            </div>
          </div>

          {/* Action Links (Moved to top right) */}
          <div className="flex items-center gap-3 pt-1">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" title="Source Code" className="p-2 rounded-lg bg-surface/50 border border-border/40 text-text-muted hover:text-accent hover:border-accent/40 transition-all duration-300">
                <FiGithub className="w-4 h-4" />
              </a>
            )}
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" title="Live Demo" className="p-2 rounded-lg bg-surface/50 border border-border/40 text-text-muted hover:text-cyan hover:border-cyan/40 transition-all duration-300">
                <FiExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* ─── Middle: Description ─── */}
        <p className="text-text-secondary text-sm leading-relaxed mb-5">
          {project.description}
        </p>

        {/* ─── Expandable Terminal Logs ─── */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mb-5"
            >
              <div className="bg-void border border-border/50 rounded-lg p-4 font-mono text-xs sm:text-sm shadow-inner shadow-black/50">
                <div className="text-emerald mb-2">
                  <span className="text-accent">guest@system</span>:~$ cat execution_logs.txt
                </div>
                <ul className="space-y-2">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-3 text-text-secondary">
                      <span className="text-cyan mt-0.5">{">"}</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Bottom Row: Tags & Toggle (Side-by-side to save space) ─── */}
        <div className="mt-auto pt-5 border-t border-border/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="px-2 py-1 text-[10px] font-mono rounded bg-void border border-border/40 text-text-muted">
                {t}
              </span>
            ))}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 flex items-center gap-2 text-xs font-mono font-medium text-text-muted hover:text-cyan transition-colors"
          >
            <FiTerminal className="w-4 h-4" />
            <span>{isExpanded ? "./close" : "./logs"}</span>
            <motion.span animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
              <FiChevronRight className="w-3.5 h-3.5" />
            </motion.span>
          </button>
        </div>

      </div>
    </div>
  );
}

/* ─── Timeline Node Wrapper ─── */
function TimelineNode({ project, index }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
      className="group relative flex w-full mb-12 sm:mb-16"
    >
      {/* Center Axis Dot */}
      <div className="absolute left-[20px] md:left-1/2 w-3 h-3 rounded-full bg-void border-[1.5px] border-cyan transform -translate-x-1/2 top-10 shadow-[0_0_10px_rgba(34,211,238,0.5)] z-20 transition-all duration-500 group-hover:bg-cyan group-hover:scale-[1.5] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.8)]" />

      <div className={`w-full md:w-1/2 pl-14 md:pl-0 ${isEven ? 'md:pr-8 md:ml-0' : 'md:pl-8 md:ml-auto'}`}>
        <ProjectCard project={project} />
      </div>
    </motion.div>
  );
}

function AdditionalProjectCard({ project, index }) {
  return (
    <motion.a
      href={project.github}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group block p-5 rounded-2xl border border-border/30 bg-surface/20 hover:bg-surface/50 hover:border-accent/40 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-display font-semibold text-base text-text-primary group-hover:text-accent-light transition-colors">
            {project.title}
          </h4>
          <FiGithub className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors flex-shrink-0 mt-0.5" />
        </div>
        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-void border border-border/30 text-text-muted">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.a>
  );
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showArchived, setShowArchived] = useState(false);

  // Take exactly 4 for the timeline, put the rest in the archive
  const filteredProjects = activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);
  const mainTimelineProjects = filteredProjects.slice(0, 4);

  return (
    <section id="projects" className="w-full relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-10"
      >
        <p className="text-accent font-mono text-sm tracking-wider uppercase mb-2">
          02. Operations
        </p>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-6">
          Completed Projects
        </h2>
      </motion.div>

      {/* Cyber-Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-2 mb-16"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveFilter(cat);
              setShowArchived(false); // Clean up UI when switching tabs
            }}
            className={`px-4 py-2 text-xs font-mono rounded-lg border transition-all duration-300 ${activeFilter === cat
              ? "bg-accent/10 text-accent border-accent/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]"
              : "bg-void border-border/40 text-text-muted hover:text-text-primary hover:border-border"
              }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* ─── Wide Alternating Timeline ─── */}
      <div className="relative w-full mx-auto mb-16">
        {/* The Central Line */}
        <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-px bg-border/50 transform -translate-x-1/2" />

        {/* Animated Data Packet */}
        <motion.div
          animate={{ top: ["0%", "100%"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute left-[20px] md:left-1/2 w-[2px] h-32 bg-gradient-to-b from-transparent via-cyan to-transparent transform -translate-x-1/2 z-10 pointer-events-none"
        />

        {/* The Project Nodes */}
        <div className="relative z-20">
          <AnimatePresence mode="popLayout">
            {mainTimelineProjects.map((project, i) => (
              <TimelineNode key={project.title} project={project} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Archive Toggle ─── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="flex flex-col items-center justify-center pt-8 border-t border-border/30"
      >
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="group flex items-center gap-3 px-6 py-3 rounded-full bg-surface/40 border border-border/50 text-sm font-mono text-text-secondary hover:text-cyan hover:border-cyan/50 transition-all duration-300"
        >
          <FiTerminal className="w-4 h-4 text-accent group-hover:text-cyan transition-colors" />
          {showArchived ? "./close_archive.sh" : "./fetch_archived_nodes.sh"}
          <motion.div animate={{ rotate: showArchived ? 180 : 0 }}>
            <FiChevronRight className="w-4 h-4 rotate-90" />
          </motion.div>
        </button>
      </motion.div>

      {/* ─── Hidden Archive Grid ─── */}
      <AnimatePresence>
        {showArchived && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden mt-8"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {additionalProjects.map((project, i) => (
                <AdditionalProjectCard key={project.title} project={project} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}