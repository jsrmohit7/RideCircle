import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Search, MapPin, Crosshair, X } from 'lucide-react';
import { Input } from '../Input/Input';
import { Button } from '../Button/Button';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string, lat?: number, lng?: number) => void;
  autoFocus?: boolean;
}

const MapEvents = ({ setPosition }: { setPosition: (pos: L.LatLng) => void }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return null;
};

const MapController = ({ center }: { center: L.LatLngExpression }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
};

export const LocationPicker: React.FC<LocationPickerProps> = ({ label, placeholder, value, onChange, autoFocus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [address, setAddress] = useState(value);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Default to Ranchi (BIT Mesra area approx)
  const defaultCenter: L.LatLngExpression = [23.4123, 85.4399];

  useEffect(() => {
    setAddress(value);
  }, [value]);

  const searchLocation = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (e) {
      console.error('Geocoding error', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(q);
    }, 500);
  };

  const handleResultClick = (result: any) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    setPosition(new L.LatLng(lat, lon));
    setAddress(result.display_name);
    setSearchResults([]);
    setSearchQuery('');
  };

  const reverseGeocode = async (latlng: L.LatLng) => {
    setLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (e) {
      console.error('Reverse geocoding error', e);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (latlng: L.LatLng) => {
    setPosition(latlng);
    reverseGeocode(latlng);
  };

  const handleCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = new L.LatLng(pos.coords.latitude, pos.coords.longitude);
          setPosition(latlng);
          reverseGeocode(latlng);
        },
        (err) => {
          console.error(err);
          alert('Location access denied or unavailable.');
          setLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleConfirm = () => {
    if (position) {
      onChange(address, position.lat, position.lng);
    } else {
      onChange(address);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Input 
            label={label} 
            placeholder={placeholder} 
            value={value} 
            onChange={e => onChange(e.target.value)} 
            autoFocus={autoFocus} 
          />
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-2xl bg-zinc-100 hover:bg-rc-purple-100/20 text-zinc-600 hover:text-rc-purple-500 flex items-center justify-center transition-colors border border-border-medium flex-shrink-0"
          type="button"
          title="Select on Map"
        >
          <MapPin size={20} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              className="relative bg-white w-full max-w-3xl h-[85vh] sm:h-[80vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden border border-border-light"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border-light">
                <h3 className="font-display font-bold text-xl text-black">Choose Location</h3>
                <button onClick={() => setIsOpen(false)} className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Search & Actions */}
              <div className="p-4 sm:p-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search college, station, or landmark..."
                    className="w-full bg-bg-soft border border-border-medium rounded-full py-3 pl-12 pr-4 text-[15px] font-medium text-black focus:outline-none focus:border-rc-purple-400 focus:bg-white transition-all"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  
                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-border-light shadow-xl z-[200] max-h-60 overflow-y-auto divide-y divide-border-light">
                      {searchResults.map((result, i) => (
                        <div 
                          key={i} 
                          className="p-4 hover:bg-bg-soft cursor-pointer transition-colors flex items-start space-x-3"
                          onClick={() => handleResultClick(result)}
                        >
                          <MapPin size={16} className="text-rc-purple-400 mt-1 flex-shrink-0" />
                          <span className="text-sm font-medium text-zinc-700">{result.display_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button 
                    onClick={handleCurrentLocation}
                    className="flex items-center space-x-2 text-sm font-bold text-rc-purple-500 hover:text-rc-purple-400 transition-colors"
                  >
                    <Crosshair size={16} />
                    <span>Use current location</span>
                  </button>
                  {loading && <span className="text-xs font-mono text-text-muted">LOADING...</span>}
                </div>
              </div>

              {/* Map */}
              <div className="flex-1 relative bg-zinc-100 min-h-[200px]">
                <MapContainer 
                  center={position || defaultCenter} 
                  zoom={13} 
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  {position && <Marker position={position} />}
                  <MapEvents setPosition={handleMapClick} />
                  {position && <MapController center={position} />}
                </MapContainer>
              </div>

              {/* Footer / Confirm */}
              <div className="p-6 bg-white border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1 overflow-hidden w-full">
                  <div className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-[0.1em] mb-1">Selected Location</div>
                  <div className="text-sm font-medium text-black truncate" title={address}>
                    {address || 'Click on the map or search to select...'}
                  </div>
                </div>
                <Button 
                  onClick={handleConfirm} 
                  disabled={!address}
                  className="w-full sm:w-auto rounded-full px-8"
                >
                  Confirm Location
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
