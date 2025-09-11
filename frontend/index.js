let currentStep = 0;
const totalSteps = 13; // 1 name + 1 gender + 10 questions + 1 permissions
const answers = {};

function openTwinWizard() {
    document.getElementById('twinModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    updateProgress();
}

function closeTwinWizard() {
    document.getElementById('twinModal').classList.remove('active');
    document.body.style.overflow = '';
    resetQuiz();
}

function resetQuiz() {
    currentStep = 0;
    Object.keys(answers).forEach(key => delete answers[key]);
    
    // Reset all steps
    document.querySelectorAll('.quiz-step').forEach(step => {
        step.classList.remove('active', 'slide-out-left', 'slide-in-right', 'slide-out-right', 'slide-in-left');
    });
    document.getElementById('step0').classList.add('active');
    
    // Reset form inputs
    document.getElementById('twinName').value = '';
    document.querySelector('.btn-continue').disabled = true;
    
    // Reset all option buttons
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Reset checkboxes
    document.querySelectorAll('.social-checkbox').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    updateProgress();
    updateBackButton();
}

function updateProgress() {
    const progress = (currentStep / (totalSteps - 2)) * 100; // Exclude loading step and permissions
    document.getElementById('progressFill').style.width = `${progress}%`;
    
    if (currentStep === 0) {
        document.getElementById('progressText').textContent = 'Getting Started';
    } else if (currentStep === 1) {
        document.getElementById('progressText').textContent = 'Basic Information';
    } else if (currentStep <= 11) {
        document.getElementById('progressText').textContent = `Question ${currentStep - 1} of 10`;
    } else if (currentStep === 12) {
        document.getElementById('progressText').textContent = 'Permissions';
    }
}

// Replace the existing updateBackButton function

function updateBackButton() {
    console.log('Updating back button for step:', currentStep);
    
    // Remove existing back buttons (except permissions back button)
    const existingBackButtons = document.querySelectorAll('.btn-back:not(.permissions-back-btn)');
    existingBackButtons.forEach(btn => btn.remove());
    
    // Handle permissions step back button
    const permissionsBackBtn = document.getElementById('permissionsBackBtn');
    if (permissionsBackBtn) {
        if (currentStep === 12) {
            permissionsBackBtn.style.display = 'flex';
            console.log('Showing permissions back button');
        } else {
            permissionsBackBtn.style.display = 'none';
        }
    }
    
    // Add back button starting from step 2 (Gender question = step 1, first personality question = step 2)
    // Show back button for steps 2-11 (personality questions) and step 1 (gender)
    if (currentStep >= 1 && currentStep <= 11) {
        const currentStepEl = document.getElementById(`step${currentStep}`);
        const stepButtons = currentStepEl?.querySelector('.step-buttons');
        
        if (stepButtons && !stepButtons.querySelector('.btn-back')) {
            console.log('Adding back button to step:', currentStep);
            
            const backButton = document.createElement('button');
            backButton.className = 'btn-back';
            backButton.onclick = previousQuestion;
            backButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 12H5m7-7l-7 7 7 7"/>
                </svg>
                Back
            `;
            stepButtons.insertBefore(backButton, stepButtons.firstChild);
        }
    }
    
    // Ensure modal content is scrolled to top when changing steps
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.scrollTop = 0;
    }
}

// Add this temporary debug function to test back button creation

function debugBackButton() {
    console.log('=== DEBUG BACK BUTTON ===');
    console.log('Current step:', currentStep);
    console.log('Should show back button:', currentStep >= 1 && currentStep <= 11);
    
    const currentStepEl = document.getElementById(`step${currentStep}`);
    console.log('Current step element:', currentStepEl);
    
    if (currentStepEl) {
        const stepButtons = currentStepEl.querySelector('.step-buttons');
        console.log('Step buttons container:', stepButtons);
        
        if (stepButtons) {
            const existingBackBtn = stepButtons.querySelector('.btn-back');
            console.log('Existing back button:', existingBackBtn);
        }
    }
    console.log('=========================');
}

// Replace the existing nextQuestion function

function nextQuestion() {
    console.log('Next question called, current step:', currentStep);
    
    if (currentStep === 0) {
        // Validate name input
        const name = document.getElementById('twinName').value.trim();
        if (!name) {
            console.log('No name provided');
            return;
        }
        answers.name = name;
        console.log('Name saved:', name);
    }
    
    if (currentStep < totalSteps - 1) {
        // Slide out current step
        const currentStepEl = document.getElementById(`step${currentStep}`);
        console.log('Current step element:', currentStepEl);
        
        if (currentStepEl) {
            currentStepEl.classList.add('slide-out-left');
            
            setTimeout(() => {
                currentStepEl.classList.remove('active', 'slide-out-left');
                currentStep++;
                console.log('Moving to step:', currentStep);
                
                // Slide in next step
                const nextStepEl = document.getElementById(`step${currentStep}`);
                console.log('Next step element:', nextStepEl);
                
                if (nextStepEl) {
                    nextStepEl.classList.add('active', 'slide-in-right');
                    
                    setTimeout(() => {
                        nextStepEl.classList.remove('slide-in-right');
                    }, 300);
                }
                
                updateProgress();
                updateBackButton();
                restoreSelectedOption();
                debugBackButton();
            }, 300);
        }
    }
}

// Replace the existing previousQuestion function

function previousQuestion() {
    if (currentStep > 0) {
        console.log('Going back from step:', currentStep);
        
        // Slide out current step to the right
        const currentStepEl = document.getElementById(`step${currentStep}`);
        currentStepEl.classList.add('slide-out-right');
        
        setTimeout(() => {
            currentStepEl.classList.remove('active', 'slide-out-right');
            currentStep--;
            console.log('Now on step:', currentStep);
            
            // Slide in previous step from the left
            const prevStepEl = document.getElementById(`step${currentStep}`);
            prevStepEl.classList.add('active', 'slide-in-left');
            
            setTimeout(() => {
                prevStepEl.classList.remove('slide-in-left');
            }, 300);
            
            updateProgress();
            updateBackButton();
            restoreSelectedOption();
            
            // For name step (step 0), restore continue button state
            if (currentStep === 0) {
                const nameInput = document.getElementById('twinName');
                const continueBtn = document.querySelector('.btn-continue');
                if (nameInput && continueBtn) {
                    const hasName = nameInput.value.trim().length > 0;
                    continueBtn.disabled = !hasName;
                }
            }
        }, 300);
    }
}

function restoreSelectedOption() {
    // Restore previously selected option when going back
    const currentStepEl = document.getElementById(`step${currentStep}`);
    
    if (currentStep === 1) {
        // Gender question
        if (answers.gender) {
            const genderOption = currentStepEl.querySelector(`[data-value="${answers.gender}"]`);
            if (genderOption) {
                genderOption.classList.add('selected');
            }
        }
    } else if (currentStep >= 2 && currentStep <= 11) {
        // Personality questions
        const questionKey = `q${currentStep - 1}`;
        if (answers[questionKey]) {
            const selectedOption = currentStepEl.querySelector(`[data-value="${answers[questionKey]}"]`);
            if (selectedOption) {
                selectedOption.classList.add('selected');
            }
        }
    } else if (currentStep === 12) {
        // Social media permissions
        if (answers.socialMediaPermissions && typeof answers.socialMediaPermissions === 'object') {
            Object.keys(answers.socialMediaPermissions).forEach(platform => {
                const checkbox = document.getElementById(`${platform}Permission`);
                if (checkbox) {
                    checkbox.checked = answers.socialMediaPermissions[platform];
                }
            });
        }
    }
}

function selectOption(button) {
    const step = button.closest('.quiz-step');
    const questionNumber = step.id.replace('step', '');
    
    // Remove selection from other options in this step
    step.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Select this option
    button.classList.add('selected');
    
    // Store answer
    if (questionNumber === '1') {
        answers.gender = button.dataset.value;
    } else {
        answers[`q${questionNumber - 1}`] = button.dataset.value;
    }
    
    // Auto-advance after a brief delay
    setTimeout(() => {
        if (currentStep === 11) {
            // Last personality question - go to permissions
            nextQuestion();
        } else {
            nextQuestion();
        }
    }, 800);
}

function skipSocialMedia() {
    answers.socialMediaPermissions = 'skipped';
    createTwin();
}

function acceptPermissions() {
    // Collect all quiz data
    const twinData = collectQuizData();
    
    // Create the twin with the collected data
    createTwin(twinData);
}

// Function to collect quiz data - FIXED VERSION
function collectQuizData() {
    console.log('Collecting quiz data from answers object:', answers);
    
    // Use the global answers object that's populated during the quiz
    const personalityData = buildPersonalityData(answers);
    
    console.log('Built personality data:', personalityData);
    
    return personalityData;
}

// Replace the existing createTwin function
async function createTwin(twinData) {
    try {
        console.log('Creating personality twin with data:', twinData);
        
        // If twinData is undefined, collect it
        if (!twinData) {
            twinData = collectQuizData();
            console.log('Collected quiz data:', twinData);
        }
        
        const response = await fetch(`${API_BASE_URL}/api/create-personality-twin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(twinData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Twin creation successful:', result);
        
        // Store the twin data
        localStorage.setItem('currentTwin', JSON.stringify(result.twin));
        
        // Show success and redirect
        showTwinCreationSuccess(result);
        
        return result;
        
    } catch (error) {
        console.error('❌ Error creating personality twin:', error);
        throw error;
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
    let successStep = document.getElementById('successStep');
    if (!successStep) {
        successStep = document.createElement('div');
        successStep.className = 'quiz-step';
        successStep.id = 'successStep';
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
        </div>
    `;
    
    // Show success step
    successStep.classList.add('active');
    
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
}

// Navigation functions
function goToChat() {
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

// Update the buildPersonalityData function around line 476
function buildPersonalityData(answers) {
    console.log('Building personality data from answers:', answers);
    
    // Validate we have required data
    if (!answers.name) {
        console.error('Missing name in answers');
        return null;
    }
    
    // Map quiz answers to personality traits
    const traits = {
        extraversion: answers.q1 === 'extraverted' ? 0.8 : 0.2,
        openness: answers.q2 === 'open' ? 0.8 : 0.2,
        conscientiousness: answers.q3 === 'organized' ? 0.8 : 0.2,
        agreeableness: answers.q4 === 'agreeable' ? 0.8 : 0.2,
        neuroticism: answers.q5 === 'sensitive' ? 0.8 : 0.2,
        optimism: answers.q6 === 'optimistic' ? 0.8 : 0.2,
        thinking_style: answers.q7 === 'practical' ? 'practical' : 'creative',
        decision_style: answers.q8 === 'emotional' ? 'emotional' : 'logical',
        planning_style: answers.q9 === 'decisive' ? 'decisive' : 'flexible',
        worldview: answers.q10 === 'positive' ? 'optimistic' : 'realistic'
    };

    // Build comprehensive personality profile with the quiz name
    const personalityProfile = {
        name: answers.name, // This is the name from the first question
        gender: answers.gender,
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
        responses: answers // Include all raw answers
    };

    return personalityProfile;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Name input validation
    const nameInput = document.getElementById('twinName');
    const continueBtn = document.querySelector('.btn-continue');
    
    if (nameInput && continueBtn) {
        nameInput.addEventListener('input', function() {
            const hasName = this.value.trim().length > 0;
            continueBtn.disabled = !hasName;
        });

        // Enter key support for name input
        nameInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !continueBtn.disabled) {
                nextQuestion();
            }
        });
    }

    // Close modal on outside click
    const twinModal = document.getElementById('twinModal');
    if (twinModal) {
        twinModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeTwinWizard();
            }
        });
    }

    // Prevent modal close on content click
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Initialize back button visibility
    updateBackButton();
    
    // Also call updateBackButton whenever the modal opens
    const originalOpenTwinWizard = openTwinWizard;
    openTwinWizard = function() {
        originalOpenTwinWizard();
        setTimeout(updateBackButton, 100); // Small delay to ensure DOM is ready
    };
});