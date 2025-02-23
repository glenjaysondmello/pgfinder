import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import Search from "./pages/Search";
import Chatbot from "./pages/Chatbot";
import AdminDashboard from "./adminpage/AdminDashboard";
import AddPg from "./adminpage/AddPg";
import GetPg from "./adminpage/GetPg";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<Search />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/add-pg" element={<AddPg />} />
          <Route path="/get-pgs" element={<GetPg />} />
        </Routes>
      </Router>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
