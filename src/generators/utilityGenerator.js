export const tsconfigContent = `{
  "compilerOptions": {
    "module": "node20",
    "moduleResolution": "node16",
    "target": "es2022",
    "strict": true,
    "skipLibCheck": true,
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "removeComments": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
`;

// --- ESLint Config ---
export const eslintConfigContent = (typescript) => `import js from "@eslint/js";
import globals from "globals";${
  typescript ? "\nimport tseslint from 'typescript-eslint';" : ""
}
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs${
    typescript ? ",ts,mts,cts" : ""
  }}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },${
  typescript ? "\ntseslint.configs.recommended," : ""
}
]);
`;

// --- Env Config File ---
export const envConfigContent = (typescript) =>
  `import 'dotenv/config';` +
  `\n\nconst requireEnv = (name${typescript ? ": string" : ""}) ${
    typescript ? ": string" : ""
  } => {
        const value${
          typescript ? ": string | undefined" : ""
        } = process.env[name];
        if (!value) {
          throw new Error(\`Environment variable \${name} is required\`);
        }
        return value;
      }` +
  `\n\nconst config = {
        dbHost: requireEnv('DB_HOST'),
        dbUser: requireEnv('DB_USER'),
        dbPassword: requireEnv('DB_PASSWORD'),
        dbName: requireEnv('DB_NAME'),
        port: parseInt(process.env.PORT || '3000'),
      };
  export default config;`;

// --- Swagger File ---
export const swaggerContent = (typescript) => `
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Basic User API',
            version: '1.0.0',
        },
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        email: {type: 'string' },
                        password: {type: 'string'}
                    },
                },
                UserInput: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        email: {type: 'string' },
                        password: {type: 'string'}
                    },
                    required: ['name', 'email', 'password'],
                }
            }
        }
    },
    apis: ['./src/routes/*.${typescript ? "ts" : "js"}'],
};
export default options
`;
