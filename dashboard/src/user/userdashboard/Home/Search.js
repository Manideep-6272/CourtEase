import React, { useState } from "react";

function Search() {
  // 🔹 Dummy courts data (frontend only)
  const dummyCourts = [
    {
      id: 1,
      name: "Elite Sports Arena",
      location: "Bengaluru",
      sport: "Badminton",
      slots: ["6:00 PM", "7:00 PM"],
    },
    {
      id: 2,
      name: "Play Arena",
      location: "Bengaluru",
      sport: "Football",
      slots: ["5:00 PM", "6:00 PM"],
    },
    {
      id: 3,
      name: "Ace Badminton Court",
      location: "Chennai",
      sport: "Badminton",
      slots: ["7:00 PM", "8:00 PM"],
    },
    {
      id: 3,
      name: "Ace Badminton Court",
      location: "Chennai",
      sport: "Badminton",
      slots: ["7:00 PM", "8:00 PM"],
    },
    {
      id: 3,
      name: "Ace Badminton Court",
      location: "Chennai",
      sport: "Badminton",
      slots: ["7:00 PM", "8:00 PM"],
    },
    {
      id: 3,
      name: "Ace Badminton Court",
      location: "Chennai",
      sport: "Badminton",
      slots: ["7:00 PM", "8:00 PM"],
    }
  ];

  // 🔹 Form state
  const [form, setForm] = useState({
    location: "",
    sport: "",
    date: "",
  });

  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    const filtered = dummyCourts.filter(
      (court) =>
        court.location.toLowerCase().includes(form.location.toLowerCase()) &&
        court.sport === form.sport,
    );

    setResults(filtered);
  };

  return (
    <>
      {/* 🔍 Search Bar */}
      <div className="container mt-5 d-flex justify-content-center">
        <div
          className="card shadow-lg p-4 search-bar"
          style={{ maxWidth: "900px", width: "100%" }}
        >
          <div className="row g-3 align-items-center">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter location"
                name="location"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3">
              <select
                className="form-select"
                name="sport"
                onChange={handleChange}
              >
                <option value="">Select sport</option>
                <option>Badminton</option>
                <option>Tennis</option>
                <option>Football</option>
                <option>Cricket</option>
                <option>Basketball</option>
              </select>
            </div>

            <div className="col-md-3">
              <input
                type="date"
                className="form-control"
                name="date"
                onChange={handleChange}
              />
            </div>

            <div className="col-md-3 d-grid">
              <button
                className="btn btn-primary fw-semibold"
                onClick={handleSearch}
              >
                Search Courts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📋 Results Section */}
      <div className="container mt-4" style={{ maxWidth: "1100px" }}>
        {results.length === 0 ? (
          <p className="text-muted text-center">
            No courts found. Try searching.
          </p>
        ) : (
          <div className="row g-4">
            {results.map((court) => (
              <div className="col-lg-4 col-md-6 col-sm-12" key={court.id}>
                <div className="card shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    <h6 className="fw-semibold">{court.name}</h6>
                    <p className="text-muted mb-2">
                      📍 {court.location} • 🏸 {court.sport}
                    </p>

                    {/* Slots */}
                    <div className="d-flex gap-2 flex-wrap mt-auto">
                      {court.slots.map((slot, index) => (
                        <button
                          key={index}
                          className="btn btn-outline-primary btn-sm"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Search;
