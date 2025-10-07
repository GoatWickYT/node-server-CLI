const modelGenerator = (typescript, database) => {
  if (database === "sqlite") return sqliteModel(typescript);
  else if (database === "mysql") return mysqlModel(typescript);
};

const mysqlModel = (typescript) => `/*
[-----IMPORTANT INSTRUCTIONS-----]  

This is a sample model file for MySQL .
To create more models, define additional classes following the structure below.
Use SQL syntax to interact with the MySQL database.
MySQL documentation: https://dev.mysql.com/doc/
*/

import db from '../config/db.js'

${
  typescript
    ? `import {RowDataPacket, ResultSetHeader} from "mysql2/promise"

interface User extends RowDataPacket {
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
const getAllUsers = async ()${typescript ? ":Promise<User[]>" : ""} => {
  const [rows] = await db.query${
    typescript ? "<User[]>" : ""
  }("SELECT * FROM users");
  return rows 
};
/**
 * Retrieves a user by their unique identifier.
 *
 * @param {number|string} id - The unique identifier of the user.
 * @returns {${
   typescript ? "User" : "Object"
 }|null} The user object if found, otherwise null.
 */
const getUserById = async (id ${typescript ? ": number" : ""}) ${
  typescript ? ":Promise<User | null>" : ""
}=> {
  const [rows] = await db.query${
    typescript ? "<User[]>" : ""
  }("SELECT * FROM users WHERE id=?", [id]);
  return rows.length > 0 ? rows[0] : null;
};
 /**
  * Creates a new user in the database.
  *
  * @param {string} name - The name of the user.
  * @param {string} email - The email address of the user.
  * @param {string} password - The password for the user.
  * @returns {number} The ID of the newly created user.
  */
const createUser = async (name ${typescript ? ": string" : ""}, email ${
  typescript ? ": string" : ""
}, password ${typescript ? ": string" : ""})${
  typescript ? ":Promise<number>" : ""
} => {
     const [result] = await db.query${typescript ? "<ResultSetHeader>" : ""}(
       "INSERT INTO users (name, password, email) VALUES (?, ?, ?)",
       [name, password, email]
     );
     return result.insertId;
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
const updateUser = async (id ${typescript ? ":number" : ""}, name ${
  typescript ? ": string" : ""
}, email ${typescript ? ": string" : ""}, password ${
  typescript ? ": string" : ""
})${typescript ? ":Promise<boolean>" : ""} => {
    const [result] = await db.query${typescript ? "<ResultSetHeader>" : ""}(
      "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
      [name, email, password, id]
    );
    return result.affectedRows > 0;
  };

 /**
  * Deletes a user from the database.
  *
  * @param {number|string} id - The unique identifier of the user to delete.
  * @returns {boolean} The boolean of rows affected by the deletion.
  */
 const deleteUser = async (id ${typescript ? ": number" : ""})${
  typescript ? ":Promise<boolean>" : ""
} => {
    const [result] = await db.query${
      typescript ? "<ResultSetHeader>" : ""
    }("DELETE FROM users WHERE id = ?"[id]);
    return result.affectedRows > 0;
  };

  export default {getAllUsers, getUserById, createUser, updateUser, deleteUser}
`;

const sqliteModel = (typescript) => `/*
[-----IMPORTANT INSTRUCTIONS-----]  

This is a sample model file for SQLite using better-sqlite3.
To create more models, define additional classes following the structure below.
Use SQL syntax to interact with the SQLite database.
SQLite documentation: https://www.sqlite.org/docs.html
*/

import db from '../config/db.js';
${
  typescript
    ? `
    interface User{
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
const getAllUsers = ()${typescript ? ":User[]" : ""} => {
  const query = db.prepare('SELECT * FROM users');
  const users ${typescript ? ": User[]" : ""} = query.all()${
  typescript ? " as User[]" : ""
};
  return users;
};
  
/**
 * Retrieves a user by their unique identifier.
 *
 * @param {number|string} id - The unique identifier of the user.
 * @returns {${
   typescript ? "User" : "Object"
 }|null} The user object if found, otherwise null.
 */
const getUserById = (id ${typescript ? ": number" : ""}) ${
  typescript ? ":User | null" : ""
}=> {
  const query = db.prepare('SELECT * FROM users WHERE id = ?');
  const user ${typescript ? ": User" : ""} = query.get(id)${
  typescript ? " as User" : ""
};
  return user${typescript ? " ?? null" : ""};
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
    typescript ? ": { lastInsertRowid: number | bigint }" : ""
  } = query.run(name, email, password);
  return ${
    typescript ? "Number(info.lastInsertRowid)" : "info.lastInsertRowid"
  };
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
