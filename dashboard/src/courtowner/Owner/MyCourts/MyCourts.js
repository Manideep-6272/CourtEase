import React, { useState } from "react";
import "../Home.css";

function MyCourts() {
  const [courts, setCourts] = useState([
    {
      id: 1,
      name: "Elite Sports Arena",
      sport: "Badminton",
      location: "Bengaluru",
      price: 700,
      status: "Active",
    },
    {
      id: 2,
      name: "Play Arena",
      sport: "Football",
      location: "Bengaluru",
      price: 1200,
      status: "Inactive",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);

  const openAddModal = () => {
    setEditingCourt(null);
    setShowModal(true);
  };

  const openEditModal = (court) => {
    setEditingCourt(court);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold">My Courts</h2>
          <p className="text-muted mb-0">
            Manage your courts, pricing & slots
          </p>
        </div>

        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Court
        </button>
      </div>

      {/* Courts */}
      <div className="row justify-content-center g-4 mt-5">
        {courts.map((court) => (
          <div className="col-md-4" key={court.id}>
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body">
                <h5 className="fw-semibold">{court.name}</h5>
                <p className="mb-1">🏸 {court.sport}</p>
                <p className="mb-1">📍 {court.location}</p>
                <p className="fw-semibold">
                  💰 ₹{court.price} / hour
                </p>

                <span
                  className={`badge ${
                    court.status === "Active"
                      ? "bg-success"
                      : "bg-secondary"
                  }`}
                >
                  {court.status}
                </span>

                <div className="mt-3">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => openEditModal(court)}
                  >
                    Edit
                  </button>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT COURT MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">

            <h5 className="fw-bold mb-3">
              {editingCourt ? "Edit Court" : "Add Court"}
            </h5>

            <div className="mb-3">
              <label className="form-label fw-semibold">Court Name</label>
              <input
                type="text"
                className="form-control"
                defaultValue={editingCourt?.name || ""}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Sport</label>
              <select
                className="form-select"
                defaultValue={editingCourt?.sport || ""}
              >
                <option value="">Select sport</option>
                <option>Badminton</option>
                <option>Football</option>
                <option>Tennis</option>
                <option>Cricket</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Location</label>
              <input
                type="text"
                className="form-control"
                defaultValue={editingCourt?.location || ""}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Price per Hour (₹)
              </label>
              <input
                type="number"
                className="form-control"
                defaultValue={editingCourt?.price || ""}
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(false)}
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default MyCourts;
