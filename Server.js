const express = require('express'); 
const cors = require('cors'); 
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const { Pool } = require('pg'); 
require('dotenv').config(); 
const app = express(); 
app.use(cors()); 
app.use(express.json()); 
const pool = new Pool({ 
user: process.env.DB_USER, 
host: process.env.DB_HOST, 
database: process.env.DB_NAME, 
password: process.env.DB_PASS, 
port: process.env.DB_PORT, 
}); 
const authenticate = async (req, res, next) => { 
const token = req.headers.authorization?.split(' ')[1]; 
if (!token) return res.status(401).json({ message: 'Unauthorized' }); 
try { 
req.user = jwt.verify(token, process.env.JWT_SECRET); 
next(); 
} catch (err) { 
res.status(403).json({ message: 'Invalid token' }); 
} 
}; 
// Database Schema 
const createTables = async () => { 
await pool.query(` 
CREATE TABLE IF NOT EXISTS users ( 
id SERIAL PRIMARY KEY, 
name VARCHAR(60) NOT NULL, 
      email VARCHAR(100) UNIQUE NOT NULL, 
      password TEXT NOT NULL, 
      address VARCHAR(400) NOT NULL, 
      role VARCHAR(20) DEFAULT 'user' 
    ); 
    CREATE TABLE IF NOT EXISTS stores ( 
      id SERIAL PRIMARY KEY, 
      name VARCHAR(100) NOT NULL, 
      address VARCHAR(400) NOT NULL 
    ); 
    CREATE TABLE IF NOT EXISTS ratings ( 
      id SERIAL PRIMARY KEY, 
      store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE, 
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, 
      rating INTEGER CHECK (rating >= 1 AND rating <= 5) 
    ); 
  `); 
}; 
createTables(); 
 
// User Registration 
app.post('/register', async (req, res) => { 
  const { name, email, password, address, role } = req.body; 
  const hashedPassword = await bcrypt.hash(password, 10); 
  await pool.query('INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, 
$5)', [name, email, hashedPassword, address, role || 'user']); 
res.json({ message: 'User registered' }); 
}); 
// User Login 
app.post('/login', async (req, res) => { 
const { email, password } = req.body; 
const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]); 
if (user.rows.length === 0 || !(await bcrypt.compare(password, user.rows[0].password))) { 
return res.status(401).json({ message: 'Invalid credentials' }); 
} 
const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role }, process.env.JWT_SECRET); 
res.json({ token }); 
}); 
// Fetch Stores 
app.get('/stores', async (req, res) => { 
const stores = await pool.query('SELECT * FROM stores'); 
res.json(stores.rows); 
}); 
// Submit Rating 
app.post('/stores/:id/rate', authenticate, async (req, res) => { 
const { rating } = req.body; 
const storeId = req.params.id; 
await pool.query('INSERT INTO ratings (store_id, user_id, rating) VALUES ($1, $2, $3)', [storeId, 
req.user.id, rating]); 
res.json({ message: 'Rating submitted' }); 
}); 
// Fetch Dashboard Stats 
app.get('/dashboard/stats', authenticate, async (req, res) => { 
if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' }); 
const usersCount = await pool.query('SELECT COUNT(*) FROM users'); 
const storesCount = await pool.query('SELECT COUNT(*) FROM stores'); 
const ratingsCount = await pool.query('SELECT COUNT(*) FROM ratings'); 
res.json({ users: usersCount.rows[0].count, stores: storesCount.rows[0].count, ratings: 
ratingsCount.rows[0].count }); 
}); 
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
// Deployment Guide: 
// 1. Backend Deployment: 
//    - Use a cloud provider like AWS, DigitalOcean, or render.com. 
//    - Deploy the Node.js backend using Docker or directly on a server. 
//    - Set up PostgreSQL/MySQL database and configure environment variables. 
// 2. Frontend Deployment: 
//    - Build the React project using `npm run build`. 
//    - Deploy on Vercel, Netlify, or Firebase Hosting. 
//    - Ensure backend API URL is correctly set in `.env`. 
// 3. Domain & Security: 
//    - Use HTTPS with an SSL certificate. 
//    - Set up a custom domain if needed. 
//    - Secure API endpoints with authentication and role-based authorization. 
// 4. Monitoring & Maintenance: 
//    - Implement logging and error handling. 
//    - Set up server monitoring (e.g., New Relic, Prometheus). 
//    - Regularly update dependencies and security patches.