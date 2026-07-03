import pg from "pg";

const pool = new pg.Pool({
  host: process.env.DB_HOST || "192.168.1.10",
  // port: 5432,
  port: 5432,
  user: "samu",
  password: "samu",
  database: "samu",
});

export default pool;