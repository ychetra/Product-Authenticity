const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ANSI color codes for output formatting
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  
  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
  },
  
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m'
  }
};

// Print a colored heading
function printHeading(text) {
  console.log(`\n${colors.bright}${colors.fg.blue}=== ${text} ===${colors.reset}\n`);
}

// Print a success message
function printSuccess(text) {
  console.log(`${colors.fg.green}✓ ${text}${colors.reset}`);
}

// Print an error message
function printError(text) {
  console.log(`${colors.fg.red}✗ ${text}${colors.reset}`);
}

// Print a warning message
function printWarning(text) {
  console.log(`${colors.fg.yellow}⚠ ${text}${colors.reset}`);
}

// Print an info message
function printInfo(text) {
  console.log(`${colors.fg.cyan}ℹ ${text}${colors.reset}`);
}

// Check if Hardhat is installed
function checkHardhatInstalled() {
  try {
    execSync('npx hardhat --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Check if Node.js dependencies are installed
function checkDependenciesInstalled() {
  return fs.existsSync(path.join(__dirname, 'node_modules'));
}

// Install dependencies
function installDependencies() {
  printHeading('Installing dependencies');
  try {
    printInfo('Running npm install...');
    printInfo('This may take a few minutes. If it fails, you can try again later or install manually.');
    execSync('npm install', { stdio: 'inherit' });
    printSuccess('Dependencies installed successfully');
    return true;
  } catch (error) {
    printError('Failed to install dependencies');
    printWarning('This could be due to network connectivity issues or proxy settings.');
    printInfo('You can try one of the following:');
    printInfo('1. Check your internet connection and try again');
    printInfo('2. Run npm install manually from the command line');
    printInfo('3. If behind a proxy, configure npm proxy settings: npm config set proxy http://proxy-server:port');
    return false;
  }
}

// Compile smart contracts
function compileContracts() {
  printHeading('Compiling smart contracts');
  try {
    execSync('npx hardhat compile', { stdio: 'inherit' });
    printSuccess('Smart contracts compiled successfully');
    return true;
  } catch (error) {
    printError('Failed to compile smart contracts');
    console.error(error);
    return false;
  }
}

// Start a local blockchain node
function startLocalNode() {
  printHeading('Starting local blockchain node');
  printInfo('The node will continue running in this terminal window');
  printInfo('Press Ctrl+C to stop the node when you\'re done');
  
  return spawn('npx', ['hardhat', 'node'], { 
    stdio: 'inherit',
    shell: true
  });
}

// Deploy smart contracts
function deployContracts() {
  printHeading('Deploying smart contracts');
  try {
    execSync('npx hardhat run scripts/deploy.js --network localhost', { stdio: 'inherit' });
    printSuccess('Smart contracts deployed successfully');
    return true;
  } catch (error) {
    printError('Failed to deploy smart contracts');
    console.error(error);
    return false;
  }
}

// Start React app
function startReactApp() {
  printHeading('Starting React application');
  printInfo('The React app will continue running in this terminal window');
  printInfo('Press Ctrl+C to stop the app when you\'re done');
  
  process.chdir(path.join(__dirname, 'frontend'));
  
  try {
    if (!fs.existsSync(path.join(__dirname, 'frontend', 'node_modules'))) {
      printInfo('Installing frontend dependencies...');
      execSync('npm install', { stdio: 'inherit' });
    }
    
    return spawn('npm', ['start'], { 
      stdio: 'inherit',
      shell: true
    });
  } catch (error) {
    printError('Failed to start React application');
    console.error(error);
    return null;
  }
}

// Main function to run the entire process
async function main() {
  console.clear();
  console.log(`
${colors.bright}${colors.fg.magenta}╔═══════════════════════════════════════════════╗
║                                               ║
║     PRODUCT AUTHENTICITY SYSTEM LAUNCHER      ║
║                                               ║
╚═══════════════════════════════════════════════╝${colors.reset}
  `);

  // Check if dependencies are installed
  if (!checkDependenciesInstalled()) {
    printWarning('Dependencies not found.');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      rl.question(`${colors.fg.yellow}Would you like to install dependencies now? (y/n):${colors.reset} `, resolve);
    });
    
    rl.close();
    
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      if (!installDependencies()) {
        const rl2 = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        const skipAnswer = await new Promise(resolve => {
          rl2.question(`${colors.fg.yellow}Would you like to continue anyway? (This may cause errors) (y/n):${colors.reset} `, resolve);
        });
        
        rl2.close();
        
        if (skipAnswer.toLowerCase() !== 'y' && skipAnswer.toLowerCase() !== 'yes') {
          printInfo('Exiting...');
          process.exit(1);
        }
      }
    } else {
      printWarning('Skipping dependency installation. This may cause errors.');
    }
  } else {
    printSuccess('Dependencies already installed');
  }

  // Try to compile contracts but handle failure gracefully
  try {
    if (!fs.existsSync(path.join(__dirname, 'node_modules', 'hardhat'))) {
      printWarning('Hardhat not found, skipping contract compilation');
    } else {
      if (!compileContracts()) {
        printWarning('Contract compilation failed, but continuing anyway');
      }
    }
  } catch (error) {
    printWarning('Error during contract compilation, but continuing anyway');
    console.error(error);
  }

  // Create a readline interface for user input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Ask the user what components to start
  rl.question(`${colors.bright}What would you like to do? ${colors.reset}
1. Start a local blockchain node
2. Deploy contracts to the local node
3. Start the React application
4. Full setup (start node, deploy contracts, and start app in separate terminals)
5. Install or update dependencies
6. Exit

${colors.fg.yellow}Enter your choice (1-6):${colors.reset} `, async (choice) => {
    rl.close();
    
    switch (choice.trim()) {
      case '1':
        // Start local node
        startLocalNode();
        break;
      
      case '2':
        // Deploy contracts
        deployContracts();
        break;
      
      case '3':
        // Start React app
        startReactApp();
        break;
      
      case '4':
        // Full setup - open separate terminals
        if (process.platform === 'win32') {
          printInfo('Starting full setup in separate command prompts...');
          
          // Start the local node in a new command prompt
          const nodeCmd = spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/k', 'npx hardhat node'], { shell: true });
          
          // Wait for the node to start
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          // Deploy the contracts
          const deployCmd = spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/k', 
            'npx hardhat run scripts/deploy.js --network localhost && echo Deployment completed! && pause'], 
            { shell: true });
          
          // Wait for deployment to finish (approximately)
          await new Promise(resolve => setTimeout(resolve, 5000));
          
          // Start the React app
          const reactCmd = spawn('cmd.exe', ['/c', 'start', 'cmd.exe', '/k', 
            'cd frontend && npm install && npm start'], 
            { shell: true });
          
          printSuccess('All components started in separate windows');
        } else {
          printError('Full setup in separate terminals is currently only supported on Windows');
          printInfo('Please run the components individually:');
          printInfo('1. Start the node: npx hardhat node');
          printInfo('2. Deploy contracts: npx hardhat run scripts/deploy.js --network localhost');
          printInfo('3. Start the React app: cd frontend && npm start');
        }
        break;
      
      case '5':
        // Install or update dependencies
        installDependencies();
        // Return to the main menu after installation
        main();
        break;
        
      case '6':
      default:
        printInfo('Exiting...');
        process.exit(0);
    }
  });
}

// Run the main function
main().catch(error => {
  printError('An error occurred:');
  console.error(error);
  process.exit(1);
}); 