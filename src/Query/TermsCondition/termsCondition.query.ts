import api from "src/config/api";
import { hasError, hasSuccess } from "src/services/ApiHelpers";
import { appClient } from "src/services/NetworkService";


// get TermsCondition
export async function getTermsCondition(
  filterTermsCondition?: TermsConditionFilterType,
  pageObj?: string
): Promise<AsyncResponseType> {
  let url = `${api.terms_condition_module.term_conditions}?search=${filterTermsCondition?.search}&limit=${filterTermsCondition?.limit}`;
  if (pageObj) {
    url += pageObj;
  }
  if (filterTermsCondition?.nextStartAfterDocId) {
    url += `&startAfterDocId=${filterTermsCondition?.nextStartAfterDocId}`;
  }
  if (filterTermsCondition?.prevEndBeforeDocId) {
    url += `&endBeforeDocId=${filterTermsCondition?.prevEndBeforeDocId}`;
  }
  if (filterTermsCondition?.filterPage) {
    url += `&page=${filterTermsCondition?.filterPage}`;
  }
  if (filterTermsCondition?.sort) {
    url += `&sort=${filterTermsCondition?.sort}&sortOrder=${filterTermsCondition?.sortOrder}`;
  }
  try {
    const response = await appClient.get(url);
    return hasSuccess(response.data);
  } catch (error: any) {
    return hasError(error);
  }
}

// get TermsCondition by Id
export async function getTermsConditionById(id: string): Promise<AsyncResponseType> {
  const url = `${api.terms_condition_module.term_conditions}/${id}`;

  const response = await appClient.get(url);
  return hasSuccess(response.data);
}