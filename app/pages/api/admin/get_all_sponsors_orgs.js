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

        // Query organization IDs for the provided user_ID
        const [rows] = await connection.query('SELECT org_Name FROM Org');

        // Check if rows array is empty
        if (rows.length === 0) {
            // Close the database connection
            await connection.end();
            // Send NULL response as there are no org_IDs
            return res.status(200).json(null);
        }

        await connection.end();

        // Send the data as JSON response
        res.status(200).json(rows.map(row => row.org_Name));

    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}