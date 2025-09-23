import { ReactNode } from "react";
import { TrendingUp, Users, Zap } from "lucide-react";

interface FeedLayoutProps {
  children: ReactNode;
}

export const FeedLayout = ({ children }: FeedLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">VoteWave</h1>
                <p className="text-xs text-muted-foreground">Opiniões que viralizam</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">12.4K</span>
              </div>
              <div className="flex items-center space-x-1 text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Hot</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Feed Intro */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Feed de Opiniões 🔥
          </h2>
          <p className="text-muted-foreground">
            Vote nas perguntas mais polêmicas e veja o que todo mundo pensa!
          </p>
        </div>

        {/* Feed Content */}
        <div className="space-y-6">
          {children}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-primary hover:bg-primary-glow text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover:scale-105">
            Carregar mais perguntas ✨
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 text-center text-muted-foreground">
        <p className="text-sm">
          Feito com 💜 para quem ama opiniões controversas
        </p>
      </footer>
    </div>
  );
};