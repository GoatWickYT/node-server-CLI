const dbGenerator = (database, language) => {
  console.log(
    `⚙️  Generating database configuration for ${database} in ${language}`
  );
  if (database === "postresql") return postgresql();
  if (database === "mysql") return mysql();
  if (database === "sqlite") return sqlite();
  return "";
};

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
  const createTable = \`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20) NOT NULL, email VARCHAR(20) UNIQUE, password VARCHAR(255) NOT NULL);
  \`;
  db.exec(createTable);
  // Add more table creation queries as needed
};


export default db;
`;

export default dbGenerator;
