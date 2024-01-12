import api from "src/config/api";
import { appClient } from "./NetworkService";
import { hasError, hasSuccess } from "./ApiHelpers";

type RowData = {
    serviceName: string,
    serviceType: string,
    supplierName: string,
    regionName: string,
    internalCost: string,
    externalCost: string,
    pricePerPerson: boolean,
    description: string,
    isActive: boolean
}

// get Services 
export async function getServices(
    filterServices?: ServicesFilterType,
    pageObj?: string,
): Promise<AsyncResponseType> {
    let url = `${api.service_module.services}?search=${filterServices?.search}&limit=${filterServices?.limit}`;
    if (pageObj) {
        url += pageObj;
    }
    if (filterServices?.isActive) {
        url += `&isActive=${filterServices?.isActive}`
    }
    try {
        const response = await appClient.get(url);
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}

// get Services by Id
export async function getServicesById(
    id: string
): Promise<AsyncResponseType> {
    const url = `${api.service_module.services}/${id}`;
    try {
        const response = await appClient.get(url);
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}


// add Services
export async function addServices(
    servicesData: RowData,
): Promise<AsyncResponseType> {
    const url = `${api.service_module.services}`;
    try {
        const response = await appClient.post(url, servicesData);
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}

// update Services
export async function updateServices(
    servicesData: RowData,
    id: string
): Promise<AsyncResponseType> {
    const url = `${api.service_module.services}/${id}`;
    try {
        const response = await appClient.put(url, servicesData);
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}

// delete Services
export async function deleteServices(
    id: string
): Promise<AsyncResponseType> {
    const url = `${api.service_module.services}/${id}`;
    try {
        const response = await appClient.delete(url);
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}