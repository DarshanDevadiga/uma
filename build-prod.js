const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');
const distDir = path.join(frontendDir, 'dist');
const publicDir = path.join(backendDir, 'public');

function run() {
  console.log('=== Starting UMA Production Build Script ===');
  console.log(`Working Directory (cwd): ${process.cwd()}`);
  console.log(`Script Directory (__dirname): ${rootDir}`);
  console.log(`Frontend Directory: ${frontendDir}`);
  console.log(`Backend Public Directory: ${publicDir}\n`);

  // 1. Cleaning previous build directories
  console.log('Cleaning previous build and cache directories...');
  try {
    const viteCachePath = path.join(frontendDir, 'node_modules', '.vite');
    [distDir, publicDir, viteCachePath].forEach(dir => {
      if (fs.existsSync(dir)) {
        console.log(`Removing ${dir}...`);
        fs.rmSync(dir, { recursive: true, force: true });
      }
    });
    console.log('Clean completed successfully.\n');
  } catch (cleanErr) {
    console.warn('Warning during clean phase:', cleanErr.message);
  }

  // 2. Building the frontend application
  console.log('Building the frontend application...');
  try {
    // Standard workspace-safe build execution
    execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });
    console.log('Success: Frontend built successfully via standard npm script.');
  } catch (err) {
    console.warn('Warning: npm run build inside frontend failed. Trying fallback npx build...');
    try {
      execSync('npx vite build', { cwd: frontendDir, stdio: 'inherit' });
      console.log('Success: Frontend built successfully via fallback npx execution.');
    } catch (npxErr) {
      console.error('[ERROR] All frontend build methods failed!');
      console.error(npxErr);
      process.exit(1);
    }
  }

  // 3. Verify compilation
  console.log('\nChecking compiled frontend assets...');
  if (!fs.existsSync(distDir)) {
    console.error(`[ERROR] Build completed but dist directory does not exist at: ${distDir}`);
    process.exit(1);
  }
  const distFiles = fs.readdirSync(distDir);
  if (distFiles.length === 0) {
    console.error(`[ERROR] Build completed but dist directory is empty at: ${distDir}`);
    process.exit(1);
  }
  console.log(`Vite build verification passed! Found ${distFiles.length} items in dist/.`);

  // 4. Prepare backend public directory and copy assets
  try {
    console.log('\nPreparing the backend public directory...');
    if (fs.existsSync(publicDir)) {
      fs.rmSync(publicDir, { recursive: true, force: true });
    }
    fs.mkdirSync(publicDir, { recursive: true });

    console.log('Copying compiled static assets...');
    if (fs.cpSync) {
      fs.cpSync(distDir, publicDir, { recursive: true });
    } else {
      copyRecursiveSync(distDir, publicDir);
    }
    
    console.log('\nBuild and sync completed successfully!');
    console.log('=== Build Script Finished Successfully ===');
  } catch (error) {
    console.error('\n[ERROR] Failed to prepare public directory or copy assets:');
    console.error(error);
    process.exit(1);
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
