import { VNode } from "preact";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { SVGArrowDown } from "src/assets/images";

function MenuItem({
  item,
  isMenuOpen,
  activeSubMenu,
  toggleSubMenu,
}: MenuItemProps): VNode<any> {
  const [isOpen, setIsOpen] = useState(false);
  const childPaths = item.children?.map((i) => i.path.split("/")[1]);
  const location = useLocation();

  useEffect(() => {
    !isMenuOpen && setIsOpen(false);
  }, [isMenuOpen]);

  useEffect(() => {
    setIsOpen(activeSubMenu === item.path);
  }, [activeSubMenu, item.path]);

  const toggle = () => {
    setIsOpen(!isOpen);
    toggleSubMenu(isOpen ? null : item.path);
  };

  return (
    <li className={isOpen ? "open" : ""}>
      {item.children ? (
        <>
          <div onClick={toggle} className={isOpen ? "toggle-btn-open" : ""}>
            <div
              className={`sidebar-item justify-content-between ${
                childPaths?.includes(location.pathname.split("/")[1])
                  ? "active"
                  : ""
              }`}
            >
              <div className='d-flex align-items-center'>
                <span>
                  <img src={item.icon} alt={item.title} />
                </span>
                {item.title}
              </div>
              <span className="m-0 down-arrow">
                <SVGArrowDown />
              </span>
            </div>
          </div>
          <ul className="dropdown-menu show">
            {item.children.map((subItem) => (
              <li key={subItem.path}>
                <NavLink className="sidebar-item" to={subItem.path}>
                  {/* <span>
                    <img src={subItem.icon} alt={subItem.title} />
                  </span> */}
                  {subItem.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className={isOpen ? "d-flex" : "d-flex w-100"}>
          <NavLink
            onClick={toggle}
            to={item.path}
            className={`
              sidebar-item ${
                childPaths?.includes(location.pathname.split("/")[1])
                  ? "active pe-none"
                  : ""
              }`}
          >
            <span>
              <img src={item.icon} alt={item.title} />
            </span>
            <div>{item.title}</div>
          </NavLink>
        </div>
      )}
    </li>
  );
}
type MenuItemProps = {
  item: {
    path: string;
    icon: string;
    title: string;
    children?: Array<{
      path: string;
      icon: string;
      title: string;
    }>;
  };
  isMenuOpen: boolean;
  activeSubMenu: string | null;
  toggleSubMenu: (path: string | null) => void;
};

export default MenuItem;
