import { BaseResource, ListQuery, OperationOptions } from "./base.js";
import { PaginatedResponse, TimeEntry, TimeEntryInput } from "../types.js";
import { HttpClient } from "../httpClient.js";

export interface TimeEntryFilter {
  projectId?: string;
  taskId?: string;
  userId?: string;
  from?: string;
  to?: string;
  billable?: boolean;
}

export type ListTimeEntriesQuery = ListQuery<TimeEntryFilter>;

export class TimeEntriesResource extends BaseResource<TimeEntry, TimeEntryInput> {
  constructor(client: HttpClient) {
    super(client, "/time-entries");
  }

  override list(
    query?: ListTimeEntriesQuery,
    options?: OperationOptions,
  ): Promise<PaginatedResponse<TimeEntry>> {
    return this.request<PaginatedResponse<TimeEntry>>({
      path: "",
      query,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  approve(entryId: string, options?: OperationOptions): Promise<TimeEntry> {
    return this.request<TimeEntry>({
      method: "POST",
      path: `/${entryId}/approve`,
      ...(options ?? {}),
    }).then((response) => response.data);
  }
}
