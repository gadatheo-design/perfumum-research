/**
 * Script d'insertion des synergies moléculaires documentées
 * PERFUMUM Research Project
 * 
 * Ce script ajoute des synergies moléculaires basées sur:
 * - Recherches sur les terpènes et l'effet entourage
 * - Accords classiques de parfumerie
 * - Documentation scientifique
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Mapping des noms de molécules vers leurs IDs (basé sur la recherche)
const moleculeIds = {
  // Terpènes principaux
  limonene: 30007,      // Limonène
  linalool: 30009,      // Linalool
  myrcene: 30006,       // Myrcène
  alphaPinene: 30008,   // α-Pinène
  betaCaryophyllene: 30005, // β-Caryophyllène
  humulene: 90048,      // Humulène
  terpinolene: 720001,  // Terpinolène
  
  // Aldéhydes et cétones
  citral: 570045,       // Citral
  vanilline: 90069,     // Vanilline
  coumarine: 300005,    // Coumarine
  cinnamaldehyde: 570043, // Cinnamaldéhyde
  benzaldehyde: 720030, // Benzaldéhyde
  calone: 570067,       // Calone
  carvone: 630001,      // Carvone
  menthone: 570016,     // Menthone
  camphor: 570047,      // Camphre
  
  // Alcools
  geraniol: 660001,     // Géraniol
  citronellol: 660002,  // Citronellol
  menthol: 570046,      // Menthol
  borneol: 570049,      // Bornéol
  patchoulol: 90054,    // Patchoulol
  cedrol: 720019,       // Cédrol
  
  // Phénols
  eugenol: 570039,      // Eugénol
  thymol: 570042,       // Thymol
  
  // Sesquiterpènes
  vetivone: 120002,     // Vétivone
  
  // Hétérocycliques
  indole: 60016,        // Indole
  
  // Autres
  ambroxan: 3,          // Ambroxan
  labdanum: 90044,      // Labdanum
  citronellal: 690005,  // Citronellal
};

// Synergies documentées à insérer
const synergies = [
  // ============================================
  // SYNERGIES TERPÉNIQUES (Effet Entourage)
  // ============================================
  
  // Limonène + Linalool: Équilibre humeur et relaxation
  {
    molecule1Id: moleculeIds.limonene,
    molecule2Id: moleculeIds.linalool,
    type: 'potentialisation',
    description: 'Le limonène (agrumes, énergisant) et le linalool (lavande, calmant) créent un équilibre parfait entre réduction du stress et amélioration de l\'humeur. Cette combinaison permet une relaxation sans sédation excessive, maintenant la clarté mentale.',
    applications: 'Parfums relaxants mais non sédatifs, aromathérapie anti-stress, eaux de toilette fraîches et apaisantes'
  },
  
  // Myrcène + α-Pinène: Soulagement douleur et inflammation
  {
    molecule1Id: moleculeIds.myrcene,
    molecule2Id: moleculeIds.alphaPinene,
    type: 'potentialisation',
    description: 'Le myrcène augmente la perméabilité de la barrière hémato-encéphalique, permettant au pinène d\'exercer ses effets anti-inflammatoires plus efficacement sur le système nerveux central. Combinaison puissante pour la gestion de la douleur.',
    applications: 'Huiles essentielles thérapeutiques, baumes anti-inflammatoires, parfums aux propriétés analgésiques'
  },
  
  // β-Caryophyllène + Humulène: Anti-inflammatoire et régulation appétit
  {
    molecule1Id: moleculeIds.betaCaryophyllene,
    molecule2Id: moleculeIds.humulene,
    type: 'potentialisation',
    description: 'Le β-caryophyllène se lie directement aux récepteurs CB2, réduisant l\'inflammation, tandis que l\'humulène possède des propriétés anti-inflammatoires et coupe-faim. Synergie unique pour la gestion de conditions inflammatoires chroniques.',
    applications: 'Parfums épicés-boisés aux propriétés thérapeutiques, compositions au poivre noir et houblon'
  },
  
  // Terpinolène + Limonène: Énergie et concentration
  {
    molecule1Id: moleculeIds.terpinolene,
    molecule2Id: moleculeIds.limonene,
    type: 'potentialisation',
    description: 'Le terpinolène (lilas, arbre à thé) et le limonène combinent leurs effets énergisants avec des propriétés antioxydantes. Cette synergie combat la fatigue et augmente la vigilance sans surstimulation.',
    applications: 'Parfums énergisants pour la journée, compositions fraîches et stimulantes, eaux de Cologne modernes'
  },
  
  // Myrcène + Linalool: Amélioration du sommeil
  {
    molecule1Id: moleculeIds.myrcene,
    molecule2Id: moleculeIds.linalool,
    type: 'potentialisation',
    description: 'Les propriétés sédatives du myrcène et du linalool se combinent pour promouvoir un sommeil profond et réparateur. Synergie idéale pour les compositions nocturnes.',
    applications: 'Parfums de nuit, brumes d\'oreiller, huiles de massage relaxantes, compositions pour le coucher'
  },
  
  // Linalool + β-Caryophyllène: Relaxation profonde
  {
    molecule1Id: moleculeIds.linalool,
    molecule2Id: moleculeIds.betaCaryophyllene,
    type: 'potentialisation',
    description: 'Les effets calmants du linalool sont amplifiés par l\'action du β-caryophyllène sur les récepteurs cannabinoïdes. Combinaison pour une relaxation profonde sans somnolence.',
    applications: 'Parfums du soir, compositions méditation, huiles de bain relaxantes'
  },
  
  // ============================================
  // ACCORDS CLASSIQUES DE PARFUMERIE
  // ============================================
  
  // Géraniol + Citronellol: Accord Rose
  {
    molecule1Id: moleculeIds.geraniol,
    molecule2Id: moleculeIds.citronellol,
    type: 'potentialisation',
    description: 'Le géraniol et le citronellol sont les deux composants majeurs de l\'essence de rose. Ensemble, ils recréent la richesse et la complexité de la rose naturelle avec une facette fraîche et une facette douce.',
    applications: 'Accords rose, parfums floraux classiques, soliflores rose, cœurs floraux'
  },
  
  // Linalool + Indole: Accord Jasmin
  {
    molecule1Id: moleculeIds.linalool,
    molecule2Id: moleculeIds.indole,
    type: 'transformation',
    description: 'Le linalool apporte la fraîcheur florale tandis que l\'indole ajoute la facette animale et narcotique caractéristique du jasmin. Cette combinaison transforme les notes individuelles en un accord jasmin riche et envoûtant.',
    applications: 'Accords jasmin, parfums floraux blancs, compositions nuit, parfums sensuels'
  },
  
  // Vanilline + Coumarine: Accord Oriental de base
  {
    molecule1Id: moleculeIds.vanilline,
    molecule2Id: moleculeIds.coumarine,
    type: 'stabilisation',
    description: 'La vanilline et la coumarine forment la base de nombreux accords orientaux. La coumarine apporte des notes de foin et d\'amande tandis que la vanilline ajoute chaleur et gourmandise. Ensemble, elles créent un fond stable et enveloppant.',
    applications: 'Accords orientaux, parfums ambrés, fonds gourmands, bases poudrées'
  },
  
  // Patchoulol + Vanilline: Accord Oriental boisé
  {
    molecule1Id: moleculeIds.patchoulol,
    molecule2Id: moleculeIds.vanilline,
    type: 'stabilisation',
    description: 'Le patchoulol apporte profondeur terreuse et boisée tandis que la vanilline adoucit et réchauffe. Cette synergie crée un fond oriental-boisé stable et persistant, caractéristique des grands parfums orientaux.',
    applications: 'Parfums orientaux-boisés (Shalimar, Opium), fonds ambrés riches, compositions mystérieuses'
  },
  
  // Cédrol + Ambroxan: Projection boisée moderne
  {
    molecule1Id: moleculeIds.cedrol,
    molecule2Id: moleculeIds.ambroxan,
    type: 'potentialisation',
    description: 'L\'ambroxan amplifie considérablement la projection et le sillage des notes boisées du cédrol. Cette combinaison moderne crée des parfums boisés à fort impact tout en conservant élégance et raffinement.',
    applications: 'Parfums boisés modernes, compositions à fort sillage, parfums masculins contemporains'
  },
  
  // Eugénol + Cinnamaldéhyde: Accord Épicé chaud
  {
    molecule1Id: moleculeIds.eugenol,
    molecule2Id: moleculeIds.cinnamaldehyde,
    type: 'potentialisation',
    description: 'L\'eugénol (clou de girofle) et le cinnamaldéhyde (cannelle) créent ensemble un accord épicé chaud et enveloppant. Leurs notes épicées se renforcent mutuellement pour une sensation de chaleur intense.',
    applications: 'Accords épicés orientaux, parfums d\'hiver, compositions gourmandes épicées'
  },
  
  // Coumarine + Linalool: Accord Fougère
  {
    molecule1Id: moleculeIds.coumarine,
    molecule2Id: moleculeIds.linalool,
    type: 'transformation',
    description: 'La coumarine (foin, amande) et le linalool (lavande) forment le cœur de l\'accord fougère classique. Cette combinaison transforme les notes individuelles en une sensation verte, aromatique et masculine.',
    applications: 'Accord fougère (Drakkar Noir, Old Spice), parfums masculins classiques, eaux de toilette aromatiques'
  },
  
  // Limonène + Géraniol: Accord Citrus-Floral
  {
    molecule1Id: moleculeIds.limonene,
    molecule2Id: moleculeIds.geraniol,
    type: 'potentialisation',
    description: 'Le limonène apporte la fraîcheur pétillante des agrumes tandis que le géraniol ajoute une dimension florale rosée. Cette synergie crée des compositions fraîches et féminines très appréciées.',
    applications: 'Eaux de Cologne florales, parfums frais féminins, compositions printanières'
  },
  
  // ============================================
  // SYNERGIES SPÉCIFIQUES PARFUMERIE
  // ============================================
  
  // Citral + Limonène: Accord Citrus intense
  {
    molecule1Id: moleculeIds.citral,
    molecule2Id: moleculeIds.limonene,
    type: 'potentialisation',
    description: 'Le citral (citronnelle, verveine) et le limonène (zeste d\'agrumes) se potentialisent pour créer un accord citrus intense et lumineux. Le citral ajoute de la profondeur et de la persistance aux notes d\'agrumes.',
    applications: 'Accords citrus intenses, eaux fraîches, parfums d\'été, compositions énergisantes'
  },
  
  // Menthol + α-Pinène: Accord Frais respiratoire
  {
    molecule1Id: moleculeIds.menthol,
    molecule2Id: moleculeIds.alphaPinene,
    type: 'potentialisation',
    description: 'Le menthol et le pinène combinent leurs propriétés rafraîchissantes et bronchodilatatrices. Cette synergie crée une sensation de fraîcheur intense et de respiration facilitée.',
    applications: 'Parfums frais mentholés, compositions sportives, accords conifères-menthe'
  },
  
  // Carvone + Menthone: Accord Menthe complexe
  {
    molecule1Id: moleculeIds.carvone,
    molecule2Id: moleculeIds.menthone,
    type: 'potentialisation',
    description: 'La carvone (menthe verte, carvi) et la menthone créent ensemble un accord menthe complexe et nuancé, plus riche que le menthol seul. Notes herbacées et fraîches combinées.',
    applications: 'Accords menthe sophistiqués, parfums aromatiques, compositions herbacées fraîches'
  },
  
  // Thymol + Eugénol: Accord Épicé-Herbacé
  {
    molecule1Id: moleculeIds.thymol,
    molecule2Id: moleculeIds.eugenol,
    type: 'potentialisation',
    description: 'Le thymol (thym) et l\'eugénol (clou de girofle) créent un accord épicé-herbacé puissant aux propriétés antiseptiques. Synergie utilisée en parfumerie et aromathérapie.',
    applications: 'Accords aromatiques épicés, parfums herbacés médicinaux, compositions méditerranéennes'
  },
  
  // Borneol + Camphor: Accord Camphré
  {
    molecule1Id: moleculeIds.borneol,
    molecule2Id: moleculeIds.camphor,
    type: 'stabilisation',
    description: 'Le bornéol et le camphre sont chimiquement liés et se stabilisent mutuellement. Ensemble, ils créent un accord camphré équilibré, moins agressif que le camphre seul.',
    applications: 'Accords camphrés équilibrés, parfums médicinaux, compositions aromatiques asiatiques'
  },
  
  // Vetivone + Cédrol: Accord Boisé terreux
  {
    molecule1Id: moleculeIds.vetivone,
    molecule2Id: moleculeIds.cedrol,
    type: 'stabilisation',
    description: 'La vétivone (vétiver) et le cédrol (cèdre) créent un accord boisé terreux profond et masculin. Le cèdre apporte de la structure tandis que le vétiver ajoute de la complexité terreuse.',
    applications: 'Accords boisés masculins, parfums chyprés, compositions terreuses sophistiquées'
  },
  
  // Labdanum + Vanilline: Accord Ambré classique
  {
    molecule1Id: moleculeIds.labdanum,
    molecule2Id: moleculeIds.vanilline,
    type: 'stabilisation',
    description: 'Le labdanum et la vanilline forment la base de l\'accord ambré classique. Le labdanum apporte des notes résineuses et animales tandis que la vanilline adoucit et réchauffe l\'ensemble.',
    applications: 'Accord ambré (Habit Rouge, Habanita), parfums orientaux classiques, bases ambrées'
  },
  
  // Calone + Citronellal: Accord Marin-Vert
  {
    molecule1Id: moleculeIds.calone,
    molecule2Id: moleculeIds.citronellal,
    type: 'transformation',
    description: 'Le calone (notes marines, melon) et le citronellal (notes vertes citronnées) se transforment ensemble en un accord aquatique-vert frais et moderne. Notes ozoneuses et végétales combinées.',
    applications: 'Parfums aquatiques modernes, compositions marines-vertes, eaux fraîches contemporaines'
  },
  
  // Benzaldéhyde + Vanilline: Accord Gourmand amande
  {
    molecule1Id: moleculeIds.benzaldehyde,
    molecule2Id: moleculeIds.vanilline,
    type: 'potentialisation',
    description: 'Le benzaldéhyde (amande amère, cerise) et la vanilline créent un accord gourmand irrésistible rappelant les pâtisseries aux amandes. Notes sucrées et fruitées-gourmandes.',
    applications: 'Accords gourmands, parfums pâtissiers, compositions amande-vanille'
  },
  
  // Géraniol + Linalool: Accord Floral frais
  {
    molecule1Id: moleculeIds.geraniol,
    molecule2Id: moleculeIds.linalool,
    type: 'potentialisation',
    description: 'Le géraniol (rose, géranium) et le linalool (lavande, muguet) créent un accord floral frais et lumineux. Cette combinaison est la base de nombreux parfums floraux classiques et modernes.',
    applications: 'Cœurs floraux, parfums féminins classiques, compositions muguet-rose'
  },
  
  // Humulène + Myrcène: Accord Houblon
  {
    molecule1Id: moleculeIds.humulene,
    molecule2Id: moleculeIds.myrcene,
    type: 'potentialisation',
    description: 'L\'humulène et le myrcène sont les deux terpènes majeurs du houblon. Ensemble, ils recréent l\'arôme caractéristique du houblon avec ses notes herbacées, terreuses et légèrement épicées.',
    applications: 'Accords houblon, parfums brasserie, compositions herbacées-terreuses'
  },
  
  // Citronellol + Citronellal: Accord Citronnelle
  {
    molecule1Id: moleculeIds.citronellol,
    molecule2Id: moleculeIds.citronellal,
    type: 'potentialisation',
    description: 'Le citronellol et le citronellal sont les composants majeurs de l\'huile de citronnelle. Ensemble, ils créent l\'accord citronnelle caractéristique avec ses notes fraîches, vertes et légèrement rosées.',
    applications: 'Accords citronnelle, parfums anti-moustiques, compositions fraîches estivales'
  },
  
  // α-Pinène + Limonène: Accord Conifère-Agrumes
  {
    molecule1Id: moleculeIds.alphaPinene,
    molecule2Id: moleculeIds.limonene,
    type: 'potentialisation',
    description: 'Le pinène (pin, sapin) et le limonène (agrumes) créent un accord frais et vivifiant rappelant les forêts méditerranéennes. Notes résineuses et citronnées en harmonie.',
    applications: 'Parfums forestiers, eaux de Cologne méditerranéennes, compositions pin-citrus'
  },
  
  // Indole + Vanilline: Accord Floral-Oriental
  {
    molecule1Id: moleculeIds.indole,
    molecule2Id: moleculeIds.vanilline,
    type: 'transformation',
    description: 'L\'indole (jasmin, fleurs blanches) et la vanilline créent une transformation vers un accord floral-oriental sensuel. L\'indole apporte la facette animale tandis que la vanilline adoucit et réchauffe.',
    applications: 'Parfums floraux orientaux, compositions sensuelles, accords tubéreuse-vanille'
  },
  
  // Patchoulol + Labdanum: Accord Chypré de fond
  {
    molecule1Id: moleculeIds.patchoulol,
    molecule2Id: moleculeIds.labdanum,
    type: 'stabilisation',
    description: 'Le patchoulol et le labdanum forment un fond chypré classique stable et persistant. Le patchouli apporte la profondeur terreuse tandis que le labdanum ajoute des notes résineuses et animales.',
    applications: 'Fonds chyprés (Aromatics Elixir, Cabochard), accords mousse-patchouli, bases chyprées'
  },
  
  // Ambroxan + Linalool: Accord Peau propre moderne
  {
    molecule1Id: moleculeIds.ambroxan,
    molecule2Id: moleculeIds.linalool,
    type: 'potentialisation',
    description: 'L\'ambroxan (ambre gris synthétique) et le linalool créent un accord "peau propre" moderne très apprécié. L\'ambroxan amplifie la projection tandis que le linalool apporte fraîcheur et douceur.',
    applications: 'Parfums "skin scent", accords musqués modernes, compositions minimalistes'
  }
];

async function insertSynergies() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('🧪 Insertion des synergies moléculaires documentées...\n');
  
  let inserted = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const synergy of synergies) {
    try {
      // Vérifier si la synergie existe déjà (dans les deux sens)
      const [existing] = await conn.execute(
        `SELECT id FROM molecule_synergies 
         WHERE (molecule1_id = ? AND molecule2_id = ?) 
            OR (molecule1_id = ? AND molecule2_id = ?)`,
        [synergy.molecule1Id, synergy.molecule2Id, synergy.molecule2Id, synergy.molecule1Id]
      );
      
      if (existing.length > 0) {
        console.log(`⏭️  Synergie déjà existante: mol${synergy.molecule1Id} ↔ mol${synergy.molecule2Id}`);
        skipped++;
        continue;
      }
      
      // Vérifier que les deux molécules existent
      const [mol1] = await conn.execute('SELECT id, name FROM molecules WHERE id = ?', [synergy.molecule1Id]);
      const [mol2] = await conn.execute('SELECT id, name FROM molecules WHERE id = ?', [synergy.molecule2Id]);
      
      if (mol1.length === 0 || mol2.length === 0) {
        console.log(`❌ Molécule non trouvée: mol${synergy.molecule1Id} ou mol${synergy.molecule2Id}`);
        errors++;
        continue;
      }
      
      // Insérer la synergie
      await conn.execute(
        `INSERT INTO molecule_synergies (molecule1_id, molecule2_id, type, description, applications)
         VALUES (?, ?, ?, ?, ?)`,
        [synergy.molecule1Id, synergy.molecule2Id, synergy.type, synergy.description, synergy.applications]
      );
      
      console.log(`✅ Synergie ajoutée: ${mol1[0].name} ↔ ${mol2[0].name} (${synergy.type})`);
      inserted++;
      
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`);
      errors++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 RÉSUMÉ:`);
  console.log(`   ✅ Synergies ajoutées: ${inserted}`);
  console.log(`   ⏭️  Synergies existantes (ignorées): ${skipped}`);
  console.log(`   ❌ Erreurs: ${errors}`);
  console.log(`   📝 Total traité: ${synergies.length}`);
  console.log('='.repeat(60));
  
  await conn.end();
}

insertSynergies().catch(console.error);
