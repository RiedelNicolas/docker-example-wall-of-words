// Wall display functions
let previousWordCount = 0;

/**
 * Initializes the wall page
 */
function initializeWall() {
    // Initial load
    fetchWordCounts();
    
    // Create refresh button
    createRefreshButton();
    
    // Add visibility change listener to refresh when tab becomes active
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * Fetches word counts from the server and updates the wall
 */
async function fetchWordCounts() {
    const status = document.getElementById('status');
    
    try {
        updateStatus('Actualizando...', 'updating');
        
        // Use configuration from environment variables
        const apiUrl = window.APP_CONFIG?.API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiUrl}/word-counts`);
        const wordCounts = await response.json();
        
        if (Object.keys(wordCounts).length === 0) {
            displayEmptyState();
            updateStatus('Sin palabras - esperando publicaciones...', 'normal');
            return;
        }
        
        displayWordCounts(wordCounts);
        updateWordCountStatus(wordCounts);
        
    } catch (error) {
        console.error('Error fetching word counts:', error);
        displayErrorState();
        updateStatus('Error de conexión - reintentando...', 'normal');
    }
}

/**
 * Creates a floating refresh button
 */
function createRefreshButton() {
    const refreshBtn = document.createElement('button');
    refreshBtn.id = 'refreshBtn';
    refreshBtn.className = 'refresh-btn';
    refreshBtn.innerHTML = '🔄 Refrescar';
    refreshBtn.title = 'Refrescar palabras';
    
    // Add click handler
    refreshBtn.addEventListener('click', handleRefreshClick);
    
    // Append to body
    document.body.appendChild(refreshBtn);
}

/**
 * Handles refresh button click
 */
async function handleRefreshClick() {
    const refreshBtn = document.getElementById('refreshBtn');
    
    // Add loading state
    refreshBtn.disabled = true;
    refreshBtn.innerHTML = '🔄 Actualizando...';
    refreshBtn.classList.add('loading');
    
    try {
        await fetchWordCounts();
    } finally {
        // Reset button state
        setTimeout(() => {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '🔄 Refrescar';
            refreshBtn.classList.remove('loading');
        }, 500);
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
 * Displays the empty state when no words exist
 */
function displayEmptyState() {
    const wall = document.getElementById('wall');
    if (wall) {
        wall.innerHTML = `
            <div class="empty-state">
                <h2>📝 ¡Aún no hay palabras!</h2>
                <p>Sé el primero en publicar una palabra en el muro del aula.</p>
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
 * Displays word counts on the wall, sorted by frequency (descending)
 * @param {Object} wordCounts - Object with words as keys and counts as values
 */
function displayWordCounts(wordCounts) {
    const wall = document.getElementById('wall');
    if (!wall) return;
    
    // Clear wall
    wall.innerHTML = '';
    
    // Sort words by count (descending) and then alphabetically for ties
    const sortedWords = Object.entries(wordCounts)
        .sort(([wordA, countA], [wordB, countB]) => {
            if (countB !== countA) {
                return countB - countA; // Sort by count descending
            }
            return wordA.localeCompare(wordB); // Sort alphabetically for ties
        });
    
    const currentTotalWords = Object.keys(wordCounts).length;
    const hasNewWords = currentTotalWords > previousWordCount;
    
    sortedWords.forEach(([word, count], index) => {
        const wordElement = createWordElement(word, count, hasNewWords && index < (currentTotalWords - previousWordCount));
        wall.appendChild(wordElement);
    });
    
    previousWordCount = currentTotalWords;
}

/**
 * Creates a word element with count
 * @param {string} word - The word text
 * @param {number} count - The word count
 * @param {boolean} isNew - Whether this is a new word
 * @returns {HTMLDivElement} The word element
 */
function createWordElement(word, count, isNew) {
    const div = document.createElement('div');
    div.className = 'word-item';
    
    // Add animation for new words
    if (isNew) {
        div.classList.add('new');
    }
    
    // Capitalize the word and show count
    const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    div.innerHTML = `
        <span class="word">${capitalizedWord}</span>
        <span class="count">(${count})</span>
    `;
    
    return div;
}

/**
 * Updates the word count status
 * @param {Object} wordCounts - The word counts object
 */
function updateWordCountStatus(wordCounts) {
    const uniqueWords = Object.keys(wordCounts).length;
    const totalOccurrences = Object.values(wordCounts).reduce((sum, count) => sum + count, 0);
    
    const wordText = uniqueWords === 1 ? 'palabra única' : 'palabras únicas';
    const occurrenceText = totalOccurrences === 1 ? 'ocurrencia' : 'ocurrencias';
    
    updateStatus(`${uniqueWords} ${wordText} • ${totalOccurrences} ${occurrenceText} • Actualizado ahora mismo`, 'normal');
}

/**
 * Handles visibility change events to refresh when tab becomes active
 */
function handleVisibilityChange() {
    if (!document.hidden) {
        fetchWordCounts();
    }
}

/**
 * Cleans up when page is unloaded
 */
function cleanup() {
    // Remove refresh button if it exists
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.remove();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeWall);

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);
