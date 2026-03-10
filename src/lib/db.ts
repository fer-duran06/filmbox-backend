import { Pool } from "pg";

/**
 * Pool de conexiones a PostgreSQL.
 * Usa DATABASE_URL del .env para conectarse.
 * El pool reutiliza conexiones para mejor rendimiento.
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("[DB] Error inesperado en el pool de conexiones:", err);
});

export default pool;