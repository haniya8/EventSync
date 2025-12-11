import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import BookingModal from "../components/BookingModal";
import { api } from "../utils/api";

export const UserDashboard = ({ user, onLogout }) => {
  const [activePage, setActivePage] = useState("dashboard");
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [numTickets, setNumTickets] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  // Load events and bookings
  const loadData = async () => {
    try {
      const e = await api.get("/events/upcoming");
      const b = await api.get(`/bookings/user/${user.CNIC}`);
      setEvents(e);
      setBookings(b);
    } catch (err) {
      console.error(err);
      alert("Failed to load data");
    }
  };

  // Handle booking with sold out check
  const handleBooking = async () => {
    if (!selectedEvent) return;
    try {
      const res = await api.post("/bookings", {
        cnic: user.CNIC,
        event_id: selectedEvent.EVENT_ID,
        num_tickets: numTickets,
        payment_method: paymentMethod,
      });

      // Check if there's an error in the response
      if (res.error) {
        alert(res.error);
        return;
      }

      alert("Booking successful!");
      setSelectedEvent(null);
      setNumTickets(1);
      loadData();
    } catch (err) {
      console.error(err);
      //  Show specific error message from backend
      const errorMessage = err.message || "Booking failed";
      alert(errorMessage);
    }
  };

  //  Cancel booking
  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      // Make the API call
      const response = await fetch(`http://localhost:3001/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to cancel booking');
      }

      alert("Booking cancelled successfully!");
      loadData(); // Reload data to show updated status
    } catch (err) {
      console.error("Cancel booking error:", err);
      alert(err.message || "Failed to cancel booking");
    }
  };

  return (
    <div className="flex bg-gray-950 text-gray-200 min-h-screen">
      {/* Sidebar */}
      <Sidebar
        active={activePage}
        onSelect={setActivePage}
        onLogout={onLogout}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Navbar user={user} />

        <div className="p-8">
          {/* Dashboard Page */}
          {activePage === "dashboard" && (
            <>
              <h2 className="text-3xl font-bold mb-6">Available Events</h2>
              {events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((ev) => (
                    <EventCard
                      key={ev.EVENT_ID}
                      event={ev}
                      onBook={setSelectedEvent}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                  <p className="text-gray-400 text-lg">No upcoming events available</p>
                </div>
              )}
            </>
          )}

          {/* Tickets Page */}
          {activePage === "tickets" && (
            <>
              <h2 className="text-3xl font-bold mb-6">My Tickets</h2>
              {bookings.length > 0 ? (
                <div className="bg-gray-900/60 border border-gray-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-800/50">
                      <tr>
                        <th className="p-4">Booking ID</th>
                        <th className="p-4">Event</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Tickets</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.BOOKING_ID} className="border-t border-gray-800 hover:bg-gray-800/30">
                          <td className="p-4 font-mono text-sm">{b.BOOKING_ID}</td>
                          <td className="p-4">{b.EVENT_TITLE}</td>
                          <td className="p-4 text-sm">
                            {new Date(b.BOOKING_DATE).toLocaleDateString()}
                          </td>
                          <td className="p-4">{b.NUM_TICKETS}</td>
                          <td className="p-4 font-semibold">Rs. {b.TOTAL_AMOUNT}</td>
                          <td className="p-4">
                            {b.STATUS !== "CANCELLED" ? (
                              <button
                                onClick={() => cancelBooking(b.BOOKING_ID)}
                                className="bg-red-600 hover:bg-red-500 px-3 py-1.5 rounded text-sm font-medium transition"
                              >
                                Cancel
                              </button>
                            ) : (
                              <span className="text-gray-500 text-sm">Cancelled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
                  <p className="text-gray-400 text-lg">No bookings yet</p>
                  <p className="text-gray-500 text-sm mt-2">Book your first event from the dashboard!</p>
                </div>
              )}
            </>
          )}

          {/* Profile Page */}
          {activePage === "profile" && (
            <>
              <h2 className="text-3xl font-bold mb-6">Profile</h2>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-2">
                <p><strong>Name:</strong> {user.NAME}</p>
                <p><strong>Email:</strong> {user.EMAIL}</p>
                <p><strong>Phone:</strong> {user.PHONE}</p>
                <p><strong>CNIC:</strong> {user.CNIC}</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        event={selectedEvent}
        numTickets={numTickets}
        setNumTickets={setNumTickets}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        onConfirm={handleBooking}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
};