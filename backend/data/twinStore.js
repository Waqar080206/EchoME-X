// Create this new file: backend/data/twinStore.js

class TwinStore {
  constructor() {
    this.twins = new Map(); // Use Map for better performance
    this.initialized = false;
    this.init();
  }

  init() {
    if (!this.initialized) {
      console.log('🔧 Initializing TwinStore');
      this.initialized = true;
    }
  }

  addTwin(twin) {
    this.twins.set(twin._id, twin);
    console.log(`📝 Twin stored: ${twin.name} (ID: ${twin._id})`);
    console.log(`📊 Total twins in store: ${this.twins.size}`);
    return twin;
  }

  findTwinById(id) {
    const twin = this.twins.get(id);
    console.log(`🔍 Looking for twin ID: ${id}`);
    console.log(`✅ Found twin: ${!!twin}`);
    if (!twin) {
      console.log(`📋 Available twin IDs: [${Array.from(this.twins.keys()).join(', ')}]`);
    }
    return twin;
  }

  getAllTwins() {
    return Array.from(this.twins.values());
  }

  getTwinCount() {
    return this.twins.size;
  }

  updateTwin(id, updates) {
    const twin = this.twins.get(id);
    if (twin) {
      Object.assign(twin, updates);
      this.twins.set(id, twin);
    }
    return twin;
  }

  deleteTwin(id) {
    return this.twins.delete(id);
  }

  clear() {
    this.twins.clear();
    console.log('🗑️ TwinStore cleared');
  }

  // Debug info
  getDebugInfo() {
    const twins = this.getAllTwins();
    return {
      totalTwins: twins.length,
      twins: twins.map(t => ({
        id: t._id,
        name: t.name,
        hasPersonality: !!t.personalityProfile,
        hasPersona: !!t.persona,
        conversationCount: t.conversationHistory ? t.conversationHistory.length : 0,
        createdAt: t.createdAt
      })),
      storeInitialized: this.initialized
    };
  }
}

// Create singleton instance
const twinStore = new TwinStore();

module.exports = twinStore;