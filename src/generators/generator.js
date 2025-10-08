import fs from "fs";
import path from "path";
import copyPackageJson from "../packageWriter.js";
import appGenerator from "./appGenerator.js";
import routeGenerator from "./routeGenerator.js";
import dbGenerator from "./dbGenerator.js";
import folderGenerator from "./folderGenerator.js";
import modelGenerator from "./modelGenerator.js";
import controllerGenerator from "./controllerGenerator.js";
import {
  envConfigContent,
  eslintConfigContent,
  swaggerContent,
  tsconfigContent,
} from "./utilityGenerator.js";

// --- Index File ---
const indexCode = `import config from './config/env.js';
  import app from './app.js';
  import {initDb} from './config/db.js';
  \nconst PORT = config.port;
  \napp.listen(PORT, async () => {
        console.log(\`Server is running on port http://localhost:\${PORT}\`);
        initDb();
    });`;

// --- Project Generator ---
const generateProject = async (
  templatePath,
  typescript,
  database,
  swagger,
  projectName
) => {
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

  // --- tsconfig for building typescript
  if (typescript) {
    fs.writeFileSync(path.join(projectPath, "tsconfig.json"), tsconfigContent);
  }

  // --- ESlint config .json ---
  fs.writeFileSync(
    path.join(projectPath, `eslint.config.${typescript ? "ts" : "js"}`),
    eslintConfigContent(typescript)
  );

  // --- Index File ---
  fs.writeFileSync(
    path.join(projectPath, "src", typescript ? "index.ts" : "index.js"),
    indexCode
  );
  console.log(`✅ Created index file`);

  // --- Env Config File ---
  fs.writeFileSync(
    path.join(projectPath, "src", "config", typescript ? "env.ts" : "env.js"),
    envConfigContent(typescript)
  );
  console.log(`✅ Created env config file`);

  // --- DB Config File ---
  fs.writeFileSync(
    path.join(projectPath, "src", "config", typescript ? "db.ts" : "db.js"),
    dbGenerator(database)
  );
  console.log(`✅ Created db config file`);

  // --- .env File ---
  fs.writeFileSync(
    path.join(projectPath, ".env"),
    "DB_HOST=localhost" +
      "\nDB_USER=root" +
      "\nDB_PASSWORD=your_db_password" +
      "\nDB_NAME=your_db_name" +
      "\nDB_PORT=5432" +
      "\nPORT=3000"
  );
  console.log(`✅ Created .env file`);

  // --- App File ---
  appGenerator(typescript, projectPath, swagger);
  console.log(`✅ Created app file`);

  // --- Sample Model File ---
  fs.writeFileSync(
    path.join(
      projectPath,
      "src",
      "models",
      typescript ? "userModel.ts" : "userModel.js"
    ),
    modelGenerator(typescript, database)
  );
  console.log(`✅ Created sample model file`);

  // --- Sample controller File ---
  fs.writeFileSync(
    path.join(
      projectPath,
      "src",
      "controllers",
      typescript ? "usercontroller.ts" : "usercontroller.js"
    ),
    controllerGenerator(typescript)
  );
  console.log(`✅ Created sample controller file`);

  // --- Sample Route File ---
  fs.writeFileSync(
    path.join(
      projectPath,
      "src",
      "routes",
      typescript ? "userRoutes.ts" : "userRoutes.js"
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
        typescript ? "swaggerSpec.ts" : "swaggerSpec.js"
      ),
      swaggerContent(typescript)
    );
    console.log("✅ Swagger Docs created");
  }

  // --- Summary ---
  console.log(
    `✅ Created ${typescript ? "typescript" : "javascript"} backend ${
      database ? `using ${database}` : ""
    } at ${projectPath}`
  );
};

export default generateProject;
