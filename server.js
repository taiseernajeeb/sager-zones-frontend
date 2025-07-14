const express = require('express');
const path = require('path');
const app = express();

// Serve static files from dist/
app.use(express.static(path.join(__dirname, 'dist')));

// Always return index.html for any other route (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Use the port Heroku provides, or 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
