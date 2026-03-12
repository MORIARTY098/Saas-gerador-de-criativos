import React from 'react';
import { Home, Image, PenTool, Zap, Layers, Calendar, Users, Clock, PlaySquare, Settings, LogOut, Shield, Camera, Palette, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'creatives', icon: Image, label: 'Criativos' },
  { id: 'copy-assistant', icon: PenTool, label: 'Assistente de Copy' },
  { id: 'fast-generation', icon: Zap, label: 'Geração Rápida' },
  { id: 'carousel-generator', icon: Layers, label: 'Carrossel IA' },
  { id: 'scheduling', icon: Calendar, label: 'Agendamentos' },
  { id: 'photo-studio', icon: Camera, label: 'Estúdio de Foto IA' },
  { id: 'art-studio', icon: Palette, label: 'Estúdio de Arte IA' },
  { id: 'history', icon: Clock, label: 'Histórico' },
  { id: 'templates', icon: Layers, label: 'Templates' },
  { id: 'signatures', icon: PenTool, label: 'Assinaturas' },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ currentPage, onNavigate, isOpen, setIsOpen }: SidebarProps) {
  const { userRole, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-[#111111] border-r border-white/5 flex flex-col h-full
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">CRIATIV<span className="text-orange-500">IA</span></span>
          </div>
          <button 
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          <div className="px-4 mb-2">
            <button 
              onClick={() => onNavigate('fast-generation')}
              className="w-full bg-white/5 hover:bg-white/10 text-white rounded-lg py-2 px-4 flex items-center justify-center gap-2 transition-colors border border-white/10"
            >
              <span className="text-xl leading-none">+</span> Novo Criativo
            </button>
          </div>

          <nav className="space-y-1 px-2 mt-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive ? 'bg-orange-500/10 text-orange-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
            
            {userRole === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mt-4 ${
                  currentPage === 'admin' ? 'bg-blue-500/10 text-blue-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span className="text-sm font-medium">Painel Admin</span>
              </button>
            )}
          </nav>
        </div>
        
        <div className="p-4 border-t border-white/5">
           <button 
             onClick={logout}
             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
           >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sair</span>
           </button>
        </div>
      </div>
    </>
  );
}
