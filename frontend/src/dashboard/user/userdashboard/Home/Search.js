import React, { useState } from "react";
import axios from "axios";
import PaymentGateway from "./PaymentGateway";

function Search() {
  const [form, setForm] = useState({
    location: "",
    sport: "",
    date: "",
  });

  const [results, setResults] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  // Format time range
  const timeRangeFormatter = (slotsToUse = null) => {
    const s = slotsToUse || selectedSlots;
    if (s.length === 0) return "";

    const sorted = [...s].map((x) => x.slot_time).sort();

    const start = new Date(`1970-01-01T${sorted[0]}`);
    const end = new Date(`1970-01-01T${sorted[sorted.length - 1]}`);
    end.setHours(end.getHours() + 1);

    return `${start.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${end.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Search courts
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
            court.sport.toLowerCase() === form.sport.toLowerCase()),
      );

      setResults(filtered);
    } catch (error) {
      console.log(error);
      alert("Error fetching courts");
    }
  };

  // Book now
  const handleBookNow = async (court) => {
    if (!form.date) {
      alert("Please select a date first");
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:5000/courts/${court.id}/slots?date=${form.date}`,
      );

      setSelectedCourt(court);
      setSlots(res.data);
      setSelectedSlots([]);
      setShowModal(true);
    } catch (error) {
      console.log(error);
      alert("Error loading slots");
    }
  };

  // Toggle slot
  const toggleSlot = (slot) => {
    if (slot.is_booked) return;

    setSelectedSlots((prev) => {
      const exists = prev.find((s) => s.id === slot.id);

      if (exists) {
        return prev.filter((s) => s.id !== slot.id);
      } else {
        return [...prev, slot];
      }
    });
  };

  // Show payment
  const handleShowPayment = () => {
    if (selectedSlots.length === 0) {
      alert("Please select slots");
      return;
    }

    const timeRange = timeRangeFormatter();

    setPaymentData({
      courtId: selectedCourt.id,
      courtName: selectedCourt.name,
      sport: selectedCourt.sport,
      date: form.date,
      timeRange: timeRange,
      duration: selectedSlots.length,
      pricePerHour: selectedCourt.price_per_hour,
      totalAmount: selectedSlots.length * selectedCourt.price_per_hour,
      slotIds: selectedSlots.map((s) => s.id),
    });

    setShowModal(false);
    setShowPayment(true);
  };

  // Payment success
  const handlePaymentSuccess = async () => {
    alert("✅ Payment Successful & Court Booked");

    setShowPayment(false);
    setPaymentData(null);
    setSelectedSlots([]);
    setSelectedCourt(null);

    await handleSearch();
  };

  // Payment cancel
  const handlePaymentCancel = () => {
    setShowPayment(false);
    setPaymentData(null);
  };

  return (
    <>
      {/* Search */}
      <div className="container mt-4">
        <div className="card p-3 shadow-sm">
          <div className="row">
            <div className="col-md-3">
              <input
                type="text"
                name="location"
                className="form-control"
                placeholder="Location"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <select
                name="sport"
                className="form-select"
                onChange={handleChange}
              >
                <option value="">Sport</option>
                <option>Badminton</option>
                <option>Football</option>
                <option>Tennis</option>
                <option>Cricket</option>
                <option>Basketball</option>
                <option>Volleyball</option>
                <option>Table Tennis</option>
              </select>
            </div>

            <div className="col-md-3">
              <input
                type="date"
                name="date"
                className="form-control"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <button className="btn btn-primary w-100" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Courts */}
      <div className="container mt-5">
        <div className="row">
          {results.map((court) => (
            <div className="col-md-4 mb-4" key={court.id}>
              <div
                className="card shadow-lg border-0 h-100"
                style={{
                  borderRadius: "15px",
                  overflow: "hidden",
                  transition: "0.3s",
                }}
              >
                {/* Image */}
                {/* <img
                  src="https://images.unsplash.com/photo-1599058917765-a780eda07a3e"
                  className="card-img-top"
                  alt="court"
                  style={{
                    height: "200px",
                    objectFit: "cover",
                  }}
                /> */}

                {/* Body */}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{court.name}</h5>

                  <p className="text-muted mb-2">🏸 {court.sport}</p>

                  <p className="mb-2">📍 {court.location}</p>

                  {/* Dummy Location URL */}
                  <a
                    href="https://www.google.com/maps"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary small mb-3"
                  >
                    View Location on Map
                  </a>

                  {/* Price */}
                  <h6 className="text-success fw-bold mb-3">
                    ₹{court.price_per_hour}/hour
                  </h6>

                  {/* Book Button */}
                  <button
                    className="btn btn-primary mt-auto"
                    onClick={() => handleBookNow(court)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slot Modal */}
      {/* Slot Modal */}
      {showModal && selectedCourt && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-4">
              {/* Header */}
              <div className="d-flex justify-content-between align-items-center">
                <h4>Select Time Slots</h4>

                <button
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedSlots([]);
                    setSelectedCourt(null);
                  }}
                ></button>
              </div>

              <hr />

              {/* Court Info */}
              <h6 className="text-muted">
                {selectedCourt.name} | {selectedCourt.sport}
              </h6>
              <p className="text-muted">Date: {form.date}</p>

              {/* Slots */}
              <div className="d-flex flex-wrap gap-2 mt-3">
                {slots.map((slot) => {
                  const isSelected = selectedSlots.find(
                    (s) => s.id === slot.id,
                  );

                  return (
                    <button
                      key={slot.id}
                      className={`btn ${
                        slot.is_booked
                          ? "btn-danger"
                          : isSelected
                            ? "btn-success"
                            : "btn-outline-secondary"
                      }`}
                      onClick={() => toggleSlot(slot)}
                      disabled={slot.is_booked}
                    >
                      {new Date(
                        `1970-01-01T${slot.slot_time}`,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-4 d-flex justify-content-between align-items-center">
                <h5 className="text-success">
                  Total: ₹{selectedSlots.length * selectedCourt.price_per_hour}
                </h5>

                <div className="d-flex gap-2">
                  {/* Cancel Button */}
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedSlots([]);
                      setSelectedCourt(null);
                    }}
                  >
                    Cancel
                  </button>

                  {/* Proceed Button */}
                  <button
                    className="btn btn-success"
                    onClick={handleShowPayment}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment */}
      {showPayment && paymentData && (
        <PaymentGateway
          bookingData={paymentData}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={handlePaymentCancel}
        />
      )}
    </>
  );
}

export default Search;
