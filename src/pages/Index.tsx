import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { PalpiteLayout } from "../components/PalpiteLayout";
import { PalpiteCard } from "../components/PalpiteCard";
import { useQuestions } from "../hooks/useQuestions";

type Category = 'todos' | 'futebol' | 'politica' | 'celebridades' | 'televisao';

const Index = () => {
  const { questions, loading, error, submitVote, hasUserVoted } = useQuestions();
  const [selectedCategory, setSelectedCategory] = useState<Category>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuestions = useMemo(() => {
    let filtered = questions;
    
    // Filter by category
    if (selectedCategory !== 'todos') {
      filtered = filtered.filter(question => 
        question.category.toLowerCase() === selectedCategory
      );
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(question =>
        question.question_text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [questions, selectedCategory, searchTerm]);

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

  const getEmptyMessage = () => {
    if (questions.length === 0) {
      return "Nenhuma pergunta encontrada.";
    }
    if (searchTerm.trim() && selectedCategory !== 'todos') {
      return `Nenhuma pergunta encontrada para "${searchTerm}" na categoria selecionada.`;
    }
    if (searchTerm.trim()) {
      return `Nenhuma pergunta encontrada para "${searchTerm}".`;
    }
    return "Nenhuma pergunta nesta categoria.";
  };

  if (loading) {
    return (
      <PalpiteLayout 
        onCategoryChange={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      >
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-muted-foreground">Carregando perguntas...</div>
        </div>
      </PalpiteLayout>
    );
  }

  if (error) {
    return (
      <PalpiteLayout 
        onCategoryChange={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      >
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-red-500">Erro ao carregar perguntas. Tente recarregar a página.</div>
        </div>
      </PalpiteLayout>
    );
  }

  if (filteredQuestions.length === 0 && !loading) {
    return (
      <PalpiteLayout 
        onCategoryChange={setSelectedCategory}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      >
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-muted-foreground">
            {getEmptyMessage()}
          </div>
        </div>
      </PalpiteLayout>
    );
  }

  return (
    <PalpiteLayout 
      onCategoryChange={setSelectedCategory}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    >
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
