import React, { useState } from "react";
import "../admin.css";

function Requests() {
  const [pendingOwners] = useState([
    {
      id: 1,
      name: "Rohit Mehra",
      email: "rohit@gmail.com",
      phone: "9876543210",
      city: "Bengaluru",
      courtsRequested: 2,
    },
    {
      id: 2,
      name: "Sneha Patel",
      email: "sneha@gmail.com",
      phone: "9123456789",
      city: "Ahmedabad",
      courtsRequested: 1,
    },
  ]);

  return (
    <div className="container-lg mt-4">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Owner Approvals</h2>
        <p className="text-muted mb-0">
          Review and approve new court owners
        </p>
      </div>
        {/* Filters */}
      <div className="d-flex justify-content-center mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="row g-3 align-items-center">
                <div className="col-md-8">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by Name or Mobile Number"
                  />
                </div>

                <div className="col-md-4 d-grid">
                  <button className="btn btn-outline-primary">Search</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Pending Owners Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body table-responsive">

          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>City</th>
                <th>Courts Requested</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {pendingOwners.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    No pending approvals 🎉
                  </td>
                </tr>
              ) : (
                pendingOwners.map((owner) => (
                  <tr key={owner.id}>
                    <td>{owner.name}</td>
                    <td>
                      <div>{owner.email}</div>
                      <small className="text-muted">{owner.phone}</small>
                    </td>
                    <td>{owner.city}</td>
                    <td className="fw-semibold">
                      {owner.courtsRequested}
                    </td>
                    <td>
                      <button className="btn btn-success btn-sm me-2">
                        Approve
                      </button>
                      <button className="btn btn-outline-danger btn-sm">
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}

export default Requests;
