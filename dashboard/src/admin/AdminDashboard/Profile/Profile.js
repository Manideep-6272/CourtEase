import React, { useState } from "react";
function Profile() {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@courtease.com",
    phone: "9998887776",
    role: "Admin",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="container-lg mt-4">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Profile</h2>
        <p className="text-muted mb-0">
          Manage admin account details
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-7">

          <div className="card shadow-sm border-0">
            <div className="card-body">

              <h5 className="fw-semibold mb-4">Admin Information</h5>

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
                    Role
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.role}
                    disabled
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

              </div>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <button className="btn btn-outline-secondary">
                  Change Password
                </button>

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