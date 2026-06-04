# Ragnarok Studio 3D

Plataforma web para descubrir, buscar y encargar figuras coleccionables impresas
en 3D. Catálogo tipo Netflix, buscador instantáneo, contacto por WhatsApp y un
panel administrador completo (CRUD de figuras, categorías, próximamente, FAQ y
textos editables).

**Stack:** Next.js 15 (App Router) · React · TypeScript · Tailwind CSS ·
Supabase (PostgreSQL + Auth + Storage) · Vercel.

---

## 1. Requisitos previos

- **Node.js 18.18+** (recomendado 20 o 22) y npm.
- Una cuenta gratuita en **[Supabase](https://supabase.com)**.
- Una cuenta en **[Vercel](https://vercel.com)** para el deploy.
- Tu número de **WhatsApp** en formato internacional sin signos
  (ej. Argentina: `5491122334455`).

---

## 2. Instalación local

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo de variables de entorno
cp .env.example .env.local
# (en Windows PowerShell: copy .env.example .env.local)
```

Luego completá `.env.local` con tus valores (ver sección 4).

```bash
# 3. Levantar el entorno de desarrollo
npm run dev
```

Abrí http://localhost:3000

---

## 3. Configurar Supabase

### 3.1 Crear el proyecto

1. Entrá a https://supabase.com/dashboard y creá un **New project**.
2. Elegí un nombre, una contraseña de base de datos y una región cercana.
3. Esperá a que el proyecto termine de aprovisionarse.

### 3.2 Ejecutar el script SQL

1. En el panel de Supabase, andá a **SQL Editor**.
2. Abrí el archivo `supabase/schema.sql` de este proyecto y copiá **todo** su
   contenido.
3. Pegalo en el editor y presioná **Run**.

Esto crea todas las tablas (`users`, `categories`, `figures`, `figure_images`,
`upcoming_figures`, `faq`, `settings`), los triggers, las políticas de seguridad
(RLS), el bucket de Storage **`figures`** (público) y datos de ejemplo
(categorías, figuras demo, FAQ y textos iniciales).

> El script es **idempotente**: podés volver a ejecutarlo sin romper nada.

### 3.3 Verificar el Storage

En **Storage** debería aparecer un bucket llamado **`figures`** marcado como
*Public*. Ahí se guardan las imágenes que subas desde el panel admin.

### 3.4 Crear el usuario administrador

El panel admin se protege con **Supabase Auth**. Cualquier usuario autenticado
es tratado como administrador.

1. En Supabase andá a **Authentication → Users → Add user → Create new user**.
2. Cargá un **email** y una **contraseña**.
3. Marcá **Auto Confirm User** (para no requerir confirmación por email).
4. Guardá. Con ese email y contraseña vas a entrar a `/admin`.

### 3.5 Obtener las claves de API

En **Project Settings → API** vas a encontrar:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **Project API keys → `anon` `public`** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 4. Variables de entorno

Definí estas variables en `.env.local` (local) y en Vercel (producción):

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave pública `anon` | `eyJhbGci...` |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (sin barra final) | `https://ragnarokstudio3d.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Número de WhatsApp, solo dígitos | `5491122334455` |

> `NEXT_PUBLIC_SITE_URL` se usa para SEO (canonical, sitemap, Open Graph). En
> local podés dejar `http://localhost:3000`.

---

## 5. Uso del panel administrador

1. Entrá a `/admin` (o `/admin/login`).
2. Iniciá sesión con el usuario que creaste en el paso 3.4.
3. Desde el panel podés gestionar:
   - **Figuras** — alta/edición/baja con portada + galería de imágenes, saga,
     categoría, tipo, altura, descripción y estado
     (*Disponible a pedido*, *Stock disponible*, *Agotado*).
   - **Categorías** — Marvel, DC, Anime, Videojuegos, Series, Cine… con imagen.
   - **Próximamente** — anticipos con el badge correspondiente.
   - **FAQ** — preguntas y respuestas desplegables.
   - **Pagos y textos** — medios de pago (uno por línea) y los textos del Hero.

Las imágenes se suben directo a Supabase Storage desde el navegador.

---

## 6. Deploy en Vercel

1. Subí el proyecto a un repositorio de GitHub/GitLab/Bitbucket.
2. En Vercel: **Add New… → Project** e importá el repositorio.
3. Framework: Vercel detecta **Next.js** automáticamente. No hace falta cambiar
   los comandos de build.
4. En **Environment Variables** cargá las 4 variables de la sección 4
   (con el `NEXT_PUBLIC_SITE_URL` apuntando a tu dominio de producción).
5. **Deploy.**
6. Cuando tengas el dominio final, actualizá `NEXT_PUBLIC_SITE_URL` y volvé a
   desplegar para que el SEO use la URL correcta.

> **Tip:** agregá el dominio de tu sitio en Supabase
> (**Authentication → URL Configuration**) si más adelante usás flujos de auth
> por email.

---

## 7. Estructura del proyecto

```
ragnarok-studio-3d/
├─ supabase/
│  └─ schema.sql            # Script SQL completo (tablas, RLS, storage, seed)
├─ public/                  # Estáticos (og-image, favicon…)
├─ src/
│  ├─ middleware.ts         # Refresca sesión y protege /admin
│  ├─ app/
│  │  ├─ layout.tsx         # Fuentes + metadata SEO global
│  │  ├─ page.tsx           # Home (hero, buscador, categorías, catálogo, etc.)
│  │  ├─ globals.css
│  │  ├─ sitemap.ts / robots.ts
│  │  ├─ figura/[slug]/     # Ficha de figura (SEO dinámico + JSON-LD)
│  │  └─ admin/
│  │     ├─ login/          # Login (Supabase Auth)
│  │     └─ (panel)/        # Dashboard + CRUD (ruta protegida)
│  ├─ components/           # UI pública + componentes del panel admin
│  └─ lib/
│     ├─ supabase/          # Clientes browser/server/middleware
│     ├─ actions/           # Server Actions (figuras, contenido, auth)
│     ├─ data.ts            # Consultas de lectura
│     ├─ types.ts
│     └─ utils.ts           # slug, links de WhatsApp, marca
├─ .env.example
├─ next.config.mjs          # remotePatterns para imágenes de Supabase
├─ tailwind.config.ts       # Paleta ink/ember, fuentes, animaciones
└─ package.json
```

---

## 8. Scripts

```bash
npm run dev     # desarrollo
npm run build   # build de producción
npm run start   # servir el build
npm run lint    # linter
```

---

## 9. Notas

- El catálogo, buscador y filtros funcionan en **cliente** sobre los datos
  cargados (búsqueda instantánea por nombre, saga, categoría y tipo).
- El home revalida cada 60 s (ISR); los cambios del admin además fuerzan
  revalidación inmediata de las rutas afectadas.
- Si una imagen no carga, revisá que el bucket **`figures`** exista y sea
  público (paso 3.3) y que el dominio de Supabase esté permitido en
  `next.config.mjs` (ya viene configurado para `*.supabase.co`).
- Para cambiar el logo/wordmark, editá `src/components/Logo.tsx`.

¡Listo! Con esto tenés Ragnarok Studio 3D corriendo en local y en producción.
