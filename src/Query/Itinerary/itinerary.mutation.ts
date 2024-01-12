
import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

// add Itinerary 
export async function addItinerary(itineraryData): Promise<AsyncResponseType> {
    const url = `${api.itinerary_module.itinerary}`;

    const response = await appClient.post(url, itineraryData);
    return response.data;
}

// update Itinerary
export async function updateItinerary({ newItineraryData, itineraryId, serviceId }: {
    newItineraryData: any,
    itineraryId: string,
    serviceId?: string;
}) {
    let url = `${api.itinerary_module.itinerary}/${itineraryId}`;
    if (serviceId) {
        url += `?serviceId=${serviceId}`
    }
    const response = await appClient.put(url, newItineraryData);
    return response.data;
}

// delete Itinerary
export async function deleteItinerary(id: string): Promise<AsyncResponseType> {
    const url = `${api.itinerary_module.itinerary}/${id}`;
    const response = await appClient.delete(url);
    return (response.data);
}

export async function updateItineraryStatus({ status, blockId }: {
    status: string,
    blockId: string
}): Promise<AsyncResponseType> {
    const url = `${api.itinerary_module.changeItineraryStatus}/${blockId}`;
    try {
        const response = await appClient.put(url, { status: status });
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}

type TermsIdType = {
    id: string;
    description: string;
    title: string;
    isActive: boolean;
    dropeedId: string;
}

type TermsConditionDataType = {
    termsData: TermsIdType[];
}


export async function itineraryGenerateQuotation({ termsArray, itineraryId }: {
    termsArray: TermsConditionDataType,
    itineraryId: string
}) {
    const url = `${api.itinerary_module.generate_quotation}/${itineraryId}`;

    const response = await appClient.post(url, termsArray, {
        responseType: 'blob'
    });
    return response.data;
}

// add Export Bd  
export async function addExportBd(exportBdData): Promise<AsyncResponseType> {
    const url = `${api.itinerary_module.exportBd}`;

    const response = await appClient.post(url, exportBdData);
    return response.data;
}

// update Export Bd  
export async function updateExportBd({ exportBdData, id }): Promise<AsyncResponseType> {
    const url = `${api.itinerary_module.exportBd}/${id}`;

    const response = await appClient.put(url, exportBdData);
    return response.data;
}

// add Aves 
export async function addAves(avesData): Promise<AsyncResponseType> {
    const url = `${api.itinerary_module.aves}`;

    const response = await appClient.post(url, avesData);
    return response.data;
}

// update Aves
export async function updateAves({ avesData, id }): Promise<AsyncResponseType> {
    const url = `${api.itinerary_module.aves}/${id}`;

    const response = await appClient.put(url, avesData);
    return response.data;
}
