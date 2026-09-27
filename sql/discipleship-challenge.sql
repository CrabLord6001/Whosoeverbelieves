-- ==========================================================================
-- Whosoever Believes — Discipleship Challenge + signed-in comments
-- Run once in Supabase (SQL Editor). Safe to re-run.
-- ==========================================================================

-- ── 1. CHALLENGE RUNS ────────────────────────────────────────────────────
-- One row each time a reader starts the challenge. Readers can repeat it
-- ("plan the next cycle"), so every run keeps its own checks.
create table if not exists public.challenge_runs (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null default auth.uid() references auth.users(id) on delete cascade,
  challenge_slug text not null default 'discipleship-30',
  start_date     date not null default current_date,
  completed_at   timestamptz,
  created_at     timestamptz not null default now()
);
create index if not exists challenge_runs_user_idx
  on public.challenge_runs (user_id, challenge_slug, created_at desc);

-- ── 2. PRACTICE CHECK-OFFS ───────────────────────────────────────────────
-- One row per practice the reader has ticked off (e.g. item_key 'w2-3').
create table if not exists public.challenge_checks (
  run_id     uuid not null references public.challenge_runs(id) on delete cascade,
  item_key   text not null check (char_length(item_key) between 1 and 40),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  checked_at timestamptz not null default now(),
  primary key (run_id, item_key)
);

-- (A daily journal table was tried and removed — journaling is done offline.)

-- ── ROW-LEVEL SECURITY: each reader sees and edits only their own rows ──
alter table public.challenge_runs    enable row level security;
alter table public.challenge_checks  enable row level security;

drop policy if exists "Own challenge runs" on public.challenge_runs;
create policy "Own challenge runs" on public.challenge_runs
  for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Checks must belong to the reader AND to one of the
-- reader's own runs.
drop policy if exists "Own challenge checks" on public.challenge_checks;
create policy "Own challenge checks" on public.challenge_checks
  for all to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id and exists (
      select 1 from public.challenge_runs r
       where r.id = run_id and r.user_id = auth.uid())
  );

-- ── 4. COMMENTS: remember which account posted (optional) ───────────────
-- Anonymous comments keep working. When a signed-in reader posts, the
-- existing before-insert trigger records their account. The value always
-- comes from the login itself, never from what the browser sends.
alter table public.comments
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create or replace function public.comments_before_insert()
 returns trigger
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  v_hdrs   json;
  v_ip     text;
  v_ua     text;
  v_recent int;
  v_parent record;
  v_admin  boolean;
begin
  v_admin := public.is_admin();

  -- Moderation fields can never be set by a public submission.
  if not v_admin then
    new.status          := 'pending';
    new.is_author_reply := false;
    new.approved_at     := null;
  end if;

  -- Linked account comes only from the login token (NULL when anonymous).
  new.user_id := auth.uid();

  new.author_name  := btrim(new.author_name);
  new.body         := btrim(new.body);
  new.author_email := nullif(btrim(lower(coalesce(new.author_email, ''))), '');
  new.page_slug    := lower(btrim(new.page_slug));

  -- Capture request metadata for spam control (never shown publicly).
  begin
    v_hdrs := nullif(current_setting('request.headers', true), '')::json;
  exception when others then
    v_hdrs := null;
  end;

  if v_hdrs is not null then
    v_ip := btrim(split_part(coalesce(v_hdrs ->> 'x-forwarded-for', ''), ',', 1));
    v_ua := left(coalesce(v_hdrs ->> 'user-agent', ''), 300);
  end if;

  new.ip_hash    := case when coalesce(v_ip, '') = '' then null
                         else md5('wb-comments-v1|' || v_ip) end;
  new.user_agent := nullif(v_ua, '');

  -- Threading is one level deep, and a reply always belongs to its parent's page.
  if new.parent_id is not null then
    select c.id, c.parent_id, c.page_slug, c.page_title
      into v_parent
      from public.comments c
     where c.id = new.parent_id;

    if v_parent.id is null then
      raise exception 'That comment is no longer available.';
    end if;

    if v_parent.parent_id is not null then
      new.parent_id := v_parent.parent_id;
    end if;

    new.page_slug  := v_parent.page_slug;
    new.page_title := coalesce(new.page_title, v_parent.page_title);
  end if;

  -- Flood and duplicate protection for public submissions.
  if not v_admin and new.ip_hash is not null then
    select count(*) into v_recent
      from public.comments c
     where c.ip_hash = new.ip_hash
       and c.created_at > now() - interval '10 minutes';

    if v_recent >= 3 then
      raise exception 'You have posted several comments already. Please wait a few minutes before posting again.';
    end if;

    if exists (
      select 1 from public.comments c
       where c.ip_hash = new.ip_hash
         and c.body = new.body
         and c.created_at > now() - interval '1 day'
    ) then
      raise exception 'That comment has already been submitted and is awaiting review.';
    end if;
  end if;

  return new;
end;
$function$;
