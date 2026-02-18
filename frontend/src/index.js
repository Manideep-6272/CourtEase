import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import NavBar  from './NavBar';
import Footer from './Footer';
import About from './landing_page/AboutPage/About';
import Home from './landing_page/HomePage/Home';
import Login from './landing_page/Signup/Login';
import Register from './landing_page/Signup/Register';
import Contact from './landing_page/Contact/Contact';
// import './index.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals