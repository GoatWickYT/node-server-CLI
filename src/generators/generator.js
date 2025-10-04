import fs from "fs";
import path from "path";
import copyPackageJson from "../packageWriter.js";
import appGenerator from "./appGenerator.js";
import routeGenerator from "./routeGenerator.js";
import dbGenerator from "./dbGenerator.js";

const indexCode =
  `import config from './config/env.js';` +
  `\nimport app from './app.js';` +
  `\nimport initDb from './config/db.js';` +
  `\n\nconst PORT = config.port;` +
  `\n\napp.listen(PORT, async () => {
        consol.log(\`Server is running on port \$http://localhost:{PORT}\`);
        initDb();
    });`;

const envCode = (language) =>
  `import 'dotenv/config';` +
  `\n\nconst requireEnv = (name${
    language === "typescript" ? ": string" : ""
  }) ${language === "typescript" ? ": string" : ""} => {
        const value${
          language === "typescript" ? ": string | undefined" : ""
        } = process.env[name];
        if (!value) {
          throw new Error(\`Environment variable \${name} is required\`);
        }
        return value;
      }` +
  `\n\nexport const config = {
        dbHost: requireEnv('DB_HOST'),
        dbUser: requireEnv('DB_USER'),
        dbPassword: requireEnv('DB_PASSWORD'),
        dbName: requireEnv('DB_NAME'),
        port: parseInt(process.env.PORT || '3000'),
      };
      `;

const generateProject = async (templatePath, answers, database) => {
  let projectName = answers.projectName;
  if (!projectName) projectName = "my-app";
  if (projectName === ".") projectName = "";

  projectName = projectName.replace(/\s+/g, "-").toLowerCase();
  const projectPath = path.join(process.cwd(), projectName);

  if (!fs.existsSync(projectPath)) fs.mkdirSync(projectPath);
  console.log(`✅ Created project directory at ${projectPath}`);

  fs.mkdirSync(path.join(projectPath, "src"));
  console.log(`✅ Created src directory`);

  copyPackageJson(templatePath, projectPath, projectName);
  console.log(`✅ package.json created in ${projectPath}`);

  fs.writeFileSync(
    path.join(
      projectPath,
      "src",
      answers.language === "typescript" ? "index.ts" : "index.js"
    ),
    indexCode
  );
  console.log(`✅ Created index file`);

  fs.mkdirSync(path.join(projectPath, "src", "config"));
  console.log(`✅ Created config directory`);

  fs.writeFileSync(
    path.join(
      projectPath,
      "src",
      "config",
      answers.language === "typescript" ? "env.ts" : "env.js"
    ),
    envCode(answers.language)
  );
  console.log(`✅ Created env config file`);

  fs.writeFileSync(
    path.join(
      projectPath,
      "src",
      "config",
      answers.language === "typescript" ? "db.ts" : "db.js"
    ),
    dbGenerator(database, answers.language)
  );
  console.log(`✅ Created db config file`);

  fs.writeFileSync(
    path.join(projectPath, ".env"),
    "DB_HOST=localhost" +
      "\nDB_USER=your_db_user" +
      "\nDB_PASSWORD=your_db_password" +
      "\nDB_NAME=your_db_name" +
      "\nDB_PORT=5432" +
      "\nPORT=3000"
  );
  console.log(`✅ Created .env file`);

  appGenerator(answers.language, projectPath);
  console.log(`✅ Created app file`);

  fs.mkdirSync(path.join(projectPath, "src", "routes"));
  console.log(`✅ Created routes directory`);

  fs.writeFileSync(
    path.join(
      projectPath,
      "src",
      "routes",
      answers.language === "typescript" ? "userRoutes.ts" : "userRoutes.js"
    ),
    routeGenerator(answers.language)
  );
  console.log(`✅ Created sample route file`);

  console.log(
    `✅ Created ${answers.language} backend ${
      database ? `using ${database}` : ""
    } at ${projectPath}`
  );
};

export default generateProject;
