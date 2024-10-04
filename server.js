const http = require('http');

// Define the server and request handler
const server = http.createServer((req, res) => {
  // Set the response header for all responses
  res.setHeader('Content-Type', 'text/plain');

  if (req.method === 'GET' && req.url === '/') {
    // Default route handler
    res.statusCode = 200;
    res.end('Hello, World!');
  } else if (req.method === 'GET' && req.url === '/about') {
    // Additional GET endpoint handler
    res.statusCode = 200;
    res.end('Welcome to the About Page!');
  } else {
    // 404 for other routes
    res.statusCode = 404;
    res.end('404 Not Found');
  }
});

// Server listens on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
