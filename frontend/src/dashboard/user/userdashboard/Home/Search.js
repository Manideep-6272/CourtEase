import React, { useState } from "react";
import axios from "axios";

function Search() {
  const [form, setForm] = useState({
    location: "",
    sport: "",
    date: "",
  });

  const [results, setResults] = useState([]);

  // Modal + booking state
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔍 Search courts
  const handleSearch = async () => {
    try {
      const res = await axios.get("http://localhost:5000/getcourts");

      const filtered = res.data.filter(
        (court) =>
          (form.location === "" ||
            court.location
              .toLowerCase()
              .includes(form.location.toLowerCase())) &&
          (form.sport === "" ||
            court.sport.toLowerCase() === form.sport.toLowerCase())
      );

      setResults(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  // 📅 Open modal + fetch slots
  const handleBookNow = async (court) => {
    if (!form.date) {
      alert("Please select a date first");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/courts/${court.id}/slots?date=${form.date}`
      );

      setSelectedCourt(court); // ✅ full court object
      setSlots(res.data || []);
      setSelectedSlots([]);
      setShowModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔘 Toggle slot
  const toggleSlot = (slot) => {
    if (slot.is_booked) return;

    setSelectedSlots((prev) => {
      if (prev.find((s) => s.id === slot.id)) {
        return prev.filter((s) => s.id !== slot.id);
      } else {
        return [...prev, slot];
      }
    });
  };

  // ✅ Confirm booking
  const handleConfirmBooking = async () => {
    try {
      await axios.post(
        "http://localhost:5000/bookings",
        {
          courtId: selectedCourt.id,
          slotIds: selectedSlots.map((s) => s.id),
          bookingDate: form.date,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      window.dispatchEvent(new Event("bookingUpdated"));
      alert("Booking successful ✅");

      setShowModal(false);
      setSelectedSlots([]);
      // window.dispatchEvent(new Event("bookingUpdated"));
      handleSearch();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Booking failed ❌");
    }
  };

  // 🕒 Time range formatter
  const getTimeRange = () => {
    if (selectedSlots.length === 0) return "";

    const sorted = [...selectedSlots]
      .map((s) => s.slot_time)
      .sort();

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
  };

  return (
    <>
      {/* 🔍 Search */}
      <div className="container mt-5 d-flex justify-content-center">
        <div
          className="card shadow-lg p-4"
          style={{ maxWidth: "900px", width: "100%" }}
        >
          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Location"
                name="location"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                name="sport"
                onChange={handleChange}
              >
                <option value="">Sport</option>
                <option>Badminton</option>
                <option>Tennis</option>
                <option>Football</option>
                <option>Cricket</option>
              </select>
            </div>

            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                name="date"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3 d-grid">
              <button className="btn btn-primary" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📋 Results */}
      <div className="container mt-4">
        <div className="row">
          {results.map((court) => (
            <div className="col-md-4" key={court.id}>
              <div className="card p-3 shadow-sm">
                <h6>{court.name}</h6>
                <p>
                  📍 {court.location} • 🏸 {court.sport}
                </p>

                <p>₹{court.price_per_hour}/hr</p>

                <button
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => handleBookNow(court)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-3">
              <div className="d-flex justify-content-between">
                <h5>Select Time Slots</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              {/* Slots */}
              <div className="mt-3 d-flex flex-wrap gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    disabled={slot.is_booked}
                    className={`btn btn-sm ${
                      slot.is_booked
                        ? "btn-danger"
                        : selectedSlots.find((s) => s.id === slot.id)
                        ? "btn-success"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => toggleSlot(slot)}
                  >
                    {new Date(
                      `1970-01-01T${slot.slot_time}`
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-3">
                <span className="badge bg-success me-2">Selected</span>
                <span className="badge bg-danger me-2">Booked</span>
                <span className="badge bg-secondary">Available</span>
              </div>

              {/* 🔥 BOOKING SUMMARY */}
              {selectedSlots.length > 0 && (
                <div className="card mt-4 shadow-sm">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">Booking Summary</h6>

                    <p>
                      <strong>Court:</strong> {selectedCourt.name}
                    </p>

                    <p>
                      <strong>Sport:</strong> {selectedCourt.sport}
                    </p>

                    <p>
                      <strong>Date:</strong> {form.date}
                    </p>

                    <p>
                      <strong>Time:</strong> {getTimeRange()}
                    </p>

                    <p>
                      <strong>Price/hr:</strong> ₹
                      {selectedCourt.price_per_hour}
                    </p>

                    <h6 className="mt-2">
                      Total: ₹
                      {selectedSlots.length *
                        selectedCourt.price_per_hour}
                    </h6>

                    <button
                      className="btn btn-success mt-3 w-100"
                      onClick={handleConfirmBooking}
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Search;