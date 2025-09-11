let currentTwin = null;
let currentActiveMenu = null;

// Add this function to handle twin selection from sidebar
window.updateChatInterface = function(twin) {
    console.log('🎨 Updating chat interface for:', twin.name);
    
    // Update welcome state
    const welcomeTitle = document.getElementById('welcomeTitle');
    const welcomeAvatarText = document.getElementById('welcomeAvatarText');
    
    if (welcomeTitle) {
        welcomeTitle.textContent = `Chat with ${twin.name}`;
    }
    
    if (welcomeAvatarText) {
        // Use the twin's actual name for initials, not the ID
        const initials = twin.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
        welcomeAvatarText.textContent = initials;
    }
    
    // Clear existing messages if switching twins
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        const messages = chatMessages.querySelectorAll('.message-group');
        messages.forEach(msg => msg.remove());
        
        // Show welcome state
        const welcomeState = document.getElementById('welcomeState');
        if (welcomeState) {
            welcomeState.style.display = 'block';
        }
    }
    
    console.log('✅ Chat interface updated - using twin name:', twin.name);
};

// Update the initialization function
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Chat page loaded');
    
    // Initialize sidebar functionality
    initializeSidebar();
    
    // Check stored twin data first
    const storedTwinId = localStorage.getItem('twinId');
    const storedTwinName = localStorage.getItem('twinName');
    const personalityProfile = localStorage.getItem('personalityProfile');
    
    console.log('🔍 Checking stored twin data:', { 
        storedTwinId, 
        storedTwinName, 
        hasPersonality: !!personalityProfile 
    });
    
    // Check if stored ID is valid MongoDB ObjectId format
    const mongoIdPattern = /^[0-9a-fA-F]{24}$/;
    const isValidStoredId = storedTwinId && mongoIdPattern.test(storedTwinId);
    
    if (isValidStoredId && storedTwinName) {
        // Use valid stored data
        currentTwin = {
            _id: storedTwinId,
            id: storedTwinId,
            name: storedTwinName,
            hasPersonality: !!personalityProfile
        };
        updateChatInterface(currentTwin);
        console.log('✅ Using valid stored twin data:', currentTwin);
    } else {
        // Clear invalid data and try to load from backend
        if (storedTwinId && !isValidStoredId) {
            console.log('🧹 Clearing invalid twin ID:', storedTwinId);
            clearOldTwinData();
        }
        
        try {
            console.log('🔄 Loading twin from backend...');
            const response = await fetch('/api/get-first-twin');
            const result = await response.json();
            
            if (result.success && result.twin) {
                currentTwin = {
                    _id: result.twin.id,
                    id: result.twin.id,
                    name: result.twin.name,
                    hasPersonality: result.twin.hasPersonality
                };
                
                // Store the valid twin data
                localStorage.setItem('currentTwin', JSON.stringify(currentTwin));
                localStorage.setItem('twinId', currentTwin.id);
                localStorage.setItem('twinName', currentTwin.name);
                if (result.twin.personality) {
                    localStorage.setItem('personalityProfile', JSON.stringify(result.twin.personality));
                }
                
                updateChatInterface(currentTwin);
                console.log('✅ Loaded and stored twin from backend:', currentTwin);
            } else {
                throw new Error('No twin data received from backend');
            }
        } catch (error) {
            console.log('❌ No twin found, showing create twin message');
            showCreateTwinState();
        }
    }
    
    // Setup form handlers
    setupChatHandlers();
});

// ========== SIDEBAR FUNCTIONALITY ==========

function initializeSidebar() {
    const menuToggle = document.getElementById('menuToggle');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    console.log('🔧 Initializing sidebar:', { menuToggle, closeSidebarBtn, sidebarOverlay });
    
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            toggleSidebar();
        });
    }
    
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeSidebar();
        });
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', (e) => {
            e.preventDefault();
            closeSidebar();
        });
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    console.log('🔄 Toggling sidebar');
    
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
    if (overlay) {
        overlay.classList.toggle('active');
    }
    
    // Don't manually hide/show hamburger - CSS will handle it
    console.log('✅ Sidebar toggled, CSS will handle hamburger visibility');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    console.log('❌ Closing sidebar');
    
    if (sidebar) {
        sidebar.classList.remove('active');
    }
    if (overlay) {
        overlay.classList.remove('active');
    }
    
    // Don't manually show hamburger - CSS will handle it
    console.log('✅ Sidebar closed, CSS will handle hamburger visibility');
}

// ========== TWIN MANAGEMENT ==========

async function loadTwinList() {
    try {
        console.log('🔄 Loading twin list...');
        
        // First, try to get from API
        const response = await fetch('/api/debug-twins');
        const result = await response.json();
        
        const twinList = document.getElementById('twinList');
        const emptyState = document.getElementById('twinListEmpty');
        
        console.log('📡 API response:', result);
        
        let twinsToShow = [];
        
        // Add twins from API
        if (result.twins && result.twins.length > 0) {
            twinsToShow = result.twins;
        }
        
        // Also add current twin from localStorage if not in API results
        const storedTwinId = localStorage.getItem('twinId');
        const storedTwinName = localStorage.getItem('twinName');
        
        if (storedTwinId && storedTwinName) {
            // Check if stored twin is already in API results
            const foundInAPI = twinsToShow.find(twin => twin.id === storedTwinId);
            
            if (!foundInAPI) {
                // Add stored twin to the list
                twinsToShow.unshift({
                    id: storedTwinId,
                    name: storedTwinName,
                    conversationCount: 0,
                    hasPersonality: true
                });
                console.log('✅ Added stored twin to list:', storedTwinName);
            }
        }
        
        if (twinsToShow.length > 0) {
            emptyState.style.display = 'none';
            
            // Clear existing twins
            twinList.innerHTML = '';
            
            twinsToShow.forEach(twin => {
                const twinElement = createTwinListItem(twin);
                twinList.appendChild(twinElement);
            });
            
            console.log('✅ Displayed twins:', twinsToShow.map(t => t.name));
        } else {
            emptyState.style.display = 'block';
            console.log('❌ No twins to display');
        }
    } catch (error) {
        console.error('❌ Failed to load twins:', error);
        
        // Fallback: show stored twin if exists
        const storedTwinId = localStorage.getItem('twinId');
        const storedTwinName = localStorage.getItem('twinName');
        
        if (storedTwinId && storedTwinName) {
            const twinList = document.getElementById('twinList');
            const emptyState = document.getElementById('twinListEmpty');
            
            emptyState.style.display = 'none';
            twinList.innerHTML = '';
            
            const fallbackTwin = {
                id: storedTwinId,
                name: storedTwinName,
                conversationCount: 0,
                hasPersonality: true
            };
            
            const twinElement = createTwinListItem(fallbackTwin);
            twinList.appendChild(twinElement);
            
            console.log('✅ Fallback: Displayed stored twin:', storedTwinName);
        }
    }
}

function createTwinListItem(twin) {
    const twinItem = document.createElement('div');
    twinItem.className = 'twin-item';
    twinItem.dataset.twinId = twin.id;
    
    // Check if this is the current active twin
    if (currentTwin && currentTwin._id === twin.id) {
        twinItem.classList.add('active');
    }
    
    twinItem.innerHTML = `
        <div class="twin-item-icon">
            ${twin.name.charAt(0).toUpperCase()}
        </div>
        <div class="twin-item-content">
            <div class="twin-item-name">${escapeHtml(twin.name)}</div>
            <div class="twin-item-status">
                ${twin.conversationCount || 0} message${(twin.conversationCount || 0) !== 1 ? 's' : ''}
            </div>
        </div>
        <div class="twin-item-menu">
            <button class="twin-menu-button" onclick="toggleTwinMenu('${twin.id}', event)">
                <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="12" cy="5" r="1"/>
                    <circle cx="12" cy="19" r="1"/>
                </svg>
            </button>
            <div class="twin-menu-dropdown" id="menu-${twin.id}">
                <button class="twin-menu-option" onclick="shareTwin('${twin.id}')">
                    <svg viewBox="0 0 24 24">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                        <polyline points="16,6 12,2 8,6"/>
                        <line x1="12" y1="2" x2="12" y2="15"/>
                    </svg>
                    Share
                </button>
                <button class="twin-menu-option delete" onclick="deleteTwin('${twin.id}')">
                    <svg viewBox="0 0 24 24">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                    Delete
                </button>
            </div>
        </div>
    `;
    
    // Add click handler to switch to this twin
    twinItem.addEventListener('click', (e) => {
        if (!e.target.closest('.twin-item-menu')) {
            switchToTwin(twin);
        }
    });
    
    return twinItem;
}

function toggleTwinMenu(twinId, event) {
    event.stopPropagation();
    
    const menu = document.getElementById(`menu-${twinId}`);
    
    // Close other open menus
    if (currentActiveMenu && currentActiveMenu !== menu) {
        currentActiveMenu.classList.remove('active');
    }
    
    // Toggle current menu
    menu.classList.toggle('active');
    currentActiveMenu = menu.classList.contains('active') ? menu : null;
}

async function deleteTwin(twinId) {
    if (!confirm('Are you sure you want to delete this twin? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/twin/${twinId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            // Remove from UI
            const twinElement = document.querySelector(`[data-twin-id="${twinId}"]`);
            if (twinElement) {
                twinElement.remove();
            }
            
            // If this was the current twin, reset the chat
            if (currentTwin && currentTwin._id === twinId) {
                currentTwin = null;
                showCreateTwinState();
            }
            
            // Reload twin list
            loadTwinList();
            
            // Show success message
            showNotification('Twin deleted successfully', 'success');
        } else {
            throw new Error('Failed to delete twin');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showNotification('Failed to delete twin', 'error');
    }
}

async function shareTwin(twinId) {
    try {
        // Create shareable link
        const shareUrl = `${window.location.origin}/chat.html?twin=${twinId}`;
        
        // Copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        showNotification('Twin link copied to clipboard!', 'success');
    } catch (error) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = `${window.location.origin}/chat.html?twin=${twinId}`;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        showNotification('Twin link copied to clipboard!', 'success');
    }
}

function switchToTwin(twin) {
    // Update current twin
    currentTwin = {
        _id: twin.id,
        name: twin.name,
        hasPersonality: twin.hasPersonality
    };
    
    // Update localStorage
    localStorage.setItem('twinId', twin.id);
    localStorage.setItem('twinName', twin.name);
    
    // Update UI
    updateChatInterface(currentTwin);
    
    // Update active state in sidebar
    document.querySelectorAll('.twin-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-twin-id="${twin.id}"]`)?.classList.add('active');
    
    // Close sidebar on mobile
    closeSidebar();
}

// ========== CHAT FUNCTIONALITY ==========

function setupChatHandlers() {
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    
    console.log('🔧 Setting up chat handlers:', { chatForm, messageInput, sendButton });
    
    if (!chatForm || !messageInput || !sendButton) {
        console.error('❌ Missing chat form elements');
        return;
    }
    
    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        
        // Enable/disable send button
        const hasText = this.value.trim().length > 0;
        sendButton.disabled = !hasText;
        console.log('📝 Input changed:', { hasText, value: this.value });
    });
    
    // Handle Enter key
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            console.log('⌨️ Enter key pressed');
            if (!sendButton.disabled && currentTwin) {
                sendMessage();
            }
        }
    });
    
    // Handle form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('📝 Form submitted');
        const message = messageInput.value.trim();
        if (message && currentTwin) {
            sendMessage();
        }
    });
    
    // Handle send button click
    sendButton.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('🖱️ Send button clicked');
        if (!sendButton.disabled && currentTwin) {
            sendMessage();
        }
    });
}

// Update the sendMessage function around line 512
const API_BASE_URL = 'https://your-render-app-name.onrender.com'; // Your Render backend URL

async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    messageInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message: message,
                conversationId: getCurrentConversationId() // If you have conversation tracking
            })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Remove typing indicator
        hideTypingIndicator();
        
        // Add AI response to chat
        addMessageToChat(data.response, 'ai');
        
    } catch (error) {
        console.error('Chat error:', error);
        hideTypingIndicator();
        addMessageToChat('Sorry, I encountered an error. Please try again.', 'ai');
    }
}

// ========== UI HELPER FUNCTIONS ==========

function addMessage(role, content) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-group ${role}`;
    
    let avatarLetter;
    if (role === 'user') {
        avatarLetter = 'Y'; // You
    } else {
        avatarLetter = currentTwin ? currentTwin.name.charAt(0).toUpperCase() : 'A';
    }
    
    messageDiv.innerHTML = `
        <div class="message-avatar">
            <div class="avatar ${role}">
                <span>${avatarLetter}</span>
            </div>
        </div>
        <div class="message-content">
            <div class="message-text">${escapeHtml(content)}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    scrollToBottom();
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message-group assistant typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    const avatarLetter = currentTwin ? currentTwin.name.charAt(0).toUpperCase() : 'A';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <div class="avatar assistant">
                <span>${avatarLetter}</span>
            </div>
        </div>
        <div class="message-content">
            <div class="typing-animation">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function hideWelcomeState() {
    const welcomeState = document.getElementById('welcomeState');
    if (welcomeState) {
        welcomeState.style.display = 'none';
    }
}

function sendSuggestion(text) {
    const messageInput = document.getElementById('messageInput');
    messageInput.value = text;
    messageInput.dispatchEvent(new Event('input'));
    messageInput.focus();
}

function showCreateTwinState() {
    const welcomeState = document.getElementById('welcomeState');
    if (welcomeState) {
        welcomeState.innerHTML = `
            <div class="welcome-content">
                <div class="welcome-avatar">
                    <div class="avatar-circle">
                        <span>⚠️</span>
                    </div>
                </div>
                <h1 class="welcome-title">No AI Twin Found</h1>
                <p class="welcome-subtitle">You need to create an AI twin first before you can chat!</p>
                <a href="index.html" class="create-twin-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 5v14m7-7H5"/>
                    </svg>
                    Create Your Twin
                </a>
            </div>
        `;
    }
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

function showNotification(message, type = 'info') {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6b7280'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== EVENT LISTENERS ==========

// Close menus when clicking outside
document.addEventListener('click', (e) => {
    if (currentActiveMenu && !e.target.closest('.twin-item-menu')) {
        currentActiveMenu.classList.remove('active');
        currentActiveMenu = null;
    }
});

// ========== UTILITY FUNCTIONS ==========

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make loadTwinList available globally for index.js
window.loadTwinList = loadTwinList;

// Add this function to clear old data
function clearOldTwinData() {
    localStorage.removeItem('currentTwin');
    localStorage.removeItem('twinId');
    localStorage.removeItem('twinName');
    localStorage.removeItem('personalityProfile');
    localStorage.removeItem('userTwins');
    console.log('🧹 Cleared all old twin data');
}

// Call this in the browser console or add it as a button temporarily
window.clearOldTwinData = clearOldTwinData;