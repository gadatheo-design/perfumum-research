# Guide de Saisie des Données Botaniques

## Introduction

Ce guide détaille les procédures de saisie des données botaniques dans le système PERFUMUM. Il vise à garantir la cohérence, la qualité et l'exploitabilité des données sur le long terme (10 ans de recherche).

## 1. Création d'une Nouvelle Plante

### Champs Obligatoires

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Nom commun** | Nom usuel en français | "Lavande fine" |
| **Catégorie** | Classification ABSORBE | "aromatique", "tabac", "cannabis", etc. |

### Champs Recommandés

| Champ | Description | Format |
|-------|-------------|--------|
| **Nom latin** | Nomenclature binomiale | *Lavandula angustifolia* |
| **Famille** | Famille botanique | "Lamiaceae" |
| **Origine** | Zone géographique principale | "Provence, France" |
| **Axe climatique** | Classification ABSORBE | "vent", "bois", "disparition" |

### Classification Taxonomique

Remplir dans l'ordre hiérarchique :

1. **Règne** (Kingdom) : Toujours "Plantae"
2. **Division** (Phylum) : Ex. "Magnoliophyta"
3. **Classe** (Class) : Ex. "Magnoliopsida"
4. **Ordre** (Order) : Ex. "Lamiales"
5. **Famille** (Family) : Ex. "Lamiaceae"
6. **Genre** (Genus) : Ex. "Lavandula"
7. **Espèce** (Species) : Ex. "angustifolia"

### Signature Olfactive

Décrire en 3 niveaux :

1. **Notes de tête** : Premières impressions (0-30 min)
2. **Notes de cœur** : Développement (30 min - 4h)
3. **Notes de fond** : Persistance (4h+)

**Exemple** :
> "Florale, herbacée en tête. Cœur légèrement camphré avec des nuances miellées. Fond boisé-ambré discret."

### Molécules Dominantes

Lister les 3-5 molécules principales avec leurs pourcentages approximatifs :

```
Linalol (25-38%)
Acétate de linalyle (25-45%)
Terpinène-4-ol (2-6%)
Lavandulol (>0.3%)
```

## 2. Ajout d'une Variété

### Identification

- **Code variété** : Format PV-XXX (auto-généré)
- **Plante parente** : Sélectionner dans la liste
- **Nom de la variété** : Nom du cultivar ou chémotype

### Type de Variété

| Type | Description | Exemple |
|------|-------------|---------|
| **cultivar** | Variété cultivée sélectionnée | 'Hidcote', 'Munstead' |
| **chemotype** | Profil moléculaire distinct | CT linalol, CT thymol |
| **landrace** | Variété locale traditionnelle | Lavande de Sault |
| **hybrid** | Croisement de variétés | Lavandin |
| **clone** | Reproduction végétative | Clone sélectionné |
| **wild** | Forme sauvage | Population naturelle |

### Caractéristiques Distinctives

Décrire ce qui distingue cette variété :
- Morphologie (taille, couleur, forme)
- Profil olfactif spécifique
- Rendement en huile essentielle
- Résistance aux maladies/climat

## 3. Documentation des États Botaniques

### Stades de Développement

| Code | Stade | Description |
|------|-------|-------------|
| G | Germination | Émergence, cotylédons |
| V | Végétatif | Croissance foliaire active |
| F | Floraison | Production de fleurs |
| FR | Fructification | Formation des graines |
| S | Sénescence | Déclin, jaunissement |
| D | Dormance | Repos végétatif hivernal |

### Pour Chaque État

1. **Description visuelle** : Caractéristiques observables
2. **Durée typique** : En jours ou semaines
3. **Profil olfactif** : Notes dominantes à ce stade
4. **Molécules** : Composition à ce stade
5. **Recommandation de récolte** : Optimal ou non

## 4. Enregistrement des Terroirs

### Localisation

- **Pays** : Nom complet (ex: "France")
- **Région** : Région administrative (ex: "Provence-Alpes-Côte d'Azur")
- **Sous-région** : Zone précise (ex: "Plateau de Valensole")
- **Coordonnées GPS** : Latitude, Longitude (décimal)
- **Altitude** : En mètres ou plage (ex: "600-800m")

### Caractéristiques du Terroir

| Aspect | Éléments à documenter |
|--------|----------------------|
| **Climat** | Type climatique, températures, précipitations |
| **Sol** | Type de sol, pH, drainage |
| **Exposition** | Orientation, ensoleillement |
| **Végétation** | Environnement végétal |

### Qualité et Certifications

- AOP (Appellation d'Origine Protégée)
- IGP (Indication Géographique Protégée)
- Bio (Agriculture Biologique)
- Demeter (Biodynamie)

## 5. Méthodes d'Extraction

### Paramètres à Documenter

| Paramètre | Unité | Exemple |
|-----------|-------|---------|
| **Température** | °C | "100°C" |
| **Pression** | bar | "1 atm", "150 bar" |
| **Durée** | minutes/heures | "2-3h" |
| **Rendement** | % | "1.5-3%" |
| **Solvant** | - | "Eau", "CO²", "Hexane" |

### Types d'Extraction

1. **Distillation à la vapeur** : Standard pour HE
2. **Hydrodistillation** : Plante immergée
3. **CO² supercritique** : Haute pression, basse température
4. **Expression à froid** : Agrumes uniquement
5. **Enfleurage** : Fleurs délicates (jasmin, tubéreuse)
6. **Extraction solvant** : Absolues et concrètes
7. **Macération** : Huiles infusées

## 6. Analyses GC-MS

### Informations Requises

- **Date d'analyse** : Format ISO (YYYY-MM-DD)
- **Laboratoire** : Nom et certification
- **Méthode** : Protocole utilisé
- **Échantillon** : Référence du lot

### Format des Résultats

```json
{
  "molecules": [
    { "name": "Linalol", "percentage": 32.5, "cas": "78-70-6" },
    { "name": "Acétate de linalyle", "percentage": 41.2, "cas": "115-95-7" }
  ],
  "totalIdentified": 95.8,
  "notes": "Profil typique lavande fine AOC"
}
```

## 7. Échantillons et Lots

### Traçabilité

| Information | Description |
|-------------|-------------|
| **Code lot** | Identifiant unique (SAM-XXX) |
| **Date récolte** | Date précise ou période |
| **Lieu** | Terroir de provenance |
| **Quantité** | Masse ou volume |
| **État** | Frais, sec, congelé |

### Stockage

- **Localisation** : Où est stocké l'échantillon
- **Conditions** : Température, humidité, lumière
- **Date limite** : Durée de conservation estimée

## 8. Bonnes Pratiques

### Cohérence

- Utiliser les mêmes termes pour les mêmes concepts
- Respecter les conventions de nommage
- Vérifier l'orthographe des noms latins

### Complétude

- Remplir un maximum de champs
- Documenter les sources d'information
- Ajouter des notes explicatives si nécessaire

### Mise à Jour

- Dater les modifications importantes
- Conserver l'historique des changements
- Signaler les données incertaines

### Validation

- Vérifier les données avant enregistrement
- Croiser avec des sources fiables
- Faire valider par un expert si possible

## 9. Sources de Référence

### Bases de Données

- [The Plant List](http://www.theplantlist.org/)
- [GBIF](https://www.gbif.org/)
- [PubChem](https://pubchem.ncbi.nlm.nih.gov/)
- [NIST Chemistry WebBook](https://webbook.nist.gov/chemistry/)

### Ouvrages de Référence

- Arctander, S. (1969). *Perfume and Flavor Chemicals*
- Guenther, E. (1948-1952). *The Essential Oils* (6 volumes)
- Bauer, K. et al. (2001). *Common Fragrance and Flavor Materials*

### Normes

- ISO 4720 : Nomenclature des huiles essentielles
- ISO 9235 : Vocabulaire des matières premières aromatiques
- IFRA Standards : Restrictions d'usage

---

*Document créé le 03 janvier 2026*
*PERFUMUM — Recherche Olfactive Expérimentale*
