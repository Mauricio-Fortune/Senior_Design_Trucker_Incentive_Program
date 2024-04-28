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

    let rows;

    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(dbConfig);

        const startDate = req.query.startDate || '0000-00-00'; // Default to '0000-00-00' if null
        const endDate = req.query.endDate || '9999-12-31'; // Default to '9999-12-31' if null

        [rows] = await connection.query('SELECT u.first_Name, oi.order_ID, oi.item_Name, oi.item_Quantity, oi.points, o.timestamp FROM Order_Item oi JOIN Orders o ON oi.order_ID = o.order_ID JOIN User u on o.user_ID = u.user_ID WHERE o.timestamp >= ? AND o.timestamp <= ?', [startDate, endDate]);

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json(rows);

    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}