import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Crosshair, Loader2, X, Clock, Check } from 'lucide-react';

export default function AddressAutocomplete({
  value = '',
  onChange,
  onSelect,
  placeholder = 'Digite o endereço...',
  icon: Icon = MapPin,
  disabled = false,
  showGpsButton = false,
  required = false,
  className = ''
}) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const containerRef = useRef(null);
  const debounceRef = useRef(null);

  // Sync internal state if prop changes from outside
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch real suggestions using Photon (fast & OSM-based) + Nominatim fallback
  const fetchAddressSuggestions = async (query) => {
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const cleanQuery = query.trim();
      
      // 1. Try Photon Geocoder first (fast, typo-tolerant, biased towards DF / Brazil)
      const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQuery)}&lat=-15.7934&lon=-47.8884&limit=6&lang=pt`;
      const photonRes = await fetch(photonUrl);
      const photonData = await photonRes.json();

      if (photonData && photonData.features && photonData.features.length > 0) {
        const results = photonData.features.map((item) => {
          const props = item.properties || {};
          const coords = item.geometry?.coordinates ? [item.geometry.coordinates[1], item.geometry.coordinates[0]] : null;
          
          const name = props.name || props.street || query;
          const details = [
            props.district || props.suburb || props.neighbourhood,
            props.city || props.town || props.village || 'Brasília',
            props.state || 'DF'
          ].filter(Boolean).join(', ');

          const fullLabel = details ? `${name} — ${details}` : name;

          return {
            title: name,
            subtitle: details,
            fullAddress: fullLabel,
            coords: coords
          };
        });

        setSuggestions(results);
        setIsOpen(true);
        setLoading(false);
        return;
      }

      // 2. Fallback to Nominatim OpenStreetMap
      const nomUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery + ', DF, Brasil')}&limit=5&countrycodes=br&addressdetails=1`;
      const nomRes = await fetch(nomUrl, {
        headers: {
          'Accept-Language': 'pt-BR,pt;q=0.9',
          'User-Agent': 'RotaNova-App/1.0'
        }
      });
      const nomData = await nomRes.json();

      if (nomData && nomData.length > 0) {
        const results = nomData.map((item) => {
          const title = item.name || item.display_name.split(',')[0];
          const parts = item.display_name.split(',').map(s => s.trim());
          const subtitle = parts.slice(1, 4).join(', ');

          return {
            title: title,
            subtitle: subtitle,
            fullAddress: `${title} — ${subtitle}`,
            coords: [parseFloat(item.lat), parseFloat(item.lon)]
          };
        });

        setSuggestions(results);
        setIsOpen(true);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.warn('Geocoding search error:', err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputValue(text);
    if (onChange) onChange(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.length >= 3) {
      setLoading(true);
      debounceRef.current = setTimeout(() => {
        fetchAddressSuggestions(text);
      }, 350);
    } else {
      setSuggestions([]);
      setIsOpen(false);
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    setInputValue(item.fullAddress);
    setIsOpen(false);
    if (onChange) onChange(item.fullAddress);
    if (onSelect) onSelect(item.fullAddress, item.coords);
  };

  const handleClear = () => {
    setInputValue('');
    setSuggestions([]);
    setIsOpen(false);
    if (onChange) onChange('');
  };

  // GPS Localization
  const handleUseGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const revRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
            {
              headers: {
                'Accept-Language': 'pt-BR,pt;q=0.9',
                'User-Agent': 'RotaNova-App/1.0'
              }
            }
          );
          const revData = await revRes.json();
          let addrName = 'Minha Localização Atual';
          if (revData && revData.display_name) {
            const parts = revData.display_name.split(',').map(s => s.trim());
            addrName = `${parts[0]} ${parts[1] || ''} — ${parts[2] || 'Brasília'}, DF`;
          }
          setInputValue(addrName);
          if (onChange) onChange(addrName);
          if (onSelect) onSelect(addrName, [lat, lon]);
        } catch (e) {
          const fallback = `Minha Localização (GPS: ${lat.toFixed(4)}, ${lon.toFixed(4)})`;
          setInputValue(fallback);
          if (onChange) onChange(fallback);
          if (onSelect) onSelect(fallback, [lat, lon]);
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        console.warn('GPS Error:', err);
        setGpsLoading(false);
        alert('Não foi possível obter sua localização exata. Permita o acesso ao GPS nas configurações do navegador.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative flex items-center">
        <Icon className="w-4 h-4 text-amber-400 absolute left-3.5 z-10 pointer-events-none" />
        
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-3 pl-10 pr-20 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
        />

        <div className="absolute right-2.5 flex items-center space-x-1 z-10">
          {loading && (
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin mr-1" />
          )}

          {inputValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
              title="Limpar campo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {showGpsButton && !disabled && (
            <button
              type="button"
              onClick={handleUseGps}
              disabled={gpsLoading}
              title="Usar minha localização GPS atual"
              className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 rounded-lg border border-amber-500/30 transition-all flex items-center gap-1 text-[11px] font-bold"
            >
              {gpsLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Crosshair className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete dropdown suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-fadeIn max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-semibold px-3">
            <span>Resultados de Endereços Reais</span>
            <span className="text-amber-400/80 text-[10px]">OpenStreetMap & Photon</span>
          </div>

          <div className="py-1">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(item)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-slate-800/80 transition-colors flex items-start space-x-3 group border-b border-slate-800/40 last:border-none"
              >
                <div className="p-1.5 bg-slate-800 rounded-lg text-amber-400 mt-0.5 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                    {item.title}
                  </p>
                  {item.subtitle && (
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
