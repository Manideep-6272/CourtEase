import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../userdashboard/dashboard.css";

function Mybooking() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/mybookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const grouped = {};

      res.data.forEach((b) => {
        const key = `${b.court}-${b.booking_date}`;

        if (!grouped[key]) {
          grouped[key] = {
            court: b.court,
            location: b.location,
            sport: b.sport,
            booking_date: b.booking_date,
            times: [b.slot_time],
            ids: [b.id], // ✅ store ALL real booking IDs
          };
        } else {
          grouped[key].times.push(b.slot_time);
          grouped[key].ids.push(b.id); // ✅ store multiple ids
        }
      });

      setBookings(Object.values(grouped));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ FIXED CANCEL (delete ALL slot bookings)
  const handleCancel = async (ids) => {
    if (!window.confirm("Are you sure you want to cancel?")) return;

    try {
      for (let id of ids) {
        await axios.delete(`http://localhost:5000/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      alert("Booking cancelled ❌");
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel");
    }
  };

  const getStatus = (date) => {
    const today = new Date();
    const bookingDate = new Date(date);
    return bookingDate < today ? "Completed" : "Upcoming";
  };

  const getBadgeClass = (status) => {
    if (status === "Upcoming") return "bg-primary";
    if (status === "Completed") return "bg-success";
    return "bg-danger";
  };

  return (
    <div className="dashboard-section mx-auto mt-5">
      <div className="mb-4 text-center">
        <h4 className="fw-bold">My Bookings</h4>
        <p className="text-muted">View and manage all your court bookings</p>
      </div>

      {bookings.length === 0 && (
        <p className="text-center text-muted">No bookings found</p>
      )}

      {bookings.map((booking, index) => {
        const status = getStatus(booking.booking_date);

        return (
          <div
            key={index}
            className="card border-0 shadow-sm mb-3 booking-card"
          >
            <div className="card-body d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h6 className="fw-semibold mb-1">{booking.court}</h6>

                <p className="text-muted mb-1">
                  📍 {booking.location} • 🏸 {booking.sport}
                </p>

                <p className="text-muted mb-0">
                  📅 {new Date(booking.booking_date).toDateString()} • ⏰{" "}
                  {(() => {
                    const sorted = [...booking.times].sort();

                    const start = new Date(`1970-01-01T${sorted[0]}`);
                    const end = new Date(
                      `1970-01-01T${sorted[sorted.length - 1]}`
                    );
                    end.setHours(end.getHours() + 1);

                    return `${start.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })} - ${end.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`;
                  })()}
                </p>
              </div>

              <div className="text-end mt-3 mt-md-0">
                <span className={`badge ${getBadgeClass(status)} mb-2`}>
                  {status}
                </span>

                <div>
                  {status === "Upcoming" && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleCancel(booking.ids)} // ✅ send array
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Mybooking;