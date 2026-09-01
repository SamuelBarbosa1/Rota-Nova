import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Car, X, ArrowRight, ShieldCheck, CheckCircle2, Lock, TrendingUp, LogIn, UserPlus } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialRole = 'cliente', initialMode = 'login' }) {
  const { loginAsCliente, loginAsMotorista, loginAsAdmin, loginAsInvestidor } = useAuth();
  const navigate = useNavigate();
  
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [role, setRole] = useState(initialRole); // 'cliente' | 'motorista' | 'investidor'

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carPlate, setCarPlate] = useState('');
  const [investorType, setInvestorType] = useState('Investidor Anjo / Apoiador');
  const [company, setCompany] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setRole(initialRole);
    setIsRegister(initialMode === 'register');
    // Clean up inputs on open
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setCarModel('');
    setCarPlate('');
    setCompany('');
    setInvestorType('Investidor Anjo / Apoiador');
  }, [isOpen, initialRole, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === 'cliente') {
      loginAsCliente({ name: name || 'Passageiro Rota Nova', email, phone, isDemo: false });
      navigate('/cliente');
    } else if (role === 'motorista') {
      loginAsMotorista({ name: name || 'Motorista Parceiro', email, phone, carModel, carPlate, isDemo: false });
      navigate('/motorista');
    } else if (role === 'investidor') {
      loginAsInvestidor({ name: name || 'Investidor Apoiador', email, phone, investorType, company, isDemo: false });
      navigate('/investidor');
    }
    onClose();
  };

  const handleQuickDemoClient = () => {
    loginAsCliente({ isDemo: true });
    navigate('/cliente');
    onClose();
  };

  const handleQuickDemoDriver = () => {
    loginAsMotorista({ isDemo: true });
    navigate('/motorista');
    onClose();
  };

  const handleQuickDemoInvestor = () => {
    loginAsInvestidor({ isDemo: true });
    navigate('/investidor');
    onClose();
  };

  const handleQuickDemoAdmin = () => {
    loginAsAdmin();
    navigate('/admin');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel max-w-lg w-full p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl relative space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Sistema Rota Nova</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isRegister ? 'Criar sua conta' : 'Entrar na sua conta'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister 
              ? 'Preencha os campos abaixo para se cadastrar na plataforma.' 
              : 'Digite suas credenciais registradas para acessar seu Dashboard.'}
          </p>
        </div>

        {/* DUAL MODE TOGGLE (LOGIN vs CADASTRO) */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`py-3 rounded-xl font-black transition-all flex items-center justify-center space-x-2 ${
              !isRegister
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Já tenho conta (Login)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`py-3 rounded-xl font-black transition-all flex items-center justify-center space-x-2 ${
              isRegister
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Criar Nova Conta</span>
          </button>
        </div>

        {/* PROFILE ROLE SELECTOR TABS */}
        <div className="grid grid-cols-3 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-[11px]">
          <button
            type="button"
            onClick={() => setRole('cliente')}
            className={`py-2.5 rounded-xl font-extrabold transition-all flex items-center justify-center space-x-1 ${
              role === 'cliente'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Passageiro</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('motorista')}
            className={`py-2.5 rounded-xl font-extrabold transition-all flex items-center justify-center space-x-1 ${
              role === 'motorista'
                ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Motorista</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('investidor')}
            className={`py-2.5 rounded-xl font-extrabold transition-all flex items-center justify-center space-x-1 ${
              role === 'investidor'
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Investidor</span>
          </button>
        </div>

        {/* DYNAMIC FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={role === 'cliente' ? 'Ex: Ana Maria' : role === 'motorista' ? 'Ex: Carlos Eduardo' : 'Ex: Alexandre Prado'}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                required={isRegister}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">E-mail de Acesso</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {!isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                required={!isRegister}
              />
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Telefone / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(61) 90000-0000"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
                required={isRegister}
              />
            </div>
          )}

          {isRegister && role === 'motorista' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Modelo do Veículo</label>
                <input
                  type="text"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  placeholder="Ex: Honda Fit"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Placa do Carro</label>
                <input
                  type="text"
                  value={carPlate}
                  onChange={(e) => setCarPlate(e.target.value)}
                  placeholder="Ex: ABC-1234"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>
          )}

          {isRegister && role === 'investidor' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Perfil de Apoio</label>
                <select
                  value={investorType}
                  onChange={(e) => setInvestorType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Investidor Anjo / Apoiador">Investidor Anjo / Apoiador</option>
                  <option value="Fundo de Investimento">Fundo de Investimento</option>
                  <option value="Parceiro Estratégico">Parceiro Estratégico</option>
                  <option value="Apoiador da Comunidade">Apoiador da Comunidade</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Fundo / Empresa (Opcional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Ex: Prado Capital"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl shadow-xl shadow-amber-500/20 transition-all text-sm flex items-center justify-center space-x-2"
          >
            <span>{isRegister ? 'Concluir Cadastro e Acessar Dashboard' : 'Entrar no Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* QUICK 1-CLICK DEMO BUTTONS */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2 text-center">
          <span className="text-[11px] font-bold text-slate-400 block">
            ⚡ Ou entre com 1-Clique em Modo Demonstração:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              type="button"
              onClick={handleQuickDemoInvestor}
              className="py-2.5 px-2 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl transition-all flex items-center justify-center gap-1"
            >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Investidor</span>
            </button>
            <button
              type="button"
              onClick={handleQuickDemoDriver}
              className="py-2.5 px-2 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 font-bold rounded-xl transition-all flex items-center justify-center gap-1"
            >
              <Car className="w-3.5 h-3.5 text-amber-400" />
              <span>Motorista</span>
            </button>
            <button
              type="button"
              onClick={handleQuickDemoClient}
              className="py-2.5 px-2 bg-blue-950/60 hover:bg-blue-900/80 border border-blue-500/40 text-blue-300 font-bold rounded-xl transition-all flex items-center justify-center gap-1"
            >
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Passageiro</span>
            </button>
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="py-2.5 px-2 bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 font-bold rounded-xl transition-all flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* LINK TOGGLE LOGIN / REGISTER */}
        <div className="text-center pt-1 border-t border-slate-800/80">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold underline transition-colors"
          >
            {isRegister ? 'Já tem uma conta registrada? Fazer Login' : 'Ainda não tem conta? Clique aqui para se cadastrar'}
          </button>
        </div>

      </div>
    </div>
  );
}
