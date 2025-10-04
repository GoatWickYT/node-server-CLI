const dbGenerator = (database, language) => {
  console.log(
    `⚙️  Generating database configuration for ${database} in ${language}`
  );
  if (database === "postresql") return postgresql();
  if (database === "mysql") return mysql();
  if (database === "sqlite") return sqlite();
  return "";
};

const sqlite = () => `import sqlite3 from 'sqlite3';
import { open } from 'sqlite';`;

export default dbGenerator;
