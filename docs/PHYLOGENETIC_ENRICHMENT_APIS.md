# 🌳 APIs et Outils pour Enrichir les Données Phylogénétiques — PERFUMUM

## 📊 Résumé Exécutif

Ce document recense tous les APIs et outils gratuits/open-source pour enrichir massivement les données phylogénétiques du projet PERFUMUM avec :

- **Taxonomie complète** (Nicotiana, Cannabis, Rosa, etc.)

- **Généalogies** (parents, hybrides, clones)

- **Profils moléculaires** (alcaloïdes, terpènes, cannabinoïdes)

- **Distributions géographiques** (pays, régions, terroirs)

- **Images botaniques** (feuilles, fleurs, fruits)

- **Statuts de conservation** (IUCN Red List)

---

## 🔍 TIER 1 : APIs Taxonomiques Prioritaires

### 1. **Wikidata SPARQL API** ⭐⭐⭐⭐⭐

**Priorité : MAXIMALE** — Déjà intégré dans PERFUMUM

**URL** : `https://query.wikidata.org/sparql`

**Couverture** :

- ✅ Toutes les espèces de plantes (Nicotiana, Cannabis, Rosa )

- ✅ Hybrides et cultivars

- ✅ Statuts IUCN

- ✅ Distribution géographique

- ✅ Images Wikimedia Commons

- ✅ Liens vers Europeana

**Requêtes SPARQL utiles** :

```
# Toutes les variétés Nicotiana avec parents
SELECT ?species ?speciesLabel ?parent ?parentLabel ?hybrid WHERE {
  ?species wdt:P171 wd:Q155463 .  # Nicotiana genus
  OPTIONAL { ?species wdt:P171 ?parent . }
  OPTIONAL { ?species wdt:P1403 ?hybrid . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
}
LIMIT 500
```

**Données accessibles** :

- Noms scientifiques et communs

- Années de découverte

- Obtenteurs/hybrideurs

- Statuts (cultivar, hybrid, landrace, wild)

- Chromosomes (2n)

- Distribution (pays, régions)

- Images morphologiques

**Coût** : Gratuit, pas d'authentification

---

### 2. **GBIF Species API** ⭐⭐⭐⭐

**Priorité : TRÈS HAUTE** — Pour occurrences et distribution

**URL** : `https://api.gbif.org/v1/species/search`

**Couverture** :

- ✅ 2+ millions d'espèces

- ✅ Occurrences géographiques (millions de points )

- ✅ Liens vers herbiers numérisés

- ✅ Données d'occurrence avec coordonnées GPS

**Endpoints clés** :

```bash
# Rechercher Nicotiana tabacum
curl "https://api.gbif.org/v1/species/search?q=Nicotiana%20tabacum"

# Occurrences de Nicotiana tabacum
curl "https://api.gbif.org/v1/occurrence/search?scientificName=Nicotiana%20tabacum&limit=1000"

# Taxonomie complète
curl "https://api.gbif.org/v1/species/match?name=Nicotiana%20tabacum"
```

**Données accessibles** :

- Taxonomie standardisée

- Occurrences géographiques (lat/lon )

- Images d'herbiers

- Liens vers musées et herbiers

- Dates de collecte

- Collecteurs

**Coût** : Gratuit, pas d'authentification

---

### 3. **Tropicos Web Services API** ⭐⭐⭐⭐

**Priorité : TRÈS HAUTE** — Missouri Botanical Garden

**URL** : `https://services.tropicos.org/`

**Couverture** :

- ✅ 1.33M noms scientifiques

- ✅ 4.87M spécimens

- ✅ 685K images botaniques

- ✅ Synonymes et noms acceptés

- ✅ Distribution par pays

- ✅ Références bibliographiques

**Endpoints clés** :

```bash
# Rechercher Nicotiana
curl "https://services.tropicos.org/Name/Search?name=Nicotiana&type=wildcard&format=json&apikey=YOUR_KEY"

# Détails d'une espèce
curl "https://services.tropicos.org/Name/12345/Data?format=json&apikey=YOUR_KEY"

# Synonymes
curl "https://services.tropicos.org/Name/12345/Synonyms?format=json&apikey=YOUR_KEY"

# Distribution
curl "https://services.tropicos.org/Name/12345/Distributions?format=json&apikey=YOUR_KEY"

# Images
curl "https://services.tropicos.org/Name/12345/Images?format=json&apikey=YOUR_KEY"
```

**Données accessibles** :

- Noms acceptés et synonymes

- Auteurs et dates de publication

- Distribution mondiale

- Images haute qualité (685K )

- Références scientifiques

- Spécimens d'herbiers

**Coût** : Gratuit (clé API requise - demande simple)

---

### 4. **IPNI (International Plant Names Index)** ⭐⭐⭐

**Priorité : HAUTE** — Données nomenclaturales

**URL** : `https://www.ipni.org/`

**Couverture** :

- ✅ Nomenclature complète (orthographe, auteurs, dates )

- ✅ Types nomenclaturaux

- ✅ Première publication

- ✅ Liens vers Biodiversity Heritage Library

**Accès** :

- Interface web (recherche manuelle)

- Export CSV/XML

- Liens vers Plants of the World Online (POWO)

**Données accessibles** :

- Noms scientifiques standardisés

- Auteurs et dates de publication

- Types nomenclaturaux

- Protologues (publications originales)

**Coût** : Gratuit

---

### 5. **Plants of the World Online (POWO)** ⭐⭐⭐⭐

**Priorité : TRÈS HAUTE** — Kew Gardens

**URL** : `https://powo.science.kew.org/`

**Couverture** :

- ✅ 1,445,000 noms de plantes

- ✅ 530,400 descriptions détaillées

- ✅ 509,900 images

- ✅ Taxonomie complète et acceptée

**Accès** :

- Interface web (recherche )

- Export de données

- Liens vers IPNI, Tropicos, Wikidata

**Données accessibles** :

- Taxonomie acceptée

- Descriptions morphologiques

- Distribution géographique

- Images botaniques

- Liens vers autres bases

**Coût** : Gratuit

---

### 6. **NCBI Taxonomy Database** ⭐⭐⭐

**Priorité : MOYENNE** — Pour phylogénie moléculaire

**URL** : `https://www.ncbi.nlm.nih.gov/taxonomy`

**Couverture** :

- ✅ Tous les organismes séquencés

- ✅ Phylogénie moléculaire

- ✅ Liens vers GenBank

**Endpoints** :

```bash
# Rechercher Nicotiana
curl "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=taxonomy&term=Nicotiana&rettype=json"

# Détails taxonomiques
curl "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=taxonomy&id=4075&rettype=json"
```

**Données accessibles** :

- Taxonomie NCBI

- Liens vers séquences génomiques

- Phylogénie moléculaire

- Noms scientifiques standardisés

**Coût** : Gratuit

---

## 🧬 TIER 2 : APIs Moléculaires & Chimiques

### 7. **LOTUS (Natural Products Online )** ⭐⭐⭐⭐

**Priorité : TRÈS HAUTE** — 220K+ paires espèce-molécule

**URL** : `https://lotus.naturalproducts.net/`

**Couverture** :

- ✅ 220,000+ paires espèce-molécule

- ✅ Alcaloïdes, terpènes, cannabinoïdes

- ✅ Structures chimiques (InChI, SMILES )

- ✅ Références scientifiques

**REST API** :

```bash
# Rechercher molécules de Nicotiana
curl "https://lotus.naturalproducts.net/api/v1/organisms?organism_name=Nicotiana"

# Rechercher molécules par nom
curl "https://lotus.naturalproducts.net/api/v1/compounds?compound_name=nicotine"

# Rechercher par structure
curl "https://lotus.naturalproducts.net/api/v1/compounds?inchi=InChI=1S/..."
```

**Données accessibles** :

- Molécules par espèce

- Structures chimiques

- Références scientifiques

- Données de masse moléculaire

- Propriétés biologiques

**Coût** : Gratuit, pas d'authentification

---

### 8. **COCONUT (Collection of Open Natural Products )** ⭐⭐⭐⭐

**Priorité : TRÈS HAUTE** — 400K+ produits naturels

**URL** : `https://coconut.naturalproducts.net/`

**Couverture** :

- ✅ 400,000+ produits naturels

- ✅ Structures chimiques validées

- ✅ Liens vers sources biologiques

- ✅ Propriétés moléculaires

**REST API** :

```bash
# Rechercher par nom
curl "https://coconut.naturalproducts.net/api/v1/compounds?search=nicotine"

# Rechercher par InChI
curl "https://coconut.naturalproducts.net/api/v1/compounds?inchi=InChI=1S/..."

# Rechercher par source biologique
curl "https://coconut.naturalproducts.net/api/v1/compounds?organism=Nicotiana"
```

**Données accessibles** :

- Structures chimiques

- Propriétés moléculaires

- Sources biologiques

- Références scientifiques

- Données de masse

**Coût** : Gratuit, pas d'authentification

---

### 9. **PubChem API** ⭐⭐⭐

**Priorité : MOYENNE** — Pour validation chimique

**URL** : `https://pubchem.ncbi.nlm.nih.gov/`

**Couverture** :

- ✅ 120M+ composés chimiques

- ✅ Propriétés physicochimiques

- ✅ Données biologiques

- ✅ Toxicité et sécurité

**REST API** :

```bash
# Rechercher par nom
curl "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/nicotine/JSON"

# Rechercher par InChI
curl "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/inchi/JSON?inchi=InChI=1S/..."

# Propriétés
curl "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/942/property/MolecularWeight/JSON"
```

**Données accessibles** :

- Structures chimiques

- Propriétés moléculaires

- Données biologiques

- Toxicité

- Synonymes

**Coût** : Gratuit, pas d'authentification

---

## 🖼️ TIER 3 : APIs Images & Médias

### 10. **Wikimedia Commons API** ⭐⭐⭐⭐

**Priorité : TRÈS HAUTE** — 483+ images botaniques

**URL** : `https://commons.wikimedia.org/w/api.php`

**Couverture** :

- ✅ 483+ images de plantes

- ✅ Feuilles, fleurs, fruits

- ✅ Métadonnées complètes

- ✅ Licences Creative Commons

**API** :

```bash
# Rechercher images Nicotiana
curl "https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=Nicotiana&format=json"

# Obtenir fichier
curl "https://commons.wikimedia.org/w/api.php?action=query&titles=File:Nicotiana_tabacum.jpg&prop=imageinfo&iiprop=url&format=json"
```

**Données accessibles** :

- Images haute résolution

- Métadonnées EXIF

- Licences

- Descriptions

- Catégories

**Coût** : Gratuit

---

### 11. **Europeana API** ⭐⭐⭐

**Priorité : MOYENNE** — Contexte culturel & historique

**URL** : `https://api.europeana.eu/`

**Couverture** :

- ✅ 50M+ objets culturels

- ✅ Herbiers numérisés

- ✅ Peintures botaniques

- ✅ Manuscrits historiques

**API** :

```bash
# Rechercher objets Nicotiana
curl "https://api.europeana.eu/record/v2/search.json?query=Nicotiana&wskey=YOUR_KEY"
```

**Données accessibles** :

- Images haute résolution

- Métadonnées complètes

- Provenance

- Droits d'auteur

- Contexte historique

**Coût** : Gratuit (clé API requise )

---

## 🔬 TIER 4 : APIs Génomiques & Phylogénétiques

### 12. **Phytozome API** ⭐⭐⭐

**Priorité : MOYENNE** — Génomes de plantes

**URL** : `https://phytozome-next.jgi.doe.gov/`

**Couverture** :

- ✅ 25+ génomes de plantes

- ✅ Annotations géniques

- ✅ Familles de gènes

- ✅ Phylogénie comparative

**Accès** :

- JGI Data Portal API

- Recherche web

- Téléchargement de données

**Données accessibles** :

- Séquences génomiques

- Annotations géniques

- Familles de gènes

- Phylogénie comparative

- Expression génique

**Coût** : Gratuit

---

### 13. **OneKP (1000 Plants Project )** ⭐⭐⭐

**Priorité : MOYENNE** — Transcriptomes de 1173 espèces

**URL** : `https://db.cngb.org/onekp/`

**Couverture** :

- ✅ 1,173 espèces de plantes

- ✅ Données transcriptomiques

- ✅ Phylogénie moléculaire

- ✅ Diversité génétique

**Accès** :

- BLAST search

- Téléchargement de données

- Visualisation phylogénétique

**Données accessibles** :

- Transcriptomes

- Séquences géniques

- Phylogénie

- Diversité génétique

**Coût** : Gratuit

---

## 📋 TIER 5 : APIs de Conservation & Statuts

### 14. **IUCN Red List API** ⭐⭐⭐

**Priorité : HAUTE** — Statuts de conservation

**URL** : `https://www.iucnredlist.org/`

**Couverture** :

- ✅ 150,000+ espèces

- ✅ Statuts IUCN (CR, EN, VU, etc. )

- ✅ Menaces et conservation

- ✅ Distribution

**API** :

```bash
# Rechercher Nicotiana tabacum
curl "https://apiv3.iucnredlist.org/api/v3/advanced_search?criteria=taxonomy(genus:Nicotiana )&token=YOUR_TOKEN"
```

**Données accessibles** :

- Statuts IUCN

- Menaces

- Actions de conservation

- Distribution

- Population trends

**Coût** : Gratuit (token requise - demande simple)

---

## 🎯 IMPLÉMENTATION RECOMMANDÉE POUR PERFUMUM

### Phase 1 : Enrichissement Taxonomique (Semaine 1-2)

```python
# Pseudo-code pour enrichir Nicotiana
from wikidata_api import WikidataAPI
from gbif_api import GBIFAPI
from tropicos_api import TropicosAPI

# 1. Récupérer toutes les variétés Nicotiana depuis Wikidata
nicotiana_varieties = WikidataAPI.query_sparql("""
  SELECT ?species ?speciesLabel ?parent ?year WHERE {
    ?species wdt:P171 wd:Q155463 .  # Nicotiana
    OPTIONAL { ?species wdt:P171 ?parent . }
    OPTIONAL { ?species wdt:P580 ?year . }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "en" . }
  }
""")

# 2. Pour chaque variété, récupérer les occurrences GBIF
for variety in nicotiana_varieties:
    occurrences = GBIFAPI.get_occurrences(variety['scientificName'])
    # Stocker lat/lon pour cartographie

# 3. Récupérer images et synonymes depuis Tropicos
for variety in nicotiana_varieties:
    tropicos_data = TropicosAPI.search(variety['scientificName'])
    # Stocker images, synonymes, distribution
```

### Phase 2 : Enrichissement Moléculaire (Semaine 2-3)

```python
# Pseudo-code pour enrichir profils moléculaires
from lotus_api import LOTUSAPI
from coconut_api import COCONUTAPI

# 1. Récupérer molécules par espèce depuis LOTUS
for variety in nicotiana_varieties:
    molecules = LOTUSAPI.get_molecules_by_organism(variety['scientificName'])
    # Stocker alcaloïdes, terpènes, etc.

# 2. Enrichir avec structures chimiques depuis COCONUT
for molecule in molecules:
    coconut_data = COCONUTAPI.search_by_name(molecule['name'])
    # Stocker InChI, SMILES, propriétés
```

### Phase 3 : Enrichissement d'Images (Semaine 3-4)

```python
# Pseudo-code pour enrichir images
from wikimedia_api import WikimediaAPI
from europeana_api import EuropeanaAPI

# 1. Récupérer images Wikimedia
for variety in nicotiana_varieties:
    images = WikimediaAPI.search(variety['scientificName'])
    # Télécharger et stocker dans S3

# 2. Récupérer objets culturels Europeana
for variety in nicotiana_varieties:
    cultural_objects = EuropeanaAPI.search(variety['scientificName'])
    # Stocker herbiers numérisés, peintures, etc.
```

---

## 📊 Tableau Comparatif des APIs

| API | Couverture | Taxonomie | Molécules | Images | Géographie | Coût | Priorité |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Wikidata** | Excellente | ✅✅✅ | ✅ | ✅ | ✅✅✅ | Gratuit | 🔴 MAX |
| **GBIF** | Excellente | ✅✅✅ | ❌ | ✅ | ✅✅✅ | Gratuit | 🔴 MAX |
| **Tropicos** | Excellente | ✅✅✅ | ❌ | ✅✅ | ✅✅ | Gratuit | 🔴 MAX |
| **LOTUS** | Très bonne | ✅ | ✅✅✅ | ❌ | ❌ | Gratuit | 🔴 MAX |
| **COCONUT** | Très bonne | ✅ | ✅✅✅ | ❌ | ❌ | Gratuit | 🔴 MAX |
| **POWO** | Excellente | ✅✅✅ | ❌ | ✅ | ✅✅ | Gratuit | 🟠 HAUTE |
| **Wikimedia** | Bonne | ❌ | ❌ | ✅✅✅ | ❌ | Gratuit | 🟠 HAUTE |
| **IUCN** | Bonne | ✅ | ❌ | ❌ | ✅ | Gratuit | 🟠 HAUTE |
| **NCBI Taxonomy** | Excellente | ✅✅✅ | ❌ | ❌ | ❌ | Gratuit | 🟡 MOYENNE |
| **Phytozome** | Bonne | ✅ | ❌ | ❌ | ❌ | Gratuit | 🟡 MOYENNE |
| **OneKP** | Très bonne | ✅ | ❌ | ❌ | ❌ | Gratuit | 🟡 MOYENNE |
| **Europeana** | Excellente | ❌ | ❌ | ✅✅ | ✅ | Gratuit | 🟡 MOYENNE |

---

## 🚀 Prochaines Étapes pour PERFUMUM

### Étape 1 : Créer Admin Pages pour chaque API

- `/admin/wikidata-enrichment` ✅ (déjà créé)

- `/admin/gbif-enrichment` (à créer)

- `/admin/tropicos-enrichment` (à créer)

- `/admin/lotus-enrichment` (à créer)

- `/admin/coconut-enrichment` (à créer)

### Étape 2 : Implémenter tRPC Routers

- `trpc.gbif.searchSpecies`

- `trpc.gbif.getOccurrences`

- `trpc.tropicos.searchName`

- `trpc.tropicos.getImages`

- `trpc.lotus.getMoleculesByOrganism`

- `trpc.coconut.searchCompound`

### Étape 3 : Batch Import Procedures

- Importer 500+ variétés Nicotiana

- Importer 300+ variétés Cannabis

- Importer 200+ variétés Rosa

- Enrichir avec 10,000+ molécules

- Récupérer 5,000+ images botaniques

---

## 📚 Ressources Additionnelles

- **Wikidata Query Service** : [https://query.wikidata.org/](https://query.wikidata.org/)

- **GBIF Data Portal** : [https://www.gbif.org/](https://www.gbif.org/)

- **Tropicos Documentation** : [https://www.tropicos.org/](https://www.tropicos.org/)

- **LOTUS Documentation** : [https://lotus.naturalproducts.net/](https://lotus.naturalproducts.net/)

- **COCONUT Documentation** : [https://coconut.naturalproducts.net/](https://coconut.naturalproducts.net/)

---

**Dernière mise à jour** : 9 avril 2026**Auteur** : PERFUMUM Research Team**Statut** : Prêt pour implémentation

