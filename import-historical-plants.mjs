/**
 * PERFUMUM - Import des plantes historiques
 * Jour 3 de la roadmap : Myrrhe et 6 espèces de Boswellia (encens)
 * 
 * Sources scientifiques :
 * - Batiha et al. 2022 - Commiphora myrrh: a phytochemical and pharmacological review
 * - Hanuš et al. 2005 - Commiphora Chemistry
 * - Miran et al. 2022 - Taxonomical Investigation of Boswellia
 * - Huang et al. 2022 - Review of Chemical Composition of B. carterii
 */

import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);

  console.log("🌿 Import des plantes historiques - PERFUMUM");
  console.log("=".repeat(60));

  // ============================================================================
  // MOLÉCULES DE LA MYRRHE
  // ============================================================================
  const myrrhMolecules = [
    {
      name: "Furanoeudesma-1,3-diène",
      iupac_name: "(4aS,8aS)-3,5,8a-trimethyl-4,4a,8a,9-tetrahydronaphtho[2,3-b]furan",
      cas_number: "87605-93-4",
      chemical_class: "sesquiterpene",
      family: "Furanosesquiterpène",
      chemicalFormula: "C15H20O",
      olfactiveProfile: "Caractéristique de la myrrhe, balsamique, légèrement fumé",
      emotionalResonance: "Sacré, méditatif, ancrage spirituel",
      functionalEffect: "Analgésique, anti-inflammatoire",
      sourceOrigin: "Commiphora myrrha (résine)",
      molecularWeight: 216,
      boilingPoint: 280,
      therapeuticProperties: "Analgésique puissant, anti-inflammatoire, anxiolytique",
      radar_intensity: 75,
      radar_freshness: 20,
      radar_warmth: 80,
      radar_sweetness: 30,
      radar_spiciness: 40,
      radar_earthiness: 85,
    },
    {
      name: "Curzérène",
      iupac_name: "1,2,3,5,6,7-hexahydro-1,4-dimethyl-7-(1-methylethenyl)azulene",
      cas_number: "17910-09-7",
      chemical_class: "sesquiterpene",
      family: "Sesquiterpène",
      chemicalFormula: "C15H22",
      olfactiveProfile: "Épicé, balsamique, légèrement boisé",
      emotionalResonance: "Chaleur, protection, rituel",
      functionalEffect: "Anti-inflammatoire",
      sourceOrigin: "Commiphora myrrha, Curcuma",
      molecularWeight: 202,
      boilingPoint: 265,
      therapeuticProperties: "Anti-inflammatoire, antioxydant",
      radar_intensity: 65,
      radar_freshness: 25,
      radar_warmth: 75,
      radar_sweetness: 25,
      radar_spiciness: 55,
      radar_earthiness: 70,
    },
    {
      name: "Furanodienone",
      iupac_name: "4,5,9,10-tetrahydro-3,6,10-trimethyl-2H-oxecin-2-one",
      cas_number: "24268-41-5",
      chemical_class: "sesquiterpene",
      family: "Furanosesquiterpène",
      chemicalFormula: "C15H20O2",
      olfactiveProfile: "Balsamique profond, résineux, légèrement amer",
      emotionalResonance: "Introspection, méditation profonde",
      functionalEffect: "Analgésique, sédatif léger",
      sourceOrigin: "Commiphora myrrha (résine)",
      molecularWeight: 232,
      boilingPoint: 295,
      therapeuticProperties: "Analgésique, anti-tumoral potentiel, anti-inflammatoire",
      radar_intensity: 70,
      radar_freshness: 15,
      radar_warmth: 85,
      radar_sweetness: 20,
      radar_spiciness: 35,
      radar_earthiness: 90,
    },
    {
      name: "Lindestrène",
      iupac_name: "1,2,3,4,4a,5,6,8a-octahydro-7-methyl-4-methylenenaphthalene",
      cas_number: "5765-38-8",
      chemical_class: "sesquiterpene",
      family: "Sesquiterpène",
      chemicalFormula: "C15H22",
      olfactiveProfile: "Herbacé, légèrement boisé",
      emotionalResonance: "Clarté, éveil",
      functionalEffect: "Stimulant léger",
      sourceOrigin: "Commiphora myrrha, Lindera",
      molecularWeight: 202,
      boilingPoint: 250,
      therapeuticProperties: "Stimulant circulatoire",
      radar_intensity: 50,
      radar_freshness: 45,
      radar_warmth: 55,
      radar_sweetness: 30,
      radar_spiciness: 40,
      radar_earthiness: 60,
    },
    {
      name: "β-Élémène",
      iupac_name: "(1S,2S,4R)-1-ethenyl-1-methyl-2,4-bis(prop-1-en-2-yl)cyclohexane",
      cas_number: "515-13-9",
      chemical_class: "sesquiterpene",
      family: "Élémane",
      chemicalFormula: "C15H24",
      olfactiveProfile: "Frais, herbacé, légèrement citronné",
      emotionalResonance: "Fraîcheur, renouveau",
      functionalEffect: "Rafraîchissant, purifiant",
      sourceOrigin: "Commiphora myrrha, Curcuma, Gingembre",
      molecularWeight: 204,
      boilingPoint: 258,
      therapeuticProperties: "Anti-tumoral, anti-inflammatoire, immunomodulateur",
      radar_intensity: 55,
      radar_freshness: 60,
      radar_warmth: 40,
      radar_sweetness: 35,
      radar_spiciness: 45,
      radar_earthiness: 50,
    },
    {
      name: "Germacrène B",
      iupac_name: "(1E,4E,8E)-1,5,5-trimethyl-8-methylenecycloundeca-1,4,8-triene",
      cas_number: "15423-57-1",
      chemical_class: "sesquiterpene",
      family: "Germacrène",
      chemicalFormula: "C15H24",
      olfactiveProfile: "Boisé, terreux, légèrement épicé",
      emotionalResonance: "Ancrage, stabilité",
      functionalEffect: "Calmant",
      sourceOrigin: "Commiphora myrrha, nombreuses plantes",
      molecularWeight: 204,
      boilingPoint: 270,
      therapeuticProperties: "Antimicrobien, anti-inflammatoire",
      radar_intensity: 60,
      radar_freshness: 30,
      radar_warmth: 65,
      radar_sweetness: 25,
      radar_spiciness: 50,
      radar_earthiness: 75,
    },
    {
      name: "β-Sélinène",
      iupac_name: "(3S,4aR,8aS)-3-isopropenyl-4a,8-dimethyl-1,2,3,4,4a,5,6,8a-octahydronaphthalene",
      cas_number: "17066-67-0",
      chemical_class: "sesquiterpene",
      family: "Sélinane",
      chemicalFormula: "C15H24",
      olfactiveProfile: "Boisé, céleri, légèrement herbacé",
      emotionalResonance: "Enracinement, connexion à la terre",
      functionalEffect: "Stabilisant",
      sourceOrigin: "Commiphora myrrha, Céleri",
      molecularWeight: 204,
      boilingPoint: 275,
      therapeuticProperties: "Antispasmodique, sédatif léger",
      radar_intensity: 55,
      radar_freshness: 35,
      radar_warmth: 60,
      radar_sweetness: 20,
      radar_spiciness: 35,
      radar_earthiness: 80,
    },
    {
      name: "Isocericenine",
      iupac_name: null,
      cas_number: null,
      chemical_class: "sesquiterpene",
      family: "Furanosesquiterpène",
      chemicalFormula: "C15H20O2",
      olfactiveProfile: "Résineux, balsamique, caractéristique myrrhe",
      emotionalResonance: "Sacré, ancien",
      functionalEffect: "Méditatif",
      sourceOrigin: "Commiphora myrrha",
      molecularWeight: 232,
      boilingPoint: 290,
      therapeuticProperties: "Anti-inflammatoire",
      radar_intensity: 65,
      radar_freshness: 20,
      radar_warmth: 80,
      radar_sweetness: 25,
      radar_spiciness: 30,
      radar_earthiness: 85,
    },
    {
      name: "Myrcénol",
      iupac_name: "2,6-dimethyloct-7-en-2-ol",
      cas_number: "543-39-5",
      chemical_class: "alcohol",
      family: "Monoterpénol",
      chemicalFormula: "C10H20O",
      olfactiveProfile: "Floral, lavande, légèrement boisé",
      emotionalResonance: "Douceur, apaisement",
      functionalEffect: "Relaxant",
      sourceOrigin: "Commiphora myrrha, Lavande",
      molecularWeight: 156,
      boilingPoint: 220,
      therapeuticProperties: "Relaxant, sédatif léger",
      radar_intensity: 50,
      radar_freshness: 55,
      radar_warmth: 45,
      radar_sweetness: 60,
      radar_spiciness: 20,
      radar_earthiness: 40,
    },
  ];

  // ============================================================================
  // MOLÉCULES DE L'ENCENS (BOSWELLIA)
  // ============================================================================
  const frankincenseMolecules = [
    {
      name: "Acide β-boswellique",
      iupac_name: "(3α,4β)-3-hydroxyurs-12-en-24-oic acid",
      cas_number: "631-69-6",
      chemical_class: "other",
      family: "Triterpène pentacyclique",
      chemicalFormula: "C30H48O3",
      olfactiveProfile: "Peu odorant, légèrement résineux",
      emotionalResonance: "Sacré, purification",
      functionalEffect: "Anti-inflammatoire puissant",
      sourceOrigin: "Boswellia spp. (résine)",
      molecularWeight: 456,
      boilingPoint: 450,
      therapeuticProperties: "Anti-inflammatoire puissant, anti-arthritique, neuroprotecteur",
      radar_intensity: 20,
      radar_freshness: 10,
      radar_warmth: 50,
      radar_sweetness: 10,
      radar_spiciness: 15,
      radar_earthiness: 60,
    },
    {
      name: "Acide 11-céto-β-boswellique (KBA)",
      iupac_name: "(3α)-3-hydroxy-11-oxours-12-en-24-oic acid",
      cas_number: "17019-92-0",
      chemical_class: "other",
      family: "Triterpène pentacyclique",
      chemicalFormula: "C30H46O4",
      olfactiveProfile: "Très faible, résineux subtil",
      emotionalResonance: "Guérison, transformation",
      functionalEffect: "Anti-inflammatoire, anti-tumoral",
      sourceOrigin: "Boswellia serrata, B. sacra",
      molecularWeight: 470,
      boilingPoint: 460,
      therapeuticProperties: "Inhibiteur de 5-lipoxygénase, anti-tumoral, anti-inflammatoire",
      radar_intensity: 15,
      radar_freshness: 5,
      radar_warmth: 45,
      radar_sweetness: 5,
      radar_spiciness: 10,
      radar_earthiness: 55,
    },
    {
      name: "AKBA (Acide 3-O-acétyl-11-céto-β-boswellique)",
      iupac_name: "(3α)-3-acetoxy-11-oxours-12-en-24-oic acid",
      cas_number: "67416-61-9",
      chemical_class: "other",
      family: "Triterpène pentacyclique",
      chemicalFormula: "C32H48O5",
      olfactiveProfile: "Très faible odeur",
      emotionalResonance: "Purification profonde",
      functionalEffect: "Anti-inflammatoire le plus puissant",
      sourceOrigin: "Boswellia serrata (résine)",
      molecularWeight: 512,
      boilingPoint: 480,
      therapeuticProperties: "Anti-inflammatoire le plus puissant des acides boswelliques, anti-tumoral, neuroprotecteur",
      radar_intensity: 10,
      radar_freshness: 5,
      radar_warmth: 40,
      radar_sweetness: 5,
      radar_spiciness: 5,
      radar_earthiness: 50,
    },
    {
      name: "Incensole",
      iupac_name: "Cembrane diterpene",
      cas_number: "68480-88-6",
      chemical_class: "diterpene",
      family: "Diterpène",
      chemicalFormula: "C20H34O",
      olfactiveProfile: "Encens caractéristique, balsamique, légèrement sucré",
      emotionalResonance: "Spiritualité, élévation, paix intérieure",
      functionalEffect: "Anxiolytique, antidépresseur",
      sourceOrigin: "Boswellia sacra, B. carterii",
      molecularWeight: 290,
      boilingPoint: 320,
      therapeuticProperties: "Anxiolytique puissant, antidépresseur, neuroprotecteur, active TRPV3",
      radar_intensity: 70,
      radar_freshness: 30,
      radar_warmth: 75,
      radar_sweetness: 45,
      radar_spiciness: 25,
      radar_earthiness: 65,
    },
    {
      name: "Acétate d'incensole",
      iupac_name: "Incensole acetate",
      cas_number: "68480-89-7",
      chemical_class: "diterpene",
      family: "Diterpène",
      chemicalFormula: "C22H36O2",
      olfactiveProfile: "Encens doux, balsamique, légèrement floral",
      emotionalResonance: "Sérénité, méditation, connexion spirituelle",
      functionalEffect: "Anxiolytique, antidépresseur puissant",
      sourceOrigin: "Boswellia sacra, B. carterii",
      molecularWeight: 332,
      boilingPoint: 340,
      therapeuticProperties: "Anxiolytique, antidépresseur, anti-inflammatoire cérébral",
      radar_intensity: 65,
      radar_freshness: 35,
      radar_warmth: 70,
      radar_sweetness: 50,
      radar_spiciness: 20,
      radar_earthiness: 60,
    },
    {
      name: "Olibanol",
      iupac_name: null,
      cas_number: null,
      chemical_class: "alcohol",
      family: "Monoterpénol",
      chemicalFormula: "C10H18O",
      olfactiveProfile: "Encens typique, balsamique doux",
      emotionalResonance: "Sacré, rituel",
      functionalEffect: "Calmant",
      sourceOrigin: "Boswellia spp.",
      molecularWeight: 154,
      boilingPoint: 210,
      therapeuticProperties: "Calmant, antiseptique léger",
      radar_intensity: 55,
      radar_freshness: 40,
      radar_warmth: 65,
      radar_sweetness: 45,
      radar_spiciness: 15,
      radar_earthiness: 55,
    },
  ];

  // ============================================================================
  // IMPORT DES MOLÉCULES
  // ============================================================================
  console.log("\n📦 Import des molécules de la myrrhe...");
  
  for (const mol of myrrhMolecules) {
    try {
      // Vérifier si la molécule existe déjà
      const [existing] = await connection.execute(
        "SELECT id FROM molecules WHERE name = ? LIMIT 1",
        [mol.name]
      );
      
      if (existing.length > 0) {
        console.log(`  ⏭️  ${mol.name} existe déjà (ID: ${existing[0].id})`);
        continue;
      }
      
      await connection.execute(
        `INSERT INTO molecules (name, iupac_name, cas_number, chemical_class, family, chemicalFormula, 
         olfactiveProfile, emotionalResonance, functionalEffect, sourceOrigin, molecularWeight, boilingPoint,
         therapeuticProperties, radar_intensity, radar_freshness, radar_warmth, radar_sweetness, radar_spiciness, radar_earthiness)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [mol.name, mol.iupac_name, mol.cas_number, mol.chemical_class, mol.family, mol.chemicalFormula,
         mol.olfactiveProfile, mol.emotionalResonance, mol.functionalEffect, mol.sourceOrigin, mol.molecularWeight, mol.boilingPoint,
         mol.therapeuticProperties, mol.radar_intensity, mol.radar_freshness, mol.radar_warmth, mol.radar_sweetness, mol.radar_spiciness, mol.radar_earthiness]
      );
      console.log(`  ✅ ${mol.name} importé`);
    } catch (error) {
      console.error(`  ❌ Erreur pour ${mol.name}:`, error.message);
    }
  }

  console.log("\n📦 Import des molécules de l'encens (Boswellia)...");
  
  for (const mol of frankincenseMolecules) {
    try {
      const [existing] = await connection.execute(
        "SELECT id FROM molecules WHERE name = ? LIMIT 1",
        [mol.name]
      );
      
      if (existing.length > 0) {
        console.log(`  ⏭️  ${mol.name} existe déjà (ID: ${existing[0].id})`);
        continue;
      }
      
      await connection.execute(
        `INSERT INTO molecules (name, iupac_name, cas_number, chemical_class, family, chemicalFormula, 
         olfactiveProfile, emotionalResonance, functionalEffect, sourceOrigin, molecularWeight, boilingPoint,
         therapeuticProperties, radar_intensity, radar_freshness, radar_warmth, radar_sweetness, radar_spiciness, radar_earthiness)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [mol.name, mol.iupac_name, mol.cas_number, mol.chemical_class, mol.family, mol.chemicalFormula,
         mol.olfactiveProfile, mol.emotionalResonance, mol.functionalEffect, mol.sourceOrigin, mol.molecularWeight, mol.boilingPoint,
         mol.therapeuticProperties, mol.radar_intensity, mol.radar_freshness, mol.radar_warmth, mol.radar_sweetness, mol.radar_spiciness, mol.radar_earthiness]
      );
      console.log(`  ✅ ${mol.name} importé`);
    } catch (error) {
      console.error(`  ❌ Erreur pour ${mol.name}:`, error.message);
    }
  }

  // ============================================================================
  // PLANTES HISTORIQUES
  // ============================================================================
  const historicalPlants = [
    {
      name: "Myrrhe",
      latin_name: "Commiphora myrrha",
      family: "Burseraceae",
      category: "resine",
      origin: "Corne de l'Afrique, Péninsule arabique",
      habitat: "Zones arides et semi-arides, sols rocheux calcaires",
      olfactive_signature: "Balsamique profond, légèrement fumé, résineux chaud avec des notes amères et médicinales",
      dominant_molecules: JSON.stringify(["Furanoeudesma-1,3-diène", "Curzérène", "Furanodienone", "β-Élémène"]),
      traditional_use: "Embaumement (Égypte antique), onction sacrée (traditions bibliques), médecine traditionnelle (Ayurveda, médecine chinoise), parfumerie de luxe, encens religieux, antiseptique buccal",
      conservation_status: "NT",
      cites_appendix: "NONE",
      conservation_notes: "Populations stables mais pression croissante due à la demande mondiale",
      threat_factors: JSON.stringify({ overharvesting: true, climate_change: true, habitat_loss: true }),
      sustainable_alternatives: "Myrrhe de culture, alternatives synthétiques pour certains usages",
      last_assessment_year: 2020,
      historical_status: "3000 av. J.-C.",
      notes: "L'une des substances les plus anciennes et les plus précieuses de l'histoire humaine.",
    },
    {
      name: "Encens sacré (Oliban d'Oman)",
      latin_name: "Boswellia sacra",
      family: "Burseraceae",
      category: "resine",
      origin: "Oman, Yémen, Somalie",
      habitat: "Zones arides montagneuses, falaises calcaires du Dhofar",
      olfactive_signature: "Encens pur et lumineux, notes citronnées et résineuses, légèrement sucré",
      dominant_molecules: JSON.stringify(["α-Pinène", "Incensole", "Acétate d'incensole", "Acide β-boswellique"]),
      traditional_use: "Rituels religieux, médecine traditionnelle arabe, parfumerie de luxe, méditation, commerce antique (Route de l'encens)",
      conservation_status: "VU",
      cites_appendix: "NONE",
      conservation_notes: "Populations en déclin, surexploitation et changement climatique",
      threat_factors: JSON.stringify({ overharvesting: true, climate_change: true, habitat_loss: true }),
      sustainable_alternatives: "Programmes de reforestation en cours, encens de culture",
      last_assessment_year: 2019,
      historical_status: "3000 av. J.-C.",
      notes: "Produit la résine d'encens la plus précieuse. Centre de la Route de l'encens.",
    },
    {
      name: "Encens de Somalie (Oliban)",
      latin_name: "Boswellia carterii",
      family: "Burseraceae",
      category: "resine",
      origin: "Somalie, Éthiopie, Djibouti",
      habitat: "Zones arides et semi-arides de la Corne de l'Afrique",
      olfactive_signature: "Encens classique, résineux et balsamique, notes boisées et légèrement épicées",
      dominant_molecules: JSON.stringify(["α-Pinène", "Limonène", "β-Caryophyllène", "Incensole"]),
      traditional_use: "Encens religieux, médecine traditionnelle somalienne, parfumerie, cosmétiques, aromathérapie",
      conservation_status: "NT",
      cites_appendix: "NONE",
      conservation_notes: "Pression commerciale importante, gestion durable nécessaire",
      threat_factors: JSON.stringify({ overharvesting: true, climate_change: true }),
      sustainable_alternatives: "Certification de durabilité, encens de culture",
      last_assessment_year: 2018,
      historical_status: "Antiquité",
      notes: "Représente la majorité de l'encens sur le marché mondial.",
    },
    {
      name: "Encens indien (Shallaki)",
      latin_name: "Boswellia serrata",
      family: "Burseraceae",
      category: "resine",
      origin: "Inde (Rajasthan, Madhya Pradesh, Gujarat)",
      habitat: "Forêts sèches décidues de l'Inde centrale et occidentale",
      olfactive_signature: "Encens doux et terreux, notes de miel et de bois, moins citronné que B. sacra",
      dominant_molecules: JSON.stringify(["AKBA", "Acide β-boswellique", "α-Pinène", "Myrcène"]),
      traditional_use: "Ayurveda (arthrite, inflammation), médecine traditionnelle indienne, rituels hindous, compléments alimentaires",
      conservation_status: "NT",
      cites_appendix: "NONE",
      conservation_notes: "Demande croissante pour les compléments alimentaires",
      threat_factors: JSON.stringify({ overharvesting: true, habitat_loss: true }),
      sustainable_alternatives: "Plantations certifiées, extraits standardisés",
      last_assessment_year: 2020,
      historical_status: "3000 ans",
      notes: "Centrale dans la médecine ayurvédique. Haute teneur en acides boswelliques.",
    },
    {
      name: "Encens d'Éthiopie",
      latin_name: "Boswellia papyrifera",
      family: "Burseraceae",
      category: "resine",
      origin: "Éthiopie, Érythrée, Soudan",
      habitat: "Forêts sèches d'altitude, zones montagneuses d'Afrique de l'Est",
      olfactive_signature: "Encens frais et légèrement citronné, notes vertes et résineuses",
      dominant_molecules: JSON.stringify(["α-Pinène", "Limonène", "Octyl acétate", "Incensole"]),
      traditional_use: "Église orthodoxe éthiopienne, médecine traditionnelle, industrie des parfums, encens domestique",
      conservation_status: "VU",
      cites_appendix: "NONE",
      conservation_notes: "Déclin significatif des populations, régénération très faible",
      threat_factors: JSON.stringify({ overharvesting: true, habitat_loss: true, climate_change: true }),
      sustainable_alternatives: "Programmes de conservation en cours",
      last_assessment_year: 2019,
      historical_status: "Antiquité",
      notes: "Écorce qui se détache en feuilles papyracées. Source pour l'Église éthiopienne.",
    },
    {
      name: "Encens de Rivae",
      latin_name: "Boswellia rivae",
      family: "Burseraceae",
      category: "resine",
      origin: "Éthiopie, Kenya",
      habitat: "Zones arides et semi-arides d'Afrique de l'Est",
      olfactive_signature: "Encens terreux et boisé, notes moins prononcées",
      dominant_molecules: JSON.stringify(["α-Pinène", "Limonène", "β-Caryophyllène"]),
      traditional_use: "Encens local, médecine traditionnelle, commerce régional",
      conservation_status: "DD",
      cites_appendix: "NONE",
      conservation_notes: "Données insuffisantes sur l'état des populations",
      threat_factors: JSON.stringify({ climate_change: true }),
      sustainable_alternatives: null,
      last_assessment_year: 2015,
      historical_status: "Traditionnel",
      notes: "Espèce moins connue, importante pour les communautés locales.",
    },
    {
      name: "Encens négligé",
      latin_name: "Boswellia neglecta",
      family: "Burseraceae",
      category: "resine",
      origin: "Kenya, Somalie, Éthiopie",
      habitat: "Zones arides d'Afrique de l'Est",
      olfactive_signature: "Encens léger et herbacé, notes moins résineuses",
      dominant_molecules: JSON.stringify(["α-Pinène", "Myrcène", "Limonène"]),
      traditional_use: "Usage local traditionnel, médecine traditionnelle, encens domestique",
      conservation_status: "LC",
      cites_appendix: "NONE",
      conservation_notes: "Populations relativement stables",
      threat_factors: JSON.stringify({ climate_change: true }),
      sustainable_alternatives: null,
      last_assessment_year: 2018,
      historical_status: "Traditionnel",
      notes: "Moins exploitée commercialement mais importante écologiquement.",
    },
  ];

  // ============================================================================
  // IMPORT DES PLANTES
  // ============================================================================
  console.log("\n🌳 Import des plantes historiques...");
  
  for (const plant of historicalPlants) {
    try {
      const [existing] = await connection.execute(
        "SELECT id FROM plants WHERE latin_name = ? LIMIT 1",
        [plant.latin_name]
      );
      
      if (existing.length > 0) {
        console.log(`  ⏭️  ${plant.latin_name} existe déjà (ID: ${existing[0].id})`);
        // Mettre à jour les champs de conservation
        await connection.execute(
          `UPDATE plants SET 
           conservation_status = ?, cites_appendix = ?, conservation_notes = ?,
           threat_factors = ?, sustainable_alternatives = ?, last_assessment_year = ?,
           historical_status = ?
           WHERE id = ?`,
          [plant.conservation_status, plant.cites_appendix, plant.conservation_notes,
           plant.threat_factors, plant.sustainable_alternatives, plant.last_assessment_year,
           plant.historical_status, existing[0].id]
        );
        console.log(`  🔄 ${plant.latin_name} mis à jour avec données de conservation`);
        continue;
      }
      
      await connection.execute(
        `INSERT INTO plants (name, latin_name, family, category, origin, habitat, 
         olfactive_signature, dominant_molecules, traditional_use, conservation_status,
         cites_appendix, conservation_notes, threat_factors, sustainable_alternatives,
         last_assessment_year, historical_status, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [plant.name, plant.latin_name, plant.family, plant.category, plant.origin, plant.habitat,
         plant.olfactive_signature, plant.dominant_molecules, plant.traditional_use, plant.conservation_status,
         plant.cites_appendix, plant.conservation_notes, plant.threat_factors, plant.sustainable_alternatives,
         plant.last_assessment_year, plant.historical_status, plant.notes]
      );
      console.log(`  ✅ ${plant.latin_name} importé`);
    } catch (error) {
      console.error(`  ❌ Erreur pour ${plant.latin_name}:`, error.message);
    }
  }

  // ============================================================================
  // RÉSUMÉ
  // ============================================================================
  console.log("\n" + "=".repeat(60));
  console.log("📊 RÉSUMÉ DE L'IMPORT");
  console.log("=".repeat(60));
  console.log(`  Molécules de la myrrhe : ${myrrhMolecules.length}`);
  console.log(`  Molécules de l'encens : ${frankincenseMolecules.length}`);
  console.log(`  Plantes historiques : ${historicalPlants.length}`);
  console.log("=".repeat(60));

  await connection.end();
  console.log("\n✅ Import terminé avec succès !");
}

main().catch(console.error);
