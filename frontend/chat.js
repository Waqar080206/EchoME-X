// Chat page functionality for EchoMe X Neural Interface
// This file handles the chat interface and mobile navigation

document.addEventListener('DOMContentLoaded', async function() {
    let currentTwin = null;
    
    // Get current twin info from backend
    try {
        console.log('🔄 Loading twin info for chat...');
        const twinInfo = await window.echoAPI.getTwinInfo();
        console.log('🤖 Twin response:', twinInfo);
        
        if (twinInfo.success && twinInfo.data) {
            currentTwin = twinInfo.data;
            console.log('✅ Twin loaded:', currentTwin.name);
            console.log('📝 Twin persona:', currentTwin.persona.substring(0, 100) + '...');
            
            // Update UI with twin info
            updateChatUI(currentTwin);
            
            // Initialize chat functionality
            initializeChat(currentTwin);
        } else {
            console.log('❌ No twin data in response');
            showCreateTwinMessage();
            return;
        }
    } catch (error) {
        console.log('❌ Failed to load twin:', error);
        showCreateTwinMessage();
        return;
    }
});

function updateChatUI(twin) {
    // Update twin name
    const twinNameElement = document.getElementById('twinName');
    if (twinNameElement) {
        twinNameElement.textContent = `⚡ ${twin.name.toUpperCase()} NEURAL TWIN`;
    }
    
    // Update twin initials
    const initials = twin.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    const twinInitialsElement = document.getElementById('twinInitials');
    if (twinInitialsElement) {
        twinInitialsElement.textContent = initials;
    }
    
    // Update all avatar initials
    const avatarInitials = document.querySelectorAll('.avatar-initials');
    avatarInitials.forEach(element => {
        element.textContent = initials;
    });
    
    // Update persona display
    const twinPersonaElement = document.getElementById('twinPersona');
    if (twinPersonaElement) {
        twinPersonaElement.textContent = twin.persona.substring(0, 100) + '...';
    }
    
    // Update welcome message timestamp
    const welcomeTime = document.getElementById('welcomeTime');
    if (welcomeTime) {
        const now = new Date();
        welcomeTime.textContent = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    
    console.log('✅ Chat UI updated with twin info');
}

function initializeChat(twin) {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton') || document.getElementById('sendBtn');
    const chatForm = document.getElementById('chatForm');
    const chatMessages = document.getElementById('chatMessages');
    const charCount = document.getElementById('charCount');
    
    if (!messageInput || !sendButton || !chatForm) {
        console.error('❌ Chat elements not found');
        return;
    }
    
    // Handle form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        sendMessage(twin);
    });
    
    // Send message on button click
    sendButton.addEventListener('click', function(e) {
        e.preventDefault();
        sendMessage(twin);
    });
    
    // Send message on Enter key
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(twin);
        }
    });
    
    // Character count and button state management
    messageInput.addEventListener('input', function() {
        const length = this.value.length;
        if (charCount) {
            charCount.textContent = length;
        }
        
        // Enable/disable send button based on input
        sendButton.disabled = length === 0;
        sendButton.style.opacity = length === 0 ? '0.5' : '1';
        
        // Update character count color
        if (charCount) {
            if (length > 450) {
                charCount.style.color = 'var(--neon-magenta)';
            } else if (length > 400) {
                charCount.style.color = 'var(--neon-purple)';
            } else {
                charCount.style.color = 'var(--text-muted)';
            }
        }
    });
    
    // Initialize send button state
    sendButton.disabled = true;
    sendButton.style.opacity = '0.5';
    
    console.log('✅ Chat functionality initialized');
}

async function sendMessage(twin) {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message || !twin) {
        console.log('❌ No message or twin data');
        return;
    }
    
    console.log('📤 Sending message:', message);
    
    // Add user message to chat
    addMessage(message, 'user');
    
    // Clear input and disable send button
    messageInput.value = '';
    const sendButton = document.getElementById('sendButton') || document.getElementById('sendBtn');
    const charCount = document.getElementById('charCount');
    
    if (sendButton) {
        sendButton.disabled = true;
        sendButton.style.opacity = '0.5';
    }
    if (charCount) {
        charCount.textContent = '0';
    }
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Send message to backend
        const response = await window.echoAPI.sendMessage(message, twin.name);
        console.log('📨 Backend response:', response);
        
        if (response.success) {
            addMessage(response.data.message, 'twin');
            console.log('✅ AI response received');
        } else {
            throw new Error('Failed to get response');
        }
    } catch (error) {
        console.error('❌ Chat error:', error);
        addMessage("I'm having trouble responding right now. Please try again!", 'twin');
    } finally {
        hideTypingIndicator();
    }
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Hide welcome message on first message
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.style.display = 'none';
    }
    
    // Get initials for avatar
    let initials = 'AI';
    let senderName = 'Your AI Twin';
    
    if (sender === 'user') {
        initials = 'YOU';
        senderName = 'You';
    } else {
        // Get twin initials from the page
        const twinInitialsElement = document.getElementById('twinInitials');
        if (twinInitialsElement) {
            initials = twinInitialsElement.textContent;
        }
    }
    
    messageDiv.className = `message ${sender}-message animate-fade-in`;
    messageDiv.setAttribute('data-message-id', messageId);
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <span class="avatar-initials">${initials}</span>
        </div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-sender">${senderName}</span>
                <span class="message-time">${currentTime}</span>
            </div>
            <div class="message-text">
                <p>${escapeHtml(text)}</p>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    
    // Smooth scroll to bottom
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

function showTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.classList.remove('hidden', 'd-none');
        
        // Update typing indicator avatar
        const twinInitialsElement = document.getElementById('twinInitials');
        const typingAvatar = typingIndicator.querySelector('.avatar-initials');
        if (typingAvatar && twinInitialsElement) {
            typingAvatar.textContent = twinInitialsElement.textContent;
        }
        
        // Scroll to show typing indicator
        setTimeout(() => {
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }, 100);
    }
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.classList.add('hidden');
    }
}

function showCreateTwinMessage() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = `
            <div class="welcome-message">
                <div class="welcome-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z"/>
                    </svg>
                </div>
                <h2 class="welcome-title">Neural Connection Lost</h2>
                <p class="welcome-text">
                    Please reinitialize your twin to establish neural connection.
                </p>
                <a href="index.html" class="btn btn-primary" style="margin-top: 1rem;">
                    Create Your Twin
                </a>
            </div>
        `;
    }
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}