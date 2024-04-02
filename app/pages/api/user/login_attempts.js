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

    const { login_attempts_id, timestamp, username, status } = req.body;

    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(dbConfig);

        const query = ('INSERT INTO Login_Attempts_Audit (login_attempts_id, timestamp, username, status) VALUES (?,?,?,?); ');

        const response = await connection.query(query, [login_attempts_id, timestamp, username, status]);

        await connection.end();

        // Send the data as JSON response
        res.status(200).json({message: "Successfully audited login attempt"});
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}