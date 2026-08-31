import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { Car, User, ShieldAlert, LogOut, Menu, X, ArrowRight, LayoutDashboard, TrendingUp, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState('cliente');
  const [authMode, setAuthMode] = useState('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const openAuth = (role, mode = 'login') => {
    setAuthRole(role);
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavLinkClass = (path) => {
    return `px-4 py-2 rounded-lg text-sm transition-all flex items-center space-x-2 border ${
      isActive(path)
        ? 'bg-slate-800/90 text-amber-400 border-amber-500/40 shadow-sm font-bold'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/50 font-medium border-transparent'
    }`;
  };

  return (
    <>
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 p-0.5 shadow-lg shadow-amber-950/50 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Car className="w-6 h-6 text-amber-400" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-white flex items-center gap-0.5">
                  Rota<span className="text-amber-400">Nova</span>
                </span>
                <span className="text-[10px] font-medium tracking-wider text-slate-400 block -mt-1 uppercase">
                  Aceitou, levou
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-2">
              <Link to="/" className={getNavLinkClass('/')}>
                <span>Início</span>
              </Link>

              <Link to="/regras" className={getNavLinkClass('/regras')}>
                <ShieldAlert className="w-4 h-4" />
                <span>Regras do App</span>
              </Link>

              {/* Navigation Links */}
              {currentUser?.role !== 'investidor' && (
                <Link to="/investidor" className={getNavLinkClass('/investidor')}>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Investidor & Apoiador</span>
                </Link>
              )}

              {/* Show specific dashboard link ONLY if authenticated */}
              {currentUser?.role === 'cliente' && (
                <Link to="/cliente" className={getNavLinkClass('/cliente')}>
                  <User className="w-4 h-4" />
                  <span>Meu Dashboard</span>
                </Link>
              )}

              {currentUser?.role === 'motorista' && (
                <Link to="/motorista" className={getNavLinkClass('/motorista')}>
                  <Car className="w-4 h-4" />
                  <span>Painel do Motorista</span>
                </Link>
              )}

              {currentUser?.role === 'investidor' && (
                <Link to="/investidor" className={getNavLinkClass('/investidor')}>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>Painel do Investidor</span>
                </Link>
              )}

              {currentUser?.role === 'admin' && (
                <Link to="/admin" className={getNavLinkClass('/admin')}>
                  <LayoutDashboard className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300 font-bold">Painel Admin</span>
                </Link>
              )}
            </nav>

            {/* Right Action Bar */}
            <div className="hidden lg:flex items-center space-x-3">
              {currentUser ? (
                <div className="flex items-center space-x-3 bg-slate-900 border border-slate-700/80 p-1.5 pl-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs ${
                      currentUser.role === 'admin' 
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                        : currentUser.role === 'investidor'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {(currentUser?.name || 'US').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white leading-tight">{currentUser?.name || 'Usuário'}</p>
                      <p className="text-[10px] text-slate-400 capitalize">
                        {currentUser?.role === 'cliente' 
                          ? 'Passageiro' 
                          : currentUser?.role === 'motorista' 
                          ? 'Motorista' 
                          : currentUser?.role === 'investidor'
                          ? 'Investidor Apoiador'
                          : 'Administrador'}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={currentUser.role === 'cliente' ? '/cliente' : currentUser.role === 'motorista' ? '/motorista' : currentUser.role === 'investidor' ? '/investidor' : '/admin'}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition-colors flex items-center gap-1"
                    title="Acessar Dashboard"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 text-xs transition-colors"
                    title="Sair"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => openAuth('cliente', 'login')}
                    className="text-xs font-bold text-slate-300 hover:text-white px-3 py-2 rounded-xl transition-colors"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => openAuth('cliente', 'register')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all text-xs flex items-center space-x-1.5"
                  >
                    <span>Criar Conta</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm ${isActive('/') ? 'text-amber-400 font-bold bg-slate-800' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              Início
            </Link>
            <Link
              to="/regras"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm ${isActive('/regras') ? 'text-amber-400 font-bold bg-slate-800' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              Regras do App
            </Link>

            <Link
              to="/investidor"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm ${isActive('/investidor') ? 'text-amber-400 font-bold bg-slate-800' : 'text-emerald-400 font-bold hover:bg-slate-800'}`}
            >
              Investidor & Apoiador
            </Link>

            {currentUser && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <Link
                  to={currentUser.role === 'cliente' ? '/cliente' : currentUser.role === 'motorista' ? '/motorista' : currentUser.role === 'investidor' ? '/investidor' : '/admin'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-bold text-amber-400 bg-slate-800"
                >
                  Meu Painel ({currentUser.role === 'cliente' ? 'Passageiro' : currentUser.role === 'motorista' ? 'Motorista' : currentUser.role === 'investidor' ? 'Investidor' : 'Admin'})
                </Link>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-rose-400 hover:bg-rose-950/40 flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair da Minha Conta</span>
                </button>
              </div>
            )}

            {!currentUser && (
              <div className="pt-2 space-y-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuth('cliente', 'login');
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700/80 text-white font-bold py-3 rounded-xl text-center text-sm border border-slate-700/80 transition-colors flex items-center justify-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Entrar</span>
                </button>
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAuth('cliente', 'register');
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-center text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Criar Conta</span>
                </button>

                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center bg-purple-950/60 text-purple-300 font-bold py-2.5 rounded-xl border border-purple-500/40 text-xs transition-colors"
                >
                  Painel Administrativo
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={authRole}
        initialMode={authMode}
      />
    </>
  );
}
