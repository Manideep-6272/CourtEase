import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Home.css";

function Bookings() {

  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  // FETCH BOOKINGS FROM BACKEND
  const fetchBookings = async () => {
    try {

      const res = await axios.get(
        "http://localhost:5000/mybookings",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setBookings(res.data);

    } catch (err) {
      console.error(err);
      alert("Failed to fetch bookings");
    }
  };

  // CANCEL BOOKING
  const cancelBooking = async (id) => {

    if (!window.confirm("Cancel this booking?")) return;

    try {

      await axios.delete(
        `http://localhost:5000/bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setBookings(bookings.filter(b => b.id !== id));

    } catch (err) {
      console.error(err);
      alert("Cancel failed");
    }
  };

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Bookings</h2>
        <p className="text-muted mb-0">
          View and manage all court bookings
        </p>
      </div>

      {/* Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body table-responsive">

          <table className="table align-middle mb-0">

            <thead className="table-light">
              <tr>
                <th>Court</th>
                <th>Sport</th>
                <th>Location</th>
                <th>Date</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No bookings found
                  </td>
                </tr>
              ) : (

                bookings.map((b) => (

                  <tr key={b.id}>
                    <td>{b.court}</td>
                    <td>{b.sport}</td>
                    <td>{b.location}</td>
                    <td>{b.booking_date}</td>
                    <td>{b.slot_time}</td>

                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => cancelBooking(b.id)}
                      >
                        Cancel
                      </button>
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default Bookings;