// POST API to add or update a driver in an organization

import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config(); // Loads the .env variables

export default async function handler(req, res) {
    const dbConfig = {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    };

    const { user_ID, org_ID } = req.body;
    console.log('Request body:', req.body);


    try {
        const connection = await mysql.createConnection(dbConfig);
        
        console.log('user_ID:', user_ID, 'org_ID:', org_ID);


        if (typeof user_ID === 'undefined' || typeof org_ID === 'undefined') {
            return res.status(400).json({ message: 'Missing user_ID or org_ID' });
        }

        // Start by checking if the user already has a non-current association with the org
        const checkQuery = 'SELECT * FROM User_Org WHERE user_ID = ? AND org_ID = ? AND Is_current = 0';
        const [existingEntries] = await connection.execute(checkQuery, [user_ID, org_ID]);
        console.log('Got the existing entry:', existingEntries);

        if (existingEntries.length > 0) {
            console.log('Running the update (updating the entry):', existingEntries);
            // If the user is already associated but not current, set Is_current to 1
            const updateQuery = 'UPDATE User_Org SET Is_current = 1, app_Status = "ACCEPTED" WHERE user_ID = ? AND org_ID = ? AND Is_current = 0';
            await connection.execute(updateQuery, [user_ID, org_ID]);
            res.status(200).json({ message: "User re-activated in org successfully" });
        } else {
            console.log('Running the Insert (create new entry):', existingEntries);
            // If no non-current association exists, insert a new record
            const insertQuery = 'INSERT INTO User_Org (user_ID, org_ID, app_Status, Is_current) VALUES (?, ?, "ACCEPTED", 1)';
            await connection.execute(insertQuery, [user_ID, org_ID]);
            res.status(200).json({ message: "Successfully added driver to org" });
        }

        await connection.end();
    } catch (error) {
        console.error('Database connection or query failed:', error);
        res.status(500).json({ message: 'Internal Server Error'});
    }
}
