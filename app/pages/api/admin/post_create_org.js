// POST send application to Sponsor

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

        // get application
        const  {org_Name} = req.body;
        console.log(org_Name);
        
        // make query
        const query = 'INSERT INTO Org (org_Name) VALUES (?)';
        
        // send query
        const [response] = await connection.query(query,[org_Name]);

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json({message: `Successfully created org: ${org_Name}`});
        res.status(404).json({ message: "Org could not be added" });
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}