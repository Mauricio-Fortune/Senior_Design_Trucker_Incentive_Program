// GET all available catalog items

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
        
        const [userRows] = await connection.query('SELECT orgID * FROM User_Org WHERE userID = ?', [userID]);

          // Check if a sponsorID was found
          if (userRows.length > 0) {
            const sponsorID = userRows[0].orgID;
          }

        const [rows] = await connection.query('SELECT * FROM catalog WHERE orgID = ?', [sponsorID]);

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json(rows);
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}