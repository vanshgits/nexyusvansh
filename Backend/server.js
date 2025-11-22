const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();

// connect to DB
connectDB();

// middleware
app.use(cors({ origin: 'http://localhost:4200' })); // adjust if your Angular uses another port
app.use(express.json());

// routes
const userRoutes = require('./src/routes/userRoutes');
app.use('/api/users', userRoutes);

// health check
app.get('/', (req, res) => {
  res.send('Nexyus backend is running');
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});





// Passport OAuth setup
const passport = require("./src/config/passport");
const session = require("express-session");

app.use(
  session({
    secret: "secret123",
    resave: false,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", require("./src/routes/oauthRoutes"));
