import { HttpClient, RequestOptions } from "../httpClient.js";
import { QueryParams } from "../query.js";
import { PaginationInput, PaginatedResponse, SortInput } from "../types.js";

export type ListQuery<Filter> = (PaginationInput &
  SortInput & {
    filter?: Filter;
    include?: Record<string, boolean> | string[];
    fields?: string[];
    search?: string;
  }) &
  QueryParams;

export type OperationOptions = Pick<RequestOptions, "dryRun" | "dryRunLogger">;

export abstract class BaseResource<Entity, CreateInput, UpdateInput = CreateInput> {
  protected constructor(protected readonly client: HttpClient, protected readonly basePath: string) {}

  protected request<T>(options: RequestOptions) {
    return this.client.request<T>({
      ...(options ?? {}),
      path: `${this.basePath}${options.path ?? ""}`,
    });
  }

  list(
    filter?: ListQuery<Record<string, unknown>>,
    options?: OperationOptions,
  ): Promise<PaginatedResponse<Entity>> {
    return this.request<PaginatedResponse<Entity>>({
      path: "",
      query: filter,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  retrieve(id: string, options?: OperationOptions): Promise<Entity> {
    return this.request<Entity>({
      path: `/${id}`,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  create(payload: CreateInput, options?: OperationOptions): Promise<Entity> {
    return this.request<Entity>({
      method: "POST",
      path: "",
      body: payload,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  update(id: string, payload: UpdateInput, options?: OperationOptions): Promise<Entity> {
    return this.request<Entity>({
      method: "PATCH",
      path: `/${id}`,
      body: payload,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  delete(id: string, options?: OperationOptions): Promise<void> {
    return this.request<void>({
      method: "DELETE",
      path: `/${id}`,
      ...(options ?? {}),
    }).then(() => undefined);
  }
}
