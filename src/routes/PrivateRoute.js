import React from "react";
import { Navigate, Outlet } from "react-router-dom";
const PrivateRoute = ({ component: component, ...rest }) => {
  const token = localStorage.getItem("ceat_admin_user");
  return token ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
