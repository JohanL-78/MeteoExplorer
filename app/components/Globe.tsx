"use client";

import dynamic from "next/dynamic";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  Wind,
  CloudRain,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Globe as GlobeIcon,
} from "lucide-react";

const fd = "font-[family-name:var(--font-display)]";
const fm = "font-[family-name:var(--font-mono)]";

const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-[#0B0F10]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border border-[#2F6F73] border-t-transparent mb-6 mx-auto" />
        <p className={`${fm} text-[10px] uppercase tracking-[0.26em] text-[#B8B2A8]`}>
          Chargement du globe 3D...
        </p>
      </div>
    </div>
  )
});

export default function Home() {
  const globeRef = useRef<any>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [windSpeed, setWindSpeed] = useState<number | null>(null);
  const [precipitation, setPrecipitation] = useState<number | null>(null);
  const [forecast, setForecast] = useState<Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    precipitation: number;
  }>>([]);
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isDayMode, setIsDayMode] = useState<boolean>(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [globeReady, setGlobeReady] = useState<boolean>(false);

  // Gestion du redimensionnement et détection mobile
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setDimensions({ width, height });
      setIsMobile(width < 768);

      if (globeRef.current) {
        setTimeout(() => {
          const canvas = globeRef.current?.scene()?.children[0]?.children.find(
            (child: any) => child.type === 'WebGLRenderer'
          );
          if (canvas) {
            globeRef.current?.renderer().setSize(window.innerWidth, window.innerHeight);
          }
        }, 100);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Décalage horizontal du globe sur desktop via setViewOffset
  useEffect(() => {
    if (!globeReady || !globeRef.current || dimensions.width === 0) return;
    const camera = globeRef.current.camera();
    if (!isMobile) {
      const shift = 110; // px vers la droite
      camera.setViewOffset(
        dimensions.width, dimensions.height,
        -shift, 0,
        dimensions.width, dimensions.height
      );
    } else {
      camera.clearViewOffset?.();
    }
  }, [globeReady, dimensions, isMobile]);

  const fetchWeather = async (lat: number, lng: number) => {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
    );
    const data = await res.json();
    console.log("Données météo:", data);
    setTemperature(data.current.temperature_2m);
    setWindSpeed(data.current.wind_speed_10m);
    setPrecipitation(data.current.precipitation);

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
      if (data.address) {
        setCity(
          data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.country ||
            "Coordonnées GPS"
        );
      } else {
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
      globeRef.current?.pointOfView(
        {
          lat: isMobile ? latNum - 20 : latNum,
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
          ringColor={(d: any) => d.color}
          ringMaxRadius={(d: any) => d.maxRadius}
          ringPropagationSpeed={(d: any) => d.propagationSpeed}
          ringRepeatPeriod={(d: any) => d.repeatPeriod}
          showAtmosphere={true}
          atmosphereColor="rgb(0,255,255)"
          atmosphereAltitude={0.18}
          enablePointerInteraction={true}
          width={dimensions.width}
          height={dimensions.height}
          onGlobeReady={() => {
            setGlobeReady(true);
            if (globeRef.current) {
              globeRef.current.pointOfView({
                lat: isMobile ? -30 : 0,
                lng: isMobile ? 30 : 50,
                altitude: isMobile ? 4.5 : 2.5
              }, 0);
            }
          }}
          onGlobeClick={(c: { lat: number; lng: number }) => {
            setCoords(c);
            fetchWeather(c.lat, c.lng);
            fetchCity(c.lat, c.lng);
            setQuery("");
          }}
        />
      )}

      {/* Panel météo */}
      {isMenuVisible && (
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`absolute border border-[#F6F1E8]/[0.08] shadow-[0_8px_48px_rgba(0,0,0,0.6)] ${
            isMobile
              ? (isExpanded
                  ? 'inset-4 rounded-[1.15rem] text-sm overflow-y-auto'
                  : 'top-2 left-10 right-10 rounded-xl text-xs overflow-hidden')
              : 'top-6 left-6 w-[22rem] rounded-[1.15rem] max-h-[calc(100vh-3rem)] overflow-y-auto'
          }`}
          style={{
            background: 'rgba(17,17,15,0.88)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Texture grille sur le panel */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(246,241,232,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(246,241,232,0.022) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
            }}
          />

          <div className="relative z-10 p-4">

          {isMobile ? (
            // Menu mobile
            <div>
              {isExpanded ? (
                // Menu étendu
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <div>
                      <p className={`${fm} text-[9px] uppercase tracking-[0.26em] text-[#2F6F73] mb-1`}>
                        // Météo Détaillée
                      </p>
                      <h3 className={`${fd} text-base font-semibold tracking-[-0.03em] text-[#F6F1E8]`}>
                        {city || "Sélectionner un lieu"}
                      </h3>
                    </div>
                    <button
                      onClick={() => setIsExpanded(false)}
                      className={`${fm} text-[#F6F1E8]/40 hover:text-[#F6F1E8] hover:bg-[#F6F1E8]/5 transition-all rounded-lg p-3 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation`}
                      style={{ touchAction: 'manipulation' }}
                    >
                      <X size={18} />
                    </button>
                  </div>

                  {coords && (
                    <div className="space-y-2">
                      <div className={`${fm} flex items-center gap-2 py-2 border-b border-[#F6F1E8]/[0.05] text-[10px] text-[#B8B2A8]`}>
                        <MapPin size={12} className="text-[#2F6F73]" />
                        {coords.lat.toFixed(3)}° / {coords.lng.toFixed(3)}°
                      </div>

                      {temperature !== null && (
                        <div className="py-3 border-b border-[#F6F1E8]/[0.05]">
                          <p className={`${fm} text-[9px] uppercase tracking-[0.22em] text-[#B8B2A8] mb-1`}>
                            Température
                          </p>
                          <p className={`${fd} text-3xl font-semibold tracking-[-0.04em] text-[#F6B87A]`}>
                            {temperature}°C
                          </p>
                        </div>
                      )}
                      {windSpeed !== null && (
                        <div className={`${fm} flex items-center justify-between py-2 border-b border-[#F6F1E8]/[0.05] text-xs`}>
                          <span className="flex items-center gap-2 text-[#B8B2A8]"><Wind size={13} /> Vent</span>
                          <span className="text-[#7BB8BC] font-medium">{windSpeed} km/h</span>
                        </div>
                      )}
                      {precipitation !== null && (
                        <div className={`${fm} flex items-center justify-between py-2 border-b border-[#F6F1E8]/[0.05] text-xs`}>
                          <span className="flex items-center gap-2 text-[#B8B2A8]"><CloudRain size={13} /> Précip.</span>
                          <span className="text-[#8BB5C8] font-medium">{precipitation} mm</span>
                        </div>
                      )}

                      {forecast.length > 0 && (
                        <div className="mt-4">
                          <p className={`${fm} text-[9px] uppercase tracking-[0.22em] text-[#2F6F73] mb-3`}>
                            // Prévisions 7 jours
                          </p>
                          <div className="space-y-1">
                            {forecast.map((day, index) => (
                              <div
                                key={day.date}
                                className={`${fm} flex justify-between items-center py-2 border-b border-[#F6F1E8]/[0.04] text-[10px]`}
                              >
                                <span className="text-[#F6F1E8]/55">
                                  {index === 0 ? "Aujourd'hui" :
                                   new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                                </span>
                                <div className="flex items-center gap-3">
                                  <span className="text-[#F6B87A]">{day.tempMax.toFixed(0)}°</span>
                                  <span className="text-[#8BB5C8]">{day.tempMin.toFixed(0)}°</span>
                                  <span className="text-[#7BB8BC]">{day.precipitation.toFixed(0)}mm</span>
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
                // Menu simplifié mobile
                <div>
                  <div className="mb-2">
                    <div className="relative">
                      <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`${fm} transition-colors p-1 text-[#F6F1E8]/55 hover:text-[#F6F1E8]`}
                      >
                        <Menu size={15} />
                      </button>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="absolute right-0 bottom-1 bg-[#1B1A17] backdrop-blur-xl border border-[#F6F1E8]/[0.08] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.5)] py-1 min-w-[130px] z-50"
                        >
                          <button
                            onClick={() => setIsDayMode(!isDayMode)}
                            className={`${fm} w-full px-4 py-3 text-left text-[11px] uppercase tracking-[0.1em] text-[#F6F1E8]/55 hover:text-[#F6F1E8] hover:bg-[#F6F1E8]/5 transition-colors min-h-[44px] touch-manipulation flex items-center gap-2`}
                            style={{ touchAction: 'manipulation' }}
                          >
                            {isDayMode ? <Moon size={13} /> : <Sun size={13} />}
                            {isDayMode ? "Mode nuit" : "Mode jour"}
                          </button>
                          <button
                            onClick={() => { setIsMenuVisible(false); setIsDropdownOpen(false); }}
                            className={`${fm} w-full px-4 py-3 text-left text-[11px] uppercase tracking-[0.1em] text-[#F6F1E8]/55 hover:text-[#F6F1E8] hover:bg-[#F6F1E8]/5 transition-colors min-h-[44px] touch-manipulation`}
                            style={{ touchAction: 'manipulation' }}
                          >
                            Fermer
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Recherche mobile */}
                  <div className="flex items-center bg-[#F6F1E8]/[0.04] rounded-lg overflow-hidden ring-1 ring-[#2F6F73]/25 focus-within:ring-[#2F6F73] transition-all mb-2">
                    <span className="px-3 text-[#2F6F73]"><Search size={13} /></span>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && searchCity()}
                      placeholder="Ville..."
                      className={`${fm} flex-1 px-2 py-2 bg-transparent outline-none text-[#F6F1E8]/75 placeholder-[#F6F1E8]/25 text-[11px] tracking-wide`}
                    />
                    <button
                      onClick={searchCity}
                      className={`${fm} px-3 py-2 bg-[#2F6F73] hover:bg-[#3a8589] transition text-[#F6F1E8] text-[10px] uppercase tracking-[0.1em] font-medium`}
                    >
                      Go
                    </button>
                  </div>

                  {temperature !== null && (
                    <div className="py-2 mb-2">
                      <p className={`${fd} text-2xl font-semibold tracking-[-0.04em] text-[#F6B87A]`}>
                        {temperature}°C
                      </p>
                    </div>
                  )}

                  {coords && (
                    <button
                      onClick={() => setIsExpanded(true)}
                      className={`${fm} w-full py-2 text-[#F6F1E8]/45 hover:text-[#F6F1E8] transition-colors text-[10px] uppercase tracking-[0.1em] border border-[#F6F1E8]/[0.08] rounded-lg hover:bg-[#F6F1E8]/[0.03] flex items-center justify-center gap-1`}
                    >
                      Voir plus <ChevronDown size={12} />
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Menu desktop
            <div>
              {/* Header desktop */}
              <div className="flex justify-between items-center mb-5">
                <p className={`${fm} text-[10px] uppercase tracking-[0.26em] text-[#2F6F73]`}>
                  // Météo Globe
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsDayMode(!isDayMode)}
                    className={`${fm} flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] px-2 py-1 rounded-md text-[#F6F1E8]/45 hover:text-[#F6F1E8] hover:bg-[#F6F1E8]/5 transition-colors`}
                  >
                    {isDayMode ? <Moon size={13} /> : <Sun size={13} />}
                    {isDayMode ? "Nuit" : "Jour"}
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`${fm} transition-colors p-2 text-[#F6F1E8]/45 hover:text-[#F6F1E8]`}
                    >
                      <Menu size={13} />
                    </button>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 top-8 bg-[#1B1A17] backdrop-blur-xl border border-[#F6F1E8]/[0.08] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.5)] py-1 min-w-[130px] z-50"
                      >
                        <button
                          onClick={() => { setIsMenuVisible(false); setIsDropdownOpen(false); }}
                          className={`${fm} w-full px-4 py-2 text-left text-[11px] uppercase tracking-[0.1em] text-[#F6F1E8]/55 hover:text-[#F6F1E8] hover:bg-[#F6F1E8]/5 transition-colors`}
                        >
                          Fermer
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recherche desktop */}
              <div className="flex items-center bg-[#F6F1E8]/[0.04] rounded-lg overflow-hidden ring-1 ring-[#2F6F73]/25 focus-within:ring-[#2F6F73] transition-all mb-5">
                <span className="px-3 text-[#2F6F73]"><Search size={15} /></span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchCity()}
                  placeholder="Rechercher une ville..."
                  className={`${fm} flex-1 px-2 py-2.5 bg-transparent outline-none text-[#F6F1E8]/75 placeholder-[#F6F1E8]/25 text-xs tracking-wide`}
                />
                <button
                  onClick={searchCity}
                  className={`${fm} px-3 py-2.5 bg-[#2F6F73] hover:bg-[#3a8589] transition text-[#F6F1E8] text-[10px] uppercase tracking-[0.1em] font-medium`}
                >
                  Go
                </button>
              </div>

              {/* Données desktop */}
              {coords ? (
                <motion.div
                  key={coords.lat + coords.lng}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Coordonnées + ville */}
                  <div className={`${fm} text-xs text-[#B8B2A8] mb-1 flex items-center gap-1.5`}>
                    <MapPin size={12} className="text-[#2F6F73]" />
                    {coords.lat.toFixed(3)}° / {coords.lng.toFixed(3)}°
                  </div>
                  {city && (
                    <p className={`${fd} text-base font-semibold tracking-[-0.02em] text-[#F6F1E8]/80 mb-5 truncate`}>
                      {city}
                    </p>
                  )}

                  {/* Température — grand affichage */}
                  {temperature !== null && (
                    <div className="pb-4 mb-4 border-b border-[#F6F1E8]/[0.06]">
                      <p className={`${fm} text-[10px] uppercase tracking-[0.22em] text-[#B8B2A8] mb-1`}>
                        Température
                      </p>
                      <p className={`${fd} text-5xl font-semibold tracking-[-0.04em] text-[#F6B87A]`}>
                        {temperature}°C
                      </p>
                    </div>
                  )}

                  {/* Vent + Précipitations */}
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {windSpeed !== null && (
                      <div className="bg-[#F6F1E8]/[0.03] border border-[#F6F1E8]/[0.06] rounded-lg p-3">
                        <p className={`${fm} text-[10px] uppercase tracking-[0.18em] text-[#B8B2A8] mb-1.5 flex items-center gap-1`}>
                          <Wind size={11} /> Vent
                        </p>
                        <p className={`${fd} text-xl font-semibold tracking-[-0.03em] text-[#7BB8BC]`}>
                          {windSpeed}<span className="text-sm font-normal text-[#7BB8BC]/60 ml-0.5">km/h</span>
                        </p>
                      </div>
                    )}
                    {precipitation !== null && (
                      <div className="bg-[#F6F1E8]/[0.03] border border-[#F6F1E8]/[0.06] rounded-lg p-3">
                        <p className={`${fm} text-[10px] uppercase tracking-[0.18em] text-[#B8B2A8] mb-1.5 flex items-center gap-1`}>
                          <CloudRain size={11} /> Précip.
                        </p>
                        <p className={`${fd} text-xl font-semibold tracking-[-0.03em] text-[#8BB5C8]`}>
                          {precipitation}<span className="text-sm font-normal text-[#8BB5C8]/60 ml-0.5">mm</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Prévisions 7 jours */}
                  {forecast.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <p className={`${fm} text-[10px] uppercase tracking-[0.22em] text-[#2F6F73] mb-3`}>
                        // Prévisions 7 jours
                      </p>
                      <div className="space-y-0">
                        {forecast.map((day, index) => (
                          <div
                            key={day.date}
                            className={`${fm} flex justify-between items-center py-2.5 border-b border-[#F6F1E8]/[0.04] text-xs`}
                          >
                            <span className="text-[#F6F1E8]/50 w-16">
                              {index === 0 ? "Auj." :
                               new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                            </span>
                            <div className="flex items-center gap-4">
                              <span className="text-[#F6B87A]">{day.tempMax.toFixed(0)}°</span>
                              <span className="text-[#8BB5C8]">{day.tempMin.toFixed(0)}°</span>
                              <span className="text-[#7BB8BC] w-9 text-right">{day.precipitation.toFixed(0)}mm</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <div className="py-4">
                  <p className={`${fm} text-[10px] uppercase tracking-[0.18em] text-[#F6F1E8]/30`}>
                    Cliquer sur le globe<br />ou rechercher une ville
                  </p>
                </div>
              )}
            </div>
          )}

          </div>
        </motion.div>
      )}

      {/* Bouton rouvrir */}
      {!isMenuVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          onClick={() => setIsMenuVisible(true)}
          className={`${fm} absolute top-6 left-6 p-3 rounded-full bg-[#11110F]/85 backdrop-blur-xl border border-[#F6F1E8]/[0.08] text-[#F6F1E8]/45 hover:text-[#F6F1E8] hover:border-[#2F6F73]/35 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300`}
          title="Ouvrir le panel"
        >
          <GlobeIcon size={20} />
        </motion.button>
      )}
    </main>
  );
}
