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

    let rows;

    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(dbConfig);

        const selectedSponsor = req.query.selectedSponsor;
        const selectedDriver = req.query.selectedDriver;
        const startDate = req.query.startDate || '0000-00-00'; // Default to '0000-00-00' if null
        const endDate = req.query.endDate || '9999-12-31'; // Default to '9999-12-31' if null

        const [selectedSponsorRows] = await connection.query('SELECT org_ID FROM Org WHERE org_Name = ?', [selectedSponsor]);

        if (!selectedSponsorRows || selectedSponsorRows.length === 0) {
            await connection.end();
            return res.status(404).json({ message: 'Selected driver not found.' });
        }

        const selectedSponsorID = selectedSponsorRows[0].org_ID;


        const [selectedDriverRows] = await connection.query('SELECT user_ID FROM User WHERE first_Name = ? AND user_Type = ?', [selectedDriver, 'DRIVER']);

        if (!selectedDriverRows || selectedDriverRows.length === 0) {
            await connection.end();
            return res.status(404).json({ message: 'Selected driver not found.' });
        }

        const selectedDriverID = selectedDriverRows[0].user_ID;

        [rows] = await connection.query('SELECT u.first_Name, oi.order_ID, oi.item_Name, oi.item_Quantity, oi.points, o.timestamp FROM Order_Item oi JOIN Orders o ON oi.order_ID = o.order_ID JOIN User u on o.user_ID = u.user_ID WHERE o.org_ID = ? AND o.user_ID = ? AND o.timestamp >= ? AND o.timestamp <= ?', [selectedSponsorID, selectedDriverID, startDate, endDate]);

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json(rows);

    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}