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
 * Handles form submission
 * @param {Event} event - The form submit event
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const input = document.getElementById('messageInput');
    const submitBtn = document.querySelector('input[type="submit"]');
    const message = input.value.trim();

    if (message) {
        await postMessage(message, input, submitBtn);
    }
}

/**
 * Posts a message to the server
 * @param {string} message - The message to post
 * @param {HTMLInputElement} input - The input element
 * @param {HTMLInputElement} submitBtn - The submit button element
 */
async function postMessage(message, input, submitBtn) {
    try {
        // Show loading state
        setLoadingState(submitBtn, input, true);
        
        // IMPORTANT: In a real classroom, replace 'localhost' with the teacher's actual local IP address.
        const response = await fetch('http://localhost:3000/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        if (response.ok) {
            handlePostSuccess(input, submitBtn);
        } else {
            throw new Error('Failed to post message');
        }
    } catch (error) {
        console.error('Error posting message:', error);
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
