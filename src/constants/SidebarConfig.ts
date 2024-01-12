import {
  iconBlock,
  iconUsers,
  iconGlobe,
  iconCalendar,
  iconDashboard,
  iconUsersGroup,
  iconCircleUser,
  iconDishCapLine,
  iconBriefcaseBlank,
  iconCustomerService,
  iconSuitcaseRolling,
  iconTermsConditions,
} from "src/assets/images";
import { allRoutes } from "src/constants/AllRoutes";
import { Strings } from "src/resources";

export const sidebarConfig = [
  {
    path: allRoutes.dashboard,
    icon: iconDashboard,
    title: Strings.dashboard_title,
  },
  {
    path: allRoutes.itinerary,
    icon: iconSuitcaseRolling,
    title: Strings.itinerary_builder,
    children: [
      {
        path: allRoutes.itinerary,
        icon: iconSuitcaseRolling,
        title: Strings.itineraries,
      },
      {
        path: allRoutes.event,
        icon: iconCalendar,
        title: Strings.events,
      },
      {
        path: allRoutes.blocks,
        icon: iconBlock,
        title: Strings.blocks,
      },
    ],
  },

  {
    path: allRoutes.serviceType,
    icon: iconCustomerService,
    title: Strings.service_management,
    children: [
      {
        path: allRoutes.serviceType,
        icon: iconCustomerService,
        title: Strings.service_types,
      },
      {
        path: allRoutes.suppliers,
        icon: iconUsersGroup,
        title: Strings.suppliers,
      },
      {
        path: allRoutes.services,
        icon: iconDishCapLine,
        title: Strings.services,
      },
    ],
  },
  {
    path: allRoutes.agent,
    icon: iconCircleUser,
    title: Strings.agent_management,
    children: [
      {
        path: allRoutes.agency,
        icon: iconBriefcaseBlank,
        title: Strings.agencies,
      },
      {
        path: allRoutes.agent,
        icon: iconCircleUser,
        title: Strings.agents,
      },
    ],
  },
  {
    path: allRoutes.region,
    icon: iconGlobe,
    title: Strings.region_management,
  },
  {
    path: allRoutes.termsConditions,
    icon: iconTermsConditions,
    title: Strings.terms_conditions,
  },
  {
    path: allRoutes.subAdmin,
    icon: iconUsers,
    title: Strings.sub_admins,
  },
];
