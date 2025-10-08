import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getTemplatePath = (
  language = "javascript",
  database = "SQLite",
  swagger = false
) => {
  const fileName = `${database.toLowerCase()}-package${
    swagger ? "-swagger" : ""
  }.json`;
  return path.join(__dirname, "templates", language, fileName);
};

export default getTemplatePath;
