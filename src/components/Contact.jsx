import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { personalInfo } from "../data/portfolio";
import {
  FiGithub,
  FiLinkedin,
  FiMail,
  FiSend,
  FiCopy,
  FiCheck,
  FiX
} from "react-icons/fi";

export default function Contact() {
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [copied, setCopied] = useState(false);

  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formData = new FormData();
    // Fetching the key securely from Vite's env variables
    formData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY);
    formData.append("name", formState.name);
    formData.append("email", formState.email);
    formData.append("message", formState.message);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormState({ name: "", email: "", message: "" });
        // Hide the success message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    }

    setIsSubmitting(false);
  };

  return (
    <section id="contact" ref={ref} className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="text-center mb-14"
      >
        <p className="text-accent font-mono text-sm tracking-wider uppercase mb-3">
          05. Contact
        </p>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-5">
          Let's work together
        </h2>
        <p className="text-text-secondary max-w-md mx-auto text-base leading-relaxed">
          Currently open to internships, freelance projects, and interesting
          collaborations. Drop me a message, I'd love to hear from you.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          <button
            onClick={copyEmail}
            className="col-span-2 bg-surface/30 border border-border/40 rounded-xl p-4 flex items-center gap-3 text-left hover:border-border transition-colors group"
          >
            <FiMail className="w-4 h-4 text-accent flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-text-muted mb-0.5">Email</p>
              <p className="text-sm text-text-secondary truncate">
                {copied ? "Copied to clipboard!" : personalInfo.email}
              </p>
            </div>
            <div className="flex-shrink-0 text-text-muted group-hover:text-text-primary transition-colors">
              {copied ? <FiCheck className="w-3.5 h-3.5 text-emerald" /> : <FiCopy className="w-3.5 h-3.5" />}
            </div>
          </button>

          <a
            href={personalInfo.github}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface/30 border border-border/40 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-text-muted hover:text-text-primary hover:border-border transition-colors"
          >
            <FiGithub className="w-5 h-5" />
            <span className="text-xs">GitHub</span>
          </a>

          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface/30 border border-border/40 rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-text-muted hover:text-text-primary hover:border-border transition-colors"
          >
            <FiLinkedin className="w-5 h-5" />
            <span className="text-xs">LinkedIn</span>
          </a>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="bg-surface/30 border border-border/40 rounded-2xl p-6 sm:p-8"
        >
          {/* Status Message Banner */}
          <AnimatePresence>
            {submitStatus && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${submitStatus === 'success'
                    ? 'bg-emerald/10 border-emerald/30 text-emerald'
                    : 'bg-rose/10 border-rose/30 text-rose'
                  }`}>
                  {submitStatus === 'success' ? (
                    <>
                      <FiCheck className="w-5 h-5 flex-shrink-0" />
                      Message sent successfully! I'll get back to you soon.
                    </>
                  ) : (
                    <>
                      <FiX className="w-5 h-5 flex-shrink-0" />
                      Oops! Something went wrong. Please try emailing me directly.
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                Name
              </label>
              <input
                type="text"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-void border border-border/40 text-text-primary text-sm placeholder:text-text-muted/40 focus:outline-none focus:border-border transition-colors"
                placeholder="Your name"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-void border border-border/40 text-text-primary text-sm placeholder:text-text-muted/40 focus:outline-none focus:border-border transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
              Message
            </label>
            <textarea
              value={formState.message}
              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-void border border-border/40 text-text-primary text-sm placeholder:text-text-muted/40 focus:outline-none focus:border-border transition-colors resize-none"
              placeholder="Tell me about your project or opportunity..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-text-primary hover:bg-white text-void font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
            {!isSubmitting && <FiSend className="w-3.5 h-3.5" />}
          </button>
        </motion.form>
      </div>
    </section>
  );
}