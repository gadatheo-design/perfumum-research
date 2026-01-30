/**
 * Script d'enrichissement des données moléculaires via PubChem PUG REST API
 * 
 * Ce script récupère les molécules sans CAS/IUPAC et tente de les enrichir
 * en utilisant l'API PubChem.
 */

import mysql from 'mysql2/promise';

const PUBCHEM_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';
const DELAY_MS = 250; // 4 requêtes/seconde max (limite PubChem: 5/s)

// Fonction pour attendre
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fonction pour extraire le numéro CAS des synonymes
function extractCAS(synonyms) {
  if (!synonyms || !Array.isArray(synonyms)) return null;
  
  // Pattern CAS: XXX-XX-X ou XXXX-XX-X ou XXXXX-XX-X
  const casPattern = /^\d{2,7}-\d{2}-\d$/;
  
  for (const syn of synonyms) {
    if (casPattern.test(syn)) {
      return syn;
    }
  }
  return null;
}

// Fonction pour déterminer la classe chimique basée sur le nom IUPAC
function determineChemicalClass(iupacName, formula) {
  if (!iupacName) return null;
  
  const name = iupacName.toLowerCase();
  
  // Terpènes et dérivés
  if (name.includes('pinene') || name.includes('limonene') || name.includes('myrcene') || 
      name.includes('terpine') || name.includes('camphene') || name.includes('carene')) {
    return 'monoterpene';
  }
  if (name.includes('caryophyllene') || name.includes('humulene') || name.includes('farnesene') ||
      name.includes('bisabolene') || name.includes('cadinene') || name.includes('selinene')) {
    return 'sesquiterpene';
  }
  
  // Aldéhydes
  if (name.includes('aldehyde') || name.endsWith('al')) {
    return 'aldehyde';
  }
  
  // Cétones
  if (name.includes('ketone') || name.endsWith('one') || name.includes('carvone') || name.includes('camphor')) {
    return 'ketone';
  }
  
  // Alcools
  if (name.endsWith('ol') || name.includes('alcohol') || name.includes('linalool') || 
      name.includes('geraniol') || name.includes('menthol')) {
    return 'alcohol';
  }
  
  // Esters
  if (name.includes('acetate') || name.includes('ester') || name.endsWith('ate')) {
    return 'ester';
  }
  
  // Éthers
  if (name.includes('ether') || name.includes('oxide')) {
    return 'ether';
  }
  
  // Phénols
  if (name.includes('phenol') || name.includes('eugenol') || name.includes('thymol') ||
      name.includes('carvacrol') || name.includes('guaiacol')) {
    return 'phenol';
  }
  
  // Lactones
  if (name.includes('lactone') || name.includes('coumarin')) {
    return 'lactone';
  }
  
  // Composés aromatiques
  if (name.includes('benzene') || name.includes('toluene') || name.includes('styrene')) {
    return 'aromatic';
  }
  
  return null;
}

// Fonction pour rechercher une molécule dans PubChem
async function searchPubChem(moleculeName) {
  try {
    // Nettoyer le nom de la molécule
    const cleanName = moleculeName
      .replace(/\s*\([^)]*\)\s*/g, '') // Enlever les parenthèses et leur contenu
      .replace(/[éèê]/g, 'e')
      .replace(/[àâ]/g, 'a')
      .replace(/[ùû]/g, 'u')
      .replace(/[îï]/g, 'i')
      .replace(/[ôö]/g, 'o')
      .replace(/ç/g, 'c')
      .trim();
    
    if (!cleanName || cleanName.length < 3) return null;
    
    // Récupérer les propriétés
    const propsUrl = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(cleanName)}/property/IUPACName,MolecularFormula,MolecularWeight/JSON`;
    const propsResponse = await fetch(propsUrl);
    
    if (!propsResponse.ok) {
      return null;
    }
    
    const propsData = await propsResponse.json();
    const props = propsData?.PropertyTable?.Properties?.[0];
    
    if (!props) return null;
    
    await sleep(DELAY_MS);
    
    // Récupérer les synonymes pour le CAS
    const synsUrl = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(cleanName)}/synonyms/JSON`;
    const synsResponse = await fetch(synsUrl);
    
    let casNumber = null;
    if (synsResponse.ok) {
      const synsData = await synsResponse.json();
      const synonyms = synsData?.InformationList?.Information?.[0]?.Synonym;
      casNumber = extractCAS(synonyms);
    }
    
    return {
      iupacName: props.IUPACName || null,
      formula: props.MolecularFormula || null,
      molecularWeight: props.MolecularWeight ? Math.round(props.MolecularWeight) : null,
      casNumber: casNumber,
      chemicalClass: determineChemicalClass(props.IUPACName, props.MolecularFormula)
    };
    
  } catch (error) {
    console.error(`Erreur pour ${moleculeName}:`, error.message);
    return null;
  }
}

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('=== ENRICHISSEMENT DES MOLÉCULES VIA PUBCHEM ===\n');
  
  // Récupérer les molécules à enrichir (sans CAS ou sans IUPAC)
  const [molecules] = await connection.execute(`
    SELECT id, name, cas_number, iupac_name, chemical_class, chemicalFormula
    FROM molecules 
    WHERE (cas_number IS NULL OR cas_number = '' OR iupac_name IS NULL OR iupac_name = '')
    AND name NOT LIKE '%accord%'
    AND name NOT LIKE '%blend%'
    AND name NOT LIKE '%complex%'
    AND name NOT LIKE '%mélange%'
    AND name NOT LIKE '%huile%'
    AND name NOT LIKE '%absolue%'
    AND name NOT LIKE '%essential oil%'
    ORDER BY name
    LIMIT 100
  `);
  
  console.log(`Molécules à enrichir: ${molecules.length}\n`);
  
  let enriched = 0;
  let failed = 0;
  const results = [];
  
  for (const mol of molecules) {
    process.stdout.write(`Recherche: ${mol.name.substring(0, 40).padEnd(40)} `);
    
    const data = await searchPubChem(mol.name);
    
    if (data && (data.casNumber || data.iupacName)) {
      console.log(`✓ CAS: ${data.casNumber || '-'} | IUPAC: ${(data.iupacName || '-').substring(0, 30)}`);
      
      // Préparer les mises à jour
      const updates = [];
      const values = [];
      
      if (data.casNumber && (!mol.cas_number || mol.cas_number === '')) {
        updates.push('cas_number = ?');
        values.push(data.casNumber);
      }
      
      if (data.iupacName && (!mol.iupac_name || mol.iupac_name === '')) {
        updates.push('iupac_name = ?');
        values.push(data.iupacName);
      }
      
      if (data.chemicalClass && !mol.chemical_class) {
        updates.push('chemical_class = ?');
        values.push(data.chemicalClass);
      }
      
      if (data.formula && (!mol.chemicalFormula || mol.chemicalFormula === '')) {
        updates.push('chemicalFormula = ?');
        values.push(data.formula);
      }
      
      if (data.molecularWeight) {
        updates.push('molecularWeight = ?');
        values.push(data.molecularWeight);
      }
      
      if (updates.length > 0) {
        values.push(mol.id);
        await connection.execute(
          `UPDATE molecules SET ${updates.join(', ')} WHERE id = ?`,
          values
        );
        enriched++;
        results.push({ name: mol.name, ...data });
      }
    } else {
      console.log('✗ Non trouvé');
      failed++;
    }
    
    await sleep(DELAY_MS);
  }
  
  console.log('\n=== RÉSUMÉ ===');
  console.log(`Molécules enrichies: ${enriched}`);
  console.log(`Non trouvées: ${failed}`);
  
  // Afficher les nouvelles statistiques
  const [newStats] = await connection.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN cas_number IS NOT NULL AND cas_number != '' THEN 1 ELSE 0 END) as cas_filled,
      SUM(CASE WHEN iupac_name IS NOT NULL AND iupac_name != '' THEN 1 ELSE 0 END) as iupac_filled,
      SUM(CASE WHEN chemical_class IS NOT NULL THEN 1 ELSE 0 END) as class_filled
    FROM molecules
  `);
  
  const total = Number(newStats[0].total);
  console.log('\n=== NOUVELLES STATISTIQUES ===');
  console.log(`CAS: ${newStats[0].cas_filled}/${total} (${Math.round(Number(newStats[0].cas_filled)/total*100)}%)`);
  console.log(`IUPAC: ${newStats[0].iupac_filled}/${total} (${Math.round(Number(newStats[0].iupac_filled)/total*100)}%)`);
  console.log(`Classe: ${newStats[0].class_filled}/${total} (${Math.round(Number(newStats[0].class_filled)/total*100)}%)`);
  
  await connection.end();
}

main().catch(console.error);
