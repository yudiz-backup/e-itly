import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";


// get Supplier
export async function getSupplier(
  filterSupplier?: SupplierFilterType,
  pageObj?: string
): Promise<AsyncResponseType> {
  let url = `${api.supplier_module.supplier}?search=${filterSupplier?.search}&limit=${filterSupplier?.limit}`;
  if (pageObj) {
    url += pageObj;
  }
  if (filterSupplier?.isActive) {
    url += `&isActive=${filterSupplier?.isActive}`;
  }
  if (filterSupplier?.nextStartAfterDocId) {
    url += `&startAfterDocId=${filterSupplier?.nextStartAfterDocId}`;
  }
  if (filterSupplier?.prevEndBeforeDocId) {
    url += `&endBeforeDocId=${filterSupplier?.prevEndBeforeDocId}`;
  }
  if (filterSupplier?.filterPage) {
    url += `&page=${filterSupplier?.filterPage}`;
  }
  if (filterSupplier?.sort) {
    url += `&sort=${filterSupplier?.sort}&sortOrder=${filterSupplier?.sortOrder}`;
  }
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// get Supplier by Id
export async function getSupplierById(id: string): Promise<AsyncResponseType> {
  const url = `${api.supplier_module.supplier}/${id}`;
  
  const response = await appClient.get(url);
  return response?.data
}
