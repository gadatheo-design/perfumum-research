import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SELECT axis_code, name, meta_axis, color FROM thematic_axes ORDER BY axis_code');
console.log(JSON.stringify(rows, null, 2));
await conn.end();
