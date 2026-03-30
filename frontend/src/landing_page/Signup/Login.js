import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../../api";
import "./signup.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    phone: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!formData.role || !formData.phone || !formData.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (formData.phone.length < 10) {
      setError("Phone number must be at least 10 digits");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/login", {
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      });

      // Save token and user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const userRole = res.data.user.role;

      // Role-based redirect
      if (userRole === "user") {
        navigate('/user');
      } else if (userRole === "owner") {
        navigate('/owner');
      } else if (userRole === "admin") {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }

    if (!formData.role) {
      return setError("Please select a role");
    }

    try {
      const res = await api.post("/login", {
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      });

      // Save token and user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const userRole = res.data.user.role;

      // Role-based redirect
      if (userRole === "user") {
        navigate('/user');
      } else if (userRole === "owner") {
        navigate('/owner');
      } else if (userRole === "admin") {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow-lg p-4 login-card">

        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="fw-bold">Welcome Back</h3>
          <p className="text-muted">Login to continue booking courts</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Role Selection */}
          <div className="mb-3">
            <label className="form-label">Login As</label>
            <select
              className="form-select"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Phone */}
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            className="btn btn-primary w-100 fw-semibold py-2" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
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