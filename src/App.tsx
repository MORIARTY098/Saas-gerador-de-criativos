import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import Demo from './pages/Demo';
import BrandSetup from './pages/BrandSetup';
import CopyAssistant from './pages/CopyAssistant';
import FastGeneration from './pages/FastGeneration';
import CarouselGenerator from './pages/CarouselGenerator';
import AdminDashboard from './pages/AdminDashboard';
import PhotoStudio from './pages/PhotoStudio';
import ArtStudio from './pages/ArtStudio';
import CreativesGallery from './pages/CreativesGallery';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Zap } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('welcome');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex h-screen bg-[#0a0a0a] text-white items-center justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard onNavigate={setCurrentPage} />;
      case 'demo': return <Demo onNavigate={setCurrentPage} />;
      case 'brand-setup': return <BrandSetup onNavigate={setCurrentPage} />;
      case 'copy-assistant': return <CopyAssistant />;
      case 'fast-generation': return <FastGeneration />;
      case 'carousel-generator': return <CarouselGenerator />;
      case 'photo-studio': return <PhotoStudio />;
      case 'art-studio': return <ArtStudio />;
      case 'creatives': return <CreativesGallery />;
      case 'admin': return <AdminDashboard />;
      default: return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>Página em desenvolvimento</p>
        </div>
      );
    }
  };

  if (currentPage === 'welcome') {
    return (
      <div className="flex h-screen bg-[#0a0a0a] text-white font-sans items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-orange-500/20">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Bem-vindo ao CriativIA!</h1>
          <p className="text-gray-400 mb-10 text-lg">
            Experimente criar um criativo de demonstração ou configure sua marca para começar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentPage('demo')}
              className="px-8 py-4 bg-orange-500 hover:bg-orange-600 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" /> Experimentar Demo
            </button>
            <button 
              onClick={() => setCurrentPage('brand-setup')}
              className="px-8 py-4 bg-[#111111] hover:bg-[#1a1a1a] border border-white/10 rounded-xl font-bold transition-colors"
            >
              Configurar Marca
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
      <Sidebar 
        currentPage={currentPage} 
        onNavigate={(page) => {
          setCurrentPage(page);
          setIsMobileMenuOpen(false);
        }} 
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />
      <div className="flex-1 flex flex-col h-full relative w-full overflow-hidden">
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
