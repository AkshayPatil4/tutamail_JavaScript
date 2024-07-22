// Regular expression for URL validation
const urlPattern =
  /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/i;

// Helper function to validate URL format using regex
function isValidUrl(url) {
  return urlPattern.test(url);
}

// Mock function to simulate server response
function mockServerCheck(url) {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const exists = Math.random() > 0.5; // Randomly decide if URL exists
      const isFile = Math.random() > 0.5; // Randomly decide if it's a file
      resolve({
        exists,
        type: exists ? (isFile ? "File" : "Folder") : "Not Found",
      });
    }, 1000); // Simulated server delay of 1 second
  });
}

// Throttle function to limit the rate of URL checks
function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

// Handle the input event
const input = document.getElementById("urlInput");
const resultDiv = document.getElementById("result");

// Throttled function to check URL existence
const checkUrl = throttle(async (url) => {
  if (isValidUrl(url)) {
    input.classList.remove("invalid");
    input.classList.add("valid");
    resultDiv.textContent = "Checking URL...";
    try {
      const response = await mockServerCheck(url);
      if (response.exists) {
        resultDiv.textContent = `URL exists and is a ${response.type}.`;
      } else {
        resultDiv.textContent = "URL does not exist.";
      }
    } catch (error) {
      resultDiv.textContent = "Error checking URL.";
    }
  } else {
    input.classList.remove("valid");
    input.classList.add("invalid");
    resultDiv.textContent = "Invalid URL format.";
  }
}, 1000); // Throttle limit of 1 second

// Attach the event listener to the input field
input.addEventListener("input", (event) => {
  checkUrl(event.target.value);
});
