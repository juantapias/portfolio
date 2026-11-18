-- ════════════════════════════════════════════════════════════════════
-- Admin · esquema inicial
-- Ejecutar en Supabase → SQL Editor (o con `supabase db push`).
--
-- Seguridad: los registros públicos están DESACTIVADOS en Auth, así que
-- "authenticated" = solo tú. La tabla `integrations` (tokens OAuth) no
-- tiene políticas: solo la lee el servidor con SUPABASE_SECRET_KEY.
-- ════════════════════════════════════════════════════════════════════

-- ─── CRM ────────────────────────────────────────────────────────────
create type lead_status as enum ('nuevo', 'contactado', 'propuesta', 'ganado', 'perdido');

create table leads (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  name             text not null,
  email            text,
  phone            text,
  company          text,
  message          text,

  status           lead_status not null default 'nuevo',
  estimated_value  numeric(12, 2),
  currency         text not null default 'COP' check (currency ~ '^[A-Z]{3}$'),
  next_follow_up   date,

  -- Atribución (se llena desde el formulario de la web)
  source           text,          -- 'web', 'instagram', 'tiktok', 'referido', 'manual'…
  utm_source       text,
  utm_medium       text,
  utm_campaign     text,
  landing_page     text
);

create index leads_status_idx on leads (status);
create index leads_created_at_idx on leads (created_at desc);

create table lead_activities (
  id          uuid primary key default gen_random_uuid(),
  lead_id     uuid not null references leads (id) on delete cascade,
  created_at  timestamptz not null default now(),
  type        text not null,     -- 'nota', 'llamada', 'email', 'reunion', 'cambio_estado'
  content     text
);

create index lead_activities_lead_idx on lead_activities (lead_id, created_at desc);

-- ─── Integraciones (tokens OAuth) ───────────────────────────────────
create table integrations (
  provider            text primary key check (provider in ('instagram', 'tiktok')),
  account_id          text not null,
  account_name        text,
  access_token        text not null,
  refresh_token       text,
  expires_at          timestamptz,
  refresh_expires_at  timestamptz,
  scopes              text[],
  connected_at        timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ─── Redes sociales (snapshots diarios del cron) ────────────────────
create table social_metrics_daily (
  provider       text not null check (provider in ('instagram', 'tiktok')),
  date           date not null,
  followers      integer,
  reach          integer,
  views          integer,
  profile_views  integer,
  interactions   integer,     -- likes + comentarios + compartidos + guardados
  raw            jsonb,       -- respuesta original, por si luego necesitas otra métrica
  primary key (provider, date)
);

create table social_posts (
  provider     text not null check (provider in ('instagram', 'tiktok')),
  external_id  text not null,
  posted_at    timestamptz,
  media_type   text,
  caption      text,
  permalink    text,
  thumbnail    text,
  views        integer,
  reach        integer,
  likes        integer,
  comments     integer,
  shares       integer,
  saves        integer,
  updated_at   timestamptz not null default now(),
  primary key (provider, external_id)
);

-- ─── updated_at automático ──────────────────────────────────────────
create function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger leads_updated_at before update on leads
  for each row execute function set_updated_at();
create trigger integrations_updated_at before update on integrations
  for each row execute function set_updated_at();

-- ─── RLS ────────────────────────────────────────────────────────────
alter table leads                enable row level security;
alter table lead_activities      enable row level security;
alter table integrations         enable row level security;
alter table social_metrics_daily enable row level security;
alter table social_posts         enable row level security;

create policy "admin full access" on leads
  for all to authenticated using (true) with check (true);
create policy "admin full access" on lead_activities
  for all to authenticated using (true) with check (true);
create policy "admin read" on social_metrics_daily
  for select to authenticated using (true);
create policy "admin read" on social_posts
  for select to authenticated using (true);
-- integrations: sin políticas a propósito (solo SUPABASE_SECRET_KEY).
