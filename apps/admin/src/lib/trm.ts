import "server-only";

/**
 * TRM oficial (COP por 1 USD) publicada por la Superfinanciera en datos.gov.co.
 * Devuelve null si el servicio no responde.
 */
export async function getTRM(): Promise<{ value: number; date: string } | null> {
  try {
    const res = await fetch(
      "https://www.datos.gov.co/resource/32sa-8pi3.json?$limit=1&$order=vigenciadesde%20DESC",
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const [row] = (await res.json()) as { valor: string; vigenciadesde: string }[];
    if (!row) return null;
    return { value: Number(row.valor), date: row.vigenciadesde.slice(0, 10) };
  } catch {
    return null;
  }
}
