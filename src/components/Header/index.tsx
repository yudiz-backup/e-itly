import { VNode } from "preact";
import React, { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";

import IconButton from "../IconButton";
import Notification from "../Notification";
import UserInformation from "../UserInformation";
import { iconHamburger, iconEnvelope } from "src/assets/images";
import "./header.scss";
import { NavLink } from "react-router-dom";
import { allRoutes } from "src/constants/AllRoutes";

const Header = ({ is_Open, setIsOpen }: HeaderProps): VNode<any> => {
  const [show, handleShow] = useState(false);
  const HEADER_HEIGHT = 50;

  useEffect(() => {
    window.addEventListener("scroll", () => {
      handleShow(window.scrollY > HEADER_HEIGHT);
    });
  }, []);

  const handleSideMenu = () => {
    setIsOpen(!is_Open);
  };
  return (
    <header className={`header ${show ? "active" : ""}`}>
      <Nav>
        <Notification />
        <NavLink to={allRoutes.messageThread}>
          <IconButton icon={iconEnvelope} />
        </NavLink>
        <UserInformation />
        <IconButton
          icon={iconHamburger}
          onClick={handleSideMenu}
          className="sidebar-btn"
        />
      </Nav>
    </header>
  );
};
type HeaderProps = {
  is_Open?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
};
export default Header;
