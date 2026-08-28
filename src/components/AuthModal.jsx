import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Car, X, ArrowRight, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialRole = 'cliente' }) {
  const { loginAsCliente, loginAsMotorista } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState(initialRole); // 'cliente' | 'motorista'
  const [isRegister, setIsRegister] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carPlate, setCarPlate] = useState('');

  // Pre-populate form fields when role changes or modal opens, using saved localStorage profiles
  useEffect(() => {
    if (!isOpen) return;
    
    if (role === 'cliente') {
      const saved = localStorage.getItem('rotanova_cliente_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setName(parsed.name || '');
          setEmail(parsed.email || '');
          setPhone(parsed.phone || '');
          setIsRegister(false); // Default to login if profile already exists
        } catch (e) {
          console.error(e);
        }
      } else {
        setName('');
        setEmail('');
        setPhone('');
        setIsRegister(true);
      }
    } else {
      const saved = localStorage.getItem('rotanova_motorista_user');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setName(parsed.name || '');
          setEmail(parsed.email || '');
          setPhone(parsed.phone || '');
          setCarModel(parsed.driverData?.carModel || '');
          setCarPlate(parsed.driverData?.carPlate || '');
          setIsRegister(false); // Default to login
        } catch (e) {
          console.error(e);
        }
      } else {
        setName('');
        setEmail('');
        setPhone('');
        setCarModel('');
        setCarPlate('');
        setIsRegister(true);
      }
    }
  }, [role, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === 'cliente') {
      loginAsCliente({ name, email, phone, isDemo: false });
      navigate('/cliente');
    } else {
      loginAsMotorista({ name, email, phone, carModel, carPlate, isDemo: false });
      navigate('/motorista');
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
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Acesso Rota Nova</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isRegister ? 'Criar sua conta' : 'Entrar na sua conta'}
          </h2>
          <p className="text-xs text-slate-400">Escolha o seu perfil para acessar o seu Dashboard exclusivo.</p>
        </div>

        {/* Profile Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setRole('cliente')}
            className={`py-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center space-x-2 ${
              role === 'cliente'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Perfil Cliente</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('motorista')}
            className={`py-3 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center space-x-2 ${
              role === 'motorista'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Perfil Motorista</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Nome Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'cliente' ? 'Ex: Ana Maria' : 'Ex: Carlos Eduardo'}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Telefone / WhatsApp</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 90000-0000"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {role === 'motorista' && (
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

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl shadow-xl shadow-amber-500/20 transition-all text-sm flex items-center justify-center space-x-2"
          >
            <span>{isRegister ? 'Concluir Cadastro e Acessar Dashboard' : 'Entrar no Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Accounts Switcher */}
        <div className="pt-2 border-t border-slate-800 text-center space-y-2">
          <p className="text-[11px] text-slate-400">Ou entre direto com uma conta de demonstração:</p>
          <div className="flex gap-2">
            <button
              onClick={handleQuickDemoClient}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/30 text-xs font-bold py-2 rounded-xl transition-colors"
            >
              Demo Cliente (Passageiro)
            </button>
            <button
              onClick={handleQuickDemoDriver}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 text-xs font-bold py-2 rounded-xl transition-colors"
            >
              Demo Motorista (Condutor)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
