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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">
            Sobre nós
          </h1>
          
          <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-12">
            <p className="text-lg md:text-xl text-foreground leading-relaxed">
              Somos estudantes do <a href="https://somostera.com/mba-lideranca-estrategia-produtos-digitais" className="text-primary hover:underline">MBA em Produtos Digitais</a> da <a href="https://somostera.com/" className="text-primary hover:underline">Tera</a>, unidos pela vontade de transformar ideias em experiências concretas. Este projeto nasceu da observação do crescimento das apostas online no Brasil, um mercado enorme, mas que vem acompanhado de desconfiança, dívidas e consequências negativas para muitas pessoas.
            </p>
            
            <p className="text-lg md:text-xl text-foreground leading-relaxed mt-6">
              Escolhemos seguir por outro caminho. Criamos o Palpite, um MVP que testa como a inteligência coletiva pode se manifestar de forma leve e divertida. A proposta é simples: trazer perguntas sobre esportes, cultura e atualidades e permitir que qualquer pessoa dê seu palpite e veja, em tempo real, como a opinião da comunidade se distribui.
            </p>

            <p className="text-lg md:text-xl text-foreground leading-relaxed mt-6">
              Aqui o valor não está em promessas de dinheiro fácil, mas no jogo social, na curiosidade e na conversa. Cada palpite é uma oportunidade de refletir, rir e descobrir como pensamos em conjunto.
            </p>
            
            <p className="text-lg md:text-xl text-foreground leading-relaxed mt-6">
              O Palpite é o primeiro passo de uma jornada que busca provar que é possível criar plataformas engajantes sem cair nos mesmos vícios do mercado de apostas, oferecendo uma alternativa saudável, transparente e divertida.
            </p>
          </div>
        </div>
      </div>
    </PalpiteLayout>
  );
};

export default Sobre;