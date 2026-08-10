import { motion } from "framer-motion";

export default function Education() {
  return (
    <section id="education" className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="mb-10"
      >
        <p className="text-accent font-mono text-sm tracking-wider uppercase mb-2">
          04. Background
        </p>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
          Education Profile
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="bg-surface/20 border border-border/40 rounded-xl p-6 sm:p-8 font-mono text-sm sm:text-base overflow-x-auto"
      >
        {/* Terminal / Code Editor Style Display */}
        <div className="text-text-muted mb-4">
          <span className="text-emerald">~/system/user</span> $ cat education.json
        </div>

        <div className="text-text-primary pl-4 border-l-2 border-border/50">
          <span className="text-accent">{"{"}</span>

          <div className="pl-4 py-2">
            <span className="text-cyan">"degree"</span>: <span className="text-amber">"Computer Engineering"</span>,
            <br />
            <span className="text-cyan">"university"</span>: <span className="text-amber">"Kathmandu University"</span>,
            <br />
            <span className="text-cyan">"timeline"</span>: <span className="text-amber">"2022-Current"</span>,
            <br />
            <span className="text-cyan">"focus_areas"</span>: [
            <br />
            <span className="text-emerald pl-4">"Data Structures & Algorithms"</span>,
            <br />
            <span className="text-emerald pl-4">"Deep Learning"</span>,
            <br />
            <span className="text-emerald pl-4">"Cloud Computing"</span>
            <br />
            ]
          </div>

          <span className="text-accent">{"}"}</span>
        </div>

        <div className="text-text-muted mt-4 flex items-center gap-2">
          <span className="text-emerald">~/system/user</span> $
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="w-2 h-4 bg-text-muted inline-block"
          />
        </div>
      </motion.div>
    </section>
  );
}