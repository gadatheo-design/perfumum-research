# Analyse d'intégration : Résines CBD ABSORBE

**Date** : 2025-12-06  
**Source** : tab.pdf (7 pages)

---

## Contenu identifié

### Collection Classique "Résines du Levant" (5 recettes)

1. **Mastiha Brut** — 2.0% aromatique
2. **Vétiver Labdanum** — 2.2%
3. **Figue & Santal Blanc** — 1.9%
4. **Noir de Myrrhe** — 2.0%
5. **Cuir d'Ambre** — 2.2%

### Collection Expérimentale "Matériaux Impossibles" (5 recettes)

6. **Sève Noire / Feuillage Mort** — 2.0%
7. **Métal Liquide** — 1.3%
8. **Feu Fumé / Soufre Doux** — 2.05%
9. **Orchidée Salée** — 1.5%
10. **Distillat de Nuit / Morphée** — 2.3%

### Procédé technique

**Procédé hybride d'extraction aromatique** (Éthanol → Évaporation → Solubilisation MCT)
- Extraction éthanolique à froid (24-48h, 20-25°C)
- Évaporation lente (≤40°C)
- Solubilisation dans huile MCT (35-45°C)
- Incorporation dans hash CBD (0.5-3%)

### Principes généraux de fabrication

| Étape | Description | Détails techniques |
|-------|-------------|-------------------|
| 1. Préparation du hash | Ramollir légèrement | Bain-marie 55-65°C, max 70°C |
| 2. Préparation aromatique | Réaliser infusions/fondants | Infuser 24h dans MCT ou pépin de raisin |
| 3. Incorporation | Mélanger doucement | Ajouter 0.5-3% dans hash tiède |
| 4. Curing/maturation | Laisser reposer | Bocal hermétique, 7-10 jours, 18-22°C |
| 5. Conservation | Stocker | Pots opaques, <20°C, humidité 40-50%, stable 6 mois |

---

## Statut d'intégration

### ❌ Non intégré

Ces 10 recettes **ne sont pas présentes** dans la base de données actuelle.

**Vérification effectuée** :
```sql
SELECT COUNT(*) FROM recettes WHERE category = 'resine';
-- Résultat : 0
```

La table `recettes` contient actuellement :
- 60 variations Pétrichor
- 36 variations Volcanique
- 4 recettes Mossi
- Autres recettes (parfums, encens, tabacs)

**Total actuel** : 142 recettes  
**Après intégration** : 152 recettes (+10)

---

## Proposition d'intégration

### Option 1 : Nouvelle catégorie "resine_cbd"

**Avantages** :
- Sépare clairement les résines CBD des autres types
- Permet filtrage spécifique
- Cohérent avec la structure existante

**Schéma** :
```typescript
category: mysqlEnum("category", [
  "tabac",
  "resine",
  "resine_cbd",  // NOUVEAU
  "cone",
  "parfum",
  "encens",
  "extrait"
])
```

### Option 2 : Utiliser catégorie "resine" existante

**Avantages** :
- Pas de modification schéma
- Simplifie la structure

**Inconvénient** :
- Mélange résines classiques et résines CBD

---

## Données à intégrer pour chaque recette

### Champs obligatoires
- `name` : Nom de la recette (ex: "Mastiha Brut")
- `category` : "resine_cbd" ou "resine"
- `formula` : Composition détaillée (phases Tête/Cœur/Fond)
- `protocol` : Procédé de fabrication
- `intensity` : Pourcentage aromatique (1.3% à 2.3%)

### Champs optionnels
- `description` : Description sensorielle
- `ingredients` : Liste des matières principales
- `stability` : Durée de conservation (6-12 mois)
- `notes` : Notes techniques (type de hash recommandé, effet sensoriel)

### Exemple : Mastiha Brut

```json
{
  "name": "Mastiha Brut",
  "category": "resine_cbd",
  "formula": "Tête: Zeste citron vert 0.2%, Laurier séché 0.1% | Cœur: Mastiha fondue 0.8%, Cardamome verte 0.2% | Fond: Santal 0.5%, Benjoin 0.2%",
  "protocol": "Ramollir la mastiha au bain-marie, émulsionner dans 5mL d'huile tiède avec infusions de zestes et épices, filtrer, incorporer dans 100g de hash, malaxer et curer 8 jours.",
  "intensity": 2.0,
  "description": "Résine verte, citronnée, balsamique. Notes fraîches et aromatiques sèches.",
  "ingredients": "Mastiha, citron vert, laurier, cardamome, santal, benjoin",
  "stability": 180,
  "notes": "Hash résineux/poivré recommandé. Effet énergique, ambré."
}
```

---

## Recommandation

**Action proposée** :

1. ✅ Créer catégorie `resine_cbd` dans le schéma
2. ✅ Intégrer les 10 recettes avec données complètes
3. ✅ Créer page dédiée `/resines-cbd` avec filtres par collection
4. ✅ Ajouter procédé technique dans page Laboratoire
5. ✅ Lier recettes aux molécules existantes (labdanum, santal, vétiver, etc.)

**Estimation** : 2-3h de travail (schéma + import + page)

---

## Validation requise

Souhaitez-vous que je procède à l'intégration complète ?
