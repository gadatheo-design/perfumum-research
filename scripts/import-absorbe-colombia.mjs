#!/usr/bin/env node
/**
 * Script d'import des données ABSORBE · COLOMBIA
 * 
 * Ce script importe les données de recherche terrain depuis la page Notion
 * dans les tables field_archives, climate_studies, molecular_protocols, et recipes
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema.js';

// Configuration de la connexion
const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

console.log('🌿 Import des données ABSORBE · COLOMBIA\n');

// ============================================================================
// 1. ÉTUDES CLIMATIQUES
// ============================================================================

console.log('📊 Import des études climatiques...');

const climateStudiesData = [
  {
    name: 'Petrichor Andin — Odeur de seuil',
    collection: 'COLOMBIA · Humidity Studies',
    axis: 'Petrichor',
    concept: 'Odeurs situées liées à l\'humidité tropicale. Pas d\'exotisme. Pas de fétichisation de la matière. Traduction olfactive uniquement.',
    zone: 'Andes / Altiplano',
    altitude: '2500–3000 m',
    climate: 'Pluie courte, air froid, évaporation rapide',
    keyMoment: 'Juste après la pluie, avant le soleil',
    attackDescription: 'Air froid, ozone doux, humidité métallique',
    heartDescription: 'Terre minérale, pierre mouillée, humus discret (jamais sucré)',
    baseDescription: 'Sécheresse rapide, poussière propre, silence olfactif',
    observedSupports: JSON.stringify(['pierre volcanique', 'terre tassée urbaine', 'feuilles larges humides', 'murs minéraux']),
    absorbeReading: 'Le petrichor andin n\'est pas une odeur de forêt, mais une odeur de transition : entre pluie et soleil, entre ville et montagne, entre corps chaud et air froid. Odeur de seuil, pas de refuge.',
    thresholdOdor: 'yes',
    recommendedTests: JSON.stringify([
      { name: 'Test A — Terre humide', method: 'Terre + alcool 95%', duration: '24–48 h', result: 'Filtration légère' },
      { name: 'Test B — Pierre mouillée', method: 'Pierre propre + alcool', duration: 'Agitation manuelle', result: 'Résultat très subtil (trace)' }
    ]),
    headTranslation: 'Ozone / air froid',
    heartTranslation: 'Minéral humide',
    baseTranslation: 'Poussière sèche',
    ethicalPosition: 'Ce petrichor ne doit pas rassurer. Il doit ouvrir.',
    status: 'lab_translation'
  },
  {
    name: 'Feuilles après pluie — Chlorophylle humide',
    collection: 'COLOMBIA · Humidity Studies',
    axis: 'Feuilles après pluie',
    concept: 'Odeurs situées liées à l\'humidité tropicale. Pas d\'exotisme. Pas de fétichisation de la matière. Traduction olfactive uniquement.',
    zone: 'Andes humides / piémont tropical',
    altitude: '800–2000 m',
    climate: 'Pluie courte, chaleur douce, évaporation lente',
    keyMoment: '10 à 40 minutes après la pluie, feuilles encore chargées d\'eau, air immobile, saturé',
    attackDescription: 'Vert vif, sève fraîche, humidité translucide',
    heartDescription: 'Feuille froissée, chlorophylle chaude, amertume douce',
    baseDescription: 'Peau végétale, humidité persistante, presque lacté, jamais sucré',
    observedSupports: JSON.stringify(['feuilles larges tropicales', 'herbes écrasées', 'haies urbaines après pluie', 'bordures de chemins']),
    absorbeReading: 'Les feuilles après pluie ne "sentent" pas : elles respirent. Ce n\'est pas une note verte abstraite, mais un moment physiologique : la plante relâche, l\'eau s\'évapore, l\'air devient conducteur. Odeur de surface, pas de profondeur. Odeur de présent immédiat.',
    thresholdOdor: 'no',
    recommendedTests: JSON.stringify([
      { name: 'Test A — Feuille fraîche (MCT)', method: 'Feuille intacte, non froissée, immersion partielle MCT', duration: '24 h max', result: 'Vert doux, rond, très fidèle' },
      { name: 'Test B — Feuille froissée (alcool)', method: 'Feuille écrasée entre doigts, alcool 95%', duration: '12–24 h', result: 'Plus agressif, amer, utile comme contraste' }
    ]),
    headTranslation: 'Vapeur humide',
    heartTranslation: 'Chlorophylle douce',
    baseTranslation: 'Peau végétale',
    ethicalPosition: 'Traduire la feuille, sans la styliser. Cette odeur n\'est pas décorative. Elle est fonctionnelle : elle signale la vie en cours.',
    status: 'lab_translation'
  }
];

for (const study of climateStudiesData) {
  try {
    const [result] = await db.insert(schema.climateStudies).values(study);
    console.log(`✓ Étude climatique créée : ${study.name} (ID: ${result.insertId})`);
  } catch (error) {
    console.error(`✗ Erreur lors de la création de l'étude "${study.name}":`, error.message);
  }
}

// ============================================================================
// 2. PROTOCOLES MOLÉCULAIRES
// ============================================================================

console.log('\n🧪 Import des protocoles moléculaires...');

const molecularProtocolsData = [
  {
    name: 'Petrichor Andin — Reconstruction olfactive',
    objective: 'Reconstituer une odeur de seuil andine : froide, minérale, transitoire. Sans notes vertes luxuriantes, bois chauds, effets "terre mouillée" caricaturaux. Ce protocole vise une évocation atmosphérique, pas une imitation brute.',
    olfactiveArchitecture: 'Air froid → Minéral humide → Poussière sèche',
    function: 'Créer une sensation de passage entre pluie / soleil, entre ville / montagne, entre saturation / retrait.',
    headPalette: JSON.stringify([
      { molecule: 'Aldéhydes froids (C10–C11)', percentage: 6, function: 'Ouverture, verticalité, respiration', warning: 'Aucun effet "lessive"' },
      { molecule: 'Iso E Super', percentage: 10, function: 'Diffusion aérienne', warning: '' },
      { molecule: 'Dihydromyrcenol', percentage: 3, function: 'Fraîcheur abstraite', warning: '' },
      { molecule: 'Accord air abstrait', percentage: 6, function: '', warning: '' }
    ]),
    heartPalette: JSON.stringify([
      { molecule: 'Patchouli fractionné clair', percentage: 18, function: 'Pierre mouillée, sol compact', warning: 'Très propre, non terreux' },
      { molecule: 'Ambroxan', percentage: 12, function: 'Structure sèche', warning: 'Dosage bas' },
      { molecule: 'Géosmine (dilution 1%)', percentage: 1, function: 'Humidité retenue', warning: 'La géosmine doit être perçue, jamais identifiée' },
      { molecule: 'Accord minéral humide', percentage: 14, function: '', warning: '' }
    ]),
    basePalette: JSON.stringify([
      { molecule: 'Vétiveryl acétate', percentage: 12, function: 'Sec, aérien', warning: '' },
      { molecule: 'Bois ambré clair', percentage: 10, function: 'Assèchement progressif', warning: 'Type Ambercore' },
      { molecule: 'Musc minéral dilué', percentage: 8, function: 'Disparition, calme olfactif', warning: 'Ambrettolide très dilué' }
    ]),
    headRatio: 25,
    heartRatio: 45,
    baseRatio: 30,
    formulationProtocol: JSON.stringify([
      'Construire le cœur minéral seul',
      'Tester la perception humide à froid',
      'Ajouter la tête par micro-incréments',
      'Ajuster le fond pour écourter la tenue',
      'Reposer 7–14 jours',
      'Évaluer en air libre, pas sur mouillette seule'
    ]),
    sensoryTests: JSON.stringify([
      'Test à température basse (15–18 °C)',
      'Test après vaporisation + attente 2 min',
      'Test en espace minéral (cage d\'escalier, pierre)',
      'Questions clés : L\'odeur disparaît-elle élégamment ? Reste-t-elle lisible sans devenir confortable ? Évoque-t-elle un lieu, sans le nommer ?'
    ]),
    typicalFailures: 'Trop de géosmine → "terre humide" | Trop d\'aldéhydes → cosmétique | Trop de bois → refuge olfactif. Le petrichor andin ne rassure pas. Il met en mouvement.',
    status: 'conceptual'
  },
  {
    name: 'Feuilles après pluie — Reconstruction physiologique',
    objective: 'Reconstituer l\'odeur des feuilles vivantes après la pluie : humide, verte, respirante. Sans effet "thé vert", fraîcheur mentholée, abstraction cosmétique. Ce protocole vise une odeur de surface active, pas une note verte idéalisée.',
    olfactiveArchitecture: 'Vapeur humide → Chlorophylle douce → Peau végétale',
    function: 'Donner la sensation que l\'eau quitte la feuille, la plante respire, l\'air devient conducteur. Odeur de présent, pas de mémoire.',
    headPalette: JSON.stringify([
      { molecule: 'Aldéhydes verts C6–C8', percentage: 8, function: 'Humidité translucide, diffusion douce', warning: 'Aucun effet "fraîcheur propre"' },
      { molecule: 'Cis-3-hexenol', percentage: 6, function: 'Sensation d\'air chargé', warning: 'Trace contrôlée' },
      { molecule: 'Dihydromyrcenol', percentage: 6, function: 'Soutien d\'évaporation', warning: 'Micro-dose' },
      { molecule: 'Accord vapeur humide', percentage: 10, function: '', warning: '' }
    ]),
    heartPalette: JSON.stringify([
      { molecule: 'Cis-3-hexenyl acetate', percentage: 16, function: 'Vert rond, non coupant', warning: '' },
      { molecule: 'Galbanum résinoïde', percentage: 8, function: 'Feuille froissée, chlorophylle chaude', warning: 'Dose basse, non métallique' },
      { molecule: 'Lentisque / mastiha', percentage: 6, function: 'Sève, amertume douce', warning: 'Trace' },
      { molecule: 'Accord chlorophylle', percentage: 10, function: '', warning: 'Le cœur doit respirer, pas trancher' }
    ]),
    basePalette: JSON.stringify([
      { molecule: 'Musc végétal clair', percentage: 12, function: 'Persistance organique', warning: 'Habanolide très dilué' },
      { molecule: 'Bois verts fractionnés', percentage: 10, function: 'Humidité retenue', warning: 'Type clearwood fractionné' },
      { molecule: 'Ambroxide (structure)', percentage: 8, function: 'Sensation de feuille contre la peau', warning: 'Très bas, structure pas chaleur' }
    ]),
    headRatio: 30,
    heartRatio: 40,
    baseRatio: 30,
    formulationProtocol: JSON.stringify([
      'Construire le cœur vert seul',
      'Tester à faible concentration (≤ 5 %)',
      'Ajouter la tête par micro-incréments',
      'Ajuster le fond uniquement pour stabiliser',
      'Repos 7 jours maximum',
      'Tester sur mouillette et dans l\'air humide'
    ]),
    sensoryTests: JSON.stringify([
      'Test en espace fermé après pluie',
      'Test à chaleur douce (20–25 °C)',
      'Test sur peau non parfumée (zone neutre)',
      'Questions clés : La feuille semble-t-elle vivante ? L\'odeur évolue-t-elle sans rupture ? Disparaît-elle sans devenir abstraite ?'
    ]),
    typicalFailures: 'Surdosage cis-3-hexenol → herbe coupée | Trop d\'aldéhydes → vert artificiel | Fond trop présent → effet parfumé. Une feuille après pluie ne cherche pas à durer.',
    status: 'conceptual'
  }
];

for (const protocol of molecularProtocolsData) {
  try {
    const [result] = await db.insert(schema.molecularProtocols).values(protocol);
    console.log(`✓ Protocole moléculaire créé : ${protocol.name} (ID: ${result.insertId})`);
  } catch (error) {
    console.error(`✗ Erreur lors de la création du protocole "${protocol.name}":`, error.message);
  }
}

// ============================================================================
// 3. RECETTES COLOMBIA
// ============================================================================

console.log('\n🍃 Import des recettes Colombia...');

const recettesColombiaData = [
  {
    code: 'COL-PET-01',
    name: 'Pétrichor Amazonien',
    gamme: 'Colombia',
    famille: 'Pétrichor sombre',
    support: 'résine',
    notes: JSON.stringify(['geosmin faible', 'humus', 'bois mouillé']),
    usage: 'installation lente',
    intensite: 'moyenne',
    description: 'Pétrichor sombre de forêt tropicale humide'
  },
  {
    code: 'COL-FER-02',
    name: 'Fermentation Tropicale',
    gamme: 'Colombia',
    famille: 'Fermentum',
    support: 'tabac brun',
    notes: JSON.stringify(['cacao fermenté', 'café vert', 'sucre brun']),
    usage: 'performance',
    intensite: 'moyenne+',
    description: 'Fermentation tropicale : cacao, café, sucre brun'
  },
  {
    code: 'COL-CAF-03',
    name: 'Torréfaction Noire',
    gamme: 'Colombia',
    famille: 'Pyro',
    support: 'encens',
    notes: JSON.stringify(['café torréfié', 'fumée sèche', 'caramel amer']),
    usage: 'espace clos',
    intensite: 'forte',
    description: 'Torréfaction noire : café, fumée, caramel amer'
  },
  {
    code: 'COL-AND-04',
    name: 'Air Andin',
    gamme: 'Colombia',
    famille: 'Clair/Minéral',
    support: 'tabac blond',
    notes: JSON.stringify(['aldéhydes froids', 'herbacé sec', 'pierre']),
    usage: 'galerie',
    intensite: 'faible',
    description: 'Air andin : aldéhydes froids, herbacé sec, pierre'
  },
  {
    code: 'COL-URB-05',
    name: 'Béton Mouillé',
    gamme: 'Colombia',
    famille: 'Urbain',
    support: 'tabac blond',
    notes: JSON.stringify(['ozone', 'minéral', 'métal propre']),
    usage: 'white cube',
    intensite: 'faible-moyenne',
    description: 'Béton mouillé : ozone, minéral, métal propre'
  },
  {
    code: 'COL-BOI-06',
    name: 'Bois Trempé',
    gamme: 'Colombia',
    famille: 'Bois humide',
    support: 'résine',
    notes: JSON.stringify(['cèdre mouillé', 'champignon', 'lactone']),
    usage: 'in situ forêt',
    intensite: 'moyenne',
    description: 'Bois trempé : cèdre mouillé, champignon, lactone'
  },
  {
    code: 'COL-VOL-07',
    name: 'Terre Volcanique',
    gamme: 'Colombia',
    famille: 'Minéral',
    support: 'encens',
    notes: JSON.stringify(['argile chaude', 'cendre claire']),
    usage: 'rituel',
    intensite: 'moyenne',
    description: 'Terre volcanique : argile chaude, cendre claire'
  },
  {
    code: 'COL-CAC-08',
    name: 'Cacao Brut',
    gamme: 'Colombia',
    famille: 'Gourmand sec',
    support: 'tabac brun',
    notes: JSON.stringify(['cacao', 'pyrazines', 'amertume']),
    usage: 'performance sonore',
    intensite: 'moyenne+',
    description: 'Cacao brut : cacao, pyrazines, amertume'
  },
  {
    code: 'COL-PLU-09',
    name: 'Pluie Équatoriale',
    gamme: 'Colombia',
    famille: 'Pétrichor clair',
    support: 'résine',
    notes: JSON.stringify(['pluie', 'feuille verte', 'ozone']),
    usage: 'extérieur',
    intensite: 'faible',
    description: 'Pluie équatoriale : pluie, feuille verte, ozone'
  },
  {
    code: 'COL-ARC-10',
    name: 'Archive Humide',
    gamme: 'Colombia',
    famille: 'Mémoire',
    support: 'encens',
    notes: JSON.stringify(['papier humide', 'bois ancien']),
    usage: 'exposition',
    intensite: 'faible',
    description: 'Archive humide : papier humide, bois ancien'
  }
];

for (const recette of recettesColombiaData) {
  try {
    const [result] = await db.insert(schema.recettes).values(recette);
    console.log(`✓ Recette créée : ${recette.code} - ${recette.name} (ID: ${result.insertId})`);
  } catch (error) {
    console.error(`✗ Erreur lors de la création de la recette "${recette.code}":`, error.message);
  }
}

// ============================================================================
// FIN
// ============================================================================

console.log('\n✅ Import terminé avec succès !');
console.log('\nRésumé :');
console.log(`- ${climateStudiesData.length} études climatiques importées`);
console.log(`- ${molecularProtocolsData.length} protocoles moléculaires importés`);
console.log(`- ${recettesColombiaData.length} recettes Colombia importées`);

await connection.end();
process.exit(0);
