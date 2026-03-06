import React from "react";
import "../../userdashboard/dashboard.css";

function Hero() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="card border-0 mb-4 user-hero mt-5">
      <div className="card-body d-flex justify-content-center align-items-center text-center">
        <div>
          <h3 className="fw-bold mb-1">
            Hi {user?.name || "User"} 👋
          </h3>
          <p className="text-muted mb-0">
            Ready to book your next game?
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;