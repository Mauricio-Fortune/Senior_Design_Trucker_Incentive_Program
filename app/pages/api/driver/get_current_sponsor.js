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

        const user_ID = req.query.user_ID;

        const [result] = await connection.query('SELECT org_ID FROM User_Org WHERE is_current = true AND user_ID = ?', [user_ID]);

        // Close the database connection
        await connection.end();

        // Send the confirmation as JSON response
        res.status(200).json({ org_ID: result[0].org_ID });
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
