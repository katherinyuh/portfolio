/** One line of the pros / cons description shown with the Initial version: a thumbs-up or thumbs-down icon and its text. */
export type BeforeNote = { icon: "up" | "down"; text: string };

/** One item in a MediaRow. `ratio` is width / height, so items of different pixel sizes line up. */
export type MediaRowItem =
  | { kind: "video"; src: string; alt: string; ratio: number }
  | { kind: "image"; src: string; alt: string; ratio: number; width: number; height: number };

/** One photo in the photo gallery (hover to tilt it and show its caption). Leave `src` out until the image is added (a plain tile shows instead). */
export type PhotoGalleryItem = {
  src?: string;
  alt: string;
  /** Shown in place of the mouse pointer while hovering the photo. */
  caption: string;
  /** width / height of the photo. */
  ratio: number;
  /** CSS object-position, to choose which part of the photo stays visible when it is cropped. */
  position?: string;
  /** Span the full row instead of half of it. */
  wide?: boolean;
};

export type CaseStudyBlock =
  /** `content` paragraphs may use **double asterisks** for bold. A line that is bold from start to end with no full stop (e.g. "**Collaboration**") becomes a small sub-heading for the paragraph after it. */
  | { type: "text"; label?: string; heading?: string; content?: string | string[] }
  | { type: "image"; caption: string }
  | { type: "mediaRow"; items: MediaRowItem[] }
  | { type: "video"; src: string; alt: string; ratio: number }
  | { type: "photoGallery"; items: PhotoGalleryItem[] }
  | {
      type: "mentalModels";
      video?: string;
      videoRatio?: number;
      /** The tools the design drew on (your collage), shown beside the video. */
      reference?: { src: string; alt: string; width: number; height: number };
    }
  | { type: "beforeAfter"; beforeImage: string; afterImage: string; beforeLabel?: string; afterLabel?: string; caption?: string; beforeRatio?: number; afterRatio?: number; beforeNotes?: BeforeNote[]; beforeNotesPosition?: "right" | "below" };
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
  /** Company logo shown on the project cards instead of the name. `dark` is the dark-theme version; leave it out and the light one is shown as a white silhouette in dark mode. */
  logo?: { light: string; dark?: string };
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
          "**As the sole product designer, I designed the events page on Clubly to let students find events that match their interests and schedules, and to help clubs grow attendance and build stronger communities.**",
          "I led user interviews, prototyped in Figma, and ran usability tests to refine the design. Since January 2025, I've been working with 5 engineers, 2 product managers, and 1 product marketer on this project.",
        ],
      },
      {
        type: "text",
        label: "Problem",
        heading: "Existing ways to find and promote club events aren’t effective",
        content:
          "Despite UC Davis' abundance of clubs, students still struggle to find events, relying on word of mouth, flyers, or Instagram. This fragmented process wastes time, causes missed opportunities, and leaves many overwhelmed or missing out. Events can also feel less compelling when students don't have friends to attend with. Meanwhile, club admins invest significant effort and resources, but low turnout limits impact and motivation.",
      },
      {
        type: "text",
        label: "Solution & Outcomes",
        heading: "Club event creation and exploration on one platform",
        content:
            "Clubly makes events more discoverable and personalized by aligning with students’ interests, schedules, and social circles. Students find events that matter to them and bring friends along, while clubs see higher turnout and stronger fundraising. We launched the first version of our website, and following our marketing pushes, **200+ events have been posted** and we have **over 15k users**.",
          },
      {
        type: "video",
        src: "/videos/clubly-student-view.mp4",
        alt: "The Clubly student view: scrolling the events list, with filters for days, categories and extras",
        ratio: 1920 / 1112,
      },
      {
        type: "text",
        label: "Decisions",
        heading: "Converting findings and insights into features",
        content: "To better understand the current experience that students and club admins have with club events, we interviewed a total of **8 students** and **12 club admins** to identify pain points and refine gesture requirements. From our user interviews, I synthesized and ideated:",
      },
      {
        type: "text",
        heading: "Designing around familiar mental models",
        content:
          "The tools club admins already use (such as social media, Canva, and Google Workspace) informed how I structured interactions. By matching familiar patterns such as button order and layout, I aimed to reduce friction and make the new flow feel intuitive.",
      },
      {
        type: "mentalModels",
        video: "/videos/familiar-mental-models.mp4",
        videoRatio: 1280 / 744,
        reference: {
          src: "/images/familiar/reference-tools.svg",
          alt: "Canva, Discord, Instagram and Google Drive, with the patterns Clubly borrowed boxed in red",
          width: 644,
          height: 740,
        },
      },
      {
        type: "text",
        heading: "Supporting multi-day events",
        content:
          "Some events, like Design Interactive’s annual Davis Design Fest, spanned multiple days. To accommodate these, I designed an “add another day” option, letting admins customize times for each day.",
      },
      {
        type: "beforeAfter",
        beforeImage: "/images/Multi-day Initial.svg",
        afterImage: "/images/Multi-day Current.svg",
        beforeRatio: 1440 / 832,
        afterRatio: 1440 / 836,
        beforeLabel: "Initial version",
        afterLabel: "Current version",
      },
      {
        type: "text",
        heading: "Expanding awareness with filters",
        content:
          "Club admins struggled to attract members outside their immediate networks (e.g., it’s difficult to get non-tech students to attend events by tech clubs). Students also worried about missing out on interesting events they didn’t know about. To address both, I integrated filters by category, date, and “extras” (free food, merch, rides, raffles) to improve discovery and attendance.",
      },
      {
        type: "mediaRow",
        items: [
          { kind: "video", src: "/videos/filters-days.mp4", alt: "Filtering events by day: hovering a day highlights its row and checkbox", ratio: 536 / 652 },
          { kind: "video", src: "/videos/filters-categories.mp4", alt: "Filtering events by category: hovering a category highlights its row and checkbox", ratio: 536 / 652 },
          { kind: "image", src: "/images/filters-extras.png", alt: "Extras filter: free food, free merchandise, raffle and rides provided, each with a count and a checkbox", ratio: 536 / 652, width: 273, height: 330 },
        ],
      },
      {
        type: "text",
        heading: "Admin card layout",
      },
      {
        type: "beforeAfter",
        beforeImage: "/images/Admin Card_ Initial.svg",
        afterImage: "/images/Admin Card_ Current.svg",
        beforeRatio: 816 / 208,
        beforeLabel: "Initial version",
        afterLabel: "Current version",
        beforeNotesPosition: "below",
        beforeNotes: [
          { icon: "down", text: "UX Law of Proximity" },
          { icon: "down", text: "Users had trouble differentiating the buttons" },
        ],
      },
      {
        type: "text",
        heading: "Student card layout",
      },
      {
        type: "beforeAfter",
        beforeImage: "/images/Student Card_ Initial.svg",
        afterImage: "/images/Student Card_ Current.svg",
        beforeRatio: 296 / 344,
        beforeLabel: "Initial version",
        afterLabel: "Current version",
        beforeNotesPosition: "right",
        beforeNotes: [
          { icon: "up", text: "Date and time first" },
          { icon: "up", text: "Similar to current cards" },
          { icon: "down", text: "Cuts off graphic" },
        ],
      },
      {
        type: "text",
        label: "Takeaways",
        heading: "Techincal feasibility",
        content:
          "I initially focused only on UI implementation and overlooked broader technical requirements. In future projects, I’ll aim to holistically collaborate more closely with engineers from the beginning to align on technical scope and constraints (I realized that gradient borders were not fun to code and we weren't able to include the design 😢).",
      },
      {
        type: "text",
        heading: "Collaboration",
        content: [
          "Working with PMs, engineers, and graphic designers expanded my understanding of cross-functional teamwork. It was both insightful and rewarding to contribute to a shared vision while learning from my teammates’ expertise.",
        ],
      },
      {
        type: "photoGallery",
        items: [
          { src: "/images/team/pizookie.jpg", alt: "Three pizookies on a wooden table", caption: "Quarterly BJ's pizookie meal", ratio: 688 / 724 },
          { src: "/images/team/kbbq.jpg", alt: "Grilling meat at a Korean BBQ table surrounded by side dishes", caption: "Fall quarter 2025 team social — KBBQ", ratio: 688 / 724 },
          { src: "/images/team/spring-2026.jpg", alt: "The Clubly team standing together on a tree-lined campus road", caption: "Spring quarter 2026 Clubly photoshoot", ratio: 1408 / 755, wide: true, position: "50% 30%" },
        ],
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
    logo: { light: "/images/logos/benevolent-bandwidth.png" },
    thumbnailRatio: 2000 / 1160,
    heroRatio: 2000 / 983,
    slug: "benevolent-bandwidth",
  },
];
