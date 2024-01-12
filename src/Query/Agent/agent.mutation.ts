import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

type RowData = {
    name: string;
    email: string;
    agencyName: string;
    isActive: boolean;
}

// add Agent
export async function addAgent(
    agentData: RowData
): Promise<AsyncResponseType> {
    const url = `${api.agent_module.agent}`;
    const response = await appClient.post(url, agentData);
    return response.data;
}

// update Agent
export async function updateAgent({ agentData, id }: {
    agentData: RowData,
    id: string
}): Promise<AsyncResponseType> {
    const url = `${api.agent_module.agent}/${id}`;
    const response = await appClient.put(url, agentData);
    return response.data;
}

// delete Agent
export async function deleteAgent(id: string): Promise<AsyncResponseType> {
    const url = `${api.agent_module.agent}/${id}`;
    const response = await appClient.delete(url);
    return response.data;
}

// update Agent status
export async function updateAgentStatus({ isActive, blockId }: {
    isActive: boolean,
    blockId: string
}): Promise<AsyncResponseType> {
    const url = `${api.agent_module.changeAgentStatus}/${blockId}`;
    try {
        const response = await appClient.put(url, { isActive: isActive });
        return hasSuccess(response.data);
    } catch (error: any) {
        return hasError(error);
    }
}
