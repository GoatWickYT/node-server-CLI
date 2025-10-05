import fs from "fs";
import path from "path";

const appCode = (swagger) => `import express from 'express';
import userRoutes from './routes/userRoutes.js';
${
  swagger
    ? "import swaggerUi from 'swagger-ui-express';\nimport options from './swagger/swaggerSpec.js';\nimport swaggerJsdoc from 'swagger-jsdoc';"
    : ""
}

const app = express();

app.use(express.json());
app.use('/api', userRoutes);
${
  swagger
    ? "\nconst specs = swaggerJsdoc(options);\napp.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs))"
    : ""
}

app.use((req, res, next) => {
    res.status(404).json({ message: 'Page Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
`;

const appGenerator = (typescript, projectPath, swagger) => {
  const srcPath = path.join(projectPath, "src");
  fs.writeFileSync(
    path.join(srcPath, typescript ? "app.ts" : "app.js"),
    appCode(swagger)
  );
};

export default appGenerator;
