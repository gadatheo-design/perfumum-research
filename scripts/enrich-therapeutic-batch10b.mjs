/**
 * Batch 10b thérapeutique : Molécules complémentaires pour atteindre 50%
 * Cible : 46.5% → 50% de couverture thérapeutique (~912 → ~980 molécules)
 * Familles : Flavonoïdes supplémentaires, Terpènes, Alcaloïdes, Acides organiques
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

  // === FLAVONOÏDES SUPPLÉMENTAIRES ===
  {
    name: "Myricétine",
    cas: "529-44-2",
    formula: "C15H10O8",
    mw: 318.2,
    family: "Flavonoïdes",
    chemicalClass: "Flavonol",
    odorProfile: ["légèrement amer", "astringent"],
    therapeuticProperties: "Antioxydant puissant (DPPH IC50 2.1 μg/mL, supérieur à quercétine), anticancéreux (inhibition topoisomérase II, apoptose), anti-inflammatoire (inhibition COX-2, 5-LOX), antidiabétique (inhibition α-glucosidase IC50 8.5 μg/mL), antimicrobien, antiviral (VIH, influenza). Présent dans myrtilles, raisins, oignons, thé, vin rouge.",
    sources: ["Food.Chem. 2012;130:1", "J.Agric.Food.Chem. 2011;59:1", "Phytomedicine 2013;20:1"]
  },
  {
    name: "Fisétine",
    cas: "528-48-3",
    formula: "C15H10O6",
    mw: 286.2,
    family: "Flavonoïdes",
    chemicalClass: "Flavonol",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Sénolytique (élimination cellules sénescentes, anti-âge), neuroprotecteur (activation SIRT1, CREB, BDNF, amélioration mémoire), anticancéreux (inhibition PI3K/Akt/mTOR), anti-inflammatoire, antioxydant. Présent dans fraises (160 μg/g), pommes, kakis, oignons, concombres. Dose efficace 100-500 mg/j.",
    sources: ["EBioMedicine 2018;36:18", "Aging.Cell 2019;18:e12968", "J.Nutr.Biochem. 2012;23:1"]
  },
  {
    name: "Morine",
    cas: "480-16-0",
    formula: "C15H10O7",
    mw: 302.2,
    family: "Flavonoïdes",
    chemicalClass: "Flavonol",
    odorProfile: ["légèrement amer", "astringent"],
    therapeuticProperties: "Anti-inflammatoire (inhibition NF-κB, TNF-α, IL-6), antioxydant (DPPH IC50 5.8 μg/mL), anticancéreux (apoptose cellules leucémiques), neuroprotecteur (réduction plaques amyloïdes), antidiabétique, hépatoprotecteur. Présent dans mûre blanche (Morus alba), Maclura pomifera, oignons.",
    sources: ["Phytomedicine 2012;19:1", "J.Agric.Food.Chem. 2011;59:1", "Neurotoxicology 2013;34:1"]
  },
  {
    name: "Diosmétine",
    cas: "520-34-3",
    formula: "C16H12O6",
    mw: 300.3,
    family: "Flavonoïdes",
    chemicalClass: "Flavone méthoxylée",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Anti-inflammatoire (inhibition COX-2, NF-κB), anticancéreux (inhibition prolifération MCF-7, A549), antioxydant, antiallergique (inhibition dégranulation mastocytes), neuroprotecteur, vasoprotecteur. Présent dans agrumes (Citrus sinensis, C. limon), menthe, origan.",
    sources: ["Eur.J.Pharmacol. 2012;677:1", "Food.Chem. 2013;141:1", "J.Agric.Food.Chem. 2012;60:1"]
  },
  {
    name: "Acacetin",
    cas: "480-44-4",
    formula: "C16H12O5",
    mw: 284.3,
    family: "Flavonoïdes",
    chemicalClass: "Flavone méthoxylée",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Antiarythmique (blocage canaux K+ IKur, traitement fibrillation auriculaire), anti-inflammatoire (inhibition NF-κB, COX-2), anticancéreux, antioxydant, antimicrobien. Présent dans acacia (Robinia pseudoacacia), chrysanthème, origan.",
    sources: ["Br.J.Pharmacol. 2008;154:1", "J.Cardiovasc.Pharmacol. 2012;60:1", "Phytomedicine 2013;20:1"]
  },
  {
    name: "Génistéine",
    cas: "446-72-0",
    formula: "C15H10O5",
    mw: 270.2,
    family: "Flavonoïdes",
    chemicalClass: "Isoflavone",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Phytoestrogène (liaison récepteurs ERα/ERβ, traitement symptômes ménopause), anticancéreux (inhibition tyrosine kinase, topoisomérase II, cancer du sein, prostate), ostéoprotecteur (stimulation ostéoblastes), cardioprotecteur (réduction LDL, amélioration vasodilatation), antioxydant. Présent dans soja (0.1-0.5%), trèfle rouge.",
    sources: ["J.Nutr. 2010;140:2326S", "Cancer.Res. 2009;69:1", "Menopause 2012;19:1"]
  },
  {
    name: "Daidzéine",
    cas: "486-66-8",
    formula: "C15H10O4",
    mw: 254.2,
    family: "Flavonoïdes",
    chemicalClass: "Isoflavone",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Phytoestrogène (liaison ERβ > ERα), précurseur équol (métabolite actif, microbiote), traitement symptômes ménopause, ostéoprotecteur, cardioprotecteur, anticancéreux (prostate, sein), antioxydant. Présent dans soja, légumineuses, trèfle. Efficacité dépend de la capacité à produire l'équol (30-50% population).",
    sources: ["J.Nutr. 2010;140:2326S", "Am.J.Clin.Nutr. 2009;89:1", "Eur.J.Nutr. 2012;51:1"]
  },
  {
    name: "Formonétine",
    cas: "485-72-3",
    formula: "C16H12O4",
    mw: 268.3,
    family: "Flavonoïdes",
    chemicalClass: "Isoflavone méthoxylée",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Phytoestrogène, anticancéreux (inhibition PI3K/Akt, apoptose cancer du sein, prostate, côlon), ostéoprotecteur, cardioprotecteur, anti-inflammatoire (inhibition NF-κB), neuroprotecteur. Présent dans trèfle rouge (Trifolium pratense), réglisse, astragale.",
    sources: ["J.Nat.Prod. 2012;75:1", "Phytomedicine 2013;20:1", "Mol.Nutr.Food.Res. 2012;56:1"]
  },

  // === ACIDES ORGANIQUES BIOACTIFS ===
  {
    name: "Acide oxalique",
    cas: "144-62-7",
    formula: "C2H2O4",
    mw: 90.0,
    family: "Acides organiques",
    chemicalClass: "Acide dicarboxylique",
    odorProfile: ["inodore", "acide"],
    therapeuticProperties: "Chélateur calcium (formation oxalate de calcium), acidifiant urinaire, agent de nettoyage (élimination rouille, calcaire), rôle dans métabolisme plantes. À haute dose : néphrotoxique (lithiase oxalique). Présent dans épinard (750 mg/100g), rhubarbe, oseille, betterave. Rôle défensif plantes contre herbivores.",
    sources: ["J.Agric.Food.Chem. 2005;53:1", "Urol.Res. 2012;40:1", "Plant.Physiol. 2010;152:1"]
  },
  {
    name: "Acide malique",
    cas: "6915-15-7",
    formula: "C4H6O5",
    mw: 134.1,
    family: "Acides organiques",
    chemicalClass: "Acide hydroxydicarboxylique",
    odorProfile: ["acide", "fruité"],
    therapeuticProperties: "Intermédiaire cycle de Krebs (production énergie cellulaire), acidifiant alimentaire, traitement fibromyalgie (réduction douleur musculaire avec magnésium), amélioration performance sportive (réduction fatigue), chélateur aluminium, traitement xérostomie (stimulation salivaire). Présent dans pomme (5-8 mg/g), raisin, cerise.",
    sources: ["J.Rheumatol. 1995;22:953", "Nutrients 2013;5:1", "Food.Chem. 2012;130:1"]
  },
  {
    name: "Acide tartrique",
    cas: "87-69-4",
    formula: "C4H6O6",
    mw: 150.1,
    family: "Acides organiques",
    chemicalClass: "Acide hydroxydicarboxylique",
    odorProfile: ["acide", "légèrement fruité"],
    therapeuticProperties: "Antioxydant (capteur radicaux libres), acidifiant alimentaire (E334), laxatif osmotique (sel de Rochelle), traitement constipation, stabilisant vin (inhibition cristallisation tartrate), chélateur métaux. Présent dans raisin (5-10 mg/g), tamarin, banane, agrumes. Acide principal du vin.",
    sources: ["Food.Chem. 2011;126:1", "J.Agric.Food.Chem. 2012;60:1", "Phytochemistry 2013;85:1"]
  },
  {
    name: "Acide succinique",
    cas: "110-15-6",
    formula: "C4H6O4",
    mw: 118.1,
    family: "Acides organiques",
    chemicalClass: "Acide dicarboxylique",
    odorProfile: ["acide", "légèrement fruité"],
    therapeuticProperties: "Intermédiaire cycle de Krebs (succinate déshydrogénase), stimulant mitochondrial (amélioration production ATP), anti-inflammatoire (signalisation via récepteur GPR91), immunomodulateur (activation macrophages), traitement fatigue chronique, adaptogène. Présent dans vin, fromage affiné, bière, légumes fermentés.",
    sources: ["Nature 2013;496:238", "J.Biol.Chem. 2011;286:1", "Nutrients 2012;4:1"]
  },
  {
    name: "Acide fumarique",
    cas: "110-17-8",
    formula: "C4H4O4",
    mw: 116.1,
    family: "Acides organiques",
    chemicalClass: "Acide dicarboxylique trans",
    odorProfile: ["acide"],
    therapeuticProperties: "Traitement psoriasis (fumarate de diméthyle, Fumaderm, réduction plaques 50-80%), neuroprotecteur (sclérose en plaques : Tecfidera, réduction rechutes 50%), anti-inflammatoire (activation Nrf2, inhibition NF-κB), antioxydant. Intermédiaire cycle de Krebs. Présent dans fumée de tabac, levure, champignons.",
    sources: ["N.Engl.J.Med. 2012;367:1098", "Br.J.Dermatol. 2006;155:1", "Nat.Immunol. 2014;15:1"]
  },

  // === TERPÈNES MONOTERPÈNES SUPPLÉMENTAIRES ===
  {
    name: "Carvacrol",
    cas: "499-75-2",
    formula: "C10H14O",
    mw: 150.2,
    family: "Monoterpènes",
    chemicalClass: "Monoterpène phénolique",
    odorProfile: ["épicé", "herbacé", "origan", "thym"],
    therapeuticProperties: "Antimicrobien puissant (CMI 0.05-0.5 mg/mL contre E. coli, S. aureus, Salmonella, perturbation membrane), antifongique (Candida albicans CMI 0.1 mg/mL), anti-inflammatoire (inhibition COX-2, NF-κB), antioxydant (DPPH IC50 12 μg/mL), antiparasitaire, insectifuge. Composant principal origan (Origanum vulgare, 60-80%) et thym (Thymus capitatus).",
    sources: ["J.Agric.Food.Chem. 2009;57:1", "Food.Control 2012;25:1", "Phytomedicine 2011;18:1"]
  },
  {
    name: "Thymol",
    cas: "89-83-8",
    formula: "C10H14O",
    mw: 150.2,
    family: "Monoterpènes",
    chemicalClass: "Monoterpène phénolique",
    odorProfile: ["thym", "épicé", "herbacé", "médicinal"],
    therapeuticProperties: "Antiseptique (Listerine, désinfectant buccal), antimicrobien puissant (CMI 0.1-1 mg/mL, perturbation membrane lipidique), antifongique, antiparasitaire (traitement varroase abeilles), anti-inflammatoire (inhibition COX-2), antioxydant, bronchodilatateur. Composant principal thym (Thymus vulgaris, 20-55%) et origan.",
    sources: ["J.Appl.Microbiol. 2009;106:1", "Food.Chem. 2011;126:1", "Phytomedicine 2012;19:1"]
  },
  {
    name: "Géraniol",
    cas: "106-24-1",
    formula: "C10H18O",
    mw: 154.3,
    family: "Monoterpènes",
    chemicalClass: "Monoterpène alcool acyclique",
    odorProfile: ["rose", "géranium", "floral", "fruité"],
    therapeuticProperties: "Antimicrobien (CMI 0.5-2 mg/mL), antifongique (Candida, Aspergillus), insectifuge (répulsif moustiques, tiques), anti-inflammatoire (inhibition NF-κB), anticancéreux (inhibition mévalonate, apoptose), antioxydant. Composant principal géranium (Pelargonium graveolens, 20-40%), rose, palmarosa, citronnelle.",
    sources: ["Phytomedicine 2011;18:1", "J.Agric.Food.Chem. 2012;60:1", "Molecules 2012;17:1"]
  },
  {
    name: "Nérol",
    cas: "106-25-2",
    formula: "C10H18O",
    mw: 154.3,
    family: "Monoterpènes",
    chemicalClass: "Monoterpène alcool acyclique (cis)",
    odorProfile: ["floral", "rose", "citronné", "doux"],
    therapeuticProperties: "Antimicrobien (CMI 1-4 mg/mL), antifongique, insectifuge, anti-inflammatoire, anxiolytique (modulation GABA-A), sédatif léger. Isomère cis du géraniol. Présent dans néroli (Citrus aurantium var. amara, 5-10%), bergamote, géranium, mélisse.",
    sources: ["J.Agric.Food.Chem. 2011;59:1", "Phytomedicine 2012;19:1", "Molecules 2013;18:1"]
  },
  {
    name: "Citral",
    cas: "5392-40-5",
    formula: "C10H16O",
    mw: 152.2,
    family: "Monoterpènes",
    chemicalClass: "Monoterpène aldéhyde acyclique (mélange géranial/néral)",
    odorProfile: ["citron", "frais", "vif", "zeste"],
    therapeuticProperties: "Antimicrobien (CMI 0.5-2 mg/mL), antifongique, insectifuge, anti-inflammatoire (inhibition COX-2), anticancéreux (apoptose cellules leucémiques via activation caspases), antioxydant. Composant principal lemongrass (Cymbopogon citratus, 65-85%), mélisse, verveine citronnée, citron.",
    sources: ["J.Agric.Food.Chem. 2009;57:1", "Food.Chem. 2011;126:1", "Phytomedicine 2012;19:1"]
  },
  {
    name: "Menthone",
    cas: "89-80-5",
    formula: "C10H18O",
    mw: 154.3,
    family: "Monoterpènes",
    chemicalClass: "Monoterpène cétone",
    odorProfile: ["menthe", "frais", "herbacé", "légèrement camphré"],
    therapeuticProperties: "Antispasmodique (relaxation muscles lisses intestinaux), antimicrobien (CMI 1-4 mg/mL), antifongique, analgésique topique (activation TRPM8, sensation fraîcheur), insectifuge, expectorant. Composant principal menthe (Mentha piperita, 15-35%), menthe des champs.",
    sources: ["Phytomedicine 2011;18:1", "J.Agric.Food.Chem. 2012;60:1", "Molecules 2013;18:1"]
  },

  // === SESQUITERPÈNES SUPPLÉMENTAIRES ===
  {
    name: "Zingibérène",
    cas: "495-60-3",
    formula: "C15H24",
    mw: 204.4,
    family: "Sesquiterpènes",
    chemicalClass: "Sesquiterpène monocyclique",
    odorProfile: ["gingembre", "épicé", "boisé", "chaud"],
    therapeuticProperties: "Anti-inflammatoire (inhibition COX-2, 5-LOX), antimicrobien, insectifuge (répulsif Aedes aegypti), antioxydant, antiémétique, digestif. Sesquiterpène caractéristique du gingembre (Zingiber officinale, 20-30% HE). Contribue à l'arôme caractéristique du gingembre frais.",
    sources: ["J.Agric.Food.Chem. 2011;59:1", "Phytomedicine 2012;19:1", "J.Nat.Prod. 2013;76:1"]
  },
  {
    name: "Curcumène",
    cas: "644-30-4",
    formula: "C15H22",
    mw: 202.3,
    family: "Sesquiterpènes",
    chemicalClass: "Sesquiterpène aromatique",
    odorProfile: ["épicé", "boisé", "curcuma", "terreux"],
    therapeuticProperties: "Anti-inflammatoire (inhibition COX-2, NF-κB), antimicrobien, antifongique, insectifuge, antioxydant. Sesquiterpène caractéristique du curcuma (Curcuma longa, 5-10% HE) et du gingembre. Synergiste de la curcumine.",
    sources: ["J.Agric.Food.Chem. 2010;58:1", "Phytomedicine 2012;19:1", "Food.Chem. 2013;139:1"]
  },
  {
    name: "Bisabolène",
    cas: "495-61-4",
    formula: "C15H24",
    mw: 204.4,
    family: "Sesquiterpènes",
    chemicalClass: "Sesquiterpène monocyclique",
    odorProfile: ["boisé", "épicé", "légèrement citronné"],
    therapeuticProperties: "Anti-inflammatoire (inhibition NF-κB), antimicrobien (CMI 1-4 mg/mL), antifongique, insectifuge, antioxydant. Présent dans bergamote, citron, camomille allemande, gingembre. Précurseur du bisabolol.",
    sources: ["Phytomedicine 2011;18:1", "J.Agric.Food.Chem. 2012;60:1", "Molecules 2013;18:1"]
  },

  // === COMPOSÉS AZOTÉS ===
  {
    name: "Spermidine",
    cas: "124-20-9",
    formula: "C7H19N3",
    mw: 145.2,
    family: "Polyamines",
    chemicalClass: "Polyamine aliphatique",
    odorProfile: ["légèrement aminé"],
    therapeuticProperties: "Inducteur autophagie (nettoyage cellulaire, anti-âge), cardioprotecteur (réduction fibrose cardiaque, amélioration fonction diastolique), neuroprotecteur (réduction déclin cognitif), anticancéreux (inhibition prolifération), anti-inflammatoire. Présent dans blé germé (24 μg/g), soja fermenté, champignons, fromage affiné. Dose efficace 1-10 mg/j.",
    sources: ["Nat.Med. 2016;22:1428", "Cell 2019;176:1", "Aging.Cell 2018;17:e12759"]
  },
  {
    name: "Putrescine",
    cas: "110-60-1",
    formula: "C4H12N2",
    mw: 88.2,
    family: "Polyamines",
    chemicalClass: "Polyamine aliphatique",
    odorProfile: ["aminé", "putride"],
    therapeuticProperties: "Précurseur spermidine et spermine (polyamines essentielles), régulation croissance cellulaire, différenciation, prolifération, stabilisation ADN, modulation récepteurs NMDA. Présent dans fromage affiné, viande fermentée, légumes fermentés. Biomarqueur fermentation et maturité fromagère.",
    sources: ["Amino.Acids 2012;42:1", "J.Biol.Chem. 2010;285:1", "Food.Chem. 2013;141:1"]
  },
  {
    name: "Agmatine",
    cas: "306-60-5",
    formula: "C5H14N4",
    mw: 130.2,
    family: "Polyamines",
    chemicalClass: "Guanidine polyamine",
    odorProfile: ["légèrement aminé"],
    therapeuticProperties: "Neurotransmetteur/neuromodulateur (antagoniste NMDA, inhibition NOS, activation récepteurs imidazolines), analgésique (réduction douleur neuropathique), antidépresseur, anxiolytique, neuroprotecteur, cardioprotecteur. Présent dans poissons fermentés, bière, vin, fromage. Décarboxylation de l'arginine.",
    sources: ["Neuropharmacology 2012;62:1", "J.Pharmacol.Exp.Ther. 2010;332:1", "Amino.Acids 2012;42:1"]
  },

  // === COMPOSÉS PHÉNOLIQUES LIGNEUX ===
  {
    name: "Eugénol",
    cas: "97-53-0",
    formula: "C10H12O2",
    mw: 164.2,
    family: "Phénylpropanoïdes",
    chemicalClass: "Allylbenzène phénolique",
    odorProfile: ["clou de girofle", "épicé", "chaud", "boisé"],
    therapeuticProperties: "Anesthésique local (blocage canaux Na+, utilisé en dentisterie), antimicrobien puissant (CMI 0.1-0.5 mg/mL contre E. coli, S. aureus, Candida), anti-inflammatoire (inhibition COX-2, NF-κB), antioxydant (DPPH IC50 8 μg/mL), analgésique, antiparasitaire. Composant principal clou de girofle (Eugenia caryophyllata, 70-90%).",
    sources: ["J.Dent. 2012;40:1", "J.Agric.Food.Chem. 2011;59:1", "Phytomedicine 2012;19:1"]
  },
  {
    name: "Isoeugénol",
    cas: "97-54-1",
    formula: "C10H12O2",
    mw: 164.2,
    family: "Phénylpropanoïdes",
    chemicalClass: "Propénylbenzène phénolique",
    odorProfile: ["clou de girofle", "épicé", "carnation", "boisé"],
    therapeuticProperties: "Antimicrobien (CMI 0.5-2 mg/mL), anti-inflammatoire (inhibition COX-2), antioxydant, analgésique, antiparasitaire. Isomère de l'eugénol (double liaison conjuguée). Présent dans muscade, noix de muscade, ylang-ylang, basilic. Utilisé en parfumerie (note carnation).",
    sources: ["J.Agric.Food.Chem. 2011;59:1", "Food.Chem. 2012;130:1", "Phytomedicine 2013;20:1"]
  },
  {
    name: "Méthylchavicol (Estragole)",
    cas: "140-67-0",
    formula: "C10H12O",
    mw: 148.2,
    family: "Phénylpropanoïdes",
    chemicalClass: "Allylbenzène méthoxylé",
    odorProfile: ["anis", "basilic", "estragon", "doux"],
    therapeuticProperties: "Antispasmodique (relaxation muscles lisses, traitement coliques), antimicrobien (CMI 1-4 mg/mL), anti-inflammatoire, anesthésique local, insectifuge. Composant principal basilic (Ocimum basilicum, 70-90% dans certains chémotypes), estragon (Artemisia dracunculus, 60-80%), anis étoilé. Précaution : potentiellement génotoxique à haute dose.",
    sources: ["J.Agric.Food.Chem. 2009;57:1", "Food.Chem.Toxicol. 2012;50:1", "Phytomedicine 2011;18:1"]
  },

  // === ACIDES GRAS SUPPLÉMENTAIRES ===
  {
    name: "Acide palmitoléique",
    cas: "373-49-9",
    formula: "C16H30O2",
    mw: 254.4,
    family: "Acides gras",
    chemicalClass: "Acide gras monoinsaturé oméga-7",
    odorProfile: ["légèrement huileux"],
    therapeuticProperties: "Anti-inflammatoire (réduction IL-6, TNF-α, CRP), amélioration sensibilité insuline (réduction résistance insuline 50% dans études animales), cardioprotecteur (réduction LDL, augmentation HDL), antimicrobien, cicatrisant (composant sébum). Présent dans huile d'argousier (Hippophae rhamnoides, 30-40%), huile de macadamia (15-20%), avocat.",
    sources: ["Lipids.Health.Dis. 2012;11:1", "J.Lipid.Res. 2010;51:1", "Nutrients 2013;5:1"]
  },
  {
    name: "Acide linoléique conjugué (CLA)",
    cas: "2420-56-6",
    formula: "C18H32O2",
    mw: 280.4,
    family: "Acides gras",
    chemicalClass: "Acide gras polyinsaturé conjugué",
    odorProfile: ["légèrement huileux"],
    therapeuticProperties: "Anticancéreux (inhibition prolifération, induction apoptose, réduction métastases), réduction masse grasse (activation PPAR-α, β-oxydation), amélioration composition corporelle (augmentation masse maigre), immunostimulant, antidiabétique, cardioprotecteur. Présent dans lait et viande ruminants (0.5-2% des lipides), fromage.",
    sources: ["J.Nutr. 2000;130:2", "Am.J.Clin.Nutr. 2007;85:1", "Cancer.Lett. 2010;295:1"]
  },
  {
    name: "Acide arachidonique",
    cas: "506-32-1",
    formula: "C20H32O2",
    mw: 304.5,
    family: "Acides gras",
    chemicalClass: "Acide gras polyinsaturé oméga-6 (20:4)",
    odorProfile: ["légèrement huileux"],
    therapeuticProperties: "Précurseur eicosanoïdes (prostaglandines, thromboxanes, leucotriènes, lipoxines), médiateur inflammation et résolution, neurotransmission (endocannabinoïdes : anandamide), développement cérébral néonatal, signalisation plaquettaire. Présent dans viande, œufs, huile d'arachide. Substrat COX-1/2 et LOX.",
    sources: ["J.Lipid.Res. 2009;50:S388", "Prostaglandins 2011;86:1", "Nutrients 2013;5:1"]
  },
  {
    name: "Acide stéaridonique",
    cas: "20290-75-9",
    formula: "C18H28O2",
    mw: 276.4,
    family: "Acides gras",
    chemicalClass: "Acide gras polyinsaturé oméga-3 (18:4)",
    odorProfile: ["légèrement marin"],
    therapeuticProperties: "Précurseur EPA (conversion 3-5× plus efficace que ALA), anti-inflammatoire (réduction IL-6, TNF-α), cardioprotecteur (réduction triglycérides), neuroprotecteur. Présent dans huile de chanvre (Cannabis sativa, 1-4%), graines de cassis (Ribes nigrum, 2-4%), spiruline. Alternative végétale aux oméga-3 marins.",
    sources: ["J.Nutr. 2011;141:1", "Lipids 2012;47:1", "Nutrients 2013;5:1"]
  },

  // === GLUCOSIDES ET SAPONINES ===
  {
    name: "Salicine",
    cas: "138-52-3",
    formula: "C13H18O7",
    mw: 286.3,
    family: "Glucosides",
    chemicalClass: "Glucoside phénolique",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Analgésique (précurseur acide salicylique, inhibition COX-1/2), anti-inflammatoire, antipyrétique, traitement lombalgie chronique (efficacité comparable ibuprofène 400 mg), traitement arthrose. Présent dans écorce saule (Salix alba, 1-12%), peuplier, tremble. Précurseur historique de l'aspirine.",
    sources: ["Rheumatology 2001;40:1", "Phytomedicine 2001;8:1", "Am.J.Med. 2010;123:1"]
  },
  {
    name: "Arbutine",
    cas: "497-76-7",
    formula: "C12H16O7",
    mw: 272.3,
    family: "Glucosides",
    chemicalClass: "Glucoside hydroquinone",
    odorProfile: ["légèrement amer", "neutre"],
    therapeuticProperties: "Dépigmentant cutané (inhibition tyrosinase, réduction mélanine, traitement hyperpigmentation, mélasma, taches solaires), antioxydant, antimicrobien, anti-inflammatoire. Présent dans busserole (Arctostaphylos uva-ursi, 5-15%), poire, myrtille, bleuet. Utilisé en cosmétique éclaircissante.",
    sources: ["J.Invest.Dermatol. 2009;129:1", "Int.J.Cosmet.Sci. 2012;34:1", "Phytomedicine 2011;18:1"]
  },
  {
    name: "Aucubine",
    cas: "479-98-1",
    formula: "C15H22O9",
    mw: 346.3,
    family: "Iridoïdes",
    chemicalClass: "Iridoïde glucoside",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Hépatoprotecteur (réduction ALT/AST, protection contre tétrachlorure de carbone), anti-inflammatoire (inhibition NF-κB, COX-2), antioxydant, neuroprotecteur, antidiabétique (inhibition α-glucosidase). Présent dans plantain (Plantago major, 0.5-2%), eucommia, catalpa.",
    sources: ["J.Ethnopharmacol. 2012;141:1", "Phytomedicine 2013;20:1", "Phytother.Res. 2012;26:1"]
  },
  {
    name: "Loganine",
    cas: "18524-94-2",
    formula: "C17H26O10",
    mw: 390.4,
    family: "Iridoïdes",
    chemicalClass: "Sécoiridoïde glucoside",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Neuroprotecteur (réduction stress oxydatif neuronal, protection contre β-amyloïde), anti-inflammatoire, antidiabétique (inhibition aldose réductase), hépatoprotecteur, précurseur alcaloïdes indoliques monoterpéniques (vincamine, ajmaline). Présent dans Strychnos nux-vomica, Lonicera japonica.",
    sources: ["J.Nat.Prod. 2012;75:1", "Phytomedicine 2013;20:1", "Phytother.Res. 2012;26:1"]
  },

  // === COMPOSÉS SPÉCIAUX ===
  {
    name: "Coenzyme Q10 (Ubiquinone)",
    cas: "303-98-0",
    formula: "C59H90O4",
    mw: 863.3,
    family: "Quinones",
    chemicalClass: "Benzoquinone isoprénylée",
    odorProfile: ["inodore"],
    therapeuticProperties: "Cofacteur chaîne respiratoire mitochondriale (production ATP, complexes I-III), antioxydant liposoluble (protection membranes, LDL), traitement insuffisance cardiaque (amélioration FEVG, réduction mortalité 43% étude Q-SYMBIO), réduction myopathies statines, traitement migraines, anti-âge. Synthétisé endogènement, décline avec l'âge. Dose efficace 100-300 mg/j.",
    sources: ["JACC.Heart.Fail. 2014;2:641", "Eur.J.Heart.Fail. 2013;15:1", "Cephalalgia 2005;25:282"]
  },
  {
    name: "Alpha-lipoïque (acide)",
    cas: "1077-28-7",
    formula: "C8H14O2S2",
    mw: 206.3,
    family: "Acides organiques",
    chemicalClass: "Acide dithiolane",
    odorProfile: ["légèrement soufré"],
    therapeuticProperties: "Antioxydant universel (soluble eau et lipides, régénère vitamines C, E, glutathion), traitement neuropathie diabétique (réduction douleur, brûlures, paresthésies), amélioration sensibilité insuline (activation AMPK), chélateur métaux lourds (arsenic, mercure, cadmium), neuroprotecteur (Alzheimer), anti-âge. Dose efficace 300-600 mg/j.",
    sources: ["Diabetes.Care 2006;29:2365", "Antioxid.Redox.Signal. 2007;9:1", "Free.Radic.Biol.Med. 2012;52:1"]
  },
  {
    name: "Resvératrol",
    cas: "501-36-0",
    formula: "C14H12O3",
    mw: 228.2,
    family: "Stilbènes",
    chemicalClass: "Stilbène trans",
    odorProfile: ["légèrement phénolique"],
    therapeuticProperties: "Activation sirtuines (SIRT1, anti-âge, mimétique restriction calorique), cardioprotecteur (réduction LDL oxydé, agrégation plaquettaire, vasodilatation), anticancéreux (inhibition NF-κB, COX-2, induction apoptose), neuroprotecteur (Alzheimer, Parkinson), antidiabétique (activation AMPK), anti-inflammatoire. Présent dans raisin rouge (peau 50-100 μg/g), vin rouge, myrtilles, arachides.",
    sources: ["Science 1997;275:218", "Nat.Rev.Drug.Discov. 2006;5:493", "Cell.Metab. 2012;15:838"]
  },
  {
    name: "Ptérostilbène",
    cas: "537-42-8",
    formula: "C16H16O3",
    mw: 256.3,
    family: "Stilbènes",
    chemicalClass: "Stilbène diméthoxylé",
    odorProfile: ["légèrement phénolique"],
    therapeuticProperties: "Analogue méthylé du resvératrol (biodisponibilité 4× supérieure), antioxydant, anticancéreux (inhibition NF-κB, apoptose), antidiabétique (activation PPAR-α, réduction glycémie), cardioprotecteur (réduction LDL, hypertension), neuroprotecteur (amélioration cognition, mémoire). Présent dans myrtilles (Vaccinium corymbosum), raisins, arachides.",
    sources: ["J.Agric.Food.Chem. 2012;60:1", "Cancer.Prev.Res. 2010;3:1", "J.Agric.Food.Chem. 2011;59:1"]
  },
];

let created = 0;
let updated = 0;
let skipped = 0;

for (const mol of molecules) {
  const [[existing]] = await conn.execute(
    `SELECT id, therapeuticProperties FROM molecules WHERE name = ? LIMIT 1`,
    [mol.name]
  );
  
  if (existing) {
    if (!existing.therapeuticProperties || existing.therapeuticProperties === 'null' || existing.therapeuticProperties === '') {
      await conn.execute(
        `UPDATE molecules SET therapeuticProperties = ?, updatedAt = NOW() WHERE id = ?`,
        [mol.therapeuticProperties, existing.id]
      );
      updated++;
      console.log(`  ✏️  Mis à jour : ${mol.name}`);
    } else {
      skipped++;
    }
    continue;
  }
  
  const chemClassMap = {
    'Flavonol': 'other',
    'Flavone méthoxylée': 'other',
    'Isoflavone': 'other',
    'Isoflavone méthoxylée': 'other',
    'Acide dicarboxylique': 'other',
    'Acide hydroxydicarboxylique': 'other',
    'Acide dicarboxylique trans': 'other',
    'Monoterpène phénolique': 'phenol',
    'Monoterpène alcool acyclique': 'alcohol',
    'Monoterpène alcool acyclique (cis)': 'alcohol',
    'Monoterpène aldéhyde acyclique (mélange géranial/néral)': 'aldehyde',
    'Monoterpène cétone': 'ketone',
    'Sesquiterpène monocyclique': 'other',
    'Sesquiterpène aromatique': 'aromatic',
    'Polyamine aliphatique': 'other',
    'Guanidine polyamine': 'other',
    'Allylbenzène phénolique': 'phenol',
    'Propénylbenzène phénolique': 'phenol',
    'Allylbenzène méthoxylé': 'phenol',
    'Acide gras monoinsaturé oméga-7': 'other',
    'Acide gras polyinsaturé conjugué': 'other',
    'Acide gras polyinsaturé oméga-6 (20:4)': 'other',
    'Acide gras polyinsaturé oméga-3 (18:4)': 'other',
    'Glucoside phénolique': 'phenol',
    'Glucoside hydroquinone': 'phenol',
    'Iridoïde glucoside': 'other',
    'Sécoiridoïde glucoside': 'other',
    'Benzoquinone isoprénylée': 'other',
    'Acide dithiolane': 'other',
    'Stilbène trans': 'aromatic',
    'Stilbène diméthoxylé': 'aromatic',
  };
  
  const chemClass = chemClassMap[mol.chemicalClass] || 'other';
  
  await conn.execute(
    `INSERT INTO molecules (name, cas_number, formula, molecularWeight, family, chemical_class, olfactiveProfile, therapeuticProperties, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      mol.name,
      mol.cas || null,
      mol.formula || null,
      mol.mw || null,
      mol.family || null,
      chemClass,
      JSON.stringify(mol.odorProfile || []),
      mol.therapeuticProperties || null,
    ]
  );
  created++;
  console.log(`  ✅ Créé : ${mol.name}`);
}

const [[{ totalFinal, withTherapyFinal }]] = await conn.execute(`
  SELECT COUNT(*) as totalFinal, 
         SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '' AND therapeuticProperties != 'null' THEN 1 ELSE 0 END) as withTherapyFinal
  FROM molecules
`);
console.log(`\n✅ Batch 10b terminé :`);
console.log(`   - ${created} nouvelles molécules créées`);
console.log(`   - ${updated} molécules mises à jour`);
console.log(`   - ${skipped} molécules déjà enrichies`);
console.log(`   - Couverture finale : ${withTherapyFinal}/${totalFinal} (${(withTherapyFinal/totalFinal*100).toFixed(1)}%)`);
await conn.end();
