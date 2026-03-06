import React, { useEffect, useState } from "react";
import "../admin.css";
import axios from "axios";

function Users() {

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5000/admin/fetchusers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
      setFilteredUsers(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  // 🔍 Filter Users
  const handleSearch = () => {

    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.includes(search)
    );

    setFilteredUsers(filtered);
  };

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
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="col-md-4 d-grid">
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
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
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredUsers.map((user) => (

                <tr key={user.id}>

                  <td>{user.name}</td>

                  <td>{user.phone}</td>

                  <td>
                    <span
                      className={`badge ${
                        user.is_active ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <button className="btn btn-outline-primary btn-sm me-2">
                      View
                    </button>

                    <button
                      className={`btn btn-sm ${
                        user.is_active
                          ? "btn-outline-danger"
                          : "btn-outline-success"
                      }`}
                    >
                      {user.is_active ? "Block" : "Unblock"}
                    </button>
                  </td>

                </tr>

              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No users found
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
export default Users;