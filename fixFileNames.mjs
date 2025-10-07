import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fixNames(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      fixNames(fullPath);
    } else {
      if (file.includes('С')) {
        const fixedName = file.replace(/С/g, 'C');
        const newPath = path.join(dir, fixedName);
        fs.renameSync(fullPath, newPath);
        console.log(`✅ Renamed: ${file} → ${fixedName}`);
      }
    }
  });
}

fixNames(path.join(__dirname, 'src'));
