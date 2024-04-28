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

        const user_ID = req.query.user_ID;
        const org_ID = req.query.org_ID;

        const [result] = await connection.query('SELECT order_ID FROM Orders WHERE is_cart = true AND user_ID = ? AND org_ID = ?', [user_ID,org_ID]);

        // Close the database connection
        await connection.end();

        if (result.length > 0) {
            // Entry found, send back the order_ID
            res.status(200).json({ order_ID: result[0].order_ID });
        } else {
            // No entry found that matches the criteria
            res.status(200).json({order_ID : -1});
        }

    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
