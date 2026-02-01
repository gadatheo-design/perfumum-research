/**
 * Service d'enrichissement SMILES et CAS
 * 
 * Base de données de référence étendue pour les molécules olfactives
 * avec numéros CAS, structures SMILES et formules chimiques
 */

import { getDb } from "./db";
import { molecules } from "../drizzle/schema";
import { eq, sql, isNull, or } from "drizzle-orm";

// Base de données de référence étendue avec CAS, SMILES et formules
export const MOLECULE_REFERENCE_DATA: Record<string, {
  cas?: string;
  smiles: string;
  formula: string;
  molecularWeight: number;
}> = {
  // === MONOTERPÈNES ===
  "limonene": { cas: "138-86-3", smiles: "CC1=CCC(CC1)C(=C)C", formula: "C10H16", molecularWeight: 136.23 },
  "limonène": { cas: "138-86-3", smiles: "CC1=CCC(CC1)C(=C)C", formula: "C10H16", molecularWeight: 136.23 },
  "d-limonene": { cas: "5989-27-5", smiles: "C[C@H]1CCC(=CC1)C(=C)C", formula: "C10H16", molecularWeight: 136.23 },
  "d-limonène": { cas: "5989-27-5", smiles: "C[C@H]1CCC(=CC1)C(=C)C", formula: "C10H16", molecularWeight: 136.23 },
  "l-limonene": { cas: "5989-54-8", smiles: "C[C@@H]1CCC(=CC1)C(=C)C", formula: "C10H16", molecularWeight: 136.23 },
  "myrcene": { cas: "123-35-3", smiles: "CC(=CCCC(=C)C=C)C", formula: "C10H16", molecularWeight: 136.23 },
  "myrcène": { cas: "123-35-3", smiles: "CC(=CCCC(=C)C=C)C", formula: "C10H16", molecularWeight: 136.23 },
  "alpha-pinene": { cas: "80-56-8", smiles: "CC1=CCC2CC1C2(C)C", formula: "C10H16", molecularWeight: 136.23 },
  "α-pinène": { cas: "80-56-8", smiles: "CC1=CCC2CC1C2(C)C", formula: "C10H16", molecularWeight: 136.23 },
  "beta-pinene": { cas: "127-91-3", smiles: "CC1(C)C2CCC(=C)C1C2", formula: "C10H16", molecularWeight: 136.23 },
  "β-pinène": { cas: "127-91-3", smiles: "CC1(C)C2CCC(=C)C1C2", formula: "C10H16", molecularWeight: 136.23 },
  "camphene": { cas: "79-92-5", smiles: "CC1(C)C2CCC(=C)C1C2", formula: "C10H16", molecularWeight: 136.23 },
  "camphène": { cas: "79-92-5", smiles: "CC1(C)C2CCC(=C)C1C2", formula: "C10H16", molecularWeight: 136.23 },
  "3-carene": { cas: "13466-78-9", smiles: "CC1=CCC2C(C1)C2(C)C", formula: "C10H16", molecularWeight: 136.23 },
  "3-carène": { cas: "13466-78-9", smiles: "CC1=CCC2C(C1)C2(C)C", formula: "C10H16", molecularWeight: 136.23 },
  "delta-3-carene": { cas: "13466-78-9", smiles: "CC1=CCC2C(C1)C2(C)C", formula: "C10H16", molecularWeight: 136.23 },
  "sabinene": { cas: "3387-41-5", smiles: "CC(C)C1CCC2(CC1)C2", formula: "C10H16", molecularWeight: 136.23 },
  "alpha-terpinene": { cas: "99-86-5", smiles: "CC1=CC=C(C(C)C)CC1", formula: "C10H16", molecularWeight: 136.23 },
  "α-terpinène": { cas: "99-86-5", smiles: "CC1=CC=C(C(C)C)CC1", formula: "C10H16", molecularWeight: 136.23 },
  "gamma-terpinene": { cas: "99-85-4", smiles: "CC1=CCC(C(C)C)=CC1", formula: "C10H16", molecularWeight: 136.23 },
  "γ-terpinène": { cas: "99-85-4", smiles: "CC1=CCC(C(C)C)=CC1", formula: "C10H16", molecularWeight: 136.23 },
  "terpinolene": { cas: "586-62-9", smiles: "CC1=CCC(CC1)=C(C)C", formula: "C10H16", molecularWeight: 136.23 },
  "terpinolène": { cas: "586-62-9", smiles: "CC1=CCC(CC1)=C(C)C", formula: "C10H16", molecularWeight: 136.23 },
  "ocimene": { cas: "13877-91-3", smiles: "CC(=C)C=CC=C(C)C", formula: "C10H16", molecularWeight: 136.23 },
  "ocimène": { cas: "13877-91-3", smiles: "CC(=C)C=CC=C(C)C", formula: "C10H16", molecularWeight: 136.23 },
  "beta-ocimene": { cas: "3779-61-1", smiles: "CC(=C)C=CC=C(C)C", formula: "C10H16", molecularWeight: 136.23 },
  "β-ocimène": { cas: "3779-61-1", smiles: "CC(=C)C=CC=C(C)C", formula: "C10H16", molecularWeight: 136.23 },
  "p-cymene": { cas: "99-87-6", smiles: "CC1=CC=C(C(C)C)C=C1", formula: "C10H14", molecularWeight: 134.22 },
  "p-cymène": { cas: "99-87-6", smiles: "CC1=CC=C(C(C)C)C=C1", formula: "C10H14", molecularWeight: 134.22 },
  "para-cymene": { cas: "99-87-6", smiles: "CC1=CC=C(C(C)C)C=C1", formula: "C10H14", molecularWeight: 134.22 },
  
  // === SESQUITERPÈNES ===
  "beta-caryophyllene": { cas: "87-44-5", smiles: "CC1=CCCC(=C)C2CC(C2CC1)(C)C", formula: "C15H24", molecularWeight: 204.35 },
  "β-caryophyllène": { cas: "87-44-5", smiles: "CC1=CCCC(=C)C2CC(C2CC1)(C)C", formula: "C15H24", molecularWeight: 204.35 },
  "caryophyllene": { cas: "87-44-5", smiles: "CC1=CCCC(=C)C2CC(C2CC1)(C)C", formula: "C15H24", molecularWeight: 204.35 },
  "caryophyllène": { cas: "87-44-5", smiles: "CC1=CCCC(=C)C2CC(C2CC1)(C)C", formula: "C15H24", molecularWeight: 204.35 },
  "humulene": { cas: "6753-98-6", smiles: "CC1=CCC(C=CCC(=CCC1)C)(C)C", formula: "C15H24", molecularWeight: 204.35 },
  "humulène": { cas: "6753-98-6", smiles: "CC1=CCC(C=CCC(=CCC1)C)(C)C", formula: "C15H24", molecularWeight: 204.35 },
  "alpha-humulene": { cas: "6753-98-6", smiles: "CC1=CCC(C=CCC(=CCC1)C)(C)C", formula: "C15H24", molecularWeight: 204.35 },
  "α-humulène": { cas: "6753-98-6", smiles: "CC1=CCC(C=CCC(=CCC1)C)(C)C", formula: "C15H24", molecularWeight: 204.35 },
  "farnesene": { cas: "502-61-4", smiles: "CC(=CCCC(=CCCC(=C)C=C)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "farnésène": { cas: "502-61-4", smiles: "CC(=CCCC(=CCCC(=C)C=C)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "alpha-farnesene": { cas: "502-61-4", smiles: "CC(=CCCC(=CCCC(=C)C=C)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "β-farnesene": { cas: "18794-84-8", smiles: "CC(=CCCC(=CCC=C(C)C)C)C=C", formula: "C15H24", molecularWeight: 204.35 },
  "bisabolene": { cas: "495-61-4", smiles: "CC(C)=CCCC(C)=CC1=CCC(C)=CC1", formula: "C15H24", molecularWeight: 204.35 },
  "bisabolène": { cas: "495-61-4", smiles: "CC(C)=CCCC(C)=CC1=CCC(C)=CC1", formula: "C15H24", molecularWeight: 204.35 },
  "alpha-bisabolene": { cas: "17627-44-0", smiles: "CC(C)=CCCC(C)=CC1=CCC(C)=CC1", formula: "C15H24", molecularWeight: 204.35 },
  "α-bisabolène": { cas: "17627-44-0", smiles: "CC(C)=CCCC(C)=CC1=CCC(C)=CC1", formula: "C15H24", molecularWeight: 204.35 },
  "zingiberene": { cas: "495-60-3", smiles: "CC(C)=CCCC(C)C1=CCC(C)=CC1", formula: "C15H24", molecularWeight: 204.35 },
  "zingibérène": { cas: "495-60-3", smiles: "CC(C)=CCCC(C)C1=CCC(C)=CC1", formula: "C15H24", molecularWeight: 204.35 },
  "valencene": { cas: "4630-07-3", smiles: "CC1=CCC(CC1)C(=C)CCC=C(C)C", formula: "C15H24", molecularWeight: 204.35 },
  "valencène": { cas: "4630-07-3", smiles: "CC1=CCC(CC1)C(=C)CCC=C(C)C", formula: "C15H24", molecularWeight: 204.35 },
  "guaiene": { cas: "88-84-6", smiles: "CC1=CCC2C(C1)C3(CCCC3(C2)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "guaiène": { cas: "88-84-6", smiles: "CC1=CCC2C(C1)C3(CCCC3(C2)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "alpha-guaiene": { cas: "3691-12-1", smiles: "CC1=CCC2C(C1)C3(CCCC3(C2)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "elemene": { cas: "515-13-9", smiles: "CC(=C)C1CCC(C)(C=C)C2CC=C(C)CC12", formula: "C15H24", molecularWeight: 204.35 },
  "élémène": { cas: "515-13-9", smiles: "CC(=C)C1CCC(C)(C=C)C2CC=C(C)CC12", formula: "C15H24", molecularWeight: 204.35 },
  "beta-elemene": { cas: "515-13-9", smiles: "CC(=C)C1CCC(C)(C=C)C2CC=C(C)CC12", formula: "C15H24", molecularWeight: 204.35 },
  "selinene": { cas: "473-13-2", smiles: "CC1=CCC2C(C1)C3(CCCC3(C2)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "sélinène": { cas: "473-13-2", smiles: "CC1=CCC2C(C1)C3(CCCC3(C2)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "alpha-selinene": { cas: "473-13-2", smiles: "CC1=CCC2C(C1)C3(CCCC3(C2)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "cadinene": { cas: "483-76-1", smiles: "CC1=CC2C(CC1)C(C)(C)C=CC2C", formula: "C15H24", molecularWeight: 204.35 },
  "cadinène": { cas: "483-76-1", smiles: "CC1=CC2C(CC1)C(C)(C)C=CC2C", formula: "C15H24", molecularWeight: 204.35 },
  "delta-cadinene": { cas: "483-76-1", smiles: "CC1=CC2C(CC1)C(C)(C)C=CC2C", formula: "C15H24", molecularWeight: 204.35 },
  "δ-cadinène": { cas: "483-76-1", smiles: "CC1=CC2C(CC1)C(C)(C)C=CC2C", formula: "C15H24", molecularWeight: 204.35 },
  "cedrene": { cas: "469-61-4", smiles: "CC1CCC2C(C1)C3(CCCC3(C2)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "cédrène": { cas: "469-61-4", smiles: "CC1CCC2C(C1)C3(CCCC3(C2)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "alpha-cedrene": { cas: "469-61-4", smiles: "CC1CCC2C(C1)C3(CCCC3(C2)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "copaene": { cas: "3856-25-5", smiles: "CC1CCC2C(C1)C3(CCCC3(C2)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "copaène": { cas: "3856-25-5", smiles: "CC1CCC2C(C1)C3(CCCC3(C2)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "alpha-copaene": { cas: "3856-25-5", smiles: "CC1CCC2C(C1)C3(CCCC3(C2)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "α-copaène": { cas: "3856-25-5", smiles: "CC1CCC2C(C1)C3(CCCC3(C2)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "germacrene d": { cas: "23986-74-5", smiles: "CC1=CCCC(=C)C2CC(C(=CC2)C)CC1", formula: "C15H24", molecularWeight: 204.35 },
  "germacrène d": { cas: "23986-74-5", smiles: "CC1=CCCC(=C)C2CC(C(=CC2)C)CC1", formula: "C15H24", molecularWeight: 204.35 },
  "bergamotene": { cas: "17699-05-7", smiles: "CC1=CCC2C(C1)C3(CCCC3(C2)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "bergamotène": { cas: "17699-05-7", smiles: "CC1=CCC2C(C1)C3(CCCC3(C2)C)C", formula: "C15H24", molecularWeight: 204.35 },
  "santalene": { cas: "512-61-8", smiles: "CC(C)=CCCC(C)C1CCC(=C)C1", formula: "C15H24", molecularWeight: 204.35 },
  "santalène": { cas: "512-61-8", smiles: "CC(C)=CCCC(C)C1CCC(=C)C1", formula: "C15H24", molecularWeight: 204.35 },
  "alpha-santalene": { cas: "512-61-8", smiles: "CC(C)=CCCC(C)C1CCC(=C)C1", formula: "C15H24", molecularWeight: 204.35 },
  "curcumene": { cas: "644-30-4", smiles: "CC(C)=CCCC(C)C1=CC=C(C)C=C1", formula: "C15H22", molecularWeight: 202.33 },
  "curcumène": { cas: "644-30-4", smiles: "CC(C)=CCCC(C)C1=CC=C(C)C=C1", formula: "C15H22", molecularWeight: 202.33 },
  
  // === ALCOOLS MONOTERPÉNIQUES ===
  "linalool": { cas: "78-70-6", smiles: "CC(C)=CCCC(C)(C=C)O", formula: "C10H18O", molecularWeight: 154.25 },
  "linalol": { cas: "78-70-6", smiles: "CC(C)=CCCC(C)(C=C)O", formula: "C10H18O", molecularWeight: 154.25 },
  "geraniol": { cas: "106-24-1", smiles: "CC(=CCCC(=CCO)C)C", formula: "C10H18O", molecularWeight: 154.25 },
  "géraniol": { cas: "106-24-1", smiles: "CC(=CCCC(=CCO)C)C", formula: "C10H18O", molecularWeight: 154.25 },
  "nerol": { cas: "106-25-2", smiles: "CC(=CCCC(=CCO)C)C", formula: "C10H18O", molecularWeight: 154.25 },
  "nérol": { cas: "106-25-2", smiles: "CC(=CCCC(=CCO)C)C", formula: "C10H18O", molecularWeight: 154.25 },
  "citronellol": { cas: "106-22-9", smiles: "CC(C)=CCCC(C)CCO", formula: "C10H20O", molecularWeight: 156.27 },
  "menthol": { cas: "89-78-1", smiles: "CC(C)C1CCC(C)CC1O", formula: "C10H20O", molecularWeight: 156.27 },
  "l-menthol": { cas: "2216-51-5", smiles: "C[C@H]1CC[C@@H](C(C)C)[C@H](O)C1", formula: "C10H20O", molecularWeight: 156.27 },
  "borneol": { cas: "507-70-0", smiles: "CC1(C)C2CCC1(C)C(O)C2", formula: "C10H18O", molecularWeight: 154.25 },
  "bornéol": { cas: "507-70-0", smiles: "CC1(C)C2CCC1(C)C(O)C2", formula: "C10H18O", molecularWeight: 154.25 },
  "isoborneol": { cas: "124-76-5", smiles: "CC1(C)C2CCC1(C)C(O)C2", formula: "C10H18O", molecularWeight: 154.25 },
  "terpineol": { cas: "98-55-5", smiles: "CC1=CCC(CC1)(C)O", formula: "C10H18O", molecularWeight: 154.25 },
  "terpinéol": { cas: "98-55-5", smiles: "CC1=CCC(CC1)(C)O", formula: "C10H18O", molecularWeight: 154.25 },
  "alpha-terpineol": { cas: "98-55-5", smiles: "CC1=CCC(CC1)(C)O", formula: "C10H18O", molecularWeight: 154.25 },
  "α-terpinéol": { cas: "98-55-5", smiles: "CC1=CCC(CC1)(C)O", formula: "C10H18O", molecularWeight: 154.25 },
  "terpinen-4-ol": { cas: "562-74-3", smiles: "CC(C)C1=CCC(C)(O)CC1", formula: "C10H18O", molecularWeight: 154.25 },
  "terpinène-4-ol": { cas: "562-74-3", smiles: "CC(C)C1=CCC(C)(O)CC1", formula: "C10H18O", molecularWeight: 154.25 },
  "fenchol": { cas: "1632-73-1", smiles: "CC1(C)C2CCC(C)(O)C1C2", formula: "C10H18O", molecularWeight: 154.25 },
  "isopulegol": { cas: "89-79-2", smiles: "CC(=C)C1CCC(C)(O)CC1", formula: "C10H18O", molecularWeight: 154.25 },
  "isopulégol": { cas: "89-79-2", smiles: "CC(=C)C1CCC(C)(O)CC1", formula: "C10H18O", molecularWeight: 154.25 },
  "carveol": { cas: "99-48-9", smiles: "CC(=C)C1CC=C(C)C(O)C1", formula: "C10H16O", molecularWeight: 152.23 },
  "carvéol": { cas: "99-48-9", smiles: "CC(=C)C1CC=C(C)C(O)C1", formula: "C10H16O", molecularWeight: 152.23 },
  "myrtenol": { cas: "515-00-4", smiles: "CC1(C)C2CC(CO)=CC1C2", formula: "C10H16O", molecularWeight: 152.23 },
  "myrténol": { cas: "515-00-4", smiles: "CC1(C)C2CC(CO)=CC1C2", formula: "C10H16O", molecularWeight: 152.23 },
  "lavandulol": { cas: "498-16-8", smiles: "CC(=C)C(CC=C(C)C)CO", formula: "C10H18O", molecularWeight: 154.25 },
  "pinocarveol": { cas: "5947-36-4", smiles: "CC1(C)C2CC(O)C(=C)C1C2", formula: "C10H16O", molecularWeight: 152.23 },
  
  // === ALCOOLS SESQUITERPÉNIQUES ===
  "nerolidol": { cas: "7212-44-4", smiles: "CC(=CCCC(=CCCC(C)(C=C)O)C)C", formula: "C15H26O", molecularWeight: 222.37 },
  "nérolidol": { cas: "7212-44-4", smiles: "CC(=CCCC(=CCCC(C)(C=C)O)C)C", formula: "C15H26O", molecularWeight: 222.37 },
  "farnesol": { cas: "4602-84-0", smiles: "CC(=CCCC(=CCCC(=CCO)C)C)C", formula: "C15H26O", molecularWeight: 222.37 },
  "farnésol": { cas: "4602-84-0", smiles: "CC(=CCCC(=CCCC(=CCO)C)C)C", formula: "C15H26O", molecularWeight: 222.37 },
  "bisabolol": { cas: "515-69-5", smiles: "CC(C)=CCCC(C)(O)C1CCC(=CC1)C", formula: "C15H26O", molecularWeight: 222.37 },
  "α-bisabolol": { cas: "515-69-5", smiles: "CC(C)=CCCC(C)(O)C1CCC(=CC1)C", formula: "C15H26O", molecularWeight: 222.37 },
  "alpha-bisabolol": { cas: "515-69-5", smiles: "CC(C)=CCCC(C)(O)C1CCC(=CC1)C", formula: "C15H26O", molecularWeight: 222.37 },
  "cedrol": { cas: "77-53-2", smiles: "CC1CCC2C(C1)C3(CCCC3(C2(C)O)C)C", formula: "C15H26O", molecularWeight: 222.37 },
  "cédrol": { cas: "77-53-2", smiles: "CC1CCC2C(C1)C3(CCCC3(C2(C)O)C)C", formula: "C15H26O", molecularWeight: 222.37 },
  "santalol": { cas: "11031-45-1", smiles: "CC(C)=CCCC(C)C1CCC(CO)=C1", formula: "C15H24O", molecularWeight: 220.35 },
  "alpha-santalol": { cas: "115-71-9", smiles: "CC(C)=CCCC(C)C1CCC(CO)=C1", formula: "C15H24O", molecularWeight: 220.35 },
  "α-santalol": { cas: "115-71-9", smiles: "CC(C)=CCCC(C)C1CCC(CO)=C1", formula: "C15H24O", molecularWeight: 220.35 },
  "patchoulol": { cas: "5986-55-0", smiles: "CC1CCC2C(C1)C3(CCCC3(C2(C)O)C)C", formula: "C15H26O", molecularWeight: 222.37 },
  "vetiverol": { cas: "89-88-3", smiles: "CC1=C2CCC(C2CCC1O)(C)C", formula: "C15H24O", molecularWeight: 220.35 },
  "vétivérol": { cas: "89-88-3", smiles: "CC1=C2CCC(C2CCC1O)(C)C", formula: "C15H24O", molecularWeight: 220.35 },
  "khusimol": { cas: "16223-63-5", smiles: "CC1=C2CCC(C2CCC1O)(C)C", formula: "C15H24O", molecularWeight: 220.35 },
  "spathulenol": { cas: "6750-60-3", smiles: "CC1CCC2C(C1)C3(CCCC3(C2(C)O)C)C", formula: "C15H24O", molecularWeight: 220.35 },
  "viridiflorol": { cas: "552-02-3", smiles: "CC1CCC2C(C1)C3(CCCC3(C2(C)O)C)C", formula: "C15H26O", molecularWeight: 222.37 },
  "globulol": { cas: "489-41-8", smiles: "CC1CCC2C(C1)C3(CCCC3(C2(C)O)C)C", formula: "C15H26O", molecularWeight: 222.37 },
  "eudesmol": { cas: "473-15-4", smiles: "CC1=CCC2C(C1)C3(CCCC3(C2(C)O)C)C", formula: "C15H26O", molecularWeight: 222.37 },
  "caryophyllene oxide": { cas: "1139-30-6", smiles: "CC1=CCCC2(C)OC2CC1C3CC3(C)C", formula: "C15H24O", molecularWeight: 220.35 },
  "oxyde de caryophyllène": { cas: "1139-30-6", smiles: "CC1=CCCC2(C)OC2CC1C3CC3(C)C", formula: "C15H24O", molecularWeight: 220.35 },
  
  // === ALDÉHYDES ===
  "citral": { cas: "5392-40-5", smiles: "CC(=CCCC(=CC=O)C)C", formula: "C10H16O", molecularWeight: 152.23 },
  "geranial": { cas: "141-27-5", smiles: "CC(=CCCC(=CC=O)C)C", formula: "C10H16O", molecularWeight: 152.23 },
  "géranial": { cas: "141-27-5", smiles: "CC(=CCCC(=CC=O)C)C", formula: "C10H16O", molecularWeight: 152.23 },
  "neral": { cas: "106-26-3", smiles: "CC(=CCCC(=CC=O)C)C", formula: "C10H16O", molecularWeight: 152.23 },
  "néral": { cas: "106-26-3", smiles: "CC(=CCCC(=CC=O)C)C", formula: "C10H16O", molecularWeight: 152.23 },
  "citronellal": { cas: "106-23-0", smiles: "CC(C)=CCCC(C)CC=O", formula: "C10H18O", molecularWeight: 154.25 },
  "benzaldehyde": { cas: "100-52-7", smiles: "O=CC1=CC=CC=C1", formula: "C7H6O", molecularWeight: 106.12 },
  "benzaldéhyde": { cas: "100-52-7", smiles: "O=CC1=CC=CC=C1", formula: "C7H6O", molecularWeight: 106.12 },
  "vanillin": { cas: "121-33-5", smiles: "COC1=CC(C=O)=CC=C1O", formula: "C8H8O3", molecularWeight: 152.15 },
  "vanilline": { cas: "121-33-5", smiles: "COC1=CC(C=O)=CC=C1O", formula: "C8H8O3", molecularWeight: 152.15 },
  "cinnamaldehyde": { cas: "104-55-2", smiles: "O=CC=CC1=CC=CC=C1", formula: "C9H8O", molecularWeight: 132.16 },
  "cinnamaldéhyde": { cas: "104-55-2", smiles: "O=CC=CC1=CC=CC=C1", formula: "C9H8O", molecularWeight: 132.16 },
  "phenylacetaldehyde": { cas: "122-78-1", smiles: "O=CCC1=CC=CC=C1", formula: "C8H8O", molecularWeight: 120.15 },
  "phénylacétaldéhyde": { cas: "122-78-1", smiles: "O=CCC1=CC=CC=C1", formula: "C8H8O", molecularWeight: 120.15 },
  "anisaldehyde": { cas: "123-11-5", smiles: "COC1=CC=C(C=O)C=C1", formula: "C8H8O2", molecularWeight: 136.15 },
  "anisaldéhyde": { cas: "123-11-5", smiles: "COC1=CC=C(C=O)C=C1", formula: "C8H8O2", molecularWeight: 136.15 },
  "heliotropin": { cas: "120-57-0", smiles: "O=CC1=CC2=C(OCO2)C=C1", formula: "C8H6O3", molecularWeight: 150.13 },
  "héliotropine": { cas: "120-57-0", smiles: "O=CC1=CC2=C(OCO2)C=C1", formula: "C8H6O3", molecularWeight: 150.13 },
  "piperonal": { cas: "120-57-0", smiles: "O=CC1=CC2=C(OCO2)C=C1", formula: "C8H6O3", molecularWeight: 150.13 },
  "cuminaldehyde": { cas: "122-03-2", smiles: "CC(C)C1=CC=C(C=O)C=C1", formula: "C10H12O", molecularWeight: 148.20 },
  "cuminaldéhyde": { cas: "122-03-2", smiles: "CC(C)C1=CC=C(C=O)C=C1", formula: "C10H12O", molecularWeight: 148.20 },
  "perillaldehyde": { cas: "2111-75-3", smiles: "CC(=C)C1CCC(C=O)=CC1", formula: "C10H14O", molecularWeight: 150.22 },
  "périllaldéhyde": { cas: "2111-75-3", smiles: "CC(=C)C1CCC(C=O)=CC1", formula: "C10H14O", molecularWeight: 150.22 },
  "safranal": { cas: "116-26-7", smiles: "CC1=C(C=O)C(C)(C)CC=C1", formula: "C10H14O", molecularWeight: 150.22 },
  "hexanal": { cas: "66-25-1", smiles: "CCCCCC=O", formula: "C6H12O", molecularWeight: 100.16 },
  "heptanal": { cas: "111-71-7", smiles: "CCCCCCC=O", formula: "C7H14O", molecularWeight: 114.19 },
  "octanal": { cas: "124-13-0", smiles: "CCCCCCCC=O", formula: "C8H16O", molecularWeight: 128.21 },
  "nonanal": { cas: "124-19-6", smiles: "CCCCCCCCC=O", formula: "C9H18O", molecularWeight: 142.24 },
  "decanal": { cas: "112-31-2", smiles: "CCCCCCCCCC=O", formula: "C10H20O", molecularWeight: 156.27 },
  "undecanal": { cas: "112-44-7", smiles: "CCCCCCCCCCC=O", formula: "C11H22O", molecularWeight: 170.29 },
  "dodecanal": { cas: "112-54-9", smiles: "CCCCCCCCCCCC=O", formula: "C12H24O", molecularWeight: 184.32 },
  
  // === CÉTONES ===
  "camphor": { cas: "76-22-2", smiles: "CC1(C)C2CCC1(C)C(=O)C2", formula: "C10H16O", molecularWeight: 152.23 },
  "camphre": { cas: "76-22-2", smiles: "CC1(C)C2CCC1(C)C(=O)C2", formula: "C10H16O", molecularWeight: 152.23 },
  "menthone": { cas: "89-80-5", smiles: "CC(C)C1CCC(C)CC1=O", formula: "C10H18O", molecularWeight: 154.25 },
  "isomenthone": { cas: "491-07-6", smiles: "CC(C)C1CCC(C)CC1=O", formula: "C10H18O", molecularWeight: 154.25 },
  "carvone": { cas: "99-49-0", smiles: "CC(=C)C1CC=C(C)C(=O)C1", formula: "C10H14O", molecularWeight: 150.22 },
  "l-carvone": { cas: "6485-40-1", smiles: "C[C@H]1CC(=O)C(=CC1)C(=C)C", formula: "C10H14O", molecularWeight: 150.22 },
  "d-carvone": { cas: "2244-16-8", smiles: "C[C@@H]1CC(=O)C(=CC1)C(=C)C", formula: "C10H14O", molecularWeight: 150.22 },
  "pulegone": { cas: "89-82-7", smiles: "CC(C)=C1CCC(C)CC1=O", formula: "C10H16O", molecularWeight: 152.23 },
  "pulégone": { cas: "89-82-7", smiles: "CC(C)=C1CCC(C)CC1=O", formula: "C10H16O", molecularWeight: 152.23 },
  "fenchone": { cas: "1195-79-5", smiles: "CC1(C)C2CCC(C)(C2)C1=O", formula: "C10H16O", molecularWeight: 152.23 },
  "verbenone": { cas: "80-57-9", smiles: "CC1=CC(=O)C2CC1C2(C)C", formula: "C10H14O", molecularWeight: 150.22 },
  "verbénone": { cas: "80-57-9", smiles: "CC1=CC(=O)C2CC1C2(C)C", formula: "C10H14O", molecularWeight: 150.22 },
  "pinocamphone": { cas: "547-60-4", smiles: "CC1(C)C2CCC1(C)C(=O)C2", formula: "C10H16O", molecularWeight: 152.23 },
  "pinocarvone": { cas: "30460-92-5", smiles: "CC1(C)C2CC(=O)C(=C)C1C2", formula: "C10H14O", molecularWeight: 150.22 },
  "ionone": { cas: "8013-90-9", smiles: "CC1=C(C(CC=C1)(C)C)C=CC(=O)C", formula: "C13H20O", molecularWeight: 192.30 },
  "alpha-ionone": { cas: "127-41-3", smiles: "CC1=C(C(CC=C1)(C)C)C=CC(=O)C", formula: "C13H20O", molecularWeight: 192.30 },
  "α-ionone": { cas: "127-41-3", smiles: "CC1=C(C(CC=C1)(C)C)C=CC(=O)C", formula: "C13H20O", molecularWeight: 192.30 },
  "beta-ionone": { cas: "14901-07-6", smiles: "CC1=C(C(CC=C1)(C)C)C=CC(=O)C", formula: "C13H20O", molecularWeight: 192.30 },
  "β-ionone": { cas: "14901-07-6", smiles: "CC1=C(C(CC=C1)(C)C)C=CC(=O)C", formula: "C13H20O", molecularWeight: 192.30 },
  "damascone": { cas: "23726-91-2", smiles: "CC1=C(C(CC=C1)(C)C)C=CC(=O)C", formula: "C13H20O", molecularWeight: 192.30 },
  "damascénone": { cas: "23726-93-4", smiles: "CC1=C(C(CC=C1)(C)C)C=CC(=O)C", formula: "C13H18O", molecularWeight: 190.28 },
  "beta-damascenone": { cas: "23726-93-4", smiles: "CC1=C(C(CC=C1)(C)C)C=CC(=O)C", formula: "C13H18O", molecularWeight: 190.28 },
  "β-damascénone": { cas: "23726-93-4", smiles: "CC1=C(C(CC=C1)(C)C)C=CC(=O)C", formula: "C13H18O", molecularWeight: 190.28 },
  "jasmone": { cas: "488-10-8", smiles: "CCC=CCC1=C(C)CCC1=O", formula: "C11H16O", molecularWeight: 164.24 },
  "dihydrojasmone": { cas: "1128-08-1", smiles: "CCCCCC1=C(C)CCC1=O", formula: "C11H18O", molecularWeight: 166.26 },
  "acetophenone": { cas: "98-86-2", smiles: "CC(=O)C1=CC=CC=C1", formula: "C8H8O", molecularWeight: 120.15 },
  "acétophénone": { cas: "98-86-2", smiles: "CC(=O)C1=CC=CC=C1", formula: "C8H8O", molecularWeight: 120.15 },
  "methyl heptenone": { cas: "110-93-0", smiles: "CC(=O)CCC=C(C)C", formula: "C8H14O", molecularWeight: 126.20 },
  
  // === PHÉNOLS ===
  "eugenol": { cas: "97-53-0", smiles: "COC1=CC(CC=C)=CC=C1O", formula: "C10H12O2", molecularWeight: 164.20 },
  "eugénol": { cas: "97-53-0", smiles: "COC1=CC(CC=C)=CC=C1O", formula: "C10H12O2", molecularWeight: 164.20 },
  "isoeugenol": { cas: "97-54-1", smiles: "COC1=CC(C=CC)=CC=C1O", formula: "C10H12O2", molecularWeight: 164.20 },
  "isoéugénol": { cas: "97-54-1", smiles: "COC1=CC(C=CC)=CC=C1O", formula: "C10H12O2", molecularWeight: 164.20 },
  "thymol": { cas: "89-83-8", smiles: "CC(C)C1=CC(C)=CC=C1O", formula: "C10H14O", molecularWeight: 150.22 },
  "carvacrol": { cas: "499-75-2", smiles: "CC(C)C1=CC=C(C)C=C1O", formula: "C10H14O", molecularWeight: 150.22 },
  "guaiacol": { cas: "90-05-1", smiles: "COC1=CC=CC=C1O", formula: "C7H8O2", molecularWeight: 124.14 },
  "gaïacol": { cas: "90-05-1", smiles: "COC1=CC=CC=C1O", formula: "C7H8O2", molecularWeight: 124.14 },
  "chavicol": { cas: "501-92-8", smiles: "OC1=CC=C(CC=C)C=C1", formula: "C9H10O", molecularWeight: 134.18 },
  "p-cresol": { cas: "106-44-5", smiles: "CC1=CC=C(O)C=C1", formula: "C7H8O", molecularWeight: 108.14 },
  "m-cresol": { cas: "108-39-4", smiles: "CC1=CC(O)=CC=C1", formula: "C7H8O", molecularWeight: 108.14 },
  
  // === ESTERS ===
  "linalyl acetate": { cas: "115-95-7", smiles: "CC(=O)OC(C)(C=C)CCC=C(C)C", formula: "C12H20O2", molecularWeight: 196.29 },
  "acétate de linalyle": { cas: "115-95-7", smiles: "CC(=O)OC(C)(C=C)CCC=C(C)C", formula: "C12H20O2", molecularWeight: 196.29 },
  "geranyl acetate": { cas: "105-87-3", smiles: "CC(=CCCC(=CCOC(=O)C)C)C", formula: "C12H20O2", molecularWeight: 196.29 },
  "acétate de géranyle": { cas: "105-87-3", smiles: "CC(=CCCC(=CCOC(=O)C)C)C", formula: "C12H20O2", molecularWeight: 196.29 },
  "neryl acetate": { cas: "141-12-8", smiles: "CC(=CCCC(=CCOC(=O)C)C)C", formula: "C12H20O2", molecularWeight: 196.29 },
  "acétate de néryle": { cas: "141-12-8", smiles: "CC(=CCCC(=CCOC(=O)C)C)C", formula: "C12H20O2", molecularWeight: 196.29 },
  "citronellyl acetate": { cas: "150-84-5", smiles: "CC(C)=CCCC(C)CCOC(=O)C", formula: "C12H22O2", molecularWeight: 198.30 },
  "acétate de citronellyle": { cas: "150-84-5", smiles: "CC(C)=CCCC(C)CCOC(=O)C", formula: "C12H22O2", molecularWeight: 198.30 },
  "bornyl acetate": { cas: "76-49-3", smiles: "CC(=O)OC1CC2CCC1(C)C2(C)C", formula: "C12H20O2", molecularWeight: 196.29 },
  "acétate de bornyle": { cas: "76-49-3", smiles: "CC(=O)OC1CC2CCC1(C)C2(C)C", formula: "C12H20O2", molecularWeight: 196.29 },
  "terpinyl acetate": { cas: "80-26-2", smiles: "CC1=CCC(CC1)(C)OC(=O)C", formula: "C12H20O2", molecularWeight: 196.29 },
  "acétate de terpényle": { cas: "80-26-2", smiles: "CC1=CCC(CC1)(C)OC(=O)C", formula: "C12H20O2", molecularWeight: 196.29 },
  "menthyl acetate": { cas: "89-48-5", smiles: "CC(C)C1CCC(C)CC1OC(=O)C", formula: "C12H22O2", molecularWeight: 198.30 },
  "acétate de menthyle": { cas: "89-48-5", smiles: "CC(C)C1CCC(C)CC1OC(=O)C", formula: "C12H22O2", molecularWeight: 198.30 },
  "benzyl acetate": { cas: "140-11-4", smiles: "CC(=O)OCC1=CC=CC=C1", formula: "C9H10O2", molecularWeight: 150.17 },
  "acétate de benzyle": { cas: "140-11-4", smiles: "CC(=O)OCC1=CC=CC=C1", formula: "C9H10O2", molecularWeight: 150.17 },
  "benzyl benzoate": { cas: "120-51-4", smiles: "O=C(OCC1=CC=CC=C1)C2=CC=CC=C2", formula: "C14H12O2", molecularWeight: 212.24 },
  "benzoate de benzyle": { cas: "120-51-4", smiles: "O=C(OCC1=CC=CC=C1)C2=CC=CC=C2", formula: "C14H12O2", molecularWeight: 212.24 },
  "methyl salicylate": { cas: "119-36-8", smiles: "COC(=O)C1=CC=CC=C1O", formula: "C8H8O3", molecularWeight: 152.15 },
  "salicylate de méthyle": { cas: "119-36-8", smiles: "COC(=O)C1=CC=CC=C1O", formula: "C8H8O3", molecularWeight: 152.15 },
  "ethyl acetate": { cas: "141-78-6", smiles: "CC(=O)OCC", formula: "C4H8O2", molecularWeight: 88.11 },
  "acétate d'éthyle": { cas: "141-78-6", smiles: "CC(=O)OCC", formula: "C4H8O2", molecularWeight: 88.11 },
  "isoamyl acetate": { cas: "123-92-2", smiles: "CC(C)CCOC(=O)C", formula: "C7H14O2", molecularWeight: 130.18 },
  "acétate d'isoamyle": { cas: "123-92-2", smiles: "CC(C)CCOC(=O)C", formula: "C7H14O2", molecularWeight: 130.18 },
  "ethyl hexanoate": { cas: "123-66-0", smiles: "CCCCCC(=O)OCC", formula: "C8H16O2", molecularWeight: 144.21 },
  "hexanoate d'éthyle": { cas: "123-66-0", smiles: "CCCCCC(=O)OCC", formula: "C8H16O2", molecularWeight: 144.21 },
  
  // === OXYDES ===
  "1,8-cineole": { cas: "470-82-6", smiles: "CC1(C)C2CCC(C)(O2)CC1", formula: "C10H18O", molecularWeight: 154.25 },
  "1,8-cinéole": { cas: "470-82-6", smiles: "CC1(C)C2CCC(C)(O2)CC1", formula: "C10H18O", molecularWeight: 154.25 },
  "eucalyptol": { cas: "470-82-6", smiles: "CC1(C)C2CCC(C)(O2)CC1", formula: "C10H18O", molecularWeight: 154.25 },
  "linalool oxide": { cas: "60047-17-8", smiles: "CC(C)=CCCC1(C)OC1C=C", formula: "C10H18O2", molecularWeight: 170.25 },
  "oxyde de linalol": { cas: "60047-17-8", smiles: "CC(C)=CCCC1(C)OC1C=C", formula: "C10H18O2", molecularWeight: 170.25 },
  "rose oxide": { cas: "16409-43-1", smiles: "CC(C)C1CCC(C)(O)CC1", formula: "C10H18O", molecularWeight: 154.25 },
  "oxyde de rose": { cas: "16409-43-1", smiles: "CC(C)C1CCC(C)(O)CC1", formula: "C10H18O", molecularWeight: 154.25 },
  
  // === HÉTÉROCYCLIQUES ===
  "indole": { cas: "120-72-9", smiles: "C1=CC=C2C(=C1)C=CN2", formula: "C8H7N", molecularWeight: 117.15 },
  "skatole": { cas: "83-34-1", smiles: "CC1=CNC2=CC=CC=C12", formula: "C9H9N", molecularWeight: 131.17 },
  "pyrazine": { cas: "290-37-9", smiles: "C1=CN=CC=N1", formula: "C4H4N2", molecularWeight: 80.09 },
  "coumarin": { cas: "91-64-5", smiles: "O=C1OC2=CC=CC=C2C=C1", formula: "C9H6O2", molecularWeight: 146.14 },
  "coumarine": { cas: "91-64-5", smiles: "O=C1OC2=CC=CC=C2C=C1", formula: "C9H6O2", molecularWeight: 146.14 },
  "quinoline": { cas: "91-22-5", smiles: "C1=CC2=NC=CC=C2C=C1", formula: "C9H7N", molecularWeight: 129.16 },
  "isoquinoline": { cas: "119-65-3", smiles: "C1=CC2=CN=CC=C2C=C1", formula: "C9H7N", molecularWeight: 129.16 },
  "furan": { cas: "110-00-9", smiles: "C1=COC=C1", formula: "C4H4O", molecularWeight: 68.07 },
  "thiophene": { cas: "110-02-1", smiles: "C1=CSC=C1", formula: "C4H4S", molecularWeight: 84.14 },
  "pyridine": { cas: "110-86-1", smiles: "C1=CC=NC=C1", formula: "C5H5N", molecularWeight: 79.10 },
  
  // === MUSCS ===
  "muscone": { cas: "541-91-3", smiles: "CC(CCCCCCCCCCCCC1)C1=O", formula: "C16H30O", molecularWeight: 238.41 },
  "ambroxan": { cas: "6790-58-5", smiles: "CC12CCCC(C)(C1CCC3C2(CCCO3)C)O", formula: "C16H28O", molecularWeight: 236.39 },
  "galaxolide": { cas: "1222-05-5", smiles: "CC1(C)CC2=CC(C(C)C)=C(OCC(C)(C)C2)C=C1", formula: "C18H26O", molecularWeight: 258.40 },
  "musk ketone": { cas: "81-14-1", smiles: "CC1=C(C(=C(C(=C1[N+](=O)[O-])C)C(C)(C)C)[N+](=O)[O-])C=O", formula: "C14H18N2O5", molecularWeight: 294.30 },
  "ethylene brassylate": { cas: "105-95-3", smiles: "O=C(CCCCCCCCCCC(=O)OCCO)O", formula: "C15H26O4", molecularWeight: 286.37 },
  
  // === LACTONES ===
  "gamma-decalactone": { cas: "706-14-9", smiles: "CCCCCCC1CCC(=O)O1", formula: "C10H18O2", molecularWeight: 170.25 },
  "γ-décalactone": { cas: "706-14-9", smiles: "CCCCCCC1CCC(=O)O1", formula: "C10H18O2", molecularWeight: 170.25 },
  "gamma-undecalactone": { cas: "104-67-6", smiles: "CCCCCCCC1CCC(=O)O1", formula: "C11H20O2", molecularWeight: 184.28 },
  "γ-undécalactone": { cas: "104-67-6", smiles: "CCCCCCCC1CCC(=O)O1", formula: "C11H20O2", molecularWeight: 184.28 },
  "gamma-octalactone": { cas: "104-50-7", smiles: "CCCCC1CCC(=O)O1", formula: "C8H14O2", molecularWeight: 142.20 },
  "γ-octalactone": { cas: "104-50-7", smiles: "CCCCC1CCC(=O)O1", formula: "C8H14O2", molecularWeight: 142.20 },
  "gamma-nonalactone": { cas: "104-61-0", smiles: "CCCCCC1CCC(=O)O1", formula: "C9H16O2", molecularWeight: 156.22 },
  "γ-nonalactone": { cas: "104-61-0", smiles: "CCCCCC1CCC(=O)O1", formula: "C9H16O2", molecularWeight: 156.22 },
  "delta-decalactone": { cas: "705-86-2", smiles: "CCCCCC1CCCC(=O)O1", formula: "C10H18O2", molecularWeight: 170.25 },
  "δ-décalactone": { cas: "705-86-2", smiles: "CCCCCC1CCCC(=O)O1", formula: "C10H18O2", molecularWeight: 170.25 },
  "whiskey lactone": { cas: "39212-23-2", smiles: "CCC(C)C1CCCC(=O)O1", formula: "C9H16O2", molecularWeight: 156.22 },
  "massoia lactone": { cas: "54814-64-1", smiles: "CCCCC=CC1CCC(=O)O1", formula: "C10H16O2", molecularWeight: 168.23 },
  "jasmine lactone": { cas: "25524-95-2", smiles: "CCC=CCC1CCC(=O)O1", formula: "C10H16O2", molecularWeight: 168.23 },
  "sotolon": { cas: "28664-35-9", smiles: "CC1=C(C)C(=O)OC1O", formula: "C6H8O3", molecularWeight: 128.13 },
  "sotolone": { cas: "28664-35-9", smiles: "CC1=C(C)C(=O)OC1O", formula: "C6H8O3", molecularWeight: 128.13 },
  "furaneol": { cas: "3658-77-3", smiles: "CC1=C(O)C(=O)OC1C", formula: "C6H8O3", molecularWeight: 128.13 },
  "furanéol": { cas: "3658-77-3", smiles: "CC1=C(O)C(=O)OC1C", formula: "C6H8O3", molecularWeight: 128.13 },
  
  // === AUTRES COMPOSÉS ===
  "geosmin": { cas: "19700-21-1", smiles: "CC1CCCC2(C1CCC(C2)O)C", formula: "C12H22O", molecularWeight: 182.30 },
  "géosmine": { cas: "19700-21-1", smiles: "CC1CCCC2(C1CCC(C2)O)C", formula: "C12H22O", molecularWeight: 182.30 },
  "anethole": { cas: "104-46-1", smiles: "COC1=CC=C(C=CC)C=C1", formula: "C10H12O", molecularWeight: 148.20 },
  "anéthol": { cas: "104-46-1", smiles: "COC1=CC=C(C=CC)C=C1", formula: "C10H12O", molecularWeight: 148.20 },
  "estragole": { cas: "140-67-0", smiles: "COC1=CC=C(CC=C)C=C1", formula: "C10H12O", molecularWeight: 148.20 },
  "safrole": { cas: "94-59-7", smiles: "C=CCC1=CC2=C(C=C1)OCO2", formula: "C10H10O2", molecularWeight: 162.19 },
  "methyleugenol": { cas: "93-15-2", smiles: "COC1=CC(CC=C)=CC=C1OC", formula: "C11H14O2", molecularWeight: 178.23 },
  "méthyleugénol": { cas: "93-15-2", smiles: "COC1=CC(CC=C)=CC=C1OC", formula: "C11H14O2", molecularWeight: 178.23 },
  "elemicin": { cas: "487-11-6", smiles: "COC1=CC(CC=C)=CC(OC)=C1OC", formula: "C12H16O3", molecularWeight: 208.25 },
  "élémicine": { cas: "487-11-6", smiles: "COC1=CC(CC=C)=CC(OC)=C1OC", formula: "C12H16O3", molecularWeight: 208.25 },
  "myristicin": { cas: "607-91-0", smiles: "COC1=CC(CC=C)=CC2=C1OCO2", formula: "C11H12O3", molecularWeight: 192.21 },
  "myristicine": { cas: "607-91-0", smiles: "COC1=CC(CC=C)=CC2=C1OCO2", formula: "C11H12O3", molecularWeight: 192.21 },
  "apiole": { cas: "523-80-8", smiles: "COC1=C(OC)C2=C(OCO2)C=C1CC=C", formula: "C12H14O4", molecularWeight: 222.24 },
  "apiol": { cas: "523-80-8", smiles: "COC1=C(OC)C2=C(OCO2)C=C1CC=C", formula: "C12H14O4", molecularWeight: 222.24 },
  
  // === ALCOOLS AROMATIQUES ===
  "benzyl alcohol": { cas: "100-51-6", smiles: "OCC1=CC=CC=C1", formula: "C7H8O", molecularWeight: 108.14 },
  "alcool benzylique": { cas: "100-51-6", smiles: "OCC1=CC=CC=C1", formula: "C7H8O", molecularWeight: 108.14 },
  "phenethyl alcohol": { cas: "60-12-8", smiles: "OCCC1=CC=CC=C1", formula: "C8H10O", molecularWeight: 122.16 },
  "alcool phényléthylique": { cas: "60-12-8", smiles: "OCCC1=CC=CC=C1", formula: "C8H10O", molecularWeight: 122.16 },
  "cinnamyl alcohol": { cas: "104-54-1", smiles: "OCC=CC1=CC=CC=C1", formula: "C9H10O", molecularWeight: 134.18 },
  "alcool cinnamique": { cas: "104-54-1", smiles: "OCC=CC1=CC=CC=C1", formula: "C9H10O", molecularWeight: 134.18 },
  
  // === COUMARINES ===
  "herniarin": { cas: "531-59-9", smiles: "COC1=CC2=C(C=C1)C=CC(=O)O2", formula: "C10H8O3", molecularWeight: 176.17 },
  "herniarine": { cas: "531-59-9", smiles: "COC1=CC2=C(C=C1)C=CC(=O)O2", formula: "C10H8O3", molecularWeight: 176.17 },
  "umbelliferone": { cas: "93-35-6", smiles: "OC1=CC2=C(C=C1)C=CC(=O)O2", formula: "C9H6O3", molecularWeight: 162.14 },
  "ombelliférone": { cas: "93-35-6", smiles: "OC1=CC2=C(C=C1)C=CC(=O)O2", formula: "C9H6O3", molecularWeight: 162.14 },
  "scopoletin": { cas: "92-61-5", smiles: "COC1=CC2=C(C=C1O)C=CC(=O)O2", formula: "C10H8O4", molecularWeight: 192.17 },
  "scopolétine": { cas: "92-61-5", smiles: "COC1=CC2=C(C=C1O)C=CC(=O)O2", formula: "C10H8O4", molecularWeight: 192.17 },
  "bergaptene": { cas: "484-20-8", smiles: "COC1=C2OC(=O)C=CC2=CC3=C1OC=C3", formula: "C12H8O4", molecularWeight: 216.19 },
  "bergaptène": { cas: "484-20-8", smiles: "COC1=C2OC(=O)C=CC2=CC3=C1OC=C3", formula: "C12H8O4", molecularWeight: 216.19 },
  
  // === DITERPÈNES ===
  "phytol": { cas: "150-86-7", smiles: "CC(C)CCCC(C)CCCC(C)CCCC(C)=CCO", formula: "C20H40O", molecularWeight: 296.53 },
  "sclareol": { cas: "515-03-7", smiles: "CC1(C)CCCC2(C)C1CCC3(C)C(O)C(O)CCC23", formula: "C20H36O2", molecularWeight: 308.50 },
  "sclaréol": { cas: "515-03-7", smiles: "CC1(C)CCCC2(C)C1CCC3(C)C(O)C(O)CCC23", formula: "C20H36O2", molecularWeight: 308.50 },
  "manool": { cas: "596-85-0", smiles: "CC1(C)CCCC2(C)C1CCC3(C)C(O)C=CCC23", formula: "C20H34O", molecularWeight: 290.48 },
  
  // === CANNABINOÏDES ===
  "cannabidiol": { cas: "13956-29-1", smiles: "CCCCCC1=CC(O)=C(C2C=C(C)CCC2C(C)=C)C(O)=C1", formula: "C21H30O2", molecularWeight: 314.46 },
  "cbd": { cas: "13956-29-1", smiles: "CCCCCC1=CC(O)=C(C2C=C(C)CCC2C(C)=C)C(O)=C1", formula: "C21H30O2", molecularWeight: 314.46 },
  "cannabigerol": { cas: "25654-31-3", smiles: "CCCCCC1=CC(O)=C(CC=C(C)CCC=C(C)C)C(O)=C1", formula: "C21H32O2", molecularWeight: 316.48 },
  "cbg": { cas: "25654-31-3", smiles: "CCCCCC1=CC(O)=C(CC=C(C)CCC=C(C)C)C(O)=C1", formula: "C21H32O2", molecularWeight: 316.48 },
  
  // === COMPOSÉS SOUFRÉS ===
  "dimethyl sulfide": { cas: "75-18-3", smiles: "CSC", formula: "C2H6S", molecularWeight: 62.13 },
  "sulfure de diméthyle": { cas: "75-18-3", smiles: "CSC", formula: "C2H6S", molecularWeight: 62.13 },
  "dimethyl disulfide": { cas: "624-92-0", smiles: "CSSC", formula: "C2H6S2", molecularWeight: 94.20 },
  "disulfure de diméthyle": { cas: "624-92-0", smiles: "CSSC", formula: "C2H6S2", molecularWeight: 94.20 },
  "allicin": { cas: "539-86-6", smiles: "C=CCSS(=O)CC=C", formula: "C6H10OS2", molecularWeight: 162.27 },
  "allicine": { cas: "539-86-6", smiles: "C=CCSS(=O)CC=C", formula: "C6H10OS2", molecularWeight: 162.27 },
  "diallyl disulfide": { cas: "2179-57-9", smiles: "C=CCSSCC=C", formula: "C6H10S2", molecularWeight: 146.27 },
  "disulfure de diallyle": { cas: "2179-57-9", smiles: "C=CCSSCC=C", formula: "C6H10S2", molecularWeight: 146.27 },
  
  // === COMPOSÉS AZOTÉS ===
  "trimethylamine": { cas: "75-50-3", smiles: "CN(C)C", formula: "C3H9N", molecularWeight: 59.11 },
  "triméthylamine": { cas: "75-50-3", smiles: "CN(C)C", formula: "C3H9N", molecularWeight: 59.11 },
  "2-acetylpyridine": { cas: "1122-62-9", smiles: "CC(=O)C1=NC=CC=C1", formula: "C7H7NO", molecularWeight: 121.14 },
  "2-acétylpyridine": { cas: "1122-62-9", smiles: "CC(=O)C1=NC=CC=C1", formula: "C7H7NO", molecularWeight: 121.14 },
  
  // === PYRAZINES ===
  "2,3,5-trimethylpyrazine": { cas: "14667-55-1", smiles: "CC1=NC(C)=C(C)N=C1", formula: "C7H10N2", molecularWeight: 122.17 },
  "2,3,5-triméthylpyrazine": { cas: "14667-55-1", smiles: "CC1=NC(C)=C(C)N=C1", formula: "C7H10N2", molecularWeight: 122.17 },
  "2-methoxy-3-isobutylpyrazine": { cas: "24683-00-9", smiles: "CC(C)CC1=NC(OC)=CN=C1", formula: "C9H14N2O", molecularWeight: 166.22 },
  "2-méthoxy-3-isobutylpyrazine": { cas: "24683-00-9", smiles: "CC(C)CC1=NC(OC)=CN=C1", formula: "C9H14N2O", molecularWeight: 166.22 },
  
  // === FLAVONOÏDES ===
  "quercetin": { cas: "117-39-5", smiles: "OC1=CC(O)=C2C(=O)C(O)=C(OC2=C1)C3=CC(O)=C(O)C=C3", formula: "C15H10O7", molecularWeight: 302.24 },
  "quercétine": { cas: "117-39-5", smiles: "OC1=CC(O)=C2C(=O)C(O)=C(OC2=C1)C3=CC(O)=C(O)C=C3", formula: "C15H10O7", molecularWeight: 302.24 },
  "kaempferol": { cas: "520-18-3", smiles: "OC1=CC(O)=C2C(=O)C(O)=C(OC2=C1)C3=CC=C(O)C=C3", formula: "C15H10O6", molecularWeight: 286.24 },
  "kaempférol": { cas: "520-18-3", smiles: "OC1=CC(O)=C2C(=O)C(O)=C(OC2=C1)C3=CC=C(O)C=C3", formula: "C15H10O6", molecularWeight: 286.24 },
  "apigenin": { cas: "520-36-5", smiles: "OC1=CC(O)=C2C(=O)C=C(OC2=C1)C3=CC=C(O)C=C3", formula: "C15H10O5", molecularWeight: 270.24 },
  "apigénine": { cas: "520-36-5", smiles: "OC1=CC(O)=C2C(=O)C=C(OC2=C1)C3=CC=C(O)C=C3", formula: "C15H10O5", molecularWeight: 270.24 },
  "luteolin": { cas: "491-70-3", smiles: "OC1=CC(O)=C2C(=O)C=C(OC2=C1)C3=CC(O)=C(O)C=C3", formula: "C15H10O6", molecularWeight: 286.24 },
  "lutéoline": { cas: "491-70-3", smiles: "OC1=CC(O)=C2C(=O)C=C(OC2=C1)C3=CC(O)=C(O)C=C3", formula: "C15H10O6", molecularWeight: 286.24 },
  
  // === ACIDES ORGANIQUES ===
  "rosmarinic acid": { cas: "20283-92-5", smiles: "OC(=O)C(CC1=CC(O)=C(O)C=C1)OC(=O)C=CC2=CC(O)=C(O)C=C2", formula: "C18H16O8", molecularWeight: 360.31 },
  "acide rosmarinique": { cas: "20283-92-5", smiles: "OC(=O)C(CC1=CC(O)=C(O)C=C1)OC(=O)C=CC2=CC(O)=C(O)C=C2", formula: "C18H16O8", molecularWeight: 360.31 },
  "carnosic acid": { cas: "3650-09-7", smiles: "CC(C)C1=CC2=C(C(O)=C1O)C3(C)CCCC(C)(C)C3CC2", formula: "C20H28O4", molecularWeight: 332.43 },
  "acide carnosique": { cas: "3650-09-7", smiles: "CC(C)C1=CC2=C(C(O)=C1O)C3(C)CCCC(C)(C)C3CC2", formula: "C20H28O4", molecularWeight: 332.43 },
  "caffeic acid": { cas: "331-39-5", smiles: "OC(=O)C=CC1=CC(O)=C(O)C=C1", formula: "C9H8O4", molecularWeight: 180.16 },
  "acide caféique": { cas: "331-39-5", smiles: "OC(=O)C=CC1=CC(O)=C(O)C=C1", formula: "C9H8O4", molecularWeight: 180.16 },
  "ferulic acid": { cas: "1135-24-6", smiles: "COC1=CC(C=CC(=O)O)=CC=C1O", formula: "C10H10O4", molecularWeight: 194.18 },
  "acide férulique": { cas: "1135-24-6", smiles: "COC1=CC(C=CC(=O)O)=CC=C1O", formula: "C10H10O4", molecularWeight: 194.18 },
  "coumaric acid": { cas: "7400-08-0", smiles: "OC(=O)C=CC1=CC=C(O)C=C1", formula: "C9H8O3", molecularWeight: 164.16 },
  "acide coumarique": { cas: "7400-08-0", smiles: "OC(=O)C=CC1=CC=C(O)C=C1", formula: "C9H8O3", molecularWeight: 164.16 },
};

/**
 * Enrichit les molécules avec SMILES et CAS depuis la base de référence
 */
export async function enrichSmilesAndCas(dryRun = true) {
  const db = await getDb();
  if (!db) return { error: "Database not available" };
  
  const results: {
    smilesUpdated: string[];
    casUpdated: string[];
    notFound: string[];
    errors: string[];
  } = {
    smilesUpdated: [],
    casUpdated: [],
    notFound: [],
    errors: []
  };
  
  // Récupérer les molécules sans SMILES ou sans CAS
  const moleculesToEnrich = await db
    .select()
    .from(molecules)
    .where(
      or(
        isNull(molecules.smiles),
        sql`${molecules.smiles} = ''`,
        isNull(molecules.casNumber),
        sql`${molecules.casNumber} = ''`
      )
    );
  
  for (const mol of moleculesToEnrich) {
    const nameLower = mol.name.toLowerCase().trim();
    const refData = MOLECULE_REFERENCE_DATA[nameLower];
    
    if (refData) {
      const updates: any = {};
      let hasUpdates = false;
      
      // Vérifier si SMILES doit être mis à jour
      if (!mol.smiles || mol.smiles === '') {
        updates.smiles = refData.smiles;
        hasUpdates = true;
        results.smilesUpdated.push(`${mol.name} (ID ${mol.id})`);
      }
      
      // Vérifier si CAS doit être mis à jour
      if ((!mol.casNumber || mol.casNumber === '') && refData.cas) {
        updates.casNumber = refData.cas;
        hasUpdates = true;
        results.casUpdated.push(`${mol.name} (ID ${mol.id}): ${refData.cas}`);
      }
      
      // Mettre à jour la formule si manquante
      if (!mol.chemicalFormula || mol.chemicalFormula === '') {
        updates.chemicalFormula = refData.formula;
      }
      
      // Mettre à jour le poids moléculaire si manquant
      if (!mol.molecularWeight) {
        updates.molecularWeight = Math.round(refData.molecularWeight);
      }
      
      if (hasUpdates && !dryRun) {
        try {
          await db
            .update(molecules)
            .set(updates)
            .where(eq(molecules.id, mol.id));
        } catch (error) {
          results.errors.push(`Error updating ${mol.name}: ${error}`);
        }
      }
    } else {
      results.notFound.push(mol.name);
    }
  }
  
  return {
    dryRun,
    totalToEnrich: moleculesToEnrich.length,
    smilesUpdated: results.smilesUpdated.length,
    casUpdated: results.casUpdated.length,
    notFound: results.notFound.length,
    errors: results.errors.length,
    details: results,
    summary: `${results.smilesUpdated.length} SMILES et ${results.casUpdated.length} CAS ${dryRun ? 'seraient' : 'ont été'} enrichis`
  };
}

/**
 * Prévisualise l'enrichissement SMILES et CAS
 */
export async function previewSmilesAndCasEnrichment() {
  return enrichSmilesAndCas(true);
}

/**
 * Exécute l'enrichissement SMILES et CAS
 */
export async function executeSmilesAndCasEnrichment() {
  return enrichSmilesAndCas(false);
}
