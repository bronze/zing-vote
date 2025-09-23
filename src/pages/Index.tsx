import { PalpiteLayout } from "../components/PalpiteLayout";
import { PalpiteCard } from "../components/PalpiteCard";
import { palpiteQuestions } from "../data/palpiteData";

const Index = () => {
  const handleVote = (questionId: string, vote: 'sim' | 'nao') => {
    console.log(`Vote registered: Question ${questionId}, Vote ${vote}`);
    // Here you would typically update the database
  };

  return (
    <PalpiteLayout>
      {palpiteQuestions.map((question) => (
        <PalpiteCard 
          key={question.id} 
          question={question} 
          onVote={handleVote}
        />
      ))}
    </PalpiteLayout>
  );
};

export default Index;
