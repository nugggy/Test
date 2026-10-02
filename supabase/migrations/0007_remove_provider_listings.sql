-- 0007: remove the provider directory (decided 02/10/2026).
--
-- The Find a Provider tool, its public listings and the submission form
-- were removed from the site in 0.40.0.
--
-- WARNING: running this PERMANENTLY DELETES every submitted provider
-- listing. Export them first if you want a copy. The drop cascades, so the
-- row-level-security policies from 0005 go with the table.

drop table if exists public.provider_listings cascade;
