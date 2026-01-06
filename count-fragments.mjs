import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const [count] = await connection.execute(`SELECT COUNT(*) as total FROM text_fragments`);
console.log('Total fragments:', count[0].total);

const [tradeCount] = await connection.execute(`SELECT COUNT(*) as total FROM trade_routes`);
console.log('Total trade routes:', tradeCount[0].total);

const [rows] = await connection.execute(`SELECT * FROM text_fragments LIMIT 3`);
console.log('Sample fragments:', JSON.stringify(rows, null, 2));

await connection.end();
