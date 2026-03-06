import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Home.css";

function MyCourts() {
  const [courts, setCourts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    sport: "",
    location: "",
    city: "",
    price_per_hour: ""
  });

  useEffect(() => {
    fetchCourts();
  }, []);

  // GET COURTS
  const fetchCourts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/mycourts", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setCourts(res.data);

    } catch (err) {
      console.error(err);
      alert("Failed to fetch courts");
    }
  };

  // OPEN ADD MODAL
  const openAddModal = () => {
    setEditingCourt(null);

    setFormData({
      name: "",
      sport: "",
      location: "",
      city: "",
      price_per_hour: ""
    });

    setShowModal(true);
  };

  // OPEN EDIT MODAL
  const openEditModal = (court) => {

    setEditingCourt(court);

    setFormData({
      name: court.name,
      sport: court.sport,
      location: court.location,
      city: court.city,
      price_per_hour: court.price_per_hour
    });

    setShowModal(true);
  };

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  // ADD OR UPDATE COURT
  const saveCourt = async () => {

    try {

      if (editingCourt) {

        const res = await axios.put(
          `http://localhost:5000/courts/${editingCourt.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        const updatedCourts = courts.map((court) =>
          court.id === editingCourt.id ? res.data.court : court
        );

        setCourts(updatedCourts);

      } else {

        const res = await axios.post(
          "http://localhost:5000/courts",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        setCourts([...courts, res.data.court]);

      }

      setShowModal(false);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  // DELETE COURT
  const deleteCourt = async (id) => {

    if (!window.confirm("Delete this court?")) return;

    try {

      await axios.delete(`http://localhost:5000/courts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setCourts(courts.filter((court) => court.id !== id));

    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="container mt-4">

      {/* HEADER */}
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

      {/* COURTS LIST */}
      <div className="row justify-content-center g-4 mt-4">

        {courts.length === 0 ? (
          <p className="text-center text-muted">
            No courts added yet
          </p>
        ) : (
          courts.map((court) => (
            <div className="col-md-4" key={court.id}>
              <div className="card shadow-sm border-0 h-100">

                <div className="card-body">

                  <h5 className="fw-semibold">
                    {court.name}
                  </h5>

                  <p className="mb-1">
                    🏸 {court.sport}
                  </p>

                  <p className="mb-1">
                    📍 {court.location}, {court.city}
                  </p>

                  <p className="fw-semibold">
                    💰 ₹{court.price_per_hour} / hour
                  </p>

                  <span className="badge bg-success mb-3">
                    Active
                  </span>

                  <div className="d-flex gap-2 mt-3">

                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => openEditModal(court)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteCourt(court.id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            </div>
          ))
        )}

      </div>

      {/* MODAL */}

      {showModal && (
        <div className="modal-overlay">

          <div className="modal-card">

            <h5 className="fw-bold mb-3">
              {editingCourt ? "Edit Court" : "Add Court"}
            </h5>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Court Name
              </label>

              <input
                type="text"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Sport
              </label>

              <select
                name="sport"
                className="form-select"
                value={formData.sport}
                onChange={handleChange}
              >
                <option value="">Select sport</option>
                <option>Badminton</option>
                <option>Football</option>
                <option>Tennis</option>
                <option>Cricket</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Location
              </label>

              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                City
              </label>

              <input
                type="text"
                name="city"
                className="form-control"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Price per Hour (₹)
              </label>

              <input
                type="number"
                name="price_per_hour"
                className="form-control"
                value={formData.price_per_hour}
                onChange={handleChange}
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
                onClick={saveCourt}
              >
                {editingCourt ? "Update" : "Save"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
export default MyCourts;