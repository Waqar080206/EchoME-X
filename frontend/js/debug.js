// Add this for debugging
function testAPIConnection() {
    const API_BASE_URL = 'https://echome-x.onrender.com';
    
    fetch(`${API_BASE_URL}/health`)
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

// Call this function in browser console to test
// testAPIConnection();