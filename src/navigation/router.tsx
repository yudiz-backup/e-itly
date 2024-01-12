import React from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { allRoutes } from "src/constants/AllRoutes";
import AuthLayout from "src/layouts/AuthLayout";
import UserLayout from "src/layouts/UserLayout";
import { accountAtom } from "src/recoilState/account";
import BlockManagement from "src/screens/admin/BlockManagement";
import BlocksDetails from "src/screens/admin/BlockManagement/BlockDetails";
import BlockManager from "src/screens/admin/BlockManagement/BlockManager";
import ExclusivelyDashboard from "src/screens/admin/Dashboard";
import SupplierManagement from "src/screens/admin/SupplierManagement";
import SupplierAdd from "src/screens/admin/SupplierManagement/SupplierAdd";
import ServiceTypeManagement from "src/screens/admin/ServiceTypeManagement";
import ServiceTypeAdd from "src/screens/admin/ServiceTypeManagement/ServiceTypeAdd";
import UserProfile from "src/screens/admin/UserProfile";
import UserProfileSettings from "src/screens/admin/UserProfile/UserProfileSettings";
import ForgotPassword from "src/screens/Auth/ForgotPassword";
import Login from "src/screens/Auth/Login";
import ResetPassword from "src/screens/Auth/ResetPassword";
import ServiceManagement from "src/screens/admin/ServiceManagement";
import AddNewService from "src/screens/admin/ServiceManagement/AddNewService";
import ServiceDetails from "src/screens/admin/ServiceManagement/ServiceDetails";
import RegionManagement from "src/screens/admin/RegionManagement";
import RegionAdd from "src/screens/admin/RegionManagement/RegionAdd";
import AgencyAdd from "src/screens/admin/AgencyManagement/AgencyAdd";
import AgencyManagement from "src/screens/admin/AgencyManagement";
import AgentAdd from "src/screens/admin/AgentManagement/AgentAdd";
import AgentManagement from "src/screens/admin/AgentManagement";
import EventManagement from "src/screens/admin/EventManagement";
import EventAdd from "src/screens/admin/EventManagement/EventAdd";
import EventDetails from "src/screens/admin/EventManagement/EventDetails";
import SubAdmin from "src/screens/admin/SubAdmin";
import AddSubAdmin from "src/screens/admin/SubAdmin/AddSubAdmin";
import ViewSubAdmin from "src/screens/admin/SubAdmin/ViewSubAdmin";
import ItineraryManagement from "src/screens/admin/ItineraryManagement";
import ItineraryAdd from "src/screens/admin/ItineraryManagement/ItineraryAdd";
import ItineraryDetails from "src/screens/admin/ItineraryManagement/ItineraryDetails";
import MessageThread from "src/screens/admin/ItineraryManagement/MessageThread";
import ViewItinerary from "src/screens/admin/ItineraryManagement/pages/ViewItinerary";
import ServiceBookingConfirmationDetails from "src/screens/admin/ItineraryManagement/pages/ServiceBookingConfirmationDetails";
import SendMessage from "src/screens/admin/ItineraryManagement/pages/SendMessage";
import GenerateQuotationDetails from "src/screens/admin/ItineraryManagement/pages/GenerateQuotationDetails";
import Loader from "src/components/Loader";
import { setItem } from "src/utils/storage";
import { getUser } from "src/services/UserService";
import TermsConditionsManagement from "src/screens/admin/TermsConditionsManagement";
import TermsConditionsDetails from "src/screens/admin/TermsConditionsManagement/TermsConditionsDetails";
import TermsConditionsManager from "src/screens/admin/TermsConditionsManagement/TermsConditionsManager";
import SendEmail from "src/screens/admin/ItineraryManagement/pages/SendEmail";
import ItineraryServiceSchedule from "src/screens/admin/ItineraryManagement/pages/ItineraryServiceSchedule";
import Faq from "src/screens/faq";
import TermsAndConditions from "src/screens/TermsAndConditions";
import PrivacyPolicy from "src/screens/PrivacyPolicy";
import { checkUserPermission } from "src/utils/users";
import { localStorageKey } from "src/constants/generics";
import { itineraryAppliedOwnerFilter } from "src/recoilState/itinerary/itineraryFilter";
import { PERMISSION, PERMISSION_VALUE } from "src/constants/permissionEnum";

export const Router = () => {
  const auth = getAuth();
  // const [account, setAccount] = useRecoilState<AccountType | undefined>(
  //   accountAtom
  // );
  const [, setAccount] = useRecoilState<AccountType | undefined>(
    accountAtom
  );
  const setAppliedOwnerRecoil = useSetRecoilState(itineraryAppliedOwnerFilter);
  const [currentUser, setCurrentUser] = useState<any>(
    JSON.parse(localStorage.getItem("userInfo")!)?.uId
  );
  const [isLoading, setIsLoading] = useState<boolean>(
    JSON.parse(localStorage.getItem("userInfo")!)?.uId ? true : false
  );
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      // const user1 = auth.currentUser;
      // if (user1) {
      //   sendEmailVerification(user1)
      //     .then(() => {
      //       console.log("Email verification link sent successfully.");
      //     })
      //     .catch((error) => {
      //       console.log("Error sending email verification link:", error);
      //     });
      // }
      // setIsLoading(true);
      setCurrentUser(user);
      getUserDetails(user?.email);
      return user;
    });
  }, []);

  const getUserDetails = async (uid: string) => {
    if (uid) {
      const user = await getUser(uid);
      if (user?.success) {
        const data = user?.data;
        if (data?.permission) {
          const object = JSON.parse(data?.permission).reduce((obj, item) => {
            const key = Object.keys(item)[0];
            return Object.assign(obj, { [key]: item[key] });
          }, {});
          data.permission = object;
        }
        data.docId = user?.data?.emailId ? user.data.emailId : "";
        setItem(localStorageKey.userInfo, JSON.stringify(data));
        setItem(localStorageKey.isAdmin, JSON.stringify(data?.isAdmin));
        setAccount(data);
        setAppliedOwnerRecoil([{ id: data?.id, userName: data?.name }])
        setIsLoading(false);
      }
      setIsLoading(false);
    }
  };
  return (
    <BrowserRouter>
      {isLoading && <Loader />}
      <Routes>
        {currentUser ? (
          <Route element={<UserLayout />}>
            <Route path={allRoutes.dashboard} element={<ExclusivelyDashboard />} />
            {/* User Routes */}

            <Route
              path={allRoutes.ProfileMyAccount}
              element={<UserProfile />}
            />
            <Route
              path={allRoutes.ProfileSettings}
              element={<UserProfileSettings />}
            />
            <Route path={allRoutes.blocks} element={<BlockManagement />} />
            {checkUserPermission(PERMISSION.block, PERMISSION_VALUE.create) && <Route path={allRoutes.blocksAdd} element={<BlockManager />} />}
            {checkUserPermission(PERMISSION.block, PERMISSION_VALUE.update) && <Route path={allRoutes.blocksEdit} element={<BlockManager />} />}
            {checkUserPermission(PERMISSION.block, PERMISSION_VALUE.read) && <Route path={allRoutes.blocksDetails} element={<BlocksDetails />} />}

            <Route
              path={allRoutes.suppliers}
              element={<SupplierManagement />}
            />
            {checkUserPermission(PERMISSION.supplier, PERMISSION_VALUE.create) && <Route path={allRoutes.supplierAdd} element={<SupplierAdd />} />}
            {checkUserPermission(PERMISSION.supplier, PERMISSION_VALUE.update) && <Route path={allRoutes.supplierUpdate} element={<SupplierAdd />} />}


            <Route
              path={allRoutes.serviceType}
              element={<ServiceTypeManagement />}
            />
            {checkUserPermission(PERMISSION.serviceType, PERMISSION_VALUE.create) && <Route
              path={allRoutes.serviceTypeAdd}
              element={<ServiceTypeAdd />}
            />}
            {checkUserPermission(PERMISSION.serviceType, PERMISSION_VALUE.update) && <Route
              path={allRoutes.serviceTypeUpdate}
              element={<ServiceTypeAdd />}
            />}


            <Route path={allRoutes.services} element={<ServiceManagement />} />
            {checkUserPermission(PERMISSION.services, PERMISSION_VALUE.create) && <Route path={allRoutes.servicesAdd} element={<AddNewService />} />}
            {checkUserPermission(PERMISSION.services, PERMISSION_VALUE.update) && <Route
              path={allRoutes.servicesUpdate}
              element={<AddNewService />}
            />}
            {checkUserPermission(PERMISSION.services, PERMISSION_VALUE.read) && <Route
              path={allRoutes.serviceDetails}
              element={<ServiceDetails />}
            />}


            <Route
              path="/*"
              element={<Navigate to={allRoutes.dashboard} replace />}
            />

            <Route path={allRoutes.region} element={<RegionManagement />} />
            {checkUserPermission(PERMISSION.region, PERMISSION_VALUE.create) && <Route path={allRoutes.regionAdd} element={<RegionAdd />} />}
            {checkUserPermission(PERMISSION.region, PERMISSION_VALUE.update) && <Route path={allRoutes.regionUpdate} element={<RegionAdd />} />}


            <Route path={allRoutes.agency} element={<AgencyManagement />} />
            {checkUserPermission(PERMISSION.agency, PERMISSION_VALUE.create) && <Route path={allRoutes.agencyAdd} element={<AgencyAdd />} />}
            {checkUserPermission(PERMISSION.agency, PERMISSION_VALUE.update) && <Route path={allRoutes.agencyUpdate} element={<AgencyAdd />} />}


            <Route path={allRoutes.agent} element={<AgentManagement />} />
            {checkUserPermission(PERMISSION.agent, PERMISSION_VALUE.create) && <Route path={allRoutes.agentAdd} element={<AgentAdd />} />}
            {checkUserPermission(PERMISSION.agent, PERMISSION_VALUE.update) && <Route path={allRoutes.agentUpdate} element={<AgentAdd />} />}


            <Route path={allRoutes.event} element={<EventManagement />} />
            {checkUserPermission(PERMISSION.event, PERMISSION_VALUE.create) && <Route path={allRoutes.eventAdd} element={<EventAdd />} />}
            {checkUserPermission(PERMISSION.event, PERMISSION_VALUE.update) && <Route path={allRoutes.eventEdit} element={<EventAdd />} />}
            {checkUserPermission(PERMISSION.event, PERMISSION_VALUE.read) && <Route path={allRoutes.eventDetails} element={<EventDetails />} />}


            <Route path={allRoutes.termsConditions} element={<TermsConditionsManagement />} />
            {checkUserPermission(PERMISSION.termsCondition, PERMISSION_VALUE.create) && <Route path={allRoutes.termsConditionsAdd} element={<TermsConditionsManager />} />}
            {checkUserPermission(PERMISSION.termsCondition, PERMISSION_VALUE.update) && <Route path={allRoutes.termsConditionsUpdate} element={<TermsConditionsManager />} />}
            {checkUserPermission(PERMISSION.termsCondition, PERMISSION_VALUE.read) && <Route path={allRoutes.termsConditionsView} element={<TermsConditionsDetails />} />}


            <Route path={allRoutes.subAdmin} element={<SubAdmin />} />
            {checkUserPermission(PERMISSION.subAdmin, PERMISSION_VALUE.create) && <Route path={allRoutes.subAdminAdd} element={<AddSubAdmin />} />}
            {checkUserPermission(PERMISSION.subAdmin, PERMISSION_VALUE.update) && <Route path={allRoutes.subAdminEdit} element={<AddSubAdmin />} />}
            {checkUserPermission(PERMISSION.subAdmin, PERMISSION_VALUE.read) && <Route path={allRoutes.subAdminView} element={<ViewSubAdmin />} />}


            <Route path={allRoutes.itinerary} element={<ItineraryManagement />} />
            <Route path={allRoutes.itineraryAdd} element={<ItineraryAdd />} />
            <Route path={allRoutes.itineraryEdit} element={<ItineraryAdd />} />
            <Route path={allRoutes.itineraryDetails} element={<ItineraryDetails />} />
            <Route path={allRoutes.itineraryView} element={<ViewItinerary />} />

            <Route path={allRoutes.messageThread} element={<MessageThread />} />
            <Route
              path={allRoutes.itineraryViewServiceBookingConfirmationDetails}
              element={<ServiceBookingConfirmationDetails />}
            />
            <Route
              path={allRoutes.itinerarySendMessage}
              element={<SendMessage />}
            />
            <Route
              path={allRoutes.itinerarySendEmail}
              element={<SendEmail />}
            />
            <Route
              path={allRoutes.itineraryAddServiceSchedule}
              element={<ItineraryServiceSchedule />}
            />
            <Route
              path={allRoutes.itineraryGenerateQuotationDetails}
              element={<GenerateQuotationDetails />}
            />
            <Route path={allRoutes.faq} element={<Faq />} />

            <Route path={allRoutes.privacyPolicy} element={<PrivacyPolicy />} />
            <Route
              path={allRoutes.termsAndConditions}
              element={<TermsAndConditions />}
            />
          </Route>
        ) : (
          //
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Login />} />
            <Route path={allRoutes.login} element={<Login />} />
            <Route
              path={allRoutes.forgotPassword}
              element={<ForgotPassword />}
            />
            <Route path={allRoutes.resetPassword} element={<ResetPassword />} />
            <Route path={allRoutes.error} element={<Login />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
};
