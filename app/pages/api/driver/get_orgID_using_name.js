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

        const org_Name = req.query.org_Name;

        const [rows, fields] = await connection.execute('SELECT org_ID from Org WHERE org_Name = ?', [org_Name]);

        await connection.end();

        // Check if any rows were returned and if org_ID exists
        if (rows.length > 0 && rows[0].org_ID !== undefined) {
            const org_ID = rows[0].org_ID; // Accessing the org_ID from the first row
            res.status(200).json(org_ID); // Sending just the org_ID value in the response
        } else {
            res.status(404).json({ message: 'Organization not found or org_ID missing' });
        }
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
