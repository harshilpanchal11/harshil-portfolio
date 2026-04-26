# Harshil Panchal — Personal Portfolio

A two-column editorial portfolio built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. All content is **data-driven** through JSON files in `src/data/` — no editing of UI components is needed to update copy.

The layout: a persistent **Profile Card** in the left rail (sticky on `lg+`), with the scrolling main column on the right carrying a live **Vanta NET** background and the page sections.

---

## Tech stack

- **Next.js 14** (App Router, RSC, static generation for project pages)
- **TypeScript** in strict mode
- **Tailwind CSS** with a custom design token set (light/dark theme)
- **Google Fonts** via `next/font` (Fraunces serif, Inter sans, JetBrains Mono)
- **Lenis** — smooth, slightly inertial scroll site-wide
- **Vanta NET** (Three.js, lazy-loaded from CDN) — interactive network background in the hero column
- **Three.js** — slowly rotating 3D network mesh on the Contact section
- **Lucide** — line icons

---

## Drop-in assets you'll want to provide

These have placeholders that work out of the box; replace them when ready:

- `public/photo.jpg` — your headshot (the rounded image in the Profile Card). The `photo` field in `profile.json` currently points to `/photo.svg` which is a stylized silhouette placeholder.
- `public/logos/select.png` and `public/logos/3ewebapps.png` — the two company logos for the Experience timeline. Placeholder SVGs are already in place.
- `public/projects/<slug>.jpg` — per-project images for the Projects grid. Set the `image` field in `projects.json` to `/projects/<slug>.jpg` once you drop one in. Empty `image` falls back to a domain-tinted gradient placeholder.

---

## Local setup

Requires **Node.js 18.17+** (Node 20 recommended).

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open the site
# → http://localhost:3000
```

Other scripts:

```bash
npm run build   # production build
npm start       # serve the production build locally
npm run lint    # next lint
```

---

## How to update content (no code editing required)

Every piece of visible copy lives in **`src/data/*.json`**. Edit the JSON, save, and the site updates. Below is what to change for each common task.

### Update your tagline, name, contact info, or roles you're targeting
Edit **`src/data/profile.json`**.

```json
{
  "name": "Harshil Panchal",
  "headline": "I build analytics products that move business metrics — ...",
  "rolesTargeted": ["Business Analyst", "Data Analyst", "Analytics Consultant"],
  "scheduleUrl": "https://calendly.com/your-handle",
  "availabilityShort": "Open to new work",
  "timezone": "America/Indiana/Indianapolis"
}
```

- `scheduleUrl` powers the "Schedule a call" button in the Contact section. Replace with your actual Calendly / Cal.com / SavvyCal link.
- `availabilityShort` is the text in the green status pill at the top of the hero. Set to `"Currently interviewing"` or `"Available May 2026"` etc.
- `timezone` is an [IANA zone name](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) — used to render the live local time in the status pill.

### Update the About section
Edit **`src/data/about.json`** — both the long-form paragraphs and the right-rail "quick facts."

### Add a new project
Append an object to **`src/data/projects.json`**. Use this template:

```json
{
  "slug": "my-new-project",
  "title": "Project Title",
  "subtitle": "One-line hook",
  "year": "2026",
  "domain": "Retail Analytics",
  "featured": true,
  "headlineMetric": {
    "value": "+$200K",
    "label": "annual margin recovered"
  },
  "summary": "What this project did, in one sentence (shows on home page card).",
  "problem": "What was the business / analytical problem?",
  "approach": [
    "Step 1 of how you solved it",
    "Step 2",
    "Step 3"
  ],
  "tools": ["Python", "SQL", "Tableau"],
  "insights": [
    "Specific, quantified finding #1",
    "Finding #2"
  ],
  "impact": "The business outcome — quantified where possible.",
  "links": {
    "github": "https://github.com/harshilpanchal11/my-new-project",
    "demo": "https://...",
    "paper": "https://..."
  }
}
```

- `slug` must be **unique and URL-safe** (lowercase, hyphens). It becomes the route: `/projects/my-new-project`.
- `featured: true` puts the project in the 2-column card grid on the home page. `featured: false` puts it in the compact "More work" list below.
- `links.demo` and `links.paper` are optional — omit the keys if you don't have them.

### Add or edit a job
Edit **`src/data/experience.json`**. Order in the file = order shown on the page (newest first by convention).

```json
{
  "company": "Company name",
  "role": "Your role",
  "location": "City, State",
  "start": "Jan 2026",
  "end": "Present",
  "current": true,
  "bullets": [
    "Outcome-focused bullet",
    "Another outcome-focused bullet"
  ]
}
```

### Add or edit skills
Edit **`src/data/skills.json`**. Each entry is a category with an array of items rendered as pills.

### Add or edit education / certifications
- **`src/data/education.json`** for degrees
- **`src/data/certifications.json`** for certs and publications

### Add your résumé file
Drop your résumé as **`public/resume.pdf`**. The "Résumé" links across the site (navbar, hero, contact) will then download/open it.

### Change colors, fonts, or spacing
Open **`tailwind.config.ts`** and edit the `theme.extend.colors` and `theme.extend.fontFamily` blocks. The same tokens are used everywhere — change once, applies everywhere.

To swap fonts entirely, edit the `next/font` imports at the top of **`src/app/layout.tsx`** (e.g., replace `Fraunces` with `Playfair_Display`).

---

## File map

```
harshil-portfolio/
├── public/                    # static assets (resume.pdf, favicon, og-image)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # site shell (nav, footer, fonts, theme init)
│   │   ├── page.tsx           # home page (single-page scroll)
│   │   ├── globals.css        # Tailwind base + reveal animation
│   │   ├── not-found.tsx      # 404
│   │   └── projects/
│   │       └── [slug]/
│   │           └── page.tsx   # dynamic project case-study page
│   ├── components/            # reusable UI (Hero, About, Projects, etc.)
│   ├── data/                  # ← ALL CONTENT LIVES HERE
│   │   ├── profile.json
│   │   ├── about.json
│   │   ├── projects.json
│   │   ├── experience.json
│   │   ├── skills.json
│   │   ├── education.json
│   │   └── certifications.json
│   └── lib/
│       ├── data.ts            # typed loader for the JSON files
│       └── types.ts           # TypeScript interfaces
├── tailwind.config.ts         # design tokens (colors, fonts, spacing)
├── next.config.mjs
├── tsconfig.json
└── package.json
```

---

## Deploy to Vercel (recommended)

1. **Push to GitHub.**
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/harshilpanchal11/portfolio.git
   git push -u origin main
   ```

2. **Import to Vercel.**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import the GitHub repo
   - Framework preset: **Next.js** (auto-detected)
   - Click **Deploy**. No env vars needed.

3. **Custom domain** (optional).
   - Vercel → your project → Settings → Domains → Add `harshilpanchal.com` (or whatever you buy)
   - Update DNS at your registrar with the records Vercel shows.

After the first deploy, every push to `main` auto-deploys. Pull requests get preview URLs.

### Deploy alternatives
- **Netlify**: import the repo, build command `npm run build`, publish directory `.next`. Use the official Netlify Next.js plugin.
- **Cloudflare Pages**: same flow, with their Next.js adapter.
- **Static export**: add `output: 'export'` to `next.config.mjs`, then `npm run build` produces a `/out` folder you can host anywhere (GitHub Pages, S3, etc.). Note: dynamic features that require a Node server won't work in static export.

---

## Design decisions (so future-you knows the "why")

- **Light cream by default, deep navy on dark toggle.** Cream reads as confident/editorial; navy adds analytical seriousness and covers recruiter preference. Dark mode bg is `#0A1426` with a subtle blue radial highlight at the top.
- **Serif headings + sans body + mono accents.** Fraunces for warmth and personality, Inter for legibility, JetBrains Mono only for tags/labels — it earns attention precisely because it's used sparingly.
- **Live status pill in the hero.** Borrowed from royayush.com — a real-time green-dot "Open to work · location · local time" signal. Live time updates every 30s without needing a heavy date library.
- **Sticky right-rail Index nav (xl screens only).** Borrowed from royayush.com but kept off mobile/tablet so it doesn't crowd the centered editorial column. Active section is highlighted as the user scrolls.
- **Headline metric on every project card.** One quantified result rendered large in the accent color (e.g. `+$557K`, `0.9056`). Recruiters scanning in 5 seconds see the impact before they read the description.
- **By-the-numbers stats row in About.** Four big-number / small-label stats (years, biggest impact, biggest dataset, project count) for instant credibility.
- **Project pages, not modals.** Each project gets a real URL — you can paste `harshilpanchal.com/projects/airbnb-host-retention` directly in a job application.
- **Reveal-on-scroll, not scroll-jacking.** A single IntersectionObserver fades sections in. Respects `prefers-reduced-motion`.
- **Zero JS animation libraries.** Saves ~30KB+ on initial load. CSS handles all the motion.

---

## What to tweak first

1. Drop your `resume.pdf` into `public/`.
2. Add a 1200×630 OG image at `public/og-image.png` and reference it in `layout.tsx` metadata.
3. (Optional) Replace the favicon at `public/favicon.ico`.
4. Skim `profile.json` and `about.json` and tighten any wording you'd say differently.
5. As you finish new projects, append them to `projects.json`.
