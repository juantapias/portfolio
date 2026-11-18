# Admin

Panel privado: portfolio, CRM, presupuestos, GA4, conversión y redes sociales.
Stack: **Next.js 16 (App Router) + Supabase + Tailwind v4**.

## Puesta en marcha

1. **Crea el proyecto en Supabase** (<https://supabase.com/dashboard>).
2. **Ejecuta la migración**: *SQL Editor* → pega `supabase/migrations/0001_init.sql` → *Run*.
3. **Desactiva los registros**: *Authentication → Sign In / Providers* → apaga **Allow new users to sign up**.
4. **Crea tu usuario**: *Authentication → Users → Add user → Create new user* (correo + contraseña, marca *Auto Confirm*).
5. **Variables de entorno**:
   ```bash
   cp .env.example .env.local
   ```
   Llena `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` y `SUPABASE_SECRET_KEY` (*Project Settings → API Keys*).
6. **Arranca** desde la raíz del monorepo:
   ```bash
   npm run dev:admin   # http://localhost:3000
   ```

## Despliegue (Vercel)

Crea un **segundo proyecto** en Vercel apuntando al mismo repo:

- **Root Directory:** `apps/admin`
- **Framework:** Next.js
- **Dominio:** `admin.juantapias.dev`
- **Variables:** las mismas de `.env.local`

## Integraciones

Ver [docs/integraciones.md](docs/integraciones.md) para el paso a paso de GA4, Instagram y TikTok.

## Estructura

```
src/
├── app/
│   ├── (dashboard)/        # Rutas protegidas (layout con sidebar)
│   │   ├── page.tsx        # Resumen
│   │   ├── portfolio/
│   │   ├── crm/
│   │   ├── presupuestos/
│   │   ├── analitica/
│   │   ├── conversion/
│   │   ├── redes/
│   │   └── ajustes/
│   ├── login/
│   └── auth/signout/
├── components/
├── lib/
│   ├── modules.ts          # Definición de módulos (nav + alcance)
│   └── supabase/           # Clientes: browser, server, proxy
└── proxy.ts                # Refresca sesión y protege rutas
supabase/migrations/        # Esquema SQL
```
