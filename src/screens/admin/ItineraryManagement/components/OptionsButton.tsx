import React, { useState, useEffect, useRef, memo } from "react";
import { Dropdown } from "react-bootstrap";
import {
  SvgEyeFill,
  SvgPenToEdit,
  SvgTrash,
  iconThreeDots,
} from "src/assets/images";
import { VNode } from "preact";
import { Strings } from "src/resources";
import { checkUserPermission } from "src/utils/users";
import { getRecoil } from "recoil-nexus";
import { accountAtom } from "src/recoilState/account";
import { PERMISSION, PERMISSION_VALUE } from "src/constants/permissionEnum";


const OptionsButton = ({
  AVESDetailsHandler,
  handleDelete,
  handleView,
  handleEdit,
  createdBy
}: OptionsButton): VNode<any> => {
  const currentUser = getRecoil<AccountType | undefined>(accountAtom)
  const [showDropDown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const closeSelector = (e: { target: any }) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", closeSelector);

    return () => {
      window.removeEventListener("click", closeSelector);
    };
  }, []);
  return (
    <div ref={dropdownRef} className="option-btns version">
      <button
        className="dropdownToggler"
        onClick={() => setShowDropdown(!showDropDown)}
      >
        <img src={iconThreeDots} alt="threeDotsIcon" />
      </button>
      {showDropDown && (
        <div className="custom-dropdown">
          {(checkUserPermission(PERMISSION.itinerary, PERMISSION_VALUE.read) || currentUser?.emailId == createdBy) &&
            <Dropdown.Item onClick={handleView}>
              <span>
                <SvgEyeFill size="20" />
              </span>
              {Strings.itinerary_view}
            </Dropdown.Item>}
          {(checkUserPermission(PERMISSION.itinerary, PERMISSION_VALUE.update) || currentUser?.emailId == createdBy) &&
            <Dropdown.Item onClick={handleEdit}>
              <span>
                <SvgPenToEdit size="20" />
              </span>
              {Strings.itinerary_edit}
            </Dropdown.Item>
          }
          {(checkUserPermission(PERMISSION.itinerary, PERMISSION_VALUE.delete) || currentUser?.emailId == createdBy) &&
            <Dropdown.Item onClick={handleDelete}>
              <span>
                <SvgTrash size="20" />
              </span>
              {Strings.itinerary_delete_label}
            </Dropdown.Item>
          }
          <Dropdown.Item onClick={AVESDetailsHandler}>
            <span>
              <SvgPenToEdit size="20" />
            </span>
            {Strings.aves_add}
          </Dropdown.Item>
        </div>
      )}
    </div>
  );
};


type OptionsButton = {
  id: string;
  toggle: any;
  AVESDetailsHandler: any;
  handleDelete: () => void;
  handleView: () => void;
  handleEdit: () => void;
  createdBy?: string
}

export default memo(OptionsButton);
