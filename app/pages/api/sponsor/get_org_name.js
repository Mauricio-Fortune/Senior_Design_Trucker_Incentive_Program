// View all pending driver application for a specific org

import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config(); // This loads the .env variables

export default async function handler(req, res) {
    
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
      

       
        const query = `SELECT org_Name FROM Org WHERE org_ID = ?`;

       
        const [org_Name] = await connection.query(query, [org_ID]);
    

        await connection.end();

        res.status(200).json(org_Name[0]);
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}