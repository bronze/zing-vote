import { useState } from "react";

interface VoteOptionsProps {
  optionA: string;
  optionB: string;
  onVote: (option: 'A' | 'B') => void;
  disabled?: boolean;
}

export const VoteOptions = ({ optionA, optionB, onVote, disabled = false }: VoteOptionsProps) => {
  const [votedOption, setVotedOption] = useState<'A' | 'B' | null>(null);

  const handleVote = (option: 'A' | 'B') => {
    if (disabled || votedOption) return;
    
    setVotedOption(option);
    setTimeout(() => {
      onVote(option);
    }, 300);
  };

  return (
    <div className="space-y-3">
      <button
        onClick={() => handleVote('A')}
        disabled={disabled || votedOption !== null}
        className={`
          w-full p-4 rounded-xl font-semibold text-sm 
          vote-button vote-button-a
          disabled:opacity-50 disabled:cursor-not-allowed
          ${votedOption === 'A' ? 'vote-success' : ''}
          ${votedOption && votedOption !== 'A' ? 'opacity-50' : ''}
        `}
      >
        {optionA}
      </button>
      
      <button
        onClick={() => handleVote('B')}
        disabled={disabled || votedOption !== null}
        className={`
          w-full p-4 rounded-xl font-semibold text-sm
          vote-button vote-button-b
          disabled:opacity-50 disabled:cursor-not-allowed
          ${votedOption === 'B' ? 'vote-success' : ''}
          ${votedOption && votedOption !== 'B' ? 'opacity-50' : ''}
        `}
      >
        {optionB}
      </button>
    </div>
  );
};