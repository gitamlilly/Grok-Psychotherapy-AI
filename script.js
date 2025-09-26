// script.js
// Thought process: This JavaScript file implements the core functionality of the Psychotherapy AI. It's a simple rule-based chatbot that responds empathetically based on keyword matching in user input. We're not using any external libraries or ML models to keep it lightweight and runnable without dependencies. The AI logic is in the getAIResponse function, which checks for common therapy-related keywords and provides predefined responses. This simulates basic active listening and reflection techniques used in psychotherapy. Event listeners handle user input via button click or Enter key. Messages are appended to the DOM dynamically, and the chat scrolls to the bottom after each addition. For a more advanced AI, one could integrate with APIs like OpenAI, but that would require a backend (e.g., Node.js) and API keys, which we're avoiding for pure client-side execution. Comments explain each function's purpose.

document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // Function to add a message to the chat display
    // Thought process: This creates a div for each message, styles it based on sender, and appends it. It also scrolls the chat to the latest message for better UX.
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        if (sender === 'user') {
            messageDiv.classList.add('user-message');
        } else {
            messageDiv.classList.add('ai-message');
        }
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to generate AI response based on user input
    // Thought process: Simple keyword-based response system. We lowercase the input for case-insensitive matching. Responses are designed to be empathetic, non-judgmental, and encouraging further sharing, mimicking basic CBT or Rogerian therapy elements. If no match, a default reflective response is given. This is not real AI but sufficient for demonstration.
    function getAIResponse(input) {
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes('anxious') || lowerInput.includes('anxiety')) {
            return "It sounds like you're feeling anxious. Can you tell me more about what's causing that?";
        } else if (lowerInput.includes('sad') || lowerInput.includes('depressed')) {
            return "I'm sorry to hear you're feeling sad. What's been on your mind lately?";
        } else if (lowerInput.includes('stress') || lowerInput.includes('stressed')) {
            return "Stress can be overwhelming. What strategies have you tried to manage it?";
        } else if (lowerInput.includes('happy') || lowerInput.includes('good')) {
            return "That's great to hear! What made you feel that way?";
        } else if (lowerInput.includes('help')) {
            return "I'm here to listen. How can I support you today?";
        } else {
            return "I appreciate you sharing that. How does that make you feel?";
        }
    }

    // Function to handle sending a message
    // Thought process: Gets user input, adds it to chat if not empty, generates AI response, adds that, then clears input. Prevents empty messages.
    function sendMessage() {
        const text = userInput.value.trim();
        if (text === '') return;
        addMessage(text, 'user');
        const aiResponse = getAIResponse(text);
        addMessage(aiResponse, 'ai');
        userInput.value = '';
    }

    // Event listeners for send button and Enter key
    // Thought process: Allows sending via button or keyboard for accessibility. Focus remains on input after send.
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Initial greeting from AI
    // Thought process: Starts the conversation to make the user feel welcomed upon loading.
    addMessage("Hello! I'm your Psychotherapy AI. How are you feeling today?", 'ai');
});