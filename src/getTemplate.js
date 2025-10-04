import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getTemplatePath = (templateName = "javascript", db = "SQLite") => {
  const fileName = `${db.toLowerCase()}-package.json`;
  return path.join(__dirname, "templates", templateName, fileName);
};

export default getTemplatePath;
