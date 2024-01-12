import api from "src/config/api";
import { hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

// get User Role
export async function getUserRole(): Promise<AsyncResponseType> {
    const url = `${api.user.user_role}`;

    const response = await appClient.get(url);
    return hasSuccess(response.data);
}
