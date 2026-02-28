import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'mental_health_db' // Ensure you ran CREATE DATABASE mental_health_db;
});

db.connect(err => {
    if (err) console.error('❌ Database connection failed:', err.message);
    else console.log('✅ Connected to MySQL Database!');
});

// 2. Home Route (Fixes "Cannot GET /")
app.get('/', (req, res) => {
    res.send('<h1>🚀 AI Advisor Backend is Running!</h1>');
});

// 3. The API Route
app.post('/api/mood', (req, res) => {
    const { mood_text } = req.body; 
    const ai_response = `AI Advisor: I hear you. It is brave to share that you feel ${mood_text}.`;

    const sql = "INSERT INTO moods (mood_text, ai_response) VALUES (?, ?)";
    
    db.query(sql, [mood_text, ai_response], (err, result) => {
        if (err) {
            console.error("❌ SQL Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        // We send back 'message' to match what the Vue form expects
        res.json({ message: ai_response });
    });
});

app.listen(3000, () => console.log('🚀 Server: http://localhost:3000'));