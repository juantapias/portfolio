"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NOTIFICATION_TYPES, isTelegramConfigured, sendTelegram, type NotificationType } from "@/lib/notifications";

export async function openNotification(fd: FormData) {
  const id = String(fd.get("id"));
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", id)
    .is("read_at", null)
    .select("link")
    .maybeSingle();
  const link = (data?.link as string | undefined) ?? String(fd.get("link") ?? "");
  revalidatePath("/", "layout");
  redirect(link.startsWith("/") ? link : "/notificaciones");
}

export async function markAllRead() {
  const supabase = await createClient();
  await supabase.from("notifications").update({ read_at: new Date().toISOString() }).is("read_at", null);
  revalidatePath("/", "layout");
}

export type ActionState = { ok?: boolean; error?: string };

export async function sendTestTelegram(): Promise<ActionState> {
  if (!isTelegramConfigured()) return { error: "Faltan TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID." };
  try {
    await sendTelegram({
      type: "lead.nuevo",
      title: "Prueba de notificaciones",
      body: "Si ves este mensaje, los avisos del admin llegan a Telegram. ✅",
      link: "/notificaciones",
    });
    return { ok: true };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function setTelegramForType(fd: FormData) {
  const type = String(fd.get("type")) as NotificationType;
  if (!(type in NOTIFICATION_TYPES)) return;
  const supabase = await createClient();
  await supabase.from("notification_settings").upsert({ type, telegram: fd.get("telegram") === "on" });
  revalidatePath("/ajustes");
}
