const fm = "font-[family-name:var(--font-mono)]";

export default function Navbar({ onAboutClick }: { onAboutClick: () => void }) {
  return (
    <header className="relative h-20 grid grid-cols-[auto_1fr_auto] items-center gap-6 px-6 md:px-10 border-b border-[#F6F1E8]/[0.12] z-10 overflow-hidden">

      {/* Fond dark */}
      <div className="absolute inset-0 bg-[#0B0F10]" />
      {/* Lueur teal très subtile côté droit */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 95% 50%, rgba(47,111,115,0.10), transparent 45%)",
        }}
      />
      {/* Grille texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(246,241,232,0.026) 1px, transparent 1px), linear-gradient(90deg, rgba(246,241,232,0.020) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Logo */}
      <div className={`${fm} relative z-10 group flex items-center gap-3 text-[11px] uppercase tracking-[0.14em]`}>
        <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-[4px] border border-[#F6F1E8]/[0.22] text-[13px] font-semibold text-[#F6F1E8]">
          <span className="absolute inset-0 translate-y-full bg-[#2F6F73] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0" />
          <span className="relative z-10">ME</span>
        </span>
        <div className="flex flex-col leading-tight">
          <span className="text-[#F6F1E8] font-medium">Meteo Explorer</span>
          <span className="text-[#B8B2A8] text-[9px] tracking-[0.18em]">Globe 3D interactif</span>
        </div>
      </div>

      {/* Centre vide */}
      <div className="relative z-10" />

      {/* About — slide fill */}
      <button
        onClick={onAboutClick}
        className={`${fm} relative z-10 group inline-flex items-center overflow-hidden rounded-full border border-[#F6F1E8]/[0.18] px-5 py-2 text-[10px] uppercase tracking-[0.14em] text-[#F6F1E8]/65 transition-colors duration-500 hover:border-[#F6F1E8]/40 hover:text-[#0B0F10] cursor-pointer`}
      >
        <span className="absolute inset-0 origin-right scale-x-0 bg-[#F6F1E8] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:origin-left group-hover:scale-x-100" />
        <span className="relative z-10">About</span>
      </button>
    </header>
  );
}
