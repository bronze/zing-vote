import { FeedLayout } from "../components/FeedLayout";
import { VoteCard } from "../components/VoteCard";
import { getRandomQuestions } from "../data/mockData";
import { useState, useEffect } from "react";

const Index = () => {
  const [questions, setQuestions] = useState(getRandomQuestions(6));

  const handleVote = (questionId: string, option: 'A' | 'B') => {
    console.log(`Vote registered: Question ${questionId}, Option ${option}`);
    // Here you would typically update the database
    // For now, we just log the vote
  };

  const refreshFeed = () => {
    setQuestions(getRandomQuestions(6));
  };

  return (
    <FeedLayout>
      {questions.map((question) => (
        <VoteCard 
          key={question.id} 
          question={question} 
          onVote={handleVote}
        />
      ))}
      
      {/* Refresh button for demo purposes */}
      <div className="mt-8 text-center">
        <button 
          onClick={refreshFeed}
          className="px-6 py-3 bg-accent hover:bg-accent/80 text-accent-foreground font-semibold rounded-xl transition-all duration-300 hover:scale-105"
        >
          🔄 Novas perguntas
        </button>
      </div>
    </FeedLayout>
  );
};

export default Index;
