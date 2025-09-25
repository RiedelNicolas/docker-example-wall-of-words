// Form handling functions for index page
let originalButtonText = '';

/**
 * Initializes the message form with event listeners
 */
function initializeForm() {
    const form = document.getElementById('messageForm');
    const input = document.getElementById('messageInput');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        originalButtonText = document.querySelector('input[type="submit"]').value;
    }
    
    if (input) {
        input.addEventListener('keypress', handleKeyPress);
        // Auto-focus on input when page loads
        input.focus();
    }
}

/**
 * Validates if the message contains only one word with at least 2 letters
 * @param {string} message - The message to validate
 * @returns {object} - Validation result with isValid and errorMessage
 */
function validateMessage(message) {
    // Check if message contains only one word (no spaces)
    if (message.includes(' ')) {
        return {
            isValid: false,
            errorMessage: '❌ Solo se permite una palabra'
        };
    }
    
    // Check if message has at least 2 letters
    if (message.length < 2) {
        return {
            isValid: false,
            errorMessage: '❌ La palabra debe tener al menos 2 letras'
        };
    }
    
    return {
        isValid: true,
        errorMessage: ''
    };
}

/**
 * Shows error message to the user
 * @param {string} errorMessage - The error message to display
 * @param {HTMLInputElement} submitBtn - The submit button element
 */
function showErrorMessage(errorMessage, submitBtn) {
    submitBtn.value = errorMessage;
    submitBtn.style.backgroundColor = '#ff4757';
    
    // Reset button after 3 seconds
    setTimeout(() => {
        submitBtn.value = originalButtonText;
        submitBtn.style.backgroundColor = '';
    }, 3000);
}

/**
 * Handles form submission
 * @param {Event} event - The form submit event
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const input = document.getElementById('messageInput');
    const submitBtn = document.querySelector('input[type="submit"]');
    const word = input.value.trim();

    if (word) {
        // Validate the word
        const validation = validateMessage(word);
        
        if (validation.isValid) {
            await postMessage(word, input, submitBtn);
        } else {
            showErrorMessage(validation.errorMessage, submitBtn);
        }
    }
}

/**
 * Posts a word to the server
 * @param {string} word - The word to post
 * @param {HTMLInputElement} input - The input element
 * @param {HTMLInputElement} submitBtn - The submit button element
 */
async function postMessage(word, input, submitBtn) {
    try {
        // Show loading state
        setLoadingState(submitBtn, input, true);
        
        // Use configuration from environment variables
        const apiUrl = window.APP_CONFIG?.API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/words`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ word: word })
        });

        if (response.ok) {
            handlePostSuccess(input, submitBtn);
        } else {
            throw new Error('Failed to post word');
        }
    } catch (error) {
        console.error('Error posting word:', error);
        handlePostError(submitBtn);
    } finally {
        // Re-enable form after a delay
        setTimeout(() => {
            setLoadingState(submitBtn, input, false);
        }, 1500);
    }
}

/**
 * Sets the loading state of the form
 * @param {HTMLInputElement} submitBtn - The submit button
 * @param {HTMLInputElement} input - The input field
 * @param {boolean} isLoading - Whether to show loading state
 */
function setLoadingState(submitBtn, input, isLoading) {
    if (isLoading) {
        submitBtn.value = '📤 Publicando...';
        submitBtn.disabled = true;
        input.disabled = true;
    } else {
        submitBtn.value = originalButtonText;
        submitBtn.disabled = false;
        input.disabled = false;
        input.focus();
    }
}

/**
 * Handles successful post
 * @param {HTMLInputElement} input - The input field
 * @param {HTMLInputElement} submitBtn - The submit button
 */
function handlePostSuccess(input, submitBtn) {
    input.value = '';
    submitBtn.value = '✅ ¡Publicado!';
}

/**
 * Handles post error
 * @param {HTMLInputElement} submitBtn - The submit button
 */
function handlePostError(submitBtn) {
    submitBtn.value = '❌ Error - Inténtalo de nuevo';
}

/**
 * Handles key press events
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('messageForm').dispatchEvent(new Event('submit'));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeForm);
