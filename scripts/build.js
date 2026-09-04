import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const targetDirs = ['dist', 'public'];

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      if (child === '.git' || child === 'node_modules' || targetDirs.includes(child)) continue;
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

targetDirs.forEach(dirName => {
  const targetDir = path.join(ROOT, dirName);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Copy index.html
  fs.copyFileSync(path.join(ROOT, 'index.html'), path.join(targetDir, 'index.html'));

  // Copy css and js
  copyRecursive(path.join(ROOT, 'css'), path.join(targetDir, 'css'));
  copyRecursive(path.join(ROOT, 'js'), path.join(targetDir, 'js'));

  console.log(`[Build] Populated ${dirName}/ successfully.`);
});
