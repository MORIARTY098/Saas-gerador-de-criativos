import React from 'react';
import { User, Briefcase, Zap } from 'lucide-react';

export default function BrandSetup({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-orange-500/20">
        <Zap className="w-8 h-8 text-white" />
      </div>
      
      <h1 className="text-3xl font-bold mb-2">Como você vai usar?</h1>
      <p className="text-gray-400 mb-12">Escolha o modo de uso para personalizar sua experiência</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <div 
          className="bg-[#111111] border border-white/10 hover:border-orange-500 rounded-2xl p-8 cursor-pointer transition-all hover:shadow-lg hover:shadow-orange-500/10 group"
          onClick={() => onNavigate('dashboard')}
        >
          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors">
            <User className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-xl font-bold mb-4">Uso Próprio</h2>
          <p className="text-sm text-gray-400 mb-6">Configure sua própria marca para criar criativos pessoais ou do seu negócio.</p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">✓ Setup rápido</li>
            <li className="flex items-center gap-2">✓ Brand kit pessoal</li>
            <li className="flex items-center gap-2">✓ Pode adicionar clientes depois</li>
          </ul>
        </div>

        <div 
          className="bg-[#111111] border border-white/10 hover:border-orange-500 rounded-2xl p-8 cursor-pointer transition-all hover:shadow-lg hover:shadow-orange-500/10 group"
          onClick={() => onNavigate('dashboard')}
        >
          <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors">
            <Briefcase className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-xl font-bold mb-4">Para Cliente</h2>
          <p className="text-sm text-gray-400 mb-6">Crie um perfil completo de cliente com todos os detalhes para gerar criativos precisos.</p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">✓ Perfil completo do cliente</li>
            <li className="flex items-center gap-2">✓ Referências e documentos</li>
            <li className="flex items-center gap-2">✓ Estilo de copy personalizado</li>
          </ul>
        </div>
      </div>
      
      <button className="mt-8 text-sm text-gray-500 hover:text-white transition-colors" onClick={() => onNavigate('dashboard')}>
        Pular setup por enquanto
      </button>
    </div>
  );
}
