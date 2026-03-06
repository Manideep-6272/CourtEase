import React from "react";
import { Link, useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    // ❌ remove token
    localStorage.removeItem("token");

    // ❌ remove user (if you stored it)
    localStorage.removeItem("user");

    // 🔥 update UI instantly (optional but useful)
    window.dispatchEvent(new Event("authChanged"));

    // 👉 redirect to login page
    navigate("/login");
  };
  return (
    <nav
      className="navbar navbar-expand-lg border-bottom"
      style={{ backgroundColor: "#FFF" }}
    >
      <div className="container p-1">
        {/* Logo */}
        <Link className="navbar-brand" to="/user">
          <img src="./Logo.png" style={{ width: "15%" }} alt="Logo" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul
            className="navbar-nav ms-auto align-items-center gap-4"
            style={{ fontSize: "16px", whiteSpace: "nowrap" }}
          >
            <li className="nav-item">
              <Link className="nav-link fw-semibold mx-2" to="/user">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/user/mybookings">
                My Bookings
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link fw-semibold" to="/user/profile">
                Profile
              </Link>
            </li>

            <li className="nav-item">
              <button
                className="nav-link fw-semibold btn btn-link"
                style={{ textDecoration: "none" }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
