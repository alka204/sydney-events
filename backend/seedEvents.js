require("dotenv").config();
const mongoose = require("mongoose");
const Event = require("./models/Event");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ DB error:", err));

const demoEvents = [
  {
    title: "Sydney Music Festival",
    dateTime: "2026-03-10 19:00",
    venue: "Sydney Opera House",
    address: "Bennelong Point, Sydney",
    city: "Sydney",
    description: "A great night of live music in the heart of Sydney.",
    image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
    source: "DemoSource",
    originalUrl: "https://www.sydneyoperahouse.com/whats-on", // ✅ working
    status: "new",
    lastScrapedAt: new Date(),
  },
  {
    title: "Tech Meetup Sydney",
    dateTime: "2026-03-15 10:00",
    venue: "Startup Hub",
    address: "George Street, Sydney",
    city: "Sydney",
    description: "Meet developers and startup founders.",
    image: "https://images.unsplash.com/photo-1515169067865-5387ec356754",
    source: "DemoSource",
    originalUrl: "https://www.meetup.com/sydney-tech-meetup/", // ✅ working
    status: "new",
    lastScrapedAt: new Date(),
  },
];

async function seed() {
  try {
    await Event.deleteMany();
    await Event.insertMany(demoEvents);
    console.log("🎉 Demo events inserted!");
  } catch (err) {
    console.error("❌ Seed error:", err);
  } finally {
    mongoose.connection.close();
  }
}

seed();
