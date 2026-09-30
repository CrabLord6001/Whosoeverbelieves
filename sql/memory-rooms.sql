-- ==========================================================================
-- Whosoever Believes — Memory Rooms (saved verses + review history)
-- Run once in Supabase (SQL Editor). Safe to re-run.
-- ==========================================================================

-- ── 1. SAVED VERSES ──────────────────────────────────────────────────────
-- One row per verse a reader is memorizing. Holds everything needed to
-- rebuild their room: the text, their phrase breaks, the room they chose,
-- which object each phrase sits on, and their story line for each.
create table if not exists public.memory_verses (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null default auth.uid() references auth.users(id) on delete cascade,
  ref               text not null check (char_length(ref) between 1 and 80),
  version           text not null default 'web' check (version in ('web', 'kjv')),  -- verses come from Look Up only
  verse_text        text not null check (char_length(verse_text) between 1 and 4000),
  ref_a             text check (char_length(ref_a) <= 80),   -- e.g. 'Romans 8'
  ref_b             text check (char_length(ref_b) <= 80),   -- e.g. 'Verses 38–39'
  breaks            smallint[] not null default '{}',        -- word indexes a phrase ends after
  room_id           text not null default 'jerome' check (char_length(room_id) between 1 and 40),
  placements        smallint[] not null default '{}',        -- phrase index -> station index (-1 = none)
  notes             text[] not null default '{}',            -- one story line per phrase
  review_step       smallint not null default 0 check (review_step between 0 and 10),
  next_review       date,
  last_score        smallint check (last_score between 0 and 100),
  best_score        smallint check (best_score between 0 and 100),
  last_practiced_at timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (user_id, ref, version)
);
create index if not exists memory_verses_user_idx
  on public.memory_verses (user_id, next_review);

-- Keep story lines to a sensible size (the page limits each to 240 characters).
alter table public.memory_verses drop constraint if exists memory_verses_notes_size;
alter table public.memory_verses add constraint memory_verses_notes_size
  check (cardinality(notes) <= 20 and char_length(array_to_string(notes, '')) <= 6000);

-- ── 2. REVIEW HISTORY ────────────────────────────────────────────────────
-- One row each time a reader finishes a Recite check. Used for progress
-- over time; the schedule itself lives on memory_verses.
create table if not exists public.memory_reviews (
  id         uuid primary key default gen_random_uuid(),
  verse_id   uuid not null references public.memory_verses(id) on delete cascade,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  mode       text not null default 'recite' check (mode in ('recite', 'rebuild', 'find')),
  score      smallint not null check (score between 0 and 100),
  created_at timestamptz not null default now()
);
create index if not exists memory_reviews_verse_idx
  on public.memory_reviews (verse_id, created_at desc);
create index if not exists memory_reviews_user_idx
  on public.memory_reviews (user_id);

-- ── ROW-LEVEL SECURITY: each reader sees and edits only their own rows ──
alter table public.memory_verses  enable row level security;
alter table public.memory_reviews enable row level security;

drop policy if exists "Own memory verses" on public.memory_verses;
create policy "Own memory verses" on public.memory_verses
  for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Reviews must belong to the reader AND to one of the reader's own verses.
drop policy if exists "Own memory reviews" on public.memory_reviews;
create policy "Own memory reviews" on public.memory_reviews
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id and exists (
      select 1 from public.memory_verses v
       where v.id = verse_id and v.user_id = (select auth.uid()))
  );
