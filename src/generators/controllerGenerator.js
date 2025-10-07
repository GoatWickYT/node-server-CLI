const controllerGenerator = (typescript) => `/*
[-----IMPORTANT INSTRUCTIONS-----]

To add more controllers, define additional functions following the structure below.
This file serves as a sample controller file. You can rename it and create additional controller files as needed.

    

[-----SAFETY INSTRUCTIONS-----]
In a live application, ensure to validate and sanitize req.body data before using it.
Use libraries like Joi or express-validator for validation.
Hash passwords before storing them in the database using bcrypt or similar libraries.

Never expose detailed error messages to clients; log them securely instead.
Never trust client input; always validate and sanitize.
Never store sensitive information in plain text.
Never expose sensitive information (passwords, phone numbers, emails).
*/


import userModel from '../models/userModel.js';
${typescript ? "\nimport { Request, Response } from 'express';" : ""}
/**
 * Retrieves all users from the database and sends them in the response.
 *
 * @returns {Response} JSON response containing an array of user objects.
 * @throws {Error} If an error occurs during the retrieval process.
 */
const getAllUsers = (${
  typescript ? "req: Request, res: Response" : "req, res"
}) => {
    try{
        const users = userModel.getAllUsers();
        res.status(200).json(users);
    }catch(error){
        if (error instanceof Error) return res.status(500).json({message: 'Error retrieving users', error: error.message});
        res.status(500).json({message:'Error', error:'Unknown error'});
        // these should be logged to a file in a real-world application and handled globally with middleware
    }
}
/**
* Retrieves a user by their ID.
*
* @description
* Sends a JSON response with the user data if found, otherwise sends a 404 error.
* Handles errors by sending a 500 error response.
* @returns {Response} JSON response containing user data or error message.
* @throws {Error} If an error occurs during the retrieval process.
*/
const getUserById = (${
  typescript ? "req: Request, res: Response" : "req, res"
}) => {
    try{
        const id ${typescript ? ":number" : ""}= ${
  typescript ? "Number" : "parseInt"
}(req.params.id);
        const user = userModel.getUserById(id);
        if(!user) return res.status(404).json({message: 'User not found'});
        res.status(200).json(user);
    }catch(error){
        if (error instanceof Error) return res.status(500).json({message: 'Error retrieving users', error: error.message});
        res.status(500).json({message:'Error retrieving users', error:'Unknown error'});
        // these should be logged to a file in a real-world application and handled globally with middleware
    }
}

/**
 * Creates a new user with the data provided in the request body.
 * Sends a success response upon creation or an error response if creation fails.
 *
 * @returns {Response} JSON response indicating success or failure.
 * @throws {Error} If an error occurs during the creation process.
 */
const createUser = (${
  typescript ? "req: Request, res: Response" : "req, res"
}) => {
    try{
        const { name, email, password } = req.body;
        userModel.createUser(name, email, password);
        res.status(201).json({ message: 'User created' });
    }catch(error){
        if (error instanceof Error) return res.status(500).json({message: 'Error retrieving users', error: error.message});
        res.status(500).json({message:'Error retrieving users', error:'Unknown error'});
        // these should be logged to a file in a real-world application and handled globally with middleware
    }
}

/**
 * Updates a user with the specified ID using the provided request body.
 *
 * @returns {Response} JSON response indicating success or failure.
 * @throws {Error} If an error occurs during the update process.
 */
const updateUser = (${
  typescript ? "req: Request, res: Response" : "req, res"
}) => {
    try{
        const id ${typescript ? ":number" : ""}= ${
  typescript ? "Number" : "parseInt"
}(req.params.id);
        const { name, email, password } = req.body;
        const result ${
          typescript ? ":Promise<boolean>" : ""
        }= userModel.updateUser(id, name, email, password);
        if(!result) return res.status(404).json({message: 'User not found'});
        res.status(200).json({ message: \`User with ID: \${id} updated\` });
    }catch(error){
        if (error instanceof Error) return res.status(500).json({message: 'Error updating user', error: error.message});
        res.status(500).json({message:'Error updating user', error:'Unknown error'});
        // these should be logged to a file in a real-world application and handled globally with middleware
    }
}

/**
 * Deletes a user with the specified ID.
 *
 * @returns {Response} JSON response indicating success or failure.
 * @throws {Error} If an error occurs during the deletion process.
 */
const deleteUser = (${
  typescript ? "req: Request, res: Response" : "req, res"
}) => {
    try{
        const id ${typescript ? ":number" : ""}= ${
  typescript ? "Number" : "parseInt"
}(req.params.id);
        const result ${
          typescript ? ":Promise<boolean>" : ""
        }= userModel.deleteUser(id);
        if(!result) return res.status(404).json({message: 'User not found'});
        res.json({ message: \`User with ID: \${id} deleted\` });
    }catch(error){
        if (error instanceof Error) return res.status(500).json({message: 'Error deleting User', error: error.message});
        res.status(500).json({message:'Error deleting User', error:'Unknown error'});
        // these should be logged to a file in a real-world application and handled globally with middleware
    }
}

export default { getAllUsers, getUserById, createUser, updateUser, deleteUser };
`;

export default controllerGenerator;
