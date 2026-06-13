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
    
    // Try to use the package manager that launched the script
    const execPath = process.env.npm_execpath;
    let buildSuccess = false;
    
    if (execPath) {
      console.log(`Using executing package manager path: ${execPath}`);
      try {
        if (execPath.endsWith('.js') || execPath.endsWith('.cjs') || execPath.endsWith('.mjs')) {
          execSync(`"${process.execPath}" "${execPath}" run build`, { cwd: frontendDir, stdio: 'inherit' });
        } else {
          execSync(`"${execPath}" run build`, { cwd: frontendDir, stdio: 'inherit' });
        }
        buildSuccess = true;
      } catch (e) {
        console.warn('Execution using npm_execpath failed, trying fallback...', e.message);
      }
    }
    
    if (!buildSuccess) {
      // Fallback 1: Try running local vite binary directly
      try {
        console.log('Trying local Vite build...');
        const localVite = path.join(frontendDir, 'node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite');
        if (fs.existsSync(localVite)) {
          execSync(`"${localVite}" build`, { cwd: frontendDir, stdio: 'inherit' });
          buildSuccess = true;
        }
      } catch (e) {
        console.warn('Local Vite build failed, trying npx fallback...', e.message);
      }
    }
    
    if (!buildSuccess) {
      // Fallback 2: npx vite build
      try {
        console.log('Trying npx vite build...');
        execSync('npx vite build', { cwd: frontendDir, stdio: 'inherit' });
        buildSuccess = true;
      } catch (e) {
        console.warn('npx vite build failed, trying global pnpm fallback...', e.message);
      }
    }
    
    if (!buildSuccess) {
      // Fallback 3: Standard global pnpm (original behavior)
      console.log('Trying global pnpm build...');
      execSync('pnpm run build', { cwd: frontendDir, stdio: 'inherit' });
    }
    
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
