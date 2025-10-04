import fs from "fs";
import path from "path";

const appCode = `import express from 'express';
import userRoutes from './routes/userRoutes.js';

const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
`;

const appGenerator = (language, projectPath) => {
  const srcPath = path.join(projectPath, "src");
  fs.writeFileSync(
    path.join(srcPath, language === "typescript" ? "app.ts" : "app.js"),
    appCode
  );
};

export default appGenerator;
