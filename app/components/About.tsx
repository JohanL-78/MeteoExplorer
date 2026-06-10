const fd = "font-[family-name:var(--font-display)]";
const fm = "font-[family-name:var(--font-mono)]";

const techStack = [
  ["react-globe.gl", "Wrapper React de globe.gl pour la visualisation 3D"],
  ["Three.js", "Moteur de rendu 3D WebGL"],
  ["Next.js", "Framework React avec App Router"],
  ["Framer Motion", "Animations et transitions fluides"],
  ["Lucide React", "Bibliothèque d'icônes modernes"],
  ["Tailwind CSS", "Framework CSS utilitaire"],
  ["TypeScript", "Typage statique pour JavaScript"],
];

const apis = [
  ["Open-Meteo", "Données météo en temps réel — température, vent, précipitations, prévisions 7 jours"],
  ["Nominatim", "Géocodage et géocodage inverse — recherche de villes, coordonnées GPS"],
];

const credits = [
  ["Vasturiano", "Créateur de globe.gl et react-globe.gl"],
  ["Open-Meteo", "API météorologique gratuite et open-source"],
  ["OpenStreetMap", "Service de géocodage gratuit"],
  ["Three.js", "Écosystème de visualisation 3D"],
];

export default function About({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(11,15,16,0.88)", backdropFilter: "blur(16px)" }}
    >
      {/* Overlay grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(246,241,232,0.026) 1px, transparent 1px), linear-gradient(90deg, rgba(246,241,232,0.020) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative bg-[#11110F] border border-[#F6F1E8]/[0.08] rounded-[1.15rem] p-8 max-w-2xl w-full mx-4 max-h-[84vh] overflow-y-auto shadow-[0_24px_64px_rgba(0,0,0,0.6)]">

        {/* Barre teal top — slide in */}
        <div className="absolute top-0 left-8 right-8 h-[2px] rounded-full bg-[#2F6F73]" />

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className={`${fm} text-[10px] uppercase tracking-[0.26em] text-[#2F6F73] mb-3`}>
              // À propos
            </p>
            <h1 className={`${fd} text-2xl md:text-3xl font-semibold tracking-[-0.04em] text-[#F6F1E8]`}>
              Meteo Explorer
            </h1>
          </div>
          <button
            onClick={onClose}
            className={`${fm} group relative inline-flex items-center overflow-hidden rounded-full border border-[#F6F1E8]/[0.12] px-4 py-[7px] text-[10px] uppercase tracking-[0.12em] text-[#F6F1E8]/45 transition-colors duration-500 hover:border-[#F6F1E8]/30 hover:text-[#0B0F10] mt-1 cursor-pointer shrink-0`}
          >
            <span className="absolute inset-0 origin-right scale-x-0 bg-[#F6F1E8] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:origin-left group-hover:scale-x-100" />
            <span className="relative z-10">Fermer</span>
          </button>
        </div>

        {/* Description */}
        <p className={`${fm} text-sm leading-relaxed text-[#F6F1E8]/60 mb-8`}>
          Application interactive qui visualise les données météorologiques mondiales sur un globe 3D.
          Données temps réel via Open-Meteo, géocodage avec Nominatim, rendu WebGL avec Three.js et react-globe.gl.
        </p>

        {/* Technologies */}
        <section className="mb-8">
          <p className={`${fm} text-[10px] uppercase tracking-[0.26em] text-[#2F6F73] mb-4`}>
            // Technologies
          </p>
          <div className="space-y-0">
            {techStack.map(([name, desc]) => (
              <div
                key={name}
                className="group relative flex gap-4 py-3 border-b border-[#F6F1E8]/[0.05] hover:bg-[#2F6F73]/[0.03] transition-colors duration-300 px-1"
              >
                <div className="absolute left-0 top-0 w-[2px] h-0 bg-[#2F6F73] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:h-full" />
                <span className={`${fd} text-sm font-semibold text-[#F6F1E8]/80 w-36 shrink-0 pl-2`}>{name}</span>
                <span className={`${fm} text-xs text-[#F6F1E8]/40 leading-relaxed self-center`}>{desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* APIs */}
        <section className="mb-8">
          <p className={`${fm} text-[10px] uppercase tracking-[0.26em] text-[#2F6F73] mb-4`}>
            // APIs
          </p>
          <div className="grid grid-cols-1 gap-4">
            {apis.map(([name, desc]) => (
              <div
                key={name}
                className="group relative overflow-hidden rounded-[0.75rem] border border-[#F6F1E8]/[0.07] bg-[#1B1A17] p-5 hover:border-[#2F6F73]/15 transition-all duration-500"
              >
                <div className="absolute inset-x-0 top-0 h-[2px] bg-[#2F6F73] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] origin-left" />
                <p className={`${fd} text-base font-semibold tracking-[-0.03em] mb-1`}>{name}</p>
                <p className={`${fm} text-xs text-[#F6F1E8]/50 leading-relaxed`}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Crédits + Développeur */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section>
            <p className={`${fm} text-[10px] uppercase tracking-[0.26em] text-[#2F6F73] mb-4`}>
              // Remerciements
            </p>
            <div className="space-y-2">
              {credits.map(([name, role]) => (
                <div key={name} className="flex gap-2 text-sm">
                  <span className={`${fd} text-[#F6F1E8]/70 font-medium`}>{name}</span>
                  <span className={`${fm} text-[#F6F1E8]/35 text-xs self-center`}>— {role}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <p className={`${fm} text-[10px] uppercase tracking-[0.26em] text-[#2F6F73] mb-4`}>
              // Développeur
            </p>
            <p className={`${fd} text-base font-semibold text-[#F6F1E8]/80 mb-4`}>Johan Lorck</p>
            <a
              href="https://github.com/JohanL-78/MeteoExplorer.git"
              target="_blank"
              rel="noopener noreferrer"
              className={`${fm} group relative inline-flex items-center overflow-hidden rounded-full border border-[#2F6F73]/25 bg-[#2F6F73]/[0.08] px-4 py-2 text-[10px] uppercase tracking-[0.12em] text-[#2F6F73]/70 transition-all duration-300 hover:bg-[#2F6F73]/15 hover:border-[#2F6F73]/40 hover:text-[#2F6F73]`}
            >
              GitHub ↗
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
