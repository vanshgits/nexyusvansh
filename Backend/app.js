const express = require('express');
const cors = require('cors');
require('dotenv').config();

const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// --- NEW IMPORTS ---
const passport = require('passport');
const session = require('express-session');
// --- END NEW IMPORTS ---

dotenv.config();

// --- PASSPORT CONFIGURATION IMPORT ---
// This line executes your passport-setup.js file, making the 'google', 'github', etc. strategies available.
require('./src/config/passport'); // **Verify this path is correct**
// --- END PASSPORT CONFIGURATION IMPORT ---

const app = express();

// connect to MongoDB
connectDB();

// middleware
app.use(cors({ origin: 'http://localhost:4200' })); // change if your Angular runs elsewhere
app.use(express.json());

// --- SESSION AND PASSPORT MIDDLEWARE (MUST COME BEFORE ROUTES) ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'a-strong-default-secret', // Use a strong secret from .env
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // Session duration (e.g., 24 hours)
  })
);

app.use(passport.initialize()); // Initializes Passport
app.use(passport.session());    // Enables Passport to use Express sessions for persistent login
// --- END PASSPORT MIDDLEWARE ---


// ------------------------------------
// ✅ ROUTES
// ------------------------------------

// 1. Regular routes
const userRoutes = require('./src/routes/userRoutes');
app.use('/api/users', userRoutes);

// 2. OAuth routes 
const oauthRoutes = require('./src/routes/oauthRoutes'); // <-- Now correctly defined
app.use('/api/auth', oauthRoutes); 

// 3. Simple test route
app.get('/', (req, res) => {
  res.send('Nexyus backend is running');
});
// ------------------------------------


// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});