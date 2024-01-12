import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";


type RowData = {
    serviceName: string,
    serviceType: string,
    supplierName: string,
    region: string,
    internalCost: string,
    externalCost: string,
    pricePerPerson: boolean,
    description: string,
    isActive: boolean
}


// add Services
export async function addServices(
    servicesData: RowData,
): Promise<AsyncResponseType> {
    const url = `${api.service_module.services}`;
    const response = await appClient.post(url, servicesData);
    return response.data;
}

// update Services
export async function updateServices({ servicesData, id }: {
    servicesData: RowData,
    id: string
}): Promise<AsyncResponseType> {
    const url = `${api.service_module.services}/${id}`;
    const response = await appClient.put(url, servicesData);
    return response.data;
}

// delete Services
export async function deleteServices(
    id: string
): Promise<AsyncResponseType> {
    const url = `${api.service_module.services}/${id}`;
    const response = await appClient.delete(url);
    return response.data;
}

// update status
export async function updateServiceStatus({ isActive, blockId }: {
    isActive: boolean,
    blockId: string
}): Promise<AsyncResponseType> {
    const url = `${api.service_module.ChangeServiceStatus}/${blockId}`;
    try {
        const response = await appClient.put(url, { isActive: isActive });
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}