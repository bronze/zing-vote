import React from 'react';
import { Link } from 'react-router-dom';

const Sobre = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{
      background: 'radial-gradient(83.86% 47.1% at 49.87% -20.31%, #2BB6C2 0%, #012F33 100%)'
    }}>
      {/* Header with back navigation */}
      <header className="p-6">
        <Link 
          to="/" 
          className="text-white/70 hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </Link>
      </header>

      {/* Main content - centered */}
      <main className="sobre flex-1 flex items-center justify-center px-6 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Sobre nós
          </h1>
          
          <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 md:p-12">
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Somos um time de estudantes de <a href="https://somostera.com/mba-lideranca-estrategia-produtos-digitais">MBA</a> da <a href="https://somostera.com/">Tera</a>, unidos pela paixão por inovação e pelo potencial da inteligência coletiva. Com o objetivo de transformar ideias em soluções tangíveis, estamos empolgados em apresentar e testar nosso primeiro produto, um MVP (Produto Mínimo Viável). Este projeto é mais do que apenas um teste de mercado; é uma oportunidade de aprendizado para nós. Cada interação, feedback e resultado nos ajuda a entender melhor as necessidades do nosso público e a refinar nossa visão, permitindo-nos construir algo verdadeiramente valioso e significativo. Agradecemos por fazer parte desta jornada de crescimento e co-criação.
            </p>
            
            {/* Future placeholders - commented for now */}
            {/*
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-white mb-6">Nosso Time</h2>
              // Lista com nomes dos membros
              // Fotos do grupo
              // Links para LinkedIn
            </div>
            */}
          </div>
        </div>
      </main>

      {/* Simple footer */}
      <footer className="text-center text-white/70 text-sm py-6">
        Palpite — Onde as opiniões ganham vida
      </footer>
    </div>
  );
};

export default Sobre;