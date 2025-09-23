import { useEffect, useState } from "react";

interface ResultBarProps {
  optionA: string;
  optionB: string;
  votesA: number;
  votesB: number;
  userVote?: 'A' | 'B';
  animate?: boolean;
}

export const ResultBar = ({ 
  optionA, 
  optionB, 
  votesA, 
  votesB, 
  userVote,
  animate = true 
}: ResultBarProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const totalVotes = votesA + votesB;
  const percentageA = totalVotes > 0 ? (votesA / totalVotes) * 100 : 50;
  const percentageB = totalVotes > 0 ? (votesB / totalVotes) * 100 : 50;

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [animate]);

  return (
    <div className="space-y-4 teste">
      {/* Option A Result */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${userVote === 'A' ? 'text-vote-option-a font-bold' : 'text-muted-foreground'}`}>
            {optionA} {userVote === 'A' && '✓'}
          </span>
          <span className="text-sm font-bold text-vote-option-a">
            {percentageA.toFixed(0)}%
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full result-bar-a transition-all duration-700 ease-out ${
              isAnimating ? 'animate-pulse' : ''
            }`}
            style={{ 
              width: animate && isAnimating ? `${percentageA}%` : animate ? '0%' : `${percentageA}%` 
            }}
          />
        </div>
        <div className="text-xs text-muted-foreground text-right">
          {votesA.toLocaleString()} voto{votesA !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Option B Result */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${userVote === 'B' ? 'text-vote-option-b font-bold' : 'text-muted-foreground'}`}>
            {optionB} {userVote === 'B' && '✓'}
          </span>
          <span className="text-sm font-bold text-vote-option-b">
            {percentageB.toFixed(0)}%
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className={`h-full result-bar-b transition-all duration-700 ease-out delay-100 ${
              isAnimating ? 'animate-pulse' : ''
            }`}
            style={{ 
              width: animate && isAnimating ? `${percentageB}%` : animate ? '0%' : `${percentageB}%` 
            }}
          />
        </div>
        <div className="text-xs text-muted-foreground text-right">
          {votesB.toLocaleString()} voto{votesB !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Total votes */}
      <div className="text-center pt-2 border-t border-border">
        <span className="text-xs text-muted-foreground">
          Total: {totalVotes.toLocaleString()} votos
        </span>
      </div>
    </div>
  );
};