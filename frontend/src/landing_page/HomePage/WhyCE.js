import React from "react";
import "./Home.css";
function WhyCE() {
  return (
    <>
      <div className="container my-5">
        <h2 className="text-center fw-bold mb-4">Why Choose CourtEase</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="d-flex align-items-start gap-3">
              <div className="fs-2">⚡</div>
              <div>
                <h6 className="fw-semibold">Instant Booking</h6>
                <p className="text-muted">
                  Book your preferred court in just a few clicks.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="d-flex align-items-start gap-3">
              <div className="fs-2">⏱️</div>
              <div>
                <h6 className="fw-semibold">Real-Time Availability</h6>
                <p className="text-muted">
                  View live court availability and book instantly.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-start gap-3">
              <div className="fs-2">🔐</div>
              <div>
                <h6 className="fw-semibold">Secure Payments</h6>
                <p className="text-muted">
                  Safe and secure payment transactions.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="d-flex align-items-start gap-3">
              <div className="fs-2">🏟️</div>
              <div>
                <h6 className="fw-semibold">Verified Venues</h6>
                <p className="text-muted">
                  Book courts from trusted and verified locations.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="d-flex align-items-start gap-3">
              <div className="fs-2">❌</div>
              <div>
                <h6 className="fw-semibold">Easy Cancellation</h6>
                <p className="text-muted">
                  Cancel or reschedule bookings effortlessly.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="d-flex align-items-start gap-3">
              <div className="fs-2">⭐</div>
              <div>
                <h6 className="fw-semibold">Best Experience</h6>
                <p className="text-muted">
                  Designed to deliver a smooth user experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default WhyCE;
