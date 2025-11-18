import { BaseResource, ListQuery, OperationOptions } from "./base.js";
import { PaginatedResponse, Team, TeamInput } from "../types.js";
import { HttpClient } from "../httpClient.js";

export interface TeamFilter {
  memberId?: string;
  search?: string;
}

export type ListTeamsQuery = ListQuery<TeamFilter>;

export class TeamsResource extends BaseResource<Team, TeamInput> {
  constructor(client: HttpClient) {
    super(client, "/teams");
  }

  override list(
    query?: ListTeamsQuery,
    options?: OperationOptions,
  ): Promise<PaginatedResponse<Team>> {
    return this.request<PaginatedResponse<Team>>({
      path: "",
      query,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  addMember(teamId: string, memberId: string, options?: OperationOptions): Promise<Team> {
    return this.request<Team>({
      method: "POST",
      path: `/${teamId}/members`,
      body: { memberId },
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  removeMember(teamId: string, memberId: string, options?: OperationOptions): Promise<void> {
    return this.request<void>({
      method: "DELETE",
      path: `/${teamId}/members/${memberId}`,
      ...(options ?? {}),
    }).then(() => undefined);
  }
}
