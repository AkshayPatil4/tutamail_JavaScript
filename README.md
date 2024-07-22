# URL Checker Application

## Overview

The URL Checker application allows users to verify the validity of a URL and check if it exists as a file or folder. This application is built using HTML, CSS, and JavaScript. It features a user interface where users can input a URL, and the application provides feedback on the URL's validity and existence. The existence check is simulated with a mock server response, and user input is throttled to avoid excessive requests.

## Features

- **URL Validation**: Validates the format of the URL using a regular expression.
- **Throttled Input Handling**: Limits the rate of URL checks to reduce server load.
- **Mock Server Response**: Simulates server responses to indicate whether the URL exists and if it's a file or folder.
- **Dynamic Feedback**: Updates the UI with real-time validation and check results.

## Technologies

- **HTML**: Provides the structure and layout of the application.
- **CSS**: Styles the application and provides visual feedback.
- **JavaScript**: Implements the functionality for URL validation, throttling, and simulated server responses.

## How to Use

1. **Open `index.html` in a web browser**: This will display the URL Checker interface.
2. **Enter a URL in the input field**: The application will validate the URL format and simulate an existence check.
3. **View the results**: The application will indicate whether the URL is valid and whether it exists as a file or folder.

## Code Explanation

### HTML (`index.html`)

- **Structure**:
  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>URL Checker</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
          }
          input {
              width: 300px;
              padding: 10px;
              border: 2px solid gray;
              border-radius: 5px;
              margin-top: 20px;
              outline: none;
          }
          #result {
              margin-top: 20px;
              font-size: 1.2em;
          }
          .valid {
              border-color: green;
          }
          .invalid {
              border-color: red;
          }
      </style>
  </head>
  <body>
      <h1>URL Checker</h1>
      <input type="text" id="urlInput" placeholder="Enter a URL" />
      <div id="result"></div>
      <script src="script.js"></script>
  </body>
  </html>

- Defines the layout and styles of the application, including an input field for URLs and a results display area.
### JavaScript (`app.js`)
1. Regular Expression for URL Validation:
      ```javascript
      const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/i;
  - Uses a regex pattern to validate common URL formats, including optional protocol, domain, port, and path.

2. isValidUrl Function:
   ```javascript
   function isValidUrl(url) {
    return urlPattern.test(url);
   }
  - Tests if the URL matches the regex pattern, returning true if valid and false otherwise.
    
3. mockServerCheck Function:
    ```javascript
    function mockServerCheck(url) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const exists = Math.random() > 0.5; // Simulate existence with random boolean
            const isFile = Math.random() > 0.5; // Simulate type with random boolean
            resolve({
                exists,
                type: exists ? (isFile ? 'File' : 'Folder') : 'Not Found'
            });
        }, 1000); // Simulate server delay of 1 second
    });
    }

- Simulates an asynchronous server response with a delay, randomly determining if the URL exists and whether it is a file or folder.

4. throttle Function:
    ```javascript
    // Throttle function to limit the rate of URL checks
    function throttle(func, limit) {
    let lastFunc; // Variable to store the last scheduled function call
    let lastRan;  // Variable to store the timestamp of the last function execution

    return function() {  // Return a new throttled function
        const context = this; // Capture the context (this) of the calling function
        const args = arguments; // Capture the arguments passed to the throttled function

        if (!lastRan) {
            // If the function has not been run yet
            func.apply(context, args); // Execute the function immediately
            lastRan = Date.now(); // Record the current timestamp
        } else {
            // If the function has been run, schedule the next execution
            clearTimeout(lastFunc); // Clear the previously scheduled execution, if any

            lastFunc = setTimeout(function() {
                // Schedule a new function execution after the remaining time
                if ((Date.now() - lastRan) >= limit) {
                    // Check if the specified interval has passed since the last execution
                    func.apply(context, args); // Execute the function
                    lastRan = Date.now(); // Update the timestamp
                }
            }, limit - (Date.now() - lastRan));
            // Calculate the remaining time and set the timeout accordingly
        }
    };
    }

- Function Definition:
     - The throttle function takes two parameters
         - func: The function to be throttled.
         - limit: The time interval (in milliseconds) that must pass before func can be called again.
      
- Variables for State Management:
    - lastFunc: Stores the identifier of the last scheduled function call (from setTimeout).
    - lastRan: Stores the timestamp of the last actual function execution.

- Return a New Throttled Function:
    - The returned function will be called in place of the original func. It manages the throttling behavior.

- Capture Context and Arguments:
    - context: Captures the context (this) in which the throttled function is called.
    - args: Captures the arguments passed to the throttled function.
 
- Immediate Execution on First Call:
    - If lastRan is undefined (i.e., the function has not been called yet), the function is executed immediately.
    - lastRan is then set to the current timestamp.
 
- Scheduling the Next Execution:
    - If the function has been called before, any previously scheduled execution is cleared using clearTimeout(lastFunc).
    - A new execution is scheduled using setTimeout.
    - The setTimeout delay is calculated as limit - (Date.now() - lastRan), which ensures the function is executed only after the specified limit interval has passed since the last execution.
    - Inside the setTimeout callback, it checks if the required interval has passed. If so, it executes the function and updates lastRan.  

5. Event Handling and UI Updates:
     ```javascript
     const input = document.getElementById('urlInput');
     const resultDiv = document.getElementById('result');

    const checkUrl = throttle(async (url) => {
    if (isValidUrl(url)) {
        input.classList.remove('invalid');
        input.classList.add('valid');
        resultDiv.textContent = 'Checking URL...';
        try {
            const response = await mockServerCheck(url);
            if (response.exists) {
                resultDiv.textContent = `URL exists and is a ${response.type}.`;
            } else {
                resultDiv.textContent = 'URL does not exist.';
            }
        } catch (error) {
            resultDiv.textContent = 'Error checking URL.';
        }
    } else {
        input.classList.remove('valid');
        input.classList.add('invalid');
        resultDiv.textContent = 'Invalid URL format.';
    }
    }, 1000);

    input.addEventListener('input', (event) => {
    checkUrl(event.target.value);
    });

- checkUrl Function: Throttled function to validate the URL and simulate existence check. Updates the input field’s border color and result text based on validity and existence.
- Event Listener: Attaches to the input field and triggers checkUrl on every input event.     


      
  	
