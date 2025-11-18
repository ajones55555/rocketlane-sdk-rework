import { BaseResource, ListQuery, OperationOptions } from "./base.js";
import { PaginatedResponse, Template, TemplateInput } from "../types.js";
import { HttpClient } from "../httpClient.js";

export interface TemplateFilter {
  category?: string;
  tag?: string;
  search?: string;
}

export type ListTemplatesQuery = ListQuery<TemplateFilter>;

export class TemplatesResource extends BaseResource<Template, TemplateInput> {
  constructor(client: HttpClient) {
    super(client, "/templates");
  }

  override list(
    query?: ListTemplatesQuery,
    options?: OperationOptions,
  ): Promise<PaginatedResponse<Template>> {
    return this.request<PaginatedResponse<Template>>({
      path: "",
      query,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  publish(templateId: string, options?: OperationOptions): Promise<Template> {
    return this.request<Template>({
      method: "POST",
      path: `/${templateId}/publish`,
      ...(options ?? {}),
    }).then((response) => response.data);
  }
}
