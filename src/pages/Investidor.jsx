import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import PixApoioModal from '../components/PixApoioModal';
import { 
  TrendingUp, Users, DollarSign, Award, ArrowUpRight, ArrowRight, 
  Sparkles, ShieldCheck, PieChart, Activity, Layers, Calendar, Lock, 
  UserCheck, RefreshCw, Send, CheckCircle2, ChevronDown, ChevronUp,
  Briefcase, Mail, Phone, ExternalLink, Flame, LogOut, QrCode,
  Copy, Check, HeartHandshake, Wallet
} from 'lucide-react';

export default function Investidor() {
  const { currentUser, activeTab, setActiveTab, logout, loginAsInvestidor } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pixModalOpen, setPixModalOpen] = useState(false);
  const [pixInlineCopied, setPixInlineCopied] = useState(false);
  const [userTabFilter, setUserTabFilter] = useState('total'); // 'total' | 'passageiros' | 'motoristas'

  const pixUrl = "https://cobranca.c6pix.com.br/01KXDM3SKSR75RMGNR6A9APKCX";
  const qrCodeImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixUrl)}&color=020617&bgcolor=ffffff`;

  const handleCopyPixLink = () => {
    navigator.clipboard.writeText(pixUrl);
    setPixInlineCopied(true);
    setTimeout(() => setPixInlineCopied(false), 3000);
  };

  const handleDirectInvestorAccess = () => {
    loginAsInvestidor({ isDemo: true });
  };

  // Validate activeTab on mount
  useEffect(() => {
    const validTabs = ['metrics', 'extrato', 'investir', 'timeline', 'menu'];
    if (!validTabs.includes(activeTab)) {
      setActiveTab('metrics');
    }
  }, [activeTab, setActiveTab]);

  // Investment Simulator State
  const [investmentAmount, setInvestmentAmount] = useState(25000);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [investorMessage, setInvestorMessage] = useState('');

  // GATEKEEPER LOCK SCREEN IF UNAUTHENTICATED OR NOT AN INVESTOR
  if (!currentUser || currentUser.role !== 'investidor') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-16 flex items-center justify-center selection:bg-amber-500 selection:text-slate-950">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-6">
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
            
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mx-auto flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                Área do Investidor & Apoiador
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Acesse o Painel Financeiro e Métricas Rota Nova
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Acompanhe em tempo real o volume de vendas diárias, cadastros acumulados de usuários, evolução da frota e novidades sobre rodadas de investimento e parcerias.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleDirectInvestorAccess}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl shadow-xl shadow-amber-500/20 text-sm transition-all flex items-center justify-center space-x-2 active:scale-95"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Acessar Painel do Investidor</span>
              </button>

              <button
                onClick={() => setPixModalOpen(true)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 border border-amber-500/50 hover:border-amber-400 text-amber-300 font-bold py-4 rounded-xl text-sm transition-all flex items-center justify-center space-x-2 shadow-lg active:scale-95"
              >
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                <span>Apoiar via PIX (Valor Livre)</span>
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="text-xs text-slate-400 hover:text-amber-300 underline font-medium transition-colors"
              >
                Já possui cadastro formal de investidor? Entrar com e-mail e senha
              </button>
            </div>

            {/* PIX Quick Box for spontaneous contributors */}
            <div className="pt-4 border-t border-slate-800/80 text-left">
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 overflow-hidden shadow-lg">
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">
                      Contribuição Voluntária Direta
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                      MAX LENNER DIOGO DE MORAIS <span className="text-slate-400 font-normal text-xs">(C6 Bank)</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Chave / CPF: 053.391.481-73 • Sem valor mínimo
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto shrink-0 justify-end">
                  <button
                    onClick={handleCopyPixLink}
                    className="flex-1 md:flex-none px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    {pixInlineCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copiar Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setPixModalOpen(true)}
                    className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-black text-slate-950 flex items-center justify-center gap-1.5 transition-colors shadow-md whitespace-nowrap active:scale-95"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Ver QR Code</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialRole="investidor"
        />

        <PixApoioModal
          isOpen={pixModalOpen}
          onClose={() => setPixModalOpen(false)}
        />
      </div>
    );
  }

  const investorName = currentUser?.name || 'Investidor Parceiro';
  const investorType = currentUser?.investorType || 'Apoiador Estratégico';
  const companyName = currentUser?.company || 'Fundo de Mobilidade Urbana';

  // Stats data
  const statsData = currentUser?.stats || {
    registeredUsers: { today: 5, week: 61, month: 316, year: 27171, total: 292526 },
    driversCount: { today: 2, week: 14, month: 88, total: 3840 },
    clientsCount: { today: 3, week: 47, month: 228, total: 288686 },
    grossSales: { today: 1766.71, week: 10190.31, month: 151348.54, year: 1450200.00, total: 3068722.58 },
    netRevenue: { today: 176.67, week: 1019.03, month: 15134.85, year: 145020.00, total: 306872.25 }
  };

  const getActiveUsersCount = () => {
    if (userTabFilter === 'motoristas') return statsData.driversCount;
    if (userTabFilter === 'passageiros') return statsData.clientsCount;
    return statsData.registeredUsers;
  };

  const currentUsers = getActiveUsersCount();

  // Investment return calculation (projected 18.5% YoY return)
  const projectedReturnYear = (investmentAmount * 1.185).toFixed(2);
  const monthlyYield = ((investmentAmount * 0.185) / 12).toFixed(2);

  const handleSimulateContact = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 sm:py-10 selection:bg-amber-500 selection:text-slate-950 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* HEADER DO DASHBOARD DO INVESTIDOR */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl">
          
          <div className="flex items-center space-x-4">
            <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-xl sm:text-2xl shadow-lg shrink-0">
              {investorName.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
                  {investorType}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ● Métricas ao Vivo
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Portal do Investidor — {investorName}
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                Organização: <strong className="text-slate-200">{companyName}</strong> • ID: <strong className="text-amber-400">INV-8802</strong>
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-stretch sm:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('metrics')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'metrics' ? 'bg-amber-500 text-slate-950 shadow-lg font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Métricas</span>
            </button>
            <button
              onClick={() => setActiveTab('extrato')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'extrato' ? 'bg-amber-500 text-slate-950 shadow-lg font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Extrato & Vendas</span>
            </button>
            <button
              onClick={() => setActiveTab('investir')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'investir' ? 'bg-amber-500 text-slate-950 shadow-lg font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Aporte & Apoio</span>
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                activeTab === 'timeline' ? 'bg-amber-500 text-slate-950 shadow-lg font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
          </div>

        </div>

        {/* 1. SEÇÃO DE USUÁRIOS REGISTRADOS (TAB: METRICS) */}
        {activeTab === 'metrics' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-400" />
                    Usuários Registrados
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Evolução de novos cadastros validados na plataforma Rota Nova.</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                  <button
                    onClick={() => setUserTabFilter('total')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      userTabFilter === 'total' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Todos (Geral)
                  </button>
                  <button
                    onClick={() => setUserTabFilter('passageiros')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      userTabFilter === 'passageiros' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Passageiros
                  </button>
                  <button
                    onClick={() => setUserTabFilter('motoristas')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      userTabFilter === 'motoristas' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Motoristas
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                
                <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-amber-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-3xl font-black text-white">{currentUsers?.today || 0}</span>
                    <p className="text-xs font-bold text-slate-400 mt-1">Hoje</p>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-amber-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-3xl font-black text-white">{currentUsers?.week || 0}</span>
                    <p className="text-xs font-bold text-slate-400 mt-1">Semana</p>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-amber-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-3xl font-black text-white">{currentUsers?.month || 0}</span>
                    <p className="text-xs font-bold text-slate-400 mt-1">Mês</p>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-3 hover:border-amber-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-3xl font-black text-white">{(currentUsers?.year || 0).toLocaleString('pt-BR')}</span>
                    <p className="text-xs font-bold text-slate-400 mt-1">Ano</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-amber-950/40 border border-amber-500/40 p-5 rounded-2xl space-y-3 col-span-2 sm:col-span-1">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-3xl font-black text-amber-400">{(currentUsers?.total || 0).toLocaleString('pt-BR')}</span>
                    <p className="text-xs font-bold text-amber-300 mt-1">Total Geral Acumulado</p>
                  </div>
                </div>

              </div>

            </div>

            {/* Quick Metrics Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold block">Volume Geral Transacionado (GMV)</span>
                    <span className="text-2xl font-black text-white">R$ {(statsData?.grossSales?.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('extrato')}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <span>Ver Detalhes</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <PieChart className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold block">Receita Líquida Plataforma (10%)</span>
                    <span className="text-2xl font-black text-emerald-400">R$ {(statsData?.netRevenue?.total || 0).toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('investir')}
                  className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 transition-colors shadow-lg"
                >
                  <span>Simular Aporte</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. SEÇÃO DE METAS E VENDAS (TAB: EXTRATO) */}
        {activeTab === 'extrato' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
            
            <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
              
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-400" />
                    Metas e Vendas (Volume Bruto / GMV)
                  </h2>
                  <span className="text-xs font-bold bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/30">
                    Consolidado
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Valor total bruto movimentado em viagens finalizadas na plataforma.</p>
              </div>

              <div className="space-y-4">
                
                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Hoje</p>
                      <p className="text-2xl font-black text-white">R$ {(statsData?.grossSales?.today || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                    +12.8% vs ontem
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Esta Semana</p>
                      <p className="text-2xl font-black text-white">R$ {(statsData?.grossSales?.week || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
                    100% Meta Semanal
                  </span>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Este Mês</p>
                      <p className="text-2xl font-black text-white">R$ {(statsData?.grossSales?.month || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 font-bold bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800">
                    Recorde Mensal
                  </span>
                </div>

                <div className="bg-gradient-to-r from-amber-950/80 to-slate-900 border border-amber-500/50 p-5 rounded-2xl flex items-center justify-between shadow-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                      <Flame className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-amber-300 font-extrabold uppercase tracking-wider">Volume Geral Acumulado</p>
                      <p className="text-3xl font-black text-amber-400">R$ {(statsData?.grossSales?.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* RECEITA LÍQUIDA RETIDA PELA PLATAFORMA (TAXA 10%) */}
            <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-between">
              
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                    Take-Rate Fixo: 10%
                  </span>
                  <h2 className="text-xl font-black text-white mt-2 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-amber-400" />
                    Receita Líquida Rota Nova
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Retenção líquida aplicada sobre todas as viagens finalizadas.</p>
                </div>

                <div className="space-y-3">
                  
                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Lucro Líquido Hoje:</span>
                    <span className="font-black text-emerald-400 text-sm">R$ {(statsData?.netRevenue?.today || 0).toFixed(2).replace('.', ',')}</span>
                  </div>

                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Lucro Líquido Semana:</span>
                    <span className="font-black text-emerald-400 text-sm">R$ {(statsData?.netRevenue?.week || 0).toFixed(2).replace('.', ',')}</span>
                  </div>

                  <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-300 font-medium">Lucro Líquido Mês:</span>
                    <span className="font-black text-emerald-400 text-sm">R$ {(statsData?.netRevenue?.month || 0).toFixed(2).replace('.', ',')}</span>
                  </div>

                  <div className="p-4 bg-amber-950/60 rounded-xl border border-amber-500/40 flex justify-between items-center text-xs">
                    <span className="text-amber-300 font-bold">Acumulado Líquido Geral:</span>
                    <span className="font-black text-amber-400 text-lg">R$ {(statsData?.netRevenue?.total || 0).toFixed(2).replace('.', ',')}</span>
                  </div>

                </div>
              </div>

              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <p className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  Diferencial de Negócio Rota Nova:
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Com taxa justa fixa em 10%, a plataforma atrai e fideliza os melhores motoristas do mercado, mantendo a taxa de retenção em 98.4%.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* 3. EVOLUÇÃO, RESULTADOS & NOVIDADES DA PLATAFORMA (TAB: TIMELINE) */}
        {activeTab === 'timeline' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 animate-fadeIn">
            
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Linha do Tempo</span>
                <h2 className="text-2xl font-black text-white mt-1 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-amber-400" />
                  Evolução, Resultados e Novidades do Produto
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">Atualizado em 2026</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3 relative">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  LANÇAMENTO
                </span>
                <h3 className="text-lg font-bold text-white">Lançadas 8 Modalidades VIA</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Inclusão das categorias VIA GO, VIA PLUS, VIA ECO, VIA DELAS, VIA BLACK, VIA PRIME, VIA BOX e VIA PET.
                </p>
                <span className="text-[10px] text-slate-500 block pt-2 border-t border-slate-800">Agosto/2026</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  MARCA HISTÓRICA
                </span>
                <h3 className="text-lg font-bold text-white">0% Cancelamentos por Local</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Consolidação da regra de ouro: 100% das viagens em estradas de chão do DF foram atendidas sem recusa.
                </p>
                <span className="text-[10px] text-slate-500 block pt-2 border-t border-slate-800">Julho/2026</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  EXPANSÃO
                </span>
                <h3 className="text-lg font-bold text-white">Integração Total DF</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Atendimento expandido para Ceilândia, Sol Nascente, Samambaia, Taguatinga e Rodoviária do Plano Piloto.
                </p>
                <span className="text-[10px] text-slate-500 block pt-2 border-t border-slate-800">Junho/2026</span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl space-y-3">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  PARCERIAS
                </span>
                <h3 className="text-lg font-bold text-white">Frota Elétrica VIA ECO</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Início da negociação de pontos de recarga ultrarrápida exclusiva para a frota sustentável.
                </p>
                <span className="text-[10px] text-slate-500 block pt-2 border-t border-slate-800">Maio/2026</span>
              </div>

            </div>

          </div>
        )}

        {/* 4. SIMULADOR DE APORTE & CONTATO DIRETO (TAB: INVESTIR) */}
        {activeTab === 'investir' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* PIX DIRECT SUPPORT & DONATION CARD */}
            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-amber-500/50 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 shadow-2xl space-y-6">
              
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
                    <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
                    <span>Apoio Comunitário & Investimento Simbólico</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    Apoie o Projeto Rota Nova via PIX Instantâneo
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                    Seja um apoiador direto da plataforma. Qualquer valor simbólico contribui para manutenção dos servidores, desenvolvimento de novos recursos e expansão para novas cidades.
                  </p>
                </div>

                <button
                  onClick={() => setPixModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2 transition-all shrink-0"
                >
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>Expandir QR Code</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* QR Code & Scan box */}
                <div className="lg:col-span-4 flex flex-col items-center bg-slate-950/90 border border-slate-800 p-6 rounded-2xl space-y-4 text-center">
                  <div className="relative p-3 bg-white rounded-2xl shadow-xl shadow-amber-500/10 border-2 border-amber-500/40 group">
                    <img
                      src={qrCodeImgUrl}
                      alt="QR Code Pix C6 Bank"
                      className="w-44 h-44 sm:w-48 sm:h-48 object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-amber-500/10 pointer-events-none border border-amber-400/20" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-400 flex items-center justify-center gap-1.5">
                      <QrCode className="w-4 h-4" />
                      Aponte a câmera do seu banco
                    </span>
                    <p className="text-[11px] text-slate-400">
                      QR Code C6 Bank sem valor fixo pré-definido
                    </p>
                  </div>
                </div>

                {/* Beneficiary Details & Actions */}
                <div className="lg:col-span-8 space-y-5">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 font-semibold block text-[11px]">Titular / Beneficiário</span>
                      <strong className="text-white text-sm font-bold block">MAX LENNER DIOGO DE MORAIS</strong>
                    </div>

                    <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 font-semibold block text-[11px]">CPF / Chave Pix</span>
                      <strong className="text-amber-400 font-mono text-sm block">053.391.481-73</strong>
                    </div>

                    <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                      <span className="text-slate-400 font-semibold block text-[11px]">Instituição Financeira</span>
                      <strong className="text-emerald-400 text-sm font-bold block">Banco C6 S.A.</strong>
                    </div>
                  </div>

                  {/* Preset Suggestions */}
                  <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Sugestões de Apoio Voluntário:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
                        <span className="text-amber-400 font-bold text-xs block">R$ 10</span>
                        <span className="text-[10px] text-slate-400">Café dos Devs</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
                        <span className="text-amber-400 font-bold text-xs block">R$ 25</span>
                        <span className="text-[10px] text-slate-400">1h Cloud Server</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
                        <span className="text-amber-400 font-bold text-xs block">R$ 50</span>
                        <span className="text-[10px] text-slate-400">Expansão de Bairro</span>
                      </div>
                      <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-center">
                        <span className="text-amber-400 font-bold text-xs block">Livre</span>
                        <span className="text-[10px] text-slate-400">Qualquer Valor</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleCopyPixLink}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 px-4 rounded-xl border border-slate-700 flex items-center justify-center space-x-2 transition-all text-xs"
                    >
                      {pixInlineCopied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Link Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-amber-400" />
                          <span>Copiar Link de Cobrança PIX</span>
                        </>
                      )}
                    </button>

                    <a
                      href={pixUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 px-4 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all text-xs"
                    >
                      <span>Abrir Cobrança C6 PIX</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                </div>

              </div>

            </div>

            {/* INSTITUTIONAL INVESTMENT ROUNDS & SIMULATOR */}
            <div className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8">
              
              <div className="max-w-3xl space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/20 px-3.5 py-1.5 rounded-full border border-amber-500/30">
                  Rodadas de Aporte Institucional & Cotas
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white">
                  Quer Fazer Parte da Expansão do Rota Nova?
                </h2>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Estamos selecionando investidores anjo, fundos de mobilidade e apoiadores estratégicos para acelerar a presença do Rota Nova em novas regiões do Brasil.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Simulator Slider */}
                <div className="lg:col-span-6 bg-slate-950/80 p-6 rounded-2xl border border-slate-800 space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-amber-400" />
                    Simulador de Aporte / Cotas
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-400">Valor do Aporte Simulado:</span>
                      <span className="text-2xl font-black text-amber-400">R$ {investmentAmount.toLocaleString('pt-BR')}</span>
                    </div>

                    <input
                      type="range"
                      min="5000"
                      max="250000"
                      step="5000"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Retorno Anual Estimado (YoY)</span>
                        <span className="text-base font-black text-emerald-400">R$ {parseFloat(projectedReturnYear).toLocaleString('pt-BR')}</span>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Projeção Mensal de Repasse</span>
                        <span className="text-base font-black text-amber-400">R$ {parseFloat(monthlyYield).toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Contact Form */}
                <div className="lg:col-span-6 space-y-4">
                  {!contactSubmitted ? (
                    <form onSubmit={handleSimulateContact} className="space-y-4">
                      <p className="text-xs font-bold text-slate-300">Falar Diretamente com a Diretoria do Rota Nova</p>
                      <div>
                        <textarea
                          value={investorMessage}
                          onChange={(e) => setInvestorMessage(e.target.value)}
                          placeholder="Escreva sua mensagem ou proposta de apoio/investimento..."
                          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-amber-500 h-28"
                          required
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl shadow-lg transition-all text-xs flex items-center justify-center space-x-2"
                      >
                        <Send className="w-4 h-4" />
                        <span>Enviar Mensagem & Solicitar Pitch Deck</span>
                      </button>
                    </form>
                  ) : (
                    <div className="bg-emerald-950/60 border border-emerald-500/60 p-6 rounded-2xl text-center space-y-3 animate-fadeIn">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                      <h4 className="text-lg font-bold text-white">Mensagem Recebida com Sucesso!</h4>
                      <p className="text-xs text-slate-300">
                        Nossa equipe de relações com investidores entrará em contato com você em breve pelo e-mail registrado.
                      </p>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* 5. MENU & PERFIL (TAB: MENU) */}
        {activeTab === 'menu' && (
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 max-w-xl mx-auto animate-fadeIn">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-black text-3xl shadow-lg mx-auto">
                {(currentUser?.name || 'IN').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{currentUser?.name || 'Investidor'}</h2>
                <p className="text-sm text-slate-400 font-medium">{currentUser?.email || ''}</p>
                <span className="inline-block text-[10px] font-black tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full uppercase mt-2">
                  {currentUser?.investorType || 'Investidor Apoiador'}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-6 space-y-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
                <p className="font-semibold text-slate-300 font-bold">Informações Corporativas:</p>
                <p className="text-slate-400">Organização: <strong className="text-slate-200">{currentUser?.company || 'Prado Capital'}</strong></p>
                <p className="text-slate-400">ID de Apoiador: <strong className="text-amber-400">INV-8802</strong></p>
                <p className="text-slate-400">Crescimento Mensal: <strong className="text-emerald-400">+28.4% MoM</strong></p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setPixModalOpen(true)}
                  className="w-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold py-3.5 rounded-xl text-center text-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <HeartHandshake className="w-4 h-4 text-amber-400" />
                  <span>Apoiar Projeto via PIX Instantâneo</span>
                </button>

                <button
                  onClick={() => setActiveTab('metrics')}
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-bold py-3.5 rounded-xl text-center text-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Voltar para Métricas ao Vivo</span>
                </button>

                <button
                  onClick={logout}
                  className="w-full bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-bold py-3.5 rounded-xl text-center text-sm transition-all flex items-center justify-center space-x-2 shadow-lg shadow-rose-950/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair da Minha Conta</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      <PixApoioModal
        isOpen={pixModalOpen}
        onClose={() => setPixModalOpen(false)}
      />
    </div>
  );
}
