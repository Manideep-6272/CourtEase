import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./AdminDashboard/Homepage/Home";
import Navbar from "./Navbar";
import Users from './AdminDashboard/Users/Users';
import Owners from './AdminDashboard/Owners/Owners';
import Requests from './AdminDashboard/Requests/Requests';
import Profile from './AdminDashboard/Profile/Profile';
function AdminDash() {
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/admin" element={<Home />} /> */}
          <Route path="getusers" element={<Users />} />
          <Route path="getowners" element={<Owners />} />
          <Route path="requests" element={<Requests />} />
          <Route path="profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
}
export default AdminDash;