import { motion } from "framer-motion";
import { personalInfo } from "../data/portfolio";

export default function About() {

  return (
    <section id="about" className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-10"
      >
        <p className="text-accent font-mono text-sm tracking-wider uppercase mb-2">
          01. About
        </p>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
          A bit about me
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        // Update this one too
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex flex-col items-center text-center space-y-6 bg-surface/40 border border-border/40 p-8 sm:p-12 rounded-3xl"
      >
        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-void border-4 border-border/50 mb-6 shadow-[0_0_30px_rgba(99,102,241,0.15)] flex items-center justify-center font-mono text-3xl sm:text-4xl text-accent relative overflow-hidden group">
          {/* Subtle glowing radial background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)] opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

          <span className="relative flex items-center gap-1 mt-2 sm:mt-3">
            {">"}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="w-3 h-7 sm:w-4 sm:h-8 bg-accent inline-block"
            />
          </span>
        </div>

        <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-2xl">
          {personalInfo.summary}
        </p>

        <div className="pt-6 flex flex-wrap justify-center gap-2 max-w-2xl">
          {[
            "Computer Vision",
            "Machine Learning",
            "System Design",
            "Algorithms",
            "Full-Stack Development",
            "Real-Time Systems",
          ].map((interest) => (
            <span
              key={interest}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-surface border border-border/60 text-text-secondary hover:text-text-primary transition-colors cursor-default"
            >
              {interest}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}