# Integraciones: GA4, Instagram y TikTok

Orden recomendado (de más fácil a más lenta):

1. **GA4**: 15 minutos, sin aprobaciones.
2. **Instagram**: 30 minutos. No necesita App Review si solo conectas tu propia cuenta.
3. **TikTok**: el Sandbox funciona de inmediato; producción requiere revisión (días). **Crea la app hoy** aunque la integres al final.

> **Antes de empezar:** despliega el admin en Vercel con un dominio (ej. `admin.juantapias.dev`).
> Meta y TikTok exigen redirect URIs **HTTPS** registradas. Para probar en local usa un túnel (`ngrok http 3000`) y registra esa URL también.

Todos los secretos van en las variables de entorno del proyecto `admin` en Vercel (y en `apps/admin/.env.local` para desarrollo). Nunca con prefijo `NEXT_PUBLIC_`.

---

## 1. Google Analytics 4 (Data API)

Se usa una **service account**: un "usuario robot" con acceso de solo lectura a tu propiedad. No hay OAuth ni tokens que renovar.

### Pasos

1. **Proyecto en Google Cloud**
   - Ve a <https://console.cloud.google.com> → selector de proyectos → *Nuevo proyecto* (ej. `portfolio-admin`).
2. **Activa la API**
   - *APIs y servicios → Biblioteca* → busca **Google Analytics Data API** → *Habilitar*.
3. **Crea la service account**
   - *IAM y administración → Cuentas de servicio → Crear cuenta de servicio*.
   - Nombre: `admin-analytics`. No le asignes roles de Cloud (no los necesita).
   - Entra a la cuenta → pestaña *Claves* → *Agregar clave → Crear clave nueva → JSON*. Se descarga un archivo.
   - Si tu organización bloquea la creación de claves (`iam.disableServiceAccountKeyCreation`), desactiva esa política para este proyecto.
4. **Dale acceso en GA4**
   - <https://analytics.google.com> → *Administrar* → *Propiedad* → *Gestión del acceso a la propiedad* → `+` → *Añadir usuarios*.
   - Pega el `client_email` del JSON (termina en `.iam.gserviceaccount.com`), rol **Lector**, desmarca "Notificar por correo".
5. **Copia el ID de la propiedad**
   - *Administrar → Configuración de la propiedad* → **ID de propiedad** (solo números, no el `G-XXXX`).
6. **Variables de entorno** (del JSON descargado):
   ```env
   GA4_PROPERTY_ID=123456789
   GA4_CLIENT_EMAIL=admin-analytics@portfolio-admin.iam.gserviceaccount.com
   GA4_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```
   Después borra el JSON de tu equipo o guárdalo en un gestor de contraseñas.
7. **Marca la conversión como evento clave**
   - En la web, envía un evento `generate_lead` al enviar el formulario o al hacer clic en WhatsApp.
   - GA4 → *Administrar → Eventos clave* → márcalo. Esto es lo que usa el módulo **Conversión**.

### Código (cuando construyamos el módulo)

```bash
npm i -w admin @google-analytics/data
```

```ts
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const ga = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA4_CLIENT_EMAIL,
    private_key: process.env.GA4_PRIVATE_KEY!.replace(/\\n/g, "\n"),
  },
});

const [report] = await ga.runReport({
  property: `properties/${process.env.GA4_PROPERTY_ID}`,
  dateRanges: [{ startDate: "28daysAgo", endDate: "today" }],
  dimensions: [{ name: "sessionSource" }, { name: "sessionCampaignName" }],
  metrics: [{ name: "sessions" }, { name: "totalUsers" }, { name: "keyEvents" }],
});
```

GA4 sí guarda histórico, así que este módulo **consulta en vivo** (con caché de unos minutos) y no necesita cron.

---

## 2. Instagram (Instagram API con Instagram Login)

Usamos el flujo **"Instagram API with Instagram Login"**. No requiere Página de Facebook, a diferencia del flujo antiguo con Facebook Login.

**Requisito:** tu cuenta de Instagram debe ser **profesional** (Creador o Empresa).
App de Instagram → *Configuración → Tipo de cuenta y herramientas → Cambiar a cuenta profesional*.

### Pasos

1. **Cuenta de desarrollador**: <https://developers.facebook.com> → inicia sesión → regístrate como desarrollador.
2. **Crea la app**
   - *Mis apps → Crear app*.
   - Caso de uso: **"Administrar mensajes y contenido en Instagram"** (Instagram API).
   - Tipo: **Empresa**.
3. **Configura el producto Instagram**
   - En el panel de la app → *Instagram → Configuración de la API con inicio de sesión de Instagram*.
   - Copia el **ID de la app de Instagram** y la **clave secreta de la app de Instagram**. Ojo: son distintos del App ID de Meta.
     ```env
     META_APP_ID=<Instagram app ID>
     META_APP_SECRET=<Instagram app secret>
     ```
4. **Agrega tu cuenta como tester**
   - *Roles de la app → Roles → Testers de Instagram* → agrega tu usuario.
   - En la app de Instagram: *Configuración → Apps y sitios web → Invitaciones de tester* → **Aceptar**.
   - En **modo desarrollo** la app funciona con cuentas que tengan un rol en ella. Como solo vas a leer **tu** cuenta, **no necesitas App Review** ni publicar la app.
5. **Configura el login (OAuth)**
   - En *Configurar inicio de sesión empresarial de Instagram* → *URIs de redireccionamiento OAuth válidas*:
     `https://admin.juantapias.dev/api/integrations/instagram/callback`
   - Permisos que vamos a pedir:
     - `instagram_business_basic`: perfil, seguidores y publicaciones.
     - `instagram_business_manage_insights`: alcance, vistas e interacciones.
6. **Atajo para probar ya:** en la misma pantalla, *Generar tokens de acceso → Agregar cuenta* te da un token de larga duración para tu cuenta sin escribir código. Úsalo para probar los endpoints en Postman o curl. Después el admin hará el mismo flujo con OAuth y guardará el token en Supabase.

### Cómo funciona en el admin

```
Ajustes → "Conectar Instagram"
  → https://www.instagram.com/oauth/authorize?client_id=…&redirect_uri=…&response_type=code
      &scope=instagram_business_basic,instagram_business_manage_insights&state=<csrf>
  → callback recibe ?code=
  → POST https://api.instagram.com/oauth/access_token     (code → token corto, 1 h)
  → GET  https://graph.instagram.com/access_token
         ?grant_type=ig_exchange_token                     (token corto → largo, 60 días)
  → guarda en la tabla `integrations` (provider = 'instagram')
```

- **Renovación:** el token largo dura 60 días. Un cron semanal llama a
  `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=…`
  (solo funciona si el token tiene más de 24 h y no ha vencido).
- **Endpoints que usaremos** (`graph.instagram.com/<versión>/…`):
  - `me?fields=user_id,username,followers_count,media_count`
  - `me/insights?metric=reach,views,profile_views,accounts_engaged,total_interactions&period=day&metric_type=total_value`
  - `me/media?fields=id,caption,media_type,permalink,thumbnail_url,timestamp,like_count,comments_count`
  - `<media-id>/insights?metric=reach,views,saved,shares,total_interactions`
- Meta retiró `impressions` en 2025; ahora la métrica es `views`. Revisa la versión vigente de la Graph API en el changelog de Meta antes de implementar.
- **Por qué un cron diario:** la API no da el histórico de seguidores. Si no guardamos un snapshot cada día en `social_metrics_daily`, no hay gráfica de crecimiento.

---

## 3. TikTok

Hay dos APIs:

| | **Display API** (Login Kit) | **TikTok API for Business** |
|---|---|---|
| Datos | Seguidores, likes totales, nº de videos; por video: vistas, likes, comentarios, compartidos | Lo anterior + alcance, tiempo de visualización, tráfico al perfil, demografía |
| Requisitos | Cualquier cuenta | Cuenta **Business** de TikTok + aprobación del Business API |
| Recomendación | **Empezar aquí** | Migrar después si necesitas más profundidad |

### Pasos (Display API)

1. **Cuenta de desarrollador**: <https://developers.tiktok.com> → *Log in* → registra una organización o cuenta individual.
2. **Crea la app**: *Manage apps → Connect an app*.
   - Completa icono, nombre, categoría y descripción.
   - **URL de Términos de servicio** y **URL de Política de privacidad**. Ya tienes `/es/privacidad/`; falta una página de términos en el portfolio.
   - Plataforma: **Web**, con la URL del admin.
3. **Agrega productos**
   - **Login Kit** → *Redirect URI*: `https://admin.juantapias.dev/api/integrations/tiktok/callback` (HTTPS obligatorio).
   - **Display API**.
4. **Scopes** (en *Scopes*, agrega):
   - `user.info.basic`
   - `user.info.profile`
   - `user.info.stats`: seguidores, likes y número de videos.
   - `video.list`: videos y sus métricas.
5. **Sandbox (para empezar ya)**
   - Arriba a la derecha del panel de la app → cambia a **Sandbox** → crea uno.
   - *Target users* → agrega tu cuenta de TikTok. Con eso funciona el login completo **sin revisión**.
6. **Credenciales** (*App details*):
   ```env
   TIKTOK_CLIENT_KEY=
   TIKTOK_CLIENT_SECRET=
   ```
7. **Producción (opcional, en paralelo):** *Submit for review*. Piden un video demo del flujo de login y la explicación de cada scope. Si solo vas a conectar tu propia cuenta, el Sandbox puede bastarte. Confirma en su documentación vigente si los tokens del Sandbox tienen restricciones.

### Cómo funciona en el admin

```
Ajustes → "Conectar TikTok"
  → https://www.tiktok.com/v2/auth/authorize/?client_key=…&response_type=code
      &scope=user.info.basic,user.info.profile,user.info.stats,video.list
      &redirect_uri=…&state=<csrf>
  → callback recibe ?code=
  → POST https://open.tiktokapis.com/v2/oauth/token/   (grant_type=authorization_code)
  → guarda access_token (24 h) y refresh_token (365 días) en `integrations`
```

- **Renovación:** el access token dura **24 horas**. El cron diario lo renueva antes de sincronizar con
  `POST /v2/oauth/token/` y `grant_type=refresh_token`.
- **Endpoints:**
  - `GET https://open.tiktokapis.com/v2/user/info/?fields=open_id,display_name,avatar_url,follower_count,following_count,likes_count,video_count`
  - `POST https://open.tiktokapis.com/v2/video/list/?fields=id,title,create_time,cover_image_url,share_url,view_count,like_count,comment_count,share_count`

---

## 4. Sincronización diaria (Vercel Cron)

Instagram y TikTok se guardan como snapshots. Se creará `apps/admin/vercel.json`:

```json
{
  "crons": [{ "path": "/api/cron/sync-social", "schedule": "0 6 * * *" }]
}
```

- Vercel envía `Authorization: Bearer <CRON_SECRET>` si defines `CRON_SECRET` en las variables del proyecto; el endpoint lo verifica.
- El plan Hobby permite crons **diarios**, que es suficiente para este caso.
- El endpoint:
  1. renueva los tokens que lo necesiten;
  2. guarda los seguidores y las métricas del día en `social_metrics_daily`;
  3. actualiza las métricas de las publicaciones recientes en `social_posts`.

---

## 5. Atribución de leads (para la tasa de conversión)

Para que el CRM sepa de dónde viene cada lead, el formulario de la web debe enviar:

- `utm_source`, `utm_medium` y `utm_campaign`, guardados en `sessionStorage` al llegar a la página (tus redirects `/ig`, `/tiktok` y `/propuesta` ya los agregan);
- `landing_page`, la ruta donde se envió el formulario.

El formulario hará POST a un endpoint del admin (`/api/leads`, con validación y rate limit), que inserta el lead en `leads` con la clave secreta. Al mismo tiempo, la web dispara `generate_lead` en GA4.

**Tasa de conversión** = leads (CRM) ÷ sesiones (GA4), por canal y campaña, en el mismo rango de fechas.
