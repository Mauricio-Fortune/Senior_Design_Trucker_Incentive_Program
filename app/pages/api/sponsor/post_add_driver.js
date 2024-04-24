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
        const currentTimestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const { user_ID, org_ID, email, name, user_Type} = req.body;
        console.log('API');
        console.log(user_ID);
        console.log(org_ID);
        console.log(email);
        console.log(name);

        
        const query1 = 'INSERT INTO User (user_ID, user_Type, email, first_Name,is_active) VALUES (?,?,?,?,?)';
        const response1 = await connection.query(query1,[user_ID,user_Type,email,name,1]);

        const query = 'INSERT INTO User_Org (user_ID, org_ID, app_status,is_current) VALUES (?,?,?,?)';
        const response = await connection.query(query,[user_ID, org_ID,'ACCEPTED',1]);

        //UPDATE AUDIT LOG
        const query2 = 'INSERT INTO Driver_App_Audit (org_ID, user_ID,reason,timestamp,app_status) VALUES (?,?,?,?,?)';
        const response2 = await connection.query(query2,[org_ID,user_ID,'Created by Sponsor',currentTimestamp,'ACCEPTED']);

        // add 0 points so they are in the audit table 
        const query3 = 'INSERT INTO Point_Changes_Audit (user_ID, point_change_value, reason, org_ID, timestamp) VALUES (?,?,?,?,?)';
        const response3 = await connection.query(query3, [user_ID, 0, 'created by sponsor', org_ID, currentTimestamp]);
        

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json({message: "Successfully accepted driver"});
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}