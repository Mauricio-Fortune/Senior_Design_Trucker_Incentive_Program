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

        const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const user_ID = req.query.user_ID;
        const org_ID = req.query.org_ID;
        const reason = req.query.reason;
        const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const user_ID = req.query.user_ID;
        const org_ID = req.query.org_ID;
        const reason = req.query.reason;

        const query = 'INSERT INTO User_Org (user_ID, org_ID)  VALUES (?,?)'
        const response = await connection.query(query,[user_ID, org_ID]);

        const query2 = 'INSERT INTO Driver_App_Audit (org_ID, user_ID, reason, timestamp, app_Status) VALUES (?,?,?,?,?)';
        const response2 = await connection.query(query2,[org_ID, user_ID, reason, currentTimestamp, "PENDING"]);
        const response2 = await connection.query(query2,[org_ID, user_ID, reason, currentTimestamp, "PENDING"]);

        // Close the database connection
        await connection.end();

    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json(false);
    }
}