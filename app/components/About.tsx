export default function About({ onClose }: { onClose: () => void }) {
    return (
        
        <div className="fixed inset-0 bg-opacity-90 z-50 flex items-center justify-center"
             style={{ backgroundImage: 'url(https://cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png)' }}>
            <div className="bg-black border border-cyan-400 rounded-lg p-8 max-w-2xl max-h-[80vh] overflow-y-auto" 
                 style={{ color: 'rgba(0,255,255, 0.87)', boxShadow: '0 0 20px rgba(0,255,255, 0.3)' }}>
                
                {/* Close button */}
                <div className="flex justify-end mb-4">
                    <button 
                        onClick={onClose}
                        className="text-2xl hover:opacity-70 transition-opacity"
                        style={{ color: 'rgba(0,255,255, 0.67)' }}>
                        ✕
                    </button>
                </div>

                {/* Title */}
                <h1 className="text-3xl mb-6 text-center" 
                    style={{ color: 'rgba(0,255,255, 0.67)', textShadow: '0 3px 20px rgba(0,255,255, 0.7)' }}>
                    À propos de Meteo Explorer
                </h1>

                {/* App Description */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-xl mb-3" style={{ color: 'rgba(0,255,255, 0.8)' }}>
                        Fonctionnement de l&apos;application
                    </h2>
                    <p className="text-base leading-relaxed font-sans">
                        Meteo Explorer est une application interactive qui visualise les données météorologiques 
                        mondiales sur un globe 3D interactif. L&apos;application utilise react-globe.gl pour créer 
                        une expérience immersive permettant d&apos;explorer en temps réel les conditions météorologiques 
                        de différentes régions du monde.
                    </p>
                    <p className="text-base leading-relaxed font-sans">
                        L&apos;interface propose une navigation fluide avec des animations Framer Motion, des icônes 
                        Lucide React, et une interface responsive adaptée aux appareils mobiles et desktop. 
                        Les données météorologiques sont récupérées via l&apos;API Open-Meteo et les coordonnées 
                        géographiques sont géocodées avec l&apos;API OpenStreetMap Nominatim.
                    </p>
                </div>

                {/* Technologies */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-xl mb-3" style={{ color: 'rgba(0,255,255, 0.8)' }}>
                        Technologies utilisées
                    </h2>
                    <div className="text-base space-y-2 font-sans">
                        <p>• <span className="font-semibold">react-globe.gl</span> - Wrapper React de globe.gl pour la visualisation 3D</p>
                        <p>• <span className="font-semibold">Three.js</span> - Moteur de rendu 3D WebGL</p>
                        <p>• <span className="font-semibold">Next.js</span> - Framework React avec App Router</p>
                        <p>• <span className="font-semibold">Framer Motion</span> - Animations et transitions fluides</p>
                        <p>• <span className="font-semibold">Lucide React</span> - Bibliothèque d&apos;icônes modernes</p>
                        <p>• <span className="font-semibold">Tailwind CSS</span> - Framework CSS utilitaire</p>
                        <p>• <span className="font-semibold">TypeScript</span> - Typage statique pour JavaScript</p>
                    </div>
                </div>

                {/* APIs */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-xl mb-3" style={{ color: 'rgba(0,255,255, 0.8)' }}>
                        APIs utilisées
                    </h2>
                    <div className="text-base space-y-2 font-sans">
                        <p>• <span className="font-semibold">Open-Meteo API</span> - Données météorologiques en temps réel (température, vent, précipitations, prévisions 7 jours)</p>
                        <p>• <span className="font-semibold">OpenStreetMap Nominatim API</span> - Géocodage et géocodage inverse (recherche de villes, coordonnées GPS)</p>
                    </div>
                </div>

                {/* Credits */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-xl mb-3" style={{ color: 'rgba(0,255,255, 0.8)' }}>
                        Remerciements
                    </h2>
                    <div className="text-base space-y-2 font-sans">
                        <p>• <span className="font-semibold">Vasturiano</span> - Créateur de globe.gl et react-globe.gl</p>
                        <p>• <span className="font-semibold">Open-Meteo</span> - API météorologique gratuite et open-source</p>
                        <p>• <span className="font-semibold">OpenStreetMap Nominatim</span> - Service de géocodage gratuit</p>
                        <p>• <span className="font-semibold">Three.js Community</span> - Écosystème de visualisation 3D</p>
                    </div>
                </div>

                {/* Author */}
                <div className="space-y-4">
                    <h2 className="text-xl mb-3" style={{ color: 'rgba(0,255,255, 0.8)' }}>
                        Développeur
                    </h2>
                    <p className="text-base mb-3 font-sans">
                        Créé par Johan Lorck
                    </p>
                    <a 
                        href="https://github.com/JohanL-78/MeteoExplorer.git" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 border border-cyan-400 rounded text-cyan-300 hover:bg-cyan-400 hover:text-white transition-all duration-300">
                        GitHub Profile
                    </a>
                </div>
            </div>
        </div>
    );
}