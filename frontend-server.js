const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the toDoList-front-end directory
app.use(express.static(path.join(__dirname, 'toDoList-front-end')));

// Serve index.html for all routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'toDoList-front-end', 'index.html'));
});

app.listen(port, () => {
    console.log(`Frontend server running on port ${port}`);
});
