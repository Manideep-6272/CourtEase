import React from "react";
import "../Home.css";
function Bookings() {
  // Dummy data (frontend only)
  const bookings = [
    {
      id: 1,
      court: "Elite Sports Arena",
      sport: "Badminton",
      time: "6:00 PM – 7:00 PM",
      user: "Aman",
      status: "Confirmed",
    },
    {
      id: 2,
      court: "Play Arena",
      sport: "Football",
      time: "7:00 PM – 8:00 PM",
      user: "Rahul",
      status: "Confirmed",  
    },
    {
      id: 3,
      court: "Ace Court",
      sport: "Tennis",
      time: "5:00 PM – 6:00 PM",
      user: "Neha",
      status: "Cancelled",
    },
  ];

  const badgeClass = (status) =>
    status === "Confirmed" ? "bg-success" : "bg-danger";

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-semibold mb-0">Today’s Bookings</h6>
          {/* <span className="text-muted small">Today</span> */}
        </div>

        {bookings.length === 0 ? (
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
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td className="fw-semibold">{b.court}</td>
                    <td>{b.sport}</td>
                    <td>{b.time}</td>
                    <td>{b.user}</td>
                    <td>
                      <span className={`badge ${badgeClass(b.status)}`}>
                        {b.status}
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