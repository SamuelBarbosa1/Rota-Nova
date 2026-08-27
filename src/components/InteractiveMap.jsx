import React, { useEffect, useState } from 'react';
import { MapPin, Navigation, Car, Shield, CheckCircle2, AlertCircle } from 'lucide-react';

export default function InteractiveMap({
  origin = "Av. Paulista, 1000 — Bela Vista",
  destination = "Rua do Bosque, 45 — Bairro das Flores (Estrada de Chão)",
  status = "idle", // 'idle' | 'searching' | 'driver_en_route' | 'in_transit' | 'completed'
  driverName = "Carlos Eduardo",
  vehicle = "Toyota Corolla (ABC-1D23)",
  etaMinutes = 7,
  distanceKm = "5.4"
}) {
  const [carProgress, setCarProgress] = useState(0); // 0 to 100

  // Animate car position based on status
  useEffect(() => {
    let interval;
    if (status === 'driver_en_route') {
      // Car moves from 0 to 30%
      setCarProgress(15);
      interval = setInterval(() => {
        setCarProgress(prev => (prev >= 30 ? 5 : prev + 2));
      }, 500);
    } else if (status === 'in_transit') {
      // Car moves from 30% to 95%
      interval = setInterval(() => {
        setCarProgress(prev => (prev >= 95 ? 35 : prev + 1.5));
      }, 400);
    } else if (status === 'completed') {
      setCarProgress(100);
    } else {
      setCarProgress(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="relative w-full h-[400px] md:h-[480px] rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950 shadow-2xl flex flex-col justify-between">
      
      {/* Background Map Visual (Grid & City Graphic) */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"></div>
      
      {/* Simulated Roads / Vector Lines */}
      <svg className="absolute inset-0 w-full h-full stroke-slate-800" strokeWidth="6" fill="none">
        {/* Main Grid Roads */}
        <path d="M 0 120 Q 200 150 400 100 T 800 180" stroke="#1e293b" strokeWidth="12" />
        <path d="M 100 0 Q 150 200 120 450" stroke="#1e293b" strokeWidth="10" />
        <path d="M 450 0 C 420 180 520 300 650 500" stroke="#1e293b" strokeWidth="14" />
        <path d="M 0 320 C 300 280 500 380 900 300" stroke="#1e293b" strokeWidth="10" />

        {/* Dirt Road Section / Destination area */}
        <path d="M 500 320 Q 620 280 750 360" stroke="#78350f" strokeWidth="8" strokeDasharray="6 4" />
      </svg>

      {/* Active Route Path Highlight */}
      <svg className="absolute inset-0 w-full h-full" fill="none">
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
        
        {/* Active Route Spline */}
        <path 
          d="M 120 180 C 250 140 380 260 620 280 L 720 340" 
          stroke="url(#routeGradient)" 
          strokeWidth="6" 
          strokeLinecap="round"
          className="drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]"
        />
      </svg>

      {/* Map Header Overlay */}
      <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-slate-950/90 to-transparent">
        <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-200">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Radar RotaJá • GPS Ativo</span>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-300">
          <Shield className="w-3.5 h-3.5" />
          <span>Monitoramento Anticancelamento</span>
        </div>
      </div>

      {/* Pins and Animated Moving Vehicle */}
      <div className="relative inset-0 w-full h-full pointer-events-none">
        
        {/* ORIGIN PIN (Av. Paulista) */}
        <div className="absolute left-[120px] top-[180px] -translate-x-1/2 -translate-y-full flex flex-col items-center">
          <div className="bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-md text-[11px] font-extrabold shadow-lg mb-1 whitespace-nowrap border border-emerald-300 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-950"></span>
            Embarque
          </div>
          <div className="w-8 h-8 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center animate-bounce-subtle">
            <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
          </div>
        </div>

        {/* DESTINATION PIN (Bairro das Flores / Dirt Road) */}
        <div className="absolute left-[720px] top-[340px] -translate-x-1/2 -translate-y-full flex flex-col items-center">
          <div className="bg-amber-500 text-slate-950 px-2.5 py-1 rounded-md text-[11px] font-extrabold shadow-lg mb-1 whitespace-nowrap border border-amber-300 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Desembarque (Estrada de Chão)
          </div>
          <div className="w-9 h-9 bg-amber-500/20 border-2 border-amber-400 rounded-full flex items-center justify-center">
            <MapPin className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        {/* MOVING CAR PIN */}
        <div 
          className="absolute transition-all duration-300 ease-linear flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${120 + (carProgress / 100) * 600}px`,
            top: `${180 + (carProgress / 100) * 160}px`
          }}
        >
          <div className="bg-slate-900 border border-emerald-400 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold shadow-xl mb-1 flex items-center gap-1 whitespace-nowrap">
            <Car className="w-3 h-3 text-emerald-400" />
            <span>{driverName}</span>
          </div>
          <div className="w-10 h-10 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.8)] border-2 border-white flex items-center justify-center">
            <Navigation className="w-5 h-5 text-slate-950 transform rotate-45" />
          </div>
        </div>

      </div>

      {/* Floating Status Bar Overlay (Bottom) */}
      <div className="relative z-10 p-4 bg-slate-900/95 border-t border-slate-800/90 backdrop-blur-md">
        
        {status === 'idle' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 rounded-xl text-emerald-400">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Rota simulada</p>
                <p className="text-sm font-semibold text-white">{distanceKm} km • Est. {etaMinutes} min de viagem</p>
              </div>
            </div>
            <div className="text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Destino 100% garantido pelo app</span>
            </div>
          </div>
        )}

        {status === 'searching' && (
          <div className="flex items-center space-x-4">
            <div className="w-7 h-7 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="text-sm font-bold text-white">Localizando motorista RotaJá mais próximo...</p>
              <p className="text-xs text-slate-400">Conectando condutores qualificados sem filtro de bairro</p>
            </div>
          </div>
        )}

        {status === 'driver_en_route' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Motorista a caminho</p>
                <p className="text-sm font-bold text-white">{driverName} • <span className="text-slate-300 font-normal">{vehicle}</span></p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-emerald-400">~ 3 min</p>
              <p className="text-[11px] text-slate-400">Chegando ao embarque</p>
            </div>
          </div>
        )}

        {status === 'in_transit' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Em trânsito até o destino</p>
                <p className="text-sm font-bold text-white">Próxima parada: {destination.split('—')[0]}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-emerald-400">~ {etaMinutes} min</p>
              <p className="text-[11px] text-slate-400">Chegada estimada</p>
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Corrida Concluída com Sucesso!</p>
                <p className="text-xs text-slate-400">Você chegou ao seu destino sem interrupções.</p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
