<template>
  <div class="mood-container">
    <h2>🧠 Mood Check-in</h2>
    <input v-model="name" placeholder="Your name" class="input-field" />
    <textarea v-model="mood" placeholder="How are you feeling today?" class="textarea-field"></textarea>
    <button @click="submitMood" :disabled="loading">
      {{ loading ? 'Analyzing...' : 'Submit' }}
    </button>
    
    <div v-if="aiMessage" class="response-box">
      <strong>AI Advisor:</strong>
      <p>{{ aiMessage }}</p>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return { name: '', mood: '', aiMessage: '', loading: false };
  },
  methods: {
    async submitMood() {
      if (!this.name || !this.mood) return alert("Please fill in both fields");
      
      this.loading = true;
      this.aiMessage = ""; 
      
      try {
        // We call '/mood', which combines with the baseURL to become:
        // http://localhost:3000/api/mood
        const res = await api.post('/mood', {
          mood_text: this.mood // Matches the variable in server.js
        });

        // The backend sends the response inside 'message'
        this.aiMessage = res.data.message;

      } catch (err) {
        console.error("Connection Error:", err);
        this.aiMessage = "AI Advisor: Server Error. Is 'node server.js' running?";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.mood-container { max-width: 400px; margin: 20px auto; font-family: sans-serif; }
.input-field, .textarea-field { width: 100%; margin-bottom: 10px; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.response-box { margin-top: 20px; padding: 15px; background: #eef2ff; border-left: 5px solid #4f46e5; border-radius: 4px; }
button { cursor: pointer; background: #4f46e5; color: white; border: none; padding: 10px 15px; border-radius: 4px; }
button:disabled { background: #9ca3af; }
</style>