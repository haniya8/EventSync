import React, { useState, useEffect } from "react";
import OrganiserSidebar from "../components/OrganiserSidebar";
import Navbar from "../components/Navbar";
import { api } from "../utils/api";
import { Plus, Edit, Trash2, Users, DollarSign, Ticket, TrendingUp } from "lucide-react";

export const OrganiserDashboard = ({ organiser, onLogout }) => {
  const [activePage, setActivePage] = useState("dashboard");
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [venues, setVenues] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    event_date: "",
    start_time: "",
    end_time: "",
    ticket_price: "",
    allocated_seats: "",
    venue_id: ""
  });

  const [selectedVenueCapacity, setSelectedVenueCapacity] = useState(null);

  useEffect(() => {
    if (organiser) loadData();
    loadVenues();
  }, [organiser]);

  const loadVenues = async () => {
    try {
      const venuesData = await api.get('/venues');
      setVenues(Array.isArray(venuesData) ? venuesData : []);
    } catch (err) {
      console.error("Failed to load venues", err);
      setVenues([]);
    }
  };

  const loadData = async () => {
    try {
      const eventsRes = await api.get(`/organisers/${organiser.organiser_id}/events`);
      const eventsData = Array.isArray(eventsRes) ? eventsRes : [];
      setEvents(eventsData);

      const uniqueCategories = [...new Set(eventsData.map(e => e.CATEGORY).filter(Boolean))];
      setAvailableCategories(uniqueCategories);

      const bookingsRes = await api.get(`/organisers/${organiser.organiser_id}/bookings`);
      const bookingsData = Array.isArray(bookingsRes) ? bookingsRes : [];
      setBookings(bookingsData);

      const statsRes = await api.get(`/organisers/${organiser.organiser_id}/stats`);
      setStats(statsRes);

    } catch (err) {
      console.error("Failed to load data", err);
      setEvents([]);
      setBookings([]);
      setStats(null);
    }
  };

  const handleVenueChange = (venueId) => {
    const selectedVenue = venues.find(v => v.VENUE_ID === parseInt(venueId));
    setFormData({ ...formData, venue_id: venueId });
    setSelectedVenueCapacity(selectedVenue ? selectedVenue.CAPACITY : null);
  };

  const handleSubmit = async () => {
    try {
      if (!formData.title || !formData.event_date || !formData.ticket_price || !formData.allocated_seats || !formData.venue_id) {
        alert("Please fill in all required fields: Title, Date, Price, Seats, and Venue");
        return;
      }

      // Frontend validation for capacity
      if (selectedVenueCapacity && parseInt(formData.allocated_seats) > selectedVenueCapacity) {
        alert(`Cannot create event. Allocated seats (${formData.allocated_seats}) exceed venue capacity (${selectedVenueCapacity})`);
        return;
      }

      if (editingEvent) {
        const updatePayload = {
          organiser_id: organiser.organiser_id,
          venue_id: parseInt(formData.venue_id),
          title: formData.title,
          category: formData.category,
          event_date: formData.event_date,
          start_time: formData.start_time || null,
          end_time: formData.end_time || null,
          ticket_price: parseFloat(formData.ticket_price),
          allocated_seats: parseInt(formData.allocated_seats),
          status: "UPCOMING"
        };
        await api.put(`/events/${editingEvent.EVENT_ID}`, updatePayload);
        alert("Event updated successfully!");
      } else {
        const createPayload = {
          organiser_id: organiser.organiser_id,
          venue_id: parseInt(formData.venue_id),
          title: formData.title,
          category: formData.category,
          event_date: formData.event_date,
          start_time: formData.start_time || null,
          end_time: formData.end_time || null,
          ticket_price: parseFloat(formData.ticket_price),
          allocated_seats: parseInt(formData.allocated_seats)
        };
        await api.post("/events", createPayload);
        alert("Event created successfully!");
      }

      setShowForm(false);
      setEditingEvent(null);
      resetForm();
      loadData();
    } catch (err) {
      console.error("ERROR SAVING EVENT:", err);
      alert(`Failed to save event: ${err.error || err.message || 'Unknown error'}`);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      event_date: "",
      start_time: "",
      end_time: "",
      ticket_price: "",
      allocated_seats: "",
      venue_id: ""
    });
    setSelectedVenueCapacity(null);
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      alert("Event deleted successfully!");
      loadData();
    } catch (err) {
      console.error("Error deleting:", err);
      alert("Failed to delete event");
    }
  };

  const editEvent = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.TITLE,
      category: event.CATEGORY || "",
      event_date: event.EVENT_DATE.split("T")[0],
      start_time: event.START_TIME || "",
      end_time: event.END_TIME || "",
      ticket_price: event.TICKET_PRICE,
      allocated_seats: event.ALLOCATED_SEATS,
      venue_id: event.VENUE_ID
    });
    
    const selectedVenue = venues.find(v => v.VENUE_ID === event.VENUE_ID);
    setSelectedVenueCapacity(selectedVenue ? selectedVenue.CAPACITY : null);
    setShowForm(true);
  };

  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value });
    if (value && !availableCategories.includes(value)) {
      setAvailableCategories([...availableCategories, value]);
    }
  };

  return (
    <div className="flex bg-gray-950 text-gray-200 min-h-screen">
      <OrganiserSidebar active={activePage} onSelect={setActivePage} onLogout={onLogout} />

      <div className="flex-1 flex flex-col max-w-[calc(100vw-16rem)]">
        <Navbar user={organiser} />

        <div className="p-6 overflow-x-hidden">
          {activePage === "dashboard" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-medium text-blue-100">Total Revenue</h3>
                    <DollarSign className="w-6 h-6 text-blue-200" />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    Rs. {stats?.TOTAL_REVENUE ? parseFloat(stats.TOTAL_REVENUE).toLocaleString() : "0"}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-medium text-green-100">Total Bookings</h3>
                    <Ticket className="w-6 h-6 text-green-200" />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {stats?.TOTAL_BOOKINGS || 0}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-4 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-medium text-purple-100">Tickets Sold</h3>
                    <Users className="w-6 h-6 text-purple-200" />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {stats?.TOTAL_TICKETS_SOLD || 0}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-600 to-orange-700 p-4 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-xs font-medium text-orange-100">Active Events</h3>
                    <TrendingUp className="w-6 h-6 text-orange-200" />
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {events.length}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">My Events</h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" /> Create Event
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.isArray(events) && events.length > 0 ? (
                  events.map((ev) => {
                    const totalBookings = ev.TOTAL_BOOKINGS || 0;
                    const ticketsSold = ev.TICKETS_SOLD || 0;
                    const revenue = ev.REVENUE || 0;
                    const ticketsLeft = ev.TICKETS_LEFT || ev.ALLOCATED_SEATS;
                    
                    return (
                      <div
                        key={ev.EVENT_ID}
                        className="bg-gray-900 border border-gray-800 rounded-lg shadow hover:border-blue-600 transition overflow-hidden"
                      >
                        <div className="p-4 pb-3">
                          <h3 className="text-lg font-semibold mb-2 line-clamp-1">{ev.TITLE}</h3>
                          <p className="text-gray-400 mb-1">
                            <span className="inline-block px-2 py-0.5 bg-blue-900/30 rounded text-xs">
                              {ev.CATEGORY || "Uncategorized"}
                            </span>
                          </p>
                          <p className="text-gray-400 text-sm mb-0.5">Venue: {ev.VENUE_NAME || "TBA"}</p>
                          <p className="text-gray-400 text-sm mb-0.5">Date: {new Date(ev.EVENT_DATE).toLocaleDateString()}</p>
                          <p className="text-gray-400 text-sm mb-0.5">Price: Rs. {ev.TICKET_PRICE}</p>
                          <p className="text-gray-400 text-sm">Total Seats: {ev.ALLOCATED_SEATS}</p>
                        </div>
                        <div className="bg-gray-800/50 px-4 py-3 border-t border-gray-700">
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <div className="bg-gray-900/50 p-2 rounded">
                              <p className="text-[10px] text-gray-400 mb-0.5">Bookings</p>
                              <p className="text-base font-bold text-green-400">{totalBookings}</p>
                            </div>
                            <div className="bg-gray-900/50 p-2 rounded">
                              <p className="text-[10px] text-gray-400 mb-0.5">Sold</p>
                              <p className="text-base font-bold text-blue-400">{ticketsSold}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="bg-gray-900/50 p-2 rounded">
                              <p className="text-[10px] text-gray-400 mb-0.5">Revenue</p>
                              <p className="text-xs font-bold text-purple-400">Rs. {revenue.toLocaleString()}</p>
                            </div>
                            <div className="bg-gray-900/50 p-2 rounded">
                              <p className="text-[10px] text-gray-400 mb-0.5">Left</p>
                              <p className="text-base font-bold text-orange-400">{ticketsLeft}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 p-3 bg-gray-800/30">
                          <button
                            onClick={() => editEvent(ev)}
                            className="flex-1 bg-gray-700 hover:bg-gray-600 px-2 py-1.5 rounded flex justify-center items-center gap-1 text-sm"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => deleteEvent(ev.EVENT_ID)}
                            className="flex-1 bg-red-700 hover:bg-red-600 px-2 py-1.5 rounded flex justify-center items-center gap-1 text-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-400 col-span-full">No events found.</p>
                )}
              </div>
            </>
          )}

          {activePage === "bookings" && (
            <>
              <h2 className="text-2xl font-bold mb-4">All Bookings</h2>
              
              {bookings.length > 0 ? (
                <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="text-left p-3">ID</th>
                        <th className="text-left p-3">User</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Phone</th>
                        <th className="text-left p-3">Event</th>
                        <th className="text-left p-3">Tickets</th>
                        <th className="text-left p-3">Amount</th>
                        <th className="text-left p-3">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking) => (
                        <tr key={booking.BOOKING_ID} className="border-t border-gray-800 hover:bg-gray-800/50">
                          <td className="p-3 font-mono text-xs">{booking.BOOKING_ID}</td>
                          <td className="p-3">{booking.USER_NAME}</td>
                          <td className="p-3 text-xs">{booking.USER_EMAIL}</td>
                          <td className="p-3 text-xs">{booking.USER_PHONE}</td>
                          <td className="p-3">{booking.EVENT_TITLE}</td>
                          <td className="p-3">{booking.NUM_TICKETS}</td>
                          <td className="p-3 font-semibold">Rs. {booking.TOTAL_AMOUNT}</td>
                          <td className="p-3 text-xs">{new Date(booking.BOOKING_DATE).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                  <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No bookings yet</p>
                </div>
              )}
            </>
          )}

          {activePage === "profile" && (
            <>
              <h2 className="text-2xl font-bold mb-4">Profile</h2>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-3 max-w-xl">
                <p><strong className="text-gray-400">Name:</strong> {organiser.name}</p>
                <p><strong className="text-gray-400">Email:</strong> {organiser.email}</p>
                <p><strong className="text-gray-400">Organiser ID:</strong> {organiser.organiser_id}</p>
                <p><strong className="text-gray-400">Role:</strong> Event Organiser</p>
              </div>
            </>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 max-w-2xl w-full my-8">
            <h3 className="text-xl font-bold mb-4">
              {editingEvent ? "Edit Event" : "Create Event"}
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="col-span-2">
                <label className="block text-sm mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Category</label>
                <input
                  type="text"
                  list="categories"
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  placeholder="Select or type new"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
                />
                <datalist id="categories">
                  {availableCategories.map((cat, idx) => (
                    <option key={idx} value={cat} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm mb-1">Venue *</label>
                <select
                  value={formData.venue_id}
                  onChange={(e) => handleVenueChange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
                >
                  <option value="">Select Venue</option>
                  {venues.map((venue) => (
                    <option key={venue.VENUE_ID} value={venue.VENUE_ID}>
                      {venue.VENUE_NAME} - {venue.CITY} (Capacity: {venue.CAPACITY})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Event Date *</label>
                <input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Start Time</label>
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">End Time</label>
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Ticket Price (Rs.) *</label>
                <input
                  type="number"
                  value={formData.ticket_price}
                  onChange={(e) => setFormData({ ...formData, ticket_price: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">
                  Allocated Seats * 
                  {selectedVenueCapacity && (
                    <span className="text-gray-400 text-xs ml-2">
                      (Max: {selectedVenueCapacity})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  value={formData.allocated_seats}
                  onChange={(e) => setFormData({ ...formData, allocated_seats: e.target.value })}
                  max={selectedVenueCapacity || undefined}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
                />
                {selectedVenueCapacity && parseInt(formData.allocated_seats) > selectedVenueCapacity && (
                  <p className="text-red-400 text-xs mt-1">
                    Seats exceed venue capacity!
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded font-semibold"
              >
                {editingEvent ? "Update Event" : "Create Event"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingEvent(null);
                  resetForm();
                }}
                className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};