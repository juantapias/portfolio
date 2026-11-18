import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/module-placeholder";

export const metadata: Metadata = { title: "Analítica web" };

export default function Page() {
  return <ModulePlaceholder moduleKey="analitica" />;
}
