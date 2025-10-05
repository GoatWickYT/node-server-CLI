const modelGenerator = (typescript, database) => {
  if (database === "sqlite") {
    return sqliteModel(typescript);
  }
};

const sqliteModel = (typescript) => `/*
[-----IMPORTANT INSTRUCTIONS-----]  

This is a sample model file for SQLite using better-sqlite3.
To create more models, define additional classes following the structure below.
Use SQL syntax to interact with the SQLite database.
SQLite documentation: https://www.sqlite.org/docs.html
*/

import db from '../config/db.js';${
  typescript ? "\nimport { RowDataPacket } from 'better-sqlite3';" : ""
}
${
  typescript
    ? `interface User{
    id? :number
    name :string
    email :string
    password :string\n}`
    : ""
}

/**
 * Retrieves all users from the database.
 *
 * @returns {Array<${typescript ? "User" : "Object"}>} An array of user objects.
 */
const getAllUsers = ()${typescript ? ":Array<User>" : ""} => {
  const query = db.prepare('SELECT * FROM users');
  const users ${typescript ? ": RowDataPacket[]" : ""} = query.all();
  return users;
};
  
/**
 * Retrieves a user by their unique identifier.
 *
 * @param {number|string} id - The unique identifier of the user.
 * @returns {Object|null} The user object if found, otherwise null.
 */
const getUserById = (id ${typescript ? ": number" : ""}) ${
  typescript ? ":User | null" : ""
}=> {
  const query = db.prepare('SELECT * FROM users WHERE id = ?');
  const user ${typescript ? ": RowDataPacket" : ""} = query.get(id);
  return user;
};
  
/**
 * Creates a new user in the database.
 *
 * @param {string} name - The name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user.
 * @returns {number} The ID of the newly created user.
 */
const createUser = (name ${typescript ? ": string" : ""}, email ${
  typescript ? ": string" : ""
}, password ${typescript ? ": string" : ""})${typescript ? ":number" : ""} => {
  const query = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
  const info ${
    typescript ? ": { lastInsertRowid: number }" : ""
  } = query.run(name, email, password);
  return info.lastInsertRowid;
};
  
/**
 * Updates a user's information in the database.
 *
 * @param {number|string} id - The unique identifier of the user to update.
 * @param {string} name - The new name for the user.
 * @param {string} email - The new email address for the user.
 * @param {string} password - The new password for the user.
 * @returns {boolean} The boolean of rows affected by the deletion.
 */
const updateUser = (id ${typescript ? ": number" : ""}, name ${
  typescript ? ": string" : ""
}, email ${typescript ? ": string" : ""}, password ${
  typescript ? ": string" : ""
})${typescript ? ":boolean" : ""} => {
    const query = db.prepare('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?');
    const info ${
      typescript ? ": { changes: number }" : ""
    } = query.run(name, email, password, id);
    return info.changes > 0;
};

/**
 * Deletes a user from the database.
 *
 * @param {number|string} id - The unique identifier of the user to delete.
 * @returns {boolean} The boolean of rows affected by the deletion.
 */
const deleteUser = (id ${typescript ? ": number" : ""})${
  typescript ? ":boolean" : ""
} => {
    const query = db.prepare('DELETE FROM users WHERE id = ?');
    const info ${typescript ? ": { changes: number }" : ""} = query.run(id);
    return info.changes > 0;
};

export default { getAllUsers, getUserById, createUser, updateUser, deleteUser };
`;

export default modelGenerator;
