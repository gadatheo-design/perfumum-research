import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// Mapping des noms de molécules vers leurs IDs (à récupérer de la DB)
const moleculeNameToId = {};

// Récupérer toutes les molécules pour créer le mapping
const allMolecules = await db.select().from(schema.molecules);
allMolecules.forEach(mol => {
  moleculeNameToId[mol.name.toLowerCase()] = mol.id;
});

console.log('✅ Molécules chargées:', Object.keys(moleculeNameToId).length);

// Fonction helper pour trouver l'ID d'une molécule
function findMoleculeId(name) {
  const normalized = name.toLowerCase();
  const id = moleculeNameToId[normalized];
  if (!id) {
    console.warn(`⚠️  Molécule non trouvée: "${name}"`);
  }
  return id;
}

// Définition des 8 recettes colombiennes
const recettes = [
  {
    name: 'CAFÉ DE LOS ANDES',
    description: 'Ouverture florale jasminée avec acidité tropicale, cœur boisé-chocolaté, fond balsamique vanillé. Évoque les plantations de café en altitude, entre fleurs blanches et forêt andine.',
    type: 'Parfum',
    gamme: 'Colombie',
    olfactiveProfile: 'Floral-Fruité-Boisé',
    emotionalResonance: 'Plantations de café en altitude, fleurs blanches, forêt andine',
    components: [
      { name: 'Café Geisha', percentage: 25, note: 'tête' },
      { name: 'Fleur de Café', percentage: 15, note: 'tête' },
      { name: 'Lulo', percentage: 10, note: 'tête' },
      { name: 'Cedro Rosado', percentage: 20, note: 'cœur' },
      { name: 'Cacao Colombien', percentage: 15, note: 'cœur' },
      { name: 'Baume de Tolú', percentage: 10, note: 'fond' },
      { name: 'Vanilla Pompona', percentage: 5, note: 'fond' }
    ]
  },
  {
    name: 'SELVA SAGRADA',
    description: 'Fumée résineuse sacrée, boisé amer chamanique, fond balsamique profond. Rituel amazonien, connexion spirituelle, mémoire ancestrale.',
    type: 'Encens',
    gamme: 'Colombie',
    olfactiveProfile: 'Résine-Boisé-Fumé',
    emotionalResonance: 'Rituel amazonien, connexion spirituelle, mémoire ancestrale',
    components: [
      { name: 'Copal Colombien', percentage: 30, note: 'tête' },
      { name: 'Palo Santo', percentage: 25, note: 'cœur' },
      { name: 'Yagé', percentage: 15, note: 'cœur' },
      { name: 'Cedro Rosado', percentage: 15, note: 'cœur' },
      { name: 'Baume de Tolú', percentage: 10, note: 'fond' },
      { name: 'Copaiba', percentage: 5, note: 'fond' }
    ]
  },
  {
    name: 'FRUTAS ANDINAS',
    description: 'Explosion de fruits tropicaux acidulés, cœur floral vanillé, fond gourmand chocolaté. Marché colombien coloré, abondance tropicale, joie solaire.',
    type: 'Parfum',
    gamme: 'Colombie',
    olfactiveProfile: 'Fruité-Tropical-Floral',
    emotionalResonance: 'Marché colombien coloré, abondance tropicale, joie solaire',
    components: [
      { name: 'Lulo', percentage: 20, note: 'tête' },
      { name: 'Guanábana', percentage: 20, note: 'tête' },
      { name: 'Uchuva', percentage: 15, note: 'tête' },
      { name: 'Fleur de Café', percentage: 15, note: 'cœur' },
      { name: 'Vanilla Pompona', percentage: 15, note: 'cœur' },
      { name: 'Baume de Tolú', percentage: 10, note: 'fond' },
      { name: 'Cacao Colombien', percentage: 5, note: 'fond' }
    ]
  },
  {
    name: 'CHAMÁN NOCTURNO',
    description: 'Floral hypnotique narcotique, boisé chamanique amer, fond résineux balsamique. Cérémonie nocturne, transe visionnaire, voyage intérieur. ⚠️ Borrachero à utiliser avec précaution (alcaloïdes tropaniques).',
    type: 'Parfum',
    gamme: 'Colombie',
    olfactiveProfile: 'Floral-Narcotique-Boisé',
    emotionalResonance: 'Cérémonie nocturne, transe visionnaire, voyage intérieur',
    components: [
      { name: 'Borrachero', percentage: 20, note: 'tête' },
      { name: 'Yagé', percentage: 15, note: 'cœur' },
      { name: 'Palo Santo', percentage: 20, note: 'cœur' },
      { name: 'Cedro Rosado', percentage: 15, note: 'cœur' },
      { name: 'Copal Colombien', percentage: 15, note: 'fond' },
      { name: 'Baume de Tolú', percentage: 10, note: 'fond' },
      { name: 'Vanilla Pompona', percentage: 5, note: 'fond' }
    ]
  },
  {
    name: 'VERDE MEDICINA',
    description: 'Herbacé médicinal puissant, menthe andine fraîche, fond baumier résineux. Pharmacopée traditionnelle, guérison végétale, sagesse botanique.',
    type: 'Résine CBD',
    gamme: 'Colombie',
    olfactiveProfile: 'Herbacé-Médicinal-Frais',
    emotionalResonance: 'Pharmacopée traditionnelle, guérison végétale, sagesse botanique',
    components: [
      { name: 'Lippia Origanoides', percentage: 25, note: 'tête' },
      { name: 'Coca Décocaïnisée', percentage: 20, note: 'tête' },
      { name: 'Piper Aduncum', percentage: 15, note: 'tête' },
      { name: 'Calycolpus Moritzianus', percentage: 15, note: 'cœur' },
      { name: 'Turnera Diffusa', percentage: 10, note: 'cœur' },
      { name: 'Copaiba', percentage: 10, note: 'fond' },
      { name: 'Baume de Tolú', percentage: 5, note: 'fond' }
    ]
  },
  {
    name: 'BOSQUE DE CEDRO',
    description: 'Boisé noble rosé, profondeur tannique, fond résineux balsamique vanillé. Forêt andine haute altitude, majesté végétale, temps suspendu.',
    type: 'Parfum',
    gamme: 'Colombie',
    olfactiveProfile: 'Boisé-Noble-Résineux',
    emotionalResonance: 'Forêt andine haute altitude, majesté végétale, temps suspendu',
    components: [
      { name: 'Cedro Rosado', percentage: 35, note: 'tête' },
      { name: 'Nogal Colombien', percentage: 25, note: 'cœur' },
      { name: 'Palo Santo', percentage: 15, note: 'cœur' },
      { name: 'Copal Colombien', percentage: 10, note: 'fond' },
      { name: 'Baume de Tolú', percentage: 10, note: 'fond' },
      { name: 'Vanilla Pompona', percentage: 5, note: 'fond' }
    ]
  },
  {
    name: 'DULCE TRÓPICO',
    description: 'Crémeux fruité tropical, cœur chocolat-vanille intense, fond balsamique café. Gourmandise colombienne, douceur réconfortante, mémoire d\'enfance.',
    type: 'Parfum',
    gamme: 'Colombie',
    olfactiveProfile: 'Gourmand-Tropical-Balsamique',
    emotionalResonance: 'Gourmandise colombienne, douceur réconfortante, mémoire d\'enfance',
    components: [
      { name: 'Guanábana', percentage: 20, note: 'tête' },
      { name: 'Uchuva', percentage: 15, note: 'tête' },
      { name: 'Cacao Colombien', percentage: 25, note: 'cœur' },
      { name: 'Vanilla Pompona', percentage: 20, note: 'cœur' },
      { name: 'Baume de Tolú', percentage: 15, note: 'fond' },
      { name: 'Café Geisha', percentage: 5, note: 'fond' }
    ]
  },
  {
    name: 'OFRENDA ANCESTRAL',
    description: 'Résine sacrée fumée intense, balsamique vanillé, boisé chamanique profond. Rituel précolombien, connexion ancestrale, mémoire collective.',
    type: 'Encens',
    gamme: 'Colombie',
    olfactiveProfile: 'Résine-Sacré-Fumé',
    emotionalResonance: 'Rituel précolombien, connexion ancestrale, mémoire collective',
    components: [
      { name: 'Copal Colombien', percentage: 35, note: 'tête' },
      { name: 'Baume de Tolú', percentage: 25, note: 'cœur' },
      { name: 'Palo Santo', percentage: 20, note: 'cœur' },
      { name: 'Copaiba', percentage: 10, note: 'fond' },
      { name: 'Yagé', percentage: 5, note: 'fond' },
      { name: 'Cedro Rosado', percentage: 5, note: 'fond' }
    ]
  }
];

console.log('\n🚀 Début de l\'import des recettes colombiennes...\n');

let successCount = 0;
let errorCount = 0;

for (const recette of recettes) {
  try {
    console.log(`📝 Traitement: ${recette.name}`);
    
    // 1. Insérer la recette
    const [recetteResult] = await db.insert(schema.recettes).values({
      name: recette.name,
      description: recette.description,
      type: recette.type,
      gamme: recette.gamme,
      olfactiveProfile: recette.olfactiveProfile,
      emotionalResonance: recette.emotionalResonance,
      createdAt: new Date()
    });
    
    const recetteId = Number(recetteResult.insertId);
    console.log(`   ✅ Recette créée (ID: ${recetteId})`);
    
    // 2. Insérer les composants (associations molécules)
    let componentsInserted = 0;
    for (const comp of recette.components) {
      const moleculeId = findMoleculeId(comp.name);
      if (moleculeId) {
        await db.insert(schema.recetteMolecules).values({
          recetteId: recetteId,
          moleculeId: moleculeId,
          percentage: comp.percentage,
          note: comp.note
        });
        componentsInserted++;
      } else {
        console.warn(`   ⚠️  Composant ignoré: ${comp.name} (molécule non trouvée)`);
      }
    }
    
    console.log(`   ✅ ${componentsInserted}/${recette.components.length} composants ajoutés\n`);
    successCount++;
    
  } catch (error) {
    console.error(`   ❌ Erreur pour ${recette.name}:`, error.message);
    errorCount++;
  }
}

console.log('\n' + '='.repeat(60));
console.log('📊 RÉSUMÉ DE L\'IMPORT');
console.log('='.repeat(60));
console.log(`✅ Recettes importées avec succès: ${successCount}`);
console.log(`❌ Erreurs: ${errorCount}`);
console.log(`📦 Total: ${recettes.length} recettes`);
console.log('='.repeat(60) + '\n');

await connection.end();
