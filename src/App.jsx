import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BootLoader from "./components/BootLoader";
import CustomCursor from "./components/CustomCursor";
import Scene3D from "./components/Scene3D"; // Import the 3D Scene
import { useState } from "react";
import { motion, useScroll } from "framer-motion";

export default function App() {
  const [isLoaded, setIsLoaded] = useState(() => {
    return sessionStorage.getItem("booted") === "true";
  });

  const handleBootComplete = () => {
    sessionStorage.setItem("booted", "true");
    setIsLoaded(true);
  };

  const { scrollYProgress } = useScroll();

  return (
    // Note: removed 'bg-void' here so the 3D canvas shows through
    <div className="min-h-screen text-text-primary selection:bg-accent selection:text-white font-sans relative">
      <CustomCursor />

      {!isLoaded && <BootLoader onComplete={handleBootComplete} />}

      {isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* Fixed 3D Background */}
          <div className="fixed inset-0 -z-20 pointer-events-none">
            <Scene3D scrollProgress={scrollYProgress} />
          </div>

          {/* Dark gradient overlay to ensure text is always readable over 3D */}
          <div className="fixed inset-0 -z-10 pointer-events-none bg-gradient-to-b from-void/30 via-void/60 to-void/90" />

          <Navbar />
          <main>
            <Hero />
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