# Guide de Complétion Manuelle des Molécules Complexes

Ce guide explique comment compléter les données des molécules qui ne peuvent pas être enrichies automatiquement via PubChem, notamment les **accords**, **mélanges**, **absolues** et **compositions propriétaires**.

---

## Pourquoi certaines molécules ne peuvent pas être enrichies automatiquement ?

PubChem est une base de données de **composés chimiques purs** identifiés par leur structure moléculaire. Les éléments suivants ne sont pas indexés dans PubChem :

| Type | Exemples | Raison |
|------|----------|--------|
| **Accords** | Kaolin accord, Clay smoke, Marrow accord | Mélanges propriétaires sans structure chimique unique |
| **Absolues** | Jasmine absolute, Tonka bean absolute | Mélanges complexes de centaines de molécules |
| **Huiles essentielles** | Frankincense oil, Sandalwood oil | Compositions naturelles variables |
| **Compositions propriétaires** | Iso E Super, Ambroxan | Noms commerciaux, pas de CAS unique |
| **Pyrolysats** | Bone-smoke accord, Dust-burn accord | Produits de combustion complexes |

---

## Méthode 1 : Via l'Interface Web (Recommandé)

L'interface d'administration du site PERFUMUM permet d'éditer directement les fiches molécules.

### Étapes :

1. **Accéder à la page Molécules** : Naviguer vers `/molecules` dans le site
2. **Rechercher la molécule** : Utiliser la barre de recherche ou les filtres par famille
3. **Ouvrir la fiche** : Cliquer sur la molécule pour accéder à sa page de détail
4. **Éditer** : Cliquer sur le bouton "Éditer" (nécessite d'être connecté)
5. **Compléter les champs** :
   - **Nom IUPAC** : Laisser vide pour les accords, ou indiquer "Mélange complexe"
   - **Numéro CAS** : Laisser vide ou indiquer "N/A"
   - **Classe chimique** : Choisir la classe dominante (ex: "accord", "absolue", "pyrolysat")
   - **Profil olfactif** : Décrire les notes olfactives principales
   - **Sources botaniques** : Lister les plantes sources si applicable
   - **Propriétés thérapeutiques** : Documenter les effets connus

---

## Méthode 2 : Via SQL Direct (Avancé)

Pour les modifications en masse, utiliser des requêtes SQL via l'outil `webdev_execute_sql`.

### Exemple de mise à jour :

```sql
UPDATE molecules 
SET 
  chemical_class = 'accord',
  olfactive_profile = 'terreux, minéral, argile humide',
  notes = 'Accord propriétaire reproduisant l''odeur de l''argile mouillée'
WHERE name = 'Kaolin accord';
```

### Mise à jour en masse des accords :

```sql
UPDATE molecules 
SET chemical_class = 'accord'
WHERE name LIKE '%accord%' AND chemical_class IS NULL;

UPDATE molecules 
SET chemical_class = 'absolue'
WHERE name LIKE '%absolute%' AND chemical_class IS NULL;

UPDATE molecules 
SET chemical_class = 'pyrolysat'
WHERE name LIKE '%smoke%' OR name LIKE '%burn%' AND chemical_class IS NULL;
```

---

## Sources de Données Alternatives

Pour enrichir les molécules complexes, consulter ces ressources :

### Bases de données parfumerie

| Source | URL | Type de données |
|--------|-----|-----------------|
| **The Good Scents Company** | [thegoodscentscompany.com](http://www.thegoodscentscompany.com/) | Profils olfactifs, utilisations |
| **Fragrantica** | [fragrantica.com](https://www.fragrantica.com/) | Notes olfactives, pyramides |
| **Perfumer & Flavorist** | [perfumerflavorist.com](https://www.perfumerflavorist.com/) | Articles techniques |
| **IFRA** | [ifrafragrance.org](https://ifrafragrance.org/) | Restrictions réglementaires |

### Littérature scientifique

| Source | Accès | Contenu |
|--------|-------|---------|
| **PubMed** | Gratuit | Articles sur les propriétés thérapeutiques |
| **ScienceDirect** | Payant/Université | Analyses chromatographiques |
| **ResearchGate** | Gratuit | Publications en parfumerie |

### Livres de référence

- **Arctander, S.** (1969). *Perfume and Flavor Chemicals*. Allured Publishing.
- **Bauer, K., Garbe, D., & Surburg, H.** (2001). *Common Fragrance and Flavor Materials*. Wiley-VCH.
- **Calkin, R. R., & Jellinek, J. S.** (1994). *Perfumery: Practice and Principles*. Wiley.

---

## Champs à Compléter par Type

### Pour les Accords

| Champ | Valeur recommandée |
|-------|-------------------|
| `chemical_class` | "accord" |
| `iupac_name` | Laisser vide ou "Mélange complexe" |
| `cas_number` | Laisser vide ou "N/A" |
| `olfactive_profile` | Description détaillée des notes |
| `notes` | Composition approximative si connue |

### Pour les Absolues

| Champ | Valeur recommandée |
|-------|-------------------|
| `chemical_class` | "absolue" |
| `iupac_name` | Laisser vide |
| `cas_number` | CAS de l'absolue si disponible (ex: 8024-43-9 pour jasmin) |
| `botanical_sources` | Plante source (ex: "Jasminum grandiflorum") |
| `extraction_method` | "Extraction par solvant" |

### Pour les Pyrolysats

| Champ | Valeur recommandée |
|-------|-------------------|
| `chemical_class` | "pyrolysat" |
| `iupac_name` | Laisser vide |
| `cas_number` | Laisser vide |
| `olfactive_profile` | Notes fumées, carbonisées |
| `notes` | Matière source et température de pyrolyse |

---

## Liste des Molécules à Compléter Manuellement

Les molécules suivantes ont été identifiées comme nécessitant une complétion manuelle :

### Accords (10 molécules)

- Kaolin accord (90004)
- Clay smoke (90005)
- Sandstone accord (90012)
- Marrow accord (90038)
- Bone-smoke accord (90039)
- Dust-burn accord (90040)
- Humus absolute (90006)
- Fossile absolute (90018)
- Créosote light (90022)
- Phénols oxydés (90023)

### Compositions propriétaires

- Sclerene (90003)
- Fer volatil (90007)
- Aluminium aldehyde (90008)
- Sulfur base (90009)
- Bitume light (90011)
- Silicate aldehyde (90014)
- Ammonium-Maillard (90027)

---

## Workflow Recommandé

1. **Identifier** les molécules sans données via la page `/molecules` (filtrer par "Sans CAS")
2. **Rechercher** les informations dans les sources alternatives
3. **Documenter** les sources utilisées dans le champ `notes`
4. **Valider** en changeant `validation_status` à "valide"
5. **Créer des liaisons** si des plantes sources sont identifiées

---

*Document créé le 30 janvier 2026 pour le projet PERFUMUM*
