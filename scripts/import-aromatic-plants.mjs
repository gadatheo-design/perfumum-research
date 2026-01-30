/**
 * Script d'import des plantes aromatiques colombiennes et burkinabè
 * PERFUMUM Research Project - 06 janvier 2026
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

// Données des plantes aromatiques à importer
const aromaticPlants = [
  // === COLOMBIE ===
  {
    name: "Origan colombien",
    latinName: "Lippia origanoides",
    family: "Verbenaceae",
    category: "aromatique",
    origin: "Colombie (Santander, Santa Marta, Sincelejo)",
    habitat: "Zones semi-arides et collines des Andes colombiennes, canyon du Chicamocha",
    latitude: "6.6437",
    longitude: "-73.6536",
    olfactiveSignature: "Notes phénoliques puissantes, thymol dominant avec facettes herbacées épicées. Caractère chaud et pénétrant rappelant l'origan méditerranéen mais avec plus d'intensité.",
    dominantMolecules: JSON.stringify(["Thymol", "Carvacrol", "p-Cymène", "γ-Terpinène"]),
    chemotypes: "Chémotype thymol (34-58%), Chémotype carvacrol (26-42%), Chémotype mixte thymol-carvacrol",
    climaticAxis: "vent",
    traditionalUse: "Médecine traditionnelle colombienne pour infections respiratoires, troubles digestifs. Utilisé comme condiment et conservateur alimentaire.",
    absorbeUse: "Coupe phénolique pour structures chaudes. Apporte une verticalité aromatique dans les compositions épicées.",
    botanicalStates: JSON.stringify([
      {
        state: "A",
        name: "Feuille fraîche",
        odor: "Herbacée verte, thymol naissant",
        molecules: ["Thymol", "p-Cymène", "γ-Terpinène"],
        usage: "Extraction fraîche, hydrodistillation"
      },
      {
        state: "B",
        name: "Feuille séchée",
        odor: "Phénolique concentrée, épicée",
        molecules: ["Thymol", "Carvacrol"],
        usage: "Infusion, macération"
      }
    ]),
    conservationStatus: "LC",
    citesAppendix: "NONE",
    conservationNotes: "Espèce commune en Colombie, cultivée pour l'industrie des huiles essentielles.",
    notes: "Références: Vicuña GC et al. (2010) DOI:10.1016/j.jep.2009.10.004, Escobar P et al. (2010) PMID:20428679, Oliveira DR et al. (2007) DOI:10.1016/j.foodchem.2006.01.017"
  },
  {
    name: "Pericón",
    latinName: "Tagetes lucida",
    family: "Asteraceae",
    category: "aromatique",
    origin: "Mexique, Amérique Centrale, Colombie",
    habitat: "Prairies et lisières forestières des zones tempérées à subtropicales, 1000-2500m d'altitude",
    latitude: "4.5709",
    longitude: "-74.2973",
    olfactiveSignature: "Notes anisées dominantes (estragole), facettes herbacées fraîches avec légère touche épicée. Caractère doux et enveloppant.",
    dominantMolecules: JSON.stringify(["Estragole", "Anéthole", "Méthyleugénol", "β-Ocimène", "(Z)-Tagétone"]),
    chemotypes: "Chémotype estragole (70-96.8%), Chémotype anéthole (5-42%)",
    climaticAxis: "bois",
    traditionalUse: "Plante sacrée aztèque (Yauhtli), utilisée dans les cérémonies religieuses. Médecine traditionnelle pour troubles digestifs, anxiété. Substitut de l'estragon en cuisine.",
    absorbeUse: "Structure anisée pour compositions douces. Apporte une rondeur aromatique et une profondeur herbacée.",
    botanicalStates: JSON.stringify([
      {
        state: "A",
        name: "Feuille fraîche",
        odor: "Anisée verte, fraîche",
        molecules: ["Estragole", "β-Ocimène"],
        usage: "Extraction fraîche"
      },
      {
        state: "B",
        name: "Fleur séchée",
        odor: "Anisée concentrée, légèrement épicée",
        molecules: ["Estragole", "Anéthole", "Méthyleugénol"],
        usage: "Infusion, macération"
      }
    ]),
    conservationStatus: "LC",
    citesAppendix: "NONE",
    conservationNotes: "Espèce cultivée largement en Amérique latine, aucune menace identifiée.",
    notes: "Références: Regalado EL et al. (2011) DOI:10.1080/10412905.2011.9700485, Bicchi C et al. (1997) DOI:10.1002/(SICI)1099-1026, Caballero-Gallardo K et al. (2022) PMID:35807352"
  },
  
  // === BURKINA FASO ===
  {
    name: "Lippia africaine",
    latinName: "Lippia multiflora",
    family: "Verbenaceae",
    category: "aromatique",
    origin: "Burkina Faso, Ghana, Côte d'Ivoire",
    habitat: "Savanes arborées et zones semi-arides d'Afrique de l'Ouest",
    latitude: "12.3714",
    longitude: "-1.5197",
    olfactiveSignature: "Notes phénoliques chaudes (thymol), facettes aromatiques herbacées avec fond légèrement boisé. Caractère puissant et persistant.",
    dominantMolecules: JSON.stringify(["Thymol", "p-Cymène", "Acétate de thymyle", "γ-Terpinène", "Carvacrol", "β-Caryophyllène"]),
    chemotypes: "Chémotype thymol/p-cymène (Burkina Faso), Chémotype limonène/pipériténone (Angola), Chémotype 1,8-cinéole (Nigeria)",
    climaticAxis: "vent_bois",
    traditionalUse: "Thé de Gambie - infusion populaire en Afrique de l'Ouest. Médecine traditionnelle pour paludisme, fièvres, troubles respiratoires. Répulsif contre les moustiques.",
    absorbeUse: "Double axe vent-bois pour structures complexes. Apporte chaleur phénolique et profondeur sesquiterpénique.",
    botanicalStates: JSON.stringify([
      {
        state: "A",
        name: "Feuille fraîche",
        odor: "Herbacée aromatique, thymol naissant",
        molecules: ["Thymol", "p-Cymène", "γ-Terpinène"],
        usage: "Infusion fraîche, hydrodistillation"
      },
      {
        state: "B",
        name: "Feuille séchée",
        odor: "Phénolique concentrée, boisée",
        molecules: ["Thymol", "Acétate de thymyle", "β-Caryophyllène"],
        usage: "Thé, macération"
      }
    ]),
    conservationStatus: "LC",
    citesAppendix: "NONE",
    conservationNotes: "Espèce commune en Afrique de l'Ouest, cultivée pour usage médicinal et aromatique.",
    notes: "Références: Bassolé IHN et al. (2003) DOI:10.1016/S0031-9422(02)00477-6, Bassolé IHN et al. (2010) DOI:10.3390/molecules15117825, Bayala B et al. (2014) DOI:10.1371/journal.pone.0092122"
  },
  {
    name: "Basilic africain",
    latinName: "Ocimum canum",
    family: "Lamiaceae",
    category: "aromatique",
    origin: "Burkina Faso, Cameroun, Côte d'Ivoire",
    habitat: "Zones tropicales d'Afrique, savanes et jardins cultivés",
    latitude: "12.3714",
    longitude: "-1.5197",
    olfactiveSignature: "Notes camphrées fraîches (1,8-cinéole dominant), facettes herbacées aromatiques avec légère touche épicée. Caractère frais et pénétrant.",
    dominantMolecules: JSON.stringify(["1,8-Cinéole", "cis-Pipéritol", "trans-Pipéritol", "β-Élémène", "Cinnamate d'éthyle", "α-Amorphène"]),
    chemotypes: "Chémotype 1,8-cinéole/camphre (Côte d'Ivoire), Chémotype thymol/p-cymène (Brésil), Chémotype linalol, Chémotype méthyl-cinnamate",
    climaticAxis: "vent",
    traditionalUse: "Médecine traditionnelle africaine pour conjonctivites, maux de tête, fièvres. Utilisé comme condiment et dans les sauces (Ngassoum). Répulsif contre les insectes.",
    absorbeUse: "Coupe fraîche cinéolée pour structures aériennes. Apporte une verticalité camphrée et une fraîcheur herbacée.",
    botanicalStates: JSON.stringify([
      {
        state: "A",
        name: "Feuille fraîche",
        odor: "Camphrée fraîche, herbacée",
        molecules: ["1,8-Cinéole", "cis-Pipéritol"],
        usage: "Extraction fraîche, usage culinaire"
      },
      {
        state: "B",
        name: "Fleur",
        odor: "Sesquiterpénique, cinnamate",
        molecules: ["β-Élémène", "Cinnamate d'éthyle", "α-Amorphène"],
        usage: "Extraction florale"
      }
    ]),
    conservationStatus: "LC",
    citesAppendix: "NONE",
    conservationNotes: "Espèce commune et cultivée en Afrique tropicale, aucune menace identifiée.",
    notes: "Références: Bassolé IHN et al. (2020) Global Journal of Food and Agricultural Sciences, Tchoumbougnang F et al. (2006) Journal of Essential Oil Research, da Silva VD et al. (2018) DOI:10.1016/j.indcrop.2018.04.025"
  }
];

// Molécules associées aux plantes (à lier après import)
const moleculeProfiles = {
  "Lippia origanoides": [
    { name: "Thymol", percentageMin: 34, percentageMax: 58, percentageTypical: 47, isSignature: 1, role: "Composé majoritaire" },
    { name: "Carvacrol", percentageMin: 26, percentageMax: 42, percentageTypical: 33, isSignature: 1, role: "Composé secondaire majeur" },
    { name: "p-Cymène", percentageMin: 11, percentageMax: 19, percentageTypical: 15, isSignature: 0, role: "Précurseur biosynthétique" },
    { name: "γ-Terpinène", percentageMin: 8, percentageMax: 10.5, percentageTypical: 9, isSignature: 0, role: "Monoterpène" }
  ],
  "Tagetes lucida": [
    { name: "Estragole", percentageMin: 70, percentageMax: 96.8, percentageTypical: 85, isSignature: 1, role: "Composé majoritaire" },
    { name: "Anéthole", percentageMin: 5, percentageMax: 42, percentageTypical: 15, isSignature: 1, role: "Composé secondaire" },
    { name: "Méthyleugénol", percentageMin: 2, percentageMax: 8, percentageTypical: 5, isSignature: 0, role: "Phénylpropène" },
    { name: "β-Ocimène", percentageMin: 1, percentageMax: 11, percentageTypical: 6, isSignature: 0, role: "Monoterpène" }
  ],
  "Lippia multiflora": [
    { name: "Thymol", percentageMin: 29, percentageMax: 40, percentageTypical: 35, isSignature: 1, role: "Composé majoritaire" },
    { name: "p-Cymène", percentageMin: 14, percentageMax: 26, percentageTypical: 20, isSignature: 1, role: "Composé secondaire majeur" },
    { name: "Acétate de thymyle", percentageMin: 11, percentageMax: 14, percentageTypical: 12.5, isSignature: 0, role: "Ester" },
    { name: "γ-Terpinène", percentageMin: 5, percentageMax: 10, percentageTypical: 7.5, isSignature: 0, role: "Monoterpène" },
    { name: "Carvacrol", percentageMin: 3, percentageMax: 8, percentageTypical: 5.5, isSignature: 0, role: "Phénol monoterpénique" },
    { name: "β-Caryophyllène", percentageMin: 2, percentageMax: 6, percentageTypical: 4, isSignature: 0, role: "Sesquiterpène" }
  ],
  "Ocimum canum": [
    { name: "1,8-Cinéole", percentageMin: 60, percentageMax: 68.5, percentageTypical: 64, isSignature: 1, role: "Composé majoritaire" },
    { name: "cis-Pipéritol", percentageMin: 5, percentageMax: 15, percentageTypical: 10, isSignature: 0, role: "Alcool monoterpénique" },
    { name: "trans-Pipéritol", percentageMin: 5, percentageMax: 15, percentageTypical: 10, isSignature: 0, role: "Alcool monoterpénique" },
    { name: "β-Élémène", percentageMin: 20, percentageMax: 33, percentageTypical: 26, isSignature: 1, role: "Sesquiterpène (fleurs)" },
    { name: "Cinnamate d'éthyle", percentageMin: 20, percentageMax: 30, percentageTypical: 25, isSignature: 0, role: "Ester aromatique (fleurs)" }
  ]
};

async function importPlants() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    console.log('🌿 Début de l\'import des plantes aromatiques...\n');
    
    for (const plant of aromaticPlants) {
      // Vérifier si la plante existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM plants WHERE latin_name = ?',
        [plant.latinName]
      );
      
      if (existing.length > 0) {
        console.log(`⚠️  ${plant.name} (${plant.latinName}) existe déjà, mise à jour...`);
        
        await connection.execute(`
          UPDATE plants SET
            name = ?,
            family = ?,
            category = ?,
            origin = ?,
            habitat = ?,
            latitude = ?,
            longitude = ?,
            olfactive_signature = ?,
            dominant_molecules = ?,
            chemotypes = ?,
            climatic_axis = ?,
            traditional_use = ?,
            absorbe_use = ?,
            botanical_states = ?,
            conservation_status = ?,
            cites_appendix = ?,
            conservation_notes = ?,
            notes = ?,
            updated_at = NOW()
          WHERE latin_name = ?
        `, [
          plant.name,
          plant.family,
          plant.category,
          plant.origin,
          plant.habitat,
          plant.latitude,
          plant.longitude,
          plant.olfactiveSignature,
          plant.dominantMolecules,
          plant.chemotypes,
          plant.climaticAxis,
          plant.traditionalUse,
          plant.absorbeUse,
          plant.botanicalStates,
          plant.conservationStatus,
          plant.citesAppendix,
          plant.conservationNotes,
          plant.notes,
          plant.latinName
        ]);
        
        console.log(`✅ ${plant.name} mis à jour avec succès`);
      } else {
        // Insérer la nouvelle plante
        await connection.execute(`
          INSERT INTO plants (
            name, latin_name, family, category, origin, habitat,
            latitude, longitude, olfactive_signature, dominant_molecules,
            chemotypes, climatic_axis, traditional_use, absorbe_use,
            botanical_states, conservation_status, cites_appendix,
            conservation_notes, notes, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
          plant.name,
          plant.latinName,
          plant.family,
          plant.category,
          plant.origin,
          plant.habitat,
          plant.latitude,
          plant.longitude,
          plant.olfactiveSignature,
          plant.dominantMolecules,
          plant.chemotypes,
          plant.climaticAxis,
          plant.traditionalUse,
          plant.absorbeUse,
          plant.botanicalStates,
          plant.conservationStatus,
          plant.citesAppendix,
          plant.conservationNotes,
          plant.notes
        ]);
        
        console.log(`✅ ${plant.name} (${plant.latinName}) importé avec succès`);
      }
    }
    
    console.log('\n📊 Résumé de l\'import:');
    console.log(`   - 4 plantes aromatiques traitées`);
    console.log(`   - 2 plantes colombiennes (Lippia origanoides, Tagetes lucida)`);
    console.log(`   - 2 plantes burkinabè (Lippia multiflora, Ocimum canum)`);
    
    // Afficher les IDs des plantes importées
    const [plants] = await connection.execute(`
      SELECT id, name, latin_name, origin 
      FROM plants 
      WHERE latin_name IN ('Lippia origanoides', 'Tagetes lucida', 'Lippia multiflora', 'Ocimum canum')
      ORDER BY name
    `);
    
    console.log('\n🌿 Plantes dans la base de données:');
    for (const p of plants) {
      console.log(`   ID ${p.id}: ${p.name} (${p.latin_name}) - ${p.origin}`);
    }
    
    console.log('\n✅ Import terminé avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'import:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

importPlants().catch(console.error);
