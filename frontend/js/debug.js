// Add this for debugging
function testAPIConnection() {
    // Fallback API URL if config is not loaded
    const FALLBACK_API_URL = 'https://echome-x.onrender.com';
    
    const getAPIBaseURL = () => {
        return window.API_CONFIG?.BASE_URL || FALLBACK_API_URL;
    };
    
    fetch(`${getAPIBaseURL()}/health`)
        .then(response => {
            console.log('API Health Check Status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('API Health Check Response:', data);
        })
        .catch(error => {
            console.error('API Connection Failed:', error);
        });
}

// Add this for debugging your deployment
function debugTwinCreation() {
    // Fallback API URL if config is not loaded
    const FALLBACK_API_URL = 'https://echome-x.onrender.com';
    
    const getAPIBaseURL = () => {
        return window.API_CONFIG?.BASE_URL || FALLBACK_API_URL;
    };
    
    console.log('🔍 Debug: Twin Creation Status');
    console.log('- Current Step:', currentStep);
    console.log('- Answers:', answers);
    console.log('- API Base URL:', getAPIBaseURL());
    
    // Test API connection
    fetch(`${getAPIBaseURL()}/health`)
        .then(response => {
            console.log('✅ API Health Check:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('📊 Health Data:', data);
        })
        .catch(error => {
            console.error('❌ API Health Check Failed:', error);
        });
}

function debugChatConnection() {
    console.log('🔍 Debug: Chat Connection Status');
    console.log('- Current Twin:', currentTwin);
    console.log('- Stored Twin ID:', localStorage.getItem('twinId'));
    console.log('- Stored Twin Name:', localStorage.getItem('twinName'));
    console.log('- API Base URL:', API_BASE_URL);
}

// Make functions available in console
window.debugTwinCreation = debugTwinCreation;
window.debugChatConnection = debugChatConnection;

// Call this function in browser console to test
// testAPIConnection();