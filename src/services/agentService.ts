import api from "src/config/api";
import { appClient } from "./NetworkService";
import { hasError, hasSuccess } from "./ApiHelpers";

type RowData = {
  name: string;
  email: string;
  agencyName: string;
  isActive: boolean;
}

// get Agent
export async function getAgent(
  filterAgent?: AgentFilterType,
  pageObj?: string
): Promise<AsyncResponseType> {
  let url = `${api.agent_module.agent}?search=${filterAgent?.search}&limit=${filterAgent?.limit}`;
  if (pageObj) {
    url += pageObj;
  }
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// get Agent by Id
export async function getAgentById(id: string): Promise<AsyncResponseType> {
  const url = `${api.agent_module.agent}/${id}`;
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// add Agent
export async function addAgent(agentData: RowData): Promise<AsyncResponseType> {
  const url = `${api.agent_module.agent}`;
  try {
    const response = await appClient.post(url, agentData);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// update Agent
export async function updateAgent(
  agentData: RowData,
  id: string
): Promise<AsyncResponseType> {
  const url = `${api.agent_module.agent}/${id}`;
  try {
    const response = await appClient.put(url, agentData);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// delete Agent
export async function deleteAgent(id: string): Promise<AsyncResponseType> {
  const url = `${api.agent_module.agent}/${id}`;
  try {
    const response = await appClient.delete(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
export async function updateAgentStatus(
  isActive: boolean,
  blockId: string
): Promise<AsyncResponseType> {
  const url = `${api.agent_module.changeAgentStatus}/${blockId}`;
  try {
    const response = await appClient.put(url, { isActive: isActive });
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
