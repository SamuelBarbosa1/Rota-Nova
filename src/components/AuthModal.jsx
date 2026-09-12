import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Car, X, ArrowRight, ShieldCheck, Lock, TrendingUp, LogIn, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialRole = 'cliente', initialMode = 'login' }) {
  const { login, register } = useAuth();
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
  const [cnh, setCnh] = useState('');
  const [investorType, setInvestorType] = useState('Investidor Anjo / Apoiador');
  const [company, setCompany] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setRole(initialRole);
    setIsRegister(initialMode === 'register');
    setErrorMsg('');
    setLoading(false);
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setCarModel('');
    setCarPlate('');
    setCnh('');
    setCompany('');
    setInvestorType('Investidor Anjo / Apoiador');
  }, [isOpen, initialRole, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Por favor, preencha o e-mail e a senha.');
      return;
    }

    if (isRegister && password.length < 6) {
      setErrorMsg('A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    if (isRegister && role === 'motorista' && (!carModel || !carPlate || !cnh)) {
      setErrorMsg('Para motoristas, o modelo do carro, placa e CNH são obrigatórios.');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        // CADASTRO REAL NO SUPABASE
        const res = await register({
          name,
          email,
          phone,
          password,
          role,
          carModel,
          carPlate,
          cnh,
          investorType,
          company
        });

        if (!res.success) {
          setErrorMsg(res.error || 'Não foi possível concluir o cadastro.');
          setLoading(false);
          return;
        }

        // Redirecionamento baseado no papel
        if (role === 'cliente') navigate('/cliente');
        else if (role === 'motorista') navigate('/motorista');
        else if (role === 'investidor') navigate('/investidor');

        onClose();
      } else {
        // LOGIN REAL COM VALIDAÇÃO DE SENHA
        const res = await login({ email, password, role });

        if (!res.success) {
          setErrorMsg(res.error || 'Credenciais inválidas.');
          setLoading(false);
          return;
        }

        // Redirecionamento baseado no papel real do usuário
        const targetRole = res.user?.role || role;
        if (targetRole === 'cliente') navigate('/cliente');
        else if (targetRole === 'motorista') navigate('/motorista');
        else if (targetRole === 'investidor') navigate('/investidor');
        else if (targetRole === 'admin') navigate('/admin');

        onClose();
      }
    } catch (err) {
      setErrorMsg('Ocorreu um erro de comunicação. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
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
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Autenticação Segura • Rota Nova</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isRegister ? 'Criar Conta Oficial' : 'Entrar na Plataforma'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister 
              ? 'Seus dados serão gravados com segurança no banco de dados.' 
              : 'Informe seu e-mail e senha registrados para autenticação.'}
          </p>
        </div>

        {/* MENSAGEM DE ERRO VISÍVEL */}
        {errorMsg && (
          <div className="bg-rose-950/80 border border-rose-500/60 p-3.5 rounded-2xl flex items-center space-x-3 text-rose-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* DUAL MODE TOGGLE (LOGIN vs CADASTRO) */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setErrorMsg(''); }}
            className={`py-3 rounded-xl font-black transition-all flex items-center justify-center space-x-2 ${
              !isRegister
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Entrar (Login)</span>
          </button>

          <button
            type="button"
            onClick={() => { setIsRegister(true); setErrorMsg(''); }}
            className={`py-3 rounded-xl font-black transition-all flex items-center justify-center space-x-2 ${
              isRegister
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Criar Conta</span>
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
                ? 'bg-slate-800 text-amber-400 border border-amber-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Investidor</span>
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Nome Completo</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Samuel Barbosa de Oliveira"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">E-mail Cadastrado</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Telefone / WhatsApp</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(61) 98888-7777"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              {isRegister ? 'Senha Segura (Mínimo 6 dígitos)' : 'Sua Senha'}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* CAMPOS ESPECÍFICOS PARA MOTORISTA */}
          {isRegister && role === 'motorista' && (
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                Dados do Veículo & Condutor
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">Modelo / Ano</label>
                  <input
                    type="text"
                    required
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    placeholder="Toyota Corolla 2022"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">Placa</label>
                  <input
                    type="text"
                    required
                    value={carPlate}
                    onChange={(e) => setCarPlate(e.target.value)}
                    placeholder="ABC-1234"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Número da CNH</label>
                <input
                  type="text"
                  required
                  value={cnh}
                  onChange={(e) => setCnh(e.target.value)}
                  placeholder="00000000000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* CAMPOS ESPECÍFICOS PARA INVESTIDOR */}
          {isRegister && role === 'investidor' && (
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                Perfil de Investimento
              </span>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Tipo de Apoio</label>
                <select
                  value={investorType}
                  onChange={(e) => setInvestorType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Investidor Anjo / Apoiador">Investidor Anjo / Apoiador</option>
                  <option value="Fundo Venture Capital">Fundo Venture Capital</option>
                  <option value="Parceiro Estratégico">Parceiro Estratégico</option>
                  <option value="Apoiador da Comunidade">Apoiador da Comunidade</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 mb-1">Fundo / Empresa (Opcional)</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Ex: Prado Capital"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-black py-4 rounded-xl shadow-xl shadow-amber-500/20 transition-all text-sm flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isRegister ? 'Criando Conta...' : 'Verificando Credenciais...'}</span>
              </>
            ) : (
              <>
                <span>{isRegister ? 'Concluir Cadastro Seguro' : 'Entrar no Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* LINK TOGGLE LOGIN / REGISTER */}
        <div className="text-center pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setErrorMsg(''); }}
            className="text-xs text-amber-400 hover:text-amber-300 font-bold underline transition-colors"
          >
            {isRegister 
              ? 'Já tem uma conta registrada? Fazer Login' 
              : 'Ainda não tem conta? Clique aqui para criar agora'}
          </button>
        </div>

      </div>
    </div>
  );
}
