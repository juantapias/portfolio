import type { Metadata } from "next";
import { ModulePlaceholder } from "@/components/module-placeholder";

export const metadata: Metadata = { title: "Redes sociales" };

export default function Page() {
  return <ModulePlaceholder moduleKey="redes" />;
}
