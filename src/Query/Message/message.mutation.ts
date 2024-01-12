import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

// add Message
export async function addMessage(
    messageData: FormData
): Promise<AsyncResponseType> {
    const url = `${api.message_module.message}`;
    try {
        const response = await appClient.post(url, messageData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return hasSuccess(response?.data);
    } catch (error: any) {
        return hasError(error);
    }
}