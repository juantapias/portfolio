# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server at localhost:4321
npm run build     # Static build to ./dist/
npm run preview   # Preview the production build locally
```

There are no lint or test scripts. Type-check with:

```bash
npx astro check
```

## Architecture

This is a personal portfolio built with **Astro 6 + React 19 + Tailwind CSS v4**. It's a fully static site (SSG).

### i18n

- Default locale is **`es`**; both locales are path-prefixed (`/es/`, `/en/`).
- The root `/` has a plain HTML meta-refresh redirect to `/es`.
- All user-visible strings live in `src/i18n/es.json` and `src/i18n/en.json`.
- `src/utils/i18n.ts` exports `useTranslations(locale)` → returns a `t(key)` function using dot-notation keys (`"Nav.home"`, etc.).

### Projects data flow

Projects are defined as a single typed array in `src/data/projects.ts`. Each `Project` object contains locale-specific content nested under `translations.es` and `translations.en`.

`src/utils/project.ts` exports `resolveProjectView(project, locale)` which flattens a `Project` into a `ProjectView` — a locale-resolved, flat object that is passed directly to UI components. Always use `ProjectView` in React components; never access `project.translations` directly in the UI layer.

### Routing

- `src/pages/[locale]/index.astro` — home page; `getStaticPaths` generates `/es` and `/en`.
- `src/pages/[locale]/projects/[slug].astro` — project detail; `getStaticPaths` cross-products all locales × all project slugs.
- `src/pages/link-tree/index.astro` — standalone link-tree page (uses `layout-blank.astro`, no Header/Footer).
- `src/pages/404.astro` — custom 404.

### Component conventions

- **Astro components** (`.astro`) are used for layout, containers, and sections that don't need client-side interactivity.
- **React components** (`.tsx`) are used when client interactivity is needed; they are hydrated with `client:load`.
- Tailwind v4 is configured via the Vite plugin (`@tailwindcss/vite`) — there is no `tailwind.config.*` file.
- CSS Modules (`.module.css`) are used alongside Tailwind for component-scoped styles.
- Images are hosted on Cloudinary; `public/images/` holds only local static assets like the OG image.

### Layout

`src/layouts/layout.astro` wraps every page with `<Header>`, `<main><slot /></main>`, and `<Footer>`. It accepts SEO props (`title`, `description`, `ogImage`, `ogType`, `canonicalURL`, `noindex`). Use `layout-blank.astro` for pages that should not have the standard header/footer.
