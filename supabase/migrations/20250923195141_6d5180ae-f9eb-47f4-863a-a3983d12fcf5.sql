-- Create questions table
CREATE TABLE public.questions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    category TEXT NOT NULL,
    emoji TEXT,
    profile_image TEXT,
    is_open BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vote_log table for individual votes
CREATE TABLE public.vote_log (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    option TEXT NOT NULL CHECK (option IN ('option_a', 'option_b')),
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vote_totals table for aggregated counts
CREATE TABLE public.vote_totals (
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    option TEXT NOT NULL CHECK (option IN ('option_a', 'option_b')),
    count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (question_id, option)
);

-- Enable Row Level Security
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vote_totals ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required)
CREATE POLICY "Questions are viewable by everyone" 
ON public.questions 
FOR SELECT 
USING (true);

CREATE POLICY "Vote log is viewable by everyone" 
ON public.vote_log 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert votes" 
ON public.vote_log 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Vote totals are viewable by everyone" 
ON public.vote_totals 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can update vote totals" 
ON public.vote_totals 
FOR ALL 
USING (true);

-- Function to update vote totals after a vote is cast
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
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update totals when vote is inserted
CREATE TRIGGER update_vote_totals_trigger
    AFTER INSERT ON public.vote_log
    FOR EACH ROW
    EXECUTE FUNCTION update_vote_totals();

-- Insert sample questions from the current mock data
INSERT INTO public.questions (question_text, option_a, option_b, category, emoji, profile_image, is_open) VALUES
('Neymar vai postar indireta hoje?', 'Óbvio 😂', 'Duvido 🤨', 'celebridades', '⚽', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', true),
('Flamengo passa do Barcelona na Champions?', 'Claro! 🔴⚫', 'Nem a pau ❌', 'futebol', '🏆', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', true),
('Lula vai dar entrevista polêmica essa semana?', 'Com certeza 📢', 'Improvável 🤐', 'politica', '🗳️', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face', true),
('BBB24 vai ter mais briga que o anterior?', 'Obviamente 😱', 'Vai ser peace ✌️', 'tv', '📺', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', true),
('Anitta vai lançar música nova até sexta?', 'Vai sim! 🎵', 'Não rola 🚫', 'celebridades', '🎤', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', true),
('Palmeiras vai contratar mais um craque?', 'Sempre! 💚', 'Tá rico? 💸', 'futebol', '🏃‍♂️', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', true);

-- Initialize vote totals for all questions
INSERT INTO public.vote_totals (question_id, option, count)
SELECT id, 'option_a', FLOOR(RANDOM() * 1000 + 100)::INTEGER FROM public.questions
UNION ALL
SELECT id, 'option_b', FLOOR(RANDOM() * 800 + 50)::INTEGER FROM public.questions;