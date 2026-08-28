import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { 
  User, MapPin, Navigation, Car, ShieldCheck, Clock, CreditCard, 
  CheckCircle2, Star, Download, Sparkles, AlertCircle, History, Send, 
  TrendingUp, DollarSign, Heart, Bookmark, Plus, FileText, ArrowRight, Lock 
} from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';

export default function Cliente() {
  const { currentUser, switchRole, addClientCompletedTrip } = useAuth();
  
  // Timeout refs to manage simulated ride state cleanly and prevent background bugs
  const searchTimeoutRef = useRef(null);
  const routeTimeoutRef = useRef(null);
  const transitTimeoutRef = useRef(null);

  const clearAllTimeouts = () => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (routeTimeoutRef.current) clearTimeout(routeTimeoutRef.current);
    if (transitTimeoutRef.current) clearTimeout(transitTimeoutRef.current);
  };

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);
  const [activeTab, setActiveTab] = useState('pedir'); // 'pedir' | 'dash' | 'historico'
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Ride Request state
  const [origin, setOrigin] = useState('Eixo Monumental, Bloco A — Brasília, DF');
  const [destination, setDestination] = useState('Sol Nascente, Trecho 3, Chácara 28 (Estrada de Chão) — DF');
  const [selectedCategory, setSelectedCategory] = useState('pop');
  const [paymentMethod, setPaymentMethod] = useState('pix');

  // Live Ride Simulation
  const [rideStatus, setRideStatus] = useState('idle'); // 'idle' | 'searching' | 'driver_en_route' | 'in_transit' | 'completed'
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // Favorites
  const [favorites, setFavorites] = useState(() => currentUser?.stats?.savedLocations || []);
  const [newFavName, setNewFavName] = useState('');
  const [newFavAddress, setNewFavAddress] = useState('');

  // History state
  const [tripHistory, setTripHistory] = useState(() => currentUser?.stats?.tripHistory || []);

  useEffect(() => {
    if (currentUser?.stats) {
      setFavorites(currentUser.stats.savedLocations || []);
      setTripHistory(currentUser.stats.tripHistory || []);
    }
  }, [currentUser]);

  const totalSpentCalculated = tripHistory.reduce((acc, t) => acc + (typeof t.price === 'number' ? t.price : parseFloat(t.price) || 0), 0);

  const popSpentCalculated = tripHistory.filter(t => t.category?.includes('Pop')).reduce((acc, t) => acc + (typeof t.price === 'number' ? t.price : parseFloat(t.price) || 0), 0);
  const comfortSpentCalculated = tripHistory.filter(t => t.category?.includes('Comfort')).reduce((acc, t) => acc + (typeof t.price === 'number' ? t.price : parseFloat(t.price) || 0), 0);
  const xlSpentCalculated = tripHistory.filter(t => t.category?.includes('XL')).reduce((acc, t) => acc + (typeof t.price === 'number' ? t.price : parseFloat(t.price) || 0), 0);

  const totalCatSpent = popSpentCalculated + comfortSpentCalculated + xlSpentCalculated;
  const popPct = totalCatSpent > 0 ? Math.round((popSpentCalculated / totalCatSpent) * 100) : 0;
  const comfortPct = totalCatSpent > 0 ? Math.round((comfortSpentCalculated / totalCatSpent) * 100) : 0;
  const xlPct = totalCatSpent > 0 ? Math.round((xlSpentCalculated / totalCatSpent) * 100) : 0;

  const handleAddFavorite = (e) => {
    e.preventDefault();
    if (!newFavName || !newFavAddress) return;
    const newFav = {
      id: Date.now(),
      name: newFavName,
      address: newFavAddress
    };
    setFavorites(prev => [...prev, newFav]);
    setNewFavName('');
    setNewFavAddress('');
  };

  const categories = [
    {
      id: 'pop',
      name: 'Rota Nova Pop',
      desc: 'Carros compactos e muito econômicos',
      price: 24.50,
      eta: '3 min'
    },
    {
      id: 'comfort',
      name: 'Rota Nova Comfort',
      desc: 'Sedans novos com ar-condicionado reforçado',
      price: 31.90,
      eta: '2 min'
    },
    {
      id: 'xl',
      name: 'Rota Nova XL',
      desc: 'Até 6 passageiros ou malas volumosas',
      price: 42.00,
      eta: '5 min'
    }
  ];

  // GATEKEEPER LOCK SCREEN IF UNAUTHENTICATED OR NOT A CLIENT
  if (!currentUser || currentUser.role !== 'cliente') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-16 flex items-center justify-center">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
            
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mx-auto flex items-center justify-center">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Área Restrita do Passageiro</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Crie sua conta para acessar o Dashboard do Cliente
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Para pedir corridas sem risco de cancelamento, acompanhar o motorista no mapa ao vivo e monitorar seus gastos acumulados, acesse ou crie sua conta de passageiro.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl shadow-xl shadow-amber-500/20 text-sm transition-all flex items-center justify-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Criar Conta de Cliente</span>
              </button>

              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold py-4 rounded-xl text-sm transition-colors"
              >
                Já tenho conta (Entrar)
              </button>
            </div>

          </div>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialRole="cliente"
        />
      </div>
    );
  }

  const handleCancelRide = () => {
    clearAllTimeouts();
    setRideStatus('idle');
  };

  const handleRequestRide = (e) => {
    e.preventDefault();
    if (!origin || !destination) return;

    // Clear any previous running simulation timers
    clearAllTimeouts();

    setRideStatus('searching');

    // 1. Calculating/Finding driver: 4 seconds
    searchTimeoutRef.current = setTimeout(() => {
      setRideStatus('driver_en_route');
    }, 4000);

    // 2. Driver en route: 7 seconds (takes 4 + 7 = 11 seconds total)
    routeTimeoutRef.current = setTimeout(() => {
      setRideStatus('in_transit');
    }, 11000);

    // 3. In transit simulation: 15 seconds (takes 11 + 15 = 26 seconds total)
    transitTimeoutRef.current = setTimeout(() => {
      setRideStatus('completed');
      setShowRatingModal(true);

      const priceVal = categories.find(c => c.id === selectedCategory)?.price || 24.50;
      const newTrip = {
        id: `ROT-${Math.floor(1000 + Math.random() * 9000)}`,
        date: 'Hoje, agora mesmo',
        origin: origin,
        destination: destination,
        price: priceVal,
        driver: 'Carlos Eduardo (Toyota Corolla - ABC-1D23)',
        category: categories.find(c => c.id === selectedCategory)?.name || 'Rota Nova Pop',
        status: 'Concluída'
      };
      setTripHistory(prev => [newTrip, ...prev]);
      if (addClientCompletedTrip) {
        addClientCompletedTrip(newTrip);
      }

    }, 26000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 selection:bg-amber-500 selection:text-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* HEADER DO DASHBOARD DO CLIENTE (AUTENTICADO) */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-2xl shadow-lg">
              {(currentUser?.name || 'CL').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-400 bg-amber-950 border border-amber-800 px-2.5 py-0.5 rounded-full">
                  ✓ CLIENTE CADASTRADO & AUTENTICADO
                </span>
              </div>
              <h1 className="text-3xl font-black text-white mt-1">
                Dashboard do Cliente — {currentUser?.name || 'Cliente'}
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                {currentUser?.email || ''} • {currentUser?.phone || ''}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-stretch sm:self-auto overflow-x-auto">
            <button
              onClick={() => setActiveTab('pedir')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'pedir'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Navigation className="w-4 h-4" />
              <span>Pedir Corrida</span>
            </button>

            <button
              onClick={() => setActiveTab('dash')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'dash'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Gastos & Estatísticas</span>
            </button>

            <button
              onClick={() => setActiveTab('historico')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
                activeTab === 'historico'
                  ? 'bg-amber-500 text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Viagens & Recibos</span>
            </button>
          </div>

        </div>

        {/* TAB 1: PEDIR CORRIDA & MAPA */}
        {activeTab === 'pedir' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Car className="w-5 h-5 text-amber-400" />
                    Solicitar Corrida Rota Nova
                  </h3>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-500/30">
                    Sem cancelamento
                  </span>
                </div>

                {/* Quick Favorites */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-400 font-semibold">Usar Local Favorito:</span>
                  <div className="flex flex-wrap gap-2">
                    {favorites.map((fav) => (
                      <button
                        key={fav.id}
                        type="button"
                        onClick={() => setDestination(fav.address)}
                        className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5 text-amber-400" />
                        <span>{fav.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleRequestRide} className="space-y-4">
                  
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Origem (Ponto de Embarque)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        disabled={rideStatus !== 'idle'}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-amber-500"
                        required
                      />
                      <MapPin className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Destino Final (Sem restrição de CEP)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        disabled={rideStatus !== 'idle'}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-amber-500"
                        required
                      />
                      <Navigation className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-2 pt-1">
                    <label className="block text-xs font-semibold text-slate-400">Selecione a Categoria</label>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <div
                          key={cat.id}
                          onClick={() => rideStatus === 'idle' && setSelectedCategory(cat.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            selectedCategory === cat.id
                              ? 'bg-amber-950/60 border-amber-500 text-white'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${selectedCategory === cat.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                              <Car className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold">{cat.name}</p>
                              <p className="text-[10px] text-slate-400">{cat.desc}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-black text-amber-400">R$ {cat.price.toFixed(2)}</p>
                            <p className="text-[10px] text-slate-400">{cat.eta}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Pagamento</label>
                    <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('pix')}
                        className={`py-2 rounded-lg border transition-colors ${
                          paymentMethod === 'pix' ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        PIX
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cartao')}
                        className={`py-2 rounded-lg border transition-colors ${
                          paymentMethod === 'cartao' ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        Cartão
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('dinheiro')}
                        className={`py-2 rounded-lg border transition-colors ${
                          paymentMethod === 'dinheiro' ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        Dinheiro
                      </button>
                    </div>
                  </div>

                  {rideStatus === 'idle' ? (
                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl shadow-xl shadow-amber-500/20 transition-all text-base flex items-center justify-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                      <span>Chamar Motorista Rota Nova</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCancelRide}
                      className="w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 font-bold py-3 rounded-xl text-xs transition-colors"
                    >
                      Cancelar Solicitação
                    </button>
                  )}

                </form>

              </div>
            </div>

            {/* Map */}
            <div className="lg:col-span-7 space-y-6">
              <InteractiveMap
                origin={origin}
                destination={destination}
                status={rideStatus}
                driverName="Carlos Eduardo (Nota 4.98)"
                vehicle="Toyota Corolla • Placa ABC-1D23"
                etaMinutes={5}
                distanceKm="5.4"
              />

              <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-8 h-8 text-amber-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Garantia Rota Nova sem Recusas</h4>
                    <p className="text-xs text-slate-400">O motorista é obrigado a levar você até o endereço solicitado.</p>
                  </div>
                </div>
                <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
                  Ativo 24h
                </span>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: GASTOS & ESTATÍSTICAS */}
        {activeTab === 'dash' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400 font-semibold uppercase">Total Gasto em Corridas</p>
                <p className="text-3xl font-black text-amber-400 mt-2">R$ {totalSpentCalculated.toFixed(2)}</p>
                <p className="text-[11px] text-slate-400 mt-1">Acumulado em {tripHistory.length} viagens</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400 font-semibold uppercase">Corridas Realizadas</p>
                <p className="text-3xl font-black text-white mt-2">{tripHistory.length}</p>
                <p className="text-[11px] text-amber-400 mt-1">100% Concluídas sem cancelamento</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400 font-semibold uppercase">Sua Nota como Passageiro</p>
                <p className="text-3xl font-black text-amber-400 mt-2">
                  {tripHistory.length > 0 ? `${currentUser?.stats?.ratingGiven || 5.0} ★` : (currentUser?.isDemo ? '4.95 ★' : 'Novo')}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {tripHistory.length > 0 || currentUser?.isDemo 
                    ? 'Excelente perfil avaliado pelos motoristas' 
                    : 'Nota atribuída após suas primeiras viagens'}
                </p>
              </div>

              <div className="glass-panel p-6 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400 font-semibold uppercase">Locais Salvos</p>
                <p className="text-3xl font-black text-amber-400 mt-2">{favorites.length}</p>
                <p className="text-[11px] text-slate-400 mt-1">Atalhos rápidos para pedido</p>
              </div>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  Distribuição de Gastos por Categoria
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                      <span>Rota Nova Pop (Econômico)</span>
                      <span>R$ {popSpentCalculated.toFixed(2).replace('.', ',')} ({popPct}%)</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-3">
                      <div className="bg-amber-500 h-3 rounded-full transition-all duration-500" style={{ width: `${popPct}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                      <span>Rota Nova Comfort (Sedan/SUV)</span>
                      <span>R$ {comfortSpentCalculated.toFixed(2).replace('.', ',')} ({comfortPct}%)</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-3">
                      <div className="bg-amber-400 h-3 rounded-full transition-all duration-500" style={{ width: `${comfortPct}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                      <span>Rota Nova XL (Até 6 Passageiros)</span>
                      <span>R$ {xlSpentCalculated.toFixed(2).replace('.', ',')} ({xlPct}%)</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-3">
                      <div className="bg-amber-600 h-3 rounded-full transition-all duration-500" style={{ width: `${xlPct}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Favorites Management */}
              <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-amber-400" />
                  Gerenciar Endereços Favoritos
                </h3>

                <div className="space-y-3">
                  {favorites.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4">Nenhum endereço favorito salvo ainda. Adicione um abaixo!</p>
                  ) : (
                    favorites.map((fav) => (
                      <div key={fav.id} className="glass-card p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-white">{fav.name}</p>
                          <p className="text-slate-400 mt-0.5">{fav.address}</p>
                        </div>
                        <button
                          onClick={() => {
                            setDestination(fav.address);
                            setActiveTab('pedir');
                          }}
                          className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 font-bold px-3 py-1.5 rounded-lg border border-amber-500/30 transition-colors"
                        >
                          Usar
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddFavorite} className="pt-3 border-t border-slate-800 space-y-3">
                  <p className="text-xs font-bold text-white">Adicionar Novo Local Favorito</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nome (Ex: Casa da Mãe)"
                      value={newFavName}
                      onChange={(e) => setNewFavName(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="Endereço Completo"
                      value={newFavAddress}
                      onChange={(e) => setNewFavAddress(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-slate-800 text-amber-400 font-bold py-2 rounded-xl text-xs border border-amber-500/30 flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Salvar Novo Local</span>
                  </button>
                </form>

              </div>

            </div>

          </div>
        )}

        {/* TAB 3: VIAGENS & RECIBOS */}
        {activeTab === 'historico' && (
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 animate-fadeIn">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-400" />
              Histórico de Viagens & Comprovantes
            </h3>

            <div className="space-y-4">
              {tripHistory.length === 0 ? (
                <div className="text-center py-12 text-slate-500 space-y-3">
                  <FileText className="w-12 h-12 mx-auto text-slate-700" />
                  <p className="text-sm font-bold text-slate-300">Nenhuma corrida realizada ainda</p>
                  <p className="text-xs text-slate-400">Solicite sua primeira viagem sem cancelamento na aba "Solicitar Viagem"!</p>
                </div>
              ) : (
                tripHistory.map((trip) => (
                  <div key={trip.id} className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2.5 py-0.5 rounded border border-amber-500/30">
                          {trip.id}
                        </span>
                        <span className="text-xs text-slate-400">{trip.date} • {trip.category}</span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm text-slate-200 font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          {trip.origin}
                        </p>
                        <p className="text-sm text-slate-200 font-semibold flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          {trip.destination}
                        </p>
                      </div>

                      <p className="text-xs text-slate-400">Motorista Parceiro: <strong className="text-slate-300">{trip.driver}</strong></p>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between">
                      <span className="text-xl font-black text-amber-400">
                        R$ {typeof trip.price === 'number' ? trip.price.toFixed(2) : trip.price}
                      </span>
                      <button className="text-xs text-amber-400 hover:underline flex items-center gap-1 mt-1">
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar Recibo PDF</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="glass-panel max-w-md w-full p-6 rounded-3xl border border-amber-500/40 text-center space-y-5">
            <CheckCircle2 className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-2xl font-black text-white">Corrida Concluída!</h3>
            <div className="flex justify-center space-x-2 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRatingStars(star)} className="p-1 hover:scale-125">
                  <Star className={`w-8 h-8 ${star <= ratingStars ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setShowRatingModal(false);
                setRideStatus('idle');
              }}
              className="w-full bg-amber-500 text-slate-950 font-black py-3 rounded-xl text-sm"
            >
              Confirmar e Salvar no Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
