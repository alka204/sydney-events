const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");
const Event = require("../models/Event");

// POST /api/tickets
router.post("/", async (req, res) => {
  try {
    const { email, consent, eventId } = req.body;

    console.log("Incoming ticket request:", req.body);

    const event = await Event.findById(eventId);
    console.log("Found event:", event);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    await Ticket.create({ email, consent, eventId });

    res.json({
      success: true,
      redirectUrl: event.originalUrl || event.url,
    });
  } catch (err) {
    console.error("Ticket save error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
