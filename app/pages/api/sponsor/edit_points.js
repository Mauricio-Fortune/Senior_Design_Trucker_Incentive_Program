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

        const { point_change_id, user_ID, point_change_value, reason, org_ID, timestamp } = req.body;
        console.log(user_ID);
        console.log(point_change_value);
        console.log(reason);
        console.log(org_ID);
        console.log(timestamp);

        const query = 'INSERT INTO Point_Changes_Audit (point_change_id, user_ID, point_change_value, reason, org_ID, timestamp) VALUES (?,?,?,?,?,?)';
        const response = await connection.query(query, [point_change_id, user_ID, point_change_value, reason, org_ID, currentTimestamp]);

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json({message: "Successfully edited points"});
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}