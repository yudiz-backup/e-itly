import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

// get SubAdmin
export async function getSubAdmin(
    filterSubAdmin?: SubAdminFilterType,
    pageObj?: string
): Promise<AsyncResponseType> {
    let url = `${api.sub_admin_module.sub_admin}?search=${filterSubAdmin?.search}&limit=${filterSubAdmin?.limit}`;
    if (pageObj) {
        url += pageObj;
    }
    if (filterSubAdmin?.nextStartAfterDocId) {
        url += `&startAfterDocId=${filterSubAdmin?.nextStartAfterDocId}`;
    }
    if (filterSubAdmin?.prevEndBeforeDocId) {
        url += `&endBeforeDocId=${filterSubAdmin?.prevEndBeforeDocId}`;
    }
    if (filterSubAdmin?.filterPage) {
        url += `&page=${filterSubAdmin?.filterPage}`;
    }
    if (filterSubAdmin?.sort) {
        url += `&sort=${filterSubAdmin?.sort}&sortOrder=${filterSubAdmin?.sortOrder}`;
    }
    if (filterSubAdmin?.userType) {
        url += `&userType=${filterSubAdmin?.userType}`;
    }
    try {
        const response = await appClient.get(url);
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}

// get SubAdmin by Id
export async function getSubAdminById(id: string): Promise<AsyncResponseType> {
    const url = `${api.sub_admin_module.sub_admin}/${id}`;
    try {
        const response = await appClient.get(url);
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}
