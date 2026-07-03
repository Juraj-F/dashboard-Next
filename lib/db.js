import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is missing. Copy .env.example to .env.local.');
}

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});
