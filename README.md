# Create Web Extension

A CLI tool to quickly scaffold Chrome extension projects with modern tooling.

## Features

- Create Chrome extensions with JavaScript or TypeScript
- Optional React integration for UI components
- Support for both Manifest V2 and V3
- Webpack bundling for modern development
- Customizable permissions
- Ready-to-use extension templates

## Installation

### Global Installation

```bash
npm install -g create-web-extension
```

### Using npx (without installing)

```bash
npx create-web-extension my-extension
```

## Usage

```bash
# Create a new extension with interactive prompts
create-web-extension my-extension

# Create a TypeScript extension
create-web-extension my-extension --typescript

# Create a React extension
create-web-extension my-extension --react

# Create a TypeScript + React extension
create-web-extension my-extension --typescript --react

# Skip all prompts and use defaults
create-web-extension my-extension --skip-prompts
```

## Options

- `--typescript` - Use TypeScript instead of JavaScript
- `--react` - Include React for UI components
- `--skip-prompts` - Skip all prompts and use default values

## Project Structure

The generated project will have the following structure:

```
my-extension/
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
└── README.md           # Project documentation
```

## Development Workflow

After creating your extension:

1. Navigate to your extension directory:
   ```bash
   cd my-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development mode:
   ```bash
   npm run dev
   ```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" in the top right corner
   - Click "Load unpacked" and select the `dist` directory from your project

5. Build for production:
   ```bash
   npm run build
   ```

## Extension Features

The generated extension includes:

- **Popup UI**: A simple popup with a counter that persists in storage
- **Options Page**: Configurable settings for your extension
- **Background Script**: Handles events and manages state
- **Content Script**: Interacts with web pages

## Local Development of this Tool

If you want to develop or modify this tool:

1. Clone the repository:
   ```bash
   git clone https://github.com/TimFinnigan/create-web-extension.git
   cd create-web-extension
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Link the package locally:
   ```bash
   npm link
   ```

4. Test the CLI:
   ```bash
   create-web-extension test-extension
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 