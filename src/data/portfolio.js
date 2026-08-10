export const personalInfo = {
  name: "Adarsha Pant",
  title: "Software Engineer",
  tagline: "Building scalable systems at the intersection of AI and software engineering",
  email: "adarshapant350@gmail.com",
  location: "Kathmandu, Nepal",
  github: "https://github.com/Adarsha16",
  linkedin: "https://www.linkedin.com/in/adarsha-pant-849193256/",
  summary:
    "Computer Engineering undergraduate and Software Engineer passionate about building scalable systems and integrating AI into web applications. Deeply interested in Computer Vision, Machine Learning, Algorithms, and System Design. Experienced in bridging applied machine learning with production architectures, from training custom neural networks to architecting high-concurrency backend pipelines.",
};


export const skills = {
  languages: {
    label: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "C++", "SQL", "PHP"],
    color: "accent",
  },
  backend: {
    label: "Backend & Systems",
    items: [
      "FastAPI",
      "Node.js",
      "PostgreSQL",
      "MySQL",
      "SQLAlchemy",
      "Alembic",
      "Docker",
      "JWT",
      "WebSockets",
      "Socket.io",
      "Linux",
      "API Design",
    ],
    color: "cyan",
  },
  ml: {
    label: "AI & Machine Learning",
    items: [
      "PyTorch",
      "TensorFlow",
      "OpenCV",
      "YOLOv8",
      "MediaPipe",
      "Scikit-Learn",
    ],
    color: "emerald",
  },
  frontend: {
    label: "Frontend & Tooling",
    items: ["React", "Next.js", "Redux", "Tailwind", "NumPy", "SciPy", "Git"],
    color: "amber",
  },
};

export const projects = [
  {
    title: "Signly",
    subtitle: "Sign Language Translation Platform",
    description:
      "A real-time sign-language translation platform with live webcam gesture recognition using custom neural networks (LSTM + Closed Hand Detector) achieving 98.5% accuracy, paired with NLP-driven English-to-ASL grammar rewriting.",
    tech: ["Python", "TensorFlow", "PyTorch", "MediaPipe", "NLTK", "FastAPI"],
    highlights: [
      "Custom multi-input neural network with Bidirectional LSTM",
      "English-to-ASL grammar rewriter using NLTK WordNet",
      "Multithreaded WLASL corpus scraper with yt-dlp",
    ],
    github: "https://github.com/Pranaya-sht/ASL",
    color: "#6366f1",
    category: "AI / Computer Vision",
  },
  {
    title: "Road Damage Detection",
    subtitle: "Smart Road Damage Pipeline (SRDP)",
    description:
      "YOLOv8-powered road damage detection system trained on 17,000+ images across 5 countries with a custom Severity Index algorithm and A* repair scheduling.",
    tech: ["Python", "YOLOv8", "OpenCV", "PyTorch", "FastAPI"],
    highlights: [
      "4-class road defect detection on 10K image dataset",
      "Custom Severity Index: Good/Fair/Poor/Critical grading",
      "A* search for cost-optimized repair scheduling",
      "Real-time FastAPI inference with base64 image processing",
    ],
    github: "https://github.com/Adarsha16/RoadDamageAutomation",
    color: "#22d3ee",
    category: "AI / Computer Vision",
  },
  {
    title: "Code Room",
    subtitle: "Real-time Collaborative IDE",
    description:
      "A sandboxed multi-language compiler API with Docker containers, real-time collaborative editing via WebSockets, integrated chat, and Monaco Editor.",
    tech: ["Node.js", "Docker", "Socket.io", "MySQL", "React", "Redux"],
    highlights: [
      "Sandboxed execution of JS, Python, C++ via Docker",
      "Real-time sync engine with WebSockets/Socket.io",
      "Custom JWT auth with OTP email verification",
      "Monaco Editor with Redux Toolkit state management",
    ],
    github: "https://github.com/Adarsha16/CodeRoom",
    color: "#34d399",
    category: "Full Stack",
  },
  /*{
    title: "Butterfly Effect",
    subtitle: "Financial Risk Terminal",
    description:
      "A predictive risk terminal using chaos theory mathematics — Lyapunov exponents, Takens embedding — to model market fragility with a proprietary Early Warning Index.",
    tech: ["TypeScript", "React", "Yahoo Finance API"],
    highlights: [
      "Lyapunov exponent & Takens embedding for chaos modeling",
      "Proprietary Early Warning Index (EWI) from live data",
      "Sigmoid probability surfaces for buy/bear signals",
      "Historical crisis backtesting with frame-by-frame playback",
    ],
    github: "https://github.com/Adarsha16/butterfly_effect/",
    color: "#f472b6",
    category: "Finance / Math",
  },*/
  {
    title: "IntelliMark",
    subtitle: "Event Management Backend",
    description:
      "Async FastAPI backend on PostgreSQL with relational schemas, thread-safe Stable Diffusion task queues, geospatial navigation, and automated executive PDF reporting.",
    tech: ["FastAPI", "PostgreSQL", "SQLAlchemy", "Docker", "Alembic"],
    highlights: [
      "Thread-safe GPU task queue with OS-level file locking",
      "Automated ReportLab PDF generation with AI commentary",
      "Geospatial endpoints with Leaflet + OSRM navigation",
      "Alembic migration management with branch conflict resolution",
    ],
    github: "https://github.com/Adarsha16/intellimark/",
    color: "#fbbf24",
    category: "Backend / AI",
  },
  {
    title: "Space Cleaners",
    subtitle: "Commercial Service Platform",
    description:
      "Full-stack commercial platform with PHP backend, JWT auth, async cron email queue, Google Gemini chatbot integration, and a React/Tailwind admin dashboard.",
    tech: ["PHP", "MySQL", "React", "Tailwind", "Gemini API"],
    highlights: [
      "Full-service platform with CRM and automated invoicing",
      "Context-aware chatbot powered by Gemini 2.5 API",
      "Multi-step quote builder with dark mode support",
      "Recharts-based admin analytics dashboard",
    ],
    link: "https://spacecleaners.com.au",
    color: "#8b5cf6",
    category: "Full Stack",
  },
];

export const additionalProjects = [
  {
    title: "Spashta Sound",
    description: "DSP pipeline from scratch — STFT, Spectral Subtraction, Wiener Filtering with React dashboard.",
    tech: ["Python", "FastAPI", "NumPy", "SciPy"],
    github: "https://github.com/Adarsha16/spashta_sound",
  },
  {
    title: "LL(1) Compiler Visualizer",
    description: "Educational tool for top-down predictive parsing with left-factoring and FIRST/FOLLOW computation.",
    tech: ["Python", "FastAPI", "React"],
    github: "https://github.com/Adarsha16/compiler_project",
  },
];

export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
];
