import mysql from 'mysql2/promise';

async function addRetentionIndex() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'perfumum_research',
    socketPath: '/var/run/mysqld/mysqld.sock'
  });

  try {
    // Vérifier si la colonne existe déjà
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'ms_spectra' 
      AND COLUMN_NAME = 'retention_index'
    `);
    
    if (columns.length === 0) {
      // Ajouter la colonne retention_index
      await connection.query(`
        ALTER TABLE ms_spectra 
        ADD COLUMN retention_index DECIMAL(10,2) NULL COMMENT 'Kovats Retention Index',
        ADD COLUMN retention_index_type VARCHAR(20) NULL COMMENT 'Type: kovats, linear, etc.'
      `);
      console.log('✅ Colonne retention_index ajoutée');
    } else {
      console.log('ℹ️ Colonne retention_index existe déjà');
    }

    // Mettre à jour les indices de rétention pour les composés connus
    const retentionIndices = [
      // Monoterpènes
      { compound: 'α-Pinène', ri: 939, type: 'kovats' },
      { compound: 'β-Pinène', ri: 979, type: 'kovats' },
      { compound: 'Myrcène', ri: 991, type: 'kovats' },
      { compound: 'Limonène', ri: 1031, type: 'kovats' },
      { compound: 'Eucalyptol', ri: 1033, type: 'kovats' },
      { compound: 'γ-Terpinène', ri: 1062, type: 'kovats' },
      { compound: 'α-Terpinène', ri: 1018, type: 'kovats' },
      { compound: 'Terpinolène', ri: 1088, type: 'kovats' },
      { compound: 'Linalol', ri: 1098, type: 'kovats' },
      { compound: 'Sabinène', ri: 976, type: 'kovats' },
      { compound: '3-Carène', ri: 1011, type: 'kovats' },
      { compound: 'Camphène', ri: 954, type: 'kovats' },
      { compound: 'p-Cymène', ri: 1026, type: 'kovats' },
      { compound: 'Ocimène', ri: 1050, type: 'kovats' },
      
      // Sesquiterpènes
      { compound: 'β-Caryophyllène', ri: 1418, type: 'kovats' },
      { compound: 'α-Humulène', ri: 1454, type: 'kovats' },
      { compound: 'β-Bisabolène', ri: 1509, type: 'kovats' },
      { compound: 'Nérolidol', ri: 1564, type: 'kovats' },
      { compound: 'Guaiol', ri: 1595, type: 'kovats' },
      { compound: 'α-Bisabolol', ri: 1683, type: 'kovats' },
      { compound: 'Caryophyllène oxide', ri: 1581, type: 'kovats' },
      { compound: 'α-Copaène', ri: 1376, type: 'kovats' },
      { compound: 'β-Bourbonène', ri: 1384, type: 'kovats' },
      { compound: 'Valencène', ri: 1491, type: 'kovats' },
      { compound: 'δ-Cadinène', ri: 1524, type: 'kovats' },
      { compound: 'α-Cédrène', ri: 1409, type: 'kovats' },
      { compound: 'Germacrène D', ri: 1480, type: 'kovats' },
      { compound: 'β-Farnesène', ri: 1458, type: 'kovats' },
      
      // Alcaloïdes du tabac
      { compound: 'Nicotine', ri: 1290, type: 'kovats' },
      { compound: 'Nornicotine', ri: 1230, type: 'kovats' },
      { compound: 'Anabasine', ri: 1320, type: 'kovats' },
      
      // Phénols
      { compound: 'Gaïacol', ri: 1089, type: 'kovats' },
      { compound: 'Syringol', ri: 1351, type: 'kovats' },
      { compound: 'Eugénol', ri: 1356, type: 'kovats' },
      { compound: 'Vanilline', ri: 1393, type: 'kovats' },
      { compound: 'Créosol', ri: 1195, type: 'kovats' },
      { compound: '4-Vinylgaïacol', ri: 1313, type: 'kovats' },
      
      // Lactones et autres
      { compound: 'Coumarine', ri: 1432, type: 'kovats' },
      { compound: 'γ-Nonalactone', ri: 1358, type: 'kovats' },
      { compound: 'δ-Décalactone', ri: 1494, type: 'kovats' },
      { compound: 'Indole', ri: 1290, type: 'kovats' },
      { compound: 'Skatole', ri: 1384, type: 'kovats' },
      { compound: 'α-Ionone', ri: 1426, type: 'kovats' },
      { compound: 'β-Ionone', ri: 1485, type: 'kovats' },
      { compound: 'β-Damascénone', ri: 1383, type: 'kovats' },
      { compound: 'β-Damascone', ri: 1410, type: 'kovats' },
      { compound: 'Géraniol', ri: 1255, type: 'kovats' },
      { compound: 'Citronellol', ri: 1228, type: 'kovats' },
      { compound: 'Furfural', ri: 830, type: 'kovats' },
      { compound: 'Maltol', ri: 1110, type: 'kovats' },
      { compound: 'Sotolon', ri: 1107, type: 'kovats' },
    ];

    let updated = 0;
    for (const item of retentionIndices) {
      const [result] = await connection.query(`
        UPDATE ms_spectra 
        SET retention_index = ?, retention_index_type = ?
        WHERE compound_name = ?
      `, [item.ri, item.type, item.compound]);
      if (result.affectedRows > 0) {
        updated++;
        console.log(`  ✓ ${item.compound}: RI = ${item.ri}`);
      }
    }

    console.log(`\n✅ ${updated} composés mis à jour avec leurs indices de rétention`);

  } catch (error) {
    console.error('Erreur:', error.message);
  } finally {
    await connection.end();
  }
}

addRetentionIndex();
