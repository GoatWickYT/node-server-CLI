import fs from "fs";
import path from "path";

const folderGenerator = (basePath, folders) => {
  folders.forEach((folder) => {
    const folderPath = path.join(basePath, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      console.log(`✅ Created ${folder} directory`);
    } else {
      console.warn(`⚠️  ${folder} directory already exists`);
    }
  });
};

export default folderGenerator;
