export default function BookingModal({
  event,
  numTickets,
  setNumTickets,
  paymentMethod,
  setPaymentMethod,
  onConfirm,
  onClose,
}) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-lg p-6 max-w-md w-full">
        <h3 className="text-2xl font-bold mb-4 text-gray-100">{event.TITLE}</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">Number of Tickets</label>
            <input
              type="number"
              min="1"
              className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200"
              value={numTickets}
              onChange={(e) => setNumTickets(parseInt(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Payment Method</label>
            <select
              className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option>Credit Card</option>
              <option>EasyPaisa</option>
              <option>JazzCash</option>
            </select>
          </div>

          <div className="text-lg font-semibold text-gray-100">
            Total: Rs. {event.TICKET_PRICE * numTickets}
          </div>

          <div className="flex gap-2 pt-3">
            <button
              onClick={onConfirm}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white"
            >
              Confirm
            </button>

            <button
              onClick={onClose}
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium text-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
