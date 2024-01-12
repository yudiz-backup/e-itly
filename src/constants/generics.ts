const userRoles = {
    superAdmin: 'Super Admin',
    subAdmin: "Sub Admin",
    booker: "Booker"
}

const localStorageKey = {
    userRole: 'userRole',
    userInfo: 'userInfo',
    authToken: 'authToken',
    isAdmin: "isAdmin",
}

export const DEFAULT_DATE_FORMAT = "DD-MM-YYYY"

const cartasiData = {
    internalCostPercentage: 2.25
}

export { userRoles, localStorageKey, cartasiData }

export const ItineraryStatusCodes = {
    draft: "D",
    pendingAgentApproval: "PAA",
    partialPaid: "PP",
    fullyPaid: "FP",
    confirmed: "CNF",
    completeWithAves: "AVES"
}

export const selectItineraryStatusOptions = [
    {
        value: ItineraryStatusCodes?.draft,
        label: "Draft",
        bgColor: "rgba(223, 94, 78, 0.16)",
        color: "#D94230",
    },
    {
        value: ItineraryStatusCodes?.pendingAgentApproval,
        label: "Pending Agent Approval",
        bgColor: "rgba(236, 155, 24, 0.14)",
        color: "#CF8711",
    },
    {
        value: ItineraryStatusCodes?.partialPaid,
        label: "Partial Paid",
        bgColor: "rgba(236, 155, 24, 0.14)",
        color: "#CF8711",
    },
    {
        value: ItineraryStatusCodes?.fullyPaid,
        label: "Fully Paid",
        bgColor: "rgba(31, 168, 37, 0.14)",
        color: "#198a1e",
    },
    {
        value: ItineraryStatusCodes?.confirmed,
        label: "Confirmed",
        bgColor: "rgba(31, 168, 37, 0.14)",
        color: "#198a1e",
    },
    {
        value: ItineraryStatusCodes?.completeWithAves,
        label: "Completed with AVES",
        bgColor: "rgba(31, 168, 37, 0.14)",
        color: "#198a1e",
    },
];