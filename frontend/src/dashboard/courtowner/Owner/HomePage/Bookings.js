import React, { useState, useEffect } from "react";
import api from "../../../../api";
import "../Home.css";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      console.log("[Bookings] Fetching today's bookings...");
      const res = await api.get("/owner/earnings-history");
      console.log("[Bookings] API Response:", res.data);
      const bookingsArray = res.data.todayBookings || [];
      console.log("[Bookings] Setting:", bookingsArray.length, "bookings");
      setBookings(bookingsArray);
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("[Bookings] Failed to fetch bookings:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load bookings");
      setLoading(false);
    }
  };

  // ✅ Improved badge logic
  const getBadgeClass = (bookingStatus, paymentStatus) => {
    if (bookingStatus === "cancelled") return "bg-danger";
    if (paymentStatus === "completed") return "bg-success";
    if (paymentStatus === "pending") return "bg-warning";
    return "bg-secondary";
  };

  // ✅ Better status label
  const getStatusLabel = (bookingStatus, paymentStatus) => {
    if (bookingStatus === "cancelled") return "Cancelled";
    if (paymentStatus === "completed") return "Paid";
    if (paymentStatus === "pending") return "Pending";
    return bookingStatus
      ? bookingStatus.charAt(0).toUpperCase() + bookingStatus.slice(1)
      : "Unknown";
  };

  // ✅ Better time format (AM/PM)
  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    const [hours, minutes] = timeStr.split(":");
    let h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-semibold mb-0">Today’s Bookings</h6>
          <span className="badge bg-info">{bookings.length} bookings</span>
        </div>
        {error && (
          <div className="alert alert-danger mb-3" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}
        {loading ? (
          <p className="text-muted text-center mb-0">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-muted text-center mb-0">
            No bookings for today.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-borderless align-middle mb-0">
              <thead className="text-muted small">
                <tr>
                  <th>Court</th>
                  <th>Sport</th>
                  <th>Time</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    {/* ✅ Handles both camelCase and snake_case */}
                    <td className="fw-semibold">
                      {b.courtName || b.court_name}
                    </td>
                    <td>{b.sport}</td>
                    <td>{formatTime(b.time || b.slot_time)}</td>
                    <td>{b.userName || b.user_name}</td>
                    <td className="fw-bold">
                      ₹{(b.amount || 0).toLocaleString("en-IN")}
                    </td>
                    <td>
                      <span
                        className={`badge ${getBadgeClass(
                          b.bookingStatus || b.booking_status,
                          b.paymentStatus || b.payment_status
                        )}`}
                      >
                        {getStatusLabel(
                          b.bookingStatus || b.booking_status,
                          b.paymentStatus || b.payment_status
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default Bookings;