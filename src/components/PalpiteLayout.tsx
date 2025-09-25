import { ReactNode, useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { getCategoryIcon, getCategoryName } from "../data/palpiteData";
import palpiteLogo from "../assets/palpite-logo.svg";
import { Input } from "./ui/input";
import { useIsMobile } from "../hooks/use-mobile";
import { Link } from "react-router-dom";

interface PalpiteLayoutProps {
  children: ReactNode;
  onCategoryChange?: (category: Category) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

type Category = 'todos' | 'futebol' | 'politica' | 'celebridades' | 'televisao';

export const PalpiteLayout = ({ 
  children, 
  onCategoryChange, 
  searchTerm, 
  onSearchChange 
}: PalpiteLayoutProps) => {
  const [activeCategory, setActiveCategory] = useState<Category>('todos');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const isMobile = useIsMobile();
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
            {/* Logo */}
            <div className="flex items-center">
              <img src={palpiteLogo} alt="Palpite" className="h-8" />
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
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => {
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="palpite-grid">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 text-center border-t border-border">
        <p className="text-sm text-muted-foreground">
          Palpite • Onde as opiniões ganham vida •{" "}
          <Link 
            to="/sobre" 
            className="text-white/70 hover:text-white hover:underline transition-colors ml-1"
          >
            Sobre nós
          </Link>
        </p>
      </footer>
    </div>
  );
};