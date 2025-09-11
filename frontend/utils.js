// Shared utilities for EchoMe X frontend
// This file contains common functions used across multiple pages

// API Configuration - Updated for production
const API_BASE_URL = 'https://echome-x.onrender.com'; // Replace with your actual Render URL

console.log('🔗 API Base URL:', API_BASE_URL);

// Error handling utilities
class APIError extends Error {
    constructor(message, code, status) {
        super(message);
        this.name = 'APIError';
        this.code = code;
        this.status = status;
    }
}

// Generic API call function with error handling
async function makeAPICall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options
    };

    try {
        const response = await fetch(url, defaultOptions);
        const result = await response.json();

        if (!response.ok) {
            throw new APIError(
                result.error?.message || `HTTP error! status: ${response.status}`,
                result.error?.code || 'HTTP_ERROR',
                response.status
            );
        }

        return result;
    } catch (error) {
        if (error instanceof APIError) {
            throw error;
        }

        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new APIError(
                'Network connection failed. Please check your internet connection.',
                'NETWORK_ERROR',
                0
            );
        }

        // Handle JSON parsing errors
        if (error.name === 'SyntaxError') {
            throw new APIError(
                'Invalid response from server.',
                'PARSE_ERROR',
                0
            );
        }

        // Re-throw other errors
        throw error;
    }
}

// Send message API call
async function sendMessage(message) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// User data management
function getUserData() {
    const twinData = localStorage.getItem('twinData');
    if (!twinData) {
        return null;
    }

    try {
        return JSON.parse(twinData);
    } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('twinData');
        return null;
    }
}

function setUserData(data) {
    try {
        localStorage.setItem('twinData', JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Failed to save user data:', error);
        return false;
    }
}

function clearUserData() {
    localStorage.removeItem('twinData');
}

// Validation utilities
function validateUserId(userId) {
    return userId && typeof userId === 'string' && userId.trim().length > 0;
}

function validateMessage(message) {
    return message && typeof message === 'string' && message.trim().length > 0;
}

// UI utilities
function showNotification(message, type = 'info', duration = 5000) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease-out;
    `;

    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    notification.textContent = message;

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 1rem;
        padding: 0;
        line-height: 1;
    `;
    closeButton.onclick = () => notification.remove();
    notification.appendChild(closeButton);

    // Add to page
    document.body.appendChild(notification);

    // Auto-remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);
    }

    return notification;
}

// Add CSS animation for notifications
if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Mobile navigation helper
function initializeMobileNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });

        // Close menu when pressing Escape
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                navToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Escape HTML utility
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Twin creation utilities
async function createTwin(twinData) {
    try {
        console.log('🚀 Creating personality twin with data:', twinData);
        
        // If twinData is undefined, collect it
        if (!twinData) {
            twinData = collectQuizData();
            console.log('📊 Collected quiz data:', twinData);
        }
        
        // Show loading state
        showLoadingStep();
        
        const response = await fetch(`${API_BASE_URL}/api/create-personality-twin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(twinData)
        });

        console.log('🌐 Create twin response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Server error:', errorText);
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Twin creation successful:', result);
        
        if (result.success) {
            // Complete the loading animation
            const loadingBar = document.getElementById('loadingBar');
            if (loadingBar) {
                loadingBar.style.width = '100%';
            }
            
            // Show success after a brief delay
            setTimeout(() => {
                showFinalSuccess(result);
            }, 1500);
        } else {
            throw new Error(result.error || 'Twin creation failed');
        }
        
        return result;
        
    } catch (error) {
        console.error('❌ Error creating personality twin:', error);
        
        // Hide loading step
        const loadingStep = document.getElementById('loadingStep');
        if (loadingStep) {
            loadingStep.classList.remove('active');
        }
        
        // Show error message
        alert(`Error creating your twin: ${error.message}\n\nPlease try again.`);
        
        // Go back to the quiz
        currentStep = 11; // Go back to last question
        showCurrentStep();
    }
}

function showLoadingStep() {
    // Hide all other steps
    document.querySelectorAll('.quiz-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show loading step
    const loadingStep = document.getElementById('loadingStep');
    if (loadingStep) {
        loadingStep.classList.add('active');
        
        // Animate the loading bar
        const loadingBar = document.getElementById('loadingBar');
        if (loadingBar) {
            loadingBar.style.width = '0%';
            setTimeout(() => {
                loadingBar.style.width = '90%';
            }, 500);
        }
    }
}

// Export functions for use in other files
window.EchoMeUtils = {
    API_BASE_URL,
    APIError,
    makeAPICall,
    sendMessage,
    getUserData,
    setUserData,
    clearUserData,
    validateUserId,
    validateMessage,
    showNotification,
    initializeMobileNavigation,
    createTwin
};