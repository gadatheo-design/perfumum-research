/**
 * Service de nettoyage des données - Fusion des doublons de molécules
 * 
 * Ce service identifie et fusionne les molécules en double en conservant
 * les données les plus complètes et en mettant à jour les liaisons.
 */

import { getDb } from "./db";
import { molecules, moleculesRecettes, plantMolecules, moleculeSynergies } from "../drizzle/schema";
import { eq, sql, inArray, or } from "drizzle-orm";

// Liste des doublons identifiés avec l'ID à conserver (celui avec le plus de données)
export const DUPLICATES_TO_MERGE = [
  // Indole (6 occurrences) - garder ID 60016
  { keep: 60016, remove: [90035, 210001, 1050028, 1050030, 1050032], name: "indole" },
  
  // Alpha-pinene (5 occurrences) - garder ID 810001
  { keep: 810001, remove: [810065, 810067, 810069, 810071], name: "alpha-pinene" },
  
  // Géosmine (4 occurrences) - garder ID 30004
  { keep: 30004, remove: [1050027, 1050029, 1050031], name: "géosmine" },
  
  // Limonène (4 occurrences français) - garder ID 30007
  { keep: 30007, remove: [90056, 150002], name: "limonène" },
  // Note: 930008 a un CAS différent (5989-27-5 = D-limonène), c'est un isomère distinct
  
  // α-pinène (4 occurrences) - garder ID 30008
  { keep: 30008, remove: [150003, 150004, 570053], name: "α-pinène" },
  
  // Ambroxan (3 occurrences) - garder ID 3
  { keep: 3, remove: [30003, 90015], name: "ambroxan" },
  
  // β-caryophyllène (3 occurrences) - garder ID 30005
  { keep: 30005, remove: [90049, 150005], name: "β-caryophyllène" },
  
  // Linalool (3 occurrences) - garder ID 30009
  { keep: 30009, remove: [150006, 810005], name: "linalool" },
  
  // Vetiverol (3 occurrences) - garder ID 90050
  { keep: 90050, remove: [540003, 810019], name: "vetiverol" },
  
  // Khusimol (3 occurrences) - garder ID 120003
  { keep: 120003, remove: [450003, 810018], name: "khusimol" },
  
  // Acétate de linalyle (3 occurrences) - garder ID 570018
  { keep: 570018, remove: [570056, 600019], name: "acétate de linalyle" },
  
  // Limonene (3 occurrences anglais) - garder ID 810003
  { keep: 810003, remove: [810070, 810072], name: "limonene" },
  
  // Beta-caryophyllene (3 occurrences) - garder ID 810013
  { keep: 810013, remove: [810066, 810068], name: "beta-caryophyllene" },
  
  // Myrcène (2 occurrences) - garder ID 30006
  { keep: 30006, remove: [150001], name: "myrcène" },
  
  // Humulène (2 occurrences) - garder ID 90048
  { keep: 90048, remove: [150007], name: "humulène" },
];

/**
 * Analyse les doublons et retourne un rapport
 */
export async function analyzeDuplicates() {
  const db = await getDb();
  if (!db) return { error: "Database not available" };
  
  // Récupérer toutes les molécules
  const allMolecules = await db.select().from(molecules);
  
  // Grouper par nom normalisé
  const groups: Record<string, typeof allMolecules> = {};
  allMolecules.forEach(m => {
    const name = m.name.toLowerCase().trim();
    if (!groups[name]) groups[name] = [];
    groups[name].push(m);
  });
  
  // Identifier les doublons
  const duplicates = Object.entries(groups)
    .filter(([_, mols]) => mols.length > 1)
    .map(([name, mols]) => ({
      name,
      count: mols.length,
      molecules: mols.map(m => ({
        id: m.id,
        casNumber: m.casNumber,
        chemicalClass: m.chemicalClass,
        hasIupac: !!m.iupacName,
        hasOlfactive: !!m.olfactiveProfile
      }))
    }));
  
  return {
    totalMolecules: allMolecules.length,
    duplicateGroups: duplicates.length,
    totalDuplicates: duplicates.reduce((sum, d) => sum + d.count - 1, 0),
    duplicates
  };
}

/**
 * Fusionne les doublons en mettant à jour les liaisons
 */
export async function mergeDuplicates(dryRun = true) {
  const db = await getDb();
  if (!db) return { error: "Database not available" };
  
  const results: {
    merged: string[];
    errors: string[];
    linksUpdated: { moleculeRecette: number; plantMolecule: number; synergies: number };
  } = {
    merged: [],
    errors: [],
    linksUpdated: { moleculeRecette: 0, plantMolecule: 0, synergies: 0 }
  };
  
  for (const dup of DUPLICATES_TO_MERGE) {
    try {
      // Vérifier que la molécule à conserver existe
      const keepMol = await db.select().from(molecules).where(eq(molecules.id, dup.keep)).limit(1);
      if (keepMol.length === 0) {
        results.errors.push(`Molecule to keep not found: ${dup.name} (ID ${dup.keep})`);
        continue;
      }
      
      // Vérifier les molécules à supprimer
      const removeMols = await db.select().from(molecules).where(inArray(molecules.id, dup.remove));
      const foundIds = removeMols.map(m => m.id);
      const missingIds = dup.remove.filter(id => !foundIds.includes(id));
      
      if (missingIds.length > 0) {
        // Certains IDs n'existent plus, continuer avec ceux qui existent
        console.log(`Some IDs already removed for ${dup.name}: ${missingIds.join(', ')}`);
      }
      
      if (foundIds.length === 0) {
        results.merged.push(`${dup.name}: Already cleaned (no duplicates found)`);
        continue;
      }
      
      if (!dryRun) {
        // 1. Mettre à jour les liaisons moleculesRecettes
        const recetteLinks = await db
          .update(moleculesRecettes)
          .set({ moleculeId: dup.keep })
          .where(inArray(moleculesRecettes.moleculeId, foundIds));
        results.linksUpdated.moleculeRecette += (recetteLinks as any).rowsAffected || 0;
        
        // 2. Mettre à jour les liaisons plantMolecules
        const plantLinks = await db
          .update(plantMolecules)
          .set({ moleculeId: dup.keep })
          .where(inArray(plantMolecules.moleculeId, foundIds));
        results.linksUpdated.plantMolecule += (plantLinks as any).rowsAffected || 0;
        
        // 3. Mettre à jour les synergies (molecule1Id et molecule2Id)
        const synergy1 = await db
          .update(moleculeSynergies)
          .set({ molecule1Id: dup.keep })
          .where(inArray(moleculeSynergies.molecule1Id, foundIds));
        const synergy2 = await db
          .update(moleculeSynergies)
          .set({ molecule2Id: dup.keep })
          .where(inArray(moleculeSynergies.molecule2Id, foundIds));
        results.linksUpdated.synergies += ((synergy1 as any).rowsAffected || 0) + ((synergy2 as any).rowsAffected || 0);
        
        // 4. Supprimer les doublons
        await db.delete(molecules).where(inArray(molecules.id, foundIds));
      }
      
      results.merged.push(`${dup.name}: ${foundIds.length} duplicates ${dryRun ? 'would be' : ''} merged into ID ${dup.keep}`);
    } catch (error) {
      results.errors.push(`Error processing ${dup.name}: ${error}`);
    }
  }
  
  return {
    dryRun,
    ...results,
    summary: `${results.merged.length} groups processed, ${results.errors.length} errors`
  };
}

/**
 * Enrichit les molécules avec les formules chimiques et SMILES
 */
export const MOLECULE_FORMULAS: Record<string, { formula: string; smiles: string; molecularWeight?: number }> = {
  // Terpènes
  "linalool": { formula: "C10H18O", smiles: "CC(C)=CCCC(C)(C=C)O", molecularWeight: 154.25 },
  "limonene": { formula: "C10H16", smiles: "CC1=CCC(CC1)C(=C)C", molecularWeight: 136.23 },
  "limonène": { formula: "C10H16", smiles: "CC1=CCC(CC1)C(=C)C", molecularWeight: 136.23 },
  "myrcene": { formula: "C10H16", smiles: "CC(=C)C=CCC=C(C)C", molecularWeight: 136.23 },
  "myrcène": { formula: "C10H16", smiles: "CC(=C)C=CCC=C(C)C", molecularWeight: 136.23 },
  "alpha-pinene": { formula: "C10H16", smiles: "CC1=CCC2CC1C2(C)C", molecularWeight: 136.23 },
  "α-pinène": { formula: "C10H16", smiles: "CC1=CCC2CC1C2(C)C", molecularWeight: 136.23 },
  "beta-pinene": { formula: "C10H16", smiles: "CC1(C)C2CCC(=C)C1C2", molecularWeight: 136.23 },
  "β-pinène": { formula: "C10H16", smiles: "CC1(C)C2CCC(=C)C1C2", molecularWeight: 136.23 },
  "beta-caryophyllene": { formula: "C15H24", smiles: "CC1=CCCC(=C)C2CC(C2CC1)(C)C", molecularWeight: 204.35 },
  "β-caryophyllène": { formula: "C15H24", smiles: "CC1=CCCC(=C)C2CC(C2CC1)(C)C", molecularWeight: 204.35 },
  "humulene": { formula: "C15H24", smiles: "CC1=CCC(C=CCC(=CCC1)C)(C)C", molecularWeight: 204.35 },
  "humulène": { formula: "C15H24", smiles: "CC1=CCC(C=CCC(=CCC1)C)(C)C", molecularWeight: 204.35 },
  "terpinene": { formula: "C10H16", smiles: "CC1=CCC(=CC1)C(C)C", molecularWeight: 136.23 },
  "terpinolene": { formula: "C10H16", smiles: "CC1=CCC(CC1)=C(C)C", molecularWeight: 136.23 },
  "ocimene": { formula: "C10H16", smiles: "CC(=C)C=CC=C(C)C", molecularWeight: 136.23 },
  "bisabolol": { formula: "C15H26O", smiles: "CC(C)=CCCC(C)(O)C1CCC(=CC1)C", molecularWeight: 222.37 },
  "nerolidol": { formula: "C15H26O", smiles: "CC(=CCCC(=CCCC(C)(C=C)O)C)C", molecularWeight: 222.37 },
  "farnesol": { formula: "C15H26O", smiles: "CC(=CCCC(=CCCC(=CCO)C)C)C", molecularWeight: 222.37 },
  "geraniol": { formula: "C10H18O", smiles: "CC(=CCCC(=CCO)C)C", molecularWeight: 154.25 },
  "géraniol": { formula: "C10H18O", smiles: "CC(=CCCC(=CCO)C)C", molecularWeight: 154.25 },
  "citronellol": { formula: "C10H20O", smiles: "CC(C)=CCCC(C)CCO", molecularWeight: 156.27 },
  "nerol": { formula: "C10H18O", smiles: "CC(=CCCC(=CCO)C)C", molecularWeight: 154.25 },
  
  // Aldéhydes
  "citral": { formula: "C10H16O", smiles: "CC(=CCCC(=CC=O)C)C", molecularWeight: 152.23 },
  "citronellal": { formula: "C10H18O", smiles: "CC(C)=CCCC(C)CC=O", molecularWeight: 154.25 },
  "benzaldehyde": { formula: "C7H6O", smiles: "O=CC1=CC=CC=C1", molecularWeight: 106.12 },
  "vanillin": { formula: "C8H8O3", smiles: "COC1=CC(C=O)=CC=C1O", molecularWeight: 152.15 },
  "vanilline": { formula: "C8H8O3", smiles: "COC1=CC(C=O)=CC=C1O", molecularWeight: 152.15 },
  "cinnamaldehyde": { formula: "C9H8O", smiles: "O=CC=CC1=CC=CC=C1", molecularWeight: 132.16 },
  
  // Esters
  "linalyl acetate": { formula: "C12H20O2", smiles: "CC(=O)OC(C)(C=C)CCC=C(C)C", molecularWeight: 196.29 },
  "acétate de linalyle": { formula: "C12H20O2", smiles: "CC(=O)OC(C)(C=C)CCC=C(C)C", molecularWeight: 196.29 },
  "geranyl acetate": { formula: "C12H20O2", smiles: "CC(=CCCC(=CCOC(=O)C)C)C", molecularWeight: 196.29 },
  "benzyl acetate": { formula: "C9H10O2", smiles: "CC(=O)OCC1=CC=CC=C1", molecularWeight: 150.17 },
  "methyl salicylate": { formula: "C8H8O3", smiles: "COC(=O)C1=CC=CC=C1O", molecularWeight: 152.15 },
  
  // Phénols
  "eugenol": { formula: "C10H12O2", smiles: "COC1=CC(CC=C)=CC=C1O", molecularWeight: 164.20 },
  "eugénol": { formula: "C10H12O2", smiles: "COC1=CC(CC=C)=CC=C1O", molecularWeight: 164.20 },
  "thymol": { formula: "C10H14O", smiles: "CC(C)C1=CC(C)=CC=C1O", molecularWeight: 150.22 },
  "carvacrol": { formula: "C10H14O", smiles: "CC(C)C1=CC=C(C)C=C1O", molecularWeight: 150.22 },
  "guaiacol": { formula: "C7H8O2", smiles: "COC1=CC=CC=C1O", molecularWeight: 124.14 },
  
  // Cétones
  "camphor": { formula: "C10H16O", smiles: "CC1(C)C2CCC1(C)C(=O)C2", molecularWeight: 152.23 },
  "camphre": { formula: "C10H16O", smiles: "CC1(C)C2CCC1(C)C(=O)C2", molecularWeight: 152.23 },
  "menthone": { formula: "C10H18O", smiles: "CC(C)C1CCC(C)CC1=O", molecularWeight: 154.25 },
  "carvone": { formula: "C10H14O", smiles: "CC(=C)C1CC=C(C)C(=O)C1", molecularWeight: 150.22 },
  "ionone": { formula: "C13H20O", smiles: "CC1=C(C(CC=C1)(C)C)C=CC(=O)C", molecularWeight: 192.30 },
  "damascone": { formula: "C13H20O", smiles: "CC1=C(C(CC=C1)(C)C)C=CC(=O)C", molecularWeight: 192.30 },
  
  // Alcools
  "menthol": { formula: "C10H20O", smiles: "CC(C)C1CCC(C)CC1O", molecularWeight: 156.27 },
  "borneol": { formula: "C10H18O", smiles: "CC1(C)C2CCC1(C)C(O)C2", molecularWeight: 154.25 },
  "terpineol": { formula: "C10H18O", smiles: "CC1=CCC(CC1)(C)O", molecularWeight: 154.25 },
  "cedrol": { formula: "C15H26O", smiles: "CC1CCC2C(C1)C3(CCCC3(C2(C)O)C)C", molecularWeight: 222.37 },
  "santalol": { formula: "C15H24O", smiles: "CC(C)=CCCC(C)C1CCC(CO)=C1", molecularWeight: 220.35 },
  "patchoulol": { formula: "C15H26O", smiles: "CC1CCC2C(C1)C3(CCCC3(C2(C)O)C)C", molecularWeight: 222.37 },
  "vetiverol": { formula: "C15H24O", smiles: "CC1=C2CCC(C2CCC1O)(C)C", molecularWeight: 220.35 },
  "khusimol": { formula: "C15H24O", smiles: "CC1=C2CCC(C2CCC1O)(C)C", molecularWeight: 220.35 },
  
  // Hétérocycliques
  "indole": { formula: "C8H7N", smiles: "C1=CC=C2C(=C1)C=CN2", molecularWeight: 117.15 },
  "skatole": { formula: "C9H9N", smiles: "CC1=CNC2=CC=CC=C12", molecularWeight: 131.17 },
  "pyrazine": { formula: "C4H4N2", smiles: "C1=CN=CC=N1", molecularWeight: 80.09 },
  "coumarin": { formula: "C9H6O2", smiles: "O=C1OC2=CC=CC=C2C=C1", molecularWeight: 146.14 },
  "coumarine": { formula: "C9H6O2", smiles: "O=C1OC2=CC=CC=C2C=C1", molecularWeight: 146.14 },
  
  // Muscs
  "muscone": { formula: "C16H30O", smiles: "CC(CCCCCCCCCCCCC1)C1=O", molecularWeight: 238.41 },
  "ambroxan": { formula: "C16H28O", smiles: "CC12CCCC(C)(C1CCC3C2(CCCO3)C)O", molecularWeight: 236.39 },
  "galaxolide": { formula: "C18H26O", smiles: "CC1(C)CC2=CC(C(C)C)=C(OCC(C)(C)C2)C=C1", molecularWeight: 258.40 },
  
  // Lactones
  "gamma-decalactone": { formula: "C10H18O2", smiles: "CCCCCCC1CCC(=O)O1", molecularWeight: 170.25 },
  "gamma-undecalactone": { formula: "C11H20O2", smiles: "CCCCCCCC1CCC(=O)O1", molecularWeight: 184.28 },
  "jasmine lactone": { formula: "C10H16O2", smiles: "CCC=CCC1CCC(=O)O1", molecularWeight: 168.23 },
  
  // Autres
  "geosmin": { formula: "C12H22O", smiles: "CC1CCCC2(C1CCC(C2)O)C", molecularWeight: 182.30 },
  "géosmine": { formula: "C12H22O", smiles: "CC1CCCC2(C1CCC(C2)O)C", molecularWeight: 182.30 },
  "isoeugenol": { formula: "C10H12O2", smiles: "COC1=CC(C=CC)=CC=C1O", molecularWeight: 164.20 },
  "anethole": { formula: "C10H12O", smiles: "COC1=CC=C(C=CC)C=C1", molecularWeight: 148.20 },
  "estragole": { formula: "C10H12O", smiles: "COC1=CC=C(CC=C)C=C1", molecularWeight: 148.20 },
  "safrole": { formula: "C10H10O2", smiles: "C=CCC1=CC2=C(C=C1)OCO2", molecularWeight: 162.19 },
  "methyleugenol": { formula: "C11H14O2", smiles: "COC1=CC(CC=C)=CC=C1OC", molecularWeight: 178.23 },
  "elemicin": { formula: "C12H16O3", smiles: "COC1=CC(CC=C)=CC(OC)=C1OC", molecularWeight: 208.25 },
  
  // Acides organiques
  "acide décanoïque (c10)": { formula: "C10H20O2", smiles: "CCCCCCCCCC(=O)O", molecularWeight: 172.26 },
  "acide caféique": { formula: "C9H8O4", smiles: "OC(=O)C=CC1=CC(O)=C(O)C=C1", molecularWeight: 180.16 },
  "acide férulique": { formula: "C10H10O4", smiles: "COC1=CC(C=CC(=O)O)=CC=C1O", molecularWeight: 194.18 },
  "acide coumarique": { formula: "C9H8O3", smiles: "OC(=O)C=CC1=CC=C(O)C=C1", molecularWeight: 164.16 },
  
  // Esters supplémentaires
  "éthyl hexanoate": { formula: "C8H16O2", smiles: "CCCCCC(=O)OCC", molecularWeight: 144.21 },
  "ethyl hexanoate": { formula: "C8H16O2", smiles: "CCCCCC(=O)OCC", molecularWeight: 144.21 },
  "benzyl benzoate": { formula: "C14H12O2", smiles: "O=C(OCC1=CC=CC=C1)C2=CC=CC=C2", molecularWeight: 212.24 },
  "ethyl acetate": { formula: "C4H8O2", smiles: "CC(=O)OCC", molecularWeight: 88.11 },
  "isoamyl acetate": { formula: "C7H14O2", smiles: "CC(C)CCOC(=O)C", molecularWeight: 130.18 },
  
  // Hétérocycliques supplémentaires
  "indoline": { formula: "C8H9N", smiles: "C1CC2=CC=CC=C2N1", molecularWeight: 119.16 },
  "quinoline": { formula: "C9H7N", smiles: "C1=CC2=NC=CC=C2C=C1", molecularWeight: 129.16 },
  "isoquinoline": { formula: "C9H7N", smiles: "C1=CC2=CN=CC=C2C=C1", molecularWeight: 129.16 },
  "furan": { formula: "C4H4O", smiles: "C1=COC=C1", molecularWeight: 68.07 },
  "thiophene": { formula: "C4H4S", smiles: "C1=CSC=C1", molecularWeight: 84.14 },
  
  // Terpènes supplémentaires
  "valencene": { formula: "C15H24", smiles: "CC1=CCC(CC1)C(=C)CCC=C(C)C", molecularWeight: 204.35 },
  "guaiene": { formula: "C15H24", smiles: "CC1=CCC2C(C1)C3(CCCC3(C2)C)C", molecularWeight: 204.35 },
  "elemene": { formula: "C15H24", smiles: "CC(=C)C1CCC(C)(C=C)C2CC=C(C)CC12", molecularWeight: 204.35 },
  "selinene": { formula: "C15H24", smiles: "CC1=CCC2C(C1)C3(CCCC3(C2)C)C", molecularWeight: 204.35 },
  "cadinene": { formula: "C15H24", smiles: "CC1=CC2C(CC1)C(C)(C)C=CC2C", molecularWeight: 204.35 },
  "cedrene": { formula: "C15H24", smiles: "CC1CCC2C(C1)C3(CCCC3(C2)C)C", molecularWeight: 204.35 },
  "zingiberene": { formula: "C15H24", smiles: "CC(C)=CCCC(C)C1=CCC(C)=CC1", molecularWeight: 204.35 },
  "curcumene": { formula: "C15H22", smiles: "CC(C)=CCCC(C)C1=CC=C(C)C=C1", molecularWeight: 202.33 },
  "bergamotene": { formula: "C15H24", smiles: "CC1=CCC2C(C1)C3(CCCC3(C2)C)C", molecularWeight: 204.35 },
  "santalene": { formula: "C15H24", smiles: "CC(C)=CCCC(C)C1CCC(=C)C1", molecularWeight: 204.35 },
  
  // Aldéhydes supplémentaires
  "hexanal": { formula: "C6H12O", smiles: "CCCCCC=O", molecularWeight: 100.16 },
  "heptanal": { formula: "C7H14O", smiles: "CCCCCCC=O", molecularWeight: 114.19 },
  "octanal": { formula: "C8H16O", smiles: "CCCCCCCC=O", molecularWeight: 128.21 },
  "nonanal": { formula: "C9H18O", smiles: "CCCCCCCCC=O", molecularWeight: 142.24 },
  "decanal": { formula: "C10H20O", smiles: "CCCCCCCCCC=O", molecularWeight: 156.27 },
  "undecanal": { formula: "C11H22O", smiles: "CCCCCCCCCCC=O", molecularWeight: 170.29 },
  "dodecanal": { formula: "C12H24O", smiles: "CCCCCCCCCCCC=O", molecularWeight: 184.32 },
  "phenylacetaldehyde": { formula: "C8H8O", smiles: "O=CCC1=CC=CC=C1", molecularWeight: 120.15 },
  "anisaldehyde": { formula: "C8H8O2", smiles: "COC1=CC=C(C=O)C=C1", molecularWeight: 136.15 },
  "heliotropin": { formula: "C8H6O3", smiles: "O=CC1=CC2=C(OCO2)C=C1", molecularWeight: 150.13 },
  
  // Cétones supplémentaires
  "acetophenone": { formula: "C8H8O", smiles: "CC(=O)C1=CC=CC=C1", molecularWeight: 120.15 },
  "benzophenone": { formula: "C13H10O", smiles: "O=C(C1=CC=CC=C1)C2=CC=CC=C2", molecularWeight: 182.22 },
  "methyl heptenone": { formula: "C8H14O", smiles: "CC(=O)CCC=C(C)C", molecularWeight: 126.20 },
  "jasmone": { formula: "C11H16O", smiles: "CCC=CCC1=C(C)CCC1=O", molecularWeight: 164.24 },
  "dihydrojasmone": { formula: "C11H18O", smiles: "CCCCCC1=C(C)CCC1=O", molecularWeight: 166.26 },
  
  // Alcools supplémentaires
  "benzyl alcohol": { formula: "C7H8O", smiles: "OCC1=CC=CC=C1", molecularWeight: 108.14 },
  "phenethyl alcohol": { formula: "C8H10O", smiles: "OCCC1=CC=CC=C1", molecularWeight: 122.16 },
  "cinnamyl alcohol": { formula: "C9H10O", smiles: "OCC=CC1=CC=CC=C1", molecularWeight: 134.18 },
  "fenchol": { formula: "C10H18O", smiles: "CC1(C)C2CCC(C)(O)C1C2", molecularWeight: 154.25 },
  "isopulegol": { formula: "C10H18O", smiles: "CC(=C)C1CCC(C)(O)CC1", molecularWeight: 154.25 },
  
  // Phénols supplémentaires
  "chavicol": { formula: "C9H10O", smiles: "OC1=CC=C(CC=C)C=C1", molecularWeight: 134.18 },
  "p-cresol": { formula: "C7H8O", smiles: "CC1=CC=C(O)C=C1", molecularWeight: 108.14 },
  "m-cresol": { formula: "C7H8O", smiles: "CC1=CC(O)=CC=C1", molecularWeight: 108.14 },
  
  // Lactones supplémentaires
  "gamma-octalactone": { formula: "C8H14O2", smiles: "CCCCC1CCC(=O)O1", molecularWeight: 142.20 },
  "gamma-nonalactone": { formula: "C9H16O2", smiles: "CCCCCC1CCC(=O)O1", molecularWeight: 156.22 },
  "delta-decalactone": { formula: "C10H18O2", smiles: "CCCCCC1CCCC(=O)O1", molecularWeight: 170.25 },
  "whiskey lactone": { formula: "C9H16O2", smiles: "CCC(C)C1CCCC(=O)O1", molecularWeight: 156.22 },
  "massoia lactone": { formula: "C10H16O2", smiles: "CCCCC=CC1CCC(=O)O1", molecularWeight: 168.23 },
  
  // Muscs supplémentaires
  "musk ketone": { formula: "C14H18N2O5", smiles: "CC1=C(C(=C(C(=C1[N+](=O)[O-])C)C(C)(C)C)[N+](=O)[O-])C=O", molecularWeight: 294.30 },
  "musk xylene": { formula: "C12H15N3O6", smiles: "CC1=C(C(=C(C(=C1[N+](=O)[O-])C)C(C)(C)C)[N+](=O)[O-])[N+](=O)[O-]", molecularWeight: 297.27 },
  "ethylene brassylate": { formula: "C15H26O4", smiles: "O=C(CCCCCCCCCCC(=O)OCCO)O", molecularWeight: 286.37 },
  
  // Composés soufrés
  "dimethyl sulfide": { formula: "C2H6S", smiles: "CSC", molecularWeight: 62.13 },
  "dimethyl disulfide": { formula: "C2H6S2", smiles: "CSSC", molecularWeight: 94.20 },
  "allyl sulfide": { formula: "C6H10S", smiles: "C=CCSCC=C", molecularWeight: 114.21 },
  
  // Composés azotés
  "trimethylamine": { formula: "C3H9N", smiles: "CN(C)C", molecularWeight: 59.11 },
  "pyridine": { formula: "C5H5N", smiles: "C1=CC=NC=C1", molecularWeight: 79.10 },
  "2-acetylpyridine": { formula: "C7H7NO", smiles: "CC(=O)C1=NC=CC=C1", molecularWeight: 121.14 },
  
  // Ambre et résines
  "ambergris": { formula: "C30H52O", smiles: "CC1(C)CCCC2(C)C1CCC3(C)C2CCC4C(C)(C)CCCC34C", molecularWeight: 428.73 },
  "sclareol": { formula: "C20H36O2", smiles: "CC1(C)CCCC2(C)C1CCC3(C)C(O)C(O)CCC23", molecularWeight: 308.50 },
  "labdanum": { formula: "C20H34O2", smiles: "CC1(C)CCCC2(C)C1CCC3(C)C(O)C=CCC23", molecularWeight: 306.48 },
};

/**
 * Enrichit les molécules avec les formules chimiques
 */
export async function enrichWithFormulas(dryRun = true) {
  const db = await getDb();
  if (!db) return { error: "Database not available" };
  
  const results: { updated: string[]; notFound: string[]; errors: string[] } = {
    updated: [],
    notFound: [],
    errors: []
  };
  
  // Récupérer toutes les molécules sans formule
  const moleculesWithoutFormula = await db
    .select()
    .from(molecules)
    .where(sql`${molecules.chemicalFormula} IS NULL OR ${molecules.chemicalFormula} = ''`);
  
  for (const mol of moleculesWithoutFormula) {
    const nameLower = mol.name.toLowerCase().trim();
    const formulaData = MOLECULE_FORMULAS[nameLower];
    
    if (formulaData) {
      if (!dryRun) {
        try {
          await db
            .update(molecules)
            .set({
              chemicalFormula: formulaData.formula,
              smiles: formulaData.smiles,
              molecularWeight: formulaData.molecularWeight?.toString() || null
            })
            .where(eq(molecules.id, mol.id));
          results.updated.push(`${mol.name} (ID ${mol.id}): ${formulaData.formula}`);
        } catch (error) {
          results.errors.push(`Error updating ${mol.name}: ${error}`);
        }
      } else {
        results.updated.push(`${mol.name} (ID ${mol.id}): would be updated with ${formulaData.formula}`);
      }
    } else {
      results.notFound.push(mol.name);
    }
  }
  
  return {
    dryRun,
    totalWithoutFormula: moleculesWithoutFormula.length,
    ...results,
    summary: `${results.updated.length} molecules ${dryRun ? 'would be' : ''} enriched, ${results.notFound.length} not found in reference data`
  };
}
