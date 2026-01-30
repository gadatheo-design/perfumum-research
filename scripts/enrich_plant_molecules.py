#!/usr/bin/env python3
"""
Script pour enrichir les relations plante-molécule dans PERFUMUM
Basé sur des données scientifiques de composition d'huiles essentielles
"""

import csv
import json
import os
from typing import Dict, List, Tuple

# Données de composition des huiles essentielles courantes
# Sources: littérature scientifique, bases de données EssOilDB, AromaDb
ESSENTIAL_OIL_COMPOSITIONS = {
    # Lavande (Lavandula angustifolia)
    "Lavandula angustifolia": {
        "common_name": "Lavande vraie",
        "molecules": [
            {"name": "linalool", "percentage_typical": 35, "role": "majeur", "is_signature": 1},
            {"name": "linalyl acetate", "percentage_typical": 30, "role": "majeur", "is_signature": 1},
            {"name": "lavandulyl acetate", "percentage_typical": 4, "role": "secondaire", "is_signature": 0},
            {"name": "terpinen-4-ol", "percentage_typical": 3, "role": "secondaire", "is_signature": 0},
            {"name": "beta-caryophyllene", "percentage_typical": 2.5, "role": "secondaire", "is_signature": 0},
            {"name": "1,8-cineole", "percentage_typical": 1.5, "role": "trace", "is_signature": 0},
            {"name": "camphor", "percentage_typical": 0.5, "role": "trace", "is_signature": 0},
            {"name": "borneol", "percentage_typical": 1, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Menthe poivrée (Mentha x piperita)
    "Mentha x piperita": {
        "common_name": "Menthe poivrée",
        "molecules": [
            {"name": "menthol", "percentage_typical": 42, "role": "majeur", "is_signature": 1},
            {"name": "menthone", "percentage_typical": 22, "role": "majeur", "is_signature": 1},
            {"name": "menthyl acetate", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "1,8-cineole", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "isomenthone", "percentage_typical": 4, "role": "secondaire", "is_signature": 0},
            {"name": "limonene", "percentage_typical": 2.5, "role": "trace", "is_signature": 0},
            {"name": "pulegone", "percentage_typical": 1, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Eucalyptus (Eucalyptus globulus)
    "Eucalyptus globulus": {
        "common_name": "Eucalyptus globuleux",
        "molecules": [
            {"name": "1,8-cineole", "percentage_typical": 75, "role": "majeur", "is_signature": 1},
            {"name": "alpha-pinene", "percentage_typical": 10, "role": "majeur", "is_signature": 0},
            {"name": "limonene", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "globulol", "percentage_typical": 2, "role": "secondaire", "is_signature": 0},
            {"name": "aromadendrene", "percentage_typical": 1.5, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Romarin (Rosmarinus officinalis)
    "Rosmarinus officinalis": {
        "common_name": "Romarin",
        "molecules": [
            {"name": "1,8-cineole", "percentage_typical": 45, "role": "majeur", "is_signature": 1},
            {"name": "camphor", "percentage_typical": 15, "role": "majeur", "is_signature": 1},
            {"name": "alpha-pinene", "percentage_typical": 12, "role": "majeur", "is_signature": 0},
            {"name": "borneol", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "verbenone", "percentage_typical": 3, "role": "secondaire", "is_signature": 0},
            {"name": "camphene", "percentage_typical": 4, "role": "secondaire", "is_signature": 0},
            {"name": "beta-pinene", "percentage_typical": 2, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Citron (Citrus limon)
    "Citrus limon": {
        "common_name": "Citron",
        "molecules": [
            {"name": "limonene", "percentage_typical": 68, "role": "majeur", "is_signature": 1},
            {"name": "beta-pinene", "percentage_typical": 12, "role": "majeur", "is_signature": 0},
            {"name": "gamma-terpinene", "percentage_typical": 8, "role": "secondaire", "is_signature": 0},
            {"name": "citral", "percentage_typical": 3, "role": "secondaire", "is_signature": 1},
            {"name": "geranial", "percentage_typical": 1.5, "role": "trace", "is_signature": 0},
            {"name": "neral", "percentage_typical": 1, "role": "trace", "is_signature": 0},
            {"name": "alpha-pinene", "percentage_typical": 2, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Orange douce (Citrus sinensis)
    "Citrus sinensis": {
        "common_name": "Orange douce",
        "molecules": [
            {"name": "limonene", "percentage_typical": 95, "role": "majeur", "is_signature": 1},
            {"name": "myrcene", "percentage_typical": 2, "role": "trace", "is_signature": 0},
            {"name": "linalool", "percentage_typical": 0.5, "role": "trace", "is_signature": 0},
            {"name": "alpha-pinene", "percentage_typical": 0.5, "role": "trace", "is_signature": 0},
            {"name": "decanal", "percentage_typical": 0.3, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Bergamote (Citrus bergamia)
    "Citrus bergamia": {
        "common_name": "Bergamote",
        "molecules": [
            {"name": "limonene", "percentage_typical": 40, "role": "majeur", "is_signature": 1},
            {"name": "linalyl acetate", "percentage_typical": 30, "role": "majeur", "is_signature": 1},
            {"name": "linalool", "percentage_typical": 12, "role": "majeur", "is_signature": 0},
            {"name": "gamma-terpinene", "percentage_typical": 7, "role": "secondaire", "is_signature": 0},
            {"name": "beta-pinene", "percentage_typical": 6, "role": "secondaire", "is_signature": 0},
            {"name": "bergaptene", "percentage_typical": 0.3, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Ylang-ylang (Cananga odorata)
    "Cananga odorata": {
        "common_name": "Ylang-ylang",
        "molecules": [
            {"name": "linalool", "percentage_typical": 15, "role": "majeur", "is_signature": 1},
            {"name": "germacrene D", "percentage_typical": 18, "role": "majeur", "is_signature": 0},
            {"name": "beta-caryophyllene", "percentage_typical": 12, "role": "majeur", "is_signature": 0},
            {"name": "benzyl acetate", "percentage_typical": 10, "role": "secondaire", "is_signature": 1},
            {"name": "methyl benzoate", "percentage_typical": 6, "role": "secondaire", "is_signature": 0},
            {"name": "benzyl benzoate", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "geranyl acetate", "percentage_typical": 4, "role": "secondaire", "is_signature": 0},
            {"name": "farnesene", "percentage_typical": 3, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Rose (Rosa damascena)
    "Rosa damascena": {
        "common_name": "Rose de Damas",
        "molecules": [
            {"name": "citronellol", "percentage_typical": 35, "role": "majeur", "is_signature": 1},
            {"name": "geraniol", "percentage_typical": 18, "role": "majeur", "is_signature": 1},
            {"name": "nerol", "percentage_typical": 8, "role": "secondaire", "is_signature": 0},
            {"name": "linalool", "percentage_typical": 3, "role": "secondaire", "is_signature": 0},
            {"name": "rose oxide", "percentage_typical": 0.5, "role": "trace", "is_signature": 1},
            {"name": "damascenone", "percentage_typical": 0.01, "role": "trace", "is_signature": 1},
            {"name": "phenylethyl alcohol", "percentage_typical": 2, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Jasmin (Jasminum grandiflorum)
    "Jasminum grandiflorum": {
        "common_name": "Jasmin grandiflorum",
        "molecules": [
            {"name": "benzyl acetate", "percentage_typical": 25, "role": "majeur", "is_signature": 1},
            {"name": "linalool", "percentage_typical": 8, "role": "secondaire", "is_signature": 0},
            {"name": "benzyl benzoate", "percentage_typical": 15, "role": "majeur", "is_signature": 0},
            {"name": "methyl anthranilate", "percentage_typical": 3, "role": "secondaire", "is_signature": 1},
            {"name": "indole", "percentage_typical": 2.5, "role": "secondaire", "is_signature": 1},
            {"name": "jasmone", "percentage_typical": 3, "role": "secondaire", "is_signature": 1},
            {"name": "phytol", "percentage_typical": 8, "role": "secondaire", "is_signature": 0},
        ]
    },
    
    # Vétiver (Chrysopogon zizanioides)
    "Chrysopogon zizanioides": {
        "common_name": "Vétiver",
        "molecules": [
            {"name": "khusimol", "percentage_typical": 15, "role": "majeur", "is_signature": 1},
            {"name": "vetiverol", "percentage_typical": 10, "role": "majeur", "is_signature": 1},
            {"name": "isovalencenol", "percentage_typical": 8, "role": "secondaire", "is_signature": 0},
            {"name": "khusimone", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "vetivone", "percentage_typical": 6, "role": "secondaire", "is_signature": 1},
            {"name": "beta-vetivone", "percentage_typical": 4, "role": "secondaire", "is_signature": 0},
        ]
    },
    
    # Patchouli (Pogostemon cablin)
    "Pogostemon cablin": {
        "common_name": "Patchouli",
        "molecules": [
            {"name": "patchoulol", "percentage_typical": 35, "role": "majeur", "is_signature": 1},
            {"name": "alpha-bulnesene", "percentage_typical": 15, "role": "majeur", "is_signature": 0},
            {"name": "alpha-guaiene", "percentage_typical": 12, "role": "majeur", "is_signature": 0},
            {"name": "seychellene", "percentage_typical": 8, "role": "secondaire", "is_signature": 0},
            {"name": "pogostol", "percentage_typical": 3, "role": "secondaire", "is_signature": 0},
            {"name": "norpatchoulenol", "percentage_typical": 1, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Santal (Santalum album)
    "Santalum album": {
        "common_name": "Santal blanc",
        "molecules": [
            {"name": "alpha-santalol", "percentage_typical": 50, "role": "majeur", "is_signature": 1},
            {"name": "beta-santalol", "percentage_typical": 20, "role": "majeur", "is_signature": 1},
            {"name": "alpha-santalene", "percentage_typical": 6, "role": "secondaire", "is_signature": 0},
            {"name": "beta-santalene", "percentage_typical": 3, "role": "secondaire", "is_signature": 0},
            {"name": "santalene", "percentage_typical": 2, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Cèdre de l'Atlas (Cedrus atlantica)
    "Cedrus atlantica": {
        "common_name": "Cèdre de l'Atlas",
        "molecules": [
            {"name": "alpha-himachalene", "percentage_typical": 15, "role": "majeur", "is_signature": 1},
            {"name": "beta-himachalene", "percentage_typical": 40, "role": "majeur", "is_signature": 1},
            {"name": "gamma-himachalene", "percentage_typical": 10, "role": "secondaire", "is_signature": 0},
            {"name": "atlantone", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "cedrol", "percentage_typical": 3, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Encens (Boswellia sacra)
    "Boswellia sacra": {
        "common_name": "Encens oliban",
        "molecules": [
            {"name": "alpha-pinene", "percentage_typical": 45, "role": "majeur", "is_signature": 1},
            {"name": "limonene", "percentage_typical": 8, "role": "secondaire", "is_signature": 0},
            {"name": "myrcene", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "incensole", "percentage_typical": 3, "role": "secondaire", "is_signature": 1},
            {"name": "incensole acetate", "percentage_typical": 2, "role": "trace", "is_signature": 1},
            {"name": "octyl acetate", "percentage_typical": 4, "role": "secondaire", "is_signature": 0},
        ]
    },
    
    # Myrrhe (Commiphora myrrha)
    "Commiphora myrrha": {
        "common_name": "Myrrhe",
        "molecules": [
            {"name": "furanoeudesma-1,3-diene", "percentage_typical": 25, "role": "majeur", "is_signature": 1},
            {"name": "curzerene", "percentage_typical": 15, "role": "majeur", "is_signature": 1},
            {"name": "lindestrene", "percentage_typical": 10, "role": "secondaire", "is_signature": 0},
            {"name": "beta-elemene", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "germacrene D", "percentage_typical": 3, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Gingembre (Zingiber officinale)
    "Zingiber officinale": {
        "common_name": "Gingembre",
        "molecules": [
            {"name": "zingiberene", "percentage_typical": 30, "role": "majeur", "is_signature": 1},
            {"name": "beta-sesquiphellandrene", "percentage_typical": 15, "role": "majeur", "is_signature": 0},
            {"name": "ar-curcumene", "percentage_typical": 10, "role": "secondaire", "is_signature": 0},
            {"name": "alpha-farnesene", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "camphene", "percentage_typical": 8, "role": "secondaire", "is_signature": 0},
            {"name": "1,8-cineole", "percentage_typical": 3, "role": "trace", "is_signature": 0},
            {"name": "gingerol", "percentage_typical": 2, "role": "trace", "is_signature": 1},
        ]
    },
    
    # Cannelle de Ceylan (Cinnamomum verum)
    "Cinnamomum verum": {
        "common_name": "Cannelle de Ceylan",
        "molecules": [
            {"name": "cinnamaldehyde", "percentage_typical": 75, "role": "majeur", "is_signature": 1},
            {"name": "eugenol", "percentage_typical": 8, "role": "secondaire", "is_signature": 0},
            {"name": "linalool", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "beta-caryophyllene", "percentage_typical": 3, "role": "trace", "is_signature": 0},
            {"name": "cinnamyl acetate", "percentage_typical": 2, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Clou de girofle (Syzygium aromaticum)
    "Syzygium aromaticum": {
        "common_name": "Clou de girofle",
        "molecules": [
            {"name": "eugenol", "percentage_typical": 85, "role": "majeur", "is_signature": 1},
            {"name": "eugenyl acetate", "percentage_typical": 8, "role": "secondaire", "is_signature": 0},
            {"name": "beta-caryophyllene", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "alpha-humulene", "percentage_typical": 1, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Thym (Thymus vulgaris)
    "Thymus vulgaris": {
        "common_name": "Thym",
        "molecules": [
            {"name": "thymol", "percentage_typical": 45, "role": "majeur", "is_signature": 1},
            {"name": "p-cymene", "percentage_typical": 20, "role": "majeur", "is_signature": 0},
            {"name": "gamma-terpinene", "percentage_typical": 10, "role": "secondaire", "is_signature": 0},
            {"name": "carvacrol", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "linalool", "percentage_typical": 3, "role": "trace", "is_signature": 0},
            {"name": "borneol", "percentage_typical": 2, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Origan (Origanum vulgare)
    "Origanum vulgare": {
        "common_name": "Origan",
        "molecules": [
            {"name": "carvacrol", "percentage_typical": 65, "role": "majeur", "is_signature": 1},
            {"name": "thymol", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "p-cymene", "percentage_typical": 8, "role": "secondaire", "is_signature": 0},
            {"name": "gamma-terpinene", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "beta-caryophyllene", "percentage_typical": 3, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Basilic (Ocimum basilicum)
    "Ocimum basilicum": {
        "common_name": "Basilic",
        "molecules": [
            {"name": "linalool", "percentage_typical": 55, "role": "majeur", "is_signature": 1},
            {"name": "methyl chavicol", "percentage_typical": 20, "role": "majeur", "is_signature": 1},
            {"name": "eugenol", "percentage_typical": 8, "role": "secondaire", "is_signature": 0},
            {"name": "1,8-cineole", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "beta-caryophyllene", "percentage_typical": 2, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Sauge sclarée (Salvia sclarea)
    "Salvia sclarea": {
        "common_name": "Sauge sclarée",
        "molecules": [
            {"name": "linalyl acetate", "percentage_typical": 65, "role": "majeur", "is_signature": 1},
            {"name": "linalool", "percentage_typical": 15, "role": "majeur", "is_signature": 0},
            {"name": "sclareol", "percentage_typical": 3, "role": "secondaire", "is_signature": 1},
            {"name": "germacrene D", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "alpha-terpineol", "percentage_typical": 2, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Géranium (Pelargonium graveolens)
    "Pelargonium graveolens": {
        "common_name": "Géranium rosat",
        "molecules": [
            {"name": "citronellol", "percentage_typical": 30, "role": "majeur", "is_signature": 1},
            {"name": "geraniol", "percentage_typical": 15, "role": "majeur", "is_signature": 1},
            {"name": "citronellyl formate", "percentage_typical": 10, "role": "secondaire", "is_signature": 0},
            {"name": "linalool", "percentage_typical": 8, "role": "secondaire", "is_signature": 0},
            {"name": "isomenthone", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "geranyl formate", "percentage_typical": 3, "role": "trace", "is_signature": 0},
            {"name": "rose oxide", "percentage_typical": 0.5, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Néroli (Citrus aurantium)
    "Citrus aurantium": {
        "common_name": "Néroli (Bigarade)",
        "molecules": [
            {"name": "linalool", "percentage_typical": 35, "role": "majeur", "is_signature": 1},
            {"name": "limonene", "percentage_typical": 15, "role": "majeur", "is_signature": 0},
            {"name": "linalyl acetate", "percentage_typical": 8, "role": "secondaire", "is_signature": 0},
            {"name": "nerolidol", "percentage_typical": 5, "role": "secondaire", "is_signature": 1},
            {"name": "alpha-terpineol", "percentage_typical": 4, "role": "secondaire", "is_signature": 0},
            {"name": "geraniol", "percentage_typical": 3, "role": "trace", "is_signature": 0},
            {"name": "indole", "percentage_typical": 0.1, "role": "trace", "is_signature": 1},
        ]
    },
    
    # Petit grain (Citrus aurantium feuilles)
    "Citrus aurantium var. amara": {
        "common_name": "Petit grain bigarade",
        "molecules": [
            {"name": "linalyl acetate", "percentage_typical": 50, "role": "majeur", "is_signature": 1},
            {"name": "linalool", "percentage_typical": 25, "role": "majeur", "is_signature": 0},
            {"name": "alpha-terpineol", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "geranyl acetate", "percentage_typical": 3, "role": "secondaire", "is_signature": 0},
            {"name": "myrcene", "percentage_typical": 2, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Pin sylvestre (Pinus sylvestris)
    "Pinus sylvestris": {
        "common_name": "Pin sylvestre",
        "molecules": [
            {"name": "alpha-pinene", "percentage_typical": 45, "role": "majeur", "is_signature": 1},
            {"name": "beta-pinene", "percentage_typical": 25, "role": "majeur", "is_signature": 0},
            {"name": "delta-3-carene", "percentage_typical": 10, "role": "secondaire", "is_signature": 0},
            {"name": "limonene", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "bornyl acetate", "percentage_typical": 3, "role": "trace", "is_signature": 0},
            {"name": "camphene", "percentage_typical": 2, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Cyprès (Cupressus sempervirens)
    "Cupressus sempervirens": {
        "common_name": "Cyprès toujours vert",
        "molecules": [
            {"name": "alpha-pinene", "percentage_typical": 50, "role": "majeur", "is_signature": 1},
            {"name": "delta-3-carene", "percentage_typical": 20, "role": "majeur", "is_signature": 0},
            {"name": "cedrol", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "limonene", "percentage_typical": 3, "role": "secondaire", "is_signature": 0},
            {"name": "terpinolene", "percentage_typical": 2, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Genévrier (Juniperus communis)
    "Juniperus communis": {
        "common_name": "Genévrier commun",
        "molecules": [
            {"name": "alpha-pinene", "percentage_typical": 40, "role": "majeur", "is_signature": 1},
            {"name": "myrcene", "percentage_typical": 15, "role": "majeur", "is_signature": 0},
            {"name": "sabinene", "percentage_typical": 10, "role": "secondaire", "is_signature": 0},
            {"name": "limonene", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "terpinen-4-ol", "percentage_typical": 3, "role": "trace", "is_signature": 0},
            {"name": "beta-pinene", "percentage_typical": 2, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Tea tree (Melaleuca alternifolia)
    "Melaleuca alternifolia": {
        "common_name": "Tea tree",
        "molecules": [
            {"name": "terpinen-4-ol", "percentage_typical": 40, "role": "majeur", "is_signature": 1},
            {"name": "gamma-terpinene", "percentage_typical": 20, "role": "majeur", "is_signature": 0},
            {"name": "alpha-terpinene", "percentage_typical": 10, "role": "secondaire", "is_signature": 0},
            {"name": "1,8-cineole", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "alpha-terpineol", "percentage_typical": 4, "role": "secondaire", "is_signature": 0},
            {"name": "p-cymene", "percentage_typical": 3, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Citronnelle (Cymbopogon citratus)
    "Cymbopogon citratus": {
        "common_name": "Citronnelle",
        "molecules": [
            {"name": "geranial", "percentage_typical": 45, "role": "majeur", "is_signature": 1},
            {"name": "neral", "percentage_typical": 35, "role": "majeur", "is_signature": 1},
            {"name": "myrcene", "percentage_typical": 8, "role": "secondaire", "is_signature": 0},
            {"name": "geraniol", "percentage_typical": 3, "role": "trace", "is_signature": 0},
            {"name": "limonene", "percentage_typical": 2, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Palmarosa (Cymbopogon martinii)
    "Cymbopogon martinii": {
        "common_name": "Palmarosa",
        "molecules": [
            {"name": "geraniol", "percentage_typical": 80, "role": "majeur", "is_signature": 1},
            {"name": "geranyl acetate", "percentage_typical": 10, "role": "secondaire", "is_signature": 0},
            {"name": "linalool", "percentage_typical": 3, "role": "trace", "is_signature": 0},
            {"name": "beta-caryophyllene", "percentage_typical": 2, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Cardamome (Elettaria cardamomum)
    "Elettaria cardamomum": {
        "common_name": "Cardamome",
        "molecules": [
            {"name": "1,8-cineole", "percentage_typical": 35, "role": "majeur", "is_signature": 1},
            {"name": "alpha-terpinyl acetate", "percentage_typical": 35, "role": "majeur", "is_signature": 1},
            {"name": "linalool", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "linalyl acetate", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "limonene", "percentage_typical": 3, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Coriandre (Coriandrum sativum)
    "Coriandrum sativum": {
        "common_name": "Coriandre",
        "molecules": [
            {"name": "linalool", "percentage_typical": 70, "role": "majeur", "is_signature": 1},
            {"name": "gamma-terpinene", "percentage_typical": 8, "role": "secondaire", "is_signature": 0},
            {"name": "alpha-pinene", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "camphor", "percentage_typical": 4, "role": "secondaire", "is_signature": 0},
            {"name": "geranyl acetate", "percentage_typical": 3, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Poivre noir (Piper nigrum)
    "Piper nigrum": {
        "common_name": "Poivre noir",
        "molecules": [
            {"name": "beta-caryophyllene", "percentage_typical": 30, "role": "majeur", "is_signature": 1},
            {"name": "limonene", "percentage_typical": 20, "role": "majeur", "is_signature": 0},
            {"name": "sabinene", "percentage_typical": 15, "role": "secondaire", "is_signature": 0},
            {"name": "alpha-pinene", "percentage_typical": 10, "role": "secondaire", "is_signature": 0},
            {"name": "beta-pinene", "percentage_typical": 8, "role": "secondaire", "is_signature": 0},
            {"name": "delta-3-carene", "percentage_typical": 5, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Muscade (Myristica fragrans)
    "Myristica fragrans": {
        "common_name": "Muscade",
        "molecules": [
            {"name": "sabinene", "percentage_typical": 25, "role": "majeur", "is_signature": 1},
            {"name": "alpha-pinene", "percentage_typical": 20, "role": "majeur", "is_signature": 0},
            {"name": "myristicin", "percentage_typical": 8, "role": "secondaire", "is_signature": 1},
            {"name": "terpinen-4-ol", "percentage_typical": 6, "role": "secondaire", "is_signature": 0},
            {"name": "limonene", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "safrole", "percentage_typical": 2, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Camomille romaine (Chamaemelum nobile)
    "Chamaemelum nobile": {
        "common_name": "Camomille romaine",
        "molecules": [
            {"name": "isobutyl angelate", "percentage_typical": 35, "role": "majeur", "is_signature": 1},
            {"name": "isoamyl angelate", "percentage_typical": 15, "role": "majeur", "is_signature": 0},
            {"name": "alpha-pinene", "percentage_typical": 10, "role": "secondaire", "is_signature": 0},
            {"name": "pinocarvone", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "trans-pinocarveol", "percentage_typical": 3, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Camomille allemande (Matricaria chamomilla)
    "Matricaria chamomilla": {
        "common_name": "Camomille allemande",
        "molecules": [
            {"name": "chamazulene", "percentage_typical": 5, "role": "secondaire", "is_signature": 1},
            {"name": "alpha-bisabolol", "percentage_typical": 25, "role": "majeur", "is_signature": 1},
            {"name": "bisabolol oxide A", "percentage_typical": 20, "role": "majeur", "is_signature": 0},
            {"name": "bisabolol oxide B", "percentage_typical": 10, "role": "secondaire", "is_signature": 0},
            {"name": "farnesene", "percentage_typical": 15, "role": "majeur", "is_signature": 0},
        ]
    },
    
    # Hélichryse (Helichrysum italicum)
    "Helichrysum italicum": {
        "common_name": "Immortelle",
        "molecules": [
            {"name": "neryl acetate", "percentage_typical": 35, "role": "majeur", "is_signature": 1},
            {"name": "italidione", "percentage_typical": 8, "role": "secondaire", "is_signature": 1},
            {"name": "gamma-curcumene", "percentage_typical": 10, "role": "secondaire", "is_signature": 0},
            {"name": "limonene", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "alpha-pinene", "percentage_typical": 3, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Fenouil (Foeniculum vulgare)
    "Foeniculum vulgare": {
        "common_name": "Fenouil",
        "molecules": [
            {"name": "trans-anethole", "percentage_typical": 75, "role": "majeur", "is_signature": 1},
            {"name": "fenchone", "percentage_typical": 10, "role": "secondaire", "is_signature": 0},
            {"name": "methyl chavicol", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "limonene", "percentage_typical": 3, "role": "trace", "is_signature": 0},
            {"name": "alpha-pinene", "percentage_typical": 2, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Anis étoilé (Illicium verum)
    "Illicium verum": {
        "common_name": "Anis étoilé",
        "molecules": [
            {"name": "trans-anethole", "percentage_typical": 90, "role": "majeur", "is_signature": 1},
            {"name": "limonene", "percentage_typical": 3, "role": "trace", "is_signature": 0},
            {"name": "linalool", "percentage_typical": 1, "role": "trace", "is_signature": 0},
            {"name": "estragole", "percentage_typical": 1, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Cumin (Cuminum cyminum)
    "Cuminum cyminum": {
        "common_name": "Cumin",
        "molecules": [
            {"name": "cuminaldehyde", "percentage_typical": 35, "role": "majeur", "is_signature": 1},
            {"name": "gamma-terpinene", "percentage_typical": 15, "role": "majeur", "is_signature": 0},
            {"name": "beta-pinene", "percentage_typical": 12, "role": "secondaire", "is_signature": 0},
            {"name": "p-cymene", "percentage_typical": 10, "role": "secondaire", "is_signature": 0},
            {"name": "safranal", "percentage_typical": 3, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Carvi (Carum carvi)
    "Carum carvi": {
        "common_name": "Carvi",
        "molecules": [
            {"name": "carvone", "percentage_typical": 55, "role": "majeur", "is_signature": 1},
            {"name": "limonene", "percentage_typical": 40, "role": "majeur", "is_signature": 0},
            {"name": "myrcene", "percentage_typical": 1, "role": "trace", "is_signature": 0},
            {"name": "trans-dihydrocarvone", "percentage_typical": 1, "role": "trace", "is_signature": 0},
        ]
    },
    
    # Menthe verte (Mentha spicata)
    "Mentha spicata": {
        "common_name": "Menthe verte",
        "molecules": [
            {"name": "carvone", "percentage_typical": 60, "role": "majeur", "is_signature": 1},
            {"name": "limonene", "percentage_typical": 15, "role": "majeur", "is_signature": 0},
            {"name": "1,8-cineole", "percentage_typical": 5, "role": "secondaire", "is_signature": 0},
            {"name": "dihydrocarvone", "percentage_typical": 3, "role": "trace", "is_signature": 0},
            {"name": "myrcene", "percentage_typical": 2, "role": "trace", "is_signature": 0},
        ]
    },
}

def generate_csv_output():
    """Génère un fichier CSV avec toutes les relations plante-molécule"""
    output_rows = []
    
    for latin_name, data in ESSENTIAL_OIL_COMPOSITIONS.items():
        common_name = data["common_name"]
        for mol in data["molecules"]:
            output_rows.append({
                "plant_latin_name": latin_name,
                "plant_common_name": common_name,
                "molecule_name": mol["name"],
                "percentage_typical": mol["percentage_typical"],
                "role": mol["role"],
                "is_signature": mol["is_signature"],
                "evidence": "littérature scientifique (EssOilDB, AromaDb)",
                "notes": f"Composition typique de l'huile essentielle de {common_name}"
            })
    
    return output_rows

def main():
    # Générer le CSV
    rows = generate_csv_output()
    
    output_path = "/home/ubuntu/perfumum-research/data/enriched_plant_molecules.csv"
    
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=[
            "plant_latin_name", "plant_common_name", "molecule_name", 
            "percentage_typical", "role", "is_signature", "evidence", "notes"
        ])
        writer.writeheader()
        writer.writerows(rows)
    
    print(f"Fichier généré: {output_path}")
    print(f"Nombre de relations: {len(rows)}")
    print(f"Nombre de plantes: {len(ESSENTIAL_OIL_COMPOSITIONS)}")
    
    # Compter les molécules uniques
    unique_molecules = set(row["molecule_name"] for row in rows)
    print(f"Nombre de molécules uniques: {len(unique_molecules)}")

if __name__ == "__main__":
    main()
