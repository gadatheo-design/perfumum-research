# Analyse Terminologique : "Civilisations"

**Date** : 2025-12-06  
**Contexte** : Révision terminologique du projet PERFUMUM

---

## 1. Usage actuel

**Table** : `civilisations`  
**Données** : 10 entrées documentant des pratiques olfactives rituelles

**Exemples** :
- Égypte Antique (antique) : Kyphi, encens, myrrhe
- Mésopotamie (archaic) : Cèdre, bitume, résines
- Grèce Antique (antique) : Iris, safran, rose
- Rome Antique (antique) : Nard, cannelle, storax
- Inde Védique (archaic) : Santal, camphre, patchouli

**Champs** :
- `name` : Nom de la civilisation
- `region` : Zone géographique
- `temporality` : Période historique (archaic, antique, medieval, abyssal, futuristic)
- `symbolicMaterials` : Matières symboliques utilisées
- `longDescription` : Contexte anthropologique et pratiques rituelles

---

## 2. Problématique du terme "Civilisations"

### Limites épistémologiques

Le terme **"civilisation"** pose plusieurs problèmes dans un contexte de recherche scientifique :

1. **Connotation coloniale** : Le concept de "civilisation" a historiquement été utilisé pour hiérarchiser les sociétés (civilisé vs barbare), ce qui est aujourd'hui considéré comme ethnocentrique.

2. **Imprécision scientifique** : En anthropologie contemporaine, le terme est jugé trop vague et chargé idéologiquement. Les chercheurs lui préfèrent des concepts plus neutres et opératoires.

3. **Anachronisme** : Le terme implique une continuité culturelle qui ne correspond pas toujours aux réalités historiques (ex: "Égypte Antique" regroupe 3000 ans d'évolutions).

4. **Réductionnisme** : Il simplifie des ensembles culturels complexes et hétérogènes en entités monolithiques.

---

## 3. Alternatives terminologiques

### Option 1 : **Cultures** ✅ RECOMMANDÉ
- **Avantages** : Neutre, précis, usage académique standard
- **Définition** : Ensemble de pratiques, savoirs et représentations partagés par un groupe social
- **Exemple** : "Culture égyptienne antique", "Culture védique"

### Option 2 : **Traditions olfactives**
- **Avantages** : Spécifique au domaine olfactif, met l'accent sur la transmission
- **Définition** : Ensemble de pratiques olfactives transmises dans le temps
- **Exemple** : "Tradition olfactive égyptienne", "Tradition védique"

### Option 3 : **Corpus olfactifs**
- **Avantages** : Scientifique, documentaire, neutre
- **Définition** : Ensemble documenté de pratiques et matériaux olfactifs
- **Exemple** : "Corpus olfactif égyptien", "Corpus védique"

### Option 4 : **Aires culturelles**
- **Avantages** : Géographique et anthropologique, usage académique
- **Définition** : Zone géographique caractérisée par des traits culturels communs
- **Exemple** : "Aire culturelle méditerranéenne antique"

### Option 5 : **Contextes rituels**
- **Avantages** : Fonctionnel, met l'accent sur l'usage
- **Définition** : Cadres sociaux et symboliques des pratiques olfactives
- **Exemple** : "Contexte rituel égyptien", "Contexte védique"

---

## 4. Recommandation

**Terme recommandé** : **Cultures** ou **Traditions olfactives**

### Justification

- **Cultures** : Terme standard en anthropologie, neutre, précis, facilement compréhensible
- **Traditions olfactives** : Plus spécifique au projet PERFUMUM, met l'accent sur la dimension olfactive

### Impact technique

**Si changement adopté** :
1. Renommer table : `civilisations` → `cultures` ou `traditions_olfactives`
2. Renommer fichiers :
   - `Civilisations.tsx` → `Cultures.tsx`
   - `CivilisationDetail.tsx` → `CultureDetail.tsx`
3. Mettre à jour navigation Header
4. Réviser contenu textuel (descriptions, labels)
5. Migrer base de données avec `pnpm db:push`

**Estimation** : 15-20 fichiers à modifier, ~2h de travail

---

## 5. Proposition de nomenclature révisée

### Avant
```
Table: civilisations
Page: /civilisations
Navigation: "Civilisations"
Exemple: "Égypte Antique"
```

### Après (Option 1)
```
Table: cultures
Page: /cultures
Navigation: "Cultures"
Exemple: "Culture égyptienne antique"
```

### Après (Option 2)
```
Table: traditions_olfactives
Page: /traditions
Navigation: "Traditions"
Exemple: "Tradition olfactive égyptienne"
```

---

## 6. Validation requise

**Question à l'utilisateur** :

Quel terme préférez-vous parmi :
1. **Cultures** (neutre, standard académique)
2. **Traditions olfactives** (spécifique au domaine)
3. **Corpus olfactifs** (approche documentaire)
4. **Autre suggestion** ?

Une fois validé, je procéderai au renommage complet (table, fichiers, navigation, contenu).
