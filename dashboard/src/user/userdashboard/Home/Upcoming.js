import React from "react";
import "../../userdashboard/dashboard.css";
function Upcoming() {
  // FRONTEND DUMMY DATA
  const booking = {
    courtName: "Elite Sports Arena",
    date: "30 Jan 2026",
    time: "6:00 PM – 7:00 PM",
    location: "Bengaluru",
    status: "Confirmed",
  };

  return (
    <div className="card border-0 shadow-sm upcoming-booking-card">
      <div className="card-body">

        <h5 className="fw-semibold mb-3 text-center">
          Upcoming Booking
        </h5>

        <div className="d-flex justify-content-between align-items-center flex-wrap">

          {/* Booking Details */}
          <div>
            <h6 className="fw-semibold mb-1">
              {booking.courtName}
            </h6>
            <p className="text-muted mb-1">
              📅 {booking.date} • ⏰ {booking.time}
            </p>
            <p className="text-muted mb-0">
              📍 {booking.location}
            </p>
          </div>

          {/* Status + Actions */}
          <div className="mt-3 mt-md-0 text-end">
            <span className="badge bg-success mb-2">
              {booking.status}
            </span>

            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-outline-primary btn-sm">
                View Booking
              </button>
              <button className="btn btn-outline-danger btn-sm">
                Cancel
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Upcoming;
