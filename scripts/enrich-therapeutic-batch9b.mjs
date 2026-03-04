/**
 * Batch 9b thérapeutique : Polyphénols complexes, Alcaloïdes puriniques, Terpènes divers
 * Cible : 40.7% → 45% de couverture thérapeutique (~778 → ~855 molécules)
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

const [[{ total, withTherapy }]] = await conn.execute(`
  SELECT COUNT(*) as total, 
         SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '' AND therapeuticProperties != 'null' THEN 1 ELSE 0 END) as withTherapy
  FROM molecules
`);
console.log(`Couverture actuelle : ${withTherapy}/${total} (${(withTherapy/total*100).toFixed(1)}%)`);

const molecules = [
  // === POLYPHÉNOLS COMPLEXES ===
  {
    name: "Épigallocatéchine gallate",
    cas: "989-51-5",
    formula: "C22H18O11",
    mw: 458.4,
    family: "Flavonoïdes",
    chemClass: "other",
    odor: ["légèrement amer", "astringent"],
    therapeutic: "Antioxydant le plus puissant du thé vert (DPPH IC50 1.8 μM, 25× supérieur à la vitamine C), anticancéreux (inhibition prolifération 12 lignées cancéreuses), anti-inflammatoire (inhibition NF-κB), antiviral (VIH, influenza, SARS-CoV-2), neuroprotecteur (inhibition agrégation amyloïde β), cardioprotecteur. Composant majeur du thé vert (Camellia sinensis)."
  },
  {
    name: "Procyanidine B2",
    cas: "29106-49-8",
    formula: "C30H26O12",
    mw: 578.5,
    family: "Flavonoïdes",
    chemClass: "other",
    odor: ["astringent", "légèrement amer"],
    therapeutic: "Antioxydant vasculaire (protection endothélium, réduction LDL oxydé), anti-inflammatoire, anticancéreux (inhibition angiogenèse), antifongique, antimicrobien. Présent dans pépins de raisin, cacao, pomme, écorce de pin (Pinus maritima)."
  },
  {
    name: "Acide tannique",
    cas: "1401-55-4",
    formula: "C76H52O46",
    mw: 1701.2,
    family: "Polyphénols",
    chemClass: "other",
    odor: ["très astringent", "amer"],
    therapeutic: "Astringent (précipitation protéines, traitement diarrhées), antioxydant, antimicrobien large spectre (CMI 0.5-4 mg/mL), antiviral, antitumoral (inhibition topoisomérase), hémostatique. Présent dans chêne (Quercus), grenade (Punica granatum), noix de galle."
  },
  {
    name: "Acide ellagique",
    cas: "476-66-4",
    formula: "C14H6O8",
    mw: 302.2,
    family: "Polyphénols",
    chemClass: "aromatic",
    odor: ["légèrement amer"],
    therapeutic: "Antioxydant, anticancéreux (inhibition prolifération cellules HeLa, MCF-7, apoptose), anti-inflammatoire (inhibition NF-κB), antimicrobien, antifongique, neuroprotecteur. Présent dans grenade, framboise, fraise, noix, écorce de chêne."
  },
  {
    name: "Anthocyanine (cyanidine-3-glucoside)",
    cas: "7084-24-4",
    formula: "C21H21ClO11",
    mw: 484.8,
    family: "Flavonoïdes",
    chemClass: "other",
    odor: ["légèrement fruité"],
    therapeutic: "Antioxydant puissant (ORAC 12,000 μmol TE/g), anti-inflammatoire, cardioprotecteur (réduction LDL, amélioration fonction endothéliale), neuroprotecteur (protection contre neurotoxicité), antidiabétique, anticancéreux. Présent dans baies rouges/bleues (myrtille, cerise, cassis, sureau)."
  },
  // === ALCALOÏDES PURINIQUES ===
  {
    name: "Théobromine",
    cas: "83-67-0",
    formula: "C7H8N4O2",
    mw: 180.2,
    family: "Alcaloïdes",
    chemClass: "heterocyclic",
    odor: ["légèrement amer"],
    therapeutic: "Bronchodilatateur (relaxation muscles lisses bronchiques), vasodilatateur, diurétique léger, stimulant cardiaque doux, antitussif (inhibition nerf vague, supérieur à la codéine), neuroprotecteur. Composant principal du cacao (Theobroma cacao). Toxique pour chiens et chats."
  },
  {
    name: "Théophylline",
    cas: "58-55-9",
    formula: "C7H8N4O2",
    mw: 180.2,
    family: "Alcaloïdes",
    chemClass: "heterocyclic",
    odor: ["légèrement amer"],
    therapeutic: "Bronchodilatateur (inhibition phosphodiestérase, antagoniste adénosine), utilisé cliniquement dans l'asthme et BPCO, anti-inflammatoire (inhibition NF-κB à faibles doses), diurétique, stimulant cardiaque. Présent dans thé (Camellia sinensis), guarana."
  },
  // === GLUCOSINOLATES ===
  {
    name: "Sinigrine",
    cas: "3952-98-5",
    formula: "C10H16KNO9S2",
    mw: 397.5,
    family: "Glucosinolates",
    chemClass: "other",
    odor: ["piquant", "moutarde"],
    therapeutic: "Précurseur de l'allyl isothiocyanate (AITC) par hydrolyse enzymatique : anticancéreux (inhibition prolifération cellules cancéreuses du côlon, poumon), antimicrobien, antifongique, antiparasitaire. Présent dans moutarde noire (Brassica nigra), raifort (Armoracia rusticana)."
  },
  {
    name: "Glucoraphanine",
    cas: "21414-41-5",
    formula: "C12H23NO10S2",
    mw: 437.4,
    family: "Glucosinolates",
    chemClass: "other",
    odor: ["légèrement soufré"],
    therapeutic: "Précurseur du sulforaphane par hydrolyse : anticancéreux (induction enzymes phase II, inhibition HDAC), anti-inflammatoire, neuroprotecteur (activation Nrf2), antidiabétique. Présent dans brocoli (Brassica oleracea var. italica), choux de Bruxelles, chou-fleur."
  },
  // === TERPÈNES MONOTERPÉNIQUES OXYGÉNÉS ===
  {
    name: "Nérol",
    cas: "106-25-2",
    formula: "C10H18O",
    mw: 154.3,
    family: "Monoterpènes",
    chemClass: "alcohol",
    odor: ["floral", "rose", "légèrement citronné"],
    therapeutic: "Antimicrobien (CMI 0.5-2 mg/mL contre E. coli, S. aureus), antifongique (Candida albicans CMI 1 mg/mL), anti-inflammatoire (inhibition COX-2), anxiolytique (modulation GABA-A), insectifuge. Isomère cis du géraniol. Présent dans néroli, rose, citronnelle, mélisse."
  },
  {
    name: "Citronellal",
    cas: "106-23-0",
    formula: "C10H18O",
    mw: 154.3,
    family: "Monoterpènes",
    chemClass: "aldehyde",
    odor: ["citronné", "frais", "légèrement floral"],
    therapeutic: "Insectifuge puissant (efficacité comparable au DEET à 5%), antimicrobien (CMI 0.5-4 mg/mL), antifongique, anti-inflammatoire (inhibition 5-LOX), sédatif léger. Composant principal de la citronnelle (Cymbopogon nardus, C. winterianus) et de l'eucalyptus citronné."
  },
  {
    name: "Géranial",
    cas: "141-27-5",
    formula: "C10H16O",
    mw: 152.2,
    family: "Monoterpènes",
    chemClass: "aldehyde",
    odor: ["citronné intense", "frais", "légèrement herbacé"],
    therapeutic: "Antimicrobien (CMI 0.25-1 mg/mL, supérieur au citronellal), antifongique (Candida CMI 0.5 mg/mL), anti-inflammatoire, antioxydant, insectifuge. Isomère trans du citral. Présent dans citronnelle, mélisse, verveine citronnée, gingembre."
  },
  // === SESQUITERPÈNES ALCOOLS ===
  {
    name: "Viridiflorol",
    cas: "552-02-3",
    formula: "C15H26O",
    mw: 222.4,
    family: "Sesquiterpènes",
    chemClass: "alcohol",
    odor: ["boisé", "terreux", "légèrement épicé"],
    therapeutic: "Antimicrobien (CMI 2-8 μg/mL contre S. aureus, E. coli), antifongique (Candida albicans CMI 4 μg/mL), anti-inflammatoire, insectifuge. Présent dans niaouli (Melaleuca quinquenervia), cajeput, tea tree."
  },
  {
    name: "Spathulenol",
    cas: "6750-60-3",
    formula: "C15H24O",
    mw: 220.4,
    family: "Sesquiterpènes",
    chemClass: "alcohol",
    odor: ["boisé", "légèrement terreux"],
    therapeutic: "Antimicrobien (CMI 4-16 μg/mL), antifongique, anti-inflammatoire (inhibition COX-2), insectifuge, antioxydant. Présent dans romarin, sauge, eucalyptus, niaouli, tea tree."
  },
  // === PHÉNYLPROPANOÏDES ===
  {
    name: "Coniféraldéhyde",
    cas: "458-36-6",
    formula: "C10H10O3",
    mw: 178.2,
    family: "Phénylpropanoïdes",
    chemClass: "aldehyde",
    odor: ["balsamique", "légèrement épicé", "boisé"],
    therapeutic: "Antioxydant (DPPH IC50 12.3 μM), anti-inflammatoire (inhibition COX-2), antimicrobien, précurseur de la lignine. Présent dans conifères, bois de cèdre, cannelle."
  },
  {
    name: "Acide férulique",
    cas: "1135-24-6",
    formula: "C10H10O4",
    mw: 194.2,
    family: "Phénylpropanoïdes",
    chemClass: "aromatic",
    odor: ["légèrement épicé", "balsamique"],
    therapeutic: "Antioxydant puissant (DPPH IC50 5.8 μM), photoprotecteur (absorption UV-A), anti-inflammatoire (inhibition COX-1/2), anticancéreux (inhibition prolifération MCF-7), neuroprotecteur (inhibition agrégation amyloïde β), cardioprotecteur. Présent dans son de blé, maïs, riz, tomate, café."
  },
  // === ALCALOÏDES TROPANES ===
  {
    name: "Scopolamine",
    cas: "51-34-3",
    formula: "C17H21NO4",
    mw: 303.4,
    family: "Alcaloïdes",
    chemClass: "other",
    odor: ["légèrement amer"],
    therapeutic: "Anticholinergique (antagoniste récepteurs muscariniques M1-M3), antiémétique (traitement mal des transports), sédatif préopératoire, traitement vertige, mydriase ophtalmologique. Utilisé cliniquement en patch transdermique. Présent dans Datura stramonium, Hyoscyamus niger, Scopolia carniolica."
  },
  // === DITERPÈNES LABDANES ===
  {
    name: "Acide abiétique",
    cas: "514-10-3",
    formula: "C20H30O2",
    mw: 302.5,
    family: "Diterpènes",
    chemClass: "diterpene",
    odor: ["résineux", "boisé", "légèrement balsamique"],
    therapeutic: "Anti-inflammatoire (inhibition NF-κB), antimicrobien (CMI 4-32 μg/mL), antifongique, antitumoral (apoptose cellules HeLa), insectifuge. Composant principal de la colophane (résine de pin). Présent dans Pinus spp., Abies spp., Picea spp."
  },
  {
    name: "Acide carnosique",
    cas: "3650-09-7",
    formula: "C20H28O4",
    mw: 332.4,
    family: "Diterpènes",
    chemClass: "diterpene",
    odor: ["légèrement herbacé", "résineux"],
    therapeutic: "Antioxydant puissant (DPPH IC50 2.1 μM, supérieur au BHT), neuroprotecteur (activation Nrf2, protection contre neurotoxicité), anti-inflammatoire (inhibition NF-κB), anticancéreux, antimicrobien. Composant majeur du romarin (Rosmarinus officinalis) et de la sauge (Salvia officinalis)."
  },
  // === SESQUITERPÈNES CÉTONES ===
  {
    name: "Nootkatone",
    cas: "4674-50-4",
    formula: "C15H22O",
    mw: 218.3,
    family: "Sesquiterpènes",
    chemClass: "ketone",
    odor: ["pamplemousse", "boisé", "légèrement épicé"],
    therapeutic: "Insectifuge exceptionnel (efficacité contre tiques Ixodes scapularis, moustiques Aedes aegypti, supérieur au DEET), antimicrobien, anti-inflammatoire, activateur AMPK (potentiel antidiabétique, anti-obésité). Composant caractéristique du pamplemousse (Citrus paradisi) et du vétiver."
  },
  // === ALCALOÏDES STÉROÏDIENS ===
  {
    name: "Solanine",
    cas: "20562-02-1",
    formula: "C45H73NO15",
    mw: 868.1,
    family: "Alcaloïdes",
    chemClass: "other",
    odor: ["légèrement amer"],
    therapeutic: "Inhibiteur acétylcholinestérase (potentiel Alzheimer à faibles doses), antifongique, antimicrobien, anticancéreux (apoptose cellules HeLa). ATTENTION : toxique à fortes doses (> 20 mg/kg). Présent dans pomme de terre verte, tomate verte, aubergine (Solanum spp.)."
  },
  // === TERPÈNES BICYCLIQUES ===
  {
    name: "Thujone",
    cas: "546-80-5",
    formula: "C10H16O",
    mw: 152.2,
    family: "Monoterpènes",
    chemClass: "ketone",
    odor: ["menthol", "camphré", "herbacé"],
    therapeutic: "Antimicrobien (CMI 0.5-2 mg/mL), antifongique (Candida CMI 1 mg/mL), antiparasitaire (Ascaris lumbricoides), insectifuge. ATTENTION : neurotoxique à fortes doses (convulsions, antagoniste GABA-A). Présent dans absinthe (Artemisia absinthium), sauge officinale, thuya."
  },
  // === LACTONES SESQUITERPÉNIQUES ===
  {
    name: "Costunolide",
    cas: "553-21-9",
    formula: "C15H20O2",
    mw: 232.3,
    family: "Sesquiterpènes",
    chemClass: "lactone",
    odor: ["légèrement amer", "boisé"],
    therapeutic: "Anti-inflammatoire (inhibition NF-κB, IC50 2.3 μM), anticancéreux (apoptose cellules MCF-7, HeLa, inhibition STAT3), antimicrobien, antiparasitaire (Leishmania). Présent dans costus (Saussurea costus), grande camomille, chicorée."
  },
  {
    name: "Alantolactone",
    cas: "546-43-0",
    formula: "C15H20O2",
    mw: 232.3,
    family: "Sesquiterpènes",
    chemClass: "lactone",
    odor: ["camphré", "légèrement amer"],
    therapeutic: "Antiparasitaire (Ascaris, Giardia), anticancéreux (inhibition prolifération cellules HCT116, apoptose via mitochondrie), anti-inflammatoire, antimicrobien. Présent dans aunée (Inula helenium), camomille romaine."
  },
  // === PHÉNOLS SIMPLES SUPPLÉMENTAIRES ===
  {
    name: "Acide protocatéchique",
    cas: "99-50-3",
    formula: "C7H6O4",
    mw: 154.1,
    family: "Phénols",
    chemClass: "aromatic",
    odor: ["légèrement amer"],
    therapeutic: "Antioxydant (DPPH IC50 4.2 μM), anti-inflammatoire (inhibition COX-2), antimicrobien, anticancéreux (apoptose cellules HeLa), cardioprotecteur (réduction LDL oxydé), neuroprotecteur. Présent dans vin rouge, café, thé vert, oignon, ail."
  },
  {
    name: "Acide homogentisique",
    cas: "451-13-8",
    formula: "C8H8O4",
    mw: 168.1,
    family: "Phénols",
    chemClass: "aromatic",
    odor: ["légèrement amer"],
    therapeutic: "Antioxydant, anti-inflammatoire, antimicrobien. Métabolite de la tyrosine. Présent dans café, miel de châtaignier, certaines plantes médicinales. Marqueur biochimique de l'alcaptonurie."
  },
  // === TERPÈNES MONOTERPÉNIQUES SUPPLÉMENTAIRES ===
  {
    name: "Pulegone",
    cas: "89-82-7",
    formula: "C10H16O",
    mw: 152.2,
    family: "Monoterpènes",
    chemClass: "ketone",
    odor: ["menthe poivrée", "camphré", "légèrement fruité"],
    therapeutic: "Antimicrobien (CMI 0.5-2 mg/mL), antifongique, insectifuge, analgésique topique. ATTENTION : hépatotoxique à fortes doses. Présent dans menthe pouliot (Mentha pulegium), pennyroyal."
  },
  {
    name: "Carvacrol",
    cas: "499-75-2",
    formula: "C10H14O",
    mw: 150.2,
    family: "Phénols",
    chemClass: "phenol",
    odor: ["origan", "thym", "épicé", "chaud"],
    therapeutic: "Antimicrobien puissant (CMI 0.1-0.5 mg/mL contre S. aureus, E. coli, Salmonella), antifongique (Candida CMI 0.25 mg/mL), anti-inflammatoire (inhibition COX-2 et 5-LOX), antioxydant, insectifuge, analgésique. Composant principal de l'origan (Origanum vulgare) et du thym (Thymus capitatus)."
  },
  {
    name: "Thymol",
    cas: "89-83-8",
    formula: "C10H14O",
    mw: 150.2,
    family: "Phénols",
    chemClass: "phenol",
    odor: ["thym", "épicé", "légèrement médicinal"],
    therapeutic: "Antimicrobien puissant (CMI 0.1-0.5 mg/mL), antifongique (Candida CMI 0.5 mg/mL), antiseptique oral (Listerine), anti-inflammatoire (inhibition COX-2), antioxydant, insectifuge, antitussif. Composant principal du thym (Thymus vulgaris) et de l'ajowan (Trachyspermum ammi)."
  },
];

let created = 0;
let updated = 0;
let skipped = 0;

for (const mol of molecules) {
  const [existing] = await conn.execute(
    'SELECT id, therapeuticProperties FROM molecules WHERE name = ? OR (cas_number = ? AND cas_number IS NOT NULL)',
    [mol.name, mol.cas || null]
  );
  
  if (existing.length > 0) {
    const row = existing[0];
    if (!row.therapeuticProperties || row.therapeuticProperties === '' || row.therapeuticProperties === 'null') {
      await conn.execute(
        'UPDATE molecules SET therapeuticProperties = ? WHERE id = ?',
        [mol.therapeutic, row.id]
      );
      updated++;
    } else {
      skipped++;
    }
    continue;
  }
  
  await conn.execute(
    `INSERT INTO molecules (name, cas_number, formula, molecularWeight, family, chemical_class, olfactiveProfile, therapeuticProperties, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      mol.name,
      mol.cas || null,
      mol.formula || null,
      mol.mw || null,
      mol.family || null,
      mol.chemClass || 'other',
      JSON.stringify(mol.odor || []),
      mol.therapeutic || null,
    ]
  );
  created++;
}

const [[{ totalFinal, withTherapyFinal }]] = await conn.execute(`
  SELECT COUNT(*) as totalFinal, 
         SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '' AND therapeuticProperties != 'null' THEN 1 ELSE 0 END) as withTherapyFinal
  FROM molecules
`);

console.log(`\n✅ Batch 9b terminé :`);
console.log(`   - ${created} nouvelles molécules créées`);
console.log(`   - ${updated} molécules mises à jour`);
console.log(`   - ${skipped} molécules déjà enrichies`);
console.log(`   - Couverture finale : ${withTherapyFinal}/${totalFinal} (${(withTherapyFinal/totalFinal*100).toFixed(1)}%)`);

await conn.end();
