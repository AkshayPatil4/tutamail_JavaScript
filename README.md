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
    function throttle(func, delay) {
    let timeoutId = null;

    return function(...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
    }


- Function Description:
     - Purpose: Limits the rate at which a function (func) is executed by ensuring it runs only after a specified delay period.
     - Parameters:
         - func: The function to be throttled.
         - delay: The time (in milliseconds) to wait before calling func again.  
      
-Behavior:
    - Cancels any previously scheduled call to func if a new call is made before the delay period elapses.
    - Executes func only after the user has stopped triggering the function for the specified delay period.

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


      
  	
