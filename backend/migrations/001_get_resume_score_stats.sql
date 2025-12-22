-- Create RPC function to get resume score statistics for a job
create or replace function get_resume_score_stats(p_job_id integer)
returns table(
  count bigint,
  avg numeric,
  max numeric,
  min numeric
) as $$
  select 
    count(*)::bigint as count,
    round(avg(score)::numeric, 2) as avg,
    max(score)::numeric as max,
    min(score)::numeric as min
  from resumes
  where job_id = p_job_id
    and score is not null;
$$ language sql;

