// View all pending driver application for a specific org

import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config(); // This loads the .env variables

export default async function viewAllApplications(req, res) {
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

        // Prepare the SELECT query
        const query = `SELECT * FROM User Where user_ID = ?`;

        // Execute the query
        const [applications] = await connection.query(query, [user_ID]);

        // Send the data as JSON response
        if(applications.length > 0)
        res.status(200).json(applications[0]);
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}