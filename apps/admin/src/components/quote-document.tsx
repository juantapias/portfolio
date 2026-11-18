import { formatDate, formatMoney } from "@/lib/format";
import type { BusinessProfile, Quote, QuoteItem, QuoteTotals } from "@/lib/types";

interface Props {
  quote: Quote;
  items: QuoteItem[];
  totals: QuoteTotals | undefined;
  profile: BusinessProfile | null;
  client: { name: string; company: string | null; email: string | null; phone: string | null } | null;
}

/**
 * Documento del presupuesto. Siempre en "papel" claro (también en modo oscuro)
 * para que la vista previa coincida con el PDF impreso.
 */
export function QuoteDocument({ quote, items, totals, profile, client }: Props) {
  const issuer = profile?.trade_name || profile?.legal_name || "Tu nombre";

  return (
    <article className="quote-paper mx-auto max-w-3xl rounded-lg bg-white p-8 text-[13px] leading-relaxed text-neutral-800 shadow-sm ring-1 ring-black/5 sm:p-12 print:max-w-none print:rounded-none print:p-0 print:shadow-none print:ring-0">
      <header className="flex flex-wrap items-start justify-between gap-6 border-b border-neutral-200 pb-8">
        <div>
          <p className="text-xl font-semibold tracking-tight text-neutral-950">{issuer}</p>
          {profile ? (
            <div className="mt-2 space-y-0.5 text-neutral-500">
              {profile.trade_name && <p>{profile.legal_name}</p>}
              <p>{profile.document_type} {profile.document_number} · {profile.tax_regime}</p>
              {[profile.email, profile.phone].filter(Boolean).length > 0 && (
                <p>{[profile.email, profile.phone].filter(Boolean).join(" · ")}</p>
              )}
              {[profile.city, profile.website].filter(Boolean).length > 0 && (
                <p>{[profile.city, profile.website].filter(Boolean).join(" · ")}</p>
              )}
            </div>
          ) : (
            <p className="mt-2 text-amber-600 print:hidden">Completa tus datos en Ajustes → Perfil del emisor.</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">Presupuesto</p>
          <p className="text-lg font-semibold text-neutral-950">{quote.number}</p>
          <dl className="mt-2 space-y-0.5 text-neutral-500">
            <div><dt className="inline">Emitido: </dt><dd className="inline">{formatDate(quote.issue_date)}</dd></div>
            <div><dt className="inline">Válido hasta: </dt><dd className="inline">{formatDate(quote.valid_until)}</dd></div>
          </dl>
        </div>
      </header>

      <section className="grid gap-6 py-8 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-neutral-400">Para</p>
          {client ? (
            <div className="text-neutral-700">
              <p className="font-medium text-neutral-950">{client.company || client.name}</p>
              {client.company && <p>{client.name}</p>}
              {client.email && <p>{client.email}</p>}
              {client.phone && <p>{client.phone}</p>}
            </div>
          ) : (
            <p className="text-neutral-400">—</p>
          )}
        </div>
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-neutral-400">Proyecto</p>
          <p className="font-medium text-neutral-950">{quote.title}</p>
        </div>
      </section>

      {quote.intro && <p className="mb-8 whitespace-pre-line">{quote.intro}</p>}

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-300 text-left text-xs uppercase tracking-wider text-neutral-400">
            <th className="py-2 font-medium">Descripción</th>
            <th className="w-16 py-2 text-right font-medium">Cant.</th>
            <th className="w-32 py-2 text-right font-medium">Precio</th>
            <th className="w-32 py-2 text-right font-medium">Importe</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="break-inside-avoid border-b border-neutral-100 align-top">
              <td className="py-3 pr-4">
                <p className="font-medium text-neutral-950">{item.description}</p>
                {item.details && <p className="mt-0.5 whitespace-pre-line text-neutral-500">{item.details}</p>}
              </td>
              <td className="py-3 text-right tabular-nums">{Number(item.quantity).toLocaleString("es-CO")}</td>
              <td className="py-3 text-right tabular-nums">{formatMoney(item.unit_price, quote.currency)}</td>
              <td className="py-3 text-right tabular-nums">{formatMoney(item.quantity * item.unit_price, quote.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <dl className="ml-auto mt-6 w-full max-w-xs space-y-1.5">
        <Total label="Subtotal" value={formatMoney(totals?.subtotal, quote.currency)} />
        {Number(quote.discount) > 0 && <Total label="Descuento" value={`− ${formatMoney(quote.discount, quote.currency)}`} />}
        {Number(quote.tax_rate) > 0 && (
          <Total label={`IVA (${Number(quote.tax_rate)}%)`} value={formatMoney(totals?.tax, quote.currency)} />
        )}
        <div className="flex justify-between border-t border-neutral-300 pt-2 text-base font-semibold text-neutral-950">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatMoney(totals?.total, quote.currency)}</dd>
        </div>
        {Number(quote.tax_rate) === 0 && profile?.tax_regime && (
          <p className="text-right text-xs text-neutral-400">{profile.tax_regime}</p>
        )}
      </dl>

      {(quote.payment_terms || profile?.payment_methods || quote.notes) && (
        <footer className="mt-10 grid gap-6 border-t border-neutral-200 pt-8 sm:grid-cols-2">
          {(quote.payment_terms || profile?.payment_methods) && (
            <div className="break-inside-avoid">
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-neutral-400">Pago</p>
              {quote.payment_terms && <p className="whitespace-pre-line">{quote.payment_terms}</p>}
              {profile?.payment_methods && (
                <p className="mt-2 whitespace-pre-line text-neutral-500">{profile.payment_methods}</p>
              )}
            </div>
          )}
          {quote.notes && (
            <div className="break-inside-avoid">
              <p className="mb-1 text-xs font-medium uppercase tracking-widest text-neutral-400">Condiciones</p>
              <p className="whitespace-pre-line">{quote.notes}</p>
            </div>
          )}
        </footer>
      )}
    </article>
  );
}

function Total({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-neutral-600">
      <dt>{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  );
}
