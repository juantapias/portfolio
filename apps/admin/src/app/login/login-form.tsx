"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import { Button, Field, FormError, Input } from "@/components/ui/form";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="space-y-4">
      <Field label="Correo">
        <Input name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Contraseña">
        <Input name="password" type="password" autoComplete="current-password" required />
      </Field>
      <FormError message={state.error} />
      <Button disabled={pending} className="h-10 w-full">
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  );
}
