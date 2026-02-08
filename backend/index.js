require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const auth = require("./auth");
const eventRoutes = require("./routes/eventRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

// ✅ Allowed origins (React dev servers)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

// ✅ Dynamic CORS middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin); // dynamically allow origin
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );

  // Handle OPTIONS preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// ✅ Body parser
app.use(express.json());

// ✅ Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret_key_here",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  }),
);

// ✅ Passport / auth initialization
auth(app);

// ✅ API routes
app.use("/api/events", eventRoutes);
app.use("/api/tickets", ticketRoutes);

// ✅ Protected route example
app.get("/admin-dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.send("Welcome to Admin Dashboard");
  } else {
    res.redirect("/login");
  }
});

// ✅ Route to check logged-in user
app.get("/auth/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

// ✅ MongoDB connection & server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`✅ Server running on http://localhost:${PORT}`),
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
