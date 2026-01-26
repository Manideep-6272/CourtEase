import React from "react";
function Sports() {
  return (
    <>
      <div className="container my-5">
        <h2 className="text-center fw-bold mb-4">Sports We Support</h2>

        <div className="row g-4 text-center sports">
          <div className="col-6 col-md-4 col-lg-2">
            <div className="card p-3 shadow-sm h-100">
              <div className="fs-1">🏸</div>
              <h6 className="mt-2 fw-semibold">Badminton</h6>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card p-3 shadow-sm h-100">
              <div className="fs-1">🎾</div>
              <h6 className="mt-2 fw-semibold">Tennis</h6>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card p-3 shadow-sm h-100">
              <div className="fs-1">⚽</div>
              <h6 className="mt-2 fw-semibold">Football</h6>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card p-3 shadow-sm h-100">
              <div className="fs-1">🏏</div>
              <h6 className="mt-2 fw-semibold">Cricket</h6>
            </div>
          </div>

          <div className="col-6 col-md-4 col-lg-2">
            <div className="card p-3 shadow-sm h-100">
              <div className="fs-1">🏀</div>
              <h6 className="mt-2 fw-semibold">Basketball</h6>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Sports;
