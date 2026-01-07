# PERFUMUM — Veille scientifique (focus génomique) : Cannabis & Tabac
*Généré le 2026-01-07 — pack “références + modules contenus”*

> **Scope :** uniquement recherche / données / génomique / biochimie des métabolites (cannabinoïdes, terpènes, alcaloïdes).  
> **Note :** ce document ne donne pas d’instructions de culture/production ; il sert à structurer des contenus scientifiques et des datasets pour ton site.

---

## Axe 1 — Pangenomes, haplotypes & “mosaïques sauvages” (diversité réelle)
**Pourquoi c’est niche/innovant :**
- On passe du *génome-référence unique* à une **bibliothèque de génomes** (pangenome) qui décrit : duplications, inversions, CNV, introgressions.
- Pour PERFUMUM : c’est la base d’un module “**généalogie aromatique**” (chemins génétiques qui façonnent odorants et alcaloïdes).

### Questions de recherche à industrialiser en contenu
- Où sont les **clusters** cannabinoïdes / terpènes / alcaloïdes ? (structure + CNV)
- Quels gènes “signature” distinguent **landraces** vs cultivars récents ?
- Peut-on associer *provenance* (région) ↔ *signature génétique* ↔ *signature moléculaire* ?

### Références pivot
- **Cannabis pangenome / domestication :** Domesticated cannabinoid synthases amid a wild mosaic cannabis pangenome (DOI 10.1038/s41586-025-09065-0)
- **Haplotype + SV + landrace colombien :** Trio-binning approach for genome assembly reveals extensive structural variation between two Cannabis cultivars: Punto Rojo and Cherry Pie
- **Tabac polyploïde + GeneBank + GWAS :** The genome and GeneBank genomics of allotetraploid Nicotiana tabacum provide insights into genome evolution and complex trait regulation
- **Assemblies tabac + progeniteurs :** Chromosome-level genome assemblies of Nicotiana tabacum, Nicotiana sylvestris, and Nicotiana tomentosiformis

### Contenus “site-ready” (modules)
- **Pangenome Explorer (Cannabis)** : gènes clés (THCAS/CBDAS/PT/TPS) + CNV + carte des haplotypes.
- **Polyploid Map (Tabac)** : subgénomes S/T, réarrangements, biais d’expression.
- **Landrace dossiers** : pages “Punto Rojo / cultivars locaux” = provenance + génomique + chimie + récit ethnobotanique.

---

## Axe 2 — Voies biosynthétiques (cannabinoïdes/terpènes/nicotine) + multi-omics
**Pourquoi c’est niche :**
- On connecte **gènes → enzymes → métabolites → perception olfactive**.
- Énorme potentiel “PERFUMUM” : rendre lisible une voie complexe via cartes, graphes et timelines.

### Questions de recherche à convertir en datasets
- Quelle architecture des familles **TPS** (terpene synthases) explique les bouquets ?
- Quels régulateurs (JA/ERF/MYC2…) orchestrent nicotine/cannabinoïdes ?
- Quelle part est “génétique” vs “épigénétique” (trichomes) ?

### Références pivot
- **TPS Cannabis :** Terpene Synthases and Terpene Variation in Cannabis sativa
- **Trichomes = biofactories :** Building a biofactory: Constructing glandular trichomes in Cannabis sativa
- **Épigénome trichomes :** Characterization of the Cannabis sativa glandular trichome epigenome and transcriptome reveals epigenomic regulation of specialized metabolism
- **Évolution voie nicotine (wild Nicotiana) :** Wild tobacco genomes reveal the evolution of nicotine biosynthesis
- **Revue nicotine (régulation) :** Genetic regulation and manipulation of nicotine biosynthesis in tobacco: strategies to eliminate addictive alkaloids
- **Single-cell scent (Nicotiana) :** Single-cell RNA-sequencing of Nicotiana attenuata corolla cells reveals the biosynthetic pathway of a floral scent

### Contenus “site-ready” (modules)
- **Pathway Map** (interactive) : enzymes + gènes + métabolites + renvois KEGG/Ensembl.
- **Expression Atlas** : trichomes/feuille/racine (tabac + cannabis) + filtres par gène.
- **Epigenome Layer** : overlays methylation/accessible chromatin vs production métabolites (Cannabis).

---

## Axe 3 — Provenance, taxonomie, “forensic genomics” & conservation
**Pourquoi c’est niche :**
- Le génome comme **preuve** (origine, domestication, routes) + comme **outil de conservation** (préserver chimiotypes).
- Pour tes “variétés fantômes” : c’est le bras scientifique qui permet de documenter l’invisible.

### Questions de recherche à convertir en contenu
- Quels marqueurs permettent d’identifier une **signature régionale** ?
- Peut-on relier : *variété / récit* ↔ *génome* ↔ *profil olfactif* ?
- Quelles bases pour une **banque de gènes** olfactive (ex situ) “PERFUMUM” ?

### Références pivot
- **Domestication / resequencing :** Large-scale whole-genome resequencing unravels the domestication history of Cannabis sativa
- **Provenance / forensic :** Genomic Evidence That Governmentally Produced Cannabis sativa Plants Distinctly Differ from Wild/Local Accessions
- **Taxonomie par génomique :** Genomics-based taxonomy to clarify cannabis classification
- **Atlas tabac (tissues) :** A transcriptomic profiling across tissues, developmental stages, and types of Nicotiana tabacum
- **Préprint wild tobaccos (à surveiller) :** Chromosome-level genome assemblies of Nicotiana attenuata and related wild tobaccos (preprint)

### Contenus “site-ready” (modules)
- **GeneBank / Herbarium hooks** : pages espèce/cultivar, lien NCBI/SGN/Ensembl, DOI, métadonnées.
- **Provenance cards** : “marqueurs + carte + récit” (Colombie / Caraïbes / Afrique).
- **Conservation briefs** : fiches espèces menacées + plan d’échantillonnage non destructif (conceptuel).

---

## Portails & bases de données (à intégrer en liens / API)
- NCBI Datasets – Cannabis sativa genome (CBDRx/cs10 reference)
- Sol Genomics Network – Nicotiana attenuata genome portal
- Nicotiana attenuata Data Hub (NaDH) – genomic / transcriptomic / metabolomic data
- Ensembl Plants – Nicotiana attenuata annotation portal
- KEGG GENOME – Nicotiana attenuata

---

## Dataset seed (minimal) — “reference_items”
> Utilise le CSV fourni dans le pack ; il peut être importé dans ton admin comme table “references” puis relié à plantes/variétés/molécules.

Champs recommandés:
- id, type, title, authors, year, venue, doi, url, tags, notes

