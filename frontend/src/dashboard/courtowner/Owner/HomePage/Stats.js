import React, { useState, useEffect } from "react";
import api from "../../../../api"; // ✅ FIXED (after moving api.js to src/)
import "../Home.css";

function Stats() {
  const [stats, setStats] = useState({
    totalCourts: 0,
    todayBookings: 0,
    todayEarnings: 0,
    activeSlots: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      console.log("[Stats] Fetching owner stats...");

      const res = await api.get("/owner/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ important
        },
      });

      console.log("[Stats] API Response:", res.data);

      setStats({
        totalCourts: res.data.totalCourts || 0,
        todayBookings: res.data.todayBookings || 0,
        todayEarnings: res.data.todayEarnings || 0,
        activeSlots: res.data.activeSlots || 0,
      });

      setLoading(false);
    } catch (err) {
      console.error(
        "[Stats] Failed to fetch stats:",
        err.response?.data || err.message
      );

      setError(err.response?.data?.message || "Failed to load stats");
      setLoading(false);
    }
  };

  // ❌ ERROR UI
  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  // ⏳ LOADING UI
  if (loading) {
    return (
      <div className="row g-4 mb-4 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="col-md-3">
            <div className="card border-0 shadow-sm stat-card">
              <div className="card-body">
                <div
                  style={{
                    height: "60px",
                    background: "#f0f0f0",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ✅ MAIN UI
  return (
    <div className="row g-4 mb-4 mt-4">

      <div className="col-md-3">
        <div className="card border-0 shadow-sm stat-card">
          <div className="card-body">
            <p className="text-muted mb-1">Total Courts</p>
            <h3 className="fw-bold">{stats.totalCourts}</h3>
            <small className="text-success">Active courts</small>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card border-0 shadow-sm stat-card">
          <div className="card-body">
            <p className="text-muted mb-1">Today’s Bookings</p>
            <h3 className="fw-bold">{stats.todayBookings}</h3>
            <small className="text-info">Confirmed bookings</small>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card border-0 shadow-sm stat-card">
          <div className="card-body">
            <p className="text-muted mb-1">Today’s Earnings</p>
            <h3 className="fw-bold text-success">
              ₹{stats.todayEarnings.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </h3>
            <small className="text-success">Real earnings</small>
          </div>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card border-0 shadow-sm stat-card">
          <div className="card-body">
            <p className="text-muted mb-1">Active Slots</p>
            <h3 className="fw-bold">{stats.activeSlots}</h3>
            <small className="text-warning">Available slots</small>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Stats;