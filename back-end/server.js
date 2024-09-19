const express = require('express');
const http = require('http');
const fs = require('fs');
const cors = require('cors'); 

const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('landing here by /');
});

app.get('/world-cities.txt', (req, res) => {
  fs.readFile('world-cities.txt', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send(data);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});