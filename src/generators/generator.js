import fs from "fs";
import path from "path";
import copyPackageJson from "../packageWriter.js";
import appGenerator from "./appGenerator.js";
import routeGenerator from "./routeGenerator.js";
import dbGenerator from "./dbGenerator.js";
import folderGenerator from "./folderGenerator.js";
import modelGenerator from "./modelGenerator.js";
import controllerGenerator from "./controllerGenerator.js";

// --- Index File ---
const indexCode =
  `import config from './config/env.js';` +
  `\nimport app from './app.js';` +
  `\nimport {initDb} from './config/db.js';` +
  `\n\nconst PORT = config.port;` +
  `\n\napp.listen(PORT, async () => {
        console.log(\`Server is running on port \$http://localhost:\${PORT}\`);
        initDb();
    });`;

// --- Env Config File ---
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
  `\n\nconst config = {
        dbHost: requireEnv('DB_HOST'),
        dbUser: requireEnv('DB_USER'),
        dbPassword: requireEnv('DB_PASSWORD'),
        dbName: requireEnv('DB_NAME'),
        port: parseInt(process.env.PORT || '3000'),
      };
  export default config;`;

// --- Swagger File ---
const swaggerFile = (typescript) => `
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Basic User API',
            version: '1.0.0',
        },
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        email: {type: 'string' },
                        password: {type: 'string'}
                    },
                },
                UserInput: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        email: {type: 'string' },
                        password: {type: 'string'}
                    },
                    required: ['name', 'email', 'password'],
                }
            }
        }
    },
    apis: ['./src/routes/*.${typescript ? "ts" : "js"}'],
};
export default options
`;

// --- Project Generator ---
const generateProject = async (templatePath, answers, database, swagger) => {
  let projectName = answers.projectName;
  if (!projectName) projectName = "my-app";
  if (projectName === ".") projectName = "";

  projectName = projectName.replace(/\s+/g, "-").toLowerCase();
  const projectPath = path.join(process.cwd(), projectName);

  // --- Folder Structure ---
  if (!fs.existsSync(projectPath)) fs.mkdirSync(projectPath);
  console.log(`✅ Created project directory at ${projectPath}`);

  folderGenerator(projectPath, [
    "src",
    "data",
    path.join("src", "config"),
    path.join("src", "routes"),
    path.join("src", "controllers"),
    path.join("src", "models"),
    path.join("src", "middlewares"),
    path.join("src", "utils"),
  ]);

  // --- package.json ---
  copyPackageJson(templatePath, projectPath, projectName);
  console.log(`✅ package.json created in ${projectPath}`);

  // --- Index File ---
  fs.writeFileSync(
    path.join(
      projectPath,
      "src",
      answers.language === "typescript" ? "index.ts" : "index.js"
    ),
    indexCode
  );
  console.log(`✅ Created index file`);

  // --- Env Config File ---
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

  // --- DB Config File ---
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

  // --- .env File ---
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

  // --- App File ---
  appGenerator(answers.language === "typescript", projectPath, swagger);
  console.log(`✅ Created app file`);

  // --- Sample Model File ---
  fs.writeFileSync(
    path.join(
      projectPath,
      "src",
      "models",
      answers.language === "typescript" ? "userModel.ts" : "userModel.js"
    ),
    modelGenerator(answers.language === "typescript", database)
  );
  console.log(`✅ Created sample model file`);

  // --- Sample controller File ---
  fs.writeFileSync(
    path.join(
      projectPath,
      "src",
      "controllers",
      answers.language === "typescript"
        ? "usercontroller.ts"
        : "usercontroller.js"
    ),
    controllerGenerator(answers.language === "typescript", database)
  );
  console.log(`✅ Created sample controller file`);

  // --- Sample Route File ---
  fs.writeFileSync(
    path.join(
      projectPath,
      "src",
      "routes",
      answers.language === "typescript" ? "userRoutes.ts" : "userRoutes.js"
    ),
    routeGenerator(swagger)
  );
  console.log(`✅ Created sample route file`);

  // --- Swagger file ---
  if (swagger) {
    folderGenerator(projectPath, [path.join("src", "swagger")]);
    fs.writeFileSync(
      path.join(
        projectPath,
        "src",
        "swagger",
        answers.language === "typescript" ? "swaggerSpec.ts" : "swaggerSpec.js"
      ),
      swaggerFile(answers.language === "typescript")
    );
    console.log("✅ Swagger Docs created");
  }

  // --- Summary ---
  console.log(
    `✅ Created ${answers.language} backend ${
      database ? `using ${database}` : ""
    } at ${projectPath}`
  );
};

export default generateProject;
