const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: String,
    dateTime: String,
    venue: String,
    address: String,
    city: String,
    description: String,
    category: String,
    imageUrl: String,
    source: String,
    originalUrl: String,

    status: {
      type: String,
      enum: ["new", "updated", "inactive", "imported"],
      default: "new",
    },

    lastScrapedAt: Date,

    importedAt: Date,
    importedBy: String,
    importNotes: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", eventSchema);
