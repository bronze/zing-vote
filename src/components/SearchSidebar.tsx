import { X, Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isMobile: boolean;
}

export const SearchSidebar = ({ 
  isOpen, 
  onClose, 
  searchTerm, 
  onSearchChange,
  isMobile 
}: SearchSidebarProps) => {
  if (isMobile) {
    return (
      <>
        {/* Mobile Modal Overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
        />
        
        {/* Mobile Modal Content */}
        <div className={`
          fixed inset-x-0 top-0 z-50 transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : '-translate-y-full'}
        `}>
          <div className="bg-voteButtonBg border-b border-voteTrack p-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar perguntas..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10 bg-voteTrack border-0 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop Overlay */}
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Desktop Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full w-80 bg-voteButtonBg border-r border-voteTrack z-50
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Buscar Perguntas</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Digite para buscar..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-voteTrack border-0 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-primary"
              autoFocus
            />
          </div>
          
          {searchTerm && (
            <div className="mt-4 p-3 bg-voteTrack rounded-lg">
              <p className="text-sm text-gray-400">
                Buscando por: <span className="text-white font-medium">"{searchTerm}"</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};