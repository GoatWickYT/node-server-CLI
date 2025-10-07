import getTemplatePath from "../getTemplate.js";

function parseArgs() {
  console.log(`⚙️  Handling arguments`);
  const args = process.argv.slice(2);

  const projectName = args[0] ?? "my-app";
  const skipPrompts = args.some((arg) =>
    ["--skip-prompts", "--skip", "-y", "--template", "--db"].includes(arg)
  );

  // --- Optional template ---
  const templateArgIndex = args.indexOf("--template");
  let templateName = "javascript";
  if (templateArgIndex !== -1 && args[templateArgIndex + 1]) {
    templateName = args[templateArgIndex + 1].toLowerCase();
    console.log(`✅ Using custom template: ${templateName}`);
  }

  // --- Optional DB ---
  const dbArgIndex = args.indexOf("--db");
  let db = "sqlite";
  if (dbArgIndex !== -1 && args[dbArgIndex + 1]) {
    db = args[dbArgIndex + 1].toLowerCase();
    console.log(`✅ Using DB template: ${db}`);
  }

  // --- Optional Swagger ---
  const swagger = args.includes("--swagger");
  let swaggerChoice = false;
  if (swagger) {
    swaggerChoice = true;
    console.log(`✅ Swagger integration enabled`);
  }

  // --- Template Path ---
  const templatePath = getTemplatePath(templateName, db, swagger);
  console.log(`✅ Template path resolved: ${templatePath}`);

  console.log(`✅ Arguments handled`);
  return {
    projectName,
    skipPrompts,
    templatePath,
    database: db,
    language: templateName,
    swagger: swaggerChoice,
  };
}

export default parseArgs;
