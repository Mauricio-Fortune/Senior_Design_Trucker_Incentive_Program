// POST send application to Sponsor

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

        // get application
        const {org_ID} = req.body;
        
        // make query
        const query = 'DELETE FROM Org WHERE org_ID = ?';
        
        // send query
        const [rows] = await connection.query(query,[org_ID]);

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json(rows);
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}