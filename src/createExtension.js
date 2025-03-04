const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * Creates a new web extension project
 * @param {string} targetDir - The directory to create the extension in
 * @param {Object} options - Configuration options
 * @param {boolean} options.typescript - Whether to use TypeScript
 * @param {boolean} options.react - Whether to use React
 * @param {number} options.manifestVersion - Manifest version (2 or 3)
 * @param {Array<string>} options.permissions - Array of permissions
 */
async function createExtension(targetDir, options) {
  const { typescript, react, manifestVersion, permissions } = options;
  
  // Create project directory
  const projectPath = path.resolve(process.cwd(), targetDir);
  
  console.log(chalk.blue(`\nCreating a new web extension in ${chalk.bold(projectPath)}`));
  
  // Ensure directory exists
  await fs.ensureDir(projectPath);
  
  // Check if directory is empty
  const dirContents = await fs.readdir(projectPath);
  if (dirContents.length > 0) {
    console.log(chalk.yellow(`\nWarning: The directory ${targetDir} is not empty.`));
    console.log(chalk.yellow('Files might be overwritten.'));
  }
  
  // Create project structure
  await createProjectStructure(projectPath, options);
  
  // Create manifest file
  await createManifestFile(projectPath, options);
  
  // Create source files
  await createSourceFiles(projectPath, options);
  
  // Create package.json
  await createPackageJson(projectPath, options);
  
  // Create webpack config if needed
  if (react || typescript) {
    await createWebpackConfig(projectPath, options);
  }
  
  // Create README
  await createReadme(projectPath, options);
}

/**
 * Creates the basic project structure
 */
async function createProjectStructure(projectPath, options) {
  console.log(chalk.blue('Creating project structure...'));
  
  // Create directories
  const directories = [
    'src',
    'src/background',
    'src/popup',
    'src/options',
    'src/content',
    'src/assets',
    'src/assets/icons',
  ];
  
  for (const dir of directories) {
    await fs.ensureDir(path.join(projectPath, dir));
  }
}

/**
 * Creates the manifest.json file
 */
async function createManifestFile(projectPath, options) {
  const { manifestVersion, permissions } = options;
  
  console.log(chalk.blue(`Creating manifest.json (version ${manifestVersion})...`));
  
  const manifest = {
    name: path.basename(projectPath),
    description: "A Chrome extension created with create-web-extension",
    version: "1.0.0",
  };
  
  if (manifestVersion === 3) {
    manifest.manifest_version = 3;
    manifest.action = {
      default_popup: "popup.html",
      default_icon: {
        "16": "assets/icons/icon16.png",
        "48": "assets/icons/icon48.png",
        "128": "assets/icons/icon128.png"
      }
    };
    manifest.background = {
      service_worker: "background.js"
    };
  } else {
    manifest.manifest_version = 2;
    manifest.browser_action = {
      default_popup: "popup.html",
      default_icon: {
        "16": "assets/icons/icon16.png",
        "48": "assets/icons/icon48.png",
        "128": "assets/icons/icon128.png"
      }
    };
    manifest.background = {
      scripts: ["background.js"],
      persistent: false
    };
  }
  
  manifest.permissions = permissions || ["storage", "activeTab"];
  manifest.options_page = "options.html";
  manifest.icons = {
    "16": "assets/icons/icon16.png",
    "48": "assets/icons/icon48.png",
    "128": "assets/icons/icon128.png"
  };
  
  // Add content scripts if needed
  manifest.content_scripts = [
    {
      matches: ["<all_urls>"],
      js: ["content.js"]
    }
  ];
  
  await fs.writeJSON(path.join(projectPath, 'src', 'manifest.json'), manifest, { spaces: 2 });
}

/**
 * Creates source files for the extension
 */
async function createSourceFiles(projectPath, options) {
  const { typescript, react } = options;
  const extension = typescript ? 'ts' : 'js';
  const jsxExtension = typescript ? 'tsx' : 'jsx';
  
  console.log(chalk.blue('Creating source files...'));
  
  // Create background script
  const backgroundScript = `// Background script
${manifestVersion === 3 ? '// Service worker for Manifest V3' : '// Background page for Manifest V2'}

// Example: Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});
`;
  
  await fs.writeFile(
    path.join(projectPath, 'src', 'background', `index.${extension}`),
    backgroundScript
  );
  
  // Create content script
  const contentScript = `// Content script
// This script runs on web pages that match the pattern in manifest.json

console.log('Content script loaded');

// Example: Modify page content
function modifyPage() {
  // Your code here
}

// Run when the page is fully loaded
document.addEventListener('DOMContentLoaded', modifyPage);
`;
  
  await fs.writeFile(
    path.join(projectPath, 'src', 'content', `index.${extension}`),
    contentScript
  );
  
  // Create HTML files
  await createHtmlFiles(projectPath, options);
  
  // Create UI files (popup, options)
  await createUIFiles(projectPath, options);
  
  // Create sample icons
  await createSampleIcons(projectPath);
}

/**
 * Creates HTML files for popup and options
 */
async function createHtmlFiles(projectPath, options) {
  const popupHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Extension Popup</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div id="popup-root">
    <h1>My Extension</h1>
    <p>This is the popup for your extension.</p>
  </div>
  <script src="popup.js"></script>
</body>
</html>`;
  
  const optionsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Extension Options</title>
  <link rel="stylesheet" href="options.css">
</head>
<body>
  <div id="options-root">
    <h1>Extension Options</h1>
    <p>Configure your extension here.</p>
  </div>
  <script src="options.js"></script>
</body>
</html>`;
  
  await fs.writeFile(path.join(projectPath, 'src', 'popup', 'index.html'), popupHtml);
  await fs.writeFile(path.join(projectPath, 'src', 'options', 'index.html'), optionsHtml);
}

/**
 * Creates UI files for popup and options
 */
async function createUIFiles(projectPath, options) {
  const { typescript, react } = options;
  const extension = typescript ? 'ts' : 'js';
  const jsxExtension = typescript ? 'tsx' : 'jsx';
  
  // CSS files
  const popupCss = `body {
  width: 300px;
  padding: 10px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #4285f4;
  font-size: 18px;
}`;
  
  const optionsCss = `body {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  color: #4285f4;
}`;
  
  await fs.writeFile(path.join(projectPath, 'src', 'popup', 'index.css'), popupCss);
  await fs.writeFile(path.join(projectPath, 'src', 'options', 'index.css'), optionsCss);
  
  // JS/TS files
  if (react) {
    // React components
    const popupReact = `import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Popup = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Example: Get data from storage
    chrome.storage.local.get(['count'], (result) => {
      if (result.count) {
        setCount(result.count);
      }
    });
  }, []);
  
  const incrementCount = () => {
    const newCount = count + 1;
    setCount(newCount);
    chrome.storage.local.set({ count: newCount });
  };
  
  return (
    <div className="popup-container">
      <h1>My Extension</h1>
      <p>You clicked {count} times</p>
      <button onClick={incrementCount}>Click me</button>
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById('popup-root'));`;
    
    const optionsReact = `import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Options = () => {
  const [settings, setSettings] = useState({
    enabled: true,
    theme: 'light'
  });
  
  useEffect(() => {
    // Load settings from storage
    chrome.storage.local.get(['settings'], (result) => {
      if (result.settings) {
        setSettings(result.settings);
      }
    });
  }, []);
  
  const saveSettings = () => {
    chrome.storage.local.set({ settings });
    alert('Settings saved!');
  };
  
  return (
    <div className="options-container">
      <h1>Extension Options</h1>
      
      <div className="option">
        <label>
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => setSettings({...settings, enabled: e.target.checked})}
          />
          Enable extension
        </label>
      </div>
      
      <div className="option">
        <label>Theme:</label>
        <select
          value={settings.theme}
          onChange={(e) => setSettings({...settings, theme: e.target.value})}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
      
      <button onClick={saveSettings}>Save Settings</button>
    </div>
  );
};

ReactDOM.render(<Options />, document.getElementById('options-root'));`;
    
    await fs.writeFile(path.join(projectPath, 'src', 'popup', `index.${jsxExtension}`), popupReact);
    await fs.writeFile(path.join(projectPath, 'src', 'options', `index.${jsxExtension}`), optionsReact);
  } else {
    // Vanilla JS/TS
    const popupJs = `// Popup script
document.addEventListener('DOMContentLoaded', () => {
  // Example: Get data from storage
  chrome.storage.local.get(['count'], (result) => {
    const count = result.count || 0;
    document.getElementById('count').textContent = count.toString();
  });
  
  // Example: Handle button click
  document.getElementById('increment').addEventListener('click', () => {
    chrome.storage.local.get(['count'], (result) => {
      const newCount = (result.count || 0) + 1;
      chrome.storage.local.set({ count: newCount });
      document.getElementById('count').textContent = newCount.toString();
    });
  });
});`;
    
    const optionsJs = `// Options script
document.addEventListener('DOMContentLoaded', () => {
  // Load saved settings
  chrome.storage.local.get(['settings'], (result) => {
    const settings = result.settings || { enabled: true, theme: 'light' };
    
    document.getElementById('enabled').checked = settings.enabled;
    document.getElementById('theme').value = settings.theme;
  });
  
  // Save settings
  document.getElementById('save').addEventListener('click', () => {
    const settings = {
      enabled: document.getElementById('enabled').checked,
      theme: document.getElementById('theme').value
    };
    
    chrome.storage.local.set({ settings }, () => {
      const status = document.getElementById('status');
      status.textContent = 'Settings saved!';
      setTimeout(() => {
        status.textContent = '';
      }, 1500);
    });
  });
});`;
    
    // Update HTML files for vanilla JS
    const updatedPopupHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Extension Popup</title>
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <div id="popup-root">
    <h1>My Extension</h1>
    <p>You clicked <span id="count">0</span> times</p>
    <button id="increment">Click me</button>
  </div>
  <script src="index.js"></script>
</body>
</html>`;
    
    const updatedOptionsHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Extension Options</title>
  <link rel="stylesheet" href="index.css">
</head>
<body>
  <div id="options-root">
    <h1>Extension Options</h1>
    
    <div class="option">
      <label>
        <input type="checkbox" id="enabled">
        Enable extension
      </label>
    </div>
    
    <div class="option">
      <label>Theme:</label>
      <select id="theme">
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
    
    <button id="save">Save Settings</button>
    <div id="status"></div>
  </div>
  <script src="index.js"></script>
</body>
</html>`;
    
    await fs.writeFile(path.join(projectPath, 'src', 'popup', 'index.html'), updatedPopupHtml);
    await fs.writeFile(path.join(projectPath, 'src', 'options', 'index.html'), updatedOptionsHtml);
    await fs.writeFile(path.join(projectPath, 'src', 'popup', `index.${extension}`), popupJs);
    await fs.writeFile(path.join(projectPath, 'src', 'options', `index.${extension}`), optionsJs);
  }
}

/**
 * Creates sample icon files
 */
async function createSampleIcons(projectPath) {
  // For simplicity, we'll create placeholder files for icons
  // In a real implementation, you might want to copy actual icon files
  
  const iconSizes = [16, 48, 128];
  
  for (const size of iconSizes) {
    await fs.writeFile(
      path.join(projectPath, 'src', 'assets', 'icons', `icon${size}.png`),
      `This is a placeholder for a ${size}x${size} icon.`
    );
  }
}

/**
 * Creates package.json for the extension project
 */
async function createPackageJson(projectPath, options) {
  const { typescript, react, manifestVersion } = options;
  
  console.log(chalk.blue('Creating package.json...'));
  
  const packageJson = {
    name: path.basename(projectPath),
    version: "1.0.0",
    description: "A Chrome extension created with create-web-extension",
    scripts: {
      "dev": "webpack --mode=development --watch",
      "build": "webpack --mode=production",
      "lint": "eslint src/**/*.js",
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    keywords: ["chrome", "extension", "browser"],
    author: "",
    license: "MIT",
    devDependencies: {
      "@babel/core": "^7.22.5",
      "@babel/preset-env": "^7.22.5",
      "babel-loader": "^9.1.2",
      "copy-webpack-plugin": "^11.0.0",
      "css-loader": "^6.8.1",
      "eslint": "^8.42.0",
      "html-webpack-plugin": "^5.5.3",
      "style-loader": "^3.3.3",
      "webpack": "^5.86.0",
      "webpack-cli": "^5.1.4"
    },
    dependencies: {}
  };
  
  if (typescript) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      "@babel/preset-typescript": "^7.22.5",
      "@types/chrome": "^0.0.237",
      "typescript": "^5.1.3",
      "ts-loader": "^9.4.3"
    };
  }
  
  if (react) {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      "react": "^18.2.0",
      "react-dom": "^18.2.0"
    };
    
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      "@babel/preset-react": "^7.22.5"
    };
    
    if (typescript) {
      packageJson.devDependencies = {
        ...packageJson.devDependencies,
        "@types/react": "^18.2.12",
        "@types/react-dom": "^18.2.5"
      };
    }
  }
  
  await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });
}

/**
 * Creates webpack configuration
 */
async function createWebpackConfig(projectPath, options) {
  const { typescript, react } = options;
  
  console.log(chalk.blue('Creating webpack configuration...'));
  
  const webpackConfig = `const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    popup: path.join(__dirname, 'src', 'popup', 'index.${typescript ? 'tsx' : react ? 'jsx' : 'js'}'),
    options: path.join(__dirname, 'src', 'options', 'index.${typescript ? 'tsx' : react ? 'jsx' : 'js'}'),
    background: path.join(__dirname, 'src', 'background', 'index.${typescript ? 'ts' : 'js'}'),
    content: path.join(__dirname, 'src', 'content', 'index.${typescript ? 'ts' : 'js'}'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\\.(js|jsx${typescript ? '|ts|tsx' : ''})$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ${react ? "'@babel/preset-react'," : ''}
              ${typescript ? "'@babel/preset-typescript'," : ''}
            ],
          },
        },
      },
      ${typescript ? `{
        test: /\\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },` : ''}
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/assets', to: 'assets' },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'popup', 'index.html'),
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'options', 'index.html'),
      filename: 'options.html',
      chunks: ['options'],
    }),
  ],
  resolve: {
    extensions: ['.js'${react ? ", '.jsx'" : ''}${typescript ? ", '.ts', '.tsx'" : ''}],
  },
};`;
  
  await fs.writeFile(path.join(projectPath, 'webpack.config.js'), webpackConfig);
  
  // Create tsconfig if needed
  if (typescript) {
    const tsConfig = {
      compilerOptions: {
        target: "es6",
        module: "commonjs",
        jsx: react ? "react" : "preserve",
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        outDir: "./dist",
        rootDir: "./src",
        typeRoots: ["./node_modules/@types"]
      },
      include: ["src/**/*"],
      exclude: ["node_modules", "dist"]
    };
    
    await fs.writeJSON(path.join(projectPath, 'tsconfig.json'), tsConfig, { spaces: 2 });
  }
}

/**
 * Creates README.md file
 */
async function createReadme(projectPath, options) {
  const { typescript, react, manifestVersion } = options;
  
  console.log(chalk.blue('Creating README.md...'));
  
  const readmeContent = `# ${path.basename(projectPath)}

A Chrome extension created with create-web-extension.

## Features

- ${typescript ? 'TypeScript' : 'JavaScript'} based extension
- ${react ? 'React for UI components' : 'Vanilla JS for UI'}
- Manifest V${manifestVersion}
- Webpack for bundling

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

\`\`\`bash
# Install dependencies
npm install
\`\`\`

### Development Build

\`\`\`bash
# Start development build with watch mode
npm run dev
\`\`\`

### Production Build

\`\`\`bash
# Create production build
npm run build
\`\`\`

## Loading the Extension in Chrome

1. Open Chrome and navigate to \`chrome://extensions\`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the \`dist\` directory from this project
4. The extension should now be installed and visible in your browser

## Project Structure

\`\`\`
├── dist/               # Built extension files (created after build)
├── src/                # Source files
│   ├── assets/         # Static assets like icons
│   ├── background/     # Background script
│   ├── content/        # Content scripts
│   ├── options/        # Options page
│   ├── popup/          # Popup UI
│   └── manifest.json   # Extension manifest
├── webpack.config.js   # Webpack configuration
├── package.json        # Project dependencies and scripts
${typescript ? '├── tsconfig.json      # TypeScript configuration\n' : ''}└── README.md          # This file
\`\`\`

## License

MIT
`;
  
  await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent);
}

module.exports = { createExtension };
