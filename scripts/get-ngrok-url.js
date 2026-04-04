const http = require('http');

let attempts = 0;

function checkUrl() {
  http.get('http://127.0.0.1:4040/api/tunnels', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.tunnels && parsed.tunnels.length > 0) {
          const url = parsed.tunnels[0].public_url;
          console.log('\n\x1b[32m=============================================================\x1b[0m');
          console.log('\x1b[32m🚀 ngrok is ready! Your public URL is:\x1b[0m', '\x1b[36m' + url + '\x1b[0m');
          console.log('\x1b[32m=============================================================\x1b[0m\n');
          process.exit(0);
        } else {
          // Tunnel array exists but is empty, keep waiting
          retry();
        }
      } catch (err) {
        retry();
      }
    });
  }).on('error', retry);
}

function retry() {
  attempts++;
  if (attempts > 30) {
    console.log("Could not find ngrok URL. Ensure ngrok is authenticated and running.");
    process.exit(1);
  }
  setTimeout(checkUrl, 1000);
}

// Start checking after a brief delay to allow ngrok to spin up
setTimeout(checkUrl, 2000);
