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
        console.log(\`Server is running on port \$http://localhost:\${PORT}\`);
        initDb();
    });`;

// --- Project Generator ---
const generateProject = async (templatePath, answers) => {
  let projectName = answers.projectName;
  if (!projectName) projectName = "my-app";
  if (projectName === ".") projectName = "";
  const database = answers.database;
  const swagger = answers.swagger;

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
  if (answers.language === "typescript") {
    fs.writeFileSync(path.join(projectPath, "tsconfig.json"), tsconfigContent);
  }

  // --- ESlint config .json ---
  fs.writeFileSync(
    path.join(
      projectPath,
      `eslint.config.${answers.language === "typescript" ? "ts" : "js"}`
    ),
    eslintConfigContent(answers.language === "typescript")
  );

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
    envConfigContent(answers.language === "typescript")
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
      swaggerContent(answers.language === "typescript")
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
