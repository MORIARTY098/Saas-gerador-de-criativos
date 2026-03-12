import React from 'react';
import { Coins, Plus, ChevronDown, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden p-2 -ml-2 text-gray-400 hover:text-white transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="w-6 h-6" />
        </button>
        {/* Breadcrumbs or title could go here */}
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
          <Coins className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium">Créditos</span>
          <span className="text-sm font-bold ml-1">Ilimitado</span>
        </div>

        <div className="flex items-center gap-2 cursor-pointer hover:bg-white/5 py-1 px-2 rounded-lg transition-colors">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold text-white">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium leading-tight">{user?.displayName || 'Usuário'}</span>
            <span className="text-xs text-gray-500 leading-tight">{user?.email?.split('@')[0]}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
