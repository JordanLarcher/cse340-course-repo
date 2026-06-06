import db from './db.js';
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password, role_id)
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4))
        RETURNING user_id;
    `;
    const result = await db.query(query, [name, email, passwordHash, default_role]);

    if(result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID: ', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
}

const getUserByEmail = async (email) => {
    const query = `
        SELECT user_id, name, email, password
        FROM users
        WHERE email = $1;
    `;
    const result = await db.query(query, [email]);

    if(result.rows.length === 0) {
        return null; // No user found with the given email
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Retrieved user with email: ', email);
    }

    return result.rows[0];
}

const verifyPassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
}

const authenticateUser = async (email, password) => {
    const user = await getUserByEmail(email);

    if (!user) {
        return null;
    }

    const passwordMatch = await verifyPassword(password, user.password);

    if (!passwordMatch) {
        return null;
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}




export {authenticateUser, createUser, getUserByEmail};