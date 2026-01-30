#!/usr/bin/env python3
"""
Script pour importer les sources bibliographiques du fichier Pasted_content_23.txt
dans la base de données PERFUMUM (table bibliography_entries)
"""

import re
import os
import mysql.connector
from datetime import datetime
from urllib.parse import urlparse

# Configuration de la base de données
DATABASE_URL = os.environ.get('DATABASE_URL', '')

def parse_db_url(url):
    """Parse MySQL URL into connection parameters"""
    # Format: mysql://user:password@host:port/database
    pattern = r'mysql://([^:]+):([^@]+)@([^:]+):(\d+)/([^?]+)'
    match = re.match(pattern, url)
    if not match:
        raise ValueError(f"Invalid database URL format: {url}")
    return {
        'user': match.group(1),
        'password': match.group(2),
        'host': match.group(3),
        'port': int(match.group(4)),
        'database': match.group(5),
    }

# Sources bibliographiques extraites du fichier
SOURCES = [
    # === AXE 0 : Infrastructures socle ===
    {
        "title": "Plants of the World Online (POWO)",
        "authors": "Royal Botanic Gardens, Kew",
        "source_type": "database",
        "domain": "Taxonomie",
        "year": 2024,
        "url": "https://powo.science.kew.org/",
        "abstract": "Base de données taxonomique mondiale avec descriptions et images des plantes.",
        "keywords": "taxonomie, botanique, Kew, classification",
        "axis": "AX0",
        "level": "primary",
        "ref_type": "institution"
    },
    {
        "title": "IUCN Red List of Threatened Species",
        "authors": "International Union for Conservation of Nature",
        "source_type": "database",
        "domain": "Conservation",
        "year": 2024,
        "url": "https://www.iucnredlist.org/",
        "abstract": "Liste rouge mondiale des espèces menacées, référence pour le statut de conservation.",
        "keywords": "conservation, espèces menacées, biodiversité, IUCN",
        "axis": "AX0",
        "level": "primary",
        "ref_type": "institution"
    },
    {
        "title": "BGCI ThreatSearch",
        "authors": "Botanic Gardens Conservation International",
        "source_type": "database",
        "domain": "Conservation",
        "year": 2024,
        "url": "https://www.bgci.org/resources/bgci-databases/threatsearch/",
        "abstract": "Agrégateur d'évaluations de menace pour les plantes, multi-sources.",
        "keywords": "conservation, plantes, évaluation menace, jardins botaniques",
        "axis": "AX0",
        "level": "primary",
        "ref_type": "institution"
    },
    {
        "title": "CITES Appendices",
        "authors": "Convention on International Trade in Endangered Species",
        "source_type": "database",
        "domain": "Régulation",
        "year": 2024,
        "url": "https://cites.org/eng/app/index.php",
        "abstract": "Appendices de la CITES régulant le commerce international des espèces.",
        "keywords": "CITES, commerce, espèces, régulation internationale",
        "axis": "AX0",
        "level": "primary",
        "ref_type": "institution"
    },
    {
        "title": "Kew CITES Resources",
        "authors": "Royal Botanic Gardens, Kew",
        "source_type": "website",
        "domain": "Régulation",
        "year": 2024,
        "url": "https://www.kew.org/science/our-science/science-services/UK-CITES/cites-resources",
        "abstract": "Guides et checklists pour la conformité CITES.",
        "keywords": "CITES, Kew, guides, conformité",
        "axis": "AX0",
        "level": "secondary",
        "ref_type": "institution"
    },
    {
        "title": "Global Biodiversity Information Facility (GBIF)",
        "authors": "GBIF Secretariat",
        "source_type": "database",
        "domain": "Biodiversité",
        "year": 2024,
        "url": "https://www.gbif.org/",
        "abstract": "Infrastructure mondiale de données sur la biodiversité, incluant citizen science.",
        "keywords": "biodiversité, données ouvertes, occurrences, GBIF",
        "axis": "AX0",
        "level": "primary",
        "ref_type": "dataset"
    },
    {
        "title": "iNaturalist as a biodiversity research engine",
        "authors": "BioScience",
        "source_type": "article",
        "domain": "Citizen Science",
        "year": 2025,
        "url": "https://academic.oup.com/bioscience/article/75/11/953/8185761",
        "abstract": "Pipeline citizen science majeur pour la recherche en biodiversité.",
        "keywords": "iNaturalist, citizen science, biodiversité, GBIF",
        "axis": "AX0",
        "level": "primary",
        "ref_type": "review"
    },
    {
        "title": "Biodiversity Heritage Library (BHL)",
        "authors": "BHL Consortium",
        "source_type": "database",
        "domain": "Archives",
        "year": 2024,
        "url": "https://www.biodiversitylibrary.org/",
        "abstract": "Littérature biodiversité en accès ouvert, numérisation historique.",
        "keywords": "archives, littérature, biodiversité, numérisation",
        "axis": "AX0",
        "level": "primary",
        "ref_type": "dataset"
    },
    {
        "title": "IIIF - International Image Interoperability Framework",
        "authors": "IIIF Consortium",
        "source_type": "standard",
        "domain": "Standards",
        "year": 2024,
        "url": "https://iiif.io/",
        "abstract": "Standards pour l'accès stable aux images numérisées et leur réutilisation.",
        "keywords": "IIIF, images, standards, interopérabilité",
        "axis": "AX0",
        "level": "primary",
        "ref_type": "tool"
    },
    {
        "title": "Transkribus - HTR/Handwriting OCR",
        "authors": "READ-COOP",
        "source_type": "tool",
        "domain": "OCR",
        "year": 2024,
        "url": "https://www.transkribus.org/",
        "abstract": "Pipeline pour la reconnaissance de manuscrits et archives historiques.",
        "keywords": "OCR, HTR, manuscrits, archives, transcription",
        "axis": "AX0",
        "level": "primary",
        "ref_type": "tool"
    },
    
    # === AXE 1 : Génomique olfactive & conservation ex-situ ===
    {
        "title": "Genomic mechanism of aroma terpenoids biosynthesis in plants",
        "authors": "Various",
        "source_type": "article",
        "domain": "Génomique",
        "year": 2025,
        "url": "https://www.sciencedirect.com/science/article/pii/S2090123225010240",
        "abstract": "Revue récente sur les mécanismes génomiques de biosynthèse des terpènes aromatiques.",
        "keywords": "terpènes, biosynthèse, génomique, arômes, plantes",
        "axis": "AX1",
        "level": "primary",
        "ref_type": "review"
    },
    {
        "title": "Origin and early evolution of the plant terpene synthase family",
        "authors": "PNAS",
        "source_type": "article",
        "domain": "Évolution",
        "year": 2022,
        "url": "https://www.pnas.org/doi/10.1073/pnas.2100361119",
        "abstract": "Fondations évolutives de la famille des terpène synthases (TPS).",
        "keywords": "TPS, évolution, terpènes, synthases, plantes",
        "axis": "AX1",
        "level": "primary",
        "ref_type": "methods"
    },
    {
        "title": "TPS gene family evolutionary dynamics",
        "authors": "Frontiers in Plant Science",
        "source_type": "article",
        "domain": "Génomique",
        "year": 2023,
        "url": "https://www.frontiersin.org/journals/plant-science/articles/10.3389/fpls.2023.1273648/full",
        "abstract": "Mise à jour accessible sur la dynamique évolutive de la famille TPS.",
        "keywords": "TPS, évolution, génomique, famille de gènes",
        "axis": "AX1",
        "level": "primary",
        "ref_type": "review"
    },
    {
        "title": "eDNA for plant biomonitoring - review",
        "authors": "AoB Plants",
        "source_type": "article",
        "domain": "eDNA",
        "year": 2022,
        "url": "https://academic.oup.com/aobpla/article/14/4/plac031/6627252",
        "abstract": "Revue sur l'utilisation de l'ADN environnemental pour le biomonitoring non-destructif.",
        "keywords": "eDNA, biomonitoring, non-destructif, plantes",
        "axis": "AX1",
        "level": "primary",
        "ref_type": "review"
    },
    {
        "title": "Pollen DNA barcoding - review",
        "authors": "Canadian Science Publishing",
        "source_type": "article",
        "domain": "Barcoding",
        "year": 2016,
        "url": "https://cdnsciencepub.com/doi/10.1139/gen-2015-0200",
        "abstract": "Cadre et applications du barcoding ADN du pollen.",
        "keywords": "pollen, barcoding, ADN, identification",
        "axis": "AX1",
        "level": "primary",
        "ref_type": "review"
    },
    {
        "title": "Plant Cryopreservation - Annual Review",
        "authors": "Annual Review of Plant Biology",
        "source_type": "article",
        "domain": "Cryoconservation",
        "year": 2024,
        "url": "https://www.annualreviews.org/content/journals/10.1146/annurev-arplant-070623-103551",
        "abstract": "Référence haut niveau sur la cryoconservation des plantes.",
        "keywords": "cryoconservation, plantes, banques de graines, vitrification",
        "axis": "AX1",
        "level": "primary",
        "ref_type": "review"
    },
    {
        "title": "Cryopreservation of shoot tips and meristems",
        "authors": "PubMed",
        "source_type": "article",
        "domain": "Cryoconservation",
        "year": 2008,
        "url": "https://pubmed.ncbi.nlm.nih.gov/18080470/",
        "abstract": "Méthodes de vitrification et congélation pour apex et méristèmes.",
        "keywords": "cryoconservation, méristèmes, vitrification, apex",
        "axis": "AX1",
        "level": "primary",
        "ref_type": "methods"
    },
    {
        "title": "Svalbard Global Seed Vault",
        "authors": "Crop Trust",
        "source_type": "institution",
        "domain": "Conservation",
        "year": 2024,
        "url": "https://www.croptrust.org/what-we-do/programs/svalbard-global-seed-vault/",
        "abstract": "Infrastructure mondiale de sauvegarde des semences.",
        "keywords": "Svalbard, banque de graines, conservation, Crop Trust",
        "axis": "AX1",
        "level": "primary",
        "ref_type": "institution"
    },
    
    # === AXE 2 : Ethnobotanique computationnelle ===
    {
        "title": "Empowering natural product science with AI and knowledge graphs",
        "authors": "Natural Product Reports",
        "source_type": "article",
        "domain": "IA",
        "year": 2025,
        "url": "https://pubs.rsc.org/en/content/articlelanding/2025/np/d4np00008k",
        "abstract": "Utilisation de l'IA et des graphes de connaissances pour les produits naturels.",
        "keywords": "IA, knowledge graphs, produits naturels, NLP",
        "axis": "AX2",
        "level": "primary",
        "ref_type": "review"
    },
    {
        "title": "Reimagining ethnopharmacology with generative AI",
        "authors": "ScienceDirect",
        "source_type": "article",
        "domain": "IA",
        "year": 2025,
        "url": "https://www.sciencedirect.com/science/article/pii/S104366182500427X",
        "abstract": "Pipeline et considérations éthiques pour l'IA générative en ethnopharmacologie.",
        "keywords": "IA générative, ethnopharmacologie, éthique, pipeline",
        "axis": "AX2",
        "level": "primary",
        "ref_type": "review"
    },
    {
        "title": "Biomedical NLP for ethnobotany",
        "authors": "PMC",
        "source_type": "article",
        "domain": "NLP",
        "year": 2018,
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5977595/",
        "abstract": "Méthodologie NLP appliquée à l'ethnobotanique.",
        "keywords": "NLP, ethnobotanique, text mining, extraction",
        "axis": "AX2",
        "level": "primary",
        "ref_type": "methods"
    },
    
    # === AXE 3 : Chimie analytique comparative ===
    {
        "title": "Archaeometric Identification of a Perfume from Roman Times",
        "authors": "MDPI Heritage",
        "source_type": "article",
        "domain": "Archéochimie",
        "year": 2023,
        "url": "https://www.mdpi.com/2571-9408/6/6/236",
        "abstract": "Identification archéométrique d'un parfum romain par analyse de résidus.",
        "keywords": "archéochimie, parfum romain, GC-MS, résidus",
        "axis": "AX3",
        "level": "primary",
        "ref_type": "methods"
    },
    {
        "title": "Greco-Roman unguentaria residues",
        "authors": "MDPI Heritage",
        "source_type": "article",
        "domain": "Archéochimie",
        "year": 2025,
        "url": "https://www.mdpi.com/2571-9408/8/5/170",
        "abstract": "Analyse des résidus dans les contenants à parfum gréco-romains.",
        "keywords": "unguentaria, résidus, gréco-romain, parfum antique",
        "axis": "AX3",
        "level": "primary",
        "ref_type": "methods"
    },
    {
        "title": "Organic residue analysis of ancient scented oils (Bronze Age)",
        "authors": "Wiley Archaeometry",
        "source_type": "article",
        "domain": "Archéochimie",
        "year": 2023,
        "url": "https://onlinelibrary.wiley.com/doi/abs/10.1111/arcm.12852",
        "abstract": "Analyse GC-MS des huiles parfumées de l'Âge du Bronze.",
        "keywords": "Âge du Bronze, huiles parfumées, GC-MS, résidus organiques",
        "axis": "AX3",
        "level": "primary",
        "ref_type": "methods"
    },
    {
        "title": "NOMEN - Classification of historical scent reconstruction methods",
        "authors": "Open Research Europe",
        "source_type": "article",
        "domain": "Méthodologie",
        "year": 2025,
        "url": "https://open-research-europe.ec.europa.eu/articles/5-383",
        "abstract": "Classification des méthodes de reconstruction olfactive historique.",
        "keywords": "reconstruction, odeurs historiques, méthodologie, NOMEN",
        "axis": "AX3",
        "level": "primary",
        "ref_type": "methods"
    },
    {
        "title": "Herbarium specimens and plant chemical diversity",
        "authors": "The Plant Journal",
        "source_type": "article",
        "domain": "Chimiodiversité",
        "year": 2024,
        "url": "https://onlinelibrary.wiley.com/doi/10.1111/tpj.16989",
        "abstract": "Potentiel des herbiers pour l'étude de la diversité chimique des plantes.",
        "keywords": "herbier, chimiodiversité, métabolites, évolution",
        "axis": "AX3",
        "level": "primary",
        "ref_type": "review"
    },
    {
        "title": "CSIA applied to foods, essential oils and plant extracts",
        "authors": "Food Chemistry",
        "source_type": "article",
        "domain": "Authentification",
        "year": 2023,
        "url": "https://www.sciencedirect.com/science/article/abs/pii/S0308814623004089",
        "abstract": "Revue sur l'analyse isotopique pour l'authentification des huiles essentielles.",
        "keywords": "CSIA, isotopes, authentification, huiles essentielles, traçabilité",
        "axis": "AX3",
        "level": "primary",
        "ref_type": "review"
    },
    
    # === AXE 4 : Biotechnologies de conservation ===
    {
        "title": "Engineering yeast for plant terpenoids - fragrance focus",
        "authors": "Natural Product Reports",
        "source_type": "article",
        "domain": "Biotechnologie",
        "year": 2023,
        "url": "https://pubs.rsc.org/en/content/articlehtml/2023/np/d3np00005b",
        "abstract": "Revue sur l'ingénierie des levures pour produire des terpènes de parfumerie.",
        "keywords": "levures, terpènes, ingénierie métabolique, parfumerie",
        "axis": "AX4",
        "level": "primary",
        "ref_type": "review"
    },
    {
        "title": "Patchoulol production in yeast",
        "authors": "ACS Synthetic Biology",
        "source_type": "article",
        "domain": "Biotechnologie",
        "year": 2021,
        "url": "https://pubs.acs.org/doi/abs/10.1021/acssynbio.0c00521",
        "abstract": "Exemple de stratégies d'ingénierie pour la production de patchoulol.",
        "keywords": "patchoulol, levures, ingénierie, bioproduction",
        "axis": "AX4",
        "level": "primary",
        "ref_type": "methods"
    },
    
    # === AXE 5 : Technologies immersives & VR ===
    {
        "title": "A Review of Olfactory Display Designs for Virtual Reality Environments",
        "authors": "ACM Computing Surveys",
        "source_type": "article",
        "domain": "VR Olfactive",
        "year": 2024,
        "url": "https://dl.acm.org/doi/10.1145/3665243",
        "abstract": "Référence pivot sur les dispositifs olfactifs pour la réalité virtuelle.",
        "keywords": "VR, olfaction, displays, immersion, multisensoriel",
        "axis": "AX5",
        "level": "primary",
        "ref_type": "review"
    },
    {
        "title": "Digital smell technologies for the built environment",
        "authors": "Building and Environment",
        "source_type": "article",
        "domain": "Architecture",
        "year": 2025,
        "url": "https://www.sciencedirect.com/science/article/pii/S0360132325000903",
        "abstract": "Technologies olfactives numériques appliquées à l'architecture et l'espace.",
        "keywords": "architecture, espace, odeurs numériques, environnement bâti",
        "axis": "AX5",
        "level": "primary",
        "ref_type": "review"
    },
    {
        "title": "Advances in olfactory displays for multisensory immersion",
        "authors": "Sciengine",
        "source_type": "article",
        "domain": "VR Olfactive",
        "year": 2025,
        "url": "https://www.sciengine.com/doi/10.1007/s40843-025-3726-3",
        "abstract": "Paysage technique et tendances des dispositifs olfactifs immersifs.",
        "keywords": "immersion, olfaction, displays, tendances",
        "axis": "AX5",
        "level": "primary",
        "ref_type": "review"
    },
    {
        "title": "GBIF Citizen Science",
        "authors": "GBIF",
        "source_type": "website",
        "domain": "Citizen Science",
        "year": 2024,
        "url": "https://www.gbif.org/citizen-science",
        "abstract": "Cadre et bonnes pratiques pour la citizen science en biodiversité.",
        "keywords": "citizen science, GBIF, qualité données, partage",
        "axis": "AX5",
        "level": "secondary",
        "ref_type": "institution"
    },
    
    # === AXE 6 : Diplomatie olfactive / régulation ===
    # (Les sources principales sont déjà dans AX0)
    
    # === AXES INSTALLATION/ESPACE ===
    {
        "title": "Indoor exposure impacts from cleaning - monoterpenes and secondary chemistry",
        "authors": "Science Advances",
        "source_type": "article",
        "domain": "Chimie Indoor",
        "year": 2022,
        "url": "https://www.science.org/doi/10.1126/sciadv.abj9156",
        "abstract": "Impacts des expositions indoor liées au nettoyage (monoterpènes + chimie secondaire).",
        "keywords": "indoor, monoterpènes, nettoyage, SOA, chimie secondaire",
        "axis": "AXC",
        "level": "primary",
        "ref_type": "methods"
    },
    {
        "title": "Indoor SOA modeling - uncertainties and partitioning",
        "authors": "PMC/NIH",
        "source_type": "article",
        "domain": "Chimie Indoor",
        "year": 2021,
        "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7884095/",
        "abstract": "Modélisation des aérosols organiques secondaires en environnement intérieur.",
        "keywords": "SOA, modélisation, indoor, incertitudes",
        "axis": "AXC",
        "level": "primary",
        "ref_type": "methods"
    },
    {
        "title": "SOA indoor + HVAC/thermal heterogeneity",
        "authors": "RSC Environmental Science",
        "source_type": "article",
        "domain": "Chimie Indoor",
        "year": 2025,
        "url": "https://pubs.rsc.org/en/content/articlehtml/2025/em/d5em00036j",
        "abstract": "SOA en environnement intérieur avec hétérogénéité thermique et HVAC.",
        "keywords": "SOA, HVAC, hétérogénéité thermique, indoor",
        "axis": "AXC",
        "level": "primary",
        "ref_type": "methods"
    },
    {
        "title": "Indoor SOA initiated from ozone + terpenoids",
        "authors": "ACS ES&T",
        "source_type": "article",
        "domain": "Chimie Indoor",
        "year": 2013,
        "url": "https://pubs.acs.org/doi/abs/10.1021/es400846d",
        "abstract": "Fondations sur la formation de SOA par réaction ozone-terpénoïdes.",
        "keywords": "ozone, terpénoïdes, SOA, indoor, fondations",
        "axis": "AXC",
        "level": "primary",
        "ref_type": "methods"
    },
    {
        "title": "Flame-Free Candles Are Not Pollution-Free - Wax Melts Study",
        "authors": "ES&T Letters",
        "source_type": "article",
        "domain": "Wax Melts",
        "year": 2025,
        "url": "https://pubs.acs.org/doi/10.1021/acs.estlett.4c00986",
        "abstract": "Étude pivot sur les émissions des fondants de cire parfumés.",
        "keywords": "wax melts, émissions, pollution indoor, bougies",
        "axis": "AXD",
        "level": "primary",
        "ref_type": "methods"
    },
    {
        "title": "Scented wax melts indoor air safety - ACS summary",
        "authors": "ACS PressPac",
        "source_type": "press",
        "domain": "Wax Melts",
        "year": 2025,
        "url": "https://www.acs.org/pressroom/presspacs/2025/february/scented-wax-melts-may-not-be-as-safe-for-indoor-air-as-initially-thought.html",
        "abstract": "Synthèse grand public de l'étude sur les wax melts.",
        "keywords": "wax melts, sécurité, communication, grand public",
        "axis": "AXD",
        "level": "secondary",
        "ref_type": "review"
    },
    
    # === TABAC & CANNABIS ===
    {
        "title": "Unveiling Colombia's medicinal Cannabis sativa treasure trove",
        "authors": "PubMed",
        "source_type": "article",
        "domain": "Cannabis",
        "year": 2024,
        "url": "https://pubmed.ncbi.nlm.nih.gov/39169651/",
        "abstract": "Étude de 156 plantes colombiennes : 10 cannabinoïdes + 23 terpènes identifiés.",
        "keywords": "cannabis, Colombie, cannabinoïdes, terpènes, chimiodiversité",
        "axis": "AXTC",
        "level": "primary",
        "ref_type": "methods"
    },
    
    # === BONUS : Olfaction structurale ===
    {
        "title": "Cryo-EM structure of human olfactory receptor OR51E2",
        "authors": "Nature",
        "source_type": "article",
        "domain": "Olfaction",
        "year": 2023,
        "url": "https://www.nature.com/articles/s41586-023-05798-y",
        "abstract": "Structure cryo-EM du récepteur olfactif OR51E2, pivot pour l'olfaction lisible.",
        "keywords": "récepteur olfactif, cryo-EM, OR51E2, structure, olfaction",
        "axis": "AXOR",
        "level": "primary",
        "ref_type": "methods"
    },
]

def get_axis_id(cursor, axis_code):
    """Get the axis ID from the research_axes table"""
    cursor.execute("SELECT id FROM research_axes WHERE axis_code = %s", (axis_code,))
    result = cursor.fetchone()
    return result[0] if result else None

def insert_source(cursor, source):
    """Insert a single source into bibliography_entries"""
    # Check if source already exists (by URL or title)
    cursor.execute(
        "SELECT id FROM bibliography_entries WHERE url = %s OR title = %s",
        (source.get('url', ''), source['title'])
    )
    existing = cursor.fetchone()
    
    if existing:
        print(f"  ⏭️  Source déjà existante: {source['title'][:50]}...")
        return existing[0]
    
    # Insert new source
    cursor.execute("""
        INSERT INTO bibliography_entries (
            title, authors, source_type, domain, year, url, abstract, keywords, created_at
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
    """, (
        source['title'],
        source.get('authors', ''),
        source.get('source_type', 'article'),
        source.get('domain', ''),
        source.get('year'),
        source.get('url', ''),
        source.get('abstract', ''),
        source.get('keywords', ''),
    ))
    
    source_id = cursor.lastrowid
    print(f"  ✅ Importé: {source['title'][:50]}...")
    return source_id

def link_to_axis(cursor, source_id, axis_code):
    """Link a source to a research axis"""
    axis_id = get_axis_id(cursor, axis_code)
    if not axis_id:
        # Try to find a matching axis
        if axis_code.startswith('AX'):
            # Map custom axes to existing ones
            axis_mapping = {
                'AX0': None,  # Infrastructure - no specific axis
                'AXC': None,  # Chimie indoor
                'AXD': None,  # Wax melts
                'AXTC': 'AX1',  # Tabac/Cannabis -> Variétés Fantômes
                'AXOR': 'AX3',  # Olfaction -> Mémoires Olfactives
            }
            mapped_axis = axis_mapping.get(axis_code)
            if mapped_axis:
                axis_id = get_axis_id(cursor, mapped_axis)
    
    if axis_id:
        # Check if link already exists
        cursor.execute(
            "SELECT id FROM bibliography_axis_links WHERE bibliography_id = %s AND axis_id = %s",
            (source_id, axis_id)
        )
        if not cursor.fetchone():
            cursor.execute(
                "INSERT INTO bibliography_axis_links (bibliography_id, axis_id, created_at) VALUES (%s, %s, NOW())",
                (source_id, axis_id)
            )
            print(f"    → Lié à l'axe {axis_code}")

def main():
    """Main function to import all sources"""
    if not DATABASE_URL:
        # Try to load from .env file
        env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
        if os.path.exists(env_path):
            with open(env_path) as f:
                for line in f:
                    if line.startswith('DATABASE_URL='):
                        os.environ['DATABASE_URL'] = line.split('=', 1)[1].strip().strip('"\'')
                        break
    
    db_url = os.environ.get('DATABASE_URL', '')
    if not db_url:
        print("❌ DATABASE_URL non définie")
        return
    
    config = parse_db_url(db_url)
    
    print("🔌 Connexion à la base de données...")
    conn = mysql.connector.connect(
        **config,
        ssl_ca=None,
        ssl_verify_cert=False,
    )
    cursor = conn.cursor()
    
    try:
        print(f"\n📚 Import de {len(SOURCES)} sources bibliographiques...\n")
        
        imported = 0
        skipped = 0
        
        for source in SOURCES:
            source_id = insert_source(cursor, source)
            if source_id:
                if source.get('axis'):
                    link_to_axis(cursor, source_id, source['axis'])
                imported += 1
            else:
                skipped += 1
        
        conn.commit()
        
        print(f"\n✅ Import terminé!")
        print(f"   - Sources importées: {imported}")
        print(f"   - Sources ignorées (déjà existantes): {skipped}")
        
        # Afficher les statistiques
        cursor.execute("SELECT COUNT(*) FROM bibliography_entries")
        total = cursor.fetchone()[0]
        print(f"   - Total sources en base: {total}")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()
        print("\n🔌 Connexion fermée")

if __name__ == "__main__":
    main()
