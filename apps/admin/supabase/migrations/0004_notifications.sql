-- ════════════════════════════════════════════════════════════════════
-- Notificaciones (campana del admin + envío a Telegram)
-- ════════════════════════════════════════════════════════════════════

create table notifications (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  type        text not null,          -- lead.nuevo, presupuesto.visto, seguimiento.hoy, presupuesto.vence, sistema.error…
  title       text not null,
  body        text,
  link        text,                   -- ruta del admin, p. ej. /crm/<id>
  data        jsonb,
  read_at     timestamptz,
  telegram    text                    -- 'enviado' | 'desactivado' | 'error: …' | null (sin configurar)
);

create index notifications_created_idx on notifications (created_at desc);
create index notifications_unread_idx on notifications (created_at desc) where read_at is null;

-- Qué tipos se envían a Telegram (los que no estén aquí: sí se envían)
create table notification_settings (
  type      text primary key,
  telegram  boolean not null default true
);

-- Seguimiento de aperturas del enlace público del presupuesto
alter table quotes
  add column first_viewed_at timestamptz,
  add column last_viewed_at  timestamptz,
  add column view_count      integer not null default 0;

alter table notifications         enable row level security;
alter table notification_settings enable row level security;

create policy "admin full access" on notifications
  for all to authenticated using (true) with check (true);
create policy "admin full access" on notification_settings
  for all to authenticated using (true) with check (true);
