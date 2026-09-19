export type CaseStudyBlock =
  | { type: "text"; label?: string; content: string | string[] }
  | { type: "image"; caption: string };

export type Project = {
  id: string;
  title: string;
  company: string;
  year: string;
  category: "Product" | "Brand";
  tags: string[];
  description: string;
  thumbnail: string;
  hero?: string;
  /** Short demo clip (in /public/videos) that plays when the project card is hovered. */
  video?: string;
  /** Company logo shown on the project cards instead of the name; one per theme. */
  logo?: { light: string; dark: string };
  /** Width / height of the thumbnail, so cards can show it uncropped. Defaults to 4:3. */
  thumbnailRatio?: number;
  /** Width / height of the hero image on the case study page. Defaults to thumbnailRatio. */
  heroRatio?: number;
  featured?: boolean;
  slug: string;
  caseStudy?: CaseStudyBlock[];
  liveUrl?: string;
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
    id: "2",
    title: "University event discovery and management platform",
    company: "Clubly",
    year: "2025",
    category: "Product",
    tags: ["Mobile", "Design Systems", "Prototyping"],
    description:
      "Launching Clubly's events feature to help 35,000+ UC Davis students find events that fit their interests while enabling clubs to grow attendance.",
    thumbnail: "/images/clubly-card-v2.webp",
    hero: "/images/clubly.webp",
    logo: { light: "/images/logos/clubly-light.svg", dark: "/images/logos/clubly-dark.svg" },
    video: "/videos/clubly-create-event.mp4",
    thumbnailRatio: 2000 / 1160,
    heroRatio: 2000 / 983,
    slug: "clubly",
    liveUrl: "https://clubly.org/events",
    caseStudy: [
      {
        type: "text",
        label: "What's Clubly?",
        content: [
          "Clubly, released by Aggieworks in February 2024, is a platform that connects 35,000+ UC Davis students with 209 clubs while giving admins tools to manage profiles and cultivate year-round engagement.",
          "As the sole product designer, I designed the events page on Clubly to let students find events that match their interests and schedules, and to help clubs grow attendance and build stronger communities.",
          "I led user interviews, prototyped in Figma, and ran usability tests to refine the design. Since January 2025, I've been working with 5 engineers, 2 product managers, and 1 product marketer on this project.",
        ],
      },
      {
        type: "text",
        label: "Problem",
        content:
          "Existing ways to find and promote club events aren't effective. Despite UC Davis' abundance of clubs, students still struggle to find events, relying on word of mouth, flyers, or Instagram. This fragmented process wastes time, causes missed opportunities, and leaves many overwhelmed or missing out. Events can also feel less compelling when students don't have friends to attend with. Meanwhile, club admins invest significant effort and resources, but low turnout limits impact and motivation.",
      },
      {
        type: "text",
        label: "Solution & Outcomes",
        content:
          "Clubly consolidates event creation and discovery into a single platform, personalizing what students see based on their interests, schedule, and social circle. Within the first week of launch, 20+ events were posted, and the platform acquired 600+ users following a marketing push.",
      },
      {
        type: "text",
        label: "Decisions",
        content: "Design choices were grounded in research and iterated closely with engineering throughout the build.",
      },
      {
        type: "text",
        label: "Research insights",
        content:
          "Interviewed 8 students and 12 club admins to ground the design in how event discovery and promotion actually happened day to day.",
      },
      {
        type: "text",
        label: "Familiar mental models",
        content:
          "Aligned new flows with tools admins already trusted — social platforms, Canva, Google Workspace — so the learning curve stayed low.",
      },
      {
        type: "text",
        label: "Multi-day events",
        content:
          "Reworked the event creation form to support multi-day events with customizable time slots per day, iterating from an early version into a clearer final layout.",
      },
      {
        type: "image",
        caption: "Event creation form — initial vs. final, supporting multi-day events",
      },
      {
        type: "text",
        label: "Filters",
        content:
          "Added category, date, and \"extras\" filters (free food, merch, rides, raffles) so students could narrow events down to what actually mattered to them.",
      },
      {
        type: "image",
        caption: "Filtered events view",
      },
      {
        type: "text",
        label: "Admin card layout",
        content:
          "The first version of the admin event card grouped information in a way that broke the law of proximity; the final layout regrouped related fields so admins could scan cards faster.",
      },
      {
        type: "image",
        caption: "Admin event card — initial vs. final layout",
      },
      {
        type: "text",
        label: "Student card layout",
        content:
          "Iterated on the student-facing card after the first version let graphics get cut off — the final version fixed cropping and tightened the visual hierarchy.",
      },
      {
        type: "image",
        caption: "Student event card — layout iterations",
      },
      {
        type: "text",
        label: "Next steps",
        content:
          "Immediate: run usability testing on the current release. Short-term: ship RSVP functionality. Long-term: research a dedicated student dashboard.",
      },
      {
        type: "text",
        label: "Takeaways",
        content:
          "Pulling engineers into design decisions earlier — not just at handoff — would have caught feasibility issues sooner, like the gradient border implementation that turned out harder to build than scoped. More broadly, this project reinforced how much good cross-functional collaboration shapes the final product.",
      },
    ],
  },
  {
    id: "1",
    title: "Industrial analytics dashboard redesign",
    company: "Laminar Systems",
    year: "2025",
    category: "Product",
    tags: ["User Research", "Product Design", "Figma"],
    description:
      "Streamlining industrial analytics for Laminar Systems' Insights platform to boost adoption and align with facility managers' workflows.",
    thumbnail: "/images/laminar-card-v3.png",
    hero: "/images/laminar.webp",
    logo: { light: "/images/logos/laminar-light.svg", dark: "/images/logos/laminar-dark.svg" },
    thumbnailRatio: 2000 / 1160,
    heroRatio: 2000 / 983,
    featured: true,
    slug: "route-optimization",
  },
  {
    id: "3",
    title: "Modern VS Code tooling for IBM Z mainframe development",
    company: "IBM",
    year: "2026",
    category: "Product",
    tags: ["Enterprise UX", "B2B", "Design Systems"],
    description:
      "12-week product design internship focused on developer tools across IBM Cloud.",
    thumbnail: "/images/ibm-card-v2.png",
    hero: "/images/ibm.webp",
    logo: { light: "/images/logos/ibm-light.svg", dark: "/images/logos/ibm-dark.svg" },
    thumbnailRatio: 2000 / 1160,
    heroRatio: 2000 / 983,
    featured: true,
    slug: "ibm",
  },
  {
    id: "4",
    title: "Delivery Optimizer",
    company: "Benevolent Bandwidth",
    year: "2026",
    category: "Brand",
    tags: ["Branding", "Web Design", "Accessibility"],
    description:
      "Visual identity and website for a nonprofit connecting communities to digital resources.",
    thumbnail: "/images/benevolent-bandwidth.webp",
    hero: "/images/benevolent-bandwidth.webp",
    thumbnailRatio: 2000 / 1160,
    heroRatio: 2000 / 983,
    slug: "benevolent-bandwidth",
  },
];
