# 📚 DONNÉES & SOURCES - Phase 2

<aside>
💡 **Vue d'ensemble**
Cette page recense toutes les sources de données, bases botaniques, et ressources documentaires pour alimenter PERFUMUM Phase 2.

</aside>

## 🌍 Bases de données botaniques internationales

### 🔬 Nomenclature & Taxonomie

- **POWO - Plants of the World Online (Kew Gardens)**
    
    **URL :** https://powo.science.kew.org/
    
    **Type :** Base de référence mondiale pour la nomenclature
    
    **Utilité :**
    
    - Validation des noms scientifiques
    - Synonymes et anciennes appellations
    - Distribution géographique
    - Statut taxonomique officiel
    
    **API :** Disponible (requiert inscription gratuite)
    
    **Format :** JSON, CSV export possible
    
    ```jsx
    // Exemple requête POWO API
    fetch('https://api.kew.org/powo/taxon/urn:lsid:ipni.org:names:796683-1')
      .then(res => res.json())
      .then(data => console.log(data));
    ```
    
- **IPNI - International Plant Names Index**
    
    **URL :** https://www.ipni.org/
    
    **Type :** Index exhaustif des noms de plantes publiés
    
    **Utilité :**
    
    - Historique des publications botaniques
    - Auteurs des descriptions originales
    - Dates de publication
    
    **Format :** CSV bulk download disponible
    
- **The Plant List (Archive)**
    
    **URL :** http://www.theplantlist.org/
    
    **Type :** Liste collaborative (non maintenue depuis 2013, mais historiquement importante)
    
    **Utilité :** Données historiques pour espèces anciennes
    

### 🔴 Conservation & Statuts

- **IUCN Red List**
    
    **URL :** https://www.iucnredlist.org/
    
    **Type :** Liste rouge mondiale des espèces menacées
    
    **Utilité :**
    
    - Statuts de conservation (EX, CR, EN, VU, NT, LC, DD)
    - Populations estimées
    - Menaces identifiées
    - Actions de conservation en cours
    
    **API :** https://apiv3.iucnredlist.org/ (token gratuit)
    
    ```bash
    # Exemple requête IUCN API
    curl "https://apiv3.iucnredlist.org/api/v3/species/Rosa%20damascena?token=YOUR_TOKEN"
    ```
    
- **CITES - Convention on International Trade**
    
    **URL :** https://cites.org/eng/app/appendices.php
    
    **Type :** Réglementation commerce international
    
    **Utilité :**
    
    - Annexes I, II, III (niveaux de protection)
    - Restrictions commerciales
    - Quotas d'exportation
    
    **Format :** PDF officiel + base Species+ (JSON disponible)
    
- **BGCI - Botanic Gardens Conservation International**
    
    **URL :** https://www.bgci.org/resources/bgci-databases/
    
    **Type :** Base des plantes en conservation ex-situ
    
    **Utilité :**
    
    - Jardins botaniques conservant les espèces
    - Programmes de réintroduction
    - Coordonnées des conservateurs

## 🌸 Bases de données olfactives

- **Pherobase**
    
    **URL :** https://www.pherobase.com/
    
    **Type :** Base de données de composés volatils
    
    **Utilité :**
    
    - Structures chimiques des molécules odorantes
    - Profils chromatographiques
    - Indices de rétention
- **The Good Scents Company**
    
    **URL :** http://www.thegoodscentscompany.com/
    
    **Type :** Encyclopédie de parfumerie
    
    **Utilité :**
    
    - Descripteurs olfactifs standardisés
    - Composition des huiles essentielles
    - Données organoleptiques
    
    **Format :** Web scraping possible (respecter robots.txt)
    
- **Volatile Compounds in Food (VCF)**
    
    **URL :** https://www.vcf-online.nl/
    
    **Type :** Base néerlandaise de composés volatils
    
    **Utilité :** Données sur composés aromatiques naturels
    

## 📖 Sources académiques & littéraires

### 🎓 Publications scientifiques

- **Google Scholar**
    
    **URL :** https://scholar.google.com/
    
    **Mots-clés recommandés :**
    
    ```
    "essential oil composition" + [species name]
    "olfactory profile" + [species name]
    "extinct varieties" + [genus]
    "historical perfumery" + [plant]
    "phytochemical analysis" + [species]
    ```
    
- **PubMed Central**
    
    **URL :** https://www.ncbi.nlm.nih.gov/pmc/
    
    **Utilité :** Articles biomédicaux en accès libre
    
    **Focus :** Propriétés thérapeutiques, études chimiques
    
- **ResearchGate**
    
    **URL :** https://www.researchgate.net/
    
    **Utilité :** Contacter directement les chercheurs spécialistes
    

### 📚 Ouvrages de référence (domaine public)

- **Biodiversity Heritage Library (BHL)**
    
    **URL :** https://www.biodiversitylibrary.org/
    
    **Type :** Bibliothèque numérique de botanique historique
    
    **Contenus :**
    
    - Flores anciennes (XVIIe-XIXe siècles)
    - Traités de parfumerie historiques
    - Illustrations botaniques libres de droits
    
    **Format :** PDF, JPEG haute résolution
    
    **API :** Disponible pour recherche automatisée
    
- **Internet Archive**
    
    **URL :** https://archive.org/
    
    **Collections pertinentes :**
    
    - Traités de parfumerie (1800-1950)
    - Catalogues de pépiniéristes anciens
    - Journaux de voyages botaniques
- **Gallica (BnF)**
    
    **URL :** https://gallica.bnf.fr/
    
    **Type :** Bibliothèque numérique française
    
    **Ressources :**
    
    - Traités français de parfumerie
    - Histoire de Grasse et région grassoise
    - Commerce colonial des épices/plantes

## 🖼️ Sources d'images libres de droits

- **Wikimedia Commons**
    
    **URL :** https://commons.wikimedia.org/
    
    **Licences :** CC0, CC-BY, CC-BY-SA
    
    **Qualité :** Variable, vérifier résolution
    
- **iNaturalist**
    
    **URL :** https://www.inaturalist.org/
    
    **Type :** Photos naturalistes géolocalisées
    
    **Licence :** Majoritairement CC-BY-NC
    
    **Utilité :** Photos in situ, variations géographiques
    
    **API :** https://api.inaturalist.org/v1/docs/
    
- **Botanical Illustration Collections**
    
    **Missouri Botanical Garden :** https://www.botanicalillustrations.org/
    
    **Kew Gardens :** Images haute résolution (demande requise)
    
    **Utilité :** Illustrations scientifiques précises
    

## 🏛️ Sources historiques & patrimoniales

- **Musée International de la Parfumerie (Grasse)**
    
    **URL :** https://www.museesdegrasse.com/
    
    **Ressources :**
    
    - Archives historiques de parfumeurs grassois
    - Collections botaniques patrimoniales
    - Formules anciennes (accès sur demande)
    
    **Contact :** documentation@museesdegrasse.com
    
- **Osmothèque (Versailles)**
    
    **URL :** https://osmotheque.fr/
    
    **Type :** Conservatoire international des parfums
    
    **Utilité :** Reconstitutions de fragrances disparues
    
- **Archives coloniales**
    
    **ANOM (Aix-en-Provence) :** Commerce colonial des plantes à parfum
    
    **Kew Economic Botany Collection :** Spécimens historiques avec annotations
    

## 🗄️ Datasets structurés à importer

### 📊 CSV/JSON prêts à l'emploi

- **TRY Plant Trait Database**
    
    **URL :** https://www.try-db.org/
    
    **Type :** Traits fonctionnels de plantes
    
    **Utilité :** Données morphologiques standardisées
    
    **Accès :** Requiert inscription (gratuit pour recherche)
    
- **GBIF - Global Biodiversity Information Facility**
    
    **URL :** https://www.gbif.org/
    
    **Type :** Occurrences géolocalisées d'espèces
    
    **API :** https://www.gbif.org/developer/summary
    
    **Format :** JSON, CSV, Darwin Core
    
    ```bash
    # Exemple: télécharger occurrences Rosa damascena
    curl "https://api.gbif.org/v1/occurrence/search?scientificName=Rosa%20damascena&limit=1000" > rosa_occurrences.json
    ```
    
- **EOL - Encyclopedia of Life**
    
    **URL :** https://eol.org/
    
    **API :** Disponible (v3)
    
    **Utilité :** Données agrégées multi-sources
    

## 👥 Experts & réseaux à contacter

### 🔬 Institutions de recherche

- **ISIPCA (Institut Supérieur International du Parfum) :** [contact@isipca.fr](mailto:contact@isipca.fr)
- **CNRS - Laboratoires de chimie des substances naturelles**
- **Jardin Botanique de Lyon :** Conservation espèces parfumées rares
- **Royal Botanic Gardens Kew :** Millennium Seed Bank

### 🌿 Associations spécialisées

- **Société Française des Roses :** Experts roses anciennes
- **CPPARM (Conservatoire du Patrimoine du Pays d'Arles) :** Plantes aromatiques méditerranéennes
- **Conservatoire Botanique National Méditerranéen**

## 🛠️ Outils d'extraction & traitement

### 💻 Scripts & bibliothèques

- **Bibliothèques Python recommandées**
    
    ```python
    # Installation
    pip install pandas requests beautifulsoup4 biopython
    
    # Exemple: scraper POWO
    import requests
    from bs4 import BeautifulSoup
    
    def get_species_data(scientific_name):
        url = f"https://powo.science.kew.org/taxon/{scientific_name}"
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        # Parser les données...
        return data
    ```
    
- **APIs REST clients**
    
    ```jsx
    // tRPC client pour importer depuis APIs externes
    export const externalDataRouter = createTRPCRouter({
      importFromPOWO: protectedProcedure
        .input(z.object({ scientificName: z.string() }))
        .mutation(async ({ input }) => {
          const response = await fetch(`https://api.kew.org/powo/...`);
          const data = await response.json();
          // Transformer et sauvegarder...
        }),
    });
    ```
    

## 📋 Template de référencement de source

<aside>

**Format standardisé :** À utiliser dans le champ `source` de chaque espèce

</aside>

```json
{
  "nomenclature": {
    "source": "POWO",
    "url": "https://powo.science.kew.org/taxon/...",
    "accessed": "2026-01-06",
    "taxonomic_status": "Accepted"
  },
  "conservation_status": {
    "source": "IUCN Red List",
    "url": "https://www.iucnredlist.org/species/...",
    "assessment_year": 2024,
    "status": "EN"
  },
  "olfactive_profile": {
    "source": "Arctander, S. (1960). Perfume and Flavor Materials of Natural Origin",
    "page": 245,
    "notes": "Description organoleptique détaillée"
  },
  "chemical_analysis": {
    "source": "Journal of Essential Oil Research, 2023",
    "doi": "10.1080/10412905.2023.xxxxx",
    "method": "GC-MS"
  },
  "historical_data": {
    "source": "Traité de la distillation des eaux odoriférantes (1693)",
    "archive": "Gallica BnF",
    "url": "https://gallica.bnf.fr/ark:/..."
  },
  "images": [
    {
      "url": "https://commons.wikimedia.org/...",
      "license": "CC-BY-SA-4.0",
      "author": "Botanical Artist Name",
      "year": 2020
    }
  ]
}
```

## 📅 Planning de collecte de données

<aside>

**Stratégie d'import progressif**

</aside>

| **Jours 1-2** | Import nomenclature (POWO + IPNI) | 200 espèces |
| --- | --- | --- |
| **Jours 3-4** | Statuts conservation (IUCN + CITES) | 200 espèces |
| **Jours 5-6** | Profils olfactifs (littérature + bases) | 150 profils |
| **Jours 7-8** | Données chimiques (publications) | 100 analyses |
| **Jours 9-10** | Images + marqueurs historiques | 400 images |

---

<aside>

**✅ CHECKLIST VALIDATION DES SOURCES**

- [ ]  Vérifier licence/copyright des images
- [ ]  Citer tous les auteurs originaux
- [ ]  Documenter méthodes d'extraction des données
- [ ]  Créer fichier `SOURCES.md` dans le repo
- [ ]  Ajouter disclaimer sur page "À propos"
- [ ]  Contacter institutions pour partenariats potentiels
</aside>