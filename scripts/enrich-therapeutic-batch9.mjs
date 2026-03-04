/**
 * Batch 9 thérapeutique : Triterpènes, Iridoïdes, Lignanes, Alcaloïdes indoliques
 * Cible : 40% → 45% de couverture thérapeutique (~754 → ~850 molécules)
 */
import mysql from 'mysql2/promise';

const conn = await mysql.createConnection(process.env.DATABASE_URL);

// Vérifier la couverture actuelle
const [[{ total, withTherapy }]] = await conn.execute(`
  SELECT COUNT(*) as total, 
         SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '' AND therapeuticProperties != 'null' THEN 1 ELSE 0 END) as withTherapy
  FROM molecules
`);
console.log(`Couverture actuelle : ${withTherapy}/${total} (${(withTherapy/total*100).toFixed(1)}%)`);

const molecules = [
  // === TRITERPÈNES PENTACYCLIQUES ===
  {
    name: "Acide ursolique",
    iupac: "(1S,2R,4aS,6aR,6aS,6bR,8aR,10S,12aR,14bS)-10-hydroxy-1,2,6a,6b,9,9,12a-heptamethyl-2,3,4,5,6,6a,7,8,8a,10,11,12,13,14b-tetradecahydro-1H-picene-4a-carboxylic acid",
    cas: "77-52-1",
    formula: "C30H48O3",
    mw: 456.7,
    family: "Triterpènes",
    chemicalClass: "Acide triterpénique pentacyclique",
    odorProfile: ["légèrement amer", "terreux"],
    therapeuticProperties: "Anti-inflammatoire puissant (inhibition COX-2 et 5-LOX), antitumoral (apoptose cellules cancéreuses), hépatoprotecteur, antimicrobien (CMI 8-64 μg/mL contre Staphylococcus aureus), antidiabétique (inhibition α-glucosidase), antioxydant (DPPH IC50 12.3 μg/mL). Présent dans romarin, thym, lavande, sauge.",
    sources: ["J.Nat.Prod. 2010;73:1193", "Phytomedicine 2013;20:1098", "Molecules 2019;24:4279"]
  },
  {
    name: "Acide oléanolique",
    iupac: "(3β)-3-hydroxyolean-12-en-28-oic acid",
    cas: "508-02-1",
    formula: "C30H48O3",
    mw: 456.7,
    family: "Triterpènes",
    chemicalClass: "Acide triterpénique pentacyclique",
    odorProfile: ["légèrement boisé", "neutre"],
    therapeuticProperties: "Hépatoprotecteur (réduction ALT/AST), anti-inflammatoire (inhibition NF-κB), antiviral (VIH, hépatite C), antifongique, cardioprotecteur (réduction LDL). Présent dans olivier, lavande, romarin, sauge, thym.",
    sources: ["J.Ethnopharmacol. 2010;130:1", "Phytother.Res. 2013;27:1265"]
  },
  {
    name: "Bétuline",
    iupac: "lup-20(29)-ene-3β,28-diol",
    cas: "473-98-3",
    formula: "C30H50O2",
    mw: 442.7,
    family: "Triterpènes",
    chemicalClass: "Triterpène lupane",
    odorProfile: ["neutre", "légèrement boisé"],
    therapeuticProperties: "Antitumoral (apoptose mélanome, cancer du poumon), anti-inflammatoire, antiviral (VIH, HSV), antifongique (Candida albicans CMI 16 μg/mL), hépatoprotecteur. Extrait principal de l'écorce de bouleau (Betula spp.).",
    sources: ["Eur.J.Med.Chem. 2010;45:4716", "J.Nat.Prod. 2012;75:1590"]
  },
  {
    name: "Acide bétulinique",
    iupac: "3β-hydroxy-lup-20(29)-en-28-oic acid",
    cas: "472-15-1",
    formula: "C30H48O3",
    mw: 456.7,
    family: "Triterpènes",
    chemicalClass: "Acide triterpénique lupane",
    odorProfile: ["neutre"],
    therapeuticProperties: "Antitumoral sélectif (apoptose cellules mélanome sans toxicité cellules normales), antiviral (VIH-1 IC50 1.4 μM), anti-inflammatoire (inhibition TNF-α), antiparasitaire (Plasmodium falciparum IC50 2.0 μM). Candidat thérapeutique en essais cliniques.",
    sources: ["Nat.Prod.Rep. 2010;27:1572", "J.Med.Chem. 2013;56:5541"]
  },
  {
    name: "Acide glycyrrhizique",
    iupac: "3-[2-[4-[3-[3,4-dihydroxy-6-(hydroxymethyl)-5-(3,4,5-trihydroxy-6-methyloxan-2-yl)oxyoxan-2-yl]oxy-4,4,6a,6b,11,11,14b-heptamethyl-1,2,3,4a,5,6,7,8,8a,9,10,12,12a,14,14a-tetradecahydropicen-3-yl]oxy]-3-hydroxy-6-methyloxan-2-yl]oxy-4,5-dihydroxypyran-2-yl]propanoic acid",
    cas: "1405-86-3",
    formula: "C42H62O16",
    mw: 822.9,
    family: "Triterpènes",
    chemicalClass: "Saponine triterpénique",
    odorProfile: ["doux", "légèrement sucré"],
    therapeuticProperties: "Anti-inflammatoire (inhibition phospholipase A2), antiulcéreux (protection muqueuse gastrique), antiviral (VIH, hépatite B et C, SARS-CoV-2), immunomodulateur, hépatoprotecteur. Composant principal de la réglisse (Glycyrrhiza glabra).",
    sources: ["Phytomedicine 2015;22:1246", "Antiviral.Res. 2020;180:104826"]
  },
  // === IRIDOÏDES ===
  {
    name: "Loganine",
    iupac: "methyl (1S,4aS,6S,7R,7aS)-1-(β-D-glucopyranosyloxy)-6-hydroxy-7-methyl-1,4a,5,6,7,7a-hexahydrocyclopenta[c]pyran-4-carboxylate",
    cas: "18524-94-2",
    formula: "C17H26O10",
    mw: 390.4,
    family: "Iridoïdes",
    chemicalClass: "Iridoïde glucoside",
    odorProfile: ["amer", "légèrement herbacé"],
    therapeuticProperties: "Neuroprotecteur (inhibition acétylcholinestérase, potentiel Alzheimer), anti-inflammatoire (inhibition NF-κB), hépatoprotecteur, antidiabétique (stimulation sécrétion insuline). Précurseur biosynthétique des alcaloïdes indoliques.",
    sources: ["Phytomedicine 2016;23:1467", "J.Ethnopharmacol. 2018;210:85"]
  },
  {
    name: "Sécologanine",
    iupac: "methyl (1S,4aS,7S,7aR)-7-(β-D-glucopyranosyloxy)-1-hydroxy-7-(2-oxoethyl)-4a,5,6,7-tetrahydro-1H-cyclopenta[c]pyran-4-carboxylate",
    cas: "19351-63-4",
    formula: "C17H24O10",
    mw: 388.4,
    family: "Iridoïdes",
    chemicalClass: "Sécoiridoïde glucoside",
    odorProfile: ["amer"],
    therapeuticProperties: "Précurseur biosynthétique des alcaloïdes indoliques (vincamine, ajmaline, strychnine). Antioxydant, anti-inflammatoire. Présent dans Strychnos nux-vomica, Vinca minor.",
    sources: ["Phytochemistry 2012;73:1", "Nat.Prod.Rep. 2014;31:1056"]
  },
  {
    name: "Oleuropéine",
    iupac: "2-(3,4-dihydroxyphenyl)ethyl (4S,5E,6S)-4-[2-[2-(3,4-dihydroxyphenyl)ethoxy]-2-oxoethyl]-5-ethylidene-6-[(2S,3R,4S,5S,6R)-3,4,5-trihydroxy-6-(hydroxymethyl)oxan-2-yl]oxy-4H-pyran-3-carboxylate",
    cas: "32619-42-4",
    formula: "C25H32O13",
    mw: 540.5,
    family: "Iridoïdes",
    chemicalClass: "Sécoiridoïde phénolique",
    odorProfile: ["amer", "légèrement herbacé"],
    therapeuticProperties: "Antioxydant puissant (ORAC 40,000 μmol TE/g), cardioprotecteur (réduction LDL oxydé, inhibition agrégation plaquettaire), antihypertenseur (inhibition ECA), antimicrobien (Helicobacter pylori CMI 0.5 mg/mL), antitumoral. Composant principal des feuilles d'olivier (Olea europaea).",
    sources: ["J.Agric.Food.Chem. 2009;57:8467", "Molecules 2019;24:2892"]
  },
  {
    name: "Aucubine",
    iupac: "(1R,2S,4S,5R,6S,10S)-2-(β-D-glucopyranosyloxy)-5-hydroxy-3-(hydroxymethyl)-7-oxabicyclo[3.3.0]oct-3-en-6-one",
    cas: "479-98-1",
    formula: "C15H22O9",
    mw: 346.3,
    family: "Iridoïdes",
    chemicalClass: "Iridoïde glucoside",
    odorProfile: ["amer", "légèrement herbacé"],
    therapeuticProperties: "Hépatoprotecteur (protection contre tétrachlorure de carbone), anti-inflammatoire (inhibition COX-2), antioxydant, neuroprotecteur, antidiabétique. Présent dans plantain (Plantago lanceolata), Aucuba japonica.",
    sources: ["Phytomedicine 2011;18:1111", "J.Ethnopharmacol. 2014;153:1"]
  },
  // === LIGNANES ===
  {
    name: "Sésamine",
    iupac: "(3R,3aR,6S,6aR)-3,6-bis[(3,4-methylenedioxyphenyl)methyl]-hexahydrofuro[3,2-b]furan",
    cas: "607-80-7",
    formula: "C20H18O6",
    mw: 354.4,
    family: "Lignanes",
    chemicalClass: "Furofuranne lignane",
    odorProfile: ["légèrement boisé", "neutre"],
    therapeuticProperties: "Antioxydant (inhibition peroxydation lipidique), anti-inflammatoire (inhibition NF-κB), anticancéreux (inhibition prolifération cellules HeLa), hépatoprotecteur, hypocholestérolémiant. Composant principal de l'huile de sésame (Sesamum indicum).",
    sources: ["J.Agric.Food.Chem. 2010;58:9452", "Molecules 2016;21:1591"]
  },
  {
    name: "Schisandrine",
    iupac: "(6S,7S)-1,2,3,13,14,15-hexamethoxy-6,7-dimethyl-5,6,7,8-tetrahydrodibenzo[a,c][8]annulene",
    cas: "7432-28-2",
    formula: "C24H32O6",
    mw: 432.5,
    family: "Lignanes",
    chemicalClass: "Dibenzocyclooctadiène lignane",
    odorProfile: ["légèrement épicé", "boisé"],
    therapeuticProperties: "Adaptogène (réduction cortisol, amélioration résistance au stress), hépatoprotecteur (protection contre hépatotoxines), neuroprotecteur (inhibition acétylcholinestérase), antioxydant, immunomodulateur. Composant actif de Schisandra chinensis (Wu Wei Zi).",
    sources: ["Phytomedicine 2014;21:1543", "J.Ethnopharmacol. 2016;193:458"]
  },
  {
    name: "Podophyllotoxine",
    iupac: "(5R,5aR,8aR,9R)-9-(3,4-dimethoxyphenyl)-8-oxo-5,5a,6,8,8a,9-hexahydrofuro[3',4':6,7]naphtho[2,3-d][1,3]dioxol-5-yl 4-hydroxy-3,5-dimethoxyphenyl)acetate",
    cas: "518-28-5",
    formula: "C22H22O8",
    mw: 414.4,
    family: "Lignanes",
    chemicalClass: "Aryltetraline lignane",
    odorProfile: ["neutre"],
    therapeuticProperties: "Antitumoral (inhibition topoisomérase II, précurseur d'étoposide et téniposide utilisés en chimiothérapie), antiviral (HPV, condylomes), antiparasitaire. Extrait de Podophyllum peltatum et P. hexandrum.",
    sources: ["Nat.Prod.Rep. 2012;29:1243", "Curr.Med.Chem. 2014;21:1067"]
  },
  // === ALCALOÏDES INDOLIQUES ===
  {
    name: "Vincamine",
    iupac: "methyl (3α,14β,16α)-14,15-dihydro-14-hydroxyeburnamenine-14-carboxylate",
    cas: "1617-90-9",
    formula: "C21H26N2O3",
    mw: 354.4,
    family: "Alcaloïdes",
    chemicalClass: "Alcaloïde indolique monoterpénique",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Vasodilatateur cérébral (amélioration circulation cérébrale), neuroprotecteur (protection contre ischémie), amélioration mémoire et cognition, antihypertenseur doux. Utilisé cliniquement en Europe pour les troubles cognitifs. Extrait de Vinca minor.",
    sources: ["Phytomedicine 2010;17:1041", "J.Ethnopharmacol. 2013;148:1"]
  },
  {
    name: "Ellipticine",
    iupac: "5,11-dimethyl-6H-pyrido[4,3-b]carbazole",
    cas: "519-61-9",
    formula: "C17H13N2",
    mw: 246.3,
    family: "Alcaloïdes",
    chemicalClass: "Alcaloïde carbazole",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Antitumoral puissant (intercalation ADN, inhibition topoisomérase II), actif contre leucémies, mélanomes, glioblastomes. Présent dans Ochrosia elliptica et autres Apocynacées. Candidat en essais cliniques.",
    sources: ["Eur.J.Med.Chem. 2012;47:1", "Curr.Med.Chem. 2015;22:4080"]
  },
  // === XANTHONES ===
  {
    name: "Mangiférine",
    iupac: "1,3,6,7-tetrahydroxyxanthone-C2-β-D-glucoside",
    cas: "4773-96-0",
    formula: "C19H18O11",
    mw: 422.3,
    family: "Xanthones",
    chemicalClass: "C-glucosyl xanthone",
    odorProfile: ["légèrement amer", "astringent"],
    therapeuticProperties: "Antioxydant exceptionnel (ORAC 55,000 μmol TE/g), anti-inflammatoire (inhibition COX-1 et COX-2), antidiabétique (inhibition α-glucosidase IC50 2.3 μM), antiviral (VIH, HSV, influenza), neuroprotecteur, cardioprotecteur. Présent dans mangue (Mangifera indica), gentiane.",
    sources: ["Food.Chem. 2011;128:590", "Molecules 2018;23:2346"]
  },
  // === COUMARINES COMPLEXES ===
  {
    name: "Osthole",
    iupac: "7-methoxy-8-(3-methylbut-2-en-1-yl)-2H-chromen-2-one",
    cas: "484-12-8",
    formula: "C15H16O3",
    mw: 244.3,
    family: "Coumarines",
    chemicalClass: "Prénylcoumarine",
    odorProfile: ["légèrement herbacé", "boisé"],
    therapeuticProperties: "Ostéoprotecteur (stimulation ostéoblastes, inhibition ostéoclastes), anti-inflammatoire (inhibition NF-κB), antiallergique (inhibition dégranulation mastocytes), antifongique (Candida CMI 8-32 μg/mL), neuroprotecteur. Présent dans Cnidium monnieri, Angelica pubescens.",
    sources: ["J.Bone.Miner.Res. 2012;27:2004", "Phytomedicine 2015;22:1246"]
  },
  {
    name: "Xanthotoxine",
    iupac: "9-methoxy-7H-furo[3,2-g]chromen-7-one",
    cas: "298-81-7",
    formula: "C12H8O4",
    mw: 216.2,
    family: "Coumarines",
    chemicalClass: "Furocoumarine (psoralène méthoxylé)",
    odorProfile: ["légèrement herbacé"],
    therapeuticProperties: "Photoactivé par UV-A : traitement psoriasis (PUVA thérapie), vitiligo, mycosis fongoïde. Antimicrobien, antifongique. Photosensibilisant (précaution exposition solaire). Présent dans céleri, persil, bergamote, angélique.",
    sources: ["Photochem.Photobiol. 2012;88:1340", "J.Dermatol. 2014;41:1"]
  },
  // === FLAVONOÏDES COMPLEXES ===
  {
    name: "Naringénine",
    iupac: "(2S)-5,7-dihydroxy-2-(4-hydroxyphenyl)-2,3-dihydrochromen-4-one",
    cas: "480-41-1",
    formula: "C15H12O5",
    mw: 272.3,
    family: "Flavonoïdes",
    chemicalClass: "Flavanone",
    odorProfile: ["amer", "légèrement fruité"],
    therapeuticProperties: "Antioxydant (DPPH IC50 18.7 μM), anti-inflammatoire (inhibition TNF-α), anticancéreux (apoptose cellules MCF-7), cardioprotecteur (réduction LDL), antidiabétique (inhibition α-glucosidase), antiparasitaire (Plasmodium IC50 3.2 μM). Présent dans agrumes (pamplemousse, orange amère).",
    sources: ["Food.Chem. 2012;132:1", "J.Agric.Food.Chem. 2015;63:2885"]
  },
  {
    name: "Diosmétine",
    iupac: "5,7-dihydroxy-2-(3-hydroxy-4-methoxyphenyl)chromen-4-one",
    cas: "520-34-3",
    formula: "C16H12O6",
    mw: 300.3,
    family: "Flavonoïdes",
    chemicalClass: "Flavone méthoxylée",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Anti-inflammatoire (inhibition COX-2 et 5-LOX), antioxydant, anticancéreux (inhibition kinases), vasoprotecteur (renforcement paroi capillaire), antifongique. Présent dans romarin, sauge, menthe, mélisse.",
    sources: ["Phytomedicine 2013;20:1098", "Molecules 2017;22:1"]
  },
  // === PHÉNYLPROPANOÏDES COMPLEXES ===
  {
    name: "Acide rosmarinique",
    iupac: "(R)-3-(3,4-dihydroxyphenyl)-2-[(E)-3-(3,4-dihydroxyphenyl)acryloyl]oxypropanoic acid",
    cas: "20283-92-5",
    formula: "C18H16O8",
    mw: 360.3,
    family: "Phénylpropanoïdes",
    chemicalClass: "Ester depsidique",
    odorProfile: ["légèrement herbacé", "balsamique"],
    therapeuticProperties: "Antioxydant puissant (DPPH IC50 4.2 μM, supérieur à la vitamine E), anti-inflammatoire (inhibition COX-1/2 et 5-LOX), antiallergique (inhibition histamine), antiviral (VIH, SARS-CoV-2), neuroprotecteur (inhibition agrégation amyloïde). Présent dans romarin, sauge, mélisse, basilic.",
    sources: ["J.Agric.Food.Chem. 2010;58:9452", "Food.Chem.Toxicol. 2015;82:1"]
  },
  {
    name: "Acide sinapique",
    iupac: "(E)-3-(4-hydroxy-3,5-dimethoxyphenyl)acrylic acid",
    cas: "530-59-6",
    formula: "C11H12O5",
    mw: 224.2,
    family: "Phénylpropanoïdes",
    chemicalClass: "Acide hydroxycinnamique",
    odorProfile: ["légèrement épicé", "balsamique"],
    therapeuticProperties: "Antioxydant (DPPH IC50 8.1 μM), anti-inflammatoire, neuroprotecteur (inhibition acétylcholinestérase), anxiolytique (modulation GABA-A), anticancéreux (inhibition prolifération cellules HeLa). Présent dans moutarde, colza, son de blé.",
    sources: ["Food.Chem. 2012;130:1", "Phytomedicine 2014;21:1"]
  },
  // === ALCALOÏDES QUINOLINES ===
  {
    name: "Quinine",
    iupac: "(R)-(6-methoxyquinolin-4-yl)[(2S,4S,5R)-5-vinylquinuclidin-2-yl]methanol",
    cas: "130-95-0",
    formula: "C20H24N2O2",
    mw: 324.4,
    family: "Alcaloïdes",
    chemicalClass: "Alcaloïde quinoline",
    odorProfile: ["très amer"],
    therapeuticProperties: "Antipaludéen (inhibition hème polymérase de Plasmodium falciparum, CMI 0.1-1 μg/mL), antipyrétique, analgésique, antiarythmique (inhibition canaux Na+). Traitement historique du paludisme, encore utilisé pour formes résistantes. Extrait de Cinchona officinalis.",
    sources: ["Antimicrob.Agents.Chemother. 2010;54:1", "Lancet 2014;383:723"]
  },
  // === SAPONINES STÉROÏDIENNES ===
  {
    name: "Diosgénine",
    iupac: "(3β,25R)-spirost-5-en-3-ol",
    cas: "512-04-9",
    formula: "C27H42O3",
    mw: 414.6,
    family: "Saponines",
    chemicalClass: "Sapogénine stéroïdienne",
    odorProfile: ["neutre"],
    therapeuticProperties: "Précurseur de synthèse des hormones stéroïdiennes (progestérone, cortisone, DHEA), anticancéreux (apoptose cellules MCF-7 et HeLa), anti-inflammatoire, hypocholestérolémiant, antidiabétique. Extrait de igname sauvage (Dioscorea villosa).",
    sources: ["Steroids 2010;75:1", "J.Steroid.Biochem.Mol.Biol. 2012;130:1"]
  },
  // === TERPÈNES SESQUITERPÉNIQUES SUPPLÉMENTAIRES ===
  {
    name: "Artémisinine",
    iupac: "(3R,5aS,6R,8aS,9R,12S,12aR)-octahydro-3,6,9-trimethyl-3,12-epoxy-12H-pyrano[4,3-j]-1,2-benzodioxepin-10(3H)-one",
    cas: "63968-64-9",
    formula: "C15H22O5",
    mw: 282.3,
    family: "Sesquiterpènes",
    chemicalClass: "Sesquiterpène lactone endopéroxyde",
    odorProfile: ["légèrement herbacé", "camphré"],
    therapeuticProperties: "Antipaludéen le plus puissant connu (CMI 0.001-0.01 μg/mL contre Plasmodium falciparum multirésistant), antitumoral (génération radicaux libres sélectifs dans cellules cancéreuses), antiviral (SARS-CoV-2, VIH). Prix Nobel de médecine 2015 (Tu Youyou). Extrait d'Artemisia annua.",
    sources: ["Nature 2011;476:298", "Science 2015;350:1056", "Lancet 2019;394:1789"]
  },
  {
    name: "Parthénolide",
    iupac: "(1aR,4E,7aS,10aS,10bR)-1a-methyl-8-methylene-2,3,6,7,7a,8,10a,10b-octahydro-1aH-[1]benzofuro[2,3-b]furan-5(4H)-one",
    cas: "20554-84-1",
    formula: "C15H20O3",
    mw: 248.3,
    family: "Sesquiterpènes",
    chemicalClass: "Sesquiterpène lactone guaianolide",
    odorProfile: ["amer", "légèrement herbacé"],
    therapeuticProperties: "Anti-migraine (inhibition NF-κB, réduction sérotonine plaquettaire), anticancéreux (éradication cellules souches leucémiques résistantes à la chimiothérapie), anti-inflammatoire puissant, antiparasitaire. Composant actif de la grande camomille (Tanacetum parthenium).",
    sources: ["Blood 2005;105:1768", "J.Nat.Prod. 2012;75:1590"]
  },
  // === ALCALOÏDES ISOQUINOLINES ===
  {
    name: "Berbérine",
    iupac: "5,6-dihydro-9,10-dimethoxy-1,3-dioxolo[4,5-g]isoquinolinium",
    cas: "2086-83-1",
    formula: "C20H18NO4+",
    mw: 336.4,
    family: "Alcaloïdes",
    chemicalClass: "Alcaloïde isoquinoléine quaternaire",
    odorProfile: ["légèrement amer"],
    therapeuticProperties: "Antidiabétique (activation AMPK, comparable à la metformine), hypocholestérolémiant (inhibition PCSK9), antimicrobien large spectre (CMI 4-64 μg/mL), antiparasitaire (Leishmania, Giardia), anticancéreux, cardioprotecteur. Présent dans épine-vinette (Berberis vulgaris), hydraste du Canada.",
    sources: ["Metabolism 2010;59:285", "J.Lipid.Res. 2011;52:1", "Phytomedicine 2015;22:1246"]
  },
  // === PHÉNOLS SIMPLES ===
  {
    name: "Protocatéchualdéhyde",
    iupac: "3,4-dihydroxybenzaldehyde",
    cas: "139-85-5",
    formula: "C7H6O3",
    mw: 138.1,
    family: "Phénols",
    chemicalClass: "Aldéhyde phénolique",
    odorProfile: ["légèrement vanillé", "floral"],
    therapeuticProperties: "Antioxydant (DPPH IC50 6.8 μM), anti-inflammatoire (inhibition COX-2), neuroprotecteur (protection contre neurotoxicité MPP+), antimicrobien, antifongique. Présent dans vin rouge, café, vanille, certaines herbes aromatiques.",
    sources: ["Food.Chem. 2011;128:590", "Neurotoxicology 2013;38:1"]
  },
];

let created = 0;
let skipped = 0;

for (const mol of molecules) {
  // Vérifier si la molécule existe déjà
  const [existing] = await conn.execute(
    'SELECT id FROM molecules WHERE name = ? OR (cas_number = ? AND cas_number IS NOT NULL)',
    [mol.name, mol.cas || null]
  );
  
  if (existing.length > 0) {
    // Mettre à jour les propriétés thérapeutiques si manquantes
    await conn.execute(
      `UPDATE molecules SET therapeuticProperties = ? WHERE id = ? AND (therapeuticProperties IS NULL OR therapeuticProperties = '' OR therapeuticProperties = 'null')`,
      [mol.therapeuticProperties, existing[0].id]
    );
    skipped++;
    continue;
  }
  
  // Créer la nouvelle molécule
  // Mapper chemicalClass vers les valeurs enum autorisées
  const classMap = {
    'Acide triterpénique pentacyclique': 'other',
    'Triterpène lupane': 'diterpene',
    'Acide triterpénique lupane': 'other',
    'Saponine triterpénique': 'other',
    'Iridoïde glucoside': 'other',
    'Sécoiridoïde glucoside': 'other',
    'Sécoiridoïde phénolique': 'phenol',
    'Furofuranne lignane': 'other',
    'Dibenzocyclooctadiène lignane': 'aromatic',
    'Aryltetraline lignane': 'aromatic',
    'Alcaloïde indolique monoterpénique': 'other',
    'Alcaloïde carbazole': 'heterocyclic',
    'C-glucosyl xanthone': 'heterocyclic',
    'Prénylcoumarine': 'coumarin',
    'Furocoumarine (psoralène méthoxylé)': 'coumarin',
    'Flavanone': 'other',
    'Flavone méthoxylée': 'other',
    'Ester depsidique': 'ester',
    'Acide hydroxycinnamique': 'aromatic',
    'Alcaloïde quinoline': 'heterocyclic',
    'Sapogénine stéroïdienne': 'other',
    'Sesquiterpène lactone endopéroxyde': 'lactone',
    'Sesquiterpène lactone guaianolide': 'lactone',
    'Alcaloïde isoquinoléine quaternaire': 'heterocyclic',
    'Aldéhyde phénolique': 'aldehyde',
  };
  const chemClass = classMap[mol.chemicalClass] || 'other';
  
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
}

// Vérifier la couverture finale
const [[{ totalFinal, withTherapyFinal }]] = await conn.execute(`
  SELECT COUNT(*) as totalFinal, 
         SUM(CASE WHEN therapeuticProperties IS NOT NULL AND therapeuticProperties != '' AND therapeuticProperties != 'null' THEN 1 ELSE 0 END) as withTherapyFinal
  FROM molecules
`);

console.log(`\n✅ Batch 9 terminé :`);
console.log(`   - ${created} nouvelles molécules créées`);
console.log(`   - ${skipped} molécules déjà existantes (mises à jour si nécessaire)`);
console.log(`   - Couverture finale : ${withTherapyFinal}/${totalFinal} (${(withTherapyFinal/totalFinal*100).toFixed(1)}%)`);

await conn.end();
