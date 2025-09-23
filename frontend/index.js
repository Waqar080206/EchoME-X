let currentStep = 0;
const totalSteps = 13;
const answers = {};

const API_BASE_URL = 'https://echome-x.onrender.com';

// Make functions available IMMEDIATELY (before any other code)
window.selectOption = function(button) {
    console.log('🎯 Option selected (emergency):', button.dataset.value);
    
    // Remove selected class from all buttons in current step
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (currentStepElement) {
        const allButtons = currentStepElement.querySelectorAll('.option-btn');
        allButtons.forEach(btn => btn.classList.remove('selected'));
    }
    
    // Add selected class to clicked button
    button.classList.add('selected');
    
    // Store the answer
    const questionKey = `question${currentStep}`;
    answers[questionKey] = button.dataset.value;
    
    console.log('📝 Saved answer:', questionKey, '=', button.dataset.value);
    
    // Auto-advance after short delay
    setTimeout(() => {
        if (typeof nextQuestion === 'function') {
            nextQuestion();
        } else {
            console.error('nextQuestion function not available');
        }
    }, 500);
};

window.previousQuestion = function() {
    console.log('⬅️ Previous question (emergency)');
    
    if (currentStep > 0) {
        // Hide current step
        const currentStepElement = document.getElementById(`step${currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.remove('active');
        }
        
        // Show previous step
        currentStep--;
        const prevStepElement = document.getElementById(`step${currentStep}`);
        if (prevStepElement) {
            prevStepElement.classList.add('active');
        }
        
        // Update progress
        if (typeof updateProgress === 'function') {
            updateProgress();
        }
        
        // Update back button
        if (typeof updateBackButton === 'function') {
            updateBackButton();
        }
        
        // Re-initialize name input if going back to step 0
        if (currentStep === 0) {
            setTimeout(() => {
                if (typeof initializeNameInputValidation === 'function') {
                    initializeNameInputValidation();
                }
            }, 100);
        }
        
        console.log('✅ Moved back to step:', currentStep);
    }
};

// Define updateProgress function FIRST (before it's used)
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill && progressText) {
        const progress = (currentStep / (totalSteps - 1)) * 100;
        progressFill.style.width = `${progress}%`;
        
        if (currentStep === 0) {
            progressText.textContent = 'Getting Started';
        } else if (currentStep === 12) {
            progressText.textContent = 'Almost Done!';
        } else {
            progressText.textContent = `Question ${currentStep} of 11`;
        }
    }
}

// Define updateBackButton function
function updateBackButton() {
    console.log('🔙 Updating back button for step:', currentStep);
    
    const stepButtons = document.querySelectorAll('.step-buttons');
    
    stepButtons.forEach(buttonContainer => {
        // Remove existing back button
        const existingBackBtn = buttonContainer.querySelector('.btn-back');
        if (existingBackBtn) {
            existingBackBtn.remove();
        }
        
        // Add back button if not on first step
        if (currentStep > 0) {
            const backButton = document.createElement('button');
            backButton.className = 'btn-back';
            backButton.textContent = 'Back';
            backButton.onclick = function() {
                console.log('Back button clicked');
                previousQuestion();
            };
            
            // Insert at the beginning of the container
            buttonContainer.insertBefore(backButton, buttonContainer.firstChild);
            console.log('✅ Back button added to step');
        }
    });
}

// Define resetQuiz function
function resetQuiz() {
    console.log('🔄 Resetting quiz');
    currentStep = 0;
    
    // Clear answers
    Object.keys(answers).forEach(key => delete answers[key]);
    
    // Reset all option buttons
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Reset checkboxes
    document.querySelectorAll('.social-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Show progress bar
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.style.display = 'block';
    }
}

// Define initializeNameInputValidation function
function initializeNameInputValidation() {
    console.log('🔧 Initializing name input validation');
    
    const nameInput = document.getElementById('twinName');
    const continueBtn = document.querySelector('.btn-continue, .continue-btn-modal, #continueButton');
    
    if (!nameInput || !continueBtn) {
        console.error('❌ Elements not found:', {
            nameInput: !!nameInput,
            continueBtn: !!continueBtn
        });
        return;
    }
    
    // Clear existing value and set initial state
    nameInput.value = '';
    continueBtn.disabled = true;
    
    // Remove existing listeners to avoid duplicates
    nameInput.removeEventListener('input', handleNameInput);
    nameInput.removeEventListener('keydown', handleNameKeydown);
    
    // Add new listeners
    nameInput.addEventListener('input', handleNameInput);
    nameInput.addEventListener('keydown', handleNameKeydown);
    
    // Focus the input
    nameInput.focus();
    
    console.log('✅ Name input validation initialized successfully');
}

function handleNameInput(event) {
    const value = event.target.value.trim();
    const hasName = value.length > 0;
    const continueBtn = document.querySelector('.btn-continue, .continue-btn-modal, #continueButton');
    
    console.log('📝 Name input changed:', `"${value}"`, 'Valid:', hasName);
    
    if (continueBtn) {
        continueBtn.disabled = !hasName;
        
        if (hasName) {
            continueBtn.style.opacity = '1';
            continueBtn.style.cursor = 'pointer';
        } else {
            continueBtn.style.opacity = '0.5';
            continueBtn.style.cursor = 'not-allowed';
        }
    }
}

function handleNameKeydown(event) {
    if (event.key === 'Enter') {
        const continueBtn = document.querySelector('.btn-continue, .continue-btn-modal, #continueButton');
        if (continueBtn && !continueBtn.disabled) {
            console.log('⏎ Enter key pressed - continuing');
            event.preventDefault();
            nextQuestion();
        }
    }
}

// NOW define openTwinWizard (after all dependencies are defined)
function openTwinWizard() {
    console.log('🚀 Opening twin wizard');
    
    const modal = document.getElementById('twinModal');
    if (!modal) {
        console.error('❌ Modal not found');
        return;
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('modal-open');
    
    // Reset quiz state
    resetQuiz();
    
    // Show first step
    document.querySelectorAll('.quiz-step').forEach(step => {
        step.classList.remove('active');
    });
    
    const firstStep = document.getElementById('step0');
    if (firstStep) {
        firstStep.classList.add('active');
        console.log('✅ First step activated');
    }
    
    // Update progress (now this function exists)
    updateProgress();
    updateBackButton();
    
    // Initialize name input validation
    setTimeout(() => {
        initializeNameInputValidation();
    }, 100);
}

// Define nextQuestion function
function nextQuestion() {
    console.log('➡️ Next question from step:', currentStep);
    
    // Handle name input on step 0
    if (currentStep === 0) {
        const nameInput = document.getElementById('twinName');
        const name = nameInput ? nameInput.value.trim() : '';
        
        console.log('📝 Processing name:', `"${name}"`);
        
        if (!name || name.length < 2) {
            alert('Please enter a valid name (at least 2 characters)');
            if (nameInput) {
                nameInput.focus();
                nameInput.style.borderColor = '#ef4444';
                setTimeout(() => {
                    nameInput.style.borderColor = '';
                }, 3000);
            }
            return;
        }
        
        answers.name = name;
        console.log('✅ Name saved:', name);
    }
    
    if (currentStep < totalSteps - 1) {
        // Hide current step with animation
        const currentStepElement = document.getElementById(`step${currentStep}`);
        if (currentStepElement) {
            currentStepElement.classList.remove('active');
            currentStepElement.style.opacity = '0';
            setTimeout(() => {
                currentStepElement.style.opacity = '';
            }, 300);
        }
        
        // Show next step
        currentStep++;
        const nextStepElement = document.getElementById(`step${currentStep}`);
        if (nextStepElement) {
            nextStepElement.classList.add('active');
        }
        
        updateProgress();
        updateBackButton();
        
        // Restore any selected options for this step
        restoreSelectedOption();
        
        console.log('✅ Advanced to step:', currentStep);
    }
}

// Define remaining functions...
function previousQuestion() {
    console.log('⬅️ Previous question from step:', currentStep);
    
    if (currentStep > 0) {
        // Hide current step
        document.getElementById(`step${currentStep}`).classList.remove('active');
        
        // Show previous step
        currentStep--;
        document.getElementById(`step${currentStep}`).classList.add('active');
        
        updateProgress();
        updateBackButton();
        restoreSelectedOption();
        
        // Re-initialize name input if going back to step 0
        if (currentStep === 0) {
            setTimeout(() => {
                initializeNameInputValidation();
            }, 100);
        }
        
        console.log('✅ Moved back to step:', currentStep);
    }
}

function restoreSelectedOption() {
    const questionKey = `question${currentStep}`;
    const savedAnswer = answers[questionKey];
    
    if (savedAnswer) {
        const currentStepElement = document.getElementById(`step${currentStep}`);
        const selectedButton = currentStepElement.querySelector(`[data-value="${savedAnswer}"]`);
        if (selectedButton) {
            selectedButton.classList.add('selected');
        }
    }
}

function selectOption(button) {
    console.log('🎯 Option selected:', button.dataset.value);
    
    if (!button || !button.dataset.value) {
        console.error('❌ Invalid button or missing data-value');
        return;
    }
    
    // Remove selected class from all buttons in this step
    const currentStepElement = document.getElementById(`step${currentStep}`);
    if (currentStepElement) {
        const allButtons = currentStepElement.querySelectorAll('.option-btn');
        allButtons.forEach(btn => btn.classList.remove('selected'));
        console.log('🧹 Cleared previous selections');
    }
    
    // Add selected class to clicked button
    button.classList.add('selected');
    
    // Store the answer
    const questionKey = `question${currentStep}`;
    answers[questionKey] = button.dataset.value;
    
    console.log('📝 Saved answer:', questionKey, '=', button.dataset.value);
    console.log('📊 Current answers:', answers);
    
    // Auto-advance after short delay
    setTimeout(() => {
        nextQuestion();
    }, 500);
}

<<<<<<< HEAD
// Update these functions around line 270-290
function skipSocialMedia() {
    console.log('📝 Skipping social media permissions');
    answers.socialMediaPermissions = 'skipped';
    
    // Proceed to create twin
    console.log('🚀 Starting twin creation after skip...');
    createTwin();
}

// Add this function and call it before createTwin
function debugAnswers() {
    console.log('🔍 DEBUG ANSWERS:');
    console.log('- answers exists:', !!answers);
    console.log('- answers type:', typeof answers);
    console.log('- answers keys:', Object.keys(answers || {}));
    console.log('- answers content:', answers);
    console.log('- name exists:', !!answers?.name);
    console.log('- name value:', answers?.name);
    
    // Check individual question answers
    for (let i = 1; i <= 11; i++) {
        console.log(`- q${i}:`, answers[`q${i}`]);
    }
}

// Call this in acceptPermissions function
function acceptPermissions() {
    console.log('📝 Accepting social media permissions');
    
    // Debug first
    debugAnswers();
    
    // Then proceed
    createTwin();
=======
function closeTwinWizard() {
    console.log('🔒 Closing twin wizard');
    const modal = document.getElementById('twinModal');
    if (modal) {
        modal.classList.remove('active');
    }
    document.body.style.overflow = '';
    document.body.classList.remove('modal-open');
    resetQuiz();
}

// Add remaining functions (skipSocialMedia, acceptPermissions, etc.)...
function skipSocialMedia() {
    console.log('⏭️ Skipping social media permissions');
    answers.socialMedia = {};
    finishQuiz();
}

function acceptPermissions() {
    console.log('✅ Accepting social media permissions');
    
    const permissions = {};
    document.querySelectorAll('.social-checkbox').forEach(checkbox => {
        permissions[checkbox.id] = checkbox.checked;
    });
    
    answers.socialMedia = permissions;
    finishQuiz();
}

function finishQuiz() {
    console.log('🏁 Finishing quiz with answers:', answers);
    
    // Hide current step
    document.getElementById(`step${currentStep}`).classList.remove('active');
    
    // Show loading step
    showLoadingStep();
    
    // Collect and send data
    const twinData = collectQuizData();
    createTwin(twinData);
>>>>>>> 70ef16e50b6f6b28cbe68c48f92fa1bd37a4b721
}

function showLoadingStep() {
    // Hide all steps
    document.querySelectorAll('.quiz-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show loading step
    let loadingStep = document.getElementById('loadingStep');
    if (loadingStep) {
        loadingStep.classList.add('active');
        
        // Animate loading bar
        const loadingBar = document.getElementById('loadingBar');
        if (loadingBar) {
            loadingBar.style.width = '0%';
            setTimeout(() => {
                loadingBar.style.width = '90%';
            }, 500);
        }
    }
}

function collectQuizData() {
    const data = {
        name: answers.name,
        personality: {
            gender: answers.question1,
            communication: answers.question2,
            social: answers.question3,
            planning: answers.question4,
            stress: answers.question5,
            learning: answers.question6,
            energy: answers.question7,
            decisions: answers.question8,
            emotions: answers.question9,
            change: answers.question10,
            outlook: answers.question11
        },
        socialMedia: answers.socialMedia || {}
    };
    
    console.log('📊 Collected twin data:', data);
    return data;
}
<<<<<<< HEAD
// Update the createTwin function
async function createTwin() {
    try {
        console.log('🚀 CreateTwin function called');
        console.log('📊 Current answers:', answers);
        
        // Build personality data
        const personalityData = buildPersonalityData(answers);
        console.log('📝 Built personality data:', personalityData);
        
        // Check if personalityData is valid
        if (!personalityData) {
            throw new Error('Failed to build personality data from answers');
        }
=======

async function createTwin(twinData) {
    try {
        console.log('🚀 Creating twin with data:', twinData);
>>>>>>> 70ef16e50b6f6b28cbe68c48f92fa1bd37a4b721
        
        // Show loading step
        showLoadingStep();
        
        // Debug the API URL
        const API_BASE_URL = 'http://localhost:3001'; // Hardcode for testing
        const fullURL = `${API_BASE_URL}/api/create-personality-twin`;
        
        console.log('🌐 Making API call to:', fullURL);
        console.log('📦 Sending data:', JSON.stringify(personalityData, null, 2));
        
        // Test if fetch is available
        console.log('🔍 Fetch available:', typeof fetch !== 'undefined');
        
        const response = await fetch(fullURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(personalityData)
        });

<<<<<<< HEAD
        console.log('📡 Response received:', response);
        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);

        // ... rest of your function
        
    } catch (error) {
        console.error('❌ Error in createTwin:', error);
        console.error('❌ Error stack:', error.stack);
    }
}

// Replace the showTwinCreationSuccess function around line 450
function showTwinCreationSuccess(result) {
    console.log('🎉 Twin creation successful:', result);
    
    // Ensure we have the proper MongoDB ID
    if (!result.twinId) {
        console.error('❌ No twinId received from backend:', result);
        alert('Twin created but no ID received. Please try again.');
        return;
    }
    
    console.log('📝 Backend returned twinId:', result.twinId);
    console.log('📝 TwinId type:', typeof result.twinId);
    console.log('📝 TwinId length:', result.twinId.length);
    
    // Validate that it looks like a MongoDB ObjectId (24 hex characters)
    const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
    if (!mongoIdPattern.test(result.twinId)) {
        console.error('❌ Invalid MongoDB ObjectId format:', result.twinId);
        alert('Invalid twin ID format received. Please try again.');
        return;
    }
    
    console.log('✅ Valid MongoDB ObjectId received');
    
    // Store the twin data with the proper MongoDB ID
    const twinData = {
        id: result.twinId, // MongoDB ObjectId as string
        _id: result.twinId, // Also store as _id for compatibility
        name: answers.name || result.twin?.name || 'Your Twin',
        status: 'active',
        personality: result.twin?.personality || answers,
        hasPersonality: true,
        created: new Date().toISOString()
    };
    
    console.log('💾 Storing twin data:', twinData);
    
    // Store current twin data
    localStorage.setItem('currentTwin', JSON.stringify(twinData));
    localStorage.setItem('twinId', twinData.id);
    localStorage.setItem('twinName', twinData.name);
    localStorage.setItem('personalityProfile', JSON.stringify(twinData.personality));
    
    // Add to twins list for sidebar
    addTwinToList(twinData);
    
    console.log('✅ Twin data stored successfully with MongoDB ID:', twinData.id);
    
    // Show final success
    showFinalSuccess(result);
}

// Update the showFinalSuccess function to use the backend-generated ID
function showFinalSuccess(result) {
    // Hide loading step
    const loadingStep = document.getElementById('loadingStep');
    if (loadingStep) {
        loadingStep.classList.remove('active');
    }
    
    // Find the quiz container
    let quizContainer = document.querySelector('.quiz-container') || 
                       document.querySelector('.modal-content') || 
                       document.querySelector('#twinModal .modal-content');
    
    if (!quizContainer) {
        // Fallback: redirect to chat
        alert('Twin created successfully! Redirecting to chat...');
        setTimeout(() => {
            window.location.href = 'chat.html';
        }, 1000);
        return;
    }
    
    // Create or update success step
=======
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Twin creation successful:', result);
        
        if (result.success) {
            // Complete loading animation
            const loadingBar = document.getElementById('loadingBar');
            if (loadingBar) {
                loadingBar.style.width = '100%';
            }
            
            // Show success after delay
            setTimeout(() => {
                showFinalSuccess(result);
            }, 1500);
        } else {
            throw new Error(result.error || 'Twin creation failed');
        }
        
        return result;
        
    } catch (error) {
        console.error('❌ Error creating twin:', error);
        
        // Hide loading step
        const loadingStep = document.getElementById('loadingStep');
        if (loadingStep) {
            loadingStep.classList.remove('active');
        }
        
        alert(`Error creating your twin: ${error.message}\n\nPlease try again.`);
        
        // Go back to permissions step
        currentStep = 12;
        document.getElementById('step12').classList.add('active');
    }
}

function showFinalSuccess(result) {
    console.log('🎉 Showing success:', result);
    
    // Hide all steps
    document.querySelectorAll('.quiz-step').forEach(step => {
        step.classList.remove('active');
        step.style.display = 'none';
    });
    
    // Hide progress bar
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }
    
    // Create success step
>>>>>>> 70ef16e50b6f6b28cbe68c48f92fa1bd37a4b721
    let successStep = document.getElementById('successStep');
    if (!successStep) {
        successStep = document.createElement('div');
        successStep.className = 'quiz-step';
        successStep.id = 'successStep';
<<<<<<< HEAD
        quizContainer.appendChild(successStep);
    }
    
    // Simple success content - just congratulations and start button
    const twinName = result.twin?.name || answers.name || 'Your Twin';
    
    successStep.innerHTML = `
        <div class="question-container">
            <div class="success-icon">🎉</div>
            <h2 class="question-title">Congratulations!</h2>
            <p class="success-message">${twinName} has been created successfully!</p>
            
            <div class="action-buttons">
                <button onclick="goToChat()" class="btn-primary">Start Chatting</button>
            </div>
=======
        document.querySelector('.modal-content').appendChild(successStep);
    }
    
    const twinName = result.twin?.name || result.name || answers.name || 'Your Twin';
    
    successStep.innerHTML = `
        <div style="text-align: center; padding: 3rem 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1.5rem;">🎉</div>
            <h2 style="color: #8B5CF6; margin-bottom: 1rem; font-size: 2rem;">
                Congratulations!
            </h2>
            <p style="font-size: 1.2rem; margin-bottom: 2.5rem; color: #6B7280;">
                <strong>${twinName}</strong> has been created successfully!<br>
                Your AI twin is ready to chat with you.
            </p>
            
            <button onclick="goToChat()" style="
                background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
                color: white;
                padding: 15px 30px;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                font-size: 1.1rem;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 10px;
            ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                Start Chatting
            </button>
>>>>>>> 70ef16e50b6f6b28cbe68c48f92fa1bd37a4b721
        </div>
    `;
    
    successStep.style.display = 'block';
    successStep.classList.add('active');
    
<<<<<<< HEAD
    // Hide progress bar
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }
    
    // Store the twin data using the backend-generated ID
    const twinData = {
        id: result.twinId || result.data?.id, // Use backend-generated MongoDB ID
        name: answers.name || result.twin?.name || 'Your Twin',
        status: 'active',
        personality: result.twin?.personality || {},
        created: new Date().toISOString()
    };
    
    // Store current twin and add to twins list
    localStorage.setItem('currentTwin', JSON.stringify(twinData));
    localStorage.setItem('twinId', twinData.id); // This should be the MongoDB ID
    localStorage.setItem('twinName', twinData.name);
    localStorage.setItem('personalityProfile', JSON.stringify(twinData.personality));
    
    // Add to twins list for sidebar
    addTwinToList(twinData);
    
    console.log('✅ Twin data stored with backend ID:', twinData);
}

// Add function to manage twins list
function addTwinToList(twinData) {
    let twins = [];
    try {
        const existingTwins = localStorage.getItem('userTwins');
        if (existingTwins) {
            twins = JSON.parse(existingTwins);
        }
    } catch (error) {
        console.error('Error parsing existing twins:', error);
        twins = [];
    }
    
    // Check if twin already exists (avoid duplicates)
    const existingIndex = twins.findIndex(twin => twin.id === twinData.id);
    if (existingIndex > -1) {
        // Update existing twin
        twins[existingIndex] = twinData;
    } else {
        // Add new twin
        twins.push(twinData);
    }
    
    // Store updated twins list
    localStorage.setItem('userTwins', JSON.stringify(twins));
    
    console.log('Twin added to list. Total twins:', twins.length);
}

// Update the animateLoading function to be more realistic
function animateLoading() {
    const loadingBar = document.getElementById('loadingBar');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 10 + 5; // Faster progress
        if (progress > 100) progress = 100;
        
        loadingBar.style.width = `${progress}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
        }
    }, 150);
=======
    // Store twin data
    const twinData = {
        id: result.twinId || result.twin?._id,
        _id: result.twinId || result.twin?._id,
        name: twinName,
        hasPersonality: true,
        personality: result.twin?.personality || result.personality
    };
    
    localStorage.setItem('currentTwin', JSON.stringify(twinData));
    localStorage.setItem('twinId', twinData.id);
    localStorage.setItem('twinName', twinData.name);
>>>>>>> 70ef16e50b6f6b28cbe68c48f92fa1bd37a4b721
}

function goToChat() {
<<<<<<< HEAD
    window.location.href = 'chat.html';
}

function goToAnalytics() {
    window.location.href = 'analytics.html';
}

function createNewTwin() {
    // Reset the quiz
    currentStep = 0;
    answers = {};
    
    // Hide success step
    const successStep = document.getElementById('successStep');
    if (successStep) {
        successStep.classList.remove('active');
    }
    
    // Show first step
    showQuestion(0);
    
    // Show progress bar again
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.style.display = 'block';
    }
}

// Update the buildPersonalityData function around line 620
function buildPersonalityData(answers) {
    console.log('🔧 Building personality data from answers:', answers);
    
    // Validate we have answers
    if (!answers || typeof answers !== 'object') {
        console.error('❌ No answers provided to buildPersonalityData');
        return null;
    }
    
    // Validate name exists
    if (!answers.name || typeof answers.name !== 'string') {
        console.error('❌ Name is missing or invalid:', answers.name);
        return null;
    }
    
    // Build traits from quiz answers
    const traits = {};
    
    // Map quiz answers to Big Five traits
    try {
        // Extraversion (social energy)
        traits.extraversion = parseFloat(answers.q2) || 0.5; // Social situations question
        
        // Openness (creativity/curiosity)
        traits.openness = parseFloat(answers.q3) || 0.5; // New experiences question
        
        // Conscientiousness (organization)
        traits.conscientiousness = parseFloat(answers.q4) || 0.5; // Planning question
        
        // Agreeableness (cooperation)
        traits.agreeableness = parseFloat(answers.q5) || 0.5; // Helping others question
        
        // Neuroticism (emotional stability)
        traits.neuroticism = parseFloat(answers.q6) || 0.5; // Stress handling question
        
        // Additional traits from other questions
        traits.optimism = parseFloat(answers.q7) || 0.5;
        traits.thinking_style = answers.q8 || 'balanced';
        traits.decision_style = answers.q9 || 'balanced';
        traits.planning_style = answers.q10 || 'balanced';
        
    } catch (error) {
        console.error('❌ Error parsing traits:', error);
        // Use default values
        traits.extraversion = 0.5;
        traits.openness = 0.5;
        traits.conscientiousness = 0.5;
        traits.agreeableness = 0.5;
        traits.neuroticism = 0.5;
        traits.optimism = 0.5;
        traits.thinking_style = 'balanced';
        traits.decision_style = 'balanced';
        traits.planning_style = 'balanced';
    }
    
    console.log('📊 Built traits:', traits);

    // Build comprehensive personality profile
    const personalityProfile = {
        name: answers.name.trim(),
        gender: answers.gender || 'not-specified',
        bigFiveTraits: {
            extraversion: traits.extraversion,
            openness: traits.openness,
            conscientiousness: traits.conscientiousness,
            agreeableness: traits.agreeableness,
            neuroticism: traits.neuroticism
        },
        communicationStyle: {
            formality: traits.conscientiousness > 0.5 ? 'formal' : 'casual',
            expressiveness: traits.extraversion > 0.5 ? 'expressive' : 'reserved',
            supportiveness: traits.agreeableness > 0.5 ? 'supportive' : 'direct',
            optimism: traits.optimism
        },
        cognitiveStyle: {
            thinking_preference: traits.thinking_style,
            decision_making: traits.decision_style,
            planning_approach: traits.planning_style,
            creativity_level: traits.openness
        },
        socialMediaPermissions: answers.socialMediaPermissions || 'skipped',
        createdAt: new Date().toISOString(),
        responses: answers // Include all raw answers for debugging
    };

    console.log('✅ Built personality profile:', personalityProfile);
    return personalityProfile;
}

// Add the missing showLoadingStep function
function showLoadingStep() {
    console.log('⏳ Showing loading step');
    
    // Hide all other steps
    document.querySelectorAll('.quiz-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show loading step
    const loadingStep = document.getElementById('loadingStep');
    if (loadingStep) {
        loadingStep.classList.add('active');
        console.log('✅ Loading step is now active');
        
        // Reset and animate the loading bar
        const loadingBar = document.getElementById('loadingBar');
        if (loadingBar) {
            loadingBar.style.width = '0%';
            setTimeout(() => {
                loadingBar.style.width = '90%';
            }, 500);
        }
    } else {
        console.error('❌ Loading step element not found');
    }
    
    // Hide progress bar
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }
}

// Add the debugging function
function debugStep12Buttons() {
    console.log('🔍 Debugging Step 12 buttons...');
    
    const skipBtn = document.querySelector('.btn-skip');
    const acceptBtn = document.querySelector('.btn-accept');
    
    console.log('Skip button found:', !!skipBtn);
    console.log('Accept button found:', !!acceptBtn);
    
    if (skipBtn) {
        console.log('Skip button onclick:', skipBtn.getAttribute('onclick'));
    }
    
    if (acceptBtn) {
        console.log('Accept button onclick:', acceptBtn.getAttribute('onclick'));
    }
    
    // Test if functions exist
    console.log('skipSocialMedia function exists:', typeof skipSocialMedia);
    console.log('acceptPermissions function exists:', typeof acceptPermissions);
    console.log('createTwin function exists:', typeof createTwin);
}
=======
    console.log('🚀 Navigating to chat...');
    
    const storedTwin = localStorage.getItem('currentTwin');
    const storedTwinId = localStorage.getItem('twinId');
    
    if (!storedTwin || !storedTwinId) {
        alert('Error: Twin data not found. Please try creating your twin again.');
        return;
    }
    
    closeTwinWizard();
    setTimeout(() => {
        window.location.href = 'chat.html';
    }, 300);
}

// Make all functions globally available
window.openTwinWizard = openTwinWizard;
window.closeTwinWizard = closeTwinWizard;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.selectOption = selectOption;
window.skipSocialMedia = skipSocialMedia;
window.acceptPermissions = acceptPermissions;
window.goToChat = goToChat;
window.updateProgress = updateProgress;
window.initializeNameInputValidation = initializeNameInputValidation;
>>>>>>> 70ef16e50b6f6b28cbe68c48f92fa1bd37a4b721

console.log('✅ index.js loaded completely - all functions available');

// Debug CSS loading
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔍 CSS Debug - Checking loaded stylesheets:');
    
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach((sheet, index) => {
        console.log(`${index + 1}. ${sheet.href}`);
        
        // Check if CSS loaded successfully
        if (sheet.sheet) {
            console.log(`   ✅ Loaded: ${sheet.sheet.cssRules?.length || 0} rules`);
        } else {
            console.error(`   ❌ Failed to load: ${sheet.href}`);
        }
    });
    
<<<<<<< HEAD
    // Also call updateBackButton whenever the modal opens
    const originalOpenTwinWizard = openTwinWizard;
    openTwinWizard = function() {
        originalOpenTwinWizard();
        setTimeout(updateBackButton, 100); // Small delay to ensure DOM is ready
    };

    console.log('🚀 Index page loaded');
    
    // Add debugging
    debugStep12Buttons();
    
    // Backup event listeners for step 12 buttons
    setTimeout(() => {
        const skipBtn = document.querySelector('.btn-skip');
        const acceptBtn = document.querySelector('.btn-accept');
        
        if (skipBtn && !skipBtn.hasAttribute('data-listener-added')) {
            skipBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🖱️ Skip button clicked via event listener');
                skipSocialMedia();
            });
            skipBtn.setAttribute('data-listener-added', 'true');
        }
        
        if (acceptBtn && !acceptBtn.hasAttribute('data-listener-added')) {
            acceptBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('🖱️ Accept button clicked via event listener');
                acceptPermissions();
            });
            acceptBtn.setAttribute('data-listener-added', 'true');
        }
    }, 100);
    
    // ... rest of your existing DOMContentLoaded code ...
=======
    // Test modal styles
    const modal = document.getElementById('twinModal');
    if (modal) {
        const styles = window.getComputedStyle(modal);
        console.log('Modal styles:', {
            display: styles.display,
            position: styles.position,
            zIndex: styles.zIndex,
            background: styles.backgroundColor
        });
    }
>>>>>>> 70ef16e50b6f6b28cbe68c48f92fa1bd37a4b721
});