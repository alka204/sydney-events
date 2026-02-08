// scrapers/scrapeSydneyEvents.js
require("dotenv").config();
const axios = require("axios");
const mongoose = require("mongoose");

// --- MongoDB setup ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- Event schema ---
const eventSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: String,
  description: String,
  url: String,
  start: Object,
  end: Object,
  created: Date,
  changed: Date,
  venue: Object,
});

const Event = mongoose.model("Event", eventSchema);

// --- Scraper ---
const token = process.env.EVENTBRITE_API_KEY;
const baseUrl = "https://www.eventbriteapi.com/v3/events/search/";

async function fetchSydneyEvents() {
  let page = 1;
  let hasMore = true;
  let total = 0;

  console.log("🚀 Starting Eventbrite Sydney scraper...");

  while (hasMore) {
    try {
      const response = await axios.get(baseUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          "location.address": "Sydney",
          expand: "venue",
          page: page,
          page_size: 50,
        },
      });

      const data = response.data;
      const events = data.events;

      if (!events || events.length === 0) {
        console.log("⚡ No more events.");
        break;
      }

      for (const e of events) {
        await Event.findOneAndUpdate(
          { id: e.id },
          {
            id: e.id,
            name: e.name?.text,
            description: e.description?.text || "",
            url: e.url,
            start: e.start,
            end: e.end,
            created: e.created,
            changed: e.changed,
            venue: e.venue || {},
          },
          { upsert: true },
        );
      }

      total += events.length;
      console.log(
        `✅ Page ${page} saved: ${events.length} events (Total: ${total})`,
      );

      hasMore = data.pagination.has_more_items;
      page++;

      // small delay to avoid rate limit
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(
        "❌ Error while fetching events:",
        err.response?.data || err.message,
      );
      break;
    }
  }

  console.log(`🎉 Scraper finished! Total events fetched: ${total}`);
  mongoose.connection.close();
}

fetchSydneyEvents();
