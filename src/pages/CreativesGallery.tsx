import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Image as ImageIcon, Download } from 'lucide-react';

export default function CreativesGallery() {
  const { user } = useAuth();
  const [creatives, setCreatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCreatives();
    }
  }, [user]);

  const fetchCreatives = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'creatives'),
        where('userId', '==', user?.uid),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      setCreatives(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching creatives:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse">Carregando seus criativos...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <ImageIcon className="w-8 h-8 text-orange-500" /> Seus Criativos
        </h1>
        <p className="text-gray-400">Todos os criativos e imagens geradas por você.</p>
      </div>

      {creatives.length === 0 ? (
        <div className="text-center py-20 bg-[#111111] rounded-2xl border border-white/5">
          <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Nenhum criativo encontrado</h2>
          <p className="text-gray-400">Você ainda não gerou nenhum criativo. Vá para a Geração Rápida ou Estúdio de Foto para começar!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {creatives.map(c => (
            <div key={c.id} className="bg-[#111111] rounded-2xl overflow-hidden border border-white/5 group relative">
              <div className="aspect-[3/4] relative">
                <img src={c.imageUrl} alt={c.headline} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => handleDownload(c.imageUrl, `criativo-${c.id}.png`)}
                    className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm truncate">{c.headline}</h3>
                <p className="text-xs text-gray-400 mt-1 truncate">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
