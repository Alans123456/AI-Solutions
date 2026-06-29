export const mockData = {
  services: [
    {
      _id: "mock-service-1",
      title: "Web Development",
      description: "Responsive websites and web applications for business growth.",
      icon: "Globe",
      category: "Development",
      technologies: ["React", "Node.js", "Express", "SQLite"],
      features: ["Responsive UI", "Admin panel", "API integration", "Deployment support"],
      pricing: "Starting from $2,000",
      status: "Published",
      isMock: true
    },
    {
      _id: "mock-service-2",
      title: "AI & Machine Learning",
      description: "Practical AI features such as chatbots, automation, and document intelligence.",
      icon: "Brain",
      category: "Artificial Intelligence",
      technologies: ["Gemini", "Python", "Vector Search", "APIs"],
      features: ["Chatbot setup", "AI workflow automation", "Document analysis", "Model integration"],
      pricing: "Starting from $3,500",
      status: "Published",
      isMock: true
    },
    {
      _id: "mock-service-3",
      title: "Cloud Solutions",
      description: "Cloud migration, deployment, monitoring, and scalable infrastructure.",
      icon: "Cloud",
      category: "Infrastructure",
      technologies: ["AWS", "Docker", "CI/CD", "Nginx"],
      features: ["Cloud hosting", "Performance tuning", "Monitoring", "Backup planning"],
      pricing: "Starting from $1,500",
      status: "Published",
      isMock: true
    }
  ],
  projects: [
    {
      _id: "mock-project-1",
      title: "E-commerce Platform",
      description: "Modern online store with product management and payment workflow.",
      industry: "Retail",
      technologies: ["React", "Node.js", "SQLite", "Stripe"],
      images: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1000"],
      client: "TechStore Inc.",
      testimonial: "The platform improved sales conversion and simplified operations.",
      completedDate: "2024-01-15",
      challenge: "The client needed a scalable website with product and order management.",
      solution: "Built a responsive frontend, secure backend APIs, and an admin workflow.",
      status: "Published",
      isMock: true
    },
    {
      _id: "mock-project-2",
      title: "Healthcare Management System",
      description: "Digital dashboard for appointment and patient workflow management.",
      industry: "Healthcare",
      technologies: ["React", "Express", "SQLite", "Charts"],
      images: ["https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=1000"],
      client: "MedCare Solutions",
      completedDate: "2024-02-20",
      challenge: "Manual processes slowed down patient administration.",
      solution: "Created a central dashboard with searchable records and role-based access.",
      status: "Published",
      isMock: true
    }
  ],
  blog: [
    {
      _id: "mock-blog-1",
      title: "The Future of Web Development: Trends to Watch",
      excerpt: "A practical look at modern web development, AI integration, and scalable architecture.",
      content: "<h2>Introduction</h2><p>Modern web development is moving toward faster interfaces, API-first systems, and AI-assisted workflows.</p><h2>Practical Direction</h2><p>Businesses benefit most when technology choices are tied to clear operational goals.</p>",
      author: "Alex Thompson",
      publishDate: "2024-03-15",
      readTime: 8,
      category: "Technology",
      tags: ["Web Development", "AI", "Trends"],
      featuredImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1000",
      featured: true,
      status: "Published",
      views: 1250,
      isMock: true
    }
  ],
  events: [
    {
      _id: "mock-event-1",
      title: "AI in Software Development Workshop",
      description: "Learn how to integrate AI tools into development workflows for productivity.",
      date: "2024-04-15",
      time: "10:00",
      location: "Tech Hub, Downtown",
      type: "Workshop",
      speakers: ["Dr. Sarah Chen", "Mark Johnson"],
      agenda: ["Introduction to AI Tools", "Hands-on Session", "Q&A"],
      registrationRequired: true,
      maxAttendees: 50,
      currentAttendees: 32,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1000",
      status: "Published",
      isMock: true
    }
  ],
  testimonials: [
    {
      _id: "mock-testimonial-1",
      clientName: "John Smith",
      clientTitle: "CEO",
      clientCompany: "TechStart Inc.",
      clientImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
      rating: 5,
      testimonial: "Outstanding work. The team delivered exactly what we needed with strong technical execution.",
      date: "2024-01-15",
      industry: "Technology",
      serviceType: "Web Development",
      status: "Approved",
      isMock: true
    }
  ],
  gallery: [
    {
      _id: "mock-gallery-1",
      title: "Modern Office Space",
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000",
      category: "Office",
      description: "Workspace designed for collaboration and product delivery.",
      uploadDate: "2024-01-15",
      status: "Published",
      isMock: true
    }
  ],
  team: [
    {
      _id: "mock-team-1",
      name: "Aarav Sharma",
      role: "AI Product Lead",
      bio: "Leads discovery, product strategy, and delivery planning for AI-enabled business platforms.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600",
      expertise: ["AI Strategy", "Product Design", "Automation"],
      linkedin: "",
      sortOrder: 1,
      status: "Active",
      isMock: true
    },
    {
      _id: "mock-team-2",
      name: "Maya Chen",
      role: "Full-Stack Engineer",
      bio: "Builds secure web applications, admin systems, and API integrations for client workflows.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600",
      expertise: ["React", "Node.js", "Cloud"],
      linkedin: "",
      sortOrder: 2,
      status: "Active",
      isMock: true
    },
    {
      _id: "mock-team-3",
      name: "Noah Patel",
      role: "Machine Learning Engineer",
      bio: "Turns documents, conversations, and operational data into useful AI features and assistants.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
      expertise: ["LLMs", "Data Pipelines", "Evaluation"],
      linkedin: "",
      sortOrder: 3,
      status: "Active",
      isMock: true
    }
  ],
  faqs: [
    {
      _id: "mock-faq-1",
      title: "How quickly can we launch an AI feature?",
      question: "How quickly can we launch an AI feature?",
      answer: "Most focused AI features can start with a discovery sprint and a prototype before moving into production planning.",
      category: "Delivery",
      sortOrder: 1,
      status: "Published",
      isMock: true
    },
    {
      _id: "mock-faq-2",
      title: "Can you work with our existing website or product?",
      question: "Can you work with our existing website or product?",
      answer: "Yes. We can add AI workflows, dashboards, automations, and integrations to an existing product instead of rebuilding from scratch.",
      category: "Services",
      sortOrder: 2,
      status: "Published",
      isMock: true
    },
    {
      _id: "mock-faq-3",
      title: "Do you provide project pricing on the website?",
      question: "Do you provide project pricing on the website?",
      answer: "We share starting ranges for services, then provide a project-specific quote after understanding scope, data needs, and timeline.",
      category: "Pricing",
      sortOrder: 3,
      status: "Published",
      isMock: true
    }
  ],
  careers: [
    {
      _id: "mock-career-1",
      title: "Full-Stack AI Engineer",
      department: "Engineering",
      location: "Remote / Hybrid",
      employmentType: "Full-time",
      experienceLevel: "Mid-Level",
      salaryRange: "Competitive",
      summary: "Build production-ready web applications and integrate practical AI features for client products.",
      responsibilities: [
        "Develop React and Node.js product features.",
        "Integrate AI APIs and workflow automation.",
        "Collaborate with product and design teams."
      ],
      requirements: [
        "Experience with React, Node.js, and REST APIs.",
        "Comfort working with databases and cloud deployment.",
        "Interest in practical AI product development."
      ],
      postedDate: "2026-06-01",
      closingDate: "2026-08-31",
      status: "Published",
      isMock: true
    },
    {
      _id: "mock-career-2",
      title: "UI/UX Designer",
      department: "Design",
      location: "Remote",
      employmentType: "Contract",
      experienceLevel: "Junior to Mid-Level",
      salaryRange: "Project based",
      summary: "Design clean, usable interfaces for dashboards, websites, and AI-enabled business tools.",
      responsibilities: [
        "Create wireframes and polished UI designs.",
        "Work with engineers to refine responsive layouts.",
        "Improve customer-facing product workflows."
      ],
      requirements: [
        "Portfolio with web or SaaS UI examples.",
        "Strong layout, typography, and interaction skills.",
        "Comfort designing in a fast product environment."
      ],
      postedDate: "2026-06-05",
      closingDate: "2026-08-31",
      status: "Published",
      isMock: true
    }
  ]
};
