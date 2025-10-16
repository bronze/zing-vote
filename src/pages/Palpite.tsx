import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { PalpiteLayout } from "../components/PalpiteLayout";
import { PalpiteCard } from "../components/PalpiteCard";
import { Question } from "../hooks/useQuestions";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { posthog } from "@/lib/posthog";

const Palpite = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      if (question) {
        setQuestion({
          ...question,
          votes_a: option === 'option_a' ? question.votes_a + 1 : question.votes_a,
          votes_b: option === 'option_b' ? question.votes_b + 1 : question.votes_b
        });
      }

      // Track successful vote with PostHog
      posthog.capture('vote_submitted', {
        vote_submitted_question_id: questionId,
        vote_submitted_option: option === 'option_a' ? 'sim' : 'nao',
        vote_submitted_category: question?.category || 'unknown',
        vote_submitted_question_text: question?.question_text || 'unknown',
        vote_submitted_source: 'dedicated_page'
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

  useEffect(() => {
    const fetchQuestion = async () => {
      if (!id) {
        setError("ID da pergunta não fornecido");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch the specific question
        const { data: questionData, error: questionError } = await supabase
          .from('questions')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (questionError) throw questionError;

        if (!questionData) {
          setError("Pergunta não encontrada");
          setLoading(false);
          return;
        }

        // Fetch vote totals for this question
        const { data: voteTotals, error: votesError } = await supabase
          .from('vote_totals')
          .select('*')
          .eq('question_id', id);

        if (votesError) throw votesError;

        // Combine data
        const voteA = voteTotals?.find(v => v.option === 'option_a');
        const voteB = voteTotals?.find(v => v.option === 'option_b');

        const questionWithVotes: Question = {
          ...questionData,
          votes_a: voteA?.count || 0,
          votes_b: voteB?.count || 0
        };

        setQuestion(questionWithVotes);

        // Track page view with PostHog
        posthog.capture('palpite_page_view', {
          question_id: id,
          question_text: questionData.question_text,
          category: questionData.category
        });
      } catch (err) {
        console.error('Error fetching question:', err);
        setError('Erro ao carregar pergunta');
        
        toast({
          title: "Erro ao carregar",
          description: "Não foi possível carregar a pergunta. Tente novamente.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [id]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Carregando... | Palpite</title>
        </Helmet>
        <PalpiteLayout useGrid={false}>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-muted-foreground">Carregando pergunta...</div>
          </div>
        </PalpiteLayout>
      </>
    );
  }

  if (error || !question) {
    return (
      <>
        <Helmet>
          <title>Pergunta não encontrada | Palpite</title>
        </Helmet>
        <PalpiteLayout useGrid={false}>
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="text-red-500 text-center">
              {error || "Pergunta não encontrada"}
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Voltar para página inicial
            </button>
          </div>
        </PalpiteLayout>
      </>
    );
  }

  const pageTitle = `${question.question_text} | Palpite`;
  const pageDescription = `Vote agora: ${question.option_a} ou ${question.option_b}? Veja o que as pessoas estão dizendo.`;
  const pageUrl = `https://palpite.lovable.app/palpite/${id}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Palpite" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={pageUrl} />
      </Helmet>

      <PalpiteLayout useGrid={false}>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <PalpiteCard 
              question={question}
              onVote={submitVote}
              hasUserVoted={hasUserVoted(question.id)}
              userVote={getUserVote(question.id)}
            />
          </motion.div>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Ver todas as perguntas
            </button>
          </div>
        </div>
      </PalpiteLayout>
    </>
  );
};

export default Palpite;
