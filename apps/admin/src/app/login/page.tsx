import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6">
        <h1 className="text-lg font-semibold">Tapias · Admin</h1>
        <p className="mb-6 mt-1 text-sm text-muted">Acceso privado</p>
        <LoginForm />
      </div>
    </main>
  );
}
