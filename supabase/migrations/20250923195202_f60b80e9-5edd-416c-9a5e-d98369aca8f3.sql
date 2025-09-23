-- Fix security issue: Set search_path for the function
CREATE OR REPLACE FUNCTION update_vote_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert or update vote totals
    INSERT INTO public.vote_totals (question_id, option, count)
    VALUES (NEW.question_id, NEW.option, 1)
    ON CONFLICT (question_id, option)
    DO UPDATE SET count = vote_totals.count + 1;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;