const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceInDir(fullPath);
    } else if (entry.name.endsWith('.js') && !fullPath.includes('api\\auth') && !fullPath.includes('api/auth')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Replace variations of the API URL assignment
      let changed = false;
      
      if (content.includes("const API_URL = process.env.NEXT_PUBLIC_API_URL || '';")) {
        content = content.replace(/const API_URL = process\.env\.NEXT_PUBLIC_API_URL \|\| '';/g, "const API_URL = '';");
        changed = true;
      }
      
      if (content.includes("${process.env.NEXT_PUBLIC_API_URL || ''}")) {
        content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| ''\}/g, "");
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'components'));
replaceInDir(path.join(__dirname, 'app'));

console.log('Done replacing API URLs.');
