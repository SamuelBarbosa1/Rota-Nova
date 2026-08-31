import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import 'leaflet/dist/leaflet.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNavbar from './components/BottomNavbar';
import Home from './pages/Home';
import Cliente from './pages/Cliente';
import Motorista from './pages/Motorista';
import Regras from './pages/Regras';
import Admin from './pages/Admin';
import Investidor from './pages/Investidor';

function AppContent() {
  const { currentUser } = useAuth();
  
  // Add padding to avoid overlapping the fixed bottom bar on mobile
  const hasBottomBar = true;

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Navbar />
        <main className={`flex-grow ${hasBottomBar ? 'pb-20 md:pb-0' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cliente" element={<Cliente />} />
            <Route path="/motorista" element={<Motorista />} />
            <Route path="/investidor" element={<Investidor />} />
            <Route path="/regras" element={<Regras />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <BottomNavbar />
      </div>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
