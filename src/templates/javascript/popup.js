// Popup script

// Update the count display from storage
function updateCountDisplay() {
  chrome.storage.local.get(['count'], (result) => {
    const count = result.count || 0;
    document.getElementById('count').textContent = count.toString();
  });
}

// Increment the count in storage
function incrementCount() {
  chrome.storage.local.get(['count'], (result) => {
    const newCount = (result.count || 0) + 1;
    chrome.storage.local.set({ count: newCount }, () => {
      document.getElementById('count').textContent = newCount.toString();
    });
  });
}

// Open the options page
function openOptions() {
  chrome.runtime.openOptionsPage();
}

// Initialize the popup
document.addEventListener('DOMContentLoaded', () => {
  // Load the count from storage
  updateCountDisplay();
  
  // Add event listeners
  document.getElementById('increment').addEventListener('click', incrementCount);
  document.getElementById('options-btn').addEventListener('click', openOptions);
  
  // Example: Send a message to the background script
  chrome.runtime.sendMessage({ type: 'POPUP_OPENED' }, (response) => {
    console.log('Response from background:', response);
  });
}); 