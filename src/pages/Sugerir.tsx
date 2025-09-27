import React from 'react';
import { PalpiteLayout } from '../components/PalpiteLayout';

const Sugerir = () => {
  return (
    <PalpiteLayout 
      searchTerm="" 
      onSearchChange={() => {}}
      useGrid={false}
    >
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Sugira um tópico de pergunta 🧠
          </h1>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-4 md:p-8">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSc7yjuzdHP5wo8yZAeiYX-1lsV5OnFE5WewVpfCDMUQNnsa-A/viewform?embedded=true"
              width="100%"
              height="800"
              className="w-full rounded-xl border-none"
              title="Formulário de Sugestão de Tópicos"
            >
              Carregando formulário...
            </iframe>
          </div>
        </div>
      </div>
    </PalpiteLayout>
  );
};

export default Sugerir;