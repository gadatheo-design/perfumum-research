/**
 * PERFUMUM - Script d'import des données NEZ
 * Import des axes de recherche, articles sources et mappings
 */

import fs from 'fs';
import path from 'path';

// Données des axes de recherche NEZ (depuis data_research_axes_nez.csv)
const researchAxes = [
  {
    axis_id: 'AX_OLFACTION_METABOLISM',
    slug: 'olfaction-metabolism-glp1',
    title_fr: 'Olfaction ↔ métabolisme (phase céphalique, GLP‑1, insuline)',
    title_en: 'Olfaction ↔ metabolism (cephalic phase, GLP‑1, insulin)',
    novelty_tagline: 'Traiter l\'odeur comme déclencheur physiologique mesurable (avant ingestion).',
    ui_module: 'ResearchAxisPage + StudyCards + Glossary + MechanismDiagram',
    core_entities: 'Study, Mechanism, Biomarker, OdorStimulus',
    kpis: 'CTR études; temps lecture; exports; sauvegardes',
    default_filters_json: { categories: ['Science', 'Nez x GDR O3'], keywords: ['GLP-1', 'insulin', 'bulbe olfactif'] },
    description_fr: 'Axe centré sur la communication nez-cerveau-organes (ex. pancréas) et les réponses métaboliques anticipatoires déclenchées par des odeurs alimentaires. Utile pour un chapitre \'olfaction & corps\' et pour relier molécules/notes à des mécanismes (sans promesses médicales).',
    description_en: 'Axis focused on nose–brain–organ communication and anticipatory metabolic responses triggered by food-related odors; useful for a \'olfaction & body\' section linking molecules/notes to mechanisms (without medical claims).'
  },
  {
    axis_id: 'AX_RECEPTOR_STRUCTURES',
    slug: 'olfactory-receptors-cryo-em-or51e2',
    title_fr: 'Récepteurs olfactifs \'visibles\' (cryo‑EM, OR51E2, ligand-binding)',
    title_en: 'Olfactory receptors made visible (cryo‑EM, OR51E2, ligand binding)',
    novelty_tagline: 'Passer du discours \'notes\' à un modèle récepteur→ligand→signal.',
    ui_module: 'ReceptorExplorer + LigandTables + EvidenceLevels',
    core_entities: 'Receptor, Ligand, Evidence, Structure',
    kpis: 'recherches; clics ligands; annotations',
    default_filters_json: { keywords: ['OR51E2', 'cryo-electron microscopy', 'odorant receptor'] },
    description_fr: 'Axe biochimie/biophysique : pages OR (récepteurs), ligands, notes associées, niveau de preuve. Permet de connecter perfumerie, neurosciences et data.',
    description_en: 'Biochemistry/biophysics axis: receptor pages, ligands, associated notes, evidence levels; bridges perfumery, neuroscience, and data.'
  },
  {
    axis_id: 'AX_CHEMOSIGNALS_EMOTION',
    slug: 'chemosignals-positive-emotion-contagion',
    title_fr: 'Chimio‑communication & contagion émotionnelle (y compris positif)',
    title_en: 'Chemical communication & emotional contagion (including positive)',
    novelty_tagline: 'Tester l\'émotion transmise par odeur (pas seulement le stress).',
    ui_module: 'ProtocolViewer + BodyOdorDataset + InstallationRecipes',
    core_entities: 'Protocol, Sample, Condition, Outcome',
    kpis: 'sauvegardes; exports; créations de scènes',
    default_filters_json: { keywords: ['positive emotions', 'sweat', 'emotional contagion'] },
    description_fr: 'Axe sur les signaux chimiques humains et la façon dont un parfum les masque, module ou coexiste. Utile pour déclinaison parfum↔encens↔espace.',
    description_en: 'Axis on human chemical signals and how fragrance masks/modulates/coexists; ideal for perfume↔incense↔space translations.'
  },
  {
    axis_id: 'AX_ANTHROPOCENE_OLF',
    slug: 'anthropocene-olfaction-co2-plastics',
    title_fr: 'Anthropocène olfactif (CO₂, pollution, signaux trompeurs)',
    title_en: 'Olfactory Anthropocene (CO₂, pollution, deceptive signals)',
    novelty_tagline: 'L\'odeur comme capteur écologique et crise de l\'information.',
    ui_module: 'SmellscapeMap + SignalDisruptionCards',
    core_entities: 'Species, Disruptor, OdorCue, Consequence',
    kpis: 'clics carte; partages; exports notes terrain',
    default_filters_json: { keywords: ['CO2', 'pollution plastique', 'plastique mariné'] },
    description_fr: 'Axe sur perturbation des systèmes olfactifs chez les espèces et sur les émissions anthropiques (plastique, CO₂) qui faussent les repères.',
    description_en: 'Axis on olfactory disruption in species and anthropogenic emissions (plastics, CO₂) that distort cues.'
  },
  {
    axis_id: 'AX_SMELLSCAPE_POWER_MEMORY',
    slug: 'smellscape-power-distributed-memory',
    title_fr: 'Smellscapes, pouvoir et mémoire distribuée (art & politique)',
    title_en: 'Smellscapes, power and distributed memory (art & politics)',
    novelty_tagline: 'Odeurs comme agents de pouvoir et d\'archive collective.',
    ui_module: 'ConstellationBuilder + ExhibitionNotes + Bibliography',
    core_entities: 'Artwork, Smellscape, Memory, Politics',
    kpis: 'constellations; exports; backlinks',
    default_filters_json: { keywords: ['smellscape', 'mémoire distribuée', 'colonialisme'] },
    description_fr: 'Axe cultural studies : smellscape (Porteous) + pratiques olfactives comme agents politiques. Parfait pour le volet \'archive / installation / espace\'.',
    description_en: 'Cultural studies axis: smellscapes and olfactory practices as political agents; perfect for archive/installation/space.'
  },
  {
    axis_id: 'AX_REGULATION_SAFETY_ENGINEERING',
    slug: 'ifras-standards-allergens-oakmoss',
    title_fr: 'Régulation & sécurité comme moteur créatif (IFRA, allergènes, QRA)',
    title_en: 'Regulation & safety as a creativity engine (IFRA, allergens, QRA)',
    novelty_tagline: 'Transformer la contrainte réglementaire en \'design system\' formulatoire.',
    ui_module: 'RegulatoryLedger + IngredientComplianceBadges',
    core_entities: 'Ingredient, Restriction, Allergen, Threshold',
    kpis: 'recherches; exports; vues conformité',
    default_filters_json: { keywords: ['oakmoss', 'atranol', 'chloroatranol', 'IFRA'] },
    description_fr: 'Axe datifiable et actionnable : pour chaque matière, stocker restrictions, seuils, dates, alternatives et impact olfactif.',
    description_en: 'Actionable data axis: per ingredient store restrictions, thresholds, dates, alternatives, and olfactory impact.'
  },
  {
    axis_id: 'AX_FORMULATION_TECH',
    slug: 'water-based-fragrance-formulation',
    title_fr: 'Technologies de formulation (aqueux, alcool‑free, micro‑émulsions)',
    title_en: 'Formulation tech (water-based, alcohol-free, micro-emulsions)',
    novelty_tagline: 'Même accord, trois supports, trois cinétiques de diffusion.',
    ui_module: 'SupportMatrix + FormulationNotes',
    core_entities: 'Support, Formula, Kinetics, Stability',
    kpis: 'comparaisons; exports; favoris',
    default_filters_json: { keywords: ['water-based fragrances', 'formulation science', 'freshness'] },
    description_fr: 'Axe formulation orienté usage : intensité vs fraîcheur, stabilité, solubilisation; utile pour \'proto-labo\' et déclinaisons médium.',
    description_en: 'Usage-oriented formulation axis: intensity vs freshness, stability, solubilization; ideal for lab-proto and medium translation.'
  },
  {
    axis_id: 'AX_GREEN_EXTRACTION',
    slug: 'green-extraction-supercritical-co2',
    title_fr: 'Extraction \'green\' & fidélité à la matrice (CO₂ supercritique)',
    title_en: 'Green extraction & matrix fidelity (supercritical CO₂)',
    novelty_tagline: 'Extraire plus \'proche plante\' tout en réduisant la dégradation thermique.',
    ui_module: 'ExtractionMethodCards + MaterialOutputs',
    core_entities: 'ExtractionMethod, RawMaterial, Yield, Profile',
    kpis: 'clics méthodes; exports; liens matières',
    default_filters_json: { keywords: ['supercritical CO2 extraction', 'green chemistry'] },
    description_fr: 'Axe technique pour documenter procédés (CO₂, solvants, circuits fermés), rendements, impacts, profils olfactifs et compatibilité formulation.',
    description_en: 'Technical axis documenting processes (CO₂, solvents, closed-loop), yields, impacts, olfactory profiles, formulation compatibility.'
  },
  {
    axis_id: 'AX_NATURALITY_STANDARDS',
    slug: 'naturality-standards-certifications',
    title_fr: '\'Naturalité\' comme terrain critique (Cosmos, ISO 9235/16128, greenwashing)',
    title_en: 'Naturality as a critical field (Cosmos, ISO 9235/16128, greenwashing)',
    novelty_tagline: 'Rendre lisible les standards: ce que \'100% naturel\' autorise réellement.',
    ui_module: 'NaturalityComparator + CertificationBadges',
    core_entities: 'Standard, Certification, AllowedIngredient, Claim',
    kpis: 'comparaisons; exports; clics standards',
    default_filters_json: { keywords: ['Cosmos Organic', 'ISO 9235', 'ISO 16128', 'natural perfume'] },
    description_fr: 'Axe utile pour ton site de recherche: stocker standards/certifs, palette autorisée, limites (solvants, bioconversion, % bio) et implications formulatoires.',
    description_en: 'Axis for your research site: store standards/certs, allowed palettes, constraints (solvents, bioconversion, organic %), and formulation implications.'
  },
  {
    axis_id: 'AX_NEXTGEN_NATURAL_EXTRACTION',
    slug: 'nextgen-natural-extraction-firgood-jungleessence',
    title_fr: 'Captation & extraction next‑gen (FIRGOOD, Jungle Essence, low‑temp realism)',
    title_en: 'Next-gen capture & extraction (FIRGOOD, Jungle Essence, low-temp realism)',
    novelty_tagline: 'Extraire l\'inextractible (fruit, \'matrices\') + préserver les facettes.',
    ui_module: 'ExtractionTimeline + MethodComparison',
    core_entities: 'Method, Biomass, EnergyUse, FacetProfile',
    kpis: 'clics méthodes; exports; liens matières',
    default_filters_json: { keywords: ['Firgood', 'microwave-assisted', 'Jungle Essence', 'low temperature'] },
    description_fr: 'Axe \'engineering\' : nouveaux procédés (micro-ondes / eau intrinsèque / extraction douce) et produits hybrides (hydrolats, fractions polaires) pour enrichir la palette.',
    description_en: 'Engineering axis: new processes (microwave / intrinsic water / gentle extraction) and hybrid outputs (hydrolates, polar fractions) to expand the palette.'
  }
];

// Données des articles sources NEZ (depuis data_nez_articles.csv)
const sourceArticles = [
  {
    source_id: 'NEZ_2024_04_07_INSULIN',
    title: 'Nez x GDR O3 – De l\'olfaction à la production d\'insuline',
    lang: 'fr',
    published_at: '2024-04-07',
    author: 'Jessica Mignot',
    categories: 'Nez x GDR O3;Science;Culture olfactive',
    themes: 'CNRS;University College London;odorat;Santé;GDR O3;Hirac Gurden',
    url: 'https://mag.bynez.com/nez-x-gdr-o3/nez-x-gdr-o3-de-lolfaction-a-la-production-dinsuline/'
  },
  {
    source_id: 'NEZ_2024_01_16_RECEPTORS_STRUCTURE_EN',
    title: 'Nez x GDR O3 – The structure of olfactory receptors laid bare',
    lang: 'en',
    published_at: '2024-01-16',
    author: '(see article page)',
    categories: 'Nez x GDR O3;Science;Olfactory Culture',
    themes: 'OR51E2;cryo-EM;receptors;GDR O3',
    url: 'https://mag.bynez.com/en/nez-x-gdr-o3-en/nez-x-gdr-o3-the-structure-of-olfactory-receptors-laid-bare/'
  },
  {
    source_id: 'NEZ_2023_12_28_POSITIVE_EMOTIONS_FR',
    title: 'Nez x GDR O3 – Les émotions positives dans l\'air ambiant : and I\'m smelling good',
    lang: 'fr',
    published_at: '2023-12-28',
    author: 'Jessica Mignot',
    categories: 'Nez x GDR O3;Science;Culture olfactive',
    themes: 'Neurosciences;GDR O3;CNRS;Camille Ferdenzi;Olfaction;Parfums',
    url: 'https://mag.bynez.com/nez-x-gdr-o3/nez-x-gdr-o3-les-emotions-positives-dans-lair-ambiant-and-im-smelling-good/'
  },
  {
    source_id: 'NEZ_2023_12_28_POSITIVE_EMOTIONS_EN',
    title: 'Nez x GDR O3 – Smelling positive emotions in the surrounding air: I feel good!',
    lang: 'en',
    published_at: '2023-12-28',
    author: 'Jessica Mignot',
    categories: 'News;Nez x GDR O3;Olfactory Culture;Science',
    themes: 'Camille Ferdenzi;CNRS;GDR O3;Neuroscience;Perfumes;Smell',
    url: 'https://mag.bynez.com/en/nez-x-gdr-o3-en/nez-x-gdr-o3-smelling-positive-emotions-in-the-surrounding-air-i-feel-good/'
  },
  {
    source_id: 'NEZ_2024_03_26_ANIMAL_NOSES_FR',
    title: 'Nez x GDR O3 – De la grande variété des nez animaux',
    lang: 'fr',
    published_at: '2024-03-26',
    author: '(see article page)',
    categories: 'Nez x GDR O3;Science;Culture olfactive',
    themes: 'CO2;pollution plastique;éthologie',
    url: 'https://mag.bynez.com/nez-x-gdr-o3/nez-x-gdr-o3-de-la-grande-variete-des-nez-animaux/'
  },
  {
    source_id: 'NEZ_2024_07_12_CIHA_SMELLSCAPE_FR',
    title: '36e congrès du Comité international d\'histoire de l\'art : la part belle aux pratiques olfactives',
    lang: 'fr',
    published_at: '2024-07-12',
    author: '(see article page)',
    categories: 'Art;Actualités',
    themes: 'smellscape;mémoire distribuée;colonialisme;post-colonialisme',
    url: 'https://mag.bynez.com/art/36e-congres-du-comite-international-dhistoire-de-lart-la-part-belle-aux-pratiques-olfactives/'
  },
  {
    source_id: 'NEZ_2024_12_19_OAKMOSS_IFRA_EN',
    title: 'Oakmoss: an exemplary case of IFRA\'s role',
    lang: 'en',
    published_at: '2024-12-19',
    author: '(see article page)',
    categories: 'Perfume',
    themes: 'IFRA;oakmoss;atranol;chloroatranol;EU regulation',
    url: 'https://mag.bynez.com/en/perfume/oakmoss-an-exemplary-case-of-ifras-role/'
  },
  {
    source_id: 'NEZ_2025_07_21_EUROFRAGANCE_EN',
    title: 'Technical expertise and creativity: applied research at Eurofragance',
    lang: 'en',
    published_at: '2025-07-21',
    author: '(see article page)',
    categories: 'Perfume',
    themes: 'formulation science;water-based fragrance;freshness',
    url: 'https://mag.bynez.com/en/perfume/technical-expertise-and-creativity-applied-research-at-eurofragance/'
  },
  {
    source_id: 'NEZ_2020_09_21_CO2_EXTRACTION_EN',
    title: 'Supercritical CO₂ extraction – Cyrille Santerre (ISIPCA)',
    lang: 'en',
    published_at: '2020-09-21',
    author: '(see article page)',
    categories: 'Interviews',
    themes: 'Natural raw materials;Supercritical CO2 extraction;Isipca',
    url: 'https://mag.bynez.com/en/interviews/supercritical-co2-extraction-cyrille-santerre-isipca/'
  },
  {
    source_id: 'EXT_PDB_8F76_OR51E2',
    title: 'Human olfactory receptor OR51E2 bound to propionate (PDB 8F76)',
    lang: 'en',
    published_at: null,
    author: 'RCSB PDB',
    categories: 'External Reference',
    themes: 'OR51E2;cryo-EM;propionate;structure',
    url: 'https://www.rcsb.org/structure/8f76'
  },
  {
    source_id: 'NEZ_2021_06_09_NATURAL_DEFINITIONS_EN',
    title: 'The many facets of natural perfumery: some useful definitions',
    lang: 'en',
    published_at: '2021-06-09',
    author: 'Jeanne Doré; Anne-Sophie Hojlo',
    categories: 'Natural perfumers;Perfume',
    themes: 'Cosmos Organic;Cosmos Natural;ISO 9235;ISO 16128;certifications',
    url: 'https://mag.bynez.com/en/reports/natural-perfumers/the-many-facets-of-natural-perfumery-some-useful-definitions/'
  },
  {
    source_id: 'NEZ_2023_05_18_FIRMENICH_FIRGOOD_EN',
    title: 'Natural extraction over the next decade by Firmenich',
    lang: 'en',
    published_at: '2023-05-18',
    author: 'Aurélie Dematons',
    categories: 'News;Perfume;Science',
    themes: 'dsm-firmenich;Firgood;microwave-assisted extraction;SIMPPAR',
    url: 'https://mag.bynez.com/en/perfume/natural-extraction-over-the-next-decade-by-firmenich/'
  },
  {
    source_id: 'NEZ_2020_06_04_JUNGLE_ESSENCE_EN',
    title: 'Jungle Essence technology (Mane) – more real than nature itself',
    lang: 'en',
    published_at: '2020-06-04',
    author: '(see article page)',
    categories: 'Perfume',
    themes: 'Mane;Jungle Essence;low temperature extraction;realism',
    url: 'https://mag.bynez.com/en/perfume/jungle-essence-technology-mane-more-real-than-nature-itself/'
  }
];

// Données des mappings axe-source (depuis data_axis_source_map.csv)
const axisSources = [
  { axis_id: 'AX_OLFACTION_METABOLISM', source_id: 'NEZ_2024_04_07_INSULIN', confidence: 0.95, evidence: 'GLP‑1 (bulbe olfactif) → signal vers pancréas → insulin release anticipatoire.' },
  { axis_id: 'AX_RECEPTOR_STRUCTURES', source_id: 'NEZ_2024_01_16_RECEPTORS_STRUCTURE_EN', confidence: 0.9, evidence: 'Cryo‑EM & structure OR (OR51E2) ; modèle récepteur→ligand.' },
  { axis_id: 'AX_RECEPTOR_STRUCTURES', source_id: 'EXT_PDB_8F76_OR51E2', confidence: 0.85, evidence: 'Ref externe structure OR51E2 ; utile pour pages \'receptor\'.' },
  { axis_id: 'AX_CHEMOSIGNALS_EMOTION', source_id: 'NEZ_2023_12_28_POSITIVE_EMOTIONS_FR', confidence: 0.95, evidence: 'Protocol: sueur émotion positive → tests physio/comportement.' },
  { axis_id: 'AX_CHEMOSIGNALS_EMOTION', source_id: 'NEZ_2023_12_28_POSITIVE_EMOTIONS_EN', confidence: 0.9, evidence: 'Version EN pour site bilingue.' },
  { axis_id: 'AX_ANTHROPOCENE_OLF', source_id: 'NEZ_2024_03_26_ANIMAL_NOSES_FR', confidence: 0.95, evidence: 'CO₂ + pollution plastique → perturbation des repères olfactifs chez espèces.' },
  { axis_id: 'AX_SMELLSCAPE_POWER_MEMORY', source_id: 'NEZ_2024_07_12_CIHA_SMELLSCAPE_FR', confidence: 0.9, evidence: 'Smellscape comme agent de pouvoir + mémoire distribuée.' },
  { axis_id: 'AX_REGULATION_SAFETY_ENGINEERING', source_id: 'NEZ_2024_12_19_OAKMOSS_IFRA_EN', confidence: 0.95, evidence: 'Atranol/chloroatranol : restriction & preuve scientifique IFRA.' },
  { axis_id: 'AX_FORMULATION_TECH', source_id: 'NEZ_2025_07_21_EUROFRAGANCE_EN', confidence: 0.85, evidence: 'Formulation science → fragrances aqueuses & nouvelles pratiques.' },
  { axis_id: 'AX_GREEN_EXTRACTION', source_id: 'NEZ_2020_09_21_CO2_EXTRACTION_EN', confidence: 0.85, evidence: 'CO₂ supercritique : fidélité matrice + green chemistry + limites.' },
  { axis_id: 'AX_NATURALITY_STANDARDS', source_id: 'NEZ_2021_06_09_NATURAL_DEFINITIONS_EN', confidence: 0.95, evidence: 'Comparatif Cosmos/ISO et palettes autorisées; naturalité non-univoque.' },
  { axis_id: 'AX_NEXTGEN_NATURAL_EXTRACTION', source_id: 'NEZ_2023_05_18_FIRMENICH_FIRGOOD_EN', confidence: 0.9, evidence: 'Procédé FIRGOOD: micro-ondes, eau intrinsèque, moins de solvants.' },
  { axis_id: 'AX_NEXTGEN_NATURAL_EXTRACTION', source_id: 'NEZ_2020_06_04_JUNGLE_ESSENCE_EN', confidence: 0.85, evidence: 'Extraction basse T° -> facettes plus complètes; rend possible fruits.' }
];

// Exporter les données pour utilisation dans l'application
export { researchAxes, sourceArticles, axisSources };

console.log('📊 Données NEZ prêtes pour import:');
console.log(`  - ${researchAxes.length} axes de recherche`);
console.log(`  - ${sourceArticles.length} articles sources`);
console.log(`  - ${axisSources.length} mappings axe-source`);
