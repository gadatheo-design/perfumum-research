import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('=== Enrichissement des liaisons TPS-Molécules ===\n');
  
  // Récupérer tous les gènes TPS avec leurs produits
  const [genes] = await conn.execute(`
    SELECT id, name, main_product, product_class, subfamily
    FROM tps_genes
    WHERE main_product IS NOT NULL AND main_product != ''
  `);
  
  console.log(`Gènes TPS avec produits: ${genes.length}`);
  
  // Récupérer toutes les molécules
  const [molecules] = await conn.execute(`
    SELECT id, name, iupac_name, chemicalFamily
    FROM molecules
  `);
  
  console.log(`Molécules dans la base: ${molecules.length}`);
  
  // Récupérer les liaisons existantes
  const [existingLinks] = await conn.execute(`
    SELECT tps_gene_id, molecule_id FROM tps_molecule_links
  `);
  
  const existingSet = new Set(existingLinks.map(l => `${l.tps_gene_id}-${l.molecule_id}`));
  console.log(`Liaisons existantes: ${existingLinks.length}\n`);
  
  // Créer un index des molécules par nom (normalisé)
  const moleculeIndex = new Map();
  molecules.forEach(mol => {
    const normalizedName = normalizeString(mol.name);
    if (!moleculeIndex.has(normalizedName)) {
      moleculeIndex.set(normalizedName, []);
    }
    moleculeIndex.get(normalizedName).push(mol);
    
    // Ajouter aussi le nom IUPAC
    if (mol.iupac_name) {
      const normalizedIupac = normalizeString(mol.iupac_name);
      if (!moleculeIndex.has(normalizedIupac)) {
        moleculeIndex.set(normalizedIupac, []);
      }
      moleculeIndex.get(normalizedIupac).push(mol);
    }
  });
  
  // Mapping des synonymes et variations de noms
  const synonyms = {
    'linalol': ['linalool', 'linalyl'],
    'géraniol': ['geraniol', 'geranyl'],
    'nérolidol': ['nerolidol', 'nerolidyl'],
    'β-caryophyllène': ['beta-caryophyllene', 'caryophyllene', 'caryophyllène'],
    'α-humulène': ['alpha-humulene', 'humulene', 'humulène'],
    'cédrol': ['cedrol', 'cedryl'],
    'limonène': ['limonene', 'd-limonene', 'l-limonene'],
    'α-pinène': ['alpha-pinene', 'pinene', 'pinène'],
    'β-myrcène': ['beta-myrcene', 'myrcene', 'myrcène'],
    'farnesène': ['farnesene', 'farnesyl'],
    'valencène': ['valencene'],
    'bisabolène': ['bisabolene', 'bisabolol'],
    'germacrène d': ['germacrene d', 'germacrene-d'],
    'germacrène a': ['germacrene a', 'germacrene-a'],
    'germacrène b': ['germacrene b', 'germacrene-b'],
    'germacrène c': ['germacrene c', 'germacrene-c'],
    'δ-cadinène': ['delta-cadinene', 'cadinene', 'cadinène'],
    'γ-cadinène': ['gamma-cadinene'],
    'α-cadinène': ['alpha-cadinene'],
    'α-copaène': ['alpha-copaene', 'copaene', 'copaène'],
    'β-copaène': ['beta-copaene'],
    'α-cubebène': ['alpha-cubebene', 'cubebene', 'cubebène'],
    'β-cubebène': ['beta-cubebene'],
    'α-muurolène': ['alpha-muurolene', 'muurolene', 'muurolène'],
    'γ-muurolène': ['gamma-muurolene'],
    'δ-elemène': ['delta-elemene', 'elemene', 'elemène'],
    'β-elemène': ['beta-elemene'],
    'α-terpinéol': ['alpha-terpineol', 'terpineol', 'terpinéol'],
    'terpinène': ['terpinene', 'alpha-terpinene', 'gamma-terpinene'],
    'ocimène': ['ocimene', 'beta-ocimene', 'cis-ocimene', 'trans-ocimene'],
    'sabinène': ['sabinene'],
    'camphène': ['camphene'],
    'terpinolène': ['terpinolene'],
    'fenchol': ['fenchyl alcohol'],
    'bornéol': ['borneol', 'bornyl'],
    'eucalyptol': ['1,8-cineole', 'cineole', 'cinéole'],
    'menthol': ['menthyl'],
    'thymol': ['thymyl'],
    'carvacrol': ['carvacrol'],
    'eugénol': ['eugenol', 'eugenyl'],
    'isoeugénol': ['isoeugenol'],
    'anéthol': ['anethole', 'anethol'],
    'estragol': ['estragole', 'methyl chavicol'],
    'safrol': ['safrole'],
    'cinnamaldéhyde': ['cinnamaldehyde', 'cinnamic aldehyde'],
    'vanilline': ['vanillin'],
    'coumarine': ['coumarin'],
    'ionone': ['alpha-ionone', 'beta-ionone', 'α-ionone', 'β-ionone'],
    'damascone': ['alpha-damascone', 'beta-damascone', 'damascenone'],
    'nootkatone': ['nootkatol'],
    'patchoulol': ['patchouli alcohol'],
    'santalol': ['alpha-santalol', 'beta-santalol'],
    'vetivérol': ['vetiverol', 'khusimol'],
    'guaiol': ['guaiene'],
    'eudesmol': ['alpha-eudesmol', 'beta-eudesmol', 'gamma-eudesmol'],
    'sélinène': ['selinene', 'alpha-selinene', 'beta-selinene'],
    'himachalène': ['himachalene'],
    'zingibérène': ['zingiberene'],
    'curcumène': ['curcumene', 'ar-curcumene'],
    'bergamotène': ['bergamotene', 'alpha-bergamotene', 'beta-bergamotene'],
    'ylangène': ['ylangene'],
    'bourbonène': ['bourbonene'],
    'aromadendrène': ['aromadendrene'],
    'alloaromadendrène': ['alloaromadendrene'],
    'spathulenol': ['spathulenol'],
    'caryophyllène oxide': ['caryophyllene oxide'],
    'humulène epoxide': ['humulene epoxide'],
    'guaiazulène': ['guaiazulene', 'azulene'],
    'chamazulène': ['chamazulene'],
    'bisabolol': ['alpha-bisabolol', 'beta-bisabolol'],
    'farnésol': ['farnesol', 'trans-farnesol'],
    'géranylgéraniol': ['geranylgeraniol', 'ggoh'],
    'phytol': ['phytyl'],
    'squalène': ['squalene'],
    'lanosterol': ['lanosterol'],
  };
  
  let newLinksCount = 0;
  const newLinks = [];
  
  // Pour chaque gène TPS, chercher les molécules correspondantes
  for (const gene of genes) {
    const productName = normalizeString(gene.main_product);
    const matchedMolecules = new Set();
    
    // Recherche directe
    if (moleculeIndex.has(productName)) {
      moleculeIndex.get(productName).forEach(mol => matchedMolecules.add(mol.id));
    }
    
    // Recherche par synonymes
    for (const [key, syns] of Object.entries(synonyms)) {
      if (productName.includes(normalizeString(key)) || 
          syns.some(s => productName.includes(normalizeString(s)))) {
        // Chercher toutes les molécules qui correspondent
        for (const mol of molecules) {
          const molName = normalizeString(mol.name);
          if (molName.includes(normalizeString(key)) || 
              syns.some(s => molName.includes(normalizeString(s)))) {
            matchedMolecules.add(mol.id);
          }
        }
      }
    }
    
    // Recherche partielle (le produit contient le nom de la molécule ou vice versa)
    for (const mol of molecules) {
      const molName = normalizeString(mol.name);
      if (molName.length > 4 && (productName.includes(molName) || molName.includes(productName))) {
        matchedMolecules.add(mol.id);
      }
    }
    
    // Créer les liaisons
    for (const molId of matchedMolecules) {
      const linkKey = `${gene.id}-${molId}`;
      if (!existingSet.has(linkKey)) {
        newLinks.push({
          tps_gene_id: gene.id,
          molecule_id: molId,
          link_type: 'direct_product',
          confidence: 0.8
        });
        existingSet.add(linkKey);
        newLinksCount++;
      }
    }
  }
  
  console.log(`Nouvelles liaisons à créer: ${newLinksCount}`);
  
  // Insérer les nouvelles liaisons par lots
  if (newLinks.length > 0) {
    const batchSize = 50;
    for (let i = 0; i < newLinks.length; i += batchSize) {
      const batch = newLinks.slice(i, i + batchSize);
      const values = batch.map(l => 
        `(${l.tps_gene_id}, ${l.molecule_id}, 'direct_product', ${l.confidence})`
      ).join(', ');
      
      await conn.execute(`
        INSERT INTO tps_molecule_links (tps_gene_id, molecule_id, link_type, confidence)
        VALUES ${values}
      `);
      
      console.log(`  Lot ${Math.floor(i/batchSize) + 1}: ${batch.length} liaisons insérées`);
    }
  }
  
  // Vérifier le résultat
  const [finalCount] = await conn.execute('SELECT COUNT(*) as count FROM tps_molecule_links');
  console.log(`\nTotal liaisons après enrichissement: ${finalCount[0].count}`);
  
  await conn.end();
  console.log('\n✅ Enrichissement terminé!');
}

function normalizeString(str) {
  if (!str) return '';
  return str.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9]/g, ''); // Garder uniquement les caractères alphanumériques
}

main().catch(console.error);
