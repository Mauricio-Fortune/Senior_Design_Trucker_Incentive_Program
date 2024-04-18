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

    const { user_ID, bio } = req.body;

    try {

        // Create a connection to the database
        const connection = await mysql.createConnection(dbConfig);

        const query = ('UPDATE User SET bio = ? WHERE user_ID = ?;');

        const response = await connection.query(query, [bio, user_ID]);

        await connection.end();

        // Send the data as JSON response
        res.status(200).json({message: "Successfully changed bio"});
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}