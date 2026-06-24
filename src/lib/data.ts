export type Project = {
  id: string;
  title: string;
  company: string;
  year: string;
  tags: string[];
  description: string;
  thumbnail: string;
  featured?: boolean;
  slug: string;
};

export const siteConfig = {
  name: "Katherine Liu",
  role: "Product Designer",
  location: "San Francisco Bay Area",
  bio: "Product designer with B2B experience, coding knowledge, and an endless love for 🍚.",
  email: "katherinyuh@ucdavis.edu",
};

export const navLinks = [
  { label: "Work", href: "/", icon: "briefcase" },
  { label: "About", href: "/about", icon: "user" },
  { label: "Resume", href: "/resume.pdf", icon: "file-text", external: true },
];

export const socials = [
  { label: "LinkedIn", href: "https://linkedin.com/in/katherinyuh" },
  { label: "Clubly", href: "https://clubly.org" },
  { label: "Email", href: "mailto:katherinyuh@ucdavis.edu" },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "Route Optimization Platform",
    company: "Laminar Systems",
    year: "2024",
    tags: ["User Research", "Product Design", "Figma"],
    description:
      "End-to-end UX for a route-planning tool for small business owners — from driver logistics to delivery confirmation.",
    thumbnail: "/images/project-1.jpg",
    featured: true,
    slug: "route-optimization",
  },
  {
    id: "2",
    title: "Clubly",
    company: "AggieWorks",
    year: "2024",
    tags: ["Mobile", "Design Systems", "Prototyping"],
    description:
      "Redesigning club discovery and event management for 30,000+ UC Davis students — filterable search, shareable results, and a new design system.",
    thumbnail: "/images/project-2.jpg",
    slug: "clubly",
  },
  {
    id: "3",
    title: "IBM Internship",
    company: "IBM",
    year: "2025",
    tags: ["Enterprise UX", "B2B", "Design Systems"],
    description:
      "12-week product design internship focused on enterprise workflow tooling across IBM Cloud.",
    thumbnail: "/images/project-3.jpg",
    featured: true,
    slug: "ibm",
  },
  {
    id: "4",
    title: "Benevolent Bandwidth",
    company: "Nonprofit",
    year: "2023",
    tags: ["Branding", "Web Design", "Accessibility"],
    description:
      "Visual identity and website for a nonprofit connecting communities to digital resources.",
    thumbnail: "/images/project-4.jpg",
    slug: "benevolent-bandwidth",
  },
];
