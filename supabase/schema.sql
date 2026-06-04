-- ============================================================================
--  RAGNAROK STUDIO 3D — Esquema PostgreSQL completo (Supabase)
--  Ejecutar en: Supabase Dashboard > SQL Editor > New query > Run
--  Es idempotente: se puede correr varias veces sin romper nada.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0) Extensiones
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1) Función utilitaria: actualizar updated_at automáticamente
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 2) Tipo de estado de figura
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'figure_status') then
    create type public.figure_status as enum ('on_demand', 'in_stock', 'sold_out');
  end if;
end;
$$;
-- Estado "Reservada" (agregado de forma idempotente para bases existentes)
alter type public.figure_status add value if not exists 'reserved';
-- in_stock   -> "Disponible"
-- on_demand  -> "Disponible por encargo"
-- reserved   -> "Reservada"
-- sold_out   -> "Agotado"

-- ----------------------------------------------------------------------------
-- 3) Tabla USERS (perfil de administradores, ligada a auth.users)
--    Supabase Auth maneja la autenticación; acá guardamos el rol.
-- ----------------------------------------------------------------------------
create table if not exists public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  full_name   text,
  is_admin    boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Crea automáticamente el perfil cuando se registra un usuario en Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 4) Tabla CATEGORIES
-- ----------------------------------------------------------------------------
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  image_url   text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_categories_updated on public.categories;
create trigger trg_categories_updated
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 5) Tabla FIGURES
-- ----------------------------------------------------------------------------
create table if not exists public.figures (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  saga          text,
  category_id   uuid references public.categories(id) on delete set null,
  figure_type   text,                       -- Escultura, Busto, Diorama, Llavero...
  height        text,                       -- Ej: "25 cm"
  price         text,                       -- Ej: "$ 25.000" o "Consultar"
  description   text,
  status        public.figure_status not null default 'on_demand',
  cover_url     text,                        -- imagen principal
  featured      boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_figures_category on public.figures(category_id);
create index if not exists idx_figures_status   on public.figures(status);

-- Columnas agregadas posteriormente (idempotente para bases ya creadas)
alter table public.figures add column if not exists price text;

drop trigger if exists trg_figures_updated on public.figures;
create trigger trg_figures_updated
  before update on public.figures
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 6) Tabla FIGURE_IMAGES (galería)
-- ----------------------------------------------------------------------------
create table if not exists public.figure_images (
  id          uuid primary key default gen_random_uuid(),
  figure_id   uuid not null references public.figures(id) on delete cascade,
  image_url   text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

create index if not exists idx_figure_images_figure on public.figure_images(figure_id);

-- ----------------------------------------------------------------------------
-- 7) Tabla UPCOMING_FIGURES (Próximamente)
-- ----------------------------------------------------------------------------
create table if not exists public.upcoming_figures (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  saga        text,
  figure_type text,
  image_url   text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_upcoming_updated on public.upcoming_figures;
create trigger trg_upcoming_updated
  before update on public.upcoming_figures
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 8) Tabla FAQ
-- ----------------------------------------------------------------------------
create table if not exists public.faq (
  id          uuid primary key default gen_random_uuid(),
  question    text not null,
  answer      text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_faq_updated on public.faq;
create trigger trg_faq_updated
  before update on public.faq
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 9) Tabla SETTINGS (clave/valor: métodos de pago, textos editables, etc.)
-- ----------------------------------------------------------------------------
create table if not exists public.settings (
  key         text primary key,
  value       text,
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_settings_updated on public.settings;
create trigger trg_settings_updated
  before update on public.settings
  for each row execute function public.set_updated_at();

-- ============================================================================
--  ROW LEVEL SECURITY
--  Lectura pública (la web es vitrina). Escritura solo usuarios autenticados.
-- ============================================================================
alter table public.users            enable row level security;
alter table public.categories       enable row level security;
alter table public.figures          enable row level security;
alter table public.figure_images    enable row level security;
alter table public.upcoming_figures enable row level security;
alter table public.faq              enable row level security;
alter table public.settings         enable row level security;

-- USERS: cada quien ve/edita su propio perfil
drop policy if exists "users_select_own" on public.users;
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

-- Macro para tablas de contenido: SELECT público + ALL para autenticados
do $$
declare t text;
begin
  foreach t in array array['categories','figures','figure_images','upcoming_figures','faq','settings']
  loop
    execute format('drop policy if exists "%s_public_read" on public.%I;', t, t);
    execute format('create policy "%s_public_read" on public.%I for select using (true);', t, t);

    execute format('drop policy if exists "%s_auth_write" on public.%I;', t, t);
    execute format('create policy "%s_auth_write" on public.%I for all to authenticated using (true) with check (true);', t, t);
  end loop;
end;
$$;

-- ============================================================================
--  NEWSLETTER / ACCESO ANTICIPADO
--  Inserción pública (cualquiera puede suscribirse); lectura solo admin.
--  No envía correos ni integra servicios externos: solo guarda leads.
-- ============================================================================
create table if not exists public.newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text,
  whatsapp    text,
  source      text,                          -- "newsletter", "avisarme:slug", etc.
  created_at  timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

-- Cualquiera puede suscribirse (insert)
drop policy if exists "newsletter_public_insert" on public.newsletter_subscribers;
create policy "newsletter_public_insert" on public.newsletter_subscribers
  for insert with check (true);

-- Solo usuarios autenticados (admin) pueden leer / administrar
drop policy if exists "newsletter_auth_read" on public.newsletter_subscribers;
create policy "newsletter_auth_read" on public.newsletter_subscribers
  for select to authenticated using (true);

drop policy if exists "newsletter_auth_write" on public.newsletter_subscribers;
create policy "newsletter_auth_write" on public.newsletter_subscribers
  for all to authenticated using (true) with check (true);

-- ============================================================================
--  RESERVAS
--  Inserción pública (sin datos personales obligatorios); lectura solo admin.
-- ============================================================================
create table if not exists public.reservations (
  id          uuid primary key default gen_random_uuid(),
  items       jsonb not null default '[]'::jsonb,
  item_count  integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.reservations enable row level security;

drop policy if exists "reservations_public_insert" on public.reservations;
create policy "reservations_public_insert" on public.reservations
  for insert with check (true);

drop policy if exists "reservations_auth_read" on public.reservations;
create policy "reservations_auth_read" on public.reservations
  for select to authenticated using (true);

drop policy if exists "reservations_auth_write" on public.reservations;
create policy "reservations_auth_write" on public.reservations
  for all to authenticated using (true) with check (true);

-- ============================================================================
--  BÚSQUEDA: pg_trgm (tolerancia a errores de tipeo) + función de búsqueda
-- ============================================================================
create extension if not exists pg_trgm;
create index if not exists idx_figures_name_trgm on public.figures using gin (name gin_trgm_ops);
create index if not exists idx_figures_saga_trgm on public.figures using gin (saga gin_trgm_ops);

-- Devuelve figuras que coinciden por substring o por similitud (typos),
-- ordenadas por relevancia. SECURITY INVOKER respeta RLS (lectura pública).
create or replace function public.search_figures(p_q text)
returns setof public.figures
language sql
stable
as $$
  select *
  from public.figures f
  where p_q is null or p_q = ''
     or f.name ilike '%' || p_q || '%'
     or coalesce(f.saga, '') ilike '%' || p_q || '%'
     or f.name % p_q
     or coalesce(f.saga, '') % p_q
  order by
    greatest(similarity(f.name, p_q), similarity(coalesce(f.saga, ''), p_q)) desc,
    f.created_at desc
  limit 200;
$$;

-- ============================================================================
--  STORAGE: bucket público "figures" para imágenes
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('figures', 'figures', true)
on conflict (id) do nothing;

drop policy if exists "figures_public_read" on storage.objects;
create policy "figures_public_read" on storage.objects
  for select using (bucket_id = 'figures');

drop policy if exists "figures_auth_insert" on storage.objects;
create policy "figures_auth_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'figures');

drop policy if exists "figures_auth_update" on storage.objects;
create policy "figures_auth_update" on storage.objects
  for update to authenticated using (bucket_id = 'figures');

drop policy if exists "figures_auth_delete" on storage.objects;
create policy "figures_auth_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'figures');

-- ============================================================================
--  SEED — Datos iniciales (categorías, settings y ejemplos)
-- ============================================================================
insert into public.categories (name, slug, sort_order) values
  ('Marvel',      'marvel',      1),
  ('DC',          'dc',          2),
  ('Anime',       'anime',       3),
  ('Videojuegos', 'videojuegos', 4),
  ('Series',      'series',      5),
  ('Cine',        'cine',        6)
on conflict (slug) do nothing;

insert into public.settings (key, value) values
  ('payment_methods', E'Efectivo\nTransferencia bancaria\nTarjeta de crédito / débito'),
  ('payment_intro',   'Aceptamos los siguientes medios de pago para tu encargo:'),
  ('hero_title',      'Figuras coleccionables impresas en 3D con acabado profesional'),
  ('hero_subtitle',   'Esculturas, bustos, dioramas y llaveros de tus franquicias favoritas.')
on conflict (key) do nothing;

-- Hero Premium (fondo épico + overlay + efectos). Editable desde el admin.
insert into public.settings (key, value) values
  ('hero_background_image',     ''),
  ('hero_overlay_opacity',      '0.6'),
  ('hero_particles_enabled',    'true'),
  ('hero_particles_count',      '42'),
  ('hero_particles_size',       '2.6'),
  ('hero_particles_opacity',    '0.4'),
  ('hero_particles_speed',      '1'),
  ('hero_cursor_glow_enabled',  'true'),
  ('hero_parallax_enabled',     'true'),
  ('hero_card_images',          '[]'),
  ('hero_card_autoplay',        'true'),
  ('hero_card_rotation_ms',     '5000'),
  ('hero_card_indicators',      'true'),
  ('hero_card_slides',          '[]'),
  ('hero_card_name',            ''),
  ('hero_card_saga',            ''),
  ('hero_card_height',          ''),
  ('hero_card_price',           ''),
  ('instagram_url',             'https://instagram.com/ragnarok_studio3d'),
  ('instagram_enabled',         'true'),
  ('instagram_handle',          '@ragnarok_studio3d'),
  ('instagram_grid_images',     '[]'),
  ('newsletter_enabled',        'true'),
  ('newsletter_title',          'Acceso anticipado a piezas limitadas'),
  ('newsletter_subtitle',       'Recibí acceso anticipado a piezas limitadas, descuentos exclusivos y novedades antes que nadie.'),
  ('newsletter_placeholder',    'Tu correo electrónico o WhatsApp'),
  ('newsletter_button',         'Unirme ahora'),
  ('newsletter_footer',         'Prometemos no enviar spam. Solo arte, coleccionables y lanzamientos exclusivos.'),
  ('about_hero_title',          'Sobre Ragnarok Studio 3D'),
  ('about_hero_image',          ''),
  ('about_history_title',       'Nuestra historia'),
  ('about_history_subtitle',    ''),
  ('about_history_text',        'Ragnarok Studio 3D nace de la pasión por los coleccionables y la impresión 3D. Cada pieza se fabrica de forma artesanal, cuidando cada detalle del proceso para lograr un acabado profesional.'),
  ('about_process_title',       'Cómo nace una figura'),
  ('about_process_steps',       '[]'),
  ('about_video_title',         'El proceso en video'),
  ('about_video_type',          'none'),
  ('about_video_url',           ''),
  ('about_artists_title',       'Artistas y creadores STL'),
  ('about_artists_intro',       'Trabajamos con modelos de artistas especializados, reconociendo su trabajo y talento.'),
  ('about_artists',             '[]'),
  ('about_gallery_title',       'El taller'),
  ('about_gallery_images',      '[]')
on conflict (key) do nothing;

insert into public.faq (question, answer, sort_order) values
  ('¿Cómo encargo una figura?', 'Buscá la figura en el catálogo, abrila y tocá "Consultar por WhatsApp". Se genera un mensaje automático con el nombre de la pieza y coordinamos los detalles.', 1),
  ('¿Cuánto tarda la producción?', 'Cada pieza se imprime y postprocesa artesanalmente (lijado, imprimación, pintura y barnizado). Los tiempos varían según el tamaño y el detalle; te confirmamos el plazo al hacer el pedido.', 2),
  ('¿Puedo pedir un personaje que no está en el catálogo?', '¡Sí! Usá el botón "Solicitar modelo personalizado" y contanos qué personaje querés. Evaluamos la viabilidad y te pasamos presupuesto.', 3),
  ('¿Hacen envíos?', 'Coordinamos entregas y envíos por WhatsApp según tu ubicación.', 4)
on conflict do nothing;

-- Figuras de ejemplo (podés borrarlas desde el panel admin)
insert into public.figures (name, slug, saga, category_id, figure_type, height, description, status, featured)
select 'Kratos', 'kratos', 'God of War',
       (select id from public.categories where slug='videojuegos'),
       'Escultura', '30 cm',
       'Escultura de Kratos impresa en 3D (FDM) y postprocesada a mano: lijado, imprimación, pintura y barnizado profesional.',
       'on_demand', true
where not exists (select 1 from public.figures where slug='kratos');

insert into public.figures (name, slug, saga, category_id, figure_type, height, description, status, featured)
select 'Goku Ultra Instinto', 'goku-ultra-instinto', 'Dragon Ball',
       (select id from public.categories where slug='anime'),
       'Escultura', '28 cm',
       'Goku en estado Ultra Instinto. Pieza coleccionable con acabado artesanal de alto detalle.',
       'in_stock', true
where not exists (select 1 from public.figures where slug='goku-ultra-instinto');

insert into public.figures (name, slug, saga, category_id, figure_type, height, description, status, featured)
select 'Iron Man Mark 85', 'iron-man-mark-85', 'Marvel',
       (select id from public.categories where slug='marvel'),
       'Busto', '22 cm',
       'Busto de Iron Man Mark 85 con detalle de reactor y pintura metalizada.',
       'on_demand', false
where not exists (select 1 from public.figures where slug='iron-man-mark-85');

insert into public.upcoming_figures (name, saga, figure_type, sort_order) values
  ('Batman', 'DC', 'Escultura', 1),
  ('Luffy Gear 5', 'One Piece', 'Escultura', 2)
on conflict do nothing;

-- ============================================================================
--  FIN DEL ESQUEMA
-- ============================================================================
