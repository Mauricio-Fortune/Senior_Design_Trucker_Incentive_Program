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

        const query = (`SELECT o.org_Name FROM Org o WHERE NOT EXISTS (SELECT 1 FROM User_Org uo WHERE uo.org_ID = o.org_ID AND uo.user_ID = ? AND uo.active_User = 1);`);

        const [rows] = await connection.query(query,[user_ID]);
        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json(rows);
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}