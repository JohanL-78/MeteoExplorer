# 🌍 Meteo Explorer

Une application météorologique interactive avec un globe 3D immersif construit avec Next.js et react-globe.gl.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![React](https://img.shields.io/badge/React-19.1-blue)
![Three.js](https://img.shields.io/badge/Three.js-3D-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

## ✨ Fonctionnalités

- 🌍 **Globe 3D interactif** avec navigation fluide
- 🌡️ **Données météo en temps réel** (température, vent, précipitations)
- 📅 **Prévisions 7 jours** détaillées
- 🌙 **Mode jour/nuit** avec textures dynamiques
- 📱 **Interface responsive** (mobile & desktop)
- 🔍 **Recherche de villes** avec géocodage
- ⚡ **Animations fluides** avec Framer Motion

## 🚀 Technologies utilisées

- **Frontend :** Next.js 15, React 19, TypeScript
- **3D :** react-globe.gl, Three.js
- **Styling :** Tailwind CSS, Framer Motion
- **Icons :** Lucide React
- **APIs :** Open-Meteo (météo), OpenStreetMap Nominatim (géocodage)
- **Déploiement :** Vercel
- **Analytics :** Vercel Analytics

## 🛠️ Installation

```bash
# Cloner le repository
git clone https://github.com/johanlorck/threeglobe.git
cd threeglobe

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📦 Scripts disponibles

```bash
npm run dev      # Développement
npm run build    # Build de production
npm run start    # Démarrer en production
npm run lint     # Linter ESLint
```

## 🎯 Utilisation

1. **Navigation :** Cliquez et faites glisser pour explorer le globe
2. **Météo :** Cliquez sur n'importe quel point pour obtenir les données météo
3. **Recherche :** Utilisez la barre de recherche pour trouver une ville
4. **Mode nuit :** Basculez entre les textures jour/nuit
5. **Mobile :** Menu adaptatif avec vue étendue des détails météo

## 🌐 APIs utilisées

- **[Open-Meteo](https://open-meteo.com/)** - Données météorologiques gratuites
- **[OpenStreetMap Nominatim](https://nominatim.org/)** - Service de géocodage

## 🎨 Fonctionnalités techniques

- **Lazy Loading :** Chargement différé du composant 3D pour optimiser les performances
- **Responsive Design :** Interface adaptée à tous les écrans
- **Gestion d'erreurs :** Fallbacks pour les zones sans données (océans, déserts)



## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- **[Vasturiano](https://github.com/vasturiano)** - Créateur de globe.gl et react-globe.gl
- **[Open-Meteo](https://open-meteo.com/)** - API météorologique gratuite
- **[OpenStreetMap](https://www.openstreetmap.org/)** - Données géographiques ouvertes
- **[Three.js Community](https://threejs.org/)** - Écosystème de visualisation 3D

## 👨‍💻 Auteur

**Johan Lorck**  
GitHub: [@johanlorck](https://github.com/johanlorck)

---

⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !
