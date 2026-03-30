import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../api";
import "./signup.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.name || !formData.phone || !formData.password || !formData.role) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (formData.phone.length < 10) {
      setError("Phone number must be at least 10 digits");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/register", {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      });

      setError("");
      alert(res.data.message);

      // Redirect to login after successful register
      navigate("/login");

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg register-card p-4">

        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="fw-bold">Create Your Account</h3>
          <p className="text-muted">
            Join CourtEase and start booking courts
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Role Selection */}
          <div className="mb-3">
            <label className="form-label">Register As</label>
            <select
              className="form-select"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="owner">Owner</option>
              {/* <option value="admin">Admin</option> */}
            </select>
          </div>

          <div className="row">
            {/* Full Name */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                placeholder="Enter phone number"
                maxLength="10"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {/* Terms */}
          <div className="form-check mb-3">
            <input className="form-check-input" type="checkbox" required />
            <label className="form-check-label text-muted">
              I agree to the{" "}
              <span className="text-primary" style={{ cursor: "pointer" }}>
                Terms & Conditions
              </span>
            </label>
          </div>

          <button 
            className="btn btn-primary w-100 fw-semibold py-2" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
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