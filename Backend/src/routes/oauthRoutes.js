const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: process.env.FRONTEND_URL + "/login" }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL + "/home");
  }
);

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: process.env.FRONTEND_URL + "/login" }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL + "/home");
  }
);

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: process.env.FRONTEND_URL + "/login" }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL + "/home");
  }
);




// Placeholder Google route
router.get('/google', (req, res) => {
  res.send('Google OAuth placeholder – backend is working ✅');
});

// Placeholder GitHub route
router.get('/github', (req, res) => {
  res.send('GitHub OAuth placeholder – backend is working ✅');
});

// Placeholder Facebook route
router.get('/facebook', (req, res) => {
  res.send('Facebook OAuth placeholder – backend is working ✅');
});
module.exports = router;
