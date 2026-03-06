import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../userdashboard/dashboard.css";

function Upcoming() {
  const [booking, setBooking] = useState(null);

  const fetchUpcomingBooking = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.warn("No token found");
        return;
      }

      const res = await axios.get("http://localhost:5000/mybookings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // window.dispatchEvent(new Event("bookingUpdated"));
      // ✅ FIX: Compare only DATE (not time)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = res.data.filter((b) => {
        const bookingDate = new Date(b.booking_date);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate >= today;
      });

      if (upcoming.length === 0) {
        setBooking(null);
        return;
      }

      // ✅ GROUP slots
      const grouped = {};

      upcoming.forEach((b) => {
        const key = `${b.court}-${b.booking_date}`;

        if (!grouped[key]) {
          grouped[key] = {
            ...b,
            times: [b.slot_time],
            ids: [b.id],
          };
        } else {
          grouped[key].times.push(b.slot_time);
          grouped[key].ids.push(b.id); // 🔥 FIX
        }
      });

      const bookingsArr = Object.values(grouped);

      // ✅ Sort by nearest date
      bookingsArr.sort(
        (a, b) => new Date(a.booking_date) - new Date(b.booking_date)
      );

      // ✅ Take first upcoming booking
      setBooking(bookingsArr[0]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUpcomingBooking();

    // ✅ REAL-TIME UPDATE (after booking)
    const handleUpdate = () => fetchUpcomingBooking();

    window.addEventListener("bookingUpdated", handleUpdate);

    return () =>
      window.removeEventListener("bookingUpdated", handleUpdate);
  }, []);

  if (!booking) {
    return (
      <div className="card border-0 shadow-sm upcoming-booking-card text-center p-4">
        <p className="text-muted mb-0">No upcoming bookings</p>
      </div>
    );
  }

  // ✅ SORT TIME PROPERLY
  const sorted = [...booking.times].sort(
    (a, b) =>
      new Date(`1970-01-01T${a}`) - new Date(`1970-01-01T${b}`)
  );

  const start = new Date(`1970-01-01T${sorted[0]}`);
  const end = new Date(`1970-01-01T${sorted[sorted.length - 1]}`);
  end.setHours(end.getHours() + 1);

  const timeRange = `${start.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })} - ${end.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  return (
    <div className="card border-0 shadow-sm upcoming-booking-card">
      <div className="card-body">
        <h5 className="fw-semibold mb-3 text-center">
          Upcoming Booking
        </h5>

        <div className="d-flex justify-content-between align-items-center flex-wrap">
          {/* Details */}
          <div>
            <h6 className="fw-semibold mb-1">{booking.court}</h6>

            <p className="text-muted mb-1">
              📅 {new Date(booking.booking_date).toDateString()} • ⏰{" "}
              {timeRange}
            </p>

            <p className="text-muted mb-0">📍 {booking.location}</p>
          </div>

          {/* Actions */}
          <div className="mt-3 mt-md-0 text-end">
            <span className="badge bg-success mb-2">
              Confirmed
            </span>

            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-outline-primary btn-sm">
                View Booking
              </button>

              <button
                className="btn btn-outline-danger btn-sm"
                onClick={async () => {
                  if (!window.confirm("Cancel this booking?")) return;

                  try {
                    const token = localStorage.getItem("token");

                    for (let id of booking.ids || []) {
                      await axios.delete(
                        `http://localhost:5000/bookings/${id}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );
                    }

                    alert("Booking cancelled ❌");
                    setBooking(null);

                    // 🔥 refresh other components
                    window.dispatchEvent(new Event("bookingUpdated"));
                  } catch (err) {
                    console.error(err);
                    alert("Cancel failed");
                  }
                }}
              >
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