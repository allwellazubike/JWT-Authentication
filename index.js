const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors');

// create server 
const app = express();

app.use(express.json());

// for frontend requests 
app.use(cors());

// dummy code for the user database, should be replaced with DB 
const users = [
  {
    id: 1,
    email: 'zuko@example.com',
    password: 'password123',
    name: 'Zuko'
  }
];

// Add this to index.js after the existing code
// POST /register - Create a new user account

app.post('/register', async (req, res) => {
  console.log('Registration request received:', req.body);
  const { email, password, name } = req.body;
  
  // 2. VALIDATION - Check if they sent what we need
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password are required' 
    });
  }
  
  // 3. Check if user already exists
  const userExists = users.find(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ 
      error: 'User already exists' 
    });
  }
  
  // 4. Create new user
  // In a real app, you would:
  // - Hash the password using bcrypt
  // - Save to real database
  // - Generate a unique ID
  const newUser = {
    id: users.length + 1,
    email,
    password, // NEVER DO THIS IN REAL LIFE!
    name: name || 'User'
  };

console.log(newUser)
  
  // 5. Add to our fake database
  users.push(newUser);
  
  // 6. Send success response
  res.status(201).json({
    message: 'User created successfully',
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name
    }
  });
});

// POST /login - Authenticate user and return JWT token

app.post('/login', (req, res) => {
  console.log('Login attempt:', req.body);
  
  // 1. Get credentials from request
  const { email, password } = req.body;
  
  // 2. Validate input
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password are required' 
    });
  }
  
  // 3. Find user in our fake database
  const user = users.find(user => user.email === email);
  
  // 4. Check if user exists AND password matches
  // NEVER store plain passwords like this in real life!
  if (!user || user.password !== password) {
    return res.status(401).json({ 
      error: 'Invalid credentials' 
    });
  }
  
  // 5. SUCCESSFUL LOGIN! Now we create the JWT
  
  // First, decide WHAT data to put in the token
  // This is called the "payload" - it's the data we want to carry
  const payload = {
    userId: user.id,      // We'll need this to identify the user
    email: user.email,    // Maybe display on frontend
    name: user.name       // Maybe display on frontend
  };
  
  // Second, decide WHEN the token expires
  // This is very important for security!
  const expiresIn = '1h';  // Token valid for 1 hour
  
  // THIRD AND MOST IMPORTANT: SIGN THE TOKEN
  // This creates the actual JWT string
  try {
    const token = jwt.sign(
      payload,                    // What we're storing
      process.env.JWT_SECRET,     // Our secret "stamp"
      { expiresIn }              // When it expires
    );
    
    // 6. Send the token back to the client
    res.json({
      message: 'Login successful',
      token,                     // This is the JWT!
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
    
  } catch (error) {
    console.error('Token creation error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// route to test server
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// start server here 
const PORT = 2000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});