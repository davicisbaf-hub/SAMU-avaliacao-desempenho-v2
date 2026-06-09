import pg from "pg";

const pool = new pg.Pool({
  host: "localhost",
  port: 5432,
  user: "samu",
  password: "samu",
  database: "samu",
});

export default pool;