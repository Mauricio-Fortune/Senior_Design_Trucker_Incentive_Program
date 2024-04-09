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

        const { user_ID, org_ID } = req.body;

        // Set all is_current flags for this user to false
        await connection.query('UPDATE User_Org SET is_current = false WHERE user_ID = ?', [user_ID]);

        // Set is_current to true for a specific org_ID for this user
        const [result] = await connection.query('UPDATE User_Org SET is_current = true WHERE user_ID = ? AND org_ID = ?', [user_ID, org_ID]);

        // Close the database connection
        await connection.end();

        // Send the confirmation as JSON response
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Operation successful' });
        } else {
            res.status(404).json({ message: 'Update failed' });
        }
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
