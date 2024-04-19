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

        // Query organization IDs for the provided user_ID
        const [rows] = await connection.query('SELECT org_ID FROM User_Org WHERE user_ID = ? AND app_Status = ?', [user_ID, 'ACCEPTED']);

        // Check if rows array is empty
        if (rows.length === 0) {
            // Close the database connection
            await connection.end();
            // Send NULL response as there are no org_IDs
            return res.status(200).json(null);
        }

        // Extract organization IDs from the rows
        const orgIDs = rows.map(row => row.org_ID);

        // Generate placeholders for the orgIDs in the SQL query
        const placeholders = orgIDs.map(() => '?').join(',');

        // Query organization names for the provided orgIDs
        const [rows2] = await connection.query(`SELECT org_Name FROM Org WHERE org_ID IN (${placeholders})`, orgIDs);

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json(rows2.map(row => row.org_Name));

    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}