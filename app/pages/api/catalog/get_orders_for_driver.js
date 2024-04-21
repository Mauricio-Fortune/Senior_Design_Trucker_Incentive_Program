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
    
        const user_ID = req.query.user_ID;
        
        // Query to retrieve sorted order IDs
        const [sortedRows] = await connection.query('SELECT order_ID FROM Orders WHERE user_ID = ? AND is_cart = ? ORDER BY order_ID DESC', [user_ID, 0]);
    
        // Check if rows array is empty
        if (sortedRows.length === 0) {
            // Close the database connection
            await connection.end();
            // Send NULL response as there are no orders
            return res.status(200).json(null);
        }
    
        const orderIDs = sortedRows.map(row => row.order_ID);
    
        const placeholders = orderIDs.map(() => '?').join(',');
        
        // Query to fetch associated items using sorted order IDs
        const [rows2] = await connection.query(
            `SELECT order_ID, item_Name, item_Quantity FROM Order_Item WHERE order_ID IN (${placeholders})`,
            orderIDs
        );
        
        // Sort the rows in descending order based on order_ID
        // Sort the rows in descending order based on order_ID
rows2.sort((a, b) => b.order_ID - a.order_ID);

await connection.end();

// Initialize the orders object to store items grouped by order ID
const orders = {};

// Iterate over each row of sorted data
rows2.forEach(row => {
    // Destructure the row to extract order ID, item name, and item quantity
    const { order_ID, item_Name, item_Quantity } = row;
    
    // Check if the order ID already exists in the orders object
    if (!orders[order_ID]) {
        // If the order ID doesn't exist, initialize it with an empty array
        orders[order_ID] = [];
    }
    
    // Push the item (item name and quantity) into the array associated with the order ID
    orders[order_ID].push({ itemName: item_Name, itemQuantity: item_Quantity });
});
    
        // Send the data as JSON response
        console.log(orders);
        res.status(200).json(orders);
    } catch (error) {
        console.error('Database connection or query failed', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}
