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
        const { org_ID, point_Ratio } = req.body; 

        const query = `UPDATE Org SET point_Ratio = ? WHERE org_ID = ?`;


        await connection.execute(query, [point_Ratio, org_ID]);

      
        await connection.end();

        res.status(200).json({ message: "Point Ratio updated successfully" });
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
