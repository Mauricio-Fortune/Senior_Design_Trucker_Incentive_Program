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
                User_Org.user_ID,
                User.first_Name, 
                User.email,
                SUM(Point_Changes_Audit.point_change_value) AS total_points
            FROM 
                User_Org
            JOIN 
                User ON User_Org.user_ID = User.user_ID
            JOIN
                Point_Changes_Audit ON User_Org.user_ID = Point_Changes_Audit.user_ID
            WHERE 
                User_Org.org_ID = ? AND 
                User_Org.app_Status = 'ACCEPTED' AND
                User.user_Type = 'DRIVER' AND
                Point_Changes_Audit.org_ID = ?
            GROUP BY
                User_Org.user_ID, User.first_Name, User.email
            `;

  

        // Execute the query
        const [userInfo] = await connection.query(query, [org_ID,org_ID,'ACCEPTED']);

        await connection.end();

        // Send the data as JSON response
        res.status(200).json(userInfo);
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}