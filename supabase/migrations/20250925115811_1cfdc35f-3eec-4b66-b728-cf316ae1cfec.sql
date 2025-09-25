-- Remove public read access to vote_log table to prevent user tracking
-- Keep INSERT access for functionality but remove SELECT access

DROP POLICY IF EXISTS "Vote log is viewable by everyone" ON public.vote_log;

-- The vote_log table should only be accessible for writing votes, not reading
-- Vote totals are available through the vote_totals table which provides 
-- aggregated data without exposing individual voting patterns