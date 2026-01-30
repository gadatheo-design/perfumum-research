import mysql from 'mysql2/promise';

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  // D'abord, récupérer les IDs des variétés
  const [varieties] = await connection.execute(
    `SELECT id, variety_id, name, variety_type FROM plant_varieties WHERE plant_id = 210030`
  );
  
  console.log('Variétés de cannabis trouvées:');
  const varietyMap = {};
  for (const v of varieties) {
    console.log(`  ${v.id}: ${v.name} (${v.variety_type})`);
    varietyMap[v.variety_id] = v.id;
  }
  
  // Relations généalogiques documentées
  // Cherry Pie = Durban Poison x Granddaddy Purple (GDP = Purple Urkle x Big Bud)
  // Pink Pepper = (Colombian x Thai) x Afghani
  // Lamb's Bread = Jamaican landrace pure
  // CBDRx = Hemp variety bred for high CBD
  
  const genealogies = [
    // Cherry Pie a pour parent Durban Poison
    { 
      variety_id: 'cherry_pie', 
      parent_variety_id: 'landrace_durban_poison', 
      relationship_type: 'hybrid',
      notes: 'Cherry Pie est un hybride de Durban Poison et Granddaddy Purple. Durban Poison apporte les notes d\'anis et le terpinolène dominant.'
    },
    // Pink Pepper a pour parents Colombian Gold et Thai Stick
    { 
      variety_id: 'pink_pepper', 
      parent_variety_id: 'landrace_colombian_gold', 
      relationship_type: 'hybrid',
      notes: 'Pink Pepper descend de Colombian Gold (lignée Sativa sud-américaine). Apporte les notes citrus et sucrées.'
    },
    { 
      variety_id: 'pink_pepper', 
      parent_variety_id: 'landrace_thai_stick', 
      relationship_type: 'hybrid',
      notes: 'Pink Pepper descend également de Thai Stick (lignée Sativa asiatique). Apporte les notes tropicales.'
    },
    // Punto Rojo est une landrace colombienne (auto-référence)
    { 
      variety_id: 'punto_rojo', 
      parent_variety_id: 'landrace_colombian_gold', 
      relationship_type: 'parent',
      notes: 'Punto Rojo est une sélection locale de la lignée Colombian Gold, cultivée dans la région de Cauca.'
    },
    // Lamb's Bread est une landrace jamaïcaine pure
    { 
      variety_id: 'lambs_bread', 
      parent_variety_id: 'landrace_malawi_gold', 
      relationship_type: 'parent',
      notes: 'Lamb\'s Bread partage des ancêtres africains avec Malawi Gold via les routes commerciales historiques.'
    }
  ];
  
  console.log('\\nImport des relations généalogiques:');
  
  for (const gen of genealogies) {
    const varietyId = varietyMap[gen.variety_id];
    const parentId = varietyMap[gen.parent_variety_id];
    
    if (!varietyId || !parentId) {
      console.log(`⊘ Skipping: ${gen.variety_id} -> ${gen.parent_variety_id} (IDs not found)`);
      continue;
    }
    
    try {
      await connection.execute(
        `INSERT INTO variety_genealogy (variety_id, parent_variety_id, relationship_type, notes)
         VALUES (?, ?, ?, ?)`,
        [varietyId, parentId, gen.relationship_type, gen.notes]
      );
      console.log(`✓ ${gen.variety_id} <- ${gen.parent_variety_id} (${gen.relationship_type})`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⊘ Already exists: ${gen.variety_id} <- ${gen.parent_variety_id}`);
      } else {
        console.error(`✗ Error: ${error.message}`);
      }
    }
  }
  
  await connection.end();
  console.log('\\nImport complete!');
}

main().catch(console.error);
