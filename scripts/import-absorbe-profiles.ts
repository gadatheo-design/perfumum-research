import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "../drizzle/schema";

const DATABASE_URL = process.env.DATABASE_URL!;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection, { schema, mode: "planetscale" });

  // Get prototypes
  const prototypes = await db.select().from(schema.prototypes);
  console.log(`Found ${prototypes.length} prototypes`);

  // ABSORBE profiles based on actual formulas and descriptions
  const profiles = [
    {
      code: "C1",
      name: "FERMENTUM",
      profile: {
        animalite: 8, // Fort : Ambergris + effet "charnel"
        boise: 3,     // Faible : pas de bois dominant
        soufre: 2,    // Faible : pas de notes soufrées
        oxyde: 4,     // Moyen : Vetiver Assam (terre fumée)
        resineux: 5,  // Moyen : pas de résine dominante
        balsamique: 6, // Moyen-fort : effet lactonique
        epice: 4,     // Moyen : pas d'épices
        terreux: 7,   // Fort : Mitti Attar + Vetiver Assam
      },
      notes: "Profil fermentaire organique. Animalité noble (Ambergris), terre humide (Mitti Attar + Vetiver Assam), effet lactonique charnel. Résonance émotionnelle intime et troublante."
    },
    {
      code: "C2",
      name: "CLARUS VERDE",
      profile: {
        animalite: 2, // Très faible : pas d'animalité
        boise: 7,     // Fort : Haitian Vetiver (racine fraîche)
        soufre: 1,    // Très faible : pas de soufre
        oxyde: 2,     // Faible : pas d'oxydation
        resineux: 8,  // Très fort : Juniper (résine verte)
        balsamique: 5, // Moyen : Makrut apporte douceur
        epice: 3,     // Faible : pas d'épices
        terreux: 4,   // Moyen : Vetiver apporte ancrage léger
      },
      notes: "Profil vert résineux transparent. Juniper (résine verte) + Makrut (agrume acide) + Haitian Vetiver (terre claire). Effet cristallin, tranchant, mentholé vert. Clarté mentale et verticalité."
    },
    {
      code: "C3",
      name: "LACTA SOLIS",
      profile: {
        animalite: 1, // Très faible : pas d'animalité
        boise: 4,     // Moyen-faible : pas de bois
        soufre: 0,    // Nul : pas de soufre
        oxyde: 1,     // Très faible : pas d'oxydation
        resineux: 3,  // Faible : pas de résine
        balsamique: 9, // Très fort : Plumeria + Neroli (floral lactonique)
        epice: 2,     // Faible : pas d'épices
        terreux: 2,   // Faible : pas de terre
      },
      notes: "Profil floral solaire lactonique. Plumeria (Frangipani) + Neroli Bouquetier créent une douceur crémeuse, enveloppante, chaude. Effet peau chaude, lumière douce. Résonance apaisante et intime."
    },
    {
      code: "C4",
      name: "TERRA AMBRA",
      profile: {
        animalite: 6, // Moyen-fort : Sandalwood (chaleur)
        boise: 8,     // Très fort : Palo Santo + Sandalwood
        soufre: 3,    // Faible : pas de soufre dominant
        oxyde: 5,     // Moyen : légère oxydation des bois
        resineux: 7,  // Fort : Frankincense + Palo Santo
        balsamique: 4, // Moyen : Sandalwood apporte douceur
        epice: 6,     // Moyen-fort : Frankincense (épices sacrées)
        terreux: 9,   // Très fort : "Terre sacrée" + ancrage profond
      },
      notes: "Profil bois-résine-terre sacrée. Omani Frankincense (résine sacrée) + Palo Santo (fumée douce) + Sandalwood (bois lacté). Effet lent, chaud, ancré. Résonance méditative et enveloppante."
    }
  ];

  // Insert profiles
  for (const item of profiles) {
    const prototype = prototypes.find(p => p.code === item.code);
    if (!prototype) {
      console.log(`⚠️  Prototype ${item.code} not found, skipping`);
      continue;
    }

    await db.insert(schema.absorbeProfiles).values({
      prototypeId: prototype.id,
      animalite: item.profile.animalite,
      boise: item.profile.boise,
      soufre: item.profile.soufre,
      oxyde: item.profile.oxyde,
      resineux: item.profile.resineux,
      balsamique: item.profile.balsamique,
      epice: item.profile.epice,
      terreux: item.profile.terreux,
      notes: item.notes,
      createdAt: new Date().toISOString(),
    });

    console.log(`✅ Imported ABSORBE profile for ${item.code} — ${item.name}`);
    console.log(`   Animalité: ${item.profile.animalite}, Boisé: ${item.profile.boise}, Soufré: ${item.profile.soufre}, Oxydé: ${item.profile.oxyde}`);
    console.log(`   Résineux: ${item.profile.resineux}, Balsamique: ${item.profile.balsamique}, Épicé: ${item.profile.epice}, Terreux: ${item.profile.terreux}`);
  }

  console.log(`\n✅ Successfully imported ${profiles.length} ABSORBE profiles`);
  await connection.end();
}

main().catch((err) => {
  console.error("Error importing ABSORBE profiles:", err);
  process.exit(1);
});
