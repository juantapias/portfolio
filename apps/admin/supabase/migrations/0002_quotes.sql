-- ════════════════════════════════════════════════════════════════════
-- Presupuestos (cotizaciones) vinculados al CRM
-- ════════════════════════════════════════════════════════════════════

create type quote_status as enum ('borrador', 'enviado', 'aceptado', 'rechazado', 'vencido');

create sequence quote_number_seq;

-- ─── Perfil del emisor (una sola fila) ──────────────────────────────
-- Se imprime en el PDF y en el enlace público del presupuesto.
create table business_profile (
  id               boolean primary key default true check (id),  -- fuerza una sola fila
  legal_name       text not null,                 -- nombre completo como persona natural
  trade_name       text,                          -- nombre comercial ("Tapias")
  document_type    text not null default 'CC',    -- CC, NIT, CE, pasaporte
  document_number  text not null,
  tax_regime       text not null default 'No responsable de IVA',
  email            text,
  phone            text,
  city             text default 'Colombia',
  website          text,
  -- Cómo pagar: cuentas en COP y en otras monedas (Wise, Payoneer, PayPal…)
  payment_methods  text,
  default_payment_terms text default '50% de anticipo para iniciar y 50% contra entrega.',
  updated_at       timestamptz not null default now()
);

create table quotes (
  id             uuid primary key default gen_random_uuid(),
  -- P-2026-001, P-2026-002… (el consecutivo es global, no se reinicia por año)
  number         text not null unique
                 default 'P-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('quote_number_seq')::text, 3, '0'),
  lead_id        uuid references leads (id) on delete set null,

  title          text not null,                 -- "Sitio web + ecommerce para 404 Studio"
  status         quote_status not null default 'borrador',
  -- ISO 4217 (COP, USD, EUR…). Los montos del presupuesto están en esta moneda.
  currency       text not null default 'COP' check (currency ~ '^[A-Z]{3}$'),
  -- Cuántos COP vale 1 unidad de `currency` (1 si es COP). Se fija al crear el
  -- presupuesto y se actualiza al aceptarlo, para reportar todo en COP.
  fx_rate_cop    numeric(14, 4) not null default 1 check (fx_rate_cop > 0),

  issue_date     date not null default current_date,
  valid_until    date not null default (current_date + 15),

  discount       numeric(12, 2) not null default 0,  -- monto fijo sobre el subtotal
  -- % de IVA. 0 mientras seas no responsable de IVA; la UI lo oculta si es 0.
  tax_rate       numeric(5, 2)  not null default 0,

  intro          text,     -- contexto / alcance
  payment_terms  text,     -- "50% anticipo, 50% contra entrega"
  notes          text,     -- condiciones, exclusiones, tiempos

  -- Enlace público para que el cliente vea y acepte el presupuesto
  public_token   uuid not null unique default gen_random_uuid(),

  sent_at        timestamptz,
  accepted_at    timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index quotes_lead_idx on quotes (lead_id);
create index quotes_status_idx on quotes (status);

create table quote_items (
  id           uuid primary key default gen_random_uuid(),
  quote_id     uuid not null references quotes (id) on delete cascade,
  position     integer not null default 0,
  description  text not null,
  details      text,
  quantity     numeric(10, 2) not null default 1 check (quantity > 0),
  unit_price   numeric(12, 2) not null default 0 check (unit_price >= 0)
);

create index quote_items_quote_idx on quote_items (quote_id, position);

-- Totales calculados (no se guardan, así nunca se desincronizan)
create view quote_totals with (security_invoker = true) as
with base as (
  select
    q.id, q.discount, q.tax_rate, q.currency, q.fx_rate_cop,
    coalesce(sum(i.quantity * i.unit_price), 0) as subtotal
  from quotes q
  left join quote_items i on i.quote_id = q.id
  group by q.id
)
select
  id                                                                  as quote_id,
  round(subtotal, 2)                                                  as subtotal,
  discount,
  round(greatest(subtotal - discount, 0) * tax_rate / 100, 2)         as tax,
  round(greatest(subtotal - discount, 0) * (1 + tax_rate / 100), 2)   as total,
  currency,
  fx_rate_cop,
  round(greatest(subtotal - discount, 0) * (1 + tax_rate / 100) * fx_rate_cop, 0) as total_cop
from base;

-- Catálogo de servicios frecuentes para armar presupuestos rápido
create table service_templates (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,          -- "Landing page", "Ecommerce", "Mantenimiento mensual"
  description  text,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- Precio de cada servicio por moneda (ej. Landing: 2.500.000 COP / 700 USD)
create table service_template_prices (
  template_id  uuid not null references service_templates (id) on delete cascade,
  currency     text not null check (currency ~ '^[A-Z]{3}$'),
  unit_price   numeric(12, 2) not null check (unit_price >= 0),
  primary key (template_id, currency)
);

create trigger quotes_updated_at before update on quotes
  for each row execute function set_updated_at();
create trigger business_profile_updated_at before update on business_profile
  for each row execute function set_updated_at();

-- Sincroniza el pipeline del CRM con el estado del presupuesto
create function sync_lead_status_from_quote() returns trigger language plpgsql as $$
begin
  if new.lead_id is null or new.status is not distinct from old.status then
    return new;
  end if;

  if new.status = 'enviado' then
    new.sent_at := coalesce(new.sent_at, now());
    update leads set status = 'propuesta'
      where id = new.lead_id and status in ('nuevo', 'contactado');
  elsif new.status = 'aceptado' then
    new.accepted_at := coalesce(new.accepted_at, now());
    update leads set status = 'ganado' where id = new.lead_id;
  end if;

  insert into lead_activities (lead_id, type, content)
  values (new.lead_id, 'cambio_estado', 'Presupuesto ' || new.number || ': ' || new.status);

  return new;
end $$;

create trigger quotes_sync_lead before update of status on quotes
  for each row execute function sync_lead_status_from_quote();

-- ─── RLS ────────────────────────────────────────────────────────────
alter table quotes            enable row level security;
alter table quote_items       enable row level security;
alter table service_templates enable row level security;
alter table service_template_prices enable row level security;
alter table business_profile  enable row level security;

create policy "admin full access" on quotes
  for all to authenticated using (true) with check (true);
create policy "admin full access" on quote_items
  for all to authenticated using (true) with check (true);
create policy "admin full access" on service_templates
  for all to authenticated using (true) with check (true);
create policy "admin full access" on service_template_prices
  for all to authenticated using (true) with check (true);
create policy "admin full access" on business_profile
  for all to authenticated using (true) with check (true);

-- La vista pública del presupuesto (/p/<public_token>) se servirá desde el
-- servidor con la clave secreta, buscando por token. No se abre RLS a "anon".
