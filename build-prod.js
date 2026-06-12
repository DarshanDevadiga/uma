const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');
const distDir = path.join(frontendDir, 'dist');
const publicDir = path.join(backendDir, 'public');

function run() {
  try {
    console.log('1. Building the frontend application...');
    execSync('pnpm run build', { cwd: frontendDir, stdio: 'inherit' });
    
    console.log('\n2. Preparing the backend public directory...');
    if (fs.existsSync(publicDir)) {
      console.log('Cleaning existing backend public directory...');
      fs.rmSync(publicDir, { recursive: true, force: true });
    }
    fs.mkdirSync(publicDir, { recursive: true });

    console.log('\n3. Copying compiled static assets...');
    if (fs.cpSync) {
      fs.cpSync(distDir, publicDir, { recursive: true });
    } else {
      // Fallback for older Node versions
      copyRecursiveSync(distDir, publicDir);
    }
    
    console.log('\nBuild and sync completed successfully!');
    console.log('You can now add, commit, and push backend/public to GitHub.');
  } catch (error) {
    console.error('\nBuild and sync failed:', error.message);
  }
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

run();
