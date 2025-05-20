// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const VIEWS_DIR = path.join(__dirname, 'views');

// Middleware
app.use(cors({ optionsSuccessStatus: 200 })); 
app.use(express.static(PUBLIC_DIR)); 

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(VIEWS_DIR, 'index.html'));
});


app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' });
});

app.get('/api/:date?', (req, res) => {
  try {
    let date;
    const inputDate = req.params.date;

    if (!inputDate) {
      date = new Date();
    } else {
    
      const unixTimestamp = Number(inputDate);
      date = isNaN(unixTimestamp) 
        ? new Date(inputDate) 
        : new Date(unixTimestamp);
    }

    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: 'Invalid Date' });
    }

    res.json({
      unix: date.getTime(),
      utc: date.toUTCString()
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  } else {
    console.error('Server error:', error);
  }
});

// Export app for testing
module.exports = app;