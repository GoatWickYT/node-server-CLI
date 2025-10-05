import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getTemplatePath = (
  templateName = "javascript",
  db = "SQLite",
  swagger = false
) => {
  const fileName = `${db.toLowerCase()}-package${
    swagger ? "-swagger" : ""
  }.json`;
  return path.join(__dirname, "templates", templateName, fileName);
};

export default getTemplatePath;
