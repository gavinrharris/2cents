import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.PGHOST ?? "localhost",
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE ?? "twocents",
    };

const pool = new Pool(poolConfig);

pool.on("error", (err) => {
  console.error("Database pool error:", err.message);
});

export async function testConnection() {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    return true;
  } catch (err) {
    console.error("Database connection failed:", err.message);
    return false;
  } finally {
    client.release();
  }
}

export async function query(text, params) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

export async function getPool() {
  return pool;
}

export default pool;
