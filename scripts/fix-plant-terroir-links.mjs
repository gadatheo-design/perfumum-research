/**
 * Script pour créer les liaisons plantes-terroirs avec les bons noms de colonnes
 */
import mysql from "mysql2/promise";

const DATABASE_URL = process.env.DATABASE_URL;

async function main() {
  const connection = await mysql.createConnection(DATABASE_URL);

  console.log("=== Création des liaisons plantes-terroirs ===\n");

  // Récupérer les IDs
  const [ambilResult] = await connection.execute(
    "SELECT id FROM plants WHERE name = 'Ambil'"
  );
  const ambilId = ambilResult[0]?.id;

  const [protiumResult] = await connection.execute(
    "SELECT id FROM plants WHERE latin_name LIKE '%Protium%' LIMIT 1"
  );
  const protiumId = protiumResult[0]?.id;

  const [amazoniaResult] = await connection.execute(
    "SELECT id FROM terroirs WHERE terroir_id = 'TER-COL-AMA'"
  );
  const amazoniaId = amazoniaResult[0]?.id;

  const [putumayoResult] = await connection.execute(
    "SELECT id FROM terroirs WHERE terroir_id = 'TER-COL-PUT'"
  );
  const putumayoId = putumayoResult[0]?.id;

  const [vaupesResult] = await connection.execute(
    "SELECT id FROM terroirs WHERE terroir_id = 'TER-COL-VAU'"
  );
  const vaupesId = vaupesResult[0]?.id;

  console.log(`Ambil ID: ${ambilId}`);
  console.log(`Protium ID: ${protiumId}`);
  console.log(`Amazonie ID: ${amazoniaId}`);
  console.log(`Putumayo ID: ${putumayoId}`);
  console.log(`Vaupés ID: ${vaupesId}`);

  // Liaisons à créer
  const links = [
    { plantId: ambilId, terroirId: amazoniaId, localName: "Ambil", notes: "Préparation emblématique de l'Amazonie colombienne" },
    { plantId: ambilId, terroirId: putumayoId, localName: "Ambil", notes: "Centre de la tradition du mambeadero" },
    { plantId: ambilId, terroirId: vaupesId, localName: "Ambil", notes: "Utilisé dans les cercles de parole Tukano" },
    { plantId: protiumId, terroirId: amazoniaId, localName: "Breu branco", notes: "Résine emblématique de l'Amazonie" },
    { plantId: protiumId, terroirId: putumayoId, localName: "Breu branco", notes: "Utilisé comme encens rituel" },
    { plantId: protiumId, terroirId: vaupesId, localName: "Breu branco", notes: "Récolté dans les forêts de terra firme" }
  ];

  for (const link of links) {
    if (!link.plantId || !link.terroirId) {
      console.log(`⚠ Liaison ignorée (ID manquant): plant=${link.plantId}, terroir=${link.terroirId}`);
      continue;
    }

    // Vérifier si la liaison existe déjà
    const [existing] = await connection.execute(
      "SELECT id FROM plant_terroirs WHERE plant_id = ? AND terroir_id = ?",
      [link.plantId, link.terroirId]
    );

    if (existing.length === 0) {
      await connection.execute(
        `INSERT INTO plant_terroirs (plant_id, terroir_id, local_name, notes)
         VALUES (?, ?, ?, ?)`,
        [link.plantId, link.terroirId, link.localName, link.notes]
      );
      console.log(`✓ Liaison créée: ${link.localName} → terroir ${link.terroirId}`);
    } else {
      console.log(`⚠ Liaison existe déjà: ${link.localName} → terroir ${link.terroirId}`);
    }
  }

  console.log("\n=== Vérification finale ===\n");

  // Vérifier les liaisons créées
  const [finalLinks] = await connection.execute(
    `SELECT pt.*, p.name as plant_name, t.name as terroir_name
     FROM plant_terroirs pt
     JOIN plants p ON pt.plant_id = p.id
     JOIN terroirs t ON pt.terroir_id = t.id
     WHERE p.name IN ('Ambil', 'Protium heptaphyllum')
        OR p.latin_name LIKE '%Protium%'`
  );
  console.log("Liaisons plantes-terroirs:", finalLinks);

  await connection.end();
}

main().catch(console.error);
