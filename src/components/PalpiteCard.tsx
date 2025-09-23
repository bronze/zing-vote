import { useState } from "react";
import { PalpiteQuestion, getCategoryIcon, getCategoryName } from "../data/palpiteData";

interface PalpiteCardProps {
  question: PalpiteQuestion;
  onVote?: (questionId: string, vote: 'sim' | 'nao') => void;
}

export const PalpiteCard = ({ question, onVote }: PalpiteCardProps) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState<'sim' | 'nao' | null>(null);
  const [currentVotes, setCurrentVotes] = useState({
    votesA: question.votesA,
    votesB: question.votesB
  });

  const totalVotes = currentVotes.votesA + currentVotes.votesB;
  const percentageA = totalVotes > 0 ? (currentVotes.votesA / totalVotes) * 100 : 50;
  const percentageB = totalVotes > 0 ? (currentVotes.votesB / totalVotes) * 100 : 50;

  const handleVote = (vote: 'sim' | 'nao') => {
    if (hasVoted) return;

    setUserVote(vote);
    setHasVoted(true);
    
    // Update vote counts
    setCurrentVotes(prev => ({
      ...prev,
      [vote === 'sim' ? 'votesA' : 'votesB']: prev[vote === 'sim' ? 'votesA' : 'votesB'] + 1
    }));

    onVote?.(question.id, vote);
  };

  return (
    <div className="palpite-card p-4 space-y-4">
      {/* Header with category and status */}
      <div className="flex items-center justify-between">
        <div className={`category-badge category-${question.category}`}>
          <span>{getCategoryIcon(question.category)}</span>
          <span>{getCategoryName(question.category)}</span>
        </div>
        
        {question.isOpen && (
          <div className="status-aberto">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Em aberto</span>
          </div>
        )}
      </div>

      {/* Question with profile image */}
      <div className="flex items-start gap-3">
        <img 
          src={question.profileImage} 
          alt="Profile" 
          className="w-10 h-10 rounded-full object-cover"
        />
        <h3 className="text-sm font-medium text-foreground leading-relaxed flex-1">
          {question.question}
        </h3>
      </div>

      {/* Results or loading state */}
      {hasVoted ? (
        <div className="space-y-3">
          {/* Result bars */}
          <div className="result-container">
            <div 
              className="result-bar-sim transition-all duration-700 ease-out"
              style={{ width: `${percentageA}%` }}
            />
            <div 
              className="result-bar-nao transition-all duration-700 ease-out"
              style={{ width: `${percentageB}%` }}
            />
          </div>

          {/* Vote counts */}
          <div className="flex justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${userVote === 'sim' ? 'text-green-400' : 'text-muted-foreground'}`}>
                SIM • {percentageA.toFixed(0)}%
              </span>
              <span className="text-muted-foreground">
                {currentVotes.votesA.toLocaleString()} votos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                {currentVotes.votesB.toLocaleString()} votos
              </span>
              <span className={`font-semibold ${userVote === 'nao' ? 'text-red-400' : 'text-muted-foreground'}`}>
                {percentageB.toFixed(0)}% • NÃO
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Preview result bars (before voting) */}
          <div className="result-container">
            <div 
              className="result-bar-sim"
              style={{ width: `${percentageA}%` }}
            />
            <div 
              className="result-bar-nao"
              style={{ width: `${percentageB}%` }}
            />
          </div>

          {/* Vote counts */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>SIM • {percentageA.toFixed(0)}% • {currentVotes.votesA.toLocaleString()} votos</span>
            <span>{currentVotes.votesB.toLocaleString()} votos • {percentageB.toFixed(0)}% • NÃO</span>
          </div>
        </div>
      )}

      {/* Vote buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={() => handleVote('sim')}
          disabled={hasVoted}
          className="vote-button-sim flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Votar SIM
        </button>
        <button
          onClick={() => handleVote('nao')}
          disabled={hasVoted}
          className="vote-button-nao flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Votar NÃO
        </button>
      </div>
    </div>
  );
};