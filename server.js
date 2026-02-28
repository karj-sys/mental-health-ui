import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import 'dotenv/config'; // Loads your DB_HOST, DB_USER, etc. from .env

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Database Connection using Environment Variables
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mental_health_db'
});

db.connect(err => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Connected to MySQL Database using .env settings!');
    }
});

// 2. Home Route (Fixes the "Cannot GET /" error in browser)
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
            <h1>🚀 AI Advisor Backend is Running!</h1>
            <p>The API is listening for moods at <strong>/api/mood</strong></p>
            <p style="color: green;">✔ Database Connection: Active</p>
        </div>
    `);
});

// 3. Mood Submission Route (Matches your Vue MoodForm.vue)
app.post('/api/mood', (req, res) => {
    const { mood_text } = req.body; 
    
    // Logic for AI Response (For Lab 6 purposes)
    const ai_response = `AI Advisor: I see you are feeling ${mood_text}. Acknowledging your emotions is a great step toward mental clarity.`;

    // SQL Query to insert into your 'moods' table
    const sql = "INSERT INTO moods (mood_text, ai_response) VALUES (?, ?)";
    
    db.query(sql, [mood_text, ai_response], (err, result) => {
        if (err) {
            console.error("❌ SQL Error:", err);
            return res.status(500).json({ error: "Database insertion failed" });
        }
        
        console.log(`💾 Saved to DB: ${mood_text}`);
        
        // Return the response as 'message' to match your Vue component
        res.json({ message: ai_response });
    });
});

// 4. Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});