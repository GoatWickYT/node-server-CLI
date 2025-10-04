import inquirer from "inquirer";

const languages = ["JavaScript", "TypeScript"];
const databases = ["SQLite", "MySQL"];

/*
projectName - string (default: "my-app")
language - "JavaScript" | "TypeScript"
database - "SQLite" | "MySQL"
swagger - boolean
*/

async function runPrompts() {
  return await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "Project name?",
      default: "my-app",
      filter: (input) => input.toLowerCase().replace(/\s+/g, "-"),
    },
    {
      type: "list",
      name: "language",
      message: "What language?",
      choices: languages,
      filter: (input) => input.toLowerCase(),
    },
    {
      type: "list",
      name: "database",
      message: "What database?",
      choices: databases,
      filter: (input) => input.toLowerCase(),
    },
    {
      type: "confirm",
      name: "swagger",
      message: "Include Swagger?",
      default: true,
    },
  ]);
}

export default runPrompts;
