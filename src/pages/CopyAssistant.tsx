import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Target, Copy, Rocket, Clock, Zap, PenTool } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

export default function CopyAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Olá! ✌️ Sou seu copywriter pessoal.\n\nMe conta o que você precisa e eu vou te ajudar a criar 5 variações de copy de alta conversão.\n\nComo começar:\n• Cole o texto da sua página de vendas\n• Descreva seu produto/serviço e público\n• Compartilhe um briefing de campanha\n• Cole uma copy existente para otimizar\n\nO que você quer criar hoje? 🚀'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // @ts-ignore
      const apiKey = process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: {
          systemInstruction: "Você é um copywriter especialista em marketing digital. Você ajuda os usuários a criar copys de alta conversão usando metodologias como PASA (Problema, Agitação, Solução, Ação). Seja direto, criativo e focado em resultados.",
        },
      });

      // Replay history
      for (const msg of messages) {
        if (msg.role === 'user') {
          await chat.sendMessage({ message: msg.content });
        }
      }

      const response = await chat.sendMessage({ message: userMessage.content });
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.text || 'Desculpe, não consegui gerar uma resposta.'
      }]);
    } catch (error) {
      console.error("Error generating copy:", error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao gerar a resposta. Tente novamente.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center shrink-0">
            <PenTool className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Assistente de Copy</h1>
            <p className="text-sm text-gray-400">Metodologia PASA + 5 variações otimizadas</p>
          </div>
        </div>
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <Clock className="w-4 h-4" />
          Últimas Copys
        </button>
      </div>

      <div className="flex-1 bg-[#111111] border border-white/5 rounded-2xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'assistant' ? 'bg-orange-500' : 'bg-orange-600'}`}>
                {msg.role === 'assistant' ? <Zap className="w-4 h-4 text-white" /> : 'U'}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'assistant' ? 'bg-white/5' : 'bg-orange-500/20 text-orange-100'}`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                
                {msg.role === 'assistant' && idx === 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button onClick={() => setInput("Página de vendas")} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 rounded-lg text-sm transition-colors border border-white/5">
                      <FileText className="w-4 h-4 text-orange-500" /> Página de vendas
                    </button>
                    <button onClick={() => setInput("Briefing de campanha")} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 rounded-lg text-sm transition-colors border border-white/5">
                      <Target className="w-4 h-4 text-red-500" /> Briefing de campanha
                    </button>
                    <button onClick={() => setInput("Otimizar copy")} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 rounded-lg text-sm transition-colors border border-white/5">
                      <Copy className="w-4 h-4 text-blue-500" /> Otimizar copy
                    </button>
                    <button onClick={() => setInput("Lançamento")} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 p-2 rounded-lg text-sm transition-colors border border-white/5">
                      <Rocket className="w-4 h-4 text-purple-500" /> Lançamento
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div className="max-w-[80%] rounded-2xl p-4 bg-white/5 flex items-center gap-2">
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-white/5 bg-[#0a0a0a]">
          <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setInput(prev => prev + " ✂️ Menos texto")} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10">✂️ Menos texto</button>
            <button onClick={() => setInput(prev => prev + " 📄 Mais texto")} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10">📄 Mais texto</button>
            <button onClick={() => setInput(prev => prev + " ⚡ Mais urgência")} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10">⚡ Mais urgência</button>
            <button onClick={() => setInput(prev => prev + " ❤️ Mais emoção")} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 hover:bg-white/10">❤️ Mais emoção</button>
          </div>
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Cole seu briefing ou descreva a campanha..."
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-orange-500 resize-none h-14"
              rows={1}
            />
            <button 
              onClick={handleSend}
              disabled={isTyping}
              className="absolute right-2 top-2 w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
