import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found in environment');
  process.exit(1);
}

// Scientific data for 30 key molecules
const moleculeData = [
  // Terpènes
  { name: 'α-pinène', molecularWeight: 136, boilingPoint: 155, logP: 450, volatility: 85, intensity: 70, complexity: 40 },
  { name: 'β-pinène', molecularWeight: 136, boilingPoint: 166, logP: 440, volatility: 80, intensity: 65, complexity: 40 },
  { name: 'Limonène', molecularWeight: 136, boilingPoint: 176, logP: 460, volatility: 75, intensity: 80, complexity: 35 },
  { name: 'Myrcène', molecularWeight: 136, boilingPoint: 167, logP: 430, volatility: 80, intensity: 75, complexity: 35 },
  { name: 'Linalol', molecularWeight: 154, boilingPoint: 198, logP: 290, volatility: 65, intensity: 85, complexity: 50 },
  { name: 'Géraniol', molecularWeight: 154, boilingPoint: 230, logP: 310, volatility: 55, intensity: 90, complexity: 50 },
  { name: 'Citronellol', molecularWeight: 156, boilingPoint: 225, logP: 320, volatility: 55, intensity: 85, complexity: 45 },
  { name: 'Terpinéol', molecularWeight: 154, boilingPoint: 219, logP: 280, volatility: 60, intensity: 70, complexity: 50 },
  
  // Sesquiterpènes
  { name: 'β-caryophyllène', molecularWeight: 204, boilingPoint: 262, logP: 670, volatility: 40, intensity: 75, complexity: 70 },
  { name: 'Humulène', molecularWeight: 204, boilingPoint: 257, logP: 650, volatility: 45, intensity: 70, complexity: 70 },
  { name: 'Vétivénol', molecularWeight: 222, boilingPoint: 285, logP: 580, volatility: 30, intensity: 90, complexity: 80 },
  { name: 'Patchoulol', molecularWeight: 222, boilingPoint: 287, logP: 590, volatility: 30, intensity: 95, complexity: 80 },
  { name: 'Cédrol', molecularWeight: 222, boilingPoint: 291, logP: 570, volatility: 25, intensity: 80, complexity: 75 },
  { name: 'Santalol', molecularWeight: 220, boilingPoint: 301, logP: 560, volatility: 20, intensity: 85, complexity: 80 },
  
  // Aldéhydes
  { name: 'Hexanal', molecularWeight: 100, boilingPoint: 131, logP: 180, volatility: 90, intensity: 75, complexity: 25 },
  { name: 'Octanal', molecularWeight: 128, boilingPoint: 171, logP: 280, volatility: 75, intensity: 70, complexity: 30 },
  { name: 'Décanal', molecularWeight: 156, boilingPoint: 209, logP: 380, volatility: 60, intensity: 75, complexity: 35 },
  { name: 'Benzaldéhyde', molecularWeight: 106, boilingPoint: 179, logP: 150, volatility: 75, intensity: 90, complexity: 40 },
  { name: 'Cinnamaldéhyde', molecularWeight: 132, boilingPoint: 248, logP: 190, volatility: 50, intensity: 95, complexity: 55 },
  
  // Cétones
  { name: 'Ionone α', molecularWeight: 192, boilingPoint: 243, logP: 440, volatility: 50, intensity: 85, complexity: 65 },
  { name: 'Ionone β', molecularWeight: 192, boilingPoint: 246, logP: 450, volatility: 50, intensity: 90, complexity: 65 },
  { name: 'Damascone', molecularWeight: 190, boilingPoint: 235, logP: 430, volatility: 55, intensity: 95, complexity: 70 },
  { name: 'Carvone', molecularWeight: 150, boilingPoint: 231, logP: 260, volatility: 55, intensity: 85, complexity: 50 },
  
  // Phénols
  { name: 'Eugénol', molecularWeight: 164, boilingPoint: 254, logP: 240, volatility: 45, intensity: 95, complexity: 60 },
  { name: 'Gaïacol', molecularWeight: 124, boilingPoint: 205, logP: 170, volatility: 65, intensity: 90, complexity: 45 },
  { name: 'Vanilline', molecularWeight: 152, boilingPoint: 285, logP: 130, volatility: 30, intensity: 100, complexity: 55 },
  
  // Esters
  { name: 'Acétate de linalyle', molecularWeight: 196, boilingPoint: 220, logP: 350, volatility: 60, intensity: 80, complexity: 55 },
  { name: 'Acétate de géranyle', molecularWeight: 196, boilingPoint: 242, logP: 370, volatility: 50, intensity: 85, complexity: 55 },
  { name: 'Benzoate de benzyle', molecularWeight: 212, boilingPoint: 323, logP: 340, volatility: 15, intensity: 90, complexity: 65 },
  
  // Lactones
  { name: 'γ-décalactone', molecularWeight: 170, boilingPoint: 279, logP: 290, volatility: 35, intensity: 95, complexity: 60 }
];

async function populateMoleculeData() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    console.log('🔬 Starting molecule data population...\n');
    
    let updated = 0;
    let notFound = 0;
    
    for (const data of moleculeData) {
      const [rows] = await connection.execute(
        'SELECT id FROM molecules WHERE name = ? LIMIT 1',
        [data.name]
      );
      
      if (rows.length > 0) {
        const moleculeId = rows[0].id;
        await connection.execute(
          `UPDATE molecules 
           SET molecularWeight = ?, 
               boilingPoint = ?, 
               logP = ?, 
               volatility = ?, 
               intensity = ?, 
               complexity = ?
           WHERE id = ?`,
          [
            data.molecularWeight,
            data.boilingPoint,
            data.logP,
            data.volatility,
            data.intensity,
            data.complexity,
            moleculeId
          ]
        );
        console.log(`✅ Updated: ${data.name} (MW: ${data.molecularWeight}, BP: ${data.boilingPoint}°C)`);
        updated++;
      } else {
        console.log(`⚠️  Not found: ${data.name}`);
        notFound++;
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Updated: ${updated} molecules`);
    console.log(`   Not found: ${notFound} molecules`);
    console.log(`\n✨ Molecule data population completed!`);
    
  } catch (error) {
    console.error('❌ Error populating molecule data:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

populateMoleculeData();
