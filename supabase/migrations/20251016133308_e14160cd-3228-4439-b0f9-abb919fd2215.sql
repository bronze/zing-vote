-- Limpar snapshots existentes (apenas 3 de teste)
DELETE FROM public.vote_snapshots;

-- Criar função para gerar snapshots históricos agregados por hora
CREATE OR REPLACE FUNCTION public.generate_historical_snapshots()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  question_record RECORD;
  hour_record RECORD;
  cumulative_votes_a INTEGER;
  cumulative_votes_b INTEGER;
BEGIN
  -- Para cada pergunta
  FOR question_record IN 
    SELECT DISTINCT question_id FROM vote_log ORDER BY question_id
  LOOP
    cumulative_votes_a := 0;
    cumulative_votes_b := 0;
    
    -- Para cada hora com votos
    FOR hour_record IN
      SELECT 
        DATE_TRUNC('hour', created_at) as hour,
        MAX(created_at) as last_vote_time,
        SUM(CASE WHEN option = 'option_a' THEN 1 ELSE 0 END) as votes_a_in_hour,
        SUM(CASE WHEN option = 'option_b' THEN 1 ELSE 0 END) as votes_b_in_hour
      FROM vote_log
      WHERE question_id = question_record.question_id
      GROUP BY DATE_TRUNC('hour', created_at)
      ORDER BY hour
    LOOP
      -- Acumula os votos
      cumulative_votes_a := cumulative_votes_a + hour_record.votes_a_in_hour;
      cumulative_votes_b := cumulative_votes_b + hour_record.votes_b_in_hour;
      
      -- Insere snapshot no final da hora (usando o timestamp do último voto)
      INSERT INTO vote_snapshots (question_id, timestamp, votes_a, votes_b)
      VALUES (
        question_record.question_id,
        hour_record.last_vote_time,
        cumulative_votes_a,
        cumulative_votes_b
      );
    END LOOP;
  END LOOP;
END;
$$;

-- Executar a função para popular dados históricos
SELECT public.generate_historical_snapshots();