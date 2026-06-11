create extension if not exists pg_cron;

alter table prayer_times
add column if not exists archived boolean default false;

alter table events
add column if not exists archived boolean default false;

create or replace function public.archive_old_display_data()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update prayer_times
  set archived = true
  where date < date_trunc('month', current_date)::date
    and archived = false;

  update events
  set archived = true
  where (event_date::timestamp + event_time::time) < (now() - interval '7 days')
    and archived = false;
end;
$$;

do $$
declare
  existing_job_id bigint;
begin
  select jobid
  into existing_job_id
  from cron.job
  where jobname = 'archive-old-display-data'
  limit 1;

  if existing_job_id is not null then
    perform cron.unschedule(existing_job_id);
  end if;

  perform cron.schedule(
    'archive-old-display-data',
    '15 3 * * *',
    $_$ select public.archive_old_display_data(); $_$
  );
end;
$$;
