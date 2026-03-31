import React, { useState, useEffect } from "react";
import "../../userdashboard/dashboard.css";

function Profile() {
  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [changeLocationModal, setChangeLocationModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");

  const popularCities = ["Bengaluru", "Mumbai", "Delhi", "Pune", "Hyderabad", "Chennai", "Kolkata", "Jaipur", "Ahmedabad", "Chandigarh"];

  // Load user profile from backend
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch profile");
      const data = await response.json();
      setUser(data);
      setSelectedCity(data.city || "");
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSuccess(null);
      setError(null);
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          city: user.city,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");
      const data = await response.json();
      setUser(data);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangeLocation = (city) => {
    setUser({ ...user, city });
    setSelectedCity(city);
    setChangeLocationModal(false);
  };

  if (loading) {
    return <div className="text-center mt-5"><p>Loading profile...</p></div>;
  }

  return (
    <div className="dashboard-section mx-auto mt-5">

      {/* Header */}
      <div className="text-center mb-4">
        <h4 className="fw-bold">My Profile</h4>
        <p className="text-muted">
          View and update your personal information
        </p>
      </div>

      {/* Profile Card */}
      <div className="card border-0 shadow-sm profile-card">
        <div className="card-body">

          {/* Success/Error Messages */}
          {success && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              {success}
            </div>
          )}
          {error && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              {error}
            </div>
          )}

          {/* Avatar */}
          <div className="text-center mb-4">
            <div className="profile-avatar mx-auto mb-2">
              {user.name.charAt(0)}
            </div>
            <h6 className="fw-semibold mb-0">{user.name}</h6>
            <p className="text-muted small">User</p>
          </div>

          {/* Form */}
          <div className="row g-3">

            <div className="col-md-6">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={user.name}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Phone Number</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={user.phone}
                disabled
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">📍 Your Location</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={user.city}
                  disabled
                />
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={() => setChangeLocationModal(true)}
                >
                  Change Location
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="text-center mt-4">
            <button
              className="btn btn-primary px-5 fw-semibold"
              onClick={handleSave}
            >
              Save Changes
            </button>
          </div>

        </div>
      </div>

      {/* Change Location Modal */}
      {changeLocationModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">📍 Select Your Location</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setChangeLocationModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted mb-3">Choose a city to see courts in that location:</p>
                <div className="row g-2">
                  {popularCities.map((city) => (
                    <div className="col-6" key={city}>
                      <button
                        className={`btn w-100 ${
                          selectedCity === city
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => handleChangeLocation(city)}
                      >
                        {city}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setChangeLocationModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;