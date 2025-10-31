// Global variables
let currentUser = null;
let authToken = null;
let refreshToken = null;

// API Base URL
const API_BASE_URL = '/api';

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const userInfo = document.getElementById('user-info');
const userName = document.getElementById('user-name');
const userRole = document.getElementById('user-role');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

// Enhanced Alert System with Eye-catching Animations
let alertContainer = null;
let alertQueue = [];
let isShowingAlert = false;

function initAlertContainer() {
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alert-container';
        alertContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(alertContainer);
    }
}

function showAlert(message, type = 'info', duration = 5000) {
    initAlertContainer();
    
    // Add to queue if another alert is showing
    if (isShowingAlert) {
        alertQueue.push({ message, type, duration });
        return;
    }
    
    isShowingAlert = true;
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.style.pointerEvents = 'auto';
    
    // Create message content
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    messageSpan.style.flex = '1';
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
        opacity: 0.7;
        transition: opacity 0.2s;
    `;
    closeBtn.onmouseover = () => closeBtn.style.opacity = '1';
    closeBtn.onmouseout = () => closeBtn.style.opacity = '0.7';
    
    alertDiv.appendChild(messageSpan);
    alertDiv.appendChild(closeBtn);
    
    // Add click to dismiss
    const dismissAlert = () => {
        if (alertDiv.parentNode) {
            alertDiv.classList.add('alert-closing');
            setTimeout(() => {
                if (alertDiv.parentNode) {
                    alertDiv.remove();
                }
                isShowingAlert = false;
                processAlertQueue();
            }, 400);
        }
    };
    
    closeBtn.onclick = dismissAlert;
    alertDiv.onclick = (e) => {
        if (e.target === alertDiv || e.target === messageSpan) {
            dismissAlert();
        }
    };
    
    // Add sound effect (optional)
    playAlertSound(type);
    
    alertContainer.appendChild(alertDiv);
    
    // Auto dismiss
    if (duration > 0) {
        setTimeout(dismissAlert, duration);
    }
}

function processAlertQueue() {
    if (alertQueue.length > 0) {
        const next = alertQueue.shift();
        setTimeout(() => {
            showAlert(next.message, next.type, next.duration);
        }, 200);
    }
}

function playAlertSound(type) {
    // Create audio context for sound effects (optional)
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Different frequencies for different alert types
        const frequencies = {
            success: [523.25, 659.25, 783.99], // C, E, G (major chord)
            error: [440, 370], // A, F# (dissonant)
            warning: [440, 523.25], // A, C
            info: [523.25] // C
        };
        
        const freq = frequencies[type] || frequencies.info;
        
        oscillator.frequency.setValueAtTime(freq[0], audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        
        // Play additional notes for success
        if (type === 'success' && freq.length > 1) {
            freq.slice(1).forEach((f, i) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.setValueAtTime(f, audioContext.currentTime);
                gain.gain.setValueAtTime(0.05, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                osc.start(audioContext.currentTime + (i + 1) * 0.1);
                osc.stop(audioContext.currentTime + (i + 1) * 0.1 + 0.2);
            });
        }
    } catch (e) {
        // Sound not supported, continue silently
    }
}

function showLoading(show = true) {
    let loadingOverlay = document.getElementById('loading-overlay');
    
    if (show) {
        if (!loadingOverlay) {
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loading-overlay';
            loadingOverlay.className = 'loading-overlay';
            loadingOverlay.innerHTML = '<div class="loading-spinner"></div>';
            document.body.appendChild(loadingOverlay);
        }
        loadingOverlay.style.display = 'flex';
    } else {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
}

function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Token Management
function setTokens(access, refresh) {
    authToken = access;
    refreshToken = refresh;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
}

function getTokens() {
    authToken = localStorage.getItem('access_token');
    refreshToken = localStorage.getItem('refresh_token');
    return { access: authToken, refresh: refreshToken };
}

function clearTokens() {
    authToken = null;
    refreshToken = null;
    currentUser = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
}

function setCurrentUser(user) {
    currentUser = user;
    localStorage.setItem('current_user', JSON.stringify(user));
    updateUserInterface();
}

function getCurrentUser() {
    const stored = localStorage.getItem('current_user');
    if (stored) {
        currentUser = JSON.parse(stored);
        return currentUser;
    }
    return null;
}

// API Functions
async function makeAPIRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Add auth token if available
    if (authToken) {
        defaultOptions.headers['Authorization'] = `Bearer ${authToken}`;
    }

    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(API_BASE_URL + url, finalOptions);
        
        // Handle token refresh if needed
        if (response.status === 401 && refreshToken) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
                finalOptions.headers['Authorization'] = `Bearer ${authToken}`;
                return await fetch(API_BASE_URL + url, finalOptions);
            } else {
                // Refresh failed, redirect to login
                clearTokens();
                updateUserInterface();
                window.location.href = '/login/';
                return null;
            }
        }

        return response;
    } catch (error) {
        console.error('API Request failed:', error);
        showAlert('Network error occurred. Please try again.', 'error');
        return null;
    }
}

async function refreshAccessToken() {
    if (!refreshToken) return false;

    try {
        const response = await fetch('/api/auth/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (response.ok) {
            const data = await response.json();
            setTokens(data.access, refreshToken);
            return true;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
    }
    
    return false;
}

// Authentication Functions
async function login(email, password) {
    showLoading(true);
    
    try {
        const response = await fetch(API_BASE_URL + '/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            setTokens(data.access, data.refresh);
            setCurrentUser(data.user);
            showAlert('Login successful!', 'success');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            const errorMessage = data.email || data.password || data.non_field_errors || 'Login failed';
            showAlert(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage, 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Login failed. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

async function register(userData) {
    showLoading(true);
    
    try {
        const response = await fetch(API_BASE_URL + '/auth/register/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (response.ok) {
            setTokens(data.access, data.refresh);
            setCurrentUser(data.user);
            showAlert('Registration successful!', 'success');
            
            // Redirect to home page
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            // Handle validation errors
            for (const [field, errors] of Object.entries(data)) {
                const errorMessage = Array.isArray(errors) ? errors[0] : errors;
                showAlert(`${field}: ${errorMessage}`, 'error');
            }
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Registration failed. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

async function logout() {
    if (refreshToken) {
        try {
            await makeAPIRequest('/auth/logout/', {
                method: 'POST',
                body: JSON.stringify({ refresh: refreshToken }),
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
    
    clearTokens();
    updateUserInterface();
    showAlert('Logged out successfully!', 'success');
    
    // Redirect to home page
    setTimeout(() => {
        window.location.href = '/';
    }, 1000);
}

// Resource Functions
async function getResources(search = '') {
    const url = search ? `/resources/?search=${encodeURIComponent(search)}` : '/resources/';
    const response = await makeAPIRequest(url);
    
    if (response && response.ok) {
        return await response.json();
    }
    return [];
}

async function createResource(resourceData) {
    showLoading(true);
    
    try {
        const response = await makeAPIRequest('/resources/', {
            method: 'POST',
            body: JSON.stringify(resourceData),
        });

        if (response && response.ok) {
            const data = await response.json();
            showAlert('Resource created successfully!', 'success');
            return data;
        } else if (response) {
            const errorData = await response.json();
            for (const [field, errors] of Object.entries(errorData)) {
                const errorMessage = Array.isArray(errors) ? errors[0] : errors;
                showAlert(`${field}: ${errorMessage}`, 'error');
            }
        }
    } catch (error) {
        console.error('Create resource error:', error);
        showAlert('Failed to create resource. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
    
    return null;
}

async function updateResource(id, resourceData) {
    showLoading(true);
    
    try {
        const response = await makeAPIRequest(`/resources/${id}/`, {
            method: 'PUT',
            body: JSON.stringify(resourceData),
        });

        if (response && response.ok) {
            const data = await response.json();
            showAlert('Resource updated successfully!', 'success');
            return data;
        } else if (response) {
            const errorData = await response.json();
            for (const [field, errors] of Object.entries(errorData)) {
                const errorMessage = Array.isArray(errors) ? errors[0] : errors;
                showAlert(`${field}: ${errorMessage}`, 'error');
            }
        }
    } catch (error) {
        console.error('Update resource error:', error);
        showAlert('Failed to update resource. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
    
    return null;
}

async function deleteResource(id) {
    if (!confirm('Are you sure you want to delete this resource?')) {
        return false;
    }
    
    showLoading(true);
    
    try {
        const response = await makeAPIRequest(`/resources/${id}/`, {
            method: 'DELETE',
        });

        if (response && response.ok) {
            showAlert('Resource deleted successfully!', 'success');
            return true;
        } else if (response) {
            const errorData = await response.json();
            showAlert(errorData.error || 'Failed to delete resource', 'error');
        }
    } catch (error) {
        console.error('Delete resource error:', error);
        showAlert('Failed to delete resource. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
    
    return false;
}

// UI Update Functions
function updateUserInterface() {
    if (currentUser && authToken) {
        // Show user info
        if (userInfo) {
            userInfo.style.display = 'flex';
            userName.textContent = currentUser.first_name || currentUser.username;
            userRole.textContent = currentUser.role.toUpperCase();
        }
        
        // Show logout button, hide login button
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'flex';
    } else {
        // Hide user info
        if (userInfo) userInfo.style.display = 'none';
        
        // Show login button, hide logout button
        if (loginBtn) loginBtn.style.display = 'flex';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

function canPerformAction(action) {
    if (!currentUser) return false;
    
    const role = currentUser.role;
    
    switch (action) {
        case 'read':
            return ['admin', 'staff', 'user'].includes(role);
        case 'create':
        case 'update':
        case 'delete':
            return ['admin', 'staff'].includes(role);
        case 'manage_users':
            return role === 'admin';
        default:
            return false;
    }
}

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

// Form Validation
function validateForm(formData, rules) {
    const errors = {};
    
    for (const [field, rule] of Object.entries(rules)) {
        const value = formData[field];
        
        if (rule.required && (!value || value.trim() === '')) {
            errors[field] = `${field} is required`;
            continue;
        }
        
        if (value && rule.minLength && value.length < rule.minLength) {
            errors[field] = `${field} must be at least ${rule.minLength} characters`;
            continue;
        }
        
        if (value && rule.pattern && !rule.pattern.test(value)) {
            errors[field] = rule.message || `${field} format is invalid`;
            continue;
        }
    }
    
    return errors;
}

function displayFormErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.form-error').forEach(el => el.remove());
    document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
    
    // Display new errors
    for (const [field, message] of Object.entries(errors)) {
        const input = document.querySelector(`[name="${field}"]`);
        if (input) {
            input.classList.add('error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.textContent = message;
            
            input.parentNode.appendChild(errorDiv);
        }
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize tokens and user
    getTokens();
    getCurrentUser();
    
    // Validate current user session
    if (authToken && currentUser) {
        // Verify token is still valid by making a profile request
        try {
            const response = await makeAPIRequest('/auth/profile/');
            if (response && response.ok) {
                const userData = await response.json();
                setCurrentUser(userData);
            } else {
                // Token is invalid, clear everything
                clearTokens();
                updateUserInterface();
            }
        } catch (error) {
            console.error('Token validation failed:', error);
            clearTokens();
            updateUserInterface();
        }
    }
    
    updateUserInterface();
    
    // Hamburger menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const email = formData.get('email');
            const password = formData.get('password');
            
            const errors = validateForm({ email, password }, {
                email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
                password: { required: true, minLength: 1 }
            });
            
            if (Object.keys(errors).length > 0) {
                displayFormErrors(errors);
                return;
            }
            
            login(email, password);
        });
    }
    
    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const userData = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password'),
                password_confirm: formData.get('password_confirm'),
                first_name: formData.get('first_name'),
                last_name: formData.get('last_name'),
                role: formData.get('role') || 'user'
            };
            
            const errors = validateForm(userData, {
                username: { required: true, minLength: 3 },
                email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
                password: { required: true, minLength: 8 },
                password_confirm: { required: true }
            });
            
            if (userData.password !== userData.password_confirm) {
                errors.password_confirm = 'Passwords do not match';
            }
            
            if (Object.keys(errors).length > 0) {
                displayFormErrors(errors);
                return;
            }
            
            register(userData);
        });
    }
    
    // Resource form
    const resourceForm = document.getElementById('resource-form');
    if (resourceForm) {
        resourceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const resourceData = {
                name: formData.get('name'),
                url: formData.get('url'),
                description: formData.get('description')
            };
            
            const errors = validateForm(resourceData, {
                name: { required: true, minLength: 3 },
                url: { required: true, pattern: /^https?:\/\/.+/, message: 'Please enter a valid URL starting with http:// or https://' },
                description: { required: true, minLength: 10 }
            });
            
            if (Object.keys(errors).length > 0) {
                displayFormErrors(errors);
                return;
            }
            
            const resourceId = this.dataset.resourceId;
            
            if (resourceId) {
                updateResource(resourceId, resourceData).then(result => {
                    if (result) {
                        hideModal('resource-modal');
                        loadResources();
                    }
                });
            } else {
                createResource(resourceData).then(result => {
                    if (result) {
                        hideModal('resource-modal');
                        loadResources();
                    }
                });
            }
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                loadResources(this.value);
            }, 300);
        });
    }
    
    // Load resources if on resources page
    if (window.location.pathname === '/resources/') {
        loadResources();
    }
});

// Resource Management Functions (for resources page)
async function loadResources(search = '') {
    if (!canPerformAction('read')) {
        showAlert('You do not have permission to view resources.', 'error');
        return;
    }
    
    showLoading(true);
    
    try {
        const resources = await getResources(search);
        displayResources(resources);
    } catch (error) {
        console.error('Load resources error:', error);
        showAlert('Failed to load resources. Please try again.', 'error');
    } finally {
        showLoading(false);
    }
}

function displayResources(resources) {
    const resourcesGrid = document.getElementById('resources-grid');
    if (!resourcesGrid) return;
    
    if (!resources || resources.length === 0) {
        resourcesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem;">
                <i class="fas fa-box-open" style="font-size: 4rem; color: #cbd5e0; margin-bottom: 1rem;"></i>
                <h3 style="font-size: 1.5rem; font-weight: 600; color: #4a5568; margin-bottom: 0.5rem;">No Resources Found</h3>
                <p style="color: #718096; margin-bottom: 2rem;">Try adjusting your search or add a new resource.</p>
                ${canPerformAction('create') ? `
                    <button onclick="addResource()" class="btn btn-primary">
                        <i class="fas fa-plus"></i>
                        Add Your First Resource
                    </button>
                ` : ''}
            </div>
        `;
        return;
    }
    
    resourcesGrid.innerHTML = resources.map(resource => `
        <div class="resource-card">
            <div class="resource-card-header">
                <h3 class="resource-card-title">${escapeHtml(resource.name)}</h3>
                <a href="${escapeHtml(resource.url)}" target="_blank" class="resource-card-url">
                    <i class="fas fa-external-link-alt"></i>
                    ${escapeHtml(resource.url)}
                </a>
            </div>
            <div class="resource-card-body">
                <p class="resource-card-description">${escapeHtml(resource.description)}</p>
                <div class="resource-card-meta">
                    <span><i class="fas fa-user"></i> ${escapeHtml(resource.created_by)}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(resource.created_at)}</span>
                </div>
                ${canPerformAction('update') || canPerformAction('delete') ? `
                    <div class="resource-card-actions">
                        ${canPerformAction('update') ? `
                            <button class="btn btn-outline" onclick="editResource(${resource.id})">
                                <i class="fas fa-edit"></i>
                                Edit
                            </button>
                        ` : ''}
                        ${canPerformAction('delete') ? `
                            <button class="btn btn-danger" onclick="removeResource(${resource.id})">
                                <i class="fas fa-trash"></i>
                                Delete
                            </button>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Resource action functions (called from HTML)
window.editResource = async function(id) {
    const response = await makeAPIRequest(`/resources/${id}/`);
    if (response && response.ok) {
        const resource = await response.json();
        
        // Populate form
        document.getElementById('resource-name').value = resource.name;
        document.getElementById('resource-url').value = resource.url;
        document.getElementById('resource-description').value = resource.description;
        
        // Set form to edit mode
        const form = document.getElementById('resource-form');
        form.dataset.resourceId = id;
        
        // Update modal title
        document.getElementById('modal-title').textContent = 'Edit Resource';
        
        showModal('resource-modal');
    }
};

window.removeResource = async function(id) {
    const success = await deleteResource(id);
    if (success) {
        loadResources();
    }
};

window.addResource = function() {
    if (!canPerformAction('create')) {
        showAlert('You do not have permission to create resources.', 'error');
        return;
    }
    
    // Clear form
    const form = document.getElementById('resource-form');
    form.reset();
    delete form.dataset.resourceId;
    
    // Update modal title
    document.getElementById('modal-title').textContent = 'Add New Resource';
    
    showModal('resource-modal');
};

// Export functions for global access
window.showModal = showModal;
window.hideModal = hideModal;
window.loadResources = loadResources;