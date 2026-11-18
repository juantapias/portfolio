import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Halo naranja de fondo, como los degradados de la web */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
      />
      <div className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-2xl shadow-black/10">
        <span
          aria-hidden
          className="mb-6 inline-flex size-10 items-center justify-center rounded-full bg-foreground font-heading text-xl text-background"
        >
          T
        </span>
        <p className="eyebrow mb-3">Acceso privado</p>
        <h1 className="font-heading text-3xl">Tapias · Admin</h1>
        <p className="mt-2 mb-8 text-sm text-muted-foreground">Entra para ver leads, presupuestos y métricas.</p>
        <LoginForm />
      </div>
    </main>
  );
}
