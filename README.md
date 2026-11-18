# Portfolio · monorepo

| App | Ruta | Stack | Deploy |
|---|---|---|---|
| Portfolio público | `apps/web` | Astro 6 (SSG) | Vercel · Root Directory `apps/web` |
| Admin privado | `apps/admin` | Next.js 16 + Supabase | Vercel · Root Directory `apps/admin` |
| Tipos compartidos | `packages/types` | TypeScript | — |

```bash
npm install          # instala todos los workspaces
npm run dev:web      # http://localhost:4321
npm run dev:admin    # http://localhost:3000
npm run build:web
npm run build:admin
```
