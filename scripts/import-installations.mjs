import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { installations } from "../drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const installationsData = [
  {
    title: "Sanctum — Installation C4 Terra Ambra",
    concept: "Un espace de retrait et de contemplation, un sanctuaire laïque où le temps ralentit.",
    materials: "Pièce circulaire de 4-5m de diamètre. Matériaux: terre crue, argile, bois brut. Lumière: pénombre, lumière chaude minimale (bougie ou LED 2700K). Sol: terre battue ou pierre naturelle.",
    diffusionMode: "Prototype C4 — Terra Ambra (Frankincense, Palo Santo, Santal). Support: céramique poreuse posée sur stèle de pierre centrale. Diffusion passive, montée lente depuis le sol. Quantité: 5-10ml de concentré, diffusion sur 6-8 heures. Intensité: faible à moyenne, enveloppante.",
    visitorExperience: "Entrée individuelle ou par petits groupes (max 3 personnes). Durée recommandée: 10-15 minutes. Invitation au silence et à la contemplation. Sensation de gravité temporelle et d'ancrage.",
    theoreticalScope: "Créer un espace de pause dans un contexte muséal ou d'exposition. Explorer la lenteur comme phénomène esthétique. Interroger le sacré non-religieux.",
    documentation: "Espace dédié de 20-25m². Ventilation contrôlée (renouvellement lent). Éclairage variable. Isolation phonique recommandée.",
    location: "conceptuel",
  },
  {
    title: "Zone Organique — Installation C1 Fermentum",
    concept: "Une confrontation avec la matérialité du vivant, exploration des tabous olfactifs.",
    materials: "Pièce rectangulaire, sombre. Matériaux: terre crue fissurée, surfaces brutes. Lumière: éclairage blanc minimal, froid. Température: légèrement chauffée (22-24°C).",
    diffusionMode: "Prototype C1 — Fermentum (Ambergris, Vetiver Assam, Mitti, Makrut). Support: bloc de terre chauffée avec cavités. Diffusion par capillarité depuis la terre. Rayon: 1,5-2m autour du bloc central. Intensité: faible à moyenne, trouble.",
    visitorExperience: "Approche progressive du bloc central. Réaction corporelle attendue (surprise, questionnement). Confrontation à l'intime et au vivant.",
    theoreticalScope: "Questionner les frontières du dégoût et du sacré. Explorer la corporalité dans l'olfaction. Révéler l'organicité comme dimension esthétique.",
    documentation: "Système de chauffage doux pour le bloc de terre. Ventilation contrôlée. Monitoring de l'intensité olfactive.",
    location: "conceptuel",
  },
  {
    title: "Tour Verte — Installation C2 Clarus Verde",
    concept: "Une architecture olfactive verticale, exploration de la clarté et de l'altitude.",
    materials: "Cylindre transparent de 2-3m de hauteur. Matériaux: verre, acier, plantes vertes suspendues. Lumière: éclairage vertical ascendant, blanc-vert.",
    diffusionMode: "Prototype C2 — Clarus Verde (Makrut, Juniper, Vetiver Haiti). Support: colonnes de verre avec matières végétales. Diffusion active, colonne d'air ascendante. Système: micro-diffusion 0,3-0,5ml/h. Effet: sensation de montée, verticalité.",
    visitorExperience: "Ouverture latérale pour introduire la tête. Sensation de fraîcheur et de vitesse. Clarté mentale, respiration profonde.",
    theoreticalScope: "Matérialiser la verticalité du parfum. Créer une architecture de lumière et d'air. Explorer la transparence comme qualité olfactive.",
    documentation: "Système de diffusion programmable. Éclairage LED contrôlé. Structure sécurisée.",
    location: "conceptuel",
  },
  {
    title: "Chambre Solaire — Installation C3 Lacta Solis",
    concept: "Un espace de tendresse et de réconfort, exploration de la douceur solaire.",
    materials: "Pièce lumineuse, murs blancs légèrement dorés. Matériaux: textiles suspendus (voiles blancs). Lumière: douce, diffuse, comme soleil d'après-midi. Température: chaude (24-26°C).",
    diffusionMode: "Prototype C3 — Lacta Solis (Frangipani, Neroli). Support: textiles imprégnés par capillarité. Diffusion passive depuis les voiles. Quantité: 10ml d'huile / 1m² de tissu. Durée: plusieurs jours de diffusion lente.",
    visitorExperience: "Possibilité de s'asseoir. Sensation d'enveloppement et de chaleur. Ralentissement de la respiration. Effet apaisant.",
    theoreticalScope: "Créer un espace de pause et de soin. Explorer l'affect dans l'olfaction. Proposer un refuge sensoriel.",
    documentation: "Système de suspension textile. Éclairage doux programmable. Sièges ou coussins.",
    location: "conceptuel",
  },
  {
    title: "Série Petrichor — Installation multi-espaces",
    concept: "Parcours multi-espaces explorant différentes déclinaisons du petrichor et la transformation matérielle.",
    materials: "Parcours séquentiel à travers plusieurs espaces distincts, chacun représentant une variation du phénomène petrichor.",
    diffusionMode: "Série d'accords Pétrichor (60 variations). Diffusion adaptée à chaque espace selon le type de petrichor (humide, sec, minéral, végétal, etc.).",
    visitorExperience: "Déambulation progressive à travers les différentes atmosphères. Exploration sensorielle de la transformation de la terre par l'eau.",
    theoreticalScope: "Créer une expérience immersive du phénomène petrichor. Révéler la diversité des odeurs de pluie sur terre. Explorer la temporalité de l'évaporation.",
    documentation: "Espaces multiples avec ventilation indépendante. Systèmes de diffusion variés. Signalétique discrète.",
    location: "projet",
  },
  {
    title: "Archive Atmosphérique — Bibliothèque d'odeurs",
    concept: "Bibliothèque d'odeurs permettant une consultation individuelle et une documentation historique et sensorielle.",
    materials: "Espace de consultation intime avec mobilier de bibliothèque adapté. Éclairage de lecture. Atmosphère silencieuse.",
    diffusionMode: "Collection de flacons et d'échantillons organisés par familles olfactives. Système de consultation individuelle (mouillettes, flacons hermétiques).",
    visitorExperience: "Consultation autonome ou guidée. Temps de découverte libre. Possibilité de documentation et de prise de notes.",
    theoreticalScope: "Créer une archive vivante des odeurs. Permettre l'étude et la comparaison. Documenter l'histoire olfactive.",
    documentation: "Mobilier de rangement hermétique. Éclairage adapté. Espace de consultation. Mouillettes et supports de présentation.",
    location: "projet",
  },
  {
    title: "Chambre de lumière verte — Dispositif C2",
    concept: "Espace blanc, épuré, baigné de lumière naturelle avec plantes aromatiques disposées en lignes verticales.",
    materials: "Espace blanc et épuré. Plantes aromatiques (genévrier, citronnelle) en lignes verticales. Lumière naturelle abondante.",
    diffusionMode: "Diffusion de Clarus Verde par microdiffusion en hauteur (2-2,5m), créant une colonne olfactive descendante. Débit: 0,5-1 ml/h (moyen). Diffusion continue ou par vagues courtes.",
    visitorExperience: "Sensation de fraîcheur et de clarté. Respiration facilitée. Effet tonifiant et vivifiant.",
    theoreticalScope: "Créer un espace de clarté mentale. Explorer la verticalité olfactive. Intégrer le végétal vivant et l'odeur.",
    documentation: "Système de microdiffusion en hauteur. Éclairage naturel ou LED blanc froid. Plantes vivantes nécessitant entretien.",
    location: "conceptuel",
  },
];

console.log("🚀 Début de l'import des installations olfactives...\n");

for (const installation of installationsData) {
  try {
    console.log(`📝 Import de: ${installation.title}...`);
    
    await db.insert(installations).values(installation);
    
    console.log(`✅ ${installation.title} importée avec succès`);
    console.log(`   Lieu: ${installation.location}\n`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'import de ${installation.title}:`, error.message);
  }
}

console.log("🎉 Import terminé avec succès !");
console.log(`📊 Total: ${installationsData.length} installations importées`);

process.exit(0);
