import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import './leaflet-styles.css';
import { Shield, CheckCircle2, Navigation, Car, Layers, Crosshair, MapPin, Compass, Play, FastForward, RotateCcw } from 'lucide-react';

export default function InteractiveMap({
  origin = "Eixo Monumental, Bloco A — Plano Piloto, Brasília - DF",
  destination = "Setor Habitacional Sol Nascente, Chácara 12 (Estrada de Chão) — DF",
  originCoords: initialOriginCoords = null,
  destCoords: initialDestCoords = null,
  status = "idle", // 'idle' | 'searching' | 'driver_en_route' | 'driver_arrived' | 'in_transit' | 'completed'
  driverName = "Carlos Eduardo",
  vehicle = "Toyota Corolla (ABC-1D23)",
  etaMinutes = 7,
  distanceKm = "5.4",
  onRouteChange = null,
  onMapClick = null
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerGroupRef = useRef(null);
  
  // Layer references
  const originMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const carMarkerRef = useRef(null);
  const routePolylineRef = useRef(null);
  const arrivalPolylineRef = useRef(null);
  const completedPolylineRef = useRef(null);
  
  // Coordinates and routes state
  const [originCoords, setOriginCoords] = useState(initialOriginCoords);
  const [destCoords, setDestCoords] = useState(initialDestCoords);
  const [routeCoords, setRouteCoords] = useState([]);
  const [arrivalCoords, setArrivalCoords] = useState([]);
  const [calculatedDistance, setCalculatedDistance] = useState(distanceKm);
  const [calculatedEta, setCalculatedEta] = useState(etaMinutes);
  
  // Map Style: 'satellite' | 'streets'
  const [mapStyle, setMapStyle] = useState('satellite');
  const [progress, setProgress] = useState(0); // 0 to 100
  const [carAngle, setCarAngle] = useState(0);
  const [autoFollowCar, setAutoFollowCar] = useState(false);

  // Deterministic coordinate generator for unknown addresses
  const getHashCoordinates = (address) => {
    let hash = 0;
    const str = (address || '').toLowerCase();
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const latOffset = ((Math.abs(hash) % 1000) / 1000) * 0.12;
    const lngOffset = ((Math.abs(hash >> 3) % 1000) / 1000) * 0.22;
    return [-15.75 - latOffset, -47.85 - lngOffset];
  };

  // Helper: Geocoding with instant cache for common Brasília / DF areas
  const getCoordinates = async (address) => {
    if (!address) return [-15.7934, -47.8884];
    const clean = address.toLowerCase();
    
    if (clean.includes("eixo monumental") || clean.includes("bloco a")) return [-15.7934, -47.8884];
    if (clean.includes("setor hoteleiro norte") || clean.includes("shn")) return [-15.7876, -47.8890];
    if (clean.includes("setor hoteleiro sul") || clean.includes("shs")) return [-15.7958, -47.8932];
    if (clean.includes("aeroporto") || clean.includes("jk")) return [-15.8711, -47.9172];
    if (clean.includes("rodoviária") || clean.includes("rodoviaria")) return [-15.7941, -47.8829];
    if (clean.includes("indústrias gráficas") || clean.includes("sig") || clean.includes("industrias graficas")) return [-15.7981, -47.9126];
    if (clean.includes("26 de julho") || clean.includes("vinte e seis de julho")) return [-15.8202, -48.0694];
    if (clean.includes("sol nascente") || clean.includes("chácara 28") || clean.includes("chacara 28")) return [-15.8235, -48.1130];
    if (clean.includes("samambaia")) return [-15.8115, -48.0163];
    if (clean.includes("riacho fundo 2") || clean.includes("riacho fundo ii")) return [-15.8980, -48.0450];
    if (clean.includes("riacho fundo")) return [-15.8906, -48.0645];
    if (clean.includes("recanto")) return [-15.9015, -48.0782];
    if (clean.includes("taguatinga shopping") || clean.includes("taguatinga")) return [-15.8340, -48.0560];
    if (clean.includes("w3")) return [-15.7998, -47.8967];
    if (clean.includes("asa norte")) return [-15.7635, -47.8860];
    if (clean.includes("asa sul")) return [-15.8118, -47.9022];
    if (clean.includes("ceilândia") || clean.includes("ceilandia")) return [-15.8166, -48.1102];
    if (clean.includes("águas claras") || clean.includes("aguas claras")) return [-15.8389, -48.0305];
    if (clean.includes("vicente pires")) return [-15.8080, -48.0355];
    if (clean.includes("guará") || clean.includes("guara")) return [-15.8200, -47.9780];
    if (clean.includes("cruzeiro")) return [-15.7905, -47.9355];
    if (clean.includes("sobradinho")) return [-15.6515, -47.7892];
    if (clean.includes("planaltina")) return [-15.6178, -47.6534];
    if (clean.includes("gama")) return [-16.0195, -48.0655];

    try {
      const cleanSearchQuery = address.replace(/[—–-]/g, ' ').replace(/\s+/g, ' ').trim();
      const photonRes = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(cleanSearchQuery)}&lat=-15.7934&lon=-47.8884&limit=1&lang=pt`);
      const photonData = await photonRes.json();
      if (photonData && photonData.features && photonData.features.length > 0) {
        const coords = photonData.features[0].geometry.coordinates;
        return [coords[1], coords[0]];
      }

      const nomRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanSearchQuery + ', Brasil')}&limit=1`, {
        headers: { 'Accept-Language': 'pt-BR', 'User-Agent': 'RotaNova-App/1.0' }
      });
      const nomData = await nomRes.json();
      if (nomData && nomData.length > 0) {
        return [parseFloat(nomData[0].lat), parseFloat(nomData[0].lon)];
      }
    } catch (e) {
      console.warn("Geocoding fallback triggered for:", address);
    }
    return getHashCoordinates(address);
  };

  // Helper: Calculate bearing / heading angle between 2 points
  const calculateBearing = (start, end) => {
    if (!start || !end) return 0;
    const startLat = (start[0] * Math.PI) / 180;
    const startLng = (start[1] * Math.PI) / 180;
    const endLat = (end[0] * Math.PI) / 180;
    const endLng = (end[1] * Math.PI) / 180;
    const y = Math.sin(endLng - startLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) - Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);
    let brng = (Math.atan2(y, x) * 180) / Math.PI;
    return (brng + 360) % 360;
  };

  // Helper: Fetch real driving route from OSRM
  const fetchOSRMRoute = async (start, end) => {
    if (!start || !end) return { coords: [], distance: 5.4, duration: 8 };
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);

      const data = await response.json();
      if (data && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const routePoints = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);
        const distKm = (route.distance / 1000).toFixed(1);
        const durMin = Math.max(3, Math.round(route.duration / 60));
        return { coords: routePoints, distance: distKm, duration: durMin };
      }
    } catch (e) {
      console.warn("OSRM Route fallback triggered.");
    }

    // Arc fallback
    const numPoints = 25;
    const coords = [];
    const midLat = (start[0] + end[0]) / 2 + 0.006;
    const midLng = (start[1] + end[1]) / 2 - 0.006;
    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const lat = (1 - t) * (1 - t) * start[0] + 2 * (1 - t) * t * midLat + t * t * end[0];
      const lng = (1 - t) * (1 - t) * start[1] + 2 * (1 - t) * t * midLng + t * t * end[1];
      coords.push([lat, lng]);
    }
    return { coords, distance: distanceKm || '5.4', duration: etaMinutes || 7 };
  };

  // 1. Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: true,
      fadeAnimation: true
    });

    const tileGroup = L.layerGroup().addTo(map);
    tileLayerGroupRef.current = tileGroup;

    L.control.zoom({ position: 'topright' }).addTo(map);

    mapInstanceRef.current = map;
    map.setView([-15.7934, -47.8884], 12);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (onMapClick) {
        onMapClick([lat, lng]);
      }
    });

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

  // 2. Switch Map Tile Layers (Satellite & Streets - 100% Free, Zero API Keys)
  useEffect(() => {
    if (!tileLayerGroupRef.current) return;
    const group = tileLayerGroupRef.current;
    group.clearLayers();

    if (mapStyle === 'satellite') {
      // 🛰️ Real Satellite Imagery + Road & City Labels
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS'
      }).addTo(group);

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        opacity: 0.85
      }).addTo(group);

    } else if (mapStyle === 'streets') {
      // 🗺️ Official OpenStreetMap Standard (High Detail Daylight Streets)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(group);
    }
  }, [mapStyle]);

  // 3. Resolve Coordinates
  useEffect(() => {
    let isMounted = true;
    const resolveAddresses = async () => {
      const originPt = initialOriginCoords || await getCoordinates(origin);
      const destPt = initialDestCoords || await getCoordinates(destination);
      if (isMounted) {
        setOriginCoords(originPt);
        setDestCoords(destPt);
      }
    };
    resolveAddresses();
    return () => { isMounted = false; };
  }, [origin, destination, initialOriginCoords, initialDestCoords]);

  // 4. Fetch real OSRM route & update distance / ETA
  useEffect(() => {
    let isMounted = true;
    const loadRoute = async () => {
      if (originCoords && destCoords) {
        const routeData = await fetchOSRMRoute(originCoords, destCoords);
        
        // Driver arrival simulation route (starts approx 1.5 km away from passenger)
        const driverStartPoint = [originCoords[0] + 0.007, originCoords[1] - 0.007];
        const arrivalData = await fetchOSRMRoute(driverStartPoint, originCoords);
        
        if (isMounted) {
          setRouteCoords(routeData.coords);
          setArrivalCoords(arrivalData.coords);
          setCalculatedDistance(routeData.distance);
          setCalculatedEta(routeData.duration);

          if (onRouteChange) {
            onRouteChange({
              distanceKm: routeData.distance,
              etaMinutes: routeData.duration,
              originCoords,
              destCoords
            });
          }
        }
      }
    };
    loadRoute();
    return () => { isMounted = false; };
  }, [originCoords, destCoords]);

  // 5. Render markers & polyline paths (Framed steadily without shaking)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }
    if (arrivalPolylineRef.current) {
      arrivalPolylineRef.current.remove();
      arrivalPolylineRef.current = null;
    }

    const originIcon = L.divIcon({
      html: `
        <div class="flex flex-col items-center custom-pin group cursor-pointer">
          <div class="bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xl mb-1 whitespace-nowrap border border-amber-300 flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
            <span>Embarque</span>
          </div>
          <div class="relative flex items-center justify-center">
            <div class="w-7 h-7 bg-amber-500/30 rounded-full animate-pulse-ring absolute"></div>
            <div class="w-6 h-6 bg-slate-950 border-2 border-amber-400 rounded-full flex items-center justify-center shadow-lg">
              <div class="w-2.5 h-2.5 bg-amber-400 rounded-full"></div>
            </div>
          </div>
        </div>
      `,
      className: 'custom-pin',
      iconSize: [90, 55],
      iconAnchor: [45, 55]
    });

    const destIcon = L.divIcon({
      html: `
        <div class="flex flex-col items-center custom-pin group cursor-pointer">
          <div class="bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-xl mb-1 whitespace-nowrap border border-amber-300 flex items-center gap-1">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
            <span>Desembarque</span>
          </div>
          <div class="w-7 h-7 bg-amber-500 border-2 border-white rounded-full flex items-center justify-center shadow-2xl">
            <svg class="w-3.5 h-3.5 text-slate-950" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
          </div>
        </div>
      `,
      className: 'custom-pin',
      iconSize: [90, 55],
      iconAnchor: [45, 55]
    });

    if (originCoords) {
      if (originMarkerRef.current) {
        originMarkerRef.current.setLatLng(originCoords);
      } else {
        originMarkerRef.current = L.marker(originCoords, { icon: originIcon }).addTo(map);
      }
    }

    if (destCoords) {
      if (destMarkerRef.current) {
        destMarkerRef.current.setLatLng(destCoords);
      } else {
        destMarkerRef.current = L.marker(destCoords, { icon: destIcon }).addTo(map);
      }
    }

    // Main Route Polyline
    if (routeCoords.length > 0) {
      routePolylineRef.current = L.polyline(routeCoords, {
        color: '#f59e0b',
        weight: mapStyle === 'satellite' ? 6 : 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round',
        className: mapStyle === 'satellite' ? 'route-satellite-line' : 'route-glowing-line'
      }).addTo(map);

      // Fit bounds once smoothly
      try {
        const bounds = routePolylineRef.current.getBounds();
        if (bounds && bounds.isValid()) {
          map.fitBounds(bounds, {
            padding: [45, 45],
            maxZoom: 14
          });
        }
      } catch (e) {}
    }

    // Arrival route polyline
    if (arrivalCoords.length > 0 && (status === 'driver_en_route' || status === 'driver_arrived')) {
      arrivalPolylineRef.current = L.polyline(arrivalCoords, {
        color: '#94a3b8',
        weight: 4,
        opacity: 0.75,
        dashArray: '6, 8'
      }).addTo(map);
    }
  }, [originCoords, destCoords, routeCoords, arrivalCoords, status, mapStyle]);

  // 6. Smooth Realistic Car Positioning along the Route
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if ((status === 'idle' || status === 'searching') && carMarkerRef.current) {
      carMarkerRef.current.remove();
      carMarkerRef.current = null;
      return;
    }

    let activeCoordsList = [];
    if (status === 'driver_en_route') {
      activeCoordsList = arrivalCoords;
    } else if (status === 'driver_arrived') {
      activeCoordsList = originCoords ? [originCoords] : [];
    } else if (status === 'in_transit' || status === 'completed') {
      activeCoordsList = routeCoords;
    }

    if (activeCoordsList.length === 0) return;

    // Calculate current fractional index
    let currentPos = activeCoordsList[0];
    let angle = 0;

    if (status === 'driver_arrived') {
      currentPos = originCoords;
    } else if (status === 'completed') {
      currentPos = activeCoordsList[activeCoordsList.length - 1];
    } else if (activeCoordsList.length > 1) {
      const rawIdx = (progress / 100) * (activeCoordsList.length - 1);
      const baseIdx = Math.floor(rawIdx);
      const nextIdx = Math.min(baseIdx + 1, activeCoordsList.length - 1);
      const fraction = rawIdx - baseIdx;

      const p1 = activeCoordsList[baseIdx];
      const p2 = activeCoordsList[nextIdx];

      // Linear interpolation between coordinate segments
      const lat = p1[0] + (p2[0] - p1[0]) * fraction;
      const lng = p1[1] + (p2[1] - p1[1]) * fraction;
      currentPos = [lat, lng];

      angle = calculateBearing(p1, p2);
    }

    setCarAngle(angle);

    // Car div icon with dynamic rotation angle according to road heading
    const carIcon = L.divIcon({
      html: `
        <div class="flex flex-col items-center custom-pin">
          <div class="bg-slate-900/95 border border-amber-400 text-amber-400 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold shadow-2xl mb-1 flex items-center gap-1 whitespace-nowrap backdrop-blur-md">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            <span>${driverName}</span>
          </div>
          <div class="w-9 h-9 bg-amber-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.95)] border-2 border-white flex items-center justify-center transition-transform duration-300" style="transform: rotate(${angle}deg);">
            <svg class="w-5 h-5 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
              <circle cx="7.5" cy="14.5" r="1.5"/>
              <circle cx="16.5" cy="14.5" r="1.5"/>
            </svg>
          </div>
        </div>
      `,
      className: 'custom-pin',
      iconSize: [95, 60],
      iconAnchor: [47, 60]
    });

    if (currentPos) {
      if (carMarkerRef.current) {
        carMarkerRef.current.setLatLng(currentPos);
        carMarkerRef.current.setIcon(carIcon);
      } else {
        carMarkerRef.current = L.marker(currentPos, { icon: carIcon }).addTo(map);
      }

      if (autoFollowCar) {
        map.panTo(currentPos, { animate: true, duration: 0.8 });
      }
    }
  }, [progress, routeCoords, arrivalCoords, status, driverName, autoFollowCar]);

  // 7. Realistic Progression Timers
  useEffect(() => {
    let interval;
    setProgress(0);

    if (status === 'driver_en_route') {
      // Driver approaches pickup in a smooth, realistic simulation
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + 1.2;
        });
      }, 200);
    } else if (status === 'driver_arrived') {
      setProgress(100);
    } else if (status === 'in_transit') {
      // Car moves along the real route smoothly
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          return prev + 0.6;
        });
      }, 200);
    } else if (status === 'completed') {
      setProgress(100);
    } else {
      setProgress(0);
    }

    return () => clearInterval(interval);
  }, [status]);

  const handleFlyToGps = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([pos.coords.latitude, pos.coords.longitude], 15, {
            animate: true,
            duration: 1.5
          });
        }
      },
      (err) => console.warn(err),
      { enableHighAccuracy: true }
    );
  };

  const handleRecenterRoute = () => {
    if (mapInstanceRef.current && routePolylineRef.current) {
      try {
        const bounds = routePolylineRef.current.getBounds();
        if (bounds && bounds.isValid()) {
          mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (e) {}
    }
  };

  return (
    <div className="relative w-full h-[400px] md:h-[490px] rounded-3xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-2xl flex flex-col justify-between">
      
      {/* Real High-Definition Leaflet Map Container Layer */}
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 w-full h-full z-0" 
      />

      {/* Map Header Overlay */}
      <div className="relative z-[10] p-4 flex flex-wrap items-center justify-between gap-2 bg-gradient-to-b from-slate-950/95 via-slate-950/60 to-transparent pointer-events-none">
        
        {/* Left Badges */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-700/80 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-200 backdrop-blur-md shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <span>Radar Rota Nova • GPS Ativo</span>
          </div>

          <button
            type="button"
            onClick={handleFlyToGps}
            title="Minha Localização GPS"
            className="p-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-full text-amber-400 backdrop-blur-md shadow-lg transition-transform hover:scale-105"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleRecenterRoute}
            title="Enquadrar Rota Inteira"
            className="p-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-full text-slate-300 hover:text-amber-400 backdrop-blur-md shadow-lg transition-transform hover:scale-105"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* Right Map Style Selector (Satélite & Ruas) */}
        <div className="flex items-center bg-slate-900/95 border border-slate-700/80 p-1 rounded-2xl backdrop-blur-md shadow-xl pointer-events-auto">
          <button
            type="button"
            onClick={() => setMapStyle('satellite')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center space-x-1 ${
              mapStyle === 'satellite'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🛰️ Satélite</span>
          </button>

          <button
            type="button"
            onClick={() => setMapStyle('streets')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center space-x-1 ${
              mapStyle === 'streets'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🗺️ Ruas</span>
          </button>
        </div>

      </div>

      {/* Floating Status Bar Overlay (Bottom) */}
      <div className="relative z-[10] p-4 bg-slate-900/95 border-t border-slate-800/90 backdrop-blur-md">
        
        {status === 'idle' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-slate-800/90 rounded-xl text-amber-400 border border-slate-700">
                <Navigation className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Traçado de Rota Real (Ruas & Avenidas)</p>
                <p className="text-sm font-extrabold text-white">
                  {calculatedDistance} km • Est. {calculatedEta} min de viagem
                </p>
              </div>
            </div>
            <div className="text-xs text-amber-400 bg-amber-950/80 border border-amber-800/80 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold shadow-md">
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                  <Car className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Motorista a caminho do embarque</p>
                  <p className="text-sm font-bold text-white">{driverName} • <span className="text-slate-300 font-normal">{vehicle}</span></p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-amber-400">~ {Math.max(1, Math.round(3 * (1 - progress / 100)))} min</p>
                <p className="text-[11px] text-slate-400">Chegando até você</p>
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-400 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {status === 'driver_arrived' && (
          <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-amber-300 font-extrabold uppercase tracking-wider">Motorista Chegou ao Local!</p>
                <p className="text-sm font-bold text-white">{driverName} está aguardando no ponto de embarque.</p>
              </div>
            </div>
            <span className="text-xs bg-amber-500 text-slate-950 font-black px-3 py-1.5 rounded-xl shadow-lg animate-pulse">
              No Embarque
            </span>
          </div>
        )}

        {status === 'in_transit' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-slate-950 shadow-lg">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">Em trânsito até o destino</p>
                  <p className="text-sm font-bold text-white truncate max-w-xs">
                    Próxima parada: {destination.split('—')[0]}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-black text-amber-400">
                  ~ {Math.max(1, Math.round(calculatedEta * (1 - progress / 100)))} min
                </p>
                <p className="text-[11px] text-slate-400">{calculatedDistance} km totais</p>
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-amber-300 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Corrida Concluída com Sucesso!</p>
                <p className="text-xs text-slate-400">Você chegou ao seu destino com segurança e sem recusas.</p>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
