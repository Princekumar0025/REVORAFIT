const https = require('https');

https.get('https://revorafit-frontend.vercel.app', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Find all JS files
    const matches = data.match(/src="([^"]+\.js[^"]*)"/g);
    if (!matches) {
      console.log('No JS files found');
      return;
    }
    
    let pending = matches.length;
    let foundNew = false;
    let foundOld = false;
    
    matches.forEach(match => {
      const src = match.match(/src="([^"]+)"/)[1];
      const url = src.startsWith('http') ? src : `https://revorafit-frontend.vercel.app${src.startsWith('/') ? '' : '/'}${src}`;
      
      https.get(url, (scriptRes) => {
        let scriptData = '';
        scriptRes.on('data', chunk => scriptData += chunk);
        scriptRes.on('end', () => {
          if (scriptData.includes('fetch("/api/feedback")') || scriptData.includes('fetch(`/api/feedback`)')) {
            console.log(`FOUND NEW CODE IN ${url} !!!`);
            foundNew = true;
          }
          if (scriptData.includes('process.env.NEXT_PUBLIC_API_URL') || scriptData.includes('http://localhost:5000')) {
            // It might contain NEXT_PUBLIC_API_URL because Next.js bakes it in as a string
          }
          
          pending--;
          if (pending === 0) {
            console.log(`New code found: ${foundNew}`);
            console.log('Done checking.');
          }
        });
      }).on('error', () => {
        pending--;
      });
    });
  });
});
