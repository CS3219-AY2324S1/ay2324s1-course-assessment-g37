import { Pool } from "pg";

const pool = new Pool();

pool.on("error", (error, client) => {
  console.error(error);
  throw new Error("PostgreSQL pool failed to initialise");
});

export async function pgQuery(query: string, params: string[]) {
  const start = Date.now();
  const res = await pool.query(query, params);
  const duration = Date.now() - start;
  console.log("executed query", { text: query, duration, rows: res.rowCount });
  return res;
}
