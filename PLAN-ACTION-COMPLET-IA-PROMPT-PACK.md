# PLAN D'ACTION COMPLET — IA PROMPT PACK PERFUMUM

**Date** : 25 décembre 2025  
**Auteur** : Manus AI  
**Objectif** : Proposer un plan d'implémentation structuré des 12 prompts d'amélioration UX/produit pour PERFUMUM  
**Méthodologie** : Audit UX + Propositions concrètes + Roadmap 3 itérations + Checklist QA

---

## 📋 TABLE DES MATIÈRES

1. [Vue d'ensemble](#vue-densemble)
2. [Audit UX rapide (Prompt 02)](#audit-ux-rapide)
3. [Microcopy & Contexte (Prompt 03)](#microcopy--contexte)
4. [Système de filtres /recettes (Prompt 04)](#système-de-filtres-recettes)
5. [Composant RecetteCard (Prompt 05)](#composant-recettecard)
6. [Page Comparaison MVP (Prompt 06)](#page-comparaison-mvp)
7. [Système d'export (Prompt 07)](#système-dexport)
8. [Favoris & Collections (Prompt 08)](#favoris--collections)
9. [Diagnostic Cache & HMR (Prompt 09)](#diagnostic-cache--hmr)
10. [SEO & Partage (Prompt 10)](#seo--partage)
11. [Roadmap 3 itérations (Prompt 11)](#roadmap-3-itérations)
12. [Checklist QA (Prompt 12)](#checklist-qa)
13. [Synthèse & Prochaines étapes](#synthèse--prochaines-étapes)

---

## 🎯 VUE D'ENSEMBLE

### **Contexte**

PERFUMUM est une plateforme de recherche olfactive expérimentale développée sur 10 ans (2025-2035). Le site centralise 288 molécules documentées, 234 recettes olfactives, et des méthodologies scientifiques (GC-MS, synergies moléculaires). Les accords créés sont utilisés dans des projets artistiques site-specific.

### **Problématique**

Le site présente une **structure solide** mais souffre de **frictions UX** qui ralentissent la compréhension immédiate et l'accès aux fonctionnalités clés. L'objectif est d'améliorer l'expérience utilisateur par **itérations courtes** sans refonte complète.

### **Approche**

Ce plan d'action couvre **12 prompts** d'amélioration UX/produit :
- **Prompt 02** : Audit UX rapide (10 points d'amélioration)
- **Prompt 03** : Microcopy & textes de contexte (6 variantes + tagline)
- **Prompt 04** : Système de filtres /recettes (comportement, UI, edge cases)
- **Prompt 05** : Composant RecetteCard amélioré (hiérarchie, actions, états)
- **Prompt 06** : Page Comparaison MVP (tableau + radar + URL partageable)
- **Prompt 07** : Système d'export (Markdown, JSON, PDF)
- **Prompt 08** : Favoris & Collections (localStorage MVP)
- **Prompt 09** : Diagnostic Cache & HMR Vite (checklist reproductible)
- **Prompt 10** : SEO & Partage (OpenGraph, Twitter Cards, image preview)
- **Prompt 11** : Roadmap 3 itérations (quick wins, comparaison, exports)
- **Prompt 12** : Checklist QA avant partage (12 points de validation)

### **Durée totale estimée**

- **Itération 1** : 1-2 jours (quick wins)
- **Itération 2** : 3-5 jours (comparaison & filtres)
- **Itération 3** : 2-3 jours (exports & favoris)

**Total** : 6-10 jours de développement

---

## 🔍 AUDIT UX RAPIDE (PROMPT 02)

### **Score global** : 7/10 (bon, avec potentiel d'amélioration rapide)

### **10 points d'amélioration classés par impact**

#### **🔴 IMPACT HAUT (Priorité 1)**

##### **1. Absence de texte de contexte explicite sur la home**

Le visiteur doit déduire ce qu'est PERFUMUM à partir de fragments dispersés. Aucun texte de 2-3 lignes n'explique clairement ce qu'on peut faire sur le site.

**Solution** : Ajouter un bloc de texte juste après le titre principal (voir Prompt 03).

---

##### **2. Navigation principale peu explicite**

Les 3 menus principaux ("Recherche", "Méthodologie", "Communauté") sont trop génériques. L'utilisateur doit deviner où trouver les molécules, les recettes, ou les outils.

**Solution** : Renommer les menus pour être descriptifs :
- "Recherche" → "Données" (ou "Base de données")
- "Méthodologie" → "Méthodologie & Outils"
- "Communauté" → "À propos"

---

##### **3. Hiérarchie visuelle faible entre les 3 parcours**

Les 3 cartes de parcours (Chercheur, Créateur, Curieux) sont identiques visuellement. L'utilisateur ne sait pas par où commencer.

**Solution** : Ajouter des icônes distinctives, des couleurs d'accentuation, et agrandir légèrement le parcours "Chercheur".

---

#### **🟡 IMPACT MOYEN (Priorité 2)**

##### **4. Page /recettes : absence de tri visible**

Les recettes ne peuvent pas être triées par l'utilisateur (date, intensité, popularité).

**Solution** : Ajouter un dropdown "Trier par" avec 5 critères.

---

##### **5. Absence d'actions claires sur les cartes molécules/recettes**

Les cartes sont passives. Aucune action visible (Comparer, Exporter, Favoris).

**Solution** : Ajouter 3 boutons avec tooltips au hover.

---

##### **6. Boutons CTA peu différenciés**

Les 2 boutons principaux ("Consulter les gammes" vs "Accéder au Dashboard") ont le même poids visuel.

**Solution** : Différencier les styles (primaire vs secondaire).

---

#### **🟢 IMPACT BAS (Priorité 3)**

##### **7. Section "Actualités de la recherche" trop longue**

Les 3 actualités affichées sur la home sont trop détaillées.

**Solution** : Réduire à 1 seule actualité + lien "Voir toutes les actualités".

---

##### **8. Absence de breadcrumbs (fil d'Ariane)**

L'utilisateur ne sait pas où il se trouve dans l'arborescence.

**Solution** : Ajouter un fil d'Ariane en haut de chaque page.

---

##### **9. Absence d'indicateur de progression (loading states)**

Aucun indicateur de chargement visible.

**Solution** : Ajouter des skeleton loaders.

---

##### **10. Footer trop dense (12 liens)**

Le footer contient 12 liens répartis en 3 colonnes.

**Solution** : Réduire à 6 liens essentiels.

---

### **Ordre de mise en œuvre**

- **Itération 1** : Points 1, 2, 3, 6 (quick wins)
- **Itération 2** : Points 4, 5 (comparaison & filtres)
- **Itération 3** : Points 7, 8, 9, 10 (polish)

**Détails complets** : Voir `audit-ux-perfumum.md`

---

## 📝 MICROCOPY & CONTEXTE (PROMPT 03)

### **Tagline recommandée**

> **"Laboratoire de recherche olfactive expérimentale — 10 ans d'exploration moléculaire et artistique"**

**Placement** : Sous le logo PERFUMUM dans le header (petit texte gris).

---

### **Texte de contexte recommandé (3 lignes)**

> PERFUMUM est une plateforme de recherche olfactive expérimentale développée sur 10 ans (2025-2035). Explorez 288 molécules documentées, 234 recettes olfactives et des méthodologies scientifiques (GC-MS, synergies moléculaires). Les accords créés sont utilisés dans des projets artistiques site-specific et archivés selon la méthodologie ABSORBE.

**Placement** : Juste après le titre principal "PERFUMUM" sur la page d'accueil (avant les 3 parcours).

---

### **Pourquoi ce choix**

- Ton **laboratoire** (sérieux, non marketing)
- Mentionne les **données quantifiées** (288 molécules, 234 recettes)
- Explique **ce qu'on peut faire** (explorer, consulter, utiliser)
- Mentionne le **lien avec l'art** (projets site-specific)
- Positionne **ABSORBE** comme méthodologie (hiérarchie claire)

**Détails complets** : Voir `microcopy-propositions.md` (6 variantes + 4 taglines)

---

## 🔍 SYSTÈME DE FILTRES /RECETTES (PROMPT 04)

### **État actuel (observations)**

✅ **Points positifs** :
- Barre de recherche visible ("Rechercher une recette par nom...")
- Filtres par gamme (5 tags : Pétrichor, Volcanique, Traditions, Glaciaire, Bio-Lab)
- Filtres par type (4 boutons : parfum, resine, resine_cbd, tabac)
- Filtres par prototype (4 boutons : C1, C2, C3, C4)
- Filtres avancés (2 boutons : Ingrédients, Profil Radar)
- Compteur de résultats dynamique ("226 recettes trouvées")

⚠️ **Points à améliorer** :
- Absence de tri visible (date, intensité, popularité)
- Filtres "Ingrédients" et "Profil Radar" peu explicites (pas de tooltip)
- Absence de bouton "Réinitialiser les filtres"
- Barre de recherche limitée au nom (pas d'ingrédient ou molécule)

---

### **Comportement exact recommandé**

#### **1. Barre de recherche**
- **Input** : Texte libre
- **Placeholder** : "Rechercher par nom, ingrédient ou molécule..."
- **Comportement** : Filtrage en temps réel (debounce 300ms)
- **Scope** : Nom de la recette + ingrédients + molécules présentes

#### **2. Filtres par gamme**
- **Type** : Tags cliquables (multi-sélection)
- **Comportement** : Filtrage cumulatif (ET logique)
- **Exemple** : Sélectionner "Pétrichor" + "Volcanique" → affiche les recettes des 2 gammes

#### **3. Filtres par type**
- **Type** : Boutons radio (sélection unique)
- **Comportement** : Filtrage exclusif (OU logique)
- **Exemple** : Sélectionner "parfum" → affiche uniquement les parfums

#### **4. Tri**
- **Type** : Dropdown "Trier par"
- **Options** : Plus récentes, Plus anciennes, Intensité croissante, Intensité décroissante, Nombre de molécules
- **Comportement** : Tri immédiat après sélection

#### **5. Réinitialisation**
- **Type** : Bouton "Effacer tous les filtres" (icône X)
- **Comportement** : Réinitialise tous les filtres + recherche + tri

---

### **UI minimale**

```
┌────────────────────────────────────────────────┐
│  [Rechercher par nom, ingrédient ou molécule]  │ ← Barre de recherche
│                                                │
│  Gammes : [Pétrichor] [Volcanique] [...]       │ ← Tags multi-sélection
│  Type : ( ) parfum ( ) resine ( ) tabac        │ ← Radio buttons
│  Trier par : [Plus récentes ▼]  [Effacer X]   │ ← Dropdown + Reset
│                                                │
│  226 recettes trouvées                         │ ← Compteur dynamique
└────────────────────────────────────────────────┘
```

---

### **Edge cases**

1. **Aucun résultat** : Afficher "Aucune recette ne correspond à vos critères. Essayez de réinitialiser les filtres."
2. **Recherche vide** : Afficher toutes les recettes (pas de filtrage)
3. **Filtres multiples** : Appliquer tous les filtres en cascade (recherche → gammes → type → tri)
4. **URL persistance** : Sauvegarder les filtres dans l'URL (ex : `/recettes?gamme=petrichor&type=parfum&sort=recent`)

---

### **Plan d'implémentation (2 étapes)**

#### **Étape 1 : Améliorer les filtres existants (1h)**
- Ajouter dropdown "Trier par"
- Ajouter bouton "Réinitialiser les filtres"
- Améliorer le placeholder de recherche
- Ajouter tooltips sur "Ingrédients" et "Profil Radar"

#### **Étape 2 : Persistance URL (30 min)**
- Sauvegarder les filtres dans l'URL
- Restaurer les filtres au chargement de la page

**Détails complets** : Voir `observations-recettes.md`

---

## 🎴 COMPOSANT RECETTECARD (PROMPT 05)

### **5 informations max visibles**

1. **Nom de la recette** (titre principal, bold, 18px)
2. **Badges** (gamme + type, ex : "Pétrichor • Parfum")
3. **Intensité** (barre de progression 0-10)
4. **Nombre de molécules** (icône + nombre, ex : "3 molécules")
5. **Profil radar** (mini hexagone 6 axes, 60×60 px)

---

### **Hiérarchie typographique**

```
┌────────────────────────────────────┐
│  OS PLUVIEUX                       │ ← Titre (18px, bold)
│  [Pétrichor] [Parfum]              │ ← Badges (12px, bg coloré)
│                                    │
│  Intensité ████████░░ 5/10         │ ← Barre (14px)
│  🧪 3 molécules                    │ ← Icône + texte (12px)
│                                    │
│  [Mini radar hexagonal]            │ ← Visuel (60×60 px)
│                                    │
│  [Comparer] [Export] [Favoris]    │ ← Actions (icônes 20px)
└────────────────────────────────────┘
```

---

### **3 actions : Comparer / Export / Favoris**

| Action | Icône | Comportement | Tooltip |
|--------|-------|--------------|---------|
| **Comparer** | Balance ⚖️ | Ajoute la recette à la liste de comparaison | "Ajouter à la comparaison" |
| **Export** | Téléchargement 📥 | Ouvre un menu (Markdown, JSON, PDF) | "Exporter en Markdown/JSON" |
| **Favoris** | Étoile ⭐ | Ajoute/retire des favoris (localStorage) | "Ajouter aux favoris" |

---

### **États (hover, selected, disabled)**

#### **Hover**
- Ombre portée légère (`box-shadow: 0 4px 12px rgba(0,0,0,0.1)`)
- Transformation (`transform: translateY(-2px)`)
- Transition fluide (`transition: all 0.2s ease`)

#### **Selected (comparaison)**
- Bordure colorée (`border: 2px solid #8B5CF6`)
- Badge "Sélectionné" en haut à droite
- Icône "Comparer" en état actif (remplie)

#### **Disabled**
- Opacité réduite (`opacity: 0.5`)
- Curseur interdit (`cursor: not-allowed`)
- Actions désactivées (grisées)

---

### **Accessibilité minimale**

- [ ] Tous les boutons sont accessibles au clavier (Tab + Enter)
- [ ] Les états focus sont visibles (`outline: 2px solid #8B5CF6`)
- [ ] Les icônes ont des attributs `aria-label` descriptifs
- [ ] Le contraste de couleurs respecte WCAG AA (4.5:1 minimum)
- [ ] Le mini radar a un attribut `alt` descriptif

---

## 🔄 PAGE COMPARAISON MVP (PROMPT 06)

### **Spécifications**

- **Nombre de recettes** : 2 à 4 (sélection via checkboxes sur /recettes)
- **Tableau comparatif** : Colonnes = recettes, Lignes = propriétés
- **Radar** : Profils superposés (Chart.js, 6 axes)
- **URL partageable** : `/compare-recettes?ids=1,2,3`

---

### **UX Flow**

1. L'utilisateur sélectionne 2-4 recettes sur `/recettes` (checkboxes)
2. Un bouton "Comparer (3)" apparaît en bas de page
3. Clic sur "Comparer" → redirection vers `/compare-recettes?ids=1,2,3`
4. La page affiche le tableau + radars superposés
5. L'utilisateur peut partager l'URL ou exporter le comparatif (PDF)

---

### **Données comparées**

| Propriété | Description |
|-----------|-------------|
| **Nom** | Nom de la recette |
| **Gamme** | Pétrichor, Volcanique, Traditions, etc. |
| **Type** | Parfum, Résine, Tabac |
| **Intensité** | 0-10 |
| **Nombre de molécules** | 3, 5, 8, etc. |
| **Profil radar** | 6 axes (Intensité, Fraîcheur, Chaleur, Douceur, Épicé, Terreux) |
| **Ingrédients** | Liste des molécules présentes |

---

### **Structure de page**

```
┌────────────────────────────────────────────────┐
│  COMPARAISON DE 3 RECETTES                     │
│                                                │
│  [Tableau comparatif]                          │ ← Propriétés en lignes
│  ┌────────┬────────┬────────┬────────┐        │
│  │        │ OS     │ FOSSE  │ ARCHÉO │        │
│  │        │ PLUVIEUX│ ANTIQUE│ BRÛLÉE │        │
│  ├────────┼────────┼────────┼────────┤        │
│  │ Gamme  │ Pétri. │ Pétri. │ Volca. │        │
│  │ Type   │ Parfum │ Parfum │ Résine │        │
│  │ Intens.│ 5/10   │ 7/10   │ 9/10   │        │
│  └────────┴────────┴────────┴────────┘        │
│                                                │
│  [Radars superposés]                           │ ← Chart.js
│                                                │
│  [Partager l'URL] [Exporter PDF]              │ ← Actions
└────────────────────────────────────────────────┘
```

---

### **Priorités techniques**

1. **Tableau comparatif** (priorité 1) : HTML/CSS simple, responsive
2. **URL partageable** (priorité 1) : Query params `?ids=1,2,3`
3. **Radars superposés** (priorité 2) : Chart.js avec 3 datasets
4. **Export PDF** (priorité 3) : jsPDF ou html2canvas

---

## 📦 SYSTÈME D'EXPORT (PROMPT 07)

### **Priorités**

1. **Markdown** (Notion-ready) — Priorité 1
2. **JSON** structuré — Priorité 2
3. **PDF** — V2 seulement (priorité 3)

---

### **Structure Markdown**

```markdown
# OS PLUVIEUX

**Gamme** : Pétrichor  
**Type** : Parfum  
**Prototype** : C1  
**Intensité** : 5/10

## Composition
- Géosmine (30%)
- Pétrichor (50%)
- Argile (20%)

## Profil Radar
- Intensité : 70
- Fraîcheur : 40
- Chaleur : 60
- Douceur : 30
- Épicé : 20
- Terreux : 90

## Notes
Odeur de terre après la pluie. Accord minéral et humide.
```

---

### **Schéma JSON**

```json
{
  "name": "OS PLUVIEUX",
  "family": "Pétrichor",
  "type": "parfum",
  "prototype": "C1",
  "intensity": 5,
  "molecules": [
    { "name": "Géosmine", "percentage": 30 },
    { "name": "Pétrichor", "percentage": 50 },
    { "name": "Argile", "percentage": 20 }
  ],
  "radar": {
    "intensity": 70,
    "freshness": 40,
    "warmth": 60,
    "sweetness": 30,
    "spicy": 20,
    "earthy": 90
  },
  "notes": "Odeur de terre après la pluie. Accord minéral et humide."
}
```

---

### **Règles de nommage**

- **Markdown** : `nom-recette-recette.md` (ex : `os-pluvieux-recette.md`)
- **JSON** : `nom-recette-recette.json` (ex : `os-pluvieux-recette.json`)
- **PDF** : `nom-recette-recette.pdf` (ex : `os-pluvieux-recette.pdf`)

**Convention** : Slug en minuscules, tirets, sans accents.

---

### **Sécurité / Cohérence**

- Valider que toutes les données sont présentes avant export
- Échapper les caractères spéciaux (Markdown : `*`, `#`, `[`, `]`)
- Vérifier que le JSON est parsable (`JSON.parse()`)
- Limiter la taille des exports (< 1 MB)

---

## ⭐ FAVORIS & COLLECTIONS (PROMPT 08)

### **MVP : localStorage**

#### **Données stockées**

```json
{
  "molecules": [1, 5, 12, 34],
  "recettes": [2, 8, 15, 23, 45]
}
```

**Clé** : `perfumum_favorites`  
**Format** : JSON stringifié

---

#### **UX**

1. L'utilisateur clique sur l'icône "Favoris" (étoile) sur une carte
2. L'icône devient remplie (état actif)
3. Les favoris sont sauvegardés dans `localStorage`
4. L'utilisateur peut accéder à `/favoris` pour voir la liste complète
5. Un bouton "Vider les favoris" permet de tout supprimer

---

#### **UI minimale**

```
┌────────────────────────────────────────────────┐
│  MES FAVORIS                                   │
│                                                │
│  Molécules (4)                                 │
│  [Carte molécule 1] [Carte molécule 2] ...    │
│                                                │
│  Recettes (5)                                  │
│  [Carte recette 1] [Carte recette 2] ...      │
│                                                │
│  [Vider les favoris]                           │
└────────────────────────────────────────────────┘
```

---

### **V2 : Tags et Collections**

#### **Données stockées**

```json
{
  "collections": [
    {
      "id": 1,
      "name": "Pétrichor préférés",
      "molecules": [1, 5, 12],
      "recettes": [2, 8]
    },
    {
      "id": 2,
      "name": "Recherche volcanique",
      "molecules": [34, 56],
      "recettes": [15, 23, 45]
    }
  ]
}
```

---

#### **UX**

1. L'utilisateur crée une collection (nom + description)
2. L'utilisateur ajoute des molécules/recettes à la collection
3. Les collections sont affichées sur `/collections`
4. Chaque collection a une page dédiée (`/collections/1`)

---

### **Migration future**

Pour passer de localStorage à une base de données :
1. Créer une table `favorites` (userId, itemType, itemId)
2. Créer une table `collections` (id, userId, name, description)
3. Créer une table `collection_items` (collectionId, itemType, itemId)
4. Migrer les données localStorage vers la DB au premier login

---

## 🛠️ DIAGNOSTIC CACHE & HMR (PROMPT 09)

### **Checklist diagnostic HMR**

#### **1. Vérifier le cache navigateur**
- [ ] Ouvrir DevTools → Network → Désactiver "Disable cache"
- [ ] Faire un hard refresh (Ctrl+Shift+R ou Cmd+Shift+R)
- [ ] Vider le cache navigateur (Settings → Clear browsing data)

#### **2. Vérifier le cache Vite**
- [ ] Supprimer le dossier `node_modules/.vite`
- [ ] Redémarrer le serveur de développement (`pnpm dev`)

#### **3. Vérifier les erreurs TypeScript**
- [ ] Exécuter `pnpm tsc --noEmit` pour vérifier les erreurs
- [ ] Corriger toutes les erreurs TypeScript avant de tester

#### **4. Vérifier les imports circulaires**
- [ ] Utiliser `madge` pour détecter les imports circulaires
- [ ] Commande : `npx madge --circular --extensions ts,tsx client/src`

#### **5. Vérifier les hooks React**
- [ ] S'assurer qu'aucun hook n'est appelé conditionnellement
- [ ] S'assurer que le nombre de hooks est constant entre les renders

#### **6. Tester en mode production**
- [ ] Exécuter `pnpm build` pour créer un build de production
- [ ] Exécuter `pnpm preview` pour tester le build
- [ ] Vérifier que le bug n'apparaît pas en production

---

### **Différencier build vs dev**

| Aspect | Dev (`pnpm dev`) | Production (`pnpm build`) |
|--------|------------------|---------------------------|
| **HMR** | Activé | Désactivé |
| **Source maps** | Complets | Minifiés |
| **Optimisations** | Aucune | Tree-shaking, minification |
| **Erreurs** | Affichées dans le navigateur | Loggées dans la console |

---

### **Validation en production**

1. Créer un build de production (`pnpm build`)
2. Tester le build localement (`pnpm preview`)
3. Déployer sur un environnement de staging
4. Tester sur plusieurs navigateurs (Chrome, Firefox, Safari)
5. Tester sur mobile (iOS, Android)

---

## 🌐 SEO & PARTAGE (PROMPT 10)

### **Balises `<title>` recommandées**

| Page | Titre | Caractères |
|------|-------|------------|
| **Home** | PERFUMUM — Recherche Olfactive Expérimentale (2025-2035) | 57 |
| **/molecules** | 288 Molécules Documentées — PERFUMUM | 38 |
| **/recettes** | 234 Recettes Olfactives — PERFUMUM | 35 |
| **/gammes** | 5 Gammes Olfactives — Pétrichor, Volcanique, Bio-Lab | 54 |

---

### **Meta descriptions recommandées**

#### **Home**
```html
<meta name="description" content="Plateforme de recherche olfactive expérimentale. Explorez 288 molécules, 234 recettes et des méthodologies scientifiques (GC-MS, synergies). Projet ABSORBE 2025-2035." />
```

---

### **OpenGraph & Twitter Cards**

#### **Balises communes**
```html
<meta property="og:site_name" content="PERFUMUM — Recherche Olfactive" />
<meta property="og:locale" content="fr_FR" />
<meta property="og:type" content="website" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@perfumum" />
```

---

#### **Balises spécifiques (Home)**
```html
<meta property="og:title" content="PERFUMUM — Recherche Olfactive Expérimentale (2025-2035)" />
<meta property="og:description" content="Plateforme de recherche olfactive : 288 molécules, 234 recettes, méthodologies GC-MS. Projet ABSORBE basé à Berne." />
<meta property="og:url" content="https://perfumum.manus.space/" />
<meta property="og:image" content="https://perfumum.manus.space/og-home.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

---

### **Image preview (1200×630 px)**

**Spécifications** :
- Dimensions : 1200×630 px (ratio 1.91:1)
- Format : JPG ou PNG
- Poids : < 1 MB
- Contenu : Logo PERFUMUM + tagline + visuel représentatif

**Détails complets** : Voir `seo-partage-propositions.md`

---

## 🗓️ ROADMAP 3 ITÉRATIONS (PROMPT 11)

### **Itération 1 : Quick Wins (1-2 jours)**

**Objectif** : Améliorer la compréhension immédiate du site.

**Tâches** :
1. Ajouter texte de contexte sur la home (30 min)
2. Ajouter tagline sous le logo (15 min)
3. Améliorer la hiérarchie visuelle des 3 parcours (1h)
4. Différencier les boutons CTA (15 min)
5. Simplifier le footer (30 min)

**Critères "done"** :
- Un visiteur comprend PERFUMUM en 10 secondes
- Les 3 parcours sont visuellement différenciés
- Le CTA principal est clairement identifié

---

### **Itération 2 : Comparaison & Filtres (3-5 jours)**

**Objectif** : Améliorer l'engagement utilisateur.

**Tâches** :
1. Ajouter dropdown "Trier par" sur /recettes (1h)
2. Ajouter bouton "Réinitialiser les filtres" (30 min)
3. Améliorer le placeholder de recherche (5 min)
4. Ajouter tooltips sur filtres avancés (30 min)
5. Créer page /compare-recettes MVP (3h)
6. Améliorer les labels des actions (30 min)

**Critères "done"** :
- Un utilisateur peut trier les 234 recettes par 5 critères
- Un utilisateur peut comparer 2-4 recettes
- Les tooltips expliquent toutes les actions

---

### **Itération 3 : Exports & Favoris (2-3 jours)**

**Objectif** : Améliorer la rétention utilisateur.

**Tâches** :
1. Implémenter système de favoris (localStorage) (2h)
2. Créer export Markdown (1h)
3. Créer export JSON (30 min)
4. Ajouter breadcrumbs (1h)
5. Ajouter skeleton loaders (1h)
6. Réduire la section actualités (30 min)

**Critères "done"** :
- Un utilisateur peut sauvegarder des favoris
- Un utilisateur peut exporter en Markdown/JSON
- Le site est professionnel et prêt à être partagé

**Détails complets** : Voir `roadmap-3-iterations.md`

---

## ✅ CHECKLIST QA (PROMPT 12)

### **12 points de validation**

1. **Compréhension immédiate** (10 secondes)
2. **Navigation fonctionnelle** (toutes pages)
3. **Page /recettes fonctionnelle** (filtres, recherche, actions)
4. **Page /molecules fonctionnelle** (filtres radar, recherche avancée)
5. **Contenu sans erreurs** (typos, données manquantes)
6. **Design cohérent** (desktop + mobile)
7. **Performance acceptable** (< 3 secondes)
8. **Accessibilité minimale** (WCAG AA)
9. **Exports fonctionnels** (Markdown, JSON, PDF)
10. **Comparaison fonctionnelle** (si implémentée)
11. **Favoris fonctionnels** (si implémentés)
12. **SEO & Partage** (OpenGraph, Twitter Cards)

**Durée estimée** : 30-45 minutes

**Détails complets** : Voir `checklist-qa-partage.md`

---

## 🎯 SYNTHÈSE & PROCHAINES ÉTAPES

### **Résumé**

Ce plan d'action couvre **12 prompts** d'amélioration UX/produit pour PERFUMUM, structurés en **3 itérations courtes** (6-10 jours). L'approche est **incrémentale** et **testable** sans refonte complète.

### **Documents livrés**

1. **`audit-ux-perfumum.md`** — Audit UX rapide (10 points d'amélioration)
2. **`observations-recettes.md`** — Observations page /recettes
3. **`microcopy-propositions.md`** — 6 variantes de texte de contexte + 4 taglines
4. **`seo-partage-propositions.md`** — Balises SEO, OpenGraph, Twitter Cards
5. **`roadmap-3-iterations.md`** — Roadmap détaillée (17 tâches, 3 itérations)
6. **`checklist-qa-partage.md`** — Checklist QA (12 points de validation)
7. **`PLAN-ACTION-COMPLET-IA-PROMPT-PACK.md`** — Synthèse complète (ce document)

### **Prochaines étapes recommandées**

1. **Valider ce plan d'action** avec vous
2. **Prioriser les itérations** (1, 2, ou 3)
3. **Commencer l'Itération 1** (quick wins, 1-2 jours)
4. **Tester et valider** avant de passer à l'Itération 2
5. **Exécuter la checklist QA** avant partage externe
6. **Créer un checkpoint final** une fois toutes les itérations complétées

### **Contact**

Pour toute question ou clarification, n'hésitez pas à me solliciter. Je suis disponible pour implémenter ces améliorations de manière progressive et sécurisée. 🚀

---

**Fin du document**
