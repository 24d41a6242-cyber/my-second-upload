// Get HTML elements
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");

const feedbackText = document.getElementById("feedbackText");

const generateBtn = document.getElementById("generateBtn");
const generatedPassword = document.getElementById("generatedPassword");
const copyBtn = document.getElementById("copyBtn");

const clearBtn = document.getElementById("clearBtn");

// Common passwords
const commonPasswords = [
    "password",
    "password123",
    "123456",
    "12345678",
    "123456789",
    "1234567890",
    "qwerty",
    "qwerty123",
    "admin",
    "admin123",
    "welcome",
    "welcome123",
    "letmein",
    "iloveyou",
    "abc123",
    "football",
    "monkey",
    "dragon",
    "passw0rd"
];

// Password input event
passwordInput.addEventListener("input", function () {

    const password = passwordInput.value;

    analyzePassword(password);

});

// Show / Hide password
togglePassword.addEventListener("click", function () {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";
        togglePassword.textContent = "Hide";

    } else {

        passwordInput.type = "password";
        togglePassword.textContent = "Show";

    }

});


// Analyze password
function analyzePassword(password) {

    // Empty password
    if (password.length === 0) {

        resetAnalyzer();

        return;
    }

    // Requirements
    const hasLength = password.length >= 8;
    const hasLongLength = password.length >= 12;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    const isCommon = commonPasswords.includes(
        password.toLowerCase()
    );

    // Update requirements
    updateRequirement("length", hasLength);
    updateRequirement("longLength", hasLongLength);
    updateRequirement("uppercase", hasUppercase);
    updateRequirement("lowercase", hasLowercase);
    updateRequirement("number", hasNumber);
    updateRequirement("special", hasSpecial);
    updateRequirement("common", !isCommon);

    // Calculate score
    let score = 0;

    if (hasLength) {
        score++;
    }

    if (hasLongLength) {
        score++;
    }

    if (hasUppercase) {
        score++;
    }

    if (hasLowercase) {
        score++;
    }

    if (hasNumber) {
        score++;
    }

    if (hasSpecial) {
        score++;
    }

    if (!isCommon) {
        score++;
    }

    // Extra score for very long passwords
    if (password.length >= 16) {
        score++;
    }

    // Calculate strength
    let strength;
    let percentage;

    if (isCommon) {

        strength = "Very Weak";
        percentage = 15;

    } else if (score <= 2) {

        strength = "Weak";
        percentage = 30;

    } else if (score <= 4) {

        strength = "Medium";
        percentage = 55;

    } else if (score <= 6) {

        strength = "Strong";
        percentage = 80;

    } else {

        strength = "Very Strong";
        percentage = 100;

    }

    // Update strength
    strengthText.textContent = strength;
    strengthBar.style.width = percentage + "%";

    // Update feedback
    generateFeedback(
        password,
        strength,
        isCommon,
        hasLength,
        hasLongLength,
        hasUppercase,
        hasLowercase,
        hasNumber,
        hasSpecial
    );
}


// Update individual requirement
function updateRequirement(id, valid) {

    const element = document.getElementById(id);
    const icon = element.querySelector(".icon");

    if (valid) {

        element.classList.add("valid");
        icon.textContent = "✓";

    } else {

        element.classList.remove("valid");
        icon.textContent = "✗";

    }
}


// Generate feedback
function generateFeedback(
    password,
    strength,
    isCommon,
    hasLength,
    hasLongLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial
) {

    let messages = [];

    if (isCommon) {
        messages.push(
            "This is a commonly used password. Choose a unique password."
        );
    }

    if (!hasLength) {
        messages.push(
            "Use at least 8 characters."
        );
    }

    if (!hasLongLength) {
        messages.push(
            "For better security, use at least 12 characters."
        );
    }

    if (!hasUppercase) {
        messages.push(
            "Add uppercase letters."
        );
    }

    if (!hasLowercase) {
        messages.push(
            "Add lowercase letters."
        );
    }

    if (!hasNumber) {
        messages.push(
            "Add numbers."
        );
    }

    if (!hasSpecial) {
        messages.push(
            "Add special characters."
        );
    }

    if (messages.length === 0) {

        feedbackText.textContent =
            "Excellent! Your password satisfies the main strength requirements.";

    } else {

        feedbackText.textContent =
            messages.join(" ");

    }
}


// Generate secure password
generateBtn.addEventListener("click", function () {

    const password = generateSecurePassword(16);

    generatedPassword.value = password;

});


// Secure password generator
function generateSecurePassword(length) {

    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*()_+-=[]{}";

    const allCharacters =
        uppercase +
        lowercase +
        numbers +
        special;

    let password = "";

    // Guarantee every character category
    password += randomCharacter(uppercase);
    password += randomCharacter(lowercase);
    password += randomCharacter(numbers);
    password += randomCharacter(special);

    // Fill remaining characters
    for (let i = 4; i < length; i++) {

        password += randomCharacter(allCharacters);

    }

    // Shuffle password
    return shuffleString(password);
}


// Get random character
function randomCharacter(characters) {

    // crypto.getRandomValues gives better randomness
    const array = new Uint32Array(1);

    window.crypto.getRandomValues(array);

    return characters[array[0] % characters.length];
}


// Shuffle string
function shuffleString(string) {

    const array = string.split("");

    for (let i = array.length - 1; i > 0; i--) {

        const randomArray = new Uint32Array(1);

        window.crypto.getRandomValues(randomArray);

        const j = randomArray[0] % (i + 1);

        [array[i], array[j]] =
            [array[j], array[i]];
    }

    return array.join("");
}


// Copy generated password
copyBtn.addEventListener("click", async function () {

    const password = generatedPassword.value;

    if (password === "") {

        alert("Generate a password first.");

        return;
    }

    try {

        await navigator.clipboard.writeText(password);

        copyBtn.textContent = "Copied!";

        setTimeout(function () {

            copyBtn.textContent = "Copy";

        }, 1500);

    } catch (error) {

        alert("Unable to copy password.");

    }

});


// Clear button
clearBtn.addEventListener("click", function () {

    passwordInput.value = "";
    generatedPassword.value = "";

    passwordInput.type = "password";
    togglePassword.textContent = "Show";

    resetAnalyzer();

});


// Reset analyzer
function resetAnalyzer() {

    strengthText.textContent = "No Password";
    strengthBar.style.width = "0%";

    feedbackText.textContent =
        "Enter a password to see the security analysis.";

    const requirementIds = [
        "length",
        "longLength",
        "uppercase",
        "lowercase",
        "number",
        "special",
        "common"
    ];

    requirementIds.forEach(function (id) {

        const element = document.getElementById(id);

        element.classList.remove("valid");

        element.querySelector(".icon").textContent = "✗";

    });

}