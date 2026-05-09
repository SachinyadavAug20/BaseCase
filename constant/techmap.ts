const normalize = (tech: string) =>
  tech.toLowerCase().replace(/\s+/g, "").replace(/[.#]/g, "");

const specialCases: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  "c++": "cplusplus",
  cpp: "cplusplus",
  "c#": "csharp",
  csharp: "csharp",
  amazonwebservices: "amazonwebservices",
  aws: "amazonwebservices",
  next: "nextjs",
  css: "css3",
  reactjs: "react",
  node: "nodejs",
  mongo: "mongodb",
  tailwind: "tailwindcss",
};

export const techDescriptions: Record<string, string> = {
  javascript:
    "JavaScript is a powerful language used to build dynamic, interactive, and modern web applications.",

  typescript:
    "TypeScript adds strong typing to JavaScript, helping developers build scalable and maintainable applications.",

  react:
    "React is a popular JavaScript library for building fast and interactive user interfaces using reusable components.",

  nextjs:
    "Next.js is a React framework that supports server-side rendering, routing, and full-stack web development.",

  nodejs:
    "Node.js allows developers to run JavaScript outside the browser to build backend servers and APIs.",

  express:
    "Express.js is a lightweight Node.js framework used for creating web servers and APIs.",

  mongodb:
    "MongoDB is a NoSQL database that stores data in flexible JSON-like documents.",

  mongoose:
    "Mongoose is an ODM library that simplifies working with MongoDB in Node.js applications.",

  tailwindcss:
    "Tailwind CSS is a utility-first CSS framework used to rapidly build responsive and modern interfaces.",

  html5:
    "HTML5 provides the structure and semantic foundation of modern web pages.",

  css3: "CSS3 is used to style web pages with layouts, colors, animations, and responsive designs.",

  sass: "Sass is a CSS preprocessor that adds features like variables, nesting, and reusable styles.",

  bootstrap:
    "Bootstrap is a frontend CSS framework that provides prebuilt responsive UI components.",

  c: "C is a fast and low-level programming language widely used in operating systems, embedded systems, and performance-critical applications.",

  cplusplus:
    "C++ extends C with object-oriented programming and is commonly used in game development, DSA, and competitive programming.",

  csharp:
    "C# is a modern programming language developed by Microsoft for desktop, web, and game development.",

  java: "Java is a powerful object-oriented programming language used in enterprise software, Android apps, and backend systems.",

  python:
    "Python is a beginner-friendly and versatile language used in web development, AI, automation, and data science.",

  go: "Go is a fast and simple programming language developed by Google for scalable backend and cloud applications.",

  rust: "Rust is a systems programming language focused on performance, memory safety, and concurrency.",

  kotlin:
    "Kotlin is a modern programming language used mainly for Android development and backend applications.",

  swift:
    "Swift is Apple's programming language for building iOS, macOS, and other Apple platform applications.",

  php: "PHP is a server-side scripting language widely used for backend web development.",

  ruby: "Ruby is a clean and developer-friendly programming language often used with the Ruby on Rails framework.",

  dart: "Dart is a programming language developed by Google mainly used with Flutter for cross-platform apps.",

  flutter:
    "Flutter is a UI toolkit by Google used to build cross-platform mobile, desktop, and web applications.",

  linux:
    "Linux is an open-source operating system widely used in servers, cloud computing, cybersecurity, and development environments.",

  ubuntu:
    "Ubuntu is a beginner-friendly Linux distribution popular among developers and server administrators.",

  archlinux:
    "Arch Linux is a lightweight and highly customizable Linux distribution preferred by advanced users.",

  git: "Git is a distributed version control system used to track code changes and collaborate with developers.",

  github:
    "GitHub is a platform for hosting Git repositories and collaborating on software projects.",

  gitlab:
    "GitLab is a DevOps platform that provides Git repository hosting, CI/CD, and project management tools.",

  docker:
    "Docker allows developers to package applications and dependencies into portable containers.",

  kubernetes:
    "Kubernetes is a container orchestration platform used to automate deployment and scaling of applications.",

  firebase:
    "Firebase is a backend platform by Google offering authentication, databases, hosting, and cloud services.",

  supabase:
    "Supabase is an open-source backend platform that provides databases, authentication, and APIs.",

  mysql:
    "MySQL is a relational database management system used to store and organize structured data.",

  postgresql:
    "PostgreSQL is an advanced open-source relational database known for reliability and powerful SQL features.",

  sqlite:
    "SQLite is a lightweight relational database commonly used in mobile apps and local applications.",

  prisma:
    "Prisma is a modern ORM that simplifies database access and management in TypeScript applications.",

  redux:
    "Redux is a state management library used to manage shared application state in React apps.",

  graphql:
    "GraphQL is a query language for APIs that allows clients to request only the data they need.",

  redis:
    "Redis is a high-speed in-memory database commonly used for caching and sessions.",

  websocket:
    "WebSockets enable real-time two-way communication between clients and servers.",

  jwt: "JWT is a compact token format used for secure authentication and authorization.",

  oauth:
    "OAuth is an authorization protocol that enables secure login and access delegation.",

  vite: "Vite is a fast frontend build tool and development server for modern web projects.",

  webpack:
    "Webpack is a module bundler used to bundle JavaScript, CSS, and other assets.",

  babel:
    "Babel is a JavaScript compiler that converts modern JavaScript into browser-compatible code.",

  npm: "npm is the default package manager for Node.js used to install and manage JavaScript packages.",

  yarn: "Yarn is a fast and reliable JavaScript package manager.",

  pnpm: "pnpm is an efficient package manager that saves disk space using a shared dependency store.",

  figma:
    "Figma is a collaborative UI/UX design tool used for designing websites and applications.",

  vercel:
    "Vercel is a cloud platform optimized for deploying frontend frameworks like Next.js.",

  netlify:
    "Netlify is a deployment and hosting platform for modern frontend web applications.",

  vscode:
    "Visual Studio Code is a lightweight and powerful code editor widely used by developers.",

  bash: "Bash is a command-line shell used for scripting and interacting with Linux systems.",

  powershell:
    "PowerShell is a command-line shell and scripting language developed by Microsoft.",

  nginx:
    "Nginx is a high-performance web server and reverse proxy used in modern web infrastructure.",

  apache: "Apache is a widely used open-source web server software.",

  reactquery:
    "React Query simplifies server-state fetching, caching, and synchronization in React applications.",

  zod: "Zod is a TypeScript-first schema validation library used for validating application data.",

  framermotion:
    "Framer Motion is a React animation library used to create smooth and interactive UI animations.",

  threejs:
    "Three.js is a JavaScript library used for creating 3D graphics and animations in the browser.",

  socketio:
    "Socket.IO enables real-time event-based communication between frontend and backend applications.",

  electron:
    "Electron allows developers to build cross-platform desktop applications using web technologies.",

  tensorflow:
    "TensorFlow is an open-source machine learning framework developed by Google.",

  pytorch:
    "PyTorch is a popular deep learning framework widely used in AI research and development.",

  openai:
    "OpenAI provides AI models and APIs used for natural language processing and intelligent applications.",
};

export const getTechDescription = (tech: string) => {
  const key = normalize(tech);
  const finalKey = specialCases[key] || key;
  return techDescriptions[finalKey]
    ? techDescriptions[finalKey]
    : `${tech} is a modern technology used by developers to build software applications and digital experiences.`;
};

export const getDevIcon = (tech: string) => {
  const key = normalize(tech);
  const finalKey = specialCases[key] || key;

  return `devicon-${finalKey}-plain colored`;
};
