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
  console.log(`Backend Public Directory: ${publicDir}`);
  console.log(`npm_execpath: ${process.env.npm_execpath || 'Not Defined'}`);
  console.log(`PATH: ${process.env.PATH || 'Not Defined'}\n`);

  console.log('0. Cleaning previous build and cache directories...');
  try {
    const distPath = path.join(frontendDir, 'dist');
    const viteCachePath = path.join(frontendDir, 'node_modules', '.vite');

    if (fs.existsSync(distPath)) {
      console.log(`Removing ${distPath}...`);
      fs.rmSync(distPath, { recursive: true, force: true });
    }
    if (fs.existsSync(publicDir)) {
      console.log(`Removing ${publicDir}...`);
      fs.rmSync(publicDir, { recursive: true, force: true });
    }
    if (fs.existsSync(viteCachePath)) {
      console.log(`Removing Vite cache ${viteCachePath}...`);
      fs.rmSync(viteCachePath, { recursive: true, force: true });
    }
    console.log('Clean completed successfully.\n');
  } catch (cleanErr) {
    console.warn('Warning during clean phase:', cleanErr.message);
  }

  let buildSuccess = false;
  let lastError = null;

  // Try different execution fallbacks to compile the frontend
  const fallbacks = [
    {
      name: 'npm_execpath (Running via active package manager)',
      fn: () => {
        const execPath = process.env.npm_execpath;
        if (!execPath) throw new Error('npm_execpath is not set in environment.');
        console.log(`Resolved npm_execpath: ${execPath}`);
        if (execPath.endsWith('.js') || execPath.endsWith('.cjs') || execPath.endsWith('.mjs')) {
          execSync(`"${process.execPath}" "${execPath}" run build`, { cwd: frontendDir, stdio: 'inherit' });
        } else {
          execSync(`"${execPath}" run build`, { cwd: frontendDir, stdio: 'inherit' });
        }
      }
    },
    {
      name: 'Local Vite Binary (Direct Execution)',
      fn: () => {
        const localVite = path.join(frontendDir, 'node_modules', '.bin', process.platform === 'win32' ? 'vite.cmd' : 'vite');
        console.log(`Checking local Vite binary at: ${localVite}`);
        if (!fs.existsSync(localVite)) throw new Error('Local Vite binary does not exist.');
        execSync(`"${localVite}" build`, { cwd: frontendDir, stdio: 'inherit' });
      }
    },
    {
      name: 'npx vite build (npm runner)',
      fn: () => {
        execSync('npx vite build', { cwd: frontendDir, stdio: 'inherit' });
      }
    },
    {
      name: 'corepack pnpm run build (corepack wrapper)',
      fn: () => {
        execSync('corepack pnpm run build', { cwd: frontendDir, stdio: 'inherit' });
      }
    },
    {
      name: 'npx pnpm run build (npx pnpm wrapper)',
      fn: () => {
        execSync('npx pnpm run build', { cwd: frontendDir, stdio: 'inherit' });
      }
    },
    {
      name: 'Global pnpm run build',
      fn: () => {
        execSync('pnpm run build', { cwd: frontendDir, stdio: 'inherit' });
      }
    }
  ];

  console.log('1. Building the frontend application...');

  for (const fallback of fallbacks) {
    try {
      console.log(`\n--- Attempting Fallback: ${fallback.name} ---`);
      fallback.fn();
      buildSuccess = true;
      console.log(`Success: Frontend built successfully using: ${fallback.name}`);
      break;
    } catch (err) {
      console.warn(`Warning: Fallback "${fallback.name}" failed.`);
      console.warn(`Error details: ${err.message}`);
      lastError = err;
    }
  }

  if (!buildSuccess) {
    console.error('\n[ERROR] All frontend build fallbacks failed!');
    if (lastError) {
      console.error('Stack trace of last failure:', lastError);
    }
    process.exit(1);
  }

  // Verify that the build directory was actually created and is not empty
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

  try {
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
      copyRecursiveSync(distDir, publicDir);
    }
    
    console.log('\nBuild and sync completed successfully!');
    console.log('You can now add, commit, and push backend/public to GitHub.');
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
