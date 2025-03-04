const { program } = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const { createExtension } = require('./createExtension');
const packageJson = require('../package.json');

program
  .version(packageJson.version)
  .description('Create a new Chrome web extension with a modern setup')
  .argument('[project-directory]', 'Directory to create the extension in')
  .option('--typescript', 'Use TypeScript instead of JavaScript')
  .option('--react', 'Include React for UI components')
  .option('--skip-prompts', 'Skip all prompts and use default values')
  .action(async (projectDirectory, options) => {
    console.log(chalk.bold.blue('🚀 Create Web Extension'));
    console.log(chalk.blue('A tool to generate Chrome extension boilerplate\n'));

    try {
      // If no project directory is provided, prompt for one
      let targetDir = projectDirectory;
      
      if (!options.skipPrompts) {
        const answers = await promptForMissingOptions(targetDir, options);
        targetDir = answers.projectDirectory || targetDir;
        
        // Merge answers with options
        options = { ...options, ...answers };
      } else if (!targetDir) {
        // If skip-prompts is used but no directory provided, use default
        targetDir = 'my-web-extension';
      }

      // Create the extension
      await createExtension(targetDir, options);
      
      console.log(chalk.green('\n✅ Extension created successfully!'));
      console.log(chalk.blue('\nNext steps:'));
      console.log(chalk.blue(`  cd ${targetDir}`));
      console.log(chalk.blue('  npm install'));
      console.log(chalk.blue('  npm run dev'));
      console.log(chalk.blue('\nTo load the extension in Chrome:'));
      console.log(chalk.blue('  1. Open chrome://extensions'));
      console.log(chalk.blue('  2. Enable Developer Mode'));
      console.log(chalk.blue('  3. Click "Load unpacked"'));
      console.log(chalk.blue(`  4. Select the "${targetDir}/dist" folder`));
    } catch (error) {
      console.error(chalk.red('\n❌ Error creating extension:'), error);
      process.exit(1);
    }
  });

async function promptForMissingOptions(projectDirectory, options) {
  const questions = [];

  if (!projectDirectory) {
    questions.push({
      type: 'input',
      name: 'projectDirectory',
      message: 'What is the name of your extension project?',
      default: 'my-web-extension',
      validate: input => {
        if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
        return 'Project name may only include letters, numbers, underscores and hashes.';
      }
    });
  }

  if (options.typescript === undefined) {
    questions.push({
      type: 'confirm',
      name: 'typescript',
      message: 'Would you like to use TypeScript?',
      default: false
    });
  }

  if (options.react === undefined) {
    questions.push({
      type: 'confirm',
      name: 'react',
      message: 'Would you like to use React for UI components?',
      default: false
    });
  }

  questions.push({
    type: 'list',
    name: 'manifestVersion',
    message: 'Which manifest version would you like to use?',
    choices: [
      { name: 'Manifest V3 (recommended)', value: 3 },
      { name: 'Manifest V2 (legacy)', value: 2 }
    ],
    default: 3
  });

  questions.push({
    type: 'checkbox',
    name: 'permissions',
    message: 'Select permissions for your extension:',
    choices: [
      { name: 'storage', checked: true },
      { name: 'tabs', checked: false },
      { name: 'activeTab', checked: true },
      { name: 'contextMenus', checked: false },
      { name: 'notifications', checked: false },
      { name: 'webRequest', checked: false }
    ]
  });

  return inquirer.prompt(questions);
}

program.parse(process.argv); 