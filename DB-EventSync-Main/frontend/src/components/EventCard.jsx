import { Calendar, MapPin, Clock, DollarSign } from "lucide-react";
import { getDescription } from "../utils/descriptions";

export default function EventCard({ event, onBook }) {
  return (
    <div className="bg-gray-900/70 border border-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition backdrop-blur">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full">
          {event.CATEGORY || "General"}
        </span>
        <span className="text-green-400 font-semibold">
          Rs. {event.TICKET_PRICE}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-3 text-gray-100">{event.TITLE}</h3>

      <p className="text-gray-400 text-sm mb-4">
        {getDescription(event.CATEGORY)}
      </p>

      <div className="space-y-2 text-sm text-gray-400 mb-6">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          {new Date(event.EVENT_DATE).toLocaleDateString()}
        </div>

        <div className="flex items-center gap-2">
          <Clock size={16} />
          {event.START_TIME} – {event.END_TIME}
        </div>

        <div className="flex items-center gap-2">
          <MapPin size={16} />
          {event.VENUE_NAME}, {event.CITY}
        </div>
      </div>

      <button
        onClick={() => onBook(event)}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white transition shadow"
      >
        Book Now
      </button>
    </div>
  );
}
