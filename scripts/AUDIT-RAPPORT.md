# RAPPORT D'AUDIT QUALITÉ SCIENTIFIQUE — PERFUMUM

**Date :** 9 mars 2026  
**Périmètre :** Base de données complète — Molécules (2 012) + Recettes (310)  
**Objectif :** Identifier les données douteuses, incohérentes ou de mauvaise qualité pour prioriser un nettoyage ciblé.

---

## 1. ÉTAT GÉNÉRAL DE LA BASE

| Entité | Quantité | Couverture thérapeutique | Couverture olfactive | Formule chimique |
|--------|----------|--------------------------|----------------------|------------------|
| Molécules | 2 012 | 58% (1 176/2 012) | 84% (1 695/2 012) | 24% (486/2 012) |
| Recettes | 310 | — | — | — |
| Liaisons recette-molécule | 97 | — | — | — |

**Constat général :** La base est volumineuse mais hétérogène. L'accumulation de données sur plusieurs sessions a introduit des artefacts de qualité variable. Le nettoyage est **nécessaire et faisable** sans perte de données scientifiques valides.

---

## 2. ANOMALIES MOLÉCULES — CLASSEMENT PAR PRIORITÉ

### 🔴 PRIORITÉ HAUTE — Corrections immédiates

#### 2.1 Entrées bibliographiques importées comme molécules (10 cas confirmés)

Des références bibliographiques complètes ont été insérées dans la table `molecules` avec des IDs dans la plage 1 230 000. Exemples :

- ID:1230003 — *"EN: Dry riverbeds (washes) in the Colorado and Sonoran deserts..."* (151 chars)
- ID:1230012 — *"• Calflora. (n.d.). Psorothamnus spinosus taxon report. URL: https://..."* (104 chars)
- ID:1230013 — *"• USDA PLANTS. (n.d.). Psorothamnus spinosus..."* (128 chars)

**Diagnostic :** Ces entrées sont des fragments de texte botanique ou des citations bibliographiques, pas des molécules chimiques. Elles ont probablement été importées lors d'un batch de données textuelles mal filtré.

**Action recommandée :** Supprimer les ~10 entrées de la plage ID 1 230 000 avec `LENGTH(name) > 80` et `name LIKE '%•%'` ou `name LIKE '%URL%'`.

#### 2.2 Entrées CSV brutes dans la table molécules (20 cas confirmés)

Des lignes entières de fichiers CSV ont été importées comme noms de molécules. Exemples :

- ID:1260002 — *"Note muguet/aquatique,C11H12O3,,,,,Aldéhydes Marins,,,2"*
- ID:1260004 — *"→ ne pas attribuer de source botanique sans CAS/nom chimique,,,,,,Aldéhydes Mari..."*
- ID:1260008 — *"Bière / fermentation — non botanique strict,C5H10O,,,,,Composés azotés,,,1"*
- ID:1260009 — *"Précurseur naturel: vétiver (Chrysopogon zizanioides),Mixture,,,,,Accords terreux,,,3"*

**Diagnostic :** Ces entrées sont des lignes CSV brutes avec virgules, formules et commentaires. Elles proviennent d'un import mal parsé (probablement un fichier CSV où le séparateur n'a pas été correctement traité).

**Action recommandée :** Supprimer toutes les molécules dont le nom contient des virgules **ET** ressemble à une ligne CSV (présence de formules chimiques, de chiffres isolés, de `→`, de `//`).

#### 2.3 Doublons confirmés avec même CAS number (8 cas critiques)

| Molécule 1 | ID | Molécule 2 | ID | CAS |
|------------|-----|------------|-----|-----|
| Acide Férulique | 60009 | Acide férulique | 1350061 | 1135-24-6 |
| Cis-3-Hexénol | 570030 | Cis-3-hexénol | 1350100 | 928-96-1 |
| Humulène | 90048 | α-Humulène | 570066 | 6753-98-6 |
| Alpha-Ionone | 570021 | α-Ionone | 720020 | 127-41-3 |
| alpha-pinene | 810001 | α-Pinene | 900008 | 80-56-8 |

**Diagnostic :** Ce sont des doublons certains — même CAS number, même molécule, deux entrées distinctes. Ils résultent d'imports successifs avec des conventions de nommage différentes (majuscule/minuscule, préfixe grec α/alpha).

**Action recommandée :** Fusionner les paires en conservant l'entrée avec le CAS number et les données les plus complètes. Mettre à jour les liaisons `plant_molecules` et `recette_molecules` pour pointer vers l'entrée conservée.

#### 2.4 Formules chimiques contenant des noms IUPAC au lieu de formules brutes (20 cas)

La colonne `chemicalFormula` contient des noms IUPAC au lieu de formules brutes. Exemples :

- ID:210003 — Acide butyrique → `"Butanoic acid"` (devrait être `C4H8O2`)
- ID:210009 — Éthyl butyrate → `"Ethyl butanoate"` (devrait être `C6H12O2`)
- ID:360002 — Frangipani → `"C10H18O (géraniol, linalol)"` (formule composite invalide)

**Diagnostic :** La colonne `chemicalFormula` a été remplie avec des noms IUPAC ou des descriptions textuelles au lieu de formules moléculaires brutes (Hill notation : CxHyOzNw...). Les entrées de type `"C10H18O (géraniol, linalol)"` sont particulièrement problématiques car elles mélangent formule et commentaire.

**Action recommandée :** Corriger les 20 cas identifiés. Pour les entrées avec commentaires entre parenthèses, extraire uniquement la formule brute.

---

### 🟡 PRIORITÉ MOYENNE — Corrections planifiées

#### 2.5 Doublons potentiels sans CAS identique (52 cas)

Des paires de molécules ont des noms normalisés identiques mais des CAS différents ou absents. Exemples :

- `"Alpha-cedrene"` (id:990026) ↔ `"Beta-cedrene"` (id:990027) — **Ce ne sont PAS des doublons** (isomères)
- `"Iso-eugénol"` (id:1110015) ↔ `"Isoeugénol"` (id:1350089) — **Doublon probable** (même molécule, orthographe différente)
- `"Tubéreuse Absolue (extrait)"` (id:330009) ↔ `"Tubéreuse Absolue (extrait)"` (id:1260648) — **Doublon certain** (nom identique)
- `"Ylang-ylang (Cananga odorata) (HE)"` ↔ `"Ylang-ylang (Cananga odorata; HE)"` — **Doublon probable** (parenthèse vs point-virgule)

**Note importante :** Les paires alpha/beta (α-Pinène/β-Pinène, α-Ionone/β-Ionone, α-Cèdre/β-Cèdre) **ne sont PAS des doublons** — ce sont des isomères distincts avec des propriétés olfactives différentes. L'algorithme de normalisation les a incorrectement signalés.

**Action recommandée :** Analyse manuelle des 52 cas. Estimer ~15 vrais doublons à fusionner.

#### 2.6 Entrées de type "extrait de plante" ou "accord" classées comme molécules (identifiées précédemment)

Des entrées comme `"Frangipani (Plumeria)"`, `"Juniper (Genièvre)"`, `"Lippia Origanoides (Origan Sauvage)"` ont une `chemicalFormula` de type `"C10H18O (géraniol, linalol)"` — ce sont des accords ou extraits, pas des molécules pures.

**Action recommandée :** Vérifier si ces entrées ont déjà été préfixées `[EXTRAIT PLANTE]` lors des sessions précédentes. Si non, les renommer.

---

### 🟢 PRIORITÉ BASSE — Améliorations futures

#### 2.7 Formule chimique manquante (76% des molécules)

1 526 molécules sur 2 012 n'ont pas de formule chimique renseignée. Ce n'est pas une erreur mais un manque de données — acceptable pour les extraits complexes et les mélanges, mais à compléter pour les molécules pures.

#### 2.8 Profil olfactif manquant (16% des molécules)

317 molécules sans profil olfactif, principalement dans les familles Polysaccharide, Peptide, Acide aminé (ajoutées lors des Batches 10+). Normal pour ces familles non-olfactives.

---

## 3. ANOMALIES RECETTES — CLASSEMENT PAR PRIORITÉ

### 🔴 PRIORITÉ HAUTE

#### 3.1 92% des recettes sans ingrédients liés (286/310)

C'est l'anomalie la plus significative de la base. 286 recettes sur 310 n'ont aucune liaison dans `recette_molecules`. Cependant, **une partie importante** de ces recettes possède un champ texte `ingredients` avec des listes lisibles. Exemples :

- "Résine Primordiale" → *"Résine de pin, Ambre gris, Terre humide"*
- "Mastiha Brut" → *"Mastiha, citron vert, laurier, cardamome, santal, benjoin"*
- "CBD Terre Première" → *"CBD Isolat, Géosmine, Terre humide, Kaolin"*

**Diagnostic :** Les recettes ont été créées avec un champ texte libre `ingredients` mais sans liaison formelle vers la table `molecules`. Cela rend impossible le filtrage par molécule, les analyses de composition et les corrélations.

**Action recommandée :** Créer un script de parsing du champ `ingredients` pour générer automatiquement les liaisons `recette_molecules`. Prioriser les 20 recettes avec texte ingrédients déjà identifiées.

#### 3.2 Recettes avec proportions < 50% (15 cas)

15 recettes ont des proportions totales inférieures à 50%, dont 3 avec un seul ingrédient à proportion très faible :

- "Pheromona Alpha" : 1 ingrédient à 1% (Androsténone)
- "TABAC VERT COLOMBIEN" : 1 ingrédient à 8% (Carvone L)
- "TOUNDRA CAMPHRÉE" : 1 ingrédient à 15% (Pinocamphone)

**Diagnostic :** Ces recettes sont probablement des **ébauches** ou des **formulations concentrées** (dilutions dans un solvant non renseigné). La proportion faible peut être intentionnelle (ex: phéromone à 1% dans un solvant).

**Action recommandée :** Ajouter un champ `is_concentrate` ou `solvent_percentage` pour distinguer les formulations concentrées des recettes incomplètes. Pour les 3 recettes à 1 ingrédient, vérifier si elles sont intentionnelles.

---

### 🟡 PRIORITÉ MOYENNE

#### 3.3 Recette "os" (ID:1) — nom trop court

La recette ID:1 s'appelle simplement "os" — probablement une entrée de test ou un nom incomplet.

**Action recommandée :** Renommer ou supprimer si c'est une entrée de test.

#### 3.4 Catégories recettes non couvertes

- `resine_cbd` : 44 recettes, 0 liaisons moléculaires
- `encens` : 30 recettes, 0 liaisons moléculaires
- `resine` : 8 recettes, 0 liaisons moléculaires
- `extrait` : 3 recettes, 0 liaisons moléculaires

Ces catégories entières n'ont aucune liaison formelle. Elles nécessitent le même traitement que les recettes parfum sans ingrédients.

---

## 4. PLAN DE NETTOYAGE PRIORISÉ

### Phase A — Nettoyage immédiat (sûr, sans risque de perte)

| Action | Entrées concernées | Risque |
|--------|-------------------|--------|
| Supprimer les références bibliographiques importées comme molécules | ~10 entrées (ID ~1 230 000, name LIKE '%•%' OR '%URL%') | Nul |
| Supprimer les lignes CSV brutes importées comme molécules | ~15 entrées (name LIKE '%,%' AND name LIKE '%,%,%') | Nul |
| Fusionner les doublons avec CAS identique | 5 paires confirmées | Faible |
| Corriger les formules chimiques IUPAC → formules brutes | 20 entrées | Nul |

### Phase B — Nettoyage modéré (vérification manuelle recommandée)

| Action | Entrées concernées | Risque |
|--------|-------------------|--------|
| Analyser et fusionner les doublons potentiels sans CAS | ~15 vrais doublons sur 52 signalés | Moyen |
| Parser le champ `ingredients` des recettes pour créer les liaisons | 20 recettes avec texte | Faible |
| Renommer la recette "os" (ID:1) | 1 entrée | Nul |

### Phase C — Enrichissement (non urgent)

| Action | Entrées concernées | Priorité |
|--------|-------------------|----------|
| Ajouter les formules chimiques manquantes | 1 526 molécules | Basse |
| Lier les 266 recettes restantes sans ingrédients | 266 recettes | Haute long terme |
| Ajouter champ `is_concentrate` pour les formulations diluées | 15 recettes | Basse |

---

## 5. RÉSUMÉ EXÉCUTIF

La base PERFUMUM est **scientifiquement solide dans l'ensemble**. Les données ajoutées lors des sessions récentes (Batches 1-10, GC-MS, généalogies) sont de bonne qualité. Les problèmes identifiés sont principalement des **artefacts d'import** (CSV bruts, références bibliographiques mal filtrées) et des **doublons de nommage** (conventions alpha/β différentes entre sessions).

**Points positifs :**
- Aucun CAS number invalide détecté
- Aucun poids moléculaire hors-norme
- Aucune propriété thérapeutique fantaisiste (termes non-scientifiques)
- Aucun ingrédient de recette lié à une molécule inexistante
- Aucun doublon d'ingrédient dans une même recette

**Points à corriger en priorité :**
1. ~25 entrées molécules à supprimer (bibliographie + CSV bruts)
2. ~5 paires de doublons certains à fusionner
3. 20 formules chimiques à corriger (IUPAC → formule brute)
4. 20 recettes avec texte ingrédients à parser en liaisons formelles

---

*Rapport généré automatiquement par `audit-quality.mjs` + `audit-recettes.cjs` — PERFUMUM Research Platform*
