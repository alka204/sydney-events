import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Check if user is logged in
  useEffect(() => {
    fetch("http://localhost:5000/auth/user", {
      credentials: "include",
    })
      .then((res) => {
        if (res.status !== 200) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        if (!data.user) throw new Error("No user data");
        setUser(data.user); // store user info if needed
      })
      .catch(() => navigate("/")); // redirect to homepage if not logged in
  }, [navigate]);

  // Fetch events
  useEffect(() => {
    fetch("http://localhost:5000/api/events", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error("Failed to load events", err));
  }, []);

  // Import event
  const importEvent = async (id) => {
    try {
      setLoading(true);

      const res = await fetch(`http://localhost:5000/api/events/${id}/import`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user?.emails?.[0]?.value || "admin@example.com",
          importNotes: "Imported from dashboard",
        }),
        credentials: "include", // include session cookie
      });

      const data = await res.json();

      // Update events list
      setEvents((prev) => prev.map((e) => (e._id === id ? data.event : e)));

      // Update preview panel if same event selected
      if (selectedEvent && selectedEvent._id === id) {
        setSelectedEvent(data.event);
      }
    } catch (err) {
      console.error("Import failed", err);
      alert("Import failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  return (
    <div className="p-6 flex gap-6">
      {/* Left: Table */}
      <div className="w-2/3">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Title</th>
              <th className="border p-2">City</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr
                key={e._id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => setSelectedEvent(e)}
              >
                <td className="border p-2">{e.title}</td>
                <td className="border p-2">{e.city}</td>
                <td className="border p-2">{formatDate(e.dateTime)}</td>

                {/* Status badge */}
                <td className="border p-2">
                  <span
                    className={`px-2 py-1 rounded text-white text-sm ${
                      e.status === "new"
                        ? "bg-green-500"
                        : e.status === "updated"
                          ? "bg-orange-500"
                          : e.status === "inactive"
                            ? "bg-red-500"
                            : e.status === "imported"
                              ? "bg-blue-600"
                              : "bg-gray-500"
                    }`}
                  >
                    {e.status}
                  </span>
                </td>

                <td className="border p-2">
                  <button
                    disabled={e.status === "imported" || loading}
                    className={`px-3 py-1 rounded text-white ${
                      e.status === "imported"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      importEvent(e._id);
                    }}
                  >
                    {e.status === "imported" ? "Imported" : "Import"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right: Preview */}
      <div className="w-1/3 bg-white p-4 rounded shadow">
        {selectedEvent ? (
          <>
            <h2 className="text-xl font-bold mb-2">{selectedEvent.title}</h2>
            <p>
              <b>Date:</b> {formatDate(selectedEvent.dateTime)}
            </p>
            <p>
              <b>Venue:</b> {selectedEvent.venue}
            </p>
            <p>
              <b>Description:</b> {selectedEvent.description}
            </p>
            <p>
              <b>Status:</b>{" "}
              <span className="font-semibold">{selectedEvent.status}</span>
            </p>
          </>
        ) : (
          <p>Select an event to preview</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
