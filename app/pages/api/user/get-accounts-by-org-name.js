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

    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(dbConfig);

        const org_name = req.query.org_name;
        const user_type = req.query.user_type; 

        const [rows] = await connection.query('SELECT u.user_ID, u.user_Type, u.first_Name, u.last_Name FROM User u JOIN User_Org uo ON u.user_ID = uo.user_ID JOIN Org o ON uo.org_ID = o.org_ID WHERE o.org_Name = ? AND u.user_Type = ?', [org_name, user_type]);


        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json(rows);
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}