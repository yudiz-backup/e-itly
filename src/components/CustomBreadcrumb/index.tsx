import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";
import { Strings } from "src/resources";
import "./custom-breadcrumb.scss";

const CustomBreadcrumb = () => {
  const location = useLocation();
  const pathNames: string[] = location.pathname
    ?.split("/")
    ?.filter((pathname) => pathname);
  function capitalizeWords(str: string) {
    return str
      ?.split("-")
      ?.map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      ?.join(" ");
  }

  const allPaths: pathObjType[] = [
    { path: "my-account", name: Strings.my_account },
    { path: "profile", name: Strings.profile },
    { path: "service-type", name: Strings.service_types },
    { path: "supplier", name: Strings.suppliers },
    { path: "services", name: Strings.services },
    { path: "view", name: `${Strings.view} ${capitalizeWords(pathNames[0])}` },
    { path: "region", name: Strings.regions },
    { path: "add", name: `${Strings.add} ${capitalizeWords(pathNames[0])}` },
    { path: "edit", name: `${Strings.edit} ${capitalizeWords(pathNames[0])}` },
    { path: "dashboard", name: Strings.dashboard },
    { path: "itinerary", name: Strings.itineraries },
    { path: "blocks", name: Strings.blocks },
    { path: "event", name: Strings.events },
    { path: "edit-block", name: Strings.edit_block },
    { path: "add-block", name: Strings.add_block },
    { path: "details-block", name: Strings.details_block },
    { path: "agency", name: Strings.agencies },
    { path: "agent", name: Strings.agents },
    { path: "sub-admin", name: Strings.sub_admins },
    { path: "terms-conditions", name: Strings.terms_and_conditions },
    { path: "faq", name: Strings.faq },
    { path: "privacy-policy", name: Strings.privacy_policy },
    { path: "terms-and-conditions", name: Strings.terms_and_conditions },
    { path: "add-service-schedule", name: Strings.service_schedule_add },
    { path: "generate-quotation-details", name: Strings.generate_quotation_details },
    { path: "message-thread", name: Strings.message_thread },
    { path: "send-message", name: Strings.send_msg },
  ];
  return (
    <Breadcrumb className="custom-breadcrumb">
      {pathNames?.map((pathname: string, index: number) => {
        const routeTo = `/${pathNames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathNames.length - 1;

        const findPathName = allPaths?.find(
          (e: pathObjType) => e?.path == pathname
        );

        const toRoute = findPathName?.path === "profile" ? "dashboard" : findPathName?.route || routeTo;

        return (
          <Breadcrumb.Item
            href=""
            active={pathNames?.length > 1 && isLast}
            data-cy={pathname}
            key={index}
          >
            {
              isLast
                ? (findPathName?.name)
                : (<NavLink to={toRoute}>
                  {findPathName?.name}
                </NavLink>)
            }

          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

type pathObjType = {
  path: string;
  name: string;
  route?: string;
}
export default CustomBreadcrumb;
