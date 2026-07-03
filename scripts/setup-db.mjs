import dotenv from "dotenv";
import fs from "fs/promises";
import pg from "pg";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing.");
  process.exit(1);
}

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

try {
  const schema = await fs.readFile("./database/schema.sql", "utf8");
  const seed = await fs.readFile("./database/seed.sql", "utf8");

  await pool.query("CREATE SCHEMA IF NOT EXISTS public;");
  await pool.query("SET search_path TO public;");

  await pool.query(schema);
  await pool.query(seed);

  console.log("Database setup complete.");
} catch (err) {
  console.error("Database setup failed:", err.message);
  process.exit(1);
} finally {
  await pool.end();
}