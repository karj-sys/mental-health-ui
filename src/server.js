import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2";
import moodRoutes from "./moods.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Database Connection (Required for your moodRoutes to function)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) console.error('❌ Database connection failed:', err.message);
    else console.log('✅ Connected to MySQL Database!');
});

// 2. Home Route (Prevents "Cannot GET /" on Render)
app.get('/', (req, res) => {
    res.send('<h1>🚀 AI Advisor API is Live</h1><p>Endpoint: /api/moods</p>');
});

// 3. Use your imported routes
// Note: This matches your frontend request to /api/moods
app.use("/api/moods", moodRoutes);

// 4. Start Server
// Render requires '0.0.0.0' and process.env.PORT to bind correctly
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});