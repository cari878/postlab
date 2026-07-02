# PostLab Supabase Version

Questa versione salva immagini e contenuti su Supabase, quindi tutti gli utenti vedono le stesse ispirazioni.

## File
- index.html
- style.css
- app.js
- config.js

## Passaggi
1. Crea un progetto gratuito su Supabase.
2. Crea la tabella `inspirations`.
3. Crea il bucket pubblico `inspo-images`.
4. Incolla URL e ANON KEY in `config.js`.
5. Carica i file su GitHub.
6. Vercel aggiornerà automaticamente il sito.

## SQL da usare in Supabase

Copia questo in Supabase > SQL Editor:

create table public.inspirations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  sector text not null,
  format text not null,
  goal text not null,
  style text not null,
  tags text,
  notes text,
  image_url text not null
);

alter table public.inspirations enable row level security;

create policy "Public read inspirations"
on public.inspirations
for select
to anon
using (true);

create policy "Public insert inspirations"
on public.inspirations
for insert
to anon
with check (true);

## Storage policy

Crea un bucket chiamato:
inspo-images

Impostalo come Public.

Poi in SQL Editor aggiungi:

create policy "Public read images"
on storage.objects
for select
to anon
using (bucket_id = 'inspo-images');

create policy "Public upload images"
on storage.objects
for insert
to anon
with check (bucket_id = 'inspo-images');

## Nota sicurezza
Questa versione permette caricamenti pubblici senza login. Va bene per testare.
Per una versione seria bisogna aggiungere login, moderazione e limiti.
