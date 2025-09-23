export interface PalpiteQuestion {
  id: string;
  question: string;
  votesA: number;
  votesB: number;
  category: 'futebol' | 'politica' | 'celebridades' | 'televisao';
  profileImage: string;
  isOpen: boolean;
}

export const palpiteQuestions: PalpiteQuestion[] = [
  {
    id: "1",
    question: "Trump morre em 2025?",
    votesA: 247,
    votesB: 183,
    category: "politica",
    profileImage: "https://images.unsplash.com/photo-1560561728-1dfcc6a6d8b3?w=100&h=100&fit=crop&crop=face",
    isOpen: true
  },
  {
    id: "2", 
    question: "Neymar vai ser escalado para a seleção brasileira em 2025?",
    votesA: 67,
    votesB: 269,
    category: "futebol",
    profileImage: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&h=100&fit=crop&crop=face",
    isOpen: true
  },
  {
    id: "3",
    question: "Hytalo Santos sai da cadeia em 2025?",
    votesA: 321,
    votesB: 279,
    category: "celebridades",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    isOpen: true
  },
  {
    id: "4",
    question: "Bolsonaro vai para a cadeia em 2025?",
    votesA: 586,
    votesB: 29,
    category: "politica",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    isOpen: true
  },
  {
    id: "5",
    question: "Will Smith vai dar um soco no apresentador do próximo Oscar?",
    votesA: 189,
    votesB: 267,
    category: "celebridades",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    isOpen: true
  },
  {
    id: "6",
    question: "Neymar vai ser escalado para a seleção brasileira em 2025?",
    votesA: 67,
    votesB: 269,
    category: "futebol",
    profileImage: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=100&h=100&fit=crop&crop=face",
    isOpen: true
  },
  {
    id: "7",
    question: "Trump morre em 2025?",
    votesA: 247,
    votesB: 183,
    category: "politica",
    profileImage: "https://images.unsplash.com/photo-1560561728-1dfcc6a6d8b3?w=100&h=100&fit=crop&crop=face",
    isOpen: true
  },
  {
    id: "8",
    question: "Hytalo Santos sai da cadeia em 2025?",
    votesA: 321,
    votesB: 279,
    category: "celebridades",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    isOpen: true
  },
  {
    id: "9",
    question: "Bolsonaro vai para a cadeia em 2025?",
    votesA: 586,
    votesB: 29,
    category: "politica",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    isOpen: true
  },
  {
    id: "10",
    question: "Will Smith vai dar um soco no apresentador do próximo Oscar?",
    votesA: 189,
    votesB: 267,
    category: "televisao",
    profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    isOpen: true
  }
];

export const getCategoryIcon = (category: PalpiteQuestion['category']) => {
  const icons = {
    futebol: '⚽',
    politica: '🏛️',
    celebridades: '⭐',
    televisao: '📺'
  };
  return icons[category];
};

export const getCategoryName = (category: PalpiteQuestion['category']) => {
  const names = {
    futebol: 'Futebol',
    politica: 'Política', 
    celebridades: 'Celebridades',
    televisao: 'Televisão'
  };
  return names[category];
};