import React, { useEffect, useState } from "react";
import { VNode } from "preact";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Header from "src/components/Header";
import Sidebar from "src/components/Sidebar";
import "./auth-layout.scss";
import CustomBreadcrumb from "src/components/CustomBreadcrumb";
import { isSuperAdmin } from "src/utils/users";
import { allRoutes } from "src/constants/AllRoutes";

function UserLayout(): VNode<any> {
  const [is_Open, setIsOpen] = useState(false);
  const superAdmin = isSuperAdmin();
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    function handleUnauthorised() {
      navigate(allRoutes.login)
    }
    window.addEventListener('unauthorised', handleUnauthorised)
    return () => {
      window.removeEventListener('unauthorised', handleUnauthorised)
    }
  }, [])
  useEffect(() => {
    if (!superAdmin && location.pathname === allRoutes.dashboard) {
      navigate(allRoutes.itinerary)
    }
  }, [!superAdmin  && location.pathname === allRoutes.dashboard]);

  if (!superAdmin && location.pathname === allRoutes.dashboard) {
    navigate(allRoutes.itinerary)
    return null
  }

  return (
    <div className="user-layout">
      <Sidebar is_Open={is_Open} setIsOpen={setIsOpen} isSuperAdmin={isSuperAdmin()} />
      <div className="main-container">
        <Header is_Open={is_Open} setIsOpen={setIsOpen} />
        <div className="user-layout-inner">
          <CustomBreadcrumb />
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserLayout;
