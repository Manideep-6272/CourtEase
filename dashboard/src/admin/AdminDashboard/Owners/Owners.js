import React, { useState } from "react";
import "../admin.css";
function Owners() {
  const [owners] = useState([
    {
      id: 1,
      name: "Aman Kumar",
      email: "aman@gmail.com",
      phone: "9876543210",
      city: "Bengaluru",
      courts: 3,
      status: "Active",
      verified: "Yes",
    },
    {
      id: 2,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "9123456789",
      city: "Mumbai",
      courts: 1,
      status: "Inactive",
      verified: "No",
    },
    {
      id: 3,
      name: "Neha Singh",
      email: "neha@gmail.com",
      phone: "9988776655",
      city: "Delhi",
      courts: 2,
      status: "Active",
      verified: "Yes",
    },
  ]);

  return (
    <div className="container-lg mt-4">

      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Court Owners</h2>
        <p className="text-muted mb-0">
          Manage court owners and their activity
        </p>
      </div>

      {/* Filters */}
      <div className="d-flex justify-content-center mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="row g-3">

                <div className="col-md-8">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or mobile number"
                  />
                </div>

                <div className="col-md-4 d-grid">
                  <button className="btn btn-outline-primary">
                    Filter
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Owners Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body table-responsive">

          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Contact</th>
                <th>City</th>
                <th>Courts</th>
                <th>Verified</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {owners.map((owner) => (
                <tr key={owner.id}>
                  <td>{owner.name}</td>
                  <td>
                    <div>{owner.email}</div>
                    <small className="text-muted">{owner.phone}</small>
                  </td>
                  <td>{owner.city}</td>
                  <td className="fw-semibold">{owner.courts}</td>
                  <td>
                    <span
                      className={`badge ${
                        owner.verified === "Yes"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {owner.verified}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        owner.status === "Active"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {owner.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline-primary btn-sm me-2">
                      View
                    </button>
                    <button
                      className={`btn btn-sm ${
                        owner.status === "Active"
                          ? "btn-outline-danger"
                          : "btn-outline-success"
                      }`}
                    >
                      {owner.status === "Active" ? "Disable" : "Enable"}
                    </button>
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

export default Owners;