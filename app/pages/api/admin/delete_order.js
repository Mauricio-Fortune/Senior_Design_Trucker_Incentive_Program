// USED FOR TESTING

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

        // get application
        const {order_ID} = req.body;

        const [cols] = await connection.query('DELETE FROM Order_Item WHERE order_ID = ?',[order_ID]);
        
        // make query
        const query = 'DELETE FROM Orders WHERE order_ID = ?';
        
        // send query
        const [rows] = await connection.query(query,[order_ID]);

      

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json(rows);
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}