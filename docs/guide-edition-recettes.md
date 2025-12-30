# Guide d'Édition des Recettes PERFUMUM

Ce guide explique comment modifier les proportions et les paramètres d'une recette via l'interface d'administration.

---

## 1. Accéder à la Page de Détail d'une Recette

### Via la recherche

1. Accédez à `/recettes` dans le menu principal
2. Utilisez la barre de recherche pour trouver votre recette (ex: "Pétrichor Sacré")
3. Cliquez sur la carte de la recette pour ouvrir la page de détail

### Informations affichées

La page de détail affiche :

| Section | Description |
|---------|-------------|
| **Formule** | Proportions de chaque ingrédient en pourcentage |
| **Ingrédients Clés** | Liste des matières premières utilisées |
| **Intensité** | Échelle 1-10 |
| **Stabilité** | Low / Medium / High |
| **Maturation** | Durée recommandée en jours |
| **Évolution Aromatique** | Notes de Tête, Cœur, Fond |
| **Protocole de Fabrication** | Étapes de préparation |
| **Notes de Recherche** | Observations et commentaires |

---

## 2. Modifier une Recette via l'Interface Admin

### Accéder à l'administration

1. Cliquez sur **Admin** dans le menu principal
2. Sélectionnez **Gérer les recettes** ou accédez directement à `/admin/recettes`

### Formulaire d'édition

Le formulaire permet de modifier :

**Informations de base**
- Nom de la recette
- Catégorie (parfum, résine, résine_cbd, etc.)
- Description

**Composition**
- Ingrédients (format JSON ou texte)
- Formule (proportions détaillées)
- Protocole de fabrication

**Propriétés**
- Texture
- Intensité (1-10)
- Stabilité (low, medium, high)
- Statut (experimental, testing, validated, production)

**Évolution aromatique**
- Notes de tête
- Notes de cœur
- Notes de fond

**Notes additionnelles**
- Observations de recherche
- Commentaires de maturation

---

## 3. Exemple : Modifier les Proportions de Pétrichor Sacré

### Formule actuelle

```json
{
  "Mitti Attar": "20%",
  "Omani Black Frankincense": "15%",
  "Palo Santo": "12%",
  "Spikenard": "8%",
  "Black Emerald": "10%",
  "Alcool parfumeur": "35%"
}
```

### Variation proposée (plus de profondeur)

Pour renforcer les notes terreuses, augmentez Mitti Attar et Spikenard :

```json
{
  "Mitti Attar": "25%",
  "Omani Black Frankincense": "12%",
  "Palo Santo": "12%",
  "Spikenard": "12%",
  "Black Emerald": "10%",
  "Alcool parfumeur": "29%"
}
```

### Étapes de modification

1. Accédez à `/admin/recettes`
2. Recherchez "Pétrichor Sacré" dans la liste
3. Cliquez sur **Éditer**
4. Modifiez le champ **Formule** avec les nouvelles proportions
5. Ajoutez une note dans **Notes de recherche** pour documenter la modification
6. Cliquez sur **Sauvegarder**

---

## 4. Bonnes Pratiques

### Documenter les modifications

Chaque modification doit être accompagnée d'une note explicative :

> **[DATE] - Variation B**  
> Augmentation Mitti Attar 20% → 25% et Spikenard 8% → 12%  
> Objectif : Renforcer les notes terreuses et la profondeur du fond  
> Résultat attendu : Pétrichor plus prononcé, fond plus persistant

### Conserver l'historique

Avant de modifier une recette validée, créez une copie avec un suffixe de version :

- Pétrichor Sacré (original)
- Pétrichor Sacré v2 (variation A)
- Pétrichor Sacré v3 (variation B)

### Tester avant de valider

Utilisez le statut **experimental** pour les nouvelles variations, puis passez à **testing** après les premiers tests, et enfin **validated** une fois la formule stabilisée.

---

## 5. Raccourcis Utiles

| Action | Chemin |
|--------|--------|
| Liste des recettes | `/recettes` |
| Administration recettes | `/admin/recettes` |
| Détail d'une recette | `/recette/[ID]` |
| Calculateur de dosages | `/calculateur` |
| Matrice de synergies | `/matrice-synergies` |

---

*Document généré par PERFUMUM — Recherche Olfactive*
