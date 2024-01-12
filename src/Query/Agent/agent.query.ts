import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";


// get Agent
export async function getAgent(
    filterAgent?: AgentFilterType,
    pageObj?: string
  ): Promise<AsyncResponseType> {
    let url = `${api.agent_module.agent}?search=${filterAgent?.search}&limit=${filterAgent?.limit}`;
    if (pageObj) {
      url += pageObj;
    }
    if (filterAgent?.nextStartAfterDocId) {
        url += `&startAfterDocId=${filterAgent?.nextStartAfterDocId}`;
      }
      if (filterAgent?.prevEndBeforeDocId) {
        url += `&endBeforeDocId=${filterAgent?.prevEndBeforeDocId}`;
      }
      if (filterAgent?.filterPage) {
        url += `&page=${filterAgent?.filterPage}`;
      }
      if (filterAgent?.sort) {
        url += `&sort=${filterAgent?.sort}&sortOrder=${filterAgent?.sortOrder}`;
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
    
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  }