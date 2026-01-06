import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [rows] = await connection.execute(`
  SELECT fragment_id, manuscript_id, language, 
         LEFT(original_text, 150) as original_preview, 
         LEFT(translation_fr, 150) as translation_preview,
         evidence_level
  FROM text_fragments 
  LIMIT 10
`);

console.log(JSON.stringify(rows, null, 2));

await connection.end();
