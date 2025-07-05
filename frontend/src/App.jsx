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
import PgDetails from "./pages/PgDetails";
import Cart from "./pages/Cart";
import { useSelector } from "react-redux";
import PrivateRoute from "./privateroute/PrivateRoute";
import useFetchUserRole from "./hooks/useFetchUserRole";
import Settings from "./pages/Settings";
import Payments from "./pages/Payments";
// import useFirebaseAuthListener from "./hooks/useFirebaseAuthListener";

const App = () => {
  useFetchUserRole();

  const { token } = useSelector((store) => store.auth);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {!token && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </>
        )}

        <Route
          path="/search"
          element={
            <PrivateRoute>
              <Search />
            </PrivateRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <PrivateRoute>
              <Chatbot />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/addpg"
          element={
            <PrivateRoute>
              <AddPg />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/getpg"
          element={
            <PrivateRoute>
              <GetPg />
            </PrivateRoute>
          }
        />
        <Route
          path="/search/pg/:id"
          element={
            <PrivateRoute>
              <PgDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/getpg/:id"
          element={
            <PrivateRoute>
              <PgDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings/payments"
          element={
            <PrivateRoute>
              <Payments />
            </PrivateRoute>
          }
        />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </Router>
  );
};

export default App;
