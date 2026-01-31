/**
 * Script pour ajouter les chémotypes aux plantes tabac et cannabis
 * Ces données permettront leur affichage dans l'explorateur de chémotypes
 */

import 'dotenv/config';
import mysql from 'mysql2/promise';

const dbUrl = process.env.DATABASE_URL;
const url = new URL(dbUrl);

const conn = await mysql.createConnection({
  host: url.hostname,
  port: parseInt(url.port) || 4000,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: { rejectUnauthorized: true }
});

// Chémotypes pour les variétés de tabac
const tobaccoChemotypes = {
  'Perique': JSON.stringify([
    {
      name: "CT Fermenté classique",
      origin: "Louisiane, USA (Saint James Parish)",
      mainMolecules: ["Solanone", "Damascénone", "Mégastigmatrienone", "Acide isovalérique"],
      properties: "Notes fruitées intenses (prune, figue), cuir, épices douces",
      usage: "Condiment pour mélanges de pipe, parfumerie de niche (notes tabac)"
    },
    {
      name: "CT Fermentation longue (18+ mois)",
      origin: "Louisiane, USA",
      mainMolecules: ["Damascénone", "Ionones", "Pyrazines", "Lactones"],
      properties: "Notes vineuses, raisin sec, mélasse, profondeur exceptionnelle",
      usage: "Mélanges premium, extraction pour absolue tabac"
    }
  ]),
  'Latakia': JSON.stringify([
    {
      name: "CT Fumé syrien",
      origin: "Syrie (région de Lattaquié)",
      mainMolecules: ["Guaiacol", "Syringol", "Créosol", "4-Méthylguaiacol"],
      properties: "Fumée intense, cuir, encens, notes camphrées",
      usage: "Mélanges anglais, parfumerie (notes fumées-cuirées)"
    },
    {
      name: "CT Fumé chypriote",
      origin: "Chypre",
      mainMolecules: ["Guaiacol", "Eugénol", "Vanilline", "Furfural"],
      properties: "Fumée plus douce, notes boisées, légèrement sucrées",
      usage: "Mélanges Balkan, alternative au Latakia syrien"
    }
  ]),
  'Mapacho': JSON.stringify([
    {
      name: "CT Amazonie péruvienne",
      origin: "Pérou (Amazonie)",
      mainMolecules: ["Nicotine (9-18%)", "Nornicotine", "Anabasine", "Harmala alcaloïdes"],
      properties: "Extrêmement puissant, notes terreuses, champignon, sous-bois",
      usage: "Rituels chamaniques, rapé, médecine traditionnelle"
    },
    {
      name: "CT Brésil (Mato Grosso)",
      origin: "Brésil",
      mainMolecules: ["Nicotine", "Myosmine", "Cotinine", "β-Nicotyrine"],
      properties: "Notes plus vertes, herbacées, moins terreux",
      usage: "Préparations rituelles, tabac à chiquer"
    }
  ]),
  'Oriental Katerini': JSON.stringify([
    {
      name: "CT Katerini grec",
      origin: "Grèce (Macédoine)",
      mainMolecules: ["Solanone", "Néophytadiène", "Duvatriénediols"],
      properties: "Aromatique, notes florales, miel, légèrement épicé",
      usage: "Cigarettes orientales, mélanges turcs"
    }
  ]),
  'Yenidje': JSON.stringify([
    {
      name: "CT Yenidje turc",
      origin: "Turquie (ancienne Yenidje, aujourd'hui Giannitsa)",
      mainMolecules: ["Solanone", "Megastigmatrienone", "Damascénone"],
      properties: "Très aromatique, notes de miel, fruits secs, épices orientales",
      usage: "Mélanges turcs premium, cigarettes de luxe"
    }
  ]),
  'Ambil': JSON.stringify([
    {
      name: "CT Ambil colombien",
      origin: "Colombie (Amazonie)",
      mainMolecules: ["Nicotine concentrée", "Sels alcaloïdes", "Composés phénoliques"],
      properties: "Gel noir, extrêmement concentré, notes terreuses-salées",
      usage: "Médecine traditionnelle Huitoto, rituels de purification"
    }
  ])
};

// Chémotypes pour les variétés de cannabis
const cannabisChemotypes = {
  'Hindu Kush': JSON.stringify([
    {
      name: "CT Myrcène dominant",
      origin: "Afghanistan/Pakistan (Hindu Kush)",
      mainMolecules: ["Myrcène (>40%)", "β-Caryophyllène", "Limonène", "α-Pinène"],
      properties: "Sédatif, relaxant musculaire, notes terreuses-musquées",
      usage: "Extraction de haschisch, parfumerie (notes résineuses)"
    },
    {
      name: "CT Caryophyllène dominant",
      origin: "Vallées d'altitude (2000-3000m)",
      mainMolecules: ["β-Caryophyllène (>25%)", "Humulène", "Myrcène", "Linalol"],
      properties: "Anti-inflammatoire, notes épicées-poivrées",
      usage: "Charas traditionnel, applications thérapeutiques"
    }
  ]),
  'Ketama': JSON.stringify([
    {
      name: "CT Rif marocain",
      origin: "Maroc (Rif, région de Ketama)",
      mainMolecules: ["Myrcène", "Pinène", "Limonène", "Terpinolène"],
      properties: "Notes herbacées, pin, agrumes légers, terroir montagnard",
      usage: "Haschisch marocain, parfumerie de niche"
    },
    {
      name: "CT Beldia traditionnel",
      origin: "Maroc (variété locale ancestrale)",
      mainMolecules: ["β-Caryophyllène", "Humulène", "Myrcène", "Ocimène"],
      properties: "Plus subtil, notes florales-herbacées, moins résineux",
      usage: "Kif traditionnel, mélanges avec tabac"
    }
  ]),
  'Cannabis': JSON.stringify([
    {
      name: "CT Sativa tropical",
      origin: "Régions équatoriales (Thaïlande, Jamaïque, Colombie)",
      mainMolecules: ["Terpinolène", "Limonène", "β-Caryophyllène", "Ocimène"],
      properties: "Énergisant, notes fruitées-florales, agrumes",
      usage: "Parfumerie (notes vertes-fruitées), aromathérapie"
    },
    {
      name: "CT Indica montagnard",
      origin: "Asie centrale (Afghanistan, Pakistan, Népal)",
      mainMolecules: ["Myrcène", "Linalol", "β-Caryophyllène", "α-Pinène"],
      properties: "Relaxant, notes terreuses-musquées, encens",
      usage: "Extraction résine, parfumerie (notes orientales)"
    },
    {
      name: "CT CBD dominant",
      origin: "Variétés sélectionnées (Europe, USA)",
      mainMolecules: ["Myrcène", "Limonène", "Linalol", "β-Caryophyllène"],
      properties: "Non psychoactif, anti-anxiété, notes herbacées douces",
      usage: "Applications thérapeutiques, cosmétique, bien-être"
    }
  ])
};

async function updateChemotypes() {
  console.log("=== Mise à jour des chémotypes tabac ===\n");
  
  for (const [name, chemotypes] of Object.entries(tobaccoChemotypes)) {
    const [result] = await conn.execute(
      "UPDATE plants SET chemotypes = ? WHERE name = ?",
      [chemotypes, name]
    );
    console.log(`${name}: ${result.affectedRows > 0 ? '✓ Mis à jour' : '✗ Non trouvé'}`);
  }
  
  console.log("\n=== Mise à jour des chémotypes cannabis ===\n");
  
  for (const [name, chemotypes] of Object.entries(cannabisChemotypes)) {
    const [result] = await conn.execute(
      "UPDATE plants SET chemotypes = ? WHERE name = ?",
      [chemotypes, name]
    );
    console.log(`${name}: ${result.affectedRows > 0 ? '✓ Mis à jour' : '✗ Non trouvé'}`);
  }
  
  // Vérifier le résultat
  console.log("\n=== Vérification ===\n");
  
  const [tobacco] = await conn.execute(
    "SELECT name, chemotypes FROM plants WHERE family LIKE '%Solanaceae%' AND chemotypes IS NOT NULL AND chemotypes != ''"
  );
  console.log(`Tabacs avec chémotypes: ${tobacco.length}`);
  
  const [cannabis] = await conn.execute(
    "SELECT name, chemotypes FROM plants WHERE (family LIKE '%Cannabaceae%' OR name LIKE '%Cannabis%') AND chemotypes IS NOT NULL AND chemotypes != ''"
  );
  console.log(`Cannabis avec chémotypes: ${cannabis.length}`);
}

await updateChemotypes();
await conn.end();
console.log("\n✓ Terminé");
