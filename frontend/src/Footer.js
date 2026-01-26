import React from "react";
import { NavLink } from "react-router-dom";
import './Footer.css';
function Footer() {
  return (
    <footer className="footer pt-5 mt-5">
      <div className="container">

        <div className="row">

          {/* Brand */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">CourtEase</h5>
            <p className="text-muted">
              Book your sports courts anytime, anywhere.
            </p>
            <p className="text-muted">
              Making sports booking simple, fast, and accessible.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 mb-4">
            <h6 className="fw-semibold">Quick Links</h6>
            <ul className="list-unstyled">
              <li><NavLink className="footer-link" to="/">Home</NavLink></li>
              <li><NavLink className="footer-link" to="/about">About</NavLink></li>
              <li><NavLink className="footer-link" to="/contact">Contact</NavLink></li>
              <li><NavLink className="footer-link" to="/login">Login</NavLink></li>
              <li><NavLink className="footer-link" to="/register">Register</NavLink></li>
            </ul>
          </div>

          {/* Sports */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-semibold">Sports</h6>
            <ul className="list-unstyled">
              <li>Badminton</li>
              <li>Tennis</li>
              <li>Football</li>
              <li>Cricket</li>
              <li>Basketball</li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-md-3 mb-4">
            <h6 className="fw-semibold">Support</h6>
            <ul className="list-unstyled">
              <li>Help Center</li>
              <li>FAQs</li>
              <li>Terms & Conditions</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

        </div>

        <hr className="border-secondary" />

        <div className="text-center text-muted pb-3">
          © {new Date().getFullYear()} CourtEase. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

export default Footer;