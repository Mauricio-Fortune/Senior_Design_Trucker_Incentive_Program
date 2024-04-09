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

        // Assuming req.body is an object with user_ID and order_ID properties
        const { user_ID, order_ID } = req.body;

        // Corrected query
        const [result] = await connection.query('UPDATE Orders SET is_cart = FALSE WHERE order_ID = ? AND user_ID = ?', [order_ID, user_ID]);

        // Close the database connection
        await connection.end();

        if (result.affectedRows > 0) {
            // Rows were updated
            res.status(200).json("Updated");
        } else {
            // No rows were updated
            res.status(404).json("No matching records found to update.");
        }

    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
