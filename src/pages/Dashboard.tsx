import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Users, PlaySquare, Zap, Camera, Palette, Clock, ChevronRight } from 'lucide-react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { user } = useAuth();
  const [recentCreatives, setRecentCreatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecentCreatives();
    }
  }, [user]);

  const fetchRecentCreatives = async () => {
    try {
      const q = query(
        collection(db, 'creatives'),
        where('userId', '==', user?.uid),
        orderBy('createdAt', 'desc'),
        limit(4)
      );
      const querySnapshot = await getDocs(q);
      const creatives = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentCreatives(creatives);
    } catch (error) {
      console.error("Error fetching creatives:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Olá, {user?.displayName || 'Criador'}! 👋</h1>
      <p className="text-gray-400 mb-8">Visão geral e acesso rápido às ferramentas</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#111111] border border-white/5 rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <div className="text-2xl font-bold">{recentCreatives.length}</div>
            <div className="text-sm text-gray-400">Criativos Recentes</div>
          </div>
        </div>
        <div className="bg-[#111111] border border-white/5 rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
            <Users className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm text-gray-400">Marcas</div>
          </div>
        </div>
        <div className="bg-[#111111] border border-white/5 rounded-xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">
            <Clock className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <div className="text-2xl font-bold">Ativo</div>
            <div className="text-sm text-gray-400">Status</div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Criar Agora</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div 
          className="group relative rounded-xl overflow-hidden border border-white/10 cursor-pointer aspect-[4/3]"
          onClick={() => onNavigate('fast-generation')}
        >
          <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" alt="Geração Rápida" className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-lg">Geração Rápida</h3>
            </div>
            <p className="text-sm text-gray-300">Crie vários criativos de uma vez</p>
          </div>
        </div>

        <div 
          className="group relative rounded-xl overflow-hidden border border-white/10 cursor-pointer aspect-[4/3]"
          onClick={() => onNavigate('photo-studio')}
        >
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop" alt="Estúdio de Foto" className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-2">
              <Camera className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-lg">Estúdio de Foto</h3>
            </div>
            <p className="text-sm text-gray-300">Ensaios fotográficos com IA</p>
          </div>
        </div>

        <div 
          className="group relative rounded-xl overflow-hidden border border-white/10 cursor-pointer aspect-[4/3]"
          onClick={() => onNavigate('art-studio')}
        >
          <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" alt="Estúdio de Arte" className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-lg">Estúdio de Arte</h3>
            </div>
            <p className="text-sm text-gray-300">Edição detalhada de artes</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Criativos Recentes
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-pulse text-gray-400">Carregando criativos...</div>
          </div>
        ) : recentCreatives.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recentCreatives.map((creative) => (
              <div key={creative.id} className="bg-[#111111] rounded-xl overflow-hidden border border-white/5 group">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img src={creative.imageUrl} alt="Creative" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <button 
                      onClick={() => onNavigate('creatives')}
                      className="w-full py-2 bg-orange-500 rounded-lg text-sm font-bold hover:bg-orange-600 transition-colors"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-sm font-medium truncate">{creative.headline}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {creative.createdAt?.toDate ? creative.createdAt.toDate().toLocaleDateString() : 'Recente'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-12 text-center">
            <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">Nenhum criativo ainda</h3>
            <p className="text-gray-400 mb-6">Comece gerando sua primeira arte com IA.</p>
            <button 
              onClick={() => onNavigate('fast-generation')}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors border border-white/10"
            >
              Criar Agora
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
