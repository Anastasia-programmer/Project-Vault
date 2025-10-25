// Email validation
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!email) {
        return { isValid: false, message: "Email is required" };
    }
    
    if (email.length > 254) {
        return { isValid: false, message: "Email address is too long" };
    }
    
    if (email.split('@').length !== 2) {
        return { isValid: false, message: "Email must contain exactly one @ symbol" };
    }
    
    const [localPart, domain] = email.split('@');
    if (localPart.length > 64) {
        return { isValid: false, message: "Email local part is too long" };
    }
    
    if (!domain || !domain.includes('.')) {
        return { isValid: false, message: "Please enter a valid email address" };
    }
    
    if (!emailPattern.test(email)) {
        return { isValid: false, message: "Please enter a valid email address" };
    }
    
    return { isValid: true, message: "Valid email address ✓" };
}

function updateEmailValidation() {
    const emailInput = document.getElementById('email');
    const emailIndicator = document.getElementById('email-validation');
    const email = emailInput.value;
    
    if (!email) {
        emailIndicator.style.display = 'none';
        return;
    }
    
    const { isValid, message } = validateEmail(email);
    emailIndicator.style.display = 'block';
    
    // Remove existing validation classes
    emailIndicator.classList.remove('strength-weak', 'strength-strong');
    
    // Add appropriate validation class and message
    if (isValid) {
        emailIndicator.className = 'email-validation strength-strong';
        emailIndicator.textContent = message;
    } else {
        emailIndicator.className = 'email-validation strength-weak';
        emailIndicator.textContent = message;
    }
}

// Password strength validation
function checkPasswordStrength(password) {
    let score = 0;
    let feedback = [];
    
    // Length check
    if (password.length >= 8) {
        score += 1;
    } else {
        feedback.push("At least 8 characters");
    }
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
        score += 1;
    } else {
        feedback.push("One uppercase letter");
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
        score += 1;
    } else {
        feedback.push("One lowercase letter");
    }
    
    // Digit check
    if (/\d/.test(password)) {
        score += 1;
    } else {
        feedback.push("One number");
    }
    
    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        score += 1;
    } else {
        feedback.push("One special character");
    }
    
    return { score, feedback };
}

function updatePasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthIndicator = document.getElementById('password-strength');
    const password = passwordInput.value;
    
    if (!password) {
        strengthIndicator.style.display = 'none';
        return;
    }
    
    const { score, feedback } = checkPasswordStrength(password);
    strengthIndicator.style.display = 'block';
    
    // Remove existing strength classes
    strengthIndicator.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
    
    // Add appropriate strength class and message
    if (score < 3) {
        strengthIndicator.className = 'password-strength strength-weak';
        strengthIndicator.textContent = `Weak password. Missing: ${feedback.join(', ')}`;
    } else if (score < 5) {
        strengthIndicator.className = 'password-strength strength-medium';
        strengthIndicator.textContent = `Medium strength. Missing: ${feedback.join(', ')}`;
    } else {
        strengthIndicator.className = 'password-strength strength-strong';
        strengthIndicator.textContent = 'Strong password! ✓';
    }
}

function validatePasswordsMatch() {
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;
    const matchIndicator = document.getElementById('password-match');
    
    if (!password2) {
        matchIndicator.style.display = 'none';
        return;
    }
    
    matchIndicator.style.display = 'block';
    
    if (password === password2) {
        matchIndicator.className = 'password-match strength-strong';
        matchIndicator.textContent = 'Passwords match ✓';
    } else {
        matchIndicator.className = 'password-match strength-weak';
        matchIndicator.textContent = 'Passwords do not match';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const password2Input = document.getElementById('password2');
    const emailInput = document.getElementById('email');
    
    if (emailInput) {
        emailInput.addEventListener('input', updateEmailValidation);
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }
    
    if (password2Input) {
        password2Input.addEventListener('input', validatePasswordsMatch);
    }
    
    // Also check on form submission
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(e) {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Validate email
            const { isValid: emailValid } = validateEmail(email);
            if (!emailValid) {
                e.preventDefault();
                alert('Please enter a valid email address before submitting.');
                return false;
            }
            
            // Validate password strength
            const { score } = checkPasswordStrength(password);
            if (score < 5) {
                e.preventDefault();
                alert('Please ensure your password meets all strength requirements before submitting.');
                return false;
            }
        });
    }
});
