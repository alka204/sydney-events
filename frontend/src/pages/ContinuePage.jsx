import { useParams } from "react-router-dom";
import { useState } from "react";

function ContinuePage() {
  const { id } = useParams();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!consent) {
      alert("Please give consent to continue");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, eventId: id }),
      });

      const data = await res.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert("Something went wrong");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-xl font-semibold mb-4">Continue to Tickets</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2 rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <span className="text-sm">I agree to receive updates</span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Please wait..." : "Continue to Website"}
        </button>
      </form>
    </div>
  );
}

export default ContinuePage;
