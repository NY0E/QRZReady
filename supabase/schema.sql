-- QRZReady memorization-hypothesis trial instrumentation.
-- Project: qrzready (durkpbatbiwxyuwdeiqf, us-east-2)
-- This file documents what's live in Supabase; it is not run automatically.
-- Apply changes via the Supabase MCP / dashboard SQL editor, not by re-running this blindly.

create table study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,          -- Firebase UID, or "anon-<uuid>" for logged-out testers
  exam_type text not null,        -- 'technician' | 'general' | 'extra'
  started_at timestamptz not null default now(),
  ended_at timestamptz            -- last-known-active heartbeat, not a strict close event
);

create table attempts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references study_sessions(id) on delete set null,
  user_id text not null,
  exam_type text not null,
  question_id text not null,
  attempted_at timestamptz not null default now(),
  consecutive_correct_before smallint not null,  -- mastery counter BEFORE this attempt
  distractor_count smallint not null,            -- 0/1/2/3 wrong answers shown
  distractors_shown text[] not null default '{}',
  full_set_unlocked boolean not null,            -- true once distractor_count = 3 (all shown)
  selected_answer_index smallint not null,
  correct_answer_index smallint not null,
  is_correct boolean not null,
  response_time_ms integer
);

create table pass_events (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  exam_type text not null,
  milestone_type text not null check (milestone_type in ('practice_exam', 'real_exam')),
  passed_at timestamptz not null default now(),
  score numeric,
  self_reported boolean not null default true,
  notes text
);

-- Session-level stats, computed from attempts (not a denormalized counter,
-- so it can't drift out of sync).
create view session_stats as
select
  s.id as session_id, s.user_id, s.exam_type, s.started_at, s.ended_at,
  count(a.id) as questions_attempted,
  count(*) filter (
    where a.is_correct and a.consecutive_correct_before = 3 and a.full_set_unlocked = false
  ) as questions_reached_full_unlock
from study_sessions s
left join attempts a on a.session_id = s.id
group by s.id, s.user_id, s.exam_type, s.started_at, s.ended_at;

create view user_study_time as
select
  user_id,
  count(*) as sessions,
  sum(extract(epoch from (coalesce(ended_at, started_at) - started_at))) / 3600.0 as total_study_hours,
  min(started_at) as first_session_at,
  max(coalesce(ended_at, started_at)) as last_session_at
from study_sessions
group by user_id;

-- Writes go through SECURITY DEFINER RPC functions, not direct table access.
-- anon has ZERO direct grants on these three tables; only EXECUTE on:
--   rpc_start_study_session(p_user_id text, p_exam_type text) returns uuid
--   rpc_touch_study_session_end(p_session_id uuid) returns void
--   rpc_log_attempt(...) returns uuid
--   rpc_log_pass_event(...) returns uuid
-- See migration "switch_to_rpc_write_functions" for full definitions.
--
-- Why RPC instead of RLS policies on the base tables: this project's direct-
-- table INSERT-as-anon was unexpectedly rejected by RLS even with a trivial
-- `with check (true)` policy (reproduced on a disposable throwaway table
-- too, so it wasn't specific to this schema). Root cause wasn't pinned down;
-- the RPC approach sidesteps it and is arguably tighter anyway (anon can only
-- call four whitelisted, input-validated entry points, not write arbitrary
-- rows to these tables).
