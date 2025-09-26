import React from 'react';
import { PalpiteLayout } from '../components/PalpiteLayout';

const Sobre = () => {
  return (
    <PalpiteLayout 
      searchTerm="" 
      onSearchChange={() => {}}
      useGrid={false}
    >
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            Sobre nós
          </h1>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Somos um time de estudantes de <a href="https://somostera.com/mba-lideranca-estrategia-produtos-digitais" className="text-primary hover:underline">MBA</a> da <a href="https://somostera.com/" className="text-primary hover:underline">Tera</a>, unidos pela paixão por inovação e pelo potencial da inteligência coletiva. Com o objetivo de transformar ideias em soluções tangíveis, estamos empolgados em apresentar e testar nosso primeiro produto, um MVP (Produto Mínimo Viável).
            </p>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-6">
              Este projeto é mais do que apenas um teste de mercado; é uma oportunidade de aprendizado para nós. Cada interação, feedback e resultado nos ajuda a entender melhor as necessidades do nosso público e a refinar nossa visão, permitindo-nos construir algo verdadeiramente valioso e significativo.
            </p>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mt-6">
              Agradecemos por fazer parte desta jornada de crescimento e co-criação.
            </p>
          </div>
        </div>
      </div>
    </PalpiteLayout>
  );
};

export default Sobre;