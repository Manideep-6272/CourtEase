import React, { useState } from "react";
import "../Home.css";

function Profile() {
  const [profile, setProfile] = useState({
    name: "Aman Kumar",
    email: "aman@example.com",
    phone: "9876543210",
    city: "Bengaluru",
    businessName: "CourtEase Arenas",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Profile</h2>
        <p className="text-muted mb-0">
          Manage your personal and business information
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-8">

          <div className="card shadow-sm border-0">
            <div className="card-body">

              <h5 className="fw-semibold mb-4">
                Owner Details
              </h5>

              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-12">
                  <label className="form-label fw-semibold">
                    Business Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="businessName"
                    value={profile.businessName}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <div className="d-flex justify-content-end mt-4">
                <button className="btn btn-primary">
                  Save Changes
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Profile;