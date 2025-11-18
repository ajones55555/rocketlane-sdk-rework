import { BaseResource, ListQuery, OperationOptions } from "./base.js";
import { FormResponse, FormResponseInput, PaginatedResponse } from "../types.js";
import { HttpClient } from "../httpClient.js";

export interface FormResponseFilter {
  formId?: string;
  projectId?: string;
  customerId?: string;
  submittedBy?: string;
}

export type ListFormResponsesQuery = ListQuery<FormResponseFilter>;

export class FormsResource extends BaseResource<FormResponse, FormResponseInput> {
  constructor(client: HttpClient) {
    super(client, "/forms/responses");
  }

  override list(
    query?: ListFormResponsesQuery,
    options?: OperationOptions,
  ): Promise<PaginatedResponse<FormResponse>> {
    return this.request<PaginatedResponse<FormResponse>>({
      path: "",
      query,
      ...(options ?? {}),
    }).then((response) => response.data);
  }
}
