import mysql from 'mysql2/promise';
import { config } from 'dotenv';
import { fetchUserAttributes } from '@aws-amplify/auth';

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

        const { user_ID, email, first_Name, user_type } = req.body;

        //check if user is already in db
        const query = 'SELECT 1 FROM User WHERE user_ID = ? LIMIT 1';
        const [response] = await connection.query(query, [user_ID]);

        if (response.length <= 0) {
            //user doesn't exist
            // const user = await fetchUserAttributes();
            console.log(`Adding ${first_Name} to RDS database`);

            const query2 = 'INSERT INTO User (user_ID, email, first_Name, user_type) VALUES (?,?,?,?)'
            const response2 = await connection.execute(query2, [user_ID, email, first_Name, user_type]);
        }

        else {
            console.log(`${first_Name} already in DB`);
        }

        // Close the database connection
        await connection.end();

        // Send the data as JSON response
        res.status(200).json({message: "Congito->RDS Successfully Paired"});
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}