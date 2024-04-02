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

    console.log(dbConfig);

    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(dbConfig);

        const { user_ID, org_ID, reason, timestamp } = req.body;

        const query = 'INSERT INTO User_Org (user_ID, org_ID)  VALUES (?,?)'
        const response = await connection.query(query,[user_ID, org_ID]);

        const query2 = 'INSERT INTO Driver_app_audit (org_ID, user_ID, reason, timestamp, status) VALUES (?,?,?,?,?)';
        const response2 = await connection.query(query2,[org_ID, user_ID, reason, timestamp, "PENDING"]);

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json({message: "Successfully sent application"});
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}