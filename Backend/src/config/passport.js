const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/User");

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// =============== GOOGLE ===============
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_REDIRECT + "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email returned from Google"));
        }

        let user = await User.findOne({ email });

        if (!user) {
          const passwordHash = await bcrypt.hash("oauth-google", 10);

          user = await User.create({
            firstName: profile.name?.givenName || "Google",
            lastName: profile.name?.familyName || "User",
            email,
            passwordHash,
            provider: "google",
            providerId: profile.id
          });
        }

        done(null, user);
      } catch (err) {
        console.error("GoogleStrategy error:", err);
        done(err);
      }
    }
  )
);

// =============== GITHUB ===============
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_REDIRECT + "/api/auth/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Try to find by email first (if provided)
        const email =
          profile.emails?.[0]?.value || `${profile.username}@github.com`;

        let user = await User.findOne({ email });

        if (!user) {
          const passwordHash = await bcrypt.hash("oauth-github", 10);

          user = await User.create({
            firstName: profile.displayName || profile.username || "Github",
            lastName: "User",
            email,
            passwordHash,
            provider: "github",
            providerId: profile.id
          });
        }

        done(null, user);
      } catch (err) {
        console.error("GitHubStrategy error:", err);
        done(err);
      }
    }
  )
);

// =============== FACEBOOK ===============
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.OAUTH_REDIRECT + "/api/auth/facebook/callback",
      profileFields: ["id", "emails", "name"]
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          profile.emails?.[0]?.value || `${profile.id}@facebook.com`;

        let user = await User.findOne({ email });

        if (!user) {
          const passwordHash = await bcrypt.hash("oauth-facebook", 10);

          user = await User.create({
            firstName: profile.name?.givenName || "FB",
            lastName: profile.name?.familyName || "User",
            email,
            passwordHash,
            provider: "facebook",
            providerId: profile.id
          });
        }

        done(null, user);
      } catch (err) {
        console.error("FacebookStrategy error:", err);
        done(err);
      }
    }
  )
);

module.exports = passport;
