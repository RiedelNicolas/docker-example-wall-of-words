// Wall display functions
let previousMessageCount = 0;
let refreshInterval;

/**
 * Initializes the wall page
 */
function initializeWall() {
    // Initial load
    fetchMessages();
    
    // Auto-refresh every 2 seconds
    refreshInterval = setInterval(fetchMessages, 2000);
    
    // Add visibility change listener to refresh when tab becomes active
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * Fetches messages from the server and updates the wall
 */
async function fetchMessages() {
    const status = document.getElementById('status');
    
    try {
        updateStatus('Actualizando...', 'updating');
        
        // Use configuration from environment variables
        const apiUrl = window.APP_CONFIG?.API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/messages`);
        const messages = await response.json();
        
        if (messages.length === 0) {
            displayEmptyState();
            updateStatus('Sin mensajes - esperando publicaciones...', 'normal');
            return;
        }
        
        displayMessages(messages);
        updateMessageCount(messages.length);
        
    } catch (error) {
        console.error('Error fetching messages:', error);
        displayErrorState();
        updateStatus('Error de conexión - reintentando...', 'normal');
    }
}

/**
 * Updates the status display
 * @param {string} text - The status text to display
 * @param {string} type - The status type ('updating', 'normal')
 */
function updateStatus(text, type) {
    const status = document.getElementById('status');
    if (status) {
        status.textContent = text;
        status.className = type === 'updating' ? 'status updating' : 'status';
    }
}

/**
 * Displays the empty state when no messages exist
 */
function displayEmptyState() {
    const wall = document.getElementById('wall');
    if (wall) {
        wall.innerHTML = `
            <div class="empty-state">
                <h2>📝 ¡Aún no hay mensajes!</h2>
                <p>Sé el primero en publicar un mensaje en el muro del aula.</p>
            </div>
        `;
    }
}

/**
 * Displays the error state when connection fails
 */
function displayErrorState() {
    const wall = document.getElementById('wall');
    if (wall) {
        wall.innerHTML = `
            <div class="empty-state">
                <h2>⚠️ Problema de Conexión</h2>
                <p>No se puede conectar al servidor. Reintentando automáticamente...</p>
            </div>
        `;
    }
}

/**
 * Displays messages on the wall
 * @param {Array<string>} messages - Array of message strings
 */
function displayMessages(messages) {
    const wall = document.getElementById('wall');
    if (!wall) return;
    
    // Clear wall
    wall.innerHTML = '';
    
    const hasNewMessages = messages.length > previousMessageCount;
    
    messages.forEach((msg, index) => {
        const messageElement = createMessageElement(msg, hasNewMessages && index >= previousMessageCount);
        wall.appendChild(messageElement);
    });
    
    previousMessageCount = messages.length;
}

/**
 * Creates a message element
 * @param {string} message - The message text
 * @param {boolean} isNew - Whether this is a new message
 * @returns {HTMLDivElement} The message element
 */
function createMessageElement(message, isNew) {
    const div = document.createElement('div');
    div.className = 'message';
    
    // Add animation for new messages
    if (isNew) {
        div.classList.add('new');
    }
    
    div.textContent = message;
    return div;
}

/**
 * Updates the message count in the status
 * @param {number} count - The number of messages
 */
function updateMessageCount(count) {
    const messageText = count === 1 ? 'mensaje' : 'mensajes';
    updateStatus(`${count} ${messageText} • Actualizado ahora mismo`, 'normal');
}

/**
 * Handles visibility change events to refresh when tab becomes active
 */
function handleVisibilityChange() {
    if (!document.hidden) {
        fetchMessages();
    }
}

/**
 * Cleans up intervals when page is unloaded
 */
function cleanup() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeWall);

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);
