-- Run these manually in the Supabase SQL editor after the trial.
-- Schema reference: supabase/schema.sql

-- ============================================================
-- 5a. Exposures-to-mastery: attempts consumed BEFORE full-set unlock,
--     and attempts consumed AFTER unlock to reach a fresh 3-correct streak
--     (a rough "did full exposure make relearning harder" signal).
-- ============================================================

-- Attempts per user/question while still in the gated (pre-unlock) regime
with pre_unlock_counts as (
  select user_id, exam_type, question_id, count(*) as attempts_before_unlock
  from attempts
  where full_set_unlocked = false
  group by user_id, exam_type, question_id
)
select exam_type,
       count(*) as questions,
       round(avg(attempts_before_unlock), 2) as avg_attempts_pre_unlock
from pre_unlock_counts
group by exam_type;

-- Attempts needed, after full-set unlock, to reach a streak of 3 consecutive
-- correct answers again (gaps-and-islands on is_correct, ordered per question)
with post_unlock as (
  select user_id, exam_type, question_id, attempted_at, is_correct,
         row_number() over (partition by user_id, question_id order by attempted_at) as rn
  from attempts
  where full_set_unlocked = true
),
streaks as (
  select *,
         rn - row_number() over (partition by user_id, question_id, is_correct order by rn) as grp
  from post_unlock
),
correct_streaks as (
  select user_id, exam_type, question_id, grp,
         min(rn) as streak_start_rn, count(*) as streak_len
  from streaks
  where is_correct
  group by user_id, exam_type, question_id, grp
),
first_streak_of_3 as (
  select user_id, exam_type, question_id,
         min(streak_start_rn + 2) as attempts_to_3_streak
  from correct_streaks
  where streak_len >= 3
  group by user_id, exam_type, question_id
)
select exam_type,
       count(*) as questions,
       round(avg(attempts_to_3_streak), 2) as avg_post_unlock_attempts_to_3_streak
from first_streak_of_3
group by exam_type;


-- ============================================================
-- 5b. Accuracy drop-off immediately after full distractor set unlock.
--     Expected to dip vs. the gated stages — that's the interesting part,
--     not a bug. Shows accuracy at attempt #1, #2, ... after unlock.
-- ============================================================
with post_unlock as (
  select user_id, exam_type, question_id, is_correct,
         row_number() over (partition by user_id, question_id order by attempted_at) as attempt_number_after_unlock
  from attempts
  where full_set_unlocked = true
)
select exam_type,
       attempt_number_after_unlock,
       count(*) as n,
       round(avg(is_correct::int), 3) as accuracy
from post_unlock
where attempt_number_after_unlock <= 5
group by exam_type, attempt_number_after_unlock
order by exam_type, attempt_number_after_unlock;


-- ============================================================
-- 5c. Retest accuracy on the same question after a 1+ day gap
--     (rough durability / long-term retention signal).
-- ============================================================
with ordered as (
  select exam_type, is_correct, attempted_at,
         lag(attempted_at) over (partition by user_id, question_id order by attempted_at) as prev_attempted_at
  from attempts
)
select exam_type,
       count(*) filter (where prev_attempted_at is not null
                           and attempted_at - prev_attempted_at >= interval '1 day') as retest_after_gap_n,
       round(avg(is_correct::int) filter (where prev_attempted_at is not null
                           and attempted_at - prev_attempted_at >= interval '1 day'), 3) as retest_after_gap_accuracy
from ordered
group by exam_type;


-- ============================================================
-- 5d. Cumulative study time + elapsed calendar time per user,
--     joined to their first pass milestone if reached.
--     -> gives you "passed in X hours over Y weeks" directly.
-- ============================================================
with first_pass as (
  select distinct on (user_id, exam_type)
         user_id, exam_type, passed_at, milestone_type, score
  from pass_events
  order by user_id, exam_type, passed_at asc
)
select
  st.user_id,
  fp.exam_type,
  round(st.total_study_hours, 1) as study_hours,
  st.first_session_at,
  coalesce(fp.passed_at, st.last_session_at) as end_marker,
  round(extract(epoch from (coalesce(fp.passed_at, st.last_session_at) - st.first_session_at)) / 86400.0 / 7, 1) as elapsed_weeks,
  fp.milestone_type,
  fp.score
from user_study_time st
left join first_pass fp on fp.user_id = st.user_id
order by st.user_id;
