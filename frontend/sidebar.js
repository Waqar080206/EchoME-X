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
        const currentPath = window.location.pathname;
        const isChat = currentPath.includes('chat.html') || currentPath.endsWith('/chat');
        
        const createSection = document.getElementById('createSection');
        const twinListSection = document.getElementById('twinListSection');
        
        if (isChat) {
            // Show twin list on chat page
            if (createSection) createSection.style.display = 'none';
            if (twinListSection) {
                twinListSection.style.display = 'block';
                this.loadTwinList();
            }
        } else {
            // Show create button on other pages
            if (createSection) createSection.style.display = 'block';
            if (twinListSection) twinListSection.style.display = 'none';
        }
    }

    async loadTwinList() {
        const twinList = document.getElementById('twinList');
        const twinListEmpty = document.getElementById('twinListEmpty');
        
        if (!twinList) return;
        
        try {
            // Get twins from localStorage
            const twinsData = localStorage.getItem('userTwins');
            const twins = twinsData ? JSON.parse(twinsData) : [];
            
            console.log('Loading twins list:', twins);
            
            if (twins.length === 0) {
                twinList.innerHTML = '<div class="twin-list-empty">No twins created yet</div>';
                return;
            }
            
            // Hide empty state
            if (twinListEmpty) {
                twinListEmpty.style.display = 'none';
            }
            
            // Clear existing list
            twinList.innerHTML = '';
            
            // Add each twin to the list
            twins.forEach(twin => {
                const twinElement = this.createTwinListItem(twin);
                twinList.appendChild(twinElement);
            });
            
        } catch (error) {
            console.error('Error loading twin list:', error);
            twinList.innerHTML = '<div class="twin-list-empty">Error loading twins</div>';
        }
    }

    createTwinListItem(twin) {
        const twinItem = document.createElement('div');
        twinItem.className = 'twin-item';
        twinItem.dataset.twinId = twin.id;
        
        // Get initials for avatar
        const initials = twin.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
        
        twinItem.innerHTML = `
            <div class="twin-item-icon">${initials}</div>
            <div class="twin-item-content">
                <div class="twin-item-name">${twin.name}</div>
                <div class="twin-item-status">${twin.status || 'Active'}</div>
            </div>
            <div class="twin-item-menu">
                <button class="twin-menu-button" onclick="window.sidebarManager.toggleTwinMenu('${twin.id}', event)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0-14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                    </svg>
                </button>
                <div class="twin-menu-dropdown" id="twinMenu-${twin.id}">
                    <button class="twin-menu-option" onclick="window.sidebarManager.shareTwin('${twin.id}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                            <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 1 1 0-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 1 1 5.367-2.684 3 3 0 0 1-5.367 2.684zm0 9.316a3 3 0 1 1 5.367 2.684 3 3 0 0 1-5.367-2.684z"/>
                        </svg>
                        Share
                    </button>
                    <button class="twin-menu-option delete" onclick="window.sidebarManager.deleteTwin('${twin.id}')">
                        <svg width="14" height="14" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                            <path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"/>
                        </svg>
                        Delete
                    </button>
                </div>
            </div>
        `;
        
        // Add click handler to select twin
        twinItem.addEventListener('click', (e) => {
            // Don't select if clicking on menu button
            if (e.target.closest('.twin-menu-button')) return;
            
            this.selectTwin(twin);
        });
        
        return twinItem;
    }

    selectTwin(twin) {
        // Remove active class from all twins
        document.querySelectorAll('.twin-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to selected twin
        const twinElement = document.querySelector(`[data-twin-id="${twin.id}"]`);
        if (twinElement) {
            twinElement.classList.add('active');
        }
        
        // Store as current twin
        localStorage.setItem('currentTwin', JSON.stringify(twin));
        localStorage.setItem('twinId', twin.id);
        localStorage.setItem('twinName', twin.name);
        
        // Update chat interface if on chat page
        if (window.location.pathname.includes('chat.html')) {
            if (window.updateChatInterface) {
                window.updateChatInterface(twin);
            }
        }
        
        console.log('Selected twin:', twin.name);
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

    toggleTwinMenu(twinId, event) {
        event.stopPropagation();
        
        // Close all other menus
        document.querySelectorAll('.twin-menu-dropdown').forEach(menu => {
            if (menu.id !== `twinMenu-${twinId}`) {
                menu.classList.remove('active');
            }
        });
        
        // Toggle current menu
        const menu = document.getElementById(`twinMenu-${twinId}`);
        if (menu) {
            menu.classList.toggle('active');
        }
        
        // Close menu when clicking outside
        setTimeout(() => {
            const closeMenus = (e) => {
                if (!e.target.closest('.twin-item-menu')) {
                    document.querySelectorAll('.twin-menu-dropdown').forEach(menu => {
                        menu.classList.remove('active');
                    });
                    document.removeEventListener('click', closeMenus);
                }
            };
            document.addEventListener('click', closeMenus);
        }, 0);
    }

    shareTwin(twinId) {
        try {
            const twinsData = localStorage.getItem('userTwins');
            const twins = twinsData ? JSON.parse(twinsData) : [];
            const twin = twins.find(t => t.id === twinId);
            
            if (twin) {
                // Create shareable link (you can customize this)
                const shareUrl = `${window.location.origin}/chat.html?twin=${twinId}`;
                
                // Copy to clipboard
                navigator.clipboard.writeText(shareUrl).then(() => {
                    // Show success message
                    this.showNotification(`Share link for ${twin.name} copied to clipboard!`, 'success');
                }).catch(() => {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = shareUrl;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    this.showNotification(`Share link for ${twin.name} copied to clipboard!`, 'success');
                });
            }
        } catch (error) {
            console.error('Error sharing twin:', error);
            this.showNotification('Failed to share twin', 'error');
        }
        
        // Close menu
        document.querySelectorAll('.twin-menu-dropdown').forEach(menu => {
            menu.classList.remove('active');
        });
    }

    deleteTwin(twinId) {
        try {
            const twinsData = localStorage.getItem('userTwins');
            const twins = twinsData ? JSON.parse(twinsData) : [];
            const twin = twins.find(t => t.id === twinId);
            
            if (twin && confirm(`Are you sure you want to delete ${twin.name}? This action cannot be undone.`)) {
                // Remove from twins list
                const updatedTwins = twins.filter(t => t.id !== twinId);
                localStorage.setItem('userTwins', JSON.stringify(updatedTwins));
                
                // If this was the current twin, clear it
                const currentTwin = localStorage.getItem('currentTwin');
                if (currentTwin) {
                    const current = JSON.parse(currentTwin);
                    if (current.id === twinId) {
                        localStorage.removeItem('currentTwin');
                        localStorage.removeItem('twinId');
                        localStorage.removeItem('twinName');
                    }
                }
                
                // Reload the twin list
                this.loadTwinList();
                
                this.showNotification(`${twin.name} has been deleted`, 'success');
            }
        } catch (error) {
            console.error('Error deleting twin:', error);
            this.showNotification('Failed to delete twin', 'error');
        }
        
        // Close menu
        document.querySelectorAll('.twin-menu-dropdown').forEach(menu => {
            menu.classList.remove('active');
        });
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : '#10b981'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing sidebar...');
    window.sidebarManager = new SidebarManager();
});

// Export for backward compatibility
window.SidebarManager = SidebarManager;