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
        const {order_ID}= req.body;

        // Prepare the SELECT query
        const query = `UPDATE Orders SET order_Status = ? WHERE order_ID = ?`;

        // Execute the query
        const [orders] = await connection.query(query, ["CANCELLED",order_ID]);

        await connection.end();

        // Send the data as JSON response
        res.status(200).json(orders);
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}