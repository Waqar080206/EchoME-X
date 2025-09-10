// Centralized Sidebar Component

class SidebarManager {
    constructor() {
        this.currentPage = '';
        this.isSidebarOpen = false;
        this.init();
    }

    async init() {
        await this.loadSidebar();
        this.setupEventListeners();
        this.setActivePage();
        this.handlePageSpecificContent();
    }

    async loadSidebar() {
        try {
            // Try to load sidebar.html
            const response = await fetch('./sidebar.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const sidebarHTML = await response.text();
            
            // Insert sidebar at the beginning of body
            document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
            
            console.log('✅ Sidebar loaded successfully');
        } catch (error) {
            console.warn('⚠️ Failed to load sidebar.html, using fallback:', error);
            this.createFallbackSidebar();
        }
    }

    createFallbackSidebar() {
        // Standardized fallback sidebar matching analytics page
        const fallbackHTML = `
            <button class="menu-toggle" id="menuToggle">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>

            <div class="sidebar-overlay" id="sidebarOverlay"></div>

            <aside class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <a href="index.html" class="nav-logo">
                        <div class="logo-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                        <span class="logo-text">EchoMe X</span>
                    </a>
                    <button class="close-btn" id="closeSidebar">
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div class="sidebar-content">
                    <div class="nav-section">
                        <a href="index.html" class="nav-item" data-page="home">
                            <svg width="22" height="22" viewBox="0 0 24 24">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                <polyline points="9,22 9,12 15,12 15,22"/>
                            </svg>
                            Home
                        </a>
                        <a href="chat.html" class="nav-item" data-page="chat">
                            <svg width="22" height="22" viewBox="0 0 24 24">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            Chat
                        </a>
                        <a href="analytics.html" class="nav-item" data-page="analytics">
                            <svg width="22" height="22" viewBox="0 0 24 24">
                                <path d="M18 20V10"/>
                                <path d="M12 20V4"/>
                                <path d="M6 20v-6"/>
                            </svg>
                            Analytics
                        </a>
                    </div>

                    <div class="sidebar-divider"></div>

                    <div class="twin-list-section" id="twinListSection" style="display: none;">
                        <div class="twin-list-header">
                            <span>Your Twins</span>
                        </div>
                        <div class="twin-list" id="twinList">
                            <div class="twin-list-empty" id="twinListEmpty">
                                No twins created yet
                            </div>
                        </div>
                    </div>

                    <div class="create-section" id="createSection">
                        <a href="index.html#quiz" class="nav-item create-btn">
                            <svg width="22" height="22" viewBox="0 0 24 24">
                                <path d="M12 5v14m7-7H5"/>
                            </svg>
                            Create New Twin
                        </a>
                    </div>

                    <div class="sidebar-spacer"></div>

                    <div class="upgrade-section">
                        <button class="upgrade-btn">
                            <span class="upgrade-highlight">Upgrade</span> to Pro
                        </button>
                    </div>

                    <div class="user-section">
                        <div class="user-info">
                            <div class="user-avatar">U</div>
                            <span class="username">User</span>
                        </div>
                    </div>
                </div>
            </aside>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', fallbackHTML);
        console.log('✅ Fallback sidebar created');
    }

    setupEventListeners() {
        setTimeout(() => {
            const menuToggle = document.getElementById('menuToggle');
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            const closeSidebar = document.getElementById('closeSidebar');

            console.log('🔧 Setting up sidebar listeners:', { menuToggle, sidebar, overlay, closeSidebar });

            // Hamburger menu toggle
            if (menuToggle) {
                menuToggle.addEventListener('click', () => this.toggleSidebar());
            }

            // Close button
            if (closeSidebar) {
                closeSidebar.addEventListener('click', () => this.closeSidebar());
            }

            // Overlay click
            if (overlay) {
                overlay.addEventListener('click', () => this.closeSidebar());
            }

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isSidebarOpen) {
                    this.closeSidebar();
                }
            });

            // Close on window resize (mobile)
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768 && this.isSidebarOpen) {
                    this.closeSidebar();
                }
            });

            console.log('✅ Sidebar event listeners setup complete');
        }, 200);
    }

    setActivePage() {
        // Determine current page from URL
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        
        let currentPage = 'home'; // default
        
        if (filename.includes('chat')) {
            currentPage = 'chat';
        } else if (filename.includes('analytics')) {
            currentPage = 'analytics';
        } else if (filename.includes('index') || filename === '' || filename === '/') {
            currentPage = 'home';
        }

        // Set active state
        setTimeout(() => {
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.dataset.page === currentPage) {
                    item.classList.add('active');
                }
            });
            console.log(`✅ Active page set: ${currentPage}`);
        }, 250);

        this.currentPage = currentPage;
    }

    handlePageSpecificContent() {
        setTimeout(() => {
            const twinListSection = document.getElementById('twinListSection');
            const createSection = document.getElementById('createSection');

            if (this.currentPage === 'chat') {
                // Show twin list, hide create section
                if (twinListSection) twinListSection.style.display = 'block';
                if (createSection) createSection.style.display = 'none';
                
                // Load twins for chat page
                this.loadTwinList();
            } else {
                // Show create section, hide twin list
                if (twinListSection) twinListSection.style.display = 'none';
                if (createSection) createSection.style.display = 'block';
            }
        }, 300);
    }

    async loadTwinList() {
        // Only load twins on chat page
        if (this.currentPage !== 'chat') return;

        try {
            const response = await fetch('/api/debug-twins');
            const result = await response.json();
            
            const twinList = document.getElementById('twinList');
            const emptyState = document.getElementById('twinListEmpty');
            
            let twinsToShow = [];
            
            if (result.twins && result.twins.length > 0) {
                twinsToShow = result.twins;
            }
            
            // Also add current twin from localStorage
            const storedTwinId = localStorage.getItem('twinId');
            const storedTwinName = localStorage.getItem('twinName');
            
            if (storedTwinId && storedTwinName) {
                const foundInAPI = twinsToShow.find(twin => twin.id === storedTwinId);
                
                if (!foundInAPI) {
                    twinsToShow.unshift({
                        id: storedTwinId,
                        name: storedTwinName,
                        conversationCount: 0,
                        hasPersonality: true
                    });
                }
            }
            
            if (twinsToShow.length > 0 && twinList && emptyState) {
                emptyState.style.display = 'none';
                twinList.innerHTML = '';
                
                twinsToShow.forEach(twin => {
                    const twinElement = this.createTwinListItem(twin);
                    twinList.appendChild(twinElement);
                });
                
                console.log('✅ Twins loaded in sidebar:', twinsToShow.map(t => t.name));
            }
        } catch (error) {
            console.warn('⚠️ Failed to load twins:', error);
        }
    }

    createTwinListItem(twin) {
        const twinItem = document.createElement('div');
        twinItem.className = 'twin-item';
        twinItem.dataset.twinId = twin.id;
        
        twinItem.innerHTML = `
            <div class="twin-item-icon">
                ${twin.name.charAt(0).toUpperCase()}
            </div>
            <div class="twin-item-content">
                <div class="twin-item-name">${twin.name}</div>
                <div class="twin-item-status">
                    ${twin.conversationCount || 0} message${(twin.conversationCount || 0) !== 1 ? 's' : ''}
                </div>
            </div>
            <div class="twin-item-menu">
                <button class="twin-menu-button" onclick="window.sidebarManager.toggleTwinMenu('${twin.id}', event)">
                    <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="12" cy="5" r="1"/>
                        <circle cx="12" cy="19" r="1"/>
                    </svg>
                </button>
                <div class="twin-menu-dropdown" id="menu-${twin.id}">
                    <button class="twin-menu-option" onclick="window.sidebarManager.shareTwin('${twin.id}')">
                        <svg viewBox="0 0 24 24">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                            <polyline points="16,6 12,2 8,6"/>
                            <line x1="12" y1="2" x2="12" y2="15"/>
                        </svg>
                        Share
                    </button>
                    <button class="twin-menu-option delete" onclick="window.sidebarManager.deleteTwin('${twin.id}')">
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
        
        return twinItem;
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const menuToggle = document.getElementById('menuToggle');
        
        this.isSidebarOpen = !this.isSidebarOpen;
        
        if (sidebar) sidebar.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');
        
        // Hide/show the hamburger menu
        if (menuToggle) {
            if (this.isSidebarOpen) {
                menuToggle.classList.add('hidden');
            } else {
                menuToggle.classList.remove('hidden');
            }
        }
        
        console.log(`📱 Sidebar ${this.isSidebarOpen ? 'opened' : 'closed'}`);
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        const menuToggle = document.getElementById('menuToggle');
        
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        
        // Show the hamburger menu when sidebar closes
        if (menuToggle) {
            menuToggle.classList.remove('hidden');
        }
        
        this.isSidebarOpen = false;
        console.log('❌ Sidebar closed');
    }

    // Twin management methods
    toggleTwinMenu(twinId, event) {
        event.stopPropagation();
        const menu = document.getElementById(`menu-${twinId}`);
        if (menu) {
            menu.classList.toggle('active');
        }
    }

    shareTwin(twinId) {
        console.log('Sharing twin:', twinId);
        // Implement share functionality
    }

    deleteTwin(twinId) {
        console.log('Deleting twin:', twinId);
        // Implement delete functionality
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing sidebar...');
    window.sidebarManager = new SidebarManager();
});

// Export for backward compatibility
window.SidebarManager = SidebarManager;