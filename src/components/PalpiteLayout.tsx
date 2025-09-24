import { ReactNode, useState } from "react";
import { Bell, Search } from "lucide-react";
import { getCategoryIcon, getCategoryName } from "../data/palpiteData";
import palpiteLogo from "../assets/palpite-logo.svg";

interface PalpiteLayoutProps {
  children: ReactNode;
  onCategoryChange?: (category: Category) => void;
}

type Category = 'todos' | 'futebol' | 'politica' | 'celebridades' | 'televisao';

export const PalpiteLayout = ({ children, onCategoryChange }: PalpiteLayoutProps) => {
  const [activeCategory, setActiveCategory] = useState<Category>('todos');

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img src={palpiteLogo} alt="Palpite" className="h-8" />
            </div>

            {/* Search and notifications */}
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <Search className="w-5 h-5 text-muted-foreground" />
              </button>
              {/* <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
              </button> */}
            </div>
          </div>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="sticky top-[73px] z-40 bg-background/95 backdrop-blur-sm">
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
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
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
          Palpite • Onde as opiniões ganham vida
        </p>
      </footer>
    </div>
  );
};