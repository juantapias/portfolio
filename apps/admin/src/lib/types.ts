/** Tipos de las tablas de Supabase (ver supabase/migrations). */

export type LeadStatus = "nuevo" | "contactado" | "propuesta" | "ganado" | "perdido";
export type QuoteStatus = "borrador" | "enviado" | "aceptado" | "rechazado" | "vencido";

export interface Lead {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  status: LeadStatus;
  estimated_value: number | null;
  currency: string;
  next_follow_up: string | null;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  landing_page: string | null;
  /** Respuestas del formulario de la landing */
  form_data: Record<string, string> | null;
  /** Código corto que aparece en el mensaje de WhatsApp */
  ref: string | null;
  /** Cliente: proyecto entregado y cobro registrado a mano */
  delivered_at?: string | null;
  delivered_url?: string | null;
  paid_amount?: number | null;
  paid_currency?: string;
  paid_fx_rate_cop?: number;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  created_at: string;
  type: string;
  content: string | null;
}

export interface Quote {
  id: string;
  number: string;
  lead_id: string | null;
  title: string;
  status: QuoteStatus;
  currency: string;
  fx_rate_cop: number;
  issue_date: string;
  valid_until: string;
  discount: number;
  tax_rate: number;
  intro: string | null;
  payment_terms: string | null;
  notes: string | null;
  public_token: string;
  sent_at: string | null;
  accepted_at: string | null;
  first_viewed_at?: string | null;
  last_viewed_at?: string | null;
  view_count?: number;
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  id: string;
  quote_id: string;
  position: number;
  description: string;
  details: string | null;
  quantity: number;
  unit_price: number;
}

export interface QuoteTotals {
  quote_id: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: string;
  fx_rate_cop: number;
  total_cop: number;
}

export interface BusinessProfile {
  legal_name: string;
  trade_name: string | null;
  document_type: string;
  document_number: string;
  tax_regime: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  website: string | null;
  payment_methods: string | null;
  default_payment_terms: string | null;
}

export interface ServiceTemplate {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  service_template_prices: { currency: string; unit_price: number }[];
}
