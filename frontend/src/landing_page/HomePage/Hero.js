import React from "react";
import './Home.css';
function Hero() {
  return (
    <>
      <div className="row mt-5">
        <div className="col text-center fw-bold">
          <h1>Welcome to CourtEase</h1>
          <p>Book your sports courts anytime, anywhere.</p>
        </div>
      </div>
      <div className="row mt-5 text-center">
        <div className="col"></div>
        <div className="col"></div>
        <div className="col">
          <button className="btn btn-primary m-3">Book a court</button>
        </div>
        <div className="col">
          <button className="btn btn-secondary m-3">Explore Sports</button>
        </div>
        <div className="col"></div>
        <div className="col"></div>
      </div>
    </>
  );
}
export default Hero;