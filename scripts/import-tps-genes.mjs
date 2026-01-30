import mysql from 'mysql2/promise';
import fs from 'fs';

// Données TPS depuis le fichier CSV
const tpsGenes = [
  { gene: 'CsTPS1', subfamily: 'TPS-b', class: 'Monoterpènes (C10)', substrate: 'GPP', terpene: 'Myrcène', notes: 'Terreux, herbacé' },
  { gene: 'CsTPS2', subfamily: 'TPS-b', class: 'Monoterpènes (C10)', substrate: 'GPP', terpene: 'Limonène', notes: 'Citrus, frais' },
  { gene: 'CsTPS3', subfamily: 'TPS-b', class: 'Monoterpènes (C10)', substrate: 'GPP', terpene: 'α-Pinène', notes: 'Pin, résineux' },
  { gene: 'CsTPS4', subfamily: 'TPS-b', class: 'Monoterpènes (C10)', substrate: 'GPP', terpene: 'β-Pinène', notes: 'Pin, boisé' },
  { gene: 'CsTPS5', subfamily: 'TPS-b', class: 'Monoterpènes (C10)', substrate: 'GPP', terpene: 'Linalool', notes: 'Floral, lavande' },
  { gene: 'CsTPS6', subfamily: 'TPS-b', class: 'Monoterpènes (C10)', substrate: 'GPP', terpene: 'Terpinolène', notes: 'Floral, pin' },
  { gene: 'CsTPS7', subfamily: 'TPS-b', class: 'Monoterpènes (C10)', substrate: 'GPP', terpene: 'Ocimène', notes: 'Floral, herbacé' },
  { gene: 'CsTPS8', subfamily: 'TPS-b', class: 'Monoterpènes (C10)', substrate: 'GPP', terpene: 'Géraniol', notes: 'Rose, floral' },
  { gene: 'CsTPS9', subfamily: 'TPS-b', class: 'Monoterpènes (C10)', substrate: 'GPP', terpene: '1,8-Cinéole', notes: 'Eucalyptus, camphré' },
  { gene: 'CsTPS10', subfamily: 'TPS-b', class: 'Monoterpènes (C10)', substrate: 'GPP', terpene: 'Camphre', notes: 'Camphré, frais' },
  { gene: 'CsTPS11', subfamily: 'TPS-b', class: 'Monoterpènes (C10)', substrate: 'GPP', terpene: 'Bornéol', notes: 'Camphré, pin, terreux' },
  { gene: 'CsTPS12', subfamily: 'TPS-b', class: 'Monoterpènes (C10)', substrate: 'GPP', terpene: 'Camphène', notes: 'Camphré, pin' },
  { gene: 'CsTPS13', subfamily: 'TPS-b', class: 'Monoterpènes (C10)', substrate: 'GPP', terpene: 'Fenchol', notes: 'Camphré, citrus' },
  { gene: 'CsTPS14', subfamily: 'TPS-b', class: 'Monoterpènes (C10)', substrate: 'GPP', terpene: 'Fenchone', notes: 'Camphré, amer' },
  { gene: 'CsTPS20', subfamily: 'TPS-a', class: 'Sesquiterpènes (C15)', substrate: 'FPP', terpene: 'β-Caryophyllène', notes: 'Épicé, poivré, boisé' },
  { gene: 'CsTPS21', subfamily: 'TPS-a', class: 'Sesquiterpènes (C15)', substrate: 'FPP', terpene: 'α-Humulène', notes: 'Boisé, terreux, houblon' },
  { gene: 'CsTPS22', subfamily: 'TPS-a', class: 'Sesquiterpènes (C15)', substrate: 'FPP', terpene: 'Nerolidol', notes: 'Floral, boisé, agrumes' },
  { gene: 'CsTPS23', subfamily: 'TPS-a', class: 'Sesquiterpènes (C15)', substrate: 'FPP', terpene: 'Bisabolol', notes: 'Floral, camomille' },
  { gene: 'CsTPS24', subfamily: 'TPS-a', class: 'Sesquiterpènes (C15)', substrate: 'FPP', terpene: 'Guaiol', notes: 'Boisé, rose' },
  { gene: 'CsTPS25', subfamily: 'TPS-a', class: 'Sesquiterpènes (C15)', substrate: 'FPP', terpene: 'Cédrol', notes: 'Boisé, cèdre' },
  { gene: 'CsTPS26', subfamily: 'TPS-a', class: 'Sesquiterpènes (C15)', substrate: 'FPP', terpene: 'Farnesène', notes: 'Herbacé, boisé' },
  { gene: 'CsTPS27', subfamily: 'TPS-a', class: 'Sesquiterpènes (C15)', substrate: 'FPP', terpene: 'Bergamotène', notes: 'Boisé, épicé' },
  { gene: 'CsTPS40', subfamily: 'TPS-c', class: 'Diterpènes (C20)', substrate: 'GGPP', terpene: 'Phytol', notes: 'Floral, balsamique' },
  { gene: 'CsTPS41', subfamily: 'TPS-c', class: 'Diterpènes (C20)', substrate: 'GGPP', terpene: 'Cembratriène', notes: 'Boisé, résineux' }
];

async function main() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Vérifier si la table gene_terpene_links existe
  try {
    const [tables] = await connection.execute(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'gene_terpene_links'`
    );
    
    if (tables.length === 0) {
      console.log('Table gene_terpene_links does not exist. Creating...');
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS gene_terpene_links (
          id INT AUTO_INCREMENT PRIMARY KEY,
          gene_id VARCHAR(30) NOT NULL UNIQUE,
          gene_name VARCHAR(100) NOT NULL,
          subfamily VARCHAR(20),
          terpene_class VARCHAR(50),
          substrate VARCHAR(100),
          terpene_product VARCHAR(100) NOT NULL,
          olfactive_notes TEXT,
          plant_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('Table créée!');
    }
  } catch (error) {
    console.error('Erreur lors de la vérification de la table:', error.message);
  }
  
  console.log('Import des gènes TPS du cannabis:');
  
  for (const tps of tpsGenes) {
    try {
      await connection.execute(
        `INSERT INTO gene_terpene_links (gene_id, gene_name, subfamily, terpene_class, substrate, terpene_product, olfactive_notes, plant_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [tps.gene, tps.gene, tps.subfamily, tps.class, tps.substrate, tps.terpene, tps.notes, 210030]
      );
      console.log(`✓ ${tps.gene} -> ${tps.terpene}`);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log(`⊘ Already exists: ${tps.gene}`);
      } else {
        console.error(`✗ Error: ${error.message}`);
      }
    }
  }
  
  await connection.end();
  console.log('\\nImport complete!');
}

main().catch(console.error);
