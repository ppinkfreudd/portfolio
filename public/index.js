document.addEventListener('DOMContentLoaded', (event) => {
    // forms
    const responseForm = document.querySelector('.chatbot'); // Targeting form with class 'chatbot'

    // output elements
    const responseOutput = document.querySelector('.response'); // Targeting the 'response' class div

    // description and tags
    responseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/openai/response', {
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({ question: responseForm.question.value }) // Assuming 'question' is the field to be sent
            });
            const data = await res.json();

            console.log(data);

            // Update responseOutput with the formatted response from your data
            if (data && data.response) {
                // Replace newlines with HTML line breaks for display
                const formattedResponse = data.response.replace(/\n/g, '<br>');
                responseOutput.innerHTML = formattedResponse; // Use innerHTML to parse the HTML tags
            } else {
                // Handle cases where the expected content isn't present
                console.error("Unexpected response structure:", data);
                responseOutput.innerHTML = "There was an error processing your request.";
            }
        } catch (error) {
            console.error("Failed to fetch response:", error);
            responseOutput.innerHTML = "Failed to send question. Please try again.";
        }
    });
});
