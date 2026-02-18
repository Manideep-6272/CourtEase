import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import UserDash from "./user/UserDash";
import AdminDash from "./admin/AdminDash";
import OwnerDash from "./courtowner/OwnerDash";
// import Dashboard from "./user/Dashboard";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/users/*" element={<UserDash />} />
      <Route path="/admin/*" element={<AdminDash />} />
      <Route path="/owners/*" element={<OwnerDash />} />
    </Routes>
  </BrowserRouter>
)