import { useEffect, useState } from "react";
import EventCard from "./components/EventCard";

function App() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch events
  useEffect(() => {
    fetch("http://localhost:5000/api/events", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Failed to fetch events:", err));
  }, []);

  // Check if user is logged in
  useEffect(() => {
    fetch("http://localhost:5000/auth/user", { credentials: "include" })
      .then((res) => {
        if (res.status === 200) return res.json();
        return null;
      })
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/logout", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        setUser(null); // 🔥 immediately updates UI
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-blue-600 text-white p-6 shadow-md flex items-center justify-between max-w-7xl mx-auto">
        <div className="text-3xl font-extrabold">Sydney Events</div>

        {/* Admin Login / Logout Button */}
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        ) : (
          <a
            href="http://localhost:5000/auth/google"
            className="bg-green-600 px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Admin Login
          </a>
        )}
      </header>

      {/* Event Grid */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
}

export default App;
