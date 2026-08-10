import { personalInfo, navLinks } from "../data/portfolio";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-void pt-20 pb-10 border-t border-border/20">
      <div className="w-full max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-4 mb-16">
          <div className="md:col-span-2">
            <span className="block font-display font-bold text-xl tracking-wider text-text-primary uppercase mb-4">
              Adarsha Pant
            </span>
            <p className="text-text-muted text-sm max-w-sm leading-relaxed">
              Software Engineer crafting scalable systems, predictive models, and performant web applications. 
              Bridging the gap between ML research and production architecture.
            </p>
          </div>
          
          <div>
            <span className="block text-xs font-semibold uppercase tracking-widest text-text-primary mb-5">
              Navigate
            </span>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-text-muted hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="block text-xs font-semibold uppercase tracking-widest text-text-primary mb-5">
              Connect
            </span>
            <ul className="space-y-3">
              <li>
                <a
                  href={personalInfo.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  <FiGithub className="w-4 h-4 group-hover:text-accent transition-colors" />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={personalInfo.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  <FiLinkedin className="w-4 h-4 group-hover:text-accent transition-colors" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="group flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
                >
                  <FiMail className="w-4 h-4 group-hover:text-accent transition-colors" />
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/20">
          <p className="text-xs text-text-muted/60">
            © {year} Adarsha Pant. All rights reserved.
          </p>
          <p className="text-xs text-text-muted/60">
            Designed & Engineered with React, Three.js & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
}
