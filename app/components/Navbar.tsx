export default function Navbar({ onAboutClick }: { onAboutClick: () => void }) {
    // ajoute un effet glow au texte
    // explique le fonctionnement de l'effet glow et à quoi correspondent les trois valeurs de pixels
    //comment mettre une background image dans le style en react
    return (
    <div className="h-25 flex items-center justify-between bg-black text-4xl px-8"
       style={{ color: 'rgba(0,255,255, 0.67)', textShadow: '0 5px 35px rgba(0,255,255, 0.97)' }}>
      <div>Meteo Explorer</div>
      <div className="text-sm cursor-pointer hover:opacity-70" onClick={onAboutClick}>About</div>
  </div>)
}