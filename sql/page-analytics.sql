-- ==========================================================================
-- Whosoever Believes — First-party page analytics (ticket 162)
-- Run once in Supabase (SQL Editor). Safe to re-run.
--
-- Why this exists: GA4's only live surface is a 30-minute rolling window and
-- its standard reports are a day behind; Search Console query data runs 2-3
-- days behind and cannot be made live. These two tables are the zero-lag,
-- ad-blocker-proof source, and the data stays in Jonathan's own project.
--
-- Privacy posture: no IP address, no user-agent string, no cookie, no
-- cross-visit identifier. `session_id` is a random value held in
-- sessionStorage, so it dies when the tab closes and cannot link two visits.
-- That is deliberate — it buys per-session counts without tracking readers.
-- ==========================================================================

-- ── 1. PAGE VIEWS ────────────────────────────────────────────────────────
create table if not exists public.page_views (
  id            bigint generated always as identity primary key,
  path          text not null check (char_length(path) between 1 and 400),
  title         text check (char_length(title) <= 300),
  referrer_host text check (char_length(referrer_host) <= 160),
  referrer_path text check (char_length(referrer_path) <= 400),
  source        text not null default 'direct'
                  check (source in ('search','social','ai','referral','direct','internal')),
  device        text check (device in ('mobile','tablet','desktop')),
  session_id    text not null check (char_length(session_id) between 8 and 40),
  created_at    timestamptz not null default now()
);

create index if not exists page_views_time_idx on public.page_views (created_at desc);
create index if not exists page_views_path_time_idx on public.page_views (path, created_at desc);

-- ── 2. SITE SEARCHES ─────────────────────────────────────────────────────
-- What readers type into the site's own search box. Unlike Search Console
-- this is instant, and a run of zero-result searches is the single most
-- useful signal the site produces: it is readers asking for an article
-- that does not exist yet.
create table if not exists public.search_events (
  id            bigint generated always as identity primary key,
  term          text not null check (char_length(term) between 1 and 120),
  results_count smallint not null default 0 check (results_count >= 0),
  path          text check (char_length(path) <= 400),
  session_id    text not null check (char_length(session_id) between 8 and 40),
  created_at    timestamptz not null default now()
);

create index if not exists search_events_time_idx on public.search_events (created_at desc);

-- ── 3. ROW-LEVEL SECURITY ────────────────────────────────────────────────
-- Anyone may write a row; nobody but an admin may read one. The column-level
-- grant is what stops a client inventing its own `created_at` or `id`.
alter table public.page_views    enable row level security;
alter table public.search_events enable row level security;

revoke all on public.page_views    from anon, authenticated;
revoke all on public.search_events from anon, authenticated;

grant insert (path, title, referrer_host, referrer_path, source, device, session_id)
  on public.page_views to anon, authenticated;
grant insert (term, results_count, path, session_id)
  on public.search_events to anon, authenticated;

grant select on public.page_views    to authenticated;
grant select on public.search_events to authenticated;

drop policy if exists "Anyone may record a page view" on public.page_views;
create policy "Anyone may record a page view" on public.page_views
  for insert to anon, authenticated with check (true);

drop policy if exists "Admins read page views" on public.page_views;
create policy "Admins read page views" on public.page_views
  for select to authenticated using ((select public.is_admin()));

drop policy if exists "Anyone may record a search" on public.search_events;
create policy "Anyone may record a search" on public.search_events
  for insert to anon, authenticated with check (true);

drop policy if exists "Admins read searches" on public.search_events;
create policy "Admins read searches" on public.search_events
  for select to authenticated using ((select public.is_admin()));

-- ── 4. REPORTING RPCs ────────────────────────────────────────────────────
-- Following the moderate-comments pattern: the RPC is the real permission
-- check, so the dashboard never reads raw rows and hiding a link is never
-- the protection. Output column names deliberately avoid the table's own
-- column names (url not path, term not query) so plpgsql cannot mistake an
-- OUT parameter for a column.

create or replace function public.admin_traffic_summary(p_hours int default 24)
returns table (
  views_window    bigint,
  sessions_window bigint,
  views_live      bigint,
  sessions_live   bigint,
  views_prev      bigint,
  searches_window bigint
)
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  h int := greatest(1, least(coalesce(p_hours, 24), 24 * 90));
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
  select
    (select count(*) from page_views
       where created_at > now() - make_interval(hours => h)),
    (select count(distinct session_id) from page_views
       where created_at > now() - make_interval(hours => h)),
    (select count(*) from page_views
       where created_at > now() - interval '30 minutes'),
    (select count(distinct session_id) from page_views
       where created_at > now() - interval '30 minutes'),
    (select count(*) from page_views
       where created_at > now() - make_interval(hours => h * 2)
         and created_at <= now() - make_interval(hours => h)),
    (select count(*) from search_events
       where created_at > now() - make_interval(hours => h));
end $$;

create or replace function public.admin_top_pages(p_hours int default 24, p_limit int default 12)
returns table (url text, label text, views bigint, sessions bigint)
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  h int := greatest(1, least(coalesce(p_hours, 24), 24 * 90));
  n int := greatest(1, least(coalesce(p_limit, 12), 100));
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
  select pv.path,
         (array_agg(pv.title order by pv.created_at desc))[1],
         count(*),
         count(distinct pv.session_id)
    from page_views pv
   where pv.created_at > now() - make_interval(hours => h)
   group by pv.path
   order by count(*) desc, pv.path
   limit n;
end $$;

create or replace function public.admin_top_sources(p_hours int default 24, p_limit int default 12)
returns table (host text, kind text, views bigint)
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  h int := greatest(1, least(coalesce(p_hours, 24), 24 * 90));
  n int := greatest(1, least(coalesce(p_limit, 12), 100));
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
  select coalesce(nullif(pv.referrer_host, ''), '(none)'),
         pv.source,
         count(*)
    from page_views pv
   where pv.created_at > now() - make_interval(hours => h)
   group by coalesce(nullif(pv.referrer_host, ''), '(none)'), pv.source
   order by count(*) desc
   limit n;
end $$;

-- Gap-filled hourly series, so a quiet hour draws as a zero rather than
-- vanishing and making the chart lie about the shape of the day.
create or replace function public.admin_views_by_hour(p_hours int default 24)
returns table (bucket timestamptz, views bigint, sessions bigint)
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  h int := greatest(1, least(coalesce(p_hours, 24), 24 * 30));
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
  select g.b,
         count(pv.id),
         count(distinct pv.session_id)
    from generate_series(
           date_trunc('hour', now()) - make_interval(hours => h - 1),
           date_trunc('hour', now()),
           interval '1 hour') as g(b)
    left join page_views pv
           on pv.created_at >= g.b and pv.created_at < g.b + interval '1 hour'
   group by g.b
   order by g.b;
end $$;

-- Daily buckets, so the chart can keep one granularity per range instead of
-- trying to draw 720 hourly bars for a 30-day window.
create or replace function public.admin_views_by_day(p_days int default 30)
returns table (bucket timestamptz, views bigint, sessions bigint)
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  d int := greatest(2, least(coalesce(p_days, 30), 365));
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
  select g.b,
         count(pv.id),
         count(distinct pv.session_id)
    from generate_series(
           date_trunc('day', now()) - make_interval(days => d - 1),
           date_trunc('day', now()),
           interval '1 day') as g(b)
    left join page_views pv
           on pv.created_at >= g.b and pv.created_at < g.b + interval '1 day'
   group by g.b
   order by g.b;
end $$;

create or replace function public.admin_recent_activity(p_limit int default 40)
returns table (at timestamptz, url text, label text, kind text, host text, dev text)
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  n int := greatest(1, least(coalesce(p_limit, 40), 200));
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
  select pv.created_at, pv.path, pv.title, pv.source,
         coalesce(nullif(pv.referrer_host, ''), ''), coalesce(pv.device, '')
    from page_views pv
   order by pv.created_at desc
   limit n;
end $$;

create or replace function public.admin_top_searches(p_hours int default 168, p_limit int default 20)
returns table (term_text text, searches bigint, misses bigint, last_seen timestamptz)
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  h int := greatest(1, least(coalesce(p_hours, 168), 24 * 365));
  n int := greatest(1, least(coalesce(p_limit, 20), 100));
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  return query
  select lower(se.term),
         count(*),
         count(*) filter (where se.results_count = 0),
         max(se.created_at)
    from search_events se
   where se.created_at > now() - make_interval(hours => h)
   group by lower(se.term)
   order by count(*) desc, max(se.created_at) desc
   limit n;
end $$;

-- ── 5. RETENTION ─────────────────────────────────────────────────────────
-- Call this from the SQL editor, or schedule it with pg_cron once the table
-- is big enough to matter. Keeping everything forever is what turns a free
-- project into a paid one.
create or replace function public.prune_analytics(p_days int default 180)
returns text
language plpgsql security definer set search_path = public, pg_temp as $$
declare
  d int := greatest(7, least(coalesce(p_days, 180), 3650));
  v int;
  s int;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  delete from page_views    where created_at < now() - make_interval(days => d);
  get diagnostics v = row_count;
  delete from search_events where created_at < now() - make_interval(days => d);
  get diagnostics s = row_count;
  return format('pruned %s page views and %s searches older than %s days', v, s, d);
end $$;

-- ── 6. EXECUTE GRANTS ────────────────────────────────────────────────────
-- Signed-in readers may call these; the is_admin() check inside is what
-- actually refuses them. anon cannot call them at all.
revoke all on function public.admin_traffic_summary(int) from anon, authenticated;
revoke all on function public.admin_top_pages(int, int)  from anon, authenticated;
revoke all on function public.admin_top_sources(int, int) from anon, authenticated;
revoke all on function public.admin_views_by_hour(int)    from anon, authenticated;
revoke all on function public.admin_recent_activity(int)  from anon, authenticated;
revoke all on function public.admin_top_searches(int, int) from anon, authenticated;
revoke all on function public.prune_analytics(int)        from anon, authenticated;

grant execute on function public.admin_traffic_summary(int)  to authenticated;
grant execute on function public.admin_top_pages(int, int)   to authenticated;
grant execute on function public.admin_top_sources(int, int) to authenticated;
grant execute on function public.admin_views_by_hour(int)    to authenticated;
grant execute on function public.admin_recent_activity(int)  to authenticated;
grant execute on function public.admin_top_searches(int, int) to authenticated;
grant execute on function public.prune_analytics(int)        to authenticated;
