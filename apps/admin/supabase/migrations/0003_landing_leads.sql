-- ════════════════════════════════════════════════════════════════════
-- Leads desde el formulario de la landing (/es/web/)
-- ════════════════════════════════════════════════════════════════════

alter table leads
  -- Respuestas del formulario: service, stage, budget, timeline, locale, gclid, fbclid…
  add column form_data jsonb,
  -- Código corto que va en el mensaje de WhatsApp para enlazar chat ↔ lead
  add column ref text unique,
  -- SHA-256 de la IP (con sal). Solo para limitar envíos repetidos; nunca la IP en claro.
  add column ip_hash text;

create index leads_ip_hash_idx on leads (ip_hash, created_at desc) where ip_hash is not null;
