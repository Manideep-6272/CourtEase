import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function SearchBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [filters, setFilters] = useState({
    city: "",
    sport: "",
    date: "",
  });

  const [courts, setCourts] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);

  // Handle search filter change
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Search courts
  const handleSearch = async () => {
    if (!filters.city && !filters.sport) {
      alert("Please enter city or select sport");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/getcourts");
      
      const filtered = res.data.filter((court) => {
        const cityMatch = filters.city === "" || 
          court.city.toLowerCase().includes(filters.city.toLowerCase());
        const sportMatch = filters.sport === "" || 
          court.sport.toLowerCase() === filters.sport.toLowerCase();
        return cityMatch && sportMatch;
      });

      setCourts(filtered);
      if (filtered.length === 0) {
        alert("No courts found matching your criteria");
      }
    } catch (err) {
      console.error("Error fetching courts:", err);
      alert("Failed to search courts");
    } finally {
      setLoading(false);
    }
  };

  // Fetch slots for court
  const handleViewCourt = async (court) => {
    if (!filters.date) {
      alert("Please select a date first");
      return;
    }

    setSelectedCourt(court);
    setSlots([]);
    setSelectedSlots([]);

    try {
      const res = await axios.get(
        `http://localhost:5000/courts/${court.id}/slots?date=${filters.date}`
      );
      setSlots(res.data || []);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching slots:", err);
      alert("Failed to load available slots");
    }
  };

  // Toggle slot selection
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

  // Handle Book Now button
  const handleBookNow = () => {
    if (!token) {
      alert("Please login to book a court");
      navigate("/login");
      return;
    }

    if (selectedSlots.length === 0) {
      alert("Please select at least one slot");
      return;
    }

    // Store booking data and redirect to booking with login
    localStorage.setItem(
      "pendingBooking",
      JSON.stringify({
        courtId: selectedCourt.id,
        courtName: selectedCourt.name,
        sport: selectedCourt.sport,
        location: selectedCourt.location,
        pricePerHour: selectedCourt.price_per_hour,
        date: filters.date,
        slotIds: selectedSlots.map((s) => s.id),
        slots: selectedSlots,
      })
    );

    // Redirect to user dashboard booking page
    navigate("/user-dashboard");
    setShowModal(false);
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return "N/A";
    const [hours, minutes] = timeStr.split(":");
    let h = parseInt(hours);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minutes} ${ampm}`;
  };

  return (
    <>
      {/* Search Bar */}
      <div className="container mt-5 d-flex justify-content-center">
        <div className="card shadow-lg p-4 search-bar">
          <div className="row g-3 align-items-center">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter city"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-3">
              <select 
                className="form-select"
                name="sport"
                value={filters.sport}
                onChange={handleFilterChange}
              >
                <option value="">Select sport</option>
                <option>Badminton</option>
                <option>Tennis</option>
                <option>Football</option>
                <option>Cricket</option>
                <option>Basketball</option>
              </select>
            </div>

            <div className="col-md-3">
              <input 
                type="date" 
                className="form-control"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-3 d-grid">
              <button 
                className="btn btn-primary fw-semibold"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Searching..." : "Search Courts"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Courts Results */}
      {courts.length > 0 && (
        <div className="container mt-5">
          <h4 className="mb-4">Available Courts</h4>
          <div className="row">
            {courts.map((court) => (
              <div className="col-md-4 mb-4" key={court.id}>
                <div className="card h-100 shadow-sm border-0 hover-shadow" style={{ transition: "box-shadow 0.3s", overflow: "hidden" }}>
                  
                  {court.image_url && (
                    <img 
                      src={court.image_url} 
                      alt={court.name}
                      style={{ height: "200px", objectFit: "cover", width: "100%" }}
                    />
                  )}

                  <div className="card-body">
                    <h5 className="card-title text-primary">{court.name}</h5>
                    <hr />
                    
                    {/* Court Details */}
                    <p className="card-text text-muted mb-2">
                      <strong>Sport:</strong> {court.sport}
                    </p>
                    <p className="card-text text-muted mb-2">
                      <strong>Location:</strong> {court.location}, {court.city}
                      <a 
                        href={`https://maps.google.com/?q=${encodeURIComponent(court.location + ', ' + court.city)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ms-2 text-info"
                        title="View on Google Maps"
                      >
                        📍
                      </a>
                    </p>
                    <p className="card-text mb-3">
                      <strong className="text-success">
                        ₹{court.price_per_hour}/hr
                      </strong>
                    </p>
                    {court.description && (
                      <p className="card-text small text-secondary mb-3">
                        {court.description}
                      </p>
                    )}

                    {/* Owner Details */}
                    <div className="alert alert-light border border-secondary mb-3 py-2">
                      <small className="d-block text-muted mb-2"><strong>Court Owner:</strong></small>
                      <small className="d-block"><strong>Name:</strong> {court.owner_name}</small>
                      <small className="d-block"><strong>Phone:</strong> 
                        <a href={`tel:${court.owner_phone}`} className="ms-2 text-decoration-none">
                          {court.owner_phone}
                        </a>
                      </small>
                    </div>

                    <button 
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() => handleViewCourt(court)}
                      disabled={!filters.date}
                    >
                      {!filters.date ? "Select Date First" : "View Slots & Book"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slots Modal */}
      {showModal && selectedCourt && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content p-4">
              
              {selectedCourt.image_url && (
                <img 
                  src={selectedCourt.image_url} 
                  alt={selectedCourt.name}
                  style={{ height: "250px", objectFit: "cover", borderRadius: "8px", marginBottom: "20px", width: "100%" }}
                />
              )}

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h5 className="mb-1">{selectedCourt.name}</h5>
                  <p className="text-muted mb-0">
                    {selectedCourt.sport} • {selectedCourt.location}
                  </p>
                </div>
                <button 
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              {/* Court & Owner Details Section */}
              <div className="alert alert-info mb-4">
                <h6 className="fw-bold mb-3">Court Information</h6>
                <div className="row">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>Location:</strong> {selectedCourt.location}, {selectedCourt.city}
                    </p>
                    <p className="mb-2">
                      <strong>Price:</strong> ₹{selectedCourt.price_per_hour}/hr per slot
                    </p>
                    {selectedCourt.description && (
                      <p className="mb-0">
                        <strong>Details:</strong> {selectedCourt.description}
                      </p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(selectedCourt.location + ', ' + selectedCourt.city)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-outline-info w-100"
                    >
                      📍 View on Google Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* Owner Details Section */}
              <div className="card bg-light mb-4 border-warning">
                <div className="card-body">
                  <h6 className="fw-bold mb-3 text-warning">📞 Court Owner Details</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <p className="mb-2">
                        <strong>Owner Name:</strong> 
                        <br />
                        <span className="text-dark">{selectedCourt.owner_name}</span>
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p className="mb-0">
                        <strong>Phone:</strong>
                        <br />
                        <a href={`tel:${selectedCourt.owner_phone}`} className="text-decoration-none text-primary fw-bold">
                          {selectedCourt.owner_phone}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Info */}
              <div className="alert alert-secondary mb-4">
                <p className="mb-1">
                  <strong>Booking Date:</strong> {filters.date}
                </p>
              </div>

              {/* Available Slots */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3">Select Time Slots</h6>
                <div className="d-flex flex-wrap gap-2">
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
                      {formatTime(slot.slot_time)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="mb-4">
                <span className="badge bg-success me-2">Selected</span>
                <span className="badge bg-danger me-2">Booked</span>
                <span className="badge bg-secondary">Available</span>
              </div>

              {/* Booking Summary */}
              {selectedSlots.length > 0 && (
                <div className="card bg-light mb-4">
                  <div className="card-body">
                    <h6 className="fw-bold mb-3">Booking Summary</h6>
                    <p className="mb-1">
                      <strong>Slots Selected:</strong> {selectedSlots.length}
                    </p>
                    <p className="mb-1">
                      <strong>Time:</strong> {formatTime(selectedSlots[0]?.slot_time)} - {formatTime(selectedSlots[selectedSlots.length - 1]?.slot_time)}
                    </p>
                    <p className="mb-0">
                      <strong className="text-success">
                        Total: ₹{(selectedSlots.length * selectedCourt.price_per_hour).toLocaleString('en-IN')}
                      </strong>
                    </p>
                  </div>
                </div>
              )}

              {/* Book Now Button */}
              <button
                className="btn btn-primary w-100"
                onClick={handleBookNow}
                disabled={selectedSlots.length === 0}
              >
                {!token ? "Login to Book" : "Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchBar;