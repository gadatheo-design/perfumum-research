import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { eq } from "drizzle-orm";
import * as schema from "./drizzle/schema.ts";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

// Données de conservation détaillées par zone
const conservationData = [
  {
    zoneId: 30003, // Australie occidentale - Zone Santalum
    conservationEfforts: `**Efforts de conservation en cours:**
- Programme de plantation durable géré par le Western Australian Sandalwood Office
- Certification FairWild pour garantir la traçabilité et la durabilité
- Quotas d'exportation stricts pour éviter la surexploitation
- Recherche sur la culture en plantation et l'optimisation des rendements
- Partenariats avec les communautés aborigènes pour la gestion traditionnelle

**Organisations impliquées:**
- Department of Biodiversity, Conservation and Attractions (DBCA) - Australie occidentale
- Forest Products Commission (FPC) - Gestion des ressources forestières
- FairWild Foundation - Certification de récolte durable
- Australian Sandalwood Network - Réseau de producteurs et chercheurs`,
    sustainableAlternatives: `**Alternatives durables disponibles:**
- Santalum spicatum de plantation certifiée FairWild (disponible)
- Amyris balsamifera (bois d'amyris) - alternative boisée crémeuse
- Santalum austrocaledonicum (santal de Nouvelle-Calédonie) - en développement
- Molécules de synthèse : α-santalol et β-santalol synthétiques
- Fractionnement moléculaire pour optimiser l'utilisation de la ressource`
  },
  {
    zoneId: 3, // Asie du Sud-Est - Triangle Aquilaria
    conservationEfforts: `**Efforts de conservation en cours:**
- Plantations contrôlées avec inoculation artificielle de champignons (Phialophora parasitica)
- Système de traçabilité ADN pour lutter contre le trafic illégal
- CITES Annexe II : contrôle strict du commerce international
- Programmes de reboisement au Cambodge, Laos et Vietnam
- Formation des communautés locales à la culture durable
- Recherche sur l'optimisation de la formation de résine

**Organisations impliquées:**
- CITES (Convention on International Trade in Endangered Species)
- TRAFFIC - Surveillance du commerce illégal
- WWF Asie - Programmes de conservation et plantations communautaires
- IUCN SSC Medicinal Plant Specialist Group
- Rainforest Alliance - Certification de plantations durables
- Gouvernements du Cambodge, Laos et Vietnam - Réglementation et contrôle`,
    sustainableAlternatives: `**Alternatives durables disponibles:**
- Aquilaria crassna de plantation certifiée avec inoculation contrôlée
- Cypriol (Cyperus scariosus) - note boisée terreuse similaire
- Guaiacwood (Bulnesia sarmientoi) - boisé fumé
- Molécules de synthèse : β-agarofuran, jinkoh-eremol synthétiques
- Oud synthétique (Firmenich Oud Synthetic, Givaudan Oud Extreme)
- Fractionnement et dilution pour réduire les quantités nécessaires`
  },
  {
    zoneId: 30005, // Sri Lanka - Zone Cinnamomum
    conservationEfforts: `**Efforts de conservation en cours:**
- Indication Géographique Protégée (IGP) "Cannelle de Ceylan" depuis 2013
- Programmes d'agroforesterie pour diversifier les cultures
- Recherche sur les résistances aux maladies fongiques
- Formation des récoltants aux techniques durables
- Certification biologique et commerce équitable
- Préservation des variétés traditionnelles et du savoir-faire ancestral

**Organisations impliquées:**
- Sri Lanka Export Development Board - Protection de l'IGP
- Department of Agriculture Sri Lanka - Recherche et vulgarisation
- Fairtrade International - Certification équitable
- Rainforest Alliance - Certification durable
- Cooperatives de producteurs locaux`,
    sustainableAlternatives: `**Alternatives durables disponibles:**
- Cinnamomum verum de plantation certifiée IGP Sri Lanka
- Cinnamomum cassia (cannelle de Chine) - moins fine mais plus abondante
- Cinnamomum burmannii (cannelle d'Indonésie) - alternative économique
- Molécules de synthèse : cinnamaldéhyde synthétique
- Huile essentielle de feuille de cannelier (moins impactante que l'écorce)`
  },
  {
    zoneId: 30006, // Zanzibar - Zone Syzygium
    conservationEfforts: `**Efforts de conservation en cours:**
- Programmes d'agroforesterie pour combattre la monoculture
- Recherche sur la résistance à la "sudden death disease" (maladie mortelle)
- Diversification des revenus agricoles pour réduire la pression
- Certification biologique et commerce équitable
- Préservation des vieux arbres centenaires (patrimoine génétique)
- Formation aux bonnes pratiques de récolte (ne pas endommager l'arbre)

**Organisations impliquées:**
- Zanzibar Clove Growers Association - Coopérative de producteurs
- Fairtrade International - Certification équitable
- Rainforest Alliance - Certification durable
- ICRAF (World Agroforestry) - Recherche en agroforesterie
- Gouvernement de Zanzibar - Réglementation et soutien aux producteurs`,
    sustainableAlternatives: `**Alternatives durables disponibles:**
- Syzygium aromaticum de commerce équitable certifié
- Eugénol synthétique (molécule principale, 70-90% de l'HE)
- Acétate d'eugényle synthétique
- Pimenta racemosa (bois d'Inde) - profil similaire mais moins puissant
- Fractionnement moléculaire pour optimiser l'utilisation`
  },
  {
    zoneId: 8, // Indonésie - Kalimantan (Patchouli) - aussi pour le giroflier historique
    conservationEfforts: `**Efforts de conservation en cours (Moluques - berceau du giroflier):**
- Préservation des variétés anciennes et du patrimoine génétique
- Programmes de reboisement des girofliers dans les Moluques
- Valorisation du patrimoine culturel lié au commerce des épices
- Recherche sur les variétés résistantes aux maladies
- Certification biologique et équitable

**Organisations impliquées:**
- Indonesian Ministry of Environment and Forestry
- CIFOR (Center for International Forestry Research)
- WWF Indonesia - Conservation des forêts tropicales
- Fairtrade International - Certification équitable
- Coopératives locales des Moluques`,
    sustainableAlternatives: `**Alternatives durables disponibles:**
- Giroflier de plantation certifiée en Indonésie
- Eugénol synthétique (molécule principale)
- Voir aussi alternatives de la zone Zanzibar`
  },
  {
    zoneId: 30004, // Turquie - Zone Liquidambar
    conservationEfforts: `**Efforts de conservation en cours:**
- Zones protégées dans la région de Marmaris (forêts reliques)
- Quotas de récolte de résine pour éviter la surexploitation
- Programmes de replantation et de régénération naturelle
- Préservation du savoir-faire traditionnel de récolte (incision de l'écorce)
- Lutte contre les incendies de forêt (menace majeure)
- Certification de récolte durable

**Organisations impliquées:**
- Turkish Ministry of Agriculture and Forestry
- WWF Turquie - Conservation des forêts méditerranéennes
- Coopératives de récoltants locaux (villages traditionnels)
- IUCN - Évaluation du statut de conservation
- Université d'Istanbul - Recherche sur la régénération`,
    sustainableAlternatives: `**Alternatives durables disponibles:**
- Liquidambar orientalis de récolte certifiée durable
- Styrax benzoin (benjoin de Sumatra) - profil balsamique similaire
- Vanilline synthétique (molécule clé)
- Cinnamate de cinnamyle synthétique
- Liquidambar styraciflua (copalme d'Amérique) - espèce non menacée
- Tolu balsam (Myroxylon balsamum) - alternative balsamique`
  },
  {
    zoneId: 30007, // Sumatra - Zone Styrax
    conservationEfforts: `**Efforts de conservation en cours:**
- Programmes d'agroforesterie pour lutter contre la déforestation
- Certification FairWild pour la récolte durable de résine
- Coopératives de récoltants pour améliorer les revenus et les pratiques
- Zones protégées dans les forêts de montagne (600-1200m)
- Lutte contre la conversion des forêts en plantations d'huile de palme
- Recherche sur la culture en plantation et l'optimisation de la récolte

**Organisations impliquées:**
- Indonesian Ministry of Environment and Forestry
- FairWild Foundation - Certification de récolte durable
- WWF Indonesia - Conservation des forêts de Sumatra
- Rainforest Alliance - Certification durable
- Coopératives de récoltants de Sumatra et Java
- CIFOR (Center for International Forestry Research)`,
    sustainableAlternatives: `**Alternatives durables disponibles:**
- Styrax benzoin de récolte certifiée FairWild
- Liquidambar orientalis (styrax liquide de Turquie) - profil similaire
- Vanilline synthétique (molécule clé, 10-30% de la résine)
- Acide benzoïque synthétique
- Tolu balsam (Myroxylon balsamum) - alternative balsamique
- Benzoin Resinoid synthétique (reconstitution moléculaire)`
  }
];

console.log(`🌿 Enrichissement de ${conservationData.length} zones avec données de conservation...`);

for (const data of conservationData) {
  try {
    await db.update(schema.geographicZones)
      .set({
        conservationEfforts: data.conservationEfforts,
        sustainableAlternatives: data.sustainableAlternatives
      })
      .where(eq(schema.geographicZones.id, data.zoneId));
    
    const zone = await db.select().from(schema.geographicZones).where(eq(schema.geographicZones.id, data.zoneId)).limit(1);
    console.log(`✅ ${zone[0]?.name} enrichie avec données de conservation`);
  } catch (error) {
    console.error(`❌ Erreur lors de l'enrichissement de la zone ${data.zoneId}:`, error.message);
  }
}

console.log(`\n✨ Enrichissement terminé !`);

await connection.end();
