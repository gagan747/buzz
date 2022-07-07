/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/order */
/* eslint-disable import/extensions */
import './App.css';
import React from 'react';
import { ToastContainer } from 'react-toastify';
import Login from './components/login';
import Signup from './components/signup';
import 'react-toastify/dist/ReactToastify.css';
import Forgotpassword from './components/forgotpassword.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.js';
import NotFound from './pages/notfound.jsx';
import UserProfile from './components/userProfile/UserProfile';
import ViewProfile from './components/viewProfile/ViewProfile';
import GetFriendRequest from './components/getFriendRquest/GetFriendRequest';
import { unregister } from './interceptor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/*" element={<NotFound />} />
        <Route path="/home" element={<Home />} />
        <Route path="/home/:jwtoken" element={<Home />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/viewProfile" element={<ViewProfile />} />
        <Route path="/getFriendRequest" element={<GetFriendRequest />} />
        <Route path="/login/:error" element={<Login error="Not a valid TTN mail" />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}
export default App;
