const dbGenerator = (database, language) => {
  console.log(
    `⚙️  Generating database configuration for ${database} in ${language}`
  );
  if (database === "postresql") return postgresql();
  if (database === "mysql") return mysql();
  if (database === "sqlite") return sqlite();
  return "";
};

const mysql = () => `/*
[-----IMPORTANT INSTRUCTIONS-----]

To add more tables, add more CREATE TABLE statements in the initDb function.
Use SQL syntax to define your tables.
MySQL documentation: https://dev.mysql.com/doc/
MySQL can work as both a local and cloud based database service
*/

import mysql from "mysql2/promise";
import config from "./env.js";

const pool = mysql.createPool({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  waitForConnections: true,
  connectionLimit: 10,
});

export const initDb = async () => {
  try {
    await pool.query(\`
            CREATE TABLE IF NOT EXISTS users
                (id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(20) NOT NULL,
                email VARCHAR(20) UNIQUE,
                password VARCHAR(255) NOT NULL);
        \`);
    console.log("Database initialized successfully!");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

export default pool;
`;

const sqlite = () => `/*
[-----IMPORTANT INSTRUCTIONS-----]

To add more tables, add more CREATE TABLE statements in the initDb function.
Use SQL syntax to define your tables.
SQLite documentation: https://www.sqlite.org/docs.html
SQLite is a local file-based database, so no server setup is required.
*/


import Database from 'better-sqlite3';
const db = new Database('./data/database.sqlite');

export const initDb = () => {
  db.exec(\`
    CREATE TABLE IF NOT EXISTS users
      (id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(20) NOT NULL,
      email VARCHAR(20) UNIQUE,
      password VARCHAR(255) NOT NULL);
  \`);
  // Add more table creation queries as needed
};


export default db;
`;

export default dbGenerator;
