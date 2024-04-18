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
        const connection = await mysql.createConnection(dbConfig);

        const org_ID = req.query.org_ID;
        const user_ID = req.query.user_ID;

        const row = await connection.query('UPDATE User_Org SET Is_current = 0 WHERE org_ID != ? AND user_ID = ?', [org_ID, user_ID]);
        const row2 = await connection.query('UPDATE User_Org SET Is_current = 1 WHERE org_ID = ? AND user_ID = ?', [org_ID, user_ID]);

        await connection.end();

    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}