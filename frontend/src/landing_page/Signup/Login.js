import React from "react";
import { NavLink } from "react-router-dom";
import "./signup.css";
function Login() {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg p-4 login-card">
        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="fw-bold">Welcome Back</h3>
          <p className="text-muted">Login to continue booking courts</p>
        </div>

        {/* Form */}
        <form>
          {/* Phone Number */}
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              placeholder="Enter your phone number"
              pattern="[0-9]{10}"
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
            />
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" />
              <label className="form-check-label text-muted">Remember me</label>
            </div>
            <span className="text-primary small" style={{ cursor: "pointer" }}>
              Forgot password?
            </span>
          </div>

          <button className="btn btn-primary w-100 fw-semibold py-2">
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-muted mb-0">
            Don’t have an account?{" "}
            <NavLink to="/register" className="text-primary fw-semibold">
              Register
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Login;
