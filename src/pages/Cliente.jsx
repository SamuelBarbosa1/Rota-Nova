import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { 
  User, MapPin, Navigation, Car, ShieldCheck, Clock, CreditCard, 
  CheckCircle2, Star, Download, Sparkles, AlertCircle, History, Send, 
  TrendingUp, DollarSign, Heart, Bookmark, Plus, FileText, ArrowRight, Lock,
  Zap, Leaf, Crown, Package, Dog, LogOut, Crosshair
} from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';
import AddressAutocomplete from '../components/AddressAutocomplete';
import { RideService } from '../services/api';
import { supabase, isSupabaseConfigured } from '../services/supabase';

export default function Cliente() {
  const { currentUser, switchRole, addClientCompletedTrip, activeTab, setActiveTab, logout } = useAuth();
  
  // Timeout refs to manage simulated ride state cleanly and prevent background bugs
  const searchTimeoutRef = useRef(null);
  const routeTimeoutRef = useRef(null);
  const transitTimeoutRef = useRef(null);
  const unsubscribeRideRef = useRef(null);
  const [activeRideId, setActiveRideId] = useState(null);
  const [assignedDriver, setAssignedDriver] = useState({
    name: "Motorista Parceiro Rota Nova",
    vehicle: "Carro Cadastrado"
  });

  const clearAllTimeouts = () => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (routeTimeoutRef.current) clearTimeout(routeTimeoutRef.current);
    if (transitTimeoutRef.current) clearTimeout(transitTimeoutRef.current);
  };

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  // Validate activeTab on mount or role switch
  useEffect(() => {
    const validTabs = ['pedir', 'dash', 'historico', 'menu'];
    if (!validTabs.includes(activeTab)) {
      setActiveTab('pedir');
    }
  }, [activeTab, setActiveTab]);

  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Ride Request state with real coords & dynamic distance
  const [origin, setOrigin] = useState('Eixo Monumental, Bloco A — Brasília, DF');
  const [destination, setDestination] = useState('Sol Nascente, Trecho 3, Chácara 28 (Estrada de Chão) — DF');
  const [originCoords, setOriginCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [calculatedDistance, setCalculatedDistance] = useState('5.4');
  const [calculatedEta, setCalculatedEta] = useState(7);

  const [selectedCategory, setSelectedCategory] = useState('via_go');
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

  // Dynamic VIA categories pricing based on actual real route distance
  const numDist = parseFloat(calculatedDistance) || 5.4;
  const categories = [
    {
      id: 'via_go',
      name: 'VIA GO',
      tagline: 'Econômico inteligente',
      desc: 'Carros compactos e super econômicos para o dia a dia',
      price: Math.max(14.0, 7.50 + numDist * 2.50),
      eta: `${Math.max(2, Math.round(numDist * 1.3))} min`,
      icon: Zap,
      badge: 'Econômico',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'via_plus',
      name: 'VIA PLUS',
      tagline: 'Mais conforto',
      desc: 'Sedans e hatches espaçosos com ar-condicionado forte',
      price: Math.max(18.0, 9.50 + numDist * 3.30),
      eta: `${Math.max(2, Math.round(numDist * 1.2))} min`,
      icon: Car,
      badge: 'Conforto',
      badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    },
    {
      id: 'via_eco',
      name: 'VIA ECO',
      tagline: 'Sustentável e tecnológico',
      desc: 'Veículos elétricos e híbridos de baixíssima emissão',
      price: Math.max(20.0, 10.50 + numDist * 3.60),
      eta: `${Math.max(3, Math.round(numDist * 1.4))} min`,
      icon: Leaf,
      badge: 'Ecológico',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'via_delas',
      name: 'VIA DELAS',
      tagline: 'Exclusiva',
      desc: 'Modalidade conduzida por motoristas mulheres parceiras',
      price: Math.max(18.0, 9.50 + numDist * 3.30),
      eta: `${Math.max(2, Math.round(numDist * 1.2))} min`,
      icon: Heart,
      badge: 'Para Elas',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      id: 'via_black',
      name: 'VIA BLACK',
      tagline: 'Executivo premium',
      desc: 'Carros executivos pretos com ar dual zone e condutores 5 estrelas',
      price: Math.max(28.0, 15.00 + numDist * 4.80),
      eta: `${Math.max(3, Math.round(numDist * 1.3))} min`,
      icon: Crown,
      badge: 'Executivo',
      badgeBg: 'bg-slate-700/50 text-slate-200 border-slate-600'
    },
    {
      id: 'via_prime',
      name: 'VIA PRIME',
      tagline: 'Luxo e experiência VIP',
      desc: 'Carros de alto luxo, água cortesia e atendimento VIP exclusivo',
      price: Math.max(45.0, 25.00 + numDist * 6.50),
      eta: `${Math.max(4, Math.round(numDist * 1.4))} min`,
      icon: Sparkles,
      badge: 'VIP Luxo',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    {
      id: 'via_box',
      name: 'VIA BOX',
      tagline: 'Mercado e entregas',
      desc: 'Transporte dedicado de compras de mercado, caixas e encomendas',
      price: Math.max(15.0, 8.00 + numDist * 2.40),
      eta: `${Math.max(3, Math.round(numDist * 1.3))} min`,
      icon: Package,
      badge: 'Entregas',
      badgeBg: 'bg-amber-600/20 text-amber-400 border-amber-600/30'
    },
    {
      id: 'via_pet',
      name: 'VIA PET',
      tagline: 'Mobilidade pet friendly',
      desc: 'Veículos preparados com mantas especiais para seu pet',
      price: Math.max(22.0, 11.00 + numDist * 3.80),
      eta: `${Math.max(4, Math.round(numDist * 1.4))} min`,
      icon: Dog,
      badge: 'Pet Friendly',
      badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30'
    }
  ];

  const parsePrice = (priceVal) => {
    if (typeof priceVal === 'number') return priceVal;
    if (!priceVal) return 0;
    const cleanStr = String(priceVal).replace(/[^\d.,]/g, '').replace(',', '.');
    return parseFloat(cleanStr) || 0;
  };

  const totalSpentCalculated = tripHistory.reduce((acc, t) => acc + parsePrice(t.price), 0);

  const getCategorySpent = (catName) => {
    return tripHistory
      .filter(t => t.category && t.category.toLowerCase().includes(catName.toLowerCase()))
      .reduce((acc, t) => acc + parsePrice(t.price), 0);
  };

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
    if (activeRideId) {
      RideService.cancelRide(activeRideId);
      setActiveRideId(null);
    }
    if (unsubscribeRideRef.current) {
      unsubscribeRideRef.current();
      unsubscribeRideRef.current = null;
    }
    setRideStatus('idle');
  };

  const handleStartTransit = () => {
    clearAllTimeouts();
    setRideStatus('in_transit');
    if (activeRideId) {
      RideService.updateRideStatus(activeRideId, 'in_transit');
    }
    
    // Smooth realistic transit duration (35s) or user can click to complete immediately
    transitTimeoutRef.current = setTimeout(() => {
      handleCompleteRide();
    }, 35000);
  };

  const handleCompleteRide = () => {
    clearAllTimeouts();
    setRideStatus('completed');
    setShowRatingModal(true);

    const priceVal = categories.find(c => c.id === selectedCategory)?.price || 24.50;
    const newTrip = {
      id: activeRideId || `ROT-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Hoje, agora mesmo',
      origin: origin,
      destination: destination,
      price: priceVal,
      driver: `${assignedDriver.name} (${assignedDriver.vehicle})`,
      category: categories.find(c => c.id === selectedCategory)?.name || 'VIA GO',
      status: 'Concluída'
    };
    setTripHistory(prev => [newTrip, ...prev]);
    if (addClientCompletedTrip) {
      addClientCompletedTrip(newTrip);
    }
    if (activeRideId) {
      RideService.completeRide(activeRideId, {
        driverId: 'drv_roberto',
        finalPrice: priceVal,
        rating: 5,
        comment: 'Corrida finalizada com sucesso'
      });
      setActiveRideId(null);
    }
    if (unsubscribeRideRef.current) {
      unsubscribeRideRef.current();
      unsubscribeRideRef.current = null;
    }
  };

  const handleSimulateDriverAccept = () => {
    clearAllTimeouts();
    setAssignedDriver({
      name: "Motorista Parceiro Demonstrativo (Nota 4.99)",
      vehicle: "Toyota Etios Sedan • Placa RTA-2026"
    });
    setRideStatus('driver_en_route');

    routeTimeoutRef.current = setTimeout(() => {
      setRideStatus('driver_arrived');
      transitTimeoutRef.current = setTimeout(() => {
        handleStartTransit();
      }, 4500);
    }, 12000);
  };

  const handleRequestRide = async (e) => {
    e.preventDefault();
    if (!origin || !destination) return;

    clearAllTimeouts();
    setRideStatus('searching');

    const activeCat = categories.find(c => c.id === selectedCategory);
    const priceVal = activeCat?.price || 24.50;

    // Salvar corrida real no Supabase
    try {
      const res = await RideService.requestRide({
        clientId: currentUser?.id,
        clientName: currentUser?.name || 'Passageiro Rota Nova',
        clientPhone: currentUser?.phone,
        origin: { address: origin, lat: originCoords?.lat, lng: originCoords?.lng },
        destination: { address: destination, lat: destCoords?.lat, lng: destCoords?.lng },
        category: selectedCategory,
        categoryName: activeCat?.name || 'VIA GO',
        price: priceVal,
        distanceKm: calculatedDistance,
        durationMinutes: calculatedEta,
        paymentMethod
      });

      if (res?.rideId) {
        setActiveRideId(res.rideId);
        
        // Ouvir em tempo real se um motorista aceitar esta corrida no Supabase
        const unsub = RideService.subscribeToRide(res.rideId, async (updated) => {
          if (updated.status === 'driver_en_route') {
            clearAllTimeouts();
            // Buscar dados reais do motorista que aceitou
            if (updated.driver_id && isSupabaseConfigured && supabase) {
              const { data: drv } = await supabase
                .from('driver_profiles')
                .select('*, users(name)')
                .eq('id', updated.driver_id)
                .maybeSingle();

              if (drv) {
                setAssignedDriver({
                  name: `${drv.users?.name || 'Motorista Parceiro'} (Nota ${Number(drv.rating || 5).toFixed(2)})`,
                  vehicle: `${drv.car_model || 'Veículo'} • Placa ${drv.car_plate || ''}`
                });
              }
            }
            setRideStatus('driver_en_route');
          } else if (updated.status === 'in_transit') {
            clearAllTimeouts();
            setRideStatus('in_transit');
          } else if (updated.status === 'completed') {
            handleCompleteRide();
          }
        });
        unsubscribeRideRef.current = unsub;
      }
    } catch (err) {
      console.error('Erro ao chamar RideService.requestRide:', err);
    }
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
                        onClick={() => {
                          setDestination(fav.address);
                          setDestCoords(null);
                        }}
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
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-400">Origem (Ponto de Embarque)</label>
                      <span className="text-[10px] text-amber-400/80 font-medium flex items-center gap-1">
                        <Crosshair className="w-3 h-3" />
                        <span>GPS / Busca Real</span>
                      </span>
                    </div>
                    <AddressAutocomplete
                      value={origin}
                      onChange={setOrigin}
                      onSelect={(addr, coords) => {
                        setOrigin(addr);
                        if (coords) setOriginCoords(coords);
                      }}
                      icon={MapPin}
                      placeholder="Buscar rua, quadra ou CEP de partida..."
                      showGpsButton={true}
                      disabled={rideStatus !== 'idle'}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Destino Final (Sem restrição de CEP)</label>
                    <AddressAutocomplete
                      value={destination}
                      onChange={setDestination}
                      onSelect={(addr, coords) => {
                        setDestination(addr);
                        if (coords) setDestCoords(coords);
                      }}
                      icon={Navigation}
                      placeholder="Para onde vamos? (Qualquer bairro, rua ou terra)"
                      disabled={rideStatus !== 'idle'}
                      required
                    />
                  </div>

                  {/* Categories */}
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-300">Selecione a Modalidade VIA</label>
                      <span className="text-[10px] text-amber-400 font-semibold">{calculatedDistance} km • {calculatedEta} min</span>
                    </div>
                    <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                      {categories.map((cat) => {
                        const IconComp = cat.icon || Car;
                        const isSelected = selectedCategory === cat.id;
                        return (
                          <div
                            key={cat.id}
                            onClick={() => rideStatus === 'idle' && setSelectedCategory(cat.id)}
                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-amber-950/60 border-amber-500 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                            }`}
                          >
                            <div className="flex items-center space-x-3.5">
                              <div className={`p-2.5 rounded-xl border shrink-0 ${isSelected ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800/80 text-amber-400 border-slate-700'}`}>
                                <IconComp className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <p className="text-xs font-black text-white tracking-wide">{cat.name}</p>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${cat.badgeBg}`}>
                                    {cat.badge}
                                  </span>
                                </div>
                                <p className="text-[11px] font-semibold text-amber-400/90 mt-0.5">{cat.tagline}</p>
                                <p className="text-[10px] text-slate-400 line-clamp-1">{cat.desc}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0 pl-2">
                              <p className="text-sm font-black text-amber-400">R$ {cat.price.toFixed(2)}</p>
                              <p className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {cat.eta}
                              </p>
                            </div>
                          </div>
                        );
                      })}
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

                  {rideStatus === 'idle' && (
                    <button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-4 rounded-xl shadow-xl shadow-amber-500/20 transition-all text-base flex items-center justify-center space-x-2"
                    >
                      <Send className="w-5 h-5" />
                      <span>Chamar Motorista Rota Nova</span>
                    </button>
                  )}

                  {rideStatus === 'driver_arrived' && (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleStartTransit}
                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3.5 rounded-xl shadow-xl shadow-emerald-500/20 transition-all text-sm flex items-center justify-center space-x-2 animate-pulse"
                      >
                        <Car className="w-4 h-4" />
                        <span>Entrar no Carro & Iniciar Viagem</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelRide}
                        className="w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 font-bold py-2.5 rounded-xl text-xs transition-colors"
                      >
                        Cancelar Corrida
                      </button>
                    </div>
                  )}

                  {rideStatus === 'in_transit' && (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={handleCompleteRide}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-xl shadow-xl shadow-amber-500/20 transition-all text-sm flex items-center justify-center space-x-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Concluir Viagem / Chegar ao Destino</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelRide}
                        className="w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 font-bold py-2.5 rounded-xl text-xs transition-colors"
                      >
                        Cancelar Corrida
                      </button>
                    </div>
                  )}

                  {rideStatus === 'searching' && (
                    <div className="space-y-3">
                      <div className="p-4 bg-slate-900/90 border border-amber-500/40 rounded-2xl space-y-2 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Aguardando no Radar</span>
                        </div>
                        <p className="text-xs text-slate-300">
                          Sua chamada está ativa no banco de dados e aguardando um motorista aceitar no Cockpit!
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleSimulateDriverAccept}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
                      >
                        ⚡ Simular Motorista Aceitando (Teste Rápido)
                      </button>
                    </div>
                  )}

                  {(rideStatus === 'searching' || rideStatus === 'driver_en_route') && (
                    <button
                      type="button"
                      onClick={handleCancelRide}
                      className="w-full bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 font-bold py-3.5 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Cancelar Solicitação</span>
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
                originCoords={originCoords}
                destCoords={destCoords}
                status={rideStatus}
                driverName={assignedDriver.name}
                vehicle={assignedDriver.vehicle}
                etaMinutes={calculatedEta}
                distanceKm={calculatedDistance}
                onRouteChange={({ distanceKm: dist, etaMinutes: eta, originCoords: origC, destCoords: destC }) => {
                  setCalculatedDistance(dist);
                  setCalculatedEta(eta);
                }}
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

                <div className="space-y-3.5 max-h-[320px] overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const spent = getCategorySpent(cat.name);
                    const pct = totalSpentCalculated > 0 ? Math.round((spent / totalSpentCalculated) * 100) : 0;
                    const IconComp = cat.icon || Car;
                    return (
                      <div key={cat.id} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <IconComp className="w-3.5 h-3.5 text-amber-400" />
                            {cat.name} <span className="text-[10px] text-slate-400 font-normal">({cat.tagline})</span>
                          </span>
                          <span className="text-amber-400 font-black">R$ {spent.toFixed(2).replace('.', ',')} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2.5 border border-slate-800">
                          <div className="bg-gradient-to-r from-amber-500 to-amber-400 h-2.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
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

        {activeTab === 'menu' && (
          <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 max-w-xl mx-auto animate-fadeIn">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-3xl shadow-lg mx-auto">
                {(currentUser?.name || 'US').substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{currentUser?.name || 'Usuário'}</h2>
                <p className="text-sm text-slate-400 font-medium">{currentUser?.email || ''}</p>
                <span className="inline-block text-[10px] font-black tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full uppercase mt-2">
                  Passageiro Rota Nova
                </span>
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center">
                  <p className="text-2xl font-black text-white">R$ {(currentUser?.stats?.totalSpent || 0).toFixed(2).replace('.', ',')}</p>
                  <p className="text-xs font-bold text-slate-400 mt-1">Total Gasto</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-center">
                  <p className="text-2xl font-black text-white">{currentUser?.stats?.ridesCompleted || 0}</p>
                  <p className="text-xs font-bold text-slate-400 mt-1">Corridas Feitas</p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setActiveTab('pedir')}
                  className="w-full bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-bold py-3.5 rounded-xl text-center text-sm transition-colors flex items-center justify-center space-x-2"
                >
                  <Navigation className="w-4 h-4 text-amber-400" />
                  <span>Voltar para Pedir Corrida</span>
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
