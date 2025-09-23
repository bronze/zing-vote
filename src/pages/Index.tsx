import { motion } from "framer-motion";
import { useState } from "react";
import { PalpiteLayout } from "../components/PalpiteLayout";
import { PalpiteCard } from "../components/PalpiteCard";
import { useQuestions } from "../hooks/useQuestions";

type Category = 'todos' | 'futebol' | 'politica' | 'celebridades' | 'televisao';

const Index = () => {
  const { questions, loading, error, submitVote, hasUserVoted } = useQuestions();
  const [selectedCategory, setSelectedCategory] = useState<Category>('todos');

  const filteredQuestions = selectedCategory === 'todos' 
    ? questions 
    : questions.filter(question => question.category.toLowerCase() === selectedCategory);

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
      <PalpiteLayout onCategoryChange={setSelectedCategory}>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-muted-foreground">Carregando perguntas...</div>
        </div>
      </PalpiteLayout>
    );
  }

  if (error) {
    return (
      <PalpiteLayout onCategoryChange={setSelectedCategory}>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-red-500">Erro ao carregar perguntas. Tente recarregar a página.</div>
        </div>
      </PalpiteLayout>
    );
  }

  if (filteredQuestions.length === 0 && !loading) {
    return (
      <PalpiteLayout onCategoryChange={setSelectedCategory}>
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-muted-foreground">
            {questions.length === 0 ? "Nenhuma pergunta encontrada." : "Nenhuma pergunta nesta categoria."}
          </div>
        </div>
      </PalpiteLayout>
    );
  }

  return (
    <PalpiteLayout onCategoryChange={setSelectedCategory}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="contents"
      >
        {filteredQuestions.map((question) => (
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
