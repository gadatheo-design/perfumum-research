// Script d'import des 3 profils d'exception
import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await createConnection(process.env.DATABASE_URL);

// Profils d'exception
const profilsException = [
  {
    name: 'Cuir Marin',
    category: 'resine_cbd',
    description: 'Profil d\'exception alliant fraîcheur marine et cuir souple. Ouverture saline et métallique sur fond de cuir tabac et ambre minéral. Une création audacieuse qui marie l\'océan et le désert.',
    ingredients: 'Limonène 15%, α-Pinène 10%, Accord Cuivre (calone + sel) 25%, β-Caryophyllène 12%, Absolu Tabac Blond 13%, Ambroxan 15%, Santalol 10%, CBD Isolate 28%',
    formula: 'Tête 50% (fraîcheur marine) + Cœur 25% (cuir tabac) + Fond 25% (ambre minéral)',
    protocol: '1. Préparer l\'accord cuivre : calone + notes salines + traces métalliques\n2. Ajouter limonène et α-pinène pour fraîcheur\n3. Incorporer β-caryophyllène et absolu tabac blond\n4. Ajouter ambroxan pour projection\n5. Finir avec santalol pour ancrage\n6. Maturation 21 jours à 18-22°C',
    notes: 'Profil unique et mémorable. Le contraste mer/cuir crée une tension olfactive fascinante.',
    texture: 'Résine souple',
    intensity: 8,
    stability: 'high',
    status: 'validated',
    notesTete: 'Sel, iodé, métallique, citrus frais',
    notesCoeur: 'Cuir souple, tabac blond, épicé',
    notesFond: 'Ambre gris, santal, minéral, persistant'
  },
  {
    name: 'Forêt de Cacao',
    category: 'resine_cbd',
    description: 'Profil d\'exception évoquant une forêt tropicale après la pluie. Notes terreuses et vertes sur fond de cacao épicé et mousse humide. Une immersion sensorielle dans la jungle.',
    ingredients: 'Bornéol 10%, Linalol 20%, Absolu Cacao 20%, Zingibérène 10%, Cèdre Atlas 10%, Mousse de Chêne 15%, Humulène 15%, CBD Isolate 30%',
    formula: 'Tête 30% (terreux vert) + Cœur 40% (cacao épicé) + Fond 30% (mousse humide)',
    protocol: '1. Préparer la base terreuse : bornéol + linalol\n2. Ajouter absolu cacao comme note centrale\n3. Incorporer zingibérène pour chaleur épicée\n4. Ajouter cèdre atlas pour structure\n5. Finir avec mousse de chêne et humulène\n6. Maturation 14 jours à 18-22°C',
    notes: 'Profil immersif et enveloppant. Le cacao apporte une gourmandise inattendue.',
    texture: 'Résine dense',
    intensity: 9,
    stability: 'high',
    status: 'validated',
    notesTete: 'Terre humide, vert, camphré',
    notesCoeur: 'Cacao amer, gingembre, cèdre',
    notesFond: 'Mousse, boisé humide, terreux persistant'
  },
  {
    name: 'Fleur Fantôme',
    category: 'resine_cbd',
    description: 'Profil d\'exception éthéré et mystérieux. Floral blanc aldéhydé sur fond de musc transparent. Une présence olfactive insaisissable, comme un souvenir de fleur.',
    ingredients: 'Aldéhyde C-11 0.5%, Aldéhyde C-12 0.3%, Linalol 15%, Hédione 20%, Galaxolide 15%, Iso E Super 20%, Ambroxan 10%, Benzyl acetate 10%, CBD Isolate 28%',
    formula: 'Tête 20% (aldéhydé pétillant) + Cœur 40% (floral diffusif) + Fond 40% (musc transparent)',
    protocol: '1. Préparer l\'ouverture aldéhydée : C-11 + C-12 (attention: très puissants)\n2. Ajouter linalol et hédione pour cœur floral\n3. Incorporer benzyl acetate pour jasmin\n4. Ajouter galaxolide et iso E super pour diffusion\n5. Finir avec ambroxan pour sillage\n6. Maturation 10 jours à 18-22°C',
    notes: 'Profil avant-gardiste et poétique. Les aldéhydes créent un effet "fantôme" unique.',
    texture: 'Résine légère',
    intensity: 6,
    stability: 'medium',
    status: 'testing',
    notesTete: 'Aldéhydé, pétillant, savonneux, frais',
    notesCoeur: 'Floral blanc, jasmin, muguet',
    notesFond: 'Musc blanc, ambré, peau, éthéré'
  }
];

// Fonction d'insertion
async function insertRecipes(recipes) {
  console.log('\n📦 Insertion des profils d\'exception...\n');
  
  for (const recipe of recipes) {
    try {
      const [result] = await connection.execute(
        `INSERT INTO recettes (name, category, description, ingredients, formula, protocol, notes, texture, intensity, stability, status, notes_tete, notes_coeur, notes_fond)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          recipe.name,
          recipe.category,
          recipe.description,
          recipe.ingredients,
          recipe.formula,
          recipe.protocol,
          recipe.notes,
          recipe.texture,
          recipe.intensity,
          recipe.stability,
          recipe.status,
          recipe.notesTete,
          recipe.notesCoeur,
          recipe.notesFond
        ]
      );
      console.log(`✅ ${recipe.name} (ID: ${result.insertId})`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⚠️ ${recipe.name} existe déjà`);
      } else {
        console.error(`❌ Erreur ${recipe.name}:`, error.message);
      }
    }
  }
}

// Exécution
console.log('🎨 Import des Profils d\'Exception');
console.log('==================================');

await insertRecipes(profilsException);

// Vérification
const [count] = await connection.execute('SELECT COUNT(*) as total FROM recettes');
console.log(`\n📊 Total recettes: ${count[0].total}`);

await connection.end();
console.log('\n✅ Import terminé');
