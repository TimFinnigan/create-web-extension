// Options script

// Default settings
const defaultSettings = {
  enabled: true,
  theme: 'light',
  refreshInterval: 60,
  notifications: true
};

// Save settings to storage
function saveOptions() {
  const settings = {
    enabled: document.getElementById('enabled').checked,
    theme: document.getElementById('theme').value,
    refreshInterval: parseInt(document.getElementById('refresh-interval').value, 10),
    notifications: document.getElementById('notifications').checked
  };
  
  chrome.storage.local.set({ settings }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Settings saved!';
    status.className = 'success';
    
    setTimeout(() => {
      status.textContent = '';
      status.className = '';
    }, 1500);
  });
}

// Restore settings from storage
function restoreOptions() {
  chrome.storage.local.get(['settings'], (result) => {
    const settings = result.settings || defaultSettings;
    
    document.getElementById('enabled').checked = settings.enabled;
    document.getElementById('theme').value = settings.theme;
    document.getElementById('refresh-interval').value = settings.refreshInterval;
    document.getElementById('notifications').checked = settings.notifications;
  });
}

// Reset settings to defaults
function resetOptions() {
  document.getElementById('enabled').checked = defaultSettings.enabled;
  document.getElementById('theme').value = defaultSettings.theme;
  document.getElementById('refresh-interval').value = defaultSettings.refreshInterval;
  document.getElementById('notifications').checked = defaultSettings.notifications;
  
  const status = document.getElementById('status');
  status.textContent = 'Settings reset to defaults. Click Save to apply.';
  status.className = 'success';
  
  setTimeout(() => {
    status.textContent = '';
    status.className = '';
  }, 1500);
}

// Initialize the options page
document.addEventListener('DOMContentLoaded', () => {
  // Restore saved settings
  restoreOptions();
  
  // Add event listeners
  document.getElementById('save').addEventListener('click', saveOptions);
  document.getElementById('reset').addEventListener('click', resetOptions);
}); 