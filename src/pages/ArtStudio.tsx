import React, { useState } from 'react';
import { Palette, Image as ImageIcon, Sparkles, ChevronRight, Download } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function ArtStudio() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!user) {
      console.error("Você precisa estar logado para gerar imagens.");
      return;
    }

    if (!prompt.trim()) {
      console.error("Por favor, descreva a arte que deseja gerar.");
      return;
    }

    setIsGenerating(true);
    setResultImage(null);
    
    try {
      // @ts-ignore
      const apiKey = process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const fullPrompt = `Digital art, highly detailed, vivid colors, creative, masterpiece. ${prompt}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: fullPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setResultImage(imageUrl);

        // Save to Firestore
        await addDoc(collection(db, 'creatives'), {
          userId: user.uid,
          imageUrl,
          headline: 'Estúdio de Arte',
          body: prompt,
          createdAt: serverTimestamp()
        });
      } else {
        throw new Error("Nenhuma imagem retornada.");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      console.error("Erro ao gerar imagem. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
          <Palette className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Estúdio de Arte</h1>
          <p className="text-sm text-gray-400">Gere artes digitais e ilustrações incríveis</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left Column - Controls */}
        <div className="w-full lg:w-1/3 bg-[#111111] border border-white/5 rounded-2xl p-6 flex flex-col">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-500" />
            Descreva a Arte
          </h2>
          
          <textarea 
            className="w-full h-40 bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-orange-500 resize-none mb-4"
            placeholder="Ex: Uma paisagem futurista cyberpunk com neon, estilo anime, cores vibrantes..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <div className="mt-auto pt-4 border-t border-white/5">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>Gerando... <span className="animate-spin">⏳</span></>
              ) : (
                <>Gerar Arte <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="flex-1 bg-[#111111] border border-white/5 rounded-2xl flex items-center justify-center p-8 relative overflow-hidden">
          {isGenerating ? (
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400 font-medium">Criando sua arte...</p>
            </div>
          ) : resultImage ? (
            <div className="relative h-full w-full flex items-center justify-center group">
              <img src={resultImage} alt="Generated" className="max-h-full max-w-full object-contain rounded-xl shadow-2xl" />
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <a 
                  href={resultImage} 
                  download="arte-gerada.png"
                  className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center shadow-lg"
                  title="Baixar Imagem"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p>Sua arte aparecerá aqui</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
