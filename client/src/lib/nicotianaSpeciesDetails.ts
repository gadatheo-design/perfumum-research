/**
 * Détails complets des espèces Nicotiana
 * Morphologie, distribution géographique, et profils moléculaires
 * Basé sur Santilli et al. (2022) et littérature scientifique complémentaire
 */

export interface SpeciesMorphology {
  height?: string;
  stems?: string;
  leaves?: string;
  flowers?: string;
  fruits?: string;
  otherFeatures?: string;
}

export interface GeographicDistribution {
  countries: string[];
  regions?: string[];
  habitat?: string;
  altitude?: string;
  climate?: string;
}

export interface MolecularProfile {
  primaryAlkaloids?: string[];
  secondaryAlkaloids?: string[];
  volatileCompounds?: string[];
  terpenoids?: string[];
  phenolics?: string[];
  gcmsSignature?: string;
  notes?: string;
}

export interface ConservationInfo {
  status: 'CR' | 'EN' | 'VU' | 'NT' | 'LC' | 'DD' | 'EX';
  threats?: string[];
  conservationActions?: string[];
  populationTrend?: 'increasing' | 'stable' | 'decreasing' | 'unknown';
}

export interface NicotianaSpeciesDetail {
  id: string;
  latinName: string;
  commonNames?: string[];
  section: string;
  morphology: SpeciesMorphology;
  distribution: GeographicDistribution;
  molecularProfile: MolecularProfile;
  conservation?: ConservationInfo;
  uses?: string[];
  ethnobotany?: string;
  notes?: string;
  references?: string[];
}

export const nicotianaSpeciesDetails: Record<string, NicotianaSpeciesDetail> = {
  'n-rupicola': {
    id: 'n-rupicola',
    latinName: 'Nicotiana rupicola',
    commonNames: ['Rocky Tobacco (English)', 'Tabaco de Roca (Spanish)'],
    section: 'Paniculatae',
    morphology: {
      height: '30-80 cm',
      stems: 'Herbaceous, glabrous to sparsely pubescent',
      leaves: 'Lanceolate to linear-lanceolate, 3-8 cm long, glabrous, margins entire',
      flowers: 'Tubular, 12-15 mm long, greenish-yellow to pale green, nocturnal',
      fruits: 'Capsules, 8-10 mm long, containing numerous small seeds',
      otherFeatures: 'Sticky glandular hairs on inflorescence, sweet fragrance at night'
    },
    distribution: {
      countries: ['Chile'],
      regions: ['Coquimbo Region (IV Región de Coquimbo)'],
      habitat: 'Rocky slopes and cliffs, xerophytic vegetation',
      altitude: '800-1200 m',
      climate: 'Semi-arid Mediterranean'
    },
    molecularProfile: {
      primaryAlkaloids: ['Nicotine (0.5-1.2%)', 'Nornicotine'],
      secondaryAlkaloids: ['Anabasine', 'Anatabine'],
      volatileCompounds: ['Limonene', 'Pinene', 'Myrcene'],
      terpenoids: ['α-Pinene', 'β-Myrcene', 'Limonene', 'Linalool'],
      phenolics: ['Chlorogenic acid', 'Caffeic acid'],
      gcmsSignature: 'Characteristic terpene-rich profile with low nicotine',
      notes: 'Unique volatile profile distinct from N. cordifolia and N. solanifolia'
    },
    conservation: {
      status: 'CR',
      threats: ['Habitat loss due to mining activities', 'Urbanization', 'Restricted distribution'],
      conservationActions: ['Protected area designation recommended', 'Ex-situ conservation'],
      populationTrend: 'decreasing'
    },
    uses: ['Endemic species of scientific interest', 'Potential source of novel alkaloids'],
    ethnobotany: 'Not traditionally used by local communities due to recent discovery',
    notes: 'New species described in 2022. Sister species to N. cordifolia. Endemic to a small area in Coquimbo.',
    references: ['Santilli et al. 2022', 'PhytoKeys 188: 83-103']
  },

  'n-knightiana': {
    id: 'n-knightiana',
    latinName: 'Nicotiana knightiana',
    commonNames: ['Knight\'s Tobacco (English)', 'Tabaco de Knight (Spanish)'],
    section: 'Paniculatae',
    morphology: {
      height: '40-100 cm',
      stems: 'Herbaceous, pubescent with glandular hairs',
      leaves: 'Ovate to lanceolate, 5-12 cm long, pubescent, margins entire to slightly undulate',
      flowers: 'Tubular, 15-18 mm long, greenish-white to pale yellow',
      fruits: 'Capsules, 10-12 mm long',
      otherFeatures: 'Strongly aromatic, glandular pubescence throughout'
    },
    distribution: {
      countries: ['Peru', 'Chile'],
      regions: ['Tacna Department (Peru)', 'Atacama Region (Chile)', 'Coquimbo Region (Chile)'],
      habitat: 'Coastal and near-coastal xerophytic vegetation',
      altitude: '100-800 m',
      climate: 'Hyper-arid to semi-arid'
    },
    molecularProfile: {
      primaryAlkaloids: ['Nicotine (0.8-1.5%)', 'Nornicotine'],
      secondaryAlkaloids: ['Anabasine', 'Anatabine'],
      volatileCompounds: ['Limonene', 'Pinene', 'Geraniol'],
      terpenoids: ['Geraniol', 'Linalool', 'α-Pinene'],
      phenolics: ['Chlorogenic acid', 'Ferulic acid'],
      gcmsSignature: 'Geraniol-rich profile, higher nicotine than N. rupicola',
      notes: 'Aromatic profile suggests potential ornamental and fragrance applications'
    },
    conservation: {
      status: 'LC',
      threats: ['Habitat degradation', 'Coastal development'],
      conservationActions: ['Monitoring recommended'],
      populationTrend: 'stable'
    },
    uses: ['Ornamental potential', 'Fragrance applications', 'Scientific research'],
    ethnobotany: 'Used traditionally in southern Peru for medicinal purposes (respiratory health)',
    notes: 'First record for Chile flora (2022). Known from coastal Peru for decades. Recently discovered in Atacama and Coquimbo regions.',
    references: ['Santilli et al. 2022', 'PhytoKeys 188: 83-103']
  },

  'n-cordifolia': {
    id: 'n-cordifolia',
    latinName: 'Nicotiana cordifolia',
    commonNames: ['Heart-leaved Tobacco (English)', 'Tabaco Cordifolia (Spanish)'],
    section: 'Paniculatae',
    morphology: {
      height: '50-120 cm',
      stems: 'Woody at base, pubescent',
      leaves: 'Cordate to ovate, 8-15 cm long, pubescent, margins entire',
      flowers: 'Tubular, 18-20 mm long, pink to red',
      fruits: 'Capsules, 12-14 mm long',
      otherFeatures: 'Heart-shaped leaves distinctive, aromatic foliage'
    },
    distribution: {
      countries: ['Chile'],
      regions: ['Juan Fernández Archipelago (Más a Tierra, Alejandro Selkirk)'],
      habitat: 'Endemic to Juan Fernández Islands, cloud forest and scrubland',
      altitude: '200-600 m',
      climate: 'Temperate oceanic'
    },
    molecularProfile: {
      primaryAlkaloids: ['Nicotine (0.6-1.3%)', 'Nornicotine'],
      secondaryAlkaloids: ['Anabasine'],
      volatileCompounds: ['Limonene', 'Pinene', 'Myrcene', 'Caryophyllene'],
      terpenoids: ['β-Caryophyllene', 'α-Humulene', 'Limonene'],
      phenolics: ['Chlorogenic acid', 'Caffeic acid', 'Quercetin'],
      gcmsSignature: 'Sesquiterpene-rich profile, island endemic signature',
      notes: 'Unique island endemic profile reflecting isolation'
    },
    conservation: {
      status: 'VU',
      threats: ['Habitat loss', 'Invasive species', 'Limited distribution'],
      conservationActions: ['Protected in Juan Fernández National Park', 'Ex-situ conservation'],
      populationTrend: 'decreasing'
    },
    uses: ['Endemic species of conservation interest', 'Scientific research'],
    ethnobotany: 'Not traditionally used by local communities',
    notes: 'Sister species to N. rupicola. Endemic to Juan Fernández Islands. Important for understanding island biogeography.',
    references: ['Santilli et al. 2022', 'Muñoz-Schick 1980']
  },

  'n-solanifolia': {
    id: 'n-solanifolia',
    latinName: 'Nicotiana solanifolia',
    commonNames: ['Solanum-leaved Tobacco (English)', 'Tabaco Solanifolia (Spanish)'],
    section: 'Paniculatae',
    morphology: {
      height: '60-150 cm',
      stems: 'Herbaceous, glabrous to sparsely pubescent',
      leaves: 'Ovate to lanceolate, 8-20 cm long, glabrous to pubescent, margins entire',
      flowers: 'Tubular, 20-25 mm long, greenish-white to pale yellow',
      fruits: 'Capsules, 12-15 mm long',
      otherFeatures: 'Tall robust plants, large leaves'
    },
    distribution: {
      countries: ['Chile'],
      regions: ['Tarapacá Region (I Región)', 'Antofagasta Region (II Región)', 'Atacama Region (III Región)', 'Coquimbo Region (IV Región)'],
      habitat: 'Coastal and near-coastal xerophytic vegetation, river valleys',
      altitude: '0-1000 m',
      climate: 'Hyper-arid to semi-arid'
    },
    molecularProfile: {
      primaryAlkaloids: ['Nicotine (1.0-1.8%)', 'Nornicotine'],
      secondaryAlkaloids: ['Anabasine', 'Anatabine'],
      volatileCompounds: ['Limonene', 'Pinene', 'Myrcene', 'Linalool'],
      terpenoids: ['Linalool', 'Geraniol', 'α-Pinene'],
      phenolics: ['Chlorogenic acid', 'Caffeic acid', 'Ferulic acid'],
      gcmsSignature: 'Linalool-rich profile, moderate to high nicotine content',
      notes: 'Most aromatic of the Paniculatae section, potential for fragrance applications'
    },
    conservation: {
      status: 'LC',
      threats: ['Habitat degradation', 'Water scarcity'],
      conservationActions: ['Monitoring in river valleys'],
      populationTrend: 'stable'
    },
    uses: ['Traditional medicinal use', 'Fragrance applications', 'Ethnobotanical research'],
    ethnobotany: 'Used traditionally by Atacama coastal communities for respiratory health and wound healing. Called "Tabaco del Desierto" (Desert Tobacco) locally.',
    notes: 'Grows between Tarapacá and Coquimbo regions. Important cultural significance in Atacama communities.',
    references: ['Santilli et al. 2022', 'Muñoz-Schick 1980']
  },

  'n-tabacum': {
    id: 'n-tabacum',
    latinName: 'Nicotiana tabacum',
    commonNames: ['Cultivated Tobacco (English)', 'Tabac (French)', 'Tabaco (Spanish)'],
    section: 'Alatae',
    morphology: {
      height: '100-250 cm',
      stems: 'Herbaceous, robust, glabrous',
      leaves: 'Lanceolate to oblong, 30-60 cm long, glabrous, margins entire',
      flowers: 'Tubular, 25-30 mm long, pink to red',
      fruits: 'Capsules, 15-20 mm long, many-seeded',
      otherFeatures: 'Large leaves, sticky glandular hairs on inflorescence'
    },
    distribution: {
      countries: ['Worldwide (cultivated)', 'Originally from South America'],
      regions: ['Native to tropical South America', 'Now cultivated globally'],
      habitat: 'Agricultural fields, disturbed areas',
      altitude: '0-2000 m',
      climate: 'Tropical to temperate'
    },
    molecularProfile: {
      primaryAlkaloids: ['Nicotine (0.5-9%)', 'Nornicotine'],
      secondaryAlkaloids: ['Anabasine', 'Anatabine', 'Cotinine'],
      volatileCompounds: ['Limonene', 'Pinene', 'Myrcene', 'Linalool', 'Geraniol'],
      terpenoids: ['Solanone', 'Megastigmatrienone'],
      phenolics: ['Chlorogenic acid', 'Caffeic acid', 'Ferulic acid', 'Quercetin'],
      gcmsSignature: 'Complex profile with high nicotine, characteristic curing compounds',
      notes: 'Alkaloid content varies greatly by variety and growing conditions'
    },
    conservation: {
      status: 'LC',
      threats: [],
      conservationActions: [],
      populationTrend: 'stable'
    },
    uses: ['Tobacco production', 'Ornamental varieties', 'Scientific research', 'Pharmaceutical research'],
    ethnobotany: 'Extensively used historically and currently for smoking, chewing, and snuff. Central to many indigenous cultures.',
    notes: 'Most economically important Nicotiana species. Hundreds of cultivars exist with varying alkaloid profiles.',
    references: ['Saitama et al. 2022', 'Tobacco Research Institute publications']
  },

  'n-rustica': {
    id: 'n-rustica',
    latinName: 'Nicotiana rustica',
    commonNames: ['Aztec Tobacco (English)', 'Tabaco Azteca (Spanish)', 'Mapacho (Quechua)'],
    section: 'Paniculatae',
    morphology: {
      height: '60-150 cm',
      stems: 'Herbaceous, robust, pubescent',
      leaves: 'Ovate to lanceolate, 15-30 cm long, pubescent, margins entire',
      flowers: 'Tubular, 20-25 mm long, greenish-yellow',
      fruits: 'Capsules, 12-15 mm long',
      otherFeatures: 'Compact growth, smaller leaves than N. tabacum'
    },
    distribution: {
      countries: ['South America (native)', 'Now cultivated globally'],
      regions: ['Andean region (Peru, Bolivia, Ecuador)', 'Amazonian region'],
      habitat: 'Agricultural fields, disturbed areas, cloud forests',
      altitude: '500-3000 m',
      climate: 'Tropical to subtropical'
    },
    molecularProfile: {
      primaryAlkaloids: ['Nicotine (4-12%)', 'Nornicotine'],
      secondaryAlkaloids: ['Anabasine', 'Anatabine'],
      volatileCompounds: ['Limonene', 'Pinene', 'Myrcene', 'Linalool'],
      terpenoids: ['Solanone', 'Megastigmatrienone'],
      phenolics: ['Chlorogenic acid', 'Caffeic acid'],
      gcmsSignature: 'Very high nicotine content, distinctive alkaloid profile',
      notes: 'Highest nicotine content of cultivated tobacco species'
    },
    conservation: {
      status: 'LC',
      threats: [],
      conservationActions: [],
      populationTrend: 'stable'
    },
    uses: ['Traditional tobacco use', 'Shamanic rituals', 'Ornamental varieties', 'Pesticide research'],
    ethnobotany: 'Sacred plant in many Andean and Amazonian cultures. Used in shamanic ceremonies and traditional medicine. Called "Mapacho" in Quechua.',
    notes: 'Higher nicotine content than N. tabacum. Important in indigenous cultures. Used as natural pesticide.',
    references: ['Santilli et al. 2022', 'Indigenous ethnobotany literature']
  },

  'n-glauca': {
    id: 'n-glauca',
    latinName: 'Nicotiana glauca',
    commonNames: ['Tree Tobacco (English)', 'Tabaco Árbol (Spanish)', 'Mustard Tree'],
    section: 'Noctiflorae',
    morphology: {
      height: '1-4 m',
      stems: 'Woody, tree-like, glabrous, blue-green',
      leaves: 'Ovate to lanceolate, 10-20 cm long, glabrous, glaucous, margins entire',
      flowers: 'Tubular, 20-25 mm long, yellow to greenish-yellow',
      fruits: 'Capsules, 12-15 mm long',
      otherFeatures: 'Only tree-like Nicotiana species, blue-green stems and leaves'
    },
    distribution: {
      countries: ['Argentina (native)', 'Now naturalized in Mediterranean regions, Australia, South Africa'],
      regions: ['Native to northwestern Argentina', 'Invasive in Mediterranean climates'],
      habitat: 'Riparian areas, disturbed habitats, semi-arid regions',
      altitude: '0-2000 m',
      climate: 'Semi-arid to arid'
    },
    molecularProfile: {
      primaryAlkaloids: ['Nicotine (0.1-0.3%)', 'Nornicotine', 'Anabasine (high)'],
      secondaryAlkaloids: ['Anatabine', 'Cotinine'],
      volatileCompounds: ['Limonene', 'Pinene', 'Myrcene'],
      terpenoids: ['α-Pinene', 'β-Myrcene'],
      phenolics: ['Chlorogenic acid', 'Caffeic acid'],
      gcmsSignature: 'Low nicotine, high anabasine content, distinctive profile',
      notes: 'Toxic to livestock due to high anabasine content'
    },
    conservation: {
      status: 'LC',
      threats: [],
      conservationActions: [],
      populationTrend: 'increasing'
    },
    uses: ['Ornamental (in some regions)', 'Research on alkaloid production', 'Invasive species management'],
    ethnobotany: 'Not traditionally used due to toxicity',
    notes: 'Only tree-like Nicotiana. Invasive in Mediterranean climates. Toxic to livestock.',
    references: ['Santilli et al. 2022', 'Invasive species literature']
  },

  'n-alata': {
    id: 'n-alata',
    latinName: 'Nicotiana alata',
    commonNames: ['Winged Tobacco (English)', 'Tabaco Alado (Spanish)', 'Flowering Tobacco'],
    section: 'Alatae',
    morphology: {
      height: '60-120 cm',
      stems: 'Herbaceous, pubescent, winged',
      leaves: 'Lanceolate, 8-15 cm long, pubescent, margins entire',
      flowers: 'Tubular, 25-30 mm long, white to pink to red (variable)',
      fruits: 'Capsules, 12-15 mm long',
      otherFeatures: 'Winged stems, fragrant flowers, popular ornamental'
    },
    distribution: {
      countries: ['Argentina (native)', 'Now cultivated worldwide'],
      regions: ['Native to northwestern Argentina', 'Cultivated globally as ornamental'],
      habitat: 'Disturbed areas, gardens, ornamental cultivation',
      altitude: '500-2000 m',
      climate: 'Subtropical to temperate'
    },
    molecularProfile: {
      primaryAlkaloids: ['Nicotine (0.3-0.8%)', 'Nornicotine'],
      secondaryAlkaloids: ['Anabasine', 'Anatabine'],
      volatileCompounds: ['Limonene', 'Pinene', 'Myrcene', 'Linalool', 'Geraniol'],
      terpenoids: ['Linalool', 'Geraniol', 'Nerolidol'],
      phenolics: ['Chlorogenic acid', 'Caffeic acid'],
      gcmsSignature: 'Fragrant profile with linalool and geraniol, low nicotine',
      notes: 'Fragrance profile makes it attractive for ornamental use'
    },
    conservation: {
      status: 'LC',
      threats: [],
      conservationActions: [],
      populationTrend: 'stable'
    },
    uses: ['Ornamental cultivation', 'Fragrance research', 'Ornamental breeding'],
    ethnobotany: 'Not traditionally used',
    notes: 'Popular ornamental plant due to fragrant flowers and winged stems. Many cultivars available.',
    references: ['Santilli et al. 2022', 'Ornamental plant literature']
  }
};

// Fonction pour obtenir les détails d'une espèce
export function getSpeciesDetail(speciesId: string): NicotianaSpeciesDetail | undefined {
  return nicotianaSpeciesDetails[speciesId];
}

// Fonction pour obtenir toutes les espèces d'une section
export function getSpeciesBySection(section: string): NicotianaSpeciesDetail[] {
  return Object.values(nicotianaSpeciesDetails).filter(species => species.section === section);
}

// Fonction pour rechercher des espèces par propriété
export function searchSpecies(query: string): NicotianaSpeciesDetail[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(nicotianaSpeciesDetails).filter(species => 
    species.latinName.toLowerCase().includes(lowerQuery) ||
    species.commonNames?.some(name => name.toLowerCase().includes(lowerQuery)) ||
    species.distribution.countries.some(country => country.toLowerCase().includes(lowerQuery))
  );
}
