// Landing page functionality for EchoMe X
// This file handles the twin creation form and navigation

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the landing page
    initializeLandingPage();
});

function initializeLandingPage() {
    // Mobile navigation toggle
    EchoMeUtils.initializeMobileNavigation();
    
    // Form functionality
    initializeForm();
    
    console.log('Landing page initialized');
}

function initializeForm() {
    const form = document.getElementById('createTwinForm');
    
    // Add null check
    if (!form) {
        console.log('⚠️ Twin creation form not found on this page');
        return;
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('📝 Form submitted via landing.js');
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        
        // Build persona from multiple fields if they exist
        let persona = '';
        const traits = formData.get('traits') || '';
        const communicationStyle = formData.get('communicationStyle') || '';
        const background = formData.get('background') || '';
        
        // Combine all persona elements
        if (traits || communicationStyle || background) {
            persona = `Personality Traits: ${traits}. Communication Style: ${communicationStyle}. Background: ${background}`;
        } else {
            // Fallback to a single persona field
            persona = formData.get('persona') || '';
        }
        
        console.log('📝 Form data:', { name, persona: persona.substring(0, 100) + '...' });
        
        if (!name || !persona || persona.length < 50) {
            alert('Please fill out all fields. Persona description must be at least 50 characters.');
            return;
        }
        
        try {
            // Use the same API as index.html
            const result = await window.echoAPI.createTwin(name, persona);
            console.log('✅ Twin created via landing.js:', result);
            
            if (result.success) {
                alert('Twin created successfully! Redirecting to chat...');
                window.location.href = 'chat.html';
            } else {
                throw new Error(result.error || 'Failed to create twin');
            }
        } catch (error) {
            console.error('❌ Error creating twin:', error);
            alert('Error: ' + error.message);
        }
    });
}

function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const errorDiv = document.getElementById(`${fieldName}-error`);
    const value = field.value.trim();
    
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (!value) {
        isValid = false;
        errorMessage = 'This field is required.';
    } else {
        // Specific field validations
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long.';
                } else if (value.length > 100) {
                    isValid = false;
                    errorMessage = 'Name must be less than 100 characters.';
                } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Name can only contain letters, spaces, hyphens, and apostrophes.';
                }
                break;
                
            case 'traits':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Please provide at least 10 characters describing your personality.';
                } else if (value.length > 500) {
                    isValid = false;
                    errorMessage = 'Personality traits description is too long (max 500 characters).';
                }
                break;
                
            case 'communicationStyle':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Please provide at least 10 characters describing your communication style.';
                } else if (value.length > 500) {
                    isValid = false;
                    errorMessage = 'Communication style description is too long (max 500 characters).';
                }
                break;
                
            case 'background':
                if (value.length < 20) {
                    isValid = false;
                    errorMessage = 'Please provide at least 20 characters about your background and interests.';
                } else if (value.length > 1000) {
                    isValid = false;
                    errorMessage = 'Background description is too long (max 1000 characters).';
                }
                break;
        }
    }
    
    // Update field styling and error message
    if (isValid) {
        field.style.borderColor = '#10b981';
        errorDiv.textContent = '';
    } else {
        field.style.borderColor = '#ef4444';
        errorDiv.textContent = errorMessage;
    }
    
    return isValid;
}

function addCharacterCount(field, maxLength) {
    const container = field.parentNode;
    const countDiv = document.createElement('div');
    countDiv.className = 'character-count';
    countDiv.style.cssText = 'font-size: 0.8rem; color: #64748b; text-align: right; margin-top: 4px;';
    
    function updateCount() {
        const remaining = maxLength - field.value.length;
        countDiv.textContent = `${field.value.length}/${maxLength}`;
        
        if (remaining < 50) {
            countDiv.style.color = '#ef4444';
        } else if (remaining < 100) {
            countDiv.style.color = '#f59e0b';
        } else {
            countDiv.style.color = '#64748b';
        }
    }
    
    field.addEventListener('input', updateCount);
    container.appendChild(countDiv);
    updateCount();
}

function validateForm() {
    const fields = ['name', 'traits', 'communicationStyle', 'background'];
    let isFormValid = true;
    
    fields.forEach(fieldName => {
        if (!validateField(fieldName)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

async function handleFormSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = document.getElementById('submitBtn');
    const loadingDiv = document.getElementById('loading');
    const messageDiv = document.getElementById('message');
    
    // Validate form
    if (!validateForm()) {
        showMessage('Please fix the errors above before submitting.', 'error');
        return;
    }
    
    // Prepare form data for API
    const formData = {
        name: document.getElementById('name').value.trim(),
        persona: {
            traits: document.getElementById('traits').value.trim().split(',').map(t => t.trim()).filter(t => t),
            communicationStyle: document.getElementById('communicationStyle').value.trim(),
            background: document.getElementById('background').value.trim(),
            interests: [] // Can be expanded later
        }
    };
    
    // Show loading state
    setLoadingState(true);
    hideMessage();
    
    try {
        // Call the actual backend API
        const response = await callTrainAPI(formData);
        
        if (response.success) {
            // Success - store user data and redirect to chat page
            showMessage('Digital Twin initialized successfully! Entering neural interface...', 'success');
            EchoMeUtils.showNotification('Neural synthesis complete! Redirecting...', 'success');
            
            // Store user data with userId from backend
            const userData = {
                ...formData,
                userId: response.userId
            };
            
            if (!EchoMeUtils.setUserData(userData)) {
                showMessage('Warning: Failed to save user data locally.', 'warning');
            }
            
            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = 'chat.html';
            }, 2000);
        } else {
            throw new Error(response.error?.message || 'Failed to create twin');
        }
        
    } catch (error) {
        console.error('Error creating twin:', error);
        
        // Handle different types of errors using the utility
        let errorMessage = 'Neural synthesis failed. Please try again.';
        
        if (error instanceof EchoMeUtils.APIError) {
            switch (error.code) {
                case 'NETWORK_ERROR':
                    errorMessage = 'Connection failed. Please check your network and try again.';
                    break;
                case 'VALIDATION_ERROR':
                    errorMessage = 'Invalid data provided. Please check your inputs.';
                    break;
                default:
                    errorMessage = error.message;
            }
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showMessage(errorMessage, 'error');
        EchoMeUtils.showNotification(errorMessage, 'error');
        setLoadingState(false);
    }
}

async function callTrainAPI(data) {
    return await EchoMeUtils.makeAPICall('/api/train', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

function setLoadingState(isLoading) {
    const submitBtn = document.getElementById('submitBtn');
    const loadingDiv = document.getElementById('loading');
    const form = document.getElementById('twinForm');
    
    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'SYNTHESIZING...';
        loadingDiv.classList.remove('hidden');
        form.style.opacity = '0.6';
    } else {
        submitBtn.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Initialize Digital Twin';
        loadingDiv.classList.add('hidden');
        form.style.opacity = '1';
    }
}

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.remove('hidden');
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            hideMessage();
        }, 5000);
    }
}

function hideMessage() {
    const messageDiv = document.getElementById('message');
    messageDiv.classList.add('hidden');
}

// Navigation helper functions
function navigateToChat() {
    window.location.href = 'chat.html';
}

function navigateToAnalytics() {
    window.location.href = 'analytics.html';
}