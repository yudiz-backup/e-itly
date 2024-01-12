import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";


// get Services 
export async function getServices(
    filterServices?: ServicesFilterType,
    pageObj?: string,
): Promise<AsyncResponseType> {
    let url = `${api.service_module.services}?search=${filterServices?.search}&limit=${filterServices?.limit}`;
    if (pageObj) {
        url += pageObj;
    }
    if (filterServices?.nextStartAfterDocId) {
        url += `&startAfterDocId=${filterServices?.nextStartAfterDocId}`;
    }
    if (filterServices?.prevEndBeforeDocId) {
        url += `&endBeforeDocId=${filterServices?.prevEndBeforeDocId}`;
    }
    if (filterServices?.filterPage) {
        url += `&page=${filterServices?.filterPage}`;
    }
    if (filterServices?.sort) {
        url += `&sort=${filterServices?.sort}&sortOrder=${filterServices?.sortOrder}`;
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

    const response = await appClient.get(url);
    return hasSuccess(response.data);
}