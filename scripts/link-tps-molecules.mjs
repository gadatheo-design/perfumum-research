/**
 * Script pour lier les gènes TPS aux molécules existantes dans PERFUMUM
 * Crée des liaisons entre les produits des gènes TPS et les molécules de la base de données
 */

import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

// Mapping des produits TPS vers les noms de molécules dans la base
const tpsToMoleculeMapping = {
  // Monoterpènes
  "Linalool": ["Linalol", "Linalool", "linalol"],
  "Linalool acyclique": ["Linalol", "Linalool"],
  "Geraniol": ["Géraniol", "Geraniol", "geraniol"],
  "Nerol": ["Nérol", "Nerol"],
  "Citronellol": ["Citronellol", "citronellol"],
  "Limonene": ["Limonène", "Limonene", "D-Limonène"],
  "α-Pinene": ["α-Pinène", "Alpha-Pinene", "Pinène"],
  "β-Pinene": ["β-Pinène", "Beta-Pinene"],
  "Myrcene": ["Myrcène", "Myrcene", "β-Myrcène"],
  "Terpinolene": ["Terpinolène", "Terpinolene"],
  "Ocimene": ["Ocimène", "Ocimene", "β-Ocimène"],
  "terpinène-4-ol": ["Terpinène-4-ol", "Terpinen-4-ol"],
  "α-Terpinéol": ["α-Terpinéol", "Alpha-Terpineol", "Terpinéol"],
  
  // Sesquiterpènes
  "β-Caryophyllène": ["β-Caryophyllène", "Caryophyllène", "Beta-Caryophyllene"],
  "α-Humulène": ["α-Humulène", "Humulène", "Alpha-Humulene"],
  "Farnesol": ["Farnésol", "Farnesol"],
  "Nerolidol": ["Nérolidol", "Nerolidol"],
  "β-cédrène": ["Cédrène", "Cedrene", "β-Cédrène"],
  "valencène": ["Valencène", "Valencene"],
  "β-Santalène": ["Santalène", "Santalene", "β-Santalène"],
  "α-Santalène": ["α-Santalène", "Alpha-Santalene"],
  "Bisabolol": ["Bisabolol", "α-Bisabolol"],
  "Guaiol": ["Guaïol", "Guaiol"],
  "β-eudesmol": ["Eudesmol", "β-Eudesmol"],
  "Capsidiol": ["Capsidiol"],
  "ar-curcumène": ["Curcumène", "ar-Curcumène"],
  "Curcumène": ["Curcumène", "Curcumene"],
  "Zizaene": ["Zizaène", "Zizaene"],
  "Aromadendrène": ["Aromadendrène", "Aromadendrene"],
  "τ-cadinol": ["Cadinol", "τ-Cadinol"],
  "Vetivénol": ["Vétivénol", "Vetivenol"],
  
  // Diterpènes
  "Labdanediol": ["Labdanediol", "Labdane"],
  "Sclareol": ["Sclaréol", "Sclareol"],
  "ent-kaurène": ["Kaurène", "ent-Kaurene"],
  
  // Ionones et dérivés
  "β-ionone": ["β-Ionone", "Beta-Ionone", "Ionone"],
  "α-ionone": ["α-Ionone", "Alpha-Ionone"],
  "Damascenone": ["Damascénone", "Damascenone", "β-Damascénone"],
  
  // Autres
  "isomenthone": ["Isomenthone", "Menthone"],
  "Thujone": ["Thuyone", "Thujone"],
  "Camphre": ["Camphre", "Camphor"],
  "Bornéol": ["Bornéol", "Borneol"],
  "Eucalyptol": ["Eucalyptol", "1,8-Cinéole"]
};

async function linkTpsToMolecules() {
  console.log("🔗 Liaison des gènes TPS aux molécules...");
  
  const connection = await mysql.createConnection(DATABASE_URL);
  
  try {
    // Vérifier si la table de liaison existe, sinon la créer
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tps_molecule_links (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tps_gene_id INT NOT NULL,
        molecule_id INT NOT NULL,
        link_type ENUM('direct_product', 'precursor', 'derivative', 'related') DEFAULT 'direct_product',
        confidence ENUM('confirmed', 'probable', 'hypothetical') DEFAULT 'probable',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_link (tps_gene_id, molecule_id)
      )
    `);
    console.log("✅ Table tps_molecule_links créée/vérifiée");
    
    // Récupérer tous les gènes TPS avec leurs produits
    const [tpsGenes] = await connection.execute(`
      SELECT id, name, main_product, olfactory_notes FROM tps_genes WHERE main_product IS NOT NULL
    `);
    console.log(`📊 ${tpsGenes.length} gènes TPS avec produits identifiés`);
    
    // Récupérer toutes les molécules
    const [molecules] = await connection.execute(`
      SELECT id, name, iupac_name FROM molecules
    `);
    console.log(`📊 ${molecules.length} molécules dans la base`);
    
    // Créer un index des molécules par nom (insensible à la casse)
    const moleculeIndex = new Map();
    for (const mol of molecules) {
      const names = [mol.name, mol.iupac_name].filter(Boolean);
      for (const name of names) {
        moleculeIndex.set(name.toLowerCase(), mol);
      }
    }
    
    let linked = 0;
    let notFound = [];
    
    for (const tps of tpsGenes) {
      const product = tps.main_product;
      
      // Chercher dans le mapping
      const possibleNames = tpsToMoleculeMapping[product] || [product];
      
      let foundMolecule = null;
      for (const name of possibleNames) {
        foundMolecule = moleculeIndex.get(name.toLowerCase());
        if (foundMolecule) break;
      }
      
      // Recherche partielle si pas trouvé
      if (!foundMolecule) {
        const productLower = product.toLowerCase();
        for (const [key, mol] of moleculeIndex) {
          if (key.includes(productLower) || productLower.includes(key)) {
            foundMolecule = mol;
            break;
          }
        }
      }
      
      if (foundMolecule) {
        try {
          await connection.execute(`
            INSERT INTO tps_molecule_links (tps_gene_id, molecule_id, link_type, confidence)
            VALUES (?, ?, 'direct_product', 'probable')
            ON DUPLICATE KEY UPDATE confidence = 'probable'
          `, [tps.id, foundMolecule.id]);
          linked++;
        } catch (err) {
          // Ignorer les doublons
        }
      } else {
        if (!notFound.includes(product)) {
          notFound.push(product);
        }
      }
    }
    
    console.log(`\n✅ Liaison terminée:`);
    console.log(`   - ${linked} liaisons créées`);
    console.log(`   - ${notFound.length} produits non trouvés dans les molécules`);
    
    if (notFound.length > 0 && notFound.length <= 30) {
      console.log(`\n📋 Produits non trouvés (${notFound.length}):`);
      for (const p of notFound.slice(0, 20)) {
        console.log(`   - ${p}`);
      }
      if (notFound.length > 20) {
        console.log(`   ... et ${notFound.length - 20} autres`);
      }
    }
    
    // Statistiques finales
    const [stats] = await connection.execute(`
      SELECT COUNT(*) as total FROM tps_molecule_links
    `);
    console.log(`\n📊 Total liaisons TPS-Molécules: ${stats[0].total}`);
    
  } finally {
    await connection.end();
  }
}

linkTpsToMolecules().catch(console.error);
