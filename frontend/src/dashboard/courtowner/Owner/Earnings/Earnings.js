import React from "react";
import "../Home.css";

function Earnings() {
  const earningsSummary = {
    today: 8400,
    week: 42500,
    month: 162000,
  };

  const earningsData = [
    {
      id: 1,
      date: "12 Feb 2026",
      court: "Elite Sports Arena",
      bookings: 6,
      amount: 4200,
    },
    {
      id: 2,
      date: "12 Feb 2026",
      court: "Play Arena",
      bookings: 3,
      amount: 3600,
    },
    {
      id: 3,
      date: "13 Feb 2026",
      court: "Elite Sports Arena",
      bookings: 5,
      amount: 3500,
    },
  ];

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Earnings</h2>
        <p className="text-muted mb-0">
          Track your court earnings and performance
        </p>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <p className="text-muted mb-1">Today</p>
              <h3 className="fw-bold text-success">
                ₹{earningsSummary.today}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <p className="text-muted mb-1">This Week</p>
              <h3 className="fw-bold">
                ₹{earningsSummary.week}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <p className="text-muted mb-1">This Month</p>
              <h3 className="fw-bold">
                ₹{earningsSummary.month}
              </h3>
            </div>
          </div>
        </div>

      </div>

      {/* Earnings Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body table-responsive">

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
              {earningsData.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.court}</td>
                  <td>{item.bookings}</td>
                  <td className="fw-semibold">
                    ₹{item.amount}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default Earnings;
