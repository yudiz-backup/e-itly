import api from "src/config/api";
import { appClient } from "./NetworkService";
import { hasError, hasSuccess } from "./ApiHelpers";

type RowData = {
  supplierName: string;
  email: string;
  isActive: boolean;
}

// get Supplier
export async function getSupplier(
  filterSupplier?: SupplierFilterType,
  pageObj?: string
): Promise<AsyncResponseType> {
  let url = `${api.supplier_module.supplier}?search=${filterSupplier?.search}&limit=${filterSupplier?.limit}`;
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

// get Supplier by Id
export async function getSupplierById(id: string): Promise<AsyncResponseType> {
  const url = `${api.supplier_module.supplier}/${id}`;
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// add Supplier
export async function addSupplier(
  supplierData: RowData
): Promise<AsyncResponseType> {
  const url = `${api.supplier_module.supplier}`;
  try {
    const response = await appClient.post(url, supplierData);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// update Supplier
export async function updateSupplier(
  supplierData: RowData,
  id: string
): Promise<AsyncResponseType> {
  const url = `${api.supplier_module.supplier}/${id}`;
  try {
    const response = await appClient.put(url, supplierData);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// delete Supplier
export async function deleteSupplier(id: string): Promise<AsyncResponseType> {
  const url = `${api.supplier_module.supplier}/${id}`;
  try {
    const response = await appClient.delete(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

export async function updateSupplierStatus(
  isActive: boolean,
  blockId: string
): Promise<AsyncResponseType> {
  const url = `${api.supplier_module.changeSupplierStatus}/${blockId}`;
  try {
    const response = await appClient.put(url, { isActive: isActive });
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
