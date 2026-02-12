
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors');

// create server 
const app = express();

app.use(express.json());

// for frontend requests 
app.use(cors());

const users = [
  {
    id: 1,
    email: 'zuko@example.com',
    password: 'password123',
    name: 'Zuko'
  }
];

// route to test server
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});