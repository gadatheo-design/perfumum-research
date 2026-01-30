import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('=== Import des données pédologiques des terroirs ===\n');
  
  // Données pédologiques des nouvelles régions
  const terroirsData = [
    // Cameroun
    {
      region_name: 'Cameroun (Wrapper)',
      country: 'Cameroun',
      soil_type: 'Sols volcaniques ferralitiques',
      ph_range: '5.5-6.5',
      organic_matter: '4-6%',
      clay_content: '35-45%',
      drainage: 'Excellent',
      altitude: '800-1200m',
      climate: 'Tropical humide',
      rainfall: '2000-3000mm/an',
      temperature_avg: '22-26°C',
      minerals: JSON.stringify({
        fer: 'Très élevé',
        potassium: 'Élevé',
        magnesium: 'Modéré',
        calcium: 'Modéré',
        phosphore: 'Élevé'
      }),
      signature_olfactive: 'Épicée douce, boisée, notes de cacao et café',
      tobacco_varieties: 'Wrapper Cameroun, Cameroon Shade',
      unique_characteristics: 'Sols volcaniques riches en fer donnant une couleur brun-rougeâtre distinctive et des notes épicées douces',
      terpene_profile: JSON.stringify({
        dominant: ['β-Caryophyllène', 'Limonène'],
        secondary: ['α-Humulène', 'Linalol'],
        signature: 'Épicé-boisé avec touches florales'
      })
    },
    // Sumatra
    {
      region_name: 'Sumatra (Indonésie)',
      country: 'Indonésie',
      soil_type: 'Sols volcaniques andosols',
      ph_range: '5.0-6.0',
      organic_matter: '5-8%',
      clay_content: '25-35%',
      drainage: 'Bon',
      altitude: '600-1000m',
      climate: 'Équatorial',
      rainfall: '2500-4000mm/an',
      temperature_avg: '24-28°C',
      minerals: JSON.stringify({
        fer: 'Élevé',
        potassium: 'Très élevé',
        magnesium: 'Élevé',
        calcium: 'Modéré',
        soufre: 'Élevé'
      }),
      signature_olfactive: 'Terreuse profonde, épicée, notes de cuir et de terre humide',
      tobacco_varieties: 'Sumatra Wrapper, Sumatra Binder',
      unique_characteristics: 'Sols volcaniques acides avec haute teneur en soufre, produisant des tabacs sombres aux arômes terreux intenses',
      terpene_profile: JSON.stringify({
        dominant: ['Myrcène', 'β-Caryophyllène'],
        secondary: ['α-Pinène', 'Géraniol'],
        signature: 'Terreux-épicé avec notes boisées'
      })
    },
    // Connecticut
    {
      region_name: 'Connecticut Valley (USA)',
      country: 'États-Unis',
      soil_type: 'Sols alluviaux sablonneux',
      ph_range: '6.0-7.0',
      organic_matter: '2-4%',
      clay_content: '15-25%',
      drainage: 'Excellent',
      altitude: '50-150m',
      climate: 'Continental tempéré',
      rainfall: '1000-1200mm/an',
      temperature_avg: '10-20°C',
      minerals: JSON.stringify({
        fer: 'Modéré',
        potassium: 'Modéré',
        magnesium: 'Faible',
        calcium: 'Élevé',
        silice: 'Très élevé'
      }),
      signature_olfactive: 'Douce, crémeuse, notes de noisette et de céréales',
      tobacco_varieties: 'Connecticut Shade, Connecticut Broadleaf',
      unique_characteristics: 'Sols sablonneux riches en silice avec culture sous voile (shade-grown), produisant des wrappers légers et doux',
      terpene_profile: JSON.stringify({
        dominant: ['Linalol', 'Géraniol'],
        secondary: ['Limonène', 'α-Terpinéol'],
        signature: 'Floral-crémeux avec notes douces'
      })
    },
    // Nicaragua - Jalapa
    {
      region_name: 'Jalapa Valley (Nicaragua)',
      country: 'Nicaragua',
      soil_type: 'Sols volcaniques fertiles',
      ph_range: '5.8-6.5',
      organic_matter: '3-5%',
      clay_content: '30-40%',
      drainage: 'Bon',
      altitude: '700-900m',
      climate: 'Tropical de montagne',
      rainfall: '1500-2000mm/an',
      temperature_avg: '20-25°C',
      minerals: JSON.stringify({
        fer: 'Élevé',
        potassium: 'Élevé',
        magnesium: 'Modéré',
        calcium: 'Modéré',
        phosphore: 'Modéré'
      }),
      signature_olfactive: 'Douce, crémeuse, notes de café et de chocolat',
      tobacco_varieties: 'Jalapa Filler, Jalapa Wrapper',
      unique_characteristics: 'Vallée protégée avec microclima doux, produisant des tabacs équilibrés aux notes crémeuses',
      terpene_profile: JSON.stringify({
        dominant: ['Linalol', 'β-Caryophyllène'],
        secondary: ['Myrcène', 'Limonène'],
        signature: 'Crémeux-épicé équilibré'
      })
    },
    // Honduras - Copán
    {
      region_name: 'Copán Valley (Honduras)',
      country: 'Honduras',
      soil_type: 'Sols volcaniques et calcaires',
      ph_range: '6.0-7.0',
      organic_matter: '3-4%',
      clay_content: '25-35%',
      drainage: 'Bon',
      altitude: '600-800m',
      climate: 'Tropical de montagne',
      rainfall: '1200-1800mm/an',
      temperature_avg: '22-26°C',
      minerals: JSON.stringify({
        fer: 'Modéré',
        potassium: 'Élevé',
        magnesium: 'Élevé',
        calcium: 'Très élevé',
        phosphore: 'Modéré'
      }),
      signature_olfactive: 'Équilibrée, boisée, notes de noix et de caramel',
      tobacco_varieties: 'Honduran Filler, Honduran Wrapper',
      unique_characteristics: 'Sols calcaires riches en calcium produisant des tabacs équilibrés avec une douceur naturelle',
      terpene_profile: JSON.stringify({
        dominant: ['Limonène', 'Linalol'],
        secondary: ['β-Caryophyllène', 'α-Pinène'],
        signature: 'Boisé-doux avec notes fruitées'
      })
    },
    // République Dominicaine - Cibao
    {
      region_name: 'Cibao Valley (République Dominicaine)',
      country: 'République Dominicaine',
      soil_type: 'Sols alluviaux fertiles',
      ph_range: '6.5-7.5',
      organic_matter: '2-3%',
      clay_content: '20-30%',
      drainage: 'Excellent',
      altitude: '100-300m',
      climate: 'Tropical',
      rainfall: '1000-1500mm/an',
      temperature_avg: '24-28°C',
      minerals: JSON.stringify({
        fer: 'Modéré',
        potassium: 'Modéré',
        magnesium: 'Modéré',
        calcium: 'Élevé',
        phosphore: 'Élevé'
      }),
      signature_olfactive: 'Légère, crémeuse, notes florales et de miel',
      tobacco_varieties: 'Dominican Filler, Olor Dominicano, Piloto Cubano',
      unique_characteristics: 'Sols alluviaux bien drainés produisant des tabacs légers et aromatiques, idéaux pour les mélanges',
      terpene_profile: JSON.stringify({
        dominant: ['Géraniol', 'Linalol'],
        secondary: ['Limonène', 'Nérolidol'],
        signature: 'Floral-miellé délicat'
      })
    },
    // Brésil - Bahia
    {
      region_name: 'Bahia (Brésil)',
      country: 'Brésil',
      soil_type: 'Sols argileux rouges (Mata)',
      ph_range: '5.5-6.5',
      organic_matter: '3-5%',
      clay_content: '40-50%',
      drainage: 'Modéré',
      altitude: '200-400m',
      climate: 'Tropical semi-aride',
      rainfall: '800-1200mm/an',
      temperature_avg: '24-28°C',
      minerals: JSON.stringify({
        fer: 'Très élevé',
        potassium: 'Modéré',
        magnesium: 'Faible',
        calcium: 'Faible',
        aluminium: 'Élevé'
      }),
      signature_olfactive: 'Terreuse, épicée, notes de poivre noir et de cuir',
      tobacco_varieties: 'Mata Fina, Arapiraca',
      unique_characteristics: 'Sols argileux riches en fer avec climat semi-aride, produisant des tabacs foncés aux arômes intenses',
      terpene_profile: JSON.stringify({
        dominant: ['β-Caryophyllène', 'α-Humulène'],
        secondary: ['Myrcène', 'α-Pinène'],
        signature: 'Épicé-terreux intense'
      })
    }
  ];
  
  // Insérer les nouvelles régions
  let insertedCount = 0;
  for (const terroir of terroirsData) {
    // Vérifier si la région existe déjà
    const [existing] = await conn.execute(
      'SELECT id FROM soil_analyses WHERE terroir_name = ?',
      [terroir.region_name]
    );
    
    if (existing.length === 0) {
      // Extraire les minéraux du JSON
      const minerals = JSON.parse(terroir.minerals);
      
      await conn.execute(`
        INSERT INTO soil_analyses 
        (terroir_name, country, region, soil_type, ph_level, organic_matter_percent, 
         potassium_content, calcium_content, magnesium_content, iron_content,
         drainage_quality, altitude_meters, climate_type, annual_rainfall_mm, 
         temperature_range, aromatic_influence, comparison_notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        terroir.region_name,
        terroir.country,
        terroir.region_name.split(' (')[0],
        terroir.soil_type,
        parseFloat(terroir.ph_range.split('-')[0]),
        parseFloat(terroir.organic_matter.replace('%', '')),
        minerals.potassium || 'Non mesuré',
        minerals.calcium || 'Non mesuré',
        minerals.magnesium || 'Non mesuré',
        minerals.fer || 'Non mesuré',
        terroir.drainage,
        parseInt(terroir.altitude.split('-')[0]),
        terroir.climate,
        parseInt(terroir.rainfall.split('-')[0]),
        terroir.temperature_avg,
        terroir.signature_olfactive,
        terroir.unique_characteristics
      ]);
      insertedCount++;
      console.log(`  ✓ ${terroir.region_name} ajouté`);
    } else {
      console.log(`  - ${terroir.region_name} existe déjà`);
    }
  }
  
  console.log(`\nTerroirs ajoutés: ${insertedCount}`);
  
  // Vérifier le total
  const [total] = await conn.execute('SELECT COUNT(*) as count FROM soil_analyses');
  console.log(`Total terroirs dans la base: ${total[0].count}`);
  
  await conn.end();
  console.log('\n✅ Import des terroirs terminé!');
}

main().catch(console.error);
