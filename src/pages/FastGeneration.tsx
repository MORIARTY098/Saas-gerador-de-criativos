import React, { useState } from 'react';
import { Image as ImageIcon, FileText, Settings, ChevronRight, Check, Plus, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

const parseCreatives = (text: string) => {
  const creatives = [];
  const blocks = text.split(/🔥\s*CRIATIVO/i).filter(b => b.trim().length > 0);
  
  // If no blocks found with the specific marker, treat the whole text as one creative
  if (blocks.length === 1 && !text.match(/🔥\s*CRIATIVO/i)) {
    return [{ headline: text.substring(0, 30) + '...', body: text }];
  }

  for (const block of blocks) {
    const headlineMatch = block.match(/\*\*Headline:\*\*\s*"([^"]+)"/i) || block.match(/Headline:\s*(.+)/i);
    const bodyMatch = block.match(/\*\*Body:\*\*\s*"([^"]+)"/i) || block.match(/Body:\s*(.+)/i);
    
    creatives.push({
      headline: headlineMatch ? headlineMatch[1] : 'Criativo',
      body: bodyMatch ? bodyMatch[1] : block.trim()
    });
  }
  return creatives;
};

export default function FastGeneration() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<{imageUrl: string, headline: string, body: string}[]>([]);
  const [inputText, setInputText] = useState(`🔥 CRIATIVO 1\n\n**Headline:** "O agro mudou."\n\n**Body:** "Quem vende como em 2015... ganha como em 2015."\n\n**CTA:** "Toque em Saiba Mais"`);

  const handleGenerate = async () => {
    if (!user) {
      console.error("Você precisa estar logado para gerar criativos.");
      return;
    }

    setIsGenerating(true);
    
    try {
      const creatives = parseCreatives(inputText);
      const generatedResults = [];
      
      // @ts-ignore
      const apiKey = process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      for (const creative of creatives) {
        const prompt = `A professional advertising background image for a marketing creative. Theme: ${creative.headline}. Style: modern, clean, high quality, no text, professional photography.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: prompt }]
          },
          config: {
            imageConfig: {
              aspectRatio: "3:4"
            }
          }
        });

        let imageUrl = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop'; // fallback
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }

        const newCreative = {
          userId: user.uid,
          imageUrl,
          headline: creative.headline,
          body: creative.body,
          createdAt: serverTimestamp()
        };

        // Save to Firestore
        await addDoc(collection(db, 'creatives'), newCreative);

        generatedResults.push({
          imageUrl,
          headline: creative.headline,
          body: creative.body
        });
      }
      
      setResults(generatedResults);
      setStep(2);
    } catch (error) {
      console.error("Error generating images:", error);
      console.error("Erro ao gerar imagens. Verifique sua chave de API e tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (step === 2) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{results.length} Criativos Gerados</h1>
          <button onClick={() => setStep(1)} className="px-4 py-2 bg-white/10 rounded-lg text-sm font-medium hover:bg-white/20 transition-colors">
            Voltar
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {results.map((res, idx) => (
            <div key={idx} className="bg-[#111111] rounded-xl overflow-hidden border border-white/10 group relative">
              <img src={res.imageUrl} alt="Creative" className="w-full aspect-[4/5] object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 backdrop-blur-sm">
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button className="p-2 bg-orange-500 rounded-lg hover:bg-orange-600">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3">
                <div className="text-xs font-bold text-orange-500 mb-1">Criativo {idx + 1}</div>
                <div className="text-sm font-medium truncate">{res.headline}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Geração Rápida</h1>
        <p className="text-gray-400">Cole seus criativos e gere as artes com Nano Banana</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold">1</div>
          </div>
          <div className="w-16 h-[2px] bg-white/10"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 text-gray-500 flex items-center justify-center font-bold">2</div>
          </div>
          <div className="w-16 h-[2px] bg-white/10"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 text-gray-500 flex items-center justify-center font-bold">3</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Copy */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold">1. Cole suas Criativos</h2>
          </div>
          <p className="text-sm text-gray-400 mb-4">Cole o texto com os criativos que você quer gerar. O sistema vai identificar automaticamente cada um.</p>
          
          <textarea 
            className="w-full h-64 bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm font-mono text-gray-300 focus:outline-none focus:border-orange-500 resize-none"
            placeholder={`Exemplo:\n\n🔥 CRIATIVO 1 - Dor + Solução\n\n**Headline:** "Cansado de ser refém do próprio negócio?"\n\n**Body:** "Descubra o protocolo..."`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <button className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" /> Analisar Criativos
          </button>
        </div>

        {/* Right Column - Settings */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Tipo de Criativo</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-orange-500 bg-orange-500/10 rounded-xl p-4 cursor-pointer">
                <div className="font-bold text-orange-500 mb-1">Pessoa / Expert</div>
                <div className="text-xs text-gray-400">Criativos com foto de especialista ou pessoa</div>
              </div>
              <div className="border border-white/10 bg-white/5 rounded-xl p-4 cursor-pointer hover:border-white/20">
                <div className="font-bold mb-1">Produto / Food</div>
                <div className="text-xs text-gray-400">Foto do produto como fundo com texto sobreposto</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Cor Dominante</h3>
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-[#3cdb20] ring-2 ring-white ring-offset-2 ring-offset-[#111111] cursor-pointer"></div>
              <div className="w-10 h-10 rounded-full bg-blue-500 cursor-pointer"></div>
              <div className="w-10 h-10 rounded-full bg-red-500 cursor-pointer"></div>
              <div className="w-10 h-10 rounded-full bg-purple-500 cursor-pointer"></div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer border border-white/20">
                <Plus className="w-4 h-4" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Formato</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm cursor-pointer hover:bg-white/10">Feed (4:5)</span>
              <span className="px-3 py-1.5 bg-orange-500/20 border border-orange-500 text-orange-500 rounded-lg text-sm cursor-pointer">Stories (9:16)</span>
              <span className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm cursor-pointer hover:bg-white/10">Quadrado (1:1)</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wider">Fotos de Pessoas</h3>
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/10 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" alt="Expert" />
                <div className="absolute top-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#111111] flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="w-20 h-20 rounded-xl bg-white/5 border border-white/10 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 text-gray-400">
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-xs">Foto</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <>Gerando com IA... <span className="animate-spin">⏳</span></>
          ) : (
            <>Gerar Criativos <ChevronRight className="w-5 h-5" /></>
          )}
        </button>
      </div>
    </div>
  );
}
