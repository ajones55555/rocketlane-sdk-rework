import { BaseResource, ListQuery, OperationOptions } from "./base.js";
import { InviteInput, PaginatedResponse, User } from "../types.js";
import { HttpClient } from "../httpClient.js";

export interface UserFilter {
  role?: string;
  isActive?: boolean;
  search?: string;
}

export type ListUsersQuery = ListQuery<UserFilter>;

export class UsersResource extends BaseResource<User, InviteInput, Partial<InviteInput>> {
  constructor(client: HttpClient) {
    super(client, "/users");
  }

  override list(
    query?: ListUsersQuery,
    options?: OperationOptions,
  ): Promise<PaginatedResponse<User>> {
    return this.request<PaginatedResponse<User>>({
      path: "",
      query,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  deactivate(userId: string, options?: OperationOptions): Promise<User> {
    return this.request<User>({
      method: "POST",
      path: `/${userId}/deactivate`,
      ...(options ?? {}),
    }).then((response) => response.data);
  }

  activate(userId: string, options?: OperationOptions): Promise<User> {
    return this.request<User>({
      method: "POST",
      path: `/${userId}/activate`,
      ...(options ?? {}),
    }).then((response) => response.data);
  }
}
