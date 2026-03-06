import React from "react";
import "../Home.css";
function Stats() {
  return (
    <div className="row g-4 mb-4 mt-4">
      <div className="col-md-3">
        <div className="card border-0 shadow-sm stat-card">
          <div className="card-body">
            <p className="text-muted mb-1">Total Courts</p>
            <h3 className="fw-bold">4</h3>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card border-0 shadow-sm stat-card">
          <div className="card-body">
            <p className="text-muted mb-1">Today’s Bookings</p>
            <h3 className="fw-bold">12</h3>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card border-0 shadow-sm stat-card">
          <div className="card-body">
            <p className="text-muted mb-1">Today’s Earnings</p>
            <h3 className="fw-bold">₹8,400</h3>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card border-0 shadow-sm stat-card">
          <div className="card-body">
            <p className="text-muted mb-1">Active Slots</p>
            <h3 className="fw-bold">6</h3>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Stats;
