import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BootLoader from "./components/BootLoader";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="bg-void min-h-screen text-text-primary selection:bg-accent selection:text-white font-sans">

      {!isLoaded && <BootLoader onComplete={() => setIsLoaded(true)} />}

      {/* 2. Reveal the app only when loaded */}
      {isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Navbar />

          <main>
            {/* Hero — full width */}
            <Hero />

            {/* All sections — centered in a max-w container with generous spacing */}
            <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 lg:px-12">
              <div className="flex flex-col gap-24 py-16">
                <About />
                <Projects />
                <Skills />
                <Education />
                <Contact />
              </div>
            </div>
          </main>

          <Footer />
        </motion.div>
      )}
    </div>
  );
}
