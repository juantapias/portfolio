import { getModule, type ModuleKey } from "@/lib/modules";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";

/** Página provisional de un módulo: muestra qué hará y de dónde saca los datos. */
export function ModulePlaceholder({ moduleKey }: { moduleKey: ModuleKey }) {
  const m = getModule(moduleKey);

  return (
    <>
      <PageHeader title={m.label} description={m.description} />
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Qué incluirá" className="md:col-span-2">
          <ul className="space-y-2 text-sm">
            {m.planned.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden className="text-muted">—</span>
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Fuente de datos">
          <p className="text-sm">{m.source}</p>
          <p className="mt-4 inline-block rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
            En construcción
          </p>
        </Card>
      </div>
    </>
  );
}
