import { ReactNode, useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { getCategoryIcon, getCategoryName } from "../data/palpiteData";
import palpiteLogo from "../assets/palpite-logo.svg";
import { Input } from "./ui/input";
import { useIsMobile } from "../hooks/use-mobile";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { posthog } from "../lib/posthog";

interface PalpiteLayoutProps {
  children: ReactNode;
  onCategoryChange?: (category: Category) => void;
  onVoteStatusChange?: (status: VoteStatus) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  useGrid?: boolean;
}

type Category = 'todos' | 'futebol' | 'politica' | 'celebridades' | 'televisao';
type VoteStatus = 'todos' | 'nao_votei' | 'ja_votei';

export const PalpiteLayout = ({ 
  children, 
  onCategoryChange, 
  onVoteStatusChange,
  searchTerm, 
  onSearchChange,
  useGrid = true
}: PalpiteLayoutProps) => {
  const [activeCategory, setActiveCategory] = useState<Category>('todos');
  const [activeVoteStatus, setActiveVoteStatus] = useState<VoteStatus>('todos');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearchInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearchInput]);

  const handleSearchToggle = () => {
    if (showSearchInput) {
      setShowSearchInput(false);
      onSearchChange('');
    } else {
      setShowSearchInput(true);
    }
  };

  const categories: { key: Category; label: string; icon?: string }[] = [
    { key: 'todos', label: 'Todos', icon: '🌟' },
    { key: 'futebol', label: getCategoryName('futebol'), icon: getCategoryIcon('futebol') },
    { key: 'politica', label: getCategoryName('politica'), icon: getCategoryIcon('politica') },
    { key: 'celebridades', label: getCategoryName('celebridades'), icon: getCategoryIcon('celebridades') },
    { key: 'televisao', label: getCategoryName('televisao'), icon: getCategoryIcon('televisao') }
  ];

  const voteStatusOptions: { key: VoteStatus; label: string; icon?: string }[] = [
    { key: 'todos', label: 'Todos', icon: '📊' },
    { key: 'nao_votei', label: 'Ainda não votei', icon: '🔘' },
    { key: 'ja_votei', label: 'Já votei', icon: '✅' }
  ];

  const getCategoryActiveClass = (category: Category) => {
    switch (category) {
      case 'futebol':
        return 'bg-blue-500/20 text-blue-400 font-semibold';
      case 'politica':
        return 'bg-orange-500/20 text-orange-400 font-semibold';
      case 'celebridades':
        return 'bg-yellow-500/20 text-yellow-400 font-semibold';
      case 'televisao':
        return 'bg-purple-500/20 text-purple-400 font-semibold';
      default:
        return 'bg-primary/20 text-primary font-semibold';
    }
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <header className="backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-6">
              <Link 
                to="/"
              >
                <img src={palpiteLogo} alt="Palpite" className="h-8" />
              </Link>
              
              {/* <Link 
                to="/sobre" 
                className="text-sm font-semibold text-nav hover:text-foreground transition-colors"
              >
                Sobre nós
              </Link> */}
            </div>

            {/* Search */}
            <div className="flex items-center gap-2">
              {showSearchInput ? (
                <div className="flex items-center gap-2 animate-fade-in">
                  <div className="relative">
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Digite para buscar..."
                      value={searchTerm}
                      onChange={(e) => onSearchChange(e.target.value)}
                      className={`
                        bg-voteTrack border-0 placeholder:text-gray-400 
                        focus:ring-2 focus:ring-primary transition-all duration-300 ease-in-out
                        ${isMobile ? 'w-48' : 'w-72'}
                      `}
                      style={{ color: '#0A191A' }}
                    />
                  </div>
                  <button
                    onClick={handleSearchToggle}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleSearchToggle}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <Search className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide" data-attr="filters">
            {categories.map((category) => (
              <button
                key={category.key}
                data-ph-capture-attribute-nav={category.key}
                onClick={() => {
                  // Track category selection
                  posthog.capture('category_selected', {
                    category_selected_key: category.key,
                    category_selected_label: category.label
                  });
                  
                  // Se não estiver na página principal, navegar para ela primeiro
                  if (location.pathname !== '/') {
                    navigate('/');
                  }
                  setActiveCategory(category.key);
                  onCategoryChange?.(category.key);
                }}
                className={`
                  px-4 py-2 rounded-lg whitespace-nowrap flex items-center space-x-2 transition-all
                  ${activeCategory === category.key 
                    ? getCategoryActiveClass(category.key)
                    : 'text-nav bg-[#427378]/50 hover:text-foreground hover:bg-secondary/40'
                  }
                `}
              >
                <span>{category.icon}</span>
                <span className="text-sm">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Vote Status Navigation */}
      <nav className="backdrop-blur-sm border-t border-border/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {voteStatusOptions.map((status) => (
              <button
                key={status.key}
                data-ph-capture-attribute-vote-filter={status.key}
                onClick={() => {
                  posthog.capture('vote_status_filter_selected', {
                    vote_status_filter_key: status.key,
                    vote_status_filter_label: status.label
                  });
                  
                  setActiveVoteStatus(status.key);
                  onVoteStatusChange?.(status.key);
                }}
                className={`
                  px-4 py-2 rounded-lg whitespace-nowrap flex items-center space-x-2 transition-all
                  ${activeVoteStatus === status.key 
                    ? 'bg-white/10 text-white font-semibold'
                    : 'text-nav bg-[#427378]/30 hover:text-foreground hover:bg-secondary/40'
                  }
                `}
              >
                <span>{status.icon}</span>
                <span className="text-sm">{status.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {useGrid ? (
          <div className="palpite-grid">
            {children}
          </div>
        ) : (
          children
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 text-center text-sm text-muted-foreground">
        {/* linha 1: links */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-6 justify-center items-center">
          <p>
            <Link
              to="/sobre"
              className="text-white/70 hover:text-white hover:underline transition-colors"
            >
              Sobre nós
            </Link>
          </p>
          <p>•</p>
          <p>
            <Link
              to="/sugerir"
              className="text-white/70 hover:text-white hover:underline transition-colors"
            >
              Sugira um tópico
            </Link>
          </p>
        </div>
      
        {/* ponto extra só no mobile */}
        <div className="block md:hidden">•</div>
      
        {/* linha 2: tagline */}
        <div className="flex flex-col md:flex-row gap-2 md:gap-6 justify-center items-center mt-2">
          <p>Palpite</p>
          <p>•</p>
          <p>Onde as opiniões ganham vida</p>
        </div>
      </footer>

    </div>
  );
};