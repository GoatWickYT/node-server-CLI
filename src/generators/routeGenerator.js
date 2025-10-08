const routeGenerator = (swagger) => `/*
[-----IMPORTANT INSTRUCTIONS-----]

To add more routes, simply define new routes using router.METHOD(PATH, HANDLER).
Refer to the Express.js documentation for more details: https://expressjs.com/en/guide/routing.html
This file serves as a sample route file. You can rename it and create additional route files as needed.

${swagger ? `Swagger documentation can be integrated here.` : ""}
*/

import userController from '../controllers/usercontroller.js';
import express from 'express';

const router = express.Router();

${
  swagger
    ? `
/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema: 
 *                  type: array
 *                  items:
 *                        $ref: '#/components/schemas/User'
 *
 */

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Single user
 *         content:
 *           application/json:
 *             schema:
 *                  $ref: '#/components/schemas/User'
 */

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *                  $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User created
 */

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *                  $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: User updated
 */

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       204:
 *         description: User deleted
 */`
    : ""
}

// Sample route
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

export default router;
`;

export default routeGenerator;
