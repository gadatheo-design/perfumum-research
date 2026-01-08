/**
 * Script pour importer les références bibliographiques depuis les fichiers JSON
 * Usage: node scripts/import-bibliography.mjs
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Données des références à importer
const bibliographyData = {
  "olfactory_heritage_and_ritual_plants": [
    {
      "id": "B-OH-001",
      "type": "Publication Académique",
      "author": "Bembibre, C., & Strlič, M.",
      "year": 2017,
      "title": "Smell of heritage: a framework for the identification, analysis and archival of historic odours",
      "publication": "Heritage Science",
      "url": "https://www.nature.com/articles/s40494-016-0114-1"
    },
    {
      "id": "B-OH-002",
      "type": "Publication Académique",
      "author": "Kaiser, R.",
      "year": 2004,
      "title": "Vanishing flora–lost chemistry: The scents of endangered plants around the world",
      "publication": "Chemistry & Biodiversity",
      "url": "https://onlinelibrary.wiley.com/doi/abs/10.1002/cbdv.200490005"
    },
    {
      "id": "B-OH-003",
      "type": "Rapport",
      "author": "Organisation Mondiale de la Santé (OMS)",
      "year": 2022,
      "title": "Critical review report: Coca leaf",
      "url": "https://cdn.who.int/media/docs/default-source/controlled-substances/48th-ecdd/3.1.1_-coca-leaf.pdf"
    },
    {
      "id": "B-OH-004",
      "type": "Livre",
      "author": "Kaiser, R.",
      "year": 2011,
      "title": "Scent of the Vanishing Flora",
      "publisher": "Verlag Helvetica Chimica Acta"
    },
    {
      "id": "B-OH-005",
      "type": "Site Web / Article",
      "author": "National Geographic",
      "year": 2022,
      "title": "This plant no longer exists, but you can still smell it",
      "url": "https://www.nationalgeographic.com/magazine/article/this-plant-no-longer-exists-but-you-can-still-smell-it"
    },
    {
      "id": "B-OH-006",
      "type": "Site Web / Projet",
      "author": "Odeuropa Project",
      "title": "Smell Heritage – Sensory Mining",
      "url": "https://odeuropa.eu/"
    },
    {
      "id": "B-OH-007",
      "type": "Site Web / Projet",
      "author": "Resurrecting the Sublime",
      "title": "About the project to resurrect the scents of extinct flowers",
      "url": "https://www.resurrectingthesublime.com/about"
    }
  ],
  "tobacco_and_cannabis": [
    {
      "id": "B-TC-001",
      "type": "Livre",
      "author": "Clarke, R. C., & Merlin, M. D.",
      "year": 2016,
      "title": "Cannabis: Evolution and Ethnobotany",
      "publisher": "University of California Press",
      "url": "https://books.google.com/books?id=bs4hEAAAQBAJ"
    },
    {
      "id": "B-TC-002",
      "type": "Article Scientifique",
      "author": "Russo, E. B.",
      "year": 2011,
      "title": "Taming THC: potential cannabis synergy and phytocannabinoid-terpenoid entourage effects",
      "publication": "British Journal of Pharmacology",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC3165946/"
    },
    {
      "id": "B-TC-003",
      "type": "Article Scientifique",
      "author": "Ren, M., et al.",
      "year": 2019,
      "title": "The origins of cannabis smoking: Chemical residue evidence from the first millennium BCE in the Pamirs",
      "publication": "Science Advances",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6561734/"
    },
    {
      "id": "B-TC-004",
      "type": "Article Scientifique",
      "author": "Popova, V., et al.",
      "year": 2019,
      "title": "Carotenoid-Related Volatile Compounds of Tobacco (Nicotiana tabacum L.) Essential Oils",
      "publication": "Molecules",
      "url": "https://www.mdpi.com/1420-3049/24/19/3446"
    },
    {
      "id": "B-TC-005",
      "type": "Article Scientifique",
      "author": "Nahas, G. G.",
      "year": 1982,
      "title": "Hashish in Islam 9th to 18th century",
      "publication": "Bulletin of the New York Academy of Medicine",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC1805385/"
    },
    {
      "id": "B-TC-006",
      "type": "Site Web / Article",
      "author": "Harvard Divinity School (CSWR)",
      "title": "Tobacco: America's Master Plant",
      "url": "https://cswr.hds.harvard.edu/news/2025/10/21/tobacco-americas-master-plant"
    }
  ],
  "terpenes_research": [
    {
      "id": "B-TR-001",
      "type": "Article Scientifique",
      "author": "Sommano, S. R., et al.",
      "year": 2020,
      "title": "Terpenes and Terpenoids in Cannabis sativa",
      "publication": "Food Chemistry",
      "url": "https://doi.org/10.1016/j.foodchem.2020.127491"
    },
    {
      "id": "B-TR-002",
      "type": "Article Scientifique",
      "author": "Antonelli, M., et al.",
      "year": 2020,
      "title": "Terpenes from Forests and Human Health",
      "publication": "Toxins",
      "url": "https://doi.org/10.3390/toxins12040232"
    },
    {
      "id": "B-TR-003",
      "type": "Article Scientifique",
      "author": "Irmisch, S., et al.",
      "year": 2014,
      "title": "Terpene Synthases and Their Contribution to Herbivore-Induced Volatile Emission in Western Balsam Poplar",
      "publication": "BMC Plant Biology",
      "url": "https://doi.org/10.1186/1471-2229-14-270"
    }
  ]
};

// Générer le SQL pour l'import
console.log('-- Import des références bibliographiques PERFUMUM');
console.log('-- Généré le:', new Date().toISOString());
console.log('');

const typeMap = {
  'Publication Académique': 'article',
  'Article Scientifique': 'article',
  'Livre': 'book',
  'Rapport': 'techreport',
  'Site Web / Article': 'online',
  'Site Web / Projet': 'online',
};

const domainMap = {
  'olfactory_heritage_and_ritual_plants': 'patrimoine_olfactif',
  'tobacco_and_cannabis': 'tabac_cannabis',
  'terpenes_research': 'chimie_olfactive',
};

for (const [category, entries] of Object.entries(bibliographyData)) {
  console.log(`-- Catégorie: ${category}`);
  
  for (const entry of entries) {
    const authorPart = entry.author?.split(',')[0]?.split(' ').pop()?.toLowerCase() || 'unknown';
    const yearPart = entry.year || 'nd';
    const titlePart = entry.title.split(' ').slice(0, 2).join('').toLowerCase().replace(/[^a-z]/g, '');
    const entryKey = `${authorPart}${yearPart}${titlePart}`;
    
    const entryType = typeMap[entry.type] || 'misc';
    const researchDomain = domainMap[category] || 'autre';
    
    const escapeSql = (str) => str ? str.replace(/'/g, "''") : null;
    
    console.log(`INSERT INTO bibliography_entries (entry_key, entry_type, title, authors, year, journal, publisher, url, research_domain, read_status) VALUES (
  '${entryKey}',
  '${entryType}',
  '${escapeSql(entry.title)}',
  ${entry.author ? `'${escapeSql(entry.author)}'` : 'NULL'},
  ${entry.year || 'NULL'},
  ${entry.publication ? `'${escapeSql(entry.publication)}'` : 'NULL'},
  ${entry.publisher ? `'${escapeSql(entry.publisher)}'` : 'NULL'},
  ${entry.url ? `'${escapeSql(entry.url)}'` : 'NULL'},
  '${researchDomain}',
  'a_lire'
) ON DUPLICATE KEY UPDATE title = VALUES(title);`);
    console.log('');
  }
}

console.log('-- Fin de import');
