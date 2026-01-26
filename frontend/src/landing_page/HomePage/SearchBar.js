import React from 'react'
import './Home.css';
function SearchBar() {
    return (
        <>
        <div className="container mt-5 d-flex justify-content-center">
          <div className="card shadow-lg p-4 search-bar">
            <div className="row g-3 align-items-center">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter city"
                />
              </div>

              <div className="col-md-3">
                <select className="form-select">
                  <option defaultValue>Select sport</option>
                  <option>Badminton</option>
                  <option>Tennis</option>
                  <option>Football</option>
                  <option>Cricket</option>
                  <option>Basketball</option>
                </select>
              </div>

              <div className="col-md-3">
                <input type="date" className="form-control" />
              </div>

              <div className="col-md-3 d-grid">
                <button className="btn btn-primary fw-semibold">
                  Search Courts
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
    )
}
export default SearchBar;