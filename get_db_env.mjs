import { readFileSync } from 'fs';

const envContent = readFileSync('.env.local', 'utf-8');
const lines = envContent.split('\n');
const dbLine = lines.find(l => l.startsWith('DATABASE_URL='));

if (dbLine) {
  const url = dbLine.split('=')[1].replace(/["']/g, '');
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
  if (match) {
    console.log(`export DB_USER="${match[1]}"`);
    console.log(`export DB_PASSWORD="${match[2]}"`);
    console.log(`export DB_HOST="${match[3]}"`);
    console.log(`export DB_PORT="${match[4]}"`);
    console.log(`export DB_NAME="${match[5]}"`);
  }
}
