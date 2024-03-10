document.addEventListener('DOMContentLoaded', (event) => {
    const responseForm = document.querySelector('.chatbot');
    const chatHistory = document.getElementById('chatHistory');

    responseForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const questionText = responseForm.question.value;
        appendMessage(questionText, 'user');

        try {
            const res = await fetch('/openai/response', {
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({ question: questionText })
            });
            const data = await res.json();

            if (data && data.response) {
                appendMessage(data.response, 'ai');
            } else {
                console.error("Unexpected response structure:", data);
                appendMessage("There was an error processing your request.", 'ai');
            }
        } catch (error) {
            console.error("Failed to fetch response:", error);
            appendMessage("Failed to send question. Please try again.", 'ai');
        }

        responseForm.question.value = '';
    });

    function appendMessage(message, sender) {
        const messageDiv = document.createElement('div');
        const containerDiv = document.createElement('div');
        const img = document.createElement('img');
        const textDiv = document.createElement('div');

        containerDiv.classList.add(sender + '-container');
        messageDiv.classList.add('chat-message', sender + '-message');
        
        if (sender === 'ai') {
            img.src = 'profile-photo.gif'; 
            img.alt = 'AI Profile';
            img.classList.add('profile-photo');
            containerDiv.appendChild(img);
        }

        textDiv.classList.add('message');
        textDiv.textContent = message;
        
        containerDiv.appendChild(textDiv);
        messageDiv.appendChild(containerDiv);
        
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
});
