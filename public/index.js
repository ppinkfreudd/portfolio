// Wait for the DOM to load before running the script
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
          // Format the response to convert newlines to paragraph tags
          const formattedResponse = data.response.split('\n')
            .map(paragraph => paragraph.trim().length > 0 ? `<p>${paragraph}</p>` : '')
            .join('');
          responseOutput.innerHTML = formattedResponse; // Use innerHTML to parse the HTML tags
        } else {
          // Handle cases where the expected content isn't present
          console.error("Unexpected response structure:", data);
          responseOutput.innerHTML = "There was an error processing your request."; // Use innerHTML to parse the HTML tags
        }
      } catch (error) {
        console.error("Failed to fetch response:", error);
        responseOutput.innerHTML = "Failed to send question. Please try again."; // Use innerHTML to parse the HTML tags
      }
    });
  });
