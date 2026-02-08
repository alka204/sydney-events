const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = function (app) {
  // --- Initialize Passport ---
  app.use(passport.initialize());
  app.use(passport.session()); // relies on session middleware from index.js

  // --- Google OAuth strategy ---
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/auth/google/callback", // match Google Console
      },
      function (accessToken, refreshToken, profile, done) {
        console.log("Google profile:", profile);
        // ✅ Here you can save/find user in DB
        return done(null, profile);
      },
    ),
  );

  // --- Serialize/Deserialize user for session ---
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  // --- Routes ---

  // Start Google OAuth login
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] }),
  );

  // OAuth callback
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login", // fallback page if login fails
      session: true, // ensures session is stored
    }),
    (req, res) => {
      // ✅ Redirect to frontend dashboard after successful login
      res.redirect("http://localhost:5173/dashboard");
    },
  );

  // Logout route
  app.get("/logout", (req, res, next) => {
    req.logout(function (err) {
      if (err) return next(err);
      res.redirect("http://localhost:5173/"); // redirect to frontend homepage
    });
  });
};
