-- Add restrictive SELECT policy to vote_log table to prevent user tracking
-- This ensures individual votes cannot be read, protecting user privacy
CREATE POLICY "Vote logs are private" 
ON public.vote_log 
FOR SELECT 
USING (false);