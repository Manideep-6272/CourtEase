import React, { useState } from "react";
import "../admin.css";
function Users() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Aman Kumar",
      email: "aman@gmail.com",
      phone: "9876543210",
      city: "Bengaluru",
      status: "Active",
    },
    {
      id: 2,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "9123456789",
      city: "Mumbai",
      status: "Blocked",
    },
    {
      id: 3,
      name: "Neha Singh",
      email: "neha@gmail.com",
      phone: "9988776655",
      city: "Delhi",
      status: "Active",
    },
  ]);

  return (
    <div className="container-lg mt-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Users</h2>
        <p className="text-muted mb-0">Manage registered platform users</p>
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

      {/* Users Table */}
      <div className="card shadow-sm border-0">
        <div className="card-body table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.city}</td>
                  <td>
                    <span
                      className={`badge ${
                        user.status === "Active" ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline-primary btn-sm me-2">
                      View
                    </button>
                    <button
                      className={`btn btn-sm ${
                        user.status === "Active"
                          ? "btn-outline-danger"
                          : "btn-outline-success"
                      }`}
                    >
                      {user.status === "Active" ? "Block" : "Unblock"}
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

export default Users;
