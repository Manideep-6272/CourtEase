import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Homepage from './userdashboard/Home/Homepage';
import Mybookings from './userdashboard/Mybookings/Mybooking';
import Profile from "./userdashboard/profile/Profile";
function App() {
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Homepage />}/>
          <Route path="/mybookings" element={<Mybookings />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;