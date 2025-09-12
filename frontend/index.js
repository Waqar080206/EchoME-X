let currentStep = 0;
const totalSteps = 13;
const answers = {};

const API_BASE_URL = 'https://echome-x.onrender.com';

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
    
    // Update progress
    updateProgress();
    updateBackButton();
    
    // Focus on name input after a short delay
    setTimeout(() => {
        const nameInput = document.getElementById('twinName');
        if (nameInput) {
            nameInput.focus();
        }
    }, 300);
}

function closeTwinWizard() {
    console.log('🔒 Closing twin wizard');
    const modal = document.getElementById('twinModal');
    if (modal) {
        modal.classList.remove('active');
    }
    document.body.style.overflow = '';
    resetQuiz();
}

function resetQuiz() {
    console.log('🔄 Resetting quiz');
    currentStep = 0;
    
    // Clear answers
    Object.keys(answers).forEach(key => delete answers[key]);
    
    // Reset form inputs
    const nameInput = document.getElementById('twinName');
    if (nameInput) {
        nameInput.value = '';
    }
    
    const continueBtn = document.querySelector('.btn-continue');
    if (continueBtn) {
        continueBtn.disabled = true;
    }
    
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

function updateBackButton() {
    const stepButtons = document.querySelectorAll('.step-buttons');
    
    stepButtons.forEach(buttonContainer => {
        const existingBackBtn = buttonContainer.querySelector('.btn-back');
        if (existingBackBtn) {
            existingBackBtn.remove();
        }
        
        if (currentStep > 0) {
            const backButton = document.createElement('button');
            backButton.className = 'btn-back';
            backButton.textContent = 'Back';
            backButton.onclick = previousQuestion;
            
            buttonContainer.insertBefore(backButton, buttonContainer.firstChild);
        }
    });
}

function nextQuestion() {
    console.log('➡️ Next question from step:', currentStep);
    
    if (currentStep === 0) {
        const nameInput = document.getElementById('twinName');
        const name = nameInput.value.trim();
        
        if (!name) {
            alert('Please enter your name');
            return;
        }
        
        answers.name = name;
        console.log('📝 Saved name:', name);
    }
    
    if (currentStep < totalSteps - 1) {
        // Hide current step
        document.getElementById(`step${currentStep}`).classList.remove('active');
        
        // Show next step
        currentStep++;
        document.getElementById(`step${currentStep}`).classList.add('active');
        
        updateProgress();
        updateBackButton();
        
        console.log('✅ Moved to step:', currentStep);
    }
}

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
        
        console.log('✅ Moved back to step:', currentStep);
    }
}

function selectOption(button) {
    console.log('🎯 Option selected:', button.dataset.value);
    
    // Remove selected class from all buttons in this step
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const allButtons = currentStepElement.querySelectorAll('.option-btn');
    allButtons.forEach(btn => btn.classList.remove('selected'));
    
    // Add selected class to clicked button
    button.classList.add('selected');
    
    // Store the answer
    const questionKey = `question${currentStep}`;
    answers[questionKey] = button.dataset.value;
    
    console.log('📝 Saved answer:', questionKey, '=', button.dataset.value);
    
    // Auto-advance after short delay
    setTimeout(() => {
        nextQuestion();
    }, 500);
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
}

function showLoadingStep() {
    // Hide all steps
    document.querySelectorAll('.quiz-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show or create loading step
    let loadingStep = document.getElementById('loadingStep');
    if (!loadingStep) {
        loadingStep = document.createElement('div');
        loadingStep.className = 'quiz-step';
        loadingStep.id = 'loadingStep';
        loadingStep.innerHTML = `
            <div class="question-container" style="text-align: center;">
                <div class="loading-animation">
                    <div class="loading-spinner"></div>
                </div>
                <h2 class="question-title">Creating Your AI Twin</h2>
                <p class="question-subtitle">This may take a few moments...</p>
                <div class="loading-progress">
                    <div class="loading-bar" id="loadingBar"></div>
                </div>
            </div>
        `;
        document.querySelector('.modal-content').appendChild(loadingStep);
    }
    
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

async function createTwin(twinData) {
    try {
        console.log('🚀 Creating twin with data:', twinData);
        
        const response = await fetch(`${API_BASE_URL}/api/create-personality-twin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(twinData)
        });

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
    let successStep = document.getElementById('successStep');
    if (!successStep) {
        successStep = document.createElement('div');
        successStep.className = 'quiz-step';
        successStep.id = 'successStep';
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
        </div>
    `;
    
    successStep.style.display = 'block';
    successStep.classList.add('active');
    
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
}

function goToChat() {
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

// Make functions available globally immediately
window.openTwinWizard = openTwinWizard;
window.closeTwinWizard = closeTwinWizard;
window.nextQuestion = nextQuestion;
window.previousQuestion = previousQuestion;
window.selectOption = selectOption;
window.skipSocialMedia = skipSocialMedia;
window.acceptPermissions = acceptPermissions;
window.goToChat = goToChat;

console.log('✅ index.js loaded, functions available globally');

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
});