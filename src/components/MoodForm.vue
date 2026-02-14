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
      // 1. Client-side validation
      if (!this.name || !this.mood) return alert("Please fill in both fields");
      
      this.loading = true;
      this.aiMessage = ""; // Clear previous messages
      
      try {
        // 2. The API Call
        // NOTE: We use '/' because the 'api/moods' part is already in your api.js baseURL
        const res = await api.post('/', {
          full_name: this.name,
          mood_text: this.mood
        });

        // 3. Match the response key from your backend (ai_message or ai_response)
        this.aiMessage = res.data.ai_message || res.data.ai_response;

      } catch (err) {
        console.error("Connection Error:", err);
        
        // Detailed error logging to help you debug
        if (err.response) {
          // Server responded with a status code outside the 2xx range
          this.aiMessage = `Server Error: ${err.response.status} - ${err.response.data.message || 'Check backend logs'}`;
        } else if (err.request) {
          // Request was made but no response was received
          this.aiMessage = "Error: Could not reach the AI Advisor. Is the backend running on port 3000?";
        } else {
          this.aiMessage = "An unexpected error occurred.";
        }
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