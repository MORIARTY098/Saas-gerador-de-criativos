import React, { useState } from 'react';
import { Image as ImageIcon, Type, Zap, ChevronRight } from 'lucide-react';

export default function Demo({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh]">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 text-orange-500 rounded-full text-sm font-bold mb-8 border border-orange-500/30">
        <Zap className="w-4 h-4" /> Modo Demonstração
      </div>
      
      <h1 className="text-4xl font-bold mb-4 text-center">Experimente Criar seu<br/>Primeiro Criativo</h1>
      <p className="text-gray-400 mb-12 text-center max-w-lg">
        Veja na prática como funciona. Arraste uma foto, edite os textos e veja a mágica acontecer!
      </p>

      <div className="w-full max-w-2xl bg-[#111111] border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 space-y-6">
          <div className={`flex gap-4 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
              <ImageIcon className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg">1. Escolha uma Foto</h3>
              <p className="text-sm text-gray-400">Arraste uma foto de expert para a área de destino</p>
            </div>
          </div>
          
          <div className={`flex gap-4 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
              <Type className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg">2. Edite os Textos</h3>
              <p className="text-sm text-gray-400">Personalize headline, subtítulo e CTA</p>
            </div>
          </div>

          <div className={`flex gap-4 ${step >= 3 ? 'opacity-100' : 'opacity-40'}`}>
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-lg">3. Veja o Resultado</h3>
              <p className="text-sm text-gray-400">Assista a IA combinar tudo em um criativo profissional</p>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('fast-generation')}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-4"
          >
            Começar Demonstração <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full md:w-64 aspect-[4/5] bg-[#0a0a0a] rounded-2xl border border-white/10 overflow-hidden relative">
          {/* Mock Template Reference */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black p-4 flex flex-col justify-between">
            <div className="flex justify-between items-center text-white/80">
              <span className="text-xs font-medium">Instagram</span>
              <div className="flex gap-2">
                <div className="w-4 h-4 rounded-full border border-white/50"></div>
                <div className="w-4 h-4 rounded-full border border-white/50"></div>
              </div>
            </div>
            <div className="text-center mt-auto">
              <h4 className="font-serif italic text-xl mb-2 text-white/90">O método mais prático<br/>de produzir seus</h4>
              <h2 className="text-3xl font-bold text-white mb-2">Criativos</h2>
              <p className="text-[10px] text-white/60">Depois que você usar essa ferramenta nunca mais você vai querer criar manualmente.</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/80 backdrop-blur-sm text-center text-xs text-gray-400 border-t border-white/10">
            Template de Referência
          </div>
        </div>
      </div>
    </div>
  );
}
