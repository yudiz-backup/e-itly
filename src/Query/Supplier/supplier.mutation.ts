import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";

type RowData = {
  supplierName: string;
  email: string;
  isActive: boolean;
}


// add Supplier
export async function addSupplier(
  supplierData: RowData
): Promise<AsyncResponseType> {
  const url = `${api.supplier_module.supplier}`;
  const response = await appClient.post(url, supplierData);
  return response.data;
}

// update Supplier
export async function updateSupplier({ supplierData, id }: {
  supplierData: RowData,
  id: string
}): Promise<AsyncResponseType> {
  const url = `${api.supplier_module.supplier}/${id}`;

  const response = await appClient.put(url, supplierData);
  return response.data;
}

// delete Supplier
export async function deleteSupplier(id: string): Promise<AsyncResponseType> {
  const url = `${api.supplier_module.supplier}/${id}`;
  const response = await appClient.delete(url);
  return response.data;
}

export async function updateSupplierStatus({ isActive, blockId }: {
  isActive: boolean,
  blockId: string
}): Promise<AsyncResponseType> {
  const url = `${api.supplier_module.changeSupplierStatus}/${blockId}`;
  try {
    const response = await appClient.put(url, { isActive: isActive });
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}
