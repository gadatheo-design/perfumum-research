# Guide d'Utilisation PERFUMUM

Guide complet pour naviguer et utiliser la plateforme de recherche olfactive PERFUMUM.

---

## Table des Matières

1. [Accès au Site](#accès-au-site)
2. [Navigation Principale](#navigation-principale)
3. [Recherche & Filtres](#recherche--filtres)
4. [Pages de Données](#pages-de-données)
5. [Outils de Formulation](#outils-de-formulation)
6. [Visualisations Scientifiques](#visualisations-scientifiques)
7. [Système de Favoris](#système-de-favoris)
8. [Export de Données](#export-de-données)
9. [Mode Mobile](#mode-mobile)
10. [Raccourcis Clavier](#raccourcis-clavier)

---

## Accès au Site

### URL de Production
Le site PERFUMUM est accessible via la plateforme Manus à l'adresse fournie après publication.

### Authentification
L'authentification est gérée automatiquement via OAuth Manus. Aucune création de compte n'est nécessaire pour consulter les données publiques. Les fonctionnalités avancées (favoris, notes personnelles) nécessitent une connexion.

### Mode Hors Ligne
Le site est installable en tant qu'application PWA (Progressive Web App) sur mobile et desktop. Une fois installé, certaines pages restent accessibles hors ligne grâce au service worker.

---

## Navigation Principale

### Menu Desktop

Le menu principal en haut de page propose quatre sections :

**Études** : Accès aux données de recherche
- Molécules (138 entrées)
- Recettes (162 formulations)
- Traditions Olfactives (26 cultures)
- Installations (7 œuvres)

**Résines CBD** : Programme de recherche dédié
- Collections Classique & Expérimentale (10 recettes)
- Profils terpéniques détaillés
- Graphe molécules-recettes interactif

**Pétrichor** : Gamme olfactive terre/minéral
- 3 axes atmosphériques (Souterrain, Urbain, Fantôme)
- Méthodologie ABSORBE
- Projets et terrains d'étude

**Admin** : Outils d'administration (accès restreint)
- Ajout de molécules
- Import/Export CSV
- Gestion base de données

### Navigation Mobile

Sur mobile, un menu burger (☰) en haut à gauche donne accès à toutes les sections. Une barre de navigation fixe en bas d'écran permet un accès rapide aux 5 pages principales : Accueil, Études, Recherche, Favoris, Admin.

### Breadcrumbs

Chaque page affiche un fil d'Ariane (breadcrumbs) en haut permettant de remonter dans la hiérarchie. Exemple : `Accueil > Molécules > Myrcène`

---

## Recherche & Filtres

### Recherche Globale (⌘K / Ctrl+K)

Appuyez sur `⌘K` (Mac) ou `Ctrl+K` (Windows/Linux) pour ouvrir la recherche globale. Cette interface permet de chercher instantanément dans :
- Molécules (nom, formule chimique, profil olfactif)
- Recettes (nom, description, catégorie)
- Pages du site

Les résultats sont groupés par type avec compteurs. L'historique des 5 dernières recherches est conservé.

### Filtres Avancés

#### Page Molécules
- **Recherche textuelle** : Nom ou formule chimique
- **Famille chimique** : Dropdown avec 28 familles
- **Profil olfactif** : Autocomplete avec 203 profils catégorisés
- **Concentration** : Slider 0.0001%-0.1%
- **Gamme Perfumum** : Badges cliquables (Pétrichor, Volcanique, etc.)

#### Page Recettes
- **Recherche textuelle** : Nom ou description
- **Catégorie** : Tabac, Résine, Cône, Parfum, Encens, Extrait
- **Prototype** : C1, C2, C3, C4
- **Statut** : Expérimental, Testing, Validé, Production

#### Chips Filtres Actifs
Les filtres actifs s'affichent sous forme de chips supprimables individuellement. Un bouton "Réinitialiser" permet de tout effacer d'un coup.

---

## Pages de Données

### Molécules (/molecules)

Affiche les 138 molécules aromatiques sous forme de cartes. Chaque carte contient :
- Nom et formule chimique
- Famille chimique (badge)
- Gamme Perfumum (badge coloré)
- Profil olfactif (extrait)
- Bouton favori (étoile)

Cliquer sur une carte ouvre la page détail avec :
- Profil olfactif complet
- Propriétés scientifiques (poids moléculaire, point d'ébullition, LogP)
- Profil radar 6 axes (intensité, fraîcheur, chaleur, douceur, piquant, terreux)
- Sources botaniques et méthode d'extraction
- Propriétés thérapeutiques
- Liste des recettes utilisant cette molécule

### Recettes (/recettes)

Affiche les 162 recettes expérimentales. Chaque carte contient :
- Nom et catégorie
- Description (extrait)
- Intensité et stabilité (barres de progression)
- Badge gamme Perfumum

La page détail affiche :
- Description complète
- Propriétés techniques (texture, température combustion, maturation)
- Évolution aromatique (notes tête/cœur/fond)
- Ingrédients et protocole
- Composition moléculaire avec proportions

### Traditions Olfactives (/civilisations)

Documente les pratiques olfactives de 26 cultures (Égypte antique, Japon médiéval, Abysses imaginaires, etc.). Chaque fiche contient :
- Région géographique et temporalité
- Contexte culturel
- Pratiques olfactives rituelles
- Recettes associées
- Graphe de relations

### Installations (/installations)

Présente les 7 installations artistiques olfactives (Sanctum, Zone Organique, Tour Verte, etc.) avec descriptions, dispositifs de diffusion et accords utilisés.

---

## Outils de Formulation

### Calculateur de Proportions (/calculateur)

Outil interactif pour créer des formules terpéniques personnalisées.

**Fonctionnalités** :
- 7 sliders pour ajuster proportions (0-100%)
- Validation automatique total = 100%
- Calcul grammes pour batch personnalisé
- Prévisualisation profil radar résultant
- Sauvegarde formules favorites (localStorage)
- Export CSV

**Usage** :
1. Ajuster les sliders jusqu'à atteindre 100%
2. Entrer la taille du batch (grammes)
3. Consulter le profil radar prévu
4. Sauvegarder ou exporter la formule

### Analyses de Corrélations (/analyses)

Analyse statistique des co-occurrences terpéniques dans les recettes.

**Affichage** :
- Matrice 7×7 co-occurrences
- Heatmap interactive avec gradient de couleurs
- Top 5 combinaisons les plus fréquentes
- Suggestions optimales basées sur données réelles
- Export CSV

### Matrice de Synergies (/matrice-synergies)

Tableau interactif 7×7 affichant les 21 combinaisons terpéniques documentées.

**Code couleur** :
- 🟢 Vert : Excellente synergie (71-100)
- 🟡 Jaune : Synergie neutre (31-70)
- 🔴 Rouge : Synergie faible (0-30)

Cliquer sur une cellule ouvre un modal avec score détaillé, notes de recherche et recommandations contextuelles.

**Filtres** :
- Toutes les synergies
- Excellentes uniquement
- Neutres uniquement
- Faibles uniquement

---

## Visualisations Scientifiques

### Graphe Molécules-Recettes (/graphe-molecules-recettes)

Visualisation interactive D3.js des relations entre recettes CBD et terpènes.

**Interactions** :
- **Drag & drop** : Déplacer les nœuds
- **Survol** : Tooltip avec détails (nom, profil, propriétés)
- **Clic simple** : Activer mode Focus (fade out nœuds non connectés)
- **Clic sur nœud focusé** : Navigation vers fiche détail
- **Double-clic** : Réinitialiser mode Focus

**Filtres** :
- Toutes les recettes
- Collection Classique
- Collection Expérimentale

**Légende** :
- Violet : Recettes CBD
- Vert : Terpènes
- Liens : Proportions (épaisseur)

### Comparateur Radar (/compare-radar)

Superposition de profils olfactifs radar pour comparer 2-4 terpènes simultanément.

**Usage** :
1. Sélectionner 2-4 terpènes (checkboxes)
2. Consulter le diagramme radar superposé
3. Analyser le tableau comparatif 6 propriétés
4. Identifier valeurs maximales (surlignées en gras)

**Export** : Bouton "Exporter PNG" pour sauvegarder la visualisation.

### Courbes de Volatilité (/recherche-scientifique/courbes-volatilite)

Graphiques interactifs Recharts montrant l'évolution de 5 familles de composés (terpènes, aldéhydes, lactones, pyrazines, phénols) en fonction de la température (80-180°C) pour les 8 variétés de tabacs.

**Sélecteur** : Dropdown pour choisir la variété de tabac  
**Zones critiques** : 3 zones (basse/moyenne/haute température)  
**Méthodologie** : TGA-FTIR (analyse thermogravimétrique)

---

## Système de Favoris

### Ajouter aux Favoris

Sur chaque page molécule ou dans la liste, cliquer sur l'icône étoile (☆) pour ajouter aux favoris. L'étoile devient pleine (★) pour indiquer l'ajout.

### Page Favoris (/favoris)

Affiche toutes les molécules favorites avec :
- **Filtres** : Famille chimique, Gamme Perfumum
- **Tri** : Plus récents, Nom A-Z/Z-A, Famille
- **Date d'ajout** : Affichée pour chaque favorite
- **Bouton retrait** : Étoile cliquable pour retirer

### Mode Comparaison

Depuis la page Favoris ou Molécules, sélectionner 2-4 molécules (checkboxes) pour activer la barre flottante de comparaison. Cliquer sur "Comparer" ouvre la page `/compare` avec :
- Tableau côte-à-côte 9 critères
- Highlighting automatique (fond vert si valeurs identiques)
- Graphiques comparatifs (Bar Chart concentrations, Pie Chart familles, Radar profils)
- Export PDF avec graphiques haute qualité

---

## Export de Données

### Export PDF

Disponible sur :
- **Pages détail** (molécules, recettes) : Bouton "Exporter PDF" génère fiche complète avec QR code
- **Page Favoris** : Dropdown "Exporter > PDF" génère document formaté professionnel
- **Page Comparaison** : Bouton "Exporter PDF" inclut graphiques haute résolution

**Contenu PDF** :
- En-tête PERFUMUM avec logo
- Métadonnées (date export, nombre entrées)
- Données structurées par sections
- QR code vers page web (pages détail uniquement)
- Citations académiques (3 formats : APA, MLA, Chicago)
- Footer avec pagination

### Export CSV

Disponible sur :
- **Page Favoris** : Dropdown "Exporter > CSV" génère tableau Excel-compatible
- **Calculateur** : Bouton "Exporter CSV" sauvegarde formule
- **Analyses** : Bouton "Export CSV" exporte matrice co-occurrences

**Format CSV** :
- Encodage UTF-8 avec BOM (compatibilité Excel)
- 9 colonnes pour molécules (Nom, Famille, Formule, Profil, Résonance, Effet, Origine, Concentration, Date)
- Échappement automatique (virgules, guillemets, retours ligne)

### Citations Académiques

Sur chaque page détail molécule, cliquer sur "Citer" pour copier la citation dans 4 formats :
- **APA** : Bastos, J.-A. (2025). *Myrcène*. PERFUMUM. https://...
- **MLA** : Bastos, Jean-Alphonse. "Myrcène." *PERFUMUM*, 2025, https://...
- **Chicago** : Bastos, Jean-Alphonse. "Myrcène." PERFUMUM. 2025. https://...
- **BibTeX** : @misc{perfumum_myrcene_2025, author = {Bastos, Jean-Alphonse}, ...}

---

## Mode Mobile

### Installation PWA

Sur mobile (iOS Safari ou Android Chrome), une invite d'installation apparaît après 30 secondes. Accepter pour installer PERFUMUM comme application native.

**Avantages** :
- Icône sur écran d'accueil
- Lancement plein écran (sans barre navigateur)
- Accès hors ligne partiel
- Notifications push (si activées)

### Navigation Mobile

**Header** : Menu burger (☰) + recherche (🔍) + mode sombre (🌙)  
**Bottom Nav** : 5 icônes fixes (Accueil, Études, Recherche, Favoris, Admin)  
**Touch Targets** : Minimum 44×44px pour accessibilité  
**Drawer** : Menu latéral avec toutes sections organisées hiérarchiquement

### Optimisations Mobile

- **Grids responsives** : 1 colonne sur <375px, 2 colonnes sur tablette
- **Filtres masqués** : Cachés par défaut sur mobile, bouton "Afficher filtres"
- **Tableaux scrollables** : Scroll horizontal avec indicateur visuel
- **Images lazy-loading** : Chargement différé pour économiser data
- **Prévention zoom iOS** : Font-size 16px sur inputs pour éviter zoom automatique

---

## Raccourcis Clavier

### Navigation Rapide

| Raccourci | Action |
|-----------|--------|
| `G` puis `T` | Aller à Terpènes |
| `G` puis `R` | Aller à Recettes |
| `G` puis `G` | Aller à Gammes |
| `G` puis `M` | Aller à Molécules |
| `G` puis `H` | Aller à Accueil |
| `G` puis `A` | Aller à Admin |

### Recherche

| Raccourci | Action |
|-----------|--------|
| `⌘K` / `Ctrl+K` | Ouvrir recherche globale |
| `/` | Ouvrir recherche globale |
| `Échap` | Fermer recherche |
| `↑` `↓` | Naviguer dans résultats |
| `↵` | Ouvrir résultat sélectionné |

### Autres

| Raccourci | Action |
|-----------|--------|
| `?` | Afficher aide raccourcis (à venir) |
| `Échap` | Fermer modals/dialogs |

---

## Astuces & Bonnes Pratiques

### Recherche Efficace

Pour trouver rapidement une molécule, utilisez la recherche globale (`⌘K`) plutôt que de naviguer manuellement. La recherche indexe noms, formules chimiques et profils olfactifs.

### Comparaison Multi-Critères

Pour comparer des molécules selon plusieurs critères, utilisez le mode Comparaison avec graphiques plutôt que d'ouvrir plusieurs onglets. Les graphiques révèlent des patterns invisibles dans les tableaux.

### Formulation Itérative

Dans le Calculateur de Proportions, sauvegardez vos formules favorites avant d'expérimenter de nouvelles combinaisons. Vous pourrez ainsi revenir aux versions précédentes.

### Export Régulier

Exportez régulièrement vos favoris en CSV pour backup. Les données sont stockées dans le navigateur (localStorage) et peuvent être perdues en cas de nettoyage cache.

### Mode Hors Ligne

Installez l'application PWA pour accéder aux pages principales hors ligne. Les données sont mises en cache automatiquement lors de la première visite.

---

## Support & Contact

Pour toute question, suggestion ou problème technique, contactez l'équipe PERFUMUM via la page [Contact](/contact).

**Documentation technique** : Consultez le fichier `README.md` pour les détails d'architecture et de développement.

**Bugs connus** : Consultez le fichier `MAINTENANCE.md` pour les problèmes identifiés et leurs solutions.

---

**Version** : 1.0.0  
**Dernière mise à jour** : 9 janvier 2025  
**Auteur** : Manus AI pour PERFUMUM
