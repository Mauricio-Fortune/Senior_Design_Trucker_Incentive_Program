// GET driver points

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

        //const {user_ID} = req.body;
        const user_ID = req.query.user_ID;
        const org_ID = req.query.org_ID;
        console.log(user_ID);

        const [rows] = await connection.query(
            'SELECT user_ID, SUM(point_change_value) AS total FROM Point_Changes_Audit WHERE user_ID = ? AND org_ID = ?GROUP BY user_ID', 
            [user_ID, org_ID]
        );
        // Close the database connection
        await connection.end();

        if (rows.length > 0) {
            // Since the query groups by user_ID, there should be only one row in the result.
            // Send back the sum directly.
            const pointsSum = rows[0].total;
            res.status(200).json({ totalPoints: pointsSum });
        } else {
            // If no data found for the user_ID, you might want to return 0 or a message indicating no points were found.
            res.status(404).json({ message: 'No points found for the provided user_ID.', totalPoints: 0 });
        }
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}