import { motion } from "framer-motion";
import { PalpiteLayout } from "../components/PalpiteLayout";
import { PalpiteCard } from "../components/PalpiteCard";
import { useQuestions } from "../hooks/useQuestions";

const Index = () => {
  const { questions, loading, error, submitVote, hasUserVoted } = useQuestions();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  if (loading) {
    return (
      <PalpiteLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-muted-foreground">Carregando perguntas...</div>
        </div>
      </PalpiteLayout>
    );
  }

  if (error) {
    return (
      <PalpiteLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-red-500">Erro ao carregar perguntas. Tente recarregar a página.</div>
        </div>
      </PalpiteLayout>
    );
  }

  if (questions.length === 0) {
    return (
      <PalpiteLayout>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-muted-foreground">Nenhuma pergunta encontrada.</div>
        </div>
      </PalpiteLayout>
    );
  }

  return (
    <PalpiteLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="contents"
      >
        {questions.map((question) => (
          <motion.div key={question.id} variants={itemVariants}>
            <PalpiteCard 
              question={question} 
              onVote={submitVote}
              hasUserVoted={hasUserVoted(question.id)}
            />
          </motion.div>
        ))}
      </motion.div>
    </PalpiteLayout>
  );
};

export default Index;
