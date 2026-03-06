import React, { useState } from "react";
import "../../userdashboard/dashboard.css";

function Profile() {
  // 🔹 Dummy user data (frontend only)
  const [user, setUser] = useState({
    name: "Aman Sharma",
    phone: "9876543210",
    email: "aman@gmail.com",
    city: "Bengaluru",
    favouriteSport: "Badminton",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert("Profile updated (frontend only)");
  };

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
              <label className="form-label fw-semibold">City</label>
              <input
                type="text"
                className="form-control"
                name="city"
                value={user.city}
                onChange={handleChange}
              />
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
    </div>
  );
}

export default Profile;