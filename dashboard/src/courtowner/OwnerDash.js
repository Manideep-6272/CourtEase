import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Homepage from './Owner/HomePage/Homepage';
import MyCourts from './Owner/MyCourts/MyCourts';
import Bookings from './Owner/Bookings/Bookings';
import Earnings from './Owner/Earnings/Earnings';
import Profile from './Owner/Profile/Profile';
function OwnerDash() {
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          {/* <Route path="/owners" element={<Homepage />} /> */}
          <Route path="mycourts" element={<MyCourts />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}
export default OwnerDash;