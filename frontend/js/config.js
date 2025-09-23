// Global API Configuration for EchoMe X
window.API_CONFIG = (() => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port;
    
    console.log('🔧 API Config - Environment Detection:', { 
        hostname, 
        protocol, 
        port,
        userAgent: navigator.userAgent.includes('Live Server') ? 'Live Server' : 'Other'
    });
    
    // Determine if we're in local development
    const isLocal = hostname === 'localhost' || 
                   hostname === '127.0.0.1' || 
                   hostname.includes('localhost') ||
                   port === '5500' || // Live Server default port
                   port === '3000' || // Common React dev port
                   port === '5173' || // Vite dev server port
                   port === '8080';   // Common dev port
    
    const baseURL = isLocal 
        ? 'http://localhost:3001'
        : 'https://echome-x.onrender.com'; // Replace with your actual Render URL
    
    console.log(`🎯 API Config: ${isLocal ? 'LOCAL' : 'PRODUCTION'} mode - ${baseURL}`);
    
    return {
        BASE_URL: baseURL,
        IS_LOCAL: isLocal,
        ENDPOINTS: {
            CREATE_TWIN: '/api/create-personality-twin',
            CHAT: '/api/chat-with-personality',
            DEBUG_TWINS: '/api/debug-twins',
            GET_FIRST_TWIN: '/api/get-first-twin',
            HEALTH: '/health'
        },
        
        // Helper method to get full endpoint URL
        getEndpoint: function(endpoint) {
            return this.BASE_URL + this.ENDPOINTS[endpoint];
        }
    };
})();

// Log the configuration
console.log('✅ API Configuration loaded:', window.API_CONFIG);