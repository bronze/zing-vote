import { useState } from "react";
import { VoteOptions } from "./VoteOptions";
import { ResultBar } from "./ResultBar";
import { VoteQuestion } from "../data/mockData";

interface VoteCardProps {
  question: VoteQuestion;
  onVote?: (questionId: string, option: 'A' | 'B') => void;
}

export const VoteCard = ({ question, onVote }: VoteCardProps) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<'A' | 'B' | null>(null);
  const [currentVotes, setCurrentVotes] = useState({
    votesA: question.votesA,
    votesB: question.votesB
  });

  const handleVote = (option: 'A' | 'B') => {
    if (hasVoted) return;

    setUserVote(option);
    setHasVoted(true);
    
    // Update vote counts
    setCurrentVotes(prev => ({
      ...prev,
      [option === 'A' ? 'votesA' : 'votesB']: prev[option === 'A' ? 'votesA' : 'votesB'] + 1
    }));

    // Call parent callback if provided
    onVote?.(question.id, option);
  };

  return (
    <div className="vote-card bg-card border border-border rounded-2xl p-6 shadow-sm">
      {/* Category Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
          {question.category}
        </span>
        <span className="text-2xl">
          {question.emoji}
        </span>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-card-foreground leading-relaxed">
          {question.question}
        </h3>
      </div>

      {/* Vote Options or Results */}
      {!hasVoted ? (
        <VoteOptions 
          optionA={question.optionA}
          optionB={question.optionB}
          onVote={handleVote}
        />
      ) : (
        <ResultBar
          optionA={question.optionA}
          optionB={question.optionB}
          votesA={currentVotes.votesA}
          votesB={currentVotes.votesB}
          userVote={userVote || undefined}
          animate={true}
        />
      )}
    </div>
  );
};