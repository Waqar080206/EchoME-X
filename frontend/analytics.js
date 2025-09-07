// Analytics page functionality for EchoMe X Neural Dashboard
// This file handles the analytics dashboard and mobile navigation

document.addEventListener('DOMContentLoaded', function() {
    initializeAnalyticsPage();
});

function initializeAnalyticsPage() {
    // Mobile navigation toggle
    EchoMeUtils.initializeMobileNavigation();
    
    // Analytics functionality
    initializeAnalytics();
    
    console.log('Neural analytics dashboard initialized');
}

async function initializeAnalytics() {
    // Check if user data exists
    const userData = EchoMeUtils.getUserData();
    if (!userData) {
        showError('No twin data found. Please create your twin first.');
        EchoMeUtils.showNotification('No twin data found. Redirecting...', 'warning');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
        return;
    }
    
    if (!EchoMeUtils.validateUserId(userData.userId)) {
        showError('User ID not found. Please create your twin again.');
        EchoMeUtils.showNotification('Invalid user data. Redirecting...', 'error');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
        return;
    }
    
    // Load real analytics data
    showLoadingAnalytics();
    
    try {
        const analyticsData = await loadAnalyticsData(userData.userId);
        hideLoadingAnalytics();
        
        if (analyticsData.success) {
            displayAnalytics(analyticsData.analytics);
            animateMetrics(analyticsData.analytics);
        } else {
            throw new Error(analyticsData.error?.message || 'Failed to load analytics');
        }
    } catch (error) {
        console.error('Analytics loading error:', error);
        hideLoadingAnalytics();
        
        let errorMessage = 'Failed to load neural analytics. Using demo data.';
        
        if (error instanceof EchoMeUtils.APIError) {
            switch (error.code) {
                case 'USER_NOT_FOUND':
                    errorMessage = 'Twin not found. Please reinitialize your digital consciousness.';
                    EchoMeUtils.showNotification('Twin not found. Redirecting...', 'error');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 3000);
                    break;
                case 'NETWORK_ERROR':
                    errorMessage = 'Network connection failed. Displaying demo data.';
                    EchoMeUtils.showNotification('Connection failed. Showing demo data.', 'warning');
                    break;
                default:
                    errorMessage = error.message;
            }
        }
        
        showError(errorMessage);
        
        // Fallback to demo data
        const demoData = {
            followers: 2847,
            engagementRate: 94.2,
            totalInteractions: 15692,
            growthRate: 31.5
        };
        displayAnalytics(demoData);
        animateMetrics(demoData);
    }
    
    // Add hover effects to metric cards
    addMetricCardEffects();
}

function showLoadingAnalytics() {
    const loadingDiv = document.getElementById('loadingAnalytics');
    if (loadingDiv) {
        loadingDiv.classList.remove('hidden');
    }
}

function hideLoadingAnalytics() {
    const loadingDiv = document.getElementById('loadingAnalytics');
    if (loadingDiv) {
        loadingDiv.classList.add('hidden');
    }
}

async function loadAnalyticsData(userId) {
    return await EchoMeUtils.makeAPICall(`/api/analytics/${userId}`, {
        method: 'GET'
    });
}

function displayAnalytics(data) {
    // Update the metric values in the DOM
    const followersElement = document.getElementById('followersCount');
    const interactionsElement = document.getElementById('interactionsCount');
    const engagementElement = document.getElementById('engagementRate');
    const growthElement = document.getElementById('growthRate');
    
    if (followersElement) followersElement.textContent = data.followers.toLocaleString();
    if (interactionsElement) interactionsElement.textContent = data.totalInteractions.toLocaleString();
    if (engagementElement) engagementElement.textContent = `${data.engagementRate.toFixed(1)}%`;
    if (growthElement) growthElement.textContent = `+${data.growthRate.toFixed(1)}%`;
}

function showError(message) {
    const container = document.querySelector('.analytics-container');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid #ef4444;
        color: #ef4444;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        text-align: center;
    `;
    errorDiv.textContent = message;
    
    const header = container.querySelector('.analytics-header');
    if (header) {
        header.after(errorDiv);
    }
}

function animateMetrics(data = null) {
    // Use provided data or fallback to default values
    const metrics = data ? [
        { id: 'followersCount', target: data.followers, suffix: '' },
        { id: 'interactionsCount', target: data.totalInteractions, suffix: '' },
        { id: 'engagementRate', target: data.engagementRate, suffix: '%' },
        { id: 'growthRate', target: data.growthRate, suffix: '%' }
    ] : [
        { id: 'followersCount', target: 2847, suffix: '' },
        { id: 'interactionsCount', target: 15692, suffix: '' },
        { id: 'engagementRate', target: 94.2, suffix: '%' },
        { id: 'growthRate', target: 31.5, suffix: '%' }
    ];
    
    metrics.forEach(metric => {
        animateCounter(metric.id, metric.target, metric.suffix);
    });
    
    // Animate the change indicators
    setTimeout(() => {
        animateChangeIndicators();
    }, 1000);
}

function animateCounter(elementId, target, suffix) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayValue;
        if (suffix === '%') {
            displayValue = current.toFixed(1) + suffix;
        } else if (target > 1000) {
            displayValue = Math.floor(current).toLocaleString() + suffix;
        } else {
            displayValue = Math.floor(current) + suffix;
        }
        
        element.textContent = displayValue;
    }, duration / steps);
}

function animateChangeIndicators() {
    const changes = [
        { id: 'followersChange', value: '+12.3%' },
        { id: 'interactionsChange', value: '+24.7%' },
        { id: 'engagementChange', value: '+8.1%' },
        { id: 'growthChange', value: '+5.2%' }
    ];
    
    changes.forEach((change, index) => {
        setTimeout(() => {
            const element = document.getElementById(change.id);
            if (element) {
                element.textContent = change.value;
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.5s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100);
            }
        }, index * 200);
    });
}

function addMetricCardEffects() {
    const metricCards = document.querySelectorAll('.metric-card');
    
    metricCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add subtle glow effect on hover
            this.style.boxShadow = `
                0 30px 80px rgba(0, 0, 0, 0.9),
                0 0 40px rgba(0, 245, 255, 0.3),
                inset 0 0 20px rgba(0, 245, 255, 0.1)
            `;
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset to original shadow
            this.style.boxShadow = `
                0 20px 60px rgba(0, 0, 0, 0.8),
                inset 0 1px 0 rgba(0, 245, 255, 0.1)
            `;
        });
        
        // Add click effect
        card.addEventListener('click', function() {
            // Pulse effect
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'translateY(-10px)';
            }, 100);
        });
    });
}

// Simulate real-time data updates
function startRealTimeUpdates() {
    setInterval(() => {
        updateRandomMetric();
    }, 10000); // Update every 10 seconds
}

function updateRandomMetric() {
    const metrics = ['followersCount', 'interactionsCount', 'engagementRate', 'growthRate'];
    const randomMetric = metrics[Math.floor(Math.random() * metrics.length)];
    const element = document.getElementById(randomMetric);
    
    if (element) {
        // Add a subtle flash effect to indicate update
        element.style.textShadow = '0 0 20px rgba(0, 245, 255, 0.8)';
        setTimeout(() => {
            element.style.textShadow = '0 0 20px rgba(0, 245, 255, 0.3)';
        }, 500);
    }
}

// Start real-time updates after initial load
setTimeout(startRealTimeUpdates, 5000);