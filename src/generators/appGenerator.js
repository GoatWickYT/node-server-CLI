import fs from "fs";
import path from "path";

const appCode = (swagger, typescript) => `import express${
  typescript ? ", { Request, Response }" : ""
} from 'express';
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

app.use(${typescript ? "(req:Request, res:Response)" : "(req, res)"} => {
    res.status(404).json({ message: 'Page Not Found' });
});

app.use(${
  typescript ? "(err: Error, req:Request, res:Response)" : "(err, req, res)"
} => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
`;

const appGenerator = (typescript, projectPath, swagger) => {
  const srcPath = path.join(projectPath, "src");
  fs.writeFileSync(
    path.join(srcPath, typescript ? "app.ts" : "app.js"),
    appCode(swagger, typescript)
  );
};

export default appGenerator;
