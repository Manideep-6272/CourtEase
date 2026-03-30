import React, { useState, useEffect } from "react";
import axios from "axios";
import RazorpayGateway from "./RazorpayGateway";

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

  // ✅ Time formatter
  const timeRangeFormatter = (slotsToUse = null) => {
    const slots = slotsToUse || selectedSlots;
    if (slots.length === 0) return "";

    const sorted = [...slots].map((s) => s.slot_time).sort();

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

  useEffect(() => {
    const pendingBooking = localStorage.getItem("pendingBooking");
    if (pendingBooking) {
      const booking = JSON.parse(pendingBooking);

      setForm({
        location: booking.location || "",
        sport: booking.sport || "",
        date: booking.date || "",
      });

      setSelectedCourt({
        id: booking.courtId,
        name: booking.courtName,
        sport: booking.sport,
        location: booking.location,
        price_per_hour: booking.pricePerHour,
      });

      setSelectedSlots(booking.slots || []);

      const timeRange = timeRangeFormatter(booking.slots || []);

      setPaymentData({
        courtId: booking.courtId,
        courtName: booking.courtName,
        sport: booking.sport,
        date: booking.date,
        timeRange: timeRange,
        duration: (booking.slots || []).length,
        pricePerHour: booking.pricePerHour,
        totalAmount:
          (booking.slots || []).length * booking.pricePerHour,
        slotIds: booking.slotIds,
      });

      setShowPayment(true);
      localStorage.removeItem("pendingBooking");
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = async () => {
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
  };

  const handleBookNow = async (court) => {
    if (!form.date) {
      alert("Please select a date first");
      return;
    }

    const res = await axios.get(
      `http://localhost:5000/courts/${court.id}/slots?date=${form.date}`
    );

    setSelectedCourt(court);
    setSlots(res.data || []);
    setSelectedSlots([]);
    setShowModal(true);
  };

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

  const handleShowPayment = () => {
    if (selectedSlots.length === 0) {
      alert("Select slots");
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
      totalAmount:
        selectedSlots.length * selectedCourt.price_per_hour,
      slotIds: selectedSlots.map((s) => s.id),
    });

    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    alert("✅ Payment successful!");
    setShowPayment(false);
    setShowModal(false);
    setSelectedSlots([]);
    setPaymentData(null);
    handleSearch();
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setPaymentData(null);
  };

  return (
    <>
      <div className="container mt-5 d-flex justify-content-center">
        <div className="card shadow-lg p-4">
          <input name="location" placeholder="Location" onChange={handleChange} />
          <select name="sport" onChange={handleChange}>
            <option value="">Sport</option>
            <option>Badminton</option>
            <option>Tennis</option>
          </select>
          <input type="date" name="date" onChange={handleChange} />
          <button onClick={handleSearch}>Search</button>
        </div>
      </div>

      {results.map((court) => (
        <div key={court.id}>
          {court.name}
          <button onClick={() => handleBookNow(court)}>
            Book
          </button>
        </div>
      ))}

      {showPayment && paymentData && (
        <RazorpayGateway
          bookingData={paymentData}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={handlePaymentCancel}
        />
      )}
    </>
  );
}

export default Search;