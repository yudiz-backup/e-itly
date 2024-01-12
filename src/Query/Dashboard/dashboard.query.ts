import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

export async function getDashboard(dashboardFilter) {
    let url = `${api.itinerary_module.itinerary}/total`
    if (dashboardFilter?.startDate) {
        url += `/?startDate=${dashboardFilter?.startDate}`
    }
    if (dashboardFilter?.endDate) {
        url += `&endDate=${dashboardFilter?.endDate}`
    }
    if (dashboardFilter?.type) {
        url += `&type=${dashboardFilter?.type}`
    }
    try {
        const response = await appClient.get(url);
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}

// fetch notification
export async function getNotification() {
    const url = `${api.dashboard_module.notification}`
    try {
        const response = await appClient.get(url);
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}

// update Notification Status
export async function updateNotificationStatus({ notificationId }: {

    notificationId: string
}): Promise<AsyncResponseType> {
    const url = `${api.dashboard_module.changeNotificationStatus}/${notificationId}`;
    try {
        const response = await appClient.put(url);
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}

export async function getYearList() {
    const url = `${api.itinerary_module.years}`
    
    try {
        const response = await appClient.get(url);
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}
