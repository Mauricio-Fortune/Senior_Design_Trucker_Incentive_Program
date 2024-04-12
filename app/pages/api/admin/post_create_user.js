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



    const {user_ID, user_Type, email, first_Name,last_Name, is_active} = req.body;

    try {
        // Create a connection to the database
        const connection = await mysql.createConnection(dbConfig);

        const sql_query = (`INSERT INTO User (user_ID,user_Type, email, first_name, last_name, is_active) VALUES (?, ?, ?, ?, ?, ?)`);
        console.log(user_ID);
        console.log(user_Type);
        console.log(email);
        console.log(first_Name);
        console.log(last_Name);
        console.log(is_active);

        const [results] = await connection.execute(sql_query, [user_ID,user_Type, email, first_Name,last_Name, is_active]);

        // Close the database connection
        await connection.end();

        if (results.affectedRows > 0) {
            res.status(200).json({ message: "User added successfully" });
        } else {
            res.status(404).json({ message: "User could not be added" });
        }
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}