const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const port = 4004;// Test DB connection 
app.use(express.json());
app.use(cors());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'omgamganapathayenamaha',
  database: 'zomato'
});
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL Database!");
  connection.release();
});

// Middleware to parse JSON and enable CORS
 

// MySQL connection pool
 

// API endpoint: Get paginated list of restaurants
app.get('/api/restaurants', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;  // e.g., 8 cards per page
  const offset = (page - 1) * limit;

  // First, count total items for pagination
  db.query('SELECT COUNT(*) AS count FROM restaurants', (err, countResult) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const totalItems = countResult[0].count;
    const query = 'SELECT * FROM restaurants LIMIT ? OFFSET ?';
    
    db.query(query, [limit, offset], (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      
      res.json({
        totalItems,
        currentPage: page,
        restaurants: results
      });
    });
  });
});
// Route to get restaurant details
app.get('/api/restaurant/:id', (req, res) => {
  const restaurantId = req.params.id;
  db.query('SELECT * FROM restaurants WHERE Restaurant_id = ?', [restaurantId], (err, result) => {
      if (err) {
          res.status(500).json({ error: 'Database error' });
      } else if (result.length === 0) {
          res.status(404).json({ error: 'Restaurant not found' });
      } else {
          res.json(result[0]);
      }
  });
});

// Route to get events for a specific restaurant
app.get('/api/restaurant/:id/events', (req, res) => {
  const restaurantId = req.params.id;
  db.query('SELECT * FROM events WHERE Restaurant_id = ?', [restaurantId], (err, results) => {
      if (err) {
          res.status(500).json({ error: 'Database error' });
      } else {
          res.json(results);
      }
  });
});
 
// Restaurant search API (supports both Name & Location search)
app.get('/api/restaurants/search', (req, res) => {
  const { name, longitude, latitude, radius = 10 } = req.query;
  
  let query = `SELECT *, 
      (6371 * ACOS(
        COS(RADIANS(?)) * COS(RADIANS(Latitude)) * COS(RADIANS(Longitude) - RADIANS(?)) + 
        SIN(RADIANS(?)) * SIN(RADIANS(Latitude))
      )) AS distance 
      FROM restaurants WHERE 1=1`;

  let values = [latitude || 0, longitude || 0, latitude || 0]; // Defaults for missing location

  // If searching by name
  if (name) {
    query += ' AND Restaurant_name LIKE ?';
    values.push(`%${name}%`);
  }

  // If searching by location
  if (longitude && latitude) {
    query += ' HAVING distance <= ?';
    values.push(Number(radius));
  }

  query += ' ORDER BY distance LIMIT 20'; // Limit results

  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error fetching restaurants:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("Sorry, can't find that!");
});

// Start server
const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
