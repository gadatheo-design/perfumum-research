/**
 * Enrichissement GC-MS des profils moléculaires des tabacs
 * Virginia Gold (id=4), Burley (id=5), Samsoun (id=6)
 * 
 * Sources scientifiques :
 * - Leffingwell JC (2001) "Tobacco - A Unique Flavor" Leffingwell Reports
 * - Rodgman A, Perfetti TA (2009) "The Chemical Components of Tobacco and Tobacco Smoke"
 * - Wahlberg I, Enzell CR (1987) "Tobacco isoprenoids" Natural Product Reports
 * - Perfetti TA (1998) "Structural study of nicotine salts" Beiträge zur Tabakforschung
 * 
 * Les concentrations sont exprimées en mg/g de tabac sec (ordre de grandeur GC-MS)
 */

import mysql from 'mysql2/promise';

// Profils GC-MS par tabac (tabac_id → [{ molecule_id, concentration_mg_g, notes }])
// Molécules identifiées dans la DB :
// 720033=Nicotine, 720034=Nornicotine, 900011=Anatabine, 900012=Anabasine
// 720027=Solanone, 750002=Damascenone, 1110018=Mégastigmatrienone
// 30002=Linalol, 720028=Neophytadiene, 690008=Phytol
// 1350115=Cembranolide, 930006=Furfural, 720030=Benzaldéhyde
// 1300010=Quercétine, 1320044=Rutin, 1320182=Scopoletin

const PROFILES = {
  // VIRGINIA GOLD (id=4) — Flue-cured, riche en sucres, profil miellé/caramel
  // Source: Leffingwell 2001, Rodgman & Perfetti 2009
  4: [
    { molecule_id: 720033, concentration: 12.50, notes: 'Alcaloïde principal. Virginia Gold : 1.2-1.5% MS. Profil doux, moins nicotinique que Burley.' },
    { molecule_id: 720034, concentration: 0.80, notes: 'Alcaloïde mineur. Ratio nornicotine/nicotine ~6% caractéristique des Virginia flue-cured.' },
    { molecule_id: 900011, concentration: 0.45, notes: 'Alcaloïde secondaire. Marqueur de maturité du tabac Virginia.' },
    { molecule_id: 900012, concentration: 0.12, notes: 'Alcaloïde trace. Indicateur de stress thermique lors du séchage.' },
    { molecule_id: 720027, concentration: 3.20, notes: 'Cétone sesquiterpénique majeure. Responsable des notes caramel/miel caractéristiques du Virginia Gold.' },
    { molecule_id: 750002, concentration: 2.80, notes: 'Norisoprénoïde clé. Dégradation des caroténoïdes lors du flue-curing. Notes rosées/fruitées.' },
    { molecule_id: 1110018, concentration: 1.90, notes: 'Mégastigmatrienone : norisoprénoïde spécifique tabac. Notes tabac doux, légèrement boisé.' },
    { molecule_id: 30002, concentration: 0.85, notes: 'Monoterpénol floral. Présent dans les fractions aromatiques légères du Virginia.' },
    { molecule_id: 720028, concentration: 4.50, notes: 'Diterpène majeur du tabac Virginia. Produit de dégradation des cembranoides lors du séchage.' },
    { molecule_id: 690008, concentration: 2.10, notes: 'Diterpène. Produit de dégradation de la chlorophylle. Notes vertes/cireuses.' },
    { molecule_id: 1350115, concentration: 0.65, notes: 'Cembranolide : diterpène bicyclique spécifique Nicotiana tabacum. Notes résineuses douces.' },
    { molecule_id: 930006, concentration: 1.45, notes: 'Produit de Maillard. Réaction sucres/acides aminés lors du flue-curing. Notes grillées/caramel.' },
    { molecule_id: 720030, concentration: 0.38, notes: 'Aldéhyde aromatique. Produit de dégradation des phénylpropanoïdes. Notes amandées.' },
    { molecule_id: 1300010, concentration: 0.22, notes: 'Flavonoïde. Antioxydant naturel du tabac Virginia. Marqueur de qualité.' },
    { molecule_id: 1320044, concentration: 0.18, notes: 'Glycoside de quercétine. Présent dans les feuilles de Nicotiana tabacum var. virginia.' },
  ],
  
  // BURLEY (id=5) — Air-cured, faible en sucres, riche en alcaloïdes, profil terreux/cacao
  // Source: Rodgman & Perfetti 2009, Leffingwell 2001
  5: [
    { molecule_id: 720033, concentration: 28.50, notes: 'Alcaloïde principal. Burley : 2.5-3.5% MS. Teneur 2x supérieure au Virginia. Goût prononcé.' },
    { molecule_id: 720034, concentration: 3.80, notes: 'Alcaloïde mineur. Ratio nornicotine/nicotine ~13% élevé chez Burley air-cured.' },
    { molecule_id: 900011, concentration: 1.20, notes: 'Alcaloïde secondaire. Teneur plus élevée que Virginia, caractéristique du séchage à l\'air.' },
    { molecule_id: 900012, concentration: 0.45, notes: 'Alcaloïde trace. Plus concentré dans Burley que dans les Virginia.' },
    { molecule_id: 720027, concentration: 0.85, notes: 'Cétone sesquiterpénique. Moins concentrée que Virginia (moins de sucres → moins de Maillard).' },
    { molecule_id: 750002, concentration: 0.92, notes: 'Norisoprénoïde. Présent mais moins concentré qu\'en Virginia (séchage à l\'air vs flue).' },
    { molecule_id: 1110018, concentration: 0.75, notes: 'Mégastigmatrienone. Notes tabac brun, terreux, légèrement cacaoté.' },
    { molecule_id: 30002, concentration: 0.32, notes: 'Monoterpénol. Faible concentration, profil aromatique dominé par les alcaloïdes.' },
    { molecule_id: 720028, concentration: 5.80, notes: 'Néophytadiène : diterpène majeur. Plus concentré dans Burley que Virginia. Notes cireuses.' },
    { molecule_id: 690008, concentration: 3.20, notes: 'Phytol : diterpène. Dégradation chlorophylle importante dans Burley (feuilles plus vertes).' },
    { molecule_id: 1350115, concentration: 0.42, notes: 'Cembranolide. Présent mais moins concentré que Virginia Gold.' },
    { molecule_id: 930006, concentration: 0.28, notes: 'Furfural. Faible (peu de sucres dans Burley → peu de réactions de Maillard).' },
    { molecule_id: 720030, concentration: 0.15, notes: 'Benzaldéhyde. Trace. Profil aromatique Burley dominé par alcaloïdes et diterpènes.' },
    { molecule_id: 1300010, concentration: 0.35, notes: 'Quercétine. Flavonoïde antioxydant. Légèrement plus concentré que Virginia.' },
    { molecule_id: 1320182, concentration: 0.28, notes: 'Scopolétin : coumarine. Marqueur spécifique Burley. Notes légèrement lactiques.' },
  ],
  
  // SAMSOUN (id=6) — Oriental sun-cured, Turquie, profil résineux/encens/épices
  // Source: Wahlberg & Enzell 1987, Leffingwell 2001
  6: [
    { molecule_id: 720033, concentration: 8.50, notes: 'Alcaloïde principal. Samsoun oriental : 0.8-1.0% MS. Plus faible que Virginia et Burley.' },
    { molecule_id: 720034, concentration: 0.55, notes: 'Alcaloïde mineur. Faible ratio nornicotine/nicotine caractéristique des orientaux.' },
    { molecule_id: 900011, concentration: 0.28, notes: 'Alcaloïde secondaire. Très faible dans les orientaux, profil alcaloïdique léger.' },
    { molecule_id: 900012, concentration: 0.08, notes: 'Alcaloïde trace. Quasi absent dans les tabacs orientaux sun-cured.' },
    { molecule_id: 720027, concentration: 1.85, notes: 'Solanone. Présente mais profil aromatique dominé par les terpènes résineux.' },
    { molecule_id: 750002, concentration: 3.50, notes: 'Damascénone. Très concentrée dans Samsoun. Notes florales/rosées/épicées caractéristiques.' },
    { molecule_id: 1110018, concentration: 2.80, notes: 'Mégastigmatrienone. Très élevée dans les orientaux. Responsable du caractère "encens" du Samsoun.' },
    { molecule_id: 30002, concentration: 1.45, notes: 'Linalol. Élevé dans les orientaux. Notes florales/épicées. Contribue au profil encens.' },
    { molecule_id: 720028, concentration: 3.20, notes: 'Néophytadiène. Présent, profil similaire aux autres tabacs Nicotiana tabacum.' },
    { molecule_id: 690008, concentration: 1.80, notes: 'Phytol. Dégradation chlorophylle lors du sun-curing. Notes vertes/cireuses modérées.' },
    { molecule_id: 1350115, concentration: 1.20, notes: 'Cembranolide. Plus concentré que Virginia et Burley. Notes résineuses prononcées du Samsoun.' },
    { molecule_id: 930006, concentration: 0.65, notes: 'Furfural. Modéré. Réactions de Maillard lors du sun-curing (exposition solaire directe).' },
    { molecule_id: 720030, concentration: 0.52, notes: 'Benzaldéhyde. Plus élevé que Virginia et Burley. Contribue aux notes épicées/amandées.' },
    { molecule_id: 1300010, concentration: 0.48, notes: 'Quercétine. Flavonoïde antioxydant. Concentration élevée dans les orientaux (exposition UV).' },
    { molecule_id: 1320044, concentration: 0.32, notes: 'Rutine. Glycoside flavonoïde. Marqueur d\'exposition solaire dans les tabacs orientaux.' },
    { molecule_id: 1320182, concentration: 0.18, notes: 'Scopolétin. Coumarine. Présente dans les orientaux, contribue aux notes légèrement lactiques.' },
  ],
};

async function run() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    let totalInserted = 0;
    
    for (const [tabacId, molecules] of Object.entries(PROFILES)) {
      const tabacName = { 4: 'Virginia Gold', 5: 'Burley', 6: 'Samsoun' }[tabacId];
      console.log(`\n--- ${tabacName} (id=${tabacId}) ---`);
      
      // Supprimer les liaisons existantes (au cas où)
      await conn.execute('DELETE FROM tabac_molecule_links WHERE tabac_id = ?', [tabacId]);
      
      for (const mol of molecules) {
        // Vérifier que la molécule existe
        const [check] = await conn.execute('SELECT id, name FROM molecules WHERE id = ?', [mol.molecule_id]);
        if (check.length === 0) {
          console.log(`  ⚠ Molécule id=${mol.molecule_id} introuvable, skip`);
          continue;
        }
        
        await conn.execute(
          'INSERT INTO tabac_molecule_links (tabac_id, molecule_id, concentration, notes) VALUES (?, ?, ?, ?)',
          [tabacId, mol.molecule_id, mol.concentration, mol.notes]
        );
        console.log(`  ✓ ${check[0].name} : ${mol.concentration} mg/g`);
        totalInserted++;
      }
    }
    
    console.log(`\n✅ Total liaisons GC-MS insérées: ${totalInserted}`);
    
    // Vérification finale
    const [verify] = await conn.execute('SELECT tabac_id, COUNT(*) as cnt FROM tabac_molecule_links WHERE tabac_id IN (4,5,6) GROUP BY tabac_id');
    verify.forEach(v => {
      const name = { 4: 'Virginia Gold', 5: 'Burley', 6: 'Samsoun' }[v.tabac_id];
      console.log(`  ${name}: ${v.cnt} molécules`);
    });
    
  } finally {
    await conn.end();
  }
}

run().catch(console.error);
