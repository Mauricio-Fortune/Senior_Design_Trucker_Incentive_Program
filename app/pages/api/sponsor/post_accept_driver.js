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

        const { user_ID, org_ID} = req.body;

        const query = 'UPDATE User_Org SET app_Status = ? WHERE user_ID = ? AND org_ID = ?'
        const response = await connection.query(query,["ACCEPTED", user_ID, org_ID]);

        //UPDATE AUDIT LOG
        const query2 = 'UPDATE Driver_App_Audit  SET app_status = ? WHERE user_ID = ? AND org_ID = ?';
        const response2 = await connection.query(query2,["ACCEPTED",user_ID,org_ID]);

        // add 0 points so they are in the audit table 
        const query3 = 'INSERT INTO Point_Changes_Audit (user_ID, point_change_value, reason, org_ID, timestamp) VALUES (?,?,?,?,?)';
        const response3 = await connection.query(query3, [user_ID, 0, 'Accepted', org_ID, 'timestamp']);
        

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json({message: "Successfully accepted driver"});
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}