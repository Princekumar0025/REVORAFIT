const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceInDir(fullPath);
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      
      // We want to force all API fetches to directly hit the backend to avoid Vercel proxy loops
      if (content.includes("const API_URL = '';") || content.includes("const API_URL = process.env.NEXT_PUBLIC_API_URL") || content.includes("const API_URL = 'https://revorafit.vercel.app';")) {
        // Ensure every API_URL is absolutely hardcoded to the backend domain
        content = content.replace(/const API_URL = '';/g, "const API_URL = 'https://revorafit.vercel.app';");
        content = content.replace(/const API_URL = process\.env\.NEXT_PUBLIC_API_URL.*?;\s*/g, "const API_URL = 'https://revorafit.vercel.app';\n");
        changed = true;
      }
      
      // Fix inline template strings if any are left
      if (content.includes("fetch(`/api/")) {
        content = content.replace(/fetch\(`\/api\//g, "fetch(`https://revorafit.vercel.app/api/");
        changed = true;
      }
      if (content.includes("fetch('/api/")) {
        content = content.replace(/fetch\('\/api\//g, "fetch('https://revorafit.vercel.app/api/");
        changed = true;
      }
      if (content.includes('fetch("/api/')) {
        content = content.replace(/fetch\("\/api\//g, 'fetch("https://revorafit.vercel.app/api/');
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

console.log('Done restoring absolute backend URLs.');
