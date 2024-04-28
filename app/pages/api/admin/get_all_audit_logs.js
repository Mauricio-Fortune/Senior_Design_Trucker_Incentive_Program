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

        const selectedAudit = req.query.selectedAudit;
        const startDate = req.query.startDate || '0000-00-00'; // Default to '0000-00-00' if null
        const endDate = req.query.endDate || '9999-12-31'; // Default to '9999-12-31' if null

        console.log(startDate);
        console.log(endDate);

        if (selectedAudit == 'Driver_App_Audit') {
            [rows] = await connection.query('SELECT d.driver_app_id, d.user_ID, u.first_Name, d.reason, d.timestamp, d.app_Status FROM Driver_App_Audit d JOIN User u ON d.user_ID = u.user_ID WHERE d.timestamp >= ? AND d.timestamp <= ? ORDER BY d.timestamp DESC', [startDate, endDate]);
        }
        else if (selectedAudit  == 'Login_Attempts_Audit') {
            [rows] = await connection.query('SELECT l.login_attempts_id, l.user_ID, u.first_Name, l.status, l.timestamp FROM Login_Attempts_Audit l JOIN User u ON l.user_ID = u.user_ID JOIN User_Org uo ON u.user_ID = uo.user_ID WHERE l.timestamp >= ? AND l.timestamp <= ? ORDER BY l.timestamp DESC', [startDate, endDate]);
        }
        else if (selectedAudit == 'Password_Changes_Audit') {
            [rows] = await connection.query('SELECT p.password_change_id, p.user_ID, u.first_Name, p.change_type, p.timestamp FROM Password_Changes_Audit p JOIN User u ON p.user_ID = u.user_ID JOIN User_Org uo ON u.user_ID = uo.user_ID WHERE p.timestamp >= ? AND p.timestamp <= ? ORDER BY p.timestamp DESC', [startDate, endDate]);
        }
        else if (selectedAudit == 'Point_Changes_Audit') {
            [rows] = await connection.query('SELECT p.point_change_id, p.user_ID, u.first_Name, p.point_change_value, p.reason, p.timestamp FROM Point_Changes_Audit p JOIN User u ON p.user_ID = u.user_ID WHERE p.timestamp >= ? AND p.timestamp <= ? ORDER BY p.timestamp DESC', [startDate, endDate]);
        }
        else {
            await connection.end();
            return res.status(404).json({ message: 'Selected audit not found.' });
        }

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json(rows);

    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}