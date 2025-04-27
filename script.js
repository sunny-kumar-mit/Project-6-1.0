// User database (in a real app, this would be on a server)
let users = JSON.parse(localStorage.getItem('solarFridgeUsers')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

// Initialize forms if they exist
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const ipAddress = document.getElementById('ip-address').value;
    
    // Validate IP address format
    if (!isValidIP(ipAddress)) {
        showError(loginError, "Please enter a valid IP address");
        return;
    }
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Store current user and IP in localStorage
        currentUser = {
            username: user.username,
            email: user.email,
            ipAddress: ipAddress
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    } else {
        showError(loginError, "Invalid username or password");
    }
}

// Handle registration
function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    // Validate inputs
    if (password !== confirmPassword) {
        showError(registerError, "Passwords don't match");
        return;
    }
    
    if (users.some(u => u.username === username)) {
        showError(registerError, "Username already exists");
        return;
    }
    
    if (users.some(u => u.email === email)) {
        showError(registerError, "Email already registered");
        return;
    }
    
    // Add new user
    users.push({
        username,
        email,
        password
    });
    
    // Save to localStorage
    localStorage.setItem('solarFridgeUsers', JSON.stringify(users));
    
    // Show success and redirect to login
    showError(registerError, "Registration successful! Redirecting...", "success");
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Helper function to show error messages
function showError(element, message, type = "error") {
    element.textContent = message;
    element.style.color = type === "error" ? "var(--danger)" : "var(--success)";
    setTimeout(() => {
        element.textContent = '';
    }, 5000);
}

// Validate IP address
function isValidIP(ip) {
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(ip);
}

// Check if user is logged in when accessing dashboard
function checkAuth() {
    if (window.location.pathname.includes('dashboard.html')) {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            window.location.href = 'index.html';
        }
    }
}

// Initialize auth check
checkAuth();