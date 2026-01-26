import React from "react";
import "../../userdashboard/dashboard.css";
function Mybooking() {
  // 🔹 Dummy bookings data
  const bookings = [
    {
      id: 1,
      court: "Elite Sports Arena",
      location: "Bengaluru",
      sport: "Badminton",
      date: "30 Jan 2026",
      time: "6:00 PM – 7:00 PM",
      status: "Upcoming",
    },
    {
      id: 2,
      court: "Play Arena",
      location: "Bengaluru",
      sport: "Football",
      date: "25 Jan 2026",
      time: "7:00 PM – 8:00 PM",
      status: "Completed",
    },
    {
      id: 3,
      court: "Ace Badminton Court",
      location: "Chennai",
      sport: "Badminton",
      date: "20 Jan 2026",
      time: "5:00 PM – 6:00 PM",
      status: "Cancelled",
    },
  ];

  const getBadgeClass = (status) => {
    if (status === "Upcoming") return "bg-primary";
    if (status === "Completed") return "bg-success";
    return "bg-danger";
  };

  return (
    <div className="dashboard-section mx-auto mt-5">

      {/* Page Header */}
      <div className="mb-4 text-center">
        <h4 className="fw-bold">My Bookings</h4>
        <p className="text-muted">
          View and manage all your court bookings
        </p>
      </div>

      {/* Booking Cards */}
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="card border-0 shadow-sm mb-3 booking-card"
        >
          <div className="card-body d-flex justify-content-between align-items-center flex-wrap">

            {/* Details */}
            <div>
              <h6 className="fw-semibold mb-1">
                {booking.court}
              </h6>
              <p className="text-muted mb-1">
                📍 {booking.location} • 🏸 {booking.sport}
              </p>
              <p className="text-muted mb-0">
                📅 {booking.date} • ⏰ {booking.time}
              </p>
            </div>

            {/* Status + Action */}
            <div className="text-end mt-3 mt-md-0">
              <span className={`badge ${getBadgeClass(booking.status)} mb-2`}>
                {booking.status}
              </span>

              <div>
                {booking.status === "Upcoming" && (
                  <button className="btn btn-outline-danger btn-sm">
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      ))}
    </div>
  );
}

export default Mybooking;