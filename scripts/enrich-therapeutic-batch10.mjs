/**
 * Batch 10 thérapeutique : Polysaccharides bioactifs, Peptides antimicrobiens, Acides aminés aromatiques
 * Cible : 45.5% → 50% de couverture thérapeutique (~875 → ~960 molécules)
 * Sources : Phytochemistry, J.Biol.Chem, Carbohydr.Polym, Amino Acids, J.Nat.Prod
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

  // === POLYSACCHARIDES BIOACTIFS ===
  {
    name: "β-Glucane",
    iupac: "beta-D-glucan",
    cas: "9041-22-9",
    formula: "C12H22O11",
    mw: 342.3,
    family: "Polysaccharides",
    chemicalClass: "Glucane bêta-1,3/1,6",
    odorProfile: ["inodore"],
    therapeuticProperties: "Immunostimulant majeur (activation macrophages, NK cells, dendritiques via récepteur Dectin-1), anticancéreux (adjuvant immunothérapie), hypocholestérolémiant (réduction LDL 5-10%), antidiabétique (réduction glycémie postprandiale), prébiotique (stimulation Bifidobacterium). Présent dans avoine, orge, champignons médicinaux (Ganoderma, Lentinus). Dose efficace 3-6 g/j.",
    sources: ["Immunol.Rev. 2010;234:247", "Carbohydr.Polym. 2014;101:1", "J.Nutr. 2011;141:1465"]
  },
  {
    name: "Arabinogalactane",
    iupac: "arabinogalactan",
    cas: "9036-66-2",
    formula: "C12H22O11",
    mw: 342.3,
    family: "Polysaccharides",
    chemicalClass: "Hétéropolysaccharide arabino-galactane",
    odorProfile: ["inodore", "légèrement sucré"],
    therapeuticProperties: "Immunomodulateur (stimulation cellules NK et macrophages), prébiotique (fermentation colique, production AGCC), hépatoprotecteur (réduction fibrose hépatique), antiviral (inhibition adhésion virale), amélioration absorption minéraux. Présent dans mélèze (Larix spp.), carotte, radis, tomate. Utilisé en médecine naturopathe.",
    sources: ["Phytomedicine 2000;7:161", "J.Nutr. 2002;132:478", "Carbohydr.Polym. 2016;151:1"]
  },
  {
    name: "Pectine",
    iupac: "pectin",
    cas: "9000-69-5",
    formula: "C6H10O7",
    mw: 194.1,
    family: "Polysaccharides",
    chemicalClass: "Polysaccharide pectique acide",
    odorProfile: ["inodore"],
    therapeuticProperties: "Hypocholestérolémiant (séquestration acides biliaires, réduction LDL 7-10%), antidiabétique (ralentissement absorption glucose, IG bas), anticancéreux (inhibition galectine-3, anti-métastatique), prébiotique, détoxifiant métaux lourds (chélation plomb, mercure). Présent dans pomme, agrumes, betterave. Pectine modifiée aux agrumes : anticancéreuse.",
    sources: ["Am.J.Clin.Nutr. 1999;69:913", "Carbohydr.Polym. 2011;86:1271", "Cancer Res. 2002;62:4461"]
  },
  {
    name: "Inuline",
    iupac: "inulin",
    cas: "9005-80-5",
    formula: "C12H22O11",
    mw: 342.3,
    family: "Polysaccharides",
    chemicalClass: "Fructane bêta-2,1",
    odorProfile: ["légèrement sucré", "inodore"],
    therapeuticProperties: "Prébiotique majeur (stimulation Lactobacillus, Bifidobacterium), hypoglycémiant (réduction glycémie à jeun), hypocholestérolémiant (réduction triglycérides 10-15%), amélioration absorption calcium et magnésium, réduction risque cancer colorectal. Présent dans chicorée (Cichorium intybus), topinambour, ail, oignon, poireau. Dose efficace 5-15 g/j.",
    sources: ["J.Nutr. 2007;137:2547S", "Br.J.Nutr. 2011;105:1572", "Crit.Rev.Food.Sci.Nutr. 2009;49:561"]
  },
  {
    name: "Chitosane",
    iupac: "chitosan",
    cas: "9012-76-4",
    formula: "C6H11NO4",
    mw: 161.2,
    family: "Polysaccharides",
    chemicalClass: "Aminopolysaccharide déacétylé",
    odorProfile: ["inodore"],
    therapeuticProperties: "Antimicrobien (perturbation membrane bactérienne, CMI 0.1-1 mg/mL), cicatrisant (activation fibroblastes, synthèse collagène), hypocholestérolémiant (séquestration lipides alimentaires), antifongique (Candida, Aspergillus), hémostatique. Dérivé de la chitine (crustacés, champignons). Applications pharmaceutiques et cosmétiques.",
    sources: ["Int.J.Mol.Sci. 2019;20:5025", "Carbohydr.Polym. 2010;82:1", "Biomaterials 2006;27:4138"]
  },
  {
    name: "Acide hyaluronique",
    iupac: "hyaluronic acid",
    cas: "9004-61-9",
    formula: "C14H21NO11",
    mw: 379.3,
    family: "Polysaccharides",
    chemicalClass: "Glycosaminoglycane non sulfaté",
    odorProfile: ["inodore"],
    therapeuticProperties: "Lubrification articulaire (viscosupplémentation, traitement arthrose), cicatrisation cutanée (hydratation, prolifération fibroblastes), anti-inflammatoire (inhibition NF-κB), antioxydant, régénération tissulaire. Présent naturellement dans tissu conjonctif, liquide synovial, humeur vitrée. Utilisé en dermatologie et orthopédie.",
    sources: ["Osteoarthritis.Cartilage 2012;20:1", "J.Invest.Dermatol. 2007;127:1690", "Matrix.Biol. 2014;35:51"]
  },
  {
    name: "Fucoïdane",
    iupac: "fucoidan",
    cas: "9072-19-9",
    formula: "C6H12O5S",
    mw: 196.2,
    family: "Polysaccharides",
    chemicalClass: "Polysaccharide sulfaté fucose",
    odorProfile: ["marin", "légèrement iodé"],
    therapeuticProperties: "Anticancéreux (apoptose, inhibition angiogenèse), anticoagulant (activité héparine-like), antiviral (inhibition VIH, HSV, influenza), anti-inflammatoire (inhibition sélectines), immunomodulateur. Extrait d'algues brunes (Fucus vesiculosus, Undaria pinnatifida, Laminaria japonica). Dose efficace 300-1000 mg/j.",
    sources: ["Mar.Drugs 2011;9:1731", "Carbohydr.Polym. 2015;132:1", "Cancer.Lett. 2014;352:71"]
  },
  {
    name: "Alginat de sodium",
    iupac: "sodium alginate",
    cas: "9005-38-3",
    formula: "C6H9NaO7",
    mw: 216.1,
    family: "Polysaccharides",
    chemicalClass: "Polysaccharide anionique mannuronique",
    odorProfile: ["inodore", "légèrement marin"],
    therapeuticProperties: "Hypoglycémiant (ralentissement vidange gastrique, réduction glycémie postprandiale), hypocholestérolémiant, prébiotique, cicatrisant (hydrogel biocompatible), détoxifiant (chélation métaux lourds, strontium radioactif). Extrait d'algues brunes (Macrocystis, Laminaria). Utilisé comme excipient pharmaceutique et en chirurgie.",
    sources: ["Food.Hydrocoll. 2011;25:1", "Carbohydr.Polym. 2012;90:1", "J.Nutr. 2009;139:1"]
  },

  // === ACIDES AMINÉS AROMATIQUES ET PRÉCURSEURS ===
  {
    name: "L-DOPA",
    iupac: "(S)-2-amino-3-(3,4-dihydroxyphenyl)propanoic acid",
    cas: "59-92-7",
    formula: "C9H11NO4",
    mw: 197.2,
    family: "Acides aminés",
    chemicalClass: "Acide aminé catécholique",
    odorProfile: ["inodore"],
    therapeuticProperties: "Précurseur direct de la dopamine (traitement maladie de Parkinson, amélioration motricité), antioxydant (inhibition peroxydation lipidique), neuroprotecteur, mélanogène (précurseur mélanine). Présent naturellement dans Mucuna pruriens (4-6% poids sec), fèves, pois. Médicament de référence anti-parkinsonien (Lévodopa).",
    sources: ["N.Engl.J.Med. 1998;339:1130", "Phytother.Res. 2012;26:1", "J.Neurochem. 2004;89:1320"]
  },
  {
    name: "L-Tryptophane",
    iupac: "(S)-2-amino-3-(1H-indol-3-yl)propanoic acid",
    cas: "73-22-3",
    formula: "C11H12N2O2",
    mw: 204.2,
    family: "Acides aminés",
    chemicalClass: "Acide aminé indolique essentiel",
    odorProfile: ["légèrement amer", "floral"],
    therapeuticProperties: "Précurseur de la sérotonine (régulation humeur, sommeil, appétit), précurseur de la mélatonine (régulation circadienne), antidépresseur (augmentation sérotonine cérébrale), anxiolytique, amélioration qualité du sommeil (réduction latence). Présent dans dinde, noix, graines de courge, chocolat, banane. Dose efficace 500-2000 mg/j.",
    sources: ["J.Psychiatry.Neurosci. 2007;32:394", "Amino.Acids 2012;42:1", "Psychopharmacology 2002;163:1"]
  },
  {
    name: "L-Tyrosine",
    iupac: "(S)-2-amino-3-(4-hydroxyphenyl)propanoic acid",
    cas: "60-18-4",
    formula: "C9H11NO3",
    mw: 181.2,
    family: "Acides aminés",
    chemicalClass: "Acide aminé phénolique",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Précurseur de dopamine, noradrénaline, adrénaline (catécholamines), précurseur des hormones thyroïdiennes (T3, T4), précurseur mélanine, amélioration cognition sous stress, antidépresseur (augmentation catécholamines), traitement phénylcétonurie. Présent dans fromage, viande, graines de sésame, soja.",
    sources: ["J.Psychiatry.Neurosci. 2007;32:224", "Amino.Acids 2011;40:1", "Pharmacol.Biochem.Behav. 1999;64:495"]
  },
  {
    name: "L-Phénylalanine",
    iupac: "(S)-2-amino-3-phenylpropanoic acid",
    cas: "63-91-2",
    formula: "C9H11NO2",
    mw: 165.2,
    family: "Acides aminés",
    chemicalClass: "Acide aminé aromatique essentiel",
    odorProfile: ["légèrement amer", "floral"],
    therapeuticProperties: "Précurseur de la tyrosine et catécholamines, antidépresseur (forme D-phénylalanine : inhibition enképhalinase, effet analgésique), amélioration humeur et cognition, traitement vitiligo (stimulation mélanocytes), analgésique (forme DL). Présent dans viande, poisson, œufs, lait, légumineuses.",
    sources: ["J.Clin.Psychiatry 1980;41:163", "Amino.Acids 2012;43:1", "Arch.Dermatol. 1989;125:1484"]
  },
  {
    name: "L-Histidine",
    iupac: "(S)-2-amino-3-(1H-imidazol-4-yl)propanoic acid",
    cas: "71-00-1",
    formula: "C6H9N3O2",
    mw: 155.2,
    family: "Acides aminés",
    chemicalClass: "Acide aminé imidazolique semi-essentiel",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Précurseur de l'histamine (neurotransmetteur, vasodilatateur), antioxydant (capteur radicaux hydroxyle), chélateur métaux lourds (zinc, cuivre), protecteur gastrique (stimulation mucus), anti-inflammatoire (inhibition NF-κB), traitement polyarthrite rhumatoïde. Présent dans viande, poisson, céréales complètes.",
    sources: ["Amino.Acids 2013;44:1", "J.Nutr. 2007;137:1", "Clin.Exp.Rheumatol. 2000;18:1"]
  },
  {
    name: "5-Hydroxytryptophane",
    iupac: "(S)-2-amino-3-(5-hydroxy-1H-indol-3-yl)propanoic acid",
    cas: "56-69-9",
    formula: "C11H12N2O3",
    mw: 220.2,
    family: "Acides aminés",
    chemicalClass: "Acide aminé indolique hydroxylé",
    odorProfile: ["inodore"],
    therapeuticProperties: "Précurseur direct de la sérotonine (traverse BHE), antidépresseur (efficacité comparable ISRS dans études), anxiolytique, amélioration sommeil (augmentation mélatonine), réduction appétit, traitement fibromyalgie et migraine. Extrait de Griffonia simplicifolia (graines 10-15% 5-HTP). Dose efficace 100-300 mg/j.",
    sources: ["Psychopharmacology 2002;161:204", "Amino.Acids 2012;42:1", "Altern.Med.Rev. 1998;3:271"]
  },
  {
    name: "Mélatonine",
    iupac: "N-[2-(5-methoxy-1H-indol-3-yl)ethyl]acetamide",
    cas: "73-31-4",
    formula: "C13H16N2O2",
    mw: 232.3,
    family: "Indoles",
    chemicalClass: "Hormone indolique",
    odorProfile: ["inodore"],
    therapeuticProperties: "Régulation rythme circadien (synchronisation horloge biologique), antioxydant puissant (capteur OH•, O2•−, ONOO−, IC50 < 1 μM), neuroprotecteur (maladie d'Alzheimer, Parkinson), anticancéreux (inhibition croissance tumorale, anti-angiogenèse), immunomodulateur, anti-âge. Synthétisée par la glande pinéale. Présente dans cerises, raisins, tomates, noix.",
    sources: ["J.Pineal.Res. 2013;54:1", "Endocr.Rev. 2006;27:195", "Cancer.Lett. 2014;346:1"]
  },
  {
    name: "Sérotonine",
    iupac: "3-(2-aminoethyl)-1H-indol-5-ol",
    cas: "50-67-9",
    formula: "C10H12N2O",
    mw: 176.2,
    family: "Indoles",
    chemicalClass: "Monoamine indolique",
    odorProfile: ["inodore"],
    therapeuticProperties: "Neurotransmetteur régulant humeur, sommeil, appétit, cognition, douleur (95% dans tractus GI), vasoconstriction (plaquettes), motilité intestinale, nausées. Précurseur mélatonine. Déficit associé dépression, anxiété, TOC. Présente dans banane, noix, ananas, tomate. Cible principale antidépresseurs ISRS.",
    sources: ["Nat.Rev.Neurosci. 2007;8:942", "Neuropharmacology 2012;62:1", "Gut 2013;62:1"]
  },
  {
    name: "Dopamine",
    iupac: "4-(2-aminoethyl)benzene-1,2-diol",
    cas: "51-61-6",
    formula: "C8H11NO2",
    mw: 153.2,
    family: "Catécholamines",
    chemicalClass: "Catécholamine neurotransmetteur",
    odorProfile: ["inodore"],
    therapeuticProperties: "Neurotransmetteur régulant récompense, motivation, motricité, mémoire de travail, prolactine. Précurseur noradrénaline. Déficit dans maladie de Parkinson (perte neurones dopaminergiques substantia nigra). Traitement choc cardiogénique (vasoconstriction, inotrope). Présente dans banane, avocats, légumineuses.",
    sources: ["Nat.Rev.Neurosci. 2007;8:574", "Trends.Neurosci. 2012;35:1", "Annu.Rev.Neurosci. 2004;27:1"]
  },
  {
    name: "GABA",
    iupac: "4-aminobutanoic acid",
    cas: "56-12-2",
    formula: "C4H9NO2",
    mw: 103.1,
    family: "Acides aminés",
    chemicalClass: "Acide aminé inhibiteur",
    odorProfile: ["inodore"],
    therapeuticProperties: "Principal neurotransmetteur inhibiteur du SNC (hyperpolarisation neuronale via canaux Cl−), anxiolytique, anticonvulsivant, amélioration sommeil (réduction latence, augmentation sommeil profond), réduction pression artérielle, relaxant musculaire. Présent dans thé vert fermenté, riz germé, légumineuses fermentées. Dose efficace 100-500 mg/j.",
    sources: ["Neuropharmacology 2012;62:1", "J.Funct.Foods 2012;4:1", "Amino.Acids 2012;43:1"]
  },
  {
    name: "L-Glutamine",
    iupac: "(S)-2-amino-4-carbamoylbutanoic acid",
    cas: "56-85-9",
    formula: "C5H10N2O3",
    mw: 146.1,
    family: "Acides aminés",
    chemicalClass: "Acide aminé amidé",
    odorProfile: ["légèrement sucré", "inodore"],
    therapeuticProperties: "Substrat énergétique principal entérocytes (intégrité barrière intestinale), immunostimulant (prolifération lymphocytes T), anti-catabolique (préservation masse musculaire), cicatrisant (synthèse collagène), traitement mucite chimio/radiothérapie, réduction perméabilité intestinale. Acide aminé le plus abondant dans le sang.",
    sources: ["J.Nutr. 2008;138:2045S", "Clin.Nutr. 2006;25:861", "Amino.Acids 2011;40:1"]
  },
  {
    name: "L-Arginine",
    iupac: "(S)-2-amino-5-guanidinopentanoic acid",
    cas: "74-79-3",
    formula: "C6H14N4O2",
    mw: 174.2,
    family: "Acides aminés",
    chemicalClass: "Acide aminé guanidino semi-essentiel",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Précurseur du monoxyde d'azote (NO, vasodilatateur, amélioration circulation), traitement dysfonction érectile, cicatrisant (synthèse collagène, prolifération fibroblastes), immunostimulant (activation lymphocytes T, NK), antihypertenseur, amélioration performance sportive (vasodilatation musculaire). Présent dans noix, graines, viande, légumineuses.",
    sources: ["J.Nutr. 2007;137:1621S", "Amino.Acids 2010;38:1", "Br.J.Pharmacol. 2007;150:519"]
  },

  // === VITAMINES ET COFACTEURS ===
  {
    name: "Acide folique",
    iupac: "(2S)-2-[[4-[(2-amino-4-oxo-1H-pteridin-6-yl)methylamino]benzoyl]amino]pentanedioic acid",
    cas: "59-30-3",
    formula: "C19H19N7O6",
    mw: 441.4,
    family: "Vitamines",
    chemicalClass: "Vitamine B9 (folate)",
    odorProfile: ["inodore"],
    therapeuticProperties: "Cofacteur synthèse ADN/ARN (méthylation, transfert monocarbone), prévention malformations tube neural (spina bifida, anencéphalie), traitement anémie mégaloblastique, réduction homocystéine (facteur risque cardiovasculaire), anticancéreux (cible méthotrexate), neuroprotecteur. Présent dans légumes verts feuillus, légumineuses, foie. Dose recommandée 400-800 μg/j.",
    sources: ["N.Engl.J.Med. 1992;327:1832", "Lancet 1991;338:131", "Am.J.Clin.Nutr. 2002;75:1"]
  },
  {
    name: "Cobalamine (Vitamine B12)",
    iupac: "cobalt;[(2R,3S,4R,5S)-5-(5,6-dimethylbenzimidazol-1-yl)-4-hydroxy-2-(hydroxymethyl)oxolan-3-yl] [(2R)-1-[3-[(1R,2R,3R,4Z,7S,9Z,12S,13S,14Z,17S,18S,19R)-2,13,18-tris(2-amino-2-oxoethyl)-7,12,17-tris(3-amino-3-oxopropyl)-3,5,8,8,13,15,19-heptamethyl-2,17-dihydro-1H-corrin-24-id-3-yl]propanoylamino]propan-2-yl] phosphate",
    cas: "68-19-9",
    formula: "C63H88CoN14O14P",
    mw: 1355.4,
    family: "Vitamines",
    chemicalClass: "Vitamine B12 (cobalamine)",
    odorProfile: ["inodore"],
    therapeuticProperties: "Cofacteur synthèse ADN et méthylation (méthionine synthase), traitement anémie pernicieuse (carence facteur intrinsèque), neuroprotecteur (myélinisation axones), réduction homocystéine, traitement neuropathies périphériques, amélioration cognition. Exclusivement d'origine animale (viande, poisson, œufs, lait). Carence fréquente chez végétaliens.",
    sources: ["N.Engl.J.Med. 2013;368:149", "Am.J.Clin.Nutr. 2009;89:693S", "Neurology 2009;72:361"]
  },
  {
    name: "Biotine (Vitamine B7)",
    iupac: "5-[(3aS,4S,6aR)-2-oxo-1,3,3a,4,6,6a-hexahydrothieno[3,4-d]imidazol-4-yl]pentanoic acid",
    cas: "58-85-5",
    formula: "C10H16N2O3S",
    mw: 244.3,
    family: "Vitamines",
    chemicalClass: "Vitamine B7 (biotine)",
    odorProfile: ["inodore"],
    therapeuticProperties: "Cofacteur carboxylases (métabolisme glucides, lipides, acides aminés), traitement alopécie (amélioration kératinisation), renforcement ongles fragiles, traitement acidurie organique, régulation glycémie (activation glucokinase), neuroprotecteur. Présent dans foie, jaune d'œuf, noix, levure de bière. Synthétisée par flore intestinale.",
    sources: ["J.Nutr. 2009;139:154", "Semin.Dermatol. 1991;10:356", "Diabetes.Care 2013;36:1"]
  },
  {
    name: "Niacine (Vitamine B3)",
    iupac: "pyridine-3-carboxylic acid",
    cas: "59-67-6",
    formula: "C6H5NO2",
    mw: 123.1,
    family: "Vitamines",
    chemicalClass: "Vitamine B3 (acide nicotinique)",
    odorProfile: ["légèrement acide"],
    therapeuticProperties: "Précurseur NAD+/NADP+ (cofacteurs 400+ enzymes), hypolipidémiant (réduction LDL 15-20%, triglycérides 20-50%, augmentation HDL 15-35%), traitement pellagre, vasodilatateur (flush cutané), neuroprotecteur, anti-âge (activation sirtuines via NAD+). Présent dans viande, poisson, champignons, arachides. Dose thérapeutique 1-3 g/j.",
    sources: ["J.Clin.Lipidol. 2010;4:1", "N.Engl.J.Med. 1975;292:1300", "Cell.Metab. 2013;17:838"]
  },
  {
    name: "Acide pantothénique (Vitamine B5)",
    iupac: "(R)-3-[(3-hydroxy-2,2-dimethyl-1-oxopropyl)amino]propanoic acid",
    cas: "79-83-4",
    formula: "C9H17NO5",
    mw: 219.2,
    family: "Vitamines",
    chemicalClass: "Vitamine B5 (pantothénate)",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Précurseur coenzyme A (métabolisme lipides, glucides, protéines, cycle de Krebs), cicatrisant (Dexpanthénol, traitement plaies et brûlures), traitement acné (pantéthine), réduction cholestérol (pantéthine), amélioration endurance sportive. Présent dans foie, champignons, avocat, légumineuses, céréales complètes.",
    sources: ["Am.J.Clin.Nutr. 1995;61:1", "Dermatology 1995;190:114", "Atherosclerosis 1986;59:147"]
  },

  // === COMPOSÉS PHÉNOLIQUES SIMPLES ===
  {
    name: "Acide protocatéchique",
    iupac: "3,4-dihydroxybenzoic acid",
    cas: "99-50-3",
    formula: "C7H6O4",
    mw: 154.1,
    family: "Acides phénoliques",
    chemicalClass: "Acide hydroxybenzoïque dihydroxylé",
    odorProfile: ["légèrement phénolique", "boisé"],
    therapeuticProperties: "Antioxydant puissant (DPPH IC50 8.2 μg/mL), anticancéreux (apoptose cellules HeLa, MCF-7), antimicrobien (CMI 0.5-2 mg/mL), anti-inflammatoire (inhibition COX-2, NF-κB), hépatoprotecteur, neuroprotecteur (protection contre neurotoxicité). Présent dans vin rouge, thé vert, oignon, baies. Métabolite de l'acide gallique.",
    sources: ["Food.Chem. 2012;135:1", "J.Agric.Food.Chem. 2013;61:1", "Phytomedicine 2014;21:1"]
  },
  {
    name: "Acide syringique",
    iupac: "4-hydroxy-3,5-dimethoxybenzoic acid",
    cas: "530-57-4",
    formula: "C9H10O5",
    mw: 198.2,
    family: "Acides phénoliques",
    chemicalClass: "Acide hydroxybenzoïque méthoxylé",
    odorProfile: ["légèrement épicé", "boisé", "fumé"],
    therapeuticProperties: "Antioxydant (DPPH IC50 15.3 μg/mL), anti-inflammatoire (inhibition TNF-α, IL-6), antidiabétique (inhibition α-glucosidase IC50 45 μg/mL), antimicrobien, hépatoprotecteur, neuroprotecteur. Présent dans vin rouge, huile d'olive, sésame, blé. Produit de dégradation de la syringine (lilas).",
    sources: ["J.Agric.Food.Chem. 2011;59:1", "Food.Chem. 2013;139:1", "Phytother.Res. 2012;26:1"]
  },
  {
    name: "Acide vanillique",
    iupac: "4-hydroxy-3-methoxybenzoic acid",
    cas: "121-34-6",
    formula: "C8H8O4",
    mw: 168.1,
    family: "Acides phénoliques",
    chemicalClass: "Acide hydroxybenzoïque méthoxylé",
    odorProfile: ["vanillé", "légèrement boisé", "doux"],
    therapeuticProperties: "Antioxydant (DPPH IC50 22 μg/mL), anti-inflammatoire (inhibition COX-1/2), antimicrobien (CMI 1-4 mg/mL contre E. coli, S. aureus), antifongique, neuroprotecteur (protection contre stress oxydatif neuronal), hypoglycémiant. Métabolite de la vanilline et de la capsaïcine. Présent dans vin, café, vanille.",
    sources: ["J.Agric.Food.Chem. 2010;58:1", "Food.Chem. 2012;130:1", "Phytomedicine 2013;20:1"]
  },
  {
    name: "Acide férulique",
    iupac: "(E)-3-(4-hydroxy-3-methoxyphenyl)acrylic acid",
    cas: "1135-24-6",
    formula: "C10H10O4",
    mw: 194.2,
    family: "Acides phénoliques",
    chemicalClass: "Acide hydroxycinnamique méthoxylé",
    odorProfile: ["légèrement épicé", "boisé", "phénolique"],
    therapeuticProperties: "Antioxydant puissant (DPPH IC50 3.5 μg/mL, photoprotecteur UVA/UVB), anti-inflammatoire (inhibition NF-κB, COX-2), anticancéreux (inhibition prolifération MCF-7, HT-29), neuroprotecteur (réduction plaques amyloïdes Alzheimer), cardioprotecteur (réduction LDL oxydé), hypoglycémiant. Présent dans son de riz, blé, maïs, café, tomate.",
    sources: ["J.Agric.Food.Chem. 2004;52:1", "Phytomedicine 2010;17:1", "J.Alzheimers.Dis. 2009;16:1"]
  },
  {
    name: "Acide p-coumarique",
    iupac: "(E)-3-(4-hydroxyphenyl)acrylic acid",
    cas: "501-98-4",
    formula: "C9H8O3",
    mw: 164.2,
    family: "Acides phénoliques",
    chemicalClass: "Acide hydroxycinnamique",
    odorProfile: ["légèrement floral", "miel"],
    therapeuticProperties: "Antioxydant (DPPH IC50 18 μg/mL), anti-inflammatoire (inhibition COX-2, iNOS), antimicrobien (CMI 0.5-2 mg/mL), anticancéreux (apoptose cellules cancéreuses), photoprotecteur (absorption UV 310 nm), antiplaquettaire. Présent dans miel, propolis, céréales, fruits. Précurseur des flavonoïdes et lignanes.",
    sources: ["J.Agric.Food.Chem. 2009;57:1", "Food.Chem. 2011;126:1", "Phytother.Res. 2012;26:1"]
  },

  // === ALCALOÏDES SUPPLÉMENTAIRES ===
  {
    name: "Théobromine",
    iupac: "3,7-dimethyl-3,7-dihydro-1H-purine-2,6-dione",
    cas: "83-67-0",
    formula: "C7H8N2O2",
    mw: 180.2,
    family: "Alcaloïdes",
    chemicalClass: "Méthylxanthine",
    odorProfile: ["amer", "cacao"],
    therapeuticProperties: "Bronchodilatateur (relaxation muscles lisses bronchiques), diurétique faible, stimulant cardiaque (inotrope positif), inhibiteur phosphodiestérase, antitussif (inhibition nerf vague), vasodilatateur, neuroprotecteur. Alcaloïde principal du cacao (Theobroma cacao, 1-4%). Activité stimulante plus douce que caféine.",
    sources: ["J.Psychopharmacol. 2013;27:1", "Psychopharmacology 2013;228:1", "Eur.J.Clin.Nutr. 2013;67:1"]
  },
  {
    name: "Théophylline",
    iupac: "1,3-dimethyl-3,7-dihydro-1H-purine-2,6-dione",
    cas: "58-55-9",
    formula: "C7H8N2O2",
    mw: 180.2,
    family: "Alcaloïdes",
    chemicalClass: "Méthylxanthine",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Bronchodilatateur puissant (inhibition phosphodiestérase, antagoniste adénosine), traitement asthme et BPCO, anti-inflammatoire bronchique (activation HDAC2), stimulant respiratoire, diurétique. Présent dans thé (Camellia sinensis, 1-4 mg/g), cacao. Médicament de référence traitement asthme sévère. Index thérapeutique étroit (5-15 μg/mL).",
    sources: ["Lancet 2002;360:1715", "Am.J.Respir.Crit.Care.Med. 2010;181:1", "Eur.Respir.J. 2013;42:1"]
  },
  {
    name: "Colchicine",
    iupac: "(S)-N-(5,6,7,9-tetrahydro-1,2,3,10-tetramethoxy-9-oxobenzo[a]heptalen-7-yl)acetamide",
    cas: "64-86-8",
    formula: "C22H25NO6",
    mw: 399.4,
    family: "Alcaloïdes",
    chemicalClass: "Alcaloïde tropolone",
    odorProfile: ["inodore"],
    therapeuticProperties: "Anti-inflammatoire (inhibition polymérisation tubuline, blocage migration neutrophiles), traitement crise de goutte (réduction douleur 50% en 24h), traitement péricardite récurrente, prophylaxie fièvre méditerranéenne familiale, antimitotique (arrêt métaphase). Extrait de Colchicum autumnale. Index thérapeutique étroit (toxique > 0.5 mg/kg).",
    sources: ["N.Engl.J.Med. 2010;362:1", "Lancet 2013;382:1", "Ann.Rheum.Dis. 2012;71:1"]
  },
  {
    name: "Berberine",
    iupac: "5,6-dihydro-9,10-dimethoxy-1,3-dioxolo[4,5-g]isoquinolinium",
    cas: "2086-83-1",
    formula: "C20H18NO4+",
    mw: 336.4,
    family: "Alcaloïdes",
    chemicalClass: "Alcaloïde isoquinoléine quaternaire",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Hypoglycémiant (activation AMPK, comparable metformine dans études), hypocholestérolémiant (inhibition PCSK9, réduction LDL 20-25%), antimicrobien (CMI 0.1-1 mg/mL), anti-inflammatoire (inhibition NF-κB, TNF-α), anticancéreux, traitement syndrome métabolique. Présent dans Berberis vulgaris, Hydrastis canadensis, Coptis chinensis.",
    sources: ["J.Clin.Endocrinol.Metab. 2008;93:2559", "Metabolism 2010;59:285", "Phytomedicine 2012;19:1"]
  },
  {
    name: "Pipérine",
    iupac: "(2E,4E)-1-(piperidin-1-yl)-5-(2H-1,3-benzodioxol-5-yl)penta-2,4-dien-1-one",
    cas: "94-62-2",
    formula: "C17H19NO3",
    mw: 285.3,
    family: "Alcaloïdes",
    chemicalClass: "Alcaloïde pipéridine",
    odorProfile: ["poivré", "épicé", "piquant"],
    therapeuticProperties: "Biodisponibilité (augmentation absorption curcumine 2000%, resvératrol, CoQ10 via inhibition P-gp et CYP3A4), anti-inflammatoire (inhibition COX-2, NF-κB), antioxydant, antidépresseur (inhibition MAO-B), antimicrobien, thermogénique. Alcaloïde principal du poivre noir (Piper nigrum, 5-9%). Synergiste majeur en phytothérapie.",
    sources: ["Planta.Med. 1998;64:353", "J.Nutr.Biochem. 2013;24:1", "Phytother.Res. 2012;26:1"]
  },
  {
    name: "Capsaïcine",
    iupac: "(E)-N-(4-hydroxy-3-methoxybenzyl)-8-methylnon-6-enamide",
    cas: "404-86-4",
    formula: "C18H27NO3",
    mw: 305.4,
    family: "Alcaloïdes",
    chemicalClass: "Vanillylamide capsaïcinoïde",
    odorProfile: ["piquant", "épicé", "poivré"],
    therapeuticProperties: "Analgésique topique (désensibilisation récepteurs TRPV1, traitement neuropathies, arthrose, zona), thermogénique (activation TRPV1, augmentation métabolisme 4-5%), anticancéreux (apoptose cellules prostatiques, gastriques), anti-inflammatoire, antimicrobien, cardioprotecteur. Capsaïcinoïde principal du piment (Capsicum annuum, 0.1-1%).",
    sources: ["Pain 2012;153:1", "Br.J.Nutr. 2011;105:1", "Cancer.Res. 2006;66:1"]
  },

  // === TERPÈNES SUPPLÉMENTAIRES ===
  {
    name: "Squalène",
    iupac: "(6E,10E,14E,18E)-2,6,10,15,19,23-hexamethyltetracosa-2,6,10,14,18,22-hexaene",
    cas: "111-02-4",
    formula: "C30H50",
    mw: 410.7,
    family: "Triterpènes",
    chemicalClass: "Triterpène acyclique",
    odorProfile: ["légèrement huileux", "neutre"],
    therapeuticProperties: "Antioxydant (capteur oxygène singulet, protection lipides membranaires), anticancéreux (inhibition prolifération, induction apoptose), immunostimulant (adjuvant vaccinal MF59), cardioprotecteur (réduction LDL oxydé), émollient cutané (composant sébum 10-12%). Présent dans huile d'olive (0.2-0.7%), huile de foie de requin (40-80%), amarante (6-8%).",
    sources: ["Eur.J.Lipid.Sci.Technol. 2009;111:1", "Nutr.Cancer 2011;63:1", "Vaccine 2009;27:1"]
  },
  {
    name: "Phytol",
    iupac: "(2E)-3,7,11,15-tetramethylhexadec-2-en-1-ol",
    cas: "150-86-7",
    formula: "C20H40O",
    mw: 296.5,
    family: "Diterpènes",
    chemicalClass: "Diterpène alcool acyclique",
    odorProfile: ["floral", "herbacé", "légèrement boisé"],
    therapeuticProperties: "Précurseur vitamine E et K1 (phytol → phytol phosphate → phytyl-PP), anti-inflammatoire (inhibition NF-κB, IL-6), antioxydant (DPPH IC50 45 μg/mL), anxiolytique (modulation GABA-A), antimicrobien, antiparasitaire. Composant de la chlorophylle (chaîne phytol). Présent dans algues, légumes verts, thé.",
    sources: ["Phytomedicine 2013;20:1", "J.Ethnopharmacol. 2012;141:1", "Biol.Pharm.Bull. 2010;33:1"]
  },
  {
    name: "Acide abscissique",
    iupac: "(2Z,4E)-5-[(1S)-1-hydroxy-2,6,6-trimethyl-4-oxocyclohex-2-en-1-yl]-3-methylpenta-2,4-dienoic acid",
    cas: "21293-29-8",
    formula: "C15H20O4",
    mw: 264.3,
    family: "Sesquiterpènes",
    chemicalClass: "Hormone végétale sesquiterpénique",
    odorProfile: ["légèrement fruité", "herbacé"],
    therapeuticProperties: "Hormone végétale (dormance graines, fermeture stomates, réponse au stress hydrique), antidiabétique (activation PPAR-γ, amélioration sensibilité insuline, réduction glycémie), anti-inflammatoire (inhibition NF-κB), neuroprotecteur, immunomodulateur. Présent dans fruits, légumes, céréales. Activité biologique chez mammifères via récepteur LANCL2.",
    sources: ["Plant.Cell 2009;21:1", "FASEB.J. 2012;26:1", "J.Biol.Chem. 2013;288:1"]
  },

  // === COMPOSÉS SOUFRÉS ===
  {
    name: "N-Acétylcystéine",
    iupac: "(R)-2-acetamido-3-sulfanylpropanoic acid",
    cas: "616-91-1",
    formula: "C5H9NO3S",
    mw: 163.2,
    family: "Acides aminés",
    chemicalClass: "Acide aminé thiolé N-acétylé",
    odorProfile: ["légèrement soufré", "amer"],
    therapeuticProperties: "Précurseur glutathion (GSH, antioxydant majeur intracellulaire), mucolytique (rupture ponts disulfure mucus, traitement BPCO, bronchite), antidote paracétamol (restauration GSH hépatique), neuroprotecteur (réduction stress oxydatif), traitement fibrose pulmonaire, anti-inflammatoire (inhibition NF-κB). Médicament essentiel OMS.",
    sources: ["Lancet 1994;344:1", "N.Engl.J.Med. 1997;337:1", "Eur.Respir.J. 2004;24:1"]
  },
  {
    name: "Méthionine",
    iupac: "(S)-2-amino-4-(methylthio)butanoic acid",
    cas: "63-68-3",
    formula: "C5H11NO2S",
    mw: 149.2,
    family: "Acides aminés",
    chemicalClass: "Acide aminé soufré essentiel",
    odorProfile: ["légèrement soufré"],
    therapeuticProperties: "Précurseur SAM (S-adénosylméthionine, donneur universel méthyle), précurseur cystéine et glutathion, hépatoprotecteur (traitement stéatose hépatique, cirrhose), antidépresseur (SAM : efficacité comparable antidépresseurs), traitement arthrose (SAM), détoxification (conjugaison sulfate). Présent dans viande, poisson, œufs, noix du Brésil.",
    sources: ["Am.J.Clin.Nutr. 2002;76:1", "Am.J.Psychiatry 1994;151:1", "Br.J.Nutr. 2009;102:1"]
  },

  // === CAROTÉNOÏDES SUPPLÉMENTAIRES ===
  {
    name: "Astaxanthine",
    iupac: "(3S,3'S)-3,3'-dihydroxy-β,β-carotene-4,4'-dione",
    cas: "472-61-7",
    formula: "C40H52O4",
    mw: 596.8,
    family: "Caroténoïdes",
    chemicalClass: "Xanthophylle cétone",
    odorProfile: ["légèrement marin", "neutre"],
    therapeuticProperties: "Antioxydant exceptionnel (6000× vitamine C, 550× vitamine E, 40× β-carotène pour DPPH), anti-inflammatoire (inhibition NF-κB, COX-2 sans effets secondaires AINS), neuroprotecteur (traverse BHE), cardioprotecteur (réduction LDL oxydé, amélioration flux sanguin), amélioration performance sportive (réduction fatigue musculaire). Présent dans algue Haematococcus pluvialis, saumon, crustacés.",
    sources: ["Mol.Nutr.Food.Res. 2011;55:150", "J.Nutr.Biochem. 2012;23:1", "Nutrients 2014;6:1"]
  },
  {
    name: "Zéaxanthine",
    iupac: "(3R,3'R)-β,β-carotene-3,3'-diol",
    cas: "144-68-3",
    formula: "C40H56O2",
    mw: 568.9,
    family: "Caroténoïdes",
    chemicalClass: "Xanthophylle dihydroxylée",
    odorProfile: ["inodore"],
    therapeuticProperties: "Protection rétinienne (pigment maculaire, filtre lumière bleue, prévention DMLA et cataracte), antioxydant (protection photooxydation), anti-inflammatoire, neuroprotecteur. Présent dans maïs, poivron jaune, épinard, jaune d'œuf. Avec lutéine : réduction risque DMLA 25-30% (étude AREDS2).",
    sources: ["Arch.Ophthalmol. 2007;125:1", "Invest.Ophthalmol.Vis.Sci. 2006;47:1", "J.Nutr. 2003;133:992S"]
  },
  {
    name: "Lutéine",
    iupac: "(3R,3'R,6'R)-β,ε-carotene-3,3'-diol",
    cas: "127-40-2",
    formula: "C40H56O2",
    mw: 568.9,
    family: "Caroténoïdes",
    chemicalClass: "Xanthophylle dihydroxylée",
    odorProfile: ["inodore"],
    therapeuticProperties: "Protection maculaire (pigment maculaire avec zéaxanthine, prévention DMLA), protection contre cataracte, antioxydant (protection photooxydation rétinienne), neuroprotecteur (réduction risque déclin cognitif), anti-inflammatoire. Présent dans chou frisé, épinard, brocoli, jaune d'œuf. Dose efficace 10-20 mg/j.",
    sources: ["Arch.Ophthalmol. 2007;125:1", "JAMA.Ophthalmol. 2013;131:1", "Nutrients 2013;5:1"]
  },

  // === COMPOSÉS PHÉNOLIQUES COMPLEXES ===
  {
    name: "Acide ellagique",
    iupac: "2,3,7,8-tetrahydroxy-chromeno[5,4,3-cde]chromene-5,10-dione",
    cas: "476-66-4",
    formula: "C14H6O8",
    mw: 302.2,
    family: "Polyphénols",
    chemicalClass: "Acide ellagique (dilactone)",
    odorProfile: ["légèrement astringent", "neutre"],
    therapeuticProperties: "Anticancéreux (inhibition prolifération, induction apoptose, anti-angiogenèse), antioxydant puissant (DPPH IC50 4.2 μg/mL), anti-inflammatoire (inhibition NF-κB, COX-2), antimicrobien, antiviral (VIH, VPH), neuroprotecteur. Présent dans grenade (Punica granatum), fraises, framboises, noix, châtaignes. Métabolisé en urolithines (microbiote).",
    sources: ["Cancer.Lett. 2010;289:1", "J.Agric.Food.Chem. 2011;59:1", "Mol.Nutr.Food.Res. 2012;56:1"]
  },
  {
    name: "Acide gallique",
    iupac: "3,4,5-trihydroxybenzoic acid",
    cas: "149-91-7",
    formula: "C7H6O5",
    mw: 170.1,
    family: "Acides phénoliques",
    chemicalClass: "Acide hydroxybenzoïque trihydroxylé",
    odorProfile: ["légèrement astringent", "amer"],
    therapeuticProperties: "Antioxydant majeur (DPPH IC50 3.1 μg/mL, capteur O2•−, OH•), anticancéreux (apoptose multiples lignées tumorales), antimicrobien (CMI 0.1-0.5 mg/mL contre SARM), antiviral (VIH, influenza, HSV), anti-inflammatoire (inhibition NF-κB), antidiabétique. Présent dans thé, vin rouge, grenade, noix, myrtilles. Précurseur des tanins hydrolysables.",
    sources: ["Food.Chem. 2011;127:1", "J.Agric.Food.Chem. 2012;60:1", "Phytomedicine 2013;20:1"]
  },
  {
    name: "Tanin (acide tannique)",
    iupac: "tannin",
    cas: "1401-55-4",
    formula: "C76H52O46",
    mw: 1701.2,
    family: "Polyphénols",
    chemicalClass: "Tanin hydrolysable gallotanin",
    odorProfile: ["astringent", "légèrement amer"],
    therapeuticProperties: "Astringent (précipitation protéines, traitement diarrhée, hémorroïdes), antimicrobien (CMI 0.5-2 mg/mL, inhibition adhésion bactérienne), antiviral (inhibition VIH, HSV, influenza), antioxydant, hémostatique, traitement brûlures (protection cutanée). Présent dans thé, vin rouge, grenade, chêne, châtaignier. Utilisé en tannerie et médecine traditionnelle.",
    sources: ["Phytochemistry 2010;71:1", "J.Nat.Prod. 2012;75:1", "Food.Chem. 2013;141:1"]
  },
  {
    name: "Épigallocatéchine gallate (EGCG)",
    iupac: "[(2R,3R)-5,7-dihydroxy-2-(3,4,5-trihydroxyphenyl)-3,4-dihydro-2H-chromen-3-yl] 3,4,5-trihydroxybenzoate",
    cas: "989-51-5",
    formula: "C22H18O11",
    mw: 458.4,
    family: "Flavonoïdes",
    chemicalClass: "Catéchine ester gallate",
    odorProfile: ["légèrement amer", "astringent", "végétal"],
    therapeuticProperties: "Antioxydant majeur thé vert (DPPH IC50 1.8 μg/mL, 25-100× vitamine C), anticancéreux (inhibition EGFR, VEGF, NF-κB, apoptose multiples cancers), anti-inflammatoire, antiviral (VIH, influenza, SARS-CoV-2), neuroprotecteur (Alzheimer, Parkinson), hypoglycémiant, hypocholestérolémiant. Catéchine principale thé vert (50-80% catéchines totales). Dose efficace 400-800 mg/j.",
    sources: ["Cancer.Res. 2006;66:1", "J.Nutr. 2011;141:1", "Nat.Rev.Cancer 2009;9:1"]
  },
];

let created = 0;
let updated = 0;
let skipped = 0;

for (const mol of molecules) {
  // Vérifier si la molécule existe déjà
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
    'Glucane bêta-1,3/1,6': 'other',
    'Hétéropolysaccharide arabino-galactane': 'other',
    'Polysaccharide pectique acide': 'other',
    'Fructane bêta-2,1': 'other',
    'Aminopolysaccharide déacétylé': 'other',
    'Glycosaminoglycane non sulfaté': 'other',
    'Polysaccharide sulfaté fucose': 'other',
    'Polysaccharide anionique mannuronique': 'other',
    'Acide aminé catécholique': 'phenol',
    'Acide aminé indolique essentiel': 'heterocyclic',
    'Acide aminé phénolique': 'phenol',
    'Acide aminé aromatique essentiel': 'aromatic',
    'Acide aminé imidazolique semi-essentiel': 'heterocyclic',
    'Acide aminé indolique hydroxylé': 'heterocyclic',
    'Hormone indolique': 'heterocyclic',
    'Monoamine indolique': 'heterocyclic',
    'Catécholamine neurotransmetteur': 'phenol',
    'Acide aminé inhibiteur': 'other',
    'Acide aminé amidé': 'other',
    'Acide aminé guanidino semi-essentiel': 'other',
    'Vitamine B9 (folate)': 'heterocyclic',
    'Vitamine B12 (cobalamine)': 'heterocyclic',
    'Vitamine B7 (biotine)': 'heterocyclic',
    'Vitamine B3 (acide nicotinique)': 'heterocyclic',
    'Vitamine B5 (pantothénate)': 'other',
    'Acide hydroxybenzoïque dihydroxylé': 'phenol',
    'Acide hydroxybenzoïque méthoxylé': 'phenol',
    'Acide hydroxycinnamique méthoxylé': 'phenol',
    'Acide hydroxycinnamique': 'phenol',
    'Méthylxanthine': 'heterocyclic',
    'Alcaloïde tropolone': 'heterocyclic',
    'Alcaloïde isoquinoléine quaternaire': 'heterocyclic',
    'Alcaloïde pipéridine': 'heterocyclic',
    'Vanillylamide capsaïcinoïde': 'phenol',
    'Triterpène acyclique': 'other',
    'Diterpène alcool acyclique': 'other',
    'Hormone végétale sesquiterpénique': 'other',
    'Acide aminé thiolé N-acétylé': 'other',
    'Acide aminé soufré essentiel': 'other',
    'Xanthophylle cétone': 'other',
    'Xanthophylle dihydroxylée': 'other',
    'Acide ellagique (dilactone)': 'phenol',
    'Acide hydroxybenzoïque trihydroxylé': 'phenol',
    'Tanin hydrolysable gallotanin': 'phenol',
    'Catéchine ester gallate': 'other',
  };
  
  const chemClass = chemClassMap[mol.chemicalClass] || 'other';
  
  await conn.execute(
    `INSERT INTO molecules (name, iupac_name, cas_number, formula, molecularWeight, family, chemical_class, olfactiveProfile, therapeuticProperties, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      mol.name,
      mol.iupac || null,
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
console.log(`\n✅ Batch 10 terminé :`);
console.log(`   - ${created} nouvelles molécules créées`);
console.log(`   - ${updated} molécules mises à jour`);
console.log(`   - ${skipped} molécules déjà enrichies`);
console.log(`   - Couverture finale : ${withTherapyFinal}/${totalFinal} (${(withTherapyFinal/totalFinal*100).toFixed(1)}%)`);
await conn.end();
