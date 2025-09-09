"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Thermometer, 
  Wind, 
  CloudRain, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ChevronDown,
  Globe as GlobeIcon,
  Calendar
} from "lucide-react";

const Globe = dynamic(() => import("react-globe.gl"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-cyan-400 border-t-transparent mb-4 mx-auto"></div>
        <p className="text-cyan-300 font-sans text-lg">Chargement du globe 3D...</p>
      </div>
    </div>
  )
});

export default function Home() {
  const globeRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [windSpeed, setWindSpeed] = useState<number | null>(null);
  const [precipitation, setPrecipitation] = useState<number | null>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isDayMode, setIsDayMode] = useState<boolean>(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Gestion du redimensionnement et détection mobile
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDimensions({ width, height });
      setIsMobile(width < 768); // Mobile si largeur < 768px
      
      // Force le redimensionnement du globe après un délai
      if (globeRef.current) {
        setTimeout(() => {
          const canvas = (globeRef.current as unknown as { scene: () => { children: Array<{ children: Array<{ type: string }> }> } })?.scene()?.children[0]?.children.find(
            (child: { type: string }) => child.type === 'WebGLRenderer'
          );
          if (canvas) {
            (globeRef.current as unknown as { renderer: () => { setSize: (w: number, h: number) => void } })?.renderer().setSize(window.innerWidth, window.innerHeight);
          }
        }, 100);
      }
    };

    // Initialisation
    updateDimensions();
    
    // Écouteur d'événements
    window.addEventListener('resize', updateDimensions);
    
    // Nettoyage
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const fetchWeather = async (lat: number, lng: number) => {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
    );
    const data = await res.json();
    console.log("Données météo:", data); // Debug
    setTemperature(data.current.temperature_2m);
    setWindSpeed(data.current.wind_speed_10m);
    setPrecipitation(data.current.precipitation);
    
    // Prévisions 7 jours
    const dailyForecast = data.daily.time.slice(0, 7).map((date: string, index: number) => ({
      date,
      tempMax: data.daily.temperature_2m_max[index],
      tempMin: data.daily.temperature_2m_min[index],
      precipitation: data.daily.precipitation_sum[index]
    }));
    setForecast(dailyForecast);
  };

  const fetchCity = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await res.json();
      
      // Check if address exists and has location data
      if (data.address) {
        setCity(
          data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.country ||
            "Coordonnées GPS"
        );
      } else {
        // No address found (ocean, remote area, etc.)
        setCity("Coordonnées GPS");
      }
    } catch (error) {
      console.error("Error fetching city:", error);
      setCity("Coordonnées GPS");
    }
  };

  const searchCity = async () => {
    if (!query) return;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
        query
      )}&format=json&limit=1`
    );
    const data = await res.json();
    if (data.length > 0) {
      const { lat, lon, display_name } = data[0];
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lon);
      setCoords({ lat: latNum, lng: lngNum });
      setCity(display_name);
      fetchWeather(latNum, lngNum);
      (globeRef.current as unknown as { pointOfView: (view: { lat: number; lng: number; altitude: number }, duration: number) => void })?.pointOfView(
        { 
          lat: isMobile ? latNum - 20 : latNum, // Décalage vers le sud sur mobile
          lng: lngNum, 
          altitude: isMobile ? 4.5 : 2.5 
        },
        1000
      );
    }
  };

  const ringsData = coords
    ? [
        {
          lat: coords.lat,
          lng: coords.lng,
          maxRadius: 10,
          propagationSpeed: 2,
          repeatPeriod: 1000,
          color: "rgba(0, 200, 255, 0.9)"
        }
      ]
    : [];

  return (
    <main className="w-full h-screen relative">
        {/* Globe masqué quand le menu mobile est étendu */}
        {!(isMobile && isExpanded) && (
          <Globe
          ref={globeRef}
          globeImageUrl={isDayMode ? "https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg" : "textures/BlackMarble_2016_3km.jpg"}
          backgroundImageUrl="https://cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png"
          ringsData={ringsData}
          ringColor={(d: { color: string }) => d.color}
          ringMaxRadius={(d: { maxRadius: number }) => d.maxRadius}
          ringPropagationSpeed={(d: { propagationSpeed: number }) => d.propagationSpeed}
          ringRepeatPeriod={(d: { repeatPeriod: number }) => d.repeatPeriod}
          // Customisation de l'atmosphère et de l'éclairage
          showAtmosphere={true}
          atmosphereColor="rgb(0,255,255)"
          atmosphereAltitude={0.18}
          enablePointerInteraction={true}
          // Redimensionnement responsive
          width={dimensions.width}
          height={dimensions.height}
        // Position initiale de la caméra pour décaler la sphère
        onGlobeReady={() => {
          if (globeRef.current) {
            // Décale la vue selon le mode desktop/mobile
            (globeRef.current as unknown as { pointOfView: (view: { lat: number; lng: number; altitude: number }, duration: number) => void }).pointOfView({ 
              lat: isMobile ? -30 : 0, // Décalage vers le sud sur mobile
              lng: isMobile ? 30 : 50, // Moins de décalage est sur mobile
              altitude: isMobile ? 4.5 : 2.5 // Plus éloigné sur mobile
            }, 0);
          }
        }}
        onGlobeClick={(c: { lat: number; lng: number }) => {
          setCoords(c);
          fetchWeather(c.lat, c.lng);
          fetchCity(c.lat, c.lng);
          setQuery(""); // Clear search bar when clicking on globe
        }}
      />
        )}

      {/* Menu design futuriste */}
      {isMenuVisible && (
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`absolute rounded-xl backdrop-blur-xl border border-cyan-400/30 
                      shadow-[0_0_25px_rgba(0,255,255,0.4)] ${
                        isMobile 
                          ? (isExpanded 
                              ? 'inset-4 p-3 text-sm overflow-y-auto bg-gradient-to-br from-black/95 to-black/90' 
                              : 'top-2 left-10 right-10 p-2 text-xs bg-gradient-to-br from-white/10 to-white/5')
                          : 'top-6 left-6 p-4 w-72 bg-gradient-to-br from-white/10 to-white/5'
                      }`}
        >
          {isMobile ? (
            // Menu mobile 
            <div>
              {isExpanded ? (
                // Menu étendu (plein écran)
                <div>
                  {/* Header étendu avec bouton fermer */}
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-cyan-300 pt-2">Météo Détaillée</h3>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="text-cyan-300 hover:text-white hover:bg-white/10 transition-all rounded-lg p-4 min-w-[48px] min-h-[48px] flex items-center justify-center touch-manipulation"
                      style={{ touchAction: 'manipulation' }}
                      title="Réduire"
                    >
                      <X size={22} />
                    </button>
                  </div>
                  
                  {/* Contenu complet du menu étendu */}
                  {coords && (
                    <div className="space-y-3">
                      <div className="bg-white/10 border border-cyan-400/20 rounded px-3 py-2 
                                      text-cyan-100 tracking-wide drop-shadow-[0_0_8px_rgba(0,255,255,0.6)] flex items-center gap-2">
                        <MapPin size={16} /> <b>Lat:</b> {coords.lat.toFixed(2)} | <b>Lng:</b> {coords.lng.toFixed(2)}
                      </div>
                      {city && (
                        <div className="bg-white/10 border border-cyan-400/20 rounded px-3 py-2 
                                        text-cyan-200 font-semibold flex items-center gap-2">
                          <MapPin size={16} /> {city}
                        </div>
                      )}
                      {temperature !== null && (
                        <div className="bg-white/10 border border-cyan-400/20 rounded px-3 py-2 
                                        text-pink-300 font-bold text-lg drop-shadow-[0_0_10px_rgba(255,0,128,0.8)] flex items-center gap-2">
                          <Thermometer size={20} /> {temperature} °C
                        </div>
                      )}
                      {windSpeed !== null && (
                        <div className="bg-white/10 border border-cyan-400/20 rounded px-3 py-2 
                                        text-green-300 font-semibold drop-shadow-[0_0_8px_rgba(0,255,128,0.6)] flex items-center gap-2">
                          <Wind size={18} /> {windSpeed} km/h
                        </div>
                      )}
                      {precipitation !== null && (
                        <div className="bg-white/10 border border-cyan-400/20 rounded px-3 py-2 
                                        text-blue-300 font-semibold drop-shadow-[0_0_8px_rgba(0,128,255,0.6)] flex items-center gap-2">
                          <CloudRain size={18} /> {precipitation} mm
                        </div>
                      )}
                      
                      {/* Prévisions 7 jours dans le menu étendu */}
                      {forecast.length > 0 && (
                        <div className="mt-6 space-y-2">
                          <h3 className="text-cyan-300 font-bold text-sm tracking-wider mb-3 flex items-center gap-2">
                            <Calendar size={16} /> PRÉVISIONS 7 JOURS
                          </h3>
                          <div className="space-y-2">
                            {forecast.map((day, index) => (
                              <div
                                key={day.date}
                                className="bg-white/5 border border-cyan-400/15 rounded-lg px-3 py-2 
                                           text-xs flex justify-between items-center"
                              >
                                <div className="text-cyan-200">
                                  {index === 0 ? "Aujourd'hui" : 
                                   new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span className="text-orange-300">{day.tempMax.toFixed(0)}°</span>
                                  <span className="text-blue-300">{day.tempMin.toFixed(0)}°</span>
                                  <span className="text-cyan-300">{day.precipitation.toFixed(0)}mm</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                // Menu simplifié
                <div>
                  {/* Header mobile avec dropdown seulement */}
                  <div className="mb-2">
                    <div className="relative">
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="transition-colors p-1"
                        style={{ color: 'rgba(0,255,255,0.9)' }}
                        title="Options"
                      >
                        <Menu size={16} />
                      </button>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 bottom-1 bg-white/10 backdrop-blur-xl 
                                     border border-cyan-400/30 rounded-lg shadow-lg py-1 min-w-[120px] z-50"
                        >
                          <button
                            onClick={() => setIsDayMode(!isDayMode)}
                            className="w-full px-4 py-4 text-left text-sm text-cyan-300/80 
                                       hover:text-cyan-600 hover:bg-white/90 transition-colors min-h-[44px] touch-manipulation"
                            style={{ touchAction: 'manipulation' }}
                          >
                            <div className="flex items-center gap-2">
                              {isDayMode ? <Moon size={16} /> : <Sun size={16} />}
                              {isDayMode ? "Mode nuit" : "Mode jour"}
                            </div>
                          </button>
                          <button
                            onClick={() => {
                              setIsMenuVisible(false);
                              setIsDropdownOpen(false);
                            }}
                            className="w-full px-4 py-4 text-left text-sm text-cyan-300/80 
                                       hover:text-cyan-600 hover:bg-white/90 transition-colors min-h-[44px] touch-manipulation"
                            style={{ touchAction: 'manipulation' }}
                          >
                            Fermer le menu
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  
                  {/* Barre de recherche mobile */}
                  <div className="flex items-center bg-white/10 rounded-lg overflow-hidden ring-1 ring-cyan-400/40 
                                  focus-within:ring-2 focus-within:ring-cyan-300 transition-all mb-3">
                    <span className="px-3 text-cyan-300"><Search size={16} /></span>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && searchCity()}
                      placeholder="Ville..."
                      className="flex-1 px-2 py-2 bg-transparent outline-none 
                                 text-cyan-100 placeholder-cyan-400/50 tracking-wide"
                    />
                    <button
                      onClick={searchCity}
                      className="px-2 py-2 bg-cyan-600 hover:bg-cyan-500 transition rounded-r-lg 
                                 text-white text-sm font-bold shadow-[0_0_12px_rgba(0,255,255,0.6)]"
                    >
                      Go
                    </button>
                  </div>

                  {/* Température uniquement */}
                  {temperature !== null && (
                    <div className="bg-white/10 border border-cyan-400/20 rounded px-3 py-2 
                                    text-pink-300 font-bold text-lg drop-shadow-[0_0_10px_rgba(255,0,128,0.8)] mb-3 flex items-center gap-2">
                      <Thermometer size={20} /> {temperature} °C
                    </div>
                  )}

                  {/* Bouton voir plus */}
                  {coords && (
                    <button
                      onClick={() => setIsExpanded(true)}
                      className="w-full py-2 text-cyan-300 hover:text-cyan-200 transition-colors 
                                 text-sm border border-cyan-400/30 rounded-lg hover:bg-white/5"
                    >
                      <div className="flex items-center gap-1">
                        Voir plus <ChevronDown size={16} />
                      </div>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Menu desktop complet
            <div>
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => setIsDayMode(!isDayMode)}
                  className="flex items-center transition-colors text-xs px-2 py-1 rounded-md
                             hover:bg-white/10"
                  style={{ color: 'rgba(0,255,255,0.9)' }}
                  title={isDayMode ? "Passer en mode nuit" : "Passer en mode jour"}
                >
                  {isDayMode ? <Moon size={16} className="mr-1" /> : <Sun size={16} className="mr-1" />}
                  <span>{isDayMode ? "Mode nuit" : "Mode jour"}</span>
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="transition-colors p-2"
                    style={{ color: 'rgba(0,255,255,0.9)' }}
                    title="Options"
                  >
                    <Menu size={16} />
                  </button>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-8 bg-white/10 backdrop-blur-xl 
                                 border border-cyan-400/30 rounded-lg shadow-lg py-1 min-w-[120px]"
                    >
                      <button
                        onClick={() => {
                          setIsMenuVisible(false);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm text-cyan-300/80 
                                   hover:text-cyan-600 hover:bg-white/90 transition-colors"
                      >
                        Fermer le menu
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
              
              {/* Barre de recherche desktop */}
              <div className="flex items-center bg-white/10 rounded-lg overflow-hidden ring-1 ring-cyan-400/40 
                             focus-within:ring-2 focus-within:ring-cyan-300 transition-all mb-4">
                <span className="px-3 text-cyan-300"><Search size={18} /></span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchCity()}
                  placeholder="Tapez une ville..."
                  className="flex-1 px-2 py-2 bg-transparent outline-none 
                             text-cyan-100 placeholder-cyan-400/50 tracking-wide"
                />
                <button
                  onClick={searchCity}
                  className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 transition rounded-r-lg 
                             text-white text-sm font-bold shadow-[0_0_12px_rgba(0,255,255,0.6)]"
                >
                  Go
                </button>
              </div>

              {/* Infos desktop */}
              {coords ? (
                <motion.div
                  key={coords.lat + coords.lng}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-3 text-sm"
                >
                  <div className="bg-white/10 border border-cyan-400/20 rounded px-3 py-2 
                                  text-cyan-100 tracking-wide drop-shadow-[0_0_8px_rgba(0,255,255,0.6)] flex items-center gap-2">
                    <MapPin size={16} /> <b>Lat:</b> {coords.lat.toFixed(2)} | <b>Lng:</b> {coords.lng.toFixed(2)}
                  </div>
                  {city && (
                    <div className="bg-white/10 border border-cyan-400/20 rounded px-3 py-2 
                                    text-cyan-200 font-semibold flex items-center gap-2">
                      <MapPin size={16} /> {city}
                    </div>
                  )}
                  {temperature !== null && (
                    <div className="bg-white/10 border border-cyan-400/20 rounded px-3 py-2 
                                    text-pink-300 font-bold text-lg drop-shadow-[0_0_10px_rgba(255,0,128,0.8)] flex items-center gap-2">
                      <Thermometer size={20} /> {temperature} °C
                    </div>
                  )}
                  {windSpeed !== null && (
                    <div className="bg-white/10 border border-cyan-400/20 rounded px-3 py-2 
                                    text-green-300 font-semibold drop-shadow-[0_0_8px_rgba(0,255,128,0.6)] flex items-center gap-2">
                      <Wind size={18} /> {windSpeed} km/h
                    </div>
                  )}
                  {precipitation !== null && (
                    <div className="bg-white/10 border border-cyan-400/20 rounded px-3 py-2 
                                    text-blue-300 font-semibold drop-shadow-[0_0_8px_rgba(0,128,255,0.6)] flex items-center gap-2">
                      <CloudRain size={18} /> {precipitation} mm
                    </div>
                  )}
                  
                  {/* Prévisions 7 jours */}
                  {forecast.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="mt-6 space-y-2"
                    >
                      <h3 className="text-cyan-300 font-bold text-sm tracking-wider mb-3 flex items-center gap-2">
                        <Calendar size={16} /> PRÉVISIONS 7 JOURS
                      </h3>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {forecast.map((day, index) => (
                          <div
                            key={day.date}
                            className="bg-white/5 border border-cyan-400/15 rounded-lg px-3 py-2 
                                       text-xs flex justify-between items-center"
                          >
                            <div className="text-cyan-200">
                              {index === 0 ? "Aujourd'hui" : 
                               new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-orange-300">{day.tempMax.toFixed(0)}°</span>
                              <span className="text-blue-300">{day.tempMin.toFixed(0)}°</span>
                              <span className="text-cyan-300">{day.precipitation.toFixed(0)}mm</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <p className="text-cyan-200/70 text-sm italic">👉 Clique sur le globe ou cherche une ville</p>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Bouton pour rouvrir le menu */}
      {!isMenuVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsMenuVisible(true)}
          className="absolute top-6 left-6 p-3 rounded-full
                     bg-gradient-to-br from-cyan-500/20 to-cyan-600/20
                     backdrop-blur-xl border border-cyan-400/40
                     text-cyan-300 hover:text-white
                     hover:bg-gradient-to-br hover:from-cyan-500/30 hover:to-cyan-600/30
                     shadow-[0_0_20px_rgba(0,255,255,0.4)]
                     hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]
                     transition-all duration-300"
          title="Ouvrir Globe Explorer"
        >
          <GlobeIcon size={24} />
        </motion.button>
      )}

    </main>
  );
}
