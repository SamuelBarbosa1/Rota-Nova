import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { 
  Car, ShieldCheck, UserCheck, CheckCircle2, ArrowRight, MapPin, 
  Sparkles, ShieldAlert, Award, Star, ThumbsUp, Users, Compass, Lock,
  Zap, Leaf, Heart, Crown, Package, Dog, DollarSign, TrendingUp, Navigation
} from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import AddressAutocomplete from '../components/AddressAutocomplete';

export default function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authRole, setAuthRole] = useState('cliente');

  const [quickOrigin, setQuickOrigin] = useState("Eixo Monumental, Bloco A — Brasília, DF");
  const [quickDest, setQuickDest] = useState("Sol Nascente, Trecho 3 (Estrada de Terra) — DF");
  const [quickOriginCoords, setQuickOriginCoords] = useState(null);
  const [quickDestCoords, setQuickDestCoords] = useState(null);
  const [selectedViaCat, setSelectedViaCat] = useState('via_go');
  const [estimatedPrice, setEstimatedPrice] = useState(22.50);
  const [isCalculated, setIsCalculated] = useState(false);

  const viaCategories = [
    {
      id: 'via_go',
      name: 'VIA GO',
      tagline: 'Econômico inteligente',
      desc: 'Carros compactos e preço acessível para o dia a dia.',
      multiplier: 1.0,
      icon: Zap,
      badge: 'Econômico',
      color: 'amber'
    },
    {
      id: 'via_plus',
      name: 'VIA PLUS',
      tagline: 'Mais conforto',
      desc: 'Sedans e carros novos com mais espaço e ar potente.',
      multiplier: 1.3,
      icon: Car,
      badge: 'Conforto',
      color: 'blue'
    },
    {
      id: 'via_eco',
      name: 'VIA ECO',
      tagline: 'Sustentável e tecnológico',
      desc: 'Veículos elétricos e híbridos de baixa emissão.',
      multiplier: 1.45,
      icon: Leaf,
      badge: 'Ecológico',
      color: 'emerald'
    },
    {
      id: 'via_delas',
      name: 'VIA DELAS',
      tagline: 'Exclusiva',
      desc: 'Viagens exclusivas conduzidas por motoristas mulheres.',
      multiplier: 1.3,
      icon: Heart,
      badge: 'Para Elas',
      color: 'rose'
    },
    {
      id: 'via_black',
      name: 'VIA BLACK',
      tagline: 'Executivo premium',
      desc: 'Frota executiva escura com motoristas top de linha.',
      multiplier: 1.9,
      icon: Crown,
      badge: 'Executivo',
      color: 'slate'
    },
    {
      id: 'via_prime',
      name: 'VIA PRIME',
      tagline: 'Luxo e experiência VIP',
      desc: 'Experiência VIP com carros de alto luxo e diferenciais.',
      multiplier: 2.8,
      icon: Sparkles,
      badge: 'VIP Luxo',
      color: 'purple'
    },
    {
      id: 'via_box',
      name: 'VIA BOX',
      tagline: 'Mercado e entregas',
      desc: 'Transporte seguro de compras, malotes e encomendas.',
      multiplier: 0.95,
      icon: Package,
      badge: 'Entregas',
      color: 'orange'
    },
    {
      id: 'via_pet',
      name: 'VIA PET',
      tagline: 'Mobilidade pet friendly',
      desc: 'Veículos equipados com capas para viajar com seu pet.',
      multiplier: 1.5,
      icon: Dog,
      badge: 'Pet Friendly',
      color: 'teal'
    }
  ];

  const openAuth = (role) => {
    if (currentUser) {
      const target = currentUser.role === 'cliente' ? '/cliente' : currentUser.role === 'motorista' ? '/motorista' : currentUser.role === 'investidor' ? '/investidor' : '/admin';
      navigate(target);
    } else {
      setAuthRole(role);
      setAuthModalOpen(true);
    }
  };

  const handleQuickEstimate = (e) => {
    e.preventDefault();
    if (quickOrigin && quickDest) {
      const catObj = viaCategories.find(c => c.id === selectedViaCat) || viaCategories[0];
      const base = 12.0;
      const calc = (base + (quickOrigin.length + quickDest.length) * 0.25) * catObj.multiplier;
      setEstimatedPrice(calc.toFixed(2));
      setIsCalculated(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-24 overflow-hidden border-b border-slate-800/80">
        
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2 bg-amber-950/80 border border-amber-800/60 px-4 py-2 rounded-full text-xs font-semibold text-amber-300 shadow-inner">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Plataforma de Mobilidade Urbana Sem Cancelamentos Indevidos</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                Seu carro chega.<br />
                <span className="text-gradient">Sua corrida não é cancelada.</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl">
                O <strong className="text-white font-semibold">Rota Nova</strong> conecta clientes e motoristas com cadastro simples, entrevista prévia obrigatória e regra rígida de compromisso: <span className="text-amber-400 font-semibold underline decoration-amber-500/50 decoration-2">aceitou a corrida, leva até o destino final</span>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                <button
                  onClick={() => openAuth('cliente')}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-base px-8 py-4 rounded-xl shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  <UserCheck className="w-5 h-5" />
                  <span>Cadastrar como Cliente</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={() => openAuth('motorista')}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-bold text-base px-7 py-4 rounded-xl transition-all flex items-center justify-center space-x-2 hover:border-amber-500/50"
                >
                  <Car className="w-5 h-5 text-amber-400" />
                  <span>Quero Dirigir</span>
                  <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded font-bold">
                    Entrevista
                  </span>
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-800/80 text-slate-400 text-xs sm:text-sm">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Motoristas Entrevistados</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>100% sem discriminação</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>Nota 4.9 de Satisfação</span>
                </div>
              </div>

            </div>

            {/* Right Quick Estimator */}
            <div className="lg:col-span-5">
              <div className="glass-panel p-6 rounded-3xl shadow-2xl border border-slate-800 space-y-6">
                
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-amber-400" />
                    Simular Corrida Agora
                  </h3>
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full font-semibold border border-amber-500/30">
                    Transparência
                  </span>
                </div>

                <form onSubmit={handleQuickEstimate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Ponto de Embarque</label>
                    <AddressAutocomplete
                      value={quickOrigin}
                      onChange={setQuickOrigin}
                      onSelect={(addr, coords) => {
                        setQuickOrigin(addr);
                        if (coords) setQuickOriginCoords(coords);
                      }}
                      icon={MapPin}
                      placeholder="Endereço de partida..."
                      showGpsButton={true}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Ponto de Desembarque (Qualquer CEP)</label>
                    <AddressAutocomplete
                      value={quickDest}
                      onChange={setQuickDest}
                      onSelect={(addr, coords) => {
                        setQuickDest(addr);
                        if (coords) setQuickDestCoords(coords);
                      }}
                      icon={Navigation}
                      placeholder="Endereço de destino..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Modalidade VIA Desejada</label>
                    <div className="relative">
                      <select
                        value={selectedViaCat}
                        onChange={(e) => setSelectedViaCat(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-amber-500 appearance-none cursor-pointer font-medium"
                      >
                        {viaCategories.map(cat => (
                          <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                            {cat.name} — {cat.tagline}
                          </option>
                        ))}
                      </select>
                      <Car className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-amber-500/20"
                  >
                    Calcular Estimativa da Corrida
                  </button>
                </form>

                {isCalculated && (
                  <div className="bg-amber-950/60 border border-amber-800/80 p-4 rounded-2xl space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-300 block">Estimativa {viaCategories.find(c=>c.id===selectedViaCat)?.name}:</span>
                        <span className="text-[10px] text-amber-400 font-medium">{viaCategories.find(c=>c.id===selectedViaCat)?.tagline}</span>
                      </div>
                      <span className="text-2xl font-black text-amber-400">R$ {estimatedPrice}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 border-t border-amber-900/50 pt-2">
                      Garantia Rota Nova: Sem cancelamento indevido. O motorista leva você até o ponto final selecionado.
                    </p>
                    <button
                      onClick={() => openAuth('cliente')}
                      className="w-full text-center bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl text-xs transition-colors mt-2 shadow-md"
                    >
                      Criar Conta e Chamar {viaCategories.find(c=>c.id===selectedViaCat)?.name}
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 1.5 VIA MODALITIES SHOWCASE SECTION */}
      <section className="py-20 bg-slate-950 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
              Frota & Versões Disponíveis
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Mobilidade Sob Medida para Qualquer Momento</h2>
            <p className="text-slate-400 text-base">
              Escolha a opção VIA ideal para o seu perfil: de corridas hiper econômicas até entregas, transporte pet friendly e carros executivos VIP.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {viaCategories.map((cat) => {
              const IconComponent = cat.icon || Car;
              return (
                <div key={cat.id} className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-amber-500/50 transition-all duration-300 group flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700 text-amber-400">
                        {cat.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl font-black text-white">{cat.name}</h3>
                      <p className="text-xs font-bold text-amber-400/90 mt-0.5">{cat.tagline}</p>
                    </div>

                    <p className="text-slate-400 text-xs leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Mul. Tarifa: <strong className="text-slate-200">{cat.multiplier}x</strong></span>
                    <button
                      onClick={() => openAuth('cliente')}
                      className="text-xs font-bold text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1"
                    >
                      <span>Pedir</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 1.8 PAINEL PÚBLICO DE TRANSPARÊNCIA & INDICADORES AO VIVO */}
      <section className="py-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
              ● Transparência em Tempo Real
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Resultados & Indicadores de Impacto</h2>
            <p className="text-slate-400 text-base">
              Acompanhe ao vivo a expansão da comunidade Rota Nova: movimentação financeira diária, número de passageiros e motoristas validados.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Usuários Cadastrados</span>
                <Users className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-3xl font-black text-white">292.526</p>
              <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                <span>+5 novos cadastros hoje</span>
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Vendas / Volume Diário</span>
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-3xl font-black text-white">R$ 1.766,71</p>
              <p className="text-[11px] text-slate-400 font-medium">
                R$ 3.068.722,58 acumulado total
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Motoristas Qualificados</span>
                <UserCheck className="w-5 h-5 text-amber-400" />
              </div>
              <p className="text-3xl font-black text-white">3.840</p>
              <p className="text-[11px] text-amber-300 font-medium">
                100% com entrevista de conduta
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Taxa de Conclusão</span>
                <Award className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-3xl font-black text-white">100%</p>
              <p className="text-[11px] text-slate-400 font-medium">
                Sem recusa por bairro ou ladeira
              </p>
            </div>

          </div>

          {/* CALL TO ACTION FOR INVESTORS & SUPPORTERS */}
          <div className="glass-panel p-8 rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Quer fazer parte da evolução?</span>
              <h3 className="text-2xl font-black text-white">Acesse o Portal do Investidor e Apoiador</h3>
              <p className="text-xs text-slate-300 max-w-xl">
                Acompanhe o relatório completo de métricas financeiras, linha do tempo de atualizações e oportunidades de co-investimento.
              </p>
            </div>

            <Link
              to="/investidor"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-4 rounded-xl shadow-xl shadow-amber-500/20 text-xs transition-all whitespace-nowrap flex items-center space-x-2 shrink-0"
            >
              <span>Acessar Portal do Investidor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* 2. CORE DIFFERENTIATION CARDS GRID */}
      <section className="py-20 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Como funciona o Rota Nova</h2>
            <p className="text-3xl sm:text-4xl font-black text-white">Mobilidade urbana com respeito total</p>
            <p className="text-slate-400 text-base">
              Conheça os pilares que garantem viagens tranquilas para passageiros e ganhos justos para motoristas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Cadastro de Cliente</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Crie sua conta em menos de 1 minuto, salve seus locais favoritos e acesse o Dashboard do Passageiro.
              </p>
              <button
                onClick={() => openAuth('cliente')}
                className="inline-flex items-center text-xs font-bold text-amber-400 hover:underline"
              >
                <span>Criar conta de cliente</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Cadastro de Motorista</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Envio simples de CNH e documento do veículo para iniciar a verificação de segurança.
              </p>
              <button
                onClick={() => openAuth('motorista')}
                className="inline-flex items-center text-xs font-bold text-amber-400 hover:underline"
              >
                <span>Cadastrar-se como motorista</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Entrevista Obrigatória</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Questionário ético interativo que avalia conduta e regras antes da liberação da conta.
              </p>
              <Link to="/regras" className="inline-flex items-center text-xs font-bold text-amber-400 hover:underline">
                <span>Ver diretrizes</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Sem Cancelamento</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Aceitou, levou. Transparência total e regras rígidas para proteger o cliente.
              </p>
              <Link to="/regras" className="inline-flex items-center text-xs font-bold text-amber-400 hover:underline">
                <span>Ler regulamento completo</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 3. HIGHLIGHT RULE BANNER SECTION */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/60 rounded-3xl border border-amber-500/30 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            
            <div className="max-w-3xl space-y-6 relative z-10">
              <div className="inline-flex items-center space-x-2 bg-amber-500/20 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-300">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Regra Principal do Aplicativo</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Depois de aceitar a corrida, o motorista não cancela por causa do destino.
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                Seja o destino no centro, em um bairro afastado, comunidade, viela ou rua de terra: <strong className="text-amber-400">recusar passageiros por localização é infração grave.</strong>
              </p>

              <Link
                to="/regras"
                className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm transition-all shadow-lg"
              >
                <span>Ver Todas as Regras e Penalidades</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* RADAR MAP PREVIEW */}
      <section className="py-16 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Cobertura & Rastreamento</span>
              <h2 className="text-3xl font-black text-white">Radar de Mobilidade em Tempo Real</h2>
            </div>
          </div>
          <InteractiveMap
            origin="Eixo Monumental, Bloco A — Brasília, DF"
            destination="Setor Habitacional Sol Nascente, Chácara 45 (Entrada de Chão) — DF"
            status="idle"
            driverName="Carlos Silva (Nota 4.96)"
            vehicle="Hyundai HB20 — ABC-9876"
            etaMinutes={8}
            distanceKm="6.2"
          />
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialRole={authRole}
      />

    </div>
  );
}
