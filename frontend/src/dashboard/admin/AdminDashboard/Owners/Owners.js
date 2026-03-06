import React, { useEffect, useState } from "react";
import "../admin.css";
import axios from "axios";

function Owners() {

  const [owners, setOwners] = useState([]);
  const [filteredOwners, setFilteredOwners] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/admin/fetchowners",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setOwners(res.data);
      setFilteredOwners(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  // 🔍 Filter owners
  const handleFilter = () => {

    const filtered = owners.filter((owner) =>
      owner.name.toLowerCase().includes(search.toLowerCase()) ||
      owner.phone.includes(search)
    );

    setFilteredOwners(filtered);
  };

  const updateStatus = async (ownerId, ownerStatus) => {
    try {

      const token = localStorage.getItem("token");

      const newStatus =
        ownerStatus === "approved" ? "pending" : "approved";

      await axios.put(
        `http://localhost:5000/admin/owners/${ownerId}/updateStatus`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      fetchOwners();

    } catch (err) {
      console.log(err);
    }
  };

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
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="col-md-4 d-grid">
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleFilter}
                  >
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
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredOwners.map((owner) => (
                <tr key={owner.id}>

                  <td>{owner.name}</td>

                  <td>{owner.phone}</td>

                  <td>
                    <span
                      className={`badge ${
                        owner.approval_status === "approved"
                          ? "bg-success"
                          : "bg-secondary"
                      }`}
                    >
                      {owner.approval_status}
                    </span>
                  </td>

                  <td>
                    <button
                      onClick={() =>
                        updateStatus(owner.id, owner.approval_status)
                      }
                      className={`btn btn-sm ${
                        owner.approval_status === "approved"
                          ? "btn-outline-danger"
                          : "btn-outline-success"
                      }`}
                    >
                      {owner.approval_status === "approved"
                        ? "Disable"
                        : "Approve"}
                    </button>
                  </td>

                </tr>
              ))}

              {filteredOwners.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No owners found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
}
export default Owners;