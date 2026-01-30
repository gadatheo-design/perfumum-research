import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [columns] = await connection.execute("SHOW COLUMNS FROM raw_materials WHERE Field = 'quality'");
console.log('Quality enum:', columns[0].Type);

const [columns2] = await connection.execute("SHOW COLUMNS FROM raw_materials WHERE Field = 'price_range'");
console.log('Price range enum:', columns2[0].Type);

const [columns3] = await connection.execute("SHOW COLUMNS FROM raw_materials WHERE Field = 'availability'");
console.log('Availability enum:', columns3[0].Type);

await connection.end();
