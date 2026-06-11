import pg from "pg";

const pool = new pg.Pool({
  host: process.env.DB_HOST || "db",
  port: 5432,
  user: "samu",
  password: "samu",
  database: "samu"
});