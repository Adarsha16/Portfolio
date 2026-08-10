import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { skills } from "../data/portfolio";

export default function Skills() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Flatten and filter skills based on search and category
  const filteredSkills = useMemo(() => {
    let allSkills = [];
    Object.entries(skills).forEach(([key, category]) => {
      category.items.forEach(item => {
        allSkills.push({ name: item, category: key, label: category.label });
      });
    });

    return allSkills.filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "all" || skill.category === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  return (
    <section id="skills" className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-10"
      >
        <p className="text-accent font-mono text-sm tracking-wider uppercase mb-2">
          03. Skills
        </p>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary">
          Tech Stack
        </h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="max-w-3xl mx-auto"
      >
        {/* Command Palette Container */}
        <div className="bg-surface/40 border border-border/50 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">

          {/* Search Header */}
          <div className="flex items-center px-4 py-4 border-b border-border/50 bg-void/50">
            <svg className="w-5 h-5 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search dependencies, languages, frameworks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-text-primary placeholder-text-muted font-mono text-sm sm:text-base focus:ring-0"
            />
            <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] text-text-muted/60 bg-surface px-2 py-1 rounded border border-border/30">
              <span>CTRL</span><span>+</span><span>K</span>
            </div>
          </div>

          {/* Filter Tags */}
          <div className="flex overflow-x-auto gap-2 px-4 py-3 bg-surface/20 border-b border-border/30 no-scrollbar">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors whitespace-nowrap ${activeFilter === "all" ? "bg-accent text-white" : "text-text-secondary hover:bg-surface"
                }`}
            >
              All
            </button>
            {Object.entries(skills).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors whitespace-nowrap ${activeFilter === key ? "bg-accent/20 text-accent border border-accent/30" : "text-text-secondary border border-transparent hover:bg-surface"
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="max-h-[350px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
            <AnimatePresence>
              {filteredSkills.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {filteredSkills.map((skill, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      key={`${skill.category}-${skill.name}`}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-surface/60 group cursor-default"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-text-muted group-hover:text-accent transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        </span>
                        <span className="font-mono text-sm text-text-primary group-hover:text-white transition-colors">
                          {skill.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-text-muted/50 border border-border/30 px-2 py-0.5 rounded-full group-hover:border-accent/30 group-hover:text-accent/70 transition-colors">
                        {skill.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-12 text-center text-text-muted font-mono text-sm"
                >
                  No modules found matching "{searchQuery}"
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="bg-void/40 border-t border-border/40 px-4 py-2 flex justify-between items-center text-[10px] font-mono text-text-muted/60">
            <span>{filteredSkills.length} items loaded</span>
            <div className="flex gap-4">
              <span>↑↓ to navigate</span>
              <span>↵ to select</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}