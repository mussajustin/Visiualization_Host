// Import the Express library for handling HTTP requests
const express = require('express');
// Import the MySQL library for interacting with MySQL databases
const mysql = require('mysql');
// Import the body-parser middleware to parse incoming request bodies in a middleware
const bodyParser = require('body-parser');
// Import the CORS (Cross-Origin Resource Sharing) library to allow or restrict requested resources on a web server
const cors = require('cors');

// Create an instance of Express to set up the server
const app = express();
// Use the CORS middleware to allow all cross-origin requests
app.use(cors());
// Use the body-parser middleware to parse JSON-formatted request bodies
app.use(bodyParser.json());

// Create a connection to the MySQL database using the provided credentials
const db = mysql.createConnection({
    host: 'localhost',      // Database host address
    user: 'root',           // Database username
    password: 'Kigali@2023',// Database password
    database: 'hellodb'     // Database name
});

// Connect to the MySQL database
db.connect(err => {
    if (err) {
        // Log and return an error message if the database connection fails
        console.error('Error connecting: ' + err.stack);
        return;
    }
    // Log a success message including the thread ID of the connection
    console.log('Connected to database as ID ' + db.threadId);
});

// Define a route to handle GET requests to the '/hello' endpoint
app.get('/hello', (req, res) => {
    // Perform a SQL query to select text from the 'hello' table where the user_id is 1
    db.query('SELECT text FROM hello WHERE user_id=1', (err, results) => {
        // Log the results of the query
        console.log(results);
        if (err) {
            // Log and send a 500 error response if a database error occurs
            console.error('Database error:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (results.length > 0) {
            // Send the retrieved text as a JSON response if results exist
            res.json({ text: results[0].text });
        } else {
            // Send a 404 error response if no results are found
            res.status(404).json({ error: 'No text found' });
        }
    });
});

// Define a route to handle GET requests to the '/chart-data' endpoint
app.get('/chart-data', (req, res) => {
    // Perform a SQL query to select name and value from the 'chart_data' table
    db.query('SELECT name, value FROM chart_data', (err, results) => {
        if (err) {
            // Log and send a 500 error response if a database error occurs
            console.error('Database error:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        // Send the results as a JSON response
        res.json(results);
    });
});

// Define a route to handle POST requests to the '/update' endpoint
app.post('/update', (req, res) => {
    // Extract text from the request body
    const { text } = req.body;
    // Perform a SQL query to update the text in the 'hello' table where the user_id is 1
    db.query('UPDATE hello SET text = ? WHERE user_id = 1', [text], (err, results) => {
        if (err) {
            // Log and send a 500 error response if a database error occurs
            console.error('Database error:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        // Send a success message as a JSON response
        res.json({ message: 'Text updated successfully' });
    });
});

// Define the port number as provided by the environment or default to 3001
const PORT = process.env.PORT || 3001;
// Start the server on the defined port
app.listen(PORT, () => {
    // Log that the server is running and on which port
    console.log(`Server running on port ${PORT}`);
});
