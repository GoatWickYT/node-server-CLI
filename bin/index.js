#!/usr/bin/env node
import runPrompts from "../src/prompts.js";
import generateProject from "../src/generators/generator.js";
import parseArgs from "../src/handlers/argHandler.js";
import getTemplatePath from "../src/getTemplate.js";

const { projectName, skipPrompts, database, language, swagger } = parseArgs();

try {
  let answers;
  if (skipPrompts) {
    answers = { projectName, database, language, swagger };
  } else {
    answers = await runPrompts();
  }

  const templatePath = getTemplatePath(
    answers.language,
    answers.database,
    answers.swagger
  );

  console.log("🚀 Generating project...");
  await generateProject(
    templatePath,
    answers.language === "typescript",
    answers.database,
    answers.swagger,
    answers.projectName
  );
  console.log(`✅ Project created at ./${answers.projectName ?? "my-app"}`);
} catch (err) {
  console.error("❌ Something went wrong:", err.message);
}
