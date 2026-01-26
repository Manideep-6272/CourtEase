import React from "react";

function About() {
  return (
    <div className="container my-5">

      {/* Heading */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">About CourtEase</h1>
        <p className="text-muted mt-2">
          Simplifying sports court booking for everyone.
        </p>
      </div>

      {/* Intro Section */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6">
          <h4 className="fw-semibold mb-3">Who We Are</h4>
          <p className="text-muted">
            CourtEase is a modern sports court booking platform designed to make
            booking courts fast, simple, and hassle-free. Whether you’re a
            casual player or a serious athlete, CourtEase helps you find and
            book the perfect court in just a few clicks.
          </p>
          <p className="text-muted">
            No phone calls. No waiting. Just play.
          </p>
        </div>

        <div className="col-md-6 text-center">
          <div className="p-4  rounded">
            <h5 className="fw-semibold">Our Mission</h5>
            <p className="text-muted mt-2">
              To make sports more accessible by connecting players with
              verified venues through a seamless booking experience.
            </p>
          </div>
        </div>
      </div>

      {/* Why CourtEase */}
      <div className="mb-5">
        <h4 className="fw-semibold text-center mb-4">
          Why CourtEase?
        </h4>

        <div className="row g-4 text-center">
          <div className="col-md-4">
            <div className="p-4 border rounded h-100">
              <div className="fs-2">⚡</div>
              <h6 className="fw-semibold mt-2">Fast & Easy</h6>
              <p className="text-muted">
                Book courts instantly without any manual effort.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 border rounded h-100">
              <div className="fs-2">🏟️</div>
              <h6 className="fw-semibold mt-2">Verified Venues</h6>
              <p className="text-muted">
                Access trusted courts with real-time availability.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="p-4 border rounded h-100">
              <div className="fs-2">🔐</div>
              <h6 className="fw-semibold mt-2">Secure & Reliable</h6>
              <p className="text-muted">
                Safe bookings and transparent pricing every time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Vision Section */}
      <div className="text-center bg-light p-5 rounded">
        <h4 className="fw-semibold">Our Vision</h4>
        <p className="text-muted mt-3">
          We envision a future where booking a sports court is as easy as
          booking a cab—accessible, reliable, and available to everyone.
        </p>
      </div>

    </div>
  );
}

export default About;