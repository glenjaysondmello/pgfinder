import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!token) {
      toast.error("Login to access");
    }
  }, [token]);

  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

// import React from "react";
// import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({children}) => {
//   const { token } = useSelector((store) => store.auth);
//   return token ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;,
