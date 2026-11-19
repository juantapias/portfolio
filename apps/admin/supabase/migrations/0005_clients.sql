-- ════════════════════════════════════════════════════════════════════
-- Clientes: proyectos entregados y cobros registrados a mano
-- ════════════════════════════════════════════════════════════════════
-- Un "cliente" es un lead en estado 'ganado'. Para clientes anteriores al admin
-- (o cobrados sin presupuesto en el admin) se guarda aquí lo entregado y cobrado.
-- created_at ya existía: ahora se edita desde el formulario como "primer contacto",
-- para que un cliente antiguo no cuente como lead nuevo en las métricas.

alter table leads
  add column delivered_at      date,
  add column delivered_url     text,
  -- Monto cobrado fuera de los presupuestos del admin (si el cliente tiene un
  -- presupuesto aceptado, ese es el que cuenta y este se ignora en las métricas)
  add column paid_amount       numeric(12, 2) check (paid_amount is null or paid_amount >= 0),
  add column paid_currency     text not null default 'COP' check (paid_currency ~ '^[A-Z]{3}$'),
  add column paid_fx_rate_cop  numeric(14, 4) not null default 1 check (paid_fx_rate_cop > 0);

create index leads_delivered_idx on leads (delivered_at desc) where status = 'ganado';
