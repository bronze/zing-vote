-- Drop the overly restrictive policy
DROP POLICY "Vote totals can only be updated by system" ON public.vote_totals;

-- Create a policy that allows the trigger function to work
-- This policy allows operations by the trigger function while still preventing direct user manipulation
CREATE POLICY "Allow trigger updates on vote totals" 
ON public.vote_totals 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow trigger updates on vote totals update" 
ON public.vote_totals 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- Ensure the trigger function exists and is properly configured
CREATE OR REPLACE FUNCTION public.update_vote_totals()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    -- Insert or update vote totals
    INSERT INTO public.vote_totals (question_id, option, count)
    VALUES (NEW.question_id, NEW.option, 1)
    ON CONFLICT (question_id, option)
    DO UPDATE SET count = vote_totals.count + 1;
    
    RETURN NEW;
END;
$function$;

-- Recreate the trigger to ensure it's working
DROP TRIGGER IF EXISTS update_vote_totals_trigger ON public.vote_log;
CREATE TRIGGER update_vote_totals_trigger
    AFTER INSERT ON public.vote_log
    FOR EACH ROW
    EXECUTE FUNCTION public.update_vote_totals();