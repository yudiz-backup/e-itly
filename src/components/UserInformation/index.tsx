import React from "react";
import { Dropdown } from "react-bootstrap";
import "./user-information.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { allRoutes } from "src/constants/AllRoutes";
import {
  SvgCircleUser,
  SvgTermsConditions,
  iconLogout,
  iconPrivacyPolicy,
  iconQuestion,
  imgUser,
} from "src/assets/images";
import { toast } from "react-toastify";
import { getRecoil, setRecoil } from "recoil-nexus";
import { accountAtom } from "src/recoilState/account";
import { logout } from "src/services/AuthService";
import { removeItem } from "src/utils/storage";
import { Strings } from "src/resources";
import { localStorageKey } from "src/constants/generics";

const UserInformation = () => {
  const navigate = useNavigate();
  const account = getRecoil<AccountType | undefined>(accountAtom);

  const handleLogoutUser = async () => {
    const logoutUser = await logout();
    if (logoutUser?.success) {
      Object.keys(localStorageKey).forEach((key) => removeItem(localStorageKey[key]));
      toast.success(logoutUser?.message);
      setRecoil<AccountType | undefined>(accountAtom, undefined);
      navigate(allRoutes.login);
    }
  };

  return (
    <div className="user-info">
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          <img
            src={account?.profilePhoto ? account?.profilePhoto : imgUser}
            alt="/"
            loading="lazy"
          />
        </Dropdown.Toggle>

        <Dropdown.Menu className='custom-dropdown user-dropdown'>
          <Dropdown.Item as={NavLink} to={allRoutes.ProfileMyAccount}>
            <span>
              <SvgCircleUser />
            </span>
            {Strings.my_account}
          </Dropdown.Item>
          <Dropdown.Item as={NavLink} to={allRoutes.privacyPolicy}>
            <span>
              <img src={iconPrivacyPolicy} alt="privacyPolicyIcon" />
            </span>{" "}
            {Strings.privacy_policy}
          </Dropdown.Item>
          <Dropdown.Item as={NavLink} to={allRoutes.termsAndConditions}>
            <span>
              <SvgTermsConditions />
            </span>
            {Strings.terms_conditions_name}
          </Dropdown.Item>
          <Dropdown.Item as={NavLink} to={allRoutes.faq}>
            <span>
              <img src={iconQuestion} alt="questionMarkIcon" />
            </span>{" "}
            {Strings.faq}
          </Dropdown.Item>
          <button className="dropdown-item" onClick={handleLogoutUser}>
            <span>
              <img src={iconLogout} alt="logOutIcon" />
            </span>
            {Strings.logout}
          </button>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default UserInformation;
