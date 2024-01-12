import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

// add SubAdmin
export async function addSubAdmin(
    subAdminData: FormData
): Promise<AsyncResponseType> {
    const url = `${api.sub_admin_module.sub_admin}`;

    const response = await appClient.post(url, subAdminData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data
}

// update SubAdmin
export async function updateSubAdmin({ subAdminData, id }: {
    subAdminData: FormData,
    id: string
}): Promise<AsyncResponseType> {
    const url = `${api.sub_admin_module.sub_admin}/${id}`;

    const response = await appClient.put(url, subAdminData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}


// delete SubAdmin
export async function deleteSubAdmin(id: string): Promise<AsyncResponseType> {
    const url = `${api.sub_admin_module.sub_admin}/${id}`;
    const response = await appClient.delete(url);
    return (response.data);
}

export async function updateSubAdminStatus({ isActive, blockId }: {
    isActive: boolean,
    blockId: string
}): Promise<AsyncResponseType> {
    const url = `${api.sub_admin_module.changeSubAdminStatus}/${blockId}`;
    try {
        const response = await appClient.put(url, { isActive: isActive });
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}
