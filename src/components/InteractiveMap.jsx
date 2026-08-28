import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import './leaflet-styles.css';
import { Shield, CheckCircle2, Navigation, Car } from 'lucide-react';

export default function InteractiveMap({
  origin = "Eixo Monumental, Bloco A — Plano Piloto, Brasília - DF",
  destination = "Setor Habitacional Sol Nascente, Chácara 12 (Estrada de Chão) — DF",
  status = "idle", // 'idle' | 'searching' | 'driver_en_route' | 'in_transit' | 'completed'
  driverName = "Carlos Eduardo",
  vehicle = "Toyota Corolla (ABC-1D23)",
  etaMinutes = 7,
  distanceKm = "5.4"
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  // Marker and layer references to update dynamically
  const originMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const carMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const arrivalPolylineRef = useRef(null);
  
  // Coordinates and routes state
  const [originCoords, setOriginCoords] = useState(null);
  const [destCoords, setDestCoords] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [arrivalCoords, setArrivalCoords] = useState([]);
  
  const [progress, setProgress] = useState(0);

  // Helper: Geocoding with static defaults for standard simulation locations to load instantly
  const getCoordinates = async (address) => {
    if (!address) return null;
    const clean = address.toLowerCase();
    
    // Quick cache/hardcoded coordinates for default demo locations to avoid network latency and OSRM limits
    if (clean.includes("eixo monumental") || clean.includes("bloco a")) {
      return [-15.7934, -47.8884];
    }
    if (clean.includes("sol nascente") || clean.includes("chácara 28") || clean.includes("chácara 45") || clean.includes("chácara 12")) {
      return [-15.8235, -48.1130];
    }
    if (clean.includes("rodoviária") || clean.includes("rodoviaria")) {
      return [-15.7941, -47.8829];
    }
    if (clean.includes("samambaia")) {
      return [-15.8115, -48.0163];
    }
    if (clean.includes("indústrias gráficas") || clean.includes("sig")) {
      return [-15.7981, -47.9126];
    }
    if (clean.includes("setor de indústrias")) {
      return [-15.7981, -47.9126];
    }
    if (clean.includes("26 de julho")) {
      return [-15.8202, -48.0694];
    }
    if (clean.includes("riacho fundo 2") || clean.includes("riacho fundo ii")) {
      return [-15.8906, -48.0645];
    }
    if (clean.includes("recanto") || clean.includes("recanto das emas")) {
      return [-15.9015, -48.0782];
    }
    if (clean.includes("taguatinga")) {
      return [-15.8340, -48.0560];
    }
    if (clean.includes("w3")) {
      return [-15.7998, -47.8967];
    }
    if (clean.includes("asa norte")) {
      return [-15.7635, -47.8860];
    }
    if (clean.includes("asa sul")) {
      return [-15.8118, -47.9022];
    }
    if (clean.includes("ceilândia") || clean.includes("ceilandia")) {
      return [-15.8166, -48.1102];
    }

    // Live Geocode fallback
    try {
      let query = address;
      if (!clean.includes("df") && !clean.includes("distrito federal") && !clean.includes("brasília") && !clean.includes("brasilia")) {
        query = `${address}, Brasília - DF`;
      }
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`, {
        headers: {
          'Accept-Language': 'pt-BR',
          'User-Agent': 'RotaNova-App/1.0'
        }
      });
      const data = await response.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (e) {
      console.error("Geocoding failed for: " + address, e);
    }
    return null;
  };

  // Helper: Fetch real driving route from OSRM
  const fetchOSRMRoute = async (start, end) => {
    try {
      const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`);
      const data = await response.json();
      if (data && data.routes && data.routes.length > 0) {
        // Map from OSRM [lon, lat] to Leaflet [lat, lon]
        return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
      }
    } catch (e) {
      console.error("OSRM Route fetching failed", e);
    }
    // Fallback to straight line
    return [start, end];
  };

  // 1. Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create Leaflet map container
    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: true
    });

    // Add standard OpenStreetMap tile layer (darkened via CSS filter)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Position Zoom control on the top right so it doesn't overlap our overlays
    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;

    // Default view over Brasília
    map.setView([-15.7934, -47.8884], 12);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Fetch coordinates independently when origin or destination changes
  useEffect(() => {
    const resolveAddresses = async () => {
      const originPt = await getCoordinates(origin);
      if (originPt) setOriginCoords(originPt);

      const destPt = await getCoordinates(destination);
      if (destPt) setDestCoords(destPt);
    };
    resolveAddresses();
  }, [origin, destination]);

  // 3. Fetch OSRM route when coordinate states are both resolved/updated
  useEffect(() => {
    const loadRoute = async () => {
      if (originCoords && destCoords) {
        const mainRoute = await fetchOSRMRoute(originCoords, destCoords);
        setRouteCoords(mainRoute);

        // Mock an arrival route for the driver to reach the origin
        const driverStartPoint = [originCoords[0] + 0.008, originCoords[1] - 0.008];
        const arrivalRoute = await fetchOSRMRoute(driverStartPoint, originCoords);
        setArrivalCoords(arrivalRoute);
      }
    };
    loadRoute();
  }, [originCoords, destCoords]);

  // 3. Render and Update markers and polyline paths on coordinate changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean up old polylines if they exist
    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }
    if (arrivalPolylineRef.current) {
      arrivalPolylineRef.current.remove();
      arrivalPolylineRef.current = null;
    }

    // Origin marker icon setup
    const originIcon = L.divIcon({
      html: `
        <div class="flex flex-col items-center custom-pin">
          <div class="bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-extrabold shadow-lg mb-1 whitespace-nowrap border border-amber-300 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-slate-950"></span>
            Embarque
          </div>
          <div class="w-7 h-7 bg-amber-500/25 border-2 border-amber-400 rounded-full flex items-center justify-center animate-pulse">
            <div class="w-2.5 h-2.5 bg-amber-400 rounded-full"></div>
          </div>
        </div>
      `,
      className: 'custom-pin',
      iconSize: [80, 50],
      iconAnchor: [40, 50]
    });

    // Destination marker icon setup
    const destIcon = L.divIcon({
      html: `
        <div class="flex flex-col items-center custom-pin">
          <div class="bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-extrabold shadow-lg mb-1 whitespace-nowrap border border-amber-300 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Desembarque
          </div>
          <div class="w-8 h-8 bg-amber-500/20 border-2 border-amber-400 rounded-full flex items-center justify-center shadow-lg">
            <svg class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
        </div>
      `,
      className: 'custom-pin',
      iconSize: [80, 50],
      iconAnchor: [40, 50]
    });

    // Create/update origin marker
    if (originCoords) {
      if (originMarkerRef.current) {
        originMarkerRef.current.setLatLng(originCoords);
      } else {
        originMarkerRef.current = L.marker(originCoords, { icon: originIcon }).addTo(map);
      }
    }

    // Create/update destination marker
    if (destCoords) {
      if (destMarkerRef.current) {
        destMarkerRef.current.setLatLng(destCoords);
      } else {
        destMarkerRef.current = L.marker(destCoords, { icon: destIcon }).addTo(map);
      }
    }

    // Draw main route polyline
    if (routeCoords.length > 0) {
      routePolylineRef.current = L.polyline(routeCoords, {
        color: '#f59e0b',
        weight: 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
        className: 'route-glowing-line'
      }).addTo(map);

      // Adjust map view to center the route beautifully
      map.fitBounds(routePolylineRef.current.getBounds(), {
        padding: [50, 50],
        maxZoom: 14
      });
    }

    // Draw arrival route polyline (only for simulation state)
    if (arrivalCoords.length > 0 && status === 'driver_en_route') {
      arrivalPolylineRef.current = L.polyline(arrivalCoords, {
        color: '#64748b', // Slate gray for arrival route
        weight: 4,
        opacity: 0.6,
        dashArray: '5, 8'
      }).addTo(map);
    }
  }, [originCoords, destCoords, routeCoords, arrivalCoords, status]);

  // 4. Animate car movement along coordinates based on progress/status
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean up car marker if status is idle or searching (no car shown)
    if ((status === 'idle' || status === 'searching') && carMarkerRef.current) {
      carMarkerRef.current.remove();
      carMarkerRef.current = null;
    }

    // Set up custom car icon
    const carIcon = L.divIcon({
      html: `
        <div class="flex flex-col items-center custom-pin">
          <div class="bg-slate-900 border border-amber-400 text-amber-400 px-2 py-0.5 rounded text-[9px] font-bold shadow-xl mb-1 flex items-center gap-1 whitespace-nowrap">
            <svg class="w-3 h-3 text-amber-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>${driverName}</span>
          </div>
          <div class="w-8 h-8 bg-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.9)] border-2 border-white flex items-center justify-center animate-bounce-subtle">
            <svg class="w-4.5 h-4.5 text-slate-950 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </div>
        </div>
      `,
      className: 'custom-pin',
      iconSize: [80, 50],
      iconAnchor: [40, 50]
    });

    let currentPos = null;

    if (status === 'driver_en_route' && arrivalCoords.length > 0) {
      // Car is on the arrival path to pick up passenger
      const index = Math.min(
        Math.floor((progress / 100) * (arrivalCoords.length - 1)),
        arrivalCoords.length - 1
      );
      currentPos = arrivalCoords[index];
    } else if (status === 'in_transit' && routeCoords.length > 0) {
      // Car is on the main path to the destination
      const index = Math.min(
        Math.floor((progress / 100) * (routeCoords.length - 1)),
        routeCoords.length - 1
      );
      currentPos = routeCoords[index];
    } else if (status === 'completed' && routeCoords.length > 0) {
      // Car sits at destination
      currentPos = routeCoords[routeCoords.length - 1];
    } else if (status === 'idle' && routeCoords.length > 0) {
      // In idle mock state, show car parked at origin
      currentPos = routeCoords[0];
    }

    if (currentPos) {
      if (carMarkerRef.current) {
        carMarkerRef.current.setLatLng(currentPos);
      } else {
        carMarkerRef.current = L.marker(currentPos, { icon: carIcon }).addTo(map);
      }
      
      // Auto pan map to follow the car smoothly
      map.panTo(currentPos, { animate: true, duration: 0.5 });
    }
  }, [progress, routeCoords, arrivalCoords, status, driverName]);

  // 5. Timer intervals to animate the progression value (0 to 100%)
  useEffect(() => {
    let interval;
    setProgress(0);

    if (status === 'driver_en_route') {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 0; // loop the arrival animation
          return prev + 4;
        });
      }, 250);
    } else if (status === 'in_transit') {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + 2;
        });
      }, 300);
    } else if (status === 'completed') {
      setProgress(100);
    } else {
      setProgress(0);
    }

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="relative w-full h-[400px] md:h-[480px] rounded-2xl overflow-hidden border border-slate-700/60 bg-slate-950 shadow-2xl flex flex-col justify-between">
      
      {/* Real Leaflet Map Container Layer */}
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 w-full h-full z-0" 
      />

      {/* Map Header Overlay */}
      <div className="relative z-[10] p-4 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-b from-slate-950/95 via-slate-950/70 to-transparent pointer-events-none">
        <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-200 pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
          <span>Radar Rota Nova • GPS Ativo</span>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-full text-xs font-medium text-amber-300 pointer-events-auto">
          <Shield className="w-3.5 h-3.5" />
          <span>Anticancelamento</span>
        </div>
      </div>

      {/* Floating Status Bar Overlay (Bottom) */}
      <div className="relative z-[10] p-4 bg-slate-900/95 border-t border-slate-800/90 backdrop-blur-md">
        
        {status === 'idle' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800 rounded-xl text-amber-400">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Rota ativa do trajeto</p>
                <p className="text-sm font-semibold text-white">{distanceKm} km • Est. {etaMinutes} min de viagem</p>
              </div>
            </div>
            <div className="text-xs text-amber-400 bg-amber-950/80 border border-amber-800 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Destino 100% garantido pelo app</span>
            </div>
          </div>
        )}

        {status === 'searching' && (
          <div className="flex items-center space-x-4">
            <div className="w-7 h-7 border-3 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="text-sm font-bold text-white">Localizando motorista Rota Nova mais próximo...</p>
              <p className="text-xs text-slate-400">Conectando condutores qualificados sem filtro de bairro</p>
            </div>
          </div>
        )}

        {status === 'driver_en_route' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Motorista a caminho</p>
                <p className="text-sm font-bold text-white">{driverName} • <span className="text-slate-300 font-normal">{vehicle}</span></p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-amber-400">~ 3 min</p>
              <p className="text-[11px] text-slate-400">Chegando ao embarque</p>
            </div>
          </div>
        )}

        {status === 'in_transit' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-950">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Em trânsito até o destino</p>
                <p className="text-sm font-bold text-white">Próxima parada: {destination.split('—')[0]}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-amber-400">~ {etaMinutes} min</p>
              <p className="text-[11px] text-slate-400">Chegada estimada</p>
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center">
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
