import { Link } from "react-router-dom";

function EventCard({ event }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <img
        src={event.imageUrl}
        alt={event.title}
        className="h-48 w-full object-cover"
      />

      <div className="p-4">
        <h2 className="text-xl font-semibold">{event.title}</h2>
        <p className="text-gray-500 text-sm">{event.dateTime}</p>
        <p className="text-gray-600 mt-1">{event.venue}</p>
        <p className="text-gray-700 mt-2 line-clamp-3">{event.description}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-gray-500">{event.source}</span>

          <Link
            to={`/continue/${event._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            Get Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
