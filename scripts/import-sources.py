#!/usr/bin/env python3
"""
Script d'extraction et d'import des sources bibliographiques pour PERFUMUM
Extrait les références des fichiers MD et génère un fichier JSON pour import
"""

import json
import re
from datetime import datetime

# Sources extraites des fichiers MD du projet
sources_to_import = [
    # === interactions-tabac-cannabis-parfum.md ===
    {
        "entry_key": "russo2011",
        "entry_type": "article",
        "title": "Taming THC: potential cannabis synergy and phytocannabinoid-terpenoid entourage effects",
        "authors": "Russo, E.B.",
        "year": 2011,
        "journal": "British Journal of Pharmacology",
        "volume": "163",
        "number": "7",
        "pages": "1344-1364",
        "doi": "10.1111/j.1476-5381.2011.01238.x",
        "research_domain": "pharmacologie",
        "abstract": "Étude fondamentale sur l'effet entourage entre cannabinoïdes et terpénoïdes du cannabis.",
        "keywords": '["cannabis", "terpènes", "effet entourage", "THC", "CBD", "synergie"]',
        "read_status": "lu"
    },
    {
        "entry_key": "marchini2014",
        "entry_type": "article",
        "title": "Multidimensional analysis of cannabis volatile constituents: Identification of 5,5-dimethyl-1-vinylbicyclo[2.1.1]hexane as a volatile marker of hashish",
        "authors": "Marchini, M. et al.",
        "year": 2014,
        "journal": "Journal of Chromatography A",
        "volume": "1370",
        "pages": "200-215",
        "doi": "10.1016/j.chroma.2014.10.037",
        "research_domain": "chimie_analytique",
        "abstract": "Découverte du hashishene comme marqueur volatil unique du hashish marocain.",
        "keywords": '["hashishene", "cannabis", "hash", "terpènes", "chromatographie"]',
        "read_status": "lu"
    },
    {
        "entry_key": "mookherjee1990",
        "entry_type": "article",
        "title": "Tobacco Constituents: Their Importance in Flavor and Fragrance Chemistry",
        "authors": "Mookherjee, B.D. & Wilson, R.A.",
        "year": 1990,
        "journal": "Perfumer & Flavorist",
        "volume": "15",
        "pages": "27-49",
        "research_domain": "parfumerie",
        "abstract": "Étude exhaustive des constituants aromatiques du tabac et leur importance en parfumerie.",
        "keywords": '["tabac", "parfumerie", "arômes", "terpènes", "damascones"]',
        "read_status": "lu"
    },
    {
        "entry_key": "booth2019",
        "entry_type": "article",
        "title": "Terpenes in Cannabis sativa – From plant genome to humans",
        "authors": "Booth, J.K. et al.",
        "year": 2019,
        "journal": "Plant Science",
        "volume": "284",
        "pages": "67-72",
        "doi": "10.1016/j.plantsci.2019.03.022",
        "research_domain": "botanique",
        "abstract": "Revue complète des terpènes du cannabis, de la génomique végétale aux effets humains.",
        "keywords": '["cannabis", "terpènes", "génomique", "biosynthèse"]',
        "read_status": "lu"
    },
    {
        "entry_key": "raz2023",
        "entry_type": "article",
        "title": "Selected cannabis terpenes synergize with THC to produce increased CB1 receptor activation",
        "authors": "Raz, N. et al.",
        "year": 2023,
        "journal": "Biochemical Pharmacology",
        "doi": "10.1016/j.bcp.2023.115548",
        "research_domain": "pharmacologie",
        "abstract": "Démonstration de la synergie entre terpènes du cannabis et THC sur les récepteurs CB1.",
        "keywords": '["cannabis", "terpènes", "THC", "CB1", "synergie"]',
        "read_status": "lu"
    },
    
    # === plantes-aromatiques-recherche.md ===
    {
        "entry_key": "vicuna2010",
        "entry_type": "article",
        "title": "Chemical composition of the essential oil of Lippia origanoides from Colombia",
        "authors": "Vicuña, G.C. et al.",
        "year": 2010,
        "journal": "Journal of Ethnopharmacology",
        "doi": "10.1016/j.jep.2009.10.004",
        "pmid": "19837152",
        "research_domain": "phytochimie",
        "abstract": "Analyse de la composition chimique de l'huile essentielle de Lippia origanoides de Colombie.",
        "keywords": '["Lippia origanoides", "Colombie", "huile essentielle", "thymol", "carvacrol"]',
        "read_status": "lu"
    },
    {
        "entry_key": "escobar2010",
        "entry_type": "article",
        "title": "Chemical composition and antiprotozoal activities of Colombian Lippia spp essential oils",
        "authors": "Escobar, P. et al.",
        "year": 2010,
        "journal": "Memórias do Instituto Oswaldo Cruz",
        "pmid": "20428679",
        "research_domain": "phytochimie",
        "abstract": "Composition chimique et activités antiprotozoaires des huiles essentielles de Lippia colombiennes.",
        "keywords": '["Lippia", "Colombie", "huile essentielle", "antiprotozoaire"]',
        "read_status": "lu"
    },
    {
        "entry_key": "oliveira2007",
        "entry_type": "article",
        "title": "Chemical composition of Lippia origanoides essential oil",
        "authors": "Oliveira, D.R. et al.",
        "year": 2007,
        "journal": "Food Chemistry",
        "doi": "10.1016/j.foodchem.2006.01.017",
        "research_domain": "phytochimie",
        "abstract": "Étude de la composition de l'huile essentielle de Lippia origanoides.",
        "keywords": '["Lippia origanoides", "huile essentielle", "composition chimique"]',
        "read_status": "lu"
    },
    {
        "entry_key": "regalado2011",
        "entry_type": "article",
        "title": "Chemical composition of Tagetes lucida essential oil",
        "authors": "Regalado, E.L. et al.",
        "year": 2011,
        "journal": "Journal of Essential Oil Research",
        "doi": "10.1080/10412905.2011.9700485",
        "research_domain": "phytochimie",
        "abstract": "Composition chimique de l'huile essentielle de Tagetes lucida.",
        "keywords": '["Tagetes lucida", "huile essentielle", "estragole", "anéthole"]',
        "read_status": "lu"
    },
    {
        "entry_key": "bicchi1997",
        "entry_type": "article",
        "title": "Essential oil composition of Tagetes lucida",
        "authors": "Bicchi, C. et al.",
        "year": 1997,
        "journal": "Flavour and Fragrance Journal",
        "doi": "10.1002/(SICI)1099-1026",
        "research_domain": "phytochimie",
        "abstract": "Analyse de la composition de l'huile essentielle de Tagetes lucida.",
        "keywords": '["Tagetes lucida", "huile essentielle", "composition"]',
        "read_status": "lu"
    },
    {
        "entry_key": "caballero2022",
        "entry_type": "article",
        "title": "Chemical composition and biological activities of Tagetes lucida",
        "authors": "Caballero-Gallardo, K. et al.",
        "year": 2022,
        "journal": "Molecules",
        "pmid": "35807352",
        "research_domain": "phytochimie",
        "abstract": "Composition chimique et activités biologiques de Tagetes lucida.",
        "keywords": '["Tagetes lucida", "activités biologiques", "composition chimique"]',
        "read_status": "lu"
    },
    {
        "entry_key": "bassole2003",
        "entry_type": "article",
        "title": "Essential oil composition of Lippia multiflora from Burkina Faso",
        "authors": "Bassolé, I.H.N. et al.",
        "year": 2003,
        "journal": "Phytochemistry",
        "doi": "10.1016/S0031-9422(02)00477-6",
        "research_domain": "phytochimie",
        "abstract": "Composition de l'huile essentielle de Lippia multiflora du Burkina Faso.",
        "keywords": '["Lippia multiflora", "Burkina Faso", "huile essentielle", "thymol"]',
        "read_status": "lu"
    },
    {
        "entry_key": "bassole2010",
        "entry_type": "article",
        "title": "Essential oils in combination and their antimicrobial properties",
        "authors": "Bassolé, I.H.N. et al.",
        "year": 2010,
        "journal": "Molecules",
        "doi": "10.3390/molecules15117825",
        "research_domain": "phytochimie",
        "abstract": "Propriétés antimicrobiennes des huiles essentielles en combinaison.",
        "keywords": '["huiles essentielles", "antimicrobien", "synergie"]',
        "read_status": "lu"
    },
    {
        "entry_key": "bayala2014",
        "entry_type": "article",
        "title": "Chemical composition and antimicrobial activity of essential oils from Lippia multiflora",
        "authors": "Bayala, B. et al.",
        "year": 2014,
        "journal": "PLoS ONE",
        "doi": "10.1371/journal.pone.0092122",
        "research_domain": "phytochimie",
        "abstract": "Composition chimique et activité antimicrobienne de Lippia multiflora.",
        "keywords": '["Lippia multiflora", "antimicrobien", "huile essentielle"]',
        "read_status": "lu"
    },
    {
        "entry_key": "bassole2020",
        "entry_type": "article",
        "title": "Chemical composition of Ocimum canum essential oil from Burkina Faso",
        "authors": "Bassolé, I.H.N. et al.",
        "year": 2020,
        "journal": "Global Journal of Food and Agricultural Sciences",
        "research_domain": "phytochimie",
        "abstract": "Composition de l'huile essentielle d'Ocimum canum du Burkina Faso.",
        "keywords": '["Ocimum canum", "Burkina Faso", "huile essentielle", "1,8-cinéole"]',
        "read_status": "lu"
    },
    {
        "entry_key": "tchoumbougnang2006",
        "entry_type": "article",
        "title": "Essential oil composition of Ocimum canum from Cameroon",
        "authors": "Tchoumbougnang, F. et al.",
        "year": 2006,
        "journal": "Journal of Essential Oil Research",
        "research_domain": "phytochimie",
        "abstract": "Composition de l'huile essentielle d'Ocimum canum du Cameroun.",
        "keywords": '["Ocimum canum", "Cameroun", "huile essentielle"]',
        "read_status": "lu"
    },
    {
        "entry_key": "dasilva2018",
        "entry_type": "article",
        "title": "Chemical composition of Ocimum canum essential oil from Brazil",
        "authors": "da Silva, V.D. et al.",
        "year": 2018,
        "journal": "Industrial Crops and Products",
        "doi": "10.1016/j.indcrop.2018.04.025",
        "research_domain": "phytochimie",
        "abstract": "Composition de l'huile essentielle d'Ocimum canum du Brésil.",
        "keywords": '["Ocimum canum", "Brésil", "huile essentielle"]',
        "read_status": "lu"
    },
    
    # === recherche-elargie-sources.md ===
    {
        "entry_key": "kumar2018",
        "entry_type": "article",
        "title": "AromaDb: A Database of Medicinal and Aromatic Plant's Aroma Molecules With Phytochemistry and Therapeutic Potentials",
        "authors": "Kumar, Y. et al.",
        "year": 2018,
        "journal": "Frontiers in Plant Science",
        "doi": "10.3389/fpls.2018.01081",
        "research_domain": "bioinformatique",
        "abstract": "Base de données de 1523 molécules aromatiques de 233 plantes médicinales.",
        "keywords": '["AromaDb", "base de données", "molécules aromatiques", "plantes médicinales"]',
        "url": "https://aromadb.cimapbioinfo.in/",
        "read_status": "lu"
    },
    {
        "entry_key": "sharma2022",
        "entry_type": "article",
        "title": "OlfactionBase: a repository to explore odors, odorants, olfactory receptors and odorant-receptor interactions",
        "authors": "Sharma, A. et al.",
        "year": 2022,
        "journal": "Nucleic Acids Research",
        "doi": "10.1093/nar/gkab763",
        "research_domain": "bioinformatique",
        "abstract": "Base de données sur les mécanismes moléculaires de l'olfaction.",
        "keywords": '["OlfactionBase", "récepteurs olfactifs", "odorants", "base de données"]',
        "read_status": "lu"
    },
    {
        "entry_key": "dunkel2008",
        "entry_type": "article",
        "title": "SuperScent—a database of flavors and scents",
        "authors": "Dunkel, M. et al.",
        "year": 2008,
        "journal": "Nucleic Acids Research",
        "doi": "10.1093/nar/gkn695",
        "pmid": "18931377",
        "research_domain": "bioinformatique",
        "abstract": "Base de données de composés aromatiques et leurs propriétés olfactives.",
        "keywords": '["SuperScent", "base de données", "arômes", "parfums"]',
        "read_status": "lu"
    },
    {
        "entry_key": "elmernissi2023",
        "entry_type": "article",
        "title": "Indigenous knowledge of traditional aromatic plants",
        "authors": "El-Mernissi, Y. et al.",
        "year": 2023,
        "journal": "Journal of Ethnobiology and Ethnomedicine",
        "research_domain": "ethnobotanique",
        "abstract": "Documentation des connaissances indigènes sur les plantes aromatiques traditionnelles.",
        "keywords": '["ethnobotanique", "plantes aromatiques", "savoirs traditionnels"]',
        "read_status": "a_lire"
    },
    {
        "entry_key": "zouraris2025",
        "entry_type": "article",
        "title": "EthnoHERBS: A multidisciplinary initiative integrating traditional knowledge and chemistry",
        "authors": "Zouraris, D. et al.",
        "year": 2025,
        "journal": "Journal of Ethnopharmacology",
        "research_domain": "ethnobotanique",
        "abstract": "Initiative multidisciplinaire intégrant savoirs traditionnels et chimie des plantes aromatiques.",
        "keywords": '["EthnoHERBS", "ethnobotanique", "chimie", "savoirs traditionnels"]',
        "read_status": "a_lire"
    },
    {
        "entry_key": "chaachouay2023",
        "entry_type": "article",
        "title": "Ethnobotany, ethnopharmacology and traditional uses of aromatic plants",
        "authors": "Chaachouay, N. et al.",
        "year": 2023,
        "journal": "Journal of Ethnopharmacology",
        "research_domain": "ethnobotanique",
        "abstract": "Revue sur l'ethnobotanique et les usages traditionnels des plantes aromatiques.",
        "keywords": '["ethnobotanique", "ethnopharmacologie", "usages traditionnels"]',
        "read_status": "a_lire"
    },
    
    # === Bases de données en ligne (online) ===
    {
        "entry_key": "aromadb_database",
        "entry_type": "online",
        "title": "AromaDb - Database of Medicinal and Aromatic Plant's Aroma Molecules",
        "authors": "CSIR-CIMAP",
        "year": 2018,
        "url": "https://aromadb.cimapbioinfo.in/",
        "research_domain": "bioinformatique",
        "abstract": "Base de données de 1523 molécules aromatiques, 233 plantes, 510 types de fragrances.",
        "keywords": '["base de données", "molécules aromatiques", "IUPAC", "structures 3D"]',
        "read_status": "consulte"
    },
    {
        "entry_key": "m2or_database",
        "entry_type": "online",
        "title": "M2OR - Molecule to Olfactory Receptor Database",
        "authors": "ChemSensim",
        "year": 2023,
        "url": "https://m2or.chemsensim.fr/",
        "research_domain": "bioinformatique",
        "abstract": "Base de données de 771 molécules, 1402 récepteurs olfactifs, 77611 expériences.",
        "keywords": '["récepteurs olfactifs", "molécules", "bioassay", "olfaction"]',
        "read_status": "consulte"
    },
    {
        "entry_key": "predo3_database",
        "entry_type": "online",
        "title": "Pred-O3 - Odor Prediction Database",
        "authors": "Université Paris Diderot",
        "year": 2020,
        "url": "https://odor.rpbs.univ-paris-diderot.fr/",
        "research_domain": "bioinformatique",
        "abstract": "Base de données de 5802 composés chimiques avec odeurs connues, 385 récepteurs.",
        "keywords": '["prédiction odeurs", "structure moléculaire", "récepteurs olfactifs"]',
        "read_status": "consulte"
    },
    {
        "entry_key": "rifm_database",
        "entry_type": "online",
        "title": "RIFM Database - Research Institute for Fragrance Materials",
        "authors": "RIFM",
        "year": 2024,
        "url": "https://rifm.org/rifm-database/",
        "research_domain": "toxicologie",
        "abstract": "Base de données de plus de 7000 matériaux avec 80000+ références toxicologiques.",
        "keywords": '["toxicologie", "sécurité", "parfumerie", "RIFM"]',
        "read_status": "consulte"
    },
    {
        "entry_key": "ifra_transparency",
        "entry_type": "online",
        "title": "IFRA Transparency List",
        "authors": "IFRA",
        "year": 2024,
        "url": "https://ifrafragrance.org/transparency-list",
        "research_domain": "reglementation",
        "abstract": "Liste de transparence des ingrédients utilisés en parfumerie.",
        "keywords": '["IFRA", "réglementation", "ingrédients", "parfumerie"]',
        "read_status": "consulte"
    },
    {
        "entry_key": "goodscents_database",
        "entry_type": "online",
        "title": "The Good Scents Company Information System",
        "authors": "The Good Scents Company",
        "year": 2024,
        "url": "https://www.thegoodscentscompany.com/",
        "research_domain": "parfumerie",
        "abstract": "Base de données commerciale pour l'industrie des arômes et parfums.",
        "keywords": '["arômes", "parfums", "industrie", "données commerciales"]',
        "read_status": "consulte"
    },
    {
        "entry_key": "fragrance_wheel",
        "entry_type": "online",
        "title": "Fragrance Wheel - Michael Edwards Classification",
        "authors": "Edwards, Michael",
        "year": 2020,
        "url": "https://www.fragrancesoftheworld.com/",
        "research_domain": "parfumerie",
        "abstract": "Classification des familles olfactives en 4 familles principales et 14 sous-familles.",
        "keywords": '["classification", "familles olfactives", "fragrance wheel"]',
        "read_status": "consulte"
    },
]

# Générer le fichier JSON pour import
output = {
    "generated_at": datetime.now().isoformat(),
    "total_sources": len(sources_to_import),
    "sources": sources_to_import
}

# Sauvegarder le fichier JSON
with open('/home/ubuntu/perfumum-research/data/sources-to-import.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print(f"✅ {len(sources_to_import)} sources extraites et sauvegardées dans sources-to-import.json")

# Afficher un résumé par type
types_count = {}
domains_count = {}
for source in sources_to_import:
    t = source.get('entry_type', 'unknown')
    d = source.get('research_domain', 'unknown')
    types_count[t] = types_count.get(t, 0) + 1
    domains_count[d] = domains_count.get(d, 0) + 1

print("\n📊 Répartition par type:")
for t, c in sorted(types_count.items(), key=lambda x: -x[1]):
    print(f"  - {t}: {c}")

print("\n📊 Répartition par domaine de recherche:")
for d, c in sorted(domains_count.items(), key=lambda x: -x[1]):
    print(f"  - {d}: {c}")
