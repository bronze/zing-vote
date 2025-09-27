import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCategoryIcon, getCategoryName } from "../data/palpiteData";
import { Question } from "../hooks/useQuestions";

interface PalpiteCardProps {
  question: Question;
  onVote?: (questionId: string, option: 'option_a' | 'option_b') => Promise<boolean>;
  hasUserVoted?: boolean;
  userVote?: 'option_a' | 'option_b' | null;
}

export const PalpiteCard = ({ question, onVote, hasUserVoted = false, userVote = null }: PalpiteCardProps) => {
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(hasUserVoted);
  const [currentUserVote, setCurrentUserVote] = useState<'option_a' | 'option_b' | null>(userVote);
  const [currentVotes, setCurrentVotes] = useState({
    votesA: question.votes_a,
    votesB: question.votes_b
  });

  const totalVotes = currentVotes.votesA + currentVotes.votesB;
  const percentageA = totalVotes > 0 ? (currentVotes.votesA / totalVotes) * 100 : 50;
  const percentageB = totalVotes > 0 ? (currentVotes.votesB / totalVotes) * 100 : 50;

  const handleVote = async (option: 'option_a' | 'option_b') => {
    if (hasVoted || isVoting || !question.is_open) return;

    setIsVoting(true);
    
    try {
      const success = await onVote?.(question.id, option);
      
      if (success) {
        setCurrentUserVote(option);
        setHasVoted(true);
        
        // Update local vote counts optimistically
        setCurrentVotes(prev => ({
          ...prev,
          votesA: option === 'option_a' ? prev.votesA + 1 : prev.votesA,
          votesB: option === 'option_b' ? prev.votesB + 1 : prev.votesB
        }));
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div 
      className="palpite-card p-4 space-y-4"
      data-ph-capture-attribute-card={question.question_text}
      data-ph-capture-attribute-category={question.category}
    >
      {/* Header with category and status */}
      <div className="flex items-center justify-between">
        <div className={`category-badge category-${question.category}`}>
          <span>{getCategoryIcon(question.category as any)}</span>
          <span>{getCategoryName(question.category as any)}</span>
        </div>
        
        {question.is_open && (
          <div className="status-aberto">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            <span>Em aberto</span>
          </div>
        )}
        
        {!question.is_open && (
          <div className="status-encerrada">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            <span>Encerrada</span>
          </div>
        )}
      </div>

      {/* Question with profile image */}
      <div className="flex items-start gap-3">
        <img 
          src={question.profile_image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'} 
          alt="Profile" 
          className="w-10 h-10 rounded-full object-cover"
        />
        <h3 className="text-sm font-medium text-foreground leading-relaxed flex-1">
          {question.question_text}
        </h3>
      </div>

      {/* Results or loading state */}
      {hasVoted ? (
        <div className="space-y-3">
          {/* Result bars */}
          <div className="result-container">
            <div 
              className="result-bar result-bar-sim transition-all duration-700 ease-out"
              style={{ width: `${percentageA}%` }}
            />
            <div 
              className="result-bar result-bar-nao transition-all duration-700 ease-out"
              style={{ width: `${percentageB}%` }}
            />
          </div>

          {/* Vote counts and percentages */}
          <div className="flex justify-between items-center text-xs">
            <div className="text-left">
              <span className={`font-semibold ${currentUserVote === 'option_a' ? 'text-vote-sim' : 'text-muted-foreground'}`}>
                <strong>{question.option_a}</strong> • {percentageA.toFixed(0)}%
              </span>
              <br />
              <span className="text-muted-foreground">
                {currentVotes.votesA.toLocaleString()} votos
              </span>
            </div>
            <div className="text-right">
              <span className={`font-semibold ${currentUserVote === 'option_b' ? 'text-vote-nao' : 'text-muted-foreground'}`}>
                 {percentageB.toFixed(0)}% • <strong>{question.option_b}</strong>
              </span>
              <br />
              <span className="text-muted-foreground">
                {currentVotes.votesB.toLocaleString()} votos
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Preview result bars (before voting) */}
          <div className="result-container">
            <div 
              className="result-bar result-bar-sim"
              style={{ width: `${percentageA}%` }}
            />
            <div 
              className="result-bar result-bar-nao"
              style={{ width: `${percentageB}%` }}
            />
          </div>

          {/* Vote counts and percentages */}
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <div className="text-left">
              <span><strong>{question.option_a}</strong> • {percentageA.toFixed(0)}%</span>
              <br />
              <span>{currentVotes.votesA.toLocaleString()} votos</span>
            </div>
            <div className="text-right">
              <span>{percentageB.toFixed(0)}% • <strong>{question.option_b}</strong></span>
              <br />
              <span>{currentVotes.votesB.toLocaleString()} votos</span>
            </div>
          </div>
        </div>
      )}

      {/* Vote buttons */}
      <div className="flex gap-2 pt-2">
        <motion.button
          onClick={() => handleVote('option_a')}
          disabled={hasVoted || isVoting || !question.is_open}
          className="vote-button flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={!hasVoted && !isVoting && question.is_open ? { scale: 1.05 } : {}}
          whileTap={!hasVoted && !isVoting && question.is_open ? { scale: 0.95 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {isVoting ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Votando...
            </motion.span>
          ) : (
            question.option_a
          )}
        </motion.button>
        <motion.button
          onClick={() => handleVote('option_b')}
          disabled={hasVoted || isVoting || !question.is_open}
          className="vote-button flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={!hasVoted && !isVoting && question.is_open ? { scale: 1.05 } : {}}
          whileTap={!hasVoted && !isVoting && question.is_open ? { scale: 0.95 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          {isVoting ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              Votando...
            </motion.span>
          ) : (
            question.option_b
          )}
        </motion.button>
      </div>
    </div>
  );
};