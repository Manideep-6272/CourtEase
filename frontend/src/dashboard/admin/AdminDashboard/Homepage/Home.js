import React from "react";
import '../admin.css';
function Home() {
  return (
    <div className="container-lg mt-4">
        <div className="row">
            <div className="col text-center mb-4">
                <h2 className="fw-bold">Platform Overview</h2>
                <p className="text-muted">System metrics and recent activity</p>
            </div>
        </div>
      {/* Header */}
      {/* <div className="mb-4">
        <h2 className="fw-bold">Platform Overview</h2>
        <p className="text-muted mb-0">
          System metrics and recent activity
        </p>
      </div> */}

      {/* Top Stats */}
      <div className="row g-3 mb-4">

        <div className="col-md-3">
          <div className="card shadow-sm border-0 small-card">
            <div className="card-body">
              <p className="text-muted mb-1 small">Total Users</p>
              <h4 className="fw-bold mb-0">1,240</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 small-card">
            <div className="card-body">
              <p className="text-muted mb-1 small">Court Owners</p>
              <h4 className="fw-bold mb-0">58</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 small-card">
            <div className="card-body">
              <p className="text-muted mb-1 small">Active Courts</p>
              <h4 className="fw-bold mb-0">146</h4>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 small-card">
            <div className="card-body">
              <p className="text-muted mb-1 small">Total Bookings</p>
              <h4 className="fw-bold mb-0">8,930</h4>
            </div>
          </div>
        </div>

      </div>

      {/* Second Row */}
      <div className="row g-3 mb-4">

        {/* Revenue */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 small-card h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-2">Revenue</h6>
              <p className="mb-1 small">Today: <strong>₹18,400</strong></p>
              <p className="mb-1 small">This Month: <strong>₹6,42,000</strong></p>
              <p className="mb-0 small">Total: <strong>₹42,10,000</strong></p>
            </div>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 small-card h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-2">Pending Approvals</h6>
              <p className="mb-2 small">
                🧑‍💼 Owners Pending: <strong>3</strong>
              </p>
              <button className="btn btn-outline-primary btn-sm">
                Review
              </button>
            </div>
          </div>
        </div>

        {/* Platform Health */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 small-card h-100">
            <div className="card-body">
              <h6 className="fw-semibold mb-2">Platform Health</h6>
              <p className="mb-1 small">🟢 System: Online</p>
              <p className="mb-1 small">⚠️ High Cancellations: 2</p>
              <p className="mb-0 small">🚨 Reports Today: 1</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Home;