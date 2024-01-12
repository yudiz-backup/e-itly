import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";


// get Block 
export async function getBlock(
  blocksFilter?: BlocksFilterType,
  pageObj?: string
): Promise<AsyncResponseType> {
  let url = `${api.block_module.block}?search=${blocksFilter?.search}&limit=${blocksFilter?.limit}`;
  if (pageObj) {
    url += pageObj;
  }
  if (blocksFilter?.isActive) {
    url += `&isActive=${blocksFilter?.isActive}`;
  }
  if (blocksFilter?.nextStartAfterDocId) {
    url += `&startAfterDocId=${blocksFilter?.nextStartAfterDocId}`;
  }
  if (blocksFilter?.prevEndBeforeDocId) {
    url += `&endBeforeDocId=${blocksFilter?.prevEndBeforeDocId}`;
  }
  if (blocksFilter?.filterPage) {
    url += `&page=${blocksFilter?.filterPage}`;
  }
  if (blocksFilter?.sort) {
    url += `&sort=${blocksFilter?.sort}&sortOrder=${blocksFilter?.sortOrder}`;
  }
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// get block by Id
export async function getBlockById(id: string): Promise<AsyncResponseType> {
  const url = `${api.block_module.block}/${id}`;

  const response = await appClient.get(url);
  return response?.data
}
