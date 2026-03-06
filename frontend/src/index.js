import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import NavBar from './NavBar';
import Footer from './Footer';

import About from './landing_page/AboutPage/About';
import Home from './landing_page/HomePage/Home';
import Login from './landing_page/Signup/Login';
import Register from './landing_page/Signup/Register';
import Contact from './landing_page/Contact/Contact';

import AdminDash from './dashboard/admin/AdminDash';
import OwnerDash from './dashboard/courtowner/OwnerDash';
import UserDash from './dashboard/user/UserDash';

function LandingLayout({ children }) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Routes>

      {/* Landing Pages */}
      <Route path="/" element={
        <LandingLayout>
          <Home />
        </LandingLayout>
      } />

      <Route path="/register" element={
        <LandingLayout>
          <Register />
        </LandingLayout>
      } />

      <Route path="/login" element={
        <LandingLayout>
          <Login />
        </LandingLayout>
      } />

      <Route path="/about" element={
        <LandingLayout>
          <About />
        </LandingLayout>
      } />

      <Route path="/contact" element={
        <LandingLayout>
          <Contact />
        </LandingLayout>
      } />

      {/* Dashboards (NO Navbar / Footer) */}
      <Route path="/admin/*" element={<AdminDash />} />
      <Route path="/owner/*" element={<OwnerDash />} />
      <Route path="/user/*" element={<UserDash />} />

    </Routes>
  </BrowserRouter>
);