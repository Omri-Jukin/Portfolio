begin;

-- This app reads and writes database tables through the Next.js server using
-- Drizzle/Postgres. Do not expose public-schema tables directly through the
-- Supabase Data API roles unless a future feature explicitly needs it.

revoke all privileges on all tables in schema public from anon, authenticated;
revoke all privileges on all sequences in schema public from anon, authenticated;
revoke execute on all functions in schema public from anon, authenticated;
revoke execute on all functions in schema public from public;

-- Keep new public-schema objects created by this project's migration/app
-- owner role server-only by default.
alter default privileges for role postgres in schema public
  revoke select, insert, update, delete on tables from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke usage, select on sequences from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke execute on functions from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke execute on functions from public;

-- Enable RLS on every ordinary and partitioned table in the exposed public
-- schema. With no direct anon/authenticated grants, access remains routed
-- through the server-side database connection.
do $$
declare
  table_record record;
begin
  for table_record in
    select format('%I.%I', n.nspname, c.relname) as qualified_table_name
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relkind in ('r', 'p')
  loop
    execute 'alter table ' || table_record.qualified_table_name || ' enable row level security';
  end loop;
end $$;

notify pgrst, 'reload schema';

commit;
