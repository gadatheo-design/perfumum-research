import { getDb } from '../server/db.ts';
import { traditionsOlfactives, accords } from '../drizzle/schema.ts';
import { eq, like } from 'drizzle-orm';

async function updateGammes() {
  const db = await getDb();
  
  console.log('🔄 MISE À JOUR DES GAMMES\n');
  console.log('='.repeat(60));
  
  // 1. Renommer "Civilisation Mossi" en "Mossi"
  console.log('\n1️⃣ Renommage de "Civilisation Mossi" en "Mossi"...');
  
  const mossiTraditions = await db.select()
    .from(traditionsOlfactives)
    .where(like(traditionsOlfactives.name, '%Mossi%'));
  
  if (mossiTraditions.length > 0) {
    for (const tradition of mossiTraditions) {
      const newName = tradition.name.replace('Civilisation Mossi', 'Mossi').replace('civilisation Mossi', 'Mossi');
      await db.update(traditionsOlfactives)
        .set({ name: newName })
        .where(eq(traditionsOlfactives.id, tradition.id));
      console.log(`   ✅ "${tradition.name}" → "${newName}"`);
    }
  } else {
    console.log('   ℹ️  Aucune tradition Mossi trouvée');
  }
  
  // 2. Créer la gamme "Colombie"
  console.log('\n2️⃣ Création de la gamme "Colombie"...');
  
  // Vérifier si la gamme existe déjà
  const existingColombie = await db.select()
    .from(traditionsOlfactives)
    .where(eq(traditionsOlfactives.name, 'Colombie'));
  
  if (existingColombie.length > 0) {
    console.log('   ℹ️  La gamme "Colombie" existe déjà');
  } else {
    // Créer un accord signature pour la Colombie
    const colombianSignatureAccord = await db.insert(accords).values({
      name: "Accord Colombien",
      description: "Signature olfactive de la biodiversité colombienne : café, cacao, fruits tropicaux et bois précieux",
      notes: "Accord tropical complexe mêlant la richesse des Andes, la chaleur de la côte caraïbe et la profondeur de l'Amazonie",
      radarIntensity: 80,
      radarFreshness: 65,
      radarWarmth: 75,
      radarSweetness: 70,
      radarSpiciness: 60,
      radarEarthiness: 65
    });
    
    const accordId = colombianSignatureAccord[0].insertId;
    
    // Créer la tradition olfactive Colombie
    await db.insert(traditionsOlfactives).values({
      name: "Colombie",
      region: "Amérique du Sud - Colombie",
      symbolicMaterials: JSON.stringify([
        "Café Geisha",
        "Cacao Colombien",
        "Baume de Tolú",
        "Copal Colombien",
        "Cedro Rosado",
        "Lippia Origanoides",
        "Palo Santo"
      ]),
      signatureAccordId: accordId,
      longDescription: `La tradition olfactive colombienne puise dans une biodiversité exceptionnelle, fruit de la rencontre entre les Andes, l'Amazonie et la côte caraïbe. Cette gamme célèbre les matières premières endémiques et les plantes médicinales ancestrales utilisées par les peuples indigènes.

**Richesse Botanique** : La Colombie abrite des espèces uniques comme le Lippia Origanoides (origan sauvage andin), le Turnera Diffusa (damiana), et des variétés rares de café et cacao reconnus mondialement.

**Héritage Chamanique** : Les résines sacrées (copal, baume de Tolú) et les plantes rituelles (yagé, borrachero) témoignent d'une tradition spirituelle millénaire où l'olfaction guide les cérémonies de guérison.

**Terroir Unique** : L'altitude, le climat tropical et les sols volcaniques confèrent aux matières colombiennes une intensité et une complexité aromatique incomparables, des notes vertes acidulées du lulo aux nuances balsamiques du baume de Tolú.

Cette gamme représente un pont entre tradition ancestrale et innovation contemporaine, honorant le savoir des communautés indigènes tout en explorant de nouvelles compositions olfactives.`,
      temporality: "antique",
      bibliographicReferences: JSON.stringify([
        "Schultes, R.E. & Raffauf, R.F. (1990). The Healing Forest: Medicinal and Toxic Plants of the Northwest Amazonia",
        "Patiño, V.M. (2002). Historia de la Cultura Material en la América Equinoccial",
        "García Barriga, H. (1992). Flora Medicinal de Colombia - Botánica Médica"
      ])
    });
    
    console.log('   ✅ Gamme "Colombie" créée avec succès');
    console.log(`   ✅ Accord signature créé (ID: ${accordId})`);
  }
  
  // 3. Vérification finale
  console.log('\n3️⃣ Vérification finale...');
  
  const allTraditions = await db.select().from(traditionsOlfactives);
  const mossi = allTraditions.filter(t => t.name.includes('Mossi'));
  const colombie = allTraditions.filter(t => t.name === 'Colombie');
  
  console.log(`   • Total traditions : ${allTraditions.length}`);
  console.log(`   • Traditions Mossi : ${mossi.length} (${mossi.map(t => t.name).join(', ')})`);
  console.log(`   • Tradition Colombie : ${colombie.length > 0 ? '✅' : '❌'}`);
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ MISE À JOUR TERMINÉE\n');
  
  process.exit(0);
}

updateGammes();
