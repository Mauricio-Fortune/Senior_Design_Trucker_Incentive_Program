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

        const { user_ID, org_ID, email, name} = req.body;
        console.log('API');
        console.log(user_ID);
        console.log(org_ID);
        console.log(email);
        console.log(name);

        
            const query1 = 'INSERT INTO User (user_ID, user_Type, email, first_Name,is_active) VALUES (?,?,?,?,?)';
            const response1 = await connection.query(query1,[user_ID,'SPONSOR',email,name,1]);
    
            const query = 'INSERT INTO User_Org (user_ID, org_ID, app_status, is_current, active_User) VALUES (?,?,?,?,?)';
            const response = await connection.query(query,[user_ID, org_ID,'ACCEPTED',1,1]);
         

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json({message: "Successfully added Sponsor User"});
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}