import { hasSuccess, hasError } from "../services/ApiHelpers";
import { appClient } from "../services/NetworkService";
import api from "../config/api";

export async function getBlocksList(
  blocksFilter: BlocksFilterType,
  pageObj: string
): Promise<AsyncResponseType> {
  let url = `${api.block_module.block}?limit=${blocksFilter?.limit}`;
  if (blocksFilter?.search) {
    url += `&search=${blocksFilter?.search}`;
  }
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

export async function deleteBlock(blockId: string): Promise<AsyncResponseType> {
  const url = `${api.block_module.block}/${blockId}`;
  try {
    const response = await appClient.delete(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
export async function getBlockDetail(
  blockId: string
): Promise<AsyncResponseType> {
  const url = `${api.block_module.block}/${blockId}`;
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
export async function addBlock(blockObj: FormData): Promise<AsyncResponseType> {
  const url = `${api.block_module.block}`;
  try {
    const response = await appClient.post(url, blockObj, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return hasSuccess(response?.data);
  } catch (error: any) {
    return hasError(error);
  }
}
export async function updateBlock(
  blockObj: FormData,
  blockId: string
): Promise<AsyncResponseType> {
  const url = `${api.block_module.block}/${blockId}`;
  try {
    const response = await appClient.put(url, blockObj, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

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
