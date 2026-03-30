import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

import NavBar from './NavBar';
import Footer from './Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

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

      {/* Protected Dashboard Routes */}
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDash />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/owner/*" 
        element={
          <ProtectedRoute requiredRole="owner">
            <OwnerDash />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/user/*" 
        element={
          <ProtectedRoute requiredRole="user">
            <UserDash />
          </ProtectedRoute>
        } 
      />

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  </BrowserRouter>
);