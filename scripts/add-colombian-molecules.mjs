import { getDb } from '../server/db.ts';
import { molecules } from '../drizzle/schema.ts';

async function addColombianMolecules() {
  const db = await getDb();
  
  const newMolecules = [
    // Plantes médicinales
    {
      name: "Borrachero (Brugmansia)",
      family: "Alcaloïdes Tropaniques",
      chemicalFormula: "C17H21NO4",
      olfactiveProfile: "Floral narcotique, suave et hypnotique, notes de jasmin nocturne, légèrement anisé",
      emotionalResonance: "Transe, rêve éveillé, voyage chamanique",
      functionalEffect: "Psychoactif puissant, utilisé en médecine traditionnelle andine (dilutions extrêmes uniquement)",
      sourceOrigin: "Andes colombiennes, Colombie",
      concentration: "0.0001-0.001% (extrêmement dilué)",
      notes: "⚠️ ATTENTION : Plante hautement toxique. Usage strictement réglementé. Molécule d'étude uniquement.",
      radarIntensity: 95,
      radarFreshness: 30,
      radarWarmth: 60,
      radarSweetness: 75,
      radarSpiciness: 20,
      radarEarthiness: 40
    },
    {
      name: "Yagé (Banisteriopsis caapi)",
      family: "Alcaloïdes β-Carbolines",
      chemicalFormula: "C13H12N2O",
      olfactiveProfile: "Boisé amer, terreux profond, notes de liane verte et d'écorce humide",
      emotionalResonance: "Introspection, connexion spirituelle, purification",
      functionalEffect: "Inhibiteur MAO, utilisé en cérémonies chamaniques amazoniennes",
      sourceOrigin: "Amazonie colombienne, Putumayo",
      concentration: "0.001-0.01% (extrait dilué)",
      notes: "Plante sacrée des peuples indigènes. Usage cérémoniel uniquement. Molécule d'étude ethnobotanique.",
      radarIntensity: 85,
      radarFreshness: 40,
      radarWarmth: 55,
      radarSweetness: 15,
      radarSpiciness: 30,
      radarEarthiness: 90
    },
    {
      name: "Coca Décocaïnisée (Erythroxylum coca)",
      family: "Alcaloïdes Tropaniques",
      chemicalFormula: "C9H13NO3",
      olfactiveProfile: "Vert herbacé, légèrement mentholé, notes de foin frais et d'altitude",
      emotionalResonance: "Énergie, clarté mentale, endurance",
      functionalEffect: "Stimulant léger (après extraction de la cocaïne), riche en minéraux",
      sourceOrigin: "Andes colombiennes, zone de culture légale",
      concentration: "0.01-0.1% (extrait décocaïnisé légal)",
      notes: "Extrait légal après retrait complet des alcaloïdes interdits. Usage alimentaire autorisé (Coca-Cola, thés).",
      radarIntensity: 70,
      radarFreshness: 85,
      radarWarmth: 35,
      radarSweetness: 40,
      radarSpiciness: 25,
      radarEarthiness: 60
    },
    
    // Fruits tropicaux
    {
      name: "Lulo (Solanum quitoense)",
      family: "Esters Fruités",
      chemicalFormula: "C6H12O2",
      olfactiveProfile: "Agrume tropical acidulé, notes d'ananas, citron vert et rhubarbe verte",
      emotionalResonance: "Fraîcheur explosive, joie, énergie solaire",
      functionalEffect: "Rafraîchissant, tonifiant, riche en vitamine C",
      sourceOrigin: "Vallées andines colombiennes, 1500-2500m",
      concentration: "0.5-2%",
      notes: "Fruit emblématique de Colombie, appelé 'naranjilla' en Équateur. Saveur unique inimitable.",
      radarIntensity: 80,
      radarFreshness: 95,
      radarWarmth: 20,
      radarSweetness: 60,
      radarSpiciness: 15,
      radarEarthiness: 25
    },
    {
      name: "Guanábana (Annona muricata)",
      family: "Esters Lactones",
      chemicalFormula: "C10H16O2",
      olfactiveProfile: "Crémeux tropical, notes de fraise, ananas et vanille verte, légèrement acidulé",
      emotionalResonance: "Douceur, réconfort, nostalgie tropicale",
      functionalEffect: "Apaisant, digestif, antioxydant",
      sourceOrigin: "Côte caraïbe colombienne, climat tropical",
      concentration: "1-3%",
      notes: "Fruit à la pulpe blanche crémeuse, très apprécié en jus et desserts. Propriétés médicinales étudiées.",
      radarIntensity: 75,
      radarFreshness: 70,
      radarWarmth: 40,
      radarSweetness: 85,
      radarSpiciness: 10,
      radarEarthiness: 30
    },
    {
      name: "Uchuva (Physalis peruviana)",
      family: "Aldéhydes Fruités",
      chemicalFormula: "C8H14O",
      olfactiveProfile: "Acidulé complexe, notes de mangue verte, groseille et miel sauvage",
      emotionalResonance: "Curiosité, découverte, exotisme raffiné",
      functionalEffect: "Antioxydant puissant, riche en vitamine A et phosphore",
      sourceOrigin: "Hauts plateaux colombiens, Boyacá",
      concentration: "0.5-1.5%",
      notes: "Baie dorée protégée par une capsule papyracée. Export majeur de Colombie vers l'Europe.",
      radarIntensity: 70,
      radarFreshness: 90,
      radarWarmth: 30,
      radarSweetness: 70,
      radarSpiciness: 20,
      radarEarthiness: 35
    },
    
    // Bois précieux
    {
      name: "Cedro Rosado (Cedrela odorata)",
      family: "Sesquiterpènes Boisés",
      chemicalFormula: "C15H24",
      olfactiveProfile: "Boisé noble rosé, notes de cèdre doux, légèrement résineux et épicé",
      emotionalResonance: "Noblesse, élégance, patrimoine",
      functionalEffect: "Répulsif naturel contre les insectes, stabilisant émotionnel",
      sourceOrigin: "Forêts tropicales colombiennes, gestion durable",
      concentration: "1-5%",
      notes: "Bois précieux utilisé en ébénisterie et lutherie. Huile essentielle rare et recherchée.",
      radarIntensity: 75,
      radarFreshness: 45,
      radarWarmth: 80,
      radarSweetness: 50,
      radarSpiciness: 60,
      radarEarthiness: 70
    },
    {
      name: "Nogal Colombien (Juglans neotropica)",
      family: "Phénols Boisés",
      chemicalFormula: "C10H12O2",
      olfactiveProfile: "Boisé profond et tannique, notes de noix verte, cuir végétal et terre humide",
      emotionalResonance: "Ancrage, force tranquille, sagesse",
      functionalEffect: "Astringent, tonifiant, propriétés antifongiques",
      sourceOrigin: "Andes colombiennes, forêts de montagne",
      concentration: "0.5-2%",
      notes: "Espèce endémique menacée. Bois utilisé traditionnellement en médecine et teinture naturelle.",
      radarIntensity: 80,
      radarFreshness: 35,
      radarWarmth: 75,
      radarSweetness: 40,
      radarSpiciness: 50,
      radarEarthiness: 85
    },
    
    // Résines
    {
      name: "Copal Colombien (Protium spp.)",
      family: "Diterpènes Résineux",
      chemicalFormula: "C20H32O2",
      olfactiveProfile: "Résine sacrée fumée, notes d'encens doux, citron vert et pin",
      emotionalResonance: "Purification, élévation spirituelle, connexion ancestrale",
      functionalEffect: "Fumigation rituelle, antiseptique, clarté mentale",
      sourceOrigin: "Amazonie colombienne, récolte traditionnelle",
      concentration: "1-5%",
      notes: "Résine utilisée depuis des millénaires par les peuples indigènes. Équivalent américain de l'encens.",
      radarIntensity: 85,
      radarFreshness: 60,
      radarWarmth: 80,
      radarSweetness: 45,
      radarSpiciness: 55,
      radarEarthiness: 75
    },
    {
      name: "Baume de Tolú (Myroxylon balsamum)",
      family: "Esters Balsamiques",
      chemicalFormula: "C9H10O2",
      olfactiveProfile: "Balsamique vanillé, notes de cannelle, caramel et résine douce",
      emotionalResonance: "Réconfort, chaleur, douceur enveloppante",
      functionalEffect: "Expectorant, cicatrisant, fixatif de parfum",
      sourceOrigin: "Vallée du Tolú, côte caraïbe colombienne",
      concentration: "2-10%",
      notes: "Résine précieuse récoltée par incision du tronc. Utilisée en parfumerie fine et pharmacopée.",
      radarIntensity: 80,
      radarFreshness: 35,
      radarWarmth: 90,
      radarSweetness: 85,
      radarSpiciness: 65,
      radarEarthiness: 60
    }
  ];

  console.log(`🇨🇴 Ajout de ${newMolecules.length} nouvelles molécules colombiennes...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const mol of newMolecules) {
    try {
      await db.insert(molecules).values(mol);
      console.log(`✅ ${mol.name} ajoutée`);
      successCount++;
    } catch (error) {
      console.error(`❌ Erreur pour ${mol.name}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📊 Résultat :`);
  console.log(`   Succès : ${successCount}`);
  console.log(`   Erreurs : ${errorCount}`);
  console.log(`   Total molécules colombiennes : ${12 + successCount}`);

  process.exit(0);
}

addColombianMolecules();
