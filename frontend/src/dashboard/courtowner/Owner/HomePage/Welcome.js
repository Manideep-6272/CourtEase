import React from "react";
import '../Home.css';

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="row">
      <div className="col text-center">
        <h3>
          Welcome back, {user?.name || "Owner"} 👋
        </h3>
        <p className="mt-4">
          Here’s a quick overview of how your courts are performing today.
        </p>
      </div>
    </div>
  );
}

export default Home;