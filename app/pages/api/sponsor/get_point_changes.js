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

        const org_ID = req.query.org_ID;
        const selectedDriver = req.query.selectedDriver;
        const startDate = req.query.startDate || '0000-00-00'; // Default to '0000-00-00' if null
        const endDate = req.query.endDate || '9999-12-31'; // Default to '9999-12-31' if null

        console.log(startDate);
        console.log(endDate);

        // Fetch user_ID for the selected driver
        const [selectedDriverRows] = await connection.query('SELECT user_ID FROM User WHERE first_Name = ? AND user_Type = ?', [selectedDriver, 'DRIVER']);
        if (!selectedDriverRows || selectedDriverRows.length === 0) {
            await connection.end();
            return res.status(404).json({ message: 'Selected driver not found.' });
        }

        const selectedDriverID = selectedDriverRows[0].user_ID;

        // Query point changes for the selected driver within the provided date range
        const [rows] = await connection.query('SELECT p.point_change_id, p.user_ID, u.first_Name, p.point_change_value, p.reason, p.timestamp FROM Point_Changes_Audit p JOIN User u ON p.user_ID = u.user_ID WHERE p.user_ID = ? AND p.org_ID = ? AND p.timestamp >= ? AND p.timestamp <= ? ORDER BY p.timestamp DESC', [selectedDriverID, org_ID, startDate, endDate]);

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json(rows);

    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}