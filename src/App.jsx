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
import { useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  // Check sessionStorage so the bootloader doesn't annoy returning users
  const [isLoaded, setIsLoaded] = useState(() => {
    return sessionStorage.getItem("booted") === "true";
  });

  const handleBootComplete = () => {
    sessionStorage.setItem("booted", "true");
    setIsLoaded(true);
  };

  return (
    <div className="bg-void min-h-screen text-text-primary selection:bg-accent selection:text-white font-sans">

      <CustomCursor />

      {!isLoaded && <BootLoader onComplete={handleBootComplete} />}

      {isLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
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