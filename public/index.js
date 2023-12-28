// Wait for the DOM to load before running the script
document.addEventListener('DOMContentLoaded', (event) => {
    // forms
    const responseForm = document.querySelector('.chatbot'); // Targeting form with class 'chatbot'
  
    // output elements
    const responseOutput = document.querySelector('.response p'); // Targeting the <p> inside the 'response' class div
  
    // description and tags
    responseForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      try {
        const res = await fetch('/openai/response', {
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({ question: responseForm.question.value }), // Assuming 'question' is the field to be sent
          method: 'POST'
        });
        const data = await res.json();
  
        console.log(data);
  
        // Update responseOutput with the response from your data
        if (data && data.response) {
          responseOutput.textContent = data.response;
        } else {
          // Handle cases where the expected content isn't present
          console.error("Unexpected response structure:", data);
          responseOutput.textContent = "There was an error processing your request.";
        }
      } catch (error) {
        console.error("Failed to fetch response:", error);
        responseOutput.textContent = "Failed to send question. Please try again.";
      }
    });
  });
  