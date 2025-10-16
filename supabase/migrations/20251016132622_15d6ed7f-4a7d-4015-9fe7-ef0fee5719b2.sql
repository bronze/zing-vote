-- Create table for vote snapshots over time
CREATE TABLE IF NOT EXISTS public.vote_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  votes_a INTEGER NOT NULL DEFAULT 0,
  votes_b INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vote_snapshots ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Vote snapshots are viewable by everyone"
ON public.vote_snapshots
FOR SELECT
USING (true);

-- Create index for faster queries by question_id and timestamp
CREATE INDEX idx_vote_snapshots_question_timestamp 
ON public.vote_snapshots(question_id, timestamp DESC);

-- Create function to capture vote snapshots
CREATE OR REPLACE FUNCTION public.capture_vote_snapshot()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_votes_a INTEGER;
  current_votes_b INTEGER;
BEGIN
  -- Get current vote totals for this question
  SELECT COALESCE(SUM(CASE WHEN option = 'option_a' THEN count ELSE 0 END), 0),
         COALESCE(SUM(CASE WHEN option = 'option_b' THEN count ELSE 0 END), 0)
  INTO current_votes_a, current_votes_b
  FROM public.vote_totals
  WHERE question_id = NEW.question_id;
  
  -- Insert snapshot
  INSERT INTO public.vote_snapshots (question_id, votes_a, votes_b, timestamp)
  VALUES (NEW.question_id, current_votes_a, current_votes_b, now());
  
  RETURN NEW;
END;
$$;

-- Create trigger to capture snapshots on every vote
CREATE TRIGGER capture_vote_snapshot_trigger
AFTER INSERT ON public.vote_log
FOR EACH ROW
EXECUTE FUNCTION public.capture_vote_snapshot();