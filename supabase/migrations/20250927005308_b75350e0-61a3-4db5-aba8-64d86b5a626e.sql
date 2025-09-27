-- Remove the overly permissive policy that allows anyone to update vote totals
DROP POLICY "Anyone can update vote totals" ON public.vote_totals;

-- Create a restrictive policy that prevents direct manipulation of vote counts
-- Only the database trigger function should be able to update vote totals
CREATE POLICY "Vote totals can only be updated by system" 
ON public.vote_totals 
FOR ALL 
USING (false) 
WITH CHECK (false);