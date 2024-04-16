// DELETE driver account

import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config(); // This loads the .env variables

export default async function handler(req, res) {

    // Database connection configuration
    const dbConfig = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    };



    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(dbConfig);

        const userID = req.query.userID;

        const [result] = await connection.query('UPDATE User SET is_active = false WHERE userID = ?', [userID]);

        // Close the database connection
        await connection.end();

       
        // Send the confirmation as JSON response
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}