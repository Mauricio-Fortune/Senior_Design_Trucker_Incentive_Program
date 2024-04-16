// POST add sponsor to org

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

        const query = 'INSERT INTO User_Org (user_ID, org_ID)  VALUES (?,?)'
        const response = await connection.query(query,[user_ID, org_ID]);

        const query2 = 'UPDATE User_Org SET app_Status = ? WHERE user_ID = ? AND org_ID = ?'
        const response2 = await connection.query(query2,["ACCEPTED", user_ID, org_ID]);

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json({message: "Successfully added sponsor to org"});
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}