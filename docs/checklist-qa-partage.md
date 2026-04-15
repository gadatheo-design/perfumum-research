# CHECKLIST QA AVANT PARTAGE — PERFUMUM

**Date** : 25 décembre 2025  
**Objectif** : Vérifier que le site est prêt à être partagé avec un artiste, client ou institution.  
**Durée estimée** : 30-45 minutes

---

## 🎯 CONTEXTE

Cette checklist doit être exécutée **avant d'envoyer le lien du site** à un contact externe (artiste, client, institution, partenaire). Elle couvre les aspects critiques : **fonctionnalité, contenu, design, performance, et accessibilité**.

**Critère de validation** : 100% des points doivent être vérifiés (12/12).

---

## ✅ CHECKLIST (12 POINTS)

### **1. Compréhension immédiate (10 secondes)**
**Objectif** : Un visiteur comprend ce qu'est PERFUMUM en 10 secondes.

- [ ] Le texte de contexte (2-3 lignes) est visible sur la home
- [ ] La tagline est affichée sous le logo PERFUMUM
- [ ] Les 3 parcours (Chercheur, Créateur, Curieux) sont visuellement différenciés
- [ ] Le CTA principal ("Consulter les gammes") est clairement identifié

**Test** : Faire tester par 1 personne externe et poser la question : *"En 10 secondes, qu'est-ce que PERFUMUM ?"*

---

### **2. Navigation fonctionnelle (toutes pages)**
**Objectif** : Tous les liens et menus fonctionnent correctement.

- [ ] Le menu principal (Études, Résines CBD, Pétrichor, Admin) fonctionne
- [ ] Le MegaMenu (Recherche, Méthodologie, Communauté) fonctionne
- [ ] Les breadcrumbs (fil d'Ariane) sont corrects sur toutes les pages
- [ ] Le bouton "Retour en haut" fonctionne
- [ ] Le footer contient des liens valides (pas de 404)

**Test** : Cliquer sur 10 liens aléatoires et vérifier qu'aucun ne mène à une erreur 404.

---

### **3. Page /recettes fonctionnelle**
**Objectif** : Les filtres, la recherche et les actions fonctionnent.

- [ ] La barre de recherche filtre les recettes en temps réel
- [ ] Les filtres par gamme (Pétrichor, Volcanique, etc.) fonctionnent
- [ ] Les filtres par type (parfum, resine, tabac) fonctionnent
- [ ] Le compteur de résultats se met à jour dynamiquement
- [ ] Les 3 actions (Comparer, Export, Favoris) sont visibles sur les cartes

**Test** : Appliquer 3 filtres différents et vérifier que le compteur se met à jour.

---

### **4. Page /molecules fonctionnelle**
**Objectif** : Les filtres radar et la recherche avancée fonctionnent.

- [ ] La barre de recherche filtre les molécules en temps réel
- [ ] Les 6 sliders radar (Intensité, Fraîcheur, Chaleur, etc.) fonctionnent
- [ ] Les filtres par propriétés chimiques (point d'ébullition, masse) fonctionnent
- [ ] Le compteur de résultats se met à jour dynamiquement
- [ ] Les profils radar hexagonaux s'affichent correctement

**Test** : Ajuster 3 sliders radar et vérifier que les résultats changent.

---

### **5. Contenu sans erreurs (typos, données manquantes)**
**Objectif** : Aucune faute de frappe, aucune donnée manquante visible.

- [ ] Aucune faute d'orthographe dans les titres et descriptions
- [ ] Aucune donnée "undefined" ou "null" affichée
- [ ] Les images ont des attributs `alt` descriptifs
- [ ] Les profils radar ne contiennent pas de valeurs par défaut (50/50/50)
- [ ] Les références bibliographiques sont formatées correctement

**Test** : Lire 5 fiches molécules et 5 recettes, vérifier qu'aucune donnée n'est manquante.

---

### **6. Design cohérent (desktop + mobile)**
**Objectif** : Le site est visuellement cohérent sur tous les écrans.

- [ ] Les couleurs respectent la charte graphique (laboratoire, sobre)
- [ ] Les espacements sont homogènes (padding, margin)
- [ ] Les boutons ont des états hover/focus visibles
- [ ] Le mode sombre fonctionne correctement (si activé)
- [ ] Le site est responsive sur mobile (320px à 1920px)

**Test** : Ouvrir le site sur mobile (iPhone/Android) et vérifier que tout est lisible.

---

### **7. Performance acceptable (< 3 secondes)**
**Objectif** : Le site charge rapidement, même avec 234 recettes.

- [ ] La page d'accueil charge en moins de 2 secondes
- [ ] La page /recettes charge en moins de 3 secondes
- [ ] Les images sont optimisées (< 200 KB chacune)
- [ ] Les skeleton loaders s'affichent pendant le chargement
- [ ] Aucun lag visible lors du scroll

**Test** : Ouvrir le site en navigation privée et mesurer le temps de chargement.

---

### **8. Accessibilité minimale (WCAG AA)**
**Objectif** : Le site est utilisable au clavier et avec un lecteur d'écran.

- [ ] Tous les boutons sont accessibles au clavier (Tab + Enter)
- [ ] Les états focus sont visibles (outline ou border)
- [ ] Les contrastes de couleurs respectent WCAG AA (4.5:1 minimum)
- [ ] Les images ont des attributs `alt` descriptifs
- [ ] Les formulaires ont des labels associés

**Test** : Naviguer sur le site uniquement au clavier (Tab, Enter, Espace).

---

### **9. Exports fonctionnels (Markdown, JSON, PDF)**
**Objectif** : Les exports génèrent des fichiers valides.

- [ ] L'export Markdown génère un fichier `.md` valide
- [ ] L'export JSON génère un fichier `.json` parsable
- [ ] L'export PDF génère un fichier `.pdf` lisible (si implémenté)
- [ ] Les noms de fichiers sont descriptifs (ex : `os-pluvieux-recette.md`)
- [ ] Les exports contiennent toutes les données (pas de champs vides)

**Test** : Exporter 3 recettes en Markdown et les importer dans Notion.

---

### **10. Comparaison fonctionnelle (si implémentée)**
**Objectif** : La page /compare fonctionne correctement.

- [ ] La sélection de 2-4 recettes fonctionne
- [ ] Le tableau comparatif affiche toutes les propriétés
- [ ] Les profils radar sont superposés correctement
- [ ] L'URL partageable fonctionne (ex : `/compare?ids=1,2,3`)
- [ ] Le bouton "Réinitialiser la comparaison" fonctionne

**Test** : Comparer 3 recettes, copier l'URL, ouvrir dans un nouvel onglet.

---

### **11. Favoris fonctionnels (si implémentés)**
**Objectif** : Les favoris sont sauvegardés dans localStorage.

- [ ] Le bouton "Ajouter aux favoris" fonctionne
- [ ] La page `/favoris` affiche les molécules/recettes sauvegardées
- [ ] Les favoris persistent après fermeture du navigateur
- [ ] Le bouton "Vider les favoris" fonctionne
- [ ] Le compteur de favoris se met à jour dynamiquement

**Test** : Ajouter 5 favoris, fermer le navigateur, rouvrir → vérifier qu'ils sont toujours là.

---

### **12. SEO & Partage (OpenGraph, Twitter Cards)**
**Objectif** : Le site s'affiche correctement lors du partage sur les réseaux sociaux.

- [ ] Les balises `<title>` sont uniques pour chaque page
- [ ] Les balises `<meta name="description">` sont présentes
- [ ] Les balises OpenGraph (`og:title`, `og:image`, `og:url`) sont présentes
- [ ] Les balises Twitter Cards (`twitter:card`, `twitter:image`) sont présentes
- [ ] L'image OpenGraph (1200×630 px) s'affiche correctement

**Test** : Partager le lien sur Facebook/LinkedIn/WhatsApp et vérifier l'aperçu.

---

## 📊 RÉSUMÉ DES TESTS

| Catégorie | Points à vérifier | Temps estimé |
|-----------|-------------------|--------------|
| **Compréhension** | 4 points | 5 min |
| **Navigation** | 5 points | 5 min |
| **Fonctionnalités** | 3 pages × 5 points | 15 min |
| **Contenu** | 5 points | 5 min |
| **Design** | 5 points | 5 min |
| **Performance** | 5 points | 5 min |
| **Accessibilité** | 5 points | 5 min |
| **Exports** | 5 points | 5 min |
| **SEO** | 5 points | 5 min |

**Total** : 12 catégories, 30-45 minutes

---

## 🚨 ACTIONS SI UN POINT ÉCHOUE

### **Erreur critique (bloquante)**
- Navigation cassée (404)
- Données "undefined" affichées
- Exports non fonctionnels
- Site non responsive sur mobile

**Action** : **NE PAS PARTAGER** le site avant correction.

---

### **Erreur mineure (non bloquante)**
- Faute de frappe dans un texte
- Image sans attribut `alt`
- Contraste de couleur légèrement insuffisant
- Skeleton loader manquant

**Action** : Corriger avant le partage, mais **non bloquant** si le délai est court.

---

## 📝 RAPPORT DE VALIDATION

Après avoir complété la checklist, remplir ce rapport :

```
Date de validation : __________
Validé par : __________

Résultats :
- Points validés : ____ / 12
- Points en erreur critique : ____
- Points en erreur mineure : ____

Statut final :
[ ] ✅ Prêt à partager
[ ] ⚠️ Corrections mineures nécessaires (non bloquant)
[ ] ❌ Corrections critiques nécessaires (bloquant)

Commentaires :
_______________________________________
_______________________________________
```

---

## 🎯 PROCHAINES ÉTAPES

1. **Exécuter cette checklist** (30-45 min)
2. **Corriger les erreurs** identifiées
3. **Re-tester** les points corrigés
4. **Valider le rapport** (12/12 points)
5. **Partager le site** avec confiance 🚀
