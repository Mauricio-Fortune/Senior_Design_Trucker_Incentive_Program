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
    const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

   

    const {user_ID,is_cart,org_ID} = req.body;
    // table shoudl be auto increment for the orderID

    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(dbConfig);

        const sql_query = (`INSERT INTO Orders (user_ID, is_cart,org_ID,timestamp) VALUES (?,?,?,?) `);

        const [results] = await connection.execute(sql_query, [user_ID,is_cart,org_ID,currentTimestamp]);

        // Close the database connection
        await connection.end();

        if (results.affectedRows > 0) {
           res.status(200).json({ order_ID: results.insertId });
        } else {
            res.status(404).json({ message: "Order could not be added" });
        }
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}