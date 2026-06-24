# Katherine Liu — Portfolio

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev
# → http://localhost:3000
```

## First things to do

1. **Update your info** in `src/lib/data.ts`
   - `siteConfig` → name, bio, email
   - `socials` → your real links
   - `projects` → add real project data

2. **Add project images** to `public/images/`
   - Name them `project-1.jpg`, `project-2.jpg`, etc. (or update paths in data.ts)
   - Recommended size: 800×600px minimum

3. **Add your resume** as `public/resume.pdf`

4. **Fill in case studies** in `src/app/work/[slug]/page.tsx`
   - Replace the placeholder sections with real content
   - Or eventually migrate to MDX for richer content

## Stack

| Tool | Purpose |
|------|---------|
| Next.js 14 | Framework |
| TypeScript | Type safety (helps Cursor AI a lot) |
| Tailwind CSS | Utility-first styling |
| Framer Motion | All animations + micro-interactions |
| Lenis | Smooth scroll |
| Geist | Font (by Vercel, clean + modern) |

## Cursor tips

The `.cursorrules` file is already set up with design tokens and conventions.
When prompting Cursor, try:

- *"Add a hover tooltip to the nav links showing a preview of the page"*
- *"Add a cursor follower effect that subtly tracks mouse position"*
- *"Animate the project card images with a parallax scroll effect"*
- *"Add a [page transition] between routes using Framer Motion"*

## Deploy

```bash
# Vercel (recommended — it's free)
npx vercel
```
