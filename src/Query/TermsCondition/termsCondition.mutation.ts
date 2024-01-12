import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

type RowData = {
    title: string;
    description: string;
    isActive: boolean;
}

// add TermsCondition
export async function addTermsCondition(
    termsConditionData: RowData
): Promise<AsyncResponseType> {
    const url = `${api.terms_condition_module.term_conditions}`;
    const response = await appClient.post(url, termsConditionData);
    return response.data;
}

// update TermsCondition
export async function updateTermsCondition({ termsConditionData, id }: {
    termsConditionData: RowData,
    id: string
}): Promise<AsyncResponseType> {
    const url = `${api.terms_condition_module.term_conditions}/${id}`;
    const response = await appClient.put(url, termsConditionData);
    return response.data;
}

// delete TermsCondition
export async function deleteTermsCondition(id: string): Promise<AsyncResponseType> {
    const url = `${api.terms_condition_module.term_conditions}/${id}`;
    const response = await appClient.delete(url);
    return response.data;
}

// update TermsCondition status
export async function updateTermsConditionStatus({ isActive, blockId }: {
    isActive: boolean,
    blockId: string
}): Promise<AsyncResponseType> {
    const url = `${api.terms_condition_module.changeTermConditionStatus}/${blockId}`;
    try {
        const response = await appClient.put(url, { isActive: isActive });
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}
