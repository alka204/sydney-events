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
        setUser(data.user);
      })
      .catch(() => navigate("/"));
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
        credentials: "include",
      });

      const data = await res.json();

      setEvents((prev) => prev.map((e) => (e._id === id ? data.event : e)));

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

  const total = events.length;
  const imported = events.filter((e) => e.status === "imported").length;
  const pending = events.filter((e) => e.status !== "imported").length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-blue-600">
          <p className="text-gray-500">Total Events</p>
          <p className="text-3xl font-bold text-blue-700">{total}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-green-500">
          <p className="text-gray-500">Imported</p>
          <p className="text-3xl font-bold text-green-600">{imported}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow border-l-4 border-orange-500">
          <p className="text-gray-500">Pending</p>
          <p className="text-3xl font-bold text-orange-600">{pending}</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left: Table */}
        <div className="w-2/3 bg-white rounded-xl shadow p-4">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Events List
          </h2>

          <table className="w-full text-sm">
            <thead className="bg-blue-50 text-blue-700">
              <tr>
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left">City</th>
                <th className="p-2 text-left">Date</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr
                  key={e._id}
                  className="border-b hover:bg-blue-50 cursor-pointer"
                  onClick={() => setSelectedEvent(e)}
                >
                  <td className="p-2">{e.title}</td>
                  <td className="p-2">{e.city}</td>
                  <td className="p-2">{formatDate(e.dateTime)}</td>

                  <td className="p-2">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-xs ${
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

                  <td className="p-2">
                    <button
                      disabled={e.status === "imported" || loading}
                      className={`px-4 py-1 rounded-lg text-white text-sm ${
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
        <div className="w-1/3 bg-white p-5 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Event Preview
          </h2>

          {selectedEvent ? (
            <>
              <h3 className="text-lg font-bold mb-2">{selectedEvent.title}</h3>
              <p className="mb-1">
                <b>Date:</b> {formatDate(selectedEvent.dateTime)}
              </p>
              <p className="mb-1">
                <b>Venue:</b> {selectedEvent.venue}
              </p>
              <p className="mb-1">
                <b>Description:</b> {selectedEvent.description}
              </p>
              <p className="mb-1">
                <b>Status:</b>{" "}
                <span className="font-semibold text-blue-700">
                  {selectedEvent.status}
                </span>
              </p>
            </>
          ) : (
            <p className="text-gray-500">Select an event to preview</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
