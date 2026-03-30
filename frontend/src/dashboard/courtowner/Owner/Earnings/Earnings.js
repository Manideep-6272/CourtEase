import React, { useState, useEffect } from "react";
import api from "../../../../api";
import "../Home.css";

function Earnings() {
  const [earningsSummary, setEarningsSummary] = useState({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
  });
  const [earningsData, setEarningsData] = useState([]);
  const [courtData, setCourtData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      console.log("[Earnings] Fetching earnings data...");
      const [statsRes, historyRes] = await Promise.all([
        api.get("/owner/stats"),
        api.get("/owner/earnings-history"),
      ]);

      console.log("[Earnings] Stats response:", statsRes.data);
      console.log("[Earnings] History response:", historyRes.data);

      setEarningsSummary({
        today: statsRes.data.todayEarnings || 0,
        week: statsRes.data.weekEarnings || 0,
        month: statsRes.data.monthEarnings || 0,
        total: statsRes.data.totalEarnings || 0,
      });

      setEarningsData(historyRes.data.earningsByDate || []);
      setCourtData(historyRes.data.earningsByCourt || []);
      console.log("[Earnings] Data set successfully");
      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("[Earnings] Failed to fetch earnings:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load earnings data");
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Earnings</h2>
        <p className="text-muted mb-0">
          Track your court earnings and performance
        </p>
      </div>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="row g-4 mb-4">

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <p className="text-muted mb-1">Today</p>
              <h3 className="fw-bold text-success">
                ₹{loading ? "-" : (earningsSummary.today || 0).toLocaleString('en-IN', {maximumFractionDigits: 0})}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <p className="text-muted mb-1">This Week</p>
              <h3 className="fw-bold">
                ₹{loading ? "-" : (earningsSummary.week || 0).toLocaleString('en-IN', {maximumFractionDigits: 0})}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <p className="text-muted mb-1">This Month</p>
              <h3 className="fw-bold">
                ₹{loading ? "-" : (earningsSummary.month || 0).toLocaleString('en-IN', {maximumFractionDigits: 0})}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <p className="text-muted mb-1">Total Earnings</p>
              <h3 className="fw-bold text-info">
                ₹{loading ? "-" : (earningsSummary.total || 0).toLocaleString('en-IN', {maximumFractionDigits: 0})}
              </h3>
            </div>
          </div>
        </div>

      </div>

      {/* Earnings by Date Table */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Earnings History (Last 30 days)</h5>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Court</th>
                  <th>Bookings</th>
                  <th>Amount Earned</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
                ) : earningsData.length === 0 ? (
                  <tr><td colSpan="4" className="text-center text-muted py-4">No earnings data</td></tr>
                ) : (
                  earningsData.map((item, idx) => (
                    <tr key={idx}>
                      <td>{formatDate(item.date)}</td>
                      <td className="fw-semibold">{item.courtName}</td>
                      <td><span className="badge bg-info">{item.bookingsCount}</span></td>
                      <td className="fw-bold text-success">₹{(item.earnings || 0).toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Earnings by Court Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Earnings by Court (All Time)</h5>
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Court Name</th>
                  <th>Sport</th>
                  <th>Total Bookings</th>
                  <th>Total Earnings</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="4" className="text-center py-4">Loading...</td></tr>
                ) : courtData.length === 0 ? (
                  <tr><td colSpan="4" className="text-center text-muted py-4">No court data</td></tr>
                ) : (
                  courtData.map((item, idx) => (
                    <tr key={idx}>
                      <td className="fw-semibold">{item.courtName}</td>
                      <td>{item.sport}</td>
                      <td><span className="badge bg-success">{item.totalBookings}</span></td>
                      <td className="fw-bold text-success">₹{(item.totalEarnings || 0).toLocaleString('en-IN', {maximumFractionDigits: 0})}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Earnings;
