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

        // Extract org_ID from the request body or query parameters
        const org_ID = req.query.org_ID;

        // Prepare the SELECT query
        const query = `
            SELECT 
                Driver_App_Audit.driver_app_id, 
                Driver_App_Audit.user_ID, 
                Driver_App_Audit.timestamp, 
                Driver_App_Audit.reason,
                User.first_Name, 
                User.email
            FROM 
                Driver_App_Audit 
            JOIN 
                User ON Driver_App_Audit.user_ID = User.user_ID 
            WHERE 
                Driver_App_Audit.org_ID = ? AND 
                Driver_App_Audit.app_Status = 'PENDING';
            `;

        // Execute the query
        const [applications] = await connection.query(query, [org_ID,"PENDING"]);

        // Send the data as JSON response
        res.status(200).json(applications);
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}