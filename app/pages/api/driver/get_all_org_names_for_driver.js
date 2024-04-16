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

        const org_IDs = req.query.org_IDs;
        console.log(org_IDs);

        // Parse the string of organization IDs

        // Generate placeholders for the orgIDs in the SQL query
        const placeholders = org_IDs.map(() => '?').join(',');
        console.log(placeholders);
        

        // Query organization names for the provided orgIDs
        const [rows] = await connection.query(`SELECT org_Name FROM Org WHERE org_ID IN (${placeholders})`, org_IDs);

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json({ org_Names: rows.map(row => row.org_Name) }); // Extract organization names from the rows
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}