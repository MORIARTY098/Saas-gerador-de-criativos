import React, { useState } from 'react';
import { Layers, Settings, ChevronRight, FileText } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { useAuth } from '../contexts/AuthContext';

export default function CarouselGenerator() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputText, setInputText] = useState(`**H1** Encontre o Lar dos Seus Sonhos\n\n**Body** Procurando o imóvel ideal para sua família? Descubra um espaço que combina conforto e praticidade em cada detalhe.\n\n**CTA** SAIBA MAIS`);
  const [slides, setSlides] = useState<{headline: string, body: string, cta?: string}[]>([]);

  const handleGenerate = async () => {
    if (!user) {
      console.error("Você precisa estar logado para gerar carrosséis.");
      return;
    }

    if (!inputText.trim()) {
      console.error("Por favor, insira o conteúdo do carrossel.");
      return;
    }

    setIsGenerating(true);
    
    try {
      // @ts-ignore
      const apiKey = process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Transform the following text into a carousel presentation. Break it down into 3 to 7 slides. Each slide should have a short headline, a body text, and optionally a CTA for the last slide.\n\nText:\n${inputText}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING, description: "A short, catchy headline for the slide." },
                body: { type: Type.STRING, description: "The main text content for the slide." },
                cta: { type: Type.STRING, description: "Call to action text. Usually only on the last slide." }
              },
              required: ["headline", "body"]
            }
          }
        }
      });

      const generatedSlides = JSON.parse(response.text || '[]');
      if (generatedSlides.length > 0) {
        setSlides(generatedSlides);
        setStep(2);
      } else {
        throw new Error("Nenhum slide gerado.");
      }
    } catch (error) {
      console.error("Error generating carousel:", error);
      console.error("Erro ao gerar carrossel. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (step === 2) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Carrossel Gerado</h1>
          <button onClick={() => setStep(1)} className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
            Voltar
          </button>
        </div>
        
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-8 flex items-center justify-center min-h-[500px] relative overflow-hidden">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory w-full pb-4 scrollbar-hide">
            {slides.map((slide, idx) => (
              <div key={idx} className="shrink-0 w-[300px] aspect-[4/5] bg-gradient-to-br from-blue-900 to-blue-950 rounded-xl snap-center relative border border-white/10 flex flex-col p-6">
                <div className="text-blue-400 text-sm font-bold mb-4">0{idx + 1}</div>
                <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
                  {slide.headline}
                </h2>
                <p className="text-blue-100/80 text-sm">
                  {slide.body}
                </p>
                {slide.cta && (
                  <button className="mt-auto w-full py-3 bg-white text-blue-900 font-bold rounded-lg">
                    {slide.cta}
                  </button>
                )}
                {!slide.cta && (
                  <div className="mt-auto flex justify-end">
                    <ChevronRight className="w-6 h-6 text-white/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)] lg:h-[calc(100vh-8rem)]">
      {/* Left Sidebar - Settings */}
      <div className="w-full lg:w-1/3 bg-[#111111] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/5 font-bold flex items-center gap-2">
          <Settings className="w-4 h-4 text-orange-500" /> Configuração
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Nome do Carrossel</label>
            <input type="text" defaultValue="Novo Carrossel" className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Formato</label>
            <select className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-orange-500 outline-none appearance-none">
              <option>Feed (1080x1350)</option>
              <option>Quadrado (1080x1080)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-orange-500" />
              <h3 className="font-bold">Conteúdo do Carrossel</h3>
            </div>
            <textarea 
              className="w-full h-48 bg-[#0a0a0a] border border-white/10 rounded-lg p-3 text-sm focus:border-orange-500 outline-none resize-none"
              placeholder="Cole seu texto aqui..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-orange-500" />
              <h3 className="font-bold">Estilo Visual</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button className="bg-orange-500/20 border border-orange-500 text-orange-500 rounded-lg py-2 text-sm font-medium">Estilo Manual</button>
              <button className="bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg py-2 text-sm font-medium transition-colors">Referência</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Estilo do Carrossel</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3 cursor-pointer hover:border-white/30">
                    <div className="font-bold text-sm mb-1">Clean / Abstrato</div>
                    <div className="text-[10px] text-gray-500 leading-tight">Gradientes, texturas, fundo limpo</div>
                  </div>
                  <div className="bg-orange-500/10 border border-orange-500 rounded-lg p-3 cursor-pointer">
                    <div className="font-bold text-sm text-orange-500 mb-1">Foto no Fundo</div>
                    <div className="text-[10px] text-orange-200/50 leading-tight">Imagem de fundo com overlay</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">Cores e Texto</label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-xs mb-1">Texto Principal</div>
                    <div className="h-8 rounded bg-white border border-white/20 flex items-center justify-center text-black text-xs font-mono">#FFFFFF</div>
                  </div>
                  <div>
                    <div className="text-xs mb-1">Destaque</div>
                    <div className="h-8 rounded bg-[#ff4e00] border border-white/20 flex items-center justify-center text-white text-xs font-mono">#FF4E00</div>
                  </div>
                  <div>
                    <div className="text-xs mb-1">Fundo</div>
                    <div className="h-8 rounded bg-[#0f172a] border border-white/20 flex items-center justify-center text-white text-xs font-mono">#0F172A</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-[#0a0a0a]">
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? 'Gerando...' : 'Gerar Páginas'}
          </button>
        </div>
      </div>

      {/* Right Area - Preview/Editor */}
      <div className="flex-1 bg-[#111111] border border-white/5 rounded-2xl flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <Layers className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>Preencha as configurações ao lado e clique em "Gerar Páginas"</p>
        </div>
      </div>
    </div>
  );
}
