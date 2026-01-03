import mysql from 'mysql2/promise';
import fs from 'fs';

(async () => {
  try {
    const conn = await mysql.createConnection(process.env.DATABASE_URL);
    const sql = fs.readFileSync('drizzle/0020_gigantic_nightcrawler.sql', 'utf8');
    
    // Split by statement breakpoint
    const statements = sql
      .split('--> statement-breakpoint')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    console.log(`Found ${statements.length} statements to execute`);
    
    for (const stmt of statements) {
      if (stmt.trim()) {
        try {
          await conn.query(stmt.trim());
          console.log('✓ Executed statement successfully');
        } catch (e) {
          if (e.message.includes('already exists') || e.message.includes('Duplicate')) {
            console.log('⊙ Table/constraint already exists, skipping');
          } else {
            console.error('✗ Error:', e.message);
          }
        }
      }
    }
    
    await conn.end();
    console.log('\n✓ Migration 0020 completed');
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
})();
