import express from "express";
import { getAIResponse } from "../services/aiService.js";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        u.full_name, 
        m.mood_text, 
        a.ai_message 
      FROM users u
      JOIN mood_entries m ON u.id = m.user_id
      JOIN ai_responses a ON m.id = a.mood_entry_id
      ORDER BY m.created_at DESC
    `;
    const [rows] = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching history" });
  }
});

router.post("/", async (req, res) => {
  const connection = await pool.getConnection(); 
  try {
    const { full_name, mood_text } = req.body;
    const ai_message = await getAIResponse(full_name, mood_text);

    await connection.beginTransaction();

    const [user] = await connection.query(
      "INSERT INTO users (full_name) VALUES (?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)", 
      [full_name]
    );
    const userId = user.insertId;

    const [mood] = await connection.query(
      "INSERT INTO mood_entries (user_id, mood_text) VALUES (?, ?)",
      [userId, mood_text]
    );
    const moodEntryId = mood.insertId;

  
    await connection.query(
      "INSERT INTO ai_responses (mood_entry_id, ai_message) VALUES (?, ?)",
      [moodEntryId, ai_message]
    );

    await connection.commit();
    res.json({ success: true, ai_message });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ success: false, message: "Transaction failed" });
  } finally {
    connection.release();
  }
});

export default router;