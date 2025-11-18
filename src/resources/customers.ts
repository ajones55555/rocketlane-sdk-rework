import { BaseResource, ListQuery, OperationOptions } from "./base.js";
import { Customer, CustomerInput, PaginatedResponse, Project } from "../types.js";
import { HttpClient } from "../httpClient.js";

export interface CustomerFilter {
  health?: "red" | "yellow" | "green";
  tag?: string;
  domain?: string;
  search?: string;
}

export type ListCustomersQuery = ListQuery<CustomerFilter>;

export class CustomersResource extends BaseResource<Customer, CustomerInput> {
  constructor(client: HttpClient) {
    super(client, "/customers");
  }

  override list(
    query?: ListCustomersQuery,
    options?: OperationOptions,
  ): Promise<PaginatedResponse<Customer>> {
    return this.request<PaginatedResponse<Customer>>({
      path: "",
      query,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  listProjects(
    customerId: string,
    query?: ListQuery<Record<string, unknown>>,
    options?: OperationOptions,
  ): Promise<PaginatedResponse<Project>> {
    return this.request<PaginatedResponse<Project>>({
      path: `/${customerId}/projects`,
      query,
      ...(options ?? {}),
    }).then((response) => response.data);
  }
}
