class EchoMeAPI {
  constructor() {
    this.baseURL = window.location.origin + '/api';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      console.log('API Response:', data);
      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Test connection
  async testConnection() {
    return this.request('/health');
  }

  // Create Twin
  async createTwin(name, persona) {
    return this.request('/train', {
      method: 'POST',
      body: JSON.stringify({ name, persona })
    });
  }

  // Send Chat Message
  async sendMessage(message, twinName) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, twinName })
    });
  }

  // Get Analytics
  async getAnalytics() {
    return this.request('/analytics');
  }

  // Get Twin Info
  async getTwinInfo() {
    return this.request('/twin');
  }

  // Create Personality Twin
  async createPersonalityTwin(personalityData) {
    return this.request('/create-personality-twin', {
      method: 'POST',
      body: JSON.stringify(personalityData)
    });
  }

  // Send Personality Chat Message
  async sendPersonalityMessage(message, twinId) {
    return this.request('/chat-personality', {
      method: 'POST',
      body: JSON.stringify({ message, twinId })
    });
  }

  // Test AI Service
  async testAI(message = 'Hello') {
    return this.request('/test-ai', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }

  // Get Debug Info
  async getDebugInfo() {
    return this.request('/debug-twins');
  }
}

// Global API instance
window.echoAPI = new EchoMeAPI();

// Test connection on page load
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const health = await window.echoAPI.testConnection();
    console.log('✅ Backend connection successful:', health);
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
  }
});