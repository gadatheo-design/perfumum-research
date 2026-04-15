# Observations - Page Patrimoine Menacé

## État actuel (05 Jan 2026 - 17:21)

La page affiche un écran blanc, ce qui indique probablement une erreur TypeScript ou de compilation qui empêche le chargement de la page.

## Erreurs détectées

D'après le statut du projet, il y a 35 erreurs TypeScript en cours de compilation.

## Actions à effectuer

1. Corriger les erreurs TypeScript dans le code
2. Vérifier que les imports sont corrects
3. Vérifier que les procédures tRPC sont bien définies
4. Redémarrer le serveur si nécessaire
5. Tester à nouveau la page

## Fonctionnalités implémentées

### Base de données
- ✅ Ajout des colonnes `latitude` et `longitude` à la table `plants`
- ✅ Création de la table `geographic_zones` avec 8 zones
- ✅ Création de la table de liaison `plant_geographic_zones`
- ✅ Import de 10 espèces avec coordonnées GPS précises
- ✅ Import de 8 zones géographiques avec polygones

### Backend (server/db.ts)
- ✅ Fonction `listGeographicZones()` pour récupérer les zones
- ✅ Fonction `getGeographicZone()` pour une zone spécifique
- ✅ Fonction `createGeographicZone()` pour créer une zone
- ✅ Fonction `updateGeographicZone()` pour mettre à jour une zone
- ✅ Fonction `deleteGeographicZone()` pour supprimer une zone

### API (server/routers.ts)
- ✅ Procédure tRPC `plantsConservation.listGeographicZones`

### Frontend (client/src/pages/PatrimoineMenace.tsx)
- ✅ État pour les overlays (`overlays`, `showOverlays`, `overlayFilter`)
- ✅ Appel tRPC pour récupérer les zones géographiques
- ✅ Effet `useEffect` pour mettre à jour les overlays dynamiquement
- ✅ Contrôles UI pour afficher/masquer les overlays
- ✅ Filtres par type de zone (menacées, alternatives durables, etc.)
- ✅ Logique de rendu des polygones Google Maps
- ✅ InfoWindows interactives pour chaque zone
- ✅ Utilisation des vraies coordonnées GPS des plantes

## Zones géographiques créées

1. **Somalie - Zone critique Boswellia** (threatened_concentration) - Rouge foncé
2. **Oman - Dhofar (Boswellia sacra)** (conservation_area) - Orange
3. **Asie du Sud-Est - Triangle Aquilaria** (threatened_concentration) - Rouge foncé
4. **Inde du Sud - Karnataka (Santalum album)** (conservation_area) - Orange
5. **Madagascar - Forêts de Dalbergia** (threatened_concentration) - Rouge foncé
6. **Bulgarie - Vallée des Roses** (sustainable_alternatives) - Vert
7. **Comores - Archipel Ylang-Ylang** (biodiversity_hotspot) - Bleu
8. **Indonésie - Kalimantan (Patchouli)** (sustainable_alternatives) - Vert

## Espèces enrichies avec GPS

1. Boswellia sacra → 17.0742, 54.0951 (Oman)
2. Boswellia carterii → 10.4478, 51.0889 (Somalie)
3. Santalum album → 12.9716, 77.5946 (Inde)
4. Aquilaria malaccensis → 3.139, 101.6869 (Malaisie)
5. Bursera graveolens → -2.1894, -79.8866 (Équateur)
6. Cananga odorata → -12.1696, 44.253 (Comores)
7. Rosa damascena → 42.6977, 23.3219 (Bulgarie)
8. Jasminum grandiflorum → 30.0444, 31.2357 (Égypte)
9. Pogostemon cablin → -0.7893, 113.9213 (Indonésie)
10. Commiphora myrrha → 15.5527, 48.5164 (Yémen)
