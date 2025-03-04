// Background script
// This script runs in the background

// Chrome API types are provided by @types/chrome package
// which should be installed as a dev dependency

interface StorageData {
  count: number;
}

interface Message {
  type: string;
  [key: string]: any;
}

// Example: Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
  
  // Initialize storage with default values
  chrome.storage.local.set({ count: 0 });
});

// Example: Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  if (message.type === 'GET_COUNT') {
    chrome.storage.local.get(['count'], (result: { count?: number }) => {
      sendResponse({ count: result.count || 0 });
    });
    return true; // Required for async sendResponse
  }
}); 