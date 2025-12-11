const oracledb = require('oracledb');
const database = require('../config/db');

// List all users
async function listAllUsers() {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `SELECT cnic, name, email, phone FROM users ORDER BY name`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT } // return objects
        );
        return result.rows;
    } catch (err) {
        console.error('Error listing users:', err);
        throw err;
    } finally {
        if (connection) await connection.close();
    }
}

// Get user by CNIC
async function getUserByCNIC(cnic) {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `SELECT cnic, name, email, phone FROM users WHERE cnic = :cnic`,
            [cnic],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        return result.rows[0];
    } catch (err) {
        console.error('Error getting user:', err);
        throw err;
    } finally {
        if (connection) await connection.close();
    }
}

// Login user
async function loginUser(email, password) {
    let connection;
    try {
        connection = await database.getConnection();
        const result = await connection.execute(
            `SELECT cnic, name, email, phone 
             FROM users 
             WHERE LOWER(email) = LOWER(:email) 
               AND password = :password`,
            [email.trim(), password.trim()],
            { outFormat: oracledb.OUT_FORMAT_OBJECT } // <--- object format
        );
        return result.rows[0] || null; // return null if not found
    } catch (err) {
        console.error('Error logging in:', err);
        throw err;
    } finally {
        if (connection) await connection.close();
    }
}

// Register user
async function registerUser(cnic, name, email, password, phone) {
    let connection;
    try {
        connection = await database.getConnection();
        await connection.execute(
            `INSERT INTO users (cnic, name, email, password, phone) 
             VALUES (:cnic, :name, :email, :password, :phone)`,
            [cnic, name, email, password, phone],
            { autoCommit: true }
        );
        return { cnic, name, email, phone };
    } catch (err) {
        console.error('Error registering user:', err);
        throw err;
    } finally {
        if (connection) await connection.close();
    }
}

// Update user
async function updateUser(cnic, name, email, phone) {
    let connection;
    try {
        connection = await database.getConnection();
        await connection.execute(
            `UPDATE users SET name = :name, email = :email, phone = :phone WHERE cnic = :cnic`,
            [name, email, phone, cnic],
            { autoCommit: true }
        );
        return { cnic, name, email, phone };
    } catch (err) {
        console.error('Error updating user:', err);
        throw err;
    } finally {
        if (connection) await connection.close();
    }
}

// Delete user
async function deleteUser(cnic) {
    let connection;
    try {
        connection = await database.getConnection();
        await connection.execute(
            `DELETE FROM users WHERE cnic = :cnic`,
            [cnic],
            { autoCommit: true }
        );
        return { success: true };
    } catch (err) {
        console.error('Error deleting user:', err);
        throw err;
    } finally {
        if (connection) await connection.close();
    }
}

module.exports = {
    listAllUsers,
    getUserByCNIC,
    loginUser,
    registerUser,
    updateUser,
    deleteUser
};
