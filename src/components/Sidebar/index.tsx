import { VNode } from "preact";
import React, { useState } from "react";
import IconButton from "../IconButton";
import { iconClose, iconSidebarLogo } from "src/assets/images";
import "./sidebar.scss";
import { sidebarConfig } from "src/constants/SidebarConfig";
import MenuItem from "./MenuItem";
import { Link } from "react-router-dom";
import { allRoutes } from "src/constants/AllRoutes";

const SideBar = ({ is_Open, setIsOpen, isSuperAdmin = false }: SideBarProps): VNode<any> => {
  const handleSideMenu = () => {
    setIsOpen(false);
  };
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const toggleSubMenu = (submenu) => {
    if (activeSubMenu === submenu) {
      setActiveSubMenu(null);
    } else {
      setActiveSubMenu(submenu);
    }
  };
  return (
    <aside className={`sidebar ${is_Open ? "active" : ""}`}>
      <div className="sidebar-logo d-flex align-items-center justify-content-between">
        <Link to={allRoutes.dashboard}>
          <img src={iconSidebarLogo} alt="logo" />
        </Link>
        <IconButton
          icon={iconClose}
          onClick={handleSideMenu}
          className="sidebar-btn"
        />
      </div>
      <div className="menu">
        <ul>
          {sidebarConfig.map((item, index) => {
            if (!isSuperAdmin && item?.path === allRoutes.dashboard) {
              return null
            }
            return (
              <MenuItem
                key={index}
                item={item}
                isMenuOpen={is_Open}
                activeSubMenu={activeSubMenu}
                toggleSubMenu={toggleSubMenu}
              />
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

type SideBarProps = {
  is_Open?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  isSuperAdmin?: boolean
};
export default SideBar;
