import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav
      className="navbar navbar-expand-lg border-bottom"
      style={{ backgroundColor: "#FFF" }}
    >
      <div className="container p-1">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
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
          <ul className="navbar-nav ms-auto align-items-center" style={{color:"black",fontSize:'17px'}}>
            <li className="nav-item mx-2">
              <Link className="nav-link fw-semibold" to="/">
                Home
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link fw-semibold" to="/about">
                About
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link fw-semibold" to="/contact">
                Contact
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link fw-semibold" to="/login">
                Login
              </Link>
            </li>

            <li className="nav-item mx-2">
              <Link className="nav-link fw-semibold" to="/register">
                Register
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
export default NavBar;