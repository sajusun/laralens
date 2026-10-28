import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const distDir = path.resolve(rootDir, 'dist');
const zipFile = path.resolve(rootDir, 'laralens-v1.0.0.zip');

console.log('📦 Packaging LaraLens for Microsoft Edge Add-ons & Chrome Web Store...');

// Ensure dist exists and has manifest.json
if (!fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, 'manifest.json'))) {
  console.log('⚙️ Dist folder not found, running build first...');
  execSync('pnpm run build', { stdio: 'inherit' });
}

if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

try {
  // Run PowerShell Compress-Archive to bundle contents of dist/ directly at zip root
  const cmd = `powershell -NoProfile -Command "Compress-Archive -Path '${distDir}\\*' -DestinationPath '${zipFile}' -Force"`;
  execSync(cmd, { stdio: 'inherit' });
  
  const stats = fs.statSync(zipFile);
  const sizeKb = (stats.size / 1024).toFixed(1);
  console.log(`\n🎉 Success! Production zip created:`);
  console.log(`👉 File: ${zipFile} (${sizeKb} KB)`);
  console.log(`Ready for direct upload to Microsoft Edge Partner Center!`);
} catch (err) {
  console.error('❌ Failed to package zip:', err);
  process.exit(1);
}
