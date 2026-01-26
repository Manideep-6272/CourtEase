import React from "react";
import { NavLink } from "react-router-dom";
import "./signup.css";
function Register() {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg register-card">

        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="fw-bold">Create Your Account</h3>
          <p className="text-muted">
            Join CourtEase and start booking courts
          </p>
        </div>

        {/* Form */}
        <form>
          <div className="row">
            {/* Full Name */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter your full name"
              />
            </div>

            {/* Phone Number */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="Enter phone number"
                maxLength="10"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Create a password"
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Re-enter password"
            />
          </div>

          {/* Terms */}
          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" />
            <label className="form-check-label text-muted">
              I agree to the{" "}
              <span className="text-primary" style={{ cursor: "pointer" }}>
                Terms & Conditions
              </span>
            </label>
          </div>

          <button className="btn btn-primary w-100 fw-semibold py-2">
            Register
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-muted mb-0">
            Already have an account?{" "}
            <NavLink to="/login" className="text-primary fw-semibold">
              Login
            </NavLink>
          </p>
        </div>

      </div>
    </div>
  );
}
export default Register;