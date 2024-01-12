import React from "react";
import { Outlet } from "react-router-dom";
import "./auth-layout.scss";

function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-layout-card">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
