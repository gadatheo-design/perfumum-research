// Script d'import des molécules osmothèque historiques
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Les 10 molécules osmothèque historiques
const osmothequeMolecules = [
  {
    name: 'Musk Ketone',
    cas_number: '81-14-1',
    formula: 'C14H18N2O5',
    molecular_weight: 294.30,
    odor_description: 'Musqué puissant, animal, chaud',
    family: 'Muscs nitrés',
    status: 'Interdit',
    historical_notes: 'Synthétisé en 1894. Utilisé dans les parfums classiques du début XXe siècle. Interdit pour bioaccumulation et persistance environnementale.',
    osmotheque_reference: true
  },
  {
    name: 'Musk Xylene',
    cas_number: '81-15-2',
    formula: 'C12H15N3O6',
    molecular_weight: 297.27,
    odor_description: 'Musqué doux, poudré',
    family: 'Muscs nitrés',
    status: 'Interdit',
    historical_notes: 'Note musquée douce et poudrée. Interdit pour toxicité et accumulation dans les tissus. Présent dans de nombreux parfums vintage.',
    osmotheque_reference: true
  },
  {
    name: 'Musk Ambrette',
    cas_number: '83-66-9',
    formula: 'C12H16N2O5',
    molecular_weight: 268.27,
    odor_description: 'Musqué avec facette ambrée',
    family: 'Muscs nitrés',
    status: 'Interdit',
    historical_notes: 'Note musquée avec facette ambrée. Interdit pour neurotoxicité potentielle. Utilisé dans les parfums orientaux classiques.',
    osmotheque_reference: true
  },
  {
    name: 'Mousse de Chêne (Oakmoss)',
    cas_number: '90028-68-5',
    formula: 'Mélange complexe',
    molecular_weight: null,
    odor_description: 'Terreux, boisé, humide, forestier',
    family: 'Lichens',
    status: 'Fortement restreint',
    historical_notes: 'Evernia prunastri. Composant essentiel des accords chyprés. Restriction IFRA: max 0.1%. Allergènes Chloroatranol et Atranol doivent être éliminés. Reformulation de Mitsouko et Miss Dior.',
    osmotheque_reference: true
  },
  {
    name: 'Coumarine',
    cas_number: '91-64-5',
    formula: 'C9H6O2',
    molecular_weight: 146.14,
    odor_description: 'Vanillé, foin coupé, amande amère',
    family: 'Lactones',
    status: 'Restreint',
    historical_notes: 'Présente naturellement dans la fève tonka (Dipteryx odorata). Utilisée dans Jicky (Guerlain, 1889). Concentration limitée par réglementation.',
    osmotheque_reference: true
  },
  {
    name: 'Safrole',
    cas_number: '94-59-7',
    formula: 'C10H10O2',
    molecular_weight: 162.19,
    odor_description: 'Épicé, anisé, root beer',
    family: 'Phénylpropanoïdes',
    status: 'Interdit',
    historical_notes: 'Extrait de Sassafras albidum. Interdit car cancérigène potentiel. Utilisé dans les parfums du début XXe siècle.',
    osmotheque_reference: true
  },
  {
    name: 'Huile de Bois de Rose',
    cas_number: '8015-77-8',
    formula: 'Linalool majoritaire',
    molecular_weight: 154.25,
    odor_description: 'Boisé, rosé, doux',
    family: 'Huiles essentielles',
    status: 'En voie de disparition',
    historical_notes: 'Aniba rosaeodora. Espèce menacée par surexploitation en Amazonie. Remplacée par des synthétiques (linalool).',
    osmotheque_reference: true
  },
  {
    name: 'Civette Naturelle (Civettone)',
    cas_number: '542-46-1',
    formula: 'C17H30O',
    molecular_weight: 250.42,
    odor_description: 'Animal, fécal, musqué',
    family: 'Macrocycliques',
    status: 'Abandonné',
    historical_notes: 'Extrait de civette. Abandonné pour raisons éthiques (cruauté animale). Remplacé par des synthétiques. Utilisé dans les parfums orientaux classiques.',
    osmotheque_reference: true
  },
  {
    name: 'Castoreum Naturel',
    cas_number: '8023-98-1',
    formula: 'Mélange complexe',
    molecular_weight: null,
    odor_description: 'Cuir, animal, fumé',
    family: 'Extraits animaux',
    status: 'Quasi abandonné',
    historical_notes: 'Extrait de castor. Quasi abandonné pour raisons éthiques et de coût. Présent dans les parfums cuir classiques.',
    osmotheque_reference: true
  },
  {
    name: 'Ambre Gris Naturel',
    cas_number: '8038-65-1',
    formula: 'Ambréine majoritaire',
    molecular_weight: 428.74,
    odor_description: 'Marin, animal, ambré, doux',
    family: 'Extraits animaux',
    status: 'Rare et coûteux',
    historical_notes: 'Physeter macrocephalus (cachalot). Très rare et extrêmement coûteux. Remplacé par Ambroxan (synthétique).',
    osmotheque_reference: true
  }
];

console.log(`📋 Import de ${osmothequeMolecules.length} molécules osmothèque...`);

let imported = 0;

for (const mol of osmothequeMolecules) {
  try {
    // Vérifier si la molécule existe déjà
    const [existing] = await connection.execute(
      'SELECT id FROM molecules WHERE name = ? OR cas_number = ?',
      [mol.name, mol.cas_number]
    );
    
    if (existing.length > 0) {
      // Mettre à jour les notes avec le statut réglementaire
      await connection.execute(`
        UPDATE molecules 
        SET notes = CONCAT(IFNULL(notes, ''), '\n\n[OSMOTHÈQUE - Statut: ', ?, '] ', ?)
        WHERE id = ?
      `, [mol.status, mol.historical_notes, existing[0].id]);
      console.log(`🔄 Mise à jour: ${mol.name}`);
    } else {
      // Insérer la nouvelle molécule
      await connection.execute(`
        INSERT INTO molecules 
        (name, cas_number, formula, molecularWeight, olfactiveProfile, family, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, 'validated', ?)
      `, [
        mol.name,
        mol.cas_number,
        mol.formula,
        mol.molecular_weight,
        mol.odor_description,
        mol.family,
        '[OSMOTHÈQUE - Statut réglementaire: ' + mol.status + '] ' + mol.historical_notes
      ]);
      console.log(`✅ Importé: ${mol.name}`);
    }
    
    imported++;
  } catch (error) {
    console.error(`❌ Erreur pour ${mol.name}:`, error.message);
  }
}

console.log(`\n📊 Résumé: ${imported}/${osmothequeMolecules.length} molécules traitées`);

await connection.end();
