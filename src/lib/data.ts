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

/** One card in a CardRow: a bold title with a few short lines under it. */
export type CardRowItem = {
  title: string;
  points: string[];
  /** A small picture under the title (e.g. an emoji), shown at half its pixel size. */
  image?: { src: string; alt: string; width: number; height: number };
  /** Keep the card here but don't show it. */
  hidden?: boolean;
};

export type CaseStudyBlock =
  /** `content` paragraphs may use **double asterisks** for bold. A line that is bold from start to end with no full stop (e.g. "**Collaboration**") becomes a small sub-heading for the paragraph after it. */
  | { type: "text"; label?: string; heading?: string; content?: string | string[] }
  | { type: "image"; caption: string }
  | { type: "mediaRow"; items: MediaRowItem[] }
  | { type: "video"; src: string; alt: string; ratio: number }
  | { type: "imageFrame"; src: string; alt: string; width: number; height: number }
  | { type: "cards"; items: CardRowItem[] }
  /** A closing line at the end of a case study, in the same type as the case study title. */
  | { type: "closing"; text: string }
  | { type: "photoGallery"; items: PhotoGalleryItem[] }
  | {
      type: "mentalModels";
      video?: string;
      videoRatio?: number;
      /** The tools the design drew on (your collage), shown beside the video. */
      reference?: { src: string; alt: string; width: number; height: number };
    }
  | { type: "beforeAfter"; beforeImage?: string; afterImage?: string; beforeVideo?: string; afterVideo?: string; beforeLabel?: string; afterLabel?: string; caption?: string; beforeRatio?: number; afterRatio?: number; beforeNotes?: BeforeNote[]; beforeNotesPosition?: "right" | "below" };
export type Project = {
  id: string;
  title: string;
  company: string;
  year: string;
  category: "Product" | "Brand";
  tags: string[];
  description: string;
  thumbnail: string;
  /** Pictures shown in the scrolling strip on the list view, in order. Defaults to the thumbnail and hero. `ratio` is width / height. */
  gallery?: {
    src: string;
    alt?: string;
    /** Shape of the tile in the strip (width / height). */
    ratio: number;
    /** Fill the whole tile and crop the picture to it (for photos), instead of fitting it inside with padding (for mock-ups). */
    cover?: boolean;
    /** CSS object-position for the crop. */
    position?: string;
  }[];
  hero?: string;
  /** Looping clip shown in place of `hero` on the case study page. `box` is where the clip sits inside the hero frame, as % of the frame (the frame's own colour shows around it). */
  heroVideo?: { src: string; box: { x: number; y: number; w: number; h: number } };
  /** Short demo clip (in /public/videos) that plays when the project card is hovered. */
  video?: string;
  /** Company logo shown on the project cards instead of the name. `dark` is the dark-theme version; leave it out and the light one is shown as a white silhouette in dark mode. */
  logo?: { light: string; dark?: string };
  /** Width / height of the thumbnail, so cards can show it uncropped. Defaults to 4:3. */
  thumbnailRatio?: number;
  /** Width / height of the hero image on the case study page. Defaults to thumbnailRatio. */
  heroRatio?: number;
  /** Shown under the title on the case study page. Defaults to the site role. */
  role?: string;
  /** No case study yet: the canvas card shows "Coming soon" instead of the link, and the card does not open. */
  comingSoon?: boolean;
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
    gallery: [
      { src: "/images/clubly-card-v2.webp", ratio: 2000 / 1160 },
      { src: "/images/clubly-student-view.svg", ratio: 1440 / 836 },
      { src: "/images/team/spring-2026.jpg", ratio: 2000 / 1333 },
    ],
    hero: "/images/clubly.webp",
    heroVideo: { src: "/videos/clubly-hero.mp4", box: { x: (164 / 1708) * 100, y: (20 / 840) * 100, w: (1378 / 1708) * 100, h: (798 / 840) * 100 } },
    logo: { light: "/images/logos/clubly-light.svg", dark: "/images/logos/clubly-dark.svg" },
    video: "/videos/clubly-create-event.mp4",
    thumbnailRatio: 2000 / 1160,
    heroRatio: 1708 / 840,
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
            "Clubly makes events more discoverable and personalized by aligning with students’ interests, schedules, and social circles. Students find events that matter to them and bring friends along, while clubs see higher turnout and stronger fundraising. We launched the first version of our website in spring 2026, and since then, **200+ events** have been posted and we have **over 15k users**.",
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
        label: "Next steps",
      },
      {
        type: "cards",
        items: [
          { title: "Immediate", points: ["Implement feedback from usability testing on the student view side"] },
          { title: "Short-term", points: ["Begin user research for a student dashboard"] },
          { title: "Long-term", points: ["Begin user research for a student dashboard"], hidden: true },
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
      { type: "closing", text: "Thank you for checking this out!" },
    ],
  },
  {
    id: "1",
    title: "Industrial analytics dashboard redesign",
    company: "Laminar",
    year: "2025",
    category: "Product",
    tags: ["User Research", "Product Design", "Figma"],
    description:
      "Streamlining industrial analytics for Laminar's Insights platform to boost adoption and align with facility managers' workflows.",
    thumbnail: "/images/laminar-card-v3.png",
    gallery: [
      { src: "/images/laminar-card-v3.png", ratio: 2000 / 1160 },
      { src: "/images/laminar/summary-hover.svg", ratio: 1280 / 832 },
      { src: "/images/laminar/team.jpg", alt: "Laminar co-founders & interns", ratio: 2000 / 1160 },
    ],
    hero: "/images/laminar.webp",
    logo: { light: "/images/logos/laminar-light.svg", dark: "/images/logos/laminar-dark.svg" },
    thumbnailRatio: 2000 / 1160,
    heroRatio: 2000 / 983,
    featured: true,
    role: "Product Design Intern",
    slug: "route-optimization",
    caseStudy: [
      {
        type: "text",
        content: [
          "**As the team’s official designer, I led the effort by synthesizing user interviews and past customer feedback into a flexible navigation system that aligned with facility managers’ workflows and accommodated diverse user needs.** The project’s goal was to drive higher adoption and customer retention rates.",
          "During this memorable summer, I was a product design intern at Laminar, a clean-tech startup that uses patented inline sensors and AI to modernize fluid systems in manufacturing. My favorite (hence the case study dedication 🌟) of the four projects I worked on was redesigning the summary page of Insights, a platform where customers view industrial process analytics.",
        ],
      },
      {
        type: "text",
        label: "Problem",
        heading: "Users struggle with Insights’ layout and overwhelming data",
        content:
          "Analytics showed that less than 28% of users regularly used Laminar’s Insights dashboard. Despite the platform’s potential, customers weren’t using it consistently. The Summary page in particular was overwhelming: it displayed too much data at once, making it difficult to understand and identify key performance metrics quickly. This discouraged repeat use and limited adoption.",
      },
      {
        type: "text",
        label: "Outcome",
        content:
          "Success will be measured over time by increased adoption, specifically, how often customers return to the Summary page. Because Laminar has a 1-man developer team, shipping new features takes longer, but I kept momentum by documenting through Jira tickets. These have already been triaged and added to the product roadmap, serving as a foundation for the engineering team to build on and ensure that future iterations stay aligned with user needs, making it easier for the team to continue improving the platform.",
      },
      {
        type: "text",
        label: "Decisions",
        heading: "How might I design the Summary page so all users can quickly find key data, understand it, and act on it?",
        content:
          "I began by interviewing team members who had worked directly with clients to gather recurring feedback, and I reviewed past research to build context around known problems. To validate and deepen these insights, I interviewed with a customer about their current experience and pain points. From there, I began ideating features to improve the Summary page (after rebuilding the Summary page in Figma from scratch):",
      },
      {
        type: "text",
        heading: "Customizable metric prioritization",
        content:
          "Drag-and-drop rows to allow users to quickly customize the order of essential metrics, aligning with familiar spreadsheet mental models and offering a more flexible and personalized experience than alternatives like arrow controls or preset sorting.",
      },
      {
        type: "imageFrame",
        src: "/images/laminar/summary-hover.svg",
        alt: "The Summary page with a hovered column header and a drag handle for reordering metrics",
        width: 1280,
        height: 832,
      },
      {
        type: "text",
        heading: "Actionable issue alerts",
        content:
          "Added coloured warning icons to flag issues directly in applicable rows with an expandable dropdown that provides context and (in the future) root cause recommendations, shifting Insights from passive reporting to actionable guidance.",
      },
      {
        type: "beforeAfter",
        beforeImage: "/images/laminar/alerts-original.svg",
        afterVideo: "/videos/laminar-warning-dropdown.mp4",
        beforeRatio: 1280 / 832,
        afterRatio: 1920 / 1240,
        beforeLabel: "Original version",
        afterLabel: "Redesign version",
      },
      {
        type: "text",
        heading: "Making graph data understandable",
        content:
          "Currently, sensor data is displayed as a dense chart overlay, but the number of lines makes it overwhelming and difficult to interpret. To address this, I grouped traces by category and organized them into tabs, creating space for explanations of each trace and making the information more digestible",
      },
      {
        type: "beforeAfter",
        beforeImage: "/images/laminar/graph-original.avif",
        afterImage: "/images/laminar/graph-redesign.svg",
        beforeRatio: 1333 / 1476,
        afterRatio: 850 / 762,
        beforeLabel: "Original version",
        afterLabel: "Redesign version",
      },
      {
        type: "text",
        label: "Takeaways",
        heading: "Adapt research methods",
        content:
          "When I couldn’t connect directly with customers, I learned to pivot by being resourceful: interviewing team members, reviewing past feedback, and creating research questions that followed best practices for my two research groups.",
      },
      {
        type: "text",
        heading: "Work independently and proactively",
        content:
          "As the only design intern, I had to take initiative and communicate consistently. Regular check-ins, open documentation, and sharing my work transparently showed me how much impact clear communication can have.",
      },
      {
        type: "text",
        heading: "My internship wrapped:",
      },
      {
        type: "cards",
        items: [
          {
            title: "Longest time spent on Figma (my screen time was only on for the last few weeks)",
            points: ["5 h 22 m on September 3rd"],
          },
          { title: "Jokes told", points: ["1 (found on my About page!)"] },
          {
            title: "Most used emote",
            points: [],
            image: { src: "/images/laminar/emote-thumbs-up.png", alt: "A smiling yellow blob giving a thumbs up", width: 36, height: 36 },
          },
        ],
      },
      {
        type: "photoGallery",
        items: [
          {
            src: "/images/laminar/team.jpg",
            alt: "The Laminar co-founders and interns standing together beside the company door",
            caption: "Laminar co-founders & interns",
            ratio: 2000 / 1500,
            wide: true,
          },
        ],
      },
      { type: "closing", text: "Thank you for checking this out!" },
    ],
  },
  {
    id: "3",
    title: "Modern VS Code tooling for IBM Z mainframe development",
    company: "IBM",
    year: "2026",
    category: "Product",
    tags: ["Enterprise UX", "B2B", "Design Systems"],
    description:
      "Shipped an unused-variable detection feature for IBM Z Open Editor, a VS Code extension with 200K+ installs",
    thumbnail: "/images/ibm-card-v2.png",
    gallery: [
      { src: "/images/ibm-card-v2.png", ratio: 2000 / 1160 },
    ],
    hero: "/images/ibm.webp",
    logo: { light: "/images/logos/ibm-light.svg", dark: "/images/logos/ibm-dark.svg" },
    thumbnailRatio: 2000 / 1160,
    heroRatio: 2000 / 983,
    featured: true,
    comingSoon: true,
    slug: "ibm",
  },
  {
    id: "4",
    title: "Open-source delivery route optimization for small businesses",
    company: "Benevolent Bandwidth",
    year: "2026",
    category: "Brand",
    tags: ["Branding", "Web Design", "Accessibility"],
    description:
      "Building an open-source route-planning tool to help small businesses eliminate manual, hours-long delivery planning.",
    thumbnail: "/images/benevolent-bandwidth.webp",
    gallery: [{ src: "/images/benevolent-bandwidth.webp", ratio: 2000 / 1160 }],
    hero: "/images/benevolent-bandwidth.webp",
    logo: { light: "/images/logos/benevolent-bandwidth.png" },
    thumbnailRatio: 2000 / 1160,
    heroRatio: 2000 / 983,
    comingSoon: true,
    slug: "benevolent-bandwidth",
  },
];
