const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  email: { type: String, required: true },
  consent: { type: Boolean, required: true },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ticket", ticketSchema);
