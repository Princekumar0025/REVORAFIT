const fs = require('fs');
const path = require('path');

const targetFiles = [
  'components/ProductGrid.js',
  'components/FeedbackSection.js',
  'app/product/[slug]/page.js',
  'app/orders/page.js',
  'app/order/[id]/page.js',
  'app/checkout/page.js',
  'app/admin/products/page.js',
  'app/admin/users/page.js',
  'app/admin/orders/page.js',
  'app/admin/coupons/page.js',
  'app/admin/banners/page.js',
  'app/cart/page.js'
];

function replaceInDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (let entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceInDir(fullPath);
    } else if (entry.name.endsWith('.js') && !fullPath.includes('api\\auth')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes("process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'")) {
        content = content.replace(/process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/localhost:5000'/g, "process.env.NEXT_PUBLIC_API_URL || ''");
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'components'));
replaceInDir(path.join(__dirname, 'app'));

console.log('Done replacing API URLs.');
