# Jay Bodiongan Portfolio

Personal portfolio for Jay Bodiongan, full stack developer. Built with React 19, TypeScript, Vite, and Tailwind CSS.

## Features

- Portfolio sections: Hero, About, Skills, Projects, Contact
- `/speedtype` - Keyboard Warrior typing game (Win98/CRT arcade style, stickman combat, live style ranking)
- `/dictation` - Daily Dictation practice page
- `/admin` and `/admin/runs` - Local dashboard for runs and overview
- `/login` - Admin login
- Responsive layout with Poppins headings and Inter body
- SPA routing with custom lightweight router and scroll restoration

## Tech Stack

| Area | Technology |
|------|------------|
| UI | React 19, React DOM, Tailwind CSS 3, lucide-react |
| Language | TypeScript |
| Build | Vite 8, vitejs/plugin-react |
| Lint | Oxlint |
| Routing | Custom hash/path router in `src/shared/lib/router` |
| Deploy | Vercel, Docker (Node builder + Nginx) |

## Installation

Prerequisites: Node.js 22+ and npm.

```bash
cd portfolio
npm ci
```

## Quick Start

```bash
npm run dev
```

Open the URL Vite prints (default `http://localhost:5173`).

Build and preview production output:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## Usage

### Scripts

| Script | What it does |
|--------|--------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) then build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

### Routes

| Path | Page |
|------|------|
| `/` | Portfolio (Navbar, Hero, About, Skills, Projects, Contact, Footer) |
| `/speedtype` | Keyboard Warrior typing game |
| `/dictation` | Daily Dictation |
| `/login` | Admin login |
| `/admin`, `/admin/runs` | Local dashboard |
| Any other path | NotFound page |

Document titles update per route (see `TITLES` in `src/app/App.tsx`).

## Project Structure

```
portfolio/
  index.html
  vite.config.ts          # React plugin + @ alias to ./src
  tailwind.config.js      # Primary palette #95271D, Poppins/Inter
  vercel.json             # Vite build, SPA rewrite to /index.html
  nginx.conf              # SPA fallback for Docker/Nginx
  Dockerfile              # Multi-stage Node build + Nginx serve
  docker-compose.dev.yml
  src/
    app/                  # main.tsx, App.tsx (route switch)
    pages/                # NotFound
    features/
      portfolio/          # Hero, About, Skills, Projects, Contact, Passage
      speedtype/          # SpeedType, Hud, Stickman, Burst
      dictation/          # Dictation
      admin/              # Admin, AdminShell, OverviewPanel, RunsPanel
      auth/               # Login
    shared/
      layout/             # Navbar, Footer
      ui/                 # AppLink, FadeIn
      lib/                # router
```

Path alias: `@` maps to `./src` (see `vite.config.ts` and `tsconfig`).

## Design Notes

Source of style direction is `DESIGN.md`:

- Site: warm light ground `#FAF9F6`, brick-red accent `#95271D`, Poppins headings, Inter body.
- Game: separate Windows 98 system (teal `#008080`, silver `#C0C0C0`, navy `#000080`, CRT `#08090B`). Red means player (`#e04d43` on dark), white means enemy.
- Content rules: no invented stats or testimonials, every control does something, numbers shown are computed from the player run.

## Deployment

### Vercel

`vercel.json` uses `npm run build` with output `dist` and rewrites all paths to `/index.html` for SPA routing.

### Docker

Production image builds the bundle with Node 22 then serves `dist/` with Nginx (see `Dockerfile` and `nginx.conf`):

```bash
docker build -t portfolio .
docker run -p 80:80 portfolio
```

`nginx.conf` falls back to `/index.html` so deep links like `/speedtype` work.

## Contributing

No contributing guide yet. For changes, keep docs current with code and follow the existing feature-folder layout (`features/<area>/`, `shared/<type>/`).

## License

No license file declared. All rights reserved by default until a license is added.
