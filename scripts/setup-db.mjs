import dotenv from 'dotenv';
import fs from 'fs/promises';
import pg from 'pg';

// Node scripts do not automatically load .env.local like Next.js does.
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is missing. Copy .env.example to .env.local and set DATABASE_URL.');
  process.exit(1);
}

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  await pool.connect();
  const schema = await fs.readFile('./database/schema.sql', 'utf8');
  const seed = await fs.readFile('./database/seed.sql', 'utf8');
  await pool.query(schema);
  await pool.query(seed);
  console.log('Database setup complete.');
} catch (err) {
  console.error('Database setup failed:', err.message);
  process.exit(1);
} finally {
  await pool.end();
}
