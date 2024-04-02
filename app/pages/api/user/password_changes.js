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

    console.log(dbConfig);

    const { password_change_id, timestamp, user_ID, change_type } = req.body;

    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(dbConfig);

        const query = ('INSERT INTO Password_Changes_Audit (password_change_id, timestamp, user_ID, change_type) VALUES (?,?,?,?); ');

        const response = await connection.query(query, [password_change_id, timestamp, user_ID, change_type]);

        await connection.end();

        // Send the data as JSON response
        res.status(200).json({message: "Successfully audited password change"});
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}