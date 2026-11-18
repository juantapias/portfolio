import "server-only";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * TikTok (Login Kit + Display API, app en modo Sandbox).
 * OAuth: access token de 24 h + refresh token de 365 días, guardados en la tabla
 * `integrations` (solo accesible con SUPABASE_SECRET_KEY). Se renuevan solos.
 */

export const TIKTOK_SCOPES = ["user.info.basic", "user.info.profile", "user.info.stats", "video.list"];
const API = "https://open.tiktokapis.com/v2";

export function isTikTokConfigured() {
  return Boolean(process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET && process.env.TIKTOK_REDIRECT_URI);
}

export function getAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_key: process.env.TIKTOK_CLIENT_KEY!,
    scope: TIKTOK_SCOPES.join(","),
    response_type: "code",
    redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
    state,
  });
  return `https://www.tiktok.com/v2/auth/authorize/?${params}`;
}

interface TokenResponse {
  access_token: string;
  expires_in: number;
  open_id: string;
  refresh_token: string;
  refresh_expires_in: number;
  scope: string;
  error?: string;
  error_description?: string;
}

async function tokenRequest(body: Record<string, string>): Promise<TokenResponse> {
  const res = await fetch(`${API}/oauth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Cache-Control": "no-cache" },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY!,
      client_secret: process.env.TIKTOK_CLIENT_SECRET!,
      ...body,
    }),
    cache: "no-store",
  });
  const json = (await res.json()) as TokenResponse;
  if (!res.ok || json.error) throw new Error(json.error_description || json.error || `TikTok OAuth ${res.status}`);
  return json;
}

async function saveTokens(t: TokenResponse, accountName?: string) {
  const now = Date.now();
  const { error } = await createAdminClient()
    .from("integrations")
    .upsert({
      provider: "tiktok",
      account_id: t.open_id,
      ...(accountName && { account_name: accountName }),
      access_token: t.access_token,
      refresh_token: t.refresh_token,
      expires_at: new Date(now + t.expires_in * 1000).toISOString(),
      refresh_expires_at: new Date(now + t.refresh_expires_in * 1000).toISOString(),
      scopes: t.scope.split(","),
    });
  if (error) throw new Error(error.message);
}

/** Intercambia el `code` del callback y guarda la conexión */
export async function connectWithCode(code: string) {
  const tokens = await tokenRequest({
    code,
    grant_type: "authorization_code",
    redirect_uri: process.env.TIKTOK_REDIRECT_URI!,
  });
  const user = await fetchUser(tokens.access_token);
  await saveTokens(tokens, user.username ? `@${user.username}` : user.display_name);
  return user;
}

export async function getConnection() {
  const { data } = await createAdminClient()
    .from("integrations")
    .select("account_id, account_name, expires_at, refresh_expires_at, connected_at, updated_at")
    .eq("provider", "tiktok")
    .maybeSingle();
  return data as {
    account_id: string;
    account_name: string | null;
    expires_at: string;
    refresh_expires_at: string;
    connected_at: string;
    updated_at: string;
  } | null;
}

/** Devuelve un access token vigente, renovándolo si vence en menos de 10 minutos */
async function getAccessToken() {
  const { data } = await createAdminClient()
    .from("integrations")
    .select("access_token, refresh_token, expires_at, refresh_expires_at")
    .eq("provider", "tiktok")
    .maybeSingle();
  if (!data) throw new Error("TikTok no está conectado");

  if (new Date(data.expires_at).getTime() - Date.now() > 10 * 60_000) return data.access_token as string;
  if (new Date(data.refresh_expires_at).getTime() < Date.now()) {
    throw new Error("La conexión con TikTok venció. Vuelve a conectar la cuenta en Ajustes.");
  }
  const fresh = await tokenRequest({ grant_type: "refresh_token", refresh_token: data.refresh_token });
  await saveTokens(fresh);
  return fresh.access_token;
}

async function api<T>(path: string, init: RequestInit & { token?: string } = {}): Promise<T> {
  const token = init.token ?? (await getAccessToken());
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", ...init.headers },
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok || (json.error?.code && json.error.code !== "ok")) {
    throw new Error(json.error?.message || `TikTok API ${res.status}`);
  }
  return json.data as T;
}

// ─── Datos ─────────────────────────────────────────────────────────

export interface TtUser {
  open_id: string;
  display_name: string;
  username?: string;
  avatar_url?: string;
  profile_deep_link?: string;
  is_verified?: boolean;
  follower_count: number;
  following_count: number;
  likes_count: number;
  video_count: number;
}

const USER_FIELDS =
  "open_id,display_name,username,avatar_url,profile_deep_link,is_verified,follower_count,following_count,likes_count,video_count";

function fetchUser(token?: string) {
  return api<{ user: TtUser }>(`/user/info/?fields=${USER_FIELDS}`, { token }).then((d) => d.user);
}

export const getUser = () => fetchUser();

export interface TtVideo {
  id: string;
  title?: string;
  video_description?: string;
  create_time: number;
  cover_image_url?: string;
  share_url?: string;
  duration?: number;
  view_count?: number;
  like_count?: number;
  comment_count?: number;
  share_count?: number;
}

const VIDEO_FIELDS =
  "id,title,video_description,create_time,cover_image_url,share_url,duration,view_count,like_count,comment_count,share_count";

/** Últimos videos (hasta `max`), del más reciente al más antiguo */
export async function getVideos(max = 40) {
  const videos: TtVideo[] = [];
  let cursor: number | undefined;
  while (videos.length < max) {
    const page = await api<{ videos: TtVideo[]; cursor: number; has_more: boolean }>(
      `/video/list/?fields=${VIDEO_FIELDS}`,
      { method: "POST", body: JSON.stringify({ max_count: 20, ...(cursor && { cursor }) }) },
    );
    videos.push(...(page.videos ?? []));
    if (!page.has_more) break;
    cursor = page.cursor;
  }
  return videos.slice(0, max);
}
