// script.js
// Thought process: Significantly expanded the JavaScript. Added localStorage for chat history and mood data persistence. Integrated Chart.js for mood visualization as a line chart showing mood over time. Implemented a simple keyword-based sentiment analysis to adjust AI responses. Expanded the getAIResponse with more keywords and sentiment-influenced replies. Added event listeners for logging moods, clearing data, and loading history on start. Used Date for timestamps in moods. Added speech synthesis for AI responses if supported (Web Speech API). Comments explain each enhancement.

document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const clearChatBtn = document.getElementById('clear-chat-btn');
    const moodSelect = document.getElementById('mood-select');
    const logMoodBtn = document.getElementById('log-mood-btn');
    const clearMoodsBtn = document.getElementById('clear-moods-btn');
    const moodChartCanvas = document.getElementById('mood-chart');

    let moodChart;
    const STORAGE_KEY_CHAT = 'psychoAI_chat';
    const STORAGE_KEY_MOODS = 'psychoAI_moods';

    // Function to add a message to the chat display and localStorage
    // Thought process: Enhanced to save chat history. Also uses SpeechSynthesis to read AI messages aloud for accessibility and immersion.
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        if (sender === 'user') {
            messageDiv.classList.add('user-message');
        } else {
            messageDiv.classList.add('ai-message');
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                speechSynthesis.speak(utterance);
            }
        }
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        saveChatHistory();
    }

    // Function to save chat history to localStorage
    // Thought process: Serializes the chat messages as array of objects for persistence across sessions.
    function saveChatHistory() {
        const messages = Array.from(chatMessages.children).map(div => ({
            text: div.textContent,
            sender: div.classList.contains('user-message') ? 'user' : 'ai'
        }));
        localStorage.setItem(STORAGE_KEY_CHAT, JSON.stringify(messages));
    }

    // Function to load chat history from localStorage
    // Thought process: Loads and appends saved messages on page load to continue sessions.
    function loadChatHistory() {
        const saved = localStorage.getItem(STORAGE_KEY_CHAT);
        if (saved) {
            const messages = JSON.parse(saved);
            messages.forEach(msg => addMessage(msg.text, msg.sender));
        }
    }

    // Function for simple sentiment analysis
    // Thought process: Basic keyword-based sentiment scorer. Positive words increase score, negative decrease. Used to modify AI responses for empathy.
    function getSentimentScore(input) {
        const lowerInput = input.toLowerCase();
        const positiveWords = ['happy', 'good', 'great', 'awesome', 'positive', 'joy', 'love'];
        const negativeWords = ['sad', 'bad', 'terrible', 'depressed', 'anxious', 'hate', 'angry'];
        let score = 0;
        positiveWords.forEach(word => { if (lowerInput.includes(word)) score += 1; });
        negativeWords.forEach(word => { if (lowerInput.includes(word)) score -= 1; });
        return score;
    }

    // Function to generate AI response based on user input and sentiment
    // Thought process: Expanded with more keywords, sentiment adjustment (e.g., more supportive if negative), and suggestions based on mood. Encourages using mood tracker.
    function getAIResponse(input) {
        const lowerInput = input.toLowerCase();
        const sentiment = getSentimentScore(input);
        let response = "I appreciate you sharing that. How does that make you feel?";

        if (lowerInput.includes('anxious') || lowerInput.includes('anxiety')) {
            response = "It sounds like you're feeling anxious. Try some deep breathing. Can you tell me more?";
        } else if (lowerInput.includes('sad') || lowerInput.includes('depressed')) {
            response = "I'm sorry to hear you're feeling sad. Remember, it's okay to seek help. What's been going on?";
        } else if (lowerInput.includes('stress') || lowerInput.includes('stressed')) {
            response = "Stress can be tough. Have you tried journaling or exercise? Share more if you'd like.";
        } else if (lowerInput.includes('happy') || lowerInput.includes('good')) {
            response = "That's wonderful! What made you feel happy today?";
        } else if (lowerInput.includes('help')) {
            response = "I'm here to support you. Would you like tips on mindfulness or CBT?";
        } else if (lowerInput.includes('mood')) {
            response = "Tracking your mood can help. Use the mood tracker below to log how you're feeling.";
        }

        if (sentiment < 0) {
            response += " It seems like things are tough right now. You're not alone.";
        } else if (sentiment > 0) {
            response += " Keep up the positive vibes!";
        }

        return response;
    }

    // Function to handle sending a message
    // Thought process: Unchanged but calls enhanced addMessage.
    function sendMessage() {
        const text = userInput.value.trim();
        if (text === '') return;
        addMessage(text, 'user');
        const aiResponse = getAIResponse(text);
        addMessage(aiResponse, 'ai');
        userInput.value = '';
    }

    // Function to clear chat
    // Thought process: Clears DOM and localStorage for chat.
    function clearChat() {
        chatMessages.innerHTML = '';
        localStorage.removeItem(STORAGE_KEY_CHAT);
    }

    // Function to log mood
    // Thought process: Saves mood with timestamp to localStorage, updates chart.
    function logMood() {
        const mood = moodSelect.value;
        if (!mood) return;
        const moods = loadMoods();
        moods.push({ date: new Date().toISOString(), mood: parseInt(mood) });
        localStorage.setItem(STORAGE_KEY_MOODS, JSON.stringify(moods));
        updateMoodChart();
        moodSelect.value = '';
        addMessage(`Mood logged: ${mood}`, 'user');
        addMessage("Great job tracking your mood! How does that reflect your day?", 'ai');
    }

    // Function to load moods from localStorage
    // Thought process: Returns array of mood objects.
    function loadMoods() {
        const saved = localStorage.getItem(STORAGE_KEY_MOODS);
        return saved ? JSON.parse(saved) : [];
    }

    // Function to clear moods
    // Thought process: Clears localStorage and updates chart.
    function clearMoods() {
        localStorage.removeItem(STORAGE_KEY_MOODS);
        updateMoodChart();
    }

    // Function to update mood chart
    // Thought process: Uses Chart.js to create/update a line chart with moods over time. Labels with dates.
    function updateMoodChart() {
        const moods = loadMoods();
        const labels = moods.map(m => new Date(m.date).toLocaleDateString());
        const data = moods.map(m => m.mood);

        if (moodChart) moodChart.destroy();

        moodChart = new Chart(moodChartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Mood Over Time',
                    data: data,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 1,
                        max: 5
                    }
                }
            }
        });
    }

    // Event listeners
    // Thought process: Added listeners for new buttons and Enter key.
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    clearChatBtn.addEventListener('click', clearChat);
    logMoodBtn.addEventListener('click', logMood);
    clearMoodsBtn.addEventListener('click', clearMoods);

    // Initial setup
    // Thought process: Load history, update chart, greet user.
    loadChatHistory();
    updateMoodChart();
    if (chatMessages.children.length === 0) {
        addMessage("Hello! I'm your enhanced Psychotherapy AI. How are you feeling today? Try logging your mood below.", 'ai');
    }
});