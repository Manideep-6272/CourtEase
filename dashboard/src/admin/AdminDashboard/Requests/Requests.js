import React, { useEffect, useState } from "react";
import "../admin.css";
import axios from "axios";
function Requests() {
  const [pendingOwners, setPendingowners] = useState([]);
  useEffect(() => {
    fetchPendingowners();
  }, []);
  const fetchPendingowners = async () => {
    try {
      const token = localStorage.getItem("token");
      const pendingOwners = await axios.get(
        "http://localhost:5000/admin/fetchPendingOwners",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setPendingowners(pendingOwners.data);
    } catch (error) {
      console.error(error);
    }
  };
  const updateOwnerStatus = async (ownerId, ownerStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/admin/owners/${ownerId}/updateStatus`,
        { status: ownerStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchPendingowners();
    } catch (err) {
      console.log(err);
    }
  };
  const rejectOwner = async (ownerId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/admin/owners/${ownerId}/deleteOwner`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchPendingowners();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="container-lg mt-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold">Owner Approvals</h2>
        <p className="text-muted mb-0">Review and approve new court owners</p>
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
      <div className="card shadow-sm border-0">
        <div className="card-body table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Contact</th>
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
                      <div>{owner.phone}</div>
                    </td>
                    <td>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => updateOwnerStatus(owner.id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => rejectOwner(owner.id)}
                      >
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
