// Content script
// This script runs on web pages that match the pattern in manifest.json

console.log('Content script loaded');

// Example: Modify page content
function modifyPage() {
  // Example: Add a custom element to the page
  const extensionBanner = document.createElement('div');
  extensionBanner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #4285f4;
    color: white;
    padding: 10px;
    text-align: center;
    z-index: 9999;
    font-family: Arial, sans-serif;
    display: none;
  `;
  extensionBanner.textContent = 'This page is being enhanced by My Extension';
  document.body.appendChild(extensionBanner);
  
  // Show the banner briefly then fade out
  setTimeout(() => {
    extensionBanner.style.display = 'block';
    setTimeout(() => {
      extensionBanner.style.opacity = '0';
      extensionBanner.style.transition = 'opacity 1s';
      setTimeout(() => {
        extensionBanner.remove();
      }, 1000);
    }, 3000);
  }, 1000);
}

// Example: Send a message to the background script
function sendMessageToBackground() {
  chrome.runtime.sendMessage({ type: 'CONTENT_LOADED', url: window.location.href }, 
    response => {
      console.log('Response from background:', response);
    }
  );
}

// Run when the page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  modifyPage();
  sendMessageToBackground();
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_CONTENT') {
    console.log('Received update request from background');
    // Do something with the message
    sendResponse({ success: true });
  }
  return true;
}); 