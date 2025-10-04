const routeGenerator = (language) => {
  return `
    import express from 'express';
    const router = express.Router();
    export default router;
    `;
};
export default routeGenerator;
