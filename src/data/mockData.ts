export interface VoteQuestion {
  id: string;
  question: string;
  optionA: string;
  optionB: string;
  votesA: number;
  votesB: number;
  category: string;
  emoji: string;
}

export const mockQuestions: VoteQuestion[] = [
  {
    id: "1",
    question: "👀 O casal X vai terminar até o fim do mês?",
    optionA: "Com certeza 💔",
    optionB: "Nunca 😘",
    votesA: 247,
    votesB: 183,
    category: "Relacionamentos",
    emoji: "💕"
  },
  {
    id: "2", 
    question: "🤔 Neymar posta indireta hoje?",
    optionA: "Óbvio 😂",
    optionB: "Duvido 🤨",
    votesA: 412,
    votesB: 89,
    category: "Celebridades",
    emoji: "⚽"
  },
  {
    id: "3",
    question: "🍕 Pineapple na pizza é aceitável?",
    optionA: "Crime culinário 🚫",
    optionB: "Delicioso 😋",
    votesA: 321,
    votesB: 279,
    category: "Comida",
    emoji: "🍍"
  },
  {
    id: "4",
    question: "📱 Seu chefe responde WhatsApp após 18h?",
    optionA: "Sempre 😭",
    optionB: "Nunca 🙏",
    votesA: 156,
    votesB: 344,
    category: "Trabalho",
    emoji: "💼"
  },
  {
    id: "5",
    question: "🎬 A Marvel ainda consegue surpreender?",
    optionA: "Perdeu a magia ✨",
    optionB: "Sempre épica 🔥",
    votesA: 189,
    votesB: 267,
    category: "Entretenimento",
    emoji: "🦸"
  },
  {
    id: "6",
    question: "☕ Café com açúcar é válido?",
    optionA: "Claro que sim 🤤",
    optionB: "Só amargo 💪",
    votesA: 387,
    votesB: 213,
    category: "Estilo de Vida",
    emoji: "☕"
  }
];

export const getRandomQuestions = (count: number = 10): VoteQuestion[] => {
  const shuffled = [...mockQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, mockQuestions.length));
};