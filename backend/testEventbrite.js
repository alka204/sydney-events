require("dotenv").config();
const axios = require("axios");

const token = process.env.EVENTBRITE_API_KEY;

async function test() {
  try {
    const res = await axios.get("https://www.eventbriteapi.com/v3/users/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("USER API OK:", res.data.name);
  } catch (e) {
    console.log("USER API FAIL:", e.response?.data || e.message);
  }

  try {
    const res2 = await axios.get(
      "https://www.eventbriteapi.com/v3/events/search/",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          "location.address": "Sydney",
        },
      },
    );
    console.log("EVENT SEARCH OK:", res2.data.events.length);
  } catch (e) {
    console.log("EVENT SEARCH FAIL:", e.response?.data || e.message);
  }
}

test();
