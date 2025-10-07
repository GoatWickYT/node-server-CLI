#!/usr/bin/env node
import runPrompts from "../src/prompts.js";
import generateProject from "../src/generators/generator.js";
import parseArgs from "../src/handlers/argHandler.js";

const { projectName, skipPrompts, templatePath, database, language, swagger } =
  parseArgs();

try {
  let answers;
  if (skipPrompts) {
    answers = { projectName, database, language, swagger };
  } else {
    answers = await runPrompts();
  }

  console.log("🚀 Generating project...");
  await generateProject(templatePath, answers);
  console.log(`✅ Project created at ./${answers.projectName ?? "my-app"}`);
} catch (err) {
  console.error("❌ Something went wrong:", err.message);
}
