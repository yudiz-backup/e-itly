import React from "react";
import { Tab, Tabs } from "react-bootstrap";
import UserProfileSettings from "./UserProfileSettings";
import UserProfileMyAccount from "./UserProfileMyAccount";
import { Strings } from "src/resources";

const UserProfile = () => {
  return (
    <>
      <section className="user-profile">
        <div className="tabs-list">
          <Tabs defaultActiveKey="myAccount" id="profile-tabs">
            <Tab eventKey="myAccount" title={Strings.my_account}>
              <UserProfileMyAccount />
            </Tab>
            <Tab eventKey="setting" title={Strings.setting}>
              <UserProfileSettings />
            </Tab>
          </Tabs>
        </div>
      </section>
    </>
  );
};
export default UserProfile;
