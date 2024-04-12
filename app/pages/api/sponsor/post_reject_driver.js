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

    console.log(dbConfig);

    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(dbConfig);

        const { user_ID, org_ID, driver_app_id} = req.body;
        console.log(user_ID);
        console.log(org_ID);
        console.log(driver_app_id);

        const query = 'UPDATE User_Org SET app_Status = ? WHERE user_ID = ? AND org_ID = ?'
        const response = await connection.query(query,["REJECTED", user_ID, org_ID]);

        //UPDATE AUDIT LOG
        const query2 = 'UPDATE Driver_App_Audit  SET app_status = ? WHERE driver_app_id = ?';
        const response2 = await connection.query(query2,["REJECTED",driver_app_id]);

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json({message: "Successfully rejected driver"});
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}