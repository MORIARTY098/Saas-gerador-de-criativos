import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Users, Image as ImageIcon, Trash2, Shield, ShieldAlert } from 'lucide-react';

export default function AdminDashboard() {
  const { userRole } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [creatives, setCreatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole === 'admin') {
      fetchData();
    }
  }, [userRole]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(usersData);

      const creativesSnap = await getDocs(collection(db, 'creatives'));
      const creativesData = creativesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setCreatives(creativesData);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Error updating role:", error);
      // Use a custom toast or UI feedback instead of alert
      console.error("Erro ao atualizar papel do usuário.");
    }
  };

  const handleDeleteCreative = async (creativeId: string) => {
    // Replace window.confirm with a simple delete for now, or implement a custom modal
    // For simplicity, we'll just delete it directly here, but in a real app, use a custom modal.
    try {
      await deleteDoc(doc(db, 'creatives', creativeId));
      setCreatives(creatives.filter(c => c.id !== creativeId));
    } catch (error) {
      console.error("Error deleting creative:", error);
      console.error("Erro ao deletar criativo.");
    }
  };

  if (userRole !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Acesso Negado</h2>
          <p className="text-gray-400 mt-2">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full"><div className="animate-pulse">Carregando painel admin...</div></div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Shield className="w-8 h-8 text-orange-500" /> Painel do Administrador
        </h1>
        <p className="text-gray-400">Gerencie usuários e conteúdos da plataforma.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#111111] p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-bold">Usuários ({users.length})</h2>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {users.map(u => (
              <div key={u.id} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-white/5">
                <div className="flex items-center gap-3 min-w-0">
                  {u.photoURL ? (
                    <img src={u.photoURL} alt={u.displayName} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                      {u.email.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="font-bold text-sm truncate">{u.displayName || 'Sem Nome'}</div>
                    <div className="text-xs text-gray-400 truncate">{u.email}</div>
                  </div>
                </div>
                <select 
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-orange-500"
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111111] p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <ImageIcon className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-bold">Todos os Criativos ({creatives.length})</h2>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {creatives.map(c => (
              <div key={c.id} className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-white/5">
                <div className="flex items-center gap-4 min-w-0">
                  <img src={c.imageUrl} alt="Creative" className="w-16 h-16 object-cover rounded-lg shrink-0" />
                  <div className="min-w-0">
                    <div className="font-bold text-sm truncate">{c.headline}</div>
                    <div className="text-xs text-gray-400 truncate">Por: {users.find(u => u.id === c.userId)?.email || c.userId}</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteCreative(c.id)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
