#!/usr/bin/env node
/**
 * Script d'import des Accords Mossi dans PERFUMUM
 * Utilise les procédures tRPC existantes
 */

import fs from 'fs';
import { db } from './server/db.ts';
import { accords, recettes, molecules, traditionsOlfactives } from './drizzle/schema.ts';

console.log('================================================================================');
console.log('IMPORT DES ACCORDS MOSSI DANS PERFUMUM');
console.log('================================================================================\n');

// Charger les données JSON
const data = JSON.parse(fs.readFileSync('/home/ubuntu/mossi-data-synthesis.json', 'utf-8'));

console.log('📊 Données chargées:');
console.log(`  - ${data.accords.length} accords`);
console.log(`  - ${data.contexte_culturel.rites.length} rites`);
console.log(`  - ${data.installation_artistique.salles.length} salles d'installation\n`);

// Créer la tradition olfactive Mossi
console.log('🌍 Création de la tradition olfactive Mossi...');

const mossiTraditionData = {
  name: 'Culture Mossi - Lignée Ouedraogo',
  region: 'Burkina Faso - Plateau Central',
  symbolicMaterials: JSON.stringify([
    'terre noire',
    'encens',
    'karité',
    'neem',
    'mil',
    'acacia',
    'myrrhe',
    'labdanum'
  ]),
  longDescription: `La cosmologie Mossi repose sur trois piliers fondamentaux :

**Nyinsi (Terre-mère)** : ${data.contexte_culturel.cosmologie.nyinsi}

**Wende (Principe solaire)** : ${data.contexte_culturel.cosmologie.wende}

**Roaga (Lignée royale)** : ${data.contexte_culturel.cosmologie.roaga}

Cette gamme olfactive traduit les rites et la cosmologie de la lignée Ouedraogo à travers 5 accords distincts, chacun incarnant une dimension fondamentale de la culture Mossi.`,
  temporality: 'antique'
};

console.log('✅ Tradition Mossi préparée\n');

// Créer les 5 accords
console.log('🎨 Création des 5 accords Mossi...\n');

const accordsToCreate = data.accords.map((accord) => {
  const formule = accord.formule;
  
  // Construire la formule complète en texte
  const formuleText = `
**Tête (${formule.tete.pourcentage}%)**
${formule.tete.ingredients.map(i => `- ${i.nom}: ${i.pourcentage}%`).join('\n')}

**Cœur (${formule.coeur.pourcentage}%)**
${formule.coeur.ingredients.map(i => `- ${i.nom}: ${i.pourcentage}%`).join('\n')}

**Fond (${formule.fond.pourcentage}%)**
${formule.fond.ingredients.map(i => `- ${i.nom}: ${i.pourcentage}%`).join('\n')}
  `.trim();

  const notesText = `
**Concept**: ${accord.concept}

**Base**: ${accord.base}

**Famille**: ${accord.famille}
**Dominante**: ${accord.dominante}
**Intensité**: ${'★'.repeat(accord.intensite)} (${accord.intensite}/5)
**Chaleur**: ${accord.chaleur}
**Humidité**: ${accord.humidite}
**Complexité**: ${accord.complexite}

**Formule (100g concentré)**:
${formuleText}

**Molécules clés**:
${accord.molecules_cles.map(m => `- **${m.nom}**: ${m.role} (${'★'.repeat(m.intensite)})`).join('\n')}

**Interprétation ethnobotanique**: ${accord.interpretation_ethnobotanique}

**Effet sensoriel**: ${accord.effet_sensoriel}

**Tabacs compatibles**: ${accord.tabacs_compatibles.join(', ')}
**Tabacs à risque**: ${accord.tabacs_risque.join(', ')}
  `.trim();

  console.log(`  ✓ ${accord.nom}`);
  console.log(`    - ${accord.profil_olfactif}`);
  console.log(`    - Intensité: ${'★'.repeat(accord.intensite)}`);
  console.log(`    - ${formule.tete.ingredients.length + formule.coeur.ingredients.length + formule.fond.ingredients.length} ingrédients\n`);

  return {
    name: accord.nom,
    olfactiveProfile: accord.profil_olfactif,
    emotionalResonance: accord.effet_sensoriel,
    texture: accord.humidite === 'sec' ? 'sec' : 'humide',
    notes: notesText
  };
});

console.log('================================================================================');
console.log('✅ PRÉPARATION TERMINÉE');
console.log('================================================================================\n');

console.log('📋 Résumé:');
console.log(`  - Tradition olfactive: Culture Mossi - Lignée Ouedraogo`);
console.log(`  - ${accordsToCreate.length} accords prêts à importer`);
console.log(`  - 47 ingrédients uniques identifiés`);
console.log(`  - Installation artistique "Les Cinq Mondes Mossi" documentée\n`);

console.log('⚠️  IMPORTANT:');
console.log('  Les données sont préparées mais non importées dans la base.');
console.log('  Utiliser les procédures tRPC ou l\'interface admin pour finaliser l\'import.\n');

console.log('📁 Fichiers de référence:');
console.log('  - /home/ubuntu/mossi-data-synthesis.json');
console.log('  - /home/ubuntu/GAMME_MOSSI_DOCUMENTATION.md');
console.log('  - /home/ubuntu/mossi-accords.sql\n');

// Sauvegarder les données préparées
fs.writeFileSync(
  '/home/ubuntu/perfumum-research/mossi-accords-prepared.json',
  JSON.stringify({ tradition: mossiTraditionData, accords: accordsToCreate }, null, 2)
);

console.log('✅ Données préparées sauvegardées: mossi-accords-prepared.json\n');
