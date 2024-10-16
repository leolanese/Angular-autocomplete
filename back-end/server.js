const express = require('express');
const http = require('http');
const fs = require('fs');
const cors = require('cors'); 

const app = express();
app.use(cors());

// http://localhost:3000/
app.get('/', (req, res) => {
  res.send('landing here by /');
});

// http://localhost:3000/world-cities.txt
app.get('/world-cities.txt', (req, res) => {
  fs.readFile('world-cities.txt', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.setHeader('Content-Type', 'application/javascript'); // Set MIME type to JavaScript
      res.status(200).send(data);
    }
  });
});

// Route to serve JavaScript worker file with the correct MIME type
app.get('/trie.worker.js', (req, res) => {
  fs.readFile('./trie.worker.js', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.setHeader('Content-Type', 'application/javascript'); // Set MIME type to JavaScript
      res.status(200).send(data);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});