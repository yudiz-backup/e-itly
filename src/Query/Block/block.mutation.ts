import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

// add block
export async function addBlock(blockObj: FormData): Promise<AsyncResponseType> {
    const url = `${api.block_module.block}`;

    const response = await appClient.post(url, blockObj, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data
}

// update block
export async function updateBlock({
    formData,
    blockId,
}: {
    formData: FormData;
    blockId: string;
}): Promise<AsyncResponseType> {
    const url = `${api.block_module.block}/${blockId}`;
    const response = await appClient.put(url, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
}

// update block status
export async function updateBlockStatus(
    isActive: boolean,
    blockId: string
): Promise<AsyncResponseType> {
    const url = `${api.block_module.changeBlockStatus}/${blockId}`;
    try {
        const response = await appClient.put(url, { isActive: isActive });
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}

// delete block 
export async function deleteBlock(blockId: string): Promise<AsyncResponseType> {
    const url = `${api.block_module.block}/${blockId}`;
    try {
        const response = await appClient.delete(url);
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}