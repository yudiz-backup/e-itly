export default {
  sub_admin_module: {
    sub_admin: "api/admin",
    changeSubAdminStatus: "api/admin/change-status",
  },
  auth: {
    forgot_password: "api/admin/forget-password",
    reset_password: "api/admin/reset-password",
  },
  terms_condition_module: {
    term_conditions: "api/term-condition",
    changeTermConditionStatus: "api/term-condition/change-status",
  },
  agent_module: {
    agent: "api/agent",
    changeAgentStatus: "api/agent/change-status",
  },
  agency_module: {
    agency: "api/agency",
    changeAgencyStatus: "api/agency/change-status",
  },
  region_module: {
    region: "api/region",
    ChangeRegionStatus: "api/region/change-status",
  },
  service_module: {
    services: "api/service",
    ChangeServiceStatus: "api/service/change-status",
  },
  supplier_module: {
    supplier: "api/supplier",
    changeSupplierStatus: "api/supplier/change-status",
  },
  service_type_module: {
    service_type: "api/serviceType",
    changeServiceTypeStatus: "api/serviceType/change-status",
  },
  block_module: {
    block: "api/block",
    changeBlockStatus: "api/block/change-status",
  },
  event_module: {
    event: "api/event",
    changeEventStatus: "api/event/change-status",
  },
  itinerary_module: {
    itinerary: "api/itinerary",
    years: "api/itinerary/years",
    filter: "api/itinerary/get/owner-list",
    generate_quotation: "api/itinerary/pdf",
    generate_invoice: "api/itinerary/invoice/pdf",
    itinerary_download: "api/itinerary/event/pdf",
    changeItineraryStatus: "api/itinerary/change-status",
    exportBd: "api/itinerary/export-bd",
    aves: "api/itinerary/aves",
  },
  image: {
    fetch_image_url: "api/admin/fetch-image-url",
    fetch_multiple_image_url: "api/multiple-upload?image",
  },
  message_module: {
    message: "api/message",
    message_threads: "api/message/threads"
  },
  dashboard_module: {
    notification: "api/notification",
    changeNotificationStatus: "api/notification/change-status"
  },
  user: {
    user_role: "api/admin/user-role",
  }
};