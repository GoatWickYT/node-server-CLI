import fs from "fs";
import path from "path";

const copyPackageJson = (templatePath, projectPath, projectName) => {
  if (!fs.existsSync(projectPath))
    fs.mkdirSync(projectPath, { recursive: true });

  let content = fs.readFileSync(templatePath, "utf-8");
  content = content.replace(/PROJECT_NAME/g, projectName);

  fs.writeFileSync(path.join(projectPath, "package.json"), content);
  console.log(`✅ package.json created in ${projectPath}`);
};

export default copyPackageJson;
