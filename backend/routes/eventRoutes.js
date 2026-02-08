const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// GET all events
router.get("/", async (req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

// POST create event (for testing)
router.post("/", async (req, res) => {
  const event = new Event(req.body);
  await event.save();
  res.json({ message: "Event saved ✅", event });
});

// PUT import event
router.put("/:id/import", async (req, res) => {
  try {
    const { userEmail, importNotes } = req.body;

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        status: "imported",
        importedAt: new Date(),
        importedBy: userEmail || "admin",
        importNotes: importNotes || "",
      },
      { new: true },
    );

    res.json({ message: "Event imported ✅", event });
  } catch (err) {
    res.status(500).json({ error: "Import failed ❌" });
  }
});

module.exports = router;
