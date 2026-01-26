import React, { useState } from "react";
import "../Home.css";
function Bookings() {
  const [bookings] = useState([
    {
      id: 1,
      user: "Aman",
      court: "Elite Sports Arena",
      sport: "Badminton",
      date: "12 Feb 2026",
      time: "6:00 PM - 7:00 PM",
      amount: 700,
      status: "Confirmed",
    },
    {
      id: 2,
      user: "Rahul",
      court: "Play Arena",
      sport: "Football",
      date: "12 Feb 2026",
      time: "7:00 PM - 8:00 PM",
      amount: 1200,
      status: "Cancelled",
    },
    {
      id: 3,
      user: "Neha",
      court: "Elite Sports Arena",
      sport: "Badminton",
      date: "13 Feb 2026",
      time: "5:00 PM - 6:00 PM",
      amount: 700,
      status: "Confirmed",
    },
  ]);

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Bookings</h2>
        <p className="text-muted mb-0">
          View and manage all court bookings
        </p>
      </div>

      {/* Filters (UI Only) */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">

            <div className="col-md-3">
              <select className="form-select">
                <option>All Courts</option>
                <option>Elite Sports Arena</option>
                <option>Play Arena</option>
              </select>
            </div>

            <div className="col-md-3">
              <select className="form-select">
                <option>All Sports</option>
                <option>Badminton</option>
                <option>Football</option>
              </select>
            </div>

            <div className="col-md-3">
              <input type="date" className="form-control" />
            </div>

            <div className="col-md-3">
              <select className="form-select">
                <option>All Status</option>
                <option>Confirmed</option>
                <option>Cancelled</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body table-responsive">

          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Court</th>
                <th>Sport</th>
                <th>Date</th>
                <th>Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.user}</td>
                  <td>{b.court}</td>
                  <td>{b.sport}</td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td className="fw-semibold">₹{b.amount}</td>
                  <td>
                    <span
                      className={`badge ${
                        b.status === "Confirmed"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline-primary btn-sm me-2">
                      View
                    </button>
                    {b.status === "Confirmed" && (
                      <button className="btn btn-outline-danger btn-sm">
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default Bookings;