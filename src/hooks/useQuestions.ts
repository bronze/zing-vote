import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { posthog } from '@/lib/posthog';

export interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  category: string;
  emoji?: string;
  profile_image?: string;
  is_open: boolean;
  created_at: string;
  votes_a: number;
  votes_b: number;
}

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Generate session ID for vote tracking
  const getSessionId = () => {
    let sessionId = localStorage.getItem('palpite_session_id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('palpite_session_id', sessionId);
    }
    return sessionId;
  };

  // Check if user already voted for a question
  const hasUserVoted = (questionId: string): boolean => {
    const userVotes = JSON.parse(localStorage.getItem('user_votes') || '{}');
    return userVotes[questionId] !== undefined;
  };

  // Get user's vote for a question
  const getUserVote = (questionId: string): 'option_a' | 'option_b' | null => {
    const userVotes = JSON.parse(localStorage.getItem('user_votes') || '{}');
    return userVotes[questionId] || null;
  };

  // Mark question as voted with the chosen option
  const markAsVoted = (questionId: string, option: 'option_a' | 'option_b') => {
    const userVotes = JSON.parse(localStorage.getItem('user_votes') || '{}');
    userVotes[questionId] = option;
    localStorage.setItem('user_votes', JSON.stringify(userVotes));
  };

  // Fetch questions with vote counts
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .order('is_open', { ascending: false }) // Open questions first
        .order('created_at', { ascending: false }); // Then by creation date

      if (questionsError) throw questionsError;

      // Fetch vote totals
      const { data: voteTotals, error: votesError } = await supabase
        .from('vote_totals')
        .select('*');

      if (votesError) throw votesError;

      // Combine data
      const questionsWithVotes: Question[] = questionsData?.map(q => {
        const voteA = voteTotals?.find(v => v.question_id === q.id && v.option === 'option_a');
        const voteB = voteTotals?.find(v => v.question_id === q.id && v.option === 'option_b');
        
        return {
          ...q,
          votes_a: voteA?.count || 0,
          votes_b: voteB?.count || 0
        };
      }) || [];

      setQuestions(questionsWithVotes);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError('Erro ao carregar perguntas');
      
      // Fallback to empty array on error
      setQuestions([]);
      
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar as perguntas. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Submit a vote
  const submitVote = async (questionId: string, option: 'option_a' | 'option_b') => {
    try {
      // Check if user already voted
      if (hasUserVoted(questionId)) {
        toast({
          title: "Voto já registrado",
          description: "Você já votou nesta pergunta!",
          variant: "destructive"
        });
        return false;
      }

      const sessionId = getSessionId();

      // Insert vote
      const { error } = await supabase
        .from('vote_log')
        .insert([{
          question_id: questionId,
          option,
          session_id: sessionId
        }]);

      if (error) throw error;

      // Mark as voted locally with the chosen option
      markAsVoted(questionId, option);

      // Update local state optimistically
      setQuestions(prev => prev.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            votes_a: option === 'option_a' ? q.votes_a + 1 : q.votes_a,
            votes_b: option === 'option_b' ? q.votes_b + 1 : q.votes_b
          };
        }
        return q;
      }));

      // Track successful vote with PostHog
      const question = questions.find(q => q.id === questionId);
      posthog.capture('vote_submitted', {
        question_id: questionId,
        option: option === 'option_a' ? 'sim' : 'nao',
        category: question?.category || 'unknown',
        question_text: question?.question_text || 'unknown'
      });

      toast({
        title: "Voto registrado!",
        description: "Seu palpite foi salvo com sucesso.",
      });

      return true;
    } catch (err) {
      console.error('Error submitting vote:', err);
      
      toast({
        title: "Erro ao votar",
        description: "Não foi possível registrar seu voto. Tente novamente.",
        variant: "destructive"
      });
      
      return false;
    }
  };

  // Refresh vote counts from server
  const refreshVoteCounts = async () => {
    try {
      const { data: voteTotals, error } = await supabase
        .from('vote_totals')
        .select('*');

      if (error) throw error;

      setQuestions(prev => prev.map(q => {
        const voteA = voteTotals?.find(v => v.question_id === q.id && v.option === 'option_a');
        const voteB = voteTotals?.find(v => v.question_id === q.id && v.option === 'option_b');
        
        return {
          ...q,
          votes_a: voteA?.count || 0,
          votes_b: voteB?.count || 0
        };
      }));
    } catch (err) {
      console.error('Error refreshing vote counts:', err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return {
    questions,
    loading,
    error,
    submitVote,
    hasUserVoted,
    getUserVote,
    refreshVoteCounts,
    refetch: fetchQuestions
  };
};